-- SQL Migration: 5 Modul Materi Utama Pelatihan Resmi
-- "Pelatihan Penyusunan Instrumen HOTS IPA Berbasis Smart Diagnostic TKA Terintegrasi Game Digital Budaya Aceh di SMPN 3 Ingin Jaya"
-- Jalankan di SQL Editor Supabase Anda.

BEGIN;

-- Upsert 5 materi pelatihan utama resmi
INSERT INTO materi (id, title, deskripsi, category, duration, materi_count, konten_url, created_at) VALUES
(
    1,
    'Urgensi Transformasi Asesmen IPA',
    'Memahami alasan pentingnya transformasi asesmen IPA dan fungsi asesmen sebagai dasar perbaikan pembelajaran.',
    'hots',
    '30 menit',
    2,
    '/pdf/bahan-tayang-pelatihan.pdf',
    '2026-08-01 08:00:00'
),
(
    2,
    'Memahami HOTS dan Smart Diagnostic',
    'Mengidentifikasi konsep HOTS sebagai proses berpikir kompleks serta tangga kognitif LOTS-MOTS-HOTS pada pembelajaran IPA.',
    'hots',
    '45 menit',
    3,
    '/pdf/bahan-tayang-pelatihan.pdf',
    '2026-08-01 08:30:00'
),
(
    3,
    'TKA dan HOTS',
    'Memahami konsep Tes Kemampuan Akademik (TKA), karakteristik instrumen, dan integrasi HOTS dalam penilaian terstandar.',
    'soal',
    '40 menit',
    3,
    '/pdf/bahan-tayang-pelatihan.pdf',
    '2026-08-01 09:00:00'
),
(
    4,
    'Menyusun Instrumen HOTS IPA',
    'Panduan langkah demi langkah menyusun indikator soal ABCD dan menentukan level kognitif Taksonomi Bloom Revisi C4–C6.',
    'soal',
    '50 menit',
    3,
    '/pdf/bahan-tayang-pelatihan.pdf',
    '2026-08-01 09:30:00'
),
(
    5,
    'Menyusun Stimulus HOTS Berkualitas',
    'Mengembangkan 9 bentuk stimulus kontekstual dan menerapkan 4 prinsip kunci stimulus untuk pembuatan game Wordwall dan Bank Soal.',
    'budaya',
    '45 menit',
    4,
    '/pdf/bahan-tayang-pelatihan.pdf',
    '2026-08-01 10:00:00'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  deskripsi = EXCLUDED.deskripsi,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration,
  materi_count = EXCLUDED.materi_count,
  konten_url = EXCLUDED.konten_url;

-- Selaraskan sequence autoincrement ID
SELECT setval(pg_get_serial_sequence('materi', 'id'), (SELECT MAX(id) FROM materi));

COMMIT;
