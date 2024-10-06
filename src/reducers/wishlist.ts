/* eslint-disable prettier/prettier */

interface WishlistState {
  wishlist: string[],
}

const initialWishlistState: WishlistState = {
  wishlist: [],
};

const wishlistReducer = (state = initialWishlistState, action: any) => {
  switch (action.type) {
    case 'FETCH_WISHLIST':
      return {
        ...state,
        wishlist: action.payload.wishlist,
      };

    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        pr_ids: state.wishlist
          ? [...state.wishlist, action.payload.wishlist]
          : [action.payload.wishlist],
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist:
          state.wishlist?.filter(id => id !== action.payload.wishlist) || null,
      };

    case 'CLEAR_WISHLIST':
      return initialWishlistState;

    default:
      return state;
  }
};

export default wishlistReducer;
