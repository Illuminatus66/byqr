import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LeftMenu = () => (
  <View style={styles.menu}>
    <Text>Menu Placeholder</Text>
    {/* Add Menu items here */}
  </View>
);

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
});

export default LeftMenu;
