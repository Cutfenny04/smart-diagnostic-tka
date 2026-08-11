# smart-diagnostic-tka
Platform Pelatihan Penyusunan Instrumen HOTS IPA Berbasis Smart Diagnostic TKA Terintegrasi Game Digital Budaya Aceh.

Prototipe untuk Pengabdian Masyarakat, terdiri dari frontend (React + Vite) di `frontend-react/` dan backend nyata (Express + Supabase/PostgreSQL) di `backend/`. Login/Register, Bank Soal Berbasis Budaya Aceh, Smart Diagnostic, Dashboard Hasil, Profil, dan Ubah Password sudah terhubung ke backend sungguhan.

**`PIVOT_PLAN.md` (Revisi 8) adalah sumber kebenaran utama untuk arsitektur dan status tiap fase saat ini** — dokumen ini (README) hanya ringkasan menjalankan/deploy, jangan dianggap otoritatif soal fitur apa yang ada. Lihat juga `DESIGN_SYSTEM.md` untuk seluruh token dan komponen UI, dan `backend/README.md` untuk setup database serta daftar endpoint API (catatan: `backend/README.md` juga masih mendokumentasikan API lama sebelum Revisi 8 — cek `PIVOT_PLAN.md` §B/§C untuk state terkini).

Sejak Revisi 8: Bank Soal adalah bacaan bersama, bukan lagi milik per-guru — guru tidak lagi membuat/mengedit/menghapus paket soal dari UI (endpoint backend-nya masih ada tapi sudah tidak dipanggil dari frontend). Paket soal terbagi dua tipe: **TKA** (link Wordwall yang diinput guru) dan **Non-TKA** (soal pilihan ganda buatan tim dev, dimainkan lewat game React bawaan situs).

## Menjalankan secara lokal

Backend dan frontend dijalankan terpisah:

1. **Backend** — ikuti `backend/README.md` (install dependency, setup database Supabase dari `backend/sql/supabase_schema.sql`, copy `.env.example` ke `.env`, lalu `npm run dev` di dalam folder `backend/`). Server berjalan di `http://localhost:5000`.
2. **Frontend** — di dalam folder `frontend-react/`, jalankan `npm install` lalu `npm run dev`, buka URL yang ditampilkan Vite (default `http://localhost:5173`). Guru harus register/login lebih dulu (lewat backend yang aktif) sebelum bisa mengakses halaman lain.

## Deploy

Frontend di-deploy ke Vercel dengan Root Directory `frontend-react` (Framework Preset: Vite). File `frontend-react/vercel.json` menyediakan rewrite SPA supaya semua rute React Router (mis. `/bank-soal`, `/materi/:id`) tidak 404 saat diakses/direfresh langsung. Backend di-deploy terpisah ke Railway.

## Halaman

Login &middot; Dashboard &middot; Materi & Modul Pelatihan (+ Detail Materi) &middot; Bank Soal Berbasis Budaya Aceh (read-only, tanpa halaman create/edit) &middot; Smart Diagnostic (router TKA/Non-TKA, termasuk game Non-TKA) &middot; Dashboard Hasil &middot; Profil (+ Ubah Password).
