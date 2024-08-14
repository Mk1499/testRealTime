import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../../screens/HomeScreen/Home.screen';
import ScreenNames from './ScreenNames';
import ChallengeScreen from '../../screens/Challenge/Challenge.screen';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ScreenNames.HomeScreen} component={HomeScreen} />
      <Stack.Screen
        name={ScreenNames.ChallengeScreen}
        component={ChallengeScreen}
      />
    </Stack.Navigator>
  );
}
