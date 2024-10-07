/* eslint-disable prettier/prettier */
import { combineReducers } from 'redux';
import wishlistReducer from './wishList';
import cartReducer from './cartSlice';
import userReducer from './userSlice';
import productReducer from './productSlice';

export interface RootState {
  auth: ReturnType<typeof userReducer>;
  cart: ReturnType<typeof cartReducer>;
  wishlist: ReturnType<typeof wishlistReducer>;
  products: ReturnType<typeof productReducer>;
}

const rootReducer = combineReducers({
  auth: userReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  products: productReducer,
});

export default rootReducer;
