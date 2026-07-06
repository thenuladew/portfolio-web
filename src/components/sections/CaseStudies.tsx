'use client';

import { motion } from 'framer-motion';
import { BookOpen, ArrowUpRight, Clock } from 'lucide-react';

const CASE_STUDIES = [
  {
    tag: 'Web Security',
    title: 'Understanding SQL Injection: From Theory to Exploitation',
    excerpt: 'A deep dive into how SQL injection vulnerabilities arise in modern web applications and how to systematically prevent them at the architecture level.',
    readTime: '8 min read',
    date: 'Coming soon',
  },
  {
    tag: 'Networking',
    title: 'DNS Poisoning Attacks: How They Work and How to Defend Against Them',
    excerpt: 'Exploring the mechanics of DNS cache poisoning and DNSSEC as a defensive layer, with practical packet analysis examples.',
    readTime: '10 min read',
    date: 'Coming soon',
  },
  {
    tag: 'Secure Development',
    title: 'Spring Security from Scratch: A Practical Security Guide for Java Developers',
    excerpt: 'Building a real-world authentication and authorization system using Spring Security 6 with JWT, RBAC, and session hardening.',
    readTime: '15 min read',
    date: 'Coming soon',
  },
];

export default function CaseStudies() {
  return (
    <section id="case-studies" className="pt-16 pb-20 bg-[#090909] px-6 md:px-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-950/5 rounded-full blur-[100px] pointer-events-none" />

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
              04 — Case Studies
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
              Case Studies
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-full">
            <Clock className="w-3 h-3 text-neutral-500" />
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              Case studies in progress
            </span>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CASE_STUDIES.map((study, i) => (
            <motion.div
              key={study.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className="group relative bg-neutral-950 border border-neutral-900 hover:border-neutral-800 rounded-2xl p-6 flex flex-col gap-5 transition-all duration-300 overflow-hidden"
            >
              {/* Coming soon overlay */}
              <div className="absolute inset-0 bg-[#090909]/0 group-hover:bg-[#090909]/0 pointer-events-none" />

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-500 rounded-full uppercase tracking-wider">
                  {study.tag}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-700">
                  <BookOpen className="w-3 h-3" />
                  <span>{study.readTime}</span>
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <h3 className="text-sm font-semibold text-white leading-snug group-hover:text-neutral-100 transition-colors">
                  {study.title}
                </h3>
                <p className="text-neutral-600 text-xs leading-relaxed">{study.excerpt}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-700">{study.date}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-700 group-hover:text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
