'use client';

import { useEffect, useRef } from 'react';

/**
 * DataWave — Full-page sine wave background.
 *
 * Renders multiple layered sine waves across the entire screen.
 * - Mouse X/Y subtly warps wave amplitude and frequency
 * - Each wave has independent speed, opacity, and thickness
 * - A vertical scanning line sweeps left→right like an oscilloscope
 * - Zero dependencies — pure Canvas 2D + RAF
 */

interface Wave {
  yOffset: number;    // vertical centre (0..1 of H)
  amplitude: number;  // wave height in px
  frequency: number;  // cycles across screen
  speed: number;      // phase advance per frame
  phase: number;      // current phase
  alpha: number;      // opacity
  width: number;      // stroke width
  color: string;      // rgba
}

export default function DataWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let W = 0, H = 0;

    /* ── Resize ── */
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    /* ── Mouse ── */
    const mouse = { x: 0.5, y: 0.5 }; // normalised 0..1
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    /* ── Wave definitions ── */
    const waves: Wave[] = [
      // Deep background — wide, slow, very faint
      { yOffset: 0.30, amplitude: 55,  frequency: 1.6, speed: 0.005, phase: 0,    alpha: 0.04, width: 1.2, color: '178,255,29' },
      { yOffset: 0.70, amplitude: 65,  frequency: 1.3, speed: 0.004, phase: 2.1,  alpha: 0.04, width: 1.2, color: '178,255,29' },

      // Mid layer — medium detail
      { yOffset: 0.20, amplitude: 38,  frequency: 2.4, speed: 0.009, phase: 1.0,  alpha: 0.07, width: 1.0, color: '178,255,29' },
      { yOffset: 0.50, amplitude: 42,  frequency: 2.8, speed: 0.008, phase: 3.5,  alpha: 0.07, width: 1.0, color: '178,255,29' },
      { yOffset: 0.80, amplitude: 35,  frequency: 2.2, speed: 0.010, phase: 0.7,  alpha: 0.06, width: 1.0, color: '178,255,29' },

      // Foreground — tighter, faster, slightly brighter
      { yOffset: 0.15, amplitude: 22,  frequency: 3.8, speed: 0.016, phase: 2.4,  alpha: 0.10, width: 0.8, color: '178,255,29' },
      { yOffset: 0.40, amplitude: 28,  frequency: 4.2, speed: 0.014, phase: 0.3,  alpha: 0.12, width: 0.8, color: '200,255,80' },
      { yOffset: 0.60, amplitude: 24,  frequency: 3.6, speed: 0.017, phase: 1.8,  alpha: 0.10, width: 0.8, color: '178,255,29' },
      { yOffset: 0.88, amplitude: 20,  frequency: 4.5, speed: 0.015, phase: 4.1,  alpha: 0.09, width: 0.8, color: '178,255,29' },

      // Accent — single bright centerline wave
      { yOffset: 0.50, amplitude: 18,  frequency: 5.5, speed: 0.022, phase: 0.0,  alpha: 0.22, width: 1.5, color: '200,255,100' },
    ];

    // Horizontal scan line state
    let scanX = 0;

    /* ── Draw loop ── */
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Advance phases + update scan line
      for (const w of waves) {
        w.phase += w.speed;
      }
      scanX = (scanX + 1.4) % W;

      // Mouse influence: Y warps global amplitude, X warps phase offset
      const mouseAmpMod   = 1 + (mouse.y - 0.5) * 0.6;  // 0.7x → 1.3x
      const mousePhaseMod = (mouse.x - 0.5) * 1.8;

      /* ── Draw each wave ── */
      for (const w of waves) {
        const cy   = H * w.yOffset;
        const amp  = w.amplitude * mouseAmpMod;
        const freq = (w.frequency * Math.PI * 2) / W;

        ctx.beginPath();

        for (let x = 0; x <= W; x += 2) {
          const y = cy + Math.sin(x * freq + w.phase + mousePhaseMod) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        // Glow: draw twice — once thick+faint, once thin+bright
        ctx.strokeStyle = `rgba(${w.color},${w.alpha * 0.5})`;
        ctx.lineWidth   = w.width * 3.5;
        ctx.stroke();

        ctx.strokeStyle = `rgba(${w.color},${w.alpha})`;
        ctx.lineWidth   = w.width;
        ctx.stroke();
      }

      /* ── Oscilloscope scan line ── */
      // Faint vertical sweep
      const grad = ctx.createLinearGradient(scanX - 40, 0, scanX + 4, 0);
      grad.addColorStop(0, 'rgba(178,255,29,0)');
      grad.addColorStop(0.6, 'rgba(178,255,29,0.03)');
      grad.addColorStop(1, 'rgba(178,255,29,0.12)');
      ctx.fillStyle = grad;
      ctx.fillRect(scanX - 40, 0, 44, H);

      // Leading bright edge
      ctx.strokeStyle = 'rgba(200,255,100,0.18)';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, H);
      ctx.stroke();

      // Dots where scan line crosses each wave
      for (const w of waves) {
        if (w.alpha < 0.08) continue; // skip bg waves
        const cy   = H * w.yOffset;
        const amp  = w.amplitude * mouseAmpMod;
        const freq = (w.frequency * Math.PI * 2) / W;
        const y    = cy + Math.sin(scanX * freq + w.phase + mousePhaseMod) * amp;

        ctx.beginPath();
        ctx.arc(scanX, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,255,100,${w.alpha * 2.5})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
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
