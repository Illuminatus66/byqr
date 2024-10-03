import React, { useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, Image } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Toolbar from '../components/Toolbar';
import ItemList from '../components/ItemList';

const HomeScreen = () => {
    const [sortOption, setSortOption] = useState('');
    const [filterOption, setFilterOption] = useState([]);

  const items = [
    { id: '1', name: 'Item 1', image: 'https://via.placeholder.com/150' },
    { id: '2', name: 'Item 2', image: 'https://via.placeholder.com/150' },
    // Add more items here
  ];

  const sortOptions = [
      { label: 'Price', value: 'price' },
      { label: 'Rating', value: 'rating' },
      { label: 'Popularity', value: 'popularity' },
      { label: 'New Arrivals', value: 'new' },
      { label: 'Discounts', value: 'discount' },
    ];

    const filterOptions = [
      { label: 'Category 1', value: 'category1' },
      { label: 'Category 2', value: 'category2' },
      { label: 'Category 3', value: 'category3' },
      { label: 'Brand A', value: 'brandA' },
      { label: 'Brand B', value: 'brandB' },
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

        {/* Scrollable List of Items */}
        <ItemList items={items} />
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
