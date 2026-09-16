'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useTheme } from '@/utils/useTheme';

export default function HomePage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startError, setStartError] = useState('');
  const [endError, setEndError] = useState('');

  const supabase = createClient();
  const { dark, toggle, mounted } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  useEffect(() => {
    if (!startTime || !endTime) { setTotalMinutes(0); return; }
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) { setTotalMinutes(0); return; }
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    setTotalMinutes(diff > 0 ? diff : 0);
  }, [startTime, endTime]);

  const handleTimeInput = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 3) val = val.slice(0, 2) + ':' + val.slice(2);
    setter(val);
  };

  const validateTime = (val: string, type: 'start' | 'end') => {
    if (!val) { type === 'start' ? setStartError('') : setEndError(''); return; }
    if (val.length < 5) { const m = 'Use HH:MM format'; type === 'start' ? setStartError(m) : setEndError(m); return; }
    const [h, m] = val.split(':').map(Number);
    if (h > 23 || m > 59) { const m2 = 'Invalid time'; type === 'start' ? setStartError(m2) : setEndError(m2); }
    else { type === 'start' ? setStartError('') : setEndError(''); }
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !endTime || !reason) { setError('Please fill in all fields'); return; }
    if (startError || endError) { setError('Fix time errors first'); return; }
    setLoading(true); setError(null); setSuccessMessage(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from('ot_logs')
      .insert([{ 
        date, 
        start_time: startTime, 
        end_time: endTime, 
        total_hours: parseFloat((totalMinutes / 60).toFixed(2)), 
        reason,
        user_id: user.id 
      }]);
    if (insertError) { setError(insertError.message); setLoading(false); return; }
    setSuccessMessage('Saved!'); setLoading(false);
    setDate(new Date().toISOString().split('T')[0]); setStartTime(''); setEndTime(''); setReason(''); setTotalMinutes(0);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen min-h-dvh flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--color-bg)]/80 backdrop-blur-xl border-b border-[var(--color-border)] shrink-0">
        <div className="max-w-lg mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-blue)] to-purple-500 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-extrabold tracking-tight">OT</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/review" className="text-xs font-medium text-[var(--color-blue)]">History</Link>
            <button onClick={toggle} className="w-7 h-7 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
              {dark ? (
                <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>
            <button onClick={handleLogout} className="text-xs font-medium text-[var(--color-red)]">Logout</button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-5">
          <h1 className="text-xl font-extrabold mb-0.5">New Entry</h1>
          <p className="text-xs text-[var(--color-text-secondary)] mb-4">Track your overtime</p>

          {/* Messages */}
          {successMessage && (
            <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[var(--color-green-dark)] bg-green-50 dark:bg-green-950/40 rounded-xl px-3 py-2.5 animate-in">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[var(--color-red)] bg-red-50 dark:bg-red-950/40 rounded-xl px-3 py-2.5">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Date */}
            <div className="bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
              <div className="flex items-center gap-2 mb-2 relative">
                <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[var(--color-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Date</span>
              </div>
              <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm relative" />
            </div>

            {/* Time */}
            <div className="bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full" />
              <div className="flex items-center gap-2 mb-2 relative">
                <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center">
                  <svg className="w-3 h-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Time Range</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="startTime" className="block text-[10px] font-medium text-[var(--color-text-secondary)] mb-1 ml-0.5">Start</label>
                  <input id="startTime" type="text" inputMode="numeric" maxLength={5} placeholder="09:00"
                    value={startTime}
                    onChange={handleTimeInput(setStartTime)}
                    onBlur={() => validateTime(startTime, 'start')}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-center font-mono font-medium" />
                  {startError && <p className="text-[10px] text-[var(--color-red)] mt-1 ml-0.5">{startError}</p>}
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-[10px] font-medium text-[var(--color-text-secondary)] mb-1 ml-0.5">End</label>
                  <input id="endTime" type="text" inputMode="numeric" maxLength={5} placeholder="17:30"
                    value={endTime}
                    onChange={handleTimeInput(setEndTime)}
                    onBlur={() => validateTime(endTime, 'end')}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-center font-mono font-medium" />
                  {endError && <p className="text-[10px] text-[var(--color-red)] mt-1 ml-0.5">{endError}</p>}
                </div>
              </div>
              <div className="mt-3 flex justify-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full px-4 py-2 border border-purple-200/50 dark:border-purple-800/30">
                  <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">{formatDuration(totalMinutes)}</span>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
              <div className="flex items-center gap-2 mb-2 relative">
                <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
                  <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Reason</span>
              </div>
              <textarea id="reason" placeholder="What did you work on?" value={reason}
                onChange={(e) => setReason(e.target.value)} rows={2} required
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm resize-none relative" />
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-green-500/30 active:scale-[0.98] disabled:opacity-50 text-white font-bold rounded-2xl transition-all text-sm shadow-md shadow-green-500/20">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : 'Save Entry'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}