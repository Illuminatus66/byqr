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
    console.log('Fetching cart items for cart:', cart_no);
    const response = await fetchCartItems(cart_no);
    console.log('Fetched cart items:', response.data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to fetch cart items';
    console.error('Error fetching cart items:', errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const addtocart = createAsyncThunk<
  CartItem,
  CartData,
  {state: CartState; rejectValue: string}
>('cart/addtocart', async (cartData, {rejectWithValue}) => {
  try {
    console.log('Adding product to cart:', cartData.pr_id);
    await addToCart(cartData);
    console.log('Product added to cart:', cartData.pr_id);
    return {pr_id: cartData.pr_id, qty: cartData.qty};
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to add item to cart';
    console.error('Error adding to cart:', errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const removefromcart = createAsyncThunk<
  {pr_id: string},
  RemoveFromCartData,
  {state: CartState; rejectValue: string}
>('cart/removefromcart', async (cartData, {rejectWithValue}) => {
  try {
    console.log('Removing product from cart:', cartData.pr_id);
    await removeFromCart(cartData);
    console.log('Product removed from cart:', cartData.pr_id);
    return {pr_id: cartData.pr_id};
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to remove item from cart';
    console.error('Error removing from cart:', errorMessage); 
    return rejectWithValue(errorMessage);
  }
});

export const updatecartqty = createAsyncThunk<
  {pr_id: string; qty: number},
  CartData,
  {state: CartState; rejectValue: string}
>('cart/updatecartqty', async (cartData, {rejectWithValue}) => {
  try {
    console.log('Updating cart quantity for product:', cartData.pr_id);
    await updateCartQty(cartData);
    console.log('Updating cart quantity for product:', cartData.pr_id);
    return {pr_id: cartData.pr_id, qty: cartData.qty};
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to update cart quantity';
    console.error('Error updating cart quantity:', errorMessage);
    return rejectWithValue(errorMessage);
  }
});
