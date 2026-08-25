import { Component, input, Input, model, output } from '@angular/core';
import { EstadoStockPipe } from '../../models/estado-stock-pipe';
import { CurrencyPipe } from '@angular/common';
import { IProductoCarrito, IProductoTienda } from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-card',
  imports: [EstadoStockPipe, CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})

export class ProductCard {
  id = input.required<number>();
  name = input.required<string>();
  price = input.required<number>();
  image = input.required<string>();
  stock = input.required<number>();
  esFavorito = input<boolean>(false);

  amount = model<number>(1);

  addToCart = output<IProductoCarrito>();
  toggleFavorito = output<IProductoTienda>();

  incrementar() {
    this.amount.update((valorActual) => {
      return valorActual + 1
    });
  }

  reducir() {
    this.amount.update((valorActual) => {
      if(valorActual === 1){
        return 1;
      }
      return valorActual - 1;
    });
  }

  agregarAlCarrito() {
    this.addToCart.emit({
      id: this.id(),
      price: this.price(),
      name: this.name(),
      amount: this.amount(),
      image: this.image()
    });
  }

  alternarFavorito() {
    this.toggleFavorito.emit({
      id: this.id(),
      name: this.name(),
      price: this.price(),
      image: this.image(),
      stock: this.stock()
    });
  }
}
