/* eslint-disable prettier/prettier */

interface WishlistState {
  productIds: string[] | null;
}

const initialWishlistState: WishlistState = {
  productIds: null,
};

const wishlistReducer = (state = initialWishlistState, action: any) => {
  switch (action.type) {
    case 'FETCH_WISHLIST':
      return {
        ...state,
        productIds: action.payload.productIds,
      };

    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        productIds: state.productIds
          ? [...state.productIds, action.payload.pr_id]
          : [action.payload.pr_id],
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        productIds:
          state.productIds?.filter(id => id !== action.payload.pr_id) || null,
      };

    case 'CLEAR_WISHLIST':
      return initialWishlistState;

    default:
      return state;
  }
};

export default wishlistReducer;
