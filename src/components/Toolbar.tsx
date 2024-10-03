import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Toolbar = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.toolbar}>
      <TouchableOpacity onPress={() => console.log('Menu opened')}>
        <Text style={styles.menuButton}>☰</Text>
      </TouchableOpacity>
      <Text style={styles.appName}>{title}</Text>
      <View style={styles.toolbarIcons}>
        {/* Wishlist Icon */}
        <TouchableOpacity onPress={() => navigation.navigate('Wishlist')}>
          <Text style={styles.icon}>❤️</Text>
        </TouchableOpacity>
        {/* Cart Icon */}
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.icon}>🛒</Text>
        </TouchableOpacity>
        {/* Login Icon */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.icon}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    height: 60,
    backgroundColor: '#6200EE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  menuButton: { fontSize: 24, color: '#fff' },
  appName: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  toolbarIcons: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 24, color: '#fff', marginLeft: 20 },
});

export default Toolbar;
