import { buildTkpHotsBank } from './tkp_builder';
import { TKP_PROFESIONALISME_A } from './tkp_profesionalisme_a';
import { TKP_PROFESIONALISME_B } from './tkp_profesionalisme_b';
import type { SeedQuestion } from './types';

export const TKP_PROFESIONALISME_QUESTIONS: SeedQuestion[] = buildTkpHotsBank(
  'Profesionalisme',
  [...TKP_PROFESIONALISME_A, ...TKP_PROFESIONALISME_B],
  1
);
