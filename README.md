# Smart Diagnostic TKA

Platform Pelatihan Penyusunan Instrumen HOTS IPA Berbasis Smart Diagnostic TKA Terintegrasi Game Digital Budaya Aceh — untuk pengabdian masyarakat, ditujukan bagi guru IPA SMP.

Guru mempelajari materi HOTS & budaya Aceh, membuat aktivitas kuis di Wordwall lalu mendaftarkannya ke situs ini (**TKA**), berlatih lewat game interaktif pilihan ganda buatan situs (**Non-TKA**), dan memantau seluruh progress pelatihannya di satu dashboard.

> Dokumen ini adalah sumber kebenaran utama untuk kondisi proyek saat ini. `PIVOT_PLAN.md` masih ada sebagai catatan sejarah keputusan desain per fase, tapi **jangan dianggap mencerminkan kondisi terkini** — sudah beberapa kali ketinggalan dari kode sungguhan. Kalau ada perbedaan antara dokumen itu dan README ini, README ini yang benar.

---

## Daftar Isi

1. [Arsitektur](#arsitektur)
2. [Database](#database)
3. [Autentikasi](#autentikasi)
4. [Alur Guru](#alur-guru)
5. [Bank Soal](#bank-soal)
6. [TKA / Wordwall](#tka--wordwall)
7. [Game Non-TKA](#game-non-tka)
8. [Dashboard](#dashboard)
9. [Keamanan](#keamanan)
10. [Development (Menjalankan Secara Lokal)](#development-menjalankan-secara-lokal)
11. [Deployment](#deployment)
12. [Environment Variables](#environment-variables)
13. [Referensi Endpoint API](#referensi-endpoint-api)
14. [Struktur Folder](#struktur-folder)

---

## Arsitektur

```
┌─────────────────────┐      HTTPS       ┌──────────────────────┐
│   Frontend (React)  │ ───────────────► │   Backend (Express)  │
│   Vite, Vercel       │                  │   Node.js, Railway    │
└──────────┬───────────┘                  └───────────┬───────────┘
           │                                            │
           │  Login/session langsung                    │  Query via
           │  (Supabase Auth SDK)                        │  connection string
           ▼                                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Supabase (Postgres + Auth)                    │
└─────────────────────────────────────────────────────────────────┘
```

- **Frontend**: React 19 + Vite, di folder [`frontend-react/`](frontend-react/). React Router untuk navigasi, tanpa state-management library eksternal (state lokal per-halaman + satu `AuthContext`). Login dan sesi ditangani **langsung oleh frontend lewat Supabase Auth SDK** (`@supabase/supabase-js`) — tidak lewat backend.
- **Backend**: Node.js + Express, di folder [`backend/`](backend/). Menangani Bank Soal (paket TKA/Non-TKA + butir soal), Materi & progress, Hasil Diagnostik (Non-TKA), Dashboard agregat, dan cek keamanan embed Wordwall. Setiap route terproteksi memverifikasi token akses Supabase yang dikirim frontend — backend sendiri **tidak** punya sistem login/sesi terpisah.
- **Database**: PostgreSQL yang di-hosting Supabase, diakses backend lewat `pg` (connection string langsung), dan diakses frontend secara tidak langsung (hanya untuk Auth) lewat Supabase SDK.
- Backend dan frontend adalah dua aplikasi terpisah yang di-deploy terpisah (lihat [Deployment](#deployment)) — tidak ada server-side rendering atau monorepo build tunggal.

---

## Database

Enam tabel di skema `public`, semua di Supabase Postgres yang sama. `sql/` di dalam `backend/` berisi riwayat migrasi (dijalankan manual satu per satu lewat SQL Editor Supabase) — **bukan skema deklaratif yang otomatis sinkron**, jadi kalau ragu, cek langsung lewat `information_schema` di Supabase, bukan cuma baca file `.sql`-nya (skema live sudah beberapa kali kedapatan berbeda dari file migrasi yang tercatat).

| Tabel | Fungsi | Kolom kunci |
|---|---|---|
| `profiles` | Data guru (1 baris = 1 akun) | `id` (uuid, sama dengan `auth.users.id` Supabase), `nama`, `nip`, `email`, `role` (default `'guru'`) |
| `materi` | Katalog materi & modul pelatihan (bersama, bukan per-guru) | `id`, `title`, `deskripsi`, `category`, `duration`, `materi_count`, `konten_url` |
| `progress_materi` | Progress belajar tiap guru per materi | `guru_id` + `materi_id` (unik bersama), `progress` (0-100), `last_opened`, `started_at`, `completed_at` |
| `paket_soal` | Bank Soal — katalog paket bersama, dua tipe (`type`: `TKA` / `NON_TKA`) | `id`, `created_by_guru_id`, `title`, `subject`, `grade`, `hots_level`, `stimulus`, `wordwall_url`, `status` (`draft`/`published`), `thumbnail` |
| `soal` | Butir soal pilihan ganda untuk paket Non-TKA | `paket_id`, `question`, `stimulus`, `image`, `table_data` (jsonb, opsional), `options` (jsonb), `correct_answer`, `explanation`, `order_number` |
| `hasil_diagnostik` | Riwayat hasil latihan Non-TKA tiap guru | `paket_id`, `guru_id`, `score`, `correct_count`, `wrong_count`, `total_questions`, `started_at`, `completed_at` |
| `tka_play_activity` | Log setiap kali guru membuka/memainkan aktivitas TKA (miliknya atau guru lain) | `guru_id`, `paket_soal_id`, `played_at` |

Catatan penting soal desain:
- **Bank Soal (`paket_soal`) adalah katalog bersama**, bukan data privat per-akun — semua guru melihat paket yang sama. `created_by_guru_id` cuma untuk audit, bukan kepemilikan eksklusif.
- Paket bertipe `NON_TKA` **tidak bisa** dibuat/diubah/dihapus lewat API oleh guru (dikunci di level backend, bukan cuma disembunyikan di UI) — isinya diisi tim pengembang lewat script (`backend/scripts/import_soal_non_tka.js`).
- `progress_materi`, `hasil_diagnostik`, dan `tka_play_activity` adalah data **privat per-guru** (difilter `guru_id = req.user.id` di setiap query backend).
- Tidak ada tabel `guru` terpisah lagi — akun sepenuhnya dikelola lewat Supabase Auth (`auth.users`) + `profiles` sebagai data tambahan.

---

## Autentikasi

Login dan manajemen sesi **sepenuhnya ditangani Supabase Auth**, dipanggil langsung dari frontend (`frontend-react/src/services/supabaseClient.js` → `supabase.auth.signInWithPassword(...)`). Backend **tidak** punya endpoint `/login` atau `/register` sama sekali — hanya memverifikasi token akses yang dikirim frontend di header `Authorization: Bearer <token>` lewat `backend/middleware/supabaseAuth.middleware.js`, pada setiap route yang butuh login.

Poin penting:
- **Tidak ada halaman/endpoint registrasi mandiri.** Akun guru dibuat manual oleh tim pengembang lewat Supabase Admin API (lihat contoh di `backend/scripts/add_guru_batch2_dan_tka_fisika.js`) — insert ke `auth.users` sekaligus baris `profiles` yang sesuai.
- **Konvensi password awal = NIP guru.** Guru login pakai email + password (NIP) yang sudah dibuatkan, lalu disarankan ganti password sendiri lewat halaman Ubah Password (`/ubah-password`).
- Sesi (access token + refresh token) dikelola penuh oleh `@supabase/supabase-js` di browser — tidak ditulis manual ke `localStorage` oleh kode aplikasi ini.
- Route React yang butuh login dibungkus `<ProtectedRoute>` (`frontend-react/src/components/ProtectedRoute.jsx`), otomatis redirect ke `/login` kalau belum ada sesi aktif.
- Di backend, hampir semua route dipasangi `verifyToken` (kecuali endpoint publik yang memang tidak ada — semua route API di aplikasi ini butuh login).

---

## Alur Guru

Alur ideal yang jadi acuan desain seluruh aplikasi:

```
Login → Dashboard → Pelajari Materi → Pelajari Modul Wordwall → Buat Soal di Wordwall.net
→ Publish di Wordwall.net → Salin Play URL → Daftarkan ke Bank Soal TKA (di situs ini)
→ Coba Aktivitas TKA → Kerjakan Game Non-TKA → Pantau Progress di Dashboard Hasil
```

Beberapa langkah (membuat & publish soal di Wordwall.net) terjadi **di luar situs ini** — aplikasi tidak bisa memverifikasi langkah itu terjadi, jadi UI-nya (komponen `TrainingFlow`, ditampilkan di Dashboard) sengaja hanya menandai langkah yang bisa diverifikasi (✓) dan menandai langkah eksternal dengan simbol berbeda (↗), tidak berpura-pura tahu itu sudah dilakukan.

Alur 10 langkah di atas dikelompokkan jadi **4 tahap yang bisa dilacak** di Dashboard:
1. **Pelajari Materi & Modul** — dari `progress_materi`
2. **Buat & Daftarkan Aktivitas TKA** — dari `paket_soal` tipe TKA milik guru
3. **Kerjakan Latihan Smart Diagnostic (Non-TKA)** — dari `hasil_diagnostik`
4. **Lihat Progress Pelatihan** — Dashboard Hasil

---

## Bank Soal

Halaman `/bank-soal` — katalog bersama, dipisah dua tab utama: **TKA** dan **Non-TKA**, dikelompokkan lagi per bidang IPA (Biologi/Fisika/Kimia).

| | TKA | Non-TKA |
|---|---|---|
| Isi soal | Link ke aktivitas Wordwall yang dibuat guru sendiri | Soal pilihan ganda buatan tim pengembang, dimainkan lewat game bawaan situs |
| Guru bisa... | Membuat, mengedit, mempublish, menghapus paketnya sendiri (`/bank-soal/tka/baru`, `/bank-soal/tka/:id/edit`) | Hanya melihat & memainkan (read-only, tidak ada UI create/edit untuk guru) |
| Endpoint | `POST/PUT/DELETE /api/paket-soal/*` (dikunci `type: 'TKA'` di server) | Tidak ada endpoint tulis untuk guru — data diisi lewat script internal |

Paket berstatus `published` yang muncul sebagai pilihan aktif di halaman Smart Diagnostic (`/smart-diagnostic`).

---

## TKA / Wordwall

Aktivitas TKA (Tugas Kinerja Autentik) dibuat & dipublish langsung di **Wordwall.net** oleh guru, lalu link Play URL-nya didaftarkan ke situs ini untuk dimainkan lewat iframe.

**Status paket TKA punya 5 tahap** (dihitung otomatis dari `status` + `wordwall_url`, bukan kolom tersendiri — supaya tidak ada dua sumber kebenaran yang bisa tidak sinkron):

```
DRAFT → URL DIMASUKKAN → URL VALID → PUBLISHED → AKTIVITAS TERSEDIA
```

- **URL VALID** dicek murni dari format/hostname URL (`wordwall.net`), bukan lewat request jaringan.
- **Embeddability** (apakah link itu bisa ditampilkan lewat `<iframe>` atau harus fallback ke tombol "Buka di Wordwall") dicek terpisah lewat `GET /api/wordwall/check-embed?url=...` — endpoint ini murni informasional, **tidak** jadi syarat publish.
- Setiap kali guru membuka/memainkan aktivitas TKA (miliknya atau guru lain), tercatat di `tka_play_activity` untuk ditampilkan sebagai statistik "Dimainkan" di Dashboard Hasil.

Karena `check-embed` melakukan `fetch()` server-side ke URL yang datang dari input pengguna, endpoint ini dikeraskan terhadap SSRF (lihat [Keamanan](#keamanan)): whitelist hostname `wordwall.net`, validasi ulang setiap hop redirect, timeout per hop, dan penolakan kalau hostname-nya resolve ke alamat IP internal.

---

## Game Non-TKA

Game pilihan ganda React bawaan situs (`frontend-react/src/components/NonTkaGame.jsx`), dimainkan lewat `/smart-diagnostic`.

- **Bentuk soal yang didukung**: teks saja, teks + gambar, teks + tabel, atau kombinasi teks + gambar + tabel (tabel disimpan sebagai `table_data` JSON terstruktur di kolom `soal`, bukan sekadar teks berpola).
- **Urutan opsi jawaban diacak ulang di server setiap kali soal diambil** (`backend/controllers/soal.controller.js`) — bukan mengubah data sumber di database, murni supaya distribusi posisi jawaban benar tidak condong ke satu huruf tertentu (ditemukan lewat audit data: dulu ~87% jawaban benar Biologi ada di opsi B).
- **Skor dihitung di client** (`Math.round(correctCount/totalQuestions*100)`) lalu dikirim ke `POST /api/hasil-diagnostik`. Backend **memvalidasi ulang** nilai yang dikirim (skor 0-100, `correctCount` tidak melebihi `totalQuestions`, `totalQuestions` harus cocok jumlah soal asli di paket itu, dan skor harus konsisten dengan rumus yang sama) — menolak nilai yang secara matematis mustahil alih-alih mempercayai apa pun yang dikirim frontend.
- **Indikator "Kualitas Sesi"**: sesi yang diselesaikan sangat cepat (rata-rata di bawah 3 detik/soal) ditandai "Perlu Ditinjau" di riwayat Dashboard Hasil — murni indikator visual untuk ditinjau sendiri oleh guru, **tidak** mengecualikan sesi itu dari perhitungan Rata-rata Nilai/Nilai Tertinggi, dan **tidak** berarti sesi itu dianggap tidak sah.

---

## Dashboard

Ada dua halaman berbeda, jangan tertukar:

- **Dashboard (`/dashboard`)** — halaman pendaratan setelah login. Sapaan, tombol aksi cepat menuju tahap pelatihan yang belum selesai (`TrainingFlow`), kartu "Lanjutkan Pelatihan" yang menunjuk materi spesifik yang sedang dikerjakan (`ResumeCard`), akses cepat ke semua halaman, aktivitas terbaru, pengumuman.
- **Dashboard Hasil (`/hasil-diagnostik`)** — pusat pemantauan progress, dibagi 3 kategori jelas:
  1. **Pembelajaran** — checklist & persentase materi selesai
  2. **Non-TKA** — total latihan, rata-rata nilai, nilai tertinggi, tren nilai, performa per mata pelajaran, riwayat lengkap
  3. **TKA & Wordwall** — jumlah dibuat/dipublish/draft, jumlah dimainkan, aktivitas terakhir

**Progress Pelatihan** (persentase komposit yang tampil di kedua halaman) dihitung **satu kali di satu tempat** (`backend/controllers/dashboard.controller.js`, via `backend/config/progressWeights.js`) lewat endpoint agregat `GET /api/dashboard/hasil` — tidak ada halaman yang menghitung sendiri versinya masing-masing. Bobotnya (materi 40% / Non-TKA 30% / TKA 30%) masih perkiraan sementara, sengaja belum dikunci sampai ada angka resmi dari klien.

---

## Keamanan

Lapisan keamanan yang sudah berjalan (tidak terlihat guru, tapi wajib ada sebelum production):

- **Rate limiting** (`express-rate-limit`): limiter umum di seluruh `/api/*` (300 permintaan/15 menit per IP), plus limiter lebih ketat khusus endpoint tulis (`POST/PUT /api/paket-soal`, `POST /api/hasil-diagnostik`, 30 permintaan/15 menit). Login **tidak** lewat backend ini (lihat [Autentikasi](#autentikasi)), jadi rate limiting login sepenuhnya jadi tanggung jawab Supabase Auth.
- **CORS**: dibatasi lewat env var `CORS_ORIGIN` (daftar origin yang diizinkan, dipisah koma) — **wajib diisi di production** dengan domain Vercel asli, kalau tidak backend tetap fallback ke izinkan semua origin (lihat [Environment Variables](#environment-variables)).
- **SSRF hardening di `/api/wordwall/check-embed`**: whitelist hostname `wordwall.net`, redirect divalidasi ulang di setiap hop (bukan cuma URL awal), timeout per hop, dan hasil resolve DNS dicek supaya tidak mengarah ke alamat IP internal/privat (RFC1918, loopback, link-local, termasuk alamat metadata cloud).
- **Validasi nilai dari client tidak dipercaya mentah-mentah**: contoh konkret, `POST /api/hasil-diagnostik` menolak skor yang tidak sesuai dengan `correctCount`/`totalQuestions`, dan menolak `totalQuestions` yang tidak cocok jumlah soal asli di database.
- **Error handler global** di backend (`server.js`) mencegah stack trace/detail internal bocor ke response — semua error tak tertangani jatuh ke respons JSON generik.

---

## Development (Menjalankan Secara Lokal)

Backend dan frontend adalah dua proyek Node terpisah, dijalankan di dua terminal berbeda.

### Backend

```bash
cd backend
npm install
cp .env.example .env    # lalu isi nilainya, lihat Environment Variables di bawah
npm run dev              # nodemon, auto-restart saat file berubah
```

Server berjalan di `http://localhost:5000`. Database (tabel-tabel di atas) harus sudah ada di project Supabase yang ditunjuk `DATABASE_URL` — lihat riwayat migrasi di `backend/sql/`.

### Frontend

```bash
cd frontend-react
npm install
npm run dev
```

Vite akan menampilkan URL lokal (default `http://localhost:5173`). Frontend tidak butuh file `.env` — lihat [Environment Variables](#environment-variables) untuk alasannya. Guru harus login lebih dulu (akun harus sudah dibuat manual, lihat [Autentikasi](#autentikasi)) sebelum bisa membuka halaman selain `/login`.

Perintah lain yang tersedia di frontend: `npm run build` (build production), `npm run lint` (ESLint), `npm run preview` (jalankan hasil build secara lokal).

---

## Deployment

- **Frontend** → **Vercel**. Root Directory diset ke `frontend-react`, Framework Preset: Vite. File `frontend-react/vercel.json` menyediakan rewrite SPA (`/(.*) → /index.html`) supaya route React Router (mis. `/bank-soal`, `/materi/:id`) tidak 404 saat diakses/di-refresh langsung.
- **Backend** → **Railway**, terpisah dari frontend. Environment variables di [Environment Variables](#environment-variables) harus diisi lengkap di dashboard Railway — terutama `CORS_ORIGIN` harus diisi domain Vercel asli begitu sudah diketahui, kalau tidak backend tetap berjalan dengan CORS terbuka untuk semua origin.
- Kedua platform deploy independen — tidak ada langkah build gabungan; masing-masing repo/folder di-deploy sebagai proyek terpisah di platform masing-masing.

---

## Environment Variables

### Backend (`backend/.env`, salin dari `backend/.env.example`)

| Variabel | Wajib? | Keterangan |
|---|---|---|
| `PORT` | Opsional | Port server Express, default `5000`. |
| `CORS_ORIGIN` | **Wajib diisi di production** | Daftar origin frontend yang diizinkan, dipisah koma (mis. `https://smart-diagnostic-tka.vercel.app`). Kosong = fallback izinkan semua origin (aman untuk dev lokal, **tidak aman untuk production**). |
| `DATABASE_URL` | Wajib | Connection string Postgres dari Supabase (Settings → Database → Connection string → URI). |
| `SUPABASE_URL` | Wajib | URL project Supabase (Settings → API). |
| `SUPABASE_ANON_KEY` | Wajib | Anon/publishable key Supabase — dipakai untuk operasi yang tunduk RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Wajib | Service role key Supabase — hak akses penuh (dipakai backend untuk operasi admin, mis. script provisioning akun). **Jangan pernah diekspos ke frontend.** |

### Frontend

**Tidak ada file `.env`.** `SUPABASE_URL` dan anon key ditulis langsung di `frontend-react/src/services/supabaseClient.js` (sengaja, bukan kelalaian) — anon key memang dirancang aman untuk ikut ter-bundle ke kode yang dikirim ke browser, karena akses datanya dibatasi lewat Row Level Security di sisi Supabase, bukan lewat kerahasiaan key itu sendiri. `API_BASE_URL` (alamat backend) di `frontend-react/src/services/api.js` otomatis memilih `http://localhost:5000` saat dev lokal atau URL Railway saat production, berdasarkan hostname saat runtime — tidak perlu diset manual.

---

## Referensi Endpoint API

Semua endpoint di bawah butuh header `Authorization: Bearer <access_token_supabase>` kecuali disebutkan lain. Ambil token dengan login lewat Supabase Auth (lewat aplikasi frontend, atau `supabase.auth.signInWithPassword` langsung).

### Materi (`/api/materi`)
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/materi` | Daftar semua materi + progress guru yang login. |
| GET | `/api/materi/:id` | Detail satu materi. |
| POST | `/api/materi/:id/progress` | Update progress belajar. Body: `{ progress: 0-100 }`. |

### Bank Soal (`/api/paket-soal`)
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/paket-soal` | Daftar semua paket (bacaan bersama). Query opsional: `?status=published`, `?type=TKA\|NON_TKA`. |
| GET | `/api/paket-soal/:id` | Detail satu paket. |
| POST | `/api/paket-soal` | Buat paket TKA baru (dikunci `type: 'TKA'` di server, guru tidak bisa buat Non-TKA). Body: `{ title, subject, grade, hotsLevel, stimulus, wordwallUrl, status }`. Dibatasi rate limit. |
| PUT | `/api/paket-soal/:id` | Ubah paket — ditolak (403) kalau target bukan tipe TKA. Dibatasi rate limit. |
| DELETE | `/api/paket-soal/:id` | Hapus paket — ditolak (403) kalau target bukan tipe TKA. |
| POST | `/api/paket-soal/:id/played` | Catat "aktivitas TKA dimainkan" untuk guru yang login. Ditolak (400) kalau target bukan tipe TKA. |

### Soal (`/api/soal`)
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/soal?paketId=X` | Daftar butir soal satu paket Non-TKA, urutan opsi diacak per-request. |

### Hasil Diagnostik (`/api/hasil-diagnostik`)
| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/hasil-diagnostik` | Simpan hasil latihan Non-TKA. Divalidasi ketat di server (lihat [Game Non-TKA](#game-non-tka)). Dibatasi rate limit. |
| GET | `/api/hasil-diagnostik` | Riwayat hasil milik guru yang login. |

### Wordwall (`/api/wordwall`)
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/wordwall/check-embed?url=...` | Cek apakah sebuah URL Wordwall bisa ditampilkan lewat `<iframe>`. Dikeraskan terhadap SSRF (lihat [Keamanan](#keamanan)). |

### Dashboard (`/api/dashboard`)
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/dashboard/hasil` | Ringkasan agregat satu guru — Progress Pelatihan, materi, Non-TKA, TKA. Sumber tunggal data untuk halaman Dashboard dan Dashboard Hasil. |

---

## Struktur Folder

```
smart-diagnostic-tka/
├── backend/
│   ├── config/            # koneksi DB, Supabase admin client, bobot progress
│   ├── controllers/        # logika bisnis tiap fitur
│   ├── middleware/         # verifikasi token Supabase, rate limiting
│   ├── routes/             # definisi endpoint per fitur
│   ├── scripts/            # script one-off (provisioning akun, import soal)
│   ├── sql/                # riwayat migrasi (dijalankan manual per file)
│   ├── utils/               # helper murni (validasi URL Wordwall, guard SSRF)
│   ├── server.js            # entry point Express
│   └── .env.example
└── frontend-react/
    ├── src/
    │   ├── components/      # komponen dipakai ulang lintas halaman
    │   ├── pages/            # satu file per rute
    │   ├── data/             # fungsi fetch ke backend, per fitur
    │   ├── context/          # AuthContext (sesi & profil guru)
    │   ├── hooks/            # custom hooks lintas halaman
    │   ├── utils/             # helper murni (format tanggal, status Wordwall, dst)
    │   └── styles/            # design token & style global
    └── vercel.json           # rewrite SPA untuk deploy Vercel
```
