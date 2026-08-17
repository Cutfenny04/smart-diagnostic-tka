# Backend - Platform Pelatihan Guru (Budaya Aceh & HOTS IPA)

Login/Register Guru sekarang lewat **Supabase Auth** (dikelola langsung oleh frontend via `@supabase/supabase-js`, bukan endpoint di backend ini -- lihat `frontend-react/src/services/supabaseClient.js`). Backend ini menangani Bank Soal (Paket Soal + Soal), Smart Diagnostic (Hasil Diagnostik), Materi, dan cek embed Wordwall; semua route-nya diverifikasi lewat token Supabase (`middleware/supabaseAuth.middleware.js`).

## Cara Menjalankan

### 1. Install dependencies
```bash
cd backend-guru-aceh
npm install
```

### 2. Setup database
- Buka dashboard Supabase project kamu -> SQL Editor -> New query
- Copy-paste seluruh isi file `sql/supabase_schema.sql`, lalu klik Run

### 3. Setup file environment
- Copy `.env.example` jadi `.env` (`.env` sudah masuk `.gitignore`, jangan pernah di-commit)
- Isi `DATABASE_URL` dengan connection string dari dashboard Supabase (Settings > Database > Connection string > URI)
- Isi `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` dari dashboard Supabase (Settings > API)

### 4. Jalankan server
```bash
npm run dev
```
Kalau berhasil, akan muncul: `Server berjalan di http://localhost:5000`

## Testing Endpoint (pakai Postman / Thunder Client)

Login/register tidak lagi lewat backend ini -- lakukan lewat Supabase Auth (mis. langsung di aplikasi frontend, atau lewat dashboard Supabase untuk buat akun guru manual). Setelah dapat access token dari Supabase, pakai itu di header:
```
Authorization: Bearer <token>
```

**Paket Soal (Bank Soal) -- semua route di bawah butuh header `Authorization: Bearer <token>`**

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/paket-soal` | Daftar semua paket milik guru yang login. Tambahkan `?status=published` untuk hanya paket Published (dipakai Smart Diagnostic). |
| GET | `/api/paket-soal/:id` | Satu paket berdasarkan id. |
| POST | `/api/paket-soal` | Buat paket baru. Body: `{ title, subject, grade, hotsLevel, stimulus, wordwallUrl, status }`. |
| PUT | `/api/paket-soal/:id` | Ubah paket. Body sama seperti POST. |
| DELETE | `/api/paket-soal/:id` | Hapus paket. |

Aturan validasi (sama seperti di frontend `detail-soal.js`, divalidasi ulang di server): `title`, `subject`, `grade`, `hotsLevel`, `stimulus` wajib diisi; `wordwallUrl` wajib diisi kalau `status` diset ke `"published"`.

Contoh buat paket baru:
```
POST http://localhost:5000/api/paket-soal
Headers: Authorization: Bearer <token>
Body (JSON):
{
  "title": "Kopi Gayo",
  "subject": "Kimia",
  "grade": "SMP",
  "hotsLevel": "C4",
  "stimulus": "Kopi Gayo yang tumbuh di dataran tinggi Aceh Tengah...",
  "wordwallUrl": null,
  "status": "draft"
}
```

## Struktur Folder
```
backend-guru-aceh/
├── config/db.js                    # koneksi ke Supabase (PostgreSQL)
├── controllers/                     # logika bisnis tiap fitur
│   └── paketSoal.controller.js
├── middleware/
│   └── supabaseAuth.middleware.js   # verifikasi token Supabase, dipakai semua route fitur
├── routes/                          # daftar endpoint
│   └── paketSoal.routes.js
├── sql/supabase_schema.sql          # struktur database
├── server.js                        # entry point
├── .env.example                     # template -- copy jadi .env, isi sendiri
└── .env                             # (kamu buat sendiri dari .env.example, tidak di-commit)
```

## Sinkron dengan Frontend

Frontend (`frontend-react/`) sudah di-wire ke backend ini:
- `frontend-react/src/services/api.js` -- satu tempat untuk `API_BASE_URL` (localhost saat dev, URL Railway saat production).
- `frontend-react/src/services/supabaseClient.js` -- login/session sepenuhnya lewat Supabase Auth (`supabase.auth.signInWithPassword`), token sesi dikelola supabase-js sendiri, tidak lagi ditulis manual ke `localStorage`.
- `frontend-react/src/data/bankSoalData.js` -- `fetchPaketSoal`/`fetchPaketById`/`savePaket`/`deletePaket` memanggil endpoint `/api/paket-soal/*` di atas. Guru **harus login dulu** sebelum membuka halaman `/bank-soal`, `/bank-soal/:id/edit`, atau `/smart-diagnostic` -- kalau tidak, `ProtectedRoute` otomatis mengarahkan kembali ke `/login`.

## Langkah Selanjutnya
1. Pastikan register, login, dan CRUD paket soal berhasil ditest (lihat bagian Testing Endpoint di atas).
2. Tambah tabel `hasil_diagnostik` di `sql/supabase_schema.sql`.
3. Buat controller & route baru per fitur (pola sama seperti `paketSoal.controller.js`/`paketSoal.routes.js`).
4. Wire `frontend/assets/data/materi.js` dan `frontend/assets/data/hasil.js` ke endpoint barunya, dengan pola yang sama seperti `bank-soal.js`.
