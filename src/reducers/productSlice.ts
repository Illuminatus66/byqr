/* eslint-disable prettier/prettier */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
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
  frameMaterial: string;
  weight: number;
  wheelSize: number;
  gearSystem: string;
  brakeType: string;
  suspension: string;
  tyreType: string;
  brand: string;
  warranty: string;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchallproducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchallproducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.products = action.payload;
          state.loading = false;
          state.error = null;
        },
      )
      .addCase(fetchallproducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      });
  },
});

export const selectProducts = (state: {products: ProductsState}) =>
  state.products.products;
export const selectProductsLoading = (state: {products: ProductsState}) =>
  state.products.loading;
export const selectProductsError = (state: {products: ProductsState}) =>
  state.products.error;

export default productSlice.reducer;
