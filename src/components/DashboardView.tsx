import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  SlidersHorizontal,
  Trash2,
  XCircle,
} from 'lucide-react';
import type {
  QuestionBankStats,
  SessionSummary,
  TimeMode,
} from '../shared/types';
import {
  formatDateTimeId,
  formatDurationHuman,
} from '../utils/formatters';

interface DashboardViewProps {
  sessions: SessionSummary[];
  bankStats: QuestionBankStats | null;
  loading: boolean;
  creating: boolean;
  error: string | null;
  jumlahPerKategori: 20 | 50 | 75;
  modeWaktu: TimeMode;
  historyFilter: 'ALL' | 'TIMED' | 'UNTIMED';
  focusHistorySection: boolean;
  onChangeJumlah: (val: 20 | 50 | 75) => void;
  onChangeModeWaktu: (val: TimeMode) => void;
  onChangeHistoryFilter: (val: 'ALL' | 'TIMED' | 'UNTIMED') => void;
  onStartSession: () => void;
  onOpenSession: (session: SessionSummary) => void;
  onDeleteSession: (sessionId: number) => void;
  onBrowseBank: () => void;
  onGoToSetup: () => void;
}

const QUANTITY_OPTIONS: Array<{
  value: 20 | 50 | 75;
  label: string;
  total: number;
  minutes: number;
}> = [
  { value: 20, label: '20 Soal / Tes', total: 60, minutes: 55 },
  { value: 50, label: '50 Soal / Tes', total: 150, minutes: 135 },
  { value: 75, label: '75 Soal / Tes', total: 225, minutes: 200 },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  sessions,
  bankStats,
  loading,
  creating,
  error,
  jumlahPerKategori,
  modeWaktu,
  historyFilter,
  focusHistorySection,
  onChangeJumlah,
  onChangeModeWaktu,
  onChangeHistoryFilter,
  onStartSession,
  onOpenSession,
  onDeleteSession,
  onBrowseBank,
  onGoToSetup,
}) => {
  const [imgError, setImgError] = useState(false);

  const selectedConfig =
    QUANTITY_OPTIONS.find((q) => q.value === jumlahPerKategori) ?? QUANTITY_OPTIONS[0];

  const inProgressSession = sessions.find((s) => s.status === 'IN_PROGRESS') ?? null;

  const filteredSessions = sessions.filter((s) => {
    if (historyFilter === 'ALL') return true;
    return s.mode_waktu === historyFilter;
  });

  const completedSessions = sessions.filter((s) => s.status === 'COMPLETED');
  const bestTotalScore =
    completedSessions.length > 0
      ? Math.max(...completedSessions.map((s) => s.skor_total))
      : null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Resume In-Progress Banner */}
      {inProgressSession && (
        <section
          aria-label="Sesi sedang berlangsung"
          className="flex flex-col gap-4 rounded-xl border border-amber-300 bg-amber-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900">
              {inProgressSession.nama_sesi} masih berlangsung
            </p>
            <p className="text-xs text-slate-600">
              {inProgressSession.jumlah_per_kategori} soal per tes ({inProgressSession.total_soal} soal total) ·{' '}
              {inProgressSession.mode_waktu === 'TIMED'
                ? 'Mode Simulasi Waktu'
                : 'Mode Latihan Tanpa Waktu'}{' '}
              · Dimulai {formatDateTimeId(inProgressSession.created_at)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenSession(inProgressSession)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-800 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            <span>Lanjutkan {inProgressSession.nama_sesi}</span>
          </button>
        </section>
      )}

      {/* Hero & Pre-Test Configurator Split */}
      {!focusHistorySection && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
            {/* Left: Editorial Overview & Image */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="p-6 sm:p-8 space-y-4">
                <p className="text-xs font-semibold tracking-wide text-blue-800">
                  Simulasi Computer Assisted Test · SKD CPNS
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Latihan Terukur untuk Menguasai TWK, TIU, dan TKP Berbasis HOTS
                </h1>
                <p className="text-base leading-relaxed text-slate-600 max-w-2xl">
                  Rancang sesi simulasi mandiri dengan soal teracak otomatis, sistem pembobotan resmi BKN (TWK &amp; TIU +5/0, TKP bobot 1–5), petunjuk langkah penyelesaian langsung di tiap soal, dan evaluasi riwayat hasil belajar.
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={onBrowseBank}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-900 hover:text-blue-700 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 rounded"
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    <span>Jelajahi Bank Soal HOTS ({bankStats?.total ?? 1250} Butir)</span>
                  </button>
                </div>
              </div>

              <div className="relative h-56 sm:h-64 lg:h-full lg:min-h-[240px] border-t border-slate-200 bg-slate-100">
                {!imgError ? (
                  <img
                    src="/src/assets/images/hero_cpns_study_1795011421926.jpg"
                    alt="Suasana ruang belajar persiapan seleksi aparatur sipil negara yang tenang dan terang"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 p-6 text-center">
                    <BookOpen className="h-8 w-8 text-blue-800 mb-2" aria-hidden="true" />
                    <p className="text-sm font-semibold text-slate-800">
                      Ruang Persiapan CAT SKD Nusantara
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Pre-Test Setup Configurator */}
            <div
              id="pretest-setup"
              className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 sm:p-8"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Pengaturan Sesi Ujian
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Pilih kuantitas soal per kategori dan mode waktu pengerjaan.
                    </p>
                  </div>
                  <SlidersHorizontal
                    className="h-5 w-5 text-slate-400 shrink-0 mt-1"
                    aria-hidden="true"
                  />
                </div>

                {/* Kuantitas Soal Per Jenis Tes */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-900">
                    Kuantitas Soal untuk Setiap Jenis Tes (TWK, TIU, TKP)
                  </label>
                  <div
                    role="radiogroup"
                    aria-label="Kuantitas soal per jenis tes"
                    className="grid grid-cols-3 gap-2 rounded-lg bg-slate-100 p-1"
                  >
                    {QUANTITY_OPTIONS.map((opt) => {
                      const active = jumlahPerKategori === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => onChangeJumlah(opt.value)}
                          className={`rounded-md px-3 py-2.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
                            active
                              ? 'bg-white text-blue-950 shadow-sm font-bold'
                              : 'text-slate-600 hover:text-slate-900 font-medium'
                          }`}
                        >
                          <span className="block text-sm font-mono tabular-nums">
                            {opt.value} Soal
                          </span>
                          <span className="block text-[11px] text-slate-500 mt-0.5">
                            Total {opt.total}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-slate-500 font-mono tabular-nums">
                    Komposisi acak: {jumlahPerKategori} TWK · {jumlahPerKategori} TIU ·{' '}
                    {jumlahPerKategori} TKP ({selectedConfig.total} soal)
                  </p>
                </div>

                {/* Toggle Pengaturan Waktu */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-900">
                    Mode Waktu Pengerjaan
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    <button
                      type="button"
                      aria-pressed={modeWaktu === 'TIMED'}
                      onClick={() => onChangeModeWaktu('TIMED')}
                      className={`flex items-start justify-between gap-3 rounded-lg border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
                        modeWaktu === 'TIMED'
                          ? 'border-blue-800 bg-blue-50/70'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="block text-sm font-bold text-slate-900">
                          Gunakan Waktu (Simulasi CPNS)
                        </span>
                        <span className="block text-xs text-slate-600">
                          Countdown timer aktif proporsional standar BKN ({selectedConfig.minutes}{' '}
                          menit) &amp; mencatat waktu selesai.
                        </span>
                      </div>
                      <Clock
                        className={`h-4 w-4 shrink-0 mt-0.5 ${
                          modeWaktu === 'TIMED' ? 'text-blue-800' : 'text-slate-400'
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    <button
                      type="button"
                      aria-pressed={modeWaktu === 'UNTIMED'}
                      onClick={() => onChangeModeWaktu('UNTIMED')}
                      className={`flex items-start justify-between gap-3 rounded-lg border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
                        modeWaktu === 'UNTIMED'
                          ? 'border-blue-800 bg-blue-50/70'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="block text-sm font-bold text-slate-900">
                          Tanpa Waktu (Mode Latihan)
                        </span>
                        <span className="block text-xs text-slate-600">
                          Belajar santai tanpa batas hitung mundur sambil membaca petunjuk (i) tiap soal.
                        </span>
                      </div>
                      <BookOpen
                        className={`h-4 w-4 shrink-0 mt-0.5 ${
                          modeWaktu === 'UNTIMED' ? 'text-blue-800' : 'text-slate-400'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800"
                  >
                    {error}
                  </div>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200">
                <button
                  type="button"
                  disabled={creating}
                  onClick={onStartSession}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                >
                  <span>
                    {creating
                      ? 'Mengacak Soal & Menyiapkan Sesi...'
                      : 'Mulai Ujian'}
                  </span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* 4-Column Summary Strip below Hero */}
          <div className="grid grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 rounded-xl border border-slate-200 bg-white lg:grid-cols-4">
            <div className="p-5">
              <p className="text-xs font-medium text-slate-500">Bank Soal HOTS Terverifikasi</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {bankStats?.total ?? 1250} Soal
              </p>
              <p className="mt-1 text-xs text-slate-500 font-mono tabular-nums">
                {bankStats?.byCategory.TWK ?? 375} TWK · {bankStats?.byCategory.TIU ?? 500} TIU ·{' '}
                {bankStats?.byCategory.TKP ?? 375} TKP
              </p>
            </div>
            <div className="p-5">
              <p className="text-xs font-medium text-slate-500">Aturan Bobot Penilaian</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
                +5 / 1–5
              </p>
              <p className="mt-1 text-xs text-slate-500">
                TWK &amp; TIU benar +5 · TKP poin 1–5
              </p>
            </div>
            <div className="p-5">
              <p className="text-xs font-medium text-slate-500">Total Sesi Tersimpan</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {sessions.length} Sesi
              </p>
              <p className="mt-1 text-xs text-slate-500 font-mono tabular-nums">
                {completedSessions.length} selesai dievaluasi
              </p>
            </div>
            <div className="p-5">
              <p className="text-xs font-medium text-slate-500">Skor Tertinggi Tercatat</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {bestTotalScore !== null ? `${bestTotalScore} Poin` : '—'}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {bestTotalScore !== null
                  ? 'Dari seluruh sesi selesai'
                  : 'Belum ada sesi diselesaikan'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Session History Section */}
      <section aria-labelledby="session-history-heading" className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="session-history-heading"
              className="text-xl font-bold text-slate-900"
            >
              Riwayat Sesi Ujian
            </h2>
            <p className="text-sm text-slate-600">
              Rekam jejak berurutan seluruh simulasi beserta rincian skor TWK, TIU, TKP, waktu selesai, dan durasi.
            </p>
          </div>

          <div
            role="group"
            aria-label="Filter mode waktu riwayat"
            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1 self-start sm:self-auto"
          >
            {(
              [
                { id: 'ALL', label: 'Semua Mode' },
                { id: 'TIMED', label: 'Mode Waktu' },
                { id: 'UNTIMED', label: 'Tanpa Waktu' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeHistoryFilter(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
                  historyFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              <div className="h-10 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-10 w-full animate-pulse rounded bg-slate-100" />
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <p className="text-base font-semibold text-slate-900">
                Belum ada riwayat sesi ujian
              </p>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Mulai simulasi pertama Anda untuk mencatat skor TWK, TIU, dan TKP serta mengevaluasi pembahasan soal.
              </p>
              {focusHistorySection && (
                <button
                  type="button"
                  onClick={onGoToSetup}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  <span>Atur &amp; Mulai Simulasi</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">
                      Sesi
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Mode &amp; Kuantitas
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Tanggal &amp; Waktu Selesai
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-right">
                      TWK
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-right">
                      TIU
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-right">
                      TKP
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-right">
                      Total
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                        {session.nama_sesi}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                        <span>
                          {session.mode_waktu === 'TIMED'
                            ? 'Simulasi Waktu'
                            : 'Mode Latihan'}
                        </span>
                        <span className="mx-1.5 text-slate-300" aria-hidden="true">
                          ·
                        </span>
                        <span className="font-mono tabular-nums">
                          {session.total_soal} soal
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap font-mono tabular-nums">
                        <div>Mulai: {formatDateTimeId(session.created_at)}</div>
                        {session.status === 'COMPLETED' && (
                          <div className="text-slate-500 mt-0.5">
                            {session.mode_waktu === 'TIMED'
                              ? `Selesai: ${formatDateTimeId(session.completed_at)} · Durasi ${formatDurationHuman(session.durasi_pengerjaan_detik)}`
                              : `Durasi: ${formatDurationHuman(session.durasi_pengerjaan_detik)}`}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {session.status === 'COMPLETED' ? session.skor_twk : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {session.status === 'COMPLETED' ? session.skor_tiu : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {session.status === 'COMPLETED' ? session.skor_tkp : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono tabular-nums font-bold text-blue-900">
                        {session.status === 'COMPLETED' ? session.skor_total : '—'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {session.status === 'IN_PROGRESS' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Berlangsung</span>
                          </span>
                        ) : session.lulus_passing_grade ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Lulus PG</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700">
                            <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Belum Lulus PG</span>
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenSession(session)}
                            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
                          >
                            {session.status === 'IN_PROGRESS'
                              ? 'Lanjutkan'
                              : 'Lihat Evaluasi'}
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteSession(session.id)}
                            aria-label={`Hapus ${session.nama_sesi}`}
                            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
