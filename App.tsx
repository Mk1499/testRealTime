/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {SafeAreaView, StyleSheet} from 'react-native';
import AnimatedScroll from './src/screens/AminatedScroll';
import Users from './src/screens/Users';
import {NavigationContainer} from '@react-navigation/native';
import HomeStack from './src/routes/stacks/Home.stack';

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
