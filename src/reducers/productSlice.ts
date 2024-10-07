/* eslint-disable prettier/prettier */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';
import {fetchallproducts} from '../actions/productActions';

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

interface ProductsState {
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
}

const initialState: ProductsState = {
  products: [],
  productsLoading: false,
  productsError: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchallproducts.pending, state => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(
        fetchallproducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.products = action.payload;
          state.productsLoading = false;
        },
      )
      .addCase(fetchallproducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload as string;
      });
  },
});

export const selectProducts = (state: RootState) => state.products.products;
export const selectProductsLoading = (state: RootState) =>
  state.products.productsLoading;
export const selectProductsError = (state: RootState) =>
  state.products.productsError;

export default productSlice.reducer;
