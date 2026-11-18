import type { OptionKey, SeedQuestion } from './types';
import { PART1A_ITEMS } from './twk_extra_part1a';
import { PART1B_ITEMS } from './twk_extra_part1b';
import { PART1C_ITEMS } from './twk_extra_part1c';

export type RawTwkTuple = [
  subtopik: string,
  pertanyaan: string,
  benar: string,
  salah4: [string, string, string, string],
  pembahasan: string
];

export function buildTwkQuestions(items: RawTwkTuple[], seedOffset = 0): SeedQuestion[] {
  const keys: OptionKey[] = ['A', 'B', 'C', 'D', 'E'];
  return items.map(([subtopik, pertanyaan, benar, salah4, pembahasan], i) => {
    const correctIdx = (seedOffset + i * 3 + (pertanyaan.length % 5)) % 5;
    const opts: string[] = new Array(5);
    opts[correctIdx] = benar;
    let d = 0;
    for (let slot = 0; slot < 5; slot++) {
      if (slot !== correctIdx) {
        opts[slot] = salah4[d++];
      }
    }
    return {
      kategori: 'TWK',
      subtopik,
      pertanyaan,
      opsi_a: opts[0],
      opsi_b: opts[1],
      opsi_c: opts[2],
      opsi_d: opts[3],
      opsi_e: opts[4],
      jawaban_benar: keys[correctIdx],
      pembahasan,
    };
  });
}

export const TWK_EXTRA_PART1: SeedQuestion[] = buildTwkQuestions(
  [...PART1A_ITEMS, ...PART1B_ITEMS, ...PART1C_ITEMS],
  1
);
