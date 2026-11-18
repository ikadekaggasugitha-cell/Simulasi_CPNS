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
    deskripsi: 'Penalaran verbal, analitis, silogisme, deret angka, perbandingan kuantitatif, dan numerik HOTS.',
    urutan: 2,
  },
  {
    kode: 'TKP',
    exam_type: 'SKD',
    nama: 'Tes Karakteristik Pribadi',
    deskripsi: 'Pelayanan publik, jejaring kerja, sosial budaya, TIK, profesionalisme, dan anti-radikalisme (poin 1–5).',
    urutan: 3,
  },
  {
    kode: 'RPL',
    exam_type: 'SKB',
    nama: 'Rekayasa Perangkat Lunak',
    deskripsi: 'SDLC, Agile/DevOps, arsitektur sistem, desain pola, pengujian perangkat lunak, dan keamanan aplikasi.',
    urutan: 4,
  },
  {
    kode: 'BASIS_DATA',
    exam_type: 'SKB',
    nama: 'Basis Data',
    deskripsi: 'Normalisasi, pemodelan ERD, query SQL kompleks, indexing, transaksi ACID, replikasi, dan optimasi.',
    urutan: 5,
  },
  {
    kode: 'MANAJEMEN_DATA',
    exam_type: 'SKB',
    nama: 'Manajemen Data',
    deskripsi: 'Tata kelola data SPBE, Satu Data Indonesia, data warehouse, ETL/ELT, kualitas data, dan privasi PDP.',
    urutan: 6,
  },
  {
    kode: 'JARINGAN_DASAR',
    exam_type: 'SKB',
    nama: 'Jaringan Dasar',
    deskripsi: 'Model OSI/TCP-IP, subnetting CIDR, routing, VLAN, DNS/HTTP, firewall, VPN, dan keamanan jaringan.',
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
