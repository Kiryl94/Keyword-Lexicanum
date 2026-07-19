-- Optional synced favorites (10x certification data layer).
-- Run in Supabase SQL editor after creating the project.

create extension if not exists "pgcrypto";

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  system_id text not null,
  keyword text not null,
  created_at timestamptz not null default now(),
  unique (user_id, system_id, keyword)
);

create index if not exists favorites_user_system_idx
  on public.favorites (user_id, system_id);

alter table public.favorites enable row level security;

create policy "favorites_select_own"
  on public.favorites
  for select
  using (auth.uid() = user_id);

create policy "favorites_insert_own"
  on public.favorites
  for insert
  with check (auth.uid() = user_id);

create policy "favorites_delete_own"
  on public.favorites
  for delete
  using (auth.uid() = user_id);
