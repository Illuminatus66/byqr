/* eslint-disable prettier/prettier */
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  PaymentRequest,
  GooglePayButton,
  GooglePayButtonConstants,
} from '@google/react-native-make-payment';
import {useAppSelector} from '../hooks';
import ProductCard from '../components/ProductCard';
import Toolbar from '../components/Toolbar';
import {selectCartProducts} from '../reducers/cartSlice';
import {selectProducts} from '../reducers/productSlice';
import {selectUserProfile, selectUserToken} from '../reducers/userSlice';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RadioButton} from 'react-native-paper';

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

type RootStackParamList = {
  Home: {filter: string};
  Cart: undefined;
  Login: undefined;
  Wishlist: undefined;
  ProductDescription: {pr_id: string};
  Profile: undefined;
  Compare: {ComparisonProducts: Product[]};
  ARScreen: undefined;
};

const CartScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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

  // Calculate total value of the cart
  const totalValue = CartProducts.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  ).toFixed(2);

  const paymentDetails = {
    total: {
      amount: {
        currency: 'INR',
        value: totalValue,
      },
    },
  };

  const googlePayRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['VISA', 'MASTERCARD'],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'example',
            gatewayMerchantId: 'exampleMerchantId',
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: 'BCR2DN4TX7O7TYAG',
      merchantName: 'BYQR',
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: paymentDetails.total.amount.value,
      currencyCode: paymentDetails.total.amount.currency,
      countryCode: 'IN',
    },
  };

  const handleGooglePay = useCallback(async () => {
    if (!selectedAddress) {
      Alert.alert('Select Address', 'Please select a delivery address.');
      return;
    }

    const paymentDetails = {
      total: {
        label: 'Total Payment',
        amount: {
          currency: 'INR',
          value: totalValue,
        },
      },
    };

    const paymentMethods = [
      {
        supportedMethods: 'google_pay',
        data: googlePayRequest,
      },
    ];

    const paymentRequest = new PaymentRequest(paymentMethods, paymentDetails);

    try {
      const canPay = await paymentRequest.canMakePayment();
      if (canPay) {
        const response = await paymentRequest.show();
        console.log('Payment Response:', response);
        Alert.alert('Payment Successful', 'Your order has been placed!');
      } else {
        Alert.alert(
          'Google Pay Unavailable',
          'Google Pay is not supported on this device.',
        );
      }
    } catch (error) {
      console.error('Payment Error:', error);
      Alert.alert('Payment Failed', 'Something went wrong with the payment.');
    }
  }, [totalValue, selectedAddress]);

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
                price={`Rs. ${(item.price * item.qty).toFixed(2)}`}
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
            <Text style={styles.totalText}>Total: Rs. {totalValue}</Text>
            <GooglePayButton
              style={styles.googlepaybutton}
              onPress={handleGooglePay}
              allowedPaymentMethods={googlePayRequest.allowedPaymentMethods}
              theme={GooglePayButtonConstants.Themes.Light}
              type={GooglePayButtonConstants.Types.Buy}
              radius={4}
              disabled={!selectedAddress}
            />
          </View>
        </>
      )}
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
    marginBottom: 10,
    height: 110,
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
  googlepaybutton: {
    height: 100,
    width: 300,
  },
});

export default CartScreen;
