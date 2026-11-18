import React, { useMemo, useState } from 'react';
import { Play } from 'lucide-react';
import { useExamContext } from '../context/ExamContext';
import type { ExamType, SessionMode } from '../shared/types';
import { SessionHistoryTable } from './SessionHistoryTable';

interface HistoryViewProps {
  examType: ExamType;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ examType }) => {
  const {
    navigate,
    skdSessions,
    skbSessions,
    openSessionById,
    removeSession,
  } = useExamContext();

  const [modeFilter, setModeFilter] = useState<'ALL' | SessionMode>('ALL');
  const isSkb = examType === 'SKB';
  const rawSessions = isSkb ? skbSessions : skdSessions;

  const filtered = useMemo(() => {
    if (modeFilter === 'ALL') return rawSessions;
    return rawSessions.filter((s) => s.session_mode === modeFilter);
  }, [rawSessions, modeFilter]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Riwayat Sesi {examType}
          </h1>
          <p className="text-sm text-slate-600">
            {isSkb
              ? 'Daftar terisolasi seluruh simulasi SKB Bidang IT (Mode Real BKN & Mode Latihan).'
              : 'Daftar terisolasi seluruh simulasi SKD (Mode Real BKN & Mode Latihan) beserta status Passing Grade.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(isSkb ? '/test/skb/setup' : '/test/skd/setup')}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto ${
            isSkb
              ? 'bg-emerald-700 hover:bg-emerald-800'
              : 'bg-blue-900 hover:bg-blue-800'
          }`}
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          <span>Simulasi {examType} Baru</span>
        </button>
      </div>

      {/* Mode Filter: Semua | Mode Real BKN | Mode Latihan */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="group"
          aria-label="Filter tipe sesi ujian"
          className="inline-flex items-center gap-1 rounded-lg bg-slate-200/70 p-1"
        >
          {(
            [
              { id: 'ALL', label: `Semua (${rawSessions.length})` },
              {
                id: 'REAL',
                label: `Mode Real BKN (${rawSessions.filter((s) => s.session_mode === 'REAL').length})`,
              },
              {
                id: 'PRACTICE',
                label: `Mode Latihan (${rawSessions.filter((s) => s.session_mode === 'PRACTICE').length})`,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setModeFilter(tab.id)}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                modeFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono tabular-nums text-slate-500">
          {filtered.length} sesi ditampilkan
        </span>
      </div>

      <SessionHistoryTable
        examType={examType}
        sessions={filtered}
        onOpenSession={openSessionById}
        onDeleteSession={removeSession}
        emptyActionLabel={`Mulai Ujian ${examType}`}
        onEmptyAction={() => navigate(isSkb ? '/test/skb/setup' : '/test/skd/setup')}
      />
    </main>
  );
};
