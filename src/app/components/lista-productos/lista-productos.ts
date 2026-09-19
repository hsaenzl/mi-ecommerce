import { Component, computed, inject, signal } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { CurrencyPipe } from '@angular/common';
import { Header } from '../header/header';
import { IProductoCarrito, IProductoTienda } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product-service';
import { CartService } from '../../services/cart-service';
import { IResultadoBusquedaProductos } from '../../interfaces/search-product.interface';
import { ProductCardSkeleton } from '../product-card-skeleton/product-card-skeleton';
import { CategoryService } from '../../services/category-service';
import { ActivatedRoute, Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, combineLatest, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';

const PRODUCTOS_POR_PAGINA = 9;
const RESULTADO_VACIO: IResultadoBusquedaProductos = { data: [], total: 0 };

@Component({
  selector: 'app-lista-productos',
  imports: [ProductCard, ProductCardSkeleton, Header],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css',
})
export class ListaProductos {
	productService = inject(ProductService);
	cartService = inject(CartService);
	private categoryService = inject(CategoryService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);
	
	//textoBuscado = signal<string>('');
  	
	favoritos = signal<IProductoTienda[]>([]);

	textoBuscado = signal<string>('');
	categoriaSeleccionada = signal<string>('');
	paginaActual = signal<number>(1);
	cargandoBusqueda = signal<boolean>(true);
	errorBusqueda = signal<string | null>(null);

	categorias = toSignal(this.categoryService.listarCategorias(), { initialValue: [] as string[] });

	// productosFiltrados = computed(() => {
	// 	const texto = this.textoBuscado().toLowerCase();
	// 	return this.productService.productos().filter(p => p.name.toLowerCase().includes(texto));
	// });

	constructor() {
		const params = this.route.snapshot.queryParamMap;
		this.textoBuscado.set(params.get('q') ?? '');
		this.categoriaSeleccionada.set(params.get('categoria') ?? '');
		this.paginaActual.set(Number(params.get('page')) || 1);
	}

	private textoBuscado$ = toObservable(this.textoBuscado);
	private categoria$ = toObservable(this.categoriaSeleccionada);
	private pagina$ = toObservable(this.paginaActual);

	private resultadoBusqueda = toSignal(
		combineLatest([this.textoBuscado$, this.categoria$, this.pagina$]).pipe(
			debounceTime(300),
			distinctUntilChanged(
				([textoA, categoriaA, paginaA], [textoB, categoriaB, paginaB]) =>
					textoA === textoB && categoriaA === categoriaB && paginaA === paginaB
			),
			tap(([texto, categoria, pagina]) => {
				this.cargandoBusqueda.set(true);
				this.errorBusqueda.set(null);

				// Persiste el estado de la búsqueda en la URL, sin perder
				// otros query params que pudieran coexistir.
				this.router.navigate([], {
					queryParams: { q: texto || null, categoria: categoria || null, page: pagina },
					queryParamsHandling: 'merge',
				});
			}),
			switchMap(([texto, categoria, pagina]) =>
				this.productService.buscarProductos(texto, categoria, pagina, PRODUCTOS_POR_PAGINA).pipe(
					tap(() => this.cargandoBusqueda.set(false)),
					catchError((err) => {
						console.error('Falló la búsqueda:', err);
						this.cargandoBusqueda.set(false);
						this.errorBusqueda.set('No se pudo completar la búsqueda.');
						return of(RESULTADO_VACIO);
					})
				)
			)
		),
		{ initialValue: RESULTADO_VACIO }
	);

	productos = computed(() => this.resultadoBusqueda().data);
	totalPaginas = computed(() => Math.max(1, Math.ceil(this.resultadoBusqueda().total / PRODUCTOS_POR_PAGINA)));
	totalSkeletons = Array.from({ length: PRODUCTOS_POR_PAGINA }, (_, i) => i);

	alSeleccionarCategoria(categoria: string) {
		// Un segundo click sobre la misma categoría la des-selecciona.
		this.categoriaSeleccionada.set(categoria === this.categoriaSeleccionada() ? '' : categoria);
		this.paginaActual.set(1);
	}

	irPaginaAnterior() {
		this.paginaActual.update((p) => Math.max(1, p - 1));
	}

	irPaginaSiguiente() {
		this.paginaActual.update((p) => Math.min(this.totalPaginas(), p + 1));
	}

	manejarAgregarAlCarrito(data: IProductoCarrito) {
		this.cartService.agregar(data);
	}

	manejarToggleFavorito(producto: IProductoTienda) {
		const index = this.favoritos().findIndex(p => p.id === producto.id);
		if (index === -1) {
			this.favoritos.update((listaActual) => {
				return [...listaActual, producto];
			});
		} else {
			this.favoritos.update((listaActual) => {
				return listaActual.filter((_, i) => i !== index);
			});
		}
  	}

  	esFavorito(id: string): boolean {
		return this.favoritos().some(p => p.id === id);
	}

	calcularCantidadArticulosMeGusta = computed<number>(() => {
		return this.favoritos().length;
	});

	alBuscar(texto: string) {
		this.textoBuscado.set(texto);
		this.paginaActual.set(1);
	}
}
