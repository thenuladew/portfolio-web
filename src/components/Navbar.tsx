'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, Key } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
] as const;

interface NavbarProps {
  onOpenCV: () => void;
}

export default function Navbar({ onOpenCV }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);

      // Active section tracking
      const ids = ['about', 'skills', 'projects', 'blog', 'contact'];
      const offset = window.innerHeight * 0.35;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const { top, bottom } = el.getBoundingClientRect();
          if (top <= offset && bottom > offset) {
            setActiveId(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-[#090909]/80 backdrop-blur-xl border-b border-white/[0.04]'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Brand */}
        <a href="#" aria-label="Back to top" className="group flex items-center gap-2.5">
          <span className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-950 border border-neutral-800 group-hover:border-cyan-500/40 transition-colors">
            <svg viewBox="0 0 100 100" className="w-5.5 h-5.5" fill="none">
              <path 
                d="M 32 36 H 50 M 50 36 V 68" 
                stroke="#ffffff" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M 50 36 H 58 C 67 36 72 43 72 52 C 72 61 67 68 58 68 H 50" 
                stroke="currentColor" 
                strokeWidth="6" 
                className="text-cyan-400"
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <circle cx="32" cy="68" r="4" className="fill-cyan-400" />
            </svg>
          </span>
          <span className="hidden sm:block font-mono text-xs tracking-widest text-neutral-300 group-hover:text-white transition-colors uppercase">
            Thenula Dewanmith
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => {
            const id = href.slice(1);
            return (
              <a
                key={id}
                href={href}
                className={`relative text-[11px] font-mono tracking-widest uppercase py-1 transition-colors ${
                  activeId === id ? 'text-white' : 'text-neutral-500 hover:text-neutral-200'
                }`}
              >
                {label}
                {activeId === id && (
                  <motion.span
                    layoutId="navline"
                    className="absolute -bottom-0.5 left-0 right-0 h-px bg-cyan-400"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* CV button + mobile toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCV}
            className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono font-medium tracking-widest uppercase bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white rounded-full transition-all hover:scale-105 active:scale-95"
          >
            <Key className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Resume</span>
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-neutral-900 bg-[#090909] overflow-hidden"
          >
            <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-5">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 hover:text-white transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
