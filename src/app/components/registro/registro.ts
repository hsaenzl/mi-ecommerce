import { Component, model, signal } from '@angular/core';

@Component({
  selector: 'app-registro',
  imports: [],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  nombre = model<string>('');
  email = model<string>('');
  password = model<string>('');
  confirmarPassword = model<string>('');

  nombreInvalido = signal<boolean>(false);
  emailInvalido = signal<boolean>(false);
  passwordInvalido = signal<boolean>(false);
  confirmarPasswordInvalido = signal<boolean>(false);

  alEscribirNombre(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.nombre.set(input.value);
  }

  alEscribirEmail(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.email.set(input.value);
  }

  alEscribirPassword(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.password.set(input.value);
  }

  alEscribirConfirmarPassword(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.confirmarPassword.set(input.value);
  }

  registrarse() {
    const nombreVacio = this.nombre().trim() === '';
    const emailVacio = this.email().trim() === '';
    const passwordVacio = this.password().trim() === '';
    const confirmarPasswordVacio = this.confirmarPassword().trim() === '';

    this.nombreInvalido.set(nombreVacio);
    this.emailInvalido.set(emailVacio);
    this.passwordInvalido.set(passwordVacio);
    this.confirmarPasswordInvalido.set(confirmarPasswordVacio);

    if (nombreVacio || emailVacio || passwordVacio || confirmarPasswordVacio) {
      alert('Completa todos los campos.');
      return;
    }

    if (this.password() !== this.confirmarPassword()) {
      this.passwordInvalido.set(true);
      this.confirmarPasswordInvalido.set(true);
      alert(`Las contraseñas no coinciden.`);
      return;
    }

    console.log('Datos de registro:', {
      nombre: this.nombre(),
      email: this.email(),
      password: this.password(),
      confirmarPassword: this.confirmarPassword(),
    });
  }
}
