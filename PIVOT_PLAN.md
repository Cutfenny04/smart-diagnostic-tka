# Smart Diagnostic TKA — Requirement Pivot: Analysis & Implementation Plan (REVISI 6)

Status: **PLANNING ONLY — belum ada satu pun file kode yang diubah.** Menggantikan Revisi 5.

---

## Prinsip Implementasi (berlaku untuk seluruh dokumen ini)

- Jangan menambahkan fitur yang tidak ada di proposal.
- Gunakan kembali halaman yang sudah ada sebisa mungkin.
- Website ini **bukan** Learning Management System (LMS) dan **bukan** aplikasi pembuat soal.
- Website hanya berfungsi sebagai media pengelolaan materi, bank soal berbasis budaya Aceh (paket soal terhubung Wordwall), Smart Diagnostic yang mengarahkan ke Wordwall, serta dashboard hasil berbasis data prototype.
- Utamakan implementasi yang sederhana, konsisten dengan proposal, dan mudah dipresentasikan kepada dosen.

---

## Ringkasan Perubahan dari Revisi 5

| # | Koreksi Anda | Perbaikan di Revisi 6 |
|---|---|---|
| 1 | "Tambah Paket Soal / Edit Paket Soal" jangan terkesan dua halaman | Ditegaskan: **satu file** `detail-soal.html`, dua **mode** (Create/Edit) — lihat §7 |
| 2 | Status Draft/Published perlu aturan eksplisit | Ditambahkan §5, aturan jelas kapan status berubah dan artinya |
| 3 | Smart Diagnostic harus eksplisit hanya baca Published | Kalimat eksplisit ditambahkan di §6 |
| 4 | Phase 2 harus sebut Delete & View Detail juga, konsisten dengan DoD | Phase 2 di §9 diperbarui, 4 aksi CRUD lengkap disebut |
| 5 | Preview Panel perlu didefinisikan isinya | Ditambahkan §4, daftar isi eksplisit |
| 6 | Hapus field `wordwallName`, cukup `wordwallUrl` | Field dihapus dari §3, nama aktivitas ditampilkan dari `title` atau label generik "Aktivitas Wordwall" |
| 7 | Dashboard Hasil perlu kalimat pengaman tambahan | Ditambahkan di §6 |
| — | Perlu bagian "Batasan Sistem" sebelum Phase Implementation | **Ditambahkan §8**, persis 5 poin yang Anda tulis |

---

## 1. Bank Soal Berbasis Budaya Aceh — Definisi & Fungsi

> Bank Soal Berbasis Budaya Aceh merupakan halaman untuk **mengelola paket soal** yang terhubung dengan aktivitas Wordwall. Setiap paket memuat informasi materi, stimulus budaya Aceh, dan tautan aktivitas Wordwall yang digunakan pada Smart Diagnostic.

Guru dapat **menambah, mengubah, menghapus, dan melihat** paket soal. Yang dikelola adalah unit **paket soal**, bukan butir soal individual — struktur data tetap seperti §3, tidak ada field pertanyaan/opsi/jawaban.

---

## 2. Hubungan Antar Halaman: Materi ↔ Bank Soal ↔ Smart Diagnostic

- **Materi & Modul Pelatihan** — konten pelatihan HOTS untuk pengembangan kompetensi guru sendiri. Guru belajar mandiri di sini.
- **Bank Soal Berbasis Budaya Aceh** — guru mengelola paket soal (terhubung Wordwall) yang topiknya relevan dengan materi yang baru dipelajari.
- **Smart Diagnostic** — paket soal terpilih dipakai untuk asesmen siswa, lewat halaman pembuka stimulus lalu embed Wordwall.

```
Materi & Modul Pelatihan
    ↓ (guru mempelajari topik, mis. Fotosintesis)
Guru memilih/membuat paket soal yang sesuai topik tersebut
    ↓
Bank Soal Berbasis Budaya Aceh
    ↓ (guru memilih paket soal yang sesuai materi)
Smart Diagnostic
    ↓
Website membuka stimulus budaya Aceh (halaman pembuka)
    ↓
Embed Wordwall
```

---

## 3. Struktur Data — Paket Soal

### `Paket` (di `assets/data/bank-soal.js`)

```js
{
  id: 'paket-01',
  title: 'Fermentasi Kopi Gayo',        // Judul Materi — juga dipakai sebagai label aktivitas Wordwall
  subject: 'Kimia',                      // Bidang IPA
  grade: 'SMP',                          // Jenjang
  hotsLevel: 'C4',                       // Level HOTS
  stimulus: 'Kopi Gayo yang tumbuh di dataran tinggi Aceh Tengah melalui proses fermentasi biji sebelum disangrai...',
  wordwallUrl: 'https://wordwall.net/resource/xxxxx',  // opsional — satu-satunya field Wordwall
  status: 'draft',                        // 'draft' | 'published'
  createdAt: '2026-07-01'
}
```

**Perubahan dari Revisi 5:** field `wordwallName` dihapus. Nama aktivitas ditampilkan memakai `title` paket, atau label generik "Aktivitas Wordwall" di tombol/link — tidak perlu field terpisah.

6 informasi inti per paket: Judul Materi, Bidang IPA, Jenjang, Level HOTS, Stimulus Budaya Aceh, Link Wordwall — plus Status.

### `HasilPengerjaan` (di `assets/data/hasil.js`, tidak berubah)

```js
{
  id: 'hasil-01',
  studentName: 'Ahmad Fauzan',
  materi: 'Fermentasi Kopi Gayo',
  date: '2026-07-20',
  score: 85,
  status: 'Tuntas'
}
```

---

## 4. Isi Halaman Bank Soal — Card & Preview Panel

**Card di daftar paket** menampilkan: Judul, Bidang, Jenjang, Badge HOTS, Status, ringkasan singkat Stimulus.

**Preview Panel** (saat 1 paket dipilih) menampilkan:
- Judul
- Bidang
- Jenjang
- HOTS
- Stimulus
- Status
- Tombol **Smart Diagnostic** (buka paket ini langsung di Smart Diagnostic — hanya aktif/muncul kalau status Published)
- Tombol **Edit** (buka `detail-soal.html` dalam mode Edit untuk paket ini)

Ini yang jadi acuan tetap saat implementasi, supaya isi Preview Panel tidak berubah-ubah di tengah jalan.

---

## 5. Aturan Status Draft / Published

| Status | Arti | Perilaku |
|---|---|---|
| **Draft** | Paket belum siap digunakan (mis. link Wordwall belum diisi, atau guru masih menyiapkan) | Muncul di Bank Soal, **tidak muncul** sebagai pilihan di Smart Diagnostic |
| **Published** | Paket siap digunakan pada Smart Diagnostic | Muncul di Bank Soal **dan** jadi pilihan aktif di Smart Diagnostic |

**Published hanya muncul di Smart Diagnostic.** Ini aturan filtering utama — Smart Diagnostic tidak pernah menampilkan paket berstatus Draft ke pengguna.

---

## 6. Wordwall & Smart Diagnostic — Satu Prinsip

**Website menyimpan link aktivitas Wordwall dan menampilkannya melalui embed iframe saat guru membuka Smart Diagnostic.**

1. Guru mengisi informasi paket soal di web (judul, stimulus budaya Aceh, bidang, jenjang, HOTS).
2. Guru mendigitalisasi soal HOTS langsung di Wordwall, memakai stimulus sebagai acuan.
3. Guru tempel link Wordwall ke paket, ubah status jadi Published.
4. **Smart Diagnostic hanya menampilkan paket soal dengan status Published** — membaca paket tsb, tampilkan Wordwall-nya lewat embed iframe.

**Dashboard Hasil hanya berfungsi sebagai visualisasi contoh hasil diagnostik pada tahap prototype.**

---

## 7. Refactor Bank Stimulus → Bank Soal Berbasis Budaya Aceh (tidak berubah)

Satu evolusi, bukan halaman lama ditinggal + halaman baru dibuat terpisah:
- Konten budaya Aceh dari Bank Stimulus (15 deskripsi, 5 kategori) diserap jadi isi Stimulus Budaya Aceh per paket.
- Struktur halaman (card, search, filter, Preview Panel) dipakai ulang.
- Menu sidebar "Bank Stimulus" hilang karena sudah **menjadi** "Bank Soal Berbasis Budaya Aceh".

**Halaman Create/Edit menggunakan satu file, dua mode:**

```
Mode:
- Tambah Paket Soal
- Edit Paket Soal

File:
detail-soal.html   (satu file untuk kedua mode — bukan dua halaman terpisah)
```

---

## 8. Batasan Sistem

- Website tidak membuat soal.
- Website tidak mengoreksi jawaban siswa.
- Website tidak menyimpan hasil pengerjaan Wordwall.
- Website tidak memiliki integrasi API dengan Wordwall.
- Website hanya mengelola paket soal dan menampilkan aktivitas Wordwall melalui iframe.

---

## 9. Daftar Halaman Final (8 halaman)

| # | Halaman | File |
|---|---|---|
| 1 | Login | `login.html` |
| 2 | Dashboard | `dashboard.html` |
| 3 | Materi & Modul Pelatihan | `materi.html` |
| 4 | Bank Soal Berbasis Budaya Aceh | `bank-soal.html` |
| 5 | Detail Paket Soal — mode Tambah / Edit (satu file, dua mode) | `detail-soal.html` |
| 6 | Smart Diagnostic (termasuk halaman pembuka stimulus budaya Aceh) | `smart-diagnostic.html` |
| 7 | Dashboard Hasil | `hasil-diagnostik.html` |
| 8 | Profil | `profil.html` |

---

## 10. Rencana Implementasi (urutan prioritas)

```
Phase 1
✔ Refactor Sidebar
✔ Refactor Dashboard
✔ Refactor Bank Soal

Phase 2
✔ Tambah Paket Soal (Create)
✔ Edit Paket Soal (Update)
✔ Hapus Paket Soal (Delete)
✔ Lihat Detail Paket Soal (View, lewat Preview Panel)

Phase 3
✔ Smart Diagnostic

Phase 4
✔ Dashboard Hasil

Phase 5
✔ Polish UI
✔ Responsive
✔ Testing
```

**Detail Phase 1:**
- Sidebar: satu entri "Bank Soal Berbasis Budaya Aceh".
- Dashboard: quick-access disesuaikan, hapus Recommendation dari Materi.
- Refactor Bank Soal:
  1. Refactor struktur Bank Stimulus menjadi Bank Soal Berbasis Budaya Aceh.
  2. Menggunakan kembali seluruh data stimulus budaya Aceh yang sudah dibuat.
  3. Menyesuaikan struktur data menjadi informasi paket soal (§3).
  4. Menyesuaikan tampilan card, filter, preview panel (§4), dan pencarian.

**Detail Phase 2:**
- Bangun `detail-soal.html` (§7) — satu file, mode Tambah/Edit, form 6 field + status.
- Delete dan View Detail memakai pola yang sudah ada di Bank Soal (tombol hapus di card/menu aksi, Preview Panel untuk lihat detail) — tidak perlu halaman terpisah untuk ini.

**Detail Phase 3:**
- Bangun `smart-diagnostic.html`: pilih paket **Published saja** (§5) → stimulus budaya Aceh (halaman pembuka) → tombol "Mulai Diagnostik" → embed iframe Wordwall.

**Detail Phase 4:**
- Bangun `hasil-diagnostik.html` + `assets/data/hasil.js`: jumlah siswa, rata-rata nilai, tuntas/belum tuntas, satu grafik sederhana, tabel hasil. Visualisasi contoh hasil pada tahap prototype (§6).

**Detail Phase 5:**
- Polish UI seluruh halaman baru/diubah agar konsisten dengan Design System.
- Uji responsive desktop & tablet.
- Testing menyeluruh: tidak ada broken link, tidak ada halaman lama yang masih muncul di navigasi.

---

## 11. Definition of Done

Implementasi dianggap selesai apabila:
- Semua halaman sesuai proposal.
- Tidak ada fitur AI.
- Tidak ada editor soal di website.
- Bank Stimulus sudah direfactor menjadi Bank Soal Berbasis Budaya Aceh.
- Guru dapat menambah, mengubah, menghapus, dan melihat paket soal.
- Smart Diagnostic dapat membuka aktivitas Wordwall melalui iframe.
- Dashboard Hasil menampilkan prototype hasil diagnostik.
- Seluruh halaman menggunakan design system yang sama.
- Responsive desktop dan tablet.
- Tidak ada broken link atau halaman lama yang masih muncul di navigasi.

---

## 12. Risiko & Pertanyaan Terbuka

| Area | Catatan |
|---|---|
| Guru membuat soal di web? | Tetap tidak diasumsikan ada fitur susun pertanyaan/opsi/jawaban — "mengelola paket soal" berarti CRUD atas paket, bukan CRUD atas butir soal |
| Bentuk stimulus/halaman pembuka di Smart Diagnostic | Belum ada arahan detail visual — dibangun sesederhana mungkin dulu |

---

## Menunggu Persetujuan

Belum ada satu pun file kode yang diubah. Kalau §3 (struktur data), §5 (aturan status), dan §8 (Batasan Sistem) sudah sesuai, saya siap mulai Phase 1.
