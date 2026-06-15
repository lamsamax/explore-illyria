'use client';

import { Footer } from '@/components/sections/Footer';
import { Navbar } from '@/components/layout/Navbar';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#faf9f6', fontFamily: 'Inter, sans-serif' }}>
      <Navbar variant="light" activePage="About" />

      {/* Hero */}
      <div style={{ background: '#1a2e1e', padding: 'clamp(4rem, 10vw, 8rem) clamp(1.25rem, 5vw, 4rem)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem', fontFamily: 'Inter, sans-serif' }}>Who we are</p>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, color: 'white', lineHeight: 1.15 }}>
          About <em style={{ color: '#f4a261', fontStyle: 'italic' }}>us</em>
        </h1>
      </div>

      {/* Content placeholder */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.25rem, 5vw, 4rem)' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '3rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</p>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: '1.8rem', color: '#1a1a1a', marginBottom: '1rem' }}>Content coming soon</h2>
          <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.7 }}>
            This page is being prepared. Please check back soon.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
