/* eslint-disable prettier/prettier */
interface Product {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  imgs: string[];
  description: string;
  category: string;
  stock: number;
  date_added: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

const productReducer = ( state = initialState, action: any): ProductState => {
  switch (action.type) {
    case 'FETCH_ALL_PRODUCTS':
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    case 'PRODUCTS_LOADING':
      return {
        ...state,
        loading: true,
      };

    case 'PRODUCTS_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default productReducer;
