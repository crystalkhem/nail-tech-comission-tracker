import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, Alert } from 'react-native';
import { getEntries, deleteEntry } from '../utils/storage';
import type { ServiceEntry } from '../utils/storage';
import { format, parseISO, startOfWeek } from 'date-fns';

const StatsScreen = () => {
  const [groupedEntries, setGroupedEntries] = useState<Record<string, ServiceEntry[]>>({});
  const [weekOrder, setWeekOrder] = useState<string[]>([]);

  const [clientTotal, setClientTotal] = useState(0);
  const [tipTotal, setTipTotal] = useState(0);
  const [commissionTotal, setCommissionTotal] = useState(0);
  const [earningsTotal, setEarningsTotal] = useState(0);

  const loadStats = async () => {
    const data = await getEntries();

    // === Grouping by week ===
    const groups: Record<string, ServiceEntry[]> = {};

    data.forEach((entry) => {
      const date = parseISO(entry.date);
      const weekStart = format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      if (!groups[weekStart]) groups[weekStart] = [];
      groups[weekStart].push(entry);
    });

    // Sort weeks (latest first)
    const sortedWeeks = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1));

    setGroupedEntries(groups);
    setWeekOrder(sortedWeeks);

    // === Totals across all entries ===
    const totals = data.reduce(
      (acc, entry) => {
        const commission = entry.commission ?? (entry.price * entry.commissionRate);
        const earnings = commission + entry.tip;

        return {
          clientTotal: acc.clientTotal + entry.price,
          tipTotal: acc.tipTotal + entry.tip,
          commissionTotal: acc.commissionTotal + commission,
          earningsTotal: acc.earningsTotal + earnings,
        };
      },
      { clientTotal: 0, tipTotal: 0, commissionTotal: 0, earningsTotal: 0 }
    );

    setClientTotal(totals.clientTotal);
    setTipTotal(totals.tipTotal);
    setCommissionTotal(totals.commissionTotal);
    setEarningsTotal(totals.earningsTotal);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteEntry(id);
          await loadStats();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📊 Earnings Summary</Text>
      <Text style={styles.stat}>Total Clients Paid: ${clientTotal.toFixed(2)}</Text>
      <Text style={styles.stat}>Your Commission: ${commissionTotal.toFixed(2)}</Text>
      <Text style={styles.stat}>Tips Collected: ${tipTotal.toFixed(2)}</Text>
      <Text style={styles.statBold}>💰 Your Total Take-Home: ${earningsTotal.toFixed(2)}</Text>

      {weekOrder.map((weekStart) => (
        <View key={weekStart} style={{ marginTop: 30 }}>
          <Text style={styles.header}>📅 Week of {format(parseISO(weekStart), 'MMMM d, yyyy')}</Text>
          {groupedEntries[weekStart].map((entry, index) => {
            const commission = entry.commission ?? (entry.price * entry.commissionRate);
            const takeHome = commission + entry.tip;

            return (
              <View key={entry.id || index} style={styles.entry}>
                <Text style={styles.entryText}>
                  {entry.date.split('T')[0]} – {entry.clientName}
                </Text>
                <Text style={styles.entryText}>Service: {entry.service}</Text>
                <Text style={styles.entryText}>Client Paid: ${entry.price.toFixed(2)}</Text>
                <Text style={styles.entryText}>
                  Commission: {(entry.commissionRate * 100).toFixed(0)}% → ${commission.toFixed(2)}
                </Text>
                <Text style={styles.entryText}>Tip: ${entry.tip.toFixed(2)}</Text>
                <Text style={styles.entryText}>Take-Home: ${takeHome.toFixed(2)}</Text>
                <View style={{ marginTop: 8 }}>
                  <Button
                    title="Delete"
                    color="red"
                    onPress={() => handleDelete(entry.id!)}
                  />
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginTop: 10, marginBottom: 10 },
  stat: { fontSize: 16, marginBottom: 4 },
  statBold: { fontSize: 17, fontWeight: '600', marginTop: 8, marginBottom: 10 },
  empty: { fontStyle: 'italic', color: '#666' },
  entry: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  entryText: { fontSize: 15 },
});

export default StatsScreen;
