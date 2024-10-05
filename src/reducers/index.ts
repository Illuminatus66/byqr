/* eslint-disable prettier/prettier */
import { combineReducers } from 'redux';
import wishlistReducer from './wishList';
import cartReducer from './cart';
import authReducer from './auth';

export interface RootState {
  auth: ReturnType<typeof authReducer>;
  cart: ReturnType<typeof cartReducer>;
  wishlist: ReturnType<typeof wishlistReducer>;
}

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
});

export default rootReducer;
