/* ==========================================================================
   BANK STIMULUS BUDAYA ACEH — Data layer.
   Pure data + a fetch-style accessor. No rendering, no DOM, no HTML here.
   Swap the body of fetchStimulus() for a real `fetch('/api/stimulus')` later
   — every caller already treats it as an async source, so nothing else
   needs to change.
   ========================================================================== */

export const stimulusData = [
    {
        id: 'kopi-gayo',
        title: 'Kopi Gayo',
        category: 'kuliner',
        ipa: 'Kimia',
        grade: 'SMP',
        hotsLevel: 'C4',
        icon: 'coffee',
        summary: 'Proses budidaya dan pengolahan kopi arabika Gayo sebagai konteks reaksi kimia dan bioteknologi sederhana.',
        description: 'Kopi Gayo yang tumbuh di dataran tinggi Aceh Tengah melalui proses fermentasi biji sebelum disangrai. Proses ini melibatkan reaksi kimia dan aktivitas mikroorganisme yang dapat dijadikan konteks pembelajaran fermentasi, perubahan zat, dan sifat larutan asam-basa pada kopi.',
        keywords: ['kopi gayo', 'fermentasi', 'asam basa', 'dataran tinggi'],
        competencies: ['Menganalisis proses fermentasi sebagai reaksi kimia', 'Mengaitkan sifat asam-basa dengan pH kopi', 'Merancang penyelidikan sederhana tentang fermentasi'],
        estimatedTime: '20 menit',
        difficulty: 'Sedang',
        popularity: 98,
        dateAdded: '2026-07-10',
        featured: true
    },
    {
        id: 'tari-saman',
        title: 'Tari Saman',
        category: 'tradisi',
        ipa: 'Fisika',
        grade: 'SMP',
        hotsLevel: 'C5',
        icon: 'users',
        summary: 'Gerakan serentak dan ritme tepuk tangan penari Saman sebagai konteks gaya, gerak, dan getaran bunyi.',
        description: 'Tari Saman dari Gayo Lues menampilkan gerakan tangan, tepuk dada, dan paha yang serentak mengikuti irama syair. Pola gerak dan bunyi yang dihasilkan dapat digunakan untuk membahas konsep gerak, gaya, serta getaran dan gelombang bunyi dalam Fisika.',
        keywords: ['tari saman', 'gerak', 'getaran', 'bunyi'],
        competencies: ['Menganalisis hubungan gerak dan gaya pada gerakan tari', 'Mengaitkan tepukan tubuh dengan konsep getaran bunyi'],
        estimatedTime: '15 menit',
        difficulty: 'Sedang',
        popularity: 80,
        dateAdded: '2026-06-15'
    },
    {
        id: 'rumoh-aceh',
        title: 'Rumoh Aceh',
        category: 'tradisi',
        ipa: 'Fisika',
        grade: 'SMA',
        hotsLevel: 'C5',
        icon: 'home',
        summary: 'Struktur panggung dan konstruksi kayu Rumoh Aceh sebagai konteks kestabilan bangunan tahan gempa.',
        description: 'Rumoh Aceh dibangun berbentuk panggung dengan sambungan kayu tanpa paku yang fleksibel terhadap guncangan. Struktur ini relevan untuk membahas gaya, keseimbangan, dan prinsip bangunan tahan gempa di wilayah rawan seismik seperti Aceh.',
        keywords: ['rumoh aceh', 'gaya', 'keseimbangan', 'tahan gempa'],
        competencies: ['Menganalisis prinsip keseimbangan gaya pada struktur panggung', 'Mengevaluasi kesesuaian desain bangunan terhadap getaran gempa'],
        estimatedTime: '25 menit',
        difficulty: 'Sulit',
        popularity: 75,
        dateAdded: '2026-06-20'
    },
    {
        id: 'danau-laut-tawar',
        title: 'Danau Laut Tawar',
        category: 'alam',
        ipa: 'Biologi',
        grade: 'SMP',
        hotsLevel: 'C4',
        icon: 'waves',
        summary: 'Ekosistem air tawar Danau Laut Tawar di Aceh Tengah sebagai konteks rantai makanan dan keseimbangan lingkungan.',
        description: 'Danau Laut Tawar menjadi habitat ikan endemik seperti ikan depik dan mendukung kehidupan masyarakat sekitar. Kondisi ekosistemnya dapat dijadikan konteks pembelajaran interaksi makhluk hidup, rantai makanan, dan pencemaran lingkungan perairan.',
        keywords: ['danau laut tawar', 'ekosistem', 'ikan depik', 'rantai makanan'],
        competencies: ['Menganalisis interaksi komponen ekosistem danau', 'Mengevaluasi dampak aktivitas manusia terhadap kualitas air danau'],
        estimatedTime: '20 menit',
        difficulty: 'Sedang',
        popularity: 70,
        dateAdded: '2026-05-28'
    },
    {
        id: 'gunung-seulawah',
        title: 'Gunung Seulawah',
        category: 'alam',
        ipa: 'Fisika',
        grade: 'SMA',
        hotsLevel: 'C4',
        icon: 'mountain',
        summary: 'Aktivitas vulkanik Gunung Seulawah Agam sebagai konteks proses geologi dan energi panas bumi.',
        description: 'Gunung Seulawah Agam merupakan gunung berapi aktif yang menyimpan potensi energi panas bumi. Fenomena ini dapat digunakan untuk membahas perpindahan kalor, perubahan wujud zat, serta pemanfaatan energi alternatif.',
        keywords: ['gunung seulawah', 'vulkanik', 'panas bumi', 'energi'],
        competencies: ['Menganalisis proses perpindahan kalor pada aktivitas vulkanik', 'Mengevaluasi potensi pemanfaatan energi panas bumi'],
        estimatedTime: '20 menit',
        difficulty: 'Sedang',
        popularity: 65,
        dateAdded: '2026-05-20'
    },
    {
        id: 'hutan-leuser',
        title: 'Hutan Leuser',
        category: 'alam',
        ipa: 'Biologi',
        grade: 'SMP',
        hotsLevel: 'C6',
        icon: 'trees',
        summary: 'Keanekaragaman hayati Taman Nasional Gunung Leuser sebagai konteks klasifikasi makhluk hidup dan konservasi.',
        description: 'Hutan Leuser menjadi rumah bagi flora dan fauna langka seperti orangutan Sumatra dan bunga Rafflesia. Keanekaragamannya menjadi konteks yang kaya untuk membahas klasifikasi makhluk hidup, keseimbangan ekosistem, hingga upaya konservasi.',
        keywords: ['hutan leuser', 'keanekaragaman hayati', 'konservasi', 'ekosistem'],
        competencies: ['Mengklasifikasikan makhluk hidup berdasarkan ciri-ciri di hutan Leuser', 'Merancang solusi konservasi keanekaragaman hayati'],
        estimatedTime: '30 menit',
        difficulty: 'Sulit',
        popularity: 90,
        dateAdded: '2026-07-05'
    },
    {
        id: 'kerajinan-rotan',
        title: 'Kerajinan Rotan',
        category: 'kerajinan',
        ipa: 'Fisika',
        grade: 'SMP',
        hotsLevel: 'C4',
        icon: 'package',
        summary: 'Pengolahan rotan menjadi kerajinan anyaman sebagai konteks sifat fisik dan elastisitas bahan.',
        description: 'Rotan diolah melalui proses perendaman dan pelenturan sebelum dianyam menjadi furnitur dan kerajinan. Proses ini relevan untuk membahas sifat elastisitas, kekuatan bahan, serta perubahan fisika akibat perlakuan panas dan air.',
        keywords: ['kerajinan rotan', 'elastisitas', 'sifat bahan'],
        competencies: ['Menganalisis sifat elastisitas bahan rotan', 'Mengaitkan proses pengolahan dengan perubahan sifat fisik bahan'],
        estimatedTime: '15 menit',
        difficulty: 'Mudah',
        popularity: 55,
        dateAdded: '2026-04-18'
    },
    {
        id: 'garam-tradisional-aceh',
        title: 'Garam Tradisional Aceh',
        category: 'kearifan-lokal',
        ipa: 'Kimia',
        grade: 'SMP',
        hotsLevel: 'C5',
        icon: 'droplet',
        summary: 'Proses penguapan air laut menjadi garam tradisional sebagai konteks perubahan wujud dan kristalisasi.',
        description: 'Masyarakat pesisir Aceh mengolah air laut menjadi garam melalui penjemuran dan penguapan alami di bawah sinar matahari. Proses ini menjadi konteks nyata untuk membahas perubahan wujud zat, kristalisasi, serta konsep larutan jenuh.',
        keywords: ['garam tradisional', 'penguapan', 'kristalisasi', 'larutan jenuh'],
        competencies: ['Menganalisis proses kristalisasi pada pembuatan garam', 'Mengevaluasi efisiensi metode penguapan tradisional'],
        estimatedTime: '20 menit',
        difficulty: 'Sedang',
        popularity: 60,
        dateAdded: '2026-05-02'
    },
    {
        id: 'perahu-nelayan',
        title: 'Perahu Nelayan',
        category: 'tradisi',
        ipa: 'Fisika',
        grade: 'SMP',
        hotsLevel: 'C5',
        icon: 'sailboat',
        summary: 'Desain lambung perahu nelayan Aceh sebagai konteks gaya apung dan prinsip Archimedes.',
        description: 'Perahu nelayan tradisional dirancang agar tetap mengapung membawa muatan hasil tangkapan. Bentuk lambung dan distribusi bebannya dapat dijadikan konteks pembelajaran gaya apung, tekanan zat cair, dan hukum Archimedes.',
        keywords: ['perahu nelayan', 'gaya apung', 'archimedes', 'tekanan zat cair'],
        competencies: ['Menerapkan hukum Archimedes pada desain perahu', 'Menganalisis pengaruh bentuk lambung terhadap daya apung'],
        estimatedTime: '20 menit',
        difficulty: 'Sedang',
        popularity: 68,
        dateAdded: '2026-06-01'
    },
    {
        id: 'museum-tsunami',
        title: 'Museum Tsunami Aceh',
        category: 'kearifan-lokal',
        ipa: 'Fisika',
        grade: 'SMA',
        hotsLevel: 'C6',
        icon: 'landmark',
        summary: 'Arsitektur mitigasi bencana Museum Tsunami Aceh sebagai konteks gelombang dan kesiapsiagaan bencana.',
        description: 'Museum Tsunami Aceh dirancang menyerupai gelombang sekaligus berfungsi sebagai escape building saat bencana. Bangunan ini menjadi konteks pembelajaran tentang gelombang, energi gempa dan tsunami, serta pentingnya mitigasi bencana.',
        keywords: ['tsunami', 'gelombang', 'mitigasi bencana', 'energi gempa'],
        competencies: ['Menganalisis karakteristik gelombang tsunami', 'Mengevaluasi desain bangunan untuk mitigasi bencana'],
        estimatedTime: '25 menit',
        difficulty: 'Sulit',
        popularity: 92,
        dateAdded: '2026-07-12'
    },
    {
        id: 'kerajinan-anyaman',
        title: 'Kerajinan Anyaman Pandan',
        category: 'kerajinan',
        ipa: 'Biologi',
        grade: 'SMP',
        hotsLevel: 'C4',
        icon: 'grid-3x3',
        summary: 'Pengolahan daun pandan menjadi anyaman sebagai konteks struktur serat tumbuhan.',
        description: 'Daun pandan dikeringkan dan dianyam menjadi tikar serta kerajinan khas Aceh. Proses ini dapat dijadikan konteks pembelajaran struktur jaringan tumbuhan, serat alami, serta pemanfaatan sumber daya hayati secara berkelanjutan.',
        keywords: ['anyaman pandan', 'serat tumbuhan', 'jaringan tumbuhan'],
        competencies: ['Menganalisis struktur serat daun pandan', 'Mengaitkan pemanfaatan tumbuhan dengan keberlanjutan lingkungan'],
        estimatedTime: '15 menit',
        difficulty: 'Mudah',
        popularity: 50,
        dateAdded: '2026-04-10'
    },
    {
        id: 'ulee-lheue',
        title: 'Ulee Lheue',
        category: 'alam',
        ipa: 'Fisika',
        grade: 'SMA',
        hotsLevel: 'C5',
        icon: 'wind',
        summary: 'Perubahan garis pantai Ulee Lheue pascatsunami sebagai konteks abrasi dan energi gelombang laut.',
        description: 'Kawasan pesisir Ulee Lheue mengalami perubahan bentang alam akibat abrasi dan hantaman gelombang tsunami. Fenomena ini menjadi konteks pembelajaran tentang energi gelombang, tekanan air, dan upaya perlindungan garis pantai.',
        keywords: ['ulee lheue', 'abrasi', 'gelombang laut', 'pesisir'],
        competencies: ['Menganalisis pengaruh energi gelombang terhadap abrasi pantai', 'Merancang solusi perlindungan kawasan pesisir'],
        estimatedTime: '20 menit',
        difficulty: 'Sedang',
        popularity: 58,
        dateAdded: '2026-05-15'
    },
    {
        id: 'sungai-krueng-aceh',
        title: 'Sungai Krueng Aceh',
        category: 'alam',
        ipa: 'Kimia',
        grade: 'SMP',
        hotsLevel: 'C4',
        icon: 'droplets',
        summary: 'Kualitas air Sungai Krueng Aceh sebagai konteks pencemaran dan pengujian sifat kimia air.',
        description: 'Sungai Krueng Aceh menjadi sumber air sekaligus penerima limbah aktivitas warga di sekitarnya. Kondisi airnya dapat digunakan sebagai konteks pengujian pH, kekeruhan, serta dampak pencemaran terhadap kualitas air sungai.',
        keywords: ['krueng aceh', 'pencemaran air', 'pH air', 'kualitas air'],
        competencies: ['Menganalisis parameter kualitas air sungai', 'Mengevaluasi dampak pencemaran terhadap ekosistem sungai'],
        estimatedTime: '20 menit',
        difficulty: 'Sedang',
        popularity: 52,
        dateAdded: '2026-04-25'
    },
    {
        id: 'padi-aceh',
        title: 'Padi Aceh',
        category: 'kuliner',
        ipa: 'Biologi',
        grade: 'SMP',
        hotsLevel: 'C4',
        icon: 'wheat',
        summary: 'Proses budidaya padi di sawah Aceh sebagai konteks fotosintesis dan pertumbuhan tumbuhan.',
        description: 'Sawah-sawah di Aceh menghasilkan padi sebagai sumber pangan utama masyarakat. Proses pertumbuhannya menjadi konteks nyata untuk membahas fotosintesis, faktor pertumbuhan tumbuhan, serta siklus air dalam pertanian.',
        keywords: ['padi aceh', 'fotosintesis', 'pertumbuhan tumbuhan', 'pertanian'],
        competencies: ['Menganalisis proses fotosintesis pada tanaman padi', 'Mengaitkan faktor lingkungan dengan pertumbuhan tanaman'],
        estimatedTime: '15 menit',
        difficulty: 'Mudah',
        popularity: 62,
        dateAdded: '2026-05-08'
    },
    {
        id: 'air-terjun-suhom',
        title: 'Air Terjun Suhom',
        category: 'alam',
        ipa: 'Fisika',
        grade: 'SMA',
        hotsLevel: 'C5',
        icon: 'droplets',
        summary: 'Aliran deras Air Terjun Suhom sebagai konteks energi potensial dan energi kinetik.',
        description: 'Air Terjun Suhom di Aceh Besar memiliki aliran air yang jatuh dari ketinggian cukup besar. Fenomena ini menjadi konteks pembelajaran perubahan energi potensial menjadi energi kinetik serta potensi pemanfaatannya sebagai sumber energi listrik.',
        keywords: ['air terjun suhom', 'energi potensial', 'energi kinetik'],
        competencies: ['Menganalisis perubahan energi potensial menjadi energi kinetik', 'Mengevaluasi potensi pemanfaatan air terjun sebagai sumber energi'],
        estimatedTime: '20 menit',
        difficulty: 'Sedang',
        popularity: 57,
        dateAdded: '2026-06-10'
    }
];

export const stimulusCategoryMeta = {
    tradisi: { label: 'Tradisi', thumbClass: 'stimulus-card__thumb--tradisi' },
    kuliner: { label: 'Kuliner', thumbClass: 'stimulus-card__thumb--kuliner' },
    alam: { label: 'Alam', thumbClass: 'stimulus-card__thumb--alam' },
    kerajinan: { label: 'Kerajinan', thumbClass: 'stimulus-card__thumb--kerajinan' },
    'kearifan-lokal': { label: 'Kearifan Lokal', thumbClass: 'stimulus-card__thumb--kearifan' }
};

export const stimulusRecommendedIds = ['kopi-gayo', 'tari-saman'];
export const stimulusRecommendationReason = 'Karena Anda telah menyelesaikan Modul HOTS, kami merekomendasikan stimulus berikut.';

/**
 * Future backend: replace the body with
 *   return fetch('/api/stimulus').then(function (res) { return res.json(); });
 * Callers already treat this as async, so no other file needs to change.
 */
export function fetchStimulus() {
    return new Promise(function (resolve) {
        window.setTimeout(function () {
            resolve(stimulusData);
        }, 700);
    });
}
