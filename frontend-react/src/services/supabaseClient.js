import { createClient } from '@supabase/supabase-js';

/* ==========================================================================
   SUPABASE CLIENT — dipakai untuk login (Fase 4) dan nanti session/profile
   (Fase 5-6). Key di bawah adalah "publishable"/anon key -- sengaja aman
   ditulis langsung di source, sama seperti PRODUCTION_API_BASE_URL di
   services/api.js: sudah pasti ikut ter-bundle ke kode yang dikirim ke
   browser, dan aksesnya dibatasi lewat RLS di sisi Supabase (lihat
   backend/sql/supabase_migration_auth_phase1.sql), bukan lewat kerahasiaan
   key ini.
   ========================================================================== */

const SUPABASE_URL = 'https://bxmvtidvrfbusqsdajli.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__GNHwV_smYOT9xCbAIGR-w_bR8PrAJd';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
