import { Component, computed, inject, signal } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { CurrencyPipe } from '@angular/common';
import { Header } from '../header/header';
import { IProductoCarrito, IProductoTienda } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product-service';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-lista-productos',
  imports: [ProductCard, CurrencyPipe, Header],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css',
})
export class ListaProductos {
	productService = inject(ProductService);
	cartService = inject(CartService);
	
	textoBuscado = signal<string>('');
  	
	favoritos = signal<IProductoTienda[]>([]);

	productosFiltrados = computed(() => {
		const texto = this.textoBuscado().toLowerCase();
		return this.productService.productos().filter(p => p.name.toLowerCase().includes(texto));
	});

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
	}
}
