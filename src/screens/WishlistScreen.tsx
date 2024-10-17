/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import ItemList from '../components/ItemList';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';
import { useAppSelector } from '../hooks';
import { selectWishlist } from '../reducers/wishlistSlice';
import { selectProducts } from '../reducers/productSlice';


const WishlistScreen = () => {
  const wishlist = useAppSelector(selectWishlist);
  const products = useAppSelector(selectProducts);
  const wishlistItems = products.filter(pr => wishlist.includes(pr._id));

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
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#6200EE',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default WishlistScreen;
