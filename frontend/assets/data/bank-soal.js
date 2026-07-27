/* ==========================================================================
   BANK SOAL BERBASIS BUDAYA ACEH — Data layer.
   Backed by the real backend (backend/routes/paketSoal.routes.js,
   backend/controllers/paketSoal.controller.js) instead of localStorage.
   Every function below keeps the exact same shape it always had — pages
   that import these (assets/js/bank-soal.js, detail-soal.js,
   smart-diagnostic.js) needed no rendering changes for this swap.

   Requires the guru to be logged in (see assets/js/login.js) — the JWT
   token from localStorage is sent as a Bearer token on every request.
   window.API_BASE_URL comes from assets/js/api-config.js.
   ========================================================================== */

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    };
}

async function handleResponse(response) {
    if (response.status === 401 || response.status === 403) {
        window.location.href = 'login.html';
        throw new Error('Sesi berakhir, silakan login kembali.');
    }
    var data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan pada server.');
    }
    return data;
}

/**
 * Semua paket soal milik guru yang sedang login (Draft dan Published).
 * Smart Diagnostic memfilter status === 'published' sendiri setelah ini.
 */
export function fetchPaketSoal() {
    return fetch(window.API_BASE_URL + '/api/paket-soal', {
        headers: authHeaders()
    }).then(handleResponse);
}

/**
 * Satu paket soal berdasarkan id. Dipakai detail-soal.html mode Edit.
 * Resolve null kalau tidak ditemukan (bukan reject) -- sesuai kontrak lama.
 */
export function fetchPaketById(id) {
    return fetch(window.API_BASE_URL + '/api/paket-soal/' + id, {
        headers: authHeaders()
    }).then(function (response) {
        if (response.status === 404) return null;
        return handleResponse(response);
    });
}

/**
 * Create (paket.id kosong) atau Update (paket.id ada) satu paket soal.
 */
export function savePaket(paket) {
    var isEdit = paket.id;
    var url = window.API_BASE_URL + '/api/paket-soal' + (isEdit ? '/' + paket.id : '');

    return fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(paket)
    }).then(handleResponse);
}

/**
 * Hapus satu paket soal, lalu resolve dengan daftar paket terbaru --
 * sesuai kontrak lama (bank-soal.js langsung re-render dari hasil ini).
 */
export function deletePaket(id) {
    return fetch(window.API_BASE_URL + '/api/paket-soal/' + id, {
        method: 'DELETE',
        headers: authHeaders()
    }).then(handleResponse).then(function () {
        return fetchPaketSoal();
    });
}
