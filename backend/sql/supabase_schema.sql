-- Schema PostgreSQL untuk Supabase (pengganti schema.sql, materi_schema.sql,
-- bank_soal_schema.sql yang lama, dibuat untuk MySQL/MariaDB).
--
-- Cara pakai: buka dashboard Supabase -> SQL Editor -> New query -> paste
-- seluruh isi file ini -> Run.
--
-- Catatan: kolom `slug` di paket_soal digabung dari bank_soal_schema.sql
-- (dipakai backend/controllers/bank-soal.controller.js) dan `guru_id` dari
-- schema.sql (dipakai backend/controllers/paketSoal.controller.js) karena
-- keduanya membaca tabel paket_soal yang sama.

CREATE TABLE IF NOT EXISTS guru (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS materi (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    deskripsi TEXT,
    category VARCHAR(50) NOT NULL,
    duration VARCHAR(50),
    materi_count INT DEFAULT 1,
    konten_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS paket_soal (
    id SERIAL PRIMARY KEY,
    guru_id INT NOT NULL REFERENCES guru(id) ON DELETE CASCADE,
    slug VARCHAR(100) UNIQUE,
    title VARCHAR(150) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    hots_level VARCHAR(5) NOT NULL,
    stimulus TEXT NOT NULL,
    wordwall_url VARCHAR(255),
    status VARCHAR(10) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS progress_materi (
    id SERIAL PRIMARY KEY,
    guru_id INT NOT NULL REFERENCES guru(id) ON DELETE CASCADE,
    materi_id INT NOT NULL REFERENCES materi(id) ON DELETE CASCADE,
    progress INT DEFAULT 0,
    last_opened TIMESTAMP NULL,
    UNIQUE (guru_id, materi_id)
);
