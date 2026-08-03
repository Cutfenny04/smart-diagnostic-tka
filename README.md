# smart-diagnostic-tka
Platform Pelatihan Penyusunan Instrumen HOTS IPA Berbasis Smart Diagnostic TKA Terintegrasi Game Digital Budaya Aceh.

Prototipe untuk Pengabdian Masyarakat, terdiri dari frontend (HTML/CSS/vanilla JS, tanpa framework) di `frontend/` dan backend nyata (Express + Supabase/PostgreSQL) di `backend/`. Login/Register dan Bank Soal Berbasis Budaya Aceh sudah terhubung ke backend sungguhan; lihat `PIVOT_PLAN.md` untuk arsitektur lengkap dan status tiap fase, `DESIGN_SYSTEM.md` untuk seluruh token dan komponen UI, dan `backend/README.md` untuk setup database serta daftar endpoint API.

## Menjalankan secara lokal

Backend dan frontend dijalankan terpisah:

1. **Backend** — ikuti `backend/README.md` (install dependency, setup database Supabase dari `backend/sql/supabase_schema.sql`, copy `.env.example` ke `.env`, lalu `npm run dev` di dalam folder `backend/`). Server berjalan di `http://localhost:5000`.
2. **Frontend** — serve folder `frontend/` dengan static file server (mis. `python -m http.server 8642` di dalam folder tersebut), lalu buka `http://localhost:8642/login.html`. Guru harus register/login lebih dulu (lewat backend yang aktif) sebelum bisa mengakses halaman lain.

## Halaman

Login &middot; Dashboard &middot; Materi & Modul Pelatihan (+ Detail Materi) &middot; Bank Soal Berbasis Budaya Aceh &middot; Detail Paket Soal (create/edit) &middot; Smart Diagnostic &middot; Dashboard Hasil &middot; Profil (+ Ubah Password).
