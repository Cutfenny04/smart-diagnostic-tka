-- Migrasi Auth Pivot -- Fase 1: buat `profiles` terhubung ke Supabase Auth,
-- dan konversi FK yang tadinya menunjuk ke `guru.id` (int) supaya menunjuk
-- ke `profiles.id` (uuid).
--
-- Latar belakang: backend saat ini pakai auth custom (JWT + bcrypt, tabel
-- `guru`, lihat backend/controllers/auth.controller.js). Kita pindah ke
-- Supabase Auth secara bertahap (full cutover, tapi tidak langsung hapus
-- yang lama -- tabel `guru` & auth.controller.js dipertahankan sebagai
-- backup sampai fitur baru teruji end-to-end).
--
-- Audit sebelum migrasi ini ditulis (baca-saja, lihat riwayat percakapan):
--   - paket_soal.created_by_guru_id: 5 baris, semua NULL
--   - progress_materi: 0 baris
--   - hasil_diagnostik: 0 baris, 0 guru_id terisi
-- Karena itu, TIDAK ada mapping guru.id -> profiles.id yang perlu dibuat --
-- konversi tipe kolom di bawah aman tanpa kehilangan data. Guard di bawah
-- akan menolak migrasi kalau ternyata sudah ada data baru yang mengisi
-- kolom-kolom ini sejak audit di atas dilakukan.
--
-- STATUS: dijalankan ke Supabase live.

BEGIN;

-- ============================================================================
-- 1. profiles: identitas guru pasca-Auth, id = auth.users.id
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama text NOT NULL,
    nip text,
    email text NOT NULL UNIQUE,
    role text NOT NULL DEFAULT 'guru',
    created_at timestamptz NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

COMMENT ON TABLE public.profiles IS 'Data guru pasca-migrasi ke Supabase Auth. id = auth.users.id. Menggantikan tabel guru lama (dipertahankan sementara sebagai backup sampai cutover selesai).';

-- ============================================================================
-- 2. Guard: pastikan tidak ada data guru_id lama yang akan hilang
-- ============================================================================

DO $$
DECLARE
  sisa_paket int;
  sisa_progress int;
  sisa_hasil int;
BEGIN
  SELECT count(*) INTO sisa_paket FROM public.paket_soal WHERE created_by_guru_id IS NOT NULL;
  SELECT count(*) INTO sisa_progress FROM public.progress_materi;
  SELECT count(*) INTO sisa_hasil FROM public.hasil_diagnostik WHERE guru_id IS NOT NULL;

  IF sisa_paket > 0 OR sisa_progress > 0 OR sisa_hasil > 0 THEN
    RAISE EXCEPTION 'Migrasi dibatalkan: ada data guru_id lama yang belum dipetakan (paket_soal=%, progress_materi=%, hasil_diagnostik=%). Buat mapping guru.id -> profiles.id dulu sebelum menjalankan migrasi ini.',
      sisa_paket, sisa_progress, sisa_hasil;
  END IF;
END $$;

-- ============================================================================
-- 3. Konversi FK dari guru.id (int) ke profiles.id (uuid)
-- ============================================================================

-- paket_soal.created_by_guru_id
ALTER TABLE public.paket_soal DROP CONSTRAINT IF EXISTS paket_soal_created_by_guru_id_fkey;
ALTER TABLE public.paket_soal ALTER COLUMN created_by_guru_id TYPE uuid USING NULL;
ALTER TABLE public.paket_soal
  ADD CONSTRAINT paket_soal_created_by_guru_id_fkey
    FOREIGN KEY (created_by_guru_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- progress_materi.guru_id (tetap NOT NULL -- tabel masih 0 baris)
ALTER TABLE public.progress_materi DROP CONSTRAINT IF EXISTS progress_materi_guru_id_fkey;
ALTER TABLE public.progress_materi ALTER COLUMN guru_id TYPE uuid USING NULL;
ALTER TABLE public.progress_materi
  ADD CONSTRAINT progress_materi_guru_id_fkey
    FOREIGN KEY (guru_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- hasil_diagnostik.guru_id
ALTER TABLE public.hasil_diagnostik DROP CONSTRAINT IF EXISTS hasil_diagnostik_guru_id_fkey;
ALTER TABLE public.hasil_diagnostik ALTER COLUMN guru_id TYPE uuid USING NULL;
ALTER TABLE public.hasil_diagnostik
  ADD CONSTRAINT hasil_diagnostik_guru_id_fkey
    FOREIGN KEY (guru_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

COMMIT;

-- ============================================================================
-- Rollback manual jika perlu (jalankan terpisah, bukan bagian migrasi ini):
--
-- BEGIN;
-- ALTER TABLE hasil_diagnostik DROP CONSTRAINT IF EXISTS hasil_diagnostik_guru_id_fkey;
-- ALTER TABLE hasil_diagnostik ALTER COLUMN guru_id TYPE int USING NULL;
-- ALTER TABLE hasil_diagnostik ADD CONSTRAINT hasil_diagnostik_guru_id_fkey
--   FOREIGN KEY (guru_id) REFERENCES guru(id) ON DELETE SET NULL;
--
-- ALTER TABLE progress_materi DROP CONSTRAINT IF EXISTS progress_materi_guru_id_fkey;
-- ALTER TABLE progress_materi ALTER COLUMN guru_id TYPE int USING NULL;
-- ALTER TABLE progress_materi ADD CONSTRAINT progress_materi_guru_id_fkey
--   FOREIGN KEY (guru_id) REFERENCES guru(id) ON DELETE CASCADE;
--
-- ALTER TABLE paket_soal DROP CONSTRAINT IF EXISTS paket_soal_created_by_guru_id_fkey;
-- ALTER TABLE paket_soal ALTER COLUMN created_by_guru_id TYPE int USING NULL;
-- ALTER TABLE paket_soal ADD CONSTRAINT paket_soal_created_by_guru_id_fkey
--   FOREIGN KEY (created_by_guru_id) REFERENCES guru(id) ON DELETE SET NULL;
--
-- DROP TABLE IF EXISTS profiles;
-- COMMIT;
-- ============================================================================
