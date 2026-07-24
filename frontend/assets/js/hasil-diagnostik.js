/* ==========================================================================
   DASHBOARD HASIL — Page logic only. No data lives here — see
   assets/data/hasil.js. Flow: fetchHasil() -> hasilList -> compute summary
   -> render summary cards, chart, table.

   Scope (Requirement Pivot Revisi 7): this page only visualizes prototype
   data. No score calculation from Wordwall, no real student results, no
   search/filter/sort/pagination/export — see PIVOT_PLAN.md.
   ========================================================================== */
import { fetchHasil } from '../data/hasil.js';

function statusBadgeClass(status) {
    return status === 'Tuntas' ? 'badge--selesai' : 'badge--belum';
}

function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

/* --- Summary --- */

function computeSummary(list) {
    var total = list.length;
    var tuntas = list.filter(function (h) { return h.status === 'Tuntas'; }).length;
    var belumTuntas = list.filter(function (h) { return h.status === 'Belum Tuntas'; }).length;
    var average = total === 0 ? 0 : list.reduce(function (sum, h) { return sum + h.score; }, 0) / total;

    return {
        jumlahSiswa: total,
        rataRata: Math.round(average * 10) / 10,
        tuntas: tuntas,
        belumTuntas: belumTuntas
    };
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

function renderSummary(summary) {
    var cards = [
        { icon: 'users', label: 'Jumlah Siswa', value: String(summary.jumlahSiswa), unit: 'Siswa' },
        { icon: 'bar-chart-2', label: 'Rata-rata Nilai', value: String(summary.rataRata), unit: '' },
        { icon: 'check-circle', label: 'Tuntas', value: String(summary.tuntas), unit: 'Siswa' },
        { icon: 'x-circle', label: 'Belum Tuntas', value: String(summary.belumTuntas), unit: 'Siswa' }
    ];
    document.getElementById('hasilSummaryGrid').innerHTML = cards.map(renderStatCard).join('');
    initIcons();
}

/* --- Grafik: Tuntas vs Belum Tuntas (built from the shared .progress-bar) --- */

function renderChartRow(label, count, total, fillModifier) {
    var percent = total === 0 ? 0 : Math.round((count / total) * 100);
    return (
        '<div class="hasil-chart__row">' +
            '<div class="hasil-chart__row-label"><span>' + label + '</span><span>' + count + ' siswa (' + percent + '%)</span></div>' +
            '<div class="progress-bar" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + label + '">' +
                '<div class="progress-bar__fill ' + fillModifier + '" style="width:' + percent + '%"></div>' +
            '</div>' +
        '</div>'
    );
}

function renderChart(summary) {
    var html =
        renderChartRow('Tuntas', summary.tuntas, summary.jumlahSiswa, 'hasil-chart__fill--tuntas') +
        renderChartRow('Belum Tuntas', summary.belumTuntas, summary.jumlahSiswa, 'hasil-chart__fill--belum');
    document.getElementById('hasilChart').innerHTML = html;
}

/* --- Tabel Hasil --- */

function renderTableRow(item) {
    return (
        '<tr>' +
            '<td>' + item.studentName + '</td>' +
            '<td>' + item.materi + '</td>' +
            '<td>' + item.date + '</td>' +
            '<td>' + item.score + '</td>' +
            '<td><span class="badge ' + statusBadgeClass(item.status) + '">' + item.status + '</span></td>' +
        '</tr>'
    );
}

function renderTable(list) {
    document.getElementById('hasilTableBody').innerHTML = list.map(renderTableRow).join('');
}

/* --- Empty state --- */

function toggleEmptyState(isEmpty) {
    document.getElementById('hasilEmptyState').hidden = !isEmpty;
    document.getElementById('hasilContent').hidden = isEmpty;
    if (isEmpty) initIcons();
}

async function init() {
    var hasilList = await fetchHasil();
    var isEmpty = hasilList.length === 0;

    toggleEmptyState(isEmpty);
    if (isEmpty) return;

    var summary = computeSummary(hasilList);
    renderSummary(summary);
    renderChart(summary);
    renderTable(hasilList);
}

document.addEventListener('DOMContentLoaded', init);
