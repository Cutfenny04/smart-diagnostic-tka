/* ==========================================================================
   BANK STIMULUS BUDAYA ACEH — Page logic only.
   Rendering, search, filter, sort, preview, recommendation, event listeners.
   No data lives here — see assets/data/stimulus.js.
   Flow: fetchStimulus() -> allStimulus -> render*().
   ========================================================================== */
import {
    fetchStimulus,
    stimulusCategoryMeta as CATEGORY_META,
    stimulusRecommendedIds as RECOMMENDED_IDS,
    stimulusRecommendationReason as RECOMMENDATION_REASON
} from '../data/stimulus.js';

/* Filter taxonomy is UI configuration, not dummy content — stays in page logic. */
var FILTER_GROUPS = [
    {
        key: 'category', label: 'Kategori', options: [
            { value: 'semua', label: 'Semua' },
            { value: 'tradisi', label: 'Tradisi' },
            { value: 'kuliner', label: 'Kuliner' },
            { value: 'alam', label: 'Alam' },
            { value: 'kerajinan', label: 'Kerajinan' },
            { value: 'kearifan-lokal', label: 'Kearifan Lokal' }
        ]
    },
    {
        key: 'grade', label: 'Jenjang', options: [
            { value: 'semua', label: 'Semua' },
            { value: 'SMP', label: 'SMP' },
            { value: 'SMA', label: 'SMA' }
        ]
    },
    {
        key: 'ipa', label: 'Bidang IPA', options: [
            { value: 'semua', label: 'Semua' },
            { value: 'Biologi', label: 'Biologi' },
            { value: 'Fisika', label: 'Fisika' },
            { value: 'Kimia', label: 'Kimia' }
        ]
    },
    {
        key: 'hotsLevel', label: 'HOTS', options: [
            { value: 'semua', label: 'Semua' },
            { value: 'C4', label: 'C4' },
            { value: 'C5', label: 'C5' },
            { value: 'C6', label: 'C6' }
        ]
    }
];

var state = { query: '', category: 'semua', grade: 'semua', ipa: 'semua', hotsLevel: 'semua', sort: 'terbaru' };
var allStimulus = [];

function hotsBadgeClass(level) {
    return { C4: 'badge--c4', C5: 'badge--c5', C6: 'badge--c6' }[level] || 'badge--c4';
}

function sortStimulus(list, sort) {
    var copy = list.slice();
    if (sort === 'az') {
        copy.sort(function (a, b) { return a.title.localeCompare(b.title); });
    } else if (sort === 'populer') {
        copy.sort(function (a, b) { return b.popularity - a.popularity; });
    } else {
        copy.sort(function (a, b) { return new Date(b.dateAdded) - new Date(a.dateAdded); });
    }
    return copy;
}

function applyFilters() {
    var q = state.query.trim().toLowerCase();
    var filtered = allStimulus.filter(function (s) {
        var matchesQuery = !q ||
            s.title.toLowerCase().indexOf(q) !== -1 ||
            s.category.toLowerCase().indexOf(q) !== -1 ||
            s.keywords.some(function (k) { return k.toLowerCase().indexOf(q) !== -1; });
        var matchesCategory = state.category === 'semua' || s.category === state.category;
        var matchesGrade = state.grade === 'semua' || s.grade === state.grade;
        var matchesIpa = state.ipa === 'semua' || s.ipa === state.ipa;
        var matchesHots = state.hotsLevel === 'semua' || s.hotsLevel === state.hotsLevel;
        return matchesQuery && matchesCategory && matchesGrade && matchesIpa && matchesHots;
    });
    return sortStimulus(filtered, state.sort);
}

/* --- Render functions: each renders one thing, from data it's given --- */

function renderStimulusCard(item) {
    var meta = CATEGORY_META[item.category];
    return (
        '<article class="stimulus-card card-light" data-id="' + item.id + '" tabindex="0" role="button" aria-label="Lihat detail stimulus ' + item.title + '">' +
            '<div class="stimulus-card__thumb ' + meta.thumbClass + '" aria-hidden="true"><i data-lucide="' + item.icon + '"></i></div>' +
            '<div class="stimulus-card__body">' +
                '<div class="stimulus-card__tags">' +
                    '<span class="stimulus-card__category">' + meta.label + '</span>' +
                    '<span class="stimulus-card__subject">' + item.ipa + '</span>' +
                '</div>' +
                '<h3 class="stimulus-card__title">' + item.title + '</h3>' +
                '<p class="stimulus-card__summary">' + item.summary + '</p>' +
                '<div class="stimulus-card__footer">' +
                    '<span class="badge ' + hotsBadgeClass(item.hotsLevel) + '">' + item.hotsLevel + '</span>' +
                    '<button type="button" class="btn btn-secondary" data-id="' + item.id + '">Lihat</button>' +
                '</div>' +
            '</div>' +
        '</article>'
    );
}

function renderEmptyState() {
    return (
        '<div class="card-light empty-state-full">' +
            '<div class="empty-state">' +
                '<div class="empty-state__icon"><i data-lucide="search-x"></i></div>' +
                '<h3 class="empty-state__title">Stimulus tidak ditemukan</h3>' +
                '<p class="empty-state__desc">Coba ubah kata kunci pencarian atau pilih filter lain.</p>' +
            '</div>' +
        '</div>'
    );
}

function renderSkeleton() {
    var card = (
        '<div class="card-light stimulus-card">' +
            '<div class="skeleton" style="height:110px;border-radius:0;"></div>' +
            '<div class="stimulus-card__body">' +
                '<div class="skeleton skeleton--text" style="width:40%;"></div>' +
                '<div class="skeleton skeleton--title"></div>' +
                '<div class="skeleton skeleton--text"></div>' +
            '</div>' +
        '</div>'
    );
    document.getElementById('stimulusGrid').innerHTML = card + card + card + card + card + card + card + card;
    document.getElementById('featuredSection').innerHTML = (
        '<div class="card-light">' +
            '<div class="skeleton skeleton--text" style="width:30%;"></div>' +
            '<div class="skeleton skeleton--title"></div>' +
            '<div class="skeleton skeleton--text"></div>' +
            '<div class="skeleton skeleton--text"></div>' +
        '</div>'
    );
}

function renderLibrary() {
    var container = document.getElementById('stimulusGrid');
    var filtered = applyFilters();

    if (filtered.length === 0) {
        container.innerHTML = renderEmptyState();
    } else {
        container.innerHTML = filtered.map(renderStimulusCard).join('');
    }

    initIcons();
}

function renderFeatured() {
    var section = document.getElementById('featuredSection');
    var item = allStimulus.filter(function (s) { return s.featured; })[0];
    if (!item) {
        section.hidden = true;
        return;
    }
    var meta = CATEGORY_META[item.category];
    section.hidden = false;
    section.innerHTML = (
        '<div class="card-light featured-stimulus">' +
            '<div class="featured-stimulus__thumb ' + meta.thumbClass + '" aria-hidden="true"><i data-lucide="' + item.icon + '"></i></div>' +
            '<div class="featured-stimulus__body">' +
                '<span class="featured-stimulus__eyebrow">Stimulus Unggulan</span>' +
                '<h2 class="featured-stimulus__title">' + item.title + '</h2>' +
                '<p class="featured-stimulus__desc">' + item.description + '</p>' +
                '<div class="featured-stimulus__tags">' +
                    '<span class="stimulus-card__category">' + meta.label + '</span>' +
                    '<span class="stimulus-card__subject">' + item.ipa + '</span>' +
                    '<span class="badge ' + hotsBadgeClass(item.hotsLevel) + '">' + item.hotsLevel + '</span>' +
                '</div>' +
                '<ul class="featured-stimulus__competencies">' + item.competencies.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>' +
                '<button type="button" class="btn btn-primary" data-id="' + item.id + '">Lihat Detail</button>' +
            '</div>' +
        '</div>'
    );
    initIcons();
}

function renderPreview(item) {
    var panel = document.getElementById('stimulusPreview');

    if (!item) {
        panel.innerHTML = (
            '<div class="empty-state">' +
                '<div class="empty-state__icon"><i data-lucide="mouse-pointer-click"></i></div>' +
                '<h3 class="empty-state__title">Pilih Stimulus</h3>' +
                '<p class="empty-state__desc">Klik salah satu kartu untuk melihat detail di sini.</p>' +
            '</div>'
        );
        initIcons();
        return;
    }

    var meta = CATEGORY_META[item.category];
    panel.innerHTML = (
        '<button type="button" class="preview-panel__close" id="stimulusPreviewClose" aria-label="Tutup pratinjau"><i data-lucide="x"></i></button>' +
        '<div class="stimulus-preview__image ' + meta.thumbClass + '" aria-hidden="true"><i data-lucide="' + item.icon + '"></i></div>' +
        '<span class="stimulus-preview__eyebrow">' + meta.label + ' &middot; ' + item.ipa + '</span>' +
        '<h2 class="stimulus-preview__title">' + item.title + '</h2>' +
        '<div class="stimulus-preview__tags">' +
            '<span class="badge ' + hotsBadgeClass(item.hotsLevel) + '">' + item.hotsLevel + '</span>' +
            '<span class="badge badge--info">' + item.grade + '</span>' +
            '<span class="badge badge--selesai">' + item.difficulty + '</span>' +
        '</div>' +
        '<p class="stimulus-preview__desc">' + item.description + '</p>' +
        '<h3 class="stimulus-preview__section-title">Kompetensi Terkait</h3>' +
        '<ul class="stimulus-preview__list">' + item.competencies.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>' +
        '<h3 class="stimulus-preview__section-title">Contoh Penerapan HOTS</h3>' +
        '<p class="stimulus-preview__example">Gunakan konteks ini untuk menyusun soal level ' + item.hotsLevel + ' pada mata pelajaran ' + item.ipa + ', misalnya meminta peserta didik menganalisis, mengevaluasi, atau merancang solusi terkait ' + item.title.toLowerCase() + '.</p>' +
        '<div class="stimulus-preview__action">' +
            '<a href="bank-soal.html?stimulus=' + item.id + '" class="btn btn-primary">Gunakan Stimulus</a>' +
        '</div>'
    );
    initIcons();

    var closeBtn = document.getElementById('stimulusPreviewClose');
    if (closeBtn) closeBtn.addEventListener('click', closeMobilePreview);
}

function renderRecommendation() {
    var section = document.getElementById('recommendationSection');
    var items = allStimulus.filter(function (s) { return RECOMMENDED_IDS.indexOf(s.id) !== -1; });
    if (!items.length) {
        section.hidden = true;
        return;
    }
    section.hidden = false;
    section.innerHTML = (
        '<div class="section-heading">' +
            '<h2 class="section-heading__title">Rekomendasi Untuk Anda</h2>' +
            '<p class="section-heading__desc">' + RECOMMENDATION_REASON + '</p>' +
        '</div>' +
        '<div class="recommended-grid">' + items.map(renderStimulusCard).join('') + '</div>'
    );
    initIcons();
}

/* --- Preview selection + mobile bottom-sheet open/close --- */

function selectStimulus(id) {
    var item = allStimulus.filter(function (s) { return s.id === id; })[0];
    if (!item) return;
    renderPreview(item);
    openMobilePreview();
}

function openMobilePreview() {
    document.getElementById('stimulusPreview').classList.add('is-open');
    document.getElementById('stimulusPreviewBackdrop').classList.add('is-open');
}

function closeMobilePreview() {
    document.getElementById('stimulusPreview').classList.remove('is-open');
    document.getElementById('stimulusPreviewBackdrop').classList.remove('is-open');
}

/* --- Filters UI (rendered once; toggled via class updates afterwards) --- */

function renderFilterGroup(group) {
    return (
        '<div class="filter-group-row">' +
            '<span class="filter-group__label">' + group.label + '</span>' +
            '<div class="filter-group" role="group" aria-label="' + group.label + '">' +
                group.options.map(function (opt) {
                    var isActive = opt.value === state[group.key];
                    return (
                        '<button type="button" class="filter-chip' + (isActive ? ' is-active' : '') +
                        '" data-group="' + group.key + '" data-value="' + opt.value + '" aria-pressed="' + isActive + '">' +
                        opt.label + '</button>'
                    );
                }).join('') +
            '</div>' +
        '</div>'
    );
}

function renderFilters() {
    var container = document.getElementById('stimulusFilters');
    container.innerHTML = '<div class="filter-groups-stack">' + FILTER_GROUPS.map(renderFilterGroup).join('') + '</div>';
}

/* --- Shared small helpers --- */

function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

/* --- Event listeners (delegated where content is dynamic) --- */

function bindEvents() {
    document.getElementById('stimulusSearchInput').addEventListener('input', function (e) {
        state.query = e.target.value;
        renderLibrary();
    });

    document.getElementById('stimulusSortSelect').addEventListener('change', function (e) {
        state.sort = e.target.value;
        renderLibrary();
    });

    document.getElementById('stimulusFilters').addEventListener('click', function (e) {
        var btn = e.target.closest('.filter-chip');
        if (!btn) return;

        state[btn.getAttribute('data-group')] = btn.getAttribute('data-value');

        btn.parentElement.querySelectorAll('.filter-chip').forEach(function (sib) {
            var isActive = sib === btn;
            sib.classList.toggle('is-active', isActive);
            sib.setAttribute('aria-pressed', String(isActive));
        });

        renderLibrary();
    });

    var grid = document.getElementById('stimulusGrid');
    grid.addEventListener('click', function (e) {
        var target = e.target.closest('[data-id]');
        if (target) selectStimulus(target.getAttribute('data-id'));
    });
    grid.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var card = e.target.closest('.stimulus-card');
        if (!card) return;
        e.preventDefault();
        selectStimulus(card.getAttribute('data-id'));
    });

    document.getElementById('featuredSection').addEventListener('click', function (e) {
        var target = e.target.closest('[data-id]');
        if (target) selectStimulus(target.getAttribute('data-id'));
    });

    document.getElementById('recommendationSection').addEventListener('click', function (e) {
        var target = e.target.closest('[data-id]');
        if (target) selectStimulus(target.getAttribute('data-id'));
    });

    document.getElementById('stimulusPreviewBackdrop').addEventListener('click', closeMobilePreview);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMobilePreview();
    });
}

/* --- Init: API (mock for now) -> allStimulus -> render --- */

async function init() {
    renderFilters();
    bindEvents();
    renderSkeleton();

    allStimulus = await fetchStimulus();

    renderFeatured();
    renderLibrary();
    renderPreview(allStimulus.filter(function (s) { return s.featured; })[0]);
    renderRecommendation();
}

document.addEventListener('DOMContentLoaded', init);
