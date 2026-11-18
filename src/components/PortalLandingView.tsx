import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Cpu,
  Play,
  ShieldCheck,
} from 'lucide-react';
import { useExamContext } from '../context/ExamContext';
import type { ExamType } from '../shared/types';
import { SessionHistoryTable } from './SessionHistoryTable';

export const PortalLandingView: React.FC = () => {
  const {
    navigate,
    currentUser,
    bankStats,
    skdSessions,
    skbSessions,
    openSessionById,
    removeSession,
    loading,
    error,
  } = useExamContext();

  const [historyTab, setHistoryTab] = useState<ExamType>('SKD');

  const skdCompleted = skdSessions.filter((s) => s.status === 'COMPLETED');
  const skbCompleted = skbSessions.filter((s) => s.status === 'COMPLETED');
  const skdPassed = skdCompleted.filter((s) => s.lulus_passing_grade).length;
  const skbAvgPct =
    skbCompleted.length > 0
      ? Math.round(
          (skbCompleted.reduce((acc, s) => acc + s.persentase_total, 0) /
            skbCompleted.length) *
            10
        ) / 10
      : null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Compact Hero Header */}
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
            Selamat datang, {currentUser?.name ?? 'Peserta'} · {currentUser?.email}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Pilih Jalur Simulasi: SKD Dasar atau SKB Bidang IT
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Portal SKD dan SKB dipisahkan secara independen dengan pilihan <span className="font-semibold text-slate-800">Mode Real Ujian (Simulasi BKN)</span> yang terkunci ketat serta <span className="font-semibold text-slate-800">Mode Latihan</span> kustom lengkap dengan pembahasan langkah demi langkah <span className="font-semibold text-slate-800">(i)</span>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/bank')}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap shrink-0 self-start md:self-auto"
        >
          <BookOpen className="h-4 w-4 text-blue-900" aria-hidden="true" />
          <span>Jelajahi {bankStats ? bankStats.total.toLocaleString('id-ID') : '1.450'} Bank Soal</span>
        </button>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      {/* Two Distinct Primary Access Portal Cards */}
      <section
        aria-label="Portal akses simulasi SKD dan SKB"
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        {/* Card 1: Portal Persiapan SKD */}
        <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 sm:p-7 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-900 text-white">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
                    Portal 1 · Kompetensi Dasar
                  </p>
                  <h2 className="text-xl font-bold text-slate-900">
                    Simulasi SKD CPNS
                  </h2>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums shrink-0">
                {bankStats ? `${bankStats.skdTotal.toLocaleString('id-ID')} Soal` : '1.250 Soal'}
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Tersedia Mode Real BKN (110 soal · 100 menit · tanpa hint) dan Mode Latihan kustom (20/50/75 soal) dengan pembobotan resmi PermenPANRB.
            </p>

            <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 bg-slate-50/70 py-3 text-center">
              <div className="px-2">
                <p className="text-[11px] font-semibold text-slate-500">TWK</p>
                <p className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                  {bankStats ? bankStats.byCategory.TWK : 375}
                </p>
                <p className="text-[11px] text-slate-500">+5 / 0 · PG 65</p>
              </div>
              <div className="px-2">
                <p className="text-[11px] font-semibold text-slate-500">TIU</p>
                <p className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                  {bankStats ? bankStats.byCategory.TIU : 500}
                </p>
                <p className="text-[11px] text-slate-500">+5 / 0 · PG 80</p>
              </div>
              <div className="px-2">
                <p className="text-[11px] font-semibold text-slate-500">TKP</p>
                <p className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                  {bankStats ? bankStats.byCategory.TKP : 375}
                </p>
                <p className="text-[11px] text-slate-500">Poin 1–5 · PG 166</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-mono tabular-nums pt-1">
              <span>Total Sesi SKD: {skdSessions.length}</span>
              <span>Lulus PG: {skdPassed}/{skdCompleted.length}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              data-testid="portal-skd-start"
              onClick={() => navigate('/dashboard/skd')}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 whitespace-nowrap"
            >
              <span>Masuk Portal SKD</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/test/skd/setup')}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              <span>Setup Ujian</span>
            </button>
          </div>
        </article>

        {/* Card 2: Portal Persiapan SKB IT */}
        <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 sm:p-7 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white">
                  <Cpu className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Portal 2 · Pranata Komputer / IT
                  </p>
                  <h2 className="text-xl font-bold text-slate-900">
                    Simulasi SKB Bidang IT
                  </h2>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums shrink-0">
                {bankStats ? `${bankStats.skbTotal.toLocaleString('id-ID')} Soal` : '200 Soal'}
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Tersedia Mode Real BKN (100 soal IT · 90 menit · maks skor 500) dan Mode Latihan kustom (20/50/75 soal) dengan skoring mutlak (+5 / 0).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 rounded-lg border border-slate-200 bg-slate-50/70 py-3 text-center">
              <div className="px-2 py-1 sm:py-0">
                <p className="text-[11px] font-semibold text-slate-500">RPL</p>
                <p className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                  {bankStats ? bankStats.byCategory.RPL : 50}
                </p>
              </div>
              <div className="px-2 py-1 sm:py-0">
                <p className="text-[11px] font-semibold text-slate-500">Basis Data</p>
                <p className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                  {bankStats ? bankStats.byCategory.BASIS_DATA : 50}
                </p>
              </div>
              <div className="px-2 py-1 sm:py-0">
                <p className="text-[11px] font-semibold text-slate-500">Manajemen Data</p>
                <p className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                  {bankStats ? bankStats.byCategory.MANAJEMEN_DATA : 50}
                </p>
              </div>
              <div className="px-2 py-1 sm:py-0">
                <p className="text-[11px] font-semibold text-slate-500">Jaringan</p>
                <p className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                  {bankStats ? bankStats.byCategory.JARINGAN_DASAR : 50}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-mono tabular-nums pt-1">
              <span>Total Sesi SKB: {skbSessions.length}</span>
              <span>
                Rata-rata Penguasaan: {skbAvgPct !== null ? `${skbAvgPct}%` : 'Belum ada data'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              data-testid="portal-skb-start"
              onClick={() => navigate('/dashboard/skb')}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 whitespace-nowrap"
            >
              <span>Masuk Portal SKB</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/test/skb/setup')}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              <span>Setup Ujian</span>
            </button>
          </div>
        </article>
      </section>

      {/* Isolated History Tabs Section */}
      <section aria-labelledby="portal-history-heading" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="portal-history-heading"
              className="text-xl font-bold text-slate-900"
            >
              Riwayat Sesi Ujian Terpisah
            </h2>
            <p className="text-sm text-slate-600">
              Sesi SKD dan SKB disimpan serta diurutkan secara terpisah agar pelacakan progres tidak bercampur.
            </p>
          </div>

          {/* Strict SKD / SKB Tabs */}
          <div
            role="tablist"
            aria-label="Pilih riwayat ujian SKD atau SKB"
            className="inline-flex items-center gap-1 rounded-lg bg-slate-200/70 p-1 self-start sm:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={historyTab === 'SKD'}
              onClick={() => setHistoryTab('SKD')}
              className={`rounded-md px-4 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                historyTab === 'SKD'
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Riwayat SKD ({skdSessions.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={historyTab === 'SKB'}
              onClick={() => setHistoryTab('SKB')}
              className={`rounded-md px-4 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                historyTab === 'SKB'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Riwayat SKB ({skbSessions.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 space-y-3">
            <div className="h-10 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-10 w-full animate-pulse rounded bg-slate-100" />
          </div>
        ) : historyTab === 'SKD' ? (
          <SessionHistoryTable
            examType="SKD"
            sessions={skdSessions}
            onOpenSession={openSessionById}
            onDeleteSession={removeSession}
            emptyActionLabel="Mulai SKD Session 1"
            onEmptyAction={() => navigate('/test/skd/setup')}
          />
        ) : (
          <SessionHistoryTable
            examType="SKB"
            sessions={skbSessions}
            onOpenSession={openSessionById}
            onDeleteSession={removeSession}
            emptyActionLabel="Mulai SKB Session 1"
            onEmptyAction={() => navigate('/test/skb/setup')}
          />
        )}
      </section>
    </main>
  );
};
