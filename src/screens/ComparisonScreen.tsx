import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  NavigationProp,
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import {useAppSelector, useAppDispatch} from '../hooks';
import {
  selectProducts,
  selectProductsError,
  selectProductsLoading,
} from '../reducers/productSlice';
import {
  selectComparisonProducts,
  removeFromComparison,
} from '../reducers/comparisonSlice';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';
import ComparisonTable from '../components/ComparisonTable';

interface Store {
  name: string;
  lat: number;
  long: number;
}
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
  frameMaterial: string;
  weight: number;
  wheelSize: number;
  gearSystem: string;
  brakeType: string;
  suspension: string;
  tyreType: string;
  brand: string;
  warranty: string;
  stores: Store[];
}

type RootStackParamList = {
  Home: {filter: string};
  Cart: undefined;
  Login: undefined;
  Wishlist: undefined;
  ProductDescription: {pr_id: string};
  Profile: undefined;
  Compare: {ComparisonProducts: Product[]};
  ARScreen: undefined;
  Orders: undefined;
};

type ComparisonScreenRouteProp = RouteProp<
  {Comparison: {ComparisonProducts: Product[]}},
  'Comparison'
>;

const ComparisonScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<ComparisonScreenRouteProp>();
  const {ComparisonProducts} = route.params;
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const productLoading = useAppSelector(selectProductsLoading);
  const productError = useAppSelector(selectProductsError);
  const comparisonItems = useAppSelector(selectComparisonProducts);

  // This hook checks for comparisonItems that are no longer available in the product catalog.
  // This can happen if the user had saved some products for comparison but coincidentally those
  // products were removed from the app anytime afterwards. The user might come back and try to
  // compare products that no longer exist, which is why this check is important
  const productLookup = new Map(products.map(p => [p._id, p]));
  useEffect(() => {
    const validComparisonItems = comparisonItems.filter(pr_id =>
      productLookup.has(pr_id),
    );
    if (validComparisonItems.length !== comparisonItems.length) {
      const invalidItems = comparisonItems.filter(
        pr_id => !productLookup.has(pr_id),
      );
      dispatch(removeFromComparison(invalidItems));
    }
  }, [products, comparisonItems, dispatch]);

  useEffect(() => {
    if (ComparisonProducts.length < 1 || ComparisonProducts.length > 5) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home', params: {filter: 'none'}}],
      });
    }
  }, [ComparisonProducts, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Toolbar title="Compare" />
      {productLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : productError ? (
        <Text style={styles.errorText}>{productError}</Text>
      ) : ComparisonProducts.length >= 1 || ComparisonProducts.length <= 5 ? (
        <ScrollView horizontal>
          <ComparisonTable products={ComparisonProducts} />
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ComparisonScreen;
