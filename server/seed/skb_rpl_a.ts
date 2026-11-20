import type { SkbHotsItem } from './skb_hots_builder';

export const SKB_RPL_A: SkbHotsItem[] = [
  {
    level: 'C4',
    topik: 'RPL — Debugging Async Race Condition & Shared State',
    pertanyaan:
      'Layanan Node.js penerbitan nomor surat elektronik menggunakan fungsi berikut untuk menghasilkan nomor urut berurutan, namun saat 20 permintaan masuk bersamaan, beberapa surat keluar mendapat nomor duplikat:\n```ts\nlet counter = await db.getLastCounter();\nasync function nextLetterNumber() {\n  const current = await db.getLastCounter();\n  const next = current + 1;\n  await db.saveCounter(next);\n  return `SK/2025/${next}`;\n}\n```\nAnalisis akar masalah pada potongan kode asinkron tersebut dan solusi paling tepat untuk lingkungan multi-instans (horizontal scaling) adalah...',
    jawabanBenar:
      'Operasi baca-tambah-simpan terpisah oleh `await` sehingga banyak request membaca nilai `current` identik sebelum tersimpan (race condition); solusinya memakai `SEQUENCE` database atau `UPDATE counter SET val = val + 1 RETURNING val` secara atomik.',
    pengecoh4: [
      'Fungsi gagal karena variabel global `counter` dideklarasikan dengan `let`; solusinya mengganti `let` menjadi `const` dan tetap menjalankan `getLastCounter()` lalu `saveCounter()`.',
      'Masalah terjadi karena template literal string lambat diproses; solusinya menggabungkan string nomor surat menggunakan operator `+` sebelum memanggil `saveCounter()`.',
      'Masalah terjadi karena kata kunci `async` selalu menjalankan fungsi di CPU core berbeda; solusinya menambahkan mutex variabel lokal di memori Node.js agar aman di 5 server berbeda.',
      'Masalah terjadi karena `next` tidak dikonversi ke `BigInt`; solusinya mengubah `current + 1` menjadi `BigInt(current) + 1n` tanpa mengubah mekanisme transaksi.',
    ],
    akarMasalah:
      'Pola check-then-act asinkron (`getLastCounter` -> `await` -> `saveCounter`) membuat puluhan request konkuren masuk saat event loop sedang menunggu I/O dan memperoleh angka `current` yang sama.',
    solusiTerbaik:
      'Memindahkan inkremen ke mekanisme atomik terpusat di database (`SEQUENCE` / `UPDATE ... RETURNING`) menjamin keunikan mutlak baik dalam satu proses maupun lintas banyak replika kontainer.',
    analisisPengecoh:
      'Mengubah `let` ke `const` tidak memengaruhi operasi database; konkatenasi `+` tidak mengubah race condition; mutex memori lokal gagal di lingkungan multi-instans (masing-masing kontainer punya memori sendiri); `BigInt` tidak mencegah dua request membaca angka awal yang sama.',
  },
  {
    level: 'C4',
    topik: 'RPL — Debugging Memory Leak pada Layanan Long-Running',
    pertanyaan:
      'Aplikasi backend pelacakan surat instansi mengalami `OutOfMemoryError` setiap 36 jam sehingga kontainer terus restart. Saat meninjau kode layanan notifikasi, ditemukan cuplikan berikut:\n```ts\nconst requestHistory: Record<string, RequestMetadata> = {};\napp.use((req, res, next) => {\n  requestHistory[req.id] = { user: req.user, body: req.body, ts: Date.now() };\n  eventBus.on(\'configUpdated\', () => refreshLocalRule(req.id));\n  next();\n});\n```\nDua penyebab utama kebocoran memori (memory leak) pada middleware tersebut dan perbaikan paling tepat adalah...',
    jawabanBenar:
      'Objek `requestHistory` tumbuh tanpa batas (unbounded in-memory map) dan `eventBus.on` mendaftarkan listener baru pada setiap HTTP request tanpa pernah dilepas (`off`); perbaikannya membuang penyimpanan per-request di memori global (gunakan logging/LRU berbatas TTL) dan mendaftarkan listener `configUpdated` cukup sekali saat inisialisasi aplikasi.',
    pengecoh4: [
      'Kebocoran terjadi karena `Date.now()` menghasilkan objek `Date` baru setiap request; perbaikannya mengganti `Date.now()` menjadi `new Date().toISOString()` di dalam `requestHistory`.',
      'Kebocoran terjadi karena pemanggilan `next()` seharusnya diletakkan sebelum deklarasi `app.use`; perbaikannya cukup memindahkan urutan baris `next()` ke awal fungsi.',
      'Kebocoran terjadi karena `Record<string, RequestMetadata>` memakai kunci string; perbaikannya mengganti menjadi `Array.push(...)` agar Garbage Collector otomatis menghapus elemen lama.',
      'Kebocoran terjadi karena Express.js tidak mendukung middleware sinkron; perbaikannya menambahkan `async/await` pada `app.use` sambil mempertahankan `eventBus.on` di dalamnya.',
    ],
    akarMasalah:
      'Setiap satu request menambahkan entri permanen ke objek global `requestHistory` (tidak pernah dieviksi) sekaligus menempelkan closure listener baru ke `eventBus` global sehingga referensi `req` tidak pernah dapat dibebaskan Garbage Collector.',
    solusiTerbaik:
      'Menghilangkan unbounded cache global (menggantinya dengan structured log eksternal atau bounded LRU cache bila perlu) serta memindahkan registrasi `eventBus.on` ke level startup aplikasi (1 kali saja) menstabilkan heap memori secara permanen.',
    analisisPengecoh:
      '`Date.now()` mengembalikan angka primitif bukan objek berat dan `toISOString()` malah lebih besar; memindah `next()` tidak mencegah akumulasi map/listener; `Array.push` juga tumbuh tak terbatas tanpa eviksi; menambahkan `async` tidak menghentikan leak listener.',
  },
  {
    level: 'C6',
    topik: 'RPL — Arsitektur Caching & Mitigasi Cache Stampede',
    pertanyaan:
      'Saat pengumuman kelulusan seleksi ASN tepat pukul 08:00 WIB, 50.000 peserta membuka halaman pengumuman yang datanya di-cache di Redis dengan TTL 10 menit. Tepat pada menit ke-10 ketika kunci cache kedaluwarsa, ribuan request serentak mengalami cache miss dan bersama-sama menghantam database utama hingga CPU melonjak 100% dan layanan tumbang. Strategi arsitektur caching terbaik mencegah fenomena ini adalah...',
    jawabanBenar:
      'Mengatasi **Cache Stampede (Thundering Herd)** menggunakan Singleflight / Distributed Mutex Lock saat cache rebuild, dikombinasikan dengan Probabilistic Early Expiration (atau background refresh sebelum TTL habis) dan Stale-While-Revalidate.',
    pengecoh4: [
      'Menghapus seluruh mekanisme TTL pada Redis agar data pengumuman tersimpan permanen di memori selamanya tanpa pernah bisa diperbarui ketika ada ralat resmi.',
      'Menurunkan TTL cache dari 10 menit menjadi 5 detik agar setiap kali cache kedaluwarsa data selalu paling segar meskipun frekuensi cache miss meningkat 120 kali lipat.',
      'Menonaktifkan Redis sepenuhnya dan mengandalkan HTTP 304 ETag di server database agar seluruh 50.000 permintaan langsung diverifikasi ke tabel utama.',
      'Menyimpan salinan data pengumuman ke dalam cookie browser berukuran 4 MB untuk setiap peserta agar server tidak perlu membaca Redis.',
    ],
    akarMasalah:
      'Ketika kunci cache panas (hot key) kedaluwarsa serentak di bawah trafik tinggi, ribuan permintaan gagal menemukan cache pada detik yang sama lalu membanjiri database dengan query mahal identik (Cache Stampede).',
    solusiTerbaik:
      'Mengizinkan hanya satu worker membangun ulang cache (mutex/singleflight) sementara permintaan lain menerima nilai stale sementara (Stale-While-Revalidate) atau menyegarkan cache di latar belakang sebelum TTL habis mencegah lonjakan beban ke database.',
    analisisPengecoh:
      'Cache tanpa TTL/invalidasi menyulitkan koreksi pengumuman; memperpendek TTL ke 5 detik memperbanyak kejadian stampede; ETag tetap membutuhkan pemrosesan/validasi server backend; batas ukuran cookie browser hanyalah ~4 KB, bukan 4 MB.',
  },
  {
    level: 'C5',
    topik: 'RPL — Evaluasi Modular Monolith vs Microservices',
    pertanyaan:
      'Dinas Kominfo kabupaten memiliki tim internal berjumlah 4 pengembang (2 backend, 1 frontend, 1 merangkap DevOps) untuk membangun Portal Layanan Terpadu 6 modul (Perizinan, Kependudukan, Pengaduan, Survei, Berita, Notifikasi) dalam waktu 5 bulan. Vendor mengusulkan arsitektur 12 microservices di Kubernetes sejak awal agar tampak modern. Evaluasi arsitektural paling rasional terhadap usulan tersebut adalah...',
    jawabanBenar:
      'Menerapkan **Modular Monolith** dengan batas modul/domain yang tegas dan bersih terlebih dahulu agar tim kecil bergerak cepat dengan transaksi ACID lokal dan operasional sederhana, lalu mengekstrak modul tertentu menjadi service terpisah hanya jika skala trafik atau kebutuhan tim menuntutnya.',
    pengecoh4: [
      'Menerima 12 microservices sejak hari pertama karena microservices otomatis menghilangkan seluruh bug logika bisnis dan tidak memerlukan orkestrasi jaringan tambahan.',
      'Menggunakan arsitektur tanpa batas modul (Big Ball of Mud) dalam satu berkas skrip raksasa agar tidak perlu memikirkan struktur folder maupun pengujian.',
      'Memecah aplikasi menjadi 12 microservices tetapi seluruhnya saling mengakses langsung tabel database milik layanan lain tanpa API agar lebih cepat.',
      'Menunda seluruh pembangunan aplikasi selama 2 tahun sampai jumlah pegawai IT di dinas bertambah menjadi minimal 40 orang.',
    ],
    akarMasalah:
      'Microservices membawa biaya operasional tinggi (service discovery, distributed tracing, eventual consistency, jaringan, CI/CD banyak repo) yang akan melumpuhkan tim kecil 4 orang dengan tenggat 5 bulan (Hukum Conway & distributed monolith trap).',
    solusiTerbaik:
      'Modular Monolith mempertahankan disiplin pemisahan domain (bounded contexts & interface antar-modul) sambil menjaga deployment tunggal, debugging mudah, dan transaksi ACID lokal, sehingga siap berevolusi ke microservices secara terukur di masa depan.',
    analisisPengecoh:
      'Microservices justru menambah kompleksitas kesalahan jaringan; Big Ball of Mud cepat merusak maintainability; 12 service berbagi tabel langsung adalah anti-pattern distributed monolith terburuk; menunda 2 tahun gagal memenuhi target layanan publik.',
  },
  {
    level: 'C4',
    topik: 'RPL — Debugging Algoritma & Kompleksitas Waktu ($O(N^2)$ ke $O(N)$)',
    pertanyaan:
      'Fungsi pencocokan 50.000 NIK penerima bansos terhadap 50.000 NIK daftar pegawai ASN berikut membuat worker Node.js membeku selama lebih dari 40 detik:\n```ts\nfunction findIneligible(applicants: string[], asnList: string[]): string[] {\n  const flagged: string[] = [];\n  for (const nik of applicants) {\n    if (asnList.includes(nik)) {\n      flagged.push(nik);\n    }\n  }\n  return flagged;\n}\n```\nAnalisis kompleksitas waktu dari kode di atas dan optimasi paling tepat agar eksekusi turun menjadi di bawah 50 milidetik adalah...',
    jawabanBenar:
      'Pencarian `asnList.includes(nik)` di dalam perulangan menghasilkan kompleksitas $O(N \times M)$ (hingga 2,5 miliar perbandingan); mengonversi `asnList` menjadi `Set` (`const asnSet = new Set(asnList)`) menurunkan kompleksitas menjadi $O(N + M)$ dengan lookup rata-rata $O(1)$.',
    pengecoh4: [
      'Kode lambat karena metode `Array.push` berbiaya $O(N^2)$; solusinya mengganti `flagged.push(nik)` dengan spread `[...flagged, nik]` di setiap iterasi.',
      'Kode lambat karena memakai `for...of`; menggantinya menjadi `applicants.filter(nik => asnList.indexOf(nik) !== -1)` langsung mengubah kompleksitas menjadi $O(\log N)$.',
      'Kode lambat karena array string harus diurutkan terbalik terlebih dahulu; menjalankan `asnList.reverse()` sebelum loop akan mempercepat `includes()` 100 kali lipat.',
      'Kode lambat karena tipe string 16 digit terlalu panjang; memecah loop menjadi 2 fungsi rekursif tanpa struktur hash akan menurunkannya ke $O(1)$.',
    ],
    akarMasalah:
      '`Array.prototype.includes` melakukan linear scan $O(M)$ pada setiap iterasi `applicants` ($N$), sehingga total operasi mencapai $50.000 \times 50.000 = 2,5 \times 10^9$ langkah.',
    solusiTerbaik:
      'Membangun hash set `new Set(asnList)` sekali saja ($O(M)$) lalu memeriksa keanggotaan dengan `asnSet.has(nik)` ($O(1)$ per elemen) memangkas total langkah menjadi ~100.000 operasi ($O(N + M)$) yang tuntas dalam hitungan milidetik.',
    analisisPengecoh:
      'Spread `[...flagged, nik]` justru menyalin array berulang kali ($O(N^2)$ tambahan); `filter` + `indexOf` tetap berbiaya $O(N \times M)$; `reverse()` tidak mengubah biaya pencarian linear; rekursi tanpa hash tetap $O(N \times M)$ dan rawan stack overflow.',
  },
  {
    level: 'C6',
    topik: 'RPL — Ketahanan Sistem: Circuit Breaker & Timeout Budget',
    pertanyaan:
      'Portal layanan perizinan memanggil API eksternal validasi NPWP milik instansi mitra secara sinkron. Suatu hari API mitra mengalami gangguan lambat (merespons setelah 45 detik lalu timeout). Tanpa mekanisme proteksi, seluruh thread/worker portal ikut macet menunggu API mitra sehingga halaman lain seperti cek status izin dan unduh panduan ikut lumpuh total (Cascading Failure). Pola ketahanan sistem (Resilience Pattern) paling tepat diterapkan adalah...',
    jawabanBenar:
      'Menerapkan kombinasi batas **Timeout** ketat (mis. 3 detik), **Circuit Breaker** (memutus cepat / fail-fast saat tingkat kegagalan melewati ambang tertentu), **Bulkhead** isolasi pool, serta fallback terukur (antrekan verifikasi asinkron).',
    pengecoh4: [
      'Menaikkan batas timeout panggilan HTTP ke API mitra menjadi 5 menit dan menambahkan retry tanpa jeda sebanyak 20 kali agar setiap panggilan akhirnya berhasil.',
      'Menghapus seluruh penanganan error `try-catch` pada pemanggilan API mitra agar proses server langsung keluar (crash) setiap kali mitra melambat.',
      'Menyatukan seluruh panggilan API mitra ke dalam satu thread tunggal global tanpa timeout agar antrean berjalan berurutan satu per satu.',
      'Menjalankan panggilan ke API mitra dari browser klien secara langsung menggunakan API key rahasia instansi agar beban server backend hilang.',
    ],
    akarMasalah:
      'Ketergantungan sinkron tanpa batas waktu dan tanpa pemutus arus membuat gangguan satu layanan hilir menghabiskan seluruh pool koneksi/thread layanan hulu, memicu efek domino (Cascading Failure).',
    solusiTerbaik:
      'Timeout ketat mencegah penahanan sumber daya berkepanjangan, Bulkhead mengisolasi kapasitas integrasi mitra dari fitur inti lain, dan Circuit Breaker langsung mengembalikan fallback cepat (fail-fast) saat mitra down agar layanan lain tetap sehat dan mitra diberi waktu pulih.',
    analisisPengecoh:
      'Timeout 5 menit + 20 retry tanpa jeda justru memperparah penumpukan thread dan menciptakan retry storm ke mitra; membiarkan server crash merusak ketersediaan total; antrean satu thread memperburuk latensi; mengekspos API key rahasia di browser merupakan celah keamanan fatal.',
  },
  {
    level: 'C5',
    topik: 'RPL — Desain REST API: Idempotency, Status Code & Semantics',
    pertanyaan:
      'Tim API merancang endpoint penerbitan kode billing retribusi daerah. Pengembang mengusulkan `GET /api/billing/create?userId=42&amount=150000` yang selalu mengembalikan HTTP `200 OK` bahkan ketika saldo/data tidak valid (dengan isi JSON `{"ok": false, "msg": "invalid"}`). Evaluasi pelanggaran standar REST/HTTP dan desain perbaikan paling tepat adalah...',
    jawabanBenar:
      'Operasi penciptaan sumber daya tidak boleh memakai `GET` (yang harus safe & idempotent sehingga rentan di-cache/prefetch atau CSRF); gunakan `POST /api/billings` dengan header `Idempotency-Key`, status `201 Created` saat sukses, serta `400/422` untuk validasi gagal dan `409 Conflict` bila duplikat.',
    pengecoh4: [
      'Mengubah method menjadi `DELETE /api/billing/create` dengan body JSON dan tetap mengembalikan `200 OK` pada seluruh kondisi gagal maupun berhasil agar frontend tidak perlu mengecek status HTTP.',
      'Mempertahankan `GET` tetapi memindahkan parameter `amount` ke dalam HTTP cookie agar URL terlihat lebih pendek dan rapi di browser.',
      'Menggunakan `POST /api/billing` tetapi selalu mengembalikan status `500 Internal Server Error` ketika pengguna salah memasukkan format nomor KTP.',
      'Menggunakan `PUT /api/billing/create` tanpa body dan menyisipkan kata sandi admin pada query string agar lebih mudah diuji di address bar browser.',
    ],
    akarMasalah:
      '`GET` secara spesifikasi HTTP (RFC 9110) bersifat safe (tidak mengubah state); memakainya untuk membuat transaksi rentan terpicu otomatis oleh crawler, browser prefetch, atau cache proxy, sementara mengembalikan `200 OK` untuk error menyamarkan kegagalan di monitoring/API gateway.',
    solusiTerbaik:
      '`POST /api/billings` berbasis resource noun + header `Idempotency-Key` + kode status semantik akurat (`201 Created`, `400/422` untuk kesalahan klien, `409 Conflict`, `5xx` hanya untuk galat server) memudahkan retry aman, observability, dan interoperabilitas SPLP.',
    analisisPengecoh:
      '`DELETE` menyalahi semantik penciptaan; memindah parameter ke cookie pada `GET` tetap melanggar sifat safe `GET`; `500` adalah galat server bukan galat input pengguna (`400/422`) dan memicu false alarm monitoring; menaruh sandi di query string membocorkan kredensial ke log akses.',
  },
  {
    level: 'C6',
    topik: 'RPL — Message Queue, At-Least-Once Delivery & Idempotent Consumer',
    pertanyaan:
      'Layanan pencairan insentif menggunakan RabbitMQ untuk memproses pesan `DisbursePaymentCommand`. Ketika worker selesai mentransfer dana tetapi terputus sesaat sebelum mengirim `ACK` ke broker, RabbitMQ mengirim ulang (redeliver) pesan yang sama ke worker lain (At-Least-Once Delivery), sehingga penerima berisiko menerima transfer dua kali. Rancangan consumer yang paling tangguh terhadap duplikasi pesan adalah...',
    jawabanBenar:
      'Merancang **Idempotent Consumer**: menyimpan `message_id` (atau `disbursement_id`) unik di tabel dedup/transaksi dalam satu transaksi database bersama pencatatan status transfer sehingga redelivery pesan dengan ID sama langsung dideteksi dan di-`ACK` tanpa mentransfer ulang.',
    pengecoh4: [
      'Mengaktifkan `auto-ack` di RabbitMQ sebelum worker mulai memproses transfer agar pesan langsung terhapus dari antrean sehingga tidak pernah terkirim dua kali meski worker crash.',
      'Menghapus seluruh mekanisme retry di broker dan membiarkan transfer yang gagal di tengah jalan hilang tanpa catatan Dead-Letter Queue.',
      'Mengandalkan pemeriksaan variabel `Set` di memori RAM worker untuk mencatat `message_id` yang sudah diproses tanpa menyimpannya di penyimpanan persisten.',
      'Menurunkan jumlah consumer menjadi satu proses saja tanpa pengakuan `ACK` agar broker hanya mengirim pesan sekali per menit.',
    ],
    akarMasalah:
      'Dalam sistem terdistribusi, pengiriman pesan tepat-sekali (exactly-once) murni di level jaringan mustahil tanpa koordinasi ujung-ke-ujung; broker andal menjamin At-Least-Once Delivery sehingga duplikasi pesan pasti dapat terjadi saat timeout/crash.',
    solusiTerbaik:
      'Idempotent Consumer dengan catatan `message_id` unik yang persisten dan atomik di sisi penerima memastikan pemrosesan ulang pesan yang sama menghasilkan efek bisnis tunggal (effectively-once processing), ditambah Dead-Letter Queue untuk pesan cacat permanen.',
    analisisPengecoh:
      '`auto-ack` mengubah jaminan menjadi At-Most-Once sehingga dana gagal dicairkan dan pesan hilang bila worker crash; membuang retry/DLQ merusak keandalan layanan; `Set` di RAM hilang saat restart dan tidak dibagikan antar-worker; satu consumer tanpa ACK tidak mencegah crash maupun duplikasi.',
  },
  {
    level: 'C4',
    topik: 'RPL — Debugging Floating-Point & Kesalahan Logika Kondisi',
    pertanyaan:
      'Perhatikan cuplikan pseudocode/JavaScript perhitungan kelulusan dan potongan retribusi daerah berikut:\n```js\nfunction hitungSisaTagihan(total, bayar1, bayar2) {\n  const sisa = total - (bayar1 + bayar2);\n  if (sisa === 0) {\n    return { status: "LUNAS", sisa: 0 };\n  }\n  return { status: "BELUM_LUNAS", sisa };\n}\n// Pemanggilan: hitungSisaTagihan(0.3, 0.1, 0.2)\n```\nSaat diuji dengan nilai desimal `total = 0.3`, `bayar1 = 0.1`, `bayar2 = 0.2`, fungsi secara tak terduga mengembalikan `BELUM_LUNAS`. Analisis penyebab bug dan perbaikan terbaik untuk logika finansial tersebut adalah...',
    jawabanBenar:
      'Dalam representasi biner IEEE 754, `0.1 + 0.2` bernilai `0.30000000000000004` sehingga `sisa === 0` bernilai `false`; perbaikannya melakukan seluruh perhitungan nominal dalam satuan integer terkecil (sen/rupiah bulat) atau memakai pustaka desimal eksak (`Decimal.js`/`Big.js`).',
    pengecoh4: [
      'Operator `===` tidak dapat membandingkan bilangan nol di JavaScript; perbaikannya cukup mengganti `===` menjadi `==` agar `0.3 - (0.1 + 0.2)` bernilai sama dengan nol.',
      'Urutan tanda kurung `(bayar1 + bayar2)` salah secara aljabar; mengubahnya menjadi `total - bayar1 - bayar2` menjamin hasil eksak nol untuk semua bilangan desimal biner.',
      'Fungsi gagal karena parameter `total` harus diubah menjadi string terlebih dahulu sebelum dikurangi dengan `(bayar1 + bayar2)`.',
      'Penyebabnya adalah kata kunci `const` membekukan nilai `sisa`; menggantinya dengan `var` akan membuat pembulatan otomatis terjadi.',
    ],
    akarMasalah:
      'Bilangan pecahan desimal seperti `0.1` dan `0.2` merupakan pecahan berulang tak hingga dalam basis 2 (IEEE 754 double precision), sehingga penjumlahannya menghasilkan galat representasi kecil (`~4.4e-17` / `-5.55e-17`) yang menggagalkan perbandingan kesamaan ketat `=== 0`.',
    solusiTerbaik:
      'Menghitung uang dalam integer satuan terkecil (misal rupiah utuh atau sen, `30 - (10 + 20) === 0`) atau memakai library aritmetika fixed-point desimal (`Decimal`) menghilangkan seluruh galat floating-point secara definitif.',
    analisisPengecoh:
      'Operator `==` tetap mengembalikan `false` untuk `-5.55e-17 == 0`; `0.3 - 0.1 - 0.2` tetap memiliki galat IEEE 754 (`-2.77e-17`); konversi ke string tidak mengubah representasi biner saat dikurangi; `const` vs `var` sama sekali tidak memengaruhi aritmetika IEEE 754.',
  },
  {
    level: 'C5',
    topik: 'RPL — Strategi Deployment: Blue-Green vs Canary vs Recreate',
    pertanyaan:
      'Aplikasi portal layanan pajak daerah memiliki 30.000 pengguna aktif harian dan akan merilis pembaruan besar pada mesin kalkulasi tarif. Pimpinan mensyaratkan: (1) nol downtime saat rilis, (2) dampak kesalahan logika baru harus dibatasi maksimal ke 5% trafik terlebih dahulu untuk dipantau metrik error-nya secara nyata, dan (3) rollback instan bila error rate naik. Strategi deployment paling sesuai adalah...',
    jawabanBenar:
      '**Canary Deployment** dengan routing bertahap (mis. 5% → 25% → 100%) disertai pemantauan SLI/error rate otomatis dan rollback trafik instan ke versi stabil jika anomali terdeteksi.',
    pengecoh4: [
      '**Recreate Deployment** yang mematikan seluruh instans versi lama terlebih dahulu lalu menyalakan versi baru agar tidak ada dua versi berjalan bersamaan.',
      '**Big Bang Manual Deployment** via FTP langsung menimpa berkas produksi pada pukul 12:00 siang saat jam istirahat kantor.',
      '**Blue-Green Deployment** tanpa pengalihan persentase bertahap karena Blue-Green selalu membatasi trafik awal secara otomatis hanya 5% ke lingkungan Green.',
      '**Rolling Update** tanpa health check readiness probe sehingga trafik langsung dialirkan ke pod yang proses startup-nya belum selesai.',
    ],
    akarMasalah:
      'Rilis perubahan kalkulasi kritis berisiko tinggi bila langsung menerima 100% trafik sekaligus; dibutuhkan paparan terbatas (blast radius kecil) sekaligus zero-downtime dan rollback instan.',
    solusiTerbaik:
      'Canary Deployment mengalirkan persentase kecil trafik produksi nyata (5%) ke versi baru guna memvalidasi metrik bisnis/error rate sebelum ekspansi bertahap ke 100%, sekaligus memungkinkan pengalihan balik 0% dalam hitungan detik.',
    analisisPengecoh:
      'Recreate menimbulkan downtime penuh; Big Bang FTP rawan korupsi rilis dan tanpa rollback bersih; Blue-Green standar memindahkan 100% trafik sekaligus dari Blue ke Green (tidak bertahap 5%); Rolling Update tanpa readiness probe menjatuhkan request yang sedang berjalan.',
  },
  {
    level: 'C4',
    topik: 'RPL — Pengujian Perangkat Lunak: Boundary Value Analysis & Equivalence Partitioning',
    pertanyaan:
      'Sebuah modul pengajuan cuti ASN menerapkan aturan: pegawai hanya boleh mengajukan cuti tahunan minimal `1` hari dan maksimal `12` hari kerja (bilangan bulat). Jika tim QA hanya punya waktu merancang himpunan uji paling tajam untuk menangkap bug off-by-one (`<` vs `<=`), himpunan nilai uji berdasarkan **Boundary Value Analysis (BVA)** yang paling efektif adalah...',
    jawabanBenar:
      'Menguji nilai batas dan tepat di luar batas: `{0, 1, 2, 11, 12, 13}` (ditambah nilai negatif/non-numerik untuk validasi tipe) karena cacat operator relasional paling sering tersembunyi di tepi batas bawah dan atas.',
    pengecoh4: [
      'Cukup menguji tiga nilai tengah `{4, 6, 8}` karena seluruh bilangan antara 1 dan 12 sudah pasti mewakili perilaku di titik batas.',
      'Menguji `{1, 5, 10}` saja tanpa menguji nilai di luar rentang (`0` dan `13`) karena pengguna diasumsikan tidak akan memasukkan angka tidak valid.',
      'Menguji seluruh angka acak dari `100` sampai `1.000` sebanyak 50 kasus uji tanpa menyertakan angka `1` maupun `12`.',
      'Hanya menjalankan pengujian visual warna tombol "Ajukan" di browser tanpa memverifikasi logika angka batas di backend.',
    ],
    akarMasalah:
      'Kesalahan implementasi paling umum pada rentang numerik adalah bug off-by-one (misalnya menulis `hari > 1 && hari < 12` alih-alih `>= 1 && <= 12`), yang tidak akan pernah terdeteksi oleh nilai tengah seperti `4, 6, 8`.',
    solusiTerbaik:
      'Boundary Value Analysis (BVA) secara sistematis menyasar tepat pada batas (`1, 12`), satu langkah di luar batas (`0, 13`), dan satu langkah di dalam batas (`2, 11`), memaksimalkan tingkat penemuan cacat dengan jumlah test case minimal.',
    analisisPengecoh:
      'Nilai tengah meloloskan bug `>` vs `>=`; tidak menguji `0` dan `13` gagal memverifikasi penolakan input ilegal; 50 angka di rentang 100–1000 semuanya berasal dari satu partisi ekuivalensi invalid yang sama (redundan); tes visual UI tidak menguji validasi batas.',
  },
  {
    level: 'C6',
    topik: 'RPL — Prinsip SOLID: Interface Segregation & Refactoring Layanan',
    pertanyaan:
      'Pada sistem manajemen dokumen daerah, terdapat satu antarmuka raksasa `DocumentService` yang memuat 14 metode mulai dari `createDraft`, `signWithBSrE`, `archiveToColdStorage`, `renderPdfPreview`, hingga `publishToOpenDataPortal`. Akibatnya, modul ringan `PublicPortalReader` yang hanya butuh membaca dokumen publik terpaksa bergantung pada pustaka tanda tangan digital BSrE dan harus dikompilasi ulang setiap kali modul tanda tangan berubah. Prinsip desain dan refactoring yang paling tepat adalah...',
    jawabanBenar:
      'Menerapkan **Interface Segregation Principle (ISP)** dengan memecah antarmuka gemuk tersebut menjadi beberapa antarmuka kecil berbasis peran klien (`DocumentReader`, `DocumentSigner`, `DocumentArchiver`) sehingga tiap klien hanya bergantung pada metode yang benar-benar dipakainya.',
    pengecoh4: [
      'Menerapkan **Singleton Pattern** pada kelas implementasi `DocumentService` agar seluruh 14 metode tetap berada di satu objek global tunggal.',
      'Mewajibkan `PublicPortalReader` mengimplementasikan 12 metode yang tidak dibutuhkannya dengan melempar `throw new Error("Not Implemented")` di setiap metode.',
      'Menggabungkan seluruh pustaka BSrE, PDF renderer, dan portal publik ke satu kelas `BaseGodClass` agar seluruh modul saling mewarisi.',
      'Menghapus seluruh antarmuka (interface) dan mengganti semua pemanggilan metode dengan string evaluasi dinamis `eval()`.',
    ],
    akarMasalah:
      'Fat Interface memaksa klien bergantung pada metode dan dependensi transitif yang tidak pernah digunakannya, meningkatkan coupling, ukuran build, dan risiko regresi lintas modul.',
    solusiTerbaik:
      'Interface Segregation Principle (ISP) memisahkan kontrak layanan sesuai kebutuhan masing-masing konsumen (role interfaces), membuat `PublicPortalReader` sepenuhnya terisolasi dari perubahan modul kriptografi BSrE.',
    analisisPengecoh:
      'Singleton tidak memecah ketergantungan metode; melempar `Not Implemented` adalah pelanggaran klasik Liskov Substitution Principle (LSP) dan tetap meninggalkan coupling; God Class memperburuk ketergantungan; `eval()` membuka celah Remote Code Execution.',
  },
  {
    level: 'C4',
    topik: 'RPL — Debugging Stack Overflow & Rekursi Tanpa Memoization',
    pertanyaan:
      'Perhatikan potongan fungsi penghitungan jalur persetujuan berjenjang di modul alur kerja berikut:\n```ts\nfunction countApprovalPaths(step: number): number {\n  if (step <= 1) return 1;\n  return countApprovalPaths(step - 1) + countApprovalPaths(step - 2);\n}\n```\nKetika diuji dengan `step = 50`, endpoint API langsung hang karena CPU 100% selama beberapa menit. Analisis penyebab performa eksponensial dan perbaikan paling optimal (waktu $O(N)$, ruang $O(1)$) adalah...',
    jawabanBenar:
      'Rekursi naif menghitung ulang sub-masalah identik secara berulang sehingga berbiaya eksponensial $O(2^N)$; perbaikannya mengubah menjadi pendekatan iteratif Dynamic Programming (bottom-up) dengan dua variabel akumulator sehingga berjalan dalam waktu $O(N)$ dan ruang $O(1)$.',
    pengecoh4: [
      'Fungsi hang karena base case `step <= 1` tidak pernah tercapai untuk bilangan positif `50`; perbaikannya mengubah base case menjadi `step === 0`.',
      'Fungsi hang karena tipe `number` di JavaScript tidak dapat menjumlahkan angka sampai langkah ke-50; perbaikannya cukup menambah ukuran stack memori Node.js.',
      'Fungsi hang karena kurang tanda kurung di `return`; perbaikannya membungkus penjumlahan dengan `async/await` sambil mempertahankan dua panggilan rekursif naif.',
      'Fungsi hang karena `countApprovalPaths(step - 2)` seharusnya dipanggil terlebih dahulu sebelum `step - 1` agar kompleksitas turun menjadi $O(\log N)$.',
    ],
    akarMasalah:
      'Pohon rekursi bercabang dua tanpa caching/memoization mengevaluasi sub-masalah tumpang tindih (overlapping subproblems) hingga sekitar $1,6^{50}$ kali panggilan fungsi.',
    solusiTerbaik:
      'Dynamic Programming iteratif (`let a = 1, b = 1; for (let i = 2; i <= step; i++) [a, b] = [b, a + b];`) menuntaskan `step = 50` hanya dalam 49 iterasi ($O(N)$ waktu, $O(1)$ memori) tanpa risiko stack overflow.',
    analisisPengecoh:
      'Base case `step <= 1` memang tercapai tetapi setelah jutaan-miliar cabang duplikat; menambah stack memori tidak mengatasi kompleksitas eksponensial $O(2^N)$; `async/await` tetap eksponensial dan malah lebih lambat; membalik urutan panggilan tidak mengubah jumlah cabang pohon rekursi.',
  },
  {
    level: 'C5',
    topik: 'RPL — Observability: Structured Logging, Correlation ID & Tracing',
    pertanyaan:
      'Sistem portal terpadu terdiri atas 5 layanan (API Gateway, Layanan Auth, Layanan Berkas, Layanan TTE, Layanan Notifikasi). Saat warga mengeluh pengajuannya gagal dengan pesan generik "Terjadi kesalahan", tim operasional kesulitan mencari log terkait karena ribuan request bercampur di log teks bebas di 5 server berbeda. Peningkatan observability yang paling efektif adalah...',
    jawabanBenar:
      'Menerapkan **Structured Logging (JSON)** terpusat dengan **Correlation ID / Trace ID (W3C Trace Context / OpenTelemetry)** yang diteruskan lintas seluruh layanan pada header HTTP sehingga seluruh jejak satu permintaan dapat dilacak ujung-ke-ujung dalam satu tampilan.',
    pengecoh4: [
      'Mencetak seluruh isi payload request termasuk kata sandi dan token JWT warga ke file teks lokal masing-masing server menggunakan `console.log` polos.',
      'Menampilkan stack trace lengkap beserta nama tabel database langsung di layar browser warga agar warga dapat membacakan baris error ke helpdesk.',
      'Menonaktifkan seluruh logging pada jam sibuk karena penulisan log dianggap penyebab utama kegagalan transaksi layanan.',
      'Meminta tim operasional membuka SSH ke 5 server satu per satu dan menebak baris log berdasarkan kesamaan menit timestamp secara manual.',
    ],
    akarMasalah:
      'Log tidak terstruktur yang tersebar di banyak node tanpa pengenal permintaan unik mustahil dikorelasikan secara cepat pada sistem terdistribusi bertrafik tinggi.',
    solusiTerbaik:
      'Propagasi `traceparent` / `X-Correlation-Id` lintas layanan + log JSON terstruktur (bebas PII/secret) yang diagregasi ke pusat log/tracing (ELK/Loki/Jaeger) memangkas Mean Time to Detect & Resolve (MTTR) dari jam menjadi hitungan detik.',
    analisisPengecoh:
      'Mencatat kata sandi/JWT di log melanggar keamanan informasi dan UU PDP; menampilkan stack trace ke publik membocorkan detail internal sistem ke penyerang; mematikan log membutakan operasional; SSH manual berdasarkan menit tidak akurat saat ribuan request masuk per detik.',
  },
  {
    level: 'C6',
    topik: 'RPL — Rate Limiting: Fixed Window vs Sliding Window / Token Bucket',
    pertanyaan:
      'API cek status permohonan publik dipasangi Rate Limiter berjenis **Fixed Window Counter** dengan batas 100 request/menit per IP. Tim keamanan mendapati bot scraping mampu mengirim 100 request pada detik `00:59` dan 100 request lagi pada detik `01:01`, menghasilkan lonjakan 200 request dalam rentang 2 detik yang mengganggu server. Algoritma rate limiting yang paling tepat untuk mengatasi lonjakan tepi jendela (boundary burst) ini adalah...',
    jawabanBenar:
      'Mengganti Fixed Window dengan **Sliding Window Log/Counter** (atau **Token Bucket** dengan kapasitas burst terukur) di Redis memakai skrip Lua atomik agar batas 100 request/menit ditegakkan secara mulus lintas batas menit.',
    pengecoh4: [
      'Menaikkan batas Fixed Window menjadi 500 request/menit agar bot scraping selesai lebih cepat dan segera berhenti mengakses server.',
      'Menjalankan penghitungan Fixed Window secara terpisah di memori lokal masing-masing dari 10 node backend tanpa sinkronisasi Redis.',
      'Menghapus seluruh rate limiter dan menggantinya dengan validasi `User-Agent` browser di header HTTP karena bot tidak dapat memalsukan header `User-Agent`.',
      'Memblokir seluruh alamat IP Indonesia selain jaringan kantor dinas pada portal cek status permohonan publik.',
    ],
    akarMasalah:
      'Fixed Window Counter mereset hitungan secara kaku setiap pergantian menit, menciptakan celah boundary burst hingga 2 kali lipat batas yang diizinkan tepat di perbatasan dua jendela waktu.',
    solusiTerbaik:
      'Sliding Window Counter / Token Bucket yang dieksekusi atomik di Redis (via Lua script) menghaluskan perhitungan lintas batas waktu secara konsisten di seluruh replika API Gateway sekaligus mengembalikan header `Retry-After` dengan status `429 Too Many Requests`.',
    analisisPengecoh:
      'Menaikkan batas justru memperbesar beban serangan; counter lokal per node meloloskan hingga 10× batas pada 10 node; header `User-Agent` sangat mudah dipalsukan bot dalam satu baris kode; memblokir IP publik mematikan layanan bagi masyarakat.',
  },
  {
    level: 'C4',
    topik: 'RPL — Contract Testing pada Integrasi Antar-Layanan SPBE',
    pertanyaan:
      'Layanan A (Portal Perizinan) mengonsumsi REST API dari Layanan B (Data Kependudukan Internal). Suatu hari tim Layanan B mengganti nama field JSON `tgl_lahir` menjadi `tanggalLahir` dan seluruh unit test internal Layanan B tetap lulus 100%, namun saat rilis ke produksi seluruh fitur pendaftaran di Layanan A langsung rusak. Jenis pengujian otomatis yang secara spesifik dirancang mencegah kegagalan integrasi skema API seperti ini sejak pipeline CI adalah...',
    jawabanBenar:
      '**Consumer-Driven Contract Testing** (seperti Pact) atau validasi skema **OpenAPI Contract Verification** di pipeline CI/CD sehingga perubahan kontrak yang mematahkan konsumen (breaking change) langsung menggagalkan build Layanan B sebelum dirilis.',
    pengecoh4: [
      'Menambah jumlah **Load Testing** dengan JMeter agar Layanan B mampu menahan 10.000 request per detik lebih cepat.',
      'Menjalankan **Static Code Linting (ESLint)** pada kode frontend Layanan A untuk mendeteksi apakah tim Layanan B mengubah nama field JSON.',
      'Menjalankan **Usability Testing** terhadap tata letak warna tombol formulir di Layanan A bersama perwakilan masyarakat.',
      'Meningkatkan **Code Coverage Unit Test** Layanan B menjadi 100% menggunakan data mock internal milik Layanan B sendiri.',
    ],
    akarMasalah:
      'Unit test terisolasi dengan mock internal hanya menguji asumsi masing-masing tim dan tidak mendeteksi ketidaksesuaian kontrak payload (schema drift) antara provider dan consumer API.',
    solusiTerbaik:
      'Contract Testing memverifikasi bahwa provider (Layanan B) selalu memenuhi ekspektasi struktur payload dan status HTTP yang disepakati bersama consumer (Layanan A) secara otomatis di CI—tanpa harus menjalankan seluruh ekosistem E2E yang lambat—sekaligus mendorong versioning API (`/v2/`) bila breaking change diperlukan.',
    analisisPengecoh:
      'Load test mengukur performa bukan kompatibilitas skema JSON; linter Layanan A tidak mengetahui perubahan repositori Layanan B; usability test menilai UX; 100% unit test dengan mock Layanan B sendiri tetap lulus saat kontrak berubah.',
  },
  {
    level: 'C5',
    topik: 'RPL — Evaluasi Pola Saga vs Two-Phase Commit (2PC) pada Microservices',
    pertanyaan:
      'Proses pengajuan izin usaha terintegrasi melintasi 3 microservice yang masing-masing memiliki database terpisah (Database-per-Service): Layanan Registrasi, Layanan Pembayaran PNBP, dan Layanan Penerbitan Sertifikat. Jika penerbitan sertifikat gagal setelah pembayaran tercatat, dana/status harus dibatalkan konsisten. Mengapa pola **Saga** lebih disarankan dibanding **Two-Phase Commit (2PC/XA)** pada arsitektur microservices modern?',
    jawabanBenar:
      '2PC mengunci sumber daya di seluruh database secara sinkron lintas jaringan (blocking, menurunkan availability, dan tidak didukung banyak broker/NoSQL), sedangkan **Saga** menjalankan transaksi lokal berurutan disertai **Compensating Transactions** (pembatalan balik) saat langkah hilir gagal.',
    pengecoh4: [
      'Pola Saga secara otomatis menjamin isolasi penuh `SERIALIZABLE` lintas semua microservice tanpa perlu memikirkan transaksi kompensasi maupun idempotensi.',
      '2PC tidak dapat dijalankan apabila salah satu microservice menggunakan bahasa pemrograman yang berbeda seperti Go dan Node.js.',
      'Pola Saga menghapus kebutuhan akan database persisten karena seluruh status transaksi cukup disimpan di variabel sesi browser pengguna.',
      '2PC selalu menyebabkan duplikasi tabel database secara otomatis pada setiap permintaan HTTP yang masuk.',
    ],
    akarMasalah:
      'Two-Phase Commit membutuhkan koordinator sentral yang menahan lock database pada seluruh peserta hingga fase prepare & commit selesai; bila koordinator atau satu node melambat/gagal, seluruh layanan ikut terblokir.',
    solusiTerbaik:
      'Pola Saga (baik Choreography maupun Orchestration) memecah transaksi panjang menjadi transaksi ACID lokal di tiap layanan, dan menyediakan transaksi kompensasi (mis. refund/void billing) ketika langkah berikutnya gagal, menjaga high availability dan loose coupling.',
    analisisPengecoh:
      'Saga bersifat eventual consistency (tidak otomatis memberi isolasi `SERIALIZABLE` sehingga perlu desain semantic lock/kompensasi); masalah 2PC adalah blocking lock & dukungan teknologi bukan perbedaan bahasa pemrograman; Saga tetap butuh database persisten; 2PC tidak menduplikasi tabel.',
  },
  {
    level: 'C4',
    topik: 'RPL — Debugging Kinerja Frontend & Re-render Berlebihan (React)',
    pertanyaan:
      'Halaman dasbor monitoring 2.000 data sekolah berbasis React terasa sangat lambat setiap kali petugas mengetik satu huruf di kotak pencarian. Analisis Profiler menunjukkan seluruh 2.000 baris kartu sekolah dirender ulang secara sinkron di setiap keystroke dan melakukan kalkulasi pengurutan kompleks berulang kali. Kombinasi optimasi frontend paling tepat adalah...',
    jawabanBenar:
      'Menerapkan **debouncing** (atau `useDeferredValue`) pada input pencarian, mem-memoize hasil filter/sort berat dengan `useMemo`, serta menggunakan **list virtualization (windowing)** atau paginasi sehingga hanya baris yang tampak di viewport yang dirender ke DOM.',
    pengecoh4: [
      'Menghapus fitur kotak pencarian dari halaman dan meminta petugas menggunakan `Ctrl+F` setelah seluruh 20.000 baris dimuat sekaligus ke DOM.',
      'Memindahkan seluruh 2.000 baris ke dalam satu elemen `<canvas>` tanpa aksesibilitas teks agar browser tidak memiliki node DOM sama sekali.',
      'Menjalankan `window.location.reload()` setiap kali pengguna selesai mengetik satu karakter agar memori browser dibersihkan.',
      'Menyimpan daftar 2.000 sekolah di `localStorage` dan memanggil `JSON.parse()` di dalam tubuh render komponen pada setiap keystroke.',
    ],
    akarMasalah:
      'Merender ribuan node DOM sekaligus ditambah perhitungan filter/sort berat pada setiap penekanan tombol memblokir main thread browser sehingga menyebabkan input lag.',
    solusiTerbaik:
      'Debouncing/`useDeferredValue` menjaga input tetap responsif, `useMemo` menghindari kalkulasi ulang tak perlu, dan virtualisasi/paginasi memangkas ribuan elemen DOM menjadi hanya ~20–50 elemen aktif di layar.',
    analisisPengecoh:
      'Memuat 20.000 node DOM membuat browser makin lambat; menggambar tabel data di `<canvas>` merusak aksesibilitas dan pencarian/seleksi teks; reload halaman per huruf merusak UX; `JSON.parse()` di setiap render justru menambah beban CPU main thread.',
  },
  {
    level: 'C6',
    topik: 'RPL — Desain Sistem Unggah Berkas Besar (Presigned URL & Chunked Upload)',
    pertanyaan:
      'Aplikasi e-Procurement mengharuskan penyedia mengunggah dokumen penawaran PDF hingga ukuran 250 MB. Saat ini berkas dikirim lewat `multipart/form-data` melewati server API Node.js lalu baru diteruskan ke Object Storage (S3/MinIO). Ketika 300 penyedia mengunggah bersamaan menjelang batas waktu tender, RAM server API habis dan koneksi sering putus di 80% sehingga harus mengulang dari nol. Rancangan arsitektur unggah paling tangguh adalah...',
    jawabanBenar:
      'Menggunakan **Direct-to-Object-Storage Multipart/Chunked Upload** memakai **Presigned URL** berumur pendek yang diterbitkan backend pasca-otorisasi, dilengkapi verifikasi checksum (SHA-256) dan pemindaian antivirus/MIME asinkron sebelum berkas dinyatakan valid.',
    pengecoh4: [
      'Mengonversi berkas PDF 250 MB menjadi string Base64 di browser lalu mengirimkannya di dalam body JSON ke server API Node.js dalam satu permintaan tunggal.',
      'Menyimpan berkas biner 250 MB tersebut langsung ke dalam kolom `BYTEA/BLOB` di tabel PostgreSQL utama agar tidak perlu menggunakan Object Storage.',
      'Membuka akses publik `Public Read/Write` tanpa autentikasi pada bucket Object Storage agar seluruh penyedia bebas mengunggah file apa saja secara langsung.',
      'Meminta penyedia memecah dokumen penawaran secara manual menjadi 50 berkas PDF kecil lalu mengirimkannya satu per satu lewat email ke panitia.',
    ],
    akarMasalah:
      'Menjadikan server aplikasi sebagai proxy biner untuk ratusan unggahan besar menguras bandwidth, memori, dan worker API, sementara unggahan satu potongan gagal melanjutkan (non-resumable) saat koneksi terputus.',
    solusiTerbaik:
      'Backend cukup melakukan otorisasi, validasi kuota/metadata, dan menerbitkan Presigned Multipart URL berumur pendek; browser mengunggah potongan (chunk) langsung ke Object Storage secara resumable, lalu event unggah memicu verifikasi checksum & pemindaian malware di latar belakang.',
    analisisPengecoh:
      'Base64 memperbesar ukuran payload ~33% dan meledakkan memori JSON parser; menyimpan file 250 MB ke `BLOB` RDBMS membengkakkan ukuran DB dan memperlambat backup; bucket `Public Write` adalah celah keamanan kritis; memecah manual lewat email merusak sistem e-Procurement.',
  },
  {
    level: 'C5',
    topik: 'RPL — Manajemen Konfigurasi & Rahasia (12-Factor App)',
    pertanyaan:
      'Tim pengembang ditemukan menyimpan kredensial database produksi, API key gateway SMS, dan URL lingkungan staging/produksi secara hardcoded di dalam file `config.ts` yang di-commit ke repositori Git instansi. Evaluasi risiko dan penerapan prinsip **Twelve-Factor App (Config)** yang tepat adalah...',
    jawabanBenar:
      'Memisahkan konfigurasi dan rahasia sepenuhnya dari kode sumber melalui Environment Variables atau Secret Manager terenkripsi (seperti HashiCorp Vault / Cloud Secret Manager), segera merotasi seluruh kredensial yang telanjur masuk riwayat Git, dan memasang secret scanning pada pipeline CI.',
    pengecoh4: [
      'Cukup memindahkan kredensial produksi ke file `secrets.json` lalu tetap memasukkannya ke repositori Git dengan menyetel repositori menjadi Private.',
      'Mengganti file `config.ts` dengan versi yang dikodekan Base64 lalu tetap menyimpannya di repositori Git agar tidak terbaca sekilas oleh mata manusia.',
      'Menghapus baris kredensial pada commit terbaru saja tanpa merotasi kata sandi database maupun membersihkan riwayat commit lama.',
      'Membuat satu file build terpisah untuk setiap server dengan menulis ulang kode sumber secara manual langsung di server produksi melalui editor teks.',
    ],
    akarMasalah:
      'Menyimpan secret di repositori Git membuat kredensial tersebar di seluruh salinan lokal pengembang, server CI, dan riwayat commit permanen—sekali bocor, sistem produksi langsung terancam.',
    solusiTerbaik:
      'Prinsip 12-Factor memisahkan artefak kode (immutable build) dari konfigurasi runtime (env vars / Secret Manager dengan audit akses & rotasi otomatis); kredensial yang sempat ter-commit wajib dianggap kompromis dan segera dirotasi, diikuti pre-commit/CI secret scanner.',
    analisisPengecoh:
      'Repositori Private tetap memperluas permukaan eksposur ke semua kontributor dan log backup; Base64 langsung dapat didekode siapa saja; menghapus di commit terbaru tetap menyisakan kredensial asli di `git log`; mengedit langsung di server produksi melanggar reproducibility dan audit perubahan.',
  },
  {
    level: 'C4',
    topik: 'RPL — Debugging Deadlock/Starvation pada Event Loop & CPU-Bound Task',
    pertanyaan:
      'Layanan Node.js yang melayani API dashboard dan pembuatan laporan PDF sekaligus tiba-tiba tidak merespons seluruh permintaan health-check (`/health`) selama 12 detik setiap kali seorang admin mengklik "Generate Laporan Tahunan 10.000 Halaman". Penyebab teknis pada arsitektur single-threaded event loop dan solusinya adalah...',
    jawabanBenar:
      'Proses sinkron pembuatan PDF besar bersifat CPU-bound sehingga memblokir main event loop Node.js dan melumpuhkan seluruh I/O lain; solusinya memindahkan tugas generasi PDF ke background job queue (worker terpisah / Worker Threads) dan mengirim tautan unduh saat selesai.',
    pengecoh4: [
      'Masalahnya karena fungsi pembuat PDF belum diberi kata kunci `async`; menambahkan kata kunci `async` di depan fungsi komputasi sinkron otomatis memindahkannya ke CPU core lain.',
      'Masalahnya karena endpoint `/health` berada di urutan bawah file rute; memindahkannya ke baris paling atas file akan membuatnya tetap merespons saat event loop terblokir.',
      'Masalahnya karena protokol HTTP/1.1 tidak mendukung file PDF; mengganti ke HTTP/2 akan membuat main event loop tidak pernah terblokir tugas CPU berat.',
      'Masalahnya karena `setTimeout(..., 0)` tidak dipasang di akhir fungsi PDF; menambah satu `setTimeout` di akhir akan membuat 12 detik komputasi sebelumnya menjadi non-blocking.',
    ],
    akarMasalah:
      'Node.js menjalankan kode JavaScript pada satu main thread event loop; komputasi CPU-bound berat yang sinkron menahan thread tersebut sehingga callback jaringan (termasuk `/health` dan request pengguna lain) tidak bisa dieksekusi sampai komputasi tuntas.',
    solusiTerbaik:
      'Memisahkan pekerjaan berat CPU-bound ke proses worker asinkron melalui antrean pesan (mis. BullMQ/RabbitMQ + worker terpisah atau Worker Threads) menjaga event loop API utama tetap ringan dan responsif milidetik.',
    analisisPengecoh:
      'Kata kunci `async` saja tidak memindahkan komputasi sinkron ke thread baru; urutan rute tidak menolong bila event loop sendiri sedang macet; HTTP/2 tidak membebaskan main thread JavaScript dari blokir CPU; `setTimeout` di akhir baru berjalan setelah 12 detik blokir selesai.',
  },
  {
    level: 'C5',
    topik: 'RPL — Arsitektur Feature Flag & Progressive Delivery',
    pertanyaan:
      'Tim pengembang menyelesaikan fitur baru "Tanda Tangan Digital Multi-Pejabat" pada kode utama 2 minggu sebelum regulasi resminya berlaku, sementara perbaikan bug penting lain di branch utama harus segera dirilis besok pagi. Cara paling bersih menjaga Continuous Integration (trunk-based) tanpa menahan perbaikan bug maupun membocorkan fitur belum resmi ke publik adalah...',
    jawabanBenar:
      'Membungkus fitur baru di balik **Feature Flag (Feature Toggle)** yang berstatus nonaktif di produksi dan aktif di staging/pilot unit tertentu, sehingga kode terintegrasi aman di branch utama tanpa memblokir rilis perbaikan bug.',
    pengecoh4: [
      'Menunda seluruh rilis perbaikan bug kritis di produksi selama 2 minggu sampai regulasi fitur tanda tangan digital resmi berlaku.',
      'Menyimpan fitur baru di branch terpisah selama 6 bulan tanpa pernah digabung (long-lived feature branch) meskipun memicu konflik merge masif.',
      'Menghapus sementara seluruh kode fitur baru dari repositori Git lalu mengetiknya ulang dari catatan lokal 2 minggu kemudian.',
      'Merilis fitur baru tersebut dalam keadaan aktif penuh ke seluruh masyarakat tetapi menyembunyikan tombolnya hanya dengan warna teks putih agar tidak terlihat.',
    ],
    akarMasalah:
      'Mengikat jadwal rilis kode (deployment) secara kaku dengan jadwal peluncuran bisnis (release) memaksa tim memilih antara menahan perbaikan mendesak atau menumpuk konflik pada long-lived branch.',
    solusiTerbaik:
      'Feature Flags memisahkan *deployment* dari *release*: kode teruji terus terintegrasi ke produksi dalam keadaan aman/nonaktif (dark launch), bisa diuji terbatas pada unit pilot, lalu diaktifkan seketika saat regulasi berlaku (dan dimatikan cepat bila ada kendala).',
    analisisPengecoh:
      'Menahan bug fix merugikan layanan publik; long-lived branch menyebabkan merge hell dan integrasi rapuh; menghapus dan mengetik ulang rawan kesalahan fatal; menyembunyikan tombol dengan warna putih (security by obscurity) tetap membiarkan API aktif dan dapat diakses.',
  },
  {
    level: 'C4',
    topik: 'RPL — Debugging Concurrency Bug: Double-Submit & State Machine',
    pertanyaan:
      'Pada aplikasi persetujuan cuti, dokumen berstatus `DIAJUKAN` dapat diubah menjadi `DISETUJUI` atau `DITOLAK`. Seorang kepala bidang yang tidak sabar menekan "Setujui" lalu sedetik kemudian menekan "Tolak" dari tab lain; karena endpoint hanya menjalankan `UPDATE cuti SET status = :baru WHERE id = :id`, dokumen yang sudah terlanjur mengirim email persetujuan berubah status menjadi `DITOLAK` tanpa error. Desain transisi status yang paling tepat adalah...',
    jawabanBenar:
      'Menerapkan **Finite State Machine (FSM)** yang divalidasi secara atomik pada level query (`UPDATE cuti SET status = :baru WHERE id = :id AND status = \'DIAJUKAN\'`) serta memeriksa `affectedRows === 1`, dan menolak transisi ilegal dari state terminal (`DISETUJUI`/`DITOLAK`) dengan HTTP `409 Conflict`.',
    pengecoh4: [
      'Menambahkan `SELECT status FROM cuti WHERE id = :id` di frontend React lalu menyembunyikan tombol "Tolak" tanpa memeriksa status awal pada perintah `UPDATE` di backend.',
      'Mengizinkan seluruh perubahan status bolak-balik bebas antar `DIAJUKAN`, `DISETUJUI`, dan `DITOLAK` selama dicatat di console server.',
      'Memaksa seluruh pengguna hanya boleh membuka satu tab browser dengan memblokir sesi jika ada dua permintaan dalam 10 menit.',
      'Mengubah kolom `status` menjadi array teks agar kedua nilai `["DISETUJUI", "DITOLAK"]` dapat tersimpan bersamaan pada satu dokumen.',
    ],
    akarMasalah:
      'Perintah `UPDATE ... WHERE id = :id` tanpa syarat guard state sebelumnya memungkinkan transisi ilegal dari state final (`DISETUJUI` -> `DITOLAK`) dan rentan race condition antar-tab.',
    solusiTerbaik:
      'Validasi transisi FSM atomik (`WHERE id = :id AND status = \'DIAJUKAN\'`) memastikan hanya permintaan pertama yang berhasil mengubah state (`affectedRows = 1`), sementara permintaan kedua langsung gagal bersih (`affectedRows = 0` -> `409 Conflict`) tanpa memicu efek samping ganda.',
    analisisPengecoh:
      'Menyembunyikan tombol di tab pertama tidak memperbarui tab kedua yang sudah terbuka; membiarkan transisi bebas merusak kepastian hukum dokumen; memblokir request 10 menit mengganggu operasional; menyimpan dua status kontradiktif merusak integritas domain.',
  },
  {
    level: 'C6',
    topik: 'RPL — Desain Arsitektur Integrasi API Gateway & BFF (Backend for Frontend)',
    pertanyaan:
      'Instansi mengoperasikan 6 microservice internal dan melayani dua klien sangat berbeda: (1) Portal Web Admin desktop yang menampilkan tabel rinci 40 kolom dari 4 layanan sekaligus, serta (2) Aplikasi Mobile Warga di daerah bersinyal lambat yang hanya butuh 5 field ringkas dalam satu panggilan cepat. Pola arsitektur lapisan tepi yang paling tepat adalah...',
    jawabanBenar:
      'Menerapkan **API Gateway** untuk cross-cutting concerns (autentikasi, rate limiting, logging) dikombinasikan dengan pola **Backend for Frontend (BFF)** terpisah untuk Web Admin dan Mobile Warga agar payload mobile teragregasi ringkas dalam satu round-trip tanpa membebani jaringan lambat.',
    pengecoh4: [
      'Memaksa aplikasi mobile warga memanggil langsung 6 microservice internal satu per satu dan mengunduh 40 kolom penuh lalu membuang 35 kolom di ponsel.',
      'Menggabungkan seluruh endpoint mobile dan web admin ke satu JSON raksasa berkapasitas 5 MB untuk setiap halaman agar tidak perlu menyesuaikan format respons.',
      'Membuka akses port database PostgreSQL dari 6 microservice langsung ke internet agar aplikasi mobile dapat menjalankan query SQL secara mandiri.',
      'Menghapus lapisan autentikasi pada endpoint mobile agar ukuran header HTTP berkurang beberapa puluh byte di daerah bersinyal lambat.',
    ],
    akarMasalah:
      'Satu API generik (one-size-fits-all) menyebabkan over-fetching data besar serta chattiness (banyak round-trip) yang membuat aplikasi mobile di wilayah sinyal lemah lambat dan boros kuota.',
    solusiTerbaik:
      'API Gateway + BFF memungkinkan lapisan khusus mobile mengagregasi panggilan internal di jaringan datacenter berkecepatan tinggi lalu mengirim satu payload JSON super ramping ke ponsel warga, sementara BFF web melayani kebutuhan tabel kaya bagi admin.',
    analisisPengecoh:
      'Memanggil 6 service dari ponsel menciptakan latensi tinggi dan mengekspos topologi internal; payload 5 MB melumpuhkan jaringan 3G/4G lemah; membuka port DB ke internet adalah pelanggaran keamanan fatal; menghapus autentikasi membuka kebocoran data total.',
  },
  {
    level: 'C5',
    topik: 'RPL — Manajemen Technical Debt & Refactoring Terukur (Strangler Fig)',
    pertanyaan:
      'Kementerian masih menjalankan sistem kepegawaian warisan (legacy monolith PHP 5.6) yang kritis melayani 200.000 ASN setiap hari, dokumentasinya minim, dan sangat sulit dipelihara. Pimpinan meminta modernisasi tanpa risiko kegagalan total proyek. Strategi migrasi perangkat lunak yang paling teruji dan minim risiko adalah...',
    jawabanBenar:
      'Menerapkan **Strangler Fig Pattern**: menempatkan routing proxy/API Gateway di depan sistem lama, lalu memigrasikan modul demi modul secara inkremental ke layanan modern (dimulai dari modul paling bernilai/berisiko terkelola dengan pengujian karakterisasi) hingga sistem lama dapat dipensiunkan aman.',
    pengecoh4: [
      'Menerapkan **Big Bang Rewrite**: membekukan seluruh perbaikan sistem lama selama 2 tahun sambil menulis ulang 100% fitur dari nol lalu memindahkan 200.000 ASN sekaligus pada satu malam.',
      'Membiarkan sistem PHP 5.6 tetap berjalan terbuka ke internet selamanya tanpa migrasi maupun isolasi keamanan karena sudah berfungsi selama 10 tahun.',
      'Mengganti versi PHP server produksi langsung dari 5.6 ke PHP 8.3 tanpa pengujian regresi maupun penyesuaian sintaks kode lama.',
      'Menyalin seluruh kode PHP 5.6 secara mentah ke dalam satu kontainer Docker lalu menganggap seluruh technical debt dan celah keamanan sudah terselesaikan.',
    ],
    akarMasalah:
      'Sistem legacy kritis menyimpan banyak aturan bisnis tak terdokumentasi; Big Bang Rewrite berisiko sangat tinggi gagal melewati tenggat atau kehilangan kasus tepi, sedangkan pembiaran PHP 5.6 (End-of-Life) membuka celah keamanan parah.',
    solusiTerbaik:
      'Strangler Fig Pattern memindahkan trafik secara bertahap per kemampuan bisnis melalui façade/proxy disertai characterization tests, menghasilkan nilai lebih cepat, risiko terkendali per rilis, dan rollback mudah per modul.',
    analisisPengecoh:
      'Big Bang Rewrite terkenal memiliki tingkat kegagalan tinggi pada sistem pemerintahan kompleks; membiarkan runtime EOL rentan eksploitasi siber; upgrade paksa tanpa uji langsung mematahkan layanan 200.000 ASN; membungkus kode EOL di Docker tidak menambal kerentanan runtime maupun arsitektur.',
  },
];
