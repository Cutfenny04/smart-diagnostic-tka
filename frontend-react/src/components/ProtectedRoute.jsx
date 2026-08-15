import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  // Belum selesai cek getSession() awal -- jangan redirect dulu, supaya
  // guru yang sesinya masih valid tidak sempat "kelempar" ke /login cuma
  // karena AuthProvider belum sempat baca sesi tersimpan (mis. saat reload).
  if (loading) return null;

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
