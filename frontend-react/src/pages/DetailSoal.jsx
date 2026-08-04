import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save } from 'lucide-react';
import Layout from '../components/Layout';
import { fetchPaketById, savePaket } from '../data/bankSoalData';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './DetailSoal.css';

const EMPTY_FORM = { title: '', subject: '', grade: '', hotsLevel: '', stimulus: '', wordwallUrl: '', status: 'draft' };
const REQUIRED_FIELDS = ['title', 'subject', 'grade', 'hotsLevel', 'stimulus'];

function DetailSoal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  const heading = isEditMode ? 'Edit Paket Soal' : 'Tambah Paket Soal';
  useDocumentTitle(heading + ' - Smart Diagnostic TKA');

  // Reset ke loading tiap ganti id ditangani lewat key={id} di App.jsx
  // (remount penuh), bukan setState manual di sini.
  useEffect(() => {
    if (!isEditMode) return;
    fetchPaketById(id).then((paket) => {
      if (!paket) {
        // Sama seperti detail-soal.js vanilla: id tidak ada -> redirect diam-diam
        // ke Bank Soal, bukan menampilkan halaman error.
        navigate('/bank-soal', { replace: true });
        return;
      }
      setForm({
        title: paket.title,
        subject: paket.subject,
        grade: paket.grade,
        hotsLevel: paket.hotsLevel,
        stimulus: paket.stimulus,
        wordwallUrl: paket.wordwallUrl || '',
        status: paket.status,
      });
      setLoading(false);
    });
  }, [id, isEditMode, navigate]);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validate() {
    const values = {
      ...form,
      title: form.title.trim(),
      stimulus: form.stimulus.trim(),
      wordwallUrl: form.wordwallUrl.trim(),
    };

    const nextErrors = {};
    let firstInvalidField = null;
    REQUIRED_FIELDS.forEach((key) => {
      if (!values[key]) {
        nextErrors[key] = true;
        if (!firstInvalidField) firstInvalidField = key;
      }
    });
    if (values.status === 'published' && !values.wordwallUrl) {
      nextErrors.wordwallUrl = true;
      if (!firstInvalidField) firstInvalidField = 'wordwallUrl';
    }

    setErrors(nextErrors);
    if (firstInvalidField) {
      document.getElementById(firstInvalidField)?.focus();
      return null;
    }
    return values;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const values = validate();
    if (!values) return;

    setSaving(true);
    const paket = isEditMode
      ? { id, ...values, wordwallUrl: values.wordwallUrl || null }
      : { ...values, wordwallUrl: values.wordwallUrl || null };

    await savePaket(paket);
    navigate('/bank-soal');
  }

  const breadcrumb = [{ label: 'Bank Soal Berbasis Budaya Aceh', to: '/bank-soal' }, { label: heading }];

  if (loading) {
    return (
      <Layout breadcrumb={breadcrumb}>
        <div className="card-light detail-soal-form">
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--text" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumb={breadcrumb}>
      <div className="page-header">
        <div className="page-header__text">
          <h1 className="page-header__title">{heading}</h1>
          <p className="page-header__desc">Lengkapi informasi paket soal. Soal HOTS tetap didigitalkan langsung di Wordwall oleh guru — halaman ini hanya menyimpan informasi dan tautan aktivitasnya.</p>
        </div>
      </div>

      <div className="card-light detail-soal-form">
        <form onSubmit={handleSubmit} noValidate>
          <div className={'form-field' + (errors.title ? ' has-error' : '')}>
            <label className="form-field__label" htmlFor="title">Judul Materi<span className="form-field__required">*</span></label>
            <input
              type="text" id="title" className="form-field__input" placeholder="Contoh: Kopi Gayo" maxLength={80}
              value={form.title} onChange={(e) => setField('title', e.target.value)}
            />
            <span className="form-field__error">Judul materi wajib diisi.</span>
          </div>

          <div className="form-row">
            <div className={'form-field' + (errors.subject ? ' has-error' : '')}>
              <label className="form-field__label" htmlFor="subject">Bidang IPA<span className="form-field__required">*</span></label>
              <select id="subject" className="form-field__select" value={form.subject} onChange={(e) => setField('subject', e.target.value)}>
                <option value="">Pilih Bidang</option>
                <option value="Biologi">Biologi</option>
                <option value="Fisika">Fisika</option>
                <option value="Kimia">Kimia</option>
              </select>
              <span className="form-field__error">Bidang IPA wajib dipilih.</span>
            </div>

            <div className={'form-field' + (errors.grade ? ' has-error' : '')}>
              <label className="form-field__label" htmlFor="grade">Jenjang<span className="form-field__required">*</span></label>
              <select id="grade" className="form-field__select" value={form.grade} onChange={(e) => setField('grade', e.target.value)}>
                <option value="">Pilih Jenjang</option>
                <option value="SMP">SMP</option>
                <option value="SMA">SMA</option>
              </select>
              <span className="form-field__error">Jenjang wajib dipilih.</span>
            </div>

            <div className={'form-field' + (errors.hotsLevel ? ' has-error' : '')}>
              <label className="form-field__label" htmlFor="hotsLevel">Level HOTS<span className="form-field__required">*</span></label>
              <select id="hotsLevel" className="form-field__select" value={form.hotsLevel} onChange={(e) => setField('hotsLevel', e.target.value)}>
                <option value="">Pilih Level</option>
                <option value="C4">C4 - Analisis</option>
                <option value="C5">C5 - Evaluasi</option>
                <option value="C6">C6 - Kreasi</option>
              </select>
              <span className="form-field__error">Level HOTS wajib dipilih.</span>
            </div>
          </div>

          <div className={'form-field' + (errors.stimulus ? ' has-error' : '')}>
            <label className="form-field__label" htmlFor="stimulus">Stimulus Budaya Aceh<span className="form-field__required">*</span></label>
            <textarea
              id="stimulus" className="form-field__textarea" placeholder="Tuliskan narasi kontekstual budaya Aceh yang menjadi stimulus paket soal ini..."
              value={form.stimulus} onChange={(e) => setField('stimulus', e.target.value)}
            />
            <span className="form-field__error">Stimulus budaya Aceh wajib diisi.</span>
          </div>

          <div className={'form-field' + (errors.wordwallUrl ? ' has-error' : '')}>
            <label className="form-field__label" htmlFor="wordwallUrl">
              Link Wordwall<span className="form-field__optional">(opsional untuk Draft)</span>
            </label>
            <input
              type="url" id="wordwallUrl" className="form-field__input" placeholder="https://wordwall.net/resource/..."
              value={form.wordwallUrl} onChange={(e) => setField('wordwallUrl', e.target.value)}
            />
            <span className="form-field__error">Link Wordwall wajib diisi jika status Published.</span>
            <span className="form-field__hint">Soal HOTS dibuat langsung di Wordwall. Halaman ini hanya menyimpan tautannya.</span>
          </div>

          <div className="form-field">
            <label className="form-field__label" htmlFor="status">Status</label>
            <select id="status" className="form-field__select" value={form.status} onChange={(e) => setField('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <span className="form-field__hint">Paket Published akan tampil sebagai pilihan di Smart Diagnostic.</span>
          </div>

          <div className="form-actions">
            <Link to="/bank-soal" className="btn btn-secondary">Batal</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default DetailSoal;
