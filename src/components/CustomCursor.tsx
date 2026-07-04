'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CustomCursor — dot + ring component.
 * Only rendered on coarse-pointer / touch devices (e.g. tablets with stylus).
 * Desktop users get the CSS SVG arrow cursor via globals.css.
 */
export default function CustomCursor() {
  const [isCoarse, setIsCoarse] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useRef(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const springCfg = { damping: 28, stiffness: 240, mass: 0.5 };
  const cursorX = useSpring(mouseX, springCfg);
  const cursorY = useSpring(mouseY, springCfg);

  useEffect(() => {
    // Only activate on coarse-pointer devices
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    setIsCoarse(coarse);
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!coarse) return;

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
    };
    const hide = () => setVisible(false);
    const show = () => setVisible(true);

    const detectHover = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovered(
        t.tagName === 'A' ||
        t.tagName === 'BUTTON' ||
        !!t.closest('a') ||
        !!t.closest('button') ||
        !!t.closest('[role="button"]') ||
        t.tagName === 'INPUT' ||
        t.tagName === 'TEXTAREA'
      );
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', hide);
    document.addEventListener('mouseenter', show);
    document.addEventListener('mouseover', detectHover);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('mouseenter', show);
      document.removeEventListener('mouseover', detectHover);
    };
  }, [mouseX, mouseY]);

  if (!isCoarse || !visible) return null;

  return (
    <>
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-[9999]"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
      />
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-cyan-400/50 rounded-full pointer-events-none z-[9999]"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        animate={reducedMotion.current ? {} : {
          scale: hovered ? 1.7 : 1,
          backgroundColor: hovered ? 'rgba(34,211,238,0.08)' : 'transparent',
          borderColor: hovered ? 'rgba(34,211,238,0.8)' : 'rgba(34,211,238,0.4)',
        }}
        transition={{ type: 'tween', duration: 0.12 }}
      />
    </>
  );
}
