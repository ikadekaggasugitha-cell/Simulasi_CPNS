import type { SkbHotsItem } from './skb_hots_builder';

export const SKB_JARINGAN_A: SkbHotsItem[] = [
  {
    level: 'C4',
    topik: 'Jaringan - Troubleshooting OSI Layer & TCP Handshake',
    pertanyaan:
      'Setelah pembaruan konfigurasi server API perizinan (`10.20.5.14:8443`), aplikasi frontend di subnet lain melaporkan `Connection Timed Out`. Tim jaringan menjalankan diagnostik dari server frontend dan memperoleh hasil berikut:\n\n```log\n$ ping -c 2 10.20.5.14\n64 bytes from 10.20.5.14: icmp_seq=1 ttl=63 time=0.82 ms\n\n$ tcpdump -ni eth0 host 10.20.5.14 and port 8443\n10:12:01.102 IP 10.20.2.10.49152 > 10.20.5.14.8443: Flags [S], seq 10421\n10:12:02.105 IP 10.20.2.10.49152 > 10.20.5.14.8443: Flags [S], seq 10421\n10:12:04.112 IP 10.20.2.10.49152 > 10.20.5.14.8443: Flags [S], seq 10421\n```\n\nBerdasarkan bukti log tersebut, di lapisan OSI manakah gangguan terjadi dan apa penyebab paling mungkin?',
    jawabanBenar:
      'Konektivitas Layer 1–3 normal (ICMP Echo Reply berhasil), namun terjadi pemblokiran diam-diam (silent DROP) pada Layer 4 (Transport) oleh firewall jaringan/host (`iptables`/`nftables`/Security Group) atau routing asimetris yang menjatuhkan paket TCP SYN port 8443 tanpa mengirim balasan RST.',
    pengecoh4: [
      'Terjadi kegagalan resolusi DNS pada Layer 7 (Application) karena klien tidak berhasil menerjemahkan nama domain API menjadi alamat IP `10.20.5.14` sebelum memulai koneksi.',
      'Kabel optik pada Layer 1 dan tabel MAC switch Layer 2 mengalami putus total sehingga tidak ada frame Ethernet apa pun yang dapat melintas dari subnet `10.20.2.0/24` menuju `10.20.5.0/24`.',
      'Proses layanan API pada server `10.20.5.14` pasti sedang berhenti (port closed) tanpa firewall sama sekali, karena OS Linux secara standar selalu mendiamkan paket SYN pada port tertutup tanpa membalas apa pun.',
      'Terjadi ketidakcocokan cipher suite TLS 1.3 pada Layer 6 (Presentation) yang membuat server menolak sertifikat klien setelah three-way handshake selesai.',
    ],
    akarMasalah:
      'Ping berhasil membuktikan jalur L1–L3 dan routing dasar hidup, tetapi TCP SYN yang berulang tanpa SYN-ACK maupun RST menandakan paket TCP port 8443 di-DROP secara diam-diam di jalur L4 (firewall/ACL atau asymmetric drop).',
    solusiTerbaik:
      'Mengisolasi gangguan pada aturan firewall/ACL (host atau perimeter) untuk TCP port 8443 dan memverifikasi jalur balik TCP menghindari pencarian keliru di DNS, kabel fisik, atau sertifikat TLS.',
    analisisPengecoh:
      'Alamat IP sudah dipakai langsung sehingga bukan DNS; ICMP reply membuktikan L1–L3 aktif; port tertutup tanpa firewall biasanya membalas `TCP RST` (Connection Refused), bukan timeout diam; TLS handshake baru terjadi setelah TCP three-way handshake selesai.',
  },
  {
    level: 'C4',
    topik: 'Jaringan - Analisis Trunk 802.1Q & Native VLAN Mismatch',
    pertanyaan:
      'Dua switch distribusi di gedung kantor pusat dihubungkan menggunakan tautan trunk IEEE 802.1Q yang membawa VLAN 10 (Pegawai), VLAN 20 (Pelayanan), dan VLAN 99 (Manajemen). Setelah teknisi menambahkan switch baru, muncul pesan log berulang berikut serta trafik manajemen putus:\n\n```log\n%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/24 (99), with SW-DIST-2 GigabitEthernet0/24 (1).\n```\n\nApa dampak keamanan serta konektivitas dari kesalahan konfigurasi tersebut dan bagaimana perbaikan paling tepat?',
    jawabanBenar:
      'Frame tanpa tag (untagged) dari VLAN 99 di Switch-1 diterima sebagai VLAN 1 di Switch-2 sehingga terjadi kebocoran domain broadcast antar-VLAN (VLAN hopping/cross-talk) dan terputusnya akses manajemen; samakan konfigurasi `switchport trunk native vlan` di kedua ujung trunk (gunakan VLAN tidak terpakai khusus native atau aktifkan penandaan native VLAN `vlan dot1q tag native`).',
    pengecoh4: [
      'Menonaktifkan protokol CDP/LLDP di kedua switch agar pesan log peringatan berhenti muncul di konsol sehingga paket untagged VLAN 99 otomatis diarahkan ke VLAN 1 secara aman.',
      'Mengubah kedua port trunk menjadi mode `switchport mode access` pada VLAN 1 agar seluruh trafik VLAN 10, 20, dan 99 bergabung dalam satu domain broadcast tanpa perlu header 802.1Q.',
      'Mengganti kabel patch cord Cat6 pada GigabitEthernet0/24 menjadi kabel crossover karena standar IEEE 802.1Q mewajibkan kabel crossover untuk menyamakan ID Native VLAN.',
      'Menaikkan nilai MTU port trunk menjadi 9000 byte (Jumbo Frame) agar switch otomatis membaca tag VLAN 99 pada frame untagged tanpa menyamakan konfigurasi native VLAN.',
    ],
    akarMasalah:
      'Perbedaan Native VLAN (99 vs 1) pada kedua sisi trunk 802.1Q menyebabkan frame untagged berpindah VLAN secara diam-diam antar-switch, memutus konektivitas manajemen sekaligus membuka celah VLAN hopping.',
    solusiTerbaik:
      'Menyamakan Native VLAN di kedua sisi trunk (sebaiknya ke VLAN parkir khusus yang tidak dipakai pengguna, atau memaksa semua frame termasuk native bertag) memulihkan isolasi L2 secara deterministik.',
    analisisPengecoh:
      'Mematikan CDP hanya menyembunyikan gejala log tanpa memperbaiki kebocoran trafik; mode access menghilangkan kemampuan membawa multi-VLAN; kabel crossover tidak terkait konfigurasi VLAN logis; Jumbo Frame tidak memperbaiki ketidakcocokan Native VLAN.',
  },
  {
    level: 'C5',
    topik: 'Jaringan - Pencegahan Broadcast Storm & STP BPDU Guard',
    pertanyaan:
      'Seluruh jaringan LAN lantai 3 kantor pelayanan tiba-tiba lumpuh total, CPU core switch melonjak ke 99%, dan lampu LED seluruh port berkedip serentak sangat cepat. Pemeriksaan log switch akses menemukan seorang pegawai tidak sengaja mencolokkan dua ujung kabel patch cord yang sama ke dua port dinding ruang rapat yang dikonfigurasi `spanning-tree portfast` tanpa fitur proteksi tambahan.\n\nEvaluasi penyebab kelumpuhan jaringan tersebut dan kombinasi fitur Layer 2 manakah yang paling tepat untuk mencegah insiden serupa?',
    jawabanBenar:
      'PortFast langsung memindahkan port ke status Forwarding tanpa melewati tahap Listening/Learning sehingga terbentuk Layer 2 switching loop yang memicu broadcast storm; aktifkan `BPDU Guard` pada seluruh port akses PortFast agar port otomatis masuk status `err-disabled` begitu menerima BPDU, serta aktifkan `Root Guard` di port distribusi dan `Storm Control` sebagai lapisan pengaman.',
    pengecoh4: [
      'Menonaktifkan Spanning Tree Protocol (STP/RSTP) sepenuhnya di seluruh switch akses karena perhitungan algoritma STP yang memakan 99% CPU saat mendeteksi kabel tambahan.',
      'Mengganti protokol routing OSPF menjadi static routing pada router perimeter agar frame broadcast Ethernet tidak berputar di antara port switch lantai 3.',
      'Menurunkan kecepatan seluruh port dinding dari 1 Gbps menjadi 100 Mbps Half-Duplex supaya kapasitas broadcast storm melambat tanpa perlu mengaktifkan proteksi BPDU.',
      'Mengaktifkan fitur DHCP Snooping saja pada port trunk core switch karena broadcast storm pasti selalu dipicu oleh konflik alamat IP dari rogue DHCP server.',
    ],
    akarMasalah:
      'Layer 2 loop pada port yang memiliki `portfast` memicu banjir frame broadcast/unknown unicast tak berujung (Ethernet tidak memiliki field TTL seperti IP) yang melumpuhkan bandwidth dan CPU switch.',
    solusiTerbaik:
      '`BPDU Guard` mematikan otomatis (`err-disabled`) port akses yang menerima BPDU (dari kabel loop atau switch liar), `Root Guard` melindungi topologi Root Bridge, dan `Storm Control` membatasi ambang broadcast.',
    analisisPengecoh:
      'Mematikan STP justru menjamin loop permanen di seluruh topologi redundan; routing L3 tidak menghentikan loop L2 di dalam domain broadcast switch yang sama; menurunkan kecepatan ke 100 Mbps Half-Duplex tetap melumpuhkan LAN; DHCP Snooping tidak mencegah physical cable loop.',
  },
  {
    level: 'C6',
    topik: 'Jaringan - Perancangan Subnetting VLSM Efisien',
    pertanyaan:
      'Seorang Pengelola Sistem & Jaringan mendapat blok alamat IP privat `10.40.16.0/22` (total 1.024 alamat) untuk dibagi menggunakan VLSM ke empat VLAN kantor dinas baru dengan kebutuhan host aktif sebagai berikut:\n\n```text\n1. VLAN Pegawai    : 420 host\n2. VLAN Pelayanan  : 200 host\n3. VLAN Server DMZ :  55 host\n4. VLAN Manajemen  :  25 host\n```\n\nJika alokasi dilakukan berurutan dari kebutuhan terbesar ke terkecil tanpa tumpang tindih (overlap), rancangan blok CIDR manakah yang paling tepat dan berapa sisa alamat IP yang masih tersedia untuk ekspansi?',
    jawabanBenar:
      'Pegawai `10.40.16.0/23`, Pelayanan `10.40.18.0/24`, Server DMZ `10.40.19.0/26`, dan Manajemen `10.40.19.64/27`, menyisakan tepat 160 alamat IP (`10.40.19.96`–`10.40.19.255`) untuk ekspansi.',
    pengecoh4: [
      'Pegawai `10.40.16.0/24`, Pelayanan `10.40.17.0/24`, Server DMZ `10.40.18.0/26`, dan Manajemen `10.40.18.64/27`, menyisakan 416 alamat IP untuk ekspansi.',
      'Pegawai `10.40.16.0/23`, Pelayanan `10.40.18.0/24`, Server DMZ `10.40.19.0/27`, dan Manajemen `10.40.19.32/28`, menyisakan 208 alamat IP untuk ekspansi.',
      'Pegawai `10.40.16.0/23`, Pelayanan `10.40.17.0/24`, Server DMZ `10.40.18.0/26`, dan Manajemen `10.40.18.64/27`, menyisakan 160 alamat IP untuk ekspansi.',
      'Pegawai `10.40.16.0/22`, Pelayanan `10.40.18.0/24`, Server DMZ `10.40.19.0/26`, dan Manajemen `10.40.19.64/27`, menyisakan 0 alamat IP untuk ekspansi.',
    ],
    akarMasalah:
      'Perancangan VLSM harus memenuhi rumus 2^h - 2 >= jumlah host tanpa overlap dan mematuhi batas kelipatan blok CIDR.',
    solusiTerbaik:
      '420 host -> /23 (512 IP: 16.0–17.255); 200 host -> /24 (256 IP: 18.0–18.255); 55 host -> /26 (64 IP: 19.0–19.63); 25 host -> /27 (32 IP: 19.64–19.95). Total terpakai 512+256+64+32 = 864 IP, sisa 1.024 - 864 = 160 IP.',
    analisisPengecoh:
      '`/24` untuk Pegawai hanya menampung 254 host (kurang untuk 420); `/27` (30 host) dan `/28` (14 host) tidak cukup untuk 55 dan 25 host; `10.40.17.0/24` tumpang tindih dengan `10.40.16.0/23`; `/22` langsung menghabiskan seluruh blok 1.024 IP.',
  },
  {
    level: 'C4',
    topik: 'Jaringan - Diagnosis Kesalahan Subnet Mask & ARP',
    pertanyaan:
      'Server Aplikasi A (`192.168.10.62`) tidak dapat menghubungi Server Database B (`192.168.10.65`) meskipun keduanya dapat di-ping dari router gateway (`192.168.10.1` dan `192.168.10.126`). Pemeriksaan konfigurasi antarmuka menunjukkan:\n\n```text\nServer A : IP 192.168.10.62  Mask 255.255.255.128 (/25)  GW 192.168.10.1\nServer B : IP 192.168.10.65  Mask 255.255.255.192 (/26)  GW 192.168.10.126\nRouter   : Subinterface-1 = 192.168.10.1/26, Subinterface-2 = 192.168.10.126/26\n```\n\nMengapa Server A gagal mencapai Server B berdasarkan cara kerja lapisan jaringan?',
    jawabanBenar:
      'Karena dikonfigurasi dengan mask `/25` (`192.168.10.0`–`192.168.10.127`), Server A keliru menganggap Server B (`192.168.10.65`) berada di subnet lokal yang sama sehingga ia mengirim ARP Request broadcast alih-alih meneruskan paket ke default gateway `192.168.10.1`; ubah mask Server A menjadi `/26` (`255.255.255.192`).',
    pengecoh4: [
      'Alamat IP `192.168.10.62` merupakan alamat broadcast untuk subnet `/26` sehingga router gateway secara otomatis membuang seluruh paket yang berasal dari Server A.',
      'Server B (`192.168.10.65`) menggunakan alamat network ID pada subnet `/26` kedua sehingga stack TCP/IP Linux menolak memproses paket masuk dari subnet mana pun.',
      'Default gateway Server B (`192.168.10.126`) berada di luar rentang subnet `192.168.10.64/26`, sehingga Server B tidak pernah bisa berkomunikasi dengan router.',
      'Router tidak dapat melakukan perutean (routing) antara dua subinterface yang menggunakan panjang prefix `/26` identik pada blok jaringan `192.168.10.0` yang sama.',
    ],
    akarMasalah:
      'Mask `/25` pada Server A terlalu lebar sehingga bitwise AND antara IP tujuan `.65` dan mask `/25` menyimpulkan tujuan masih lokal, membuat Server A tidak mengirim frame ke MAC address gateway.',
    solusiTerbaik:
      'Mengoreksi mask Server A menjadi `/26` (`255.255.255.192`) membuat Server A mengenali `.65` berada di subnet berbeda (`192.168.10.64/26`) lalu meneruskan paket melalui gateway `192.168.10.1`.',
    analisisPengecoh:
      'Pada `/26` pertama (`.0`–`.63`), alamat broadcast adalah `.63`, bukan `.62`; pada `/26` kedua (`.64`–`.127`), network ID adalah `.64`, jadi `.65` adalah host valid pertama dan `.126` adalah host valid terakhir; router normal merutekan antar-subnet `/26` yang tidak tumpang tindih.',
  },
  {
    level: 'C5',
    topik: 'Jaringan - Route Summarization (CIDR Supernetting)',
    pertanyaan:
      'Router pusat Kominfo daerah terhubung ke empat jaringan kantor kecamatan yang memiliki alokasi subnet berurutan: `172.24.32.0/24`, `172.24.33.0/24`, `172.24.34.0/24`, dan `172.24.35.0/24`. Sementara itu, subnet `172.24.36.0/24` milik instansi lain berada di jalur router yang berbeda. Administrator ingin meringkas keempat rute kecamatan menjadi satu entri summary route yang presisi agar tidak menarik trafik milik `172.24.36.0/24`.\n\nEntri summary route manakah yang paling tepat dan presisi?',
    jawabanBenar:
      '`172.24.32.0/22` karena 22 bit pertama dari keempat oktet (32=`00100000` hingga 35=`00100011`) identik dan tepat mencakup rentang `172.24.32.0` hingga `172.24.35.255` tanpa menyentuh `172.24.36.0/24`.',
    pengecoh4: [
      '`172.24.32.0/21` karena prefix `/21` merangkum tepat empat blok `/24` mulai dari oktet 32 hingga 35 dengan subnet mask `255.255.248.0`.',
      '`172.24.32.0/23` karena membutuhkan penurunan satu bit dari `/24` agar keempat blok alamat kecamatan dapat digabung ke dalam satu tabel routing.',
      '`172.24.30.0/22` karena blok summary harus selalu dimulai dua angka di bawah subnet pertama untuk menyisakan cadangan alamat network dan broadcast.',
      '`172.24.32.0/20` karena lebih hemat memori TCAM router dan tidak akan memengaruhi rute `172.24.36.0/24` meskipun prefix-nya lebih umum.',
    ],
    akarMasalah:
      'Ringkasan rute yang terlalu sempit memutus sebagian kecamatan, sedangkan ringkasan terlalu lebar melampaui batas blok dan berisiko menyebabkan blackhole atau sub-optimal routing.',
    solusiTerbaik:
      '4 blok `/24` berurutan mulai kelipatan 4 (`32` habis dibagi 4) tepat diringkas menjadi `/22` (`24 - log2(4) = 22`), yakni `172.24.32.0/22` (32.0–35.255).',
    analisisPengecoh:
      '`/21` mencakup 8 blok `/24` (32–39) sehingga menelan `36.0/24`; `/23` hanya mencakup 2 blok (32–33); `172.24.30.0` bukan kelipatan 4 sehingga bukan network address valid untuk `/22`; `/20` mencakup 16 blok (32–47) yang terlalu lebar dan memicu risiko routing jika rute spesifik `.36.0/24` sedang flap.',
  },
  {
    level: 'C4',
    topik: 'Jaringan - Troubleshooting DNS Split-Horizon & TTL Migrasi',
    pertanyaan:
      'Instansi memigrasikan portal publik `layanan.pemda.go.id` ke alamat IP server baru di Pusat Data Nasional. Meski record `A` di authoritative DNS sudah diubah 2 jam lalu, 40% masyarakat dan pegawai di beberapa ISP masih diarahkan ke IP server lama, sementara pegawai di dalam LAN kantor justru mendapatkan error `NXDOMAIN`. Pemeriksaan zona DNS sebelum migrasi menunjukkan `TTL = 86400` dan jaringan kantor memiliki internal DNS resolver dengan zona privat `pemda.go.id`.\n\nApa akar dari kedua masalah tersebut dan langkah perbaikan terbaiknya?',
    jawabanBenar:
      'Masyarakat masih menerima IP lama karena TTL sebelumnya 86400 detik (24 jam) sehingga recursive resolver ISP masih meng-cache record lama (seharusnya TTL diturunkan ke 300 detik minimal 24 jam sebelum cutover), sedangkan pegawai kantor mendapat `NXDOMAIN` karena zona Split-Horizon pada DNS internal belum ditambahkan record `A` untuk `layanan.pemda.go.id`.',
    pengecoh4: [
      'Error `NXDOMAIN` di kantor terjadi karena router kantor memblokir port TCP 443, sedangkan keterlambatan di ISP disebabkan server web baru belum mengaktifkan protokol HTTP/3.',
      'Record `A` harus diganti menjadi record `MX` dengan prioritas 10 agar seluruh recursive resolver ISP segera menghapus cache TTL 86400 detik secara paksa dalam 1 menit.',
      'Menghapus seluruh record `NS` pada domain `pemda.go.id` di registrar `.go.id` lalu memaksa seluruh warga menyunting berkas `/etc/hosts` di perangkat masing-masing.',
      'Menaikkan nilai TTL pada zona DNS publik menjadi 604800 detik (7 hari) setelah migrasi agar resolver ISP segera memperbarui entri cache lebih cepat.',
    ],
    akarMasalah:
      'Nilai TTL tinggi (24 jam) menahan propagasi perubahan IP di recursive resolver eksternal, dan konfigurasi Split-Horizon DNS internal yang tidak sinkron menjawab otoritatif `NXDOMAIN` untuk subdomain yang belum terdaftar secara lokal.',
    solusiTerbaik:
      'Menambahkan/menyamakan record pada zona DNS internal segera menyelesaikan `NXDOMAIN` pegawai, dan sebagai praktik standar migrasi DNS, menurunkan TTL jauh sebelum cutover (minimal selang 1x TTL lama) memastikan transisi publik mulus.',
    analisisPengecoh:
      'Port 443 dan HTTP/3 tidak menimbulkan `NXDOMAIN` DNS; record `MX` khusus mail server bukan web host; menghapus `NS` melumpuhkan seluruh domain; menaikkan TTL justru memperlama penyimpanan cache di masa depan dan tidak memaksa invalidate cache yang sudah ada.',
  },
  {
    level: 'C4',
    topik: 'Jaringan - MTU / Path MTU Discovery Blackhole pada VPN IPsec',
    pertanyaan:
      'Setelah menghubungkan kantor cabang ke pusat data melalui terowongan VPN GRE over IPsec, koneksi `ping` ukuran kecil dan sesi SSH teks pendek berjalan normal. Namun, setiap kali pegawai membuka halaman web portal yang memuat berkas JS/PDF besar atau menjalankan perintah `ls -la` panjang via SSH, koneksi langsung membeku (*hang*). Pengamatan `tcpdump` menunjukkan paket TCP berukuran 1.500 byte tidak pernah tiba dan firewall perimeter memblokir seluruh trafik ICMP.\n\nApa penyebab fenomena tersebut dan solusi jaringan paling tepat?',
    jawabanBenar:
      'Overhead enkapsulasi GRE + IPsec mengurangi MTU efektif terowongan di bawah 1.500 byte, sementara pemblokiran total ICMP mencegah pesan `ICMP Type 3 Code 4 (Fragmentation Needed)` tiba di pengirim (PMTUD blackhole); izinkan ICMP Fragmentation Needed di firewall serta terapkan `TCP MSS Clamping` (misal 1360–1400 byte) dan sesuaikan MTU antarmuka tunnel.',
    pengecoh4: [
      'Enkripsi IPsec secara bawaan hanya mendukung protokol UDP dan ICMP sehingga semua paket TCP berukuran di atas 512 byte pasti dibuang oleh standar RFC IPsec.',
      'Menurunkan kecepatan antarmuka WAN kantor cabang dari 100 Mbps menjadi 10 Mbps agar paket 1.500 byte memiliki waktu transmisi lebih lama dan tidak membeku.',
      'Menonaktifkan enkripsi ESP pada terowongan IPsec dan mengubahnya menjadi plaintext agar ukuran header tidak bertambah meski trafik melintasi internet publik.',
      'Memblokir seluruh paket TCP SYN yang membawa opsi `MSS` di router cabang agar sistem operasi server selalu memaksa ukuran segmen 1.500 byte.',
    ],
    akarMasalah:
      'PMTUD blackhole terjadi saat paket bertanda DF (`Don\'t Fragment`) melebihi MTU tunnel GRE/IPsec (~1400–1420 byte), tetapi pesan ICMP Fragmentation Needed diblokir firewall sehingga pengirim terus mengirim ulang paket kebesaran.',
    solusiTerbaik:
      'Mengizinkan ICMP Type 3 Code 4 (dan ICMPv6 Packet Too Big) memulihkan Path MTU Discovery, sementara `TCP MSS Clamping` di router tunnel memastikan ukuran segmen TCP sejak awal handshake muat tanpa fragmentasi.',
    analisisPengecoh:
      'IPsec sepenuhnya mendukung TCP segala ukuran; menurunkan bandwidth tidak menyelesaikan masalah batas MTU; mematikan enkripsi ESP di internet publik melanggar keamanan; memblokir opsi MSS justru memperparah blackhole.',
  },
  {
    level: 'C5',
    topik: 'Jaringan - Evaluasi Urutan Rule Firewall & Stateful Inspection',
    pertanyaan:
      'Administrator firewall perimeter ingin mengizinkan akses HTTPS (443) dari internet ke web server DMZ (`10.50.1.10`) sekaligus memblokir satu alamat IP penyerang (`203.0.113.55`) yang terus melakukan serangan. Namun setelah aturan berikut diterapkan (evaluasi top-down first-match), IP `203.0.113.55` ternyata masih tetap bisa mengakses web server DMZ:\n\n```text\nRule 10: PERMIT tcp any          -> 10.50.1.10/32 eq 443\nRule 20: DENY   ip  203.0.113.55 -> 10.50.1.10/32 any\nRule 30: DENY   ip  any          -> any           any\n```\n\nEvaluasi penyebab kegagalan pemblokiran tersebut dan tentukan koreksi paling tepat.',
    jawabanBenar:
      'Firewall mengevaluasi aturan secara berurutan dari atas ke bawah (first-match wins), sehingga trafik dari `203.0.113.55` ke port 443 langsung cocok dan diizinkan oleh `Rule 10` sebelum sempat diperiksa oleh `Rule 20` (rule shadowing); pindahkan aturan spesifik `DENY 203.0.113.55` di atas aturan umum `PERMIT any` (misal menjadi Rule 5).',
    pengecoh4: [
      'Aturan `Rule 30: DENY any any` di bagian paling bawah mengesampingkan `Rule 20` sehingga `Rule 20` tidak dieksekusi oleh mesin stateful firewall.',
      'Protokol `tcp` pada `Rule 10` memiliki prioritas lebih tinggi secara intrinsik dibandingkan protokol `ip` pada `Rule 20` terlepas dari urutan nomor barisnya.',
      'Firewall stateful hanya mampu memblokir alamat IP privat (RFC 1918) dan tidak dapat memfilter alamat IP publik seperti `203.0.113.55`.',
      'Menghapus `Rule 30: DENY any any` dan menggantinya dengan `PERMIT any any` agar firewall berpindah ke mode bottom-up evaluation.',
    ],
    akarMasalah:
      'Terjadi *rule shadowing* pada ACL/firewall: aturan yang terlalu luas (`PERMIT tcp any -> ... 443`) diletakkan sebelum aturan pengecualian yang lebih spesifik (`DENY 203.0.113.55`).',
    solusiTerbaik:
      'Menempatkan aturan paling spesifik (pengecualian/blokir IP tertentu) di atas aturan yang lebih umum, diikuti implicit/explicit `DENY any any` di paling bawah, menegakkan kebijakan first-match secara tepat.',
    analisisPengecoh:
      'Rule 30 berada di bawah sehingga tidak pernah membayangi Rule 20; urutan baris bukan jenis protokol yang menentukan evaluasi ACL standar; firewall tentu dapat memfilter IP publik; mengganti default-deny menjadi permit-any membuka seluruh jaringan ke internet.',
  },
  {
    level: 'C4',
    topik: 'Jaringan - OSPF Adjacency Stuck & Asymmetric Routing',
    pertanyaan:
      'Dua router inti gedung A dan gedung B gagal membentuk neighbor adjacency OSPF setelah pergantian perangkat di gedung B. Keluaran perintah diagnostik menunjukkan state macet di `EXSTART/EXCHANGE` secara berulang:\n\n```log\n%OSPF-5-ADJCHG: Process 1, Nbr 10.255.0.2 on Gi0/1 from EXCHANGE to DOWN, Neighbor Down: Too many retransmissions\nR1 Gi0/1: IP 10.0.0.1/30, Area 0, Hello 10s, Dead 40s, MTU 1500\nR2 Gi0/1: IP 10.0.0.2/30, Area 0, Hello 10s, Dead 40s, MTU 9000\n```\n\nBerdasarkan keluaran tersebut, mengapa adjacency OSPF gagal mencapai state `FULL` dan apa perbaikan terbaik?',
    jawabanBenar:
      'OSPF memverifikasi kesesuaian nilai MTU di paket Database Description (DBD) pada tahap `EXSTART/EXCHANGE`, dan ketidakcocokan MTU (`1500` vs `9000`) menyebabkan paket DBD ditolak berulang kali; samakan nilai MTU fisik pada kedua antarmuka router (misal keduanya `1500` atau keduanya `9000` jika didukung link) daripada sekadar menyembunyikannya dengan `mtu-ignore`.',
    pengecoh4: [
      'Kedua router menggunakan `Hello 10s` dan `Dead 40s` yang identik, padahal OSPF mewajibkan router bersebelahan memiliki timer Hello yang berbeda agar tidak saling bertabrakan.',
      'Kedua antarmuka berada di `Area 0`, sedangkan spesifikasi OSPF melarang dua router saling terhubung langsung dalam satu area yang sama tanpa Area Border Router di tengahnya.',
      'Subnet `/30` pada `10.0.0.1` dan `10.0.0.2` tidak memiliki alamat host yang valid sehingga paket Hello tidak pernah mencapai tahap `2-WAY`.',
      'Nilai Router ID `10.255.0.2` lebih besar daripada alamat antarmuka `10.0.0.1` sehingga OSPF menolak pemilihan Master/Slave pada fase `EXSTART`.',
    ],
    akarMasalah:
      'Mismatch MTU (1500 vs 9000) tidak menghalangi paket Hello (sehingga lolos ke `2-WAY`), namun menggagalkan pertukaran Database Description (DBD) di fase `EXSTART/EXCHANGE`.',
    solusiTerbaik:
      'Menyamakan MTU antarmuka pada kedua ujung link menyelesaikan negosiasi DBD sekaligus mencegah drop paket data besar di lapisan data-plane (yang tetap bisa terjadi jika hanya memakai `ip ospf mtu-ignore`).',
    analisisPengecoh:
      'Timer Hello/Dead justru wajib identik antar-neighbor; dua router dalam Area 0 sangat normal; `/30` memiliki tepat 2 host valid (`.1` dan `.2`); perbedaan Router ID justru diperlukan agar pemilihan Master/Slave berhasil.',
  },
  {
    level: 'C6',
    topik: 'Jaringan - Arsitektur High Availability dengan VRRP/Keepalived',
    pertanyaan:
      'Portal layanan pajak daerah berjalan di atas dua Reverse Proxy Nginx (`Proxy-1` dan `Proxy-2`) yang melayani trafik dari satu alamat IP publik/VIP `103.40.10.25`. Saat ini jika `Proxy-1` mengalami kernel panic, tim harus mengubah record DNS secara manual sehingga terjadi downtime 15–30 menit. Instansi mensyaratkan failover otomatis di bawah 5 detik tanpa mengubah alamat IP tujuan klien.\n\nRancangan infrastruktur High Availability manakah yang paling tepat diterapkan pada kedua reverse proxy tersebut?',
    jawabanBenar:
      'Mengonfigurasi VRRP (melalui `Keepalived`) di `Proxy-1` (MASTER, priority lebih tinggi) dan `Proxy-2` (BACKUP) untuk berbagi Virtual IP (`103.40.10.25`), dilengkapi health-check script (`vrrp_script`) yang memantau proses Nginx dan mengirimi Gratuitous ARP saat failover, serta memastikan jalur heartbeat aman terhadap split-brain.',
    pengecoh4: [
      'Memasang alamat IP statis `103.40.10.25` secara langsung dan bersamaan pada antarmuka `eth0` kedua server tanpa protokol koordinasi agar switch secara otomatis membagi paket ke server yang sedang menyala.',
      'Mengandalkan DNS Round-Robin ke dua alamat IP berbeda tanpa health check karena browser klien secara standar otomatis berpindah IP dalam 1 detik saat satu server mengalami kernel panic.',
      'Menjadwalkan cron job `rsync` setiap 1 menit antara `Proxy-1` dan `Proxy-2` agar jika `Proxy-1` mati, `Proxy-2` otomatis mewarisi sesi TCP yang sedang aktif di memori `Proxy-1`.',
      'Mematikan seluruh fitur firewall pada `Proxy-1` supaya beban CPU menurun sehingga kernel panic tidak mungkin terjadi lagi dan `Proxy-2` cukup dibiarkan dalam keadaan mati (*cold standby*).',
    ],
    akarMasalah:
      'Ketergantungan pada single-node reverse proxy dengan failover DNS manual menimbulkan downtime puluhan menit akibat cache TTL DNS dan intervensi operator.',
    solusiTerbaik:
      'VRRP/Keepalived dengan health check aplikasi Nginx memindahkan Virtual IP beserta Gratuitous ARP ke node standby dalam hitungan ~1–3 detik secara otomatis tanpa mengubah IP klien.',
    analisisPengecoh:
      'Memasang IP statis sama di dua server tanpa VRRP menimbulkan IP conflict dan ARP flapping; DNS Round-Robin tetap mengarahkan 50% trafik ke node mati hingga timeout panjang; `rsync` hanya menyalin berkas, bukan state TCP/VIP; cold standby tetap menimbulkan downtime manual dan mematikan firewall melanggar keamanan.',
  },
  {
    level: 'C5',
    topik: 'Jaringan - Evaluasi L4 vs L7 Load Balancing & Health Checks',
    pertanyaan:
      'Sebuah portal pendaftaran CPNS menggunakan Load Balancer di depan 6 server aplikasi. Saat salah satu server aplikasi kehabisan koneksi database, proses web server-nya tetap membuka port TCP 8080 tetapi selalu mengembalikan `HTTP 500 Internal Server Error`. Akibatnya 1 dari 6 pelamar terus gagal mendaftar karena Load Balancer masih menganggap server tersebut sehat.\n\nEvaluasi penyebab kegagalan deteksi Load Balancer dan perbaikan konfigurasi paling tepat:',
    jawabanBenar:
      'Load Balancer masih memakai health check pasif/Layer 4 (sekadar TCP port open) sehingga tidak mendeteksi error logika aplikasi; gunakan Layer 7 HTTP health check yang memanggil endpoint `/health/ready` (memverifikasi konektivitas dependensi kritis dan mengembalikan HTTP 200), serta pertimbangkan algoritma *Least Connections* untuk beban request yang bervariasi.',
    pengecoh4: [
      'Mengganti metode health check dari TCP port 8080 menjadi `ICMP Ping` agar Load Balancer lebih cepat mendeteksi kehabisan koneksi database pada server aplikasi.',
      'Mematikan fitur health check sepenuhnya lalu mengubah algoritma distribusi menjadi `IP Hash` agar hanya sebagian pelamar dari IP tertentu yang terdampak error 500.',
      'Menaikkan interval health check dari 5 detik menjadi 300 detik agar server aplikasi yang sedang kehabisan koneksi database tidak terbebani oleh pengecekan berkala.',
      'Mengubah konfigurasi server aplikasi agar endpoint `/health` selalu mengembalikan `HTTP 200 OK` secara statis meskipun koneksi database sedang putus agar status dashboard tetap hijau.',
    ],
    akarMasalah:
      'TCP health check (L4) hanya memastikan soket mendengarkan (SYN-ACK), tidak mengetahui bahwa aplikasi gagal melayani permintaan (HTTP 500) karena dependensi database bermasalah.',
    solusiTerbaik:
      'HTTP L7 readiness probe (`/health/ready`) memvalidasi kesehatan fungsional aplikasi secara nyata sehingga node yang mengembalikan HTTP 500/503 segera dikeluarkan dari pool trafik.',
    analisisPengecoh:
      'ICMP Ping (L3) bahkan lebih dangkal daripada TCP (L4) karena tidak mengecek aplikasi sama sekali; `IP Hash` tanpa health check tetap mengarahkan korban yang sama ke server rusak; interval 300 detik memperlambat deteksi kegagalan selama 5 menit; `/health` statis 200 menyembunyikan kerusakan nyata dari Load Balancer.',
  },
  {
    level: 'C4',
    topik: 'Jaringan - Reverse Proxy TLS Termination & X-Forwarded-For Spoofing',
    pertanyaan:
      'Aplikasi audit log pemerintah mencatat alamat IP klien setiap kali pejabat menandatangani surat elektronik. Setelah sistem dipindahkan ke belakang Nginx Reverse Proxy (`10.10.0.5`), seluruh catatan audit tiba-tiba menampilkan IP `10.10.0.5`. Ketika pengembang mencoba membaca header `X-Forwarded-For` langsung dari klien tanpa konfigurasi proxy yang benar, pentester berhasil memalsukan IP audit dengan mengirim header `X-Forwarded-For: 127.0.0.1`.\n\nPerbaikan konfigurasi Nginx dan aplikasi manakah yang paling tepat?',
    jawabanBenar:
      'Konfigurasikan Nginx untuk menimpa/menambahkan IP koneksi TCP asli (`proxy_set_header X-Real-IP $remote_addr;` dan `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`) dan di sisi aplikasi hanya memercayai hop `trusted proxy` (`10.10.0.5`) dengan mengambil entri IP paling kanan yang ditambahkan oleh proxy terpercaya (atau `X-Real-IP` yang ditimpa edge proxy).',
    pengecoh4: [
      'Menghapus seluruh konfigurasi Reverse Proxy Nginx dan membuka port Node.js aplikasi langsung ke internet publik tanpa TLS karena Reverse Proxy tidak pernah bisa meneruskan IP asli klien.',
      'Mengambil alamat IP paling kiri dari header `X-Forwarded-For` secara langsung di kode aplikasi tanpa mengatur `trust proxy` agar selalu mendapatkan IP asal yang ditulis klien.',
      'Meminta Nginx menambahkan header `X-Forwarded-For: 127.0.0.1` untuk setiap request agar catatan audit terlihat seragam dan hemat ruang penyimpanan basis data.',
      'Mengaktifkan protokol HTTP/1.0 antara Nginx dan backend karena HTTP/1.0 secara otomatis mempertahankan alamat IP sumber klien pada lapisan TCP tanpa NAT.',
    ],
    akarMasalah:
      'Koneksi TCP ke backend berasal dari IP proxy (`10.10.0.5`), sedangkan membaca sisi kiri `X-Forwarded-For` tanpa trust boundary memungkinkan klien menyuntikkan nilai IP palsu.',
    solusiTerbaik:
      'Edge proxy menetapkan `$remote_addr` yang tidak dapat dipalsukan klien dan backend mengonfigurasi daftar `trusted proxies` eksplisit sehingga hanya header dari proxy tepercaya yang diinterpretasikan.',
    analisisPengecoh:
      'Menghapus reverse proxy menghilangkan TLS termination, buffering, dan isolasi DMZ; nilai paling kiri `X-Forwarded-For` dapat dipalsukan klien secara trivial; hard-code `127.0.0.1` merusak integritas audit trail; HTTP/1.0 tidak mengubah sifat koneksi TCP proxy.',
  },
  {
    level: 'C4',
    topik: 'Jaringan - NAT/PAT Port Exhaustion pada Jaringan Kantor Besar',
    pertanyaan:
      'Sebuah gedung kementerian berkapasitas 3.500 pegawai dan perangkat IoT berbagi satu alamat IP publik tunggal pada router NAT/PAT (`overload`). Pada jam sibuk pukul 09.00–11.00 WIB, banyak pegawai melaporkan halaman web eksternal gagal terbuka secara acak meskipun penggunaan bandwidth internet baru mencapai 35%. Log firewall perimeter mencatat:\n\n```log\n%FW-4-NAT_ALLOC_FAIL: Failed to allocate PAT translation port for src 10.15.42.88 -> 142.250.4.100:443 (pool exhausted)\n```\n\nApa akar permasalahan teknis tersebut dan solusi jaringan paling tepat?',
    jawabanBenar:
      'Satu alamat IP publik hanya memiliki batas teoritis ~64.512 port sumber ephemeral per protokol/tujuan sehingga ribuan perangkat dengan banyak koneksi paralel (HTTP/2, WebSocket, tab browser) menghabiskan tabel translasi PAT; perluas NAT pool menggunakan beberapa alamat IP publik (misal blok `/29` atau `/28`), optimalkan TCP/UDP idle timeout NAT, dan terapkan dual-stack IPv6 bila ISP mendukung.',
    pengecoh4: [
      'Menaikkan langganan bandwidth internet ISP dari 500 Mbps menjadi 2 Gbps sambil tetap menggunakan satu alamat IP publik tunggal untuk seluruh 3.500 pegawai.',
      'Mengubah seluruh perangkat pegawai agar menggunakan alamat IP privat dari rentang `172.16.0.0/12` alih-alih `10.0.0.0/8` karena kelas B menghasilkan port PAT dua kali lebih banyak.',
      'Menonaktifkan protokol DNS UDP port 53 pada router perimeter agar browser pegawai hanya memakai koneksi TCP untuk seluruh permintaan halaman web.',
      'Memperpanjang nilai NAT TCP idle timeout dari 60 menit menjadi 24 jam agar entri translasi port tidak cepat dihapus oleh router.',
    ],
    akarMasalah:
      'PAT overload dengan satu IP publik kehabisan ruang port ephemeral (`pool exhausted`) saat melayani ribuan klien aktif bersamaan meski kapasitas bandwidth masih longgar.',
    solusiTerbaik:
      'Menambahkan blok alamat IP publik pada NAT pool menggandakan kapasitas port translasi secara linear, dilengkapi tuning NAT session timeout dan adopsi IPv6 untuk mengurangi ketergantungan NAT.',
    analisisPengecoh:
      'Menambah bandwidth tidak menambah jumlah 16-bit port TCP/UDP pada satu IP; perubahan rentang IP privat internal tidak menambah port di sisi IP publik; mematikan DNS UDP melumpuhkan resolusi nama; memperpanjang NAT timeout justru menahan port lebih lama dan mempercepat kehabisan pool.',
  },
  {
    level: 'C4',
    topik: 'Jaringan - DHCP Exhaustion & Proteksi Rogue DHCP Server',
    pertanyaan:
      'Pada jaringan Wi-Fi tamu dan pegawai di pusat pelayanan publik, puluhan laptop baru gagal memperoleh alamat IP dan justru mendapatkan alamat `169.254.x.x` (APIPA), sementara sebagian laptop lain mendapatkan default gateway tak dikenal `192.168.88.1` sehingga trafik mereka terputus. Investigasi awal menemukan masa sewa DHCP diset 7 hari pada subnet `/24` dan seorang peserta rapat mencolokkan router Wi-Fi pribadi ke colokan LAN ruang rapat.\n\nKombinasi tindakan perbaikan dan pengamanan jaringan manakah yang paling tepat?',
    jawabanBenar:
      'Menyingkat DHCP lease time (misal 2–4 jam untuk Wi-Fi tamu/dinamis) atau memperluas ukuran subnet agar pool tidak habis, serta mengaktifkan `DHCP Snooping` di switch dengan menandai hanya port uplink ke DHCP server resmi sebagai `trusted` (semua port akses menjadi `untrusted`) disertai rate limit paket DHCP untuk mencegah Rogue DHCP dan DHCP Starvation.',
    pengecoh4: [
      'Mengonfigurasi alamat IP statis secara manual pada seluruh laptop tamu yang datang berkunjung setiap hari agar jaringan tidak perlu menjalankan layanan DHCP lagi.',
      'Memperpanjang DHCP lease time dari 7 hari menjadi 30 hari agar perangkat yang sudah memperoleh IP tidak perlu mengirim pesan DHCP Request berulang kali.',
      'Memblokir seluruh trafik UDP port 67 dan 68 pada port uplink menuju DHCP server resmi instansi sehingga tidak ada perangkat baru yang memperoleh IP.',
      'Mengaktifkan fitur IP Helper-Address pada seluruh port dinding ruang rapat agar router pribadi peserta rapat dapat ikut membantu membagikan IP tambahan.',
    ],
    akarMasalah:
      'Dua masalah terjadi bersamaan: (1) pool `/24` habis (DHCP exhaustion) karena lease time 7 hari terlalu lama untuk lingkungan dengan mobilitas tinggi sehingga klien jatuh ke APIPA `169.254.x.x`, dan (2) Rogue DHCP server dari router pribadi membajak pemberian gateway.',
    solusiTerbaik:
      'Lease time singkat/perluasan subnet mengatasi kehabisan pool, sedangkan `DHCP Snooping` (trusted/untrusted port + rate limiting) memblokir paket `DHCPOFFER` dari port akses dan mencegah serangan starvation.',
    analisisPengecoh:
      'IP statis manual tidak mungkin untuk jaringan tamu/mobilitas tinggi; memperpanjang lease time ke 30 hari justru membuat pool makin cepat habis; memblokir UDP 67/68 di uplink mematikan DHCP resmi; mengarahkan relay ke router pribadi justru memperparah pembajakan trafik (MITM).',
  },
  {
    level: 'C4',
    topik: 'Jaringan - Analisis TCP TIME_WAIT & SYN Backlog Exhaustion',
    pertanyaan:
      'Server API Gateway berbasis Linux yang meneruskan ribuan request pendek per detik ke microservice backend mulai mengalami kegagalan koneksi keluar sesaat dengan error `EADDRNOTAVAIL: Cannot assign requested address`. Keluaran perintah `ss -s` menunjukkan:\n\n```log\nTCP:   41200 (estab 180, closed 39400, orphaned 12, timewait 39150)\nsysctl net.ipv4.ip_local_port_range = 32768 60999\n```\n\nApa akar masalah dari temuan metrik soket tersebut dan solusi arsitektural terbaik?',
    jawabanBenar:
      'API Gateway membuka dan menutup koneksi TCP baru untuk setiap request ke backend sehingga 28.232 port ephemeral habis terjebak dalam status `TIME_WAIT` selama 60 detik; aktifkan HTTP Keep-Alive / persistent connection pooling antara API Gateway dan upstream backend (misal `upstream keepalive` di Nginx), serta perluas `ip_local_port_range` sebagai pendukung.',
    pengecoh4: [
      'Mengaktifkan parameter kernel `net.ipv4.tcp_tw_recycle=1` pada Linux modern agar koneksi `TIME_WAIT` dihapus dalam 1 milidetik meski trafik datang dari banyak klien di belakang NAT.',
      'Menonaktifkan dukungan HTTP/1.1 Keep-Alive dan memaksa header `Connection: close` di seluruh komunikasi antar-microservice supaya soket TCP langsung bebas tanpa melalui `TIME_WAIT`.',
      'Memindahkan seluruh layanan microservice backend ke protokol UDP tanpa mekanisme keandalan karena TCP tidak mampu melayani lebih dari 100 permintaan per detik.',
      'Menaikkan ukuran RAM server dari 16 GB menjadi 128 GB agar sistem operasi otomatis menambah jumlah nomor port TCP menjadi 32-bit (4 miliar port).',
    ],
    akarMasalah:
      'Ketiadaan connection pooling (short-lived TCP connections) menuju tuple IP:port upstream yang sama menguras seluruh rentang port ephemeral (32768–60999) ke state `TIME_WAIT`.',
    solusiTerbaik:
      'Mengaktifkan HTTP/1.1 Keep-Alive / HTTP/2 multiplexing (connection pooling) ke upstream menghilangkan overhead handshake dan mencegah penumpukan `TIME_WAIT` secara drastis.',
    analisisPengecoh:
      '`tcp_tw_recycle` sudah dihapus sejak Linux kernel 4.12 karena merusak koneksi di balik NAT; `Connection: close` justru penyebab langsung `TIME_WAIT`; memindahkan REST API ke UDP merusak keandalan; ukuran port TCP ditetapkan 16-bit (maks 65.535) oleh standar RFC, bukan bergantung RAM.',
  },
  {
    level: 'C5',
    topik: 'Jaringan - Pencegahan ARP Spoofing & Dynamic ARP Inspection',
    pertanyaan:
      'Tim SOC mendeteksi lalu lintas HTTP internal di jaringan LAN kantor mengalami latensi aneh dan muncul peringatan sertifikat TLS tak valid pada beberapa PC pegawai. Pemeriksaan tabel ARP pada PC korban menunjukkan alamat MAC default gateway (`10.30.1.1`) sama persis dengan alamat MAC sebuah PC pegawai di ruang arsip (`aa:bb:cc:11:22:33`).\n\nSerangan apa yang sedang berlangsung dan kontrol Layer 2 manakah yang paling tepat untuk memitigasinya secara permanen?',
    jawabanBenar:
      'Terjadi serangan ARP Spoofing / ARP Cache Poisoning (Man-in-the-Middle) di segmen LAN; aktifkan `DHCP Snooping` (untuk membangun binding table IP-MAC-Port yang valid) dipadukan dengan `Dynamic ARP Inspection (DAI)` pada switch agar paket ARP yang tidak cocok dengan tabel binding langsung dijatuhkan, serta terapkan enkripsi TLS/HSTS ujung ke ujung.',
    pengecoh4: [
      'Mengganti seluruh alamat IP LAN dari IPv4 kelas A (`10.30.1.0/24`) menjadi IPv4 kelas C (`192.168.100.0/24`) karena protokol ARP tidak digunakan pada jaringan kelas C.',
      'Memblokir protokol ICMP Redirect di router gateway tanpa mengaktifkan kontrol apa pun di switch Layer 2, karena manipulasi tabel ARP selalu menggunakan paket ICMP.',
      'Memasang Web Application Firewall (WAF) pada koneksi internet perimeter agar paket ARP palsu di dalam jaringan LAN internal lantai kerja otomatis disaring.',
      'Menonaktifkan protokol ARP di seluruh PC pegawai dengan menyetel subnet mask `/32` tanpa membuat entri gateway statis agar PC langsung mengirim paket tanpa resolusi MAC.',
    ],
    akarMasalah:
      'Protokol ARP bersifat stateless dan tidak terautentikasi sehingga host jahat/terkompromi dalam broadcast domain yang sama dapat mengirim Gratuitous ARP palsu untuk membajak trafik ke gateway.',
    solusiTerbaik:
      'Kombinasi `DHCP Snooping` + `Dynamic ARP Inspection (DAI)` (+ Port Security) memvalidasi setiap paket ARP terhadap pemetaan sah IP-MAC-Port di switch akses, menutup ARP spoofing pada sumbernya.',
    analisisPengecoh:
      'ARP dipakai di seluruh jaringan IPv4 Ethernet lintas semua kelas IP; ARP adalah protokol L2 terpisah bukan ICMP; WAF berada di perimeter L7 dan tidak melihat frame ARP internal LAN; mematikan ARP tanpa pemetaan memutus seluruh konektivitas LAN.',
  },
  {
    level: 'C4',
    topik: 'Jaringan - DNSSEC Validation & Kegagalan SERVFAIL',
    pertanyaan:
      'Instansi baru saja mengaktifkan DNSSEC pada domain `spbe.kementerian.go.id` untuk mencegah DNS cache poisoning. Dua jam kemudian, seluruh pengguna yang memakai resolver publik dengan validasi DNSSEC (seperti `1.1.1.1` dan `8.8.8.8`) menerima error `SERVFAIL`, padahal query langsung dengan flag `+cd` (Checking Disabled) masih mengembalikan alamat IP yang benar.\n\n```log\n$ dig @8.8.8.8 spbe.kementerian.go.id A\n;; ->>HEADER<<- opcode: QUERY, status: SERVFAIL\n$ dig @8.8.8.8 +cd spbe.kementerian.go.id A\n;; ->>HEADER<<- opcode: QUERY, status: NOERROR\nspbe.kementerian.go.id. 300 IN A 103.40.10.50\n```\n\nApa penyebab kegagalan tersebut dan tindakan perbaikan yang paling tepat?',
    jawabanBenar:
      'Kueri `+cd` sukses membuktikan record `A` ada, tetapi rantai kepercayaan kriptografi DNSSEC putus (misalnya record `DS` di parent zone `.go.id` tidak cocok dengan kunci `KSK`/`DNSKEY` di zona anak, atau tanda tangan `RRSIG` sudah kedaluwarsa); verifikasi kecocokan digest `DS` di registrar dengan `DNSKEY` aktif serta pastikan re-signing `RRSIG` otomatis berjalan sebelum kedaluwarsa.',
    pengecoh4: [
      'Server web `103.40.10.50` sedang mati total sehingga resolver `8.8.8.8` mengembalikan `SERVFAIL` setelah mencoba melakukan handshake HTTPS port 443 ke server tersebut.',
      'Nilai TTL 300 detik terlalu kecil untuk standar DNSSEC sehingga resolver publik menolak memvalidasi tanda tangan kriptografi yang masa berlakunya di bawah 1 jam.',
      'Resolver publik `8.8.8.8` dan `1.1.1.1` tidak mendukung domain berakhiran `.go.id` sehingga DNSSEC harus dinonaktifkan permanen di seluruh domain pemerintahan.',
      'Alamat IP `103.40.10.50` harus didaftarkan sebagai record `AAAA` terlebih dahulu karena DNSSEC hanya memvalidasi alamat IPv6 dan menolak record `A` IPv4.',
    ],
    akarMasalah:
      'Status `SERVFAIL` normal yang berubah menjadi `NOERROR` saat validasi dimatikan (`+cd`) adalah tanda pasti kegagalan validasi rantai kriptografi DNSSEC (`DS` mismatch atau `RRSIG` expired).',
    solusiTerbaik:
      'Memeriksa rantai kepercayaan DNSSEC (misal dengan `delv`/DNSViz) lalu menyinkronkan record `DS` di parent zone dengan `KSK` dan memastikan rotasi/re-signing `RRSIG` tepat waktu memulihkan resolusi secara aman.',
    analisisPengecoh:
      'DNS resolver tidak melakukan pengecekan HTTPS ke web server; TTL 300 detik sepenuhnya valid di DNSSEC; resolver global sepenuhnya mendukung `.go.id`; DNSSEC memvalidasi semua tipe record termasuk `A` IPv4.',
  },
  {
    level: 'C6',
    topik: 'Jaringan - Segmentasi DMZ & Kebijakan Firewall 3-Tier',
    pertanyaan:
      'Tim infrastruktur diminta merancang penempatan jaringan untuk sistem layanan publik baru yang terdiri atas tiga komponen: (1) Reverse Proxy / Web Frontend, (2) Application Server API, dan (3) PostgreSQL Database yang menyimpan data kependudukan sensitif. Instansi mensyaratkan prinsip *defense-in-depth* sehingga kompromi pada server yang menghadap internet tidak langsung membuka akses ke basis data.\n\nRancangan topologi zona dan aturan firewall manakah yang paling sesuai best practice?',
    jawabanBenar:
      'Memisahkan ke dalam tiga zona terisolasi (DMZ untuk Reverse Proxy, App Zone privat untuk Application Server, dan DB Zone privat untuk PostgreSQL) dengan kebijakan default-deny: Internet hanya boleh ke DMZ port 443; DMZ hanya boleh ke App Zone pada port API spesifik; App Zone hanya boleh ke DB Zone pada port 5432; dan akses langsung Internet -> DB maupun DMZ -> DB diblokir mutlak.',
    pengecoh4: [
      'Menempatkan Reverse Proxy, Application Server, dan PostgreSQL di dalam satu VLAN DMZ yang sama agar latensi antar-komponen rendah lalu cukup mengandalkan kata sandi database yang rumit.',
      'Memberikan alamat IP publik langsung pada server PostgreSQL tetapi memindahkan port-nya dari 5432 ke port non-standar 54321 agar pemindai internet tidak menemukan basis data tersebut.',
      'Mengizinkan seluruh trafik keluar (egress `any -> any`) dari DB Zone ke internet publik agar server PostgreSQL dapat mengunduh pembaruan OS secara langsung tanpa repository mirror internal.',
      'Menghubungkan DB Zone langsung ke VLAN Wi-Fi pegawai kantor menggunakan static route terbuka supaya analis data dapat melakukan kueri langsung dari laptop masing-masing tanpa bastion.',
    ],
    akarMasalah:
      'Menyatukan tier publik dan tier data dalam satu zona atau mengizinkan lompatan langsung dari DMZ ke DB memperluas blast radius jika server web terkompromi.',
    solusiTerbaik:
      'Arsitektur 3-tier segmented (DMZ -> App -> DB) dengan aturan firewall stateful least-privilege per-port memastikan setiap lapisan hanya berbicara dengan lapisan yang tepat di sampingnya.',
    analisisPengecoh:
      'Menyatukan semua komponen di DMZ membuat kebocoran web server langsung mengakses DB; security by obscurity pada port 54321 dengan IP publik sangat berisiko; egress terbuka dari DB memudahkan eksfiltrasi data; akses terbuka dari Wi-Fi pegawai ke DB melanggar isolasi data sensitif.',
  },
  {
    level: 'C5',
    topik: 'Jaringan - BGP Multi-Homed Failover & Pencegahan Transit AS',
    pertanyaan:
      'Pusat Data Pemerintah memiliki Autonomous System Number (ASN) sendiri dan terhubung BGP eBGP ke dua ISP berbeda (`ISP-A` dan `ISP-B`) untuk redundansi internet. Beberapa jam setelah BGP aktif, trafik keluar-masuk melonjak penuh 100% melebihi kapasitas link dan tagihan bandwidth membengkak, padahal trafik portal pemerintah sedang sepi. Pemeriksaan tabel BGP menunjukkan router pemerintah mengiklankan kembali (re-advertise) rute internet yang diterima dari `ISP-A` ke `ISP-B`.\n\nMasalah apa yang sedang terjadi dan perbaikan kebijakan BGP manakah yang paling tepat?',
    jawabanBenar:
      'Pusat data tidak sengaja berubah menjadi Transit AS (route leak) sehingga trafik publik antar-pelanggan kedua ISP melintasi router pemerintah; terapkan outbound prefix-list / AS-path filter ketat (`^$`) ke kedua ISP agar router hanya mengiklankan blok IP milik pemerintah sendiri (originated locally) dan tidak pernah meneruskan rute ISP satu ke ISP lainnya.',
    pengecoh4: [
      'Menonaktifkan sesi BGP pada `ISP-B` secara permanen karena protokol BGP memang hanya dirancang untuk koneksi single-homed ke satu penyedia layanan internet.',
      'Menaikkan nilai `MED` (Multi-Exit Discriminator) pada rute masuk dari `ISP-A` menjadi 65535 agar router pemerintah berhenti menerima tabel rute dari internet.',
      'Mengganti protokol eBGP ke kedua ISP menjadi protokol RIPv2 karena RIPv2 memiliki batas hop maksimum 15 sehingga trafik antar-ISP tidak dapat melintas.',
      'Menonaktifkan `Split Horizon` pada konfigurasi BGP router pemerintah agar router dapat menyebarkan seluruh tabel rute full-view lebih cepat ke kedua ISP.',
    ],
    akarMasalah:
      'Tanpa outbound route filtering pada konfigurasi multi-homed eBGP, router menyebarkan rute yang dipelajari dari satu ISP ke ISP lain sehingga menjadi jalur transit gratisan (BGP route leak).',
    solusiTerbaik:
      'Outbound prefix-list eksplisit (hanya blok IP instansi) dan AS-path filter (`^$` untuk rute lokal saja) mencegah instansi menjadi Transit AS sekaligus tetap mempertahankan redundansi dual-ISP penuh.',
    analisisPengecoh:
      'Mematikan ISP-B menghilangkan tujuan redundansi multi-homed; MED tidak menghentikan pengiklanan ulang rute ke ISP lain; RIPv2 tidak digunakan untuk peering internet antar-AS; mematikan mekanisme proteksi justru memperburuk penyebaran rute liar.',
  },
  {
    level: 'C4',
    topik: 'Jaringan - Analisis Error Counters Fiber Optik & Duplex Mismatch',
    pertanyaan:
      'Tautan utama antar-gedung pusat data yang seharusnya berkecepatan 1 Gbps sering mengalami penurunan throughput drastis menjadi hanya 4 Mbps serta packet loss tinggi pada aplikasi video konferensi. Pemeriksaan `show interface` pada kedua ujung tautan menampilkan:\n\n```log\nSwitch-A Gi1/0/1: 1000Mb/s, Full-duplex | Input errors: 0, CRC: 0, Late collisions: 0\nSwitch-B Gi1/0/1: 100Mb/s,  Half-duplex | Input errors: 48210, CRC: 19402, Late collisions: 28115\n```\n\nApa penyebab lonjakan `CRC` dan `Late collisions` tersebut dan langkah perbaikan yang tepat?',
    jawabanBenar:
      'Terjadi *duplex & speed mismatch* (biasanya akibat satu sisi di-hardcode Full-Duplex sementara sisi lain masih Auto-Negotiation sehingga jatuh ke Half-Duplex); samakan konfigurasi Auto-Negotiation (`speed auto`, `duplex auto`) di kedua ujung port sesuai standar IEEE 802.3ab Gigabit Ethernet, lalu pantau ulang counter CRC untuk memastikan tidak ada kerusakan kabel fisik.',
    pengecoh4: [
      'Tabel routing OSPF pada Switch-A mengalami loop sehingga frame Ethernet bertabrakan di lapisan Layer 3 dan menghasilkan ribuan `Late collisions`.',
      'Kapasitas RAM pada Switch-B terlalu kecil untuk menyimpan tabel MAC sehingga Switch-B sengaja mengubah dirinya menjadi Half-Duplex untuk menghemat energi listrik.',
      'Konfigurasi `MTU 1500` terlalu kecil bagi koneksi Gigabit Ethernet sehingga setiap paket di atas 512 byte dihitung sebagai kesalahan `CRC` dan `Late collisions`.',
      'Aktifkan fitur `BPDU Guard` pada kedua port antar-switch tersebut agar Switch-B dipaksa naik dari 100 Mbps Half-Duplex menjadi 1000 Mbps Full-Duplex.',
    ],
    akarMasalah:
      'Ketidakcocokan negosiasi duplex (satu sisi Full-Duplex mengirim tanpa CSMA/CD saat sisi Half-Duplex sedang mengirim) menimbulkan ribuan *late collisions* dan frame rusak (`CRC error`).',
    solusiTerbaik:
      'Menyamakan Auto-Negotiation di kedua ujung tautan Gigabit Ethernet (dan memverifikasi kondisi fisik kabel/transceiver jika CRC tetap naik sesudahnya) segera menghilangkan late collisions dan memulihkan throughput 1 Gbps.',
    analisisPengecoh:
      'Routing OSPF L3 tidak menghasilkan L1/L2 late collisions; RAM switch tidak mengubah duplex mode; MTU 1500 adalah standar normal Ethernet; `BPDU Guard` pada link antar-switch justru akan mematikan (`err-disabled`) tautan utama.',
  },
  {
    level: 'C5',
    topik: 'Jaringan - Evaluasi QoS/DSCP untuk Layanan Kritis di Tautan WAN',
    pertanyaan:
      'Kantor dinas provinsi memiliki tautan WAN MPLS 50 Mbps menuju pusat data nasional. Setiap pukul 14.00 WIB, proses sinkronisasi backup database lintas wilayah mulai berjalan dan langsung memenuhi 100% tautan WAN, mengakibatkan layanan panggilan VoIP rapat koordinasi patah-patah (jitter > 80 ms) dan transaksi real-time aplikasi pelayanan melambat parah.\n\nStrategi Quality of Service (QoS) manakah yang paling tepat untuk menyelesaikan konflik trafik ini tanpa mematikan jadwal backup?',
    jawabanBenar:
      'Menerapkan klasifikasi dan penandaan DSCP (VoIP sebagai `EF`/DSCP 46, transaksi aplikasi kritis `AF31`, backup `CS1`/Best Effort) dikombinasikan dengan *Low Latency Queueing (LLQ)* / Priority Queue terukur untuk VoIP, jaminan bandwidth minimum (CBWFQ) untuk aplikasi pelayanan, serta traffic shaping/policing batas maksimum untuk trafik backup.',
    pengecoh4: [
      'Mengaktifkan metode antrean *First-In First-Out (FIFO)* murni pada seluruh router WAN agar paket backup dan paket VoIP dilayani secara adil berdasarkan urutan kedatangan.',
      'Menghapus seluruh mekanisme enkripsi pada trafik backup database agar ukuran paket berkurang separuh dan tidak lagi bersaing dengan paket VoIP.',
      'Memberikan prioritas mutlak *Strict Priority Queue* tanpa batas kecepatan (unbounded) kepada trafik backup database agar proses backup selesai lebih cepat dalam beberapa menit.',
      'Mengubah protokol VoIP dari RTP/UDP menjadi TCP agar paket suara yang hilang akibat kemacetan backup dikirim ulang otomatis tanpa menimbulkan jitter.',
    ],
    akarMasalah:
      'Trafik bulk backup yang agresif memenuhi antrean interface WAN (bufferbloat) sehingga menunda dan menjatuhkan paket interaktif yang sensitif terhadap latensi/jitter seperti VoIP dan transaksi layanan.',
    solusiTerbaik:
      'DiffServ/DSCP + LLQ memberi jalur prioritas berlatensi rendah bagi VoIP, CBWFQ menjamin porsi transaksi layanan, dan shaping membatasi trafik backup agar tidak mencekik trafik real-time.',
    analisisPengecoh:
      'FIFO adalah penyebab awal antrean panjang bagi VoIP saat link penuh; mematikan enkripsi backup melanggar keamanan data sensitif dan tidak menyelesaikan saturasi link; strict priority untuk bulk backup akan menelantarkan (*starve*) seluruh trafik lain; retransmisi TCP justru memperparah delay/jitter pada suara real-time.',
  },
  {
    level: 'C4',
    topik: 'Jaringan - Diagnosis Kerusakan NTP & Kegagalan Autentikasi TLS/Kerberos',
    pertanyaan:
      'Setelah pemadaman listrik dan pemulihan server di sebuah instansi daerah, layanan Active Directory/Kerberos login pegawai serta validasi token OAuth2/JWT pada portal internal mendadak gagal massal dengan pesan `KRB_AP_ERR_SKEW` dan `Token used before issued (nbf/iat error)`. Pemeriksaan konektivitas jaringan normal, namun perintah `chronyc tracking` pada server aplikasi menunjukkan offset waktu `+8 menit 14 detik` dari server utama.\n\nApa akar masalah insiden tersebut dan desain sinkronisasi waktu paling tepat?',
    jawabanBenar:
      'Pergeseran jam sistem (clock skew > 5 menit) melampaui batas toleransi keamanan protokol Kerberos dan validasi timestamp JWT/TLS; konfigurasikan daemon NTP (`chronyd`/`ntpd`) yang terhubung ke minimal 3–4 sumber NTP internal bertingkat (stratum konsisten tersinkron ke sumber NTP resmi/BMKG/GPS), izinkan UDP port 123 pada firewall internal, dan pasang pemantauan alert terhadap drift waktu.',
    pengecoh4: [
      'Memperlebar batas toleransi `clockSkew` pada seluruh verifikasi JWT dan kebijakan Kerberos menjadi 24 jam agar perbedaan jam server tidak pernah lagi menolak autentikasi.',
      'Menonaktifkan protokol NTP sepenuhnya karena berisiko terhadap serangan amplifikasi, lalu menugaskan operator mengubah jam secara manual dengan perintah `date -s` setiap awal bulan.',
      'Menghapus klaim `iat`, `nbf`, dan `exp` dari seluruh token JWT autentikasi instansi agar masa berlaku token tidak bergantung pada jam sistem server.',
      'Menghubungkan seluruh 200 server di dalam zona database privat langsung ke internet publik tanpa firewall agar dapat mengakses `pool.ntp.org` secara mandiri.',
    ],
    akarMasalah:
      'Kerberos secara default menolak tiket dengan selisih waktu > 5 menit untuk mencegah replay attack, dan validasi JWT (`iat`/`nbf`/`exp`) serta sertifikat X.509 sangat bergantung pada sinkronisasi jam akurat.',
    solusiTerbaik:
      'Arsitektur NTP internal hierarkis (minimal 3 sumber untuk deteksi falseticker) dengan `chronyd` dan alert drift menjaga akurasi waktu sub-milidetik tanpa membuka zona privat langsung ke internet.',
    analisisPengecoh:
      'Toleransi 24 jam membuka jendela replay attack masif; penyetelan manual bulanan rentan drift dan lompatan waktu; menghapus `exp` membuat token curian berlaku selamanya; membuka akses internet langsung dari DB zone melanggar segmentasi jaringan.',
  },
  {
    level: 'C6',
    topik: 'Jaringan - Hairpin NAT (NAT Reflection) vs Split-Horizon DNS',
    pertanyaan:
      'Web portal `simpeg.instansi.go.id` berada di DMZ (`10.50.1.20`) dan dipublikasikan ke internet melalui DNAT pada firewall dengan IP publik `202.10.20.30`. Pengguna dari internet dapat mengakses portal tanpa masalah, tetapi pegawai dari jaringan LAN internal (`10.20.0.0/16`) yang mengetik `https://simpeg.instansi.go.id` selalu mengalami timeout karena firewall meneruskan paket ke DMZ sementara server DMZ membalas langsung ke LAN (asymmetric routing) sehingga koneksi TCP ditolak klien.\n\nSolusi arsitektural manakah yang paling bersih dan efisien untuk akses pegawai internal tersebut?',
    jawabanBenar:
      'Menerapkan Split-Horizon DNS pada DNS resolver internal kantor agar `simpeg.instansi.go.id` langsung diresolusi ke alamat IP privat DMZ (`10.50.1.20`) melalui kebijakan firewall LAN-to-DMZ terkelola, sehingga trafik tidak perlu memutar lewat IP publik dan alamat IP asli klien tetap terjaga.',
    pengecoh4: [
      'Meminta seluruh 1.500 pegawai mengetik alamat IP mentah `https://10.50.1.20` di browser dan mengklik tombol "Lanjutkan secara tidak aman" untuk melewati peringatan sertifikat TLS.',
      'Menonaktifkan fitur Stateful Packet Inspection pada firewall perimeter agar paket balasan TCP asimetris dari `10.50.1.20` dibiarkan lewat meski tidak cocok dengan sesi IP publik `202.10.20.30`.',
      'Menghapus aturan DNAT publik `202.10.20.30` dan memindahkan server SIMPEG langsung ke VLAN LAN pegawai agar tidak melewati firewall lagi.',
      'Mewajibkan seluruh pegawai di dalam kantor menyalakan koneksi hotspot seluler pribadi setiap kali ingin membuka portal SIMPEG supaya trafik masuk dari sisi internet.',
    ],
    akarMasalah:
      'Klien LAN mengakses IP publik server di belakang firewall yang sama memicu asymmetric routing (request ke `202.10.20.30`, balasan langsung dari `10.50.1.20` sehingga ditolak stack TCP klien).',
    solusiTerbaik:
      'Split-Horizon DNS mengarahkan klien internal langsung ke IP privat DMZ melalui jalur firewall internal tanpa hairpinning (menghindari beban SNAT tambahan dan tetap mempertahankan IP sumber klien di log).',
    analisisPengecoh:
      'Akses via IP mentah merusak validasi hostname sertifikat TLS dan membiasakan perilaku tidak aman; mematikan stateful firewall melumpuhkan keamanan perimeter; memindahkan server ke LAN pegawai menghapus isolasi DMZ; memakai hotspot pribadi melanggar operasional jaringan kantor.',
  },
  {
    level: 'C5',
    topik: 'Jaringan - Isolasi Trafik Microservices dengan Kubernetes NetworkPolicy',
    pertanyaan:
      'Instansi menjalankan 15 microservice di dalam satu cluster Kubernetes on-premise (menggunakan CNI Calico/Cilium). Hasil audit keamanan menemukan bahwa secara default, pod pada namespace `portal-publik` yang terpapar internet dapat langsung membuka koneksi TCP ke pod `payroll-db` pada namespace `keuangan-internal` tanpa hambatan apa pun.\n\nPendekatan keamanan jaringan cluster manakah yang paling tepat untuk menegakkan prinsip *least privilege* antar-pod?',
    jawabanBenar:
      'Menerapkan `NetworkPolicy` default-deny untuk seluruh trafik ingress dan egress pada namespace sensitif (`keuangan-internal`), kemudian menambahkan aturan allowlist eksplisit berbasis `namespaceSelector` dan `podSelector` hanya untuk pod layanan keuangan tertentu pada port database yang tepat (serta melapisinya dengan mTLS bila memakai service mesh).',
    pengecoh4: [
      'Cukup mengandalkan `Service` bertipe `ClusterIP` tanpa `NetworkPolicy` karena `ClusterIP` secara otomatis memblokir seluruh trafik lintas namespace di dalam Kubernetes.',
      'Menghapus seluruh label pada pod `payroll-db` agar pod di namespace `portal-publik` tidak dapat menemukan alamat IP pod basis data tersebut melalui pemindaian subnet.',
      'Mengubah seluruh pod di dalam cluster agar menggunakan `hostNetwork: true` sehingga setiap pod terisolasi penuh oleh firewall perangkat keras di luar node Kubernetes.',
      'Mengganti nama DNS service dari `payroll-db` menjadi string acak 32 karakter tanpa menerapkan `NetworkPolicy` supaya tidak dapat dijangkau dari namespace lain.',
    ],
    akarMasalah:
      'Model jaringan default Kubernetes bersifat flat (semua pod dapat berkomunikasi dengan semua pod lintas namespace) hingga `NetworkPolicy` diterapkan pada CNI yang mendukungnya.',
    solusiTerbaik:
      'Default-deny `NetworkPolicy` + allowlist selektif berbasis label namespace/pod dan port spesifik menegakkan mikrosegmentasi L3/L4 di level kernel/eBPF, mencegah lateral movement jika pod publik terkompromi.',
    analisisPengecoh:
      '`ClusterIP` tetap dapat diakses dari semua namespace secara default; menghapus label tidak memblokir akses langsung ke IP pod; `hostNetwork: true` justru melemahkan isolasi network namespace container; mengganti nama service ke string acak hanyalah obscurity yang mudah ditemukan lewat env/DNS/scan.',
  },
];
