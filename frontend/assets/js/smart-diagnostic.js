/* ==========================================================================
   SMART DIAGNOSTIC — Page logic only. No data lives here — see
   assets/data/bank-soal.js. Three views, one page, no routing:
     1. Daftar Paket Published (list)
     2. Stimulus Budaya Aceh (intro, before Wordwall opens)
     3. Embed Wordwall (iframe) — or an Empty State if the link is missing

   Scope (Requirement Pivot Revisi 7): this page only reads paket with
   status === 'published' and opens paket.wordwallUrl in an iframe. No
   timer, no scoring, no answer storage, no Wordwall API, no AI.
   ========================================================================== */
import { fetchPaketSoal } from '../data/bank-soal.js';

var publishedPaket = [];
var selectedPaket = null;

function hotsBadgeClass(level) {
    return { C4: 'badge--c4', C5: 'badge--c5', C6: 'badge--c6' }[level] || 'badge--c4';
}

function truncate(text, max) {
    if (text.length <= max) return text;
    return text.slice(0, max).trim() + '…';
}

function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

/* --- View switching --- */

function showView(view) {
    document.getElementById('diagnosticListView').hidden = view !== 'list';
    document.getElementById('diagnosticStimulusView').hidden = view !== 'stimulus';
    document.getElementById('diagnosticEmbedView').hidden = view !== 'embed';
    window.scrollTo(0, 0);
}

/* --- View 1: Daftar Paket Published --- */

function renderCard(item) {
    return (
        '<article class="diagnostic-card card-light" data-id="' + item.id + '">' +
            '<div class="diagnostic-card__head">' +
                '<h3 class="diagnostic-card__title">' + item.title + '</h3>' +
                '<span class="badge ' + hotsBadgeClass(item.hotsLevel) + '">' + item.hotsLevel + '</span>' +
            '</div>' +
            '<div class="diagnostic-card__meta">' +
                '<span><i data-lucide="flask-conical"></i>' + item.subject + '</span>' +
                '<span><i data-lucide="graduation-cap"></i>' + item.grade + '</span>' +
            '</div>' +
            '<p class="diagnostic-card__summary">' + truncate(item.stimulus, 120) + '</p>' +
            '<div class="diagnostic-card__action">' +
                '<button type="button" class="btn btn-primary" data-action="open"><i data-lucide="play-circle"></i> Mulai</button>' +
            '</div>' +
        '</article>'
    );
}

function renderEmptyList() {
    return (
        '<div class="card-light empty-state-full">' +
            '<div class="empty-state">' +
                '<div class="empty-state__icon"><i data-lucide="inbox"></i></div>' +
                '<h3 class="empty-state__title">Belum ada paket soal Published</h3>' +
                '<p class="empty-state__desc">Publikasikan paket soal terlebih dahulu di Bank Soal Berbasis Budaya Aceh agar muncul di sini.</p>' +
            '</div>' +
        '</div>'
    );
}

function renderList() {
    var grid = document.getElementById('diagnosticGrid');
    grid.innerHTML = publishedPaket.length === 0
        ? renderEmptyList()
        : publishedPaket.map(renderCard).join('');
    initIcons();
}

/* --- View 2: Stimulus Budaya Aceh --- */

function renderStimulus(item) {
    var container = document.getElementById('diagnosticStimulusContent');
    container.innerHTML = (
        '<h2 class="diagnostic-stimulus__title">' + item.title + '</h2>' +
        '<div class="diagnostic-stimulus__tags">' +
            '<span class="badge badge--info">' + item.subject + '</span>' +
            '<span class="badge badge--info">' + item.grade + '</span>' +
            '<span class="badge ' + hotsBadgeClass(item.hotsLevel) + '">' + item.hotsLevel + '</span>' +
        '</div>' +
        '<h3 class="diagnostic-stimulus__section-title">Stimulus Budaya Aceh</h3>' +
        '<p class="diagnostic-stimulus__text">' + item.stimulus + '</p>' +
        '<div class="diagnostic-stimulus__actions">' +
            '<button type="button" class="btn btn-secondary" id="stimulusBackBtn"><i data-lucide="arrow-left"></i> Kembali</button>' +
            '<button type="button" class="btn btn-primary" id="stimulusStartBtn"><i data-lucide="play-circle"></i> Mulai Diagnostik</button>' +
        '</div>'
    );
    initIcons();

    document.getElementById('stimulusBackBtn').addEventListener('click', function () {
        showView('list');
    });
    document.getElementById('stimulusStartBtn').addEventListener('click', function () {
        startDiagnostic(item);
    });
}

function openStimulus(id) {
    var item = publishedPaket.filter(function (p) { return String(p.id) === String(id); })[0];
    if (!item) return;
    selectedPaket = item;
    renderStimulus(item);
    showView('stimulus');
}

/* --- View 3: Embed Wordwall / Empty State --- */

function renderEmbed(item) {
    var container = document.getElementById('diagnosticEmbedContent');
    var hasUrl = !!item.wordwallUrl;

    var body = hasUrl
        ? '<div class="embed-frame"><iframe src="' + item.wordwallUrl + '" title="Aktivitas Wordwall - ' + item.title + '" allowfullscreen></iframe></div>'
        : (
            '<div class="empty-state">' +
                '<div class="empty-state__icon"><i data-lucide="link-2-off"></i></div>' +
                '<h3 class="empty-state__title">Link Wordwall belum tersedia</h3>' +
                '<p class="empty-state__desc">Silakan kembali ke Bank Soal dan lengkapi paket soal.</p>' +
            '</div>'
        );

    container.innerHTML = (
        '<div class="diagnostic-embed__head">' +
            '<h2 class="diagnostic-embed__title">' + item.title + '</h2>' +
            '<button type="button" class="btn btn-secondary" id="embedBackBtn"><i data-lucide="arrow-left"></i> Kembali</button>' +
        '</div>' +
        body
    );
    initIcons();

    document.getElementById('embedBackBtn').addEventListener('click', function () {
        showView(hasUrl ? 'stimulus' : 'list');
    });
}

function startDiagnostic(item) {
    renderEmbed(item);
    showView('embed');
}

/* --- Event listeners --- */

function bindEvents() {
    document.getElementById('diagnosticGrid').addEventListener('click', function (e) {
        var card = e.target.closest('.diagnostic-card');
        if (card) openStimulus(card.getAttribute('data-id'));
    });
}

/* --- Direct-link support: bank-soal.html links here as
   smart-diagnostic.html?paket=<id> for a Published paket. Per the flow,
   a direct link still lands on the Stimulus view, never straight to the
   iframe. An unknown or non-Published id silently falls back to the list. --- */

function openFromQueryParam() {
    var id = new URLSearchParams(window.location.search).get('paket');
    if (!id) return false;
    var item = publishedPaket.filter(function (p) { return String(p.id) === String(id); })[0];
    if (!item) return false;
    openStimulus(item.id);
    return true;
}

async function init() {
    bindEvents();

    var allPaket = await fetchPaketSoal();
    publishedPaket = allPaket.filter(function (p) { return p.status === 'published'; });

    renderList();
    if (!openFromQueryParam()) {
        showView('list');
    }
}

document.addEventListener('DOMContentLoaded', init);
