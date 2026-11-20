import { buildTkpHotsBank } from './tkp_builder';
import { TKP_PELAYANAN_A } from './tkp_pelayanan_a';
import { TKP_PELAYANAN_B } from './tkp_pelayanan_b';
import type { SeedQuestion } from './types';

export const TKP_PELAYANAN_QUESTIONS: SeedQuestion[] = buildTkpHotsBank(
  'Pelayanan Publik',
  [...TKP_PELAYANAN_A, ...TKP_PELAYANAN_B],
  0
);
