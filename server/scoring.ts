import type {
  AnswerStatus,
  CategoryScoreBreakdown,
  ExamType,
  OptionKey,
  PassingThresholds,
  PracticeQuantityOption,
  QuestionCategory,
  SessionMode,
  SkbCategory,
  SkdCategory,
  TkpWeights,
} from '../src/shared/types';

export const OPTION_KEYS: readonly OptionKey[] = ['A', 'B', 'C', 'D', 'E'] as const;

export const SKD_CATEGORIES: readonly SkdCategory[] = ['TWK', 'TIU', 'TKP'] as const;
export const SKB_CATEGORIES: readonly SkbCategory[] = [
  'RPL',
  'BASIS_DATA',
  'MANAJEMEN_DATA',
  'JARINGAN_DASAR',
] as const;

export const CATEGORY_DISPLAY_NAMES: Record<QuestionCategory, string> = {
  TWK: 'Tes Wawasan Kebangsaan',
  TIU: 'Tes Intelegensia Umum',
  TKP: 'Tes Karakteristik Pribadi',
  RPL: 'Rekayasa Perangkat Lunak',
  BASIS_DATA: 'Basis Data',
  MANAJEMEN_DATA: 'Manajemen Data',
  JARINGAN_DASAR: 'Jaringan Dasar',
};

// Official PermenPANRB SKD CPNS passing grade ratios:
// TWK: 65 / 150 (30 questions * 5)
// TIU: 80 / 175 (35 questions * 5)
// TKP: 166 / 225 (45 questions * 5)
export const PASSING_RATIOS = {
  TWK: 65 / 150,
  TIU: 80 / 175,
  TKP: 166 / 225,
} as const;

export const SKD_REAL_ALLOCATION: Record<SkdCategory, number> = {
  TWK: 30,
  TIU: 35,
  TKP: 45,
};

export const SKB_REAL_ALLOCATION: Record<SkbCategory, number> = {
  RPL: 25,
  BASIS_DATA: 25,
  MANAJEMEN_DATA: 25,
  JARINGAN_DASAR: 25,
};

export const SKD_REAL_DURATION_SECONDS = 100 * 60; // 100 menit (110 soal)
export const SKB_REAL_DURATION_SECONDS = 90 * 60; // 90 menit (100 soal)

/**
 * Distributes 20, 50, or 75 SKD practice questions proportionally to BKN ratio (30:35:45).
 */
export function allocateSkdCategoryCounts(
  sessionMode: SessionMode,
  totalSoal?: PracticeQuantityOption | number
): Record<SkdCategory, number> {
  if (sessionMode === 'REAL') {
    return { ...SKD_REAL_ALLOCATION };
  }
  const qty = Number(totalSoal);
  if (qty === 20) return { TWK: 6, TIU: 6, TKP: 8 };
  if (qty === 50) return { TWK: 14, TIU: 16, TKP: 20 };
  if (qty === 75) return { TWK: 20, TIU: 24, TKP: 31 };

  // Fallback proportional calculation (Hamilton largest-remainder)
  const safeTotal = qty > 0 ? qty : 20;
  const rawTwk = (safeTotal * 30) / 110;
  const rawTiu = (safeTotal * 35) / 110;
  const rawTkp = (safeTotal * 45) / 110;
  const base = {
    TWK: Math.floor(rawTwk),
    TIU: Math.floor(rawTiu),
    TKP: Math.floor(rawTkp),
  };
  let rem = safeTotal - (base.TWK + base.TIU + base.TKP);
  const remainders: Array<{ cat: SkdCategory; frac: number }> = [
    { cat: 'TWK' as SkdCategory, frac: rawTwk - base.TWK },
    { cat: 'TIU' as SkdCategory, frac: rawTiu - base.TIU },
    { cat: 'TKP' as SkdCategory, frac: rawTkp - base.TKP },
  ];
  remainders.sort((a, b) => b.frac - a.frac);
  for (let i = 0; i < rem; i++) {
    base[remainders[i % 3].cat] += 1;
  }
  return base;
}

/**
 * Distributes 100 (Real) or 20 / 50 / 75 (Practice) SKB questions across the 4 IT pillars.
 */
export function allocateSkbCategoryCounts(
  sessionMode: SessionMode,
  totalSoal?: PracticeQuantityOption | number
): Record<SkbCategory, number> {
  if (sessionMode === 'REAL') {
    return { ...SKB_REAL_ALLOCATION };
  }
  const qty = Number(totalSoal);
  if (qty === 20) return { RPL: 5, BASIS_DATA: 5, MANAJEMEN_DATA: 5, JARINGAN_DASAR: 5 };
  if (qty === 50) return { RPL: 13, BASIS_DATA: 13, MANAJEMEN_DATA: 12, JARINGAN_DASAR: 12 };
  if (qty === 75) return { RPL: 19, BASIS_DATA: 19, MANAJEMEN_DATA: 19, JARINGAN_DASAR: 18 };

  const safeTotal = qty > 0 ? qty : 20;
  const base = Math.floor(safeTotal / 4);
  const rem = safeTotal % 4;
  return {
    RPL: base + (rem > 0 ? 1 : 0),
    BASIS_DATA: base + (rem > 1 ? 1 : 0),
    MANAJEMEN_DATA: base + (rem > 2 ? 1 : 0),
    JARINGAN_DASAR: base,
  };
}

export function calculatePassingThresholdsFromCounts(
  counts: Record<SkdCategory, number>,
  sessionMode: SessionMode
): PassingThresholds {
  if (
    sessionMode === 'REAL' &&
    counts.TWK === 30 &&
    counts.TIU === 35 &&
    counts.TKP === 45
  ) {
    return {
      twk: 65,
      tiu: 80,
      tkp: 166,
      maxTwk: 150,
      maxTiu: 175,
      maxTkp: 225,
    };
  }

  const maxTwk = counts.TWK * 5;
  const maxTiu = counts.TIU * 5;
  const maxTkp = counts.TKP * 5;

  return {
    twk: Math.ceil(maxTwk * PASSING_RATIOS.TWK),
    tiu: Math.ceil(maxTiu * PASSING_RATIOS.TIU),
    tkp: Math.ceil(maxTkp * PASSING_RATIOS.TKP),
    maxTwk,
    maxTiu,
    maxTkp,
  };
}

export function calculateTimeLimitSeconds(
  examType: ExamType,
  sessionMode: SessionMode,
  totalSoal: number
): number {
  if (sessionMode === 'REAL') {
    return examType === 'SKD' ? SKD_REAL_DURATION_SECONDS : SKB_REAL_DURATION_SECONDS;
  }

  if (examType === 'SKD') {
    // Proportional to BKN 100 minutes / 110 questions (~54.54s per question)
    if (totalSoal === 20) return 18 * 60;
    if (totalSoal === 50) return 45 * 60;
    if (totalSoal === 75) return 68 * 60;
    return Math.round((totalSoal * 6000) / 110);
  }

  // SKB: proportional to BKN 90 minutes / 100 questions (54s per question)
  if (totalSoal === 20) return 18 * 60;
  if (totalSoal === 50) return 45 * 60;
  if (totalSoal === 75) return 68 * 60;
  return Math.round(totalSoal * 54);
}

export function shuffleArray<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createShuffledOptionOrder(rng: () => number = Math.random): OptionKey[] {
  return shuffleArray(OPTION_KEYS, rng);
}

export interface QuestionUsageStat {
  usageCount: number;
  lastSessionId: number;
}

export function selectPrioritizedQuestions<T extends { id: number }>(
  pool: readonly T[],
  count: number,
  usageByQuestionId: ReadonlyMap<number, QuestionUsageStat>,
  rng: () => number = Math.random
): T[] {
  if (count <= 0) return [];

  const grouped = new Map<string, { usageCount: number; lastSessionId: number; items: T[] }>();
  for (const item of pool) {
    const stat = usageByQuestionId.get(item.id);
    const usageCount = stat?.usageCount ?? 0;
    const lastSessionId = stat?.lastSessionId ?? 0;
    const key = `${usageCount}:${lastSessionId}`;
    let bucket = grouped.get(key);
    if (!bucket) {
      bucket = { usageCount, lastSessionId, items: [] };
      grouped.set(key, bucket);
    }
    bucket.items.push(item);
  }

  const orderedTiers = Array.from(grouped.values()).sort((a, b) => {
    if (a.usageCount !== b.usageCount) return a.usageCount - b.usageCount;
    return a.lastSessionId - b.lastSessionId;
  });

  const picked: T[] = [];
  for (const tier of orderedTiers) {
    if (picked.length >= count) break;
    const shuffledTier = shuffleArray(tier.items, rng);
    const needed = count - picked.length;
    picked.push(...shuffledTier.slice(0, needed));
  }

  return shuffleArray(picked, rng);
}

export function mapDisplayLabelToOriginal(
  opsiOrder: readonly OptionKey[],
  displayLabel: OptionKey | null
): OptionKey | null {
  if (!displayLabel) return null;
  const idx = OPTION_KEYS.indexOf(displayLabel);
  return idx >= 0 && idx < opsiOrder.length ? opsiOrder[idx] : null;
}

export function mapOriginalKeyToDisplayLabel(
  opsiOrder: readonly OptionKey[],
  originalKey: OptionKey | null
): OptionKey | null {
  if (!originalKey) return null;
  const idx = opsiOrder.indexOf(originalKey);
  return idx >= 0 ? OPTION_KEYS[idx] : null;
}

export interface EvaluableQuestion {
  exam_type?: ExamType;
  kategori: QuestionCategory;
  jawaban_benar: OptionKey;
  bobot_tkp: TkpWeights | null;
}

export interface EvaluatedResult {
  status: AnswerStatus;
  poin: number;
}

export function evaluateSkdAnswer(
  question: EvaluableQuestion,
  originalUserAnswer: OptionKey | null
): EvaluatedResult {
  if (!originalUserAnswer) {
    return { status: 'KOSONG', poin: 0 };
  }

  if (question.kategori === 'TKP') {
    const weights = question.bobot_tkp;
    const poin = weights
      ? weights[originalUserAnswer] ?? 0
      : originalUserAnswer === question.jawaban_benar
      ? 5
      : 1;
    return {
      status: poin === 5 ? 'BENAR' : 'SALAH',
      poin,
    };
  }

  const isCorrect = originalUserAnswer === question.jawaban_benar;
  return {
    status: isCorrect ? 'BENAR' : 'SALAH',
    poin: isCorrect ? 5 : 0,
  };
}

export function evaluateSkbAnswer(
  question: EvaluableQuestion,
  originalUserAnswer: OptionKey | null
): EvaluatedResult {
  if (!originalUserAnswer) {
    return { status: 'KOSONG', poin: 0 };
  }
  const isCorrect = originalUserAnswer === question.jawaban_benar;
  return {
    status: isCorrect ? 'BENAR' : 'SALAH',
    poin: isCorrect ? 5 : 0,
  };
}

export function evaluateAnswer(
  question: EvaluableQuestion,
  originalUserAnswer: OptionKey | null
): EvaluatedResult {
  const isSkb =
    question.exam_type === 'SKB' ||
    (SKB_CATEGORIES as readonly string[]).includes(question.kategori);
  return isSkb
    ? evaluateSkbAnswer(question, originalUserAnswer)
    : evaluateSkdAnswer(question, originalUserAnswer);
}

export interface ScoredAnswerItem {
  kategori: QuestionCategory;
  subtopik?: string;
  status?: AnswerStatus;
  poin: number;
}

function roundOneDecimal(val: number): number {
  return Math.round(val * 10) / 10;
}

function buildSubtopikRecommendations(answers: readonly ScoredAnswerItem[]): string[] {
  const stats = new Map<string, { label: string; missed: number; total: number }>();
  for (const ans of answers) {
    const sub = ans.subtopik?.trim() || CATEGORY_DISPLAY_NAMES[ans.kategori];
    const key = `${ans.kategori}::${sub}`;
    const entry = stats.get(key) ?? {
      label: `${CATEGORY_DISPLAY_NAMES[ans.kategori]} — ${sub}`,
      missed: 0,
      total: 0,
    };
    entry.total += 1;
    if (ans.status === 'SALAH' || ans.status === 'KOSONG' || ans.poin < 5) {
      entry.missed += 1;
    }
    stats.set(key, entry);
  }

  return Array.from(stats.values())
    .filter((s) => s.missed > 0)
    .sort((a, b) => {
      const rateA = a.missed / a.total;
      const rateB = b.missed / b.total;
      if (rateB !== rateA) return rateB - rateA;
      return b.missed - a.missed;
    })
    .slice(0, 4)
    .map((s) => s.label);
}

export function computeSkdScoreSummary(
  answers: readonly ScoredAnswerItem[],
  sessionMode: SessionMode
): {
  skor_twk: number;
  skor_tiu: number;
  skor_tkp: number;
  skor_total: number;
  skor_maksimal: number;
  persentase_total: number;
  lulus_passing_grade: boolean;
  passing_thresholds: PassingThresholds;
  breakdown_skor: CategoryScoreBreakdown[];
  topik_rekomendasi: string[];
} {
  const buckets: Record<SkdCategory, ScoredAnswerItem[]> = {
    TWK: [],
    TIU: [],
    TKP: [],
  };
  for (const ans of answers) {
    if (ans.kategori === 'TWK' || ans.kategori === 'TIU' || ans.kategori === 'TKP') {
      buckets[ans.kategori].push(ans);
    }
  }

  const counts: Record<SkdCategory, number> = {
    TWK: buckets.TWK.length,
    TIU: buckets.TIU.length,
    TKP: buckets.TKP.length,
  };
  const thresholds = calculatePassingThresholdsFromCounts(counts, sessionMode);

  const makeBreakdown = (
    cat: SkdCategory,
    pg: number,
    maxFromThreshold: number
  ): CategoryScoreBreakdown => {
    const list = buckets[cat];
    const skor = list.reduce((acc, item) => acc + item.poin, 0);
    const totalSoal = list.length;
    const skorMaksimal = totalSoal > 0 ? totalSoal * 5 : maxFromThreshold;
    const benar = list.filter((i) => (i.status ? i.status === 'BENAR' : i.poin === 5)).length;
    const kosong = list.filter((i) => i.status === 'KOSONG').length;
    const salah = totalSoal - benar - kosong;
    return {
      kategori: cat,
      nama: CATEGORY_DISPLAY_NAMES[cat],
      skor,
      skorMaksimal,
      benar,
      salah,
      kosong,
      totalSoal,
      persentase: skorMaksimal > 0 ? roundOneDecimal((skor * 100) / skorMaksimal) : 0,
      passingGrade: pg,
      lulus: skor >= pg,
    };
  };

  const bTwk = makeBreakdown('TWK', thresholds.twk, thresholds.maxTwk);
  const bTiu = makeBreakdown('TIU', thresholds.tiu, thresholds.maxTiu);
  const bTkp = makeBreakdown('TKP', thresholds.tkp, thresholds.maxTkp);

  const skor_twk = bTwk.skor;
  const skor_tiu = bTiu.skor;
  const skor_tkp = bTkp.skor;
  const skor_total = skor_twk + skor_tiu + skor_tkp;
  const skor_maksimal = bTwk.skorMaksimal + bTiu.skorMaksimal + bTkp.skorMaksimal;
  const lulus = Boolean(bTwk.lulus && bTiu.lulus && bTkp.lulus);

  return {
    skor_twk,
    skor_tiu,
    skor_tkp,
    skor_total,
    skor_maksimal,
    persentase_total: skor_maksimal > 0 ? roundOneDecimal((skor_total * 100) / skor_maksimal) : 0,
    lulus_passing_grade: lulus,
    passing_thresholds: thresholds,
    breakdown_skor: [bTwk, bTiu, bTkp],
    topik_rekomendasi: buildSubtopikRecommendations(answers),
  };
}

export function computeSkbScoreSummary(answers: readonly ScoredAnswerItem[]): {
  skor_twk: number;
  skor_tiu: number;
  skor_tkp: number;
  skor_total: number;
  skor_maksimal: number;
  persentase_total: number;
  lulus_passing_grade: boolean;
  breakdown_skor: CategoryScoreBreakdown[];
  topik_rekomendasi: string[];
} {
  const buckets: Record<SkbCategory, ScoredAnswerItem[]> = {
    RPL: [],
    BASIS_DATA: [],
    MANAJEMEN_DATA: [],
    JARINGAN_DASAR: [],
  };

  for (const ans of answers) {
    if (
      ans.kategori === 'RPL' ||
      ans.kategori === 'BASIS_DATA' ||
      ans.kategori === 'MANAJEMEN_DATA' ||
      ans.kategori === 'JARINGAN_DASAR'
    ) {
      buckets[ans.kategori].push(ans);
    }
  }

  const breakdown_skor: CategoryScoreBreakdown[] = SKB_CATEGORIES.map((cat) => {
    const list = buckets[cat];
    const totalSoal = list.length;
    const skor = list.reduce((acc, item) => acc + item.poin, 0);
    const skorMaksimal = totalSoal * 5;
    const benar = list.filter((i) => (i.status ? i.status === 'BENAR' : i.poin === 5)).length;
    const kosong = list.filter((i) => i.status === 'KOSONG').length;
    const salah = totalSoal - benar - kosong;
    return {
      kategori: cat,
      nama: CATEGORY_DISPLAY_NAMES[cat],
      skor,
      skorMaksimal,
      benar,
      salah,
      kosong,
      totalSoal,
      persentase: skorMaksimal > 0 ? roundOneDecimal((skor * 100) / skorMaksimal) : 0,
    };
  });

  const skor_total = breakdown_skor.reduce((acc, b) => acc + b.skor, 0);
  const skor_maksimal = breakdown_skor.reduce((acc, b) => acc + b.skorMaksimal, 0);
  const persentase_total =
    skor_maksimal > 0 ? roundOneDecimal((skor_total * 100) / skor_maksimal) : 0;

  return {
    skor_twk: 0,
    skor_tiu: 0,
    skor_tkp: 0,
    skor_total,
    skor_maksimal,
    persentase_total,
    lulus_passing_grade: persentase_total >= 65,
    breakdown_skor,
    topik_rekomendasi: buildSubtopikRecommendations(answers),
  };
}
