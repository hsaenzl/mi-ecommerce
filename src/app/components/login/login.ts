import { Component, inject, output, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { IUsers } from '../../interfaces/user.interface';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  //email = signal<string>('');
  //password = signal<string>('');
  cargando = signal(false);

  irARegistro = output<void>();

  //userService = inject(UserService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  //irARegistro = output<void>();
  loginExitoso = output<void>();

  // alEscribirEmail(evento: Event) {
  //   const input = evento.target as HTMLInputElement;
  //   this.email.set(input.value);
  // }

  // alEscribirPassword(evento: Event) {
  //   const input = evento.target as HTMLInputElement;
  //   this.password.set(input.value);
  // }

  async iniciarSesion() {
    // this.cargando.set(true);

    // const emailVacio = this.email().trim() === '';
    // const passwordVacio = this.password().trim() === '';

    // console.log('Datos de inicio de sesión:', {
    //   email: this.email(),
    //   password: this.password(),
    // });

    // if (emailVacio || passwordVacio) {
    //   alert('Completa todos los campos.');
    //   return;
    // }
    
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);

    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;

    try {
      // const validacionCorrecta = await this.userService.loguear(
      //   this.email(),
      //   this.password()
      // );
      const validacionCorrecta = await this.userService.loguear(email, password);

      this.cargando.set(false);

      if (!validacionCorrecta) {
        alert('Usuario o contraseña inválidos.');
        return;
      } else {
        alert('Bienvenido al módulo de compras.');
      }

      const usuario: Omit<IUsers, 'id' | 'nombres' |'tipo_usuario'> = {
        email: this.loginForm.value.email!,
        contrasena: this.loginForm.value.password!
      }

      this.authService.login(usuario);
      this.loginExitoso.emit();
      this.router.navigate(['/checkout']);
    } catch (error) {
      this.cargando.set(false);
      console.error('Error en login:', error);
      alert('Ocurrió un error al iniciar sesión.');
    }
  }

  onClick() {
    this.irARegistro.emit();
    this.router.navigate(['/registro']);
  }
}
