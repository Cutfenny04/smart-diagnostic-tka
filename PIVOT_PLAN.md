# Smart Diagnostic TKA — Requirement Pivot: Analysis & Implementation Plan (REVISI 8)

Status: **Revisi 8 — pivot besar, tahap perencanaan & migrasi skema.** Revisi 7 (di Lampiran, §1–§13) menyatakan proyek "final prototype" dengan guru sebagai pembuat paket soal (CRUD penuh) dan satu jenis soal (Wordwall). Revisi 8 mengubah dua asumsi dasar itu: guru menjadi **pengguna/konsumen** bank soal (bukan penulisnya), dan bank soal terbagi jadi dua jalur — **TKA** (Wordwall, seperti sekarang) dan **Non-TKA** (game interaktif React, baru). Lihat §B untuk detail arah baru, §C untuk urutan pengerjaan.

---

## Prinsip Implementasi (tetap berlaku, dari Revisi 1–7)

- Jangan menambahkan fitur yang tidak ada di proposal/konsep yang disepakati.
- Gunakan kembali halaman/komponen yang sudah ada sebisa mungkin.
- Website ini **bukan** Learning Management System (LMS) penuh.
- Utamakan implementasi yang sederhana, konsisten, dan mudah dipresentasikan ke dosen/klien.

---

## Ringkasan Perubahan Revisi 7 → Revisi 8

| # | Revisi 7 (lama) | Revisi 8 (baru) |
|---|---|---|
| 1 | Guru CRUD penuh atas paket soal (Tambah/Edit/Hapus) | Guru **hanya membaca** bank soal (browse + detail + mulai diagnostik). Tim pengembang yang input soal ke database. |
| 2 | Satu jenis soal: link Wordwall per paket | Dua jenis: **TKA** (Wordwall, seperti sekarang) dan **Non-TKA** (game React interaktif, baru) |
| 3 | `paket_soal` dimiliki per-guru (`guru_id`, difilter per akun) | `paket_soal` jadi **bank bersama** — semua guru melihat paket yang sama; `guru_id` lama berubah makna jadi audit "siapa yang input", bukan kepemilikan/filter |
| 4 | Tidak ada tabel butir soal individual | Tabel baru `soal` (butir soal per paket, dipakai game Non-TKA; `game_type` menentukan bentuk interaksi) |
| 5 | Dashboard Hasil = data prototype statis (`hasilData.js`, tidak tersambung DB) | Tabel baru `hasil_diagnostik` — jadi tujuan akhir (belum tentu diisi otomatis di Revisi 8 tahap ini, lihat §C) |
| 6 | Modul Panduan Guru belum ada | Modul Panduan Guru (PDF, BAB 1–8) — deliverable terpisah, tidak bergantung kode, lihat §B5 |

---

## A. Kondisi Saat Ini (state proyek per 2026-08-10, sebelum Revisi 8 dikerjakan)

Ringkasan konkret apa yang sudah dibangun, supaya jelas titik berangkatnya.

### Backend (`backend/`, Express + PostgreSQL/Supabase)

- **Auth** (`routes/auth.routes.js`, `controllers/auth.controller.js`): register, login (JWT 7 hari, bcrypt), ubah password. Hanya untuk akun `guru`, tidak ada akun siswa/admin terpisah.
- **Materi** (`routes/materi.routes.js`, `controllers/materi.controller.js`): list materi + progress per guru (`progress_materi`), detail materi, update progress (0–100).
- **Paket Soal / Bank Soal** (`routes/paketSoal.routes.js`, `controllers/paketSoal.controller.js`): CRUD lengkap (list, getById, create, update, remove) — **tapi semuanya difilter `WHERE guru_id = req.guru.id`**, artinya tiap guru hanya melihat & mengelola paketnya sendiri. Validasi: judul/bidang/jenjang/HOTS/stimulus wajib; link Wordwall wajib kalau status di-set Published.
- **Skema DB** (`backend/sql/supabase_schema.sql`): 4 tabel — `guru`, `materi`, `paket_soal` (satu jenis, Wordwall-only, draft/published, milik guru_id), `progress_materi`. **Belum ada** tabel `soal` (butir soal) atau `hasil_diagnostik`.
- **Seed data** (`backend/sql/supabase_seed_data.sql`): 1 guru (Budi Santoso), 3 materi, 3 paket_soal (1 published dengan link Wordwall "Kopi Gayo", 2 draft tanpa link).

### Frontend (`frontend-react/`, React + Vite)

- **Halaman**: Login, Dashboard, Materi + DetailMateri, BankSoal + DetailSoal (form Create/Edit satu file dua mode, sesuai Revisi 7 §7), SmartDiagnostic, HasilDiagnostik, Profil + UbahPassword.
- **BankSoal + DetailSoal**: guru bisa Tambah/Edit/Hapus paket (modal konfirmasi hapus), lihat lewat Preview Panel — persis sesuai desain CRUD Revisi 7.
- **SmartDiagnostic** (`pages/SmartDiagnostic.jsx`): 3 view dalam satu halaman — daftar paket **Published** → Stimulus Budaya Aceh (halaman pembuka) → embed iframe Wordwall (atau empty state kalau link kosong). Tidak ada timer/skor/penyimpanan jawaban.
- **HasilDiagnostik** (`pages/HasilDiagnostik.jsx` + `data/hasilData.js`): **100% data prototype statis di frontend** (12 baris dummy, delay 700ms simulasi fetch) — tidak tersambung ke backend sama sekali, karena tabel `hasil_diagnostik` memang belum ada.
- **Design System**: `DESIGN_SYSTEM.md` — token warna/tipografi/komponen dipakai konsisten di semua halaman.
- **Deploy**: frontend → Vercel (Root Directory `frontend-react`), backend → Railway (terpisah).

### Batasan sistem yang sudah berlaku (dan sebagian masih relevan di Revisi 8)

Website tidak membuat soal butir-per-butir, tidak mengoreksi jawaban, tidak menyimpan hasil pengerjaan Wordwall, tidak ada integrasi API dengan Wordwall — hanya kelola metadata paket + tampilkan iframe.

---

## B. Arah Baru (Revisi 8)

### B1. Peran Guru Berubah — dari Pembuat jadi Pengguna

Guru **tidak lagi** melakukan Tambah/Edit/Hapus paket soal. Tim pengembang menerima soal dari klien/pengabdian, menyusun paket (termasuk membuat aktivitas Wordwall untuk TKA atau game React untuk Non-TKA), lalu memasukkannya langsung ke database. Guru hanya: login → browse Bank Soal → lihat detail paket (read-only) → mulai Smart Diagnostic → lihat hasil.

**Dampak konkret ke kode yang sudah ada** (dikerjakan di fase selanjutnya, §C, bukan sekarang):
- `DetailSoal.jsx` (mode Create/Edit) dan tombol Tambah/Edit/Hapus di `BankSoal.jsx` akan dinonaktifkan/dihapus dari sisi guru.
- Endpoint `create`/`update`/`remove` di `paketSoal.controller.js` berhenti dipakai guru (disimpan untuk kebutuhan admin nanti, atau dipagari di belakang autentikasi tambahan — belum diputuskan, lihat pertanyaan terbuka di §D).
- Filter `WHERE guru_id = $1` di `list`/`getById` dihapus — Bank Soal jadi bacaan bersama untuk semua guru, bukan privat per akun.

### B2. Bank Soal: Split TKA / Non-TKA

```
BANK SOAL
│
├── TKA       → embed/link Wordwall (mekanisme yang sudah ada, dipertahankan)
│
└── NON-TKA   → game interaktif React, dibangun tim dev dari soal client (Word/PDF)
                nuansa budaya Aceh sebagai KONTEKS soal (bukan cuma dekorasi):
                visual (ornamen, motif, ilustrasi lokal), konteks (kopi Gayo,
                pesisir, pertanian, hutan, dst), dan bentuk interaksi.
```

Jenis game Non-TKA pertama yang dibangun: **pilihan jawaban interaktif** (stimulus + ilustrasi + pertanyaan + 4 opsi). Jenis lain (drag & drop, matching, puzzle, identifikasi gambar, pengurutan) menyusul setelah mekanisme pertama stabil — **tidak dikerjakan sekaligus**.

Smart Diagnostic jadi router sederhana:
```
type === 'TKA'      → alur Wordwall yang sudah ada (stimulus → embed iframe)
type === 'NON_TKA'  → alur game React (stimulus → game component sesuai game_type)
```

### B3. Data Model v2 (Supabase) — lihat draft SQL terpisah

Perubahan pada `paket_soal` (bukan tabel baru — di-ALTER dari yang sudah ada):
- tambah `type` (`TKA` / `NON_TKA`)
- `guru_id` lama berubah makna jadi `created_by_guru_id` (audit, nullable) — bukan lagi dasar filter kepemilikan

Tabel baru:
- **`soal`** — butir soal per paket (dipakai Non-TKA): `question`, `stimulus`, `image`, `options` (JSON), `correct_answer`, `game_type`, `order_number`.
- **`hasil_diagnostik`** — hasil pengerjaan: `paket_id`, siapa yang menjalankan sesi, skor, jumlah benar/salah, waktu mulai/selesai.

Draft lengkap ada di `backend/sql/supabase_migration_v2_pivot.sql` (belum dijalankan ke Supabase — lihat catatan di file itu).

### B4. Modul Panduan Guru (PDF)

Deliverable terpisah, tidak bergantung pada kode: panduan langkah-demi-langkah (BAB 1–8, sesuai struktur di konsep awal) untuk guru yang belum pernah pakai platform. Bisa dikerjakan kapan saja secara paralel dengan pivot teknis di atas.

### B5. Batasan Sistem (update dari Revisi 7 §8)

- Website tidak membuat soal dari nol di sisi guru — soal disiapkan tim dev dari materi klien.
- Website tidak mengoreksi jawaban Wordwall (TKA) — itu domain Wordwall sepenuhnya.
- Untuk Non-TKA, website **menghitung skor sendiri** (karena game-nya dibangun in-house) — beda dari TKA.
- Belum ada akun siswa terpisah — siapa yang "menjalankan" sesi diagnostik masih terikat akun guru yang login (pertanyaan terbuka soal `hasil_diagnostik`, lihat §D).

---

## C. Rencana Fase Revisi 8 (urutan pengerjaan)

```
Fase 1 (dokumen ini + draft schema)     ✔ sedang dikerjakan
  - Revisi 8 tertulis (dokumen ini)
  - Draft migrasi SQL (belum dijalankan ke Supabase)

Fase 2 — Migrasi skema live                                    ✔ selesai (2026-08-11)
  - Migration dijalankan ke Supabase, termasuk 3 perbaikan tak terduga (PK,
    identity, DEFAULT NOW() yang hilang di tabel live) dan kolom tambahan
    `soal.explanation`
  - Input soal: dipakai jalur Node script langsung ke DB (bukan Table Editor
    manual) -- `backend/scripts/import_soal_non_tka.js`, 90 soal Non-TKA
    (Fisika/Biologi/Kimia) sudah masuk berstatus draft

Fase 3 — Frontend: guru jadi read-only                          ✔ selesai (2026-08-11)
  - BankSoal.jsx: tombol Tambah/Edit/Hapus dihapus, filter Tipe (TKA/Non-TKA)
    ditambahkan, Preview Panel menyembunyikan bagian Wordwall untuk paket
    Non-TKA
  - DetailSoal.jsx dihapus total (bukan dibuat read-only) -- Preview Panel di
    BankSoal.jsx sudah menjadi satu-satunya tampilan detail, sesuai prinsip
    "View = Preview Panel" yang sudah dipakai sejak Revisi 7
  - Backend: paketSoal.controller.js -- filter `WHERE guru_id` dihapus dari
    list/getById; endpoint create/update/remove **sengaja belum diubah**
    (bukan bug -- lihat §D, keputusan lock-down belum diambil)

Fase 4 — Smart Diagnostic router                                ✔ selesai (2026-08-11)
  - Percabangan type TKA/NON_TKA ditambahkan di SmartDiagnostic.jsx: setelah
    view Stimulus, `onStart` merutekan ke view `embed` (TKA, alur existing
    dipakai ulang) atau `game` (NON_TKA, placeholder "segera hadir")
  - DiagnosticCard di daftar paket dikasih badge Tipe (TKA/Non-TKA) supaya
    daftar campuran kedua tipe tetap jelas
  - Diuji end-to-end di browser dengan data sementara (1 paket TKA + Fisika
    NON_TKA di-publish sebentar): kedua jalur dikonfirmasi merutekan dengan
    benar, lalu data uji dihapus/dikembalikan ke draft

Fase 5 — Game Non-TKA pertama                                   ✔ selesai (2026-08-11), sebagian
  - Backend baru: GET /api/soal?paketId=X (soal.controller.js/soal.routes.js)
    -- belum ada sebelumnya, migration cuma bikin tabelnya
  - Komponen React `NonTkaGame.jsx`: stimulus + gambar (kalau ada) + 4 kartu
    pilihan jawaban interaktif, feedback benar/salah + penjelasan langsung
    setelah memilih, progress "Soal X dari N", skor & hasil akhir di layar
    terakhir
  - Diuji end-to-end di browser (30 soal Fisika penuh, termasuk soal
    bergambar no.3), jawaban benar/salah/progress/hasil akhir semua benar
  - **Belum selesai**: nuansa budaya Aceh pada game masih terbatas pakai
    palet warna & tipografi Design System yang sudah Aceh-flavored;
    ilustrasi/motif Aceh khusus untuk game belum dibuat (soal-soal impor
    juga sebagian besar belum bernuansa Aceh secara konten, lihat catatan
    di §A soal Non-TKA)

Fase 6 — Dashboard Hasil nyata                                  ✔ selesai (2026-08-11)
  - Backend baru: POST + GET /api/hasil-diagnostik (hasilDiagnostik.controller.js/
    routes.js) -- GET difilter per guru_id yang login (beda dari paket_soal/soal
    yang bacaan bersama; hasil diagnostik itu aktivitas pribadi tiap guru)
  - NonTkaGame.jsx: begitu soal terakhir dijawab, hitung skor lalu POST ke
    hasil-diagnostik sebelum menampilkan layar hasil; layar hasil kini
    menunjukkan status simpan sungguhan (berhasil/gagal), bukan lagi catatan
    "belum tersimpan"
  - HasilDiagnostik.jsx dirombak total dari data dummy (hasilData.js) ke
    GET /api/hasil-diagnostik sungguhan -- kartu ringkasan (Total Latihan,
    Rata-rata Nilai, Nilai Latihan Terakhir, Tuntas), grafik Tuntas vs Belum
    Tuntas, dan tabel Riwayat Latihan (Paket/Tipe/Benar/Nilai/Tanggal/Status).
    Status Tuntas pakai ambang KKM_THRESHOLD = 70 (belum ada arahan resmi
    dari klien, didokumentasikan sebagai asumsi di kode)
  - Diuji end-to-end di browser: 2 kali main penuh (10 dan 87), dikonfirmasi
    tersimpan lewat POST 201, muncul benar di Dashboard Hasil (rata-rata,
    status Tuntas/Belum Tuntas, urutan terbaru dulu), lalu semua data uji
    dihapus/dikembalikan

Fase 7 — Perapian sebelum nambah jenis game baru               ✔ selesai (2026-08-11)
  - `PASSING_SCORE` dipindah ke satu tempat (`frontend-react/src/utils/scoring.js`),
    dipakai bareng oleh NonTkaGame.jsx (badge Tuntas/Belum Tuntas di layar
    hasil) dan HasilDiagnostik.jsx -- masih nilai 70 (asumsi KKM umum,
    BUKAN aturan final), tinggal ubah satu angka itu saja kalau klien kasih
    angka resmi
  - Nuansa Aceh pertama masuk ke game: motif dekoratif "pucuk rebung"
    (AcehMotifDivider.jsx, SVG, warna dari token yang sudah ada) tampil
    permanen sebagai identitas visual game -- tidak tergantung isi soal.
    Badge "Konteks Budaya Aceh" muncul HANYA kalau teks soal/stimulus
    memang menyebut sesuatu yang Aceh-spesifik (dicek lewat daftar kata
    kunci) -- diuji benar cuma muncul di 2 dari 30 soal Fisika (no.14 Pak
    Budi Banda Aceh-Sigli, no.15 kuah beulangong), tidak muncul di soal lain
  - Audit 90 soal Non-TKA terhadap Game 1-4: **kesimpulannya semua 90 soal
    memang murni pilihan ganda tunggal, cocok untuk Game 1 saja.** Tidak ada
    yang siap pakai untuk Matching/Drag&Drop/Gambar tanpa ditulis ulang.
    4 kandidat ditandai untuk KALAU nanti ada soal baru yang memang dibuat
    untuk format itu: pasangan besaran-satuan SI (Fisika #2, cocok
    Matching), skalar vs vektor (Fisika #5, cocok Drag&Drop -- sortir ke 2
    kelompok), diagram sel tumbuhan berlabel (Biologi #3, sudah ada gambar
    berlabel, cocok Gambar/identifikasi), peran organisme rantai makanan
    (Biologi #17 & #22, cocok Matching, bentuknya mirip contoh yang
    diberikan user). **Keputusan: Game 2-4 TIDAK dikerjakan sekarang** --
    tunggu ada soal yang memang dibuat untuk format itu, jangan
    dipaksakan dari 90 soal MC yang sudah ada.

(Paralel, tidak blocking apa pun di atas)
Modul Panduan Guru (PDF)                                         🟡 belum dikerjakan
```

---

## D. Pertanyaan Terbuka (perlu keputusan sebelum Fase 2 dijalankan ke Supabase live)

| Area | Pertanyaan |
|---|---|
| Input soal | Tim dev input lewat Supabase Table Editor/SQL manual dulu, atau perlu panel admin terpisah dari awal? |
| Endpoint create/update/remove lama | Dihapus total, atau dipagari untuk kebutuhan admin di masa depan (butuh role baru)? |
| `hasil_diagnostik` kepemilikan sesi | Karena belum ada akun siswa — sesi diagnostik dicatat atas nama guru yang login (kelasnya), dengan `student_name` bebas teks seperti data dummy sekarang? Atau ditunda sampai ada akun siswa? |
| Migrasi data lama | 3 paket_soal seed yang ada sekarang (`kopi-gayo`, `tes`, `tes lagi`) semuanya diberi `type = 'TKA'` default saat migrasi (karena semua masih pola Wordwall) — sudah benar? |

### D1. Gap ditemukan 2026-08-11: tidak ada mekanisme publish

Setelah Bank Soal jadi read-only (Fase 3), **tidak ada satu pun tempat di aplikasi** yang bisa mengubah status paket dari `draft` ke `published` — tombolnya sengaja dihapus dari sisi guru, dan belum ada panel admin pengganti. Satu-satunya cara sampai saat ini adalah UPDATE langsung ke Supabase (lewat script Node atau SQL Editor).

Dampaknya sempat nyata: ketiga paket Non-TKA (Fisika/Biologi/Kimia) tertinggal berstatus `draft` di production setelah sesi testing, sehingga Smart Diagnostic tampak kosong bagi pengguna sungguhan. Sudah di-publish manual (2026-08-11) supaya bisa langsung dipakai, tapi **ini bukan solusi permanen** — kalau ada paket baru di masa depan, publish-nya masih harus manual lewat DB sampai salah satu dari dua hal ini diputuskan/dibangun:
- Panel admin minimal (form sederhana untuk toggle status paket), atau
- Guru tertentu (role baru) diberi akses terbatas untuk publish tanpa full CRUD.

Belum diprioritaskan karena belum ada permintaan eksplisit dari klien.

---

## Lampiran — Riwayat Desain Revisi 1–7

*(Dipertahankan sebagai catatan sejarah. Sebagian besar sudah digantikan oleh Revisi 8 di atas — terutama soal kepemilikan paket oleh guru dan single-type Wordwall-only. Baca §B di atas sebagai rujukan utama, bukan bagian ini.)*

### 1. Bank Soal Berbasis Budaya Aceh — Definisi & Fungsi (Revisi 7)

> Bank Soal Berbasis Budaya Aceh merupakan halaman untuk **mengelola paket soal** yang terhubung dengan aktivitas Wordwall. Setiap paket memuat informasi materi, stimulus budaya Aceh, dan tautan aktivitas Wordwall yang digunakan pada Smart Diagnostic.

Guru dapat **menambah, mengubah, menghapus, dan melihat** paket soal — **superseded oleh B1 di atas: guru sekarang read-only.**

### 2. Struktur Data — Paket Soal (Revisi 7, superseded oleh B3)

```js
{
  id: 'paket-01',
  title: 'Fermentasi Kopi Gayo',
  subject: 'Kimia',
  grade: 'SMP',
  hotsLevel: 'C4',
  stimulus: 'Kopi Gayo yang tumbuh di dataran tinggi Aceh Tengah...',
  wordwallUrl: 'https://wordwall.net/resource/xxxxx',
  status: 'draft',
  createdAt: '2026-07-01'
}
```

### 3. Aturan Status Draft / Published (masih berlaku, tidak berubah di Revisi 8)

| Status | Arti | Perilaku |
|---|---|---|
| **Draft** | Paket belum siap digunakan | Muncul di Bank Soal, **tidak muncul** di Smart Diagnostic |
| **Published** | Paket siap digunakan | Muncul di Bank Soal **dan** jadi pilihan aktif di Smart Diagnostic |

### 4. Daftar Halaman (Revisi 7, 8 halaman — tetap dipertahankan strukturnya di Revisi 8, hanya perilaku CRUD yang berubah)

| # | Halaman | File |
|---|---|---|
| 1 | Login | `Login.jsx` |
| 2 | Dashboard | `Dashboard.jsx` |
| 3 | Materi & Modul Pelatihan | `Materi.jsx` + `DetailMateri.jsx` |
| 4 | Bank Soal Berbasis Budaya Aceh | `BankSoal.jsx` |
| 5 | Detail Paket Soal | `DetailSoal.jsx` (Revisi 7: mode Tambah/Edit → Revisi 8: read-only) |
| 6 | Smart Diagnostic | `SmartDiagnostic.jsx` |
| 7 | Dashboard Hasil | `HasilDiagnostik.jsx` |
| 8 | Profil | `Profil.jsx` + `UbahPassword.jsx` |

### 5. Definition of Done — Revisi 7 (tercapai, ditutup)

```
Phase 1 ✔  Phase 2 ✔  Phase 3 ✔  Phase 4 ✔  Phase 5 ✔
Project Status (Revisi 7): FINAL PROTOTYPE — READY FOR DEMONSTRATION
```

Addendum pasca-Revisi-7: backend nyata (Express + Supabase/PostgreSQL) dibangun menggantikan localStorage/dummy data untuk Login/Register dan CRUD Bank Soal. `detail-materi.html`/`DetailMateri.jsx` dan `ubah-password.html`/`UbahPassword.jsx` dibangun karena direferensikan oleh link aktif. `bank-stimulus`/`detail-stimulus` sengaja dibiarkan mati (sudah digantikan Bank Soal sejak awal, tidak ada link yang mengarah ke sana).
