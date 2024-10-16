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

export const fetchwishlist = createAsyncThunk<
  FetchWishlistResponse,
  {_id: string},
  {state: WishlistState; rejectValue: string}
>('wishlist/fetchwishlist', async ({ _id }, { rejectWithValue }) => {
  try {
    const response = await fetchWishlist(_id);
    return { wishlist: response.data.wishlist };
  } catch (error : any) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch user wishlist';
    return rejectWithValue(errorMessage);
  }
});

export const addtowishlist = createAsyncThunk<
  string,
  {_id: string; pr_id: string},
  {state: WishlistState; rejectValue: string}
>('wishlist/addtowishlist', async ({ _id, pr_id }, { rejectWithValue }) => {
  try {
    await addToWishlist(_id, pr_id);
    return pr_id;
  } catch (error : any) {
    const errorMessage = error.response?.data?.message || 'Failed to add product to wishlist';
    return rejectWithValue(errorMessage);
  }
});

export const removefromwishlist = createAsyncThunk<
  string,
  {_id: string; pr_id: string},
  {state: WishlistState; rejectValue: string}
>('wishlist/removefromwishlist', async ({ _id, pr_id }, { rejectWithValue }) => {
  try {
    await removeFromWishlist(_id, pr_id);
    return pr_id;
  } catch (error : any) {
    const errorMessage = error.response?.data?.message || 'Failed to remove product from wishlist';
    return rejectWithValue(errorMessage);
  }
});
