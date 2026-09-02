export const modul04 = {
  id: 4,
  number: '04',
  title: 'Menyusun Instrumen HOTS IPA',
  desc: 'Panduan langkah demi langkah menyusun indikator soal ABCD dan menentukan level kognitif Taksonomi Bloom Revisi C4–C6.',
  category: 'soal',
  duration: '50 menit',
  pdfUrl: '/pdf/bahan-tayang-pelatihan.pdf',
  learningObjective: 'Guru mampu merumuskan indikator soal HOTS dengan kaidah ABCD (Audience, Behavior, Condition, Degree) dan memilih Kata Kerja Operasional (KKO) Taksonomi Bloom Revisi C4–C6 yang terukur dan aplikatif pada mata pelajaran IPA.',
  quote: {
    text: 'Tujuan utama asesmen bukan hanya mencari jawaban benar, tetapi melihat bagaimana siswa berpikir.',
    author: 'Prinsip Taksonomi Bloom Revisi',
  },
  sections: [
    {
      id: 'taksonomi-bloom-revisi',
      title: 'Taksonomi Bloom Revisi: Kerangka Kognitif Perancangan Asesmen',
      lead: 'Taksonomi Bloom Revisi membagi domain kognitif menjadi 6 tingkatan, dengan fokus utama HOTS pada level C4 hingga C6:',
      levels: [
        {
          code: 'C1',
          name: 'Remember (Mengingat)',
          desc: 'Mengambil pengetahuan yang relevan dari memori jangka panjang.',
          kko: 'Menyebutkan, mengenali, mengingat, menuliskan, mendaftar, mengidentifikasi.',
          tier: 'LOTS (Tingkat Dasar)',
        },
        {
          code: 'C2',
          name: 'Understand (Memahami)',
          desc: 'Membangun makna dari informasi lisan, tulisan, dan grafik.',
          kko: 'Menjelaskan, meringkas, menginterpretasikan, memberi contoh, mengklasifikasi.',
          tier: 'LOTS (Tingkat Dasar)',
        },
        {
          code: 'C3',
          name: 'Apply (Menerapkan)',
          desc: 'Menggunakan prosedur atau konsep dalam situasi atau konteks baru.',
          kko: 'Menghitung, menggunakan, menyelesaikan, menerapkan, mendemonstrasikan.',
          tier: 'MOTS (Tingkat Menengah)',
        },
        {
          code: 'C4',
          name: 'Analyze (Menganalisis)',
          desc: 'Memecah informasi menjadi bagian-bagian dan memahami hubungannya.',
          kko: 'Menganalisis, membandingkan, memilah, menguji, menghubungkan, membedakan.',
          tier: 'HOTS (Tingkat Tinggi)',
        },
        {
          code: 'C5',
          name: 'Evaluate (Mengevaluasi)',
          desc: 'Membuat penilaian berdasarkan kriteria, standar, dan bukti empiris.',
          kko: 'Menilai, mengevaluasi, memutuskan, mengkritisi, memprioritaskan, membuktikan.',
          tier: 'HOTS (Tingkat Tinggi)',
        },
        {
          code: 'C6',
          name: 'Create (Mencipta)',
          desc: 'Menggabungkan elemen untuk membentuk struktur, gagasan, atau solusi baru.',
          kko: 'Merancang, membuat, menyusun, mengembangkan, memformulasi hipotesis, mendesain.',
          tier: 'HOTS (Tingkat Tinggi)',
        },
      ],
      warningBox: {
        title: 'PENTING!',
        text: 'Kata kerja operasional saja tidak otomatis membuat soal menjadi HOTS. Karakter HOTS ditentukan oleh kedalaman tuntutan proses berpikir dan kompleksitas masalah yang diberikan pada stimulus!',
      },
    },
    {
      id: 'langkah-1-indikator-abcd',
      title: 'Langkah 1: Menentukan Indikator Soal (Kaidah A-B-C-D)',
      lead: 'Indikator soal yang baik dan terukur harus memuat empat komponen pokok:',
      abcdComponents: [
        {
          key: 'Condition (C)',
          name: 'Kondisi / Stimulus',
          desc: 'Keadaan, konteks, stimulus, atau media data yang disediakan bagi siswa saat mengerjakan soal.',
        },
        {
          key: 'Audience (A)',
          name: 'Sasaran Peserta Didik',
          desc: 'Subjek yang dinilai (misalnya: "siswa", "peserta didik kelas VIII").',
        },
        {
          key: 'Behavior (B)',
          name: 'Perilaku Penalaran',
          desc: 'Kemampuan berpikir terukur (menggunakan KKO level C4–C6) yang diharapkan ditunjukkan siswa.',
        },
        {
          key: 'Degree (D)',
          name: 'Tingkat Akurasi / Kriteria',
          desc: 'Tingkat keberhasilan, batasan kebenaran, atau standar kedalaman jawaban.',
        },
      ],
      indicatorExample: {
        subject: 'Contoh Formulir Indikator (Materi IPA: Perpindahan Kalor)',
        text: '"Disajikan fenomena perpindahan kalor pada kehidupan sehari-hari [Condition], siswa [Audience] mampu menganalisis mekanisme perpindahan kalor [Behavior] berdasarkan karakteristik medium dan proses transfer energi [Degree]."',
      },
    },
    {
      id: 'langkah-2-level-kognitif',
      title: 'Langkah 2: Menentukan Level Kognitif & KKO IPA',
      lead: 'Panduan matriks pemilihan KKO dan penentuan kategori asesmen:',
      kkoTable: [
        { level: 'C1', ability: 'Mengingat', kko: 'Menyebutkan, mengenali, mendaftar rumus/definisi', category: 'LOTS' },
        { level: 'C2', ability: 'Memahami', kko: 'Menjelaskan, mengartikan, mengidentifikasi contoh', category: 'LOTS' },
        { level: 'C3', ability: 'Menerapkan', kko: 'Menggunakan konsep, menghitung nilai dengan rumus', category: 'MOTS' },
        { level: 'C4', ability: 'Menganalisis', kko: 'Membandingkan, menentukan hubungan, memecah variabel', category: 'HOTS' },
        { level: 'C5', ability: 'Mengevaluasi', kko: 'Menilai suatu solusi, mengkritisi hasil eksperimen', category: 'HOTS' },
        { level: 'C6', ability: 'Mencipta', kko: 'Merancang solusi, memformulasi hipotesis baru', category: 'HOTS' },
      ],
    },
  ],
  contextualExample: {
    badge: 'Contoh Kontekstual Pembelajaran (Kearifan Lokal Aceh)',
    title: 'Perumusan Indikator ABCD: Proses Pembuatan Garam Tradisional di Pesisir Aceh',
    description: 'Contoh rumusan indikator: "Disajikan data suhu, luas permukaan tambak, dan waktu pengkristalan pada proses pembuatan garam tradisional di pesisir Aceh Besar [Condition], siswa kelas VIII [Audience] mampu mengevaluasi faktor yang paling memengaruhi laju evaporasi air laut [Behavior] berdasarkan konsep termodinamika secara tepat [Degree]."',
  },
  reflectionChecklist: [
    {
      id: 'ref_04_1',
      text: 'Indikator soal yang saya susun telah memuat lengkap keempat komponen ABCD (Audience, Behavior, Condition, Degree).',
    },
    {
      id: 'ref_04_2',
      text: 'Saya menggunakan Kata Kerja Operasional (KKO) C4–C6 yang benar-benar menuntut penalaran kritis, bukan sekadar hafalan.',
    },
    {
      id: 'ref_04_3',
      text: 'Saya memahami bahwa HOTS ditentukan oleh kompleksitas masalah pada stimulus, bukan semata-mata pilihan kata kerja.',
    },
  ],
  nextAction: {
    label: 'Lanjut ke Modul 05: Menyusun Stimulus HOTS Berkualitas',
    href: '/materi/5',
    type: 'next_module',
  },
};
