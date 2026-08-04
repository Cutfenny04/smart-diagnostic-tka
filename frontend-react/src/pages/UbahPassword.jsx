import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';
import Layout from '../components/Layout';
import { changePassword } from '../data/authData';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './UbahPassword.css';

const DEFAULT_ERROR = {
  oldPassword: 'Password lama wajib diisi.',
  newPassword: 'Password baru wajib diisi (minimal 6 karakter).',
  confirmPassword: 'Konfirmasi password tidak cocok.',
};

const breadcrumb = [{ label: 'Profil', to: '/profil' }, { label: 'Ubah Password' }];

function UbahPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useDocumentTitle('Ubah Password - Smart Diagnostic TKA');

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validate() {
    const nextErrors = {};
    let firstInvalidField = null;

    if (!form.oldPassword) {
      nextErrors.oldPassword = true;
      firstInvalidField = firstInvalidField || 'oldPassword';
    }
    if (!form.newPassword || form.newPassword.length < 6) {
      nextErrors.newPassword = true;
      firstInvalidField = firstInvalidField || 'newPassword';
    }
    if (form.confirmPassword !== form.newPassword) {
      nextErrors.confirmPassword = true;
      firstInvalidField = firstInvalidField || 'confirmPassword';
    }

    setErrors(nextErrors);
    if (firstInvalidField) {
      document.getElementById(firstInvalidField)?.focus();
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await changePassword(form.oldPassword, form.newPassword);
      setSuccess(true);
      window.setTimeout(() => {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('guru');
        navigate('/login', { replace: true });
      }, 1800);
    } catch (err) {
      setErrors({ oldPassword: err.message || 'Gagal mengubah password.' });
      setSubmitting(false);
    }
  }

  return (
    <Layout breadcrumb={breadcrumb}>
      <div className="page-header">
        <div className="page-header__text">
          <h1 className="page-header__title">Ubah Password</h1>
          <p className="page-header__desc">Perbarui password akun Anda secara berkala untuk menjaga keamanan.</p>
        </div>
      </div>

      <div className="card-light ubah-password-form">
        {success ? (
          <div className="empty-state">
            <div className="empty-state__icon"><CheckCircle2 size={28} /></div>
            <h3 className="empty-state__title">Password berhasil diubah</h3>
            <p className="empty-state__desc">Silakan masuk kembali menggunakan password baru Anda.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className={'form-field' + (errors.oldPassword ? ' has-error' : '')}>
              <label className="form-field__label" htmlFor="oldPassword">Password Lama<span className="form-field__required">*</span></label>
              <input
                type="password" id="oldPassword" className="form-field__input" placeholder="Masukkan password lama" autoComplete="current-password"
                value={form.oldPassword} onChange={(e) => setField('oldPassword', e.target.value)}
              />
              <span className="form-field__error">
                {typeof errors.oldPassword === 'string' ? errors.oldPassword : DEFAULT_ERROR.oldPassword}
              </span>
            </div>

            <div className={'form-field' + (errors.newPassword ? ' has-error' : '')}>
              <label className="form-field__label" htmlFor="newPassword">Password Baru<span className="form-field__required">*</span></label>
              <input
                type="password" id="newPassword" className="form-field__input" placeholder="Minimal 6 karakter" autoComplete="new-password"
                value={form.newPassword} onChange={(e) => setField('newPassword', e.target.value)}
              />
              <span className="form-field__error">{DEFAULT_ERROR.newPassword}</span>
            </div>

            <div className={'form-field' + (errors.confirmPassword ? ' has-error' : '')}>
              <label className="form-field__label" htmlFor="confirmPassword">Konfirmasi Password Baru<span className="form-field__required">*</span></label>
              <input
                type="password" id="confirmPassword" className="form-field__input" placeholder="Ulangi password baru" autoComplete="new-password"
                value={form.confirmPassword} onChange={(e) => setField('confirmPassword', e.target.value)}
              />
              <span className="form-field__error">{DEFAULT_ERROR.confirmPassword}</span>
            </div>

            <div className="form-actions">
              <Link to="/profil" className="btn btn-secondary">Batal</Link>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <Lock size={16} /> Simpan Password Baru
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}

export default UbahPassword;
