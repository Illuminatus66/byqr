import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ProductCard = ({ name, price, thumbnail }) => {
  const [quantity, setQuantity] = useState(1); // State to manage product quantity

  // Handle increment and decrement of quantity
  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View style={styles.card}>
      {/* Upper section: Thumbnail, name, price, and quantity */}
      <View style={styles.upperSection}>
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        <View style={styles.details}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>{price}</Text>

          {/* Quantity controls */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={handleDecrement} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity onPress={handleIncrement} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Lower section: "Remove" and "Move to Wishlist" buttons */}
      <View style={styles.lowerSection}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Remove</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Move to Wishlist</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  upperSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 8,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    padding: 5,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lowerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#6200EE',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProductCard;
