/* eslint-disable prettier/prettier */
import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import userReducer from './userSlice';
import productReducer from './productSlice';
import comparisonReducer from './comparisonSlice';

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  user: userReducer,
  products: productReducer,
  comparison: comparisonReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['comparison'], // Only persist the `comparison` slice
};

// Wrap the combined reducers with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;

export const persistor = persistStore(store);
