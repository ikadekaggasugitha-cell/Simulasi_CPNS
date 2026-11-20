import type { OptionKey, SeedQuestion, SkbCategory } from './types';

export type CognitiveLevel = 'C4' | 'C5' | 'C6';

export interface SkbHotsItem {
  level: CognitiveLevel;
  topik: string;
  pertanyaan: string;
  jawabanBenar: string;
  pengecoh4: [string, string, string, string];
  akarMasalah: string;
  solusiTerbaik: string;
  analisisPengecoh: string;
}

const OPTION_KEYS: readonly OptionKey[] = ['A', 'B', 'C', 'D', 'E'] as const;

/**
 * 25 balanced permutations placing index 0 (correct option) exactly once per A-E
 * in every contiguous block of 5 questions, ensuring exact 10/10/10/10/10 parity
 * across every 50-question SKB IT bank.
 */
const SKB_BALANCED_PERMS: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [0, 1, 2, 3, 4],
  [2, 0, 4, 1, 3],
  [3, 4, 0, 2, 1],
  [4, 2, 1, 0, 3],
  [1, 3, 4, 2, 0],
  [1, 2, 0, 4, 3],
  [3, 1, 4, 2, 0],
  [0, 4, 3, 1, 2],
  [2, 3, 1, 0, 4],
  [4, 0, 2, 3, 1],
  [2, 4, 1, 3, 0],
  [1, 3, 2, 0, 4],
  [4, 0, 3, 1, 2],
  [0, 2, 4, 3, 1],
  [3, 1, 0, 4, 2],
  [4, 1, 3, 2, 0],
  [0, 3, 2, 4, 1],
  [1, 4, 0, 3, 2],
  [2, 0, 1, 4, 3],
  [3, 2, 4, 0, 1],
  [3, 2, 1, 0, 4],
  [4, 3, 0, 1, 2],
  [1, 0, 4, 2, 3],
  [2, 4, 3, 1, 0],
  [0, 1, 3, 4, 2],
];

export function buildSkbHotsBank(
  kategori: SkbCategory,
  items: readonly SkbHotsItem[],
  permBlockOffset = 0
): SeedQuestion[] {
  return items.map((item, idx) => {
    const perm = SKB_BALANCED_PERMS[(permBlockOffset * 5 + idx) % SKB_BALANCED_PERMS.length];
    const pool: readonly string[] = [
      item.jawabanBenar,
      item.pengecoh4[0],
      item.pengecoh4[1],
      item.pengecoh4[2],
      item.pengecoh4[3],
    ];
    const opts = perm.map((srcIdx) => pool[srcIdx]);
    const bestSlot = perm.indexOf(0);

    const pembahasan = [
      `Akar Masalah: ${item.akarMasalah}`,
      `Solusi Terbaik: ${item.solusiTerbaik}`,
      `Analisis Opsi Pengecoh: ${item.analisisPengecoh}`,
    ].join('\n');

    return {
      exam_type: 'SKB',
      kategori,
      subtopik: `[${item.level}] ${item.topik}`,
      pertanyaan: item.pertanyaan,
      opsi_a: opts[0],
      opsi_b: opts[1],
      opsi_c: opts[2],
      opsi_d: opts[3],
      opsi_e: opts[4],
      jawaban_benar: OPTION_KEYS[bestSlot],
      bobot_tkp: null,
      pembahasan,
    };
  });
}
