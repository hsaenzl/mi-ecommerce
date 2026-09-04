import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  productService = inject(ProductService);
  
  destacados = computed(() => this.productService.productos().slice(0, 4));
}
