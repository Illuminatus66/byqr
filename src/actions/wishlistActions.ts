/* eslint-disable prettier/prettier */

export const fetchwishlist = (pr_ids: string[]) => ({
    type: 'FETCH_WISHLIST',
    payload: { pr_ids },
  });

  export const addtowishlist = (pr_id: string) => ({
    type: 'ADD_TO_WISHLIST',
    payload: { pr_id },
  });

  export const removefromwishlist = (pr_id: string) => ({
    type: 'REMOVE_FROM_WISHLIST',
    payload: { pr_id },
  });

  export const clearwishlist = () => ({
    type: 'CLEAR_WISHLIST',
  });
