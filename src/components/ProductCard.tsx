/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const ProductCard = ({ name, price, thumbnail, qty, productId }) => {
  const [selectedQty, setSelectedQty] = useState(qty); 

  const handleQtyChange = (user_id, product_id, newQty) => {
    setSelectedQty(newQty);

    // Placeholder: server request to update quantity
  };

  return (
    <View style={styles.card}>
      {/* Upper section: Thumbnail, name, price, and quantity */}
      <View style={styles.upperSection}>
        <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        <View style={styles.details}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>{price}</Text>

          {/* Quantity Dropdown Menu */}
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={selectedQty}
              onValueChange={(upd_qty) => handleQtyChange(user_id, productId, upd_qty)}
            >
              <Picker.Item label="1" value={1} />
              <Picker.Item label="2" value={2} />
              <Picker.Item label="3" value={3} />
              <Picker.Item label="4" value={4} />
            </Picker>
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
    alignItems: 'flex-start',
  },
  thumbnail: {
    width: '15%',
    aspectRatio: 1,
    borderRadius: 8,
    marginRight: 10,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  priceQtyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  price: {
    fontSize: 16,
    color: '#333',
  },
  dropdownContainer: {
    width: '40%', 
  },
  dropdown: {
    height: 30,
    width: '100%',
  },
  lowerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 15,
  },
  removeButton: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  wishlistButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'red',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  wishlistButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default ProductCard;
