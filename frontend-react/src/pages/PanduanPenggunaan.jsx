import { Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import Layout from '../components/Layout';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './PanduanPenggunaan.css';

const PANDUAN_PDF = '/assets/modul/panduan-penggunaan-smart-diagnostic-tka.pdf';
const PANDUAN_HALAMAN = 35;

function PanduanPenggunaan() {
  useDocumentTitle('Panduan Penggunaan Smart Diagnostic TKA - Smart Diagnostic TKA');

  return (
    <Layout breadcrumb={[{ label: 'Materi & Modul Pelatihan', to: '/materi' }, { label: 'Panduan Penggunaan' }]}>
      <div className="page-header">
        <div className="page-header__text">
          <span className="badge badge--info"><FileText size={13} /> Panduan Penggunaan</span>
          <h1 className="page-header__title">Panduan Penggunaan Smart Diagnostic TKA</h1>
          <p className="page-header__desc">
            Panduan lengkap {PANDUAN_HALAMAN} halaman untuk membantu Anda menggunakan platform ini dari login,
            mempelajari materi dan Wordwall, membuat serta mendaftarkan soal TKA, memainkan TKA dan Non-TKA,
            hingga memantau Dashboard Hasil.
          </p>
        </div>
        <div className="page-header__actions">
          <Link to="/materi" className="btn btn-secondary"><ArrowLeft size={16} /> Kembali ke Materi</Link>
          <a href={PANDUAN_PDF} download className="btn btn-primary"><Download size={16} /> Unduh PDF</a>
        </div>
      </div>

      <section className="card-light panduan-reader" aria-label="Pembaca PDF Panduan Penggunaan">
        <div className="panduan-reader__meta">{PANDUAN_HALAMAN} halaman &bull; PDF</div>
        <div className="panduan-reader__viewer">
          <iframe src={PANDUAN_PDF} title="Panduan Penggunaan Smart Diagnostic TKA" />
        </div>
      </section>
    </Layout>
  );
}

export default PanduanPenggunaan;
