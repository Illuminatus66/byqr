/* eslint-disable prettier/prettier */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface User {
  _id: string;
  name: string;
  email: string;
  phno: string;
}

interface AuthState {
  data: {
    token: string;
    user: User;
  } | null;
}

const initialState: AuthState = {
  data: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    auth(state, action: PayloadAction<{token: string; user: User}>) {
      const {token, user} = action.payload;
      localStorage.setItem('Profile', JSON.stringify({token, user}));
      state.data = {token, user};
    },

    updateuser(state, action: PayloadAction<User>) {
      if (state.data) {
        state.data.user = {...state.data.user, ...action.payload}; 
      }
    },

    logout(state) {
      localStorage.clear();
      state.data = null;
    },
  },
});

export const {auth, updateuser, logout} = userSlice.actions;

export const selectUserData = (state: {user: AuthState}) => state.user.data;
export const selectUserToken = (state: {user: AuthState}) =>
  state.user.data?.token;
export const selectUserProfile = (state: {user: AuthState}) =>
  state.user.data?.user;

export default userSlice.reducer;
