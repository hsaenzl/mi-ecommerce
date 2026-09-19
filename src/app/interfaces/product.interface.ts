export interface IProductoTienda {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  categorias?: string[];
}

export interface IProductoCarrito {
  id: string;
  name: string;
  price: number;
  amount: number;
  image: string;
}

export interface FilaProductoConCategorias {
  product_id: string;
  product_name: string;
  price: number;
  stock: number;
  image_url: string;
  category_names: string[] | null;
}
