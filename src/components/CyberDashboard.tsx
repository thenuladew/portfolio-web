'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────── Types ─────────────────────────── */
interface Alert {
  id: number;
  time: string;
  level: 'CRIT' | 'WARN' | 'INFO';
  msg: string;
}

interface ScanEntry {
  id: number;
  host: string;
  port: string;
  status: 'open' | 'filtered' | 'closed';
  service: string;
}

/* ─────────────────────────── Helpers ─────────────────────────── */
const pad = (n: number) => String(n).padStart(2, '0');
const nowStr = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const ALERT_POOL: Omit<Alert, 'id' | 'time'>[] = [
  { level: 'CRIT', msg: 'Brute-force attempt on SSH (23 attempts)' },
  { level: 'WARN', msg: 'Unusual outbound traffic to 185.220.x.x' },
  { level: 'INFO', msg: 'Firewall rule updated — port 8443 blocked' },
  { level: 'WARN', msg: 'Failed login: root@192.168.1.104' },
  { level: 'CRIT', msg: 'SQL injection pattern detected on /api/login' },
  { level: 'INFO', msg: 'SSL certificate renewed for portfolio.local' },
  { level: 'WARN', msg: 'Port scan from 10.0.0.57 detected' },
  { level: 'INFO', msg: 'VPN tunnel established — AES-256-GCM' },
  { level: 'CRIT', msg: 'XSS payload in HTTP header (User-Agent)' },
  { level: 'WARN', msg: 'Rate limit exceeded — 429 on /api/v1/auth' },
];

const SCAN_POOL: Omit<ScanEntry, 'id'>[] = [
  { host: '10.0.0.1',   port: '22',   status: 'open',     service: 'ssh' },
  { host: '10.0.0.5',   port: '80',   status: 'open',     service: 'http' },
  { host: '10.0.0.12',  port: '443',  status: 'open',     service: 'https' },
  { host: '10.0.0.20',  port: '3306', status: 'filtered', service: 'mysql' },
  { host: '10.0.0.33',  port: '6379', status: 'filtered', service: 'redis' },
  { host: '10.0.0.99',  port: '21',   status: 'closed',   service: 'ftp' },
  { host: '10.0.0.101', port: '8080', status: 'open',     service: 'http-alt' },
  { host: '10.0.0.200', port: '53',   status: 'open',     service: 'dns' },
];

/* ─────────────────────────── Mini Sparkline ─────────────────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, W, H);

    if (data.length < 2) return;
    const max = Math.max(...data, 1);
    const step = W / (data.length - 1);

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, `${color}33`);
    grad.addColorStop(1, `${color}00`);

    ctx.beginPath();
    ctx.moveTo(0, H);
    data.forEach((v, i) => {
      ctx.lineTo(i * step, H - (v / max) * (H - 2));
    });
    ctx.lineTo((data.length - 1) * step, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    data.forEach((v, i) => {
      const x = i * step;
      const y = H - (v / max) * (H - 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [data, color]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

/* ─────────────────────────── Gauge Arc ─────────────────────────── */
function ThreatGauge({ level }: { level: number }) {
  const r = 52;
  const strokeW = 7;
  const cx = 70;
  const cy = 72;
  const startAngle = 145;
  const endAngle = 395;
  const totalDeg = endAngle - startAngle;

  const pct = level / 100;
  const color =
    level < 35 ? '#22c55e'
    : level < 65 ? '#eab308'
    : '#ef4444';

  const label =
    level < 35 ? 'LOW'
    : level < 65 ? 'MODERATE'
    : 'CRITICAL';

  const polarToXY = (deg: number, radius: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const arcPath = (fromDeg: number, toDeg: number, radius: number) => {
    const start = polarToXY(fromDeg, radius);
    const end   = polarToXY(toDeg,   radius);
    const large = toDeg - fromDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
  };

  const valueDeg = startAngle + totalDeg * pct;

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="105" viewBox="0 0 140 105" className="overflow-visible">
        <path
          d={arcPath(startAngle, endAngle, r)}
          fill="none"
          stroke="#1a1f2e"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        <motion.path
          d={arcPath(startAngle, valueDeg, r)}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${color})` }}
          initial={false}
          animate={{ d: arcPath(startAngle, valueDeg, r) }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        {[0, 25, 50, 75, 100].map((tick) => {
          const deg = startAngle + totalDeg * (tick / 100);
          const inner = polarToXY(deg, r - 10);
          const outer = polarToXY(deg, r - 4);
          return (
            <line key={tick} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke="#2a3441" strokeWidth="1.5" />
          );
        })}
        <text x={cx} y={cy - 2} textAnchor="middle" fill="white"
          fontSize="18" fontWeight="700" fontFamily="monospace">{level}%</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill={color}
          fontSize="7.5" fontWeight="600" fontFamily="monospace" letterSpacing="2">{label}</text>
      </svg>
    </div>
  );
}

/* ─────────────────────────── Main Component ─────────────────────────── */
export default function CyberDashboard() {
  // `mounted` prevents SSR/client hydration mismatch — all random data
  // is initialised only after the component mounts on the client.
  const [mounted, setMounted] = useState(false);

  const [threatLevel, setThreatLevel] = useState(42);
  const [netData,  setNetData]  = useState<number[]>(Array.from({ length: 20 }, () => 50));
  const [cpuData,  setCpuData]  = useState<number[]>(Array.from({ length: 20 }, () => 35));
  const [alerts, setAlerts] = useState<Alert[]>(
    ALERT_POOL.slice(0, 4).map((a, i) => ({ ...a, id: i, time: '00:00:00' }))
  );
  const [scans, setScans] = useState<ScanEntry[]>(
    SCAN_POOL.slice(0, 5).map((s, i) => ({ ...s, id: i }))
  );
  const [packetCount, setPacketCount] = useState(14832);
  const [blocked,     setBlocked]     = useState(137);
  const [dateStr,     setDateStr]     = useState('');
  const alertIdRef = useRef(100);
  const scanIdRef  = useRef(200);

  // Client-only initialisation — runs once after first paint
  useEffect(() => {
    setNetData(Array.from({ length: 20 }, () => Math.random() * 80 + 10));
    setCpuData(Array.from({ length: 20 }, () => Math.random() * 50 + 20));
    setAlerts(ALERT_POOL.slice(0, 4).map((a, i) => ({ ...a, id: i, time: nowStr() })));
    setDateStr(new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setThreatLevel(prev => {
        const next = prev + (Math.random() - 0.48) * 6;
        return Math.max(5, Math.min(95, Math.round(next)));
      });
      setNetData(prev => [...prev.slice(1), Math.random() * 90 + 5]);
      setCpuData(prev => [...prev.slice(1), Math.random() * 60 + 15]);
      setPacketCount(p => p + Math.floor(Math.random() * 80 + 20));
      if (Math.random() < 0.15) setBlocked(b => b + 1);
      if (Math.random() < 0.25) {
        const pool = ALERT_POOL[Math.floor(Math.random() * ALERT_POOL.length)];
        const newAlert: Alert = { ...pool, id: alertIdRef.current++, time: nowStr() };
        setAlerts(prev => [newAlert, ...prev].slice(0, 5));
      }
      if (Math.random() < 0.33) {
        const pool = SCAN_POOL[Math.floor(Math.random() * SCAN_POOL.length)];
        const entry: ScanEntry = { ...pool, id: scanIdRef.current++ };
        setScans(prev => [entry, ...prev].slice(0, 5));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [mounted]);

  const alertColor = (level: Alert['level']) =>
    level === 'CRIT' ? 'text-red-400 border-red-500/30 bg-red-500/5'
    : level === 'WARN' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5'
    : 'text-blue-400 border-blue-500/30 bg-blue-500/5';

  const scanColor = (s: ScanEntry['status']) =>
    s === 'open' ? 'text-lime-400' : s === 'filtered' ? 'text-yellow-400' : 'text-red-400/70';

  if (!mounted) {
    return (
      <div className="w-full h-[400px] rounded-xl bg-[#0d1117]/80 border border-[#1e2634] opacity-40 animate-pulse" />
    );
  }

  return (
    <div className="w-full select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_6px_rgba(178,255,29,0.9)]" />
          <span className="text-[9px] font-mono tracking-[0.2em] text-lime-400/70 uppercase">SOC Dashboard · Live</span>
        </div>
        <span className="text-[9px] font-mono text-[#4a5568]">{dateStr}</span>
      </div>

      {/* Top row: Gauge + Stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Threat Gauge */}
        <div className="bg-[#0d1117]/80 border border-[#1e2634] rounded-xl p-3 flex flex-col items-center backdrop-blur-sm"
          style={{ boxShadow: '0 0 20px rgba(0,0,0,0.4)' }}>
          <p className="text-[8px] font-mono tracking-widest text-[#4a5568] uppercase mb-1 self-start">Threat Level</p>
          <ThreatGauge level={threatLevel} />
        </div>

        {/* Quick stats */}
        <div className="flex flex-col gap-2">
          {[
            { label: 'Packets Inspected', value: packetCount.toLocaleString(), accent: '#b2ff1d' },
            { label: 'Threats Blocked',   value: blocked,                      accent: '#ef4444' },
            { label: 'Active Hosts',      value: 12,                           accent: '#60a5fa' },
          ].map(({ label, value, accent }) => (
            <div key={label}
              className="bg-[#0d1117]/80 border border-[#1e2634] rounded-xl px-3 py-2 backdrop-blur-sm flex-1"
              style={{ boxShadow: '0 0 20px rgba(0,0,0,0.4)' }}>
              <p className="text-[8px] font-mono tracking-widest text-[#4a5568] uppercase">{label}</p>
              <p className="text-sm font-bold font-mono mt-0.5" style={{ color: accent }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sparklines */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {[
          { label: 'Network Traffic', data: netData, color: '#b2ff1d', unit: 'MB/s' },
          { label: 'CPU Usage',       data: cpuData, color: '#60a5fa', unit: '%' },
        ].map(({ label, data, color, unit }) => (
          <div key={label}
            className="bg-[#0d1117]/80 border border-[#1e2634] rounded-xl p-3 backdrop-blur-sm"
            style={{ boxShadow: '0 0 20px rgba(0,0,0,0.4)' }}>
            <div className="flex justify-between items-start mb-1">
              <p className="text-[8px] font-mono tracking-widest text-[#4a5568] uppercase">{label}</p>
              <p className="text-[8px] font-mono" style={{ color }}>
                {Math.round(data[data.length - 1])}{unit}
              </p>
            </div>
            <div className="h-10">
              <Sparkline data={data} color={color} />
            </div>
          </div>
        ))}
      </div>

      {/* Port Scan Feed */}
      <div className="bg-[#0d1117]/80 border border-[#1e2634] rounded-xl p-3 mb-3 backdrop-blur-sm"
        style={{ boxShadow: '0 0 20px rgba(0,0,0,0.4)' }}>
        <p className="text-[8px] font-mono tracking-widest text-[#4a5568] uppercase mb-2">Active Port Scan</p>
        <div className="space-y-1 overflow-hidden" style={{ maxHeight: '78px' }}>
          <AnimatePresence initial={false} mode="popLayout">
            {scans.map((s) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 text-[9px] font-mono"
              >
                <span className="text-[#4a5568] w-[72px] shrink-0">{s.host}</span>
                <span className="text-[#2a3441]">:</span>
                <span className="text-lime-400/60 w-[30px] shrink-0">{s.port}</span>
                <span className={`font-semibold w-[42px] shrink-0 ${scanColor(s.status)}`}>{s.status}</span>
                <span className="text-[#4a5568] truncate">{s.service}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Alert Log */}
      <div className="bg-[#0d1117]/80 border border-[#1e2634] rounded-xl p-3 backdrop-blur-sm"
        style={{ boxShadow: '0 0 20px rgba(0,0,0,0.4)' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[8px] font-mono tracking-widest text-[#4a5568] uppercase">Alert Log</p>
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-500 animate-ping" />
            <span className="text-[7px] font-mono text-red-400/60 uppercase tracking-widest">live</span>
          </div>
        </div>
        <div className="space-y-1 overflow-hidden" style={{ maxHeight: '90px' }}>
          <AnimatePresence initial={false} mode="popLayout">
            {alerts.map((a) => (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-2 text-[8px] font-mono px-1.5 py-1 rounded border ${alertColor(a.level)}`}
              >
                <span className="shrink-0 font-bold w-[28px]">{a.level}</span>
                <span className="text-[#4a5568] shrink-0">{a.time}</span>
                <span className="truncate opacity-80">{a.msg}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
