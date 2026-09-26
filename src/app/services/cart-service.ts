import { computed, effect, inject, Service, signal } from '@angular/core';
import { ProductService } from './product-service';
import { IProductoCarrito } from '../interfaces/product.interface';

const CARRITO_STORAGE_KEY = 'carrito';

function leerCarritoGuardado(): IProductoCarrito[] {
    const guardado = localStorage.getItem(CARRITO_STORAGE_KEY);
    if (!guardado) return [];
    try {
        return JSON.parse(guardado) as IProductoCarrito[];
    } catch (err) {
        console.error('No se pudo leer el carrito guardado:', err);
        return [];
    }
}

@Service()
export class CartService {
    private productService = inject(ProductService);
    
    elementosCarrito = signal<IProductoCarrito[]>(leerCarritoGuardado());

    mensaje = signal<string | null>(null);

    cantidadDeItems = computed<number>(() => {
        let cantidadTotal = 0;
        for (let index = 0; index < this.elementosCarrito().length; index++) {
            cantidadTotal += this.elementosCarrito()[index].amount;
        }
        return cantidadTotal;
    });

    subtotal = computed<number>(() => {
        let subtotal = 0;
        for (let index = 0; index < this.elementosCarrito().length; index++) {
            subtotal += (this.elementosCarrito()[index].amount * this.elementosCarrito()[index].price);
        }
        return subtotal;
    });

    precioTotal = this.subtotal;

    descuento = computed<number>(() => {
        const base = this.subtotal();
        return base > 200 ? base * 0.10 : 0;
    });

    total = computed<number>(() => this.subtotal() - this.descuento());

    calcularCantidadArticulos = computed<number>(() => {
        return this.elementosCarrito().length;
    });

    constructor() {
        effect(() => {
            localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(this.elementosCarrito()));
        });
    }

    agregar(data: IProductoCarrito) {
        const existeEnCarrito = this.elementosCarrito().find(p => p.id === data.id);
        if (existeEnCarrito) {
            this.mensaje.set(`El producto "${data.name}" ya está en el carrito.`);
            return;
        }

        const productoStock = this.productService.productos().find(p => p.id === data.id);

        if (productoStock && data.amount > productoStock.stock) {
            const textoError = productoStock.stock === 0
                ? 'No hay stock disponible.'
                : `Solo hay ${productoStock.stock} en stock.`;
            this.mensaje.set(`No puedes agregar ${data.amount} unidades de "${data.name}". ${textoError}`);
            return;
        }

        this.elementosCarrito.update((listaActual) => [...listaActual, data]);
    }

    // CRUD inmutable: reemplaza el array, nunca lo muta directamente.
    actualizarCantidad(id: string, cantidad: number) {
        if (cantidad <= 0) {
            this.eliminar(id);
            return;
        }

        const productoStock = this.productService.productos().find(p => p.id === id);
        if (productoStock && cantidad > productoStock.stock) {
            this.mensaje.set(`Solo hay ${productoStock.stock} en stock.`);
            return;
        }

        this.elementosCarrito.update((listaActual) =>
            listaActual.map((item) => item.id === id ? { ...item, amount: cantidad } : item)
        );
    }

    eliminar(id: string) {
        this.elementosCarrito.update((listaActual) => listaActual.filter((item) => item.id !== id));
    }

    vaciar() {
        this.elementosCarrito.set([]);
    }
}
