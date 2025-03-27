import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { supabase } from '../lib/supabase';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';


const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  type AuthScreenNavigation = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return Alert.alert('Sign Up Error', error.message);
    Alert.alert('Check your email to confirm your account');
  };

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return Alert.alert('Sign In Error', error.message);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome ✨</Text>

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
        placeholder="you@example.com"
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholder="••••••••"
      />

      <View style={styles.buttonGroup}>
        <Button title="Sign In" onPress={handleSignIn} />
        <View style={{ marginTop: 10 }} />
        <Button title="Sign Up" onPress={handleSignUp} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100, // 👈 brings everything down
    flex: 1,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingVertical: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonGroup: {
    marginTop: 20,
  },
});

export default AuthScreen;
