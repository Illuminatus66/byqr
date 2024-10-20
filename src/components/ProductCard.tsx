/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useAppSelector, useAppDispatch} from '../hooks';
import {selectCartLoading, selectCartNo} from '../reducers/cartSlice';
import {selectWishlistLoading} from '../reducers/wishlistSlice';
import {updatecartqty, removefromcart} from '../actions/cartActions';
import {addtowishlist} from '../actions/wishlistActions';

interface ProductCardProps {
  pr_id: string;
  name: string;
  price: string;
  thumbnail: string;
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

const ProductCard: React.FC<ProductCardProps> = ({pr_id, name, price, thumbnail, qty}) => {
  const dispatch = useAppDispatch();
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
        <Image source={{uri: thumbnail}} style={styles.thumbnail} />
        <View style={styles.details}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>{price}</Text>

          {/* Quantity Dropdown Menu */}
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={qty}
              onValueChange={newQty => handleQtyChange(newQty)}
              style={styles.dropdown}>
              {[1, 2, 3, 4].map(value => (
                <Picker.Item key={value} label={`${value}`} value={value} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Lower section: "Remove" and "Move to Wishlist" buttons */}
      <View style={styles.lowerSection}>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemoveFromCart}
          disabled={cart_l || wishlist_l}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={handleMoveToWishlist}
          disabled={cart_l || wishlist_l}>
          <Text style={styles.wishlistButtonText}>Move to Wishlist</Text>
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
