/* eslint-disable prettier/prettier */
interface CartItem {
  pr_id: string;
  qty: number;
}

interface CartState {
  cart_no: string;
  products: CartItem[];
}

const initialState: CartState = {
  cart_no: '',
  products: [],
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
        ) || [],
      };

    case 'UPDATE_CART_QTY':
      return {
        ...state,
        products: state.products?.map((product) =>
          product.pr_id === action.payload.pr_id
            ? { ...product, qty: action.payload.qty }
            : product
        ) || [],
      };

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

export default cartReducer;
