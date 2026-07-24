/* ==========================================================================
   BANK SOAL HOTS IPA — Page logic only.
   Rendering, search, filter, sort, preview, action menu (preview/edit/
   duplicate/delete), recommendation, event listeners. No data lives here —
   see assets/data/bank-soal.js. Flow: fetchQuestionBank() -> allQuestions ->
   render*().

   Cross-page relationship: each question stores only stimulusId (a foreign
   key). The stimulus title is resolved here by looking it up in
   assets/data/stimulus.js — the same way a real backend join would work.
   ========================================================================== */
import { fetchQuestionBank } from '../data/bank-soal.js';
import { stimulusData } from '../data/stimulus.js';

var STIMULUS_MAP = {};
stimulusData.forEach(function (s) { STIMULUS_MAP[s.id] = s; });

function getStimulusTitle(stimulusId) {
    var s = STIMULUS_MAP[stimulusId];
    return s ? s.title : 'Stimulus tidak ditemukan';
}

/* Filter taxonomy is UI configuration, not dummy content — stays in page logic. */
var FILTER_GROUPS = [
    {
        key: 'status', label: 'Status', options: [
            { value: 'semua', label: 'Semua' },
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Dipublikasikan' }
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
var allQuestions = [];

function hotsBadgeClass(level) {
    return { C4: 'badge--c4', C5: 'badge--c5', C6: 'badge--c6' }[level] || 'badge--c4';
}

function statusBadgeClass(status) {
    return status === 'published' ? 'badge--selesai' : 'badge--belum';
}

function statusLabel(status) {
    return status === 'published' ? 'Dipublikasikan' : 'Draft';
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function truncate(text, max) {
    if (text.length <= max) return text;
    return text.slice(0, max).trim() + '…';
}

function sortQuestions(list, sort) {
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
    var filtered = allQuestions.filter(function (item) {
        var matchesQuery = !q ||
            item.title.toLowerCase().indexOf(q) !== -1 ||
            item.question.toLowerCase().indexOf(q) !== -1 ||
            item.competency.toLowerCase().indexOf(q) !== -1;
        var matchesStatus = state.status === 'semua' || item.status === state.status;
        var matchesHots = state.hotsLevel === 'semua' || item.hotsLevel === state.hotsLevel;
        var matchesSubject = state.subject === 'semua' || item.subject === state.subject;
        return matchesQuery && matchesStatus && matchesHots && matchesSubject;
    });
    return sortQuestions(filtered, state.sort);
}

/* --- KPI Stats --- */

function computeStats() {
    var total = allQuestions.length;
    var draft = allQuestions.filter(function (q) { return q.status === 'draft'; }).length;
    var published = allQuestions.filter(function (q) { return q.status === 'published'; }).length;
    var levelMap = { C4: 4, C5: 5, C6: 6 };
    var avg = total ? allQuestions.reduce(function (sum, q) { return sum + (levelMap[q.hotsLevel] || 0); }, 0) / total : 0;

    return [
        { icon: 'file-text', label: 'Total Soal', value: String(total), unit: 'Soal' },
        { icon: 'edit-3', label: 'Draft', value: String(draft), unit: 'Soal' },
        { icon: 'check-circle', label: 'Dipublikasikan', value: String(published), unit: 'Soal' },
        { icon: 'trending-up', label: 'Rata-rata HOTS', value: 'C' + avg.toFixed(1), unit: '' }
    ];
}

function renderStatCard(stat) {
    return (
        '<div class="card-stat">' +
            '<div class="card-stat__header">' +
                '<span class="card-stat__icon"><i data-lucide="' + stat.icon + '"></i></span>' +
                '<span class="card-stat__label">' + stat.label + '</span>' +
            '</div>' +
            '<div class="card-stat__value">' + stat.value + (stat.unit ? '<span class="card-stat__unit">' + stat.unit + '</span>' : '') + '</div>' +
        '</div>'
    );
}

function renderStats() {
    document.getElementById('soalStats').innerHTML = computeStats().map(renderStatCard).join('');
    initIcons();
}

/* --- Question List + Action Menu --- */

function renderQuestionCard(item) {
    return (
        '<article class="soal-card card-light" data-id="' + item.id + '">' +
            '<div class="soal-card__head">' +
                '<h3 class="soal-card__title">' + item.title + '</h3>' +
                '<div class="soal-card__menu">' +
                    '<button type="button" class="btn-icon soal-card__menu-btn" data-menu-toggle="' + item.id + '" aria-haspopup="true" aria-expanded="false" aria-label="Menu aksi soal ' + item.title + '"><i data-lucide="more-vertical"></i></button>' +
                    '<div class="dropdown-menu" id="menu-' + item.id + '" role="menu" hidden>' +
                        '<button type="button" class="dropdown-menu__item" role="menuitem" data-action="preview" data-id="' + item.id + '"><i data-lucide="eye"></i> Preview</button>' +
                        '<a href="detail-soal.html?id=' + item.id + '" class="dropdown-menu__item" role="menuitem"><i data-lucide="pencil"></i> Edit</a>' +
                        '<button type="button" class="dropdown-menu__item" role="menuitem" data-action="duplicate" data-id="' + item.id + '"><i data-lucide="copy"></i> Duplikasi</button>' +
                        '<button type="button" class="dropdown-menu__item dropdown-menu__item--danger" role="menuitem" data-action="delete" data-id="' + item.id + '"><i data-lucide="trash-2"></i> Hapus</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="soal-card__meta">' +
                '<span><i data-lucide="link"></i>' + getStimulusTitle(item.stimulusId) + '</span>' +
                '<span><i data-lucide="flask-conical"></i>' + item.subject + '</span>' +
                '<span><i data-lucide="calendar"></i>' + formatDate(item.createdAt) + '</span>' +
            '</div>' +
            '<p class="soal-card__summary">' + truncate(item.question, 140) + '</p>' +
            '<div class="soal-card__tags">' +
                '<span class="badge ' + hotsBadgeClass(item.hotsLevel) + '">' + item.hotsLevel + '</span>' +
                '<span class="badge ' + statusBadgeClass(item.status) + '">' + statusLabel(item.status) + '</span>' +
            '</div>' +
        '</article>'
    );
}

function renderEmptyState() {
    return (
        '<div class="card-light">' +
            '<div class="empty-state">' +
                '<div class="empty-state__icon"><i data-lucide="search-x"></i></div>' +
                '<h3 class="empty-state__title">Soal tidak ditemukan</h3>' +
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

function renderQuestionList() {
    var container = document.getElementById('questionList');
    var filtered = applyFilters();

    container.innerHTML = filtered.length === 0
        ? renderEmptyState()
        : filtered.map(renderQuestionCard).join('');

    initIcons();
}

/* --- Preview Panel --- */

function renderPreview(item) {
    var panel = document.getElementById('soalPreview');

    if (!item) {
        panel.innerHTML = (
            '<div class="empty-state">' +
                '<div class="empty-state__icon"><i data-lucide="mouse-pointer-click"></i></div>' +
                '<h3 class="empty-state__title">Pilih Soal</h3>' +
                '<p class="empty-state__desc">Klik salah satu soal untuk melihat detail di sini.</p>' +
            '</div>'
        );
        initIcons();
        return;
    }

    panel.innerHTML = (
        '<button type="button" class="preview-panel__close" id="soalPreviewClose" aria-label="Tutup pratinjau"><i data-lucide="x"></i></button>' +
        '<span class="soal-preview__eyebrow">' + item.subject + ' &middot; ' + statusLabel(item.status) + '</span>' +
        '<h2 class="soal-preview__title">' + item.title + '</h2>' +
        '<div class="soal-preview__tags">' +
            '<span class="badge ' + hotsBadgeClass(item.hotsLevel) + '">' + item.hotsLevel + '</span>' +
            '<span class="badge ' + statusBadgeClass(item.status) + '">' + statusLabel(item.status) + '</span>' +
            '<span class="badge badge--info">' + item.difficulty + '</span>' +
        '</div>' +
        '<p class="soal-preview__stimulus-link">Stimulus: ' + getStimulusTitle(item.stimulusId) + '</p>' +
        '<h3 class="soal-preview__section-title">Pertanyaan</h3>' +
        '<p class="soal-preview__question">' + item.question + '</p>' +
        '<h3 class="soal-preview__section-title">Pilihan Jawaban</h3>' +
        '<ul class="soal-preview__options">' +
            item.options.map(function (opt, idx) {
                var letter = String.fromCharCode(65 + idx);
                var isCorrect = idx === item.answer;
                return (
                    '<li class="soal-preview__option' + (isCorrect ? ' soal-preview__option--correct' : '') + '">' +
                        '<span class="soal-preview__option-letter">' + letter + '.</span> ' + opt +
                        (isCorrect ? ' <i data-lucide="check"></i>' : '') +
                    '</li>'
                );
            }).join('') +
        '</ul>' +
        '<h3 class="soal-preview__section-title">Penjelasan</h3>' +
        '<p class="soal-preview__explanation">' + item.explanation + '</p>' +
        '<h3 class="soal-preview__section-title">Kompetensi</h3>' +
        '<p class="soal-preview__explanation">' + item.competency + '</p>' +
        '<div class="soal-preview__action">' +
            '<a href="detail-soal.html?id=' + item.id + '" class="btn btn-secondary"><i data-lucide="pencil"></i> Edit</a>' +
        '</div>'
    );
    initIcons();

    var closeBtn = document.getElementById('soalPreviewClose');
    if (closeBtn) closeBtn.addEventListener('click', closeMobilePreview);
}

function selectQuestion(id) {
    var item = allQuestions.filter(function (q) { return q.id === id; })[0];
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

/* --- Action handlers (dummy persistence — in-memory only, per spec) --- */

function duplicateQuestion(id) {
    var index = allQuestions.findIndex(function (q) { return q.id === id; });
    if (index === -1) return;
    var original = allQuestions[index];
    var today = new Date().toISOString().slice(0, 10);
    var copy = Object.assign({}, original, {
        id: original.id + '-copy-' + Date.now(),
        title: original.title + ' (Salinan)',
        status: 'draft',
        createdAt: today,
        updatedAt: today
    });
    allQuestions.splice(index + 1, 0, copy);
    renderStats();
    renderQuestionList();
    renderRecommendation();
}

function deleteQuestion(id) {
    var item = allQuestions.filter(function (q) { return q.id === id; })[0];
    if (!item) return;
    if (!window.confirm('Hapus soal "' + item.title + '"? Tindakan ini tidak dapat dibatalkan.')) return;

    allQuestions = allQuestions.filter(function (q) { return q.id !== id; });
    renderStats();
    renderQuestionList();
    renderRecommendation();

    var previewTitle = document.querySelector('.soal-preview__title');
    if (previewTitle && previewTitle.textContent === item.title) {
        renderPreview(null);
    }
}

/* --- Recommendation (computed from data, not hardcoded) --- */

function computeRecommendations() {
    var recs = [];

    var stimulusCounts = {};
    allQuestions.forEach(function (q) { stimulusCounts[q.stimulusId] = (stimulusCounts[q.stimulusId] || 0) + 1; });
    var topStimulusId = null;
    var topCount = 0;
    Object.keys(stimulusCounts).forEach(function (id) {
        if (stimulusCounts[id] > topCount) {
            topCount = stimulusCounts[id];
            topStimulusId = id;
        }
    });
    if (topStimulusId && topCount > 1) {
        recs.push('Soal yang menggunakan stimulus <strong>' + getStimulusTitle(topStimulusId) + '</strong> paling sering digunakan (' + topCount + ' soal).');
    }

    var levelCounts = { C4: 0, C5: 0, C6: 0 };
    allQuestions.forEach(function (q) { if (levelCounts[q.hotsLevel] !== undefined) levelCounts[q.hotsLevel]++; });
    var weakestLevel = 'C4';
    var weakestCount = Infinity;
    Object.keys(levelCounts).forEach(function (level) {
        if (levelCounts[level] < weakestCount) {
            weakestCount = levelCounts[level];
            weakestLevel = level;
        }
    });
    recs.push('Lengkapi lagi soal level <strong>' + weakestLevel + '</strong>, saat ini baru ada ' + weakestCount + ' soal.');

    return recs;
}

function renderRecommendation() {
    var section = document.getElementById('recommendationSection');
    var recs = computeRecommendations();
    if (!recs.length) {
        section.hidden = true;
        return;
    }
    section.hidden = false;
    section.innerHTML = (
        '<div class="section-heading"><h2 class="section-heading__title">Rekomendasi</h2></div>' +
        '<div class="card-light"><ul class="recommendation-list">' + recs.map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ul></div>'
    );
}

/* --- Shared small helpers --- */

function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

function closeAllMenus() {
    document.querySelectorAll('.dropdown-menu').forEach(function (m) { m.hidden = true; });
    document.querySelectorAll('.soal-card__menu-btn').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
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

function bindListEvents() {
    var list = document.getElementById('questionList');

    list.addEventListener('click', function (e) {
        var menuBtn = e.target.closest('.soal-card__menu-btn');
        if (menuBtn) {
            e.stopPropagation();
            var id = menuBtn.getAttribute('data-menu-toggle');
            var menu = document.getElementById('menu-' + id);
            var willOpen = menu.hidden;
            closeAllMenus();
            menu.hidden = !willOpen;
            menuBtn.setAttribute('aria-expanded', String(willOpen));
            return;
        }

        var actionEl = e.target.closest('[data-action]');
        if (actionEl) {
            e.stopPropagation();
            var action = actionEl.getAttribute('data-action');
            var qid = actionEl.getAttribute('data-id');
            closeAllMenus();
            if (action === 'preview') selectQuestion(qid);
            else if (action === 'duplicate') duplicateQuestion(qid);
            else if (action === 'delete') deleteQuestion(qid);
            return;
        }

        var card = e.target.closest('.soal-card');
        if (card && !e.target.closest('.soal-card__menu')) {
            selectQuestion(card.getAttribute('data-id'));
        }
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.soal-card__menu')) closeAllMenus();
    });
}

function bindEvents() {
    document.getElementById('soalSearchInput').addEventListener('input', function (e) {
        state.query = e.target.value;
        renderQuestionList();
    });

    document.getElementById('soalSortSelect').addEventListener('change', function (e) {
        state.sort = e.target.value;
        renderQuestionList();
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

        renderQuestionList();
    });

    bindListEvents();

    document.getElementById('soalPreviewBackdrop').addEventListener('click', closeMobilePreview);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeMobilePreview();
            closeAllMenus();
        }
    });
}

/* --- Init: API (mock for now) -> allQuestions -> render --- */

async function init() {
    renderFilters();
    bindEvents();
    renderSkeleton();

    allQuestions = await fetchQuestionBank();

    renderStats();
    renderQuestionList();
    renderPreview(null);
    renderRecommendation();
}

document.addEventListener('DOMContentLoaded', init);
