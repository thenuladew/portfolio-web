'use client';

import { useEffect, useRef } from 'react';

/**
 * MouseSpotlight — A large radial gradient that follows the cursor.
 * Creates the "flashlight in the dark" effect from BugThrive.
 * Fixed, full-screen, pointer-events none — purely visual.
 */
export default function MouseSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotRef.current;
    if (!el) return;

    // Don't activate on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e: MouseEvent) => {
      el.style.background = `radial-gradient(700px circle at ${e.clientX}px ${e.clientY}px, rgba(178, 255, 29, 0.04) 0%, rgba(178, 255, 29, 0.008) 40%, transparent 70%)`;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div
      ref={spotRef}
      className="fixed inset-0 pointer-events-none z-[2] transition-none"
      aria-hidden="true"
    />
  );
}
