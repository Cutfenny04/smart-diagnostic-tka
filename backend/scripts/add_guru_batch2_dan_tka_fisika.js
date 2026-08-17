// One-off provisioning script, run 2026-08-17 against live Supabase.
// 1) Menambahkan 3 akun guru baru (batch ke-2, total jadi 18) via Supabase Auth Admin API
//    + baris profiles yang sesuai. Password awal = NPM/NIP, sesuai konvensi 15 akun sebelumnya.
// 2) Menambahkan paket TKA Fisika (paket_soal) yang sebelumnya belum ada -- melengkapi
//    3 TKA resmi (Kimia, Biologi, Fisika) sesuai Fase 18 roadmap. Kimia & Biologi sudah ada
//    di DB dengan wordwall_url yang identik dengan yang diberikan user, jadi tidak disentuh.
require('dotenv').config();
const { Pool } = require('pg');
const supabaseAdmin = require('../config/supabaseAdmin');

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const GURU_BARU = [
  { nama: 'Gladis Adelia', email: 'gladisadelia612@gmail.com', nip: '2406103030027' },
  { nama: 'Afrillienka Dionda', email: 'afrillienkadionda@gmail.com', nip: '2406103030001' },
  { nama: 'Mawarni Saputri', email: 'mawarni_saputri@usk.ac.id', nip: '199311052020122003' },
];

const TKA_FISIKA = {
  title: 'TKA Fisika',
  subject: 'Fisika',
  grade: 'SMP',
  hots_level: 'C4',
  stimulus: 'Aktivitas HOTS TKA Fisika dari Wordwall, disediakan oleh tim pengabdian untuk latihan Smart Diagnostic.',
  wordwall_url: 'https://wordwall.net/play/117454/460/746',
  status: 'published',
  type: 'TKA',
};

async function main() {
  for (const g of GURU_BARU) {
    const existing = await pool.query('SELECT id FROM profiles WHERE email = $1', [g.email]);
    if (existing.rows.length > 0) {
      console.log(`SKIP (sudah ada di profiles): ${g.email}`);
      continue;
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: g.email,
      password: g.nip,
      email_confirm: true,
    });
    if (error) {
      console.error(`GAGAL createUser ${g.email}:`, error.message);
      continue;
    }

    const userId = data.user.id;
    await pool.query(
      'INSERT INTO profiles (id, nama, nip, email, role, created_at) VALUES ($1, $2, $3, $4, $5, now())',
      [userId, g.nama, g.nip, g.email, 'guru']
    );
    console.log(`OK: ${g.nama} <${g.email}> -> ${userId}`);
  }

  const existingFisika = await pool.query(
    "SELECT id FROM paket_soal WHERE type = 'TKA' AND subject = 'Fisika'"
  );
  if (existingFisika.rows.length > 0) {
    console.log('SKIP (TKA Fisika sudah ada):', existingFisika.rows[0].id);
  } else {
    const r = await pool.query(
      `INSERT INTO paket_soal (title, subject, grade, hots_level, stimulus, wordwall_url, status, type, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now()) RETURNING id`,
      [TKA_FISIKA.title, TKA_FISIKA.subject, TKA_FISIKA.grade, TKA_FISIKA.hots_level, TKA_FISIKA.stimulus, TKA_FISIKA.wordwall_url, TKA_FISIKA.status, TKA_FISIKA.type]
    );
    console.log('OK: TKA Fisika ->', r.rows[0].id);
  }

  await pool.end();
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
