import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'https://byqr-backend-13bbf36a4c8b.herokuapp.com/',
});

API.interceptors.request.use(async req => {
  const profile = await AsyncStorage.getItem('Profile'); // Since AsyncStorage is promise based, we await its resolution
  if (profile) {
    const parsedProfile = JSON.parse(profile);
    if (parsedProfile.token) {
      req.headers.authorization = `Bearer ${parsedProfile.token}`;
    }
  }
  return req;
});

interface UserWithoutWishlist {
  _id: string;
  name: string;
  email: string;
  phno: string;
  addresses: string[];
}
interface CartProducts {
  pr_id: string;
  qty: number;
}
interface Cart {
  cart_no: string;
  products: CartProducts[];
}
interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phno: string;
}
interface SignupResponse {
  result: UserWithoutWishlist;
  token: string;
}
interface LoginRequest {
  email: string;
  password: string;
}
interface LoginResponse {
  result: UserWithoutWishlist;
  token: string;
}
interface UpdateUserRequest {
  name: string;
  email: string;
  phno: string;
}
interface UpdateUserResponse {
  result: UserWithoutWishlist;
  token: string | null; // token is returned only when the email changes so it may be null sometimes
}
interface WishlistRequest {
  pr_id: string;
  _id: string;
}
interface CartData {
  cart_no: string;
  pr_id: string;
  qty: number;
}
interface RemoveFromCartData {
  cart_no: string;
  pr_id: string;
}
interface Store {
  name: string;
  lat: number;
  long: number;
}
interface ProductsResponse {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  imgs: string[];
  description: string;
  category: string;
  stock: number;
  date_added: string;
  frameMaterial: string;
  weight: number;
  wheelSize: number;
  gearSystem: string;
  brakeType: string;
  suspension: string;
  tyreType: string;
  brand: string;
  warranty: string;
  stores: Store[];
}
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
interface OrderCreationResponse {
  status: string;
  order_id: string;
  amount: number;
  receipt: string;
  key: string;
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

export const logIn = (authData: LoginRequest) =>
  API.post<LoginResponse>('user/login', authData);

export const signUp = (authData: SignupRequest) =>
  API.post<SignupResponse>('user/signup', authData);

export const updateUser = (userData: UpdateUserRequest, _id: string) =>
  API.patch<UpdateUserResponse>(`user/update/${_id}`, userData);

export const fetchWishlist = (_id: string) =>
  API.get<{wishlist: string[]}>(`wishlist/fetch/${_id}`);

export const addToWishlist = (addData: WishlistRequest) =>
  API.post<{message: string}>('wishlist/add', addData);

export const removeFromWishlist = (removeData: WishlistRequest) =>
  API.post<{message: string}>('wishlist/remove', removeData);

export const fetchCartItems = (cart_no: string) =>
  API.get<Cart>(`cart/fetch/${cart_no}`);

export const addToCart = (cartData: CartData) =>
  API.post<{message: string}>('cart/add', cartData);

export const removeFromCart = (cartData: RemoveFromCartData) =>
  API.post<{message: string}>('cart/remove', cartData);

export const updateCartQty = (cartData: CartData) =>
  API.patch<{message: string}>('cart/updateqty', cartData);

export const emptycart = (cart_no: string) =>
  API.patch<{message: string}>(`cart/clearcart/${cart_no}`);

export const fetchAllProducts = () =>
  API.get<ProductsResponse[]>('products/fetchall');

export const createRazorpayOrder = (amount: number) =>
  API.post<OrderCreationResponse>('orders/create-razorpay-order', {amount});

export const getOrdersByUser = (user_id: string) =>
  API.get<Orders[]>(`orders/get-orders/${user_id}`);

export const saveOrderToBackendAfterVerification = (
  verificationData: VerificationRequest,
) =>
  API.post<VerificationResponse>(
    'orders/verify-payment-and-save-order',
    verificationData,
  );
