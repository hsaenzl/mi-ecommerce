import { effect, inject, Service, signal } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { FilaProductoConCategorias, IProductoTienda } from '../interfaces/product.interface';
import { catchError, map, of } from 'rxjs';
import { IResultadoBusquedaProductos } from '../interfaces/search-product.interface';

const PRODUCTS_URL = `${environment.supabaseUrl}/product`;
const PRODUCTS_WITH_CATEGORIES_URL = `${environment.supabaseUrl}/product_with_categories`;

// Headers requeridos por Supabase (PostgREST) en cada petición.
//const SUPABASE_HEADERS = {
//    apikey: environment.supabaseKey,
//    Authorization: `Bearer ${environment.supabaseKey}`,
//    'Content-Type': 'application/json',
//    Prefer: 'return=representation',
//};

@Service()
export class ProductService {
    private http = inject(HttpClient);

    productos = signal<IProductoTienda[]>([]);
    cargando = signal(false);
    error = signal<string | null>(null);
    private trigger = signal(0);

    constructor() {
        effect(() => {
            this.trigger();

            this.cargando.set(true);
            this.error.set(null);

            this.listarProductos()
                .pipe(
                    catchError((err) => {
                        console.error('Falló la petición:', err);
                        this.error.set('No se pudieron cargar los productos.');
                        return of([] as IProductoTienda[]);
                    })
                )
                .subscribe((datos) => {
                    this.productos.set(datos);
                    this.cargando.set(false);
                });
        });
    }

    cargarProductos() {
        this.trigger.update((v) => v + 1);
    }

    listarProductos() {
        return this.http.get<IProductoTienda[]>(PRODUCTS_URL);
    }

    crearProducto(producto: Omit<IProductoTienda, 'id'>) {
        return this.http.post<IProductoTienda>(PRODUCTS_URL, producto);
    }

    // Supabase no distingue PUT de PATCH; filtro PostgREST: ?id=eq.<valor>.
    actualizarProducto(id: string, producto: Partial<Omit<IProductoTienda, 'id'>>) {
        return this.http.patch<IProductoTienda>(`${PRODUCTS_URL}?id=eq.${id}`, producto);
    }

    eliminarProducto(id: string) {
        return this.http.delete<IProductoTienda>(`${PRODUCTS_URL}?id=eq.${id}`);
    }

    consultarStock(id: string) {
        return this.http
            .get<{ stock: number }[]>(`${PRODUCTS_URL}?id=eq.${id}&select=stock`)
            .pipe(map((filas) => filas[0]?.stock ?? 0));
    }

    buscarProductos(
        texto: string,
        categoria: string,
        pagina: number,
        tamanoPagina = 9
    ) {
        const desde = (pagina - 1) * tamanoPagina;
        const hasta = desde + tamanoPagina - 1;

        return this.http
            .get<FilaProductoConCategorias[]>(PRODUCTS_WITH_CATEGORIES_URL, {
                params: this.construirFiltrosBusqueda(texto, categoria),
                headers: {
                    Range: `${desde}-${hasta}`,
                    Prefer: 'count=exact',
                },
                observe: 'response',
            })
            .pipe(
                map((respuesta) => {
                    const total = Number(
                        respuesta.headers.get('content-range')?.split('/')[1] ?? 0
                    );
                    const data = (respuesta.body ?? []).map((fila) =>
                        this.mapearProductoConCategorias(fila)
                    );
                    return { data, total } as IResultadoBusquedaProductos;
                })
            );
    }

    private construirFiltrosBusqueda(texto: string, categoria: string): Record<string, string> {
        if (!texto && !categoria) {
            return {};
        }
        return {
            product_name: `ilike.*${texto}*`,
            category_names: `cs.{${categoria}}`,
        };
    }

    private mapearProductoConCategorias(fila: FilaProductoConCategorias): IProductoTienda {
        return {
            id: fila.product_id,
            name: fila.product_name,
            price: fila.price,
            image: fila.image_url,
            stock: fila.stock,
            categorias: fila.category_names ?? [],
        };
    }
}