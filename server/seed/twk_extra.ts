import type { SeedQuestion } from './types';
import { TWK_EXTRA_PART1 } from './twk_extra_part1';
import { TWK_EXTRA_PART2 } from './twk_extra_part2';
import { TWK_EXTRA_PART3 } from './twk_extra_part3';

export const TWK_EXTRA_QUESTIONS: SeedQuestion[] = [
  ...TWK_EXTRA_PART1,
  ...TWK_EXTRA_PART2,
  ...TWK_EXTRA_PART3,
];
