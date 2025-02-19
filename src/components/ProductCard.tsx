import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useAppSelector, useAppDispatch} from '../hooks';
import {selectCartLoading, selectCartNo} from '../reducers/cartSlice';
import {selectWishlistLoading} from '../reducers/wishlistSlice';
import {updatecartqty, removefromcart} from '../actions/cartActions';
import {addtowishlist} from '../actions/wishlistActions';

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

interface ProductCardProps {
  pr_id: string;
  name: string;
  price: string;
  thumbnail: string;
  stock: number;
  qty: number;
}

interface CartData {
  cart_no: string;
  pr_id: string;
  qty: number;
}
interface RemoveFromCartData {
  cart_no: string;
  pr_id: string;
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
  Compare: {ComparisonProducts: Product[]};
  ARScreen: undefined;
  Orders: undefined;
};

const ProductCard: React.FC<ProductCardProps> = ({
  pr_id,
  name,
  price,
  thumbnail,
  stock,
  qty,
}) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const cart_no = useAppSelector(selectCartNo);
  const cart_l = useAppSelector(selectCartLoading);
  const wishlist_l = useAppSelector(selectWishlistLoading);

  const handleQtyChange = (newQty: number) => {
    if (cart_no) {
      const cartData: CartData = {cart_no, pr_id, qty: newQty};
      dispatch(updatecartqty(cartData));
    }
  };

  const handleRemoveFromCart = () => {
    if (cart_no) {
      const cartData: RemoveFromCartData = {cart_no, pr_id};
      dispatch(removefromcart(cartData));
    }
  };

  const handleMoveToWishlist = () => {
    if (cart_no) {
      const cartData: RemoveFromCartData = {cart_no, pr_id};
      const wishlistData: WishlistData = {_id: cart_no, pr_id};
      dispatch(removefromcart(cartData));
      dispatch(addtowishlist(wishlistData));
    }
  };

  return (
    <View style={styles.card}>
      {/* Upper section: Thumbnail, name, price, and quantity */}
      <View style={styles.upperSection}>
        <TouchableOpacity
          style={styles.thumbnailContainer}
          onPress={() =>
            navigation.navigate('ProductDescription', {pr_id: pr_id})
          }>
          <Image source={{uri: thumbnail}} style={styles.thumbnail} />
        </TouchableOpacity>
        <View style={styles.details}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProductDescription', {pr_id: pr_id})
            }>
            <Text style={styles.name}>{name}</Text>
          </TouchableOpacity>
          <Text style={styles.price}>&#8377;{price}</Text>
          {/* Quantity Dropdown Menu */}
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={qty}
              onValueChange={newQty => handleQtyChange(newQty)}
              style={styles.dropdown}>
              {[...Array(stock)].map((_, i) => (
                <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
      {/* Lower section: "Remove" and "Move to Wishlist" buttons */}
      <View style={styles.lowerSection}>
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={handleMoveToWishlist}
          disabled={cart_l || wishlist_l}>
          <Text style={styles.wishlistButtonText}>Move to ❤️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemoveFromCart}
          disabled={cart_l || wishlist_l}>
          <Text style={styles.removeButtonText}>Remove</Text>
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
  thumbnailContainer: {
    width: '25%',
  },
  thumbnail: {
    aspectRatio: 1,
    borderRadius: 9,
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
    color: 'black',
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
    borderRadius: 7,
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
    borderRadius: 7,
    marginHorizontal: 5,
  },
  wishlistButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default ProductCard;
