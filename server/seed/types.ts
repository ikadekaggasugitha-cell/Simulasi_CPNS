import type {
  ExamType,
  OptionKey,
  QuestionCategory,
  SkbCategory,
  TkpWeights,
} from '../../src/shared/types';
export type { ExamType, OptionKey, QuestionCategory, SkbCategory, TkpWeights };

export interface SeedQuestion {
  exam_type?: ExamType;
  kategori: QuestionCategory;
  subtopik: string;
  pertanyaan: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  opsi_e: string;
  jawaban_benar: OptionKey;
  bobot_tkp?: TkpWeights | null;
  pembahasan: string;
}

export type RawSkbTuple = [
  subtopik: string,
  pertanyaan: string,
  correctOption: string,
  distractors4: [string, string, string, string],
  pembahasan: string
];

const OPTION_KEYS: readonly OptionKey[] = ['A', 'B', 'C', 'D', 'E'] as const;

export function buildSkbQuestions(
  kategori: SkbCategory,
  items: readonly RawSkbTuple[],
  seedOffset = 0
): SeedQuestion[] {
  return items.map(([subtopik, pertanyaan, correct, wrong4, pembahasan], idx) => {
    const correctIndex = (idx * 3 + seedOffset) % 5;
    const slots: string[] = new Array(5);
    slots[correctIndex] = correct;

    let wIdx = 0;
    for (let i = 0; i < 5; i++) {
      if (i !== correctIndex) {
        slots[i] = wrong4[wIdx++];
      }
    }

    return {
      exam_type: 'SKB',
      kategori,
      subtopik,
      pertanyaan,
      opsi_a: slots[0],
      opsi_b: slots[1],
      opsi_c: slots[2],
      opsi_d: slots[3],
      opsi_e: slots[4],
      jawaban_benar: OPTION_KEYS[correctIndex],
      bobot_tkp: null,
      pembahasan,
    };
  });
}
