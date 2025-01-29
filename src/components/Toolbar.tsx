/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useAppSelector, useAppDispatch} from '../hooks';
import {logout, selectUserId} from '../reducers/userSlice';
import {clearcart} from '../reducers/cartSlice';
import {clearwishlist} from '../reducers/wishlistSlice';
import {
  clearComparison,
  selectComparisonProducts,
} from '../reducers/comparisonSlice';
import Menu from './Menu';

interface ToolbarProps {
  title: string;
}

type RootStackParamList = {
  Home: {filter: string};
  Cart: undefined;
  Login: undefined;
  Wishlist: undefined;
  ProductDescription: {pr_id: string};
  Profile: undefined;
  Compare: undefined;
};

const Toolbar: React.FC<ToolbarProps> = ({title}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [compareModalVisible, setCompareModalVisible] = useState(false);

  const User = useAppSelector(selectUserId);
  const comparisonItems = useAppSelector(selectComparisonProducts);

  const toggleMenuVisibility = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleProfileMenuVisibility = () => {
    setProfileMenuVisible(!profileMenuVisible);
  };

  const handleNavigation = (
    route: keyof RootStackParamList,
    params?: {filter?: string},
  ) => {
    navigation.navigate(route, params as never);
  };

  // logout handler clears all the relevant reducers (User, Cart and Wishlist) along
  // with resetting the navigation stack to set the HomeScreen as the first route.
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearcart());
    dispatch(clearwishlist());
    navigation.reset({
      index: 0,
      routes: [{name: 'Home', params: {filter: 'none'}}],
    });
    setProfileMenuVisible(false);
  };

  const handleClearSelections = () => {
    dispatch(clearComparison());
    setCompareModalVisible(false);
    Alert.alert('All items have been removed from comparison.');
  };

  const handleCompareSelections = () => {
    setCompareModalVisible(false);
    handleNavigation('Compare');
  };

  return (
    <View>
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={toggleMenuVisibility}>
          <Text style={styles.menuButton}>☰</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleNavigation('Home', {filter: 'none'})}>
          <Text style={styles.appName}>{title}</Text>
        </TouchableOpacity>
        <View style={styles.toolbarIcons}>
          {/* Compare Button with Modal */}
          {comparisonItems.length >= 2 && comparisonItems.length <= 3 && (
            <TouchableOpacity
              onPress={() => setCompareModalVisible(true)}
              style={styles.compareButton}>
              <Text style={styles.icon}>🔀</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => handleNavigation('Wishlist')}>
            <Text style={styles.icon}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation('Cart')}>
            <Text style={styles.icon}>🛒</Text>
          </TouchableOpacity>
          {User ? (
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

      {/* Compare Modal */}
      <Modal
        transparent={true}
        visible={compareModalVisible}
        animationType="fade"
        onRequestClose={() => setCompareModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setCompareModalVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.compareModal}>
          <TouchableOpacity
            onPress={handleCompareSelections}
            style={styles.modalButton}>
            <Text style={styles.modalButtonText1}>Compare Selections</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleClearSelections}
            style={styles.modalButton}>
            <Text style={styles.modalButtonText2}>Clear Selections</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Menu Modal */}
      <Modal transparent={true} visible={menuVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={toggleMenuVisibility}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.menuContainer}>
          <Menu closeMenu={toggleMenuVisibility} />
        </View>
      </Modal>

      {/* Profile Menu Modal */}
      <Modal
        transparent={true}
        visible={profileMenuVisible}
        animationType="fade">
        <TouchableWithoutFeedback onPress={toggleProfileMenuVisibility}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.profileMenu}>
          <TouchableOpacity onPress={() => handleNavigation('Profile')}>
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
  menuButton: {
    fontSize: 24,
    color: '#fff',
  },
  appName: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  toolbarIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    color: '#fff',
    marginLeft: 20,
  },
  compareButton: {
    marginLeft: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  compareModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalButton: {
    backgroundColor: '#000000',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  modalButtonText1: {
    color: '#FFD700',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalButtonText2: {
    color: '#EB5406',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  menuContainer: {
    width: '45%',
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
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default Toolbar;
