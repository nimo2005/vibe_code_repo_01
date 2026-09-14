'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useTheme } from '@/utils/useTheme';

export default function ReviewPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClient();
  const { dark, toggle, mounted } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const fetchLogs = async () => {
    setLoading(true); setError(null);
    const { data, error: fetchError } = await supabase.from('ot_logs').select('*').order('date', { ascending: false });
    if (fetchError) { setError(fetchError.message); setLoading(false); return; }
    setLogs(data || []); setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    setDeletingId(id);
    const { error: deleteError } = await supabase.from('ot_logs').delete().eq('id', id);
    if (deleteError) { setError(deleteError.message); setDeletingId(null); return; }
    setLogs(logs.filter((log: any) => log.id !== id));
    setDeletingId(null);
  };

  const handleExportCSV = () => {
    if (!logs.length) return;
    const csv = [
      'Date,Start,End,Hours,Reason',
      ...logs.map((l: any) => `${l.date},${l.start_time},${l.end_time},${l.total_hours},"${l.reason.replace(/"/g, '""')}"`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `ot_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const totalOT = logs.reduce((sum: number, l: any) => sum + Number(l.total_hours), 0);
  const totalH = Math.floor(totalOT);
  const totalM = Math.round((totalOT - totalH) * 60);

  const grouped = logs.reduce((acc: any, log: any) => {
    const month = new Date(log.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(log);
    return acc;
  }, {});

  if (!mounted) return null;

  return (
    <div className="min-h-screen min-h-dvh flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--color-bg)]/80 backdrop-blur-xl border-b border-[var(--color-border)] shrink-0">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-blue)] to-purple-500 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-extrabold tracking-tight">OT</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-medium text-[var(--color-blue)]">+ New</Link>
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
        <div className="max-w-2xl mx-auto px-4 py-5">
          <h1 className="text-xl font-extrabold mb-4">History</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-2 shadow-lg shadow-blue-500/25">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Entries</p>
              <p className="text-2xl font-extrabold mt-0.5">{logs.length}</p>
            </div>
            <div className="bg-[var(--color-surface)] rounded-2xl p-4 border border-[var(--color-border)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-full" />
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-2 shadow-lg shadow-green-500/25">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">Total OT</p>
              <p className="text-2xl font-extrabold mt-0.5 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">{totalH}h {totalM}m</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mb-4">
            <button onClick={fetchLogs} disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 active:scale-95 transition-all">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              Refresh
            </button>
            <button onClick={handleExportCSV} disabled={loading || !logs.length}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 active:scale-95 transition-all disabled:opacity-40">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              CSV
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-center gap-2 text-xs font-medium text-[var(--color-red)] bg-red-50 dark:bg-red-950/40 rounded-xl px-3 py-2.5">
              {error}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <svg className="animate-spin w-6 h-6 text-[var(--color-blue)]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-xs text-[var(--color-text-secondary)]">Loading...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
                <svg className="w-7 h-7 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)]">No entries yet</p>
              <Link href="/" className="text-xs font-medium text-[var(--color-blue)]">Add your first entry</Link>
            </div>
          ) : (
            Object.entries(grouped).map(([month, entries]: [string, any]) => {
              const monthTotal = entries.reduce((s: number, l: any) => s + Number(l.total_hours), 0);
              const mH = Math.floor(monthTotal);
              const mM = Math.round((monthTotal - mH) * 60);
              return (
                <div key={month} className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">{month}</h2>
                    <span className="text-[10px] font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 px-2.5 py-0.5 rounded-full">{mH}h {mM}m</span>
                  </div>
                  <div className="space-y-2">
                    {entries.map((log: any) => (
                      <div key={log.id} className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-3 active:bg-[var(--color-bg)] transition-colors relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-emerald-500 rounded-r" />
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0 pl-2">
                            <div className="flex items-baseline gap-1.5 flex-wrap">
                              <span className="font-bold text-xs">{log.date}</span>
                              <span className="text-[var(--color-text-secondary)] text-[10px] font-mono">{log.start_time} → {log.end_time}</span>
                            </div>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">{log.reason}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-base font-extrabold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">{log.total_hours}h</span>
                            <button onClick={() => handleDelete(log.id)} disabled={deletingId === log.id}
                              className="text-[10px] font-medium text-[var(--color-red)] hover:underline disabled:opacity-40 active:scale-95 transition-all">
                              {deletingId === log.id ? '...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}