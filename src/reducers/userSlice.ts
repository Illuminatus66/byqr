/* eslint-disable prettier/prettier */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface User {
  _id: string;
  name: string;
  email: string;
  phno: string;
}

interface AuthState {
  data: {
    token: string | null;
    user: User | null;
  };
}

const initialState: AuthState = {
  data: {
    token: null,
    user: null,
  },
};

// Keeping the reducers pure, the storing of tokens in `localStorage`(now using AsyncStorage)
//  was moved into the action functions to create a clear separation of concerns
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthData(state, action: PayloadAction<{ token: string; user: User }>) {
      const { token, user } = action.payload;
      state.data = { token, user };
    },

    setUpdatedUser(state, action: PayloadAction<User>) {
      state.data.user = { ...state.data.user, ...action.payload };
    },

    logout(state) {
      state.data.token = null;
      state.data.user = null;
    },
  },
});

export const {setAuthData, setUpdatedUser, logout} = userSlice.actions;

export const selectUserData = (state: {user: AuthState}) => state.user.data;
export const selectUserToken = (state: {user: AuthState}) =>
  state.user.data?.token;
export const selectUserProfile = (state: {user: AuthState}) =>
  state.user.data?.user;

export default userSlice.reducer;
