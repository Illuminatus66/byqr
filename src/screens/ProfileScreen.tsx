/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../hooks';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';
import {
  selectUserProfile,
  selectUserLoading,
  selectUserError,
  selectUserId,
} from '../reducers/userSlice';
import {updateuserprofile} from '../actions/userActions';
import {NavigationProp, useNavigation} from '@react-navigation/native';

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
};

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const userProfile = useAppSelector(selectUserProfile);
  const userId = useAppSelector(selectUserId);
  const loading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);

  const [name, setName] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phno, setPhno] = useState(userProfile?.phno || '');
  const [addresses, setAddresses] = useState(userProfile?.addresses || []);
  const [newAddress, setNewAddress] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  }, [error]);

  const handleUpdateProfile = () => {
    if (userId) {
      dispatch(updateuserprofile({_id: userId, name, email, phno, addresses}));
      navigation.navigate('Home', {filter: 'none'});
    }
  };

  const handleAddAddress = () => {
    if (newAddress.trim() !== '' && addresses.length < 3) {
      setAddresses([...addresses, newAddress.trim()]);
      setNewAddress('');
    }
  };

  const handleRemoveAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Toolbar title="Profile" />
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          {showError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phno}
            onChangeText={setPhno}
            keyboardType="phone-pad"
          />

          <Text style={styles.sectionTitle}>Addresses (Max 3)</Text>
          <FlatList
            data={addresses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <View style={styles.addressItem}>
                <Text style={styles.addressText}>{item}</Text>
                <TouchableOpacity onPress={() => handleRemoveAddress(index)}>
                  <Text style={styles.removeText}>X</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {addresses.length < 3 && (
            <TextInput
              style={styles.input}
              placeholder="Add new address"
              value={newAddress}
              onChangeText={setNewAddress}
            />
          )}

          {addresses.length < 3 && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddAddress}>
              <Text style={styles.addButtonText}>Add Address</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleUpdateProfile}
            disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileContainer: {
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addressItem: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addressText: {
    fontSize: 14,
    marginRight: 5,
  },
  removeText: {
    color: 'red',
    fontWeight: 'bold',
    marginRight: 5,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorBox: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    marginBottom: 15,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
