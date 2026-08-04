import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Materi from './pages/Materi';
import DetailMateri from './pages/DetailMateri';
import BankSoal from './pages/BankSoal';
import DetailSoal from './pages/DetailSoal';
import ComingSoon from './pages/ComingSoon';
import ProtectedRoute from './components/ProtectedRoute';
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
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={protect(<Dashboard />)} />
        <Route path="/materi" element={protect(<Materi />)} />
        <Route path="/materi/:id" element={protect(<DetailMateriRoute />)} />
        <Route path="/bank-soal" element={protect(<BankSoal />)} />
        <Route path="/bank-soal/baru" element={protect(<DetailSoal />)} />
        <Route path="/bank-soal/:id/edit" element={protect(<DetailSoalEditRoute />)} />
        <Route path="*" element={protect(<ComingSoon />)} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
