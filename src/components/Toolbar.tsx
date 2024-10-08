/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector, useAppDispatch} from '../hooks';
import {selectUserToken} from '../reducers/userSlice';
import {logoutuser} from '../actions/userActions';
import Menu from './Menu';

interface ToolbarProps {
  title: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ title }) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);

  const userToken = useAppSelector(selectUserToken);

  const toggleMenuVisibility = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleProfileMenuVisibility = () => {
    setProfileMenuVisible(!profileMenuVisible);
  };

  const handleNavigation = (route: string) => {
    navigation.navigate(route as never);
  };

  const handleLogout = () => {
    dispatch(logoutuser);
    setProfileMenuVisible(false);
  };

  return (
    <View>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={toggleMenuVisibility}>
          <Text style={styles.menuButton}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.appName}>{title}</Text>
        <View style={styles.toolbarIcons}>
          <TouchableOpacity onPress={() => handleNavigation('Wishlist')}>
            <Text style={styles.icon}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation('Cart')}>
            <Text style={styles.icon}>🛒</Text>
          </TouchableOpacity>

          {userToken ? (
            <TouchableOpacity onPress={toggleProfileMenuVisibility}>
              <Text style={styles.icon}>👤</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => handleNavigation('Login')}>
              <Text style={styles.icon}>👤</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Modal transparent={true} visible={menuVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={toggleMenuVisibility}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.menuContainer}>
          <Menu closeMenu={toggleMenuVisibility} />
        </View>
      </Modal>

      <Modal transparent={true} visible={profileMenuVisible} animationType="fade">
        <TouchableWithoutFeedback onPress={toggleProfileMenuVisibility}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.profileMenu}>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.profileMenuItem}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.profileMenuItem}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  menuButton: {fontSize: 24, color: '#fff'},
  appName: {fontSize: 20, color: '#fff', fontWeight: 'bold'},
  toolbarIcons: {flexDirection: 'row', alignItems: 'center'},
  icon: {fontSize: 24, color: '#fff', marginLeft: 20},

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  menuContainer: {
    width: '60%',
    backgroundColor: '#fff',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },

  profileMenu: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: '#fff',
    width: 150,
    padding: 10,
    borderRadius: 8,
    elevation: 5,
  },
  profileMenuItem: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default Toolbar;
