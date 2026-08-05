import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {MenuProvider} from 'react-native-popup-menu';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <MenuProvider>
        <AppNavigator />
      </MenuProvider>
    </SafeAreaProvider>
  );
};

export default App;
