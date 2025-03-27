import { supabase } from '../lib/supabase';
import "react-native-get-random-values";
import { v4 as uuidv4 } from 'uuid';

export type ServiceEntry = {
  id?: string;
  date: string;
  clientName: string;
  service: string;
  price: number;
  tip: number;
  commissionRate: number;
  commission: number;
  user_id?: string; // 🔐 associate with the user
};

// ✅ Save entry for the logged-in user
export const saveEntry = async (entry: Omit<ServiceEntry, 'id' | 'user_id'>) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const fullEntry: ServiceEntry = {
    id: uuidv4(),
    ...entry,
    user_id: user.id, // 🔐 attach user ID
  };

  const { error } = await supabase.from('service_entries').insert([fullEntry]);

  if (error) {
    console.error('❌ Supabase save error:', error);
    throw error;
  }

  console.log('✅ Entry saved:', fullEntry);
};

// ✅ Get entries only for current user
export const getEntries = async (): Promise<ServiceEntry[]> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('service_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) {
    console.error('❌ Supabase fetch error:', error);
    throw error;
  }

  return data as ServiceEntry[];
};

// ✅ Delete by ID (user must match RLS policy)
export const deleteEntry = async (id: string): Promise<void> => {
  const { error } = await supabase.from('service_entries').delete().eq('id', id);

  if (error) {
    console.error('❌ Error deleting entry:', error);
    throw error;
  }

  console.log('🗑️ Deleted entry with id:', id);
};
