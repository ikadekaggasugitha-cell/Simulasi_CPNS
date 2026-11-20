import type { SeedQuestion } from './types';
import { TKP_PROFESIONALISME_QUESTIONS } from './tkp_profesionalisme';
import { TKP_JEJARING_SOSBUD_QUESTIONS } from './tkp_jejaring_sosbud';
import { TKP_TIK_QUESTIONS } from './tkp_tik';
import { TKP_ANTIRADIKALISME_QUESTIONS } from './tkp_antiradikalisme';

// 300 HOTS TKP Questions across Profesionalisme (75), Jejaring Kerja & Sosial Budaya (75),
// Teknologi Informasi dan Komunikasi (TIK) (75), and Antiradikalisme (75).
export const TKP_EXTRA_QUESTIONS: SeedQuestion[] = [
  ...TKP_PROFESIONALISME_QUESTIONS,
  ...TKP_JEJARING_SOSBUD_QUESTIONS,
  ...TKP_TIK_QUESTIONS,
  ...TKP_ANTIRADIKALISME_QUESTIONS,
];
