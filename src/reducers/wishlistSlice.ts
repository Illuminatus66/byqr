/* eslint-disable prettier/prettier */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface WishlistState {
  wishlist: string[];
}

const initialState: WishlistState = {
  wishlist: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    fetch_wishlist(state, action: PayloadAction<{wishlist: string[]}>) {
      state.wishlist = action.payload.wishlist;
    },

    add_to_wishlist(state, action: PayloadAction<string>) {
      state.wishlist = [...state.wishlist, action.payload];
    },

    remove_from_wishlist(state, action: PayloadAction<string>) {
      state.wishlist = state.wishlist.filter(id => id !== action.payload);
    },

    clear_wishlist(state) {
      state.wishlist = [];
    },
  },
});

export const {fetch_wishlist, add_to_wishlist, remove_from_wishlist, clear_wishlist} =
  wishlistSlice.actions;

export const selectWishlist = (state: {wishlist: WishlistState}) =>
  state.wishlist.wishlist;

export default wishlistSlice.reducer;
