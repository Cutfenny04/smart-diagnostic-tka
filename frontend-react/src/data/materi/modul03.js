export const modul03 = {
  id: 3,
  number: '03',
  title: 'TKA dan HOTS',
  desc: 'Memahami konsep Tes Kemampuan Akademik (TKA), karakteristik instrumen, dan integrasi HOTS dalam penilaian terstandar.',
  category: 'soal',
  duration: '40 menit',
  pdfUrl: '/assets/modul/modul-pelatihan-hots-ipa.pdf',
  learningObjective: 'Guru memahami hakikat Tes Kemampuan Akademik (TKA), 4 tujuan utama pelaksanaan TKA, karakteristik soal TKA berbasis mata pelajaran, serta bagaimana TKA dirancang berbasis HOTS untuk mengukur penguasaan kurikulum IPA.',
  quote: {
    text: 'TKA adalah asesmen terstandar untuk memperoleh informasi tentang capaian kemampuan akademik murid pada mata pelajaran tertentu secara objektif dan adil.',
    author: 'Definisi Tes Kemampuan Akademik',
  },
  sections: [
    {
      id: 'tujuan-tka',
      title: '1. Tujuan Tes Kemampuan Akademik (TKA)',
      lead: 'TKA dirancang untuk melengkapi penilaian guru dengan standar pengukuran yang objektif, memiliki 4 tujuan utama:',
      goals: [
        {
          num: '01',
          title: 'Memberikan Informasi Capaian Terstandar',
          desc: 'Menghasilkan tolok ukur capaian kemampuan akademik siswa yang dapat dibandingkan secara objektif.',
        },
        {
          num: '02',
          title: 'Mendukung Seleksi & Pemetaan Akademik',
          desc: 'Menyediakan data pendukung yang valid untuk program pembinaan prestasi dan seleksi akademik.',
        },
        {
          num: '03',
          title: 'Memetakan Kekuatan & Kelemahan Siswa',
          desc: 'Memberikan informasi diagnostik mengenai konsep-konsep IPA mana yang telah dikuasai dan yang masih membutuhkan remediasi.',
        },
        {
          num: '04',
          title: 'Mendorong Peningkatan Kualitas Penilaian',
          desc: 'Memfasilitasi guru untuk terus meningkatkan standar penulisan butir instrumen evaluasi di sekolah.',
        },
      ],
    },
    {
      id: 'karakteristik-soal-tka',
      title: '2. Karakteristik Soal TKA',
      lead: 'Soal TKA memiliki karakteristik khusus yang membedakannya dari tes ulangan harian biasa:',
      characteristics: [
        'Berbasis kompetensi mata pelajaran IPA sesuai capaian kurikulum.',
        'Menggunakan stimulus kontekstual dan data yang bermakna.',
        'Tidak hanya mengandalkan daya ingat hafalan teori.',
        'Menekankan proses penalaran ilmiah dan pemecahan masalah.',
        'Mengukur kemampuan mentransfer pengetahuan dalam situasi baru.',
      ],
      quoteNotice: 'TKA bukan sekadar "mengingat apa yang dipelajari", tetapi bagaimana pengetahuan tersebut digunakan untuk memahami dan menyelesaikan masalah nyata.',
    },
    {
      id: 'alur-kemampuan-diukur',
      title: '3. Alur Kemampuan yang Diukur dalam TKA',
      lead: 'TKA mengukur spektrum kognitif secara berkesinambungan:',
      flowSteps: [
        { step: '1', title: 'Memahami', desc: 'Mengenali konsep dasar IPA yang relevan dari stimulus' },
        { step: '2', title: 'Menerapkan', desc: 'Menggunakan prinsip ilmiah untuk mengkaji konteks permasalahan' },
        { step: '3', title: 'Menalar', desc: 'Menghubungkan pola, logika sebab-akibat, dan bukti ilmiah' },
        { step: '4', title: 'Menganalisis', desc: 'Membedah variabel data untuk menemukan anomali atau kesimpulan' },
        { step: '5', title: 'Memecahkan Masalah', desc: 'Merumuskan solusi, evaluasi, atau rekomendasi tindakan ilmiah' },
      ],
      scopeNote: 'Penting: Kemampuan tersebut tetap mengacu pada kompetensi mata pelajaran IPA sesuai kurikulum, bukan literasi/numerasi umum yang bersifat lepas dari materi kurikuler.',
    },
    {
      id: 'perbandingan-hafalan-vs-hots',
      title: 'Perbandingan Soal: Bukan Sekadar Hafalan vs Berbasis HOTS',
      lead: 'TKA menggeser fokus penilaian ke ranah berpikir tingkat tinggi:',
      comparison: [
        {
          type: 'Bukan Sekadar Hafalan (C1–C2)',
          points: [
            'Mengingat fakta dan definisi istilah',
            'Menyebutkan informasi yang langsung tertulis',
            'Mengikuti prosedur baku tanpa variasi',
            'Jawaban tunggal dan bersifat langsung',
            'Konteks terbatas pada buku teks',
          ],
        },
        {
          type: 'Berbasis HOTS (C3–C6)',
          points: [
            'Menganalisis dan mengolah informasi stimulus',
            'Mengevaluasi serta menilai bukti/solusi',
            'Menalar dan menghubungkan lintas konsep IPA',
            'Memecahkan masalah kontekstual',
            'Konteks nyata, kaya data, dan beragam',
            'Jawaban memerlukan penalaran bertahap',
          ],
        },
      ],
    },
  ],
  contextualExample: {
    badge: 'Contoh Kontekstual Pembelajaran (Kearifan Lokal Aceh)',
    title: 'Penerapan TKA Biologi: Konservasi Kawasan Ekosistem Leuser (KEL)',
    description: 'Alih-alih menanyakan nama latin satwa langka, soal TKA menyajikan data laju deforestasi dan perubahan tutupan lahan di sekitar Taman Nasional Gunung Leuser. Siswa diminta menganalisis dampak fragmentasi habitat terhadap persebaran populasi gajah sumatera dan merumuskan prioritas koridor konservasi yang paling efektif (C4–C5).',
  },
  reflectionChecklist: [
    {
      id: 'ref_03_1',
      text: 'Saya memahami 4 tujuan utama pelaksanaan Tes Kemampuan Akademik (TKA).',
    },
    {
      id: 'ref_03_2',
      text: 'Saya memahami bahwa instrumen TKA mengukur kompetensi spesifik mata pelajaran IPA secara mendalam.',
    },
    {
      id: 'ref_03_3',
      text: 'Saya dapat membedakan soal hafalan dengan soal TKA yang dirancang berbasis penalaran HOTS.',
    },
  ],
  nextAction: {
    label: 'Lanjut ke Modul 04: Menyusun Instrumen HOTS IPA',
    href: '/materi/4',
    type: 'next_module',
  },
};
