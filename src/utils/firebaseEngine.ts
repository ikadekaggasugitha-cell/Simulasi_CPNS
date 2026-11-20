import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type Timestamp,
} from 'firebase/firestore';
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
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import type {
  AnswerStatus,
  AuthResponse,
  AuthUser,
  CategoryScoreBreakdown,
  CreateSkbSessionPayload,
  CreateSkdSessionPayload,
  DisplayedOption,
  ExamQuestionItem,
  ExamType,
  HintResponse,
  LoginPayload,
  OptionKey,
  PracticeQuantityOption,
  QuestionRecord,
  RegisterPayload,
  SessionDetailResponse,
  SessionMode,
  SessionStatus,
  SessionSummary,
  TimeMode,
} from '../shared/types';
import { ApiError } from './errors';

interface FirestoreSessionDoc {
  id: number;
  userId: string;
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
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface FirestoreAnswerDoc {
  id: number;
  sessionId: string;
  userId: string;
  question_id: number;
  urutan: number;
  opsi_order: OptionKey[];
  jawaban_user: OptionKey | null;
  status: AnswerStatus;
  poin: number;
  ditandai: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// In-memory cache of answer opsi_order & session duration to avoid redundant Firestore reads during exams
const answerOrderCache = new Map<string, OptionKey[]>();
const sessionDurationCache = new Map<number, number>();

let catalogPromise: Promise<{
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
      return { questions, byId };
    });
  }
  return catalogPromise;
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

function clampInt(val: number, min: number, max: number): number {
  const n = Math.floor(Number.isFinite(val) ? val : min);
  return Math.min(max, Math.max(min, n));
}

function sanitizeDisplayName(rawName: string | null | undefined, email: string): string {
  const candidate = (rawName ?? '').trim();
  if (candidate.length >= 2) {
    return candidate.slice(0, 120);
  }
  const emailPrefix = email.split('@')[0]?.trim() || 'Peserta CAT';
  const padded = emailPrefix.length >= 2 ? emailPrefix : `${emailPrefix} Peserta`;
  return padded.slice(0, 120);
}

export function mapFirebaseAuthError(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code)
      : '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email sudah terdaftar. Silakan masuk menggunakan akun tersebut.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email atau kata sandi salah. Jika Anda mendaftar dengan Google, silakan gunakan tombol Masuk dengan Google.';
    case 'auth/weak-password':
      return 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter.';
    case 'auth/invalid-email':
      return 'Format alamat email tidak valid.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Jendela masuk Google ditutup sebelum selesai. Silakan coba lagi.';
    case 'auth/popup-blocked':
      return 'Pop-up masuk Google diblokir browser. Izinkan pop-up untuk situs ini lalu coba lagi.';
    case 'auth/unauthorized-domain':
      return 'Domain situs ini belum terdaftar di Authorized Domains Firebase Console. Tambahkan domain situs Anda di Firebase Console → Authentication → Settings → Authorized domains.';
    case 'auth/operation-not-allowed':
      return 'Metode login Email/Password belum diaktifkan di Firebase Console. Gunakan tombol "Masuk dengan Google" di atas, atau aktifkan Email/Password di Firebase Console → Authentication → Sign-in method.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan. Silakan tunggu beberapa saat lalu coba lagi.';
    case 'auth/network-request-failed':
      return 'Koneksi jaringan gagal. Periksa koneksi internet Anda lalu coba lagi.';
    default:
      return error instanceof Error ? error.message : 'Gagal memproses autentikasi akun.';
  }
}

export function firebaseUserToAuthUser(fbUser: FirebaseUser): AuthUser {
  const email = (fbUser.email || '').trim().toLowerCase();
  const name = sanitizeDisplayName(fbUser.displayName, email || 'peserta@cat.id');
  const createdAt = fbUser.metadata.creationTime
    ? new Date(fbUser.metadata.creationTime).toISOString()
    : new Date().toISOString();

  return {
    id: fbUser.uid,
    name,
    email,
    created_at: createdAt,
    emailVerified: fbUser.emailVerified,
  };
}

function requireVerifiedFirebaseUser(): FirebaseUser {
  const user = auth.currentUser;
  if (!user) {
    throw new ApiError(401, 'Autentikasi diperlukan. Silakan login terlebih dahulu.');
  }
  if (!user.emailVerified) {
    throw new ApiError(
      403,
      'Email akun Anda belum terverifikasi. Silakan buka tautan verifikasi di kotak masuk email Anda terlebih dahulu.'
    );
  }
  return user;
}

const inFlightProfileSync = new Map<string, Promise<AuthUser>>();

async function executeEnsureFirebaseUserProfile(
  fbUser: FirebaseUser,
  overrideName?: string
): Promise<AuthUser> {
  const baseUser = firebaseUserToAuthUser(fbUser);
  const finalName = overrideName
    ? sanitizeDisplayName(overrideName, baseUser.email)
    : baseUser.name;
  const safeEmail = baseUser.email.slice(0, 200);

  // Firestore rules strictly require email_verified == true and valid email format for profile writes
  if (!fbUser.emailVerified || !EMAIL_REGEX.test(safeEmail) || safeEmail.length < 5) {
    return { ...baseUser, name: finalName, email: safeEmail };
  }

  // Ensure the client auth token (with email_verified claim) is initialized before first Firestore write
  await fbUser.getIdToken();

  const profilePath = `users/${fbUser.uid}`;
  const profileRef = doc(db, 'users', fbUser.uid);

  try {
    const resolvedName = await runTransaction(db, async (tx) => {
      const snap = await tx.get(profileRef);
      if (!snap.exists()) {
        tx.set(profileRef, {
          uid: fbUser.uid,
          name: finalName,
          email: safeEmail,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return finalName;
      }

      const data = snap.data() as { name?: string; email?: string };
      const storedName =
        typeof data.name === 'string' && data.name.trim().length >= 2
          ? data.name.trim().slice(0, 120)
          : finalName;
      const nextName = overrideName ? finalName : storedName;

      if (nextName !== storedName || data.email !== safeEmail) {
        tx.update(profileRef, {
          name: nextName,
          email: safeEmail,
          updatedAt: serverTimestamp(),
        });
      }

      return nextName;
    });

    return { ...baseUser, name: resolvedName, email: safeEmail };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, profilePath);
  }
}

export function ensureFirebaseUserProfile(
  fbUser: FirebaseUser,
  overrideName?: string
): Promise<AuthUser> {
  const existing = inFlightProfileSync.get(fbUser.uid);
  if (existing && !overrideName) {
    return existing;
  }

  const run = (existing ? existing.catch(() => null) : Promise.resolve(null))
    .then(() => executeEnsureFirebaseUserProfile(fbUser, overrideName))
    .finally(() => {
      if (inFlightProfileSync.get(fbUser.uid) === run) {
        inFlightProfileSync.delete(fbUser.uid);
      }
    });

  inFlightProfileSync.set(fbUser.uid, run);
  return run;
}

export function subscribeFirebaseAuth(
  callback: (user: AuthUser | null) => void
): () => void {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      answerOrderCache.clear();
      sessionDurationCache.clear();
      callback(null);
      return;
    }
    try {
      const authUser = await ensureFirebaseUserProfile(fbUser);
      callback(authUser);
    } catch {
      callback(firebaseUserToAuthUser(fbUser));
    }
  });
}

export async function firebaseLoginWithGoogle(): Promise<AuthResponse> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const user = await ensureFirebaseUserProfile(cred.user);
    const token = await cred.user.getIdToken();
    return { user, token };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, mapFirebaseAuthError(error));
  }
}

export async function firebaseRegisterWithEmail(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';

  if (name.length < 2) {
    throw new ApiError(400, 'Nama lengkap minimal 2 karakter.');
  }
  if (!EMAIL_REGEX.test(email)) {
    throw new ApiError(400, 'Format alamat email tidak valid.');
  }
  if (password.length < 6) {
    throw new ApiError(400, 'Kata sandi minimal 6 karakter.');
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name.slice(0, 120) });
    try {
      await sendEmailVerification(cred.user);
    } catch {
      // Verification email send failure can be retried from the verification gate UI
    }
    const user = await ensureFirebaseUserProfile(cred.user, name);
    const token = await cred.user.getIdToken();
    return { user, token };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, mapFirebaseAuthError(error));
  }
}

export async function firebaseLoginWithEmail(
  payload: LoginPayload
): Promise<AuthResponse> {
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';

  if (!EMAIL_REGEX.test(email) || password.length === 0) {
    throw new ApiError(400, 'Email dan kata sandi wajib diisi.');
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user = await ensureFirebaseUserProfile(cred.user);
    const token = await cred.user.getIdToken();
    return { user, token };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, mapFirebaseAuthError(error));
  }
}

export async function firebaseResendVerification(): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new ApiError(401, 'Tidak ada sesi pengguna yang aktif.');
  }
  try {
    await sendEmailVerification(user);
  } catch (error) {
    throw new ApiError(400, mapFirebaseAuthError(error));
  }
}

export async function firebaseReloadCurrentUser(): Promise<AuthUser | null> {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    await reload(user);
    await user.getIdToken(true);
    return await ensureFirebaseUserProfile(user);
  } catch (error) {
    throw new ApiError(400, mapFirebaseAuthError(error));
  }
}

export async function firebaseLogout(): Promise<{ ok: boolean }> {
  answerOrderCache.clear();
  sessionDurationCache.clear();
  await signOut(auth);
  return { ok: true };
}

export async function firebaseFetchCurrentUser(): Promise<{ user: AuthUser }> {
  const user = auth.currentUser;
  if (!user) {
    throw new ApiError(401, 'Autentikasi diperlukan.');
  }
  return { user: await ensureFirebaseUserProfile(user) };
}

function toSessionSummary(row: FirestoreSessionDoc): SessionSummary {
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
    persentase_total: row.persentase_total,
    lulus_passing_grade: row.lulus_passing_grade,
    breakdown_skor: Array.isArray(row.breakdown_skor) ? row.breakdown_skor : [],
    topik_rekomendasi: Array.isArray(row.topik_rekomendasi) ? row.topik_rekomendasi : [],
    created_at: row.created_at,
    completed_at: row.completed_at,
    passing_thresholds: skdThresholds,
  };
}

function cacheAnswersMeta(sessionId: number, answers: FirestoreAnswerDoc[]): void {
  for (const ans of answers) {
    answerOrderCache.set(`${sessionId}:${ans.id}`, ans.opsi_order);
  }
}

function buildExamItems(
  answers: FirestoreAnswerDoc[],
  byId: Map<number, QuestionRecord>,
  includeSolutions: boolean
): ExamQuestionItem[] {
  return answers
    .slice()
    .sort((a, b) => a.urutan - b.urutan)
    .map((ans) => {
      const q = byId.get(ans.question_id);
      if (!q) {
        throw new Error(`Soal ID ${ans.question_id} tidak ditemukan di katalog soal.`);
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

async function fetchUserSessionDocs(uid: string): Promise<FirestoreSessionDoc[]> {
  const path = 'sessions';
  try {
    const q = query(collection(db, 'sessions'), where('userId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => d.data() as FirestoreSessionDoc)
      .sort((a, b) => b.id - a.id);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

async function fetchSessionAnswerDocs(
  uid: string,
  sessionId: number
): Promise<FirestoreAnswerDoc[]> {
  const sessionIdStr = String(sessionId);
  const path = `sessions/${sessionIdStr}/answers`;
  try {
    const q = query(
      collection(db, 'sessions', sessionIdStr, 'answers'),
      where('userId', '==', uid)
    );
    const snap = await getDocs(q);
    const docs = snap.docs
      .map((d) => d.data() as FirestoreAnswerDoc)
      .sort((a, b) => a.urutan - b.urutan);
    cacheAnswersMeta(sessionId, docs);
    return docs;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

async function buildUsageMapForRecentSessions(
  uid: string,
  userSessions: FirestoreSessionDoc[],
  examType: ExamType
): Promise<Map<number, QuestionUsageStat>> {
  const recent = userSessions
    .filter((s) => s.exam_type === examType)
    .slice(0, 5);

  const map = new Map<number, QuestionUsageStat>();
  const answerLists = await Promise.all(
    recent.map((s) => fetchSessionAnswerDocs(uid, s.id).catch(() => []))
  );

  for (let i = 0; i < recent.length; i++) {
    const sessId = recent[i].id;
    for (const ans of answerLists[i]) {
      const prev = map.get(ans.question_id);
      if (!prev) {
        map.set(ans.question_id, { usageCount: 1, lastSessionId: sessId });
      } else {
        prev.usageCount += 1;
        if (sessId > prev.lastSessionId) {
          prev.lastSessionId = sessId;
        }
      }
    }
  }
  return map;
}

export async function firebaseFetchSessions(
  examType?: ExamType
): Promise<{ sessions: SessionSummary[] }> {
  const user = requireVerifiedFirebaseUser();
  const docs = await fetchUserSessionDocs(user.uid);
  const filtered = examType ? docs.filter((d) => d.exam_type === examType) : docs;
  return { sessions: filtered.map(toSessionSummary) };
}

async function createSessionInFirestore(
  fbUser: FirebaseUser,
  examType: ExamType,
  sessionMode: SessionMode,
  modeWaktu: TimeMode,
  paketSoal: string,
  selectedQuestions: QuestionRecord[],
  existingSessions: FirestoreSessionDoc[]
): Promise<SessionDetailResponse> {
  await ensureFirebaseUserProfile(fbUser);
  const { byId } = await loadCatalog();

  const maxNum = existingSessions
    .filter((s) => s.exam_type === examType && s.session_mode === sessionMode)
    .reduce((max, s) => Math.max(max, s.session_number), 0);
  const sessionNumber = clampInt(maxNum + 1, 1, 100000);
  const namaSesi =
    sessionMode === 'REAL'
      ? `${examType} Real Session ${sessionNumber}`
      : `${examType} Practice Session ${sessionNumber}`;

  const totalSoal = clampInt(selectedQuestions.length, 1, 200);
  const divisor = examType === 'SKD' ? 3 : 4;
  const numericSessionId = Date.now();
  const sessionIdStr = String(numericSessionId);
  const nowIso = new Date().toISOString();

  const batasWaktu =
    modeWaktu === 'TIMED'
      ? clampInt(calculateTimeLimitSeconds(examType, sessionMode, totalSoal), 60, 14400)
      : null;

  const sessionPayload: FirestoreSessionDoc = {
    id: numericSessionId,
    userId: fbUser.uid,
    exam_type: examType,
    session_mode: sessionMode,
    session_number: sessionNumber,
    nama_sesi: namaSesi.slice(0, 120),
    mode_waktu: modeWaktu,
    paket_soal: paketSoal.slice(0, 64),
    jumlah_per_kategori: clampInt(Math.round(totalSoal / divisor), 1, 200),
    total_soal: totalSoal,
    batas_waktu_detik: batasWaktu,
    durasi_pengerjaan_detik: 0,
    status: 'IN_PROGRESS',
    skor_twk: 0,
    skor_tiu: 0,
    skor_tkp: 0,
    skor_total: 0,
    skor_maksimal: clampInt(totalSoal * 5, 0, 2000),
    persentase_total: 0,
    lulus_passing_grade: false,
    breakdown_skor: [],
    topik_rekomendasi: [],
    created_at: nowIso,
    completed_at: null,
  };

  const answerDocs: FirestoreAnswerDoc[] = selectedQuestions.map((q, idx) => ({
    id: idx + 1,
    sessionId: sessionIdStr,
    userId: fbUser.uid,
    question_id: q.id,
    urutan: idx + 1,
    opsi_order: createShuffledOptionOrder(),
    jawaban_user: null,
    status: 'KOSONG',
    poin: 0,
    ditandai: false,
  }));

  const sessionRef = doc(db, 'sessions', sessionIdStr);
  const batch = writeBatch(db);
  batch.set(sessionRef, {
    ...sessionPayload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  for (const ans of answerDocs) {
    const ansRef = doc(db, 'sessions', sessionIdStr, 'answers', String(ans.id));
    batch.set(ansRef, {
      ...ans,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `sessions/${sessionIdStr}`);
  }

  sessionDurationCache.set(numericSessionId, 0);
  cacheAnswersMeta(numericSessionId, answerDocs);

  return {
    session: toSessionSummary(sessionPayload),
    items: buildExamItems(answerDocs, byId, false),
  };
}

export async function firebaseCreateSkdSession(
  payload: CreateSkdSessionPayload
): Promise<SessionDetailResponse> {
  const user = requireVerifiedFirebaseUser();
  const { questions } = await loadCatalog();

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
      throw new ApiError(400, 'Pada Mode Latihan SKD, jumlah soal harus 20, 50, atau 75 soal.');
    }
    if (payload.modeWaktu !== 'TIMED' && payload.modeWaktu !== 'UNTIMED') {
      throw new ApiError(400, 'Mode waktu pada Mode Latihan tidak valid.');
    }
    totalRequested = qty;
    modeWaktu = payload.modeWaktu;
    paketSoal = `PRACTICE_${qty}`;
  }

  const existingSessions = await fetchUserSessionDocs(user.uid);
  const usageMap = await buildUsageMapForRecentSessions(user.uid, existingSessions, 'SKD');
  const counts = allocateSkdCategoryCounts(sessionMode, totalRequested);
  const selectedQuestions: QuestionRecord[] = [];

  for (const cat of SKD_CATEGORIES) {
    const needed = counts[cat];
    const pool = questions.filter((q) => q.exam_type === 'SKD' && q.kategori === cat);
    selectedQuestions.push(...selectPrioritizedQuestions(pool, needed, usageMap));
  }

  return createSessionInFirestore(
    user,
    'SKD',
    sessionMode,
    modeWaktu,
    paketSoal,
    selectedQuestions,
    existingSessions
  );
}

export async function firebaseCreateSkbSession(
  payload: CreateSkbSessionPayload
): Promise<SessionDetailResponse> {
  const user = requireVerifiedFirebaseUser();
  const { questions } = await loadCatalog();

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
      throw new ApiError(400, 'Pada Mode Latihan SKB, jumlah soal harus 20, 50, atau 75 soal.');
    }
    if (payload.modeWaktu !== 'TIMED' && payload.modeWaktu !== 'UNTIMED') {
      throw new ApiError(400, 'Mode waktu pada Mode Latihan tidak valid.');
    }
    totalRequested = qty;
    modeWaktu = payload.modeWaktu;
    paketSoal = `PRACTICE_${qty}`;
  }

  const existingSessions = await fetchUserSessionDocs(user.uid);
  const usageMap = await buildUsageMapForRecentSessions(user.uid, existingSessions, 'SKB');
  const counts = allocateSkbCategoryCounts(sessionMode, totalRequested);
  const selectedQuestions: QuestionRecord[] = [];

  for (const cat of SKB_CATEGORIES) {
    const needed = counts[cat];
    const pool = questions.filter((q) => q.exam_type === 'SKB' && q.kategori === cat);
    selectedQuestions.push(...selectPrioritizedQuestions(pool, needed, usageMap));
  }

  return createSessionInFirestore(
    user,
    'SKB',
    sessionMode,
    modeWaktu,
    paketSoal,
    selectedQuestions,
    existingSessions
  );
}

export async function firebaseFetchSessionDetail(
  sessionId: number
): Promise<SessionDetailResponse> {
  const user = requireVerifiedFirebaseUser();
  const { byId } = await loadCatalog();
  const sessionIdStr = String(sessionId);
  const path = `sessions/${sessionIdStr}`;

  let sessionDoc: FirestoreSessionDoc | null = null;
  try {
    const snap = await getDoc(doc(db, 'sessions', sessionIdStr));
    if (snap.exists()) {
      sessionDoc = snap.data() as FirestoreSessionDoc;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  if (!sessionDoc) {
    throw new ApiError(404, 'Sesi ujian tidak ditemukan.');
  }
  if (sessionDoc.userId !== user.uid) {
    throw new ApiError(
      403,
      'Akses ditolak (403 Forbidden): Anda tidak memiliki izin melihat sesi ujian pengguna lain.'
    );
  }

  sessionDurationCache.set(sessionId, sessionDoc.durasi_pengerjaan_detik);
  const answers = await fetchSessionAnswerDocs(user.uid, sessionId);

  return {
    session: toSessionSummary(sessionDoc),
    items: buildExamItems(answers, byId, sessionDoc.status === 'COMPLETED'),
  };
}

export async function firebaseFetchAnswerHint(
  sessionId: number,
  answerId: number
): Promise<HintResponse> {
  const user = requireVerifiedFirebaseUser();
  const { byId } = await loadCatalog();
  const sessionIdStr = String(sessionId);

  let sessionDoc: FirestoreSessionDoc | null = null;
  try {
    const snap = await getDoc(doc(db, 'sessions', sessionIdStr));
    if (snap.exists()) {
      sessionDoc = snap.data() as FirestoreSessionDoc;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `sessions/${sessionIdStr}`);
  }

  if (!sessionDoc) {
    throw new ApiError(404, 'Sesi tidak ditemukan.');
  }
  if (sessionDoc.userId !== user.uid) {
    throw new ApiError(
      403,
      'Akses ditolak (403 Forbidden): Anda tidak memiliki izin mengakses sesi ujian pengguna lain.'
    );
  }
  if (sessionDoc.session_mode === 'REAL' && sessionDoc.status === 'IN_PROGRESS') {
    throw new ApiError(
      403,
      'Fitur bantuan (i) dinonaktifkan selama Mode Real Ujian berlangsung. Pembahasan dapat dilihat setelah selesai ujian.'
    );
  }

  const answerPath = `sessions/${sessionIdStr}/answers/${answerId}`;
  let ansDoc: FirestoreAnswerDoc | null = null;
  try {
    const snap = await getDoc(doc(db, 'sessions', sessionIdStr, 'answers', String(answerId)));
    if (snap.exists()) {
      ansDoc = snap.data() as FirestoreAnswerDoc;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, answerPath);
  }

  if (!ansDoc) {
    throw new ApiError(404, 'Soal pada sesi ini tidak ditemukan.');
  }

  const q = byId.get(ansDoc.question_id);
  if (!q) {
    throw new ApiError(404, 'Soal tidak ditemukan di bank soal.');
  }

  const correctLabel = mapOriginalKeyToDisplayLabel(ansDoc.opsi_order, q.jawaban_benar) ?? 'A';
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
            const orig = ansDoc!.opsi_order[idx];
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

export async function firebaseSaveSessionAnswer(
  sessionId: number,
  payload: {
    answerId?: number;
    selectedLabel?: OptionKey | null;
    ditandai?: boolean;
    elapsedSeconds?: number;
  }
): Promise<{ ok: boolean }> {
  requireVerifiedFirebaseUser();
  const sessionIdStr = String(sessionId);

  if (typeof payload.answerId === 'number') {
    const answerPath = `sessions/${sessionIdStr}/answers/${payload.answerId}`;
    const ansRef = doc(db, 'sessions', sessionIdStr, 'answers', String(payload.answerId));
    const updateFields: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (payload.selectedLabel !== undefined) {
      let opsiOrder = answerOrderCache.get(`${sessionId}:${payload.answerId}`);
      if (!opsiOrder) {
        try {
          const snap = await getDoc(ansRef);
          if (snap.exists()) {
            const d = snap.data() as FirestoreAnswerDoc;
            opsiOrder = d.opsi_order;
            answerOrderCache.set(`${sessionId}:${payload.answerId}`, opsiOrder);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, answerPath);
        }
      }
      if (opsiOrder) {
        updateFields.jawaban_user = mapDisplayLabelToOriginal(
          opsiOrder,
          payload.selectedLabel
        );
      }
    }

    if (payload.ditandai !== undefined) {
      updateFields.ditandai = Boolean(payload.ditandai);
    }

    try {
      await updateDoc(ansRef, updateFields);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, answerPath);
    }
  }

  if (
    typeof payload.elapsedSeconds === 'number' &&
    Number.isFinite(payload.elapsedSeconds) &&
    payload.elapsedSeconds >= 0
  ) {
    const prevDuration = sessionDurationCache.get(sessionId) ?? 0;
    const nextDuration = clampInt(Math.max(prevDuration, payload.elapsedSeconds), 0, 86400);
    if (nextDuration > prevDuration) {
      sessionDurationCache.set(sessionId, nextDuration);
      const sessionPath = `sessions/${sessionIdStr}`;
      try {
        await updateDoc(doc(db, 'sessions', sessionIdStr), {
          durasi_pengerjaan_detik: nextDuration,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, sessionPath);
      }
    }
  }

  return { ok: true };
}

export async function firebaseSubmitSession(
  sessionId: number,
  elapsedSeconds?: number
): Promise<SessionDetailResponse> {
  const user = requireVerifiedFirebaseUser();
  const { byId } = await loadCatalog();
  const sessionIdStr = String(sessionId);
  const sessionPath = `sessions/${sessionIdStr}`;
  const sessionRef = doc(db, 'sessions', sessionIdStr);

  let sessionDoc: FirestoreSessionDoc | null = null;
  try {
    const snap = await getDoc(sessionRef);
    if (snap.exists()) {
      sessionDoc = snap.data() as FirestoreSessionDoc;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, sessionPath);
  }

  if (!sessionDoc) {
    throw new ApiError(404, 'Sesi tidak ditemukan.');
  }
  if (sessionDoc.userId !== user.uid) {
    throw new ApiError(
      403,
      'Akses ditolak (403 Forbidden): Anda tidak memiliki izin menyelesaikan sesi ujian pengguna lain.'
    );
  }

  if (sessionDoc.status === 'COMPLETED') {
    return firebaseFetchSessionDetail(sessionId);
  }

  const sessionAnswers = await fetchSessionAnswerDocs(user.uid, sessionId);

  const evaluated = sessionAnswers.map((ans) => {
    const q = byId.get(ans.question_id)!;
    const result = evaluateAnswer(
      {
        exam_type: sessionDoc!.exam_type,
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
    sessionDoc.exam_type === 'SKD'
      ? computeSkdScoreSummary(evaluated, sessionDoc.session_mode)
      : computeSkbScoreSummary(evaluated);

  const rawDuration =
    typeof elapsedSeconds === 'number' && Number.isFinite(elapsedSeconds)
      ? Math.max(sessionDoc.durasi_pengerjaan_detik, Math.floor(elapsedSeconds))
      : sessionDoc.durasi_pengerjaan_detik;

  const boundedDuration =
    sessionDoc.batas_waktu_detik !== null
      ? Math.min(sessionDoc.batas_waktu_detik, Math.max(1, rawDuration))
      : Math.max(1, rawDuration);
  const finalDuration = clampInt(boundedDuration, 0, 86400);
  const completedAt = new Date().toISOString();

  const sanitizedTopics = summary.topik_rekomendasi
    .slice(0, 10)
    .map((t) => String(t).slice(0, 120));
  const sanitizedBreakdown = summary.breakdown_skor.slice(0, 7);

  const batch = writeBatch(db);
  batch.update(sessionRef, {
    status: 'COMPLETED',
    durasi_pengerjaan_detik: finalDuration,
    skor_twk: clampInt(summary.skor_twk, 0, 1000),
    skor_tiu: clampInt(summary.skor_tiu, 0, 1000),
    skor_tkp: clampInt(summary.skor_tkp, 0, 1000),
    skor_total: clampInt(summary.skor_total, 0, 2000),
    skor_maksimal: clampInt(summary.skor_maksimal, 0, 2000),
    persentase_total: Math.min(100, Math.max(0, summary.persentase_total)),
    lulus_passing_grade: Boolean(summary.lulus_passing_grade),
    breakdown_skor: sanitizedBreakdown,
    topik_rekomendasi: sanitizedTopics,
    completed_at: completedAt,
    updatedAt: serverTimestamp(),
  });

  const evalById = new Map(evaluated.map((e) => [e.answerId, e]));
  const updatedAnswers: FirestoreAnswerDoc[] = sessionAnswers.map((ans) => {
    const ev = evalById.get(ans.id);
    const nextStatus = ev ? ev.status : ans.status;
    const nextPoin = clampInt(ev ? ev.poin : ans.poin, 0, 5);
    const ansRef = doc(db, 'sessions', sessionIdStr, 'answers', String(ans.id));
    batch.update(ansRef, {
      status: nextStatus,
      poin: nextPoin,
      updatedAt: serverTimestamp(),
    });
    return { ...ans, status: nextStatus, poin: nextPoin };
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, sessionPath);
  }

  const updatedSession: FirestoreSessionDoc = {
    ...sessionDoc,
    status: 'COMPLETED',
    durasi_pengerjaan_detik: finalDuration,
    skor_twk: summary.skor_twk,
    skor_tiu: summary.skor_tiu,
    skor_tkp: summary.skor_tkp,
    skor_total: summary.skor_total,
    skor_maksimal: summary.skor_maksimal,
    persentase_total: summary.persentase_total,
    lulus_passing_grade: summary.lulus_passing_grade,
    breakdown_skor: sanitizedBreakdown,
    topik_rekomendasi: sanitizedTopics,
    completed_at: completedAt,
  };

  return {
    session: toSessionSummary(updatedSession),
    items: buildExamItems(updatedAnswers, byId, true),
  };
}

export async function firebaseDeleteSession(sessionId: number): Promise<{ ok: boolean }> {
  const user = requireVerifiedFirebaseUser();
  const sessionIdStr = String(sessionId);
  const sessionPath = `sessions/${sessionIdStr}`;
  const sessionRef = doc(db, 'sessions', sessionIdStr);

  const answers = await fetchSessionAnswerDocs(user.uid, sessionId);
  const batch = writeBatch(db);
  for (const ans of answers) {
    batch.delete(doc(db, 'sessions', sessionIdStr, 'answers', String(ans.id)));
  }
  batch.delete(sessionRef);

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, sessionPath);
  }

  sessionDurationCache.delete(sessionId);
  return { ok: true };
}

export async function firebaseFetchQuestionsBank(params?: {
  examType?: ExamType;
  kategori?: string;
  q?: string;
}): Promise<{ total: number; questions: QuestionRecord[] }> {
  requireVerifiedFirebaseUser();
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

