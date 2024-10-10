/* eslint-disable prettier/prettier */
import {createAsyncThunk} from '@reduxjs/toolkit';
import {fetchWishlist, addToWishlist, removeFromWishlist} from '../api';
import {
  fetch_wishlist,
  add_to_wishlist,
  remove_from_wishlist,
} from '../reducers/wishlistSlice';

export const fetchwishlist = createAsyncThunk<
  void,
  {_id: string},
  {rejectValue: string}
>('wishlist/fetch', async ({_id}, {dispatch, rejectWithValue}) => {
  try {
    const response = await fetchWishlist(_id);

    dispatch(fetch_wishlist({wishlist: response.data.wishlist}));
  } catch (error) {
    console.error('Failed to fetch wishlist:', error);
    return rejectWithValue('Failed to fetch user wishlist');
  }
});

export const addtowishlist = createAsyncThunk<
  void,
  {_id: string; pr_id: string},
  {rejectValue: string}
>(
  'wishlist/add',
  async ({_id, pr_id}, {dispatch, rejectWithValue}) => {
    try {
      await addToWishlist(_id, pr_id);

      dispatch(add_to_wishlist(pr_id));
    } catch (error) {
      console.error('Failed to add product to wishlist:', error);
      return rejectWithValue('Failed to add product to wishlist');
    }
  },
);

export const removefromwishlist = createAsyncThunk<
  void,
  {_id: string; pr_id: string},
  {rejectValue: string}
>(
  'wishlist/remove',
  async ({_id, pr_id}, {dispatch, rejectWithValue}) => {
    try {
      await removeFromWishlist(_id, pr_id);

      dispatch(remove_from_wishlist(pr_id));
    } catch (error) {
      console.error('Failed to remove product from wishlist:', error);
      return rejectWithValue('Failed to remove product from wishlist');
    }
  },
);
