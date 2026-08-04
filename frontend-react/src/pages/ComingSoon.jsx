import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';
import Layout from '../components/Layout';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

/* Placeholder untuk halaman yang belum dimigrasi ke React (mis. Smart
   Diagnostic, Profil) -- supaya link yang menuju ke sana tidak blank. */
function ComingSoon() {
  useDocumentTitle('Segera Hadir - Smart Diagnostic TKA');

  return (
    <Layout breadcrumb="Segera Hadir">
      <div className="card-light">
        <div className="empty-state">
          <div className="empty-state__icon"><Construction size={28} /></div>
          <h3 className="empty-state__title">Halaman ini belum dimigrasi</h3>
          <p className="empty-state__desc">Bagian ini masih dalam proses migrasi dari versi lama ke React.</p>
          <Link to="/dashboard" className="btn btn-primary">Kembali ke Dashboard</Link>
        </div>
      </div>
    </Layout>
  );
}

export default ComingSoon;
