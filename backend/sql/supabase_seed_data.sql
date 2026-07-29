-- Migrasi data dari guru_aceh_db.sql (dump MariaDB lokal) ke Supabase.
-- Jalankan SETELAH supabase_schema.sql berhasil dijalankan.
--
-- Catatan: paket_soal di dump lama belum punya kolom `slug`, jadi slug di
-- bawah ini dibuat manual mengikuti fungsi toSlug() di
-- backend/controllers/bank-soal.controller.js (lowercase, spasi -> "-").
-- Tabel progress_materi tidak disertakan karena di dump lama datanya kosong.

INSERT INTO guru (id, nama, email, password_hash, created_at) VALUES
(1, 'Budi Santoso', 'budi@sekolah.sch.id', '$2b$10$APK5Uwb3XW/9v2DbQW4VLuypcvdQKKoCkeRCR5ORLlJT850Lao5KG', '2026-07-26 15:44:21');

INSERT INTO materi (id, title, deskripsi, category, duration, materi_count, konten_url, created_at) VALUES
(1, 'Pengenalan Budaya Aceh dalam Pembelajaran', 'Modul dasar mengenal kearifan lokal Aceh untuk konteks pembelajaran IPA.', 'budaya', '45 menit', 4, NULL, '2026-07-27 08:13:04'),
(2, 'Konsep HOTS dalam Soal IPA', 'Cara menyusun soal IPA berbasis Higher Order Thinking Skills.', 'hots', '60 menit', 5, NULL, '2026-07-27 08:13:04'),
(3, 'Integrasi Budaya Aceh & Sains', 'Menggabungkan kearifan budaya Aceh dengan konsep sains modern.', 'budaya', '30 menit', 3, NULL, '2026-07-27 08:13:04');

INSERT INTO paket_soal (id, guru_id, slug, title, subject, grade, hots_level, stimulus, wordwall_url, status, created_at) VALUES
(1, 1, 'kopi-gayo', 'Kopi Gayo', 'Kimia', 'SMP', 'C4', 'Kopi Gayo yang tumbuh di dataran tinggi Aceh Tengah...', 'https://wordwall.net/resource/00000001/kopi-gayo', 'published', '2026-07-27 09:56:13'),
(2, 1, 'tes', 'tes', 'Biologi', 'SMP', 'C4', 'adfadf', NULL, 'draft', '2026-07-27 09:58:36'),
(3, 1, 'tes-lagi', 'tes lagi', 'Fisika', 'SMP', 'C6', 'weqeqweqwe', NULL, 'draft', '2026-07-28 17:17:50');

-- Supaya id auto-increment berikutnya melanjutkan dari data lama, bukan mulai dari 1 lagi
SELECT setval(pg_get_serial_sequence('guru', 'id'), (SELECT MAX(id) FROM guru));
SELECT setval(pg_get_serial_sequence('materi', 'id'), (SELECT MAX(id) FROM materi));
SELECT setval(pg_get_serial_sequence('paket_soal', 'id'), (SELECT MAX(id) FROM paket_soal));
