import type { SeedQuestion } from './types';
import { buildTwkQuestions } from './twk_extra_part1';
import { PART2A_ITEMS } from './twk_extra_part2a';
import { PART2B_ITEMS } from './twk_extra_part2b';
import { PART2C_ITEMS } from './twk_extra_part2c';

export const TWK_EXTRA_PART2: SeedQuestion[] = buildTwkQuestions(
  [...PART2A_ITEMS, ...PART2B_ITEMS, ...PART2C_ITEMS],
  3
);
