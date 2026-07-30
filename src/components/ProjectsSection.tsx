'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronLeft, ChevronRight, Download, AlertTriangle } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import dynamic from 'next/dynamic';

const SolarWidget = dynamic(() => import('./SolarWidget'), { ssr: false });

const TABS = ['ascii-burger', 'watch-parallax', 'metal-slug', 'solar'] as const;
type Tab = typeof TABS[number];

const TAB_LABELS: Record<Tab, string> = {
  'ascii-burger': 'Zero-G Cheeseburger',
  'watch-parallax': 'Calibre 04',
  'metal-slug': 'Metal Slug',
  'solar': 'Solar Optimization',
};

// ── Image carousel for Metal Slug ────────────────────────────────
function Carousel({ images }: { images: { src: string; caption: string }[] }) {
  const [idx, setIdx] = useState(0);
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="project-screenshot"
        >
          <Image src={images[idx].src} alt={images[idx].caption} width={640} height={360} className="w-full h-auto" />
          <p className="text-xs px-3 py-2" style={{ color: 'rgba(226,232,240,0.4)', fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,0,0,0.4)' }}>
            {images[idx].caption}
          </p>
        </motion.div>
      </AnimatePresence>
      {images.length > 1 && (
        <div className="flex items-center justify-between mt-3">
          <button onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)} className="glass-sm p-2 hover:opacity-100 opacity-60 transition-opacity">
            <ChevronLeft size={16} style={{ color: '#e2e8f0' }} />
          </button>
          <div className="flex gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === idx ? 'hsl(220,80%,65%)' : 'rgba(226,232,240,0.2)' }}
              />
            ))}
          </div>
          <button onClick={() => setIdx((i) => (i + 1) % images.length)} className="glass-sm p-2 hover:opacity-100 opacity-60 transition-opacity">
            <ChevronRight size={16} style={{ color: '#e2e8f0' }} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Link buttons ──────────────────────────────────────────────────
function LinkBtn({ href, icon, label, placeholder }: { href?: string; icon: React.ReactNode; label: string; placeholder?: boolean }) {
  if (placeholder) {
    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm opacity-40" style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(226,232,240,0.5)', fontFamily: 'Outfit, sans-serif' }}>
        <AlertTriangle size={13} /> {label} (TBC)
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="btn-primary inline-flex items-center gap-2 text-sm px-4 py-2"
      style={{ fontSize: '0.8rem' }}
    >
      {icon} {label}
    </a>
  );
}

// ── Tab contents ──────────────────────────────────────────────────
function AsciiBurger() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Carousel images={[
          { src: '/assets/ascii-burger-hero.png', caption: 'Canvas frame-scrub hero — Frame 001/201 · Dark sci-fi HUD' },
          { src: '/assets/ascii-burger-scanner.png', caption: 'Interactive ASCII reveal scanner · Drag torch to reveal' },
        ]} />
      </div>
      <div className="space-y-5">
        <div>
          <span className="skill-badge mb-3 inline-block">🏆 Flagship Project</span>
          <h3 className="text-2xl font-black mb-3" style={{ fontFamily: 'Outfit, sans-serif', color: '#e2e8f0' }}>
            Zero-G Cheeseburger
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(226,232,240,0.55)' }}>
            A cinematic single-page experience built with <strong style={{ color: '#e2e8f0' }}>React, TypeScript, and Framer Motion</strong>. Scroll-driven storytelling using HTML5 Canvas frame scrubbing (201 frames), smooth inertial scrolling via Lenis, and an interactive ASCII renderer — drag a &quot;torch&quot; lens to reveal photorealistic layers under dense ASCII art.
          </p>
        </div>
        <div className="space-y-2">
          {['Scroll-driven cinematic storytelling', 'HTML5 Canvas frame scrubbing (201 frames)', 'Interactive ASCII reveal scanner with lens control', 'Depth, parallax &amp; particle effects', 'Built with React 18 + Vite + Tailwind'].map((b) => (
            <div key={b} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(226,232,240,0.6)' }}>
              <span style={{ color: 'hsl(220,80%,65%)', marginTop: '2px' }}>✦</span>
              <span dangerouslySetInnerHTML={{ __html: b }} />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <LinkBtn href="https://burger-shop-scrolling-effect.vercel.app/" icon={<ExternalLink size={13} />} label="Live Demo" />
          <LinkBtn href="https://github.com/Ahmad-Ali-Shah/BurgerShopScrollingEffect" icon={<GithubIcon size={13} />} label="GitHub" />
        </div>
      </div>
    </div>
  );
}

function WatchParallax() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="project-screenshot">
        <Image src="/assets/watch-parallax-hero.png" alt="Calibre 04 watch parallax site" width={640} height={360} className="w-full h-auto" />
        <p className="text-xs px-3 py-2" style={{ color: 'rgba(226,232,240,0.4)', fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,0,0,0.4)' }}>
          CALIBRE 04 · Frame 017/081 · Editorial luxury microsite
        </p>
      </div>
      <div className="space-y-5">
        <div>
          <h3 className="text-2xl font-black mb-3" style={{ fontFamily: 'Outfit, sans-serif', color: '#e2e8f0' }}>
            Calibre 04
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(226,232,240,0.55)' }}>
            A minimal, editorial-style luxury watch microsite. Scroll through 81 frames of an exploded/deconstructed 3D watch assembly, synchronized to a numbered step index (Case & Crystal → Escapement → Dial & Hands → Unified Calibre). Transport controls: Auto Play, Mute, Reset.
          </p>
          <p className="text-sm mt-3" style={{ color: 'rgba(226,232,240,0.4)' }}>
            Same frame-scrubbing technique as Zero-G Cheeseburger — but applied to a completely different visual register: <em>minimal and editorial</em> vs. dark sci-fi HUD. Evidence of range.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <LinkBtn href="https://watch-parallex-ruby.vercel.app/" icon={<ExternalLink size={13} />} label="Live Demo" />
          <LinkBtn icon={<GithubIcon size={13} />} label="GitHub Repo" placeholder />
        </div>
        <p className="text-xs" style={{ color: 'rgba(226,232,240,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>
          ⚠ GitHub repo URL unconfirmed — confirm with Ahmad before publishing.
        </p>
      </div>
    </div>
  );
}

function MetalSlug() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Carousel images={[
          { src: '/assets/metal-slug-main-menu.png', caption: 'Main menu — terminal-style character select' },
          { src: '/assets/metal-slug-gameplay.png', caption: 'Live gameplay — pixel-art run-and-gun, procedural world' },
          { src: '/assets/metal-slug-leaderboard.png', caption: 'In-game leaderboard — blueprint style' },
        ]} />
      </div>
      <div className="space-y-5">
        <div>
          <span className="skill-badge mb-3 inline-block">👾 Ahmad&apos;s GOAT Project</span>
          <h3 className="text-2xl font-black mb-3" style={{ fontFamily: 'Outfit, sans-serif', color: '#e2e8f0' }}>
            Metal Slug — C++/SFML
          </h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(226,232,240,0.55)' }}>
            Fully playable 2D run-and-gun shooter built <strong style={{ color: '#e2e8f0' }}>from scratch</strong> in C++ and SFML — zero game engine, no STL containers. Built for CS-1004 OOP at FAST-NUCES.
          </p>
        </div>
        <div className="space-y-2">
          {[
            'Infinite world via Fractal Brownian Motion / Perlin noise — 1M+ block range',
            'NEAT self-playing AI — neural nets evolving from zero hidden neurons via crossover + speciation',
            'Voice launch via FFT — speak "Valar Morghulis" to start the game (cosine similarity, 150–3500 Hz)',
            '4 playable characters, 5-phase boss, FusionBoss via multiple inheritance',
            'Custom Urdu Assembly REPL — live variable injection at runtime',
          ].map((b) => (
            <div key={b} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(226,232,240,0.6)' }}>
              <span style={{ color: 'hsl(0,70%,65%)', marginTop: '2px', flexShrink: 0 }}>✦</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <LinkBtn href="https://github.com/Ahmad-Ali-Shah/Metal-Slug" icon={<GithubIcon size={13} />} label="GitHub" />
          <LinkBtn href="https://www.linkedin.com/feed/update/urn:li:ugcPost:7468924850372390914/" icon={<ExternalLink size={13} />} label="Demo Video" />
        </div>
        <p className="text-xs pt-1" style={{ color: 'rgba(226,232,240,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>
          Team: Muhammad Osaid Zahid (Group Leader) · Ahmad Ali Shah (Developer)<br />
          Instructor: Shehreyar Rashid · CS-1004 OOP · FAST-NUCES
        </p>
      </div>
    </div>
  );
}

function Solar() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-5">
        <div>
          <h3 className="text-2xl font-black mb-3" style={{ fontFamily: 'Outfit, sans-serif', color: '#e2e8f0' }}>
            Solar Energy Optimization
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(226,232,240,0.55)' }}>
            MT1008 Multivariable Calculus project at FAST-NUCES. Models photovoltaic power output across 3 variables using multiple linear regression on a 30-day dataset, then analyzes via partial derivatives, gradient vectors, directional derivatives, and a triple integral.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            ['R² Score', '0.9617', 'Regression accuracy'],
            ['Max Power', '992.87 W', 'G=1000, T=15°C, θ=0°'],
            ['Min Power', '−25.19 W', 'G=200, T=45°C, θ=60°'],
            ['Avg Power', '482.54 W', 'Triple integral over full domain'],
          ].map(([k, v, s]) => (
            <div key={k} className="stat-card">
              <p style={{ color: 'rgba(226,232,240,0.4)', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' }}>{k}</p>
              <p className="stat-number text-xl">{v}</p>
              <p style={{ color: 'rgba(226,232,240,0.25)', fontSize: '10px' }}>{s}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <LinkBtn href="https://github.com/Ahmad-Ali-Shah/Solar-Energy-Optimization" icon={<GithubIcon size={13} />} label="GitHub" />
          <LinkBtn href="/assets/solar-energy-optimization-report.pdf" icon={<Download size={13} />} label="Full Report (PDF)" />
        </div>
        <p className="text-xs" style={{ color: 'rgba(226,232,240,0.3)', fontFamily: 'JetBrains Mono, monospace' }}>
          Team: Ahmad Ali (Leader) · Liaba Naveed · Muhammad Osaid Zahid<br />
          Instructor: Ms. Iqra Arshad · FAST-NUCES Islamabad · Spring 2026
        </p>
      </div>
      <div>
        <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'rgba(100,140,255,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>
          Interactive Demo
        </p>
        <SolarWidget />
      </div>
    </div>
  );
}

// ── Main ProjectsSection ─────────────────────────────────────────
export default function ProjectsSection() {
  const [active, setActive] = useState<Tab>('ascii-burger');

  const CONTENTS: Record<Tab, React.ReactNode> = {
    'ascii-burger': <AsciiBurger />,
    'watch-parallax': <WatchParallax />,
    'metal-slug': <MetalSlug />,
    'solar': <Solar />,
  };

  return (
    <section id="projects" className="relative py-32 px-6">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(100,140,255,0.03) 0%, transparent 70%)' }}
      />
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs tracking-[0.5em] uppercase mb-3" style={{ color: 'rgba(100,140,255,0.6)', fontFamily: 'JetBrains Mono, monospace' }}>
            Selected Work
          </p>
          <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: 'Outfit, sans-serif', color: '#e2e8f0' }}>
            Projects that <span className="gradient-text">prove it.</span>
          </h2>
        </motion.div>

        {/* Tab strip — neumorphic */}
        <div className="tabs-list mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              data-state={active === tab ? 'active' : 'inactive'}
              className="tab-trigger"
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Tab panel — glassmorphic card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="glass p-6 md:p-8 tab-content"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {CONTENTS[active]}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
