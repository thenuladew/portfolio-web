'use client';

import { useEffect, useRef, useState } from 'react';

interface Node3D {
  x: number;
  y: number;
  z: number;
  originalX: number;
  originalY: number;
  originalZ: number;
  size: number;
  color: string;
  pulse: number;
  label: string;
}

interface Connection3D {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  color: string;
}

export default function CyberGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [telemetry, setTelemetry] = useState<string>('STREAM: INACTIVE');
  const [threatCount, setThreatCount] = useState<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // Parameters
    const GLOBE_RADIUS = 130;
    const CAMERA_DIST = 450;
    const ROTATION_SPEED_X = 0.0015;
    const ROTATION_SPEED_Y = 0.0025;

    let rotX = 0.3; // initial tilt
    let rotY = 0;

    // Generate static nodes on the sphere surface (longitude/latitude)
    const nodeLocations = [
      { lat: 0.2, lon: 0.5, label: 'US-EAST' },
      { lat: -0.4, lon: 1.2, label: 'BR-SAO' },
      { lat: 0.8, lon: -0.8, label: 'EU-WEST' },
      { lat: -0.1, lon: -2.1, label: 'APAC-SGP' },
      { lat: 0.4, lon: 2.8, label: 'AS-TOK' },
      { lat: -0.6, lon: -1.2, label: 'AFR-JNB' },
      { lat: 0.3, lon: -1.9, label: 'CN-BEI' },
      { lat: -0.5, lon: 0.1, label: 'AUS-SYD' },
      { lat: 0.6, lon: 0.2, label: 'RU-MOW' },
    ];

    const nodes: Node3D[] = nodeLocations.map((loc) => {
      const cosLat = Math.cos(loc.lat);
      const sinLat = Math.sin(loc.lat);
      const cosLon = Math.cos(loc.lon);
      const sinLon = Math.sin(loc.lon);

      const x = GLOBE_RADIUS * cosLat * cosLon;
      const y = GLOBE_RADIUS * sinLat;
      const z = GLOBE_RADIUS * cosLat * sinLon;

      return {
        x,
        y,
        z,
        originalX: x,
        originalY: y,
        originalZ: z,
        size: Math.random() * 2.5 + 2,
        color: Math.random() > 0.4 ? '#22d3ee' : '#f87171', // Cyan or light red
        pulse: Math.random() * Math.PI,
        label: loc.label,
      };
    });

    // Connections (Attack / Data Paths)
    const connections: Connection3D[] = [
      { fromIdx: 0, toIdx: 2, progress: 0.0, speed: 0.012, color: 'rgba(34, 211, 238, 0.85)' },
      { fromIdx: 4, toIdx: 3, progress: 0.2, speed: 0.009, color: 'rgba(248, 113, 113, 0.95)' },
      { fromIdx: 6, toIdx: 0, progress: 0.5, speed: 0.015, color: 'rgba(248, 113, 113, 0.95)' },
      { fromIdx: 1, toIdx: 0, progress: 0.1, speed: 0.010, color: 'rgba(34, 211, 238, 0.85)' },
      { fromIdx: 2, toIdx: 8, progress: 0.7, speed: 0.014, color: 'rgba(34, 211, 238, 0.85)' },
    ];

    // Generate grid points for wireframe lines
    // Latitude rings
    const ringsLat: { points: { x: number; y: number; z: number }[] }[] = [];
    const latCount = 9;
    for (let i = 1; i < latCount; i++) {
      const lat = (Math.PI * i) / latCount - Math.PI / 2;
      const cosLat = Math.cos(lat);
      const sinLat = Math.sin(lat);
      const points = [];
      const steps = 36;
      for (let j = 0; j <= steps; j++) {
        const lon = (2 * Math.PI * j) / steps;
        points.push({
          x: GLOBE_RADIUS * cosLat * Math.cos(lon),
          y: GLOBE_RADIUS * sinLat,
          z: GLOBE_RADIUS * cosLat * Math.sin(lon),
        });
      }
      ringsLat.push({ points });
    }

    // Longitude rings
    const ringsLon: { points: { x: number; y: number; z: number }[] }[] = [];
    const lonCount = 10;
    for (let i = 0; i < lonCount; i++) {
      const lon = (Math.PI * i) / lonCount;
      const cosLon = Math.cos(lon);
      const sinLon = Math.sin(lon);
      const points = [];
      const steps = 36;
      for (let j = 0; j <= steps; j++) {
        const lat = (2 * Math.PI * j) / steps;
        points.push({
          x: GLOBE_RADIUS * Math.cos(lat) * cosLon,
          y: GLOBE_RADIUS * Math.sin(lat),
          z: GLOBE_RADIUS * Math.cos(lat) * sinLon,
        });
      }
      ringsLon.push({ points });
    }

    const resize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      width = rect?.width || 400;
      height = rect?.height || 400;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      // Normalise
      mouseRef.current.targetX = (x / (width / 2)) * 0.4;
      mouseRef.current.targetY = (y / (height / 2)) * 0.4;
    };

    const containerElement = containerRef.current;
    if (containerElement) {
      containerElement.addEventListener('mousemove', onMouseMove);
    }

    // 3D rotations helper
    const rotateNode = (
      p: { x: number; y: number; z: number },
      angleX: number,
      angleY: number
    ) => {
      // Y-axis rotation
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      let x1 = p.x * cosY - p.z * sinY;
      let z1 = p.x * sinY + p.z * cosY;

      // X-axis rotation
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      let y2 = p.y * cosX - z1 * sinX;
      let z2 = p.y * sinX + z1 * cosX;

      return { x: x1, y: y2, z: z2 };
    };

    // Main animation loop
    const tick = () => {
      // Mouse smoothing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Update base rotations
      rotY += ROTATION_SPEED_Y;
      rotX += ROTATION_SPEED_X;

      // Apply mouse influence
      const currentRotX = rotX + mouseRef.current.y;
      const currentRotY = rotY + mouseRef.current.x;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // 1. PROJECT WIREFRAME LINES
      interface Drawable {
        depth: number;
        draw: () => void;
      }

      const drawables: Drawable[] = [];

      // Add latitude rings to drawables
      ringsLat.forEach((ring) => {
        const rotatedPoints = ring.points.map((p) => rotateNode(p, currentRotX, currentRotY));

        // Group points into drawable segments to allow depth styling
        for (let i = 0; i < rotatedPoints.length - 1; i++) {
          const p1 = rotatedPoints[i];
          const p2 = rotatedPoints[i + 1];
          const avgZ = (p1.z + p2.z) / 2;

          drawables.push({
            depth: avgZ,
            draw: () => {
              const d1 = CAMERA_DIST - p1.z;
              const d2 = CAMERA_DIST - p2.z;

              const x1_2d = cx + (p1.x * CAMERA_DIST) / d1;
              const y1_2d = cy + (p1.y * CAMERA_DIST) / d2;
              const x2_2d = cx + (p2.x * CAMERA_DIST) / d1;
              const y2_2d = cy + (p2.y * CAMERA_DIST) / d2;

              // Grid transparency depends on depth
              const alpha = Math.max(0.01, (p1.z + GLOBE_RADIUS) / (GLOBE_RADIUS * 2)) * 0.15;
              ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
              ctx.lineWidth = 0.55;
              ctx.beginPath();
              ctx.moveTo(x1_2d, y1_2d);
              ctx.lineTo(x2_2d, y2_2d);
              ctx.stroke();
            },
          });
        }
      });

      // Add longitude rings to drawables
      ringsLon.forEach((ring) => {
        const rotatedPoints = ring.points.map((p) => rotateNode(p, currentRotX, currentRotY));

        for (let i = 0; i < rotatedPoints.length - 1; i++) {
          const p1 = rotatedPoints[i];
          const p2 = rotatedPoints[i + 1];
          const avgZ = (p1.z + p2.z) / 2;

          drawables.push({
            depth: avgZ,
            draw: () => {
              const d1 = CAMERA_DIST - p1.z;
              const d2 = CAMERA_DIST - p2.z;

              const x1_2d = cx + (p1.x * CAMERA_DIST) / d1;
              const y1_2d = cy + (p1.y * CAMERA_DIST) / d2;
              const x2_2d = cx + (p2.x * CAMERA_DIST) / d1;
              const y2_2d = cy + (p2.y * CAMERA_DIST) / d2;

              const alpha = Math.max(0.01, (p1.z + GLOBE_RADIUS) / (GLOBE_RADIUS * 2)) * 0.15;
              ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
              ctx.lineWidth = 0.55;
              ctx.beginPath();
              ctx.moveTo(x1_2d, y1_2d);
              ctx.lineTo(x2_2d, y2_2d);
              ctx.stroke();
            },
          });
        }
      });

      // 2. PROJECT NODES
      const projectedNodes = nodes.map((node) => {
        const rotated = rotateNode(
          { x: node.originalX, y: node.originalY, z: node.originalZ },
          currentRotX,
          currentRotY
        );
        node.x = rotated.x;
        node.y = rotated.y;
        node.z = rotated.z;
        node.pulse += 0.05;
        return node;
      });

      projectedNodes.forEach((node) => {
        drawables.push({
          depth: node.z + 10, // slightly offset to render above grid lines at same depth
          draw: () => {
            const d = CAMERA_DIST - node.z;
            const x2d = cx + (node.x * CAMERA_DIST) / d;
            const y2d = cy + (node.y * CAMERA_DIST) / d;

            const alpha = Math.max(0.1, (node.z + GLOBE_RADIUS) / (GLOBE_RADIUS * 2));
            const pulseFactor = Math.sin(node.pulse) * 4;

            // Blinking concentric rings for threats (red nodes)
            if (node.color === '#f87171') {
              ctx.strokeStyle = `rgba(248, 113, 113, ${alpha * 0.45})`;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.arc(x2d, y2d, node.size + pulseFactor + 3, 0, 2 * Math.PI);
              ctx.stroke();
            }

            // Core node dot
            ctx.fillStyle = node.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(x2d, y2d, node.size, 0, 2 * Math.PI);
            ctx.fill();
            ctx.globalAlpha = 1.0;

            // Small text node labels for "cyber telemetry" aesthetic
            if (node.z > 0) {
              ctx.font = '8px monospace';
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.55})`;
              ctx.fillText(node.label, x2d + node.size + 4, y2d + 3);
            }
          },
        });
      });

      // 3. PROJECT ATTACK PATHS (CONNECTIONS)
      connections.forEach((conn) => {
        const from = projectedNodes[conn.fromIdx];
        const to = projectedNodes[conn.toIdx];

        conn.progress += conn.speed;
        if (conn.progress > 1) {
          conn.progress = 0;
          // Randomise speed and target to simulate dynamic threat patterns
          conn.speed = 0.008 + Math.random() * 0.012;
        }

        const avgZ = (from.z + to.z) / 2;

        drawables.push({
          depth: avgZ + 5,
          draw: () => {
            // Draw a beautiful quadratic curve extending out from the surface of the sphere
            const dFrom = CAMERA_DIST - from.z;
            const dTo = CAMERA_DIST - to.z;

            const xStart = cx + (from.x * CAMERA_DIST) / dFrom;
            const yStart = cy + (from.y * CAMERA_DIST) / dFrom;
            const xEnd = cx + (to.x * CAMERA_DIST) / dTo;
            const yEnd = cy + (to.y * CAMERA_DIST) / dTo;

            // Control point for the Bezier arc (middle point + offset pointing radially outward)
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const midZ = (from.z + to.z) / 2;

            // Normalise the middle vector and scale it outward
            const len = Math.sqrt(midX * midX + midY * midY + midZ * midZ);
            const arcFactor = 1.35; // How high the path arcs
            const ctrlX = (midX / len) * GLOBE_RADIUS * arcFactor;
            const ctrlY = (midY / len) * GLOBE_RADIUS * arcFactor;
            const ctrlZ = (midZ / len) * GLOBE_RADIUS * arcFactor;

            const dCtrl = CAMERA_DIST - ctrlZ;
            const xCtrl = cx + (ctrlX * CAMERA_DIST) / dCtrl;
            const yCtrl = cy + (ctrlY * CAMERA_DIST) / dCtrl;

            // Line visibility based on node depths
            const alpha = Math.max(0.05, (avgZ + GLOBE_RADIUS) / (GLOBE_RADIUS * 2)) * 0.35;
            ctx.strokeStyle = conn.color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(xStart, yStart);
            ctx.quadraticCurveTo(xCtrl, yCtrl, xEnd, yEnd);
            ctx.stroke();
            ctx.globalAlpha = 1.0;

            // Animated glowing threat payload particle
            const t = conn.progress;
            const particleX = (1 - t) * (1 - t) * xStart + 2 * (1 - t) * t * xCtrl + t * t * xEnd;
            const particleY = (1 - t) * (1 - t) * yStart + 2 * (1 - t) * t * yCtrl + t * t * yEnd;
            const particleZ = (1 - t) * (1 - t) * from.z + 2 * (1 - t) * t * ctrlZ + t * t * to.z;

            const particleAlpha = Math.max(0.1, (particleZ + GLOBE_RADIUS) / (GLOBE_RADIUS * 2));

            // Draw glowing particle
            ctx.fillStyle = conn.color.includes('rgba(248') ? '#f87171' : '#22d3ee';
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 8;
            ctx.globalAlpha = particleAlpha;
            ctx.beginPath();
            ctx.arc(particleX, particleY, 2.2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1.0;
          },
        });
      });

      // 4. SORT BY DEPTH (draw back objects first, then front)
      drawables.sort((a, b) => a.depth - b.depth);

      // 5. RENDER ALL DRAWABLES
      drawables.forEach((d) => d.draw());

      // 6. DECORATIVE SENSORY RING
      // Draw outer tech frame / scanning ring
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, GLOBE_RADIUS + 30, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.03)';
      ctx.beginPath();
      ctx.arc(cx, cy, GLOBE_RADIUS + 40, 0, 2 * Math.PI);
      ctx.stroke();

      // Outer radar ticks
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
      ctx.lineWidth = 1.5;
      const timeSec = Date.now() * 0.0007;
      const tickStart = timeSec;
      const tickEnd = timeSec + 0.12;

      ctx.beginPath();
      ctx.arc(cx, cy, GLOBE_RADIUS + 30, tickStart, tickEnd);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, GLOBE_RADIUS + 30, tickStart + Math.PI, tickEnd + Math.PI);
      ctx.stroke();

      // Update telemetry readout text occasionally
      if (Math.random() < 0.02) {
        const packets = Math.floor(Math.random() * 850) + 120;
        const hex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase();
        setTelemetry(`RX_PORT: ${packets} // SEC_SIG: 0x${hex}`);
        setThreatCount(Math.floor(Math.random() * 4) + 1);
      }

      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      if (containerElement) {
        containerElement.removeEventListener('mousemove', onMouseMove);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420px] flex items-center justify-center select-none"
    >
      <canvas ref={canvasRef} className="absolute cursor-grab active:cursor-grabbing" />

      {/* Cyber overlay stats readout */}
      <div className="absolute top-4 left-6 border-l border-cyan-500/30 pl-3">
        <p className="text-[10px] font-mono tracking-widest text-cyan-400/60 uppercase">
          Threat Intel Feeds
        </p>
        <p className="text-xs font-semibold text-white font-mono mt-0.5 tracking-wider">
          LIVE MAP ACTIVE
        </p>
      </div>

      <div className="absolute bottom-4 right-6 text-right">
        <p className="text-[9px] font-mono text-neutral-500 tracking-wider">
          {telemetry}
        </p>
        <div className="flex items-center gap-1.5 justify-end mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest">
            {threatCount} Vector Blocks Active
          </span>
        </div>
      </div>
    </div>
  );
}
