import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, Globe as MapIcon, ChevronRight, PanelLeftClose } from 'lucide-react';

export default function Sidebar({ handleLogout }) {
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <aside className={`${isMinimized ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out bg-[#0f172a] border-r border-slate-800 flex flex-col min-h-screen shrink-0 z-20`}>
      
      {/* Universal CrediFlow Header Branding */}
      <div className="p-6 h-24 flex items-center mb-2 shrink-0">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
          <img src="/meter.png" alt="Logo" className="w-5 h-5 filter invert" />
        </div>
        {!isMinimized && (
          <h1 className="ml-3 text-xl font-bold text-white tracking-wide whitespace-nowrap overflow-hidden">
            AtmoSense
          </h1>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-hidden">
        <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Command Center" active={location.pathname === '/'} minimized={isMinimized} />
        <NavItem to="/map" icon={<MapIcon size={20} />} label="Sensor Map" active={location.pathname === '/map'} minimized={isMinimized} />
        <NavItem to="/devices" icon={<Settings size={20} />} label="Devices" active={location.pathname === '/devices'} minimized={isMinimized} />
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800/50">
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className={`flex items-center w-full p-3 text-slate-400 hover:text-white rounded-lg transition-colors ${isMinimized ? 'justify-center' : 'gap-3'}`}
          title="Collapse Sidebar"
        >
          <PanelLeftClose size={20} />
          {!isMinimized && <span className="font-medium text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

function NavItem({ to, icon, label, active, minimized }) {
  return (
    <Link to={to} title={minimized ? label : ''}>
      <div className={`flex items-center p-3 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'} ${minimized ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3">
          {icon}
          {!minimized && <span className="font-semibold text-sm">{label}</span>}
        </div>
        {!minimized && active && <ChevronRight size={16} className="text-white opacity-80" />}
      </div>
    </Link>
  );
}
