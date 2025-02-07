/* eslint-disable prettier/prettier */
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {signup, login, updateuserprofile} from '../actions/userActions';

interface User {
  _id: string;
  name: string;
  email: string;
  phno: string;
  addresses: string[];
}

interface AuthState {
  data: {
    token: string | null;
    user: User | null;
  };
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  data: {
    token: null,
    user: null,
  },
  loading: false,
  error: null,
};

// Keeping the reducers pure, the storing of tokens in `localStorage`(now using AsyncStorage)
//  was moved into the action functions to create a clear separation of concerns
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.data.token = null;
      state.data.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signup.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signup.fulfilled,
        (state, action: PayloadAction<{token: string; result: User}>) => {
          state.data = {
            token: action.payload.token,
            user: action.payload.result,
          };
          state.loading = false;
          state.error = null;
        },
      )
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to sign up';
      })

      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{token: string; result: User}>) => {
          state.data = {
            token: action.payload.token,
            user: action.payload.result,
          };
          state.loading = false;
          state.error = null;
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to login';
      })

      .addCase(updateuserprofile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateuserprofile.fulfilled,
        (
          state,
          action: PayloadAction<{token: string | null; result: User}>,
        ) => {
          state.data.user = {...state.data.user, ...action.payload.result};
          if (action.payload.token) {
            state.data.token = action.payload.token;
          }
          state.loading = false;
          state.error = null;
        },
      )
      .addCase(updateuserprofile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update user profile';
      });
  },
});

export const {logout} = userSlice.actions;

export const selectUserData = (state: {user: AuthState}) => state.user.data;
export const selectUserToken = (state: {user: AuthState}) =>
  state.user.data?.token;
export const selectUserProfile = (state: {user: AuthState}) =>
  state.user.data?.user;
export const selectUserId = (state: {user: AuthState}) =>
  state.user.data?.user?._id;
export const selectUserLoading = (state: {user: AuthState}) =>
  state.user.loading;
export const selectUserError = (state: {user: AuthState}) => state.user.error;

export default userSlice.reducer;
