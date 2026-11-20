import type { SeedQuestion } from './types';
import { TIU_VERBAL_QUESTIONS } from './tiu_verbal';
import { TIU_NUMERIK_QUESTIONS } from './tiu_numerik';
import { TIU_FIGURAL_QUESTIONS } from './tiu_figural';

/**
 * 100 Soal Inti TIU HOTS Standar BKN (proporsional 30% Verbal, 43% Numerik, 27% Figural SVG)
 * Setiap soal dilengkapi Pembahasan Dua Metode (Langkah Sistematis + Trik Cepat/Eliminasi).
 */
export const TIU_QUESTIONS: SeedQuestion[] = [
  ...TIU_VERBAL_QUESTIONS.slice(0, 30),
  ...TIU_NUMERIK_QUESTIONS.slice(0, 43),
  ...TIU_FIGURAL_QUESTIONS.slice(0, 27),
];
