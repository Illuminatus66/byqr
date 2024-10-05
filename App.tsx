import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Reducers from './src/reducers';
import AppNavigator from './src/navigation/AppNavigator';

const store = createStore(Reducers, compose(applyMiddleware(thunk)));

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
