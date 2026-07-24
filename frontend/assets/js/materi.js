/* ==========================================================================
   MATERI & MODUL PELATIHAN — Page logic only.
   Rendering, search, filter, sort, event listeners. No data lives here —
   see assets/data/materi.js. Flow: fetchMateri() -> allModules -> render*().
   ========================================================================== */
import {
    fetchMateri,
    materiCategoryMeta as CATEGORY_META,
    materiCategoryOrder as CATEGORY_ORDER,
    materiOverallProgress as OVERALL_PROGRESS
} from '../data/materi.js';

var state = { query: '', status: 'semua', sort: 'terbaru' };
var allModules = [];

function getStatus(m) {
    if (m.progress >= 100) return 'selesai';
    if (m.progress <= 0) return 'belum';
    return 'sedang';
}

function statusLabel(s) {
    return { selesai: 'Selesai', sedang: 'Sedang Dipelajari', belum: 'Belum Dipelajari' }[s];
}

function actionLabel(s) {
    return { selesai: 'Lihat Kembali', sedang: 'Lanjutkan', belum: 'Mulai Belajar' }[s];
}

function sortModules(list, sort) {
    var copy = list.slice();
    if (sort === 'nama') {
        copy.sort(function (a, b) { return a.title.localeCompare(b.title); });
    } else if (sort === 'terlama') {
        copy.sort(function (a, b) { return new Date(a.dateAdded) - new Date(b.dateAdded); });
    } else {
        copy.sort(function (a, b) { return new Date(b.dateAdded) - new Date(a.dateAdded); });
    }
    return copy;
}

function applyFilters() {
    var q = state.query.trim().toLowerCase();
    var filtered = allModules.filter(function (m) {
        var matchesQuery = !q || m.title.toLowerCase().indexOf(q) !== -1 || m.desc.toLowerCase().indexOf(q) !== -1;
        var matchesStatus = state.status === 'semua' || getStatus(m) === state.status;
        return matchesQuery && matchesStatus;
    });
    return sortModules(filtered, state.sort);
}

function isFilteringActive() {
    return state.query.trim() !== '' || state.status !== 'semua';
}

/* --- Render functions: each renders one thing, from data it's given --- */

function renderModuleCard(m) {
    var status = getStatus(m);
    var meta = CATEGORY_META[m.category];
    var btnClass = status === 'selesai' ? 'btn-secondary' : 'btn-primary';
    return (
        '<article class="module-card card-light" data-id="' + m.id + '">' +
            '<div class="module-card__thumb ' + meta.thumbClass + '" aria-hidden="true"><i data-lucide="' + meta.icon + '"></i></div>' +
            '<div class="module-card__body">' +
                '<span class="module-card__category">' + meta.label + '</span>' +
                '<h3 class="module-card__title">' + m.title + '</h3>' +
                '<p class="module-card__desc">' + m.desc + '</p>' +
                '<div class="module-card__meta">' +
                    '<span><i data-lucide="clock"></i>' + m.duration + '</span>' +
                    '<span><i data-lucide="layers"></i>' + m.materiCount + ' Materi</span>' +
                '</div>' +
                '<div class="module-card__progress">' +
                    '<div class="progress-bar progress-bar--sm" role="progressbar" aria-valuenow="' + m.progress + '" aria-valuemin="0" aria-valuemax="100" aria-label="Progress ' + m.title + '">' +
                        '<div class="progress-bar__fill" data-progress="' + m.progress + '"></div>' +
                    '</div>' +
                '</div>' +
                '<div class="module-card__footer">' +
                    '<span class="badge badge--' + status + '">' + statusLabel(status) + '</span>' +
                    '<a href="detail-materi.html?id=' + m.id + '" class="btn ' + btnClass + '">' + actionLabel(status) + '</a>' +
                '</div>' +
            '</div>' +
        '</article>'
    );
}

function renderModuleGrid(modules, heading) {
    if (!heading) {
        return '<div class="module-grid">' + modules.map(renderModuleCard).join('') + '</div>';
    }
    return (
        '<section class="module-category" aria-label="' + heading + '">' +
            '<div class="section-heading"><h2 class="section-heading__title">' + heading + '</h2></div>' +
            '<div class="module-grid">' + modules.map(renderModuleCard).join('') + '</div>' +
        '</section>'
    );
}

function renderGroupedByCategory(modules) {
    var html = '';
    CATEGORY_ORDER.forEach(function (cat) {
        var items = modules.filter(function (m) { return m.category === cat; });
        if (!items.length) return;
        html += renderModuleGrid(items, CATEGORY_META[cat].label);
    });
    return html;
}

function renderEmptyState() {
    return (
        '<div class="card-light">' +
            '<div class="empty-state">' +
                '<div class="empty-state__icon"><i data-lucide="search-x"></i></div>' +
                '<h3 class="empty-state__title">Materi tidak ditemukan</h3>' +
                '<p class="empty-state__desc">Coba ubah kata kunci pencarian atau pilih filter status lain.</p>' +
            '</div>' +
        '</div>'
    );
}

function renderSkeleton() {
    var card = (
        '<div class="card-light module-card">' +
            '<div class="skeleton" style="height:120px;border-radius:0;"></div>' +
            '<div class="module-card__body">' +
                '<div class="skeleton skeleton--text" style="width:35%;"></div>' +
                '<div class="skeleton skeleton--title"></div>' +
                '<div class="skeleton skeleton--text"></div>' +
                '<div class="skeleton skeleton--text"></div>' +
            '</div>' +
        '</div>'
    );
    var container = document.getElementById('moduleSections');
    container.innerHTML = '<div class="module-grid">' + card + card + card + card + card + card + '</div>';
}

function renderModuleSections() {
    var container = document.getElementById('moduleSections');
    var filtered = applyFilters();

    if (filtered.length === 0) {
        container.innerHTML = renderEmptyState();
    } else if (isFilteringActive()) {
        container.innerHTML = renderModuleGrid(filtered, 'Hasil Pencarian (' + filtered.length + ')');
    } else {
        container.innerHTML = renderGroupedByCategory(filtered);
    }

    initIcons();
    initProgressBars(container);
}

function renderLearningOverview() {
    var section = document.getElementById('learningOverviewSection');
    section.innerHTML = (
        '<div class="learning-overview">' +
            '<div class="learning-overview__text">' +
                '<h2 class="section-heading__title">Progress Belajar Anda</h2>' +
                '<p class="learning-overview__count">' + OVERALL_PROGRESS.completed + ' dari ' + OVERALL_PROGRESS.total + ' materi selesai</p>' +
            '</div>' +
            '<div class="learning-overview__figure">' +
                '<span class="learning-overview__percent">' + OVERALL_PROGRESS.percent + '%</span>' +
            '</div>' +
        '</div>' +
        '<div class="progress-bar" role="progressbar" aria-valuenow="' + OVERALL_PROGRESS.percent + '" aria-valuemin="0" aria-valuemax="100" aria-label="Progress belajar keseluruhan">' +
            '<div class="progress-bar__fill" data-progress="' + OVERALL_PROGRESS.percent + '"></div>' +
        '</div>'
    );
    initProgressBars(section);
}

function renderContinueLearning() {
    var section = document.getElementById('continueLearningSection');
    var m = allModules.filter(function (x) { return x.lastOpened; })[0];
    if (!m) {
        section.hidden = true;
        return;
    }
    var meta = CATEGORY_META[m.category];
    section.hidden = false;
    section.innerHTML = (
        '<div class="card-light continue-card">' +
            '<div class="continue-card__thumb" aria-hidden="true"><i data-lucide="' + meta.icon + '"></i></div>' +
            '<div class="continue-card__body">' +
                '<span class="continue-card__eyebrow">Lanjutkan Belajar</span>' +
                '<h2 class="continue-card__title">' + m.title + '</h2>' +
                '<div class="continue-card__progress">' +
                    '<div class="progress-bar" role="progressbar" aria-valuenow="' + m.progress + '" aria-valuemin="0" aria-valuemax="100" aria-label="Progress ' + m.title + '">' +
                        '<div class="progress-bar__fill" data-progress="' + m.progress + '"></div>' +
                    '</div>' +
                    '<span class="continue-card__percent">' + m.progress + '% selesai</span>' +
                '</div>' +
            '</div>' +
            '<div class="continue-card__action">' +
                '<a href="detail-materi.html?id=' + m.id + '" class="btn btn-primary"><i data-lucide="play-circle"></i> Lanjutkan Belajar</a>' +
            '</div>' +
        '</div>'
    );
    initIcons();
    initProgressBars(section);
}

/* --- Shared small helpers --- */

function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

function initProgressBars(scope) {
    var bars = (scope || document).querySelectorAll('.progress-bar__fill[data-progress]');
    if (!bars.length) return;

    if (!('IntersectionObserver' in window)) {
        bars.forEach(function (bar) { bar.style.width = bar.getAttribute('data-progress') + '%'; });
        return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var bar = entry.target;
                bar.style.width = bar.getAttribute('data-progress') + '%';
                obs.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(function (bar) { observer.observe(bar); });
}

/* --- Event listeners --- */

function initControls() {
    var searchInput = document.getElementById('materiSearchInput');
    var sortSelect = document.getElementById('materiSortSelect');
    var filterChips = document.querySelectorAll('.filter-chip');

    searchInput.addEventListener('input', function () {
        state.query = searchInput.value;
        renderModuleSections();
    });

    sortSelect.addEventListener('change', function () {
        state.sort = sortSelect.value;
        renderModuleSections();
    });

    filterChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            filterChips.forEach(function (c) {
                c.classList.remove('is-active');
                c.setAttribute('aria-pressed', 'false');
            });
            chip.classList.add('is-active');
            chip.setAttribute('aria-pressed', 'true');
            state.status = chip.getAttribute('data-filter');
            renderModuleSections();
        });
    });
}

/* --- Init: API (mock for now) -> allModules -> render --- */

async function init() {
    initControls();
    renderLearningOverview();
    renderSkeleton();

    allModules = await fetchMateri();

    renderModuleSections();
    renderContinueLearning();
}

document.addEventListener('DOMContentLoaded', init);
