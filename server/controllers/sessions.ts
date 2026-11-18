import type Database from 'better-sqlite3';
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
} from '../scoring';
import type {
  CategoryScoreBreakdown,
  CreateSkbSessionPayload,
  CreateSkdSessionPayload,
  DisplayedOption,
  ExamQuestionItem,
  ExamType,
  HintResponse,
  OptionKey,
  PracticeQuantityOption,
  QuestionCategory,
  SessionDetailResponse,
  SessionMode,
  SessionSummary,
  TkpWeights,
} from '../../src/shared/types';

export interface DbQuestionRow {
  id: number;
  exam_type: ExamType;
  kategori: QuestionCategory;
  subtopik: string;
  pertanyaan: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  opsi_e: string;
  jawaban_benar: OptionKey;
  bobot_tkp: string | null;
  pembahasan: string;
}

export interface DbSessionRow {
  id: number;
  user_id: number;
  exam_type: ExamType;
  session_mode: SessionMode;
  session_number: number;
  nama_sesi: string;
  mode_waktu: 'TIMED' | 'UNTIMED';
  paket_soal: string;
  jumlah_per_kategori: number;
  total_soal: number;
  batas_waktu_detik: number | null;
  durasi_pengerjaan_detik: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
  skor_twk: number;
  skor_tiu: number;
  skor_tkp: number;
  skor_total: number;
  skor_maksimal: number;
  persentase_total: number;
  lulus_passing_grade: number;
  breakdown_skor: string;
  topik_rekomendasi: string;
  created_at: string;
  completed_at: string | null;
}

interface DbSessionAnswerJoinedRow {
  answer_id: number;
  session_id: number;
  question_id: number;
  urutan: number;
  opsi_order: string;
  jawaban_user: OptionKey | null;
  status: 'BENAR' | 'SALAH' | 'KOSONG';
  poin: number;
  ditandai: number;
  exam_type: ExamType;
  kategori: QuestionCategory;
  subtopik: string;
  pertanyaan: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  opsi_e: string;
  jawaban_benar: OptionKey;
  bobot_tkp: string | null;
  pembahasan: string;
}

function getOptionText(
  row: Pick<DbQuestionRow, 'opsi_a' | 'opsi_b' | 'opsi_c' | 'opsi_d' | 'opsi_e'>,
  key: OptionKey
): string {
  switch (key) {
    case 'A':
      return row.opsi_a;
    case 'B':
      return row.opsi_b;
    case 'C':
      return row.opsi_c;
    case 'D':
      return row.opsi_d;
    case 'E':
      return row.opsi_e;
  }
}

function parseJsonSafe<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function formatSessionSummary(row: DbSessionRow): SessionSummary {
  const isSkd = row.exam_type === 'SKD';
  const maxScore = row.skor_maksimal > 0 ? row.skor_maksimal : row.total_soal * 5;
  const sessionMode: SessionMode = row.session_mode === 'REAL' ? 'REAL' : 'PRACTICE';

  let skdThresholds = null;
  if (isSkd) {
    const counts = allocateSkdCategoryCounts(sessionMode, row.total_soal);
    skdThresholds = calculatePassingThresholdsFromCounts(counts, sessionMode);
  }

  return {
    id: row.id,
    exam_type: row.exam_type,
    session_mode: sessionMode,
    session_number: row.session_number,
    nama_sesi: row.nama_sesi,
    mode_waktu: row.mode_waktu,
    paket_soal: row.paket_soal,
    jumlah_per_kategori: row.jumlah_per_kategori,
    total_soal: row.total_soal,
    batas_waktu_detik: row.batas_waktu_detik,
    durasi_pengerjaan_detik: row.durasi_pengerjaan_detik,
    status: row.status,
    skor_twk: row.skor_twk,
    skor_tiu: row.skor_tiu,
    skor_tkp: row.skor_tkp,
    skor_total: row.skor_total,
    skor_maksimal: maxScore,
    persentase_total:
      row.persentase_total > 0 || row.status === 'COMPLETED'
        ? row.persentase_total
        : 0,
    lulus_passing_grade: Boolean(row.lulus_passing_grade),
    breakdown_skor: parseJsonSafe<CategoryScoreBreakdown[]>(row.breakdown_skor, []),
    topik_rekomendasi: parseJsonSafe<string[]>(row.topik_rekomendasi, []),
    created_at: row.created_at,
    completed_at: row.completed_at,
    passing_thresholds: skdThresholds,
  };
}

function buildExamItems(
  rows: DbSessionAnswerJoinedRow[],
  includeSolutions: boolean
): ExamQuestionItem[] {
  return rows.map((r) => {
    const opsiOrder = JSON.parse(r.opsi_order) as OptionKey[];
    const weights =
      r.exam_type === 'SKD' && r.kategori === 'TKP' && r.bobot_tkp
        ? (JSON.parse(r.bobot_tkp) as TkpWeights)
        : null;

    const options: DisplayedOption[] = OPTION_KEYS.map((displayLabel, idx) => {
      const originalKey = opsiOrder[idx];
      return {
        label: displayLabel,
        originalKey,
        text: getOptionText(r, originalKey),
        ...(includeSolutions && weights ? { bobot: weights[originalKey] } : {}),
      };
    });

    const selectedLabel = mapOriginalKeyToDisplayLabel(opsiOrder, r.jawaban_user);
    const correctLabel = mapOriginalKeyToDisplayLabel(opsiOrder, r.jawaban_benar) ?? 'A';

    return {
      answerId: r.answer_id,
      questionId: r.question_id,
      urutan: r.urutan,
      exam_type: r.exam_type,
      kategori: r.kategori,
      subtopik: r.subtopik,
      pertanyaan: r.pertanyaan,
      options,
      selectedLabel,
      ditandai: Boolean(r.ditandai),
      ...(includeSolutions
        ? {
            correctLabel,
            pembahasan: r.pembahasan,
            status: r.status,
            poin: r.poin,
          }
        : {}),
    };
  });
}

function getUsageMapForExamType(
  db: Database.Database,
  userId: number,
  examType: ExamType
): Map<number, QuestionUsageStat> {
  const usageRows = db
    .prepare(
      `
      SELECT sa.question_id, COUNT(*) AS usage_count, MAX(sa.session_id) AS last_session_id
      FROM session_answers sa
      JOIN sessions s ON s.id = sa.session_id
      WHERE s.user_id = ? AND s.exam_type = ?
      GROUP BY sa.question_id
    `
    )
    .all(userId, examType) as Array<{
    question_id: number;
    usage_count: number;
    last_session_id: number;
  }>;

  const map = new Map<number, QuestionUsageStat>();
  for (const row of usageRows) {
    map.set(row.question_id, {
      usageCount: row.usage_count,
      lastSessionId: row.last_session_id,
    });
  }
  return map;
}

export function fetchUserSessions(
  db: Database.Database,
  userId: number,
  examType?: string,
  sessionMode?: string
): SessionSummary[] {
  const where: string[] = ['user_id = ?'];
  const params: Array<string | number> = [userId];

  if (examType === 'SKD' || examType === 'SKB') {
    where.push('exam_type = ?');
    params.push(examType);
  }
  if (sessionMode === 'REAL' || sessionMode === 'PRACTICE') {
    where.push('session_mode = ?');
    params.push(sessionMode);
  }

  const rows = db
    .prepare(`SELECT * FROM sessions WHERE ${where.join(' AND ')} ORDER BY id DESC`)
    .all(...params) as DbSessionRow[];

  return rows.map(formatSessionSummary);
}

export function fetchSessionDetail(
  db: Database.Database,
  sessionId: number,
  currentUserId: number
): { status: number; data?: SessionDetailResponse; error?: string } {
  const sessionRow = db
    .prepare('SELECT * FROM sessions WHERE id = ?')
    .get(sessionId) as DbSessionRow | undefined;

  if (!sessionRow) {
    return { status: 404, error: 'Sesi ujian tidak ditemukan.' };
  }

  if (sessionRow.user_id !== currentUserId) {
    return {
      status: 403,
      error: 'Akses ditolak (403 Forbidden): Anda tidak memiliki izin melihat sesi ujian pengguna lain.',
    };
  }

  const answerRows = db
    .prepare(
      `
      SELECT
        sa.id AS answer_id,
        sa.session_id,
        sa.question_id,
        sa.urutan,
        sa.opsi_order,
        sa.jawaban_user,
        sa.status,
        sa.poin,
        sa.ditandai,
        q.exam_type,
        q.kategori,
        q.subtopik,
        q.pertanyaan,
        q.opsi_a,
        q.opsi_b,
        q.opsi_c,
        q.opsi_d,
        q.opsi_e,
        q.jawaban_benar,
        q.bobot_tkp,
        q.pembahasan
      FROM session_answers sa
      JOIN questions q ON q.id = sa.question_id
      WHERE sa.session_id = ?
      ORDER BY sa.urutan ASC
    `
    )
    .all(sessionId) as DbSessionAnswerJoinedRow[];

  return {
    status: 200,
    data: {
      session: formatSessionSummary(sessionRow),
      items: buildExamItems(answerRows, sessionRow.status === 'COMPLETED'),
    },
  };
}

export function createSkdSession(
  db: Database.Database,
  userId: number,
  payload: Partial<CreateSkdSessionPayload>
): { status: number; data?: SessionDetailResponse; error?: string } {
  const sessionMode: SessionMode =
    payload.sessionMode === 'REAL' || payload.sessionMode === 'PRACTICE'
      ? payload.sessionMode
      : 'PRACTICE';

  let totalRequested = 110;
  let modeWaktu: 'TIMED' | 'UNTIMED' = 'TIMED';
  let paketSoal = 'REAL_BKN';

  if (sessionMode === 'PRACTICE') {
    const qty = payload.totalSoal as PracticeQuantityOption | undefined;
    if (qty !== 20 && qty !== 50 && qty !== 75) {
      return {
        status: 400,
        error: 'Pada Mode Latihan SKD, jumlah soal harus 20, 50, atau 75 soal.',
      };
    }
    if (payload.modeWaktu !== 'TIMED' && payload.modeWaktu !== 'UNTIMED') {
      return { status: 400, error: 'Mode waktu pada Mode Latihan tidak valid.' };
    }
    totalRequested = qty;
    modeWaktu = payload.modeWaktu;
    paketSoal = `PRACTICE_${qty}`;
  }

  const counts = allocateSkdCategoryCounts(sessionMode, totalRequested);
  const usageMap = getUsageMapForExamType(db, userId, 'SKD');
  const selectedQuestions: DbQuestionRow[] = [];

  for (const cat of SKD_CATEGORIES) {
    const needed = counts[cat];
    const pool = db
      .prepare("SELECT * FROM questions WHERE exam_type = 'SKD' AND kategori = ?")
      .all(cat) as DbQuestionRow[];

    if (pool.length < needed) {
      return {
        status: 500,
        error: `Bank soal SKD kategori ${cat} hanya memiliki ${pool.length} soal, kurang dari ${needed}.`,
      };
    }

    selectedQuestions.push(...selectPrioritizedQuestions(pool, needed, usageMap));
  }

  const nextRow = db
    .prepare(
      "SELECT COALESCE(MAX(session_number), 0) AS maxNum FROM sessions WHERE user_id = ? AND exam_type = 'SKD' AND session_mode = ?"
    )
    .get(userId, sessionMode) as { maxNum: number };
  const sessionNumber = nextRow.maxNum + 1;
  const namaSesi =
    sessionMode === 'REAL'
      ? `SKD Real Session ${sessionNumber}`
      : `SKD Practice Session ${sessionNumber}`;
  const totalSoal = selectedQuestions.length;
  const skorMaksimal = totalSoal * 5;
  const jumlahPerKategori = Math.round(totalSoal / 3);
  const batasWaktu =
    modeWaktu === 'TIMED'
      ? calculateTimeLimitSeconds('SKD', sessionMode, totalSoal)
      : null;
  const createdAt = new Date().toISOString();

  const insertSession = db.prepare(`
    INSERT INTO sessions (
      user_id, exam_type, session_mode, session_number, nama_sesi, mode_waktu, paket_soal,
      jumlah_per_kategori, total_soal, batas_waktu_detik, durasi_pengerjaan_detik,
      status, skor_maksimal, created_at
    ) VALUES (?, 'SKD', ?, ?, ?, ?, ?, ?, ?, ?, 0, 'IN_PROGRESS', ?, ?)
  `);

  const insertAnswer = db.prepare(`
    INSERT INTO session_answers (
      session_id, question_id, urutan, opsi_order, jawaban_user, status, poin, ditandai
    ) VALUES (?, ?, ?, ?, NULL, 'KOSONG', 0, 0)
  `);

  const sessionId = db.transaction(() => {
    const info = insertSession.run(
      userId,
      sessionMode,
      sessionNumber,
      namaSesi,
      modeWaktu,
      paketSoal,
      jumlahPerKategori,
      totalSoal,
      batasWaktu,
      skorMaksimal,
      createdAt
    );
    const id = Number(info.lastInsertRowid);
    selectedQuestions.forEach((q, idx) => {
      insertAnswer.run(id, q.id, idx + 1, JSON.stringify(createShuffledOptionOrder()));
    });
    return id;
  })();

  const detail = fetchSessionDetail(db, sessionId, userId);
  return detail.data
    ? { status: 201, data: detail.data }
    : { status: 500, error: 'Gagal membuat sesi SKD.' };
}

export function createSkbSession(
  db: Database.Database,
  userId: number,
  payload: Partial<CreateSkbSessionPayload>
): { status: number; data?: SessionDetailResponse; error?: string } {
  const sessionMode: SessionMode =
    payload.sessionMode === 'REAL' || payload.sessionMode === 'PRACTICE'
      ? payload.sessionMode
      : 'PRACTICE';

  let totalRequested = 100;
  let modeWaktu: 'TIMED' | 'UNTIMED' = 'TIMED';
  let paketSoal = 'REAL_BKN';

  if (sessionMode === 'PRACTICE') {
    const qty = payload.totalSoal as PracticeQuantityOption | undefined;
    if (qty !== 20 && qty !== 50 && qty !== 75) {
      return {
        status: 400,
        error: 'Pada Mode Latihan SKB, jumlah soal harus 20, 50, atau 75 soal.',
      };
    }
    if (payload.modeWaktu !== 'TIMED' && payload.modeWaktu !== 'UNTIMED') {
      return { status: 400, error: 'Mode waktu pada Mode Latihan tidak valid.' };
    }
    totalRequested = qty;
    modeWaktu = payload.modeWaktu;
    paketSoal = `PRACTICE_${qty}`;
  }

  const counts = allocateSkbCategoryCounts(sessionMode, totalRequested);
  const usageMap = getUsageMapForExamType(db, userId, 'SKB');
  const selectedQuestions: DbQuestionRow[] = [];

  for (const cat of SKB_CATEGORIES) {
    const needed = counts[cat];
    const pool = db
      .prepare("SELECT * FROM questions WHERE exam_type = 'SKB' AND kategori = ?")
      .all(cat) as DbQuestionRow[];

    if (pool.length < needed) {
      return {
        status: 500,
        error: `Bank soal SKB kategori ${cat} hanya memiliki ${pool.length} soal, kurang dari ${needed}.`,
      };
    }

    selectedQuestions.push(...selectPrioritizedQuestions(pool, needed, usageMap));
  }

  const nextRow = db
    .prepare(
      "SELECT COALESCE(MAX(session_number), 0) AS maxNum FROM sessions WHERE user_id = ? AND exam_type = 'SKB' AND session_mode = ?"
    )
    .get(userId, sessionMode) as { maxNum: number };
  const sessionNumber = nextRow.maxNum + 1;
  const namaSesi =
    sessionMode === 'REAL'
      ? `SKB Real Session ${sessionNumber}`
      : `SKB Practice Session ${sessionNumber}`;
  const totalSoal = selectedQuestions.length;
  const skorMaksimal = totalSoal * 5;
  const jumlahPerKategori = Math.round(totalSoal / 4);
  const batasWaktu =
    modeWaktu === 'TIMED'
      ? calculateTimeLimitSeconds('SKB', sessionMode, totalSoal)
      : null;
  const createdAt = new Date().toISOString();

  const insertSession = db.prepare(`
    INSERT INTO sessions (
      user_id, exam_type, session_mode, session_number, nama_sesi, mode_waktu, paket_soal,
      jumlah_per_kategori, total_soal, batas_waktu_detik, durasi_pengerjaan_detik,
      status, skor_maksimal, created_at
    ) VALUES (?, 'SKB', ?, ?, ?, ?, ?, ?, ?, ?, 0, 'IN_PROGRESS', ?, ?)
  `);

  const insertAnswer = db.prepare(`
    INSERT INTO session_answers (
      session_id, question_id, urutan, opsi_order, jawaban_user, status, poin, ditandai
    ) VALUES (?, ?, ?, ?, NULL, 'KOSONG', 0, 0)
  `);

  const sessionId = db.transaction(() => {
    const info = insertSession.run(
      userId,
      sessionMode,
      sessionNumber,
      namaSesi,
      modeWaktu,
      paketSoal,
      jumlahPerKategori,
      totalSoal,
      batasWaktu,
      skorMaksimal,
      createdAt
    );
    const id = Number(info.lastInsertRowid);
    selectedQuestions.forEach((q, idx) => {
      insertAnswer.run(id, q.id, idx + 1, JSON.stringify(createShuffledOptionOrder()));
    });
    return id;
  })();

  const detail = fetchSessionDetail(db, sessionId, userId);
  return detail.data
    ? { status: 201, data: detail.data }
    : { status: 500, error: 'Gagal membuat sesi SKB.' };
}

export function buildHintResponse(
  db: Database.Database,
  sessionId: number,
  answerId: number,
  currentUserId: number
): { status: number; data?: HintResponse; error?: string } {
  const sessionState = db
    .prepare('SELECT user_id, session_mode, status FROM sessions WHERE id = ?')
    .get(sessionId) as
    | { user_id: number; session_mode: SessionMode; status: 'IN_PROGRESS' | 'COMPLETED' }
    | undefined;

  if (!sessionState) {
    return { status: 404, error: 'Sesi tidak ditemukan.' };
  }

  if (sessionState.user_id !== currentUserId) {
    return {
      status: 403,
      error: 'Akses ditolak (403 Forbidden): Anda tidak memiliki izin mengakses sesi ujian pengguna lain.',
    };
  }

  // Strictly block real-time hint endpoint while Mode Real exam is still in progress
  if (sessionState.session_mode === 'REAL' && sessionState.status === 'IN_PROGRESS') {
    return {
      status: 403,
      error: 'Fitur bantuan (i) dinonaktifkan selama Mode Real Ujian berlangsung. Pembahasan dapat dilihat setelah selesai ujian.',
    };
  }

  const row = db
    .prepare(
      `
      SELECT
        sa.opsi_order,
        q.id AS question_id,
        q.exam_type,
        q.kategori,
        q.subtopik,
        q.opsi_a, q.opsi_b, q.opsi_c, q.opsi_d, q.opsi_e,
        q.jawaban_benar,
        q.bobot_tkp,
        q.pembahasan
      FROM session_answers sa
      JOIN questions q ON q.id = sa.question_id
      WHERE sa.session_id = ? AND sa.id = ?
    `
    )
    .get(sessionId, answerId) as
    | (DbQuestionRow & { opsi_order: string; question_id: number })
    | undefined;

  if (!row) {
    return { status: 404, error: 'Soal pada sesi ini tidak ditemukan.' };
  }

  const opsiOrder = JSON.parse(row.opsi_order) as OptionKey[];
  const correctLabel = mapOriginalKeyToDisplayLabel(opsiOrder, row.jawaban_benar) ?? 'A';
  const correctText = getOptionText(row, row.jawaban_benar);
  const weights =
    row.exam_type === 'SKD' && row.kategori === 'TKP' && row.bobot_tkp
      ? (JSON.parse(row.bobot_tkp) as TkpWeights)
      : null;

  return {
    status: 200,
    data: {
      questionId: row.question_id,
      exam_type: row.exam_type,
      kategori: row.kategori,
      subtopik: row.subtopik,
      correctLabel,
      correctText,
      pembahasan: row.pembahasan,
      ...(weights
        ? {
            weightsByLabel: OPTION_KEYS.map((label, idx) => {
              const orig = opsiOrder[idx];
              return {
                label,
                text: getOptionText(row, orig),
                poin: weights[orig],
              };
            }),
          }
        : {}),
    },
  };
}

export function saveAnswerRealtime(
  db: Database.Database,
  sessionId: number,
  currentUserId: number,
  body: {
    answerId?: number;
    selectedLabel?: OptionKey | null;
    ditandai?: boolean;
    elapsedSeconds?: number;
  }
): { status: number; error?: string } {
  const sessionRow = db
    .prepare('SELECT id, user_id, status, durasi_pengerjaan_detik FROM sessions WHERE id = ?')
    .get(sessionId) as
    | Pick<DbSessionRow, 'id' | 'user_id' | 'status' | 'durasi_pengerjaan_detik'>
    | undefined;

  if (!sessionRow) return { status: 404, error: 'Sesi tidak ditemukan.' };
  if (sessionRow.user_id !== currentUserId) {
    return {
      status: 403,
      error: 'Akses ditolak (403 Forbidden): Anda tidak memiliki izin mengubah sesi ujian pengguna lain.',
    };
  }
  if (sessionRow.status !== 'IN_PROGRESS') {
    return { status: 400, error: 'Sesi sudah diselesaikan dan tidak dapat diubah.' };
  }

  if (typeof body.answerId === 'number') {
    const ansRow = db
      .prepare('SELECT id, opsi_order, jawaban_user, ditandai FROM session_answers WHERE id = ? AND session_id = ?')
      .get(body.answerId, sessionId) as
      | { id: number; opsi_order: string; jawaban_user: OptionKey | null; ditandai: number }
      | undefined;

    if (!ansRow) return { status: 404, error: 'Jawaban soal tidak ditemukan.' };

    const opsiOrder = JSON.parse(ansRow.opsi_order) as OptionKey[];
    let nextOriginalAnswer = ansRow.jawaban_user;
    if (body.selectedLabel !== undefined) {
      nextOriginalAnswer = mapDisplayLabelToOriginal(opsiOrder, body.selectedLabel);
    }
    const nextFlag = body.ditandai !== undefined ? (body.ditandai ? 1 : 0) : ansRow.ditandai;

    db.prepare(
      `
      UPDATE session_answers
      SET jawaban_user = ?, ditandai = ?, updated_at = datetime('now')
      WHERE id = ? AND session_id = ?
    `
    ).run(nextOriginalAnswer, nextFlag, body.answerId, sessionId);
  }

  if (
    typeof body.elapsedSeconds === 'number' &&
    Number.isFinite(body.elapsedSeconds) &&
    body.elapsedSeconds >= 0
  ) {
    const safeElapsed = Math.max(sessionRow.durasi_pengerjaan_detik, Math.floor(body.elapsedSeconds));
    db.prepare('UPDATE sessions SET durasi_pengerjaan_detik = ? WHERE id = ?').run(
      safeElapsed,
      sessionId
    );
  }

  return { status: 200 };
}

export function submitExamSession(
  db: Database.Database,
  sessionId: number,
  currentUserId: number,
  elapsedSeconds?: number
): { status: number; data?: SessionDetailResponse; error?: string } {
  const sessionRow = db
    .prepare('SELECT * FROM sessions WHERE id = ?')
    .get(sessionId) as DbSessionRow | undefined;

  if (!sessionRow) return { status: 404, error: 'Sesi tidak ditemukan.' };

  if (sessionRow.user_id !== currentUserId) {
    return {
      status: 403,
      error: 'Akses ditolak (403 Forbidden): Anda tidak memiliki izin menyelesaikan sesi ujian pengguna lain.',
    };
  }

  if (sessionRow.status === 'COMPLETED') {
    const existing = fetchSessionDetail(db, sessionId, currentUserId);
    return existing.data
      ? { status: 200, data: existing.data }
      : { status: existing.status, error: existing.error };
  }

  const answerRows = db
    .prepare(
      `
      SELECT
        sa.id AS answer_id,
        sa.jawaban_user,
        q.exam_type,
        q.kategori,
        q.subtopik,
        q.jawaban_benar,
        q.bobot_tkp
      FROM session_answers sa
      JOIN questions q ON q.id = sa.question_id
      WHERE sa.session_id = ?
    `
    )
    .all(sessionId) as Array<{
    answer_id: number;
    jawaban_user: OptionKey | null;
    exam_type: ExamType;
    kategori: QuestionCategory;
    subtopik: string;
    jawaban_benar: OptionKey;
    bobot_tkp: string | null;
  }>;

  const evaluatedItems = answerRows.map((item) => {
    const weights =
      item.exam_type === 'SKD' && item.kategori === 'TKP' && item.bobot_tkp
        ? (JSON.parse(item.bobot_tkp) as TkpWeights)
        : null;
    const result = evaluateAnswer(
      {
        exam_type: sessionRow.exam_type,
        kategori: item.kategori,
        jawaban_benar: item.jawaban_benar,
        bobot_tkp: weights,
      },
      item.jawaban_user
    );
    return {
      answerId: item.answer_id,
      kategori: item.kategori,
      subtopik: item.subtopik,
      status: result.status,
      poin: result.poin,
    };
  });

  const sessionMode: SessionMode = sessionRow.session_mode === 'REAL' ? 'REAL' : 'PRACTICE';
  const summary =
    sessionRow.exam_type === 'SKD'
      ? computeSkdScoreSummary(evaluatedItems, sessionMode)
      : computeSkbScoreSummary(evaluatedItems);

  const completedAt = new Date().toISOString();
  const rawDuration =
    typeof elapsedSeconds === 'number' && Number.isFinite(elapsedSeconds)
      ? Math.max(sessionRow.durasi_pengerjaan_detik, Math.floor(elapsedSeconds))
      : sessionRow.durasi_pengerjaan_detik;

  const finalDuration =
    sessionRow.batas_waktu_detik !== null
      ? Math.min(sessionRow.batas_waktu_detik, Math.max(1, rawDuration))
      : Math.max(1, rawDuration);

  const updateAnswerStmt = db.prepare(
    "UPDATE session_answers SET status = ?, poin = ?, updated_at = datetime('now') WHERE id = ?"
  );

  const updateSessionStmt = db.prepare(`
    UPDATE sessions SET
      status = 'COMPLETED',
      skor_twk = ?,
      skor_tiu = ?,
      skor_tkp = ?,
      skor_total = ?,
      skor_maksimal = ?,
      persentase_total = ?,
      lulus_passing_grade = ?,
      breakdown_skor = ?,
      topik_rekomendasi = ?,
      durasi_pengerjaan_detik = ?,
      completed_at = ?
    WHERE id = ?
  `);

  db.transaction(() => {
    for (const ev of evaluatedItems) {
      updateAnswerStmt.run(ev.status, ev.poin, ev.answerId);
    }
    updateSessionStmt.run(
      summary.skor_twk,
      summary.skor_tiu,
      summary.skor_tkp,
      summary.skor_total,
      summary.skor_maksimal,
      summary.persentase_total,
      summary.lulus_passing_grade ? 1 : 0,
      JSON.stringify(summary.breakdown_skor),
      JSON.stringify(summary.topik_rekomendasi),
      finalDuration,
      completedAt,
      sessionId
    );
  })();

  const detail = fetchSessionDetail(db, sessionId, currentUserId);
  return detail.data
    ? { status: 200, data: detail.data }
    : { status: 500, error: 'Gagal menyimpan hasil.' };
}

export function deleteUserSession(
  db: Database.Database,
  sessionId: number,
  currentUserId: number
): { status: number; error?: string } {
  const sessionRow = db
    .prepare('SELECT id, user_id FROM sessions WHERE id = ?')
    .get(sessionId) as { id: number; user_id: number } | undefined;

  if (!sessionRow) {
    return { status: 404, error: 'Sesi tidak ditemukan.' };
  }

  if (sessionRow.user_id !== currentUserId) {
    return {
      status: 403,
      error: 'Akses ditolak (403 Forbidden): Anda tidak memiliki izin menghapus sesi ujian pengguna lain.',
    };
  }

  db.prepare('DELETE FROM sessions WHERE id = ? AND user_id = ?').run(sessionId, currentUserId);
  return { status: 200 };
}
