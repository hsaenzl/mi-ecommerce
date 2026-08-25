export interface IProductoTienda {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export interface IProductoCarrito {
  id: number;
  name: string;
  price: number;
  amount: number;
  image: string;
}
