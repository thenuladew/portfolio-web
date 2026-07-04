'use client';

import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

const GithubSVG = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
import Image from 'next/image';

interface Project {
  title: string;
  subtitle: string;
  description: string;
  metric: string;
  metricLabel: string;
  tech: string[];
  github: string;
  demo?: string;
  image: string;
  accent: string;
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
    accent: 'from-cyan-950/60 to-blue-950/60',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="pt-16 pb-20 bg-[#090909] px-6 md:px-10 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-cyan-950/8 rounded-full blur-[130px] pointer-events-none" />

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
              03 — Featured Work
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
              Selected Projects
            </h2>
          </div>
          <a
            href="https://github.com/thenuladew"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-white text-xs font-mono tracking-wider transition-colors group"
          >
            <span>View All on GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-8">
          {PROJECTS.map((project, i) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="group relative bg-neutral-950 border border-neutral-900 hover:border-neutral-800 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className={`relative overflow-hidden min-h-[220px] md:min-h-[300px] bg-gradient-to-br ${project.accent}`}>
                  <Image
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-95 group-hover:scale-[1.02] transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-950/30 md:to-neutral-950/60" />
                </div>

                {/* Content */}
                <div className="p-7 md:p-9 flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                        {project.subtitle}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1.5 tracking-tight">
                        {project.title}
                      </h3>
                    </div>

                    <p className="text-neutral-400 text-sm leading-relaxed font-light">
                      {project.description}
                    </p>

                    {/* Key metric */}
                    <div className="inline-flex items-baseline gap-2 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                      <span className="text-2xl font-bold font-mono text-white">
                        {project.metric}
                      </span>
                      <span className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase">
                        {project.metricLabel}
                      </span>
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono px-2.5 py-1 bg-neutral-900/60 border border-neutral-800 text-neutral-400 rounded-md"
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
                      className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-white text-xs font-mono tracking-wider rounded-full transition-all hover:scale-105"
                    >
                      <GithubSVG />
                      <span>GitHub</span>
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-100 text-black text-xs font-mono tracking-wider rounded-full transition-all hover:scale-105"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
