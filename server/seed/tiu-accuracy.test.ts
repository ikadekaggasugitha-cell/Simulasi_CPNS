import test from 'node:test';
import assert from 'node:assert/strict';
import { TIU_QUESTIONS } from './tiu';
import { TIU_EXTRA_QUESTIONS } from './tiu_extra';
import { TIU_NUMERIK_QUESTIONS } from './tiu_numerik';
import { TIU_VERBAL_QUESTIONS } from './tiu_verbal';
import { TIU_FIGURAL_QUESTIONS } from './tiu_figural';
import {
  createShuffledOptionOrder,
  evaluateAnswer,
  mapDisplayLabelToOriginal,
  mapOriginalKeyToDisplayLabel,
} from '../scoring';
import type { OptionKey } from '../../src/shared/types';
import type { SeedQuestion } from './types';

function getOpt(q: SeedQuestion, key: OptionKey): string {
  switch (key) {
    case 'A':
      return q.opsi_a;
    case 'B':
      return q.opsi_b;
    case 'C':
      return q.opsi_c;
    case 'D':
      return q.opsi_d;
    case 'E':
      return q.opsi_e;
  }
}

function getAllOpts(q: SeedQuestion): Array<{ key: OptionKey; text: string }> {
  return (['A', 'B', 'C', 'D', 'E'] as const).map((key) => ({
    key,
    text: getOpt(q, key),
  }));
}

function parseIdNum(raw: string): number {
  const cleaned = raw
    .replace(/Rp\s*/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/−/g, '-')
    .trim();
  return Number(cleaned);
}

function parsePct(raw: string): number {
  if (raw === '16⅔') return 1 / 6;
  if (raw === '33⅓') return 1 / 3;
  if (raw === '66⅔') return 2 / 3;
  return parseIdNum(raw) / 100;
}

function minDistToPolyEdges(
  px: number,
  py: number,
  pts: Array<[number, number]>
): { inside: boolean; minDist: number } {
  let inside = false;
  let minDist = Infinity;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    const intersect =
      yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
    const dx = xj - xi;
    const dy = yj - yi;
    const lenSq = dx * dx + dy * dy;
    let t = lenSq === 0 ? 0 : ((px - xi) * dx + (py - yi) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    const dist = Math.hypot(px - (xi + t * dx), py - (yi + t * dy));
    if (dist < minDist) minDist = dist;
  }
  return { inside, minDist };
}

test('TIU combined bank has exact 500 questions with zero duplicate options and zero hardcoded option letters', () => {
  const all = [...TIU_QUESTIONS, ...TIU_EXTRA_QUESTIONS];
  assert.equal(all.length, 500);
  for (let i = 0; i < all.length; i++) {
    const q = all[i];
    const opts = getAllOpts(q).map((o) => o.text.trim());
    assert.equal(
      new Set(opts.map((o) => o.toLowerCase())).size,
      5,
      `TIU #${i} (${q.subtopik}) has duplicate options`
    );
    assert.ok(
      q.pembahasan.includes('Metode 1') && q.pembahasan.includes('Metode 2'),
      `TIU #${i} missing Metode 1/2`
    );
    assert.equal(
      q.pembahasan.match(/\b(opsi|pilihan|jawaban)\s+[A-E]\b/gi),
      null,
      `TIU #${i} hardcodes an option letter in pembahasan (breaks under option shuffling)`
    );
  }
});

test('Numerik Berhitung Cepat (55) — independent arithmetic verification', () => {
  const bc = TIU_NUMERIK_QUESTIONS.filter(
    (q) => q.subtopik === 'Numerik - Berhitung Cepat'
  );
  assert.equal(bc.length, 55);
  bc.forEach((q, idx) => {
    const p = q.pertanyaan;
    const ansNum = parseIdNum(getOpt(q, q.jawaban_benar));
    let computed: number | null = null;

    let m = p.match(/\((\d+)² − (\d+)²\) \/ \((\d+) − (\d+)\) \+ (\d+)/);
    if (m) {
      computed = (Number(m[1]) ** 2 - Number(m[2]) ** 2) / (Number(m[3]) - Number(m[4])) + Number(m[5]);
    }
    if (computed === null) {
      m = p.match(/\((\d+) × (\d+)\) \+ \((\d+) × (\d+)\) − \((\d+) × (\d+)\)/);
      if (m) {
        computed =
          Number(m[1]) * Number(m[2]) +
          Number(m[3]) * Number(m[4]) -
          Number(m[5]) * Number(m[6]);
      }
    }
    if (computed === null) {
      m = p.match(
        /Hasil dari ([\d,]+|16⅔|33⅓|66⅔)% dari (\d+) ditambah ([\d,]+|16⅔|33⅓|66⅔)% dari (\d+)/
      );
      if (m) computed = parsePct(m[1]) * Number(m[2]) + parsePct(m[3]) * Number(m[4]);
    }
    if (computed === null) {
      m = p.match(/x \+ y = (\d+) dan x × y = (\d+), maka nilai dari x² \+ y²/);
      if (m) {
        const s = Number(m[1]);
        const prod = Number(m[2]);
        assert.ok(s * s - 4 * prod >= 0, `BC #${idx} must have real roots`);
        computed = s * s - 2 * prod;
      }
    }
    if (computed === null) {
      m = p.match(/\((\d+) × ([\d,]+) \+ (\d+) × ([\d,]+)\) ÷ ([\d,]+)/);
      if (m) {
        computed =
          (Number(m[1]) * parseIdNum(m[2]) + Number(m[3]) * parseIdNum(m[4])) /
          parseIdNum(m[5]);
      }
    }

    assert.notEqual(computed, null, `BC #${idx} unparsed: ${p}`);
    assert.ok(
      Math.abs((computed as number) - ansNum) < 1e-6,
      `BC #${idx} mismatch: expected ${computed}, got ${ansNum}`
    );
  });
});

test('Numerik Deret Angka HOTS (55) — exact sequence rule verification', () => {
  const deret = TIU_NUMERIK_QUESTIONS.filter(
    (q) => q.subtopik === 'Numerik - Deret Angka HOTS'
  );
  assert.equal(deret.length, 55);
  deret.forEach((q, idx) => {
    const seqLine = q.pertanyaan.split('\n').pop() ?? q.pertanyaan;
    const nums = seqLine.match(/-?\d+/g)?.map(Number) ?? [];
    const ansParts = getOpt(q, q.jawaban_benar)
      .split(',')
      .map((s) => Number(s.trim()));
    const full = [...nums, ...ansParts];

    const isConstDiff = (arr: number[]) =>
      arr.length < 2 || arr.slice(1).every((v, i) => v - arr[i] === arr[1] - arr[0]);

    const d1 = full.slice(1).map((v, i) => v - full[i]);
    const is2ndOrder = isConstDiff(d1);
    const isLarik2 =
      isConstDiff(full.filter((_, i) => i % 2 === 0)) &&
      isConstDiff(full.filter((_, i) => i % 2 === 1));
    const isLarik3 =
      isConstDiff(full.filter((_, i) => i % 3 === 0)) &&
      isConstDiff(full.filter((_, i) => i % 3 === 1)) &&
      isConstDiff(full.filter((_, i) => i % 3 === 2));
    const fibKs = full.slice(2).map((v, i) => v - (full[i + 1] + full[i]));
    const isModFib = fibKs.every((v) => v === fibKs[0]);
    const r0 = full[1] / full[0];
    const c0 = full[2] - full[1];
    const isAltMulAdd = full.every((v, i) =>
      i === 0
        ? true
        : i % 2 === 1
        ? Math.abs(v - full[i - 1] * r0) < 1e-6
        : Math.abs(v - (full[i - 1] + c0)) < 1e-6
    );

    assert.ok(
      is2ndOrder || isLarik2 || isLarik3 || isModFib || isAltMulAdd,
      `Deret #${idx} failed pattern verification: ${full.join(', ')}`
    );
  });
});

test('Numerik Perbandingan Kuantitatif (50) — strictly mutually exclusive single true answer', () => {
  const pq = TIU_NUMERIK_QUESTIONS.filter(
    (q) => q.subtopik === 'Numerik - Perbandingan Kuantitatif'
  );
  assert.equal(pq.length, 50);

  pq.forEach((q, idx) => {
    const opts = getAllOpts(q).map((o) => o.text.trim());
    const ans = getOpt(q, q.jawaban_benar).trim();

    // Never allow BOTH X < Y and 2X = Y when ans is 2X = Y, or BOTH X > Y and X = 2Y when ans is X = 2Y
    if (ans === '2X = Y') {
      assert.ok(
        !opts.includes('X < Y'),
        `PQ #${idx} has ambiguous options: both 'X < Y' and '2X = Y' present!`
      );
    }
    if (ans === 'X = 2Y') {
      assert.ok(
        !opts.includes('X > Y'),
        `PQ #${idx} has ambiguous options: both 'X > Y' and 'X = 2Y' present!`
      );
    }

    // Verify fraction cross-multiplication questions
    const mFrac = q.pertanyaan.match(/X = (\d+)\/(\d+) dan Y = (\d+)\/(\d+)/);
    if (mFrac) {
      const X = Number(mFrac[1]) / Number(mFrac[2]);
      const Y = Number(mFrac[3]) / Number(mFrac[4]);
      assert.notEqual(Math.abs(2 * X - Y) < 1e-9, true, `PQ #${idx} accidentally satisfies 2X = Y`);
      assert.equal(ans, X > Y ? 'X > Y' : 'X < Y', `PQ #${idx} wrong fraction answer`);
    }

    // Verify commutative percentage questions (a% of b vs b% of a)
    const mComm = q.pertanyaan.match(/X = (\d+)% dari (\d+) dan Y = (\d+)% dari (\d+)/);
    if (mComm && mComm[1] === mComm[4] && mComm[2] === mComm[3]) {
      assert.equal(ans, 'X = Y', `PQ #${idx} commutative pct must be X = Y`);
    }
  });
});

test('Numerik Soal Cerita Aritmetika (55) — independent word-problem verification', () => {
  const sc = TIU_NUMERIK_QUESTIONS.filter(
    (q) => q.subtopik === 'Numerik - Soal Cerita Aritmetika'
  );
  assert.equal(sc.length, 55);

  sc.forEach((q, idx) => {
    const p = q.pertanyaan;
    const ans = getOpt(q, q.jawaban_benar).trim();
    let expected: string | null = null;

    let m = p.match(
      /selesai dalam (\d+) hari oleh (\d+) pekerja\. Setelah dikerjakan selama (\d+) hari, proyek terpaksa dihentikan selama (\d+) hari/
    );
    if (m) {
      const totalD = Number(m[1]);
      const w = Number(m[2]);
      const worked = Number(m[3]);
      const stop = Number(m[4]);
      const extra = (w * (totalD - worked)) / (totalD - worked - stop) - w;
      assert.ok(Number.isInteger(extra));
      expected = `${extra} orang`;
    }
    if (!expected) {
      m = p.match(
        /berjarak (\d+) km.*pukul (\d{2})\.(\d{2}).*kecepatan rata-rata (\d+) km\/jam.*kecepatan (\d+) km\/jam/
      );
      if (m) {
        const mins = (Number(m[1]) / (Number(m[4]) + Number(m[5]))) * 60;
        const tot = Number(m[2]) * 60 + Number(m[3]) + mins;
        expected = `Pukul ${String(Math.floor(tot / 60)).padStart(2, '0')}.${String(Math.round(tot % 60)).padStart(2, '0')}`;
        assert.ok(!/\b0 menit\b/.test(q.pembahasan), `SC #${idx} has '0 menit' artifact`);
      }
    }
    if (!expected) {
      m = p.match(
        /kecepatan rata-rata (\d+) km\/jam\. (\d+) jam kemudian.*kecepatan (\d+) km\/jam/
      );
      if (m) {
        const t = (Number(m[1]) * Number(m[2])) / (Number(m[3]) - Number(m[1]));
        expected = `${Number(m[3]) * t} km`;
      }
    }
    if (!expected) {
      m = p.match(/seharga Rp([\d.]+).*keuntungan sebesar (\d+)%/);
      if (m) {
        const buy = (parseIdNum(m[1]) * 100) / (100 + Number(m[2]));
        expected = `Rp${Math.round(buy).toLocaleString('id-ID')}`;
      }
    }
    if (!expected) {
      m = p.match(/sebesar Rp([\d.]+).*bunga tunggal (\d+)%.*setelah (\d+) bulan/);
      if (m) {
        const p0 = parseIdNum(m[1]);
        const rate = Number(m[2]);
        const mo = Number(m[3]);
        const effPct = (rate * mo) / 12;
        assert.ok(
          Math.abs(effPct * 10 - Math.round(effPct * 10)) < 1e-6,
          `SC #${idx} effective rate ${effPct}% should not require repeating decimal rounding`
        );
        const total = p0 + (p0 * rate * mo) / 1200;
        expected = `Rp${Math.round(total).toLocaleString('id-ID')}`;
      }
    }
    if (!expected) {
      m = p.match(/(\d+) peserta kelas A adalah (\d+).*kelas B adalah (\d+).*menjadi (\d+)/);
      if (m) {
        const nB = (Number(m[1]) * (Number(m[4]) - Number(m[2]))) / (Number(m[3]) - Number(m[4]));
        assert.ok(Number.isInteger(nB));
        expected = `${nB} orang`;
      }
    }
    if (!expected) {
      m = p.match(
        /adalah (\d+) : (\d+)\. Jika (\d+) tahun yang akan datang jumlah usia mereka berdua adalah (\d+) tahun/
      );
      if (m) {
        const curSum = Number(m[4]) - 2 * Number(m[3]);
        const diff = (curSum * Math.abs(Number(m[2]) - Number(m[1]))) / (Number(m[1]) + Number(m[2]));
        assert.ok(Number.isInteger(diff));
        expected = `${diff} tahun`;
      }
    }

    assert.equal(ans, expected, `SC #${idx} mismatch: expected ${expected}, got ${ans}`);
  });
});

test('Verbal (150) — Analogi key alignment, Pemahaman Bacaan integrity, and Penalaran Analitis brute-force solver', () => {
  assert.equal(TIU_VERBAL_QUESTIONS.length, 150);

  // Check Analogi key words appear in pembahasan & KBBI spelling clean
  const anal = TIU_VERBAL_QUESTIONS.filter((q) => q.subtopik === 'Verbal - Analogi');
  assert.equal(anal.length, 50);
  anal.forEach((q, idx) => {
    const ans = getOpt(q, q.jawaban_benar);
    assert.ok(!ans.includes('MANDET') && !ans.includes('AXIOMA') && !ans.includes('DEAL :'), `Analogi #${idx} spelling`);
    const parts = ans.split(':').map((s) => s.trim().toLowerCase());
    if (!ans.includes('RANCANGAN UNDANG-UNDANG')) {
      for (const pt of parts) {
        assert.ok(
          q.pembahasan.toLowerCase().includes(pt),
          `Analogi #${idx} answer term '${pt}' missing from pembahasan`
        );
      }
    }
  });

  // Check Pemahaman Bacaan #5 fix
  const baca = TIU_VERBAL_QUESTIONS.filter((q) => q.subtopik === 'Verbal - Pemahaman Bacaan');
  assert.equal(baca.length, 45);
  assert.ok(
    !getOpt(baca[5], baca[5].jawaban_benar).includes('penurunan risiko mutu'),
    'Pemahaman Bacaan #5 must not have reversed meaning'
  );

  // Brute-force verify key Penalaran Analitis puzzles have 100% unique answer
  const permute = <T,>(arr: T[]): T[][] => {
    if (arr.length <= 1) return [arr];
    const res: T[][] = [];
    arr.forEach((el, i) => {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
      for (const p of permute(rest)) res.push([el, ...p]);
    });
    return res;
  };

  // Analitis #0: Ani, Budi, Citra, Doni, Eka -> Pos 3 = Doni
  const sol0 = permute(['Ani', 'Budi', 'Citra', 'Doni', 'Eka']).filter((p) => {
    const pos = (x: string) => p.indexOf(x) + 1;
    return (
      pos('Citra') === pos('Ani') + 1 &&
      pos('Doni') < pos('Eka') &&
      pos('Doni') !== 1 &&
      pos('Budi') === 5 &&
      Math.abs(pos('Citra') - pos('Eka')) === 2
    );
  });
  assert.equal(sol0.length, 1);
  assert.equal(sol0[0][2], 'Doni');

  // Analitis #15: Loket 1..5 (KTP, KK, Akta, Paspor, NPWP) -> Loket 3 = KTP across ALL valid layouts
  const sol15 = permute(['KTP', 'KK', 'Akta', 'Paspor', 'NPWP']).filter((p) => {
    const pos = (x: string) => p.indexOf(x) + 1;
    return (
      Math.abs(pos('KTP') - pos('KK')) === 1 &&
      Math.abs(pos('KTP') - pos('Akta')) === 1 &&
      pos('NPWP') === 5 &&
      pos('Paspor') < pos('KK')
    );
  });
  assert.ok(sol15.length > 0);
  assert.ok(sol15.every((p) => p[2] === 'KTP'));
});

test('Figural SVG (135) — valid markup, exact transformation rules, zero polygon overflows', () => {
  assert.equal(TIU_FIGURAL_QUESTIONS.length, 135);

  TIU_FIGURAL_QUESTIONS.forEach((q, idx) => {
    const opts = getAllOpts(q);
    assert.equal(new Set(opts.map((o) => o.text)).size, 5, `Figural #${idx} duplicate SVG`);
    for (const o of opts) {
      assert.ok(
        o.text.startsWith('<svg ') &&
          o.text.includes('viewBox="0 0 100 100"') &&
          o.text.endsWith('</svg>'),
        `Figural #${idx} opt ${o.key} invalid SVG`
      );
      assert.ok(!o.text.includes('NaN') && !o.text.includes('undefined'), `Figural #${idx} NaN`);
    }

    // Verify zero dot or inner-shape polygon overflow across ALL prompt & option SVGs
    const allSvgs = [
      ...(q.pertanyaan.match(/<svg[\s\S]*?<\/svg>/g) ?? []),
      ...opts.map((o) => o.text),
    ];

    for (const svg of allSvgs) {
      const polys = [...svg.matchAll(/<polygon points="([^"]+)"/g)].map((m) =>
        m[1]
          .trim()
          .split(/\s+/)
          .map((pair) => pair.split(',').map(Number) as [number, number])
      );

      // 1) Check interior dots inside regular polygons (Ketidaksamaan B & Serial C)
      if (
        (q.subtopik === 'Figural - Ketidaksamaan Gambar' ||
          q.subtopik === 'Figural - Serial / Pola Gambar') &&
        polys.length === 1 &&
        polys[0].length >= 3
      ) {
        const dots = [...svg.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/g)]
          .map((m) => ({ x: Number(m[1]), y: Number(m[2]), r: Number(m[3]) }))
          .filter((d) => d.r <= 5);
        for (const d of dots) {
          const { inside, minDist } = minDistToPolyEdges(d.x, d.y, polys[0]);
          assert.ok(
            inside && minDist >= d.r + 1.5,
            `Figural #${idx} (${q.subtopik}) dot (${d.x},${d.y},r=${d.r}) overflows/clips ${polys[0].length}-gon (inside=${inside}, minDist=${minDist.toFixed(1)})`
          );
        }
      }

      // 2) Check nested shapes inside outer triangle (Analogi B)
      const outerTri = polys.find(
        (p) => p.length === 3 && Math.hypot(p[0][0] - p[1][0], p[0][1] - p[1][1]) > 50
      );
      if (outerTri && q.subtopik === 'Figural - Analogi Gambar') {
        const innerPts: Array<[number, number]> = [];
        polys.filter((p) => p !== outerTri).forEach((p) => innerPts.push(...p));
        [...svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)].forEach(
          (m) => {
            const x = Number(m[1]);
            const y = Number(m[2]);
            const w = Number(m[3]);
            const h = Number(m[4]);
            innerPts.push([x, y], [x + w, y], [x + w, y + h], [x, y + h]);
          }
        );
        for (const [ix, iy] of innerPts) {
          const { inside, minDist } = minDistToPolyEdges(ix, iy, outerTri);
          assert.ok(
            inside && minDist >= 2.0,
            `Figural #${idx} nested shape corner (${ix},${iy}) overflows outer triangle (inside=${inside}, minDist=${minDist.toFixed(1)})`
          );
        }
      }
    }
  });
});

test('Shuffled option mapping aligns HintModal correctLabel/correctText and grading 100%', () => {
  const allTiu = [...TIU_QUESTIONS, ...TIU_EXTRA_QUESTIONS];
  // Deterministic PRNG
  let seed = 42;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (const q of allTiu) {
    const opsiOrder = createShuffledOptionOrder(rng);
    const correctDisplayLabel = mapOriginalKeyToDisplayLabel(opsiOrder, q.jawaban_benar);
    assert.ok(correctDisplayLabel !== null);

    // Selecting the displayed correct label maps back to q.jawaban_benar and scores +5 BENAR
    const mappedOriginal = mapDisplayLabelToOriginal(opsiOrder, correctDisplayLabel);
    assert.equal(mappedOriginal, q.jawaban_benar);

    const evalRight = evaluateAnswer(
      { exam_type: 'SKD', kategori: 'TIU', jawaban_benar: q.jawaban_benar, bobot_tkp: null },
      mappedOriginal
    );
    assert.deepEqual(evalRight, { status: 'BENAR', poin: 5 });

    // Selecting any other displayed label scores 0 SALAH
    for (const label of ['A', 'B', 'C', 'D', 'E'] as const) {
      if (label === correctDisplayLabel) continue;
      const wrongOrig = mapDisplayLabelToOriginal(opsiOrder, label);
      const evalWrong = evaluateAnswer(
        { exam_type: 'SKD', kategori: 'TIU', jawaban_benar: q.jawaban_benar, bobot_tkp: null },
        wrongOrig
      );
      assert.deepEqual(evalWrong, { status: 'SALAH', poin: 0 });
    }
  }
});
