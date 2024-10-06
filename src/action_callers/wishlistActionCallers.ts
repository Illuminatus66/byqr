/* eslint-disable prettier/prettier */
import {Dispatch} from 'redux';
import {addToWishlist, removeFromWishlist} from '../api';
import {addtowishlist, removefromwishlist} from '../actions/wishlistActions';

export const add_to_wishlist = (_id: string, pr_id: string) => async (dispatch: Dispatch) => {
    try {
      const {data} = await addToWishlist(_id, pr_id);
      if (data.message === 'Product added to wishlist') {
        dispatch(addtowishlist(pr_id));
      }
    } catch (error) {
      console.error('Failed to add product to wishlist:', error);
    }
  };

export const remove_from_wishlist = (_id: string, pr_id: string) => async (dispatch: Dispatch) => {
    try {
      const {data} = await removeFromWishlist(_id, pr_id);
      if (data.message === 'Product removed from wishlist') {
        dispatch(removefromwishlist(pr_id));
      }
    } catch (error) {
      console.error('Failed to remove product from wishlist:', error);
    }
  };
