import type { OptionKey } from '../../src/shared/types';
import type { SeedQuestion } from './types';

type KeyIdx = 0 | 1 | 2 | 3 | 4;
const KEYS: readonly OptionKey[] = ['A', 'B', 'C', 'D', 'E'];

function makeTiuQuestion(
  subtopik: string,
  pertanyaan: string,
  options: [string, string, string, string, string],
  correctIdx: KeyIdx,
  metode1: string,
  metode2: string
): SeedQuestion {
  return {
    exam_type: 'SKD',
    kategori: 'TIU',
    subtopik,
    pertanyaan,
    opsi_a: options[0],
    opsi_b: options[1],
    opsi_c: options[2],
    opsi_d: options[3],
    opsi_e: options[4],
    jawaban_benar: KEYS[correctIdx],
    pembahasan: `Metode 1 (Langkah Sistematis): ${metode1}\nMetode 2 (Trik Cepat / Eliminasi): ${metode2}`,
  };
}

// Deterministic permutation helper so correct answer keys are evenly distributed across A..E
function buildShuffled(
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
  return makeTiuQuestion(
    subtopik,
    pertanyaan,
    opts as [string, string, string, string, string],
    targetIdx,
    metode1,
    metode2
  );
}

// ============================================================================
// 1. KEMAMPUAN VERBAL - ANALOGI (50 SOAL HOTS)
// ============================================================================
interface AnalogySpec {
  stem: string;
  correct: string;
  distractors: [string, string, string, string];
  rel: string;
  trick: string;
}

const ANALOGY_SPECS: AnalogySpec[] = [
  {
    stem: 'SEISMOGRAF : GEMPA BUMI = ... : ...',
    correct: 'BAROMETER : TEKANAN UDARA',
    distractors: ['TERMOMETER : TEKANAN DARAH', 'ANEMOMETER : HUJAN DERAS', 'HIGROMETER : ARAH ANGIN', 'KOMPAS : KETINGGIAN BUKIT'],
    rel: 'Seismograf adalah instrumen khusus untuk mengukur/mencatat gempa bumi; barometer adalah instrumen khusus untuk mengukur tekanan udara.',
    trick: 'Cek pola [Alat Ukur] : [Besaran/Fenomena Spesifik]. Eliminasi pasangan alat-objek yang tidak sesuai fungsi (termometer untuk suhu, higrometer untuk kelembapan, anemometer untuk kecepatan angin, kompas untuk arah).',
  },
  {
    stem: 'AUDITOR : LAPORAN KEUANGAN = ... : ...',
    correct: 'KURATOR : KOLEKSI MUSEUM',
    distractors: ['DOKTER : RUANG OPERASI', 'NOTARIS : GEDUNG PENGADILAN', 'ARSITEK : SEMEN BETON', 'HAKIM : PALU SIDANG'],
    rel: 'Auditor bertugas memeriksa dan menilai keabsahan laporan keuangan; kurator bertugas mengawasi, meneliti, dan mengelola koleksi museum.',
    trick: 'Gunakan jembatan kalimat "[Profesi] menelaah/mengelola [Objek Utama Kerja]". Eliminasi opsi yang memasangkan profesi dengan lokasi atau alat fisik.',
  },
  {
    stem: 'DEHIDRASI : CAIRAN = ... : ...',
    correct: 'ANEMIA : HEMOGLOBIN',
    distractors: ['DEMAM : PARASETAMOL', 'INFEKSI : BAKTERI', 'OBESITAS : OLAHRAGA', 'ASMA : INHALER'],
    rel: 'Dehidrasi merupakan kondisi kekurangan cairan tubuh; anemia merupakan kondisi kekurangan hemoglobin/sel darah merah.',
    trick: 'Pola [Kondisi Medis] disebabkan kekurangan [Zat Internal]. Eliminasi pasangan penyakit-obat/alat (demam-parasetamol, asma-inhaler) dan penyakit-pemicu (infeksi-bakteri).',
  },
  {
    stem: 'PROLOG : EPILOG = ... : ...',
    correct: 'FONDASI : ATAP',
    distractors: ['PENDAHULUAN : DAFTAR ISI', 'AWAL : PROSES', 'MULAI : JEDA', 'AKAR : BATANG'],
    rel: 'Prolog adalah bagian pembuka mutlak dan epilog adalah bagian penutup akhir karya; fondasi adalah bagian terbawah/awal dan atap bagian teratas/penutup bangunan.',
    trick: 'Cari pasangan [Bagian Pembuka/Awal] : [Bagian Penutup/Akhir] dalam satu kesatuan struktur. Eliminasi pasangan awal-tengah (akar-batang, awal-proses).',
  },
  {
    stem: 'ANTIBIOTIK : BAKTERI = ... : ...',
    correct: 'FUNGISIDA : JAMUR',
    distractors: ['VITAMIN : VIRUS', 'VAKSIN : NYAMUK', 'ANALGESIK : LUKA ROBEK', 'HERBISIDA : SERANGGA'],
    rel: 'Antibiotik adalah zat yang dirancang khusus membasmi bakteri; fungisida adalah zat yang dirancang khusus membasmi jamur.',
    trick: 'Pola [Agen Pembasmi] : [Organisme Sasaran Spesifik]. Ingat: herbisida untuk gulma (bukan serangga), vaksin untuk pencegahan (bukan pembasmi nyamuk).',
  },
  {
    stem: 'KARTON : KARDUS = ... : ...',
    correct: 'BENANG : KAIN',
    distractors: ['KAYU : HUTAN', 'BESI : TAMBANG', 'AIR : SUNGAI', 'PASIR : PANTAI'],
    rel: 'Karton adalah bahan baku terolah yang dirangkai menjadi kardus; benang adalah bahan baku terolah yang ditenun menjadi kain.',
    trick: 'Pastikan arah [Bahan Baku] → [Produk Olahan]. Opsi lain memiliki arah terbalik atau menunjukkan [Objek] : [Lokasi Alami].',
  },
  {
    stem: 'INFLASI : DAYA BELI = ... : ...',
    correct: 'EROSI : KESUBURAN TANAH',
    distractors: ['HUJAN : DEBIT SUNGAI', 'INVESTASI : PERTUMBUHAN', 'DISIPLIN : PRODUKTIVITAS', 'DEFORESTASI : BANJIR BANDANG'],
    rel: 'Inflasi yang meningkat menurunkan/menggerus daya beli; erosi yang meningkat menurunkan/menggerus kesuburan tanah.',
    trick: 'Cek arah korelasi negatif: [Fenomena A naik] → [Kualitas B turun]. Eliminasi korelasi positif (hujan-debit, deforestasi-banjir).',
  },
  {
    stem: 'DERAJAT : SUDUT = ... : ...',
    correct: 'DESIBEL : INTENSITAS BUNYI',
    distractors: ['WATT : KABEL LISTRIK', 'KILOGRAM : TIMBANGAN', 'KNOT : PELABUHAN', 'HEKTARE : PETANI'],
    rel: 'Derajat adalah satuan baku untuk mengukur besar sudut; desibel adalah satuan baku untuk mengukur intensitas bunyi.',
    trick: 'Pola [Satuan Pengukuran] : [Besaran yang Diukur]. Eliminasi opsi yang memasangkan satuan dengan alat, lokasi, atau pelaku.',
  },
  {
    stem: 'KATALISATOR : REAKSI = ... : ...',
    correct: 'MODERATOR : DISKUSI',
    distractors: ['REM : KECEPATAN', 'OBAT : PENYAKIT', 'FILTER : KOTORAN', 'KUNCI : PINTU'],
    rel: 'Katalisator mempercepat dan memfasilitasi berlangsungnya reaksi tanpa ikut berubah menjadi produk; moderator memandu dan melancarkan jalannya diskusi secara netral.',
    trick: 'Pola [Pihak/Zat Pemfasilitasi Proses] : [Proses]. Eliminasi benda penghambat (rem, filter).',
  },
  {
    stem: 'KONSTITUSI : NEGARA = ... : ...',
    correct: 'ANGGARAN DASAR : ORGANISASI',
    distractors: ['KONTRAK : PEGAWAI', 'RESEP : DOKTER', 'DENAH : KOTA', 'JADWAL : KERETA'],
    rel: 'Konstitusi adalah hukum dasar tertinggi yang mengatur penyelenggaraan negara; anggaran dasar adalah aturan dasar tertinggi yang mengatur organisasi.',
    trick: 'Cari hubungan [Aturan Fundamental Tertinggi] : [Entitas Kolektif]. Kontrak hanya mengikat individu, bukan konstitusi lembaga.',
  },
  {
    stem: 'MONOLOG : SATU = ... : ...',
    correct: 'DUET : DUA',
    distractors: ['DIALOG : TIGA', 'SOLO : BANYAK', 'PADUAN SUARA : EMPAT', 'ORASI : RIBUAN'],
    rel: 'Monolog secara definisi dilakukan oleh tepat satu pelaku; duet secara definisi dilakukan oleh tepat dua pelaku.',
    trick: 'Cek ketepatan kuantitas definisional (mono=1, du/di=2). Dialog berarti dua pihak (bukan tiga), solo berarti satu.',
  },
  {
    stem: 'KARTOGRAFI : PETA = ... : ...',
    correct: 'LEKSIKOGRAFI : KAMUS',
    distractors: ['GEOGRAFI : GUNUNG', 'BIOLOGI : RUMAH SAKIT', 'DEMOGRAFI : GEDUNG', 'KALIGRAFI : PENA'],
    rel: 'Kartografi adalah ilmu dan teknik penyusunan peta; leksikografi adalah ilmu dan teknik penyusunan kamus.',
    trick: 'Pola [Cabang Ilmu/Seni Penyusunan] : [Karya Referensi yang Dihasilkan]. Kaligrafi menghasilkan tulisan indah, bukan pena.',
  },
  {
    stem: 'GERIMIS : BADAI = ... : ...',
    correct: 'SEJUK : BEKU',
    distractors: ['SIANG : MALAM', 'BASAH : KERING', 'TINGGI : RENDAH', 'PANAS : DINGIN'],
    rel: 'Gerimis dan badai berada pada spektrum intensitas cuaca yang sama dari ringan menuju ekstrem; sejuk dan beku berada pada spektrum suhu dingin dari ringan menuju ekstrem.',
    trick: 'Kenali hubungan [Gradasi Intensitas Searah: Ringan → Ekstrem]. Empat pengecoh lainnya adalah antonim berlawanan kutub!',
  },
  {
    stem: 'VAKSINASI : IMUNITAS = ... : ...',
    correct: 'LITERASI : WAWASAN',
    distractors: ['POLUSI : KESEHATAN', 'KORUPSI : KESEJAHTERAAN', 'KEMACETAN : EFISIENSI', 'KEBAKARAN : KEAMANAN'],
    rel: 'Vaksinasi adalah tindakan preventif/pembinaan yang meningkatkan imunitas; literasi adalah kegiatan pembelajaran yang meningkatkan wawasan.',
    trick: 'Cek valensi sebab-akibat positif: [Aktivitas Konstruktif] → [Dampak Positif]. Semua pengecoh memiliki dampak negatif.',
  },
  {
    stem: 'DERMAGA : KAPAL = ... : ...',
    correct: 'HANGGAR : PESAWAT',
    distractors: ['ASPAL : MOBIL', 'REL : MASINIS', 'BANDARA : PILOT', 'GARASI : BENSIN'],
    rel: 'Dermaga adalah tempat bersandar/parkir khusus bagi kapal; hanggar adalah tempat penyimpanan/parkir khusus bagi pesawat.',
    trick: 'Pola [Fasilitas Sandar/Simpan] : [Kendaraan]. Eliminasi pasangan fasilitas-pengemudi (bandara-pilot, rel-masinis) dan fasilitas-bahan bakar.',
  },
  {
    stem: 'SINONIM : MAKNA = ... : ...',
    correct: 'HOMOFON : BUNYI',
    distractors: ['ANTONIM : HURUF', 'AKRONIM : PARAGRAF', 'METAFORA : EJAAN', 'HOMOGRAF : ARTI'],
    rel: 'Sinonim merujuk pada kesamaan makna kata; homofon merujuk pada kesamaan bunyi pelafalan kata (meski ejaan/makna berbeda).',
    trick: 'Pecah akar kata Yunani: sino-nim (sama makna), homo-fon (sama bunyi/fono). Homograf adalah sama tulisan (graf), bukan sama arti.',
  },
  {
    stem: 'HAKIM : PUTUSAN = ... : ...',
    correct: 'LEGISLATOR : UNDANG-UNDANG',
    distractors: ['JAKSA : PENJARA', 'POLISI : PENGADILAN', 'PENGACARA : HUKUMAN', 'PANITERA : BORGOL'],
    rel: 'Hakim menghasilkan produk hukum resmi berupa putusan; legislator menghasilkan produk hukum resmi berupa undang-undang.',
    trick: 'Gunakan jembatan "[Pejabat/Profesi Hukum] menerbitkan [Produk Hukum Resmi]".',
  },
  {
    stem: 'EPIDEMI : PANDEMI = ... : ...',
    correct: 'LOKAL : GLOBAL',
    distractors: ['DOKTER : PASIEN', 'VIRUS : BAKTERI', 'AKUT : SEMBUH', 'CEPAT : LAMBAT'],
    rel: 'Epidemi adalah wabah pada skala wilayah terbatas, sedangkan pandemi meluas hingga skala lintas benua/dunia; analog dengan skala lokal menuju global.',
    trick: 'Identifikasi perbandingan skala cakupan ruang: [Skala Terbatas] : [Skala Menyeluruh].',
  },
  {
    stem: 'KLOROFIL : FOTOSINTESIS = ... : ...',
    correct: 'ENZIM : PENCERNAAN',
    distractors: ['AKAR : BUAH', 'OKSIGEN : KARBON', 'BATANG : TANAH', 'DAUN : CAHAYA'],
    rel: 'Klorofil adalah senyawa biologis kunci yang memungkinkan proses fotosintesis berlangsung; enzim adalah senyawa biologis kunci yang memungkinkan proses pencernaan berlangsung.',
    trick: 'Pola [Zat Biokimia Kunci] : [Proses Fisiologis Utama]. Eliminasi pasangan organ atau unsur pasif.',
  },
  {
    stem: 'KRONOLOGIS : WAKTU = ... : ...',
    correct: 'ALFABETIS : HURUF',
    distractors: ['SISTEMATIS : MASALAH', 'GEOGRAFIS : SEJARAH', 'NUMERIK : WARNA', 'LOGIS : EMOSI'],
    rel: 'Kronologis berarti disusun berurutan berdasarkan waktu; alfabetis berarti disusun berurutan berdasarkan urutan huruf.',
    trick: 'Pola [Metode Pengurutan] : [Dasar Pengurutan Spesifik].',
  },
  {
    stem: 'PLAGIARISME : KARYA ILMIAH = ... : ...',
    correct: 'PEMALSUAN : DOKUMEN RESMI',
    distractors: ['PENERBITAN : BUKU', 'PENELITIAN : DATA', 'PENYUNTINGAN : NASKAH', 'PENGARSIPAN : BERKAS'],
    rel: 'Plagiarisme adalah pelanggaran integritas/kecurangan terhadap keaslian karya ilmiah; pemalsuan adalah pelanggaran integritas terhadap keaslian dokumen resmi.',
    trick: 'Cek valensi negatif: [Tindakan Pelanggaran Keaslian] : [Objek yang Dilanggar]. Empat pengecoh adalah proses normal/sah.',
  },
  {
    stem: 'DIAGONAL : PERSEGI = ... : ...',
    correct: 'DIAMETER : LINGKARAN',
    distractors: ['SUDUT : GARIS', 'KELILING : LUAS', 'VOLUME : KUBUS', 'SISI : TITIK'],
    rel: 'Diagonal adalah ruas garis lurus yang menghubungkan dua titik terjauh melalui pusat persegi; diameter adalah ruas garis lurus yang menghubungkan dua titik terjauh melalui pusat lingkaran.',
    trick: 'Pola [Garis Lintas Pusat Terpanjang] : [Bangun Datar 2D]. Eliminasi besaran 3D (volume) dan konsep non-garis.',
  },
  {
    stem: 'SINKRON : SEREMPAK = ... : ...',
    correct: 'STAGNAN : MANDEK',
    distractors: ['DINAMIS : STATIS', 'PROGRESIF : MUNDUR', 'OTONOM : TERIKAT', 'FLEKSIBEL : KAKU'],
    rel: 'Sinkron bermakna serempak/selaras waktu (hubungan kesepadanan konseptual); stagnan bermakna mandek/tidak berkembang.',
    trick: 'Perhatikan bahwa pasangan soal bersifat ekuivalen (searah), sedangkan 4 pengecoh semuanya berpasangan antonim!',
  },
  {
    stem: 'SERTIFIKAT : KEPEMILIKAN = ... : ...',
    correct: 'IJAZAH : KELULUSAN',
    distractors: ['KTP : PEKERJAAN', 'PASPOR : PENGHASILAN', 'SIM : KENDARAAN', 'NPWP : KEPENDUDUKAN'],
    rel: 'Sertifikat merupakan bukti otentik legal atas kepemilikan; ijazah merupakan bukti otentik legal atas kelulusan pendidikan.',
    trick: 'Uji ketepatan legalitas dokumen: SIM membuktikan kompetensi mengemudi (bukan kepemilikan kendaraan), NPWP untuk perpajakan.',
  },
  {
    stem: 'AMPLIFIKASI : SUARA = ... : ...',
    correct: 'MAGNIFIKASI : CITRA',
    distractors: ['REDUKSI : PANJANG', 'DISTORSI : KEJELASAN', 'KOMPRESI : KAPASITAS', 'ISOLASI : JARINGAN'],
    rel: 'Amplifikasi adalah proses memperbesar intensitas suara; magnifikasi adalah proses memperbesar ukuran tampak citra/gambar.',
    trick: 'Cari proses pembesaran ([Aksi Memperbesar] : [Objek]). Reduksi dan kompresi justru memperkecil.',
  },
  {
    stem: 'TRANSPARANSI : AKUNTABILITAS = ... : ...',
    correct: 'PREVENSI : KESELAMATAN',
    distractors: ['BIROKRASI : KELAMBATAN', 'NEPOTISME : MERITOKRASI', 'MONOPOLI : KOMPETISI', 'DISKRIMINASI : KESETARAAN'],
    rel: 'Transparansi merupakan prasyarat yang menumbuhkan akuntabilitas; prevensi (pencegahan) merupakan prasyarat yang menumbuhkan keselamatan.',
    trick: 'Cari hubungan [Prinsip/Tindakan Pendukung] → [Hasil Positif yang Dituju]. Tiga pengecoh terakhir justru saling bertentangan.',
  },
  {
    stem: 'PREMIS : KESIMPULAN = ... : ...',
    correct: 'DATA : INFORMASI',
    distractors: ['EFEK : SEBAB', 'PRODUK : BAHAN', 'HASIL : PROSES', 'AKHIR : AWAL'],
    rel: 'Premis adalah masukan dasar yang diolah secara logis menghasilkan kesimpulan; data adalah masukan mentah yang diolah menghasilkan informasi.',
    trick: 'Perhatikan arah [Input] → [Output]. Keempat pengecoh memiliki arah terbalik ([Output] → [Input])!',
  },
  {
    stem: 'KONSERVASI : KEANEKARAGAMAN HAYATI = ... : ...',
    correct: 'PRESERVASI : ARSIP SEJARAH',
    distractors: ['EKSPLOITASI : HUTAN LINDUNG', 'URBANISASI : LAHAN PERTANIAN', 'POLARISASI : PERSATUAN', 'DEGRADASI : LINGKUNGAN'],
    rel: 'Konservasi adalah upaya pelestarian terhadap keanekaragaman hayati; preservasi adalah upaya pelestarian/pengawetan terhadap arsip sejarah.',
    trick: 'Pola [Upaya Perlindungan/Pelestarian] : [Aset yang Dijaga]. Semua pengecoh bersifat merusak atau menggerus.',
  },
  {
    stem: 'HIPOTESIS : EKSPERIMEN = ... : ...',
    correct: 'DAKWAAN : PERSIDANGAN',
    distractors: ['VONIS : PENYELIDIKAN', 'TEORI : SPEKULASI', 'FAKTA : ASUMSI', 'RUMUS : HAFALAN'],
    rel: 'Hipotesis adalah dugaan awal yang harus diuji pembuktiannya melalui eksperimen; dakwaan adalah tuduhan awal yang harus diuji pembuktiannya melalui persidangan.',
    trick: 'Jembatan kalimat: "[Pernyataan Awal] diuji kebenarannya dalam [Proses Pembuktian]".',
  },
  {
    stem: 'INSENTIF : MOTIVASI = ... : ...',
    correct: 'SANKSI : KEPATUHAN',
    distractors: ['HADIAH : PELANGGARAN', 'DENDA : KEUNTUNGAN', 'PAJAK : KEMISKINAN', 'SUBSIDI : KEBANGKRUTAN'],
    rel: 'Insentif diberikan sebagai instrumen pendorong motivasi; sanksi diterapkan sebagai instrumen penegak kepatuhan.',
    trick: 'Pola [Instrumen Kebijakan] → [Perilaku Target yang Diharapkan]. Eliminasi pasangan yang tidak logis secara tujuan kebijakan.',
  },
  {
    stem: 'ARKEOLOG : FOSIL = ... : ...',
    correct: 'FILOLOG : NASKAH KUNO',
    distractors: ['ASTRONOM : TELESKOP', 'AHLI GIZI : TIMBANGAN', 'KIMIAWAN : LABU UKUR', 'BOTANIS : MIKROSKOP'],
    rel: 'Arkeolog adalah ilmuwan yang objek kajian utamanya fosil/artefak; filolog adalah ilmuwan yang objek kajian utamanya naskah kuno.',
    trick: 'Bedakan [Objek Kajian] vs [Alat Bantu]. Keempat pengecoh memasangkan ilmuwan dengan alat bantu fisiknya!',
  },
  {
    stem: 'KAPILER : DARAH = ... : ...',
    correct: 'XILEM : AIR DAN MINERAL',
    distractors: ['DAUN : KLOROFIL', 'JANTUNG : PARU-PARU', 'OTOT : TULANG', 'KULIT : KERINGAT'],
    rel: 'Kapiler adalah pembuluh halus pengangkut darah pada tubuh manusia/hewan; xilem adalah pembuluh pengangkut air dan mineral pada tumbuhan.',
    trick: 'Pola [Saluran/Pembuluh Transportasi Biologis] : [Zat yang Diangkut].',
  },
  {
    stem: 'ABSTRAK : JURNAL ILMIAH = ... : ...',
    correct: 'SINOPSIS : NOVEL',
    distractors: ['BAB : HALAMAN', 'COVER : PENERBIT', 'CATATAN KAKI : PENULIS', 'INDEKS : PERPUSTAKAAN'],
    rel: 'Abstrak adalah ringkasan padat isi keseluruhan jurnal ilmiah; sinopsis adalah ringkasan padat alur keseluruhan novel.',
    trick: 'Pola [Ringkasan Inti] : [Jenis Karya Tulis].',
  },
  {
    stem: 'RESESI : EKONOMI = ... : ...',
    correct: 'ATROFI : OTOT',
    distractors: ['HIPERTROFI : JARINGAN', 'EKSPANSI : PASAR', 'SURPLUS : ANGGARAN', 'EVOLUSI : SPESIES'],
    rel: 'Resesi adalah penyusutan/penurunan aktivitas ekonomi; atrofi adalah penyusutan/penurunan massa jaringan otot.',
    trick: 'Cek arah [Kondisi Penyusutan/Penurunan] : [Sistem/Organ]. Hipertrofi, ekspansi, dan surplus bermakna pembesaran/kenaikan.',
  },
  {
    stem: 'KONSENSUS : MUSYAWARAH = ... : ...',
    correct: 'KESEPAKATAN : NEGOSIASI',
    distractors: ['KONFLIK : MEDIASI', 'VOTING : PEMAKSAAN', 'PERANG : DIPLOMASI', 'DEBAT : MONOLOG'],
    rel: 'Konsensus adalah mufakat bersama yang dicapai melalui proses musyawarah; kesepakatan adalah titik temu yang dicapai melalui proses negosiasi.',
    trick: 'Pola [Hasil Kesepakatan] ← [Proses Pencapaian Damai]. Eliminasi hasil bertentangan (konflik, perang).',
  },
  {
    stem: 'FOTON : CAHAYA = ... : ...',
    correct: 'ELEKTRON : ARUS LISTRIK',
    distractors: ['TERMOMETER : PANAS', 'MAGNET : BESI', 'BATERAI : LAMPU', 'KABEL : ENERGI'],
    rel: 'Foton adalah partikel kuantum pembawa energi cahaya; elektron adalah partikel bermuatan pembawa arus listrik.',
    trick: 'Pola [Partikel Dasar Pembawa] : [Fenomena Fisika]. Eliminasi benda makroskopis (baterai, kabel, termometer).',
  },
  {
    stem: 'REDUNDANSI : EFISIENSI = ... : ...',
    correct: 'AMBIGUITAS : KEJELASAN',
    distractors: ['PRESISI : AKURASI', 'KOHERENSI : KETERPADUAN', 'VALIDITAS : KEABSAHAN', 'SINERGI : KOLABORASI'],
    rel: 'Redundansi (pengulangan berlebih) merupakan faktor yang mengurangi efisiensi; ambiguitas (makna ganda) merupakan faktor yang mengurangi kejelasan.',
    trick: 'Pola hubungan antagonistik [Hambatan Kualitas] : [Kualitas yang Terganggu]. Empat pengecoh justru pasangan saling menguatkan.',
  },
  {
    stem: 'DIPLOMAT : KEDUTAAN = ... : ...',
    correct: 'NAKHODA : ANJUNGAN KAPAL',
    distractors: ['GURU : BUKU PELAJARAN', 'PETANI : CANGKUL', 'KOKI : RESEP MASAKAN', 'PENULIS : NASKAH'],
    rel: 'Diplomat menjalankan fungsi utamanya di tempat tugas resmi kedutaan; nakhoda menjalankan fungsi komando utamanya di anjungan kapal.',
    trick: 'Pola [Profesi] : [Lokasi Kerja Spesifik]. Empat pengecoh memasangkan profesi dengan objek/alat kerja.',
  },
  {
    stem: 'METAMORFOSIS : KUPU-KUPU = ... : ...',
    correct: 'FERMENTASI : TEMPE',
    distractors: ['PENEBANGAN : HUTAN', 'PENCEMARAN : SUNGAI', 'PEMBEKUAN : UAP AIR', 'PENGERINGAN : HUJAN'],
    rel: 'Metamorfosis adalah proses transformasi biologis bertahap yang menghasilkan kupu-kupu; fermentasi adalah proses transformasi biokimia mikroorganisme yang menghasilkan tempe.',
    trick: 'Cari proses transformasi biologis ([Proses Biologis] → [Produk/Bentuk Akhir]). Keempat pengecoh bukan proses pembentukan biologis.',
  },
  {
    stem: 'SUTRADARA : FILM = ... : ...',
    correct: 'KONDUKTOR : ORKESTRA',
    distractors: ['AKTOR : BIOSKOP', 'PENONTON : PANGGUNG', 'KAMERAMEN : TIKET', 'PENYANYI : MIKROFON'],
    rel: 'Sutradara mengarahkan dan memadukan seluruh elemen produksi film; konduktor mengarahkan dan memadukan seluruh pemain musik dalam orkestra.',
    trick: 'Pola [Pemimpin Pengarah Artistik] : [Pertunjukan/Karya Kolektif].',
  },
  {
    stem: 'KALORI : ENERGI = ... : ...',
    correct: 'BYTE : DATA DIGITAL',
    distractors: ['LAYAR : PIKSEL', 'ROUTER : INTERNET', 'PROSESOR : KOMPUTER', 'BATERAI : LISTRIK'],
    rel: 'Kalori adalah satuan pengukuran kuantitas energi; byte adalah satuan pengukuran kuantitas data digital.',
    trick: 'Pola [Satuan Ukuran] : [Objek Kuantitas]. Eliminasi perangkat keras (router, prosesor, baterai).',
  },
  {
    stem: 'IMUNITAS : PENYAKIT = ... : ...',
    correct: 'ENKRIPSI : PENYADAPAN',
    distractors: ['ANTIVIRUS : KOMPUTER', 'KATA SANDI : PENGGUNA', 'FIREWALL : INTERNET', 'BACKUP : HARDDISK'],
    rel: 'Imunitas adalah mekanisme perlindungan terhadap ancaman penyakit; enkripsi adalah mekanisme perlindungan data terhadap ancaman penyadapan.',
    trick: 'Pastikan sisi kanan adalah [Ancaman/Risiko], bukan [Objek yang Dilindungi]! Komputer, pengguna, dan harddisk bukan ancaman.',
  },
  {
    stem: 'PROTOTIPE : PRODUKSI MASSAL = ... : ...',
    correct: 'RANCANGAN UNDANG-UNDANG : UNDANG-UNDANG',
    distractors: ['ARSIP : DOKUMEN', 'PRODUK : PABRIK', 'LAPORAN : PENELITIAN', 'REVISI : PENERBITAN'],
    rel: 'Prototipe adalah model awal uji coba sebelum masuk tahap produksi massal resmi; RUU adalah draf awal pembahasan sebelum disahkan menjadi undang-undang.',
    trick: 'Pola [Versi Awal/Draf Uji] → [Versi Final Resmi].',
  },
  {
    stem: 'OASE : GURUN = ... : ...',
    correct: 'PULAU : SAMUDRA',
    distractors: ['GUNUNG : LEMBAH', 'SUNGAI : MUARA', 'AWAN : LANGIT', 'HUTAN : BUKIT'],
    rel: 'Oase adalah wilayah kecil berair/subur yang dikelilingi hamparan luas gurun; pulau adalah wilayah daratan yang dikelilingi hamparan luas samudra.',
    trick: 'Pola [Entitas Kontras Terisolasi] di tengah [Hamparan Luas Lawan Elemennya] (air di tengah darat ↔ darat di tengah air).',
  },
  {
    stem: 'INDOKTRINASI : KRITIS = ... : ...',
    correct: 'SENSOR : KEBEBASAN PERS',
    distractors: ['EDUKASI : PENGETAHUAN', 'DISKUSI : GAGASAN', 'PENELITIAN : INOVASI', 'PELATIHAN : KETERAMPILAN'],
    rel: 'Indoktrinasi menekan/menghambat berkembangnya sikap kritis; sensor menekan/menghambat berkembangnya kebebasan pers.',
    trick: 'Cek pola penghambatan [Tindakan Represif] menekan [Nilai Positif]. Keempat pengecoh bersifat mendorong, bukan menekan.',
  },
  {
    stem: 'KOMPAS : NAVIGASI = ... : ...',
    correct: 'STETOSKOP : AUSKULTASI',
    distractors: ['OBENG : PERABOT', 'PENA : KERTAS', 'PALU : KAYU', 'PISAU : DAPUR'],
    rel: 'Kompas adalah alat khusus yang digunakan untuk prosedur navigasi; stetoskop adalah alat khusus yang digunakan untuk prosedur auskultasi (mendengarkan bunyi organ dalam).',
    trick: 'Pola [Instrumen Spesifik] : [Nama Prosedur/Aktivitas Teknis]. Eliminasi alat-benda atau alat-lokasi.',
  },
  {
    stem: 'DEFISIT : SURPLUS = ... : ...',
    correct: 'RUGI : LABA',
    distractors: ['ANGGARAN : BELANJA', 'EKSPOR : DEVISA', 'MODAL : INVESTASI', 'PAJAK : PENDAPATAN'],
    rel: 'Defisit (kekurangan/selisih negatif) dan surplus (kelebihan/selisih positif) adalah dua kutub berlawanan dalam neraca; rugi (selisih negatif) dan laba (selisih positif) adalah dua kutub berlawanan dalam laporan keuangan.',
    trick: 'Cari pasangan [Kutub Negatif : Kutub Positif] yang merupakan antonim mutlak keuangan. Empat pengecoh adalah pasangan komponen searah.',
  },
  {
    stem: 'PARADIGMA : CARA PANDANG = ... : ...',
    correct: 'AKSIOMA : KEBENARAN DASAR',
    distractors: ['DOKTRIN : KERAGUAN', 'HIPOTESIS : KEPASTIAN', 'ANOMALI : KEWAJARAN', 'PARADOKS : KESELARASAN'],
    rel: 'Paradigma secara definisional berarti kerangka cara pandang; aksioma secara definisional berarti pernyataan kebenaran dasar yang diterima tanpa pembuktian.',
    trick: 'Cek hubungan definisi/sinonim tepat. Keempat pengecoh justru berlawanan makna (anomali ≠ kewajaran, hipotesis ≠ kepastian).',
  },
  {
    stem: 'BENDUNGAN : IRIGASI = ... : ...',
    correct: 'GARDU INDUK : DISTRIBUSI LISTRIK',
    distractors: ['JEMBATAN : SUNGAI', 'TEROWONGAN : GUNUNG', 'MERCUSUAR : PANTAI', 'MENARA : SINYAL RUSAK'],
    rel: 'Bendungan adalah infrastruktur pengatur cadangan untuk mendukung sistem irigasi; gardu induk adalah infrastruktur pengatur tegangan untuk mendukung distribusi listrik.',
    trick: 'Pola [Infrastruktur Pengatur] : [Fungsi Layanan Distribusi]. Eliminasi infrastruktur yang hanya dipasangkan dengan kenampakan alamnya.',
  },
  {
    stem: 'SANKSI ADMINISTRATIF : MALADMINISTRASI = ... : ...',
    correct: 'KARTU MERAH : PELANGGARAN BERAT',
    distractors: ['MEDALI EMAS : KEJUARAAN', 'BEASISWA : PRESTASI', 'PROMOSI : KINERJA', 'BONUS : TARGET'],
    rel: 'Sanksi administratif dijatuhkan sebagai konsekuensi atas tindakan maladministrasi; kartu merah dijatuhkan sebagai konsekuensi atas pelanggaran berat.',
    trick: 'Pola [Hukuman Resmi] : [Pelanggaran Penyebabnya]. Keempat pengecoh adalah penghargaan atas prestasi!',
  },
];

// ============================================================================
// 2. KEMAMPUAN VERBAL - SILOGISME & PENALARAN LOGIS (30 SOAL HOTS)
// ============================================================================
interface LogicSpec {
  pertanyaan: string;
  correct: string;
  distractors: [string, string, string, string];
  metode1: string;
  metode2: string;
}

const SYLLOGISM_SPECS: LogicSpec[] = [
  {
    pertanyaan:
      'Premis 1: Semua ASN yang bertugas di unit pelayanan terpadu wajib mengikuti pelatihan keamanan siber.\nPremis 2: Sebagian pegawai yang mengikuti pelatihan keamanan siber menerima sertifikasi auditor internal.\nPremis 3: Raka adalah ASN di unit pelayanan terpadu.\nKesimpulan yang pasti benar adalah...',
    correct: 'Raka wajib mengikuti pelatihan keamanan siber.',
    distractors: [
      'Raka pasti menerima sertifikasi auditor internal.',
      'Semua ASN unit pelayanan terpadu menerima sertifikasi auditor internal.',
      'Sebagian ASN unit pelayanan terpadu tidak mengikuti pelatihan keamanan siber.',
      'Raka tidak mungkin menerima sertifikasi auditor internal.',
    ],
    metode1: 'Misal A = ASN pelayanan terpadu, B = wajib pelatihan siber, C = sertifikasi auditor. Diketahui A → B dan Raka ∈ A, maka dengan Modus Ponens Raka ∈ B. Hubungan B dengan C hanya kuantor "sebagian", sehingga tidak dapat disimpulkan apakah Raka ∈ C.',
    metode2: 'Aturan emas silogisme: premis "sebagian" TIDAK boleh memaksa kesimpulan pasti tentang individu spesifik. Langsung eliminasi semua opsi yang menyebut kepastian sertifikasi Raka.',
  },
  {
    pertanyaan:
      'Premis 1: Jika anggaran daerah disahkan tepat waktu, maka proyek infrastruktur dimulai pada triwulan pertama.\nPremis 2: Jika proyek infrastruktur dimulai pada triwulan pertama, maka serapan anggaran semester I melampaui 50%.\nPremis 3: Serapan anggaran semester I tidak melampaui 50%.\nKesimpulan yang sah adalah...',
    correct: 'Anggaran daerah tidak disahkan tepat waktu.',
    distractors: [
      'Anggaran daerah disahkan tepat waktu tetapi proyek tertunda.',
      'Proyek infrastruktur tetap dimulai pada triwulan pertama.',
      'Sebagian anggaran daerah disahkan tepat waktu.',
      'Serapan anggaran semester II pasti melampaui 50%.',
    ],
    metode1: 'P → Q dan Q → R menghasilkan silogisme hipotetis P → R. Diketahui ~R (serapan tidak melampaui 50%). Dengan Modus Tollens (P → R, ~R ⊢ ~P), maka ~P pasti benar: anggaran daerah tidak disahkan tepat waktu.',
    metode2: 'Rantai implikasi P → Q → R: jika ujung kanan salah (~R), semua mata rantai di kirinya ikut salah (~Q dan ~P). Cari langsung negasi premis paling awal!',
  },
  {
    pertanyaan:
      'Premis 1: Semua arsip strategis negara disimpan di ruang berkode akses ganda.\nPremis 2: Tidak ada dokumen yang disimpan di ruang berkode akses ganda boleh difotokopi tanpa izin kepala biro.\nKesimpulan yang pasti benar adalah...',
    correct: 'Tidak ada arsip strategis negara yang boleh difotokopi tanpa izin kepala biro.',
    distractors: [
      'Sebagian arsip strategis negara boleh difotokopi tanpa izin kepala biro.',
      'Semua dokumen yang meminta izin kepala biro adalah arsip strategis negara.',
      'Dokumen di luar ruang berkode akses ganda pasti arsip strategis negara.',
      'Hanya kepala biro yang boleh membaca arsip strategis negara.',
    ],
    metode1: 'Semua A adalah B (arsip strategis → ruang akses ganda). Semua B adalah ~C (tidak boleh difotokopi tanpa izin). Secara transitif, semua A adalah ~C.',
    metode2: 'Coret frasa tengah yang berulang ("disimpan di ruang berkode akses ganda") lalu gabungkan awal Premis 1 + akhir Premis 2: Semua arsip strategis tidak boleh difotokopi tanpa izin kepala biro.',
  },
  {
    pertanyaan:
      'Premis 1: Peserta seleksi CPNS dinyatakan lulus SKD jika dan hanya jika memenuhi nilai ambang batas TWK, TIU, dan TKP sekaligus.\nPremis 2: Nadia memperoleh nilai TWK dan TIU jauh di atas ambang batas, tetapi nilai TKP-nya berada di bawah ambang batas.\nKesimpulan yang pasti benar adalah...',
    correct: 'Nadia tidak dinyatakan lulus SKD.',
    distractors: [
      'Nadia lulus SKD karena total skornya tinggi.',
      'Nadia lulus SKD dengan catatan perbaikan TKP.',
      'Nadia dapat mengikuti SKB jika kuota masih tersedia.',
      'Tidak dapat disimpulkan kelulusan Nadia.',
    ],
    metode1: 'Syarat kelulusan berbentuk konjungsi (TWK ∧ TIU ∧ TKP). Dalam logika proposisional, jika salah satu komponen konjungsi bernilai salah (TKP salah), maka keseluruhan konjungsi bernilai salah sehingga Nadia tidak lulus SKD.',
    metode2: 'Kata kunci "dan sekaligus" = syarat kumulatif (AND). Satu gagal = seluruh syarat gugur. Abaikan distraktor "total skor tinggi".',
  },
  {
    pertanyaan:
      'Pernyataan: "Jika sistem server utama mengalami gangguan, maka layanan publik dialihkan ke server cadangan atau antrean diproses secara manual."\nPernyataan yang secara logis EKUIVALEN dengan pernyataan di atas adalah...',
    correct: 'Jika layanan publik tidak dialihkan ke server cadangan dan antrean tidak diproses secara manual, maka sistem server utama tidak mengalami gangguan.',
    distractors: [
      'Jika sistem server utama tidak mengalami gangguan, maka layanan publik tidak dialihkan ke server cadangan.',
      'Jika layanan publik dialihkan ke server cadangan, maka sistem server utama pasti mengalami gangguan.',
      'Jika layanan publik tidak dialihkan ke server cadangan atau antrean tidak diproses secara manual, maka server utama normal.',
      'Sistem server utama mengalami gangguan dan layanan tidak dialihkan ke server cadangan.',
    ],
    metode1: 'Bentuk awal: P → (Q ∨ R). Kontraposisi yang ekuivalen adalah ~(Q ∨ R) → ~P. Dengan hukum De Morgan, ~(Q ∨ R) ≡ (~Q ∧ ~R). Jadi ekuivalennya: (~Q ∧ ~R) → ~P.',
    metode2: 'Trik Kontraposisi + De Morgan: balik arah implikasi, negasikan kedua sisi, dan UBAH "atau" menjadi "dan". Opsi dengan kata "atau" pada hasil negasi langsung gugur!',
  },
  {
    pertanyaan:
      'Premis 1: Semua peserta diklat kepemimpinan harus menyusun proyek perubahan atau menulis kajian kebijakan.\nPremis 2: Bagas adalah peserta diklat kepemimpinan yang tidak menulis kajian kebijakan.\nKesimpulan yang pasti benar adalah...',
    correct: 'Bagas menyusun proyek perubahan.',
    distractors: [
      'Bagas tidak lulus diklat kepemimpinan.',
      'Bagas menyusun proyek perubahan dan menulis kajian kebijakan.',
      'Sebagian peserta diklat tidak menyusun proyek perubahan.',
      'Bagas boleh memilih untuk tidak mengerjakan keduanya.',
    ],
    metode1: 'Untuk semua peserta diklat berlaku (P ∨ Q). Karena Bagas adalah peserta diklat dan berlaku ~Q (tidak menulis kajian kebijakan), dengan Silogisme Disjungtif (P ∨ Q, ~Q ⊢ P) diperoleh P: Bagas menyusun proyek perubahan.',
    metode2: 'Rumus cepat "A atau B, ternyata bukan B" → pasti A! Fokus pada dua pilihan disjungsi.',
  },
  {
    pertanyaan:
      'Premis 1: Sebagian pegawai bidang data menguasai bahasa Python.\nPremis 2: Semua pegawai yang menguasai bahasa Python mampu membangun skrip otomasi laporan.\nKesimpulan yang pasti benar adalah...',
    correct: 'Sebagian pegawai bidang data mampu membangun skrip otomasi laporan.',
    distractors: [
      'Semua pegawai bidang data mampu membangun skrip otomasi laporan.',
      'Semua pegawai yang membangun skrip otomasi adalah pegawai bidang data.',
      'Sebagian pegawai bidang data tidak mampu membangun skrip otomasi laporan.',
      'Tidak ada pegawai di luar bidang data yang menguasai Python.',
    ],
    metode1: 'Terdapat x ∈ Data sehingga x ∈ Python. Karena setiap x ∈ Python juga x ∈ Otomasi, maka pasti terdapat x ∈ Data yang juga x ∈ Otomasi (Sebagian pegawai bidang data mampu membangun skrip otomasi).',
    metode2: 'Aturan kuantor: "Sebagian" + "Semua" selalu menghasilkan kesimpulan "Sebagian" (bukan "Semua"), dan tidak otomatis menyimpulkan "sebagian tidak".',
  },
  {
    pertanyaan:
      'Ingkaran (negasi) yang tepat dari pernyataan: "Semua kepala seksi hadir tepat waktu dan menandatangani pakta integritas" adalah...',
    correct: 'Ada kepala seksi yang tidak hadir tepat waktu atau tidak menandatangani pakta integritas.',
    distractors: [
      'Semua kepala seksi tidak hadir tepat waktu dan tidak menandatangani pakta integritas.',
      'Tidak ada kepala seksi yang hadir tepat waktu atau menandatangani pakta integritas.',
      'Ada kepala seksi yang tidak hadir tepat waktu dan tidak menandatangani pakta integritas.',
      'Semua kepala seksi hadir tepat waktu tetapi tidak menandatangani pakta integritas.',
    ],
    metode1: 'Negasi kuantor universal ∀x (P(x) ∧ Q(x)) adalah ∃x ~(P(x) ∧ Q(x)). Menurut hukum De Morgan, ~(P ∧ Q) ≡ (~P ∨ ~Q). Jadi: Ada kepala seksi yang tidak hadir tepat waktu ATAU tidak menandatangani pakta integritas.',
    metode2: 'Trik 3 langkah negasi cepat: (1) "Semua" → "Ada/Sebagian", (2) "dan" → "atau", (3) negasikan kedua predikat. Langsung kunci jawaban dalam 10 detik!',
  },
  {
    pertanyaan:
      'Premis 1: Jika kualitas jaringan internet stabil, maka rapat koordinasi dilaksanakan secara daring.\nPremis 2: Jika rapat koordinasi tidak dilaksanakan secara daring, maka seluruh kepala dinas hadir di aula utama.\nPremis 3: Tidak semua kepala dinas hadir di aula utama.\nKesimpulan yang pasti benar adalah...',
    correct: 'Rapat koordinasi dilaksanakan secara daring.',
    distractors: [
      'Kualitas jaringan internet pasti stabil.',
      'Kualitas jaringan internet tidak stabil.',
      'Sebagian kepala dinas mengikuti rapat di aula utama dan lainnya daring.',
      'Rapat koordinasi dibatalkan seluruhnya.',
    ],
    metode1: 'Premis 2: ~Q → R. Premis 3: ~R (negasi dari "seluruh hadir" adalah "tidak semua hadir"). Dengan Modus Tollens pada Premis 2 & 3, diperoleh ~(~Q) ≡ Q (rapat dilaksanakan secara daring). Perhatikan: dari P → Q dan Q, TIDAK sah menyimpulkan P (fallacy affirming the consequent).',
    metode2: 'Waspadai jebakan "Q benar → P benar" (itu keliru!). Cukup terapkan Tollens pada Premis 2 & 3: ~R memaksa Q benar, berhenti sampai di situ.',
  },
  {
    pertanyaan:
      'Premis 1: Semua berkas pengadaan di atas Rp200 juta wajib melalui lelang terbuka.\nPremis 2: Berkas pengadaan X tidak melalui lelang terbuka.\nPremis 3: Semua berkas pengadaan yang tidak melalui lelang terbuka dicatat dalam daftar pengadaan langsung.\nKesimpulan yang sah adalah...',
    correct: 'Berkas pengadaan X bernilai tidak lebih dari Rp200 juta dan dicatat dalam daftar pengadaan langsung.',
    distractors: [
      'Berkas pengadaan X bernilai di atas Rp200 juta dan dicatat dalam daftar pengadaan langsung.',
      'Berkas pengadaan X tidak dicatat dalam daftar pengadaan langsung.',
      'Semua berkas pengadaan langsung bernilai tepat Rp200 juta.',
      'Berkas pengadaan X melanggar ketentuan lelang terbuka.',
    ],
    metode1: 'Premis 1: (>200 jt) → Lelang. Premis 2: X ∈ ~Lelang. Dengan Tollens, X bukan >200 jt (berarti ≤ Rp200 juta). Dari Premis 3 (~Lelang → Daftar Langsung), X juga tercatat dalam daftar pengadaan langsung.',
    metode2: 'Gabungkan dua konsekuensi langsung dari fakta "X tidak lelang": (1) lawan dari >200 jt adalah ≤200 jt, dan (2) masuk daftar pengadaan langsung.',
  },
  {
    pertanyaan:
      'Premis 1: Tidak ada pegawai honorer yang berhak menandatangani surat keputusan mutasi.\nPremis 2: Sebagian anggota tim administrasi kepegawaian adalah pegawai honorer.\nKesimpulan yang pasti benar adalah...',
    correct: 'Sebagian anggota tim administrasi kepegawaian tidak berhak menandatangani surat keputusan mutasi.',
    distractors: [
      'Semua anggota tim administrasi kepegawaian tidak berhak menandatangani surat keputusan mutasi.',
      'Sebagian anggota tim administrasi kepegawaian berhak menandatangani surat keputusan mutasi.',
      'Semua yang berhak menandatangani surat keputusan mutasi adalah anggota tim administrasi.',
      'Tidak ada anggota tim administrasi kepegawaian yang merupakan ASN.',
    ],
    metode1: 'Ada x ∈ Tim sehingga x ∈ Honorer. Karena setiap Honorer ∈ ~Berhak, maka x tersebut pasti ∈ ~Berhak. Jadi sebagian anggota tim tidak berhak menandatangani SK mutasi.',
    metode2: 'Kaidah silogisme: "Sebagian A adalah B" + "Tidak ada B yang C" → "Sebagian A bukan C". Hindari menyimpulkan tentang sisa bagian lainnya.',
  },
  {
    pertanyaan:
      'Premis 1: Hanya instansi dengan indeks SPBE minimal 3,5 yang memperoleh predikat "Sangat Baik".\nPremis 2: Instansi M memperoleh predikat "Sangat Baik".\nPremis 3: Semua instansi berindeks SPBE minimal 3,5 telah mengintegrasikan layanan tanda tangan elektronik.\nKesimpulan yang pasti benar adalah...',
    correct: 'Instansi M telah mengintegrasikan layanan tanda tangan elektronik.',
    distractors: [
      'Semua instansi yang mengintegrasikan tanda tangan elektronik memperoleh predikat "Sangat Baik".',
      'Instansi M memiliki indeks SPBE tepat 3,5.',
      'Instansi yang tidak berpredikat "Sangat Baik" pasti belum mengintegrasikan tanda tangan elektronik.',
      'Predikat "Sangat Baik" hanya ditentukan oleh tanda tangan elektronik.',
    ],
    metode1: '"Hanya A yang B" secara logis ekuivalen dengan B → A (Predikat Sangat Baik → SPBE ≥ 3,5). Premis 3: (SPBE ≥ 3,5) → TTE. Karena M berpredikat Sangat Baik, maka M ber-SPBE ≥ 3,5, sehingga M telah mengintegrasikan TTE.',
    metode2: 'Ingat terjemahan jebakan BKN: "Hanya X yang Y" = "Jika Y maka X" (BUKAN Jika X maka Y!). Lalu sambungkan rantai M → SPBE ≥ 3,5 → TTE.',
  },
  {
    pertanyaan:
      'Premis 1: Jika curah hujan di hulu tinggi dan pintu air tidak dibuka bertahap, maka debit sungai hilir melampaui batas siaga.\nPremis 2: Debit sungai hilir tidak melampaui batas siaga.\nPremis 3: Curah hujan di hulu tinggi.\nKesimpulan yang pasti benar adalah...',
    correct: 'Pintu air dibuka bertahap.',
    distractors: [
      'Pintu air tidak dibuka bertahap.',
      'Curah hujan di hulu sebenarnya tidak tinggi.',
      'Debit sungai hilir akan melampaui batas siaga esok hari.',
      'Pintu air ditutup sepenuhnya sepanjang hari.',
    ],
    metode1: 'Premis 1: (H ∧ ~B) → M. Premis 2: ~M. Dengan Tollens diperoleh ~(H ∧ ~B) ≡ (~H ∨ B). Karena Premis 3 menyatakan H benar (~H salah), dengan Silogisme Disjungtif diperoleh B: pintu air dibuka bertahap.',
    metode2: 'Agar akibat M tidak terjadi padahal syarat H sudah terpenuhi, syarat kedua (~B) WAJIB gagal → berarti B benar (pintu air dibuka bertahap)!',
  },
  {
    pertanyaan:
      'Premis 1: Semua dokter spesialis di RSUD daerah X telah memiliki Surat Izin Praktik aktif.\nPremis 2: Sebagian tenaga medis di RSUD daerah X adalah dokter spesialis.\nPremis 3: Beberapa pemegang Surat Izin Praktik aktif di RSUD daerah X juga mengajar di fakultas kedokteran.\nKesimpulan yang pasti benar adalah...',
    correct: 'Sebagian tenaga medis di RSUD daerah X memiliki Surat Izin Praktik aktif.',
    distractors: [
      'Semua tenaga medis di RSUD daerah X memiliki Surat Izin Praktik aktif.',
      'Sebagian dokter spesialis di RSUD daerah X pasti mengajar di fakultas kedokteran.',
      'Semua pengajar fakultas kedokteran adalah dokter spesialis RSUD daerah X.',
      'Tidak ada tenaga medis non-spesialis yang memiliki Surat Izin Praktik aktif.',
    ],
    metode1: 'Dari Premis 2 (sebagian Tenaga Medis = Spesialis) dan Premis 1 (semua Spesialis = punya SIP), pasti benar bahwa sebagian Tenaga Medis memiliki SIP aktif. Premis 3 hanya menyebut "beberapa pemegang SIP", yang bisa saja bukan dari kelompok spesialis.',
    metode2: 'Premis 3 adalah distraktor kuantor ganda ("sebagian" ketemu "beberapa" tidak bisa disambungkan!). Fokus pada Premis 1 + Premis 2 saja.',
  },
  {
    pertanyaan:
      'Premis 1: Setiap pelamar yang lolos verifikasi administrasi berhak mencetak kartu ujian.\nPremis 2: Sebagian pelamar yang berhak mencetak kartu ujian memilih lokasi tes di luar provinsi domisili.\nPremis 3: Dimas tidak berhak mencetak kartu ujian.\nKesimpulan yang pasti benar adalah...',
    correct: 'Dimas tidak lolos verifikasi administrasi.',
    distractors: [
      'Dimas memilih lokasi tes di dalam provinsi domisili.',
      'Dimas lolos verifikasi administrasi tetapi lupa mencetak kartu.',
      'Sebagian pelamar yang tidak lolos verifikasi tetap memilih lokasi tes.',
      'Dimas pasti mendaftar di luar provinsi domisili.',
    ],
    metode1: 'Premis 1: Lolos → Cetak Kartu. Premis 3: Dimas ∈ ~Cetak Kartu. Dengan Modus Tollens, Dimas ∈ ~Lolos (tidak lolos verifikasi administrasi).',
    metode2: 'Abaikan Premis 2 yang tidak relevan dengan Dimas. Langsung pakai Tollens Premis 1 + 3.',
  },
  {
    pertanyaan:
      'Premis 1: Jika suatu kebijakan publik tidak melalui uji publik, maka tingkat penolakan masyarakat meningkat.\nPremis 2: Kebijakan penataan parkir melalui uji publik atau tingkat penolakan masyarakat tidak meningkat.\nFakta: Tingkat penolakan masyarakat terhadap kebijakan penataan parkir meningkat.\nKesimpulan yang pasti benar adalah...',
    correct: 'Kebijakan penataan parkir melalui uji publik.',
    distractors: [
      'Kebijakan penataan parkir tidak melalui uji publik.',
      'Uji publik tidak berpengaruh terhadap penolakan masyarakat.',
      'Semua kebijakan yang melalui uji publik pasti ditolak masyarakat.',
      'Tidak dapat ditarik kesimpulan yang sah.',
    ],
    metode1: 'Premis 2 berbentuk (U ∨ ~T). Fakta menyatakan T benar, sehingga ~T salah. Dengan Silogisme Disjungtif (U ∨ ~T, T ⊢ U), maka U pasti benar: kebijakan penataan parkir melalui uji publik. (Premis 1: ~U → T tetap konsisten karena U → T atau U ∧ T tidak melanggar implikasi ~U → T).',
    metode2: 'Gunakan Premis 2 ("A atau bukan B") bersama fakta "B terjadi" → bukan B salah → maka A pasti benar!',
  },
  {
    pertanyaan:
      'Premis 1: Semua perangkat desa yang mengikuti bimbingan teknis keuangan mampu menyusun APBDes berbasis aplikasi.\nPremis 2: Tidak ada perangkat desa di Kecamatan Utara yang mampu menyusun APBDes berbasis aplikasi.\nKesimpulan yang pasti benar adalah...',
    correct: 'Tidak ada perangkat desa di Kecamatan Utara yang mengikuti bimbingan teknis keuangan.',
    distractors: [
      'Sebagian perangkat desa di Kecamatan Utara mengikuti bimbingan teknis keuangan.',
      'Semua perangkat desa di luar Kecamatan Utara mengikuti bimbingan teknis keuangan.',
      'Perangkat desa di Kecamatan Utara tidak memiliki komputer.',
      'Sebagian perangkat desa yang mengikuti bimbingan teknis berasal dari Kecamatan Utara.',
    ],
    metode1: 'Premis 1: Bimtek → Mampu. Kontraposisinya: ~Mampu → ~Bimtek. Premis 2: semua perangkat Kec. Utara ∈ ~Mampu. Maka semua perangkat Kec. Utara ∈ ~Bimtek.',
    metode2: 'Jika syarat "ikut bimtek" pasti bikin "mampu", sementara di Kec. Utara nol orang yang mampu, berarti nol orang juga yang ikut bimtek!',
  },
  {
    pertanyaan:
      'Pernyataan: "Tidak benar bahwa jika inflasi pangan terkendali maka subsidi energi dihapus."\nPernyataan yang secara logis EKUIVALEN dengan pernyataan tersebut adalah...',
    correct: 'Inflasi pangan terkendali dan subsidi energi tidak dihapus.',
    distractors: [
      'Jika inflasi pangan tidak terkendali maka subsidi energi tidak dihapus.',
      'Inflasi pangan tidak terkendali atau subsidi energi dihapus.',
      'Inflasi pangan tidak terkendali dan subsidi energi dihapus.',
      'Jika subsidi energi dihapus maka inflasi pangan terkendali.',
    ],
    metode1: 'Rumus negasi implikasi: ~(P → Q) ≡ (P ∧ ~Q). Dengan P = "inflasi pangan terkendali" dan Q = "subsidi energi dihapus", diperoleh: "Inflasi pangan terkendali dan subsidi energi tidak dihapus."',
    metode2: 'Hafalan wajib TIU Logika: negasi "Jika P maka Q" BUKAN kalimat "Jika...", melainkan "P dan bukan Q"!',
  },
  {
    pertanyaan:
      'Premis 1: Semua inovasi pelayanan publik yang masuk Top 45 Nasional memiliki replikasi di minimal dua daerah lain.\nPremis 2: Aplikasi SiCepat tidak memiliki replikasi di daerah lain.\nPremis 3: Semua aplikasi di Dinas Perhubungan telah diaudit keamanannya.\nKesimpulan yang pasti benar jika Aplikasi SiCepat milik Dinas Perhubungan adalah...',
    correct: 'Aplikasi SiCepat telah diaudit keamanannya tetapi tidak masuk Top 45 Nasional.',
    distractors: [
      'Aplikasi SiCepat masuk Top 45 Nasional karena telah diaudit keamanannya.',
      'Aplikasi SiCepat belum diaudit keamanannya dan tidak masuk Top 45 Nasional.',
      'Semua aplikasi yang diaudit keamanannya masuk Top 45 Nasional.',
      'Aplikasi SiCepat sedang direplikasi di satu daerah lain.',
    ],
    metode1: 'Dari Premis 1 (Top45 → Replikasi ≥ 2) dan Premis 2 (~Replikasi), dengan Tollens diperoleh SiCepat bukan Top 45 Nasional. Dari Premis 3 (Dishub → Diaudit) dan fakta SiCepat milik Dishub, diperoleh SiCepat telah diaudit keamanannya.',
    metode2: 'Cek dua atribut SiCepat secara terpisah: (1) gagal syarat replikasi → bukan Top 45; (2) milik Dishub → sudah diaudit. Gabungkan keduanya.',
  },
  {
    pertanyaan:
      'Premis 1: Jika peserta datang terlambat lebih dari 15 menit, maka panitia membatalkan hak ikut ujian.\nPremis 2: Jika hak ikut ujian dibatalkan, maka peserta tidak memperoleh sertifikat nilai CAT.\nPremis 3: Jika peserta tidak memperoleh sertifikat nilai CAT, maka peserta tidak dapat mendaftar tahap berikutnya.\nPremis 4: Tono dapat mendaftar tahap berikutnya.\nKesimpulan yang pasti benar adalah...',
    correct: 'Tono tidak datang terlambat lebih dari 15 menit.',
    distractors: [
      'Tono datang tepat 15 menit setelah ujian dimulai.',
      'Hak ikut ujian Tono sempat dibatalkan lalu dipulihkan.',
      'Tono pasti lolos tahap berikutnya.',
      'Tono tidak mengikuti ujian tetapi memperoleh sertifikat.',
    ],
    metode1: 'Rantai implikasi: Terlambat >15m → Batal → ~Sertifikat → ~Daftar. Fakta: Tono Daftar (negasi ujung kanan). Dengan Modus Tollens berantai: Tono punya sertifikat → tidak batal → tidak terlambat >15 menit.',
    metode2: 'Domino terbalik (Tollens berantai): ujung kanan tercapai → ujung kiri pasti tidak terjadi. Jangan tertipu opsi "tepat 15 menit" (tidak pasti).',
  },
  {
    pertanyaan:
      'Premis 1: Setiap arsiparis ahli muda menguasai katalogisasi digital dan pelestarian dokumen fisik.\nPremis 2: Sebagian pegawai di Biro Umum adalah arsiparis ahli muda.\nKesimpulan yang pasti benar adalah...',
    correct: 'Sebagian pegawai di Biro Umum menguasai katalogisasi digital dan pelestarian dokumen fisik.',
    distractors: [
      'Semua pegawai di Biro Umum menguasai katalogisasi digital.',
      'Sebagian arsiparis ahli muda tidak menguasai pelestarian dokumen fisik.',
      'Pegawai Biro Umum yang bukan arsiparis ahli muda tidak menguasai katalogisasi digital.',
      'Hanya arsiparis ahli muda yang bekerja di Biro Umum.',
    ],
    metode1: 'Ada x ∈ Biro Umum dengan x ∈ Arsiparis Muda. Karena setiap Arsiparis Muda menguasai (Katalog ∧ Pelestarian), maka sebagian pegawai Biro Umum menguasai keduanya.',
    metode2: 'Pertahankan kuantor "Sebagian" dan jangan menambahkan klaim negatif tentang pegawai yang bukan arsiparis.',
  },
  {
    pertanyaan:
      'Premis 1: Apabila tarif tol naik atau harga BBM naik, maka biaya logistik meningkat.\nPremis 2: Biaya logistik tidak meningkat.\nKesimpulan yang pasti benar adalah...',
    correct: 'Tarif tol tidak naik dan harga BBM tidak naik.',
    distractors: [
      'Tarif tol tidak naik atau harga BBM tidak naik.',
      'Tarif tol naik tetapi harga BBM turun.',
      'Harga BBM naik tetapi tarif tol tetap.',
      'Tarif tol turun drastis.',
    ],
    metode1: 'Premis 1: (T ∨ B) → L. Premis 2: ~L. Dengan Tollens diperoleh ~(T ∨ B). Menurut hukum De Morgan, ~(T ∨ B) ≡ (~T ∧ ~B): tarif tol tidak naik DAN harga BBM tidak naik.',
    metode2: 'Salah satu saja naik sudah bikin logistik naik. Karena logistik tidak naik, KEDUANYA wajib tidak naik (pakai "dan", bukan "atau").',
  },
  {
    pertanyaan:
      'Premis 1: Semua anggota tim audit investigatif harus bebas dari konflik kepentingan.\nPremis 2: Sebagian auditor senior di inspektorat adalah anggota tim audit investigatif.\nPremis 3: Fajar memiliki konflik kepentingan pada proyek yang diperiksa.\nKesimpulan yang pasti benar adalah...',
    correct: 'Fajar bukan anggota tim audit investigatif.',
    distractors: [
      'Fajar bukan auditor senior di inspektorat.',
      'Semua auditor senior bebas dari konflik kepentingan.',
      'Fajar tetap boleh menjadi anggota tim dengan pengawasan.',
      'Sebagian anggota tim audit investigatif memiliki konflik kepentingan.',
    ],
    metode1: 'Premis 1: Tim Investigatif → Bebas Konflik. Fakta: Fajar ∈ ~Bebas Konflik. Dengan Tollens: Fajar ∉ Tim Investigatif. Perhatikan bahwa Fajar masih mungkin seorang auditor senior (karena hanya sebagian auditor senior yang masuk tim investigatif).',
    metode2: 'Cek langsung Premis 1 + 3 via Tollens. Eliminasi jebakan "bukan auditor senior" karena kuantor Premis 2 hanyalah "sebagian".',
  },
  {
    pertanyaan:
      'Premis 1: Jika laporan kinerja dikirim sebelum tanggal 5, maka tunjangan kinerja cair pada pertengahan bulan.\nPremis 2: Laporan kinerja Unit A dikirim pada tanggal 7.\nKesimpulan yang paling tepat berdasarkan logika formal adalah...',
    correct: 'Tidak dapat disimpulkan secara pasti apakah tunjangan kinerja Unit A cair pada pertengahan bulan.',
    distractors: [
      'Tunjangan kinerja Unit A pasti tidak cair pada pertengahan bulan.',
      'Tunjangan kinerja Unit A tetap cair pada pertengahan bulan.',
      'Tunjangan kinerja Unit A dipotong sebesar 50%.',
      'Unit A tidak menerima tunjangan kinerja bulan tersebut.',
    ],
    metode1: 'Premis 1: P → Q (kirim < tgl 5 → cair pertengahan bulan). Premis 2: ~P (dikirim tgl 7). Dalam logika formal, dari P → Q dan ~P TIDAK SAH menyimpulkan ~Q (kesesatan Denying the Antecedent), karena bisa ada ketentuan lain yang tetap mencairkan tunjangan.',
    metode2: 'Waspadai jebakan klasik BKN! P → Q bersama ~P tidak menghasilkan kesimpulan pasti (berbeda dengan ~Q yang pasti menghasilkan ~P).',
  },
  {
    pertanyaan:
      'Premis 1: Semua peserta pelatihan analisis data membawa laptop atau tablet.\nPremis 2: Semua peserta yang membawa tablet wajib menginstal aplikasi statistik versi terbaru.\nPremis 3: Rani adalah peserta pelatihan analisis data yang tidak membawa laptop.\nKesimpulan yang pasti benar adalah...',
    correct: 'Rani wajib menginstal aplikasi statistik versi terbaru.',
    distractors: [
      'Rani tidak perlu menginstal aplikasi statistik versi terbaru.',
      'Rani membawa laptop dan tablet sekaligus.',
      'Semua peserta yang membawa laptop wajib menginstal aplikasi statistik.',
      'Rani tidak mengikuti pelatihan analisis data.',
    ],
    metode1: 'Rani peserta → (Laptop ∨ Tablet). Karena Rani ~Laptop, dengan Silogisme Disjungtif diperoleh Rani membawa Tablet. Dari Premis 2 (Tablet → Wajib Instal), diperoleh Rani wajib menginstal aplikasi statistik versi terbaru.',
    metode2: 'Gabungan 2 langkah cepat: Tidak bawa laptop → pasti bawa tablet → pasti wajib instal aplikasi statistik.',
  },
  {
    pertanyaan:
      'Premis 1: Tidak ada peraturan daerah yang boleh bertentangan dengan undang-undang di atasnya.\nPremis 2: Rancangan Perda Z bertentangan dengan undang-undang di atasnya.\nKesimpulan yang pasti benar adalah...',
    correct: 'Rancangan Perda Z tidak boleh disahkan sebagai peraturan daerah yang berlaku.',
    distractors: [
      'Undang-undang di atasnya harus diubah agar sesuai dengan Rancangan Perda Z.',
      'Rancangan Perda Z hanya berlaku di tingkat kecamatan.',
      'Sebagian pasal Rancangan Perda Z otomatis menjadi undang-undang.',
      'Semua rancangan perda bertentangan dengan undang-undang.',
    ],
    metode1: 'Premis 1: Perda Sah → ~Bertentangan UU. Premis 2: Rancangan Perda Z ∈ Bertentangan UU. Dengan Modus Tollens, Rancangan Perda Z tidak memenuhi syarat sebagai Perda yang sah.',
    metode2: 'Syarat mutlak Perda = tidak bertentangan UU. Karena Z bertentangan, maka Z gugur sebagai Perda sah.',
  },
  {
    pertanyaan:
      'Premis 1: Sebagian buku di perpustakaan instansi adalah referensi hukum administrasi.\nPremis 2: Semua buku referensi hukum administrasi memiliki kode klasifikasi 342.\nPremis 3: Tidak ada buku berkode klasifikasi 342 yang boleh dipinjam pulang.\nKesimpulan yang pasti benar adalah...',
    correct: 'Sebagian buku di perpustakaan instansi tidak boleh dipinjam pulang.',
    distractors: [
      'Semua buku di perpustakaan instansi tidak boleh dipinjam pulang.',
      'Semua buku yang tidak boleh dipinjam pulang berkode klasifikasi 342.',
      'Sebagian buku referensi hukum administrasi boleh dipinjam pulang.',
      'Tidak ada buku di perpustakaan instansi yang boleh dipinjam pulang.',
    ],
    metode1: 'Sebagian Buku ∈ Ref Hukum. Semua Ref Hukum ∈ Kode 342. Semua Kode 342 ∈ ~Boleh Dipinjam. Secara transitif, sebagian buku di perpustakaan instansi tidak boleh dipinjam pulang.',
    metode2: 'Rantai: Sebagian + Semua + Tidak Ada → hasil akhir berkuantor "Sebagian ... tidak ...". Langsung cocokkan polanya!',
  },
  {
    pertanyaan:
      'Premis 1: Jika gedung pelayanan dilengkapi jalur landai dan pemandu braille, maka gedung tersebut meraih kategori ramah disabilitas.\nPremis 2: Gedung Pelayanan B belum meraih kategori ramah disabilitas.\nKesimpulan yang pasti benar adalah...',
    correct: 'Gedung Pelayanan B tidak dilengkapi jalur landai atau tidak dilengkapi pemandu braille.',
    distractors: [
      'Gedung Pelayanan B tidak dilengkapi jalur landai dan tidak dilengkapi pemandu braille.',
      'Gedung Pelayanan B pasti tidak memiliki jalur landai.',
      'Gedung Pelayanan B pasti tidak memiliki pemandu braille.',
      'Gedung Pelayanan B tidak melayani masyarakat umum.',
    ],
    metode1: 'Premis 1: (J ∧ P) → R. Premis 2: ~R. Dengan Tollens diperoleh ~(J ∧ P). Menurut hukum De Morgan, ~(J ∧ P) ≡ (~J ∨ ~P): tidak dilengkapi jalur landai ATAU tidak dilengkapi pemandu braille (bisa salah satunya saja yang kurang, atau keduanya).',
    metode2: 'De Morgan: negasi "A dan B" adalah "bukan A ATAU bukan B"! Opsi yang memakai "dan" atau "pasti tidak memiliki A" terlalu kuat sehingga salah.',
  },
  {
    pertanyaan:
      'Premis 1: Semua penerima beasiswa tugas belajar wajib kembali mengabdi di instansi asal minimal 2n tahun.\nPremis 2: Sebagian analis kebijakan muda adalah penerima beasiswa tugas belajar.\nPremis 3: Semua pegawai yang kembali mengabdi di instansi asal berhak atas penyesuaian ijazah.\nKesimpulan yang pasti benar adalah...',
    correct: 'Sebagian analis kebijakan muda wajib kembali mengabdi minimal 2n tahun dan berhak atas penyesuaian ijazah saat kembali mengabdi.',
    distractors: [
      'Semua analis kebijakan muda berhak atas penyesuaian ijazah.',
      'Tidak ada pegawai selain analis kebijakan muda yang menerima beasiswa tugas belajar.',
      'Semua penerima penyesuaian ijazah adalah analis kebijakan muda.',
      'Sebagian penerima beasiswa tugas belajar tidak wajib kembali mengabdi.',
    ],
    metode1: 'Sebagian Analis ∈ Penerima Beasiswa → Wajib Kembali Mengabdi → Berhak Penyesuaian Ijazah. Jadi sebagian analis kebijakan muda memenuhi sifat gabungan tersebut.',
    metode2: 'Karena ada premis "Sebagian" di awal, eliminasi langsung semua opsi berkuantor "Semua" atau "Tidak ada".',
  },
  {
    pertanyaan:
      'Premis 1: Bila tingkat literasi digital meningkat, maka transaksi layanan non-tunai naik.\nPremis 2: Bila transaksi layanan non-tunai naik, maka risiko pungutan liar menurun.\nPremis 3: Risiko pungutan liar di wilayah K tidak menurun.\nKesimpulan yang sah adalah...',
    correct: 'Tingkat literasi digital di wilayah K tidak meningkat dan transaksi layanan non-tunai tidak naik.',
    distractors: [
      'Tingkat literasi digital meningkat tetapi transaksi non-tunai tetap.',
      'Transaksi layanan non-tunai naik tetapi risiko pungli tidak menurun.',
      'Literasi digital tidak berhubungan dengan pungutan liar.',
      'Risiko pungutan liar pasti meningkat dua kali lipat.',
    ],
    metode1: 'L → N dan N → ~P (dengan ~P = risiko pungli menurun). Diketahui ~(~P) (risiko pungli tidak menurun). Dengan Tollens dua langkah: ~N (transaksi non-tunai tidak naik) dan ~L (literasi digital tidak meningkat).',
    metode2: 'Rantai L → N → R. Karena R gagal, maka N dan L keduanya ikut gagal!',
  },
];

// ============================================================================
// 3. KEMAMPUAN VERBAL - PENALARAN ANALITIS (25 SOAL HOTS)
// ============================================================================
const ANALYTICAL_SPECS: LogicSpec[] = [
  {
    pertanyaan:
      'Lima peserta wawancara CPNS (Ani, Budi, Citra, Doni, dan Eka) menunggu giliran secara berurutan dari nomor 1 sampai 5:\n(1) Citra mendapat giliran tepat setelah Ani.\n(2) Doni mendapat giliran lebih awal daripada Eka, tetapi bukan urutan pertama.\n(3) Budi berada pada urutan terakhir.\n(4) Terdapat tepat satu peserta di antara Citra dan Eka.\nSiapakah yang mendapat giliran urutan ke-3?',
    correct: 'Doni',
    distractors: ['Ani', 'Citra', 'Eka', 'Budi'],
    metode1: 'Budi = 5. Pasangan (Ani, Citra) berurutan. Antara Citra dan Eka ada 1 orang, serta Eka < 5 dan Doni < Eka dengan Doni ≠ 1. Coba Ani=1, Citra=2 → antara 2 dan Eka ada 1 orang maka Eka=4 → tersisa kursi 3 untuk Doni (memenuhi Doni ≠ 1 dan Doni < Eka). Urutan tunggal: 1:Ani, 2:Citra, 3:Doni, 4:Eka, 5:Budi.',
    metode2: 'Kunci slot pasti dulu: [ _ , _ , _ , _ , Budi ]. Karena Doni ≠ 1 dan Doni < Eka, slot (Ani, Citra) wajib di 1-2 → Eka di 4 → Doni otomatis di 3!',
  },
  {
    pertanyaan:
      'Enam kepala bidang (P, Q, R, S, T, U) duduk melingkar menghadap meja bundar dengan 6 kursi berjarak sama:\n(1) P duduk tepat berhadapan dengan S.\n(2) Q duduk tepat di sebelah kanan P.\n(3) R duduk di antara Q dan S.\n(4) T tidak duduk di sebelah P.\nSiapakah yang duduk tepat di sebelah kiri P?',
    correct: 'U',
    distractors: ['T', 'R', 'Q', 'S'],
    metode1: 'Misal posisi jarum jam: P di jam 12, maka S di jam 6 (berhadapan). Kanan P (menghadap pusat = berlawanan jarum jam atau searah—konsisten): jika kanan P = jam 10 (Q), maka R di antara Q dan S = jam 8. Tersisa sisi kiri P yaitu jam 2 dan jam 4 untuk T dan U. Karena T tidak di sebelah P, maka T di jam 4 (sebelah S) dan U di jam 2 (tepat di sebelah kiri P).',
    metode2: 'Sisi kanan P sudah penuh oleh Q dan R menuju S. Tersisa 2 kursi di sisi kiri P untuk T & U. Karena T dilarang dekat P, otomatis U yang di sebelah kiri P!',
  },
  {
    pertanyaan:
      'Lima berkas proyek (A, B, C, D, E) diperiksa dari hari Senin sampai Jumat (satu berkas per hari):\n(1) Berkas B diperiksa tepat dua hari sebelum berkas D.\n(2) Berkas A diperiksa pada hari Rabu.\n(3) Berkas E diperiksa lebih awal daripada berkas C.\n(4) Berkas D tidak diperiksa pada hari Jumat.\nPada hari apakah berkas E diperiksa?',
    correct: 'Senin',
    distractors: ['Selasa', 'Rabu', 'Kamis', 'Jumat'],
    metode1: 'Slot: Sen(1), Sel(2), Rab(3)=A, Kam(4), Jum(5). Karena D = B + 2 dan D ≠ 5, serta A = 3: kemungkinan (B,D) hanyalah (2,4) karena (1,3) bentrok dengan A=3 dan (3,5) bentrok. Jadi B=Selasa, D=Kamis. Tersisa Senin(1) dan Jumat(5) untuk E dan C. Karena E < C, maka E=Senin dan C=Jumat.',
    metode2: 'Tulis [1, 2, A, 4, 5]. Pasangan jarak 2 (B,D) dengan D≠5 hanya bisa di (2,4)! Sisa slot (1,5) langsung diisi E=Senin, C=Jumat.',
  },
  {
    pertanyaan:
      'Nilai akhir SKD lima peserta (F, G, H, I, J) semuanya berbeda:\n(1) Nilai F lebih tinggi daripada G, tetapi lebih rendah daripada H.\n(2) Nilai I lebih tinggi daripada H.\n(3) Nilai J lebih tinggi daripada G, tetapi lebih rendah daripada F.\nUrutan peserta dari nilai TERTINGGI ke TERENDAH adalah...',
    correct: 'I – H – F – J – G',
    distractors: ['I – H – J – F – G', 'H – I – F – J – G', 'I – F – H – J – G', 'I – H – F – G – J'],
    metode1: 'Dari (1): H > F > G. Dari (2): I > H → I > H > F > G. Dari (3): F > J > G, sehingga J tersisip tepat antara F dan G. Urutan lengkap: I > H > F > J > G.',
    metode2: 'Cek ujung atas dan bawah dulu: I paling atas (eliminasi H di depan) dan G paling bawah (eliminasi J di belakang). Lalu cek F > J → langsung ketemu I–H–F–J–G.',
  },
  {
    pertanyaan:
      'Sebuah tim audit beranggotakan tepat 4 orang yang dipilih dari 6 auditor (K, L, M, N, O, P) dengan ketentuan:\n(1) Jika K dipilih, maka L tidak boleh dipilih.\n(2) M dan N harus selalu dipilih bersama atau keduanya tidak dipilih.\n(3) O wajib dipilih jika P tidak dipilih.\nJika K dan P keduanya terpilih dalam tim, siapakah dua anggota lainnya?',
    correct: 'M dan N',
    distractors: ['L dan O', 'M dan O', 'N dan O', 'L dan M'],
    metode1: 'Sudah terpilih: {K, P} (2 orang), butuh 2 orang lagi dari {L, M, N, O}. Syarat (1): karena K dipilih → L gugur. Tersisa kandidat {M, N, O}. Jika O dipilih, tersisa 1 slot yang tidak mungkin diisi M atau N karena M & N harus berpasangan (syarat 2). Maka O tidak dipilih, dan 2 slot diisi oleh {M, N}. Syarat (3) tetap aman karena P dipilih.',
    metode2: 'K masuk → L coret. Butuh 2 orang dari {M, N, O}. Karena M & N sepaket (2 orang), tidak mungkin mengambil O (1 orang + sisa 1 slot buntu). Pasti M dan N!',
  },
  {
    pertanyaan:
      'Gedung kantor memiliki 5 lantai (lantai 1 paling bawah hingga lantai 5 paling atas) yang ditempati unit Keuangan, Hukum, IT, Humas, dan Kepegawaian (satu unit per lantai):\n(1) Unit IT berada tepat satu lantai di atas Unit Humas.\n(2) Unit Keuangan berada di lantai paling bawah.\n(3) Unit Hukum tidak bersebelahan lantai dengan Unit Keuangan maupun Unit IT.\nDi lantai berapakah Unit Kepegawaian berada?',
    correct: 'Lantai 2',
    distractors: ['Lantai 1', 'Lantai 3', 'Lantai 4', 'Lantai 5'],
    metode1: 'Keuangan = 1. Hukum tidak bersebelahan dengan 1 (jadi Hukum ≠ 2). Blok (IT di atas Humas) bisa di (3,2), (4,3), atau (5,4). Jika (IT,Humas)=(5,4), maka Hukum tidak boleh di 4 (ditempati) dan boleh di 3; tunggu: IT=5, Humas=4, Hukum=3 → Kepegawaian=2 (cek syarat 3: Hukum(3) tidak bersebelahan dengan Keuangan(1) maupun IT(5)!). Coba (IT,Humas)=(4,3) → Hukum tidak boleh di 5 (sebelah IT=4) dan tidak boleh di 2 (sebelah Keuangan=1) → buntu! Coba (IT,Humas)=(3,2) → Hukum boleh di 5, Kepegawaian=4? Tunggu: cek (IT,Humas)=(3,2): Hukum=5 tidak sebelah Keuangan(1) maupun IT(3)! Agar tunggal, cek lagi! Benar: ada 2 kasus kalau belum dibatasi.',
    metode2: 'Mari periksa: pada soal ini kita harus pastikan jawaban benar-benar TUNGGAL!',
  },
];

// Let's fix Analytical #6 and write all 25 analytical specs with 100% mathematically unique solutions!
const VERIFIED_ANALYTICAL_SPECS: LogicSpec[] = [
  ANALYTICAL_SPECS[0],
  ANALYTICAL_SPECS[1],
  ANALYTICAL_SPECS[2],
  ANALYTICAL_SPECS[3],
  ANALYTICAL_SPECS[4],
  {
    pertanyaan:
      'Gedung kantor memiliki 5 lantai (lantai 1 terbawah hingga lantai 5 teratas) untuk unit Keuangan, Hukum, IT, Humas, dan Kepegawaian (1 unit per lantai):\n(1) Unit Keuangan berada di lantai 1.\n(2) Unit IT berada tepat satu lantai di atas Unit Humas.\n(3) Unit Hukum berada di lantai 5.\n(4) Unit IT tidak bersebelahan dengan Unit Hukum.\nDi lantai berapakah Unit Kepegawaian berada?',
    correct: 'Lantai 4',
    distractors: ['Lantai 1', 'Lantai 2', 'Lantai 3', 'Lantai 5'],
    metode1: 'Keuangan = 1, Hukum = 5. Blok (Humas, IT) harus menempati dua lantai berurutan di {2, 3, 4} dengan IT ≠ 4 (karena IT tidak bersebelahan dengan Hukum di lantai 5). Satu-satunya posisi valid adalah Humas = 2 dan IT = 3. Tersisa lantai 4 untuk Unit Kepegawaian.',
    metode2: 'Isi ujung dulu: [1:Keuangan, 2:_, 3:_, 4:_, 5:Hukum]. Karena IT ≠ 4, pasangan (Humas, IT) wajib di (2,3) → lantai 4 pasti Kepegawaian!',
  },
  {
    pertanyaan:
      'Empat kota (W, X, Y, Z) terhubung jalan satu arah sebagai berikut: dari W dapat langsung ke X atau Y; dari X hanya dapat langsung ke Z; dari Y dapat langsung ke X atau Z; dari Z tidak ada jalan kembali. Berapa banyak rute berbeda yang dapat ditempuh dari kota W menuju kota Z?',
    correct: '3 rute',
    distractors: ['2 rute', '4 rute', '5 rute', '6 rute'],
    metode1: 'Telusuri semua jalur dari W ke Z: (1) W → X → Z; (2) W → Y → Z; (3) W → Y → X → Z. Total terdapat tepat 3 rute berbeda.',
    metode2: 'Hitung mundur dari tujuan Z: rute(Z)=1, rute(X)=rute(Z)=1, rute(Y)=rute(X)+rute(Z)=2, rute(W)=rute(X)+rute(Y)=1+2=3 rute.',
  },
  {
    pertanyaan:
      'Lima peserta (Lina, Mira, Nando, Oki, Putra) mengikuti lomba lari 400 meter dan finis tanpa seri:\n(1) Mira finis tepat di belakang Nando.\n(2) Oki finis lebih cepat daripada Putra, tetapi lebih lambat daripada Lina.\n(3) Nando bukan juara pertama, dan Putra bukan yang terakhir.\nSiapakah yang finis pada urutan terakhir (ke-5)?',
    correct: 'Mira',
    distractors: ['Putra', 'Oki', 'Nando', 'Lina'],
    metode1: 'Dari (2): Lina > Oki > Putra. Dari (3): Putra bukan ke-5, sehingga di belakang Putra minimal ada 1 orang. Karena Mira tepat di belakang Nando dan Nando bukan ke-1, satu-satunya cara agar Putra bukan terakhir adalah menempatkan pasangan (Nando, Mira) di posisi 4–5 (atau Nando di 3? Jika Nando=3, Mira=4, maka Putra wajib di 5 — melanggar syarat 3!). Jadi urutan tunggal: 1:Lina, 2:Oki, 3:Putra, 4:Nando, 5:Mira.',
    metode2: 'Lina > Oki > Putra sudah 3 orang. Putra bukan terakhir → harus ada yang di belakang Putra. Karena (Nando, Mira) sepaket 2 orang dan Nando ≠ 1, paket ini hanya bisa di 4–5 → Mira pasti ke-5!',
  },
  {
    pertanyaan:
      'Dalam jadwal piket 4 hari (Senin–Kamis), 4 staf (R, S, T, U) masing-masing piket tepat satu kali:\n(1) R piket lebih awal daripada S.\n(2) T piket tepat satu hari setelah U.\n(3) S tidak piket pada hari Kamis.\nSiapakah yang piket pada hari Kamis?',
    correct: 'T',
    distractors: ['R', 'S', 'U', 'R atau U'],
    metode1: 'Blok (U, T) berurutan: kemungkinan (1,2), (2,3), atau (3,4). Karena R < S dan S ≠ 4: jika (U,T)=(1,2), sisa (3,4) memaksa S=4 (gagal); jika (U,T)=(2,3), sisa (1,4) memaksa S=4 (gagal). Maka wajib (U,T)=(3,4) dengan R=1, S=2. Jadi Kamis = T.',
    metode2: 'Karena S < 4 dan R < S, maka R dan S pasti memakai minimal 2 hari sebelum Kamis. U tidak mungkin di Kamis (karena T setelah U). Otomatis Kamis hanya bisa diisi T!',
  },
  {
    pertanyaan:
      'Lima instansi (A, B, C, D, E) dinilai indeks pelayanan publiknya dengan skor berbeda:\n(1) Skor A lebih tinggi daripada E, tetapi lebih rendah daripada C.\n(2) Skor D lebih tinggi daripada B.\n(3) Skor C lebih rendah daripada B.\nInstansi manakah yang menempati peringkat ke-3 tertinggi?',
    correct: 'C',
    distractors: ['A', 'B', 'D', 'E'],
    metode1: 'Dari (1): C > A > E. Dari (3): B > C. Dari (2): D > B. Gabungkan seluruh rantai ketaksamaan: D > B > C > A > E. Peringkat ke-3 tertinggi adalah C.',
    metode2: 'Sambungkan rantai tunggal dari atas: D > B > C > A > E. Elemen tengah (ke-3 dari 5) langsung terlihat = C.',
  },
  {
    pertanyaan:
      'Empat meja kerja (1, 2, 3, 4) berjajar dari kiri ke kanan ditempati oleh pegawai dengan divisi berbeda (Data, Hukum, Keuangan, Umum):\n(1) Divisi Hukum berada tepat di sebelah kiri Divisi Data.\n(2) Divisi Umum berada di salah satu ujung (meja 1 atau 4).\n(3) Divisi Keuangan tidak berada di sebelah Divisi Umum.\nDivisi apakah yang menempati meja nomor 2?',
    correct: 'Hukum',
    distractors: ['Data', 'Keuangan', 'Umum', 'Tidak dapat ditentukan'],
    metode1: 'Kasus A (Umum=1): Keuangan tidak sebelah 1 → Keuangan di 3 atau 4. Blok (Hukum, Data) butuh 2 meja bersebelahan: hanya mungkin di (2,3) dengan Keuangan=4! Cek: 1:Umum, 2:Hukum, 3:Data, 4:Keuangan (semua syarat terpenuhi!). Kasus B (Umum=4): Keuangan ≠ 3 → Keuangan di 1 atau 2. Jika Keuangan=1 → (Hukum, Data)=(2,3) (juga valid: 1:Keuangan, 2:Hukum, 3:Data, 4:Umum!). Pada KEDUA kasus valid tersebut, meja 2 SELALU ditempati oleh Divisi Hukum!',
    metode2: 'Uji kedua ujung untuk Umum: baik Umum di 1 maupun Umum di 4, karena Keuangan harus menjauh dari Umum, Keuangan wajib menempati ujung satunya → blok (Hukum, Data) terkunci di tengah (2,3) → Meja 2 pasti Hukum!',
  },
  {
    pertanyaan:
      'Sebuah ruang rapat hanya tersedia untuk 3 sesi berurutan (Pagi, Siang, Sore) bagi 3 bidang (X, Y, Z). Diketahui:\n(1) Bidang X tidak dapat hadir pada sesi Sore.\n(2) Bidang Y tidak dapat hadir pada sesi Pagi.\n(3) Bidang Z harus dilaksanakan sebelum Bidang X.\nUrutan jadwal Pagi – Siang – Sore yang pasti benar adalah...',
    correct: 'Z – X – Y',
    distractors: ['X – Z – Y', 'Z – Y – X', 'Y – Z – X', 'X – Y – Z'],
    metode1: 'Dari (3) Z < X dan (1) X ≠ Sore, maka X tidak bisa Pagi (karena Z di depannya) dan tidak bisa Sore → X wajib di Siang! Akibatnya Z wajib di Pagi, dan tersisa Y di Sore (memenuhi syarat 2: Y ≠ Pagi). Urutan: Z – X – Y.',
    metode2: 'X diapit dua larangan: bukan Sore dan harus setelah Z (bukan Pagi) → X terkunci di Siang! Langsung pilih opsi yang X di tengah (Z–X–Y).',
  },
  {
    pertanyaan:
      'Tujuh berkas bernomor 1 sampai 7 disusun dalam tumpukan dari bawah (posisi 1) ke atas (posisi 7). Berkas merah berada tepat di tengah tumpukan. Berkas biru berada 2 posisi di atas berkas merah. Berkas hijau berada tepat di bawah berkas biru. Di posisi keberapakah berkas hijau?',
    correct: 'Posisi ke-5',
    distractors: ['Posisi ke-3', 'Posisi ke-4', 'Posisi ke-6', 'Posisi ke-7'],
    metode1: 'Tengah dari 7 posisi adalah posisi (7+1)/2 = 4 (Merah = 4). Biru berada 2 posisi di atas Merah = 4 + 2 = 6. Hijau tepat di bawah Biru = 6 − 1 = 5.',
    metode2: 'Hitung cepat koordinat: Tengah = 4 → +2 (Biru=6) → −1 (Hijau=5). Selesai dalam 8 detik!',
  },
  {
    pertanyaan:
      'Dalam suatu rapat koordinasi, terdapat 5 peserta dari instansi berbeda: Dika lebih tua daripada Erna, Fani lebih muda daripada Gita, Erna lebih tua daripada Gita, dan Hadi lebih tua daripada Dika. Siapakah peserta yang paling muda?',
    correct: 'Fani',
    distractors: ['Gita', 'Erna', 'Dika', 'Hadi'],
    metode1: 'Susun relasi usia: Hadi > Dika > Erna > Gita > Fani. Jadi peserta yang paling muda adalah Fani.',
    metode2: 'Teknik eliminasi: siapa pun yang disebut "lebih tua dari..." tidak mungkin paling muda → coret Dika, Gita, Erna, Hadi. Tersisa Fani!',
  },
  {
    pertanyaan:
      'Enam mahasiswa magang (A, B, C, D, E, F) dibagi menjadi dua kelompok @3 orang (Tim Alpha dan Tim Beta):\n(1) A dan B harus satu tim.\n(2) C tidak boleh satu tim dengan D.\n(3) E berada di Tim Alpha.\n(4) D berada di Tim Beta.\nJika F satu tim dengan D, siapakah anggota lengkap Tim Alpha?',
    correct: 'A, B, dan E',
    distractors: ['A, B, dan C', 'C, E, dan F', 'A, C, dan E', 'B, C, dan E'],
    metode1: 'Tim Beta sudah berisi D dan F (2 orang). Karena C tidak boleh satu tim dengan D, maka C wajib di Tim Alpha → tunggu! Cek kapasitas: Tim Alpha sudah punya E dan C (2 orang), butuh 1 lagi, tetapi A & B harus satu tim (2 orang)! Kontradiksi! Mari perbaiki soal agar 100% konsisten.',
    metode2: 'Cek ulang syarat.',
  },
];

// Replace item 15 and complete items 15..25 with 100% verified consistent constraints!
const ANALYTICAL_REST: LogicSpec[] = [
  {
    pertanyaan:
      'Enam peserta magang (A, B, C, D, E, F) dibagi menjadi dua tim beranggotakan tepat 3 orang (Tim Alpha dan Tim Beta):\n(1) A dan B harus berada pada tim yang sama.\n(2) C tidak boleh satu tim dengan D.\n(3) E berada di Tim Alpha, sedangkan D berada di Tim Beta.\n(4) A tidak satu tim dengan E.\nSiapakah anggota lengkap Tim Alpha?',
    correct: 'C, E, dan F',
    distractors: ['A, B, dan E', 'A, B, dan C', 'C, D, dan E', 'B, E, dan F'],
    metode1: 'E ∈ Alpha, D ∈ Beta. Karena A tidak satu tim dengan E, maka A ∈ Beta. Karena A dan B harus satu tim, maka B ∈ Beta. Tim Beta kini sudah penuh 3 orang: {A, B, D}. Maka seluruh anggota tersisa {C, E, F} wajib masuk Tim Alpha (memenuhi syarat C terpisah dari D).',
    metode2: 'A terpisah dari E → A ke Beta → B ikut ke Beta bersama D → Tim Beta penuh {A, B, D}! Sisa {C, E, F} otomatis Tim Alpha.',
  },
  {
    pertanyaan:
      'Pada deretan 5 loket pelayanan (Loket 1 sampai Loket 5), setiap loket melayani satu jenis izin (KTP, KK, Akta, Paspor, NPWP):\n(1) Loket KTP berada tepat di antara Loket KK dan Loket Akta.\n(2) Loket NPWP berada di Loket 5.\n(3) Loket Paspor berada di sebelah kiri Loket KK.\nLayanan apakah yang berada di Loket 3?',
    correct: 'KTP',
    distractors: ['KK', 'Akta', 'Paspor', 'NPWP'],
    metode1: 'Loket 5 = NPWP. Sisa Loket 1–4 untuk Paspor, KK, KTP, Akta. Karena KTP di antara KK dan Akta, urutannya bisa (KK-KTP-Akta) atau (Akta-KTP-KK). Karena Paspor di sebelah kiri KK: jika (Akta-KTP-KK) di 2–4, Paspor di 1 (maka Loket 3 = KTP); jika (KK-KTP-Akta) di 2–4, Paspor di 1 (maka Loket 3 = KTP juga!). Pada semua susunan yang memenuhi syarat, Loket 3 SELALU KTP!',
    metode2: 'Loket 5 sudah terisi NPWP. Paspor harus di kiri KK, sehingga blok 3 loket (KK, KTP, Akta) dengan KTP di tengahnya terkunci di 2–3–4 → Loket 3 pasti KTP!',
  },
  {
    pertanyaan:
      'Seorang kurir dinas harus mengantar dokumen ke 5 kantor (K1, K2, K3, K4, K5) dalam satu hari:\n(1) K3 harus dikunjungi sebelum K1.\n(2) K2 harus dikunjungi tepat setelah K4.\n(3) K5 adalah kantor pertama yang dikunjungi.\n(4) K1 tidak boleh dikunjungi terakhir.\nKantor manakah yang dikunjungi pada urutan ke-2?',
    correct: 'K3',
    distractors: ['K1', 'K2', 'K4', 'K5'],
    metode1: 'Urutan 1 = K5. Tersisa urutan 2, 3, 4, 5 untuk K1, K3, dan blok (K4, K2). Karena K3 < K1 dan K1 ≠ 5, maka K1 maksimal di urutan 4 dan K3 di depannya. Coba blok (K4, K2) di (4,5) → maka (K3, K1) wajib di (2,3)! Coba blok (K4, K2) di (2,3) → maka K3=4, K1=5 (melanggar K1 ≠ 5). Coba blok (K4, K2) di (3,4) → maka K3=2, K1=5 (melanggar K1 ≠ 5). Jadi urutan tunggal: K5 – K3 – K1 – K4 – K2. Urutan ke-2 adalah K3.',
    metode2: 'Karena K1 ≠ 5 dan K3 < K1, satu-satunya cara agar K1 tidak terdorong ke posisi 5 adalah menaruh paket (K4, K2) di belakang (4–5). Sisa posisi 2–3 langsung diisi K3, K1 → posisi 2 = K3.',
  },
  {
    pertanyaan:
      'Lima warna map berkas (Merah, Kuning, Hijau, Biru, Ungu) disimpan di 5 rak vertikal dari Rak 1 (bawah) hingga Rak 5 (atas):\n(1) Map Hijau berada 2 tingkat di atas Map Merah.\n(2) Map Biru berada tepat di bawah Map Kuning.\n(3) Map Ungu berada di Rak 1.\nDi rak manakah Map Hijau disimpan?',
    correct: 'Rak 4',
    distractors: ['Rak 2', 'Rak 3', 'Rak 5', 'Rak 1'],
    metode1: 'Rak 1 = Ungu. Sisa Rak {2, 3, 4, 5}. Pasangan (Merah, Hijau) berselisih 2 tingkat: bisa (2,4) atau (3,5). Jika (Merah, Hijau) = (3,5), tersisa Rak 2 dan Rak 4 (tidak bersebelahan!) sehingga pasangan bersebelahan (Biru, Kuning) gagal masuk. Maka wajib (Merah, Hijau) = (2,4) atau tunggu: jika (2,4), tersisa Rak 3 dan Rak 5 (juga tidak bersebelahan!). Wah, bagus sekali kita memverifikasi dengan ketat!',
    metode2: 'Ubah syarat (3) agar menghasilkan tepat satu solusi matematis!',
  },
];

const ANALYTICAL_FINAL_11: LogicSpec[] = [
  ANALYTICAL_REST[0],
  ANALYTICAL_REST[1],
  ANALYTICAL_REST[2],
  {
    pertanyaan:
      'Lima warna map berkas (Merah, Kuning, Hijau, Biru, Ungu) disimpan di 5 rak vertikal dari Rak 1 (bawah) hingga Rak 5 (atas):\n(1) Map Hijau berada 2 tingkat di atas Map Merah.\n(2) Map Biru berada tepat di bawah Map Kuning.\n(3) Map Ungu berada di Rak 2.\nDi rak manakah Map Hijau disimpan?',
    correct: 'Rak 3',
    distractors: ['Rak 1', 'Rak 2', 'Rak 4', 'Rak 5'],
    metode1: 'Rak 2 = Ungu. Sisa Rak {1, 3, 4, 5}. Pasangan bersebelahan (Biru, Kuning) hanya mungkin di (3,4) atau (4,5). Pasangan selisih 2 (Merah, Hijau) dari {1,3,4,5} bisa (1,3) atau (3,5). Jika (Merah, Hijau)=(3,5), sisa {1,4} tidak bersebelahan (gagal untuk Biru-Kuning). Maka wajib (Merah, Hijau)=(1,3) dan (Biru, Kuning)=(4,5). Jadi Map Hijau = Rak 3.',
    metode2: 'Tulis [1, Ungu, 3, 4, 5]. Blok bersebelahan (Biru, Kuning) pasti ambil (4,5) agar sisa (1,3) berselisih tepat 2 untuk (Merah, Hijau) → Hijau = Rak 3!',
  },
  {
    pertanyaan:
      'Tiga pegawai (Bima, Caca, Dedi) masing-masing berasal dari kota berbeda (Bandung, Surabaya, Medan) dan menempati jabatan berbeda (Analis, Auditor, Pranata):\n(1) Bima bukan dari Bandung dan bukan Auditor.\n(2) Pegawai dari Surabaya adalah Pranata.\n(3) Dedi adalah Auditor dan bukan dari Medan.\nDari kota manakah Caca berasal dan apa jabatannya?',
    correct: 'Medan – Analis',
    distractors: ['Bandung – Analis', 'Surabaya – Pranata', 'Medan – Pranata', 'Bandung – Auditor'],
    metode1: 'Dari (3): Dedi = Auditor. Karena Surabaya = Pranata (2), Dedi ≠ Surabaya, dan Dedi ≠ Medan (3), maka Dedi = Bandung (Auditor). Dari (1): Bima ≠ Auditor (sudah Dedi) dan Bima ≠ Bandung. Tersisa jabatan {Analis, Pranata} dan kota {Surabaya, Medan}. Jika Bima = Pranata (Surabaya), maka Caca = Analis (Medan). Cek kebalikannya: apakah Caca bisa Pranata (Surabaya)? Tunggu — apakah ada syarat yang mengunci Bima = Surabaya? Mari cek: tidak ada larangan Bima = Medan! Tambahkan syarat (4) Caca bukan dari Surabaya agar tunggal!',
    metode2: 'Kunci tunggal.',
  },
];

// Build exact 25 verified analytical questions (replacing the draft above cleanly)
const CLEAN_ANALYTICAL_25: LogicSpec[] = [
  ...VERIFIED_ANALYTICAL_SPECS.slice(0, 14),
  ...ANALYTICAL_FINAL_11.slice(0, 4),
  {
    pertanyaan:
      'Tiga pegawai (Bima, Caca, Dedi) masing-masing berasal dari kota berbeda (Bandung, Surabaya, Medan) dan menjabat posisi berbeda (Analis, Auditor, Pranata):\n(1) Pegawai dari Surabaya adalah Pranata.\n(2) Dedi adalah Auditor dan bukan dari Medan.\n(3) Caca bukan Pranata.\nDari kota manakah Caca berasal dan apa jabatannya?',
    correct: 'Medan – Analis',
    distractors: ['Bandung – Analis', 'Surabaya – Pranata', 'Medan – Pranata', 'Bandung – Pranata'],
    metode1: 'Dedi = Auditor, bukan Surabaya (karena Surabaya = Pranata) dan bukan Medan → Dedi = Bandung (Auditor). Karena Caca bukan Pranata dan bukan Auditor (sudah Dedi), maka Caca = Analis, dan kota tersisa selain Bandung & Surabaya adalah Medan. Jadi Caca = Medan – Analis (dan Bima = Surabaya – Pranata).',
    metode2: 'Kunci Dedi = Auditor Bandung. Caca bukan Auditor dan bukan Pranata → Caca pasti Analis → satu-satunya kota tersisa bukan Surabaya adalah Medan!',
  },
  {
    pertanyaan:
      'Dalam suatu tes wawancara kelompok, 6 kursi berderet (1 sampai 6) diisi oleh A, B, C, D, E, F:\n(1) A duduk di kursi 1.\n(2) B duduk tepat di antara C dan D.\n(3) E duduk di kursi 6.\n(4) C duduk di sebelah A.\nSiapakah yang duduk di kursi nomor 5?',
    correct: 'F',
    distractors: ['B', 'C', 'D', 'E'],
    metode1: 'Kursi 1 = A, Kursi 6 = E. Karena C di sebelah A → Kursi 2 = C. Karena B tepat di antara C dan D → Kursi 3 = B dan Kursi 4 = D. Tersisa Kursi 5 untuk F.',
    metode2: 'Isi berantai dari kiri ke kanan: 1:A → 2:C → 3:B → 4:D, dan 6:E → kursi kosong 5 otomatis milik F!',
  },
  {
    pertanyaan:
      'Lima peserta (P, Q, R, S, T) mengumpulkan tugas pada jam berbeda:\n(1) Q mengumpulkan sebelum P, tetapi setelah S.\n(2) T mengumpulkan tepat setelah P.\n(3) R mengumpulkan paling awal.\nSiapakah yang mengumpulkan tugas pada urutan ke-4?',
    correct: 'P',
    distractors: ['Q', 'R', 'S', 'T'],
    metode1: 'R = 1. Dari (1): S < Q < P. Dari (2): P tepat sebelum T. Maka urutan mutlak: 1:R, 2:S, 3:Q, 4:P, 5:T. Urutan ke-4 adalah P.',
    metode2: 'Susun rantai langsung: R → S → Q → P → T. Hitung posisi ke-4 = P.',
  },
  {
    pertanyaan:
      'Empat jenis pelatihan (Keuangan, Audit, TIK, Hukum) dijadwalkan dalam 4 ruang (Ruang 1–4):\n(1) Ruang 1 bukan untuk TIK dan bukan untuk Hukum.\n(2) Audit dilaksanakan di Ruang 3.\n(3) TIK berada di ruang bernomor lebih besar daripada Hukum.\nPelatihan apakah yang dilaksanakan di Ruang 4?',
    correct: 'TIK',
    distractors: ['Hukum', 'Keuangan', 'Audit', 'Tidak dapat ditentukan'],
    metode1: 'Ruang 3 = Audit. Ruang 1 ≠ TIK, ≠ Hukum, ≠ Audit → Ruang 1 = Keuangan! Tersisa Ruang 2 dan Ruang 4 untuk Hukum dan TIK. Karena TIK > Hukum, maka Hukum = Ruang 2 dan TIK = Ruang 4.',
    metode2: 'Eliminasi Ruang 1 (bukan TIK, Hukum, Audit → pasti Keuangan). Sisa Ruang 2 & 4, karena TIK lebih besar → TIK di Ruang 4!',
  },
  {
    pertanyaan:
      'Lima pegawai (V, W, X, Y, Z) antre di mesin absensi. V berada tepat di depan W. X berada di belakang Y. Z berada di urutan pertama. Jika terdapat tepat dua orang di antara Z dan Y, siapakah yang berada di urutan terakhir (ke-5)?',
    correct: 'X',
    distractors: ['V', 'W', 'Y', 'Z'],
    metode1: 'Z = 1. Terdapat 2 orang di antara Z(1) dan Y → Y berada di posisi 1 + 2 + 1 = 4. Karena X berada di belakang Y, maka X wajib di posisi 5! (Posisi 2–3 ditempati pasangan V–W).',
    metode2: 'Z=1, lompat 2 orang → Y=4. Karena X di belakang Y dan total cuma 5 orang, X langsung terkunci di posisi 5!',
  },
  {
    pertanyaan:
      'Sebuah panitia memilih 3 narasumber dari 5 pakar (A, B, C, D, E):\n(1) Jika A dipilih, maka B juga harus dipilih.\n(2) C dan D tidak dapat dipilih bersamaan.\n(3) E wajib dipilih.\nJika C dipilih, siapakah dua narasumber lainnya yang paling mungkin agar seluruh syarat terpenuhi?',
    correct: 'E dan B (atau A tidak dipilih), namun jika A dipilih maka jumlah menjadi 4; karena E & C sudah 2 orang, satu orang tersisa adalah B',
    distractors: ['A dan E', 'D dan E', 'A dan B', 'B dan D'],
    metode1: 'Sudah terpilih: {E, C} (2 orang), butuh 1 orang lagi dari {A, B, D}. Karena C dipilih → D gugur (syarat 2). Jika A dipilih, B wajib ikut (menjadi 4 orang, melebihi kuota 3!). Maka A tidak boleh dipilih, dan 1 slot tersisa wajib diisi B. Komposisi tunggal: {C, E, B}.',
    metode2: 'Sudah ada E & C (sisa 1 kursi). D gugur (bentrok C), A gugur (karena mengajak B jadi 4 orang). Satu-satunya kandidat tersisa: B!',
  },
  {
    pertanyaan:
      'Dalam tabel skor 4 tim inovasi (Tim 1, Tim 2, Tim 3, Tim 4), diketahui:\n(1) Skor Tim 2 lebih tinggi daripada Tim 4.\n(2) Skor Tim 3 lebih tinggi daripada Tim 1, tetapi lebih rendah daripada Tim 4.\nTim manakah yang memperoleh skor tertinggi kedua?',
    correct: 'Tim 4',
    distractors: ['Tim 1', 'Tim 2', 'Tim 3', 'Tim 2 dan Tim 4 seri'],
    metode1: 'Dari (1): Tim 2 > Tim 4. Dari (2): Tim 4 > Tim 3 > Tim 1. Gabungan urutan dari tertinggi: Tim 2 > Tim 4 > Tim 3 > Tim 1. Skor tertinggi kedua adalah Tim 4.',
    metode2: 'Rantai tunggal: 2 > 4 > 3 > 1 → posisi kedua adalah Tim 4.',
  },
];

// Polish option text on item 24 (index 23) so it's super clean and concise
CLEAN_ANALYTICAL_25[23] = {
  pertanyaan:
    'Sebuah panitia memilih tepat 3 narasumber dari 5 pakar (A, B, C, D, E):\n(1) Jika A dipilih, maka B juga harus dipilih.\n(2) C dan D tidak dapat dipilih bersamaan.\n(3) E wajib dipilih.\nJika C juga terpilih, siapakah satu narasumber ketiga yang PASTI dipilih?',
  correct: 'B',
  distractors: ['A', 'D', 'A atau B', 'B atau D'],
  metode1: 'Sudah terpilih: {E, C} (2 orang), butuh tepat 1 orang lagi dari {A, B, D}. Karena C terpilih → D gugur (syarat 2). Jika A dipilih → B wajib ikut sehingga total menjadi 4 orang (melanggar kuota 3). Maka A tidak dapat dipilih, sehingga satu-satunya pilihan sah adalah B.',
  metode2: 'Sisa 1 kursi dari {A, B, D}. Coret D (bentrok C), coret A (syarat A→B butuh 2 kursi). Tersisa tunggal: B!',
};

// ============================================================================
// 4. KEMAMPUAN VERBAL - PEMAHAMAN BACAAN (45 SOAL HOTS)
// ============================================================================
const READING_SPECS: LogicSpec[] = [
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Digitalisasi arsip di pemerintah daerah memangkas waktu pencarian dokumen dari rata-rata 45 menit menjadi kurang dari 2 menit. Meskipun biaya awal pemindaian dan pelatihan SDM cukup besar, efisiensi ruang simpan dan pengurangan kehilangan berkas menurunkan beban operasional tahunan hingga 35% sejak tahun kedua."\nKesimpulan yang PASTI BENAR berdasarkan bacaan tersebut adalah...',
    correct: 'Penghematan biaya operasional tahunan dari digitalisasi arsip mulai tampak pada tahun kedua meskipun memerlukan investasi awal.',
    distractors: [
      'Digitalisasi arsip langsung menghemat anggaran sejak bulan pertama penerapan.',
      'Seluruh pemerintah daerah di Indonesia telah menyelesaikan digitalisasi arsip.',
      'Pelatihan SDM merupakan komponen biaya terbesar yang tidak dapat dikendalikan.',
      'Waktu pencarian dokumen selalu tepat 2 menit setelah digitalisasi.',
    ],
    metode1: 'Bacaan menyatakan dua fakta eksplisit: (1) biaya awal cukup besar, (2) beban operasional tahunan turun hingga 35% sejak tahun kedua. Opsi benar merangkum kedua fakta tersebut tanpa menambah asumsi luar.',
    metode2: 'Eliminasi kata ekstrem/distorsi fakta: "bulan pertama" (salah, teks bilang tahun kedua), "seluruh daerah" (tidak disebut), "selalu tepat 2 menit" (teks bilang kurang dari 2 menit).',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Penerapan jam kerja fleksibel bagi ASN di beberapa kementerian menunjukkan peningkatan ketepatan penyelesaian laporan sebesar 18% pada unit berbasis luaran digital. Namun, pada unit layanan tatap muka langsung, skema ini memerlukan pengaturan sif ketat agar loket pelayanan tidak mengalami kekosongan petugas."\nSimpulan yang paling tepat adalah...',
    correct: 'Efektivitas dan pola penerapan jam kerja fleksibel ASN perlu disesuaikan dengan karakteristik tugas masing-masing unit kerja.',
    distractors: [
      'Jam kerja fleksibel tidak cocok diterapkan di seluruh instansi pemerintah.',
      'Unit layanan tatap muka pasti mengalami penurunan kinerja jika menerapkan sistem sif.',
      'Semua ASN kini diperbolehkan bekerja penuh dari rumah tanpa jadwal.',
      'Ketepatan laporan semua kementerian naik 18% setelah kebijakan ini.',
    ],
    metode1: 'Teks membandingkan dua karakteristik unit: unit luaran digital naik 18%, sementara unit tatap muka butuh pengaturan sif ketat. Maka simpulannya adalah penerapan harus menyesuaikan karakteristik unit kerja.',
    metode2: 'Cari simpulan yang merangkum KEDUA sisi paragraf (kontras "namun"). Opsi yang menggeneralisasi satu sisi ("tidak cocok di seluruh", "semua kementerian") otomatis salah.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Survei transportasi perkotaan mencatat bahwa 62% pengguna kendaraan pribadi bersedia beralih ke angkutan umum massal apabila waktu tempuh maksimal 1,2 kali kendaraan pribadi dan jarak jalan kaki ke halte tidak melebihi 500 meter. Tanpa perbaikan keterjangkauan halte, penurunan tarif saja hanya menaikkan jumlah penumpang sebesar 7%."\nKesimpulan yang pasti benar adalah...',
    correct: 'Keterjangkauan jarak halte dan kepastian waktu tempuh lebih menentukan minat peralihan pengguna kendaraan pribadi dibanding penurunan tarif semata.',
    distractors: [
      'Penurunan tarif angkutan umum sama sekali tidak menambah jumlah penumpang.',
      'Seluruh 62% pengguna kendaraan pribadi sudah beralih ke angkutan massal.',
      'Pengguna kendaraan pribadi menolak angkutan umum karena harga tiket mahal.',
      'Jarak halte di semua kota saat ini melebihi 500 meter.',
    ],
    metode1: 'Bandingkan data: syarat waktu tempuh + jarak halte menarik 62% kesediaan beralih, sedangkan penurunan tarif saja hanya menaikkan 7%. Jadi faktor waktu & jarak jauh lebih menentukan dibanding tarif semata.',
    metode2: 'Bandingkan angka 62% vs 7% dan coret kata absolut "sama sekali tidak" (padahal naik 7%) serta "sudah beralih" (teks bilang "bersedia").',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Kualitas air baku di wilayah hilir sangat dipengaruhi oleh tutupan hutan di daerah tangkapan air hulu. Ketika luas tutupan hutan berkurang di bawah 30%, kekeruhan air baku meningkat tajam sehingga biaya pengolahan air bersih di instalasi pengolahan air naik lebih dari dua kali lipat."\nPernyataan yang pasti sesuai dengan teks adalah...',
    correct: 'Menjaga tutupan hutan di wilayah hulu minimal 30% berkontribusi menekan biaya pengolahan air bersih di wilayah hilir.',
    distractors: [
      'Biaya pengolahan air bersih hanya ditentukan oleh jenis bahan kimia instalasi.',
      'Kekeruhan air baku tidak pernah terjadi apabila tutupan hutan di atas 30%.',
      'Wilayah hilir tidak memerlukan instalasi pengolahan air jika hulu masih berhutan.',
      'Penurunan tutupan hutan menurunkan kekeruhan air secara alami.',
    ],
    metode1: 'Teks menyatakan berkurangnya hutan <30% memicu kekeruhan tinggi dan menggandakan biaya pengolahan air. Maka menjaga tutupan hutan di hulu berkontribusi mencegah lonjakan biaya pengolahan di hilir.',
    metode2: 'Eliminasi opsi absolut ("hanya", "tidak pernah", "tidak memerlukan") dan opsi terbalik ("menurunkan kekeruhan").',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Integrasi Nomor Induk Kependudukan sebagai Nomor Pokok Wajib Pajak bertujuan menyederhanakan administrasi dan memperluas basis data perpajakan. Kebijakan ini tidak otomatis mewajibkan setiap pemilik NIK membayar pajak penghasilan, sebab kewajiban pajak tetap mengacu pada batas Penghasilan Tidak Kena Pajak (PTKP)."\nKesimpulan yang tepat dari bacaan tersebut adalah...',
    correct: 'Pemilik NIK yang penghasilannya di bawah batas PTKP tetap tidak wajib membayar pajak penghasilan meskipun NIK terintegrasi sebagai NPWP.',
    distractors: [
      'Setiap warga negara yang memiliki KTP wajib membayar pajak penghasilan setiap bulan.',
      'Integrasi NIK-NPWP menghapus seluruh ketentuan batas PTKP.',
      'Hanya wajib pajak berpenghasilan tinggi yang NIK-nya diintegrasikan.',
      'Administrasi perpajakan menjadi lebih rumit akibat penyatuan nomor identitas.',
    ],
    metode1: 'Kalimat kedua menjelaskan bahwa kewajiban pajak tetap mengacu pada batas PTKP, sehingga integrasi NIK tidak otomatis mewajibkan pembayaran pajak bagi yang di bawah PTKP.',
    metode2: 'Fokus pada kalimat klarifikasi "tidak otomatis mewajibkan ... mengacu pada batas PTKP". Opsi lain bertentangan langsung dengan teks.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Analisis data belanja daerah menunjukkan bahwa keterlambatan pengesahan dokumen pelaksanaan anggaran pada Januari berdampak pada penumpukan lelang proyek di triwulan ketiga. Akibatnya, pengerjaan fisik sering berpacu dengan musim hujan akhir tahun yang berisiko menurunkan mutu konstruksi."\nHubungan sebab-akibat yang sesuai dengan teks adalah...',
    correct: 'Keterlambatan administrasi anggaran di awal tahun dapat berdampak tidak langsung pada peningkatan risiko penurunan mutu konstruksi fisik.',
    distractors: [
      'Musim hujan akhir tahun merupakan penyebab utama keterlambatan pengesahan anggaran.',
      'Semua proyek yang dilelang pada triwulan ketiga pasti gagal dibangun.',
      'Pengesahan anggaran pada Januari menjamin tidak adanya hujan di akhir tahun.',
      'Mutu konstruksi hanya dipengaruhi oleh cuaca dan bukan perencanaan anggaran.',
    ],
    metode1: 'Rantai kausalitas teks: telat sahkan DPA (Jan) → lelang menumpuk (TW III) → pengerjaan kena musim hujan → berisiko menurunkan mutu konstruksi.',
    metode2: 'Cek arah panah sebab-akibat: Administrasi awal tahun → Mutu akhir tahun. Eliminasi arah terbalik (hujan sebabkan telat anggaran).',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Penggunaan kecerdasan buatan dalam penyaringan awal berkas administrasi mampu memverifikasi kelengkapan dokumen hingga 10 kali lebih cepat daripada pemeriksaan manual. Namun, keputusan akhir atas berkas yang ambigu tetap harus dilakukan oleh verifikator manusia untuk menjamin akuntabilitas hukum."\nKesimpulan yang pasti benar adalah...',
    correct: 'Kecerdasan buatan berperan mempercepat verifikasi awal, sedangkan verifikator manusia tetap memegang otoritas keputusan pada kasus ambigu.',
    distractors: [
      'Verifikator manusia tidak lagi dibutuhkan dalam seleksi administrasi berbasis AI.',
      'Kecerdasan buatan selalu salah dalam memeriksa berkas administrasi.',
      'Pemeriksaan manual 10 kali lebih akurat daripada kecerdasan buatan.',
      'Semua berkas administrasi selalu bersifat ambigu sehingga tidak bisa diperiksa AI.',
    ],
    metode1: 'Teks membagi peran secara komplementer: AI mempercepat penyaringan kelengkapan (10x), manusia memutuskan berkas ambigu demi akuntabilitas hukum.',
    metode2: 'Cari opsi yang mencerminkan kolaborasi/pembagian peran (AI = cepat di awal, Manusia = putusan akhir ambigu).',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Program pangan lestari di pekarangan rumah tangga mampu memenuhi 25% hingga 40% kebutuhan sayuran segar keluarga di desa binaan. Meski skalanya kecil, program ini meredam dampak kenaikan harga cabai dan sayuran saat pasokan antardaerah terganggu."\nSimpulan yang sesuai adalah...',
    correct: 'Pemanfaatan pekarangan rumah tangga berkontribusi memperkuat ketahanan pangan mikro saat terjadi gejolak pasokan pasar.',
    distractors: [
      'Program pekarangan rumah tangga dapat menggantikan 100% pasokan pertanian nasional.',
      'Harga cabai tidak akan pernah naik lagi di desa binaan.',
      'Program ini tidak memiliki manfaat ekonomi karena skalanya kecil.',
      'Pasokan antardaerah sudah tidak diperlukan lagi oleh desa binaan.',
    ],
    metode1: 'Pemenuhan 25%–40% kebutuhan sayuran keluarga membantu meredam gejolak harga saat pasokan luar terganggu — itulah wujud penguatan ketahanan pangan tingkat rumah tangga (mikro).',
    metode2: 'Eliminasi klaim berlebihan ("100%", "tidak pernah naik", "tidak diperlukan lagi") dan klaim yang menyangkal teks ("tidak bermanfaat").',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Sistem peringatan dini tsunami yang dipasang di pesisir selatan mampu mengirimkan sinyal bahaya dalam waktu kurang dari 5 menit sejak gempa terdeteksi. Kendati demikian, efektivitas penyelamatan jiwa tetap sangat bergantung pada kesiapan jalur evakuasi dan latihan rutin masyarakat setempat."\nKesimpulan yang pasti benar adalah...',
    correct: 'Kecepatan teknologi peringatan dini perlu diimbangi kesiapan infrastruktur evakuasi dan literasi mitigasi warga agar penyelamatan optimal.',
    distractors: [
      'Pemasangan sistem peringatan dini saja sudah cukup menjamin tidak ada korban jiwa.',
      'Sinyal peringatan dini tsunami selalu membutuhkan waktu lebih dari 5 menit.',
      'Latihan evakuasi masyarakat tidak diperlukan apabila sensor sudah canggih.',
      'Pesisir selatan tidak lagi berisiko terkena tsunami.',
    ],
    metode1: 'Teks menekankan bahwa selain sinyal cepat (<5 menit), efektivitas penyelamatan sangat bergantung pada jalur evakuasi dan latihan rutin masyarakat.',
    metode2: 'Kata kunci "kendati demikian ... tetap bergantung pada" menandakan syarat ganda: teknologi + kesiapan warga/jalur.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Berdasarkan evaluasi lima tahun terakhir, koperasi desa yang menerapkan pembukuan digital transparan mencatat tingkat partisipasi anggota 2,4 kali lebih tinggi dibandingkan koperasi dengan pencatatan manual tertutup. Kepercayaan anggota terhadap laporan keuangan berkala menjadi faktor utama peningkatan simpanan wajib."\nKesimpulan yang tepat adalah...',
    correct: 'Transparansi pencatatan keuangan digital berkorelasi positif dengan kepercayaan dan partisipasi anggota koperasi.',
    distractors: [
      'Semua koperasi dengan pencatatan manual pasti bangkrut dalam lima tahun.',
      'Pembukuan digital menghapus kewajiban simpanan wajib anggota koperasi.',
      'Partisipasi anggota hanya dipengaruhi oleh besarnya bunga pinjaman.',
      'Koperasi desa tidak membutuhkan laporan keuangan berkala.',
    ],
    metode1: 'Teks menunjukkan koperasi berpembukuan digital transparan memiliki partisipasi 2,4x lebih tinggi yang didorong kepercayaan pada laporan berkala.',
    metode2: 'Cari pernyataan yang setia pada relasi positif "transparansi digital ↔ kepercayaan & partisipasi".',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Transisi menuju kendaraan listrik di sektor transportasi dinas dapat menurunkan emisi karbon operasional hingga 60% jika sumber listriknya didominasi energi terbarukan. Sebaliknya, jika jaringan listrik masih bergantung penuh pada pembangkit batu bara, penurunan emisi bersihnya jauh lebih terbatas."\nKesimpulan yang pasti benar adalah...',
    correct: 'Besarnya penurunan emisi dari kendaraan listrik sangat bergantung pada bauran sumber energi pembangkit listriknya.',
    distractors: [
      'Kendaraan listrik selalu menghasilkan emisi nol dalam kondisi apa pun.',
      'Pembangkit batu bara menghasilkan emisi lebih rendah daripada energi terbarukan.',
      'Kendaraan listrik dinas meningkatkan emisi karbon sebesar 60%.',
      'Transisi kendaraan listrik tidak ada hubungannya dengan jaringan listrik.',
    ],
    metode1: 'Teks membandingkan dua skenario sumber listrik: energi terbarukan (turun 60%) vs batu bara (penurunan terbatas). Artinya efektivitas emisi tergantung sumber pembangkit listriknya.',
    metode2: 'Cari kata kunci kondisional "sangat bergantung pada sumber energi". Eliminasi klaim absolut "selalu nol".',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Penerapan satu pintu perizinan berusaha berbasis risiko memangkas jumlah persyaratan dokumen bagi usaha mikro hingga 70%. Untuk usaha berisiko tinggi, proses verifikasi lapangan tetap dipertahankan secara ketat guna mencegah dampak lingkungan dan keselamatan kerja."\nKesimpulan yang paling tepat adalah...',
    correct: 'Skema perizinan berbasis risiko menyederhanakan prosedur usaha berisiko rendah tanpa mengendurkan pengawasan pada usaha berisiko tinggi.',
    distractors: [
      'Semua usaha, termasuk yang berisiko tinggi, dibebaskan dari verifikasi lapangan.',
      'Usaha mikro tidak lagi memerlukan izin berusaha sama sekali.',
      'Perizinan berbasis risiko menambah jumlah dokumen usaha mikro sebesar 70%.',
      'Verifikasi lapangan hanya dilakukan untuk usaha mikro.',
    ],
    metode1: 'Paragraf menjelaskan diferensiasi perlakuan: usaha mikro dipangkas 70% dokumennya, sementara usaha berisiko tinggi tetap diverifikasi ketat di lapangan.',
    metode2: 'Cocokkan kedua kontras (usaha mikro disederhanakan + risiko tinggi tetap ketat).',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Studi kesehatan kerja pada pegawai administrasi menunjukkan bahwa duduk terus-menerus lebih dari 6 jam tanpa jeda peregangan meningkatkan keluhan nyeri punggung bawah sebesar 48%. Peregangan ringan selama 3 menit setiap satu jam terbukti menurunkan keluhan tersebut secara signifikan tanpa mengurangi output pekerjaan."\nKesimpulan yang pasti benar adalah...',
    correct: 'Jeda peregangan singkat secara berkala membantu mengurangi risiko nyeri punggung bawah pegawai tanpa mengganggu produktivitas.',
    distractors: [
      'Pegawai administrasi dilarang duduk saat bekerja di kantor.',
      'Peregangan selama 3 menit setiap jam menurunkan output pekerjaan hingga 48%.',
      'Nyeri punggung bawah hanya dialami oleh pegawai yang bekerja lebih dari 10 jam.',
      'Mengurangi jam kerja adalah satu-satunya cara mencegah nyeri punggung.',
    ],
    metode1: 'Kalimat kedua secara tegas menyatakan peregangan 3 menit/jam menurunkan keluhan secara signifikan tanpa mengurangi output kerja.',
    metode2: 'Cek fakta langsung di kalimat penutup: manfaat kesehatan (+) dan output kerja tidak berkurang (=).',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Kebijakan belanja produk dalam negeri pada pengadaan pemerintah mensyaratkan tingkat komponen dalam negeri (TKDN) minimal 40% apabila produk lokal tersedia dengan spesifikasi setara. Kebijakan ini tidak hanya menggerakkan industri manufaktur nasional, tetapi juga mendorong UMKM pemasok komponen naik kelas."\nKesimpulan yang pasti sesuai dengan bacaan adalah...',
    correct: 'Kewajiban TKDN pada pengadaan pemerintah berdampak ganda terhadap industri manufaktur nasional dan penguatan UMKM pemasok.',
    distractors: [
      'Produk impor dengan spesifikasi lebih rendah wajib dibeli dalam pengadaan pemerintah.',
      'Syarat TKDN minimal 40% berlaku bahkan ketika produk lokal sama sekali tidak tersedia.',
      'UMKM dilarang menjadi pemasok komponen dalam pengadaan pemerintah.',
      'Kebijakan TKDN hanya menguntungkan perusahaan multinasional besar.',
    ],
    metode1: 'Teks menyebut syarat bersyarat ("apabila produk lokal tersedia dengan spesifikasi setara") dan dampak ganda bagi manufaktur nasional serta UMKM pemasok.',
    metode2: 'Perhatikan frasa "tidak hanya ..., tetapi juga ..." → cari opsi yang menyebutkan dampak ganda tersebut.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Pelatihan keamanan informasi bagi aparatur sering kali kurang efektif jika hanya disampaikan melalui ceramah satu arah. Instansi yang memadukan simulasi serangan phishing berkala mencatat penurunan tingkat klik tautan berbahaya oleh pegawai dari 24% menjadi di bawah 4% dalam enam bulan."\nKesimpulan yang pasti benar adalah...',
    correct: 'Pendekatan pelatihan berbasis simulasi praktis lebih efektif menekan kerentanan pegawai terhadap phishing dibandingkan ceramah satu arah saja.',
    distractors: [
      'Ceramah keamanan informasi menyebabkan 24% pegawai melakukan peretasan.',
      'Setelah enam bulan simulasi, tidak ada satu pun pegawai yang pernah mengklik tautan phishing.',
      'Simulasi phishing hanya perlu dilakukan sekali seumur hidup.',
      'Keamanan informasi instansi tidak bergantung pada perilaku pegawai.',
    ],
    metode1: 'Data menunjukkan simulasi phishing berkala menurunkan angka klik dari 24% ke <4% (masih bisa >0%, jadi opsi "tidak ada satu pun" salah!), jauh lebih efektif daripada ceramah satu arah.',
    metode2: 'Cermati angka "di bawah 4%" ≠ 0%! Jadi eliminasi opsi "tidak ada satu pun" dan pilih perbandingan efektivitas metode.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Pengelolaan sampah berbasis bank sampah di tingkat kelurahan mampu mengurangi volume sampah yang diangkut ke TPA hingga 28% per bulan. Keberhasilan ini dicapai terutama berkat pemilahan sampah anorganik bernilai jual sejak dari rumah tangga dan penjemputan terjadwal."\nSimpulan yang tepat adalah...',
    correct: 'Pemilahan sampah di tingkat rumah tangga dan penjemputan teratur menjadi kunci pengurangan beban TPA melalui bank sampah.',
    distractors: [
      'Bank sampah menghentikan seluruh pengangkutan sampah ke TPA.',
      'Sampah organik merupakan satu-satunya jenis sampah yang dikelola bank sampah.',
      'Volume sampah ke TPA meningkat 28% setelah ada bank sampah.',
      'Pemilahan sampah cukup dilakukan petugas di TPA tanpa partisipasi warga.',
    ],
    metode1: 'Teks mengaitkan penurunan volume TPA (28%) terutama pada dua faktor: pemilahan anorganik sejak rumah tangga dan penjemputan terjadwal.',
    metode2: 'Eliminasi opsi bertentangan ("organik satu-satunya", "meningkat", "tanpa partisipasi warga").',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Pemerataan tenaga medis di daerah tertinggal, terdepan, dan terluar (3T) menghadapi kendala bukan semata besaran insentif finansial, melainkan juga akses pendidikan anak, jaringan komunikasi, dan jaminan jenjang karier pascapenugasan. Oleh karena itu, paket kebijakan afirmasi yang komprehensif lebih efektif menahan retensi tenaga medis."\nKesimpulan yang pasti benar adalah...',
    correct: 'Retensi tenaga medis di wilayah 3T memerlukan dukungan non-finansial dan kepastian karier di samping insentif finansial.',
    distractors: [
      'Insentif finansial tidak perlu diberikan kepada tenaga medis di daerah 3T.',
      'Jaringan komunikasi adalah satu-satunya faktor penentu retensi tenaga medis.',
      'Tenaga medis di wilayah 3T tidak membutuhkan jenjang karier.',
      'Kebijakan insentif tunggal sudah terbukti paling efektif di daerah 3T.',
    ],
    metode1: 'Frasa "bukan semata finansial, melainkan juga..." berarti faktor finansial tetap ada, namun perlu dilengkapi dukungan non-finansial (pendidikan, komunikasi, jenjang karier).',
    metode2: 'Pahami struktur "bukan semata X, melainkan juga Y" = X + Y bersama-sama, bukan meniadakan X.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Penerapan sistem pembayaran pajak daerah berbasis QRIS mempercepat rekonsiliasi kas harian dari 3 hari kerja menjadi real-time. Di sisi lain, bagi wajib pajak lansia yang belum terbiasa menggunakan aplikasi ponsel, loket pembayaran tunai terbantu tetap disediakan selama masa transisi."\nKesimpulan yang tepat adalah...',
    correct: 'Modernisasi pembayaran pajak berbasis QRIS dijalankan secara inklusif dengan tetap menyediakan kanal alternatif bagi wajib pajak lansia.',
    distractors: [
      'Pembayaran pajak tunai dihapus sepenuhnya sejak hari pertama penerapan QRIS.',
      'Rekonsiliasi kas berbasis QRIS membutuhkan waktu 3 hari kerja lebih lama.',
      'Wajib pajak lansia dibebaskan dari kewajiban membayar pajak daerah.',
      'Aplikasi ponsel hanya boleh digunakan oleh petugas rekonsiliasi kas.',
    ],
    metode1: 'Teks memadukan dua pesan: efisiensi rekonsiliasi real-time lewat QRIS dan inklusivitas layanan tunai terbantu bagi lansia di masa transisi.',
    metode2: 'Cari opsi yang merangkum efisiensi digital + inklusivitas layanan bagi lansia.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Ketersediaan data spasial beresolusi tinggi mempercepat penetapan batas wilayah desa dan mencegah tumpang tindih perizinan lahan. Namun, tanpa pemutakhiran data secara berkala, peta digital berisiko kembali tidak akurat akibat perubahan tutupan lahan dan pemekaran permukiman."\nSimpulan yang pasti benar adalah...',
    correct: 'Manfaat data spasial dalam tata ruang dan batas wilayah hanya bertahan jika disertai pemutakhiran data secara rutin.',
    distractors: [
      'Peta digital beresolusi tinggi tidak pernah mengalami ketidakakuratan.',
      'Tumpang tindih perizinan lahan disebabkan oleh pemutakhiran data berkala.',
      'Perubahan tutupan lahan tidak memengaruhi akurasi peta batas desa.',
      'Data spasial hanya berguna untuk wilayah perkotaan.',
    ],
    metode1: 'Kalimat kedua menegaskan syarat keberlanjutan akurasi peta: pemutakhiran berkala wajib dilakukan karena kondisi lahan terus berubah.',
    metode2: 'Perhatikan kontras "Namun, tanpa X maka Y gagal" → berarti X syarat mutlak keberlanjutan Y.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Program magang mahasiswa di instansi pemerintah memberi manfaat dua arah: mahasiswa memperoleh pengalaman praktik tata kelola publik, sementara instansi mendapatkan perspektif segar untuk pembenahan layanan digital. Agar hasilnya terukur, setiap peserta magang perlu didampingi mentor dengan target luaran proyek yang jelas."\nKesimpulan yang pasti benar adalah...',
    correct: 'Pendampingan mentor dan penetapan target luaran yang jelas diperlukan agar manfaat timbal balik program magang dapat terukur.',
    distractors: [
      'Program magang hanya menguntungkan mahasiswa tanpa manfaat bagi instansi.',
      'Mahasiswa magang tidak memerlukan bimbingan mentor karena sudah terbiasa dengan teknologi.',
      'Instansi pemerintah tidak boleh melibatkan mahasiswa dalam layanan digital.',
      'Program magang selalu menghasilkan layanan digital baru tanpa target.',
    ],
    metode1: 'Teks menguraikan manfaat dua arah dan menutup dengan syarat keberhasilan terukur: pendampingan mentor + target luaran jelas.',
    metode2: 'Ide pokok kesimpulan biasanya merangkum kalimat penutup berpenanda syarat ("Agar hasilnya terukur...").',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Peningkatan literasi numerasi siswa sekolah dasar tidak hanya bergantung pada jam pelajaran matematika di kelas, tetapi juga pada keterlibatan guru mengaitkan konsep bilangan dengan aktivitas sehari-hari. Sekolah yang menerapkan pembelajaran kontekstual mencatat kenaikan skor asesmen numerasi rata-rata 14 poin lebih tinggi dibanding metode hafalan rumus."\nSimpulan yang sesuai adalah...',
    correct: 'Pembelajaran numerasi yang dikaitkan dengan konteks kehidupan sehari-hari menghasilkan capaian asesmen lebih baik daripada hafalan rumus semata.',
    distractors: [
      'Jam pelajaran matematika di sekolah dasar sebaiknya dihapus.',
      'Metode hafalan rumus selalu menghasilkan skor 14 poin lebih tinggi.',
      'Guru tidak berperan dalam peningkatan literasi numerasi siswa.',
      'Semua siswa sekolah dasar pasti naik 14 poin setelah satu minggu.',
    ],
    metode1: 'Data pembanding langsung: pembelajaran kontekstual mencatat skor rata-rata +14 poin lebih tinggi dibandingkan metode hafalan rumus.',
    metode2: 'Cocokkan perbandingan "kontekstual > hafalan rumus" dan eliminasi distorsi terbalik.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Dalam pengelolaan dana desa, keterbukaan papan informasi anggaran di balai desa dan kanal daring desa mendorong partisipasi warga dalam musyawarah perencanaan. Di desa dengan tingkat partisipasi warga tinggi, temuan penyimpangan penggunaan anggaran tercatat jauh lebih rendah."\nKesimpulan yang pasti benar berdasarkan bacaan adalah...',
    correct: 'Keterbukaan informasi dana desa berperan memperkuat partisipasi warga yang berkaitan dengan rendahnya penyimpangan anggaran.',
    distractors: [
      'Papan informasi anggaran di balai desa menyebabkan penyimpangan dana desa.',
      'Partisipasi warga tidak berhubungan dengan akuntabilitas anggaran desa.',
      'Desa yang menggunakan kanal daring tidak perlu lagi mengadakan musyawarah.',
      'Penyimpangan anggaran mustahil terjadi di seluruh desa.',
    ],
    metode1: 'Rantai hubungan dalam teks: keterbukaan informasi → partisipasi warga tinggi → temuan penyimpangan jauh lebih rendah.',
    metode2: 'Ikuti alur kausalitas 3 tahap dalam teks tanpa mengklaim "mustahil terjadi" (teks menyebut "jauh lebih rendah", bukan nol mutlak).',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Pengadaan perangkat komputer kantor dengan spesifikasi seragam memudahkan pemeliharaan suku cadang dan standar keamanan sistem. Namun, untuk unit desain grafis dan pengolahan data geospasial, spesifikasi standar kerap tidak memadai sehingga memerlukan pengecualian spesifikasi teknis."\nKesimpulan yang tepat adalah...',
    correct: 'Standardisasi spesifikasi komputer kantor tetap memerlukan fleksibilitas pengecualian bagi unit kerja dengan beban komputasi khusus.',
    distractors: [
      'Semua unit kerja wajib menggunakan komputer berspesifikasi rendah agar seragam.',
      'Pemeliharaan suku cadang menjadi lebih sulit jika spesifikasi diseragamkan.',
      'Unit desain grafis tidak memerlukan standar keamanan sistem.',
      'Pengadaan komputer tidak boleh memiliki standar teknis sama sekali.',
    ],
    metode1: 'Paragraf menggabungkan keuntungan penyeragaman umum dengan kebutuhan pengecualian bagi unit komputasi khusus (desain grafis & geospasial).',
    metode2: 'Kata kunci "Namun ... memerlukan pengecualian" = standar umum + fleksibilitas khusus.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Pengembangan sistem transportasi logistik laut melalui tol laut menurunkan disparitas harga kebutuhan pokok di wilayah kepulauan timur rata-rata 15% hingga 22%. Meski demikian, rantai distribusi lanjutan dari pelabuhan ke kecamatan pedalaman masih menyumbang proporsi biaya angkut yang cukup besar."\nKesimpulan yang pasti benar adalah...',
    correct: 'Efektivitas tol laut dalam menekan harga di wilayah pedalaman masih perlu ditopang perbaikan distribusi darat dari pelabuhan.',
    distractors: [
      'Tol laut gagal menurunkan harga kebutuhan pokok di wilayah kepulauan timur.',
      'Harga kebutuhan pokok di kecamatan pedalaman kini lebih murah daripada di pelabuhan.',
      'Biaya angkut dari pelabuhan ke pedalaman sudah gratis sepenuhnya.',
      'Disparitas harga hanya dipengaruhi oleh jalur laut dan bukan distribusi darat.',
    ],
    metode1: 'Tol laut berhasil menurunkan disparitas 15%–22%, tetapi distribusi lanjutan (pelabuhan ke pedalaman) masih mahal sehingga perlu perbaikan lanjutan.',
    metode2: 'Cek dua fakta: tol laut berhasil sebagian (+) dan tantangan tersisa di distribusi darat pelabuhan→pedalaman.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Penerapan sertifikasi halal bagi produk UMKM kuliner memperluas akses masuk ke ritel modern dan pasar ekspor. Kendala utama yang dihadapi pelaku usaha mikro bukanlah keengganan mendaftar, melainkan keterbatasan pemahaman alur dokumentasi bahan baku."\nSimpulan yang paling tepat adalah...',
    correct: 'Pendampingan penyusunan dokumentasi bahan baku menjadi solusi kunci mempercepat sertifikasi halal UMKM mikro.',
    distractors: [
      'Pelaku UMKM mikro menolak keras mengikuti program sertifikasi halal.',
      'Sertifikasi halal hanya berguna untuk produk non-kuliner.',
      'Ritel modern tidak menerima produk UMKM yang bersertifikat halal.',
      'Dokumentasi bahan baku tidak diperlukan dalam proses sertifikasi halal.',
    ],
    metode1: 'Karena akar hambatan adalah keterbatasan pemahaman alur dokumentasi bahan baku (bukan penolakan), maka solusinya adalah pendampingan dokumentasi tersebut.',
    metode2: 'Cari akar masalah di kalimat terakhir ("melainkan keterbatasan pemahaman dokumentasi") → cocokkan langsung ke solusinya.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Kualitas tidur kurang dari 6 jam per malam secara berulang menurunkan kemampuan konsentrasi dan kecepatan pengambilan keputusan hingga 30%. Pada profesi pelayanan darurat, kekurangan tidur kronis juga berkorelasi dengan meningkatnya kesalahan prosedural."\nKesimpulan yang pasti benar adalah...',
    correct: 'Kecukupan waktu tidur berperan penting menjaga ketepatan keputusan dan meminimalkan kesalahan prosedural pada layanan darurat.',
    distractors: [
      'Tidur kurang dari 6 jam meningkatkan kecepatan pengambilan keputusan sebesar 30%.',
      'Kesalahan prosedural pada layanan darurat hanya disebabkan oleh kurang tidur.',
      'Pegawai yang tidur 6 jam tidak mungkin melakukan kesalahan kerja.',
      'Kualitas tidur tidak memengaruhi konsentrasi pegawai.',
    ],
    metode1: 'Teks menghubungkan kurang tidur (<6 jam) dengan penurunan konsentrasi/keputusan 30% dan kenaikan kesalahan prosedural di layanan darurat.',
    metode2: 'Eliminasi kata absolut ("hanya", "tidak mungkin") dan kalimat terbalik ("meningkatkan kecepatan").',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Audit energi pada gedung perkantoran pemerintah menemukan bahwa sistem pendingin ruangan menyumbang 58% total konsumsi listrik, disusul pencahayaan sebesar 22%. Pengaturan suhu AC standar 25°C dan penggantian lampu LED mampu menghemat tagihan listrik bulanan hingga 19% tanpa menurunkan kenyamanan kerja."\nKesimpulan yang tepat adalah...',
    correct: 'Optimalisasi suhu pendingin ruangan dan penggunaan lampu LED merupakan langkah penghematan listrik gedung yang efektif tanpa mengganggu kenyamanan.',
    distractors: [
      'Pencahayaan menyumbang porsi konsumsi listrik terbesar di gedung perkantoran.',
      'Mematikan seluruh pendingin ruangan adalah kebijakan yang dianjurkan teks.',
      'Suhu AC 25°C menurunkan kenyamanan kerja pegawai secara drastis.',
      'Tagihan listrik bulanan berkurang 58% setelah mengganti lampu LED.',
    ],
    metode1: 'Pendingin (58%) dan pencahayaan (22%) adalah kontributor terbesar (total 80%), dan intervensi AC 25°C + LED hemat hingga 19% tanpa menurunkan kenyamanan.',
    metode2: 'Hati-hati angka tertukar: 58% adalah porsi AC (bukan penghematan LED!), penghematannya 19%.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Penggunaan aplikasi aduan warga terintegrasi memperpendek rata-rata waktu tindak lanjut keluhan infrastruktur dari 14 hari menjadi 4 hari. Namun, tingkat kepuasan pelapor tetap rendah apabila tidak ada notifikasi status perkembangan penanganan secara berkala."\nKesimpulan yang pasti benar adalah...',
    correct: 'Kecepatan tindak lanjut aduan perlu disertai transparansi informasi perkembangan status agar kepuasan pelapor meningkat.',
    distractors: [
      'Aplikasi aduan warga gagal mempercepat waktu penanganan keluhan.',
      'Warga tidak peduli pada kecepatan penanganan asalkan mendapat notifikasi.',
      'Semua keluhan infrastruktur kini selesai tepat dalam 4 hari tanpa kecuali.',
      'Notifikasi status tidak berpengaruh terhadap kepuasan pelapor.',
    ],
    metode1: 'Walaupun durasi turun (14 → 4 hari), kepuasan tetap rendah tanpa notifikasi progres berkala. Maka keduanya (kecepatan + transparansi progres) dibutuhkan.',
    metode2: 'Ingat: "rata-rata 4 hari" ≠ "semua selesai tepat 4 hari". Pilih opsi yang menggabungkan kecepatan + notifikasi berkala.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Pengembangan desa wisata berbasis kearifan lokal meningkatkan pendapatan rumah tangga warga sekitar sebesar 31% dalam tiga tahun. Meski demikian, pertumbuhan kunjungan yang melampaui daya dukung lingkungan berpotensi merusak ekosistem dan mengikis daya tarik wisata itu sendiri."\nSimpulan yang paling tepat adalah...',
    correct: 'Pengembangan desa wisata perlu mengendalikan jumlah kunjungan sesuai daya dukung lingkungan agar manfaat ekonominya berkelanjutan.',
    distractors: [
      'Desa wisata tidak memberikan manfaat ekonomi bagi masyarakat sekitar.',
      'Semakin banyak wisatawan tanpa batas, ekosistem desa wisata semakin lestari.',
      'Pendapatan warga desa wisata turun 31% dalam tiga tahun terakhir.',
      'Kearifan lokal menghambat pertumbuhan sektor pariwisata desa.',
    ],
    metode1: 'Paragraf menekankan keseimbangan: manfaat ekonomi (+31%) harus dijaga dengan memperhatikan daya dukung lingkungan agar daya tarik tidak rusak.',
    metode2: 'Cari kata kunci "berkelanjutan / sesuai daya dukung lingkungan".',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Pelayanan kesehatan primer di puskesmas yang dilengkapi telemedisin memungkinkan dokter umum berkonsultasi langsung dengan dokter spesialis di rumah sakit rujukan. Dampaknya, kasus non-darurat yang sebenarnya dapat ditangani di tingkat primer berkurang rujukannya hingga 34%."\nKesimpulan yang pasti benar adalah...',
    correct: 'Layanan telemedisin di puskesmas membantu menekan rujukan berlebih untuk kasus non-darurat ke rumah sakit rujukan.',
    distractors: [
      'Dokter spesialis tidak lagi diperlukan di rumah sakit rujukan.',
      'Seluruh pasien darurat dilarang dirujuk ke rumah sakit.',
      'Telemedisin menaikkan beban antrean rumah sakit rujukan sebesar 34%.',
      'Puskesmas tanpa telemedisin tidak boleh melayani pasien umum.',
    ],
    metode1: 'Konsultasi dokter umum–spesialis lewat telemedisin menurunkan rujukan kasus non-darurat sebesar 34%, sehingga rujukan berlebih berkurang.',
    metode2: 'Cek spesifikasi kata: "kasus non-darurat" (bukan pasien darurat!) dan "berkurang 34%".',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Evaluasi proyek teknologi informasi pemerintah menunjukkan bahwa 60% kegagalan adopsi aplikasi bukan disebabkan oleh kerusakan kode program, melainkan karena desain alur kerja tidak melibatkan calon pengguna sejak tahap perancangan."\nKesimpulan yang paling tepat adalah...',
    correct: 'Pelibatan calon pengguna sejak tahap perancangan sangat krusial untuk mencegah kegagalan adopsi aplikasi pemerintah.',
    distractors: [
      'Kerusakan kode program adalah penyebab 60% kegagalan adopsi aplikasi.',
      'Pengujian kode program tidak perlu dilakukan selama pengguna dilibatkan.',
      'Semua aplikasi pemerintah gagal diadopsi oleh pengguna.',
      'Calon pengguna seharusnya hanya dilibatkan setelah aplikasi selesai diluncurkan.',
    ],
    metode1: 'Teks secara eksplisit menyebut 60% kegagalan adopsi berasal dari tidak dilibatkannya calon pengguna sejak tahap perancangan.',
    metode2: 'Balik akar masalah ("tidak melibatkan pengguna sejak perancangan") menjadi kesimpulan kunci ("pelibatan sejak perancangan sangat krusial").',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Program rehabilitasi mangrove di sepanjang garis pantai utara tidak hanya menahan laju abrasi hingga 55%, tetapi juga memulihkan habitat kepiting dan ikan bandeng yang menopang ekonomi nelayan tambak. Keberlanjutan penanaman sangat ditentukan oleh pemeliharaan bibit pada dua tahun pertama."\nKesimpulan yang pasti benar adalah...',
    correct: 'Rehabilitasi mangrove memberi manfaat ekologis sekaligus ekonomi yang keberhasilannya sangat bergantung pada pemeliharaan awal bibit.',
    distractors: [
      'Penanaman mangrove cukup dilakukan sekali tanpa perlu pemeliharaan bibit.',
      'Abrasi pantai utara berhenti 100% segera setelah bibit mangrove ditanam.',
      'Mangrove merusak habitat ikan bandeng dan kepiting di tambak nelayan.',
      'Manfaat mangrove hanya sebatas menahan gelombang laut tanpa dampak ekonomi.',
    ],
    metode1: 'Paragraf memuat 3 poin: manfaat ekologis (tahan abrasi 55%), manfaat ekonomi (habitat tambak), dan syarat pemeliharaan 2 tahun pertama.',
    metode2: 'Pilih opsi paling komprehensif yang mencakup ekologi + ekonomi + pemeliharaan awal.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Pembukaan akses data publik berformat terbuka (machine-readable) memungkinkan akademisi dan pelaku industri menganalisis tren sosial-ekonomi secara cepat. Sebaliknya, publikasi data yang hanya berupa salinan pindaian PDF menyulitkan pengolahan ulang dan menghambat inovasi berbasis data."\nSimpulan yang tepat adalah...',
    correct: 'Format data terbuka yang dapat dibaca mesin lebih mendukung analisis dan inovasi dibandingkan publikasi pindaian PDF semata.',
    distractors: [
      'Data publik sebaiknya tidak dipublikasikan sama sekali demi keamanan.',
      'Salinan pindaian PDF paling mudah diolah otomatis oleh perangkat lunak analisis.',
      'Hanya akademisi yang boleh mengakses data publik berformat terbuka.',
      'Inovasi berbasis data tidak membutuhkan data dari instansi pemerintah.',
    ],
    metode1: 'Teks mengontraskan format machine-readable (memudahkan analisis & inovasi) dengan salinan pindaian PDF (menyulitkan pengolahan ulang).',
    metode2: 'Perhatikan kata pembanding "Sebaliknya" untuk langsung menemukan inti perbandingan.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Diversifikasi ekspor produk pertanian olahan memberikan nilai tambah rata-rata 3 kali lebih besar dibandingkan ekspor bahan mentah. Selain meningkatkan devisa, hilirisasi agroindustri juga mengurangi kerentanan petani terhadap fluktuasi harga komoditas global."\nKesimpulan yang pasti benar adalah...',
    correct: 'Hilirisasi produk pertanian olahan meningkatkan nilai tambah ekonomi sekaligus memperkuat ketahanan pendapatan petani dari gejolak harga global.',
    distractors: [
      'Ekspor bahan mentah memberikan nilai tambah 3 kali lebih tinggi daripada produk olahan.',
      'Petani tidak terdampak sama sekali oleh kondisi ekonomi internasional.',
      'Hilirisasi agroindustri menurunkan penerimaan devisa negara.',
      'Semua komoditas pertanian dilarang diekspor dalam bentuk apa pun.',
    ],
    metode1: 'Teks menyebut dua dampak positif hilirisasi/olahan: nilai tambah 3x + pengurangan kerentanan terhadap fluktuasi harga global.',
    metode2: 'Eliminasi opsi terbalik ("bahan mentah 3x lebih tinggi", "menurunkan devisa") dan ekstrem ("dilarang diekspor").',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Penerapan sistem antrean daring di rumah sakit daerah mengurangi kepadatan ruang tunggu pagi hari hingga 50%. Namun, lonjakan antrean masih kerap terjadi di loket farmasi karena proses peracikan obat resep manual belum terhubung penuh dengan rekam medis elektronik."\nKesimpulan yang pasti benar adalah...',
    correct: 'Integrasi rekam medis elektronik dengan unit farmasi diperlukan untuk menuntaskan hambatan antrean di rumah sakit daerah.',
    distractors: [
      'Sistem antrean daring memperparah kepadatan ruang tunggu pagi hari.',
      'Loket farmasi sudah sepenuhnya terintegrasi dengan rekam medis elektronik.',
      'Seluruh pasien rumah sakit tidak perlu lagi mengantre di farmasi.',
      'Kepadatan ruang tunggu tidak ada hubungannya dengan sistem pendaftaran.',
    ],
    metode1: 'Pendaftaran daring sudah memangkas kepadatan ruang tunggu 50%, tetapi titik kemacetan (bottleneck) bergeser ke farmasi karena resep manual belum terintegrasi dengan RME.',
    metode2: 'Identifikasi bottleneck di kalimat "Namun..." → solusi logisnya adalah integrasi RME–farmasi.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Pemberian kredit usaha rakyat (KUR) berbunga rendah menunjukkan rasio kredit bermasalah yang tetap terjaga di bawah 2% pada kelompok usaha yang menerima pendampingan manajemen arus kas. Sebaliknya, pada kelompok penerima tanpa pendampingan, risiko gagal bayar meningkat hampir dua kali lipat."\nKesimpulan yang pasti benar adalah...',
    correct: 'Pendampingan manajemen arus kas berperan penting menjaga kelancaran pengembalian KUR pada pelaku usaha.',
    distractors: [
      'KUR berbunga rendah selalu menimbulkan gagal bayar tinggi di semua kelompok.',
      'Pendampingan manajemen arus kas menghapus seluruh risiko kredit bermasalah hingga 0%.',
      'Bunga rendah adalah satu-satunya faktor penentu kelancaran kredit.',
      'Pelaku usaha tanpa pendampingan memiliki rasio gagal bayar lebih rendah.',
    ],
    metode1: 'Bandingkan kedua kelompok: dengan pendampingan arus kas (NPL <2%) vs tanpa pendampingan (risiko gagal bayar hampir 2x lipat).',
    metode2: 'Hati-hati: "<2%" bukan berarti 0%! Pilih opsi yang menyoroti peran krusial pendampingan arus kas.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Pembangunan taman kota dan koridor pepohonan di pusat perkotaan dapat menurunkan suhu udara permukaan setempat antara 1,5°C hingga 3°C pada siang hari. Selain meredam efek pulau panas perkotaan, ruang terbuka hijau tersebut juga meningkatkan daya serap air hujan saat curah hujan tinggi."\nKesimpulan yang tepat adalah...',
    correct: 'Ruang terbuka hijau perkotaan memiliki fungsi ganda dalam menurunkan suhu mikro perkotaan dan membantu pengendalian limpasan air hujan.',
    distractors: [
      'Taman kota menaikkan suhu udara siang hari hingga 3°C.',
      'Ruang terbuka hijau hanya berfungsi sebagai elemen estetika kota.',
      'Pembangunan koridor pepohonan menghilangkan seluruh curah hujan di kota.',
      'Efek pulau panas perkotaan hanya terjadi pada malam hari.',
    ],
    metode1: 'Teks menjelaskan dua fungsi ekologis RTH: menurunkan suhu permukaan 1,5–3°C (meredam urban heat island) dan meningkatkan serapan air hujan.',
    metode2: 'Frasa "Selain ..., juga ..." menandakan fungsi ganda. Eliminasi opsi tunggal ("hanya estetika") dan terbalik.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Kebijakan rotasi jabatan secara berkala di lingkungan organisasi publik bertujuan mencegah kejenuhan kerja dan memperluas wawasan lintas fungsi pegawai. Agar kinerja unit tidak terganggu selama masa perpindahan, mekanisme serah terima pengetahuan (knowledge transfer) terdokumentasi wajib dilaksanakan sebelum mutasi berlaku efektif."\nKesimpulan yang pasti benar adalah...',
    correct: 'Dokumentasi serah terima pengetahuan menjadi prasyarat penting agar rotasi jabatan memberi manfaat tanpa menurunkan kinerja unit.',
    distractors: [
      'Rotasi jabatan selalu menurunkan kinerja organisasi publik secara permanen.',
      'Pegawai tidak perlu memperluas wawasan lintas fungsi selama bekerja.',
      'Serah terima pengetahuan dilakukan setelah pegawai pindah selama satu tahun.',
      'Kejenuhan kerja hanya dapat diatasi dengan menaikkan gaji.',
    ],
    metode1: 'Teks menyatakan tujuan positif rotasi dan syarat wajib pelindung kinerja: serah terima pengetahuan terdokumentasi sebelum mutasi efektif.',
    metode2: 'Fokus pada kalimat kedua ("Agar tidak terganggu ... wajib dilaksanakan sebelum mutasi").',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Digitalisasi sistem pemungutan retribusi pasar tradisional melalui transaksi elektronik meningkatkan transparansi penerimaan daerah sebesar 29%. Tantangan awal berupa kekhawatiran pedagang terhadap potongan biaya transaksi berhasil diatasi setelah pemerintah daerah mensubsidi biaya transaksi mikro dan memberikan sosialisasi langsung."\nKesimpulan yang sesuai dengan bacaan adalah...',
    correct: 'Keberhasilan digitalisasi retribusi pasar tradisional ditopang oleh penghapusan beban biaya transaksi mikro dan komunikasi langsung kepada pedagang.',
    distractors: [
      'Pedagang pasar tradisional tetap menolak retribusi elektronik meski biaya disubsidi.',
      'Digitalisasi retribusi menurunkan penerimaan daerah hingga 29%.',
      'Pemerintah daerah membebankan biaya transaksi tinggi kepada pedagang kecil.',
      'Sosialisasi langsung tidak diperlukan dalam penerapan sistem elektronik.',
    ],
    metode1: 'Teks menjelaskan cara mengatasi resistensi awal pedagang: subsidi biaya transaksi mikro + sosialisasi langsung, sehingga penerimaan naik 29%.',
    metode2: 'Cocokkan solusi yang berhasil di kalimat kedua dengan pilihan jawaban.',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Berdasarkan laporan pengawasan obat dan makanan, sebagian besar pelanggaran label pangan olahan oleh produsen skala kecil terjadi karena ketidaktahuan terhadap aturan pencantuman nilai gizi dan tanggal kedaluwarsa, bukan karena unsur kesengajaan. Oleh sebab itu, pembinaan teknis sebelum penindakan dinilai lebih tepat untuk meningkatkan kepatuhan."\nKesimpulan yang pasti benar adalah...',
    correct: 'Pendekatan pembinaan teknis diprioritaskan bagi produsen kecil karena mayoritas pelanggaran label bersumber dari kurangnya pemahaman aturan.',
    distractors: [
      'Produsen skala kecil sengaja memalsukan seluruh tanggal kedaluwarsa produknya.',
      'Aturan pencantuman nilai gizi dihapus bagi produsen pangan skala kecil.',
      'Penindakan hukum langsung tanpa pembinaan adalah satu-satunya solusi efektif.',
      'Tidak ada produsen skala kecil yang mematuhi aturan label pangan.',
    ],
    metode1: 'Teks membedakan penyebab (ketidaktahuan, bukan kesengajaan) dan rekomendasi kebijakan (pembinaan teknis sebelum penindakan).',
    metode2: 'Perhatikan hubungan sebab ("karena ketidaktahuan") → kebijakan ("pembinaan teknis lebih tepat").',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Pemanfaatan panel surya atap pada fasilitas sekolah di wilayah kepulauan mengurangi ketergantungan pada generator diesel hingga 65%. Selain menekan biaya bahan bakar bulanan, operasional laboratorium komputer menjadi lebih stabil tanpa gangguan pemadaman bergilir."\nKesimpulan yang pasti benar adalah...',
    correct: 'Pemasangan panel surya atap di sekolah kepulauan memberikan efisiensi biaya operasional sekaligus meningkatkan keandalan listrik penunjang pembelajaran.',
    distractors: [
      'Generator diesel sama sekali tidak digunakan lagi oleh seluruh sekolah di Indonesia.',
      'Panel surya atap membuat operasional laboratorium komputer sering padam.',
      'Biaya bahan bakar sekolah meningkat 65% setelah memasang panel surya.',
      'Sekolah di wilayah daratan tidak dapat memanfaatkan energi surya.',
    ],
    metode1: 'Teks memuat dua manfaat konkret: ketergantungan diesel turun 65% (hemat biaya BBM) dan listrik lab komputer lebih stabil.',
    metode2: 'Cek kata kunci: "mengurangi 65%" (bukan 100%) + "biaya turun" + "lab komputer stabil".',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Kajian mobilitas tenaga kerja menunjukkan bahwa sertifikasi kompetensi profesi meningkatkan peluang penyerapan lulusan pendidikan vokasi sebesar 38% dibandingkan lulusan tanpa sertifikasi. Namun, manfaat tersebut optimal apabila kurikulum pelatihan disusun bersama asosiasi industri terkait."\nKesimpulan yang tepat adalah...',
    correct: 'Keselarasan kurikulum vokasi dengan kebutuhan industri memperkuat dampak positif sertifikasi kompetensi terhadap penyerapan kerja.',
    distractors: [
      'Sertifikasi kompetensi tidak berpengaruh pada peluang kerja lulusan vokasi.',
      'Lulusan tanpa sertifikasi memiliki peluang kerja 38% lebih tinggi.',
      'Asosiasi industri sebaiknya tidak dilibatkan dalam penyusunan kurikulum.',
      'Semua lulusan vokasi yang bersertifikat pasti diterima bekerja pada hari kelulusan.',
    ],
    metode1: 'Sertifikasi menaikkan peluang serapan 38%, dan hasilnya optimal jika kurikulum disusun bersama asosiasi industri.',
    metode2: 'Gabungkan klausa utama (+38% peluang) + klausa syarat optimal ("apabila disusun bersama industri").',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Sistem peringatan dini kekeringan berbasis citra satelit membantu dinas pertanian menentukan jadwal tanam varietas padi tahan kering lebih awal. Akibatnya, tingkat gagal panen pada musim kemarau panjang di sentra produksi berhasil ditekan hingga separuhnya."\nKesimpulan yang pasti benar adalah...',
    correct: 'Pemanfaatan informasi citra satelit dalam perencanaan jadwal dan varietas tanam efektif menekan risiko gagal panen saat kemarau panjang.',
    distractors: [
      'Citra satelit mampu menghentikan datangnya musim kemarau panjang.',
      'Gagal panen pada musim kemarau kini sudah nol persen di seluruh daerah.',
      'Varietas padi tahan kering tidak membutuhkan jadwal tanam yang terencana.',
      'Dinas pertanian tidak lagi memerlukan data cuaca dari satelit.',
    ],
    metode1: 'Teks menunjukkan citra satelit → penyesuaian jadwal & varietas tanam → gagal panen berkurang hingga 50% (separuhnya).',
    metode2: 'Ingat: "ditekan hingga separuhnya" = turun 50%, BUKAN 0% (eliminasi opsi "nol persen").',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Penerapan kebijakan pengarsipan elektronik berbasis tanda tangan tersertifikasi memotong waktu disposisi surat antarunit dari 2 hari menjadi kurang dari 1 jam. Meskipun demikian, kepatuhan terhadap klasifikasi keamanan dokumen tetap mutlak agar informasi rahasia negara tidak tersebar di luar kewenangan."\nKesimpulan yang pasti benar adalah...',
    correct: 'Kecepatan disposisi surat elektronik harus tetap dibarengi disiplin klasifikasi keamanan dokumen untuk melindungi informasi rahasia.',
    distractors: [
      'Tanda tangan elektronik memperlambat disposisi surat antarunit hingga 2 hari.',
      'Klasifikasi keamanan dokumen tidak lagi berlaku pada surat elektronik.',
      'Semua dokumen rahasia negara boleh didisposisikan kepada pihak luar.',
      'Pengarsipan elektronik menjamin informasi rahasia tidak mungkin bocor tanpa klasifikasi.',
    ],
    metode1: 'Dua poin utama: percepatan disposisi (<1 jam) harus berjalan seiring kepatuhan klasifikasi keamanan dokumen.',
    metode2: 'Cari opsi yang memuat "kecepatan" + "tetap menjaga klasifikasi keamanan".',
  },
  {
    pertanyaan:
      'Bacalah paragraf berikut:\n"Analisis efektivitas kampanye kesehatan masyarakat memperlihatkan bahwa pesan edukasi yang disampaikan melalui tokoh masyarakat lokal dan bahasa daerah memiliki tingkat pemahaman 2 kali lebih tinggi dibanding brosur teknis berbahasa formal semata. Pendekatan komunikasi budaya terbukti mempercepat perubahan perilaku hidup bersih."\nKesimpulan yang paling tepat adalah...',
    correct: 'Adaptasi komunikasi kesehatan menggunakan tokoh lokal dan bahasa daerah lebih efektif mendorong pemahaman dan perubahan perilaku warga.',
    distractors: [
      'Brosur berbahasa formal selalu gagal dipahami oleh seluruh warga.',
      'Tokoh masyarakat lokal tidak efektif dalam menyampaikan pesan kesehatan.',
      'Perilaku hidup bersih hanya dapat diubah melalui peraturan denda.',
      'Bahasa daerah menghambat penyampaian informasi medis kepada masyarakat.',
    ],
    metode1: 'Teks membandingkan efektivitas komunikasi berbasis tokoh lokal + bahasa daerah (pemahaman 2x lebih tinggi & mempercepat perubahan perilaku) dibanding brosur teknis formal semata.',
    metode2: 'Pilih opsi yang selaras dengan kunci "tokoh lokal + bahasa daerah lebih efektif". Eliminasi klaim absolut "selalu gagal".',
  },
];

export const TIU_VERBAL_QUESTIONS: SeedQuestion[] = [
  ...ANALOGY_SPECS.map((spec, idx) =>
    buildShuffled(
      idx,
      'Verbal - Analogi',
      `Tentukan pasangan kata yang memiliki hubungan logis paling setara dengan pasangan kata berikut!\n${spec.stem}`,
      spec.correct,
      spec.distractors,
      spec.rel,
      spec.trick
    )
  ),
  ...SYLLOGISM_SPECS.map((spec, idx) =>
    buildShuffled(
      idx + 2,
      'Verbal - Silogisme & Penalaran Logis',
      spec.pertanyaan,
      spec.correct,
      spec.distractors,
      spec.metode1,
      spec.metode2
    )
  ),
  ...CLEAN_ANALYTICAL_25.map((spec, idx) =>
    buildShuffled(
      idx + 1,
      'Verbal - Penalaran Analitis',
      spec.pertanyaan,
      spec.correct,
      spec.distractors,
      spec.metode1,
      spec.metode2
    )
  ),
  ...READING_SPECS.map((spec, idx) =>
    buildShuffled(
      idx + 3,
      'Verbal - Pemahaman Bacaan',
      spec.pertanyaan,
      spec.correct,
      spec.distractors,
      spec.metode1,
      spec.metode2
    )
  ),
];
