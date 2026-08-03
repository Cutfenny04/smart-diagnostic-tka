# Backend - Platform Pelatihan Guru (Budaya Aceh & HOTS IPA)

Fitur **Login/Register Guru** dan **CRUD Paket Soal (Bank Soal)** sudah jalan. Fitur lain (materi, hasil diagnostik) akan ditambah setelah ini jalan.

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
│   ├── auth.controller.js
│   └── paketSoal.controller.js
├── middleware/
│   └── auth.middleware.js           # cek token, dipakai di semua route paket-soal
├── routes/                          # daftar endpoint
│   ├── auth.routes.js
│   └── paketSoal.routes.js
├── sql/supabase_schema.sql          # struktur database
├── server.js                        # entry point
├── .env.example                     # template -- copy jadi .env, isi sendiri
└── .env                             # (kamu buat sendiri dari .env.example, tidak di-commit)
```

## Sinkron dengan Frontend

Frontend (`frontend/`) sudah di-wire ke backend ini:
- `frontend/assets/js/api-config.js` -- satu tempat untuk `window.API_BASE_URL` (default `http://localhost:5000`, ganti kalau backend jalan di port lain).
- `frontend/assets/js/login.js` -- submit form login memanggil `POST /api/auth/login` sungguhan, simpan `token` ke `localStorage`.
- `frontend/assets/data/bank-soal.js` -- `fetchPaketSoal`/`fetchPaketById`/`savePaket`/`deletePaket` sekarang memanggil endpoint `/api/paket-soal/*` di atas (bukan lagi localStorage/dummy data). Guru **harus login dulu** (dapat token) sebelum membuka `bank-soal.html`, `detail-soal.html`, atau `smart-diagnostic.html` -- kalau tidak, akan otomatis diarahkan kembali ke `login.html`.

## Langkah Selanjutnya
1. Pastikan register, login, dan CRUD paket soal berhasil ditest (lihat bagian Testing Endpoint di atas).
2. Tambah tabel `hasil_diagnostik` di `sql/supabase_schema.sql`.
3. Buat controller & route baru per fitur (pola sama seperti `paketSoal.controller.js`/`paketSoal.routes.js`).
4. Wire `frontend/assets/data/materi.js` dan `frontend/assets/data/hasil.js` ke endpoint barunya, dengan pola yang sama seperti `bank-soal.js`.
