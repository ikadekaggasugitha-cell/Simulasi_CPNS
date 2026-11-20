import type { SkbHotsItem } from './skb_hots_builder';

export const SKB_BASIS_DATA_A: SkbHotsItem[] = [
  {
    level: 'C4',
    topik: 'Basis Data — Execution Plan & Leftmost Prefix Index',
    pertanyaan:
      'Tim DBA instansi mendapati query pencarian berkas perizinan melambat hingga 9,4 detik pada tabel `permohonan_izin` (18 juta baris) yang memiliki composite index `idx_izin_composite (kode_daerah, status_berkas, tanggal_ajukan)`. Hasil `EXPLAIN ANALYZE` menunjukkan:\n```sql\nSELECT id, nomor_izin, pemohon_id\nFROM permohonan_izin\nWHERE status_berkas = \'MENUNGGU_VERIFIKASI\'\nORDER BY tanggal_ajukan DESC\nLIMIT 50;\n-- Plan: Seq Scan on permohonan_izin (actual time=8940..9412 ms rows=50)\n-- Filter: (status_berkas = \'MENUNGGU_VERIFIKASI\')\n```\nMengapa `idx_izin_composite` diabaikan planner dan rancangan indeks paling tepat untuk mempercepat query tersebut tanpa membebani ruang berlebihan adalah...',
    jawabanBenar:
      'Indeks tidak terpakai karena predikat melompati kolom paling kiri (`kode_daerah`); solusinya membuat partial composite index `(status_berkas, tanggal_ajukan DESC) WHERE status_berkas = \'MENUNGGU_VERIFIKASI\'` atau composite index `(status_berkas, tanggal_ajukan DESC)`.',
    pengecoh4: [
      'Indeks tidak terpakai karena klausa `LIMIT 50` selalu memaksa Sequential Scan; solusinya menghapus `LIMIT` lalu memotong 50 baris pertama di lapisan aplikasi.',
      'Indeks tidak terpakai karena kolom `tanggal_ajukan` diurutkan `DESC`; solusinya mengubah urutan menjadi `ASC` lalu membalik urutan array di backend.',
      'Indeks tidak terpakai karena tipe `VARCHAR` tidak didukung B-Tree pada tabel di atas 10 juta baris; solusinya mengganti indeks menjadi Hash Index pada `tanggal_ajukan`.',
      'Indeks tidak terpakai karena jumlah kolom di `SELECT` kurang dari indeks; solusinya menambahkan `kode_daerah` ke klausa `SELECT` tanpa mengubah klausa `WHERE`.',
    ],
    akarMasalah:
      'Composite B-Tree index menyusun kunci secara leksikografis mulai dari kolom paling kiri (`kode_daerah`). Ketika `WHERE` langsung menyaring `status_berkas` tanpa `kode_daerah`, planner tidak dapat melakukan range seek pada B-Tree (pelanggaran aturan Leftmost Prefix).',
    solusiTerbaik:
      'Membuat indeks dengan awalan `(status_berkas, tanggal_ajukan DESC)`—terlebih lagi berbentuk partial index khusus status aktif—memungkinkan `Index Scan` langsung mengambil 50 baris teratas dalam hitungan milidetik sekaligus menghemat ukuran indeks.',
    analisisPengecoh:
      'Klausa `LIMIT` justru mendorong pemakaian indeks bila urutan cocok; B-Tree mendukung pemindaian mundur (`Backward Index Scan`) untuk `DESC`; Hash Index tidak mendukung `ORDER BY`; menambah kolom di `SELECT` saja tidak memenuhi syarat predikat `WHERE` pada leftmost prefix.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — SARGable Query & Function on Column',
    pertanyaan:
      'Sistem pelaporan kepegawaian daerah menjalankan query berikut pada tabel `riwayat_kinerja` (12 juta baris) yang sudah memiliki B-Tree index pada kolom `tgl_penilaian` bertipe `DATE`:\n```sql\nSELECT pegawai_id, skor_akhir\nFROM riwayat_kinerja\nWHERE EXTRACT(YEAR FROM tgl_penilaian) = 2025\n  AND unit_kode = \'DINAS-KES\';\n```\nSaat beban puncak awal bulan, CPU database melonjak 95% karena indeks `tgl_penilaian` tidak pernah digunakan untuk range scan. Perbaikan query yang paling tepat agar bersifat SARGable tanpa mengubah struktur tabel adalah...',
    jawabanBenar:
      'Mengubah predikat tanggal menjadi perbandingan rentang langsung `tgl_penilaian >= \'2025-01-01\' AND tgl_penilaian < \'2026-01-01\'` sehingga optimizer dapat mengeksekusi Index Range Scan secara langsung.',
    pengecoh4: [
      'Mengubah predikat menjadi `TO_CHAR(tgl_penilaian, \'YYYY\') = \'2025\'` agar pencocokan karakter tahun berlangsung lebih cepat daripada fungsi ekstraksi numerik.',
      'Menambahkan klausa `GROUP BY tgl_penilaian` di akhir query agar planner memaksa penggunaan indeks B-Tree pada kolom tanggal.',
      'Mengganti tipe data kolom `tgl_penilaian` menjadi `VARCHAR(10)` lalu memakai `WHERE tgl_penilaian LIKE \'%2025%\'` agar lebih fleksibel.',
      'Memindahkan filter `EXTRACT(YEAR FROM tgl_penilaian) = 2025` ke dalam klausa `HAVING` setelah mengambil seluruh baris berdasarkan `unit_kode`.',
    ],
    akarMasalah:
      'Membungkus kolom terindeks dengan fungsi (`EXTRACT(YEAR FROM tgl_penilaian)`) membuat predikat non-SARGable karena nilai terindeks tidak lagi cocok langsung dengan konstanta pencarian, memaksa mesin database mengevaluasi fungsi untuk jutaan baris.',
    solusiTerbaik:
      'Predikat half-open range (`>= \'2025-01-01\' AND < \'2026-01-01\'`) menjaga kolom `tgl_penilaian` tetap murni di sisi kiri operator perbandingan, membuka akses langsung ke B-Tree Range Scan serta akurat untuk tipe `DATE` maupun `TIMESTAMP`.',
    analisisPengecoh:
      '`TO_CHAR(...)` tetap membungkus kolom dengan fungsi (non-SARGable); `GROUP BY` justru menambah biaya agregasi/sort; `LIKE \'%2025%\'` dengan leading wildcard melumpuhkan B-Tree dan merusak integritas tipe tanggal; `HAVING` berjalan setelah pengelompokan sehingga tetap memindai seluruh baris.',
  },
  {
    level: 'C5',
    topik: 'Basis Data — Normalisasi vs Denormalisasi Terkendali',
    pertanyaan:
      'Aplikasi portal pembayaran retribusi pasar memiliki tabel `transaksi_retribusi` dengan 40 juta baris yang sangat padat operasi baca untuk struk historis dan laporan audit bulanan. Skema saat ini sepenuhnya 3NF, sehingga cetak struk membutuhkan 5 `JOIN` ke tabel master tarif yang nilainya dapat berubah setiap tahun anggaran. Analis senior mengusulkan menyimpan salinan `tarif_berlaku_saat_bayar` dan `nama_pasar_snapshot` langsung di tabel transaksi. Evaluasi teknis paling tepat terhadap usulan tersebut adalah...',
    jawabanBenar:
      'Usulan tersebut tepat sebagai denormalisasi terkendali sekaligus kebutuhan integritas historis transaksi (immutability), karena perubahan tarif tahun depan tidak boleh mengubah nominal struk transaksi masa lalu.',
    pengecoh4: [
      'Usulan tersebut wajib ditolak total karena setiap bentuk duplikasi atribut di tabel transaksi otomatis melanggar standar ACID dan merusak konsistensi database.',
      'Usulan tersebut sebaiknya diganti dengan menghapus seluruh tabel master tarif agar semua pembaruan tarif cukup dilakukan lewat `UPDATE` massal pada 40 juta baris transaksi.',
      'Usulan tersebut hanya valid bila seluruh foreign key pada tabel `transaksi_retribusi` dihapus agar kecepatan `INSERT` meningkat signifikan.',
      'Usulan tersebut lebih buruk dibandingkan memindahkan seluruh 40 juta baris transaksi ke tabel temporer setiap akhir bulan sebelum laporan audit dicetak.',
    ],
    akarMasalah:
      'Menyandarkan struk transaksi historis semata-mata pada `JOIN` ke tabel master yang nilainya dapat berubah (mutable) tidak hanya menambah biaya `JOIN` pada beban baca tinggi, tetapi juga berisiko mengubah sejarah nominal pembayaran ketika tarif diperbarui.',
    solusiTerbaik:
      'Menyimpan snapshot nilai historis (`tarif_berlaku_saat_bayar`) pada tabel transaksi adalah praktik baku sistem keuangan: melindungi akurasi audit historis sekaligus memangkas jumlah `JOIN` pada jalur baca kritis.',
    analisisPengecoh:
      'Denormalisasi terukur tidak melanggar ACID; menghapus tabel master memicu anomali update masif; menghapus foreign key merusak integritas referensial yang tidak diperlukan; memindahkan ke tabel temporer menambah beban I/O besar tanpa menjaga snapshot tarif.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Concurrency & Lost Update Anomaly',
    pertanyaan:
      'Dua petugas loket bansos secara bersamaan membuka data kuota desa X (sisa kuota = 10) pada aplikasi web yang memakai isolation level default `READ COMMITTED`. Urutan eksekusi yang terjadi di database adalah:\n```text\nT1: SELECT kuota FROM desa WHERE id = 7;          -- membaca 10\nT2: SELECT kuota FROM desa WHERE id = 7;          -- membaca 10\nT1: UPDATE desa SET kuota = 9 WHERE id = 7;       -- commit (10 - 1)\nT2: UPDATE desa SET kuota = 9 WHERE id = 7;       -- commit (10 - 1)\n```\nKuota akhir tercatat 9 padahal 2 warga telah disetujui. Fenomena konkurensi yang terjadi dan mitigasi paling tepat pada level transaksi adalah...',
    jawabanBenar:
      'Terjadi anomali Lost Update; mitigasinya menggunakan pembaruan atomik (`SET kuota = kuota - 1 WHERE id = 7 AND kuota > 0`), pessimist locking (`SELECT ... FOR UPDATE`), atau optimistic locking berbasis kolom `version`.',
    pengecoh4: [
      'Terjadi anomali Dirty Read; mitigasinya cukup menurunkan isolation level ke `READ UNCOMMITTED` agar kedua transaksi melihat perubahan lebih cepat.',
      'Terjadi anomali Phantom Read; mitigasinya menambahkan indeks unik pada kolom `kuota` sehingga dua petugas tidak dapat membaca baris yang sama.',
      'Terjadi anomali Deadlock; mitigasinya memperpanjang `lock_timeout` database menjadi 120 detik agar transaksi kedua menunggu otomatis.',
      'Terjadi anomali Write Skew pada dua tabel berbeda; mitigasinya menambahkan cache Redis di depan operasi `SELECT` agar pembacaan kuota tidak membebani database.',
    ],
    akarMasalah:
      'Pola read-modify-write di aplikasi tanpa penguncian baris atau pengecekan versi membuat transaksi kedua menimpa hasil commit transaksi pertama berdasarkan nilai lama (10) yang sudah usang—inilah definisi Lost Update.',
    solusiTerbaik:
      'Operasi atomik `SET kuota = kuota - 1 WHERE id = 7 AND kuota > 0` (atau `SELECT ... FOR UPDATE` / optimistic concurrency `WHERE version = v`) memastikan setiap pengurangan kuota dievaluasi terhadap state mutakhir secara serial pada baris tersebut.',
    analisisPengecoh:
      'Tidak ada pembacaan data uncommitted (bukan Dirty Read) dan `READ UNCOMMITTED` justru memperburuk konsistensi; tidak ada penyisipan baris baru (bukan Phantom Read) dan unique index pada kuota salah secara bisnis; tidak ada siklus saling tunggu kunci (bukan Deadlock); caching Redis justru memperparah stale read.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Deadlock Diagnosis & Lock Ordering',
    pertanyaan:
      'Log PostgreSQL sistem transfer saldo antar-rekening kas daerah berulang kali mencatat error pada jam sibuk:\n```log\nERROR: deadlock detected\nDETAIL: Process 4120 waits for ShareLock on transaction 88912; blocked by process 4125.\nProcess 4125 waits for ShareLock on transaction 88911; blocked by process 4120.\nCONTEXT: while updating tuple (14,22) in relation "rekening_kas"\n```\nDiketahui transaksi A mentransfer dari rekening 101 ke 205, sedangkan transaksi B secara bersamaan mentransfer dari rekening 205 ke 101. Rancangan pencegahan deadlock paling efektif pada kode transaksi adalah...',
    jawabanBenar:
      'Menerapkan pengurutan penguncian deterministik (Lock Ordering): selalu mengunci kedua baris rekening memakai `SELECT ... FOR UPDATE` berdasarkan urutan `id` terkecil ke terbesar (`101` lalu `205`) sebelum melakukan `UPDATE`.',
    pengecoh4: [
      'Menghapus blok transaksi `BEGIN ... COMMIT` agar setiap perintah `UPDATE` berjalan sebagai autocommit terpisah sehingga tidak pernah saling mengunci.',
      'Menonaktifkan `deadlock_detector` di konfigurasi PostgreSQL supaya proses tidak otomatis dihentikan oleh mesin database.',
      'Menaikkan `max_connections` dari 100 menjadi 1.000 agar setiap permintaan transfer memperoleh koneksi khusus tanpa berbagi kunci.',
      'Mengubah isolation level seluruh transaksi transfer menjadi `READ UNCOMMITTED` agar baris rekening tidak memerlukan row-level lock saat `UPDATE`.',
    ],
    akarMasalah:
      'Deadlock (circular wait) muncul karena transaksi A mengunci baris 101 lalu meminta kunci baris 205, sementara transaksi B mengunci baris 205 lalu meminta kunci baris 101 secara berlawanan arah.',
    solusiTerbaik:
      'Memaksakan urutan akuisisi kunci yang konsisten (mis. selalu urut `ORDER BY id ASC` dengan `FOR UPDATE`) memutus syarat circular wait secara matematis sehingga deadlock antar-transfer tidak dapat terjadi.',
    analisisPengecoh:
      'Menghapus transaksi menghancurkan atomisitas (saldo bisa terpotong tanpa masuk tujuan); mematikan detektor deadlock justru membuat transaksi menggantung selamanya; menambah koneksi tidak mengubah siklus tunggu kunci; operasi `UPDATE` tetap mengambil eksklusif row lock meski isolation level diturunkan.',
  },
  {
    level: 'C6',
    topik: 'Basis Data — Covering Index & Index-Only Scan',
    pertanyaan:
      'Dashboard monitoring antrean layanan publik mengeksekusi query agregasi berikut setiap 5 detik pada tabel `tiket_antrean` (25 juta baris, 32 kolom lebar termasuk kolom `catatan_panjang TEXT`):\n```sql\nSELECT loket_id, COUNT(*), AVG(durasi_layanan_detik)\nFROM tiket_antrean\nWHERE tanggal_layanan = CURRENT_DATE AND status = \'SELESAI\'\nGROUP BY loket_id;\n```\nMeski sudah ada indeks `(tanggal_layanan, status)`, query masih memicu ribuan random disk I/O (Heap Fetches) karena harus mengambil `loket_id` dan `durasi_layanan_detik` dari tabel utama. Rancangan indeks optimal untuk mengubahnya menjadi Index-Only Scan adalah...',
    jawabanBenar:
      'Membuat covering index `CREATE INDEX idx_tiket_cover ON tiket_antrean (tanggal_layanan, status, loket_id) INCLUDE (durasi_layanan_detik);` agar seluruh kolom query tersedia langsung di daun indeks.',
    pengecoh4: [
      'Membuat indeks terpisah satu per satu pada setiap kolom (`tanggal_layanan`, `status`, `loket_id`, `durasi_layanan_detik`, `catatan_panjang`) agar optimizer menggabungkan semuanya.',
      'Membuat indeks B-Tree pada kolom `catatan_panjang` lalu menjalankan `SELECT *` supaya seluruh baris termuat ke buffer cache.',
      'Menambahkan `ORDER BY durasi_layanan_detik DESC` pada query agar mesin database otomatis melewati pembacaan tabel heap.',
      'Mengubah tipe kolom `durasi_layanan_detik` menjadi `TEXT` lalu menggabungkannya dalam satu kolom bersama `loket_id`.',
    ],
    akarMasalah:
      'Indeks `(tanggal_layanan, status)` hanya menyaring baris, tetapi mesin database tetap harus melakukan random lookup ke heap table untuk membaca `loket_id` dan `durasi_layanan_detik`, yang mahal pada tabel lebar.',
    solusiTerbaik:
      'Covering index dengan kunci `(tanggal_layanan, status, loket_id)` dan payload non-kunci `INCLUDE (durasi_layanan_detik)` memungkinkan `Index-Only Scan` (tanpa menyentuh heap bila visibility map bersih) serta mempercepat `GROUP BY loket_id`.',
    analisisPengecoh:
      'Indeks terpisah hanya memicu Bitmap Index Scan yang tetap harus mengunjungi heap dan menambah overhead write; mengindeks `catatan_panjang` dan memakai `SELECT *` memperburuk I/O; `ORDER BY` justru menambah beban sorting; menggabung kolom ke `TEXT` melanggar 1NF dan menghambat fungsi `AVG`.',
  },
  {
    level: 'C5',
    topik: 'Basis Data — Table Partitioning & Retention Policy',
    pertanyaan:
      'Tabel `audit_log_akses` instansi menampung 450 juta baris (tumbuh 15 juta baris/bulan). Sesuai kebijakan retensi, log berusia lebih dari 24 bulan harus dihapus rutin setiap awal bulan. Saat DBA menjalankan `DELETE FROM audit_log_akses WHERE created_at < NOW() - INTERVAL \'24 months\';`, sistem layanan utama melambat drastis selama 3 jam akibat lonjakan WAL, lock contention, dan bloat tabel. Evaluasi arsitektur penyimpanan terbaik untuk masalah ini adalah...',
    jawabanBenar:
      'Menerapkan Declarative Range Partitioning bulanan berdasarkan `created_at` sehingga penghapusan log kedaluwarsa cukup memakai `DROP TABLE` / `DETACH PARTITION` secara instan tanpa bloat maupun beban `VACUUM` berat.',
    pengecoh4: [
      'Menjalankan perintah `TRUNCATE TABLE audit_log_akses` setiap awal bulan agar ruang disk langsung kembali kosong tanpa menulis WAL.',
      'Menghapus seluruh indeks pada tabel `audit_log_akses` sebelum menjalankan `DELETE` massal, lalu membangun ulang indeks setiap minggu.',
      'Mengganti query `DELETE` menjadi `UPDATE audit_log_akses SET is_deleted = true` agar baris lama tidak perlu dihapus secara fisik selamanya.',
      'Memindahkan seluruh tabel ke penyimpanan RAM (`UNLOGGED TABLE`) agar proses penghapusan 15 juta baris selesai dalam beberapa detik.',
    ],
    akarMasalah:
      'Operasi `DELETE` pada puluhan juta baris di tabel monolitik menandai dead tuples satu per satu, menghasilkan WAL masif, membebani I/O, serta menyisakan table/index bloat yang harus dibersihkan `VACUUM`.',
    solusiTerbaik:
      'Range Partitioning per bulan berdasarkan `created_at` membuat pembersihan data retensi menjadi operasi DDL metadata (`DROP/DETACH PARTITION`) dalam hitungan milidetik sekaligus mempercepat query berbasis rentang waktu (partition pruning).',
    analisisPengecoh:
      '`TRUNCATE` menghapus seluruh data termasuk log 24 bulan aktif yang wajib dipertahankan; drop-rebuild indeks tiap bulan memicu downtime/beban CPU tinggi; soft delete (`is_deleted`) membuat tabel terus membengkak tanpa membebaskan disk; `UNLOGGED TABLE` hilang saat crash sehingga melanggar keutuhan audit trail.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Normalisasi BCNF & Anomali Relasional',
    pertanyaan:
      'Perhatikan skema tabel penjadwalan pengawas ujian CAT berikut beserta ketergantungan fungsionalnya:\n```text\nTabel: jadwal_pengawas (nip_pengawas, sesi_ujian, ruang_ujian, gedung)\nKetergantungan Fungsional:\n1. (nip_pengawas, sesi_ujian) -> ruang_ujian\n2. ruang_ujian -> gedung\n3. (ruang_ujian, sesi_ujian) -> nip_pengawas\n```\nJika diketahui setiap ruang selalu berada di satu gedung tetap dan satu ruang pada satu sesi hanya diawasi satu pengawas, pelanggaran bentuk normal dan dampak anomali yang muncul adalah...',
    jawabanBenar:
      'Melanggar 3NF dan BCNF karena ketergantungan transitif `ruang_ujian -> gedung` (determinan `ruang_ujian` bukan superkey); akibatnya pemindahan lokasi gedung sebuah ruang memicu anomali update pada banyak baris jadwal.',
    pengecoh4: [
      'Hanya melanggar 1NF karena primary key gabungan terdiri atas dua kolom (`nip_pengawas` dan `sesi_ujian`) yang seharusnya digabung menjadi satu string.',
      'Sudah memenuhi BCNF penuh karena `nip_pengawas` dan `sesi_ujian` bersama-sama menentukan seluruh kolom lain pada tabel tersebut.',
      'Melanggar 2NF karena kolom `ruang_ujian` hanya bergantung parsial pada kolom `sesi_ujian` tanpa melibatkan `nip_pengawas`.',
      'Melanggar 4NF karena terjadi ketergantungan bernilai ganda (multivalued dependency) antara `gedung` dan `sesi_ujian`.',
    ],
    akarMasalah:
      'Candidate key tabel adalah `(nip_pengawas, sesi_ujian)` dan `(ruang_ujian, sesi_ujian)`. Aturan `ruang_ujian -> gedung` memiliki sisi kiri yang bukan superkey dan sisi kanan non-prime attribute, sehingga melanggar 3NF sekaligus BCNF.',
    solusiTerbaik:
      'Dekomposisi menjadi `ruang(ruang_ujian PK, gedung)` dan `jadwal_pengawas(nip_pengawas, sesi_ujian, ruang_ujian)` menghilangkan ketergantungan transitif sehingga informasi gedung tiap ruang disimpan tunggal tanpa anomali update/insert/delete.',
    analisisPengecoh:
      'Composite primary key tidak melanggar 1NF; keberadaan determinan non-superkey (`ruang_ujian`) jelas menggugurkan BCNF; `ruang_ujian` bergantung penuh pada `(nip_pengawas, sesi_ujian)` bukan parsial pada `sesi_ujian`; tidak ada multivalued dependency independen di skema ini.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — N+1 Query Problem & Optimasi JOIN',
    pertanyaan:
      'API daftar pengajuan bantuan UMKM menampilkan 200 permohonan per halaman, namun waktu responsnya mencapai 4,8 detik. Cuplikan log SQL yang terekam dari ORM pada satu kali request HTTP adalah:\n```sql\nSELECT * FROM pengajuan LIMIT 200 OFFSET 0;\nSELECT * FROM dokumen_lampiran WHERE pengajuan_id = 1001;\nSELECT * FROM dokumen_lampiran WHERE pengajuan_id = 1002;\n-- ... berulang hingga 200 kali query terpisah\n```\nAkar permasalahan performa tersebut dan perbaikan yang paling tepat pada lapisan akses data adalah...',
    jawabanBenar:
      'Terjadi N+1 Query Problem akibat lazy loading relasi di dalam perulangan; perbaikannya menerapkan Eager Loading (`JOIN` atau batch query `WHERE pengajuan_id IN (...)`) disertai indeks pada foreign key `pengajuan_id`.',
    pengecoh4: [
      'Terjadi Buffer Pool Exhaustion akibat `LIMIT 200`; perbaikannya mengganti `LIMIT 200` menjadi `SELECT *` penuh lalu melakukan paginasi di memori browser klien.',
      'Terjadi Table Lock berkepanjangan pada tabel `pengajuan`; perbaikannya mengubah seluruh query `SELECT` menjadi `SELECT ... FOR SHARE`.',
      'Terjadi Index Fragmentation pada primary key `pengajuan`; perbaikannya menjalankan `REINDEX` setiap kali API daftar pengajuan dipanggil.',
      'Terjadi Connection Leak karena ORM membuka koneksi baru; perbaikannya menaikkan ukuran RAM server database tanpa mengubah pola query ORM.',
    ],
    akarMasalah:
      'Satu query induk diikuti 200 query anak terpisah menimbulkan 201 kali network round-trip, parsing SQL, dan perencanaan eksekusi hanya untuk satu halaman API (N+1 Query Problem).',
    solusiTerbaik:
      'Eager Loading—baik dengan `LEFT JOIN` maupun dua query batch (`IN (...)`)—memangkas 201 round-trip menjadi 1–2 query saja, sehingga latensi turun dari detik menjadi puluhan milidetik.',
    analisisPengecoh:
      'Memuat seluruh tabel ke browser justru membuat payload dan memori meledak; `FOR SHARE` menambah beban lock baca yang tidak perlu; `REINDEX` per request mengunci tabel dan melumpuhkan layanan; menambah RAM tidak menghilangkan 201 round-trip jaringan.',
  },
  {
    level: 'C5',
    topik: 'Basis Data — Deep Pagination (OFFSET vs Keyset/Cursor)',
    pertanyaan:
      'Portal transparansi anggaran daerah menyediakan tabel riwayat transaksi belanja (30 juta baris) dengan tombol navigasi halaman. Saat auditor membuka halaman ke-50.000, query berikut berjalan 14 detik:\n```sql\nSELECT id, tanggal, nominal, uraian\nFROM belanja_daerah\nORDER BY tanggal DESC, id DESC\nLIMIT 50 OFFSET 2499950;\n```\nMengapa `OFFSET` sangat lambat pada halaman dalam dan strategi paginasi terbaik yang menjaga stabilitas hasil saat ada transaksi baru masuk adalah...',
    jawabanBenar:
      'Database tetap harus memindai dan membuang 2.499.950 baris sebelum mengembalikan 50 baris; solusinya memakai Keyset/Cursor Pagination (`WHERE (tanggal, id) < (:last_tgl, :last_id) ORDER BY tanggal DESC, id DESC LIMIT 50`) dengan indeks `(tanggal DESC, id DESC)`.',
    pengecoh4: [
      'Database melambat karena `ORDER BY` memakai dua kolom; solusinya menghapus `id DESC` dari pengurutan dan mempertahankan `OFFSET 2499950` agar hanya menyortir satu kolom.',
      'Database melambat karena `LIMIT 50` terlalu kecil; solusinya menaikkan ukuran halaman menjadi `LIMIT 10000` supaya jumlah klik halaman berkurang.',
      'Database melambat karena tidak ada `DISTINCT`; solusinya menambahkan `SELECT DISTINCT` agar baris duplikat langsung dilewati sebelum `OFFSET`.',
      'Database melambat karena tipe `id` adalah integer; solusinya mengganti `id` menjadi UUID v4 acak dan tetap menggunakan `OFFSET`.',
    ],
    akarMasalah:
      'Klausa `OFFSET N` tidak melompat langsung ke baris ke-N; mesin database harus membaca, menghitung, lalu membuang `N` baris terlebih dahulu (kompleksitas $O(N)$) serta rentan pergeseran/duplikasi baris bila ada `INSERT` baru di atasnya.',
    solusiTerbaik:
      'Keyset (Seek/Cursor) Pagination menggunakan nilai baris terakhir halaman sebelumnya pada klausa `WHERE` tuple `(tanggal, id) < (...)`, sehingga B-Tree langsung melompat ke posisi target dalam kompleksitas $O(\log n)$ konstan di halaman berapa pun.',
    analisisPengecoh:
      'Menghapus tie-breaker `id` membuat urutan tidak deterministik dan tidak menghilangkan pemindaian 2,5 juta baris; `LIMIT 10000` membebani jaringan/memori klien; `DISTINCT` menambah biaya deduplikasi; UUID v4 acak memperburuk lokalitas B-Tree tanpa memperbaiki `OFFSET`.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — MVCC, Isolation Level & Write Skew',
    pertanyaan:
      'Sistem jadwal piket dokter jaga RSUD menerapkan aturan bisnis: minimal 1 dokter wajib berstatus `ON_CALL` pada setiap shift. Saat ini dr. Andi dan dr. Budi sama-sama `ON_CALL` pada Shift Malam. Keduanya mengajukan izin cuti pada milidetik yang sama di bawah isolation level `REPEATABLE READ` (Snapshot Isolation):\n```text\nT1 (Andi): SELECT COUNT(*) FROM jadwal WHERE shift=\'MALAM\' AND status=\'ON_CALL\'; -- hasil 2\nT2 (Budi): SELECT COUNT(*) FROM jadwal WHERE shift=\'MALAM\' AND status=\'ON_CALL\'; -- hasil 2\nT1: UPDATE jadwal SET status=\'OFF\' WHERE dokter=\'Andi\'; COMMIT;\nT2: UPDATE jadwal SET status=\'OFF\' WHERE dokter=\'Budi\'; COMMIT;\n```\nHasil akhirnya nol dokter berjaga tanpa error database. Anomali apa yang terjadi dan mekanisme kontrol paling tepat untuk menjamin aturan bisnis tersebut?',
    jawabanBenar:
      'Terjadi anomali Write Skew karena kedua transaksi membaca snapshot yang sama lalu memperbarui baris yang berbeda; solusinya menaikkan isolation level ke `SERIALIZABLE` (SSI) atau mengunci baris agregat/induk shift memakai `SELECT ... FOR UPDATE`.',
    pengecoh4: [
      'Terjadi anomali Dirty Write; solusinya cukup menurunkan isolation level ke `READ COMMITTED` agar setiap transaksi hanya membaca baris yang sudah di-commit.',
      'Terjadi anomali Non-Repeatable Read; solusinya menambahkan `CHECK (status IN (\'ON_CALL\', \'OFF\'))` pada tabel `jadwal` agar minimal satu dokter tersisa.',
      'Terjadi anomali Lost Update pada baris yang sama; solusinya menambahkan kolom `version` pada masing-masing baris dokter untuk optimistic locking.',
      'Terjadi anomali Cascade Delete; solusinya menambahkan foreign key `ON UPDATE RESTRICT` pada kolom `dokter`.',
    ],
    akarMasalah:
      'Pada Snapshot Isolation (`REPEATABLE READ`), dua transaksi yang memodifikasi baris berbeda (`Andi` vs `Budi`) tidak saling memblokir, meskipun gabungan keduanya melanggar invarian lintas-baris (minimal 1 dokter `ON_CALL`). Inilah Write Skew.',
    solusiTerbaik:
      'Isolation level `SERIALIZABLE` (Serializable Snapshot Isolation) mendeteksi ketergantungan baca-tulis silang dan membatalkan salah satu transaksi untuk di-retry, atau mengunci entitas induk `shift` (`FOR UPDATE`) guna menserialisasi perubahan pada shift yang sama.',
    analisisPengecoh:
      '`READ COMMITTED` tetap meloloskan Write Skew; `CHECK` constraint hanya mengevaluasi satu baris tunggal bukan agregat lintas baris; optimistic locking per baris dokter gagal karena masing-masing mengubah baris yang berbeda; `ON UPDATE RESTRICT` tidak mencegah perubahan kolom `status`.',
  },
  {
    level: 'C5',
    topik: 'Basis Data — Referential Integrity & Strategi Penghapusan Data',
    pertanyaan:
      'Pada sistem keuangan daerah, tabel induk `kode_rekening_anggaran` direferensikan oleh 5 juta baris transaksi pada tabel anak `realisasi_belanja` melalui foreign key `rekening_id`. Seorang pengembang baru mengusulkan mendefinisikan constraint `ON DELETE CASCADE` agar operator mudah menghapus kode rekening yang sudah tidak aktif tahun depan. Evaluasi risiko dan alternatif rancangan paling aman adalah...',
    jawabanBenar:
      '`ON DELETE CASCADE` sangat berbahaya karena satu penghapusan kode rekening akan memusnahkan seluruh jejak transaksi historis belanja; solusinya memakai `ON DELETE RESTRICT` dan menerapkan status nonaktif (`is_active = false` / `effective_end_date`) pada tabel master.',
    pengecoh4: [
      '`ON DELETE CASCADE` adalah praktik terbaik audit keuangan karena secara otomatis membersihkan baris yatim (orphan rows) dari laporan tahun-tahun sebelumnya.',
      'Solusi terbaik adalah `ON DELETE SET NULL` agar seluruh 5 juta transaksi historis kehilangan referensi akun anggarannya tetapi tetap tersimpan.',
      'Solusi terbaik adalah menghapus seluruh foreign key antar-tabel agar operator bebas mengubah atau menghapus data master tanpa pesan galat.',
      'Solusi terbaik adalah memakai `ON DELETE CASCADE` namun membatasi hak akses penghapusan hanya pada hari Jumat sore setelah jam layanan tutup.',
    ],
    akarMasalah:
      'Data keuangan dan layanan publik memiliki kewajiban retensi serta jejak audit lintas tahun; `ON DELETE CASCADE` pada master data menciptakan risiko penghapusan massal tak sengaja yang menghancurkan integritas laporan historis.',
    solusiTerbaik:
      'Mengunci integritas dengan `ON DELETE RESTRICT` (atau `NO ACTION`) dan menonaktifkan kode rekening usang lewat kolom status/masa berlaku menjaga riwayat belanja tetap utuh sekaligus mencegah pemakaian kode lama pada transaksi baru.',
    analisisPengecoh:
      'Menghapus transaksi sah bukanlah pembersihan orphan rows melainkan perusakan data audit; `SET NULL` memutus klasifikasi akuntansi historis; menghapus foreign key membuka inkonsistensi data; pembatasan jadwal tidak menghilangkan bahaya destruktif `CASCADE`.',
  },
  {
    level: 'C6',
    topik: 'Basis Data — Read Replica, Replication Lag & Read-Your-Writes',
    pertanyaan:
      'Portal pendaftaran CPNS memakai arsitektur 1 Primary PostgreSQL (untuk `INSERT/UPDATE`) dan 3 Read Replica asinkron (untuk `SELECT`) guna menahan lonjakan 20.000 pengguna serentak. Namun pelamar sering mengeluh: tepat setelah klik "Simpan Biodata" berhasil, halaman profil yang langsung dimuat ulang masih menampilkan data lama selama 2–3 detik. Penyebab teknis dan rancangan solusi yang paling tepat adalah...',
    jawabanBenar:
      'Terjadi Asynchronous Replication Lag antara Primary dan Read Replica; solusinya menerapkan pola Read-Your-Writes dengan mengarahkan query baca profil milik pengguna yang baru saja menulis ke Primary selama jendela singkat (atau mencocokkan LSN/replication position).',
    pengecoh4: [
      'Terjadi kesalahan browser cache HTML; solusinya menonaktifkan seluruh Read Replica dan memindahkan seluruh 20.000 pengguna baca-tulis kembali ke satu Primary.',
      'Terjadi kegagalan transaksi `COMMIT` di Primary; solusinya menambahkan `SLEEP(5)` di kode backend setiap selesai mengeksekusi `UPDATE` sebelum mengirim respons HTTP.',
      'Terjadi korupsi indeks pada Read Replica; solusinya menjalankan `VACUUM FULL` secara otomatis di ketiga replika setiap satu menit.',
      'Terjadi ketidaksinkronan jam NTP server; solusinya mengganti seluruh operasi `SELECT` menjadi `SELECT ... FOR UPDATE` pada Read Replica.',
    ],
    akarMasalah:
      'Pada replikasi asinkron, Primary langsung mengonfirmasi `COMMIT` ke aplikasi sebelum WAL selesai diterapkan di Read Replica, sehingga pembacaan segera dari replika dapat memperoleh state lama (eventual consistency lag).',
    solusiTerbaik:
      'Strategi Read-Your-Writes Consistency (routing baca pemilik sesi ke Primary selama beberapa detik pasca-tulis, atau menunggu LSN target tercapai di replika) menjamin pengalaman pengguna akurat tanpa mengorbankan skalabilitas baca massal Read Replica.',
    analisisPengecoh:
      'Mematikan semua replika akan melumpuhkan Primary pada 20.000 pengguna; `SLEEP(5)` membekukan thread server dan memperburuk latensi; `VACUUM FULL` mengunci tabel eksklusif dan tidak mengatasi replication lag; Read Replica bersifat read-only sehingga tidak mendukung `FOR UPDATE`.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — SQL Aggregation, NULL Handling & LEFT JOIN Trap',
    pertanyaan:
      'Analis data diminta menghitung jumlah permohonan selesai per kecamatan (termasuk kecamatan yang belum memiliki permohonan selesai agar tampil angka `0`). Ia menjalankan query berikut:\n```sql\nSELECT k.nama_kecamatan, COUNT(p.id) AS total_selesai\nFROM kecamatan k\nLEFT JOIN permohonan p ON p.kecamatan_id = k.id\nWHERE p.status = \'SELESAI\'\nGROUP BY k.id, k.nama_kecamatan;\n```\nHasilnya, 4 kecamatan yang belum punya permohonan selesai justru hilang dari laporan. Mengapa hal itu terjadi dan bagaimana perbaikan SQL yang benar?',
    jawabanBenar:
      'Filter `WHERE p.status = \'SELESAI\'` membuang baris hasil `LEFT JOIN` yang bernilai `NULL`, secara efektif mengubah `LEFT JOIN` menjadi `INNER JOIN`; perbaikannya memindahkan syarat `AND p.status = \'SELESAI\'` ke dalam klausa `ON`.',
    pengecoh4: [
      'Fungsi `COUNT(p.id)` otomatis menghapus grup yang bernilai nol; perbaikannya mengganti menjadi `COUNT(*)` sambil mempertahankan `WHERE p.status = \'SELESAI\'`.',
      'Klausa `GROUP BY k.id, k.nama_kecamatan` tidak mengizinkan hasil nol; perbaikannya menambahkan `HAVING COUNT(p.id) >= 0` di akhir query.',
      'Urutan tabel pada `LEFT JOIN` terbalik; perbaikannya mengganti `LEFT JOIN` menjadi `CROSS JOIN` lalu menyaring dengan `WHERE p.status = \'SELESAI\'`.',
      'Kolom `p.status` tidak diindeks; perbaikannya mengubah `WHERE p.status = \'SELESAI\'` menjadi `WHERE p.status LIKE \'SELESAI%\'`.',
    ],
    akarMasalah:
      'Dalam urutan eksekusi logis SQL, `LEFT JOIN` menghasilkan `NULL` pada kolom tabel kanan (`p.*`) untuk kecamatan tanpa kecocokan, tetapi klausa `WHERE p.status = \'SELESAI\'` dievaluasi sesudahnya dan menyaring keluar seluruh baris di mana `p.status` bernilai `NULL`.',
    solusiTerbaik:
      'Menempatkan kondisi tabel kanan pada klausa `ON` (`LEFT JOIN permohonan p ON p.kecamatan_id = k.id AND p.status = \'SELESAI\'`) menyaring sebelum penggabungan sehingga seluruh kecamatan tetap dipertahankan dan `COUNT(p.id)` menghasilkan `0` untuk baris `NULL`.',
    analisisPengecoh:
      '`COUNT(*)` dengan `WHERE` yang sama tetap kehilangan 4 kecamatan (dan bila `ON` dipakai, `COUNT(*)` justru keliru menghitung 1 untuk baris `NULL` alih-alih 0); `HAVING` dijalankan setelah `WHERE` membuang baris; `CROSS JOIN` menghasilkan produk Kartesius; `LIKE` tetap menolak `NULL`.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Connection Pooling & Exhaustion',
    pertanyaan:
      'Aplikasi web layanan perizinan berjalan di 12 kontainer microservice (masing-masing mengatur pool maksimal 50 koneksi), mengakses satu server PostgreSQL dengan `max_connections = 200`. Saat lonjakan trafik pengumuman hasil seleksi, log aplikasi memunculkan error:\n```log\nFATAL: sorry, too many clients already\n```\nSementara CPU server database baru 40%, namun memori melonjak tajam akibat ratusan proses idle. Rancangan perbaikan infrastruktur koneksi yang paling tepat adalah...',
    jawabanBenar:
      'Memasang connection pooler terpusat seperti PgBouncer dalam mode `transaction pooling` di depan PostgreSQL dan menyelaraskan batas pool tiap kontainer agar total koneksi fisik ke DB tetap efisien di bawah `max_connections`.',
    pengecoh4: [
      'Menaikkan `max_connections` PostgreSQL menjadi 5.000 tanpa menambah memori atau pooler agar seluruh kontainer bebas membuka ratusan koneksi idle.',
      'Menonaktifkan connection pooling di seluruh kontainer sehingga aplikasi membuka dan menutup koneksi TCP baru untuk setiap satu query SQL.',
      'Mengurangi jumlah kontainer aplikasi dari 12 menjadi 1 agar total koneksi maksimal hanya 50 meskipun beban trafik sedang puncak.',
      'Menjalankan `SELECT pg_terminate_backend(pid)` setiap 10 detik untuk memutus paksa semua koneksi aktif secara acak.',
    ],
    akarMasalah:
      '12 kontainer × 50 koneksi berpotensi meminta 600 koneksi serentak melebihi batas `max_connections = 200`, dan pada PostgreSQL setiap koneksi memicu proses OS tersendiri yang boros RAM serta context switching meski banyak yang idle.',
    solusiTerbaik:
      'Connection pooler terpusat (PgBouncer `transaction pooling`) memultipleks ribuan koneksi klien aplikasi ke puluhan koneksi database fisik yang benar-benar aktif, menjaga RAM stabil dan menghilangkan error kehabisan koneksi.',
    analisisPengecoh:
      'Menaikkan `max_connections` hingga 5.000 memicu OOM dan thrashing CPU; membuka koneksi baru per query menambah latensi TCP/TLS handshake besar; menurunkan kontainer jadi 1 menciptakan bottleneck aplikasi; memutus backend acak menggagalkan transaksi aktif warga.',
  },
  {
    level: 'C6',
    topik: 'Basis Data — Idempotency & Unique Constraint pada Pembayaran',
    pertanyaan:
      'Pada modul pembayaran PNBP daerah, pengguna kerap menekan tombol "Bayar" dua kali saat koneksi seluler lambat sehingga dua request `POST /pembayaran` dengan `nomor_billing` yang sama tiba bersamaan di dua server backend berbeda. Pengecekan `SELECT` di kode aplikasi lolos keduanya dan tercatat dua transaksi ganda. Pengamanan paling mutlak di lapisan basis data dan API adalah...',
    jawabanBenar:
      'Menambahkan `UNIQUE CONSTRAINT` pada kolom `idempotency_key` (atau `nomor_billing` untuk transaksi sukses) di tabel pembayaran dan menangani konflik secara atomik (`INSERT ... ON CONFLICT DO NOTHING` / mengembalikan hasil transaksi pertama).',
    pengecoh4: [
      'Cukup menonaktifkan tombol "Bayar" di JavaScript frontend selama 3 detik setelah diklik tanpa menambahkan constraint apa pun di basis data.',
      'Menambahkan perintah `SELECT COUNT(*) FROM pembayaran WHERE nomor_billing = ?` di aplikasi tanpa transaksi maupun indeks unik sebelum `INSERT`.',
      'Menjadwalkan cron job setiap tengah malam untuk mencari dan menghapus baris pembayaran ganda secara manual dari tabel transaksi.',
      'Menghapus seluruh indeks pada tabel pembayaran agar `INSERT` pertama selesai lebih cepat sebelum request kedua tiba.',
    ],
    akarMasalah:
      'Pengecekan `SELECT` diikuti `INSERT` di luar kendali constraint unik rentan race condition (Time-of-Check to Time-of-Use) ketika dua request paralel diproses oleh dua node aplikasi berbeda.',
    solusiTerbaik:
      'Penegakan `UNIQUE CONSTRAINT` pada level basis data bersifat atomik lintas seluruh node aplikasi; dipadukan dengan `idempotency_key`, duplikasi ditolak secara deterministik dan klien tetap menerima respons konsisten dari transaksi asli.',
    analisisPengecoh:
      'Disable tombol frontend mudah terlewati oleh retry jaringan atau request langsung ke API; `SELECT` tanpa unique constraint tetap kalah terhadap race condition; pembersihan tengah malam sudah terlambat karena dana/status terlanjur ganda; menghapus indeks justru memperlambat pengecekan.',
  },
  {
    level: 'C5',
    topik: 'Basis Data — Indeksasi JSONB (GIN vs B-Tree)',
    pertanyaan:
      'Sistem perizinan lintas sektor menyimpan atribut dinamis tiap jenis izin pada kolom `metadata_izin JSONB` di PostgreSQL (8 juta baris). Query yang paling sering dijalankan adalah pencarian fleksibel key-value seperti:\n```sql\nSELECT id, nomor_izin\nFROM perizinan\nWHERE metadata_izin @> \'{"sektor": "pariwisata", "skala": "menengah"}\';\n```\nNamun query masih melakukan Sequential Scan. Evaluasi jenis indeks yang paling tepat beserta pertimbangan trade-off-nya adalah...',
    jawabanBenar:
      'Membuat GIN Index (`CREATE INDEX idx_meta_gin ON perizinan USING GIN (metadata_izin jsonb_path_ops);`) karena mendukung operator containment `@>` secara efisien dengan ukuran indeks lebih ringkas, dengan trade-off overhead tulis lebih tinggi daripada B-Tree.',
    pengecoh4: [
      'Membuat B-Tree Index standar pada seluruh kolom `metadata_izin` agar operator containment `@>` dapat mencari pasangan key-value di kedalaman objek mana pun.',
      'Membuat Hash Index pada `metadata_izin` karena Hash Index paling unggul untuk pencarian parsial sebagian kunci di dalam dokumen JSONB.',
      'Mengubah tipe kolom `metadata_izin` dari `JSONB` menjadi `TEXT` biasa lalu menambahkan B-Tree Index agar pencarian `@>` langsung berjalan cepat.',
      'Membuat BRIN Index pada `metadata_izin` karena struktur JSON selalu tersimpan berurutan secara fisik mengikuti urutan abjad atribut `sektor`.',
    ],
    akarMasalah:
      'Operator containment JSONB (`@>`) memeriksa keberadaan sub-struktur key-value di dalam dokumen semi-terstruktur, yang tidak dapat dilayani oleh indeks B-Tree standar pada kolom utuh.',
    solusiTerbaik:
      'GIN (Generalized Inverted Index) dengan operator class `jsonb_path_ops` mengindeks jalur path-value secara terbalik sehingga query `@>` menjadi sangat cepat dan ukuran indeksnya jauh lebih kecil daripada GIN default, sembari menyadari biaya pemeliharaan saat `INSERT/UPDATE`.',
    analisisPengecoh:
      'B-Tree pada kolom JSONB utuh hanya mendukung kesamaan persis seluruh objek bukan `@>`; Hash Index juga hanya untuk exact equality `=`; tipe `TEXT` tidak mendukung operator `@>`; BRIN hanya efektif pada data yang berkorelasi fisik linear seperti timestamp append-only.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Window Function vs Correlated Subquery',
    pertanyaan:
      'Tim analitik kepegawaian perlu menampilkan gaji pokok setiap pegawai beserta peringkat gajinya di dalam masing-masing unit kerja dan rata-rata gaji unit tersebut pada tabel `pegawai` (500.000 baris). Pengembang menulis correlated subquery di klausa `SELECT` yang memicu pemindaian berulang hingga 18 detik:\n```sql\nSELECT p.nama, p.unit_id, p.gaji,\n  (SELECT AVG(p2.gaji) FROM pegawai p2 WHERE p2.unit_id = p.unit_id) AS avg_unit\nFROM pegawai p;\n```\nPenulisan ulang SQL modern yang jauh lebih efisien dan sekaligus menyediakan peringkat per unit adalah...',
    jawabanBenar:
      'Menggunakan Window Functions dalam satu kali lintasan data: `AVG(gaji) OVER (PARTITION BY unit_id)` dan `DENSE_RANK() OVER (PARTITION BY unit_id ORDER BY gaji DESC)`.',
    pengecoh4: [
      'Menggunakan `GROUP BY unit_id` pada query utama agar rata-rata dan seluruh rincian nama tiap pegawai tampil otomatis tanpa fungsi jendela.',
      'Menambahkan klausa `DISTINCT` pada correlated subquery agar rata-rata gaji tidak dihitung ulang bagi pegawai yang gajinya sama.',
      'Memecah query menjadi 500.000 query terpisah melalui perulangan `for` di aplikasi backend agar beban memori database tetap rendah.',
      'Mengganti `AVG` dengan `SUM` lalu memindahkan seluruh 500.000 baris ke file CSV untuk dihitung peringkatnya secara manual.',
    ],
    akarMasalah:
      'Correlated subquery berpotensi mengeksekusi evaluasi berulang untuk setiap baris luar (mendekati $O(N^2)$ bila tidak ter-decorrelate oleh optimizer) dan tidak menyediakan ranking per partisi secara ringkas.',
    solusiTerbaik:
      'Window Functions (`OVER (PARTITION BY unit_id ...)`) menghitung agregasi dan peringkat dalam satu alur sort/hash terpartisi ($O(N \log N)$) sembari mempertahankan detail tiap baris pegawai tanpa menyusutkan baris seperti `GROUP BY`.',
    analisisPengecoh:
      '`GROUP BY unit_id` menyusutkan hasil menjadi satu baris per unit sehingga tidak bisa menampilkan detail tiap pegawai; `DISTINCT` di subquery justru merusak hasil rata-rata bila ada gaji sama; 500.000 query menciptakan bencana N+1; ekspor CSV bukan solusi query sistem.',
  },
  {
    level: 'C5',
    topik: 'Basis Data — Point-in-Time Recovery (PITR) & Strategi Backup',
    pertanyaan:
      'Pada pukul 10:14 WIB, seorang operator keliru menjalankan `UPDATE data_pajak SET status = \'LUNAS\';` tanpa klausa `WHERE` di database produksi PostgreSQL. Kebijakan instansi menetapkan RPO (Recovery Point Objective) maksimal 5 menit. Backup harian terakhir (`pg_dump`) dibuat pukul 00:00 WIB. Evaluasi arsitektur backup yang seharusnya diterapkan agar data tepat pada pukul 10:13 WIB dapat dipulihkan tanpa kehilangan transaksi pagi adalah...',
    jawabanBenar:
      'Mengombinasikan Physical Base Backup berkala (`pg_basebackup`) dengan Continuous WAL Archiving sehingga DBA dapat melakukan Point-in-Time Recovery (PITR) tepat ke timestamp `10:13:59 WIB`.',
    pengecoh4: [
      'Mengandalkan `pg_dump` harian pukul 00:00 WIB saja lalu mengembalikan seluruh database ke kondisi tengah malam karena transaksi pagi bisa diinput ulang warga.',
      'Memasang RAID 1 (disk mirroring) pada server produksi karena RAID 1 secara otomatis mencegah dan membatalkan perintah `UPDATE` tanpa `WHERE`.',
      'Mengaktifkan Synchronous Streaming Replication ke server standby saja tanpa WAL archiving, lalu melakukan failover ke standby untuk membatalkan kesalahan `UPDATE`.',
      'Menjadwalkan ekspor file CSV seluruh tabel setiap 12 jam ke folder lokal server yang sama agar pemulihan cepat dilakukan.',
    ],
    akarMasalah:
      'Logical dump harian (`pg_dump`) hanya menyimpan snapshot satu titik waktu (RPO hingga 24 jam), sedangkan kesalahan logis manusia (`UPDATE` tanpa `WHERE`) langsung tereplikasi secara instan ke disk mirror maupun standby real-time.',
    solusiTerbaik:
      'Physical Base Backup + Continuous WAL Archiving memungkinkan Point-in-Time Recovery (PITR): memutar ulang seluruh transaksi dari base backup dan berhenti tepat satu detik sebelum perintah salah dieksekusi (memenuhi RPO ≤ 5 menit).',
    analisisPengecoh:
      'Restore dump 00:00 kehilangan 10 jam transaksi warga (melanggar RPO 5 menit); RAID 1 dan replikasi real-time ikut mereplikasi kesalahan `UPDATE` secara seketika sehingga tidak memulihkan human error; CSV tiap 12 jam di server lokal gagal memenuhi RPO dan rawan kehilangan fisik.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Write Amplification & Over-Indexing',
    pertanyaan:
      'Tabel `transaksi_antrean_loket` memiliki 14 indeks B-Tree berbeda karena setiap pengembang menambahkan indeks baru setiap kali membuat laporan ad-hoc. Dampaknya, waktu eksekusi `INSERT` saat jam puncak pendaftaran melambat 6 kali lipat dan penggunaan disk indeks mencapai 3 kali ukuran tabelnya. Diagnosis masalah dan langkah optimasi yang paling tepat adalah...',
    jawabanBenar:
      'Terjadi Over-Indexing yang memicu Write Amplification tinggi pada setiap `INSERT/UPDATE`; solusinya mengaudit statistik pemakaian indeks (`pg_stat_user_indexes`), menghapus indeks duplikat/tidak terpakai, serta mengonsolidasi composite index.',
    pengecoh4: [
      'Terjadi kekurangan indeks pada primary key; solusinya menambahkan 5 indeks tambahan lagi agar seluruh kemungkinan kombinasi `WHERE` tercakup.',
      'Terjadi kerusakan blok memori disk; solusinya menonaktifkan fitur WAL logging di produksi agar `INSERT` tidak menulis log pemulihan.',
      'Terjadi kebocoran memori pada SQL parser; solusinya mengganti seluruh tipe kolom menjadi `BIGINT` supaya jumlah indeks bisa ditambah hingga 30 buah.',
      'Terjadi hambatan jaringan TCP; solusinya menghapus seluruh indeks termasuk primary key agar tabel menjadi heap murni tanpa indeks sama sekali.',
    ],
    akarMasalah:
      'Setiap satu operasi `INSERT` atau `UPDATE` kolom terindeks memaksa mesin database memperbarui struktur pohon pada seluruh 14 indeks sekaligus (Write Amplification), meningkatkan beban CPU, I/O disk, WAL, dan page splits.',
    solusiTerbaik:
      'Audit berbasis data (`pg_stat_user_indexes` untuk menemukan indeks dengan `idx_scan = 0` atau indeks yang sudah tercakup leftmost prefix indeks lain) diikuti konsolidasi indeks secara drastis mempercepat tulis tanpa mengorbankan query baca penting.',
    analisisPengecoh:
      'Menambah indeks memperparah write amplification; mematikan WAL merusak durabilitas (ACID); mengubah tipe ke `BIGINT` tidak menyelesaikan over-indexing; menghapus primary key menghancurkan integritas entitas dan melumpuhkan pencarian kritis.',
  },
  {
    level: 'C6',
    topik: 'Basis Data — Zero-Downtime Schema Migration',
    pertanyaan:
      'Portal layanan publik 24/7 memiliki tabel `dokumen_warga` (50 juta baris). Tim perlu menambahkan indeks baru pada kolom `kode_verifikasi` dan mengganti nama kolom `no_hp` menjadi `nomor_telepon` tanpa menyebabkan downtime atau pemblokiran `INSERT/UPDATE` selama jam operasional. Strategi migrasi skema yang paling aman adalah...',
    jawabanBenar:
      'Membuat indeks dengan `CREATE INDEX CONCURRENTLY` agar tidak mengunci operasi tulis, dan menerapkan pola Expand-and-Contract (tambah kolom baru + dual-write + backfill bertahap + pindah baca + hapus kolom lama) untuk penggantian nama kolom.',
    pengecoh4: [
      'Menjalankan `CREATE INDEX` standar dan `ALTER TABLE RENAME COLUMN` langsung saat jam sibuk karena perubahan nama kolom tidak pernah memengaruhi kode aplikasi yang sedang berjalan.',
      'Menghentikan seluruh server aplikasi selama 4 jam pada hari kerja untuk menyalin 50 juta baris ke tabel baru secara manual.',
      'Menghapus kolom `no_hp` terlebih dahulu baru membuat kolom `nomor_telepon` agar ukuran baris tabel tidak pernah bertambah sementara.',
      'Menjalankan `LOCK TABLE dokumen_warga IN ACCESS EXCLUSIVE MODE` sebelum migrasi agar seluruh permintaan warga antre sampai migrasi selesai.',
    ],
    akarMasalah:
      '`CREATE INDEX` biasa mengambil `SHARE` lock yang memblokir seluruh `INSERT/UPDATE/DELETE` selama menit/jam pada tabel besar, sedangkan `RENAME COLUMN` langsung mematahkan versi aplikasi lama yang masih berjalan selama rolling deployment.',
    solusiTerbaik:
      '`CREATE INDEX CONCURRENTLY` membangun indeks tanpa memblokir tulis, dan pola Expand-and-Contract (multi-step backward-compatible migration) memastikan versi aplikasi lama dan baru tetap kompatibel 100% sepanjang proses rilis tanpa downtime.',
    analisisPengecoh:
      '`RENAME COLUMN` langsung memicu error `column "no_hp" does not exist` pada instans aplikasi yang belum terbarui; menghentikan layanan melanggar syarat zero-downtime; menghapus `no_hp` dulu memusnahkan seluruh data telepon warga; `ACCESS EXCLUSIVE` justru menciptakan total downtime.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Materialized View & Refresh Strategy',
    pertanyaan:
      'Dashboard eksekutif pimpinan daerah menampilkan ringkasan 12 indikator serapan anggaran yang menggabungkan 6 tabel transaksi besar. Query langsung membutuhkan 11 detik setiap kali halaman dibuka, padahal pimpinan hanya memerlukan pembaruan data setiap 15 menit. Solusi paling efisien pada sisi database yang tetap menjaga dashboard dapat diakses selama pembaruan berlangsung adalah...',
    jawabanBenar:
      'Membuat `MATERIALIZED VIEW` dengan indeks unik lalu menjadwalkan `REFRESH MATERIALIZED VIEW CONCURRENTLY` setiap 15 menit agar pembacaan dashboard berlangsung milidetik tanpa terblokir saat refresh.',
    pengecoh4: [
      'Membuat `VIEW` biasa (non-materialized) karena setiap `VIEW` standar di PostgreSQL otomatis menyimpan hasil kalkulasi permanen di disk.',
      'Menjalankan `REFRESH MATERIALIZED VIEW` tanpa opsi `CONCURRENTLY` dan tanpa indeks unik karena mode standar tidak pernah mengunci operasi `SELECT`.',
      'Menyalin hasil query secara manual ke tabel sementara dengan `DROP TABLE` lalu `CREATE TABLE AS` setiap 15 menit pada jam akses pimpinan.',
      'Menambahkan `ORDER BY RANDOM()` pada query dashboard agar database menggunakan cache internal secara otomatis.',
    ],
    akarMasalah:
      'Menghitung ulang agregasi 6 tabel besar setiap kali halaman dimuat sangat boros CPU, sementara refresh materialized view standar mengambil `ACCESS EXCLUSIVE` lock yang memblokir pembaca dashboard selama refresh berjalan.',
    solusiTerbaik:
      '`MATERIALIZED VIEW` menyimpan hasil prakomputasi di disk sehingga dashboard merespons dalam milidetik, dan opsi `CONCURRENTLY` (dengan syarat adanya unique index) memperbarui data di latar belakang tanpa memblokir query `SELECT` pimpinan.',
    analisisPengecoh:
      '`VIEW` biasa hanyalah definisi query tersimpan yang tetap mengeksekusi ulang seluruh 6 `JOIN` tiap diakses; refresh tanpa `CONCURRENTLY` memblokir seluruh pembaca; `DROP/CREATE` menimbulkan celah error "relation does not exist"; `ORDER BY RANDOM()` justru melumpuhkan indeks dan memicu sort penuh.',
  },
  {
    level: 'C5',
    topik: 'Basis Data — Memilih RDBMS vs NoSQL Berdasarkan Karakteristik Beban Kerja',
    pertanyaan:
      'Instansi sedang merancang dua subsistem baru: (1) Subsistem Pengelolaan Gaji & Tunjangan ASN yang menuntut konsistensi kuat, relasi kompleks antar-tabel, dan transaksi debit-kredit akurat; serta (2) Subsistem Penyimpanan Log Aktivitas Klik & Sesi Sementara Pengguna (TTL 30 menit) berkecepatan 50.000 operasi/detik. Keputusan arsitektur Polyglot Persistence yang paling tepat adalah...',
    jawabanBenar:
      'Menggunakan RDBMS berstandar ACID (seperti PostgreSQL) untuk Subsistem Gaji & Tunjangan, serta In-Memory Key-Value Store (seperti Redis dengan TTL) atau penyimpanan log terdistribusi untuk Subsistem Sesi & Log Klik.',
    pengecoh4: [
      'Menempatkan Subsistem Gaji & Tunjangan di Redis tanpa persistensi disk agar perhitungan gaji ribuan ASN selesai dalam hitungan mikrodetik.',
      'Menempatkan seluruh 50.000 operasi klik per detik beserta data sesi sementara ke dalam tabel RDBMS dengan isolation level `SERIALIZABLE` agar tidak perlu sistem tambahan.',
      'Menggunakan satu database grafik (Graph DB) untuk menggantikan keduanya karena seluruh data di pemerintahan pada dasarnya dapat dimodelkan sebagai simpul dan sisi.',
      'Menyimpan data gaji ASN sebagai berkas JSON terpisah di object storage tanpa mekanisme transaksi agar biaya lisensi basis data menjadi nol.',
    ],
    akarMasalah:
      'Memaksakan satu jenis mesin penyimpanan untuk dua beban kerja yang bertolak belakang (transaksi finansial berintegritas mutlak vs data sementara/ephemeral berkecepatan sangat tinggi) akan mengorbankan konsistensi atau skalabilitas.',
    solusiTerbaik:
      'Polyglot Persistence mencocokkan teknologi dengan kebutuhan domain: RDBMS menjamin integritas referensial dan ACID untuk penggajian, sementara key-value store in-memory unggul pada latensi sub-milidetik dan kedaluwarsa otomatis (TTL) untuk sesi/log.',
    analisisPengecoh:
      'Redis tanpa persistensi/ACID relasional berisiko kehilangan data finansial negara; memasukkan 50.000 write/detik sesi sementara ke RDBMS `SERIALIZABLE` melumpuhkan disk dan lock; Graph DB tidak optimal untuk penggajian maupun sesi TTL; object storage tidak mendukung transaksi atomik.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Autovacuum, Table Bloat & Transaction ID Wraparound',
    pertanyaan:
      'Tabel `status_antrean_harian` di PostgreSQL hanya menyimpan 100.000 baris aktif, tetapi ukurannya membengkak hingga 18 GB dan query `SELECT COUNT(*)` melambat drastis. Pemeriksaan DBA menemukan bahwa sebuah proses pelaporan BI telah membuka transaksi `IDLE IN TRANSACTION` selama 4 hari berturut-turut. Bagaimana keterkaitan transaksi menggantung tersebut dengan pembengkakan tabel?',
    jawabanBenar:
      'Transaksi yang terus terbuka (`IDLE IN TRANSACTION`) menahan horizon snapshot MVCC sehingga `AUTOVACUUM` tidak dapat mereklamasi jutaan dead tuples hasil `UPDATE/DELETE` yang terjadi selama 4 hari terakhir.',
    pengecoh4: [
      'Transaksi `IDLE IN TRANSACTION` secara otomatis menggandakan isi setiap baris tabel setiap satu jam sekali sebagai salinan cadangan.',
      'Transaksi yang diam terlalu lama memaksa PostgreSQL mengubah seluruh tipe kolom `INTEGER` menjadi `TEXT` sehingga ukuran disk melonjak.',
      'Transaksi tersebut mematikan seluruh indeks B-Tree di database sehingga tabel harus menyimpan duplikat baris secara acak.',
      'Ukuran tabel membengkak semata-mata karena `SELECT COUNT(*)` menulis baris log baru ke dalam tabel `status_antrean_harian`.',
    ],
    akarMasalah:
      'Pada arsitektur MVCC PostgreSQL, baris lama yang diperbarui/dihapus (dead tuples) tidak boleh dibersihkan oleh `AUTOVACUUM` selama masih ada transaksi aktif dengan snapshot lama yang secara teoritis masih berhak melihat versi baris tersebut.',
    solusiTerbaik:
      'Menghentikan transaksi menggantung, mengonfigurasi `idle_in_transaction_session_timeout` (mis. 5 menit), lalu menjalankan `VACUUM` / `pg_repack` mengembalikan ruang yang dapat dipakai ulang serta mencegah risiko Transaction ID Wraparound.',
    analisisPengecoh:
      'Transaksi idle tidak menggandakan baris secara aktif melainkan menghambat pembersihan versi lama; tidak ada pengubahan tipe kolom otomatis; indeks tidak dimatikan oleh transaksi idle; `SELECT COUNT(*)` bersifat read-only dan tidak menulis ke tabel.',
  },
  {
    level: 'C6',
    topik: 'Basis Data — Optimasi Batch Ingestion (Bulk Load)',
    pertanyaan:
      'Setiap awal semester, sistem Dapodik/Pendidikan daerah harus mengimpor 2 juta baris data siswa baru dari berkas CSV ke tabel `siswa_semester` di PostgreSQL. Skrip saat ini mengeksekusi 2 juta perintah `INSERT` terpisah yang masing-masing berada dalam transaksi autocommit sendiri dan memakan waktu 3 jam lebih. Rancangan optimasi impor paling efisien tanpa mengorbankan validitas data adalah...',
    jawabanBenar:
      'Memuat data ke tabel staging memakai perintah bulk `COPY` dalam transaksi batch (atau multi-row `INSERT` terkelompok), memvalidasi data secara set-based di SQL, lalu memindahkannya ke tabel target sebelum membangun indeks non-kunci tambahan.',
    pengecoh4: [
      'Menjalankan 2 juta perintah `INSERT` terpisah dari 200 thread paralel secara bersamaan sambil tetap memakai autocommit pada setiap baris.',
      'Menonaktifkan `fsync = off` secara permanen pada server database produksi agar sistem operasi tidak perlu menulis data ke disk sama sekali.',
      'Mengubah seluruh baris CSV menjadi 2 juta perintah `UPDATE` satu per satu agar mesin database tidak perlu mengalokasikan halaman disk baru.',
      'Menghapus seluruh aturan validasi tipe data dan `NOT NULL` pada tabel produksi agar seluruh baris CSV langsung masuk meski kotor.',
    ],
    akarMasalah:
      'Dua juta autocommit `INSERT` terpisah menimbulkan 2 juta network round-trip, 2 juta kali WAL flush (fsync commit), dan pembaruan indeks berulang baris demi baris yang memakan waktu berjam-jam.',
    solusiTerbaik:
      'Pola Staging Table + `COPY` (protokol streaming bulk load) + validasi SQL berbasis himpunan (set-based) memangkas overhead round-trip dan WAL flush secara drastis sehingga 2 juta baris dapat tuntas dalam puluhan detik sambil menjaga mutu data.',
    analisisPengecoh:
      '200 thread autocommit tetap menghasilkan 2 juta fsync dan memicu lock contention parah; `fsync = off` di produksi berisiko korupsi total database saat listrik padam; `UPDATE` tidak memasukkan data baru; menghapus validasi memasukkan data cacat ke produksi.',
  },
];
