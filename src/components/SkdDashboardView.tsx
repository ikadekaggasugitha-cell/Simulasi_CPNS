import React, { useMemo } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  EyeOff,
  Play,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react';
import { useExamContext } from '../context/ExamContext';
import { AnalyticsChart } from './AnalyticsChart';
import { SessionHistoryTable } from './SessionHistoryTable';

export const SkdDashboardView: React.FC = () => {
  const {
    navigate,
    bankStats,
    skdSessions,
    startSkdSimulation,
    creating,
    openSessionById,
    removeSession,
  } = useExamContext();

  const stats = useMemo(() => {
    const completed = skdSessions.filter((s) => s.status === 'COMPLETED');
    const passed = completed.filter((s) => s.lulus_passing_grade).length;
    const avgPct =
      completed.length > 0
        ? Math.round(
            (completed.reduce((acc, s) => acc + s.persentase_total, 0) /
              completed.length) *
              10
          ) / 10
        : null;

    return {
      total: skdSessions.length,
      completedCount: completed.length,
      passed,
      avgPct,
    };
  }, [skdSessions]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>Modul Seleksi Kompetensi Dasar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Dashboard &amp; Portal Sesi SKD
          </h1>
          <p className="text-sm text-slate-600">
            Pilih antara simulasi resmi CAT BKN terkunci atau mode latihan kustom untuk TWK, TIU, dan TKP.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/bank', { bankExamType: 'SKD' })}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
          >
            <BookOpen className="h-4 w-4 text-blue-900" aria-hidden="true" />
            <span>Bank Soal SKD</span>
          </button>
        </div>
      </section>

      {/* Two-Choice Session Mode Selector */}
      <section aria-labelledby="skd-mode-choice-heading" className="space-y-3">
        <h2 id="skd-mode-choice-heading" className="text-base font-bold text-slate-900">
          Pilih Tipe Sesi Ujian SKD
        </h2>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Option A: Mode Real Ujian */}
          <article className="flex flex-col justify-between rounded-xl border border-blue-200 bg-white p-6 space-y-5">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-900 text-white">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      Pilihan A · Terkunci Standar BKN
                    </p>
                    <h3 className="text-lg font-bold text-slate-900">
                      Mode Real Ujian (Simulasi BKN)
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Simulasi tekanan ujian resmi CAT BKN tanpa pengubahan konfigurasi. Seluruh parameter soal, waktu, dan pembatasan bantuan dikunci sesuai aturan nasional.
              </p>

              <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 bg-slate-50/70 py-2.5 text-center text-xs">
                <div className="px-2">
                  <p className="text-slate-500">Total Soal</p>
                  <p className="font-mono font-bold text-slate-900 tabular-nums">
                    110 Soal
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">30 / 35 / 45</p>
                </div>
                <div className="px-2">
                  <p className="text-slate-500">Waktu Terkunci</p>
                  <p className="font-mono font-bold text-slate-900 tabular-nums">
                    100 Menit
                  </p>
                  <p className="text-[11px] text-slate-500">Auto-submit</p>
                </div>
                <div className="px-2">
                  <p className="text-slate-500">Bantuan (i)</p>
                  <p className="font-semibold text-red-700 inline-flex items-center gap-1 justify-center">
                    <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Nonaktif</span>
                  </p>
                  <p className="text-[11px] text-slate-500">Buka di Hasil</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={creating}
                data-testid="dashboard-skd-start-real"
                onClick={() => void startSkdSimulation({ sessionMode: 'REAL' })}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60 whitespace-nowrap"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                <span>{creating ? 'Menyiapkan Soal...' : 'Mulai Mode Real (110 Soal)'}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/test/skd/setup', { setupMode: 'REAL' })}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
              >
                <span>Detail Aturan</span>
              </button>
            </div>
          </article>

          {/* Option B: Mode Latihan (Kustomisasi) */}
          <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 space-y-5">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white">
                    <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Pilihan B · Belajar Interaktif
                    </p>
                    <h3 className="text-lg font-bold text-slate-900">
                      Mode Latihan (Kustomisasi)
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Sesuaikan paket latihan proporsional 20, 50, atau 75 soal dengan pilihan timer atau tanpa batas waktu. Bantuan pembahasan (i) aktif langsung selama mengerjakan.
              </p>

              <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 bg-slate-50/70 py-2.5 text-center text-xs">
                <div className="px-2">
                  <p className="text-slate-500">Kuantitas Soal</p>
                  <p className="font-mono font-bold text-slate-900 tabular-nums">
                    20 / 50 / 75
                  </p>
                  <p className="text-[11px] text-slate-500">Rasio TWK/TIU/TKP</p>
                </div>
                <div className="px-2">
                  <p className="text-slate-500">Pengaturan Waktu</p>
                  <p className="font-semibold text-slate-900">Fleksibel</p>
                  <p className="text-[11px] text-slate-500">Timer / Tanpa Waktu</p>
                </div>
                <div className="px-2">
                  <p className="text-slate-500">Bantuan (i)</p>
                  <p className="font-semibold text-emerald-700">Aktif Langsung</p>
                  <p className="text-[11px] text-slate-500">Modal langkah HOTS</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                data-testid="dashboard-skd-setup-practice"
                onClick={() => navigate('/test/skd/setup', { setupMode: 'PRACTICE' })}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-900 bg-white px-4 py-2.5 text-sm font-semibold text-blue-900 hover:bg-blue-50 whitespace-nowrap"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                <span>Atur &amp; Mulai Mode Latihan</span>
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* KPI Strip */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1">
          <p className="text-xs font-semibold text-slate-500">Total Sesi SKD</p>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {stats.total}
          </p>
          <p className="text-xs text-slate-500 font-mono tabular-nums">
            {stats.completedCount} selesai dinilai
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1">
          <p className="text-xs font-semibold text-slate-500">Lulus Passing Grade</p>
          <p className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            {stats.passed}
            <span className="text-sm font-normal text-slate-500">
              {' '}
              / {stats.completedCount}
            </span>
          </p>
          <p className="text-xs text-slate-500">TWK, TIU &amp; TKP tercapai</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1">
          <p className="text-xs font-semibold text-slate-500">Rata-rata Capaian</p>
          <p className="text-2xl font-bold text-blue-900 font-mono tabular-nums">
            {stats.avgPct !== null ? `${stats.avgPct}%` : '—'}
          </p>
          <p className="text-xs text-slate-500">Dari skor maksimal sesi</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1">
          <p className="text-xs font-semibold text-slate-500">Bank Soal HOTS SKD</p>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {bankStats ? bankStats.skdTotal.toLocaleString('id-ID') : '1.250'}
          </p>
          <p className="text-xs text-slate-500 font-mono tabular-nums">
            TWK {bankStats?.byCategory.TWK ?? 375} · TIU {bankStats?.byCategory.TIU ?? 500} · TKP {bankStats?.byCategory.TKP ?? 375}
          </p>
        </div>
      </section>

      {/* Chart & Passing Grade Reference */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-900" aria-hidden="true" />
              <h2 className="text-base font-bold text-slate-900">
                Tren Capaian Skor SKD
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Maks. 8 sesi terakhir
            </span>
          </div>
          <AnalyticsChart sessions={skdSessions} examType="SKD" />
        </div>

        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            <h2 className="text-base font-bold text-slate-900">
              Standar Passing Grade BKN
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ambang batas resmi PermenPANRB pada Mode Real 110 soal (100 menit). Mode Latihan 20/50/75 soal diskalakan proporsional.
          </p>

          <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-slate-50/70 text-xs">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-bold text-slate-900">TWK (30 Soal)</p>
                <p className="text-slate-500">Benar +5, Salah/Kosong 0</p>
              </div>
              <span className="font-mono font-bold text-blue-900 tabular-nums">
                ≥ 65 / 150
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-bold text-slate-900">TIU (35 Soal)</p>
                <p className="text-slate-500">Benar +5, Salah/Kosong 0</p>
              </div>
              <span className="font-mono font-bold text-blue-900 tabular-nums">
                ≥ 80 / 175
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-bold text-slate-900">TKP (45 Soal)</p>
                <p className="text-slate-500">Bobot opsi bergradasi 1–5</p>
              </div>
              <span className="font-mono font-bold text-blue-900 tabular-nums">
                ≥ 166 / 225
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent SKD History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Riwayat Sesi SKD Terbaru</h2>
          <button
            type="button"
            onClick={() => navigate('/history/skd')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 hover:underline"
          >
            <span>Lihat semua riwayat SKD</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <SessionHistoryTable
          examType="SKD"
          sessions={skdSessions.slice(0, 5)}
          onOpenSession={openSessionById}
          onDeleteSession={removeSession}
          emptyActionLabel="Mulai Simulasi SKD"
          onEmptyAction={() => navigate('/test/skd/setup')}
        />
      </section>
    </main>
  );
};
