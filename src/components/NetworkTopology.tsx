'use client';

import { useEffect, useRef } from 'react';

interface NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Packet {
  fromNode: NetworkNode;
  toNode: NetworkNode;
  progress: number;
  speed: number;
}

export default function NetworkTopology() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // Configuration
    const NODE_COUNT = 24;
    const CONNECT_DIST = 85;
    const nodes: NetworkNode[] = [];
    let packets: Packet[] = [];

    const resize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      width = rect?.width || 300;
      height = rect?.height || 200;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialise nodes
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const parentCard = containerRef.current?.parentElement;
    if (parentCard) {
      parentCard.addEventListener('mousemove', handleMouseMove);
      parentCard.addEventListener('mouseleave', handleMouseLeave);
    }

    // Animation Loop
    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Move and draw nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Boundary collision
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Keep inside bounds
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));

        ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fill();
      });

      // 2. Draw connections (topology edges)
      const activeConnections: [NetworkNode, NetworkNode][] = [];

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];

          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.15;
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();

            activeConnections.push([n1, n2]);
          }
        }
      }

      // 3. Mouse influence (draw link from cursor to nodes)
      if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        nodes.forEach((node) => {
          const dx = node.x - mouseRef.current.x;
          const dy = node.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const cursorConnectDist = 70;

          if (dist < cursorConnectDist) {
            const alpha = (1 - dist / cursorConnectDist) * 0.25;
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(mouseRef.current.x, mouseRef.current.y);
            ctx.lineTo(node.x, node.y);
            ctx.stroke();
          }
        });
      }

      // 4. Update & draw data packets moving along connections
      // Spawn new packet occasionally
      if (Math.random() < 0.05 && activeConnections.length > 0) {
        const randomConn = activeConnections[Math.floor(Math.random() * activeConnections.length)];
        // Determine direction
        const direction = Math.random() > 0.5;
        packets.push({
          fromNode: direction ? randomConn[0] : randomConn[1],
          toNode: direction ? randomConn[1] : randomConn[0],
          progress: 0,
          speed: 0.015 + Math.random() * 0.015,
        });
      }

      // Draw and filter packets
      packets = packets.filter((p) => {
        p.progress += p.speed;
        if (p.progress >= 1) return false; // arrived

        const px = p.fromNode.x + (p.toNode.x - p.fromNode.x) * p.progress;
        const py = p.fromNode.y + (p.toNode.y - p.fromNode.y) * p.progress;

        ctx.fillStyle = '#22d3ee';
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, 2 * Math.PI);
        ctx.fill();

        return true;
      });

      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      if (parentCard) {
        parentCard.removeEventListener('mousemove', handleMouseMove);
        parentCard.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block opacity-25" />
    </div>
  );
}
