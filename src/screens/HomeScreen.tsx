import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useRoute, RouteProp} from '@react-navigation/native';
import ItemList from '../components/ItemList';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';
import {fetchallproducts} from '../actions/productActions';
import {useAppDispatch, useAppSelector} from '../hooks';
import {
  selectProducts,
  selectProductsLoading,
  selectProductsError,
} from '../reducers/productSlice';

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

type HomeScreenRouteProp = RouteProp<{Home: {filter: string}}, 'Home'>;

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);

  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState('none');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const route = useRoute<HomeScreenRouteProp>();
  const {filter} = route.params || {};

  useEffect(() => {
    dispatch(fetchallproducts());
  }, [dispatch]);

  useEffect(() => {
    if (filter) {
      setFilterOption(filter);
    }
  }, [filter]);

  useEffect(() => {
    let updatedProducts = [...products];

    if (filterOption !== 'none') {
      updatedProducts = updatedProducts.filter(
        product => product.category === filterOption,
      );
    }

    switch (sortOption) {
      case 'price_ascending':
        updatedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_descending':
        updatedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'alphabetical':
        updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'new':
        updatedProducts.sort(
          (a, b) =>
            new Date(b.date_added).getTime() - new Date(a.date_added).getTime(),
        );
        break;
      case 'old':
        updatedProducts.sort(
          (a, b) =>
            new Date(a.date_added).getTime() - new Date(b.date_added).getTime(),
        );
        break;
      default:
        break;
    }

    setFilteredProducts(updatedProducts);
  }, [filterOption, sortOption, products]);

  return (
    <SafeAreaView style={styles.container}>
      <Toolbar title="BYQR" />

      <View style={styles.dropdownSection}>
        <View style={styles.filterDropdown}>
          <Text style={styles.dropdownLabel}>Filter By:</Text>
          <Picker
            selectedValue={filterOption}
            onValueChange={value => setFilterOption(value)}>
            <Picker.Item label="All Products" value="none" />
            <Picker.Item label="Bicycles" value="bicycles" />
            <Picker.Item label="Accessories" value="accessories" />
          </Picker>
        </View>

        <View style={styles.sortDropdown}>
          <Text style={styles.dropdownLabel}>Sort By:</Text>
          <Picker
            selectedValue={sortOption}
            onValueChange={value => setSortOption(value)}>
            <Picker.Item label="Price: Low to High" value="price_ascending" />
            <Picker.Item label="Price: High to Low" value="price_descending" />
            <Picker.Item label="A-Z" value="alphabetical" />
            <Picker.Item label="Newest" value="new" />
            <Picker.Item label="Oldest" value="old" />
          </Picker>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errordisplay}>{error}</Text>
      ) : (
        <ItemList items={filteredProducts} isWishlist={false} />
      )}

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  dropdownSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#e0e0e0',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  filterDropdown: {
    flex: 1,
    marginRight: 10,
  },
  sortDropdown: {
    flex: 1,
  },
  dropdownLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errordisplay: {
    color: 'red',
  },
});

export default HomeScreen;
