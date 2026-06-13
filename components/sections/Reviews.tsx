'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const FEATURED_TOURS = [
  {
    id: 1,
    tag: '🔥 Tour of the week',
    name: 'Stari Most & Kravice',
    subtitle: 'Mostar — Kravice — Počitelj',
    duration: '1 day',
    groupSize: '2–15 people',
    difficulty: 'Easy',
    language: 'Bosnian / English',
    price: 89,
    oldPrice: 120,
    rating: 4.9,
    reviews: 312,
    included: ['Transport from Sarajevo', 'Local guide', 'Entry tickets', 'Lunch by the river'],
    notIncluded: ['Personal expenses', 'Insurance'],
    highlights: ['16th century Stari Most', 'Kravice Waterfall', 'Ottoman town Počitelj', 'Local specialties tasting'],
    desc: 'A full-day tour combining three gems of Herzegovina — historic Mostar, the crystal cascades of Kravice, and the fortress of Počitelj. Perfect for those who want to see the most in a single day.',
    image: '/images/kravice.webp',
    spots: 4,
  },
  {
    id: 2,
    tag: '⭐ Bestseller',
    name: 'Sarajevo City Tour',
    subtitle: 'Baščaršija — Vijećnica — Trebević',
    duration: '4 hours',
    groupSize: '2–20 people',
    difficulty: 'Easy',
    language: 'Bosnian / English',
    price: 45,
    oldPrice: 65,
    rating: 4.8,
    reviews: 634,
    included: ['Local guide', 'Coffee in the old bazaar', 'Cable car ticket'],
    notIncluded: ['Transport to Sarajevo', 'Lunch'],
    highlights: ['Baščaršija & Sebilj', 'Vijećnica — Austro-Hungarian gem', 'View from Trebević', 'Sniper Alley'],
    desc: 'Discover the soul of Sarajevo with a local guide who knows every corner. From Ottoman fountains to Austro-Hungarian facades — a city where civilisations meet.',
    image: '/images/sarajevo.webp',
    spots: 8,
  },
];

type FeaturedTour = typeof FEATURED_TOURS[0];

function BookingModal({ tour, onClose }: { tour: FeaturedTour; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', people: '', date: '' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', padding: '1rem' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: 0.25 }}
        style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '460px', overflow: 'hidden', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header with image */}
        <div style={{ position: 'relative', height: '140px' }}>
          <img src={tour.image} alt={tour.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)' }} />
          <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', right: '3rem' }}>
            <p style={{ fontFamily: 'Lora, serif', fontSize: '1.3rem', fontWeight: 700, color: 'white', margin: 0 }}>{tour.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif', margin: '0.2rem 0 0' }}>📍 {tour.subtitle}</p>
          </div>
        </div>

        <button onClick={onClose}
          style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.4)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1.1rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          ×
        </button>

        <div style={{ padding: '1.8rem' }}>
          {!submitted ? (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: 'Lora, serif', fontSize: '2rem', fontWeight: 700, color: '#2d6a4f' }}>{tour.price} €</span>
                <span style={{ fontSize: '0.95rem', color: '#bbb', textDecoration: 'line-through', fontFamily: 'Inter, sans-serif' }}>{tour.oldPrice} €</span>
                <span style={{ fontSize: '0.75rem', color: '#888', fontFamily: 'Inter, sans-serif' }}>/ per person</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  {[
                    { name: 'name', placeholder: 'Full name', type: 'text' },
                    { name: 'email', placeholder: 'Email address', type: 'email' },
                    { name: 'phone', placeholder: 'Phone number', type: 'text' },
                    { name: 'people', placeholder: 'Number of people', type: 'number' },
                  ].map(f => (
                    <input key={f.name} name={f.name} type={f.type} placeholder={f.placeholder}
                      value={form[f.name as keyof typeof form]} onChange={handleChange}
                      style={{ border: '1px solid #e0e0e0', borderRadius: '10px', padding: '0.7rem 0.9rem', fontSize: '0.85rem', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#1a1a1a', width: '100%', boxSizing: 'border-box' }} />
                  ))}
                </div>
                <input name="date" type="date" value={form.date} onChange={handleChange}
                  style={{ border: '1px solid #e0e0e0', borderRadius: '10px', padding: '0.7rem 0.9rem', fontSize: '0.85rem', outline: 'none', fontFamily: 'Inter, sans-serif', color: form.date ? '#1a1a1a' : '#999', width: '100%', boxSizing: 'border-box' }} />
                <button
                  onClick={() => setSubmitted(true)}
                  style={{ background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '12px', padding: '0.95rem', fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s', marginTop: '0.2rem', boxShadow: '0 4px 16px rgba(45,106,79,0.25)' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#235a40'}
                  onMouseLeave={e => e.currentTarget.style.background = '#2d6a4f'}
                >
                  Send booking request →
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <p style={{ fontSize: '2.8rem', marginBottom: '0.8rem' }}>✅</p>
              <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.4rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>Request sent!</h3>
              <p style={{ fontSize: '0.85rem', color: '#888', fontFamily: 'Inter, sans-serif' }}>Our team will contact you shortly to confirm your booking.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Reviews() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  const [active, setActive] = useState(0);
  const [bookingTour, setBookingTour] = useState<FeaturedTour | null>(null);
  const tour = FEATURED_TOURS[active];

  return (
    <section id="istaknute" ref={ref} style={{ background: '#faf9f6', padding: '5rem 4rem', borderTop: '1px solid #eee' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#2d6a4f', marginBottom: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
          Don't miss out
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h2 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 600, color: '#1a1a1a', lineHeight: 1.2 }}>
            Featured <em style={{ color: '#f4a261', fontStyle: 'italic' }}>tours</em>
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {FEATURED_TOURS.map((t, i) => (
              <button key={t.id} onClick={() => setActive(i)}
                style={{ padding: '0.5rem 1.2rem', borderRadius: '999px', border: `2px solid ${active === i ? '#2d6a4f' : '#e0e0e0'}`, background: active === i ? '#2d6a4f' : 'white', color: active === i ? 'white' : '#888', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}
              >
                {t.tag}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {inView && (
        <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}
        >
          {/* Left side — image */}
          <div style={{ position: 'relative', minHeight: '520px' }}>
            <img src={tour.image} alt={tour.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)' }} />

            <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: '#f4a261', color: 'white', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
              {tour.tag}
            </div>


            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Lora, serif', fontSize: '2rem', fontWeight: 700, color: 'white', margin: '0 0 0.3rem 0' }}>{tour.name}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif', margin: 0 }}>📍 {tour.subtitle}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.6rem' }}>
                {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#f4a261' }}>{s}</span>)}
                <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700 }}>{tour.rating}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>({tour.reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Right side — details */}
          <div style={{ background: 'white', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              {[
                { icon: '⏱', label: 'Duration', value: tour.duration },
                { icon: '👥', label: 'Group', value: tour.groupSize },
                { icon: '🏃', label: 'Difficulty', value: tour.difficulty },
                { icon: '🗣', label: 'Language', value: tour.language },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ background: '#f8f8f5', borderRadius: '12px', padding: '0.8rem 1rem' }}>
                  <p style={{ fontSize: '0.7rem', color: '#999', marginBottom: '0.2rem', fontFamily: 'Inter, sans-serif' }}>{icon} {label}</p>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1a1a1a', fontFamily: 'Inter, sans-serif' }}>{value}</p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '0.88rem', color: '#555', lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>{tour.desc}</p>

            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.6rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                What you'll see
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {tour.highlights.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ color: '#2d6a4f', fontSize: '0.9rem' }}>✓</span>
                    <span style={{ fontSize: '0.85rem', color: '#444', fontFamily: 'Inter, sans-serif' }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'Lora, serif', fontSize: '2.2rem', fontWeight: 700, color: '#2d6a4f' }}>{tour.price} €</span>
                  <span style={{ fontSize: '1rem', color: '#bbb', textDecoration: 'line-through', fontFamily: 'Inter, sans-serif' }}>{tour.oldPrice} €</span>
                </div>
                <p style={{ fontSize: '0.72rem', color: '#888', fontFamily: 'Inter, sans-serif', margin: 0 }}>per person · VAT included</p>
              </div>
              <button
                onClick={() => setBookingTour(tour)}
                style={{ background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '14px', padding: '1rem 2rem', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(45,106,79,0.3)' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#235a40'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#2d6a4f'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Book now →
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {bookingTour && <BookingModal tour={bookingTour} onClose={() => setBookingTour(null)} />}
      </AnimatePresence>
    </section>
  );
}