import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cqkqvrrdurdfmzvguaxt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxa3F2cnJkdXJkZm16dmd1YXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMjA5ODEsImV4cCI6MjA1ODU5Njk4MX0.CqojE3K6sIT2LbDWvOUqrIDbj9oygQRZIh2WBG7ziEo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
