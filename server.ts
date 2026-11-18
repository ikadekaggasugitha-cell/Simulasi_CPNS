import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getDb } from './server/db';
import {
  buildHintResponse,
  createSkbSession,
  createSkdSession,
  fetchSessionDetail,
  formatSessionSummary,
  saveAnswerRealtime,
  submitExamSession,
  type DbQuestionRow,
  type DbSessionRow,
} from './server/controllers/sessions';
import type {
  CategoryMeta,
  CreateSkbSessionPayload,
  CreateSkdSessionPayload,
  OptionKey,
  QuestionCategory,
  TkpWeights,
} from './src/shared/types';

async function startServer() {
  const db = getDb();
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Health & Question Bank Stats (SKD + SKB separated)
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

  // Question Bank Explorer (strictly filterable by examType & kategori)
  app.get('/api/questions', (req, res) => {
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

  // Isolated Session History List (supports ?examType=SKD|SKB & ?sessionMode=REAL|PRACTICE)
  app.get('/api/sessions', (req, res) => {
    const examType = typeof req.query.examType === 'string' ? req.query.examType.toUpperCase() : '';
    const sessionMode = typeof req.query.sessionMode === 'string' ? req.query.sessionMode.toUpperCase() : '';

    const where: string[] = [];
    const params: string[] = [];
    if (examType === 'SKD' || examType === 'SKB') {
      where.push('exam_type = ?');
      params.push(examType);
    }
    if (sessionMode === 'REAL' || sessionMode === 'PRACTICE') {
      where.push('session_mode = ?');
      params.push(sessionMode);
    }

    const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
    const rows = db
      .prepare(`SELECT * FROM sessions ${whereSql} ORDER BY id DESC`)
      .all(...params) as DbSessionRow[];

    res.json({
      sessions: rows.map(formatSessionSummary),
    });
  });

  // Dedicated Controller: Create SKD Session
  app.post('/api/skd/sessions', (req, res) => {
    const body = (req.body || {}) as Partial<CreateSkdSessionPayload>;
    const result = createSkdSession(db, body);
    if (result.error) {
      res.status(result.status).json({ error: result.error });
      return;
    }
    res.status(result.status).json(result.data);
  });

  // Dedicated Controller: Create SKB Session
  app.post('/api/skb/sessions', (req, res) => {
    const body = (req.body || {}) as Partial<CreateSkbSessionPayload>;
    const result = createSkbSession(db, body);
    if (result.error) {
      res.status(result.status).json({ error: result.error });
      return;
    }
    res.status(result.status).json(result.data);
  });

  // Fetch Session Detail (Exam or Result)
  app.get('/api/sessions/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'ID sesi tidak valid.' });
      return;
    }

    const detail = fetchSessionDetail(db, id);
    if (!detail) {
      res.status(404).json({ error: 'Sesi ujian tidak ditemukan.' });
      return;
    }

    res.json(detail);
  });

  // Hint / Learning Modal Endpoint (i) - blocked during active Mode Real
  app.get('/api/sessions/:id/answers/:answerId/hint', (req, res) => {
    const sessionId = Number(req.params.id);
    const answerId = Number(req.params.answerId);

    const hintResult = buildHintResponse(db, sessionId, answerId);
    if (hintResult.error) {
      res.status(hintResult.status).json({ error: hintResult.error });
      return;
    }

    res.json(hintResult.data);
  });

  // Save/Update User Answer or Flag in Real Time
  app.patch('/api/sessions/:id/answer', (req, res) => {
    const sessionId = Number(req.params.id);
    const body = (req.body || {}) as {
      answerId?: number;
      selectedLabel?: OptionKey | null;
      ditandai?: boolean;
      elapsedSeconds?: number;
    };

    const result = saveAnswerRealtime(db, sessionId, body);
    if (result.error) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    res.json({ ok: true });
  });

  // Submit & Evaluate Session (auto-dispatches SKD vs SKB scoring engine)
  app.post('/api/sessions/:id/submit', (req, res) => {
    const sessionId = Number(req.params.id);
    const { elapsedSeconds } = (req.body || {}) as { elapsedSeconds?: number };

    const result = submitExamSession(db, sessionId, elapsedSeconds);
    if (result.error) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    res.json(result.data);
  });

  // Delete a session from history
  app.delete('/api/sessions/:id', (req, res) => {
    const sessionId = Number(req.params.id);
    const result = db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Sesi tidak ditemukan.' });
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
