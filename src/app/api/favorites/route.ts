import { NextResponse } from 'next/server';
import {
  validateFavoriteInput,
  validateSystemId,
  type FavoriteRow,
} from '@/lib/favorites';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const systemId = searchParams.get('systemId');

  let query = supabase
    .from('favorites')
    .select('id, system_id, keyword, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (systemId) {
    const validated = validateSystemId(systemId);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }
    query = query.eq('system_id', validated.systemId);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ favorites: (data ?? []) as FavoriteRow[] });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const systemId =
    body && typeof body === 'object' && 'systemId' in body
      ? String((body as { systemId: unknown }).systemId)
      : '';
  const keyword =
    body && typeof body === 'object' && 'keyword' in body
      ? String((body as { keyword: unknown }).keyword)
      : '';

  const validated = validateFavoriteInput({ systemId, keyword });
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('favorites')
    .upsert(
      {
        user_id: user.id,
        system_id: validated.systemId,
        keyword: validated.keyword,
      },
      { onConflict: 'user_id,system_id,keyword' },
    )
    .select('id, system_id, keyword, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ favorite: data as FavoriteRow }, { status: 201 });
}
