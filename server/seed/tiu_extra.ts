import type { SeedQuestion } from './types';
import { TIU_VERBAL_QUESTIONS } from './tiu_verbal';
import { TIU_NUMERIK_QUESTIONS } from './tiu_numerik';
import { TIU_FIGURAL_QUESTIONS } from './tiu_figural';

/**
 * 400 Soal Tambahan TIU HOTS Standar BKN (120 Verbal, 172 Numerik, 108 Figural SVG)
 * Digabungkan dengan TIU_QUESTIONS (100 soal) = 500 Soal TIU HOTS Total.
 */
export const TIU_EXTRA_QUESTIONS: SeedQuestion[] = [
  ...TIU_VERBAL_QUESTIONS.slice(30),
  ...TIU_NUMERIK_QUESTIONS.slice(43),
  ...TIU_FIGURAL_QUESTIONS.slice(27),
];
