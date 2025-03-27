import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { saveEntry, getEntries } from '../utils/storage';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App'; // Adjust if path is different



const AddEntryScreen = () => {
  const [clientName, setClientName] = useState('');
  const [service, setService] = useState('');
  const [price, setPrice] = useState('');
  const [tip, setTip] = useState('');
  const [commissionRate, setCommissionRate] = useState('0.4'); // Default 40%

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSave = async () => {
    try {
      const numericPrice = parseFloat(price);
      const numericTip = parseFloat(tip);
      const numericCommissionRate = parseFloat(commissionRate);
      const commission = numericPrice * numericCommissionRate;
  
      const entry = {
        date: new Date().toISOString(),
        clientName,
        service,
        price: numericPrice,
        tip: numericTip,
        commissionRate: numericCommissionRate,
        commission, // 💥 new field saved
      };
  
      await saveEntry(entry);
      alert('Entry saved!');
      setClientName('');
      setService('');
      setPrice('');
      setTip('');
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
      <Text>Commission Rate (e.g. 0.4 = 40%):</Text>
      <TextInput value={commissionRate} onChangeText={setCommissionRate} keyboardType="numeric" style={{ borderBottomWidth: 1 }} />
      <View style={{ marginTop: 40 }}>
  <Button title="Save Entry" onPress={handleSave} />
  <View style={{ marginTop: 20 }}>
    <Button title="View Stats" onPress={() => navigation.navigate('Stats')} />
  </View>
  <Button
  title="Log All Entries"
  onPress={async () => {
    const all = await getEntries();
    console.log('Entries from storage:', all);
  }}
/>
</View>
    </View>
  );
}

export default AddEntryScreen;