/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';
import { Picker } from '@react-native-picker/picker';
import { updatecartqty } from '../actions/cartActions'; // Action for updating cart quantity will be added later with all the reducers

const ProductDescriptionScreen = ({ route }) => {
  const { productId } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');

  const User = useSelector((state) => state.currentUserReducer);
  const dispatch = useDispatch();

  const product = {
    id: productId,
    name: 'Sample Product Name',
    price: 29.99,
    images: [
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/300'
    ]
  };

  const popularProducts = [
    { id: '1', name: 'Popular Product 1', price: '$19.99', image: 'https://via.placeholder.com/150' },
    { id: '2', name: 'Popular Product 2', price: '$24.99', image: 'https://via.placeholder.com/150' },
    { id: '3', name: 'Popular Product 3', price: '$12.99', image: 'https://via.placeholder.com/150' },
    { id: '4', name: 'Popular Product 4', price: '$18.99', image: 'https://via.placeholder.com/150' }
  ];

  // Fetch the cart quantity for this product from the Redux store
  const cartItem = useSelector((state) =>
    state.cart.products.find((product) => product.productId === productId)
  );
  const cartQty = cartItem ? cartItem.quantity : 0;

  // Handle Add to Cart button click
  const handleAddToCart = () => {
    const totalQuantity = cartQty + quantity;

    if (totalQuantity > 4) {
      setErrorMessage(`You already have ${cartQty} of these in the cart. You cannot buy more than 4.`);
      setTimeout(() => setErrorMessage(''), 3000); // Remove the error message after 3 seconds
    } else {
      dispatch(updateCartQuantity(User.result._id, productId, totalQuantity));
      // Placeholder for server request
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Toolbar title="BYQR" />

      <ScrollView style={styles.container}>
        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.carouselContainer}>
          <Carousel
            layout={'stack'}
            layoutCardOffset={15}
            data={product.images}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.carouselImage} />
            )}
            sliderWidth={300}
            itemWidth={300}
            loop={true}
          />
        </View>

        <Text style={styles.productName}>{product.name}</Text>
        <View style={styles.priceQuantityContainer}>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
          <View style={styles.quantityContainer}>
            <Picker
              selectedValue={quantity}
              onValueChange={(value) => setQuantity(value)}
              style={styles.picker}
            >
              <Picker.Item label="1" value={1} />
              <Picker.Item label="2" value={2} />
              <Picker.Item label="3" value={3} />
              <Picker.Item label="4" value={4} />
            </Picker>
          </View>
        </View>

        {/* Add to Cart and Add to Wishlist buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addToWishlistButton}>
            <Text style={styles.addToWishlistText}>Add to Wishlist</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Products Section */}
        <Text style={styles.popularTitle}>Popular Products</Text>
        <FlatList
          data={popularProducts}
          renderItem={({ item }) => (
            <View style={styles.popularProduct}>
              <Image source={{ uri: item.image }} style={styles.popularProductImage} />
              <Text style={styles.popularProductName}>{item.name}</Text>
              <Text style={styles.popularProductPrice}>{item.price}</Text>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.popularProductList}
        />

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10
  },
  errorBox: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000
  },
  errorText: {
    color: 'white',
    fontWeight: 'bold'
  },
  carouselContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20
  },
  carouselImage: {
    width: 300,
    height: 300,
    borderRadius: 10
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  picker: {
    height: 50,
    width: 100
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30
  },
  addToCartButton: {
    flex: 0.6,
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  addToWishlistButton: {
    flex: 0.4,
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  addToWishlistText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold'
  },
  popularTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  popularProductList: {
    paddingHorizontal: 10
  },
  popularProduct: {
    width: 150,
    marginRight: 10,
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10
  },
  popularProductImage: {
    width: 120,
    height: 120,
    borderRadius: 10
  },
  popularProductName: {
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 14
  },
  popularProductPrice: {
    color: '#888',
    fontSize: 12
  }
});

export default ProductDescriptionScreen;
