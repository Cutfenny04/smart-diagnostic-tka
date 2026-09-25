require('dotenv').config();
const { Pool } = require('pg');
const supabaseAdmin = require('../config/supabaseAdmin');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const GURU_BARU = [
  {
    nama: 'Harlita.My',
    email: 'harlitamy44@guru.smp.belajar.id',
    nip: '197704242022212002',
  },
  {
    nama: 'Deswita, S.Pd',
    email: 'ideswita4@gmail.com',
    nip: '199510132019032012',
  },
  {
    nama: 'Zuhana',
    email: 'zuhanapd33@guru.smp.belajar.id',
    nip: '198003232009042004',
  },
  {
    nama: 'Armayanti Ar',
    email: 'armayantiar90@guru.smp.belajar.id',
    nip: '198410192010032003',
  },
  {
    nama: 'Marlina, S.Pd',
    email: 'marlina0218@guru.smp.belajar.id',
    nip: '198202102009042019',
  },
];

async function main() {
  console.log(`Memulai provisioning ${GURU_BARU.length} akun guru baru...`);

  for (const g of GURU_BARU) {
    // 1. Cek apakah sudah ada di profiles
    const existingProfile = await pool.query('SELECT id FROM profiles WHERE email = $1', [g.email]);
    if (existingProfile.rows.length > 0) {
      console.log(`[SKIP] Sudah ada di profiles: ${g.nama} (${g.email})`);
      continue;
    }

    // 2. Cek apakah sudah ada di auth.users Supabase
    const { data: usersList, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
    if (listErr) {
      console.error(`[ERROR] Gagal list users:`, listErr.message);
      continue;
    }

    const existingAuthUser = usersList.users.find((u) => u.email === g.email);
    let userId;

    if (existingAuthUser) {
      console.log(`[INFO] User auth sudah ada di Supabase: ${g.email} (${existingAuthUser.id})`);
      userId = existingAuthUser.id;
    } else {
      // Buat user auth baru
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: g.email,
        password: g.nip,
        email_confirm: true,
      });

      if (error) {
        console.error(`[GAGAL] createUser ${g.email}:`, error.message);
        continue;
      }
      userId = data.user.id;
      console.log(`[AUTH OK] Created auth user: ${g.email} -> ${userId}`);
    }

    // 3. Masukkan ke public.profiles
    await pool.query(
      'INSERT INTO profiles (id, nama, nip, email, role, created_at) VALUES ($1, $2, $3, $4, $5, now())',
      [userId, g.nama, g.nip, g.email, 'guru']
    );
    console.log(`[PROFILE OK] Inserted profile: ${g.nama} (${g.email})`);
  }

  console.log('Selesai provisioning guru batch 3.');
  await pool.end();
}

main().catch((err) => {
  console.error('FATAL ERROR:', err);
  process.exit(1);
});
