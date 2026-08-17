import { Component, signal} from '@angular/core';
import { ListaProductos } from './components/lista-productos/lista-productos';
import { Footer } from './components/footer/footer';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';

type Vista = 'catalogo' | 'login' | 'registro';

@Component({
  selector: 'app-root',
  imports: [ListaProductos, Footer, Login, Registro],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  vistaActual = signal<Vista>('catalogo');

  cambiarVista(vista: Vista) {
    this.vistaActual.set(vista);
  }
    
}
