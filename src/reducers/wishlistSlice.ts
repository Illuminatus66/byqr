/* eslint-disable prettier/prettier */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchwishlist, addtowishlist, removefromwishlist } from '../actions/wishlistActions';

interface WishlistState {
  wishlist: string[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlist: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearwishlist(state) {
      state.wishlist = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchwishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchwishlist.fulfilled, (state, action: PayloadAction<{ wishlist: string[] }>) => {
        state.wishlist = action.payload.wishlist;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchwishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch wishlist';
      })

      .addCase(addtowishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addtowishlist.fulfilled, (state, action: PayloadAction<string>) => {
        state.wishlist.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addtowishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add product to wishlist';
      })

      .addCase(removefromwishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removefromwishlist.fulfilled, (state, action: PayloadAction<string>) => {
        state.wishlist = state.wishlist.filter(id => id !== action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(removefromwishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove product from wishlist';
      });
  },
});

export const {clearwishlist} = wishlistSlice.actions;

export const selectWishlist = (state: {wishlist: WishlistState}) => state.wishlist.wishlist;
export const selectWishlistLoading = (state: {wishlist: WishlistState}) => state.wishlist.loading;
export const selectWishlistError = (state: {wishlist: WishlistState}) => state.wishlist.error;

export default wishlistSlice.reducer;
