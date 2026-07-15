'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Key } from 'lucide-react';
import Image from 'next/image';

const NAV_LINKS = [
  { label: '_about', href: '#about' },
  { label: '_skills', href: '#skills' },
  { label: '_projects', href: '#projects' },
  { label: '_cases', href: '#case-studies' },
  { label: '_contact', href: '#contact' },
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
      const ids = ['about', 'skills', 'projects', 'case-studies', 'contact'];
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
          ? 'py-3 bg-[#0b101a]/85 backdrop-blur-xl border-b border-lime-500/10'
          : 'py-5 bg-transparent'
      }`}
    >
      {/* Top neon line when scrolled */}
      {scrolled && (
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lime-500/30 to-transparent" />
      )}

      <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Brand */}
        <a href="#" aria-label="Back to top" className="group flex items-center gap-2.5">
          <span className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#11141d] border border-[#212634] group-hover:border-lime-500/40 group-hover:shadow-[0_0_12px_rgba(34,211,238,0.15)] transition-all overflow-hidden">
            <Image
              src="/wolf-logo.png"
              alt="Thenula Dewanmith"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </span>
          <span className="hidden sm:block font-mono text-[11px] tracking-widest text-[#8fa3b8] group-hover:text-lime-400 transition-colors uppercase">
            thenula<span className="text-lime-400/60">@dewanmith</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => {
            const id = href.slice(1);
            const isActive = activeId === id;
            return (
              <a
                key={id}
                href={href}
                className={`relative text-[11px] font-mono tracking-wider py-1 transition-all duration-200 ${
                  isActive
                    ? 'text-lime-400'
                    : 'text-[#6b7d8f] hover:text-[#c8d8e8]'
                }`}
              >
                {label}
                {isActive && (
                  <motion.span
                    layoutId="navline"
                    className="absolute -bottom-0.5 left-0 right-0 h-px bg-lime-400"
                    style={{ boxShadow: '0 0 8px rgba(34,211,238,0.8)' }}
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
            className="btn-scanline flex items-center gap-2 px-4 py-2 text-[11px] font-mono tracking-widest uppercase bg-[#11141d] hover:bg-lime-950/20 border border-[#212634] hover:border-lime-500/40 text-white hover:text-lime-400 rounded-lg transition-all hover:shadow-[0_0_12px_rgba(34,211,238,0.1)] active:scale-95"
          >
            <Key className="w-3 h-3 text-lime-400" />
            <span className="hidden sm:inline">Resume</span>
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg bg-[#11141d] border border-[#212634] hover:border-lime-500/30 text-[#8fa3b8] hover:text-white transition-colors"
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
            className="md:hidden border-t border-lime-500/10 bg-[#0b101a]/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-5">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[11px] font-mono tracking-widest text-[#8fa3b8] hover:text-lime-400 transition-colors"
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
