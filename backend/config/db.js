const { Pool } = require('pg');
require('dotenv').config();

// Pool koneksi ke Supabase (PostgreSQL). ssl wajib karena Supabase mewajibkan
// koneksi terenkripsi; rejectUnauthorized: false karena Supabase pakai
// certificate chain yang tidak selalu dikenali Node secara default.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
