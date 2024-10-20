/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';

type RootStackParamList = {
  Home: {filter: string};
  Cart: undefined;
  Login: undefined;
  Wishlist: undefined;
  ProductDescription: {pr_id: string};
  Profile: undefined;
};

interface MenuProps {
  closeMenu: () => void;
}

const Menu: React.FC<MenuProps> = ({closeMenu}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleNavigation = (filter: string) => {
    closeMenu();
    navigation.navigate('Home', {filter});
  };

  return (
    <View style={styles.menuContent}>
      {/* Menu Options */}
      <TouchableOpacity onPress={() => handleNavigation('none')}>
        <Text style={styles.menuItem}>Home Page</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation('bicycles')}>
        <Text style={styles.menuItem}>Bicycles</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation('accessories')}>
        <Text style={styles.menuItem}>Accessories</Text>
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
