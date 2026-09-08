import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { IUsers } from '../../interfaces/user.interface';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

function passwordsIguales(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmar = group.get('confirmarPassword')?.value;
    return password === confirmar ? null : { passwordsNoCoinciden: true };
  };
}

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private fb = inject(FormBuilder);
  // nombre = signal<string>('');
  // email = signal<string>('');
  // password = signal<string>('');
  // confirmarPassword = signal<string>('');

  // nombreInvalido = signal<boolean>(false);
  // emailInvalido = signal<boolean>(false);
  // passwordInvalido = signal<boolean>(false);
  // confirmarPasswordInvalido = signal<boolean>(false);

  // cargando = signal(false);

  userServices = inject(UserService);

  // alEscribirNombre(evento: Event) {
  //   const input = evento.target as HTMLInputElement;
  //   this.nombre.set(input.value);
  // }

  // alEscribirEmail(evento: Event) {
  //   const input = evento.target as HTMLInputElement;
  //   this.email.set(input.value);
  // }

  // alEscribirPassword(evento: Event) {
  //   const input = evento.target as HTMLInputElement;
  //   this.password.set(input.value);
  // }

  // alEscribirConfirmarPassword(evento: Event) {
  //   const input = evento.target as HTMLInputElement;
  //   this.confirmarPassword.set(input.value);
  // }
  
  registroForm = this.fb.group(
    {
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', Validators.required],
    },
    { validators: passwordsIguales() }
  );

  get nombre() { return this.registroForm.get('nombre'); }
  get email() { return this.registroForm.get('email'); }
  get password() { return this.registroForm.get('password'); }
  get confirmarPassword() { return this.registroForm.get('confirmarPassword'); }

  async registrarse() {
    // const nombreVacio = this.nombre().trim() === '';
    // const emailVacio = this.email().trim() === '';
    // const passwordVacio = this.password().trim() === '';
    // const confirmarPasswordVacio = this.confirmarPassword().trim() === '';

    // this.nombreInvalido.set(nombreVacio);
    // this.emailInvalido.set(emailVacio);
    // this.passwordInvalido.set(passwordVacio);
    // this.confirmarPasswordInvalido.set(confirmarPasswordVacio);

    // if (nombreVacio || emailVacio || passwordVacio || confirmarPasswordVacio) {
    //   alert('Completa todos los campos.');
    //   return;
    // }

    // if (this.password() !== this.confirmarPassword()) {
    //   this.passwordInvalido.set(true);
    //   this.confirmarPasswordInvalido.set(true);
    //   alert(`Las contraseñas no coinciden.`);
    //   return;
    // }

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    // console.log('Datos de registro:', {
    //   nombre: this.nombre(),
    //   email: this.email(),
    //   password: this.password(),
    //   confirmarPassword: this.confirmarPassword(),
    // });
    console.log('Datos de registro:', {
      nombre: this.registroForm.value.nombre!,
      email: this.registroForm.value.email!,
      password: this.registroForm.value.password!,
      confirmarPassword: this.registroForm.value.confirmarPassword,
    });
    

    // const nuevoUsuario: Omit<IUsers, 'id'> = {
    //   nombres: this.nombre(),
    //   email: this.email(),
    //   contrasena: this.password(),
    //   tipo_usuario: 'normal'
    // };
    const nuevoUsuario: Omit<IUsers, 'id'> = {
      nombres: this.registroForm.value.nombre!,
      email: this.registroForm.value.email!,
      contrasena: this.registroForm.value.password!,
      tipo_usuario: 'normal',
    };

    this.userServices.crearUsuario(nuevoUsuario).subscribe({
      next: (respuesta) => {
        console.log('Usuario creado:', respuesta);
        alert('Usuario creado');
        //this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        alert('Error al crear usuario');
        //this.cargando.set(false);
      }
    });
  }
}
