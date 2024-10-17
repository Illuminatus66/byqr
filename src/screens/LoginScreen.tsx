/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';
import {useAppDispatch, useAppSelector} from '../hooks';
import {login, signup} from '../actions/userActions';
import {fetchcartitems} from '../actions/cartActions';
import {selectUserId} from '../reducers/userSlice';
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

type RootStackParamList = {
  Home: {filter: string};
  Cart: undefined;
  Login: undefined;
  Wishlist: undefined;
  ProductDescription: {pr_id: string};
};

interface SignUpProps {
  handleSignUp: (
    name: string,
    email: string,
    phno: string,
    password: string,
  ) => void;
}

interface SignInProps {
  handleSignIn: (email: string, password: string) => void;
}

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const [isSignUp, setIsSignUp] = useState(true);
  const User = useAppSelector(selectUserId);

  const handleSignUp = async (name: string, email: string, phno: string, password: string) => {
    const signupData: Signup = {name, email, phno, password};
    await dispatch(signup(signupData));
    if (User) {
      dispatch(fetchcartitems(User));
      dispatch(fetchwishlist(User));
      navigation.navigate('Home', {filter: 'none'});
    }
  };
  const handleSignIn = async (email: string, password: string) => {
    const loginData: Login = {email, password};
    await dispatch(login(loginData));
    if (User) {
      dispatch(fetchcartitems(User));
      dispatch(fetchwishlist(User));
      navigation.navigate('Home', {filter: 'none'});
    }
  };

  return (
    <View style={styles.container}>
      {/* Toolbar Section */}
      <Toolbar title="BYQR" />
      {isSignUp ? (
        <SignUpForm handleSignUp={handleSignUp} />
      ) : (
        <SignInForm handleSignIn={handleSignIn} />
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

      {/* Add the Footer */}
      <Footer />
    </View>
  );
};

const SignUpForm: React.FC<SignUpProps> = ({handleSignUp}) => {
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
        style={styles.button}
        onPress={() => handleSignUp(name, email, phno, password)}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const SignInForm: React.FC<SignInProps> = ({handleSignIn}) => {
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
        style={styles.button}
        onPress={() => handleSignIn(email, password)}>
        <Text style={styles.buttonText}>Sign In</Text>
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
});

export default LoginScreen;
