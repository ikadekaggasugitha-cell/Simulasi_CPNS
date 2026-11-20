import { buildTkpHotsBank } from './tkp_builder';
import { TKP_TIK_A } from './tkp_tik_a';
import { TKP_TIK_B } from './tkp_tik_b';

export const TKP_TIK_QUESTIONS = buildTkpHotsBank(
  'Teknologi Informasi dan Komunikasi (TIK)',
  [...TKP_TIK_A, ...TKP_TIK_B],
  3
);
