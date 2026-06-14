'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const REASONS = [
  { emoji: '🧭', title: 'Local guides', desc: 'Every guide is a local resident who knows the hidden gems of their region — not just tourist spots.' },
  { emoji: '✅', title: 'Free cancellation', desc: 'Plans changed? No problem. Cancel up to 24h in advance at no charge.' },
  { emoji: '💬', title: '24/7 Support', desc: 'Our team speaks your language and is available around the clock for any questions or assistance.' },
  { emoji: '🛡', title: 'Guaranteed safety', desc: 'All activities undergo rigorous safety and insurance checks before being offered.' },
];

export function WhyUs() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  return (
    <section id="zasto-mi" ref={ref} style={{ background: '#f0f7f4', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.25rem, 5vw, 4rem)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#2d6a4f', marginBottom: '0.8rem', fontFamily: 'Inter, sans-serif' }}>Why us</p>
        <h2 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 600, color: '#1a1a1a' }}>
          An experience you won't forget
        </h2>
      </motion.div>

      {inView && (
        <div className="why-us-grid">
          {REASONS.map((r, i) => (
            <motion.div key={r.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{r.emoji}</div>
              <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.15rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.7rem' }}>{r.title}</h3>
              <p style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>{r.desc}</p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}