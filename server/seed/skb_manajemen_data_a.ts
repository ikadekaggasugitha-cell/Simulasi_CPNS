import type { SkbHotsItem } from './skb_hots_builder';

export const SKB_MANAJEMEN_DATA_A: SkbHotsItem[] = [
  {
    level: 'C5',
    topik: 'Tata Kelola SPBE - Interoperabilitas & SPLP (Perpres 95/2018)',
    pertanyaan:
      'Pemerintah Provinsi memiliki 28 Organisasi Perangkat Daerah (OPD) yang saling bertukar data kependudukan, perizinan, dan bantuan sosial. Saat ini integrasi dibangun secara *point-to-point* langsung antar-database dan API tersendiri tanpa standar seragam, sehingga setiap perubahan skema pada 1 OPD memicu gangguan berantai di 12 OPD lain (membentuk pola *spaghetti integration*). Kominfo daerah berencana membenahi integrasi agar selaras dengan **Perpres No. 95 Tahun 2018 tentang SPBE**.\n\nArsitektur dan mekanisme interoperabilitas manakah yang paling tepat diterapkan sesuai prinsip SPBE?',
    jawabanBenar:
      'Mengintegrasikan pertukaran data antar-OPD melalui **Sistem Penghubung Layanan Pemerintah (SPLP)** terpusat berbasis API terstandar (katalog layanan, kontrak skema terversi, autentikasi/otorisasi terpusat, dan audit log pertukaran) yang selaras dengan Arsitektur SPBE dan standar interoperabilitas Satu Data Indonesia.',
    pengecoh4: [
      'Membagikan kredensial *read-only* langsung ke basis data produksi setiap OPD kepada 27 OPD lainnya agar kueri SQL lintas instansi dapat dijalankan tanpa lapisan layanan API.',
      'Mengharuskan seluruh 28 OPD mengekspor data harian ke berkas Excel dan mengirimkannya melalui grup pesan instan agar tidak memerlukan biaya pengembangan layanan integrasi.',
      'Menyalin seluruh tabel transaksi dari 28 OPD ke satu basis data monolitik tunggal tanpa pemisahan kepemilikan data maupun otorisasi antar-unit kerja.',
      'Membiarkan koneksi *point-to-point* tetap berjalan permanen lalu meminta setiap OPD membangun masing-masing 27 *adapter* kustom tambahan untuk mengantisipasi perubahan skema.',
    ],
    akarMasalah:
      'Integrasi *point-to-point* menghasilkan kompleksitas koneksi O(N^2), ketergantungan skema erat (*tight coupling*), dan ketiadaan tata kelola keamanan serta audit pertukaran data lintas instansi.',
    solusiTerbaik:
      'SPLP sesuai Perpres No. 95 Tahun 2018 berfungsi sebagai *enterprise service bus*/API gateway pemerintah yang menstandarkan kontrak interoperabilitas, keamanan akses, dan jejak audit pertukaran data.',
    analisisPengecoh:
      'Akses langsung ke DB produksi melanggar enkapsulasi dan memicu coupling fatal saat skema berubah; ekspor Excel lewat pesan instan tidak real-time dan rawan kebocoran data; menyatukan paksa ke satu DB monolitik mengaburkan kepemilikan data (Wali/Produsen Data); menambah 27 adapter per OPD makin memperparah kompleksitas O(N^2).',
  },
  {
    level: 'C5',
    topik: 'Tata Kelola SPBE - Aplikasi Umum vs Aplikasi Khusus & Clearance',
    pertanyaan:
      'Sebuah Pemerintah Kabupaten berencana menganggarkan Rp 4,2 miliar untuk membangun aplikasi kearsipan surat dinas baru dari nol bersama vendor lokal karena ingin tampilan antarmuka yang berbeda dari kabupaten tetangga. Namun tim Analis Sistem Informasi mengingatkan kewajiban kepatuhan terhadap **Perpres No. 95 Tahun 2018** dan kebijakan moratorium pembangunan aplikasi sejenis.\n\nEvaluasi kebijakan SPBE manakah yang paling tepat untuk direkomendasikan kepada pimpinan daerah?',
    jawabanBenar:
      'Kearsipan dinamis merupakan proses bisnis generik yang berlaku sama di seluruh instansi sehingga masuk kategori **Aplikasi Umum SPBE** (seperti SRIKANDI yang ditetapkan pemerintah pusat); instansi wajib mengadopsi dan berbagi pakai Aplikasi Umum tersebut alih-alih membangun duplikasi, sedangkan pembangunan **Aplikasi Khusus** hanya boleh diusulkan bila memenuhi kebutuhan spesifik unik instansi dan telah lulus pertimbangan/clearance arsitektur SPBE.',
    pengecoh4: [
      'Menyetujui pembangunan aplikasi kearsipan baru dari nol karena setiap pemerintah daerah memiliki otonomi mutlak untuk membuat aplikasi surat-menyurat sendiri selama memakai anggaran APBD.',
      'Membangun aplikasi kearsipan baru tersebut lalu menamainya "Modul Inovasi Khusus" tanpa melaporkan ke Tim Koordinasi SPBE agar lolos dari evaluasi belanja TIK.',
      'Menghentikan penggunaan seluruh sistem kearsipan elektronik dan kembali ke pencatatan buku agenda kertas agar tidak melanggar ketentuan Aplikasi Umum SPBE.',
      'Membeli lisensi perangkat lunak kearsipan tertutup luar negeri tanpa standar interoperabilitas SPLP supaya tidak dianggap membangun aplikasi dari nol.',
    ],
    akarMasalah:
      'Pembangunan aplikasi berulang untuk fungsi pemerintahan generik (kearsipan, kepegawaian, perencanaan, penganggaran) memboroskan anggaran negara dan menciptakan silo data nasional.',
    solusiTerbaik:
      'Perpres 95/2018 membedakan Aplikasi Umum (wajib bagi pakai lintas instansi untuk proses bisnis sama) dan Aplikasi Khusus (khusus kebutuhan unik instansi dengan syarat tidak menduplikasi Aplikasi Umum serta memenuhi standar interoperabilitas dan clearance).',
    analisisPengecoh:
      'Otonomi daerah tetap tunduk pada kebijakan arsitektur & efisiensi belanja SPBE nasional; mengubah label menjadi "Modul Khusus" adalah pelanggaran kepatuhan; kembali ke kertas bertentangan dengan transformasi digital SPBE; membeli produk tertutup non-interoperabel tetap melanggar kewajiban adopsi Aplikasi Umum.',
  },
  {
    level: 'C6',
    topik: 'Tata Kelola SPBE - Konsolidasi Pusat Data Nasional (PDN)',
    pertanyaan:
      'Hasil inventarisasi infrastruktur di sebuah kementerian menemukan 18 unit eselon II masing-masing mengelola ruang server terpisah di ruang kerja dengan pendingin AC rumah tangga, tanpa UPS redundan, tanpa pemantauan keamanan 24/7, dan utilisasi CPU rata-rata hanya 8%. Kementerian ingin menyusun peta jalan konsolidasi infrastruktur yang selaras dengan **Perpres No. 95 Tahun 2018**.\n\nLangkah strategis dan teknis manakah yang paling tepat dirancang oleh tim tata kelola TI?',
    jawabanBenar:
      'Menghentikan pengadaan ruang server baru di tingkat unit kerja, memetakan inventaris serta klasifikasi beban kerja (aplikasi & data) ke dalam Arsitektur SPBE, melakukan virtualisasi/kontainerisasi serta migrasi bertahap menuju **Pusat Data Nasional (PDN)** (atau konsolidasi pusat data terstandar yang terinterkoneksi ke PDN selama masa transisi) lengkap dengan perencanaan kesiapan keamanan, bandwidth Jaringan Intra Pemerintah, dan DRP.',
    pengecoh4: [
      'Memperluas kapasitas listrik dan membeli 18 set server fisik baru yang lebih besar untuk masing-masing unit eselon II agar setiap unit tetap memiliki kemandirian penuh atas ruang servernya.',
      'Langsung mematikan seluruh 18 ruang server secara serentak dalam satu malam lalu memindahkan seluruh aplikasi legacy tanpa asesmen kompatibilitas maupun uji kinerja ke layanan hosting murah.',
      'Memindahkan seluruh basis data rahasia kementerian ke akun penyimpanan cloud pribadi milik kepala bagian TI agar menghemat biaya pemeliharaan AC ruang server.',
      'Membiarkan 18 ruang server berjalan terpisah selamanya cukup dengan menempelkan stiker "Pusat Data SPBE" di pintu setiap ruang server unit kerja.',
    ],
    akarMasalah:
      'Fragmentasi 18 ruang server non-standar menimbulkan pemborosan energi/anggaran, utilisasi rendah (8%), kerentanan fisik/siber tinggi, dan bertentangan dengan mandat konsolidasi Pusat Data Nasional (PDN) dalam SPBE.',
    solusiTerbaik:
      'Konsolidasi terencana menuju PDN melalui asesmen aplikasi/data, modernisasi (virtualisasi/kontainer), penguatan Jaringan Intra Pemerintah, dan kesiapan DRP mengoptimalkan efisiensi serta keandalan layanan publik.',
    analisisPengecoh:
      'Membeli 18 server fisik baru melanggar moratorium pusat data baru SPBE; migrasi big-bang tanpa asesmen menyebabkan downtime parah; menaruh data negara di akun pribadi melanggar keamanan dan regulasi data; pelabelan kosmetik tidak memperbaiki standar Tier/keamanan infrastruktur.',
  },
  {
    level: 'C4',
    topik: 'Tata Kelola SPBE - 6 Domain Arsitektur SPBE & Urutan Penyusunan',
    pertanyaan:
      'Tim penyusun Peta Rencana SPBE sebuah dinas langsung membeli 12 perangkat lunak aplikasi dan 4 server baru di tahun pertama tanpa terlebih dahulu memetakan proses bisnis lintas bidang maupun standar data. Akibatnya, separuh aplikasi yang dibeli saling tumpang tindih fungsi, tidak bisa saling bertukar data, dan memiliki celah keamanan saat diuji.\n\nDitinjau dari **6 Domain Arsitektur SPBE (Perpres No. 95 Tahun 2018)**, kesalahan mendasar apa yang terjadi dan bagaimana urutan ketergantungan arsitektur yang benar?',
    jawabanBenar:
      'Tim langsung melompat ke pengadaan Domain Aplikasi dan Infrastruktur tanpa fondasi **Domain Proses Bisnis** dan **Domain Data & Informasi**; penyusunan Arsitektur SPBE wajib berangkat dari Proses Bisnis -> Data & Informasi -> Layanan SPBE -> Aplikasi SPBE -> Infrastruktur SPBE, dengan **Domain Keamanan SPBE** yang melekat (*cross-cutting*) melindungi seluruh domain tersebut.',
    pengecoh4: [
      'Kesalahan terjadi karena tim lupa membeli perangkat jaringan terlebih dahulu; menurut Perpres 95/2018, Arsitektur SPBE harus selalu dimulai dari pengadaan Infrastruktur Perangkat Keras baru kemudian menyesuaikan Proses Bisnis instansi.',
      'Domain Keamanan SPBE hanya relevan pada tahap paling akhir setelah aplikasi berjalan 2 tahun di produksi sehingga wajar jika tidak dimasukkan saat perancangan awal.',
      'Tumpang tindih aplikasi terjadi karena instansi seharusnya hanya memiliki 3 domain SPBE (Hardware, Software, dan Brainware) tanpa perlu memetakan Data dan Layanan.',
      'Solusi terbaik adalah membangun 12 aplikasi penghubung tambahan untuk menjembatani ke-12 aplikasi tumpang tindih tersebut tanpa meninjau ulang Proses Bisnis.',
    ],
    akarMasalah:
      'Pengadaan teknologi (*technology-first*) tanpa didahului pemetaan Proses Bisnis dan Arsitektur Data menghasilkan duplikasi aplikasi, silo informasi, dan kegagalan integrasi.',
    solusiTerbaik:
      '6 Domain Arsitektur SPBE bersifat holistik: Proses Bisnis dan Data/Informasi menjadi acuan Layanan dan Aplikasi, ditopang Infrastruktur, serta dipayungi Keamanan SPBE sejak tahap desain (*security by design*).',
    analisisPengecoh:
      'Memulai dari pengadaan perangkat keras justru sumber pemborosan; keamanan tidak boleh ditunda hingga 2 tahun pasca-rilis; SPBE menetapkan 6 domain arsitektur baku (bukan sekadar hardware/software/brainware); menambal duplikasi dengan aplikasi baru memperparah utang teknis.',
  },
  {
    level: 'C5',
    topik: 'Tata Kelola SPBE - Ruang Lingkup & Independensi Audit TIK SPBE',
    pertanyaan:
      'Menjelang evaluasi indeks SPBE tahunan, Kepala Dinas TI mengusulkan agar Audit TIK terhadap aplikasi layanan publik utama dan keamanan sistem dilakukan oleh tim pengembang internal yang sama yang menulis kode aplikasi tersebut agar laporan audit selesai cepat dan mendapat nilai tinggi.\n\nEvaluasi usulan tersebut berdasarkan ketentuan **Audit TIK dalam Perpres No. 95 Tahun 2018**:',
    jawabanBenar:
      'Usulan tersebut melanggar prinsip independensi dan objektivitas audit; Audit TIK SPBE mencakup tiga fokus utama (**Audit Infrastruktur SPBE, Audit Aplikasi SPBE, dan Audit Keamanan SPBE**) yang wajib dilaksanakan secara berkala oleh **lembaga pelaksana audit TIK pemerintah/independen yang terakreditasi** (atau inspektorat/auditor internal yang independen dari fungsi pengembangan/operasional untuk audit internal) sesuai standar teknis baku.',
    pengecoh4: [
      'Usulan tersebut sudah sesuai Perpres 95/2018 karena pengembang aplikasi merupakan pihak yang paling mengetahui kode sumber sehingga paling sah menandatangani sertifikat kelayakan audit keamanan.',
      'Audit TIK SPBE dalam Perpres 95/2018 hanya berfokus pada pemeriksaan kuitansi pengadaan barang/jasa komputer dan tidak mencakup pemeriksaan arsitektur aplikasi maupun keamanan informasi.',
      'Audit Keamanan SPBE hanya diwajibkan bagi kementerian pertahanan, sedangkan pemerintah daerah cukup melakukan uji coba tampilan antarmuka pengguna.',
      'Audit TIK cukup dilakukan satu kali saja seumur hidup aplikasi saat serah terima proyek pertama kali dan tidak perlu diulang meskipun aplikasi mengalami perubahan besar.',
    ],
    akarMasalah:
      'Konflik kepentingan (*self-review threat*) muncul bila pembuat sistem mengaudit hasil kerjanya sendiri, sehingga temuan kerentanan dan ketidakpatuhan arsitektur berisiko diabaikan.',
    solusiTerbaik:
      'Audit TIK SPBE (Infrastruktur, Aplikasi, Keamanan) dilaksanakan secara independen dan berkala mengacu standar teknis/lembaga berwenang (BRIN/BSSN/Kominfo/Lembaga Audit TIK terakreditasi) demi objektivitas dan peningkatan kapabilitas nyata.',
    analisisPengecoh:
      'Pengembang tidak boleh menjadi auditor atas kodenya sendiri; Audit TIK memeriksa aspek teknis/tata kelola sistem bukan sekadar kuitansi keuangan; seluruh instansi pusat dan daerah penyelenggara SPBE wajib diaudit; audit dilakukan secara berkala (minimal sesuai siklus/perubahan signifikan), bukan sekali seumur hidup.',
  },
  {
    level: 'C4',
    topik: 'UU PDP 27/2022 - Klasifikasi Data Pribadi Spesifik vs Umum',
    pertanyaan:
      'Dinas Kesehatan membangun portal skrining kesehatan digital bagi masyarakat yang mengumpulkan kolom data berikut dalam satu tabel:\n\n```text\n[1] Nama lengkap & jenis kelamin        [4] Riwayat diagnosis penyakit kronis\n[2] Kewarganegaraan & alamat domisili   [5] Template sidik jari & pengenalan wajah (biometrik)\n[3] Nomor telepon & alamat email        [6] Data rekam medis anak usia 8 tahun\n```\n\nBerdasarkan **UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)**, manakah kelompok data yang tergolong **Data Pribadi yang Bersifat Spesifik** dan apa implikasi teknis wajib bagi pengelola sistem?',
    jawabanBenar:
      'Kelompok [4] informasi kesehatan, [5] data biometrik, dan [6] data anak tergolong **Data Pribadi yang Bersifat Spesifik** (Pasal 4 ayat 2 UU PDP), yang menuntut tingkat perlindungan lebih ketat seperti kewajiban Penilaian Dampak Pelindungan Data Pribadi (DPIA) bila berisiko tinggi, enkripsi kuat at-rest & in-transit, kontrol akses sangat terbatas, serta persetujuan sah dari orang tua/wali untuk pemrosesan data anak.',
    pengecoh4: [
      'Hanya kelompok [5] sidik jari yang termasuk Data Pribadi Spesifik, sedangkan riwayat penyakit kronis [4] dan data anak [6] termasuk Data Pribadi Umum yang boleh dibagikan terbuka untuk riset tanpa anonimisasi.',
      'Kelompok [1] nama lengkap dan [2] kewarganegaraan tergolong Data Pribadi Spesifik, sedangkan [4] riwayat penyakit dan [5] biometrik merupakan Data Pribadi Umum.',
      'Seluruh enam kelompok data tersebut tidak diatur oleh UU PDP karena dikumpulkan oleh instansi pemerintah untuk layanan kesehatan gratis, bukan oleh perusahaan swasta komersial.',
      'Data Pribadi Spesifik cukup dilindungi dengan menyembunyikan nama kolom di tampilan frontend tanpa perlu enkripsi penyimpanan, DPIA, maupun persetujuan orang tua/wali.',
    ],
    akarMasalah:
      'Salah mengklasifikasikan Data Pribadi Spesifik sebagai data umum mengakibatkan penerapan kontrol keamanan dan kepatuhan hukum (seperti DPIA dan persetujuan wali anak) menjadi di bawah standar UU PDP.',
    solusiTerbaik:
      'Pasal 4 ayat (2) UU PDP secara eksplisit menggolongkan data kesehatan, biometrik, genetika, catatan kejahatan, data anak, keuangan pribadi, dan data lain sesuai peraturan sebagai Data Pribadi Spesifik yang berdampak lebih besar bila bocor sehingga memerlukan pengamanan berlapis.',
    analisisPengecoh:
      'Data kesehatan dan data anak keduanya eksplisit masuk Data Pribadi Spesifik; nama dan kewarganegaraan adalah Data Pribadi Umum; UU PDP berlaku penuh untuk badan publik/pemerintah maupun swasta; menyembunyikan kolom UI tidak memenuhi kewajiban pelindungan teknis maupun hukum.',
  },
  {
    level: 'C4',
    topik: 'UU PDP 27/2022 - Tenggat Notifikasi Kebocoran Data (3×24 Jam)',
    pertanyaan:
      'Pada hari Selasa pukul 10.00 WIB, tim CSIRT sebuah instansi mengonfirmasi terjadinya kebocoran data (*personal data breach*) yang mengekspor 45.000 baris data NIK, nama, dan rekening penerima bantuan sosial akibat celah SQL Injection. Sebagian pejabat menyarankan agar insiden dirahasiakan selama 2 minggu sampai investigasi internal selesai 100% agar tidak menimbulkan kegaduhan publik.\n\nBerdasarkan **Pasal 46 UU No. 27 Tahun 2022 (UU PDP)**, tindakan apa yang WAJIB dilakukan Pengendali Data Pribadi?',
    jawabanBenar:
      'Menyampaikan **pemberitahuan secara tertulis paling lambat 3×24 jam** sejak kegagalan pelindungan data diketahui kepada **Subjek Data Pribadi** dan **Lembaga penyelenggara PDP** yang sekurang-kurangnya memuat: (1) data pribadi yang terungkap, (2) kapan dan bagaimana data terungkap, serta (3) upaya penanganan dan pemulihan yang telah dan sedang dilakukan, tanpa menunda hingga seluruh investigasi jangka panjang tuntas.',
    pengecoh4: [
      'Menyetujui saran pejabat untuk merahasiakan insiden selama 14 hari kerja karena UU PDP mengizinkan notifikasi ditunda tanpa batas waktu selama tim teknis masih menganalisis log.',
      'Cukup menyampaikan laporan lisan secara informal kepada pimpinan instansi sendiri tanpa perlu memberitahu Subjek Data Pribadi maupun Lembaga PDP selama data belum dijual di forum gelap.',
      'Menyampaikan notifikasi tertulis paling lambat 30 hari kalender hanya kepada Lembaga PDP saja, karena memberitahu masyarakat yang datanya bocor justru dilarang oleh UU PDP.',
      'Langsung menghapus seluruh basis data penerima bantuan sosial dan log akses server dalam waktu 24 jam agar kewajiban pelaporan kegagalan pelindungan data otomatis gugur.',
    ],
    akarMasalah:
      'Menutupi atau menunda pelaporan kebocoran data melampaui batas waktu hukum merampas hak subjek data untuk segera melakukan langkah mitigasi mandiri (seperti waspada phishing/penipuan rekening) dan melanggar mandat eksplisit UU PDP.',
    solusiTerbaik:
      'Pasal 46 UU PDP menetapkan kewajiban notifikasi tertulis maksimal 3×24 jam ke Subjek Data dan Lembaga PDP beserta tiga elemen wajib (apa yang bocor, kapan/bagaimana terjadi, upaya penanganan & pemulihan).',
    analisisPengecoh:
      'Penundaan 14 hari atau 30 hari melanggar batas 3×24 jam; laporan internal saja tidak memenuhi kewajiban eksternal; memberitahu Subjek Data justru wajib (kecuali pengecualian hukum ketat tertentu seperti pertahanan/keamanan negara); menghapus log dan DB adalah pelanggaran berat dan perusakan bukti.',
  },
  {
    level: 'C5',
    topik: 'UU PDP 27/2022 - Tanggung Jawab Pengendali vs Prosesor Data',
    pertanyaan:
      'Dinas Pendidikan (Instansi A) menggunakan vendor cloud SaaS (Vendor B) untuk mengoperasikan sistem PPDB daring sesuai spesifikasi dan instruksi tertulis dari Dinas Pendidikan. Suatu hari, karyawan Vendor B secara sepihak menggunakan data nomor telepon orang tua siswa di server PPDB untuk memasarkan kursus bimbel milik anak perusahaan Vendor B tanpa izin Dinas Pendidikan.\n\nBerdasarkan **UU No. 27 Tahun 2022**, bagaimana posisi hukum masing-masing pihak dan pertanggungjawaban atas pelanggaran pemrosesan di luar instruksi tersebut?',
    jawabanBenar:
      'Dinas Pendidikan berstatus **Pengendali Data Pribadi** (penentu tujuan dan kendali pemrosesan) dan Vendor B berstatus **Prosesor Data Pribadi**; karena Vendor B memproses data di luar perintah dan tujuan yang ditetapkan Pengendali Data, sesuai **Pasal 51 ayat (4) UU PDP**, pemrosesan melampaui instruksi tersebut menjadi **tanggung jawab Prosesor Data Pribadi** (Vendor B), sementara Dinas Pendidikan tetap wajib memiliki Perjanjian Pemrosesan Data (DPA) dan mekanisme pengawasan vendor.',
    pengecoh4: [
      'Dinas Pendidikan otomatis bebas dari segala kewajiban pengawasan dan tidak perlu menandatangani kontrak pelindungan data (DPA) karena seluruh kewajiban UU PDP sejak awal berpindah ke Vendor B.',
      'Vendor B otomatis bebas dari sanksi hukum apa pun karena dalam UU PDP hanya Pengendali Data Pribadi (instansi pemerintah) yang dapat dimintai pertanggungjawaban atas penyalahgunaan data.',
      'Penggunaan nomor telepon orang tua untuk promosi bimbel tersebut sah secara hukum selama Vendor B mencantumkan klausul promosi kecil di bagian bawah berkas Syarat & Ketentuan server cloud.',
      'Baik Dinas Pendidikan maupun Vendor B sama-sama berstatus Subjek Data Pribadi sehingga perselisihan tersebut hanya diselesaikan sebagai keluhan layanan biasa tanpa aspek UU PDP.',
    ],
    akarMasalah:
      'Kerancuan peran antara *Data Controller* (Pengendali) dan *Data Processor* (Prosesor) sering memicu salah kaprah tanggung jawab ketika vendor melakukan penyalahgunaan tujuan pemrosesan (*purpose deviation*).',
    solusiTerbaik:
      'UU PDP mengatur bahwa Pengendali menentukan tujuan dan wajib mengikat Prosesor lewat kontrak/instruksi; namun bila Prosesor memproses data di luar instruksi Pengendali (Pasal 51 ayat 4), Prosesor menanggung tanggung jawab hukum penuh atas pelanggaran tersebut.',
    analisisPengecoh:
      'Pengendali tetap memiliki kewajiban memilih prosesor yang andal dan mengikat DPA; Prosesor jelas dapat dikenai tanggung jawab hukum bila melanggar instruksi; promosi tanpa dasar hukum melanggar *purpose limitation*; Subjek Data adalah orang perseorangan (orang tua/siswa), bukan instansi/vendor.',
  },
  {
    level: 'C4',
    topik: 'UU PDP 27/2022 - Dasar Hukum Pemrosesan Data oleh Instansi Pemerintah',
    pertanyaan:
      'Sebuah tim pengembang aplikasi perpajakan daerah berdebat: sebagian anggota bersikeras bahwa aplikasi wajib menampilkan tombol "Saya Setuju/Tolak" dan jika wajib pajak mengklik "Tolak", maka Dinas Pendapatan dilarang menyimpan data NPWPD dan tagihan pajaknya berdasarkan UU PDP. Sebagian lain menilai pemrosesan data pajak tetap sah meski tanpa persetujuan sukarela wajib pajak.\n\nEvaluasi argumen tersebut berdasarkan **Pasal 20 ayat (2) UU No. 27 Tahun 2022**:',
    jawabanBenar:
      'Persetujuan eksplisit (*consent*) hanyalah salah satu dari **6 dasar hukum pemrosesan data pribadi**; pemrosesan data perpajakan oleh Dinas Pendapatan sah menggunakan dasar hukum **pemenuhan kewajiban hukum** dan/atau **pelaksanaan tugas dalam rangka kepentingan umum, pelayanan publik, atau pelaksanaan kewenangan Pengendali Data Pribadi berdasarkan peraturan perundang-undangan**, dengan tetap wajib memenuhi transparansi informasi dan keamanan data.',
    pengecoh4: [
      'Argumen tim pertama benar: tanpa persetujuan sukarela (*opt-in consent*) dari wajib pajak, instansi pemerintah mana pun dilarang mutlak memproses data perpajakan maupun kependudukan.',
      'Instansi pemerintah tidak memerlukan dasar hukum pemrosesan data apa pun karena seluruh 6 dasar hukum pada Pasal 20 UU PDP hanya berlaku untuk perusahaan e-commerce swasta.',
      'Dasar hukum yang harus dipakai untuk pemungutan pajak wajib adalah *kepentingan sah lainnya (legitimate interest)* saja agar pemerintah tidak perlu mengacu pada peraturan perundang-undangan.',
      'Jika wajib pajak menolak menyetujui formulir, pemerintah boleh memproses datanya secara diam-diam tanpa pemberitahuan informasi pemrosesan (*privacy notice*) sama sekali.',
    ],
    akarMasalah:
      'Kesalahpahaman umum menyamakan kepatuhan UU PDP semata-mata dengan kotak centang persetujuan (*consent*), padahal layanan publik/kewenangan hukum memiliki dasar hukum tersendiri.',
    solusiTerbaik:
      'Pasal 20 ayat (2) UU PDP menetapkan 6 dasar pemrosesan sah: (a) persetujuan eksplisit, (b) pemenuhan kewajiban perjanjian, (c) pemenuhan kewajiban hukum, (d) kepentingan vital subjek data, (e) kepentingan umum/pelayanan publik/kewenangan hukum, dan (f) kepentingan sah lainnya. Kewenangan pajak berada pada poin (c)/(e), namun kewajiban transparansi & keamanan tetap berlaku.',
    analisisPengecoh:
      'Mengandalkan *consent* untuk pajak keliru karena warga tidak memiliki kebebasan menolak kewajiban pajak; UU PDP berlaku bagi badan publik; dasar hukum kewenangan undang-undang lebih tepat daripada *legitimate interest* komersial; pemrosesan tetap wajib transparan melalui pemberitahuan informasi pemrosesan.',
  },
  {
    level: 'C6',
    topik: 'UU PDP 27/2022 - Penilaian Dampak Pelindungan Data Pribadi (DPIA)',
    pertanyaan:
      'Pemerintah kota berencana memasang 500 kamera CCTV cerdas berbasis AI pengenalan wajah (*facial recognition*) otomatis di seluruh ruang publik dan mengaitkannya secara real-time dengan basis data kependudukan guna memantau kehadiran warga pada program bantuan sosial. Sebelum pengadaan dieksekusi, Pejabat Pelindung Data Pribadi (PPDP) diminta menentukan langkah kepatuhan wajib.\n\nSesuai **Pasal 34 UU No. 27 Tahun 2022**, instrumen tata kelola apa yang WAJIB dilakukan sebelum sistem tersebut dibangun/dioperasikan?',
    jawabanBenar:
      'Wajib melaksanakan **Penilaian Dampak Pelindungan Data Pribadi (DPIA / Data Protection Impact Assessment)** karena memenuhi kriteria pemrosesan berisiko tinggi (penggunaan teknologi baru, pemrosesan data biometrik spesifik dalam skala besar, pemantauan sistematis area publik, dan pencocokan/penggabungan kumpulan data) guna menilai proporsionalitas, risiko hak warga, serta merancang mitigasi teknis sebelum implementasi.',
    pengecoh4: [
      'Cukup melakukan uji kecepatan pengenalan wajah (*benchmark FPS*) kamera di laboratorium vendor tanpa perlu mengkaji dampak privasi karena kamera dipasang di area publik terbuka.',
      'Menunda seluruh kajian privasi hingga 1 tahun setelah 500 kamera beroperasi penuh agar tersedia cukup banyak rekaman wajah warga untuk dijadikan sampel evaluasi.',
      'Menghapus seluruh mekanisme pemberitahuan publik mengenai keberadaan kamera pengenalan wajah agar warga tidak mengubah perilaku alaminya di ruang publik.',
      'Mengalihkan seluruh rekaman biometrik wajah ke server milik vendor kamera luar negeri tanpa DPIA agar tanggung jawab risiko tinggi tidak berada pada pemerintah kota.',
    ],
    akarMasalah:
      'Pemrosesan biometrik skala besar di ruang publik disertai pencocokan lintas basis data membawa risiko tinggi terhadap hak privasi dan potensi penyalahgunaan pengawasan (*mass surveillance*).',
    solusiTerbaik:
      'Pasal 34 UU PDP mewajibkan DPIA sebelum pemrosesan berisiko tinggi dilakukan (teknologi baru, data spesifik/biometrik, skala besar, pemantauan sistematis, penggabungan dataset) guna menegakkan *privacy by design* dan proporsionalitas.',
    analisisPengecoh:
      'Uji FPS hanya metrik performa bukan kajian hak privasi; DPIA wajib *ex-ante* (sebelum operasi), bukan setelah 1 tahun berjalan; pengumpulan diam-diam melanggar asas transparansi; memindahkan ke vendor luar negeri justru menambah pelanggaran transfer lintas batas tanpa menghapus tanggung jawab Pengendali Data.',
  },
  {
    level: 'C5',
    topik: 'UU PDP 27/2022 - Peran Pejabat Pelindung Data Pribadi (PPDP/DPO)',
    pertanyaan:
      'Sebuah instansi pengelola jaminan sosial nasional memproses data kesehatan dan keuangan 80 juta warga secara teratur dan sistematis setiap hari. Untuk menghemat struktur organisasi, pimpinan mempertimbangkan menunjuk Kepala Divisi Pemasaran & Analitik Data (yang menentukan tujuan pemanfaatan data dan menargetkan monetisasi analitik) merangkap sebagai **Pejabat Pelindung Data Pribadi (PPDP/DPO)**.\n\nEvaluasi kelayakan penunjukan tersebut menurut **Pasal 53–54 UU No. 27 Tahun 2022**:',
    jawabanBenar:
      'Instansi tersebut wajib menunjuk PPDP/DPO karena memproses data untuk kepentingan pelayanan publik, pemantauan teratur skala besar, dan data spesifik skala besar; namun menunjuk Kepala Divisi Analitik yang menentukan tujuan pemrosesan menimbulkan **konflik kepentingan** — PPDP harus memiliki kompetensi hukum/privasi & TI, bertindak independen dalam mengawasi kepatuhan, memberi saran DPIA, serta menjadi narahubung Lembaga PDP.',
    pengecoh4: [
      'Instansi tidak wajib menunjuk PPDP/DPO sama sekali karena seluruh data yang dikelola bersifat digital di dalam server internal sehingga cukup diawasi oleh administrator jaringan.',
      'Penunjukan Kepala Divisi Analitik tersebut sangat ideal karena pihak yang menentukan tujuan pemrosesan data memang diwajibkan merangkap sebagai pengawas kepatuhannya sendiri.',
      'Tugas utama PPDP/DPO menurut UU PDP adalah menuliskan kode enkripsi basis data secara langsung dan bertanggung jawab secara pidana menggantikan pimpinan instansi bila terjadi kebocoran.',
      'PPDP/DPO hanya boleh dijabat oleh konsultan asing dari luar negeri dan dilarang berasal dari pegawai internal instansi yang profesional dan independen.',
    ],
    akarMasalah:
      'Rangkap jabatan antara penentu tujuan pemrosesan data dan pengawas kepatuhan privasi (PPDP/DPO) menciptakan konflik kepentingan struktural yang melemahkan independensi pengawasan.',
    solusiTerbaik:
      'Pasal 53–54 UU PDP mewajibkan PPDP pada layanan publik/skala besar/data spesifik, dengan penunjukan berbasis profesionalitas, pengetahuan hukum & praktik PDP, serta kebebasan dari konflik kepentingan (dapat internal maupun eksternal).',
    analisisPengecoh:
      'Memproses data kesehatan 80 juta warga jelas memicu kewajiban PPDP; konflik kepentingan harus dihindari; PPDP bertugas menasihati, memantau kepatuhan, mengawal DPIA, dan berkoordinasi dengan otoritas — bukan coder tunggal atau tumbal pidana personal; PPDP boleh berasal dari internal maupun eksternal.',
  },
  {
    level: 'C4',
    topik: 'UU PDP 27/2022 - Prinsip Data Minimization & Purpose Limitation',
    pertanyaan:
      'Formulir pendaftaran daring untuk mengikuti webinar gratis "Literasi Digital ASN" yang dibuat sebuah unit kerja mewajibkan peserta mengisi 14 kolom berikut sebelum tombol Daftar aktif:\n\n```text\nWajib diisi: Nama, Email, Instansi, NIK (16 digit), Nomor KK, Nama Ibu Kandung,\nFoto Selfie memegang KTP, Nomor Rekening Bank, dan Golongan Darah.\n```\n\nDitinjau dari prinsip pelindungan data pribadi (**Pasal 16 ayat 2 UU PDP**), pelanggaran prinsip apa yang terjadi dan perbaikan desain formulir manakah yang paling tepat?',
    jawabanBenar:
      'Melanggar prinsip **pembatasan tujuan (*purpose limitation*)** dan **minimalisasi data (*data minimization*)** karena mengumpulkan data sensitif berlebihan (NIK, KK, nama ibu kandung, foto KTP, rekening, golongan darah) yang tidak relevan untuk penyelenggaraan webinar; pangkas formulir agar hanya mengumpulkan data minimum yang benar-benar diperlukan (misal Nama, Email, dan Instansi/Unit Kerja) serta cantumkan tujuan & lama retensi data secara transparan.',
    pengecoh4: [
      'Formulir sudah tepat dan perlu ditambah kolom PIN ATM serta riwayat penyakit agar instansi memiliki cadangan basis data lengkap jika suatu saat mengadakan kegiatan berbeda di tahun depan.',
      'Pengumpulan foto selfie KTP dan nama ibu kandung diperbolehkan untuk webinar gratis selama pengembang menambahkan kotak centang "Data akan disimpan selamanya untuk segala keperluan mendatang".',
      'Pelanggaran hanya terjadi pada kolom Golongan Darah saja, sedangkan NIK, Nomor KK, dan Nama Ibu Kandung wajib dikumpulkan pada setiap acara daring pemerintah apa pun.',
      'Masalah selesai cukup dengan mengganti label formulir menjadi "Opsional" di tampilan UI sambil tetap menyalin data NIK secara diam-diam dari integrasi SSO tanpa pemberitahuan peserta.',
    ],
    akarMasalah:
      'Praktik *over-collection* (mengumpulkan data pribadi melampaui kebutuhan tujuan spesifik) memperbesar risiko pencurian identitas jika basis data kegiatan sederhana mengalami kebocoran.',
    solusiTerbaik:
      'Minimalisasi data membatasi pengumpulan secara proporsional, relevan, dan terbatas pada tujuan pendaftaran webinar, serta menetapkan masa retensi jelas pasca acara selesai.',
    analisisPengecoh:
      'Mengumpulkan data "untuk jaga-jaga keperluan mendatang" melanggar *purpose limitation*; persetujuan menyeluruh tanpa tujuan spesifik tidak sah; NIK/KK/nama ibu kandung tidak relevan untuk webinar; mengambil diam-diam lewat SSO melanggar asas transparansi.',
  },
  {
    level: 'C5',
    topik: 'UU PDP 27/2022 - Pemenuhan Hak Subjek Data (Koreksi, Penghapusan & Pembatasan)',
    pertanyaan:
      'Seorang warga menemukan bahwa riwayat alamat dan status pekerjaannya pada portal layanan ketenagakerjaan daerah salah catat sehingga menyebabkan pengajuan pelatihan kerjanya ditolak sistem otomatis. Warga tersebut mengajukan permintaan koreksi data secara resmi. Namun tim teknis menolak dengan alasan "sistem hanya mendukung `INSERT` dan tidak menyediakan fitur perubahan atau peninjauan ulang keputusan otomatis".\n\nEvaluasi kondisi sistem tersebut terhadap hak Subjek Data Pribadi dalam **UU No. 27 Tahun 2022**:',
    jawabanBenar:
      'Sistem melanggar **hak melengkapi, memperbarui, dan memperbaiki kesalahan/ketidakakuratan data** (Pasal 6, dengan kewajiban pembaruan paling lambat 3×24 jam setelah permintaan diterima sesuai Pasal 30) serta **hak mengajukan keberatan atas keputusan yang semata-mata didasarkan pada pemrosesan otomatis/profiling** (Pasal 10); rancang alur koreksi data terverifikasi dengan audit trail serta mekanisme peninjauan oleh petugas manusia (*human-in-the-loop*).',
    pengecoh4: [
      'Sistem sudah sesuai UU PDP karena prinsip integritas data melarang perubahan data yang sudah pernah dimasukkan ke basis data pemerintah meskipun terbukti salah ketik.',
      'Warga tidak memiliki hak mempertanyakan hasil seleksi otomatis algoritma komputer selama kode sumber aplikasi sudah disahkan oleh vendor pengembang.',
      'Instansi berhak meminta biaya administrasi sebesar Rp 500.000 kepada warga setiap kali mengajukan perbaikan kesalahan ketik yang dilakukan oleh sistem instansi.',
      'Solusi paling sesuai UU PDP adalah langsung menghapus seluruh catatan kependudukan warga tersebut dari sistem negara agar tidak perlu lagi memperbaiki alamatnya.',
    ],
    akarMasalah:
      'Desain sistem yang kaku (*append-only* tanpa prosedur koreksi dan tanpa mekanisme banding terhadap keputusan otomatis) menghalangi pemenuhan hak fundamental Subjek Data Pribadi.',
    solusiTerbaik:
      'UU PDP menjamin hak perbaikan ketidakakuratan (batas pemrosesan 3×24 jam) dan hak keberatan atas keputusan otomatis murni yang berdampak hukum/signifikan, sehingga aplikasi wajib menyediakan alur koreksi teraudit dan eskalasi peninjauan manusia.',
    analisisPengecoh:
      'Integritas data justru menuntut keakuratan data (koreksi teraudit bukan pembiaran data salah); Pasal 10 UU PDP secara tegas memberi hak keberatan atas *automated decision-making*; pungutan menghambat hak koreksi tidak dibenarkan; penghapusan total data layanan publik tidak relevan untuk kasus ketidakakuratan alamat.',
  },
  {
    level: 'C5',
    topik: 'UU PDP 27/2022 - Transfer Data Pribadi Lintas Batas Negara',
    pertanyaan:
      'Sebuah unit layanan publik berencana memakai layanan analitik AI berbasis cloud yang seluruh server pemrosesannya berlokasi di negara X di luar wilayah hukum Indonesia untuk mengolah data pengaduan warga yang memuat nama, alamat, dan nomor telepon. Sebelum penandatanganan kontrak, analis tata kelola TI diminta mengevaluasi legalitas transfer data tersebut berdasarkan **Pasal 56 UU No. 27 Tahun 2022**.\n\nPersyaratan berjenjang manakah yang WAJIB dipenuhi agar transfer data pribadi ke luar wilayah Indonesia sah secara hukum?',
    jawabanBenar:
      'Pengendali Data wajib memastikan secara berjenjang: (1) negara tujuan memiliki tingkat pelindungan data pribadi yang **setara atau lebih tinggi** dari UU PDP Indonesia; (2) jika belum terpenuhi, wajib ada **pelindungan data pribadi yang memadai dan bersifat mengikat** (misal klausul kontrak baku/BCR); (3) jika keduanya tidak terpenuhi, wajib memperoleh **persetujuan eksplisit** Subjek Data Pribadi — serta tetap mematuhi ketentuan penempatan data sistem elektronik lingkup publik (PP 71/2019 / regulasi sektoral) yang memprioritaskan penyimpanan di wilayah Indonesia.',
    pengecoh4: [
      'Transfer data pribadi warga Indonesia ke server luar negeri dilarang secara mutlak dalam kondisi apa pun tanpa pengecualian di dalam UU PDP.',
      'Transfer data ke luar negeri otomatis bebas dilakukan tanpa syarat apa pun selama penyedia layanan cloud memiliki sertifikat desain antarmuka modern dan harga paling murah.',
      'Cukup mengonversi teks data warga menjadi format JSON terkompresi gzip sebelum dikirim ke negara X agar tidak lagi dianggap sebagai transfer data pribadi lintas batas.',
      'Persetujuan Subjek Data Pribadi merupakan satu-satunya syarat, sehingga jika satu orang warga setuju maka data seluruh 100.000 warga lain boleh ikut dikirim ke negara X.',
    ],
    akarMasalah:
      'Penggunaan layanan SaaS/AI berlokasi di luar negeri tanpa uji kesetaraan pelindungan, kontrak mengikat, dan verifikasi aturan lokalisasi data publik (PP 71/2019) berisiko melanggar kedaulatan dan hukum PDP.',
    solusiTerbaik:
      'Pasal 56 UU PDP menerapkan mekanisme 3 lapis berurutan (adequacy negara tujuan -> adequate & binding safeguards -> persetujuan subjek data), dan untuk Penyelenggara Sistem Elektronik (PSE) Lingkup Publik di Indonesia wajib pula menyelaraskan dengan PP 71/2019 tentang pengelolaan sistem/data elektronik di wilayah Indonesia.',
    analisisPengecoh:
      'UU PDP tidak melarang mutlak melainkan mengatur syarat berjenjang di Pasal 56; harga murah tidak menggantikan kepatuhan hukum; kompresi gzip tidak menghilangkan status data pribadi; persetujuan bersifat individual bukan kolektif mewakili orang lain.',
  },
  {
    level: 'C6',
    topik: 'UU PDP 27/2022 - Retensi Data & Pemusnahan/Penghapusan Aman',
    pertanyaan:
      'Instansi menyimpan berkas digital pindaian KTP, ijazah, dan surat keterangan sehat milik 250.000 pelamar seleksi kegiatan tahun 2018 yang tidak lulus, padahal jadwal retensi arsip untuk data pelamar tidak lulus ditetapkan maksimal 2 tahun setelah pengumuman final. Hingga tahun 2026, berkas tersebut masih dibiarkan menumpuk di Object Storage produksi yang terhubung internet.\n\nBerdasarkan **Pasal 43–44 UU PDP** dan praktik keamanan siklus hidup data, langkah tata kelola dan teknis manakah yang paling tepat?',
    jawabanBenar:
      'Menetapkan kebijakan retensi otomatis (*lifecycle retention policy*) sesuai jadwal retensi arsip (JRA/ANRI) dan dasar hukum pemrosesan, lalu melakukan **penghapusan/pemusnahan permanen secara aman** (cryptographic erasure / penghapusan objek beserta versi historis dan penjadwalan pembersihan di media backup) terhadap data yang telah habis masa retensinya, atau anonimisasi ireversibel jika agregat statistik masih dibutuhkan, lengkap dengan berita acara pemusnahan.',
    pengecoh4: [
      'Membiarkan seluruh 250.000 berkas KTP tahun 2018 tersimpan selamanya di bucket produksi karena biaya penyimpanan cloud semakin murah dan tidak pernah menimbulkan risiko hukum.',
      'Cukup menambahkan kolom `is_deleted = true` (*soft delete*) di tabel database sementara file pindaian KTP tetap dibiarkan tersimpan permanen di bucket Object Storage tanpa batas waktu.',
      'Memindahkan seluruh 250.000 berkas KTP tersebut ke flashdisk pribadi staf arsip agar server cloud produksi menjadi bersih dan kapasitasnya kembali lega.',
      'Memublikasikan seluruh berkas pelamar tahun 2018 ke portal keterbukaan informasi publik agar masyarakat dapat mengunduhnya sebelum instansi menghapus file tersebut.',
    ],
    akarMasalah:
      'Menyimpan data pribadi melampaui masa retensi (*data hoarding*) melanggar kewajiban penghapusan/pemusnahan UU PDP dan memperluas dampak jika terjadi kebocoran sistem.',
    solusiTerbaik:
      'Otomasi kebijakan retensi selaras JRA + penghapusan/pemusnahan permanen (termasuk replika/versi dan crypto-shredding pada arsip) disertai dokumentasi berita acara meminimalkan permukaan risiko privasi.',
    analisisPengecoh:
      'Penyimpanan tanpa batas melanggar Pasal 43–44 UU PDP; *soft delete* saja tidak benar-benar memusnahkan data pribadi; menyalin ke flashdisk pribadi justru menciptakan risiko kehilangan data liar; memublikasikan KTP melanggar kerahasiaan data pribadi.',
  },
  {
    level: 'C4',
    topik: 'Tata Kelola SPBE - Manajemen Pengetahuan & Serah Terima Vendor',
    pertanyaan:
      'Sebuah aplikasi perizinan strategis dibangun oleh vendor selama 18 bulan. Setelah masa kontrak pemeliharaan berakhir, seluruh tim vendor keluar dan tidak meninggalkan dokumentasi arsitektur, kamus data, skrip migrasi database, maupun panduan pemulihan insiden. Akibatnya Pranata Komputer internal instansi tidak berani melakukan pembaruan keamanan karena takut merusak sistem.\n\nDalam kerangka **Manajemen Pengetahuan SPBE (Perpres 95/2018)** dan tata kelola kontrak TI, langkah korektif dan preventif manakah yang paling tepat?',
    jawabanBenar:
      'Memasukkan klausul wajib serah terima artefak teknis (*source code* penuh di repositori milik instansi, dokumentasi arsitektur/API/ERD, *runbook* operasional, *Infrastructure-as-Code*, dan sesi *knowledge transfer* terukur) sebagai syarat mutlak pencairan termin kontrak (BAST), serta mengelola seluruh pengetahuan teknis tersebut secara terstruktur di repositori Manajemen Pengetahuan SPBE internal.',
    pengecoh4: [
      'Menyerahkan seluruh kepemilikan kode sumber kepada vendor secara permanen dan memperpanjang kontrak pemeliharaan kepada vendor yang sama tanpa batas waktu agar instansi tidak perlu memahami sistemnya.',
      'Menugaskan satu orang Pranata Komputer senior saja untuk menghafal seluruh konfigurasi server tanpa menuliskannya agar dokumen arsitektur tidak bocor ke unit kerja lain.',
      'Menghapus aplikasi tersebut setiap kali kontrak vendor selesai dan selalu menganggarkan pembangunan aplikasi baru dari nol menggunakan vendor berbeda.',
      'Cukup meminta vendor menyerahkan berkas brosur presentasi PowerPoint fitur antarmuka pengguna sebagai bukti lengkap transfer pengetahuan teknis.',
    ],
    akarMasalah:
      'Ketiadaan tata kelola penyerahan aset pengetahuan (*vendor lock-in*) menyebabkan ketergantungan total pada vendor dan melumpuhkan kemampuan pemeliharaan serta patching keamanan internal.',
    solusiTerbaik:
      'Mengikat serah terima source code, dokumentasi teknis, runbook, dan transfer pengetahuan teruji pada syarat BAST/kontrak serta memeliharanya dalam Sistem Manajemen Pengetahuan SPBE menghilangkan *vendor lock-in*.',
    analisisPengecoh:
      'Ketergantungan permanen pada satu vendor melanggar efisiensi dan keberlanjutan SPBE; mengandalkan hafalan satu pegawai menciptakan *single point of failure* (bus factor = 1); membangun ulang tiap kontrak memboroskan APBN/APBD; slide presentasi fitur tidak cukup untuk operasional maupun patching.',
  },
  {
    level: 'C5',
    topik: 'Tata Kelola SPBE - Manajemen Layanan TI (ITSM) & Incident vs Problem Management',
    pertanyaan:
      'Service Desk TI sebuah kementerian mencatat bahwa sepanjang kuartal I terdapat 420 tiket gangguan bertajuk "Gagal Cetak SK — Error 500" pada portal kepegawaian. Setiap kali tiket masuk, operator hanya merestart layanan web server sehingga aplikasi pulih sementara selama 4 jam dan tiket langsung ditutup (*Closed*) guna mengejar target SLA penyelesaian cepat. Akibatnya gangguan berulang terus setiap hari.\n\nBerdasarkan praktik **Manajemen Layanan SPBE / ITIL 4**, kekeliruan proses apa yang terjadi dan perbaikan tata kelola manakah yang paling tepat?',
    jawabanBenar:
      'Tim hanya menjalankan *Incident Management* (pemulihan cepat gejala lewat workaround restart) tanpa memicu **Problem Management** untuk analisis akar masalah (*Root Cause Analysis / RCA*); kelompokkan insiden berulang tersebut menjadi satu catatan *Problem*, catat workaround sementara di *Known Error Database (KEDB)*, lakukan RCA (misal memory leak/connection leak), lalu eksekusi perbaikan permanen melalui *Change Enablement*.',
    pengecoh4: [
      'Menutup loket Service Desk selama 1 minggu setiap bulan agar jumlah tiket gangguan yang tercatat pada laporan kuartalan menurun drastis.',
      'Mengotomatiskan skrip `cron` untuk me-restart server produksi setiap 3 jam sekali secara permanen lalu menyatakan akar masalah telah selesai 100%.',
      'Melarang operator melakukan pemulihan sementara (*workaround*) dan membiarkan layanan cetak SK mati total selama 2 minggu sampai investigasi akar masalah selesai sepenuhnya.',
      'Memperpanjang SLA penutupan tiket insiden dari 2 jam menjadi 14 hari agar operator tidak terburu-buru menutup tiket tanpa mengubah proses investigasi teknis.',
    ],
    akarMasalah:
      'Fokus sempit pada metrik kecepatan tutup tiket (MTTR insiden) tanpa menghubungkan insiden berulang ke proses *Problem Management* membuat penyebab dasar (misal kebocoran memori/koneksi) tidak pernah dituntaskan.',
    solusiTerbaik:
      'Memisahkan tujuan *Incident Management* (memulihkan layanan secepat mungkin) dengan *Problem Management* (RCA + KEDB + RFC perubahan permanen) menghentikan gangguan berulang secara sistemik.',
    analisisPengecoh:
      'Menutup service desk menyembunyikan masalah; cron restart permanen menimbun utang teknis dan memutus sesi pengguna aktif; melarang workaround melumpuhkan layanan publik; memperpanjang SLA tanpa RCA tidak memperbaiki akar bug.',
  },
  {
    level: 'C4',
    topik: 'Tata Kelola TI - Klasifikasi Sistem Elektronik & Standar Keamanan (PP 71/2019 & BSSN)',
    pertanyaan:
      'Sebuah kementerian mengoperasikan dua sistem: (1) Portal berita statis profil lembaga tanpa data pribadi, dan (2) Sistem Nasional Pengelolaan Kas Negara & Penggajian ASN yang terhubung ke ratusan satker serta memproses transaksi triliunan rupiah. Tim keamanan ingin mengalokasikan anggaran keamanan yang terbatas secara proporsional.\n\nMengacu pada **PP No. 71 Tahun 2019** dan kategori sistem elektronik (**Strategis, Tinggi, Rendah**), bagaimana kategorisasi kedua sistem tersebut dan konsekuensi kepatuhannya?',
    jawabanBenar:
      'Sistem Pengelolaan Kas Negara & Penggajian ASN masuk kategori **Sistem Elektronik Strategis** (berdampak serius terhadap kepentingan umum, pelayanan publik, kelancaran penyelenggaraan negara, atau pertahanan keamanan) sehingga wajib menerapkan standar **SNI ISO/IEC 27001** beserta persyaratan keamanan tinggi/BSSN dan audit berkala ketat, sedangkan portal berita statis masuk kategori **Rendah** dengan kontrol keamanan dasar yang proporsional.',
    pengecoh4: [
      'Kedua sistem wajib diberikan anggaran keamanan dan arsitektur disaster recovery Active-Active lintas pulau yang sama persis agar tidak terjadi diskriminasi antar-aplikasi.',
      'Portal berita statis masuk kategori Strategis karena dapat dilihat masyarakat dari internet publik, sedangkan Sistem Kas Negara masuk kategori Rendah karena hanya diakses ASN di jaringan internal.',
      'Sistem kategori Strategis cukup menerapkan perlindungan antivirus gratis tanpa perlu sertifikasi atau kesesuaian standar manajemen keamanan informasi seperti SNI ISO/IEC 27001.',
      'Kategorisasi Sistem Elektronik hanya ditentukan oleh bahasa pemrograman yang dipakai (misal Java = Strategis, PHP = Rendah), bukan oleh dampak bisnis dan data yang dikelola.',
    ],
    akarMasalah:
      'Mengalokasikan kontrol keamanan secara merata tanpa kategorisasi risiko/dampak sistem elektronik (Strategis, Tinggi, Rendah) membuat aset kritis kurang terlindungi sementara aset rendah mengalami *over-engineering*.',
    solusiTerbaik:
      'Kategorisasi berbasis dampak (PP 71/2019 & Peraturan BSSN tentang Indeks KAMI/Kategorisasi SE) memastikan Sistem Strategis memperoleh kontrol tertinggi (SMKI ISO 27001, HSM, DRP ketat, SOC 24/7) secara tepat sasaran.',
    analisisPengecoh:
      'Alokasi rata tidak efisien berbasis risiko; dampak kerusakan sistem kas negara jauh lebih kritikal daripada portal berita statis; Sistem Strategis wajib memenuhi standar SMKI/ISO 27001; bahasa pemrograman bukan kriteria kategorisasi SE.',
  },
  {
    level: 'C6',
    topik: 'Tata Kelola TI - Perancangan Audit Trail Kepatuhan (Non-Repudiation & Immutability)',
    pertanyaan:
      'Dalam investigasi dugaan manipulasi nominal bantuan sosial pada aplikasi keuangan daerah, auditor Inspektorat menemukan catatan log transaksi pada tabel `audit_log` di PostgreSQL telah dihapus menggunakan akun `db_admin` yang sama dengan akun operasional aplikasi. Akibatnya, tidak ditemukan bukti siapa yang mengubah nominal bantuan tersebut.\n\nRancangan arsitektur **Audit Trail** manakah yang paling tepat untuk menjamin integritas, *immutability*, dan kekuatan pembuktian forensik?',
    jawabanBenar:
      'Mencatat seluruh aksi sensitif (who, what, when, where/IP, nilai sebelum & sesudah, correlation ID) dan mengirimkannya secara real-time (*out-of-band*) ke repositori log/SIEM terpisah yang bersifat **append-only / WORM (Write-Once-Read-Many)** dengan hak akses terpisah (*segregation of duties* sehingga admin aplikasi/DB tidak dapat mengubah atau menghapus log), disertai **hash chaining** atau tanda tangan kriptografi untuk mendeteksi tamper serta sinkronisasi waktu NTP akurat.',
    pengecoh4: [
      'Menyimpan seluruh audit log ke dalam satu berkas teks `/tmp/audit.txt` di server aplikasi yang sama dengan hak akses `chmod 777` agar seluruh layanan mudah menulis catatan.',
      'Membuat tabel `audit_log` di database yang sama dan meminta `db_admin` menandatangani pakta integritas di atas kertas untuk berjanji tidak menjalankan perintah `DELETE`.',
      'Hanya mencatat tanggal login pengguna tanpa menyimpan nilai data sebelum dan sesudah perubahan (*before/after state*) agar ukuran tabel audit log tetap kecil.',
      'Menghapus seluruh isi tabel `audit_log` secara otomatis setiap 7 hari agar ruang disk server database tidak pernah penuh.',
    ],
    akarMasalah:
      'Menyimpan audit log di tempat yang berada di bawah kendali akun operasional yang sama (`db_admin`) memungkinkan pelaku/admin nakal menghapus jejak manipulasi data.',
    solusiTerbaik:
      'Ekspor log real-time ke penyimpanan WORM/append-only terpisah + pemisahan wewenang (SoD) + tamper-evident hash chain + pencatatan before/after state dan sinkronisasi NTP menjamin nilai pembuktian audit trail.',
    analisisPengecoh:
      'File `/tmp` dengan `chmod 777` mudah dihapus/dipalsukan dan hilang saat reboot; janji kertas tanpa kontrol teknis gagal mencegah penyalahgunaan; tanpa before/after state perubahan nominal tidak dapat dibuktikan; retensi 7 hari terlalu singkat untuk kebutuhan audit/hukum pemerintahan.',
  },
  {
    level: 'C5',
    topik: 'Tata Kelola SPBE - Evaluasi Keberlanjutan & Manajemen Risiko Proyek TI',
    pertanyaan:
      'Sebuah kementerian meluncurkan proyek pembangunan sistem terintegrasi baru bernilai Rp 15 miliar dengan pendekatan *Big Bang* selama 12 bulan penuh tanpa uji coba bertahap kepada pengguna layanan. Pada bulan ke-11, diketahui 60% alur kerja di sistem tidak sesuai regulasi terbaru yang terbit di bulan ke-5, sehingga aplikasi ditolak seluruh unit kerja saat UAT.\n\nEvaluasi akar kegagalan tata kelola proyek tersebut dan pendekatan pengembangan/manajemen risiko yang paling tepat diterapkan pada instansi pemerintah:',
    jawabanBenar:
      'Kegagalan disebabkan pendekatan *Big Bang* tanpa validasi iteratif, lemahnya manajemen perubahan regulasi, dan absennya keterlibatan pemilik proses bisnis sejak awal; terapkan pengiriman **iteratif/inkremental** (piloting bertahap per modul prioritas dengan umpan balik pengguna tiap 2–4 minggu), kelola *Risk Register* dinamis yang memantau perubahan regulasi, serta terapkan *stage-gate governance* sebelum pengembangan skala penuh.',
    pengecoh4: [
      'Memaksakan peluncuran aplikasi yang ditolak tersebut ke produksi menggunakan surat edaran sanksi disiplin bagi ASN yang mengeluhkan ketidaksesuaian regulasi.',
      'Memperpanjang durasi fase *Big Bang* menjadi 36 bulan tanpa demo ke pengguna agar pengembang memiliki lebih banyak waktu menulis dokumen spesifikasi setebal 1.000 halaman.',
      'Menghapus tahapan *User Acceptance Testing (UAT)* pada proyek berikutnya agar aplikasi tidak mungkin ditolak oleh unit kerja pemilik proses bisnis.',
      'Menyerahkan penyusunan seluruh aturan bisnis dan interpretasi regulasi sepenuhnya kepada programmer vendor tanpa melibatkan unit hukum maupun pemilik proses bisnis.',
    ],
    akarMasalah:
      'Model pengiriman *Big Bang* menunda validasi lapangan hingga akhir proyek (bulan ke-11), membuat perubahan regulasi di tengah jalan menjadi kegagalan mahal (*late discovery risk*).',
    solusiTerbaik:
      'Delivery iteratif/inkremental + kolaborasi aktif pemilik proses bisnis & unit hukum + piloting bertahap + pemantauan risiko regulasi mendeteksi ketidaksesuaian lebih dini dengan biaya koreksi rendah.',
    analisisPengecoh:
      'Memaksa sistem melanggar regulasi baru menimbulkan cacat hukum layanan; memperpanjang *Big Bang* memperbesar risiko usang; menghapus UAT hanya memindahkan kegagalan ke masyarakat; programmer vendor tidak berwenang menafsirkan regulasi sendiri tanpa pemilik proses bisnis.',
  },
  {
    level: 'C4',
    topik: 'UU PDP 27/2022 - Pemrosesan Data Pribadi Anak di Layanan Digital Publik',
    pertanyaan:
      'Dinas Perpustakaan dan Kearsipan meluncurkan aplikasi membaca daring untuk pelajar SD–SMP (usia 7–15 tahun) yang mengumpulkan nama lengkap, tanggal lahir, alamat rumah, foto profil, dan riwayat minat baca untuk rekomendasi konten. Saat ini formulir registrasi hanya menampilkan tombol "Daftar" yang langsung diklik sendiri oleh siswa.\n\nBerdasarkan **Pasal 25 UU No. 27 Tahun 2022**, kekurangan kepatuhan apa yang terjadi dan mekanisme teknis apa yang wajib ditambahkan?',
    jawabanBenar:
      'Data anak tergolong **Data Pribadi Spesifik** dan pemrosesan data pribadi anak wajib diselenggarakan secara khusus dengan **memperoleh persetujuan dari orang tua anak dan/atau wali anak** sesuai ketentuan peraturan perundang-undangan; tambahkan mekanisme verifikasi usia (*age gating*), alur persetujuan terverifikasi orang tua/wali (*verifiable parental consent*), minimalisasi pengumpulan data anak (misal tanpa alamat rumah/foto wajib), dan kebijakan privasi ramah anak.',
    pengecoh4: [
      'Cukup menambahkan teks syarat dan ketentuan hukum sepanjang 20 halaman dengan ukuran huruf 9px lalu menganggap klik tombol "Daftar" oleh anak usia 8 tahun sah sebagai persetujuan hukum.',
      'Mengumpulkan data lokasi GPS real-time anak selama 24 jam agar Dinas Perpustakaan dapat memastikan anak benar-benar sedang membaca buku di rumah.',
      'Memindahkan seluruh akun pelajar SD–SMP ke status anonim publik yang menampilkan nama lengkap dan alamat rumah di papan peringkat nasional agar memotivasi minat baca.',
      'Menghapus kewajiban persetujuan orang tua sepenuhnya selama aplikasi perpustakaan tersebut tidak memungut biaya berlangganan bulanan.',
    ],
    akarMasalah:
      'Anak belum memiliki kecakapan hukum penuh untuk memberikan persetujuan pemrosesan data pribadi spesifiknya secara mandiri, sehingga registrasi langsung tanpa verifikasi orang tua/wali melanggar Pasal 25 UU PDP.',
    solusiTerbaik:
      'Implementasi *age gating* + persetujuan terverifikasi orang tua/wali + *data minimization* (tidak meminta alamat/foto yang tidak perlu) + perlindungan privasi default tertinggi melindungi hak anak di ruang digital.',
    analisisPengecoh:
      'Persetujuan anak 8 tahun pada teks hukum panjang tidak sah; pelacakan GPS 24 jam melanggar proporsionalitas dan membahayakan keselamatan anak; menampilkan nama & alamat anak ke publik berisiko tinggi terhadap kejahatan terhadap anak; layanan gratis tetap terikat penuh pada Pasal 25 UU PDP.',
  },
  {
    level: 'C5',
    topik: 'Tata Kelola SPBE - Keamanan Integrasi API Pihak Ketiga & Perjanjian Berbagi Data',
    pertanyaan:
      'Sebuah startup fintech mengajukan permintaan akses API ke basis data kependudukan dan status bantuan sosial milik pemerintah daerah untuk keperluan penilaian skor kredit (*credit scoring*) komersial. Startup tersebut menawarkan bantuan perangkat server gratis senilai Rp 500 juta sebagai imbal balik akses data mentah.\n\nEvaluasi permintaan tersebut berdasarkan **UU PDP No. 27 Tahun 2022**, **Perpres SPBE**, dan prinsip tata kelola integrasi data pemerintah:',
    jawabanBenar:
      'Permintaan akses data mentah untuk tujuan komersial tersebut **harus ditolak** karena bertentangan dengan pembatasan tujuan (*purpose limitation*) pengumpulan data publik, ketiadaan dasar hukum/persetujuan eksplisit subjek data, serta potensi gratifikasi/konflik kepentingan; pertukaran data pihak eksternal hanya dapat dilakukan bila memiliki payung hukum/PKS resmi, mekanisme verifikasi terukur (seperti *match/non-match* berbasis persetujuan eksplisit pemilik data, bukan dump data mentah), melalui gerbang teraudit sesuai kewenangan.',
    pengecoh4: [
      'Menerima tawaran server gratis tersebut dan memberikan akses dump tabel penuh secara mingguan selama startup berjanji tidak menjual data ke pihak ketiga lainnya.',
      'Memberikan akses data mentah secara diam-diam tanpa Perjanjian Kerja Sama (PKS) tertulis agar instansi tidak perlu melalui proses review biro hukum dan PPDP.',
      'Menyetujui permintaan tersebut cukup dengan menghapus kolom nama depan warga namun tetap memberikan kolom NIK 16 digit, tanggal lahir, dan alamat lengkap agar startup bisa mencocokkannya.',
      'Menjual data bantuan sosial warga tersebut secara terbuka melalui lelang daring untuk menambah Pendapatan Asli Daerah (PAD) karena data disimpan di server milik pemda.',
    ],
    akarMasalah:
      'Pemberian akses data pribadi warga hasil layanan publik untuk tujuan komersial pihak ketiga melanggar asas *purpose limitation*, dasar hukum UU PDP, kewenangan akses data kependudukan, serta etika integritas ASN.',
    solusiTerbaik:
      'Menolak barter data mentah dan menegakkan tata kelola akses berbasis dasar hukum resmi, PKS teraudit, persetujuan eksplisit subjek data, serta prinsip minimalisasi (hanya respon verifikasi *yes/no* jika secara regulasi dimungkinkan, bukan eksposur data mentah).',
    analisisPengecoh:
      'Barter data dengan server gratis melanggar UU PDP dan berpotensi pidana gratifikasi; akses tanpa PKS melanggar tata kelola; menyertakan NIK + tanggal lahir + alamat tetap mengidentifikasi individu (bukan anonim); pemda adalah Pengendali Data bukan pemilik komersial data pribadi warga.',
  },
  {
    level: 'C6',
    topik: 'Tata Kelola TI - Perancangan Tim Koordinasi SPBE & Arsitektur Layanan Terpadu',
    pertanyaan:
      'Di sebuah pemerintah provinsi, setiap OPD menjalankan proyek TIK secara terpisah: Dinas Sosial, Dinas Pendidikan, dan Dinas Kesehatan masing-masing membuat sistem login sendiri, portal pengaduan sendiri, dan aplikasi mobile terpisah sehingga warga harus mengunduh 35 aplikasi berbeda dan mengunggah ulang KTP berkali-kali. Pimpinan provinsi ingin bertransformasi menuju **Portal Pelayanan Publik Terpadu (Single Sign-On & Once-Only Principle)**.\n\nLangkah arsitektural dan tata kelola SPBE manakah yang paling tepat menjadi fondasi transformasi tersebut?',
    jawabanBenar:
      'Mengaktifkan peran **Tim Koordinasi SPBE** untuk menyelaraskan Arsitektur & Peta Rencana SPBE lintas OPD, membangun satu **Portal Layanan Terpadu** berbasis *Single Sign-On* (identitas digital terpadu), mengintegrasikan pertukaran data antar-OPD melalui **SPLP** agar warga cukup memasukkan data sekali (*once-only principle*), serta melakukan rasionalisasi/penggabungan 35 aplikasi menjadi layanan modular di dalam portal terpadu.',
    pengecoh4: [
      'Membangun satu aplikasi baru ke-36 yang hanya berisi daftar 35 tautan URL menuju masing-masing aplikasi OPD lama tanpa menyatukan sistem login maupun pertukaran data.',
      'Menghapus seluruh situs web pelayanan dan menggabungkan ke-35 aplikasi OPD menjadi satu berkas APK Android berukuran 900 MB yang menanamkan 35 basis data berbeda secara terpisah.',
      'Meminta warga membawa fotokopi KTP sebanyak 35 lembar ke kantor kecamatan sekali setahun agar petugas memasukkan ulang data secara manual ke 35 aplikasi OPD.',
      'Membiarkan 35 aplikasi berjalan sendiri-sendiri tanpa integrasi namun menyeragamkan warna latar belakang halaman login semuanya menjadi biru tua.',
    ],
    akarMasalah:
      'Silo organisasi antar-OPD menghasilkan fragmentasi layanan (35 aplikasi, login ganda, unggah ulang dokumen berulang) yang bertentangan dengan prinsip keterpaduan SPBE.',
    solusiTerbaik:
      'Tata kelola Tim Koordinasi SPBE + Portal Layanan Terpadu + SSO + interoperabilitas SPLP (*once-only principle*) + rasionalisasi aplikasi menyelesaikan akar fragmentasi baik dari sisi organisasi maupun arsitektur teknis.',
    analisisPengecoh:
      'Sekadar direktori 35 tautan atau menyeragamkan warna login tidak menghilangkan login berulang dan silo data; membungkus 35 aplikasi terpisah dalam satu APK raksasa tidak menyelesaikan duplikasi backend; fotokopi manual mundur dari transformasi digital.',
  },
  {
    level: 'C4',
    topik: 'UU PDP 27/2022 - Evaluasi Kebocoran via Metadata Dokumen & Sanksi Administratif',
    pertanyaan:
      'Sebuah badan publik mengunggah daftar penerima beasiswa daerah ke situs resminya dalam format berkas Excel (`.xlsx`) yang tab utamanya hanya menampilkan Nama dan Universitas. Namun tim keamanan menemukan terdapat *hidden sheet* di dalam file Excel tersebut yang berisi 4.000 baris NIK lengkap, nomor rekening, nomor HP, dan alamat rumah mahasiswa, yang kini sudah terindeks mesin pencari.\n\nTindakan respons segera dan perbaikan proses publikasi manakah yang paling tepat sesuai **UU PDP** dan tata kelola informasi publik?',
    jawabanBenar:
      'Segera mencabut berkas `.xlsx` dari server publik, mengajukan permintaan penghapusan cache/indeks ke mesin pencari, memicu prosedur penanganan insiden & notifikasi kebocoran data tertulis maksimal **3×24 jam** ke Subjek Data dan Lembaga PDP, serta menetapkan SOP publikasi data terbuka yang wajib mengekspor hanya kolom publik ke format bersih (CSV/PDF hasil sanitasi tanpa hidden sheet/metadata) disertai validasi otomatis DLP sebelum terbit.',
    pengecoh4: [
      'Membiarkan berkas `.xlsx` tetap terpasang di situs namun mengganti warna teks pada *hidden sheet* menjadi putih di atas latar putih agar tidak terbaca oleh mata manusia.',
      'Menghapus berkas tersebut secara diam-diam tanpa mencabut indeks mesin pencari dan tanpa melapor ke Lembaga PDP maupun mahasiswa karena kebocoran disebabkan kelalaian fitur *hidden sheet*, bukan peretas.',
      'Mengunci *hidden sheet* menggunakan fitur *Protect Sheet* Excel lalu mengunggah ulang berkas yang sama ke portal publik karena proteksi sheet Excel bersifat enkripsi tingkat militer.',
      'Menyalahkan mesin pencari publik secara hukum tanpa memperbaiki SOP publikasi internal maupun melakukan notifikasi kebocoran kepada mahasiswa yang datanya terekspos.',
    ],
    akarMasalah:
      'Kegagalan pelindungan data pribadi tidak hanya berasal dari peretasan eksternal, melainkan juga *accidental disclosure* (kelalaian publikasi hidden sheet/metadata) yang tetap memicu kewajiban penanganan kebocoran UU PDP.',
    solusiTerbaik:
      'Takedown cepat + de-indexing mesin pencari + notifikasi 3×24 jam sesuai Pasal 46 UU PDP + sanitasi/DLP sebelum publikasi menyelesaikan insiden sekaligus mencegah pengulangan struktural.',
    analisisPengecoh:
      'Teks putih atau *Protect Sheet* Excel mudah dibuka/dibaca secara trivial (XML terbuka dalam kontainer ZIP `.xlsx`); kelalaian internal tetap termasuk kegagalan pelindungan data yang wajib dilaporkan; menyalahkan mesin pencari tidak melindungi mahasiswa dari penyalahgunaan NIK/rekening.',
  },
  {
    level: 'C5',
    topik: 'Tata Kelola TI - Evaluasi Sanksi & Akuntabilitas Organisasi pada UU PDP',
    pertanyaan:
      'Dalam rapat pimpinan instansi, seorang manajer proyek mengusulkan menunda alokasi anggaran enkripsi basis data, audit keamanan, dan pelatihan kesadaran keamanan data pribadi tahun ini karena menganggap pelanggaran UU PDP hanya berujung pada teguran lisan ringan bagi penyelenggara sistem.\n\nEvaluasi anggapan tersebut secara objektif berdasarkan rezim kepatuhan **UU No. 27 Tahun 2022**:',
    jawabanBenar:
      'Anggapan tersebut keliru dan sangat berisiko: selain dampak kehilangan kepercayaan publik dan kerugian warga, UU PDP mengatur **sanksi administratif** bertingkat (peringatan tertulis, penghentian sementara kegiatan pemrosesan, penghapusan/pemusnahan data, hingga **denda administratif paling tinggi 2% dari pendapatan/penerimaan tahunan** terhadap variabel pelanggaran bagi korporasi/pihak terkait) serta **ketentuan pidana** untuk perbuatan terlarang seperti perolehan/pengungkapan/penggunaan data pribadi secara melawan hukum, sekaligus konsekuensi akuntabilitas pimpinan & kinerja SPBE bagi instansi pemerintah.',
    pengecoh4: [
      'Anggapan manajer proyek benar karena seluruh sanksi dalam UU PDP baru berupa imbauan moral sukarela tanpa konsekuensi penghentian layanan maupun ketentuan pidana.',
      'Penundaan anggaran keamanan dibenarkan karena jika terjadi kebocoran data, seluruh tanggung jawab hukum otomatis dialihkan kepada penyedia jaringan internet (ISP) pemerintah.',
      'UU PDP hanya mewajibkan anggaran keamanan pada perusahaan perbankan, sedangkan instansi pelayanan publik cukup memasang firewall bawaan sistem operasi gratis.',
      'Sanksi administratif dalam UU PDP hanya dapat dijatuhkan jika pelaku kebocoran adalah pegawai internal yang tertangkap tangan menjual data di media sosial.',
    ],
    akarMasalah:
      'Meremehkan risiko regulasi, operasional, dan reputasi dari ketidakpatuhan PDP menyebabkan *under-investment* pada kontrol teknis maupun organisasional pelindungan data.',
    solusiTerbaik:
      'Menyajikan profil risiko hukum (sanksi administratif hingga penghentian pemrosesan/denda maksimal 2% serta ancaman pidana perbuatan melawan hukum), operasional, dan akuntabilitas SPBE membantu pimpinan memprioritaskan investasi keamanan & PDP berbasis risiko.',
    analisisPengecoh:
      'UU PDP memiliki kekuatan hukum mengikat termasuk sanksi administratif tegas dan pidana (Pasal 57 & 67–73); ISP tidak menanggung kegagalan keamanan aplikasi Pengendali Data; UU PDP berlaku lintas sektor termasuk badan publik; kelalaian pemenuhan kewajiban teknis pun dapat dikenai sanksi administratif.',
  },
];
