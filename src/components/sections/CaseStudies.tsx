'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ArrowRight,
  X,
  Shield,
  ChevronDown,
  Server,
  Globe,
  KeyRound,
  Database,
  Lock,
} from 'lucide-react';

/* ─── Data Types ─── */

interface TechItem {
  technology: string;
  purpose: string;
}

interface ArchStep {
  label: string;
  annotations: string[];
  icon: React.ElementType;
}

interface Feature {
  title: string;
  points: string[];
  highlight?: string;
}

interface SecurityMeasure {
  measure: string;
  implementation: string;
  threat: string;
}

interface Challenge {
  problem: string;
  solution: string;
}

interface CaseStudy {
  id: string;
  tag: string;
  title: string;
  excerpt: string;
  intro: string;
  readTime: string;
  date: string;
  difficulty: 'MEDIUM' | 'HARD' | 'EXPERT';
  objectives: string[];
  techStack: TechItem[];
  architecture: ArchStep[];
  features: Feature[];
  security: SecurityMeasure[];
  challenges: Challenge[];
  lessonsLearned: string[];
  futureImprovements: string[];
  conclusion: string;
}

/* ─── Case Study Data ─── */

const CASE_STUDY: CaseStudy = {
  id: 'secure-portfolio-platform',
  tag: 'Cybersecurity · Secure Development',
  title: 'Building a Security-First Portfolio Platform',
  excerpt:
    'How I built this portfolio with security actually baked in — not bolted on afterwards. Private cloud storage, bcrypt auth, rate limiting, and a bunch of headers most people skip.',
  intro:
    "Most portfolios are just static pages. I wanted mine to actually show the security concepts I'd been learning — so I built it with private file delivery, proper server-side auth, and the kind of security headers you'd find in a real production system, not a side project. It started as a way to have something to show recruiters, and ended up being a decent learning exercise.",
  readTime: '12 min read',
  date: 'July 2025',
  difficulty: 'HARD',
  objectives: [
    'Show security principles through a real working project, not just theory',
    'Serve files securely without ever exposing a public storage URL',
    'Layer multiple controls — headers, private storage, validation, rate limiting',
    'Keep dev and production secrets properly separated',
    'Actually get comfortable with cloud object storage security',
    'Build with the SSDLC in mind from the start',
  ],
  techStack: [
    { technology: 'Next.js', purpose: 'Frontend + API routes so I could keep the backend logic in one place' },
    { technology: 'TypeScript', purpose: 'Catches a whole class of bugs before they ever run' },
    { technology: 'Tailwind CSS', purpose: 'Utility-first styling' },
    { technology: 'Framer Motion', purpose: 'Animations and transitions' },
    { technology: 'Cloudflare R2', purpose: 'Private object storage — no public endpoint, ever' },
    { technology: 'bcrypt (SHA-256)', purpose: 'Password hashing and verification, all server-side' },
    { technology: 'Vercel', purpose: 'Handles TLS automatically, easy env var management' },
    { technology: 'GitHub', purpose: 'Version control and CI/CD' },
  ],
  architecture: [
    { label: 'User (HTTPS Only)', annotations: ['TLS encrypted', 'HSTS enforced'], icon: Globe },
    { label: 'Portfolio Website (Next.js on Vercel)', annotations: ['Security headers enforced', 'Content Security Policy active'], icon: Server },
    { label: 'API Route (/api/cv)', annotations: ['Password verified server-side (bcrypt)', 'Rate limiting (5 attempts → 15min lockout)', 'No secrets exposed to client'], icon: KeyRound },
    { label: 'Cloudflare R2 (Private Bucket)', annotations: ['No public access', 'Pre-signed temporary URL generated', 'Object enumeration blocked'], icon: Database },
    { label: 'Temporary Secure Download', annotations: ['Time-limited access', 'Single-use intent'], icon: Lock },
  ],
  features: [
    {
      title: 'Secure CV Download',
      points: [
        'Password-protected endpoint — verification happens on the server, not in the browser',
        'CV lives in a private Cloudflare R2 bucket, no public URL exists for it',
        'After 5 wrong password attempts, the IP gets locked out for 15 minutes',
        'The plaintext password never leaves the server — bcrypt handles everything',
      ],
      highlight:
        "I didn't want the CV just sitting behind a public link anyone could stumble across. Instead, download requests go through the backend, which fetches the file directly from R2 and streams it to the user. The bucket URL never touches the client.",
    },
    {
      title: 'Responsive Design',
      points: ['Mobile-first layout that actually works on small screens', 'Desktop view has more breathing room and better use of space', 'Assets load without making the page feel sluggish'],
    },
    {
      title: 'Project Showcase',
      points: ['Project cards with hover effects that feel snappy', 'Tech tags so you can see the stack at a glance', 'Links to GitHub repos and live demos where available'],
    },
    {
      title: 'Contact Section',
      points: ['Email, GitHub, and LinkedIn — the usual spots to reach me'],
    },
  ],
  security: [
    { measure: 'Content Security Policy (CSP)', implementation: 'Locks down which scripts can run — inline scripts are blocked', threat: 'Cross-Site Scripting (XSS)' },
    { measure: 'X-Frame-Options', implementation: "Set to DENY so the site can't be loaded inside an iframe", threat: 'Clickjacking attacks' },
    { measure: 'X-Content-Type-Options', implementation: "nosniff — tells browsers not to guess the content type", threat: 'MIME-type confusion attacks' },
    { measure: 'Referrer-Policy', implementation: 'strict-origin-when-cross-origin — cuts down on how much referrer info gets sent to other sites', threat: 'Information leakage via referrer headers' },
    { measure: 'Permissions-Policy', implementation: 'Camera, microphone, and geolocation are all disabled — this portfolio has no business using any of that', threat: 'Unauthorized browser API access' },
    { measure: 'Private Object Storage', implementation: "The R2 bucket has no public endpoint at all — files can't be browsed or guessed directly", threat: 'Direct file enumeration and unauthorized downloads' },
    { measure: 'Server-Side Password Verification', implementation: 'bcrypt comparison runs entirely on the backend — the client never sees the hash', threat: 'Password exposure and client-side bypass' },
    { measure: 'Rate Limiting', implementation: '5 attempts per IP, then a 15-minute cooldown kicks in automatically', threat: 'Brute-force attacks on the CV endpoint' },
    { measure: 'HTTPS Enforcement', implementation: 'Vercel handles TLS, HSTS headers make sure browsers always use HTTPS going forward', threat: 'Man-in-the-middle attacks and data interception' },
    { measure: 'Environment Variable Isolation', implementation: "Secrets live in Vercel env vars for production, .env.local for dev — never committed to the repo", threat: 'Secret leakage via repository exposure' },
    { measure: 'Input Validation', implementation: 'All API request bodies are validated server-side before anything else runs', threat: 'Injection attacks and malformed request exploitation' },
  ],
  challenges: [
    { problem: 'Getting Cloudflare R2 configured for private-only access', solution: "Took a bit of trial and error. I used service tokens with the minimum permissions needed and manually checked there was no public endpoint exposed. Then ran some tests to make sure objects couldn't be enumerated from outside." },
    { problem: 'Streaming a file from R2 without leaking the bucket URL to the client', solution: "The API route fetches the file server-side and pipes it straight to the response. The browser only ever sees the download — no bucket path, no pre-signed URL, nothing to grab." },
    { problem: 'Keeping secrets out of the repo across both local dev and production', solution: "Used .env.local for local development and Vercel's dashboard for production secrets. Added .env* to .gitignore early so there was never a chance of committing anything sensitive by accident." },
    { problem: 'Stopping brute-force attempts on the CV password endpoint', solution: "Built IP-based rate limiting with a simple attempt counter. Hit 5 failures and you're locked out for 15 minutes. The UI also shows feedback so it's clear what's happening — not just a silent block." },
    { problem: "Getting the Content Security Policy right without breaking anything", solution: "Started in report-only mode to see what would get blocked before enforcing it for real. Caught a couple of false positives with fonts and Framer Motion, fixed those, then switched to enforcement." },
    { problem: 'CV file downloading as gibberish instead of opening as a PDF', solution: "Had to explicitly set Content-Type to application/pdf and add Content-Disposition with the filename. Without those, some browsers had no idea what to do with the response." },
  ],
  lessonsLearned: [
    "Defense in depth — one control on its own isn't enough. Layering headers, auth, rate limiting, and private storage is what actually makes a difference.",
    "Threat modeling early — thinking about what could go wrong before writing code genuinely changed some of my architecture decisions.",
    "Secrets management — there's a real difference between build-time and runtime env vars, and getting it wrong can expose things you didn't intend to.",
    "Security headers — one of the easiest wins you can get. A few lines of config and your attack surface shrinks noticeably.",
    "Cloud storage security — private buckets with controlled access aren't just a portfolio thing. This pattern comes up all the time.",
    "Security from the start — retrofitting it afterwards is way harder. Building it in from the beginning just makes everything cleaner.",
  ],
  futureImprovements: [
    'Download analytics with anomaly detection',
    'CAPTCHA on the CV endpoint',
    'Audit logging for all access attempts',
    'Automated dependency vulnerability scanning (Dependabot / Snyk)',
    'CI/CD pipeline with SAST scanning',
    'Docker containerization with hardened base images',
    'Web Application Firewall (WAF) rules',
    'Subresource Integrity (SRI) for external resources',
  ],
  conclusion:
    "Honestly, this started as just a portfolio site. But treating it as something worth actually securing turned it into a real learning exercise. I got hands-on with private cloud storage, security headers, bcrypt auth, and rate limiting — not from a tutorial, but by figuring out what could go wrong and fixing it. That mindset is what I want to bring to every project I work on.",
};

/* ─── Difficulty Badge ─── */
const DIFF_STYLES = {
  MEDIUM: 'text-yellow-400 border-yellow-500/30 bg-yellow-950/30',
  HARD: 'text-orange-400 border-orange-500/30 bg-orange-950/30',
  EXPERT: 'text-red-400 border-red-500/30 bg-red-950/30',
};

function DiffBadge({ level }: { level: CaseStudy['difficulty'] }) {
  return null;
}

/* ─── Terminal Section Label ─── */
function TermLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-mono tracking-widest text-lime-400/60 uppercase mb-4">
      <span className="text-[#374151]">// </span>{children}
    </p>
  );
}

/* ─── Modal ─── */

function CaseStudyModal({ study, isOpen, onClose }: { study: CaseStudy; isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-lg"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.1 }}
            className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto my-[4vh] mx-4 bg-[#0b101a] border border-[#212634] rounded-2xl shadow-2xl"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(34,211,238,0.2) transparent' }}
          >
            {/* Ambient neon glow corners */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-lime-500/[0.04] rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/[0.03] rounded-full blur-[80px] pointer-events-none" />

            {/* Top neon line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lime-500/40 to-transparent rounded-t-2xl" />

            {/* ── Sticky header ── */}
            <div className="sticky top-0 z-10 bg-[#0b101a]/95 backdrop-blur-md border-b border-[#1a1f2e] px-6 md:px-10 py-5 flex items-start justify-between">
              <div>
                {/* Terminal breadcrumb */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-mono text-[#4a5568] tracking-widest">
                    // CASE_FILE_{study.id.toUpperCase().replace(/-/g, '_')}
                  </span>
                  <DiffBadge level={study.difficulty} />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-lime-400/70 uppercase">
                  {study.tag}
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1">
                  {study.title}
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[10px] font-mono text-[#6b7d8f]">{study.date}</span>
                  <span className="text-[#374151]">•</span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#6b7d8f]">
                    <BookOpen className="w-3 h-3" />
                    <span>{study.readTime}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-[#6b7d8f] hover:text-white hover:bg-[#161b28] border border-transparent hover:border-[#212634] transition-all p-2 rounded-lg shrink-0 mt-1"
                aria-label="Close case study"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Content ── */}
            <div className="relative px-6 md:px-10 py-8 space-y-10">

              {/* Intro */}
              <div className="pb-8 border-b border-[#1a1f2e]">
                <p className="text-[#b0c4d8] text-sm leading-relaxed mb-5">{study.intro}</p>
                <div className="space-y-2">
                  {study.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-[#6b7d8f]">
                      <span className="text-lime-400/40 shrink-0 mt-0.5 font-mono">→</span>
                      <span className="leading-relaxed">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stack */}
              <div className="pb-8 border-b border-[#1a1f2e]">
                <TermLabel>the_stack</TermLabel>
                <div className="flex flex-wrap gap-2">
                  {study.techStack.map((item) => (
                    <div key={item.technology} className="group relative">
                      <span className="inline-block text-xs font-mono px-3 py-1.5 bg-[#161b28]/90 border border-[#212634] hover:border-lime-500/30 hover:text-lime-400 text-[#b0c4d8] rounded-lg transition-all cursor-default">
                        {item.technology}
                      </span>
                      <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-[#161b28] border border-[#212634] rounded-lg text-xs text-[#8fa3b8] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                        {item.purpose}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Flow */}
              <div className="pb-8 border-b border-[#1a1f2e]">
                <TermLabel>request_flow</TermLabel>
                <div className="flex flex-col items-center gap-0">
                  {study.architecture.map((step, i) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={i} className="flex flex-col items-center w-full max-w-lg">
                        <div className="w-full bg-[#11141d]/90 border border-[#212634] hover:border-lime-500/20 rounded-xl p-4 transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-1.5 bg-[#161b28] border border-[#212634] rounded-lg">
                              <StepIcon className="w-3.5 h-3.5 text-lime-400" />
                            </div>
                            <span className="text-sm font-semibold text-white">{step.label}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 ml-9">
                            {step.annotations.map((ann, j) => (
                              <span key={j} className="text-[10px] font-mono px-2 py-0.5 bg-lime-950/25 border border-cyan-900/25 text-lime-400/60 rounded-md">
                                {ann}
                              </span>
                            ))}
                          </div>
                        </div>
                        {i < study.architecture.length - 1 && (
                          <div className="flex flex-col items-center py-1">
                            <div className="w-px h-4 bg-gradient-to-b from-lime-500/30 to-neutral-800" />
                            <ChevronDown className="w-4 h-4 text-lime-400/30 -my-1" />
                            <div className="w-px h-2 bg-neutral-800" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Security Measures */}
              <div className="pb-8 border-b border-[#1a1f2e]">
                <TermLabel>security_measures</TermLabel>
                <p className="text-[#4a5568] text-xs -mt-2 mb-5 font-mono">// each one mapped to the threat it&apos;s there to stop</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {study.security.map((item, i) => (
                    <div key={i} className="bg-[#11141d]/90 border border-[#1a1f2e] hover:border-[#212634] rounded-xl p-3.5 transition-colors group">
                      <h4 className="text-xs font-semibold text-white mb-1.5 group-hover:text-lime-50 transition-colors">
                        {item.measure}
                      </h4>
                      <p className="text-[#6b7d8f] text-xs leading-relaxed mb-2">{item.implementation}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-mono text-red-400/50">↳ mitigates:</span>
                        <span className="text-[9px] font-mono text-red-400/60">{item.threat}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenges */}
              <div className="pb-8 border-b border-[#1a1f2e]">
                <TermLabel>the_tricky_bits</TermLabel>
                <div className="space-y-3">
                  {study.challenges.map((item, i) => (
                    <div key={i} className="bg-[#11141d]/90 border border-[#1a1f2e] rounded-xl overflow-hidden">
                      <div className="px-5 py-3 border-b border-[#1a1f2e] flex items-start gap-3">
                        <span className="text-[9px] font-mono text-red-400 bg-red-950/25 px-2 py-0.5 rounded border border-red-900/25 shrink-0 mt-0.5 tracking-widest">
                          ERR
                        </span>
                        <span className="text-sm text-[#b0c4d8]">{item.problem}</span>
                      </div>
                      <div className="px-5 py-3 flex items-start gap-3">
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/25 px-2 py-0.5 rounded border border-emerald-900/25 shrink-0 mt-0.5 tracking-widest">
                          FIX
                        </span>
                        <span className="text-sm text-[#8fa3b8] leading-relaxed">{item.solution}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lessons */}
              <div className="pb-8 border-b border-[#1a1f2e]">
                <TermLabel>takeaways</TermLabel>
                <ul className="space-y-2.5">
                  {study.lessonsLearned.map((lesson, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#8fa3b8] leading-relaxed">
                      <span className="text-lime-400/40 shrink-0 mt-0.5 font-mono">—</span>
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Future */}
              <div className="pb-8 border-b border-[#1a1f2e]">
                <TermLabel>future_improvements</TermLabel>
                <div className="flex flex-wrap gap-2">
                  {study.futureImprovements.map((item, i) => (
                    <span key={i} className="text-xs font-mono px-3 py-1.5 bg-[#11141d]/90 border border-[#212634] hover:border-lime-500/20 hover:text-lime-400 text-[#6b7d8f] rounded-lg transition-colors">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Conclusion */}
              <div>
                <TermLabel>final_thoughts</TermLabel>
                <p className="text-[#b0c4d8] text-sm leading-relaxed">{study.conclusion}</p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="border-t border-[#1a1f2e] px-6 md:px-10 py-4 flex items-center justify-between">
              <span className="text-[9px] font-mono text-[#374151] tracking-widest uppercase">
                // {study.tag}
              </span>
              <button
                onClick={onClose}
                className="text-[11px] font-mono text-[#6b7d8f] hover:text-lime-400 transition-colors tracking-widest uppercase"
              >
                [ CLOSE ]
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─── Glow card helper ─── */
function useGlowCard() {
  return useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);
}

/* ─── Main Section ─── */

export default function CaseStudies() {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const onGlowMove = useGlowCard();

  return (
    <>
      <section
        id="case-studies"
        className="pt-16 pb-20 bg-transparent px-6 md:px-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-80 h-80 bg-purple-500/[0.025] rounded-full blur-[100px] pointer-events-none" />

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
                SYS_04
                <span className="text-[#4a5568]"> ]</span>
                {' '}// case_files
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-2">
                Case <span className="text-lime-400">Studies</span>
              </h2>
            </div>
            <p className="text-[#4a5568] text-xs font-mono tracking-wider max-w-xs">
              // Security-focused technical writeups
            </p>
          </motion.div>

          {/* Case Study Card */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            onClick={() => setSelectedStudy(CASE_STUDY)}
            onMouseMove={onGlowMove}
            className="glow-card group relative bg-[#11141d]/90 border border-[#1a1f2e] hover:border-lime-500/25 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
          >
            <div className="relative z-10 grid md:grid-cols-5 gap-0">
              {/* Left accent panel */}
              <div className="md:col-span-2 bg-gradient-to-br from-lime-950/30 to-neutral-950/80 p-7 md:p-9 flex flex-col justify-between min-h-[200px] md:min-h-[280px] relative overflow-hidden">
                {/* Grid pattern */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 20px,white 20px,white 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,white 20px,white 21px)` }}
                />
                {/* Top neon line */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lime-500/25 to-transparent" />

                <div className="relative">
                  <div className="p-3 bg-[#161b28]/70 border border-cyan-900/30 group-hover:border-lime-500/30 rounded-xl w-fit mb-4 transition-colors group-hover:shadow-[0_0_12px_rgba(34,211,238,0.1)]">
                    <Shield className="w-6 h-6 text-lime-400" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono tracking-widest text-lime-400/70 uppercase">
                      {CASE_STUDY.tag}
                    </span>
                  </div>
                  <DiffBadge level={CASE_STUDY.difficulty} />
                </div>

                <div className="relative flex items-center gap-3 mt-4">
                  <span className="text-[10px] font-mono text-[#4a5568]">{CASE_STUDY.date}</span>
                  <span className="text-neutral-800">•</span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#4a5568]">
                    <BookOpen className="w-3 h-3" />
                    <span>{CASE_STUDY.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Right content */}
              <div className="md:col-span-3 p-7 md:p-9 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  {/* Process tag */}
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_6px_rgba(34,211,238,1)]" />
                    <span className="text-[9px] font-mono tracking-widest text-[#4a5568] uppercase">
                      CASE_FILE_001 · SECURE_DEVELOPMENT
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-lime-50 transition-colors">
                    {CASE_STUDY.title}
                  </h3>
                  <p className="text-[#8fa3b8] text-sm leading-relaxed font-light">
                    {CASE_STUDY.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {['Defense in Depth', 'Cloud Storage', 'Security Headers', 'Rate Limiting', 'bcrypt'].map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2.5 py-1 bg-[#161b28]/70 border border-[#212634] hover:border-lime-500/20 hover:text-lime-400 text-[#6b7d8f] rounded-md transition-all"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-lime-400/70 group-hover:text-lime-400 transition-colors">
                  <span className="text-xs font-mono tracking-wider uppercase">Read Case Study</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Modal */}
      <CaseStudyModal
        study={CASE_STUDY}
        isOpen={selectedStudy !== null}
        onClose={() => setSelectedStudy(null)}
      />
    </>
  );
}
