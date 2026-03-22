import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Activity, Settings, LogOut, Globe as MapIcon } from 'lucide-react';

export default function Sidebar({ handleLogout }) {
  const location = useLocation();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col min-h-screen">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Activity className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">AtmoSense</h1>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Command Center" active={location.pathname === '/'} />
        <NavItem to="/map" icon={<MapIcon size={20} />} label="Sensor Map" active={location.pathname === '/map'} />
        <NavItem to="/devices" icon={<Settings size={20} />} label="Devices" active={location.pathname === '/devices'} />
      </nav>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors mt-auto p-3 hover:bg-red-500/10 rounded-lg"
      >
        <LogOut size={20} />
        <span className="font-medium">Sign Out</span>
      </button>
    </aside>
  );
}

function NavItem({ to, icon, label, active = false }) {
  return (
    <Link to={to}>
      <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${active ? 'bg-blue-600 border border-blue-500/30 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
        {icon}
        <span className="font-medium">{label}</span>
      </div>
    </Link>
  );
}
