/* eslint-disable prettier/prettier */
import {createAsyncThunk} from '@reduxjs/toolkit';
import {fetchCartItems, addToCart, removeFromCart, updateCartQty} from '../api';

interface CartItem {
  pr_id: string;
  qty: number;
}

interface CartState {
  cart_no: string;
  products: CartItem[];
}

interface CartData {
  cart_no: string;
  pr_id: string;
  qty: number;
}

interface RemoveFromCartData {
  cart_no: string;
  pr_id: string;
}

export const fetchcartitems = createAsyncThunk<
  CartState,
  string,
  {state: CartState}
>('cart/fetchCartItems', async (cart_no, {rejectWithValue}) => {
  try {
    const response = await fetchCartItems(cart_no);
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch cart items');
  }
});

export const addtocart = createAsyncThunk<
  CartItem,
  CartData,
  {state: CartState}
>('cart/addToCart', async (cartData, {rejectWithValue}) => {
  try {
    await addToCart(cartData);
    return {pr_id: cartData.pr_id, qty: cartData.qty};
  } catch (error) {
    return rejectWithValue('Failed to add item to cart');
  }
});

export const removefromcart = createAsyncThunk<
  {pr_id: string},
  RemoveFromCartData,
  {state: CartState}
>('cart/removeFromCart', async (cartData, {rejectWithValue}) => {
  try {
    await removeFromCart(cartData);
    return {pr_id: cartData.pr_id};
  } catch (error) {
    return rejectWithValue('Failed to remove item from cart');
  }
});

export const updatecartqty = createAsyncThunk<
  {pr_id: string; qty: number},
  CartData,
  {state: CartState}
>('cart/updateCartQty', async (cartData, {rejectWithValue}) => {
  try {
    await updateCartQty(cartData);
    return {pr_id: cartData.pr_id, qty: cartData.qty};
  } catch (error) {
    return rejectWithValue('Failed to update cart quantity');
  }
});
