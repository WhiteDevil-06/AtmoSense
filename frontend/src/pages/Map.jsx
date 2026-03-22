import { useState, useEffect } from 'react';
import api from '../services/api';

export default function MapView() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    api.get('/devices').then(res => setDevices(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-140px)]">
      
      <div className="crediflow-card w-full h-full relative overflow-hidden flex flex-col shadow-sm">
        <div className="absolute inset-0 bg-[#020617] pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 bg-[url('https://maps.wikimedia.org/osm-intl/6/30/25.png')] bg-cover bg-center mix-blend-luminosity"></div>
        
        <div className="relative z-10 w-full h-full p-10 flex flex-col items-center">
            <h3 className="text-2xl font-bold text-white mb-2 text-center tracking-tight">Interactive Map View Placeholder</h3>
            <p className="text-slate-400 text-sm text-center max-w-lg mb-10 font-medium">
              This interactive map will graphically plot hardware based on the "Physical Location" assigned in the Devices section utilizing real-world coordinates.
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
            {devices.map((dev) => (
                <div key={dev._id} className="crediflow-card p-5 flex items-start gap-4 transform transition-transform hover:-translate-y-1 cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-[0_4px_14px_rgba(37,99,235,0.3)]">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-white">{dev.deviceName}</h4>
                        <p className="text-slate-400 text-sm font-medium mt-0.5">{dev.location}</p>
                    </div>
                </div>
            ))}
            {devices.length === 0 && (
               <div className="col-span-full mt-10 text-center flex justify-center w-full">
                 <div className="px-8 py-4 bg-[#020617] border border-slate-800 rounded-xl text-slate-500 font-bold inline-block shadow-inner">
                    No physical checkpoints deployed
                 </div>
               </div>
            )}
            </div>
        </div>
      </div>

    </div>
  );
}
