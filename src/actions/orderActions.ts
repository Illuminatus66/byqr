import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  createRazorpayOrder,
  getOrdersByUser,
  saveOrderToBackendAfterVerification,
} from '../api';

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
interface VerificationRequest {
  user_id: any;
  receipt: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  products: ProductForOrderScreen[];
  total_amount: number;
  backend_order_id: string;
}
interface VerificationResponse {
  receipt: string;
  products: ProductForOrderScreen[];
  total_amount: number;
  created_at: string;
}

export const fetchcreatedorder = async (amount: number) => {
  try {
    const response = await createRazorpayOrder(amount);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to create an order ID';
    console.log(errorMessage);
    return null;
  }
};

export const getordersbyuser = createAsyncThunk<
  Orders[],
  string,
  {state: OrdersState; rejectValue: string}
>('orders/getordersbyuser', async (user_id, {rejectWithValue}) => {
  try {
    const response = await getOrdersByUser(user_id);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to fetch orders';
    return rejectWithValue(errorMessage);
  }
});

export const saveorder = createAsyncThunk<
  VerificationResponse,
  VerificationRequest,
  {state: OrdersState; rejectValue: string}
>('orders/saveorder', async (verificationData, {rejectWithValue}) => {
  try {
    const response = await saveOrderToBackendAfterVerification(
      verificationData,
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to fetch products';
    return rejectWithValue(errorMessage);
  }
});
