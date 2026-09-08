import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path: '', component: Home },
    {path: 'catalogo', loadComponent: () => import('./components/lista-productos/lista-productos').then(m => m.ListaProductos) },
    {path: 'producto/:id', loadComponent: () => import('./components/product-detail/product-detail').then(m => m.ProductDetail) },
    {path: 'carrito', loadComponent: () => import('./components/carrito/carrito').then(m => m.Carrito) },
    {path: 'registro', loadComponent: () => import('./components/registro/registro').then(m => m.Registro) },
    {path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login) },
    {path: 'checkout', loadComponent: () => import('./components/checkout/checkout').then(m => m.Checkout), canActivate: [authGuard] },
    {path: '**', component: NotFoundComponent}
];
