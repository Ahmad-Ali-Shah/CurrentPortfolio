'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const scrollToPct = (pct: number) => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: totalHeight * pct, behavior: 'smooth' });
  };

  const links = [
    { label: 'Intro', pct: 0.05 },
    { label: 'Stack', pct: 0.35 },
    { label: 'GitHub', pct: 0.50 },
    { label: 'Projects', pct: 0.68 },
    { label: 'Contact', pct: 0.92 },
  ];

  return (
    <motion.nav
      className="site-nav"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16,1,.3,1] }}
      style={{
        position: 'fixed', top: '1.2rem', left: '50%', transform: 'translateX(-50%)',
        zIndex: 500, display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '0.5rem 1.4rem',
        background: scrolled ? 'rgba(5, 5, 5, 0.95)' : 'rgba(5, 5, 5, 0.82)',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        borderRadius: '50px', backdropFilter: 'blur(24px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.9)',
      }}
    >
      {/* Custom Binary "A" Logo Badge */}
      <button
        onClick={() => scrollToPct(0)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 7,
          padding: 0, outline: 'none',
        }}
        title="Ahmad Ali Shah Portfolio"
      >
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
          border: '1px solid rgba(255,255,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 900,
          color: '#ffffff', boxShadow: '0 0 10px rgba(255,255,255,0.15)',
        }}>
          A
        </div>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
          letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)', fontWeight: 600,
        }}>
          01000001
        </span>
      </button>

      <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.18)' }} />

      {links.map(({ label, pct }) => (
        <button
          key={label}
          onClick={() => scrollToPct(pct)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem',
            fontWeight: 600, color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
        >
          {label}
        </button>
      ))}
    </motion.nav>
  );
}
