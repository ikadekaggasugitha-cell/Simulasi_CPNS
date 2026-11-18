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

test('TIU bank has at least 500 unique valid HOTS questions', () => {
  assertValidCategoryBank('TIU', ALL_TIU, 500);
});

test('TKP bank has at least 375 unique valid HOTS questions with 1-5 weights', () => {
  assertValidCategoryBank('TKP', ALL_TKP, 375);
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
