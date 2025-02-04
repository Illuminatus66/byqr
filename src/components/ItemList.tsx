/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../hooks';
import {
  selectCartError,
  selectCartLoading,
  selectCartNo,
  selectCartProducts,
} from '../reducers/cartSlice';
import {
  selectWishlistError,
  selectWishlistLoading,
} from '../reducers/wishlistSlice';
import {addtocart, updatecartqty} from '../actions/cartActions';
import {removefromwishlist} from '../actions/wishlistActions';

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
  Profile: undefined;
  Compare: {ComparisonProducts: Product[]};
  ARScreen: undefined;
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
  const cart = useAppSelector(selectCartProducts);
  const cart_l = useAppSelector(selectCartLoading);
  const cart_e = useAppSelector(selectCartError);
  const wishlist_l = useAppSelector(selectWishlistLoading);
  const wishlist_e = useAppSelector(selectWishlistError);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const displayError = cart_e || wishlist_e || errorMessage;

  const handleItemPress = (pr_id: string) => {
    navigation.navigate('ProductDescription', {pr_id});
  };

  const handleMoveToCart = (pr_id: string, name: string) => {
    const cartItem = cart.find(pr => pr.pr_id === pr_id);
    const cartQty = cartItem ? cartItem.qty : 0;
    const prod = items.find(pr => pr._id === pr_id);
    const stock = prod ? prod.stock : 0;
    const wishlistData: WishlistData = {_id: cart_no, pr_id};

    if (cart_no) {
      if (cartQty === 0) {
        const cartData: CartData = {cart_no, pr_id, qty: 1};
        dispatch(addtocart(cartData));
        dispatch(removefromwishlist(wishlistData));
        navigation.navigate('Cart');
      } else if (cartQty < stock && cartQty > 0) {
        const cartData: CartData = {cart_no, pr_id, qty: cartQty + 1};
        dispatch(updatecartqty(cartData));
        dispatch(removefromwishlist(wishlistData));
        navigation.navigate('Cart');
      } else {
        setErrorMessage(
          `The cart already has ${stock} ${name}. We only have so much in stock.`,
        );
        setTimeout(() => setErrorMessage(null), 3000);
      }
    }
  };

  const handleRemoveFromWishlist = (pr_id: string) => {
    if (cart_no) {
      const wishlistData: WishlistData = {_id: cart_no, pr_id};
      dispatch(removefromwishlist(wishlistData));
    }
  };

  // Renders items passed to the FlatList inside TouchableOpacity containers to
  // redirect to the ProductDescriptionScreen while also rendering 'Move to Cart'
  // or 'Remove' button if and when the ItemList is rendered in the WishlistScreen.
  const renderItem = ({item}: {item: Product}) => (
    <TouchableOpacity onPress={() => handleItemPress(item._id)}>
      <View style={styles.itemContainer}>
        <Image source={{uri: item.thumbnail}} style={styles.itemThumbnail} />
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>Rs. {item.price.toFixed(2)}</Text>

        {/* Conditionally render buttons if isWishlist is true */}
        {isWishlist && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleMoveToCart(item._id, item.name)}
              disabled={cart_l || wishlist_l}>
              <Text style={styles.actionButtonText}>Move to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleRemoveFromWishlist(item._id)}
              disabled={cart_l || wishlist_l}>
              <Text style={styles.actionButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Display 'Your wishlist is empty' or 'No products available' when items.length === 0
  // depending on whether the ItemList is rendered in the Wishlist or on the Home Screen.
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyMessage}>
          {isWishlist ? 'Your wishlist is empty.' : 'No products available.'}
        </Text>
      </View>
    );
  }

  // If everything else is true, render the items in a FlatList based on the renderItem
  // object created above. Also render any error messages coming in from the server or the UI.
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{flex: 1}}>
      {displayError && (
        <View style={styles.errorModal}>
          <Text style={styles.errorText}>
            {cart_e || wishlist_e || errorMessage}
          </Text>
        </View>
      )}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    padding: 10,
    alignItems: 'center',
  },
  itemThumbnail: {
    width: 165,
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
    paddingHorizontal: 7,
    backgroundColor: '#6200EE',
    borderRadius: 5,
    marginHorizontal: 2,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  errorModal: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    fontSize: 18,
    color: '#333',
  },
});

export default ItemList;
