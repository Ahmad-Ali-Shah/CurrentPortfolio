'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { useVisitor } from '@/contexts/VisitorContext';

const F = 100; // total frames

function fade(p: number, lo: number, hi: number, f = 0.03) {
  if (p <= lo || p >= hi) return 0;
  if (p < lo + f) return (p - lo) / f;
  if (p > hi - f) return (hi - p) / f;
  return 1;
}

const G: React.CSSProperties = {
  background: 'rgba(6,6,6,0.88)',
  border: '1px solid rgba(255,255,255,0.18)',
  backdropFilter: 'blur(28px)',
  WebkitBackdropFilter: 'blur(28px)',
  borderRadius: '1.25rem',
  padding: '1.6rem',
  boxShadow: '0 24px 80px rgba(0,0,0,0.95)',
  maxWidth: '440px',
  width: '90%',
};

const SKILLS = [
  { t: 'FRONTEND',   s: ['React 18','Next.js 16','TypeScript','Framer Motion','GSAP','Tailwind'] },
  { t: 'BACKEND',    s: ['Node.js','Supabase','PostgreSQL','REST APIs','Edge Functions'] },
  { t: 'SYSTEMS',    s: ['C++','SFML','OOP','NEAT AI','FFT / DSP','Perlin Noise'] },
  { t: 'TOOLS',      s: ['Git','Vercel','Python','scikit-learn','LaTeX','Docker'] },
];

function Overlay({ op, children, align = 'center', padL = '0', padR = '0' }: {
  op: number; children: React.ReactNode;
  align?: 'center' | 'left' | 'right';
  padL?: string; padR?: string;
}) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20,
      display: 'flex', alignItems: 'center',
      justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
      paddingLeft: padL, paddingRight: padR,
      opacity: op, transition: 'opacity 0.08s linear',
      pointerEvents: op > 0.3 ? 'auto' : 'none',
    }}>
      {children}
    </div>
  );
}

export default function SingleScrollPage() {
  const { visitorName, nameSubmitted, submitName } = useVisitor();
  const [name, setName] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptDone, setPromptDone] = useState(false);
  const [p, setP] = useState(0);
  const [fbForm, setFbForm] = useState({ name: '', email: '', message: '' });
  const [fbStatus, setFbStatus] = useState<'idle'|'loading'|'ok'|'err'>('idle');

  const secRef    = useRef<HTMLDivElement>(null);
  const canRef    = useRef<HTMLCanvasElement>(null);
  const imgs      = useRef<(HTMLImageElement|null)[]>(Array(F).fill(null));
  const loaded    = useRef<boolean[]>(Array(F).fill(false));
  const curIdx    = useRef(-1);
  const raf       = useRef<number|null>(null);

  const sizeCanvas = useCallback(() => {
    const c = canRef.current; if (!c) return;
    c.width = window.innerWidth; c.height = window.innerHeight;
  }, []);

  const paint = useCallback((idx: number) => {
    const c = canRef.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const img = imgs.current[idx];
    if (!img || !loaded.current[idx]) return;
    const cw = c.width, ch = c.height, iw = img.naturalWidth||1280, ih = img.naturalHeight||720;
    const sc = Math.max(cw/iw, ch/ih);
    ctx.clearRect(0,0,cw,ch);
    ctx.drawImage(img, (cw-iw*sc)/2, (ch-ih*sc)/2, iw*sc, ih*sc);
  }, []);

  const update = useCallback(() => {
    const sec = secRef.current; if (!sec) return;
    const total = sec.offsetHeight - window.innerHeight;
    const scrolled = Math.max(0, -sec.getBoundingClientRect().top);
    const prog = total > 0 ? Math.min(1, scrolled / total) : 0;
    setP(prog);
    
    // Video frame animation runs 1:1 across 100% of the page scroll progress!
    const idx = Math.min(F - 1, Math.floor(prog * F));
    if (idx !== curIdx.current) {
      curIdx.current = idx;
      paint(idx);
    }
  }, [paint]);

  useEffect(() => {
    sizeCanvas();
    const onScroll = () => {
      if (raf.current !== null) return;
      raf.current = requestAnimationFrame(() => { raf.current = null; update(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { sizeCanvas(); paint(curIdx.current < 0 ? 0 : curIdx.current); }, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', onScroll); if (raf.current) cancelAnimationFrame(raf.current); };
  }, [update, sizeCanvas, paint]);

  useEffect(() => {
    sizeCanvas();
    for (let i = 0; i < F; i++) {
      const img = new Image(), idx = i;
      img.onload = () => {
        loaded.current[idx] = true; imgs.current[idx] = img;
        if (curIdx.current < 0) { curIdx.current = 0; paint(0); }
        else paint(curIdx.current);
      };
      img.src = `/assets/hero-frames/frame_${String(i+1).padStart(3,'0')}.jpg`;
    }
  }, [sizeCanvas, paint]);

  useEffect(() => { const t = setTimeout(() => setShowPrompt(true), 1500); return () => clearTimeout(t); }, []);

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

  // 1:1 Mapped sequence (0.00 to 1.00 mapped evenly across video & scroll)
  const opTitle  = fade(p, 0.00, 0.15); // 0-1.5s  : Descent -> Title
  const opWalk   = fade(p, 0.15, 0.30); // 1.5-3s : Walk -> Welcome & Scroll prompt
  const opP1     = fade(p, 0.30, 0.45); // 3-4.5s : Camera swoop front -> Project 1 (Center)
  const opP2     = fade(p, 0.45, 0.60); // 4.5-6s : Turn head LEFT -> Project 2 (Left)
  const opP3     = fade(p, 0.60, 0.75); // 6-7.5s : Turn head RIGHT -> Project 3 (Right)
  const opP4     = fade(p, 0.75, 0.85); // 7.5-8.5s: Salute -> Project 4 (Center)
  const opSkills = fade(p, 0.85, 0.93); // 8.5-9.3s: Stack & Skills Grid
  const opFb     = p >= 0.93 ? Math.min(1, (p - 0.93) / 0.04) : 0; // 9.3-10s: Direct Contact Form

  const mono = 'JetBrains Mono, monospace';
  const outfit = 'Outfit, sans-serif';

  return (
    <>
      {/* Name Prompt */}
      <AnimatePresence>
        {showPrompt && !promptDone && (
          <motion.div className="name-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <motion.div className="name-card" initial={{y:40,opacity:0}} animate={{y:0,opacity:1}} exit={{y:-20,opacity:0}} transition={{duration:0.5,ease:[0.16,1,0.3,1]}}>
              <p style={{fontFamily:mono,fontSize:'10px',letterSpacing:'0.4em',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',marginBottom:14}}>AHMAD ALI SHAH</p>
              <h2 style={{fontFamily:outfit,fontWeight:800,fontSize:'1.7rem',color:'#fff',marginBottom:8}}>Welcome. Your name?</h2>
              <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.55)',marginBottom:20}}>I&apos;ll personalise your cinematic tour.</p>
              <div style={{display:'flex',gap:10}}>
                <input className="name-input" placeholder="Type your name…" value={name}
                  onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&name.trim()&&(submitName(name.trim()),setShowPrompt(false),setPromptDone(true))}
                  style={{flex:1}} />
                <button className="btn-primary" style={{opacity:name.trim()?1:0.35,flexShrink:0}}
                  onClick={()=>name.trim()&&(submitName(name.trim()),setShowPrompt(false),setPromptDone(true))}>Enter →</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Nav */}
      <nav style={{position:'fixed',top:'1.2rem',left:'50%',transform:'translateX(-50%)',zIndex:500,display:'flex',alignItems:'center',gap:'1.2rem',padding:'0.6rem 1.6rem',background:'rgba(0,0,0,0.85)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:50,backdropFilter:'blur(20px)'}}>
        <span style={{fontFamily:mono,fontSize:'11px',letterSpacing:'0.35em',color:'#fff',fontWeight:700}}>A.</span>
        <div style={{width:1,height:14,background:'rgba(255,255,255,0.15)'}}/>
        {['#hero','#skills','#feedback'].map((h,i)=>(<a key={h} href={h} style={{fontFamily:mono,fontSize:'0.72rem',fontWeight:600,color:'rgba(255,255,255,0.65)',textDecoration:'none',letterSpacing:'0.06em',textTransform:'uppercase'}}>{['Intro','Stack','Contact'][i]}</a>))}
      </nav>

      {/* SINGLE SCROLL SECTION — 1200vh */}
      <section ref={secRef} id="hero" style={{height:'1200vh',position:'relative',background:'#000'}}>
        <div style={{position:'sticky',top:0,height:'100vh',width:'100%',overflow:'hidden',background:'#000'}}>

          {/* Canvas */}
          <canvas ref={canRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:1,display:'block'}}/>

          {/* Vignette */}
          <div style={{position:'absolute',inset:0,zIndex:2,pointerEvents:'none',background:'radial-gradient(ellipse 88% 85% at 50% 50%,transparent 10%,rgba(0,0,0,0.4) 65%,rgba(0,0,0,0.92) 100%)'}}/>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:'28%',zIndex:3,pointerEvents:'none',background:'linear-gradient(to top,#000 0%,transparent 100%)'}}/>

          {/* ZONE 1: Title */}
          <Overlay op={opTitle}>
            <div style={{textAlign:'center',pointerEvents:'none'}}>
              <h1 style={{fontFamily:outfit,fontWeight:900,fontSize:'clamp(3rem,10vw,7rem)',color:'#fff',margin:0,textShadow:'0 2px 60px rgba(0,0,0,0.98)',letterSpacing:'-0.01em'}}>AHMAD ALI SHAH</h1>
              <p style={{fontFamily:mono,fontSize:'11px',letterSpacing:'0.5em',color:'rgba(255,255,255,0.6)',textTransform:'uppercase',marginTop:16}}>Full-Stack &amp; Systems Architect · FAST-NUCES</p>
              <p style={{fontFamily:mono,fontSize:'10px',color:'rgba(255,255,255,0.3)',marginTop:28,letterSpacing:'0.15em'}}>↓ scroll to explore</p>
            </div>
          </Overlay>

          {/* ZONE 2: Walk */}
          <Overlay op={opWalk}>
            <div style={{textAlign:'center',pointerEvents:'none'}}>
              {nameSubmitted && <p style={{fontFamily:mono,fontSize:'0.9rem',color:'rgba(255,255,255,0.6)',marginBottom:12}}>↳ Hey, {visitorName}.</p>}
              <h2 style={{fontFamily:outfit,fontWeight:900,fontSize:'clamp(2rem,5vw,3.5rem)',color:'#fff',textShadow:'0 2px 40px rgba(0,0,0,0.98)',margin:0}}>Keep scrolling —</h2>
              <h2 style={{fontFamily:outfit,fontWeight:900,fontSize:'clamp(2rem,5vw,3.5rem)',color:'#fff',textShadow:'0 2px 40px rgba(0,0,0,0.98)',margin:0}}>projects appear in the frame.</h2>
              <p style={{fontFamily:mono,fontSize:'10px',color:'rgba(255,255,255,0.3)',marginTop:24,letterSpacing:'0.15em'}}>↓ ↓ ↓</p>
            </div>
          </Overlay>

          {/* ZONE 3: Project 1 — Centre (Swoop Front) */}
          <Overlay op={opP1}>
            <div style={G}>
              <p style={{fontFamily:mono,fontSize:'10px',color:'#f59e0b',textTransform:'uppercase',letterSpacing:'0.2em',marginBottom:8}}>Project 01 · Flagship</p>
              <h3 style={{fontFamily:outfit,fontWeight:800,fontSize:'1.5rem',color:'#fff',marginBottom:8}}>Zero-G Cheeseburger</h3>
              <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.7)',lineHeight:1.6,marginBottom:16}}>201-frame HTML5 Canvas scroll-scrubbing with Lenis inertia and an interactive ASCII torch-reveal scanner lens.</p>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                <a href="https://burger-shop-scrolling-effect.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{fontSize:'0.78rem',padding:'0.5rem 1.1rem'}}><ExternalLink size={12}/> Live Demo</a>
                <a href="https://github.com/Ahmad-Ali-Shah/BurgerShopScrollingEffect" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:6,padding:'0.5rem 1.1rem',borderRadius:'0.65rem',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.18)',color:'#fff',fontSize:'0.78rem',textDecoration:'none'}}><GithubIcon size={12}/> Code</a>
              </div>
            </div>
          </Overlay>

          {/* ZONE 4: Project 2 — Left (Turn Head LEFT) */}
          <Overlay op={opP2} align="left" padL="6%">
            <div style={G}>
              <p style={{fontFamily:mono,fontSize:'10px',color:'#c084fc',textTransform:'uppercase',letterSpacing:'0.2em',marginBottom:8}}>Project 02 · Horology</p>
              <h3 style={{fontFamily:outfit,fontWeight:800,fontSize:'1.5rem',color:'#fff',marginBottom:8}}>Calibre 04 Watch</h3>
              <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.7)',lineHeight:1.6,marginBottom:16}}>81-frame 3D exploded watch movement with step-indexed mechanism breakdown and real-time optics controller.</p>
              <a href="https://watch-parallex-ruby.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{fontSize:'0.78rem',padding:'0.5rem 1.1rem'}}><ExternalLink size={12}/> Live Demo</a>
            </div>
          </Overlay>

          {/* ZONE 5: Project 3 — Right (Turn Head RIGHT) */}
          <Overlay op={opP3} align="right" padR="6%">
            <div style={G}>
              <p style={{fontFamily:mono,fontSize:'10px',color:'#f87171',textTransform:'uppercase',letterSpacing:'0.2em',marginBottom:8}}>Project 03 · C++ SFML</p>
              <h3 style={{fontFamily:outfit,fontWeight:800,fontSize:'1.5rem',color:'#fff',marginBottom:8}}>Metal Slug Engine</h3>
              <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.7)',lineHeight:1.6,marginBottom:16}}>Custom 2D game engine in C++. Perlin Noise terrain, NEAT neural-net AI, FFT voice-launch trigger.</p>
              <a href="https://github.com/Ahmad-Ali-Shah/Metal-Slug" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{fontSize:'0.78rem',padding:'0.5rem 1.1rem'}}><GithubIcon size={12}/> GitHub</a>
            </div>
          </Overlay>

          {/* ZONE 6: Project 4 — Centre (Military Salute) */}
          <Overlay op={opP4}>
            <div style={{...G,maxWidth:'480px',textAlign:'center'}}>
              <p style={{fontFamily:mono,fontSize:'10px',color:'#4ade80',textTransform:'uppercase',letterSpacing:'0.2em',marginBottom:8}}>Project 04 · Calculus</p>
              <h3 style={{fontFamily:outfit,fontWeight:900,fontSize:'1.6rem',color:'#fff',marginBottom:8}}>Solar Energy Optimization</h3>
              <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.7)',lineHeight:1.6,marginBottom:16}}>Photovoltaic multi-linear regression (R²=0.9617). Gradient vectors &amp; triple-integral evaluation.</p>
              <div style={{display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap'}}>
                <a href="https://github.com/Ahmad-Ali-Shah/Solar-Energy-Optimization" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{fontSize:'0.78rem',padding:'0.5rem 1.1rem'}}><GithubIcon size={12}/> GitHub</a>
                <a href="/assets/solar-energy-optimization-report.pdf" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:6,padding:'0.5rem 1.1rem',borderRadius:'0.65rem',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.18)',color:'#fff',fontSize:'0.78rem',textDecoration:'none'}}>PDF Report</a>
              </div>
            </div>
          </Overlay>

          {/* ZONE 7: Skills Grid */}
          <Overlay op={opSkills} align="center">
            <div id="skills" style={{width:'100%',maxWidth:'900px',padding:'0 2rem'}}>
              <p style={{fontFamily:mono,fontSize:'11px',letterSpacing:'0.5em',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',marginBottom:12,textAlign:'center'}}>STACK &amp; ARCHITECTURE</p>
              <h2 style={{fontFamily:outfit,fontWeight:900,fontSize:'clamp(2rem,4vw,3rem)',color:'#fff',textAlign:'center',marginBottom:32}}>What I build with.</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1rem'}}>
                {SKILLS.map(cat=>(
                  <div key={cat.t} style={{background:'rgba(10,10,10,0.9)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'1rem',padding:'1.25rem'}}>
                    <p style={{fontFamily:mono,fontSize:'10px',fontWeight:700,letterSpacing:'0.3em',color:'rgba(255,255,255,0.6)',marginBottom:12}}>{cat.t}</p>
                    <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                      {cat.s.map(s=><span key={s} style={{padding:'4px 10px',borderRadius:'20px',fontSize:'0.75rem',fontWeight:600,background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.14)',color:'#fff'}}>{s}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Overlay>

          {/* ZONE 8: Feedback Form */}
          <Overlay op={opFb} align="center">
            <div id="feedback" style={{width:'100%',maxWidth:'640px',padding:'0 1.5rem'}}>
              <p style={{fontFamily:mono,fontSize:'11px',letterSpacing:'0.4em',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',marginBottom:12,textAlign:'center'}}>GET IN TOUCH</p>
              <h2 style={{fontFamily:outfit,fontWeight:900,fontSize:'clamp(2rem,4vw,3rem)',color:'#fff',textAlign:'center',marginBottom:28}}>Leave a message.</h2>
              <form onSubmit={submitFeedback} style={{display:'flex',flexDirection:'column',gap:'1rem',background:'rgba(10,10,10,0.92)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'1.25rem',padding:'2rem'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                  <div>
                    <label style={{fontFamily:mono,fontSize:'10px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:6}}>Name</label>
                    <input className="form-field" placeholder="Your name" value={fbForm.name} onChange={e=>setFbForm(f=>({...f,name:e.target.value}))}/>
                  </div>
                  <div>
                    <label style={{fontFamily:mono,fontSize:'10px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:6}}>Email</label>
                    <input className="form-field" type="email" placeholder="you@email.com" value={fbForm.email} onChange={e=>setFbForm(f=>({...f,email:e.target.value}))}/>
                  </div>
                </div>
                <div>
                  <label style={{fontFamily:mono,fontSize:'10px',color:'rgba(255,255,255,0.5)',display:'block',marginBottom:6}}>Message *</label>
                  <textarea className="form-field" rows={4} placeholder="Share your thoughts…" value={fbForm.message} onChange={e=>setFbForm(f=>({...f,message:e.target.value}))} required/>
                </div>
                {fbStatus==='ok' && <div style={{display:'flex',alignItems:'center',gap:8,color:'#4ade80',fontSize:'0.85rem'}}><CheckCircle size={14}/> Sent — Ahmad&apos;s been notified.</div>}
                {fbStatus==='err' && <div style={{display:'flex',alignItems:'center',gap:8,color:'#f87171',fontSize:'0.85rem'}}><AlertCircle size={14}/> Something went wrong. Try again.</div>}
                <button type="submit" className="btn-primary" disabled={fbStatus==='loading'||!fbForm.message.trim()} style={{opacity:(fbStatus==='loading'||!fbForm.message.trim())?0.4:1,width:'100%'}}>
                  {fbStatus==='loading'?<><Loader2 size={13} className="animate-spin"/> Sending…</>:<><Send size={13}/> Send Message</>}
                </button>
              </form>
              <p style={{textAlign:'center',fontFamily:mono,fontSize:'10px',color:'rgba(255,255,255,0.3)',marginTop:28}}>© {new Date().getFullYear()} Ahmad Ali Shah · FAST-NUCES Islamabad · Built with Next.js</p>
            </div>
          </Overlay>

          {/* Progress bar */}
          <div style={{position:'absolute',bottom:0,left:0,height:2,zIndex:30,width:`${p*100}%`,background:'#fff',boxShadow:'0 0 8px rgba(255,255,255,0.6)',transition:'width 0.04s linear'}}/>

          {/* Frame counter */}
          <div style={{position:'absolute',bottom:10,right:12,zIndex:40,fontFamily:mono,fontSize:'9px',color:'rgba(255,255,255,0.2)',pointerEvents:'none'}}>
            {String(Math.min(F, Math.floor(p * F) + 1)).padStart(3,'0')} / {F}
          </div>
        </div>
      </section>
    </>
  );
}
