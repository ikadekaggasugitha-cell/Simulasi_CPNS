import type { OptionKey, SeedQuestion } from './types';

function makeQuestion(
  subtopik: string,
  pertanyaan: string,
  correctOption: string,
  distractors: [string, string, string, string],
  pembahasan: string,
  slotSeed: number
): SeedQuestion {
  const keys: OptionKey[] = ['A', 'B', 'C', 'D', 'E'];
  const correctIdx = slotSeed % 5;
  const options: string[] = new Array(5);
  options[correctIdx] = correctOption;
  let dIdx = 0;
  for (let i = 0; i < 5; i++) {
    if (i !== correctIdx) {
      options[i] = distractors[dIdx++];
    }
  }
  return {
    kategori: 'TIU',
    subtopik,
    pertanyaan,
    opsi_a: options[0],
    opsi_b: options[1],
    opsi_c: options[2],
    opsi_d: options[3],
    opsi_e: options[4],
    jawaban_benar: keys[correctIdx],
    pembahasan,
  };
}

function uniqueDistractors(correct: string, candidates: string[]): [string, string, string, string] {
  const set = new Set<string>([correct]);
  const out: string[] = [];
  for (const c of candidates) {
    if (!set.has(c)) {
      set.add(c);
      out.push(c);
      if (out.length === 4) break;
    }
  }
  let bump = 1;
  while (out.length < 4) {
    const fallback = `${correct} (alternatif ${bump++})`;
    if (!set.has(fallback)) {
      set.add(fallback);
      out.push(fallback);
    }
  }
  return [out[0], out[1], out[2], out[3]];
}

function formatRupiah(n: number): string {
  return 'Rp' + Math.round(n).toLocaleString('id-ID').replace(/,/g, '.');
}

function generateSeriesQuestions(): SeedQuestion[] {
  const list: SeedQuestion[] = [];
  let idx = 0;

  // 1. Deret Bertingkat Kuadrat: U(n) = start + sum(k=1..n-1) (a*k^2 + b) -> 20 soal
  for (let i = 0; i < 20; i++) {
    const start = 2 + i * 3;
    const shift = i % 4;
    const seq = [start];
    const diffs: number[] = [];
    for (let n = 1; n <= 5; n++) {
      const d = (n + shift) * (n + shift);
      diffs.push(d);
      seq.push(seq[seq.length - 1] + d);
    }
    const nextDiff = (6 + shift) * (6 + shift);
    const ans = seq[seq.length - 1] + nextDiff;
    const distractors = uniqueDistractors(String(ans), [
      String(ans - 2),
      String(ans + 4),
      String(ans - nextDiff + (5 + shift) * (5 + shift)),
      String(ans + 10),
    ]);
    list.push(
      makeQuestion(
        'Deret Angka',
        `Analisis pola pertumbuhan pada barisan bilangan bertingkat berikut: ${seq.join(', ')}, ... Nilai suku ke-7 adalah...`,
        String(ans),
        distractors,
        `Langkah 1: Hitung selisih antarsuku: ${diffs.join(', ')}.\nLangkah 2: Selisih merupakan bilangan kuadrat berurutan (${1 + shift}² hingga ${5 + shift}²).\nLangkah 3: Selisih berikutnya adalah ${6 + shift}² = ${nextDiff}, sehingga suku ke-7 = ${seq[seq.length - 1]} + ${nextDiff} = ${ans}.`,
        idx++
      )
    );
  }

  // 2. Deret Rekursif Campuran (×k ± m) -> 25 soal
  for (let i = 0; i < 25; i++) {
    const start = 3 + (i % 7);
    const mult = 2 + (i % 2); // 2 or 3
    const add = (i % 5) + 1;
    const sign = i % 2 === 0 ? 1 : -1;
    const seq = [start];
    for (let k = 0; k < 5; k++) {
      seq.push(seq[k] * mult + sign * add);
    }
    const next1 = seq[5] * mult + sign * add;
    const next2 = next1 * mult + sign * add;
    const ans = `${next1}, ${next2}`;
    const distractors = uniqueDistractors(ans, [
      `${next1 - 2}, ${next2 - 4}`,
      `${next1 + 2}, ${next2 + 4}`,
      `${next1 + 1}, ${next2 + 3}`,
      `${next1 - 1}, ${next2 - 2}`,
    ]);
    const opStr = sign > 0 ? `+ ${add}` : `- ${add}`;
    list.push(
      makeQuestion(
        'Deret Angka',
        `Tentukan dua suku berikutnya yang memenuhi pola rekursif: ${seq.join(', ')}, ..., ...`,
        ans,
        distractors,
        `Langkah 1: Uji hubungan antarsuku dengan rumus U(n) = ${mult} × U(n-1) ${opStr}.\nLangkah 2: Suku ke-7 = ${mult} × ${seq[5]} ${opStr} = ${next1}.\nLangkah 3: Suku ke-8 = ${mult} × ${next1} ${opStr} = ${next2}.`,
        idx++
      )
    );
  }

  // 3. Deret Dua Larik Selang-Seling (20 soal)
  for (let i = 0; i < 20; i++) {
    const a0 = 10 + i * 2;
    const da = 4 + (i % 5);
    const b0 = 90 - i;
    const db = -(3 + (i % 4));
    const seq = [
      a0,
      b0,
      a0 + da,
      b0 + db,
      a0 + 2 * da,
      b0 + 2 * db,
      a0 + 3 * da,
    ];
    const nextB = b0 + 3 * db;
    const nextA = a0 + 4 * da;
    const ans = `${nextB}, ${nextA}`;
    const distractors = uniqueDistractors(ans, [
      `${nextA}, ${nextB}`,
      `${nextB - 2}, ${nextA + 2}`,
      `${nextB + 3}, ${nextA - 2}`,
      `${nextB - 1}, ${nextA + 4}`,
    ]);
    list.push(
      makeQuestion(
        'Deret Angka',
        `Perhatikan barisan dua larik berikut: ${seq.join(', ')}, ..., ... Pasangan nilai suku ke-8 dan ke-9 berturut-turut adalah...`,
        ans,
        distractors,
        `Langkah 1: Pisahkan larik ganjil: ${a0}, ${a0 + da}, ${a0 + 2 * da}, ${a0 + 3 * da} (pola +${da}) -> suku ke-9 = ${nextA}.\nLangkah 2: Pisahkan larik genap: ${b0}, ${b0 + db}, ${b0 + 2 * db} (pola ${db}) -> suku ke-8 = ${nextB}.\nLangkah 3: Urutan suku ke-8 lalu ke-9 adalah ${ans}.`,
        idx++
      )
    );
  }

  // 4. Deret Tiga Larik (20 soal)
  for (let i = 0; i < 20; i++) {
    const p0 = 2 + i;
    const q0 = 100 - i * 2;
    const r0 = 5 + (i % 4);
    const seq = [
      p0, q0, r0,
      p0 * 2, q0 - 6, r0 + 4,
      p0 * 4, q0 - 12, r0 + 8,
    ];
    const nextP = p0 * 8;
    const nextQ = q0 - 18;
    const nextR = r0 + 12;
    const ans = `${nextP}, ${nextQ}, ${nextR}`;
    const distractors = uniqueDistractors(ans, [
      `${p0 * 6}, ${nextQ}, ${nextR}`,
      `${nextP}, ${nextQ + 4}, ${nextR}`,
      `${nextP}, ${nextQ}, ${nextR - 2}`,
      `${nextP - 4}, ${nextQ - 2}, ${nextR + 2}`,
    ]);
    list.push(
      makeQuestion(
        'Deret Angka',
        `Lengkapi tiga suku berikutnya pada deret tiga larik berikut: ${seq.join(', ')}, ..., ..., ...`,
        ans,
        distractors,
        `Langkah 1: Kelompokkan menjadi 3 larik berulang (indeks mod 3):\n- Larik 1: ${p0}, ${p0 * 2}, ${p0 * 4} (pola ×2) -> ${nextP}.\n- Larik 2: ${q0}, ${q0 - 6}, ${q0 - 12} (pola -6) -> ${nextQ}.\n- Larik 3: ${r0}, ${r0 + 4}, ${r0 + 8} (pola +4) -> ${nextR}.\nLangkah 2: Tiga suku berikutnya adalah ${ans}.`,
        idx++
      )
    );
  }

  // 5. Deret Fibonacci Variasi dengan Konstanta (15 soal)
  for (let i = 0; i < 15; i++) {
    const u1 = 1 + (i % 5);
    const u2 = 2 + (i % 4);
    const k = (i % 3) + 1;
    const seq = [u1, u2];
    for (let n = 2; n < 6; n++) {
      seq.push(seq[n - 1] + seq[n - 2] + k);
    }
    const ans = seq[5] + seq[4] + k;
    const distractors = uniqueDistractors(String(ans), [
      String(ans - k),
      String(ans + k),
      String(ans - 2),
      String(ans + 4),
    ]);
    list.push(
      makeQuestion(
        'Deret Angka',
        `Identifikasi aturan penjumlahan berantai pada deret: ${seq.join(', ')}, ... Angka selanjutnya adalah...`,
        String(ans),
        distractors,
        `Langkah 1: Uji penjumlahan dua suku sebelumnya ditambah konstanta: U(n) = U(n-1) + U(n-2) + ${k}.\nLangkah 2: Cek suku ke-3: ${u1} + ${u2} + ${k} = ${seq[2]}; suku ke-6: ${seq[3]} + ${seq[4]} + ${k} = ${seq[5]}.\nLangkah 3: Suku ke-7 = ${seq[4]} + ${seq[5]} + ${k} = ${ans}.`,
        idx++
      )
    );
  }

  // 6. Deret Pecahan (20 soal)
  for (let i = 0; i < 20; i++) {
    const numStart = 1 + (i % 7);
    const numStep = 2 + Math.floor(i / 7);
    const denBase = 2 + (i % 3);
    const seq: string[] = [];
    for (let k = 0; k < 5; k++) {
      const n = numStart + k * numStep;
      const d = Math.pow(denBase, k + 1);
      seq.push(`${n}/${d}`);
    }
    const ansNum = numStart + 5 * numStep;
    const ansDen = Math.pow(denBase, 6);
    const ans = `${ansNum}/${ansDen}`;
    const distractors = uniqueDistractors(ans, [
      `${ansNum + 1}/${ansDen}`,
      `${ansNum}/${(ansDen / denBase) * (denBase + 1)}`,
      `${ansNum - numStep}/${ansDen}`,
      `${ansNum + numStep}/${ansDen}`,
    ]);
    list.push(
      makeQuestion(
        'Deret Angka',
        `Tentukan suku ke-6 dari barisan pecahan berikut: ${seq.join(', ')}, ...`,
        ans,
        distractors,
        `Langkah 1: Pisahkan pola pembilang dan penyebut.\nPembilang: bertambah +${numStep} setiap langkah -> ${numStart + 4 * numStep} + ${numStep} = ${ansNum}.\nPenyebut: dikali ${denBase} setiap langkah -> ${Math.pow(denBase, 5)} × ${denBase} = ${ansDen}.\nLangkah 2: Suku ke-6 = ${ans}.`,
        idx++
      )
    );
  }

  // 7. Deret Operasi Bergantian (+a, ×b) dan Cari Bilangan Salah (20 soal)
  for (let i = 0; i < 10; i++) {
    const start = 2 + i;
    const add = 2 + (i % 4);
    const mult = 2 + (i % 2);
    const seq = [start];
    for (let step = 0; step < 5; step++) {
      const prev = seq[seq.length - 1];
      seq.push(step % 2 === 0 ? prev + add : prev * mult);
    }
    const next1 = seq[5] * mult; // step 5 is odd -> * mult
    const next2 = next1 + add;
    const ans = `${next1}, ${next2}`;
    const distractors = uniqueDistractors(ans, [
      `${seq[5] + add}, ${(seq[5] + add) * mult}`,
      `${next1 - 2}, ${next2 - 2}`,
      `${next1 + add}, ${next2 + mult}`,
      `${next1 * mult}, ${next2 + 1}`,
    ]);
    list.push(
      makeQuestion(
        'Deret Angka',
        `Tentukan dua nilai pengganti tanda tanya pada deret operasi bergantian: ${seq.join(', ')}, ?, ?`,
        ans,
        distractors,
        `Langkah 1: Pola bergantian (+${add}, ×${mult}).\nLangkah 2: Setelah suku ke-6 (${seq[5]}), operasi berikutnya ×${mult} = ${next1}, lalu +${add} = ${next2}.`,
        idx++
      )
    );
  }

  for (let i = 0; i < 10; i++) {
    const start = 3 + i;
    const mult = 2;
    const add = (i % 4) + 1;
    const trueSeq = [start];
    for (let k = 0; k < 6; k++) {
      trueSeq.push(trueSeq[k] * mult + add);
    }
    const errPos = 3 + (i % 3); // index 3, 4, or 5
    const wrongVal = trueSeq[errPos] + (i % 2 === 0 ? 4 : -4);
    const shown = [...trueSeq];
    shown[errPos] = wrongVal;
    const distractors = uniqueDistractors(String(wrongVal), [
      String(shown[1]),
      String(shown[2]),
      String(shown[errPos === 3 ? 4 : 3]),
      String(shown[6]),
    ]);
    list.push(
      makeQuestion(
        'Deret Angka',
        `Satu bilangan pada deret berikut menyimpang dari pola utama: ${shown.join(', ')}. Bilangan manakah yang seharusnya diperbaiki?`,
        String(wrongVal),
        distractors,
        `Langkah 1: Pola yang konsisten pada mayoritas suku adalah U(n) = 2 × U(n-1) + ${add}.\nLangkah 2: Mengikuti pola tersebut, setelah ${trueSeq[errPos - 1]} seharusnya bernilai 2 × ${trueSeq[errPos - 1]} + ${add} = ${trueSeq[errPos]}, bukan ${wrongVal}.`,
        idx++
      )
    );
  }

  return list; // 20 + 25 + 20 + 20 + 15 + 20 + 20 = 140 soal Deret Angka!
}

function generateNumericalWordProblems(): SeedQuestion[] {
  const list: SeedQuestion[] = [];
  let idx = 0;

  // 1. Proyek terhenti sementara -> tambahan pekerja (20 soal)
  const proyekTopics = [
    'pembangunan pos pelayanan desa',
    'renovasi gedung arsip daerah',
    'perbaikan drainase jalan utama',
    'pembangunan perpustakaan kelurahan',
    'modernisasi jaringan irigasi teknis',
  ];
  const pekerjaOpts = [12, 15, 18, 20, 24];
  for (let i = 0; i < 20; i++) {
    const workers = pekerjaOpts[i % pekerjaOpts.length];
    const extra = 3 + (i % 6);
    const totalWorkersNeeded = workers + extra;
    // Choose remDays such that totalWorkDoneLeft = remDays * totalWorkersNeeded
    const remDays = 8 + (i % 5) * 2;
    const stopDays = 3 + (i % 4);
    // workLeft = remDays * totalWorkersNeeded = (origRemDays) * workers
    // Ensure divisible cleanly by choosing scale
    const remWork = remDays * totalWorkersNeeded;
    // Let's make sure remWork is divisible by workers: pick remDays * totalWorkersNeeded divisible by workers
    const k = 1 + (i % 3);
    const dRem = workers * k; // wait, we want small days (6..24): use exact integer construction
    const baseRemOrig = 12 + (i % 4) * 3; // e.g., 12, 15, 18, 21
    const workedDays = 10 + (i % 5) * 2;
    const stop = 4; // e.g., baseRemOrig - stop = remaining days
    // Use clean LCM pairs: (w, tOrigRem, stop, ansExtra)
    const pairs: Array<[number, number, number, number]> = [
      [15, 16, 4, 5],   // 15*16 = 240; 240/12 = 20 -> +5
      [18, 14, 2, 3],   // 18*14 = 252; 252/12 = 21 -> +3
      [20, 15, 3, 5],   // 20*15 = 300; 300/12 = 25 -> +5
      [24, 15, 3, 6],   // 24*15 = 360; 360/12 = 30 -> +6
      [12, 20, 5, 4],   // 12*20 = 240; 240/15 = 16 -> +4
      [16, 18, 6, 8],   // 16*18 = 288; 288/12 = 24 -> +8
      [25, 18, 3, 5],   // 25*18 = 450; 450/15 = 30 -> +5
      [30, 14, 4, 12],  // 30*14 = 420; 420/10 = 42 -> +12
      [21, 16, 4, 7],   // 21*16 = 336; 336/12 = 28 -> +7
      [28, 15, 5, 14],  // 28*15 = 420; 420/10 = 42 -> +14
    ];
    const [w, origRem, stopD, ansExtra] = pairs[i % pairs.length];
    const workedD = 8 + Math.floor(i / 10) * 6 + (i % 3) * 2;
    const totalD = workedD + origRem;
    const sisaHari = totalD - workedD - stopD;
    const totalW = w + ansExtra;
    const topic = proyekTopics[i % proyekTopics.length];
    const ans = `${ansExtra} pekerja`;
    const distractors = uniqueDistractors(ans, [
      `${ansExtra + 2} pekerja`,
      `${Math.max(1, ansExtra - 2)} pekerja`,
      `${totalW} pekerja`,
      `${ansExtra + 4} pekerja`,
    ]);
    list.push(
      makeQuestion(
        'Penalaran Numerik',
        `Proyek ${topic} direncanakan selesai dalam ${totalD} hari oleh ${w} pekerja. Setelah berjalan ${workedD} hari, pengerjaan sempat terhenti ${stopD} hari akibat kendala pasokan material. Agar proyek tetap selesai sesuai jadwal awal, berapa pekerja tambahan yang diperlukan?`,
        ans,
        distractors,
        `Langkah 1: Sisa beban kerja setelah ${workedD} hari = (${totalD} - ${workedD}) × ${w} = ${origRem} × ${w} = ${origRem * w} orang-hari.\nLangkah 2: Sisa waktu kerja efektif = ${totalD} - ${workedD} - ${stopD} = ${sisaHari} hari.\nLangkah 3: Pekerja total yang dibutuhkan = ${origRem * w} ÷ ${sisaHari} = ${totalW} pekerja.\nLangkah 4: Tambahan pekerja = ${totalW} - ${w} = ${ansExtra} pekerja.`,
        idx++
      )
    );
    void dRem;
    void remWork;
    void remDays;
    void stopDays;
    void stop;
    void baseRemOrig;
  }

  // 2. Efisiensi Pengadaan / Diskon Bertingkat + PPN atau Banding Vendor (20 soal)
  const itemsPengadaan = [
    'paket perangkat komputer pelayanan',
    'mesin pemindai arsip berkecepatan tinggi',
    'perangkat proyektor ruang rapat',
    'printer dokumen resmi kantor',
    'sistem pendingin ruang server',
  ];
  for (let i = 0; i < 20; i++) {
    const baseHarga = (3 + (i % 6)) * 1_000_000; // 3jt..8jt
    const d1 = 10 + (i % 3) * 5; // 10, 15, 20
    const d2 = 10 + (i % 2) * 10; // 10, 20
    const ppn = 11;
    const afterD1 = baseHarga * ((100 - d1) / 100);
    const afterD2 = afterD1 * ((100 - d2) / 100);
    const totalPay = Math.round(afterD2 * (1 + ppn / 100));
    const wrongSumDisc = Math.round(baseHarga * ((100 - (d1 + d2)) / 100) * 1.11);
    const noPpn = Math.round(afterD2);
    const ans = formatRupiah(totalPay);
    const distractors = uniqueDistractors(ans, [
      formatRupiah(wrongSumDisc),
      formatRupiah(noPpn),
      formatRupiah(totalPay + 55000),
      formatRupiah(totalPay - 44000),
    ]);
    list.push(
      makeQuestion(
        'Penalaran Numerik',
        `Dalam pengadaan ${itemsPengadaan[i % itemsPengadaan.length]} dengan harga katalog ${formatRupiah(baseHarga)}, penyedia memberikan potongan bertingkat ${d1}% lalu ${d2}%, kemudian dikenakan PPN 11% atas harga setelah diskon. Berapakah total anggaran yang harus dibayar instansi?`,
        ans,
        distractors,
        `Langkah 1: Harga setelah diskon pertama ${d1}% = ${formatRupiah(baseHarga)} × ${(100 - d1) / 100} = ${formatRupiah(afterD1)}.\nLangkah 2: Harga setelah diskon kedua ${d2}% = ${formatRupiah(afterD1)} × ${(100 - d2) / 100} = ${formatRupiah(afterD2)}.\nLangkah 3: Tambah PPN 11% = ${formatRupiah(afterD2)} × 1,11 = ${ans}.`,
        idx++
      )
    );
  }

  // 3. Kecepatan Berpapasan / Menyusul Beda Waktu Berangkat (20 soal)
  for (let i = 0; i < 20; i++) {
    const v1 = 45 + (i % 5) * 5; // 45, 50, 55, 60, 65
    const v2 = 50 + (i % 4) * 10; // 50, 60, 70, 80
    const meetHoursAfterSecond = 1 + (i % 3) * 0.5; // 1, 1.5, 2 jam
    const distance = Math.round(v1 * 0.5 + (v1 + v2) * meetHoursAfterSecond);
    const startH = 6 + (i % 3); // 06.00, 07.00, 08.00
    const startSecondStr = `0${startH}.30 WIB`;
    const totalMinFromSecond = Math.round(meetHoursAfterSecond * 60);
    const finalMin = 30 + totalMinFromSecond;
    const arriveH = startH + Math.floor(finalMin / 60);
    const arriveM = finalMin % 60;
    const ans = `${String(arriveH).padStart(2, '0')}.${String(arriveM).padStart(2, '0')} WIB`;
    const distractors = uniqueDistractors(ans, [
      `${String(arriveH).padStart(2, '0')}.${String((arriveM + 15) % 60).padStart(2, '0')} WIB`,
      `${String(arriveH - 1).padStart(2, '0')}.${String((arriveM + 45) % 60).padStart(2, '0')} WIB`,
      `${String(arriveH + 1).padStart(2, '0')}.${String(arriveM).padStart(2, '0')} WIB`,
      `${String(arriveH).padStart(2, '0')}.${String((arriveM + 30) % 60).padStart(2, '0')} WIB`,
    ]);
    list.push(
      makeQuestion(
        'Penalaran Numerik',
        `Mobil logistik A dan B harus bertemu di jalur provinsi yang menghubungkan dua kota berjarak ${distance} km. Mobil A berangkat dari kota barat pukul 0${startH}.00 WIB dengan kecepatan ${v1} km/jam, sedangkan Mobil B berangkat dari kota timur pukul ${startSecondStr} dengan kecepatan ${v2} km/jam. Pada pukul berapakah keduanya berpapasan?`,
        ans,
        distractors,
        `Langkah 1: Jarak tempuh Mobil A selama 30 menit (0,5 jam) sebelum Mobil B berangkat = ${v1} × 0,5 = ${v1 * 0.5} km.\nLangkah 2: Sisa jarak pukul ${startSecondStr} = ${distance} - ${v1 * 0.5} = ${distance - v1 * 0.5} km.\nLangkah 3: Kecepatan relatif = ${v1} + ${v2} = ${v1 + v2} km/jam -> waktu berpapasan = ${distance - v1 * 0.5} ÷ ${v1 + v2} = ${meetHoursAfterSecond} jam (${totalMinFromSecond} menit).\nLangkah 4: Waktu berpapasan = ${startSecondStr} + ${totalMinFromSecond} menit = ${ans}.`,
        idx++
      )
    );
  }

  // 4. Analisis Rata-Rata Gabungan & Skor Evaluasi (20 soal)
  for (let i = 0; i < 20; i++) {
    const n1 = 15 + (i % 5) * 5; // 15..35
    const n2 = 5 + (i % 4) * 5; // 5..20
    const avg1 = 72 + (i % 7);
    const avg2 = avg1 + 6 + (i % 5);
    const totalAll = n1 * avg1 + n2 * avg2;
    const totalN = n1 + n2;
    // Choose n1, n2 or ensure exact integer avgAll: adjust avg2 so (n2 * (avg2 - avg1)) divisible by totalN!
    // Simple exact trick: set avgAll = avg1 + deltaAll, then avg2 = avg1 + deltaAll * (n1 + n2) / n2!
    const cleanSets: Array<[number, number, number]> = [
      [20, 5, 2],  // avg2 = avg1 + 2*25/5 = avg1 + 10
      [24, 6, 3],  // avg2 = avg1 + 3*30/6 = avg1 + 15
      [18, 6, 2],  // avg2 = avg1 + 2*24/6 = avg1 + 8
      [28, 7, 2],  // avg2 = avg1 + 2*35/7 = avg1 + 10
      [30, 10, 3], // avg2 = avg1 + 3*40/10 = avg1 + 12
    ];
    const [cN1, cN2, delta] = cleanSets[i % cleanSets.length];
    const cAvg1 = 70 + (i % 9);
    const cAvgAll = cAvg1 + delta;
    const cAvg2 = cAvg1 + (delta * (cN1 + cN2)) / cN2;
    const ans = String(cAvg2);
    const distractors = uniqueDistractors(ans, [
      String(cAvg2 - 2),
      String(cAvg2 + 2),
      String(cAvgAll + delta),
      String(cAvg2 - 4),
    ]);
    list.push(
      makeQuestion(
        'Penalaran Numerik',
        `Rata-rata skor uji kompetensi ${cN1} peserta gelombang I adalah ${cAvg1}. Setelah ${cN2} peserta gelombang susulan mengikuti ujian yang sama, rata-rata gabungan seluruh peserta naik menjadi ${cAvgAll}. Berapakah rata-rata skor ${cN2} peserta gelombang susulan tersebut?`,
        ans,
        distractors,
        `Langkah 1: Total skor ${cN1} peserta awal = ${cN1} × ${cAvg1} = ${cN1 * cAvg1}.\nLangkah 2: Total skor ${cN1 + cN2} peserta gabungan = ${cN1 + cN2} × ${cAvgAll} = ${(cN1 + cN2) * cAvgAll}.\nLangkah 3: Selisih skor ${cN2} peserta susulan = ${(cN1 + cN2) * cAvgAll - cN1 * cAvg1}.\nLangkah 4: Rata-rata peserta susulan = ${(cN1 + cN2) * cAvgAll - cN1 * cAvg1} ÷ ${cN2} = ${ans}.`,
        idx++
      )
    );
    void totalAll;
    void totalN;
    void avg2;
    void avg1;
    void n2;
    void n1;
  }

  // 5. Laju Pengisian / Kerja Tim Gabungan (20 soal)
  const rateTriples: Array<[number, number, number, number]> = [
    [4, 6, 12, 3],   // 1/4 + 1/6 - 1/12 = 1/3 -> 3 jam
    [3, 6, 6, 3],    // 1/3 + 1/6 - 1/6 = 1/3 -> 3 jam
    [4, 12, 6, 6],   // 1/4 + 1/12 - 1/6 = 2/12 = 1/6 -> 6 jam
    [3, 4, 12, 2],   // 1/3 + 1/4 - 1/12 = 6/12 = 1/2 -> 2 jam
    [6, 10, 15, 5],  // 1/6 + 1/10 - 1/15 = (5+3-2)/30 = 6/30 = 1/5 -> 5 jam
    [4, 12, 12, 4],  // 1/4 + 1/12 - 1/12 = 1/4 -> 4 jam
    [2, 6, 3, 3],    // 1/2 + 1/6 - 1/3 = 2/6 = 1/3 -> 3 jam
    [5, 10, 10, 5],  // 1/5 -> 5 jam
    [6, 8, 24, 4],   // 1/6 + 1/8 - 1/24 = (4+3-1)/24 = 6/24 = 1/4 -> 4 jam
    [4, 5, 20, 2.5], // 1/4 + 1/5 - 1/20 = 8/20 = 2/5 -> 2.5 jam
    [2, 4, 4, 2],    // 1/2 + 1/4 - 1/4 = 1/2 -> 2 jam
    [6, 12, 12, 6],  // 1/6 -> 6 jam
    [5, 20, 20, 5],  // 1/5 -> 5 jam
  ];
  const tankContexts = [
    'penampungan air bersih balai desa',
    'kolam cadangan air pemadam kebakaran',
    'bak penampungan air bersih rumah sakit',
    'reservoir irigasi pertanian terpadu',
    'tangki cadangan gedung pelayanan publik',
    'menara air kompleks perkantoran pemerintah',
    'bak instalasi pengolahan air minum kecamatan',
    'embung penampung cadangan air kawasan industri',
    'tangki hidran keselamatan gedung arsip',
    'bak tampung air bersih sekolah berasrama',
  ];
  for (let i = 0; i < 20; i++) {
    const [a, b, c, ansH] = rateTriples[i % rateTriples.length];
    const ctx = tankContexts[i % tankContexts.length];
    const ans = `${ansH} jam`;
    const distractors = uniqueDistractors(ans, [
      `${ansH + 1} jam`,
      `${ansH + 2} jam`,
      `${Math.max(0.5, ansH - 1)} jam`,
      `${ansH + 0.5} jam`,
    ]);
    list.push(
      makeQuestion(
        'Penalaran Numerik',
        `Sebuah ${ctx} memiliki dua pompa pengisi dan satu katup pembuang. Pompa I mengisi penuh dalam ${a} jam, Pompa II dalam ${b} jam, sedangkan katup pembuang mengosongkan penuh dalam ${c} jam. Jika ketiganya dibuka bersamaan dari kondisi kosong, berapa lama hingga penuh?`,
        ans,
        distractors,
        `Langkah 1: Laju gabungan per jam = 1/${a} + 1/${b} - 1/${c}.\nLangkah 2: Hitung hasil gabungan = 1/${ansH} bagian per jam.\nLangkah 3: Waktu hingga penuh = 1 ÷ (1/${ansH}) = ${ans}.`,
        idx++
      )
    );
  }

  // 6. Perbandingan Kuantitatif HOTS P vs Q (20 soal)
  for (let i = 0; i < 20; i++) {
    const a = 5 + i;
    const diff = 2 + (i % 4);
    const b = a - diff; // a > b
    const prodDiff = a * a - b * b;
    const sumVal = a + b;
    const qVal = sumVal + (i % 3 === 0 ? -3 : i % 3 === 1 ? 3 : 0);
    const relation = sumVal > qVal ? 'P > Q' : sumVal < qVal ? 'P < Q' : 'P = Q';
    const distractors = uniqueDistractors(relation, [
      'P > Q',
      'P < Q',
      'P = Q',
      'P + Q = 0',
      'Hubungan P dan Q tidak dapat ditentukan',
    ]);
    list.push(
      makeQuestion(
        'Penalaran Numerik',
        `Diketahui x² - y² = ${prodDiff} dan x - y = ${diff}. Jika P = x + y dan Q = ${qVal}, kesimpulan hubungan kuantitatif yang tepat antara P dan Q adalah...`,
        relation,
        distractors,
        `Langkah 1: Gunakan faktorisasi selisih kuadrat x² - y² = (x - y)(x + y).\nLangkah 2: ${prodDiff} = ${diff} × (x + y) -> P = x + y = ${prodDiff} ÷ ${diff} = ${sumVal}.\nLangkah 3: Bandingkan P = ${sumVal} dengan Q = ${qVal}, diperoleh ${relation}.`,
        idx++
      )
    );
  }

  // 7. Diagram Venn / Survei Kebijakan Publik (20 soal)
  for (let i = 0; i < 20; i++) {
    const total = 120 + (i % 5) * 20; // 120..200
    const both = 18 + (i % 8) * 3;
    const neither = 10 + (i % 4) * 5;
    const sumAB = total - neither + both;
    const aOnlyPlusBoth = Math.floor(sumAB * 0.55) + (i % 5);
    const bCount = sumAB - aOnlyPlusBoth;
    const ans = `${both} orang`;
    const distractors = uniqueDistractors(ans, [
      `${both + 4} orang`,
      `${Math.max(2, both - 4)} orang`,
      `${both + 8} orang`,
      `${Math.max(1, both - 6)} orang`,
    ]);
    list.push(
      makeQuestion(
        'Penalaran Numerik',
        `Dalam survei evaluasi layanan terhadap ${total} warga, ${aOnlyPlusBoth} orang aktif mengakses portal aduan web, ${bCount} orang menggunakan aplikasi seluler, dan ${neither} orang memilih layanan tatap muka saja tanpa keduanya. Banyaknya warga yang menggunakan kedua kanal digital (web dan aplikasi) adalah...`,
        ans,
        distractors,
        `Langkah 1: Gunakan prinsip inklusi-eksklusi himpunan: n(S) = n(Web) + n(Aplikasi) - n(Keduanya) + n(Tatap Muka).\nLangkah 2: ${total} = ${aOnlyPlusBoth} + ${bCount} - x + ${neither} = ${aOnlyPlusBoth + bCount + neither} - x.\nLangkah 3: x = ${aOnlyPlusBoth + bCount + neither} - ${total} = ${both} orang.`,
        idx++
      )
    );
  }

  // 8. Realokasi Anggaran / Rasio 3 Bagian (20 soal)
  for (let i = 0; i < 20; i++) {
    const rA = 2 + (i % 3); // 2,3,4
    const rB = 3 + (i % 2) * 2; // 3 or 5
    const rC = 5 + (i % 4); // 5..8
    const unit = (35 + (i % 7) * 10) * 1000; // 35rb..95rb (7 values -> lcm(12,7)=84 > 20)
    const diffCB = (rC - rB) * unit;
    const total = (rA + rB + rC) * unit;
    const ans = formatRupiah(total);
    const distractors = uniqueDistractors(ans, [
      formatRupiah(total + unit * 2),
      formatRupiah(total - unit * 2),
      formatRupiah(total + unit),
      formatRupiah(total - unit),
    ]);
    list.push(
      makeQuestion(
        'Penalaran Numerik',
        `Anggaran operasional tiga tim lapangan (Tim X, Tim Y, Tim Z) berbanding ${rA} : ${rB} : ${rC}. Jika selisih anggaran Tim Z dan Tim Y adalah ${formatRupiah(diffCB)}, berapakah total keseluruhan anggaran ketiga tim tersebut?`,
        ans,
        distractors,
        `Langkah 1: Selisih rasio Tim Z dan Tim Y = ${rC} - ${rB} = ${rC - rB} bagian, senilai ${formatRupiah(diffCB)}.\nLangkah 2: Nilai 1 bagian = ${formatRupiah(diffCB)} ÷ ${rC - rB} = ${formatRupiah(unit)}.\nLangkah 3: Total rasio = ${rA} + ${rB} + ${rC} = ${rA + rB + rC} bagian -> ${rA + rB + rC} × ${formatRupiah(unit)} = ${ans}.`,
        idx++
      )
    );
  }

  return list; // 8 * 20 = 160 soal Penalaran Numerik!
}

function generateLogicAnalyticVerbalQuestions(): SeedQuestion[] {
  const list: SeedQuestion[] = [];
  let idx = 0;

  // 1. Silogisme Modus Tollens + Hukum De Morgan (25 soal)
  const syllogismScenarios: Array<[string, string, string]> = [
    ['sistem keamanan jaringan aktif', 'cadangan data harian terverifikasi', 'portal layanan publik dibuka'],
    ['dokumen amdal disetujui', 'kajian lalu lintas rampung', 'izin pembangunan kawasan diterbitkan'],
    ['anggaran hibah cair', 'tim pendamping lapangan siap', 'program pemberdayaan UMKM dimulai'],
    ['verifikasi NIK valid', 'berkas ijazah terunggah', 'kartu peserta ujian dapat dicetak'],
    ['sensor debit sungai normal', 'pintu bendungan berfungsi baik', 'jalur wisata lembah dibuka'],
    ['audit mutu internal lulus', 'standar layanan terpasang', 'predikat zona integritas diusulkan'],
    ['pasokan logistik tiba', 'armada distribusi tersedia', 'operasi pasar murah dilaksanakan'],
    ['perangkat server stabil', 'sertifikat enkripsi diperbarui', 'layanan tanda tangan elektronik beroperasi'],
    ['kurikulum revisi disahkan', 'modul pelatihan tersedia', 'diklat fungsional angkatan baru dimulai'],
    ['data kemiskinan mutakhir', 'validasi kelurahan selesai', 'penyaluran bantuan sosial dicairkan'],
    ['izin prinsip diterbitkan', 'analisis dampak sosial selesai', 'proyek transportasi massal dibangun'],
    ['stok obat esensial cukup', 'tenaga farmasi bertugas', 'layanan puskesmas 24 jam dibuka'],
    ['uji laik jalan lulus', 'trayek resmi diterbitkan', 'bus perintis daerah dioperasikan'],
    ['regulasi turunan terbit', 'sosialisasi publik tuntas', 'tarif retribusi baru diberlakukan'],
    ['uji petik lapangan selesai', 'sampel laboratorium negatif', 'sertifikat keamanan pangan diberikan'],
    ['rencana tata ruang disepakati', 'zona hijau terlindungi', 'kawasan industri baru ditetapkan'],
    ['jaringan listrik cadangan aktif', 'pendingin ruang server optimal', 'pusat data nasional beroperasi penuh'],
    ['laporan keuangan wajar', 'aset daerah terinventarisasi', 'penghargaan tata kelola diberikan'],
    ['sistem antrean daring normal', 'petugas loket lengkap', 'layanan terpadu satu pintu berjalan'],
    ['persetujuan DPRD tercapai', 'dokumen DPA disahkan', 'lelang proyek infrastruktur dibuka'],
    ['evaluasi kinerja tuntas', 'indikator sasaran tercapai', 'tunjangan kinerja dicairkan'],
    ['uji emisi kendaraan lulus', 'parkir zona ramah lingkungan siap', 'izin operasional angkutan diperpanjang'],
    ['rekonsiliasi data selesai', 'kode rekening sesuai', 'pencairan dana desa diproses'],
    ['kajian risiko banjir rampung', 'pompa pengendali terpasang', 'kawasan pemukiman baru disetujui'],
    ['protokol darurat dipahami', 'jalur evakuasi bebas hambatan', 'simulasi kesiapsiagaan gedung digelar'],
  ];

  syllogismScenarios.forEach(([a, b, c], i) => {
    const isAnd = i % 2 === 0;
    const premise = isAnd
      ? `Jika ${a} dan ${b}, maka ${c}. Ternyata hari ini ${c} tidak terlaksana.`
      : `Jika ${a} atau ${b}, maka ${c}. Ternyata hari ini ${c} tidak terlaksana.`;
    const correct = isAnd
      ? `${a[0].toUpperCase() + a.slice(1)} tidak terpenuhi atau ${b} tidak terpenuhi.`
      : `${a[0].toUpperCase() + a.slice(1)} tidak terpenuhi dan ${b} tidak terpenuhi.`;
    const wrong1 = isAnd
      ? `${a[0].toUpperCase() + a.slice(1)} tidak terpenuhi dan ${b} tidak terpenuhi.`
      : `${a[0].toUpperCase() + a.slice(1)} tidak terpenuhi atau ${b} tidak terpenuhi.`;
    const distractors = uniqueDistractors(correct, [
      wrong1,
      `${c[0].toUpperCase() + c.slice(1)} pasti terlaksana keesokan harinya.`,
      `Hanya ${a} yang tidak terpenuhi, sedangkan ${b} pasti terpenuhi.`,
      `Tidak dapat ditarik kesimpulan apa pun dari premis tersebut.`,
    ]);
    list.push(
      makeQuestion(
        'Penalaran Logis',
        `${premise} Simpulan yang paling sah secara logika adalah...`,
        correct,
        distractors,
        isAnd
          ? `Langkah 1: Bentuk logika (A ∧ B) -> C dan fakta ~C.\nLangkah 2: Dengan Modus Tollens diperoleh ~(A ∧ B), yang menurut Hukum De Morgan ekuivalen dengan (~A ∨ ~B): salah satu atau keduanya tidak terpenuhi.`
          : `Langkah 1: Bentuk logika (A ∨ B) -> C dan fakta ~C.\nLangkah 2: Dengan Modus Tollens diperoleh ~(A ∨ B), yang menurut Hukum De Morgan ekuivalen dengan (~A ∧ ~B): kedua syarat tidak terpenuhi.`,
        idx++
      )
    );
  });

  // 2. Penalaran Analitis Pengurutan & Jadwal (25 soal)
  const nameSets: Array<[string, string, string, string, string]> = [
    ['Andi', 'Budi', 'Citra', 'Dian', 'Eko'],
    ['Farah', 'Gilang', 'Hana', 'Ilham', 'Jihan'],
    ['Kurnia', 'Laras', 'Miko', 'Nadia', 'Omar'],
    ['Putra', 'Qori', 'Rani', 'Seno', 'Tari'],
    ['Umar', 'Vina', 'Wahyu', 'Yani', 'Zaki'],
  ];
  const contextsAnalitik = [
    'urutan presentasi inovasi layanan',
    'antrean verifikasi berkas',
    'jadwal evaluasi kinerja harian',
    'urutan wawancara panel akhir',
    'penomoran meja layanan dari kiri ke kanan',
  ];
  for (let i = 0; i < 25; i++) {
    const names = nameSets[i % nameSets.length];
    const rot = i % 5;
    const p = [
      names[rot],
      names[(rot + 1) % 5],
      names[(rot + 2) % 5],
      names[(rot + 3) % 5],
      names[(rot + 4) % 5],
    ];
    // Unique exact ordering p[0] -> p[1] -> p[2] -> p[3] -> p[4]
    const ctx = contextsAnalitik[Math.floor(i / 5) % contextsAnalitik.length];
    const targetPos = (i % 3) + 2; // ask position 2, 3, or 4 (0-indexed: 1,2,3) -> wait let's ask pos 1..5 cleanly
    const askIndex = i % 5; // 0..4 => urutan ke-1..ke-5
    const correct = p[askIndex];
    const distractors = uniqueDistractors(
      correct,
      p.filter((n) => n !== correct)
    );
    list.push(
      makeQuestion(
        'Penalaran Analitis',
        `Lima peserta (${names.join(', ')}) mengikuti ${ctx} pada posisi 1 sampai 5 dengan ketentuan:\n- ${p[1]} berada tepat sesudah ${p[0]}.\n- ${p[2]} berada pada posisi ke-3.\n- ${p[3]} berada lebih dahulu daripada ${p[4]}.\n- ${p[0]} bukan berada di belakang ${p[2]}.\nSiapakah yang berada pada posisi ke-${askIndex + 1}?`,
        correct,
        distractors,
        `Langkah 1: ${p[2]} = posisi 3.\nLangkah 2: Karena ${p[0]} tidak di belakang ${p[2]} dan ${p[1]} tepat sesudah ${p[0]}, blok [${p[0]}, ${p[1]}] wajib mengisi posisi (1, 2).\nLangkah 3: Posisi tersisa (4, 5) diisi oleh ${p[3]} lalu ${p[4]} (${p[3]} sebelum ${p[4]}).\nLangkah 4: Urutan lengkap 1..5 adalah ${p.join(', ')}, sehingga posisi ke-${askIndex + 1} adalah ${correct}.`,
        idx++
      )
    );
  }

  // 3. Penalaran Verbal — Analogi Konseptual CPNS HOTS (50 soal)
  const analogies: Array<[string, string, [string, string, string, string], string]> = [
    ['REGULASI : KEPATUHAN', 'Kompas : Arah Pelayaran', ['Hujan : Payung', 'Kertas : Tinta', 'Meja : Kursi', 'Pabrik : Asap'], 'Regulasi menjadi pedoman untuk menjaga kepatuhan, sebagaimana kompas menjadi pedoman menentukan arah pelayaran.'],
    ['DIAGNOSIS : DOKTER', 'Audit : Pemeriksa Keuangan', ['Pasien : Rumah Sakit', 'Palu : Kayu', 'Kamera : Lensa', 'Buku : Kertas'], 'Diagnosis adalah proses pemeriksaan profesional dokter, sebagaimana audit adalah pemeriksaan profesional pemeriksa keuangan.'],
    ['VAKSIN : IMUNITAS', 'Pelatihan : Kompetensi', ['Obat : Penyakit', 'Api : Abu', 'Sungai : Muara', 'Batu : Pasir'], 'Vaksin meningkatkan imunitas tubuh, sebagaimana pelatihan meningkatkan kompetensi SDM.'],
    ['HIPOTESIS : EKSPERIMEN', 'Draf Kebijakan : Uji Publik', ['Fakta : Opini', 'Kesimpulan : Masalah', 'Judul : Sampul', 'Angka : Kalkulator'], 'Hipotesis diuji kebenarannya melalui eksperimen, sebagaimana draf kebijakan diuji kelayakannya melalui uji publik.'],
    ['DEFISIT : ANGGARAN', 'Dehidrasi : Cairan Tubuh', ['Laba : Dagang', 'Surplus : Ekspor', 'Gizi : Makanan', 'Modal : Usaha'], 'Defisit adalah kondisi kekurangan anggaran, sebagaimana dehidrasi adalah kondisi kekurangan cairan tubuh.'],
    ['NOTARIS : AKTA OTENTIK', 'Arsitek : Cetak Biru Bangunan', ['Hakim : Penjara', 'Guru : Kapur', 'Nelayan : Ombak', 'Petani : Pupuk'], 'Notaris berwenang menerbitkan produk profesional berupa akta otentik, sebagaimana arsitek menghasilkan cetak biru bangunan.'],
    ['KATALOG : PERPUSTAKAAN', 'Indeks : Buku Referensi', ['Halaman : Sampul', 'Pintu : Jendela', 'Tinta : Pena', 'Lampu : Sakelar'], 'Katalog memudahkan pencarian koleksi dalam perpustakaan, sebagaimana indeks memudahkan pencarian topik dalam buku referensi.'],
    ['OMBUDSMAN : MALADMINISTRASI', 'Bawaslu : Pelanggaran Pemilu', ['Polisi : Hakim', 'KPU : Surat Suara', 'Bank : Nasabah', 'Sekolah : Rapor'], 'Ombudsman mengawasi dan menindak maladministrasi layanan publik, sebagaimana Bawaslu mengawasi pelanggaran pemilu.'],
    ['EMISI : POLUSI', 'Korupsi : Inefisiensi Negara', ['Hutan : Oksigen', 'Sawah : Beras', 'Listrik : Cahaya', 'Belajar : Nilai'], 'Emisi berlebih memicu polusi lingkungan, sebagaimana korupsi memicu inefisiensi keuangan negara.'],
    ['PREAMBUL : KONSTITUSI', 'Prolog : Naskah Drama', ['Bab : Penutup', 'Daftar Pustaka : Lampiran', 'Catatan Kaki : Paragraf', 'Judul : Ejaan'], 'Preambul merupakan pembukaan pengantar konstitusi, sebagaimana prolog merupakan pembukaan pengantar naskah drama.'],
    ['STATISTIK : DATA', 'Kartografi : Peta', ['Hukum : Pengacara', 'Musik : Penyanyi', 'Biologi : Apotek', 'Fisika : Kertas'], 'Statistik mengolah dan memodelkan data, sebagaimana kartografi mengolah dan memetakan wilayah.'],
    ['MITIGASI : BENCANA', 'Vaksinasi : Wabah Penyakit', ['Evakuasi : Reruntuhan', 'Rekonstruksi : Gempa', 'Banjir : Tanggul', 'Asuransi : Premi'], 'Mitigasi dilakukan sebelum krisis untuk menekan risiko bencana, sebagaimana vaksinasi menekan risiko wabah.'],
    ['KORELASI : HUBUNGAN', 'Kausalitas : Sebab-Akibat', ['Frekuensi : Kecepatan', 'Volume : Berat', 'Simulasi : Nyata', 'Variabel : Konstanta'], 'Korelasi merujuk pada hubungan keterkaitan, sedangkan kausalitas merujuk pada hubungan sebab-akibat.'],
    ['DELEGASI : WEWENANG', 'Mandat : Tugas Resmi', ['Sanksi : Pelanggaran', 'Hadiah : Prestasi', 'Pajak : Penghasilan', 'Cuti : Liburan'], 'Delegasi adalah pelimpahan wewenang, sebagaimana mandat adalah pemberian tugas resmi.'],
    ['VERIFIKASI : KEABSAHAN', 'Kalibrasi : Ketepatan Alat', ['Distribusi : Gudang', 'Produksi : Pabrik', 'Promosi : Iklan', 'Konsumsi : Pasar'], 'Verifikasi dilakukan untuk memastikan keabsahan data/dokumen, sebagaimana kalibrasi memastikan ketepatan ukur alat.'],
    ['TRANSPARANSI : KEPERCAYAAN', 'Disiplin : Keteraturan', ['Rahasia : Kecurigaan', 'Malas : Kegagalan', 'Bising : Tuli', 'Lelah : Tidur'], 'Transparansi menumbuhkan kepercayaan publik, sebagaimana disiplin menumbuhkan keteraturan.'],
    ['ANALOGI : PERBANDINGAN', 'Sintesis : Penggabungan', ['Analisis : Pemisahan', 'Definisi : Kata', 'Kutipan : Sumber', 'Contoh : Teori'], 'Analogi berarti membuat perbandingan, sebagaimana sintesis berarti penggabungan berbagai unsur menjadi kesatuan.'],
    ['KONSENSUS : MUSYAWARAH', 'Putusan : Persidangan', ['Perdebatan : Konflik', 'Petisi : Protes', 'Orasi : Panggung', 'Berita : Koran'], 'Konsensus dihasilkan dari proses musyawarah, sebagaimana putusan dihasilkan dari proses persidangan.'],
    ['INFRASTRUKTUR : KONEKTIVITAS', 'Literasi : Pemahaman', ['Jalan : Aspal', 'Jembatan : Sungai', 'Gedung : Semen', 'Pelabuhan : Kapal'], 'Pembangunan infrastruktur meningkatkan konektivitas, sebagaimana penguatan literasi meningkatkan pemahaman.'],
    ['AKUNTABEL : DIPERTANGGUNGJAWABKAN', 'Kredibel : Dipercaya', ['Efektif : Murah', 'Loyal : Kaku', 'Formal : Santai', 'Dinamis : Statis'], 'Akuntabel bermakna dapat dipertanggungjawabkan, sebagaimana kredibel bermakna dapat dipercaya.'],
    ['ARSIPARIS : DOKUMEN', 'Pustakawan : Koleksi Buku', ['Koki : Piring', 'Sopir : Aspal', 'Masinis : Tiket', 'Pilot : Landasan'], 'Arsiparis mengelola dokumen secara sistematis, sebagaimana pustakawan mengelola koleksi buku.'],
    ['SANKSI : JERA', 'Insentif : Motivasi', ['Denda : Rugi', 'Aturan : Beban', 'Teguran : Marah', 'Rapat : Bosan'], 'Sanksi bertujuan menimbulkan efek jera, sebagaimana insentif bertujuan menumbuhkan motivasi kerja.'],
    ['DISPARITAS : KESENJANGAN', 'Kohesi : Keterpaduan', ['Konflik : Persatuan', 'Stagnasi : Kemajuan', 'Polusi : Kesehatan', 'Inflasi : Penurunan Harga'], 'Disparitas bersinonim konseptual dengan kesenjangan, sebagaimana kohesi dengan keterpaduan.'],
    ['RATIFIKASI : PERJANJIAN INTERNASIONAL', 'Pengundangan : Undang-Undang', ['Amandemen : Pasal', 'Debat : Parlemen', 'Kampanye : Pemilu', 'Sosialisasi : Warga'], 'Ratifikasi mengesahkan pemberlakuan perjanjian internasional, sebagaimana pengundangan mengesahkan berlakunya undang-undang.'],
    ['REDUNDANSI : PEMBOROSAN', 'Efisiensi : Penghematan', ['Kualitas : Kuantitas', 'Produktivitas : Waktu', 'Inovasi : Tradisi', 'Kompleksitas : Kemudahan'], 'Redundansi berkaitan dengan pemborosan, sebagaimana efisiensi berkaitan dengan penghematan sumber daya.'],
  ];

  // Expand 25 core analogies + 25 contextual verbal inference items = 50 verbal HOTS!
  analogies.forEach(([stem, correct, wrong4, reason]) => {
    list.push(
      makeQuestion(
        'Penalaran Verbal — Analogi',
        `Tentukan padanan hubungan logis yang paling tepat: ${stem} = ... : ...`,
        correct,
        [wrong4[0], wrong4[1], wrong4[2], wrong4[3]],
        `Langkah 1: Identifikasi relasi konseptual pasangan kata utama.\nLangkah 2: ${reason}`,
        idx++
      )
    );
  });

  const verbalContexts: Array<[string, string, [string, string, string, string], string]> = [
    [
      'Kebijakan bekerja fleksibel di instansi pemerintah meningkatkan kepuasan kerja pegawai hingga 28%, namun pada unit layanan tatap muka tingkat keluhan keterlambatan berkas naik apabila jadwal giliran kerja tidak diatur jelas. Kesimpulan paling rasional dari temuan tersebut adalah...',
      'Kebijakan kerja fleksibel perlu dibedakan penerapannya sesuai karakteristik unit kerja dan dilengkapi pengaturan jadwal layanan tatap muka yang jelas.',
      ['Kerja fleksibel harus dihapuskan di seluruh instansi pemerintah.', 'Semua pegawai layanan tatap muka tidak mampu bekerja secara profesional.', 'Kepuasan kerja pegawai selalu berbanding terbalik dengan kualitas layanan publik.', 'Keluhan keterlambatan berkas tidak ada kaitannya dengan pengaturan jadwal kerja.'],
      'Evaluasi kebijakan publik menuntut solusi adaptif berdasarkan data, bukan generalisasi ekstrem.',
    ],
    [
      'Meskipun jumlah pengaduan masyarakat melalui kanal digital meningkat dua kali lipat tahun ini dibandingkan tahun lalu, survei kepuasan publik menunjukkan indeks kecepatan penyelesaian aduan justru membaik dari 5 hari menjadi 1,5 hari. Penjelasan paling logis atas fenomena ini adalah...',
      'Meningkatnya laporan mencerminkan akses pelaporan yang makin mudah dan dipercaya masyarakat, diiringi peningkatan kapasitas tindak lanjut petugas.',
      ['Masyarakat menjadi lebih sering mengeluh karena kualitas layanan memburuk drastis.', 'Survei kepuasan publik pasti keliru karena jumlah aduan naik.', 'Kanal pengaduan digital sebaiknya ditutup agar jumlah aduan turun.', 'Petugas membutuhkan waktu lebih lama untuk memproses setiap aduan.'],
      'Kenaikan jumlah laporan saat kanal dibuka tidak selalu bermakna kinerja turun bila waktu penyelesaiannya justru jauh lebih cepat.',
    ],
    [
      'Sebuah pemerintah kota mewajibkan seluruh proyek konstruksi baru menyisihkan 30% area resapan air hijau. Tiga tahun kemudian, volume genangan air saat curah hujan puncak di wilayah tersebut berkurang signifikan. Jika kota tetangga memiliki topografi dan curah hujan serupa ingin meniru hasil tersebut, langkah analisis pertama yang paling tepat adalah...',
      'Mengevaluasi tata guna lahan kota tetangga serta kesesuaian regulasi ruang terbuka hijau sebelum mengadopsi kebijakan serupa.',
      ['Langsung menyalahkan warga kota tetangga karena membuang sampah sembarangan.', 'Membangun mal di seluruh lahan kosong agar air hujan tertampung atap.', 'Menolak kebijakan daerah lain tanpa menguji efektivitasnya.', 'Menghapus seluruh izin bangunan komersial secara permanen.'],
      'Replikasi kebijakan berbasis bukti memerlukan penyesuaian kondisi tata guna lahan lokal.',
    ],
    [
      'Penelitian menunjukkan desa yang memiliki badan usaha milik desa (BUMDes) dengan pembukuan digital transparan mampu menarik kemitraan perbankan tiga kali lebih besar dibandingkan desa dengan pencatatan manual. Implikasi manajerial terpenting dari temuan ini adalah...',
      'Transparansi dan akuntabilitas tata kelola keuangan merupakan faktor kunci dalam membangun kepercayaan mitra eksternal.',
      ['Perbankan hanya mau membiayai desa yang berlokasi di pinggir jalan tol.', 'Pencatatan manual lebih akurat daripada sistem digital.', 'BUMDes tidak membutuhkan laporan keuangan selama menjual produk unggulan.', 'Kemitraan perbankan otomatis menghapus kebutuhan musyawarah desa.'],
      'Keterbukaan dan kerapian akuntansi meningkatkan kredibilitas entitas ekonomi daerah.',
    ],
    [
      'Dalam laporan evaluasi pelatihan ASN, 90% peserta mendapat nilai sangat baik pada ujian teori, tetapi hanya 35% yang berhasil mengimplementasikan aplikasi baru di unit kerjanya setelah tiga bulan. Akar masalah paling mungkin dan solusi evaluatifnya adalah...',
      'Pelatihan masih terlalu berfokus pada hafalan teori sehingga perlu dilengkapi pendampingan praktik langsung di tempat kerja.',
      ['Peserta pelatihan tidak mampu membaca buku panduan teori.', 'Nilai ujian teori harus diturunkan standarnya agar semua tampak berhasil.', 'Aplikasi baru sebaiknya tidak usah digunakan di unit kerja.', 'Pelatihan cukup dilakukan satu jam secara daring tanpa praktik.'],
      'Kesenjangan antara nilai teori (90%) dan adopsi nyata (35%) menandakan perlunya transfer pembelajaran berbasis praktik kerja.',
    ],
    [
      'Setelah jalur bus cepat khusus (BRT) dilengkapi halte integrasi stasiun kereta, jumlah penumpang naik 42% dalam enam bulan, sementara kemacetan di koridor paralel menurun 18%. Faktor yang paling melemahkan argumen bahwa keberhasilan itu semata akibat kenaikan tarif parkir adalah...',
      'Penurunan kemacetan hanya terjadi signifikan di koridor yang terhubung langsung dengan integrasi halte BRT-stasiun, bukan di seluruh kota.',
      ['Banyak penumpang kereta yang membawa payung saat musim hujan.', 'Tarif tiket bus cepat dicetak menggunakan kertas daur ulang.', 'Jumlah bengkel kendaraan di pinggiran kota tetap stabil.', 'Sebagian halte dicat ulang dengan warna biru dan putih.'],
      'Dalam penalaran kritis, efek spesifik pada koridor terintegrasi membuktikan peran langsung konektivitas antarmoda dibandingkan faktor umum kota.',
    ],
    [
      'Data dinas kesehatan menunjukkan prevalensi balita kurang gizi di Kecamatan Melati turun 40% setelah posyandu menggandeng kelompok tani setempat menyediakan telur dan ikan segar lokal, meski anggaran bantuan pangan tidak bertambah. Simpulan yang paling tepat adalah...',
      'Kolaborasi lintas sektor berbasis potensi pangan lokal dapat meningkatkan efektivitas intervensi gizi tanpa selalu menambah pagu anggaran.',
      ['Bantuan pangan bernilai gizi hanya efektif apabila berasal dari produk impor.', 'Posyandu tidak lagi membutuhkan kader kesehatan di tingkat desa.', 'Anggaran kesehatan daerah sebaiknya dipotong 40% pada tahun berikutnya.', 'Kelompok tani wajib menggantikan fungsi puskesmas di kecamatan tersebut.'],
      'Sinergi kelembagaan lokal mampu mengefisienkan rantai pasok pangan bergizi dengan biaya tetap.',
    ],
    [
      'Sebuah perpustakaan daerah memperpanjang jam buka hingga pukul 21.00 WIB dan menambah ruang kerja bersama berkecepatan internet tinggi. Enam bulan berselang, peminjaman buku fisik naik 15% dan kunjungan pelajar serta pekerja lepas melonjak tiga kali lipat. Kesimpulan yang tidak didukung oleh wacana tersebut adalah...',
      'Koleksi buku fisik menjadi tidak diminati lagi oleh pengunjung setelah ruang kerja bersama dibuka.',
      ['Integrasi fungsi ruang kerja bersama turut mendongkrak pemanfaatan fasilitas perpustakaan.', 'Ketersediaan akses internet dan perpanjangan jam operasional menarik kelompok pengguna produktif.', 'Transformasi perpustakaan menjadi ruang belajar publik berdampak positif pada tingkat kunjungan.', 'Pengunjung malam hari mencakup pelajar dan pekerja lepas yang membutuhkan ruang kondusif.'],
      'Fakta menyatakan peminjaman buku fisik justru naik 15%, sehingga pernyataan bahwa buku fisik tidak diminati bertentangan dengan data.',
    ],
    [
      'Audit internal menemukan bahwa keterlambatan pencairan dana operasional di sepuluh puskesmas bukan disebabkan kekosongan kas daerah, melainkan karena 70% bendahara masih mengunggah dokumen pertanggungjawaban yang tidak seragam formatnya. Kebijakan korektif yang paling tepat sasaran adalah...',
      'Menyediakan templat digital standar disertai verifikasi otomatis pra-unggah dan bimbingan teknis singkat bagi bendahara.',
      ['Menambah jumlah rekening bank daerah tanpa memperbaiki tata cara pelaporan.', 'Menghapus kewajiban pelaporan pertanggungjawaban keuangan puskesmas.', 'Memindahkan seluruh anggaran puskesmas ke dinas pariwisata.', 'Memberi sanksi pemotongan gaji tanpa menyediakan standar format dokumen.'],
      'Masalah ketidakteraturan format dokumen diselesaikan melalui standardisasi templat dan validasi sistem sebelum pengiriman.',
    ],
    [
      'Sebuah kabupaten menerbitkan peta kerawanan longsor berbasis satelit secara terbuka bagi warga. Hasilnya, warga di tiga kecamatan berinisiatif memindahkan kandang ternak dan menanam akar wangi di lereng curam sebelum musim hujan tiba. Fenomena ini menunjukkan bahwa...',
      'Keterbukaan data risiko bencana yang mudah dipahami mendorong kesiapsiagaan partisipatif masyarakat secara mandiri.',
      ['Masyarakat pedesaan tidak peduli terhadap keselamatan lingkungan tempat tinggalnya.', 'Peta risiko bencana sebaiknya dirahasiakan agar warga tidak cemas.', 'Penanaman akar wangi dapat menggantikan seluruh sistem peringatan dini.', 'Warga tidak membutuhkan informasi teknis apa pun dari pemerintah daerah.'],
      'Informasi risiko yang transparan dan dapat ditindaklanjuti memberdayakan warga melakukan mitigasi dini.',
    ],
    [
      'Dalam uji coba sistem tilang elektronik di lima persimpangan padat, pelanggaran marka berhenti turun 65% pada bulan kedua, tetapi di dua persimpangan tanpa rambu peringatan yang jelas, jumlah pengendara yang berhenti mendadak meningkat. Rekomendasi kebijakan yang paling berimbang adalah...',
      'Melengkapi persimpangan dengan rambu sosialisasi dan marka batas yang jelas sebelum memperluas penindakan otomatis.',
      ['Mencabut seluruh kamera tilang elektronik karena membuat pengendara kaget.', 'Membiarkan pengendara melanggar marka demi kelancaran arus lalu lintas.', 'Menaikkan nominal denda hingga sepuluh kali lipat tanpa memperbaiki rambu.', 'Menghapus marka jalan di seluruh persimpangan kota.'],
      'Penegakan hukum berbasis teknologi harus dibarengi kejelasan informasi jalan agar keselamatan dan kepatuhan berjalan beriringan.',
    ],
    [
      'Rata-rata waktu tunggu layanan paspor di Kantor Imigrasi A lebih cepat 30 menit daripada Kantor Imigrasi B, padahal jumlah pemohon harian keduanya hampir sama dan jumlah loketnya identik. Penelusuran menunjukkan Kantor A menerapkan prapemeriksaan kelengkapan berkas di meja depan sebelum pemohon masuk antrean foto. Pelajaran proses bisnis yang paling relevan adalah...',
      'Penyaringan kelengkapan berkas di tahap awal mencegah hambatan di loket inti dan memangkas waktu tunggu keseluruhan.',
      ['Kantor B harus menggandakan jumlah gedung meskipun prosedur antrean tetap sama.', 'Kecepatan pelayanan semata-mata ditentukan oleh ukuran luas ruang tunggu.', 'Prapemeriksaan berkas di meja depan hanya memperlambat alur pemohon.', 'Kantor A melayani pemohon yang lebih sedikit dibandingkan Kantor B.'],
      'Mengeluarkan proses koreksi berkas dari titik leher botol (bottleneck) mempercepat aliran layanan.',
    ],
    [
      'Sebuah program beasiswa talenta digital mensyaratkan penerima mengabdi selama dua tahun di instansi daerah asal setelah lulus. Lima tahun berjalan, tingkat retensi talenta di daerah yang memiliki proyek transformasi digital nyata mencapai 82%, sedangkan di daerah tanpa penugasan teknis relevan hanya 29%. Kesimpulan analitis yang paling kuat adalah...',
      'Ikatan dinas perlu diimbangi dengan kejelasan ekosistem kerja dan proyek nyata agar talenta bertahan secara produktif.',
      ['Program beasiswa talenta digital gagal total di seluruh daerah.', 'Retensi pegawai muda hanya ditentukan oleh sanksi hukum tanpa memedulikan beban kerja.', 'Daerah tanpa proyek digital sebaiknya melarang warganya mendaftar beasiswa.', 'Seluruh lulusan beasiswa pasti meninggalkan daerahnya sebelum dua tahun.'],
      'Perbedaan retensi 82% vs 29% menunjukkan kebermaknaan peran kerja jauh lebih menentukan daripada ikatan administratif semata.',
    ],
    [
      'Pasar induk kota mengalami penumpukan sampah organik harian sebesar 40 ton yang selama ini dibuang ke TPA dengan biaya angkut tinggi. Pemerintah bekerja sama dengan koperasi peternak maggot untuk mengolah 60% sampah organik pasar langsung di lokasi. Dampak ganda paling logis dari skema ekonomi sirkular ini adalah...',
      'Penurunan beban TPA dan biaya angkut sampah sekaligus penciptaan pasokan pakan bernilai ekonomi bagi peternak lokal.',
      ['Bertambahnya volume sampah anorganik yang dikirim ke TPA setiap hari.', 'Koperasi peternak kehilangan sumber bahan baku karena sampah terolah.', 'Pasar induk harus ditutup sementara selama proses pengolahan berlangsung.', 'Biaya transportasi TPA otomatis naik dua kali lipat dari sebelumnya.'],
      'Pengolahan sampah organik di sumbernya memangkas ongkos logistik TPA dan menghasilkan nilai tambah ekonomi.',
    ],
    [
      'Survei kepuasan pasien rumah sakit daerah menunjukkan skor keramahan tenaga medis sangat tinggi (4,8 dari 5), tetapi kepuasan terhadap alur penebusan obat di farmasi hanya 2,9 dari 5. Langkah perbaikan paling rasional bagi manajemen rumah sakit adalah...',
      'Memfokuskan audit alur kerja pada instalasi farmasi, misalnya melalui integrasi resep elektronik dan pemisahan antrean obat racikan serta non-racikan.',
      ['Mengadakan pelatihan keramahan berulang-ulang bagi dokter spesialis.', 'Menghapus survei kepuasan pasien agar skor rendah tidak terlihat publik.', 'Mewajibkan pasien membeli seluruh obat di luar rumah sakit.', 'Memindahkan seluruh perawat ruang rawat inap ke loket pendaftaran.'],
      'Perbaikan layanan harus menargetkan simpul terlemah (instalasi farmasi) sesuai temuan data empiris.',
    ],
    [
      'Sejak sistem perizinan berusaha terintegrasi menerapkan persetujuan otomatis untuk usaha mikro berisiko rendah, waktu terbit izin turun dari 14 hari menjadi kurang dari 1 jam, sementara usaha berisiko tinggi tetap menjalani verifikasi lapangan ketat. Prinsip regulasi yang tercermin dalam kebijakan ini adalah...',
      'Pengaturan berbasis tingkat risiko (risk-based approach) yang menyeimbangkan kemudahan berusaha dengan perlindungan keselamatan publik.',
      ['Pencabutan seluruh pengawasan keselamatan pada industri berskala besar.', 'Pemberian perlakuan birokrasi yang sama lambatnya untuk usaha mikro dan pabrik kimia.', 'Penghapusan kewajiban izin bagi seluruh jenis kegiatan usaha tanpa kecuali.', 'Pelimpahan seluruh verifikasi teknis berisiko tinggi kepada algoritma tanpa pemeriksaan lapangan.'],
      'Regulasi berbasis risiko membedakan intensitas verifikasi sesuai potensi dampak kegiatan usaha.',
    ],
    [
      'Di sebuah sekolah kejuruan, tingkat serapan lulusan di industri meningkat dari 48% menjadi 81% dalam dua tahun setelah kurikulum disusun bersama asosiasi industri dan praktik kerja lapangan diperpanjang menjadi satu semester penuh. Variabel yang paling kecil kemungkinannya menjadi penyebab lonjakan tersebut adalah...',
      'Perubahan warna seragam praktik siswa pada hari Jumat.',
      ['Penyelarasan materi ajar dengan kompetensi teknologi terkini di industri.', 'Perluasan durasi pengalaman kerja langsung di lingkungan produksi nyata.', 'Keterlibatan praktisi industri dalam mengevaluasi portofolio keterampilan siswa.', 'Penyesuaian alat praktik bengkel sekolah mengikuti standar dunia kerja.'],
      'Keselarasan kurikulum dan durasi magang berkaitan langsung dengan kesiapan kerja, sedangkan warna seragam tidak relevan secara kausal.',
    ],
    [
      'Laporan pemantauan sungai menunjukkan kadar limbah cair turun drastis pada hari kerja ketika inspektur lingkungan rutin berpatroli, namun kembali melonjak setiap akhir pekan pada malam hari. Pola anomali data tersebut paling kuat mengindikasikan bahwa...',
      'Sebagian pelaku usaha diduga sengaja membuang limbah di luar jam pengawasan reguler sehingga jadwal inspeksi perlu dibuat acak dan dipasang sensor pemantau kontinu.',
      ['Sungai secara alami memproduksi limbah industri setiap malam Minggu.', 'Alat ukur laboratorium hanya berfungsi akurat pada hari Senin sampai Jumat.', 'Inspeksi lapangan sebaiknya dihentikan total karena kadar limbah turun pada hari kerja.', 'Warga sekitar membuang limbah pabrik tekstil pada akhir pekan.'],
      'Lonjakan berulang di luar jam kerja pengawasan menandakan celah kepatuhan yang harus ditutup dengan pengawasan acak dan pemantauan otomatis.',
    ],
    [
      'Penerapan sistem kerja berbagi meja (hot-desking) pada dinas yang 60% pegawainya sering bertugas di lapangan mampu menghemat biaya sewa gedung tambahan sebesar Rp1,2 miliar per tahun tanpa mengurangi produktivitas tim. Syarat utama agar kebijakan ini berhasil bila diterapkan di dinas lain adalah...',
      'Tingkat mobilitas pegawai di luar kantor cukup tinggi dan tersedia sistem reservasi meja serta penyimpanan arsip digital yang tertib.',
      ['Seluruh pegawai wajib hadir di kantor delapan jam penuh setiap hari dengan arsip kertas berlemari besar.', 'Jumlah meja kerja harus dibuat hanya sepuluh persen dari total pegawai tetap kantor.', 'Pegawai dilarang membawa laptop saat bekerja secara bergerak.', 'Seluruh rapat koordinasi antarbidang ditiadakan selamanya.'],
      'Efektivitas hot-desking bergantung pada proporsi kerja lapangan dan kesiapan digitalisasi dokumen.',
    ],
    [
      'Ketika pemerintah daerah membuka dasbor realisasi anggaran belanja modal secara real-time kepada publik, jumlah sanggahan warga terhadap proyek mangkrak meningkat di awal, lalu tingkat penyelesaian proyek tepat waktu naik dari 64% menjadi 91% di tahun berikutnya. Hubungan sebab-akibat yang paling masuk akal adalah...',
      'Akuntabilitas terbuka memicu tekanan pengawasan sosial yang mendorong pelaksana dan pengawas proyek bekerja lebih disiplin.',
      ['Dasbor anggaran secara otomatis mengecor jalan dan membangun gedung sekolah.', 'Warga menolak seluruh pembangunan infrastruktur di daerahnya.', 'Proyek pembangunan hanya dapat selesai apabila anggarannya dirahasiakan.', 'Peningkatan sanggahan publik membuktikan bahwa transparansi merusak kinerja daerah.'],
      'Transparansi data publik memperkuat kontrol sosial dan memperbaiki kedisiplinan eksekusi program.',
    ],
    [
      'Sebuah kecamatan kepulauan mengalami tingkat absensi guru yang tinggi pada musim angin barat karena gelombang tinggi menghentikan kapal penyeberangan reguler setiap pekan. Solusi kebijakan jangka menengah yang paling berkelanjutan adalah...',
      'Menyediakan rumah dinas layak huni di pulau setempat beserta tunjangan daerah terpencil dan sistem pembelajaran hibrida cadangan.',
      ['Memotong gaji guru setiap kali kapal penyeberangan batal berlayar akibat cuaca buruk.', 'Menutup sekolah di pulau terpencil selama empat bulan setiap musim angin barat.', 'Mewajibkan siswa berenang menyeberangi selat menuju sekolah di ibu kota kecamatan.', 'Menghapus mata pelajaran eksakta agar jam belajar bisa dipadatkan satu hari per bulan.'],
      'Mengatasi hambatan geografis membutuhkan penempatan berbasis hunian layak di lokasi tugas dan dukungan infrastruktur belajar.',
    ],
    [
      'Analisis terhadap 500 berkas pengajuan bantuan modal usaha menunjukkan bahwa pemohon yang menyertakan rencana arus kas sederhana memiliki tingkat keberlanjutan usaha dua kali lebih tinggi setelah satu tahun dibandingkan yang tidak, meski nominal bantuannya sama. Rekomendasi untuk panitia seleksi bantuan berikutnya adalah...',
      'Memasukkan pelatihan singkat penyusunan arus kas sebagai pendampingan wajib sebelum pencairan dana bantuan.',
      ['Menggandakan nominal dana kepada pemohon tanpa rencana usaha agar cepat berkembang.', 'Menolak seluruh pelaku usaha mikro yang belum memiliki gelar sarjana ekonomi.', 'Menghapus proses seleksi berkas dan membagi dana secara undian acak.', 'Melarang penerima bantuan mencatat pengeluaran harian usahanya.'],
      'Literasi perencanaan keuangan terbukti meningkatkan daya tahan usaha sehingga layak dijadikan bagian pendampingan program.',
    ],
    [
      'Selama dua tahun terakhir, tingkat kelulusan uji sertifikasi kompetensi pegawai di Unit A selalu 95%, namun indeks kepuasan pengguna layanan internal terhadap Unit A tetap stagnan di angka rendah. Kesimpulan evaluatif yang paling tajam adalah...',
      'Materi sertifikasi belum sepenuhnya mengukur kemampuan pemecahan masalah nyata yang dibutuhkan oleh pengguna layanan Unit A.',
      ['Pengguna layanan internal sengaja memberi nilai buruk tanpa alasan.', 'Seluruh sertifikat kompetensi pegawai Unit A harus segera dicabut tanpa evaluasi.', 'Kepuasan layanan tidak pernah dipengaruhi oleh cara kerja pegawai.', 'Standar nilai kelulusan sertifikasi perlu diturunkan lagi agar lebih banyak yang lulus.'],
      'Ketidaksinkronan antara skor ujian formal (95%) dan kinerja layanan nyata menunjukkan perlunya revisi indikator kompetensi agar relevan dengan kebutuhan pengguna.',
    ],
    [
      'Di sebuah RSUD, penggunaan sistem triase digital di IGD mempercepat penanganan pasien kondisi kritis rata-rata 7 menit, tetapi pada jam sibuk keluarga pasien sering mengira pasien berkode hijau sengaja diabaikan. Tindakan komunikasi publik yang paling tepat untuk melengkapi sistem tersebut adalah...',
      'Menampilkan papan informasi visual alur prioritas kegawatdaruratan (merah-kuning-hijau) di ruang tunggu IGD disertai penjelasan singkat petugas triase.',
      ['Mematikan sistem triase digital dan melayani seluruh pasien berdasarkan urutan kedatangan.', 'Melarang keluarga pasien berada di area ruang tunggu rumah sakit.', 'Menghapus kategori kode warna agar keluarga pasien tidak bertanya-tanya.', 'Meminta dokter spesialis menjelaskan ulang sistem komputer rumah sakit kepada setiap tamu.'],
      'Keterbukaan informasi mengenai logika prioritas kegawatdaruratan meredam kesalahpahaman tanpa mengorbankan keselamatan pasien kritis.',
    ],
    [
      'Sebuah kementerian mengganti rapat koordinasi luring lintas provinsi menjadi forum daring terstruktur dengan ringkasan keputusan tertulis maksimal satu halaman. Hasilnya, biaya perjalanan dinas turun 52% dan kecepatan tindak lanjut keputusan antarunit meningkat. Prinsip tata kelola yang paling menonjol adalah...',
      'Efisiensi sumber daya anggaran yang berpadu dengan kejelasan akuntabilitas tindak lanjut keputusan.',
      ['Penghapusan seluruh bentuk koordinasi antarunit kerja di lingkungan kementerian.', 'Pengalihan seluruh anggaran negara ke sektor perjalanan dinas luar negeri.', 'Penolakan terhadap penggunaan dokumen tertulis dalam pengambilan keputusan publik.', 'Kewajiban menggelar rapat luring setiap hari demi menjaga silaturahmi pegawai.'],
      'Digitalisasi rapat disertai ringkasan keputusan yang ringkas menekan biaya sekaligus memperjelas tanggung jawab eksekusi.',
    ],
  ];

  verbalContexts.forEach(([prompt, correct, wrong4, reason]) => {
    list.push(
      makeQuestion(
        'Penalaran Verbal — Evaluasi Wacana',
        prompt,
        correct,
        wrong4,
        `Langkah 1: Identifikasi data faktual dan hubungan sebab-akibat dalam wacana.\nLangkah 2: ${reason}`,
        idx++
      )
    );
  });

  return list; // 25 + 25 + 25 + 25 = 100 soal Logis/Analitis/Verbal!
}

export const TIU_EXTRA_QUESTIONS: SeedQuestion[] = [
  ...generateSeriesQuestions(),             // 140
  ...generateNumericalWordProblems(),       // 160
  ...generateLogicAnalyticVerbalQuestions() // 100 -> Total 400!
];
