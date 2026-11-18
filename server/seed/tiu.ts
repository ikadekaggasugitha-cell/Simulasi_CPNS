import type { SeedQuestion } from './types';

export const TIU_QUESTIONS: SeedQuestion[] = [
  // === 1. DERET ANGKA HOTS (25 SOAL) ===
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan dua suku berikutnya pada deret berikut: 4, 7, 13, 25, 49, ..., ...',
    opsi_a: '95, 189',
    opsi_b: '97, 193',
    opsi_c: '96, 190',
    opsi_d: '98, 195',
    opsi_e: '94, 187',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Hitung selisih antarsuku berurutan: 7 - 4 = 3, 13 - 7 = 6, 25 - 13 = 12, 49 - 25 = 24.\nLangkah 2: Pola selisih dikali 2 setiap langkah (3, 6, 12, 24, 48, 96) atau rumus rekursif Un = 2 × U(n-1) - 1.\nLangkah 3: Suku ke-6 = 49 + 48 = 97. Suku ke-7 = 97 + 96 = 193. Jadi jawabannya adalah 97, 193.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Perhatikan pola barisan bilangan: 3, 5, 8, 13, 21, 34, ..., ... Nilai dua suku selanjutnya adalah...',
    opsi_a: '55, 89',
    opsi_b: '52, 84',
    opsi_c: '54, 88',
    opsi_d: '56, 90',
    opsi_e: '53, 87',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Cek penjumlahan dua suku sebelumnya (deret Fibonacci): 3 + 5 = 8, 5 + 8 = 13, 8 + 13 = 21, 13 + 21 = 34.\nLangkah 2: Suku ke-7 = 21 + 34 = 55.\nLangkah 3: Suku ke-8 = 34 + 55 = 89. Jadi jawabannya adalah 55, 89.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan angka yang tepat untuk melengkapi deret dua larik: 12, 45, 18, 41, 24, 37, 30, ..., ...',
    opsi_a: '33, 36',
    opsi_b: '34, 35',
    opsi_c: '33, 35',
    opsi_d: '32, 36',
    opsi_e: '35, 38',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Pisahkan menjadi dua larik selang-seling.\nLarik ganjil (suku 1, 3, 5, 7, 9): 12, 18, 24, 30, ... (+6 tiap langkah) -> suku ke-9 = 30 + 6 = 36.\nLarik genap (suku 2, 4, 6, 8): 45, 41, 37, ... (-4 tiap langkah) -> suku ke-8 = 37 - 4 = 33.\nLangkah 2: Urutan suku ke-8 dan ke-9 adalah 33, 36.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan bilangan selanjutnya pada deret bertingkat berikut: 2, 6, 15, 31, 56, ...',
    opsi_a: '88',
    opsi_b: '90',
    opsi_c: '92',
    opsi_d: '94',
    opsi_e: '96',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Hitung selisih antarsuku: 6 - 2 = 4, 15 - 6 = 9, 31 - 15 = 16, 56 - 31 = 25.\nLangkah 2: Perhatikan bahwa selisihnya merupakan bilangan kuadrat berurutan: 2², 3², 4², 5².\nLangkah 3: Selisih berikutnya adalah 6² = 36, sehingga suku ke-6 = 56 + 36 = 92.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Carilah nilai X dan Y pada deret: 5, 10, 8, 16, 14, 28, X, Y',
    opsi_a: '26, 52',
    opsi_b: '24, 48',
    opsi_c: '30, 60',
    opsi_d: '25, 50',
    opsi_e: '26, 24',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Amati operasi bergantian pada setiap pasangan: 5 (×2) -> 10 (-2) -> 8 (×2) -> 16 (-2) -> 14 (×2) -> 28.\nLangkah 2: Operasi selanjutnya adalah -2 lalu ×2.\nLangkah 3: X = 28 - 2 = 26, dan Y = 26 × 2 = 52.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan dua suku berikutnya: 0, 6, 24, 60, 120, ..., ... Nilai suku ke-6 dan ke-7 berturut-turut adalah...',
    opsi_a: '210, 336',
    opsi_b: '216, 343',
    opsi_c: '180, 252',
    opsi_d: '200, 320',
    opsi_e: '210, 320',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Uji pola pangkat tiga bergeser (n³ - n): n=1 -> 1³-1=0; n=2 -> 2³-2=6; n=3 -> 3³-3=24; n=4 -> 4³-4=60; n=5 -> 5³-5=120.\nLangkah 2: Suku ke-6 (n=6) = 6³ - 6 = 216 - 6 = 210.\nLangkah 3: Suku ke-7 (n=7) = 7³ - 7 = 343 - 7 = 336.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Lengkapi deret tiga larik berikut: 3, 100, 5, 6, 90, 10, 12, 80, 15, ..., ..., ...',
    opsi_a: '24, 70, 20',
    opsi_b: '18, 70, 20',
    opsi_c: '24, 75, 25',
    opsi_d: '21, 70, 20',
    opsi_e: '24, 65, 20',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Kelompokkan menjadi 3 larik (indeks mod 3):\n- Larik 1 (suku 1, 4, 7, 10): 3, 6, 12, ... (pola ×2) -> suku ke-10 = 12 × 2 = 24.\n- Larik 2 (suku 2, 5, 8, 11): 100, 90, 80, ... (pola -10) -> suku ke-11 = 80 - 10 = 70.\n- Larik 3 (suku 3, 6, 9, 12): 5, 10, 15, ... (pola +5) -> suku ke-12 = 15 + 5 = 20.\nLangkah 2: Tiga angka berturut-turut adalah 24, 70, 20.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan angka berikutnya pada deret pecahan: 1/2, 3/4, 5/8, 7/16, 9/32, ...',
    opsi_a: '11/48',
    opsi_b: '11/64',
    opsi_c: '13/64',
    opsi_d: '10/64',
    opsi_e: '11/36',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Pisahkan pola pembilang dan penyebut.\nPembilang: 1, 3, 5, 7, 9 -> bilangan ganjil (+2), berikutnya 11.\nPenyebut: 2, 4, 8, 16, 32 -> pola ×2, berikutnya 32 × 2 = 64.\nLangkah 2: Suku ke-6 adalah 11/64.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan suku yang hilang: 2, 3, 5, 9, 17, ..., 65',
    opsi_a: '31',
    opsi_b: '33',
    opsi_c: '34',
    opsi_d: '35',
    opsi_e: '29',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Hitung selisih antarsuku: 3 - 2 = 1, 5 - 3 = 2, 9 - 5 = 4, 17 - 9 = 8.\nLangkah 2: Selisih membentuk barisan geometri ×2 (1, 2, 4, 8, 16, 32).\nLangkah 3: Suku ke-6 = 17 + 16 = 33. Cek suku ke-7: 33 + 32 = 65 (cocok!).',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Diberikan deret: 120, 120, 60, 20, 5, ... Angka berikutnya adalah...',
    opsi_a: '1',
    opsi_b: '2',
    opsi_c: '0,5',
    opsi_d: '2,5',
    opsi_e: '0',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Perhatikan rasio pembagian antarsuku: 120 ÷ 1 = 120, 120 ÷ 2 = 60, 60 ÷ 3 = 20, 20 ÷ 4 = 5.\nLangkah 2: Pembagi bertambah 1 setiap langkah (÷1, ÷2, ÷3, ÷4, ÷5).\nLangkah 3: Suku ke-6 = 5 ÷ 5 = 1.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Temukan nilai yang tepat untuk mengisi titik-titik: 7, 9, 13, 21, 37, ..., 133',
    opsi_a: '65',
    opsi_b: '69',
    opsi_c: '71',
    opsi_d: '73',
    opsi_e: '67',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Cari selisih berurutan: 9-7=2, 13-9=4, 21-13=8, 37-21=16.\nLangkah 2: Selisih adalah 2¹, 2², 2³, 2⁴, sehingga selisih berikutnya adalah 2⁵ = 32.\nLangkah 3: 37 + 32 = 69. Cek berikutnya: 69 + 64 = 133 (tepat!).',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Perhatikan deret bertingkat tiga: 1, 4, 10, 20, 35, 56, ... Suku ke-7 adalah...',
    opsi_a: '80',
    opsi_b: '82',
    opsi_c: '84',
    opsi_d: '86',
    opsi_e: '88',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Selisih tingkat 1: 3, 6, 10, 15, 21.\nLangkah 2: Selisih tingkat 2: 3, 4, 5, 6 (bertambah +1).\nLangkah 3: Selisih tingkat 2 berikutnya = 7, sehingga selisih tingkat 1 berikutnya = 21 + 7 = 28.\nLangkah 4: Suku ke-7 = 56 + 28 = 84 (bilangan tetrahedral).',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan dua suku selanjutnya pada deret: 81, 27, 9, 3, 1, ..., ...',
    opsi_a: '1/3, 1/9',
    opsi_b: '0, -1',
    opsi_c: '1/2, 1/4',
    opsi_d: '1/3, 1/6',
    opsi_e: '2/3, 1/3',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Cek rasio antarsuku: 27/81 = 1/3, 9/27 = 1/3, 3/9 = 1/3, 1/3 = 1/3.\nLangkah 2: Setiap suku dibagi 3. Suku ke-6 = 1 ÷ 3 = 1/3, suku ke-7 = (1/3) ÷ 3 = 1/9.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Diketahui deret Fibonacci variasi: 2, 3, 6, 10, 17, 28, ... Bilangan selanjutnya adalah...',
    opsi_a: '44',
    opsi_b: '45',
    opsi_c: '46',
    opsi_d: '47',
    opsi_e: '48',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Uji penjumlahan dua suku sebelumnya ditambah konstanta: 2 + 3 + 1 = 6; 3 + 6 + 1 = 10; 6 + 10 + 1 = 17; 10 + 17 + 1 = 28.\nLangkah 2: Polanya adalah U(n) = U(n-1) + U(n-2) + 1.\nLangkah 3: Suku ke-7 = 17 + 28 + 1 = 46.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan nilai yang menggantikan tanda tanya: 4, 8, 11, 22, 25, 50, ?, ?',
    opsi_a: '53, 106',
    opsi_b: '52, 104',
    opsi_c: '55, 110',
    opsi_d: '53, 56',
    opsi_e: '54, 108',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Pola operasi bergantian: 4 (×2) -> 8 (+3) -> 11 (×2) -> 22 (+3) -> 25 (×2) -> 50.\nLangkah 2: Langkah berikutnya adalah +3 lalu ×2.\nLangkah 3: 50 + 3 = 53, dan 53 × 2 = 106.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Perhatikan deret: 11, 13, 17, 23, 31, 41, ... Angka berikutnya adalah...',
    opsi_a: '51',
    opsi_b: '53',
    opsi_c: '55',
    opsi_d: '52',
    opsi_e: '54',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Hitung beda tingkat 1: 13-11=2, 17-13=4, 23-17=6, 31-23=8, 41-31=10.\nLangkah 2: Beda bertambah +2 (bilangan genap berurutan). Beda berikutnya = 12.\nLangkah 3: 41 + 12 = 53.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Carilah satu bilangan yang TIDAK mengikuti pola pada barisan: 3, 6, 12, 24, 46, 96, 192',
    opsi_a: '12',
    opsi_b: '24',
    opsi_c: '46',
    opsi_d: '96',
    opsi_e: '192',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Pola dasar barisan adalah ×2 setiap langkah: 3, 6, 12, 24, 48, 96, 192.\nLangkah 2: Suku ke-5 tertulis 46, seharusnya 24 × 2 = 48 (dan 48 × 2 = 96 cocok dengan suku berikutnya). Jadi 46 adalah bilangan yang salah.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan suku berikutnya: 1, 4, 2, 8, 4, 16, 8, ...',
    opsi_a: '24',
    opsi_b: '32',
    opsi_c: '12',
    opsi_d: '64',
    opsi_e: '16',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Pisahkan dua larik.\nLarik ganjil: 1, 2, 4, 8 (×2).\nLarik genap: 4, 8, 16, ... (×2).\nLangkah 2: Suku ke-8 berada pada larik genap = 16 × 2 = 32.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan dua bilangan berikutnya pada deret: 2, 5, 11, 23, 47, ..., ...',
    opsi_a: '95, 191',
    opsi_b: '94, 189',
    opsi_c: '93, 187',
    opsi_d: '96, 193',
    opsi_e: '95, 190',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Cek hubungan suku berurutan: 2×2+1=5, 5×2+1=11, 11×2+1=23, 23×2+1=47.\nLangkah 2: Suku ke-6 = 47×2+1 = 95.\nLangkah 3: Suku ke-7 = 95×2+1 = 191.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Lengkapi deret desimal berikut: 0,5; 1,5; 4,5; 13,5; 40,5; ...',
    opsi_a: '120,5',
    opsi_b: '121,5',
    opsi_c: '122,5',
    opsi_d: '81,0',
    opsi_e: '101,5',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Perhatikan rasio perkalian: 0,5 × 3 = 1,5; 1,5 × 3 = 4,5; 4,5 × 3 = 13,5; 13,5 × 3 = 40,5.\nLangkah 2: Suku ke-6 = 40,5 × 3 = 121,5.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan angka pada posisi tengah yang hilang: 100, 96, 88, 76, ..., 40, 16',
    opsi_a: '64',
    opsi_b: '62',
    opsi_c: '60',
    opsi_d: '58',
    opsi_e: '56',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Hitung pengurangan berurutan: 100-96=4, 96-88=8, 88-76=12.\nLangkah 2: Pengurang bertambah +4 tiap langkah (-4, -8, -12, -16, -20, -24).\nLangkah 3: Suku ke-5 = 76 - 16 = 60. Cek: 60 - 20 = 40, 40 - 24 = 16 (cocok!).',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan suku ke-7 dari deret berikut: 1, 3, 7, 15, 31, 63, ...',
    opsi_a: '125',
    opsi_b: '126',
    opsi_c: '127',
    opsi_d: '128',
    opsi_e: '129',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Setiap suku memenuhi Un = 2^n - 1 (atau 2 × U(n-1) + 1).\nLangkah 2: 63 × 2 + 1 = 127 (juga 2⁷ - 1 = 128 - 1 = 127).',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Lengkapi deret campuran berikut: 5, 7, 14, 16, 32, 34, ..., ...',
    opsi_a: '68, 70',
    opsi_b: '66, 68',
    opsi_c: '36, 72',
    opsi_d: '68, 72',
    opsi_e: '64, 66',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Pola operasi bergantian (+2, ×2): 5 (+2)-> 7 (×2)-> 14 (+2)-> 16 (×2)-> 32 (+2)-> 34.\nLangkah 2: Selanjutnya 34 × 2 = 68, lalu 68 + 2 = 70.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Perhatikan pola barisan: 2, 6, 12, 20, 30, 42, ..., ... Nilai dua suku selanjutnya adalah...',
    opsi_a: '54, 70',
    opsi_b: '56, 72',
    opsi_c: '56, 70',
    opsi_d: '54, 72',
    opsi_e: '58, 74',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Pola merupakan perkalian dua bilangan asli berurutan n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42.\nLangkah 2: Suku ke-7 = 7 × 8 = 56. Suku ke-8 = 8 × 9 = 72.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan satu angka berikutnya dari pola operasi tersembunyi: 3, 4, 12, 13, 39, 40, 120, ...',
    opsi_a: '121',
    opsi_b: '240',
    opsi_c: '360',
    opsi_d: '123',
    opsi_e: '160',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Amati pola bergantian (+1, ×3): 3 (+1)-> 4 (×3)-> 12 (+1)-> 13 (×3)-> 39 (+1)-> 40 (×3)-> 120.\nLangkah 2: Operasi selanjutnya adalah +1, sehingga 120 + 1 = 121.',
  },

  // === 2. PENALARAN NUMERIK, ARITMETIKA & PERBANDINGAN KUANTITATIF HOTS (26-55) ===
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Suatu proyek renovasi gedung arsip ditargetkan selesai dalam 40 hari oleh 18 pekerja. Setelah bekerja selama 15 hari, proyek dihentikan selama 7 hari karena cuaca ekstrem. Jika proyek harus selesai tepat waktu sesuai jadwal awal, berapa banyak pekerja tambahan yang dibutuhkan pada sisa waktu?',
    opsi_a: '5 pekerja',
    opsi_b: '6 pekerja',
    opsi_c: '7 pekerja',
    opsi_d: '8 pekerja',
    opsi_e: '9 pekerja',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Hitung total beban kerja = 40 hari × 18 pekerja = 720 orang-hari.\nLangkah 2: Pekerjaan selesai dalam 15 hari = 15 × 18 = 270 orang-hari. Sisa beban = 720 - 270 = 450 orang-hari.\nLangkah 3: Sisa hari kerja = 40 - 15 - 7 = 18 hari.\nLangkah 4: Total pekerja yang dibutuhkan = 450 ÷ 18 = 25 pekerja. Tambahan pekerja = 25 - 18 = 7 pekerja.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Sebuah toko elektronik memberikan diskon bertingkat 20% + 15% untuk sebuah printer kantor dengan harga awal Rp4.000.000, lalu dikenakan pajak PPN 11% atas harga setelah diskon. Total uang yang harus dibayar bendahara kantor adalah...',
    opsi_a: 'Rp2.886.000',
    opsi_b: 'Rp3.019.200',
    opsi_c: 'Rp2.997.000',
    opsi_d: 'Rp3.108.000',
    opsi_e: 'Rp2.950.000',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Diskon pertama 20%: Rp4.000.000 × 0,80 = Rp3.200.000.\nLangkah 2: Diskon kedua 15% dari harga setelah diskon pertama: Rp3.200.000 × 0,85 = Rp2.720.000.\nLangkah 3: Tambah PPN 11%: Rp2.720.000 × 1,11 = Rp2.720.000 + Rp299.200 = Rp3.019.200.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Kota P dan Kota Q berjarak 270 km. Bus A berangkat dari Kota P menuju Kota Q pukul 07.00 WIB dengan kecepatan rata-rata 60 km/jam. Pada pukul 07.30 WIB, Bus B berangkat dari Kota Q menuju Kota P melalui jalur yang sama dengan kecepatan 80 km/jam. Pada pukul berapakah kedua bus berpapasan?',
    opsi_a: '09.00 WIB',
    opsi_b: '09.13 WIB',
    opsi_c: '09.15 WIB',
    opsi_d: '09.20 WIB',
    opsi_e: '09.30 WIB',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Hitung jarak tempuh Bus A selama selisih waktu 0,5 jam (07.00–07.30): 60 × 0,5 = 30 km.\nLangkah 2: Sisa jarak saat pukul 07.30 = 270 - 30 = 240 km.\nLangkah 3: Kecepatan relatif saling mendekat = 60 + 80 = 140 km/jam.\nLangkah 4: Waktu tempuh bersama = 240 ÷ 140 = 12/7 jam ≈ 1 jam 42 menit 51 detik (~1 jam 43 menit). Pukul 07.30 + 1 jam 43 menit = 09.13 WIB.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Rata-rata nilai ujian 24 peserta pelatihan gelombang pertama adalah 76. Setelah digabung dengan 6 peserta susulan, rata-rata keseluruhan menjadi 78. Berapakah rata-rata nilai 6 peserta susulan tersebut?',
    opsi_a: '84',
    opsi_b: '85',
    opsi_c: '86',
    opsi_d: '88',
    opsi_e: '90',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Total nilai 24 peserta = 24 × 76 = 1.824.\nLangkah 2: Total nilai 30 peserta = 30 × 78 = 2.340.\nLangkah 3: Total nilai 6 peserta susulan = 2.340 - 1.824 = 516.\nLangkah 4: Rata-rata 6 peserta susulan = 516 ÷ 6 = 86.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Jika x = 1/12 + 1/20 + 1/30 + 1/42, sedangkan y = 0,25, maka hubungan yang tepat antara x dan y adalah...',
    opsi_a: 'x > y',
    opsi_b: 'x < y',
    opsi_c: 'x = y',
    opsi_d: 'x = 2y',
    opsi_e: 'Hubungan x dan y tidak dapat ditentukan',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Gunakan sifat deret teleskopik 1/[n(n+1)] = 1/n - 1/(n+1).\n1/12 = 1/3 - 1/4\n1/20 = 1/4 - 1/5\n1/30 = 1/5 - 1/6\n1/42 = 1/6 - 1/7.\nLangkah 2: Jumlahkan sehingga suku tengah saling meniadakan: x = 1/3 - 1/7 = 4/21 ≈ 0,1905.\nLangkah 3: Karena y = 0,25 = 1/4, bandingkan 4/21 dengan 1/4 -> 16/84 < 21/84, sehingga x < y.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Sebuah tangki air memiliki dua keran pengisi dan satu keran pembuang. Keran A dapat mengisi penuh tangki dalam 4 jam, keran B dalam 6 jam, sedangkan keran C dapat mengosongkan tangki penuh dalam 12 jam. Jika ketiga keran dibuka bersamaan saat tangki kosong, berapa lama tangki akan penuh?',
    opsi_a: '2 jam',
    opsi_b: '2,5 jam',
    opsi_c: '3 jam',
    opsi_d: '3,5 jam',
    opsi_e: '4 jam',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Hitung laju per jam masing-masing keran: A = +1/4, B = +1/6, C = -1/12.\nLangkah 2: Laju gabungan = 1/4 + 1/6 - 1/12 = (3 + 2 - 1)/12 = 4/12 = 1/3 bagian per jam.\nLangkah 3: Waktu hingga penuh = 1 ÷ (1/3) = 3 jam.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Dalam suatu survei terhadap 100 pegawai kantor, 65 orang menggunakan transportasi kereta, 48 orang menggunakan bus, dan 15 orang tidak menggunakan keduanya (naik kendaraan pribadi). Banyaknya pegawai yang menggunakan kedua moda transportasi (kereta dan bus) adalah...',
    opsi_a: '24 orang',
    opsi_b: '26 orang',
    opsi_c: '28 orang',
    opsi_d: '30 orang',
    opsi_e: '32 orang',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Gunakan rumus himpunan n(S) = n(K) + n(B) - n(K ∩ B) + n(Lainnya).\nLangkah 2: 100 = 65 + 48 - x + 15 = 128 - x.\nLangkah 3: x = 128 - 100 = 28 orang.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Perbandingan uang Rina dan Sinta adalah 3 : 5, sedangkan perbandingan uang Sinta dan Tari adalah 2 : 3. Jika selisih uang Tari dan Rina adalah Rp540.000, berapakah jumlah uang mereka bertiga?',
    opsi_a: 'Rp1.860.000',
    opsi_b: 'Rp1.920.000',
    opsi_c: 'Rp1.980.000',
    opsi_d: 'Rp2.040.000',
    opsi_e: 'Rp2.100.000',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Samakan rasio Sinta (KPK dari 5 dan 2 adalah 10).\nRina : Sinta = 3 : 5 = 6 : 10.\nSinta : Tari = 2 : 3 = 10 : 15.\nJadi Rina : Sinta : Tari = 6 : 10 : 15.\nLangkah 2: Selisih rasio Tari - Rina = 15 - 6 = 9 bagian = Rp540.000 -> 1 bagian = Rp60.000.\nLangkah 3: Jumlah seluruh bagian = 6 + 10 + 15 = 31 bagian -> 31 × Rp60.000 = Rp1.860.000.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Dari 7 calon tim perumus kebijakan (4 analis kebijakan dan 3 praktisi hukum), akan dipilih panitia kecil berisi 3 orang. Jika disyaratkan minimal terdapat 2 analis kebijakan dalam panitia, berapa banyak cara pemilihan yang mungkin?',
    opsi_a: '18 cara',
    opsi_b: '22 cara',
    opsi_c: '24 cara',
    opsi_d: '28 cara',
    opsi_e: '31 cara',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Kemungkinan 1 (2 analis + 1 praktisi): C(4,2) × C(3,1) = 6 × 3 = 18 cara.\nLangkah 2: Kemungkinan 2 (3 analis + 0 praktisi): C(4,3) × C(3,0) = 4 × 1 = 4 cara.\nLangkah 3: Total cara = 18 + 4 = 22 cara.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Sebuah persegi panjang mengalami perubahan ukuran: panjangnya ditambah 20% dan lebarnya dikurangi 20%. Bagaimana perubahan luas persegi panjang tersebut dibandingkan luas awal?',
    opsi_a: 'Tetap sama (0%)',
    opsi_b: 'Bertambah 4%',
    opsi_c: 'Berkurang 4%',
    opsi_d: 'Berkurang 2%',
    opsi_e: 'Bertambah 2%',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Misalkan panjang awal = p dan lebar awal = l, luas awal L = p × l.\nLangkah 2: Panjang baru = 1,2p dan lebar baru = 0,8l.\nLangkah 3: Luas baru = 1,2p × 0,8l = 0,96 × (p × l) = 96% L, artinya luas berkurang 4%.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Manakah nilai terbesar di antara bentuk berikut?',
    opsi_a: '25% dari 480',
    opsi_b: '3/8 dari 328',
    opsi_c: '0,35 × 340',
    opsi_d: '15% dari 810',
    opsi_e: '5/12 dari 288',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Hitung nilai masing-masing secara presisi:\n- 25% × 480 = 120\n- (3/8) × 328 = 3 × 41 = 123\n- 0,35 × 340 = 119\n- 15% × 810 = 121,5\n- (5/12) × 288 = 5 × 24 = 120\nLangkah 2: Nilai terbesar adalah 123 (3/8 dari 328).',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Diketahui x² - y² = 72 dan x - y = 6. Jika P = x + y dan Q = 14, maka hubungan antara P dan Q adalah...',
    opsi_a: 'P > Q',
    opsi_b: 'P < Q',
    opsi_c: 'P = Q',
    opsi_d: 'P + Q = 24',
    opsi_e: 'Hubungan P dan Q tidak dapat ditentukan',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Gunakan identitas selisih kuadrat: x² - y² = (x - y)(x + y).\nLangkah 2: Substitusi nilai: 72 = 6 × (x + y) -> x + y = 72 ÷ 6 = 12.\nLangkah 3: Karena P = 12 dan Q = 14, maka P < Q.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Seorang pedagang kopi mencampur 20 kg kopi jenis Arabika seharga Rp90.000/kg dengan 30 kg kopi jenis Robusta seharga Rp60.000/kg. Jika ia ingin memperoleh keuntungan 25% dari total modal, berapakah harga jual campuran kopi per kilogram?',
    opsi_a: 'Rp85.000',
    opsi_b: 'Rp87.500',
    opsi_c: 'Rp90.000',
    opsi_d: 'Rp92.500',
    opsi_e: 'Rp95.000',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Total modal = (20 × 90.000) + (30 × 60.000) = 1.800.000 + 1.800.000 = Rp3.600.000.\nLangkah 2: Harga beli rata-rata per kg = Rp3.600.000 ÷ (20 + 30) = Rp72.000/kg.\nLangkah 3: Harga jual untuk untung 25% = Rp72.000 × 1,25 = Rp90.000/kg.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Jika 3x + 2y = 29 dan 2x + 3y = 26, maka nilai dari x² - y² adalah...',
    opsi_a: '15',
    opsi_b: '20',
    opsi_c: '25',
    opsi_d: '33',
    opsi_e: '45',
    jawaban_benar: 'D',
    pembahasan:
      'Langkah 1: Jumlahkan kedua persamaan: 5x + 5y = 55 -> x + y = 11.\nLangkah 2: Kurangkan persamaan pertama dengan kedua: x - y = 29 - 26 = 3.\nLangkah 3: x² - y² = (x + y)(x - y) = 11 × 3 = 33.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Sebuah perahu motor menempuh jarak 48 km searah arus sungai dalam waktu 2 jam. Saat kembali melawan arus melalui rute yang sama, perahu membutuhkan waktu 3 jam. Kecepatan arus sungai tersebut adalah...',
    opsi_a: '2 km/jam',
    opsi_b: '4 km/jam',
    opsi_c: '6 km/jam',
    opsi_d: '8 km/jam',
    opsi_e: '20 km/jam',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Kecepatan searah arus (Vp + Va) = 48 ÷ 2 = 24 km/jam.\nLangkah 2: Kecepatan melawan arus (Vp - Va) = 48 ÷ 3 = 16 km/jam.\nLangkah 3: Kurangkan kedua persamaan: 2 × Va = 24 - 16 = 8 -> Va = 4 km/jam.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Seseorang menabung Rp10.000.000 di koperasi dengan bunga tunggal 6% per tahun. Setelah berapa bulan tabungannya berkembang menjadi Rp10.900.000?',
    opsi_a: '12 bulan',
    opsi_b: '15 bulan',
    opsi_c: '18 bulan',
    opsi_d: '20 bulan',
    opsi_e: '24 bulan',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Bunga yang diperoleh = 10.900.000 - 10.000.000 = Rp900.000.\nLangkah 2: Bunga per tahun (12 bulan) = 6% × 10.000.000 = Rp600.000, artinya Rp50.000 per bulan.\nLangkah 3: Lama menabung = 900.000 ÷ 50.000 = 18 bulan.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Dua buah dadu bermata enam dilempar bersamaan satu kali. Peluang munculnya jumlah kedua mata dadu yang habis dibagi 6 adalah...',
    opsi_a: '1/6',
    opsi_b: '5/36',
    opsi_c: '1/9',
    opsi_d: '7/36',
    opsi_e: '1/12',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Ruang sampel dua dadu = 6 × 6 = 36.\nLangkah 2: Jumlah mata dadu kelipatan 6 adalah 6 atau 12.\nPasangan berjumlah 6: (1,5), (2,4), (3,3), (4,2), (5,1) -> 5 cara.\nPasangan berjumlah 12: (6,6) -> 1 cara.\nLangkah 3: Total = 6 cara, sehingga peluangnya 6/36 = 1/6.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Dalam kotak terdapat 5 bola merah, 4 bola biru, dan 3 bola hijau. Jika diambil 2 bola sekaligus secara acak, peluang terambilnya 1 bola merah dan 1 bola biru adalah...',
    opsi_a: '10/33',
    opsi_b: '5/22',
    opsi_c: '7/33',
    opsi_d: '1/3',
    opsi_e: '4/11',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Total bola = 5 + 4 + 3 = 12 bola. Banyak cara mengambil 2 bola = C(12,2) = (12×11)/2 = 66.\nLangkah 2: Banyak cara mengambil 1 merah dan 1 biru = C(5,1) × C(4,1) = 5 × 4 = 20.\nLangkah 3: Peluang = 20/66 = 10/33.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Sebuah dinas membutuhkan 12.000 lembar kertas HVS per bulan (1 rim = 500 lembar). Vendor P menawarkan harga Rp48.000 per rim dengan diskon 10% untuk pembelian minimal 20 rim serta ongkos kirim tetap Rp40.000. Vendor Q menawarkan harga Rp46.000 per rim tanpa diskon dengan gratis ongkos kirim. Berdasarkan evaluasi biaya total, keputusan pengadaan yang paling efisien adalah...',
    opsi_a: 'Memilih Vendor Q karena lebih hemat Rp16.000 per bulan',
    opsi_b: 'Memilih Vendor P karena lebih hemat Rp27.200 per bulan',
    opsi_c: 'Memilih Vendor P karena lebih hemat Rp67.200 per bulan',
    opsi_d: 'Memilih Vendor Q karena lebih hemat Rp27.200 per bulan',
    opsi_e: 'Keduanya menghasilkan biaya total yang sama persis',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Konversi kebutuhan ke satuan rim: 12.000 ÷ 500 = 24 rim (memenuhi syarat minimal 20 rim).\nLangkah 2: Biaya Vendor P = (24 × Rp48.000 × 90%) + Rp40.000 = Rp1.036.800 + Rp40.000 = Rp1.076.800.\nLangkah 3: Biaya Vendor Q = 24 × Rp46.000 = Rp1.104.000.\nLangkah 4: Selisih = Rp1.104.000 - Rp1.076.800 = Rp27.200, sehingga Vendor P lebih hemat Rp27.200 per bulan.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Umur Ani saat ini tiga kali umur Budi. Lima tahun yang akan datang, jumlah umur mereka adalah 50 tahun. Berapakah umur Ani saat ini?',
    opsi_a: '24 tahun',
    opsi_b: '27 tahun',
    opsi_c: '30 tahun',
    opsi_d: '33 tahun',
    opsi_e: '36 tahun',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Misal umur Budi saat ini = b, maka umur Ani = 3b.\nLangkah 2: Lima tahun lagi, jumlah umur: (3b + 5) + (b + 5) = 50 -> 4b + 10 = 50 -> 4b = 40 -> b = 10.\nLangkah 3: Umur Ani saat ini = 3 × 10 = 30 tahun.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Sebuah mesin fotokopi berkecepatan tinggi dapat mencetak 450 lembar dalam 6 menit. Jika tersedia 3 mesin identik yang bekerja bersama, berapa menit waktu yang dibutuhkan untuk mencetak 3.375 lembar dokumen?',
    opsi_a: '12 menit',
    opsi_b: '14 menit',
    opsi_c: '15 menit',
    opsi_d: '18 menit',
    opsi_e: '20 menit',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Kecepatan 1 mesin = 450 ÷ 6 = 75 lembar/menit.\nLangkah 2: Kecepatan 3 mesin bersama = 3 × 75 = 225 lembar/menit.\nLangkah 3: Waktu untuk 3.375 lembar = 3.375 ÷ 225 = 15 menit.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Sebuah mobil menempuh perjalanan 120 km pertama dengan kecepatan 60 km/jam, lalu 120 km berikutnya dengan kecepatan 40 km/jam. Kecepatan rata-rata mobil selama seluruh perjalanan adalah...',
    opsi_a: '48 km/jam',
    opsi_b: '50 km/jam',
    opsi_c: '52 km/jam',
    opsi_d: '45 km/jam',
    opsi_e: '54 km/jam',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Hitung waktu tempuh tiap segmen: t1 = 120 ÷ 60 = 2 jam; t2 = 120 ÷ 40 = 3 jam.\nLangkah 2: Total jarak = 240 km, total waktu = 2 + 3 = 5 jam.\nLangkah 3: Kecepatan rata-rata = 240 ÷ 5 = 48 km/jam (rata-rata harmonik, bukan rata-rata aritmetika 50).',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Jika a/b = 3/4 dan b/c = 8/9, maka nilai dari (a + b) / (b + c) adalah...',
    opsi_a: '14/17',
    opsi_b: '7/9',
    opsi_c: '12/17',
    opsi_d: '15/17',
    opsi_e: '6/11',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Samakan nilai b pada kedua rasio: a/b = 3/4 = 6/8 dan b/c = 8/9.\nLangkah 2: Misalkan a = 6k, b = 8k, c = 9k.\nLangkah 3: (a + b) / (b + c) = (6k + 8k) / (8k + 9k) = 14 / 17.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Diketahui P = 45% × 240 dan Q = (3/5) × 180. Pernyataan perbandingan kuantitatif yang benar adalah...',
    opsi_a: 'P > Q',
    opsi_b: 'P < Q',
    opsi_c: 'P = Q',
    opsi_d: '2P = Q',
    opsi_e: 'Tidak dapat ditentukan',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Hitung P = 0,45 × 240 = 45 × 2,4 = 108.\nLangkah 2: Hitung Q = (3/5) × 180 = 3 × 36 = 108.\nLangkah 3: Karena P = 108 dan Q = 108, maka P = Q.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Sebuah peternakan memiliki persediaan pakan yang cukup untuk 60 ekor sapi selama 24 hari. Jika peternak menjual 15 ekor sapi, untuk berapa harikah persediaan pakan tersebut akan mencukupi sisa sapi?',
    opsi_a: '28 hari',
    opsi_b: '30 hari',
    opsi_c: '32 hari',
    opsi_d: '36 hari',
    opsi_e: '40 hari',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Ini perbandingan berbalik nilai (semakin sedikit sapi, pakan habis lebih lama).\nLangkah 2: Sisa sapi = 60 - 15 = 45 ekor.\nLangkah 3: 60 × 24 = 45 × H -> H = 1440 ÷ 45 = 32 hari.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Sebuah puskesmas membuka layanan vaksinasi dengan dua bilik layanan. Bilik A mampu melayani 15 warga per jam dan mulai beroperasi pukul 08.00 WIB, sedangkan Bilik B mampu melayani 12 warga per jam dan baru dibuka pukul 09.00 WIB setelah kalibrasi peralatan. Jika terdapat 123 warga terdaftar yang dilayani terus-menerus sesuai kapasitas maksimal, pada pukul berapakah seluruh warga selesai dilayani?',
    opsi_a: '12.30 WIB',
    opsi_b: '13.00 WIB',
    opsi_c: '13.30 WIB',
    opsi_d: '14.00 WIB',
    opsi_e: '14.30 WIB',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Hitung warga terlayani pada jam pertama (08.00–09.00) saat hanya Bilik A aktif = 15 warga.\nLangkah 2: Sisa warga mulai pukul 09.00 = 123 - 15 = 108 warga.\nLangkah 3: Kecepatan gabungan Bilik A + B = 15 + 12 = 27 warga/jam.\nLangkah 4: Waktu yang dibutuhkan untuk 108 warga = 108 ÷ 27 = 4 jam -> selesai pukul 09.00 + 4 jam = 13.00 WIB.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Pada denah skala 1 : 250, sebuah taman kota berbentuk persegi panjang berukuran 12 cm × 8 cm. Luas sebenarnya taman kota tersebut adalah...',
    opsi_a: '480 m²',
    opsi_b: '540 m²',
    opsi_c: '600 m²',
    opsi_d: '640 m²',
    opsi_e: '720 m²',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Panjang sebenarnya = 12 cm × 250 = 3.000 cm = 30 m.\nLangkah 2: Lebar sebenarnya = 8 cm × 250 = 2.000 cm = 20 m.\nLangkah 3: Luas sebenarnya = 30 m × 20 m = 600 m².',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Jika x adalah bilangan bulat dengan 4 < x < 9 dan y adalah bilangan prima genap, maka nilai terbesar yang mungkin untuk (x × y) - y adalah...',
    opsi_a: '12',
    opsi_b: '14',
    opsi_c: '16',
    opsi_d: '18',
    opsi_e: '20',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Bilangan prima genap satu-satunya adalah y = 2.\nLangkah 2: Bilangan bulat x dengan 4 < x < 9 adalah {5, 6, 7, 8}; nilai maksimumnya x = 8.\nLangkah 3: (8 × 2) - 2 = 16 - 2 = 14.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Data nilai 7 peserta tes adalah: 70, 85, 90, 75, 85, 80, 75. Jika satu peserta baru bergabung dengan nilai 95, bagaimana perubahan median data tersebut?',
    opsi_a: 'Median turun 2,5 poin',
    opsi_b: 'Median tetap 80',
    opsi_c: 'Median naik 2,5 poin menjadi 82,5',
    opsi_d: 'Median naik 5 poin menjadi 85',
    opsi_e: 'Median turun menjadi 75',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Urutkan 7 data awal: 70, 75, 75, 80, 85, 85, 90. Median awal (data ke-4) = 80.\nLangkah 2: Setelah 95 masuk, data terurut (8 angka): 70, 75, 75, 80, 85, 85, 90, 95.\nLangkah 3: Median baru = rata-rata data ke-4 dan ke-5 = (80 + 85)/2 = 82,5. Jadi naik 2,5 poin menjadi 82,5.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Seorang karyawan menyisihkan 15% gajinya untuk tabungan darurat dan 25% untuk cicilan rumah. Jika sisa gajinya setelah kedua pos tersebut adalah Rp4.800.000, berapakah gaji total karyawan tersebut?',
    opsi_a: 'Rp7.200.000',
    opsi_b: 'Rp7.500.000',
    opsi_c: 'Rp8.000.000',
    opsi_d: 'Rp8.400.000',
    opsi_e: 'Rp9.000.000',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Persentase terpakai = 15% + 25% = 40%.\nLangkah 2: Persentase sisa gaji = 100% - 40% = 60%.\nLangkah 3: 60% × Gaji = Rp4.800.000 -> Gaji = 4.800.000 ÷ 0,6 = Rp8.000.000.',
  },

  // === 3. PENALARAN LOGIS (SILOGISME) & ANALITIS HOTS (56-75) ===
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Logis',
    pertanyaan:
      'Semua pelamar CPNS yang lolos tahap Seleksi Kompetensi Dasar (SKD) berhak mengikuti Seleksi Kompetensi Bidang (SKB). Sebagian peserta yang mengikuti SKB dinyatakan gugur pada tahap wawancara. Simpulan yang paling tepat adalah...',
    opsi_a: 'Semua pelamar CPNS yang lolos SKD dinyatakan lulus wawancara.',
    opsi_b: 'Sebagian pelamar CPNS yang lolos SKD tidak mengikuti SKB.',
    opsi_c: 'Sebagian pelamar yang berhak mengikuti SKB tidak lulus tahap wawancara.',
    opsi_d: 'Semua peserta SKB pasti gugur pada tahap wawancara.',
    opsi_e: 'Peserta yang gugur wawancara tidak pernah mengikuti SKD.',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Premis 1: Semua lolos SKD -> berhak ikut SKB.\nLangkah 2: Premis 2: Sebagian peserta SKB -> gugur wawancara.\nLangkah 3: Oleh karena peserta SKB mencakup mereka yang berhak dari hasil SKD, kesimpulan sahih tanpa melampaui premis adalah sebagian peserta yang berhak mengikuti SKB tidak lulus tahap wawancara.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Logis',
    pertanyaan:
      'Jika sistem server instansi mengalami gangguan atau jaringan serat optik terputus, maka pengunggahan berkas diperpanjang 24 jam. Ternyata pengunggahan berkas tidak diperpanjang 24 jam. Simpulan yang sah adalah...',
    opsi_a: 'Sistem server mengalami gangguan namun jaringan serat optik tetap aman.',
    opsi_b: 'Sistem server tidak mengalami gangguan dan jaringan serat optik tidak terputus.',
    opsi_c: 'Sistem server tidak mengalami gangguan atau jaringan serat optik terputus.',
    opsi_d: 'Pengunggahan berkas tetap berlangsung meski server mengalami gangguan.',
    opsi_e: 'Tidak ada simpulan yang dapat ditarik.',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Bentuk logika: (A ∨ B) -> C.\nLangkah 2: Fakta: ~C (Modus Tollens) -> ~(A ∨ B).\nLangkah 3: Menurut Hukum De Morgan, ~(A ∨ B) ekuivalen dengan (~A ∧ ~B): sistem server tidak mengalami gangguan DAN jaringan serat optik tidak terputus.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Logis',
    pertanyaan:
      'Semua pegawai Bagian Keuangan menguasai perangkat lunak akuntansi. Tidak ada satu pun pegawai yang tidak menguasai analisis anggaran merupakan anggota tim audit. Semua anggota tim audit adalah pegawai Bagian Keuangan. Simpulan yang tepat adalah...',
    opsi_a: 'Sebagian anggota tim audit tidak menguasai perangkat lunak akuntansi.',
    opsi_b: 'Semua anggota tim audit menguasai perangkat lunak akuntansi dan analisis anggaran.',
    opsi_c: 'Semua pegawai Bagian Keuangan adalah anggota tim audit.',
    opsi_d: 'Sebagian pegawai Bagian Keuangan tidak menguasai analisis anggaran karena anggota tim audit.',
    opsi_e: 'Tidak ada anggota tim audit yang bekerja di Bagian Keuangan.',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Semua Tim Audit -> Bagian Keuangan -> menguasai perangkat lunak akuntansi.\nLangkah 2: "Tidak ada yang tidak menguasai analisis anggaran adalah tim audit" berarti Semua Tim Audit -> menguasai analisis anggaran.\nLangkah 3: Gabungan keduanya: Semua anggota tim audit menguasai perangkat lunak akuntansi dan analisis anggaran.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Logis',
    pertanyaan:
      'Jika hujan turun deras, maka debit air bendungan meningkat. Jika debit air bendungan meningkat, maka pintu air sektor selatan dibuka. Hari ini pintu air sektor selatan tidak dibuka atau petugas melakukan pemeliharaan rutin. Jika ternyata petugas tidak melakukan pemeliharaan rutin, simpulan yang pasti benar adalah...',
    opsi_a: 'Hujan turun deras hari ini.',
    opsi_b: 'Debit air bendungan meningkat namun pintu air tetap tertutup.',
    opsi_c: 'Hari ini hujan tidak turun deras.',
    opsi_d: 'Pintu air sektor selatan dibuka lebih awal.',
    opsi_e: 'Petugas membuka seluruh pintu air sektor utara.',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Rantai implikasi: Hujan deras (P) -> Debit meningkat (Q) -> Pintu selatan dibuka (R), sehingga P -> R.\nLangkah 2: Fakta: (~R ∨ M) dan ~M -> maka pasti ~R (pintu air sektor selatan tidak dibuka).\nLangkah 3: Dengan Modus Tollens pada P -> R dan ~R, diperoleh ~P: hari ini hujan tidak turun deras.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Logis',
    pertanyaan:
      'Pernyataan yang ekuivalen (setara secara logis) dengan kalimat "Jika suatu instansi menerapkan sistem merit secara konsisten, maka kinerja pelayanan publik meningkat" adalah...',
    opsi_a: 'Jika kinerja pelayanan publik meningkat, maka instansi menerapkan sistem merit secara konsisten.',
    opsi_b: 'Instansi tidak menerapkan sistem merit secara konsisten atau kinerja pelayanan publik meningkat.',
    opsi_c: 'Jika instansi tidak menerapkan sistem merit, maka kinerja pelayanan publik tidak meningkat.',
    opsi_d: 'Instansi menerapkan sistem merit dan kinerja pelayanan publik tidak meningkat.',
    opsi_e: 'Kinerja pelayanan publik hanya meningkat apabila seluruh pegawai mendapat tunjangan baru.',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Bentuk implikasi P -> Q memiliki ekuivalensi logis (~P ∨ Q) selain kontraposisi (~Q -> ~P).\nLangkah 2: ~P ∨ Q berarti "Instansi tidak menerapkan sistem merit secara konsisten atau kinerja pelayanan publik meningkat."',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Analitis',
    pertanyaan:
      'Lima peserta wawancara (Adi, Bela, Cici, Dedi, Eka) dijadwalkan masuk ruang panel secara berurutan 1 sampai 5 dengan aturan:\n- Bela harus diwawancarai tepat sebelum Eka.\n- Dedi bukan peserta pertama dan bukan peserta terakhir.\n- Cici diwawancarai tepat setelah Adi.\n- Adi diwawancarai lebih dahulu daripada Bela.\nJika Dedi berada pada urutan ke-3, siapa yang pasti menjadi peserta ke-5 (terakhir)?',
    opsi_a: 'Adi',
    opsi_b: 'Bela',
    opsi_c: 'Cici',
    opsi_d: 'Eka',
    opsi_e: 'Adi atau Bela',
    jawaban_benar: 'D',
    pembahasan:
      'Langkah 1: Ada dua blok berpasangan: [Adi, Cici] dan [Bela, Eka].\nLangkah 2: Dedi di posisi 3 -> posisi tersisa adalah (1, 2) dan (4, 5).\nLangkah 3: Karena Adi lebih dahulu daripada Bela, maka blok [Adi, Cici] menempati (1, 2) dan blok [Bela, Eka] menempati (4, 5). Jadi peserta ke-5 adalah Eka.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Analitis',
    pertanyaan:
      'Enam dokumen arsip (P, Q, R, S, T, U) disimpan di rak bernomor 1 (paling atas) sampai 6 (paling bawah):\n- Dokumen R berada tepat di atas dokumen P.\n- Dokumen Q berada di antara S dan U (tidak harus bersebelahan), dengan S di atas Q dan Q di atas U.\n- Dokumen T berada di rak nomor 1.\n- Dokumen P berada tepat di atas dokumen S.\nUrutan dokumen dari rak nomor 1 hingga 6 adalah...',
    opsi_a: 'T, R, P, S, Q, U',
    opsi_b: 'T, S, Q, R, P, U',
    opsi_c: 'T, R, S, P, Q, U',
    opsi_d: 'T, Q, R, P, S, U',
    opsi_e: 'T, R, P, Q, S, U',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: T = 1.\nLangkah 2: R tepat di atas P, dan P tepat di atas S membentuk blok berurutan R - P - S.\nLangkah 3: S di atas Q dan Q di atas U -> setelah S harus Q lalu U.\nLangkah 4: Gabungkan dari rak 1 ke 6: T (1), R (2), P (3), S (4), Q (5), U (6).',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Analitis',
    pertanyaan:
      'Dalam suatu rapat koordinasi meja bundar berkapasitas 6 kursi, duduk 6 pejabat: Fajar, Gita, Hadi, Irma, Joko, dan Lina.\n- Fajar duduk berhadapan langsung dengan Irma.\n- Gita duduk di sebelah kanan Fajar.\n- Hadi tidak mau duduk bersebelahan dengan Irma.\n- Joko duduk berhadapan langsung dengan Gita.\nSiapakah yang duduk di sebelah Irma selain Joko?',
    opsi_a: 'Gita',
    opsi_b: 'Fajar',
    opsi_c: 'Hadi',
    opsi_d: 'Lina',
    opsi_e: 'Hadi atau Lina',
    jawaban_benar: 'D',
    pembahasan:
      'Langkah 1: Penomoran kursi melingkar 1..6. Misal Fajar = 1, maka Irma (berhadapan) = 4.\nLangkah 2: Gita di sebelah kanan Fajar (kursi 2), maka Joko berhadapan dengan Gita (kursi 5, bersebelahan dengan Irma). Kursi tetangga Irma lainnya adalah kursi 3.\nLangkah 3: Kursi tersisa adalah 3 dan 6. Karena Hadi dilarang duduk bersebelahan dengan Irma (kursi 3), maka Hadi wajib di kursi 6 dan kursi 3 ditempati Lina.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Logis',
    pertanyaan:
      'Tidak semua laporan tahunan yang selesai tepat waktu bebas dari revisi administratif. Semua laporan yang disusun oleh tim verifikasi bebas dari revisi administratif. Simpulan yang sahih adalah...',
    opsi_a: 'Sebagian laporan tahunan yang selesai tepat waktu bukan disusun oleh tim verifikasi.',
    opsi_b: 'Semua laporan tahunan yang selesai tepat waktu disusun oleh tim verifikasi.',
    opsi_c: 'Tidak ada laporan tim verifikasi yang selesai tepat waktu.',
    opsi_d: 'Semua laporan yang bebas revisi administratif selesai tepat waktu.',
    opsi_e: 'Tim verifikasi selalu menyelesaikan laporan melebihi tenggat.',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: "Tidak semua X adalah Y" berarti "Ada X yang bukan Y" (Ada laporan tepat waktu yang tidak bebas revisi).\nLangkah 2: Karena semua produk tim verifikasi bebas revisi, maka laporan tepat waktu yang masih butuh revisi tersebut pasti BUKAN disusun tim verifikasi.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Analitis',
    pertanyaan:
      'Empat kota (K, L, M, N) dihubungkan jalur kereta:\n- Jarak K ke L lebih jauh daripada M ke N.\n- Jarak L ke M sama dengan jarak K ke L.\n- Jarak M ke N lebih jauh daripada K ke N.\nManakah rute dengan jarak paling pendek?',
    opsi_a: 'K ke L',
    opsi_b: 'L ke M',
    opsi_c: 'M ke N',
    opsi_d: 'K ke N',
    opsi_e: 'K ke L dan L ke M',
    jawaban_benar: 'D',
    pembahasan:
      'Langkah 1: Susun pertidaksamaan jarak: (L-M = K-L) > (M-N) > (K-N).\nLangkah 2: Urutan dari terjauh ke terpendek: (K-L = L-M) > M-N > K-N.\nLangkah 3: Rute paling pendek adalah K ke N.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Verbal — Analogi',
    pertanyaan: 'AUDITOR : LAPORAN KEUANGAN = ... : ...',
    opsi_a: 'Dokter : Stetoskop',
    opsi_b: 'Kurator : Karya Seni',
    opsi_c: 'Arsitek : Beton',
    opsi_d: 'Nelayan : Samudra',
    opsi_e: 'Hakim : Terdakwa',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Identifikasi relasi: Auditor adalah profesi yang memeriksa/menilai kelayakan dan keaslian Laporan Keuangan.\nLangkah 2: Kurator adalah profesi yang menilai, menyeleksi, dan mengawasi keaslian Karya Seni.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Verbal — Analogi',
    pertanyaan: 'INFLASI : DAYA BELI = ... : ...',
    opsi_a: 'Erosi : Kesuburan Tanah',
    opsi_b: 'Irigasi : Panen Padi',
    opsi_c: 'Vaksinasi : Kekebalan Tubuh',
    opsi_d: 'Investasi : Modal Usaha',
    opsi_e: 'Edukasi : Literasi',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Hubungan sebab-akibat berlawanan arah: tingginya Inflasi menggerus/menurunkan Daya Beli.\nLangkah 2: Tingginya Erosi menggerus/menurunkan Kesuburan Tanah (sedangkan 4 pasangan lain bersifat meningkatkan).',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Analitis',
    pertanyaan:
      'Jadwal piket layanan terpadu Senin hingga Jumat diisi oleh 5 petugas (Nadia, Omar, Putri, Qori, Raka) masing-masing tepat satu hari:\n- Qori piket dua hari setelah Nadia.\n- Putri piket sebelum Raka, tetapi sesudah Qori.\n- Omar tidak piket pada hari Senin ataupun Jumat.\nUrutan petugas piket dari Senin ke Jumat adalah...',
    opsi_a: 'Nadia, Omar, Qori, Putri, Raka',
    opsi_b: 'Nadia, Qori, Omar, Putri, Raka',
    opsi_c: 'Omar, Nadia, Putri, Qori, Raka',
    opsi_d: 'Nadia, Omar, Putri, Qori, Raka',
    opsi_e: 'Qori, Omar, Nadia, Putri, Raka',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Karena Putri sesudah Qori dan Raka sesudah Putri, minimal ada 2 hari setelah Qori (Rabu -> Kamis, Jumat). Artinya Qori paling lambat Rabu.\nLangkah 2: Qori dua hari setelah Nadia -> jika Nadia Senin (1), maka Qori Rabu (3), sehingga Putri Kamis (4) dan Raka Jumat (5).\nLangkah 3: Tersisa hari Selasa (2) untuk Omar (memenuhi syarat bukan Senin/Jumat). Jadi urutannya: Nadia, Omar, Qori, Putri, Raka.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Logis',
    pertanyaan:
      'Setiap warga yang memiliki Nomor Induk Kependudukan aktif dapat mengakses layanan kependudukan digital. Sebagian penduduk lansia di desa terpencil belum mengaktivasi layanan kependudukan digital meskipun sudah memiliki NIK aktif. Simpulan yang tepat adalah...',
    opsi_a: 'Penduduk lansia di desa terpencil tidak memiliki NIK aktif.',
    opsi_b: 'Sebagian penduduk lansia yang memiliki NIK aktif belum mengakses layanan kependudukan digital.',
    opsi_c: 'Semua penduduk yang memiliki NIK aktif pasti sudah menggunakan aplikasi digital.',
    opsi_d: 'Layanan kependudukan digital melarang penduduk lansia mendaftar.',
    opsi_e: 'Hanya warga perkotaan yang dapat memiliki NIK aktif.',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Premis 1 menyatakan kemampuan ("dapat mengakses"), bukan keharusan sudah menggunakan.\nLangkah 2: Premis 2 menyebut sebagian lansia memiliki NIK aktif tetapi belum mengaktivasi layanan digital. Jadi mereka termasuk kelompok yang memiliki hak akses namun belum memanfaatkannya.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Dalam sebuah kelas pelatihan, rasio jumlah peserta pria dan wanita adalah 5 : 4. Jika 6 peserta wanita baru bergabung, rasio pria dan wanita berubah menjadi 10 : 9. Jumlah peserta pria di kelas tersebut adalah...',
    opsi_a: '40 orang',
    opsi_b: '45 orang',
    opsi_c: '50 orang',
    opsi_d: '60 orang',
    opsi_e: '75 orang',
    jawaban_benar: 'D',
    pembahasan:
      'Langkah 1: Misalkan jumlah awal pria = 5k dan wanita = 4k.\nLangkah 2: Setelah 6 wanita masuk: 5k / (4k + 6) = 10 / 9.\nLangkah 3: Kali silang: 45k = 40k + 60 -> 5k = 60 -> k = 12.\nLangkah 4: Jumlah pria = 5k = 5 × 12 = 60 orang.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Berapakah angka satuan (digit terakhir) dari bilangan 7²⁰²⁶?',
    opsi_a: '1',
    opsi_b: '3',
    opsi_c: '7',
    opsi_d: '9',
    opsi_e: '5',
    jawaban_benar: 'D',
    pembahasan:
      'Langkah 1: Pola digit satuan perpangkatan 7 berulang tiap 4 siklus:\n7¹ -> 7\n7² -> 9\n7³ -> 3\n7⁴ -> 1.\nLangkah 2: Bagi pangkat 2026 dengan 4: 2026 = 4 × 506 + 2 (sisa 2).\nLangkah 3: Sisa 2 sesuai dengan 7², yaitu berakhiran digit 9.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Sebuah jam dinding yang tepat dicocokkan pada pukul 08.00 WIB, namun jam tersebut mengalami keterlambatan konstan 3 menit setiap jam sebenarnya. Ketika jam sebenarnya menunjukkan pukul 18.00 WIB di hari yang sama, pukul berapakah yang ditunjukkan oleh jam dinding tersebut?',
    opsi_a: '17.24 WIB',
    opsi_b: '17.30 WIB',
    opsi_c: '17.36 WIB',
    opsi_d: '18.30 WIB',
    opsi_e: '17.45 WIB',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Lama waktu sebenarnya dari 08.00 hingga 18.00 = 10 jam.\nLangkah 2: Total keterlambatan = 10 jam × 3 menit/jam = 30 menit.\nLangkah 3: Waktu yang ditunjukkan jam dinding = 18.00 - 30 menit = 17.30 WIB.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Harga 3 buku tulis dan 2 pulpen adalah Rp31.000, sedangkan harga 2 buku tulis dan 3 pulpen adalah Rp29.000. Jika Anton membeli 1 buku tulis dan 1 pulpen serta membayar dengan uang Rp20.000, berapakah uang kembaliannya?',
    opsi_a: 'Rp6.000',
    opsi_b: 'Rp7.000',
    opsi_c: 'Rp8.000',
    opsi_d: 'Rp9.000',
    opsi_e: 'Rp12.000',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Jumlahkan kedua persamaan: (3b + 2p) + (2b + 3p) = 31.000 + 29.000 -> 5b + 5p = 60.000.\nLangkah 2: Bagi 5 kedua ruas: b + p = Rp12.000.\nLangkah 3: Uang kembalian = 20.000 - 12.000 = Rp8.000.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Analitis',
    pertanyaan:
      'Dalam pemilihan ketua tim inovasi, 5 kandidat memperoleh skor berbeda:\n- Skor Maya lebih tinggi daripada Niko, tetapi lebih rendah daripada Raka.\n- Skor Lutfi lebih tinggi daripada Raka.\n- Skor Sinta lebih rendah daripada Niko.\nKandidat dengan skor urutan ke-3 adalah...',
    opsi_a: 'Lutfi',
    opsi_b: 'Raka',
    opsi_c: 'Maya',
    opsi_d: 'Niko',
    opsi_e: 'Sinta',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Susun dari skor tertinggi ke terendah:\nLutfi > Raka > Maya > Niko > Sinta.\nLangkah 2: Urutan ke-1 Lutfi, ke-2 Raka, ke-3 Maya.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Jika x + 1/x = 5, maka berapakah nilai dari x² + 1/x²?',
    opsi_a: '21',
    opsi_b: '23',
    opsi_c: '25',
    opsi_d: '27',
    opsi_e: '29',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Kuadratkan kedua ruas persamaan awal: (x + 1/x)² = 5².\nLangkah 2: Uraikan: x² + 2(x)(1/x) + 1/x² = 25 -> x² + 2 + 1/x² = 25.\nLangkah 3: Kurangkan 2: x² + 1/x² = 25 - 2 = 23.',
  },
  // Tambahan 20 soal lagi untuk mencapai total 75 TIU!
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan suku ke-8 pada barisan: 1, 1, 2, 3, 5, 8, 13, ...',
    opsi_a: '18',
    opsi_b: '20',
    opsi_c: '21',
    opsi_d: '22',
    opsi_e: '24',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Deret Fibonacci klasik: suku berikutnya adalah jumlah 2 suku sebelumnya.\nLangkah 2: 8 + 13 = 21.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Lengkapi deret berikut: 64, 32, 48, 24, 36, 18, ...',
    opsi_a: '9',
    opsi_b: '24',
    opsi_c: '27',
    opsi_d: '30',
    opsi_e: '32',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Pola bergantian (÷2, ×1,5): 64 ÷ 2 = 32; 32 × 1,5 = 48; 48 ÷ 2 = 24; 24 × 1,5 = 36; 36 ÷ 2 = 18.\nLangkah 2: Operasi berikutnya ×1,5: 18 × 1,5 = 27.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan bilangan selanjutnya: 9, 12, 17, 24, 33, 44, ...',
    opsi_a: '55',
    opsi_b: '56',
    opsi_c: '57',
    opsi_d: '58',
    opsi_e: '59',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Hitung selisih: +3, +5, +7, +9, +11 (bilangan ganjil berurutan).\nLangkah 2: Selisih berikutnya +13 -> 44 + 13 = 57.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan dua angka berikutnya: 4, 12, 6, 18, 9, 27, ..., ...',
    opsi_a: '13,5; 40,5',
    opsi_b: '14,5; 43,5',
    opsi_c: '18, 54',
    opsi_d: '12, 36',
    opsi_e: '13, 39',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Pola (×3, ÷2): 4×3=12, 12÷2=6, 6×3=18, 18÷2=9, 9×3=27.\nLangkah 2: 27 ÷ 2 = 13,5; lalu 13,5 × 3 = 40,5.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Cari angka yang tepat untuk melengkapi: 1, 8, 27, 64, 125, ..., 343',
    opsi_a: '196',
    opsi_b: '216',
    opsi_c: '225',
    opsi_d: '256',
    opsi_e: '289',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Barisan merupakan pangkat tiga (kubik) bilangan asli: 1³, 2³, 3³, 4³, 5³, ..., 7³.\nLangkah 2: Suku ke-6 = 6³ = 216.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Sebuah proyek pembangunan jembatan dikerjakan oleh 24 pekerja dan direncanakan selesai dalam 30 hari. Jika diinginkan proyek selesai dalam 20 hari, berapa pekerja tambahan yang diperlukan?',
    opsi_a: '8 pekerja',
    opsi_b: '10 pekerja',
    opsi_c: '12 pekerja',
    opsi_d: '14 pekerja',
    opsi_e: '16 pekerja',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Beban total = 24 × 30 = 720 orang-hari.\nLangkah 2: Pekerja untuk 20 hari = 720 ÷ 20 = 36 orang.\nLangkah 3: Tambahan = 36 - 24 = 12 pekerja.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Pemerintah desa mengalokasikan Dana Desa sebesar Rp600 juta untuk tiga pos: infrastruktur (45%), pemberdayaan UMKM (30%), dan ketahanan pangan (sisanya). Pada triwulan kedua, musyawarah desa menyepakati realokasi 1/5 bagian dari anggaran infrastruktur ke pos ketahanan pangan untuk mitigasi kekeringan. Berapa persentase akhir pos ketahanan pangan terhadap total Dana Desa?',
    opsi_a: '30%',
    opsi_b: '32%',
    opsi_c: '34%',
    opsi_d: '36%',
    opsi_e: '38%',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Persentase awal ketahanan pangan = 100% - (45% + 30%) = 25% (setara Rp150 juta).\nLangkah 2: Tambahan realokasi = 1/5 × 45% = 9% (setara Rp54 juta).\nLangkah 3: Persentase akhir ketahanan pangan = 25% + 9% = 34% (Rp204 juta dari Rp600 juta = 34%).',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Sebuah kereta api sepanjang 180 meter melaju dengan kecepatan 72 km/jam. Berapa detik waktu yang dibutuhkan kereta tersebut untuk melewati seluruh jembatan yang panjangnya 220 meter?',
    opsi_a: '15 detik',
    opsi_b: '18 detik',
    opsi_c: '20 detik',
    opsi_d: '22 detik',
    opsi_e: '25 detik',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Konversi kecepatan: 72 km/jam = 72.000 m / 3.600 detik = 20 m/detik.\nLangkah 2: Total jarak yang harus ditempuh ujung depan hingga ekor kereta keluar jembatan = 180 + 220 = 400 meter.\nLangkah 3: Waktu = 400 ÷ 20 = 20 detik.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Harga sebuah tas setelah mendapat diskon 30% adalah Rp210.000. Berapakah harga asli tas tersebut sebelum diskon?',
    opsi_a: 'Rp273.000',
    opsi_b: 'Rp280.000',
    opsi_c: 'Rp290.000',
    opsi_d: 'Rp300.000',
    opsi_e: 'Rp320.000',
    jawaban_benar: 'D',
    pembahasan:
      'Langkah 1: Harga setelah diskon 30% adalah 70% dari harga awal.\nLangkah 2: 0,70 × Harga Awal = 210.000 -> Harga Awal = 210.000 ÷ 0,7 = Rp300.000.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Diketahui P = 1/(1/3 + 1/6) dan Q = 2. Hubungan antara P dan Q adalah...',
    opsi_a: 'P > Q',
    opsi_b: 'P < Q',
    opsi_c: 'P = Q',
    opsi_d: 'P = 2Q',
    opsi_e: 'Tidak dapat ditentukan',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Hitung penyebut P: 1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2.\nLangkah 2: P = 1 ÷ (1/2) = 2.\nLangkah 3: Karena Q = 2, maka P = Q.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Sebuah wadah berbentuk silinder terisi air 2/5 bagian. Setelah ditambahkan 18 liter air, wadah tersebut terisi menjadi 7/10 bagian. Kapasitas penuh wadah tersebut adalah...',
    opsi_a: '45 liter',
    opsi_b: '50 liter',
    opsi_c: '60 liter',
    opsi_d: '72 liter',
    opsi_e: '80 liter',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Selisih bagian terisi = 7/10 - 2/5 = 7/10 - 4/10 = 3/10 bagian.\nLangkah 2: 3/10 × Kapasitas = 18 liter -> Kapasitas = 18 × (10/3) = 60 liter.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Dalam ruang arsip terdapat 4 rak lemari. Setiap rak memuat 6 boks dokumen, dan setiap boks berisi 15 berkas laporan. Jika 1/3 dari total berkas sudah didigitalisasi, berapa berkas yang belum didigitalisasi?',
    opsi_a: '120 berkas',
    opsi_b: '180 berkas',
    opsi_c: '240 berkas',
    opsi_d: '270 berkas',
    opsi_e: '300 berkas',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Total berkas = 4 × 6 × 15 = 360 berkas.\nLangkah 2: Belum didigitalisasi = (1 - 1/3) × 360 = (2/3) × 360 = 240 berkas.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Dalam evaluasi beban kerja verifikasi berkas perizinan, Tim Alfa membutuhkan waktu x hari untuk menuntaskan satu gelombang berkas jika bekerja sendiri, sedangkan Tim Beta membutuhkan waktu 3 hari lebih lama daripada Tim Alfa. Jika kedua tim berkolaborasi dengan kecepatan masing-masing, seluruh berkas selesai tepat dalam 2 hari. Berapa harikah waktu yang dibutuhkan Tim Alfa bila bekerja sendiri?',
    opsi_a: '2 hari',
    opsi_b: '3 hari',
    opsi_c: '4 hari',
    opsi_d: '5 hari',
    opsi_e: '6 hari',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Susun persamaan laju kerja bersama: 1/x + 1/(x + 3) = 1/2.\nLangkah 2: Samakan penyebut: (2x + 3) / (x² + 3x) = 1/2 -> x² + 3x = 4x + 6 -> x² - x - 6 = 0.\nLangkah 3: Faktorkan: (x - 3)(x + 2) = 0. Karena waktu harus positif, maka x = 3 hari (cek: 1/3 + 1/6 = 1/2).',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Rata-rata pendapatan 5 pedagang pasar dalam sehari adalah Rp420.000. Jika pendapatan tertinggi mereka adalah Rp580.000 dan terendah adalah Rp300.000, berapakah rata-rata pendapatan 3 pedagang lainnya?',
    opsi_a: 'Rp390.000',
    opsi_b: 'Rp400.000',
    opsi_c: 'Rp406.667',
    opsi_d: 'Rp410.000',
    opsi_e: 'Rp420.000',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Total pendapatan 5 pedagang = 5 × 420.000 = Rp2.100.000.\nLangkah 2: Jumlah 3 pedagang lainnya = 2.100.000 - (580.000 + 300.000) = 2.100.000 - 880.000 = Rp1.220.000.\nLangkah 3: Rata-rata = 1.220.000 ÷ 3 = Rp406.666,67 ≈ Rp406.667.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Logis',
    pertanyaan:
      'Semua aplikasi layanan publik wajib lolos uji keamanan siber sebelum diluncurkan. Beberapa aplikasi daerah yang baru dirilis tahun ini ternyata belum lolos uji keamanan siber. Simpulan yang paling tepat adalah...',
    opsi_a: 'Semua aplikasi daerah yang baru dirilis tidak wajib mengikuti uji keamanan siber.',
    opsi_b: 'Beberapa aplikasi daerah yang baru dirilis tahun ini seharusnya belum boleh diluncurkan.',
    opsi_c: 'Uji keamanan siber hanya berlaku bagi aplikasi kementerian pusat.',
    opsi_d: 'Tidak ada satu pun aplikasi daerah yang lolos uji keamanan siber.',
    opsi_e: 'Semua aplikasi yang lolos uji keamanan siber dibuat oleh pemerintah daerah.',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Syarat wajib peluncuran adalah lolos uji keamanan siber.\nLangkah 2: Jika ada aplikasi yang belum lolos namun dirilis, secara logis beberapa aplikasi tersebut melanggar syarat peluncuran (seharusnya belum boleh diluncurkan).',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Analitis',
    pertanyaan:
      'Empat staf (Alvin, Bima, Citra, Dewi) ditempatkan pada 4 meja bernomor 1 sampai 4 berurutan dari kiri ke kanan:\n- Citra duduk tepat di sebelah kiri Dewi.\n- Bima tidak mau duduk di ujung (meja 1 atau 4).\n- Alvin duduk di meja nomor 1.\nSiapakah yang duduk di meja nomor 4?',
    opsi_a: 'Alvin',
    opsi_b: 'Bima',
    opsi_c: 'Citra',
    opsi_d: 'Dewi',
    opsi_e: 'Citra atau Dewi',
    jawaban_benar: 'D',
    pembahasan:
      'Langkah 1: Alvin = 1.\nLangkah 2: Bima tidak di 1 dan 4, maka Bima di 2 atau 3. Agar Citra dan Dewi bisa bersebelahan (Citra kiri Dewi), mereka harus mengisi 2 kursi berdampingan, yakni (3, 4).\nLangkah 3: Oleh karena itu, Bima = 2, Citra = 3, dan Dewi = 4.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Dalam suatu kantor, perbandingan pegawai lulusan S1 dan S2 adalah 7 : 2. Jika selisih jumlah pegawai lulusan S1 dan S2 adalah 35 orang, berapakah jumlah total pegawai kedua jenjang tersebut?',
    opsi_a: '56 orang',
    opsi_b: '63 orang',
    opsi_c: '70 orang',
    opsi_d: '77 orang',
    opsi_e: '84 orang',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Selisih rasio = 7 - 2 = 5 bagian = 35 orang -> 1 bagian = 7 orang.\nLangkah 2: Total rasio = 7 + 2 = 9 bagian -> 9 × 7 = 63 orang.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Unit pelayanan publik mencatat rata-rata waktu tunggu 40 pemohon pada sesi pagi adalah 18 menit, sementara rata-rata waktu tunggu 60 pemohon pada sesi siang adalah 23 menit. Standar pelayanan menetapkan target rata-rata waktu tunggu harian maksimal 20 menit. Evaluasi yang tepat terhadap capaian hari itu adalah...',
    opsi_a: 'Target tercapai karena rata-rata gabungan adalah 19,5 menit',
    opsi_b: 'Target belum tercapai karena rata-rata gabungan adalah 21 menit (melebihi batas 1 menit)',
    opsi_c: 'Target tercapai tepat pada batas 20 menit',
    opsi_d: 'Target belum tercapai karena rata-rata gabungan adalah 20,5 menit',
    opsi_e: 'Target tidak dapat dievaluasi tanpa mengetahui waktu tunggu per individu',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Hitung total waktu tunggu pagi = 40 × 18 = 720 menit.\nLangkah 2: Hitung total waktu tunggu siang = 60 × 23 = 1.380 menit.\nLangkah 3: Rata-rata tertimbang harian = (720 + 1.380) ÷ (40 + 60) = 2.100 ÷ 100 = 21 menit.\nLangkah 4: Karena 21 menit > 20 menit, target maksimal 20 menit belum tercapai (selisih 1 menit).',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Verbal — Analogi',
    pertanyaan: 'ARSIP : SEJARAWAN = ... : ...',
    opsi_a: 'Fosil : Paleontolog',
    opsi_b: 'Obat : Pasien',
    opsi_c: 'Kompor : Koki',
    opsi_d: 'Kamera : Pemandangan',
    opsi_e: 'Buku : Perpustakaan',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Arsip adalah objek peninggalan primer yang diteliti oleh Sejarawan.\nLangkah 2: Fosil adalah objek peninggalan prasejarah yang diteliti oleh Paleontolog.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan dua suku selanjutnya dari deret berikut: 10, 12, 24, 26, 52, 54, ..., ...',
    opsi_a: '108, 110',
    opsi_b: '106, 108',
    opsi_c: '56, 112',
    opsi_d: '108, 216',
    opsi_e: '104, 106',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Pola (+2, ×2): 10+2=12, 12×2=24, 24+2=26, 26×2=52, 52+2=54.\nLangkah 2: 54 × 2 = 108, lalu 108 + 2 = 110.',
  },
  // Tambah 5 soal lagi (71-75)
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Sebuah bus berangkat pukul 06.15 WIB dengan kecepatan rata-rata 60 km/jam dan menempuh jarak 210 km, termasuk berhenti istirahat selama 25 menit di tengah perjalanan. Pada pukul berapakah bus tiba di tujuan?',
    opsi_a: '09.45 WIB',
    opsi_b: '09.55 WIB',
    opsi_c: '10.05 WIB',
    opsi_d: '10.10 WIB',
    opsi_e: '10.15 WIB',
    jawaban_benar: 'D',
    pembahasan:
      'Langkah 1: Waktu berkendara = 210 ÷ 60 = 3,5 jam = 3 jam 30 menit.\nLangkah 2: Total durasi perjalanan = 3 jam 30 menit + 25 menit istirahat = 3 jam 55 menit.\nLangkah 3: Tiba = 06.15 + 3 jam 55 menit = 10.10 WIB.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan bilangan berikutnya pada deret: 200, 193, 179, 158, 130, ...',
    opsi_a: '95',
    opsi_b: '97',
    opsi_c: '99',
    opsi_d: '101',
    opsi_e: '93',
    jawaban_benar: 'A',
    pembahasan:
      'Langkah 1: Hitung pengurangan antarsuku: -7, -14, -21, -28 (kelipatan 7).\nLangkah 2: Pengurangan berikutnya adalah -35 -> 130 - 35 = 95.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Numerik',
    pertanyaan:
      'Suatu tim pengawas memeriksa 320 berkas permohonan dalam 4 jam. Jika tersedia 2 tim tambahan dengan kecepatan kerja sama persis, berapa menit waktu yang diperlukan ketiga tim bekerja bersama untuk memeriksa 600 berkas?',
    opsi_a: '120 menit',
    opsi_b: '135 menit',
    opsi_c: '150 menit',
    opsi_d: '160 menit',
    opsi_e: '180 menit',
    jawaban_benar: 'C',
    pembahasan:
      'Langkah 1: Kecepatan 1 tim = 320 ÷ 4 = 80 berkas/jam.\nLangkah 2: Kecepatan 3 tim bersama = 3 × 80 = 240 berkas/jam.\nLangkah 3: Waktu untuk 600 berkas = 600 ÷ 240 = 2,5 jam = 150 menit.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Penalaran Logis',
    pertanyaan:
      'Jika anggaran disetujui dan tenaga teknis tersedia, maka proyek digitalisasi arsip berjalan tahun ini. Ternyata proyek digitalisasi arsip tidak berjalan tahun ini. Simpulan yang sah adalah...',
    opsi_a: 'Anggaran tidak disetujui dan tenaga teknis tidak tersedia.',
    opsi_b: 'Anggaran tidak disetujui atau tenaga teknis tidak tersedia.',
    opsi_c: 'Anggaran disetujui tetapi tenaga teknis mengundurkan diri semua.',
    opsi_d: 'Proyek digitalisasi arsip pasti berjalan tahun depan.',
    opsi_e: 'Tenaga teknis tersedia namun menolak bekerja.',
    jawaban_benar: 'B',
    pembahasan:
      'Langkah 1: Implikasi: (A ∧ T) -> J. Fakta: ~J.\nLangkah 2: Modus Tollens menghasilkan ~(A ∧ T), yang menurut Hukum De Morgan setara dengan (~A ∨ ~T): anggaran tidak disetujui atau tenaga teknis tidak tersedia.',
  },
  {
    kategori: 'TIU',
    subtopik: 'Deret Angka',
    pertanyaan: 'Tentukan suku yang tepat untuk melengkapi deret: 6, 8, 12, 20, 36, 68, ...',
    opsi_a: '100',
    opsi_b: '116',
    opsi_c: '124',
    opsi_d: '132',
    opsi_e: '140',
    jawaban_benar: 'D',
    pembahasan:
      'Langkah 1: Hitung selisih antarsuku: 8-6=2, 12-8=4, 20-12=8, 36-20=16, 68-36=32.\nLangkah 2: Selisih dikali 2 tiap langkah (2, 4, 8, 16, 32, 64).\nLangkah 3: Suku ke-7 = 68 + 64 = 132.',
  },
];
