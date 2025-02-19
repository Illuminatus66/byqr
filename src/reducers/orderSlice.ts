import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getordersbyuser, saveorder} from '../actions/orderActions';

interface ProductForOrderScreen {
  pr_id: string;
  name: string;
  qty: number;
  price: number;
  thumbnail: string;
}
interface Orders {
  receipt: string;
  products: ProductForOrderScreen[];
  total_amount: number;
  created_at: string;
}

interface OrdersState {
  orders: Orders[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearorders(state) {
      state.orders = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getordersbyuser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getordersbyuser.fulfilled,
        (state, action: PayloadAction<Orders[]>) => {
          state.orders = action.payload;
          state.loading = false;
          state.error = null;
        },
      )
      .addCase(getordersbyuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch orders';
      })
      .addCase(saveorder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveorder.fulfilled, (state, action: PayloadAction<Orders>) => {
        state.orders.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(saveorder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch orders';
      });
  },
});

export const {clearorders} = orderSlice.actions;

export const selectOrders = (state: {orders: OrdersState}) =>
  state.orders.orders;
export const selectOrdersLoading = (state: {orders: OrdersState}) =>
  state.orders.loading;
export const selectOrdersError = (state: {orders: OrdersState}) =>
  state.orders.error;

export default orderSlice.reducer;
