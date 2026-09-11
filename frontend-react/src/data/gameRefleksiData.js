/* ==========================================================================
   GAME REFLEKSI BUDAYA ACEH — REFLECTION CONTENT DATA
   Terpisah dari logic Zuma Engine agar konten narasi & refleksi budaya
   dapat disesuaikan secara dinamis tanpa mengubah engine game.
   ========================================================================== */

export const REFLECTION_POINTS = [
  {
    id: 'rumoh-aceh',
    progress: 0.35, // Terpicu ketika progress permainan mencapai ~35%
    checkpointLabel: 'Titik Singgah 1: Arsitektur & Lingkungan',
    title: 'Keharmonisan Rumoh Aceh',
    context: 'Rumoh Aceh dirancang panggung tahan gempa dan banjir, dibangun selaras dengan arah kiblat dan angin tropis.',
    question: 'Apa yang paling menarik perhatianmu dari kearifan lingkungan tradisional ini?',
    options: [
      { id: 'opt-1', label: 'Ketahanan & adaptasi terhadap alam sekitar' },
      { id: 'opt-2', label: 'Nilai kebersamaan saat gotong royong mendirikan rumah' },
      { id: 'opt-3', label: 'Simbolisme spiritual dan arah tata ruang yang tertib' },
      { id: 'opt-4', label: 'Keindahan seni ukir dan detail ornamen kayu' },
    ],
    appreciation: 'Refleksi yang mendalam! Mari lanjutkan perjalanan menjelajahi keindahan budaya Aceh.',
  },
  {
    id: 'kearifan-alam',
    progress: 0.70, // Terpicu ketika progress permainan mencapai ~70%
    checkpointLabel: 'Titik Singgah 2: Kearifan Tradisi & Nilai',
    title: 'Semangat Meuradab & Kebersamaan',
    context: 'Masyarakat Aceh menjunjung tinggi nilai persaudaraan, ketekunan, dan rasa hormat pada sesama serta alam semesta.',
    question: 'Nilai luhur apa yang paling kamu rasakan memberi inspirasi dalam perjalanan hari ini?',
    options: [
      { id: 'opt-1', label: 'Ketekunan dan kesabaran menghadapi tantangan' },
      { id: 'opt-2', label: 'Semangat gotong royong dan saling menguatkan' },
      { id: 'opt-3', label: 'Rasa syukur dan keheningan hati' },
      { id: 'opt-4', label: 'Penghormatan terhadap warisan leluhur' },
    ],
    appreciation: 'Nilai yang sangat menginspirasi! Satu langkah lagi menuju puncak perjalanan Jelajah Aceh.',
  },
];
