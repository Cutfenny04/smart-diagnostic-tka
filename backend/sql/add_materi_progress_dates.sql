-- Roadmap 2026-08-22 item #4 (Materi & Modul jadi sistem progress nyata):
-- progress_materi sudah punya `progress` (0-100, dipakai turunkan status
-- Belum/Sedang/Selesai) dan `last_opened` (diperbarui SETIAP kali disentuh),
-- tapi belum punya tanggal_mulai/tanggal_selesai yang eksplisit -- last_opened
-- bukan tanggal_mulai (dia berubah tiap sentuhan, bukan cuma yang pertama).
-- Menambah 2 kolom: started_at (diisi sekali, saat progress pertama kali >0)
-- dan completed_at (diisi sekali, saat progress pertama kali mencapai 100).
--
-- STATUS: dijalankan langsung ke Supabase live 2026-08-22 (bukan draft) --
-- lihat materi.controller.js updateProgress() untuk logika COALESCE yang
-- menjaga kolom ini cuma terisi sekali, bukan tertimpa tiap update.
--
-- Aman & idempotent: ADD COLUMN IF NOT EXISTS, tidak menyentuh baris yang
-- sudah ada (nilai NULL untuk baris lama yang progress-nya sudah >0/100 dari
-- sebelum kolom ini ada -- itu jujur, bukan tanggal palsu, karena kita
-- memang tidak tahu tanggal aslinya).

BEGIN;

ALTER TABLE progress_materi ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;
ALTER TABLE progress_materi ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

COMMIT;
