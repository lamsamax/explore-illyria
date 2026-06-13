'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Footer } from '@/components/sections/Footer';
import { supabase } from '@/lib/supabase';


type Tour = {
  id: number;
  name: string;
  image: string;
  location: string;
  duration: string;
  activity: string;
  difficulty: string;
  price: number | null;
  priceLabel: string;
  category: string;
  tag: string;
  tagColor: string;
  color: string;
  desc: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  longDesc: string;
};

const CATEGORIES = ['All', 'Nature', 'History', 'Culture'];

const DIFFICULTIES: Record<string, { color: string; bg: string }> = {
  'Easy':   { color: '#2d6a4f', bg: '#e8f4f0' },
  'Medium': { color: '#c25b1a', bg: '#f8f0e8' },
  'Hard':   { color: '#c23a1a', bg: '#f8ebe8' },
};

function ContactModal({ tour, onClose }: { tour: Tour; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '1rem' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: 0.25 }}
        style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '440px', padding: '2rem', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.07)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ×
        </button>

        {!submitted ? (
          <>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2d6a4f', fontFamily: 'Inter, sans-serif', marginBottom: '0.4rem' }}>Get in touch</p>
            <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.3rem' }}>{tour.name}</h3>
            <p style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'Inter, sans-serif', marginBottom: '1.5rem' }}>📍 {tour.location}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {(['name', 'email', 'phone'] as const).map(field => (
                <input
                  key={field}
                  name={field}
                  type={field === 'email' ? 'email' : 'text'}
                  placeholder={field === 'name' ? 'Full name' : field === 'email' ? 'Email address' : 'Phone number'}
                  value={form[field]}
                  onChange={handleChange}
                  style={{ border: '1px solid #e0e0e0', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.85rem', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#1a1a1a', width: '100%', boxSizing: 'border-box' }}
                />
              ))}
              <textarea
                name="message"
                placeholder="Write your message here — ask about dates, group size, or anything else..."
                value={form.message}
                onChange={handleChange}
                rows={4}
                style={{ border: '1px solid #e0e0e0', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.85rem', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#1a1a1a', width: '100%', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.6 }}
              />
              <button
                onClick={() => setSubmitted(true)}
                style={{ background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '12px', padding: '0.9rem', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s', marginTop: '0.2rem' }}
                onMouseEnter={e => e.currentTarget.style.background = '#235a40'}
                onMouseLeave={e => e.currentTarget.style.background = '#2d6a4f'}
              >
                Send message →
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>✅</p>
            <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.4rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>Message sent!</h3>
            <p style={{ fontSize: '0.85rem', color: '#888', fontFamily: 'Inter, sans-serif' }}>We'll get back to you shortly.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function TourModal({ tour, onClose }: { tour: Tour; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: '1rem' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ duration: 0.3 }}
        style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '860px', maxHeight: '90vh', overflow: 'auto', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ×
        </button>

        {/* Hero */}
        <div style={{ background: tour.color, padding: '2.5rem 2.5rem 2rem', borderRadius: '24px 24px 0 0', position: 'relative' }}>
          <span style={{ background: tour.tagColor, color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '0.3rem 0.8rem', borderRadius: '999px', fontFamily: 'Inter, sans-serif', display: 'inline-block', marginBottom: '1rem' }}>
            {tour.tag}
          </span>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#1a1a1a', margin: '0 0 0.5rem 0', paddingRight: '2rem' }}>
            {tour.name}
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#666', fontFamily: 'Inter, sans-serif', margin: 0 }}>📍 {tour.location}</p>
        </div>

        <div style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Meta */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }}>
            {[
              { icon: '⏱', label: 'Duration', value: tour.duration },
              { icon: '🏃', label: 'Activity', value: tour.activity },
              { icon: '📊', label: 'Difficulty', value: tour.difficulty },
              { icon: '💰', label: 'Price', value: tour.priceLabel },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ background: '#f8f8f5', borderRadius: '12px', padding: '0.8rem' }}>
                <p style={{ fontSize: '0.65rem', color: '#999', margin: '0 0 0.2rem', fontFamily: 'Inter, sans-serif' }}>{icon} {label}</p>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a1a1a', margin: 0, fontFamily: 'Inter, sans-serif' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <p style={{ fontSize: '0.88rem', color: '#555', lineHeight: 1.75, fontFamily: 'Inter, sans-serif', margin: 0 }}>
            {tour.longDesc}
          </p>

          {/* Highlights + Included */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1a1a1a', marginBottom: '0.6rem', fontFamily: 'Inter, sans-serif' }}>Highlights</p>
              {tour.highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#2d6a4f', fontSize: '0.8rem', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '0.8rem', color: '#444', fontFamily: 'Inter, sans-serif' }}>{h}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gap: '0.8rem' }}>
              <div style={{ background: '#f0f8f4', borderRadius: '12px', padding: '1rem' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#2d6a4f', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif' }}>✓ Included</p>
                {tour.included.map((item, i) => (
                  <p key={i} style={{ fontSize: '0.75rem', color: '#444', margin: '0 0 0.2rem', fontFamily: 'Inter, sans-serif' }}>+ {item}</p>
                ))}
              </div>
              <div style={{ background: '#fdf5f5', borderRadius: '12px', padding: '1rem' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#c23a1a', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif' }}>✗ Not included</p>
                {tour.notIncluded.map((item, i) => (
                  <p key={i} style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 0.2rem', fontFamily: 'Inter, sans-serif' }}>— {item}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Booking */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            {!submitted ? (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.2rem' }}>
                  <span style={{ fontFamily: 'Lora, serif', fontSize: '1.8rem', fontWeight: 700, color: '#2d6a4f' }}>
                    {tour.price ? `${tour.price} €` : 'Custom pricing'}
                  </span>
                  {tour.price && <span style={{ fontSize: '0.75rem', color: '#888', fontFamily: 'Inter, sans-serif' }}>per person</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.6rem' }}>
                  {['Full name', 'Email address', 'Phone number', 'Number of people'].map(field => (
                    <input key={field} type="text" placeholder={field}
                      style={{ border: '1px solid #e0e0e0', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.85rem', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button
                    onClick={() => setSubmitted(true)}
                    style={{ flex: 1, background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '12px', padding: '0.9rem', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#235a40'}
                    onMouseLeave={e => e.currentTarget.style.background = '#2d6a4f'}
                  >
                    Send booking request →
                  </button>
                  
                    <a href="mailto:explore.illyria.info@gmail.com"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.9rem 1.5rem', borderRadius: '12px', border: '2px solid #2d6a4f', color: '#2d6a4f', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#2d6a4f'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#2d6a4f'; }}
                  >
                    Contact us
                  </a>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <p style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>✅</p>
                <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.4rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>Request sent!</h3>
                <p style={{ fontSize: '0.85rem', color: '#888', fontFamily: 'Inter, sans-serif' }}>Our team will contact you shortly to confirm your booking.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DestinacijeContent() {
  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [contactTour, setContactTour] = useState<Tour | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    supabase
      .from('tours')
      .select('*')
      .order('id')
      .then(({ data, error }) => {
        if (!error && data) {
          setTours(data.map((t: any) => ({
            id: t.id,
            name: t.name,
            image: t.image,
            location: t.location,
            duration: t.duration,
            activity: t.activity,
            difficulty: t.difficulty,
            price: t.price,
            priceLabel: t.price_label,
            category: t.category,
            tag: t.tag,
            tagColor: t.tag_color,
            color: t.color,
            desc: t.description,
            highlights: t.highlights,
            included: t.included,
            notIncluded: t.not_included,
            longDesc: t.long_desc,
          })));
        }
        setLoading(false);
      });
  }, []);
  const searchParams = useSearchParams();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && CATEGORIES.includes(cat)) setActive(cat);
  }, [searchParams]);

  const filtered = tours.filter(t => {
    const matchCat = active === 'All' || t.category === active;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f6', fontFamily: 'Inter, sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', zIndex: 100,
        top: scrolled ? 0 : '1.5rem',
        left: scrolled ? 0 : '50%',
        transform: scrolled ? 'none' : 'translateX(-50%)',
        width: scrolled ? '100%' : '94%',
        maxWidth: scrolled ? '100%' : '1100px',
        padding: scrolled ? '0.85rem 3rem' : '0.75rem 1.5rem',
        borderRadius: scrolled ? 0 : '999px',
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid #eee' : 'none',
        border: scrolled ? undefined : '1px solid rgba(0,0,0,0.08)',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.07)' : '0 4px 24px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'top 0.3s ease, left 0.3s ease, width 0.3s ease, border-radius 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <svg width="26" height="26" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="48" stroke="#2d6a4f" strokeWidth="3" fill="none" opacity="0.4"/>
            <path d="M50 10 Q60 30 70 50 Q60 70 50 90 Q40 70 30 50 Q40 30 50 10Z" fill="#2d6a4f" opacity="0.8"/>
            <path d="M10 50 Q30 40 50 50 Q70 60 90 50" stroke="#f4a261" strokeWidth="3" fill="none" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: 'Lora, serif', fontSize: '1.1rem', color: '#1a1a1a', fontWeight: 500 }}>
            Explore <em style={{ color: '#f4a261', fontStyle: 'normal', fontWeight: 700 }}>Illyria</em>
          </span>
        </a>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { label: 'Tours', href: '/destinacije' },
            { label: 'Activities', href: '/#kategorije' },
            { label: 'About', href: '/#zasto-mi' },
            { label: 'Blog', href: '/#istaknute' },
          ].map(link => (
            <a key={link.label} href={link.href}
              style={{ fontSize: '0.8rem', color: link.label === 'Tours' ? '#2d6a4f' : '#555', textDecoration: 'none', letterSpacing: '0.05em', fontWeight: link.label === 'Tours' ? 700 : 400 }}>
              {link.label}
            </a>
          ))}
        </div>
        <a href="/" style={{ background: '#f4a261', color: 'white', borderRadius: '999px', padding: '0.55rem 1.3rem', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>Home</a>
      </nav>

      {/* Hero — with background image */}
      <div style={{ position: 'relative', padding: '10rem 4rem 5rem', textAlign: 'center', overflow: 'hidden' }}>
        <img src="/images/landscape.jpg" alt="Bosnia landscape"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,30,15,0.75) 0%, rgba(10,30,15,0.65) 60%, rgba(10,30,15,0.85) 100%)' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>Explore Illyria</p>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 600, color: 'white', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            All our <em style={{ color: '#f4a261', fontStyle: 'italic' }}>tours</em>
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '580px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            From mountain peaks to river canyons — choose the adventure that inspires you
          </p>
          <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '999px', padding: '0.5rem 0.5rem 0.5rem 1.5rem', width: '100%', maxWidth: '500px', margin: '0 auto', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Search tours..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem', color: '#1a1a1a', background: 'transparent' }} />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '1.2rem', lineHeight: 1 }}>×</button>}
          </div>
        </motion.div>
      </div>

      {/* Filter */}
      <div style={{ background: 'white', borderBottom: '1px solid #eee', padding: '1rem 4rem', position: 'sticky', top: scrolled ? '53px' : '5rem', zIndex: 50, display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', transition: 'top 0.3s ease' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActive(cat)}
            style={{ padding: '0.5rem 1.2rem', borderRadius: '999px', border: 'none', background: active === cat ? '#2d6a4f' : '#f0f0ec', color: active === cat ? 'white' : '#555', fontSize: '0.82rem', fontWeight: active === cat ? 700 : 400, cursor: 'pointer', transition: 'all 0.2s' }}>
            {cat}
            {active === cat && filtered.length > 0 && (
              <span style={{ marginLeft: '0.4rem', background: 'rgba(255,255,255,0.3)', borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.72rem' }}>{filtered.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div ref={ref} style={{ padding: '3rem 4rem 6rem', maxWidth: '1300px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #e0e0e0', borderTop: '3px solid #2d6a4f', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#888', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>Loading tours...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
            <p style={{ fontFamily: 'Lora, serif', fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>No results found</p>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>Try a different search term</p>
            <button onClick={() => { setSearch(''); setActive('All'); }}
              style={{ marginTop: '1.5rem', background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '999px', padding: '0.7rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
              Reset filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {filtered.map((tour, i) => (
              <motion.div key={tour.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.14)' }}
              >
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                  <img src={tour.image} alt={tour.name}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 60%)' }} />
                  <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: tour.tagColor, color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '999px' }}>{tour.tag}</span>
                  <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.92)', color: DIFFICULTIES[tour.difficulty]?.color || '#555', fontSize: '0.65rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '999px' }}>{tour.difficulty}</span>
                </div>

                <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.3rem' }}>📍 {tour.location}</p>
                  <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.1rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.6rem', lineHeight: 1.3 }}>{tour.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.6, marginBottom: '1rem', flex: 1 }}>{tour.desc}</p>

                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {[{ icon: '⏱', val: tour.duration }, { icon: '🏃', val: tour.activity }].map(({ icon, val }) => (
                      <span key={val} style={{ background: '#f8f8f5', borderRadius: '8px', padding: '0.3rem 0.7rem', fontSize: '0.72rem', color: '#555' }}>{icon} {val}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem' }}>
                    {tour.highlights.slice(0, 3).map((h, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#2d6a4f', fontSize: '0.8rem' }}>✓</span>
                        <span style={{ fontSize: '0.78rem', color: '#555' }}>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f0f0ec', paddingTop: '1rem', gap: '0.5rem' }}>
                    <div>
                      {tour.price ? (
                        <>
                          <span style={{ fontFamily: 'Lora, serif', fontSize: '1.2rem', fontWeight: 700, color: '#2d6a4f' }}>{tour.price} €</span>
                          <span style={{ fontSize: '0.72rem', color: '#888', display: 'block' }}>per person</span>
                        </>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#888', fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>Price on request</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => setContactTour(tour)}
                        style={{ padding: '0.55rem 0.9rem', borderRadius: '10px', border: '2px solid #2d6a4f', color: '#2d6a4f', background: 'transparent', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', whiteSpace: 'nowrap', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#2d6a4f'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2d6a4f'; }}
                      >
                        Contact
                      </button>
                      <button
                        onClick={() => setSelectedTour(tour)}
                        style={{ background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '10px', padding: '0.55rem 1rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#235a40'}
                        onMouseLeave={e => e.currentTarget.style.background = '#2d6a4f'}
                      >
                        Book now →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Modals */}
      <AnimatePresence>
        {selectedTour && <TourModal tour={selectedTour} onClose={() => setSelectedTour(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {contactTour && <ContactModal tour={contactTour} onClose={() => setContactTour(null)} />}
      </AnimatePresence>
    </div>
  );
}

export default function DestinacijePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#faf9f6' }} />}>
      <DestinacijeContent />
    </Suspense>
  );
}