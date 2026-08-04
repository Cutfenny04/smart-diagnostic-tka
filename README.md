# smart-diagnostic-tka
Platform Pelatihan Penyusunan Instrumen HOTS IPA Berbasis Smart Diagnostic TKA Terintegrasi Game Digital Budaya Aceh.

Prototipe untuk Pengabdian Masyarakat, terdiri dari frontend (React + Vite) di `frontend-react/` dan backend nyata (Express + Supabase/PostgreSQL) di `backend/`. Login/Register, Bank Soal Berbasis Budaya Aceh, Smart Diagnostic, Dashboard Hasil, Profil, dan Ubah Password sudah terhubung ke backend sungguhan; lihat `PIVOT_PLAN.md` untuk arsitektur asli dan status tiap fase, `DESIGN_SYSTEM.md` untuk seluruh token dan komponen UI, dan `backend/README.md` untuk setup database serta daftar endpoint API.

## Menjalankan secara lokal

Backend dan frontend dijalankan terpisah:

1. **Backend** — ikuti `backend/README.md` (install dependency, setup database Supabase dari `backend/sql/supabase_schema.sql`, copy `.env.example` ke `.env`, lalu `npm run dev` di dalam folder `backend/`). Server berjalan di `http://localhost:5000`.
2. **Frontend** — di dalam folder `frontend-react/`, jalankan `npm install` lalu `npm run dev`, buka URL yang ditampilkan Vite (default `http://localhost:5173`). Guru harus register/login lebih dulu (lewat backend yang aktif) sebelum bisa mengakses halaman lain.

## Deploy

Frontend di-deploy ke Vercel dengan Root Directory `frontend-react` (Framework Preset: Vite). File `frontend-react/vercel.json` menyediakan rewrite SPA supaya semua rute React Router (mis. `/bank-soal`, `/materi/:id`) tidak 404 saat diakses/direfresh langsung. Backend di-deploy terpisah ke Railway.

## Halaman

Login &middot; Dashboard &middot; Materi & Modul Pelatihan (+ Detail Materi) &middot; Bank Soal Berbasis Budaya Aceh &middot; Detail Paket Soal (create/edit) &middot; Smart Diagnostic &middot; Dashboard Hasil &middot; Profil (+ Ubah Password).
