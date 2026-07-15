'use client';

import { Shield } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-900 py-8 px-6 md:px-10 bg-[#090909]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-neutral-600">
          <Shield className="w-3.5 h-3.5 text-cyan-400/50" />
          <span className="text-xs font-mono tracking-wider">
            © {year} Thenula Dewanmith
          </span>
        </div>
        <div className="flex items-center gap-2 text-neutral-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase">
            SECURE PROTOCOL ACTIVE
          </span>
        </div>
      </div>
    </footer>
  );
}
