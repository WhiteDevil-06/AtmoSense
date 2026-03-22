import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

/* ─── Sensor Config ───────────────────────────────────────── */
const SENSORS = [
  {
    key: 'mq2Level',
    label: 'MQ-2',
    name: 'Combustible Gas',
    unit: 'PPM',
    max: 1000,
    warn: 300,
    danger: 600,
    color: '#f59e0b',
  },
  {
    key: 'mq135Level',
    label: 'MQ-135',
    name: 'Air Quality',
    unit: 'PPM',
    max: 1000,
    warn: 300,
    danger: 600,
    color: '#3b82f6',
  },
  {
    key: 'mq7Level',
    label: 'MQ-7',
    name: 'Carbon Monoxide',
    unit: 'PPM',
    max: 300,
    warn: 50,
    danger: 100,
    color: '#ef4444',
  },
];

/* ─── Circular SVG Gauge ──────────────────────────────────── */
function Gauge({ value, sensor }) {
  const r = 54;
  const cx = 65;
  const cy = 72;
  const circumference = 2 * Math.PI * r;
  const totalArc = circumference * (270 / 360);   // 270° sweep
  const gap = circumference - totalArc;

  const percentage = Math.min(Math.max(value / sensor.max, 0), 1);
  const fillArc = percentage * totalArc;

  let arcColor = '#22c55e';
  if (value >= sensor.danger) arcColor = '#ef4444';
  else if (value >= sensor.warn) arcColor = '#f59e0b';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox="0 0 130 140" width="220" height="220">
        {/* Track arc */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#1a2540"
          strokeWidth="10"
          strokeDasharray={`${totalArc} ${gap}`}
          transform={`rotate(135 ${cx} ${cy})`}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={arcColor}
          strokeWidth="10"
          strokeDasharray={`${fillArc} ${circumference - fillArc}`}
          transform={`rotate(135 ${cx} ${cy})`}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dasharray 0.6s ease, stroke 0.4s ease',
            filter: `drop-shadow(0 0 6px ${arcColor}88)`,
          }}
        />
        {/* Center value */}
        <text
          x={cx} y={cy - 6}
          textAnchor="middle" dominantBaseline="middle"
          fill="#f8fafc" fontSize="22" fontWeight="800"
          fontFamily="Inter, sans-serif"
        >
          {value ?? '—'}
        </text>
        <text
          x={cx} y={cy + 16}
          textAnchor="middle"
          fill="#64748b" fontSize="9" fontWeight="600"
          fontFamily="Inter, sans-serif" letterSpacing="1"
        >
          {sensor.unit}
        </text>

        {/* Min / Max labels */}
        <text x="14" y="126" fill="#334155" fontSize="8" fontFamily="Inter, sans-serif">0</text>
        <text x="104" y="126" fill="#334155" fontSize="8" fontFamily="Inter, sans-serif">{sensor.max}</text>
      </svg>

      {/* Label row */}
      <div style={{ textAlign: 'center', marginTop: '-8px' }}>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>{sensor.label}</div>
        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>{sensor.name}</div>
        <div style={{
          display: 'inline-block', marginTop: '8px',
          padding: '2px 10px', borderRadius: '99px',
          fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em',
          backgroundColor:
            value >= sensor.danger ? 'rgba(239,68,68,0.12)' :
            value >= sensor.warn   ? 'rgba(245,158,11,0.12)' :
                                     'rgba(34,197,94,0.12)',
          color:
            value >= sensor.danger ? '#f87171' :
            value >= sensor.warn   ? '#fbbf24' :
                                     '#4ade80',
          border: `1px solid ${
            value >= sensor.danger ? 'rgba(239,68,68,0.25)' :
            value >= sensor.warn   ? 'rgba(245,158,11,0.25)' :
                                     'rgba(34,197,94,0.25)'
          }`,
        }}>
          {value >= sensor.danger ? 'CRITICAL' : value >= sensor.warn ? 'WARNING' : 'SAFE'}
        </div>
      </div>
    </div>
  );
}

/* ─── Sensor Bar (overview cards) ────────────────────────── */
function SensorBar({ value, sensor }) {
  const pct = Math.min((value / sensor.max) * 100, 100);
  const color =
    value >= sensor.danger ? '#ef4444' :
    value >= sensor.warn   ? '#f59e0b' :
                             '#22c55e';
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em' }}>
          {sensor.label}
        </span>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, color }}>
          {value ?? '—'} <span style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 600 }}>{sensor.unit}</span>
        </span>
      </div>
      <div style={{ height: '5px', backgroundColor: '#1a2540', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          backgroundColor: color,
          borderRadius: '99px',
          transition: 'width 0.5s ease, background-color 0.3s ease',
          boxShadow: `0 0 8px ${color}66`,
        }} />
      </div>
    </div>
  );
}

/* ─── System Status Banner ────────────────────────────────── */
function SystemBadge({ allData }) {
  const values = Object.values(allData);
  if (values.length === 0) return null;

  let status = 'SAFE';
  for (const d of values) {
    for (const s of SENSORS) {
      const v = d?.[s.key] ?? 0;
      if (v >= s.danger) { status = 'CRITICAL'; break; }
      if (v >= s.warn)   { status = 'WARNING'; }
    }
    if (status === 'CRITICAL') break;
  }

  const cfg = {
    SAFE:     { bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.25)',  text: '#4ade80', dot: '#22c55e' },
    WARNING:  { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24', dot: '#f59e0b' },
    CRITICAL: { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)',  text: '#f87171', dot: '#ef4444' },
  }[status];

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '6px 14px', borderRadius: '99px',
      backgroundColor: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      <span style={{
        width: '8px', height: '8px', borderRadius: '50%',
        backgroundColor: cfg.dot,
        boxShadow: `0 0 8px ${cfg.dot}`,
        display: 'inline-block',
        animation: status === 'SAFE' ? 'pulse 2s infinite' : 'none',
      }} />
      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: cfg.text, letterSpacing: '0.08em' }}>
        {status === 'SAFE' ? 'ALL SYSTEMS NOMINAL' : status === 'WARNING' ? 'ELEVATED READINGS' : 'CRITICAL ALERT'}
      </span>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────── */
export default function Dashboard() {
  const [devices, setDevices]         = useState([]);
  const [selected, setSelected]       = useState('all');
  const [latestData, setLatestData]   = useState({});
  const [historyData, setHistoryData] = useState([]);

  /* Fetch devices once */
  useEffect(() => {
    api.get('/devices').then(r => setDevices(r.data)).catch(console.error);
  }, []);

  /* Fetch per-device latest (global overview) */
  useEffect(() => {
    if (selected !== 'all' || devices.length === 0) return;
    const fetch = async () => {
      const results = {};
      for (const dev of devices) {
        try {
          const r = await api.get(`/gasData/${dev.deviceId}?limit=1`);
          if (r.data.length) results[dev.deviceId] = r.data[0];
        } catch {}
      }
      setLatestData(results);
    };
    fetch();
    const id = setInterval(fetch, 10000);
    return () => clearInterval(id);
  }, [selected, devices]);

  /* Fetch history for single device */
  useEffect(() => {
    if (selected === 'all') return;
    const fetch = () =>
      api.get(`/gasData/${selected}?limit=20`)
         .then(r => setHistoryData([...r.data].reverse()))
         .catch(console.error);
    fetch();
    const id = setInterval(fetch, 5000);
    return () => clearInterval(id);
  }, [selected]);

  const latest = historyData[historyData.length - 1];

  /* Chart config */
  const chartData = {
    labels: historyData.map(d => new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })),
    datasets: SENSORS.map(s => ({
      label: `${s.label} (${s.name})`,
      data: historyData.map(d => d[s.key]),
      borderColor: s.color,
      backgroundColor: `${s.color}18`,
      borderWidth: 2,
      pointRadius: 2,
      pointHoverRadius: 5,
      tension: 0.35,
      fill: false,
    })),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, boxWidth: 14, padding: 20 },
      },
      tooltip: {
        backgroundColor: '#0d1424',
        borderColor: '#1a2540',
        borderWidth: 1,
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
      },
    },
    scales: {
      x: { ticks: { color: '#475569', font: { size: 10 } }, grid: { color: '#1a2540' } },
      y: { ticks: { color: '#475569', font: { size: 10 } }, grid: { color: '#1a2540' } },
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Control Bar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            {selected === 'all' ? 'All Locations' : devices.find(d => d.deviceId === selected)?.deviceName}
          </h3>
          {selected !== 'all' && (
            <button
              onClick={() => setSelected('all')}
              style={{
                fontSize: '0.75rem', fontWeight: 600, color: '#64748b',
                background: 'none', border: '1px solid #1a2540',
                borderRadius: '6px', padding: '3px 10px', cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              ← All Devices
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {selected === 'all' && <SystemBadge allData={latestData} />}
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            style={{
              backgroundColor: '#030712', border: '1px solid #1a2540',
              color: '#f8fafc', borderRadius: '8px',
              padding: '8px 14px', fontSize: '0.875rem', fontWeight: 600,
              outline: 'none', fontFamily: 'Inter, sans-serif', cursor: 'pointer',
            }}
          >
            <option value="all">Overview — All Locations</option>
            {devices.map(d => (
              <option key={d._id} value={d.deviceId}>{d.deviceName} · {d.location}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Global Overview ── */}
      {selected === 'all' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {devices.length === 0 && (
            <div style={{
              gridColumn: '1/-1', padding: '4rem', textAlign: 'center',
              backgroundColor: '#0d1424', border: '1px dashed #1a2540', borderRadius: '1rem',
              color: '#475569', fontWeight: 600,
            }}>
              No devices registered. Go to Devices to add your ESP32.
            </div>
          )}
          {devices.map(dev => {
            const d = latestData[dev.deviceId];
            return (
              <div
                key={dev.deviceId}
                onClick={() => setSelected(dev.deviceId)}
                style={{
                  backgroundColor: '#0d1424', border: '1px solid #1a2540',
                  borderRadius: '1rem', padding: '1.5rem',
                  cursor: 'pointer', transition: 'border-color 0.2s, transform 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a2540'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>{dev.deviceName}</div>
                  <div style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>{dev.location}</div>
                </div>
                {d ? (
                  SENSORS.map(s => <SensorBar key={s.key} value={d[s.key]} sensor={s} />)
                ) : (
                  <div style={{ color: '#334155', fontSize: '0.825rem', fontWeight: 600, paddingTop: '0.5rem' }}>
                    No recent data — click to view
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Single Device: The Readout ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Gauge Row */}
          <div style={{
            backgroundColor: '#0d1424', border: '1px solid #1a2540',
            borderRadius: '1rem', padding: '2rem',
            display: 'flex', justifyContent: 'space-around',
            alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem',
          }}>
            {SENSORS.map(s => (
              <Gauge key={s.key} value={latest?.[s.key] ?? 0} sensor={s} />
            ))}
          </div>

          {/* Live Chart */}
          <div style={{ backgroundColor: '#0d1424', border: '1px solid #1a2540', borderRadius: '1rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '0.925rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>Live Sensor History</h4>
                <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0, marginTop: '3px', fontWeight: 500 }}>Last 20 readings · refreshes every 5s</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 700, color: '#4ade80' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e', animation: 'pulse 2s infinite' }} />
                LIVE
              </div>
            </div>
            <div style={{ height: '300px', backgroundColor: '#030712', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #1a2540' }}>
              {historyData.length > 0
                ? <Line data={chartData} options={chartOptions} />
                : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontWeight: 600 }}>Waiting for data stream...</div>
              }
            </div>
          </div>

        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
