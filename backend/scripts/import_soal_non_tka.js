// Import satu-kali data soal Non-TKA (Revisi 8) dari 3 bank soal HOTS
// (Fisika, Biologi, Kimia/IPA) yang diberikan sebagai file .docx.
// Sumber: bank soal fisika tingkat smp (2).docx, Revisi Bank Soal HOTS
// Biologi SMP.docx, revisi bank soal buku IPA kurikulum merdeka.docx
//
// Catatan editorial (persetujuan pengguna 2026-08-11):
// - Biologi soal 1 (auksin/fototropisme): "Penjelasan" di dokumen sumber
//   salah tempel (identik dengan penjelasan soal 2 tentang Monera/Fungi,
//   sama sekali tidak relevan). Kunci jawaban B tetap dipakai (sudah benar
//   secara sains), penjelasan ditulis ulang.
// - Biologi soal 4 (jaringan xilem/pewarna pacar air): dokumen sumber sama
//   sekali tidak mencantumkan Kunci Jawaban/Penjelasan untuk soal ini.
//   Jawaban C (xilem) ditentukan berdasarkan ciri-ciri di soal (sel mati,
//   dinding tebal, pembuluh kapiler pengangkut air), penjelasan ditulis baru.
// - Kimia/IPA soal 26 (reboisasi & CO2): opsi B dan C di dokumen sumber
//   teksnya identik persis (typo copy-paste). Opsi C diganti jadi pengecoh
//   baru, kunci jawaban tetap B (fotosintesis menyerap CO2).
//
// Jalankan sekali: node scripts/import_soal_non_tka.js (dari folder backend/)

const pool = require('../config/db');

const fisikaSoal = [
  {
    question: 'Dina mengukur panjang mejanya menggunakan jengkal tangannya sendiri, sedangkan Rian mengukur meja yang sama menggunakan penggaris berskala sentimeter. Keduanya kemudian membandingkan hasil pengukuran di depan kelas. Mengapa hasil pengukuran Rian lebih tepat digunakan sebagai acuan bersama dibandingkan hasil pengukuran Dina?',
    options: [
      { key: 'A', text: 'Karena penggaris lebih mahal harganya daripada mengukur dengan jengkal' },
      { key: 'B', text: 'Karena penggaris menggunakan satuan baku yang nilainya tetap dan sama di mana pun digunakan' },
      { key: 'C', text: 'Karena Rian mengukur dengan lebih cepat dibandingkan Dina' },
      { key: 'D', text: 'Karena panjang meja pada dasarnya tidak dapat diukur menggunakan bagian tubuh' },
    ],
    correct: 'B',
    explanation: 'Definisi mengukur adalah membandingkan besaran yang diukur dengan satuan baku. Penggaris berskala menggunakan satuan baku (cm) yang nilainya tetap dan sama di mana pun digunakan, sehingga hasilnya dapat dijadikan acuan bersama, berbeda dengan jengkal yang bersifat tidak baku dan berbeda-beda antar orang.',
  },
  {
    stimulus: 'Tabel Besaran Pokok dan Satuan Internasional (SI):\n1. Panjang — Meter\n2. Massa — Kilogram\n3. Suhu — Celcius\n4. Kuat Arus — Ampere\n5. Waktu — Menit',
    question: 'Setelah menganalisis kesesuaian setiap pasangan besaran pokok dan satuannya dengan Sistem Internasional (SI), pasangan yang TIDAK sesuai ditunjukkan oleh nomor...',
    options: [
      { key: 'A', text: '1 dan 2' },
      { key: 'B', text: '3 dan 5' },
      { key: 'C', text: '2 dan 4' },
      { key: 'D', text: '1 dan 4' },
    ],
    correct: 'B',
    explanation: 'Berdasarkan Sistem Internasional (SI): satuan suhu yang baku adalah Kelvin, bukan Celcius (nomor 3); satuan waktu yang baku adalah sekon, bukan menit (nomor 5). Sehingga pasangan yang TIDAK sesuai SI adalah nomor 3 dan 5.',
  },
  {
    stimulus: 'Hasil pengukuran massa benda P menggunakan neraca (lihat gambar).',
    image: '/assets/gambar soal fisika/soal fisika no 3.jpg',
    question: 'Jika seorang siswa lain membaca skala tersebut dan memperoleh nilai yang berbeda karena posisi matanya tidak tegak lurus terhadap skala, maka kesalahan pembacaan tersebut dikenal sebagai kesalahan paralaks. Berdasarkan posisi penunjuk skala pada gambar, besar massa benda P yang benar adalah...',
    options: [
      { key: 'A', text: '115 kg' },
      { key: 'B', text: '11,5 kg' },
      { key: 'C', text: '1,15 kg' },
      { key: 'D', text: '0,115 kg' },
    ],
    correct: 'C',
    explanation: 'Massa benda P setara dengan jumlah anak timbangan yang digunakan untuk menyeimbangkannya, yaitu 0,1 kg + 1.000 gram (=1 kg) + 0,05 kg = 1,15 kg.',
  },
  {
    stimulus: 'Hasil pengukuran menggunakan jangka sorong (lihat gambar).',
    image: '/assets/gambar soal fisika/soal fisika no 4.jpg',
    question: 'Dengan menganalisis kedudukan skala utama dan skala nonius yang saling berhimpit pada gambar, hasil pengukuran panjang benda tersebut adalah...cm',
    options: [
      { key: 'A', text: '3,55' },
      { key: 'B', text: '2,55' },
      { key: 'C', text: '3,23' },
      { key: 'D', text: '2,23' },
    ],
    correct: 'D',
    explanation: 'Pembacaan jangka sorong = skala utama + skala nonius. Skala utama menunjukkan 2,2 cm (di antara angka 2 dan 3), dan garis skala nonius yang berimpit dengan skala utama menunjukkan 0,03 cm. Sehingga hasil pengukuran = 2,2 cm + 0,03 cm = 2,23 cm.',
  },
  {
    question: 'Seorang siswa mengelompokkan besaran fisika ke dalam dua kategori: besaran yang cukup dinyatakan dengan nilai saja, dan besaran yang harus dinyatakan dengan nilai serta arah. Kelompok besaran fisika yang tepat terdiri atas besaran skalar dan besaran vektor secara berurutan adalah...',
    options: [
      { key: 'A', text: 'Kecepatan, Momentum, Posisi' },
      { key: 'B', text: 'Gaya, Posisi, Massa' },
      { key: 'C', text: 'Energi, Usaha, Kalor Jenis (skalar) berpasangan dengan Gaya, Perpindahan, Kecepatan (vektor)' },
      { key: 'D', text: 'Temperatur, Tekanan, Daya' },
    ],
    correct: 'C',
    explanation: 'Besaran skalar hanya memiliki nilai (Energi, Usaha, Kalor Jenis), sedangkan besaran vektor memiliki nilai dan arah (Gaya, Perpindahan, Kecepatan). Opsi C secara tepat memasangkan kedua kelompok tersebut.',
  },
  {
    stimulus: 'Benda A mempunyai massa 1.500 gram berada pada posisi seperti gambar (g = 10 m/s²), dengan energi potensial maksimum sebesar 300 joule.',
    image: '/assets/gambar soal fisika/soal fisika no 6.jpg',
    question: 'Jika massa benda A diganti menjadi 3.000 gram sementara ketinggiannya tetap sama, maka energi potensial maksimum benda tersebut dibandingkan kondisi semula akan...',
    options: [
      { key: 'A', text: 'Tetap sama, karena energi potensial tidak dipengaruhi oleh massa' },
      { key: 'B', text: 'Menjadi dua kali lebih besar, karena energi potensial berbanding lurus dengan massa' },
      { key: 'C', text: 'Menjadi setengah dari semula, karena massa yang lebih besar mengurangi ketinggian efektif' },
      { key: 'D', text: 'Menjadi empat kali lebih besar, karena massa dan gravitasi saling menguatkan' },
    ],
    correct: 'B',
    explanation: 'Energi potensial dirumuskan Ep = m . g . h, sehingga Ep berbanding lurus dengan massa (m). Jika massa digandakan (1.500 g menjadi 3.000 g) sementara ketinggian (h) tetap, maka energi potensial juga menjadi dua kali lebih besar (dari 300 J menjadi 600 J).',
  },
  {
    stimulus: 'Rangga melakukan percobaan sederhana menggunakan mobil mainan bertenaga baterai di atas lintasan lurus. Ia mencatat jarak yang ditempuh mobil setiap detik menggunakan meteran dan stopwatch, kemudian menyajikan hasilnya dalam grafik jarak (s) terhadap waktu (t) (lihat gambar).',
    image: '/assets/gambar soal fisika/soal fisika no 7.jpg',
    question: 'Setelah menganalisis pola perubahan jarak terhadap waktu pada grafik tersebut, jenis gerak yang dilakukan mobil mainan Rangga adalah gerak lurus beraturan (GLB). Manakah alasan yang paling tepat mendukung kesimpulan tersebut?',
    options: [
      { key: 'A', text: 'Karena grafik berbentuk parabola yang menanjak tajam' },
      { key: 'B', text: 'Karena kecepatan mobil bertambah secara konstan setiap detik' },
      { key: 'C', text: 'Karena grafik berbentuk garis lurus, menunjukkan jarak bertambah secara tetap setiap selang waktu yang sama' },
      { key: 'D', text: 'Karena mobil sempat berhenti di pertengahan lintasan' },
    ],
    correct: 'C',
    explanation: 'Grafik s-t berupa garis lurus melalui titik asal menunjukkan bahwa jarak bertambah secara tetap pada setiap selang waktu yang sama, yang merupakan ciri utama Gerak Lurus Beraturan (GLB) dengan kecepatan konstan.',
  },
  {
    stimulus: 'Rangga melakukan percobaan sederhana menggunakan mobil mainan bertenaga baterai di atas lintasan lurus, disajikan dalam grafik jarak (s) terhadap waktu (t) yang berbentuk garis lurus melalui titik asal (0,0) (lihat gambar).',
    image: '/assets/gambar soal fisika/soal fisika no 7.jpg',
    question: 'Jika Rangga mengulangi percobaan dengan mobil yang baterainya sudah mulai melemah sehingga kecepatannya berkurang secara bertahap, bagaimana perubahan bentuk grafik s-t yang akan dihasilkan dibandingkan grafik semula?',
    options: [
      { key: 'A', text: 'Tetap berupa garis lurus dengan kemiringan yang sama' },
      { key: 'B', text: 'Berubah menjadi garis lurus dengan kemiringan yang semakin landai (kurva melengkung ke bawah)' },
      { key: 'C', text: 'Berubah menjadi garis lurus dengan kemiringan yang semakin curam' },
      { key: 'D', text: 'Berubah menjadi garis mendatar sejak awal pengukuran' },
    ],
    correct: 'B',
    explanation: 'Jika kecepatan mobil berkurang secara bertahap (GLBB diperlambat), maka pertambahan jarak per satuan waktu semakin kecil, sehingga grafik s-t akan berubah dari garis lurus menjadi kurva yang kemiringannya semakin landai (melengkung ke bawah).',
  },
  {
    stimulus: 'Rangga melakukan percobaan sederhana menggunakan mobil mainan bertenaga baterai di atas lintasan lurus, disajikan dalam grafik jarak (s) terhadap waktu (t) (lihat gambar).',
    image: '/assets/gambar soal fisika/soal fisika no 7.jpg',
    question: 'Berdasarkan data pada grafik, jika mobil menempuh jarak 12 meter dalam waktu 4 sekon, maka besar kecepatan mobil mainan tersebut adalah...',
    options: [
      { key: 'A', text: '1 m/s' },
      { key: 'B', text: '2 m/s' },
      { key: 'C', text: '3 m/s' },
      { key: 'D', text: '4 m/s' },
    ],
    correct: 'C',
    explanation: 'Kecepatan = jarak / waktu = 12 m / 4 s = 3 m/s.',
  },
  {
    question: 'Bu Ani sedang mencoba membuat yogurt dengan cara memanaskan susu hingga tepat 40°C, karena bakteri baik pada yogurt akan mati jika suhu melebihi batas tersebut. Alat ukur yang paling tepat digunakan Bu Ani agar suhu susu dapat dipantau secara akurat selama proses pemanasan adalah...',
    options: [
      { key: 'A', text: 'Barometer, karena dapat mengukur tekanan uap susu' },
      { key: 'B', text: 'Termometer, karena dirancang khusus untuk mengukur suhu suatu zat secara akurat' },
      { key: 'C', text: 'Higrometer, karena dapat mendeteksi kelembapan udara di sekitar panci' },
      { key: 'D', text: 'Manometer, karena dapat mengukur tekanan gas dalam ruang tertutup' },
    ],
    correct: 'B',
    explanation: 'Termometer adalah alat ukur yang dirancang khusus untuk mengukur besaran suhu suatu zat, sehingga paling tepat digunakan Bu Ani untuk memantau suhu susu secara akurat.',
  },
  {
    question: 'Rani berdiri di depan cermin datar dan mengklaim bahwa bayangan dirinya bersifat nyata sehingga dapat ditangkap oleh layar seperti pada cermin cekung. Setelah menganalisis sifat pembentukan bayangan pada cermin datar, pernyataan yang tepat untuk mengoreksi klaim Rani adalah...',
    options: [
      { key: 'A', text: 'Klaim Rani benar, karena semua jenis cermin menghasilkan bayangan nyata' },
      { key: 'B', text: 'Klaim Rani keliru, karena bayangan pada cermin datar bersifat maya, tegak, dan sama besar sehingga tidak dapat ditangkap layar' },
      { key: 'C', text: 'Klaim Rani benar, karena jarak bayangan sama dengan jarak benda ke cermin' },
      { key: 'D', text: 'Klaim Rani keliru, karena bayangan cermin datar bersifat nyata namun terbalik' },
    ],
    correct: 'B',
    explanation: 'Cermin datar selalu membentuk bayangan yang bersifat maya (tidak dapat ditangkap layar), tegak, dan sama besar dengan bendanya. Oleh karena itu, klaim Rani bahwa bayangannya nyata dan dapat ditangkap layar adalah keliru.',
  },
  {
    question: 'Seorang siswa menyatakan bahwa "kelajuan" dan "kecepatan" adalah dua istilah yang memiliki makna persis sama sehingga dapat dipertukarkan begitu saja dalam soal fisika. Setelah menganalisis definisi kedua besaran tersebut, tanggapan yang paling tepat terhadap pernyataan siswa tersebut adalah...',
    options: [
      { key: 'A', text: 'Pernyataan tersebut benar, karena keduanya sama-sama menyatakan seberapa cepat benda bergerak' },
      { key: 'B', text: 'Pernyataan tersebut keliru, karena kelajuan merupakan besaran vektor sedangkan kecepatan besaran skalar' },
      { key: 'C', text: 'Pernyataan tersebut keliru, karena kelajuan adalah besaran skalar (hanya nilai), sedangkan kecepatan adalah besaran vektor yang memperhitungkan arah' },
      { key: 'D', text: 'Pernyataan tersebut benar, karena satuan keduanya identik yaitu meter per sekon' },
    ],
    correct: 'C',
    explanation: 'Kelajuan merupakan besaran skalar yang hanya menyatakan nilai/besar saja, sedangkan kecepatan merupakan besaran vektor yang menyatakan nilai sekaligus arah gerak benda. Karena itu keduanya tidak dapat dipertukarkan begitu saja.',
  },
  {
    question: 'Seorang astronot melakukan ekspedisi ke bulan dan membandingkan berat sebuah benda di bulan dengan beratnya di bumi menggunakan alat ukur yang sama. Hasil pengamatan menunjukkan berat benda di bulan jauh lebih ringan dibandingkan di bumi, meskipun jumlah materi penyusun benda tersebut tidak berubah. Penjelasan yang paling tepat mengenai fenomena ini adalah...',
    options: [
      { key: 'A', text: 'Massa benda berkurang secara nyata saat berada di bulan' },
      { key: 'B', text: 'Percepatan gravitasi di bulan jauh lebih kecil daripada di bumi sehingga gaya berat yang dialami benda juga lebih kecil' },
      { key: 'C', text: 'Bulan sama sekali tidak memiliki gaya gravitasi' },
      { key: 'D', text: 'Bentuk benda berubah akibat tidak adanya tekanan udara di bulan' },
    ],
    correct: 'B',
    explanation: 'Berat benda (w = m . g) dipengaruhi oleh percepatan gravitasi (g) tempat benda berada. Karena percepatan gravitasi di bulan jauh lebih kecil daripada di bumi, berat benda di bulan menjadi lebih ringan meskipun massanya tidak berubah.',
  },
  {
    question: 'Pak Budi mengemudikan mobil dari Kota Banda Aceh menuju Kota Sigli sejauh 92 km. Pada 1 jam pertama ia menempuh jarak 50 km, kemudian sisanya ditempuh dalam waktu 1 jam berikutnya. Berdasarkan data tersebut, kelajuan rata-rata Pak Budi selama seluruh perjalanan adalah...',
    options: [
      { key: 'A', text: '41 km/jam' },
      { key: 'B', text: '46 km/jam' },
      { key: 'C', text: '56 km/jam' },
      { key: 'D', text: '31 km/jam' },
    ],
    correct: 'B',
    explanation: 'Kelajuan rata-rata = jarak total / waktu total = 92 km / 2 jam = 46 km/jam.',
  },
  {
    question: 'Saat memasak kuah beulangong, Kak Rani tanpa sengaja meninggalkan sendok logam bersandar pada pinggiran wajan panas dalam waktu cukup lama. Ketika kembali memegang gagang sendok, tangan Kak Rani merasakan panas meskipun gagang sendok tidak bersentuhan langsung dengan api maupun kuah. Berdasarkan analisis mekanisme perpindahan kalor, peristiwa ini termasuk contoh perpindahan kalor secara...karena panas merambat melalui partikel logam yang saling berdekatan tanpa disertai perpindahan partikel zat perantaranya.',
    options: [
      { key: 'A', text: 'Konduksi' },
      { key: 'B', text: 'Konveksi' },
      { key: 'C', text: 'Radiasi' },
      { key: 'D', text: 'Evaporasi' },
    ],
    correct: 'A',
    explanation: 'Panas merambat dari wajan ke gagang sendok logam melalui partikel-partikel logam yang berdekatan tanpa disertai perpindahan partikel zat perantaranya. Peristiwa ini merupakan ciri khas perpindahan kalor secara konduksi.',
  },
  {
    stimulus: 'Sebuah balok es bersuhu -10°C dipanaskan secara terus-menerus di atas kompor hingga seluruhnya berubah menjadi uap air. Perubahan suhu es tersebut terhadap waktu pemanasan dicatat dan digambarkan dalam grafik (lihat gambar).',
    image: '/assets/gambar soal fisika/soal fisika no 16.jpg',
    question: 'Setelah menganalisis perubahan suhu pada setiap segmen grafik, proses melebur (es berubah menjadi air) ditunjukkan oleh segmen...',
    options: [
      { key: 'A', text: 'P-Q' },
      { key: 'B', text: 'Q-R' },
      { key: 'C', text: 'R-S' },
      { key: 'D', text: 'S-T' },
    ],
    correct: 'B',
    explanation: 'Proses melebur (perubahan wujud es menjadi air) ditandai dengan suhu yang tetap/konstan meskipun pemanasan terus berlangsung, yaitu pada segmen mendatar pertama, Q-R.',
  },
  {
    stimulus: 'Grafik pemanasan balok es dari -10°C hingga seluruhnya menjadi uap air (lihat gambar); pada segmen Q-R dan S-T, grafik menunjukkan garis mendatar meskipun pemanasan terus dilakukan tanpa henti.',
    image: '/assets/gambar soal fisika/soal fisika no 16.jpg',
    question: 'Penjelasan ilmiah yang tepat untuk fenomena garis mendatar pada segmen Q-R dan S-T tersebut adalah...',
    options: [
      { key: 'A', text: 'Kalor yang diberikan tidak sampai ke es/air sehingga terbuang percuma' },
      { key: 'B', text: 'Seluruh kalor yang diserap digunakan untuk mengubah wujud zat (melebur/menguap), bukan untuk menaikkan suhu' },
      { key: 'C', text: 'Suhu maksimum zat tersebut telah tercapai secara permanen dan tidak dapat naik lagi' },
      { key: 'D', text: 'Termometer yang digunakan mengalami kerusakan saat pengukuran' },
    ],
    correct: 'B',
    explanation: 'Pada segmen mendatar (Q-R dan S-T), seluruh kalor yang diserap digunakan untuk mengubah wujud zat (melebur atau menguap), bukan untuk menaikkan suhu, sehingga suhu tetap konstan selama proses perubahan wujud berlangsung.',
  },
  {
    stimulus: 'Grafik pemanasan balok es dari -10°C hingga seluruhnya menjadi uap air (lihat gambar).',
    image: '/assets/gambar soal fisika/soal fisika no 16.jpg',
    question: 'Jika massa es yang dipanaskan diperbesar menjadi dua kali lipat sementara sumber kalor (kompor) yang digunakan tetap sama, maka waktu yang dibutuhkan pada segmen Q-R (proses melebur) akan...',
    options: [
      { key: 'A', text: 'Tetap sama, karena titik lebur es bersifat konstan' },
      { key: 'B', text: 'Menjadi lebih singkat, karena massa yang lebih besar mempercepat penyerapan kalor' },
      { key: 'C', text: 'Menjadi lebih lama, karena kalor yang dibutuhkan untuk melebur sebanding dengan massa zat yang dipanaskan' },
      { key: 'D', text: 'Tidak dapat diprediksi karena proses melebur tidak berkaitan dengan massa' },
    ],
    correct: 'C',
    explanation: 'Kalor yang dibutuhkan untuk melebur sebanding dengan massa zat (Q = m . L). Jika massa es diperbesar dua kali lipat sementara sumber kalor (daya pemanasan) tetap sama, maka waktu yang dibutuhkan untuk melebur seluruhnya juga akan menjadi dua kali lebih lama.',
  },
  {
    question: 'Ibu Dina ingin membuat kue timpan dengan bahan dasar 500 gram tepung ketan sesuai resep. Ia memiliki beberapa alat ukur di rumah, yaitu termometer, dinamometer, neraca dapur, dan amperemeter. Setelah mempertimbangkan besaran yang perlu diukur (massa tepung), alat yang paling tepat dan alasan yang mendasarinya adalah...',
    options: [
      { key: 'A', text: 'Termometer, karena dapat mengukur berat tepung dengan satuan gram' },
      { key: 'B', text: 'Dinamometer, karena mengukur gaya sehingga dapat dikonversi menjadi massa' },
      { key: 'C', text: 'Neraca, karena dirancang khusus untuk mengukur besaran massa suatu bahan' },
      { key: 'D', text: 'Amperemeter, karena lebih presisi untuk bahan makanan kering' },
    ],
    correct: 'C',
    explanation: 'Neraca merupakan alat ukur yang dirancang khusus untuk mengukur besaran massa suatu benda atau bahan, sehingga paling tepat digunakan Ibu Dina untuk menakar tepung ketan.',
  },
  {
    question: 'Seorang anak mendorong lemari besar sekuat tenaga, namun lemari tersebut tidak bergerak sama sekali karena tertahan gesekan lantai yang besar. Setelah menganalisis situasi tersebut, pernyataan yang paling tepat mengenai konsep gaya adalah...',
    options: [
      { key: 'A', text: 'Karena lemari tidak bergerak, berarti tidak ada gaya yang bekerja pada lemari' },
      { key: 'B', text: 'Gaya tetap bekerja pada lemari walaupun tidak menghasilkan perpindahan, karena ada gaya gesek yang berlawanan arah dan menyeimbangkannya' },
      { key: 'C', text: 'Gaya hanya dapat didefinisikan jika benda mengalami perpindahan' },
      { key: 'D', text: 'Dorongan anak tersebut bukan termasuk gaya karena tidak menyebabkan perubahan posisi' },
    ],
    correct: 'B',
    explanation: 'Gaya tetap bekerja pada lemari meskipun tidak menghasilkan perpindahan, karena terdapat gaya gesek yang arahnya berlawanan dan besarnya sama, sehingga resultan gaya menjadi nol dan lemari tetap diam (kondisi setimbang, bukan berarti tidak ada gaya).',
  },
  {
    question: 'Seorang astronot yang sedang melakukan misi luar angkasa tidak dapat mendengar teriakan rekannya meskipun jaraknya sangat dekat dan keduanya berada di ruang terbuka tanpa penghalang. Berdasarkan analisis sifat perambatan bunyi, penjelasan yang tepat untuk fenomena tersebut adalah...',
    options: [
      { key: 'A', text: 'Bunyi tetap merambat di ruang hampa udara, hanya intensitasnya berkurang' },
      { key: 'B', text: 'Bunyi memerlukan medium (zat padat, cair, atau gas) untuk merambat, sedangkan ruang angkasa merupakan ruang hampa udara' },
      { key: 'C', text: 'Astronot menggunakan helm yang menyerap seluruh gelombang bunyi' },
      { key: 'D', text: 'Gravitasi yang rendah di luar angkasa menghentikan perambatan bunyi' },
    ],
    correct: 'B',
    explanation: 'Bunyi merupakan gelombang mekanik yang memerlukan medium (zat padat, cair, atau gas) untuk merambat. Karena ruang angkasa merupakan ruang hampa udara (vakum) tanpa medium, maka bunyi tidak dapat merambat sehingga astronot tidak dapat saling mendengar secara langsung.',
  },
  {
    question: 'Seorang siswa berpendapat bahwa usaha dan energi merupakan dua konsep yang tidak saling berkaitan sama sekali. Setelah menganalisis hubungan antara gaya, perpindahan, dan energi, tanggapan yang tepat untuk mengoreksi pendapat siswa tersebut adalah...',
    options: [
      { key: 'A', text: 'Pendapat tersebut benar, karena usaha dihasilkan tanpa memerlukan gaya' },
      { key: 'B', text: 'Pendapat tersebut keliru, karena usaha merupakan bentuk perpindahan energi yang terjadi akibat gaya yang menyebabkan perpindahan benda' },
      { key: 'C', text: 'Pendapat tersebut benar, karena usaha selalu bernilai lebih besar daripada energi yang dimiliki benda' },
      { key: 'D', text: 'Pendapat tersebut keliru, karena energi hanya dihasilkan ketika usaha bernilai nol' },
    ],
    correct: 'B',
    explanation: 'Usaha (W = F . s) merupakan bentuk perpindahan energi yang terjadi akibat adanya gaya yang menyebabkan perpindahan pada benda. Oleh karena itu usaha dan energi merupakan dua konsep yang saling berkaitan erat, bukan konsep yang terpisah.',
  },
  {
    stimulus: 'Vino menggetarkan salah satu ujung tali secara naik-turun sehingga terbentuk gelombang transversal yang merambat sepanjang tali. Bentuk gelombang yang teramati setelah 2 sekon ditunjukkan pada gambar. Jarak vertikal antara titik tertinggi (puncak) dan titik terendah (lembah) gelombang pada gambar adalah 8 cm.',
    image: '/assets/gambar soal fisika/soal fisika no 23.jpg',
    question: 'Maka besar amplitudo gelombang tersebut adalah...',
    options: [
      { key: 'A', text: '2 cm' },
      { key: 'B', text: '4 cm' },
      { key: 'C', text: '8 cm' },
      { key: 'D', text: '16 cm' },
    ],
    correct: 'B',
    explanation: 'Amplitudo adalah jarak simpangan terjauh dari titik setimbang, yaitu setengah dari jarak total antara titik puncak dan titik lembah. Jika jarak puncak-lembah = 8 cm, maka amplitudo = 8 cm / 2 = 4 cm.',
  },
  {
    stimulus: 'Gelombang transversal pada tali Vino terbentuk dalam waktu 2 sekon untuk menempuh satu gelombang penuh (lihat gambar).',
    image: '/assets/gambar soal fisika/soal fisika no 23.jpg',
    question: 'Jika Vino menggetarkan tali lebih lambat sehingga waktu yang diperlukan untuk satu gelombang penuh menjadi 4 sekon, maka yang akan terjadi pada frekuensi gelombang tersebut adalah...',
    options: [
      { key: 'A', text: 'Frekuensi menjadi dua kali lebih besar dari semula' },
      { key: 'B', text: 'Frekuensi menjadi setengah dari frekuensi semula' },
      { key: 'C', text: 'Frekuensi tetap sama karena tidak dipengaruhi oleh periode' },
      { key: 'D', text: 'Frekuensi menjadi empat kali lebih besar dari semula' },
    ],
    correct: 'B',
    explanation: 'Frekuensi berbanding terbalik dengan periode (f = 1/T). Jika periode diperbesar dari 2 sekon menjadi 4 sekon (dua kali lipat), maka frekuensi gelombang akan menjadi setengah dari frekuensi semula.',
  },
  {
    stimulus: 'Gelombang transversal pada tali Vino (lihat gambar), dengan panjang gelombang (λ) = 4 m dan periode (T) = 2 s.',
    image: '/assets/gambar soal fisika/soal fisika no 23.jpg',
    question: 'Jika periode gelombang tersebut diperbesar menjadi 4 s sementara panjang gelombang tetap, cepat rambat gelombang yang baru adalah...',
    options: [
      { key: 'A', text: '0,5 m/s' },
      { key: 'B', text: '1 m/s' },
      { key: 'C', text: '2 m/s' },
      { key: 'D', text: '4 m/s' },
    ],
    correct: 'B',
    explanation: 'Cepat rambat gelombang dirumuskan v = λ / T. Dengan λ tetap 4 m dan periode baru T = 4 s, maka v = 4 m / 4 s = 1 m/s (menjadi setengah dari cepat rambat semula, yaitu 2 m/s).',
  },
  {
    question: 'Seorang pekerja mendorong lemari dengan gaya 45 N sehingga lemari berpindah sejauh 8 meter (usaha yang dihasilkan sebesar 360 J). Jika pada kesempatan berikutnya pekerja tersebut meningkatkan gayanya menjadi dua kali lipat sementara jarak perpindahan lemari tetap 8 meter, maka usaha yang dilakukan pekerja menjadi...',
    options: [
      { key: 'A', text: '180 J' },
      { key: 'B', text: '360 J' },
      { key: 'C', text: '720 J' },
      { key: 'D', text: '1.440 J' },
    ],
    correct: 'C',
    explanation: 'Usaha dirumuskan W = F . s. Jika gaya digandakan menjadi 90 N sementara jarak perpindahan tetap 8 m, maka usaha yang dihasilkan menjadi W = 90 N x 8 m = 720 J.',
  },
  {
    question: 'Sebuah mobil bermassa 800 kg melaju dengan kecepatan 10 m/s sehingga memiliki energi kinetik sebesar 40.000 J. Jika kecepatan mobil tersebut ditingkatkan menjadi dua kali kecepatan semula (20 m/s) dengan massa tetap, maka energi kinetik mobil yang baru dibandingkan energi kinetik semula adalah...',
    options: [
      { key: 'A', text: 'Menjadi 2 kali lebih besar' },
      { key: 'B', text: 'Menjadi 4 kali lebih besar' },
      { key: 'C', text: 'Menjadi 6 kali lebih besar' },
      { key: 'D', text: 'Menjadi 8 kali lebih besar' },
    ],
    correct: 'B',
    explanation: 'Energi kinetik dirumuskan Ek = 1/2 . m . v², sehingga Ek berbanding lurus dengan kuadrat kecepatan. Jika kecepatan digandakan (v menjadi 2v), maka energi kinetik menjadi (2v)² = 4 kali energi kinetik semula, yaitu dari 40.000 J menjadi 160.000 J.',
  },
  {
    question: 'Sebuah kelapa bermassa 2 kg jatuh bebas dari ketinggian 15 m dari tanah (g = 10 m/s²), dengan energi potensial mula-mula sebesar 300 J. Dengan menerapkan hukum kekekalan energi mekanik, ketika kelapa berada pada ketinggian 5 m dari tanah, besar energi kinetik yang dimiliki kelapa saat itu adalah...',
    options: [
      { key: 'A', text: '100 J' },
      { key: 'B', text: '150 J' },
      { key: 'C', text: '200 J' },
      { key: 'D', text: '250 J' },
    ],
    correct: 'C',
    explanation: 'Berdasarkan hukum kekekalan energi mekanik, energi potensial mula-mula (Ep = m.g.h = 2 x 10 x 15 = 300 J) akan berubah menjadi energi potensial dan energi kinetik seiring benda jatuh. Pada ketinggian 5 m, Ep = m.g.h = 2 x 10 x 5 = 100 J, sehingga energi kinetik pada saat itu = Em total - Ep = 300 J - 100 J = 200 J.',
  },
  {
    question: 'Sebuah titik berada pada kedalaman 1,5 m di bawah permukaan air (massa jenis air = 1.000 kg/m³, g = 10 m/s²) sehingga tekanan hidrostatisnya sebesar 15.000 Pa. Jika titik tersebut digeser lebih dalam menjadi 3 m dari permukaan air (dua kali kedalaman semula), maka tekanan hidrostatis pada titik tersebut menjadi...',
    options: [
      { key: 'A', text: '7.500 Pa' },
      { key: 'B', text: '15.000 Pa' },
      { key: 'C', text: '22.500 Pa' },
      { key: 'D', text: '30.000 Pa' },
    ],
    correct: 'D',
    explanation: 'Tekanan hidrostatis dirumuskan P = ρ . g . h, sehingga P berbanding lurus dengan kedalaman (h). Jika kedalaman digandakan dari 1,5 m menjadi 3 m, maka tekanan hidrostatis juga menjadi dua kali lebih besar, yaitu dari 15.000 Pa menjadi 30.000 Pa.',
  },
  {
    question: 'Sebanyak 0,2 kg air dipanaskan dari suhu 20°C menjadi 80°C (kalor jenis air = 4.200 J/kg°C) sehingga memerlukan kalor sebesar 50.400 J. Jika massa air yang dipanaskan diperbesar menjadi 0,4 kg dengan kenaikan suhu yang sama, maka kalor yang diperlukan dibandingkan dengan kondisi semula akan...',
    options: [
      { key: 'A', text: 'Tetap sama, karena kalor jenis air tidak berubah' },
      { key: 'B', text: 'Menjadi dua kali lebih besar, karena kalor yang diperlukan berbanding lurus dengan massa zat' },
      { key: 'C', text: 'Menjadi setengah dari semula, karena massa yang lebih besar mempercepat penyerapan kalor' },
      { key: 'D', text: 'Menjadi empat kali lebih besar, karena massa dan kalor jenis saling menguatkan pengaruhnya' },
    ],
    correct: 'B',
    explanation: 'Kalor yang diperlukan dirumuskan Q = m . c . ΔT, sehingga Q berbanding lurus dengan massa zat (m). Jika massa air digandakan dari 0,2 kg menjadi 0,4 kg dengan kenaikan suhu yang sama, maka kalor yang diperlukan juga menjadi dua kali lebih besar, yaitu dari 50.400 J menjadi 100.800 J.',
  },
];

const biologiSoal = [
  {
    question: 'Seorang peneliti mengisolasi hormon auksin dari tanaman A dan mengoleskannya ke satu sisi batang tanaman B yang diletakkan di tempat gelap. Setelah 3 hari, batang tanaman B membengkok. Jika tanaman B kemudian disinari cahaya matahari merata dari atas, apa yang akan terjadi pada arah pertumbuhan batang tersebut dan mengapa?',
    options: [
      { key: 'A', text: 'Batang tetap membengkok ke arah sentuhan auksin awal karena reaksi hormon bersifat permanen.' },
      { key: 'B', text: 'Batang akan menjadi lurus ke atas karena distribusi auksin kembali merata akibat penyinaran merata.' },
      { key: 'C', text: 'Batang membelok ke arah sumber cahaya karena auksin di sisi terang mengalami aktifasi berlebih.' },
      { key: 'D', text: 'Batang berhenti tumbuh tinggi karena cahaya merusak seluruh struktur jaringan meristem.' },
    ],
    correct: 'B',
    explanation: 'Pembengkokan batang terjadi karena auksin terkumpul lebih banyak di sisi yang gelap sehingga sisi tersebut tumbuh lebih panjang (fototropisme). Ketika cahaya matahari menyinari batang secara merata dari segala sisi, distribusi auksin kembali merata di seluruh bagian batang sehingga pertumbuhan sel-selnya pun merata dan batang tumbuh lurus ke atas.',
  },
  {
    question: 'Seorang peneliti menemukan organisme baru di hutan hujan tropis. Organisme ini menyerap nutrisi dari kayu lapuk, memiliki dinding sel yang mengandung kitin, tetapi saat diteliti materi genetiknya tidak dibungkus oleh membran inti. Berdasarkan analisis karakteristik tersebut, klasifikasi yang paling tepat untuk organisme tersebut beserta alasannya adalah …',
    options: [
      { key: 'A', text: 'Fungi, karena memiliki mode nutrisi saprotrof dan dinding sel kitin.' },
      { key: 'B', text: 'Monera, karena struktur selnya bersifat prokariotik meskipun memiliki ciri fisik mirip jamur.' },
      { key: 'C', text: 'Protista, karena tergolong jamur lendir yang belum memiliki membran inti utuh.' },
      { key: 'D', text: 'Plantae, karena menyerap nutrisi dari sisa-sisa tumbuhan tua di sekitarnya.' },
    ],
    correct: 'B',
    explanation: 'Kunci utama dalam taksonomi tingkat kingdom adalah struktur sel (prokariotik vs eukariotik). Karena organisme tidak memiliki membran inti (prokariotik), maka ia harus dimasukkan ke dalam Kingdom Monera (misalnya bakteri saprofit), meskipun penampilan atau cara nutrisinya menyerupai Fungi.',
  },
  {
    stimulus: 'Diagram struktur sel tumbuhan dengan bagian-bagian organel berlabel, termasuk organel B (Vakuola/Tonoplas) (lihat gambar).',
    image: '/assets/gambar soal biologi/soal biologi no 3.jpeg',
    question: 'Apabila suatu zat racun berhasil menyusup ke dalam sel tumbuhan dan merusak struktur organel B (Vakuola/Tonoplas), dampak langsung yang paling drastis terhadap kondisi fisik sel tumbuhan tersebut adalah …',
    options: [
      { key: 'A', text: 'Sel langsung berhenti melakukan pembelahan karena kehabisan energi ATP.' },
      { key: 'B', text: 'Tumbuhan kehilangan tekanan turgor sehingga layu karena tidak ada penyimpanan air dan zat terlarut.' },
      { key: 'C', text: 'Proses sintesis protein terhenti total karena ribosom terlepas dari posisinya.' },
      { key: 'D', text: 'Mengalami mutasi genetik karena materi DNA selular bocor ke luar sel.' },
    ],
    correct: 'B',
    explanation: 'Organel B pada sel tumbuhan (Vakuola) berfungsi menjaga tekanan turgor dan menyimpan air/metabolit sekunder. Kerusakan pada vakuola membuat sel kehilangan cairan penekan dinding sel, sehingga tumbuhan menjadi layu secara drastis.',
  },
  {
    stimulus: 'Karakteristik jaringan pada tumbuhan: dinding selnya tebal, berpori dan kedua ujungnya berlubang; terdiri atas sel-sel yang mati; terbentuk dari jaringan meristem sekunder; terletak dalam silinder pusat. Suatu tanaman pacar air direndam dalam larutan pewarna merah. Setelah beberapa jam, irisan melintang batangnya diamati di bawah mikroskop. Terlihat warna merah terkonsentrasi pada jaringan dengan sel-sel berdinding tebal dan tidak berinti di bagian dalam batang.',
    question: 'Mengapa zat warna tersebut menumpuk pada jaringan tersebut?',
    options: [
      { key: 'A', text: 'Jaringan tersebut terdiri dari sel hidup yang aktif menyerap pewarna secara transpor aktif.' },
      { key: 'B', text: 'Jaringan tersebut adalah floem yang mengedarkan zat warna hasil fotosintesis ke seluruh tubuh.' },
      { key: 'C', text: 'Jaringan tersebut adalah xilem yang bertindak sebagai pembuluh kapiler pengangkut air dari akar.' },
      { key: 'D', text: 'Jaringan kambium menyerap warna untuk membelah membentuk jaringan kayu baru.' },
    ],
    correct: 'C',
    explanation: 'Jaringan dengan ciri sel mati, dinding tebal berpori, dan berperan sebagai saluran pengangkut adalah xilem. Xilem bertindak sebagai pembuluh kapiler yang mengangkut air dan zat terlarut (termasuk pewarna) dari akar menuju batang dan daun, sehingga warna merah terkonsentrasi dan mengalir mengikuti jalur xilem tersebut.',
  },
  {
    question: 'Saat berolahraga di siang hari yang terik, tubuh Adi mengeluarkan banyak keringat. Namun, ketika berada di ruangan ber-AC yang sangat dingin, frekuensi Adi buang air kecil (urinasi) justru meningkat drastis. Fenomena hubungan antara kedua sistem ekskresi ini terjadi karena …',
    options: [
      { key: 'A', text: 'Suhu dingin merusak fungsi ginjal sehingga cairan dibuang tanpa penyaringan.' },
      { key: 'B', text: 'Tubuh menjaga homeostasis cairan; saat pembentukan keringat berkurang di suhu dingin, kelebihan air dibuang melalui ginjal.' },
      { key: 'C', text: 'Pembuluh darah di kulit membesar di suhu dingin sehingga memicu pembentukan urine lebih cepat.' },
      { key: 'D', text: 'Keringat dan urine dihasilkan oleh organ yang sama tetapi bekerja pada suhu yang berlawanan.' },
    ],
    correct: 'B',
    explanation: 'Ini melibatkan analisis mekanisme regulasi homeostasis tubuh. Tubuh harus menyeimbangkan volume cairan. Jika pengeluaran air via kulit (keringat) minimal akibat suhu dingin, ginjal akan meningkatkan laju ekskresi air melalui urine agar tekanan osmotik darah tetap stabil.',
  },
  {
    question: 'Berdasarkan analisis struktur ultrastruktur sel, Bakteri dan Ganggang Biru (Cyanobacteria) dimasukkan dalam kelompok Monera, sedangkan Ganggang Hijau dimasukkan dalam Plantae/Protista. Alasan mendasar yang memisahkan Ganggang Biru dan Ganggang Hijau dalam sistem klasifikasi tersebut adalah …',
    options: [
      { key: 'A', text: 'Ganggang biru bersifat autotrof, sedangkan ganggang hijau heterotrof.' },
      { key: 'B', text: 'Ganggang biru tidak memiliki membran inti sel (prokariotik), sedangkan ganggang hijau eukariotik.' },
      { key: 'C', text: 'Ganggang hijau reproduksinya hanya secara vegetatif, sedangkan ganggang biru generatif.' },
      { key: 'D', text: 'Ganggang biru tidak memiliki klorofil untuk proses fotosintesis.' },
    ],
    correct: 'B',
    explanation: 'Meskipun keduanya sering disebut "ganggang" karena berfotosintesis, Cyanobacteria tergolong prokariotik (Monera) karena tidak memiliki membran inti (nukleus terselubung), sedangkan ganggang hijau sudah memiliki inti sel sejati (eukariotik).',
  },
  {
    question: 'Seekor hewan akuatik memiliki bentuk tubuh streamline seperti ikan, bernapas menggunakan paru-paru, tidak bersisik, serta melahirkan dan menyusui anaknya. Berdasarkan adaptasi filogenetiknya, mengapa hewan ini diklasifikasikan sebagai Mamalia dan bukan Pisces?',
    options: [
      { key: 'A', text: 'Karena tinggal di air laut yang mengandung kadar garam tinggi.' },
      { key: 'B', text: 'Karena memiliki kelenjar susu dan melahirkan, yang merupakan karakteristik turunan utama (apomorfi) Mamalia.' },
      { key: 'C', text: 'Karena alat geraknya berupa sirip dada yang berasal dari modifikasi tulang rusuk.' },
      { key: 'D', text: 'Karena hewan tersebut tidak dapat berenang secepat ikan pada umumnya.' },
    ],
    correct: 'B',
    explanation: 'Klasifikasi tidak didasarkan pada habitat (air/darat), melainkan ciri kekerabatan mendasar (homologi). Adanya kelenjar mamae dan perkembangan embrio di dalam uterus (vivipar) menandakan secara konvergen bahwa organisme tersebut tergolong kelas Mamalia.',
  },
  {
    question: 'Dua tanaman semangka memiliki sifat genetik (genotipe) yang identik 100% karena hasil kloning. Tanaman A ditanam di tanah subur berkadar air cukup, sedangkan Tanaman B ditanam di tanah tandus yang kering. Saat dipanen, buah Tanaman A berukuran besar dan manis, sedangkan Tanaman B berukuran kecil dan kurang manis. Fenomena ini membuktikan bahwa …',
    options: [
      { key: 'A', text: 'Genotipe sepenuhnya menentukan fenotipe tanpa dipengaruhi faktor eksternal.' },
      { key: 'B', text: 'Fenotipe merupakan hasil interaksi antara faktor genetik dan ekspresi lingkungan.' },
      { key: 'C', text: 'Lingkungan dapat mengubah susunan basa nitrogen DNA secara permanen.' },
      { key: 'D', text: 'Tanaman B mengalami mutasi genetik akibat kekurangan nutrisi tanah.' },
    ],
    correct: 'B',
    explanation: 'Rumus fenotipe adalah Fenotipe = Genotipe + Lingkungan. Walaupun genetiknya identik, faktor lingkungan (ketersediaan air/nutrisi) mempengaruhi sejauh mana potensi genetik tersebut diekspresikan.',
  },
  {
    question: 'Di suatu kepulauan, populasi burung finch yang awalnya berparuh sedang terpisah ke dua pulau berbeda. Pulau X hanya menyediakan biji-bijian keras, sedangkan Pulau Y menyediakan nektar bunga dalam. Setelah ratusan generasi, burung di Pulau X dominan berparuh tebal-kuat, sedangkan Pulau Y berparuh panjang-runcing. Mekanisme yang paling tepat menjelaskan perubahan ini adalah …',
    options: [
      { key: 'A', text: 'Burung secara sengaja memanjangkan paruhnya agar bisa bertahan hidup.' },
      { key: 'B', text: 'Seleksi alam menguntungkan variasi paruh yang sesuai dengan jenis makanan di masing-masing pulau secara turun-temurun.' },
      { key: 'C', text: 'Perubahan bentuk paruh terjadi akibat akumulasi radiasi sinar ultraviolet di pulau tersebut.' },
      { key: 'D', text: 'Burung di Pulau Y melakukan persilangan dengan spesies serangga penghisap nektar.' },
    ],
    correct: 'B',
    explanation: 'Ini merupakan analogi kasus burung Finch Darwin. Variasi genetik acak yang sudah ada disaring oleh lingkungan (seleksi alam). Individu dengan variasi paruh yang cocok lebih mampu bertahan dan bereproduksi (survival of the fittest).',
  },
  {
    question: 'Tanaman anggrek tumbuh menempel pada batang pohon mangga tanpa menyerap nutrisi dari pohon tersebut (komensalisme). Namun, jika jumlah populasi anggrek pada satu pohon mangga menjadi sangat padat hingga menutupi hampir seluruh permukaan daun pohon mangga, hubungan interaksi tersebut dapat berubah menjadi parasitik tidak langsung karena …',
    options: [
      { key: 'A', text: 'Anggrek mulai menusukkan akarnya ke dalam pembuluh floem pohon mangga.' },
      { key: 'B', text: 'Anggrek menghalangi intensitas cahaya matahari yang dibutuhkan daun mangga untuk fotosintesis.' },
      { key: 'C', text: 'Anggrek menyerap seluruh air hujan sebelum sampai ke akar pohon mangga.' },
      { key: 'D', text: 'Pohon mangga kekurangan zat karbondioksida akibat terserap oleh anggrek.' },
    ],
    correct: 'B',
    explanation: 'Dalam analisis ekologi, kategori interaksi bersifat dinamis. Ketika epifit menutupi tajuk pohon secara berlebihan, hal itu mengurangi intensitas cahaya yang diterima daun inang, merugikan inang dalam pembuatan makanan (fotosintesis), sehingga bergeser dari komensalisme menjadi kerugian/parasitisme mekanis.',
  },
  {
    question: 'Pit Pita Caspary pada jaringan endodermis akar memiliki penebalan dari zat suberin yang bersifat impermiabel (tidak tembus air). Jalur transportasi air secara apoplas (melalui dinding sel) akan terhalang di bagian ini sehingga air dipaksa masuk secara simplas (melalui sitoplasma sel). Apa keuntungan mekanisme ini bagi tumbuhan?',
    options: [
      { key: 'A', text: 'Mempercepat laju penyerapan air tanpa memerlukan energi sel.' },
      { key: 'B', text: 'Menyaring dan mengontrol jenis mineral/ion yang boleh masuk ke dalam pembuluh pengangkut silinder pusat.' },
      { key: 'C', text: 'Mencegah air keluar dari dalam daun menuju udara bebas.' },
      { key: 'D', text: 'Mengubah air tanah menjadi gula sebelum masuk ke pembuluh kayu.' },
    ],
    correct: 'B',
    explanation: 'Pita Caspary di endodermis berfungsi sebagai "pintu seleksi". Karena jalur apoplas tersumbat zat gabus (suberin), air dan zat terlarut harus melewati membran sel hidup (simplas), memungkinkan sel endodermis menyeleksi mineral racun/berlebih agar tidak masuk ke xilem dan diedarkan ke seluruh tubuh.',
  },
  {
    question: 'Sel otot jantung dan sel otot rangka memiliki spesialisasi bentuk yang berbeda, namun keduanya bekerjasama membentuk jaringan otot. Jika suatu jaringan dibentuk oleh kumpulan sel yang bentuk dan fungsinya tidak terintegrasi dengan baik, dampak yang timbul pada tingkat organ adalah …',
    options: [
      { key: 'A', text: 'Organ akan membelah membentuk organ baru yang lebih sempurna.' },
      { key: 'B', text: 'Kegagalan fungsi spesifik organ dalam menjalankan sistem organ terkait.' },
      { key: 'C', text: 'Sel-sel akan berubah menjadi sel penyusun jaringan epitel secara otomatis.' },
      { key: 'D', text: 'Organ tetap berfungsi normal karena ditentukan oleh cairan ekstraseluler.' },
    ],
    correct: 'B',
    explanation: 'Dalam hierarki organisasi kehidupan, fungsi organ bergantung pada hierarki di bawahnya (jaringan sel). Jika penyusun jaringan tidak terspesialisasi dan berkoordinasi dengan baik, organ tidak dapat menjalankan fisiologinya (misal: gagal jantung akibat disorganisasi serabut otot).',
  },
  {
    question: 'Pemerintah merencanakan mengganti Pembangkit Listrik Tenaga Uap (PLTU) berbahan bakar batu bara dengan Pembangkit Listrik Tenaga Massa Hayati (Biomassa kayu). Ditinjau dari siklus karbon, mengapa penggunaan biomassa kayu secara berkelanjutan dianggap lebih ramah lingkungan dibanding batu bara, padahal keduanya sama-sama menghasilkan CO2 saat dibakar?',
    options: [
      { key: 'A', text: 'CO2 hasil pembakaran kayu memiliki molekul yang lebih ringan dibanding batu bara.' },
      { key: 'B', text: 'Karbon yang dilepas pembakaran kayu merupakan bagian dari siklus karbon pendek yang dapat diserap kembali oleh penanaman pohon baru.' },
      { key: 'C', text: 'Pembakaran kayu sama sekali tidak menghasilkan gas rumah kaca jenis apapun.' },
      { key: 'D', text: 'Energi kayu tidak membutuhkan oksigen dalam proses pembakarannya.' },
    ],
    correct: 'B',
    explanation: 'Batu bara melepaskan karbon fosil yang terperangkap jutaan tahun (meningkatkan kadar karbon total di atmosfer). Sementara kayu adalah net-neutral carbon dalam siklus pendek: CO2 yang dilepas saat dibakar adalah CO2 yang diserap pohon tersebut selama tumbuh melalui fotosintesis.',
  },
  {
    question: 'Seorang petani memotong ujung pucuk (meristem apikal) pada tanaman cabainya. Beberapa minggu kemudian, tanaman tersebut tumbuh menjadi lebih rimbun dengan banyak cabang samping, bukan bertambah tinggi. Fenomena ini terjadi karena …',
    options: [
      { key: 'A', text: 'Pemotongan meristem apikal menghentikan dominansi apikal dan memicu hormon sitokinin merangsang tunas lateral.' },
      { key: 'B', text: 'Tanaman mengalami stres sehingga mempercepat proses pembungaan.' },
      { key: 'C', text: 'Jaringan xilem di batang tersumbat sehingga pertumbuhan mengarah ke samping.' },
      { key: 'D', text: 'Akar tanaman berhenti menyerap air sehingga batang membesar secara horizontal.' },
    ],
    correct: 'A',
    explanation: 'Meristem apikal menghasilkan auksin tinggi yang menghambat pertumbuhan tunas samping (dominansi apikal). Pemotongan ujung memicu penurunan kadar auksin di pucuk, membiarkan hormon sitokinin memicu pembelahan sel pada meristem lateral/tunas ketiak daun.',
  },
  {
    question: 'Dalam tata nama binomial, kentang (Solanum tuberosum), tomat (Solanum lycopersicum), dan terung (Solanum melongena) berada dalam genus yang sama. Berdasarkan taksonomi evolusioner, informasi biologis mendasar yang dapat disimpulkan dari ketiga tanaman tersebut adalah …',
    options: [
      { key: 'A', text: 'Ketiganya memiliki tingkat keanekaragaman genetik yang sama persis sehingga dapat saling disilangkan menghasilkan keturunan fertil.' },
      { key: 'B', text: 'Ketiganya memiliki hubungan kekerabatan yang lebih dekat satu sama lain dibandingkan dengan tanaman cabai (Capsicum annuum).' },
      { key: 'C', text: 'Ketiga tanaman tersebut memiliki struktur morfologi organ vegetatif yang tidak dapat dibedakan.' },
      { key: 'D', text: 'Memiliki jumlah kromosom dan urutan DNA yang 100% identik.' },
    ],
    correct: 'B',
    explanation: 'Semakin tinggi tingkatan takson yang sama (dalam hal ini Genus Solanum), semakin banyak persamaan karakter evolusioner dan genetiknya. Tanaman dalam genus yang sama memiliki kekerabatan lebih dekat dibanding dengan organisme beda genus (Capsicum).',
  },
  {
    question: 'Seorang siswa mengambil sampel air kolam tergenang dan mengamatinya di bawah mikroskop. Ia menemukan mikroorganisme uniseluler bergerak cepat menggunakan silia, memiliki mikronukleus dan makronukleus. Mengapa mikroorganisme ini tidak mungkin Plasmodium sp.?',
    options: [
      { key: 'A', text: 'Plasmodium sp. tidak memiliki membran inti sel.' },
      { key: 'B', text: 'Plasmodium sp. adalah protozoa parasit obligat yang tidak memiliki alat gerak aktif dan hidup di dalam darah/tubuh inang.' },
      { key: 'C', text: 'Plasmodium sp. hanya hidup di perairan laut dalam berkadar garam tinggi.' },
      { key: 'D', text: 'Plasmodium sp. merupakan mikroorganisme yang membentuk koloni multiseluler raksasa.' },
    ],
    correct: 'B',
    explanation: 'Plasmodium sp. tergolong Sporozoa (tidak memiliki alat gerak spesifik seperti silia/pseudopodia) dan bersifat endoparasit obligat dalam sel darah manusia/vektor nyamuk, sehingga tidak hidup bebas di air sawah/kolam layaknya Paramecium.',
  },
  {
    question: 'Di suatu ekosistem hutan, musang memakan buah-buahan gugur (tumbuhan), tetapi juga berburu katak dan serangga. Jika populasi katak mendadak punah akibat wabah jamur, dampaknya terhadap fleksibilitas rantai makanan musang adalah …',
    options: [
      { key: 'A', text: 'Musang langsung punah karena kehilangan satu-satunya sumber energi.' },
      { key: 'B', text: 'Musang memperbanyak konsumsi buah-buahan dan serangga untuk menjaga tingkat trofiknya sebagai omnivora.' },
      { key: 'C', text: 'Musang berubah peran menjadi produsen primer dalam rantai makanan.' },
      { key: 'D', text: 'Populasi buah-buahan meningkat tanpa terkendali karena tidak ada lagi yang memakan serangga.' },
    ],
    correct: 'B',
    explanation: 'Organisme omnivora memiliki trofik yang fleksibel (bisa Konsumen I saat makan tumbuhan, Konsumen II saat makan herbivora). Keanekaragaman diet ini membuat jaring-jaring makanan lebih stabil saat salah satu populasi mangsanya terganggu.',
  },
  {
    question: 'Suatu tumbuhan kecil tumbuh melekat pada batuan basah. Tumbuhan ini belum memiliki akar, batang, dan daun sejati serta tidak memiliki pembuluh xilem maupun floem. Bagaimana tumbuhan ini mentransportasikan air dan hasil fotosintesis ke seluruh jaringan tubuhnya?',
    options: [
      { key: 'A', text: 'Menggunakan daya dorong pembuluh kapiler semu pada batangnya.' },
      { key: 'B', text: 'Mengandalkan proses difusi dan osmosis antarsel secara langsung karena tubuhnya tipis.' },
      { key: 'C', text: 'Menggunakan jaringan parenkim kayu yang termodifikasi menjadi sel penyerap.' },
      { key: 'D', text: 'Menyerap air dari udara bebas menggunakan stomata terbuka 24 jam.' },
    ],
    correct: 'B',
    explanation: 'Tumbuhan non-vaskuler (Bryophyta/Lumut) tidak memiliki berkas pengangkut (xilem-floem). Oleh karena itu, pengangkutan air dan zat hara dilakukan secara perlahan dari sel ke sel melalui difusi, osmosis, dan pasokan aliran plastid. Hal ini membatasi ukuran tubuh lumut tetap kecil.',
  },
  {
    question: 'Membran sel tersusun atas lapisan phospholipid bilayer dengan bagian kepala bersifat hidrofilik (suka air) dan ekor bersifat hidrofobik (takut air). Struktur molekuler ini menyebabkan membran sel bersifat selektif permeabel, yang artinya …',
    options: [
      { key: 'A', text: 'Semua jenis zat baik larut air maupun larut lemak dapat bebas melintas tanpa hambatan.' },
      { key: 'B', text: 'Hanya molekul non-polar/kecil yang dapat berdifusi langsung, sedangkan molekul polar/besar memerlukan saluran protein khusus.' },
      { key: 'C', text: 'Membran akan hancur jika terkena larutan yang mengandung zat cair.' },
      { key: 'D', text: 'Membran memblokir seluruh zat asing agar tidak masuk ke dalam inti sel.' },
    ],
    correct: 'B',
    explanation: 'Karakteristik sifat hidrofilik-hidrofobik pada bilayer fosfolipid menyeleksi molekul yang lewat. Molekul kecil non-polar (O2, CO2) mudah menembus ekor asam lemak hidrofobik, sedangkan ion dan molekul polar (glukosa) membutuhkan protein transpor (transpor terfasilitasi/aktif).',
  },
  {
    question: 'Seorang siswa menemukan spesimen Arthropoda di kebun. Saat diidentifikasi, hewan tersebut memiliki 3 pasang kaki di bagian dada, sepasang antena, dan tubuh terbagi atas kepala, dada, serta perut. Namun spesimen lain memiliki 5 pasang kaki dan tidak berantena. Berdasarkan perbedaan struktur tersebut, fungsi adaptif dari 3 pasang kaki pada kelas Insecta adalah …',
    options: [
      { key: 'A', text: 'Memudahkan mobilitas darat dengan koordinasi tripod statis saat berjalan cepat.' },
      { key: 'B', text: 'Membantu proses pernapasan trakea melalui pori-pori di persendian kaki.' },
      { key: 'C', text: 'Menyerap zat hara dari permukaan tanah tempat ia merayap.' },
      { key: 'D', text: 'Menggantikan fungsi sayap saat terbang di udara.' },
    ],
    correct: 'A',
    explanation: 'Morfologi 3 pasang kaki (hexapoda) pada Insecta memberikan kestabilan mekanis yang efisien saat bergerak (pola alternating tripod gait), di mana 3 kaki selalu menyentuh tanah membentuk tumpuan segitiga saat berjalan.',
  },
  {
    question: 'Kasus pencemaran logam berat (seperti raksa/merkuri) di perairan sering kali tidak mematikan fitoplankton secara langsung. Namun, sampel jaringan elang laut (konsumen puncak) menunjukkan konsentrasi merkuri jutaan kali lebih tinggi dibandingkan konsentrasi merkuri di dalam air kolam tersebut. Fenomena ini terjadi karena …',
    options: [
      { key: 'A', text: 'Elang laut meminum air perairan secara langsung dalam jumlah ribuan liter per hari.' },
      { key: 'B', text: 'Logam berat bersifat persisten dan mengalami akumulasi yang berlipat ganda pada setiap tingkatan trofik (biomagnifikasi).' },
      { key: 'C', text: 'Fitoplankton menyerap merkuri dan mengubahnya menjadi zat gula berenergi tinggi.' },
      { key: 'D', text: 'Merkuri bereaksi dengan udara menghasilkan racun yang mengendap di bulu elang laut.' },
    ],
    correct: 'B',
    explanation: 'Polutan beracun yang tidak dapat diuraikan (non-biodegradable) dan tidak bisa diekskresikan sel akan berpindah saat terjadi peristiwa makan-dimakan. Karena tingkat trofik atas memakan banyak organisme di tingkat bawahnya, konsentrasi racun terkumpul paling tinggi pada konsumen puncak (biomagnification).',
  },
  {
    question: 'Di suatu ekosistem sawah, ular merupakan pemangsa alami tikus dan katak. Jika petani memberantas seluruh ular menggunakan racun, dalam jangka pendek populasi tikus melonjak drastis merusak padi. Namun dalam jangka panjang, populasi katak justru ikut menurun tajam. Mengapa populasi katak ikut menurun padahal pemangsanya (ular) sudah habis?',
    options: [
      { key: 'A', text: 'Katak mati terkena racun ular yang tertinggal di tanah.' },
      { key: 'B', text: 'Lonjakan populasi tikus menyebabkan kompetisi ruang dan tikus juga memakan telur/kecebong katak.' },
      { key: 'C', text: 'Katak kehilangan sumber makanan utama yang biasanya disediakan oleh ular.' },
      { key: 'D', text: 'Katak berimigrasi keluar sawah karena tidak ada lagi ular yang ditakuti.' },
    ],
    correct: 'B',
    explanation: 'Hilangnya predator puncak merusak keseimbangan rantai makanan (trophic cascade). Meledaknya populasi tikus mengganggu stabilitas ekosistem — tikus bersifat omnivora opportunis yang dapat memakan vegetasi/telur organisme lain serta memicu persaingan kompetisi tempat tinggal dan sumber daya dengan katak.',
  },
  {
    question: 'Walaupun jamur roti (Rhizopus) memiliki bentuk fisik menyerupai tumbuhan (memiliki struktur mirip akar dan batang), organisme ini sama sekali tidak dimasukkan ke dalam Kingdom Plantae. Alasan utama fisiologis yang mendasari hal tersebut adalah …',
    options: [
      { key: 'A', text: 'Jamur bersifat heterotrof (tidak berklorofil) dan dinding selnya tersusun atas polisakarida kitin, bukan selulosa.' },
      { key: 'B', text: 'Jamur tidak mampu bereproduksi menggunakan spora di tempat yang lembab.' },
      { key: 'C', text: 'Jamur bernapas menggunakan organ paru-paru buku seperti Arachnida.' },
      { key: 'D', text: 'Jamur tidak membutuhkan air untuk mempertahankan turgor selnya.' },
    ],
    correct: 'A',
    explanation: 'Plantae ditandai oleh autotrof (fotosintesis dengan klorofil) dan dinding sel selulosa. Jamur terpisah menjadi kingdom tersendiri karena bersifat absorptif heterotrof (mensekresikan enzim ekstraseluler) dan dinding selnya dari kitin (serupa eksoskeleton Arthropoda).',
  },
  {
    question: 'Upaya pelestarian Badak Bercula Satu dilakukan secara in-situ di Taman Nasional Ujung Kulon. Jika habitat asli tersebut hancur akibat bencana tsunami, opsi konservasi lanjutan adalah memindahkan beberapa individu ke kebun binatang atau pusat penangkaran (ex-situ). Apa risiko biologis utama dari konservasi ex-situ jangka panjang bagi populasi hewan tersebut?',
    options: [
      { key: 'A', text: 'Hewan akan langsung berubah menjadi omnivora karena diberi makan manusia.' },
      { key: 'B', text: 'Penurunan keanekaragaman genetik (inbreeding depression) dan hilangnya sifat/insting alami untuk bertahan hidup di alam liar.' },
      { key: 'C', text: 'Badak akan melahirkan keturunan dari spesies yang berbeda secara spontan.' },
      { key: 'D', text: 'Hewan tidak mampu melakukan proses respirasi di luar habitat aslinya.' },
    ],
    correct: 'B',
    explanation: 'Konservasi ex-situ memiliki keterbatasan jumlah individu (populasi kecil), yang meningkatkan risiko perkawinan sedarah (inbreeding). Hal ini menurunkan variasi genetik, memicu kemunculan alel letal resesif, dan mengikis insting liar adaptif hewan saat dikembalikan ke alam bebas.',
  },
  {
    question: 'Beberapa spesies Ganggang Biru (Cyanobacteria) mampu melakukan fiksasi nitrogen bebas (N2) dari udara dan mengubahnya menjadi amonia (NH3). Kemampuan ekologis ini sangat menguntungkan sektor pertanian karena …',
    options: [
      { key: 'A', text: 'Mengurangi kadar oksigen berlebih di udara yang dapat membakar tanaman.' },
      { key: 'B', text: 'Menyediakan sumber unsur hara nitrogen alami tanah tanpa bergantung penuh pada pupuk kimia sintetis.' },
      { key: 'C', text: 'Mencegah pertumbuhan gulma parasit di sekitar akar tanaman budidaya.' },
      { key: 'D', text: 'Mengubah struktur tanah liat menjadi tanah berpasir yang gembur.' },
    ],
    correct: 'B',
    explanation: 'Nitrogen di udara (N2) tidak bisa diserap langsung oleh tumbuhan tingkat tinggi. Cyanobacteria memiliki enzim nitrogenase yang mampu memfiksasi N2 menjadi senyawa yang dapat diserap tanaman (seperti nitrat/amonia), berperan sebagai pupuk hayati alami (biofertilizer).',
  },
  {
    question: 'Seorang siswa mengukur tinggi batang tanaman jagung setiap hari dan mencatat angkanya (cm), sementara siswa lain mengamati kematangan organ reproduksi berupa munculnya bunga jagung. Perbedaan mendasar antara kedua proses biologis tersebut adalah …',
    options: [
      { key: 'A', text: 'Pertumbuhan bersifat kualitatif dan dapat balik, sedangkan perkembangan bersifat kuantitatif.' },
      { key: 'B', text: 'Pertumbuhan bersifat kuantitatif (dapat diukur angka) dan irreversibel, sedangkan perkembangan bersifat kualitatif (proses pematangan fungsi).' },
      { key: 'C', text: 'Pertumbuhan hanya terjadi pada malam hari, sedangkan perkembangan terjadi siang hari.' },
      { key: 'D', text: 'Pertumbuhan disebabkan oleh faktor luar, sedangkan perkembangan hanya dipengaruhi genetik.' },
    ],
    correct: 'B',
    explanation: 'Pertumbuhan (growth) ditandai dengan pertambahan ukuran/jumlah sel yang dapat diukur secara kuantitatif (angka) dan tidak dapat kembali ke bentuk semula (irreversible). Perkembangan (development) adalah proses pembentukan organ menuju kedewasaan (kualitatif).',
  },
  {
    question: 'Dua biji dari varietas tanaman yang sama ditanam pada media tanah, suhu, dan penyiraman yang identik. Namun, salah satu bibit tumbuh jauh lebih kerdil dibanding bibit lainnya. Setelah diuji laboratorium, ditemukan adanya mutasi pada gen yang mengode sintesis hormon Giberalin. Apa peran Giberalin yang terganggu pada tanaman kerdil tersebut?',
    options: [
      { key: 'A', text: 'Merangsang penutupan stomata saat kondisi kekeringan.' },
      { key: 'B', text: 'Memicu pemanjangan sel batang dan merangsang pemecahan dormansi biji.' },
      { key: 'C', text: 'Mempercepat gugurnya daun di musim kemarau.' },
      { key: 'D', text: 'Menghambat pembelahan sel pada jaringan meristem apikal.' },
    ],
    correct: 'B',
    explanation: 'Hormon Giberelin berperan penting dalam pembelahan dan pemanjangan sel batang serta merangsang enzim amilase untuk memecah cadangan makanan saat perkecambahan. Defisiensi giberelin akibat faktor genetik internal menyebabkan fenotipe tanaman tumbuh kerdil (dwarfism).',
  },
  {
    question: 'Petani buah sering menyemprotkan hormon auksin sintetis pada bunga tanaman semangka yang belum mengalami penyerbukan. Hasilnya, diperoleh buah semangka tanpa biji (partenokarpi). Mengapa pemberian auksin dapat menghasilkan buah tanpa biji?',
    options: [
      { key: 'A', text: 'Auksin membunuh sel sperma serbuk sari sebelum membuahi bakal biji.' },
      { key: 'B', text: 'Auksin merangsang perkembangan dinding bakal buah (ovarium) menjadi daging buah tanpa memerlukan pembuahan sel telur.' },
      { key: 'C', text: 'Auksin mengubah biji keras menjadi cairan manis yang menyatu dengan daging buah.' },
      { key: 'D', text: 'Auksin menarik serangga untuk memakan biji semangka saat masih muda.' },
    ],
    correct: 'B',
    explanation: 'Secara alami, biji yang berkembang menghasilkan auksin untuk memicu pembesaran ovarium menjadi buah. Pemberian auksin eksogen dari luar menipu jaringan ovarium untuk tumbuh menjadi buah matang meskipun proses pembuahan/pembentukan biji tidak pernah terjadi (partenokarpi).',
  },
  {
    question: 'Selama metamorfosis dari kecebong (larva) menjadi katak dewasa, terjadi penyusutan dan hilangnya organ ekor secara bertahap. Proses perusakan sel-sel ekor ini terprogram secara biologis (apoptosis) yang melibatkan aktivitas organel sel yaitu …',
    options: [
      { key: 'A', text: 'Ribosom, yang merakit asam amino baru untuk membentuk kaki.' },
      { key: 'B', text: 'Lisosom, yang menghasilkan enzim hidrolitik untuk mencerna jaringan ekor tua.' },
      { key: 'C', text: 'Kloroplas, yang mengubah energi cahaya menjadi zat buang.' },
      { key: 'D', text: 'Mitokondria, yang menghentikan pasokan oksigen ke seluruh tubuh.' },
    ],
    correct: 'B',
    explanation: 'Penyusutan ekor kecebong adalah contoh peristiwa autolisis/apoptosis (kematian sel terprogram). Organel lisosom melepaskan enzim hidrolitiknya untuk menghancurkan makromolekul dan struktur sel ekor, lalu nutrisinya diserap kembali oleh tubuh katak untuk perkembangan organ baru (kaki).',
  },
  {
    question: 'Ketika seseorang meluruskan lengan bawahnya (gerakan ekstensi), otot bisep dan trisep bekerja secara antagonis. Kondisi fisiologis mekanis yang terjadi pada kedua otot tersebut saat lengan lurus adalah …',
    options: [
      { key: 'A', text: 'Otot bisep berkontraksi (memendek) dan otot trisep relaksasi (memanjang).' },
      { key: 'B', text: 'Otot bisep relaksasi (memanjang) dan otot trisep berkontraksi (memendek).' },
      { key: 'C', text: 'Kedua otot sama-sama berkontraksi untuk menahan beban tulang lengan.' },
      { key: 'D', text: 'Kedua otot sama-sama mengalami relaksasi total sehingga lengan jatuh layu.' },
    ],
    correct: 'B',
    explanation: 'Kerja antagonis berarti dua otot bekerja berlawanan arah. Untuk meluruskan lengan (ekstensi), otot trisep (ekstensor) harus berkontraksi/memendek untuk menarik tulang hasta, sedangkan otot bisep (fleksor) harus mengalami relaksasi/memanjang.',
  },
];

const kimiaSoal = [
  {
    question: 'Dalam sebuah percobaan, selembar kertas dibakar hingga menjadi abu. Di sisi lain, selembar kertas dipotong-potong menjadi bagian kecil. Perbedaan mendasar antara kedua fenomena tersebut ditinjau dari sifat kimia zat adalah...',
    options: [
      { key: 'A', text: 'Keduanya adalah perubahan kimia karena kertas yang rusak tidak dapat kembali utuh (irreversible).' },
      { key: 'B', text: 'Pemotongan mengubah identitas kimia kertas karena struktur serat aslinya telah rusak.' },
      { key: 'C', text: 'Pembakaran termasuk perubahan fisika karena abu tetap memiliki massa total yang sama.' },
      { key: 'D', text: 'Pembakaran menghasilkan zat jenis baru, sedangkan pemotongan hanya mengubah ukuran fisik.' },
    ],
    correct: 'D',
  },
  {
    question: 'Seorang ilmuwan mengamati dua buah wadah. Wadah A berisi zat yang bentuknya tetap meskipun dipindahkan, sedangkan wadah B berisi zat yang volumenya tetap tetapi bentuknya mengikuti wadah. Berdasarkan teori model partikel, perbedaan utama antara kedua zat tersebut adalah...',
    options: [
      { key: 'A', text: 'Partikel zat A mampu berpindah tempat, sementara partikel pada zat B hanya dapat bergetar pada posisi yang tetap.' },
      { key: 'B', text: 'Jarak antarpartikel zat A sangat renggang, sedangkan susunan partikel pada zat B sangat rapat dan tersusun teratur.' },
      { key: 'C', text: 'Ikatan antarpartikel zat A sangat kuat, sehingga partikelnya sulit bergerak bebas dibandingkan partikel pada zat B.' },
      { key: 'D', text: 'Zat A memiliki energi kinetik sangat tinggi, sehingga volume zat tersebut dapat berubah-ubah saat diberi tekanan.' },
    ],
    correct: 'C',
  },
  {
    question: 'Perhatikan data titik leleh dan titik didih berikut: Zat X (Titik Leleh: -114°C, Titik Didih: 78°C). Jika zat X berada pada suhu kamar (25°C), maka wujud zat tersebut dan alasan yang tepat adalah...',
    options: [
      { key: 'A', text: 'Padat, karena suhu 25°C berada di bawah titik didih zat tersebut.' },
      { key: 'B', text: 'Gas, karena suhu 25°C sudah melampaui titik leleh zat tersebut.' },
      { key: 'C', text: 'Cair, karena suhu 25°C berada di antara titik leleh dan titik didihnya.' },
      { key: 'D', text: 'Cair, karena suhu 25°C berada di bawah titik leleh zat tersebut.' },
    ],
    correct: 'C',
  },
  {
    question: 'Ketika es dipanaskan dalam wadah tertutup, es mengalami perubahan wujud dari padat menjadi cair, kemudian menjadi uap air yang terkumpul di tutup panci sebagai tetesan air. Berdasarkan teori partikel, perubahan energi kinetik partikel yang terjadi selama proses transisi dari fase padat ke fase gas tersebut adalah…',
    options: [
      { key: 'A', text: 'Partikel melepaskan energi ke sekitar, sehingga pergerakannya melambat dan jarak antar partikel menjadi lebih dekat.' },
      { key: 'B', text: 'Partikel menyerap energi yang mengakibatkan getaran meningkat sehingga dapat terlepas dari ikatan yang kaku.' },
      { key: 'C', text: 'Energi panas meningkatkan jumlah partikel yang menyebabkan volume zat cair dan gas bertambah secara signifikan.' },
      { key: 'D', text: 'Suhu yang tinggi mengubah struktur atom tiap partikel es menjadi atom gas dengan sifat kimia yang berbeda.' },
    ],
    correct: 'B',
  },
  {
    question: 'Perhatikan fenomena pembuatan nasi dari beras dan proses pembakaran kembang api saat perayaan hari besar. Kedua proses tersebut melibatkan interaksi dengan energi panas dan menghasilkan perubahan materi yang bersifat tidak dapat kembali ke bentuk asalnya (irreversible). Analisislah mengapa kedua fenomena tersebut dikategorikan sebagai perubahan kimia ditinjau dari susunan partikel penyusun materinya!',
    options: [
      { key: 'A', text: 'Energi panas yang diberikan menyebabkan jarak antarpartikel beras dan mesiu menjadi semakin rapat sehingga zat menjadi lebih stabil namun tetap memiliki identitas yang sama.' },
      { key: 'B', text: 'Terjadi pembentukan zat baru yang memiliki sifat kimia berbeda jauh dibandingkan dengan sifat zat asalnya melalui penyusunan ulang partikel-partikel di dalamnya.' },
      { key: 'C', text: 'Kedua proses tersebut hanya mengubah tampilan fisik dan volume materi tanpa mengubah ikatan kimia antarpartikel yang menyusun beras maupun bahan peledak kembang api.' },
      { key: 'D', text: 'Perubahan tersebut dianggap kimia karena massa total nasi yang dihasilkan pasti lebih besar daripada massa beras awal akibat adanya penyerapan partikel air secara fisik.' },
    ],
    correct: 'B',
  },
  {
    question: 'Perhatikan data titik leleh beberapa logam berikut: Besi (1.535°C), Tembaga (1.083°C), Perak (961°C), dan Emas (1.064°C). Seorang pengrajin memiliki tungku dengan suhu maksimal 1.100°C. Evaluasilah logam mana yang dapat dicairkan oleh pengrajin tersebut untuk membuat cetakan perhiasan baru!',
    options: [
      { key: 'A', text: 'Hanya besi yang dapat dicairkan karena titik lelehnya berada di atas suhu maksimal tungku pemanas tersebut.' },
      { key: 'B', text: 'Semua logam dapat dicairkan karena suhu tungku sudah cukup tinggi untuk memutus ikatan semua jenis partikel.' },
      { key: 'C', text: 'Tembaga, perak, dan emas dapat dicairkan karena suhu tungku telah melampaui titik leleh ketiga logam tersebut.' },
      { key: 'D', text: 'Perak dan emas saja yang dapat dicairkan karena kedua logam tersebut memiliki kerapatan partikel yang rendah.' },
    ],
    correct: 'C',
  },
  {
    stimulus: 'Data hasil eksperimen kelarutan sebuah zat padat dalam 200 ml air pada berbagai suhu: 25°C → 17 gram; 55°C → 40 gram; 75°C → 50 gram.',
    question: 'Berdasarkan tren data tersebut, prediksikan jumlah zat yang dapat larut jika suhu air ditingkatkan menjadi 85°C!',
    options: [
      { key: 'A', text: 'Sekitar 58–60 gram karena kenaikan suhu meningkatkan kapasitas pelarut untuk mengikat zat.' },
      { key: 'B', text: 'Tetap 52 gram karena larutan sudah dianggap mencapai titik jenuh maksimal pada suhu tersebut.' },
      { key: 'C', text: 'Menurun menjadi 45 gram karena air mulai menguap sehingga ruang bagi zat terlarut berkurang.' },
      { key: 'D', text: 'Zat tidak akan larut sama sekali karena suhu yang terlalu tinggi akan merusak partikel padatan.' },
    ],
    correct: 'A',
  },
  {
    question: 'Data pengamatan menunjukkan suhu air meningkat dari 28°C menjadi 60°C dalam waktu 6 menit saat dipanaskan. Dari pengamatan tersebut, kesimpulan apa yang dapat diambil mengenai hubungan antara lama pemanasan dengan energi kinetik partikel air tersebut?',
    options: [
      { key: 'A', text: 'Penambahan waktu pemanasan berbanding lurus dengan peningkatan suhu dan kecepatan gerak partikel air.' },
      { key: 'B', text: 'Semakin lama dipanaskan, partikel air bergerak semakin lambat karena berat molekulnya bertambah berat.' },
      { key: 'C', text: 'Energi panas yang diberikan hanya mengubah warna air tanpa memengaruhi kecepatan getaran antarpartikel.' },
      { key: 'D', text: 'Waktu pemanasan yang lama menyebabkan partikel air kehilangan energi kinetiknya saat berubah menjadi uap.' },
    ],
    correct: 'A',
  },
  {
    question: 'Seorang ilmuwan mengamati bahwa gas dapat dimampatkan ke dalam tabung oksigen yang kecil, sedangkan air dalam botol tidak dapat ditekan untuk memperkecil volumenya. Berdasarkan teori model partikel, penjelasan manakah yang paling akurat mengenai fenomena pemampatan gas tersebut?',
    options: [
      { key: 'A', text: 'Partikel gas memiliki massa yang lebih ringan sehingga mudah untuk didorong ke dalam ruang yang sempit.' },
      { key: 'B', text: 'Partikel gas bergerak sangat cepat dan memiliki jarak antarpartikel yang sangat besar dibandingkan zat cair.' },
      { key: 'C', text: 'Gaya tarik antarpartikel pada gas sangat lemah sehingga partikelnya dapat dihancurkan menjadi lebih kecil.' },
      { key: 'D', text: 'Partikel gas tidak memiliki volume tetap sehingga ukurannya akan mengecil secara otomatis saat diberi tekanan.' },
    ],
    correct: 'B',
  },
  {
    question: 'Arini mengaduk segelas air teh manis. Setelah beberapa saat, ia tidak lagi melihat butiran gula pasir di dasar gelas, namun rasa manis terasa merata di seluruh bagian air teh. Berdasarkan ciri-ciri campuran, manakah analisis yang paling tepat mengenai sifat air teh manis tersebut?',
    options: [
      { key: 'A', text: 'Air teh manis adalah campuran heterogen karena warna teh dan air gula masih dapat dibedakan secara visual.' },
      { key: 'B', text: 'Gula telah hilang sepenuhnya melalui reaksi kimia dengan teh sehingga terbentuk unsur baru yang bersifat manis.' },
      { key: 'C', text: 'Campuran tersebut adalah homogen (larutan) karena zat penyusunnya tersebar merata dan tidak dapat dipisahkan secara mekanis.' },
      { key: 'D', text: 'Larutan teh tersebut bersifat tidak stabil karena seiring waktu gula akan menguap dan menyisakan air teh tawar.' },
    ],
    correct: 'C',
  },
  {
    question: 'Seorang pelajar meletakkan satu bulatan tinta hitam di bagian tengah kertas saring, kemudian meneteskan air di atasnya. Tak lama kemudian, tampak lingkaran-lingkaran berwarna biru, merah, dan kuning di sekeliling titik pusat. Mengapa warna-warna tersebut terpisah pada jarak yang berbeda dari tetesan air di tengah?',
    options: [
      { key: 'A', text: 'Perbedaan kelarutan beragam zat pewarna dalam air serta kekuatan ikatannya terhadap serat kertas menentukan kecepatan pergerakannya.' },
      { key: 'B', text: 'Setiap pewarna memiliki bobot yang berbeda-beda, sehingga pewarna dengan bobot terberat akan bergerak paling jauh.' },
      { key: 'C', text: 'Air bereaksi dengan unsur pewarna tertentu, memecah warna dasar menjadi warna turunan.' },
      { key: 'D', text: 'Kertas saring menyerap cairan secara tidak merata, sehingga penyebaran warna hanya bergantung pada volume cairan yang diteteskan.' },
    ],
    correct: 'A',
  },
  {
    question: 'Memurnikan campuran air dan pasir bisa dilakukan dengan penyaringan biasa. Akan tetapi, jika ingin memisahkan garam dari air laut, diperlukan metode penguapan. Apa perbedaan prinsip fisika-kimia yang membuat kedua metode observasi ini dipilih!',
    options: [
      { key: 'A', text: 'Penyaringan bekerja berdasarkan perbedaan ukuran partikel, sementara penguapan memanfaatkan perbedaan titik didih masing-masing zat.' },
      { key: 'B', text: 'Pasir tidak bereaksi secara kimia dengan air, sedangkan garam akan larut sempurna jika disaring menggunakan kertas.' },
      { key: 'C', text: 'Air laut adalah campuran homogen yang tidak memungkinkan penyaringan, sementara pasir berwujud padat dan keras.' },
      { key: 'D', text: 'Penguapan diperlukan karena garam memiliki titik didih yang jauh lebih rendah daripada air laut.' },
    ],
    correct: 'A',
  },
  {
    question: 'Susu murni jika dilihat secara langsung tampak seperti cairan putih yang seragam, namun jika dilihat menggunakan mikroskop terdiri atas butiran lemak kecil yang tersebar dalam air. Berdasarkan pembagian campuran, susu dikategorikan sebagai koloid karena...',
    options: [
      { key: 'A', text: 'Partikel lemaknya cukup besar untuk mengendap jika didiamkan dalam waktu yang sangat lama di suhu ruang.' },
      { key: 'B', text: 'Ukuran partikel zat terdispersinya berada di antara larutan dan suspensi, serta tidak mengendap secara alami.' },
      { key: 'C', text: 'Susu merupakan larutan sejati karena protein dan lemaknya benar-benar menyatu dengan molekul air murni.' },
      { key: 'D', text: 'Susu adalah campuran heterogen yang sangat stabil karena partikel penyusunnya tidak dapat dilihat dengan mikroskop.' },
    ],
    correct: 'B',
  },
  {
    question: 'Vitamin B dan C dikenal sebagai vitamin yang larut dalam air, sedangkan vitamin A, D, E, dan K larut dalam lemak. Analisislah konsekuensi bagi tubuh jika seseorang mengonsumsi suplemen vitamin C dalam dosis yang sangat berlebih!',
    options: [
      { key: 'A', text: 'Tubuh akan mengalami keracunan kronis karena vitamin C akan menumpuk secara permanen di dalam jaringan lemak.' },
      { key: 'B', text: 'Kelebihan vitamin C akan dikeluarkan secara alami melalui urine karena sifatnya yang sangat mudah larut dalam air.' },
      { key: 'C', text: 'Vitamin C yang berlebih akan bereaksi dengan kalsium di hati dan mengakibatkan pengerasan pembuluh darah vena.' },
      { key: 'D', text: 'Seluruh kelebihan vitamin akan disimpan sebagai cadangan energi di dalam otot untuk dipakai saat berolahraga.' },
    ],
    correct: 'B',
  },
  {
    question: 'Seorang petani menemukan bahwa tanah di ladangnya terlalu asam (pH rendah), sehingga tanaman jagungnya tidak tumbuh optimal. Solusi kimiawi apa yang paling tepat dilakukan petani tersebut untuk menetralkan kondisi tanahnya?',
    options: [
      { key: 'A', text: 'Menambahkan belerang murni agar pH tanah semakin turun dan membunuh kuman penyakit pada tanaman.' },
      { key: 'B', text: 'Menyiram tanah dengan air cuka encer secara rutin agar mineral dalam tanah lebih cepat terurai menjadi nutrisi.' },
      { key: 'C', text: 'Memberikan kapur pertanian (kalsium karbonat) yang bersifat basa untuk meningkatkan pH tanah menjadi netral.' },
      { key: 'D', text: 'Menutup permukaan tanah dengan plastik hitam agar suhu tanah meningkat dan keasaman hilang melalui penguapan.' },
    ],
    correct: 'C',
  },
  {
    question: 'Dalam proses pembuatan biogas, limbah organik diuraikan oleh bakteri anaerob dalam wadah tertutup tanpa oksigen. Komponen gas utama hasil proses kimia tersebut yang dapat digunakan sebagai bahan bakar adalah...',
    options: [
      { key: 'A', text: 'Karbon dioksida karena gas ini dihasilkan dari pernapasan bakteri pengurai selama proses fermentasi berlangsung.' },
      { key: 'B', text: 'Uap air yang keluar dari limbah basah karena uap panas dapat memutar turbin pembangkit listrik sederhana.' },
      { key: 'C', text: 'Gas Nitrogen karena melimpah di atmosfer dan sangat stabil saat dibakar untuk menghasilkan panas yang besar.' },
      { key: 'D', text: 'Gas Metana (CH4) karena memiliki kandungan energi tinggi yang dihasilkan dari dekomposisi senyawa karbon organik.' },
    ],
    correct: 'D',
  },
  {
    stimulus: 'Sebuah stoples kaca tertutup berisi tanaman diletakkan di bawah sinar matahari (lihat gambar) — suhu di dalam stoples menjadi lebih panas dibandingkan udara di luar.',
    image: '/assets/gambar soal kimia/soal kimia no 17.png',
    question: 'Bagaimana fenomena kimia-fisika ini dikaitkan dengan mekanisme pemanasan global di atmosfer Bumi?',
    options: [
      { key: 'A', text: 'Tanaman mengeluarkan gas oksigen yang menyerap panas matahari dan memerangkapnya di dalam stoples tersebut.' },
      { key: 'B', text: 'Kaca stoples memerangkap radiasi inframerah, mirip dengan gas rumah kaca (CO2) yang menahan panas di atmosfer.' },
      { key: 'C', text: 'Sinar matahari berubah menjadi zat cair panas saat menyentuh permukaan daun tanaman di dalam ruang tertutup.' },
      { key: 'D', text: 'Udara di dalam stoples menyusut karena tekanan gas yang tinggi sehingga suhu meningkat secara spontan.' },
    ],
    correct: 'B',
  },
  {
    question: 'Seorang siswa menguji kelarutan gula kotak dan gula pasir dalam air dengan suhu yang berbeda. Manakah kombinasi variabel yang akan menghasilkan kecepatan pelarutan paling cepat?',
    options: [
      { key: 'A', text: 'Gula pasir dalam air dingin disertai pengadukan, karena pengadukan cepat lebih efektif melarutkan zat dibandingkan faktor suhu air.' },
      { key: 'B', text: 'Gula kotak dalam air panas tanpa pengadukan, karena energi panas dianggap sudah cukup kuat untuk menghancurkan struktur gula.' },
      { key: 'C', text: 'Gula pasir dalam air panas disertai pengadukan, karena suhu tinggi dan luas permukaan besar mempercepat interaksi partikel.' },
      { key: 'D', text: 'Gula kotak dalam air dingin tanpa pengadukan, karena kondisi tersebut menjaga kestabilan molekul gula agar lebih mudah menyatu.' },
    ],
    correct: 'C',
  },
  {
    question: 'Pada minuman ringan, sering ditambahkan Sodium benzoat sebagai pengawet untuk mencegah kerusakan produk. Fungsi bahan kimiawi utama dari penambahan sodium benzoat dalam produk pangan tersebut adalah...',
    options: [
      { key: 'A', text: 'Meningkatkan kekentalan minuman agar memberikan sensasi rasa di mulut yang lebih nyaman bagi konsumen.' },
      { key: 'B', text: 'Menetralkan rasa asam yang dihasilkan oleh kandungan karbon dioksida di dalam minuman ringan tersebut.' },
      { key: 'C', text: 'Memberikan warna bening pada minuman agar tidak terjadi oksidasi saat terpapar sinar matahari langsung.' },
      { key: 'D', text: 'Menghambat pertumbuhan mikroorganisme pengurai seperti bakteri dan jamur untuk memperpanjang daya simpan.' },
    ],
    correct: 'D',
  },
  {
    question: 'Seorang produsen makanan memilih memakai tartrazin daripada kunyit untuk menyajikan warna kuning pada produk camilannya. Analisislah alasan teknis yang mendasari penggunaan pewarna sintetis tersebut dibandingkan pewarna alami!',
    options: [
      { key: 'A', text: 'Tartrazin jauh lebih menyehatkan bagi jantung karena mengandung senyawa antioksidan yang sangat tinggi.' },
      { key: 'B', text: 'Pewarna sintetis mempunyai stabilitas warna yang lebih baik dan biaya produksi yang lebih efisien bagi industri.' },
      { key: 'C', text: 'Kunyit mengandung racun alami yang dapat merusak sistem pencernaan jika dipanaskan pada suhu tinggi.' },
      { key: 'D', text: 'Pewarna sintetis secara otomatis menaikkan kadar protein dan mineral di dalam makanan yang diproduksi.' },
    ],
    correct: 'B',
  },
  {
    question: 'Pemanis sintetis seperti siklamat dan aspartam kerap dijumpai dalam produk minuman "diet" atau "tanpa gula". Dari pernyataan tersebut, apa evaluasi yang tepat mengenai pemakaian pemanis buatan untuk penderita diabetes?',
    options: [
      { key: 'A', text: 'Sangat berisiko karena pemanis buatan mengandung lebih banyak kalori dibandingkan gula tebu alami.' },
      { key: 'B', text: 'Membantu mengatur kadar gula darah karena memberikan rasa manis tanpa meningkatkan asupan glukosa.' },
      { key: 'C', text: 'Tidak berpengaruh sama sekali karena lidah manusia tidak mampu membedakan antara gula asli dan siklamat.' },
      { key: 'D', text: 'Dianjurkan untuk mengonsumsi dalam jumlah banyak supaya insulin dalam tubuh dapat lebih efektif dalam memecah gula.' },
    ],
    correct: 'B',
  },
  {
    question: 'Formalin sebenarnya adalah cairan kimia yang digunakan untuk mengawetkan jenazah atau sampel makhluk hidup di laboratorium. Sayangnya, bahan ini sering disalahgunakan oleh oknum tertentu untuk mengawetkan makanan seperti tahu atau mi basah agar tidak cepat basi meskipun diletakkan di suhu ruangan dalam waktu lama. Mengapa kebiasaan mengonsumsi makanan yang mengandung formalin dalam jangka panjang dapat merusak struktur jaringan dan membahayakan kesehatan sel-sel tubuh manusia?',
    options: [
      { key: 'A', text: 'Zat tersebut mengikat protein di dalam jaringan tubuh secara permanen dan bersifat karsinogenik yang dapat memicu penyakit kanker.' },
      { key: 'B', text: 'Formalin merangsang tubuh untuk memproduksi sel darah merah secara berlebihan sehingga membuat seseorang merasa terlalu berenergi.' },
      { key: 'C', text: 'Kandungan kimia di dalamnya membantu tugas ginjal untuk menyaring racun sisa metabolisme dengan jauh lebih cepat dan efektif.' },
      { key: 'D', text: 'Bahan tersebut justru memperkuat sistem pertahanan tubuh (imun) sehingga manusia menjadi lebih tahan terhadap serangan virus atau bakteri.' },
    ],
    correct: 'A',
  },
  {
    question: 'Zat psikotropika golongan stimulan dapat meningkatkan denyut jantung dan membuat seseorang merasa sangat waspada. Contoh zat yang termasuk golongan stimulan dan dampak negatif penyalahgunaannya adalah...',
    options: [
      { key: 'A', text: 'Alkohol, yang dapat menyebabkan gangguan keseimbangan koordinasi saraf dan kerusakan organ hati.' },
      { key: 'B', text: 'Morfin, yang digunakan sebagai penghilang rasa sakit namun dapat menyebabkan depresi pernapasan berat.' },
      { key: 'C', text: 'Amfetamin (sabu), yang dapat menyebabkan gangguan tidur parah, kecemasan, hingga kerusakan saraf otak.' },
      { key: 'D', text: 'Ganja, yang menyebabkan penggunanya mengalami halusinasi dan penurunan persepsi waktu secara drastis.' },
    ],
    correct: 'C',
  },
  {
    question: 'Enzim yang dihasilkan oleh jamur Rhizopus oligosporus sangat penting dalam proses pembuatan tempe dari kedelai. Perubahan kimia apa yang terjadi pada protein kedelai selama proses fermentasi tersebut?',
    options: [
      { key: 'A', text: 'Protein diubah menjadi gas nitrogen cair yang membuat tekstur tempe menjadi dingin dan renyah.' },
      { key: 'B', text: 'Protein kompleks dipecah menjadi asam amino yang lebih sederhana sehingga lebih mudah dicerna oleh tubuh.' },
      { key: 'C', text: 'Senyawa protein kedelai bereaksi dengan oksigen dan berubah menjadi lemak jenuh yang sangat tinggi.' },
      { key: 'D', text: 'Seluruh protein kedelai dihancurkan dan digantikan oleh serat selulosa jamur yang tidak memiliki gizi.' },
    ],
    correct: 'B',
  },
  {
    question: 'Dalam bioteknologi pembuatan yogurt, bakteri Lactobacillus mengubah laktosa (gula susu) menjadi asam laktat. Bagaimana terbentuknya asam laktat tersebut mempengaruhi sifat fisik dan kimia susu cair?',
    options: [
      { key: 'A', text: 'Menurunkan pH susu yang menyebabkan penggumpalan protein (kasein) sehingga tekstur susu menjadi kental.' },
      { key: 'B', text: 'Menetralkan pH susu sehingga susu tetap cair dan memiliki rasa yang sangat manis seperti madu.' },
      { key: 'C', text: 'Meningkatkan kadar udara dalam susu melalui reaksi oksidasi sehingga yogurt menjadi lebih encer dari susu asli.' },
      { key: 'D', text: 'Menghasilkan gas hidrogen yang sangat banyak sehingga muncul gelembung udara di permukaan yogurt tersebut.' },
    ],
    correct: 'A',
  },
  {
    question: 'Gas rumah kaca seperti CO2 dan metana menjaga suhu bumi, tetapi kelebihan gas rumah kaca menyebabkan krisis iklim. Analisis bagaimana reboisasi (penanaman kembali hutan) dapat membantu mengatasi masalah kimia di atmosfer!',
    options: [
      { key: 'A', text: 'Daun tumbuhan mengeluarkan zat kimia cair yang dapat menetralkan molekul metana secara langsung di udara.' },
      { key: 'B', text: 'Melalui fotosintesis, tumbuhan menyerap CO2 dari atmosfer dan menyimpannya dalam bentuk senyawa karbon organik.' },
      // Opsi C asli di dokumen sumber identik persis dengan B (typo copy-paste) -- diganti pengecoh baru atas persetujuan pengguna 2026-08-11.
      { key: 'C', text: 'Karbon yang diserap tumbuhan langsung diubah menjadi oksigen murni tanpa melalui proses penyimpanan dalam jaringan tubuh.' },
      { key: 'D', text: 'Hutan yang lebat menciptakan lapisan pelindung fisik yang menghalangi sinar ultraviolet masuk ke permukaan Bumi.' },
    ],
    correct: 'B',
  },
  {
    question: 'Krim yang ada dalam susu dapat rusak jika diproses dengan penambahan asam kuat, menyebabkan pemisahan lemak dan udara. Fungsi dari bahan pengemulsi, seperti lesitin, dalam makanan olahan adalah untuk...',
    options: [
      { key: 'A', text: 'Memberikan aroma yang lezat dan awet meskipun produk dipanaskan pada suhu tinggi.' },
      { key: 'B', text: 'Menambah jumlah vitamin larut lemak agar lebih mudah diserap oleh pencernaan manusia.' },
      { key: 'C', text: 'Membasmi mikroba pengurai agar produk makanan tetap aman dikonsumsi hingga satu tahun.' },
      { key: 'D', text: 'Menyatukan fase minyak dan udara yang sulit menyatu secara alami sehingga menghasilkan emulsi yang stabil.' },
    ],
    correct: 'D',
  },
  {
    question: 'Limbah plastik sulit terurai karena struktur polimernya yang sangat stabil. Mengapa pengembangan plastik biodegradable (plastik ramah lingkungan) dianggap sebagai solusi yang efektif?',
    options: [
      { key: 'A', text: 'Karena plastik ini tidak mengandung bahan kimia sama sekali sehingga aman jika dimakan oleh hewan ternak.' },
      { key: 'B', text: 'Karena plastik ini dapat berubah menjadi energi listrik secara spontan saat terkena sinar matahari di tanah.' },
      { key: 'C', text: 'Karena plastik ini bersifat magnetik sehingga sangat mudah dipisahkan dari sampah organik di tempat pembuangan.' },
      { key: 'D', text: 'Karena strukturnya dapat dipecah oleh mikroorganisme menjadi senyawa alami seperti air dan karbon dioksida.' },
    ],
    correct: 'D',
  },
  {
    question: 'Seorang siswa menguji empat larutan tidak dikenal menggunakan kertas lakmus merah dan biru. Jika larutan X mengubah lakmus merah menjadi biru dan lakmus biru tetap biru, kesimpulan apa yang dapat diambil?',
    options: [
      { key: 'A', text: 'Larutan X bersifat asam kuat karena memiliki kemampuan mengubah warna kertas indikator menjadi gelap.' },
      { key: 'B', text: 'Larutan X bersifat netral seperti air murni karena salah satu kertas lakmus tidak mengalami perubahan warna.' },
      { key: 'C', text: 'Larutan X bersifat basa karena kertas lakmus merah bereaksi dengan ion hidroksida (OH−) dalam larutan.' },
      { key: 'D', text: 'Larutan X mengandung logam berat yang sangat berbahaya karena merusak serat kertas lakmus saat dicelupkan.' },
    ],
    correct: 'C',
  },
  {
    question: 'Zat psikotropika golongan stimulan, seperti amfetamin, bekerja dengan cara mempercepat aktivitas sistem saraf pusat secara drastis. Hal ini sering disalahgunakan oleh pengguna untuk mendapatkan efek perasaan sangat waspada, berenergi, dan tidak mudah lelah dalam waktu singkat. Analisislah mengapa penyalahgunaan zat stimulan tersebut dianggap memiliki risiko kesehatan mental dan ketergantungan yang jauh lebih tinggi jika dilakukan oleh remaja dibandingkan oleh orang dewasa!',
    options: [
      { key: 'A', text: 'Organ jantung pada usia remaja belum memiliki kekuatan otot yang cukup untuk menangani peningkatan detak jantung yang mendadak.' },
      { key: 'B', text: 'Bagian otak pengatur emosi dan pengambilan keputusan (prefrontal cortex) masih berkembang sehingga lebih rentan mengalami kecanduan.' },
      { key: 'C', text: 'Sistem pencernaan remaja belum mampu menghasilkan enzim yang cukup untuk menghancurkan sisa-sisa bahan kimia amfetamin di dalam darah.' },
      { key: 'D', text: 'Zat stimulan tersebut akan bereaksi langsung dengan hormon pertumbuhan dan mengakibatkan terhentinya perkembangan fisik secara permanen.' },
    ],
    correct: 'B',
  },
];

const pakets = [
  {
    title: 'Bank Soal HOTS Fisika',
    subject: 'Fisika',
    grade: 'SMP',
    hotsLevel: 'C4',
    stimulus: 'Kumpulan soal HOTS Fisika untuk jenjang SMP, mencakup pengukuran, gerak, usaha & energi, kalor, gelombang, dan tekanan hidrostatis.',
    soal: fisikaSoal,
  },
  {
    title: 'Bank Soal HOTS Biologi',
    subject: 'Biologi',
    grade: 'SMP',
    hotsLevel: 'C4',
    stimulus: 'Kumpulan soal HOTS Biologi untuk jenjang SMP, mencakup klasifikasi makhluk hidup, struktur sel & jaringan, ekologi, genetika, dan pertumbuhan tumbuhan/hewan.',
    soal: biologiSoal,
  },
  {
    title: 'Bank Soal HOTS IPA (Kimia)',
    subject: 'Kimia',
    grade: 'SMP',
    hotsLevel: 'C4',
    stimulus: 'Kumpulan soal HOTS IPA (Kimia) untuk jenjang SMP, mencakup perubahan zat, wujud zat & partikel, campuran & pemisahan, serta bahan kimia dalam kehidupan sehari-hari.',
    soal: kimiaSoal,
  },
];

(async () => {
  for (const paket of pakets) {
    const { rows } = await pool.query(
      `INSERT INTO paket_soal (title, type, subject, grade, hots_level, stimulus, status)
       VALUES ($1, 'NON_TKA', $2, $3, $4, $5, 'draft')
       RETURNING id`,
      [paket.title, paket.subject, paket.grade, paket.hotsLevel, paket.stimulus]
    );
    const paketId = rows[0].id;

    let order = 1;
    for (const s of paket.soal) {
      await pool.query(
        `INSERT INTO soal (paket_id, question, stimulus, image, options, correct_answer, explanation, game_type, order_number)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'multiple_choice', $8)`,
        [
          paketId,
          s.question,
          s.stimulus || null,
          s.image || null,
          JSON.stringify(s.options),
          s.correct,
          s.explanation || null,
          order++,
        ]
      );
    }
    console.log(`Paket "${paket.title}" (id=${paketId}): ${paket.soal.length} soal diimpor.`);
  }
  await pool.end();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
