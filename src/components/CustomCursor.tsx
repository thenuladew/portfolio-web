'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CustomCursor — neon crosshair dot + ring.
 * Active on ALL pointer devices; on touch coarse-pointer, keeps dot only.
 * Desktop gets a smooth spring-lagged ring + inner dot with trailing glow.
 */
export default function CustomCursor() {
  const hovered = useRef(false);
  const visible = useRef(false);

  const dotX = useMotionValue(-200);
  const dotY = useMotionValue(-200);
  const springCfg = { damping: 22, stiffness: 300, mass: 0.4 };
  const ringX = useSpring(dotX, springCfg);
  const ringY = useSpring(dotY, springCfg);

  // Framer values for ring scale and glow
  const ringScale = useMotionValue(1);
  const ringOpacity = useMotionValue(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      if (!visible.current) {
        visible.current = true;
        ringOpacity.set(1);
      }
    };

    const hide = () => {
      ringOpacity.set(0);
      visible.current = false;
    };
    const show = () => {
      ringOpacity.set(1);
      visible.current = true;
    };

    const detectHover = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isInteractive =
        t.tagName === 'A' ||
        t.tagName === 'BUTTON' ||
        !!t.closest('a') ||
        !!t.closest('button') ||
        !!t.closest('[role="button"]') ||
        t.tagName === 'INPUT' ||
        t.tagName === 'TEXTAREA';
      hovered.current = isInteractive;
      ringScale.set(isInteractive ? 1.8 : 1);
    };

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', show);
    document.addEventListener('mouseover', detectHover);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('mouseenter', show);
      document.removeEventListener('mouseover', detectHover);
    };
  }, [dotX, dotY, ringOpacity, ringScale]);

  return (
    <>
      {/* Inner neon dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999]"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: '#b2ff1d',
          boxShadow: '0 0 6px rgba(178,255,29,0.9), 0 0 12px rgba(178,255,29,0.4)',
          opacity: ringOpacity,
        }}
      />
      {/* Outer lagged ring */}
      <motion.div
        className="fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          scale: ringScale,
          opacity: ringOpacity,
          border: '1px solid rgba(178,255,29,0.5)',
          backgroundColor: 'rgba(178,255,29,0.03)',
          boxShadow: '0 0 8px rgba(178,255,29,0.15)',
        }}
        transition={{ type: 'tween', duration: 0.1 }}
      />
    </>
  );
}
