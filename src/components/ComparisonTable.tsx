import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../hooks';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {removeFromComparison} from '../reducers/comparisonSlice';
import {selectCartNo, selectCartProducts} from '../reducers/cartSlice';
import {selectWishlist} from '../reducers/wishlistSlice';
import {addtocart, updatecartqty} from '../actions/cartActions';
import {addtowishlist} from '../actions/wishlistActions';

interface CartData {
  cart_no: string;
  pr_id: string;
  qty: number;
}

interface WishlistData {
  _id: string;
  pr_id: string;
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
}

interface Metric<T> {
  label: string;
  key: keyof Product;
  format?: (value: T) => string;
}

interface ComparisonTableProps {
  products: Product[];
}

type RootStackParamList = {
  Home: {filter: string};
  Cart: undefined;
  Login: undefined;
  Wishlist: undefined;
  ProductDescription: {pr_id: string};
  Profile: undefined;
  Compare: {ComparisonProducts: Product[]};
};

const ComparisonTable: React.FC<ComparisonTableProps> = ({products}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const cart_no = useAppSelector(selectCartNo);
  const wishlist = useAppSelector(selectWishlist);
  const cart_products = useAppSelector(selectCartProducts);

  const handleRemove = (pr_id: string) => {
    dispatch(removeFromComparison([pr_id]));
    Alert.alert(
      'Product Removed From Comparison',
      'You can add more products to compare or you can come back to view existing ones',
      [
        {
          text: 'Go to Homepage',
          onPress: () => navigation.navigate('Home', {filter: 'none'}),
        },
      ],
    );
  };

  const handleAddToCart = (pr_id: string) => {

    if (!cart_no) {
      Alert.alert(
        'Create An Account Or Sign In!',
        'You need to be an authenticated user to add products to your cart.',
        [
          {
            text: 'Go to Login',
            onPress: () => navigation.navigate('Login'),
          },
        ],
        {
          cancelable: true,
        },
      );
      return;
    }
    const product = products.find(pr=> pr._id === pr_id);
    const stock = product ? product.stock : 0;

    const cartItem = cart_products.find(pr => pr.pr_id === pr_id);

    const cartQty = cartItem ? cartItem.qty : 0;

    const qty = cartQty + 1;

    if (qty <= stock && cartQty === 0) {
      const cartData: CartData = {
        cart_no: cart_no,
        pr_id: pr_id,
        qty: qty,
      };
      if (cart_no) {
        dispatch(addtocart(cartData));
        Alert.alert(
          'Product Added To Cart',
          '1 unit of this product was added to your cart. Go check it out!',
          [
            {
              text: 'Go To Cart',
              onPress: () => navigation.navigate('Cart'),
            },
          ],
          {
            cancelable: true,
          },
        );
      }
      return;
    }

    if (qty > stock && cartQty !== 0) {
      Alert.alert(
        'Maximum Amount Reached',
        `You already have ${cartQty} of these in the cart. 
        You cannot buy more than ${stock} at this time since that's all we have in stock.`,
      );
    } else {
      const cartData: CartData = {
        cart_no: cart_no,
        pr_id: pr_id,
        qty: qty,
      };
      if (cart_no) {
        dispatch(updatecartqty(cartData));
        Alert.alert(
          'Product Already Present In Cart',
          'We increased the quantity of this product in your cart by 1',
          [
            {
              text: 'Go to Cart',
              onPress: () => navigation.navigate('Cart'),
            },
          ],
          {
            cancelable: true,
          },
        );
        return;
      }
    }
  };

  const handleWishlistAction = (pr_id: string) => {
    if (!cart_no) {
      Alert.alert(
        'Create An Account Or Sign In!',
        'You need to be an authenticated user to manage your wishlist',
        [
          {
            text: 'Go to Wishlist',
            onPress: () => navigation.navigate('Login'),
          },
        ],
        {
          cancelable: true,
        },
      );
      return;
    }

    const isInWishlist = wishlist.includes(pr_id);
    const wishlistData: WishlistData = {_id: cart_no, pr_id: pr_id};

    if (isInWishlist) {
      dispatch(removefromwishlist(wishlistData));
    } else {
      dispatch(addtowishlist(wishlistData));
      Alert.alert(
        'Product Added to Wishlist',
        'We added the product to your wishlist. Go check it out!',
        [
          {
            text: 'Go to Wishlist',
            onPress: () => navigation.navigate('Wishlist'),
          },
        ],
        {
          cancelable: true,
        },
      );
      return;
    }
  };

  const metrics: Metric<any>[] = [
    {label: 'Name', key: 'name'},
    {label: 'Price', key: 'price', format: (value: number) => `Rs.${value}`},
    {label: 'Frame Material', key: 'frameMaterial'},
    {label: 'Weight', key: 'weight', format: (value: number) => `${value} kg`},
    {
      label: 'Wheel Size',
      key: 'wheelSize',
      format: (value: number) => `${value} inch`,
    },
    {label: 'Gear System', key: 'gearSystem'},
    {label: 'Brake Type', key: 'brakeType'},
    {label: 'Suspension', key: 'suspension'},
    {label: 'Tyre Type', key: 'tyreType'},
    {label: 'Brand', key: 'brand'},
    {label: 'Warranty', key: 'warranty'},
  ];

  return (
    <View style={styles.table}>
      {/* Thumbnail Row */}
      <View style={styles.row}>
        <Text style={[styles.cell, styles.label]}>Thumbnail</Text>
        {products.map(product => (
          <View key={product._id} style={styles.thumbnailContainer}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemove(product._id)}>
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProductDescription', {pr_id: product._id})
              }>
              <Image
                source={{uri: product.thumbnail}}
                style={styles.thumbnail}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Metric Rows */}
      {metrics.map(metric => (
        <View key={metric.key} style={styles.row}>
          <Text style={[styles.cell, styles.label]}>{metric.label}</Text>
          {products.map(product => {
            const value = product[metric.key as keyof Product];
            return (
              <Text key={product._id} style={styles.cell}>
                {metric.format && value !== undefined
                  ? metric.format(value as any)
                  : value !== undefined && value !== null
                  ? String(value)
                  : 'N/A'}
              </Text>
            );
          })}
        </View>
      ))}

      {/* Add to Cart & Wishlist Buttons */}
      <View style={styles.row}>
        <Text style={[styles.cell, styles.label]}>Actions</Text>
        {products.map(product => {
          const isInWishlist = wishlist.includes(product._id);
          return (
            <View key={product._id} style={styles.actionContainer}>
              {/* Add to Cart Button */}
              <TouchableOpacity
                style={[styles.actionButton, styles.cartButton]}
                onPress={() => handleAddToCart(product._id)}>
                <Text style={styles.buttonText}>Add to 🛒</Text>
              </TouchableOpacity>

              {/* Add to Wishlist Button */}
              <TouchableOpacity
                style={[styles.actionButton, styles.wishlistButton]}
                onPress={() => handleWishlistAction(product._id)}>
                <Text style={styles.buttonText}>
                  {isInWishlist ? 'Remove from ❤️' : 'Add to ❤️'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    flexDirection: 'column',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
  thumbnailContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    position: 'relative',
  },
  thumbnail: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionContainer: {
    flex: 1,
    alignItems: 'center',
  },
  actionButton: {
    width: 120,
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  cartButton: {
    backgroundColor: 'green',
  },
  wishlistButton: {
    backgroundColor: 'blue',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ComparisonTable;
