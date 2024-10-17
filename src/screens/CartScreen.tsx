/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppSelector } from '../hooks';
import ProductCard from '../components/ProductCard';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';
import { selectCartProducts } from '../reducers/cartSlice';
import { selectProducts } from '../reducers/productSlice';

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  qty: number;
}

const CartScreen = () => {

  const cartItems = useAppSelector(selectCartProducts);
  const products = useAppSelector(selectProducts);

  // Here we are combining cart items with their respective product details
  // because both of them are stored in different reducers. So, we map over
  // the cartItems object to match _ids from the products object, to the cartItem's
  // pr_ids while selecting some of the necessary data from the products array.
  // This will help ensure type safety and will only send useful data to the
  // ProductCard component.
  const CartProducts: CartProduct[] = cartItems
    .map(cartItem => {
      const product = products.find(p => p._id === cartItem.pr_id);
      if (product) {
        return {
          _id: product._id,
          name: product.name,
          price: product.price,
          thumbnail: product.thumbnail,
          qty: cartItem.qty,
        };
      }
      return null;
    })
    .filter((item): item is CartProduct => item !== null);

  // Calculate total value of the cart
  const totalValue = CartProducts
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);

  return (
    <View style={styles.container}>
      {/* Toolbar Section */}
      <Toolbar title="Cart" />

      {/* List of cart items */}
      <FlatList
        data={CartProducts}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <ProductCard
            pr_id={item._id}
            name={item.name}
            price={`$${(item.price * item.qty).toFixed(2)}`}
            thumbnail={item.thumbnail}
            qty={item.qty}
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
