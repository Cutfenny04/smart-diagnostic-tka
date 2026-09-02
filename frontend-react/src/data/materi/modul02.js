export const modul02 = {
  id: 2,
  number: '02',
  title: 'Memahami HOTS dan Smart Diagnostic',
  desc: 'Mengidentifikasi konsep HOTS sebagai proses berpikir kompleks serta tangga kognitif LOTS-MOTS-HOTS pada pembelajaran IPA.',
  category: 'hots',
  duration: '45 menit',
  pdfUrl: '/pdf/bahan-tayang-pelatihan.pdf',
  learningObjective: 'Guru mampu memahami hakikat HOTS sebagai proses berpikir tingkat tinggi (bukan sekadar soal sulit), mengidentifikasi 6 dimensi kemampuan berpikir HOTS, serta membedakan tingkatan kognitif LOTS, MOTS, dan HOTS dalam materi IPA.',
  quote: {
    text: 'HOTS bukan sekadar "soal sulit", tetapi berkaitan dengan proses berpikir yang kompleks.',
    author: 'Konsep Dasar HOTS dalam IPA',
  },
  sections: [
    {
      id: 'apa-itu-hots',
      title: 'Apa Itu HOTS? (HOTS ≠ Sulit)',
      lead: 'Soal sulit belum tentu HOTS (misalnya soal dengan rumus rumit dan angka desimal panjang yang hanya menguji keterampilan hitung hafalan). Sebaliknya, HOTS adalah kemampuan menggunakan pengetahuan dalam situasi nyata yang membutuhkan:',
      dimensions: [
        {
          num: '1',
          name: 'ANALISIS',
          desc: 'Mengurai informasi utuh menjadi bagian-bagian terperinci dan memahami hubungan antar-variabel.',
          icon: 'Network',
        },
        {
          num: '2',
          name: 'EVALUASI',
          desc: 'Menilai informasi, argumen, validitas metode, atau solusi berdasarkan kriteria tertentu.',
          icon: 'CheckSquare',
        },
        {
          num: '3',
          name: 'KREASI',
          desc: 'Menghasilkan gagasan, hipotesis, desain, atau solusi baru yang orisinal dan bermakna.',
          icon: 'Lightbulb',
        },
        {
          num: '4',
          name: 'PENALARAN',
          desc: 'Menggunakan logika deduktif/induktif dan bukti empiris untuk menarik kesimpulan yang tepat.',
          icon: 'BrainCircuit',
        },
        {
          num: '5',
          name: 'PEMECAHAN MASALAH',
          desc: 'Mengidentifikasi akar masalah, merancang strategi langkah, dan menemukan solusi yang efektif.',
          icon: 'Puzzle',
        },
        {
          num: '6',
          name: 'PENGAMBILAN KEPUTUSAN',
          desc: 'Memilih tindakan terbaik berdasarkan perbandingan informasi, alternatif, dan konsekuensinya.',
          icon: 'Scale',
        },
      ],
    },
    {
      id: 'tangga-kognitif',
      title: 'Tangga Kognitif dalam Pembelajaran IPA: LOTS, MOTS, HOTS',
      lead: 'Proses berpikir kognitif berkembang secara berjenjang dari tingkat dasar hingga tingkat tinggi:',
      cognitiveLevels: [
        {
          tier: 'LOTS (Low Order Thinking Skills)',
          levels: 'C1 (Remember) & C2 (Understand)',
          desc: 'Fokus pada mengingat fakta, istilah, definisi, serta memahami makna informasi awal.',
        },
        {
          tier: 'MOTS (Medium Order Thinking Skills)',
          levels: 'C3 (Apply)',
          desc: 'Menggunakan rumus, prosedur, atau konsep yang telah dipelajari pada situasi/soal standar.',
        },
        {
          tier: 'HOTS (Higher Order Thinking Skills)',
          levels: 'C4 (Analyze), C5 (Evaluate), C6 (Create)',
          desc: 'Menganalisis fenomena baru, mengevaluasi efektivitas solusi, dan merancang inovasi pemecahan masalah.',
        },
      ],
    },
    {
      id: 'contoh-penerapan-tekanan',
      title: 'Contoh Penerapan Tangga Kognitif pada Topik: TEKANAN',
      lead: 'Mari kita lihat bagaimana satu topik materi IPA (Tekanan Zat Padat) dapat dirumuskan dari level C1 hingga C6:',
      stairsTable: [
        {
          level: 'C1 (Remember)',
          category: 'LOTS',
          question: 'Apa satuan internasional dari tekanan?',
          type: 'Mengingat definisi / fakta',
        },
        {
          level: 'C2 (Understand)',
          category: 'LOTS',
          question: 'Jelaskan bagaimana hubungan antara gaya tekan dengan luas bidang tekan terhadap besarnya tekanan.',
          type: 'Memahami prinsip hubungan konsep',
        },
        {
          level: 'C3 (Apply)',
          category: 'MOTS',
          question: 'Hitunglah tekanan yang dihasilkan oleh sebuah balok bermassa dengan gaya F = 200 N dan luas bidang sentuh A = 0,04 m².',
          type: 'Menerapkan rumus matematika standar',
        },
        {
          level: 'C4 (Analyze)',
          category: 'HOTS',
          question: 'Analisis mengapa sepatu untuk berjalan di atas salju atau rawa berlumpur dirancang dengan sol yang sangat lebar.',
          type: 'Menganalisis hubungan variabel luas & tekanan pada fenomena',
        },
        {
          level: 'C5 (Evaluate)',
          category: 'HOTS',
          question: 'Berdasarkan kondisi tanah berlumpur di areal persawahan basah, evaluasi efektivitas penggunaan sepatu bot berhak runcing dibandingkan sepatu bot beralas lebar.',
          type: 'Mengevaluasi kesesuaian solusi terhadap kondisi lingkungan',
        },
        {
          level: 'C6 (Create)',
          category: 'HOTS',
          question: 'Rancanglah modifikasi alas sepatu berbahan bambu/kayu lokal agar petani dapat berjalan di atas lumpur sawah tanpa terperosok dengan meminimalkan tekanan ke permukaan.',
          type: 'Merancang desain / solusi baru berbasis konsep tekanan',
        },
      ],
    },
  ],
  contextualExample: {
    badge: 'Contoh Kontekstual Pembelajaran (Kearifan Lokal Aceh)',
    title: 'Penerapan Konsep Fisika: Stabilitas Perahu Boat Nelayan di Lampulo',
    description: 'Pada materi gaya apung dan tekanan hidrostatis, guru dapat mengangkat fenomena bentuk lambung perahu nelayan tradisional di Pelabuhan Lampulo Banda Aceh. Siswa diajak menganalisis (C4) mengapa dasar perahu dirancang dengan bentuk tertentu untuk membagi tekanan air dan menjaga keseimbangan saat menghadapi gelombang laut Selat Malaka.',
  },
  reflectionChecklist: [
    {
      id: 'ref_02_1',
      text: 'Saya memahami bahwa HOTS menekankan penalaran dan pengolahan informasi, bukan hafalan rumus rumit.',
    },
    {
      id: 'ref_02_2',
      text: 'Saya dapat membedakan 6 dimensi kemampuan berpikir tingkat tinggi dalam konteks IPA.',
    },
    {
      id: 'ref_02_3',
      text: 'Saya mampu membedakan tingkat kognitif LOTS (C1-C2), MOTS (C3), dan HOTS (C4-C6) pada satu topik IPA.',
    },
  ],
  nextAction: {
    label: 'Lanjut ke Modul 03: TKA dan HOTS',
    href: '/materi/3',
    type: 'next_module',
  },
};
