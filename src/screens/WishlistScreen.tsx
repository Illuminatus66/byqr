/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ItemList from '../components/ItemList';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';
import {useAppSelector} from '../hooks';
import {selectWishlist} from '../reducers/wishlistSlice';
import {selectProducts} from '../reducers/productSlice';
import {selectUserToken} from '../reducers/userSlice';
import {NavigationProp, useNavigation} from '@react-navigation/native';

type RootStackParamList = {
  Home: {filter: string};
  Cart: undefined;
  Login: undefined;
  Wishlist: undefined;
  ProductDescription: {pr_id: string};
  Profile: undefined;
};

const WishlistScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const wishlist = useAppSelector(selectWishlist);
  const products = useAppSelector(selectProducts);
  const token = useAppSelector(selectUserToken);
  const wishlistItems = products.filter(pr => wishlist.includes(pr._id));

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
            </Text>
            to view your wishlist!
          </Text>
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
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInLink: {
    fontSize: 18,
    color: '#007bff',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
  },
});

export default WishlistScreen;
