/* eslint-disable prettier/prettier */
import {createAsyncThunk} from '@reduxjs/toolkit';
import {RootState} from '../reducers/store';
import {fetchAllProducts} from '../api';

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

export const fetchallproducts = createAsyncThunk<
  Product[],
  void,
  {state: RootState}
>('products/fetchAll', async (_, {rejectWithValue}) => {
  try {
    const response = await fetchAllProducts();
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch products');
  }
});
