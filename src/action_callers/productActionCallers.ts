/* eslint-disable prettier/prettier */
import {Dispatch} from 'redux';
import {fetchAllProducts} from '../api';
import {fetchallproducts, seterror, setloading} from '../actions/productActions';

export const fetch_all_products = () => async (dispatch: Dispatch) => {
    dispatch(setloading());
    try {
      const {data: products} = await fetchAllProducts();
      dispatch(fetchallproducts(products));
    } catch (error) {
        dispatch(seterror('Failed to fetch products')); 
    }
  };
