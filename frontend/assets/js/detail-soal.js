/* ==========================================================================
   DETAIL PAKET SOAL — Page logic only. One file, two modes: Create (no ?id=)
   and Edit (?id=<paketId>). No data lives here — see assets/data/bank-soal.js.
   Flow: read ?id= -> (edit: fetchPaketById -> fill form) -> validate on
   submit -> savePaket() -> redirect to bank-soal.html.
   ========================================================================== */
import { fetchPaketById, savePaket } from '../data/bank-soal.js';

var editId = new URLSearchParams(window.location.search).get('id');
var isEditMode = !!editId;
var originalPaket = null;

var FIELDS = ['title', 'subject', 'grade', 'hotsLevel', 'stimulus'];

function setModeChrome() {
    var heading = isEditMode ? 'Edit Paket Soal' : 'Tambah Paket Soal';
    document.getElementById('pageTitle').textContent = heading + ' - Smart Diagnostic TKA';
    document.getElementById('formHeading').textContent = heading;
    document.getElementById('breadcrumbCurrent').textContent = heading;
}

function fillForm(paket) {
    document.getElementById('title').value = paket.title;
    document.getElementById('subject').value = paket.subject;
    document.getElementById('grade').value = paket.grade;
    document.getElementById('hotsLevel').value = paket.hotsLevel;
    document.getElementById('stimulus').value = paket.stimulus;
    document.getElementById('wordwallUrl').value = paket.wordwallUrl || '';
    document.getElementById('status').value = paket.status;
}

function clearErrors() {
    document.querySelectorAll('.form-field.has-error').forEach(function (field) {
        field.classList.remove('has-error');
    });
}

function markError(fieldId) {
    document.getElementById('field-' + fieldId).classList.add('has-error');
}

function validate() {
    clearErrors();
    var values = {
        title: document.getElementById('title').value.trim(),
        subject: document.getElementById('subject').value,
        grade: document.getElementById('grade').value,
        hotsLevel: document.getElementById('hotsLevel').value,
        stimulus: document.getElementById('stimulus').value.trim(),
        wordwallUrl: document.getElementById('wordwallUrl').value.trim(),
        status: document.getElementById('status').value
    };

    var firstInvalidField = null;
    FIELDS.forEach(function (key) {
        if (!values[key]) {
            markError(key);
            if (!firstInvalidField) firstInvalidField = key;
        }
    });

    if (values.status === 'published' && !values.wordwallUrl) {
        markError('wordwallUrl');
        if (!firstInvalidField) firstInvalidField = 'wordwallUrl';
    }

    if (firstInvalidField) {
        document.getElementById(firstInvalidField).focus();
        return null;
    }

    return values;
}

function buildPaket(values) {
    if (isEditMode) {
        return Object.assign({}, originalPaket, values, {
            wordwallUrl: values.wordwallUrl || null
        });
    }
    return {
        id: 'paket-' + Date.now(),
        title: values.title,
        subject: values.subject,
        grade: values.grade,
        hotsLevel: values.hotsLevel,
        stimulus: values.stimulus,
        wordwallUrl: values.wordwallUrl || null,
        status: values.status,
        createdAt: new Date().toISOString().slice(0, 10)
    };
}

function bindEvents() {
    document.getElementById('paketForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        var values = validate();
        if (!values) return;

        await savePaket(buildPaket(values));
        window.location.href = 'bank-soal.html';
    });
}

function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

async function init() {
    setModeChrome();
    bindEvents();
    initIcons();

    if (isEditMode) {
        originalPaket = await fetchPaketById(editId);
        if (!originalPaket) {
            window.location.href = 'bank-soal.html';
            return;
        }
        fillForm(originalPaket);
    }
}

document.addEventListener('DOMContentLoaded', init);
