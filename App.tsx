import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js'; // 👈 at the top

import AuthScreen from './screens/AuthScreen';
import AddEntryScreen from './screens/AddEntryScreen';
import StatsScreen from './screens/StatsScreen';

export type RootStackParamList = {
  'Add Entry': undefined;
  Stats: undefined;
  Auth: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      const fetchedUser = data?.user ?? null;
      setUser(fetchedUser);
      setLoading(false);
    };
  
    fetchUser();
  
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
    });
  
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);
  
  if (loading) return null; // You can add a splash screen here

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {!user ? (
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
          />
        ) : (
          <>
            <Stack.Screen name="Add Entry" component={AddEntryScreen} />
            <Stack.Screen name="Stats" component={StatsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
