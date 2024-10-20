/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Modal} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';
import {useAppDispatch, useAppSelector} from '../hooks';
import {selectUserId, selectUserLoading, selectUserError} from '../reducers/userSlice';
import {login, signup} from '../actions/userActions';
import {fetchcartitems} from '../actions/cartActions';
import {fetchwishlist} from '../actions/wishlistActions';

interface Login {
  email: string;
  password: string;
}
interface Signup {
  name: string;
  email: string;
  password: string;
  phno: string;
}
type User = string
type RootStackParamList = {
  Home: {filter: string};
  Cart: undefined;
  Login: undefined;
  Wishlist: undefined;
  ProductDescription: {pr_id: string};
  Profile: undefined;
};

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const [isSignUp, setIsSignUp] = useState(true);
  const User = useAppSelector(selectUserId);
  const loading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);

  const handleSignUp = (name: string, email: string, phno: string, password: string) => {
    const signupData: Signup = {name, email, phno, password};
    dispatch(signup(signupData));
  };

  const handleSignIn = (email: string, password: string) => {
    const loginData: Login = {email, password};
    dispatch(login(loginData));
  };

  useEffect(() => {
    if (User) {
      const user : User = User;
      dispatch(fetchcartitems(user));
      dispatch(fetchwishlist(user));
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home', params: { filter: 'none' } }],
      });
    }
  }, [User, dispatch, navigation]);

  return (
    <View style={styles.container}>
      {/* Toolbar Section */}
      <Toolbar title="BYQR" />

      {isSignUp ? (
        <SignUpForm handleSignUp={handleSignUp} loading={loading} />
      ) : (
        <SignInForm handleSignIn={handleSignIn} loading={loading} />
      )}

      {/* Toggle SignUp/SignIn view */}
      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.toggleText}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <Text style={styles.linkText}>
            {isSignUp ? 'Sign In here!' : 'Sign Up here!'}
          </Text>
        </Text>
      </TouchableOpacity>

      {/* Showing error if it exists */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Add the Footer */}
      <Footer />

      {/* Loading Modal */}
      {loading && (
        <Modal transparent={true} animationType="none">
          <View style={styles.modalBackground}>
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="large" color="#6200EE" />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const SignUpForm: React.FC<{handleSignUp: any; loading: boolean}> = ({handleSignUp, loading}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phno, setPhno] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phno}
        onChangeText={setPhno}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles.button, loading ? {opacity: 0.7} : {}]}
        onPress={() => handleSignUp(name, email, phno, password)}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const SignInForm: React.FC<{handleSignIn: any; loading: boolean}> = ({handleSignIn, loading}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles.button, loading ? {opacity: 0.7} : {}]}
        onPress={() => handleSignIn(email, password)}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
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
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  toggleText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#000',
  },
  linkText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  spinnerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default LoginScreen;
