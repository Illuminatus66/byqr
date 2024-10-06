/* eslint-disable prettier/prettier */
import {Dispatch} from 'redux';
import {logIn, signUp, updateUser} from '../api';
import {fetchcart, clearcart} from '../actions/cartActions';
import {fetchwishlist, clearwishlist} from '../actions/wishlistActions';
import {updateuser, auth, logout} from '../actions/userActions';

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
  name?: string;
  email?: string;
  phno?: string;
}

export const log_in = (authData: LoginRequest) => async (dispatch: Dispatch) => {
  try {
    const {data} = await logIn(authData);
    // Here we will split the response into user, cart, and token to dispatch
    // to different redux stores
    const {result: user, cart, token} = data;

    // Here the wishlist array is removed from the user object so that the user
    // reducer would not have to handle the wishlist data. We have a dedicated wishlist
    // reducer to maintain a separation of concerns
    const {wishlist, ...userWithoutWishlist} = user;

    // Dispatching to userReducer to store the user object and token minus the wishlist
    // that we split in the above step
    dispatch(auth({token, user: userWithoutWishlist}));

    // Dispatching to cartReducer to store cart data
    dispatch(
      fetchcart({
        cart_no: cart.cart_no,
        products: cart.products,
      }),
    );

    // Finally we dispatch the wishlist to wishlistReducer
    dispatch(fetchwishlist(wishlist ?? []));
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// The login action caller is almost identical to the login action caller in
// terms of the response, but the request is different as can be seen in the interface
export const sign_up =
  (authData: SignupRequest) => async (dispatch: Dispatch) => {
    try {
      const {data} = await signUp(authData);

      const {result: user, cart, token} = data;

      const {wishlist, ...userWithoutWishlist} = user;

      dispatch(auth({token, user: userWithoutWishlist}));

      dispatch(
        fetchcart({
          cart_no: cart.cart_no,
          products: cart.products,
        }),
      );

      dispatch(fetchwishlist(wishlist ?? []));
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

export const update_user =
  (userData: UpdateUserRequest, _id: string) =>
  async (dispatch: Dispatch) => {
    try {
      const {data} = await updateUser(userData, _id);

      const {result: updatedUser, token} = data;

      // Dispatch the updated user information to the userReducer
      dispatch(updateuser(updatedUser));

      // If a new token is generated (due to email change), we will update the user reducer
      if (token) {
        dispatch(auth({token, user: updatedUser}));
      }
    } catch (error) {
      console.error('User update failed:', error);
    }
  };

// For logging out we simply clear the cart, the wishlist and the user reducers along with the local storage
export const log_out = () => (dispatch: Dispatch) => {
  localStorage.clear();

  dispatch(clearcart());
  dispatch(clearwishlist());
  dispatch(logout());
};
