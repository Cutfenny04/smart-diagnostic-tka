import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save } from 'lucide-react';
import Layout from '../components/Layout';
import WordwallGuide from '../components/WordwallGuide';
import InlineError from '../components/InlineError';
import { fetchPaketById, savePaket } from '../data/bankSoalData';
import { checkWordwallEmbeddable } from '../data/wordwallData';
import { friendlyErrorMessage } from '../services/api';
import { isWordwallUrl } from '../utils/wordwallStage';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './DetailSoal.css';

/* Revisi 8 Fase 7A (PIVOT_PLAN.md §B1/§C): halaman ini KHUSUS paket TKA --
   guru mendaftarkan aktivitas Wordwall yang sudah mereka buat sendiri ke
   Bank Soal (bukan menulis soal di website). Paket Non-TKA tidak pernah
   lewat sini; backend menolak create/update kalau target bukan TKA (lihat
   paketSoal.controller.js), jadi form ini tidak perlu pilihan "Tipe". */

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
  const [submitError, setSubmitError] = useState('');
  // Tahap 6 roadmap item #5: validasi URL Wordwall otomatis begitu guru
  // selesai mengetik/tempel link-nya (bukan cuma pas main di Smart
  // Diagnostic seperti sebelumnya). Ini murni informasional -- link yang
  // tidak bisa di-embed TETAP boleh disimpan (fallback "Buka di Wordwall"
  // sudah ada sejak Fase 7E), guru cuma diberi tahu apa yang akan terjadi.
  const [urlCheck, setUrlCheck] = useState({ status: 'idle', message: '' });

  const heading = isEditMode ? 'Edit Paket TKA' : 'Tambah Paket TKA';
  useDocumentTitle(heading + ' - Smart Diagnostic TKA');

  // Reset ke loading tiap ganti id ditangani lewat key={id} di App.jsx
  // (remount penuh), bukan setState manual di sini.
  useEffect(() => {
    if (!isEditMode) return;
    fetchPaketById(id).then((paket) => {
      if (!paket || paket.type !== 'TKA') {
        // Id tidak ada, atau ternyata paket Non-TKA (tidak boleh diedit di
        // sini) -> redirect diam-diam ke Bank Soal, bukan halaman error.
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
      if (paket.wordwallUrl) checkUrl(paket.wordwallUrl);
    });
  }, [id, isEditMode, navigate]);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function checkUrl(rawUrl) {
    const url = rawUrl.trim();
    if (!url) {
      setUrlCheck({ status: 'idle', message: '' });
      return;
    }
    setUrlCheck({ status: 'checking', message: 'Mengecek URL...' });
    try {
      const result = await checkWordwallEmbeddable(url);
      if (result.uncertain) {
        setUrlCheck({ status: 'uncertain', message: 'Tidak bisa memastikan sekarang (Wordwall tidak merespons) -- akan dicoba ditampilkan langsung saat dimainkan.' });
      } else if (result.embeddable) {
        setUrlCheck({ status: 'valid', message: 'URL Wordwall valid, aktivitas bisa ditampilkan langsung di website.' });
      } else {
        setUrlCheck({ status: 'fallback', message: 'URL ini tidak bisa ditampilkan langsung (jenis link ini diblokir Wordwall untuk di-embed) -- guru & siswa akan diarahkan ke tombol "Buka di Wordwall" saat memainkannya. Tetap boleh disimpan.' });
      }
    } catch (err) {
      setUrlCheck({ status: 'invalid', message: err.message || 'URL tidak valid.' });
    }
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
    if (values.status === 'published') {
      // Gerbang publish (roadmap item #6): backend menolak publish kalau URL
      // bukan wordwall.net yang sah -- dicek di sini juga supaya guru dapat
      // error inline instan, bukan cuma round-trip ke server baru tahu.
      if (!values.wordwallUrl) {
        nextErrors.wordwallUrl = true;
        if (!firstInvalidField) firstInvalidField = 'wordwallUrl';
      } else if (!isWordwallUrl(values.wordwallUrl)) {
        nextErrors.wordwallUrl = 'invalid';
        if (!firstInvalidField) firstInvalidField = 'wordwallUrl';
      }
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
    setSubmitError('');
    const paket = isEditMode
      ? { id, ...values, wordwallUrl: values.wordwallUrl || null }
      : { ...values, wordwallUrl: values.wordwallUrl || null };

    try {
      await savePaket(paket);
      navigate('/bank-soal');
    } catch (err) {
      setSubmitError(friendlyErrorMessage(err));
      setSaving(false);
    }
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
          <p className="page-header__desc">Daftarkan aktivitas Wordwall TKA yang sudah kamu buat sendiri. Soal HOTS tetap dibuat langsung di Wordwall -- halaman ini hanya menyimpan informasi dan tautan aktivitasnya.</p>
        </div>
      </div>

      <WordwallGuide />

      <div className="card-light detail-soal-form">
        <form onSubmit={handleSubmit} noValidate>
          <div className={'form-field' + (errors.title ? ' has-error' : '')}>
            <label className="form-field__label" htmlFor="title">Judul Paket<span className="form-field__required">*</span></label>
            <input
              type="text" id="title" className="form-field__input" placeholder="Contoh: TKA Biologi - Ekosistem Aceh" maxLength={80}
              value={form.title} onChange={(e) => setField('title', e.target.value)}
            />
            <span className="form-field__error">Judul paket wajib diisi.</span>
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
            <label className="form-field__label" htmlFor="stimulus">Stimulus / Deskripsi<span className="form-field__required">*</span></label>
            <textarea
              id="stimulus" className="form-field__textarea" placeholder="Tuliskan narasi kontekstual (misalnya budaya Aceh) yang menjadi pengantar sebelum siswa membuka Wordwall..."
              value={form.stimulus} onChange={(e) => setField('stimulus', e.target.value)}
            />
            <span className="form-field__error">Stimulus wajib diisi.</span>
          </div>

          <div className={'form-field' + (errors.wordwallUrl ? ' has-error' : '')}>
            <label className="form-field__label" htmlFor="wordwallUrl">
              Link Wordwall<span className="form-field__optional">(opsional untuk Draft)</span>
            </label>
            <input
              type="url" id="wordwallUrl" className="form-field__input" placeholder="https://wordwall.net/embed/..."
              value={form.wordwallUrl}
              onChange={(e) => setField('wordwallUrl', e.target.value)}
              onBlur={(e) => checkUrl(e.target.value)}
            />
            <span className="form-field__error">
              {errors.wordwallUrl === 'invalid'
                ? 'Link Wordwall harus URL wordwall.net yang sah sebelum bisa dipublish.'
                : 'Link Wordwall wajib diisi jika status Published.'}
            </span>
            <span className="form-field__hint">
              Gunakan link <strong>Embed</strong> (tombol Share &rarr; tab Embed di Wordwall.net), bukan Play URL --
              Play URL memicu banner cookie Wordwall yang muncul berulang dan membuat aktivitas terlihat kembali ke awal.
            </span>
            {urlCheck.status !== 'idle' && (
              <span className={'wordwall-url-check is-' + urlCheck.status}>{urlCheck.message}</span>
            )}
          </div>

          <div className="form-field">
            <label className="form-field__label" htmlFor="status">Status</label>
            <select id="status" className="form-field__select" value={form.status} onChange={(e) => setField('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <span className="form-field__hint">Paket Published akan tampil sebagai pilihan di Smart Diagnostic.</span>
          </div>

          <InlineError message={submitError} />

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
