import { supabase } from '../lib/supabase';

export type ServiceEntry = {
    id?: string;
    date: string;
    clientName: string;
    service: string;
    price: number;           // Total paid by client
    tip: number;
    commissionRate: number;  // e.g. 0.4
    commission: number;      // 💰 amount the tech actually earns from commission
  };
  

export const saveEntry = async (entry: ServiceEntry): Promise<void> => {
  const { error } = await supabase.from('service_entries').insert([entry]);
  if (error) {
    console.error('❌ Supabase save error:', error);
    throw error;
  }
  console.log('✅ Supabase entry saved');
};

export const getEntries = async (): Promise<ServiceEntry[]> => {
  const { data, error } = await supabase.from('service_entries').select('*').order('date', { ascending: false });

  if (error) {
    console.error('❌ Supabase fetch error:', error);
    return [];
  }

  return data || [];
};

export const deleteEntry = async (id: string): Promise<void> => {
    const { error } = await supabase.from('service_entries').delete().eq('id', id);
    if (error) {
      console.error('❌ Error deleting entry:', error);
      throw error;
    }
    console.log('🗑️ Deleted entry with id:', id);
  };
