import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import ProductCard from '../components/ProductCard';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Product 1', price: 10.99, thumbnail: 'https://via.placeholder.com/100' },
    { id: '2', name: 'Product 2', price: 14.99, thumbnail: 'https://via.placeholder.com/100' },
    { id: '3', name: 'Product 3', price: 8.49, thumbnail: 'https://via.placeholder.com/100' },
  ]);

  // Calculate total value of the cart
  const totalValue = cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2);

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard name={item.name} price={`$${item.price}`} thumbnail={item.thumbnail} />
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Cart Total and Place Order section */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${totalValue}</Text>
        <TouchableOpacity style={styles.placeOrderButton}>
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  footer: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeOrderButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
