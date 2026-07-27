/* ==========================================================================
   PROFIL — Data layer.
   Pure data + a fetch-style accessor. No rendering, no DOM, no HTML here.
   Prototype data for the logged-in guru — view-only, no edit flow.

   Swap the body of fetchProfil() for a real `fetch('/api/profil')` later —
   every caller already treats it as an async source.
   ========================================================================== */

export const profilData = {
    name: 'Cut Meutia, S.Pd.',
    role: 'Guru IPA',
    email: 'cut.meutia@smpn1acehbesar.sch.id',
    school: 'SMP Negeri 1 Aceh Besar',
    subject: 'Ilmu Pengetahuan Alam (IPA)',
    grade: 'Kelas VII - IX',
    joinDate: '2023-07-01'
};

/**
 * Future backend: replace the body with
 *   return fetch('/api/profil').then(function (res) { return res.json(); });
 * Callers already treat this as async, so no other file needs to change.
 */
export function fetchProfil() {
    return new Promise(function (resolve) {
        window.setTimeout(function () {
            resolve(profilData);
        }, 500);
    });
}
