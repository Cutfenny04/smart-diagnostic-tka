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
async function checkEmbeddable(req, res) {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ message: 'url wajib diisi' });
    }

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return res.status(400).json({ message: 'url tidak valid' });
    }

    if (!/(^|\.)wordwall\.net$/i.test(parsed.hostname)) {
      return res.status(400).json({ message: 'Hanya URL wordwall.net yang didukung' });
    }

    const response = await fetch(url, { method: 'GET', redirect: 'follow' });
    const xfo = (response.headers.get('x-frame-options') || '').toLowerCase();
    const csp = (response.headers.get('content-security-policy') || '').toLowerCase();
    const blocked = xfo.includes('deny') || xfo.includes('sameorigin')
      || /frame-ancestors\s+('none'|'self')/.test(csp);

    return res.json({ embeddable: !blocked });
  } catch (err) {
    console.error(err);
    // Gagal cek (mis. network error) -- jangan langsung vonis "tidak bisa
    // di-embed", biar frontend tetap coba iframe seperti perilaku lama.
    return res.json({ embeddable: true, uncertain: true });
  }
}

module.exports = { checkEmbeddable };
