import test from 'node:test';
import assert from 'node:assert/strict';
import {
  localCreateSkbSession,
  localCreateSkdSession,
  localDeleteSession,
  localFetchAnswerHint,
  localFetchHealth,
  localFetchQuestionsBank,
  localFetchSessionDetail,
  localFetchSessions,
  localLoginUser,
  localLogoutUser,
  localRegisterUser,
  localSaveSessionAnswer,
  localSubmitSession,
  setLocalEngineStorageForTest,
} from './localEngine';

function createMemoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
}

test('localEngine runs full Netlify static lifecycle with multi-user auth & 403 isolation', async () => {
  setLocalEngineStorageForTest(createMemoryStorage());

  const health = await localFetchHealth();
  assert.equal(health.ok, true);
  assert.equal(health.bankStats.total, 1450);
  assert.equal(health.bankStats.skdTotal, 1250);
  assert.equal(health.bankStats.skbTotal, 200);

  // Unauthenticated access must fail with 401
  await assert.rejects(() => localFetchSessions('SKD'), /Autentikasi diperlukan/);

  // Register User A
  const userA = await localRegisterUser({
    name: 'Andi Wijaya',
    email: 'andi@example.com',
    password: 'password123',
  });
  assert.equal(userA.user.name, 'Andi Wijaya');

  // 1. Create SKD Real session (110q, 100m, hint blocked during IN_PROGRESS)
  const skdReal = await localCreateSkdSession({ sessionMode: 'REAL' });
  assert.equal(skdReal.session.nama_sesi, 'SKD Real Session 1');
  assert.equal(skdReal.session.total_soal, 110);
  assert.equal(skdReal.session.batas_waktu_detik, 6000);
  await assert.rejects(
    () => localFetchAnswerHint(skdReal.session.id, skdReal.items[0].answerId),
    /dinonaktifkan selama Mode Real/
  );

  // Save answer and submit
  await localSaveSessionAnswer(skdReal.session.id, {
    answerId: skdReal.items[0].answerId,
    selectedLabel: 'A',
    elapsedSeconds: 45,
  });
  const submittedSkd = await localSubmitSession(skdReal.session.id, 45);
  assert.equal(submittedSkd.session.status, 'COMPLETED');

  // Hint unlocks after submit
  const hintAfter = await localFetchAnswerHint(
    skdReal.session.id,
    skdReal.items[0].answerId
  );
  assert.ok(hintAfter.pembahasan.length > 0);

  // 2. Create SKB Practice session (20q, UNTIMED, hint allowed live)
  const skbPrac = await localCreateSkbSession({
    sessionMode: 'PRACTICE',
    totalSoal: 20,
    modeWaktu: 'UNTIMED',
  });
  assert.equal(skbPrac.session.nama_sesi, 'SKB Practice Session 1');
  assert.equal(skbPrac.session.total_soal, 20);
  assert.equal(skbPrac.session.batas_waktu_detik, null);
  const liveHint = await localFetchAnswerHint(
    skbPrac.session.id,
    skbPrac.items[0].answerId
  );
  assert.equal(liveHint.exam_type, 'SKB');

  // 3. Isolated lists & bank search for User A
  const skdList = await localFetchSessions('SKD');
  const skbList = await localFetchSessions('SKB');
  assert.equal(skdList.sessions.length, 1);
  assert.equal(skbList.sessions.length, 1);

  const bankSkb = await localFetchQuestionsBank({ examType: 'SKB', kategori: 'RPL' });
  assert.equal(bankSkb.total, 50);

  // 4. Logout User A & Register User B -> User B cannot see or access User A's sessions
  await localLogoutUser();
  await localRegisterUser({
    name: 'Siti Rahma',
    email: 'siti@example.com',
    password: 'password123',
  });
  assert.equal((await localFetchSessions('SKD')).sessions.length, 0);
  assert.equal((await localFetchSessions('SKB')).sessions.length, 0);
  await assert.rejects(() => localFetchSessionDetail(skdReal.session.id), /403 Forbidden/);
  await assert.rejects(() => localDeleteSession(skbPrac.session.id), /403 Forbidden/);

  // 5. Log back in as User A and delete User A's SKB session
  await localLogoutUser();
  await localLoginUser({ email: 'andi@example.com', password: 'password123' });
  await localDeleteSession(skbPrac.session.id);
  const skbAfterDelete = await localFetchSessions('SKB');
  assert.equal(skbAfterDelete.sessions.length, 0);

  setLocalEngineStorageForTest(null);
});
