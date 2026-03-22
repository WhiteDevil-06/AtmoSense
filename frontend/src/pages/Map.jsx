import { useState, useEffect } from 'react';
import api from '../services/api';

export default function MapView() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    api.get('/devices')
      .then(res => setDevices(res.data))
      .catch(err => console.error('Error fetching devices', err));
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white">Sensor Map Explorer</h2>
          <p className="text-slate-400">Geographical distribution of active sensors</p>
        </div>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-[600px] flex items-center justify-center relative overflow-hidden">
        {/* Mock Map Visualization since we don't have a real map library configured yet */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://maps.wikimedia.org/osm-intl/6/30/25.png')] bg-cover bg-center mix-blend-luminosity"></div>
        
        <div className="relative z-10 w-full h-full p-8">
            <h3 className="text-xl font-medium text-slate-300 mb-6 text-center">Interactive Map View Placeholder</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {devices.map((dev, i) => (
                <div key={dev._id} className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-4 rounded-xl flex items-start gap-4 transform transition hover:scale-105 cursor-pointer shadow-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 border border-blue-500/50">
                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                    </div>
                    <div>
                        <div className="font-semibold text-white">{dev.deviceName}</div>
                        <div className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            {dev.location}
                        </div>
                    </div>
                </div>
            ))}
            </div>
            
            {devices.length === 0 && (
                 <div className="text-center text-slate-500 italic mt-20">No devices deployed yet.</div>
            )}
        </div>
      </div>
    </div>
  );
}
