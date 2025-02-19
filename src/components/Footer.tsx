import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  useWindowDimensions,
} from 'react-native';

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

const Footer = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {width, height} = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <View style={styles.footer}>
      {/* Left side with the app name */}
      <View style={styles.appNameContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home', {filter: 'none'})}>
          <Text style={styles.appName}>BYQR</Text>
        </TouchableOpacity>
      </View>

      {/* Right side for social media links and code repositories */}
      <View
        style={[
          styles.linksContainer,
          isLandscape && styles.linksContainerLandscape,
        ]}>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              'https://www.linkedin.com/in/vrushali-sandam-283054253/',
            )
          }>
          <Text style={styles.linkText}>Vrushali Sandam</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              'https://www.linkedin.com/in/kanchan-singh-393a26280/',
            )
          }>
          <Text style={styles.linkText}>Kanchan Singh</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              'https://www.linkedin.com/in/varun-sodhani-is2711hu/',
            )
          }>
          <Text style={styles.linkText}>Varun Sodhani</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://github.com/Illuminatus66/byqr')
          }>
          <Text style={styles.linkText}>Frontend</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://github.com/Illuminatus66/byqr_backend')
          }>
          <Text style={styles.linkText}>Backend</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#6200EE',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  appNameContainer: {
    flex: 0.4,
    justifyContent: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#fff',
  },
  linksContainer: {
    flex: 0.6,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  linksContainerLandscape: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 10,
  },
});

export default Footer;
