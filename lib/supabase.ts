import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  'https://revjxpknqhzczusjtfeh.supabase.co';

const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldmp4cGtucWh6Y3p1c2p0ZmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDA0NTgsImV4cCI6MjA5NDc3NjQ1OH0._ZNSRY_q1YXAkxmyTV0wzNEV-6gnIqbEg0FCXBXPNos';

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);