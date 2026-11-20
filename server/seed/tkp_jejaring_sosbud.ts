import { buildTkpHotsBank } from './tkp_builder';
import { TKP_JEJARING_SOSBUD_A } from './tkp_jejaring_sosbud_a';
import { TKP_JEJARING_SOSBUD_B } from './tkp_jejaring_sosbud_b';
import type { SeedQuestion } from './types';

export const TKP_JEJARING_SOSBUD_QUESTIONS: SeedQuestion[] = buildTkpHotsBank(
  'Jejaring Kerja & Sosial Budaya',
  [...TKP_JEJARING_SOSBUD_A, ...TKP_JEJARING_SOSBUD_B],
  2
);
