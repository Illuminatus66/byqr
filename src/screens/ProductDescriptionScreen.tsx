import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';

const ProductDescriptionScreen = ({ route }) => {
  const { productId } = route.params;
  const [quantity, setQuantity] = useState(1);

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

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <ScrollView style={styles.container}>
      {/* Product Image Carousel */}
      <View style={styles.carouselContainer}>
        <Carousel
          data={product.images}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.carouselImage} />
          )}
          sliderWidth={300}
          itemWidth={300}
          loop={true}
        />
      </View>

      {/* Product Name and Price */}
      <Text style={styles.productName}>{product.name}</Text>
      <View style={styles.priceQuantityContainer}>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityNumber}>{quantity}</Text>
          <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add to Cart and Add to Wishlist buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addToCartButton}>
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
        keyExtractor={item => item.id}
        contentContainerStyle={styles.popularProductList}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10
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
  quantityButton: {
    padding: 5,
    backgroundColor: '#ddd',
    borderRadius: 5
  },
  quantityText: {
    fontSize: 18
  },
  quantityNumber: {
    fontSize: 18,
    marginHorizontal: 10
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
