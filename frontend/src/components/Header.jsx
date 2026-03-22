import { Bell, LogOut, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Header({ handleLogout }) {
  const location = useLocation();
  const getTitle = () => {
    switch(location.pathname) {
      case '/': return { title: 'Dashboard', subtitle: 'Global Telemetry Command Center' };
      case '/devices': return { title: 'Devices', subtitle: 'Hardware & Sensor Provisioning' };
      case '/map': return { title: 'Sensor Map', subtitle: 'Real-time Geographic Deployment' };
      default: return { title: 'AtmoSense', subtitle: 'System control' };
    }
  };
  const { title, subtitle } = getTitle();

  return (
    <header className="flex justify-between items-center px-8 py-5 border-b border-slate-800 bg-[#0f172a] shrink-0 z-10 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        <p className="text-sm text-slate-400 font-medium mt-0.5">{subtitle}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-xl bg-[#030712] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors shadow-inner" aria-label="Toggle Theme">
          <Moon size={18} />
        </button>
        <button className="w-10 h-10 rounded-xl bg-[#030712] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors shadow-inner relative" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(37,99,235,1)]"></span>
        </button>
        
        {/* Profile Circle */}
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold ml-2 shadow-[0_0_15px_rgba(37,99,235,0.25)]">
          OP
        </div>

        {/* Action Separator */}
        <div className="h-6 w-px bg-slate-800 mx-2"></div>

        <button onClick={handleLogout} title="Securely Terminate Session" className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors font-medium border border-transparent hover:border-red-500/20">
          <LogOut size={16} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </header>
  );
}
