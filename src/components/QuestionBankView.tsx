import React, { useEffect, useMemo, useState } from 'react';
import { Info, Search } from 'lucide-react';
import { useExamContext } from '../context/ExamContext';
import type {
  ExamType,
  HintResponse,
  OptionKey,
  QuestionCategory,
  QuestionRecord,
} from '../shared/types';
import { fetchQuestionsBank } from '../utils/api';
import { formatCategoryLabel, formatCategoryShort } from '../utils/formatters';
import { HintModal } from './HintModal';

export const QuestionBankView: React.FC = () => {
  const { bankDefaultExamType, bankStats } = useExamContext();
  const [examTypeTab, setExamTypeTab] = useState<ExamType>(bankDefaultExamType);
  const [questions, setQuestions] = useState<QuestionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | QuestionCategory>(
    'ALL'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionRecord | null>(
    null
  );
  const [visibleLimit, setVisibleLimit] = useState(60);

  useEffect(() => {
    setExamTypeTab(bankDefaultExamType);
  }, [bankDefaultExamType]);

  useEffect(() => {
    setCategoryFilter('ALL');
    setVisibleLimit(60);
  }, [examTypeTab]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchQuestionsBank({ examType: examTypeTab })
      .then((res) => {
        if (!active) return;
        setQuestions(res.questions);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Gagal memuat bank soal.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [examTypeTab]);

  useEffect(() => {
    setVisibleLimit(60);
  }, [categoryFilter, searchQuery]);

  const categoryOptions: readonly ('ALL' | QuestionCategory)[] =
    examTypeTab === 'SKB'
      ? ['ALL', 'RPL', 'BASIS_DATA', 'MANAJEMEN_DATA', 'JARINGAN_DASAR']
      : ['ALL', 'TWK', 'TIU', 'TKP'];

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return questions.filter((item) => {
      if (categoryFilter !== 'ALL' && item.kategori !== categoryFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.pertanyaan.toLowerCase().includes(q) ||
        item.subtopik.toLowerCase().includes(q) ||
        item.pembahasan.toLowerCase().includes(q)
      );
    });
  }, [questions, categoryFilter, searchQuery]);

  const modalHint: HintResponse | null = useMemo(() => {
    if (!selectedQuestion) return null;
    const keys: OptionKey[] = ['A', 'B', 'C', 'D', 'E'];
    const getText = (k: OptionKey) => {
      switch (k) {
        case 'A':
          return selectedQuestion.opsi_a;
        case 'B':
          return selectedQuestion.opsi_b;
        case 'C':
          return selectedQuestion.opsi_c;
        case 'D':
          return selectedQuestion.opsi_d;
        case 'E':
          return selectedQuestion.opsi_e;
      }
    };

    return {
      questionId: selectedQuestion.id,
      exam_type: selectedQuestion.exam_type,
      kategori: selectedQuestion.kategori,
      subtopik: selectedQuestion.subtopik,
      correctLabel: selectedQuestion.jawaban_benar,
      correctText: getText(selectedQuestion.jawaban_benar),
      pembahasan: selectedQuestion.pembahasan,
      ...(selectedQuestion.exam_type === 'SKD' &&
      selectedQuestion.kategori === 'TKP' &&
      selectedQuestion.bobot_tkp
        ? {
            weightsByLabel: keys.map((k) => ({
              label: k,
              text: getText(k),
              poin: selectedQuestion.bobot_tkp?.[k] ?? 0,
            })),
          }
        : {}),
    };
  }, [selectedQuestion]);

  const isSkb = examTypeTab === 'SKB';

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Bank Soal HOTS SKD &amp; SKB CPNS
          </h1>
          <p className="text-sm text-slate-600">
            Eksplorasi soal SKD (TWK, TIU, TKP) dan SKB Bidang IT (RPL, Basis Data, Manajemen Data, Jaringan Dasar) lengkap dengan kunci serta pembahasan teknisnya.
          </p>
        </div>

        <p className="text-xs font-mono tabular-nums text-slate-500 whitespace-nowrap shrink-0">
          Menampilkan {Math.min(visibleLimit, filtered.length)} dari {filtered.length} butir soal
        </p>
      </div>

      {/* Primary Segmented Exam Type Switch (SKD vs SKB) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div
          role="tablist"
          aria-label="Pilih modul bank soal"
          className="inline-flex items-center gap-1 rounded-lg bg-slate-200/70 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={examTypeTab === 'SKD'}
            onClick={() => setExamTypeTab('SKD')}
            className={`rounded-md px-4 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
              examTypeTab === 'SKD'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bank Soal SKD ({bankStats?.skdTotal ?? 1250})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={examTypeTab === 'SKB'}
            onClick={() => setExamTypeTab('SKB')}
            className={`rounded-md px-4 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
              examTypeTab === 'SKB'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bank Soal SKB IT ({bankStats?.skbTotal ?? 200})
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Filter kategori bank soal"
          className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 self-start"
        >
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                categoryFilter === cat
                  ? `bg-white ${isSkb ? 'text-emerald-800' : 'text-blue-900'} shadow-sm`
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : formatCategoryShort(cat)}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isSkb
                ? 'Cari SQL, SDLC, CIDR, SPBE...'
                : 'Cari topik, deret, atau kata kunci...'
            }
            aria-label="Cari soal di bank soal"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white divide-y divide-slate-200">
        {loading ? (
          <div className="p-6 space-y-4">
            <div className="h-16 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-16 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-16 w-full animate-pulse rounded bg-slate-100" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-600">
            Tidak ada soal yang cocok dengan pencarian Anda.
          </div>
        ) : (
          filtered.slice(0, visibleLimit).map((item, idx) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <p className="text-xs font-mono text-slate-500 tabular-nums">
                  #{idx + 1} ·{' '}
                  <span
                    className={`font-semibold ${
                      isSkb ? 'text-emerald-800' : 'text-blue-900'
                    }`}
                  >
                    {formatCategoryLabel(item.kategori)}
                  </span>{' '}
                  · {item.subtopik}
                </p>
                <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line">
                  {item.pertanyaan}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuestion(item)}
                aria-label={`Lihat pembahasan soal ${item.subtopik} nomor ${idx + 1}`}
                className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold transition-colors hover:bg-slate-100 whitespace-nowrap shrink-0 self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
                  isSkb ? 'text-emerald-800' : 'text-blue-900'
                }`}
              >
                <Info className="h-4 w-4" aria-hidden="true" />
                <span>Kunci &amp; Pembahasan</span>
              </button>
            </div>
          ))
        )}
      </div>

      {!loading && filtered.length > visibleLimit && (
        <div className="flex flex-col items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setVisibleLimit((prev) => prev + 60)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
          >
            Muat 60 Soal Berikutnya ({filtered.length - visibleLimit} tersisa)
          </button>
        </div>
      )}

      <HintModal
        open={selectedQuestion !== null}
        loading={false}
        error={null}
        hint={modalHint}
        questionText={selectedQuestion?.pertanyaan}
        onClose={() => setSelectedQuestion(null)}
      />
    </main>
  );
};
