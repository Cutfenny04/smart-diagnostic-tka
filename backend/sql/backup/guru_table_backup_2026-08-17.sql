-- Backup tabel `guru` (legacy, pra-Supabase Auth) sebelum di-drop.
-- Dibuat otomatis 2026-08-17. 3 baris, semua akun testing lama,
-- tidak ada FK yang menunjuk ke tabel ini (sudah dicek sebelum drop).
-- Untuk restore: jalankan CREATE TABLE guru (...) dari backend/sql/supabase_schema.sql
-- dulu, baru jalankan INSERT di bawah ini.

INSERT INTO guru (id, nama, email, password_hash, created_at) VALUES ('1', 'cetas cetas', 'cetas@sekolah.sch.id', '$2b$10$kro5Xkktdtj7Qs.iFCU5uu8OhX49r.rIJvQ7bNdLeoFuBHPKPO8iO', '2026-07-29T14:40:26.000Z');
INSERT INTO guru (id, nama, email, password_hash, created_at) VALUES ('2', 'Budi Santoso', 'budi@sekolah.sch.id', '$2b$10$yfWJ4PkS71SOOxliD5jqn.xxw4JeUQq7/WirmdSBPnL81Kf4onRjG', '2026-07-29T14:45:32.961Z');
INSERT INTO guru (id, nama, email, password_hash, created_at) VALUES ('3', 'baba', 'baba@sekolah.sch.id', '$2b$10$vrKVSmTFk9yAdeVXasqVCOuIrO9LHTUiRGk1tNc9A01at5NRWVVG.', '2026-07-29T15:06:21.238Z');
