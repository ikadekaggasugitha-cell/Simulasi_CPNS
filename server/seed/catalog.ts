import { TWK_QUESTIONS } from './twk';
import { TIU_QUESTIONS } from './tiu';
import { TKP_QUESTIONS } from './tkp';
import { TWK_EXTRA_QUESTIONS } from './twk_extra';
import { TWK_HOTS_BATCH_1 } from './twk_hots_batch1';
import { TIU_EXTRA_QUESTIONS } from './tiu_extra';
import { TKP_EXTRA_QUESTIONS } from './tkp_extra';
import { SKB_QUESTIONS } from './skb';
import type { SeedQuestion } from './types';
import type { CategoryMeta, ExamType, QuestionRecord } from '../../src/shared/types';

export const SEED_CATEGORIES: CategoryMeta[] = [
  {
    kode: 'TWK',
    exam_type: 'SKD',
    nama: 'Tes Wawasan Kebangsaan',
    deskripsi: 'Pancasila, UUD 1945, NKRI, Bhinneka Tunggal Ika, Nasionalisme, Integritas, dan Bela Negara.',
    urutan: 1,
  },
  {
    kode: 'TIU',
    exam_type: 'SKD',
    nama: 'Tes Intelegensia Umum',
    deskripsi: 'Verbal (analogi, silogisme, bacaan), Numerik (berhitung cepat, deret HOTS, perbandingan X vs Y, cerita), dan Figural SVG.',
    urutan: 2,
  },
  {
    kode: 'TKP',
    exam_type: 'SKD',
    nama: 'Tes Karakteristik Pribadi',
    deskripsi: 'Pelayanan Publik, Profesionalisme, Jejaring Kerja & Sosial Budaya, TIK, dan Antiradikalisme (bobot skor 1–5).',
    urutan: 3,
  },
  {
    kode: 'RPL',
    exam_type: 'SKB',
    nama: 'Rekayasa Perangkat Lunak',
    deskripsi: 'HOTS C4–C6: Debugging kode, arsitektur sistem (caching, MQ, microservices), desain API, pengujian/SDLC, & keamanan aplikasi (OWASP Top 10, IAM).',
    urutan: 4,
  },
  {
    kode: 'BASIS_DATA',
    exam_type: 'SKB',
    nama: 'Basis Data',
    deskripsi: 'HOTS C4–C6: Optimasi query (indexing, execution plan), normalisasi/denormalisasi, transaksi ACID, locking/concurrency, & integritas/keamanan data.',
    urutan: 5,
  },
  {
    kode: 'MANAJEMEN_DATA',
    exam_type: 'SKB',
    nama: 'Manajemen Data',
    deskripsi: 'HOTS C4–C6: Tata kelola TI & regulasi (SPBE Perpres 95/2018, UU PDP 27/2022, Satu Data), manajemen risiko TI, audit trail, DWH/ELT, & kualitas data.',
    urutan: 6,
  },
  {
    kode: 'JARINGAN_DASAR',
    exam_type: 'SKB',
    nama: 'Jaringan Dasar',
    deskripsi: 'HOTS C4–C6: Troubleshooting log OSI/TCP-IP, DNS, VLAN/STP, routing OSPF/BGP, VLSM/CIDR, HA/load balancing, keamanan siber, kriptografi, & Zero Trust.',
    urutan: 7,
  },
];

export function inferExamType(item: SeedQuestion): ExamType {
  if (item.exam_type) return item.exam_type;
  if (item.kategori === 'TWK' || item.kategori === 'TIU' || item.kategori === 'TKP') {
    return 'SKD';
  }
  return 'SKB';
}

export function getAllSeedQuestions(): SeedQuestion[] {
  return [
    ...TWK_QUESTIONS.map((q) => ({ ...q, exam_type: 'SKD' as const })),
    ...TIU_QUESTIONS.map((q) => ({ ...q, exam_type: 'SKD' as const })),
    ...TKP_QUESTIONS.map((q) => ({ ...q, exam_type: 'SKD' as const })),
    ...TWK_EXTRA_QUESTIONS.map((q) => ({ ...q, exam_type: 'SKD' as const })),
    ...TIU_EXTRA_QUESTIONS.map((q) => ({ ...q, exam_type: 'SKD' as const })),
    ...TKP_EXTRA_QUESTIONS.map((q) => ({ ...q, exam_type: 'SKD' as const })),
    ...SKB_QUESTIONS.map((q) => ({ ...q, exam_type: 'SKB' as const })),
    ...TWK_HOTS_BATCH_1.map((q) => ({ ...q, exam_type: 'SKD' as const })),
  ];
}

export function getSeedQuestionRecords(): QuestionRecord[] {
  return getAllSeedQuestions().map((item, idx) => ({
    id: idx + 1,
    exam_type: inferExamType(item),
    kategori: item.kategori,
    subtopik: item.subtopik,
    pertanyaan: item.pertanyaan,
    opsi_a: item.opsi_a,
    opsi_b: item.opsi_b,
    opsi_c: item.opsi_c,
    opsi_d: item.opsi_d,
    opsi_e: item.opsi_e,
    jawaban_benar: item.jawaban_benar,
    bobot_tkp: item.bobot_tkp ?? null,
    pembahasan: item.pembahasan,
  }));
}
