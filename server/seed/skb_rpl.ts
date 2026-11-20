import type { SeedQuestion } from './types';
import { buildSkbHotsBank } from './skb_hots_builder';
import { SKB_RPL_A } from './skb_rpl_a';
import { SKB_RPL_B } from './skb_rpl_b';

export const SKB_RPL_QUESTIONS: SeedQuestion[] = buildSkbHotsBank(
  'RPL',
  [...SKB_RPL_A, ...SKB_RPL_B],
  1
);
