import React, { useEffect } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import type { HintResponse, OptionKey } from '../shared/types';
import { formatCategoryLabel } from '../utils/formatters';
import { RichQuestionContent, containsSvgMarkup } from './RichQuestionContent';

interface HintOptionItem {
  label: OptionKey;
  text: string;
}

interface HintModalProps {
  open: boolean;
  loading: boolean;
  error: string | null;
  hint: HintResponse | null;
  questionNumber?: number;
  questionText?: string;
  options?: readonly HintOptionItem[];
  userSelectedLabel?: OptionKey | null;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  open,
  loading,
  error,
  hint,
  questionNumber,
  questionText,
  options,
  userSelectedLabel,
  onClose,
}) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const steps = hint
    ? hint.pembahasan
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
    : [];

  const isSkb = hint?.exam_type === 'SKB';
  const isTkp = hint?.exam_type === 'SKD' && hint?.kategori === 'TKP';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hint-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <Info
              className={`h-5 w-5 shrink-0 ${isSkb ? 'text-emerald-700' : 'text-blue-800'}`}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <h2
                id="hint-modal-title"
                className="text-base font-bold text-slate-900 truncate"
              >
                {questionNumber
                  ? `Pembahasan Soal No. ${questionNumber}`
                  : 'Kunci Jawaban & Pembahasan'}
              </h2>
              {hint && (
                <p className="text-xs text-slate-500 truncate">
                  {hint.exam_type} · {formatCategoryLabel(hint.kategori)} · {hint.subtopik}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal pembahasan"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {loading && (
            <div className="space-y-3 py-6" aria-live="polite">
              <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
              <div className="h-20 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-16 w-full animate-pulse rounded bg-slate-100" />
            </div>
          )}

          {error && !loading && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {hint && !loading && (
            <>
              {questionText && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500 mb-1.5">
                    Butir Pertanyaan
                  </p>
                  <div className="text-sm leading-relaxed text-slate-800">
                    <RichQuestionContent content={questionText} variant="prompt" />
                  </div>
                </div>
              )}

              {/* Answer comparison */}
              <div
                className={`grid grid-cols-1 gap-3 ${
                  userSelectedLabel !== undefined ? 'sm:grid-cols-2' : ''
                }`}
              >
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                      {isTkp
                        ? 'Opsi Nilai Tertinggi (5 Poin)'
                        : isSkb
                        ? 'Kunci Jawaban Teknis (+5 Poin Mutlak)'
                        : 'Kunci Jawaban Benar (+5 Poin)'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    Opsi {hint.correctLabel}
                  </p>
                  <div className="mt-1.5 text-sm text-slate-700 leading-relaxed">
                    <RichQuestionContent
                      content={hint.correctText}
                      variant={containsSvgMarkup(hint.correctText) ? 'option' : 'prompt'}
                    />
                  </div>
                </div>

                {userSelectedLabel !== undefined && (() => {
                  const userOpt = userSelectedLabel
                    ? options?.find((o) => o.label === userSelectedLabel)
                    : undefined;
                  return (
                    <div
                      className={`rounded-lg border p-4 ${
                        userSelectedLabel === hint.correctLabel
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-red-200 bg-red-50/60'
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 text-xs font-semibold ${
                          userSelectedLabel === hint.correctLabel
                            ? 'text-emerald-800'
                            : 'text-red-800'
                        }`}
                      >
                        {userSelectedLabel === hint.correctLabel ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                        )}
                        <span>Jawaban Anda</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {userSelectedLabel ? `Opsi ${userSelectedLabel}` : 'Tidak Dijawab (Kosong)'}
                      </p>
                      {userOpt && (
                        <div className="mt-1.5 text-sm text-slate-700 leading-relaxed">
                          <RichQuestionContent
                            content={userOpt.text}
                            variant={containsSvgMarkup(userOpt.text) ? 'option' : 'prompt'}
                          />
                        </div>
                      )}
                      <p className="mt-1.5 text-xs text-slate-600">
                        {userSelectedLabel === hint.correctLabel
                          ? 'Pilihan Anda sudah tepat.'
                          : isTkp
                          ? 'Bandingkan poin tiap opsi di bawah untuk evaluasi.'
                          : isSkb
                          ? 'Pelajari konsep teknis & arsitektur penyelesaian di bawah.'
                          : 'Pelajari langkah penyelesaian di bawah ini.'}
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Full A-E Options Comparison (crucial for Figural SVG & review clarity) */}
              {!isTkp && options && options.length > 0 && (() => {
                const hasSvgOpts = options.some((o) => containsSvgMarkup(o.text));
                return (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2.5">
                      Perbandingan Seluruh Opsi Jawaban (A–E)
                    </h3>
                    {hasSvgOpts ? (
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {options.map((opt) => {
                          const isKey = opt.label === hint.correctLabel;
                          const isUser = userSelectedLabel === opt.label;
                          return (
                            <div
                              key={opt.label}
                              className={`flex flex-col items-center gap-1.5 rounded-lg border p-2.5 ${
                                isKey
                                  ? 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500'
                                  : isUser
                                  ? 'border-red-400 bg-red-50/60 ring-1 ring-red-400'
                                  : 'border-slate-200 bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-1 text-[11px] font-mono font-bold">
                                <span
                                  className={
                                    isKey
                                      ? 'text-emerald-800'
                                      : isUser
                                      ? 'text-red-700'
                                      : 'text-slate-700'
                                  }
                                >
                                  {opt.label}
                                </span>
                                {isKey && (
                                  <span className="text-[10px] font-sans font-semibold text-emerald-700">
                                    ✓ Benar
                                  </span>
                                )}
                                {!isKey && isUser && (
                                  <span className="text-[10px] font-sans font-semibold text-red-700">
                                    ✗ Anda
                                  </span>
                                )}
                              </div>
                              <RichQuestionContent content={opt.text} variant="option" />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
                        {options.map((opt) => {
                          const isKey = opt.label === hint.correctLabel;
                          const isUser = userSelectedLabel === opt.label;
                          return (
                            <div
                              key={opt.label}
                              className={`flex items-start gap-2.5 px-3.5 py-2 text-xs sm:text-sm ${
                                isKey
                                  ? 'bg-emerald-50/60'
                                  : isUser
                                  ? 'bg-red-50/50'
                                  : 'bg-white'
                              }`}
                            >
                              <span
                                className={`font-mono font-bold shrink-0 ${
                                  isKey
                                    ? 'text-emerald-800'
                                    : isUser
                                    ? 'text-red-700'
                                    : 'text-slate-700'
                                }`}
                              >
                                {opt.label}.
                              </span>
                              <span className="text-slate-800 leading-snug flex-1">
                                {opt.text}
                                {isKey && (
                                  <span className="ml-2 text-xs font-semibold text-emerald-700">
                                    (Kunci Benar)
                                  </span>
                                )}
                                {!isKey && isUser && (
                                  <span className="ml-2 text-xs font-semibold text-red-700">
                                    (Pilihan Anda)
                                  </span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* TKP 1-5 Weights Breakdown (strictly only for SKD TKP, ordered from 5 down to 1) */}
              {isTkp && hint.weightsByLabel && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2.5">
                    Distribusi Skor TKP (Urutan Skor 5 → 1)
                  </h3>
                  <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
                    {[...hint.weightsByLabel]
                      .sort((a, b) => b.poin - a.poin)
                      .map((item) => {
                        const isBest = item.poin === 5;
                        const isRunnerUp = item.poin === 4;
                        const isUser = userSelectedLabel === item.label;
                        return (
                          <div
                            key={item.label}
                            className={`flex items-start justify-between gap-4 px-4 py-2.5 text-sm ${
                              isBest
                                ? 'bg-emerald-50/60'
                                : isRunnerUp
                                ? 'bg-blue-50/40'
                                : ''
                            }`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <span
                                className={`font-mono font-bold shrink-0 ${
                                  isBest
                                    ? 'text-emerald-800'
                                    : isRunnerUp
                                    ? 'text-blue-900'
                                    : 'text-slate-700'
                                }`}
                              >
                                Opsi {item.label}.
                              </span>
                              <span className="text-slate-700 leading-snug">
                                {item.text}
                                {isUser && (
                                  <span className="ml-2 text-xs font-semibold text-blue-800">
                                    (Pilihan Anda)
                                  </span>
                                )}
                              </span>
                            </div>
                            <span
                              className={`font-mono tabular-nums text-xs font-bold shrink-0 px-2 py-0.5 rounded ${
                                isBest
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isRunnerUp
                                  ? 'bg-blue-100 text-blue-900'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              Skor {item.poin}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Step-by-step Technical or Analytical Explanation */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2.5">
                  {isSkb
                    ? 'Penjelasan Teknis & Analisis Arsitektur'
                    : hint.kategori === 'TIU'
                    ? 'Pembahasan Dua Metode (Sistematis & Trik Cepat)'
                    : isTkp
                    ? 'Pembahasan Prioritas Sikap (Skor 5 vs Skor 4)'
                    : 'Langkah Penyelesaian & Pembahasan'}
                </h3>
                <div className="space-y-2.5">
                  {steps.map((step, i) => {
                    const isFastTrick = /^Metode\s*2\b|^Trik\s*Cepat\b/i.test(step);
                    const isSystematic = /^Metode\s*1\b/i.test(step);
                    const isTkpTop = isTkp && /^Skor\s*5\b/i.test(step);
                    const isTkpRunnerUp = isTkp && /^Skor\s*4\b/i.test(step);
                    return (
                      <div
                        key={i}
                        className={`rounded-lg border p-3.5 text-sm leading-relaxed ${
                          isFastTrick
                            ? 'border-amber-200 bg-amber-50/80 text-slate-800'
                            : isSystematic || isTkpRunnerUp
                            ? 'border-blue-200 bg-blue-50/60 text-slate-800'
                            : isTkpTop
                            ? 'border-emerald-200 bg-emerald-50/70 text-slate-800'
                            : 'border-slate-200 bg-slate-50/70 text-slate-700'
                        }`}
                      >
                        <RichQuestionContent content={step} variant="compact" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3.5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
          >
            Tutup Pembahasan
          </button>
        </div>
      </div>
    </div>
  );
};
