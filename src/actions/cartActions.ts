/* eslint-disable prettier/prettier */
import {createAsyncThunk} from '@reduxjs/toolkit';
import {fetchCartItems, addToCart, removeFromCart, updateCartQty} from '../api';

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
  Cart,
  string,
  {state: CartState; rejectValue: string}
>('cart/fetchcartitems', async (cart_no, {rejectWithValue}) => {
  try {
    const response = await fetchCartItems(cart_no);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch cart items';
    return rejectWithValue(errorMessage);
  }
});

export const addtocart = createAsyncThunk<
  CartItem,
  CartData,
  {state: CartState; rejectValue: string}
>('cart/addtocart', async (cartData, {rejectWithValue}) => {
  try {
    await addToCart(cartData);
    return {pr_id: cartData.pr_id, qty: cartData.qty};
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to add item to cart';
    return rejectWithValue(errorMessage);
  }
});

export const removefromcart = createAsyncThunk<
  {pr_id: string},
  RemoveFromCartData,
  {state: CartState; rejectValue: string}
>('cart/removefromcart', async (cartData, {rejectWithValue}) => {
  try {
    await removeFromCart(cartData);
    return {pr_id: cartData.pr_id};
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to remove item from cart';
    return rejectWithValue(errorMessage);
  }
});

export const updatecartqty = createAsyncThunk<
  {pr_id: string; qty: number},
  CartData,
  {state: CartState; rejectValue: string}
>('cart/updatecartqty', async (cartData, {rejectWithValue}) => {
  try {
    await updateCartQty(cartData);
    return {pr_id: cartData.pr_id, qty: cartData.qty};
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update cart quantity';
    return rejectWithValue(errorMessage);
  }
});
