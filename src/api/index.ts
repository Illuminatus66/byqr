/* eslint-disable prettier/prettier */
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem('Profile')) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem('Profile')).token
    }`;
  }
  return req;
});

//User interface is inherited by SignupResponse and LoginResponse interfaces
interface User {
  _id: string;
  name: string;
  email: string;
  phno: string;
  wishlist: [string] | null;
}

// This was added because we forgot that the userUpdate server-side controller doesn't return the wishlist array
interface UserWithoutWishlist {
  _id: string;
  name: string;
  email: string;
  phno: string;
}
// CartProducts interface is inherited by Cart interface
interface CartProducts {
  pr_id: string;
  qty: number;
}
// Cart interface is inherited by SignupResponse and LoginResponse interfaces
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
  result: User;
  cart: Cart;
  token: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  result: User;
  cart: Cart;
  token: string;
}

interface UpdateUserResponse {
  result: UserWithoutWishlist;
  token: string | null; // token is returned only when the email changes so it may be null sometimes
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
  API.post<LoginResponse>('/user/login', authData);

export const signUp = (authData: SignupRequest) =>
  API.post<SignupResponse>('/user/signup', authData);

export const updateUser = (userData: { name?: string; email?: string; phno?: string }, _id: string) =>
  API.patch<UpdateUserResponse>(`/user/${_id}`, userData);

export const addToWishlist = (_id: string, pr_id: string) =>
  API.post<{ message: string }>(`/wishlist/add/${pr_id}`, { _id });

export const removeFromWishlist = (_id: string, pr_id: string) =>
  API.post<{ message: string }>(`/wishlist/remove/${pr_id}`, { _id });

export const addToCart = (cartData: CartData) =>
  API.post<{ message: string }>('/cart/add', cartData);

export const removeFromCart = (cartData: RemoveFromCartData) =>
  API.post<{ message: string }>('/cart/remove', cartData);

export const updateCartQty = (cartData: CartData) =>
  API.post<{ message: string }>('/cart/updateqty', cartData);

export const fetchAllProducts = () =>
  API.get<ProductsResponse[]>('/products/fetchall');