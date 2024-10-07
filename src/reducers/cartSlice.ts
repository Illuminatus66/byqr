/* eslint-disable prettier/prettier */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {fetchcartitems, addtocart, removefromcart, updatecartqty} from '../actions/cartActions';

interface CartItem {
  pr_id: string;
  qty: number;
}

interface CartState {
  cart_no: string;
  products: CartItem[];
}

const initialState: CartState = {
  cart_no: '',
  products: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.cart_no = '';
      state.products = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(
        fetchcartitems.fulfilled,
        (state, action: PayloadAction<CartState>) => {
          state.cart_no = action.payload.cart_no;
          state.products = action.payload.products;
        },
      )
      .addCase(
        addtocart.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          state.products.push(action.payload);
        },
      )
      .addCase(
        removefromcart.fulfilled,
        (state, action: PayloadAction<{pr_id: string}>) => {
          state.products = state.products.filter(
            product => product.pr_id !== action.payload.pr_id,
          );
        },
      )
      .addCase(
        updatecartqty.fulfilled,
        (state, action: PayloadAction<{pr_id: string; qty: number}>) => {
          const pr = state.products.find(
            product => product.pr_id === action.payload.pr_id,
          );
          if (pr) {
            pr.qty = action.payload.qty;
          }
        },
      );
  },
});

export const {clearCart} = cartSlice.actions;

export const selectCartProducts = (state: CartState) => state.products;
export const selectCartNo = (state: CartState) => state.cart_no;

export default cartSlice.reducer;
