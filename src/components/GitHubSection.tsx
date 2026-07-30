'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Star, GitFork } from 'lucide-react';

interface Repo { name: string; description: string; stargazers_count: number; forks_count: number; html_url: string; language: string; }

const LANG_CLR: Record<string, string> = {
  TypeScript:'#a855f7', JavaScript:'#f59e0b', Python:'#3572A5',
  'C++':'#ef4444', HTML:'#e34c26', CSS:'#563d7c', C:'#555555',
};

function StarCount({ n, active }: { n: number; active: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active || n === 0) return;
    let frame: number;
    const start = performance.now();
    const dur = 1200;
    const go = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(2, -10 * t);
      setV(Math.round(e * n));
      if (t < 1) frame = requestAnimationFrame(go);
    };
    frame = requestAnimationFrame(go);
    return () => cancelAnimationFrame(frame);
  }, [n, active]);
  return <>{v}</>;
}

export default function GitHubSection() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  useEffect(() => {
    fetch('https://api.github.com/users/Ahmad-Ali-Shah/repos?per_page=100&sort=updated')
      .then(r => r.ok ? r.json() : [])
      .then((data: Repo[]) => {
        if (!Array.isArray(data)) return;
        const stars = data.reduce((s, r) => s + r.stargazers_count, 0);
        setTotal(stars);
        const top = data
          .filter(r => !r.name.startsWith('.') && r.name !== 'Ahmad-Ali-Shah')
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6);
        setRepos(top);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="github" ref={ref} style={{ padding: '8rem 1.5rem', position: 'relative', background: '#000000' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div style={{ textAlign: 'center', marginBottom: '3rem' }}
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.5em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 12 }}>Open Source</p>
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#ffffff', marginBottom: 12, fontFamily: 'Outfit, sans-serif' }}>
            GitHub <span style={{ color: '#ffffff', textDecoration: 'underline' }}>Credibility.</span>
          </h2>
          <a href="https://github.com/Ahmad-Ali-Shah" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            github.com/Ahmad-Ali-Shah <ExternalLink size={12} />
          </a>
        </motion.div>

        {/* Star hero stat */}
        <motion.div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}
          initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.175,0.885,.32,1.275] }}>
          <div style={{ padding: '2rem 3rem', textAlign: 'center', minWidth: 220, background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '1.25rem', boxShadow: '0 20px 60px rgba(0,0,0,0.9)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 6 }}>
              <motion.div animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.25, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                <Star size={30} fill="#f59e0b" style={{ color: '#f59e0b' }} />
              </motion.div>
              <span style={{ fontSize: '3.5rem', fontWeight: 900, color: '#ffffff', lineHeight: 1, fontFamily: 'Outfit, sans-serif' }}>
                <StarCount n={total} active={inView} />
              </span>
            </div>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>total GitHub stars</p>
          </div>
        </motion.div>

        {/* Repo cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1rem' }}>
          {loading
            ? [...Array(6)].map((_,i) => <div key={i} style={{ height: 130, background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }} />)
            : repos.map((r, i) => (
              <motion.a key={r.name} href={r.html_url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', padding: '1.25rem', textDecoration: 'none', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '1rem', transition: 'all 0.25s ease' }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -5, borderColor: '#ffffff', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>{r.name}</span>
                  <ExternalLink size={12} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0, marginLeft: 8 }} />
                </div>
                {r.description && <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: 14, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.description}</p>}
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  {r.language && <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono, monospace' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: LANG_CLR[r.language] || '#6e7681', display: 'inline-block' }} />
                    {r.language}
                  </span>}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono, monospace' }}>
                    <Star size={10} /> <StarCount n={r.stargazers_count} active={inView} />
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono, monospace' }}>
                    <GitFork size={10} /> {r.forks_count}
                  </span>
                </div>
              </motion.a>
            ))
          }
        </div>
      </div>
    </section>
  );
}
