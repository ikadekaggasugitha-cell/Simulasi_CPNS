import type { SeedQuestion } from './types';
import { TKP_PELAYANAN_QUESTIONS } from './tkp_pelayanan';

// 75 HOTS TKP Questions — Aspect 1: Pelayanan Publik
// Paired with TKP_EXTRA_QUESTIONS (300 questions across 4 other aspects) = 375 total HOTS TKP questions.
export const TKP_QUESTIONS: SeedQuestion[] = [...TKP_PELAYANAN_QUESTIONS];
