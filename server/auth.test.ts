import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { seedCategories, seedQuestionsIfEmpty } from './db';
import { signAuthToken, verifyAuthToken } from './auth';
import { loginUser, registerUser } from './controllers/auth';
import {
  buildHintResponse,
  createSkbSession,
  createSkdSession,
  deleteUserSession,
  fetchSessionDetail,
  fetchUserSessions,
  saveAnswerRealtime,
  submitExamSession,
} from './controllers/sessions';

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  const schema = fs.readFileSync(path.resolve(process.cwd(), 'server', 'schema.sql'), 'utf-8');
  db.exec(schema);
  seedCategories(db);
  seedQuestionsIfEmpty(db);
  return db;
}

test('auth registration, bcrypt hashing, login validation, and JWT roundtrip', async () => {
  const db = createTestDb();
  try {
    const reg = await registerUser(db, {
      name: 'Budi Santoso',
      email: 'Budi@Example.com',
      password: 'Password123!',
    });
    assert.equal(reg.status, 201);
    assert.ok(reg.data);
    assert.equal(reg.data.user.email, 'budi@example.com');

    const stored = db
      .prepare('SELECT password_hash FROM users WHERE id = ?')
      .get(reg.data.user.id) as { password_hash: string };
    assert.ok(stored.password_hash.startsWith('$2'));
    assert.notEqual(stored.password_hash, 'Password123!');

    const decoded = verifyAuthToken(reg.data.token);
    assert.ok(decoded);
    assert.equal(decoded.userId, reg.data.user.id);

    const dup = await registerUser(db, {
      name: 'Budi Lain',
      email: 'budi@example.com',
      password: 'Password123!',
    });
    assert.equal(dup.status, 409);

    const wrongLogin = await loginUser(db, {
      email: 'budi@example.com',
      password: 'WrongPassword',
    });
    assert.equal(wrongLogin.status, 401);

    const okLogin = await loginUser(db, {
      email: 'budi@example.com',
      password: 'Password123!',
    });
    assert.equal(okLogin.status, 200);
    assert.equal(okLogin.data?.user.name, 'Budi Santoso');

    const freshToken = signAuthToken(okLogin.data!.user);
    assert.equal(verifyAuthToken(freshToken)?.userId, okLogin.data!.user.id);
  } finally {
    db.close();
  }
});

test('strict multi-user tenant isolation (403 Forbidden) and ON DELETE CASCADE', async () => {
  const db = createTestDb();
  try {
    const userARes = await registerUser(db, {
      name: 'Peserta Satu',
      email: 'satu@example.com',
      password: 'Password123!',
    });
    const userBRes = await registerUser(db, {
      name: 'Peserta Dua',
      email: 'dua@example.com',
      password: 'Password123!',
    });

    const userAId = userARes.data!.user.id;
    const userBId = userBRes.data!.user.id;

    // User A creates SKD & SKB sessions
    const aSkd = createSkdSession(db, userAId, {
      sessionMode: 'PRACTICE',
      totalSoal: 20,
      modeWaktu: 'UNTIMED',
    });
    assert.equal(aSkd.status, 201);
    const aSessionId = aSkd.data!.session.id;
    const aAnswerId = aSkd.data!.items[0].answerId;
    assert.equal(aSkd.data!.session.session_number, 1);

    // User B sees 0 sessions from User A
    assert.equal(fetchUserSessions(db, userBId).length, 0);
    assert.equal(fetchUserSessions(db, userAId, 'SKD').length, 1);

    // User B gets 403 Forbidden on every cross-tenant access attempt
    assert.equal(fetchSessionDetail(db, aSessionId, userBId).status, 403);
    assert.equal(buildHintResponse(db, aSessionId, aAnswerId, userBId).status, 403);
    assert.equal(
      saveAnswerRealtime(db, aSessionId, userBId, { answerId: aAnswerId, selectedLabel: 'A' })
        .status,
      403
    );
    assert.equal(submitExamSession(db, aSessionId, userBId, 10).status, 403);
    assert.equal(deleteUserSession(db, aSessionId, userBId).status, 403);

    // User B creates their own SKB session -> independent session_number = 1
    const bSkb = createSkbSession(db, userBId, {
      sessionMode: 'PRACTICE',
      totalSoal: 20,
      modeWaktu: 'TIMED',
    });
    assert.equal(bSkb.status, 201);
    assert.equal(bSkb.data!.session.session_number, 1);
    const bSessionId = bSkb.data!.session.id;

    // Deleting User A cascades to User A's sessions & session_answers, leaving questions & User B intact
    const qCountBefore = (
      db.prepare('SELECT COUNT(*) AS count FROM questions').get() as { count: number }
    ).count;
    db.prepare('DELETE FROM users WHERE id = ?').run(userAId);

    const aRemainingSessions = (
      db.prepare('SELECT COUNT(*) AS count FROM sessions WHERE id = ?').get(aSessionId) as {
        count: number;
      }
    ).count;
    const aRemainingAnswers = (
      db
        .prepare('SELECT COUNT(*) AS count FROM session_answers WHERE session_id = ?')
        .get(aSessionId) as { count: number }
    ).count;
    assert.equal(aRemainingSessions, 0);
    assert.equal(aRemainingAnswers, 0);

    // User B's session & global questions remain intact
    assert.equal(fetchSessionDetail(db, bSessionId, userBId).status, 200);
    const qCountAfter = (
      db.prepare('SELECT COUNT(*) AS count FROM questions').get() as { count: number }
    ).count;
    assert.equal(qCountAfter, qCountBefore);
  } finally {
    db.close();
  }
});
