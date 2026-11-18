import React, { useMemo } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Cpu,
  EyeOff,
  Play,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react';
import { useExamContext } from '../context/ExamContext';
import type { SkbCategory } from '../shared/types';
import { formatCategoryLabel } from '../utils/formatters';
import { AnalyticsChart } from './AnalyticsChart';
import { SessionHistoryTable } from './SessionHistoryTable';

const SKB_ORDER: SkbCategory[] = [
  'RPL',
  'BASIS_DATA',
  'MANAJEMEN_DATA',
  'JARINGAN_DASAR',
];

export const SkbDashboardView: React.FC = () => {
  const {
    navigate,
    bankStats,
    skbSessions,
    startSkbSimulation,
    creating,
    openSessionById,
    removeSession,
  } = useExamContext();

  const stats = useMemo(() => {
    const completed = skbSessions.filter((s) => s.status === 'COMPLETED');
    const avgPct =
      completed.length > 0
        ? Math.round(
            (completed.reduce((acc, s) => acc + s.persentase_total, 0) /
              completed.length) *
              10
          ) / 10
        : null;
    const bestPct =
      completed.length > 0
        ? Math.max(...completed.map((s) => s.persentase_total))
        : null;

    const domainTotals = new Map<SkbCategory, { score: number; max: number }>();
    for (const cat of SKB_ORDER) domainTotals.set(cat, { score: 0, max: 0 });

    for (const s of completed) {
      for (const b of s.breakdown_skor) {
        if (domainTotals.has(b.kategori as SkbCategory)) {
          const cur = domainTotals.get(b.kategori as SkbCategory)!;
          cur.score += b.skor;
          cur.max += b.skorMaksimal;
        }
      }
    }

    const domainMastery = SKB_ORDER.map((cat) => {
      const d = domainTotals.get(cat)!;
      const pct = d.max > 0 ? Math.round((d.score * 1000) / d.max) / 10 : null;
      return {
        kategori: cat,
        nama: formatCategoryLabel(cat),
        pct,
        bankCount: bankStats?.byCategory[cat] ?? 50,
      };
    });

    const latestRecommendations = completed[0]?.topik_rekomendasi ?? [];

    return {
      total: skbSessions.length,
      completedCount: completed.length,
      avgPct,
      bestPct,
      domainMastery,
      latestRecommendations,
    };
  }, [skbSessions, bankStats]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Cpu className="h-4 w-4" aria-hidden="true" />
            <span>Modul SKB · Pranata Komputer / IT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Dashboard &amp; Portal Sesi SKB IT
          </h1>
          <p className="text-sm text-slate-600">
            Pilih antara simulasi resmi 100 soal IT (90 menit, skor maks 500) atau mode latihan kustom.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/bank', { bankExamType: 'SKB' })}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap"
          >
            <BookOpen className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            <span>Bank Soal SKB IT</span>
          </button>
        </div>
      </section>

      {/* Two-Choice Session Mode Selector */}
      <section aria-labelledby="skb-mode-choice-heading" className="space-y-3">
        <h2 id="skb-mode-choice-heading" className="text-base font-bold text-slate-900">
          Pilih Tipe Sesi Ujian SKB IT
        </h2>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Option A: Mode Real Ujian */}
          <article className="flex flex-col justify-between rounded-xl border border-emerald-200 bg-white p-6 space-y-5">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white">
                    <Cpu className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Pilihan A · Terkunci Standar BKN
                    </p>
                    <h3 className="text-lg font-bold text-slate-900">
                      Mode Real Ujian (Simulasi BKN)
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Simulasi penuh 100 soal teknis IT dengan penilaian mutlak (+5 benar, 0 salah/kosong, maks 500). Timer terkunci 90 menit dan bantuan pembahasan disembunyikan hingga ujian selesai.
              </p>

              <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 bg-slate-50/70 py-2.5 text-center text-xs">
                <div className="px-2">
                  <p className="text-slate-500">Total Soal IT</p>
                  <p className="font-mono font-bold text-slate-900 tabular-nums">
                    100 Soal
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">Maks Skor 500</p>
                </div>
                <div className="px-2">
                  <p className="text-slate-500">Waktu Terkunci</p>
                  <p className="font-mono font-bold text-slate-900 tabular-nums">
                    90 Menit
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
                data-testid="dashboard-skb-start-real"
                onClick={() => void startSkbSimulation({ sessionMode: 'REAL' })}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60 whitespace-nowrap"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                <span>{creating ? 'Menyiapkan Soal...' : 'Mulai Mode Real (100 Soal)'}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/test/skb/setup', { setupMode: 'REAL' })}
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
                Pilih 20, 50, atau 75 soal teknis IT secara proporsional di 4 pilar materi, pilih timer proporsional atau tanpa waktu, serta aktifkan bantuan pembahasan (i) kapan saja.
              </p>

              <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-lg border border-slate-200 bg-slate-50/70 py-2.5 text-center text-xs">
                <div className="px-2">
                  <p className="text-slate-500">Kuantitas Soal</p>
                  <p className="font-mono font-bold text-slate-900 tabular-nums">
                    20 / 50 / 75
                  </p>
                  <p className="text-[11px] text-slate-500">4 pilar materi IT</p>
                </div>
                <div className="px-2">
                  <p className="text-slate-500">Pengaturan Waktu</p>
                  <p className="font-semibold text-slate-900">Fleksibel</p>
                  <p className="text-[11px] text-slate-500">Timer / Tanpa Waktu</p>
                </div>
                <div className="px-2">
                  <p className="text-slate-500">Bantuan (i)</p>
                  <p className="font-semibold text-emerald-700">Aktif Langsung</p>
                  <p className="text-[11px] text-slate-500">Penjelasan teknis</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                data-testid="dashboard-skb-setup-practice"
                onClick={() => navigate('/test/skb/setup', { setupMode: 'PRACTICE' })}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-emerald-700 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 whitespace-nowrap"
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
          <p className="text-xs font-semibold text-slate-500">Total Sesi SKB</p>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {stats.total}
          </p>
          <p className="text-xs text-slate-500 font-mono tabular-nums">
            {stats.completedCount} selesai dinilai
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1">
          <p className="text-xs font-semibold text-slate-500">Rata-rata Penguasaan</p>
          <p className="text-2xl font-bold text-emerald-800 font-mono tabular-nums">
            {stats.avgPct !== null ? `${stats.avgPct}%` : '—'}
          </p>
          <p className="text-xs text-slate-500">Akumulasi semua sesi SKB</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1">
          <p className="text-xs font-semibold text-slate-500">Skor Tertinggi</p>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {stats.bestPct !== null ? `${stats.bestPct}%` : '—'}
          </p>
          <p className="text-xs text-slate-500">Penilaian mutlak (+5 / 0)</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1">
          <p className="text-xs font-semibold text-slate-500">Bank Soal SKB IT</p>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {bankStats ? bankStats.skbTotal.toLocaleString('id-ID') : '200'}
          </p>
          <p className="text-xs text-slate-500 font-mono tabular-nums">
            50 soal per kategori IT
          </p>
        </div>
      </section>

      {/* Chart & IT Domain Mastery Breakdown */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              <h2 className="text-base font-bold text-slate-900">
                Tren Penguasaan SKB IT
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Maks. 8 sesi terakhir
            </span>
          </div>
          <AnalyticsChart sessions={skbSessions} examType="SKB" />
        </div>

        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Penguasaan per Pilar Materi IT
          </h2>

          <div className="space-y-4">
            {stats.domainMastery.map((dom) => (
              <div key={dom.kategori} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{dom.nama}</span>
                  <span className="font-mono font-bold text-slate-700 tabular-nums">
                    {dom.pct !== null ? `${dom.pct}%` : `${dom.bankCount} soal tersedia`}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      dom.pct === null
                        ? 'bg-slate-200'
                        : dom.pct >= 70
                        ? 'bg-emerald-600'
                        : dom.pct >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${dom.pct ?? 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {stats.latestRecommendations.length > 0 && (
            <div className="border-t border-slate-200 pt-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Prioritas Belajar dari Sesi Terakhir</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-600 list-disc pl-4">
                {stats.latestRecommendations.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Recent SKB History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Riwayat Sesi SKB Terbaru</h2>
          <button
            type="button"
            onClick={() => navigate('/history/skb')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline"
          >
            <span>Lihat semua riwayat SKB</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <SessionHistoryTable
          examType="SKB"
          sessions={skbSessions.slice(0, 5)}
          onOpenSession={openSessionById}
          onDeleteSession={removeSession}
          emptyActionLabel="Mulai Simulasi SKB"
          onEmptyAction={() => navigate('/test/skb/setup')}
        />
      </section>
    </main>
  );
};
