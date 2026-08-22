import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Materi from './pages/Materi';
import DetailMateri from './pages/DetailMateri';
import PanduanPenggunaan from './pages/PanduanPenggunaan';
import BankSoal from './pages/BankSoal';
import DetailSoal from './pages/DetailSoal';
import SmartDiagnostic from './pages/SmartDiagnostic';
import HasilDiagnostik from './pages/HasilDiagnostik';
import Profil from './pages/Profil';
import UbahPassword from './pages/UbahPassword';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './styles/style.css';

function protect(element) {
  return <ProtectedRoute>{element}</ProtectedRoute>;
}

/* React Router tidak remount komponen saat cuma :id di URL yang berubah
   (mis. lompat dari /materi/1 ke /materi/2 lewat Link). key={id} memaksa
   remount penuh supaya state halaman reset sendiri lewat useState awal --
   tidak perlu reset manual pakai setState di dalam effect. */
function DetailMateriRoute() {
  const { id } = useParams();
  return <DetailMateri key={id} />;
}

function DetailSoalEditRoute() {
  const { id } = useParams();
  return <DetailSoal key={id} />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={protect(<Dashboard />)} />
          <Route path="/materi" element={protect(<Materi />)} />
          <Route path="/materi/panduan-penggunaan" element={protect(<PanduanPenggunaan />)} />
          <Route path="/materi/:id" element={protect(<DetailMateriRoute />)} />
          <Route path="/bank-soal" element={protect(<BankSoal />)} />
          <Route path="/bank-soal/tka/baru" element={protect(<DetailSoal />)} />
          <Route path="/bank-soal/tka/:id/edit" element={protect(<DetailSoalEditRoute />)} />
          <Route path="/smart-diagnostic" element={protect(<SmartDiagnostic />)} />
          <Route path="/hasil-diagnostik" element={protect(<HasilDiagnostik />)} />
          <Route path="/profil" element={protect(<Profil />)} />
          <Route path="/ubah-password" element={protect(<UbahPassword />)} />
          <Route path="*" element={protect(<NotFound />)} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
