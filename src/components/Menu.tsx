import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useAppSelector} from '../hooks';
import {selectComparisonProducts} from '../reducers/comparisonSlice';
import {selectProducts} from '../reducers/productSlice';

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

interface MenuProps {
  closeMenu: () => void;
}

const Menu: React.FC<MenuProps> = ({closeMenu}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const comparisonItems = useAppSelector(selectComparisonProducts);
  const products = useAppSelector(selectProducts);

  const productLookup = new Map(products.map(p => [p._id, p]));
  const ComparisonProducts = comparisonItems
    .map(pr_id => productLookup.get(pr_id))
    .filter(product => product !== undefined);

  const handleNavigation = (filter: string) => {
    closeMenu();
    navigation.navigate('Home', {filter});
  };

  // holds TouchableOpacity containers to render options in the left-hand-side
  // menu that can redirect to the HomeScreen with the three sorting props that
  // the HomeScreen accepts currently.
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
      {comparisonItems.length >= 1 && comparisonItems.length <= 5 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Compare', {ComparisonProducts})}>
          <Text style={styles.menuItem}>Compare</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuContent: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    height: '100%',
    elevation: 20,
  },
  menuItem: {
    fontSize: 19,
    fontWeight: 'bold',
    marginVertical: 15,
  },
});

export default Menu;
