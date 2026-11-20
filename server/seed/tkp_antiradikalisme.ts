import { buildTkpHotsBank } from './tkp_builder';
import { TKP_ANTIRADIKALISME_A } from './tkp_antiradikalisme_a';
import { TKP_ANTIRADIKALISME_B } from './tkp_antiradikalisme_b';

export const TKP_ANTIRADIKALISME_QUESTIONS = buildTkpHotsBank(
  'Antiradikalisme',
  [...TKP_ANTIRADIKALISME_A, ...TKP_ANTIRADIKALISME_B],
  4
);
