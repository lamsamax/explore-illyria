'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const DESTINATIONS = [
  {
    name: 'Stari Most',
    location: 'Mostar, BiH',
    price: 'from 45 KM',
    priceNum: 45,
    rating: 4.9,
    reviews: 312,
    tag: 'Most popular',
    color: '#e8f4f0',
    accent: '#2d6a4f',
    desc: 'Walk the historic 16th century bridge and soak in the spirit of Mostar',
    image: '/images/starimost.jpg',
    duration: '1 day',
    groupSize: '2–15 people',
    difficulty: 'Easy',
    highlights: ['Stari Most 16th century bridge', 'Old Bazaar Kujundžiluk', 'Koski Mehmed Pasha Mosque', 'Crooked Bridge Kriva Ćuprija'],
    included: ['Transport from Sarajevo', 'Licensed local guide', 'Entry tickets', 'Lunch by the river'],
    notIncluded: ['Personal expenses', 'Travel insurance'],
    longDesc: 'Discover the iconic Stari Most bridge, a UNESCO World Heritage Site rebuilt after its destruction in 1993. Stroll through the cobblestone streets of the old bazaar, visit centuries-old mosques, and watch the famous bridge divers leap into the emerald Neretva below. A journey through Ottoman heritage and Herzegovinian warmth.',
  },
  {
    name: 'Plitvice Lakes',
    location: 'Bihać, BiH',
    price: 'from 89 KM',
    priceNum: 89,
    rating: 4.8,
    reviews: 520,
    tag: 'Nature',
    color: '#e8f0f8',
    accent: '#1a6b9a',
    desc: '16 terraced lakes in a breathtaking national park',
    image: '/images/plitvicka.webp',
    duration: '1 day',
    groupSize: '2–15 people',
    difficulty: 'Easy',
    highlights: ['16 interconnected terraced lakes', 'Veliki Slap — tallest waterfall', 'UNESCO protected nature', 'Wooden walkways over water'],
    included: ['Transport from Sarajevo', 'Licensed guide', 'National park entry ticket', 'Packed lunch'],
    notIncluded: ['Personal expenses', 'Travel insurance'],
    longDesc: 'Plitvice Lakes National Park is one of Europe\'s most stunning natural wonders — 16 terraced lakes connected by waterfalls, surrounded by dense forests. Walk the wooden boardwalks above turquoise waters, take a boat across the largest lake, and witness nature at its most spectacular.',
  },
  {
    name: 'Počitelj',
    location: 'Čapljina, BiH',
    price: 'from 35 KM',
    priceNum: 35,
    rating: 4.9,
    reviews: 187,
    tag: 'UNESCO',
    color: '#f8f0e8',
    accent: '#c25b1a',
    desc: 'Ottoman fortress-town on the Neretva riverbank — history at every step',
    image: '/images/pocitelj.jpg',
    duration: '4 hours',
    groupSize: '2–20 people',
    difficulty: 'Easy',
    highlights: ['Šišman Ibrahim-pasha Mosque', 'Medieval fortress tower', 'Panoramic views of Neretva', 'Local art studios'],
    included: ['Licensed guide', 'Entry fees', 'Tour organisation'],
    notIncluded: ['Transport', 'Personal expenses'],
    longDesc: 'Počitelj is a perfectly preserved Ottoman-era town carved into a hillside above the Neretva River. Its medieval tower, mosque, and stone houses create one of the most photogenic scenes in the Balkans. Wander narrow lanes, climb to the fortress for sweeping views, and browse local artists\' studios.',
  },
  {
    name: 'Rafting Neretva',
    location: 'Konjic, BiH',
    price: 'from 120 KM',
    priceNum: 120,
    rating: 5.0,
    reviews: 145,
    tag: 'Adventure',
    color: '#f0f8e8',
    accent: '#4a7c1f',
    desc: 'Adrenaline ride through the Neretva canyon amid untouched nature',
    image: '/images/raftingn.jpg',
    duration: '1 day',
    groupSize: '4–20 people',
    difficulty: 'Medium',
    highlights: ['12 km rafting route', 'Professional instructors', 'All equipment included', 'Lunch by the river'],
    included: ['Transport from Sarajevo', 'Rafting guide & safety gear', 'Wetsuit & helmet', 'Riverside lunch'],
    notIncluded: ['Personal expenses', 'Travel insurance'],
    longDesc: 'The emerald Neretva River carves through dramatic canyons south of Konjic, offering one of Bosnia\'s most exhilarating rafting experiences. Navigate exciting rapids and calm stretches alike, surrounded by sheer canyon walls and pristine forest. Suitable for beginners and experienced rafters.',
  },
  {
    name: 'Sarajevo',
    location: 'Sarajevo, BiH',
    price: 'from 35 KM',
    priceNum: 35,
    rating: 4.8,
    reviews: 634,
    tag: 'Gastro',
    color: '#f8ebe8',
    accent: '#c23a1a',
    desc: 'The city where East meets West — culture, food, and history',
    image: '/images/sarajevo.webp',
    duration: '3–4 hours',
    groupSize: '2–20 people',
    difficulty: 'Easy',
    highlights: ['Baščaršija Ottoman bazaar', 'Vijećnica City Hall', 'Latin Bridge — WWI site', 'Bosnian coffee ritual'],
    included: ['Licensed city guide', 'Bosnian coffee', 'Cable car to Trebević'],
    notIncluded: ['Meals', 'Transport to Sarajevo'],
    longDesc: 'Sarajevo is unlike any other European capital — a city where Ottoman mosques stand beside Catholic cathedrals, Jewish synagogues, and Orthodox churches. Walk from the cobblestones of Baščaršija to the grand Austro-Hungarian boulevards, taste ćevapi at a century-old grill, and feel the remarkable resilience of this extraordinary city.',
  },
  {
    name: 'Vrelo Bosne',
    location: 'Ilidža, BiH',
    price: 'from 25 KM',
    priceNum: 25,
    rating: 4.7,
    reviews: 298,
    tag: 'Nature',
    color: '#ece8f8',
    accent: '#5b3ab5',
    desc: 'Idyllic park at the source of the Bosna River — a walk through pristine nature',
    image: '/images/vrelob.jpg',
    duration: '2 hours',
    groupSize: '2–20 people',
    difficulty: 'Easy',
    highlights: ['Source of the Bosna River', 'Horse-drawn carriage ride', 'Austro-Hungarian tree avenue', 'Crystal clear springs'],
    included: ['Licensed guide', 'Carriage ride', 'Tour organisation'],
    notIncluded: ['Transport', 'Personal expenses'],
    longDesc: 'Just minutes from Sarajevo, Vrelo Bosne is a tranquil park where the Bosna River springs from the earth in a series of crystal-clear pools. Ride a horse-drawn carriage along the grand tree-lined avenue, stroll wooden bridges over the rushing springs, and enjoy the peaceful escape from the city.',
  },
];

type Dest = typeof DESTINATIONS[0];

function DestModal({ dest, onClose }: { dest: Dest; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.96 }}
        transition={{ duration: 0.35 }}
        className="modal-grid"
        style={{
          background: 'white', borderRadius: '24px',
          width: '100%', maxWidth: '900px',
          maxHeight: '90vh', overflow: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Left — image */}
        <div className="modal-img-side">
          <img src={dest.image} alt={dest.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '24px 0 0 24px' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)', borderRadius: '24px 0 0 24px' }} />

          <span style={{ position: 'absolute', top: '1.2rem', left: '1.2rem', background: dest.accent, color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '0.3rem 0.8rem', borderRadius: '999px', fontFamily: 'Inter, sans-serif' }}>
            {dest.tag}
          </span>

          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', marginBottom: '0.3rem', fontFamily: 'Inter, sans-serif' }}>📍 {dest.location}</p>
            <h2 style={{ fontFamily: 'Lora, serif', fontSize: '2rem', fontWeight: 700, color: 'white', margin: '0 0 0.5rem 0' }}>{dest.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#f4a261', fontSize: '0.9rem' }}>{s}</span>)}
              <span style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{dest.rating}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>({dest.reviews} reviews)</span>
            </div>
          </div>
        </div>

        {/* Right — details */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', overflowY: 'auto' }}>

          {/* Close button */}
          <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>×</button>

          {/* Meta */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {[
              { icon: '⏱', label: 'Duration', value: dest.duration },
              { icon: '👥', label: 'Group size', value: dest.groupSize },
              { icon: '🏃', label: 'Difficulty', value: dest.difficulty },
              { icon: '💰', label: 'Price', value: dest.price },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ background: '#f8f8f5', borderRadius: '10px', padding: '0.7rem 0.9rem' }}>
                <p style={{ fontSize: '0.65rem', color: '#999', margin: '0 0 0.2rem', fontFamily: 'Inter, sans-serif' }}>{icon} {label}</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', margin: 0, fontFamily: 'Inter, sans-serif' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.7, fontFamily: 'Inter, sans-serif', margin: 0 }}>
            {dest.longDesc}
          </p>

          {/* Highlights */}
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1a1a1a', marginBottom: '0.6rem', fontFamily: 'Inter, sans-serif' }}>
              Highlights
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
              {dest.highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <span style={{ color: '#2d6a4f', fontSize: '0.8rem', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '0.78rem', color: '#444', fontFamily: 'Inter, sans-serif' }}>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Included / Not included */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div style={{ background: '#f0f8f4', borderRadius: '12px', padding: '1rem' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#2d6a4f', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif' }}>✓ Included</p>
              {dest.included.map((item, i) => (
                <p key={i} style={{ fontSize: '0.75rem', color: '#444', margin: '0 0 0.25rem', fontFamily: 'Inter, sans-serif' }}>+ {item}</p>
              ))}
            </div>
            <div style={{ background: '#fdf5f5', borderRadius: '12px', padding: '1rem' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#c23a1a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif' }}>✗ Not included</p>
              {dest.notIncluded.map((item, i) => (
                <p key={i} style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 0.25rem', fontFamily: 'Inter, sans-serif' }}>— {item}</p>
              ))}
            </div>
          </div>

          {/* Booking form */}
          {!submitted ? (
            <div style={{ borderTop: '1px solid #eee', paddingTop: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontFamily: 'Lora, serif', fontSize: '1.8rem', fontWeight: 700, color: '#2d6a4f' }}>{dest.price}</span>
                <span style={{ fontSize: '0.75rem', color: '#888', fontFamily: 'Inter, sans-serif' }}>per person</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {['Full name', 'Email address', 'Phone number', 'Number of people'].map(field => (
                  <input key={field} type="text" placeholder={field}
                    style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.85rem', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#1a1a1a', boxSizing: 'border-box' }} />
                ))}
                <button
                  onClick={() => setSubmitted(true)}
                  style={{ background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '12px', padding: '0.9rem', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginTop: '0.2rem', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#235a40'}
                  onMouseLeave={e => e.currentTarget.style.background = '#2d6a4f'}
                >
                  Send booking request →
                </button>
              </div>
            </div>
          ) : (
            <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', textAlign: 'center', padding: '2rem' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>✅</p>
              <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.4rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>Request sent!</h3>
              <p style={{ fontSize: '0.85rem', color: '#888', fontFamily: 'Inter, sans-serif' }}>Our team will contact you shortly to confirm your booking.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Destinations() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  const [selected, setSelected] = useState<Dest | null>(null);

  return (
    <>
      <section ref={ref} style={{ background: '#faf9f6', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.25rem, 5vw, 4rem) clamp(4rem, 8vw, 6rem)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '3rem' }}
        >
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#2d6a4f', marginBottom: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
            Popular destinations
          </p>
          <div className="dest-header">
            <h2 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 600, color: '#1a1a1a', lineHeight: 1.2 }}>
              Where do you want<br /><em style={{ color: '#f4a261', fontStyle: 'italic' }}>to go?</em>
            </h2>
            <a href="/destinacije" style={{ fontSize: '0.85rem', color: '#2d6a4f', fontWeight: 600, textDecoration: 'none', borderBottom: '2px solid #2d6a4f', paddingBottom: '2px', fontFamily: 'Inter, sans-serif' }}>
              View all destinations →
            </a>
          </div>
        </motion.div>

        {inView && (
          <div className="destinations-grid">
            {DESTINATIONS.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  borderRadius: '20px', cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                  height: '420px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                }}
                whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.18)' }}
                className="dest-card"
              >
                {dest.image ? (
                  <img src={dest.image} alt={dest.name}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: dest.color }} />
                )}

                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)' }} />

                {dest.tag && (
                  <span style={{ position: 'absolute', top: '1.2rem', left: '1.2rem', background: dest.accent, color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '0.3rem 0.8rem', borderRadius: '999px', letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif', zIndex: 4 }}>
                    {dest.tag}
                  </span>
                )}

                {/* Hover overlay */}
                <div className="dest-overlay" style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.55)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.3s ease', zIndex: 5,
                }}>
                  <button
                    onClick={() => setSelected(dest)}
                    style={{
                      background: 'white', color: '#1a1a1a', border: 'none',
                      borderRadius: '999px', padding: '0.9rem 2.2rem',
                      fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      transform: 'translateY(10px)',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#2d6a4f'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#1a1a1a'; }}
                  >
                    Book now →
                  </button>
                </div>

                {/* Content */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', zIndex: 4 }}>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem', letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif' }}>{dest.location}</p>
                  <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>{dest.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: '1rem', fontFamily: 'Inter, sans-serif' }}>{dest.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ color: '#f4a261', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Inter, sans-serif' }}>{dest.price}</span>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}> / per person</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ color: '#f4a261' }}>★</span>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'white', fontFamily: 'Inter, sans-serif' }}>{dest.rating}</span>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>({dest.reviews})</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && <DestModal dest={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}