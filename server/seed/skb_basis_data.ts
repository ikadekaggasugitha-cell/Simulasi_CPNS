import { buildSkbHotsBank } from './skb_hots_builder';
import { SKB_BASIS_DATA_A } from './skb_basis_data_a';
import { SKB_BASIS_DATA_B } from './skb_basis_data_b';

export const SKB_BASIS_DATA_QUESTIONS = buildSkbHotsBank(
  'BASIS_DATA',
  [...SKB_BASIS_DATA_A, ...SKB_BASIS_DATA_B],
  0
);
