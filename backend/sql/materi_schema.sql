USE guru_aceh_db;

-- Tabel materi: data materi/modul (sama untuk semua guru)
CREATE TABLE IF NOT EXISTS materi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    deskripsi TEXT,
    category VARCHAR(50) NOT NULL,   -- contoh: 'budaya_aceh', 'hots_ipa'
    duration VARCHAR(50),             -- contoh: '45 menit'
    materi_count INT DEFAULT 1,       -- jumlah sub-materi di dalamnya
    konten_url VARCHAR(255),          -- link file/video materi (opsional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel progress: progress belajar tiap guru per materi (unik per guru+materi)
CREATE TABLE IF NOT EXISTS progress_materi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guru_id INT NOT NULL,
    materi_id INT NOT NULL,
    progress INT DEFAULT 0,           -- 0-100
    last_opened TIMESTAMP NULL,
    FOREIGN KEY (guru_id) REFERENCES guru(id) ON DELETE CASCADE,
    FOREIGN KEY (materi_id) REFERENCES materi(id) ON DELETE CASCADE,
    UNIQUE KEY unique_guru_materi (guru_id, materi_id)
);

-- Contoh data materi (boleh diedit/ditambah sesuai kebutuhan)
INSERT INTO materi (title, deskripsi, category, duration, materi_count) VALUES
('Pengenalan Budaya Aceh dalam Pembelajaran', 'Modul dasar mengenal kearifan lokal Aceh untuk konteks pembelajaran IPA.', 'budaya_aceh', '45 menit', 4),
('Konsep HOTS dalam Soal IPA', 'Cara menyusun soal IPA berbasis Higher Order Thinking Skills.', 'hots_ipa', '60 menit', 5),
('Integrasi Budaya Aceh & Sains', 'Menggabungkan kearifan budaya Aceh dengan konsep sains modern.', 'budaya_aceh', '30 menit', 3);
