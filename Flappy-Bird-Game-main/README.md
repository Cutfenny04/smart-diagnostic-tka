# Flappy Aceh: Petualangan Burung Rangkong

Game adaptasi Flappy Bird dengan tema kearifan lokal dan kebudayaan Aceh. Terbanglah melintasi pilar-pilar arsitektur megah di depan lanskap ikonik Masjid Raya Baiturrahman dan Rumoh Aceh bersama sang Burung Rangkong!

---

## 🌟 Fitur Utama

- **Karakter Khas Nusantara**: Karakter utama adalah Burung Rangkong dengan animasi kepakan sayap dinamis dan efek menukik/menanjak yang halus.
- **Latar Belakang Budaya Aceh**: Menampilkan lanskap ikonik Masjid Raya Baiturrahman Banda Aceh, Rumoh Aceh, dan latar perbukitan hijau tropis.
- **Rintangan Arsitektur Emas & Marmer**: Pilar rintangan berbalut marmer klasik dengan ornamen kepala pilar emas khas kebudayaan Aceh.
- **Antarmuka (UI) Eksklusif**:
  - Sentuhan motif ornamen Pinto Aceh dan palet warna emas (*Acehnese Royal Gold*).
  - Bahasa dan pesan motivasi dalam Bahasa Indonesia & sentuhan Bahasa Aceh (*"Jak Mulai"*, *"Bek Putoih Asa"*, *"Main Lom"*).
  - Papan skor terkini dan pencatatan rekor tertinggi (*High Score*) otomatis via `localStorage`.
- **Dukungan Multi-Perangkat (Desktop & Mobile)**:
  - ⌨️ Keyboard: `Spasi`, `Panah Atas`, `W`, atau `Enter`
  - 🖱️ Mouse: Klik di mana saja pada layar
  - 📱 Layar Sentuh (*Touchscreen*): Ketuk (*tap*) layar HP/tablet dengan respon instan tanpa lag atau zoom
- **Audio & Suara**:
  - Efek suara kepakan sayap (Web Audio API synthesis)
  - Efek suara perolehan skor (*point*) dan tabrakan (*die*)
  - Tombol toggle Suara (Nyala/Mati) di pojok kanan atas

---

## 🎮 Cara Menjalankan Game

Cukup buka file `index.html` di browser apa pun (Google Chrome, Safari, Mozilla Firefox, Microsoft Edge), atau jalankan local server sederhana:

```bash
# Menggunakan Python
python3 -m http.server 8000
```
Buka browser di `http://localhost:8000`.

---

## 📁 Struktur Berkas

- `index.html` - Struktur markup UI, modal Start, modal Game Over, dan HUD permainan.
- `style.css` - Tata letak grafis, pilar arsitektur Aceh, animasi dinamis burung, dan responsivitas.
- `script.js` - Game engine: sistem fisika gravitasi, rotasi, deteksi tabrakan presisi, penyimpanan skor, dan audio.
- `images/` - Aset visual (`background.jpg`, `burung.png`, `burung2.png`, dll).
- `sounds effect/` - Efek suara game.
