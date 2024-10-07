/* eslint-disable prettier/prettier */
interface CartItem {
  pr_id: string;
  qty: number;
}

export const fetchcart = (cartData: {cart_no: string; products: CartItem[];}) => ({
  type: 'FETCH_CART',
  payload: cartData,
});

export const addtocart = (product: CartItem) => ({
  type: 'ADD_TO_CART',
  payload: {product},
});

export const removefromcart = (pr_id: string) => ({
  type: 'REMOVE_FROM_CART',
  payload: {pr_id},
});

export const updatecartqty = (pr_id: string, qty: number) => ({
  type: 'UPDATE_CART_QTY',
  payload: {pr_id, qty},
});

export const clearcart = () => ({
  type: 'CLEAR_CART',
});
