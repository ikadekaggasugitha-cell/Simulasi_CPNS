import type { OptionKey, SeedQuestion, TkpWeights } from './types';

export type TkpAspect =
  | 'Pelayanan Publik'
  | 'Profesionalisme'
  | 'Jejaring Kerja & Sosial Budaya'
  | 'Teknologi Informasi dan Komunikasi (TIK)'
  | 'Antiradikalisme';

export interface TkpHotsItem {
  pertanyaan: string;
  /** Strictly ordered from score 5 (most ideal) down to score 1 (least ideal, yet still plausible). */
  opsi5Ke1: [string, string, string, string, string];
  alasan5: string;
  alasan4: string;
  gradasi31: string;
}

const OPTION_KEYS: readonly OptionKey[] = ['A', 'B', 'C', 'D', 'E'];

/**
 * 25 balanced permutations where every contiguous block of 5 places rank 0 (score 5)
 * exactly once in slots A, B, C, D, E while thoroughly varying slots for scores 4..1.
 */
const BALANCED_PERMS: ReadonlyArray<readonly [number, number, number, number, number]> = [
  // Block 0: best at A, B, C, D, E
  [0, 2, 4, 1, 3],
  [3, 0, 1, 4, 2],
  [2, 4, 0, 3, 1],
  [4, 1, 3, 0, 2],
  [1, 3, 2, 4, 0],
  // Block 1: best at C, E, A, D, B
  [3, 1, 0, 2, 4],
  [2, 4, 3, 1, 0],
  [0, 4, 2, 3, 1],
  [1, 2, 4, 0, 3],
  [4, 0, 1, 3, 2],
  // Block 2: best at E, D, B, A, C
  [2, 1, 4, 3, 0],
  [1, 4, 2, 0, 3],
  [3, 0, 4, 2, 1],
  [0, 3, 1, 4, 2],
  [4, 2, 0, 1, 3],
  // Block 3: best at B, A, E, C, D
  [1, 0, 3, 2, 4],
  [0, 1, 4, 3, 2],
  [3, 2, 1, 4, 0],
  [4, 3, 0, 2, 1],
  [2, 4, 1, 0, 3],
  // Block 4: best at D, C, E, B, A
  [2, 3, 1, 0, 4],
  [1, 4, 0, 3, 2],
  [4, 1, 2, 3, 0],
  [3, 0, 2, 4, 1],
  [0, 2, 3, 1, 4],
];

export function buildTkpHotsBank(
  aspect: TkpAspect,
  items: readonly TkpHotsItem[],
  permBlockOffset = 0
): SeedQuestion[] {
  return items.map((item, idx) => {
    const permIndex = (permBlockOffset * 5 + idx) % BALANCED_PERMS.length;
    const perm = BALANCED_PERMS[permIndex];

    const opts = perm.map((rankIdx) => item.opsi5Ke1[rankIdx]);
    const weights: TkpWeights = {
      A: 5 - perm[0],
      B: 5 - perm[1],
      C: 5 - perm[2],
      D: 5 - perm[3],
      E: 5 - perm[4],
    };

    const bestSlot = perm.indexOf(0);
    const pembahasan = [
      `Skor 5 (Paling Ideal): ${item.alasan5}`,
      `Skor 4 (Sedikit di Bawahnya): ${item.alasan4}`,
      `Gradasi Skor 3–1: ${item.gradasi31}`,
    ].join('\n');

    return {
      kategori: 'TKP',
      subtopik: aspect,
      pertanyaan: item.pertanyaan,
      opsi_a: opts[0],
      opsi_b: opts[1],
      opsi_c: opts[2],
      opsi_d: opts[3],
      opsi_e: opts[4],
      jawaban_benar: OPTION_KEYS[bestSlot],
      bobot_tkp: weights,
      pembahasan,
    };
  });
}
