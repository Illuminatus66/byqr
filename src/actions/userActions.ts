/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { logIn, signUp, updateUser } from '../api';

interface LoginRequest {
  email: string;
  password: string;
}
interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phno: string;
}
interface UpdateUserRequest {
  _id: string;
  name: string;
  email: string;
  phno: string;
}
interface UserWithoutWishlist {
  _id: string;
  name: string;
  email: string;
  phno: string;
}

interface SignupResponse {
  token: string;
  result: UserWithoutWishlist;
}

interface LoginResponse {
  result: UserWithoutWishlist;
  token: string;
}

interface UpdateUserResponse {
  result: UserWithoutWishlist;
  token: string | null; // token is returned only when the email changes so it may be null sometimes
}

interface AuthState {
  data: {
    token: string | null;
    user: UserWithoutWishlist | null;
  };
  loading: boolean;
  error: string | null;
}

export const signup = createAsyncThunk<
  SignupResponse,
  SignupRequest,
  {state: AuthState; rejectValue: string}
>('user/signup', async (signupData, {rejectWithValue}) => {
  try {
    const response = await signUp(signupData);
    const {token, result: user} = response.data;
    await AsyncStorage.setItem('Profile', JSON.stringify({ token, user }));
    return {token, result: user};
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to sign up';
    return rejectWithValue(errorMessage);
  }
});

export const login = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  {state: AuthState; rejectValue: string}
>('user/login', async (loginData, { rejectWithValue }) => {
  try {
    const response = await logIn(loginData);
    const {token, result: user} = response.data;
    await AsyncStorage.setItem('Profile', JSON.stringify({ token, user }));
    return {token, result: user};
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to login';
    return rejectWithValue(errorMessage);
  }
});

export const updateuserprofile = createAsyncThunk<
  UpdateUserResponse,
  UpdateUserRequest,
  {state: AuthState; rejectValue: string }
>('user/updateuserprofile', async (userData, { rejectWithValue }) => {
  try {
    const { _id, ...updateData } = userData;
    const response = await updateUser(updateData, _id);
    const { token, result: user } = response.data;

    if (token) {
      await AsyncStorage.setItem('Profile', JSON.stringify({ token, user }));
    } else {
      const profile = await AsyncStorage.getItem('Profile');
      if (profile){
        const storedProfile = JSON.parse(profile);
        storedProfile.user = { ...storedProfile.user, ...user };
        await AsyncStorage.setItem('Profile', JSON.stringify(storedProfile));
      }
    }
    return {token, result: user};
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to update user profile';
    return rejectWithValue(errorMessage);
  }
});
