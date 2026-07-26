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

-- Tabel-tabel lain (materi, bank_soal, hasil_diagnostik, dst)
-- akan kita tambahkan setelah fitur login berjalan dengan baik.
