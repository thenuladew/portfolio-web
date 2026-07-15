'use client';

import { Shield } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-lime-500/10 py-8 px-6 md:px-10 bg-transparent overflow-hidden">
      {/* Neon top-border glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lime-500/30 to-transparent" />

      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[#4a5568]">
          <Shield className="w-3.5 h-3.5 text-lime-400/40" />
          <span className="text-xs font-mono tracking-wider">
            © {year} Thenula Dewanmith
          </span>
        </div>

        {/* Terminal EOF line */}
        <div className="text-[10px] font-mono tracking-widest text-[#374151] uppercase">
          <span className="text-neutral-800">[ </span>
          EOF
          <span className="text-neutral-800"> ]</span>
          {' '}— THENULA_DEWANMITH.v2
        </div>

        <div className="flex items-center gap-2 text-[#374151]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span className="text-[10px] font-mono tracking-widest uppercase">
            SECURE PROTOCOL ACTIVE
          </span>
        </div>
      </div>
    </footer>
  );
}
