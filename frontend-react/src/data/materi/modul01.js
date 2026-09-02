export const modul01 = {
  id: 1,
  number: '01',
  title: 'Urgensi Transformasi Asesmen IPA',
  desc: 'Memahami alasan pentingnya transformasi asesmen IPA dan fungsi asesmen sebagai dasar perbaikan pembelajaran.',
  category: 'hots',
  duration: '30 menit',
  pdfUrl: '/pdf/bahan-tayang-pelatihan.pdf',
  learningObjective: 'Setelah menyelesaikan materi ini, guru diharapkan memahami pentingnya transformasi asesmen IPA dari sekadar evaluasi hasil belajar akhir (testing) menjadi asesmen diagnostik cerdas yang memetakan profil penguasaan kompetensi dan kebutuhan belajar siswa.',
  quote: {
    text: 'Asesmen bukan hanya untuk mengetahui berapa nilai siswa, tetapi untuk mengetahui apa yang sudah dikuasai dan apa yang masih perlu diperbaiki.',
    author: 'Prinsip Smart Diagnostic Assessment',
  },
  sections: [
    {
      id: 'urgensi-transformasi',
      title: 'Mengapa Asesmen IPA Perlu Bertransformasi?',
      lead: 'Selama ini, asesmen pembelajaran IPA sering kali terbatas pada perolehan skor angka murni tanpa memberikan gambaran mendalam mengenai letak miskonsepsi atau kelemahan spesifik siswa. Transformasi menuju Smart Diagnostic Assessment mengubah paradigma tersebut.',
      comparison: {
        title: 'Perbandingan Asesmen Konvensional vs Smart Diagnostic',
        rows: [
          { aspect: 'Format & Pengelolaan', conventional: 'Manual berbasis kertas', smart: 'Digital interaktif & otomatis' },
          { aspect: 'Fokus Penilaian', conventional: 'Fokus pada skor / nilai akhir', smart: 'Fokus pada profil kompetensi & pemahaman' },
          { aspect: 'Karakteristik Soal', conventional: 'Soal generik & berbasis hafalan', smart: 'Soal kontekstual berbasis fenomena nyata' },
          { aspect: 'Tipe Informasi', conventional: 'Hanya angka hasil akhir (skor)', smart: 'Informasi diagnostik kekuatan & kelemahan' },
          { aspect: 'Daya Adaptasi', conventional: 'Statis & tidak adaptif', smart: 'Berbasis data & terukur real-time' },
          { aspect: 'Keterlibatan Siswa', conventional: 'Cenderung monoton & pasif', smart: 'Interaktif & memotivasi (gamifikasi)' },
          { aspect: 'Analisis Hasil', conventional: 'Sulit dan memakan waktu dianalisis', smart: 'Data mudah dipetakan per indikator' },
        ],
      },
    },
    {
      id: 'tiga-fungsi-asesmen',
      title: 'Dari "Testing" ke Diagnostic Assessment',
      lead: 'Asesmen dalam pembelajaran memiliki tiga fungsi utama yang harus diterapkan secara seimbang:',
      functions: [
        {
          num: '01',
          name: 'Assessment of Learning',
          desc: 'Asesmen yang dilakukan pada akhir unit pembelajaran untuk mengetahui capaian hasil belajar siswa secara sumatif.',
        },
        {
          num: '02',
          name: 'Assessment for Learning',
          desc: 'Asesmen formatif berkelanjutan yang memberikan umpan balik informasi diagnostik bagi guru dan siswa untuk memperbaiki proses pembelajaran.',
        },
        {
          num: '03',
          name: 'Assessment as Learning',
          desc: 'Asesmen yang melibatkan siswa secara aktif dalam proses refleksi, evaluasi diri, dan memahami cara belajarnya sendiri.',
        },
      ],
      keyTakeaway: 'Smart Diagnostic Assessment secara khusus mengarah pada penggunaan hasil asesmen (Assessment for & as Learning) untuk mendeteksi kebutuhan belajar individual siswa secara presisi.',
    },
  ],
  contextualExample: {
    badge: 'Contoh Kontekstual Pembelajaran (Kearifan Lokal Aceh)',
    title: 'Transformasi Soal: Ekosistem Pesisir & Hutan Bakau Aceh',
    conventionalExample: {
      label: 'Bentuk Soal Konvensional (Testing Murni):',
      text: '"Sebutkan 3 jenis pohon bakau yang umum dijumpai di kawasan pesisir Aceh!" (Hanya menguji hafalan nama taksonomi).',
    },
    diagnosticExample: {
      label: 'Bentuk Soal Smart Diagnostic (Kontekstual & Diagnostik):',
      text: '"Disajikan grafik salinitas dan sedimentasi di muara Krueng Aceh, siswa diminta menganalisis faktor penyebab penurunan populasi kepiting bakau dan merumuskan langkah restorasi vegetasi pantai yang tepat." (Mengukur analisis kausalitas & diagnostik penalaran ilmiah).',
    },
  },
  reflectionChecklist: [
    {
      id: 'ref_01_1',
      text: 'Saya memahami perbedaan mendasar antara testing angka konvensional dan asesmen diagnostik profil kompetensi.',
    },
    {
      id: 'ref_01_2',
      text: 'Saya dapat membedakan 3 fungsi asesmen (of learning, for learning, as learning) dalam pembelajaran IPA.',
    },
    {
      id: 'ref_01_3',
      text: 'Saya siap merancang asesmen yang berorientasi pada pemetaan diagnostik kebutuhan belajar siswa.',
    },
  ],
  nextAction: {
    label: 'Lanjut ke Modul 02: Memahami HOTS & Smart Diagnostic',
    href: '/materi/2',
    type: 'next_module',
  },
};
