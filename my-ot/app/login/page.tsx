'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/utils/useTheme';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState('');
  const router = useRouter();
  const supabase = createClient();
  const { dark, toggle, mounted } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen min-h-dvh flex items-center justify-center p-5 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[var(--color-blue)] opacity-10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[var(--color-green)] opacity-10 blur-3xl" />

      <div className="w-full max-w-sm relative z-10">
        {/* Theme toggle */}
        <button onClick={toggle} className="absolute -top-1 -right-1 w-8 h-8 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center z-30">
          {dark ? (
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
          ) : (
            <svg className="w-4 h-4 text-[var(--color-text-secondary)]" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
          )}
        </button>

        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-blue)] to-purple-600 shadow-lg shadow-blue-500/25 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">OT Tracker</h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-xs">Sign in to manage your overtime</p>
        </div>

        {/* Card */}
        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-xl shadow-black/5 border border-[var(--color-border)]">
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-red)] bg-red-50 dark:bg-red-950/40 rounded-xl px-3 py-2.5">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">Email</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <input
                  id="email" type="email" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                  required
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl border bg-[var(--color-bg)] text-sm transition-all ${focused === 'email' ? 'border-[var(--color-blue)] ring-2 ring-[var(--color-blue)]/20' : 'border-[var(--color-border)]'}`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">Password</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input
                  id="password" type="password" placeholder="Enter password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                  required
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl border bg-[var(--color-bg)] text-sm transition-all ${focused === 'password' ? 'border-[var(--color-blue)] ring-2 ring-[var(--color-blue)]/20' : 'border-[var(--color-border)]'}`}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 mt-1 bg-gradient-to-r from-[var(--color-blue)] to-purple-600 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 text-white font-semibold rounded-xl transition-all text-sm"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-[var(--color-text-secondary)] mt-5">Admin access only</p>
      </div>
    </div>
  );
}