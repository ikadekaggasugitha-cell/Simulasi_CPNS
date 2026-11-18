import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getDb } from './server/db';
import {
  clearAuthCookie,
  createRequireAuth,
  setAuthCookie,
  type AuthenticatedRequest,
} from './server/auth';
import { loginUser, registerUser } from './server/controllers/auth';
import {
  buildHintResponse,
  createSkbSession,
  createSkdSession,
  deleteUserSession,
  fetchSessionDetail,
  fetchUserSessions,
  saveAnswerRealtime,
  submitExamSession,
  type DbQuestionRow,
} from './server/controllers/sessions';
import type {
  CategoryMeta,
  CreateSkbSessionPayload,
  CreateSkdSessionPayload,
  LoginPayload,
  OptionKey,
  QuestionCategory,
  RegisterPayload,
  TkpWeights,
} from './src/shared/types';

async function startServer() {
  const db = getDb();
  const requireAuth = createRequireAuth(db);
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health & Question Bank Stats (Public/Global metadata only — zero user sessions)
  app.get('/api/health', (_req, res) => {
    const counts = db
      .prepare('SELECT exam_type, kategori, COUNT(*) as count FROM questions GROUP BY exam_type, kategori')
      .all() as Array<{ exam_type: 'SKD' | 'SKB'; kategori: QuestionCategory; count: number }>;

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

    for (const c of counts) {
      byCategory[c.kategori] = c.count;
      if (c.exam_type === 'SKD') skdTotal += c.count;
      else if (c.exam_type === 'SKB') skbTotal += c.count;
    }

    const categories = db
      .prepare('SELECT kode, exam_type, nama, deskripsi, urutan FROM categories ORDER BY urutan ASC')
      .all() as CategoryMeta[];

    res.json({
      ok: true,
      bankStats: {
        total: skdTotal + skbTotal,
        skdTotal,
        skbTotal,
        byCategory,
      },
      categories,
    });
  });

  // Authentication Routes (Register, Login, Logout, Current User)
  app.post('/api/auth/register', async (req, res) => {
    try {
      const body = (req.body || {}) as Partial<RegisterPayload>;
      const result = await registerUser(db, body);
      if (result.error || !result.data) {
        res.status(result.status).json({ error: result.error ?? 'Registrasi gagal.' });
        return;
      }
      setAuthCookie(req, res, result.data.token);
      res.status(result.status).json(result.data);
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat mendaftarkan akun.' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const body = (req.body || {}) as Partial<LoginPayload>;
      const result = await loginUser(db, body);
      if (result.error || !result.data) {
        res.status(result.status).json({ error: result.error ?? 'Login gagal.' });
        return;
      }
      setAuthCookie(req, res, result.data.token);
      res.status(result.status).json(result.data);
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Terjadi kesalahan saat memverifikasi akun.' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    clearAuthCookie(req, res);
    res.json({ ok: true });
  });

  app.get('/api/auth/me', requireAuth, (req, res) => {
    res.json({ user: (req as AuthenticatedRequest).authUser });
  });

  // Question Bank Explorer (Global/public questions accessible to authenticated users)
  app.get('/api/questions', requireAuth, (req, res) => {
    const examType = typeof req.query.examType === 'string' ? req.query.examType.toUpperCase() : '';
    const kategori = typeof req.query.kategori === 'string' ? req.query.kategori.toUpperCase() : '';
    const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';

    const whereClauses: string[] = [];
    const params: string[] = [];

    if (examType === 'SKD' || examType === 'SKB') {
      whereClauses.push('exam_type = ?');
      params.push(examType);
    }

    const validCategories = new Set([
      'TWK',
      'TIU',
      'TKP',
      'RPL',
      'BASIS_DATA',
      'MANAJEMEN_DATA',
      'JARINGAN_DASAR',
    ]);
    if (validCategories.has(kategori)) {
      whereClauses.push('kategori = ?');
      params.push(kategori);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const rows = db
      .prepare(`SELECT * FROM questions ${whereSql} ORDER BY id ASC`)
      .all(...params) as DbQuestionRow[];

    const filtered = q
      ? rows.filter(
          (item) =>
            item.pertanyaan.toLowerCase().includes(q) ||
            item.subtopik.toLowerCase().includes(q) ||
            item.pembahasan.toLowerCase().includes(q)
        )
      : rows;

    res.json({
      total: filtered.length,
      questions: filtered.map((item) => ({
        ...item,
        bobot_tkp: item.bobot_tkp ? (JSON.parse(item.bobot_tkp) as TkpWeights) : null,
      })),
    });
  });

  // Isolated Session History List (ALWAYS filtered by authenticated current_user_id)
  app.get('/api/sessions', requireAuth, (req, res) => {
    const currentUser = (req as AuthenticatedRequest).authUser;
    const examType = typeof req.query.examType === 'string' ? req.query.examType.toUpperCase() : '';
    const sessionMode = typeof req.query.sessionMode === 'string' ? req.query.sessionMode.toUpperCase() : '';

    const sessions = fetchUserSessions(db, currentUser.id, examType, sessionMode);
    res.json({ sessions });
  });

  // Dedicated Controller: Create SKD Session (user_id derived strictly from verified JWT)
  app.post('/api/skd/sessions', requireAuth, (req, res) => {
    const currentUser = (req as AuthenticatedRequest).authUser;
    const body = (req.body || {}) as Partial<CreateSkdSessionPayload>;
    const result = createSkdSession(db, currentUser.id, body);
    if (result.error) {
      res.status(result.status).json({ error: result.error });
      return;
    }
    res.status(result.status).json(result.data);
  });

  // Dedicated Controller: Create SKB Session (user_id derived strictly from verified JWT)
  app.post('/api/skb/sessions', requireAuth, (req, res) => {
    const currentUser = (req as AuthenticatedRequest).authUser;
    const body = (req.body || {}) as Partial<CreateSkbSessionPayload>;
    const result = createSkbSession(db, currentUser.id, body);
    if (result.error) {
      res.status(result.status).json({ error: result.error });
      return;
    }
    res.status(result.status).json(result.data);
  });

  // Fetch Session Detail (strictly verifies session.user_id === current_user_id, returns 403 otherwise)
  app.get('/api/sessions/:id', requireAuth, (req, res) => {
    const currentUser = (req as AuthenticatedRequest).authUser;
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'ID sesi tidak valid.' });
      return;
    }

    const result = fetchSessionDetail(db, id, currentUser.id);
    if (result.error || !result.data) {
      res.status(result.status).json({ error: result.error ?? 'Sesi ujian tidak ditemukan.' });
      return;
    }

    res.json(result.data);
  });

  // Hint / Learning Modal Endpoint (i) - enforces user_id ownership & blocks during active Mode Real
  app.get('/api/sessions/:id/answers/:answerId/hint', requireAuth, (req, res) => {
    const currentUser = (req as AuthenticatedRequest).authUser;
    const sessionId = Number(req.params.id);
    const answerId = Number(req.params.answerId);

    const hintResult = buildHintResponse(db, sessionId, answerId, currentUser.id);
    if (hintResult.error) {
      res.status(hintResult.status).json({ error: hintResult.error });
      return;
    }

    res.json(hintResult.data);
  });

  // Save/Update User Answer or Flag in Real Time (enforces user_id ownership)
  app.patch('/api/sessions/:id/answer', requireAuth, (req, res) => {
    const currentUser = (req as AuthenticatedRequest).authUser;
    const sessionId = Number(req.params.id);
    const body = (req.body || {}) as {
      answerId?: number;
      selectedLabel?: OptionKey | null;
      ditandai?: boolean;
      elapsedSeconds?: number;
    };

    const result = saveAnswerRealtime(db, sessionId, currentUser.id, body);
    if (result.error) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    res.json({ ok: true });
  });

  // Submit & Evaluate Session (enforces user_id ownership + auto-dispatches SKD vs SKB scoring)
  app.post('/api/sessions/:id/submit', requireAuth, (req, res) => {
    const currentUser = (req as AuthenticatedRequest).authUser;
    const sessionId = Number(req.params.id);
    const { elapsedSeconds } = (req.body || {}) as { elapsedSeconds?: number };

    const result = submitExamSession(db, sessionId, currentUser.id, elapsedSeconds);
    if (result.error) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    res.json(result.data);
  });

  // Delete a session from history (enforces user_id ownership)
  app.delete('/api/sessions/:id', requireAuth, (req, res) => {
    const currentUser = (req as AuthenticatedRequest).authUser;
    const sessionId = Number(req.params.id);
    const result = deleteUserSession(db, sessionId, currentUser.id);
    if (result.error) {
      res.status(result.status).json({ error: result.error });
      return;
    }
    res.json({ ok: true });
  });

  // Vite / Static Asset Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CAT SKD & SKB CPNS server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
