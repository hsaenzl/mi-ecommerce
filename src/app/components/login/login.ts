import { Component, inject, output, signal } from '@angular/core';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = signal<string>('');
  password = signal<string>('');
  cargando = signal(false);

  irARegistro = output<void>();

  userService = inject(UserService);

  alEscribirEmail(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.email.set(input.value);
  }

  alEscribirPassword(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.password.set(input.value);
  }

  async iniciarSesion() {
    this.cargando.set(true);

    const emailVacio = this.email().trim() === '';
    const passwordVacio = this.password().trim() === '';

    console.log('Datos de inicio de sesión:', {
      email: this.email(),
      password: this.password(),
    });

    if (emailVacio || passwordVacio) {
      alert('Completa todos los campos.');
      return;
    }

    try {
      const validacionCorrecta = await this.userService.loguear(
        this.email(),
        this.password()
      );

      this.cargando.set(false);

      if (!validacionCorrecta) {
        alert('Usuario o contraseña inválidos.');
      } else {
        alert('Bienvenido al módulo de compras.');
      }
    } catch (error) {
      this.cargando.set(false);
      console.error('Error en login:', error);
      alert('Ocurrió un error al iniciar sesión.');
    }
  }

  onClick() {
    this.irARegistro.emit();
  }
}
