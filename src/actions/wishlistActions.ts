import {createAsyncThunk} from '@reduxjs/toolkit';
import {fetchWishlist, addToWishlist, removeFromWishlist} from '../api';

interface WishlistRequest {
  pr_id: string;
  _id: string;
}

export const fetchwishlist = createAsyncThunk<
  string[],
  string,
  {rejectValue: string}
>('wishlist/fetchwishlist', async (_id, {rejectWithValue}) => {
  try {
    const response = await fetchWishlist(_id);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to fetch user wishlist';
    return rejectWithValue(errorMessage);
  }
});

export const addtowishlist = createAsyncThunk<
  string,
  WishlistRequest,
  {rejectValue: string}
>('wishlist/addtowishlist', async (addData, {rejectWithValue}) => {
  try {
    await addToWishlist(addData);
    return addData.pr_id;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to add product to wishlist';
    return rejectWithValue(errorMessage);
  }
});

export const removefromwishlist = createAsyncThunk<
  string,
  WishlistRequest,
  {rejectValue: string}
>('wishlist/removefromwishlist', async (removeData, {rejectWithValue}) => {
  try {
    await removeFromWishlist(removeData);
    return removeData.pr_id;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to remove product from wishlist';
    return rejectWithValue(errorMessage);
  }
});
