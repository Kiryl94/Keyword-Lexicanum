'use client';

import { type FormEvent, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export function AuthPanel() {
  const configured = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [ready, setReady] = useState(!configured);

  useEffect(() => {
    if (!configured) {
      return;
    }

    const supabase = createClient();
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) {
        setUser(data.user);
        setReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [configured]);

  if (!configured) {
    return null;
  }

  if (!ready) {
    return (
      <div className="text-xs text-[#8a8aa0]" aria-hidden>
        …
      </div>
    );
  }

  async function onSignIn(event: FormEvent) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus('sending');
    setMessage(null);
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) {
        setStatus('error');
        setMessage(error.message);
        return;
      }
      setStatus('sent');
      setMessage('Check your email for the magic link.');
    } catch {
      setStatus('error');
      setMessage('Could not send magic link. Try again.');
    }
  }

  async function onSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setStatus('idle');
    setMessage(null);
  }

  if (user) {
    return (
      <div className="flex min-w-0 items-center gap-2 text-xs text-[#a0a0b0]">
        <span className="min-w-0 truncate" title={user.email ?? undefined}>
          {user.email}
        </span>
        <button
          type="button"
          onClick={onSignOut}
          className="shrink-0 rounded border border-[#2a2a40] px-2 py-1 text-[#f5f5f5] hover:border-[#3a3a55]"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSignIn} className="flex min-w-0 flex-wrap items-center gap-2">
      <label className="sr-only" htmlFor="auth-email">
        Email for magic link
      </label>
      <input
        id="auth-email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email to sync favorites"
        className="min-h-[32px] min-w-[10rem] flex-1 rounded border border-[#2a2a40] bg-[#1a1a2e] px-2 py-1 text-xs text-[#f5f5f5] placeholder:text-[#6b6b80] focus:border-[#e94560] focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="shrink-0 rounded border border-[#2a2a40] px-2 py-1 text-xs text-[#f5f5f5] hover:border-[#e94560] disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending…' : 'Sign in'}
      </button>
      {message && (
        <p
          className={`w-full text-xs ${status === 'error' ? 'text-[#e0c0c8]' : 'text-[#8a8aa0]'}`}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  );
}
