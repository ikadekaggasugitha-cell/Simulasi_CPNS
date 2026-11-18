import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Grid,
  Info,
  Send,
  X,
} from 'lucide-react';
import type {
  ExamQuestionItem,
  HintResponse,
  OptionKey,
  QuestionCategory,
  SessionDetailResponse,
} from '../shared/types';
import { fetchAnswerHint, saveSessionAnswer, submitSession } from '../utils/api';
import {
  formatCategoryLabel,
  formatCategoryShort,
  formatDuration,
  formatSessionModeLabel,
} from '../utils/formatters';
import { HintModal } from './HintModal';

interface ExamViewProps {
  detail: SessionDetailResponse;
  onSubmitted: (completed: SessionDetailResponse) => void;
  onExitToDashboard: () => void;
}

export const ExamView: React.FC<ExamViewProps> = ({
  detail,
  onSubmitted,
  onExitToDashboard,
}) => {
  const { session } = detail;
  const isSkb = session.exam_type === 'SKB';
  const isRealMode = session.session_mode === 'REAL';

  const categoryTabs: readonly QuestionCategory[] = useMemo(
    () =>
      isSkb
        ? (['RPL', 'BASIS_DATA', 'MANAJEMEN_DATA', 'JARINGAN_DASAR'] as const)
        : (['TWK', 'TIU', 'TKP'] as const),
    [isSkb]
  );

  const [items, setItems] = useState<ExamQuestionItem[]>(detail.items);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(
    session.durasi_pengerjaan_detik || 0
  );
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navTab, setNavTab] = useState<QuestionCategory | 'ALL'>(
    detail.items[0]?.kategori ?? (isSkb ? 'RPL' : 'TWK')
  );
  const [saveError, setSaveError] = useState<string | null>(null);

  const [hintOpen, setHintOpen] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintError, setHintError] = useState<string | null>(null);
  const [hintData, setHintData] = useState<HintResponse | null>(null);

  const elapsedRef = useRef(elapsedSeconds);
  elapsedRef.current = elapsedSeconds;
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    setItems(detail.items);
    setElapsedSeconds(detail.session.durasi_pengerjaan_detik || 0);
    setCurrentIndex(0);
    setNavTab(
      detail.items[0]?.kategori ?? (detail.session.exam_type === 'SKB' ? 'RPL' : 'TWK')
    );
  }, [detail]);

  const currentItem = items[currentIndex];

  const handleFinalSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setConfirmOpen(false);
    try {
      const result = await submitSession(session.id, elapsedRef.current);
      onSubmitted(result);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Gagal mengumpulkan sesi ujian.'
      );
      setSubmitting(false);
    }
  }, [session.id, onSubmitted, submitting]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (
          session.mode_waktu === 'TIMED' &&
          session.batas_waktu_detik !== null &&
          next >= session.batas_waktu_detik &&
          !autoSubmittedRef.current
        ) {
          autoSubmittedRef.current = true;
          void handleFinalSubmit();
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [session.mode_waktu, session.batas_waktu_detik, handleFinalSubmit]);

  useEffect(() => {
    const syncTimer = window.setInterval(() => {
      void saveSessionAnswer(session.id, {
        elapsedSeconds: elapsedRef.current,
      }).catch(() => {});
    }, 15000);
    return () => window.clearInterval(syncTimer);
  }, [session.id]);

  const remainingSeconds =
    session.mode_waktu === 'TIMED' && session.batas_waktu_detik !== null
      ? Math.max(0, session.batas_waktu_detik - elapsedSeconds)
      : null;

  const answeredCount = useMemo(
    () => items.filter((item) => item.selectedLabel !== null).length,
    [items]
  );
  const flaggedCount = useMemo(
    () => items.filter((item) => item.ditandai).length,
    [items]
  );

  const handleSelectOption = async (label: OptionKey) => {
    if (!currentItem || submitting) return;
    const nextSelected = currentItem.selectedLabel === label ? null : label;

    setItems((prev) =>
      prev.map((it, idx) =>
        idx === currentIndex ? { ...it, selectedLabel: nextSelected } : it
      )
    );
    setSaveError(null);

    try {
      await saveSessionAnswer(session.id, {
        answerId: currentItem.answerId,
        selectedLabel: nextSelected,
        elapsedSeconds: elapsedRef.current,
      });
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : 'Gagal menyimpan jawaban.'
      );
    }
  };

  const handleToggleFlag = async () => {
    if (!currentItem || submitting) return;
    const nextFlag = !currentItem.ditandai;

    setItems((prev) =>
      prev.map((it, idx) =>
        idx === currentIndex ? { ...it, ditandai: nextFlag } : it
      )
    );

    try {
      await saveSessionAnswer(session.id, {
        answerId: currentItem.answerId,
        ditandai: nextFlag,
        elapsedSeconds: elapsedRef.current,
      });
    } catch {
      // Ignore transient error on flag
    }
  };

  const handleOpenHint = async () => {
    if (!currentItem || isRealMode) return;
    setHintOpen(true);
    setHintLoading(true);
    setHintError(null);
    setHintData(null);
    try {
      const data = await fetchAnswerHint(session.id, currentItem.answerId);
      setHintData(data);
    } catch (err) {
      setHintError(
        err instanceof Error ? err.message : 'Gagal memuat pembahasan soal.'
      );
    } finally {
      setHintLoading(false);
    }
  };

  useEffect(() => {
    if (currentItem && navTab !== 'ALL' && navTab !== currentItem.kategori) {
      setNavTab(currentItem.kategori);
    }
  }, [currentItem, navTab]);

  const jumpToCategory = (cat: QuestionCategory, closeMobile = false) => {
    setNavTab(cat);
    const firstIdx = items.findIndex((i) => i.kategori === cat);
    if (firstIdx >= 0) {
      setCurrentIndex(firstIdx);
      if (closeMobile) {
        setMobileNavOpen(false);
      }
    }
  };

  const indexedItems = useMemo(
    () => items.map((item, idx) => ({ item, idx })),
    [items]
  );

  const visibleNavItems = useMemo(() => {
    if (navTab === 'ALL') return indexedItems;
    return indexedItems.filter(({ item }) => item.kategori === navTab);
  }, [indexedItems, navTab]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (hintOpen || confirmOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min(items.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hintOpen, confirmOpen, items.length]);

  if (!currentItem) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <p className="text-slate-700">Tidak ada soal pada sesi ini.</p>
        <button
          type="button"
          onClick={onExitToDashboard}
          className="mt-4 rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const isLowTime = remainingSeconds !== null && remainingSeconds <= 300;
  const isCriticalTime = remainingSeconds !== null && remainingSeconds <= 60;
  const accentBtn = isSkb
    ? 'bg-emerald-700 hover:bg-emerald-800'
    : 'bg-blue-900 hover:bg-blue-800';
  const accentText = isSkb ? 'text-emerald-800' : 'text-blue-900';

  const renderCategoryTabs = (closeMobile = false) => (
    <div
      className={
        isSkb
          ? 'flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1.5'
          : 'grid grid-cols-4 gap-1 rounded-lg bg-slate-100 p-1'
      }
    >
      {categoryTabs.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => jumpToCategory(cat, closeMobile)}
          className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
            navTab === cat
              ? `bg-white ${accentText} shadow-sm`
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {formatCategoryShort(cat)}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setNavTab('ALL')}
        className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
          navTab === 'ALL'
            ? `bg-white ${accentText} shadow-sm`
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        Semua
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Compact Sticky Exam HUD Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3 py-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={onExitToDashboard}
              aria-label={`Kembali ke Dashboard ${session.exam_type}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Dashboard {session.exam_type}</span>
            </button>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">
                {session.nama_sesi}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-mono tabular-nums truncate">
                {answeredCount}/{items.length} · {formatCategoryShort(currentItem.kategori)} ·{' '}
                {formatSessionModeLabel(session.session_mode)}
                {session.mode_waktu === 'UNTIMED' ? ' · Tanpa Waktu' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {session.mode_waktu === 'TIMED' && remainingSeconds !== null ? (
              <div
                aria-label="Sisa waktu ujian"
                data-testid="exam-timer"
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 sm:px-3 py-1.5 font-mono text-xs sm:text-sm font-bold tabular-nums ${
                  isCriticalTime
                    ? 'border-red-300 bg-red-50 text-red-700'
                    : isLowTime
                    ? 'border-amber-300 bg-amber-50 text-amber-800'
                    : 'border-slate-200 bg-slate-50 text-slate-900'
                }`}
              >
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" aria-hidden="true" />
                <span>{formatDuration(remainingSeconds)}</span>
              </div>
            ) : (
              <div
                data-testid="practice-mode-label"
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-600"
              >
                <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                <span>Mode Latihan · Tanpa Batas Waktu</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Buka panel navigasi nomor soal"
              className="inline-flex lg:hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 whitespace-nowrap"
            >
              <Grid className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Nomor</span>
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => setConfirmOpen(true)}
              data-testid="exam-finish-trigger"
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition-colors disabled:opacity-60 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${accentBtn}`}
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Selesai</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Exam Workspace */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {saveError && (
          <div
            role="alert"
            className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-800"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{saveError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Question Stage */}
          <section
            aria-label="Area butir soal"
            className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <p className={`text-xs font-semibold font-mono tabular-nums ${accentText}`}>
                  Soal No. {currentItem.urutan} dari {items.length} ·{' '}
                  {session.exam_type} · {formatCategoryShort(currentItem.kategori)} ·{' '}
                  {currentItem.subtopik}
                </p>
                <p className="text-xs text-slate-500">
                  {formatCategoryLabel(currentItem.kategori)}
                </p>
              </div>

              {/* CRITICAL RULE: (i) Hint button ONLY visible in PRACTICE mode */}
              {!isRealMode && (
                <button
                  type="button"
                  data-testid="exam-hint-button"
                  onClick={handleOpenHint}
                  aria-label={`Lihat kunci jawaban dan pembahasan soal nomor ${currentItem.urutan}`}
                  title="Lihat kunci jawaban & langkah penyelesaian"
                  className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-slate-100 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${accentText}`}
                >
                  <Info className="h-4 w-4" aria-hidden="true" />
                  <span>Pembahasan</span>
                </button>
              )}
            </div>

            <div className="text-base leading-relaxed text-slate-900 whitespace-pre-line">
              {currentItem.pertanyaan}
            </div>

            <div
              role="radiogroup"
              aria-label={`Pilihan jawaban soal nomor ${currentItem.urutan}`}
              className="space-y-3"
            >
              {currentItem.options.map((opt) => {
                const selected = currentItem.selectedLabel === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => handleSelectOption(opt.label)}
                    className={`flex w-full items-start gap-3.5 rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
                      selected
                        ? isSkb
                          ? 'border-emerald-700 bg-emerald-50/70 ring-1 ring-emerald-700'
                          : 'border-blue-800 bg-blue-50/80 ring-1 ring-blue-800'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-bold ${
                        selected
                          ? isSkb
                            ? 'border-emerald-700 bg-emerald-700 text-white'
                            : 'border-blue-900 bg-blue-900 text-white'
                          : 'border-slate-300 bg-slate-50 text-slate-700'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-sm sm:text-base leading-relaxed text-slate-800 pt-0.5">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                <span>Sebelumnya</span>
              </button>

              <button
                type="button"
                aria-pressed={currentItem.ditandai}
                onClick={handleToggleFlag}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 ${
                  currentItem.ditandai
                    ? 'border-amber-400 bg-amber-50 text-amber-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bookmark className="h-4 w-4" aria-hidden="true" />
                <span>{currentItem.ditandai ? 'Ditandai Ragu' : 'Tandai Ragu-ragu'}</span>
              </button>

              {currentIndex < items.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((prev) => Math.min(items.length - 1, prev + 1))
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${accentBtn}`}
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                >
                  <Check className="h-4 w-4" aria-hidden="true" />
                  <span>Kumpulkan Ujian</span>
                </button>
              )}
            </div>
          </section>

          {/* Desktop Free Navigation Sidebar Panel */}
          <aside
            aria-label="Navigasi bebas nomor soal"
            className="hidden lg:block lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 space-y-4 sticky top-20"
          >
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-900">
                Navigasi Nomor Soal
              </h2>
              <p className="text-xs text-slate-500">
                Klik nomor atau kategori untuk melompat langsung ke soal mana pun.
              </p>
            </div>

            {renderCategoryTabs(false)}

            <div className="max-h-[420px] overflow-y-auto p-0.5">
              <div className="grid grid-cols-5 gap-2">
                {visibleNavItems.map(({ item, idx }) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = item.selectedLabel !== null;
                  const isFlagged = item.ditandai;

                  let styleClass =
                    'border-slate-200 bg-white text-slate-700 hover:border-slate-300';
                  if (isFlagged) {
                    styleClass =
                      'border-amber-400 bg-amber-50 text-amber-900 font-semibold';
                  } else if (isAnswered) {
                    styleClass = isSkb
                      ? 'border-emerald-700 bg-emerald-700 text-white font-semibold'
                      : 'border-blue-900 bg-blue-900 text-white font-semibold';
                  }

                  return (
                    <button
                      key={item.answerId}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Soal nomor ${item.urutan} (${item.kategori})${
                        isAnswered ? ', sudah dijawab' : ', belum dijawab'
                      }${isFlagged ? ', ditandai ragu' : ''}`}
                      className={`h-10 rounded-md border font-mono text-xs tabular-nums transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${styleClass} ${
                        isCurrent ? 'ring-2 ring-blue-700 ring-offset-1' : ''
                      }`}
                    >
                      {item.urutan}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span
                  className={`h-3.5 w-3.5 rounded inline-block shrink-0 ${
                    isSkb ? 'bg-emerald-700' : 'bg-blue-900'
                  }`}
                />
                <span>Dijawab ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded border border-amber-400 bg-amber-50 inline-block shrink-0" />
                <span>Ragu ({flaggedCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded border border-slate-300 bg-white inline-block shrink-0" />
                <span>Kosong ({items.length - answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded border-2 border-blue-700 bg-white inline-block shrink-0" />
                <span>Aktif (No. {currentItem.urutan})</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigasi nomor soal"
          onClick={() => setMobileNavOpen(false)}
        >
          <div
            className="h-full w-80 max-w-[90vw] bg-white p-5 overflow-y-auto space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-sm font-bold text-slate-900">
                Navigasi Soal ({items.length})
              </h2>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Tutup navigasi soal"
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {renderCategoryTabs(false)}

            <div className="grid grid-cols-5 gap-2">
              {visibleNavItems.map(({ item, idx }) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = item.selectedLabel !== null;
                const isFlagged = item.ditandai;

                let styleClass = 'border-slate-200 bg-white text-slate-700';
                if (isFlagged) {
                  styleClass = 'border-amber-400 bg-amber-50 text-amber-900 font-semibold';
                } else if (isAnswered) {
                  styleClass = isSkb
                    ? 'border-emerald-700 bg-emerald-700 text-white font-semibold'
                    : 'border-blue-900 bg-blue-900 text-white font-semibold';
                }

                return (
                  <button
                    key={item.answerId}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setMobileNavOpen(false);
                    }}
                    className={`h-11 rounded-md border font-mono text-xs tabular-nums ${styleClass} ${
                      isCurrent ? 'ring-2 ring-blue-700 ring-offset-1' : ''
                    }`}
                  >
                    {item.urutan}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-submit-title"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 space-y-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1.5">
              <h2
                id="confirm-submit-title"
                className="text-lg font-bold text-slate-900"
              >
                Kumpulkan {session.nama_sesi}?
              </h2>
              <p className="text-sm text-slate-600">
                {isSkb
                  ? 'Setelah dikumpulkan, skor mutlak dan penguasaan pada 4 pilar kompetensi IT akan dihitung, dan pembahasan (i) seluruh soal akan terbuka.'
                  : 'Setelah dikumpulkan, skor TWK, TIU, dan TKP beserta status Passing Grade BKN akan dihitung, dan pembahasan (i) seluruh soal akan terbuka.'}
              </p>
            </div>

            <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-slate-50 text-sm">
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-600">Soal Terjawab</span>
                <span className="font-mono tabular-nums font-bold text-slate-900">
                  {answeredCount} / {items.length}
                </span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-600">Belum Dijawab</span>
                <span className="font-mono tabular-nums font-semibold text-slate-700">
                  {items.length - answeredCount}
                </span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-600">Ditandai Ragu-ragu</span>
                <span className="font-mono tabular-nums font-semibold text-amber-800">
                  {flaggedCount}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Kembali Mengerjakan
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleFinalSubmit}
                data-testid="confirm-submit-button"
                className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${accentBtn}`}
              >
                {submitting ? 'Memproses Skor...' : 'Ya, Kumpulkan Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* (i) Hint Modal during PRACTICE Exam only */}
      {!isRealMode && (
        <HintModal
          open={hintOpen}
          loading={hintLoading}
          error={hintError}
          hint={hintData}
          questionNumber={currentItem.urutan}
          questionText={currentItem.pertanyaan}
          onClose={() => setHintOpen(false)}
        />
      )}
    </div>
  );
};
