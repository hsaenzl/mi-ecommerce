import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-carrito',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  cartService = inject(CartService);
  private router = inject(Router);

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
