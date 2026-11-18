import React, { useEffect } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import type { HintResponse, OptionKey } from '../shared/types';
import { formatCategoryLabel } from '../utils/formatters';

interface HintModalProps {
  open: boolean;
  loading: boolean;
  error: string | null;
  hint: HintResponse | null;
  questionNumber?: number;
  questionText?: string;
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
                  <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line">
                    {questionText}
                  </p>
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
                  <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                    {hint.correctText}
                  </p>
                </div>

                {userSelectedLabel !== undefined && (
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
                    <p className="mt-1 text-xs text-slate-600">
                      {userSelectedLabel === hint.correctLabel
                        ? 'Pilihan Anda sudah tepat.'
                        : isTkp
                        ? 'Bandingkan poin tiap opsi di bawah untuk evaluasi.'
                        : isSkb
                        ? 'Pelajari konsep teknis & arsitektur penyelesaian di bawah.'
                        : 'Pelajari langkah penyelesaian di bawah ini.'}
                    </p>
                  </div>
                )}
              </div>

              {/* TKP 1-5 Weights Breakdown (strictly only for SKD TKP) */}
              {isTkp && hint.weightsByLabel && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2.5">
                    Distribusi Bobot Nilai TKP (1–5 Poin)
                  </h3>
                  <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
                    {hint.weightsByLabel.map((item) => {
                      const isBest = item.poin === 5;
                      const isUser = userSelectedLabel === item.label;
                      return (
                        <div
                          key={item.label}
                          className={`flex items-start justify-between gap-4 px-4 py-2.5 text-sm ${
                            isBest ? 'bg-emerald-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span className="font-mono font-semibold text-slate-900 shrink-0">
                              {item.label}.
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
                            className={`font-mono tabular-nums text-xs font-bold shrink-0 ${
                              isBest ? 'text-emerald-700' : 'text-slate-600'
                            }`}
                          >
                            {item.poin} poin
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
                    : 'Langkah Penyelesaian & Pembahasan'}
                </h3>
                <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                  {steps.map((step, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed text-slate-700"
                    >
                      {step}
                    </p>
                  ))}
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
