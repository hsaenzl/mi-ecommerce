import { IProductoTienda } from './product.interface';

export interface IResultadoBusquedaProductos {
    data: IProductoTienda[];
    total: number;
}
