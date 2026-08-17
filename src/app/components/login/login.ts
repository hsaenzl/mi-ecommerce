import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = signal<string>('');
  password = signal<string>('');

  alEscribirEmail(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.email.set(input.value);
  }

  alEscribirPassword(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.password.set(input.value);
  }

  iniciarSesion() {
    console.log('Datos de inicio de sesión:', {
      email: this.email(),
      password: this.password(),
    });
  }
}
