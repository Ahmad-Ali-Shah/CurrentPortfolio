'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function FeedbackSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errMsg, setErrMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  };

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <section id="feedback" style={{ padding: '8rem 1.5rem', position: 'relative', overflow: 'hidden', minHeight: '650px', background: '#000000' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '680px', margin: '0 auto' }}>
        <motion.div style={{ textAlign: 'center', marginBottom: '3rem' }}
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 12 }}>
            GET IN TOUCH / DIRECT FEEDBACK
          </p>
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#ffffff', marginBottom: 10, fontFamily: 'Outfit, sans-serif' }}>
            Leave a message.
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
            Reviews land directly in Ahmad&apos;s inbox.
          </p>
        </motion.div>

        <motion.form onSubmit={submit}
          style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '1.25rem', boxShadow: '0 24px 80px rgba(0,0,0,0.95)' }}
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Name</label>
              <input className="form-field" placeholder="Your name" value={form.name} onChange={f('name')} />
            </div>
            <div>
              <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Email</label>
              <input className="form-field" type="email" placeholder="your@email.com" value={form.email} onChange={f('email')} />
            </div>
          </div>

          <div>
            <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>Message *</label>
            <textarea className="form-field" rows={5} placeholder="Share your thoughts, a collaboration idea, or just say hi…" value={form.message} onChange={f('message')} required />
          </div>

          {status === 'success' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, background: 'rgba(50,200,100,0.1)', border: '1px solid rgba(50,200,100,0.3)', color: '#4ade80', fontSize: '0.875rem' }}>
              <CheckCircle size={15} /> Message sent — Ahmad&apos;s been notified.
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, background: 'rgba(200,60,60,0.1)', border: '1px solid rgba(200,60,60,0.3)', color: '#f87171', fontSize: '0.875rem' }}>
              <AlertCircle size={15} /> {errMsg}
            </motion.div>
          )}

          <button type="submit" className="btn-primary"
            disabled={status === 'loading' || !form.message.trim()}
            style={{ opacity: (status === 'loading' || !form.message.trim()) ? 0.5 : 1, width: '100%' }}>
            {status === 'loading'
              ? <><Loader2 size={14} className="animate-spin" /> Sending…</>
              : <><Send size={14} /> Send Message</>
            }
          </button>
        </motion.form>
      </div>
    </section>
  );
}
