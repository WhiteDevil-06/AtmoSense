import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    deviceId: '',
    deviceName: '',
    location: '',
    thingSpeakChannelId: '',
    thingSpeakApiKey: ''
  });

  const fetchDevices = () => {
    api.get('/devices')
      .then(res => setDevices(res.data))
      .catch(err => console.error('Error fetching devices', err));
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/devices', formData);
      setIsAdding(false);
      setFormData({ deviceId: '', deviceName: '', location: '', thingSpeakChannelId: '', thingSpeakApiKey: '' });
      fetchDevices();
    } catch (err) {
      console.error('Error adding device', err);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white">Device Management</h2>
          <p className="text-slate-400">Manage your connected sensors</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          {isAdding ? 'Cancel' : 'Add Device'}
        </button>
      </header>

      {isAdding && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Register New Device</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="bg-slate-800 border-slate-700 rounded-lg p-3 text-white" placeholder="Device ID (e.g. ESP32-001)" value={formData.deviceId} onChange={e => setFormData({...formData, deviceId: e.target.value})} required />
            <input className="bg-slate-800 border-slate-700 rounded-lg p-3 text-white" placeholder="Device Name" value={formData.deviceName} onChange={e => setFormData({...formData, deviceName: e.target.value})} required />
            <input className="bg-slate-800 border-slate-700 rounded-lg p-3 text-white" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
            <input className="bg-slate-800 border-slate-700 rounded-lg p-3 text-white" placeholder="ThingSpeak Channel ID" value={formData.thingSpeakChannelId} onChange={e => setFormData({...formData, thingSpeakChannelId: e.target.value})} required />
            <input className="bg-slate-800 border-slate-700 rounded-lg p-3 text-white" placeholder="ThingSpeak API Key (Optional)" value={formData.thingSpeakApiKey} onChange={e => setFormData({...formData, thingSpeakApiKey: e.target.value})} />
            <div className="md:col-span-2">
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition w-full sm:w-auto">
                Save Device
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="p-4 font-medium">Device Name</th>
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium">Channel ID</th>
              <th className="p-4 font-medium">Added On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {devices.map(dev => (
              <tr key={dev._id} className="hover:bg-slate-800/50 transition">
                <td className="p-4 font-medium text-white">{dev.deviceName}</td>
                <td className="p-4 text-slate-400 font-mono text-sm">{dev.deviceId}</td>
                <td className="p-4 text-slate-300">{dev.location}</td>
                <td className="p-4 text-slate-300">{dev.thingSpeakChannelId}</td>
                <td className="p-4 text-slate-400 text-sm">{new Date(dev.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {devices.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500 italic">No devices found. Add one to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
