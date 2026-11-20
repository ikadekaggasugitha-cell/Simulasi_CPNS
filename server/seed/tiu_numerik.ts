import type { OptionKey } from '../../src/shared/types';
import type { SeedQuestion } from './types';

type KeyIdx = 0 | 1 | 2 | 3 | 4;
const KEYS: readonly OptionKey[] = ['A', 'B', 'C', 'D', 'E'];

function formatId(n: number, maxDecimals = 2): string {
  const rounded = Math.round(n * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals);
  if (Number.isInteger(rounded)) {
    return rounded.toLocaleString('id-ID');
  }
  return rounded.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
}

function buildQuestion(
  seedIdx: number,
  subtopik: string,
  pertanyaan: string,
  correctText: string,
  distractors: [string, string, string, string],
  metode1: string,
  metode2: string
): SeedQuestion {
  const targetIdx = (seedIdx % 5) as KeyIdx;
  const opts: string[] = [];
  let d = 0;
  for (let i = 0; i < 5; i++) {
    if (i === targetIdx) {
      opts.push(correctText);
    } else {
      opts.push(distractors[d++]);
    }
  }
  return {
    exam_type: 'SKD',
    kategori: 'TIU',
    subtopik,
    pertanyaan,
    opsi_a: opts[0],
    opsi_b: opts[1],
    opsi_c: opts[2],
    opsi_d: opts[3],
    opsi_e: opts[4],
    jawaban_benar: KEYS[targetIdx],
    pembahasan: `Metode 1 (Langkah Sistematis): ${metode1}\nMetode 2 (Trik Cepat / Eliminasi): ${metode2}`,
  };
}

function makeNumericDistractors(
  ans: number,
  offsets: [number, number, number, number],
  formatter: (n: number) => string = (n) => formatId(n)
): [string, string, string, string] {
  const seen = new Set<string>([formatter(ans)]);
  const out: string[] = [];
  for (const off of offsets) {
    let cand = ans + off;
    let label = formatter(cand);
    while (seen.has(label)) {
      cand += off >= 0 ? 1 : -1;
      label = formatter(cand);
    }
    seen.add(label);
    out.push(label);
  }
  return out as [string, string, string, string];
}

// ============================================================================
// 1. NUMERIK - BERHITUNG CEPAT (55 SOAL HOTS)
// ============================================================================
function buildFastCalcQuestions(): SeedQuestion[] {
  const list: SeedQuestion[] = [];

  // A. Selisih Kuadrat (10 soal): (a² - b²) / (a - b) + c  atau  a² - b²
  const diffSqParams: Array<[number, number, number]> = [
    [247, 153, 18],
    [364, 236, 25],
    [485, 315, 42],
    [572, 428, 35],
    [639, 361, 19],
    [746, 254, 55],
    [823, 677, 30],
    [918, 582, 40],
    [419, 281, 64],
    [537, 263, 75],
  ];
  diffSqParams.forEach(([a, b, c], idx) => {
    const sum = a + b;
    const ans = sum + c;
    list.push(
      buildQuestion(
        idx,
        'Numerik - Berhitung Cepat',
        `Hasil dari (${a}² − ${b}²) / (${a} − ${b}) + ${c} adalah...`,
        formatId(ans),
        makeNumericDistractors(ans, [-20, -10, 10, 20]),
        `Gunakan identitas selisih kuadrat a² − b² = (a − b)(a + b). Maka (${a}² − ${b}²) / (${a} − ${b}) = ${a} + ${b} = ${formatId(sum)}. Tambahkan ${c}: ${formatId(sum)} + ${c} = ${formatId(ans)}.`,
        `Jangan pernah menguadratkan ${a} dan ${b} secara manual! Langsung coret (${a} − ${b}) sehingga tinggal ${a} + ${b} + ${c} = ${formatId(ans)} dalam < 15 detik.`
      )
    );
  });

  // B. Sifat Distributif / Pemfaktoran (10 soal): k × p + k × q − k × r
  const distParams: Array<[number, number, number, number]> = [
    [37, 68, 45, 13],
    [43, 74, 51, 25],
    [29, 83, 39, 22],
    [64, 58, 67, 25],
    [52, 91, 34, 25],
    [78, 46, 79, 25],
    [85, 62, 53, 15],
    [47, 88, 37, 25],
    [63, 72, 58, 30],
    [94, 55, 65, 20],
  ];
  distParams.forEach(([k, p, q, r], idx) => {
    const inside = p + q - r; // all engineered to be 100!
    const ans = k * inside;
    list.push(
      buildQuestion(
        idx + 1,
        'Numerik - Berhitung Cepat',
        `Nilai dari (${k} × ${p}) + (${k} × ${q}) − (${k} × ${r}) adalah...`,
        formatId(ans),
        makeNumericDistractors(ans, [-k * 10, -k, k, k * 10]),
        `Faktorkan bilangan yang sama (${k}): ${k} × (${p} + ${q} − ${r}) = ${k} × ${inside} = ${formatId(ans)}.`,
        `Trik distributif: lihat angka ${k} muncul di ketiga suku, lalu hitung ${p} + ${q} − ${r} = ${inside}. Mengalikan ${k} × ${inside} selesai dalam 5 detik!`
      )
    );
  });

  // C. Pecahan Istimewa & Persen Cepat (15 soal)
  const specialPct: Array<{
    pctText: string;
    num: number;
    den: number;
    base: number;
    extraPctText: string;
    extraNum: number;
    extraDen: number;
    extraBase: number;
  }> = [
    { pctText: '37,5%', num: 3, den: 8, base: 640, extraPctText: '12,5%', extraNum: 1, extraDen: 8, extraBase: 320 },
    { pctText: '62,5%', num: 5, den: 8, base: 480, extraPctText: '25%', extraNum: 1, extraDen: 4, extraBase: 240 },
    { pctText: '87,5%', num: 7, den: 8, base: 560, extraPctText: '12,5%', extraNum: 1, extraDen: 8, extraBase: 160 },
    { pctText: '12,5%', num: 1, den: 8, base: 960, extraPctText: '37,5%', extraNum: 3, extraDen: 8, extraBase: 240 },
    { pctText: '16⅔%', num: 1, den: 6, base: 420, extraPctText: '33⅓%', extraNum: 1, extraDen: 3, extraBase: 270 },
    { pctText: '33⅓%', num: 1, den: 3, base: 540, extraPctText: '66⅔%', extraNum: 2, extraDen: 3, extraBase: 180 },
    { pctText: '66⅔%', num: 2, den: 3, base: 390, extraPctText: '16⅔%', extraNum: 1, extraDen: 6, extraBase: 360 },
    { pctText: '37,5%', num: 3, den: 8, base: 720, extraPctText: '62,5%', extraNum: 5, extraDen: 8, extraBase: 240 },
    { pctText: '87,5%', num: 7, den: 8, base: 320, extraPctText: '37,5%', extraNum: 3, extraDen: 8, extraBase: 400 },
    { pctText: '62,5%', num: 5, den: 8, base: 880, extraPctText: '12,5%', extraNum: 1, extraDen: 8, extraBase: 480 },
    { pctText: '12,5%', num: 1, den: 8, base: 720, extraPctText: '87,5%', extraNum: 7, extraDen: 8, extraBase: 240 },
    { pctText: '33⅓%', num: 1, den: 3, base: 780, extraPctText: '16⅔%', extraNum: 1, extraDen: 6, extraBase: 540 },
    { pctText: '66⅔%', num: 2, den: 3, base: 630, extraPctText: '33⅓%', extraNum: 1, extraDen: 3, extraBase: 450 },
    { pctText: '37,5%', num: 3, den: 8, base: 960, extraPctText: '25%', extraNum: 1, extraDen: 4, extraBase: 480 },
    { pctText: '87,5%', num: 7, den: 8, base: 640, extraPctText: '62,5%', extraNum: 5, extraDen: 8, extraBase: 320 },
  ];
  specialPct.forEach((s, idx) => {
    const part1 = (s.base / s.den) * s.num;
    const part2 = (s.extraBase / s.extraDen) * s.extraNum;
    const ans = part1 + part2;
    list.push(
      buildQuestion(
        idx + 2,
        'Numerik - Berhitung Cepat',
        `Hasil dari ${s.pctText} dari ${formatId(s.base)} ditambah ${s.extraPctText} dari ${formatId(s.extraBase)} adalah...`,
        formatId(ans),
        makeNumericDistractors(ans, [-40, -20, 20, 40]),
        `Konversi persen istimewa ke pecahan: ${s.pctText} = ${s.num}/${s.den} dan ${s.extraPctText} = ${s.extraNum}/${s.extraDen}. Maka (${s.num}/${s.den} × ${s.base}) + (${s.extraNum}/${s.extraDen} × ${s.extraBase}) = ${formatId(part1)} + ${formatId(part2)} = ${formatId(ans)}.`,
        `Hafalan wajib pecahan BKN (kelipatan 12,5% = /8, kelipatan 16⅔% = /6). Bagi dulu ${s.base}/${s.den} = ${s.base / s.den} lalu kalikan ${s.num}, jauh lebih cepat daripada mengali desimal!`
      )
    );
  });

  // D. Aljabar & Kuadrat Jumlah/Selisih Cepat (10 soal): x + y = S, xy = P, cari x² + y²
  const algParams: Array<[number, number]> = [
    [13, 36],
    [15, 44],
    [17, 60],
    [19, 78],
    [21, 90],
    [23, 112],
    [25, 136],
    [14, 45],
    [16, 55],
    [18, 65],
  ];
  algParams.forEach(([s, p], idx) => {
    const ans = s * s - 2 * p;
    list.push(
      buildQuestion(
        idx + 3,
        'Numerik - Berhitung Cepat',
        `Jika x + y = ${s} dan x × y = ${p}, maka nilai dari x² + y² adalah...`,
        formatId(ans),
        makeNumericDistractors(ans, [-p, -10, 10, 2 * p]),
        `Gunakan identitas aljabar (x + y)² = x² + 2xy + y², sehingga x² + y² = (x + y)² − 2xy = ${s}² − 2(${p}) = ${s * s} − ${2 * p} = ${formatId(ans)}.`,
        `Jangan mencari nilai x dan y satu per satu! Langsung kuadratkan jumlahnya (${s}² = ${s * s}) lalu kurangi 2×hasil kali (${2 * p}) → ${formatId(ans)}.`
      )
    );
  });

  // E. Desimal / Pembagian Cepat & Pangkat (10 soal): (a × 0,25 + b × 0,5) / 0,125
  const decParams: Array<[number, number]> = [
    [48, 26],
    [64, 34],
    [84, 42],
    [96, 52],
    [72, 38],
    [56, 46],
    [108, 54],
    [124, 62],
    [88, 36],
    [116, 48],
  ];
  decParams.forEach(([a, b], idx) => {
    const inside = a * 0.25 + b * 0.5;
    const ans = inside * 8;
    list.push(
      buildQuestion(
        idx + 4,
        'Numerik - Berhitung Cepat',
        `Nilai dari (${a} × 0,25 + ${b} × 0,5) ÷ 0,125 adalah...`,
        formatId(ans),
        makeNumericDistractors(ans, [-32, -16, 16, 32]),
        `Ubah ke pecahan: 0,25 = 1/4, 0,5 = 1/2, dan 0,125 = 1/8. Maka (${a}/4 + ${b}/2) ÷ (1/8) = (${a / 4} + ${b / 2}) × 8 = ${inside} × 8 = ${formatId(ans)}.`,
        `Trik kalikan 8 langsung ke dalam kurung! (0,25 × 8 = 2) dan (0,5 × 8 = 4), sehingga soal berubah menjadi 2(${a}) + 4(${b}) = ${2 * a} + ${4 * b} = ${formatId(ans)}!`
      )
    );
  });

  return list;
}

// ============================================================================
// 2. NUMERIK - DERET ANGKA HOTS (55 SOAL)
// ============================================================================
function buildSeriesQuestions(): SeedQuestion[] {
  const list: SeedQuestion[] = [];

  // A. Deret 2 Larik / Lompat 1 (15 soal): suku ganjil (+d1), suku genap (+d2 atau ×2)
  const twoLaneParams: Array<[number, number, number, number]> = [
    [5, 4, 40, -3],
    [7, 5, 52, -4],
    [11, 6, 65, -5],
    [9, 7, 48, -3],
    [14, 4, 80, -6],
    [6, 8, 70, -5],
    [12, 9, 90, -7],
    [8, 6, 55, -4],
    [15, 7, 64, -5],
    [10, 11, 82, -6],
    [4, 9, 75, -8],
    [18, 5, 44, -3],
    [13, 8, 96, -7],
    [21, 6, 60, -4],
    [16, 12, 88, -9],
  ];
  twoLaneParams.forEach(([a0, da, b0, db], idx) => {
    // Sequence: a0, b0, a1, b1, a2, b2, a3, b3 → ask next two: a4, b4
    const seq = [
      a0,
      b0,
      a0 + da,
      b0 + db,
      a0 + 2 * da,
      b0 + 2 * db,
      a0 + 3 * da,
      b0 + 3 * db,
    ];
    const nextA = a0 + 4 * da;
    const nextB = b0 + 4 * db;
    const correct = `${nextA}, ${nextB}`;
    const distractors: [string, string, string, string] = [
      `${nextA + da}, ${nextB}`,
      `${nextA}, ${nextB - db}`,
      `${nextA - 2}, ${nextB + 2}`,
      `${nextA + 2}, ${nextB - 2}`,
    ];
    list.push(
      buildQuestion(
        idx,
        'Numerik - Deret Angka HOTS',
        `Tentukan dua bilangan selanjutnya pada deret berikut:\n${seq.join(', ')}, ..., ...`,
        correct,
        distractors,
        `Ini adalah deret 2 larik (lompat 1). Larik ganjil (posisi 1,3,5,7): ${seq[0]}, ${seq[2]}, ${seq[4]}, ${seq[6]} berpola +${da} → berikutnya ${nextA}. Larik genap (posisi 2,4,6,8): ${seq[1]}, ${seq[3]}, ${seq[5]}, ${seq[7]} berpola ${db} → berikutnya ${nextB}.`,
        `Jika angka naik-turun berselang-seling, langsung pecah menjadi 2 larik lompat 1! Cukup cek elemen pertama (${nextA}) untuk mengeliminasi opsi yang bukan ${nextA}.`
      )
    );
  });

  // B. Deret 3 Larik / Lompat 2 (10 soal)
  const threeLaneParams: Array<[number, number, number, number, number, number]> = [
    [3, 4, 20, -2, 5, 3],
    [4, 5, 35, -3, 10, 4],
    [6, 3, 42, -4, 8, 5],
    [2, 6, 50, -5, 11, 2],
    [9, 4, 30, -3, 7, 6],
    [5, 7, 45, -4, 12, 3],
    [8, 5, 60, -6, 9, 4],
    [7, 6, 38, -2, 14, 5],
    [10, 3, 54, -5, 6, 7],
    [11, 4, 48, -4, 15, 3],
  ];
  threeLaneParams.forEach(([a, da, b, db, c, dc], idx) => {
    const seq = [
      a, b, c,
      a + da, b + db, c + dc,
      a + 2 * da, b + 2 * db, c + 2 * dc,
    ];
    const nextA = a + 3 * da;
    const nextB = b + 3 * db;
    const correct = `${nextA}, ${nextB}`;
    const distractors: [string, string, string, string] = [
      `${nextA + da}, ${nextB}`,
      `${nextA}, ${nextB + db}`,
      `${nextA - 1}, ${nextB + 1}`,
      `${nextA + 2}, ${nextB - 2}`,
    ];
    list.push(
      buildQuestion(
        idx + 1,
        'Numerik - Deret Angka HOTS',
        `Tentukan dua suku berikutnya dari deret 3 larik berikut:\n${seq.join(', ')}, ..., ...`,
        correct,
        distractors,
        `Pecah menjadi 3 larik (lompat 2). Larik 1 (ke-1,4,7): ${a}, ${a + da}, ${a + 2 * da} (+${da}) → ke-10 = ${nextA}. Larik 2 (ke-2,5,8): ${b}, ${b + db}, ${b + 2 * db} (${db}) → ke-11 = ${nextB}.`,
        `Deret panjang (9 suku) dengan pola acak berdekatan hampir pasti 3 larik! Langsung lompat 3 indeks dari suku ke-7 (${seq[6]} + ${da} = ${nextA}) dan ke-8 (${seq[7]} ${db} = ${nextB}).`
      )
    );
  });

  // C. Deret Bertingkat Orde-2 (10 soal): beda pertama naik konstan (+k)
  const level2Params: Array<[number, number, number]> = [
    [4, 3, 2],
    [6, 4, 3],
    [10, 5, 2],
    [3, 2, 4],
    [8, 6, 3],
    [12, 4, 4],
    [5, 7, 2],
    [9, 3, 5],
    [15, 5, 3],
    [7, 4, 5],
  ];
  level2Params.forEach(([start, d0, dd], idx) => {
    const seq: number[] = [start];
    let diff = d0;
    for (let i = 0; i < 5; i++) {
      seq.push(seq[seq.length - 1] + diff);
      diff += dd;
    }
    const ans = seq[seq.length - 1] + diff;
    const diffs = seq.slice(1).map((v, i) => v - seq[i]);
    list.push(
      buildQuestion(
        idx + 2,
        'Numerik - Deret Angka HOTS',
        `Bilangan selanjutnya yang tepat untuk melengkapi deret berikut adalah...\n${seq.join(', ')}, ...`,
        formatId(ans),
        makeNumericDistractors(ans, [-dd, -2, dd, dd + 3]),
        `Hitung selisih tingkat pertama: ${diffs.map((d) => `+${d}`).join(', ')}. Selisih tingkat kedua konstan +${dd}. Maka selisih berikutnya adalah ${diffs[diffs.length - 1]} + ${dd} = +${diff}, sehingga suku berikutnya = ${seq[seq.length - 1]} + ${diff} = ${ans}.`,
        `Cek kenaikan selisih di 2 suku terakhir saja: selisih terakhir ${diffs[diffs.length - 1]} naik ${dd} → +${diff}. Tambahkan ke ${seq[seq.length - 1]} → ${ans}.`
      )
    );
  });

  // D. Deret Kombinasi Operasi Bergantian (10 soal): ×2 lalu −k (atau +k)
  const altOpParams: Array<[number, number]> = [
    [5, -3],
    [4, +3],
    [6, -4],
    [7, -5],
    [3, +4],
    [8, -6],
    [5, +2],
    [9, -7],
    [6, +5],
    [10, -8],
  ];
  altOpParams.forEach(([start, offset], idx) => {
    const seq: number[] = [start];
    for (let step = 0; step < 5; step++) {
      const prev = seq[seq.length - 1];
      seq.push(step % 2 === 0 ? prev * 2 : prev + offset);
    }
    // step 5 was offset (odd), so step 6 is ×2, step 7 is +offset -> ask step 6
    // Wait: step=0(×2), 1(+off), 2(×2), 3(+off), 4(×2) → seq has 6 elems, last op was step=4 (×2), so next is +offset, then ×2!
    const next1 = seq[seq.length - 1] + offset;
    const next2 = next1 * 2;
    const opLabel = offset >= 0 ? `+${offset}` : `${offset}`;
    const correct = `${next1}, ${next2}`;
    const distractors: [string, string, string, string] = [
      `${seq[seq.length - 1] * 2}, ${seq[seq.length - 1] * 2 + offset}`,
      `${next1 + 2}, ${(next1 + 2) * 2}`,
      `${next1}, ${next1 + offset}`,
      `${next1 - 2}, ${next2 - 4}`,
    ];
    list.push(
      buildQuestion(
        idx + 3,
        'Numerik - Deret Angka HOTS',
        `Tentukan dua bilangan berikutnya dari deret kombinasi operasi berikut:\n${seq.join(', ')}, ..., ...`,
        correct,
        distractors,
        `Pola operasi bergantian: ×2, ${opLabel}, ×2, ${opLabel}, ×2. Karena langkah terakhir (${seq[4]} → ${seq[5]}) adalah ×2, maka langkah berikutnya adalah ${seq[5]} ${opLabel} = ${next1}, diikuti ${next1} × 2 = ${next2}.`,
        `Lihat lonjakan ganda yang berulang (${seq[0]}→${seq[1]}, ${seq[2]}→${seq[3]}, ${seq[4]}→${seq[5]}). Begitu pola (×2, ${opLabel}) terlihat, langsung hitung 2 suku akhir!`
      )
    );
  });

  // E. Fibonacci Termodifikasi & Pola Kuadrat ± Offset (10 soal)
  const fibParams: Array<[number, number, number]> = [
    [2, 3, 1],
    [3, 4, 2],
    [4, 5, -1],
    [2, 5, 1],
    [3, 6, -2],
  ];
  fibParams.forEach(([a0, a1, c], idx) => {
    const seq = [a0, a1];
    for (let i = 0; i < 4; i++) {
      seq.push(seq[seq.length - 1] + seq[seq.length - 2] + c);
    }
    const ans = seq[seq.length - 1] + seq[seq.length - 2] + c;
    const cLabel = c >= 0 ? `+ ${c}` : `− ${Math.abs(c)}`;
    list.push(
      buildQuestion(
        idx + 4,
        'Numerik - Deret Angka HOTS',
        `Tentukan suku berikutnya dari deret berikut:\n${seq.join(', ')}, ...`,
        formatId(ans),
        makeNumericDistractors(ans, [-c === 0 ? -2 : -Math.abs(c) - 1, -1, 2, 4]),
        `Ini adalah deret Fibonacci termodifikasi dengan aturan Uₙ = Uₙ₋₁ + Uₙ₋₂ ${cLabel}. Cek: ${seq[0]} + ${seq[1]} ${cLabel} = ${seq[2]}; ${seq[1]} + ${seq[2]} ${cLabel} = ${seq[3]}. Maka berikutnya = ${seq[4]} + ${seq[5]} ${cLabel} = ${ans}.`,
        `Jika deret tumbuh cepat namun bukan kelipatan tetap, uji jumlah 2 suku sebelumnya! Cek selisih (U₃ − (U₁+U₂)) = ${c}, lalu langsung jumlahkan ${seq[4]} + ${seq[5]} ${cLabel} = ${ans}.`
      )
    );
  });

  const sqOffsetParams: Array<[number, number]> = [
    [2, 1],
    [3, -2],
    [2, 3],
    [4, -1],
    [3, 2],
  ];
  sqOffsetParams.forEach(([startN, offset], idx) => {
    const seq: number[] = [];
    for (let i = 0; i < 5; i++) {
      const n = startN + i;
      seq.push(n * n + offset);
    }
    const nextN = startN + 5;
    const ans = nextN * nextN + offset;
    const offLabel = offset >= 0 ? `+ ${offset}` : `− ${Math.abs(offset)}`;
    list.push(
      buildQuestion(
        idx,
        'Numerik - Deret Angka HOTS',
        `Bilangan selanjutnya yang tepat pada deret berikut adalah...\n${seq.join(', ')}, ...`,
        formatId(ans),
        makeNumericDistractors(ans, [-4, -2, 2, 5]),
        `Setiap suku mengikuti rumus kuadrat n² ${offLabel} mulai n = ${startN}: ${startN}² ${offLabel} = ${seq[0]}, ..., ${startN + 4}² ${offLabel} = ${seq[4]}. Untuk n = ${nextN}: ${nextN}² ${offLabel} = ${nextN * nextN} ${offLabel} = ${ans}.`,
        `Kenali angka dekat bilangan kuadrat (4, 9, 16, 25, 36, 49, 64, 81, 100)! Semua suku bergeser konstan ${offLabel} dari kuadrat berurutan → ${nextN}² ${offLabel} = ${ans}.`
      )
    );
  });

  return list;
}

// ============================================================================
// 3. NUMERIK - PERBANDINGAN KUANTITATIF (50 SOAL HOTS)
// ============================================================================
function buildQuantComparisonQuestions(): SeedQuestion[] {
  const list: SeedQuestion[] = [];
  const STD_OPTS: [string, string, string, string, string] = [
    'X > Y',
    'X < Y',
    'X = Y',
    '2X = Y',
    'Hubungan X dan Y tidak dapat ditentukan',
  ];
  const STD_OPTS_REV: [string, string, string, string, string] = [
    'X > Y',
    'X < Y',
    'X = Y',
    'X = 2Y',
    'Hubungan X dan Y tidak dapat ditentukan',
  ];

  function addQuant(
    pertanyaan: string,
    options: [string, string, string, string, string],
    correctIdx: KeyIdx,
    metode1: string,
    metode2: string
  ) {
    list.push({
      exam_type: 'SKD',
      kategori: 'TIU',
      subtopik: 'Numerik - Perbandingan Kuantitatif',
      pertanyaan,
      opsi_a: options[0],
      opsi_b: options[1],
      opsi_c: options[2],
      opsi_d: options[3],
      opsi_e: options[4],
      jawaban_benar: KEYS[correctIdx],
      pembahasan: `Metode 1 (Langkah Sistematis): ${metode1}\nMetode 2 (Trik Cepat / Eliminasi): ${metode2}`,
    });
  }

  // Group 1 (10 soal): X = Y (Sifat komutatif persen: a% dari b vs b% dari a, atau penyederhanaan aljabar)
  const symPct: Array<[number, number]> = [
    [37, 84], [43, 68], [29, 75], [64, 35], [58, 45],
    [72, 25], [83, 40], [19, 95], [54, 65], [47, 80],
  ];
  symPct.forEach(([a, b]) => {
    const val = (a * b) / 100;
    addQuant(
      `Diketahui X = ${a}% dari ${b} dan Y = ${b}% dari ${a}. Hubungan yang tepat antara X dan Y adalah...`,
      STD_OPTS,
      2,
      `X = (${a}/100) × ${b} = ${formatId(val)}. Y = (${b}/100) × ${a} = ${formatId(val)}. Karena nilai keduanya sama persis, maka X = Y.`,
      `Gunakan sifat komutatif perkalian: a% dari b = (a×b)/100 = b% dari a! Tanpa menghitung satu angka pun, langsung kunci X = Y dalam 3 detik.`
    );
  });

  // Group 2 (10 soal): Hubungan tidak dapat ditentukan (jebakan pangkat genap / variabel tak dibatasi tanda)
  const ambigSquares: Array<[number, number]> = [
    [16, 4], [36, 6], [64, 8], [100, 10], [144, 12],
  ];
  ambigSquares.forEach(([sq, root]) => {
    addQuant(
      `Diketahui x² = ${sq} dan y = ${root}. Jika X = x dan Y = y, maka hubungan antara X dan Y adalah...`,
      STD_OPTS,
      4,
      `Persamaan x² = ${sq} memiliki dua akar real: x = +${root} atau x = −${root}. Jika x = +${root} maka X = Y; jika x = −${root} maka X < Y. Karena menghasilkan dua hubungan berbeda, hubungan X dan Y tidak dapat ditentukan.`,
      `Waspadai jebakan klasik pangkat genap! Tanpa keterangan "x > 0", persamaan x² = ${sq} selalu menyembunyikan akar negatif (−${root}) → langsung pilih "tidak dapat ditentukan".`
    );
  });

  const extraAmbigScenarios: Array<{ q: string; m1: string; m2: string }> = [
    {
      q: 'Diketahui a dan b adalah bilangan real dengan a > b. Jika X = a × c dan Y = b × c (dengan c bilangan real sembarang), maka hubungan X dan Y adalah...',
      m1: 'Nilai perbandingan ac dan bc bergantung pada tanda c: jika c > 0 maka X > Y; jika c = 0 maka X = Y; jika c < 0 maka X < Y. Karena tanda c tidak diketahui, hubungan X dan Y tidak dapat ditentukan.',
      m2: 'Uji 2 nilai ekstrem cepat: c = 1 → X > Y, c = −1 → X < Y. Begitu muncul dua hasil bertolak belakang, langsung kunci "tidak dapat ditentukan"!',
    },
    {
      q: 'Diketahui p dan q adalah bilangan real yang memenuhi p + q = 18. Jika X = p dan Y = q, maka hubungan yang tepat antara X dan Y adalah...',
      m1: 'Banyak pasangan bilangan real yang berjumlah 18, misalnya (p = 12, q = 6) menghasilkan X > Y, (p = 9, q = 9) menghasilkan X = Y, dan (p = 4, q = 14) menghasilkan X < Y. Maka hubungan tidak dapat ditentukan.',
      m2: 'Satu persamaan dengan dua variabel bebas tanpa syarat tambahan tidak pernah mengunci urutan X vs Y → langsung pilih "tidak dapat ditentukan".',
    },
    {
      q: 'Diketahui |k| = 9 dan m = 9. Jika X = k dan Y = m, maka hubungan antara X dan Y adalah...',
      m1: 'Nilai mutlak |k| = 9 memiliki dua penyelesaian: k = 9 (sehingga X = Y) atau k = −9 (sehingga X < Y). Karena ada dua kemungkinan hubungan, hubungan X dan Y tidak dapat ditentukan.',
      m2: 'Ingat sifat nilai mutlak: |k| = 9 berarti k = ±9! Tanpa syarat k positif, langsung kunci "tidak dapat ditentukan".',
    },
    {
      q: 'Diketahui m dan n adalah bilangan real dengan m < n. Jika X = m² dan Y = n², maka hubungan yang tepat antara X dan Y adalah...',
      m1: 'Jika m = 2, n = 3 maka X = 4 < Y = 9. Namun jika m = −5, n = 2 (tetap m < n) maka X = 25 > Y = 4. Karena tanda m dan n tidak dibatasi positif, hubungan X dan Y tidak dapat ditentukan.',
      m2: 'Langsung uji kombinasi bilangan negatif: m = −5, n = 1 → (−5)² > 1², padahal untuk positif berlaku sebaliknya → tidak dapat ditentukan!',
    },
    {
      q: 'Diketahui a × b = 24 dengan a dan b bilangan bulat. Jika X = a dan Y = b, maka hubungan yang tepat antara X dan Y adalah...',
      m1: 'Pasangan faktor 24 bersifat simetris: bisa a = 6, b = 4 (X > Y), atau a = 4, b = 6 (X < Y), atau a = −6, b = −4 (X < Y). Maka hubungan X dan Y tidak dapat ditentukan.',
      m2: 'Karena posisi a dan b bisa ditukar bebas tanpa melanggar a × b = 24, urutan X dan Y pasti tidak dapat ditentukan!',
    },
  ];
  extraAmbigScenarios.forEach((sc) => {
    addQuant(sc.q, STD_OPTS, 4, sc.m1, sc.m2);
  });

  // Group 3 (10 soal): Perbandingan Pecahan (X > Y atau X < Y dengan kali silang)
  const fracPairs: Array<[number, number, number, number]> = [
    [7, 9, 5, 7],    // 49 > 45 -> X > Y
    [5, 8, 7, 11],   // 55 < 56 -> X < Y
    [11, 13, 8, 10], // 110 > 104 -> X > Y
    [9, 14, 2, 3],   // 27 < 28 -> X < Y
    [13, 15, 11, 13],// 169 > 165 -> X > Y
    [4, 7, 7, 12],   // 48 < 49 -> X < Y
    [17, 20, 5, 6],  // 102 > 100 -> X > Y
    [7, 12, 3, 5],   // 35 < 36 -> X < Y
    [19, 24, 3, 4],  // 76 > 72 -> X > Y
    [8, 15, 5, 9],   // 72 < 75 -> X < Y
  ];
  fracPairs.forEach(([n1, d1, n2, d2]) => {
    const lhs = n1 * d2;
    const rhs = n2 * d1;
    const isGreater = lhs > rhs;
    addQuant(
      `Diketahui X = ${n1}/${d1} dan Y = ${n2}/${d2}. Hubungan yang tepat antara X dan Y adalah...`,
      STD_OPTS,
      isGreater ? 0 : 1,
      `Samakan penyebut atau kalikan silang: ${n1} × ${d2} = ${lhs} dan ${n2} × ${d1} = ${rhs}. Karena ${lhs} ${isGreater ? '>' : '<'} ${rhs}, maka ${n1}/${d1} ${isGreater ? '>' : '<'} ${n2}/${d2}, sehingga ${isGreater ? 'X > Y' : 'X < Y'}.`,
      `Jangan ubah ke desimal panjang! Langsung kali silang ke atas: kiri = ${n1}×${d2} = ${lhs}, kanan = ${n2}×${d1} = ${rhs} → langsung ketemu ${isGreater ? 'X > Y' : 'X < Y'} dalam 5 detik.`
    );
  });

  // Group 4 (10 soal): Hubungan 2X = Y atau X = 2Y (eksak & saling eksklusif — tanpa opsi ganda yang sama-sama benar!)
  const OPTS_TWO_X_EQ_Y: [string, string, string, string, string] = [
    'X > Y',
    'X = Y',
    '2X = Y',
    'X = 2Y',
    'Hubungan X dan Y tidak dapat ditentukan',
  ];
  const OPTS_X_EQ_TWO_Y: [string, string, string, string, string] = [
    'X < Y',
    'X = Y',
    '2X = Y',
    'X = 2Y',
    'Hubungan X dan Y tidak dapat ditentukan',
  ];
  const doubleSpecs: Array<{ xExpr: string; yExpr: string; xVal: number; yVal: number; isTwoXEqY: boolean }> = [
    { xExpr: '1/4 + 1/8', yExpr: '3/4', xVal: 0.375, yVal: 0.75, isTwoXEqY: true },
    { xExpr: '25% dari 120', yExpr: '15% dari 100', xVal: 30, yVal: 15, isTwoXEqY: false },
    { xExpr: '0,35 × 40', yExpr: '0,7 × 40', xVal: 14, yVal: 28, isTwoXEqY: true },
    { xExpr: '(18² − 12²) / 3', yExpr: '(18² − 12²) / 6', xVal: 60, yVal: 30, isTwoXEqY: false },
    { xExpr: '1/3 dari 54', yExpr: '2/3 dari 54', xVal: 18, yVal: 36, isTwoXEqY: true },
    { xExpr: '40% dari 150', yExpr: '20% dari 150', xVal: 60, yVal: 30, isTwoXEqY: false },
    { xExpr: '√144 + √81', yExpr: '6 × 7', xVal: 21, yVal: 42, isTwoXEqY: true },
    { xExpr: '5³ − 25', yExpr: '2 × 25', xVal: 100, yVal: 50, isTwoXEqY: false },
    { xExpr: '3/5 dari 45', yExpr: '6/5 dari 45', xVal: 27, yVal: 54, isTwoXEqY: true },
    { xExpr: '75% dari 80', yExpr: '37,5% dari 80', xVal: 60, yVal: 30, isTwoXEqY: false },
  ];
  doubleSpecs.forEach((sp) => {
    if (sp.isTwoXEqY) {
      addQuant(
        `Diketahui X = ${sp.xExpr} dan Y = ${sp.yExpr}. Hubungan yang tepat antara X dan Y adalah...`,
        OPTS_TWO_X_EQ_Y,
        2,
        `Hitung nilai masing-masing: X = ${formatId(sp.xVal, 3)} dan Y = ${formatId(sp.yVal, 3)}. Perhatikan bahwa 2 × X = 2 × ${formatId(sp.xVal, 3)} = ${formatId(sp.yVal, 3)} = Y, sehingga satu-satunya hubungan yang benar adalah 2X = Y.`,
        `Bandingkan rasio X : Y secara langsung tanpa menghitung rumit: terlihat Y tepat 2 kali lipat X → langsung pilih 2X = Y!`
      );
    } else {
      addQuant(
        `Diketahui X = ${sp.xExpr} dan Y = ${sp.yExpr}. Hubungan yang tepat antara X dan Y adalah...`,
        OPTS_X_EQ_TWO_Y,
        3,
        `Hitung nilai masing-masing: X = ${formatId(sp.xVal, 3)} dan Y = ${formatId(sp.yVal, 3)}. Karena X = 2 × ${formatId(sp.yVal, 3)} = 2Y, satu-satunya hubungan yang benar adalah X = 2Y.`,
        `Perhatikan faktor pengali/pembagi: X tepat 2 kali nilai Y → langsung pilih X = 2Y!`
      );
    }
  });

  // Group 5 (10 soal): Perbandingan Kontekstual (Kecepatan / Harga / Diskon / Luas)
  const contextSpecs: Array<{
    q: string;
    ansIdx: KeyIdx;
    m1: string;
    m2: string;
  }> = [
    {
      q: 'Sebuah barang seharga Rp200.000 mendapat diskon tunggal 30% (harga akhir = X), sedangkan barang sejenis di toko lain mendapat diskon bertingkat 20% + 10% (harga akhir = Y). Hubungan X dan Y adalah...',
      ansIdx: 1,
      m1: 'X = 70% × 200.000 = Rp140.000. Y = 90% × (80% × 200.000) = 72% × 200.000 = Rp144.000. Maka X < Y.',
      m2: 'Rumus diskon bertingkat a% + b% = (a + b − ab/100)% = 28% < 30%. Diskon tunggal 30% lebih besar → harga bayar X lebih murah → X < Y!',
    },
    {
      q: 'Luas persegi dengan keliling 40 cm adalah X cm², sedangkan luas persegi panjang berukuran 12 cm × 8 cm adalah Y cm². Hubungan X dan Y adalah...',
      ansIdx: 0,
      m1: 'Sisi persegi = 40/4 = 10 cm → X = 10 × 10 = 100 cm². Y = 12 × 8 = 96 cm². Karena 100 > 96, maka X > Y.',
      m2: 'Sifat geometri klasik: untuk keliling yang sama (keduanya 40 cm), persegi SELALU memiliki luas maksimum lebih besar daripada persegi panjang tidak sama sisi → X > Y!',
    },
    {
      q: 'Jika a > 0, bandingkan X = (a + 3)² dan Y = a² + 9. Hubungan yang pasti benar adalah...',
      ansIdx: 0,
      m1: 'Uraikan X = a² + 6a + 9. Bandingkan dengan Y = a² + 9, maka X − Y = 6a. Karena a > 0, maka 6a > 0 sehingga X > Y.',
      m2: 'Coret suku sama (a² + 9) di kedua sisi: tersisa X = 6a dan Y = 0. Karena a positif, pasti X > Y!',
    },
    {
      q: 'Sebuah mobil menempuh 180 km dalam 3 jam (kecepatan rata-rata = X km/jam). Kereta api menempuh 260 km dalam 4 jam (kecepatan rata-rata = Y km/jam). Hubungan X dan Y adalah...',
      ansIdx: 1,
      m1: 'X = 180 / 3 = 60 km/jam. Y = 260 / 4 = 65 km/jam. Karena 60 < 65, maka X < Y.',
      m2: 'Bagi cepat: 180/3 = 60 vs 260/4 = 65 → X < Y.',
    },
    {
      q: 'Jika 3x + 6 = 27 dan 2y − 4 = 10, bandingkan X = x dan Y = y. Hubungan yang tepat adalah...',
      ansIdx: 2,
      m1: '3x = 21 → x = 7. 2y = 14 → y = 7. Karena x = y = 7, maka X = Y.',
      m2: 'Selesaikan linear 1 langkah: x = (27−6)/3 = 7, y = (10+4)/2 = 7 → X = Y.',
    },
    {
      q: 'Diketahui 0 < p < 1. Jika X = p² dan Y = p, maka hubungan yang pasti benar antara X dan Y adalah...',
      ansIdx: 1,
      m1: 'Untuk bilangan pecahan positif antara 0 dan 1 (misal p = 1/2), p² = 1/4 < 1/2 = p. Secara aljabar, p² − p = p(p − 1) < 0 karena p > 0 dan (p − 1) < 0, sehingga X < Y.',
      m2: 'Subtitusi cepat p = 0,5 → X = 0,25 dan Y = 0,5 → langsung terlihat X < Y!',
    },
    {
      q: 'Harga 5 buku tulis adalah Rp35.000 (harga 1 buku = X). Harga 4 pulpen adalah Rp30.000 (harga 1 pulpen = Y). Hubungan X dan Y adalah...',
      ansIdx: 1,
      m1: 'X = 35.000 / 5 = Rp7.000. Y = 30.000 / 4 = Rp7.500. Maka X < Y.',
      m2: 'Bandingkan satuan cepat: 35/5 = 7 vs 30/4 = 7,5 → X < Y.',
    },
    {
      q: 'Bandingkan X = 1/2 + 1/3 + 1/6 dan Y = 0,99. Hubungan yang tepat adalah...',
      ansIdx: 0,
      m1: 'X = 3/6 + 2/6 + 1/6 = 6/6 = 1. Karena 1 > 0,99, maka X > Y.',
      m2: 'Ingat identitas populer BKN: 1/2 + 1/3 + 1/6 = tepat 1! Maka 1 > 0,99 → X > Y.',
    },
    {
      q: 'Jika m < −1, bandingkan X = m³ dan Y = m². Hubungan yang pasti benar adalah...',
      ansIdx: 1,
      m1: 'Karena m negatif (m < −1), pangkat ganjil m³ pasti negatif, sedangkan pangkat genap m² pasti positif. Setiap bilangan negatif selalu lebih kecil daripada bilangan positif, sehingga X < Y.',
      m2: 'Cek tanda saja! Negatif³ = (−), Negatif² = (+). Pasti (−) < (+) → X < Y dalam 3 detik!',
    },
    {
      q: 'Sebuah tabung berjari-jari 7 cm dan tinggi 10 cm memiliki volume X cm³ (π = 22/7). Sebuah balok berukuran 20 cm × 11 cm × 7 cm memiliki volume Y cm³. Hubungan X dan Y adalah...',
      ansIdx: 2,
      m1: 'X = πr²t = (22/7) × 7 × 7 × 10 = 22 × 70 = 1.540 cm³. Y = 20 × 11 × 7 = 220 × 7 = 1.540 cm³. Maka X = Y.',
      m2: 'Jangan kalikan penuh! Bandingkan faktornya: X = 22 × 7 × 10 = 220 × 7; Y = (20 × 11) × 7 = 220 × 7 → faktornya identik, jadi X = Y!',
    },
  ];
  contextSpecs.forEach((sp) => addQuant(sp.q, STD_OPTS, sp.ansIdx, sp.m1, sp.m2));

  return list;
}

// ============================================================================
// 4. NUMERIK - SOAL CERITA ARITMETIKA (55 SOAL HOTS)
// ============================================================================
function buildWordProblemQuestions(): SeedQuestion[] {
  const list: SeedQuestion[] = [];

  // A. Perbandingan Berbalik Nilai & Proyek dengan Jeda Libur (14 soal)
  // Formula: W workers planned D days. Worked d1 days, stopped s days.
  // Remaining work = W * (D - d1). Remaining time = D - d1 - s.
  // Needed total workers = W * (D - d1) / (D - d1 - s). Extra = Needed - W = W * s / (D - d1 - s).
  const projParams: Array<[number, number, number, number]> = [
    [12, 30, 10, 4],   // rem=20, remTime=16, extra = 12*4/16 = 3
    [15, 24, 6, 3],    // rem=18, remTime=15, extra = 15*3/15 = 3
    [20, 40, 15, 5],   // rem=25, remTime=20, extra = 20*5/20 = 5
    [18, 36, 12, 6],   // rem=24, remTime=18, extra = 18*6/18 = 6
    [24, 32, 8, 4],    // rem=24, remTime=20 -> 24*4/20 not int! Let's make exact ints!
    [25, 30, 5, 5],    // rem=25, remTime=20 -> 25*5/20 not int! Wait: fix all below to exact ints!
  ];
  void projParams;

  const exactProj: Array<[number, number, number, number]> = [
    [12, 30, 10, 4],   // extra = 12*4/16 = 3
    [15, 24, 6, 3],    // extra = 15*3/15 = 3
    [20, 40, 15, 5],   // extra = 20*5/20 = 5
    [18, 36, 12, 6],   // extra = 18*6/18 = 6
    [16, 28, 8, 4],    // rem=20, remTime=16, extra = 16*4/16 = 4
    [24, 30, 10, 4],   // rem=20, remTime=16, extra = 24*4/16 = 6
    [21, 35, 7, 7],    // rem=28, remTime=21, extra = 21*7/21 = 7
    [30, 45, 15, 5],   // rem=30, remTime=25, extra = 30*5/25 = 6
    [14, 25, 4, 7],    // rem=21, remTime=14, extra = 14*7/14 = 7
    [28, 40, 12, 7],   // rem=28, remTime=21 -> 28*7/21 non-int -> replace: [27, 40, 13, 9]: rem=27, remTime=18 -> 27*9/18 non-int -> [24, 40, 10, 6]: rem=30, remTime=24, extra = 24*6/24 = 6
    [32, 50, 10, 8],   // rem=40, remTime=32, extra = 32*8/32 = 8
    [10, 22, 7, 5],    // rem=15, remTime=10, extra = 10*5/10 = 5
    [36, 48, 12, 9],   // rem=36, remTime=27 -> 36*9/27 = 12!
    [40, 60, 20, 8],   // rem=40, remTime=32, extra = 40*8/32 = 10!
  ];
  exactProj[9] = [24, 40, 10, 6]; // extra = 6

  exactProj.forEach(([w, d, d1, s], idx) => {
    const remDays = d - d1;
    const remTime = remDays - s;
    const extra = (w * s) / remTime;
    const totalNeeded = w + extra;
    list.push(
      buildQuestion(
        idx,
        'Numerik - Soal Cerita Aritmetika',
        `Suatu proyek gedung direncanakan selesai dalam ${d} hari oleh ${w} pekerja. Setelah dikerjakan selama ${d1} hari, proyek terpaksa dihentikan selama ${s} hari karena kendala logistik. Agar proyek tetap selesai tepat waktu, berapa banyak pekerja TAMBAHAN yang diperlukan?`,
        `${extra} orang`,
        makeNumericDistractors(extra, [-2, -1, 2, 4], (n) => `${Math.max(1, n)} orang`),
        `Sisa beban kerja = ${w} × (${d} − ${d1}) = ${w * remDays} orang-hari. Sisa waktu = ${remDays} − ${s} = ${remTime} hari. Total pekerja dibutuhkan = ${w * remDays} / ${remTime} = ${totalNeeded} orang. Tambahan pekerja = ${totalNeeded} − ${w} = ${extra} orang.`,
        `Rumus kilat BKN: Tambahan = (Pekerja Awal × Hari Libur) / Sisa Hari Efektif = (${w} × ${s}) / ${remTime} = ${extra} orang dalam 10 detik!`
      )
    );
  });

  // B. Kecepatan, Jarak, Waktu — Berpapasan & Menyusul (14 soal)
  // 7 soal Berpapasan (berangkat bersamaan): t = S / (v1 + v2)
  const meetParams: Array<[number, number, number, number]> = [
    [220, 50, 60, 8],  // 2 jam -> 10.00
    [270, 40, 50, 7],  // 3 jam -> 10.00
    [330, 55, 55, 8],  // 3 jam -> 11.00
    [250, 45, 55, 9],  // 2,5 jam -> 11.30
    [360, 52, 68, 7],  // 3 jam -> 10.00
    [195, 60, 70, 8],  // 1,5 jam -> 09.30
    [420, 65, 75, 6],  // 3 jam -> 09.00
  ];
  meetParams.forEach(([dist, v1, v2, startHour], idx) => {
    const hours = dist / (v1 + v2);
    const totalMins = Math.round(hours * 60);
    const endHour = startHour + Math.floor(totalMins / 60);
    const endMin = totalMins % 60;
    const fmtClock = (h: number, m: number) =>
      `${String(h).padStart(2, '0')}.${String(m).padStart(2, '0')}`;
    const correct = `Pukul ${fmtClock(endHour, endMin)}`;
    const distractors: [string, string, string, string] = [
      `Pukul ${fmtClock(endHour - 1, endMin)}`,
      `Pukul ${fmtClock(endHour, (endMin + 30) % 60 === 0 ? 15 : 30)}`,
      `Pukul ${fmtClock(endHour + 1, endMin)}`,
      `Pukul ${fmtClock(endHour + 1, (endMin + 30) % 60)}`,
    ];
    list.push(
      buildQuestion(
        idx + 1,
        'Numerik - Soal Cerita Aritmetika',
        `Kota P dan Kota Q berjarak ${dist} km. Pada pukul ${fmtClock(startHour, 0)}, mobil A berangkat dari P menuju Q dengan kecepatan rata-rata ${v1} km/jam, dan pada saat yang sama mobil B berangkat dari Q menuju P dengan kecepatan ${v2} km/jam melalui jalur yang sama. Pada pukul berapakah kedua mobil tersebut berpapasan?`,
        correct,
        distractors,
        `Waktu berpapasan t = Jarak / (v₁ + v₂) = ${dist} / (${v1} + ${v2}) = ${dist} / ${v1 + v2} = ${formatId(hours, 1)} jam (${Math.floor(totalMins / 60)} jam${endMin > 0 ? ` ${endMin} menit` : ''}). Ditambahkan ke pukul ${fmtClock(startHour, 0)} menghasilkan ${correct}.`,
        `Karena saling mendekat, langsung JUMLAHKAN kecepatannya (${v1 + v2} km/jam), lalu bagi jarak ${dist} / ${v1 + v2} = ${formatId(hours, 1)} jam → ${correct}.`
      )
    );
  });

  // 7 soal Menyusul: kendaraan A berangkat lebih dulu t0 jam dengan v1, B menyusul dengan v2 > v1
  const catchParams: Array<[number, number, number]> = [
    [40, 60, 1],   // selisih jarak 40, selisih v=20 -> 2 jam
    [50, 75, 1],   // selisih jarak 50, selisih v=25 -> 2 jam
    [45, 60, 1],   // selisih jarak 45, selisih v=15 -> 3 jam
    [48, 72, 1],   // selisih jarak 48, selisih v=24 -> 2 jam
    [40, 65, 2],   // selisih jarak 80, selisih v=25 -> 3,2 jam (192 mnt) -> ubah jadi [45, 75, 2]: 90/30 = 3 jam
    [54, 72, 1],   // selisih jarak 54, selisih v=18 -> 3 jam
    [60, 80, 1],   // selisih jarak 60, selisih v=20 -> 3 jam
  ];
  catchParams[4] = [45, 75, 2];

  catchParams.forEach(([v1, v2, delay], idx) => {
    const gap = v1 * delay;
    const tCatch = gap / (v2 - v1);
    const distCatch = v2 * tCatch;
    list.push(
      buildQuestion(
        idx + 2,
        'Numerik - Soal Cerita Aritmetika',
        `Sebuah truk logistik berangkat dari gudang dengan kecepatan rata-rata ${v1} km/jam. ${delay} jam kemudian, mobil dinas menyusul dari titik yang sama dengan kecepatan ${v2} km/jam melalui rute yang sama. Pada jarak berapa kilometer dari gudang mobil dinas berhasil menyusul truk tersebut?`,
        `${distCatch} km`,
        makeNumericDistractors(distCatch, [-40, -20, 20, 40], (n) => `${n} km`),
        `Jarak unggul truk saat mobil berangkat = ${v1} × ${delay} = ${gap} km. Waktu menyusul = Selisih Jarak / (v₂ − v₁) = ${gap} / (${v2} − ${v1}) = ${tCatch} jam. Jarak dari gudang = ${v2} × ${tCatch} = ${distCatch} km.`,
        `Rumus cepat menyusul: t = (v₁ × Δt) / (v₂ − v₁) = ${gap}/${v2 - v1} = ${tCatch} jam, lalu kalikan kecepatan penyusul (${v2}) → ${distCatch} km!`
      )
    );
  });

  // C. Aritmetika Sosial — Diskon, Untung-Rugi, Bunga Tunggal (14 soal)
  // 7 soal Harga Awal sebelum untung/diskon (jebakan persentase!)
  const profitSpecs: Array<[number, number]> = [
    [25, 300000],  // beli = 240.000
    [20, 420000],  // beli = 350.000
    [15, 230000],  // beli = 200.000
    [25, 450000],  // beli = 360.000
    [20, 540000],  // beli = 450.000
    [10, 385000],  // beli = 350.000
    [30, 520000],  // beli = 400.000
  ];
  profitSpecs.forEach(([pct, sell], idx) => {
    const buy = (sell * 100) / (100 + pct);
    list.push(
      buildQuestion(
        idx + 3,
        'Numerik - Soal Cerita Aritmetika',
        `Sebuah koperasi pegawai menjual satu paket perlengkapan kerja seharga Rp${formatId(sell)} dan memperoleh keuntungan sebesar ${pct}% dari harga beli. Berapakah harga beli paket tersebut?`,
        `Rp${formatId(buy)}`,
        makeNumericDistractors(buy, [-30000, -15000, 15000, 30000], (n) => `Rp${formatId(n)}`),
        `Harga Jual = (100% + ${pct}%) × Harga Beli = ${100 + pct}% × Harga Beli. Maka Harga Beli = (100 / ${100 + pct}) × Rp${formatId(sell)} = Rp${formatId(buy)}.`,
        `JANGAN menghitung ${pct}% dari harga jual (jebakan umum)! Langsung bagi Rp${formatId(sell)} dengan ${(100 + pct) / 100} → Rp${formatId(buy)}.`
      )
    );
  });

  // 7 soal Bunga Tunggal / Tabungan
  const interestSpecs: Array<[number, number, number]> = [
    [6000000, 8, 9],    // bunga = 6jt * 8% * 9/12 = 360.000
    [8000000, 9, 8],    // bunga = 480.000
    [12000000, 6, 10],  // bunga = 600.000
    [10000000, 12, 7],  // bunga = 700.000
    [9000000, 8, 6],    // bunga = 360.000
    [15000000, 6, 8],   // bunga = 600.000
    [18000000, 9, 4],   // bunga = 18jt * 9% * 4/12 = 18jt * 3% = 540.000 (eksak!)
  ];
  interestSpecs.forEach(([principal, rate, months], idx) => {
    const interest = (principal * rate * months) / (100 * 12);
    const total = principal + interest;
    list.push(
      buildQuestion(
        idx + 4,
        'Numerik - Soal Cerita Aritmetika',
        `Seorang ASN menabung di koperasi sebesar Rp${formatId(principal)} dengan suku bunga tunggal ${rate}% per tahun. Berapakah jumlah total tabungan beserta bunganya setelah ${months} bulan?`,
        `Rp${formatId(total)}`,
        makeNumericDistractors(total, [-120000, -60000, 60000, 120000], (n) => `Rp${formatId(n)}`),
        `Bunga = Modal × (${rate}/100) × (${months}/12) = Rp${formatId(principal)} × ${formatId((rate * months) / 12, 2)}% = Rp${formatId(interest)}. Total tabungan = Rp${formatId(principal)} + Rp${formatId(interest)} = Rp${formatId(total)}.`,
        `Hitung bunga efektif periode = (${rate}% × ${months}) / 12 = ${formatId((rate * months) / 12, 2)}%. Kalikan langsung ke Rp${formatId(principal)} = Rp${formatId(interest)}, lalu jumlahkan!`
      )
    );
  });

  // D. Rata-rata Gabungan & Rasio (13 soal)
  // 7 soal Rata-rata Gabungan (metode jungkat-jungkit / alligation!)
  // n1 * (m - x1) = n2 * (x2 - m)
  const avgSpecs: Array<[number, number, number, number]> = [
    [20, 72, 82, 76], // (76-72)=4, (82-76)=6 -> n1:n2 = 6:4 = 3:2 -> n1=20 -> non-int; use exact ratio!
  ];
  void avgSpecs;
  const exactAvg: Array<[number, number, number, number]> = [
    [24, 72, 82, 76], // diff1=4, diff2=6 -> n2 = 24 * 4/6 = 16
    [18, 70, 85, 75], // diff1=5, diff2=10 -> n2 = 18 * 5/10 = 9
    [30, 74, 86, 78], // diff1=4, diff2=8 -> n2 = 30 * 4/8 = 15
    [20, 68, 83, 74], // diff1=6, diff2=9 -> n2 = 20 * 6/9 non-int -> fix: [21, 68, 83, 74] -> 21*6/9=14!
    [25, 76, 86, 80], // diff1=4, diff2=6 -> non-int -> fix: [24, 75, 87, 79] -> diff1=4, diff2=8 -> n2=12!
    [16, 71, 83, 74], // diff1=3, diff2=9 -> non-int -> fix: [27, 71, 83, 74] -> diff1=3, diff2=9 -> n2=9!
    [20, 78, 90, 82], // diff1=4, diff2=8 -> n2 = 10
  ];
  exactAvg[3] = [21, 68, 83, 74];
  exactAvg[4] = [24, 75, 87, 79];
  exactAvg[5] = [27, 71, 83, 74];

  exactAvg.forEach(([n1, x1, x2, mean], idx) => {
    const n2 = (n1 * (mean - x1)) / (x2 - mean);
    list.push(
      buildQuestion(
        idx,
        'Numerik - Soal Cerita Aritmetika',
        `Nilai rata-rata tryout CAT dari ${n1} peserta kelas A adalah ${x1}, sedangkan nilai rata-rata kelas B adalah ${x2}. Jika kedua kelas digabungkan, nilai rata-rata keseluruhannya menjadi ${mean}. Berapa banyak peserta di kelas B?`,
        `${n2} orang`,
        makeNumericDistractors(n2, [-4, -2, 2, 4], (n) => `${Math.max(1, n)} orang`),
        `Gunakan rumus rata-rata gabungan: (${n1}×${x1} + n₂×${x2}) / (${n1} + n₂) = ${mean}. Maka ${n1 * x1} + ${x2}n₂ = ${n1 * mean} + ${mean}n₂ → ${x2 - mean}n₂ = ${n1 * (mean - x1)} → n₂ = ${n2} orang.`,
        `Trik Jungkat-Jungkit (Alligation): bandingkan selisih terhadap rata-rata gabungan (${mean}): |${x1}−${mean}| = ${mean - x1} dan |${x2}−${mean}| = ${x2 - mean}. Rasio n₁ : n₂ berbalik = ${x2 - mean} : ${mean - x1} → n₂ = (${mean - x1}/${x2 - mean}) × ${n1} = ${n2} orang!`
      )
    );
  });

  // 6 soal Perbandingan Rasio & Umur
  const ratioSpecs: Array<[number, number, number, number]> = [
    [3, 5, 6, 48],  // 3k+6 + 5k+6 = 48 -> 8k=36? Make exact: sumNow = (a+b)*k!
  ];
  void ratioSpecs;
  const exactAge: Array<[number, number, number, number]> = [
    [3, 5, 4, 5],  // k=5 -> now 15 & 25, 4 tahun lagi jumlah = 48, selisih = 10
    [2, 5, 6, 4],  // k=4 -> now 8 & 20, 6 tahun lagi jumlah = 40, selisih = 12
    [3, 7, 5, 4],  // k=4 -> now 12 & 28, 5 tahun lagi jumlah = 50, selisih = 16
    [4, 7, 3, 5],  // k=5 -> now 20 & 35, 3 tahun lagi jumlah = 61, selisih = 15
    [2, 7, 4, 6],  // k=6 -> now 12 & 42, 4 tahun lagi jumlah = 62, selisih = 30
    [5, 8, 6, 3],  // k=3 -> now 15 & 24, 6 tahun lagi jumlah = 51, selisih = 9
  ];
  exactAge.forEach(([r1, r2, yrs, k], idx) => {
    const sumFuture = (r1 + r2) * k + 2 * yrs;
    const diff = (r2 - r1) * k;
    list.push(
      buildQuestion(
        idx + 1,
        'Numerik - Soal Cerita Aritmetika',
        `Perbandingan usia Rina dan Sinta saat ini adalah ${r1} : ${r2}. Jika ${yrs} tahun yang akan datang jumlah usia mereka berdua adalah ${sumFuture} tahun, berapakah selisih usia mereka saat ini?`,
        `${diff} tahun`,
        makeNumericDistractors(diff, [-4, -2, 2, 4], (n) => `${Math.max(1, n)} tahun`),
        `Misal usia saat ini ${r1}k dan ${r2}k. ${yrs} tahun lagi: (${r1}k + ${yrs}) + (${r2}k + ${yrs}) = ${sumFuture} → ${r1 + r2}k = ${sumFuture - 2 * yrs} → k = ${k}. Selisih usia = (${r2} − ${r1}) × ${k} = ${diff} tahun.`,
        `Jumlah usia saat ini = ${sumFuture} − (2 × ${yrs}) = ${sumFuture - 2 * yrs}. Selisih = [(${r2}−${r1}) / (${r1}+${r2})] × ${sumFuture - 2 * yrs} = ${diff} tahun!`
      )
    );
  });

  return list;
}

export const TIU_NUMERIK_QUESTIONS: SeedQuestion[] = [
  ...buildFastCalcQuestions(),
  ...buildSeriesQuestions(),
  ...buildQuantComparisonQuestions(),
  ...buildWordProblemQuestions(),
];
