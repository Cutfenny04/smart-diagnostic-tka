const { createClient } = require('@supabase/supabase-js');

// Client sisi server, pakai service_role key -- HANYA dipakai backend untuk
// memverifikasi token guru (auth.middleware.js baru) dan nanti membuat akun
// guru lewat Admin API (Fase 7). Jangan pernah expose service_role key ini
// ke frontend.
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

module.exports = supabaseAdmin;
