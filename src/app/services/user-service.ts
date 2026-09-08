import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { IUsers } from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';

const USERS_URL = `${environment.supabaseUrl}/users`;

// Headers requeridos por Supabase (PostgREST) en cada petición.
//const SUPABASE_HEADERS = {
//    apikey: environment.supabaseKey,
//    Authorization: `Bearer ${environment.supabaseKey}`,
//    'Content-Type': 'application/json',
//    Prefer: 'return=representation',
//};

@Service()
export class UserService {
    private http = inject(HttpClient);

    async loguear(email: string, contrasena: string) : Promise<boolean> {
        const usuarios = await this.http.get<IUsers[]>(`${USERS_URL}?email=eq.${email}`).toPromise();

        if (!usuarios || usuarios.length === 0) {
            return false; // Usuario no encontrado
        }

        const usuario = usuarios[0];

        //console.log(usuario);
        //const hashedPassword = await bcrypt.hash(contrasena, 10);
        //console.log(`"${hashedPassword}"`);

        const match = await bcrypt.compare(contrasena, usuario.contrasena);

        return match;
    }

    listarUsuarios() {
        return this.http.get<IUsers[]>(USERS_URL);
    }

    crearUsuario(usuario: Omit<IUsers, 'id'>) {
        const hashedPassword = bcrypt.hashSync(usuario.contrasena, 10);
        usuario.contrasena = hashedPassword;

        console.log(usuario);

        return this.http.post<IUsers>(USERS_URL, usuario);
    }

    actualizarProducto(id: string, usuario: Partial<Omit<IUsers, 'id'>>) {
        return this.http.patch<IUsers>(`${USERS_URL}?id=eq.${id}`, usuario);
    }
}
