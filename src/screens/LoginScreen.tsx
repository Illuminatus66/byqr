/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';
import {useAppDispatch, useAppSelector} from '../hooks';
import {
  selectUserId,
  selectUserLoading,
  selectUserError,
} from '../reducers/userSlice';
import {login, signup} from '../actions/userActions';
import {fetchcartitems} from '../actions/cartActions';
import {fetchwishlist} from '../actions/wishlistActions';

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

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const [isSignUp, setIsSignUp] = useState(true);
  const User = useAppSelector(selectUserId);
  const loading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);

  const handleSignUp = (
    name: string,
    email: string,
    phno: string,
    password: string,
  ) => {
    const signupData: Signup = {name, email, phno, password};
    console.log('SignUp Request Data:', signupData);
    dispatch(signup(signupData));
  };

  const handleSignIn = (email: string, password: string) => {
    const loginData: Login = {email, password};
    console.log('LogIn Request Data:', loginData);
    dispatch(login(loginData));
  };

  useEffect(() => {
    if (User) {
      console.log('User ID available after login/signup:', User);
      dispatch(fetchcartitems(User));
      dispatch(fetchwishlist(User));
      navigation.reset({
        index: 0,
        routes: [{name: 'Home', params: {filter: 'none'}}],
      });
    }
  }, [User, dispatch, navigation]);

  return (
    <SafeAreaView style={styles.safeareaview}>
      <Toolbar title="BYQR" />

      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {isSignUp ? (
            <SignUpForm handleSignUp={handleSignUp} loading={loading} />
          ) : (
            <SignInForm handleSignIn={handleSignIn} loading={loading} />
          )}

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.toggleText}>
              {isSignUp
                ? 'Already have an account? '
                : "Don't have an account? "}
              <Text style={styles.linkText}>
                {isSignUp ? 'Sign In here!' : 'Sign Up here!'}
              </Text>
            </Text>
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {loading && (
            <Modal transparent={true} animationType="none">
              <View style={styles.modalBackground}>
                <View style={styles.spinnerContainer}>
                  <ActivityIndicator size="large" color="#6200EE" />
                </View>
              </View>
            </Modal>
          )}
        </ScrollView>

        <Footer />
      </View>
    </SafeAreaView>
  );
};

const SignUpForm: React.FC<{handleSignUp: any; loading: boolean}> = ({
  handleSignUp,
  loading,
}) => {
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

const SignInForm: React.FC<{handleSignIn: any; loading: boolean}> = ({
  handleSignIn,
  loading,
}) => {
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
  safeareaview: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    padding: 20,
    justifyContent: 'center',
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
