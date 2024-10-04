import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Menu from './Menu';

const Toolbar = ({ title }) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View>
      {/* Toolbar content */}
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={toggleMenu}>
          <Text style={styles.menuButton}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.appName}>{title}</Text>
        <View style={styles.toolbarIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Wishlist')}>
            <Text style={styles.icon}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.icon}>🛒</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.icon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Modal */}
      <Modal transparent={true} visible={menuVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.menuContainer}>
          <Menu />
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
  menuButton: { fontSize: 24, color: '#fff' },
  appName: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  toolbarIcons: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 24, color: '#fff', marginLeft: 20 },

  // The overlay is limited to the 40% of the screen that the menu doesn't occupy
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
});

export default Toolbar;
