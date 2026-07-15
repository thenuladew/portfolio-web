'use client';

import { motion } from 'framer-motion';
import { Terminal, Shield, Network, Settings2 } from 'lucide-react';

const GROUPS = [
  {
    icon: Shield,
    title: 'Cybersecurity',
    skills: ['Network Security', 'Web Security Fundamentals', 'Linux Security', 'OWASP Top 10', 'TryHackMe', 'Wireshark', 'Nmap'],
  },
  {
    icon: Terminal,
    title: 'Programming',
    skills: ['Python', 'Java', 'C', 'JavaScript', 'SQL'],
  },
  {
    icon: Network,
    title: 'Systems',
    skills: ['Linux', 'Windows', 'VirtualBox', 'VMware', 'TCP/IP', 'DNS'],
  },
  {
    icon: Settings2,
    title: 'Tools',
    skills: ['Git', 'GitHub', 'VS Code', 'Docker', 'IntelliJ IDEA', 'PyCharm'],
  },
] as const;

export default function Skills() {
  return (
    <section id="skills" className="pt-16 pb-16 bg-[#090909] px-6 md:px-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-950/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 border-b border-neutral-900 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
              02 — Skill Matrix
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
              Technical Competence
            </h2>
          </div>
          <p className="text-neutral-600 text-xs font-mono tracking-wider max-w-xs">
            // TOOLS, LANGUAGES & SECURITY CONCEPTS
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GROUPS.map(({ icon: Icon, title, skills }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className="group bg-neutral-950 border border-neutral-900 hover:border-neutral-800 rounded-2xl p-5 md:p-6 space-y-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl group-hover:border-neutral-700 transition-colors">
                  <Icon className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold text-white font-mono tracking-wide">
                  {title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-mono px-3 py-1.5 bg-neutral-900/60 border border-neutral-800/80 hover:border-cyan-500/20 hover:text-white text-neutral-400 rounded-lg transition-colors"
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
