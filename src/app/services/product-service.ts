import { effect, inject, Service, signal } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { IProductoTienda } from '../interfaces/product.interface';
import { catchError, of } from 'rxjs';

const PRODUCTS_URL = `${environment.supabaseUrl}/product`;

// Headers requeridos por Supabase (PostgREST) en cada petición.
const SUPABASE_HEADERS = {
    apikey: environment.supabaseKey,
    Authorization: `Bearer ${environment.supabaseKey}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
};

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
        return this.http.get<IProductoTienda[]>(PRODUCTS_URL, {
            headers: SUPABASE_HEADERS
        });
    }

    crearProducto(producto: Omit<IProductoTienda, 'id'>) {
        return this.http.post<IProductoTienda>(PRODUCTS_URL, producto, {
            headers: SUPABASE_HEADERS
        });
    }

    // Supabase no distingue PUT de PATCH; filtro PostgREST: ?id=eq.<valor>.
    actualizarProducto(id: string, producto: Partial<Omit<IProductoTienda, 'id'>>) {
        return this.http.patch<IProductoTienda>(`${PRODUCTS_URL}?id=eq.${id}`, producto, {
            headers: SUPABASE_HEADERS
        });
    }

    eliminarProducto(id: string) {
        return this.http.delete<IProductoTienda>(`${PRODUCTS_URL}?id=eq.${id}`, {
            headers: SUPABASE_HEADERS
        
    });
  }
}
