'use client';
import { motion } from 'framer-motion';
import { ExternalLink, Mail } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export default function Footer() {
  return (
    <footer className="relative py-16 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: '#000000' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-xs tracking-[0.4em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono, monospace' }}>
            A. / ONE WANT
          </p>
          <p className="font-bold text-lg" style={{ fontFamily: 'Outfit, sans-serif', color: '#ffffff' }}>
            Ahmad Ali Shah
          </p>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Full-Stack Developer · FAST-NUCES Islamabad
          </p>
        </div>

        <div className="flex items-center gap-4">
          {[
            { href: 'https://github.com/Ahmad-Ali-Shah', icon: <GithubIcon size={16} />, label: 'GitHub' },
            { href: 'https://www.linkedin.com/in/ahmad-ali-shah/', icon: <ExternalLink size={16} />, label: 'LinkedIn' },
            { href: 'mailto:ahmad@onewant.dev', icon: <Mail size={16} />, label: 'Email' },
          ].map(({ href, icon, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-all"
              style={{ color: '#ffffff', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.15)' }}
              whileHover={{ scale: 1.08, color: '#ffffff', borderColor: '#ffffff' }}
              whileTap={{ scale: 0.95 }}
            >
              {icon}
            </motion.a>
          ))}
        </div>

        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono, monospace' }}>
          © {new Date().getFullYear()} · Built with Next.js + Framer Motion
        </p>
      </div>
    </footer>
  );
}
