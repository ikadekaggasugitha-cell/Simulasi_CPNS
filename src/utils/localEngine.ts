import {
  OPTION_KEYS,
  SKB_CATEGORIES,
  SKD_CATEGORIES,
  allocateSkbCategoryCounts,
  allocateSkdCategoryCounts,
  calculatePassingThresholdsFromCounts,
  calculateTimeLimitSeconds,
  computeSkbScoreSummary,
  computeSkdScoreSummary,
  createShuffledOptionOrder,
  evaluateAnswer,
  mapDisplayLabelToOriginal,
  mapOriginalKeyToDisplayLabel,
  selectPrioritizedQuestions,
  type QuestionUsageStat,
} from '../../server/scoring';
import type {
  AnswerStatus,
  CategoryMeta,
  CategoryScoreBreakdown,
  CreateSkbSessionPayload,
  CreateSkdSessionPayload,
  DisplayedOption,
  ExamQuestionItem,
  ExamType,
  HintResponse,
  OptionKey,
  PracticeQuantityOption,
  QuestionBankStats,
  QuestionCategory,
  QuestionRecord,
  SessionDetailResponse,
  SessionMode,
  SessionStatus,
  SessionSummary,
  TimeMode,
} from '../shared/types';

interface StoredSession {
  id: number;
  exam_type: ExamType;
  session_mode: SessionMode;
  session_number: number;
  nama_sesi: string;
  mode_waktu: TimeMode;
  paket_soal: string;
  jumlah_per_kategori: number;
  total_soal: number;
  batas_waktu_detik: number | null;
  durasi_pengerjaan_detik: number;
  status: SessionStatus;
  skor_twk: number;
  skor_tiu: number;
  skor_tkp: number;
  skor_total: number;
  skor_maksimal: number;
  persentase_total: number;
  lulus_passing_grade: boolean;
  breakdown_skor: CategoryScoreBreakdown[];
  topik_rekomendasi: string[];
  created_at: string;
  completed_at: string | null;
}

interface StoredAnswer {
  id: number;
  session_id: number;
  question_id: number;
  urutan: number;
  opsi_order: OptionKey[];
  jawaban_user: OptionKey | null;
  status: AnswerStatus;
  poin: number;
  ditandai: boolean;
}

interface StoredMeta {
  nextSessionId: number;
  nextAnswerId: number;
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const KEY_SESSIONS = 'cat_asn_sessions_v1';
const KEY_ANSWERS = 'cat_asn_answers_v1';
const KEY_META = 'cat_asn_meta_v1';

const memoryFallbackMap = new Map<string, string>();
const memoryStorage: StorageLike = {
  getItem: (k) => memoryFallbackMap.get(k) ?? null,
  setItem: (k, v) => {
    memoryFallbackMap.set(k, v);
  },
};

let activeStorage: StorageLike | null = null;

function getStorage(): StorageLike {
  if (activeStorage) return activeStorage;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const probe = '__cat_asn_probe__';
      window.localStorage.setItem(probe, '1');
      window.localStorage.removeItem(probe);
      activeStorage = window.localStorage;
      return activeStorage;
    }
  } catch {
    // Fall back to in-memory storage when localStorage is blocked
  }
  activeStorage = memoryStorage;
  return activeStorage;
}

export function setLocalEngineStorageForTest(customStorage: StorageLike | null): void {
  activeStorage = customStorage;
}

let catalogPromise: Promise<{
  categories: CategoryMeta[];
  questions: QuestionRecord[];
  byId: Map<number, QuestionRecord>;
}> | null = null;

async function loadCatalog() {
  if (!catalogPromise) {
    catalogPromise = import('../../server/seed/catalog').then((mod) => {
      const questions = mod.getSeedQuestionRecords();
      const byId = new Map<number, QuestionRecord>();
      for (const q of questions) {
        byId.set(q.id, q);
      }
      return {
        categories: mod.SEED_CATEGORIES,
        questions,
        byId,
      };
    });
  }
  return catalogPromise;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = getStorage().getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  try {
    getStorage().setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota warnings gracefully
  }
}

function getSessions(): StoredSession[] {
  return readJson<StoredSession[]>(KEY_SESSIONS, []);
}

function saveSessions(sessions: StoredSession[]): void {
  writeJson(KEY_SESSIONS, sessions);
}

function getAnswers(): StoredAnswer[] {
  return readJson<StoredAnswer[]>(KEY_ANSWERS, []);
}

function saveAnswers(answers: StoredAnswer[]): void {
  writeJson(KEY_ANSWERS, answers);
}

function allocateIds(answerCount: number): { sessionId: number; firstAnswerId: number } {
  const meta = readJson<StoredMeta>(KEY_META, { nextSessionId: 1, nextAnswerId: 1 });
  const sessionId = meta.nextSessionId;
  const firstAnswerId = meta.nextAnswerId;
  writeJson<StoredMeta>(KEY_META, {
    nextSessionId: sessionId + 1,
    nextAnswerId: firstAnswerId + answerCount,
  });
  return { sessionId, firstAnswerId };
}

function getOptionText(q: QuestionRecord, key: OptionKey): string {
  switch (key) {
    case 'A':
      return q.opsi_a;
    case 'B':
      return q.opsi_b;
    case 'C':
      return q.opsi_c;
    case 'D':
      return q.opsi_d;
    case 'E':
      return q.opsi_e;
  }
}

function toSessionSummary(row: StoredSession): SessionSummary {
  const isSkd = row.exam_type === 'SKD';
  const maxScore = row.skor_maksimal > 0 ? row.skor_maksimal : row.total_soal * 5;
  const sessionMode: SessionMode = row.session_mode === 'REAL' ? 'REAL' : 'PRACTICE';

  let skdThresholds = null;
  if (isSkd) {
    const counts = allocateSkdCategoryCounts(sessionMode, row.total_soal);
    skdThresholds = calculatePassingThresholdsFromCounts(counts, sessionMode);
  }

  return {
    ...row,
    skor_maksimal: maxScore,
    passing_thresholds: skdThresholds,
  };
}

function buildExamItems(
  answers: StoredAnswer[],
  byId: Map<number, QuestionRecord>,
  includeSolutions: boolean
): ExamQuestionItem[] {
  return answers
    .slice()
    .sort((a, b) => a.urutan - b.urutan)
    .map((ans) => {
      const q = byId.get(ans.question_id);
      if (!q) {
        throw new Error(`Soal ID ${ans.question_id} tidak ditemukan.`);
      }

      const weights =
        q.exam_type === 'SKD' && q.kategori === 'TKP' ? q.bobot_tkp : null;

      const options: DisplayedOption[] = OPTION_KEYS.map((displayLabel, idx) => {
        const originalKey = ans.opsi_order[idx];
        return {
          label: displayLabel,
          originalKey,
          text: getOptionText(q, originalKey),
          ...(includeSolutions && weights ? { bobot: weights[originalKey] } : {}),
        };
      });

      const selectedLabel = mapOriginalKeyToDisplayLabel(ans.opsi_order, ans.jawaban_user);
      const correctLabel = mapOriginalKeyToDisplayLabel(ans.opsi_order, q.jawaban_benar) ?? 'A';

      return {
        answerId: ans.id,
        questionId: ans.question_id,
        urutan: ans.urutan,
        exam_type: q.exam_type,
        kategori: q.kategori,
        subtopik: q.subtopik,
        pertanyaan: q.pertanyaan,
        options,
        selectedLabel,
        ditandai: ans.ditandai,
        ...(includeSolutions
          ? {
              correctLabel,
              pembahasan: q.pembahasan,
              status: ans.status,
              poin: ans.poin,
            }
          : {}),
      };
    });
}

function getUsageMapForExamType(
  sessions: StoredSession[],
  answers: StoredAnswer[],
  examType: ExamType
): Map<number, QuestionUsageStat> {
  const matchingIds = new Set(
    sessions.filter((s) => s.exam_type === examType).map((s) => s.id)
  );
  const map = new Map<number, QuestionUsageStat>();
  for (const ans of answers) {
    if (!matchingIds.has(ans.session_id)) continue;
    const prev = map.get(ans.question_id);
    if (!prev) {
      map.set(ans.question_id, { usageCount: 1, lastSessionId: ans.session_id });
    } else {
      prev.usageCount += 1;
      if (ans.session_id > prev.lastSessionId) {
        prev.lastSessionId = ans.session_id;
      }
    }
  }
  return map;
}

export async function localFetchHealth(): Promise<{
  ok: boolean;
  bankStats: QuestionBankStats;
  categories: CategoryMeta[];
}> {
  const { categories, questions } = await loadCatalog();
  const byCategory: Record<QuestionCategory, number> = {
    TWK: 0,
    TIU: 0,
    TKP: 0,
    RPL: 0,
    BASIS_DATA: 0,
    MANAJEMEN_DATA: 0,
    JARINGAN_DASAR: 0,
  };
  let skdTotal = 0;
  let skbTotal = 0;
  for (const q of questions) {
    byCategory[q.kategori] += 1;
    if (q.exam_type === 'SKD') skdTotal += 1;
    else skbTotal += 1;
  }

  return {
    ok: true,
    bankStats: {
      total: skdTotal + skbTotal,
      skdTotal,
      skbTotal,
      byCategory,
    },
    categories,
  };
}

export async function localFetchQuestionsBank(params?: {
  examType?: ExamType;
  kategori?: string;
  q?: string;
}): Promise<{ total: number; questions: QuestionRecord[] }> {
  const { questions } = await loadCatalog();
  const examType = params?.examType;
  const kategori = params?.kategori?.toUpperCase();
  const q = params?.q?.trim().toLowerCase() ?? '';

  const filtered = questions.filter((item) => {
    if (examType && item.exam_type !== examType) return false;
    if (kategori && kategori !== 'ALL' && item.kategori !== kategori) return false;
    if (q) {
      return (
        item.pertanyaan.toLowerCase().includes(q) ||
        item.subtopik.toLowerCase().includes(q) ||
        item.pembahasan.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return {
    total: filtered.length,
    questions: filtered,
  };
}

export async function localFetchSessions(
  examType?: ExamType
): Promise<{ sessions: SessionSummary[] }> {
  const sessions = getSessions()
    .filter((s) => !examType || s.exam_type === examType)
    .sort((a, b) => b.id - a.id);

  return {
    sessions: sessions.map(toSessionSummary),
  };
}

export async function localCreateSkdSession(
  payload: CreateSkdSessionPayload
): Promise<SessionDetailResponse> {
  const { questions, byId } = await loadCatalog();
  const sessionMode: SessionMode =
    payload.sessionMode === 'REAL' || payload.sessionMode === 'PRACTICE'
      ? payload.sessionMode
      : 'PRACTICE';

  let totalRequested = 110;
  let modeWaktu: TimeMode = 'TIMED';
  let paketSoal = 'REAL_BKN';

  if (sessionMode === 'PRACTICE') {
    const qty = payload.totalSoal as PracticeQuantityOption | undefined;
    if (qty !== 20 && qty !== 50 && qty !== 75) {
      throw new Error('Pada Mode Latihan SKD, jumlah soal harus 20, 50, atau 75 soal.');
    }
    if (payload.modeWaktu !== 'TIMED' && payload.modeWaktu !== 'UNTIMED') {
      throw new Error('Mode waktu pada Mode Latihan tidak valid.');
    }
    totalRequested = qty;
    modeWaktu = payload.modeWaktu;
    paketSoal = `PRACTICE_${qty}`;
  }

  const sessions = getSessions();
  const answers = getAnswers();
  const counts = allocateSkdCategoryCounts(sessionMode, totalRequested);
  const usageMap = getUsageMapForExamType(sessions, answers, 'SKD');
  const selectedQuestions: QuestionRecord[] = [];

  for (const cat of SKD_CATEGORIES) {
    const needed = counts[cat];
    const pool = questions.filter((q) => q.exam_type === 'SKD' && q.kategori === cat);
    selectedQuestions.push(...selectPrioritizedQuestions(pool, needed, usageMap));
  }

  const maxNum = sessions
    .filter((s) => s.exam_type === 'SKD' && s.session_mode === sessionMode)
    .reduce((max, s) => Math.max(max, s.session_number), 0);
  const sessionNumber = maxNum + 1;
  const namaSesi =
    sessionMode === 'REAL'
      ? `SKD Real Session ${sessionNumber}`
      : `SKD Practice Session ${sessionNumber}`;
  const totalSoal = selectedQuestions.length;
  const { sessionId, firstAnswerId } = allocateIds(totalSoal);

  const newSession: StoredSession = {
    id: sessionId,
    exam_type: 'SKD',
    session_mode: sessionMode,
    session_number: sessionNumber,
    nama_sesi: namaSesi,
    mode_waktu: modeWaktu,
    paket_soal: paketSoal,
    jumlah_per_kategori: Math.round(totalSoal / 3),
    total_soal: totalSoal,
    batas_waktu_detik:
      modeWaktu === 'TIMED'
        ? calculateTimeLimitSeconds('SKD', sessionMode, totalSoal)
        : null,
    durasi_pengerjaan_detik: 0,
    status: 'IN_PROGRESS',
    skor_twk: 0,
    skor_tiu: 0,
    skor_tkp: 0,
    skor_total: 0,
    skor_maksimal: totalSoal * 5,
    persentase_total: 0,
    lulus_passing_grade: false,
    breakdown_skor: [],
    topik_rekomendasi: [],
    created_at: new Date().toISOString(),
    completed_at: null,
  };

  const newAnswers: StoredAnswer[] = selectedQuestions.map((q, idx) => ({
    id: firstAnswerId + idx,
    session_id: sessionId,
    question_id: q.id,
    urutan: idx + 1,
    opsi_order: createShuffledOptionOrder(),
    jawaban_user: null,
    status: 'KOSONG',
    poin: 0,
    ditandai: false,
  }));

  saveSessions([...sessions, newSession]);
  saveAnswers([...answers, ...newAnswers]);

  return {
    session: toSessionSummary(newSession),
    items: buildExamItems(newAnswers, byId, false),
  };
}

export async function localCreateSkbSession(
  payload: CreateSkbSessionPayload
): Promise<SessionDetailResponse> {
  const { questions, byId } = await loadCatalog();
  const sessionMode: SessionMode =
    payload.sessionMode === 'REAL' || payload.sessionMode === 'PRACTICE'
      ? payload.sessionMode
      : 'PRACTICE';

  let totalRequested = 100;
  let modeWaktu: TimeMode = 'TIMED';
  let paketSoal = 'REAL_BKN';

  if (sessionMode === 'PRACTICE') {
    const qty = payload.totalSoal as PracticeQuantityOption | undefined;
    if (qty !== 20 && qty !== 50 && qty !== 75) {
      throw new Error('Pada Mode Latihan SKB, jumlah soal harus 20, 50, atau 75 soal.');
    }
    if (payload.modeWaktu !== 'TIMED' && payload.modeWaktu !== 'UNTIMED') {
      throw new Error('Mode waktu pada Mode Latihan tidak valid.');
    }
    totalRequested = qty;
    modeWaktu = payload.modeWaktu;
    paketSoal = `PRACTICE_${qty}`;
  }

  const sessions = getSessions();
  const answers = getAnswers();
  const counts = allocateSkbCategoryCounts(sessionMode, totalRequested);
  const usageMap = getUsageMapForExamType(sessions, answers, 'SKB');
  const selectedQuestions: QuestionRecord[] = [];

  for (const cat of SKB_CATEGORIES) {
    const needed = counts[cat];
    const pool = questions.filter((q) => q.exam_type === 'SKB' && q.kategori === cat);
    selectedQuestions.push(...selectPrioritizedQuestions(pool, needed, usageMap));
  }

  const maxNum = sessions
    .filter((s) => s.exam_type === 'SKB' && s.session_mode === sessionMode)
    .reduce((max, s) => Math.max(max, s.session_number), 0);
  const sessionNumber = maxNum + 1;
  const namaSesi =
    sessionMode === 'REAL'
      ? `SKB Real Session ${sessionNumber}`
      : `SKB Practice Session ${sessionNumber}`;
  const totalSoal = selectedQuestions.length;
  const { sessionId, firstAnswerId } = allocateIds(totalSoal);

  const newSession: StoredSession = {
    id: sessionId,
    exam_type: 'SKB',
    session_mode: sessionMode,
    session_number: sessionNumber,
    nama_sesi: namaSesi,
    mode_waktu: modeWaktu,
    paket_soal: paketSoal,
    jumlah_per_kategori: Math.round(totalSoal / 4),
    total_soal: totalSoal,
    batas_waktu_detik:
      modeWaktu === 'TIMED'
        ? calculateTimeLimitSeconds('SKB', sessionMode, totalSoal)
        : null,
    durasi_pengerjaan_detik: 0,
    status: 'IN_PROGRESS',
    skor_twk: 0,
    skor_tiu: 0,
    skor_tkp: 0,
    skor_total: 0,
    skor_maksimal: totalSoal * 5,
    persentase_total: 0,
    lulus_passing_grade: false,
    breakdown_skor: [],
    topik_rekomendasi: [],
    created_at: new Date().toISOString(),
    completed_at: null,
  };

  const newAnswers: StoredAnswer[] = selectedQuestions.map((q, idx) => ({
    id: firstAnswerId + idx,
    session_id: sessionId,
    question_id: q.id,
    urutan: idx + 1,
    opsi_order: createShuffledOptionOrder(),
    jawaban_user: null,
    status: 'KOSONG',
    poin: 0,
    ditandai: false,
  }));

  saveSessions([...sessions, newSession]);
  saveAnswers([...answers, ...newAnswers]);

  return {
    session: toSessionSummary(newSession),
    items: buildExamItems(newAnswers, byId, false),
  };
}

export async function localFetchSessionDetail(
  sessionId: number
): Promise<SessionDetailResponse> {
  const { byId } = await loadCatalog();
  const session = getSessions().find((s) => s.id === sessionId);
  if (!session) {
    throw new Error('Sesi ujian tidak ditemukan.');
  }
  const answers = getAnswers().filter((a) => a.session_id === sessionId);
  return {
    session: toSessionSummary(session),
    items: buildExamItems(answers, byId, session.status === 'COMPLETED'),
  };
}

export async function localFetchAnswerHint(
  sessionId: number,
  answerId: number
): Promise<HintResponse> {
  const { byId } = await loadCatalog();
  const session = getSessions().find((s) => s.id === sessionId);
  if (!session) {
    throw new Error('Sesi tidak ditemukan.');
  }
  if (session.session_mode === 'REAL' && session.status === 'IN_PROGRESS') {
    throw new Error(
      'Fitur bantuan (i) dinonaktifkan selama Mode Real Ujian berlangsung. Pembahasan dapat dilihat setelah selesai ujian.'
    );
  }

  const ans = getAnswers().find(
    (a) => a.session_id === sessionId && a.id === answerId
  );
  if (!ans) {
    throw new Error('Soal pada sesi ini tidak ditemukan.');
  }
  const q = byId.get(ans.question_id);
  if (!q) {
    throw new Error('Soal tidak ditemukan di bank soal.');
  }

  const correctLabel = mapOriginalKeyToDisplayLabel(ans.opsi_order, q.jawaban_benar) ?? 'A';
  const correctText = getOptionText(q, q.jawaban_benar);
  const weights = q.exam_type === 'SKD' && q.kategori === 'TKP' ? q.bobot_tkp : null;

  return {
    questionId: q.id,
    exam_type: q.exam_type,
    kategori: q.kategori,
    subtopik: q.subtopik,
    correctLabel,
    correctText,
    pembahasan: q.pembahasan,
    ...(weights
      ? {
          weightsByLabel: OPTION_KEYS.map((label, idx) => {
            const orig = ans.opsi_order[idx];
            return {
              label,
              text: getOptionText(q, orig),
              poin: weights[orig],
            };
          }),
        }
      : {}),
  };
}

export async function localSaveSessionAnswer(
  sessionId: number,
  payload: {
    answerId?: number;
    selectedLabel?: OptionKey | null;
    ditandai?: boolean;
    elapsedSeconds?: number;
  }
): Promise<{ ok: boolean }> {
  const sessions = getSessions();
  const sIdx = sessions.findIndex((s) => s.id === sessionId);
  if (sIdx === -1) throw new Error('Sesi tidak ditemukan.');
  if (sessions[sIdx].status !== 'IN_PROGRESS') {
    throw new Error('Sesi sudah diselesaikan dan tidak dapat diubah.');
  }

  if (typeof payload.answerId === 'number') {
    const answers = getAnswers();
    const aIdx = answers.findIndex(
      (a) => a.id === payload.answerId && a.session_id === sessionId
    );
    if (aIdx === -1) throw new Error('Jawaban soal tidak ditemukan.');
    const cur = answers[aIdx];
    const nextOriginal =
      payload.selectedLabel !== undefined
        ? mapDisplayLabelToOriginal(cur.opsi_order, payload.selectedLabel)
        : cur.jawaban_user;
    const nextFlag = payload.ditandai !== undefined ? payload.ditandai : cur.ditandai;

    answers[aIdx] = {
      ...cur,
      jawaban_user: nextOriginal,
      ditandai: nextFlag,
    };
    saveAnswers(answers);
  }

  if (
    typeof payload.elapsedSeconds === 'number' &&
    Number.isFinite(payload.elapsedSeconds) &&
    payload.elapsedSeconds >= 0
  ) {
    sessions[sIdx] = {
      ...sessions[sIdx],
      durasi_pengerjaan_detik: Math.max(
        sessions[sIdx].durasi_pengerjaan_detik,
        Math.floor(payload.elapsedSeconds)
      ),
    };
    saveSessions(sessions);
  }

  return { ok: true };
}

export async function localSubmitSession(
  sessionId: number,
  elapsedSeconds?: number
): Promise<SessionDetailResponse> {
  const { byId } = await loadCatalog();
  const sessions = getSessions();
  const sIdx = sessions.findIndex((s) => s.id === sessionId);
  if (sIdx === -1) throw new Error('Sesi tidak ditemukan.');
  const session = sessions[sIdx];

  if (session.status === 'COMPLETED') {
    return localFetchSessionDetail(sessionId);
  }

  const allAnswers = getAnswers();
  const sessionAnswers = allAnswers.filter((a) => a.session_id === sessionId);

  const evaluated = sessionAnswers.map((ans) => {
    const q = byId.get(ans.question_id)!;
    const result = evaluateAnswer(
      {
        exam_type: session.exam_type,
        kategori: q.kategori,
        jawaban_benar: q.jawaban_benar,
        bobot_tkp: q.bobot_tkp,
      },
      ans.jawaban_user
    );
    return {
      answerId: ans.id,
      kategori: q.kategori,
      subtopik: q.subtopik,
      status: result.status,
      poin: result.poin,
    };
  });

  const summary =
    session.exam_type === 'SKD'
      ? computeSkdScoreSummary(evaluated, session.session_mode)
      : computeSkbScoreSummary(evaluated);

  const rawDuration =
    typeof elapsedSeconds === 'number' && Number.isFinite(elapsedSeconds)
      ? Math.max(session.durasi_pengerjaan_detik, Math.floor(elapsedSeconds))
      : session.durasi_pengerjaan_detik;

  const finalDuration =
    session.batas_waktu_detik !== null
      ? Math.min(session.batas_waktu_detik, Math.max(1, rawDuration))
      : Math.max(1, rawDuration);

  const evalById = new Map(evaluated.map((e) => [e.answerId, e]));
  const updatedAllAnswers = allAnswers.map((ans) => {
    const ev = evalById.get(ans.id);
    return ev ? { ...ans, status: ev.status, poin: ev.poin } : ans;
  });

  const updatedSession: StoredSession = {
    ...session,
    status: 'COMPLETED',
    skor_twk: summary.skor_twk,
    skor_tiu: summary.skor_tiu,
    skor_tkp: summary.skor_tkp,
    skor_total: summary.skor_total,
    skor_maksimal: summary.skor_maksimal,
    persentase_total: summary.persentase_total,
    lulus_passing_grade: summary.lulus_passing_grade,
    breakdown_skor: summary.breakdown_skor,
    topik_rekomendasi: summary.topik_rekomendasi,
    durasi_pengerjaan_detik: finalDuration,
    completed_at: new Date().toISOString(),
  };

  sessions[sIdx] = updatedSession;
  saveAnswers(updatedAllAnswers);
  saveSessions(sessions);

  const updatedSessionAnswers = updatedAllAnswers.filter(
    (a) => a.session_id === sessionId
  );

  return {
    session: toSessionSummary(updatedSession),
    items: buildExamItems(updatedSessionAnswers, byId, true),
  };
}

export async function localDeleteSession(sessionId: number): Promise<{ ok: boolean }> {
  const sessions = getSessions();
  const nextSessions = sessions.filter((s) => s.id !== sessionId);
  if (nextSessions.length === sessions.length) {
    throw new Error('Sesi tidak ditemukan.');
  }
  const nextAnswers = getAnswers().filter((a) => a.session_id !== sessionId);
  saveSessions(nextSessions);
  saveAnswers(nextAnswers);
  return { ok: true };
}
