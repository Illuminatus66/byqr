/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Linking} from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      {/* Left side with the app name */}
      <View style={styles.appNameContainer}>
        <Text style={styles.appName}>BYQR</Text>
      </View>

      {/* Right side with placeholders for social media links and subscription */}
      <View style={styles.linksContainer}>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://facebook.com')}>
          <Text style={styles.linkText}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://twitter.com')}>
          <Text style={styles.linkText}>Twitter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://instagram.com')}>
          <Text style={styles.linkText}>Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://github.com')}>
          <Text style={styles.linkText}>Github</Text>
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
    flex: 0.3,
    justifyContent: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  linksContainer: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 10,
  },
});

export default Footer;
