import React, {useState, useEffect} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  Dimensions,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {Picker} from '@react-native-picker/picker';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {useAppDispatch, useAppSelector} from '../hooks';
import {selectProducts} from '../reducers/productSlice';
import {
  selectCartError,
  selectCartLoading,
  selectCartNo,
} from '../reducers/cartSlice';
import {
  selectWishlist,
  selectWishlistError,
  selectWishlistLoading,
} from '../reducers/wishlistSlice';
import {addtocart, updatecartqty} from '../actions/cartActions';
import {addtowishlist, removefromwishlist} from '../actions/wishlistActions';
import {
  addToComparison,
  selectComparisonProducts,
} from '../reducers/comparisonSlice';
import StoreLocator from '../components/StoreLocator';
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
  Compare: {ComparisonProducts: Product[]};
  ARScreen: undefined;
  Orders: undefined;
};
const isLandscape = () => {
  const dim = Dimensions.get('window');
  return dim.width > dim.height;
};

const ProductDescriptionScreen = ({pr_id}: {pr_id: string}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const cart_no = useAppSelector(selectCartNo);
  const cart_l = useAppSelector(selectCartLoading);
  const cart_e = useAppSelector(selectCartError);
  const wishlist = useAppSelector(selectWishlist);
  const wishlist_l = useAppSelector(selectWishlistLoading);
  const wishlist_e = useAppSelector(selectWishlistError);
  const comparison = useAppSelector(selectComparisonProducts);
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [arPermissionGranted, setArPermissionGranted] = useState(false);
  const [selectedStore, setSelectedStore] = useState<{
    name: string;
    lat: number;
    long: number;
  } | null>(null);
  const [isLandscapeMode, setIsLandscapeMode] = useState(isLandscape());

  // Used below to find the pre-existing quantity of this particular item in the user's cart
  const cartItem = useAppSelector(state =>
    state.cart.products.find(pr => pr.pr_id === pr_id),
  );
  const window = Dimensions.get('window');
  const width = isLandscapeMode ? window.height : window.width;

  // We filter the product to be rendered by its _id (pr_id)
  const product = products.find(pr => pr._id === pr_id);

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Toolbar title="BYQR" />
        <Text style={styles.errorMessage}>
          You've followed a broken link. This product must've been deleted
        </Text>
        <Footer />
      </SafeAreaView>
    );
  }

  if (!product || !product.imgs || product.imgs.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Toolbar title="BYQR" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading Product Images...</Text>
        </View>
        <Footer />
      </SafeAreaView>
    );
  }

  const requestARPermission = async () => {
    let permissionsGranted = true;

    const handleDeniedPermission = (permissionName: string) => {
      Alert.alert(
        `${permissionName} Permission Needed`,
        `This permission is required for AR features. You can enable it in settings.`,
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Open Settings', onPress: () => openSettings('application')},
        ],
      );
    };

    // Checking CAMERA permission
    const cameraResult = await check(PERMISSIONS.ANDROID.CAMERA);
    if (cameraResult !== RESULTS.GRANTED) {
      const newCameraResult = await request(PERMISSIONS.ANDROID.CAMERA);
      if (newCameraResult !== RESULTS.GRANTED) {
        permissionsGranted = false;
        handleDeniedPermission('Camera');
      }
    }

    // Checking ACTIVITY_RECOGNITION permission
    const activityResult = await check(
      PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
    );
    if (activityResult !== RESULTS.GRANTED) {
      const newActivityResult = await request(
        PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
      );
      if (newActivityResult !== RESULTS.GRANTED) {
        permissionsGranted = false;
        handleDeniedPermission('Activity Recognition');
      }
    }

    // Checking ACCESS_FINE_LOCATION permission
    const fineLocationResult = await check(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
    if (fineLocationResult !== RESULTS.GRANTED) {
      const newFineLocationResult = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      if (newFineLocationResult !== RESULTS.GRANTED) {
        permissionsGranted = false;
        handleDeniedPermission('GPS Location');
      }
    }

    // Checking ACCESS_COARSE_LOCATION permission
    const coarseLocationResult = await check(
      PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    );
    if (coarseLocationResult !== RESULTS.GRANTED) {
      const newCoarseLocationResult = await request(
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      );
      if (newCoarseLocationResult !== RESULTS.GRANTED) {
        permissionsGranted = false;
        handleDeniedPermission('Approximate Location');
      }
    }

    setArPermissionGranted(permissionsGranted);
  };

  useEffect(() => {
    requestARPermission();
  }, []);

  // Set cartQty with the pre-existing quantity of this particular item inside the user's cart
  // or set the cartQty to 0 if this item doesn't exist in the user's cart.
  const cartQty = cartItem ? cartItem.qty : 0;

  const handleAddToCart = () => {
    const totalQty = cartQty + quantity;

    if (!cart_no) {
      setErrorMessage(`Sign-In to add to cart`);
      setTimeout(() => setErrorMessage(''), 2000);
      navigation.navigate('Login');
    }

    if (totalQty <= product.stock && cartQty === 0) {
      const cartData: CartData = {
        cart_no: cart_no,
        pr_id: pr_id,
        qty: totalQty,
      };
      if (cart_no) {
        dispatch(addtocart(cartData));
        navigation.navigate('Cart');
      }
    }

    if (totalQty > product.stock && cartQty !== 0) {
      setErrorMessage(
        `You already have ${cartQty} ${product.name} in the cart.
        You cannot buy more than ${product.stock} because that's all we have in stock.`,
      );
      setTimeout(() => setErrorMessage(''), 3000);
    } else {
      const cartData: CartData = {
        cart_no: cart_no,
        pr_id: pr_id,
        qty: totalQty,
      };
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
    } else {
      setErrorMessage(`Sign-In to add to wishlist`);
      setTimeout(() => setErrorMessage(''), 2000);
      navigation.navigate('Login');
    }
  };

  const handleRemoveFromWishlist = () => {
    if (cart_no) {
      const wishlistData: WishlistData = {_id: cart_no, pr_id: pr_id};
      dispatch(removefromwishlist(wishlistData));
    }
  };

  const isProductInWishlist = wishlist?.includes(product._id);
  const handleWishlistAction = () => {
    if (isProductInWishlist) {
      handleRemoveFromWishlist();
    } else {
      handleAddToWishlist();
    }
  };

  const handleAddToComparison = () => {
    if (comparison.length < 6 && !comparison.includes(pr_id)) {
      dispatch(addToComparison(pr_id));
    }
  };
  const isInComparison = comparison.includes(pr_id);
  const isComparisonFull = comparison.length >= 3;

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

        {/* Image Carousel section */}
        <View style={styles.carouselContainer}>
          <Carousel
            data={product.imgs}
            renderItem={({item}) => (
              <Image
                source={{uri: item}}
                style={styles.carouselImage}
                onError={e =>
                  console.log('Image loading error:', e.nativeEvent.error)
                }
              />
            )}
            width={width}
            height={width * 0.75}
            mode="parallax"
            loop={true}
            scrollAnimationDuration={600}
          />
        </View>

        {/* Name, Price & Quantity container */}
        <Text style={styles.productName}>{product.name}</Text>
        <View style={styles.priceQuantityContainer}>
          <Text style={styles.productPrice}>
            &#8377;{product.price.toFixed(2)}
          </Text>
          <View style={styles.quantityContainer}>
            <Picker
              selectedValue={quantity}
              onValueChange={value => setQuantity(value)}
              style={styles.picker}>
              {[...Array(product.stock)].map((_, i) => (
                <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
              ))}
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
              <Text style={styles.addToCartText}>Add to 🛒</Text>
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
                {isProductInWishlist ? 'Remove from ❤️' : 'Add to ❤️'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Add to Comparison button */}
        <TouchableOpacity
          onPress={handleAddToComparison}
          style={[
            styles.addToComparisonButton,
            (isComparisonFull || isInComparison) && styles.disabledButton,
          ]}
          disabled={isComparisonFull || isInComparison}>
          <Text style={styles.addToComparisonText}>
            {isInComparison ? 'Added to Comparison' : 'Add to Comparison'}
          </Text>
        </TouchableOpacity>

        {/* View in AR button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ARScreen')}
          style={[
            styles.arButton,
            !arPermissionGranted && styles.disabledButton,
          ]}
          disabled={!arPermissionGranted}>
          <Text style={styles.arButtonText}>
            {arPermissionGranted ? 'View in AR' : 'Enable Camera for AR'}
          </Text>
        </TouchableOpacity>

        {/* Description section */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>

        {/* Other Details section */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Brand:</Text>
            <Text style={styles.detailValue}>{product.brand}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Frame Material:</Text>
            <Text style={styles.detailValue}>{product.frameMaterial}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Weight:</Text>
            <Text style={styles.detailValue}>{product.weight} kg</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Wheel Size:</Text>
            <Text style={styles.detailValue}>{product.wheelSize} inches</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gear System:</Text>
            <Text style={styles.detailValue}>{product.gearSystem}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Brake Type:</Text>
            <Text style={styles.detailValue}>{product.brakeType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Suspension:</Text>
            <Text style={styles.detailValue}>{product.suspension}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tyre Type:</Text>
            <Text style={styles.detailValue}>{product.tyreType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Warranty:</Text>
            <Text style={styles.detailValue}>{product.warranty}</Text>
          </View>
        </View>

        {/* List of Stores */}
        <View style={styles.storePickerContainer}>
          <Text style={styles.storeTitle}>Select Store:</Text>
          <Picker
            selectedValue={selectedStore ? selectedStore.name : ''}
            onValueChange={(itemValue, itemIndex) => {
              const store = product.stores[itemIndex];
              setSelectedStore(store);
            }}
            style={styles.storePicker}>
            {product.stores.map((store, index) => (
              <Picker.Item key={index} label={store.name} value={store.name} />
            ))}
          </Picker>
        </View>

        {/* Store Locator Component */}
        {selectedStore && (
          <StoreLocator
            key={selectedStore.name}
            latitude={selectedStore.lat}
            longitude={selectedStore.long}
          />
        )}

        {/* Popular Products section */}
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
                <Text style={styles.popularProductPrice}>
                  &#8377;{item.price}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.popularProductList}
        />
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 400,
    height: 300,
    borderRadius: 15,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: 'black',
  },
  priceQuantityContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  productPrice: {
    flex: 0.5,
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
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
    marginBottom: 25,
  },
  addToCartButton: {
    flex: 0.5,
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
    flex: 0.5,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6200EE',
  },
  addToWishlistText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addToComparisonButton: {
    width: '100%',
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 3,
    borderColor: 'gold',
  },
  addToComparisonText: {
    color: 'gold',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#555',
    borderColor: '#777',
  },
  arButton: {
    width: '100%',
    backgroundColor: 'gold',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'black',
  },
  arButtonText: {
    color: 'black',
    fontSize: 18,
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
    color: 'black',
  },
  descriptionText: {
    fontSize: 16,
    color: '#4b4b4b',
  },
  detailsContainer: {
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
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  detailRow: {
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 16,
    color: '#555',
  },
  detailValue: {
    fontSize: 16,
    color: 'black',
  },
  storePickerContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  storeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  storePicker: {
    height: 50,
    width: '100%',
  },
  popularTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  popularProductList: {
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  popularProduct: {
    width: 155,
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
    fontSize: 14,
  },
});

export default ProductDescriptionScreen;
