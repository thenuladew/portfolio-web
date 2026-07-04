'use client';

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

export default function About() {
  return (
    <section id="about" className="pt-20 pb-16 bg-[#090909] px-6 md:px-10 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-950/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 border-b border-neutral-900 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
              01 — Profile
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
              Building My Foundation in Cybersecurity
            </h2>
          </div>
          <p className="text-neutral-600 text-xs font-mono tracking-wider max-w-xs">
            // SLIIT · BSc (Hons) IT — Cybersecurity Specialization
          </p>
        </motion.div>

        {/* Content grid */}
        <div className="grid md:grid-cols-12 gap-10 items-start mb-12">
          <div className="md:col-span-7 space-y-5">
            <p className="text-neutral-400 text-base leading-relaxed font-light">
              I&apos;m an undergraduate specializing in Cybersecurity at the{' '}
              <span className="text-white font-medium">
                Sri Lanka Institute of Information Technology (SLIIT)
              </span>
              . Through university coursework, hands-on labs, and personal projects, I&apos;m
              building practical skills in networking, Linux, software development, and
              cybersecurity.
            </p>
            <p className="text-neutral-400 text-base leading-relaxed font-light">
              My goal is to grow into a security engineer by continuously learning, solving
              technical challenges, and creating projects that strengthen both my engineering
              and security knowledge.
            </p>
          </div>

          <div className="relative md:col-span-5 bg-neutral-950 border border-neutral-900 rounded-2xl p-6 overflow-hidden group">
            {/* Interactive Network Background */}
            <NetworkTopology />

            <div className="relative z-10 space-y-3">
              <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                Current Focus
              </span>
              <h3 className="text-white font-semibold text-sm font-mono leading-relaxed">
                Networking &bull; Linux &bull; Cybersecurity
              </h3>
              <p className="text-neutral-500 text-xs leading-relaxed">
                Building a strong technical foundation through practical projects, home labs,
                and continuous learning while exploring network security, system administration,
                and software development.
              </p>
              <div className="pt-2 border-t border-neutral-900 flex flex-wrap gap-2">
                {['SLIIT', 'Sri Lanka', 'Cybersecurity', 'Secure Dev'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div>
          <h3 className="text-xs font-mono tracking-widest text-neutral-500 uppercase mb-6">
            Professional Values
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
                className="bg-neutral-950 border border-neutral-900 hover:border-neutral-800 rounded-xl p-5 space-y-4 transition-colors"
              >
                <div className="p-2 w-fit bg-neutral-900 border border-neutral-800 rounded-lg">
                  <Icon className="w-4 h-4 text-cyan-400" />
                </div>
                <h4 className="text-sm font-semibold text-white">{title}</h4>
                <p className="text-neutral-500 text-xs leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
