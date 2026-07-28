/* ==========================================================================
   UBAH PASSWORD — Page logic only. Validates the form, calls
   assets/data/auth.js#changePassword, then forces re-login (the old JWT
   was issued for the old password's session) by clearing localStorage and
   redirecting to login.html.
   ========================================================================== */
import { changePassword } from '../data/auth.js';

var FIELDS = ['oldPassword', 'newPassword', 'confirmPassword'];

function clearErrors() {
    document.querySelectorAll('.form-field.has-error').forEach(function (field) {
        field.classList.remove('has-error');
    });
}

function markError(fieldId, message) {
    var field = document.getElementById('field-' + fieldId);
    field.classList.add('has-error');
    if (message) {
        field.querySelector('.form-field__error').textContent = message;
    }
}

function validate() {
    clearErrors();
    var values = {
        oldPassword: document.getElementById('oldPassword').value,
        newPassword: document.getElementById('newPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };

    var firstInvalidField = null;

    if (!values.oldPassword) {
        markError('oldPassword');
        firstInvalidField = firstInvalidField || 'oldPassword';
    }
    if (!values.newPassword || values.newPassword.length < 6) {
        markError('newPassword');
        firstInvalidField = firstInvalidField || 'newPassword';
    }
    if (values.confirmPassword !== values.newPassword) {
        markError('confirmPassword');
        firstInvalidField = firstInvalidField || 'confirmPassword';
    }

    if (firstInvalidField) {
        document.getElementById(firstInvalidField).focus();
        return null;
    }
    return values;
}

function renderSuccess() {
    document.getElementById('ubahPasswordCard').innerHTML = (
        '<div class="empty-state">' +
            '<div class="empty-state__icon"><i data-lucide="check-circle-2"></i></div>' +
            '<h3 class="empty-state__title">Password berhasil diubah</h3>' +
            '<p class="empty-state__desc">Silakan masuk kembali menggunakan password baru Anda.</p>' +
        '</div>'
    );
    initIcons();
}

function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

function bindEvents() {
    var form = document.getElementById('ubahPasswordForm');
    var submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        var values = validate();
        if (!values) return;

        submitBtn.disabled = true;

        try {
            await changePassword(values.oldPassword, values.newPassword);
            renderSuccess();
            window.setTimeout(function () {
                window.localStorage.removeItem('token');
                window.localStorage.removeItem('guru');
                window.location.href = 'login.html';
            }, 1800);
        } catch (err) {
            markError('oldPassword', err.message || 'Gagal mengubah password.');
            submitBtn.disabled = false;
        }
    });
}

function init() {
    bindEvents();
    initIcons();
}

document.addEventListener('DOMContentLoaded', init);
