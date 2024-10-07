/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Menu = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.menuContent}>
      {/* Menu Options */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.menuItem}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.menuItem}>Bicycles</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.menuItem}>Accessories</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Compare')}>
        <Text style={styles.menuItem}>Compare</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContent: {
    width: '60%',
    backgroundColor: '#fff',
    padding: 20,
    height: '100%',
    elevation: 10,
  },
  menuItem: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
  },
});

export default Menu;
