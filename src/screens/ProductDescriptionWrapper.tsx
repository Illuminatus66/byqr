import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import ProductDescriptionScreen from './ProductDescriptionScreen';

type ProductDescriptionRouteProp = RouteProp<
  {ProductDescription: {pr_id: string}},
  'ProductDescription'
>;

const ProductDescriptionWrapper = () => {
  const route = useRoute<ProductDescriptionRouteProp>();
  const {pr_id} = route.params;

  // This was done to re-render the ProductDescriptionScreen every
  // time a product in the Popular Products section was clicked on.
  // Earlier React was just hydrating the local state with new data
  // but we required re-rendering so that the user could scroll from
  // the top instead of maintaining the scroll position at the bottom
  return <ProductDescriptionScreen key={pr_id} pr_id={pr_id} />;
};

export default ProductDescriptionWrapper;
