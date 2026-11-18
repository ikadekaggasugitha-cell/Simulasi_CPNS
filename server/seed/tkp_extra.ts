import type { SeedQuestion } from './types';
import { TKP_EXTRA_PART1 } from './tkp_extra_part1';
import { TKP_EXTRA_PART2 } from './tkp_extra_part2';
import { TKP_EXTRA_PART3 } from './tkp_extra_part3';

export const TKP_EXTRA_QUESTIONS: SeedQuestion[] = [
  ...TKP_EXTRA_PART1,
  ...TKP_EXTRA_PART2,
  ...TKP_EXTRA_PART3,
];
