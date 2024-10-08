/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {logIn, signUp, updateUser} from '../api';
import {setAuthData, setUpdatedUser, logout} from '../reducers/userSlice';

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
interface UpdateUserRequest {
  _id: string;
  name: string
  email: string;
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
    await AsyncStorage.setItem('Profile', JSON.stringify({ token, user }));
    dispatch(setAuthData({token, user}));
  } catch (error) {
    console.error('Error in signup:', error);
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
    dispatch(setAuthData({token, user}));
    await AsyncStorage.setItem('Profile', JSON.stringify({ token, user }));
  } catch (error) {
    console.error('Error in login:', error);
    return rejectWithValue('Failed to login');
  }
});

export const updateuserprofile = createAsyncThunk<
  void,
  UpdateUserRequest,
  {rejectValue: string}
>('user/updateUserProfile', async (userData, {dispatch, rejectWithValue}) => {
  try {
    const {_id, ...updateData} = userData;
    const response = await updateUser(updateData, _id);
    const {token, result: user} = response.data;
    if (token){
      await AsyncStorage.setItem('Profile', JSON.stringify({ token, user }));
      dispatch(setAuthData({ token, user: user }));
    } else {
      const profile = await AsyncStorage.getItem('Profile');
      if (profile){
        const storedProfile = JSON.parse(profile);
        storedProfile.user = { ...storedProfile.user, ...user };
        await AsyncStorage.setItem('Profile', JSON.stringify(storedProfile));
        dispatch(setUpdatedUser(user));
      }
    }
  } catch (error) {
    console.error('Failed to update user details:', error);
    return rejectWithValue('Failed to update user profile');
  }
});

export const logoutuser = () => async (dispatch: any) => {
  try{
    await AsyncStorage.clear();
    dispatch(logout());
  } catch (error) {
    console.error('Failed to clear storage', error);
  }
};
