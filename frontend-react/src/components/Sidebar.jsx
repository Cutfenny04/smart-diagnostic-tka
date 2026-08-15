import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Landmark,
  Activity,
  BarChart3,
  UserCircle,
  PanelLeftClose,
  LogOut,
} from 'lucide-react';

const SIDEBAR_STORAGE_KEY = 'sdtka:sidebarCollapsed';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/materi', label: 'Materi & Modul Pelatihan', icon: BookOpen },
  { to: '/bank-soal', label: 'Bank Soal Berbasis Budaya Aceh', icon: Landmark },
  { to: '/smart-diagnostic', label: 'Smart Diagnostic', icon: Activity },
  { to: '/hasil-diagnostik', label: 'Dashboard Hasil', icon: BarChart3 },
  { to: '/profil', label: 'Profil', icon: UserCircle },
];

function Sidebar({ collapsed, onToggleCollapse }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  async function handleLogout() {
    await signOut();
    navigate('/login');
  }

  return (
    <aside className="sidebar" aria-label="Navigasi utama">
      <div className="sidebar__brand">
        <img src="/assets/logo/logo-usk.png" alt="Logo Universitas Syiah Kuala" className="sidebar__logo" />
        <span className="sidebar__brand-text">
          <span className="sidebar__brand-eyebrow">Smart Diagnostic</span>
          <span className="sidebar__brand-name">TKA</span>
        </span>
      </div>

      <nav className="sidebar__nav" aria-label="Menu utama">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => 'sidebar__link' + (isActive ? ' is-active' : '')}
          >
            <span className="sidebar__icon"><Icon size={18} /></span>
            <span className="sidebar__label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button
          type="button"
          className="sidebar__collapse-btn"
          aria-label="Ciutkan sidebar"
          aria-pressed={collapsed}
          onClick={() => {
            const next = !collapsed;
            onToggleCollapse(next);
            window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
          }}
        >
          <span className="sidebar__icon"><PanelLeftClose size={18} /></span>
          <span className="sidebar__label">Ciutkan Menu</span>
        </button>
        <button type="button" className="sidebar__link sidebar__link--logout" onClick={handleLogout}>
          <span className="sidebar__icon"><LogOut size={18} /></span>
          <span className="sidebar__label">Keluar</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
