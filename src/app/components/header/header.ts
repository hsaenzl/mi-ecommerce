import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  texto = signal<string>('');
  buscar = output<string>();

  alEscribir(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.texto.set(input.value);
    this.buscar.emit(this.texto());
  }

  alBuscar() {
    this.buscar.emit(this.texto());
  }

}
