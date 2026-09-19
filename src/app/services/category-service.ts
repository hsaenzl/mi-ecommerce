import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

const CATEGORIES_URL = `${environment.supabaseUrl}/category`;

interface ApiCategoria {
    name: string;
}

@Service()
export class CategoryService {
    private http = inject(HttpClient);

    listarCategorias(): Observable<string[]> {
        return this.http.get<ApiCategoria[]>(CATEGORIES_URL).pipe(
            map((categorias) => categorias.map((c) => c.name))
        );
    }
}
