/* eslint-disable prettier/prettier */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchcartitems, addtocart, removefromcart, updatecartqty } from '../actions/cartActions';

interface CartItem {
  pr_id: string;
  qty: number;
}

interface Cart {
  cart_no: string;
  products: CartItem[];
}

interface CartState {
  cart_no: string;
  products: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart_no: '',
  products: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.cart_no = '';
      state.products = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder

      .addCase(fetchcartitems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchcartitems.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.cart_no = action.payload.cart_no;
        state.products = action.payload.products;
        state.error = null;
        state.loading = false;
      })
      .addCase(fetchcartitems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch cart items';
      })

      .addCase(addtocart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addtocart.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.products.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addtocart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add item to cart';
      })

      .addCase(removefromcart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removefromcart.fulfilled, (state, action: PayloadAction<{ pr_id: string }>) => {
        state.products = state.products.filter(product => product.pr_id !== action.payload.pr_id);
        state.loading = false;
        state.error = null;
      })
      .addCase(removefromcart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to remove item from cart';
      })

      .addCase(updatecartqty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatecartqty.fulfilled, (state, action: PayloadAction<{ pr_id: string; qty: number }>) => {
        const pr = state.products.find(product => product.pr_id === action.payload.pr_id);
        if (pr) {
          pr.qty = action.payload.qty;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updatecartqty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update cart quantity';
      });
  },
});

export const { clearCart } = cartSlice.actions;

export const selectCartProducts = (state: { cart: CartState }) => state.cart.products;
export const selectCartNo = (state: { cart: CartState }) => state.cart.cart_no;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.loading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;

export default cartSlice.reducer;
