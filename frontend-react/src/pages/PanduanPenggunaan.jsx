import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import Layout from '../components/Layout';
import PdfViewer from '../components/PdfViewer';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './PanduanPenggunaan.css';

const PANDUAN_PDF = '/pdf/panduan-smart-diagnostic.pdf';
const PANDUAN_HALAMAN = 35;

function PanduanPenggunaan() {
  useDocumentTitle('Panduan Penggunaan Smart Diagnostic TKA - Smart Diagnostic TKA');

  return (
    <Layout breadcrumb={[{ label: 'Materi & Modul Pelatihan', to: '/materi' }, { label: 'Panduan Penggunaan Platform' }]}>
      <div className="page-header">
        <div className="page-header__text">
          <span className="badge badge--info"><FileText size={13} /> Panduan Operasional Platform</span>
          <h1 className="page-header__title">Panduan Penggunaan Smart Diagnostic TKA</h1>
          <p className="page-header__desc">
            Panduan lengkap {PANDUAN_HALAMAN} halaman untuk membantu Bapak/Ibu guru mengenal seluruh alur platform:
            mulai dari login, membaca materi, membuat game edukasi di Wordwall, mendaftarkan soal TKA ke Bank Soal,
            memainkan simulasi diagnostik, hingga memantau perkembangan belajar di Dashboard Hasil.
          </p>
        </div>
        <div className="page-header__actions">
          <Link to="/materi" className="btn btn-secondary"><ArrowLeft size={16} /> Kembali ke Materi</Link>
        </div>
      </div>

      <PdfViewer
        title="Modul Panduan Penggunaan Smart Diagnostic TKA"
        subtitle="Dokumen resmi petunjuk teknis operasional sistem untuk Bapak/Ibu guru peserta pelatihan."
        pdfUrl={PANDUAN_PDF}
        downloadName="panduan-penggunaan-smart-diagnostic-tka.pdf"
        initialOpen={true}
        badgeText="Panduan Sistem 35 Halaman"
        pageCountText="35 Halaman"
      />
    </Layout>
  );
}

export default PanduanPenggunaan;
