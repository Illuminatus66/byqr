/* eslint-disable prettier/prettier */
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Linking} from 'react-native';

type RootStackParamList = {
  Home: {filter: string};
  Cart: undefined;
  Login: undefined;
  Wishlist: undefined;
  ProductDescription: {pr_id: string};
  Profile: undefined;
};

const Footer = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
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
      <View style={styles.linksContainer}>
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
        <TouchableOpacity
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
        </TouchableOpacity>
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
  linkText: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 10,
  },
});

export default Footer;
