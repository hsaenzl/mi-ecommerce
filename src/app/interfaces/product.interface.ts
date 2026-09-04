export interface IProductoTienda {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export interface IProductoCarrito {
  id: string;
  name: string;
  price: number;
  amount: number;
  image: string;
}
