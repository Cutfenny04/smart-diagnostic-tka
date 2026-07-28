USE guru_aceh_db;

CREATE TABLE IF NOT EXISTS paket_soal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) UNIQUE,          -- contoh: 'kopi-gayo' (dipakai di URL)
    title VARCHAR(150) NOT NULL,
    subject VARCHAR(50) NOT NULL,       -- Kimia / Fisika / Biologi
    grade VARCHAR(10) NOT NULL,         -- SMP / SMA
    hots_level VARCHAR(5) NOT NULL,     -- C4 / C5 / C6
    stimulus TEXT NOT NULL,
    wordwall_url VARCHAR(255),          -- boleh NULL kalau belum ada link
    status ENUM('draft', 'published') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contoh data (silakan tambah/edit sesuai kebutuhan)
INSERT INTO paket_soal (slug, title, subject, grade, hots_level, stimulus, wordwall_url, status) VALUES
('kopi-gayo', 'Kopi Gayo', 'Kimia', 'SMP', 'C4', 'Kopi Gayo yang tumbuh di dataran tinggi Aceh Tengah melalui proses fermentasi biji sebelum disangrai. Proses ini melibatkan reaksi kimia dan aktivitas mikroorganisme yang dapat dijadikan konteks pembelajaran fermentasi, perubahan zat, dan sifat larutan asam-basa pada kopi.', 'https://wordwall.net/resource/00000001/kopi-gayo', 'published'),
('tari-saman', 'Tari Saman', 'Fisika', 'SMP', 'C5', 'Tari Saman dari Gayo Lues menampilkan gerakan tangan, tepuk dada, dan paha yang serentak mengikuti irama syair. Pola gerak dan bunyi yang dihasilkan dapat digunakan untuk membahas konsep gerak, gaya, serta getaran dan gelombang bunyi dalam Fisika.', 'https://wordwall.net/resource/00000002/tari-saman', 'published'),
('rumoh-aceh', 'Rumoh Aceh', 'Fisika', 'SMA', 'C5', 'Rumoh Aceh dibangun berbentuk panggung dengan sambungan kayu tanpa paku yang fleksibel terhadap guncangan. Struktur ini relevan untuk membahas gaya, keseimbangan, dan prinsip bangunan tahan gempa di wilayah rawan seismik seperti Aceh.', NULL, 'draft');
