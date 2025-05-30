import { createClient } from '@supabase/supabase-js';
IMPORT { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
