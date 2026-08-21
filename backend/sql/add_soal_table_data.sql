-- Roadmap item #10 (2026-08-22): soal.stimulus tadinya cuma teks bebas --
-- SATU soal (Fisika id 2) menyisipkan "tabel" sebagai teks multi-baris yang
-- di-parse pakai heuristik regex di frontend (lihat StimulusBlock lama di
-- NonTkaGame.jsx, sebelum pass ini). Itu bukan data tabel asli, cuma teks
-- yang kebetulan berpola. Menambah kolom table_data (jsonb, nullable) untuk
-- tabel terstruktur asli: { caption, headers: string[], rows: string[][] }.
--
-- STATUS: dijalankan langsung ke Supabase live 2026-08-22.
-- Aman & idempotent: ADD COLUMN IF NOT EXISTS, tidak mengubah baris yang ada.

BEGIN;

ALTER TABLE soal ADD COLUMN IF NOT EXISTS table_data JSONB;

COMMIT;
