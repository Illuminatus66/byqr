/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {NavigationProp, RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, ActivityIndicator} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';
import {Picker} from '@react-native-picker/picker';
import {useAppDispatch, useAppSelector} from '../hooks';
import {selectProducts} from '../reducers/productSlice';
import {selectCartError, selectCartLoading, selectCartNo} from '../reducers/cartSlice';
import {selectWishlist, selectWishlistError, selectWishlistLoading} from '../reducers/wishlistSlice';
import {addtocart, updatecartqty} from '../actions/cartActions';
import {addtowishlist, removefromwishlist} from '../actions/wishlistActions';

interface CartData {
  cart_no: string;
  pr_id: string;
  qty: number;
}
interface WishlistData {
  _id: string;
  pr_id: string;
}
type RootStackParamList = {
  Home: {filter: string};
  Cart: undefined;
  Login: undefined;
  Wishlist: undefined;
  ProductDescription: {pr_id: string};
  Profile: undefined;
};

type ProductDescriptionRouteProp = RouteProp<
  {ProductDescription: {pr_id: string}},
  'ProductDescription'
>;

const ProductDescriptionScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const route = useRoute<ProductDescriptionRouteProp>();
  const {pr_id} = route.params;
  const products = useAppSelector(selectProducts);
  const cart_no = useAppSelector(selectCartNo);
  const cart_l = useAppSelector(selectCartLoading);
  const cart_e = useAppSelector(selectCartError);
  const wishlist = useAppSelector(selectWishlist);
  const wishlist_l = useAppSelector(selectWishlistLoading);
  const wishlist_e = useAppSelector(selectWishlistError);
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  // Used below to find the pre-existing quantity of this particular item in the user's cart
  const cartItem = useAppSelector(state =>
    state.cart.products.find(pr => pr.pr_id === pr_id),
  );

  // We filter the product to be rendered by its _id (pr_id)
  const product = products.find(pr => pr._id === pr_id);

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Toolbar title="BYQR" />
        <Text style={styles.errorMessage}>Product not found</Text>
        <Footer />
      </SafeAreaView>
    );
  }

  // Set cartQty with the pre-existing quantity of this particular item inside the user's cart
  // or set the cartQty to 0 if this item doesn't exist in the user's cart.
  const cartQty = cartItem ? cartItem.qty : 0;

  const handleAddToCart = () => {
    const totalQty = cartQty + quantity;

    if (totalQty <= 4 && cartQty === 0) {
      const cartData: CartData = {cart_no: cart_no, pr_id: pr_id, qty: totalQty};
      if (cart_no) {
        dispatch(addtocart(cartData));
        navigation.navigate('Cart');
      }
    }

    if (totalQty > 4 && cartQty !== 0) {
      setErrorMessage(`You already have ${cartQty} ${product.name} in the cart. You cannot buy more than 4.`);
      setTimeout(() => setErrorMessage(''), 3000);
    } else {
      const cartData: CartData = {cart_no: cart_no, pr_id: pr_id, qty: totalQty};
      if (cart_no) {
        dispatch(updatecartqty(cartData));
        navigation.navigate('Cart');
      }
    }
  };

  const handleAddToWishlist = () => {
    if (cart_no) {
      const wishlistData: WishlistData = {_id: cart_no, pr_id: pr_id};
      dispatch(addtowishlist(wishlistData));
      navigation.navigate('Wishlist');
    }
  };

  const handleRemoveFromWishlist = () => {
    if (cart_no) {
      const wishlistData: WishlistData = {_id: cart_no, pr_id: pr_id};
      dispatch(removefromwishlist(wishlistData));
    }
  };

  const isProductInWishlist = wishlist.includes(product._id);
  const handleWishlistAction = () => {
    if (isProductInWishlist) {
      handleRemoveFromWishlist();
    } else {
      handleAddToWishlist();
    }
  };

  // Here we are randomly selecting up to 6 products for the "Popular Products" section.
  // Once we add metrics to track how many people have bought each product we can use it
  // to filter out the six best products to showcase in that section.
  const popularProducts =
    products.length > 6
      ? products.sort(() => 0.5 - Math.random()).slice(0, 6)
      : products;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Toolbar title="BYQR" />

      <ScrollView style={styles.container}>
        {errorMessage || cart_e || wishlist_e ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {errorMessage || cart_e || wishlist_e}{' '}
            </Text>
          </View>
        ) : null}

        <View style={styles.carouselContainer}>
          <Carousel
            layout={'stack'}
            layoutCardOffset={15}
            data={product.imgs}
            renderItem={({item}) => (
              <Image source={{uri: item}} style={styles.carouselImage} />
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
              onValueChange={value => setQuantity(value)}
              style={styles.picker}>
              <Picker.Item label="1" value={1} />
              <Picker.Item label="2" value={2} />
              <Picker.Item label="3" value={3} />
              <Picker.Item label="4" value={4} />
            </Picker>
          </View>
        </View>

        {/* Add to Cart and Add to Wishlist buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleAddToCart}
            style={styles.addToCartButton}
            disabled={cart_l === true || wishlist_l === true}>
            {cart_l ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.addToCartText}>Add to Cart</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleWishlistAction}
            style={styles.addToWishlistButton}
            disabled={cart_l === true || wishlist_l === true}>
            {wishlist_l ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.addToWishlistText}>
                {isProductInWishlist
                  ? 'Remove from Wishlist'
                  : 'Add to Wishlist'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>

        {/* Popular Products Section */}
        <Text style={styles.popularTitle}>Popular Products</Text>
        <FlatList
          data={popularProducts}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProductDescription', {pr_id: item._id})
              }>
              <View style={styles.popularProduct}>
                <Image
                  source={{uri: item.thumbnail}}
                  style={styles.popularProductImage}
                />
                <Text style={styles.popularProductName}>{item.name}</Text>
                <Text style={styles.popularProductPrice}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  errorBox: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  errorText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 50,
    color: 'red',
  },
  carouselContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  carouselImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    height: 50,
    width: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  addToCartButton: {
    flex: 0.6,
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addToWishlistButton: {
    flex: 0.4,
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addToWishlistText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#555',
  },
  popularTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  popularProductList: {
    paddingHorizontal: 10,
  },
  popularProduct: {
    width: 150,
    marginRight: 10,
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  popularProductImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  popularProductName: {
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 14,
  },
  popularProductPrice: {
    color: '#888',
    fontSize: 12,
  },
});

export default ProductDescriptionScreen;
