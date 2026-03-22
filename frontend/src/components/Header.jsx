import { LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const routeMeta = {
  '/':        { title: 'Dashboard',   subtitle: 'Environmental Telemetry Overview' },
  '/devices': { title: 'Devices',     subtitle: 'Hardware Configuration & Management' },
  '/map':     { title: 'Sensor Map',  subtitle: 'Location-based Deployment' },
};

export default function Header({ handleLogout }) {
  const location = useLocation();
  const meta = routeMeta[location.pathname] || { title: 'AtmoSense', subtitle: '' };

  return (
    <header style={{
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
    }}>

      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.01em' }}>
          {meta.title}
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: 0, marginTop: '2px', fontWeight: 500 }}>
          {meta.subtitle}
        </p>
      </div>

      <button
        onClick={handleLogout}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: '0.5rem',
          color: 'var(--muted)',
          fontSize: '0.875rem', fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          transition: 'color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#f87171';
          e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
          e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.06)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'var(--muted)';
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <LogOut size={15} />
        Sign Out
      </button>

    </header>
  );
}
