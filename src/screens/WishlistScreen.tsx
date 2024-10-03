import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import ItemList from '../components/ItemList';

const WishlistScreen = () => {
  const [wishlistItems, setWishlistItems] = useState([
    { id: '1', name: 'Wishlisted Product 1', price: '$10.99', thumbnail: 'https://via.placeholder.com/100' },
    { id: '2', name: 'Wishlisted Product 2', price: '$14.99', thumbnail: 'https://via.placeholder.com/100' },
    { id: '3', name: 'Wishlisted Product 3', price: '$8.49', thumbnail: 'https://via.placeholder.com/100' },
  ]);

  // Placeholder buttons for "Add to Cart" and "Remove"
  const renderWishlistButtons = (item) => (
    <>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Add to Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Remove</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      <ItemList items={wishlistItems} renderButtons={renderWishlistButtons} />
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
