/* ==========================================================================
   AUTH — Data layer for account actions that aren't login/register
   (assets/js/login.js calls /api/auth/login directly since it's a classic
   script, not a module). Same authHeaders/handleResponse shape as
   assets/data/bank-soal.js. window.API_BASE_URL comes from api-config.js.
   ========================================================================== */

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.localStorage.getItem('token')
    };
}

async function handleResponse(response) {
    var data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan pada server.');
    }
    return data;
}

/**
 * Ganti password guru yang sedang login. Reject dengan pesan dari server
 * (mis. "Password lama salah") kalau gagal -- caller menampilkannya di form.
 */
export function changePassword(oldPassword, newPassword) {
    return fetch(window.API_BASE_URL + '/api/auth/password', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ oldPassword: oldPassword, newPassword: newPassword })
    }).then(handleResponse);
}
