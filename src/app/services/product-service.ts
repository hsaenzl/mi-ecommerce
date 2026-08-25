import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { IProductoTienda } from '../interfaces/product.interface';

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
