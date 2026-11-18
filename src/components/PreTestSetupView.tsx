import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Cpu,
  EyeOff,
  Info,
  Lock,
  Play,
  ShieldCheck,
  Shuffle,
  SlidersHorizontal,
} from 'lucide-react';
import { useExamContext } from '../context/ExamContext';
import type {
  ExamType,
  PracticeQuantityOption,
  SessionMode,
  TimeMode,
} from '../shared/types';

interface PreTestSetupViewProps {
  examType: ExamType;
}

const PRACTICE_SKD_OPTIONS: Array<{
  value: PracticeQuantityOption;
  title: string;
  breakdown: string;
  timedMinutes: number;
}> = [
  {
    value: 20,
    title: '20 Soal',
    breakdown: '6 TWK · 6 TIU · 8 TKP',
    timedMinutes: 18,
  },
  {
    value: 50,
    title: '50 Soal',
    breakdown: '14 TWK · 16 TIU · 20 TKP',
    timedMinutes: 45,
  },
  {
    value: 75,
    title: '75 Soal',
    breakdown: '20 TWK · 24 TIU · 31 TKP',
    timedMinutes: 68,
  },
];

const PRACTICE_SKB_OPTIONS: Array<{
  value: PracticeQuantityOption;
  title: string;
  breakdown: string;
  timedMinutes: number;
}> = [
  {
    value: 20,
    title: '20 Soal',
    breakdown: '5 RPL · 5 DB · 5 Manaj. Data · 5 Jaringan',
    timedMinutes: 18,
  },
  {
    value: 50,
    title: '50 Soal',
    breakdown: '13 RPL · 13 DB · 12 Manaj. Data · 12 Jaringan',
    timedMinutes: 45,
  },
  {
    value: 75,
    title: '75 Soal',
    breakdown: '19 RPL · 19 DB · 19 Manaj. Data · 18 Jaringan',
    timedMinutes: 68,
  },
];

export const PreTestSetupView: React.FC<PreTestSetupViewProps> = ({ examType }) => {
  const {
    navigate,
    preferredSetupMode,
    startSkdSimulation,
    startSkbSimulation,
    creating,
    error,
    bankStats,
  } = useExamContext();

  const [sessionMode, setSessionMode] = useState<SessionMode>(preferredSetupMode);
  const [practiceTotal, setPracticeTotal] = useState<PracticeQuantityOption>(20);
  const [modeWaktu, setModeWaktu] = useState<TimeMode>('TIMED');

  useEffect(() => {
    setSessionMode(preferredSetupMode);
  }, [preferredSetupMode]);

  const isSkb = examType === 'SKB';
  const isReal = sessionMode === 'REAL';
  const practiceOptions = isSkb ? PRACTICE_SKB_OPTIONS : PRACTICE_SKD_OPTIONS;
  const activePracticeOpt =
    practiceOptions.find((o) => o.value === practiceTotal) ?? practiceOptions[0];

  const displayTotalSoal = isReal ? (isSkb ? 100 : 110) : activePracticeOpt.value;
  const displayMinutes = isReal
    ? isSkb
      ? 90
      : 100
    : activePracticeOpt.timedMinutes;

  const handleSubmit = async () => {
    if (isSkb) {
      await startSkbSimulation(
        isReal
          ? { sessionMode: 'REAL' }
          : {
              sessionMode: 'PRACTICE',
              totalSoal: practiceTotal,
              modeWaktu,
            }
      );
    } else {
      await startSkdSimulation(
        isReal
          ? { sessionMode: 'REAL' }
          : {
              sessionMode: 'PRACTICE',
              totalSoal: practiceTotal,
              modeWaktu,
            }
      );
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="space-y-1.5">
        <button
          type="button"
          onClick={() => navigate(isSkb ? '/dashboard/skb' : '/dashboard/skd')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Kembali ke Dashboard {examType}</span>
        </button>

        <div className="flex items-center gap-2.5 pt-1">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white ${
              isSkb ? 'bg-emerald-700' : 'bg-blue-900'
            }`}
          >
            {isSkb ? (
              <Cpu className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isSkb
                ? 'Pengaturan Sesi SKB (Pranata Komputer / IT)'
                : 'Pengaturan Sesi SKD CPNS'}
            </h1>
            <p className="text-sm text-slate-600">
              Pilih Mode Real Ujian (terkunci standar BKN) atau Mode Latihan (kustomisasi jumlah soal &amp; timer).
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      {/* Step 1: Primary Mode Switcher (Pilihan A vs Pilihan B) */}
      <section
        aria-label="Pilih mode pengerjaan"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <button
          type="button"
          data-testid="setup-mode-real"
          onClick={() => setSessionMode('REAL')}
          className={`flex items-start gap-3.5 rounded-xl border p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 ${
            isReal
              ? isSkb
                ? 'border-emerald-700 bg-emerald-50/70 ring-1 ring-emerald-700 focus-visible:ring-emerald-700'
                : 'border-blue-900 bg-blue-50/70 ring-1 ring-blue-900 focus-visible:ring-blue-900'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              isReal
                ? isSkb
                  ? 'bg-emerald-700 text-white'
                  : 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pilihan A · Terkunci Resmi
            </p>
            <p className="text-base font-bold text-slate-900">
              Mode Real Ujian (Simulasi BKN)
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isSkb
                ? 'Tepat 100 soal IT · 90 menit terkunci · Ikon bantuan (i) dinonaktifkan selama ujian.'
                : 'Tepat 110 soal (30 TWK, 35 TIU, 45 TKP) · 100 menit terkunci · Ikon (i) dinonaktifkan.'}
            </p>
          </div>
        </button>

        <button
          type="button"
          data-testid="setup-mode-practice"
          onClick={() => setSessionMode('PRACTICE')}
          className={`flex items-start gap-3.5 rounded-xl border p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 ${
            !isReal
              ? isSkb
                ? 'border-emerald-700 bg-emerald-50/70 ring-1 ring-emerald-700 focus-visible:ring-emerald-700'
                : 'border-blue-900 bg-blue-50/70 ring-1 ring-blue-900 focus-visible:ring-blue-900'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              !isReal
                ? isSkb
                  ? 'bg-emerald-700 text-white'
                  : 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pilihan B · Kustomisasi
            </p>
            <p className="text-base font-bold text-slate-900">
              Mode Latihan (Bebas Atur)
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pilih 20, 50, atau 75 soal proporsional · Dengan waktu atau tanpa waktu · Bantuan (i) aktif.
            </p>
          </div>
        </button>
      </section>

      {/* Main Configuration / Locked Rules Card */}
      <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="grid grid-cols-1 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 lg:grid-cols-12">
          {/* Left 7 cols: Either Locked Real Specs OR Practice Custom Controls */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            {isReal ? (
              <div className="space-y-5" data-testid="real-mode-locked-panel">
                <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Konfigurasi Terkunci Simulasi BKN ({examType})
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Pengaturan tidak dapat diubah agar sesuai standar resmi CAT BKN.
                    </p>
                  </div>
                  <Lock className="h-5 w-5 text-slate-400 shrink-0" aria-hidden="true" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {isSkb ? (
                    <>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-1">
                        <p className="text-slate-500">Kuantitas &amp; Komposisi</p>
                        <p className="text-sm font-bold text-slate-900 font-mono">
                          100 Soal Teknis IT
                        </p>
                        <p className="text-slate-600 font-mono">
                          25 RPL · 25 DB · 25 Manaj. Data · 25 Jaringan
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-1">
                        <p className="text-slate-500">Durasi &amp; Penilaian</p>
                        <p className="text-sm font-bold text-slate-900 font-mono">
                          90 Menit Terkunci
                        </p>
                        <p className="text-slate-600">
                          Mutlak +5 benar / 0 salah · Skor maksimal 500
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-1">
                        <p className="text-slate-500">Kuantitas &amp; Rasio Wajib</p>
                        <p className="text-sm font-bold text-slate-900 font-mono">
                          110 Soal SKD
                        </p>
                        <p className="text-slate-600 font-mono">
                          30 TWK · 35 TIU · 45 TKP
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-1">
                        <p className="text-slate-500">Durasi &amp; Passing Grade</p>
                        <p className="text-sm font-bold text-slate-900 font-mono">
                          100 Menit Terkunci
                        </p>
                        <p className="text-slate-600 font-mono">
                          TWK ≥ 65 · TIU ≥ 80 · TKP ≥ 166
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 flex items-start gap-3">
                  <EyeOff className="h-5 w-5 text-amber-800 shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-amber-950">
                      Ikon Bantuan (i) Dinonaktifkan Selama Ujian Real
                    </p>
                    <p className="text-amber-900/90 leading-relaxed">
                      Untuk menciptakan tekanan simulasi CAT yang autentik, kunci jawaban dan pembahasan langkah demi langkah tidak dapat diakses selama sesi berlangsung. Seluruh pembahasan (i) otomatis terbuka di halaman Evaluasi setelah Anda mengumpulkan ujian.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6" data-testid="practice-mode-custom-panel">
                {/* Quantity Selector: 20, 50, or 75 */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-900">
                    1. Pilih Total Soal Latihan (Dibagi Proporsional)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {practiceOptions.map((opt) => {
                      const active = practiceTotal === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          data-testid={`practice-qty-${opt.value}`}
                          onClick={() => setPracticeTotal(opt.value)}
                          className={`rounded-lg border p-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 ${
                            active
                              ? isSkb
                                ? 'border-emerald-700 bg-emerald-50/70 ring-1 ring-emerald-700'
                                : 'border-blue-800 bg-blue-50/70 ring-1 ring-blue-800'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <p className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                            {opt.title}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-600 font-mono leading-snug">
                            {opt.breakdown}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Mode Toggle */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-900">
                    2. Pengaturan Waktu Mode Latihan
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      data-testid="practice-time-timed"
                      onClick={() => setModeWaktu('TIMED')}
                      className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                        modeWaktu === 'TIMED'
                          ? isSkb
                            ? 'border-emerald-700 bg-emerald-50/70 ring-1 ring-emerald-700'
                            : 'border-blue-800 bg-blue-50/70 ring-1 ring-blue-800'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <Clock
                        className={`mt-0.5 h-5 w-5 shrink-0 ${
                          modeWaktu === 'TIMED'
                            ? isSkb
                              ? 'text-emerald-700'
                              : 'text-blue-900'
                            : 'text-slate-400'
                        }`}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Dengan Waktu (Proporsional)
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600 font-mono tabular-nums">
                          Countdown {activePracticeOpt.timedMinutes} menit · Auto-submit saat habis
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      data-testid="practice-time-untimed"
                      onClick={() => setModeWaktu('UNTIMED')}
                      className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                        modeWaktu === 'UNTIMED'
                          ? isSkb
                            ? 'border-emerald-700 bg-emerald-50/70 ring-1 ring-emerald-700'
                            : 'border-blue-800 bg-blue-50/70 ring-1 ring-blue-800'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <Clock
                        className={`mt-0.5 h-5 w-5 shrink-0 ${
                          modeWaktu === 'UNTIMED'
                            ? isSkb
                              ? 'text-emerald-700'
                              : 'text-blue-900'
                            : 'text-slate-400'
                        }`}
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Tanpa Waktu (Santai)
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600">
                          Bebas pelajari soal &amp; buka pembahasan (i) tanpa tekanan timer
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right 5 cols: Scoring Rule & Start CTA */}
          <div className="lg:col-span-5 bg-slate-50/80 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-900">
                Ringkasan Sesi {examType} ({isReal ? 'Mode Real BKN' : 'Mode Latihan'})
              </h2>

              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <Shuffle className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong className="text-slate-800">Pengacakan Prioritas Baru:</strong>{' '}
                    Sistem mendahulukan soal {examType} yang belum pernah keluar di sesi sebelumnya (
                    {isSkb
                      ? `${bankStats?.skbTotal ?? 200} soal IT`
                      : `${bankStats?.skdTotal ?? 1250} soal SKD`}
                    ).
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 mt-0.5 ${
                      isSkb ? 'text-emerald-700' : 'text-blue-900'
                    }`}
                    aria-hidden="true"
                  />
                  {isSkb ? (
                    <span>
                      <strong className="text-slate-800">Skoring Mutlak SKB:</strong>{' '}
                      Benar = <strong className="text-slate-900">+5</strong>, Salah/Kosong ={' '}
                      <strong className="text-slate-900">0</strong> di seluruh 4 kategori IT.
                    </span>
                  ) : (
                    <span>
                      <strong className="text-slate-800">Skoring Resmi SKD:</strong>{' '}
                      TWK &amp; TIU <strong className="text-slate-900">+5 / 0</strong>, TKP berbobot{' '}
                      <strong className="text-slate-900">1–5</strong>, disertai evaluasi Passing Grade.
                    </span>
                  )}
                </li>

                <li className="flex items-start gap-2.5">
                  {isReal ? (
                    <EyeOff className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <Info className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <span>
                    <strong className="text-slate-800">
                      Bantuan Pembahasan (i):
                    </strong>{' '}
                    {isReal
                      ? 'Dinonaktifkan saat ujian berlangsung, baru terbuka di halaman Hasil.'
                      : 'Aktif secara real-time di setiap butir soal selama latihan.'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-600">
                <span>Tipe Sesi</span>
                <span className="font-bold text-slate-900">
                  {isReal ? 'Mode Real Ujian' : 'Mode Latihan'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-600">
                <span>Total Soal Sesi</span>
                <span className="font-bold text-slate-900">{displayTotalSoal} Soal</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-600">
                <span>Batas Waktu</span>
                <span className="font-bold text-slate-900">
                  {isReal || modeWaktu === 'TIMED'
                    ? `${displayMinutes} Menit`
                    : 'Tanpa Batas Waktu'}
                </span>
              </div>

              <button
                type="button"
                disabled={creating}
                onClick={handleSubmit}
                data-testid="start-exam-button"
                className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold text-white transition-colors disabled:opacity-60 ${
                  isSkb
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : 'bg-blue-900 hover:bg-blue-800'
                }`}
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                <span>
                  {creating
                    ? 'Menyiapkan Soal Acak...'
                    : isReal
                    ? `Mulai Ujian Real ${examType}`
                    : `Mulai Latihan ${examType}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
