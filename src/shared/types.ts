export type ExamType = 'SKD' | 'SKB';
export type SessionMode = 'REAL' | 'PRACTICE';

export type SkdCategory = 'TWK' | 'TIU' | 'TKP';
export type SkbCategory = 'RPL' | 'BASIS_DATA' | 'MANAJEMEN_DATA' | 'JARINGAN_DASAR';
export type QuestionCategory = SkdCategory | SkbCategory;

export type OptionKey = 'A' | 'B' | 'C' | 'D' | 'E';

export type TimeMode = 'TIMED' | 'UNTIMED';

export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED';

export type AnswerStatus = 'BENAR' | 'SALAH' | 'KOSONG';

export type TkpWeights = Record<OptionKey, number>;

export type PracticeQuantityOption = 20 | 50 | 75;

export interface CategoryMeta {
  kode: QuestionCategory;
  exam_type: ExamType;
  nama: string;
  deskripsi: string;
  urutan: number;
}

export interface QuestionRecord {
  id: number;
  exam_type: ExamType;
  kategori: QuestionCategory;
  subtopik: string;
  pertanyaan: string;
  opsi_a: string;
  opsi_b: string;
  opsi_c: string;
  opsi_d: string;
  opsi_e: string;
  jawaban_benar: OptionKey;
  bobot_tkp: TkpWeights | null;
  pembahasan: string;
}

export interface DisplayedOption {
  label: OptionKey;
  originalKey: OptionKey;
  text: string;
  bobot?: number;
}

export interface ExamQuestionItem {
  answerId: number;
  questionId: number;
  urutan: number;
  exam_type: ExamType;
  kategori: QuestionCategory;
  subtopik: string;
  pertanyaan: string;
  options: DisplayedOption[];
  selectedLabel: OptionKey | null;
  ditandai: boolean;
  correctLabel?: OptionKey;
  pembahasan?: string;
  status?: AnswerStatus;
  poin?: number;
}

export interface PassingThresholds {
  twk: number;
  tiu: number;
  tkp: number;
  maxTwk: number;
  maxTiu: number;
  maxTkp: number;
}

export interface CategoryScoreBreakdown {
  kategori: QuestionCategory;
  nama: string;
  skor: number;
  skorMaksimal: number;
  benar: number;
  salah: number;
  kosong: number;
  totalSoal: number;
  persentase: number;
  passingGrade?: number;
  lulus?: boolean;
}

export interface SessionSummary {
  id: number;
  exam_type: ExamType;
  session_mode: SessionMode;
  session_number: number;
  nama_sesi: string;
  mode_waktu: TimeMode;
  paket_soal: string;
  jumlah_per_kategori: number;
  total_soal: number;
  batas_waktu_detik: number | null;
  durasi_pengerjaan_detik: number;
  status: SessionStatus;
  skor_twk: number;
  skor_tiu: number;
  skor_tkp: number;
  skor_total: number;
  skor_maksimal: number;
  persentase_total: number;
  lulus_passing_grade: boolean;
  breakdown_skor: CategoryScoreBreakdown[];
  topik_rekomendasi: string[];
  created_at: string;
  completed_at: string | null;
  passing_thresholds: PassingThresholds | null;
}

export interface SessionDetailResponse {
  session: SessionSummary;
  items: ExamQuestionItem[];
}

export interface HintResponse {
  questionId: number;
  exam_type: ExamType;
  kategori: QuestionCategory;
  subtopik: string;
  correctLabel: OptionKey;
  correctText: string;
  pembahasan: string;
  weightsByLabel?: Array<{ label: OptionKey; text: string; poin: number }>;
}

export interface CreateSkdSessionPayload {
  sessionMode: SessionMode;
  totalSoal?: PracticeQuantityOption;
  modeWaktu?: TimeMode;
}

export interface CreateSkbSessionPayload {
  sessionMode: SessionMode;
  totalSoal?: PracticeQuantityOption;
  modeWaktu?: TimeMode;
}

export interface QuestionBankStats {
  total: number;
  skdTotal: number;
  skbTotal: number;
  byCategory: Record<QuestionCategory, number>;
}
