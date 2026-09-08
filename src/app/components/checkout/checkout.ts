import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  cartService = inject(CartService);

  checkoutForm = this.fb.group({
    nombreCompleto: ['', Validators.required],
    direccion: ['', Validators.required],
    numeroTarjeta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
  });

  get nombreCompleto() { return this.checkoutForm.get('nombreCompleto'); }
  get direccion() { return this.checkoutForm.get('direccion'); }
  get numeroTarjeta() { return this.checkoutForm.get('numeroTarjeta'); }
  get cvv() { return this.checkoutForm.get('cvv'); }

  confirmarPedido() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (this.cartService.elementosCarrito().length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    console.log('Pedido confirmado', this.checkoutForm.value);
    alert('¡Gracias por tu compra!');
    this.cartService.vaciar();
    this.router.navigate(['/']);
  }
}


