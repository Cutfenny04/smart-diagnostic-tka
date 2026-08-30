-- SQL Migration: Menambahkan materi pelatihan penyusunan instrumen HOTS IPA SMPN 3 Ingin Jaya
-- Jalankan ini di SQL Editor Supabase Anda.

INSERT INTO materi (id, title, deskripsi, category, duration, materi_count, konten_url, created_at)
VALUES (
    4, 
    'Penyusunan Instrumen HOTS IPA (SMPN 3 Ingin Jaya)', 
    'Materi pelatihan penyusunan instrumen HOTS IPA berbasis Smart Diagnostic TKA terintegrasi game digital budaya Aceh di SMP Negeri 3 Ingin Jaya.', 
    'soal', 
    '45 menit', 
    1, 
    '/assets/modul/modul-pelatihan-hots-ipa.pdf', 
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  deskripsi = EXCLUDED.deskripsi,
  category = EXCLUDED.category,
  duration = EXCLUDED.duration,
  materi_count = EXCLUDED.materi_count,
  konten_url = EXCLUDED.konten_url;

-- Menyelaraskan sequence autoincrement ID setelah insert manual
SELECT setval(pg_get_serial_sequence('materi', 'id'), (SELECT MAX(id) FROM materi));
