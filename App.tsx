/* eslint-disable prettier/prettier */
import React from 'react';
import {Provider} from 'react-redux';
import store from './src/reducers/store'; // Update to your store path
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
