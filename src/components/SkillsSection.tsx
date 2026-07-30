'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const CATEGORIES = [
  {
    title: 'FRONTEND',
    skills: ['React 18', 'Next.js 16', 'TypeScript', 'Framer Motion', 'GSAP', 'Tailwind'],
  },
  {
    title: 'BACKEND',
    skills: ['Node.js', 'Supabase', 'PostgreSQL', 'REST APIs', 'Edge Functions'],
  },
  {
    title: 'SYSTEMS',
    skills: ['C++', 'SFML', 'OOP', 'NEAT AI', 'FFT / DSP', 'Perlin Noise'],
  },
  {
    title: 'TOOLS & DEVOPS',
    skills: ['Git', 'Vercel', 'Python', 'scikit-learn', 'LaTeX', 'Docker'],
  },
];

const SQL_SNIPPET = `-- Two-Factor Auth Schema · Ahmad Ali Shah

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE public.users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        VARCHAR(255) UNIQUE NOT NULL,
  totp_secret  TEXT,
  totp_enabled BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);`;

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <section id="skills" style={{ padding: '8rem 1.5rem', position: 'relative', background: '#000000' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Section Header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.5em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 12 }}>
            STACK &amp; ARCHITECTURE
          </p>
          <h2 style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 900, color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>
            What I build <span style={{ color: '#ffffff', textDecoration: 'underline' }}>with.</span>
          </h2>
        </motion.div>

        {/* 2-Column Grid: Left Terminal, Right Skill Category Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>

          {/* LEFT: SQL Code Terminal Block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: '#0a0a0a',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
            }}
          >
            {/* Terminal Top Window Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
              <span style={{ marginLeft: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Terminal size={12} /> auth-schema.sql
              </span>
            </div>

            {/* Terminal Body Code */}
            <pre style={{
              padding: '1.5rem',
              margin: 0,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              color: '#e2e8f0',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              <code>{SQL_SNIPPET}</code>
            </pre>
          </motion.div>

          {/* RIGHT: Skill Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {CATEGORIES.map((cat, idx) => {
              const isHovered = activeCategory === cat.title;
              return (
                <motion.div
                  key={cat.title}
                  onMouseEnter={() => setActiveCategory(cat.title)}
                  onMouseLeave={() => setActiveCategory(null)}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  style={{
                    background: '#0a0a0a',
                    border: isHovered ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '1.25rem',
                    padding: '1.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: isHovered ? '0 10px 40px rgba(0,0,0,0.8)' : '0 4px 20px rgba(0,0,0,0.5)',
                  }}
                >
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(255, 255, 255, 0.7)', marginBottom: 12 }}>
                    {cat.title}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {cat.skills.map((skill) => (
                      <span key={skill} className="skill-badge">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
