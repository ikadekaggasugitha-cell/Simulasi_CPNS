import type { SkbHotsItem } from './skb_hots_builder';

export const SKB_MANAJEMEN_DATA_B: SkbHotsItem[] = [
  {
    level: 'C5',
    topik: 'Manajemen Risiko TI - Evaluasi Matriks Risiko & Strategi Perlakuan (PermenPANRB 5/2020)',
    pertanyaan:
      'Dalam asesmen Risiko SPBE (mengacu PermenPANRB No. 5 Tahun 2020 / ISO 31000) pada sistem pelayanan publik kritikal, tim mencatat profil risiko berikut (skala 1–5):\n\n```text\nRisiko R-01: Kegagalan server database tunggal (Likelihood = 4, Impact = 5, Besaran = 20 / Sangat Tinggi)\nRisiko R-02: Kerusakan baterai UPS cadangan gedung lama (Likelihood = 2, Impact = 2, Besaran = 4 / Rendah)\nSelera Risiko (Risk Appetite) instansi ditetapkan pada ambang <= 6.\n```\n\nKeputusan perlakuan risiko (*risk treatment*) manakah yang paling tepat untuk R-01 dan R-02?',
    jawabanBenar:
      'Untuk R-01 (besaran 20, melampaui selera risiko), wajib menerapkan **mitigasi/pengurangan risiko** prioritas tinggi (membangun arsitektur High Availability/replikasi & DRP) hingga *residual risk* turun di bawah selera risiko (atau dikombinasikan transfer sebagian risiko non-inti); sedangkan untuk R-02 (besaran 4, di bawah selera risiko), dapat diterapkan **penerimaan risiko (*risk acceptance*)** dengan pemantauan berkala tanpa belanja modal besar yang tidak proporsional.',
    pengecoh4: [
      'Menghabiskan seluruh anggaran tahun ini untuk membeli 10 unit genset bagi R-02 karena risiko kecil lebih mudah diturunkan menjadi nol, lalu menerima (*accept*) R-01 apa adanya karena biaya HA cukup mahal.',
      'Menghapus R-01 dari dokumen *Risk Register* SPBE karena besaran risiko 20 akan menurunkan skor indeks SPBE instansi saat dievaluasi oleh auditor eksternal.',
      'Menerapkan penghindaran risiko (*risk avoidance*) pada R-01 dengan menutup permanen seluruh layanan publik digital instansi dan kembali ke loket kertas manual.',
      'Menganggap *inherent risk* R-01 otomatis hilang menjadi 0 segera setelah dokumen *Risk Register* ditandatangani kepala dinas tanpa implementasi kontrol teknis.',
    ],
    akarMasalah:
      'Pengelolaan risiko TI menuntut alokasi sumber daya secara proporsional terhadap ambang selera risiko (*risk appetite*), bukan mengabaikan risiko ekstrem atau memboroskan biaya pada risiko rendah.',
    solusiTerbaik:
      'Memprioritaskan mitigasi teknis terukur pada R-01 (20 > 6) untuk menekan *residual risk* dan menerima R-02 (4 <= 6) dengan monitoring selaras dengan ISO 31000 & PermenPANRB 5/2020.',
    analisisPengecoh:
      'Menerima risiko ekstrem 20 pada layanan kritikal adalah kelalaian tata kelola; menghapus risiko dari register adalah manipulasi kepatuhan; menutup layanan publik melanggar mandat pelayanan negara; dokumen tanpa implementasi tidak mengubah *residual risk*.',
  },
  {
    level: 'C6',
    topik: 'BCP/DRP - Perancangan Arsitektur Berdasarkan Target RTO & RPO',
    pertanyaan:
      'Sistem Layanan Pengadaan Secara Elektronik (LPSE) memiliki target Business Continuity: **RTO (Recovery Time Objective) = 15 menit** dan **RPO (Recovery Point Objective) = 0 detik (zero data loss)** saat pusat data primer mengalami bencana regional. Saat ini tim hanya mengandalkan backup dump SQL harian pukul 02.00 WIB yang dikirim ke tape/disk di lokasi sekunder, yang membutuhkan waktu restore 4 jam.\n\nArsitektur Disaster Recovery manakah yang paling tepat dirancang untuk memenuhi target RTO <= 15 menit dan RPO = 0?',
    jawabanBenar:
      'Menerapkan arsitektur **Warm/Hot Standby (atau Active-Active)** lintas lokasi DR dengan **replikasi database sinkron (*synchronous replication*)** agar setiap transaksi *commit* tertulis di primer dan sekunder sebelum dikonfirmasi ke aplikasi (menjamin RPO = 0), dikombinasikan dengan otomasi failover DNS/GSLB + *Infrastructure-as-Code* yang diuji lewat simulasi DR drill berkala untuk memastikan RTO <= 15 menit.',
    pengecoh4: [
      'Menaikkan frekuensi backup dump SQL harian menjadi setiap 6 jam sekali ke lokasi sekunder dan mengganti media tape menjadi SSD tanpa mengubah mekanisme replikasi.',
      'Menerapkan replikasi asinkron dengan jeda replikasi 5 menit (*replication lag*) serta proses provisioning server manual di DRC setiap kali bencana terjadi.',
      'Menyimpan salinan backup dump SQL harian di partisi hard disk yang sama pada server primer agar proses pemulihan berjalan kurang dari 15 menit saat gedung primer terbakar.',
      'Mengubah dokumen kebijakan BCP dengan memperpanjang RTO menjadi 72 jam dan RPO menjadi 24 jam tanpa persetujuan pemilik proses bisnis agar arsitektur lama langsung dianggap patuh.',
    ],
    akarMasalah:
      'Backup periodik harian memiliki RPO hingga 24 jam dan waktu restore 4 jam (RTO = 240 menit), jauh meleset dari kebutuhan bisnis RPO = 0 dan RTO = 15 menit.',
    solusiTerbaik:
      'Replikasi sinkron menjamin RPO = 0 (tidak ada transaksi ter-commit yang hilang), sementara Hot/Active-Active standby dengan failover otomatis & uji DR berkala menjamin layanan pulih dalam <= 15 menit (RTO).',
    analisisPengecoh:
      'Backup tiap 6 jam tetap memiliki RPO hingga 6 jam; replikasi asinkron berisiko kehilangan data transaksi terbaru (RPO > 0) dan provisioning manual melampaui 15 menit; backup di lokasi primer ikut musnah saat bencana gedung; mengubah target bisnis sepihak tanpa persetujuan melanggar BCP.',
  },
  {
    level: 'C4',
    topik: 'Tata Kelola TI - COBIT 2019: Pemisahan Governance vs Management & SoD',
    pertanyaan:
      'Pada sebuah instansi, seorang staf TI yang sama memegang kewenangan sekaligus sebagai: (1) pembuat kode aplikasi penggajian, (2) penyetuju perubahan (*Change Approver*), (3) pelaksana deployment langsung ke server produksi, dan (4) pengelola audit log database. Inspektorat menilai struktur tersebut menimbulkan risiko kecurangan internal (*insider fraud*) yang tinggi.\n\nBerdasarkan prinsip **COBIT 2019** dan kontrol internal **Segregation of Duties (SoD)**, pemisahan peran manakah yang paling tepat diterapkan?',
    jawabanBenar:
      'Memisahkan fungsi **Pengembangan** (developer menulis kode & menguji di dev/staging), **Persetujuan Perubahan** (Change Advisory Board / peer code review independen), **Operasional Deployment** (pipeline CI/CD terotomasi yang dikendalikan tim operasi/release tanpa akses tulis langsung developer ke DB produksi), serta **Pengawasan/Audit** (tim keamanan/audit independen yang membaca log WORM), sambil memisahkan pula tataran *Governance* (EDM: Evaluasi, Pengarahan, Pemantauan oleh pimpinan) dari *Management* (PBRM).',
    pengecoh4: [
      'Mempertahankan keempat peran pada satu staf tersebut agar proses deployment ke produksi dapat diselesaikan dalam 30 detik tanpa birokrasi persetujuan.',
      'Menghapus seluruh lingkungan pengembangan (`dev`/`staging`) dan meminta seluruh tim pengembang langsung menyunting kode sumber di server produksi secara bersama-sama.',
      'Memindahkan seluruh kewenangan pemrograman aplikasi harian ke Sekretaris Jenderal/Pimpinan Tinggi agar tataran *Governance* dan *Management* disatukan pada satu jabatan.',
      'Mengganti seluruh staf TI dengan vendor eksternal lalu memberikan satu akun `root` bersama kepada vendor tersebut untuk pengembangan, deployment, dan penghapusan audit log.',
    ],
    akarMasalah:
      'Penumpukan kewenangan pengembangan, persetujuan, deployment produksi, dan pengelolaan log pada satu individu menghilangkan kontrol silang (*checks and balances*) sehingga manipulasi kode/data mudah dilakukan tanpa terdeteksi.',
    solusiTerbaik:
      'Segregation of Duties (SoD) memisahkan pembuat, peninjau/penyetuju, pelaksana rilis (via CI/CD teraudit), dan auditor log, selaras dengan kerangka COBIT 2019 yang juga memisahkan fungsi *Governance* (EDM) dan *Management* (APO/BAI/DSS/MEA).',
    analisisPengecoh:
      'Kecepatan tanpa kontrol membuka fraud; menyunting langsung di produksi merusak integritas perubahan; COBIT 2019 secara tegas memisahkan Governance (pimpinan) dari Management (eksekusi harian); memindahkan konsentrasi kuasa tanpa SoD ke vendor hanya memindahkan risiko fraud.',
  },
  {
    level: 'C5',
    topik: 'Tata Kelola TI - Change Management (CAB) & Penanganan Emergency Change',
    pertanyaan:
      'Pada Minggu malam pukul 23.00 WIB, ditemukan bug kritis pada modul pembayaran retribusi yang menyebabkan seluruh transaksi warga gagal diproses. Tim teknis segera menyiapkan patch perbaikan 10 baris kode. Namun, jadwal rapat *Change Advisory Board (CAB)* reguler baru akan berlangsung hari Rabu pukul 10.00 WIB.\n\nBagaimana prosedur **Change Management (ITIL / SPBE)** yang paling tepat menghadapi dilema antara kecepatan pemulihan layanan publik dan kepatuhan pengendalian perubahan?',
    jawabanBenar:
      'Mengaktifkan jalur **Emergency Change** melalui persetujuan cepat **Emergency CAB (ECAB)** (pejabat berwenang siaga) dengan pengujian terfokus di staging + rencana *rollback* yang jelas sebelum deployment, lalu melakukan pencatatan tiket perubahan lengkap dan peninjauan pasca-implementasi (*Post-Implementation Review / PIR*) pada rapat CAB berikutnya.',
    pengecoh4: [
      'Membiarkan layanan pembayaran retribusi mati total selama tiga hari hingga rapat CAB reguler hari Rabu pukul 10.00 WIB demi mematuhi jadwal rapat formal.',
      'Langsung mendorong patch kode ke produksi secara diam-diam tanpa persetujuan siapa pun, tanpa rencana rollback, dan tanpa mencatat tiket perubahan sama sekali.',
      'Membubarkan forum CAB secara permanen karena keberadaan CAB dianggap selalu menghambat penanganan gangguan mendesak di lingkungan produksi.',
      'Mengubah kategori seluruh rilis fitur baru di masa depan menjadi *Emergency Change* agar tim pengembang tidak perlu pernah melalui proses review CAB reguler lagi.',
    ],
    akarMasalah:
      'Memaksakan alur *Normal Change* (CAB mingguan) pada insiden kritis menimbulkan downtime tak dapat diterima, sebaliknya melakukan *unauthorized change* tanpa jejak berisiko merusak stabilitas sistem.',
    solusiTerbaik:
      'Jalur *Emergency Change* (otorisasi cepat ECAB + uji terarah + rollback plan + dokumentasi & PIR pasca-rilis) menyeimbangkan kecepatan pemulihan layanan dengan akuntabilitas tata kelola perubahan.',
    analisisPengecoh:
      'Menunggu 3 hari merugikan layanan publik; perubahan diam-diam tanpa rollback plan berisiko memperburuk outage; membubarkan CAB menghilangkan kontrol perubahan; menyalahgunakan label Emergency untuk fitur biasa adalah pelanggaran tata kelola.',
  },
  {
    level: 'C4',
    topik: 'Tata Kelola TI - Perhitungan SLA Ketersediaan & Klausul OLA/UC',
    pertanyaan:
      'Kontrak vendor pusat data menjanjikan **SLA ketersediaan 99,9% per tahun** (dengan jendela operasional 24/7, 1 tahun = 365 hari = 8.760 jam = 525.600 menit). Dalam satu tahun berjalan, sistem mengalami 3 kali insiden *unplanned downtime* dengan durasi masing-masing: 4 jam, 3 jam 30 menit, dan 2 jam 15 menit (di luar jendela *scheduled maintenance* yang disepakati).\n\nHitung apakah vendor melanggar SLA dan evaluasi implikasi manajemen layanannya:',
    jawabanBenar:
      'Batas maksimum downtime SLA 99,9% per tahun adalah `0,1% × 525.600 menit = 525,6 menit` (8 jam 45 menit 36 detik), sedangkan total *unplanned downtime* aktual adalah `240 + 210 + 135 = 585 menit` (9 jam 45 menit, ketersediaan aktual ~99,889%); vendor **melanggar SLA** sehingga instansi berhak menagih penalti/service credit sesuai kontrak serta mewajibkan RCA dan rencana perbaikan keandalan.',
    pengecoh4: [
      'Batas maksimum downtime SLA 99,9% per tahun adalah 87,6 jam (3,65 hari), sehingga total downtime 9 jam 45 menit masih jauh di bawah batas toleransi dan vendor memenuhi SLA.',
      'Total downtime aktual hanya 7 jam 45 menit (465 menit), sehingga ketersediaan aktual mencapai 99,91% dan vendor berhak menerima bonus kinerja penuh.',
      'SLA 99,9% per tahun berarti sistem tidak boleh mengalami downtime lebih dari 5,26 menit dalam setahun, sehingga vendor melanggar kontrak sejak menit keenam.',
      'Karena ketiga insiden terjadi di tiga bulan berbeda, durasi downtime tidak dijumlahkan secara tahunan sehingga vendor otomatis lolos perhitungan SLA 99,9% tahunan.',
    ],
    akarMasalah:
      'Kesalahan menghitung konversi persentase ketersediaan (99,9% vs 99% vs 99,999%) membuat instansi gagal menegakkan hak penalti SLA dan evaluasi keandalan vendor secara objektif.',
    solusiTerbaik:
      '99,9% ("three nines") mengizinkan downtime maksimal 0,001 × 525.600 = 525,6 menit (~8,76 jam/tahun). Total aktual 4j + 3j30m + 2j15m = 9j45m = 585 menit > 525,6 menit -> SLA terlanggar.',
    analisisPengecoh:
      '87,6 jam adalah batas untuk 99% ("two nines"), bukan 99,9%; 4j + 3j30m + 2j15m = 9j45m (585 menit), bukan 7j45m; 5,26 menit adalah batas untuk 99,999% ("five nines"); SLA tahunan menghitung akumulasi downtime sepanjang 1 tahun berjalan.',
  },
  {
    level: 'C5',
    topik: 'Tata Kelola Keamanan - Siklus PDCA ISO/IEC 27001 & Klasifikasi Aset',
    pertanyaan:
      'Sebuah badan layanan publik memperoleh sertifikasi ISO/IEC 27001 tahun lalu, namun setelah sertifikat terbit, tim tidak lagi memperbarui daftar inventaris aset ketika 20 server baru dan 5 aplikasi layanan baru diluncurkan, serta tidak pernah melakukan audit internal maupun tinjauan manajemen selama setahun terakhir.\n\nDalam kerangka **SMKI ISO/IEC 27001**, kegagalan sistemik apa yang terjadi dan bagaimana dampaknya saat *surveillance audit*?',
    jawabanBenar:
      'Organisasi gagal menjalankan siklus perbaikan berkelanjutan (*Check* & *Act* / PDCA) serta pemeliharaan *Asset Inventory* & *Risk Assessment* pada perubahan lingkup baru; hal ini menjadi temuan ketidaksesuaian mayor (*Major Non-Conformity*) saat *surveillance audit* yang berisiko membekukan/mencabut sertifikasi sekaligus meninggalkan 20 server & 5 aplikasi baru tanpa kontrol keamanan tervalidasi.',
    pengecoh4: [
      'Tidak ada masalah karena sertifikat ISO/IEC 27001 berlaku otomatis selama 10 tahun tanpa perlu *surveillance audit*, audit internal, maupun pembaruan daftar aset.',
      'Inventaris aset pada ISO/IEC 27001 hanya mencatat meja, kursi, dan gedung kantor, sehingga penambahan 20 server dan 5 aplikasi baru tidak termasuk dalam ruang lingkup SMKI.',
      'Solusi tercepat menjelang audit adalah mengecualikan seluruh 20 server dan 5 aplikasi layanan utama dari ruang lingkup SMKI secara sepihak tanpa alasan bisnis yang valid.',
      'Audit internal dapat digantikan sepenuhnya dengan surat pernyataan kepala dinas bahwa belum pernah terjadi peretasan yang masuk berita nasional tahun ini.',
    ],
    akarMasalah:
      'Menganggap ISO/IEC 27001 sebagai proyek dokumentasi satu kali (*one-off compliance*) alih-alih Sistem Manajemen Keamanan Informasi (SMKI) hidup yang terus berputar mengikuti perubahan aset dan ancaman.',
    solusiTerbaik:
      'Memelihara inventaris aset dinamis, mengulang asesmen risiko setiap ada perubahan sistem signifikan, melaksanakan audit internal berkala, dan menggelar *Management Review* menjaga efektivitas SMKI dan keberlanjutan sertifikasi.',
    analisisPengecoh:
      'ISO 27001 memiliki siklus 3 tahun dengan *surveillance audit* tahunan; server dan aplikasi adalah aset informasi inti; mengecualikan sistem inti tanpa justifikasi valid (*cherry-picking scope*) ditolak auditor; surat pernyataan tanpa bukti audit internal adalah *Major Non-Conformity*.',
  },
  {
    level: 'C4',
    topik: 'Manajemen Data - Satu Data Indonesia (Perpres 39/2019): Peran & 4 Prinsip',
    pertanyaan:
      'Dalam rapat evaluasi pembangunan daerah, ditemukan data jumlah penduduk miskin yang disajikan Dinas Sosial berbeda 18% dengan data yang disajikan Bappeda dan Dinas Kesehatan karena masing-masing instansi memakai definisi variabel "rumah tangga miskin", kode wilayah kecamatan, serta format tanggal yang berbeda-beda.\n\nDitinjau dari **Perpres No. 39 Tahun 2019 tentang Satu Data Indonesia (SDI)**, prinsip SDI apa saja yang belum terpenuhi dan siapa peran yang berwenang menetapkan standar serta memeriksa kesesuaian data sebelum dipublikasikan?',
    jawabanBenar:
      'Keempat prinsip SDI belum terpenuhi secara utuh — terutama **Standar Data**, **Metadata**, **Kode Referensi/Data Induk**, dan **Interoperabilitas Data**; penyelesaiannya melalui penetapan Standar Data & Metadata baku oleh **Pembina Data** (misal BPS untuk data statistik/BIG untuk geospasial/Kemenkeu untuk keuangan), produksi data oleh **Produsen Data** (OPD), serta pemeriksaan kesesuaian prinsip SDI dan penyebarluasan melalui **Walidata** (Diskominfo/unit pengelola data) yang dikoordinasikan Forum SDI.',
    pengecoh4: [
      'Menyerahkan penetapan definisi variabel kemiskinan secara bebas kepada masing-masing programmer aplikasi OPD agar setiap dinas dapat merilis angka versinya sendiri di portal daerah.',
      'Menunjuk vendor pembuat dashboard BI eksternal sebagai **Pembina Data Nasional** untuk menetapkan kode wilayah kecamatan baru menggantikan standar BPS dan Kemendagri.',
      'Menghitung rata-rata aritmetika dari ketiga angka berbeda milik Dinas Sosial, Bappeda, dan Dinas Kesehatan setiap akhir tahun tanpa menyelaraskan definisi variabel maupun kode referensi.',
      'Melarang ketiga dinas tersebut memublikasikan data statistik daerah selama lima tahun ke depan agar perbedaan angka 18% tidak terlihat oleh masyarakat.',
    ],
    akarMasalah:
      'Ketiadaan kesepakatan Standar Data (konsep/definisi/klasifikasi), Metadata baku, dan Kode Referensi/Data Induk tunggal menyebabkan fragmentasi kebenaran data (*multiple conflicting versions of truth*).',
    solusiTerbaik:
      'Menegakkan 4 prinsip SDI (Standar Data, Metadata, Interoperabilitas, Kode Referensi/Data Induk) beserta pembagian peran baku Pembina Data, Walidata, dan Produsen Data menjamin konsistensi data lintas instansi.',
    analisisPengecoh:
      'Definisi bebas per programmer justru sumber inkonsistensi; Pembina Data ditetapkan pemerintah (BPS/BIG/Kemenkeu/instansi berwenang), bukan vendor BI; merata-ratakan angka dengan definisi berbeda menghasilkan angka tidak valid; menyembunyikan data melanggar keterbukaan informasi.',
  },
  {
    level: 'C5',
    topik: 'Manajemen Data - DAMA-DMBOK: Data Owner vs Data Steward vs Data Custodian',
    pertanyaan:
      'Di sebuah kementerian, terjadi konflik ketika tim Database Administrator (DBA) menolak mengubah aturan validasi bisnis kolom `status_kelayakan_bantuan` sementara Kepala Direktorat Bantuan Sosial menyalahkan tim DBA atas banyaknya data penerima yang duplikat dan tidak akurat. Selama ini tidak ada pembagian peran tata kelola data formal.\n\nBerdasarkan kerangka **DAMA-DMBOK**, bagaimana pembagian tanggung jawab yang tepat antara **Data Owner**, **Data Steward**, dan **Data Custodian**?',
    jawabanBenar:
      '**Data Owner** (Kepala Direktorat/eksekutif unit bisnis pemilik proses) bertanggung jawab menetapkan kebijakan, klasifikasi, dan akuntabilitas bisnis data; **Data Steward** (staf fungsional domain bisnis) mengelola definisi bisnis, aturan kualitas data, glosarium, dan remediasi inkonsistensi harian; sedangkan **Data Custodian** (tim TI/DBA) bertanggung jawab atas implementasi teknis penyimpanan, keamanan, backup, dan ketersediaan infrastruktur data.',
    pengecoh4: [
      'Tim DBA (Data Custodian) bertanggung jawab penuh menentukan definisi hukum penerima bantuan sosial sekaligus menanggung seluruh akuntabilitas kebijakan data menggantikan Kepala Direktorat.',
      'Data Owner hanya bertugas melakukan backup hard disk harian dan memantau utilisasi CPU server database, sementara Data Custodian menentukan kebijakan privasi dan kelayakan bantuan.',
      'Data Steward adalah perangkat lunak ETL otomatis sehingga tidak diperlukan penunjukan peran manusia di unit bisnis untuk menjaga kualitas dan kamus data.',
      'Seluruh pegawai di semua unit kerja secara bersama-sama memiliki hak penuh mengubah skema tabel dan definisi bisnis tanpa perlu membedakan peran Owner, Steward, maupun Custodian.',
    ],
    akarMasalah:
      'Ketiadaan pemisahan peran tata kelola data menyebabkan unit bisnis melempar tanggung jawab aturan kualitas bisnis ke tim TI (DBA), padahal tim TI hanya mengelola wadah teknis bukan makna bisnis data.',
    solusiTerbaik:
      'Pemetaan jelas Data Owner (akuntabilitas kebijakan bisnis), Data Steward (pengelolaan definisi & kualitas operasional), dan Data Custodian (infrastruktur teknis & keamanan) menciptakan kolaborasi efektif bisnis-TI.',
    analisisPengecoh:
      'DBA bukan pembuat kebijakan bisnis bantuan sosial; menukar tugas Owner dan Custodian terbalik total; Data Steward adalah peran organisasional manusia di domain bisnis; tanpa pemisahan peran akan terjadi kekacauan tata kelola data.',
  },
  {
    level: 'C6',
    topik: 'Data Warehouse - Perancangan Star Schema vs Snowflake Schema untuk Analitik',
    pertanyaan:
      'Kementerian Keuangan membangun Data Warehouse untuk dashboard eksekutif realisasi anggaran yang mengagregasi 800 juta baris transaksi belanja berdasarkan Waktu, Satuan Kerja, Akun Belanja, dan Wilayah Provinsi/Kabupaten. Pimpinan mensyaratkan respons query OLAP di bawah 2 detik untuk ratusan pengguna BI yang sering melakukan *drill-down* dan *slice-and-dice*.\n\nModel pemodelan dimensional manakah yang paling tepat dipilih untuk lapisan penyajian (*presentation layer*) Data Warehouse tersebut?',
    jawabanBenar:
      'Menggunakan **Star Schema** dengan satu tabel fakta (`fact_realisasi_belanja`) berisi metrik numerik & foreign key yang dikelilingi tabel dimensi terdenormalisasi (`dim_waktu`, `dim_satker`, `dim_akun`, `dim_wilayah`), sehingga meminimalkan jumlah operasi `JOIN`, mempercepat eksekusi kueri agregasi OLAP, serta memudahkan pemahaman alat BI dibanding Snowflake Schema yang menormalisasi dimensi ke banyak tabel anak.',
    pengecoh4: [
      'Menggunakan skema relasional transaksional 3NF/BCNF yang dipecah menjadi 45 tabel kecil berjenjang agar seluruh kueri dashboard melakukan 18 kali `JOIN` demi menghemat beberapa megabita ruang disk dimensi.',
      'Menyimpan seluruh 800 juta baris transaksi dalam satu kolom `TEXT` berisi string JSON tak terstruktur tanpa tabel dimensi dan tanpa partisi tanggal.',
      'Menjalankan kueri dashboard OLAP pimpinan secara langsung ke tabel produksi OLTP sistem pencairan anggaran tanpa membuat Data Warehouse terpisah.',
      'Menggunakan **Snowflake Schema** berlapis 6 tingkat normalisasi untuk seluruh dimensi karena semakin banyak `JOIN` antar-tabel dimensi maka kinerja agregasi OLAP akan selalu makin cepat.',
    ],
    akarMasalah:
      'Beban kerja analitik (OLAP) didominasi pembacaan agregat masif dan *join* dimensi; normalisasi berlebihan ala OLTP (3NF/Snowflake dalam) menambah biaya `JOIN` dan kompleksitas query BI.',
    solusiTerbaik:
      'Star Schema (fakta + dimensi terdenormalisasi) adalah standar industri Kimball untuk lapisan analitik karena jumlah `JOIN` minimal, ramah *bitmap/columnar index*, dan intuitif bagi pengguna BI.',
    analisisPengecoh:
      '3NF dengan 18 `JOIN` memperlambat agregasi 800 juta baris; JSON tak terstruktur merusak performa kolumnar/agregasi; menjalankan OLAP berat di DB OLTP produksi mengganggu transaksi pencairan anggaran; lebih banyak `JOIN` pada Snowflake justru memperlambat pembacaan dibanding Star Schema.',
  },
  {
    level: 'C6',
    topik: 'Data Warehouse - Menjaga Historisitas Dimensi dengan SCD Type 2',
    pertanyaan:
      'Pada Data Warehouse kepegawaian nasional, seorang ASN (`nip = 199001012015031001`) bertugas di "Dinas Kesehatan" selama tahun 2022–2024, lalu pada 1 Januari 2025 dimutasi ke "Dinas Pendidikan". Pimpinan membutuhkan laporan historis belanja pegawai per dinas tahun 2023 tetap menghitung pegawai tersebut di "Dinas Kesehatan", sedangkan laporan tahun 2025 menghitungnya di "Dinas Pendidikan".\n\nStrategi **Slowly Changing Dimension (SCD)** manakah yang paling tepat diterapkan pada tabel `dim_pegawai`?',
    jawabanBenar:
      'Menerapkan **SCD Type 2**: menggunakan *surrogate key* (`pegawai_sk`), menutup baris lama "Dinas Kesehatan" dengan `effective_end_date = 2024-12-31` dan `is_current = false`, lalu menyisipkan baris baru dengan `pegawai_sk` baru untuk "Dinas Pendidikan" (`effective_start_date = 2025-01-01`, `effective_end_date = 9999-12-31`, `is_current = true`) sehingga tabel fakta tahun 2023 tetap terhubung ke histori unit lama dan fakta 2025 terhubung ke unit baru.',
    pengecoh4: [
      'Menerapkan **SCD Type 1** dengan menimpa langsung kolom `unit_kerja` dari "Dinas Kesehatan" menjadi "Dinas Pendidikan" pada satu baris yang sama sehingga seluruh laporan tahun 2023 ikut berubah menjadi Dinas Pendidikan.',
      'Menerapkan **SCD Type 0** dengan membekukan seluruh data pegawai sejak pertama diangkat sebagai CPNS sehingga mutasi ke Dinas Pendidikan pada tahun 2025 tidak pernah dicatat di Data Warehouse.',
      'Menghapus seluruh baris transaksi fakta gaji pegawai tersebut pada tahun 2022–2024 setiap kali terjadi mutasi agar tidak muncul konflik unit kerja di dashboard.',
      'Menggunakan `nip` sebagai satu-satunya Primary Key pada `dim_pegawai` tanpa surrogate key maupun kolom tanggal berlaku, lalu membuat tabel `dim_pegawai_2023`, `dim_pegawai_2024`, dan `dim_pegawai_2025` terpisah.',
    ],
    akarMasalah:
      'Perubahan atribut dimensi (mutasi unit kerja) jika ditimpa langsung (SCD Type 1) akan mendistorsi laporan historis, sedangkan jika diabaikan (SCD Type 0) membuat laporan masa kini tidak akurat.',
    solusiTerbaik:
      'SCD Type 2 menyimpan riwayat penuh perubahan dimensi secara kronologis memakai *surrogate key* + rentang tanggal efektif (`effective_start_date`, `effective_end_date`, `is_current`), menjaga akurasi analitik lintas periode waktu.',
    analisisPengecoh:
      'SCD Type 1 menimpa sejarah; SCD Type 0 menolak pembaruan sah; menghapus fakta 2022–2024 menghancurkan audit historis; memecah tabel dimensi per tahun merusak konsistensi skema dan menyulitkan kueri multi-tahun.',
  },
  {
    level: 'C5',
    topik: 'Manajemen Data - Arsitektur Lakehouse (Medallion: Bronze-Silver-Gold) & ELT',
    pertanyaan:
      'Instansi membangun platform analitik nasional yang menyerap data dari 40 sumber beragam (log JSON streaming, API REST, berkas CSV harian, dan tabel RDBMS) dengan total pertumbuhan 500 GB/hari. Pipeline ETL lama sering gagal total di tengah malam setiap kali salah satu sumber menambah kolom JSON baru, sehingga data mentah hari itu ikut hilang dan tidak bisa diproses ulang (*reprocessed*).\n\nDesain arsitektur pipeline data modern manakah yang paling tepat mengatasi kerapuhan tersebut?',
    jawabanBenar:
      'Mengadopsi pola **ELT** berbasis **Medallion Architecture (Bronze–Silver–Gold)** di Data Lakehouse: menyerap data mentah apa adanya secara *immutable* ke lapisan **Bronze** (mendukung *schema-on-read* & replay/reprocessing bila transformasi berubah), membersihkan/menstandarkan/deduplikasi dengan *schema enforcement* di lapisan **Silver**, dan menyajikan tabel agregasi siap pakai bagi BI/AI di lapisan **Gold**.',
    pengecoh4: [
      'Membangun skrip Python tunggal di satu laptop analis yang langsung mengubah data mentah dari 40 sumber menjadi file Excel akhir tanpa menyimpan salinan data mentah (*raw layer*).',
      'Memaksa seluruh 40 sistem sumber menghentikan seluruh penambahan kolom selama sepuluh tahun ke depan lalu menghapus seluruh data jika ditemukan satu baris format berbeda.',
      'Menyimpan data mentah, data bersih, dan laporan akhir bercampur dalam satu tabel PostgreSQL tunggal tanpa pemisahan lapisan maupun partisi tanggal.',
      'Mengganti seluruh penyimpanan Object Storage menjadi berkas CSV biasa yang ditimpa ulang setiap jam tanpa riwayat versi maupun transaksi ACID (*Delta/Iceberg*).',
    ],
    akarMasalah:
      'Pipeline ETL kaku tanpa penyimpanan lapisan mentah (*raw immutable landing*) menyebabkan *schema drift* langsung menggagalkan ingest dan menghilangkan kemampuan memproses ulang data historis.',
    solusiTerbaik:
      'Medallion Architecture (Bronze mentah immutable -> Silver tervalidasi & terintegrasi -> Gold teragregasi untuk bisnis) + format tabel terbuka (Delta Lake/Apache Iceberg) menjamin *replayability*, isolasi kegagalan *schema drift*, dan kualitas bertahap.',
    analisisPengecoh:
      'Tanpa lapisan mentah, bug transformasi tidak bisa diputar ulang; membekukan skema 40 sistem sumber tidak realistis; mencampur semua lapisan di satu DB OLTP memicu bottleneck; menimpa CSV tanpa ACID merusak konsistensi pembacaan paralel.',
  },
  {
    level: 'C6',
    topik: 'Manajemen Data - Master Data Management (MDM) & Golden Record',
    pertanyaan:
      'Data satu entitas warga yang sama tercatat berbeda di tiga sistem dinas: di Dinas Kesehatan tertulis `"M. Rizky Pratama | Jl. Merdeka 10"`, di Dinas Pendidikan tertulis `"Muhammad Rizki Pratama | Jln. Merdeka No.10"`, dan di Dinas Sosial tercatat dua baris berbeda akibat salah ketik 1 digit NIK. Hal ini menyebabkan penyaluran bantuan ganda dan kegagalan integrasi layanan.\n\nPendekatan **Master Data Management (MDM)** manakah yang paling tepat untuk membentuk *Single Source of Truth*?',
    jawabanBenar:
      'Membangun **MDM Hub** yang menjalankan proses **Entity Resolution** (standardisasi/normalisasi atribut + pencocokan deterministik berdasarkan kunci induk seperti NIK terverifikasi Dukcapil dipadukan *probabilistic/fuzzy matching* untuk anomali), menerapkan **Survivorship Rules** (menetapkan sumber otoritatif paling tepercaya per atribut), menyediakan antarmuka *Data Stewardship* untuk resolusi kasus ambigu, dan menerbitkan **Golden Record** beserta ID induk ke seluruh sistem konsumen.',
    pengecoh4: [
      'Menghapus secara otomatis semua baris yang memiliki panjang string nama berbeda dari baris pertama yang ditemukan di basis data Dinas Sosial tanpa memverifikasi ke Dukcapil.',
      'Membiarkan ketiga dinas menyimpan duplikat masing-masing lalu melarang integrasi antar-dinas agar ketidaksamaan ejaan nama tidak pernah ditemukan.',
      'Menggabungkan seluruh data secara paksa hanya berdasarkan kemiripan huruf pertama nama depan (`LEFT(nama, 3)`) tanpa memeriksa tanggal lahir, alamat, maupun NIK.',
      'Menyalin data dari Dinas Sosial secara membabi buta untuk menimpa basis data induk kependudukan Dukcapil sebagai satu-satunya acuan.',
    ],
    akarMasalah:
      'Duplikasi, variasi ejaan, dan typo identifier antar-sistem silo mencegah identifikasi entitas warga secara tunggal, memicu bantuan ganda dan analisis keliru.',
    solusiTerbaik:
      'MDM dengan *deterministic + probabilistic matching*, *survivorship rules* berbasis sumber otoritatif (Dukcapil untuk identitas kependudukan), dan *human-in-the-loop Data Stewardship* menghasilkan *Golden Record* yang akurat.',
    analisisPengecoh:
      'Penghapusan acak berbasis panjang nama merusak data valid; melarang integrasi melanggar SPBE; pencocokan 3 huruf depan menghasilkan ribuan *false positive* penggabungan orang berbeda; data lokal dengan typo tidak boleh menimpa sistem registrasi induk otoritatif.',
  },
  {
    level: 'C4',
    topik: 'Manajemen Data - Diagnosis 6 Dimensi Kualitas Data (Data Quality)',
    pertanyaan:
      'Tim Data Quality menjalankan profilisasi otomatis terhadap 100.000 baris dataset penerima subsidi pangan dan memperoleh laporan temuan berikut:\n\n```text\nTemuan 1: 4.200 baris kolom `tanggal_lahir` bernilai NULL (kosong).\nTemuan 2: 850 baris memiliki `tanggal_meninggal` lebih awal daripada `tanggal_lahir`.\nTemuan 3: 1.900 baris memiliki format kode pos 3 digit atau berisi huruf ("ABC12").\nTemuan 4: 620 baris tercatat masih menerima subsidi pada 2026 padahal data kematian Dukcapil 2024 belum disinkronkan.\n```\n\nPemetaan empat temuan tersebut terhadap **Dimensi Kualitas Data** yang paling presisi secara berurutan adalah:',
    jawabanBenar:
      'Temuan 1 = **Completeness** (kelengkapan), Temuan 2 = **Consistency** (konsistensi logis antar-atribut), Temuan 3 = **Validity** (kesesuaian format/domain aturan), dan Temuan 4 = **Timeliness / Currency** (ketepatan waktu & keterkinian data).',
    pengecoh4: [
      'Temuan 1 = **Uniqueness**, Temuan 2 = **Timeliness**, Temuan 3 = **Completeness**, dan Temuan 4 = **Validity**.',
      'Temuan 1 = **Validity**, Temuan 2 = **Uniqueness**, Temuan 3 = **Timeliness**, dan Temuan 4 = **Completeness**.',
      'Temuan 1 = **Timeliness**, Temuan 2 = **Completeness**, Temuan 3 = **Uniqueness**, dan Temuan 4 = **Validity**.',
      'Keempat temuan tersebut seluruhnya hanya termasuk dimensi **Uniqueness** karena semuanya terjadi pada tabel penerima subsidi yang sama.',
    ],
    akarMasalah:
      'Membedakan dimensi kualitas data secara tepat sangat krusial karena setiap dimensi memerlukan aturan validasi dan akar perbaikan berbeda (misal NOT NULL untuk completeness, cross-field check untuk consistency, regex/domain check untuk validity, dan SLA sinkronisasi/CDC untuk timeliness).',
    solusiTerbaik:
      'NULL = *Completeness*; tanggal meninggal < tanggal lahir = *Consistency*; kode pos non-5-digit = *Validity*; keterlambatan pembaruan status kematian 2024 -> 2026 = *Timeliness/Currency*.',
    analisisPengecoh:
      '*Uniqueness* mengukur ketiadaan duplikasi entitas (bukan NULL atau inkonsistensi tanggal); tertukarnya label dimensi akan mengarahkan tim rekayasa data pada solusi yang keliru.',
  },
  {
    level: 'C4',
    topik: 'Manajemen Data - Data Lineage & Analisis Dampak Perubahan Skema',
    pertanyaan:
      'Tim aplikasi inti perbendaharaan berencana mengganti tipe data dan nama kolom `kode_akun_lama` menjadi `kode_bas_v2` pada tabel `jurnal_transaksi` malam ini. Namun di hilir terdapat 14 pipeline ETL/dbt, 9 tabel Data Warehouse, 22 dashboard eksekutif, dan 3 model prediksi kas yang bergantung secara langsung maupun tidak langsung pada kolom tersebut — dan sebelumnya perubahan serupa pernah membuat seluruh laporan pimpinan error selama 3 hari.\n\nKapabilitas manajemen metadata apa yang paling tepat digunakan sebelum perubahan dieksekusi?',
    jawabanBenar:
      'Memanfaatkan **Automated Column-Level Data Lineage & Impact Analysis** (dari Data Catalog / metadata graph seperti OpenLineage/dbt lineage) untuk memetakan seluruh dependensi hilir (pipeline, tabel, dashboard, model ML) yang mengonsumsi `kode_akun_lama`, berkoordinasi dengan seluruh *downstream owners*, serta menerapkan pola migrasi transisi (*dual column* / view kompatibilitas sementara) sebelum kolom lama dideprekasi.',
    pengecoh4: [
      'Langsung menjalankan `ALTER TABLE jurnal_transaksi RENAME COLUMN` pada jam 01.00 WIB lalu menunggu laporan keluhan dari pengguna dashboard keesokan paginya untuk mengetahui sistem mana saja yang rusak (*scream test*).',
      'Menghapus seluruh 22 dashboard eksekutif dan 3 model prediksi kas sebelum mengubah nama kolom agar tidak ada laporan error yang muncul di layar pimpinan.',
      'Mengandalkan ingatan lisan satu orang analis senior tentang daftar tabel hilir tanpa mencatat katalog metadata maupun grafik dependensi.',
      'Menyalin seluruh tabel `jurnal_transaksi` ke 14 server terpisah agar setiap pipeline ETL mengubah nama kolomnya masing-masing secara bebas.',
    ],
    akarMasalah:
      'Ketiadaan visibilitas *downstream dependency* (*column-level lineage*) menyebabkan perubahan skema di hulu memicu *silent data breakage* atau kegagalan masal di seluruh analitik hilir.',
    solusiTerbaik:
      'Data Lineage tingkat kolom + *Impact Analysis* + *data contract* / masa transisi dual-column memastikan seluruh konsumen hilir termigrasi terukur tanpa memutus laporan eksekutif.',
    analisisPengecoh:
      '*Scream test* menyebabkan gangguan layanan strategis; menghapus dashboard merusak fungsi bisnis; mengandalkan ingatan rawan lupa (*tribal knowledge*); menduplikasi tabel ke 14 server menciptakan silo dan inkonsistensi data.',
  },
  {
    level: 'C6',
    topik: 'Keamanan Data - Data Masking & Synthetic Data untuk Lingkungan Non-Produksi',
    pertanyaan:
      'Tim pengembang dan QA membutuhkan salinan 5 juta baris data transaksi kependudukan dan rekening penerima bantuan sosial di server `staging` dan laptop lokal pengembang untuk melakukan uji performa dan debugging. Kebijakan lama melakukan `pg_dump` langsung dari database produksi lalu merestore-nya mentah-mentah ke server `staging` yang diakses 25 programmer vendor.\n\nEvaluasi risiko kebijakan lama tersebut terhadap **UU PDP** & keamanan data, lalu pilih solusi teknis paling tepat:',
    jawabanBenar:
      'Menyalin data pribadi produksi mentah ke lingkungan `staging`/laptop vendor melanggar prinsip pembatasan tujuan & minimalisasi akses serta memperluas permukaan kebocoran; terapkan pipeline **Static Data Masking (SDM) / Pseudonymization ireversibel** (atau pembuatan **Synthetic Data** yang mempertahankan distribusi statistik, integritas referensial foreign key, dan format panjang kolom tanpa mengandung PII asli warga) sebelum data masuk ke lingkungan non-produksi.',
    pengecoh4: [
      'Tetap merestore dump produksi mentah ke laptop ke-25 programmer vendor namun meminta mereka berjanji tidak membuka tabel `penduduk` dengan perintah `SELECT`.',
      'Mengenkripsi seluruh berkas `pg_dump` selama pengiriman lalu mendekripsinya kembali menjadi plaintext penuh di server `staging` yang tidak memiliki kontrol akses ketat.',
      'Menghapus seluruh data di server `staging` dan melarang pengujian kinerja maupun debugging menggunakan data bervolume besar hingga kode langsung naik ke produksi.',
      'Cukup mengacak urutan baris (`ORDER BY RANDOM()`) pada salinan database `staging` tanpa mengubah nilai NIK, nama lengkap, maupun nomor rekening asli warga.',
    ],
    akarMasalah:
      'Lingkungan non-produksi (`dev`/`staging`) umumnya memiliki kontrol keamanan lebih longgar dan diakses lebih banyak pihak (termasuk vendor), sehingga menempatkan PII produksi mentah di sana menjadi sumber kebocoran data paling umum.',
    solusiTerbaik:
      'Static Data Masking (mengganti nama, NIK, rekening dengan nilai palsu konsisten lintas FK) atau *Synthetic Data* menjaga realisme uji performa & integritas relasional sambil menghilangkan 100% paparan PII nyata.',
    analisisPengecoh:
      'Janji verbal tidak mencegah kebocoran dari laptop hilang/malware; enkripsi in-transit tidak melindungi data plaintext yang terpapar di staging; melarang uji performa memindahkan bug fatal ke produksi; mengacak urutan baris tetap meninggalkan seluruh PII asli utuh.',
  },
  {
    level: 'C5',
    topik: 'Keamanan Data - Membedakan Anonymization, Pseudonymization & Risiko Re-Identifikasi',
    pertanyaan:
      'Dinas Kesehatan ingin merilis dataset terbuka (*Open Data*) riset penyakit menular ke universitas dengan hanya menghapus kolom `Nama` dan `NIK`, namun tetap membiarkan kolom `Tanggal Lahir Lengkap`, `Jenis Kelamin`, `Kode Pos 5 Digit`, dan `Diagnosis Penyakit` utuh per individu. Tim peneliti keamanan mendemonstrasikan bahwa 87% individu dalam dataset tersebut tetap dapat diidentifikasi ulang dengan mencocokkannya ke daftar pemilih publik (*linkage attack*).\n\nMengapa penghapusan `Nama` dan `NIK` saja belum memenuhi status **Anonimisasi**, dan teknik privasi apa yang paling tepat diterapkan?',
    jawabanBenar:
      'Kombinasi atribut tidak langsung (*quasi-identifiers*: tanggal lahir + jenis kelamin + kode pos) masih mengidentifikasi individu secara unik (statusnya baru **de-identifikasi lemah / pseudonimisasi**, sehingga tetap tunduk penuh pada UU PDP); untuk publikasi riset terbuka, terapkan teknik **Anonimisasi formal** seperti **Generalisasi & Supresi (*k-Anonymity* / *l-Diversity*)** (misal mengubah tanggal lahir menjadi rentang usia 5 tahun dan kode pos ke tingkat kecamatan) dan/atau **Differential Privacy** pada hasil agregasi statistik sehingga risiko re-identifikasi secara praktis hilang.',
    pengecoh4: [
      'Cukup mengganti kolom `NIK` dengan nilai hash `SHA-256(NIK)` tanpa salt lalu membiarkan `Tanggal Lahir`, `Jenis Kelamin`, dan `Kode Pos` utuh karena hash SHA-256 membuat dataset mustahil diidentifikasi ulang.',
      'Menghapus kolom `Diagnosis Penyakit` dan tetap memublikasikan `Nama`, `NIK`, dan `Alamat` agar universitas tetap memiliki daftar lengkap warga tanpa melanggar privasi kesehatan.',
      'Mengubah urutan kolom di berkas CSV (`Kode Pos` diletakkan di kolom pertama) sehingga teknik pencocokan *linkage attack* tidak dapat lagi bekerja pada dataset tersebut.',
      'Meminta universitas menandatangani surat pernyataan bahwa mereka tidak akan mencari tahu identitas pasien lalu mengunggah berkas yang sama ke portal data terbuka publik tanpa modifikasi.',
    ],
    akarMasalah:
      'Penghapusan *direct identifiers* (Nama, NIK) tidak melindungi dari *linkage attack* jika kombinasi *quasi-identifiers* (tanggal lahir, gender, kode pos) masih unik per individu.',
    solusiTerbaik:
      'Generalisasi/supresi berbasis *k-anonymity* + *l-diversity* (memastikan setiap kelompok quasi-identifier minimal berisi *k* individu dengan keragaman nilai sensitif) dan/atau *Differential Privacy* menekan risiko re-identifikasi secara matematis.',
    analisisPengecoh:
      'Hash `SHA-256(NIK)` tanpa salt mudah dipecahkan karena ruang NIK terstruktur dan quasi-identifier tetap membuka *linkage attack*; memublikasikan Nama+NIK justru membocorkan data pribadi; mengubah urutan kolom tidak menghalangi pencocokan; surat pernyataan tidak melindungi dataset yang diunggah ke portal terbuka.',
  },
  {
    level: 'C5',
    topik: 'Keamanan Data - Enkripsi vs Tokenization vs Cryptographic Hashing',
    pertanyaan:
      'Arsitek data merancang skema penyimpanan tiga jenis informasi pada portal layanan keuangan pemerintah:\n\n```text\n[A] Kata sandi login pengguna (hanya perlu diverifikasi saat login, tidak boleh pernah dibaca ulang)\n[B] Nomor kartu/rekening bank untuk integrasi sistem pihak ketiga dengan eksposur minimal di DB aplikasi\n[C] Dokumen PDF kontrak pengadaan rahasia yang harus bisa dibuka kembali oleh pejabat berwenang\n```\n\nPemetaan teknik proteksi kriptografi manakah yang paling tepat untuk [A], [B], dan [C]?',
    jawabanBenar:
      '[A] menggunakan **Password Hashing KDF satu arah** (`Argon2id`/`bcrypt` + salt acak unik), [B] menggunakan **Tokenization** (mengganti nomor asli dengan token tak bermakna acak, sedangkan pemetaan asli disimpan terisolasi di *Token Vault* berkeamanan tinggi), dan [C] menggunakan **Authenticated Encryption dua arah** (`AES-256-GCM` dengan *Envelope Encryption* melalui KMS/HSM) agar dapat didekripsi kembali oleh pihak berwenang.',
    pengecoh4: [
      '[A] menggunakan enkripsi simetris `AES-256`, [B] menggunakan encoding `Base64`, dan [C] menggunakan hashing satu arah `SHA-256` agar dokumen kontrak dapat didekripsi cepat.',
      '[A] menggunakan `Tokenization` di vault publik, [B] menggunakan hashing `MD5` tanpa salt agar nomor rekening bisa dibaca ulang payment gateway, dan [C] menggunakan `ROT13`.',
      'Ketiganya ([A], [B], dan [C]) cukup menggunakan algoritma hashing satu arah `SHA-512` tanpa kunci karena hashing merupakan metode proteksi terkuat yang selalu bisa didekripsi admin.',
      'Ketiganya ([A], [B], dan [C]) cukup disimpan dalam plaintext selama disk server menggunakan sistem berkas `ext4` dan kata sandi root server terdiri dari 12 karakter.',
    ],
    akarMasalah:
      'Memilih mekanisme proteksi yang tidak sesuai kebutuhan siklus hidup data (misal mengenkripsi password atau meng-hash dokumen yang perlu dibaca ulang) merusak keamanan maupun fungsionalitas sistem.',
    solusiTerbaik:
      'Password -> one-way memory-hard KDF (`Argon2id`); nomor pembayaran/sensitif lintas layanan -> `Tokenization` (memperkecil cakupan kepatuhan/eksposur); dokumen rahasia yang perlu diakses ulang -> `AES-256-GCM` + Envelope Encryption KMS/HSM.',
    analisisPengecoh:
      'Hash satu arah (`SHA-256`/`SHA-512`) secara matematis tidak dapat didekripsi kembali untuk membaca kontrak atau nomor rekening; Base64 dan ROT13 bukan keamanan; enkripsi dua arah pada password meningkatkan risiko pencurian massal; plaintext di disk melanggar dasar keamanan data.',
  },
  {
    level: 'C4',
    topik: 'Manajemen Data - Data Lifecycle & Pemusnahan Media Aset BMN (NIST SP 800-88)',
    pertanyaan:
      'Sebanyak 40 server fisik bekas penyimpanan basis data kependudukan dan perpajakan telah habis masa ekonomisnya dan akan dihapusbukukan sebagai Barang Milik Negara (BMN) untuk dilelang atau dimusnahkan. Seorang teknisi mengusulkan cukup menjalankan perintah `Quick Format` pada seluruh disk SSD NVMe sebelum perangkat diserahkan kepada pemenang lelang.\n\nEvaluasi risiko usulan teknisi tersebut berdasarkan standar sanitasi media (**NIST SP 800-88**) dan langkah pemusnahan paling tepat:',
    jawabanBenar:
      '`Quick Format` hanya menghapus tabel partisi/direktori berkas sementara blok data mentah (termasuk blok *wear-leveling* / *over-provisioned* pada SSD) masih utuh dan dapat dipulihkan dengan alat forensik; terapkan prosedur sanitasi sesuai klasifikasi data (**NIST SP 800-88**: *Purge* melalui *Cryptographic Erase* / perintah *NVMe Format Crypto Erase* bila disk terenkripsi penuh sejak awal, atau *Destroy* secara fisik lewat penghancuran/shredding media untuk data rahasia negara) disertai berita acara dan sertifikat pemusnahan.',
    pengecoh4: [
      'Usulan `Quick Format` sudah 100% aman untuk SSD NVMe karena setiap kali tabel partisi dihapus, chip flash NAND secara fisik melelehkan seluruh sel memori yang menyimpan data lama.',
      'Menjalankan `rm -rf /var/lib/postgresql` dari sistem operasi sudah cukup menghapus seluruh jejak data kependudukan di level blok penyimpanan termasuk area *over-provisioning* SSD.',
      'Menggunakan teknik *degaussing* (medan magnet kuat) pada drive SSD NVMe karena seluruh data pada chip flash NAND disimpan dalam bentuk polaritas magnetik seperti pita kaset.',
      'Memindahkan seluruh berkas database ke folder `Trash / Recycle Bin` lalu mengosongkannya dari antarmuka desktop agar perangkat langsung siap dilelang ke pihak ketiga.',
    ],
    akarMasalah:
      'Penghapusan logis (`Quick Format`/`rm -rf`) tidak menghapus payload di sel memori fisik, dan pada SSD keberadaan *wear-leveling* serta *over-provisioning* membuat penimpaan file biasa pun tidak menjamin seluruh blok bersih.',
    solusiTerbaik:
      'NIST SP 800-88 merekomendasikan *Purge* berbasis *Cryptographic Erase* (menghapus kunci enkripsi internal SED/FDE) atau *NVMe Sanitize* yang terverifikasi, dan untuk data sangat rahasia/kependudukan negara dilakukan *Physical Destruction* (disintegrasi/shredding SSD) dengan berita acara BMN.',
    analisisPengecoh:
      '`Quick Format`, `rm -rf`, dan mengosongkan `Recycle Bin` mudah dipulihkan via *data carving*; *degaussing* hanya bekerja pada media magnetik (HDD/tape) dan sama sekali tidak menghapus data pada chip semikonduktor SSD.',
  },
  {
    level: 'C5',
    topik: 'Manajemen Data - Pengelolaan Metadata & Data Catalog Pemerintahan',
    pertanyaan:
      'Para analis kebijakan di 15 unit kerja kementerian menghabiskan 70% waktunya hanya untuk mencari letak tabel yang benar, bertanya lewat chat siapa penanggung jawab tabel, menebak makna kode angka `status = 4`, dan sering kali tanpa sadar membangun tabel turunan duplikat dari dataset yang sudah ada. Manajemen ingin mengatasi masalah *data swamp* tersebut.\n\nSolusi tata kelola data manakah yang paling tepat untuk memulihkan *discoverability* dan kepercayaan terhadap aset data?',
    jawabanBenar:
      'Mengimplementasikan **Enterprise Data Catalog** terpadu yang menghimpun tiga jenis metadata secara otomatis dan kolaboratif — **Technical Metadata** (skema, tipe data, lineage), **Business Metadata** (glosarium bisnis, definisi kode nilai `status = 4`, Data Owner/Steward), dan **Operational Metadata** (jadwal refresh, skor kualitas data, SLA) — yang terintegrasi langsung dengan pipeline data dan katalog Satu Data.',
    pengecoh4: [
      'Membuat satu dokumen Word berisi 800 halaman kamus tabel yang disimpan di folder lokal satu staf dan hanya diperbarui secara manual setiap dua tahun sekali.',
      'Membatasi akses seluruh analis kebijakan agar tidak boleh mencari maupun melihat skema tabel apa pun kecuali meminta ekspor Excel satu per satu lewat surat dinas fisik.',
      'Menghapus seluruh nama kolom deskriptif dan menggantinya dengan kode singkat `col_1` hingga `col_50` agar para analis wajib menghafal struktur basis data.',
      'Menambah kapasitas penyimpanan Data Lake menjadi 10 kali lipat tanpa pencatatan metadata sehingga analis dapat menyalin tabel duplikat baru kapan saja mereka ragu.',
    ],
    akarMasalah:
      'Data Lake/Warehouse tanpa manajemen metadata aktif berubah menjadi *data swamp* (rawa data): data melimpah tetapi tidak dapat ditemukan, tidak dipahami makna bisnisnya, dan tidak jelas kepemilikannya.',
    solusiTerbaik:
      'Enterprise Data Catalog yang menyinkronkan metadata teknis, bisnis, dan operasional secara otomatis (plus *data lineage* & *business glossary*) mempercepat penemuan data akurat dan mencegah duplikasi dataset.',
    analisisPengecoh:
      'Dokumen Word manual 2 tahunan segera usang (*stale*); mengunci akses lewat surat fisik melumpuhkan pengambilan keputusan berbasis data; menamai `col_1..col_50` memperparah kebingungan; menambah kapasitas disk tanpa metadata hanya memperbesar *data swamp*.',
  },
  {
    level: 'C6',
    topik: 'Manajemen Data - Data Mesh vs Centralized Data Team pada Instansi Skala Besar',
    pertanyaan:
      'Sebuah kementerian besar memiliki 12 direktorat domain berbeda (Perizinan, Pajak, Kepegawaian, Pengadaan, dll.) yang semuanya bergantung pada satu tim Data Engineering pusat beranggotakan 6 orang untuk membuat seluruh pipeline dan tabel analitik. Antrean permintaan integrasi data menumpuk hingga 9 bulan, dan tim pusat sering salah menafsirkan aturan bisnis tiap direktorat karena kurangnya pengetahuan domain.\n\nPendekatan sosio-teknis arsitektur data modern manakah yang paling tepat untuk mengurai bottleneck tersebut tanpa kehilangan standar interoperabilitas nasional?',
    jawabanBenar:
      'Menerapkan prinsip **Data Mesh** secara bertahap dan pragmatis: mendelegasikan kepemilikan **Data sebagai Produk (*Data as a Product*)** kepada masing-masing tim domain yang paling memahami aturan bisnisnya, didukung **Self-Serve Data Platform** terpusat (disediakan tim pusat untuk CI/CD, katalog, observabilitas, dan keamanan), serta dipayungi **Federated Computational Governance** agar seluruh domain tetap patuh pada standar interoperabilitas, metadata SDI, dan UU PDP secara otomatis.',
    pengecoh4: [
      'Membubarkan seluruh standar tata kelola data pusat sehingga ke-12 direktorat bebas memakai format tanggal, sistem keamanan, dan definisi data berbeda tanpa perlu bisa saling terhubung.',
      'Mempertahankan antrean terpusat 9 bulan di tim beranggotakan 6 orang dan melarang seluruh 12 direktorat membuat analitik data sendiri dalam bentuk apa pun.',
      'Meminta masing-masing dari 12 direktorat membangun 12 platform infrastruktur Data Warehouse dan server cloud terpisah yang saling tidak kompatibel.',
      'Menghapus seluruh proses transformasi dan kualitas data di tim pusat lalu langsung menyambungkan dashboard menteri ke seluruh 12 basis data OLTP mentah.',
    ],
    akarMasalah:
      'Tim data monolitik terpusat mengalami bottleneck skalabilitas organisasi dan kesenjangan pemahaman konteks bisnis lintas 12 domain berbeda.',
    solusiTerbaik:
      'Keempat pilar Data Mesh (Domain Ownership, Data as a Product, Self-Serve Data Infrastructure Platform, dan Federated Computational Governance) memecah bottleneck tim pusat sambil tetap menjaga standar global dan kepatuhan regulasi.',
    analisisPengecoh:
      'Menghapus standar pusat menimbulkan anarki silo data; mempertahankan bottleneck 9 bulan menghambat kebijakan publik; membangun 12 infrastruktur terpisah memboroskan anggaran SPBE; menghubungkan BI langsung ke OLTP mentah mengganggu transaksi dan kehilangan kualitas data.',
  },
  {
    level: 'C4',
    topik: 'Manajemen Data - Analisis Anomali Pipeline & Data Observability (5 Pilar)',
    pertanyaan:
      'Pada Senin pagi pukul 08.30 WIB, dashboard capaian penerimaan retribusi daerah menampilkan penurunan drastis sebesar 92% dibandingkan rata-rata harian, membuat pimpinan daerah panik dan hampir menggelar rapat darurat. Setelah ditelusuri 3 jam kemudian, ternyata penerimaan retribusi normal, namun job ingest dari 8 dari 10 kabupaten gagal berjalan sejak Minggu malam tanpa peringatan apa pun karena API sumber mengirim HTTP 200 dengan array kosong `[]`.\n\nMekanisme **Data Observability** manakah yang paling tepat dibangun agar insiden *silent data failure* tersebut terdeteksi otomatis sebelum dilihat pimpinan?',
    jawabanBenar:
      'Menerapkan pemantauan **Data Observability** otomatis mencakup pilar **Freshness** (keterlambatan pembaruan), **Volume** (anomali jumlah baris masuk turun drastis dibanding baseline historis), **Schema** (deteksi perubahan kolom), **Distribution** (anomali nilai nol/null/outlier), dan **Lineage**, dilengkapi *circuit breaker* pipeline yang menghentikan pembaruan tabel Gold / memasang banner peringatan otomatis serta mengirim alert ke tim data saat ambang anomali terlampaui.',
    pengecoh4: [
      'Hanya memantau apakah skrip ETL keluar dengan `exit code 0` di sistem operasi tanpa memeriksa jumlah baris, distribusi nilai, maupun kesegaran data yang masuk.',
      'Menugaskan 5 staf setiap pagi pukul 05.00 WIB untuk membuka seluruh 50 grafik dashboard secara manual dan membandingkannya dengan catatan buku tulis minggu lalu.',
      'Menyembunyikan angka aktual hari Senin dan secara otomatis menampilkan angka salinan minggu lalu pada dashboard pimpinan setiap kali terjadi penurunan di atas 50%.',
      'Mengubah seluruh query dashboard agar selalu menjumlahkan angka akumulasi 5 tahun terakhir sehingga kegagalan data selama 1 hari tidak terlihat di grafik.',
    ],
    akarMasalah:
      'Pemantauan kesehatan infrastruktur/exit code semata gagal menangkap *silent data failure* ketika API mengembalikan HTTP 200 dengan payload kosong `[]` sehingga pipeline sukses secara teknis tetapi menyajikan data cacat ke pimpinan.',
    solusiTerbaik:
      'Data Observability (Freshness, Volume, Schema, Distribution, Lineage) + *data quality gate / circuit breaker* mendeteksi penurunan volume 92% seketika saat ingest, mencegah data parsial mencemari lapisan Gold.',
    analisisPengecoh:
      '`exit code 0` tidak menangkap array kosong `[]`; pengecekan manual 50 grafik rawan luput dan tidak skalabel; memalsukan angka minggu lalu menyesatkan pimpinan jika penurunan nyata benar terjadi; menyembunyikan anomali lewat agregasi 5 tahun menghilangkan fungsi pemantauan harian.',
  },
  {
    level: 'C5',
    topik: 'Manajemen Data - Data Contract antara Produsen Aplikasi & Tim Analitik',
    pertanyaan:
      'Tim pengembang aplikasi layanan publik sering mengubah semantik nilai kolom secara diam-diam — misalnya mengganti satuan kolom `durasi_layanan` dari **detik** menjadi **menit**, atau mengubah kode status `"PENDING"` menjadi `"MENUNGGU"` — tanpa memberi tahu tim Data Warehouse. Akibatnya laporan SLA kinerja instansi nasional selama dua bulan keliru 60 kali lipat tanpa memicu error tipe data apa pun.\n\nInstrumen tata kelola rekayasa data manakah yang paling efektif mencegah kegagalan semantik lintas tim tersebut?',
    jawabanBenar:
      'Menetapkan **Data Contract** eksplisit berbasis skema versi terstruktur (JSON Schema/Avro/Protobuf/ODCS) yang mendefinisikan struktur, tipe, satuan/semantik nilai, aturan kualitas, dan SLA antara Produsen dan Konsumen Data, lalu menegakkannya secara otomatis di pipeline **CI/CD produsen** (menolak merge/rilis yang melanggar kontrak tanpa versioning mayor atau koordinasi migrasi).',
    pengecoh4: [
      'Melarang tim pengembang aplikasi memperbarui kode fitur layanan publik selama masa anggaran berjalan agar tidak ada kemungkinan perubahan skema maupun semantik.',
      'Meminta tim Data Warehouse menebak secara berkala setiap akhir bulan apakah angka rata-rata `durasi_layanan` terlihat lebih kecil lalu mengalikannya 60 secara manual.',
      'Menyimpan seluruh kolom dalam tabel transaksi sebagai tipe data `VARCHAR(255)` tanpa validasi enum agar setiap perubahan teks bebas masuk tanpa penolakan.',
      'Mengirimkan pesan chat informal setahun sekali yang mengimbau pengembang untuk mengingat memberi tahu tim data bila sempat.',
    ],
    akarMasalah:
      'Perubahan semantik (*breaking semantic change* seperti detik -> menit) lolos dari pemeriksaan tipe data sederhana (`INTEGER` tetap `INTEGER`) ketika tidak ada kontrak formal yang ditegakkan secara otomatis di CI/CD.',
    solusiTerbaik:
      'Data Contract terversi (mencakup skema, enum/satuan semantik, ownership, SLA) yang divalidasi otomatis di CI/CD produsen memindahkan tanggung jawab kualitas data ke kiri (*shift-left governance*) sebelum merusak analitik hilir.',
    analisisPengecoh:
      'Membekukan fitur melumpuhkan inovasi layanan; menebak dan mengalikan 60 manual rawan kesalahan fatal; mengubah semua ke `VARCHAR` justru menghilangkan validasi skema; imbauan chat tahunan tidak memiliki mekanisme penegakan teknis.',
  },
  {
    level: 'C4',
    topik: 'Manajemen Data - Pemodelan Data Transaksional vs Analitik (CDC & Outbox)',
    pertanyaan:
      'Untuk mengisi Data Warehouse setiap 5 menit, tim data menjalankan kueri `SELECT * FROM transaksi WHERE updated_at >= NOW() - INTERVAL \'5 minutes\'` langsung ke database produksi OLTP. Namun ditemukan dua masalah: (1) baris yang dihapus fisik (`DELETE`) di OLTP tidak pernah terhapus di Data Warehouse sehingga total saldo meleset, dan (2) transaksi panjang yang *commit* terlambat terlewat oleh filter `updated_at`.\n\nMekanisme ekstraksi data manakah yang paling tepat menyelesaikan kedua masalah tersebut sekaligus menekan beban pada database produksi?',
    jawabanBenar:
      'Menerapkan **Log-Based Change Data Capture (CDC)** (seperti Debezium membaca PostgreSQL Write-Ahead Log / MySQL Binlog) yang menangkap seluruh event `INSERT`, `UPDATE`, dan `DELETE` secara berurutan tepat saat transaksi ter-commit tanpa menjalankan polling kueri berat ke tabel produksi, lalu meneruskannya lewat message broker (Kafka) ke Data Warehouse.',
    pengecoh4: [
      'Mengubah jadwal kueri polling menjadi `SELECT * FROM transaksi` (full table scan tanpa `WHERE`) setiap 5 menit sekali langsung pada server OLTP produksi.',
      'Menonaktifkan fitur `DELETE` dan `UPDATE` pada seluruh aplikasi transaksional pemerintah tanpa mengganti mekanisme sinkronisasi polling `updated_at`.',
      'Memperpendek interval polling menjadi setiap 1 detik dengan tetap menggunakan kueri `WHERE updated_at >= ...` agar baris yang terhapus sempat terbaca sebelum hilang.',
      'Meminta operator mengekspor log perubahan transaksi secara manual dari aplikasi ke berkas CSV setiap 5 menit lalu mengunggahnya ke Data Warehouse.',
    ],
    akarMasalah:
      'Query-based incremental polling pada `updated_at` secara fundamental tidak dapat mendeteksi *hard DELETE*, rentan melewatkan transaksi berdurasi lama (commit timestamp > `updated_at`), dan membebani CPU/I/O produksi.',
    solusiTerbaik:
      'Log-based CDC membaca log transaksi native (WAL/Binlog) secara asinkron dengan overhead minimal di OLTP, menjamin penangkapan 100% operasi `INSERT`/`UPDATE`/`DELETE` sesuai urutan commit transaksi.',
    analisisPengecoh:
      'Full table scan tiap 5 menit melumpuhkan database produksi; transaksi panjang tetap luput pada polling `updated_at`; polling 1 detik justru memperparah beban CPU produksi dan tetap tidak menangkap hard delete; ekspor manual 5 menitan mustahil dijalankan secara operasional.',
  },
  {
    level: 'C5',
    topik: 'Tata Kelola TI - Evaluasi Strategi Cloud Publik vs Privat & Data Sovereignty',
    pertanyaan:
      'Sebuah instansi pusat sedang mengevaluasi penempatan dua beban kerja baru: (1) Portal informasi publik, kalkulator simulasi pajak anonim, dan arsip peraturan terbuka yang mengalami lonjakan trafik musiman 20x lipat; serta (2) Sistem inti data intelijen pengawasan dan data kependudukan sensitif yang mensyaratkan residensi penuh di wilayah hukum Indonesia dengan kendali kunci kriptografi penuh oleh negara.\n\nStrategi arsitektur cloud dan kedaulatan data manakah yang paling tepat sesuai **SPBE** dan **PP 71/2019**?',
    jawabanBenar:
      'Menerapkan **Strategi Hybrid / Multi-Tier berbasis klasifikasi data**: menempatkan sistem inti & data strategis sensitif di **Pusat Data Nasional (PDN) / Government Private Cloud** di wilayah Indonesia dengan kendali penuh kunci enkripsi (*Customer-Managed Keys / HSM instansi*), sementara beban kerja publik non-sensitif bertrafik elastis dapat memanfaatkan layanan cloud komputasi publik/CDN di region Indonesia yang memenuhi standar keamanan & kepatuhan SPBE.',
    pengecoh4: [
      'Menempatkan seluruh data intelijen pengawasan dan data kependudukan sensitif pada layanan hosting publik luar negeri termurah tanpa enkripsi demi memanfaatkan elastisitas auto-scaling.',
      'Membangun pusat data fisik baru sendiri untuk portal peraturan terbuka statis dengan membeli 50 server fisik permanen yang 95% waktunya menganggur di luar musim puncak.',
      'Melarang seluruh pemanfaatan teknologi komputasi awan dan CDN pada semua beban kerja termasuk berkas PDF peraturan terbuka karena dianggap bertentangan dengan SPBE.',
      'Menyerahkan pengelolaan seluruh kunci enkripsi utama (*root encryption keys*) basis data negara sepenuhnya kepada staf penyedia cloud tanpa kontrol akses instansi.',
    ],
    akarMasalah:
      'Pendekatan pukul rata (*one-size-fits-all*) — menaruh data strategis di cloud publik luar negeri atau membangun server fisik raksasa untuk konten statis musiman — melanggar kedaulatan data sekaligus memboroskan anggaran.',
    solusiTerbaik:
      'Penempatan berbasis klasifikasi data (data strategis/sensitif di PDN/Government Cloud wilayah RI + kendali kunci HSM/BYOK; konten publik elastis di region RI/CDN) memadukan kedaulatan data, kepatuhan PP 71/2019 & SPBE, dan efisiensi biaya.',
    analisisPengecoh:
      'Menaruh data strategis di luar negeri tanpa enkripsi melanggar PP 71/2019 & UU PDP; membeli 50 server fisik yang 95% menganggur memboroskan APBN; SPBE justru mendorong komputasi awan pemerintah/PDN & efisiensi; menyerahkan kendali root key penuh menghilangkan kedaulatan kriptografi.',
  },
  {
    level: 'C6',
    topik: 'Tata Kelola TI - Evaluasi Arsitektur AI Pemerintahan yang Bertanggung Jawab (Ethical AI)',
    pertanyaan:
      'Dinas Sosial melatih model *Machine Learning* untuk merekomendasikan prioritas penerima bantuan sosial menggunakan data historis 5 tahun terakhir. Saat diuji, akurasi keseluruhan terlihat 91%, tetapi tim audit menemukan model secara sistematis menolak warga miskin di kecamatan terpencil karena selama 5 tahun terakhir warga di wilayah tersebut jarang tercatat pada layanan pendaftaran daring (bias keterwakilan data historis), dan model bersifat *black-box* sehingga petugas tidak bisa menjelaskan alasan penolakan.\n\nPerbaikan tata kelola data dan desain sistem AI manakah yang paling tepat sebelum model digunakan di layanan publik?',
    jawabanBenar:
      'Melakukan **audit bias & fairness** per sub-kelompok wilayah/demografi, memperbaiki ketimpangan data latih melalui pendataan lapangan proaktif (*active outreach* & *re-sampling/re-weighting*), mengadopsi model yang dapat dijelaskan (**Explainable AI / SHAP / rule-based transparan**) agar alasan rekomendasi terbaca, serta menetapkan AI hanya sebagai alat bantu pendukung keputusan dengan **pengawasan manusia (*human-in-the-loop*)** dan mekanisme banding warga sesuai Pasal 10 UU PDP.',
    pengecoh4: [
      'Langsung menerapkan model ke produksi karena akurasi agregat 91% sudah sangat tinggi dan mengabaikan kelompok minoritas kecamatan terpencil sebagai *statistical noise*.',
      'Menghapus kolom `nama_kecamatan` dari fitur input lalu langsung meluncurkan model tanpa menguji ulang apakah fitur lain (seperti kode pos atau kepemilikan ponsel) masih menjadi *proxy bias* wilayah.',
      'Menjadikan keputusan model *black-box* bersifat final dan mengikat tanpa jalur keberatan maupun peninjauan petugas sosial agar proses penyaluran bantuan sepenuhnya otomatis.',
      'Menyembunyikan fakta penggunaan model AI kepada masyarakat dan auditor agar tidak ada warga yang mengajukan hak keberatan terhadap keputusan otomatis.',
    ],
    akarMasalah:
      'Bias historis pada dataset pelatihan (*selection/sampling bias*) diperkuat oleh algoritma, sementara ketiadaan *explainability* dan *human oversight* melanggar keadilan layanan publik serta Pasal 10 UU PDP.',
    solusiTerbaik:
      'Evaluasi *fairness* per sub-populasi + perbaikan cakupan data lapangan + *Explainable AI* + *human-in-the-loop* + hak keberatan/banding memastikan penggunaan AI pemerintahan adil, akuntabel, dan patuh UU PDP.',
    analisisPengecoh:
      'Akurasi agregat 91% menyembunyikan kegagalan fatal pada kelompok rentan; menghapus satu kolom tidak menghilangkan *proxy variable bias* (kode pos/akses internet); otomatisasi penuh tanpa peninjauan manusia melanggar hak keberatan UU PDP; menyembunyikan penggunaan AI melanggar asas transparansi publik.',
  },
];
