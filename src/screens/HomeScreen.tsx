/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import ItemList from '../components/ItemList';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';
import {fetchallproducts} from '../actions/productActions';
import {useAppDispatch, useAppSelector} from '../hooks';
import {selectProducts, selectProductsLoading, selectProductsError} from '../reducers/productSlice';

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
type HomeScreenRouteProp = RouteProp<{ Home: { filter: string } }, 'Home'>;
const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);

  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const route = useRoute<HomeScreenRouteProp>();
  const { filter } = route.params || {};

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

    if (filterOption) {
      updatedProducts = updatedProducts.filter(
        product => product.category === filterOption
      );
    }

    // Apply sorting based on selected option
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
        updatedProducts.sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime());
        break;
      case 'old':
        updatedProducts.sort((a, b) => new Date(a.date_added).getTime() - new Date(b.date_added).getTime());
        break;
      default:
        break;
    }

    setFilteredProducts(updatedProducts);
  }, [filterOption, sortOption, products]);

  const sortOptions = [
    { label: 'Price: Low to High', value: 'price_ascending' },
    { label: 'Price: High to Low', value: 'price_descending' },
    { label: 'A-Z', value: 'alphabetical' },
    { label: 'Newest', value: 'new' },
    { label: 'Oldest', value: 'old' },
  ];

  const filterOptions = [
    { label: 'Bicycles', value: 'bicycles' },
    { label: 'Accessories', value: 'accessories' },
  ];

  return (
    <SafeAreaView style={styles.container}>

      <Toolbar title="BYQR" />

      <View style={styles.dropdownSection}>
        <View style={styles.filterDropdown}>
          <Text style={styles.dropdownLabel}>Filter By:</Text>
          <RNPickerSelect
            onValueChange={value => setFilterOption(value)}
            items={filterOptions}
            placeholder={{ label: 'Select Filters', value: null }}
            useNativeAndroidPickerStyle={false}
            style={pickerSelectStyles}
          />
        </View>
        <View style={styles.sortDropdown}>
          <Text style={styles.dropdownLabel}>Sort By:</Text>
          <RNPickerSelect
            onValueChange={value => setSortOption(value)}
            items={sortOptions}
            placeholder={{ label: 'Select Sort', value: null }}
            useNativeAndroidPickerStyle={false}
            style={pickerSelectStyles}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errordisplay}>{error}</Text>
      ) : (
        <ItemList items={filteredProducts} renderButtons={false} />
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
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#e0e0e0',
    borderBottomWidth: 1,
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
});

export default HomeScreen;
