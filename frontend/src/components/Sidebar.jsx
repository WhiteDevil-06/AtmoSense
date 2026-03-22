import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Globe, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const navItems = [
  { to: '/',        label: 'Command Center', icon: LayoutDashboard },
  { to: '/map',     label: 'Sensor Map',     icon: Globe },
  { to: '/devices', label: 'Devices',        icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{
      width: collapsed ? '72px' : '240px',
      transition: 'width 0.25s ease',
      backgroundColor: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      flexShrink: 0,
      overflow: 'hidden',
    }}>

      {/* Branding */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: collapsed ? '1.375rem 1rem' : '1.375rem 1.25rem',
        borderBottom: '1px solid var(--border)',
        height: '72px',
        flexShrink: 0,
      }}>
        <div style={{
          width: '38px', height: '38px',
          backgroundColor: 'var(--blue)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 0 18px rgba(37,99,235,0.3)',
        }}>
          <img
            src="/meter.png"
            alt="AtmoSense"
            style={{ width: '22px', height: '22px', filter: 'brightness(0) invert(1)' }}
          />
        </div>
        {!collapsed && (
          <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
            AtmoSense
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1rem 0.625rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              title={collapsed ? label : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 0.875rem',
                borderRadius: '0.625rem',
                textDecoration: 'none',
                backgroundColor: isActive ? 'var(--blue)' : 'transparent',
                color: isActive ? '#fff' : 'var(--muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                transition: 'background-color 0.15s ease, color 0.15s ease',
                justifyContent: collapsed ? 'center' : 'flex-start',
                boxShadow: isActive ? '0 4px 14px rgba(37,99,235,0.3)' : 'none',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = '#111f3a'; e.currentTarget.style.color = 'var(--text)'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--muted)'; } }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div style={{ padding: '0.75rem 0.625rem', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.7rem 0.875rem', width: '100%',
            borderRadius: '0.625rem', border: 'none',
            backgroundColor: 'transparent', color: 'var(--muted)',
            cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'background-color 0.15s ease, color 0.15s ease',
            fontFamily: 'Inter, sans-serif',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#111f3a'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--muted)'; }}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>

    </aside>
  );
}
