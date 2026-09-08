import { Component, inject, signal} from '@angular/core';
import { Footer } from './components/footer/footer';
import { Login } from './components/login/login';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from './services/cart-service';

@Component({
  selector: 'app-root',
  imports: [Footer, Login, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private router = inject(Router);
  cartService = inject(CartService);

  modalLoginAbierto = signal(false);

  abrirModalLogin() {
    this.modalLoginAbierto.set(true);
  }

  cerrarModalLogin() {
    this.modalLoginAbierto.set(false);
  }

  //irARegistroDesdeModal() {
    //this.modalLoginAbierto.set(false);
    //this.router.navigate(['/registro']);
  //}
    
}
