import type { SeedQuestion } from './types';
import { buildSkbHotsBank } from './skb_hots_builder';
import { SKB_JARINGAN_A } from './skb_jaringan_a';
import { SKB_JARINGAN_B } from './skb_jaringan_b';

export const SKB_JARINGAN_QUESTIONS: SeedQuestion[] = buildSkbHotsBank(
  'JARINGAN_DASAR',
  [...SKB_JARINGAN_A, ...SKB_JARINGAN_B],
  2
);
