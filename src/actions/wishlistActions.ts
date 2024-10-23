/* eslint-disable prettier/prettier */
import {createAsyncThunk} from '@reduxjs/toolkit';
import {fetchWishlist, addToWishlist, removeFromWishlist} from '../api';

interface WishlistState {
  wishlist: string[];
  loading: boolean;
  error: string | null;
}

interface FetchWishlistResponse {
  wishlist: string[];
}
interface WishlistRequest {
  pr_id: string;
  _id: string;
}

export const fetchwishlist = createAsyncThunk<
  FetchWishlistResponse,
  string,
  {state: WishlistState; rejectValue: string}
  //fix later
>('wishlist/fetchwishlist', async (_id, {rejectWithValue}) => {
  try {
    console.log('Fetching wishlist for user:', _id);
    const response = await fetchWishlist(_id);
    console.log('Fetched wishlist:', response.data);
    return {wishlist: response.data};
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to fetch user wishlist';
      console.error('Error fetching wishlist:', errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const addtowishlist = createAsyncThunk<
  string,
  WishlistRequest,
  {state: WishlistState; rejectValue: string}
>('wishlist/addtowishlist', async (addData, {rejectWithValue}) => {
  try {
    console.log('Adding product to wishlist:', addData.pr_id);
    await addToWishlist(addData);
    console.log('Product added to wishlist:', addData.pr_id);
    return addData.pr_id;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to add product to wishlist';
      console.error('Error adding to wishlist:', errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const removefromwishlist = createAsyncThunk<
  string,
  WishlistRequest,
  {state: WishlistState; rejectValue: string}
>('wishlist/removefromwishlist', async (removeData, {rejectWithValue}) => {
  try {
    console.log('Removing product from wishlist:', removeData.pr_id);
    await removeFromWishlist(removeData);
    console.log('Product removed from wishlist:', removeData.pr_id);
    return removeData.pr_id;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to remove product from wishlist';
    return rejectWithValue(errorMessage);
  }
});
