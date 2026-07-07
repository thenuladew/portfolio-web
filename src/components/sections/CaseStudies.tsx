'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ArrowRight,
  X,
  Shield,
  Target,
  Layers,
  Lock,
  AlertTriangle,
  Lightbulb,
  Rocket,
  CheckCircle2,
  ChevronDown,
  Server,
  Globe,
  KeyRound,
  Database,
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
  highlight?: string; // optional longer description for key features
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
  readTime: string;
  date: string;
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
    'A deep dive into how I built this portfolio website with security engineering principles at its core — private cloud storage, defense-in-depth headers, server-side authentication, and rate limiting.',
  readTime: '12 min read',
  date: 'July 2025',
  objectives: [
    'Build a portfolio that demonstrates security engineering principles in practice',
    'Implement secure file delivery without exposing assets via public URLs',
    'Apply defense-in-depth — security headers, private storage, input validation, rate limiting',
    'Practice secure deployment workflows with environment isolation',
    'Gain hands-on experience with cloud object storage security',
    'Develop skills in Secure Software Development Lifecycle (SSDLC)',
  ],
  techStack: [
    { technology: 'Next.js', purpose: 'Frontend framework with API routes for backend logic' },
    { technology: 'TypeScript', purpose: 'Type safety to reduce runtime vulnerabilities' },
    { technology: 'Tailwind CSS', purpose: 'Utility-first styling' },
    { technology: 'Framer Motion', purpose: 'UI animations and transitions' },
    { technology: 'Cloudflare R2', purpose: 'Private object storage for sensitive files' },
    { technology: 'bcrypt (SHA-256)', purpose: 'Server-side password verification' },
    { technology: 'Vercel', purpose: 'Deployment with automatic HTTPS enforcement' },
    { technology: 'GitHub', purpose: 'Version control and CI/CD integration' },
  ],
  architecture: [
    {
      label: 'User (HTTPS Only)',
      annotations: ['TLS encrypted', 'HSTS enforced'],
      icon: Globe,
    },
    {
      label: 'Portfolio Website (Next.js on Vercel)',
      annotations: ['Security headers enforced', 'Content Security Policy active'],
      icon: Server,
    },
    {
      label: 'API Route (/api/cv)',
      annotations: [
        'Password verified server-side (bcrypt)',
        'Rate limiting (5 attempts → 15min lockout)',
        'No secrets exposed to client',
      ],
      icon: KeyRound,
    },
    {
      label: 'Cloudflare R2 (Private Bucket)',
      annotations: [
        'No public access',
        'Pre-signed temporary URL generated',
        'Object enumeration blocked',
      ],
      icon: Database,
    },
    {
      label: 'Temporary Secure Download',
      annotations: ['Time-limited access', 'Single-use intent'],
      icon: Lock,
    },
  ],
  features: [
    {
      title: 'Secure CV Download',
      points: [
        'Password-protected endpoint with server-side verification',
        'Private Cloudflare R2 storage — no public bucket access',
        'IP-based rate limiting with automatic lockout after 5 failed attempts',
        'bcrypt hashing — plaintext password never touches the client',
      ],
      highlight:
        'Rather than exposing the CV through a public URL, download requests are handled by the backend, which retrieves the file from a private Cloudflare R2 bucket. This approach prevents direct enumeration of storage objects and provides greater control over file access.',
    },
    {
      title: 'Responsive Design',
      points: ['Mobile-first responsive layout', 'Desktop-optimized viewing experience', 'Performance-optimized asset loading'],
    },
    {
      title: 'Project Showcase',
      points: ['Interactive project cards with hover effects', 'Technology stack tags', 'Direct links to GitHub repositories and live demos'],
    },
    {
      title: 'Contact Section',
      points: ['Professional email contact', 'GitHub profile link', 'LinkedIn profile integration'],
    },
  ],
  security: [
    {
      measure: 'Content Security Policy (CSP)',
      implementation: 'Restricts script sources and prevents inline script execution',
      threat: 'Cross-Site Scripting (XSS)',
    },
    {
      measure: 'X-Frame-Options',
      implementation: 'Set to DENY — prevents the site from being embedded in iframes',
      threat: 'Clickjacking attacks',
    },
    {
      measure: 'X-Content-Type-Options',
      implementation: 'Set to nosniff — prevents MIME-type sniffing',
      threat: 'MIME-type confusion attacks',
    },
    {
      measure: 'Referrer-Policy',
      implementation: 'strict-origin-when-cross-origin — limits referrer data sent to other origins',
      threat: 'Information leakage via referrer headers',
    },
    {
      measure: 'Permissions-Policy',
      implementation: 'Disables camera, microphone, and geolocation APIs',
      threat: 'Unauthorized browser API access',
    },
    {
      measure: 'Private Object Storage',
      implementation: 'Cloudflare R2 bucket configured with no public endpoint',
      threat: 'Direct file enumeration and unauthorized downloads',
    },
    {
      measure: 'Server-Side Password Verification',
      implementation: 'bcrypt hashing with comparison performed entirely on the backend',
      threat: 'Password exposure and client-side bypass',
    },
    {
      measure: 'Rate Limiting',
      implementation: '5 attempts per IP address with 15-minute lockout period',
      threat: 'Brute-force attacks on the CV endpoint',
    },
    {
      measure: 'HTTPS Enforcement',
      implementation: 'Vercel auto-TLS with HSTS headers',
      threat: 'Man-in-the-middle attacks and data interception',
    },
    {
      measure: 'Environment Variable Isolation',
      implementation: 'Secrets stored in Vercel environment variables, never committed to source code',
      threat: 'Secret leakage via repository exposure',
    },
    {
      measure: 'Input Validation',
      implementation: 'Server-side validation of all API request bodies',
      threat: 'Injection attacks and malformed request exploitation',
    },
  ],
  challenges: [
    {
      problem: 'Configuring Cloudflare R2 for private-only access',
      solution:
        'Used service tokens with minimal permissions and verified no public endpoint was exposed. Tested access patterns to confirm objects cannot be enumerated externally.',
    },
    {
      problem: 'Implementing secure file downloads without exposing bucket URLs',
      solution:
        'The API route fetches the file server-side from R2 and streams it directly to the client. No pre-signed URL or bucket path is ever sent to the browser.',
    },
    {
      problem: 'Managing secrets across local development and production',
      solution:
        'Used environment variable separation — .env.local for development, Vercel dashboard for production. Added .env files to .gitignore to prevent accidental commits.',
    },
    {
      problem: 'Preventing brute-force attacks on the CV endpoint',
      solution:
        'Implemented IP-based rate limiting with attempt tracking. After 5 failed attempts, the IP is locked out for 15 minutes. Both server-side enforcement and client-side UX feedback are provided.',
    },
    {
      problem: 'Setting security headers without breaking site functionality',
      solution:
        'Iteratively tested Content Security Policy directives. Started with report-only mode to identify false positives before switching to enforcement mode.',
    },
    {
      problem: 'MIME type issues with CV file download',
      solution:
        'Explicitly set Content-Type to application/pdf and Content-Disposition to attachment with the filename, ensuring browsers handle the download correctly.',
    },
  ],
  lessonsLearned: [
    'Defense in depth — no single security control is sufficient. Layering headers, authentication, rate limiting, and private storage creates meaningful protection.',
    'Threat modeling — thinking about what could go wrong (brute-force, direct access, XSS) before writing code leads to better architecture decisions.',
    'Secrets management — understanding the difference between build-time and runtime environment variables is critical for secure deployments.',
    'Security headers — a simple configuration step that significantly reduces the attack surface of any web application.',
    'Cloud storage security — private buckets with controlled access patterns are applicable far beyond portfolios.',
    'Secure development lifecycle — integrating security considerations from the start rather than bolting them on afterwards produces stronger systems.',
  ],
  futureImprovements: [
    'Download analytics with anomaly detection',
    'CAPTCHA integration for the CV endpoint',
    'Audit logging for all access attempts',
    'Automated dependency vulnerability scanning (Dependabot / Snyk)',
    'CI/CD pipeline with SAST security scanning',
    'Docker containerization with hardened base images',
    'Web Application Firewall (WAF) rules',
    'Subresource Integrity (SRI) for external resources',
  ],
  conclusion:
    'This project evolved beyond a personal portfolio into a practical exercise in secure software engineering. By treating even a simple portfolio as a system worth protecting, I applied defense-in-depth principles, secure cloud storage patterns, and security header hardening — skills directly transferable to enterprise security engineering. It demonstrates that security isn\'t just for large-scale systems; it\'s a mindset that should be applied to every piece of software we build.',
};

/* ─── Section Header Component ─── */

function SectionHeader({
  icon: Icon,
  title,
  number,
}: {
  icon: React.ElementType;
  title: string;
  number: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg">
        <Icon className="w-4 h-4 text-cyan-400" />
      </div>
      <div>
        <span className="text-[10px] font-mono tracking-widest text-neutral-600 uppercase">
          {number}
        </span>
        <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
      </div>
    </div>
  );
}

/* ─── Modal Component ─── */

function CaseStudyModal({
  study,
  isOpen,
  onClose,
}: {
  study: CaseStudy;
  isOpen: boolean;
  onClose: () => void;
}) {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

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
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-lg"
          />

          {/* Modal container */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto my-[5vh] mx-4 bg-[#0c0c0c] border border-neutral-800 rounded-2xl shadow-2xl"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}
          >
            {/* Ambient glow */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Sticky header */}
            <div className="sticky top-0 z-10 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-neutral-900 px-6 md:px-10 py-5 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                  {study.tag}
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1">
                  {study.title}
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[10px] font-mono text-neutral-500">{study.date}</span>
                  <span className="text-[10px] font-mono text-neutral-600">•</span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                    <BookOpen className="w-3 h-3" />
                    <span>{study.readTime}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-neutral-900 shrink-0 mt-1"
                aria-label="Close case study"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="relative px-6 md:px-10 py-8 space-y-12">
              {/* ── 1. Objectives ── */}
              <section>
                <SectionHeader icon={Target} title="Objectives" number="01" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {study.objectives.map((obj, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3.5 bg-neutral-950 border border-neutral-900 rounded-xl"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-neutral-300 leading-relaxed">{obj}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── 2. Tech Stack ── */}
              <section>
                <SectionHeader icon={Layers} title="Tech Stack" number="02" />
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-800">
                        <th className="text-left py-3 px-4 text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                          Technology
                        </th>
                        <th className="text-left py-3 px-4 text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                          Purpose
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {study.techStack.map((item, i) => (
                        <tr
                          key={i}
                          className="border-b border-neutral-900/50 hover:bg-neutral-950 transition-colors"
                        >
                          <td className="py-3 px-4 font-mono text-cyan-400 text-xs">
                            {item.technology}
                          </td>
                          <td className="py-3 px-4 text-neutral-400 text-xs">{item.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ── 3. Architecture ── */}
              <section>
                <SectionHeader icon={Server} title="Architecture" number="03" />
                <div className="flex flex-col items-center gap-0">
                  {study.architecture.map((step, i) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={i} className="flex flex-col items-center w-full max-w-lg">
                        {/* Step card */}
                        <div className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-1.5 bg-neutral-900 border border-neutral-800 rounded-lg">
                              <StepIcon className="w-3.5 h-3.5 text-cyan-400" />
                            </div>
                            <span className="text-sm font-semibold text-white">{step.label}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 ml-9">
                            {step.annotations.map((ann, j) => (
                              <span
                                key={j}
                                className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950/30 border border-cyan-900/30 text-cyan-400/70 rounded-md"
                              >
                                {ann}
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* Arrow connector */}
                        {i < study.architecture.length - 1 && (
                          <div className="flex flex-col items-center py-1">
                            <div className="w-px h-4 bg-neutral-800" />
                            <ChevronDown className="w-4 h-4 text-neutral-700 -my-1" />
                            <div className="w-px h-2 bg-neutral-800" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ── 4. Key Features ── */}
              <section>
                <SectionHeader icon={Layers} title="Key Features" number="04" />
                <div className="space-y-4">
                  {study.features.map((feature, i) => (
                    <div
                      key={i}
                      className={`bg-neutral-950 border rounded-xl p-5 ${
                        feature.highlight
                          ? 'border-cyan-900/40 ring-1 ring-cyan-900/20'
                          : 'border-neutral-900'
                      }`}
                    >
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        {feature.highlight && <Shield className="w-4 h-4 text-cyan-400" />}
                        {feature.title}
                      </h4>
                      {feature.highlight && (
                        <p className="text-neutral-400 text-xs leading-relaxed mb-3 pl-4 border-l-2 border-cyan-900/40 italic">
                          {feature.highlight}
                        </p>
                      )}
                      <ul className="space-y-1.5">
                        {feature.points.map((point, j) => (
                          <li
                            key={j}
                            className="text-neutral-400 text-xs leading-relaxed flex items-start gap-2"
                          >
                            <span className="text-cyan-400/50 mt-1">▸</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── 5. Security Considerations (THE MAIN SECTION) ── */}
              <section>
                <SectionHeader icon={Shield} title="Security Considerations" number="05" />
                <p className="text-neutral-500 text-xs mb-5 font-mono tracking-wide">
                  Each security measure is paired with the specific threat it mitigates.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {study.security.map((item, i) => (
                    <div
                      key={i}
                      className="group bg-neutral-950 border border-neutral-900 hover:border-cyan-900/40 rounded-xl p-4 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        {/* Shield icon */}
                        <div className="p-2 bg-cyan-950/30 border border-cyan-900/30 rounded-lg shrink-0 w-fit">
                          <Shield className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white mb-1">{item.measure}</h4>
                          <p className="text-neutral-400 text-xs leading-relaxed mb-2">
                            {item.implementation}
                          </p>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-950/20 border border-red-900/30 rounded-lg">
                            <AlertTriangle className="w-3 h-3 text-red-400/70" />
                            <span className="text-[10px] font-mono text-red-400/80">
                              Mitigates: {item.threat}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── 6. Challenges & Solutions ── */}
              <section>
                <SectionHeader icon={AlertTriangle} title="Challenges & Solutions" number="06" />
                <div className="space-y-3">
                  {study.challenges.map((item, i) => (
                    <div
                      key={i}
                      className="bg-neutral-950 border border-neutral-900 rounded-xl overflow-hidden"
                    >
                      {/* Problem */}
                      <div className="px-5 py-3 border-b border-neutral-900 flex items-start gap-3">
                        <span className="text-[10px] font-mono text-red-400 bg-red-950/30 px-2 py-0.5 rounded-md border border-red-900/30 shrink-0 mt-0.5">
                          PROBLEM
                        </span>
                        <span className="text-sm text-neutral-300">{item.problem}</span>
                      </div>
                      {/* Solution */}
                      <div className="px-5 py-3 flex items-start gap-3">
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-md border border-emerald-900/30 shrink-0 mt-0.5">
                          SOLUTION
                        </span>
                        <span className="text-sm text-neutral-400 leading-relaxed">
                          {item.solution}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── 7. Lessons Learned ── */}
              <section>
                <SectionHeader icon={Lightbulb} title="Lessons Learned" number="07" />
                <div className="space-y-3">
                  {study.lessonsLearned.map((lesson, i) => {
                    const [bold, ...rest] = lesson.split(' — ');
                    const description = rest.join(' — ');
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 bg-neutral-950 border border-neutral-900 rounded-xl"
                      >
                        <span className="text-lg font-bold font-mono text-neutral-700 shrink-0 w-6 text-right">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-sm text-neutral-300 leading-relaxed">
                          <span className="font-semibold text-white">{bold}</span>
                          {description && ` — ${description}`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ── 8. Future Improvements ── */}
              <section>
                <SectionHeader icon={Rocket} title="Future Improvements" number="08" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {study.futureImprovements.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-3 bg-neutral-950 border border-neutral-900 rounded-xl"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/50 shrink-0" />
                      <span className="text-sm text-neutral-400">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── 9. Conclusion ── */}
              <section>
                <SectionHeader icon={CheckCircle2} title="Conclusion" number="09" />
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
                  <p className="text-neutral-300 text-sm leading-relaxed italic">
                    &ldquo;{study.conclusion}&rdquo;
                  </p>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-900 px-6 md:px-10 py-4 flex items-center justify-between">
              <span className="text-[9px] font-mono text-neutral-600 tracking-widest uppercase">
                Case Study · {study.tag}
              </span>
              <button
                onClick={onClose}
                className="text-[11px] font-mono text-neutral-500 hover:text-white transition-colors tracking-wider uppercase"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Section Component ─── */

export default function CaseStudies() {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  return (
    <>
      <section
        id="case-studies"
        className="pt-16 pb-20 bg-[#090909] px-6 md:px-10 relative overflow-hidden"
      >
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
            <p className="text-neutral-600 text-xs font-mono tracking-wider max-w-xs">
              // Security-focused technical writeups
            </p>
          </motion.div>

          {/* Featured Case Study Card */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={() => setSelectedStudy(CASE_STUDY)}
            className="group relative bg-neutral-950 border border-neutral-900 hover:border-cyan-900/40 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
          >
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/0 to-blue-950/0 group-hover:from-cyan-950/10 group-hover:to-blue-950/5 transition-all duration-500 pointer-events-none" />

            <div className="relative grid md:grid-cols-5 gap-0">
              {/* Left accent panel */}
              <div className="md:col-span-2 bg-gradient-to-br from-cyan-950/40 to-neutral-950 p-7 md:p-9 flex flex-col justify-between min-h-[200px] md:min-h-[280px] relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 20px, white 20px, white 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, white 20px, white 21px)`,
                }} />

                <div className="relative">
                  <div className="p-3 bg-neutral-900/50 border border-cyan-900/30 rounded-xl w-fit mb-4">
                    <Shield className="w-6 h-6 text-cyan-400" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-cyan-400/70 uppercase">
                    {CASE_STUDY.tag}
                  </span>
                </div>

                <div className="relative flex items-center gap-3 mt-4">
                  <span className="text-[10px] font-mono text-neutral-600">{CASE_STUDY.date}</span>
                  <span className="text-neutral-800">•</span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-600">
                    <BookOpen className="w-3 h-3" />
                    <span>{CASE_STUDY.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Right content panel */}
              <div className="md:col-span-3 p-7 md:p-9 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-cyan-50 transition-colors">
                    {CASE_STUDY.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed font-light">
                    {CASE_STUDY.excerpt}
                  </p>

                  {/* Preview tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {['Defense in Depth', 'Cloud Storage', 'Security Headers', 'Rate Limiting', 'bcrypt'].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2.5 py-1 bg-neutral-900/60 border border-neutral-800 text-neutral-500 rounded-md"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  <span className="text-xs font-mono tracking-wider uppercase">
                    Read Case Study
                  </span>
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
