import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [gasData, setGasData] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    // Fetch user's devices
    api.get('/devices')
      .then(res => {
        setDevices(res.data);
        if (res.data.length > 0) {
          setSelectedDevice(res.data[0].deviceId);
        }
      })
      .catch(err => console.error('Error fetching devices', err));
  }, []);

  useEffect(() => {
    if (!selectedDevice) return;
    
    // Fetch gas data for selected device
    api.get(`/gasData/${selectedDevice}?limit=20`)
      .then(res => setGasData(res.data.reverse()))
      .catch(err => console.error('Error fetching gas data', err));
      
    // Set up polling (every 5 seconds)
    const interval = setInterval(() => {
      api.get(`/gasData/${selectedDevice}?limit=20`)
        .then(res => setGasData(res.data.reverse()))
        .catch(err => console.error(err));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [selectedDevice]);

  const chartData = {
    labels: gasData.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'MQ-2 (Combustible Gas)',
        data: gasData.map(d => d.mq2Level),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3
      },
      {
        label: 'MQ-135 (Air Quality)',
        data: gasData.map(d => d.mq135Level),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#cbd5e1' }
      }
    },
    scales: {
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white">Command Center</h2>
          <p className="text-slate-400">Real-time Environmental Monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDevice || ''}
            onChange={(e) => setSelectedDevice(e.target.value)}
          >
            <option value="" disabled>Select a device</option>
            {devices.map(dev => (
              <option key={dev._id} value={dev.deviceId}>{dev.deviceName} ({dev.location})</option>
            ))}
          </select>
          <span className="text-sm font-medium bg-green-500/10 text-green-500 px-3 py-1 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            System Active
          </span>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 col-span-1 lg:col-span-2 shadow-xl">
          <h3 className="text-lg font-medium text-white mb-4">Live Sensor Readings</h3>
          <div className="h-80">
            {gasData.length > 0 ? (
              <Line data={chartData} options={options} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 italic">
                Waiting for data...
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <h3 className="text-lg font-medium text-white">Current Status</h3>
            {gasData.length > 0 ? (
                <>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <div className="text-slate-400 text-sm mb-1">MQ-2 Level</div>
                    <div className={`text-2xl font-bold ${gasData[gasData.length-1].mq2Level > 400 ? 'text-red-500' : 'text-green-500'}`}>
                        {gasData[gasData.length-1].mq2Level} PPM
                    </div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <div className="text-slate-400 text-sm mb-1">MQ-135 Level</div>
                    <div className={`text-2xl font-bold ${gasData[gasData.length-1].mq135Level > 400 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {gasData[gasData.length-1].mq135Level} PPM
                    </div>
                </div>
                </>
            ) : (
                <div className="text-slate-500 text-sm text-center py-8">No data available</div>
            )}
        </div>
      </div>
    </div>
  );
}
