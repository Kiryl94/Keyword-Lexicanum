import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from './config';

export function createClient() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  if (!isSupabaseConfigured(url, anonKey) || !url || !anonKey) {
    throw new Error('Supabase is not configured');
  }
  return createBrowserClient(url, anonKey);
}
