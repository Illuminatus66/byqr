/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, Image, StyleSheet, FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../hooks';
import {selectCartNo} from '../reducers/cartSlice';
import {addtocart} from '../actions/cartActions';
import {removefromwishlist} from '../actions/wishlistActions';

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
}

interface ItemListProps {
  items: Product[];
  isWishlist: boolean;
}

type RootStackParamList = {
  Home: {filter: string};
  Cart: undefined;
  Login: undefined;
  Wishlist: undefined;
  ProductDescription: {pr_id: string};
};
interface CartData {
  cart_no: string;
  pr_id: string;
  qty: number;
}
interface WishlistData {
  _id: string;
  pr_id: string;
}

const ItemList: React.FC<ItemListProps> = ({items, isWishlist}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const cart_no = useAppSelector(selectCartNo);

  const handleItemPress = (pr_id: string) => {
    navigation.navigate('ProductDescription', {pr_id});
  };

  const handleAddToCart = (pr_id: string) => {
    if (cart_no) {
      const cartData: CartData = {cart_no, pr_id, qty: 1};
      dispatch(addtocart(cartData));
    }
  };

  const handleRemoveFromWishlist = (pr_id: string) => {
    if (cart_no) {
      const cartData: WishlistData = {_id: cart_no, pr_id};
      dispatch(removefromwishlist(cartData));
    }
  };

  const renderItem = ({item}: {item: Product}) => (
    <TouchableOpacity onPress={() => handleItemPress(item._id)}>
      <View style={styles.itemContainer}>
        <Image source={{uri: item.thumbnail}} style={styles.itemThumbnail} />
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

        {/* Conditionally render buttons if isWishlist is true */}
        {isWishlist && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleAddToCart(item._id)}>
              <Text style={styles.actionButtonText}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleRemoveFromWishlist(item._id)}>
              <Text style={styles.actionButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      numColumns={2}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  itemThumbnail: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  itemName: {
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemPrice: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#6200EE',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
});

export default ItemList;
