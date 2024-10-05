/* eslint-disable prettier/prettier */
interface CartItem {
  pr_id: string;
  cart_qty: number;
}

interface CartState {
  cart_no: string | null;
  products: CartItem[] | null;
}

const initialState: CartState = {
  cart_no: null,
  products: null,
};

export const cartReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'FETCH_CART':
      return {
        ...state,
        cart_no: action.payload.cart_no,
        products: action.payload.products,
      };

    case 'ADD_TO_CART':
      return {
        ...state,
        products: state.products
          ? [...state.products, action.payload.product]
          : [action.payload.product],
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        products: state.products?.filter(
          (product) => product.pr_id !== action.payload.pr_id
        ) || null,
      };

    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        products: state.products?.map((product) =>
          product.pr_id === action.payload.pr_id
            ? { ...product, cart_qty: action.payload.cart_qty }
            : product
        ) || null,
      };

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

export default cartReducer;
