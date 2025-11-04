// No logic here, just client creation and environment variables.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types'; // Assuming this defines your schema

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Use environment variables directly here
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true, // Crucial for persistent login/token
    autoRefreshToken: true,
  }
});