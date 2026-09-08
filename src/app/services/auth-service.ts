import { computed, Service, signal } from '@angular/core';
import { IUsers } from '../interfaces/user.interface';

@Service()
export class AuthService {
    private usuarioActual = signal<Omit<IUsers, 'id' | 'nombres' |'tipo_usuario'> | null>(null);

    isLoggedIn = computed(() => this.usuarioActual() !== null);
    usuario = this.usuarioActual.asReadonly();

    login(usuario: Omit<IUsers, 'id' | 'nombres' |'tipo_usuario'>) {
        this.usuarioActual.set(usuario);
    }

    logout() {
        this.usuarioActual.set(null);
    }
}
