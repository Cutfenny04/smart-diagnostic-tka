/* ==========================================================================
   ZUMA ENGINE CONFIGURATION — BUDAYA ACEH THEME
   Seluruh parameter gameplay, warna 3D jewel, koordinat jalur, dan
   checkpoint refleksi dikelola di sini.
   ========================================================================== */

export const ZUMA_CONFIG = {
  width: 1200,
  height: 800,
  scale: 0.75,

  // Koordinat peluncur di tengah mandala ornamen Aceh
  playerPos: { x: 550, y: 400 },

  // Jalur SVG kurva spiral klasik Zuma
  path: `M197.519,19.289C158.282,84.171,101.52,201.053,92.5,345.418c-6.6,105.632,47,236.043,159,295.679
		s338.566,101.881,547,64.404c199-35.781,312.016-164.676,313-266c1-103-34-221.816-200-278.044
		c-142.542-48.282-346.846-37.455-471,31.044c-116,64-154.263,213.533-81,304.619c92,114.381,410,116.381,476,2.891
		c62.975-108.289-40-203.51-158-206.51`,

  // Jumlah kelereng total & kelereng awal
  allMarbleLength: 80,
  initMarbleLength: 20,
  marbleSize: 60,

  // Kecepatan gerak
  baseSpeed: 4,
  shootSpeed: 30,

  // 5 Warna Permata Kerajaan Aceh (Dark 3D Jewel)
  // Base color dipakai untuk identifikasi matching di engine
  colors: [
    '#8B1E2D', // Deep Maroon
    '#D49B2A', // Dark Amber Gold
    '#1B4D3E', // Deep Forest Green
    '#105666', // Deep Midnight Teal
    '#5E2750', // Dark Bungong Purple
  ],

  // Detail render 3D jewel tiap warna (gradien specular & shadow)
  jewelStyles: {
    '#8B1E2D': {
      name: 'Maroon Mirah Aceh',
      highlight: '#FF6B7A',
      mid: '#A62438',
      dark: '#4A0B14',
      glow: 'rgba(178, 43, 62, 0.4)',
    },
    '#D49B2A': {
      name: 'Emas Meukuta',
      highlight: '#FFE082',
      mid: '#E0A838',
      dark: '#66460A',
      glow: 'rgba(224, 168, 56, 0.4)',
    },
    '#1B4D3E': {
      name: 'Zamrud Tropis',
      highlight: '#52C79E',
      mid: '#236954',
      dark: '#0A241C',
      glow: 'rgba(35, 105, 84, 0.4)',
    },
    '#105666': {
      name: 'Nilam Samudra',
      highlight: '#48BBD4',
      mid: '#146E82',
      dark: '#062932',
      glow: 'rgba(20, 110, 130, 0.4)',
    },
    '#5E2750': {
      name: 'Kecubung Jeumpa',
      highlight: '#B862A3',
      mid: '#733162',
      dark: '#2E0F27',
      glow: 'rgba(115, 49, 98, 0.4)',
    },
  },

  // Checkpoint refleksi budaya (konfigural berdasarkan rasio kelereng yang dibersihkan)
  reflectionPoints: [
    { id: 'rumoh-aceh', progress: 0.35 },
    { id: 'kearifan-alam', progress: 0.70 },
  ],

  // Skor arcade untuk feedback bermain
  scoreRules: {
    matchBase: 10,
    comboMultiplier: 20,
    chainBonus: 30,
    holePenalty: 5,
  },
};
