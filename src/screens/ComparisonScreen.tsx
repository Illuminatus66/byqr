/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
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

interface ComparisonProduct {
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
}

type RootStackParamList = {
  Home: {filter: string};
  Cart: undefined;
  Login: undefined;
  Wishlist: undefined;
  ProductDescription: {pr_id: string};
  Profile: undefined;
  Compare: undefined;
};

const ComparisonScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const productLoading = useAppSelector(selectProductsLoading);
  const productError = useAppSelector(selectProductsError);
  const comparisonItems = useAppSelector(selectComparisonProducts);

  // Prepare the ComparisonProducts array
  const productLookup = new Map(products.map(p => [p._id, p]));
  const [ComparisonProducts, setComparisonProducts] = useState<ComparisonProduct[]>([]);

  useEffect(() => {
    const updatedProducts: ComparisonProduct[] = comparisonItems
      .map(pr_id => {
        const product = productLookup.get(pr_id);
        if (product) {
          return {
            _id: product._id,
            name: product.name,
            price: product.price,
            thumbnail: product.thumbnail,
            frameMaterial: product.frameMaterial,
            weight: product.weight,
            wheelSize: product.wheelSize,
            gearSystem: product.gearSystem,
            brakeType: product.brakeType,
            suspension: product.suspension,
            tyreType: product.tyreType,
            brand: product.brand,
            warranty: product.warranty,
          };
        }
        return null;
      })
      .filter((product): product is ComparisonProduct => product !== null);
    setComparisonProducts(updatedProducts);
  }, [comparisonItems, products]);

  // This hook checks for comparisonItems that are no longer available in the product catalog.
  // This can happen if the user had saved some products for comparison but coincidentally those
  // products were removed from the app anytime afterwards. The user might come back and try to
  // compare products that no longer exist, which is why this check is important
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
    if (
      !productLoading &&
      (comparisonItems.length < 2 ||
        comparisonItems.length > 3 ||
        ComparisonProducts.length < 2 ||
        ComparisonProducts.length > 3)
    ) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home', params: {filter: 'none'}}],
      });
    }
  }, [comparisonItems.length, ComparisonProducts.length, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Toolbar title="Compare" />
      {productLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : productError ? (
        <Text style={styles.errorText}>{productError}</Text>
      ) : ComparisonProducts.length === 2 || ComparisonProducts.length === 3 ? (
        <ScrollView horizontal>
          <ComparisonTable
            products={ComparisonProducts}
            setProducts={setComparisonProducts}
          />
        </ScrollView>
      ) : null}
      <Footer />
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
