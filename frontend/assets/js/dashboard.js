/* ==========================================================================
   DASHBOARD HOME — Page logic only.
   Rendering, greeting date, and scroll-triggered progress bar animation.
   No data lives here — see assets/data/dashboard.js.
   Flow: fetchDashboardData() -> render*() per section.
   ========================================================================== */
import { fetchDashboardData } from '../data/dashboard.js';

var STATUS_BADGE_CLASS = { important: 'badge--important', new: 'badge--new', info: 'badge--info' };

/* --- Render functions: each renders one section, from data it's given --- */

function renderGreeting(greeting) {
    document.getElementById('welcomeTitle').textContent = 'Selamat Datang, ' + greeting.name;
    document.getElementById('welcomeMessage').textContent = greeting.message;
}

function renderTodayDate() {
    var el = document.getElementById('welcomeDate');
    if (!el) return;
    el.textContent = new Date().toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
}

function renderStatCard(stat) {
    var progressBlock = stat.isProgress ? (
        '<div class="progress-bar progress-bar--sm" role="progressbar" aria-valuenow="' + stat.value + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + stat.label + '">' +
            '<div class="progress-bar__fill" data-progress="' + stat.value + '"></div>' +
        '</div>'
    ) : '';
    return (
        '<div class="card-stat' + (stat.isProgress ? ' card-stat--progress' : '') + '">' +
            '<div class="card-stat__header">' +
                '<span class="card-stat__icon"><i data-lucide="' + stat.icon + '"></i></span>' +
                '<span class="card-stat__label">' + stat.label + '</span>' +
            '</div>' +
            '<div class="card-stat__value">' + stat.value + '<span class="card-stat__unit">' + stat.unit + '</span></div>' +
            progressBlock +
        '</div>'
    );
}

function renderStats(stats) {
    document.getElementById('kpiGrid').innerHTML = stats.map(renderStatCard).join('');
}

function renderQuickAccessCard(item) {
    return (
        '<a href="' + item.href + '" class="quick-access-card card-light">' +
            '<span class="quick-access-card__icon"><i data-lucide="' + item.icon + '"></i></span>' +
            '<span class="quick-access-card__title">' + item.title + '</span>' +
            '<span class="quick-access-card__desc">' + item.desc + '</span>' +
        '</a>'
    );
}

function renderQuickAccess(items) {
    document.getElementById('quickAccessGrid').innerHTML = items.map(renderQuickAccessCard).join('');
}

function renderActivityItem(item) {
    return (
        '<li class="timeline__item">' +
            '<span class="timeline__icon"><i data-lucide="' + item.icon + '"></i></span>' +
            '<div class="timeline__body">' +
                '<p class="timeline__text">' + item.text + '</p>' +
                '<span class="timeline__time">' + item.time + '</span>' +
            '</div>' +
        '</li>'
    );
}

function renderRecentActivity(items) {
    var list = document.getElementById('recentActivityList');
    if (!items.length) {
        list.innerHTML = (
            '<li class="timeline__empty">' +
                '<div class="empty-state">' +
                    '<div class="empty-state__icon"><i data-lucide="inbox"></i></div>' +
                    '<h3 class="empty-state__title">Belum ada aktivitas</h3>' +
                    '<p class="empty-state__desc">Aktivitas pelatihan Anda akan muncul di sini.</p>' +
                '</div>' +
            '</li>'
        );
        return;
    }
    list.innerHTML = items.map(renderActivityItem).join('');
}

function renderAnnouncementItem(item) {
    var badgeClass = STATUS_BADGE_CLASS[item.status] || 'badge--info';
    return (
        '<li class="announcement-item">' +
            '<div class="announcement-item__head">' +
                '<span class="badge ' + badgeClass + '">' + item.badgeLabel + '</span>' +
                '<span class="announcement-item__date">' + item.date + '</span>' +
            '</div>' +
            '<p class="announcement-item__title">' + item.title + '</p>' +
            '<p class="announcement-item__desc">' + item.desc + '</p>' +
        '</li>'
    );
}

function renderAnnouncements(items) {
    document.getElementById('announcementList').innerHTML = items.map(renderAnnouncementItem).join('');
}

function renderLearningProgressItem(item) {
    return (
        '<div class="learning-progress-item">' +
            '<div class="learning-progress-item__head">' +
                '<span>' + item.label + '</span>' +
                '<span>' + item.percent + '%</span>' +
            '</div>' +
            '<div class="progress-bar" role="progressbar" aria-valuenow="' + item.percent + '" aria-valuemin="0" aria-valuemax="100" aria-label="Progress ' + item.label + '">' +
                '<div class="progress-bar__fill" data-progress="' + item.percent + '"></div>' +
            '</div>' +
        '</div>'
    );
}

function renderLearningProgress(items) {
    document.getElementById('learningProgressList').innerHTML = items.map(renderLearningProgressItem).join('');
}

/* --- Loading skeleton (shown briefly while fetchDashboardData resolves) --- */

function renderSkeleton() {
    var kpiCard = '<div class="card-stat"><div class="skeleton skeleton--text" style="width:50%;"></div><div class="skeleton skeleton--title"></div></div>';
    document.getElementById('kpiGrid').innerHTML = kpiCard + kpiCard + kpiCard + kpiCard;

    var quickCard = '<div class="card-light"><div class="skeleton skeleton--text" style="width:40%;"></div><div class="skeleton skeleton--title"></div><div class="skeleton skeleton--text"></div></div>';
    document.getElementById('quickAccessGrid').innerHTML = quickCard + quickCard + quickCard + quickCard + quickCard + quickCard;

    var listItemRow = '<li class="skeleton skeleton--text" style="margin-bottom:16px;"></li>';
    var divRow = '<div class="skeleton skeleton--text" style="margin-bottom:16px;"></div>';
    document.getElementById('recentActivityList').innerHTML = listItemRow + listItemRow + listItemRow;
    document.getElementById('announcementList').innerHTML = listItemRow + listItemRow + listItemRow;
    document.getElementById('learningProgressList').innerHTML = divRow + divRow + divRow;
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

/* --- Init: API (mock for now) -> data -> render --- */

async function init() {
    renderTodayDate();
    renderSkeleton();

    var data = await fetchDashboardData();

    renderGreeting(data.greeting);
    renderStats(data.stats);
    renderQuickAccess(data.quickAccess);
    renderRecentActivity(data.recentActivity);
    renderAnnouncements(data.announcements);
    renderLearningProgress(data.learningProgress);

    initIcons();
    initProgressBars(document);
}

document.addEventListener('DOMContentLoaded', init);
