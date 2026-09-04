import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoStockPipe } from '../../models/estado-stock-pipe';
import { ProductService } from '../../services/product-service';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink, EstadoStockPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  id = input.required<string>();

  productService = inject(ProductService);
  private cartService = inject(CartService);

  cantidad = signal<number>(1);

  producto = computed(() =>
    this.productService.productos().find(p => p.id === this.id())
  );

  incrementar() {
    this.cantidad.update((valorActual) => valorActual + 1);
  }

  reducir() {
    this.cantidad.update((valorActual) => (valorActual === 1 ? 1 : valorActual - 1));
  }

  agregarAlCarrito() {
    const producto = this.producto();
    
    if (!producto) {
      return;
    }

    this.cartService.agregar({
      id: producto.id,
      name: producto.name,
      price: producto.price,
      image: producto.image,
      amount: this.cantidad(),
    });
  }
}
