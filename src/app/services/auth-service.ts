import { computed, inject, Service, signal } from '@angular/core';
import { IUsers } from '../interfaces/user.interface';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

const AUTH_URL = environment.supabaseAuthUrl;
const SESION_STORAGE_KEY = 'sb-sesion';

// Datos mínimos del usuario, ya decodificados del JWT (ver
// decodificarPayload más abajo), listos para mostrar en el header.
export interface SesionUsuario {
  email: string;
  nombre: string;
}

// Forma de la respuesta de /auth/v1/token y /auth/v1/signup de Supabase.
interface RespuestaAuthSupabase {
  access_token?: string;
  refresh_token?: string;
  user?: {
    email?: string;
    user_metadata?: Record<string, unknown>;
  };
}

interface SesionGuardada {
  accessToken: string;
  usuario: SesionUsuario;
}

@Service()
export class AuthService {
    private http = inject(HttpClient);
    private accessToken = signal<string | null>(this.leerSesionGuardada()?.accessToken ?? null);
    private usuarioActual = signal<SesionUsuario | null>(this.leerSesionGuardada()?.usuario ?? null);
    //private usuarioActual = signal<Omit<IUsers, 'id' | 'nombres' |'tipo_usuario'> | null>(null);

    isLoggedIn = computed(() => this.accessToken() !== null);
    usuario = this.usuarioActual.asReadonly();

    login(email: string, password: string): Observable<RespuestaAuthSupabase> {
        return this.http
            .post<RespuestaAuthSupabase>(`${AUTH_URL}/token?grant_type=password`, { email, password })
            .pipe(tap((respuesta) => this.guardarSesion(respuesta)));
  }

  registrarse(email: string, password: string, nombre: string): Observable<RespuestaAuthSupabase> {
    return this.http
      .post<RespuestaAuthSupabase>(`${AUTH_URL}/signup`, {
        email,
        password,
        data: { nombre, tipo_usuario: 'normal' },
      })
      .pipe(
        tap((respuesta) => {
          // Si el proyecto de Supabase tiene desactivada la confirmación
          // por correo, signup ya devuelve una sesión activa. Si la
          // confirmación está activa, no viene access_token todavía y el
          // usuario debe iniciar sesión luego de confirmar su correo.
          if (respuesta?.access_token) {
            this.guardarSesion(respuesta);
          }
        })
      );
  }
  
  logout(): Observable<void> {
    const habiaSesion = this.accessToken() !== null;
    this.limpiarSesion();

    if (!habiaSesion) {
      return of(void 0);
    }

    return this.http.post<void>(`${AUTH_URL}/logout`, {}).pipe(
      catchError(() => of(void 0)) // aunque el server rechace el logout, limpiamos igual localmente
    );
  }

  // Usado por apiKeyInterceptor para inyectar el JWT del usuario.
  getAccessToken(): string | null {
    return this.accessToken();
  }

  private guardarSesion(respuesta: RespuestaAuthSupabase): void {
    if (!respuesta?.access_token) {
      return;
    }

    const payload = this.decodificarPayload(respuesta.access_token);
    const metadata = (payload?.['user_metadata'] ?? respuesta.user?.user_metadata ?? {}) as Record<string, unknown>;

    const usuario: SesionUsuario = {
      email: (payload?.['email'] as string) ?? respuesta.user?.email ?? '',
      nombre: (metadata['nombre'] as string) ?? '',
    };

    this.accessToken.set(respuesta.access_token);
    this.usuarioActual.set(usuario);
    localStorage.setItem(
      SESION_STORAGE_KEY,
      JSON.stringify({ accessToken: respuesta.access_token, usuario } as SesionGuardada)
    );
  }

  private limpiarSesion(): void {
    this.accessToken.set(null);
    this.usuarioActual.set(null);
    localStorage.removeItem(SESION_STORAGE_KEY);
  }

  private leerSesionGuardada(): SesionGuardada | null {
    const guardado = localStorage.getItem(SESION_STORAGE_KEY);
    if (!guardado) {
      return null;
    }
    try {
      return JSON.parse(guardado) as SesionGuardada;
    } catch (err) {
      console.error('No se pudo leer la sesión guardada:', err);
      return null;
    }
  }

  private decodificarPayload(jwt: string): Record<string, unknown> | null {
    try {
      const partes = jwt.split('.');
      const payloadJson = atob(partes[1]);
      return JSON.parse(payloadJson);
    } catch (err) {
      console.error('No se pudo decodificar el JWT:', err);
      return null;
    }
  }
}
