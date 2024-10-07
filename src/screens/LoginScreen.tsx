/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';

const LoginScreen = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <View style={styles.container}>
      {/* Toolbar Section */}
      <Toolbar title="BYQR" />
      {isSignUp ? <SignUpForm /> : <SignInForm />}

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

const SignUpForm = () => (
  <View>
    <TextInput style={styles.input} placeholder="Name" />
    <TextInput
      style={styles.input}
      placeholder="Email"
      keyboardType="email-address"
    />
    <TextInput
      style={styles.input}
      placeholder="Phone Number"
      keyboardType="phone-pad"
    />
    <TextInput
      style={styles.input}
      placeholder="Password"
      secureTextEntry={true}
    />

    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Sign Up</Text>
    </TouchableOpacity>
  </View>
);

const SignInForm = () => (
  <View>
    <TextInput
      style={styles.input}
      placeholder="Email"
      keyboardType="email-address"
    />
    <TextInput
      style={styles.input}
      placeholder="Password"
      secureTextEntry={true}
    />

    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Sign In</Text>
    </TouchableOpacity>
  </View>
);

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
