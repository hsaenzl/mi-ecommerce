import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { IUsers } from '../../interfaces/user.interface';

@Component({
  selector: 'app-registro',
  imports: [],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  nombre = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  confirmarPassword = signal<string>('');

  nombreInvalido = signal<boolean>(false);
  emailInvalido = signal<boolean>(false);
  passwordInvalido = signal<boolean>(false);
  confirmarPasswordInvalido = signal<boolean>(false);

  cargando = signal(false);

  userServices = inject(UserService);

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

  async registrarse() {
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

    const nuevoUsuario: Omit<IUsers, 'id'> = {
      nombres: this.nombre(),
      email: this.email(),
      contrasena: this.password(),
      tipo_usuario: 'normal'
    };

    this.userServices.crearUsuario(nuevoUsuario).subscribe({
      next: (respuesta) => {
        console.log('Usuario creado:', respuesta);
        alert('Usuario creado');
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        alert('Error al crear usuario');
        this.cargando.set(false);
      }
    });
  }
}
