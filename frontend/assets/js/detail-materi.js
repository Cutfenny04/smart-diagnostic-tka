/* ==========================================================================
   DETAIL MATERI — Page logic only. Read-only overview of one modul materi
   (judul, deskripsi, progress, daftar topik) -- bukan lesson player, karena
   website ini bukan LMS (lihat PIVOT_PLAN.md §0.1). No data lives here —
   see assets/data/materi.js. Flow: read ?id= -> fetchMateriById -> render.
   ========================================================================== */
import { fetchMateriById, materiCategoryMeta as CATEGORY_META } from '../data/materi.js';

var moduleId = new URLSearchParams(window.location.search).get('id');

function statusLabel(m) {
    if (m.progress >= 100) return { text: 'Selesai', badge: 'selesai' };
    if (m.progress <= 0) return { text: 'Belum Dipelajari', badge: 'belum' };
    return { text: 'Sedang Dipelajari', badge: 'sedang' };
}

function actionLabel(m) {
    if (m.progress >= 100) return 'Lihat Kembali';
    if (m.progress <= 0) return 'Mulai Belajar';
    return 'Lanjutkan Belajar';
}

function renderTopicList(m) {
    var doneCount = Math.round((m.progress / 100) * m.topics.length);
    return (
        '<ul class="topic-list" aria-label="Daftar topik">' +
            m.topics.map(function (topic, i) {
                var isDone = i < doneCount;
                return (
                    '<li class="topic-list__item' + (isDone ? ' is-done' : '') + '">' +
                        '<i data-lucide="' + (isDone ? 'check-circle-2' : 'circle') + '"></i>' +
                        '<span>' + topic + '</span>' +
                    '</li>'
                );
            }).join('') +
        '</ul>'
    );
}

function renderDetail(m) {
    var meta = CATEGORY_META[m.category];
    var status = statusLabel(m);

    document.getElementById('pageTitle').textContent = m.title + ' - Smart Diagnostic TKA';
    document.getElementById('breadcrumbCurrent').textContent = m.title;
    document.getElementById('categoryBadge').textContent = meta.label;
    document.getElementById('materiTitle').textContent = m.title;
    document.getElementById('materiDesc').textContent = m.desc;

    document.getElementById('detailMateriCard').innerHTML = (
        '<div class="detail-materi-meta">' +
            '<span><i data-lucide="clock"></i>' + m.duration + '</span>' +
            '<span><i data-lucide="layers"></i>' + m.materiCount + ' Materi</span>' +
            '<span class="badge badge--' + status.badge + '">' + status.text + '</span>' +
        '</div>' +
        '<div class="detail-materi-progress">' +
            '<div class="progress-bar" role="progressbar" aria-valuenow="' + m.progress + '" aria-valuemin="0" aria-valuemax="100" aria-label="Progress ' + m.title + '">' +
                '<div class="progress-bar__fill" data-progress="' + m.progress + '"></div>' +
            '</div>' +
            '<span class="detail-materi-progress__label">' + m.progress + '% selesai</span>' +
        '</div>' +
        '<h2 class="section-heading__title">Daftar Topik</h2>' +
        renderTopicList(m) +
        '<div class="form-actions">' +
            '<a href="materi.html" class="btn btn-secondary">Kembali ke Materi</a>' +
            '<a href="smart-diagnostic.html" class="btn btn-primary">' + actionLabel(m) + '</a>' +
        '</div>'
    );

    initIcons();
    initProgressBar();
}

function renderNotFound() {
    document.getElementById('detailMateriCard').innerHTML = (
        '<div class="empty-state">' +
            '<div class="empty-state__icon"><i data-lucide="search-x"></i></div>' +
            '<h3 class="empty-state__title">Materi tidak ditemukan</h3>' +
            '<p class="empty-state__desc">Modul yang Anda cari tidak ada atau sudah dihapus.</p>' +
            '<a href="materi.html" class="btn btn-primary">Kembali ke Materi</a>' +
        '</div>'
    );
    initIcons();
}

function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

function initProgressBar() {
    var bar = document.querySelector('.progress-bar__fill[data-progress]');
    if (!bar) return;
    window.requestAnimationFrame(function () {
        bar.style.width = bar.getAttribute('data-progress') + '%';
    });
}

async function init() {
    if (!moduleId) {
        renderNotFound();
        return;
    }
    var m = await fetchMateriById(moduleId);
    if (!m) {
        renderNotFound();
        return;
    }
    renderDetail(m);
}

document.addEventListener('DOMContentLoaded', init);
