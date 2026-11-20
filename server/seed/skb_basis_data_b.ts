import type { SkbHotsItem } from './skb_hots_builder';

export const SKB_BASIS_DATA_B: SkbHotsItem[] = [
  {
    level: 'C4',
    topik: 'Basis Data — SQL Injection vs Stored Procedure Dinamis',
    pertanyaan:
      'Seorang pengembang meyakini modul pencariannya sudah 100% kebal SQL Injection karena memindahkan query ke dalam Stored Procedure PostgreSQL berikut:\n```sql\nCREATE FUNCTION cari_warga(p_nama TEXT) RETURNS SETOF warga AS $$\nBEGIN\n  RETURN QUERY EXECUTE \'SELECT * FROM warga WHERE nama = \'\'\' || p_nama || \'\'\'\';\nEND;\n$$ LANGUAGE plpgsql;\n```\nHasil uji penetrasi menunjukkan fungsi tersebut tetap bisa dieksploitasi dengan input `\' OR 1=1 --`. Mengapa celah tetap terjadi dan perbaikan yang benar pada fungsi tersebut adalah...',
    jawabanBenar:
      'Konkatenasi string dinamis (`|| p_nama`) di dalam `EXECUTE` tetap mencampur kode dan data; perbaikannya menggunakan klausa berparameter `RETURN QUERY EXECUTE \'SELECT * FROM warga WHERE nama = $1\' USING p_nama;` atau query statis langsung.',
    pengecoh4: [
      'Celah terjadi karena bahasa `plpgsql` tidak mendukung keamanan input; perbaikannya wajib memindahkan seluruh query kembali ke string konkatenasi di backend JavaScript.',
      'Celah terjadi karena fungsi mengembalikan `SETOF warga`; perbaikannya mengubah tipe keluaran menjadi `JSON` sambil mempertahankan operator konkatenasi `||`.',
      'Celah terjadi karena tanda kutip tunggal kurang banyak; perbaikannya mengganti `p_nama` menjadi huruf besar (`UPPER(p_nama)`) sebelum disambung ke string `EXECUTE`.',
      'Celah terjadi karena tabel `warga` belum memiliki indeks unik pada `nama`; perbaikannya menambahkan `UNIQUE (nama)` agar payload injeksi ditolak.',
    ],
    akarMasalah:
      'Stored Procedure tidak otomatis kebal SQL Injection apabila di dalamnya tetap menyusun perintah SQL secara dinamis melalui penggabungan string (`||`) tanpa binding parameter.',
    solusiTerbaik:
      'Menggunakan binding parameter `USING p_nama` pada `EXECUTE` (atau query statis `RETURN QUERY SELECT * FROM warga WHERE nama = p_nama;`) memisahkan teks perintah SQL dari nilai data sehingga payload tidak pernah ditafsirkan sebagai sintaks SQL.',
    analisisPengecoh:
      'Konkatenasi di JS sama rentannya; mengubah return type ke `JSON` tidak menyentuh akar injeksi; `UPPER()` tetap meloloskan `\' OR 1=1 --`; unique index tidak mencegah eksekusi predikat SQL injeksi pada `SELECT`.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Optimasi Join & Foreign Key Tanpa Indeks',
    pertanyaan:
      'Database kependudukan memiliki tabel induk `keluarga` (1 juta baris, PK `id`) dan tabel anak `anggota_keluarga` (4 juta baris, FK `keluarga_id REFERENCES keluarga(id)`). Saat DBA menghapus satu baris uji pada tabel induk (`DELETE FROM keluarga WHERE id = 999123;`), eksekusi memerlukan waktu 3,6 detik dan memicu lonjakan disk read. Penyebab paling mungkin pada PostgreSQL/RDBMS adalah...',
    jawabanBenar:
      'Kolom foreign key `anggota_keluarga.keluarga_id` tidak memiliki indeks sehingga setiap `DELETE` pada tabel induk memaksa database melakukan Sequential Scan penuh pada 4 juta baris tabel anak untuk memverifikasi integritas referensial.',
    pengecoh4: [
      'Primary key `keluarga.id` secara default tidak diindeks oleh PostgreSQL sehingga pencarian baris `id = 999123` memindai seluruh 1 juta baris tabel induk.',
      'Perintah `DELETE` pada tabel induk selalu menjalankan `VACUUM FULL` otomatis pada seluruh tabel anak sebelum mengembalikan status berhasil.',
      'Constraint foreign key hanya bekerja bila kolom `keluarga_id` bertipe `UUID`, sehingga tipe integer memaksa pemindaian penuh.',
      'Jumlah baris 4 juta melampaui batas maksimal tabel anak dalam relasi foreign key standar SQL.',
    ],
    akarMasalah:
      'PostgreSQL (dan banyak RDBMS lain) otomatis membuat indeks untuk `PRIMARY KEY` dan `UNIQUE`, tetapi tidak otomatis membuat indeks pada kolom `FOREIGN KEY` di tabel anak; saat baris induk dihapus/diubah PK-nya, engine harus memeriksa seluruh tabel anak.',
    solusiTerbaik:
      'Membuat indeks B-Tree pada kolom `anggota_keluarga(keluarga_id)` mengubah pengecekan integritas referensial maupun operasi `JOIN keluarga` dari Sequential Scan 4 juta baris menjadi Index Lookup dalam hitungan mikrodetik.',
    analisisPengecoh:
      'Primary key selalu otomatis diindeks; `DELETE` tidak menjalankan `VACUUM FULL`; tipe integer justru sangat optimal untuk FK dibanding UUID; tidak ada batas 4 juta baris pada FK relasional.',
  },
  {
    level: 'C5',
    topik: 'Basis Data — Memilih Strategi Sharding vs Read Scaling',
    pertanyaan:
      'Sistem portal layanan kesehatan daerah saat ini memiliki ukuran database total 180 GB, dengan rasio beban 92% operasi baca (`SELECT`) dan 8% operasi tulis (`INSERT/UPDATE`), berjalan di satu server ber-RAM 64 GB yang CPU-nya menyentuh 85% saat jam sibuk. Seorang konsultan mengusulkan langsung menerapkan Horizontal Sharding ke 8 shard terpisah. Evaluasi keputusan arsitektur yang paling proporsional adalah...',
    jawabanBenar:
      'Horizontal Sharding terlalu dini dan menambah kompleksitas cross-shard `JOIN`/transaksi terdistribusi; solusi lebih tepat adalah mengoptimalkan query/indeks, menambahkan lapisan caching (Redis), dan memakai Read Replicas untuk menyerap 92% beban baca.',
    pengecoh4: [
      'Horizontal Sharding ke 8 shard wajib segera diterapkan karena database berukuran 180 GB sudah melampaui kapasitas fisik penyimpanan satu server modern.',
      'Horizontal Sharding merupakan satu-satunya cara untuk mengurangi beban CPU operasi `SELECT` karena Read Replica hanya dapat melayani perintah `INSERT`.',
      'Solusi terbaik adalah memecah setiap kolom tabel ke server berbeda (Vertical Sharding per kolom) agar setiap `SELECT *` mengambil data dari 8 server sekaligus.',
      'Solusi terbaik adalah memindahkan seluruh data kesehatan ke SQLite lokal di masing-masing browser warga agar beban server turun menjadi nol.',
    ],
    akarMasalah:
      'Beban kerja didominasi baca (92%) dengan volume data 180 GB yang masih sangat nyaman ditampung satu server modern; sharding memecah konsistensi transaksi ACID dan memperumit `JOIN` lintas wilayah secara permanen.',
    solusiTerbaik:
      'Memulai dari optimasi query/indeks, caching untuk data sering dibaca, serta Read Replicas langsung menyelesaikan bottleneck baca 92% dengan kompleksitas operasional jauh lebih rendah dan menjaga transaksi ACID tetap utuh.',
    analisisPengecoh:
      '180 GB masih jauh di bawah batas kapasitas satu node database modern (puluhan TB); Read Replica justru melayani `SELECT` (bukan `INSERT`); memutus kolom ke banyak server memperlambat `SELECT *` lewat network join; SQLite di browser mustahil untuk data terpusat layanan kesehatan.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — CTE, Filter Pushdown & Query Plan',
    pertanyaan:
      'Perhatikan dua alternatif query pencocokan data penerima beasiswa pada tabel `pelamar` (3 juta baris) dan tabel `daftar_hitam` (50.000 baris, di mana kolom `nik` pada `daftar_hitam` bisa mengandung beberapa nilai `NULL`):\n```sql\n-- Query A:\nSELECT p.id FROM pelamar p\nWHERE p.nik NOT IN (SELECT d.nik FROM daftar_hitam d);\n\n-- Query B:\nSELECT p.id FROM pelamar p\nWHERE NOT EXISTS (\n  SELECT 1 FROM daftar_hitam d WHERE d.nik = p.nik\n);\n```\nKetika dijalankan, Query A mengembalikan **0 baris** secara tak terduga, sedangkan Query B mengembalikan hasil benar. Analisis logika tiga nilai SQL (Three-Valued Logic) yang menjelaskan anomali Query A adalah...',
    jawabanBenar:
      'Keberadaan satu saja nilai `NULL` pada hasil subquery `NOT IN` membuat perbandingan `p.nik <> NULL` bernilai `UNKNOWN` untuk seluruh baris, sehingga seluruh kondisi `WHERE` gagal; sementara `NOT EXISTS` (anti-join) kebal terhadap `NULL` di tabel kanan.',
    pengecoh4: [
      'Subquery `NOT IN` hanya mendukung maksimal 1.000 baris sehingga otomatis mengembalikan hasil kosong bila tabel `daftar_hitam` berisi 50.000 baris.',
      'Operator `NOT IN` melakukan pencocokan case-sensitive sedangkan `NOT EXISTS` mengabaikan perbedaan huruf besar dan kecil pada NIK.',
      'Query A mengembalikan 0 baris karena `SELECT p.id` tidak menyertakan kolom `p.nik` di klausa `SELECT`.',
      'Query B bekerja lebih benar semata-mata karena angka `1` pada `SELECT 1` memaksa database mengabaikan baris pertama tabel `daftar_hitam`.',
    ],
    akarMasalah:
      'Dalam SQL Three-Valued Logic (`TRUE`, `FALSE`, `UNKNOWN`), ekspresi `x NOT IN (a, NULL)` ekuivalen dengan `x <> a AND x <> NULL`, yang selalu mengevaluasi ke `UNKNOWN` (tidak pernah `TRUE`), menyebabkan hasil kosong total.',
    solusiTerbaik:
      'Menggunakan `NOT EXISTS` (yang diterjemahkan optimizer menjadi Hash/Merge Anti-Join efisien dan aman terhadap `NULL`)—atau menyaring `WHERE d.nik IS NOT NULL` jika terpaksa memakai `NOT IN`—menjamin ketepatan logika dan performa.',
    analisisPengecoh:
      'PostgreSQL/MySQL tidak otomatis mengembalikan 0 baris pada batas 1.000 elemen subquery; sensitivitas huruf bergantung kolasi bukan `NOT IN` vs `NOT EXISTS`; `p.nik` tidak wajib ada di `SELECT`; `SELECT 1` pada `EXISTS` hanya penanda keberadaan baris, bukan pengabaian baris pertama.',
  },
  {
    level: 'C6',
    topik: 'Basis Data — Desain Skema Temporal & Pencegahan Bentrok Jadwal',
    pertanyaan:
      'Aplikasi peminjaman ruang rapat instansi memiliki tabel `reservasi(id, ruang_id, waktu_mulai, waktu_selesai)`. Dua staf sering memesan ruang yang sama pada rentang jam yang saling tumpang tindih (misal 09:00–11:00 dan 10:00–12:00) secara bersamaan, sehingga validasi di aplikasi sering lolos akibat race condition. Mekanisme deklaratif di PostgreSQL yang menjamin secara mutlak tidak ada jadwal tumpang tindih untuk ruang yang sama adalah...',
    jawabanBenar:
      'Menyimpan rentang waktu dalam tipe `TSTZRANGE` dan memasang Exclusion Constraint berbasis GiST (`EXCLUDE USING GIST (ruang_id WITH =, rentang_waktu WITH &&)`) dengan ekstensi `btree_gist`.',
    pengecoh4: [
      'Memasang `UNIQUE (ruang_id, waktu_mulai, waktu_selesai)` agar kombinasi jadwal 09:00–11:00 dan 10:00–12:00 otomatis ditolak oleh database.',
      'Memasang `CHECK (waktu_selesai > waktu_mulai)` pada tabel `reservasi` karena constraint `CHECK` otomatis memeriksa irisan jadwal antar-baris berbeda.',
      'Membuat B-Tree index biasa pada `(ruang_id, waktu_mulai)` tanpa constraint agar database menolak jadwal yang bertabrakan.',
      'Mengubah tipe kolom `waktu_mulai` menjadi `VARCHAR` agar perbandingan string mencegah dua pemesanan pada hari yang sama.',
    ],
    akarMasalah:
      '`UNIQUE` biasa hanya mendeteksi kesamaan persis nilai kolom (09:00–11:00 vs 10:00–12:00 dianggap berbeda), sementara pengecekan di kode aplikasi rentan race condition antar-transaksi paralel.',
    solusiTerbaik:
      'Exclusion Constraint GiST dengan operator irisan rentang (`&&`) menegakkan larangan tumpang tindih antar-baris secara atomik pada level mesin database meskipun dua permintaan datang pada mikrodetik yang sama.',
    analisisPengecoh:
      '`UNIQUE` meloloskan irisan parsial (09–11 vs 10–12); `CHECK` hanya memvalidasi kolom dalam satu baris tunggal; B-Tree index non-unik tidak menolak data apa pun; mengubah waktu ke `VARCHAR` merusak aritmetika waktu dan tidak mencegah overlap.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Full-Text Search vs Wildcard LIKE',
    pertanyaan:
      'Portal JDIH (Jaringan Dokumentasi dan Informasi Hukum) instansi menyimpan 350.000 naskah peraturan daerah pada kolom `isi_peraturan TEXT`. Pencarian kata kunci menggunakan `WHERE isi_peraturan ILIKE \'%retribusi parkir%\'` membutuhkan 12 detik per pencarian karena melakukan Sequential Scan penuh. Solusi pencarian teks paling tepat di dalam RDBMS PostgreSQL tanpa menambah mesin terpisah adalah...',
    jawabanBenar:
      'Menambahkan kolom `tsvector` yang dihasilkan dari `to_tsvector(\'indonesian\', isi_peraturan)` beserta GIN Index, lalu mencari menggunakan operator `@@` dengan `plainto_tsquery` / `websearch_to_tsquery` serta peringkat `ts_rank`.',
    pengecoh4: [
      'Menambahkan B-Tree Index standar pada kolom `isi_peraturan` karena B-Tree mampu mempercepat pencarian pola wildcard di awal dan akhir (`%kata%`).',
      'Mengganti operator `ILIKE` menjadi `LIKE` dengan huruf kecil semua sambil tetap memakai `%retribusi parkir%` agar B-Tree Index langsung digunakan.',
      'Memecah kolom `isi_peraturan` menjadi 100 kolom `kata_1` sampai `kata_100` agar dapat dicari memakai klausa `OR` beruntun.',
      'Menyimpan seluruh 350.000 naskah ke dalam satu baris JSON besar sehingga database hanya perlu memindai satu baris saja.',
    ],
    akarMasalah:
      'Pola `ILIKE \'%...%\'` dengan leading wildcard tidak dapat memanfaatkan indeks B-Tree standar (yang hanya mendukung pencarian awalan/prefix), sehingga seluruh 350.000 dokumen teks panjang harus dipindai karakter demi karakter.',
    solusiTerbaik:
      'PostgreSQL Full-Text Search (`tsvector` + GIN Index + `tsquery`) memetakan token kata dasar (lexeme) secara terbalik (inverted index) sehingga pencarian frasa dan pemeringkatan relevansi selesai dalam milidetik.',
    analisisPengecoh:
      'B-Tree tidak bisa dipakai untuk leading wildcard `%...%` baik pada `ILIKE` maupun `LIKE`; memecah dokumen panjang ke 100 kolom melanggar normalisasi dan memotong isi peraturan; menggabung ke satu baris JSON justru memperparah beban memori dan parsing.',
  },
  {
    level: 'C5',
    topik: 'Basis Data — UUID v4 vs UUID v7 / BIGSERIAL sebagai Primary Key',
    pertanyaan:
      'Tim pengembang aplikasi pajak daerah mengganti seluruh primary key tabel transaksi berkecepatan tulis tinggi dari `BIGSERIAL` menjadi `UUID v4` (acak penuh) pada MySQL InnoDB (clustered index). Setelah 20 juta baris masuk, performa `INSERT` merosot tajam dan ukuran tabel membengkak 40% akibat fragmentasi halaman B-Tree. Evaluasi penyebab dan pilihan kunci primer terbaik bila kebutuhan sistem tetap menginginkan ID terdistribusi yang tidak mudah ditebak adalah...',
    jawabanBenar:
      'Nilai acak `UUID v4` memaksa sisipan acak ke tengah halaman B-Tree sehingga memicu page splits dan cache miss parah; solusinya memakai `UUID v7` (time-ordered) atau `ULID` yang terurut kronologis sekaligus tetap unik global.',
    pengecoh4: [
      'Kerusakan terjadi karena `UUID v4` berukuran 128-bit yang tidak didukung InnoDB; solusinya mengganti tipe kolom menjadi `VARCHAR(255)` berisi `UUID v4` acak.',
      'Masalahnya berasal dari jumlah baris 20 juta; solusinya menghapus primary key dari tabel InnoDB agar tidak ada clustered index sama sekali.',
      'Solusi terbaik adalah memakai `MD5(RAND())` sebagai primary key karena panjang hash MD5 selalu seragam sehingga bebas page splits.',
      'Solusi terbaik adalah menjalankan `OPTIMIZE TABLE` setiap 5 menit sekali di jam sibuk sambil mempertahankan `UUID v4` acak.',
    ],
    akarMasalah:
      'Pada clustered index B-Tree (seperti MySQL InnoDB), baris disimpan fisik mengikuti urutan Primary Key; `UUID v4` yang seragam acak menyisipkan data ke halaman sembarang, menyebabkan page splits berulang, fragmentasi disk, dan churn buffer pool.',
    solusiTerbaik:
      '`UUID v7` (RFC 9562) atau `ULID` menempatkan timestamp berurutan di bit paling signifikan (prefix kronologis) dan keacakan di bit akhir, sehingga sisipan baru selalu mengarah ke ujung kanan B-Tree (append-mostly) sekaligus menjaga keunikan terdistribusi.',
    analisisPengecoh:
      'Menyimpan `UUID v4` sebagai `VARCHAR(255)` justru memperbesar ukuran kunci dan tetap acak; InnoDB tetap membuat hidden clustered index 6-byte bila PK dihapus; `MD5(RAND())` sama acaknya dengan UUID v4; `OPTIMIZE TABLE` tiap 5 menit memicu beban I/O dan lock parah.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Memahami ACID: Atomicity vs Isolation vs Durability',
    pertanyaan:
      'Dalam proses pencairan hibah daerah, satu blok transaksi melakukan (1) pemotongan saldo pos anggaran induk dan (2) penambahan saldo rekening penerima. Tepat 2 milidetik setelah database mengirim konfirmasi `COMMIT` ke aplikasi, pasokan listrik server padam mendadak. Ketika server menyala kembali, saldo pos anggaran dan saldo penerima tetap tercatat lengkap sesuai transaksi terakhir yang sudah di-commit. Properti ACID dan mekanisme internal database yang paling berperan menjamin kondisi tersebut adalah...',
    jawabanBenar:
      'Properti **Durability**, yang dijamin melalui mekanisme Write-Ahead Logging (WAL / Redo Log) di mana catatan perubahan transaksi wajib diflush ke penyimpanan non-volatil sebelum `COMMIT` dikonfirmasi, lalu dipulihkan (crash recovery) saat startup.',
    pengecoh4: [
      'Properti **Isolation**, yang dijamin melalui Row-Level Locking sehingga tidak ada transaksi lain yang dapat mematikan listrik server.',
      'Properti **Consistency**, yang dijamin semata-mata melalui `CHECK` constraint tanpa memerlukan penulisan log ke disk sebelum `COMMIT`.',
      'Properti **Atomicity**, yang bekerja dengan menyimpan seluruh data transaksi hanya di RAM buffer pool sampai server dimatikan secara normal.',
      'Properti **Availability**, yang dijamin melalui protokol DNS Round-Robin ketika server database kehilangan daya.',
    ],
    akarMasalah:
      'Halaman data (data pages) di memori sering ditulis secara tertunda ke file tabel utama demi performa; tanpa mekanisme log persisten sebelum konfirmasi `COMMIT`, pemadaman listrik akan melenyapkan transaksi yang sudah dinyatakan sukses.',
    solusiTerbaik:
      'Durability melalui Write-Ahead Logging (WAL) memastikan catatan redo telah tersimpan aman di disk (fsync) sebelum `COMMIT` kembali ke klien, sehingga crash recovery memutar ulang log secara otomatis saat server aktif kembali.',
    analisisPengecoh:
      'Isolation mengatur isolasi antar-transaksi konkuren bukan ketahanan crash; Consistency memastikan aturan integritas data bukan persistensi pasca-listrik padam; Atomicity mengatur all-or-nothing dan tidak mengandalkan RAM volatil; Availability bukan bagian dari akronim ACID.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — GROUP BY, HAVING & Filter Efisiensi',
    pertanyaan:
      'Seorang analis kinerja menyusun query untuk melihat daftar dinas di Provinsi Jawa Tengah yang total anggaran belanjanya tahun 2025 melebihi Rp10 miliar:\n```sql\nSELECT d.nama_dinas, SUM(b.nilai) AS total_belanja\nFROM belanja b\nJOIN dinas d ON d.id = b.dinas_id\nGROUP BY d.id, d.nama_dinas, b.tahun, d.provinsi\nHAVING b.tahun = 2025\n   AND d.provinsi = \'Jawa Tengah\'\n   AND SUM(b.nilai) > 10000000000;\n```\nQuery berjalan sangat lambat karena mengagregasi data dari seluruh 38 provinsi dan 10 tahun anggaran terlebih dahulu sebelum menyaring. Evaluasi perbaikan SQL yang benar secara logika dan performa adalah...',
    jawabanBenar:
      'Memindahkan predikat non-agregat `b.tahun = 2025` dan `d.provinsi = \'Jawa Tengah\'` ke klausa `WHERE` (sebelum `GROUP BY`), sementara `HAVING` cukup menyaring hasil agregasi `SUM(b.nilai) > 10000000000`.',
    pengecoh4: [
      'Memindahkan seluruh kondisi termasuk `SUM(b.nilai) > 10000000000` ke dalam klausa `WHERE` lalu menghapus klausa `HAVING` dan `GROUP BY`.',
      'Mempertahankan seluruh filter di `HAVING` tetapi menambahkan `ORDER BY total_belanja DESC` agar mesin database melewati baris tahun selain 2025.',
      'Mengganti `JOIN` menjadi `RIGHT OUTER JOIN` agar baris selain Jawa Tengah otomatis bernilai `NULL` sebelum `GROUP BY`.',
      'Mengubah `SUM(b.nilai)` menjadi `COUNT(b.nilai)` di klausa `HAVING` agar proses agregasi memakai memori lebih kecil.',
    ],
    akarMasalah:
      'Menaruh filter baris biasa (`tahun`, `provinsi`) di `HAVING` dan memasukkannya ke `GROUP BY` memperbesar kardinalitas grup dan menghambat penyaringan dini memakai indeks sebelum agregasi dilakukan.',
    solusiTerbaik:
      'Menyaring `b.tahun = 2025` dan `d.provinsi = \'Jawa Tengah\'` di `WHERE` memangkas 95%+ baris sejak awal (memanfaatkan indeks), sehingga `GROUP BY` dan `HAVING SUM(b.nilai) > ...` hanya mengolah sebagian kecil data relevan.',
    analisisPengecoh:
      'Fungsi agregat (`SUM(...)`) secara sintaksis ilegal di dalam klausa `WHERE`; `ORDER BY` dieksekusi paling akhir setelah `HAVING`; `RIGHT JOIN` justru berpotensi menambah baris tak cocok; `COUNT` mengubah makna bisnis dari total rupiah menjadi jumlah baris.',
  },
  {
    level: 'C6',
    topik: 'Basis Data — Optimistic vs Pessimistic Locking pada Dokumen Verifikasi',
    pertanyaan:
      'Aplikasi verifikasi berkas CPNS memiliki 300 verifikator yang membuka halaman detail berkas dan menghabiskan rata-rata 4 menit membaca pindaian ijazah sebelum menekan tombol "Setujui" atau "Tolak". Pengembang mempertimbangkan menahan `SELECT ... FOR UPDATE` selama 4 menit tersebut sejak halaman dibuka hingga tombol diklik. Evaluasi arsitektur penguncian yang paling tepat adalah...',
    jawabanBenar:
      'Menahan transaksi database dan `FOR UPDATE` selama interaksi manusia 4 menit akan menguras connection pool dan memicu lock contention; solusinya memakai Optimistic Locking (kolom `version` pada `UPDATE ... WHERE id = ? AND version = ?`) atau kolom klaim tugas ber-TTL (`locked_by`, `lock_expires_at`).',
    pengecoh4: [
      'Menahan `SELECT ... FOR UPDATE` selama 4 menit dalam satu transaksi HTTP adalah best practice karena menjamin durasi koneksi database tetap konsisten.',
      'Solusi terbaik adalah memakai `LOCK TABLE berkas IN EXCLUSIVE MODE` setiap kali seorang verifikator membuka satu berkas agar seluruh 299 verifikator lain menunggu.',
      'Solusi terbaik adalah membiarkan tanpa mekanisme locking maupun kolom versi karena konflik antar-verifikator dapat diselesaikan dengan memilih pembaruan terakhir (Last-Write-Wins).',
      'Solusi terbaik adalah menaikkan `statement_timeout` database menjadi 1 jam agar 300 transaksi panjang tetap aktif sepanjang jam kerja.',
    ],
    akarMasalah:
      'Transaksi database yang dibiarkan terbuka mengikuti waktu pikir manusia ("long-running user transaction") mengikat koneksi fisik pool, menahan snapshot MVCC, dan rentan menggantung bila browser pengguna ditutup mendadak.',
    solusiTerbaik:
      'Optimistic Locking (memeriksa kecocokan `version` saat commit singkat) atau mekanisme application-level lease/claim (`assigned_to` + `lease_until` berbatas waktu) menjaga transaksi DB tetap milidetik sekaligus mencegah dua verifikator menimpa keputusan satu sama lain.',
    analisisPengecoh:
      'Transaksi DB selama 4 menit melumpuhkan pool koneksi dan autovacuum; `LOCK TABLE` memblokir seluruh verifikator lain pada berkas berbeda; Last-Write-Wins diam-diam menimpa hasil verifikasi sah; menaikkan timeout ke 1 jam memperparah kebocoran sumber daya.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Data Type Precision pada Sistem Keuangan Negara',
    pertanyaan:
      'Sebuah aplikasi akuntansi PNBP menyimpan nilai transaksi rupiah menggunakan tipe data `FLOAT` / `DOUBLE PRECISION` (IEEE 754 floating-point). Pada rekonsiliasi akhir tahun atas 2 juta transaksi, ditemukan selisih pembulatan sebesar Rp47,83 antara total jurnal rincian dan neraca saldo padahal tidak ada transaksi yang hilang. Penyebab teknis dan perbaikan tipe data yang wajib diterapkan adalah...',
    jawabanBenar:
      'Tipe floating-point biner (`FLOAT`/`DOUBLE`) tidak dapat merepresentasikan pecahan desimal tertentu secara eksak sehingga menimbulkan akumulasi galat pembulatan; solusinya menggunakan tipe fixed-point eksak `NUMERIC(18, 2)` / `DECIMAL(18, 2)` atau integer satuan terkecil (sen).',
    pengecoh4: [
      'Selisih muncul karena fungsi `SUM()` di SQL membulatkan setiap angka ganjil ke bawah; solusinya mengganti tipe kolom menjadi `REAL` (32-bit float) agar lebih cepat.',
      'Selisih muncul karena ukuran kolom kurang lebar; solusinya menyimpan nominal keuangan sebagai `VARCHAR(50)` lalu menjumlahkannya lewat casting ke `FLOAT`.',
      'Selisih muncul karena isolation level database terlalu tinggi; solusinya menjalankan rekonsiliasi menggunakan `READ UNCOMMITTED`.',
      'Selisih muncul karena indeks B-Tree mengubah nilai pecahan; solusinya menghapus seluruh indeks pada kolom nominal transaksi.',
    ],
    akarMasalah:
      'Bilangan floating-point biner IEEE 754 merepresentasikan nilai berbasis pangkat 2, sehingga angka desimal seperti `0.1` atau `0.01` hanya berupa aproksimasi yang galatnya terakumulasi dalam jutaan operasi penjumlahan.',
    solusiTerbaik:
      'Tipe `NUMERIC(p, s)` / `DECIMAL(p, s)` menyimpan digit desimal secara eksak (base-10) sehingga seluruh operasi penjumlahan, pengurangan, dan perpajakan keuangan negara 100% presisi tanpa galat representasi biner.',
    analisisPengecoh:
      '`REAL` (32-bit) memiliki presisi lebih buruk lagi daripada `DOUBLE`; menyimpan sebagai `VARCHAR` lalu cast ke `FLOAT` tetap kembali ke galat floating-point; isolation level dan indeks B-Tree tidak mengubah representasi aritmetika pecahan.',
  },
  {
    level: 'C5',
    topik: 'Basis Data — Trigger Berantai vs Logika Aplikasi & Maintainability',
    pertanyaan:
      'Pada database sistem kepegawaian lama, terdapat 28 trigger bertingkat (`AFTER INSERT/UPDATE`) yang saling memicu antar-tabel, bahkan beberapa trigger memanggil ekstensi eksternal untuk mengirim email notifikasi. Akibatnya, perbaikan bug sangat sulit dilacak, proses migrasi data massal sering memicu ratusan email tak sengaja, dan latensi `UPDATE` melonjak. Evaluasi rekayasa ulang yang paling bijak adalah...',
    jawabanBenar:
      'Memindahkan alur bisnis kompleks dan efek samping eksternal (email/notifikasi) keluar dari trigger ke lapisan domain service/event outbox aplikasi yang mudah diuji, serta membatasi trigger hanya untuk kebutuhan integritas/audit ringan yang benar-benar diperlukan.',
    pengecoh4: [
      'Menambah lebih banyak trigger baru untuk menangkap dan membatalkan email yang terkirim oleh trigger lama agar tidak perlu menyentuh kode aplikasi.',
      'Memindahkan seluruh kode frontend dan validasi sesi login ke dalam trigger database supaya seluruh logika terpusat di satu tempat.',
      'Menonaktifkan seluruh foreign key dan mengganti seluruh validasi relasional dengan trigger manual berantai.',
      'Membiarkan pengiriman email tetap sinkron di dalam trigger database tetapi mengubah timeout SMTP menjadi 1 milidetik.',
    ],
    akarMasalah:
      'Trigger tersembunyi berantai membuat alur eksekusi implisit sulit di-debug dan di-unit-test, sementara panggilan jaringan (SMTP) di dalam trigger memperpanjang durasi transaksi dan lock database serta memicu efek samping saat bulk maintenance.',
    solusiTerbaik:
      'Mengembalikan orkestrasi bisnis dan notifikasi asinkron ke lapisan aplikasi (mis. Transactional Outbox) menjamin observabilitas, kemudahan pengujian otomatis, dan performa transaksi, sembari menjaga integritas inti lewat constraint deklaratif.',
    analisisPengecoh:
      'Menambah trigger di atas trigger memperparah kompleksitas tak terlihat; validasi UI/sesi bukan domain database; constraint deklaratif jauh lebih aman dan cepat daripada trigger manual; timeout 1 ms membuat seluruh email gagal total.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Analisis Query Slow Log & Implicit Type Casting',
    pertanyaan:
      'Tabel `penduduk` (10 juta baris) memiliki indeks B-Tree pada kolom `nik VARCHAR(16)`. Seorang pengembang menjalankan query berikut dari API:\n```sql\nSELECT id, nama FROM penduduk WHERE nik = 3174011205900001;\n```\n(tanpa tanda kutip, mengirim angka integer). Pada MySQL, `EXPLAIN` menunjukkan `type: ALL` (Full Table Scan) dan memakan waktu 6 detik, padahal `nik` terindeks. Akar masalah teknis yang terjadi adalah...',
    jawabanBenar:
      'Terjadi Implicit Type Conversion di mana mesin database mengonversi setiap nilai kolom `nik` (`VARCHAR`) menjadi angka floating-point/integer untuk dicocokkan dengan literal numerik, sehingga indeks B-Tree pada string `nik` tidak dapat digunakan.',
    pengecoh4: [
      'Angka `3174011205900001` terlalu panjang untuk dibandingkan di SQL sehingga query otomatis melompati indeks dan memilih baris acak.',
      'Indeks B-Tree pada kolom `VARCHAR(16)` hanya bekerja apabila klausa `WHERE` menggunakan operator `LIKE` bukan operator `=`.',
      'Klausa `SELECT id, nama` tidak boleh dijalankan pada tabel 10 juta baris tanpa menyertakan klausa `ORDER BY nik`.',
      'Driver database otomatis menonaktifkan indeks setiap kali kolom bernama `nik` dicari tanpa enkripsi MD5.',
    ],
    akarMasalah:
      'Ketidakcocokan tipe antara kolom `VARCHAR` dan literal numerik memicu implicit cast pada kolom sisi kiri (`CAST(nik AS DOUBLE) = ...`), yang menjadikannya non-SARGable dan melumpuhkan pemakaian indeks string B-Tree.',
    solusiTerbaik:
      'Selalu mengirim parameter sesuai tipe kolom (`WHERE nik = \'3174011205900001\'` melalui Prepared Statement bertipe string) sehingga perbandingan memakai tipe seragam dan langsung mengeksekusi Index Lookup dalam sub-milidetik.',
    analisisPengecoh:
      'Integer 16 digit masih muat pada 64-bit integer dan bukan penyebab acaknya hasil; operator `=` justru ideal bagi B-Tree; `ORDER BY` tidak diperlukan untuk mengaktifkan indeks `WHERE`; nama kolom tidak memengaruhi aktivasi indeks.',
  },
  {
    level: 'C6',
    topik: 'Basis Data — Transactional Outbox Pattern untuk Konsistensi Layanan',
    pertanyaan:
      'Saat pemohon menyelesaikan pendaftaran dokumen, layanan A harus (1) menyimpan status `TERDAFTAR` ke database PostgreSQL dan (2) mengirim event ke Apache Kafka agar layanan B menerbitkan sertifikat digital. Jika kode melakukan `DB.commit()` lalu `kafka.publish()`, server bisa crash tepat di antara kedua langkah sehingga data tersimpan di DB tetapi event tidak pernah terkirim (Dual-Write Problem). Pola desain database yang paling andal menyelesaikan masalah ini adalah...',
    jawabanBenar:
      'Menerapkan **Transactional Outbox Pattern**: menyimpan perubahan tabel bisnis sekaligus baris event ke tabel `outbox_events` dalam satu transaksi ACID lokal yang sama, lalu relay/CDC (seperti Debezium) memublikasikan event tersebut ke Kafka secara at-least-once.',
    pengecoh4: [
      'Membalik urutan menjadi `kafka.publish()` terlebih dahulu baru `DB.commit()` agar event pasti sampai ke layanan B meskipun penyimpanan database gagal rollback.',
      'Menghapus transaksi database dan menjalankan `DB.insert()` dan `kafka.publish()` secara paralel memakai `Promise.all` tanpa penanganan gagal.',
      'Meminta pengguna mengklik tombol "Kirim Ulang Event Kafka" secara manual apabila sertifikat digital belum terbit dalam 10 menit.',
      'Menyatukan broker Kafka ke dalam tabel memori sementara (`TEMP TABLE`) PostgreSQL agar tidak ada proses terpisah.',
    ],
    akarMasalah:
      'Menulis ke dua sistem terdistribusi independen (PostgreSQL dan Kafka) tanpa koordinasi atomik menciptakan celah kegagalan parsial (Dual-Write Problem) yang menyebabkan inkonsistensi antar-layanan.',
    solusiTerbaik:
      'Transactional Outbox memanfaatkan atomisitas transaksi ACID lokal untuk menjamin baris data dan catatan event selalu commit atau rollback bersama, lalu proses relay/CDC meneruskannya ke Kafka (dipadukan dengan konsumer idempoten di layanan B).',
    analisisPengecoh:
      'Membalik urutan tetap rentan dual-write (event terkirim padahal DB gagal commit, menghasilkan sertifikat hantu); `Promise.all` memperbesar risiko kegagalan parsial; membebankan retry ke pengguna merusak keandalan sistem; `TEMP TABLE` hilang saat sesi berakhir.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Membedakan Union vs Union All & Optimasi Agregasi',
    pertanyaan:
      'Tim data menggabungkan data transaksi dari dua tabel arsip tahun berbeda (`transaksi_2024` dan `transaksi_2025`, masing-masing 5 juta baris, yang secara definisi tidak mungkin memiliki `id` tumpang tindih) untuk keperluan rekapitulasi:\n```sql\nSELECT id, unit_id, nominal FROM transaksi_2024\nUNION\nSELECT id, unit_id, nominal FROM transaksi_2025;\n```\nQuery tersebut memakan memori temp disk sangat besar dan lambat hingga 25 detik. Mengapa performa turun drastis dan optimasi sederhana yang paling tepat adalah...',
    jawabanBenar:
      'Operator `UNION` secara implisit melakukan operasi deduplikasi (`Sort/HashAggregate DISTINCT`) pada seluruh 10 juta baris; karena kedua tahun sudah pasti saling lepas, menggantinya menjadi `UNION ALL` menghapus beban deduplikasi sepenuhnya.',
    pengecoh4: [
      'Operator `UNION` membatasi hasil maksimal 1 juta baris; menggantinya menjadi `INTERSECT` akan menggabungkan seluruh 10 juta baris lebih cepat.',
      'Query lambat karena kolom `nominal` tidak dimasukkan ke klausa `GROUP BY`; menambahkan `GROUP BY id, unit_id, nominal` akan mencegah pemakaian temp disk.',
      'Operator `UNION` selalu menjalankan `CROSS JOIN` antar-tabel sebelum digabungkan; solusinya mengganti menjadi `FULL OUTER JOIN`.',
      'Penyebabnya adalah dua tabel tidak boleh digabung dalam satu query; solusinya mengekspor keduanya ke file teks lalu menggabungnya dengan skrip shell.',
    ],
    akarMasalah:
      'Perbedaan mendasar `UNION` vs `UNION ALL` adalah `UNION` wajib mencari dan membuang baris duplikat lintas kedua himpunan, yang pada 10 juta baris memaksa operasi sort atau hash table raksasa yang tumpah ke disk (disk spill).',
    solusiTerbaik:
      'Karena himpunan transaksi 2024 dan 2025 sudah pasti disjoint (bebas duplikasi), `UNION ALL` langsung mengalirkan baris dari kedua tabel secara streaming ($O(N)$ tanpa sort/hash deduplikasi), menurunkan waktu eksekusi dan memori drastis.',
    analisisPengecoh:
      '`INTERSECT` mengambil irisan (hasilnya 0 baris) bukan gabungan; `GROUP BY` justru melakukan deduplikasi berat yang sama; `FULL OUTER JOIN` menggabung kolom menyamping bukan baris vertikal; ekspor ke shell bukan solusi query database.',
  },
  {
    level: 'C5',
    topik: 'Basis Data — Row-Level Security (RLS) untuk Aplikasi Multi-Tenant Daerah',
    pertanyaan:
      'Satu aplikasi SPBE bersama digunakan oleh 34 pemerintah provinsi pada satu database PostgreSQL yang sama (kolom `provinsi_id` pada tiap tabel). Audit menemukan risiko tinggi: apabila seorang pengembang lupa menambahkan `WHERE provinsi_id = ?` pada satu endpoint laporan, data rahasia seluruh provinsi lain langsung bocor. Mekanisme pertahanan mendalam (defense-in-depth) paling efektif di lapisan basis data adalah...',
    jawabanBenar:
      'Mengaktifkan **Row-Level Security (RLS)** pada tabel multi-tenant dengan kebijakan `USING (provinsi_id = current_setting(\'app.current_provinsi_id\')::int)` dan menetapkan variabel sesi per transaksi melalui role aplikasi non-superuser.',
    pengecoh4: [
      'Membuat satu akun `SUPERUSER` bersama untuk seluruh aplikasi lalu cukup menuliskan pengingat komentar `// jangan lupa WHERE provinsi_id` di setiap file kode.',
      'Mengandalkan penyaringan `provinsi_id` di sisi JavaScript frontend browser setelah backend mengirim seluruh data 34 provinsi dalam JSON.',
      'Menyembunyikan kolom `provinsi_id` dari hasil `SELECT` agar pengguna tidak mengetahui data yang bocor berasal dari provinsi mana.',
      'Menjalankan `REVOKE SELECT` pada seluruh tabel sehingga tidak ada satu pun provinsi yang bisa membaca datanya sendiri.',
    ],
    akarMasalah:
      'Mengandalkan kedisiplinan pengembang secara manual di setiap query rentan human error (celah Broken Access Control / lintas-tenant data leak).',
    solusiTerbaik:
      'PostgreSQL Row-Level Security (RLS) menegakkan isolasi baris secara otomatis pada level mesin database bagi setiap query yang dijalankan role aplikasi non-bypassrls, sehingga kelalaian klausa `WHERE` di aplikasi tidak pernah membocorkan data tenant lain.',
    analisisPengecoh:
      'Akun `SUPERUSER` melewati seluruh kebijakan RLS dan komentar kode bukan kontrol keamanan; filter di frontend tetap mengirim data bocor lewat respons jaringan; menyembunyikan kolom tidak menghentikan kebocoran isi data; mencabut seluruh `SELECT` melumpuhkan aplikasi.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Diagnosis Lock Wait & Blocking Query di Produksi',
    pertanyaan:
      'Tiba-tiba seluruh permintaan pembaruan profil pegawai pada portal ASN macet (timeout) selama 10 menit, sementara operasi baca ringan masih berjalan sebagian. Saat DBA memeriksa `pg_stat_activity` dan `pg_locks`, terlihat pola berikut:\n```text\nPID 2104 | state: active  | query: ALTER TABLE pegawai ADD COLUMN npwp_baru TEXT DEFAULT \'-\'; -- waiting AccessExclusiveLock\nPID 1982 | state: active  | query: SELECT ... FROM pegawai ... (laporan tahunan berjalan 12 menit) -- holds AccessShareLock\nPID 2105..2250 | waiting: AccessShareLock / RowExclusiveLock on pegawai\n```\nAnalisis rantai pemblokiran (Lock Queue) yang tepat dan tindakan mitigasi segera yang aman adalah...',
    jawabanBenar:
      'Query laporan panjang (PID 1982) menahan `AccessShareLock`, memblokir `ALTER TABLE` (PID 2104) yang meminta `AccessExclusiveLock`, sehingga antrean lock berikutnya (PID 2105..2250) seluruhnya ikut terblokir di belakang `ALTER TABLE`; solusinya membatalkan sementara `ALTER TABLE` (dan memakai `lock_timeout` rendah saat DDL) serta memindahkan laporan berat ke Read Replica.',
    pengecoh4: [
      'Operasi `SELECT` di PostgreSQL tidak pernah mengambil lock apa pun sehingga PID 1982 tidak berhubungan dengan kemacetan PID 2104.',
      'Solusi tercepat adalah me-restart paksa server fisik database agar seluruh tabel `pegawai` terhapus lock-nya tanpa memeriksa penyebab antrean.',
      'Kemacetan terjadi karena `ADD COLUMN` membutuhkan penulisan ulang seluruh tabel pada PostgreSQL modern; solusinya menaikkan RAM server.',
      'PID 2105..2250 macet karena jumlah baris tabel `pegawai` melebihi 1 juta; solusinya langsung memutus koneksi seluruh pengguna layanan aktif.',
    ],
    akarMasalah:
      'Pada antrean lock PostgreSQL, ketika DDL (`ALTER TABLE`) menunggu `AccessExclusiveLock` karena ada `SELECT` panjang (`AccessShareLock`), seluruh transaksi `SELECT/UPDATE` baru yang datang sesudahnya ikut mengantre di belakang DDL tersebut (Lock Queue Cascade).',
    solusiTerbaik:
      'Segera `pg_cancel_backend(2104)` untuk membuka sumbatan antrean layanan, selalu set `SET lock_timeout = \'2s\'` sebelum eksekusi DDL produksi agar gagal cepat bila terhalang, dan pisahkan query analitik panjang ke Read Replica.',
    analisisPengecoh:
      '`SELECT` memang mengambil `AccessShareLock` yang berkonflik dengan `AccessExclusiveLock`; restart paksa memicu downtime penuh dan crash recovery; di PostgreSQL 11+, `ADD COLUMN ... DEFAULT` konstanta adalah operasi metadata cepat, masalah utamanya adalah antrean lock bukan rewrite tabel; memutus seluruh pengguna merugikan layanan.',
  },
  {
    level: 'C6',
    topik: 'Basis Data — Desain Audit Log Anti-Ubah (Tamper-Evident)',
    pertanyaan:
      'Sistem perbendaharaan negara mewajibkan tabel `audit_log_keuangan` bersifat append-only (hanya boleh `INSERT`, dilarang `UPDATE/DELETE` oleh akun aplikasi) serta dapat mendeteksi apabila ada oknum administrator internal yang mencoba mengubah satu baris nominal transaksi historis secara langsung di database. Rancangan arsitektur audit yang paling tangguh adalah...',
    jawabanBenar:
      'Mencabut hak `UPDATE/DELETE` dari role aplikasi, menerapkan hash chaining kriptografis (`row_hash = SHA256(prev_hash || payload)`) per baris, serta mengalirkan salinan log secara real-time ke penyimpanan WORM (Write-Once-Read-Many) terpisah yang tidak dikuasai DBA aplikasi.',
    pengecoh4: [
      'Cukup menambahkan kolom `updated_at` pada tabel `audit_log_keuangan` agar auditor dapat melihat jam berapa oknum mengubah isi log.',
      'Menyembunyikan tombol "Edit" dan "Hapus" pada halaman web admin tanpa mengubah hak akses akun database maupun mekanisme integritas baris.',
      'Menyimpan salinan tabel `audit_log_keuangan` ke tabel kedua di skema database yang sama dengan hak akses superuser yang sama.',
      'Mengenkripsi kolom `catatan` dengan Base64 agar tidak ada administrator yang dapat membaca atau memodifikasi teks log.',
    ],
    akarMasalah:
      'Pembatasan hak akses di aplikasi saja tidak melindungi log dari insider threat (DBA/superuser) yang dapat langsung mengeksekusi `UPDATE/DELETE` di database tanpa meninggalkan bukti manipulasi.',
    solusiTerbaik:
      'Kombinasi least-privilege (`INSERT`-only role), cryptographic hash chain (setiap perubahan satu baris memutus validitas seluruh rantai hash setelahnya), dan replikasi ke WORM storage terpisah (separation of duties) menjamin sifat tamper-evident dan non-repudiation.',
    analisisPengecoh:
      'Oknum dengan akses DB bisa ikut memalsukan `updated_at`; menyembunyikan tombol UI tidak membatasi akses SQL langsung; salinan di DB/hak akses yang sama bisa diubah bersamaan; Base64 hanyalah encoding yang mudah didekode dan diubah balik.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Denormalisasi Counter Cache & Konsistensi',
    pertanyaan:
      'Halaman utama portal pengaduan publik menampilkan total jumlah laporan masuk pada 50 kategori. Tabel `pengaduan` memiliki 12 juta baris, dan menjalankan `SELECT kategori_id, COUNT(*) FROM pengaduan GROUP BY kategori_id` di setiap pembukaan halaman menyebabkan beban CPU tinggi. Jika tim ingin menjaga angka ringkasan tetap hampir instan sekaligus akurat, strategi terbaik adalah...',
    jawabanBenar:
      'Menyediakan tabel ringkasan/counter teragregasi yang diperbarui secara berkala melalui materialized view atau event asinkron dengan caching TTL singkat (mis. Redis 30–60 detik), alih-alih menjalankan `COUNT(*)` penuh 12 juta baris per permintaan HTTP.',
    pengecoh4: [
      'Menjalankan `SELECT * FROM pengaduan` di setiap request lalu menghitung `rows.length` di kode JavaScript backend agar CPU database tidak menjalankan `COUNT(*)`.',
      'Menghapus seluruh data pengaduan yang berusia lebih dari 7 hari supaya jumlah baris selalu kecil saat dihitung `COUNT(*)`.',
      'Membuat 50 tabel terpisah lalu menjalankan `LOCK TABLE` seluruh 50 tabel setiap kali seorang warga membuka halaman utama.',
      'Mengganti `COUNT(*)` menjadi `COUNT(DISTINCT isi_laporan)` agar database hanya menghitung laporan yang teksnya berbeda.',
    ],
    akarMasalah:
      'Pada PostgreSQL MVCC, `COUNT(*)` atas jutaan baris harus memindai banyak halaman tabel/indeks karena visibilitas tiap baris bergantung transaksi; menjalankannya per request HTTP sangat boros sumber daya.',
    solusiTerbaik:
      'Memanfaatkan prakomputasi (tabel ringkasan/materialized view) dikombinasikan dengan cache TTL singkat memangkas ribuan scan jutaan baris menjadi pembacaan O(1) berlatensi milidetik dengan akurasi sangat tinggi.',
    analisisPengecoh:
      'Mengirim 12 juta baris lewat jaringan ke JS backend langsung menyebabkan OOM crash; menghapus laporan berusia >7 hari melanggar retensi data publik; `LOCK TABLE` melumpuhkan akses bersamaan; `COUNT(DISTINCT teks)` jauh lebih lambat dari `COUNT(*)`.',
  },
  {
    level: 'C5',
    topik: 'Basis Data — Memilih Strategi Soft Delete & Unique Index',
    pertanyaan:
      'Sistem kepegawaian menerapkan Soft Delete (`deleted_at TIMESTAMP NULL`) pada tabel `akun_pengguna` yang memiliki `UNIQUE (email)`. Masalah muncul ketika seorang pegawai keluar (akunnya di-soft-delete dengan `deleted_at = \'2025-03-01\'`), lalu setahun kemudian ia mendaftar kembali menggunakan email yang sama—database menolak `INSERT` karena melanggar `UNIQUE (email)`. Perancangan indeks yang paling tepat di PostgreSQL adalah...',
    jawabanBenar:
      'Mengganti `UNIQUE (email)` global menjadi Partial Unique Index `CREATE UNIQUE INDEX uq_akun_email_aktif ON akun_pengguna (email) WHERE deleted_at IS NULL;` sehingga keunikan email hanya ditegakkan pada akun aktif.',
    pengecoh4: [
      'Menghapus seluruh constraint keunikan pada kolom `email` dan hanya memeriksa duplikasi melalui validasi form di frontend.',
      'Mengganti constraint menjadi `UNIQUE (email, deleted_at)` karena di SQL standar dua baris dengan `deleted_at = NULL` selalu otomatis dianggap duplikat dan ditolak.',
      'Menimpa email pegawai yang keluar dengan string acak `deleted_123@invalid` tanpa menyimpan histori email lamanya sama sekali.',
      'Mengubah strategi menjadi Hard Delete permanen meskipun seluruh log transaksi historis pegawai tersebut masih merujuk `akun_pengguna.id`.',
    ],
    akarMasalah:
      '`UNIQUE (email)` tanpa kondisi menyertakan baris yang sudah di-soft-delete sehingga mencegah pendaftaran ulang dengan email sama; sementara di SQL standar, `UNIQUE (email, deleted_at)` justru mengizinkan banyak baris aktif dengan `(email, NULL)` karena `NULL <> NULL`!',
    solusiTerbaik:
      'Partial Unique Index `WHERE deleted_at IS NULL` memastikan secara atomik hanya ada maksimal satu akun aktif untuk setiap email, sekaligus mengizinkan berapa pun riwayat akun lama yang sudah terhapus (`deleted_at IS NOT NULL`) tetap utuh.',
    analisisPengecoh:
      'Menghapus unique constraint membuka race condition akun ganda; `UNIQUE (email, deleted_at)` pada SQL default (`NULLS DISTINCT`) justru meloloskan duplikat akun aktif dengan `deleted_at = NULL`; menimpa email merusak jejak audit; hard delete merusak integritas referensial historis.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Execution Plan: Nested Loop vs Hash Join pada Data Besar',
    pertanyaan:
      'DBA memeriksa query rekonsiliasi dua tabel besar tanpa filter selektif (`tabel_a` 2 juta baris dan `tabel_b` 1,5 juta baris). Hasil `EXPLAIN ANALYZE` menunjukkan planner memilih `Nested Loop Join` dengan estimasi `rows=10` (padahal aktualnya `rows=1.800.000`), sehingga query macet selama 15 menit. Penyebab utama kesalahan pilihan algoritma join oleh optimizer dan perbaikan cepatnya adalah...',
    jawabanBenar:
      'Statistik tabel (`pg_statistic`) sudah sangat usang pasca-impor massal sehingga optimizer salah mengira kardinalitas kecil dan memilih `Nested Loop`; solusinya menjalankan `ANALYZE` pada kedua tabel agar statistik akurat dan planner beralih ke `Hash Join` / `Merge Join`.',
    pengecoh4: [
      '`Nested Loop Join` memang satu-satunya algoritma join yang tersedia di RDBMS modern untuk menggabungkan tabel di atas 1 juta baris.',
      'Kesalahan terjadi karena urutan tabel pada klausa `FROM` terbalik; membalik `tabel_a` dan `tabel_b` selalu otomatis mengubah `Nested Loop` menjadi `Hash Join` meski statistik usang.',
      'Planner salah karena `work_mem` disetel terlalu besar; menurunkan `work_mem` menjadi 64 KB akan memaksa `Hash Join` berjalan jauh lebih cepat.',
      'Kesalahan terjadi karena kedua tabel memiliki primary key bertipe `BIGINT`; mengubah keduanya menjadi `TEXT` akan memperbaiki estimasi baris.',
    ],
    akarMasalah:
      'Cost-Based Optimizer bergantung pada statistik distribusi data untuk mengestimasi jumlah baris; estimasi yang meleset jauh (`rows=10` vs aktual `1,8 juta`) menyesatkan planner memilih `Nested Loop` ($O(N \times M)$) alih-alih `Hash Join` ($O(N + M)$).',
    solusiTerbaik:
      'Menjalankan `ANALYZE` (dan menyetel ambang `autovacuum_analyze_scale_factor` lebih responsif) memperbarui statistik kardinalitas/histogram sehingga optimizer langsung memilih `Hash Join` atau `Merge Join` yang menuntaskan query dalam beberapa detik.',
    analisisPengecoh:
      'RDBMS modern menyediakan `Nested Loop`, `Hash Join`, dan `Merge Join`; membalik urutan `FROM` pada inner join tidak memperbaiki estimasi statistik yang usang; menurunkan `work_mem` terlalu kecil justru memaksa disk spill atau menghindari `Hash Join`; mengubah `BIGINT` ke `TEXT` memperburuk performa.',
  },
  {
    level: 'C6',
    topik: 'Basis Data — Enkripsi Kolom Sensitif & Pencarian Exact Match (Blind Index)',
    pertanyaan:
      'Sesuai UU PDP, tabel `warga_rentan` mewajibkan kolom `nik` dienkripsi pada level aplikasi memakai AES-256-GCM dengan nonce/IV acak per baris sehingga ciphertext setiap baris berbeda. Namun petugas loket tetap perlu mencari data warga berdasarkan pencarian tepat `nik` dalam hitungan milidetik tanpa mendekripsi seluruh 5 juta baris di aplikasi. Pola desain basis data kriptografis yang paling tepat adalah...',
    jawabanBenar:
      'Menambahkan kolom **Blind Index** (`nik_hmac`) berisi hasil `HMAC-SHA256(secret_pepper, nik)` yang deterministik dan diberi B-Tree Index, sehingga pencarian exact match mencocokkan `nik_hmac` secara instan lalu hanya mendekripsi baris yang cocok.',
    pengecoh4: [
      'Mengganti mode AES-256-GCM dengan AES-ECB (tanpa IV) pada seluruh kolom tabel agar blok ciphertext identik dapat dicari langsung di database.',
      'Menyimpan salinan `nik` dalam bentuk teks terang (plaintext) di kolom terpisah `nik_search` supaya indeks B-Tree tetap dapat digunakan.',
      'Menghapus enkripsi pada `nik` dan cukup menggantinya dengan encoding Base64 agar pencarian `WHERE nik = ...` bekerja normal.',
      'Mendekripsi seluruh 5 juta baris di memori server aplikasi pada setiap request pencarian lalu memfilternya dengan perulangan `Array.find`.',
    ],
    akarMasalah:
      'Enkripsi terautentikasi yang aman (AES-256-GCM dengan nonce unik) bersifat probabilistik sehingga ciphertext berbeda setiap kali dienkripsi dan tidak dapat diindeks langsung untuk pencarian `=`.',
    solusiTerbaik:
      'Pola Blind Index memakai keyed hash (`HMAC-SHA256` dengan kunci rahasia terpisah dari kunci enkripsi AES) menghasilkan token deterministik yang aman terhadap serangan rainbow table, dapat diindeks B-Tree cepat, sementara nilai asli tetap terlindungi AES-256-GCM.',
    analisisPengecoh:
      'AES-ECB membocorkan pola blok data dan rentan analisis frekuensi (tidak aman); menyimpan salinan plaintext membatalkan tujuan enkripsi; Base64 bukan enkripsi; mendekripsi 5 juta baris per request langsung melumpuhkan CPU dan memori server.',
  },
  {
    level: 'C4',
    topik: 'Basis Data — Diagnosa Dead Tuple, Bloat & Vacuum vs Vacuum Full',
    pertanyaan:
      'Sebuah tabel operasional kritis berukuran 40 GB di PostgreSQL diketahui memiliki 60% ruang kosong (bloat) akibat insiden batch update besar minggu lalu. Pimpinan meminta ruang disk segera dikembalikan ke sistem operasi tanpa menghentikan layanan transaksi warga yang aktif 24 jam. Evaluasi perintah pemeliharaan yang paling aman adalah...',
    jawabanBenar:
      'Menghindari `VACUUM FULL` (yang mengunci tabel dengan `ACCESS EXCLUSIVE` selama proses rewrite) dan menggunakan utilitas online seperti `pg_repack` (atau `VACUUM` rutin untuk pemakaian ulang ruang internal tanpa menghentikan akses baca-tulis).',
    pengecoh4: [
      'Menjalankan `VACUUM FULL` langsung pada jam layanan pagi karena perintah tersebut berjalan sepenuhnya di latar belakang tanpa memblokir `SELECT` maupun `UPDATE`.',
      'Menjalankan `TRUNCATE TABLE` lalu membiarkan layanan berjalan kosong sampai data baru masuk kembali agar bloat langsung menjadi 0%.',
      'Menghapus berkas fisik tabel di direktori `PGDATA` secara manual menggunakan `rm` saat database masih aktif untuk membebaskan 60% ruang disk.',
      'Menjalankan `ANALYZE` saja karena `ANALYZE` otomatis menulis ulang berkas fisik tabel dan mengembalikan ruang disk ke sistem operasi.',
    ],
    akarMasalah:
      '`VACUUM` standar hanya menandai ruang dead tuples agar bisa dipakai ulang oleh PostgreSQL tanpa mengecilkan ukuran file di OS, sedangkan `VACUUM FULL` mengecilkan file tetapi mengambil `ACCESS EXCLUSIVE` lock penuh yang menciptakan total downtime pada tabel 40 GB.',
    solusiTerbaik:
      '`pg_repack` membangun ulang tabel dan indeks ke salinan baru secara paralel sembari merekam perubahan inkremental melalui trigger sementara, lalu menukar tabel dalam jeda lock milidetik sehingga ruang disk kembali ke OS nyaris tanpa downtime.',
    analisisPengecoh:
      '`VACUUM FULL` justru memblokir seluruh baca dan tulis; `TRUNCATE` memusnahkan seluruh data operasional; menghapus file `PGDATA` langsung merusak database secara permanen; `ANALYZE` hanya memperbarui statistik planner dan tidak membersihkan bloat.',
  },
  {
    level: 'C5',
    topik: 'Basis Data — Konsistensi Transaksi & Idempotent Upsert pada Sinkronisasi Data',
    pertanyaan:
      'Job sinkronisasi malam hari menarik 100.000 data pembaruan status kepegawaian dari server pusat BKN ke database daerah. Jika job terputus di baris ke-64.000 akibat gangguan jaringan lalu dijalankan ulang dari awal, skrip lama gagal karena error `duplicate key value violates unique constraint` atau menggandakan baris. Rancangan query sinkronisasi yang idempoten dan tahan pengulangan adalah...',
    jawabanBenar:
      'Menggunakan perintah atomik Upsert (`INSERT INTO pegawai (...) VALUES (...) ON CONFLICT (nip) DO UPDATE SET ... WHERE pegawai.updated_at < EXCLUDED.updated_at`) dalam batch transaksi terukur agar eksekusi ulang selalu menghasilkan state akhir yang sama.',
    pengecoh4: [
      'Menjalankan `DELETE FROM pegawai;` di awal skrip sebelum `INSERT` agar tidak pernah muncul error duplikasi saat skrip diulang.',
      'Mengabaikan seluruh pesan error duplikasi pada driver aplikasi tanpa memperbarui kolom pegawai yang datanya sudah berubah di server pusat.',
      'Menghapus constraint `UNIQUE (nip)` agar seluruh baris pembaruan baru masuk sebagai baris tambahan dan dibersihkan setahun sekali.',
      'Menyimpan posisi baris terakhir hanya di variabel memori lokal aplikasi tanpa mencatat checkpoint maupun penanganan konflik di database.',
    ],
    akarMasalah:
      'Proses ETL/sinkronisasi yang tidak idempoten (mengasumsikan setiap baris selalu baru) gagal pulih secara bersih ketika mengalami retry pascagangguan jaringan di tengah jalan.',
    solusiTerbaik:
      'Upsert atomik `ON CONFLICT (nip) DO UPDATE` disertai penjaga timestamp (`WHERE pegawai.updated_at < EXCLUDED.updated_at`) membuat skrip 100% idempoten, aman dijalankan ulang kapan saja, dan mencegah data lama menimpa data lebih baru.',
    analisisPengecoh:
      '`DELETE FROM pegawai` menghapus seluruh data daerah dan melumpuhkan layanan saat job gagal di tengah jalan; mengabaikan error membuat perubahan status terbaru tidak pernah masuk; menghapus `UNIQUE (nip)` merusak integritas entitas; variabel memori hilang saat proses crash.',
  },
  {
    level: 'C6',
    topik: 'Basis Data — Desain Hierarki Unit Organisasi (Closure Table / Recursive CTE)',
    pertanyaan:
      'Struktur organisasi kementerian memiliki kedalaman hierarki dinamis hingga 7 tingkat (Kementerian → Ditjen → Direktorat → Subdit → Seksi → Subseksi → Tim). Aplikasi sering menampilkan seluruh pegawai di bawah suatu unit beserta seluruh sub-unit turunannya (`subtree`) dalam satu tampilan cepat. Skema dan teknik query SQL standar yang paling tepat pada RDBMS modern adalah...',
    jawabanBenar:
      'Menggunakan Adjacency List (`parent_id`) yang diindeks dipadukan dengan `WITH RECURSIVE` CTE (atau Materialized Path / Closure Table bila beban baca hierarki sangat tinggi) agar seluruh kedalaman dinamis dapat diambil dalam satu query SQL.',
    pengecoh4: [
      'Membuat 7 tabel terpisah yang kaku (`tabel_level1` sampai `tabel_level7`) dan melarang perubahan jumlah tingkat struktur organisasi di masa depan.',
      'Menjalankan `LEFT JOIN` mandiri (self-join) sebanyak 3 kali saja dan membiarkan unit di bawah tingkat ke-4 tidak ditampilkan.',
      'Mengambil seluruh daftar unit ke memori aplikasi lalu melakukan ratusan query `SELECT ... WHERE parent_id = ?` secara rekursif per simpul.',
      'Menggabungkan seluruh nama pegawai bawahan menjadi satu kolom teks dipisah koma di baris induk kementerian.',
    ],
    akarMasalah:
      'Hierarki berjenjang dengan kedalaman variabel tidak dapat ditangani secara fleksibel oleh jumlah `JOIN` statis atau pemanggilan rekursif N+1 dari lapisan aplikasi.',
    solusiTerbaik:
      'Adjacency List + `WITH RECURSIVE` CTE (didukung standar SQL:1999 / PostgreSQL / MySQL 8+) menelusuri kedalaman tak terbatas dalam satu kali eksekusi SQL, dan dapat ditingkatkan ke Materialized Path (`ltree`) atau Closure Table apabila skala baca subtree sangat masif.',
    analisisPengecoh:
      '7 tabel kaku gagal saat reorganisasi menambah/mengurangi level; self-join 3 kali memotong data organisasi di bawah level 4; query rekursif dari aplikasi menciptakan banjir N+1; menggabung semua pegawai ke satu teks melanggar 1NF.',
  },
];
