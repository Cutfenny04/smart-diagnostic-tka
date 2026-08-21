-- Roadmap item #11 (2026-08-22): Dashboard Hasil butuh stat "aktivitas TKA
-- dimainkan" per guru -- sebelumnya tidak ada tracking sama sekali (tombol
-- "Buka di Wordwall"/iframe embed tidak pernah dicatat ke mana pun).
--
-- Keputusan user (AskUserQuestion, 2026-08-22): dihitung PERSONAL per guru
-- yang login -- berapa kali GURU INI membuka aktivitas TKA (miliknya sendiri
-- ATAU milik guru lain di bank soal bersama), bukan metrik jangkauan
-- konten/reach untuk pembuat paket. Konsisten dengan sisa Dashboard Hasil
-- yang semuanya personal per-guru (guru_id = req.user.id).
--
-- Dicatat SEKALI setiap guru menekan "Mulai Diagnostik" pada paket TKA
-- (transisi ke EmbedView di SmartDiagnostic.jsx) -- bukan saat cuma
-- membuka preview di Bank Soal. Tidak ada kolom skor/ended_at: kita tidak
-- tahu kapan/apakah guru benar-benar menyelesaikan aktivitas Wordwall
-- (tidak ada integrasi hasil Wordwall -- lihat roadmap item #12), jadi
-- hanya event "dibuka" yang jujur bisa dicatat.
--
-- STATUS: dijalankan langsung ke Supabase live 2026-08-22.

BEGIN;

CREATE TABLE IF NOT EXISTS tka_play_activity (
  id BIGSERIAL PRIMARY KEY,
  guru_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  paket_soal_id BIGINT NOT NULL REFERENCES paket_soal(id) ON DELETE CASCADE,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tka_play_activity_guru ON tka_play_activity (guru_id);

COMMIT;
