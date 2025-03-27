import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import AddEntryScreen from './screens/AddEntryScreen'; // ✅ Make sure this matches your file name
import StatsScreen from './screens/StatsScreen';



export type RootStackParamList = {
  'Add Entry': undefined;
  'Stats': undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Add Entry" component={AddEntryScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
