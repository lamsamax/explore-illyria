'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';

const CATS = [
  { emoji: '🏔', name: 'Hiking', bg: '#e8f4e8', filter: 'Nature' },
  { emoji: '🏛', name: 'Culture & History', bg: '#f0e8f8', filter: 'Culture' },
  { emoji: '🍽', name: 'Gastronomy', bg: '#f8f0e8', filter: 'Culture' },
  { emoji: '🚣', name: 'Rafting & Water', bg: '#e8f0f8', filter: 'Nature' },
  { emoji: '🌿', name: 'Eco Tourism', bg: '#e8f8ee', filter: 'Nature' },
  { emoji: '🏰', name: 'Old Towns', bg: '#f8ebe8', filter: 'History' },
  { emoji: '📸', name: 'Photo Tours', bg: '#fdf8e8', filter: 'Culture' },
  { emoji: '🍷', name: 'Wineries', bg: '#f8e8f0', filter: 'Culture' },
];

export function Categories() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  const router = useRouter();

  return (
    <section id="kategorije" ref={ref} style={{ background: 'white', padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 4rem)', borderTop: '1px solid #eee' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#2d6a4f', marginBottom: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
          Explore by category
        </p>
        <h2 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 600, color: '#1a1a1a' }}>
          What interests you?
        </h2>
      </motion.div>

      {inView && (
        <div className="categories-grid">
          {CATS.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => router.push(`/destinacije?category=${cat.filter}`)}
              style={{ background: cat.bg, border: 'none', borderRadius: '16px', padding: '1.2rem 0.8rem', cursor: 'pointer', textAlign: 'center', transition: 'all 0.25s' }}
              whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{cat.emoji}</div>
              <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#1a1a1a', margin: 0, lineHeight: 1.3, fontFamily: 'Inter, sans-serif' }}>{cat.name}</p>
            </motion.button>
          ))}
        </div>
      )}
    </section>
  );
}