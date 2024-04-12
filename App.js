// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RouteApp from './src/navigation/RouteApp';

const App = () => {
  return (
    <NavigationContainer>
      <RouteApp />
    </NavigationContainer>
  
  );
};

export default App;