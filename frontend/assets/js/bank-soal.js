/* ==========================================================================
   BANK SOAL BERBASIS BUDAYA ACEH — Page logic only.
   Rendering, search, filter, sort, preview, event listeners. No data lives
   here — see assets/data/bank-soal.js. Flow: fetchPaketSoal() -> allPaket ->
   render*().

   Scope note (Phase 1): halaman ini mengelola INFORMASI PAKET SOAL saja
   (judul, bidang, jenjang, HOTS, stimulus, link Wordwall, status). Tidak ada
   pertanyaan/opsi/jawaban di sini — itu murni hidup di Wordwall. Aksi
   Tambah/Edit/Hapus paket dibangun di Phase 2; di sini baru Search, Filter,
   Sort, dan Preview Panel (lihat PIVOT_PLAN.md).
   ========================================================================== */
import { fetchPaketSoal, deletePaket } from '../data/bank-soal.js';

/* Filter taxonomy is UI configuration, not dummy content — stays in page logic. */
var FILTER_GROUPS = [
    {
        key: 'status', label: 'Status', options: [
            { value: 'semua', label: 'Semua' },
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' }
        ]
    },
    {
        key: 'hotsLevel', label: 'Level HOTS', options: [
            { value: 'semua', label: 'Semua' },
            { value: 'C4', label: 'C4' },
            { value: 'C5', label: 'C5' },
            { value: 'C6', label: 'C6' }
        ]
    },
    {
        key: 'subject', label: 'Bidang IPA', options: [
            { value: 'semua', label: 'Semua' },
            { value: 'Biologi', label: 'Biologi' },
            { value: 'Fisika', label: 'Fisika' },
            { value: 'Kimia', label: 'Kimia' }
        ]
    }
];

var state = { query: '', status: 'semua', hotsLevel: 'semua', subject: 'semua', sort: 'terbaru' };
var allPaket = [];
var pendingDeleteId = null;

function hotsBadgeClass(level) {
    return { C4: 'badge--c4', C5: 'badge--c5', C6: 'badge--c6' }[level] || 'badge--c4';
}

function statusBadgeClass(status) {
    return status === 'published' ? 'badge--selesai' : 'badge--belum';
}

function statusLabel(status) {
    return status === 'published' ? 'Published' : 'Draft';
}

function truncate(text, max) {
    if (text.length <= max) return text;
    return text.slice(0, max).trim() + '…';
}

function sortPaket(list, sort) {
    var copy = list.slice();
    if (sort === 'az') {
        copy.sort(function (a, b) { return a.title.localeCompare(b.title); });
    } else if (sort === 'terlama') {
        copy.sort(function (a, b) { return new Date(a.createdAt) - new Date(b.createdAt); });
    } else {
        copy.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    }
    return copy;
}

function applyFilters() {
    var q = state.query.trim().toLowerCase();
    var filtered = allPaket.filter(function (item) {
        var matchesQuery = !q ||
            item.title.toLowerCase().indexOf(q) !== -1 ||
            item.stimulus.toLowerCase().indexOf(q) !== -1;
        var matchesStatus = state.status === 'semua' || item.status === state.status;
        var matchesHots = state.hotsLevel === 'semua' || item.hotsLevel === state.hotsLevel;
        var matchesSubject = state.subject === 'semua' || item.subject === state.subject;
        return matchesQuery && matchesStatus && matchesHots && matchesSubject;
    });
    return sortPaket(filtered, state.sort);
}

/* --- KPI Stats --- */

function computeStats() {
    var total = allPaket.length;
    var draft = allPaket.filter(function (p) { return p.status === 'draft'; }).length;
    var published = allPaket.filter(function (p) { return p.status === 'published'; }).length;
    var terhubung = allPaket.filter(function (p) { return !!p.wordwallUrl; }).length;

    return [
        { icon: 'folder', label: 'Total Paket Soal', value: String(total), unit: 'Paket' },
        { icon: 'edit-3', label: 'Draft', value: String(draft), unit: 'Paket' },
        { icon: 'check-circle', label: 'Published', value: String(published), unit: 'Paket' },
        { icon: 'link', label: 'Terhubung Wordwall', value: String(terhubung), unit: 'Paket' }
    ];
}

function renderStatCard(stat) {
    return (
        '<div class="card-stat">' +
            '<div class="card-stat__header">' +
                '<span class="card-stat__icon"><i data-lucide="' + stat.icon + '"></i></span>' +
                '<span class="card-stat__label">' + stat.label + '</span>' +
            '</div>' +
            '<div class="card-stat__value">' + stat.value + '<span class="card-stat__unit">' + stat.unit + '</span></div>' +
        '</div>'
    );
}

function renderStats() {
    document.getElementById('soalStats').innerHTML = computeStats().map(renderStatCard).join('');
    initIcons();
}

/* --- Daftar Paket Soal --- */

function renderPaketCard(item) {
    return (
        '<article class="soal-card card-light" data-id="' + item.id + '" tabindex="0" role="button" aria-label="Lihat detail paket soal ' + item.title + '">' +
            '<div class="soal-card__head">' +
                '<h3 class="soal-card__title">' + item.title + '</h3>' +
                '<span class="badge ' + statusBadgeClass(item.status) + '">' + statusLabel(item.status) + '</span>' +
            '</div>' +
            '<div class="soal-card__meta">' +
                '<span><i data-lucide="flask-conical"></i>' + item.subject + '</span>' +
                '<span><i data-lucide="graduation-cap"></i>' + item.grade + '</span>' +
            '</div>' +
            '<p class="soal-card__summary">' + truncate(item.stimulus, 140) + '</p>' +
            '<div class="soal-card__tags">' +
                '<span class="badge ' + hotsBadgeClass(item.hotsLevel) + '">' + item.hotsLevel + '</span>' +
            '</div>' +
        '</article>'
    );
}

function renderEmptyState() {
    return (
        '<div class="card-light">' +
            '<div class="empty-state">' +
                '<div class="empty-state__icon"><i data-lucide="search-x"></i></div>' +
                '<h3 class="empty-state__title">Paket soal tidak ditemukan</h3>' +
                '<p class="empty-state__desc">Coba ubah kata kunci pencarian atau pilih filter lain.</p>' +
            '</div>' +
        '</div>'
    );
}

function renderSkeleton() {
    var listCard = (
        '<div class="card-light soal-card">' +
            '<div class="skeleton skeleton--text" style="width:50%;"></div>' +
            '<div class="skeleton skeleton--title"></div>' +
            '<div class="skeleton skeleton--text"></div>' +
        '</div>'
    );
    document.getElementById('questionList').innerHTML = listCard + listCard + listCard + listCard + listCard;

    var statCard = '<div class="card-stat"><div class="skeleton skeleton--text" style="width:50%;"></div><div class="skeleton skeleton--title"></div></div>';
    document.getElementById('soalStats').innerHTML = statCard + statCard + statCard + statCard;
}

function renderPaketList() {
    var container = document.getElementById('questionList');
    var filtered = applyFilters();

    container.innerHTML = filtered.length === 0
        ? renderEmptyState()
        : filtered.map(renderPaketCard).join('');

    initIcons();
}

/* --- Preview Panel --- */

function renderPreview(item) {
    var panel = document.getElementById('soalPreview');

    if (!item) {
        panel.innerHTML = (
            '<div class="empty-state">' +
                '<div class="empty-state__icon"><i data-lucide="mouse-pointer-click"></i></div>' +
                '<h3 class="empty-state__title">Pilih Paket Soal</h3>' +
                '<p class="empty-state__desc">Klik salah satu paket untuk melihat detail di sini.</p>' +
            '</div>'
        );
        initIcons();
        return;
    }

    var wordwallConnected = !!item.wordwallUrl;
    var smartDiagnosticButton = item.status === 'published'
        ? '<a href="smart-diagnostic.html?paket=' + item.id + '" class="btn btn-primary"><i data-lucide="play-circle"></i> Smart Diagnostic</a>'
        : '';

    panel.innerHTML = (
        '<button type="button" class="preview-panel__close" id="soalPreviewClose" aria-label="Tutup pratinjau"><i data-lucide="x"></i></button>' +
        '<span class="soal-preview__eyebrow">' + item.subject + ' &middot; ' + item.grade + '</span>' +
        '<h2 class="soal-preview__title">' + item.title + '</h2>' +
        '<div class="soal-preview__tags">' +
            '<span class="badge ' + hotsBadgeClass(item.hotsLevel) + '">' + item.hotsLevel + '</span>' +
            '<span class="badge ' + statusBadgeClass(item.status) + '">' + statusLabel(item.status) + '</span>' +
        '</div>' +
        '<h3 class="soal-preview__section-title">Stimulus Budaya Aceh</h3>' +
        '<p class="soal-preview__question">' + item.stimulus + '</p>' +
        '<h3 class="soal-preview__section-title">Aktivitas Wordwall</h3>' +
        '<p class="soal-preview__wordwall-indicator ' + (wordwallConnected ? 'is-connected' : 'is-disconnected') + '">' +
            '<i data-lucide="' + (wordwallConnected ? 'link' : 'unlink') + '"></i> ' +
            (wordwallConnected ? 'Sudah Terhubung' : 'Belum Terhubung') +
        '</p>' +
        '<div class="soal-preview__action">' +
            '<a href="detail-soal.html?id=' + item.id + '" class="btn btn-secondary"><i data-lucide="pencil"></i> Edit</a>' +
            smartDiagnosticButton +
            '<button type="button" class="btn-icon btn-icon--danger" id="soalDeleteBtn" data-id="' + item.id + '" data-title="' + item.title + '" aria-label="Hapus Paket Soal" title="Hapus Paket Soal"><i data-lucide="trash-2"></i></button>' +
        '</div>'
    );
    initIcons();

    var closeBtn = document.getElementById('soalPreviewClose');
    if (closeBtn) closeBtn.addEventListener('click', closeMobilePreview);

    var deleteBtn = document.getElementById('soalDeleteBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function () {
            openDeleteConfirm(deleteBtn.getAttribute('data-id'), deleteBtn.getAttribute('data-title'));
        });
    }
}

function selectPaket(id) {
    var item = allPaket.filter(function (p) { return p.id === id; })[0];
    if (!item) return;
    renderPreview(item);
    openMobilePreview();
}

function openMobilePreview() {
    document.getElementById('soalPreview').classList.add('is-open');
    document.getElementById('soalPreviewBackdrop').classList.add('is-open');
}

function closeMobilePreview() {
    document.getElementById('soalPreview').classList.remove('is-open');
    document.getElementById('soalPreviewBackdrop').classList.remove('is-open');
}

/* --- Delete Confirmation Modal --- */

function openDeleteConfirm(id, title) {
    pendingDeleteId = id;
    document.getElementById('deleteConfirmDesc').textContent =
        'Paket soal "' + title + '" akan dihapus secara permanen dan tidak dapat dikembalikan.';
    document.getElementById('deleteConfirmBackdrop').classList.add('is-open');
}

function closeDeleteConfirm() {
    pendingDeleteId = null;
    document.getElementById('deleteConfirmBackdrop').classList.remove('is-open');
}

async function confirmDelete() {
    if (!pendingDeleteId) return;

    allPaket = await deletePaket(pendingDeleteId);
    closeDeleteConfirm();
    closeMobilePreview();

    renderStats();
    renderPaketList();
    renderPreview(null);
}

/* --- Shared small helpers --- */

function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

/* --- Filters UI --- */

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
    document.getElementById('soalFilters').innerHTML = '<div class="filter-groups-stack">' + FILTER_GROUPS.map(renderFilterGroup).join('') + '</div>';
}

/* --- Event listeners --- */

function bindEvents() {
    document.getElementById('soalSearchInput').addEventListener('input', function (e) {
        state.query = e.target.value;
        renderPaketList();
    });

    document.getElementById('soalSortSelect').addEventListener('change', function (e) {
        state.sort = e.target.value;
        renderPaketList();
    });

    document.getElementById('soalFilters').addEventListener('click', function (e) {
        var btn = e.target.closest('.filter-chip');
        if (!btn) return;

        state[btn.getAttribute('data-group')] = btn.getAttribute('data-value');

        btn.parentElement.querySelectorAll('.filter-chip').forEach(function (sib) {
            var isActive = sib === btn;
            sib.classList.toggle('is-active', isActive);
            sib.setAttribute('aria-pressed', String(isActive));
        });

        renderPaketList();
    });

    document.getElementById('questionList').addEventListener('click', function (e) {
        var card = e.target.closest('.soal-card');
        if (card) selectPaket(card.getAttribute('data-id'));
    });

    document.getElementById('questionList').addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var card = e.target.closest('.soal-card');
        if (!card) return;
        e.preventDefault();
        selectPaket(card.getAttribute('data-id'));
    });

    document.getElementById('soalPreviewBackdrop').addEventListener('click', closeMobilePreview);

    document.getElementById('deleteCancelBtn').addEventListener('click', closeDeleteConfirm);
    document.getElementById('deleteConfirmBtn').addEventListener('click', confirmDelete);
    document.getElementById('deleteConfirmBackdrop').addEventListener('click', function (e) {
        if (e.target.id === 'deleteConfirmBackdrop') closeDeleteConfirm();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (document.getElementById('deleteConfirmBackdrop').classList.contains('is-open')) {
            closeDeleteConfirm();
        } else {
            closeMobilePreview();
        }
    });
}

/* --- Init: API (mock for now) -> allPaket -> render --- */

async function init() {
    renderFilters();
    bindEvents();
    renderSkeleton();

    allPaket = await fetchPaketSoal();

    renderStats();
    renderPaketList();
    renderPreview(null);
}

document.addEventListener('DOMContentLoaded', init);
