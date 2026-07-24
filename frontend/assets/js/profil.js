/* ==========================================================================
   PROFIL — Page logic only. No data lives here — see assets/data/profil.js.
   View-only: displays the logged-in guru's info, no edit form.
   ========================================================================== */
import { fetchProfil } from '../data/profil.js';

function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

function initial(name) {
    return name.trim().charAt(0).toUpperCase();
}

function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderInfoRow(icon, label, value) {
    return (
        '<div class="profil-info-row">' +
            '<span class="profil-info-row__icon"><i data-lucide="' + icon + '"></i></span>' +
            '<span class="profil-info-row__text">' +
                '<span class="profil-info-row__label">' + label + '</span>' +
                '<span class="profil-info-row__value">' + value + '</span>' +
            '</span>' +
        '</div>'
    );
}

function renderProfil(profil) {
    var container = document.getElementById('profilCard');
    container.innerHTML = (
        '<div class="profil-card__head">' +
            '<span class="profil-avatar" aria-hidden="true">' + initial(profil.name) + '</span>' +
            '<div>' +
                '<h2 class="profil-card__name">' + profil.name + '</h2>' +
                '<span class="badge badge--info">' + profil.role + '</span>' +
            '</div>' +
        '</div>' +
        '<div class="profil-info-list">' +
            renderInfoRow('mail', 'Email', profil.email) +
            renderInfoRow('school', 'Sekolah', profil.school) +
            renderInfoRow('flask-conical', 'Mata Pelajaran', profil.subject) +
            renderInfoRow('graduation-cap', 'Jenjang Diampu', profil.grade) +
            renderInfoRow('calendar', 'Bergabung Sejak', formatDate(profil.joinDate)) +
        '</div>'
    );
    initIcons();
}

async function init() {
    var profil = await fetchProfil();
    renderProfil(profil);
}

document.addEventListener('DOMContentLoaded', init);
