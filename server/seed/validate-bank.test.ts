import test from 'node:test';
import assert from 'node:assert/strict';
import { TWK_QUESTIONS } from './twk';
import { TIU_QUESTIONS } from './tiu';
import { TKP_QUESTIONS } from './tkp';
import { TWK_EXTRA_QUESTIONS } from './twk_extra';
import { TWK_HOTS_BATCH_1 } from './twk_hots_batch1';
import { TIU_EXTRA_QUESTIONS } from './tiu_extra';
import { TKP_EXTRA_QUESTIONS } from './tkp_extra';
import { SKB_RPL_QUESTIONS } from './skb_rpl';
import { SKB_BASIS_DATA_QUESTIONS } from './skb_basis_data';
import { SKB_MANAJEMEN_DATA_QUESTIONS } from './skb_manajemen_data';
import { SKB_JARINGAN_QUESTIONS } from './skb_jaringan';
import { SKB_QUESTIONS } from './skb';
import type { SeedQuestion } from './types';

function assertValidCategoryBank(name: string, items: SeedQuestion[], minCount: number) {
  assert.ok(
    items.length >= minCount,
    `${name} must have at least ${minCount} questions, got ${items.length}`
  );

  const seenQuestions = new Set<string>();

  items.forEach((q, idx) => {
    const label = `${name}[${idx}] (${q.subtopik})`;
    assert.equal(typeof q.pertanyaan, 'string', `${label} pertanyaan must be string`);
    assert.ok(q.pertanyaan.trim().length > 15, `${label} question text too short`);
    assert.ok(
      !seenQuestions.has(q.pertanyaan.trim()),
      `${label} duplicate question text detected`
    );
    seenQuestions.add(q.pertanyaan.trim());

    const opts = [q.opsi_a, q.opsi_b, q.opsi_c, q.opsi_d, q.opsi_e].map((s) => {
      assert.equal(typeof s, 'string', `${label} option must be string`);
      return s.trim();
    });
    assert.ok(opts.every((o) => o.length > 0), `${label} has empty option`);
    assert.equal(new Set(opts).size, 5, `${label} has duplicate option text`);

    assert.ok(
      ['A', 'B', 'C', 'D', 'E'].includes(q.jawaban_benar),
      `${label} invalid jawaban_benar: ${q.jawaban_benar}`
    );
    assert.equal(typeof q.pembahasan, 'string', `${label} pembahasan must be string`);
    assert.ok(q.pembahasan.trim().length > 20, `${label} pembahasan too short`);

    if (q.kategori === 'TKP') {
      assert.ok(q.bobot_tkp, `${label} missing bobot_tkp`);
      const weights = Object.values(q.bobot_tkp);
      assert.deepEqual(
        [...weights].sort((a, b) => a - b),
        [1, 2, 3, 4, 5],
        `${label} TKP weights must be exact permutation of 1..5`
      );
      assert.equal(
        q.bobot_tkp[q.jawaban_benar],
        5,
        `${label} jawaban_benar must match weight 5`
      );
    } else {
      assert.ok(q.bobot_tkp == null, `${label} non-TKP question must not have bobot_tkp`);
    }
  });
}

const ALL_TWK = [...TWK_QUESTIONS, ...TWK_EXTRA_QUESTIONS, ...TWK_HOTS_BATCH_1];
const ALL_TIU = [...TIU_QUESTIONS, ...TIU_EXTRA_QUESTIONS];
const ALL_TKP = [...TKP_QUESTIONS, ...TKP_EXTRA_QUESTIONS];

test('TWK bank has at least 385 unique valid HOTS questions', () => {
  assertValidCategoryBank('TWK', ALL_TWK, 385);
});

test('TIU bank has 500 unique valid HOTS questions with Verbal/Numerik/Figural SVG & dual-method explanations', () => {
  assertValidCategoryBank('TIU', ALL_TIU, 500);
  assert.equal(ALL_TIU.length, 500, 'TIU bank must contain exactly 500 questions');

  let verbalCount = 0;
  let numerikCount = 0;
  let figuralCount = 0;

  ALL_TIU.forEach((q, idx) => {
    const label = `TIU[${idx}] (${q.subtopik})`;
    assert.ok(
      q.pembahasan.includes('Metode 1 (Langkah Sistematis):'),
      `${label} missing Metode 1 (Langkah Sistematis)`
    );
    assert.ok(
      q.pembahasan.includes('Metode 2 (Trik Cepat / Eliminasi):'),
      `${label} missing Metode 2 (Trik Cepat / Eliminasi)`
    );

    if (q.subtopik.startsWith('Verbal')) {
      verbalCount++;
    } else if (q.subtopik.startsWith('Numerik')) {
      numerikCount++;
    } else if (q.subtopik.startsWith('Figural')) {
      figuralCount++;
      const combined = [q.pertanyaan, q.opsi_a, q.opsi_b, q.opsi_c, q.opsi_d, q.opsi_e].join('\n');
      assert.ok(
        combined.includes('<svg') && combined.includes('viewBox="0 0 100 100"'),
        `${label} Figural question must contain inline <svg viewBox="0 0 100 100">`
      );
      const strippedXmlns = combined.replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '');
      assert.ok(
        !/(https?:\/\/|<img\b|<image\b)/i.test(strippedXmlns),
        `${label} Figural question must not reference external image URLs`
      );
      const optionSvgs = [q.opsi_a, q.opsi_b, q.opsi_c, q.opsi_d, q.opsi_e];
      optionSvgs.forEach((opt, optIdx) => {
        assert.ok(
          opt.includes('<svg') && opt.includes('</svg>'),
          `${label} option ${optIdx} must be valid inline SVG`
        );
      });
    } else {
      assert.fail(`${label} has unrecognized TIU subtopik prefix: ${q.subtopik}`);
    }
  });

  assert.equal(verbalCount, 150, `Expected 150 TIU Verbal questions, got ${verbalCount}`);
  assert.equal(numerikCount, 215, `Expected 215 TIU Numerik questions, got ${numerikCount}`);
  assert.equal(figuralCount, 135, `Expected 135 TIU Figural SVG questions, got ${figuralCount}`);
});

test('TKP bank has 375 unique valid HOTS situational questions evenly split across 5 aspects with balanced A-E score-5 slots', () => {
  assertValidCategoryBank('TKP', ALL_TKP, 375);
  assert.equal(ALL_TKP.length, 375, 'TKP bank must contain exactly 375 questions');

  const expectedAspects = [
    'Pelayanan Publik',
    'Profesionalisme',
    'Jejaring Kerja & Sosial Budaya',
    'Teknologi Informasi dan Komunikasi (TIK)',
    'Antiradikalisme',
  ] as const;

  const aspectCounts: Record<string, number> = {};
  const globalBestSlotCounts: Record<'A' | 'B' | 'C' | 'D' | 'E', number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
  };
  const perAspectBestSlotCounts: Record<string, Record<'A' | 'B' | 'C' | 'D' | 'E', number>> = {};

  ALL_TKP.forEach((q, idx) => {
    const label = `TKP[${idx}] (${q.subtopik})`;
    aspectCounts[q.subtopik] = (aspectCounts[q.subtopik] ?? 0) + 1;
    globalBestSlotCounts[q.jawaban_benar]++;

    if (!perAspectBestSlotCounts[q.subtopik]) {
      perAspectBestSlotCounts[q.subtopik] = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    }
    perAspectBestSlotCounts[q.subtopik][q.jawaban_benar]++;

    assert.ok(
      q.pembahasan.includes('Skor 5 (Paling Ideal):'),
      `${label} missing Skor 5 (Paling Ideal) breakdown`
    );
    assert.ok(
      q.pembahasan.includes('Skor 4 (Sedikit di Bawahnya):'),
      `${label} missing Skor 4 (Sedikit di Bawahnya) breakdown`
    );
    assert.ok(
      q.pembahasan.includes('Gradasi Skor 3–1:'),
      `${label} missing Gradasi Skor 3–1 breakdown`
    );
  });

  assert.equal(
    Object.keys(aspectCounts).length,
    expectedAspects.length,
    `Expected exactly 5 TKP aspects, got: ${Object.keys(aspectCounts).join(', ')}`
  );

  for (const aspect of expectedAspects) {
    assert.equal(
      aspectCounts[aspect],
      75,
      `Aspect "${aspect}" must have exactly 75 questions, got ${aspectCounts[aspect] ?? 0}`
    );
    for (const slot of ['A', 'B', 'C', 'D', 'E'] as const) {
      assert.equal(
        perAspectBestSlotCounts[aspect][slot],
        15,
        `Aspect "${aspect}" slot ${slot} must have 15 score-5 answers, got ${perAspectBestSlotCounts[aspect][slot]}`
      );
    }
  }

  for (const slot of ['A', 'B', 'C', 'D', 'E'] as const) {
    assert.equal(
      globalBestSlotCounts[slot],
      75,
      `Global TKP slot ${slot} must have 75 score-5 answers, got ${globalBestSlotCounts[slot]}`
    );
  }
});

test('SKB IT banks each have 50 unique valid HOTS questions (200 total)', () => {
  assertValidCategoryBank('RPL', SKB_RPL_QUESTIONS, 50);
  assertValidCategoryBank('BASIS_DATA', SKB_BASIS_DATA_QUESTIONS, 50);
  assertValidCategoryBank('MANAJEMEN_DATA', SKB_MANAJEMEN_DATA_QUESTIONS, 50);
  assertValidCategoryBank('JARINGAN_DASAR', SKB_JARINGAN_QUESTIONS, 50);
  assert.equal(SKB_QUESTIONS.length, 200);
  for (const q of SKB_QUESTIONS) {
    assert.equal(q.exam_type, 'SKB');
  }
});

test('Combined SKD + SKB HOTS bank has 1,460 globally unique questions', () => {
  const all = [...ALL_TWK, ...ALL_TIU, ...ALL_TKP, ...SKB_QUESTIONS];
  assert.equal(all.length, 1460);
  const uniqueAll = new Set(all.map((q) => q.pertanyaan.trim()));
  assert.equal(uniqueAll.size, all.length, 'Global cross-category duplicate pertanyaan found');
});
