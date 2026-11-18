import type { SeedQuestion } from './types';
import { SKB_RPL_QUESTIONS } from './skb_rpl';
import { SKB_BASIS_DATA_QUESTIONS } from './skb_basis_data';
import { SKB_MANAJEMEN_DATA_QUESTIONS } from './skb_manajemen_data';
import { SKB_JARINGAN_QUESTIONS } from './skb_jaringan';

export const SKB_QUESTIONS: SeedQuestion[] = [
  ...SKB_RPL_QUESTIONS,
  ...SKB_BASIS_DATA_QUESTIONS,
  ...SKB_MANAJEMEN_DATA_QUESTIONS,
  ...SKB_JARINGAN_QUESTIONS,
];
