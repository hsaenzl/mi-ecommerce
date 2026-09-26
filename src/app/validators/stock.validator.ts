import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { ProductService } from '../services/product-service';

export function stockAsyncValidator(productService: ProductService, productoId: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const cantidadSolicitada = Number(control.value);

        if (!cantidadSolicitada || cantidadSolicitada <= 0) {
            return of(null);
        }

        return of(cantidadSolicitada).pipe(
            debounceTime(300),
            switchMap(() => productService.consultarStock(productoId)),
            map((disponible) =>
                cantidadSolicitada > disponible
                    ? { stockInsuficiente: { disponible, solicitado: cantidadSolicitada } }
                    : null
            ),
            catchError(() => of(null))
        );
    };
}