import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found';
import { Home } from './components/home/home';

export const routes: Routes = [
    {path: '', component: Home },
    {path: 'catalogo', loadComponent: () => import('./components/lista-productos/lista-productos').then(m => m.ListaProductos) },
    {path: 'producto/:id', loadComponent: () => import('./components/product-detail/product-detail').then(m => m.ProductDetail) },
    {path: 'carrito', loadComponent: () => import('./components/carrito/carrito').then(m => m.Carrito) },
    {path: 'registro', loadComponent: () => import('./components/registro/registro').then(m => m.Registro) },
    {path: '**', component: NotFoundComponent}
];
