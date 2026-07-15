'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  colorType: number; // 0 = cyan, 1 = white
  baseOpacity: number;
}

/**
 * ParticleField — Canvas-based interactive particle background.
 * Particles drift slowly and repel from the mouse cursor.
 * Zero external dependencies — pure Canvas API + RAF.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const mouse = { x: -2000, y: -2000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Particle count scales with screen area, capped at 130
    const count = Math.min(130, Math.floor((window.innerWidth * window.innerHeight) / 7500));
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() * 1.4 + 0.4,
      opacity: Math.random() * 0.35 + 0.08,
      baseOpacity: 0,
      colorType: Math.random() < 0.7 ? 0 : 1, // 70% lime, 30% white
    }));
    // Store base opacity
    particles.forEach((p) => { p.baseOpacity = p.opacity; });

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const REPEL_RADIUS = 130;
    const REPEL_FORCE = 0.9;
    const DAMPING = 0.95;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist < REPEL_RADIUS && dist > 0) {
          const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_FORCE;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
          // Brighten nearby particles
          p.opacity = Math.min(0.7, p.baseOpacity + force * 0.5);
        } else {
          p.opacity += (p.baseOpacity - p.opacity) * 0.05;
        }

        // Velocity damping
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        // Drift clamp
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2.5) {
          p.vx = (p.vx / speed) * 2.5;
          p.vy = (p.vy / speed) * 2.5;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges with padding
        const pad = 10;
        if (p.x < -pad) p.x = canvas.width + pad;
        if (p.x > canvas.width + pad) p.x = -pad;
        if (p.y < -pad) p.y = canvas.height + pad;
        if (p.y > canvas.height + pad) p.y = -pad;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        if (p.colorType === 0) {
          ctx.fillStyle = `rgba(178, 255, 29, ${p.opacity})`;
        } else {
          ctx.fillStyle = `rgba(220, 255, 150, ${p.opacity * 0.5})`;
        }
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      aria-hidden="true"
    />
  );
}
