/* eslint-disable prettier/prettier */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import LoginScreen from '../screens/LoginScreen';
import WishlistScreen from '../screens/WishlistScreen';
import ProductDescriptionScreen from '../screens/ProductDescriptionScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ComparisonScreen from '../screens/ComparisonScreen';
import ARScreen from '../screens/ARScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}} >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Wishlist" component={WishlistScreen} />
        <Stack.Screen name="ProductDescription" component={ProductDescriptionScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Compare" component={ComparisonScreen} />
        <Stack.Screen name="ARScreen" component={ARScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
