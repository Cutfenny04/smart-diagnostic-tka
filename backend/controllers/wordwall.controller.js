const { isWordwallUrl } = require('../utils/wordwallUrl');

// Cek apakah sebuah URL Wordwall bisa di-embed lewat <iframe> di website ini.
// Beberapa jenis link Wordwall (mis. /resource/...) mengirim header
// X-Frame-Options: SAMEORIGIN yang memblokir embedding lintas origin,
// sedangkan link /play/... biasanya tidak -- sudah dikonfirmasi manual
// dengan 2 link dari klien (lihat PIVOT_PLAN.md). Endpoint ini melakukan
// pengecekan yang sama secara terprogram supaya SmartDiagnostic.jsx bisa
// otomatis kasih fallback kalau linknya memang tidak bisa di-embed,
// alih-alih iframe kosong tanpa penjelasan.
//
// Validasi hostname WAJIB dibatasi ke wordwall.net -- ini endpoint yang
// menerima URL dari client dan melakukan fetch server-side, jadi tanpa
// pembatasan ini rawan disalahgunakan buat SSRF (menyuruh server men-scan
// alamat internal).

const MAX_REDIRECTS = 5;
const FETCH_TIMEOUT_MS = 6000;

// Temuan audit 2026-08-20 (roadmap item #7): validasi hostname di atas cuma
// dicek pada URL AWAL -- `redirect: 'follow'` yang lama membiarkan fetch
// mengikuti redirect ke hostname MANAPUN tanpa dicek ulang, jadi kalau
// wordwall.net (atau siapapun di jalur redirect-nya) suatu saat punya open
// redirect, endpoint ini bisa dipakai buat SSRF ke alamat internal --
// persis yang coba dicegah komentar di atas, tapi cuma dicek sekali di awal.
// Fix: redirect: 'manual', validasi ulang host tiap hop sebelum diikuti, dan
// batasi jumlah hop. Juga menambah timeout (sebelumnya fetch bisa
// menggantung tanpa batas kalau wordwall.net tidak merespons) -- pakai
// AbortController per hop, bukan satu timer global, supaya beberapa hop
// lambat tidak saling "mencuri" sisa waktu satu sama lain secara aneh.
async function fetchWithValidatedRedirects(startUrl) {
  let currentUrl = startUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let response;
    try {
      response = await fetch(currentUrl, { method: 'GET', redirect: 'manual', signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }

    const isRedirect = response.status >= 300 && response.status < 400;
    const location = response.headers.get('location');
    if (!isRedirect || !location) {
      return response;
    }

    const nextUrl = new URL(location, currentUrl).toString();
    if (!isWordwallUrl(nextUrl)) {
      const err = new Error('Redirect keluar dari wordwall.net, tidak diikuti');
      err.code = 'REDIRECT_OFF_HOST';
      throw err;
    }
    currentUrl = nextUrl;
  }

  const err = new Error('Terlalu banyak redirect');
  err.code = 'TOO_MANY_REDIRECTS';
  throw err;
}

async function checkEmbeddable(req, res) {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ message: 'url wajib diisi' });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({ message: 'url tidak valid' });
    }

    if (!isWordwallUrl(url)) {
      return res.status(400).json({ message: 'Hanya URL wordwall.net yang didukung' });
    }

    let response;
    try {
      response = await fetchWithValidatedRedirects(url);
    } catch (err) {
      if (err.code === 'REDIRECT_OFF_HOST' || err.code === 'TOO_MANY_REDIRECTS') {
        // Sinyal nyata (bukan sekadar network hiccup) -- gagal aman: anggap
        // tidak bisa di-embed, biar frontend tampilkan fallback "Buka di
        // Wordwall" alih-alih mengikuti redirect yang mencurigakan.
        return res.json({ embeddable: false });
      }
      throw err; // network error / timeout -> ditangani catch di luar (uncertain)
    }

    const xfo = (response.headers.get('x-frame-options') || '').toLowerCase();
    const csp = (response.headers.get('content-security-policy') || '').toLowerCase();
    const blocked = xfo.includes('deny') || xfo.includes('sameorigin')
      || /frame-ancestors\s+('none'|'self')/.test(csp);

    return res.json({ embeddable: !blocked });
  } catch (err) {
    console.error(err);
    // Gagal cek (mis. network error, timeout) -- jangan langsung vonis
    // "tidak bisa di-embed", biar frontend tetap coba iframe seperti
    // perilaku lama.
    return res.json({ embeddable: true, uncertain: true });
  }
}

module.exports = { checkEmbeddable };
