import { Component} from '@angular/core';
import { ListaProductos } from './components/lista-productos/lista-productos';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [ListaProductos, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
	
    
}
