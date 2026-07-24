/* ==========================================================================
   BANK SOAL HOTS IPA — Data layer.
   Pure data + a fetch-style accessor. No rendering, no DOM, no HTML here.
   Swap the body of fetchQuestionBank() for a real `fetch('/api/soal')` later
   — every caller already treats it as an async source, so nothing else
   needs to change.

   Note on stimulusId: each question stores only a `stimulusId` foreign key,
   not a duplicated stimulus title/description. assets/js/bank-soal.js
   resolves the stimulus name by looking it up in assets/data/stimulus.js —
   exactly the relationship a real `stimulus_id` foreign key would have.
   ========================================================================== */

export const questionData = [
    {
        id: 'soal-01', title: 'Analisis Fermentasi Kopi Gayo', stimulusId: 'kopi-gayo',
        subject: 'Kimia', category: 'kuliner', hotsLevel: 'C4',
        competency: 'Menganalisis proses fermentasi sebagai reaksi kimia',
        question: 'Selama proses fermentasi biji kopi Gayo, mikroorganisme mengubah lendir (mucilage) di permukaan biji. Manakah pernyataan yang paling tepat menjelaskan perubahan kimia yang terjadi?',
        options: ['Terjadi reaksi oksidasi yang mengubah warna biji menjadi lebih gelap', 'Mikroorganisme memecah gula pada lendir menjadi asam organik melalui respirasi anaerob', 'Suhu tinggi menyebabkan protein pada biji mengalami denaturasi total', 'Air pada lendir menguap sepenuhnya tanpa reaksi kimia'],
        answer: 1,
        explanation: 'Fermentasi kopi merupakan proses anaerob di mana mikroorganisme memecah gula dalam lendir menjadi asam organik seperti asam asetat dan asam laktat, yang memengaruhi cita rasa akhir kopi.',
        status: 'published', difficulty: 'Sedang', createdAt: '2026-07-01', updatedAt: '2026-07-05'
    },
    {
        id: 'soal-02', title: 'Uji pH Larutan Kopi Gayo', stimulusId: 'kopi-gayo',
        subject: 'Kimia', category: 'kuliner', hotsLevel: 'C4',
        competency: 'Mengaitkan sifat asam-basa dengan pH kopi',
        question: 'Seorang siswa menguji pH seduhan kopi Gayo dan mendapatkan nilai pH 5. Manakah kesimpulan yang paling tepat berdasarkan data tersebut?',
        options: ['Kopi bersifat basa lemah', 'Kopi bersifat asam lemah', 'Kopi bersifat netral seperti air murni', 'Kopi bersifat basa kuat'],
        answer: 1,
        explanation: 'pH di bawah 7 menunjukkan sifat asam. Nilai pH 5 tergolong asam lemah, yang umum ditemukan pada seduhan kopi akibat kandungan asam klorogenat.',
        status: 'published', difficulty: 'Mudah', createdAt: '2026-06-20', updatedAt: '2026-06-22'
    },
    {
        id: 'soal-03', title: 'Merancang Uji Fermentasi Kopi', stimulusId: 'kopi-gayo',
        subject: 'Kimia', category: 'kuliner', hotsLevel: 'C6',
        competency: 'Merancang penyelidikan sederhana tentang fermentasi',
        question: 'Rancanglah sebuah percobaan sederhana untuk menguji pengaruh lama waktu fermentasi terhadap tingkat keasaman biji kopi Gayo. Variabel apa yang paling tepat dijadikan variabel bebas?',
        options: ['Jenis wadah fermentasi', 'Lama waktu fermentasi', 'Warna biji kopi sebelum fermentasi', 'Nama daerah asal kopi'],
        answer: 1,
        explanation: 'Variabel bebas adalah faktor yang sengaja diubah oleh peneliti untuk melihat pengaruhnya, dalam hal ini lama waktu fermentasi terhadap tingkat keasaman (variabel terikat).',
        status: 'draft', difficulty: 'Sulit', createdAt: '2026-07-15', updatedAt: '2026-07-15'
    },
    {
        id: 'soal-04', title: 'Getaran pada Gerakan Tari Saman', stimulusId: 'tari-saman',
        subject: 'Fisika', category: 'tradisi', hotsLevel: 'C4',
        competency: 'Mengaitkan tepukan tubuh dengan konsep getaran bunyi',
        question: 'Tepukan tangan pada dada saat menari Saman menghasilkan bunyi. Manakah pernyataan yang paling tepat menjelaskan proses terjadinya bunyi tersebut?',
        options: ['Bunyi dihasilkan dari pantulan cahaya pada kulit', 'Getaran akibat tepukan merambat melalui udara sebagai gelombang bunyi', 'Bunyi terjadi karena perubahan suhu tubuh penari', 'Getaran hanya dapat didengar jika penari berteriak'],
        answer: 1,
        explanation: 'Tepukan menghasilkan getaran pada permukaan kulit yang merambat melalui medium udara berupa gelombang bunyi longitudinal hingga terdengar oleh telinga.',
        status: 'published', difficulty: 'Sedang', createdAt: '2026-06-25', updatedAt: '2026-06-28'
    },
    {
        id: 'soal-05', title: 'Analisis Gaya pada Gerakan Saman', stimulusId: 'tari-saman',
        subject: 'Fisika', category: 'tradisi', hotsLevel: 'C5',
        competency: 'Menganalisis hubungan gerak dan gaya pada gerakan tari',
        question: 'Penari Saman melakukan gerakan condong tubuh ke depan secara serentak tanpa terjatuh. Evaluasilah faktor utama yang memungkinkan keseimbangan tersebut tetap terjaga.',
        options: ['Berat badan penari yang ringan', 'Posisi titik berat tubuh yang tetap berada di atas bidang tumpu', 'Kecepatan gerakan yang sangat lambat', 'Jumlah penari yang banyak'],
        answer: 1,
        explanation: 'Keseimbangan tubuh saat condong dipertahankan selama titik berat tubuh masih berada tepat di atas bidang tumpu (pijakan), sesuai prinsip kesetimbangan gaya.',
        status: 'draft', difficulty: 'Sulit', createdAt: '2026-07-10', updatedAt: '2026-07-12'
    },
    {
        id: 'soal-06', title: 'Struktur Panggung Rumoh Aceh', stimulusId: 'rumoh-aceh',
        subject: 'Fisika', category: 'tradisi', hotsLevel: 'C5',
        competency: 'Mengevaluasi kesesuaian desain bangunan terhadap getaran gempa',
        question: 'Rumoh Aceh dibangun berbentuk panggung dengan sambungan kayu yang fleksibel. Evaluasilah alasan utama struktur ini lebih tahan terhadap guncangan gempa dibandingkan bangunan beton kaku.',
        options: ['Kayu lebih ringan sehingga tidak terpengaruh gempa', 'Sambungan fleksibel memungkinkan struktur meredam energi getaran tanpa patah', 'Bentuk panggung membuat rumah tidak menyentuh tanah sama sekali', 'Kayu memiliki titik leleh yang tinggi'],
        answer: 1,
        explanation: 'Sambungan kayu yang tidak kaku memungkinkan struktur bergerak mengikuti guncangan dan meredam energi getaran, berbeda dengan struktur kaku yang berisiko patah saat menerima gaya besar.',
        status: 'published', difficulty: 'Sulit', createdAt: '2026-06-18', updatedAt: '2026-06-20'
    },
    {
        id: 'soal-07', title: 'Keseimbangan Struktur Rumoh Aceh', stimulusId: 'rumoh-aceh',
        subject: 'Fisika', category: 'tradisi', hotsLevel: 'C4',
        competency: 'Menganalisis prinsip keseimbangan gaya pada struktur panggung',
        question: 'Tiang-tiang Rumoh Aceh disusun merata menopang lantai panggung. Manakah prinsip fisika yang paling sesuai menjelaskan kestabilan struktur tersebut?',
        options: ['Hukum kekekalan energi', 'Distribusi gaya yang merata pada titik-titik tumpu memperbesar kestabilan', 'Hukum pemantulan cahaya', 'Prinsip usaha dan energi kinetik'],
        answer: 1,
        explanation: 'Distribusi beban yang merata pada banyak titik tumpu (tiang) memperkecil tekanan pada tiap titik dan meningkatkan kestabilan keseluruhan struktur.',
        status: 'draft', difficulty: 'Sedang', createdAt: '2026-07-08', updatedAt: '2026-07-08'
    },
    {
        id: 'soal-08', title: 'Rantai Makanan Danau Laut Tawar', stimulusId: 'danau-laut-tawar',
        subject: 'Biologi', category: 'alam', hotsLevel: 'C4',
        competency: 'Menganalisis interaksi komponen ekosistem danau',
        question: 'Ikan depik di Danau Laut Tawar memakan plankton, dan pada gilirannya dimangsa oleh ikan yang lebih besar. Manakah gambaran rantai makanan yang paling tepat?',
        options: ['Plankton → Ikan besar → Ikan depik', 'Ikan depik → Plankton → Ikan besar', 'Plankton → Ikan depik → Ikan besar', 'Ikan besar → Plankton → Ikan depik'],
        answer: 2,
        explanation: 'Rantai makanan mengalir dari produsen (plankton) ke konsumen tingkat satu (ikan depik) lalu ke konsumen tingkat dua (ikan besar).',
        status: 'published', difficulty: 'Mudah', createdAt: '2026-06-10', updatedAt: '2026-06-12'
    },
    {
        id: 'soal-09', title: 'Dampak Pencemaran Danau Laut Tawar', stimulusId: 'danau-laut-tawar',
        subject: 'Biologi', category: 'alam', hotsLevel: 'C5',
        competency: 'Mengevaluasi dampak aktivitas manusia terhadap kualitas air danau',
        question: 'Limbah rumah tangga yang dibuang ke Danau Laut Tawar meningkatkan kadar nutrien di perairan. Evaluasilah dampak jangka panjang yang paling mungkin terjadi terhadap ekosistem danau.',
        options: ['Populasi ikan akan meningkat drastis secara permanen', 'Terjadi eutrofikasi yang dapat menurunkan kadar oksigen terlarut', 'Air danau akan menjadi lebih jernih', 'Tidak ada dampak signifikan terhadap ekosistem'],
        answer: 1,
        explanation: 'Peningkatan nutrien memicu pertumbuhan alga berlebih (eutrofikasi), yang saat membusuk akan menurunkan kadar oksigen terlarut dan mengancam kehidupan akuatik.',
        status: 'draft', difficulty: 'Sedang', createdAt: '2026-07-14', updatedAt: '2026-07-14'
    },
    {
        id: 'soal-10', title: 'Energi Panas Bumi Gunung Seulawah', stimulusId: 'gunung-seulawah',
        subject: 'Fisika', category: 'alam', hotsLevel: 'C4',
        competency: 'Mengevaluasi potensi pemanfaatan energi panas bumi',
        question: 'Aktivitas vulkanik Gunung Seulawah Agam menghasilkan sumber panas bumi. Manakah pernyataan yang paling tepat mengenai pemanfaatan energi tersebut?',
        options: ['Panas bumi hanya dapat digunakan untuk memasak', 'Energi panas bumi dapat dikonversi menjadi energi listrik melalui pembangkit geothermal', 'Panas bumi tidak dapat dimanfaatkan karena berbahaya', 'Panas bumi hanya ada di dalam gunung berapi aktif'],
        answer: 1,
        explanation: 'Panas bumi dapat dimanfaatkan sebagai sumber energi terbarukan melalui pembangkit listrik tenaga panas bumi (PLTP) yang mengonversi uap panas menjadi energi listrik.',
        status: 'published', difficulty: 'Sedang', createdAt: '2026-06-05', updatedAt: '2026-06-07'
    },
    {
        id: 'soal-11', title: 'Perpindahan Kalor Aktivitas Vulkanik', stimulusId: 'gunung-seulawah',
        subject: 'Fisika', category: 'alam', hotsLevel: 'C4',
        competency: 'Menganalisis proses perpindahan kalor pada aktivitas vulkanik',
        question: 'Panas dari dalam bumi dapat mencapai permukaan melalui batuan gunung berapi. Manakah jenis perpindahan kalor yang paling dominan terjadi pada proses tersebut?',
        options: ['Radiasi', 'Konduksi', 'Konveksi udara', 'Perpindahan tanpa medium'],
        answer: 1,
        explanation: 'Panas merambat melalui batuan padat (medium padat) tanpa perpindahan partikel zat, sehingga tergolong perpindahan kalor secara konduksi.',
        status: 'draft', difficulty: 'Sedang', createdAt: '2026-07-11', updatedAt: '2026-07-11'
    },
    {
        id: 'soal-12', title: 'Klasifikasi Fauna Hutan Leuser', stimulusId: 'hutan-leuser',
        subject: 'Biologi', category: 'alam', hotsLevel: 'C4',
        competency: 'Mengklasifikasikan makhluk hidup berdasarkan ciri-ciri di hutan Leuser',
        question: 'Orangutan Sumatra dan gajah Sumatra yang hidup di Hutan Leuser sama-sama tergolong mamalia. Manakah ciri yang mendasari pengklasifikasian tersebut?',
        options: ['Keduanya herbivora', 'Keduanya menyusui anaknya dan memiliki kelenjar susu', 'Keduanya hidup di pohon', 'Keduanya berkembang biak dengan bertelur'],
        answer: 1,
        explanation: 'Mamalia diklasifikasikan berdasarkan ciri menyusui anak melalui kelenjar susu, yang dimiliki baik oleh orangutan maupun gajah meskipun keduanya memiliki habitat berbeda.',
        status: 'published', difficulty: 'Mudah', createdAt: '2026-05-30', updatedAt: '2026-06-02'
    },
    {
        id: 'soal-13', title: 'Solusi Konservasi Hutan Leuser', stimulusId: 'hutan-leuser',
        subject: 'Biologi', category: 'alam', hotsLevel: 'C6',
        competency: 'Merancang solusi konservasi keanekaragaman hayati',
        question: 'Populasi orangutan Sumatra di Hutan Leuser terus menurun akibat perambahan hutan. Rancanglah solusi yang paling efektif untuk mengatasi permasalahan tersebut.',
        options: ['Menangkap seluruh orangutan untuk dipelihara di kebun binatang', 'Mengembangkan koridor satwa dan penegakan hukum terhadap perambahan hutan', 'Membiarkan kondisi tersebut karena merupakan proses alami', 'Memindahkan seluruh penduduk sekitar hutan tanpa solusi ekonomi pengganti'],
        answer: 1,
        explanation: 'Solusi konservasi yang berkelanjutan melibatkan pengembangan koridor satwa untuk menjaga habitat serta penegakan hukum terhadap aktivitas perambahan liar, tanpa mengorbankan kesejahteraan satwa maupun masyarakat sekitar.',
        status: 'draft', difficulty: 'Sulit', createdAt: '2026-07-16', updatedAt: '2026-07-16'
    },
    {
        id: 'soal-14', title: 'Elastisitas Bahan Kerajinan Rotan', stimulusId: 'kerajinan-rotan',
        subject: 'Fisika', category: 'kerajinan', hotsLevel: 'C4',
        competency: 'Menganalisis sifat elastisitas bahan rotan',
        question: 'Rotan yang direndam air menjadi lebih mudah dibentuk melengkung tanpa patah. Manakah penjelasan yang paling tepat mengenai sifat bahan tersebut?',
        options: ['Rotan kehilangan seluruh massanya saat direndam', 'Air meningkatkan elastisitas serat rotan sehingga lebih fleksibel saat dilengkungkan', 'Rotan menjadi lebih berat sehingga sulit dibentuk', 'Perendaman tidak memengaruhi sifat fisik rotan'],
        answer: 1,
        explanation: 'Air yang meresap ke dalam serat rotan meningkatkan kelenturan (elastisitas) bahan, sehingga rotan dapat dilengkungkan tanpa mudah patah.',
        status: 'published', difficulty: 'Mudah', createdAt: '2026-05-15', updatedAt: '2026-05-18'
    },
    {
        id: 'soal-15', title: 'Kristalisasi Garam Tradisional Aceh', stimulusId: 'garam-tradisional-aceh',
        subject: 'Kimia', category: 'kearifan-lokal', hotsLevel: 'C5',
        competency: 'Menganalisis proses kristalisasi pada pembuatan garam',
        question: 'Air laut yang dijemur di bawah sinar matahari lambat laun membentuk kristal garam. Evaluasilah proses yang mendasari terbentuknya kristal tersebut.',
        options: ['Air laut membeku akibat suhu rendah', 'Penguapan air menyebabkan larutan menjadi jenuh sehingga garam mengkristal', 'Garam bereaksi dengan udara membentuk zat baru', 'Sinar matahari mengubah struktur kimia garam'],
        answer: 1,
        explanation: 'Penguapan air laut menyebabkan konsentrasi garam terlarut meningkat hingga mencapai titik jenuh, sehingga partikel garam mulai membentuk kristal padat.',
        status: 'published', difficulty: 'Sedang', createdAt: '2026-06-08', updatedAt: '2026-06-10'
    },
    {
        id: 'soal-16', title: 'Efisiensi Penguapan Garam Tradisional', stimulusId: 'garam-tradisional-aceh',
        subject: 'Kimia', category: 'kearifan-lokal', hotsLevel: 'C5',
        competency: 'Mengevaluasi efisiensi metode penguapan tradisional',
        question: 'Petani garam tradisional Aceh mengandalkan sinar matahari untuk menguapkan air laut. Evaluasilah faktor cuaca yang paling berpengaruh terhadap efisiensi produksi garam.',
        options: ['Curah hujan yang tinggi dan sering', 'Intensitas sinar matahari serta kelembapan udara yang rendah', 'Kecepatan angin yang sangat rendah', 'Suhu malam hari yang dingin'],
        answer: 1,
        explanation: 'Produksi garam melalui penguapan alami paling efisien saat intensitas sinar matahari tinggi dan kelembapan udara rendah, karena mempercepat laju penguapan air laut.',
        status: 'draft', difficulty: 'Sedang', createdAt: '2026-07-13', updatedAt: '2026-07-13'
    },
    {
        id: 'soal-17', title: 'Gaya Apung Perahu Nelayan', stimulusId: 'perahu-nelayan',
        subject: 'Fisika', category: 'tradisi', hotsLevel: 'C5',
        competency: 'Menerapkan hukum Archimedes pada desain perahu',
        question: 'Perahu nelayan tetap mengapung meskipun membawa muatan ikan yang berat. Terapkan hukum Archimedes untuk menjelaskan fenomena tersebut.',
        options: ['Perahu mengapung karena terbuat dari kayu yang ringan', 'Perahu mengapung karena gaya apung sama besar dengan berat air yang dipindahkan oleh perahu', 'Perahu mengapung karena permukaan air selalu mendorong ke atas tanpa syarat', 'Perahu mengapung karena tidak memiliki berat'],
        answer: 1,
        explanation: 'Sesuai hukum Archimedes, benda akan mengapung jika gaya apung (berat air yang dipindahkan) sama dengan atau lebih besar dari berat benda tersebut.',
        status: 'published', difficulty: 'Sedang', createdAt: '2026-06-14', updatedAt: '2026-06-16'
    },
    {
        id: 'soal-18', title: 'Gelombang Tsunami dan Mitigasi Bencana', stimulusId: 'museum-tsunami',
        subject: 'Fisika', category: 'kearifan-lokal', hotsLevel: 'C6',
        competency: 'Mengevaluasi desain bangunan untuk mitigasi bencana',
        question: 'Museum Tsunami Aceh dirancang sebagai escape building saat bencana. Rancanglah kriteria utama yang harus dipenuhi sebuah bangunan agar efektif berfungsi sebagai tempat evakuasi tsunami.',
        options: ['Dibangun serendah mungkin agar mudah dijangkau', 'Memiliki struktur kokoh, lokasi tinggi, dan akses evakuasi yang cepat', 'Dibangun dari bahan yang mudah hancur agar energi gelombang teredam', 'Tidak memerlukan jalur evakuasi khusus'],
        answer: 1,
        explanation: 'Bangunan evakuasi tsunami yang efektif harus memiliki struktur kokoh tahan gempuran gelombang, berada di ketinggian yang aman, serta menyediakan akses evakuasi yang cepat dan jelas.',
        status: 'draft', difficulty: 'Sulit', createdAt: '2026-07-17', updatedAt: '2026-07-17'
    },
    {
        id: 'soal-19', title: 'Karakteristik Gelombang Tsunami', stimulusId: 'museum-tsunami',
        subject: 'Fisika', category: 'kearifan-lokal', hotsLevel: 'C4',
        competency: 'Menganalisis karakteristik gelombang tsunami',
        question: 'Gelombang tsunami memiliki panjang gelombang yang sangat besar dibandingkan gelombang laut biasa. Manakah dampak yang paling tepat akibat karakteristik tersebut saat mendekati pantai?',
        options: ['Kecepatan gelombang semakin bertambah saat mendekati pantai', 'Ketinggian gelombang meningkat drastis akibat pendangkalan dasar laut', 'Gelombang akan menghilang sebelum mencapai pantai', 'Energi gelombang berkurang drastis di laut dalam'],
        answer: 1,
        explanation: 'Saat mendekati pantai, kedalaman laut berkurang sehingga energi gelombang terkompresi dan menyebabkan ketinggian gelombang meningkat drastis (shoaling effect).',
        status: 'published', difficulty: 'Sulit', createdAt: '2026-06-30', updatedAt: '2026-07-02'
    },
    {
        id: 'soal-20', title: 'Fotosintesis pada Padi Aceh', stimulusId: 'padi-aceh',
        subject: 'Biologi', category: 'kuliner', hotsLevel: 'C4',
        competency: 'Menganalisis proses fotosintesis pada tanaman padi',
        question: 'Tanaman padi di sawah Aceh tumbuh subur dengan sinar matahari yang cukup dan pengairan teratur. Manakah pernyataan yang paling tepat mengenai peran cahaya matahari dalam proses fotosintesis padi?',
        options: ['Cahaya matahari hanya berfungsi menghangatkan tanaman', 'Cahaya matahari menjadi sumber energi untuk mengubah air dan karbondioksida menjadi glukosa dan oksigen', 'Cahaya matahari menggantikan fungsi air sepenuhnya', 'Fotosintesis dapat berlangsung tanpa cahaya matahari'],
        answer: 1,
        explanation: 'Cahaya matahari merupakan sumber energi utama dalam fotosintesis yang digunakan tumbuhan untuk mengubah air dan karbondioksida menjadi glukosa (energi kimia) dan oksigen.',
        status: 'published', difficulty: 'Mudah', createdAt: '2026-05-20', updatedAt: '2026-05-22'
    }
];

/**
 * Future backend: replace the body with
 *   return fetch('/api/soal').then(function (res) { return res.json(); });
 * Callers already treat this as async, so no other file needs to change.
 */
export function fetchQuestionBank() {
    return new Promise(function (resolve) {
        window.setTimeout(function () {
            resolve(questionData);
        }, 700);
    });
}
