export function getSupabaseUrl(): string | undefined {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  return value || undefined;
}

export function getSupabaseAnonKey(): string | undefined {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return value || undefined;
}

/** True when public Supabase env vars are present (auth/favorites UI can activate). */
export function isSupabaseConfigured(
  url: string | undefined = getSupabaseUrl(),
  anonKey: string | undefined = getSupabaseAnonKey(),
): boolean {
  return Boolean(url && anonKey);
}
