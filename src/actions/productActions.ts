/* eslint-disable prettier/prettier */
interface Product {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  imgs: string[];
  description: string;
  category: string;
  stock: number;
  date_added: string;
}

export const fetchallproducts = (products: Product[]) => ({
  type: 'FETCH_ALL_PRODUCTS',
  payload: products,
});

export const setloading = () => ({
  type: 'PRODUCTS_LOADING',
});

export const seterror = (error: string) => ({
  type: 'PRODUCTS_ERROR',
  payload: error,
});
