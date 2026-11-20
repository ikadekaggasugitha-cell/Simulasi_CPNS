import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Grid,
  Info,
  MinusCircle,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import type {
  ExamQuestionItem,
  HintResponse,
  QuestionCategory,
  SessionDetailResponse,
} from '../shared/types';
import {
  formatCategoryLabel,
  formatCategoryShort,
  formatDateTimeId,
  formatDurationHuman,
  formatSessionModeLabel,
} from '../utils/formatters';
import { HintModal } from './HintModal';
import { RichQuestionContent } from './RichQuestionContent';

interface ResultViewProps {
  detail: SessionDetailResponse;
  onBackToDashboard: () => void;
  onStartNewSimulation: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  detail,
  onBackToDashboard,
  onStartNewSimulation,
}) => {
  const { session, items } = detail;
  const isSkb = session.exam_type === 'SKB';
  const thresholds = session.passing_thresholds;

  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'WRONG' | 'CORRECT'
  >('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | QuestionCategory>(
    'ALL'
  );
  const [selectedEvaluationItem, setSelectedEvaluationItem] =
    useState<ExamQuestionItem | null>(null);

  const counts = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let empty = 0;
    for (const item of items) {
      if (item.status === 'BENAR') correct++;
      else if (item.status === 'SALAH') wrong++;
      else empty++;
    }
    return { correct, wrong, empty };
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (categoryFilter !== 'ALL' && item.kategori !== categoryFilter) {
        return false;
      }
      if (statusFilter === 'CORRECT') return item.status === 'BENAR';
      if (statusFilter === 'WRONG') return item.status === 'SALAH' || item.status === 'KOSONG';
      return true;
    });
  }, [items, statusFilter, categoryFilter]);

  const modalHint: HintResponse | null = useMemo(() => {
    if (!selectedEvaluationItem) return null;
    const correctLabel = selectedEvaluationItem.correctLabel ?? 'A';
    const correctOpt = selectedEvaluationItem.options.find(
      (o) => o.label === correctLabel
    );

    return {
      questionId: selectedEvaluationItem.questionId,
      exam_type: selectedEvaluationItem.exam_type,
      kategori: selectedEvaluationItem.kategori,
      subtopik: selectedEvaluationItem.subtopik,
      correctLabel,
      correctText: correctOpt?.text ?? '',
      pembahasan: selectedEvaluationItem.pembahasan ?? '',
      ...(selectedEvaluationItem.exam_type === 'SKD' &&
      selectedEvaluationItem.kategori === 'TKP'
        ? {
            weightsByLabel: selectedEvaluationItem.options.map((o) => ({
              label: o.label,
              text: o.text,
              poin: o.bobot ?? 0,
            })),
          }
        : {}),
    };
  }, [selectedEvaluationItem]);

  const categoryTabs: readonly ('ALL' | QuestionCategory)[] = isSkb
    ? ['ALL', 'RPL', 'BASIS_DATA', 'MANAJEMEN_DATA', 'JARINGAN_DASAR']
    : ['ALL', 'TWK', 'TIU', 'TKP'];

  const maxScore = session.skor_maksimal > 0 ? session.skor_maksimal : session.total_soal * 5;
  const pctTotal =
    session.persentase_total > 0
      ? session.persentase_total
      : maxScore > 0
      ? Math.round((session.skor_total * 1000) / maxScore) / 10
      : 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Summary Bar */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isSkb ? (
              <Cpu className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            ) : (
              <ShieldCheck className="h-5 w-5 text-blue-900" aria-hidden="true" />
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Hasil Evaluasi {session.nama_sesi}
            </h1>
          </div>
          <p className="text-sm text-slate-600 font-mono tabular-nums">
            {formatSessionModeLabel(session.session_mode)} ·{' '}
            {session.mode_waktu === 'TIMED' ? 'Dengan Waktu' : 'Tanpa Waktu'} ·{' '}
            {session.total_soal} Soal · Selesai {formatDateTimeId(session.completed_at)} · Durasi{' '}
            {formatDurationHuman(session.durasi_pengerjaan_detik)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartNewSimulation}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Simulasi {session.exam_type} Baru</span>
          </button>

          <button
            type="button"
            data-testid="save-and-back-btn"
            onClick={onBackToDashboard}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
              isSkb
                ? 'bg-emerald-700 hover:bg-emerald-800'
                : 'bg-blue-900 hover:bg-blue-800'
            }`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Simpan &amp; Kembali ke Dashboard</span>
          </button>
        </div>
      </section>

      {/* Overall Score Card */}
      <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {isSkb
                ? `Skor Total SKB Bidang IT (${session.total_soal} Soal · Mutlak +5 / 0)`
                : `Skor Total SKD (${session.total_soal} Soal)`}
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {session.skor_total}{' '}
              <span className="text-base font-normal text-slate-500">
                / {maxScore} Poin
              </span>
              {isSkb && (
                <span className="ml-3 text-xl font-bold text-emerald-800">
                  ({pctTotal}%)
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="text-sm font-mono tabular-nums text-slate-700">
              <span className="font-semibold text-emerald-700">{counts.correct}</span> Benar ·{' '}
              <span className="font-semibold text-red-700">{counts.wrong}</span>{' '}
              {isSkb ? 'Salah' : 'Salah/Kurang Optimal'} ·{' '}
              <span className="font-semibold text-slate-600">{counts.empty}</span> Kosong
            </div>

            {isSkb ? (
              <div
                className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-bold ${
                  pctTotal >= 65
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-amber-200 bg-amber-50 text-amber-900'
                }`}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Penguasaan {pctTotal}%</span>
              </div>
            ) : session.lulus_passing_grade ? (
              <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-bold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Memenuhi Passing Grade</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-bold text-red-800">
                <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Belum Memenuhi Passing Grade</span>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown: 3 columns for SKD vs 4 columns for SKB */}
        {isSkb ? (
          <div className="grid grid-cols-1 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            {session.breakdown_skor.map((cat) => (
              <div key={cat.kategori} className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-emerald-800">
                      {formatCategoryShort(cat.kategori)}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">{cat.nama}</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700 tabular-nums">
                    {cat.persentase}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between font-mono tabular-nums">
                  <span className="text-2xl font-bold text-slate-900">
                    {cat.skor}
                    <span className="text-sm font-normal text-slate-500">
                      /{cat.skorMaksimal}
                    </span>
                  </span>
                  <span className="text-xs text-slate-500">
                    {cat.benar}/{cat.totalSoal} Benar
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      cat.persentase >= 70
                        ? 'bg-emerald-600'
                        : cat.persentase >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, cat.persentase)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 sm:grid-cols-3">
            {(
              [
                {
                  key: 'TWK' as const,
                  name: 'Tes Wawasan Kebangsaan',
                  score: session.skor_twk,
                  max: thresholds?.maxTwk ?? 150,
                  passing: thresholds?.twk ?? 65,
                },
                {
                  key: 'TIU' as const,
                  name: 'Tes Intelegensia Umum',
                  score: session.skor_tiu,
                  max: thresholds?.maxTiu ?? 175,
                  passing: thresholds?.tiu ?? 80,
                },
                {
                  key: 'TKP' as const,
                  name: 'Tes Karakteristik Pribadi',
                  score: session.skor_tkp,
                  max: thresholds?.maxTkp ?? 225,
                  passing: thresholds?.tkp ?? 166,
                },
              ]
            ).map((cat) => {
              const passed = cat.score >= cat.passing;
              const pct = cat.max > 0 ? Math.min(100, Math.round((cat.score / cat.max) * 100)) : 0;
              return (
                <div key={cat.key} className="p-6 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-500">{cat.key}</p>
                      <p className="text-sm font-semibold text-slate-900">{cat.name}</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        passed ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {passed ? (
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>{passed ? 'Lulus PG' : 'Di bawah PG'}</span>
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between font-mono tabular-nums">
                    <span className="text-2xl font-bold text-slate-900">
                      {cat.score}
                      <span className="text-sm font-normal text-slate-500">
                        /{cat.max}
                      </span>
                    </span>
                    <span className="text-xs text-slate-500">
                      Ambang Batas: {cat.passing}
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        passed ? 'bg-emerald-600' : 'bg-red-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Study Focus Recommendations */}
      {session.topik_rekomendasi.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Rekomendasi Topik Belajar Prioritas</span>
          </div>
          <p className="text-xs text-amber-900/80">
            Berdasarkan tingkat kesalahan terbanyak pada sesi ini, materi berikut disarankan untuk diperdalam kembali:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-medium text-slate-800 list-disc pl-5">
            {session.topik_rekomendasi.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Review Number Grid (Always active with (i) modal for every item) */}
      <section
        aria-labelledby="review-grid-heading"
        className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Grid className="h-4 w-4 text-slate-700" aria-hidden="true" />
            <h2 id="review-grid-heading" className="text-base font-bold text-slate-900">
              Peta Review Nomor Soal ({items.length} Soal)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded border border-emerald-400 bg-emerald-100 inline-block" />
              <span>Benar / Optimal</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded border border-red-400 bg-red-100 inline-block" />
              <span>Salah / Kurang Optimal</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded border border-slate-300 bg-slate-100 inline-block" />
              <span>Kosong</span>
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-600">
          Klik nomor mana saja untuk membuka kunci jawaban &amp; pembahasan (i) soal tersebut secara langsung.
        </p>

        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2">
          {items.map((item) => {
            const colorClass =
              item.status === 'BENAR'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                : item.status === 'SALAH'
                ? 'border-red-300 bg-red-50 text-red-900 hover:bg-red-100'
                : 'border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200';
            return (
              <button
                key={item.answerId}
                type="button"
                onClick={() => setSelectedEvaluationItem(item)}
                aria-label={`Review soal nomor ${item.urutan} (${item.status ?? 'KOSONG'})`}
                className={`h-9 rounded-md border font-mono text-xs font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${colorClass}`}
              >
                {item.urutan}
              </button>
            );
          })}
        </div>
      </section>

      {/* Question-by-Question Evaluation List */}
      <section aria-labelledby="evaluation-list-heading" className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2
              id="evaluation-list-heading"
              className="text-xl font-bold text-slate-900"
            >
              Rincian Jawaban &amp; Pembahasan (i)
            </h2>
            <p className="text-sm text-slate-600">
              Pembahasan langkah demi langkah <span className="font-semibold text-blue-900">(i)</span> tersedia untuk seluruh butir soal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              role="group"
              aria-label="Filter status jawaban"
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1"
            >
              {(
                [
                  { id: 'ALL', label: `Semua (${items.length})` },
                  {
                    id: 'WRONG',
                    label: `${isSkb ? 'Salah / Kosong' : 'Salah / Belum Optimal'} (${
                      counts.wrong + counts.empty
                    })`,
                  },
                  { id: 'CORRECT', label: `Benar (${counts.correct})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    statusFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div
              role="group"
              aria-label="Filter kategori soal"
              className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1"
            >
              {categoryTabs.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    categoryFilter === cat
                      ? `bg-white ${isSkb ? 'text-emerald-800' : 'text-blue-900'} shadow-sm`
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'ALL' ? 'Semua Kategori' : formatCategoryShort(cat)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-200">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-600">
              Tidak ada butir soal pada filter yang dipilih.
            </div>
          ) : (
            filteredItems.map((item) => {
              const isCorrect = item.status === 'BENAR';
              const isEmpty = item.status === 'KOSONG';
              const isWrongOrSuboptimal = !isCorrect;
              const isTkp = item.exam_type === 'SKD' && item.kategori === 'TKP';

              return (
                <div
                  key={item.answerId}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        No. {item.urutan}
                      </span>
                      <span className="text-slate-300" aria-hidden="true">
                        ·
                      </span>
                      <span
                        className={`font-semibold ${
                          isSkb ? 'text-emerald-800' : 'text-blue-900'
                        }`}
                      >
                        {formatCategoryLabel(item.kategori)}
                      </span>
                      <span className="text-slate-300" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-slate-500">{item.subtopik}</span>
                      <span className="text-slate-300" aria-hidden="true">
                        ·
                      </span>

                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {isTkp ? 'Optimal (5/5)' : 'Benar (+5)'}
                          </span>
                        </span>
                      ) : isEmpty ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                          <MinusCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Tidak Dijawab (0)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-red-700">
                          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {isTkp
                              ? `Kurang Optimal (${item.poin ?? 0}/5)`
                              : 'Salah (0)'}
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-slate-800 leading-relaxed">
                      <RichQuestionContent content={item.pertanyaan} variant="compact" />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono tabular-nums text-slate-600">
                      <span>
                        Jawaban Anda:{' '}
                        <strong
                          className={
                            isCorrect ? 'text-emerald-700' : 'text-red-700'
                          }
                        >
                          {item.selectedLabel ?? 'Kosong'}
                        </strong>
                      </span>
                      <span>
                        {isTkp ? 'Opsi Poin 5:' : 'Kunci Benar:'}{' '}
                        <strong className="text-emerald-700">
                          {item.correctLabel}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 self-start">
                    <button
                      type="button"
                      data-testid={`result-hint-btn-${item.urutan}`}
                      onClick={() => setSelectedEvaluationItem(item)}
                      aria-label={`Lihat pembahasan soal nomor ${item.urutan}`}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
                        isWrongOrSuboptimal
                          ? 'border-red-200 bg-red-50 text-red-900 hover:bg-red-100'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Info className="h-4 w-4" aria-hidden="true" />
                      <span>
                        {isWrongOrSuboptimal ? 'Pelajari Pembahasan' : 'Pembahasan'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <HintModal
        open={selectedEvaluationItem !== null}
        loading={false}
        error={null}
        hint={modalHint}
        questionNumber={selectedEvaluationItem?.urutan}
        questionText={selectedEvaluationItem?.pertanyaan}
        options={selectedEvaluationItem?.options}
        userSelectedLabel={selectedEvaluationItem?.selectedLabel}
        onClose={() => setSelectedEvaluationItem(null)}
      />
    </main>
  );
};
