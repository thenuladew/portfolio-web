'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Key } from 'lucide-react';
import CyberDashboard from '@/components/CyberDashboard';

interface HeroProps {
  onOpenCV: () => void;
}

const ROLES = [
  'Aspiring Security Engineer',
  'CTF Enthusiast',
  'Network Explorer',
  'Secure Builder',
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 80, damping: 18 },
  },
};

/** Typewriter hook — types out text then deletes, cycling through array */
function useTypewriter(texts: string[], speed = 60, pause = 1800, deleteSpeed = 35) {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const current = texts[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length + 1)),
        speed
      );
    } else if (!isDeleting && displayed.length === current.length) {
      setDone(true);
      timeout = setTimeout(() => { setDone(false); setIsDeleting(true); }, pause);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length - 1)),
        deleteSpeed
      );
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setIndex((i) => (i + 1) % texts.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, index, texts, speed, pause, deleteSpeed]);

  return { displayed, done };
}

export default function Hero({ onOpenCV }: HeroProps) {
  const { displayed: role, done: roleDone } = useTypewriter(ROLES);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-transparent px-6 md:px-10 overflow-hidden"
    >
      {/* Soft ambient centre glow that complements the wave background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-lime-500/[0.02] blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full pt-28 pb-24 grid lg:grid-cols-12 gap-8 items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 max-w-3xl"
        >
          {/* Terminal status badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 mb-8 bg-[#11141d]/90 border border-lime-500/20 rounded-lg backdrop-blur-sm"
            style={{ boxShadow: '0 0 20px rgba(178,255,29,0.08)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_6px_rgba(178,255,29,1)]" />
            <span className="text-[10px] font-mono tracking-widest text-[#8fa3b8] uppercase">
              <span className="text-lime-400/60">&gt;</span>{' '}
              SYSTEM_ONLINE{' '}
              <span className="text-[#4a5568]">//</span>{' '}
              Available · Sri Lanka
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="text-[clamp(2.8rem,8vw,5.5rem)] font-bold tracking-tight leading-[1.05] text-white mb-5 flicker"
          >
            Thenula{' '}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-lime-400 to-lime-200"
              style={{ filter: 'drop-shadow(0 0 20px rgba(178,255,29,0.5))' }}
            >
              Dewanmith
            </span>
          </motion.h1>

          {/* Typewriter subtitle */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-1 text-lg md:text-xl font-mono text-lime-400 font-medium mb-6 min-h-[2rem]"
          >
            <span className="text-lime-400/40">&gt;_</span>
            <span>{role}</span>
            <span
              className={`w-0.5 h-5 bg-lime-400 ml-0.5 ${roleDone ? 'blink' : ''}`}
              style={{ boxShadow: '0 0 6px rgba(178,255,29,0.9)' }}
            />
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-[#8fa3b8] text-base md:text-lg leading-relaxed max-w-xl font-light mb-10"
          >
            Exploring cybersecurity through hands-on projects, continuous learning, and a
            strong foundation in networking, Linux, and software development.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="btn-scanline group inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-black px-6 py-3 rounded-lg text-xs font-semibold tracking-widest uppercase font-mono transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(178,255,29,0.3)] hover:shadow-[0_0_30px_rgba(178,255,29,0.5)]"
            >
              <span>View Projects</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>

            <button
              onClick={onOpenCV}
              className="btn-scanline inline-flex items-center gap-2 bg-transparent hover:bg-lime-950/20 border border-[#2a3441] hover:border-lime-500/40 text-white hover:text-lime-400 px-6 py-3 rounded-lg text-xs font-semibold tracking-widest uppercase font-mono transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_16px_rgba(178,255,29,0.12)]"
            >
              <Key className="w-3.5 h-3.5 text-lime-400" />
              <span>Access Resume</span>
            </button>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-[#1a1f2e]"
          >
            {[
              { value: 'BSc IT', label: 'Cybersec Spec.' },
              { value: 'SLIIT', label: 'University' },
              { value: '2027', label: 'Expected Grad.' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-sm font-mono font-bold text-white">{value}</span>
                <span className="text-[10px] font-mono tracking-widest text-[#4a5568] uppercase">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side — Cyber SOC Dashboard */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className="hidden lg:block lg:col-span-5 w-full"
        >
          <CyberDashboard />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-transparent to-lime-400/40"
        />
        <span className="text-[9px] font-mono tracking-widest text-[#374151] uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
