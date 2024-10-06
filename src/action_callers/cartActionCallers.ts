/* eslint-disable prettier/prettier */
import {Dispatch} from 'redux';
import {addToCart, removeFromCart, updateCartQty} from '../api';
import {addtocart, removefromcart, updatecartqty} from '../actions/cartActions';

interface CartData {
  cart_no: string;
  pr_id: string;
  qty: number;
}

interface RemoveFromCartData {
  cart_no: string;
  pr_id: string;
}

export const add_to_cart =
  (cartData: CartData) => async (dispatch: Dispatch) => {
    try {
      const {data} = await addToCart(cartData);

      if (data.message === 'Product added to cart successfully') {
        const product = {
          pr_id: cartData.pr_id,
          qty: cartData.qty,
        };

        dispatch(addtocart(product));
      }
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

export const remove_from_cart =
  (cartData: RemoveFromCartData) => async (dispatch: Dispatch) => {
    try {
      const {data} = await removeFromCart(cartData);

      if (data.message === 'Product removed from cart successfully') {
        const pr_id = cartData.pr_id;
        dispatch(removefromcart(pr_id));
      }
    } catch (error) {
      console.error('Failed to remove product from cart:', error);
    }
  };

export const update_cart_qty =
  (cartData: CartData) => async (dispatch: Dispatch) => {
    try {
      const {data} = await updateCartQty(cartData);

      if (data.message === 'Product quantity updated.') {
        const pr_id = cartData.pr_id;
        const qty = cartData.qty;
        dispatch(updatecartqty(pr_id, qty));
      }
    } catch (error) {
      console.error('Failed to update product quantity', error);
    }
  };
