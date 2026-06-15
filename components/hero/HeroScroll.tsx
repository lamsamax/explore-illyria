'use client';

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { supabase } from '@/lib/supabase';
import { sendContact } from '@/lib/sendContact';
import type { Tour } from '@/lib/supabase';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function HeroScroll() {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Contact form state
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errMsg, setErrMsg] = useState('');

  const categories = ['🏔 Hiking', '🏛 Culture', '🍽 Gastro', '🚣 Rafting', '🏰 History', '🌊 Sea'];

  // Fetch tours once (lazy — on first keystroke)
  const fetchedRef = useRef(false);
  const fetchTours = async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    const { data } = await supabase.from('tours').select('id,name,location,price,price_label,image,category').order('id');
    if (data) setAllTours(data as Tour[]);
  };

  // Filter results
  const q = search.trim().toLowerCase();
  const results = q.length >= 2
    ? allTours.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q)
      ).slice(0, 6)
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setErrMsg('Please fill in name, email, and message.'); setStatus('error'); return;
    }
    setStatus('loading'); setErrMsg('');
    const res = await sendContact({ ...form, message: form.message || 'Interested in planning a trip.' });
    if (res.ok) { setStatus('success'); }
    else { setStatus('error'); setErrMsg(res.error ?? 'Failed to send.'); }
  };

  return (
    <>
      <Navbar variant="dark" activePage="Tours" />

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
          alt="Balkan landscape"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(0,0,10,0.2) 0%, rgba(0,0,10,0.55) 60%, rgba(0,0,10,0.75) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px', zIndex: 2, pointerEvents: 'none', background: 'linear-gradient(to bottom, transparent 0%, white 100%)' }} />

        {/* Central content */}
        <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 5%', width: '100%', maxWidth: '640px' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem', fontFamily: 'Inter, sans-serif' }}>
            Your next adventure
          </p>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(2.2rem, 5vw, 5rem)', fontWeight: 600, color: 'white', lineHeight: 1.1, marginBottom: '2.5rem', maxWidth: '900px' }}>
            Where do your dreams take you?
          </h1>

          {/* Search bar with inline results */}
          <div ref={searchRef} style={{ position: 'relative', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: showResults && results.length > 0 ? '18px 18px 0 0' : '999px', padding: '0.5rem 0.5rem 0.5rem 1.5rem', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', gap: '0.5rem', transition: 'border-radius 0.15s' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search tours..."
                value={search}
                onChange={e => { setSearch(e.target.value); setShowResults(true); fetchTours(); }}
                onFocus={() => { setShowResults(true); if (search.trim().length >= 2) fetchTours(); }}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem', color: '#1a1a1a', background: 'transparent', fontFamily: 'Inter, sans-serif', minWidth: 0 }}
              />
              {search && (
                <button onClick={() => { setSearch(''); setShowResults(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '1.2rem', lineHeight: 1, flexShrink: 0 }}>×</button>
              )}
              <a href={`/destinacije${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ''}`}
                style={{ background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '999px', padding: '0.75rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif', flexShrink: 0, textDecoration: 'none' }}>
                Search →
              </a>
            </div>

            {/* Inline results dropdown */}
            {showResults && results.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '0 0 18px 18px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden', zIndex: 10 }}>
                {results.map(tour => (
                  <a
                    key={tour.id}
                    href={`/destinacije?q=${encodeURIComponent(tour.name)}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', textDecoration: 'none', borderBottom: '1px solid #f0f0ec', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8f8f5')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                  >
                    {tour.image && (
                      <img src={tour.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', margin: 0, fontFamily: 'Inter, sans-serif' }}>{tour.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#888', margin: 0, fontFamily: 'Inter, sans-serif' }}>📍 {tour.location}</p>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#2d6a4f', fontWeight: 600, fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>
                      {tour.price ? `${tour.price} €` : tour.price_label}
                    </span>
                  </a>
                ))}
                <a href={`/destinacije?q=${encodeURIComponent(search.trim())}`}
                  style={{ display: 'block', padding: '0.75rem 1.25rem', fontSize: '0.8rem', color: '#2d6a4f', fontWeight: 600, textDecoration: 'none', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8f8f5')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                >
                  See all results for "{search}" →
                </a>
              </div>
            )}

            {/* No results hint */}
            {showResults && q.length >= 2 && results.length === 0 && allTours.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: '0 0 18px 18px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', padding: '1rem 1.25rem', textAlign: 'center', zIndex: 10 }}>
                <p style={{ fontSize: '0.85rem', color: '#888', margin: 0, fontFamily: 'Inter, sans-serif' }}>No tours found for "{search}"</p>
                <a href="/destinacije" style={{ fontSize: '0.8rem', color: '#2d6a4f', fontWeight: 600, textDecoration: 'none' }}>Browse all tours →</a>
              </div>
            )}
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
        <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
          <svg className="animate-scroll-hint" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
            <path d="M6 9l6 6 6-6" />
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

      {/* Contact form modal */}
      {formOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setFormOpen(false)}
        >
          <div
            style={{ background: 'white', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '420px', margin: '0 1rem', position: 'relative' }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setFormOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>×</button>

            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <p style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>✅</p>
                <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.6rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>Message sent!</h3>
                <p style={{ fontSize: '0.9rem', color: '#888', fontFamily: 'Inter, sans-serif' }}>We'll get back to you shortly.</p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#2d6a4f', marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif' }}>Contact</p>
                <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.8rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1a1a1a' }}>Plan your trip</h3>
                {/* Honeypot */}
                <input name="website" type="text" defaultValue="" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {(['name', 'email', 'phone'] as const).map(field => (
                    <input key={field} name={field} type={field === 'email' ? 'email' : 'text'}
                      placeholder={field === 'name' ? 'Full name' : field === 'email' ? 'Email address' : 'Phone number'}
                      value={form[field]} onChange={handleChange}
                      style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '0.85rem 1rem', fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#1a1a1a', boxSizing: 'border-box' }} />
                  ))}
                  <input name="message" type="text"
                    placeholder="Desired destination / message"
                    value={form.message} onChange={handleChange}
                    style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '12px', padding: '0.85rem 1rem', fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#1a1a1a', boxSizing: 'border-box' }} />
                  {status === 'error' && (
                    <p style={{ fontSize: '0.8rem', color: '#c23a1a', fontFamily: 'Inter, sans-serif', margin: 0 }}>{errMsg}</p>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={status === 'loading'}
                    style={{ background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '12px', padding: '1rem', fontSize: '0.9rem', fontWeight: 600, cursor: status === 'loading' ? 'wait' : 'pointer', marginTop: '0.5rem', fontFamily: 'Inter, sans-serif', opacity: status === 'loading' ? 0.7 : 1 }}>
                    {status === 'loading' ? 'Sending...' : 'Send inquiry →'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
