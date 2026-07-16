'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TERMINAL_LINES = [
  { text: 'thenula@cyber-sec:~$ ./initiate_scan.sh', delay: 500, type: 'input' },
  { text: '[*] Initialising stealth scan protocols...', delay: 800, type: 'output' },
  { text: '[*] Target: portfolio.local (127.0.0.1)', delay: 1000, type: 'output' },
  { text: '[+] Port 80/tcp open (http)', delay: 1400, type: 'success' },
  { text: '[+] Port 443/tcp open (https)', delay: 1600, type: 'success' },
  { text: '[-] Port 22/tcp filtered (ssh)', delay: 2000, type: 'warning' },
  { text: '[*] Bypassing IDS/IPS signatures...', delay: 2500, type: 'output' },
  { text: '[+] Firewall bypassed successfully.', delay: 3000, type: 'success' },
  { text: '[*] Extracting encrypted payloads...', delay: 3400, type: 'output' },
  { text: 'ACCESS GRANTED.', delay: 4000, type: 'highlight' },
];

export default function InteractiveTerminal() {
  const [lines, setLines] = useState<number>(0);

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];

    // Sequence the lines based on their delays
    TERMINAL_LINES.forEach((line, index) => {
      const timeout = setTimeout(() => {
        setLines(index + 1);
      }, line.delay);
      timeouts.push(timeout);
    });

    // Reset and loop the animation every 8 seconds
    const loopTimeout = setInterval(() => {
      setLines(0);
      TERMINAL_LINES.forEach((line, index) => {
        const timeout = setTimeout(() => {
          setLines(index + 1);
        }, line.delay);
        timeouts.push(timeout);
      });
    }, 8000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(loopTimeout);
    };
  }, []);

  return (
    <div className="w-full h-[380px] rounded-xl overflow-hidden bg-[#11141d]/90 border border-[#212634] shadow-[0_0_30px_rgba(178,255,29,0.05)] backdrop-blur-md flex flex-col group">
      {/* Terminal Header */}
      <div className="h-10 bg-[#161b28] border-b border-[#212634] flex items-center px-4 justify-between relative">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-xs font-mono text-[#8fa3b8]">
          bash — 80x24
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-5 font-mono text-xs md:text-sm overflow-hidden flex flex-col gap-2 relative">
        {/* Subtle scanline effect inside the terminal */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_51%)] bg-[length:100%_4px] opacity-20"></div>

        {TERMINAL_LINES.slice(0, lines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              ${line.type === 'input' ? 'text-white font-semibold' : ''}
              ${line.type === 'output' ? 'text-[#8fa3b8]' : ''}
              ${line.type === 'success' ? 'text-lime-400' : ''}
              ${line.type === 'warning' ? 'text-yellow-400' : ''}
              ${line.type === 'highlight' ? 'text-lime-400 bg-lime-400/10 inline-block px-2 py-1 rounded border border-lime-400/20 shadow-[0_0_10px_rgba(178,255,29,0.2)] font-bold tracking-widest mt-2' : ''}
            `}
          >
            {line.text}
          </motion.div>
        ))}

        {/* Blinking Cursor */}
        <div className="flex items-center mt-1">
          <span className="text-lime-400 mr-2">thenula@cyber-sec:~$</span>
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-2 h-4 bg-lime-400"
          ></motion.div>
        </div>
      </div>
    </div>
  );
}
