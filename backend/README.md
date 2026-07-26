# Backend - Platform Pelatihan Guru (Budaya Aceh & HOTS IPA)

Starter project ini fokus ke fitur **Login Guru** dulu (langkah 1). Fitur lain (materi, bank soal, diagnostik) akan ditambah setelah ini jalan.

## Cara Menjalankan

### 1. Install dependencies
```bash
cd backend-guru-aceh
npm install
```

### 2. Setup database
- Buka phpMyAdmin / MySQL CLI
- Jalankan isi file `sql/schema.sql` untuk membuat database `guru_aceh_db` dan tabel `guru`

### 3. Setup file environment
- Copy `.env.example` jadi `.env`
- Isi `DB_PASSWORD` sesuai password MySQL kamu (kalau pakai XAMPP biasanya kosong)
- Isi `JWT_SECRET` bebas, string acak yang panjang (contoh: `rahasia123banget456`)

### 4. Jalankan server
```bash
npm run dev
```
Kalau berhasil, akan muncul: `Server berjalan di http://localhost:5000`

## Testing Endpoint (pakai Postman / Thunder Client)

**Register guru baru**
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "nama": "Budi Santoso",
  "email": "budi@sekolah.sch.id",
  "password": "rahasia123"
}
```

**Login**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "budi@sekolah.sch.id",
  "password": "rahasia123"
}
```
Kalau berhasil, kamu akan dapat `token`. Token ini nanti dipakai frontend untuk akses fitur yang butuh login (Dashboard Guru, Bank Soal, dll) lewat header:
```
Authorization: Bearer <token>
```

## Struktur Folder
```
backend-guru-aceh/
├── config/db.js              # koneksi ke MySQL
├── controllers/               # logika bisnis tiap fitur
│   └── auth.controller.js
├── middleware/
│   └── auth.middleware.js     # cek token, buat proteksi route nanti
├── routes/                    # daftar endpoint
│   └── auth.routes.js
├── sql/schema.sql             # struktur database
├── server.js                  # entry point
└── .env                       # (kamu buat sendiri dari .env.example)
```

## Langkah Selanjutnya
1. Pastikan register & login berhasil ditest
2. Tambah tabel `materi`, `bank_soal`, `hasil_diagnostik` di schema.sql
3. Buat controller & route baru per fitur (pola sama seperti auth)
4. Pasang `verifyToken` middleware di route yang butuh login
