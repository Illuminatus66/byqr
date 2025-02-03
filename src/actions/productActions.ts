/* eslint-disable prettier/prettier */
import {createAsyncThunk} from '@reduxjs/toolkit';
import {fetchAllProducts} from '../api';

interface Store {
  name: string;
  lat: number;
  long: number;
}
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
  frameMaterial: string;
  weight: number;
  wheelSize: number;
  gearSystem: string;
  brakeType: string;
  suspension: string;
  tyreType: string;
  brand: string;
  warranty: string;
  stores: Store[];
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export const fetchallproducts = createAsyncThunk<
  Product[],
  void,
  {state: ProductsState; rejectValue: string}
>('products/fetchallproducts', async (_, {rejectWithValue}) => {
  try {
    const response = await fetchAllProducts();
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to fetch products';
    return rejectWithValue(errorMessage);
  }
});
