import test from 'node:test';
import assert from 'node:assert/strict';
import {
  allocateSkbCategoryCounts,
  allocateSkdCategoryCounts,
  calculatePassingThresholdsFromCounts,
  calculateTimeLimitSeconds,
  computeSkbScoreSummary,
  computeSkdScoreSummary,
  createShuffledOptionOrder,
  evaluateAnswer,
  evaluateSkbAnswer,
  evaluateSkdAnswer,
  mapDisplayLabelToOriginal,
  mapOriginalKeyToDisplayLabel,
  selectPrioritizedQuestions,
  shuffleArray,
  type QuestionUsageStat,
} from './scoring';

test('allocateSkdCategoryCounts and allocateSkbCategoryCounts enforce REAL BKN and PRACTICE 20/50/75 totals', () => {
  assert.deepEqual(allocateSkdCategoryCounts('REAL'), {
    TWK: 30,
    TIU: 35,
    TKP: 45,
  });

  assert.deepEqual(allocateSkdCategoryCounts('PRACTICE', 20), { TWK: 6, TIU: 6, TKP: 8 });
  assert.deepEqual(allocateSkdCategoryCounts('PRACTICE', 50), { TWK: 14, TIU: 16, TKP: 20 });
  assert.deepEqual(allocateSkdCategoryCounts('PRACTICE', 75), { TWK: 20, TIU: 24, TKP: 31 });

  assert.deepEqual(allocateSkbCategoryCounts('REAL'), {
    RPL: 25,
    BASIS_DATA: 25,
    MANAJEMEN_DATA: 25,
    JARINGAN_DASAR: 25,
  });

  for (const qty of [20, 50, 75] as const) {
    const alloc = allocateSkbCategoryCounts('PRACTICE', qty);
    const total = alloc.RPL + alloc.BASIS_DATA + alloc.MANAJEMEN_DATA + alloc.JARINGAN_DASAR;
    assert.equal(total, qty, `SKB practice allocation total must equal ${qty}`);
    assert.ok(alloc.RPL >= 5 && alloc.BASIS_DATA >= 5 && alloc.MANAJEMEN_DATA >= 5 && alloc.JARINGAN_DASAR >= 5);
  }
});

test('calculatePassingThresholdsFromCounts returns exact BKN 65/80/166 for REAL and scaled for PRACTICE', () => {
  const realPg = calculatePassingThresholdsFromCounts({ TWK: 30, TIU: 35, TKP: 45 }, 'REAL');
  assert.deepEqual(realPg, {
    twk: 65,
    tiu: 80,
    tkp: 166,
    maxTwk: 150,
    maxTiu: 175,
    maxTkp: 225,
  });

  const p20 = calculatePassingThresholdsFromCounts({ TWK: 6, TIU: 6, TKP: 8 }, 'PRACTICE');
  assert.equal(p20.maxTwk, 30);
  assert.equal(p20.maxTiu, 30);
  assert.equal(p20.maxTkp, 40);
  assert.equal(p20.twk, 13);
  assert.equal(p20.tiu, 14);
  assert.equal(p20.tkp, 30);
});

test('calculateTimeLimitSeconds enforces locked 100m SKD / 90m SKB for REAL and proportional for PRACTICE', () => {
  assert.equal(calculateTimeLimitSeconds('SKD', 'REAL', 110), 100 * 60);
  assert.equal(calculateTimeLimitSeconds('SKB', 'REAL', 100), 90 * 60);

  assert.equal(calculateTimeLimitSeconds('SKD', 'PRACTICE', 20), 18 * 60);
  assert.equal(calculateTimeLimitSeconds('SKD', 'PRACTICE', 50), 45 * 60);
  assert.equal(calculateTimeLimitSeconds('SKD', 'PRACTICE', 75), 68 * 60);

  assert.equal(calculateTimeLimitSeconds('SKB', 'PRACTICE', 20), 18 * 60);
  assert.equal(calculateTimeLimitSeconds('SKB', 'PRACTICE', 50), 45 * 60);
  assert.equal(calculateTimeLimitSeconds('SKB', 'PRACTICE', 75), 68 * 60);
});

test('evaluateSkdAnswer uses +5/0 for TWK/TIU and 1-5 weights for TKP', () => {
  assert.deepEqual(
    evaluateSkdAnswer({ exam_type: 'SKD', kategori: 'TWK', jawaban_benar: 'B', bobot_tkp: null }, 'B'),
    { status: 'BENAR', poin: 5 }
  );
  assert.deepEqual(
    evaluateSkdAnswer({ exam_type: 'SKD', kategori: 'TIU', jawaban_benar: 'A', bobot_tkp: null }, 'C'),
    { status: 'SALAH', poin: 0 }
  );
  assert.deepEqual(
    evaluateSkdAnswer({ exam_type: 'SKD', kategori: 'TIU', jawaban_benar: 'A', bobot_tkp: null }, null),
    { status: 'KOSONG', poin: 0 }
  );

  const tkpQ = {
    exam_type: 'SKD' as const,
    kategori: 'TKP' as const,
    jawaban_benar: 'C' as const,
    bobot_tkp: { A: 3, B: 1, C: 5, D: 4, E: 2 },
  };
  assert.deepEqual(evaluateSkdAnswer(tkpQ, 'C'), { status: 'BENAR', poin: 5 });
  assert.deepEqual(evaluateSkdAnswer(tkpQ, 'D'), { status: 'SALAH', poin: 4 });
  assert.deepEqual(evaluateSkdAnswer(tkpQ, 'B'), { status: 'SALAH', poin: 1 });
  assert.deepEqual(evaluateSkdAnswer(tkpQ, null), { status: 'KOSONG', poin: 0 });
});

test('evaluateSkbAnswer enforces strictly absolute +5 or 0 across all IT categories (no gradient)', () => {
  for (const cat of ['RPL', 'BASIS_DATA', 'MANAJEMEN_DATA', 'JARINGAN_DASAR'] as const) {
    assert.deepEqual(
      evaluateAnswer({ exam_type: 'SKB', kategori: cat, jawaban_benar: 'D', bobot_tkp: null }, 'D'),
      { status: 'BENAR', poin: 5 }
    );
    assert.deepEqual(
      evaluateSkbAnswer({ exam_type: 'SKB', kategori: cat, jawaban_benar: 'D', bobot_tkp: null }, 'A'),
      { status: 'SALAH', poin: 0 }
    );
    assert.deepEqual(
      evaluateSkbAnswer({ exam_type: 'SKB', kategori: cat, jawaban_benar: 'D', bobot_tkp: null }, null),
      { status: 'KOSONG', poin: 0 }
    );
  }
});

test('option shuffling preserves bidirectional label-to-original mapping', () => {
  const order = createShuffledOptionOrder(() => 0.37);
  assert.equal(order.length, 5);
  assert.deepEqual([...order].sort(), ['A', 'B', 'C', 'D', 'E']);

  for (const label of ['A', 'B', 'C', 'D', 'E'] as const) {
    const orig = mapDisplayLabelToOriginal(order, label);
    assert.ok(orig);
    assert.equal(mapOriginalKeyToDisplayLabel(order, orig), label);
  }
});

test('shuffleArray preserves all items without duplicates', () => {
  const src = Array.from({ length: 75 }, (_, i) => i + 1);
  const shuffled = shuffleArray(src);
  assert.equal(shuffled.length, 75);
  assert.deepEqual([...shuffled].sort((a, b) => a - b), src);
});

test('computeSkdScoreSummary strictly fails is_passed if any single sub-category misses Passing Grade', () => {
  // Pass all 3 in REAL BKN (TWK 65, TIU 80, TKP 177 >= 166)
  const bknPass = [
    ...Array.from({ length: 13 }, () => ({ kategori: 'TWK' as const, status: 'BENAR' as const, poin: 5 })),
    ...Array.from({ length: 17 }, () => ({ kategori: 'TWK' as const, status: 'SALAH' as const, poin: 0 })),
    ...Array.from({ length: 16 }, () => ({ kategori: 'TIU' as const, status: 'BENAR' as const, poin: 5 })),
    ...Array.from({ length: 19 }, () => ({ kategori: 'TIU' as const, status: 'SALAH' as const, poin: 0 })),
    ...Array.from({ length: 42 }, () => ({ kategori: 'TKP' as const, status: 'SALAH' as const, poin: 4 })),
    ...Array.from({ length: 3 }, () => ({ kategori: 'TKP' as const, status: 'SALAH' as const, poin: 3 })),
  ];
  const resPass = computeSkdScoreSummary(bknPass, 'REAL');
  assert.equal(resPass.skor_twk, 65);
  assert.equal(resPass.skor_tiu, 80);
  assert.equal(resPass.skor_tkp, 177);
  assert.equal(resPass.skor_maksimal, 550);
  assert.equal(resPass.lulus_passing_grade, true);

  // Fail ONLY TIU (75 < 80) while TWK=150 and TKP=225 -> lulus_passing_grade MUST be false
  const failOne = [
    ...Array.from({ length: 30 }, () => ({ kategori: 'TWK' as const, status: 'BENAR' as const, poin: 5 })), // 150
    ...Array.from({ length: 15 }, () => ({ kategori: 'TIU' as const, status: 'BENAR' as const, poin: 5 })), // 75 < 80
    ...Array.from({ length: 20 }, () => ({ kategori: 'TIU' as const, status: 'SALAH' as const, poin: 0 })),
    ...Array.from({ length: 45 }, () => ({ kategori: 'TKP' as const, status: 'BENAR' as const, poin: 5 })), // 225
  ];
  const resFail = computeSkdScoreSummary(failOne, 'REAL');
  assert.equal(resFail.skor_total, 450);
  assert.equal(resFail.lulus_passing_grade, false);
});

test('computeSkbScoreSummary handles 100-question REAL max 500 and IT category breakdown', () => {
  const skbItems = [
    ...Array.from({ length: 25 }, () => ({ kategori: 'RPL' as const, subtopik: 'CI/CD', status: 'BENAR' as const, poin: 5 })), // 125
    ...Array.from({ length: 15 }, () => ({ kategori: 'BASIS_DATA' as const, subtopik: 'Normalisasi', status: 'BENAR' as const, poin: 5 })),
    ...Array.from({ length: 10 }, () => ({ kategori: 'BASIS_DATA' as const, subtopik: 'Indexing B-Tree', status: 'SALAH' as const, poin: 0 })), // 75
    ...Array.from({ length: 20 }, () => ({ kategori: 'MANAJEMEN_DATA' as const, subtopik: 'SPBE', status: 'BENAR' as const, poin: 5 })),
    ...Array.from({ length: 5 }, () => ({ kategori: 'MANAJEMEN_DATA' as const, subtopik: 'ETL', status: 'KOSONG' as const, poin: 0 })), // 100
    ...Array.from({ length: 10 }, () => ({ kategori: 'JARINGAN_DASAR' as const, subtopik: 'CIDR', status: 'BENAR' as const, poin: 5 })),
    ...Array.from({ length: 15 }, () => ({ kategori: 'JARINGAN_DASAR' as const, subtopik: 'CIDR', status: 'SALAH' as const, poin: 0 })), // 50
  ];
  const summary = computeSkbScoreSummary(skbItems);
  assert.equal(summary.skor_total, 350);
  assert.equal(summary.skor_maksimal, 500);
  assert.equal(summary.persentase_total, 70);
  assert.equal(summary.breakdown_skor.find((b) => b.kategori === 'RPL')?.persentase, 100);
  assert.equal(summary.breakdown_skor.find((b) => b.kategori === 'JARINGAN_DASAR')?.persentase, 40);
  assert.ok(summary.topik_rekomendasi.some((t) => t.includes('Indexing B-Tree')));
});

test('selectPrioritizedQuestions exhausts all unseen questions before repeating any', () => {
  const pool = Array.from({ length: 75 }, (_, i) => ({ id: i + 1 }));
  const usage = new Map<number, QuestionUsageStat>();

  const s1 = selectPrioritizedQuestions(pool, 20, usage);
  assert.equal(s1.length, 20);
  for (const q of s1) usage.set(q.id, { usageCount: 1, lastSessionId: 1 });

  const s2 = selectPrioritizedQuestions(pool, 20, usage);
  assert.equal(s2.length, 20);
  const s1Ids = new Set(s1.map((q) => q.id));
  assert.equal(s2.some((q) => s1Ids.has(q.id)), false);
});
