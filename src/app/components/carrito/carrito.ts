import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-carrito',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  cartService = inject(CartService);
  private productService = inject(ProductService);
  private router = inject(Router);

  incrementar(productoId: string, cantidadActual: number) {
    const stock = this.productService.productos().find(p => p.id === productoId)?.stock ?? Infinity;
    if (cantidadActual >= stock) {
      this.cartService.mensaje.set(`Solo hay ${stock} en stock.`);
      return;
    }
    this.cartService.actualizarCantidad(productoId, cantidadActual + 1);
  }

  decrementar(productoId: string, cantidadActual: number) {
    this.cartService.actualizarCantidad(productoId, cantidadActual - 1);
  }

  eliminar(productoId: string) {
    this.cartService.eliminar(productoId);
  }

  finalizarCompra() {
    if (this.cartService.elementosCarrito().length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    // ...lógica existente del carrito
    //alert('¡Gracias por tu compra!');
    //this.cartService.vaciar();
    //this.router.navigate(['/']);
    this.router.navigate(['/checkout']);
  }
}
