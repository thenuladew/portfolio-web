'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Compass, Cpu, TrendingUp, Terminal } from 'lucide-react';
import NetworkTopology from '@/components/NetworkTopology';

const VALUES = [
  {
    icon: Compass,
    title: 'Curiosity',
    desc: 'I enjoy understanding how systems work, exploring new technologies, and continuously expanding my cybersecurity knowledge.',
  },
  {
    icon: Cpu,
    title: 'Hands-on Learning',
    desc: 'I learn best by building projects, experimenting in labs, and applying concepts beyond the classroom.',
  },
  {
    icon: TrendingUp,
    title: 'Continuous Improvement',
    desc: 'Every project is an opportunity to improve my technical skills, problem-solving, and understanding of cybersecurity.',
  },
  {
    icon: Terminal,
    title: 'Engineering Mindset',
    desc: 'I value clean design, thoughtful solutions, and building software that is reliable, maintainable, and practical.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' as const },
  }),
};

/** Mouse-reactive glow card handler */
function useGlowCard() {
  return useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);
}

export default function About() {
  const onGlowMove = useGlowCard();

  return (
    <section id="about" className="pt-20 pb-16 bg-transparent px-6 md:px-10 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-lime-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
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
              SYS_01
              <span className="text-[#4a5568]"> ]</span>
              {' '}// profile
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
              Building My Foundation in{' '}
              <span className="text-lime-400">Cybersecurity</span>
            </h2>
          </div>
          <p className="text-[#4a5568] text-xs font-mono tracking-wider max-w-xs">
            // SLIIT · BSc (Hons) IT — Cybersecurity Specialization
          </p>
        </motion.div>

        {/* Content grid */}
        <div className="grid md:grid-cols-12 gap-10 items-start mb-12">
          <div className="md:col-span-7 space-y-5">
            <p className="text-[#8fa3b8] text-base leading-relaxed font-light">
              I&apos;m an undergraduate specializing in Cybersecurity at the{' '}
              <span className="text-white font-medium">
                Sri Lanka Institute of Information Technology (SLIIT)
              </span>
              . Through university coursework, hands-on labs, and personal projects, I&apos;m
              building practical skills in networking, Linux, software development, and
              cybersecurity.
            </p>
            <p className="text-[#8fa3b8] text-base leading-relaxed font-light">
              My goal is to grow into a security engineer by continuously learning, solving
              technical challenges, and creating projects that strengthen both my engineering
              and security knowledge.
            </p>

            {/* Terminal readout panel */}
            <div className="mt-6 bg-[#11141d]/70 border border-[#212634] rounded-lg p-4 font-mono text-xs space-y-1">
              <p className="text-[#4a5568] mb-2">// system_status.log</p>
              <p><span className="text-lime-400/60">STATUS</span><span className="text-[#4a5568]">:</span> <span className="text-emerald-400">ACTIVE_LEARNER</span></p>
              <p><span className="text-lime-400/60">FIELD</span><span className="text-[#4a5568]">:</span> <span className="text-white">Cybersecurity &amp; Secure Development</span></p>
              <p><span className="text-lime-400/60">BASE</span><span className="text-[#4a5568]">:</span> <span className="text-white">Sri Lanka 🇱🇰</span></p>
              <p><span className="text-lime-400/60">OPEN_TO</span><span className="text-[#4a5568]">:</span> <span className="text-lime-300">Internships &amp; Collaborations</span></p>
            </div>
          </div>

          <div
            className="glow-card relative md:col-span-5 bg-[#11141d]/90 border border-[#212634] hover:border-lime-500/25 rounded-2xl p-6 overflow-hidden group transition-colors duration-300"
            onMouseMove={onGlowMove}
            style={{ boxShadow: 'none' }}
          >
            <div className="relative z-10">
              <NetworkTopology />
              <div className="relative z-10 space-y-3 mt-4">
                <span className="text-[10px] font-mono tracking-widest text-[#6b7d8f] uppercase">
                  Current Focus
                </span>
                <h3 className="text-white font-semibold text-sm font-mono leading-relaxed">
                  Networking &bull; Linux &bull; Cybersecurity
                </h3>
                <p className="text-[#6b7d8f] text-xs leading-relaxed">
                  Building a strong technical foundation through practical projects, home labs,
                  and continuous learning while exploring network security, system administration,
                  and software development.
                </p>
                <div className="pt-2 border-t border-[#1a1f2e] flex flex-wrap gap-2">
                  {['SLIIT', 'Sri Lanka', 'Cybersecurity', 'Secure Dev'].map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2.5 py-1 bg-[#161b28] border border-[#212634] hover:border-lime-500/20 hover:text-lime-400 text-[#6b7d8f] rounded-full transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div>
          <h3 className="terminal-label mb-6">
            <span className="text-[#4a5568]">[ </span>values<span className="text-[#4a5568]"> ]</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                onMouseMove={onGlowMove}
                className="glow-card bg-[#11141d]/90 border border-[#1a1f2e] hover:border-lime-500/20 rounded-xl p-5 space-y-4 transition-colors"
              >
                <div className="relative z-10 p-2 w-fit bg-[#161b28] border border-[#212634] rounded-lg group-hover:border-lime-500/20 transition-colors">
                  <Icon className="w-4 h-4 text-lime-400" />
                </div>
                <h4 className="relative z-10 text-sm font-semibold text-white">{title}</h4>
                <p className="relative z-10 text-[#6b7d8f] text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
