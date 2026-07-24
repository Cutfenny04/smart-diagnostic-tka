/* ==========================================================================
   BANK SOAL BERBASIS BUDAYA ACEH — Data layer.
   Pure data + a fetch-style accessor. No rendering, no DOM, no HTML here.

   Setiap paket HANYA menyimpan informasi paket soal (judul, bidang, jenjang,
   HOTS, stimulus, link Wordwall, status). Tidak ada pertanyaan/opsi/jawaban
   di sini — soal HOTS didigitalisasi langsung di Wordwall oleh guru; website
   ini murni mengelola informasi paket + link aktivitas Wordwall-nya.
   Lihat PIVOT_PLAN.md untuk arsitektur lengkap.

   Konten stimulus budaya Aceh di bawah ini diserap langsung dari Bank
   Stimulus (assets/data/stimulus.js) — bukan ditulis ulang dari nol.

   Swap the body of fetchPaketSoal() for a real `fetch('/api/bank-soal')`
   later — every caller already treats it as an async source.
   ========================================================================== */

export const paketSoalData = [
    {
        id: 'kopi-gayo',
        title: 'Kopi Gayo',
        subject: 'Kimia',
        grade: 'SMP',
        hotsLevel: 'C4',
        stimulus: 'Kopi Gayo yang tumbuh di dataran tinggi Aceh Tengah melalui proses fermentasi biji sebelum disangrai. Proses ini melibatkan reaksi kimia dan aktivitas mikroorganisme yang dapat dijadikan konteks pembelajaran fermentasi, perubahan zat, dan sifat larutan asam-basa pada kopi.',
        wordwallUrl: 'https://wordwall.net/resource/00000001/kopi-gayo',
        status: 'published',
        createdAt: '2026-07-10'
    },
    {
        id: 'tari-saman',
        title: 'Tari Saman',
        subject: 'Fisika',
        grade: 'SMP',
        hotsLevel: 'C5',
        stimulus: 'Tari Saman dari Gayo Lues menampilkan gerakan tangan, tepuk dada, dan paha yang serentak mengikuti irama syair. Pola gerak dan bunyi yang dihasilkan dapat digunakan untuk membahas konsep gerak, gaya, serta getaran dan gelombang bunyi dalam Fisika.',
        wordwallUrl: 'https://wordwall.net/resource/00000002/tari-saman',
        status: 'published',
        createdAt: '2026-06-15'
    },
    {
        id: 'rumoh-aceh',
        title: 'Rumoh Aceh',
        subject: 'Fisika',
        grade: 'SMA',
        hotsLevel: 'C5',
        stimulus: 'Rumoh Aceh dibangun berbentuk panggung dengan sambungan kayu tanpa paku yang fleksibel terhadap guncangan. Struktur ini relevan untuk membahas gaya, keseimbangan, dan prinsip bangunan tahan gempa di wilayah rawan seismik seperti Aceh.',
        wordwallUrl: 'https://wordwall.net/resource/00000003/rumoh-aceh',
        status: 'draft',
        createdAt: '2026-06-20'
    },
    {
        id: 'danau-laut-tawar',
        title: 'Danau Laut Tawar',
        subject: 'Biologi',
        grade: 'SMP',
        hotsLevel: 'C4',
        stimulus: 'Danau Laut Tawar menjadi habitat ikan endemik seperti ikan depik dan mendukung kehidupan masyarakat sekitar. Kondisi ekosistemnya dapat dijadikan konteks pembelajaran interaksi makhluk hidup, rantai makanan, dan pencemaran lingkungan perairan.',
        wordwallUrl: null,
        status: 'draft',
        createdAt: '2026-05-28'
    },
    {
        id: 'gunung-seulawah',
        title: 'Gunung Seulawah',
        subject: 'Fisika',
        grade: 'SMA',
        hotsLevel: 'C4',
        stimulus: 'Gunung Seulawah Agam merupakan gunung berapi aktif yang menyimpan potensi energi panas bumi. Fenomena ini dapat digunakan untuk membahas perpindahan kalor, perubahan wujud zat, serta pemanfaatan energi alternatif.',
        wordwallUrl: null,
        status: 'draft',
        createdAt: '2026-05-20'
    },
    {
        id: 'hutan-leuser',
        title: 'Hutan Leuser',
        subject: 'Biologi',
        grade: 'SMP',
        hotsLevel: 'C6',
        stimulus: 'Hutan Leuser menjadi rumah bagi flora dan fauna langka seperti orangutan Sumatra dan bunga Rafflesia. Keanekaragamannya menjadi konteks yang kaya untuk membahas klasifikasi makhluk hidup, keseimbangan ekosistem, hingga upaya konservasi.',
        wordwallUrl: 'https://wordwall.net/resource/00000006/hutan-leuser',
        status: 'published',
        createdAt: '2026-07-05'
    },
    {
        id: 'kerajinan-rotan',
        title: 'Kerajinan Rotan',
        subject: 'Fisika',
        grade: 'SMP',
        hotsLevel: 'C4',
        stimulus: 'Rotan diolah melalui proses perendaman dan pelenturan sebelum dianyam menjadi furnitur dan kerajinan. Proses ini relevan untuk membahas sifat elastisitas, kekuatan bahan, serta perubahan fisika akibat perlakuan panas dan air.',
        wordwallUrl: null,
        status: 'draft',
        createdAt: '2026-04-18'
    },
    {
        id: 'garam-tradisional-aceh',
        title: 'Garam Tradisional Aceh',
        subject: 'Kimia',
        grade: 'SMP',
        hotsLevel: 'C5',
        stimulus: 'Masyarakat pesisir Aceh mengolah air laut menjadi garam melalui penjemuran dan penguapan alami di bawah sinar matahari. Proses ini menjadi konteks nyata untuk membahas perubahan wujud zat, kristalisasi, serta konsep larutan jenuh.',
        wordwallUrl: 'https://wordwall.net/resource/00000008/garam-tradisional-aceh',
        status: 'published',
        createdAt: '2026-05-02'
    },
    {
        id: 'perahu-nelayan',
        title: 'Perahu Nelayan',
        subject: 'Fisika',
        grade: 'SMP',
        hotsLevel: 'C5',
        stimulus: 'Perahu nelayan tradisional dirancang agar tetap mengapung membawa muatan hasil tangkapan. Bentuk lambung dan distribusi bebannya dapat dijadikan konteks pembelajaran gaya apung, tekanan zat cair, dan hukum Archimedes.',
        wordwallUrl: null,
        status: 'draft',
        createdAt: '2026-06-01'
    },
    {
        id: 'museum-tsunami',
        title: 'Museum Tsunami Aceh',
        subject: 'Fisika',
        grade: 'SMA',
        hotsLevel: 'C6',
        stimulus: 'Museum Tsunami Aceh dirancang menyerupai gelombang sekaligus berfungsi sebagai escape building saat bencana. Bangunan ini menjadi konteks pembelajaran tentang gelombang, energi gempa dan tsunami, serta pentingnya mitigasi bencana.',
        wordwallUrl: 'https://wordwall.net/resource/00000010/museum-tsunami',
        status: 'published',
        createdAt: '2026-07-12'
    },
    {
        id: 'kerajinan-anyaman',
        title: 'Kerajinan Anyaman Pandan',
        subject: 'Biologi',
        grade: 'SMP',
        hotsLevel: 'C4',
        stimulus: 'Daun pandan dikeringkan dan dianyam menjadi tikar serta kerajinan khas Aceh. Proses ini dapat dijadikan konteks pembelajaran struktur jaringan tumbuhan, serat alami, serta pemanfaatan sumber daya hayati secara berkelanjutan.',
        wordwallUrl: null,
        status: 'draft',
        createdAt: '2026-04-10'
    },
    {
        id: 'ulee-lheue',
        title: 'Ulee Lheue',
        subject: 'Fisika',
        grade: 'SMA',
        hotsLevel: 'C5',
        stimulus: 'Kawasan pesisir Ulee Lheue mengalami perubahan bentang alam akibat abrasi dan hantaman gelombang tsunami. Fenomena ini menjadi konteks pembelajaran tentang energi gelombang, tekanan air, dan upaya perlindungan garis pantai.',
        wordwallUrl: 'https://wordwall.net/resource/00000012/ulee-lheue',
        status: 'draft',
        createdAt: '2026-05-15'
    },
    {
        id: 'sungai-krueng-aceh',
        title: 'Sungai Krueng Aceh',
        subject: 'Kimia',
        grade: 'SMP',
        hotsLevel: 'C4',
        stimulus: 'Sungai Krueng Aceh menjadi sumber air sekaligus penerima limbah aktivitas warga di sekitarnya. Kondisi airnya dapat digunakan sebagai konteks pengujian pH, kekeruhan, serta dampak pencemaran terhadap kualitas air sungai.',
        wordwallUrl: null,
        status: 'draft',
        createdAt: '2026-04-25'
    },
    {
        id: 'padi-aceh',
        title: 'Padi Aceh',
        subject: 'Biologi',
        grade: 'SMP',
        hotsLevel: 'C4',
        stimulus: 'Sawah-sawah di Aceh menghasilkan padi sebagai sumber pangan utama masyarakat. Proses pertumbuhannya menjadi konteks nyata untuk membahas fotosintesis, faktor pertumbuhan tumbuhan, serta siklus air dalam pertanian.',
        wordwallUrl: 'https://wordwall.net/resource/00000014/padi-aceh',
        status: 'published',
        createdAt: '2026-05-08'
    },
    {
        id: 'air-terjun-suhom',
        title: 'Air Terjun Suhom',
        subject: 'Fisika',
        grade: 'SMA',
        hotsLevel: 'C5',
        stimulus: 'Air Terjun Suhom di Aceh Besar memiliki aliran air yang jatuh dari ketinggian cukup besar. Fenomena ini menjadi konteks pembelajaran perubahan energi potensial menjadi energi kinetik serta potensi pemanfaatannya sebagai sumber energi listrik.',
        wordwallUrl: null,
        status: 'draft',
        createdAt: '2026-06-10'
    }
];

/* --------------------------------------------------------------------------
   Persistence — there is no backend yet, so Create/Edit/Delete are persisted
   to localStorage instead of only living in memory. This is what makes CRUD
   survive navigating from bank-soal.html to detail-soal.html and back.
   When a real backend exists, every function below just becomes a fetch()
   call — callers already treat all of them as async.
   -------------------------------------------------------------------------- */
var STORAGE_KEY = 'sdtka:paketSoal';

function loadFromStorage() {
    try {
        var raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function saveToStorage(list) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
        // Storage unavailable (private mode / quota) — prototype falls back
        // to in-memory only for this session, which is an acceptable
        // degradation for a dummy-data demo.
    }
}

function getCurrentList() {
    var stored = loadFromStorage();
    return stored || paketSoalData;
}

/**
 * Future backend: replace the body with
 *   return fetch('/api/bank-soal').then(function (res) { return res.json(); });
 * Callers already treat this as async, so no other file needs to change.
 */
export function fetchPaketSoal() {
    return new Promise(function (resolve) {
        window.setTimeout(function () {
            resolve(getCurrentList());
        }, 700);
    });
}

/**
 * Future backend: replace the body with
 *   return fetch('/api/bank-soal/' + id).then(function (res) { return res.json(); });
 */
export function fetchPaketById(id) {
    return new Promise(function (resolve) {
        window.setTimeout(function () {
            var found = getCurrentList().filter(function (p) { return p.id === id; })[0];
            resolve(found || null);
        }, 300);
    });
}

/**
 * Create (no matching id) or update (matching id) a paket.
 * Future backend: replace the body with a POST/PUT request; callers already
 * await this, so no other file needs to change.
 */
export function savePaket(paket) {
    return new Promise(function (resolve) {
        var list = getCurrentList();
        var index = list.findIndex(function (p) { return p.id === paket.id; });
        var updated;
        if (index === -1) {
            updated = list.concat([paket]);
        } else {
            updated = list.slice();
            updated[index] = paket;
        }
        saveToStorage(updated);
        resolve(paket);
    });
}

/**
 * Future backend: replace the body with a DELETE request.
 */
export function deletePaket(id) {
    return new Promise(function (resolve) {
        var updated = getCurrentList().filter(function (p) { return p.id !== id; });
        saveToStorage(updated);
        resolve(updated);
    });
}
