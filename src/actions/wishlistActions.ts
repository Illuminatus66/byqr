/* eslint-disable prettier/prettier */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../api';
import { fetch_wishlist, add_to_wishlist, remove_from_wishlist } from '../reducers/wishlistSlice';

export const addProductToWishlist = createAsyncThunk<
  void,
  { _id: string; pr_id: string },
  { rejectValue: string }
>(
  'wishlist/addProductToWishlist',
  async ({ _id, pr_id }, { dispatch, rejectWithValue }) => {
    try {

      await addToWishlist(_id, pr_id);

      dispatch(add_to_wishlist(pr_id));
    } catch (error) {
      return rejectWithValue('Failed to add product to wishlist');
    }
  }
);

export const removeProductFromWishlist = createAsyncThunk<
  void,
  { _id: string; pr_id: string },
  { rejectValue: string }
>(
  'wishlist/removeProductFromWishlist',
  async ({ _id, pr_id }, { dispatch, rejectWithValue }) => {
    try {
      await removeFromWishlist(_id, pr_id);

      dispatch(remove_from_wishlist(pr_id));
    } catch (error) {
      return rejectWithValue('Failed to remove product from wishlist');
    }
  }
);

export const fetchUserWishlistAction = createAsyncThunk<
  void,
  { _id: string },
  { rejectValue: string }
>(
  'wishlist/fetchUserWishlist',
  async ({ _id }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetchWishlist(_id);

      dispatch(fetch_wishlist({ wishlist: response.data.wishlist }));
    } catch (error) {
      return rejectWithValue('Failed to fetch user wishlist');
    }
  }
);
