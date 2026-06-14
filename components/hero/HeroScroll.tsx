'use client';

import { useState } from 'react';

export function HeroScroll() {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  const categories = ['🏔 Hiking', '🏛 Culture', '🍽 Gastro', '🚣 Rafting', '🏰 History', '🌊 Sea'];

  return (
    <>
      <section style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
          src="/jpg2.jpeg"
          alt="Earth from space"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            zIndex: 0,
          }}
        />

        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(0,0,10,0.2) 0%, rgba(0,0,10,0.55) 60%, rgba(0,0,10,0.75) 100%)',
        }} />

        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '180px', zIndex: 2, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent 0%, white 100%)',
        }} />

        {/* Navbar */}
        <nav style={{
          position: 'fixed', top: '1.5rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 100, width: '94%', maxWidth: '1100px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.75rem 1.5rem', borderRadius: '999px',
          background: 'rgba(0,0,10,0.5)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <svg width="26" height="26" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="3" fill="none" opacity="0.4"/>
              <path d="M50 10 Q60 30 70 50 Q60 70 50 90 Q40 70 30 50 Q40 30 50 10Z" fill="white" opacity="0.9"/>
              <path d="M10 50 Q30 40 50 50 Q70 60 90 50" stroke="#f4a261" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily: 'Lora, serif', fontSize: '1.1rem', color: 'white', fontWeight: 500 }}>
              Explore <em style={{ color: '#f4a261', fontStyle: 'normal', fontWeight: 700 }}>Illyria</em>
            </span>
          </a>

          <div className="nav-links">
            {[
              { label: 'Tours', href: '/destinacije' },
              { label: 'Activities', href: '#kategorije' },
              { label: 'About', href: '#zasto-mi' },
              { label: 'Blog', href: '#istaknute' },
            ].map(link => (
              <a key={link.label} href={link.href}
                style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setFormOpen(true)}
            style={{ background: '#f4a261', color: 'white', border: 'none', borderRadius: '999px', padding: '0.55rem 1.3rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Contact
          </button>
        </nav>

        {/* Central content */}
        <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 5%' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem', fontFamily: 'Inter, sans-serif' }}>
            Your next adventure
          </p>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(2.2rem, 5vw, 5rem)', fontWeight: 600, color: 'white', lineHeight: 1.1, marginBottom: '2.5rem', maxWidth: '900px' }}>
            Where do your dreams take you?
          </h1>

          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '999px', padding: '0.5rem 0.5rem 0.5rem 1.5rem', width: '100%', maxWidth: '580px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', gap: '0.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Stari Most, Plitvice Lakes, Kotor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem', color: '#1a1a1a', background: 'transparent', fontFamily: 'Inter, sans-serif' }}
            />
            <button style={{ background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '999px', padding: '0.75rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif' }}>
              Search →
            </button>
          </div>

          {/* Categories */}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map((cat, i) => (
              <a key={i} href="#kategorije"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '999px', padding: '0.4rem 1rem', fontSize: '0.75rem', color: 'white', cursor: 'pointer', fontFamily: 'Inter, sans-serif', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
              >
                {cat}
              </a>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <svg className="animate-scroll-hint" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ background: 'white', padding: '1.5rem clamp(1.25rem, 5vw, 4rem)', display: 'flex', justifyContent: 'center', gap: 'clamp(1.5rem, 4vw, 4rem)', borderBottom: '1px solid #e8e8e4', flexWrap: 'wrap' }}>
        {[['5,000+', 'Happy travellers'], ['150+', 'Activities'], ['6', 'Balkan countries'], ['4.9★', 'Average rating']].map(([num, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Lora, serif', fontSize: '1.6rem', fontWeight: 700, color: '#2d6a4f', margin: 0 }}>{num}</p>
            <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem', fontFamily: 'Inter, sans-serif' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Contact form */}
      {formOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setFormOpen(false)}
        >
          <div
            style={{ background: 'white', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '420px', margin: '0 1rem', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setFormOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>×</button>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#2d6a4f', marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif' }}>Contact</p>
            <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.8rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1a1a1a' }}>Plan your trip</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {['Full name', 'Email address', 'Phone', 'Desired destination'].map(field => (
                <input key={field} type="text" placeholder={field}
                  style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '0.85rem 1rem', fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }} />
              ))}
              <button style={{ background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '12px', padding: '1rem', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                Send inquiry →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}