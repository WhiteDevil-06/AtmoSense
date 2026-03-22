import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ deviceId: '', deviceName: '', location: '', thingSpeakChannelId: '', thingSpeakApiKey: '' });

  const fetchDevices = () => {
    api.get('/devices').then(res => setDevices(res.data)).catch(err => console.error(err));
  };
  useEffect(() => { fetchDevices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/devices', formData);
      setIsAdding(false);
      setFormData({ deviceId: '', deviceName: '', location: '', thingSpeakChannelId: '', thingSpeakApiKey: '' });
      fetchDevices();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      
      {/* Absolute Action Bar */}
      <div className="flex justify-between items-center bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div>
           <h3 className="text-lg font-bold text-white tracking-tight">Endpoint Configuration</h3>
           <p className="text-sm text-slate-400 font-medium">Provision and map ESP32 hardware instances</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_4px_14px_rgba(37,99,235,0.4)]"
        >
          {isAdding ? 'Close Configuration' : '+ Add New Device'}
        </button>
      </div>

      {isAdding && (
        <div className="crediflow-card p-8 relative">
          <h3 className="text-xl font-bold text-white mb-6">Provision New Hardware</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div>
              <label className="block text-slate-400 font-semibold mb-2 text-sm ml-1">Hardware ID</label>
              <input className="w-full crediflow-input" placeholder="e.g. ESP32-001" value={formData.deviceId} onChange={e => setFormData({...formData, deviceId: e.target.value})} required />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-2 text-sm ml-1">Assigned Name</label>
              <input className="w-full crediflow-input" placeholder="e.g. Main Lab Sensor" value={formData.deviceName} onChange={e => setFormData({...formData, deviceName: e.target.value})} required />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-2 text-sm ml-1">Physical Location</label>
              <input className="w-full crediflow-input" placeholder="e.g. Server Room A" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-2 text-sm ml-1">ThingSpeak Channel ID</label>
              <input className="w-full crediflow-input" placeholder="Enter Channel ID" value={formData.thingSpeakChannelId} onChange={e => setFormData({...formData, thingSpeakChannelId: e.target.value})} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-400 font-semibold mb-2 text-sm ml-1">ThingSpeak API Key (Optional)</label>
              <input className="w-full crediflow-input" placeholder="Optional Initialization Key" value={formData.thingSpeakApiKey} onChange={e => setFormData({...formData, thingSpeakApiKey: e.target.value})} />
            </div>
            <div className="md:col-span-2 mt-4 flex justify-end">
              <button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-[0_4px_14px_rgba(37,99,235,0.4)]">
                Secure Details & Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Structured Table Card */}
      <div className="crediflow-card overflow-hidden mt-4 shadow-sm border border-slate-800">
        <table className="w-full text-left">
          <thead className="bg-[#030712] border-b border-slate-800 text-slate-400 uppercase text-xs font-bold tracking-widest">
            <tr>
              <th className="px-6 py-5">Device Name</th>
              <th className="px-6 py-5">Hardware ID</th>
              <th className="px-6 py-5">Location</th>
              <th className="px-6 py-5">Channel ID</th>
              <th className="px-6 py-5">Provisioned On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {devices.map(dev => (
              <tr key={dev._id} className="hover:bg-slate-800/20 transition-colors group">
                <td className="px-6 py-5 font-bold text-white">{dev.deviceName}</td>
                <td className="px-6 py-5 text-slate-400 text-sm font-medium">{dev.deviceId}</td>
                <td className="px-6 py-5 text-slate-300 font-medium">{dev.location}</td>
                <td className="px-6 py-5 text-slate-500 text-sm font-medium">{dev.thingSpeakChannelId}</td>
                <td className="px-6 py-5 text-slate-500 text-sm font-medium">{new Date(dev.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {devices.length === 0 && (
              <tr>
                <td colSpan="5" className="p-16 text-center">
                  <div className="inline-flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl border border-slate-800 flex items-center justify-center bg-[#020617] shadow-inner">
                       <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <span className="text-slate-400 font-bold tracking-wide">No hardware provisioned yet.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
