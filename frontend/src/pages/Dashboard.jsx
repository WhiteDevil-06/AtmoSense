import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [gasData, setGasData] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [latestData, setLatestData] = useState({});

  useEffect(() => {
    api.get('/devices').then(res => setDevices(res.data)).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedDevice === 'all') {
      if (devices.length === 0) return;
      const fetchLatest = async () => {
        const results = {};
        for (const dev of devices) {
          try {
             const res = await api.get(`/gasData/${dev.deviceId}?limit=1`);
             if (res.data.length > 0) results[dev.deviceId] = res.data[0];
          } catch (e) {
             console.error(e);
          }
        }
        setLatestData(results);
      };
      fetchLatest();
      const interval = setInterval(fetchLatest, 10000);
      return () => clearInterval(interval);
    } else {
      const fetchHistory = () => {
        api.get(`/gasData/${selectedDevice}?limit=20`)
          .then(res => setGasData(res.data.reverse()))
          .catch(err => console.error(err));
      };
      fetchHistory();
      const interval = setInterval(fetchHistory, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedDevice, devices]);

  const chartData = {
    labels: gasData.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      { label: 'MQ-2 (Combustible Gas)', data: gasData.map(d => d.mq2Level), borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)', tension: 0.3 },
      { label: 'MQ-135 (Air Quality)', data: gasData.map(d => d.mq135Level), borderColor: 'rgb(53, 162, 235)', backgroundColor: 'rgba(53, 162, 235, 0.5)', tension: 0.3 },
      { label: 'MQ-7 (Carbon Monoxide)', data: gasData.map(d => d.mq7Level), borderColor: 'rgb(255, 159, 64)', backgroundColor: 'rgba(255, 159, 64, 0.5)', tension: 0.3 }
    ]
  };

  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#cbd5e1' } } }, scales: { y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }, x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } } } };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">System Telemetry</h3>
        <div className="flex items-center gap-4">
          <select 
            className="bg-[#020617] border border-slate-800 text-white rounded-xl px-5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
          >
            <option value="all">Global Overview (All Locations)</option>
            {devices.map(dev => (
              <option key={dev._id} value={dev.deviceId}>{dev.deviceName} ({dev.location})</option>
            ))}
          </select>
          <span className="text-sm font-bold bg-green-500/10 text-green-500 px-4 py-2.5 rounded-xl flex items-center gap-2 border border-green-500/20">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
            Active
          </span>
        </div>
      </div>

      {selectedDevice === 'all' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {devices.map(dev => {
             const data = latestData[dev.deviceId];
             return (
               <div key={dev.deviceId} className="crediflow-card p-6 flex flex-col justify-between h-full hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">{dev.deviceName}</h3>
                        <p className="text-sm text-slate-400 font-medium mt-1">
                           {dev.location}
                        </p>
                     </div>
                     <button onClick={() => setSelectedDevice(dev.deviceId)} className="text-blue-500 font-bold text-sm hover:text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors">Select</button>
                  </div>
                  
                  {data ? (
                     <div className="space-y-3">
                        <div className="flex justify-between items-center bg-[#020617] p-4 rounded-xl border border-slate-800">
                           <span className="text-sm font-semibold text-slate-400">MQ-2</span>
                           <span className={`text-xl font-bold ${data.mq2Level > 400 ? 'text-red-500' : 'text-white'}`}>{data.mq2Level} <span className="text-sm text-slate-500 font-medium">PPM</span></span>
                        </div>
                        <div className="flex justify-between items-center bg-[#020617] p-4 rounded-xl border border-slate-800">
                           <span className="text-sm font-semibold text-slate-400">MQ-135</span>
                           <span className={`text-xl font-bold ${data.mq135Level > 400 ? 'text-amber-500' : 'text-white'}`}>{data.mq135Level} <span className="text-sm text-slate-500 font-medium">PPM</span></span>
                        </div>
                        <div className="flex justify-between items-center bg-[#020617] p-4 rounded-xl border border-slate-800">
                           <span className="text-sm font-semibold text-slate-400">MQ-7</span>
                           <span className={`text-xl font-bold ${data.mq7Level > 100 ? 'text-red-500' : 'text-white'}`}>{data.mq7Level} <span className="text-sm text-slate-500 font-medium">PPM</span></span>
                        </div>
                     </div>
                  ) : (
                     <div className="text-center text-slate-500 text-sm py-10 font-bold bg-[#020617] rounded-xl border border-slate-800 border-dashed">No recent signal</div>
                  )}
               </div>
             );
          })}
          {devices.length === 0 && (
             <div className="col-span-full text-center py-20 text-slate-400 font-bold text-lg crediflow-card border-dashed">
                 No locations available. Go to Devices to register an ESP32.
             </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="crediflow-card p-6 col-span-1 lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-6">Live Sensor Matrix</h3>
            <div className="h-[360px] bg-[#020617] rounded-xl border border-slate-800 p-4">
              {gasData.length > 0 ? (
                <Line data={chartData} options={options} />
              ) : (
                <div className="h-full flex items-center justify-center font-bold text-slate-500">Awaiting telemetry handshake...</div>
              )}
            </div>
          </div>
          
          <div className="crediflow-card p-6 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-white">Current Readouts</h3>
              {gasData.length > 0 ? (
                  <>
                  <div className="bg-[#020617] rounded-xl p-5 border border-slate-800 shadow-inner">
                      <div className="text-slate-400 text-sm font-bold mb-1">MQ-2 Level</div>
                      <div className={`text-4xl font-bold tracking-tight ${gasData[gasData.length-1].mq2Level > 400 ? 'text-red-500' : 'text-white'}`}>
                          {gasData[gasData.length-1].mq2Level} <span className="text-lg text-slate-500 font-semibold tracking-normal">PPM</span>
                      </div>
                  </div>
                  <div className="bg-[#020617] rounded-xl p-5 border border-slate-800 shadow-inner">
                      <div className="text-slate-400 text-sm font-bold mb-1">MQ-135 Level</div>
                      <div className={`text-4xl font-bold tracking-tight ${gasData[gasData.length-1].mq135Level > 400 ? 'text-amber-500' : 'text-white'}`}>
                          {gasData[gasData.length-1].mq135Level} <span className="text-lg text-slate-500 font-semibold tracking-normal">PPM</span>
                      </div>
                  </div>
                  <div className="bg-[#020617] rounded-xl p-5 border border-slate-800 shadow-inner">
                      <div className="text-slate-400 text-sm font-bold mb-1">MQ-7 (CO) Level</div>
                      <div className={`text-4xl font-bold tracking-tight ${gasData[gasData.length-1].mq7Level > 100 ? 'text-red-500' : 'text-white'}`}>
                          {gasData[gasData.length-1].mq7Level} <span className="text-lg text-slate-500 font-semibold tracking-normal">PPM</span>
                      </div>
                  </div>
                  </>
              ) : (
                  <div className="text-slate-500 font-bold text-center py-10 bg-[#020617] rounded-xl border border-slate-800 border-dashed flex-1 flex items-center justify-center">No data stream</div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
