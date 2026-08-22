const net = require('net');

// Roadmap item #16 (2026-08-22): lapisan SSRF tambahan di atas hostname
// whitelist (isWordwallUrl) yang sudah ada. Whitelist hostname saja tidak
// cukup -- wordwall.net (atau salah satu subdomainnya) secara teori bisa
// suatu saat resolve ke alamat internal (DNS rebinding / cache poisoning /
// kesalahan konfigurasi), dan tanpa cek ini fetch server-side akan tetap
// jalan ke alamat itu walau hostname-nya lolos whitelist. Fungsi ini
// mengecek APAKAH SEBUAH IP HASIL RESOLVE termasuk rentang privat/internal
// (RFC1918, loopback, link-local, dst) -- dipanggil setelah DNS lookup,
// sebelum fetch benar-benar dilakukan ke IP itu.
//
// Catatan batasan yang disengaja: ini mengurangi risiko (blocks the obvious
// cases), bukan penutupan sempurna -- fetch() Node sendiri yang akhirnya
// menyambung ke hostname bisa saja resolve ulang ke IP berbeda dari hasil
// lookup yang kita cek (celah TOCTOU klasik). Menutup celah itu sepenuhnya
// butuh IP pinning (custom dns.lookup / http.Agent) yang jauh lebih rumit
// untuk skala aplikasi pelatihan guru ini -- proporsional untuk sekarang,
// tapi dicatat di sini supaya tidak dikira "sudah pasti aman total".
function isPrivateIp(ip) {
  const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  const addr = mapped ? mapped[1] : ip;

  if (net.isIPv4(addr)) {
    const [a, b] = addr.split('.').map(Number);
    if (a === 0) return true; // "this network"
    if (a === 10) return true; // RFC1918
    if (a === 127) return true; // loopback
    if (a === 169 && b === 254) return true; // link-local (juga dipakai cloud metadata endpoint, mis. 169.254.169.254)
    if (a === 172 && b >= 16 && b <= 31) return true; // RFC1918
    if (a === 192 && b === 168) return true; // RFC1918
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT (RFC6598)
    return false;
  }

  if (net.isIPv6(addr)) {
    const lower = addr.toLowerCase();
    if (lower === '::1') return true; // loopback
    if (lower.startsWith('fe80:')) return true; // link-local
    if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // unique local fc00::/7
    return false;
  }

  return true; // bentuk tidak dikenal -- gagal aman (anggap internal, tolak)
}

module.exports = { isPrivateIp };
