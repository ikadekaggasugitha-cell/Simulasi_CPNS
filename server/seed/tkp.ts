import type { SeedQuestion } from './types';

// 75 HOTS TKP Questions covering all 6 official PermenPANRB aspects:
// Pelayanan Publik, Jejaring Kerja, Sosial Budaya, TIK, Profesionalisme, Anti Radikalisme
// Each question has explicit 1-5 weights in bobot_tkp and detailed step-by-step evaluation.

export const TKP_QUESTIONS: SeedQuestion[] = [
  // === 1. PELAYANAN PUBLIK (1-15) ===
  {
    kategori: 'TKP',
    subtopik: 'Pelayanan Publik',
    pertanyaan:
      'Anda bertugas di loket pelayanan terpadu satu pintu. Lima menit sebelum jam istirahat siang, seorang warga lansia datang dari desa terpencil untuk mengurus surat keterangan mendesak bagi pengobatan cucunya, namun satu berkas fotokopi KTP miliknya tertinggal di rumah. Sikap terbaik Anda adalah...',
    opsi_a: 'Menolak berkas tersebut dengan sopan dan memintanya kembali besok pagi setelah dokumen lengkap.',
    opsi_b: 'Menutup loket tepat waktu karena jam istirahat adalah hak pegawai dan memintanya menunggu hingga siang.',
    opsi_c: 'Mengecek apakah data kependudukannya dapat diverifikasi melalui sistem digital atau membantu mengarahkan solusi alternatif secara empatik sembari tetap menjaga keabsahan prosedur.',
    opsi_d: 'Meminta warga lain di antrean meminjamkan ponsel mereka untuk memfoto KTP lansia tersebut di rumah.',
    opsi_e: 'Menerima pengajuan tanpa verifikasi identitas sama sekali agar lansia tersebut cepat pulang.',
    jawaban_benar: 'C',
    bobot_tkp: { A: 3, B: 1, C: 5, D: 4, E: 2 },
    pembahasan:
      'Aspek Pelayanan Publik menilai empati, orientasi solusi, dan kepatuhan prosedur.\n- Skor 5: Memanfaatkan verifikasi sistem resmi / solusi alternatif yang membantu warga rentan tanpa melanggar aturan keabsahan.\n- Skor 4: Berupaya mencari jalan keluar teknis meski mengandalkan pihak lain.\n- Skor 3: Sopan namun kaku tanpa upaya membantu solusi.\n- Skor 2: Melanggar prinsip verifikasi administrasi.\n- Skor 1: Tidak responsif terhadap kondisi darurat lansia.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Pelayanan Publik',
    pertanyaan:
      'Sistem antrean elektronik di kantor pelayanan Anda mendadak mati akibat pemadaman listrik, sementara puluhan warga mulai gelisah dan berdesakan di depan loket. Tindakan prioritas yang Anda ambil adalah...',
    opsi_a: 'Menenangkan warga secara komunikatif, menerapkan nomor antrean manual sementara agar tertib, dan berkoordinasi dengan bagian teknis terkait genset atau pemulihan sistem.',
    opsi_b: 'Menghentikan seluruh pelayanan hingga listrik menyala kembali agar data tidak hilang.',
    opsi_c: 'Meminta petugas keamanan mengusir warga ke luar gedung supaya suasana tidak gaduh.',
    opsi_d: 'Melayani warga yang berdiri paling dekat dengan loket tanpa mengatur urutan antrean.',
    opsi_e: 'Menunggu arahan kepala kantor sambil tetap duduk di meja kerja.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 2, C: 1, D: 3, E: 4 },
    pembahasan:
      'Aspek Pelayanan Publik menuntut ketangkasan menjaga keberlangsungan layanan dan ketertiban.\n- Skor 5: Proaktif menenangkan publik, membuat antrean manual darurat, sekaligus mengoordinasikan pemulihan teknis.\n- Skor 4: Menunggu arahan resmi sambil tidak memicu konflik, namun kurang inisiatif.\n- Skor 3: Tetap melayani tetapi menimbulkan ketidakadilan urutan.\n- Skor 2: Menghentikan layanan padahal solusi manual memungkinkan.\n- Skor 1: Represif terhadap pemohon layanan.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Pelayanan Publik',
    pertanyaan:
      'Seorang pemohon layanan marah besar dan berbicara dengan nada tinggi di ruang tunggu karena mengira berkasnya sengaja diperlambat, padahal kesalahan terjadi akibat nomor induk yang ia tulis pada formulir tidak sesuai. Respons paling tepat adalah...',
    opsi_a: 'Menjelaskan dengan nada tinggi pula bahwa kesalahan ada pada dirinya sendiri.',
    opsi_b: 'Tetap tenang, mendengarkan keluhannya hingga selesai tanpa memotong, menunjukkan letak ketidaksesuaian data secara santun, dan membantu proses perbaikannya segera.',
    opsi_c: 'Meminta pemohon mengisi ulang formulir dari awal dan mengambil nomor antrean baru di belakang.',
    opsi_d: 'Membiarkannya marah sampai lelah sendiri baru memanggil petugas lain.',
    opsi_e: 'Meminta maaf secara berlebihan meskipun bukan salah petugas dan langsung meloloskan data yang salah.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 1, B: 5, C: 3, D: 2, E: 4 },
    pembahasan:
      'Kunci penanganan komplain adalah de-eskalasi emosional dan penyelesaian akurat.\n- Skor 5: Tenang, empatik, objektif menunjukkan sumber masalah, dan langsung memfasilitasi perbaikan.\n- Skor 4: Berusaha meredakan situasi meski kurang tepat secara akurasi prosedur.\n- Skor 3: Mengikuti aturan namun kaku dan memperpanjang kekecewaan pemohon.\n- Skor 2: Pasif menghindari konflik.\n- Skor 1: Membalas emosi pemohon.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Pelayanan Publik',
    pertanyaan:
      'Instansi Anda baru meluncurkan aplikasi aduan masyarakat daring, tetapi masih banyak warga pedesaan yang belum memahami cara menggunakannya sehingga tetap datang langsung ke kantor. Langkah inovatif yang Anda usulkan adalah...',
    opsi_a: 'Menolak pengaduan tatap muka secara total agar warga terpaksa belajar menggunakan aplikasi.',
    opsi_b: 'Menyediakan pojok pendampingan digital di kantor sekaligus membuat panduan visual sederhana bagi warga yang datang langsung.',
    opsi_c: 'Menerima aduan manual seperti biasa tanpa memperkenalkan aplikasi tersebut kepada warga.',
    opsi_d: 'Meminta warga menyuruh anak atau tetangganya mengisi aplikasi dari rumah saja.',
    opsi_e: 'Menghapus aplikasi daring karena dinilai tidak cocok dengan kondisi masyarakat.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 2, B: 5, C: 3, D: 4, E: 1 },
    pembahasan:
      'Pelayanan inklusif menjembatani kesenjangan literasi digital.\n- Skor 5: Transisi adaptif lewat pendampingan langsung dan materi edukasi mudah dipahami.\n- Skor 4: Memberi saran praktis namun melepas tanggung jawab pendampingan.\n- Skor 3: Bertahan pada cara lama tanpa mendukung transformasi.\n- Skor 2: Pemaksaan yang menyulitkan warga.\n- Skor 1: Menolak inovasi kemajuan.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Pelayanan Publik',
    pertanyaan:
      'Seorang kenalan dekat atasan Anda datang membawa berkas izin usaha dan meminta agar permohonannya didahulukan melewati puluhan warga yang sudah antre sejak pagi. Sikap Anda adalah...',
    opsi_a: 'Mendahulukannya diam-diam agar tidak terjadi keributan di ruang tunggu.',
    opsi_b: 'Menolak permintaan tersebut secara halus namun tegas dengan menjelaskan komitmen keadilan antrean serta menawarkan pelayanan sesuai urutan yang berlaku.',
    opsi_c: 'Menghubungi atasan terlebih dahulu untuk meminta izin mendahulukan kenalannya.',
    opsi_d: 'Memintanya menunggu di ruang khusus lalu menyelipkan berkasnya di sela berkas warga lain.',
    opsi_e: 'Memarahinya di depan umum agar pemohon lain tahu Anda tegas.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 1, B: 5, C: 3, D: 2, E: 4 },
    pembahasan:
      'Prinsip pelayanan publik adalah kesetaraan dan non-diskriminasi.\n- Skor 5: Menolak privilege secara santun, berprinsip, dan menjaga keadilan antrean.\n- Skor 4: Menjaga keadilan antrean tetapi penyampaiannya kurang komunikatif/berlebihan.\n- Skor 3: Ragu-ragu dan melempar keputusan ke atasan.\n- Skor 2: Tetap melakukan kecurangan tersembunyi.\n- Skor 1: Mengorbankan hak publik secara langsung.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Pelayanan Publik',
    pertanyaan:
      'Anda melihat seorang penyandang disabilitas tunanetra kebingungan mencari arah loket layanan di lobi gedung kantor yang belum memiliki pemandu jalur taktil memadai. Yang sebaiknya Anda lakukan adalah...',
    opsi_a: 'Menghampirinya dengan ramah, menawarkan bantuan menuntun sesuai kebutuhannya menuju loket, sekaligus mencatat masukan perbaikan aksesibilitas gedung kepada bagian umum.',
    opsi_b: 'Memanggil satpam dari jauh agar segera mengarahkan pengunjung tersebut.',
    opsi_c: 'Berteriak memberi petunjuk arah kiri-kanan dari balik meja kerja Anda.',
    opsi_d: 'Membiarkannya mencari sendiri agar melatih kemandirian.',
    opsi_e: 'Meminta pengunjung lain di lobi untuk menemani penyandang disabilitas tersebut.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 4, C: 2, D: 1, E: 3 },
    pembahasan:
      'Pelayanan berkeadilan mencakup layanan ramah kelompok rentan dan perbaikan sistemik.\n- Skor 5: Aksi empatik langsung disertai usulan perbaikan sarana aksesibilitas jangka panjang.\n- Skor 4: Memastikan dibantu oleh petugas keamanan.\n- Skor 3: Mengalihkan bantuan ke warga lain.\n- Skor 2: Bantuan tidak efektif bagi tunanetra.\n- Skor 1: Mengabaikan kebutuhan pemohon rentan.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Pelayanan Publik',
    pertanyaan:
      'Survei kepuasan masyarakat triwulan terakhir menunjukkan skor terendah pada indikator "kejelasan informasi biaya dan waktu penyelesaian layanan". Sebagai penanggung jawab standar layanan, tindakan paling efektif adalah...',
    opsi_a: 'Menyalahkan responden survei karena kurang teliti membaca papan pengumuman.',
    opsi_b: 'Memasang infografis alur, estimasi waktu, dan rincian biaya resmi (termasuk layanan gratis) secara jelas di lobi maupun situs web, serta memantau kesesuaian pelaksanaannya.',
    opsi_c: 'Menghapus pertanyaan terkait biaya dan waktu pada kuesioner periode berikutnya.',
    opsi_d: 'Menggelar rapat evaluasi internal sekali saja tanpa mengubah media informasi publik.',
    opsi_e: 'Meminta petugas loket menjelaskan informasi hanya ketika ditanya pemohon.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 1, B: 5, C: 2, D: 4, E: 3 },
    pembahasan:
      'Transparansi standar pelayanan publik adalah mandat UU No. 25 Tahun 2009.\n- Skor 5: Perbaikan menyeluruh pada media informasi fisik/digital dan monitoring kepatuhan.\n- Skor 4: Ada evaluasi tetapi belum menghasilkan perbaikan nyata bagi publik.\n- Skor 3: Pasif menunggu pertanyaan.\n- Skor 2: Manipulatif menghindari masalah.\n- Skor 1: Defensif menyalahkan publik.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Pelayanan Publik',
    pertanyaan:
      'Saat jam pelayanan masih berlangsung, seorang rekan loket sebelah meninggalkan mejanya cukup lama untuk urusan pribadi tanpa pemberitahuan, sehingga antrean di mejanya menumpuk dan pemohon mulai mengeluh. Sikap Anda adalah...',
    opsi_a: 'Mengabaikan antrean tersebut karena bukan tugas loket Anda.',
    opsi_b: 'Membantu menangani antrean mendesak sesuai kewenangan atau mengalihkannya secara tertib, sambil melaporkan situasi secara konstruktif kepada koordinator layanan.',
    opsi_c: 'Ikut menjelaskan kepada warga bahwa rekan Anda memang sering tidak disiplin.',
    opsi_d: 'Menutup loket rekan Anda dengan papan tanda istirahat agar warga tidak bertanya.',
    opsi_e: 'Menunggu hingga rekan Anda kembali sambil membiarkan warga berdiri menunggu.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 2, B: 5, C: 1, D: 3, E: 4 },
    pembahasan:
      'Pelayanan publik menuntut kerja tim demi kepuasan warga.\n- Skor 5: Menjaga kesinambungan layanan warga dan menindaklanjuti disiplin secara profesional.\n- Skor 4: Tetap tenang menunggu namun belum aktif mengurai penumpukan.\n- Skor 3: Menutup loket mengurangi ekspektasi tetapi merugikan waktu warga.\n- Skor 2: Sikap apatis antarunit.\n- Skor 1: Menjatuhkan citra instansi di depan publik.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Pelayanan Publik',
    pertanyaan:
      'Warga mengeluhkan bahwa formulir permohonan daring terlalu panjang dan banyak istilah hukum yang membingungkan masyarakat awam. Respons terbaik Anda dalam tim pengembangan layanan adalah...',
    opsi_a: 'Mempertahankan istilah hukum baku meski sulit dipahami karena sudah sesuai peraturan lama.',
    opsi_b: 'Menyederhanakan bahasa antarmuka menjadi kalimat populer yang mudah dimengerti, menambahkan contoh pengisian, dan memangkas kolom berulang.',
    opsi_c: 'Menyediakan kamus istilah hukum terpisah agar warga mempelajarinya sebelum mendaftar.',
    opsi_d: 'Meminta warga menggunakan jasa perantara/biro jasa jika kesulitan mengisi formulir.',
    opsi_e: 'Mengabaikan keluhan tersebut karena hanya berasal dari sebagian kecil pengguna.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 2, B: 5, C: 4, D: 1, E: 3 },
    pembahasan:
      'User-centric public service mengutamakan kemudahan akses warga.\n- Skor 5: Redesain formulir dengan bahasa lugas, contoh, dan efisiensi field.\n- Skor 4: Memberi bantuan tambahan namun masih membebani pengguna.\n- Skor 3: Mengabaikan umpan balik minoritas.\n- Skor 2: Kaku tanpa empati pengguna.\n- Skor 1: Mendorong praktik percaloan.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Pelayanan Publik',
    pertanyaan:
      'Setelah membantu mengurus dokumen penting, seorang warga menyelipkan amplop berisi uang di balik map berkas sebagai tanda terima kasih. Tindakan yang paling mencerminkan integritas pelayanan publik adalah...',
    opsi_a: 'Menerima amplop tersebut karena tidak meminta dan nilainya tidak seberapa.',
    opsi_b: 'Mengembalikan amplop secara sopan sembari menjelaskan bahwa seluruh layanan sudah menjadi kewajiban ASN dan tidak dipungut biaya tambahan.',
    opsi_c: 'Meminta warga memasukkannya ke kotak amal masjid dekat kantor saja.',
    opsi_d: 'Menolaknya dengan nada keras agar warga sekitar melihat integritas Anda.',
    opsi_e: 'Menerimanya terlebih dahulu lalu menyumbangkannya ke kas sosial kantor.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 1, B: 5, C: 3, D: 4, E: 2 },
    pembahasan:
      'Integritas pelayanan bebas pungli harus disampaikan secara santun dan edukatif.\n- Skor 5: Menolak halus, mengedukasi hak layanan bebas biaya, dan menjaga martabat warga.\n- Skor 4: Menolak tegas tetapi cara keras dapat mempermalukan warga.\n- Skor 3: Mengalihkan secara baik namun belum mengedukasi prinsip layanan gratis.\n- Skor 2: Tetap menerima meski disalurkan ke kas sosial.\n- Skor 1: Menerima gratifikasi secara langsung.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Pelayanan Publik',
    pertanyaan:
      'Anda menerima aduan warga mengenai jalan lingkungan rusak parah yang sebenarnya berada di bawah kewenangan dinas lain, bukan instansi Anda. Sikap yang paling berorientasi pelayanan adalah...',
    opsi_a: 'Menjawab singkat bahwa hal tersebut bukan urusan kantor Anda.',
    opsi_b: 'Menerima informasi aduan dengan ramah, menjelaskan pembagian kewenangan secara jelas, dan mengarahkan atau meneruskan laporan ke kanal resmi dinas terkait.',
    opsi_c: 'Menjanjikan bahwa instansi Anda akan langsung memperbaikinya minggu depan.',
    opsi_d: 'Menyarankan warga memviralkan jalan rusak itu di media sosial.',
    opsi_e: 'Meminta warga mencari sendiri alamat kantor dinas pekerjaan umum.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 2, B: 5, C: 1, D: 3, E: 4 },
    pembahasan:
      'Konsep "No Wrong Door Policy" menuntut petugas tidak sekadar melempar tanggung jawab.\n- Skor 5: Informatif, ramah, dan membantu menghubungkan warga ke unit berwenang.\n- Skor 4: Menjelaskan kewenangan tetapi kurang memfasilitasi penghubungan.\n- Skor 3: Tidak profesional mengarahkan eskalasi media.\n- Skor 2: Jawaban ketus/menolak mentah-mentah.\n- Skor 1: Memberi janji palsu di luar kewenangan.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Pelayanan Publik',
    pertanyaan:
      'Menjelang libur panjang akhir tahun, jumlah pemohon layanan paspor atau administrasi kependudukan melonjak dua kali lipat. Sebagai bagian dari tim pelayanan, usulan terbaik untuk menjaga kualitas layanan adalah...',
    opsi_a: 'Membatasi kuota harian jauh lebih sedikit agar pegawai tidak kelelahan.',
    opsi_b: 'Mengusulkan pembagian shift fleksibel, optimalisasi layanan janji temu daring, dan penyediaan loket prioritas bagi kebutuhan darurat.',
    opsi_c: 'Meminta pemohon datang kembali setelah musim liburan selesai.',
    opsi_d: 'Bekerja lembur sendirian tanpa berkoordinasi dengan anggota tim lain.',
    opsi_e: 'Mempercepat proses dengan melewatkan tahapan pemeriksaan keabsahan dokumen.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 3, B: 5, C: 2, D: 4, E: 1 },
    pembahasan:
      'Kesiapan lonjakan permintaan membutuhkan manajemen kapasitas dan inovasi.\n- Skor 5: Sistemik (shift, booking online, jalur prioritas) tanpa mengorbankan akurasi.\n- Skor 4: Komitmen tinggi tapi tidak terkoordinasi.\n- Skor 3: Membatasi kuota tanpa solusi efisiensi.\n- Skor 2: Menunda hak layanan masyarakat.\n- Skor 1: Mengorbankan keamanan/keabsahan dokumen.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Pelayanan Publik',
    pertanyaan:
      'Seorang warga memberikan ulasan bintang satu di kanal pengaduan publik karena merasa petugas keamanan kantor bersikap kurang ramah saat menanyakan keperluannya. Tindakan perbaikan yang Anda lakukan sebagai koordinator layanan adalah...',
    opsi_a: 'Menghubungi warga tersebut untuk meminta maaf dan mendengarkan kronologi, lalu melakukan pembinaan komunikasi layanan prima kepada seluruh petugas lini depan termasuk sekuriti.',
    opsi_b: 'Meminta tim IT menghapus ulasan negatif tersebut agar peringkat instansi tetap baik.',
    opsi_c: 'Membiarkannya karena petugas keamanan bukan pegawai ASN tetap.',
    opsi_d: 'Langsung memecat petugas keamanan yang bersangkutan tanpa klarifikasi.',
    opsi_e: 'Membalas ulasan tersebut dengan membela diri bahwa petugas sedang kelelahan.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 1, C: 2, D: 3, E: 4 },
    pembahasan:
      'Layanan prima mencakup seluruh titik sentuh (touchpoints), termasuk satpam dan resepsionis.\n- Skor 5: Respons empatik ke pengadu + pembinaan menyeluruh tanpa menghakimi sepihak.\n- Skor 4: Memberi alasan internal yang terkesan defensif.\n- Skor 3: Reaktif ekstrem tanpa proses pembinaan adil.\n- Skor 2: Mengabaikan tanggung jawab lini depan.\n- Skor 1: Menutupi kritik publik.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Pelayanan Publik',
    pertanyaan:
      'Dokumen hasil layanan yang sudah dicetak ternyata memiliki kesalahan ketik nama pemohon akibat kelalaian input dari pihak kantor, dan warga baru menyadarinya setelah pulang ke rumah. Ketika ia menghubungi layanan pengaduan, sikap Anda adalah...',
    opsi_a: 'Meminta maaf secara tulus atas kesalahan instansi, memprioritaskan cetak ulang perbaikan secepatnya tanpa antre ulang, dan memfasilitasi pengiriman atau pengambilan praktis.',
    opsi_b: 'Menjelaskan bahwa warga seharusnya memeriksa berkas sebelum meninggalkan loket sehingga biaya perbaikan ditanggung pemohon.',
    opsi_c: 'Meminta warga datang lagi minggu depan sesuai jadwal antrean reguler.',
    opsi_d: 'Menyuruh warga mencoret dan membetulkan sendiri dengan pulpen.',
    opsi_e: 'Menyalahkan pegawai shift sebelumnya yang melakukan input data.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 2, C: 3, D: 1, E: 4 },
    pembahasan:
      'Service recovery (pemulihan layanan) menuntut tanggung jawab penuh institusi.\n- Skor 5: Mengakui kesalahan, prioritas perbaikan tanpa beban biaya/antrean tambahan.\n- Skor 4: Menyalahkan rekan tidak menyelesaikan keluhan warga.\n- Skor 3: Memperbaiki namun memperlakukan seperti pemohon baru.\n- Skor 2: Membebankan kesalahan kantor kepada warga.\n- Skor 1: Merusak keabsahan dokumen resmi.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Pelayanan Publik',
    pertanyaan:
      'Untuk meningkatkan akses informasi publik bagi generasi muda, atasan meminta ide pengembangan kanal layanan. Gagasan yang paling relevan adalah...',
    opsi_a: 'Mencetak lebih banyak brosur kertas dan menempelkannya di papan pengumuman kantor.',
    opsi_b: 'Mengembangkan kanal informasi singkat multi-platform dengan bahasa jelas, FAQ interaktif, dan waktu respons admin pesan yang terukur.',
    opsi_c: 'Membuka akun media sosial instansi tetapi hanya mengunggah foto kegiatan seremonial pimpinan.',
    opsi_d: 'Mewajibkan pelajar datang ke kantor setiap ingin menanyakan syarat layanan.',
    opsi_e: 'Menunggu masukan dari konsultan eksternal tahun depan tanpa uji coba apa pun.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 3, B: 5, C: 2, D: 1, E: 4 },
    pembahasan:
      'Inovasi komunikasi publik harus relevan dengan audiens dan terukur SLA-nya.\n- Skor 5: Konten informatif, interaktif, dan standar respons jelas.\n- Skor 4: Hati-hati namun lamban berinisiatif.\n- Skor 3: Metode konvensional kurang menjangkau generasi muda.\n- Skor 2: Komunikasi bersifat pencitraan, bukan layanan.\n- Skor 1: Mempersulit akses informasi.',
  },

  // === 2. JEJARING KERJA (16-27) ===
  {
    kategori: 'TKP',
    subtopik: 'Jejaring Kerja',
    pertanyaan:
      'Anda ditugaskan memimpin tim lintas bidang yang terdiri atas pegawai senior berpengalaman dan pegawai muda yang melek teknologi. Pada rapat perdana, terjadi perdebatan sengit antara pendekatan konvensional yang dianggap aman dan sistem digital baru yang dinilai berisiko. Langkah kepemimpinan kolaboratif Anda adalah...',
    opsi_a: 'Memihak pegawai muda sepenuhnya karena teknologi pasti lebih unggul.',
    opsi_b: 'Mengikuti keinginan pegawai senior agar suasana rapat tidak memanas.',
    opsi_c: 'Memfasilitasi diskusi setara yang memadukan pengalaman tata kelola senior dengan efisiensi digital tim muda melalui uji coba skala kecil terlebih dahulu.',
    opsi_d: 'Membubarkan rapat dan menyusun seluruh keputusan sendirian.',
    opsi_e: 'Meminta kedua kubu membuat proposal terpisah lalu memilihnya lewat undian.',
    jawaban_benar: 'C',
    bobot_tkp: { A: 3, B: 2, C: 5, D: 1, E: 4 },
    pembahasan:
      'Jejaring kerja membutuhkan sinergi antargenerasi dan resolusi konflik konstruktif.\n- Skor 5: Mengintegrasikan kekuatan kedua kelompok lewat pilot project berbasis bukti.\n- Skor 4: Berusaha adil namun cara undian kurang rasional.\n- Skor 3: Mengabaikan pengalaman institusional senior.\n- Skor 2: Mengorbankan inovasi demi kenyamanan semu.\n- Skor 1: Otoriter menutup kolaborasi.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Jejaring Kerja',
    pertanyaan:
      'Dalam proyek integrasi data lintas instansi, dinas mitra sangat lambat merespons permintaan data sehingga jadwal tim Anda terancam molor. Tindakan paling efektif untuk menjaga kemitraan sekaligus target proyek adalah...',
    opsi_a: 'Mengirim surat teguran resmi bernada keras dan menembuskannya langsung ke kepala daerah.',
    opsi_b: 'Menghubungi narahubung dinas mitra secara personal dan profesional untuk mencari tahu kendala teknis mereka, lalu menawarkan asistensi atau penyesuaian format data.',
    opsi_c: 'Menghentikan proyek dan melaporkan bahwa mitra tidak kooperatif.',
    opsi_d: 'Memperkirakan angka data secara manual agar laporan tim Anda tetap selesai tepat waktu.',
    opsi_e: 'Menunggu saja sampai dinas mitra mengirimkan data tanpa melakukan follow-up.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 3, B: 5, C: 2, D: 1, E: 4 },
    pembahasan:
      'Jejaring kerja mengedepankan komunikasi empatik, pemecahan masalah bersama, dan menjaga relasi antarlembaga.\n- Skor 5: Proaktif menjalin komunikasi solusi tanpa merusak hubungan kemitraan.\n- Skor 4: Menjaga relasi namun pasif terhadap tenggat.\n- Skor 3: Eskalasi terlalu cepat sebelum dialog teknis.\n- Skor 2: Menyerah pada hambatan.\n- Skor 1: Memalsukan integritas data.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Jejaring Kerja',
    pertanyaan:
      'Anda baru dipindahkan ke unit kerja baru yang budaya komunikasinya cenderung individualistis; setiap pegawai fokus pada tugas masing-masing tanpa saling membantu. Cara Anda membangun jejaring kerja yang sehat adalah...',
    opsi_a: 'Mengikuti budaya tersebut dan menutup diri dari urusan rekan lain.',
    opsi_b: 'Mengkritik kebiasaan unit baru tersebut pada minggu pertama agar segera berubah.',
    opsi_c: 'Membangun keakraban secara wajar, bersikap terbuka menawarkan bantuan ketika tugas utama sudah selesai, dan menginisiasi berbagi pengetahuan ringan.',
    opsi_d: 'Mengajukan mutasi kembali ke unit kerja lama karena tidak nyaman.',
    opsi_e: 'Melaporkan rekan-rekan yang tidak mau berinteraksi kepada atasan.',
    jawaban_benar: 'C',
    bobot_tkp: { A: 3, B: 2, C: 5, D: 1, E: 4 },
    pembahasan:
      'Membangun jejaring dimulai dari keteladanan sikap kooperatif dan adaptasi sosial.\n- Skor 5: Menginisiasi interaksi positif secara bertahap dan kolaboratif.\n- Skor 4: Berharap perubahan dari atasan.\n- Skor 3: Hanya menjalankan tugas minimum tanpa membangun relasi.\n- Skor 2: Kritik dini memicu resistensi.\n- Skor 1: Menghindar dari tantangan adaptasi.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Jejaring Kerja',
    pertanyaan:
      'Ide inovatif yang Anda usulkan dalam rapat tim ditolak mentah-mentah oleh seorang rekan kerja, bahkan ia mengusulkan ide lain yang sebenarnya mirip namun dikemas berbeda. Sikap dewasa yang mencerminkan semangat kerja tim adalah...',
    opsi_a: 'Mendebatnya habis-habisan untuk membuktikan bahwa ide itu awalnya berasal dari Anda.',
    opsi_b: 'Menarik diri dari seluruh diskusi berikutnya dan menolak membantu eksekusi ide tersebut.',
    opsi_c: 'Tetap mendukung gagasan yang baik demi keberhasilan tujuan tim bersama, serta menambahkan penyempurnaan konstruktif pada implementasinya.',
    opsi_d: 'Menyampaikan sindiran di grup chat kantor agar rekan lain tahu siapa pencetus aslinya.',
    opsi_e: 'Meminta atasan membatalkan rapat karena merasa tidak dihargai.',
    jawaban_benar: 'C',
    bobot_tkp: { A: 3, B: 2, C: 5, D: 1, E: 4 },
    pembahasan:
      'Kedewasaan berjejaring menempatkan tujuan organisasi di atas ego pribadi.\n- Skor 5: Fokus pada keberhasilan tim dan kontribusi substantif.\n- Skor 4: Mengharap intervensi atasan.\n- Skor 3: Terjebak perdebatan ego.\n- Skor 2: Menarik kontribusi dari tim.\n- Skor 1: Menyebarkan konflik pasif-agresif.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Jejaring Kerja',
    pertanyaan:
      'Ketika menghadiri forum rapat koordinasi nasional bersama peserta dari berbagai kementerian dan pemerintah daerah, waktu istirahat kopi sering digunakan peserta untuk berdiskusi informal. Tindakan paling strategis dalam membangun jejaring profesional adalah...',
    opsi_a: 'Menghabiskan waktu istirahat bermain ponsel di sudut ruangan agar tidak canggung.',
    opsi_b: 'Hanya mengobrol dengan rekan satu kantor yang sudah Anda kenal baik.',
    opsi_c: 'Memperkenalkan diri secara ramah kepada peserta dari instansi lain, bertukar pandangan terkait praktik baik kerja, dan bertukar kontak resmi untuk kolaborasi lanjutan.',
    opsi_d: 'Meminta kontak sebanyak-banyaknya tanpa pernah membahas substansi pekerjaan.',
    opsi_e: 'Langsung meninggalkan ruang acara untuk makan siang di luar gedung sendirian.',
    jawaban_benar: 'C',
    bobot_tkp: { A: 2, B: 3, C: 5, D: 4, E: 1 },
    pembahasan:
      'Networking berkualitas dibangun melalui pertukaran nilai dan relevansi profesional.\n- Skor 5: Aktif memperluas jejaring lintas instansi dengan pertukaran wawasan bermakna.\n- Skor 4: Mengumpulkan kontak namun kurang membangun koneksi substantif.\n- Skor 3: Terjebak zona nyaman kelompok sendiri.\n- Skor 2: Pasif menutup peluang relasi.\n- Skor 1: Melewatkan kesempatan kolaborasi sama sekali.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Jejaring Kerja',
    pertanyaan:
      'Seorang rekan satu tim mengalami musibah keluarga mendadak dua hari sebelum presentasi penting tim di hadapan pimpinan. Bagian materi presentasi yang menjadi tanggung jawabnya baru selesai setengahnya. Sebagai anggota tim, sikap Anda adalah...',
    opsi_a: 'Menyatakan simpati namun memintanya tetap menyelesaikan sisa materi dari rumah.',
    opsi_b: 'Mengajak anggota tim lain membagi rata sisa pekerjaan rekan tersebut agar presentasi tetap optimal tanpa membebani kondisi keluarganya.',
    opsi_c: 'Melaporkan kepada pimpinan bahwa presentasi harus ditunda karena satu orang berhalangan.',
    opsi_d: 'Menyampaikan dalam presentasi nanti bagian mana saja yang belum selesai karena kesalahan rekan tersebut.',
    opsi_e: 'Membiarkan slide miliknya tetap kosong agar pimpinan melihat kontribusi tim secara jujur.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 3, B: 5, C: 4, D: 1, E: 2 },
    pembahasan:
      'Solidaritas tim melindungi keberhasilan kolektif sekaligus berempati kepada rekan.\n- Skor 5: Inisiatif membagi beban tim agar target organisasi aman dan rekan terbantu.\n- Skor 4: Menunda target padahal bisa diatasi bersama.\n- Skor 3: Kurang berempati terhadap situasi darurat.\n- Skor 2: Mengorbankan kualitas output organisasi.\n- Skor 1: Menyalahkan rekan yang sedang tertimpa musibah.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Jejaring Kerja',
    pertanyaan:
      'Dalam kerja sama penyusunan program pelatihan antara instansi Anda dan perguruan tinggi daerah, terjadi perbedaan jadwal antara kalender akademik kampus dan batas penyerapan anggaran instansi. Pendekatan koordinasi terbaik adalah...',
    opsi_a: 'Memaksa pihak kampus mengikuti jadwal instansi atau kerja sama dibatalkan.',
    opsi_b: 'Mengadakan pertemuan koordinasi bersama untuk memetakan titik temu jadwal (misal skema pelaksanaan paralel atau masa jeda semester) yang tetap mematuhi aturan anggaran.',
    opsi_c: 'Menyetujui jadwal kampus sepenuhnya meski melanggar aturan tahun anggaran.',
    opsi_d: 'Menyerahkan seluruh keputusan jadwal kepada pihak kampus tanpa pengawasan.',
    opsi_e: 'Menunda program ke tahun depan tanpa mengeksplorasi alternatif jadwal.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 2, B: 5, C: 1, D: 3, E: 4 },
    pembahasan:
      'Kemitraan win-win membutuhkan negosiasi kreatif dalam koridor regulasi.\n- Skor 5: Mencari titik temu jadwal yang legal dan saling menguntungkan.\n- Skor 4: Menghindari risiko tetapi kehilangan momentum kerja sama.\n- Skor 3: Kehilangan kontrol akuntabilitas.\n- Skor 2: Kaku menutup ruang dialog.\n- Skor 1: Melanggar aturan keuangan negara.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Jejaring Kerja',
    pertanyaan:
      'Anda melihat ketegangan komunikasi antara dua rekan kerja berbeda divisi yang menyebabkan alur persetujuan surat antarbagian terhambat selama tiga hari. Peran konstruktif yang dapat Anda ambil adalah...',
    opsi_a: 'Menjadi penengah netral dengan mengajak keduanya duduk bersama memfokuskan diskusi pada penyelarasan alur kerja, bukan persoalan personal.',
    opsi_b: 'Ikut membela rekan dari divisi Anda sendiri agar solidaritas divisi terjaga.',
    opsi_c: 'Menyebarkan cerita ketegangan mereka kepada pegawai di kantin.',
    opsi_d: 'Menghindari kedua orang tersebut supaya tidak ikut terseret masalah.',
    opsi_e: 'Mengirim surat kaleng kepada kepala bagian tentang pertengkaran mereka.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 2, C: 1, D: 4, E: 3 },
    pembahasan:
      'Mediasi netral mempercepat pemulihan kinerja organisasi.\n- Skor 5: Memfasilitasi rekonsiliasi profesional berfokus pada kelancaran tugas.\n- Skor 4: Aman secara pribadi tetapi membiarkan layanan terhambat.\n- Skor 3: Cara tidak transparan.\n- Skor 2: Memperuncing polarisasi antarunit.\n- Skor 1: Memperburuk konflik dengan gosip.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Jejaring Kerja',
    pertanyaan:
      'Saat menerima tugas proyek bersama mitra swasta atau komunitas masyarakat, mitra tersebut menyampaikan kritik tajam bahwa bahasa birokrasi pemerintah terlalu kaku dan sulit diakses warga. Respons Anda adalah...',
    opsi_a: 'Tersinggung dan menganggap komunitas tersebut tidak memahami tata aturan pemerintahan.',
    opsi_b: 'Berterima kasih atas masukan objektif tersebut dan mengajak mereka ikut memberi saran perbaikan materi komunikasi agar lebih mudah dipahami publik.',
    opsi_c: 'Mengiyakan di depan mereka tetapi tetap menggunakan format lama tanpa perubahan.',
    opsi_d: 'Memutus kerja sama dan mencari komunitas lain yang lebih penurut.',
    opsi_e: 'Meminta mereka saja yang menyusun seluruh dokumen resmi pemerintahan.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 1, B: 5, C: 3, D: 2, E: 4 },
    pembahasan:
      'Kolaborasi pentahelix menuntut keterbukaan terhadap umpan balik eksternal.\n- Skor 5: Reseptif terhadap kritik dan menjadikannya energi perbaikan bersama.\n- Skor 4: Melibatkan mitra namun tetap perlu menjaga koridor tanggung jawab ASN.\n- Skor 3: Sikap basa-basi tanpa komitmen perbaikan.\n- Skor 2: Anti-kritik.\n- Skor 1: Defensif dan menutup jejaring.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Jejaring Kerja',
    pertanyaan:
      'Anda memiliki jaringan keahlian atau pengalaman pelatihan di bidang analisis data yang ternyata sedang sangat dibutuhkan oleh tim dari divisi lain. Meskipun bukan bagian dari uraian tugas langsung Anda, sikap terbaik adalah...',
    opsi_a: 'Menawarkan sesi berbagi pengetahuan atau konsultasi teknis singkat di sela waktu yang tidak mengganggu tugas utama Anda.',
    opsi_b: 'Menuntut pembayaran honorarium narasumber terlebih dahulu sebelum membantu rekan sekantor.',
    opsi_c: 'Diam saja karena setiap divisi seharusnya menyelesaikan masalahnya sendiri.',
    opsi_d: 'Membantu secara penuh dengan meninggalkan target pekerjaan unit Anda sendiri.',
    opsi_e: 'Menyuruh mereka mencari tutorial sendiri di internet.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 1, C: 2, D: 4, E: 3 },
    pembahasan:
      'Berbagi pengetahuan (knowledge sharing) memperkuat kapasitas institusi secara menyeluruh.\n- Skor 5: Sinergi lintas unit dengan tetap menjaga prioritas tugas utama.\n- Skor 4: Niat membantu tinggi namun perlu manajemen prioritas agar tugas sendiri tidak terbengkalai.\n- Skor 3: Kurang berempati namun memberi petunjuk minimal.\n- Skor 2: Mentalitas silo (ego sektoral).\n- Skor 1: Komersialisasi kolaborasi internal.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Jejaring Kerja',
    pertanyaan:
      'Dalam suatu kepanitiaan kegiatan besar, komunikasi melalui grup pesan daring sering memicu salah paham karena perbedaan penafsiran nada tulisan. Kebiasaan kerja sama yang paling tepat Anda usulkan adalah...',
    opsi_a: 'Menghapus grup pesan daring dan melarang diskusi di luar surat resmi.',
    opsi_b: 'Menyepakati etika komunikasi yang jelas, merangkum setiap keputusan dalam poin singkat, dan segera melakukan panggilan suara atau temu singkat jika muncul potensi salah paham.',
    opsi_c: 'Membalas pesan yang memicu debat dengan emosi agar lawan bicara segera diam.',
    opsi_d: 'Membuat beberapa grup kecil terpisah untuk membicarakan rekan yang tidak sepaham.',
    opsi_e: 'Mematikan notifikasi grup dan baru membacanya seminggu sekali.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 4, B: 5, C: 2, D: 1, E: 3 },
    pembahasan:
      'Komunikasi efektif tim hibrida membutuhkan kejelasan ringkasan dan eskalasi media yang tepat.\n- Skor 5: Proaktif membangun tata komunikasi sehat dan klarifikasi cepat.\n- Skor 3: Menghindar dari arus koordinasi.\n- Skor 2: Menghilangkan alat bantu koordinasi cepat.\n- Skor 1: Memicu perpecahan tim.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Jejaring Kerja',
    pertanyaan:
      'Atasan meminta Anda berkoordinasi dengan pejabat senior dari instansi lain yang terkenal sangat sibuk dan sulit ditemui. Strategi jejaring kerja yang paling profesional adalah...',
    opsi_a: 'Menghubungi sekretariat beliau secara resmi dengan menyampaikan agenda singkat, tujuan jelas, serta menawarkan opsi waktu pertemuan singkat atau daring yang fleksibel.',
    opsi_b: 'Datang langsung ke kantornya tanpa janji dan menunggu di depan ruangannya seharian.',
    opsi_c: 'Mengirim pesan singkat mendadak malam hari agar langsung dibaca.',
    opsi_d: 'Meminta atasan saja yang menghubungi karena posisi Anda masih staf.',
    opsi_e: 'Menyerah setelah satu kali panggilan telepon tidak diangkat.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 3, C: 2, D: 4, E: 1 },
    pembahasan:
      'Profesionalisme jejaring menghargai waktu mitra dan kejelasan agenda.\n- Skor 5: Terstruktur, sopan, prosedural, dan memberi opsi fleksibel.\n- Skor 4: Menggunakan jalur atasan lebih aman tapi belum menunjukkan kemandirian.\n- Skor 3: Gigih namun kurang memperhatikan tata krama janji temu.\n- Skor 2: Melanggar etika jam kerja.\n- Skor 1: Mudah menyerah.',
  },

  // === 3. SOSIAL BUDAYA (28-39) ===
  {
    kategori: 'TKP',
    subtopik: 'Sosial Budaya',
    pertanyaan:
      'Anda ditempatkan sebagai CPNS di daerah terpencil yang mayoritas masyarakatnya memiliki adat istiadat, makanan pokok, dan bahasa sehari-hari yang sangat berbeda dengan daerah asal Anda. Pada bulan pertama, warga terlihat masih menjaga jarak dengan pendatang baru. Langkah adaptasi sosial budaya terbaik adalah...',
    opsi_a: 'Tetap tinggal di rumah dinas setelah jam kerja dan hanya bergaul dengan sesama perantau.',
    opsi_b: 'Menunjukkan rasa hormat terhadap adat setempat, mempelajari ungkapan dasar bahasa lokal, dan berpartisipasi wajar dalam kegiatan kemasyarakatan warga.',
    opsi_c: 'Mengajak warga desa mengubah kebiasaan tradisionalnya agar lebih modern seperti di kota asal Anda.',
    opsi_d: 'Meminta pindah tugas segera ke kota asal dengan alasan kendala bahasa.',
    opsi_e: 'Menganggap perbedaan budaya tidak penting selama tugas administratif kantor selesai.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 3, B: 5, C: 2, D: 1, E: 4 },
    pembahasan:
      'Kompetensi sosio-kultural ASN menuntut kepekaan dan kemampuan menjalin jembatan budaya.\n- Skor 5: Inklusif, rendah hati belajar budaya lokal, dan aktif membaur positif.\n- Skor 3: Profesional secara teknis namun berjarak secara sosial.\n- Skor 2: Mengisolasi diri.\n- Skor 1: Etnosentris atau lari dari penugasan.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Sosial Budaya',
    pertanyaan:
      'Dalam suatu acara makan siang bersama tim kantor yang beranggotakan pegawai dari beragam latar agama dan keyakinan, Anda bertugas memesan hidangan katering. Sikap kepekaan sosial budaya yang tepat adalah...',
    opsi_a: 'Memesan menu favorit Anda sendiri tanpa menanyakan preferensi atau pantangan rekan lain.',
    opsi_b: 'Memastikan seluruh atau pilihan menu tersedia secara aman/halal serta mempertimbangkan pantangan makan maupun alergi setiap anggota tim.',
    opsi_c: 'Meminta rekan yang memiliki pantangan khusus membawa bekal sendiri dari rumah.',
    opsi_d: 'Membatalkan makan siang bersama supaya tidak repot memikirkan perbedaan menu.',
    opsi_e: 'Menyerahkan pemesanan kepada restoran terdekat tanpa memeriksa komposisi menunya.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 2, B: 5, C: 3, D: 1, E: 4 },
    pembahasan:
      'Inklusivitas terlihat dari perhatian kecil yang menghormati kebutuhan semua pihak.\n- Skor 5: Menghargai keberagaman keyakinan dan kondisi personal rekan kerja.\n- Skor 4: Berniat praktis namun kurang teliti.\n- Skor 3: Membuat rekan minoritas merasa terpisah.\n- Skor 2: Tidak peduli pada kebutuhan tim.\n- Skor 1: Menghindari kebersamaan karena perbedaan.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Sosial Budaya',
    pertanyaan:
      'Di ruang kerja, beberapa rekan sering melontarkan candaan yang meniru-niru logat daerah tertentu untuk menertawakan seorang pegawai baru, meskipun pegawai baru tersebut tampak tersenyum canggung. Sikap Anda yang mencerminkan kepekaan budaya adalah...',
    opsi_a: 'Ikut tertawa ringan agar tidak dianggap terlalu serius oleh rekan-rekan.',
    opsi_b: 'Mengalihkan pembicaraan secara halus atau mengingatkan dengan cara santai dan bersahabat bahwa setiap logat daerah patut dihargai dan tidak dijadikan bahan olok-olok.',
    opsi_c: 'Membiarkannya selama pegawai baru tersebut tidak melapor ke bagian kepegawaian.',
    opsi_d: 'Memarahi rekan-rekan tersebut di depan banyak orang dengan ancaman hukuman disiplin.',
    opsi_e: 'Menasihati pegawai baru agar segera mengubah logat bicaranya supaya tidak diejek lagi.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 1, B: 5, C: 2, D: 4, E: 3 },
    pembahasan:
      'Lingkungan kerja yang aman dan setara menolak mikro-agresi atau stereotip kesukuan.\n- Skor 5: Menghentikan perundungan halus secara elegan, empatik, dan menjaga keharmonisan.\n- Skor 4: Berpihak pada prinsip anti-diskriminasi namun pendekatannya kurang persuasif.\n- Skor 3: Membebankan penyesuaian pada korban.\n- Skor 2: Membiarkan lingkungan tidak sehat.\n- Skor 1: Ikut menormalisasi ejekan budaya.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Sosial Budaya',
    pertanyaan:
      'Program pemberdayaan ekonomi desa yang Anda rancang secara teknis sangat rapi, tetapi ditolak warga karena jadwal sosialisasinya bertepatan dengan tradisi adat panen raya yang sakral bagi masyarakat setempat. Langkah bijak Anda adalah...',
    opsi_a: 'Tetap memaksakan acara sesuai jadwal SK kantor karena anggaran harus segera cair.',
    opsi_b: 'Menghormati tradisi adat setempat dengan menunda jadwal sosialisasi ke waktu yang disepakati bersama tokoh adat dan masyarakat.',
    opsi_c: 'Menganggap warga desa tidak menghargai niat baik pemerintah membantu ekonomi mereka.',
    opsi_d: 'Menggelar sosialisasi di kantor kecamatan saja tanpa mengundang warga desa tersebut.',
    opsi_e: 'Mengganti desa sasaran program tanpa berkomunikasi dengan kepala desa.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 2, B: 5, C: 1, D: 3, E: 4 },
    pembahasan:
      'Keberhasilan program publik memerlukan legitimasi sosial dan penghormatan kearifan lokal.\n- Skor 5: Menyelaraskan agenda birokrasi dengan ritme budaya masyarakat secara dialogis.\n- Skor 4: Mengalihkan sasaran menghindari benturan, namun gagal merangkul warga awal.\n- Skor 3: Formalitas tanpa partisipasi warga terdampak.\n- Skor 2: Pemaksaan yang melahirkan penolakan.\n- Skor 1: Sikap arogan terhadap budaya warga.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Sosial Budaya',
    pertanyaan:
      'Salah seorang rekan kerja Anda sedang menjalankan ibadah keagamaan atau hari raya besar di tengah jadwal padat penyusunan laporan unit. Sebagai rekan kerja yang menjunjung toleransi, tindakan Anda adalah...',
    opsi_a: 'Mendukung haknya menjalankan ibadah dan berkoordinasi membagi jadwal penugasan secara adil agar target laporan tetap tercapai tanpa mengganggu kekhusyukan ibadahnya.',
    opsi_b: 'Memintanya tetap masuk kerja penuh karena pekerjaan kantor lebih mendesak.',
    opsi_c: 'Menyindirnya bahwa terlalu banyak hari libur keagamaan menghambat produktivitas tim.',
    opsi_d: 'Mengambil alih seluruh pekerjaannya tanpa komunikasi sehingga jadwal revisi berantakan.',
    opsi_e: 'Melaporkannya tidak berdedikasi karena mengajukan cuti hari besar.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 3, C: 1, D: 4, E: 2 },
    pembahasan:
      'Toleransi aktif di tempat kerja diwujudkan melalui pengaturan tugas yang adil dan saling mendukung.\n- Skor 5: Menghormati kebebasan beribadah sekaligus menjaga kinerja kolektif.\n- Skor 4: Niat membantu baik namun kurang koordinasi.\n- Skor 2: Tidak peka terhadap hak beragama.\n- Skor 1: Intoleransi nyata.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Sosial Budaya',
    pertanyaan:
      'Saat bertugas melakukan penyuluhan kesehatan di wilayah dengan tingkat literasi beragam, Anda menemukan sebagian masyarakat masih mempercayai mitos pengobatan turun-temurun yang berisiko membahayakan ibu hamil. Pendekatan komunikasi sosial budaya yang paling efektif adalah...',
    opsi_a: 'Menyebut tradisi masyarakat tersebut bodoh dan ketinggalan zaman di depan forum.',
    opsi_b: 'Bekerja sama dengan tokoh masyarakat/adat dan kader lokal untuk menyampaikan edukasi medis dengan bahasa santun, menghormati niat baik menjaga ibu hamil, sambil meluruskan risikonya secara ilmiah.',
    opsi_c: 'Membiarkan saja karena merupakan hak budaya masyarakat setempat.',
    opsi_d: 'Membagikan selebaran berisi istilah kedokteran berbahasa Inggris.',
    opsi_e: 'Mengancam tidak akan memberikan layanan puskesmas bagi keluarga yang menolak aturan.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 1, B: 5, C: 3, D: 4, E: 2 },
    pembahasan:
      'Perubahan perilaku masyarakat membutuhkan jembatan budaya (cultural broker).\n- Skor 5: Menggandeng tokoh lokal dan komunikasi empatik berbasis bukti tanpa merendahkan.\n- Skor 3: Tidak komunikatif bagi audiens awam.\n- Skor 2: Pembiaran risiko nyawa atau pendekatan koersif.\n- Skor 1: Merendahkan martabat warga.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Sosial Budaya',
    pertanyaan:
      'Kantor Anda menerima beberapa peserta magang mahasiswa dari berbagai daerah di Indonesia, sebagian tampak canggung dan belum memahami tata cara kerja formal. Sebagai pegawai pembimbing, sikap Anda adalah...',
    opsi_a: 'Menyambut mereka dengan hangat, memberikan orientasi budaya kerja yang jelas, dan memperlakukan seluruh peserta magang secara setara tanpa pilih kasih.',
    opsi_b: 'Lebih akrab dan memberi proyek menarik hanya kepada peserta magang yang berasal dari satu daerah dengan Anda.',
    opsi_c: 'Membiarkan mereka belajar sendiri melalui kesalahan selama masa magang.',
    opsi_d: 'Menugaskan mereka hanya untuk pekerjaan fotokopi dan membuat kopi.',
    opsi_e: 'Menilai kemampuan mereka semata-mata dari gaya berpakaian hari pertama.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 1, C: 4, D: 3, E: 2 },
    pembahasan:
      'Sikap inklusif dan bebas nepotisme daerah membangun lingkungan belajar yang sehat.\n- Skor 5: Ramah, suportif, terstruktur, dan adil bagi semua latar belakang.\n- Skor 3: Netral tetapi kurang membimbing.\n- Skor 2: Mengabaikan potensi pembinaan.\n- Skor 1: Favoritisme primordial.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Sosial Budaya',
    pertanyaan:
      'Di lingkungan tempat tinggal dinas yang majemuk, tetangga sebelah rumah mengadakan acara doa bersama yang dihadiri cukup banyak tamu hingga parkir kendaraan sedikit memakan badan jalan gang. Sikap bertetangga yang bijaksana adalah...',
    opsi_a: 'Langsung memarahi tuan rumah dan memfoto kendaraan tamu untuk dilaporkan ke RT.',
    opsi_b: 'Menghargai kegiatan ibadah tetangga tersebut, dan jika akses jalan terhalang darurat, menyampaikan permintaan penataan parkir secara sopan dan kekeluargaan.',
    opsi_c: 'Menyalakan musik keras-keras sebagai bentuk protes agar acara mereka terganggu.',
    opsi_d: 'Menutup pintu gerbang dan menolak menyapa tetangga tersebut selama sebulan.',
    opsi_e: 'Memanggil petugas derek tanpa berbicara terlebih dahulu dengan tuan rumah.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 3, B: 5, C: 1, D: 2, E: 4 },
    pembahasan:
      'Harmoni sosial dalam masyarakat majemuk bertumpu pada tenggang rasa dan komunikasi santun.\n- Skor 5: Toleran dan menyelesaikan kendala teknis lingkungan secara kekeluargaan.\n- Skor 3: Mengutamakan aturan tetapi melewatkan adab bertetangga.\n- Skor 2: Reaktif emosional.\n- Skor 1: Membalas gangguan dengan konflik.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Sosial Budaya',
    pertanyaan:
      'Dalam menyusun desain seragam atau materi kampanye hari ulang tahun instansi, muncul usulan agar seluruh desain hanya menampilkan motif budaya satu provinsi dominan saja. Sebagai panitia, pandangan inklusif yang Anda sampaikan adalah...',
    opsi_a: 'Menyetujui usulan tersebut agar desainnya cepat selesai.',
    opsi_b: 'Mengusulkan perpaduan elemen atau motif Nusantara yang beragam secara harmonis agar mencerminkan identitas kebangsaan yang merangkul semua daerah.',
    opsi_c: 'Menghapus seluruh unsur budaya lokal dan menggantinya dengan warna polos.',
    opsi_d: 'Meminta daerah asal Anda yang dipilih menjadi satu-satunya tema.',
    opsi_e: 'Menyerahkan desain sepenuhnya kepada percetakan tanpa arahan.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 2, B: 5, C: 3, D: 1, E: 4 },
    pembahasan:
      'Representasi visual instansi publik sebaiknya merefleksikan Bhinneka Tunggal Ika.\n- Skor 5: Merangkul keberagaman Nusantara secara estetik dan inklusif.\n- Skor 4: Menyerahkan ke pihak profesional meski kehilangan pesan nilai.\n- Skor 3: Menghindari keberagaman secara pasif.\n- Skor 2: Mengabaikan representasi kelompok lain.\n- Skor 1: Menonjolkan etnosentrisme.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Sosial Budaya',
    pertanyaan:
      'Seorang rekan kerja yang baru pulih dari gangguan kecemasan kembali masuk kantor, namun tampak masih sensitif terhadap tekanan suara keras. Lingkungan kerja yang inklusif dan berempati Anda wujudkan dengan cara...',
    opsi_a: 'Menjaga suasana kerja tetap kondusif, berkomunikasi dengan nada tenang, dan memperlakukannya secara wajar dan suportif tanpa menstigma.',
    opsi_b: 'Menghindarinya sama sekali karena takut salah berbicara.',
    opsi_c: 'Menanyakan detail riwayat medisnya di depan rekan-rekan kerja lain.',
    opsi_d: 'Meminta atasan memindahkannya ke gudang arsip yang sepi.',
    opsi_e: 'Menyuruhnya mengundurkan diri jika belum kuat menghadapi kebisingan kantor.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 4, C: 3, D: 2, E: 1 },
    pembahasan:
      'Kesadaran kesehatan mental merupakan bagian dari empati sosial budaya modern.\n- Skor 5: Suportif, menghargai privasi, dan menciptakan ruang kerja ramah.\n- Skor 3: Bermaksud hati-hati tapi menimbulkan keterasingan.\n- Skor 2: Melanggar privasi atau meminggirkan.\n- Skor 1: Diskriminatif.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Sosial Budaya',
    pertanyaan:
      'Saat melakukan pendataan sosial di sebuah kampung nelayan, Anda dijamu makanan tradisional sederhana oleh keluarga kurang mampu, padahal Anda baru saja makan siang. Sikap menghargai tuan rumah yang paling tepat adalah...',
    opsi_a: 'Menolak mentah-mentah dengan alasan sudah kenyang dan takut sakit perut.',
    opsi_b: 'Mengucapkan terima kasih dengan tulus, mencicipi hidangan secukupnya sebagai bentuk penghormatan atas ketulusan tuan rumah, lalu melanjutkan pendataan dengan ramah.',
    opsi_c: 'Mengambil makanan tersebut lalu diam-diam membuangnya saat tuan rumah ke dapur.',
    opsi_d: 'Meminta uang pengganti saja karena tidak terbiasa makan masakan kampung.',
    opsi_e: 'Menjelaskan panjang lebar tentang standar gizi dan higienitas di depan keluarga tersebut.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 3, B: 5, C: 2, D: 1, E: 4 },
    pembahasan:
      'Empati kultural menghormati ketulusan masyarakat tanpa memandang status ekonomi.\n- Skor 5: Santun, menghargai kehormatan tuan rumah, dan menjaga hubungan baik.\n- Skor 3: Berniat edukasi namun tidak tepat momen.\n- Skor 2: Menolak secara kaku yang dapat melukai perasaan.\n- Skor 1: Tidak menghargai martabat warga.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Sosial Budaya',
    pertanyaan:
      'Ketika terjadi pergeseran pimpinan di kantor Anda yang berasal dari latar belakang budaya komunikasi lebih lugas dan cepat (to the point) dibandingkan pimpinan sebelumnya yang sangat halus dan tidak langsung, sikap adaptif Anda adalah...',
    opsi_a: 'Mengeluh bahwa pimpinan baru tidak sopan dan tidak menghargai perasaan staf.',
    opsi_b: 'Memahami perbedaan gaya komunikasi tersebut sebagai keragaman karakter, menyesuaikan penyampaian laporan menjadi ringkas dan berbasis data tanpa mengurangi kesantunan.',
    opsi_c: 'Menolak menghadiri rapat pimpinan baru sampai ia menyesuaikan diri dengan budaya lama.',
    opsi_d: 'Berusaha meniru nada bicara kerasnya secara berlebihan di depan staf junior.',
    opsi_e: 'Mengajak rekan kerja membuat petisi protes gaya bicara pimpinan.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 3, B: 5, C: 2, D: 4, E: 1 },
    pembahasan:
      'Adaptabilitas lintas gaya komunikasi mencegah kesalahpahaman profesional.\n- Skor 5: Membaca konteks komunikasi secara objektif dan menyesuaikan format kerja.\n- Skor 3: Meniru tanpa memahami substansi.\n- Skor 2: Baper/personal terhadap gaya komunikasi.\n- Skor 1: Resistensi destruktif.',
  },

  // === 4. TEKNOLOGI INFORMASI & KOMUNIKASI / TIK (40-51) ===
  {
    kategori: 'TKP',
    subtopik: 'Teknologi Informasi & Komunikasi',
    pertanyaan:
      'Instansi Anda beralih dari pengarsipan manual ke sistem tata naskah dinas elektronik (e-Office). Beberapa pegawai senior merasa kesulitan mengoperasikan aplikasi baru dan khawatir salah klik. Sebagai rekan yang lebih mahir TIK, tindakan Anda adalah...',
    opsi_a: 'Membuat panduan bergambar langkah demi langkah yang mudah diikuti dan meluangkan waktu mendampingi mereka praktik langsung hingga terbiasa.',
    opsi_b: 'Mengambil alih seluruh penginputan akun mereka dengan meminta kata sandi masing-masing.',
    opsi_c: 'Menyarankan mereka meminta bagian kepegawaian membebaskan mereka dari kewajiban memakai aplikasi.',
    opsi_d: 'Menertawakan kekakuan mereka karena dianggap tidak mengikuti perkembangan zaman.',
    opsi_e: 'Membiarkan mereka belajar sendiri dari buku manual tebal setebal 200 halaman.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 2, C: 3, D: 1, E: 4 },
    pembahasan:
      'Penguasaan TIK ASN mencakup transfer pengetahuan dan keamanan akun.\n- Skor 5: Mengajarkan kemandirian digital melalui panduan praktis dan pendampingan sabar.\n- Skor 3: Kurang membantu transisi nyata.\n- Skor 2: Berbagi kata sandi melanggar keamanan siber, atau menolak transformasi.\n- Skor 1: Sikap merendahkan rekan.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Teknologi Informasi & Komunikasi',
    pertanyaan:
      'Anda menerima pesan surel berpenampilan resmi mengatasnamakan admin kepegawaian pusat yang meminta Anda mengklik tautan eksternal dan memasukkan kata sandi akun SSO instansi untuk pemutakhiran data tunjangan dalam 2 jam. Tindakan keamanan siber yang paling tepat adalah...',
    opsi_a: 'Segera mengisi kata sandi sebelum batas waktu 2 jam berakhir agar tunjangan tidak tertunda.',
    opsi_b: 'Memeriksa alamat domain pengirim secara teliti, tidak mengklik tautan mencurigakan, mengonfirmasi langsung ke tim IT/kepegawaian resmi, dan melaporkan indikasi phishing tersebut.',
    opsi_c: 'Meneruskan surel tersebut ke grup WhatsApp seluruh kantor agar rekan lain ikut mengecek.',
    opsi_d: 'Membalas surel tersebut dengan menanyakan apakah benar dari pusat.',
    opsi_e: 'Menghapus surel tersebut diam-diam tanpa memberi tahu tim keamanan IT.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 1, B: 5, C: 2, D: 3, E: 4 },
    pembahasan:
      'Kesadaran keamanan siber (cyber hygiene) sangat krusial bagi ASN di era SPBE.\n- Skor 5: Verifikasi domain, hindari klik, konfirmasi jalur resmi, dan lapor insiden ke tim IT untuk melindungi organisasi.\n- Skor 4: Aman bagi diri sendiri tapi belum membantu pencegahan bagi rekan lain.\n- Skor 3: Berinteraksi dengan penyerang tidak aman.\n- Skor 2: Menyebarkan tautan phishing ke grup memperbesar risiko korban.\n- Skor 1: Terkena rekayasa sosial (credential theft).',
  },
  {
    kategori: 'TKP',
    subtopik: 'Teknologi Informasi & Komunikasi',
    pertanyaan:
      'Data penerima bantuan sosial yang berisi NIK, alamat, dan kondisi ekonomi warga tersimpan di komputer Anda. Seorang kenalan mahasiswa meminta salinan mentah file Excel tersebut untuk keperluan tugas akhir skripsinya tanpa surat izin riset resmi. Sikap Anda adalah...',
    opsi_a: 'Memberikannya karena niatnya baik untuk penelitian akademik.',
    opsi_b: 'Menolak memberikan data mentah pribadi dengan menjelaskan kewajiban perlindungan data pribadi (UU PDP), dan mengarahkannya pada data agregat statistik publik atau prosedur permohonan izin resmi.',
    opsi_c: 'Memberikan file tersebut setelah menghapus kolom nomor telepon saja sementara nama dan NIK tetap ada.',
    opsi_d: 'Mengunggah file tersebut ke tautan awan terbuka agar mudah diunduh siapa saja.',
    opsi_e: 'Meminta imbalan kecil untuk mengganti biaya olah data.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 3, B: 5, C: 4, D: 2, E: 1 },
    pembahasan:
      'Perlindungan data pribadi (UU No. 27 Tahun 2022) wajib dijaga aparatur pengelola data.\n- Skor 5: Tegas melindungi data sensitif sekaligus memberi solusi data statistik teragregasi atau jalur legal.\n- Skor 3: Anonimisasi parsial (NIK & nama masih bocor).\n- Skor 2: Mengabaikan kerahasiaan data demi rasa iba.\n- Skor 1: Kebocoran data publik atau komersialisasi ilegal.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Teknologi Informasi & Komunikasi',
    pertanyaan:
      'Saat rapat rutin masih dilakukan dengan mencetak ratusan halaman lampiran laporan keuangan tiap bulan sehingga memboroskan kertas dan memakan waktu pencarian data, usulan pemanfaatan TIK yang paling realistis Anda tawarkan adalah...',
    opsi_a: 'Mengusulkan penggunaan dokumen digital terstruktur di penyimpanan awan instansi dengan daftar isi tertaut dan akses terkendali, serta hanya mencetak ringkasan penting bila wajib secara hukum.',
    opsi_b: 'Membakar seluruh arsip kertas lama mulai besok pagi.',
    opsi_c: 'Meminta setiap peserta rapat memfoto halaman laporan dari buku pimpinan menggunakan ponsel.',
    opsi_d: 'Mengirim seluruh dokumen rahasia instansi melalui aplikasi pesan instan pribadi tanpa enkripsi.',
    opsi_e: 'Tetap mencetak seluruh ratusan halaman karena kebiasaan rapat lebih nyaman memegang kertas.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 1, C: 4, D: 2, E: 3 },
    pembahasan:
      'Transformasi digital harus efisien, terstruktur, dan aman.\n- Skor 5: Paperless bertahap dengan kontrol akses dan kepatuhan arsip resmi.\n- Skor 3: Tidak sistematis dan rawan kesalahan baca.\n- Skor 2: Tidak aman bagi kerahasiaan data atau menolak efisiensi.\n- Skor 1: Merusak arsip negara.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Teknologi Informasi & Komunikasi',
    pertanyaan:
      'Aplikasi pelaporan kinerja yang dikembangkan vendor sering mengalami galat (bug) pada fitur ekspor laporan bulanan menjelang tenggat pengumpulan. Sikap adaptif dan solutif berbasis TIK adalah...',
    opsi_a: 'Mengeluh di media sosial pribadi tentang buruknya kualitas aplikasi pemerintah.',
    opsi_b: 'Mendokumentasikan tangkapan layar serta langkah terjadinya galat secara rinci untuk dikirimkan ke tim pengembang, sembari menyiapkan alternatif laporan sementara agar tenggat tetap terpenuhi.',
    opsi_c: 'Tidak mengumpulkan laporan sama sekali dengan alasan sistem sedang rusak.',
    opsi_d: 'Mencoba membongkar kode program aplikasi secara sepihak tanpa izin tim IT.',
    opsi_e: 'Menunggu hingga ada pegawai lain yang melapor ke tim IT.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 1, B: 5, C: 2, D: 3, E: 4 },
    pembahasan:
      'Literasi TIK aparatur memadukan bug reporting yang berkualitas dan rencana cadangan (contingency plan).\n- Skor 5: Membantu perbaikan teknis secara akurat sekaligus menjaga target kerja tetap tercapai.\n- Skor 3: Pasif mengandalkan orang lain.\n- Skor 2: Menjadikan kendala sistem sebagai alasan tidak bekerja atau bertindak di luar otorisasi.\n- Skor 1: Merusak citra lembaga tanpa memberi solusi.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Teknologi Informasi & Komunikasi',
    pertanyaan:
      'Anda terbiasa menggunakan perangkat lunak pengolah angka dasar, tetapi tugas baru menuntut pengolahan puluhan ribu baris data anggaran dengan tenggat ketat. Tindakan terbaik Anda adalah...',
    opsi_a: 'Menghitung puluhan ribu baris tersebut satu per satu secara manual dengan kalkulator meja.',
    opsi_b: 'Segera mempelajari rumus lanjutan atau alat bantu olah data yang aman dan terverifikasi (seperti pivot table/query) serta menguji keakuratannya sebelum dipakai.',
    opsi_c: 'Meminta rekan lain mengerjakan seluruh bagian analisis data Anda.',
    opsi_d: 'Mengunggah seluruh file anggaran rahasia instansi ke situs pengolah data gratis tidak dikenal di internet.',
    opsi_e: 'Menolak penugasan karena belum pernah mendapat pelatihan formal dari kantor.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 3, B: 5, C: 4, D: 1, E: 2 },
    pembahasan:
      'Pembelajar mandiri teknologi yang sadar keamanan data adalah ciri ASN unggul.\n- Skor 5: Upskilling cepat, efisien, dan memvalidasi akurasi serta keamanan alat.\n- Skor 3: Bergantung kepada orang lain.\n- Skor 2: Tidak efisien atau menolak tantangan.\n- Skor 1: Mengorbankan keamanan data anggaran negara ke layanan pihak ketiga tak tepercaya.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Teknologi Informasi & Komunikasi',
    pertanyaan:
      'Ketika mengadakan rapat koordinasi daring (video conference) dengan peserta dari berbagai wilayah yang sebagian koneksinya kurang stabil, cara Anda memastikan efektivitas pertemuan berbasis TIK adalah...',
    opsi_a: 'Membagikan agenda dan bahan paparan terlebih dahulu, mengatur tata tertib mikrofon, merekam notulen digital terstruktur, serta menyediakan kanal chat bagi peserta berjaringan lemah.',
    opsi_b: 'Mewajibkan seluruh peserta menyalakan kamera resolusi tinggi terus-menerus meski sinyal mereka terputus.',
    opsi_c: 'Mengeluarkan peserta yang suaranya putus-putus dari ruang rapat daring.',
    opsi_d: 'Membiarkan semua mikrofon menyala bersamaan agar suasana terasa ramai.',
    opsi_e: 'Membatalkan rapat daring dan mewajibkan semua peserta terbang ke ibu kota.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 3, C: 1, D: 2, E: 4 },
    pembahasan:
      'Literasi kolaborasi digital memaksimalkan inklusivitas di tengah keterbatasan infrastruktur.\n- Skor 5: Terencana, adaptif bandwidth, dan terdokumentasi rapi.\n- Skor 3: Tidak efisien biaya dan waktu.\n- Skor 2: Kurang peka terhadap kendala teknis peserta.\n- Skor 1: Menghilangkan hak partisipasi peserta daerah.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Teknologi Informasi & Komunikasi',
    pertanyaan:
      'Anda menemukan bahwa komputer layanan publik bersama di ruang kantor masih dalam keadaan login akun sistem milik pegawai shift pagi yang lupa logout sebelum pulang. Tindakan keamanan informasi Anda adalah...',
    opsi_a: 'Segera melakukan logout dari akun rekan tersebut dan mengingatkannya secara sopan tentang pentingnya menjaga keamanan sesi akun kantor.',
    opsi_b: 'Mengecek isi pesan dan riwayat pekerjaan rekan Anda karena penasaran.',
    opsi_c: 'Menggunakan akun rekan tersebut untuk menyetujui permohonan layanan agar cepat.',
    opsi_d: 'Membiarkannya terbuka sepanjang malam sampai pegawai tersebut datang besok pagi.',
    opsi_e: 'Membuat pengumuman di grup kantor bahwa rekan tersebut ceroboh dan tidak layak memegang akun.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 1, C: 2, D: 3, E: 4 },
    pembahasan:
      'Keamanan sistem bersama bertumpu pada disiplin akses dan saling menjaga antarrekan.\n- Skor 5: Menutup celah akses segera dan mengingatkan secara konstruktif.\n- Skor 3: Menjaga keamanan tetapi mempermalukan rekan di forum terbuka.\n- Skor 2: Membiarkan risiko penyalahgunaan akun.\n- Skor 1: Menyalahgunakan akses orang lain.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Teknologi Informasi & Komunikasi',
    pertanyaan:
      'Sebuah informasi kebijakan baru beredar cepat di grup pesan warga berbentuk tangkapan layar buram tanpa tanggal dan sumber resmi, menyebabkan banyak warga bertanya ke akun media sosial kantor. Langkah komunikasi digital paling tepat adalah...',
    opsi_a: 'Menunggu hingga berita tersebut masuk televisi nasional baru memberi tanggapan.',
    opsi_b: 'Memverifikasi status kebijakan ke unit berwenang, lalu segera menerbitkan klarifikasi resmi bervisual jelas dengan tautan dokumen otentik di seluruh kanal resmi kantor.',
    opsi_c: 'Membalas satu per satu komentar warga dengan jawaban singkat "itu hoaks" tanpa penjelasan.',
    opsi_d: 'Menutup kolom komentar akun media sosial kantor sementara waktu.',
    opsi_e: 'Meneruskan tangkapan layar buram tersebut ke atasan tanpa mengecek kebenarannya.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 2, B: 5, C: 3, D: 1, E: 4 },
    pembahasan:
      'Tata kelola informasi digital pemerintah harus cepat, terverifikasi, dan merujuk sumber resmi.\n- Skor 5: Cek fakta internal + publikasi klarifikasi otoritatif yang mudah dibagikan ulang.\n- Skor 4: Berusaha mengonfirmasi namun belum langsung meredam kepanikan publik.\n- Skor 3: Kurang informatif.\n- Skor 2: Terlambat merespons.\n- Skor 1: Membungkam ruang interaksi publik.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Teknologi Informasi & Komunikasi',
    pertanyaan:
      'Untuk mendukung pemanfaatan teknologi kecerdasan buatan/otomatisasi secara bertanggung jawab dalam penyusunan draf ringkasan riset kebijakan di unit Anda, prinsip utama yang harus Anda terapkan adalah...',
    opsi_a: 'Menggunakan hasil keluaran otomatis sepenuhnya tanpa membaca ulang maupun mengecek sumber hukumnya.',
    opsi_b: 'Menghindari seluruh alat bantu digital modern meskipun mempercepat analisis awal.',
    opsi_c: 'Menggunakannya sebatas alat bantu efisiensi tanpa mengunggah data rahasia negara, serta selalu memverifikasi akurasi fakta, angka, dan dasar regulasi secara manual.',
    opsi_d: 'Mengunggah naskah kontrak rahasia pemerintah ke layanan publik daring untuk diringkas.',
    opsi_e: 'Mengklaim hasil ringkasan otomatis sebagai analisis lapangan primer tanpa pengujian.',
    jawaban_benar: 'C',
    bobot_tkp: { A: 3, B: 4, C: 5, D: 1, E: 2 },
    pembahasan:
      'Pemanfaatan teknologi cerdas dalam birokrasi wajib menjaga kerahasiaan data dan akuntabilitas verifikasi manusia.\n- Skor 5: Adaptif memanfaatkan efisiensi sambil menjaga privasi data dan validasi fakta hukum.\n- Skor 3: Konservatif menolak efisiensi.\n- Skor 2: Lalai terhadap risiko halusinasi/kesalahan data.\n- Skor 1: Membocorkan rahasia negara atau memalsukan pertanggungjawaban ilmiah.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Teknologi Informasi & Komunikasi',
    pertanyaan:
      'Kantor Anda berencana melakukan pencadangan (backup) arsip digital penting. Mengingat risiko kerusakan perangkat keras maupun serangan ransomware, strategi pencadangan yang paling tepat Anda rekomendasikan adalah...',
    opsi_a: 'Menyimpan salinan kedua di folder berbeda pada komputer yang sama.',
    opsi_b: 'Menerapkan prinsip pencadangan berlapis (lokal terpisah/luring serta penyimpanan awan instansi terenkripsi) dan menguji pemulihan data secara berkala.',
    opsi_c: 'Mencetak seluruh file kembali ke kertas lalu menghapus file digitalnya.',
    opsi_d: 'Menyimpan seluruh arsip instansi di flashdisk pribadi masing-masing pegawai.',
    opsi_e: 'Tidak perlu mencadangkan karena komputer kantor baru dibeli bulan lalu.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 3, B: 5, C: 4, D: 2, E: 1 },
    pembahasan:
      'Prinsip backup 3-2-1 melindungi keberlangsungan data negara dari bencana fisik maupun siber.\n- Skor 5: Pencadangan terpisah/terenkripsi disertai uji pemulihan berkala.\n- Skor 3: Tidak efisien ruang dan pencarian.\n- Skor 2: Rentan hilang atau tersebar tanpa kontrol.\n- Skor 1: Mengabaikan mitigasi risiko.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Teknologi Informasi & Komunikasi',
    pertanyaan:
      'Seorang pimpinan meminta laporan perkembangan program dalam format dasbor visual mingguan yang mudah dibaca, sementara data masih tersebar di lima file terpisah. Langkah TIK terbaik yang Anda lakukan adalah...',
    opsi_a: 'Mengirimkan kelima file mentah tersebut ke pimpinan agar pimpinan membacanya sendiri.',
    opsi_b: 'Menghubungkan atau mengonsolidasikan kelima sumber data tersebut secara terstruktur menjadi ringkasan visual interaktif/grafik yang akurat dan diperbarui rutin.',
    opsi_c: 'Membuat grafik perkiraan secara manual di aplikasi presentasi tanpa mengecek angka terbaru.',
    opsi_d: 'Menolak permintaan dasbor karena sistem lama hanya menghasilkan tabel teks.',
    opsi_e: 'Menyalin angka ke satu lembar kerja baru setiap minggu dengan menyembunyikan data yang belum lengkap.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 3, B: 5, C: 1, D: 2, E: 4 },
    pembahasan:
      'Kemampuan olah dan visualisasi data mendukung pengambilan keputusan pimpinan berbasis bukti.\n- Skor 5: Konsolidasi data terstruktur menjadi dasbor akurat dan terbarukan.\n- Skor 3: Kurang transparan jika menyembunyikan data belum lengkap.\n- Skor 2: Pasif atau membebani pimpinan.\n- Skor 1: Data tidak valid.',
  },

  // === 5. PROFESIONALISME (52-63) ===
  {
    kategori: 'TKP',
    subtopik: 'Profesionalisme',
    pertanyaan:
      'Pada Jumat sore pukul 16.30 WIB, Anda sudah berencana pulang tepat waktu untuk menghadiri acara keluarga penting. Tiba-tiba atasan meminta revisi laporan kinerja yang harus dikirim ke kementerian malam itu juga karena ada kesalahan angka dari sumber data baru. Sikap profesional Anda adalah...',
    opsi_a: 'Menolak permintaan atasan secara tegas karena sudah mendekati jam pulang.',
    opsi_b: 'Segera mengerjakan revisi dengan fokus dan teliti hingga tuntas sesuai tenggat, sembari berkomunikasi baik dengan keluarga mengenai keterlambatan kehadiran.',
    opsi_c: 'Menerima tugas dengan wajah kesal lalu mengerjakannya asal-asalan agar cepat pulang.',
    opsi_d: 'Mengirim laporan lama yang salah sambil berjanji akan memperbaikinya hari Senin.',
    opsi_e: 'Melemparkan tugas revisi tersebut kepada pegawai kontrak yang kebetulan masih di kantor.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 4, B: 5, C: 3, D: 1, E: 2 },
    pembahasan:
      'Profesionalisme menuntut tanggung jawab atas akurasi output organisasi di situasi mendesak.\n- Skor 5: Mengutamakan penyelesaian tugas mendesak secara berkualitas dan menjaga komunikasi keluarga dengan bijak.\n- Skor 2: Mengorbankan kualitas atau menolak tugas sah.\n- Skor 1: Mengirim data salah atau melepas tanggung jawab.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Profesionalisme',
    pertanyaan:
      'Anda menyadari telah melakukan kesalahan perhitungan pada dokumen perencanaan anggaran yang telanjur Anda serahkan kepada pimpinan satu jam lalu, sebelum rapat pembahasan dimulai. Tindakan paling profesional adalah...',
    opsi_a: 'Diam saja dan berharap peserta rapat tidak memperhatikan rincian angka tersebut.',
    opsi_b: 'Segera melapor kepada pimpinan secara jujur sebelum rapat dimulai, menyampaikan bagian yang keliru, dan menyerahkan versi perbaikan yang sudah dihitung ulang.',
    opsi_c: 'Menunggu hingga ada peserta rapat yang menemukan kesalahan lalu menyalahkan komputer yang lambat.',
    opsi_d: 'Menghapus dokumen tersebut dari ruang penyimpanan bersama tanpa memberi tahu siapa pun.',
    opsi_e: 'Meminta rekan kerja lain yang menyampaikan koreksi tersebut di depan pimpinan.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 2, B: 5, C: 1, D: 3, E: 4 },
    pembahasan:
      'Profesionalisme memadukan akuntabilitas pribadi dan kecepatan koreksi.\n- Skor 5: Berani mengakui kekeliruan secara dini dan datang membawa solusi perbaikan siap pakai.\n- Skor 3: Memperbaiki tapi menghindar dari tanggung jawab komunikasi.\n- Skor 2: Mengacaukan keterlacakan dokumen.\n- Skor 1: Menutupi kesalahan fatal.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Profesionalisme',
    pertanyaan:
      'Dalam minggu yang sama, Anda menerima tiga tugas dengan tenggat berdekatan: satu tugas prioritas tinggi dari kepala dinas, satu laporan rutin mingguan, dan satu permintaan wawancara survei internal. Cara pengelolaan beban kerja paling profesional adalah...',
    opsi_a: 'Mengerjakan tugas yang paling mudah dan cepat selesai terlebih dahulu tanpa melihat urgensinya.',
    opsi_b: 'Memetakan matriks urgensi dan dampak setiap tugas, mendahulukan tugas prioritas tinggi sambil menjaga komunikasi tenggat pada pemberi tugas lain agar seluruhnya selesai tepat waktu.',
    opsi_c: 'Mengeluh kepada atasan bahwa beban kerja Anda terlalu berat dan meminta dua tugas dibatalkan.',
    opsi_d: 'Mengerjakan ketiganya sekaligus secara acak sehingga fokus terpecah.',
    opsi_e: 'Menunda semuanya hingga satu hari sebelum tenggat paling akhir.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 4, B: 5, C: 3, D: 2, E: 1 },
    pembahasan:
      'Manajemen prioritas dan ekspektasi pemangku kepentingan menentukan konsistensi kinerja.\n- Skor 5: Klasifikasi urgensi-dampak + komunikasi proaktif menjaga semua komitmen.\n- Skor 3: Kurang mempertimbangkan dampak strategis.\n- Skor 2: Tidak terstruktur atau mudah menyerah.\n- Skor 1: Prokrastinasi berisiko gagal total.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Profesionalisme',
    pertanyaan:
      'Ketika atasan memberikan penilaian evaluasi kinerja berkala yang lebih rendah dari ekspektasi Anda disertai beberapa catatan perbaikan ketelitian, respons profesional terbaik adalah...',
    opsi_a: 'Menerima umpan balik dengan kepala dingin, meminta contoh konkret area yang perlu ditingkatkan, dan menyusun rencana perbaikan terukur untuk periode berikutnya.',
    opsi_b: 'Mendebat atasan dan menuduhnya bersikap subjektif karena tidak menyukai Anda.',
    opsi_c: 'Menjadi patah semangat dan mengurangi kualitas kerja pada bulan berikutnya.',
    opsi_d: 'Mengabaikan catatan evaluasi tersebut karena merasa hasil kerja Anda sudah paling benar.',
    opsi_e: 'Membanding-bandingkan kesalahan rekan lain di hadapan atasan agar penilaian Anda dinaikkan.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 3, C: 2, D: 4, E: 1 },
    pembahasan:
      'Growth mindset dan keterbukaan terhadap evaluasi merupakan fondasi pengembangan karier ASN.\n- Skor 5: Reflektif, meminta klarifikasi konstruktif, dan berkomitmen pada rencana aksi.\n- Skor 2: Defensif atau menutup diri dari pembelajaran.\n- Skor 1: Demotivasi destruktif atau menyalahkan rekan.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Profesionalisme',
    pertanyaan:
      'Di tempat kerja, Anda mengetahui seorang rekan dekat sering datang terlambat dan menitipkan pengisian presensi/alasan palsu kepada petugas piket. Sikap profesional Anda adalah...',
    opsi_a: 'Ikut menutupi kebiasaannya demi menjaga kesetiakawanan pertemanan.',
    opsi_b: 'Menasihatinya secara pribadi dan empatik agar memperbaiki kedisiplinan sebelum berdampak pada sanksi atau kinerja tim, tanpa ikut membenarkan kecurangan.',
    opsi_c: 'Ikut datang terlambat juga karena merasa peraturan kantor tidak ditegakkan.',
    opsi_d: 'Membuat akun anonim untuk menyindirnya di media sosial kantor.',
    opsi_e: 'Membiarkannya tanpa peduli selama ia membelikan kopi untuk Anda.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 3, B: 5, C: 1, D: 2, E: 4 },
    pembahasan:
      'Profesionalisme menjaga disiplin kerja dengan tetap menjaga etika komunikasi antarkolega.\n- Skor 5: Mengingatkan secara bermartabat dan menolak kompromi integritas.\n- Skor 2: Solidaritas keliru atau cara penyampaian tidak etis.\n- Skor 1: Ikut melanggar aturan atau menerima suap kecil.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Profesionalisme',
    pertanyaan:
      'Atasan menugaskan Anda mengelola sebuah proyek dengan bidang regulasi yang masih tergolong baru dan belum pernah Anda tangani sebelumnya. Sikap profesional dalam menghadapi tantangan kompetensi tersebut adalah...',
    opsi_a: 'Segera mempelajari regulasi terkait secara mandiri, berkonsultasi dengan pakar atau senior berpengalaman, dan menyusun kerangka kerja terstruktur sebelum eksekusi.',
    opsi_b: 'Menolak penugasan karena tidak tercantum dalam deskripsi pekerjaan awal Anda.',
    opsi_c: 'Mengerjakan proyek berdasarkan perkiraan pribadi tanpa membaca aturan hukumnya.',
    opsi_d: 'Menunggu kantor mengirimkan Anda mengikuti diklat terlebih dahulu tahun depan.',
    opsi_e: 'Menyerahkan seluruh penyusunan substansi kepada staf magang.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 3, C: 2, D: 4, E: 1 },
    pembahasan:
      'Kemauan belajar cepat dan ketelitian regulasi adalah inti profesionalisme birokrasi.\n- Skor 5: Inisiatif belajar mandiri + konsultasi ahli + perencanaan sistematis.\n- Skor 3: Pasif menunggu pelatihan formal.\n- Skor 2: Menolak berkembang.\n- Skor 1: Ceroboh atau melalaikan tanggung jawab.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Profesionalisme',
    pertanyaan:
      'Selama bekerja di kantor, Anda mendapat tawaran proyek sampingan berbayar dari pihak luar yang meminta konsultasi menggunakan data riset internal instansi serta dikerjakan pada jam dinas. Keputusan profesional Anda adalah...',
    opsi_a: 'Menolak tegas penggunaan jam dinas dan aset/data internal instansi untuk proyek sampingan komersial yang berpotensi menimbulkan benturan kepentingan.',
    opsi_b: 'Menerima tawaran tersebut selama pekerjaan kantor terlihat tetap berjalan.',
    opsi_c: 'Mengambil data internal tanpa izin asalkan tidak mencantumkan nama instansi.',
    opsi_d: 'Mengerjakannya di meja kantor saat atasan sedang dinas luar kota.',
    opsi_e: 'Menawar bayaran lebih tinggi untuk menutupi risiko pelanggaran disiplin.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 4, C: 2, D: 3, E: 1 },
    pembahasan:
      'Disiplin waktu kerja, perlindungan aset informasi, dan bebas benturan kepentingan adalah kewajiban mutlak ASN.\n- Skor 5: Menjaga batasan tegas antara tugas publik dan kepentingan komersial pribadi.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Profesionalisme',
    pertanyaan:
      'Setelah menyelesaikan suatu acara seminar publik yang sangat sukses, sebagian rekan langsung santai dan melupakan laporan pertanggungjawaban kegiatan. Sebagai ketua panitia, tindakan profesional Anda adalah...',
    opsi_a: 'Menikmati pujian pimpinan dulu dan baru memikirkan laporan bulan depan.',
    opsi_b: 'Mengapresiasi kerja keras tim, lalu mengawal penyelesaian laporan pertanggungjawaban keuangan, dokumentasi, dan evaluasi pasca-acara tepat waktu.',
    opsi_c: 'Membuat laporan sendirian tanpa melibatkan bendahara dan sekretaris panitia.',
    opsi_d: 'Menggunakan sisa kuitansi seadanya agar laporan cepat ditutup.',
    opsi_e: 'Menyerahkan tugas laporan sepenuhnya kepada pegawai termuda.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 2, B: 5, C: 4, D: 1, E: 3 },
    pembahasan:
      'Siklus kerja profesional tuntas hingga tahap evaluasi dan pertanggungjawaban akuntabel.\n- Skor 5: Menyeimbangkan apresiasi tim dengan ketuntasan administrasi dan evaluasi.\n- Skor 3: Bertanggung jawab namun kurang koordinasi peran.\n- Skor 2: Mengabaikan penutupan siklus kerja.\n- Skor 1: Tidak akuntabel.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Profesionalisme',
    pertanyaan:
      'Sebuah kebijakan prosedur operasional standar (SOP) baru diterapkan dan membuat alur persetujuan terasa lebih lambat pada dua minggu pertama, memicu keluhan beberapa pegawai. Sikap profesional Anda adalah...',
    opsi_a: 'Tetap mematuhi SOP baru tersebut sambil mencatat secara objektif titik hambatan di lapangan untuk dijadikan bahan masukan evaluasi resmi perbaikan alur.',
    opsi_b: 'Kembali memakai cara lama secara diam-diam supaya pekerjaan lebih cepat.',
    opsi_c: 'Mengajak rekan-rekan melakukan protes terbuka menolak SOP baru.',
    opsi_d: 'Mengeluh di hadapan pemohon layanan bahwa aturan baru kantor sangat menyusahkan.',
    opsi_e: 'Bekerja selambat mungkin agar pimpinan sadar SOP baru tidak efektif.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 4, C: 3, D: 1, E: 2 },
    pembahasan:
      'Kepatuhan regulasi diiringi evaluasi berbasis bukti menunjukkan kedewasaan birokrasi.\n- Skor 5: Disiplin menjalankan ketentuan berlaku sekaligus memberi umpan balik konstruktif melalui jalur resmi.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Profesionalisme',
    pertanyaan:
      'Anda memiliki waktu luang sekitar dua jam setelah seluruh tugas harian Anda selesai dan sudah diperiksa rapi. Tindakan paling produktif dan profesional di lingkungan kerja adalah...',
    opsi_a: 'Menonton film atau bermain gim daring secara terbuka di komputer kantor.',
    opsi_b: 'Memanfaatkan waktu untuk merapikan basis data arsip kerja, mempelajari pembaruan regulasi terkait tugas, atau menawarkan bantuan kepada rekan tim yang masih memiliki beban tinggi.',
    opsi_c: 'Pura-pura sibuk membuka dokumen kosong sampai bel pulang berbunyi.',
    opsi_d: 'Pulang lebih awal dua jam sebelum waktu kerja resmi berakhir tanpa izin.',
    opsi_e: 'Mengajak rekan yang sedang sibuk mengobrol santai di meja kerjanya.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 2, B: 5, C: 4, D: 1, E: 3 },
    pembahasan:
      'Inisiatif pengembangan diri dan dukungan tim mencerminkan etos kerja unggul.\n- Skor 5: Produktif memperbaiki kualitas sistem kerja dan membantu tim.\n- Skor 3: Tidak melanggar namun tidak memberi nilai tambah.\n- Skor 2: Mengganggu produktivitas rekan.\n- Skor 1: Melanggar disiplin jam kerja.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Profesionalisme',
    pertanyaan:
      'Saat melakukan inspeksi lapangan mendadak, Anda ditawari fasilitas penginapan hotel mewah dan jamuan makan malam oleh pihak yang sedang diperiksa agar proses pemeriksaan berjalan "lancar". Sikap profesional Anda adalah...',
    opsi_a: 'Menolak seluruh fasilitas tersebut dengan sopan, tetap menggunakan akomodasi sesuai biaya perjalanan dinas resmi negara, dan menjaga objektivitas hasil pemeriksaan.',
    opsi_b: 'Menerima penginapan saja asalkan laporan pemeriksaan tetap dibuat apa adanya.',
    opsi_c: 'Menerima jamuan makan malam untuk menghormati adat keramahan setempat.',
    opsi_d: 'Meminta fasilitas tersebut diganti menjadi uang saku tunai.',
    opsi_e: 'Menyetujuinya karena hotel resmi dinas lokasinya agak jauh dari lokasi proyek.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 2, C: 4, D: 1, E: 3 },
    pembahasan:
      'Independensi pengawas/inspektor tidak boleh dikompromikan oleh fasilitas dari pihak terperiksa.\n- Skor 5: Menjaga jarak profesional total dan mengandalkan anggaran perjalanan dinas resmi.\n- Skor 3: Rawan konflik kepentingan meski beralasan etika sosial.\n- Skor 2: Berkompromi dengan independensi.\n- Skor 1: Pemerasan/suap nyata.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Profesionalisme',
    pertanyaan:
      'Dalam menyusun naskah kebijakan atau surat keputusan penting, Anda menemukan dua pasal rujukan peraturan menteri yang tampak berpotensi multitafsir. Langkah profesional Anda adalah...',
    opsi_a: 'Memilih tafsiran yang paling menguntungkan kenyamanan unit Anda saja.',
    opsi_b: 'Melakukan kajian mendalam dan berkonsultasi dengan bagian hukum/biro hukum instansi guna memastikan landasan yuridis yang tepat sebelum naskah ditandatangani pimpinan.',
    opsi_c: 'Membiarkannya saja agar ditanggung oleh pejabat yang menandatangani nanti.',
    opsi_d: 'Menghapus kedua pasal rujukan tersebut agar naskah terlihat sederhana.',
    opsi_e: 'Menunda pengetikan surat tanpa memberi tahu atasan adanya kendala regulasi.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 3, B: 5, C: 2, D: 1, E: 4 },
    pembahasan:
      'Ketelitian hukum (legal prudence) mencegah cacat administrasi di kemudian hari.\n- Skor 5: Verifikasi bersama otoritas hukum internal sebelum pengambilan keputusan pimpinan.\n- Skor 3: Tidak komunikatif.\n- Skor 2: Bias kepentingan.\n- Skor 1: Mengabaikan kepastian hukum.',
  },

  // === 6. ANTI RADIKALISME (64-75) ===
  {
    kategori: 'TKP',
    subtopik: 'Anti Radikalisme',
    pertanyaan:
      'Di grup percakapan informal rekan sekantor, seseorang membagikan artikel provokatif yang menyebut dasar negara Pancasila sudah tidak relevan dan mengajak pegawai menolak menghormati bendera saat upacara. Respons profesional dan berintegritas sebagai ASN adalah...',
    opsi_a: 'Ikut menyetujui agar tidak dianggap kurang religius atau kurang kritis.',
    opsi_b: 'Diam dan keluar dari grup tanpa melakukan klarifikasi apa pun.',
    opsi_c: 'Menyampaikan secara tenang dan berimbang bahwa ASN terikat sumpah setia kepada Pancasila dan UUD 1945, mengingatkan aturan netralitas ideologi negara, serta melaporkan indikasi penyebaran paham anti-Pancasila ke unit pembinaan kepegawaian jika berlanjut.',
    opsi_d: 'Memaki pengirim pesan dengan kata-kata kasar di dalam grup hingga memicu pertengkaran hebat.',
    opsi_e: 'Meneruskan artikel tersebut ke grup keluarga untuk menanyakan pendapat mereka.',
    jawaban_benar: 'C',
    bobot_tkp: { A: 1, B: 3, C: 5, D: 4, E: 2 },
    pembahasan:
      'ASN adalah perekat dan pemersatu bangsa yang setia pada Pancasila, UUD 1945, NKRI, dan Bhinneka Tunggal Ika.\n- Skor 5: Tegas berprinsip, tenang, mengingatkan sumpah ASN, dan menempuh mekanisme pembinaan resmi.\n- Skor 4: Menolak paham radikal tetapi cara agresif kurang efektif meredam.\n- Skor 3: Menghindar tidak menyelesaikan penyebaran paham.\n- Skor 2: Ikut menyebarkan konten provokatif.\n- Skor 1: Mendukung paham anti-ideologi negara.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Anti Radikalisme',
    pertanyaan:
      'Anda mendengar seorang rekan kerja baru mulai menanamkan narasi eksklusif kepada staf junior bahwa warga dari kelompok keyakinan tertentu tidak layak dilayani secara maksimal karena dianggap "berbeda prinsip". Langkah pencegahan dini yang paling tepat adalah...',
    opsi_a: 'Mengajak rekan tersebut berdialog secara objektif untuk meluruskan kode etik pelayanan publik yang adil bagi semua warga, serta melaporkan potensi perilaku diskriminatif ini kepada atasan/tim pencegahan intoleransi.',
    opsi_b: 'Membiarkannya karena menganggap itu kebebasan berpendapat pribadi di luar urusan teknis.',
    opsi_c: 'Menyetujui pembagian meja pelayanan berdasarkan kesamaan agama petugas dan pemohon.',
    opsi_d: 'Mengucilkan rekan tersebut dari seluruh pergaulan kantor tanpa menjelaskan kesalahannya.',
    opsi_e: 'Membuat gosip di antarunit bahwa pegawai baru itu anggota organisasi terlarang tanpa bukti.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 3, C: 1, D: 4, E: 2 },
    pembahasan:
      'Deteksi dini intoleransi di birokrasi harus direspons lewat pelurusan etika layanan dan pembinaan struktural.\n- Skor 5: Menjaga non-diskriminasi layanan publik melalui dialog dan mekanisme pembinaan resmi.\n- Skor 3: Mengucilkan tanpa koreksi justru mendorong ekstremisme.\n- Skor 2: Pembiaran atau fitnah tanpa bukti.\n- Skor 1: Melegalkan diskriminasi layanan.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Anti Radikalisme',
    pertanyaan:
      'Seorang tetangga di kompleks perumahan dinas meminta Anda menyumbang dana rutin untuk kegiatan kelompok tertutup yang memiliki agenda mengganti sistem pemerintahan sah dengan kekerasan jika diperlukan. Sikap tegas Anda adalah...',
    opsi_a: 'Memberikan sedikit uang agar hubungan bertetangga tidak canggung.',
    opsi_b: 'Menolak tegas ajakan tersebut karena bertentangan dengan hukum dan nilai kemanusiaan, serta melaporkan indikasi aktivitas mencurigakan kepada aparat berwenang atau ketua lingkungan.',
    opsi_c: 'Menolak secara diam-diam lalu pindah rumah tanpa memberi tahu siapa pun.',
    opsi_d: 'Ikut menghadiri pertemuannya sekali untuk melihat kegiatannya terlebih dahulu.',
    opsi_e: 'Menyarankan tetangga tersebut meminta sumbangan ke rekan kantor Anda saja.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 2, B: 5, C: 4, D: 3, E: 1 },
    pembahasan:
      'Pencegahan radikalisme dan terorisme membutuhkan penolakan tegas dan pelaporan dini.\n- Skor 5: Tidak mendanai ekstremisme dan bertanggung jawab menjaga keamanan masyarakat.\n- Skor 4: Menjaga diri namun kurang berkontribusi mencegah bahaya bagi lingkungan.\n- Skor 2: Mengambil risiko keterlibatan.\n- Skor 1: Memfasilitasi pendanaan kelompok kekerasan.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Anti Radikalisme',
    pertanyaan:
      'Dalam kegiatan pengajian atau diskusi kerohanian rutin di musala kantor, seorang penceramah tamu menyampaikan materi yang merendahkan pemeluk agama lain dan menganggap tindakan kekerasan terhadap kelompok berbeda dapat dibenarkan. Sebagai panitia/pengurus kegiatan kantor, tindakan paling tepat adalah...',
    opsi_a: 'Membiarkan ceramah berlangsung terus karena menghormati tamu undangan.',
    opsi_b: 'Mengambil langkah bijak setelah atau saat forum dengan meluruskan pesan kedamaian serta moderasi beragama, tidak mengundang lagi penceramah bermuatan kebencian, dan menerapkan kurasi narasumber yang menjunjung kebinekaan.',
    opsi_c: 'Mengubah tema kegiatan kantor menjadi khusus membela kelompok tertentu saja.',
    opsi_d: 'Membubarkan seluruh kegiatan keagamaan di kantor secara permanen.',
    opsi_e: 'Merekam dan menyebarkan ceramah kebencian itu secara luas tanpa klarifikasi.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 3, B: 5, C: 1, D: 4, E: 2 },
    pembahasan:
      'Instansi pemerintah wajib menjaga ruang ibadah perkantoran tetap sejuk dan moderat.\n- Skor 5: Koreksi pesan moderasi, hentikan akses penceramah intoleran, dan perbaiki kurasi.\n- Skor 3: Reaksi berlebihan menghapus hak ibadah karyawan.\n- Skor 2: Membiarkan benih kebencian tumbuh di fasilitas negara.\n- Skor 1: Memperluas ujaran kebencian.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Anti Radikalisme',
    pertanyaan:
      'Muncul ajakan di media sosial untuk memboikot seluruh program vaksinasi atau layanan kesehatan pemerintah dengan alasan teori konspirasi dan klaim bahwa pemerintah berniat mencelakai rakyat. Peran ASN dalam meredam narasi destruktif tersebut adalah...',
    opsi_a: 'Mengedukasi lingkungan sekitar dengan data ilmiah terverifikasi dari lembaga resmi kesehatan menggunakan bahasa yang tenang, sabar, dan tidak menghakimi.',
    opsi_b: 'Mendebat pengguna media sosial dengan hinaan bahwa mereka tidak berpendidikan.',
    opsi_c: 'Ikut meragukan program pemerintah di status media sosial pribadi.',
    opsi_d: 'Membiarkan narasi tersebut berkembang karena bukan tugas bidang kepegawaian.',
    opsi_e: 'Memblokir seluruh tetangga yang mempertanyakan kebijakan kesehatan.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 4, C: 1, D: 2, E: 3 },
    pembahasan:
      'Melawan disinformasi anti-pemerintah dilakukan dengan literasi empatik berbasis sains.\n- Skor 5: Edukasi berbasis bukti dengan komunikasi persuasif.\n- Skor 3: Menghina atau memutus komunikasi tidak mengubah persepsi.\n- Skor 2: Apatis terhadap disinformasi publik.\n- Skor 1: Memperkuat narasi destruktif.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Anti Radikalisme',
    pertanyaan:
      'Saat memeriksa berkas calon penerima dana hibah organisasi kemasyarakatan, Anda menemukan bukti rekam jejak bahwa salah satu pengurus inti organisasi tersebut aktif menyebarkan ujaran kebencian dan menolak mengakui keabsahan konstitusi NKRI. Keputusan verifikasi Anda adalah...',
    opsi_a: 'Tetap meloloskan pengajuan dana hibah selama proposal kegiatannya terlihat bagus.',
    opsi_b: 'Melakukan verifikasi objektif sesuai ketentuan hukum syarat penerima hibah, mencatat temuan rekam jejak secara faktual, dan merekomendasikan penolakan atau penundaan sesuai regulasi.',
    opsi_c: 'Meminta pengurus tersebut menghapus unggahan media sosialnya saja agar tetap dapat dana.',
    opsi_d: 'Meloloskan pencairan dana demi menghindari tekanan massa organisasi tersebut.',
    opsi_e: 'Menghilangkan bukti temuan dari berkas agar tidak memperpanjang proses audit.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 3, B: 5, C: 4, D: 2, E: 1 },
    pembahasan:
      'Anggaran negara tidak boleh mendanai organisasi yang bertentangan dengan Pancasila dan UUD 1945.\n- Skor 5: Penegakan hukum berbasis bukti dokumen dan rekomendasi objektif.\n- Skor 2: Manipulasi kepatuhan.\n- Skor 1: Lalai atau tunduk pada intimidasi.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Anti Radikalisme',
    pertanyaan:
      'Anak remaja di lingkungan sekitar Anda terlihat mulai mengonsumsi konten daring yang mengagungkan aksi kekerasan ekstrem atas nama kelompok tertentu. Langkah pencegahan sosial yang dapat Anda lakukan adalah...',
    opsi_a: 'Mendekati orang tua atau tokoh pendidik setempat secara bijak untuk mendorong pendampingan literasi digital dan aktivitas positif remaja, serta berkonsultasi dengan pihak terkait bila mengarah ke bahaya nyata.',
    opsi_b: 'Menangkap remaja tersebut sendirian dan menginterogasinya.',
    opsi_c: 'Menyebarkan identitas anak tersebut di grup warga sebagai pelaku radikalisme.',
    opsi_d: 'Menganggap itu urusan keluarga mereka dan menutup mata sepenuhnya.',
    opsi_e: 'Memuji keberanian anak tersebut karena tertarik pada isu politik global.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 3, C: 2, D: 4, E: 1 },
    pembahasan:
      'Deradikalisasi dini pada usia muda mengedepankan pendekatan keluarga, pendidikan, dan pendampingan terukur.\n- Skor 5: Kolaborasi dengan orang tua/pendidik secara bijak untuk intervensi positif.\n- Skor 3: Apatis terhadap risiko sosial.\n- Skor 2: Main hakim sendiri.\n- Skor 1: Persekusi anak atau membenarkan ekstremisme.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Anti Radikalisme',
    pertanyaan:
      'Dalam sebuah pelatihan bela negara, seorang peserta berpendapat bahwa toleransi berarti seseorang tidak boleh memiliki keyakinan agama yang kuat. Pandangan meluruskan yang paling tepat Anda sampaikan dalam diskusi adalah...',
    opsi_a: 'Toleransi sejati justru lahir dari keyakinan yang matang, di mana setiap warga teguh menjalankan keyakinannya sekaligus menghormati hak orang lain hidup aman dan beribadah sesuai keyakinannya.',
    opsi_b: 'Setuju bahwa untuk menjaga persatuan sebaiknya semua agama disatukan menjadi satu ajaran baru.',
    opsi_c: 'Menyatakan bahwa kelompok mayoritas tidak perlu bertoleransi kepada kelompok minoritas.',
    opsi_d: 'Menutup diskusi dan meminta peserta tersebut keluar dari ruangan pelatihan.',
    opsi_e: 'Mengatakan bahwa agama tidak ada hubungannya sama sekali dengan kehidupan berbangsa.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 1, C: 2, D: 3, E: 4 },
    pembahasan:
      'Pemahaman moderasi beragama yang tepat memadukan komitmen keimanan pribadi dengan penghormatan hak sipil sesama warga.\n- Skor 5: Argumentasi konseptual yang jernih, inklusif, dan menenangkan.\n- Skor 3: Mengabaikan nilai Ketuhanan Yang Maha Esa.\n- Skor 2: Otoriter menutup dialog.\n- Skor 1: Sinkretisme paksa atau intoleransi.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Anti Radikalisme',
    pertanyaan:
      'Kantor Anda menyelenggarakan upacara peringatan Hari Lahir Pancasila. Namun seorang pegawai mengajak Anda membolos upacara dengan alasan seremoni tersebut tidak bermanfaat dan hanya buang waktu. Sikap Anda adalah...',
    opsi_a: 'Ikut membolos agar bisa sarapan lebih lama di kantin luar kantor.',
    opsi_b: 'Tetap mengikuti upacara dengan khidmat sebagai wujud penghormatan pada dasar negara dan disiplin ASN, serta mengajak rekan tersebut memaknai nilai persatuan di balik kegiatan itu.',
    opsi_c: 'Hadir di barisan belakang sambil terus bermain ponsel sepanjang upacara.',
    opsi_d: 'Melaporkannya langsung agar mendapat pemotongan gaji tanpa menegurnya terlebih dahulu.',
    opsi_e: 'Menandatangani daftar hadir upacara terlebih dahulu lalu langsung pulang ke rumah.',
    jawaban_benar: 'B',
    bobot_tkp: { A: 2, B: 5, C: 3, D: 4, E: 1 },
    pembahasan:
      'Keteladanan komitmen kebangsaan diwujudkan melalui partisipasi tulus dan ajakan positif.\n- Skor 5: Konsisten disiplin, menghayati nilai kebangsaan, dan mengajak rekan secara persuasif.\n- Skor 4: Menjaga disiplin organisasi meski melewatkan pendekatan personal.\n- Skor 2: Kehadiran formalitas tanpa penghormatan.\n- Skor 1: Indisipliner atau memanipulasi kehadiran.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Anti Radikalisme',
    pertanyaan:
      'Sebuah situs berita tidak jelas menyebarkan klaim bahwa salah satu suku atau kelompok agama tertentu menguasai seluruh formasi CPNS melalui kecurangan sistemik, memicu kemarahan di kolom komentar. Tindakan bijak Anda adalah...',
    opsi_a: 'Tidak terpancing ikut menyebarkan provokasi SARA, menjelaskan secara faktual bahwa seleksi CPNS menggunakan sistem CAT transparan berbasis skor merit, dan melaporkan konten ujaran kebencian tersebut.',
    opsi_b: 'Ikut menyebarkan berita tersebut untuk memancing perdebatan di grup alumni kampus.',
    opsi_c: 'Menulis komentar balasan yang balik menyerang kelompok suku lain.',
    opsi_d: 'Meyakini kabar tersebut tanpa memeriksa data resmi BKN.',
    opsi_e: 'Menghindari membahas topik kebangsaan apa pun di lingkungan kerja.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 2, C: 1, D: 3, E: 4 },
    pembahasan:
      'Narasi adu domba SARA melemahkan kepercayaan pada institusi negara.\n- Skor 5: Mengklarifikasi berbasis transparansi sistem merit + melaporkan konten kebencian.\n- Skor 3: Pasif menghindar.\n- Skor 2: Mudah terprovokasi.\n- Skor 1: Memperluas konflik SARA.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Anti Radikalisme',
    pertanyaan:
      'Saat menjadi bagian tim seleksi penerimaan pegawai non-ASN di instansi, Anda mendapati salah satu pelamar memiliki latar belakang pernah terlibat dalam penyebaran ajakan kekerasan ekstremis tanpa penyesalan dan masih aktif di forum terkait. Sikap Anda adalah...',
    opsi_a: 'Menjadikan temuan rekam jejak objektif tersebut sebagai bahan pertimbangan penting sesuai kriteria integritas ideologi negara dalam rapat tim penilai.',
    opsi_b: 'Meloloskannya saja asalkan nilai tes kemampuan mengetiknya paling tinggi.',
    opsi_c: 'Langsung mengunggah nama pelamar tersebut ke akun media sosial Anda sebagai peringatan.',
    opsi_d: 'Menghiraukan temuan tersebut karena menilai kemampuan teknis lebih penting daripada kesetiaan pada konstitusi.',
    opsi_e: 'Meminta uang jaminan pribadi kepada pelamar agar ia bersikap baik saat diterima.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 3, C: 4, D: 2, E: 1 },
    pembahasan:
      'Seleksi aparatur negara menyeimbangkan kompetensi teknis dan kesetiaan ideologis pada NKRI.\n- Skor 5: Penilaian objektif dan prosedural dalam rapat seleksi resmi.\n- Skor 2: Melanggar privasi pelamar atau mengabaikan risiko keamanan institusi.\n- Skor 1: Penyalahgunaan wewenang atau mengabaikan sumpah konstitusi.',
  },
  {
    kategori: 'TKP',
    subtopik: 'Anti Radikalisme',
    pertanyaan:
      'Untuk menciptakan iklim kerja yang kebal terhadap paham radikalisme dan eksklusivisme di unit Anda, program internal paling berkelanjutan yang dapat Anda dukung adalah...',
    opsi_a: 'Membangun ruang dialog terbuka lintas unit, kegiatan sosial kemasyarakatan bersama yang inklusif, serta pembinaan nilai-nilai BerAKHLAK dan Wawasan Kebangsaan secara menarik.',
    opsi_b: 'Memasang kamera pengawas di setiap sudut ruangan dan melarang pegawai mengobrol saat istirahat.',
    opsi_c: 'Mewajibkan seluruh pegawai menghafal ratusan halaman dokumen hukum dalam satu minggu.',
    opsi_d: 'Membentuk kelompok pengawas rahasia untuk saling memata-matai kehidupan pribadi pegawai di akhir pekan.',
    opsi_e: 'Menghapus seluruh kegiatan sosial dan olahraga bersama agar pegawai fokus di meja masing-masing.',
    jawaban_benar: 'A',
    bobot_tkp: { A: 5, B: 3, C: 4, D: 1, E: 2 },
    pembahasan:
      'Ketahanan ideologi paling kuat tumbuh melalui keterbukaan dialog, kebersamaan lintas identitas, dan internalisasi nilai BerAKHLAK.\n- Skor 5: Budaya kerja sehat, dialogis, dan membumikan nilai kebangsaan.\n- Skor 3: Pendekatan hafalan kurang membangun kesadaran.\n- Skor 2: Mengurangi kohesi sosial.\n- Skor 1: Mengganggu privasi dan memicu kecurigaan internal.',
  },
];
