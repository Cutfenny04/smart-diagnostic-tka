import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const SIDEBAR_STORAGE_KEY = 'sdtka:sidebarCollapsed';

/* `breadcrumb` boleh string sederhana (satu level, mis. "Dashboard") atau
   array untuk breadcrumb bertingkat, mis. Detail Materi:
   [{ label: 'Materi & Modul Pelatihan', to: '/materi' }, { label: 'Fotosintesis' }]
   Item terakhir tanpa `to` dianggap halaman aktif (tidak jadi link). */
function Layout({ breadcrumb, children }) {
  const [collapsed, setCollapsed] = useState(
    () => window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const crumbs = Array.isArray(breadcrumb) ? breadcrumb : [{ label: breadcrumb }];

  const shellClass =
    'app-shell' +
    (collapsed ? ' is-sidebar-collapsed' : '') +
    (drawerOpen ? ' is-sidebar-open' : '');

  return (
    <div className={shellClass}>
      <Sidebar collapsed={collapsed} onToggleCollapse={setCollapsed} />
      <div className="sidebar-overlay" onClick={() => setDrawerOpen(false)} />

      <div className="app-shell__main">
        <Topbar onOpenDrawer={() => setDrawerOpen((v) => !v)} />

        <main className="content">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/dashboard">Beranda</Link>
            {crumbs.map((crumb, i) => (
              <Fragment key={i}>
                <span className="breadcrumb__sep">/</span>
                {crumb.to ? (
                  <Link to={crumb.to}>{crumb.label}</Link>
                ) : (
                  <span className="breadcrumb__current" aria-current="page">{crumb.label}</span>
                )}
              </Fragment>
            ))}
          </nav>

          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
