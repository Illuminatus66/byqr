/* eslint-disable prettier/prettier */
interface CartItem {
    pr_id: string;
    cart_qty: number;
}

export const fetchCart = (cartData: { cart_no: string; products: CartItem[] }) => ({
    type: 'FETCH_CART',
    payload: cartData,
  });

  export const addToCart = (product: CartItem) => ({
    type: 'ADD_TO_CART',
    payload: { product },
  });

  export const removeFromCart = (pr_id: string) => ({
    type: 'REMOVE_FROM_CART',
    payload: { pr_id },
  });

  export const updateCartItem = (pr_id: string, cart_qty: number) => ({
    type: 'UPDATE_CART_ITEM',
    payload: { pr_id, cart_qty },
  });

  export const clearCart = () => ({
    type: 'CLEAR_CART',
  });
