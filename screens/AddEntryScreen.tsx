import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { saveEntry } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { supabase } from '../lib/supabase';



const AddEntryScreen = () => {  
  const [clientName, setClientName] = useState('');
  const [service, setService] = useState('');
  const [price, setPrice] = useState('');
  const [tip, setTip] = useState('');
  const [commissionRate, setCommissionRate] = useState('0.4');

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Derived numeric values
  const numericPrice = parseFloat(price) || 0;
  const numericTip = parseFloat(tip) || 0;
  const numericCommissionRate = parseFloat(commissionRate) || 0;
  const commission = numericPrice * numericCommissionRate;
  const totalEarning = commission + numericTip;
  
  const user = supabase.auth.getUser(); // async call, wrap if needed


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const handleSave = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }
    
    if (numericCommissionRate === 0) {
      Alert.alert('Warning', 'Your commission rate is set to 0%. Are you sure?');
    }

    try {
      const entry = {
        date: new Date().toISOString(),
        clientName,
        service,
        price: numericPrice,
        tip: numericTip,
        commissionRate: numericCommissionRate,
        commission,
        user_id: user.id, // 💾 save the current user's ID
      };
      await supabase.from('service_entries').insert([entry]);

      await saveEntry(entry);
      alert('Entry saved!');
      setClientName('');
      setService('');
      setPrice('');
      setTip('');
      setCommissionRate('0.6');
    } catch (error) {
      console.error('❌ Failed to save entry:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Client Name:</Text>
      <TextInput value={clientName} onChangeText={setClientName} style={{ borderBottomWidth: 1 }} />

      <Text>Service:</Text>
      <TextInput value={service} onChangeText={setService} style={{ borderBottomWidth: 1 }} />

      <Text>Price ($):</Text>
      <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" style={{ borderBottomWidth: 1 }} />

      <Text>Tip ($):</Text>
      <TextInput value={tip} onChangeText={setTip} keyboardType="numeric" style={{ borderBottomWidth: 1 }} />

      <Text>Commission Rate (e.g. 0.6 = 60%):</Text>
      <TextInput
        value={commissionRate}
        onChangeText={setCommissionRate}
        keyboardType="numeric"
        style={{ borderBottomWidth: 1 }}
      />

      {/* ✨ Live preview below */}
      <View style={{ marginTop: 20, padding: 10, borderRadius: 8 }}>
        <Text>💰 Commission: ${commission.toFixed(2)}</Text>
        <Text>💖 Tip: ${numericTip.toFixed(2)}</Text>
        <Text style={{ fontWeight: 'bold' }}>Total Take-Home: ${totalEarning.toFixed(2)}</Text>
        {numericCommissionRate === 0 && (
          <Text style={{ color: 'red', marginTop: 4 }}>⚠️ Commission is 0%</Text>
        )}
      </View>

      <View style={{ marginTop: 30 }}>
        <Button title="Save Entry" onPress={handleSave} />
        <View style={{ marginTop: 10 }}>
          <Button title="View Stats" onPress={() => navigation.navigate('Stats')} />
        </View>

      <Button title="Logout" color="#ff5c5c" onPress={handleLogout} />
   
      </View>
    </View>
  );
};

export default AddEntryScreen;
