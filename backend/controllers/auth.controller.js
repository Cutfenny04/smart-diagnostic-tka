const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// REGISTER - guru baru daftar akun
async function register(req, res) {
  try {
    const { nama, email, password } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan password wajib diisi' });
    }

    // Cek apakah email sudah terdaftar
    const [existing] = await pool.query('SELECT id FROM guru WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    // Hash password sebelum disimpan (JANGAN pernah simpan password polos)
    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO guru (nama, email, password_hash) VALUES (?, ?, ?)',
      [nama, email, passwordHash]
    );

    return res.status(201).json({ message: 'Registrasi berhasil, silakan login' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

// LOGIN - guru masuk ke sistem
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    const [rows] = await pool.query('SELECT * FROM guru WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const guru = rows[0];
    const passwordCocok = await bcrypt.compare(password, guru.password_hash);
    if (!passwordCocok) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Buat token JWT supaya frontend bisa akses fitur lain tanpa login ulang
    const token = jwt.sign(
      { id: guru.id, nama: guru.nama, email: guru.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login berhasil',
      token,
      guru: { id: guru.id, nama: guru.nama, email: guru.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

// UBAH PASSWORD - guru yang sudah login mengganti password sendiri
async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Password lama dan password baru wajib diisi' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password baru minimal 6 karakter' });
    }

    const [rows] = await pool.query('SELECT * FROM guru WHERE id = ?', [req.guru.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Akun guru tidak ditemukan' });
    }

    const guru = rows[0];
    const passwordCocok = await bcrypt.compare(oldPassword, guru.password_hash);
    if (!passwordCocok) {
      return res.status(401).json({ message: 'Password lama salah' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE guru SET password_hash = ? WHERE id = ?', [passwordHash, guru.id]);

    return res.json({ message: 'Password berhasil diubah' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

module.exports = { register, login, changePassword };
