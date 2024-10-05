import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/ProductCard';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';

const CartScreen = () => {
  const User = useSelector((state) => state.currentUserReducer);
  const Cart= useSelector ((state)=> state.cartReducer)
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Product 1', price: 10.99, thumbnail: 'https://via.placeholder.com/100', qty: 2 },
    { id: '2', name: 'Product 2', price: 14.99, thumbnail: 'https://via.placeholder.com/100', qty: 1 },
    { id: '3', name: 'Product 3', price: 8.49, thumbnail: 'https://via.placeholder.com/100', qty: 3 },
  ]);

  // Calculate total value of the cart
  const totalValue = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0).toFixed(2);

  return (
    <View style={styles.container}>
      {/* Toolbar Section */}
      <Toolbar title="Cart" />

      {/* List of cart items */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            name={item.name}
            price={`$${(item.price * item.qty).toFixed(2)}`}
            thumbnail={item.thumbnail}
            qty={item.qty}
            productId={item.id}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* Cart Total and Place Order section */}
      <View style={styles.cartSummary}>
        <Text style={styles.totalText}>Total: ${totalValue}</Text>
        <TouchableOpacity style={styles.placeOrderButton}>
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>

      {/* Add the Footer */}
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
  cartSummary: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginBottom: 10,
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
