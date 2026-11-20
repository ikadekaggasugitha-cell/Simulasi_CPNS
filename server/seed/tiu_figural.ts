import type { OptionKey } from '../../src/shared/types';
import type { SeedQuestion } from './types';

type KeyIdx = 0 | 1 | 2 | 3 | 4;
const KEYS: readonly OptionKey[] = ['A', 'B', 'C', 'D', 'E'];

const STROKE = '#0f172a';
const FILL_DARK = '#1e3a8a';
const FILL_ACCENT = '#0f766e';
const FILL_LIGHT = '#ffffff';
const FILL_MUTED = '#cbd5e1';

function svgWrap(inner: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${inner}</svg>`;
}

function regularPolygonPoints(
  sides: number,
  cx = 50,
  cy = 50,
  r = 34,
  startDeg = -90
): string {
  const pts: string[] = [];
  for (let i = 0; i < sides; i++) {
    const rad = ((startDeg + (360 * i) / sides) * Math.PI) / 180;
    const x = Math.round((cx + r * Math.cos(rad)) * 10) / 10;
    const y = Math.round((cy + r * Math.sin(rad)) * 10) / 10;
    pts.push(`${x},${y}`);
  }
  return pts.join(' ');
}

type ShapeKind = 'circle' | 'square' | 'triangle' | 'diamond' | 'pentagon' | 'hexagon';

function drawShape(
  kind: ShapeKind,
  cx: number,
  cy: number,
  size: number,
  fill: string,
  stroke = STROKE,
  strokeWidth = 3
): string {
  switch (kind) {
    case 'circle':
      return `<circle cx="${cx}" cy="${cy}" r="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    case 'square': {
      const s = size * 1.65;
      return `<rect x="${Math.round(cx - s / 2)}" y="${Math.round(cy - s / 2)}" width="${Math.round(s)}" height="${Math.round(s)}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    }
    case 'triangle':
      return `<polygon points="${regularPolygonPoints(3, cx, cy + 3, size * 1.15, -90)}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    case 'diamond':
      return `<polygon points="${regularPolygonPoints(4, cx, cy, size * 1.15, -90)}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    case 'pentagon':
      return `<polygon points="${regularPolygonPoints(5, cx, cy + 2, size * 1.1, -90)}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
    case 'hexagon':
      return `<polygon points="${regularPolygonPoints(6, cx, cy, size * 1.1, -90)}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
  }
}

const SHAPE_NAME: Record<ShapeKind, string> = {
  circle: 'lingkaran',
  square: 'persegi',
  triangle: 'segitiga',
  diamond: 'belah ketupat',
  pentagon: 'segilima',
  hexagon: 'segienam',
};

const CORNERS: Array<[number, number, string]> = [
  [22, 22, 'kiri atas'],
  [78, 22, 'kanan atas'],
  [78, 78, 'kanan bawah'],
  [22, 78, 'kiri bawah'],
];

function degToClockLabel(deg: number): string {
  const norm = ((deg % 360) + 360) % 360;
  const map: Record<number, string> = {
    0: '0° (arah atas / jam 12)',
    45: '45° (kanan atas)',
    90: '90° (kanan / jam 3)',
    135: '135° (kanan bawah)',
    180: '180° (bawah / jam 6)',
    225: '225° (kiri bawah)',
    270: '270° (kiri / jam 9)',
    315: '315° (kiri atas)',
  };
  return map[norm] ?? `${norm}°`;
}

function buildFigural(
  seedIdx: number,
  subtopik: string,
  pertanyaan: string,
  correctSvg: string,
  distractorSvgs: [string, string, string, string],
  metode1: string,
  metode2: string
): SeedQuestion {
  const targetIdx = (seedIdx % 5) as KeyIdx;
  const opts: string[] = [];
  let d = 0;
  for (let i = 0; i < 5; i++) {
    if (i === targetIdx) {
      opts.push(correctSvg);
    } else {
      opts.push(distractorSvgs[d++]);
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

// ============================================================================
// 1. FIGURAL - ANALOGI GAMBAR (45 SOAL HOTS)
// ============================================================================
function buildFiguralAnalogyQuestions(): SeedQuestion[] {
  const list: SeedQuestion[] = [];

  // A. Rotasi (90° CW / 90° CCW / 180°) + Inversi Arsiran Panah/Figur Asimetris (15 soal)
  const drawPointer = (deg: number, filled: boolean, tipShape: 'dot' | 'sq' | 'tri', baseShape: 'circle' | 'square' | 'diamond') => {
    const fill = filled ? FILL_DARK : FILL_LIGHT;
    const tip =
      tipShape === 'dot'
        ? `<circle cx="50" cy="18" r="9" fill="${fill}" stroke="${STROKE}" stroke-width="3"/>`
        : tipShape === 'sq'
        ? `<rect x="42" y="10" width="16" height="16" fill="${fill}" stroke="${STROKE}" stroke-width="3"/>`
        : `<polygon points="50,8 60,25 40,25" fill="${fill}" stroke="${STROKE}" stroke-width="3"/>`;
    const flag = `<path d="M50 42 L74 42 L68 54 L50 54 Z" fill="${filled ? FILL_LIGHT : FILL_DARK}" stroke="${STROKE}" stroke-width="2.5"/>`;
    const base = drawShape(baseShape, 50, 74, 10, filled ? FILL_DARK : FILL_MUTED, STROKE, 2.5);
    return svgWrap(
      `<g transform="rotate(${deg} 50 50)"><line x1="50" y1="26" x2="50" y2="74" stroke="${STROKE}" stroke-width="3.5"/>${tip}${flag}${base}</g>`
    );
  };

  const rotConfigs: Array<{
    deltaDeg: number;
    label: string;
    aDeg: number;
    cDeg: number;
    aFilled: boolean;
    cFilled: boolean;
    tip1: 'dot' | 'sq' | 'tri';
    tip2: 'dot' | 'sq' | 'tri';
    base1: 'circle' | 'square' | 'diamond';
    base2: 'circle' | 'square' | 'diamond';
  }> = [
    { deltaDeg: 90, label: '90° searah jarum jam', aDeg: 0, cDeg: 90, aFilled: true, cFilled: false, tip1: 'dot', tip2: 'sq', base1: 'circle', base2: 'square' },
    { deltaDeg: 90, label: '90° searah jarum jam', aDeg: 180, cDeg: 270, aFilled: false, cFilled: true, tip1: 'tri', tip2: 'dot', base1: 'square', base2: 'diamond' },
    { deltaDeg: 90, label: '90° searah jarum jam', aDeg: 270, cDeg: 0, aFilled: true, cFilled: true, tip1: 'sq', tip2: 'tri', base1: 'diamond', base2: 'circle' },
    { deltaDeg: 90, label: '90° searah jarum jam', aDeg: 45, cDeg: 135, aFilled: false, cFilled: false, tip1: 'dot', tip2: 'tri', base1: 'circle', base2: 'diamond' },
    { deltaDeg: 90, label: '90° searah jarum jam', aDeg: 135, cDeg: 225, aFilled: true, cFilled: false, tip1: 'sq', tip2: 'dot', base1: 'square', base2: 'circle' },
    { deltaDeg: 270, label: '90° berlawanan jarum jam', aDeg: 0, cDeg: 180, aFilled: true, cFilled: false, tip1: 'tri', tip2: 'sq', base1: 'circle', base2: 'square' },
    { deltaDeg: 270, label: '90° berlawanan jarum jam', aDeg: 90, cDeg: 270, aFilled: false, cFilled: true, tip1: 'dot', tip2: 'tri', base1: 'diamond', base2: 'circle' },
    { deltaDeg: 270, label: '90° berlawanan jarum jam', aDeg: 180, cDeg: 0, aFilled: true, cFilled: true, tip1: 'sq', tip2: 'dot', base1: 'square', base2: 'diamond' },
    { deltaDeg: 270, label: '90° berlawanan jarum jam', aDeg: 45, cDeg: 315, aFilled: false, cFilled: false, tip1: 'tri', tip2: 'dot', base1: 'diamond', base2: 'square' },
    { deltaDeg: 270, label: '90° berlawanan jarum jam', aDeg: 225, cDeg: 135, aFilled: true, cFilled: false, tip1: 'dot', tip2: 'sq', base1: 'circle', base2: 'diamond' },
    { deltaDeg: 180, label: '180°', aDeg: 0, cDeg: 90, aFilled: true, cFilled: false, tip1: 'sq', tip2: 'tri', base1: 'circle', base2: 'square' },
    { deltaDeg: 180, label: '180°', aDeg: 45, cDeg: 135, aFilled: false, cFilled: true, tip1: 'tri', tip2: 'dot', base1: 'square', base2: 'diamond' },
    { deltaDeg: 180, label: '180°', aDeg: 90, cDeg: 270, aFilled: true, cFilled: true, tip1: 'dot', tip2: 'sq', base1: 'diamond', base2: 'circle' },
    { deltaDeg: 180, label: '180°', aDeg: 135, cDeg: 315, aFilled: false, cFilled: false, tip1: 'sq', tip2: 'dot', base1: 'circle', base2: 'diamond' },
    { deltaDeg: 180, label: '180°', aDeg: 270, cDeg: 45, aFilled: true, cFilled: false, tip1: 'tri', tip2: 'sq', base1: 'diamond', base2: 'square' },
  ];

  rotConfigs.forEach((cfg, idx) => {
    const gA = drawPointer(cfg.aDeg, cfg.aFilled, cfg.tip1, cfg.base1);
    const gB = drawPointer((cfg.aDeg + cfg.deltaDeg) % 360, !cfg.aFilled, cfg.tip1, cfg.base1);
    const gC = drawPointer(cfg.cDeg, cfg.cFilled, cfg.tip2, cfg.base2);
    const ansDeg = (cfg.cDeg + cfg.deltaDeg) % 360;
    const ansFilled = !cfg.cFilled;
    const correct = drawPointer(ansDeg, ansFilled, cfg.tip2, cfg.base2);
    const distractors: [string, string, string, string] = [
      drawPointer(ansDeg, !ansFilled, cfg.tip2, cfg.base2),
      drawPointer((ansDeg + 90) % 360, ansFilled, cfg.tip2, cfg.base2),
      drawPointer((ansDeg + 180) % 360, ansFilled, cfg.tip2, cfg.base2),
      drawPointer((ansDeg + 270) % 360, !ansFilled, cfg.tip2, cfg.base2),
    ];
    list.push(
      buildFigural(
        idx,
        'Figural - Analogi Gambar',
        `Perhatikan hubungan transformasi gambar pertama ke gambar kedua, lalu tentukan gambar yang tepat untuk menggantikan tanda [ ? ]!\n${gA} : ${gB} :: ${gC} : [ ? ]`,
        correct,
        distractors,
        `Dari Gambar 1 ke Gambar 2 terjadi dua transformasi serentak: (1) figur diputar ${cfg.label}, dan (2) warna/arsiran ujung serta bendera saling bertukar (inversi gelap ↔ terang). Terapkan aturan identik pada Gambar 3: arah ${degToClockLabel(cfg.cDeg)} → ${degToClockLabel(ansDeg)} dengan inversi arsiran.`,
        `Cek 2 filter cepat: pertama eliminasi semua opsi yang arsirannya tidak berbalik, lalu cek arah ujung figur setelah rotasi ${cfg.label}. Selesai di bawah 20 detik!`
      )
    );
  });

  // B. Pertukaran Bangun Luar ↔ Bangun Dalam + Inversi Warna (15 soal)
  const shapePairs: Array<[ShapeKind, ShapeKind, ShapeKind, ShapeKind, boolean]> = [
    ['square', 'circle', 'triangle', 'diamond', true],
    ['circle', 'triangle', 'square', 'pentagon', false],
    ['hexagon', 'square', 'diamond', 'circle', true],
    ['pentagon', 'circle', 'square', 'triangle', false],
    ['diamond', 'square', 'hexagon', 'triangle', true],
    ['square', 'hexagon', 'circle', 'diamond', false],
    ['triangle', 'circle', 'pentagon', 'square', true],
    ['circle', 'diamond', 'hexagon', 'pentagon', false],
    ['hexagon', 'triangle', 'square', 'diamond', true],
    ['pentagon', 'diamond', 'circle', 'hexagon', false],
    ['square', 'pentagon', 'diamond', 'triangle', true],
    ['diamond', 'circle', 'pentagon', 'hexagon', false],
    ['circle', 'square', 'triangle', 'hexagon', true],
    ['triangle', 'square', 'hexagon', 'circle', false],
    ['pentagon', 'square', 'circle', 'triangle', true],
  ];

  const drawNested = (outer: ShapeKind, inner: ShapeKind, innerDark: boolean, hasCenterDot: boolean) => {
    const outerSvg = drawShape(outer, 50, 50, 34, FILL_LIGHT, STROKE, 3);
    const isOuterTri = outer === 'triangle';
    const innerCy = isOuterTri ? 56 : 50;
    const innerSize = isOuterTri ? 11.5 : 15.5;
    const innerSvg = drawShape(inner, 50, innerCy, innerSize, innerDark ? FILL_DARK : FILL_MUTED, STROKE, 2.5);
    const dot = hasCenterDot
      ? `<circle cx="50" cy="${innerCy}" r="${isOuterTri ? 3.5 : 4.2}" fill="${innerDark ? FILL_LIGHT : FILL_DARK}"/>`
      : '';
    return svgWrap(`${outerSvg}${innerSvg}${dot}`);
  };

  shapePairs.forEach(([o1, i1, o2, i2, dotMode], idx) => {
    const gA = drawNested(o1, i1, true, dotMode);
    const gB = drawNested(i1, o1, false, !dotMode);
    const gC = drawNested(o2, i2, true, dotMode);
    const correct = drawNested(i2, o2, false, !dotMode);
    const distractors: [string, string, string, string] = [
      drawNested(i2, o2, true, !dotMode),
      drawNested(o2, i2, false, !dotMode),
      drawNested(i2, o2, false, dotMode),
      drawNested(o2, i2, true, !dotMode),
    ];
    list.push(
      buildFigural(
        idx + 1,
        'Figural - Analogi Gambar',
        `Tentukan gambar [ ? ] yang memiliki hubungan analogi setara dengan pasangan gambar pertama!\n${gA} : ${gB} :: ${gC} : [ ? ]`,
        correct,
        distractors,
        `Dari pasangan pertama (${SHAPE_NAME[o1]} luar + ${SHAPE_NAME[i1]} dalam): bangun luar dan bangun dalam bertukar posisi, arsiran bangun dalam berubah dari biru gelap menjadi abu terang, dan titik pusat ${dotMode ? 'dihilangkan' : 'ditambahkan'}. Pada Gambar 3, ${SHAPE_NAME[i2]} menjadi bangun luar dan ${SHAPE_NAME[o2]} menjadi bangun dalam berwarna terang ${dotMode ? 'tanpa titik pusat' : 'dengan titik pusat'}.`,
        `Cukup cek 2 ciri: bangun dalam (${SHAPE_NAME[i2]}) wajib menjadi bingkai LUAR, dan status titik pusat wajib berkebalikan. Langsung mengeliminasi 4 pengecoh sekaligus!`
      )
    );
  });

  // C. Penambahan Sisi Poligon (+1 sisi) + Pergeseran Sudut Titik Diagonal (15 soal)
  const polyStepSpecs: Array<[number, number, number, number]> = [
    [3, 4, 0, 1], [4, 5, 1, 2], [5, 6, 2, 3], [3, 5, 3, 0], [4, 6, 0, 2],
    [3, 4, 2, 3], [4, 5, 3, 0], [5, 6, 0, 1], [3, 5, 1, 2], [4, 6, 1, 3],
    [3, 4, 1, 0], [4, 5, 2, 1], [5, 6, 3, 2], [3, 5, 0, 3], [4, 6, 2, 0],
  ];

  const drawPolyCorner = (sides: number, cornerIdx: number, shaded: boolean) => {
    const poly = `<polygon points="${regularPolygonPoints(sides, 50, 50, 28, -90)}" fill="${shaded ? FILL_MUTED : FILL_LIGHT}" stroke="${STROKE}" stroke-width="3"/>`;
    const [cx, cy] = CORNERS[cornerIdx % 4];
    const dot = `<circle cx="${cx}" cy="${cy}" r="8" fill="${FILL_DARK}" stroke="${STROKE}" stroke-width="2"/>`;
    return svgWrap(`${poly}${dot}`);
  };

  polyStepSpecs.forEach(([s1, s2, c1, c2], idx) => {
    const gA = drawPolyCorner(s1, c1, false);
    const gB = drawPolyCorner(s1 + 1, (c1 + 2) % 4, true);
    const gC = drawPolyCorner(s2, c2, false);
    const ansCorner = (c2 + 2) % 4;
    const correct = drawPolyCorner(s2 + 1, ansCorner, true);
    const distractors: [string, string, string, string] = [
      drawPolyCorner(s2 + 1, c2, true),
      drawPolyCorner(s2 + 1, (c2 + 1) % 4, true),
      drawPolyCorner(s2, ansCorner, true),
      drawPolyCorner(s2 + 1, ansCorner, false),
    ];
    list.push(
      buildFigural(
        idx + 2,
        'Figural - Analogi Gambar',
        `Amati perubahan jumlah sisi poligon dan posisi lingkaran sudut, lalu lengkapi analogi berikut!\n${gA} : ${gB} :: ${gC} : [ ? ]`,
        correct,
        distractors,
        `Dari Gambar 1 ke Gambar 2: poligon bertambah +1 sisi (${s1} → ${s1 + 1}), bidang poligon terarsir abu-abu, dan lingkaran gelap berpindah ke sudut berseberangan diagonal (${CORNERS[c1][2]} → ${CORNERS[(c1 + 2) % 4][2]}). Terapkan pada Gambar 3: poligon ${s2} sisi menjadi ${s2 + 1} sisi terarsir dengan lingkaran di ${CORNERS[ansCorner][2]}.`,
        `Hitung cepat jumlah sisi (${s2} + 1 = ${s2 + 1}) dan lompatkan titik ke sudut diagonal lawan (${CORNERS[ansCorner][2]}). Tidak perlu analisis detail lain!`
      )
    );
  });

  return list;
}

// ============================================================================
// 2. FIGURAL - KETIDAKSAMAAN GAMBAR (45 SOAL HOTS)
// ============================================================================
function buildFiguralOddOneOutQuestions(): SeedQuestion[] {
  const list: SeedQuestion[] = [];

  // A. 4 Rotasi Figur Asimetris vs 1 Pencerminan (Mirror Trap — klasik BKN!) (15 soal)
  const drawAsym = (variant: number, deg: number, mirrored: boolean) => {
    const flip = mirrored ? 'translate(100 0) scale(-1 1)' : '';
    let body = '';
    if (variant % 3 === 0) {
      // L-stem with flag and offset dot
      body = `<path d="M35 20 L35 78 L72 78" fill="none" stroke="${STROKE}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="35" y="20" width="24" height="14" fill="${FILL_DARK}" stroke="${STROKE}" stroke-width="2.5"/><circle cx="64" cy="54" r="7" fill="${FILL_ACCENT}" stroke="${STROKE}" stroke-width="2"/>`;
    } else if (variant % 3 === 1) {
      // F-branch geometric figure
      body = `<line x1="34" y1="18" x2="34" y2="82" stroke="${STROKE}" stroke-width="5" stroke-linecap="round"/><line x1="34" y1="22" x2="72" y2="22" stroke="${STROKE}" stroke-width="5" stroke-linecap="round"/><line x1="34" y1="50" x2="60" y2="50" stroke="${STROKE}" stroke-width="5" stroke-linecap="round"/><polygon points="72,14 82,22 72,30" fill="${FILL_DARK}"/><circle cx="60" cy="70" r="8" fill="${FILL_LIGHT}" stroke="${STROKE}" stroke-width="3"/>`;
    } else {
      // Diagonal arrow with asymmetric side triangle & dot
      body = `<line x1="25" y1="75" x2="75" y2="25" stroke="${STROKE}" stroke-width="4.5" stroke-linecap="round"/><polygon points="78,22 60,24 76,40" fill="${FILL_DARK}"/><rect x="26" y="24" width="16" height="16" fill="${FILL_ACCENT}" stroke="${STROKE}" stroke-width="2.5"/><circle cx="72" cy="70" r="7" fill="${FILL_LIGHT}" stroke="${STROKE}" stroke-width="3"/>`;
    }
    return svgWrap(`<g transform="rotate(${deg} 50 50) ${flip}">${body}</g>`);
  };

  for (let idx = 0; idx < 15; idx++) {
    const baseDeg = (idx * 30) % 360;
    const oddDeg = (baseDeg + 90) % 360;
    const oddSvg = drawAsym(idx, oddDeg, true);
    const sameSvgs: [string, string, string, string] = [
      drawAsym(idx, baseDeg, false),
      drawAsym(idx, (baseDeg + 90) % 360, false),
      drawAsym(idx, (baseDeg + 180) % 360, false),
      drawAsym(idx, (baseDeg + 270) % 360, false),
    ];
    list.push(
      buildFigural(
        idx,
        'Figural - Ketidaksamaan Gambar',
        `[Pola Rotasi vs Pencerminan #${idx + 1}] Empat dari lima gambar berikut merupakan bangun yang identik dan hanya mengalami rotasi. Tentukan SATU gambar yang berbeda (tidak dapat diperoleh hanya dengan rotasi)!`,
        oddSvg,
        sameSvgs,
        `Keempat gambar lainnya dapat saling berimpit jika diputar (rotasi 90°/180°/270°) di bidang datar karena orientasi tangan kanan/kiri komponennya sama. Satu gambar kunci merupakan hasil pencerminan (refleksi/flip), sehingga posisi cabang/elemen pendampingnya berbalik arah saat disejajarkan.`,
        `Trik putar kepala/kertas secara mental: sejajarkan sumbu utama tiap opsi ke arah yang sama, lalu cek apakah elemen kecil (titik/bendera) berada di sisi KANAN atau KIRI sumbu. Yang sisinya terbalik langsung jadi jawaban!`
      )
    );
  }

  // B. Invarian Jumlah Titik = Jumlah Sisi Poligon (15 soal)
  const drawPolyDots = (sides: number, dotCount: number, darkDots: boolean, startDeg: number) => {
    const poly = `<polygon points="${regularPolygonPoints(sides, 50, 50, 34, startDeg)}" fill="${FILL_LIGHT}" stroke="${STROKE}" stroke-width="3"/>`;
    const dots: string[] = [];
    const isTri = sides === 3;
    const rDot = isTri ? (dotCount <= 3 ? 7.5 : 8.8) : dotCount <= 3 ? 10.5 : 13;
    const dotRadius = isTri ? 3.0 : 3.7;
    for (let i = 0; i < dotCount; i++) {
      const ang = ((-90 + (360 * i) / dotCount) * Math.PI) / 180;
      const dx = Math.round((50 + rDot * Math.cos(ang)) * 10) / 10;
      const dy = Math.round((50 + rDot * Math.sin(ang)) * 10) / 10;
      dots.push(
        `<circle cx="${dx}" cy="${dy}" r="${dotRadius}" fill="${darkDots ? FILL_DARK : FILL_ACCENT}" stroke="${STROKE}" stroke-width="1.3"/>`
      );
    }
    return svgWrap(`${poly}${dots.join('')}`);
  };

  for (let idx = 0; idx < 15; idx++) {
    const mode = idx % 3; // 0: dots == sides; 1: dots == sides - 1; 2: dots == sides + 1 (max 7)
    const startDeg = idx % 2 === 0 ? -90 : -45;
    const darkDots = idx % 2 === 0;
    const validSides = [3, 4, 5, 6];
    const oddSides = validSides[idx % 4];

    const expectedDots = (s: number) => (mode === 0 ? s : mode === 1 ? s - 1 : s + 1);
    const wrongDots = mode === 0 ? oddSides + 1 : mode === 1 ? oddSides + 1 : oddSides - 1;

    const ruleDesc =
      mode === 0
        ? 'jumlah titik di dalam bangun tepat SAMA dengan jumlah sisi poligonnya'
        : mode === 1
        ? 'jumlah titik di dalam bangun selalu 1 LEBIH SEDIKIT daripada jumlah sisi poligonnya (titik = sisi − 1)'
        : 'jumlah titik di dalam bangun selalu 1 LEBIH BANYAK daripada jumlah sisi poligonnya (titik = sisi + 1)';

    const oddSvg = drawPolyDots(oddSides, wrongDots, darkDots, startDeg);
    const sameSvgs: [string, string, string, string] = [
      drawPolyDots(3, expectedDots(3), darkDots, startDeg),
      drawPolyDots(4, expectedDots(4), darkDots, startDeg),
      drawPolyDots(5, expectedDots(5), darkDots, startDeg),
      drawPolyDots(6, expectedDots(6), darkDots, startDeg),
    ];
    list.push(
      buildFigural(
        idx + 1,
        'Figural - Ketidaksamaan Gambar',
        `[Pola Kuantitas Elemen #${idx + 1}] Perhatikan hubungan antara jumlah sisi bangun luar dan jumlah titik di dalamnya. Tentukan SATU gambar yang tidak mengikuti aturan keempat gambar lainnya!`,
        oddSvg,
        sameSvgs,
        `Empat gambar mematuhi aturan seragam: ${ruleDesc}. Sementara pada gambar kunci, poligon bersisi ${oddSides} justru berisi ${wrongDots} titik (melanggar pola numerik).`,
        `Langsung hitung selisih (jumlah sisi − jumlah titik) pada 3 gambar pertama untuk menemukan konstanta pola, lalu cari satu gambar yang selisihnya menyimpang!`
      )
    );
  }

  // C. Invarian Posisi & Polaritas Dual-Elemen dalam Grid 2×2 (15 soal)
  const drawGridPair = (
    c1: number,
    c2: number,
    s1: ShapeKind,
    s2: ShapeKind,
    f1: string,
    f2: string
  ) => {
    const grid = `<rect x="10" y="10" width="80" height="80" fill="${FILL_LIGHT}" stroke="${STROKE}" stroke-width="3"/><line x1="50" y1="10" x2="50" y2="90" stroke="${STROKE}" stroke-width="2"/><line x1="10" y1="50" x2="90" y2="50" stroke="${STROKE}" stroke-width="2"/>`;
    const centers: Array<[number, number]> = [
      [30, 30],
      [70, 30],
      [70, 70],
      [30, 70],
    ];
    const [x1, y1] = centers[c1];
    const [x2, y2] = centers[c2];
    return svgWrap(`${grid}${drawShape(s1, x1, y1, 10, f1, STROKE, 2.2)}${drawShape(s2, x2, y2, 10, f2, STROKE, 2.2)}`);
  };

  const gridShapePairs: Array<[ShapeKind, ShapeKind]> = [
    ['circle', 'square'],
    ['triangle', 'circle'],
    ['diamond', 'square'],
    ['circle', 'triangle'],
    ['square', 'diamond'],
  ];

  for (let idx = 0; idx < 15; idx++) {
    const [s1, s2] = gridShapePairs[idx % gridShapePairs.length];
    const ruleType = idx % 3;
    let oddSvg: string;
    let sameSvgs: [string, string, string, string];
    let m1: string;
    let m2: string;

    if (ruleType === 0) {
      // 4 diagonal berseberangan (0-2, 2-0, 1-3, 3-1), 1 bersebelahan (0-1)
      oddSvg = drawGridPair(0, 1, s1, s2, FILL_DARK, FILL_LIGHT);
      sameSvgs = [
        drawGridPair(0, 2, s1, s2, FILL_DARK, FILL_LIGHT),
        drawGridPair(2, 0, s1, s2, FILL_DARK, FILL_LIGHT),
        drawGridPair(1, 3, s1, s2, FILL_DARK, FILL_LIGHT),
        drawGridPair(3, 1, s1, s2, FILL_DARK, FILL_LIGHT),
      ];
      m1 = `Pada empat gambar lainnya, ${SHAPE_NAME[s1]} gelap dan ${SHAPE_NAME[s2]} putih selalu terletak di kuadran yang saling berseberangan secara diagonal. Hanya satu gambar yang menempatkan keduanya bersebelahan di baris atas.`;
      m2 = `Pindai cepat garis diagonal: empat gambar membentuk diagonal silang, satu gambar sejajar horizontal → langsung pilih yang sejajar!`;
    } else if (ruleType === 1) {
      // 4 punya warna kontras (gelap + terang), 1 sama-sama gelap
      oddSvg = drawGridPair(1, 2, s1, s2, FILL_DARK, FILL_DARK);
      sameSvgs = [
        drawGridPair(0, 1, s1, s2, FILL_DARK, FILL_LIGHT),
        drawGridPair(1, 2, s1, s2, FILL_LIGHT, FILL_DARK),
        drawGridPair(2, 3, s1, s2, FILL_DARK, FILL_LIGHT),
        drawGridPair(3, 0, s1, s2, FILL_LIGHT, FILL_DARK),
      ];
      m1 = `Empat gambar konsisten memiliki tepat satu bangun berwarna gelap dan satu bangun berwarna putih (kontras). Satu gambar kunci memiliki KEDUA bangun berwarna gelap sekaligus.`;
      m2 = `Hitung jumlah bangun gelap di setiap opsi: empat opsi punya tepat 1 bangun gelap, satu opsi punya 2 bangun gelap!`;
    } else {
      // 4 punya posisi bersebelahan searah jarum jam (c2 = (c1+1)%4), 1 berseberangan diagonal
      oddSvg = drawGridPair(0, 2, s1, s2, FILL_ACCENT, FILL_LIGHT);
      sameSvgs = [
        drawGridPair(0, 1, s1, s2, FILL_ACCENT, FILL_LIGHT),
        drawGridPair(1, 2, s1, s2, FILL_ACCENT, FILL_LIGHT),
        drawGridPair(2, 3, s1, s2, FILL_ACCENT, FILL_LIGHT),
        drawGridPair(3, 0, s1, s2, FILL_ACCENT, FILL_LIGHT),
      ];
      m1 = `Empat gambar menempatkan ${SHAPE_NAME[s1]} dan ${SHAPE_NAME[s2]} di dua kotak bersebelahan secara berurutan searah jarum jam. Hanya satu gambar yang memisahkan keduanya di sudut diagonal berseberangan.`;
      m2 = `Cek keterhubungan sisi kotak: empat opsi bersisian (menempel satu garis), satu opsi terpisah diagonal!`;
    }

    list.push(
      buildFigural(
        idx + 2,
        'Figural - Ketidaksamaan Gambar',
        `[Pola Relasi Kuadran #${idx + 1}] Amati posisi dan arsiran kedua bangun dalam kisi 2×2 berikut. Tentukan SATU gambar yang tidak sepola dengan keempat gambar lainnya!`,
        oddSvg,
        sameSvgs,
        m1,
        m2
      )
    );
  }

  return list;
}

// ============================================================================
// 3. FIGURAL - SERIAL / POLA GAMBAR (45 SOAL HOTS)
// ============================================================================
function buildFiguralSerialQuestions(): SeedQuestion[] {
  const list: SeedQuestion[] = [];

  // A. Rotasi Jarum Bertahap (+45° / +90° / -45°) + Pergantian Warna Titik Pusat (15 soal)
  const drawClockNeedle = (deg: number, darkCenter: boolean, headType: 'arrow' | 'dot' | 'diamond') => {
    const outer = `<circle cx="50" cy="50" r="40" fill="${FILL_LIGHT}" stroke="${STROKE}" stroke-width="3"/>`;
    const ticks = `<line x1="50" y1="10" x2="50" y2="16" stroke="${STROKE}" stroke-width="2"/><line x1="90" y1="50" x2="84" y2="50" stroke="${STROKE}" stroke-width="2"/><line x1="50" y1="90" x2="50" y2="84" stroke="${STROKE}" stroke-width="2"/><line x1="10" y1="50" x2="16" y2="50" stroke="${STROKE}" stroke-width="2"/>`;
    const head =
      headType === 'arrow'
        ? `<polygon points="50,16 58,30 42,30" fill="${FILL_DARK}"/>`
        : headType === 'dot'
        ? `<circle cx="50" cy="22" r="7" fill="${FILL_ACCENT}" stroke="${STROKE}" stroke-width="2"/>`
        : `<polygon points="50,14 57,23 50,32 43,23" fill="${FILL_DARK}"/>`;
    const needle = `<g transform="rotate(${deg} 50 50)"><line x1="50" y1="50" x2="50" y2="26" stroke="${STROKE}" stroke-width="3.5"/>${head}</g>`;
    const center = `<circle cx="50" cy="50" r="8" fill="${darkCenter ? FILL_DARK : FILL_LIGHT}" stroke="${STROKE}" stroke-width="2.5"/>`;
    return svgWrap(`${outer}${ticks}${needle}${center}`);
  };

  const serialRotConfigs: Array<{ start: number; step: number; stepLabel: string; head: 'arrow' | 'dot' | 'diamond'; startDark: boolean }> = [
    { start: 0, step: 45, stepLabel: '+45° searah jarum jam', head: 'arrow', startDark: true },
    { start: 90, step: 45, stepLabel: '+45° searah jarum jam', head: 'dot', startDark: false },
    { start: 180, step: 45, stepLabel: '+45° searah jarum jam', head: 'diamond', startDark: true },
    { start: 270, step: 45, stepLabel: '+45° searah jarum jam', head: 'arrow', startDark: false },
    { start: 45, step: 45, stepLabel: '+45° searah jarum jam', head: 'dot', startDark: true },
    { start: 0, step: 90, stepLabel: '+90° searah jarum jam', head: 'diamond', startDark: true },
    { start: 45, step: 90, stepLabel: '+90° searah jarum jam', head: 'arrow', startDark: false },
    { start: 135, step: 90, stepLabel: '+90° searah jarum jam', head: 'dot', startDark: true },
    { start: 180, step: 90, stepLabel: '+90° searah jarum jam', head: 'diamond', startDark: false },
    { start: 270, step: 90, stepLabel: '+90° searah jarum jam', head: 'arrow', startDark: true },
    { start: 0, step: 315, stepLabel: '45° berlawanan jarum jam', head: 'dot', startDark: true },
    { start: 180, step: 315, stepLabel: '45° berlawanan jarum jam', head: 'arrow', startDark: false },
    { start: 90, step: 315, stepLabel: '45° berlawanan jarum jam', head: 'diamond', startDark: true },
    { start: 270, step: 270, stepLabel: '90° berlawanan jarum jam', head: 'arrow', startDark: false },
    { start: 45, step: 270, stepLabel: '90° berlawanan jarum jam', head: 'dot', startDark: true },
  ];

  serialRotConfigs.forEach((cfg, idx) => {
    const frames = [0, 1, 2, 3].map((k) =>
      drawClockNeedle((cfg.start + k * cfg.step) % 360, k % 2 === 0 ? cfg.startDark : !cfg.startDark, cfg.head)
    );
    const ansDeg = (cfg.start + 4 * cfg.step) % 360;
    const ansDark = cfg.startDark; // k=4 is even -> same as k=0!
    const correct = drawClockNeedle(ansDeg, ansDark, cfg.head);
    const distractors: [string, string, string, string] = [
      drawClockNeedle(ansDeg, !ansDark, cfg.head),
      drawClockNeedle((ansDeg + 45) % 360, ansDark, cfg.head),
      drawClockNeedle((ansDeg + 90) % 360, ansDark, cfg.head),
      drawClockNeedle((ansDeg + 180) % 360, !ansDark, cfg.head),
    ];
    list.push(
      buildFigural(
        idx,
        'Figural - Serial / Pola Gambar',
        `Amati pola pergerakan jarum dan pusat lingkaran pada 4 gambar berurutan berikut, lalu tentukan gambar ke-5!\n${frames.join(' → ')} → [ ? ]`,
        correct,
        distractors,
        `Dua pola berjalan bersamaan: (1) jarum berputar konsisten sebesar ${cfg.stepLabel} di setiap langkah, sehingga pada langkah ke-5 menunjuk ${degToClockLabel(ansDeg)}; (2) warna titik pusat bergantian gelap–terang (langkah ganjil sama dengan langkah 1), sehingga langkah ke-5 berwarna ${ansDark ? 'gelap' : 'putih'}.`,
        `Trik pola selang-seling: warna pusat gambar ke-5 PASTI sama dengan gambar ke-1 (${ansDark ? 'gelap' : 'putih'})! Coret opsi warna salah, lalu geser jarum 1 langkah dari gambar ke-4.`
      )
    );
  });

  // B. Dual-Element Independent Orbit pada Lintasan 8 Titik Tepi (15 soal)
  const orbitConfigs: Array<[number, number, number, number, ShapeKind, ShapeKind]> = [
    [0, 2, 1, 3, 'circle', 'square'],   // elem1 +1 CW, elem2 -1 CCW
    [1, 3, 1, 3, 'triangle', 'circle'],
    [2, 0, 1, 3, 'diamond', 'square'],
    [3, 1, 1, 3, 'square', 'triangle'],
    [0, 1, 1, 3, 'circle', 'diamond'],
    [0, 2, 3, 1, 'square', 'circle'],   // elem1 -1 CCW, elem2 +1 CW
    [1, 3, 3, 1, 'circle', 'triangle'],
    [2, 0, 3, 1, 'triangle', 'diamond'],
    [3, 1, 3, 1, 'diamond', 'circle'],
    [1, 2, 3, 1, 'square', 'diamond'],
    [0, 1, 1, 2, 'circle', 'square'],   // elem1 +1 CW, elem2 +2 CW
    [1, 2, 1, 2, 'triangle', 'square'],
    [2, 3, 1, 2, 'diamond', 'circle'],
    [3, 0, 3, 2, 'circle', 'triangle'], // elem1 -1 CCW, elem2 +2 CW
    [0, 3, 3, 2, 'square', 'diamond'],
  ];

  // 8-position perimeter orbit so frame 5 (k=4) is ALWAYS a distinct non-repeating position!
  const RING8: Array<[number, number]> = [
    [22, 22], [50, 22], [78, 22],
    [78, 50],
    [78, 78], [50, 78], [22, 78],
    [22, 50],
  ];

  const drawRing8Frame = (pos1: number, pos2: number, s1: ShapeKind, s2: ShapeKind) => {
    const border = `<rect x="10" y="10" width="80" height="80" fill="${FILL_LIGHT}" stroke="${STROKE}" stroke-width="3"/><rect x="34" y="34" width="32" height="32" fill="none" stroke="${FILL_MUTED}" stroke-width="2" stroke-dasharray="3 3"/>`;
    const [x1, y1] = RING8[pos1 % 8];
    const [x2, y2] = RING8[pos2 % 8];
    const same = pos1 % 8 === pos2 % 8;
    const e1 = drawShape(s1, same ? x1 - 6.5 : x1, same ? y1 - 5.5 : y1, same ? 5.2 : 8.5, FILL_DARK, STROKE, 2);
    const e2 = drawShape(s2, same ? x2 + 6.5 : x2, same ? y2 + 5.5 : y2, same ? 5.2 : 8.5, FILL_ACCENT, STROKE, 2);
    return svgWrap(`${border}${e1}${e2}`);
  };

  orbitConfigs.forEach(([p1, p2, step1, step2, s1, s2], idx) => {
    const start1 = (p1 * 2) % 8;
    const start2 = (p2 * 2 + 1) % 8;
    const d1 = step1 === 1 ? 1 : 7; // +1 CW or -1 CCW on 8-ring
    const d2 = step2 === 3 ? 7 : step2 === 1 ? 1 : 2; // -1 CCW, +1 CW, or +2 CW on 8-ring
    const frames = [0, 1, 2, 3].map((k) =>
      drawRing8Frame((start1 + k * d1) % 8, (start2 + k * d2) % 8, s1, s2)
    );
    const ans1 = (start1 + 4 * d1) % 8;
    const ans2 = (start2 + 4 * d2) % 8;
    const correct = drawRing8Frame(ans1, ans2, s1, s2);
    const distractors: [string, string, string, string] = [
      drawRing8Frame((ans1 + 1) % 8, ans2, s1, s2),
      drawRing8Frame(ans1, (ans2 + 1) % 8, s1, s2),
      drawRing8Frame((ans1 + 7) % 8, (ans2 + 7) % 8, s1, s2),
      drawRing8Frame((ans1 + 2) % 8, (ans2 + 6) % 8, s1, s2),
    ];
    const d1Text = d1 === 1 ? '1 posisi searah jarum jam' : '1 posisi berlawanan jarum jam';
    const d2Text =
      d2 === 1
        ? '1 posisi searah jarum jam'
        : d2 === 7
        ? '1 posisi berlawanan jarum jam'
        : '2 posisi searah jarum jam';
    list.push(
      buildFigural(
        idx + 1,
        'Figural - Serial / Pola Gambar',
        `Lacak pergerakan independen kedua simbol di tepi bingkai persegi, lalu tentukan gambar ke-5 yang tepat!\n${frames.join(' → ')} → [ ? ]`,
        correct,
        distractors,
        `Lacak masing-masing simbol terpisah pada lintasan 8 titik tepi: ${SHAPE_NAME[s1]} biru gelap bergerak konstan ${d1Text}, sedangkan ${SHAPE_NAME[s2]} hijau toska bergerak konstan ${d2Text}. Pada langkah ke-5, keduanya tepat menempati posisi pada opsi kunci.`,
        `Aturan emas serial multi-elemen: fokus pada SATU elemen dulu (${SHAPE_NAME[s1]} biru gelap) untuk langsung mencoret 3 opsi salah, baru cek posisi ${SHAPE_NAME[s2]} hijau!`
      )
    );
  });

  // C. Progresi Jumlah Sisi Poligon (3→4→5→6→7) & Progresi Akumulasi Garis/Titik (15 soal)
  const layoutDotsInPolygon = (dots: number, sides: number): Array<[number, number]> => {
    const isTri = sides === 3;
    const s = isTri ? 6.2 : 8.5;
    const cy = isTri ? 52 : 50;
    if (dots <= 1) return [[50, cy]];
    if (dots === 2) return [[50 - s, cy], [50 + s, cy]];
    if (dots === 3) return [[50, cy - s * 0.9], [50 - s, cy + s * 0.7], [50 + s, cy + s * 0.7]];
    if (dots === 4) {
      return [
        [50 - s * 0.85, cy - s * 0.75],
        [50 + s * 0.85, cy - s * 0.75],
        [50 - s * 0.85, cy + s * 0.75],
        [50 + s * 0.85, cy + s * 0.75],
      ];
    }
    if (dots === 5) {
      return [
        [50, cy],
        [50 - s * 1.05, cy - s * 0.95],
        [50 + s * 1.05, cy - s * 0.95],
        [50 - s * 1.05, cy + s * 0.95],
        [50 + s * 1.05, cy + s * 0.95],
      ];
    }
    if (dots === 6) {
      const r = isTri ? 8.2 : 12.2;
      return Array.from({ length: 6 }, (_, i) => {
        const ang = ((-90 + i * 60) * Math.PI) / 180;
        return [Math.round((50 + r * Math.cos(ang)) * 10) / 10, Math.round((cy + r * Math.sin(ang)) * 10) / 10];
      });
    }
    // 7 dots: 1 center + 6 ring
    const r = isTri ? 8.5 : 12.8;
    const pts: Array<[number, number]> = [[50, cy]];
    for (let i = 0; i < 6; i++) {
      const ang = ((-90 + i * 60) * Math.PI) / 180;
      pts.push([Math.round((50 + r * Math.cos(ang)) * 10) / 10, Math.round((cy + r * Math.sin(ang)) * 10) / 10]);
    }
    return pts;
  };

  const drawProgPoly = (sides: number, dots: number, shaded: boolean) => {
    const poly = `<polygon points="${regularPolygonPoints(sides, 50, 50, 34, -90)}" fill="${shaded ? FILL_MUTED : FILL_LIGHT}" stroke="${STROKE}" stroke-width="3"/>`;
    const coords = layoutDotsInPolygon(dots, sides);
    const dotR = sides === 3 ? 2.7 : 3.3;
    const dotEls = coords.map(
      ([x, y]) => `<circle cx="${x}" cy="${y}" r="${dotR}" fill="${FILL_DARK}"/>`
    );
    return svgWrap(`${poly}${dotEls.join('')}`);
  };

  const progSpecs: Array<{
    startSides: number;
    sideStep: number;
    startDots: number;
    dotStep: number;
    altShade: boolean;
  }> = [
    { startSides: 3, sideStep: 1, startDots: 1, dotStep: 1, altShade: true },
    { startSides: 3, sideStep: 1, startDots: 5, dotStep: -1, altShade: false },
    { startSides: 7, sideStep: -1, startDots: 1, dotStep: 1, altShade: true },
    { startSides: 7, sideStep: -1, startDots: 5, dotStep: -1, altShade: true },
    { startSides: 4, sideStep: 1, startDots: 1, dotStep: 1, altShade: false },
    { startSides: 8, sideStep: -1, startDots: 1, dotStep: 1, altShade: false },
    { startSides: 3, sideStep: 1, startDots: 2, dotStep: 1, altShade: true },
    { startSides: 8, sideStep: -1, startDots: 5, dotStep: -1, altShade: true },
  ];

  progSpecs.forEach((sp, idx) => {
    const frames = [0, 1, 2, 3].map((k) =>
      drawProgPoly(
        sp.startSides + k * sp.sideStep,
        sp.startDots + k * sp.dotStep,
        sp.altShade ? k % 2 === 1 : false
      )
    );
    const ansSides = sp.startSides + 4 * sp.sideStep;
    const ansDots = sp.startDots + 4 * sp.dotStep;
    const ansShade = false; // k=4 even
    const correct = drawProgPoly(ansSides, ansDots, ansShade);
    const altDots = ansDots > 1 ? ansDots - 1 : ansDots + 2;
    const distractors: [string, string, string, string] = [
      drawProgPoly(ansSides, altDots, ansShade),
      drawProgPoly(ansSides, ansDots + 1, ansShade),
      drawProgPoly(ansSides + (sp.sideStep > 0 ? 1 : -1), ansDots, ansShade),
      drawProgPoly(ansSides, ansDots, !ansShade),
    ];
    list.push(
      buildFigural(
        idx + 2,
        'Figural - Serial / Pola Gambar',
        `Tentukan gambar ke-5 yang paling tepat melanjutkan progresi jumlah sisi poligon dan titik berikut!\n${frames.join(' → ')} → [ ? ]`,
        correct,
        distractors,
        `Hitung dua deret angka tersembunyi: jumlah sisi poligon berpola ${sp.startSides}, ${sp.startSides + sp.sideStep}, ${sp.startSides + 2 * sp.sideStep}, ${sp.startSides + 3 * sp.sideStep} → berikutnya ${ansSides} sisi; jumlah titik berpola ${sp.startDots}, ${sp.startDots + sp.dotStep}, ${sp.startDots + 2 * sp.dotStep}, ${sp.startDots + 3 * sp.dotStep} → berikutnya ${ansDots} titik${sp.altShade ? ', dengan warna bidang putih (selang-seling)' : ''}.`,
        `Ubah soal gambar menjadi deret angka sederhana: sisi → ${ansSides}, titik → ${ansDots}! Cek jumlah titik dulu (lebih cepat dihitung) lalu verifikasi jumlah sisi.`
      )
    );
  });

  // 7 soal Progresi Akumulasi Motif Geometris Berbeda (100% unik per soal)
  const drawAccumMotif = (count: number, motif: number) => {
    const base = `<rect x="12" y="12" width="76" height="76" fill="${FILL_LIGHT}" stroke="${STROKE}" stroke-width="3"/>`;
    const elems: string[] = [];
    if (motif === 0) {
      // Batang vertikal (1..6)
      for (let i = 0; i < count; i++) {
        const x = 18 + i * 11;
        elems.push(
          `<rect x="${x}" y="22" width="7.5" height="56" fill="${i % 2 === 0 ? FILL_DARK : FILL_ACCENT}" stroke="${STROKE}" stroke-width="1.4"/>`
        );
      }
    } else if (motif === 1) {
      // Garis horizontal (1..6)
      for (let i = 0; i < count; i++) {
        const y = 22 + i * 11;
        elems.push(
          `<line x1="20" y1="${y}" x2="80" y2="${y}" stroke="${i % 2 === 0 ? FILL_DARK : FILL_ACCENT}" stroke-width="4.5" stroke-linecap="round"/>`
        );
      }
    } else if (motif === 2) {
      // Titik diagonal naik (kiri-bawah ke kanan-atas)
      for (let i = 0; i < count; i++) {
        const x = 23 + i * 11;
        const y = 77 - i * 11;
        elems.push(
          `<circle cx="${x}" cy="${y}" r="4.8" fill="${i % 2 === 0 ? FILL_DARK : FILL_ACCENT}" stroke="${STROKE}" stroke-width="1.4"/>`
        );
      }
    } else if (motif === 3) {
      // Lingkaran konsentris bertingkat
      for (let i = 0; i < count; i++) {
        const r = 7 + i * 5.6;
        elems.push(
          `<circle cx="50" cy="50" r="${r.toFixed(1)}" fill="none" stroke="${i % 2 === 0 ? FILL_DARK : FILL_ACCENT}" stroke-width="2.4"/>`
        );
      }
    } else if (motif === 4) {
      // Persegi bertangga diagonal turun
      for (let i = 0; i < count; i++) {
        const pos = 19 + i * 10.5;
        elems.push(
          `<rect x="${pos}" y="${pos}" width="9" height="9" fill="${i % 2 === 0 ? FILL_DARK : FILL_ACCENT}" stroke="${STROKE}" stroke-width="1.4"/>`
        );
      }
    } else if (motif === 5) {
      // Jari-jari sinar dari titik pusat lingkaran
      const ring = `<circle cx="50" cy="50" r="32" fill="${FILL_LIGHT}" stroke="${STROKE}" stroke-width="2.5"/>`;
      elems.push(ring);
      for (let i = 0; i < count; i++) {
        const rad = ((-90 + i * 45) * Math.PI) / 180;
        const x2 = (50 + 30 * Math.cos(rad)).toFixed(1);
        const y2 = (50 + 30 * Math.sin(rad)).toFixed(1);
        elems.push(
          `<line x1="50" y1="50" x2="${x2}" y2="${y2}" stroke="${i % 2 === 0 ? FILL_DARK : FILL_ACCENT}" stroke-width="3"/>`
        );
      }
      elems.push(`<circle cx="50" cy="50" r="4" fill="${FILL_DARK}"/>`);
      return svgWrap(`${elems.join('')}`);
    } else {
      // Deret belah ketupat horizontal di tengah
      for (let i = 0; i < count; i++) {
        const cx = 22 + i * 11;
        elems.push(
          `<polygon points="${cx},43 ${cx + 5},50 ${cx},57 ${cx - 5},50" fill="${i % 2 === 0 ? FILL_DARK : FILL_ACCENT}" stroke="${STROKE}" stroke-width="1.4"/>`
        );
      }
    }
    return svgWrap(`${base}${elems.join('')}`);
  };

  const accumSpecs: Array<{
    motif: number;
    wrongMotif: number;
    label: string;
    seq: number[];
    ans: number;
    wrongCounts: [number, number, number];
    reverse: boolean;
  }> = [
    { motif: 0, wrongMotif: 1, label: 'batang vertikal', seq: [1, 2, 3, 4], ans: 5, wrongCounts: [6, 4, 3], reverse: false },
    { motif: 1, wrongMotif: 0, label: 'garis horizontal', seq: [6, 5, 4, 3], ans: 2, wrongCounts: [1, 3, 4], reverse: true },
    { motif: 2, wrongMotif: 4, label: 'titik diagonal naik', seq: [1, 2, 3, 4], ans: 5, wrongCounts: [6, 4, 3], reverse: false },
    { motif: 3, wrongMotif: 5, label: 'lingkaran konsentris', seq: [5, 4, 3, 2], ans: 1, wrongCounts: [3, 4, 5], reverse: true },
    { motif: 4, wrongMotif: 2, label: 'persegi bertangga diagonal', seq: [1, 2, 3, 4], ans: 5, wrongCounts: [6, 4, 3], reverse: false },
    { motif: 5, wrongMotif: 3, label: 'jari-jari sinar lingkaran', seq: [2, 3, 4, 5], ans: 6, wrongCounts: [7, 5, 4], reverse: false },
    { motif: 6, wrongMotif: 0, label: 'belah ketupat sejajar', seq: [6, 5, 4, 3], ans: 2, wrongCounts: [1, 3, 4], reverse: true },
  ];

  accumSpecs.forEach((sp, idx) => {
    const frames = sp.seq.map((c) => drawAccumMotif(c, sp.motif));
    const correct = drawAccumMotif(sp.ans, sp.motif);
    const distractors: [string, string, string, string] = [
      drawAccumMotif(sp.wrongCounts[0], sp.motif),
      drawAccumMotif(sp.wrongCounts[1], sp.motif),
      drawAccumMotif(sp.wrongCounts[2], sp.motif),
      drawAccumMotif(sp.ans, sp.wrongMotif),
    ];
    list.push(
      buildFigural(
        idx + 3,
        'Figural - Serial / Pola Gambar',
        `Amati pola ${sp.reverse ? 'pengurangan' : 'penambahan'} elemen ${sp.label} pada rangkaian berikut, lalu pilih gambar ke-5 yang tepat!\n${frames.join(' → ')} → [ ? ]`,
        correct,
        distractors,
        `Setiap langkah mengalami ${sp.reverse ? 'pengurangan tepat 1' : 'penambahan tepat 1'} ${sp.label} (${sp.seq.join(' → ')} → ${sp.ans}) dengan motif dan arah susunan tetap konsisten.`,
        `Hitung jumlah elemen (${sp.seq.join(', ')} → ${sp.ans}) lalu langsung eliminasi opsi yang jumlah atau jenis motifnya berbeda!`
      )
    );
  });

  return list;
}

export const TIU_FIGURAL_QUESTIONS: SeedQuestion[] = [
  ...buildFiguralAnalogyQuestions(),
  ...buildFiguralOddOneOutQuestions(),
  ...buildFiguralSerialQuestions(),
];
