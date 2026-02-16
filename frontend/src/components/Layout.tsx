import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <Link to="/incidents">
              <span>🚨</span>
              Incident Tracker
            </Link>
          </h1>
          {location.pathname === '/incidents' && (
            <Link to="/incidents/new" className="btn btn-primary" style={{ background: 'white', color: '#6366f1' }}>
              + Create Incident
            </Link>
          )}
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

