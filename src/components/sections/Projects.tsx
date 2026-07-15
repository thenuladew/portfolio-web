'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const GithubSVG = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

interface Project {
  title: string;
  subtitle: string;
  description: string;
  metric?: string;
  metricLabel?: string;
  tech: string[];
  github: string;
  demo?: string;
  image: string;
  accent: string;
  status: string;
}

const PROJECTS: Project[] = [
  {
    title: 'SMS Spam Classifier',
    subtitle: 'Machine Learning · NLP',
    description:
      'A binary text classification system using Natural Language Processing to detect spam messages. Built with Multinomial Naive Bayes on a TF-IDF feature matrix, achieving high accuracy on the UCI SMS Spam Collection dataset.',
    metric: '97.2%',
    metricLabel: 'Classification Accuracy',
    tech: ['Python', 'Scikit-learn', 'NLTK', 'pandas', 'TF-IDF', 'Naive Bayes'],
    github: 'https://github.com/thenuladew/sms-spam-classifier',
    image: '/project-sms.png',
    accent: 'from-lime-950/60 to-blue-950/60',
    status: 'COMPLETE',
  },
  {
    title: 'Secure Portfolio Platform',
    subtitle: 'Cybersecurity · Web Development',
    description:
      'Designed and developed a production-ready portfolio platform using Next.js, featuring secure CV delivery through private Cloudflare R2 storage, protected API endpoints, automated CI/CD, responsive design, interactive animations, and performance optimization.',
    metric: 'A',
    metricLabel: 'Security Headers Grade',
    tech: ['Next.js', 'TypeScript', 'Three.js', 'Framer Motion', 'Cloudflare R2', 'bcrypt'],
    github: 'https://github.com/thenuladew/portfolio-web',
    image: '/project-portfolio.png',
    accent: 'from-emerald-950/60 to-lime-950/60',
    status: 'LIVE',
  },
];

/** Count-up hook — animates a numeric string from 0 to target when in view */
function useCountUp(target: string, inView: boolean) {
  const [displayed, setDisplayed] = useState('0');
  const numeric = parseFloat(target);
  const isNumeric = !isNaN(numeric);

  useEffect(() => {
    if (!inView || !isNumeric) {
      if (!isNumeric) setDisplayed(target);
      return;
    }
    let start = 0;
    const end = numeric;
    const duration = 1200;
    const step = 16;
    const increment = (end / (duration / step));
    const timer = setInterval(() => {
      start = Math.min(start + increment, end);
      setDisplayed(
        Number.isInteger(end)
          ? String(Math.round(start))
          : start.toFixed(1)
      );
      if (start >= end) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [inView, target, isNumeric, numeric]);

  return isNumeric ? displayed : target;
}

function useGlowCard() {
  return useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);
}

function ProjectCard({ project, i }: { project: Project; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const onGlowMove = useGlowCard();

  // Raw numeric for count-up (strip the % suffix for display)
  const rawMetric = project.metric?.replace('%', '') ?? '';
  const counted = useCountUp(rawMetric, inView);
  const displayMetric = project.metric?.includes('%') ? `${counted}%` : (project.metric ?? '');

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: i * 0.1 }}
      onMouseMove={onGlowMove}
      className="glow-card group relative bg-[#11141d]/90 border border-[#1a1f2e] hover:border-lime-500/20 rounded-2xl overflow-hidden transition-all duration-300"
    >
      <div className="relative z-10 grid md:grid-cols-2 gap-0">
        {/* Image */}
        <div className={`relative overflow-hidden min-h-[220px] md:min-h-[300px] bg-gradient-to-br ${project.accent}`}>
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            className="object-cover opacity-80 group-hover:opacity-95 group-hover:scale-[1.02] transition-all duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Scanline on image */}


          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-950/50 md:to-neutral-950/70" />
          {/* Status badge */}
          <div className="absolute top-4 left-4">
            <span className={`text-[9px] font-mono px-2 py-1 rounded border tracking-widest uppercase ${
              project.status === 'LIVE'
                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                : 'bg-[#161b28]/70 border-[#2a3441] text-[#8fa3b8]'
            }`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-7 md:p-9 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#6b7d8f] uppercase">
                {project.subtitle}
              </span>
              <h3 className="text-xl font-bold text-white mt-1.5 tracking-tight group-hover:text-lime-50 transition-colors">
                {project.title}
              </h3>
            </div>

            <p className="text-[#8fa3b8] text-sm leading-relaxed font-light">
              {project.description}
            </p>

            {/* Key metric with count-up */}
            {project.metric && project.metricLabel && (
              <div className="inline-flex items-baseline gap-2 px-4 py-2.5 bg-[#161b28]/90 border border-[#212634] rounded-xl">
                <span className="text-2xl font-bold font-mono text-lime-400 shimmer-text">
                  {displayMetric}
                </span>
                <span className="text-[10px] font-mono tracking-wider text-[#6b7d8f] uppercase">
                  {project.metricLabel}
                </span>
              </div>
            )}

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono px-2.5 py-1 bg-[#161b28]/70 border border-[#212634] hover:border-lime-500/30 hover:text-lime-300 text-[#8fa3b8] rounded-md transition-all"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-scanline inline-flex items-center gap-2 px-4 py-2 bg-[#161b28] hover:bg-neutral-800 border border-[#212634] hover:border-lime-500/30 text-white hover:text-lime-300 text-xs font-mono tracking-wider rounded-lg transition-all hover:scale-105"
            >
              <GithubSVG />
              <span>GitHub</span>
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-scanline inline-flex items-center gap-2 px-4 py-2 bg-lime-400 hover:bg-lime-300 text-black text-xs font-mono tracking-wider rounded-lg transition-all hover:scale-105 shadow-[0_0_16px_rgba(34,211,238,0.2)]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="pt-16 pb-20 bg-transparent px-6 md:px-10 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-lime-500/[0.03] rounded-full blur-[130px] pointer-events-none" />

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
              SYS_03
              <span className="text-[#4a5568]"> ]</span>
              {' '}// featured_work
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
              Selected <span className="text-lime-400">Projects</span>
            </h2>
          </div>
          <a
            href="https://github.com/thenuladew"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#6b7d8f] hover:text-lime-400 text-xs font-mono tracking-wider transition-colors group"
          >
            <span>View All on GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-8">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
