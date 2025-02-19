import {configureStore, combineReducers, Middleware} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import productReducer from './productSlice';
import comparisonReducer from './comparisonSlice';
import userReducer, {logout} from './userSlice';
import cartReducer, {clearcart} from './cartSlice';
import wishlistReducer, {clearwishlist} from './wishlistSlice';
import orderReducer, {clearorders} from './orderSlice';

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  user: userReducer,
  products: productReducer,
  comparison: comparisonReducer,
  orders: orderReducer,
});

// This middleware is added to check whether the token stored in
// AsyncStorage has expired. After every 24 hours, the user has to
// re-authenticate. This is a temporary fix since later on I'll be using
// jwt tokens that can be refreshed whenever the user opens the app
// within 24 hours of the previous login time.
const authMiddleware: Middleware = store => next => async action => {
  const state = store.getState();
  const token = state.user?.data?.token;

  if (token) {
    const tokenExpTime = 24 * 60 * 60 * 1000;
    const storedTime = await AsyncStorage.getItem('tokenTimestamp');

    if (storedTime && Date.now() - parseInt(storedTime, 10) > tokenExpTime) {
      store.dispatch(logout());
      store.dispatch(clearcart());
      store.dispatch(clearwishlist());
      store.dispatch(clearorders());
      AsyncStorage.removeItem('tokenTimestamp');
    }
  }

  return next(action);
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['comparison', 'user', 'wishlist', 'cart', 'orders'], // persist everything except for products
};

// Wrap the combined reducers with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;

export const persistor = persistStore(store);
