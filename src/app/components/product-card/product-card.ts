import { Component, input, Input, model, output } from '@angular/core';
import { IProductoCarrito } from '../../product.interface';
import { EstadoStockPipe } from '../../models/estado-stock-pipe';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [EstadoStockPipe, CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})

export class ProductCard {
  id = input.required<number>()
  nombre = input.required<string>()
  precio = input.required<number>()
  imagen = input.required<string>()
  stock = input.required<number>()

  cantidad = model<number>(1)

  addToCart = output<IProductoCarrito>()

  incrementar() {
    this.cantidad.update((valorActual) => {
      return valorActual + 1
    });
  }

  reducir() {
    this.cantidad.update((valorActual) => {
      if(valorActual === 1){
        return 1;
      }
      return valorActual - 1;
    });
  }

  agregarAlCarrito() {
    this.addToCart.emit({
      id: this.id(),
      precio: this.precio(),
      nombre: this.nombre(),
      cantidad: this.cantidad(),
      imagen: this.imagen()
    });
  }
}
