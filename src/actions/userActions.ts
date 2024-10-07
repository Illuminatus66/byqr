/* eslint-disable prettier/prettier */
import {createAsyncThunk} from '@reduxjs/toolkit';
import {logIn, signUp, updateUser} from '../api';
import { auth, updateuser, logout } from '../reducers/userSlice';

interface LoginRequest {
  email: string;
  password: string;
}
interface SignupRequest {
  name: string
  email: string;
  password: string;
  phno: string
}

export const signup = createAsyncThunk<
  void,
  SignupRequest,
  {rejectValue: string}
>('user/signup', async (signupData, {dispatch, rejectWithValue}) => {
  try {
    const response = await signUp(signupData); 
    const {token, result: user} = response.data;
    dispatch(auth({token, user}));
  } catch (error) {
    return rejectWithValue('Failed to login');
  }
});

export const login = createAsyncThunk<
  void,
  LoginRequest,
  {rejectValue: string}
>('user/login', async (loginData, {dispatch, rejectWithValue}) => {
  try {
    const response = await logIn(loginData); 
    const {token, result: user} = response.data;
    dispatch(auth({token, user})); 
  } catch (error) {
    return rejectWithValue('Failed to login');
  }
});

export const updateuserprofile = createAsyncThunk<
  void,
  {name?: string; email?: string; phno?: string; _id: string},
  {rejectValue: string}
>('user/updateUserProfile', async (userData, {dispatch, rejectWithValue}) => {
  try {
    const {_id, ...updateData} = userData;
    await updateUser(updateData, _id);
    dispatch(updateuser(updateData)); 
  } catch (error) {
    return rejectWithValue('Failed to update user profile');
  }
});

export const logoutUser = () => (dispatch: any) => {
  dispatch(logout());
};
