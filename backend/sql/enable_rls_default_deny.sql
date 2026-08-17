-- Enable RLS (default-deny, no policies) on every table that currently has
-- none. Sebelum ini, hanya `profiles` yang punya RLS (lihat
-- supabase_migration_auth_phase1.sql) -- guru, paket_soal, soal,
-- hasil_diagnostik, materi, progress_materi semuanya bisa dibaca/ditulis
-- langsung lewat Supabase REST API (PostgREST) pakai anon key publik,
-- tembus tanpa lewat backend Express sama sekali. Dikonfirmasi langsung
-- (curl ke /rest/v1/guru, /rest/v1/hasil_diagnostik, /rest/v1/paket_soal
-- pakai anon key -> semua 200/terbaca). Paling parah: tabel `guru` punya
-- kolom password_hash, jadi hash password semua guru bisa diambil siapa
-- saja yang tahu anon key (yang memang publik by design di
-- frontend-react/src/services/supabaseClient.js).
--
-- Aman untuk backend: backend selalu connect lewat DATABASE_URL (role
-- `postgres` via pooler), yang punya BYPASSRLS -- RLS di bawah ini sama
-- sekali tidak mempengaruhi query backend yang sudah ada. Aman untuk
-- frontend: dicek dulu (grep "supabase.from(" di frontend-react/src) --
-- frontend TIDAK PERNAH query tabel manapun langsung lewat Supabase client,
-- cuma dipakai untuk auth. Jadi default-deny (RLS ON, tanpa policy sama
-- sekali) tidak akan mematahkan fitur apapun -- cukup untuk menutup akses
-- publik lewat PostgREST.

ALTER TABLE public.guru ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paket_soal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hasil_diagnostik ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_materi ENABLE ROW LEVEL SECURITY;
