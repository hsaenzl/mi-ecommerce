export type TipoNotificacion = 'info' | 'exito' | 'error' | 'advertencia';

export interface INotificacion {
  id: number;
  mensaje: string;
  tipo: TipoNotificacion;
}

