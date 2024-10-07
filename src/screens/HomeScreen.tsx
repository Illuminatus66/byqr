/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {useDispatch, useSelector} from 'react-redux';
import ItemList from '../components/ItemList';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';
import {fetch_all_products} from '../action_callers/productActionCallers';
import {RootState} from '../reducers';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const {products, loading, error} = useSelector((state: RootState) => state.products);

  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState([]);

  useEffect(() => {
    dispatch(fetch_all_products());
  }, [dispatch]);

  const sortOptions = [
    {label: 'Price: Low to High', value: 'price_ascending'},
    {label: 'Price: High to Low', value: 'price_descending'},
    {label: 'A-Z', value: 'alphabetical'},
    {label: 'Newest', value: 'new'},
    {label: 'Oldest', value: 'old'},
  ];

  const filterOptions = [
    {label: 'Category 1', value: 'category1'},
    {label: 'Category 2', value: 'category2'},
    {label: 'Category 3', value: 'category3'},
    {label: 'Brand A', value: 'brandA'},
    {label: 'Brand B', value: 'brandB'},
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Toolbar */}
      <Toolbar title="BYQR" />

      {/* Dropdown Section */}
      <View style={styles.dropdownSection}>
        <View style={styles.filterDropdown}>
          <Text style={styles.dropdownLabel}>Filter By:</Text>
          <RNPickerSelect
            onValueChange={value => setFilterOption(value)}
            items={filterOptions}
            placeholder={{label: 'Select Filters', value: null}}
            useNativeAndroidPickerStyle={false}
            style={pickerSelectStyles}
          />
        </View>

        <View style={styles.sortDropdown}>
          <Text style={styles.dropdownLabel}>Sort By:</Text>
          <RNPickerSelect
            onValueChange={value => setSortOption(value)}
            items={sortOptions}
            placeholder={{label: 'Select Sort', value: null}}
            useNativeAndroidPickerStyle={false}
            style={pickerSelectStyles}
          />
        </View>
      </View>

      {/* Loading and Error */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errordisplay}>{error}</Text>
      ) : (
        <ItemList items={products} renderButtons={false} />
      )}

      {/* Footer */}
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
    paddingRight: 30, // to ensure the text is not behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is not behind the icon
  },
});
export default HomeScreen;
