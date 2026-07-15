'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Key, ArrowDown } from 'lucide-react';

import CyberGlobe from '@/components/CyberGlobe';

interface HeroProps {
  onOpenCV: () => void;
}

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 90, damping: 18 },
  },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export default function Hero({ onOpenCV }: HeroProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center bg-[#090909] px-6 md:px-10 overflow-hidden"
    >
      {/* Dot grid */}
      <div className="dot-grid absolute inset-0 opacity-[0.12] pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-[15%] left-[5%] w-[36rem] h-[36rem] bg-cyan-950/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[40rem] h-[40rem] bg-blue-950/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full pt-28 pb-24 grid lg:grid-cols-12 gap-8 items-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 max-w-3xl"
        >
          {/* Status badge */}
          <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              Available for Opportunities · Sri Lanka
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={item}
            className="text-[clamp(2.8rem,8vw,6rem)] font-bold tracking-tight leading-[1.05] text-white mb-5"
          >
            Thenula{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-neutral-600">
              Dewanmith
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="text-lg md:text-xl font-mono tracking-wide text-cyan-400 font-medium mb-6"
          >
            Aspiring Security Engineer
          </motion.p>

          {/* Description */}
          <motion.p
            variants={item}
            className="text-neutral-400 text-base md:text-lg leading-relaxed max-w-xl font-light mb-10"
          >
            Exploring cybersecurity through hands-on projects, continuous learning, and a
            strong foundation in networking, Linux, and software development.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-black px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase font-mono transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5"
            >
              <span>View Projects</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>

            <button
              onClick={onOpenCV}
              className="inline-flex items-center gap-2 bg-transparent hover:bg-neutral-950 border border-neutral-700 hover:border-neutral-600 text-white px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase font-mono transition-all hover:scale-105 active:scale-95"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>Access Resume</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Dynamic Threat Telemetry Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className="hidden lg:block lg:col-span-5 relative w-full h-[450px]"
        >
          <CyberGlobe />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-4 h-4 text-neutral-600" />
        </motion.div>
        <span className="text-[9px] font-mono tracking-widest text-neutral-700 uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
