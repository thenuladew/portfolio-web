'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * NeuralMesh — Floating neural network animation for the Hero section.
 * Pure Canvas API, zero dependencies.
 *
 * Features:
 *  - ~55 nodes drifting slowly in 3D space (depth simulated via z-axis)
 *  - Nodes connect to neighbors within a threshold distance
 *  - Animated data packets race along edges
 *  - Mouse proximity makes nearby nodes "wake up" (grow + brighten)
 *  - Core node in center pulses with neon glow
 *  - "SCAN" radar sweep rotates over the whole field
 */

interface NeuralNode {
  x: number;
  y: number;
  z: number;   // 0..1 depth factor for perspective
  vx: number;
  vy: number;
  vz: number;
  r: number;    // base radius
  phase: number; // pulse offset
  active: boolean; // lit up by mouse proximity
  brightness: number;
}

interface Packet {
  fromIdx: number;
  toIdx: number;
  t: number;    // 0..1 progress along edge
  speed: number;
  hue: number;  // 0 = lime, 1 = red (threat)
}

export default function NeuralMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const [stats, setStats] = useState({ nodes: 0, edges: 0, packets: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let W = 0, H = 0;

    /* ── Resize ── */
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    /* ── Nodes ── */
    const NODE_COUNT = 55;
    const CONNECT_DIST = 115;  // px distance to draw an edge
    const PACKET_CHANCE = 0.004; // per-edge per-frame chance to spawn a packet

    const nodes: NeuralNode[] = Array.from({ length: NODE_COUNT }, (_, i) => ({
      x: Math.random() * 440 - 20,
      y: Math.random() * 420 - 10,
      z: Math.random(),           // depth 0=far, 1=near
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      vz: (Math.random() - 0.5) * 0.0008,
      r: Math.random() * 2 + 1.5,
      phase: Math.random() * Math.PI * 2,
      active: false,
      brightness: 0,
    }));

    /* Central "core" node – fixed at center, always bright */
    nodes[0].x = W / 2;
    nodes[0].y = H / 2;
    nodes[0].vx = 0;
    nodes[0].vy = 0;
    nodes[0].r = 5;
    nodes[0].z = 1;
    nodes[0].brightness = 1;

    /* ── Packets ── */
    const packets: Packet[] = [];

    /* ── Spawn a handful of initial packets ── */
    const spawnPacket = (a: number, b: number, threat = false) => {
      packets.push({
        fromIdx: a,
        toIdx: b,
        t: 0,
        speed: 0.009 + Math.random() * 0.012,
        hue: threat ? 1 : 0,
      });
    };

    // Boot packets
    for (let i = 0; i < 8; i++) {
      const a = Math.floor(Math.random() * NODE_COUNT);
      const b = Math.floor(Math.random() * NODE_COUNT);
      if (a !== b) spawnPacket(a, b, Math.random() < 0.25);
    }

    /* ── Mouse ── */
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    container.addEventListener('mousemove', onMouseMove, { passive: true });

    /* ── Radar sweep ── */
    let radarAngle = 0;

    /* ── Main loop ── */
    let frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // Update node positions
      for (const n of nodes) {
        if (n === nodes[0]) continue; // core stays put
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;
        n.phase += 0.018;

        // Bounce off walls with padding
        const pad = 20;
        if (n.x < -pad) n.vx = Math.abs(n.vx);
        if (n.x > W + pad) n.vx = -Math.abs(n.vx);
        if (n.y < -pad) n.vy = Math.abs(n.vy);
        if (n.y > H + pad) n.vy = -Math.abs(n.vy);
        if (n.z < 0) n.vz = Math.abs(n.vz);
        if (n.z > 1) n.vz = -Math.abs(n.vz);

        // Mouse proximity wake-up
        const dx = n.x - mouse.current.x;
        const dy = n.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const targetBrightness = dist < 80 ? 1 : 0;
        n.brightness += (targetBrightness - n.brightness) * 0.07;
        n.active = n.brightness > 0.3;
      }

      // Update radar sweep
      radarAngle += 0.012;

      /* ── DRAW EDGES ── */
      let edgeCount = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > CONNECT_DIST) continue;
          edgeCount++;

          // Fade with distance, depth average
          const alpha = (1 - dist / CONNECT_DIST) * 0.18 * ((a.z + b.z) / 2 + 0.3);
          const activeBump = (a.brightness + b.brightness) * 0.25;
          const finalAlpha = Math.min(0.75, alpha + activeBump);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(178, 255, 29, ${finalAlpha})`;
          ctx.lineWidth = 0.5 + (a.z + b.z) * 0.2;
          ctx.stroke();

          // Randomly spawn packets on active edges
          if (frame % 3 === 0 && Math.random() < PACKET_CHANCE && packets.length < 18) {
            spawnPacket(i, j, Math.random() < 0.2);
          }
        }
      }

      /* ── DRAW NODES ── */
      for (const n of nodes) {
        const scale = 0.5 + n.z * 0.5;
        const pulse = Math.sin(n.phase) * 0.5 + 0.5;
        const rad = n.r * scale * (1 + pulse * 0.3 + n.brightness * 0.6);
        const alpha = 0.3 + n.z * 0.5 + n.brightness * 0.3;

        if (n === nodes[0]) {
          // Core node — double ring + bright glow
          ctx.shadowColor = '#b2ff1d';
          ctx.shadowBlur = 18;
          ctx.beginPath();
          ctx.arc(n.x, n.y, rad + 8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(178, 255, 29, 0.15)`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(n.x, n.y, rad + 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(178, 255, 29, 0.35)`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(n.x, n.y, rad, 0, Math.PI * 2);
          ctx.fillStyle = '#b2ff1d';
          ctx.globalAlpha = 0.95;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
          continue;
        }

        // Active (mouse-lit) nodes get a glow ring
        if (n.brightness > 0.1) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, rad + 4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(178, 255, 29, ${n.brightness * 0.35})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(178, 255, 29, ${alpha})`;
        ctx.globalAlpha = 1;
        ctx.fill();
      }

      /* ── DRAW PACKETS ── */
      let livePackets = 0;
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        const a = nodes[pkt.fromIdx];
        const b = nodes[pkt.toIdx];
        const t = pkt.t;

        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;
        const z = a.z + (b.z - a.z) * t;

        const color = pkt.hue === 0
          ? `rgba(178, 255, 29, ${0.6 + z * 0.4})`
          : `rgba(248, 113, 113, ${0.6 + z * 0.4})`;

        ctx.shadowColor = pkt.hue === 0 ? '#b2ff1d' : '#f87171';
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.shadowBlur = 0;

        pkt.t += pkt.speed;
        if (pkt.t >= 1) {
          packets.splice(p, 1);
        } else {
          livePackets++;
        }
      }

      /* ── RADAR SWEEP ── */
      const cx = W / 2;
      const cy = H / 2;
      const sweepR = Math.max(W, H) * 0.75;

      const grad = ctx.createConicalGradient
        ? undefined  // standard API not widely available yet
        : null;

      // Fallback: draw a slim arc sweep
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, sweepR, radarAngle, radarAngle + 0.28);
      ctx.closePath();
      const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sweepR);
      sweepGrad.addColorStop(0, 'rgba(178,255,29,0.07)');
      sweepGrad.addColorStop(1, 'rgba(178,255,29,0.0)');
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Thin leading edge line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(radarAngle + 0.28) * sweepR,
        cy + Math.sin(radarAngle + 0.28) * sweepR
      );
      ctx.strokeStyle = 'rgba(178, 255, 29, 0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();

      /* ── OUTER RINGS ── */
      ctx.beginPath();
      ctx.arc(cx, cy, 185, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(178, 255, 29, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 205, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(178, 255, 29, 0.02)';
      ctx.lineWidth = 1;
      ctx.stroke();

      /* ── Stats update (infrequent) ── */
      if (frame % 60 === 0) {
        setStats({ nodes: NODE_COUNT, edges: edgeCount, packets: packets.length });
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420px] select-none overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Top-left label */}
      <div className="absolute top-4 left-5 border-l-2 border-lime-500/30 pl-3">
        <p className="text-[9px] font-mono tracking-widest text-lime-400/50 uppercase">
          Neural Threat Model
        </p>
        <p className="text-[11px] font-bold text-white font-mono mt-0.5 tracking-wide">
          LIVE ANALYSIS
        </p>
      </div>

      {/* Top-right: live dot */}
      <div className="absolute top-4 right-5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_6px_rgba(178,255,29,0.9)]" />
        <span className="text-[9px] font-mono text-lime-400/60 tracking-widest uppercase">Stream Active</span>
      </div>

      {/* Bottom-left stats */}
      <div className="absolute bottom-4 left-5 space-y-0.5">
        <p className="text-[9px] font-mono text-[#4a5568] tracking-widest">
          <span className="text-lime-400/40">NODES</span> {stats.nodes} &nbsp;
          <span className="text-lime-400/40">EDGES</span> {stats.edges} &nbsp;
          <span className="text-red-400/40">PKTS</span> {stats.packets}
        </p>
      </div>

      {/* Bottom-right: threat read */}
      <div className="absolute bottom-4 right-5 text-right">
        <div className="flex items-center gap-1.5 justify-end">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-[9px] font-mono text-red-400/70 uppercase tracking-widest">
            Anomaly Detection
          </span>
        </div>
      </div>
    </div>
  );
}
