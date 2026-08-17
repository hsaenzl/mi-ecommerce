import { Component, computed, Input, signal } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { IProductoCarrito, IProductoTienda } from '../../product.interface';
import { CurrencyPipe } from '@angular/common';
import { Header } from '../header/header';

@Component({
  selector: 'app-lista-productos',
  imports: [ProductCard, CurrencyPipe, Header],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css',
})
export class ListaProductos {
	textoBuscado = signal<string>('');
  	
	elementosCarrito = signal<IProductoCarrito[]>([]);
	favoritos = signal<IProductoTienda[]>([]);
	
	productos = signal<IProductoTienda[]>([
		{	id: 1,
			nombre: 'Zapatillas Climacool con Pasadores',
			imagen: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/3829d2b79d7941509635be64bdf191f0_9366/ZAPATILLAS_CLIMACOOL_CON_PASADORES_Blanco_KJ8969_01_00_standard.jpg',
			precio: 579.00,
			stock: 50
		},
		{	id: 2,
			nombre: 'Zapatillas de Running Runfalcon 5',
			imagen: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/d425476869464296a6a4e0d97c31b7e7_9366/Zapatillas_de_Running_Runfalcon_5_Negro_IH7758_HM3_hover.jpg',
			precio: 199.00,
			stock: 50
		},
		{	id: 3,
			nombre: 'Zapatillas para Caminar Cloudfoam Flex Pasadores',
			imagen: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/9200e6395be9424187da894b7658b60b_9366/Zapatillas_para_Caminar_Cloudfoam_Flex_Pasadores_Beige_KJ7278_01_00_standard.jpg',
			precio: 179.00,
			stock: 60
		},
		{	id: 4,
			nombre: 'Zapatillas Cloudfoam Flex Smart Casual',
			imagen: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/aea72b14d95c46c5a5f7b32daacccf75_9366/Zapatillas_Cloudfoam_Flex_Smart_Casual_Negro_KI4916_HM4.jpg',
			precio: 279.00,
			stock: 60
		},
		{
			id: 5,
			nombre: 'Zapatillas de Running HyperBoost Edge',
			imagen: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/53cc01fcffcd4fe1ac74f9e15eac0da9_9366/Zapatillas_de_Running_HyperBoost_Edge_Blanco_KI4392_HM1.jpg',
			precio: 759.00,
			stock: 50
		},
		{
			id: 6,
			nombre: 'Zapatillas Adizero EVO SL EXO',
			imagen: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/6dc0c0b8f405471bac8b18615543e908_9366/Zapatillas_Adizero_EVO_SL_EXO_Negro_KI4764_HM1.jpg',
			precio: 599.00,
			stock: 50
		},
		{
			id: 7,
			nombre: 'Zapatillas Superstar',
			imagen: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/5643ea9848e94c1da869fd176bd19128_9366/Zapatillas_Superstar_Blanco_IH8659_01_standard.jpg',
			precio: 359.00,
			stock: 10
		},
		{
			id: 8,
			nombre: 'Zapatillas Adistar Control 5',
			imagen: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/951820af33d64aa093a720fa19bd2531_9366/Zapatillas_Adistar_Control_5_Blanco_KI4470_HM1.jpg',
			precio: 459.00,
			stock: 10
		},
		{
			id: 9,
			nombre: 'Chimpunes de Fútbol F50 Hyperfast Elite Terreno Firme',
			imagen: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/df7ec5c4d58048dba8575ef42e5ee266_9366/Chimpunes_de_Futbol_F50_Hyperfast_Elite_Terreno_Firme_Blanco_KJ3432_HM1.jpg',
			precio: 1099,
			stock: 10
		},
		{
			id: 10,
			nombre: 'Chimpunes Predator Elite Terreno Firme',
			imagen: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/863ed9b540ce4b1a88122107876a7257_9366/Chimpunes_Predator_Elite_Terreno_Firme_Blanco_IH4699_HM1.jpg',
			precio: 1099,
			stock: 10
		}
	]);

  productosFiltrados = computed(() => {
    const texto = this.textoBuscado().toLowerCase();
    return this.productos().filter(p => p.nombre.toLowerCase().includes(texto));
  });

  manejarAgregarAlCarrito(data: IProductoCarrito) {
    const existeEnCarrito = this.elementosCarrito().find(p => p.id === data.id);

    if (existeEnCarrito) {
      alert(`El producto "${data.nombre}" ya está en el carrito.`);
      return;
    }

    const productoStock = this.productos().find(p => p.id === data.id);
    
    if (productoStock && data.cantidad > productoStock.stock) {
      let textoError = ` `;
      if (productoStock.stock === 0) {
        textoError = `No hay stock disponible.`;
      } else {
        textoError = `Solo hay ${productoStock.stock} en stock.`;
      }
      alert(`No puedes agregar ${data.cantidad} unidades de "${data.nombre}". ${textoError}`);
      return;
    }

    this.elementosCarrito.update((listaActual) => {
      return [...listaActual, data]
    });
  }

  manejarToggleFavorito(producto: IProductoTienda) {
    const index = this.favoritos().findIndex(p => p.id === producto.id);
    if (index === -1) {
		this.favoritos.update((listaActual) => {
			return [...listaActual, producto];
		});
    } else {
		this.favoritos.update((listaActual) => {
			return listaActual.filter((_, i) => i !== index);
		});
    }
  }

  esFavorito(id: number): boolean {
    return this.favoritos().some(p => p.id === id);
  }

  cantidadDeItems = computed<number>(() => {
	let cantidadTotal = 0;
    for(let index = 0; index < this.elementosCarrito().length; index++) {
      cantidadTotal += this.elementosCarrito()[index].cantidad;
    }
    return cantidadTotal;
  });

  precioTotal = computed<number>(() => {
	let precioTotal = 0;
    for(let index = 0; index < this.elementosCarrito().length; index++){
      precioTotal += (this.elementosCarrito()[index].cantidad * this.elementosCarrito()[index].precio)
    }
    return precioTotal;
  });
  
  calcularCantidadArticulos = computed<number>(() => {
	return this.elementosCarrito().length;
  });
  
  calcularCantidadArticulosMeGusta = computed<number>(() => {
	return this.favoritos().length;
  });
  
  alBuscar(texto: string) {
    this.textoBuscado.set(texto);
  }
}
