-- Jalankan ini di MySQL (phpMyAdmin / mysql CLI) untuk membuat database & tabel awal

CREATE DATABASE IF NOT EXISTS guru_aceh_db;
USE guru_aceh_db;

CREATE TABLE IF NOT EXISTS guru (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Paket Soal Berbasis Budaya Aceh (Bank Soal).
-- Setiap paket HANYA menyimpan informasi paket (judul, bidang, jenjang, HOTS,
-- stimulus, link Wordwall, status) -- TIDAK ADA pertanyaan/opsi/jawaban di
-- sini, soal HOTS didigitalkan langsung di Wordwall oleh guru. Lihat
-- frontend/PIVOT_PLAN.md untuk arsitektur lengkap.
CREATE TABLE IF NOT EXISTS paket_soal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guru_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    hots_level VARCHAR(5) NOT NULL,
    stimulus TEXT NOT NULL,
    wordwall_url VARCHAR(255) NULL,
    status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guru_id) REFERENCES guru(id) ON DELETE CASCADE
);

-- Tabel-tabel lain (materi, hasil_diagnostik, dst) akan kita tambahkan
-- setelah fitur ini berjalan dengan baik.
