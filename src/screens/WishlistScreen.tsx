/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ItemList from '../components/ItemList';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';
import {useAppSelector} from '../hooks';
import {selectWishlist, selectWishlistLoading} from '../reducers/wishlistSlice';
import {selectProducts} from '../reducers/productSlice';
import {selectUserToken} from '../reducers/userSlice';
import {NavigationProp, useNavigation} from '@react-navigation/native';

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
};

const WishlistScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const wishlist = useAppSelector(selectWishlist);
  const products = useAppSelector(selectProducts);
  const token = useAppSelector(selectUserToken);
  const loading = useAppSelector(selectWishlistLoading);
  const wishlistItems = products?.filter(pr => wishlist?.includes(pr._id));

  // If token is not available, direct the user to sign in
  if (!token) {
    return (
      <View style={styles.container}>
        <Toolbar title="Wishlist" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            <Text
              style={styles.signInLink}
              onPress={() => navigation.navigate('Login')}>
              Sign in
            </Text>{' '}
            to view your wishlist!
          </Text>
        </View>
        <Footer />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Toolbar title="Wishlist" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading your wishlist...</Text>
        </View>
        <Footer />
      </View>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <View style={styles.container}>
        <Toolbar title="Wishlist" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your wishlist is empty!</Text>
        </View>
        <Footer />
      </View>
    );
  }

  // Render wishlist items if the user is logged in
  return (
    <View style={styles.container}>
      <Toolbar title="Wishlist" />
      <ItemList items={wishlistItems} isWishlist={true} />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default WishlistScreen;
