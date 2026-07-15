'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, ShieldCheck, Lock, Loader2 } from 'lucide-react';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiError {
  error: string;
  attemptsLeft?: number;
  locked?: boolean;
  retryAfterSeconds?: number;
}

export default function CVModal({ isOpen, onClose }: CVModalProps) {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'locked'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // localStorage: cosmetic only — shows instant UI feedback.
  // Server is the real enforcement boundary.
  const getLocalLockout = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const v = localStorage.getItem('cv_lockout_until');
    if (!v) return null;
    const t = parseInt(v, 10);
    return t > Date.now() ? t : null;
  }, []);

  const setLocalLockout = (seconds: number) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cv_lockout_until', String(Date.now() + seconds * 1000));
  };

  // Live countdown timer for locked state
  useEffect(() => {
    if (status !== 'locked') return;
    const tick = setInterval(() => {
      const lockUntil = getLocalLockout();
      if (!lockUntil) {
        setStatus('idle');
        setCountdown(0);
        clearInterval(tick);
      } else {
        setCountdown(Math.ceil((lockUntil - Date.now()) / 1000));
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [status, getLocalLockout]);

  // On open: check for existing local lockout, reset form
  useEffect(() => {
    if (!isOpen) return;
    const lockUntil = getLocalLockout();
    if (lockUntil) {
      setStatus('locked');
      setCountdown(Math.ceil((lockUntil - Date.now()) / 1000));
    } else {
      setStatus('idle');
      setErrorMsg('');
      setAttemptsLeft(null);
    }
    setPassword('');
    setTimeout(() => inputRef.current?.focus(), 120);
  }, [isOpen, getLocalLockout]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading' || status === 'success') return;

    // Cosmetic local lockout check (user-friendly UX, not real enforcement)
    if (status === 'locked' || getLocalLockout()) {
      triggerShake();
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Please enter the access code.');
      triggerShake();
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // ✅ Success — receive blob and download
        setStatus('success');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Thenula_Dewanmith_CV.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setTimeout(onClose, 1800);
        return;
      }

      // ❌ Error responses
      const data: ApiError = await res.json().catch(() => ({ error: 'Unknown error.' }));

      if (res.status === 429) {
        // Server locked out this IP
        const secs = data.retryAfterSeconds ?? 900;
        setLocalLockout(secs);
        setCountdown(secs);
        setStatus('locked');
        setErrorMsg(`Access locked. Too many failed attempts.`);
        triggerShake();
        return;
      }

      if (res.status === 401) {
        const left = data.attemptsLeft ?? null;
        setAttemptsLeft(left);
        if (data.locked) {
          const secs = data.retryAfterSeconds ?? 900;
          setLocalLockout(secs);
          setCountdown(secs);
          setStatus('locked');
          setErrorMsg(`Access locked. Try again in 15 minutes.`);
        } else {
          setStatus('error');
          setErrorMsg(
            left !== null && left > 0
              ? `Incorrect passcode. ${left} attempt${left === 1 ? '' : 's'} remaining.`
              : 'Incorrect passcode.'
          );
        }
        setPassword('');
        triggerShake();
        inputRef.current?.focus();
        return;
      }

      setStatus('error');
      setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
      triggerShake();
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection.');
      triggerShake();
    }
  };

  const isDisabled = status === 'loading' || status === 'success' || status === 'locked';

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-lg"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: shake ? [-8, 8, -6, 6, -3, 3, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', duration: 0.4, bounce: shake ? 0 : 0.15 }}
            className="relative w-full max-w-sm bg-[#0b101a] border border-[#212634] rounded-2xl p-7 shadow-2xl overflow-hidden"
          >
            {/* Ambient glow */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#161b28] border border-[#212634] rounded-xl">
                  {status === 'success' ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ) : status === 'locked' ? (
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-lime-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white tracking-wide">Recruiter Access</h2>
                  <p className="text-[11px] text-[#6b7d8f] mt-0.5">Enter the access code to unlock resume</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-[#4a5568] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#161b28]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative space-y-4">
              <div>
                <label htmlFor="cv-password" className="block text-[10px] font-mono tracking-widest uppercase text-[#6b7d8f] mb-2">
                  Access Code
                </label>
                <input
                  ref={inputRef}
                  id="cv-password"
                  type="password"
                  disabled={isDisabled}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (status === 'error') setStatus('idle'); }}
                  placeholder="••••••••"
                  autoComplete="off"
                  className="w-full bg-[#111] border border-[#212634] focus:border-lime-400/60 rounded-xl px-4 py-3 text-white placeholder-neutral-700 focus:outline-none focus:ring-1 focus:ring-lime-400/20 transition-all text-center tracking-widest font-mono text-sm disabled:opacity-40"
                />
              </div>

              {/* Error/Locked/Success messages */}
              <AnimatePresence mode="wait">
                {(status === 'error' || status === 'locked') && errorMsg && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2 p-3 bg-red-950/30 border border-red-900/40 rounded-xl text-red-400 text-xs"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <div>
                      <span>{errorMsg}</span>
                      {status === 'locked' && countdown > 0 && (
                        <span className="block text-red-500 font-mono mt-1">
                          Retry in {formatCountdown(countdown)}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}

                {status === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-emerald-950/30 border border-emerald-900/40 rounded-xl text-emerald-400 text-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>Authenticated. Downloading CV…</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isDisabled}
                className="w-full bg-white hover:bg-neutral-100 text-black font-semibold py-3 rounded-xl transition-all duration-200 text-xs tracking-widest uppercase font-mono flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              >
                {status === 'loading' ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Verifying…</span></>
                ) : status === 'success' ? (
                  <><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /><span>Unlocked</span></>
                ) : (
                  <span>Authenticate</span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="relative mt-5 pt-4 border-t border-[#1a1f2e] flex justify-between items-center">
              <span className="text-[9px] font-mono text-[#4a5568] uppercase tracking-widest">
                SHA-256 · Server-Verified
              </span>
              {attemptsLeft !== null && status !== 'locked' && (
                <span className="text-[9px] font-mono text-[#4a5568]">
                  {attemptsLeft}/5 remaining
                </span>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
