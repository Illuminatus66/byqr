/* eslint-disable prettier/prettier */
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
  _id: string;
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
}

export const logIn = (authData: LoginRequest) =>
  API.post<LoginResponse>('user/login', authData);

export const signUp = (authData: SignupRequest) =>
  API.post<SignupResponse>('user/signup', authData);

export const updateUser = (userData: UpdateUserRequest) =>
  API.patch<UpdateUserResponse>('user/update', userData);

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

export const fetchAllProducts = () =>
  API.get<ProductsResponse[]>('products/fetchall');
