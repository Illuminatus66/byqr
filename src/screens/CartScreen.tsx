import React, {useCallback, useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableHighlight,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import RazorpayCheckout from 'react-native-razorpay';
import {useAppDispatch, useAppSelector} from '../hooks';
import {fetchcreatedorder, saveorder} from '../actions/orderActions';
import {selectCartProducts} from '../reducers/cartSlice';
import {selectProducts} from '../reducers/productSlice';
import {selectUserProfile, selectUserToken} from '../reducers/userSlice';
import ProductCard from '../components/ProductCard';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';

interface Store {
  name: string;
  lat: number;
  long: number;
}
interface Product {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  imgs: string[];
  description: string;
  category: string;
  stock: number;
  date_added: string;
  frameMaterial: string;
  weight: number;
  wheelSize: number;
  gearSystem: string;
  brakeType: string;
  suspension: string;
  tyreType: string;
  brand: string;
  warranty: string;
  stores: Store[];
}
interface CartProduct {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  stock: number;
  qty: number;
}
interface ProductForVerification {
  pr_id: string;
  name: string;
  qty: number;
  price: number;
  thumbnail: string;
}
interface VerificationData {
  user_id: any;
  receipt: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  products: ProductForVerification[];
  total_amount: number;
  backend_order_id: string;
}

type RootStackParamList = {
  Home: {filter: string};
  Cart: undefined;
  Login: undefined;
  Wishlist: undefined;
  ProductDescription: {pr_id: string};
  Profile: undefined;
  Compare: {ComparisonProducts: Product[]};
  ARScreen: undefined;
  Orders: undefined;
};

const CartScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartProducts);
  const products = useAppSelector(selectProducts);
  const token = useAppSelector(selectUserToken);
  const userProfile = useAppSelector(selectUserProfile);
  const [selectedAddress, setSelectedAddress] = useState('');
  const addresses = userProfile?.addresses || [];

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
          stock: product.stock,
          qty: cartItem.qty,
        };
      }
      return null;
    })
    .filter((item): item is CartProduct => item !== null);

  const productsForVerification: ProductForVerification[] = cartItems
    .map(cartItem => {
      const product = products.find(p => p._id === cartItem.pr_id);
      if (product) {
        return {
          pr_id: product._id,
          name: product.name,
          price: product.price,
          thumbnail: product.thumbnail,
          qty: cartItem.qty,
        };
      }
      return null;
    })
    .filter((item): item is ProductForVerification => item !== null);

  // Calculate total value of the cart
  const totalValue = CartProducts.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  ).toFixed(2);

  const handlePayment = async () => {
    const order = await fetchcreatedorder(Number(totalValue));
    if (!order) return console.log('No order');

    var options = {
      description: 'Buy Your Bicycles/Accessories Now!',
      image:
        'https://drive.google.com/file/d/1-uuHBSJN0l96hrUK0Es8jCimAn6w2MrG/view?usp=sharing',
      currency: 'INR',
      key: order.key,
      amount: order.amount,
      name: 'BYQR',
      order_id: order.order_id,
      prefill: {
        email: userProfile?.email,
        contact: `+91${userProfile?.phno}`,
        name: userProfile?.name,
      },
      readonly: {
        email: true,
        contact: true,
        name: true,
      },
      modal: {
        confirm_close: true,
      },
      retry: {
        enabled: true,
        max_count: 3,
      },
      allow_rotation: true,
      theme: {color: '#6200ee', backdrop_color: '#ffffff'},
    };

    RazorpayCheckout.open(options)
      .then(data => {
        const verificationData: VerificationData = {
          user_id: userProfile?._id,
          receipt: order.receipt,
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_order_id: data.razorpay_order_id,
          razorpay_signature: data.razorpay_signature,
          products: productsForVerification,
          total_amount: order.amount,
          backend_order_id: order.order_id,
        };
        dispatch(saveorder(verificationData));
        Alert.alert(`Order has been paid for successfully!`);
      })
      .catch(error => {
        Alert.alert(`Error: ${error.code} | ${error.description}`);
      });
  };

  return (
    <View style={styles.container}>
      <Toolbar title="Cart" />

      {CartProducts.length === 0 ? (
        token ? (
          // Message if the cart is empty and user is logged in
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Your cart is empty. Add some products to your cart!
            </Text>
          </View>
        ) : (
          // Message if the the user isn't logged in
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              <Text
                style={styles.signInLink}
                onPress={() => navigation.navigate('Login')}>
                Sign in
              </Text>{' '}
              to buy products or access your cart!
            </Text>
          </View>
        )
      ) : (
        <>
          {/* List of cart items */}
          <FlatList
            data={CartProducts}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <ProductCard
                pr_id={item._id}
                name={item.name}
                price={`${(item.price * item.qty).toFixed(2)}`}
                thumbnail={item.thumbnail}
                stock={item.stock}
                qty={item.qty}
              />
            )}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              addresses.length > 0 ? (
                <View style={styles.addressContainer}>
                  <Text style={styles.sectionTitle}>
                    Select Delivery Address
                  </Text>
                  {addresses.map((address, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedAddress(address)}
                      style={styles.radioOption}>
                      <RadioButton
                        value={address}
                        status={
                          selectedAddress === address ? 'checked' : 'unchecked'
                        }
                        onPress={() => setSelectedAddress(address)}
                      />
                      <Text style={styles.radioText}>{address}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null
            }
          />

          {/* Cart Total and Place Order section */}
          <View style={styles.cartSummary}>
            <Text style={styles.totalText}>
              Cart Total: &#8377;{totalValue}
            </Text>
            <TouchableHighlight
              style={styles.payButton}
              disabled={!selectedAddress}
              onPress={handlePayment}>
              <Text style={styles.payButtonText}>PAY WITH RAZORPAY</Text>
            </TouchableHighlight>
          </View>
        </>
      )}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  addressContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  radioText: {
    marginLeft: 10,
    marginRight: 15,
    fontSize: 16,
  },
  cartSummary: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginBottom: 1,
    height: 100,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  signInLink: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  payButton: {
    width: '70%',
    padding: 5,
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 7,
    backgroundColor: 'red',
    shadowColor: 'red',
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 100,
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 23,
  },
});

export default CartScreen;
