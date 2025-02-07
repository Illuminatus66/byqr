/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {logIn, signUp, updateUser} from '../api';

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
  addresses: string[];
}
interface UserWithoutWishlist {
  _id: string;
  name: string;
  email: string;
  phno: string;
  addresses: string[];
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
    console.log('Signup request data:', signupData);
    const response = await signUp(signupData);
    console.log('Signup response:', response.data);
    const {token, result: user} = response.data;
    await AsyncStorage.setItem('Profile', JSON.stringify({token, user}));
    console.log('Signup success, user and token stored in AsyncStorage');
    return {token, result: user};
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to sign up';
    console.error('Signup error:', errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const login = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  {state: AuthState; rejectValue: string}
>('user/login', async (loginData, {rejectWithValue}) => {
  try {
    console.log('Login request data:', loginData);
    const response = await logIn(loginData);
    console.log('Login response:', response.data);

    const {token, result: user} = response.data;
    await AsyncStorage.setItem('Profile', JSON.stringify({token, user}));
    console.log('Login success, user and token stored in AsyncStorage');
    return {token, result: user};
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to login';
    console.error('Login error:', errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const updateuserprofile = createAsyncThunk<
  UpdateUserResponse,
  UpdateUserRequest,
  {state: AuthState; rejectValue: string}
>('user/updateuserprofile', async (updateData, {rejectWithValue}) => {
  try {
    const {_id, ...update} = updateData;
    console.log('Update user profile request data:', update, _id);
    const response = await updateUser(update, _id);
    console.log('Update user profile response:', response.data);
    const {token, result: user} = response.data;

    if (token) {
      await AsyncStorage.setItem('Profile', JSON.stringify({token, user}));
      console.log('User profile updated, new token and user stored');
    } else {
      const profile = await AsyncStorage.getItem('Profile');
      if (profile) {
        const storedProfile = JSON.parse(profile);
        storedProfile.user = {...storedProfile.user, ...user};
        await AsyncStorage.setItem('Profile', JSON.stringify(storedProfile));
        console.log('User profile updated in AsyncStorage');
      }
    }
    return {token, result: user};
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'Failed to update user profile';
    console.error('Update user profile error:', errorMessage);
    return rejectWithValue(errorMessage);
  }
});
