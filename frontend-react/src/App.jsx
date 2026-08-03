import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={protect(<Dashboard />)} />
        <Route path="/materi" element={protect(<Materi />)} />
        <Route path="/materi/:id" element={protect(<DetailMateri />)} />
        <Route path="/bank-soal" element={protect(<BankSoal />)} />
        <Route path="/bank-soal/baru" element={protect(<DetailSoal />)} />
        <Route path="/bank-soal/:id/edit" element={protect(<DetailSoal />)} />
        <Route path="*" element={protect(<ComingSoon />)} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
