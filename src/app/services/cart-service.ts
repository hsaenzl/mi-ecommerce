import { computed, inject, Service, signal } from '@angular/core';
import { ProductService } from './product-service';
import { IProductoCarrito } from '../interfaces/product.interface';

@Service()
export class CartService {
    private productService = inject(ProductService);
    
    elementosCarrito = signal<IProductoCarrito[]>([]);

    cantidadDeItems = computed<number>(() => {
        let cantidadTotal = 0;
        for (let index = 0; index < this.elementosCarrito().length; index++) {
            cantidadTotal += this.elementosCarrito()[index].amount;
        }
        return cantidadTotal;
    });

    precioTotal = computed<number>(() => {
        let precioTotal = 0;
        for (let index = 0; index < this.elementosCarrito().length; index++) {
            precioTotal += (this.elementosCarrito()[index].amount * this.elementosCarrito()[index].price);
        }
        return precioTotal;
    });

    calcularCantidadArticulos = computed<number>(() => {
        return this.elementosCarrito().length;
    });

    agregar(data: IProductoCarrito) {
        const existeEnCarrito = this.elementosCarrito().find(p => p.id === data.id);
        if (existeEnCarrito) {
            alert(`El producto "${data.name}" ya está en el carrito.`);
            return;
        }

        const productoStock = this.productService.productos().find(p => p.id === data.id);

        if (productoStock && data.amount > productoStock.stock) {
            const textoError = productoStock.stock === 0
                ? 'No hay stock disponible.'
                : `Solo hay ${productoStock.stock} en stock.`;
            alert(`No puedes agregar ${data.amount} unidades de "${data.name}". ${textoError}`);
            return;
        }

        this.elementosCarrito.update((listaActual) => [...listaActual, data]);
    }

    vaciar() {
        this.elementosCarrito.set([]);
    }
}
