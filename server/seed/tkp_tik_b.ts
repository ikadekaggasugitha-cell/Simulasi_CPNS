import type { TkpHotsItem } from './tkp_builder';

export const TKP_TIK_B: TkpHotsItem[] = [
  {
    pertanyaan:
      'Sebagai admin aplikasi layanan kepegawaian unit, Anda menerima permintaan dari seorang staf senior yang sedang cuti agar Anda memasukkan data presensi dan laporannya menggunakan akun serta kata sandi pribadinya yang ia kirimkan melalui pesan singkat. Sikap tata kelola akun digital Anda adalah...',
    opsi5Ke1: [
      'Menolak menggunakan akun pribadinya secara santun, lalu memandunya memakai fitur pelimpahan resmi atau pengajuan koreksi pascacuti sesuai prosedur sistem.',
      'Menjelaskan bahwa berbagi kata sandi melanggar kebijakan keamanan informasi sehingga ia sebaiknya segera mengganti sandinya dan mengisi sendiri saat aktif.',
      'Mengonfirmasi ke kepala subbagian apakah ada mekanisme penyesuaian berkas cuti dari akun admin tanpa harus masuk memakai identitas pengguna rekan tersebut.',
      'Membantu menyiapkan draf dokumennya secara luring di komputer Anda agar ia tinggal mengunggahnya sendiri begitu bisa mengakses sistem.',
      'Menyarankan rekan tersebut menghubungi bagian kepegawaian pusat melalui surat elektronik resmi untuk meminta perpanjangan batas waktu pengisian.',
    ],
    alasan5: 'Menjaga prinsip non-repudiation (akun tidak boleh dipakai orang lain) secara sopan sekaligus langsung mengarahkan ke jalur resmi sistem yang sah.',
    alasan4: 'Tegas menolak berbagi sandi dan mengingatkan penggantian sandi, tetapi kurang memberi panduan fitur resmi agar kewajiban administrasinya tetap aman.',
    gradasi31: 'Skor 3 tertib menanyakan jalur admin namun pasif memandu rekan; skor 2 aman tetapi tidak menyelesaikan pelaporan tepat waktu; skor 1 langsung melempar ke pusat.',
  },
  {
    pertanyaan:
      'Instansi Anda mulai beralih ke aplikasi manajemen proyek digital untuk memantau progres program lintas subbagian. Setelah sebulan berjalan, sebagian anggota tim mengeluh harus mengisi laporan di dua tempat karena atasan tertentu masih meminta tabel progres manual lewat pesan grup. Langkah penyelarasan TIK Anda adalah...',
    opsi5Ke1: [
      'Menunjukkan fitur ekspor ringkasan otomatis dari aplikasi ke atasan agar cukup satu sumber input tanpa kerja ganda bagi seluruh anggota tim.',
      'Mengusulkan dalam rapat evaluasi agar seluruh pemantauan progres disepakati menggunakan satu aplikasi resmi dan menghentikan laporan manual di grup.',
      'Membuat tautan dasbor baca-saja dari aplikasi tersebut lalu menyematkannya di deskripsi grup agar atasan mudah memantau sewaktu-waktu.',
      'Membantu menyalin ringkasan mingguan dari aplikasi ke grup secara rutin selama masa transisi hingga atasan terbiasa membuka sistem.',
      'Tetap disiplin memperbarui aplikasi tepat waktu sambil melampirkan tangkapan layar status tugas Anda saat diminta laporan di grup.',
    ],
    alasan5: 'Menghilangkan kerja ganda (single source of truth) dengan pendekatan persuasif berbasis kemudahan nyata bagi pimpinan melalui fitur ekspor otomatis.',
    alasan4: 'Tepat menyuarakan penyatuan sistem di forum resmi, namun tanpa mendemonstrasikan kemudahan laporan bagi atasan sering memicu resistensi.',
    gradasi31: 'Skor 3 praktis tapi tetap menuntut atasan membuka tautan; skor 2 membebani kerja manual sementara; skor 1 solusi patuh pribadi bukan sistemik.',
  },
  {
    pertanyaan:
      'Anda melihat seorang pegawai baru sedang memotret layar komputer yang menampilkan data keuangan rahasia menggunakan ponsel pribadinya dengan alasan ingin mempelajarinya lebih lanjut di rumah malam ini. Tindakan pengamanan informasi Anda adalah...',
    opsi5Ke1: [
      'Mengingatkannya secara pribadi agar menghapus foto tersebut demi keamanan data negara, lalu menawarkan waktu belajar bersama memakai data contoh (dummy) di kantor.',
      'Menjelaskan aturan larangan mendokumentasikan layar sistem internal ke perangkat pribadi dan memintanya mempelajari buku pedoman resminya saja.',
      'Menyarankan ia membaca materi peraturan keuangan umum yang bersifat publik di rumah tanpa membawa tangkapan layar transaksi aktual instansi.',
      'Melaporkan insiden pemotretan layar tersebut kepada koordinator keamanan data unit agar dilakukan pembinaan singkat bagi seluruh pegawai baru.',
      'Mengingatkan bahwa ponsel pribadi rawan tersinkronisasi otomatis ke penyimpanan awan publik sehingga foto layar kantor bisa tersebar tanpa sengaja.',
    ],
    alasan5: 'Cepat menghentikan kebocoran data sensitif secara kolegial tanpa mematikan semangat belajar pegawai baru lewat penyediaan data simulasi aman.',
    alasan4: 'Tegas menegakkan aturan larangan dokumentasi layar dan memberi bahan bacaan legal, hanya sedikit kurang mendampingi secara praktik.',
    gradasi31: 'Skor 3 edukatif namun tidak memastikan foto segera dihapus; skor 2 menunda penghapusan foto saat itu juga; skor 1 bagus menjelaskan risiko teknis tetapi tanpa aksi korektif.',
  },
  {
    pertanyaan:
      'Dalam pengelolaan situs web resmi instansi, Anda mendapati banyak warga tunanetra kesulitan membaca pengumuman kegiatan karena seluruh informasi penting hanya diunggah dalam bentuk gambar poster tanpa teks keterangan lengkap. Usulan aksesibilitas digital Anda adalah...',
    opsi5Ke1: [
      'Menerapkan standar teks alternatif (alt-text) lengkap, salinan isi pengumuman dalam format teks halaman web, dan kontras warna ramah pembaca layar pada setiap unggahan.',
      'Menambahkan ringkasan seluruh isi poster pada kolom keterangan teks di bawah gambar agar mudah dibaca oleh aplikasi pembaca layar.',
      'Mengusulkan kepada tim TI untuk memasang tombol pengubah ukuran huruf dan fitur pembaca suara otomatis pada situs web resmi instansi.',
      'Membuat versi dokumen teks sederhana yang dapat diunduh terpisah pada setiap pengumuman kegiatan strategis bagi penyandang disabilitas.',
      'Mengurangi penggunaan poster penuh teks kecil dan menggantinya dengan desain huruf besar yang lebih mudah dilihat warga berdaya lihat rendah.',
    ],
    alasan5: 'Memenuhi prinsip aksesibilitas web inklusif (WCAG) secara menyeluruh sejak dari produksi konten sehingga setara bagi seluruh kelompok warga.',
    alasan4: 'Praktis dan cepat membantu pembaca layar lewat teks keterangan, namun belum mencakup standar alt-text terstruktur dan keterbacaan visual.',
    gradasi31: 'Skor 3 fitur bantu bagus namun tidak mengatasi poster tanpa teks; skor 2 memisahkan pengalaman akses disabilitas; skor 1 belum membantu tunanetra total.',
  },
  {
    pertanyaan:
      'Komputer layanan di loket Anda mendadak menampilkan pesan peringatan pembaruan keamanan sistem operasi yang membutuhkan waktu mulai ulang sekitar sepuluh menit, sementara antrean warga sedang ramai di pagi hari. Keputusan manajemen perangkat TI Anda adalah...',
    opsi5Ke1: [
      'Menjadwalkan pemasangan pembaruan tepat pada jam istirahat atau usai layanan tutup agar pelayanan tidak terganggu sekaligus keamanan sistem tetap terjaga hari itu juga.',
      'Melanjutkan pelayanan hingga antrean pagi mereda lalu segera melakukan pembaruan dan mulai ulang perangkat dengan pemberitahuan singkat kepada pemohon.',
      'Berkoordinasi dengan teknisi TI guna memastikan apakah pembaruan tersebut bersifat darurat keamanan kritis atau bisa ditunda hingga sore hari.',
      'Memindahkan sementara proses verifikasi ke komputer loket cadangan agar perangkat utama bisa langsung diperbarui tanpa menghentikan antrean.',
      'Menunda pembaruan sistem operasi selama sepekan penuh agar jam sibuk pelayanan di loket tidak pernah terganggu oleh proses mulai ulang.',
    ],
    alasan5: 'Menyeimbangkan kesinambungan pelayanan publik pada jam sibuk dengan disiplin keamanan siber (patch management) di jendela waktu aman hari yang sama.',
    alasan4: 'Tetap tanggap menjaga keamanan segera setelah antrean surut, meski menjeda loket di jam layanan tetap sedikit menahan kenyamanan warga.',
    gradasi31: 'Skor 3 hati-hati berkonsultasi tapi menambah waktu tunggu; skor 2 cerdas bila loket cadangan benar-benar siap; skor 1 menunda terlalu lama membuka celah siber.',
  },
  {
    pertanyaan:
      'Anda ditugaskan menyusun survei kepuasan masyarakat secara daring. Pada hari kedua, Anda melihat ada pola pengisian tidak wajar berupa puluhan jawaban identik yang masuk dalam rentang dua menit dari alamat jaringan yang sama. Sikap integritas data digital Anda adalah...',
    opsi5Ke1: [
      'Berkoordinasi dengan tim TI memverifikasi log pengisian, menerapkan pembatasan wajar anti-duplikasi tanpa menyulitkan warga, dan memisahkan data anomali secara transparan dalam laporan audit.',
      'Mengaktifkan fitur verifikasi sederhana (CAPTCHA) pada formulir survei agar pengisian otomatis atau berulang dalam waktu singkat dapat dicegah.',
      'Menyaring entri duplikat berjarak hitungan detik tersebut lalu melaporkan temuan anomali data secara tertulis kepada penanggung jawab survei.',
      'Mengubah tautan survei menggunakan kode tiket unik per nomor antrean layanan sehingga setiap pemohon hanya dapat mengisi satu kali.',
      'Tetap menampilkan seluruh hasil survei apa adanya sambil memberikan catatan kaki bahwa terdapat kemungkinan pengisian berulang pada hari kedua.',
    ],
    alasan5: 'Menjaga validitas data publik secara ilmiah dan transparan: audit teknis, pencegahan ramah warga, serta dokumentasi pembersihan anomali yang akuntabel.',
    alasan4: 'Langkah teknis cepat memblokir spam baru, tetapi belum mengaudit atau menangani puluhan entri anomali yang telanjur masuk sebelumnya.',
    gradasi31: 'Skor 3 rapi di pembersihan namun belum mencegah serangan ulang; skor 2 kuat tapi memutus survei berjalan; skor 1 membiarkan bias merusak angka indeks.',
  },
  {
    pertanyaan:
      'Instansi Anda sedang mengembangkan kanal layanan pesan otomatis (chatbot) untuk menjawab pertanyaan rutin masyarakat mengenai syarat perizinan. Pada masa uji coba, banyak warga mengeluh jawaban mesin terlalu kaku dan tidak nyambung ketika kasus mereka sedikit khusus. Saran perbaikan TIK Anda adalah...',
    opsi5Ke1: [
      'Menyempurnakan basis pengetahuan dari pertanyaan nyata warga dan menambahkan tombol pengalihan mulus (handover) ke petugas manusia untuk kasus khusus.',
      'Memperluas daftar pertanyaan umum (FAQ) di dalam sistem otomatis agar mencakup lebih banyak variasi kata yang biasa digunakan warga awam.',
      'Memasang pesan pembuka yang menjelaskan batasan layanan otomatis beserta jam operasional nomor telepon konsultasi petugas langsung.',
      'Menjadwalkan evaluasi mingguan terhadap log percakapan yang gagal dijawab mesin agar tim pengelola terus melatih responsnya.',
      'Menonaktifkan sementara layanan pesan otomatis dan mengembalikan seluruh balasan pesan warga kepada petugas admin secara manual.',
    ],
    alasan5: 'Memadukan efisiensi otomatisasi dengan empati manusia (human-in-the-loop) berdasarkan pola pertanyaan riil warga sehingga tidak ada pemohon yang buntu.',
    alasan4: 'Tepat memperkaya kosakata dan basis jawaban, tetapi tetap tidak mampu menuntaskan kasus kasuistis tanpa jalur eskalasi ke petugas.',
    gradasi31: 'Skor 3 jujur soal batasan tapi memaksa warga berpindah kanal; skor 2 baik berkala namun tidak segera menolong warga; skor 1 mundur dari efisiensi digital.',
  },
  {
    pertanyaan:
      'Dalam rangka kerja jarak jauh (work from anywhere) terbatas, Anda menggunakan laptop dinas dari rumah. Anggota keluarga Anda meminta izin meminjam laptop tersebut sebentar untuk mengunduh materi tugas dan mencetak dokumen dari situs internet umum. Sikap kepatuhan aset TIK Anda adalah...',
    opsi5Ke1: [
      'Menolak dengan hangat dan menjelaskan bahwa laptop dinas berisi data negara yang dilindungi aturan keamanan, lalu membantu mencarikan solusi lewat perangkat pribadi keluarga.',
      'Menyampaikan secara sopan bahwa perangkat kantor tidak diperbolehkan digunakan oleh pihak luar instansi sesuai pakta keamanan informasi.',
      'Membantu mencarikan materi publik yang dibutuhkan melalui ponsel pribadi Anda agar keluarga tetap terbantu tanpa menyentuh laptop kantor.',
      'Membuatkan akun pengguna tamu (guest) terpisah dengan izin terbatas pada laptop dinas jika memang sangat mendesak untuk mencetak satu dokumen.',
      'Menyarankan anggota keluarga menunggu Anda selesai bekerja lalu meminjamkannya sebentar dengan pengawasan langsung di sampingnya.',
    ],
    alasan5: 'Tegas menjaga isolasi perangkat dinas secara santun tanpa mengurangi kepedulian kepada keluarga lewat alternatif perangkat pribadi.',
    alasan4: 'Tegas dan jelas menegakkan aturan aset negara secara ramah, sedikit kurang menawarkan jalan keluar praktis bagi kebutuhan keluarga.',
    gradasi31: 'Skor 3 membantu dengan aman namun kurang mengedukasi batas perangkat dinas; skor 2 dan skor 1 tetap melanggar prinsip penggunaan eksklusif perangkat negara.',
  },
  {
    pertanyaan:
      'Tim Anda menerima banyak dokumen fisik lama hasil scan dari instansi daerah yang kualitas fotonya miring dan buram sehingga menyulitkan proses verifikasi berkas secara daring. Beberapa staf mengeluh mata lelah dan berisiko salah membaca angka nominal. Langkah perbaikan proses digital Anda adalah...',
    opsi5Ke1: [
      'Menyusun panduan singkat standar pemindaian (resolusi jelas, pencahayaan rata, format PDF rapi), menyediakan fitur pratinjau unggahan, dan mengembalikan berkas buram disertai petunjuk perbaikan.',
      'Mengirimkan pesan pemberitahuan kepada seluruh unit pengirim agar memindai dokumen memakai aplikasi pemindai dokumen ponsel daripada foto kamera biasa.',
      'Menggunakan alat penajam gambar dan pengatur kontras luring di komputer kantor pada berkas yang masih memungkinkan dibaca untuk mempercepat verifikasi.',
      'Mengusulkan penambahan validasi ukuran minimal berkas pada portal unggahan agar foto beresolusi sangat rendah otomatis tertolak sistem.',
      'Meminta petugas pengirim mengirimkan ulang salinan dokumen fisik melalui kurir jika angka penting pada hasil pindaian tidak terbaca jelas.',
    ],
    alasan5: 'Memperbaiki mutu data di sumbernya (standar pindai + pratinjau sebelum kirim + umpan balik terarah) sehingga kesalahan baca dan kerja ulang turun drastis.',
    alasan4: 'Praktis mengedukasi alat pemindai yang lebih rapi, namun tanpa standar jelas dan validasi unggahan hasil buram masih kerap lolos.',
    gradasi31: 'Skor 3 berisiko salah tafsir angka nominal jika gambar terlalu rusak; skor 2 ukuran file besar belum tentu fokus/tajam; skor 1 kembali memperlambat dengan kirim fisik.',
  },
  {
    pertanyaan:
      'Anda melihat rekan kerja mengunggah foto suasana meja kerjanya di media sosial pribadi untuk merayakan selesainya lembur, namun tanpa ia sadari di latar belakang foto terlihat papan jadwal internal dan layar monitor yang menampilkan daftar nama penerima bantuan. Sikap peduli keamanan informasi Anda adalah...',
    opsi5Ke1: [
      'Segera menghubunginya secara pribadi dengan nada bersahabat untuk menunjukkan bagian sensitif tersebut agar foto lekas diturunkan atau disunting buram.',
      'Mengirimkan pesan singkat pribadi menyarankan agar ia memeriksa kembali latar belakang foto unggahannya demi menjaga kerahasiaan data warga.',
      'Menyampaikan pengingat umum di grup bidang mengenai etika berfoto di ruang kerja agar tidak menampakkan layar monitor atau dokumen terbuka.',
      'Menunggu bertemu keesokan paginya di kantor untuk mengingatkannya secara halus agar lebih cermat saat membagikan foto aktivitas kerja.',
      'Melaporkan unggahan tersebut kepada pejabat pengelola informasi instansi agar yang bersangkutan menerima arahan penghapusan resmi.',
    ],
    alasan5: 'Sigap memutus eksposur data pribadi warga dalam hitungan menit secara santun, menjaga privasi publik sekaligus kehormatan rekan kerja.',
    alasan4: 'Cepat dan sopan memberi isyarat pribadi, namun tidak langsung menunjuk objek sensitifnya sehingga rekan mungkin lambat menyadari letak kesalahannya.',
    gradasi31: 'Skor 3 terlalu umum dan tidak menjamin foto segera ditarik; skor 2 terlambat karena foto terlanjur dilihat banyak orang semalaman; skor 1 terlalu kaku sebelum teguran kolegial.',
  },
  {
    pertanyaan:
      'Instansi Anda hendak mengganti aplikasi pelaporan lama dengan sistem baru berbasis awan. Sejumlah pegawai khawatir kehilangan kebiasaan kerja yang sudah dikuasai dan takut membuat kesalahan saat migrasi data minggu depan. Peran adaptif Anda sebagai agen perubahan unit adalah...',
    opsi5Ke1: [
      'Menyiapkan lingkungan latihan (sandbox) memakai data tiruan, memandu sesi praktik singkat per kelompok kecil, dan merangkum daftar solusi kendala umum.',
      'Mengajak rekan-rekan mencoba fitur inti sistem baru bersama-sama selama tiga puluh menit sebelum hari migrasi agar kecemasan mereka berkurang.',
      'Menjelaskan manfaat jangka panjang sistem awan baru bagi kecepatan kerja serta meyakinkan bahwa kesalahan awal dapat diperbaiki bersama tim TI.',
      'Memastikan seluruh data lama unit sudah dicadangkan aman sebelum jadwal migrasi agar tidak ada pegawai yang khawatir data pekerjaannya hilang.',
      'Menawarkan diri menjadi titik kontak pertama di ruangan apabila ada rekan yang menemui pesan galat pada hari pertama penggunaan sistem baru.',
    ],
    alasan5: 'Menerapkan manajemen perubahan digital menyeluruh: ruang aman belajar tanpa takut salah (sandbox), bimbingan kelompok kecil, dan dokumentasi pemecahan masalah.',
    alasan4: 'Kolaboratif mengurangi kecemasan lewat praktik bersama, namun tanpa lingkungan latihan terpisah dan catatan kendala masih rawan kebingungan di hari migrasi.',
    gradasi31: 'Skor 3 menenangkan secara psikologis tapi belum melatih keterampilan; skor 2 penting di sisi data bukan kesiapan pengguna; skor 1 reaktif saat hari pelaksanaan.',
  },
  {
    pertanyaan:
      'Saat mengolah data anggaran di lembar kerja digital, Anda menemukan rumus penjumlahan pada templat resmi tahun lalu memiliki kekeliruan rentang sel sehingga satu baris kegiatan berpotensi tidak ikut terhitung bila tidak dicek teliti. Tindakan proaktif TIK Anda adalah...',
    opsi5Ke1: [
      'Memperbaiki rumus tersebut dengan fungsi dinamis yang aman, menguji hasilnya pada beberapa skenario, lalu melaporkan temuan beserta templat terkoreksi ke pengelola keuangan.',
      'Memperbaiki rumus pada berkas unit Anda terlebih dahulu lalu mengirim pesan peringatan kepada seluruh operator bidang lain agar memeriksa baris yang sama.',
      'Melaporkan temuan kesalahan rentang rumus tersebut kepada bagian perencanaan agar mereka segera menerbitkan revisi templat resmi.',
      'Menambahkan kolom pengecekan silang otomatis di lembar kerja Anda supaya setiap selisih jumlah langsung terlihat sebelum laporan dicetak.',
      'Menghitung ulang total anggaran secara manual menggunakan kalkulator untuk memastikan angka final unit Anda tidak keliru.',
    ],
    alasan5: 'Tuntas secara teknis dan berdampak luas: memperbaiki akar rumus agar tahan kesalahan, memverifikasi hasil, dan mendorong koreksi templat tingkat instansi.',
    alasan4: 'Cepat mengamankan unit sendiri dan mengingatkan sesama operator, namun belum menyertakan perbaikan templat teruji ke pemilik templat resmi.',
    gradasi31: 'Skor 3 tertib melapor tetapi pasif membantu koreksi; skor 2 hanya mengamankan unit sendiri; skor 1 tidak menyelesaikan cacat rumus digital.',
  },
  {
    pertanyaan:
      'Dalam rangka transparansi proyek infrastruktur daerah, pimpinan meminta data perkembangan fisik dan serapan anggaran dapat dipantau mudah oleh publik melalui situs web. Anda memiliki keahlian visualisasi data. Pendekatan penyajian digital paling bermutu adalah...',
    opsi5Ke1: [
      'Menyajikan peta dan grafik progres ringkas berbahasa lugas lengkap dengan tanggal pembaruan, definisi indikator, serta tautan unduh dataset mentah yang terverifikasi.',
      'Membuat halaman grafik batang perkembangan tiap proyek yang diperbarui setiap bulan agar masyarakat mudah membandingkan capaian antarwilayah.',
      'Mengunggah tabel rincian seluruh proyek beserta foto dokumentasi lapangan terbaru secara berkala pada laman keterbukaan informasi.',
      'Menyiapkan ringkasan infografis satu halaman per triwulan yang mudah dibagikan masyarakat melalui kanal media sosial resmi pemerintah.',
      'Menampilkan tautan langsung menuju sistem pelaporan internal proyek dengan mode baca-saja agar data tersaji paling mutakhir.',
    ],
    alasan5: 'Memadukan keterbacaan publik awam (visual intuitif + konteks jelas) dengan akuntabilitas terbuka (tanggal mutakhir + dataset mentah terverifikasi).',
    alasan4: 'Informatif dan mudah dibandingkan secara visual, namun kurang menyediakan konteks definisi indikator dan akses data mentah terbuka.',
    gradasi31: 'Skor 3 rinci tetapi kurang ramah dipindai cepat oleh warga; skor 2 jeda triwulanan kurang mutakhir; skor 1 antarmuka sistem internal membingungkan dan berisiko eksposur.',
  },
  {
    pertanyaan:
      'Anda menerima tugas mengarsipkan ratusan rekaman rapat penting dan video sosialisasi program instansi. Kapasitas penyimpanan awan kantor hampir penuh sehingga pengunggahan dokumen layanan harian mulai terganggu. Langkah manajemen penyimpanan digital Anda adalah...',
    opsi5Ke1: [
      'Mengaudit kapasitas berdasarkan kebijakan retensi arsip, mengompres berkas media berukuran besar tanpa merusak kejelasan, dan memindahkan arsip inaktif ke penyimpanan jangka panjang resmi.',
      'Mengompres seluruh file video berukuran besar lalu menghapus salinan berkas duplikat yang menumpuk di folder bersama setelah berkoordinasi dengan pemilik file.',
      'Mengusulkan penambahan kapasitas langganan penyimpanan awan kepada tim TI sembari mengimbau pegawai membersihkan file sementara.',
      'Memindahkan seluruh rekaman video lama ke cakram keras eksternal resmi kantor yang diberi label rapi dan dicatat dalam daftar aset arsip.',
      'Mengunggah video sosialisasi yang bersifat publik ke kanal video resmi instansi lalu menyimpan tautannya saja di folder kerja.',
    ],
    alasan5: 'Mengelola siklus hidup arsip digital secara terukur: patuh jadwal retensi, optimasi ukuran, dan migrasi berjenjang (tiered storage) tanpa menghapus sembarangan.',
    alasan4: 'Cepat membebaskan ruang lewat kompresi dan hapus duplikat terkoordinasi, namun belum menyusun pola pengarsipan jangka panjang untuk arsip inaktif.',
    gradasi31: 'Skor 3 menambah biaya sebelum menata ruang; skor 2 rentan kerusakan fisik tunggal tanpa cadangan; skor 1 hanya berlaku bagi video publik bukan rapat internal.',
  },
  {
    pertanyaan:
      'Seorang rekan mengeluh bahwa ia menerima puluhan email otomatis setiap hari dari sistem layanan sehingga pesan penting dari pimpinan sering tenggelam dan terlewat dibaca. Sebagai pegawai yang terbiasa mengelola perangkat kerja digital, bantuan efektif Anda adalah...',
    opsi5Ke1: [
      'Mengajarinya membuat aturan penyaring otomatis (filter dan label folder) berdasarkan pengirim serta menandai pesan prioritas agar kotak masuk selalu rapi dan terpantau.',
      'Membantu mengelompokkan email notifikasi sistem ke dalam satu folder terpisah lalu menyarankan ia mengeceknya pada dua waktu khusus setiap hari.',
      'Menyarankan ia mematikan notifikasi email otomatis sistem yang tidak mendesak dan memantau status tugas langsung dari dasbor aplikasi.',
      'Mengusulkan kepada tim TI agar notifikasi sistem diringkas menjadi satu laporan harian (daily digest) dibanding dikirim satuan setiap menit.',
      'Menunjukkan cara menggunakan fitur pencarian kata kunci dan tanda bintang pada kotak masuk untuk cepat menemukan pesan dari pimpinan.',
    ],
    alasan5: 'Memberdayakan kemandirian literasi digital rekan melalui otomatisasi penyaringan dan prioritas pesan sehingga masalah teratasi permanen setiap hari.',
    alasan4: 'Praktis menata ulang alur baca email harian, sedikit di bawah skor 5 dalam memberdayakan rekan membangun aturan filter sendiri.',
    gradasi31: 'Skor 3 berisiko melewatkan peringatan mendesak dari sistem; skor 2 solusi sistemik baik namun butuh waktu perubahan TI; skor 1 tetap membuat kotak masuk berantakan.',
  },
  {
    pertanyaan:
      'Instansi Anda mewajibkan penggunaan tanda tangan elektronik tersertifikasi (TTE) pada setiap surat keputusan dan surat keterangan resmi. Suatu sore menjelang jam pulang, seorang pemohon meminta suratnya segera ditandatangani basah saja karena sistem sertifikasi elektronik sedang dalam pemeliharaan 20 menit. Sikap patuh TIK Anda adalah...',
    opsi5Ke1: [
      'Menjelaskan secara ramah jadwal pemeliharaan singkat sistem, memverifikasi keabsahan berkasnya terlebih dahulu, lalu segera menerbitkan dan mengirim dokumen ber-TTE ke kontaknya begitu sistem aktif kembali.',
      'Mengajak pemohon menunggu sebentar di ruang tunggu yang nyaman sembari memantau status pemulihan sistem TTE agar dokumen tetap sah secara elektronik.',
      'Menanyakan kepada pejabat penanda tangan apakah tersedia prosedur darurat tertulis untuk penerbitan sementara saat sistem TTE mengalami gangguan.',
      'Menjelaskan bahwa seluruh surat keluar wajib memakai kode QR tanda tangan elektronik demi keaslian dokumen sehingga tidak dapat diganti tanda tangan basah.',
      'Menawarkan pengambilan dokumen cetak keesokan paginya setelah sistem sertifikasi elektronik selesai dipelihara dan dokumen selesai ditandatangani.',
    ],
    alasan5: 'Menjaga integritas tata kelola dokumen elektronik secara konsisten sambil mengoptimalkan layanan proaktif (verifikasi awal + kirim digital begitu sistem aktif).',
    alasan4: 'Tetap teguh pada standar TTE dan ramah melayani, tetapi membiarkan warga menunggu fisik di kantor padahal pengiriman digital bisa jauh lebih praktis.',
    gradasi31: 'Skor 3 prosedural namun kurang solutif untuk pemeliharaan 20 menit; skor 2 informatif tapi kaku; skor 1 menunda sampai besok padahal gangguan hanya sebentar.',
  },
  {
    pertanyaan:
      'Saat mengikuti webinar pengembangan kompetensi ASN, panitia membagikan tautan formulir daftar hadir yang ternyata juga meminta peserta mengisi nomor kartu tanda penduduk lengkap dan nama ibu kandung padahal sertifikat hanya membutuhkan nama, NIP, dan instansi. Sikap sadar privasi digital Anda adalah...',
    opsi5Ke1: [
      'Tidak mengisi data sensitif yang tidak relevan, lalu mengonfirmasi kepada panitia secara santun mengenai dasar kebutuhannya dan menyarankan penghapusan kolom tersebut demi keamanan peserta.',
      'Menghubungi narahubung panitia terlebih dahulu untuk memastikan keaslian tautan dan menanyakan apakah kolom data pribadi sensitif boleh dikosongkan.',
      'Mengingatkan rekan sekantor yang ikut webinar agar berhati-hati serta menunggu klarifikasi resmi panitia sebelum mengisi tautan daftar hadir tersebut.',
      'Hanya mengisi kolom wajib nama, NIP, dan email dinas lalu memberi tanda garis datar pada kolom sensitif apabila formulir mewajibkan isian.',
      'Tidak mengisi formulir tersebut dan melewatkan klaim sertifikat demi menghindari risiko penyalahgunaan data identitas pribadi.',
    ],
    alasan5: 'Menunjukkan kesadaran keamanan identitas digital tinggi: melindungi data diri sekaligus proaktif mendorong perbaikan tata kelola privasi penyelenggara bagi seluruh peserta.',
    alasan4: 'Cermat memverifikasi sebelum mengisi dan melindungi diri, tetapi belum memberi masukan konstruktif agar kolom sensitif dihapus demi peserta lain.',
    gradasi31: 'Skor 3 melindungi rekan terdekat namun pasif melapor ke panitia; skor 2 mengakali formulir tanpa memperbaiki risiko; skor 1 aman tetapi merugikan hak sertifikat.',
  },
  {
    pertanyaan:
      'Unit Anda memiliki banyak materi pelatihan dan SOP kerja dalam berbagai folder terpisah sehingga pegawai baru sering bertanya ulang hal yang sama kepada senior. Pimpinan meminta Anda membangun pusat pengetahuan internal sederhana. Rancangan TIK paling efektif Anda adalah...',
    opsi5Ke1: [
      'Membangun laman portal pengetahuan internal terstruktur dengan fitur pencarian cepat, kategori jelas, tanggal pembaruan dokumen, dan mekanisme umpan balik pembaruan berkala.',
      'Mengumpulkan seluruh SOP dan panduan terbaru dalam satu folder awan terpusat dengan penamaan bernomor urut lalu menyematkan tautannya di grup kantor.',
      'Membuat satu dokumen daftar isi induk berisi tautan menuju seluruh materi pelatihan dan SOP yang ada agar mudah diakses pegawai baru.',
      'Merekam video panduan singkat langkah demi langkah untuk lima tugas harian paling sering ditanyakan lalu membagikannya ke seluruh staf.',
      'Mengusulkan kepada tim TI instansi pengadaan sistem manajemen pembelajaran (LMS) khusus untuk menampung seluruh modul internal.',
    ],
    alasan5: 'Menciptakan pusat pengetahuan hidup yang mudah dicari, selalu terverifikasi kemutakhirannya, dan dapat terus berkembang melalui umpan balik pengguna.',
    alasan4: 'Cepat memusatkan dokumen ke satu tempat yang rapi, tetapi tanpa pencarian isi dan penanda versi mutakhir pegawai masih rentan memakai SOP lama.',
    gradasi31: 'Skor 3 mudah dibuat namun rawan tautan rusak bila file dipindah; skor 2 membantu lima tugas tapi belum menyeluruh; skor 1 mahal dan lama diwujudkan.',
  },
  {
    pertanyaan:
      'Ketika terjadi gangguan listrik mendadak di kantor, generator cadangan membutuhkan waktu beberapa menit untuk menyala. Beberapa komputer loket tidak terpasang UPS sehingga pekerjaan input data yang belum disimpan hilang. Sebagai staf yang peduli keandalan TIK, tindakan pencegahan jangka panjang Anda adalah...',
    opsi5Ke1: [
      'Mengaktifkan fitur simpan otomatis (auto-save) dan sinkronisasi awan resmi di seluruh perangkat loket, serta mengajukan pengadaan/pemeliharaan UPS terukur kepada bagian umum.',
      'Mengusulkan pengadaan perangkat UPS bagi seluruh komputer pelayanan loket pada perubahan anggaran agar pekerjaan tidak lagi terputus saat listrik padam.',
      'Mengingatkan seluruh rekan loket membiasakan menekan tombol simpan setiap selesai mengisi satu baris data guna meminimalkan kehilangan pekerjaan.',
      'Berkoordinasi dengan teknisi listrik kantor untuk memeriksa penyebab jeda penyalaan generator agar peralihan daya bisa berlangsung lebih cepat.',
      'Menggunakan laptop dinas berdaya baterai penuh sebagai perangkat utama layanan loket pada area yang paling sering terdampak pemadaman.',
    ],
    alasan5: 'Menggabungkan mitigasi perangkat lunak instan tanpa biaya (auto-save/sinkronisasi) dengan perbaikan infrastruktur fisik (UPS) secara terukur.',
    alasan4: 'Tepat mengatasi akar masalah perangkat keras, tetapi selama menunggu proses anggaran risiko kehilangan data harian tetap terjadi tanpa langkah instan.',
    gradasi31: 'Skor 3 bergantung ingatan manusia saat sibuk; skor 2 mengurangi jeda tapi komputer tanpa UPS tetap mati seketika; skor 1 terbatas pada jumlah laptop tersedia.',
  },
  {
    pertanyaan:
      'Anda melihat tren penggunaan perangkat lunak otomatis (macro/skrip sederhana) dapat memangkas waktu validasi ribuan baris data laporan dari empat jam menjadi lima menit. Namun beberapa rekan khawatir jika terjadi kesalahan logika pada skrip, seluruh laporan justru keliru serentak. Pendekatan pengembangan TIK bertanggung jawab Anda adalah...',
    opsi5Ke1: [
      'Menyusun skrip terdokumentasi rapi, mengujinya secara paralel berdampingan dengan hasil hitung manual pada data contoh, serta memasang langkah verifikasi akhir sebelum dipakai rutin.',
      'Menguji coba skrip tersebut pada data bulan lalu terlebih dahulu dan menunjukkan perbandingan hasilnya yang identik kepada kepala seksi serta rekan tim.',
      'Menjelaskan cara kerja setiap langkah rumus secara terbuka dalam rapat tim agar semua rekan memahami logikanya dan ikut memeriksa jika ada kejanggalan.',
      'Menggunakan skrip tersebut hanya untuk tahap penyortiran awal yang sederhana, sementara perhitungan angka penting tetap dilakukan dengan rumus standar biasa.',
      'Meminta tim TI memeriksa keamanan dan keakuratan kode skrip Anda sebelum diterapkan pada komputer operasional unit.',
    ],
    alasan5: 'Menerapkan disiplin rekayasa mutu digital (dokumentasi + uji paralel/shadow testing + kontrol verifikasi akhir) sehingga inovasi cepat sekaligus bebas risiko tersembunyi.',
    alasan4: 'Sangat baik membangun kepercayaan lewat uji bukti historis, namun belum menambahkan dokumentasi dan langkah cek silang rutin untuk pemakaian jangka panjang.',
    gradasi31: 'Skor 3 transparan secara konsep tapi belum diuji data; skor 2 terlalu berhati-hati sehingga manfaat efisiensi kurang optimal; skor 1 baik untuk keamanan tapi lambat bila antre TI.',
  },
  {
    pertanyaan:
      'Saat menjadi moderator forum daring publik yang membahas rancangan peraturan daerah, tiba-tiba beberapa akun anonim mulai membanjiri kolom obrolan dengan komentar tidak relevan dan tautan promosi judi daring sehingga mengganggu jalannya diskusi. Tindakan sigap pengelolaan ruang digital Anda adalah...',
    opsi5Ke1: [
      'Segera menonaktifkan sementara fitur kirim tautan/obrolan bebas, menghapus pesan spam dan mengeluarkan akun pengganggu bersama co-host, lalu membuka kembali sesi tanya jawab terstruktur.',
      'Meminta operator teknis (co-host) segera mengeluarkan akun pengganggu dan menyaring pertanyaan peserta melalui formulir tanya-jawab terpisah.',
      'Menutup kolom obrolan untuk semua peserta hingga akhir acara dan hanya mempersilakan penanya lewat fitur angkat tangan (raise hand) yang disetujui host.',
      'Mengingatkan seluruh peserta agar tetap menjaga etika forum serta meminta audiens mengabaikan tautan mencurigakan yang muncul di kolom obrolan.',
      'Mencatat nama akun pengganggu untuk dilaporkan setelah acara selesai lalu memfokuskan layar utama pada paparan narasumber.',
    ],
    alasan5: 'Mengendalikan krisis moderasi ruang digital secara cepat, terukur, dan demokratis: menghentikan spam seketika tanpa mematikan partisipasi warga yang sah.',
    alasan4: 'Sigap menggandeng co-host dan memindah kanal pertanyaan, namun pesan spam berisiko masih sempat dibaca bila obrolan bebas tidak segera dibatasi.',
    gradasi31: 'Skor 3 aman tetapi membatasi peserta yang hanya bisa bertanya lewat teks; skor 2 terlalu lunak menghadapi bot/spammer; skor 1 membiarkan gangguan berlangsung sepanjang acara.',
  },
  {
    pertanyaan:
      'Instansi Anda bekerja sama dengan pihak ketiga (vendor) untuk memelihara aplikasi layanan publik. Suatu hari teknisi vendor meminta akses penuh permanen ke seluruh basis data produksi beserta data pribadi warga agar lebih cepat memperbaiki keluhan kapan saja. Sikap tata kelola keamanan TIK Anda adalah...',
    opsi5Ke1: [
      'Menolak akses penuh permanen, lalu menerapkan akses terbatas sementara (least privilege & time-bound) berbasis persetujuan resmi, pencatatan log audit, dan perjanjian kerahasiaan data.',
      'Meminta teknisi vendor bekerja hanya menggunakan salinan data uji yang telah disamarkan (anonymized) tanpa pernah menyentuh basis data produksi langsung.',
      'Menjelaskan bahwa setiap akses ke sistem produksi wajib didampingi petugas TI instansi secara langsung pada jam kerja dengan berita acara.',
      'Meneruskan permintaan akses vendor tersebut kepada pejabat pembuat komitmen dan tim keamanan informasi untuk ditelaah sesuai kontrak kerja.',
      'Memberikan akses baca-saja sementara selama satu hari kerja sambil memantau layar perbaikan secara daring bersama teknisi vendor.',
    ],
    alasan5: 'Menegakkan standar keamanan kelas enterprise (least privilege, batas waktu, audit trail, NDA) yang melindungi data warga tanpa menghambat pemeliharaan sistem.',
    alasan4: 'Sangat kuat melindungi privasi warga lewat data anonim, namun beberapa gangguan produksi kadang tetap membutuhkan diagnostik terkendali di sistem nyata.',
    gradasi31: 'Skor 3 aman secara pengawasan tetapi kaku untuk gangguan di luar jam kerja; skor 2 patuh hierarki tapi lambat merespons; skor 1 kurang dasar persetujuan dan pencatatan formal.',
  },
  {
    pertanyaan:
      'Anda melihat bahwa kanal berita dan pengumuman di situs web instansi jarang dibaca warga, padahal informasi yang dimuat sangat penting bagi pelaku usaha kecil. Setelah melihat data analitik sederhana, ternyata 85% pengunjung membuka situs dari ponsel dan banyak yang keluar dalam sepuluh detik karena halaman lambat dimuat akibat gambar berukuran terlalu besar. Langkah perbaikan TIK Anda adalah...',
    opsi5Ke1: [
      'Mengoptimalkan kompresi ukuran gambar ke format web modern ringan, merapikan tata letak ramah ponsel, dan memantau ulang kecepatan muat serta tingkat keterbacaan secara berkala.',
      'Mengompres seluruh file gambar baru sebelum diunggah ke situs web agar waktu muat halaman di jaringan seluler warga menjadi jauh lebih cepat.',
      'Menyusun laporan hasil temuan analitik kecepatan halaman tersebut lalu menyerahkannya kepada tim pengelola situs web untuk segera ditindaklanjuti.',
      'Menyajikan ringkasan inti informasi di paragraf paling atas halaman agar pengunjung ponsel langsung menangkap pesan penting sebelum memuat gambar.',
      'Menyebarkan informasi penting bagi pelaku usaha kecil tersebut langsung melalui kanal pesan singkat dan media sosial dibanding mengandalkan situs web.',
    ],
    alasan5: 'Menerjemahkan data analitik menjadi perbaikan pengalaman pengguna menyeluruh (performa teknis + desain mobile + evaluasi berulang) agar informasi publik tepat sasaran.',
    alasan4: 'Cepat membenahi akar bobot gambar pada unggahan baru, namun belum memperbaiki tata letak ponsel dan memantau dampak perbaikannya.',
    gradasi31: 'Skor 3 berbasis data namun hanya menyerahkan ke tim lain; skor 2 membantu struktur teks tapi halaman tetap berat; skor 1 meninggalkan pembenahan portal resmi.',
  },
  {
    pertanyaan:
      'Di ruang rapat, instansi Anda memasang perangkat presentasi nirkabel pintar agar pegawai tidak perlu membawa kabel. Namun setiap kali rapat lintas dinas dimulai, peserta sering menghabiskan sepuluh menit pertama kebingungan cara menyambungkan laptop mereka ke layar. Solusi praktis TIK Anda adalah...',
    opsi5Ke1: [
      'Menempelkan kartu panduan visual tiga langkah lengkap dengan nama jaringan/kode sambung di meja rapat, menyiapkan kabel cadangan siap pakai, dan menguji koneksi lima menit sebelum acara.',
      'Menyiapkan satu laptop khusus ruang rapat yang sudah selalu tersambung ke layar sehingga pembicara cukup mengirim atau memindahkan file paparan ke sana.',
      'Membuat panduan singkat cara menyambungkan layar nirkabel lalu mengirimkannya bersama undangan rapat kepada setiap narasumber.',
      'Menyediakan kabel HDMI dan adaptor berbagai port di atas meja rapat agar pembicara yang kesulitan menyambung nirkabel dapat langsung beralih.',
      'Menugaskan satu petugas piket teknis berada di ruang rapat selama lima menit awal setiap acara untuk membantu narasumber menyambungkan perangkatnya.',
    ],
    alasan5: 'Menghapus hambatan teknis berulang secara mandiri dan antisipatif: panduan visual di tempat, cadangan fisik, serta pengecekan prarapat.',
    alasan4: 'Sangat efektif mencegah keterlambatan mulai rapat, namun membuat narasumber harus memindahkan berkas presentasi terlebih dahulu.',
    gradasi31: 'Skor 3 sering terlewat dibaca narasumber sebelum rapat; skor 2 hanya menyiapkan cadangan tanpa mempermudah alat utama; skor 1 bergantung pada ketersediaan petugas.',
  },
  {
    pertanyaan:
      'Anda bertugas mengelola data kepesertaan pelatihan daring nasional. Saat memeriksa file kiriman dari beberapa daerah, Anda menemukan format penulisan nomor ponsel, tanggal lahir, dan kapitalisasi nama sangat beragam sehingga menyulitkan pengiriman sertifikat otomatis. Langkah penertiban data digital Anda adalah...',
    opsi5Ke1: [
      'Menormalisasi data yang sudah masuk memakai aturan pembersihan terukur tanpa mengubah substansi, lalu menambahkan validasi format baku pada formulir pendaftaran periode berikutnya.',
      'Membersihkan format tanggal, nomor ponsel, dan ejaan huruf menggunakan fungsi lembar kerja otomatis agar penerbitan sertifikat batch ini segera tuntas.',
      'Mengembalikan daftar peserta yang formatnya tidak sesuai kepada panitia daerah terkait agar diperbaiki sebelum proses cetak sertifikat dimulai.',
      'Menyertakan contoh format pengisian yang benar di bagian atas setiap kolom formulir pendaftaran agar pendaftar periode mendatang lebih tertib.',
      'Memverifikasi ulang secara manual baris-baris data yang gagal diproses sistem pengiriman sertifikat otomatis satu per satu.',
    ],
    alasan5: 'Menangani kualitas data secara tuntas dari hilir (pembersihan akurat batch berjalan) hingga hulu (validasi sistem agar data kotor tidak terulang).',
    alasan4: 'Cepat dan cerdas menuntaskan masalah saat ini memakai fungsi otomatis, tetapi belum memasang validasi input untuk mencegah kekacauan di angkatan berikutnya.',
    gradasi31: 'Skor 3 memperlambat penerbitan sertifikat peserta; skor 2 contoh tanpa validasi sistem masih kerap diabaikan; skor 1 tidak efisien untuk skala nasional.',
  },
  {
    pertanyaan:
      'Seorang pimpinan unit menanyakan pendapat Anda mengenai gagasan mengganti seluruh absensi kehadiran di lokasi kerja menjadi aplikasi pengenalan wajah berbasis ponsel pribadi pegawai, tetapi Anda mengetahui sebagian petugas lapangan senior memakai ponsel berspesifikasi rendah dan khawatir soal privasi data biometrik. Masukan objektif Anda adalah...',
    opsi5Ke1: [
      'Menyampaikan kajian berimbang terkait keandalan teknis, perlindungan data biometrik (UU PDP), dan keterjangkauan perangkat, lalu mengusulkan uji coba terbatas dengan alternatif presensi resmi yang inklusif.',
      'Menyarankan agar dilakukan survei kesiapan perangkat pegawai dan konsultasi keamanan data biometrik kepada dinas kominfo sebelum sistem diterapkan penuh.',
      'Mengusulkan penerapan sistem presensi ganda: aplikasi ponsel bagi pegawai yang perangkatnya mendukung dan mesin presensi kantor bagi petugas lapangan.',
      'Menjelaskan potensi keluhan privasi biometrik dan beban memori ponsel pegawai agar pimpinan mempertimbangkan kembali kelayakan aplikasi tersebut.',
      'Mendukung penuh inovasi digitalisasi presensi tersebut sambil mengusulkan bantuan subsidi penggantian ponsel bagi pegawai yang perangkatnya tidak memadai.',
    ],
    alasan5: 'Menunjukkan kecerdasan kebijakan TIK: analisis menyeluruh (teknis, hukum privasi, inklusivitas perangkat) disertai pendekatan uji coba terukur yang realistis.',
    alasan4: 'Cermat berbasis data kesiapan dan kepatuhan hukum sebelum keputusan final, sedikit kurang langsung menawarkan desain alternatif inklusif.',
    gradasi31: 'Skor 3 solutif namun belum mengkaji aspek keamanan biometrik; skor 2 fokus pada hambatan tanpa opsi uji coba; skor 1 tidak efisien anggaran publik.',
  },
  {
    pertanyaan:
      'Anda melihat rekan kerja memasang pengaya (ekstensi) peramban dari pengembang tidak dikenal pada komputer kantor demi memblokir iklan atau mempercepat pengunduhan, padahal ekstensi tersebut meminta izin membaca seluruh data yang diketik pada semua situs web. Sikap kewaspadaan siber Anda adalah...',
    opsi5Ke1: [
      'Menjelaskan secara santun bahaya izin baca data oleh ekstensi tak tepercaya terhadap kredensial sistem dinas, lalu membantunya mencopot dan memakai pengaturan keamanan peramban resmi.',
      'Mengingatkannya agar segera menghapus ekstensi tersebut karena berisiko mencuri kata sandi dan data formulir yang dimasukkan pada aplikasi kantor.',
      'Melaporkan temuan pemasangan ekstensi tidak resmi tersebut kepada tim TI agar diterapkan daftar ekstensi yang diizinkan (allowlist) di seluruh komputer kantor.',
      'Menyarankan rekan tersebut hanya memakai peramban terpisah tanpa ekstensi tambahan setiap kali membuka portal keuangan atau kepegawaian.',
      'Menunjukkan cara meninjau ulasan pengguna dan halaman izin akses ekstensi sebelum memasang perangkat tambahan apa pun pada peramban.',
    ],
    alasan5: 'Sigap memutus potensi pencurian data (keylogging/session hijacking) secara edukatif sekaligus mengarahkan pada fitur pengamanan resmi yang sah.',
    alasan4: 'Tegas dan cepat menghentikan ancaman pada komputer rekan, tetapi belum membantu menyetel alternatif pengaturan peramban yang aman.',
    gradasi31: 'Skor 3 kebijakan kantor yang baik namun belum mencopot ekstensi berbahaya sekarang; skor 2 membiarkan risiko pada peramban lain; skor 1 edukatif tapi tidak langsung menghapus.',
  },
  {
    pertanyaan:
      'Dalam rangka efisiensi kertas dan kecepatan akses, bagian Anda mulai mendigitalisasi ribuan arsip surat keputusan sepuluh tahun terakhir. Pada pekan kedua, Anda menyadari beberapa berkas yang telah dipindai tidak dilengkapi pencarian teks (OCR) sehingga sulit ditemukan lewat kata kunci isi surat. Usulan penyempurnaan Anda adalah...',
    opsi5Ke1: [
      'Mengaktifkan fitur pengenalan teks otomatis (OCR) pada alur pemindaian mulai sekarang, memproses ulang berkas yang sudah dipindai secara massal (batch), dan mencatat kata kunci metadata pokok.',
      'Mengaktifkan fitur OCR pada perangkat pemindai untuk dokumen berikutnya serta melengkapi nama file dengan nomor surat, tahun, dan perihal singkat.',
      'Membuat tabel katalog terpisah di lembar kerja yang mencatat nomor surat, tanggal, dan ringkasan isi setiap berkas hasil pindaian.',
      'Menyelesaikan pemindaian seluruh berkas fisik terlebih dahulu sesuai target waktu baru kemudian menjalankan proses OCR setelah semuanya terkumpul.',
      'Meminta tim TI menyediakan perangkat lunak pembaca teks berbayar agar hasil pencarian isi dokumen di arsip digital jauh lebih akurat.',
    ],
    alasan5: 'Menjamin nilai guna jangka panjang digitalisasi arsip secara efisien (OCR otomatis + pemrosesan massal arsip sebelumnya + metadata) tanpa memperlambat jadwal.',
    alasan4: 'Tepat membenahi alur ke depan dan penamaan berkas, namun meninggalkan berkas dua pekan awal tetap tidak bisa dicari berdasarkan teks isinya.',
    gradasi31: 'Skor 3 menambah beban input manual katalog; skor 2 menumpuk pekerjaan di belakang; skor 1 fitur OCR standar umumnya sudah tersedia tanpa belanja baru.',
  },
  {
    pertanyaan:
      'Saat instansi mengadakan sesi siaran langsung (live streaming) sosialisasi seleksi beasiswa daerah melalui kanal video resmi, kolom komentar tiba-tiba dipenuhi pertanyaan berulang yang sama tentang batas usia dan syarat domisili meskipun sudah dijelaskan narasumber di menit awal. Peran sigap Anda sebagai tim siaran adalah...',
    opsi5Ke1: [
      'Menyematkan pesan ringkas (pinned comment) berisi poin syarat utama dan tautan buku panduan resmi, serta menampilkan teks berjalan ringkas pada layar siaran.',
      'Menugaskan satu admin membalas pertanyaan berulang di kolom komentar menggunakan templat jawaban resmi yang cepat dan ramah.',
      'Menyampaikan catatan kepada moderator agar narasumber mengulang kembali ringkasan syarat utama pada akhir setiap sesi paparan.',
      'Menambahkan tautan buku panduan lengkap pada kolom deskripsi video siaran langsung agar penonton dapat membacanya sendiri.',
      'Mengumpulkan seluruh pertanyaan yang masuk selama siaran untuk dijawab serentak dalam unggahan infografis keesokan harinya.',
    ],
    alasan5: 'Memanfaatkan fitur interaktif platform secara optimal (pinned comment + visual layar + tautan resmi) sehingga ratusan penonton baru langsung terjawab tanpa memutus narasumber.',
    alasan4: 'Responsif melayani audiens di kolom komentar, tetapi kurang efisien menghadapi ratusan pertanyaan identik dibanding menyematkan informasi utama.',
    gradasi31: 'Skor 3 menyita waktu paparan materi lain; skor 2 banyak penonton siaran langsung tidak membuka deskripsi; skor 1 menunda jawaban yang dibutuhkan saat itu.',
  },
  {
    pertanyaan:
      'Anda menemukan bahwa aplikasi layanan daring unit Anda tidak menyediakan tanda terima bukti pengajuan bernomor registrasi yang otomatis terkirim ke email atau pesan pemohon, sehingga banyak warga kembali menelepon kantor sekadar memastikan berkasnya sudah masuk. Inisiatif perbaikan TIK Anda adalah...',
    opsi5Ke1: [
      'Mengusulkan dan merancang alur notifikasi otomatis berisi nomor tiket, ringkasan berkas, serta tautan lacak status yang langsung terkirim begitu pengajuan berhasil disimpan.',
      'Menambahkan halaman konfirmasi akhir yang dapat diunduh atau disimpan sebagai tangkapan layar berisi nomor registrasi pengajuan oleh pemohon.',
      'Mengirimkan pesan konfirmasi harian secara manual di sore hari kepada seluruh pemohon yang berkasnya berhasil masuk pada hari tersebut.',
      'Menambahkan pesan informasi di layar formulir bahwa berkas yang berhasil terkirim akan langsung masuk daftar verifikasi dalam dua hari kerja.',
      'Membuat halaman daftar status pengajuan umum harian menggunakan nomor registrasi tanpa nama pribadi pada situs web instansi.',
    ],
    alasan5: 'Menghadirkan kepastian layanan digital proaktif dan transparan (auto-receipt + tracking) yang langsung menurunkan beban telepon berulang sekaligus meningkatkan kepercayaan publik.',
    alasan4: 'Cepat memberi bukti registrasi di layar, namun jika warga lupa menyimpan tangkapan layar mereka tetap kehilangan nomor pelacakan.',
    gradasi31: 'Skor 3 menambah beban manual harian dan tertunda sampai sore; skor 2 belum memberi nomor unik bukti pengajuan; skor 1 warga tetap belum tahu nomor registrasinya jika tidak dikirim.',
  },
  {
    pertanyaan:
      'Instansi Anda menerima hibah puluhan tablet kerja untuk mendukung pendataan lapangan, namun setelah dibagikan, belum ada sistem pencatatan pengelolaan perangkat sehingga berisiko dipasangi aplikasi pribadi atau hilang jejak pemegangnya. Usulan tata kelola perangkat TIK Anda adalah...',
    opsi5Ke1: [
      'Menyusun inventaris nomor seri dan berita acara serah terima tanggung jawab, mengaktifkan pengelolaan perangkat terpusat (MDM/akun dinas), serta menetapkan panduan pemakaian resmi.',
      'Mewajibkan setiap petugas lapangan menandatangani berita acara peminjaman aset negara berisi nomor seri dan larangan memasang aplikasi di luar keperluan dinas.',
      'Meminta tim TI memasang aplikasi pelacak lokasi dan fitur hapus data jarak jauh (remote wipe) pada seluruh tablet sebelum digunakan di lapangan.',
      'Melakukan pemeriksaan fisik dan kebersihan aplikasi pada seluruh tablet dinas secara berkala setiap akhir triwulan bersama bagian umum.',
      'Menyimpan seluruh tablet di lemari penyimpanan kantor setiap sore setelah jam kerja selesai agar tidak dibawa pulang ke rumah.',
    ],
    alasan5: 'Memadukan akuntabilitas administratif aset negara, kendali teknis terpusat (MDM), dan edukasi penggunaan sehingga perangkat aman sekaligus tetap lincah mendukung kerja lapangan.',
    alasan4: 'Tertib secara administrasi serah terima dan aturan tertulis, tetapi tanpa kendali teknis terpusat kepatuhan perangkat di lapangan sulit diawasi.',
    gradasi31: 'Skor 3 kuat di pengamanan hilang namun belum menata akuntabilitas pemegang; skor 2 reaktif tiap tiga bulan; skor 1 menyulitkan petugas yang langsung berangkat ke lokasi pagi hari.',
  },
  {
    pertanyaan:
      'Dalam penyusunan laporan tahunan, Anda menggunakan aplikasi konferensi video dan papan tulis digital bersama tim dari lima kantor cabang. Salah satu cabang mengalami kendala perangkat komputer lama sehingga aplikasi papan tulis digital terasa sangat berat dan sering macet. Sikap inklusif TIK Anda adalah...',
    opsi5Ke1: [
      'Menyesuaikan kolaborasi ke dokumen daring ringan berformat tabel/teks terstruktur yang lancar di semua perangkat tanpa mengurangi kualitas partisipasi cabang tersebut.',
      'Meminta perwakilan cabang tersebut menyampaikan gagasan secara lisan atau melalui kolom obrolan sementara satu rekan lain menuliskannya ke papan tulis digital.',
      'Membagikan tautan tampilan baca-saja papan tulis digital dan meminta cabang tersebut mengirimkan masukan tertulisnya melalui surat elektronik usai rapat.',
      'Menyarankan cabang tersebut bergabung melalui ponsel pintar mereka apabila perangkat komputernya terlalu berat menjalankan papan tulis digital.',
      'Tetap menggunakan papan tulis digital bersama empat cabang lain terlebih dahulu baru menyinkronkan masukan cabang kelima di sesi terpisah.',
    ],
    alasan5: 'Mengedepankan prinsip teknologi tepat guna dan kesetaraan akses tim: memilih alat kolaborasi ringan yang memungkinkan seluruh cabang berkontribusi langsung secara setara.',
    alasan4: 'Cepat menjaga partisipasi aktif cabang tersebut saat rapat berlangsung, meski kontribusinya masih harus diperantarai rekan lain.',
    gradasi31: 'Skor 3 menunda masukan mereka ke luar rapat; skor 2 layar ponsel kecil tidak nyaman untuk papan tulis luas; skor 1 membuat satu cabang tertinggal dari diskusi utama.',
  },
  {
    pertanyaan:
      'Anda menerima laporan dari warga bahwa ketika ia mencari nama instansi Anda di mesin pencari internet, hasil paling atas justru mengarah ke situs tidak resmi yang menawarkan jasa perantara berbayar untuk mengurus dokumen yang sebenarnya gratis di kantor Anda. Langkah respons digital Anda adalah...',
    opsi5Ke1: [
      'Melaporkan temuan situs menyesatkan tersebut ke tim humas dan kominfo untuk ditindaklanjuti/diblokir, mengoptimalkan visibilitas portal resmi (SEO), dan menyosialisasikan alamat domain resmi berakhiran .go.id.',
      'Segera menerbitkan pengumuman peringatan di media sosial dan situs resmi instansi agar masyarakat waspada terhadap situs calo serta hanya memakai layanan resmi gratis.',
      'Menghubungi tim TI untuk mengecek mengapa peringkat pencarian situs resmi instansi kalah dari situs tidak resmi dan memperbaiki kata kunci utamanya.',
      'Menempelkan informasi alamat situs web resmi dan peringatan bebas calo secara mencolok di ruang pelayanan dan brosur informasi warga.',
      'Melaporkan iklan atau halaman situs tidak resmi tersebut melalui fitur pelaporan penyalahgunaan pada mesin pencari internet.',
    ],
    alasan5: 'Menangani ancaman informasi publik dari tiga sisi sekaligus: penindakan kanal menyesatkan, penguatan peringkat portal resmi, dan edukasi literasi domain .go.id ke warga.',
    alasan4: 'Cepat melindungi warga lewat imbauan resmi, tetapi tidak membenahi akar keterlihatan situs resmi di mesin pencari maupun penindakan situs calo.',
    gradasi31: 'Skor 3 membenahi SEO jangka menengah tanpa peringatan darurat; skor 2 hanya menjangkau warga yang datang fisik; skor 1 laporan individu ke mesin pencari terbatas dampaknya.',
  },
  {
    pertanyaan:
      'Sebagai pegawai yang aktif belajar teknologi baru, Anda menemukan cara kerja otomatis di aplikasi perkantoran yang mempercepat penyusunan surat massal dari tiga jam menjadi lima belas menit. Rekan-rekan satu subbagian terlihat masih mengerjakannya satu per satu secara manual. Sikap berbagi pengetahuan TIK Anda adalah...',
    opsi5Ke1: [
      'Menawarkan sesi berbagi singkat lima belas menit di sela waktu luang disertai contoh templat siap pakai agar seluruh tim menikmati efisiensi yang sama.',
      'Membagikan tautan video tutorial singkat mengenai fitur surat massal (mail merge) ke grup subbagian agar rekan yang berminat dapat langsung mempelajarinya.',
      'Menunjukkan hasilnya kepada kepala subbagian dan menawarkan diri membantu menyiapkan templat baku untuk pekerjaan surat massal bulan depan.',
      'Menawarkan bantuan memproseskan surat massal milik rekan yang sedang kewalahan mengejar tenggat memakai templat otomatis Anda.',
      'Menyimpan panduan langkah-langkahnya di folder bersama kantor lalu memberi tahu rekan saat makan siang bahwa ada cara yang lebih cepat.',
    ],
    alasan5: 'Mendorong lompatan produktivitas kolektif secara rendah hati dan aplikatif (demo ringkas + templat siap pakai) sehingga seluruh tim naik kelas bersama.',
    alasan4: 'Inisiatif positif dan mudah diakses, tetapi tanpa demonstrasi singkat dan templat nyata banyak rekan yang belum sempat mencoba sendiri.',
    gradasi31: 'Skor 3 menunggu bulan depan dan persetujuan struktural; skor 2 membantu sesaat tanpa transfer keterampilan; skor 1 terlalu pasif menunggu orang membuka folder.',
  },
  {
    pertanyaan:
      'Instansi Anda baru menerapkan sistem persetujuan dokumen berjenjang secara elektronik, tetapi pada minggu pertama banyak berkas tertahan di meja pejabat tertentu selama dua hari karena notifikasi aplikasi hanya muncul jika situs web dibuka manual di komputer. Usulan peningkatan efektivitas TIK Anda adalah...',
    opsi5Ke1: [
      'Berkoordinasi dengan tim TI mengaktifkan pengingat notifikasi aman (via email dinas atau pesan terenkripsi) tanpa memuat isi rahasia dokumen serta menampilkan daftar antrean prioritas.',
      'Menyepakati jadwal pengecekan rutin dua kali sehari (pagi dan sore) pada aplikasi bagi seluruh pejabat penanda tangan selama fitur notifikasi dikembangkan.',
      'Menugaskan staf sekretariat memantau dasbor berkas tertunda setiap siang lalu mengingatkan pejabat terkait secara sopan jika ada surat mendesak.',
      'Menambahkan tanda label prioritas warna merah pada surat mendesak di dalam aplikasi agar langsung terlihat saat pejabat membuka sistem.',
      'Mengirimkan pesan singkat pribadi kepada pejabat yang bersangkutan setiap kali ada surat dari unit Anda yang masuk ke akun persetujuannya.',
    ],
    alasan5: 'Menuntaskan hambatan adopsi sistem secara teknis dan aman (notifikasi proaktif tanpa membocorkan konten sensitif + prioritas antrean) sehingga alur persetujuan benar-benar cepat.',
    alasan4: 'Disiplin kerja yang realistis untuk jangka pendek sambil menunggu fitur TI, namun tetap bergantung pada ingatan manual di tengah jadwal rapat padat.',
    gradasi31: 'Skor 3 menambah pekerjaan pemantauan manual staf; skor 2 tidak berguna bila aplikasi belum dibuka; skor 1 solusi parsial hanya untuk surat unit sendiri.',
  },
  {
    pertanyaan:
      'Saat memeriksa laporan transaksi digital layanan daerah, Anda mendapati ada selisih kecil akibat perbedaan zona waktu antara peladen pusat dan perangkat loket yang menyebabkan transaksi pukul 23.30 tercatat pada tanggal hari berikutnya. Tindakan ketelitian TIK Anda adalah...',
    opsi5Ke1: [
      'Mendokumentasikan bukti selisih waktu dan dampaknya pada rekonsiliasi secara rinci, lalu segera berkoordinasi dengan tim TI menyelaraskan standar waktu peladen (NTP) dan mencatatkan penyesuaian audit.',
      'Melaporkan temuan perbedaan pencatatan jam tersebut kepada tim TI pengelola aplikasi agar pengaturan zona waktu peladen segera diseragamkan.',
      'Membuat catatan penyesuaian manual pada laporan rekonsiliasi harian sambil memantau apakah selisih serupa kembali muncul esok harinya.',
      'Mengimbau operator layanan daring agar menutup batas penerimaan transaksi harian tiga puluh menit lebih awal sebelum tengah malam.',
      'Mengubah tanggal transaksi yang tercatat geser tersebut secara manual pada file rekapitulasi lembar kerja agar cocok dengan laporan kas.',
    ],
    alasan5: 'Menunjukkan ketelitian forensik digital dan akuntabilitas tinggi: menyelesaikan akar teknis sinkronisasi waktu (NTP) sekaligus menjaga jejak audit rekonsiliasi tetap transparan.',
    alasan4: 'Cepat mengarahkan perbaikan teknis ke tim TI, tetapi belum menyertakan analisis dampak serta catatan penyesuaian akuntabilitas pada laporan berjalan.',
    gradasi31: 'Skor 3 hanya menambal gejala tanpa memperbaiki sistem; skor 2 memotong hak waktu layanan warga; skor 1 mengubah tanggal manual tanpa catatan audit rawan temuan pemeriksaan.',
  },
  {
    pertanyaan:
      'Pemerintah mendorong integrasi layanan publik agar masyarakat tidak perlu mengunggah ulang berkas kependudukan yang sama di berbagai aplikasi daerah. Namun di lapangan, beberapa bidang masih enggan berbagi akses layanan data karena khawatir sistem mereka menjadi lambat atau datanya disalahgunakan. Sikap kolaboratif TIK Anda adalah...',
    opsi5Ke1: [
      'Mengajak perwakilan bidang terkait dan tim TI menyusun perjanjian berbagi data berbasis antarmuka aman (API) terbatas, pembatasan trafik, serta log akses terpantau agar integrasi aman dan saling percaya.',
      'Menjelaskan amanat Sistem Pemerintahan Berbasis Elektronik (SPBE) bahwa integrasi data lintas unit wajib dilakukan demi kemudahan pelayanan masyarakat.',
      'Mengusulkan uji coba integrasi pada satu jenis layanan paling sering diakses warga terlebih dahulu guna membuktikan keamanan dan kestabilan sistem.',
      'Menyusun standar pertukaran file berkala terjadwal pada malam hari agar proses integrasi tidak pernah membebani kecepatan sistem di jam sibuk.',
      'Menyerahkan sepenuhnya keputusan integrasi data kepada pimpinan daerah agar diterbitkan surat perintah wajib bagi seluruh kepala bidang.',
    ],
    alasan5: 'Mengatasi ego sektoral digital dengan solusi tata kelola dan teknis konkret (API aman + rate limiting + audit log) yang menjawab langsung kekhawatiran keamanan dan performa.',
    alasan4: 'Benar secara landasan regulasi SPBE, tetapi pendekatan normatif tanpa menjawab kekhawatiran teknis keamanan dan beban peladen sering tetap menghadapi resistensi.',
    gradasi31: 'Skor 3 pendekatan pilot project cerdas namun belum memuat perjanjian tata kelola akses; skor 2 transfer malam hari tidak real-time bagi layanan; skor 1 top-down tanpa membangun kepercayaan teknis.',
  },
];
