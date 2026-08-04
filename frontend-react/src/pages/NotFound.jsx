import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import Layout from '../components/Layout';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

function NotFound() {
  useDocumentTitle('Halaman Tidak Ditemukan - Smart Diagnostic TKA');

  return (
    <Layout breadcrumb="Halaman Tidak Ditemukan">
      <div className="card-light">
        <div className="empty-state">
          <div className="empty-state__icon"><SearchX size={28} /></div>
          <h3 className="empty-state__title">Halaman tidak ditemukan</h3>
          <p className="empty-state__desc">Halaman yang Anda tuju tidak ada atau sudah dipindahkan.</p>
          <Link to="/dashboard" className="btn btn-primary">Kembali ke Dashboard</Link>
        </div>
      </div>
    </Layout>
  );
}

export default NotFound;
