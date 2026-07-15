'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Network, Settings2 } from 'lucide-react';

const GROUPS = [
  {
    icon: Shield,
    title: 'Cybersecurity',
    proficiency: 7,
    skills: ['Network Security', 'Web Security Fundamentals', 'Linux Security', 'OWASP Top 10', 'TryHackMe', 'Wireshark', 'Nmap'],
  },
  {
    icon: Terminal,
    title: 'Programming',
    proficiency: 8,
    skills: ['Python', 'Java', 'C', 'JavaScript', 'SQL'],
  },
  {
    icon: Network,
    title: 'Systems',
    proficiency: 7,
    skills: ['Linux', 'Windows', 'VirtualBox', 'VMware', 'TCP/IP', 'DNS'],
  },
  {
    icon: Settings2,
    title: 'Tools',
    proficiency: 8,
    skills: ['Git', 'GitHub', 'VS Code', 'Docker', 'IntelliJ IDEA', 'PyCharm'],
  },
] as const;

function ProBar({ value }: { value: number }) {
  const filled = value;
  const empty = 10 - filled;
  return (
    <span className="font-mono text-[10px] text-lime-400/50">
      [{'█'.repeat(filled)}{'░'.repeat(empty)}]
    </span>
  );
}

function useGlowCard() {
  return useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);
}

export default function Skills() {
  const onGlowMove = useGlowCard();

  return (
    <section id="skills" className="pt-16 pb-16 bg-transparent px-6 md:px-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 border-b border-[#1a1f2e] pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <span className="terminal-label">
              <span className="text-[#4a5568]">[ </span>
              SYS_02
              <span className="text-[#4a5568]"> ]</span>
              {' '}// skill_matrix
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
              Technical <span className="text-lime-400">Competence</span>
            </h2>
          </div>
          <p className="text-[#4a5568] text-xs font-mono tracking-wider max-w-xs">
            // TOOLS, LANGUAGES &amp; SECURITY CONCEPTS
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GROUPS.map(({ icon: Icon, title, proficiency, skills }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onMouseMove={onGlowMove}
              className="glow-card group bg-[#11141d]/90 border border-[#1a1f2e] hover:border-lime-500/20 rounded-2xl p-5 md:p-6 space-y-4 transition-colors"
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#161b28] border border-[#212634] rounded-xl group-hover:border-lime-500/20 transition-colors">
                    <Icon className="w-4 h-4 text-lime-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white font-mono tracking-wide">
                    {title}
                  </h3>
                </div>
                <ProBar value={proficiency} />
              </div>

              <div className="relative z-10 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-mono px-3 py-1.5 bg-[#161b28]/70 border border-[#212634]/80 hover:border-lime-500/30 hover:text-lime-300 hover:bg-lime-950/20 text-[#8fa3b8] rounded-lg transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
