'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Sparkles, Code, Cpu, Activity, Download, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { useVisitor } from '@/contexts/VisitorContext';

const TOTAL_FRAMES = 100;

const GLASS: React.CSSProperties = {
  background: 'rgba(6,6,6,0.92)',
  border: '1px solid rgba(255,255,255,0.18)',
  backdropFilter: 'blur(32px)',
  WebkitBackdropFilter: 'blur(32px)',
  borderRadius: '1.25rem',
  padding: '1.4rem',
  boxShadow: '0 32px 80px rgba(0,0,0,0.95)',
  color: '#ffffff',
};

const GHOST_BTN: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '0.5rem 1.1rem', borderRadius: '0.65rem',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.2)',
  color: '#ffffff', fontSize: '0.78rem', textDecoration: 'none',
  cursor: 'pointer',
};

const SKILLS = [
  { t: 'FRONTEND', s: ['React 18', 'Next.js 16', 'TypeScript', 'Framer Motion', 'GSAP', 'Tailwind'] },
  { t: 'BACKEND', s: ['Node.js', 'Supabase', 'PostgreSQL', 'REST APIs', 'Edge Functions'] },
  { t: 'SYSTEMS', s: ['C++', 'SFML', 'OOP', 'NEAT AI', 'FFT / DSP', 'Perlin Noise'] },
  { t: 'TOOLS', s: ['Git', 'Vercel', 'Python', 'scikit-learn', 'LaTeX', 'Docker'] },
];

const FULL_SQL = `-- Two-Factor Auth & Edge Architecture
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE public.engineers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL DEFAULT 'Ahmad Ali Shah',
  institution TEXT NOT NULL DEFAULT 'FAST-NUCES',
  specialty   TEXT NOT NULL DEFAULT 'Full-Stack & C++',
  totp_2fa    BOOLEAN DEFAULT TRUE
);`;

function NamePrompt({ onSubmit }: { onSubmit: (n: string) => void }) {
  const [val, setVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 200); }, []);
  const go = () => { if (val.trim()) onSubmit(val.trim()); };

  return (
    <motion.div
      className="name-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="name-card"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.45em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 14 }}>
          AHMAD ALI SHAH · PORTFOLIO
        </p>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>
          Welcome. Your name?
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginBottom: 22 }}>
          I&apos;ll personalise your experience.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            ref={inputRef}
            className="name-input"
            placeholder="Type your name…"
            value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && go()}
            maxLength={32}
            style={{ flex: 1 }}
          />
          <button
            onClick={go}
            className="btn-primary"
            style={{ opacity: val.trim() ? 1 : 0.35, flexShrink: 0 }}
          >
            Enter →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HeroIntro() {
  const { visitorName, nameSubmitted, submitName } = useVisitor();
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptDone, setPromptDone] = useState(false);
  
  const [progress, setProgress] = useState(0);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const progressRef = useRef(0);
  const smoothProgressRef = useRef(0);

  const [fbForm, setFbForm] = useState({ name: '', email: '', message: '' });
  const [fbStatus, setFbStatus] = useState<'idle'|'loading'|'ok'|'err'>('idle');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));

  const handleName = useCallback((n: string) => {
    submitName(n);
    setShowPrompt(false);
    setPromptDone(true);
  }, [submitName]);

  // Window scroll handler
  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = Math.max(0, window.scrollY);
      const p = maxScroll > 0 ? Math.min(1, scrolled / maxScroll) : 0;
      progressRef.current = p;
      setProgress(p);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Preload frames
  useEffect(() => {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const idx = i;
      img.onload = () => {
        loadedRef.current[idx] = true;
        imagesRef.current[idx] = img;
      };
      img.src = `/assets/hero-frames/frame_${String(i + 1).padStart(3, '0')}.jpg`;
    }
  }, []);

  // Continuous 60fps render loop with ultra-smooth lerp inertia
  useEffect(() => {
    let animId: number;

    const renderLoop = () => {
      // Lerp smooth scroll physics (0.08 factor for silky inertia)
      smoothProgressRef.current += (progressRef.current - smoothProgressRef.current) * 0.08;
      const p = smoothProgressRef.current;
      setSmoothProgress(p);

      const c = canvasRef.current;
      if (c) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        if (c.width !== vw || c.height !== vh) {
          c.width = vw;
          c.height = vh;
        }

        const ctx = c.getContext('2d');
        if (ctx) {
          const targetIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(p * TOTAL_FRAMES)));

          let imgToDraw: HTMLImageElement | null = null;
          if (loadedRef.current[targetIdx] && imagesRef.current[targetIdx]) {
            imgToDraw = imagesRef.current[targetIdx];
          } else {
            for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
              const prev = targetIdx - offset;
              const next = targetIdx + offset;
              if (prev >= 0 && loadedRef.current[prev] && imagesRef.current[prev]) {
                imgToDraw = imagesRef.current[prev];
                break;
              }
              if (next < TOTAL_FRAMES && loadedRef.current[next] && imagesRef.current[next]) {
                imgToDraw = imagesRef.current[next];
                break;
              }
            }
          }

          if (imgToDraw && imgToDraw.complete && imgToDraw.naturalWidth > 0) {
            const cw = c.width, ch = c.height;
            const iw = imgToDraw.naturalWidth, ih = imgToDraw.naturalHeight;
            const sc = Math.max(cw / iw, ch / ih);
            const nw = iw * sc, nh = ih * sc;
            ctx.drawImage(imgToDraw, (cw - nw) / 2, (ch - nh) / 2, nw, nh);
          }
        }
      }
      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowPrompt(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbForm.message.trim()) return;
    setFbStatus('loading');
    try {
      const r = await fetch('/api/feedback', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(fbForm) });
      if (!r.ok) throw new Error();
      setFbStatus('ok'); setFbForm({ name:'', email:'', message:'' });
    } catch { setFbStatus('err'); }
  };

  const p = smoothProgress;

  const fade = (lo: number, hi: number) => {
    if (p <= lo || p >= hi) return 0;
    const F = 0.04;
    if (p < lo + F) return (p - lo) / F;
    if (p > hi - F) return (hi - p) / F;
    return 1;
  };

  const opTitle  = fade(0.00, 0.15); // Beat 1: Clouds -> Title
  const opWalk   = fade(0.13, 0.28); // Beat 2: Walking -> Welcome
  const opSkills = fade(0.26, 0.44); // Beat 3: Rubbing hands -> Live SQL & Stack
  const opGithub = fade(0.42, 0.58); // Beat 4: Dolly -> GitHub Stats
  const opP1P2   = fade(0.56, 0.72); // Beat 5: Looking Left -> Projects 1 & 2
  const opP3     = fade(0.70, 0.84); // Beat 6: Looking Right -> Project 3
  const opSalute = p >= 0.82 ? Math.min(1, (p - 0.82) / 0.08) : 0; // Beat 7: Salute -> Project 4 + Feedback

  // Real-time SQL typing calculation as user scrolls through Beat 3
  const sqlCharCount = Math.floor(Math.min(1, Math.max(0, (p - 0.26) / 0.14)) * FULL_SQL.length);
  const visibleSql = FULL_SQL.slice(0, Math.max(20, sqlCharCount));

  const mono = 'JetBrains Mono, monospace';
  const outfit = 'Outfit, sans-serif';

  return (
    <>
      <AnimatePresence>
        {showPrompt && !promptDone && <NamePrompt key="np" onSubmit={handleName} />}
      </AnimatePresence>

      <div id="hero" style={{ height: '1000vh', width: '100%', position: 'relative', background: '#000' }}>
        <div style={{
          position: 'fixed', top: 0, left: 0,
          height: '100vh', width: '100vw',
          overflow: 'hidden', background: '#000',
          zIndex: 1, pointerEvents: 'none',
        }}>
          {/* Fallback frame 1 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/hero-frames/frame_001.jpg"
            alt="Hero frame"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', zIndex: 0,
            }}
          />

          {/* Canvas video scrub */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              zIndex: 1, display: 'block',
            }}
          />

          {/* Vignette edge */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.35) 100%)',
          }} />

          {/* BEAT 1: Title (0-15%) */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            pointerEvents: 'none', opacity: opTitle, transition: 'opacity 0.08s linear',
          }}>
            <h1 style={{
              fontFamily: outfit, fontWeight: 900,
              fontSize: 'clamp(3rem, 9vw, 6.5rem)', color: '#ffffff', margin: 0,
              textShadow: '0 2px 60px rgba(0,0,0,0.98)', letterSpacing: '-0.01em',
            }}>
              AHMAD ALI SHAH
            </h1>
            <p style={{
              fontFamily: mono, fontSize: '11px',
              letterSpacing: '0.45em', color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase', marginTop: 16,
            }}>
              Full-Stack &amp; Systems Architect · FAST-NUCES
            </p>
            <p style={{
              fontFamily: mono, fontSize: '10px',
              color: 'rgba(255,255,255,0.35)', marginTop: 28, letterSpacing: '0.15em',
            }}>
              Scroll down to explore
            </p>
          </div>

          {/* BEAT 2: Walk (13-28%) — Positioned clean top center */}
          <div style={{
            position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)',
            zIndex: 10, width: '90%', maxWidth: '800px', textAlign: 'center',
            pointerEvents: 'none', opacity: opWalk, transition: 'opacity 0.08s linear',
          }}>
            {nameSubmitted && (
              <p style={{
                fontFamily: mono, fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.7)', marginBottom: 8, letterSpacing: '0.04em',
              }}>
                ↳ Welcome, {visitorName}.
              </p>
            )}
            <h2 style={{
              fontFamily: outfit, fontWeight: 800,
              fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', color: '#ffffff',
              textShadow: '0 2px 40px rgba(0,0,0,0.98)', lineHeight: 1.2, margin: 0,
            }}>
              Scroll to reveal engineering stack and live project demonstrations
            </h2>
          </div>

          {/* BEAT 3: Rubbing Hands -> Real-Time Streaming SQL Code & Stack (26-44%) */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4%',
            opacity: opSkills, transition: 'opacity 0.08s linear',
            pointerEvents: opSkills > 0.3 ? 'auto' : 'none',
          }}>
            {/* Live Streaming SQL Code Terminal (LEFT SIDE) */}
            <div style={{ ...GLASS, width: '420px', maxWidth: '45%', padding: '1.2rem', fontFamily: mono, fontSize: '0.74rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginLeft: 6 }}>system-architecture.sql</span>
              </div>
              <pre style={{ margin: 0, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5, overflowX: 'auto', minHeight: '160px' }}>
                {visibleSql}
                <span className="cursor-blink" style={{ color: '#4ade80' }}> █</span>
              </pre>
            </div>

            {/* Stack Categories (RIGHT SIDE) */}
            <div style={{ width: '400px', maxWidth: '45%', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <p style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', margin: 0 }}>STACK &amp; ARCHITECTURE</p>
              <h3 style={{ fontFamily: outfit, fontWeight: 800, fontSize: '1.6rem', color: '#fff', margin: 0 }}>What I build with</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                {SKILLS.map(cat => (
                  <div key={cat.t} style={{ ...GLASS, padding: '0.75rem' }}>
                    <p style={{ fontFamily: mono, fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{cat.t}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {cat.s.map(s => <span key={s} style={{ fontSize: '9px', padding: '2px 5px', borderRadius: 4, background: 'rgba(255,255,255,0.1)', color: '#fff' }}>{s}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BEAT 4: Forward Dolly -> GitHub Stats (42-58%) — Positioned Bottom Center */}
          <div style={{
            position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, maxWidth: '620px', width: '90%',
            opacity: opGithub, transition: 'opacity 0.08s linear',
            pointerEvents: opGithub > 0.3 ? 'auto' : 'none',
          }}>
            <div style={{ ...GLASS, textAlign: 'center', padding: '1.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                <GithubIcon size={16} />
                <span style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>OPEN SOURCE CREDIBILITY</span>
              </div>
              <h3 style={{ fontFamily: outfit, fontWeight: 800, fontSize: '1.6rem', color: '#fff', marginBottom: 12 }}>GitHub Activity &amp; Repos</h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.65rem', padding: '0.8rem' }}>
                  <p style={{ fontFamily: outfit, fontWeight: 900, fontSize: '1.5rem', color: '#fff', margin: 0 }}>4</p>
                  <p style={{ fontFamily: mono, fontSize: '9px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Featured Repos</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.65rem', padding: '0.8rem' }}>
                  <p style={{ fontFamily: outfit, fontWeight: 900, fontSize: '1.5rem', color: '#fff', margin: 0 }}>100%</p>
                  <p style={{ fontFamily: mono, fontSize: '9px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Open Source</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.65rem', padding: '0.8rem' }}>
                  <p style={{ fontFamily: outfit, fontWeight: 900, fontSize: '1.5rem', color: '#fff', margin: 0 }}>C++ / TS</p>
                  <p style={{ fontFamily: mono, fontSize: '9px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Primary Stack</p>
                </div>
              </div>

              <a href="https://github.com/Ahmad-Ali-Shah" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1.2rem' }}>
                <GithubIcon size={14} /> Visit @Ahmad-Ali-Shah on GitHub
              </a>
            </div>
          </div>

          {/* BEAT 5: Eyes LEFT -> Projects 01 & 02 (56-72%) — Positioned FAR LEFT */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '4%',
            opacity: opP1P2, transition: 'opacity 0.08s linear',
            pointerEvents: opP1P2 > 0.3 ? 'auto' : 'none',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '420px', width: '90%' }}>
              <div style={GLASS}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Sparkles size={14} color="#f59e0b" />
                  <span style={{ fontFamily: mono, fontSize: '10px', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Project 01 · Flagship</span>
                </div>
                <h3 style={{ fontFamily: outfit, fontWeight: 800, fontSize: '1.25rem', color: '#fff', marginBottom: 6 }}>Zero-G Cheeseburger</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 12 }}>201-frame HTML5 Canvas scroll-scrubbing with Lenis inertia and ASCII torch lens scanner.</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href="https://burger-shop-scrolling-effect.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.9rem' }}><ExternalLink size={12}/> Live Demo</a>
                  <a href="https://github.com/Ahmad-Ali-Shah/BurgerShopScrollingEffect" target="_blank" rel="noopener noreferrer" style={GHOST_BTN}><GithubIcon size={12}/> Code</a>
                </div>
              </div>

              <div style={GLASS}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Code size={14} color="#c084fc" />
                  <span style={{ fontFamily: mono, fontSize: '10px', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Project 02 · Horology</span>
                </div>
                <h3 style={{ fontFamily: outfit, fontWeight: 800, fontSize: '1.25rem', color: '#fff', marginBottom: 6 }}>Calibre 04 Watch</h3>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 12 }}>81-frame 3D exploded watch movement with step-indexed mechanism breakdown.</p>
                <a href="https://watch-parallex-ruby.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.9rem' }}><ExternalLink size={12}/> Live Demo</a>
              </div>
            </div>
          </div>

          {/* BEAT 6: Eyes RIGHT -> Project 03 (70-84%) — Positioned FAR RIGHT */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '4%',
            opacity: opP3, transition: 'opacity 0.08s linear',
            pointerEvents: opP3 > 0.3 ? 'auto' : 'none',
          }}>
            <div style={{ ...GLASS, maxWidth: '420px', width: '90%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Cpu size={14} color="#f87171" />
                <span style={{ fontFamily: mono, fontSize: '10px', color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Project 03 · C++ SFML</span>
              </div>
              <h3 style={{ fontFamily: outfit, fontWeight: 800, fontSize: '1.35rem', color: '#fff', marginBottom: 8 }}>Metal Slug Engine</h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 14 }}>Custom 2D game engine in C++. Perlin Noise terrain, NEAT neural-net AI, FFT voice-launch trigger.</p>
              <a href="https://github.com/Ahmad-Ali-Shah/Metal-Slug" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.78rem', padding: '0.5rem 1.1rem' }}>
                <GithubIcon size={12}/> GitHub Repository
              </a>
            </div>
          </div>

          {/* BEAT 7: Salute -> Project 04 & Feedback Form (82-100%) */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4%',
            opacity: opSalute, transition: 'opacity 0.08s linear',
            pointerEvents: opSalute > 0.3 ? 'auto' : 'none',
          }}>
            <div style={{ width: '100%', maxWidth: '880px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
              <div style={GLASS}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Activity size={14} color="#4ade80" />
                  <span style={{ fontFamily: mono, fontSize: '10px', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Project 04 · Calculus</span>
                </div>
                <h3 style={{ fontFamily: outfit, fontWeight: 800, fontSize: '1.35rem', color: '#fff', marginBottom: 8 }}>Solar Energy Optimization</h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: 14 }}>Photovoltaic multi-linear regression model (R²=0.9617). Gradient vectors &amp; triple-integral evaluation.</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <a href="https://github.com/Ahmad-Ali-Shah/Solar-Energy-Optimization" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.9rem' }}><GithubIcon size={12}/> GitHub</a>
                  <a href="/assets/solar-energy-optimization-report.pdf" target="_blank" rel="noopener noreferrer" style={GHOST_BTN}><Download size={12}/> PDF Report</a>
                </div>
              </div>

              <div style={GLASS}>
                <p style={{ fontFamily: mono, fontSize: '10px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 4 }}>DIRECT FEEDBACK</p>
                <h3 style={{ fontFamily: outfit, fontWeight: 800, fontSize: '1.25rem', color: '#fff', marginBottom: 10 }}>Leave a message</h3>
                <form onSubmit={submitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input className="form-field" style={{ fontSize: '0.78rem', padding: '0.45rem 0.75rem' }} placeholder="Your name" value={fbForm.name} onChange={e=>setFbForm(f=>({...f,name:e.target.value}))}/>
                  <input className="form-field" style={{ fontSize: '0.78rem', padding: '0.45rem 0.75rem' }} type="email" placeholder="you@email.com" value={fbForm.email} onChange={e=>setFbForm(f=>({...f,email:e.target.value}))}/>
                  <textarea className="form-field" style={{ fontSize: '0.78rem', padding: '0.45rem 0.75rem' }} rows={3} placeholder="Share your thoughts…" value={fbForm.message} onChange={e=>setFbForm(f=>({...f,message:e.target.value}))} required/>
                  {fbStatus==='ok' && <div style={{ display:'flex',alignItems:'center',gap:6,color:'#4ade80',fontSize:'0.75rem' }}><CheckCircle size={12}/> Message sent to Ahmad.</div>}
                  {fbStatus==='err' && <div style={{ display:'flex',alignItems:'center',gap:6,color:'#f87171',fontSize:'0.75rem' }}><AlertCircle size={12}/> Error sending. Try again.</div>}
                  <button type="submit" className="btn-primary" disabled={fbStatus==='loading'||!fbForm.message.trim()} style={{ opacity:(fbStatus==='loading'||!fbForm.message.trim())?0.4:1, fontSize:'0.75rem', padding:'0.45rem' }}>
                    {fbStatus==='loading'?<><Loader2 size={12} className="animate-spin"/> Sending…</>:<><Send size={12}/> Send Message</>}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, height: 2, zIndex: 30, width: `${progress * 100}%`, background: '#fff', boxShadow: '0 0 8px rgba(255,255,255,0.6)', transition: 'width 0.04s linear' }} />

          {/* Frame counter */}
          <div style={{ position: 'absolute', bottom: 12, right: 14, zIndex: 40, fontFamily: mono, fontSize: '9px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em', pointerEvents: 'none' }}>
            {String(Math.min(TOTAL_FRAMES, Math.floor(progress * TOTAL_FRAMES) + 1)).padStart(3,'0')} / {TOTAL_FRAMES}
          </div>
        </div>
      </div>
    </>
  );
}
