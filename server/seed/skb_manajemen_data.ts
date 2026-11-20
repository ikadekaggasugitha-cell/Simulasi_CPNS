import type { SeedQuestion } from './types';
import { buildSkbHotsBank } from './skb_hots_builder';
import { SKB_MANAJEMEN_DATA_A } from './skb_manajemen_data_a';
import { SKB_MANAJEMEN_DATA_B } from './skb_manajemen_data_b';

export const SKB_MANAJEMEN_DATA_QUESTIONS: SeedQuestion[] = buildSkbHotsBank(
  'MANAJEMEN_DATA',
  [...SKB_MANAJEMEN_DATA_A, ...SKB_MANAJEMEN_DATA_B],
  3
);
