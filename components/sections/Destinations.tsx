'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { sendContact } from '@/lib/sendContact';

type Tour = {
  id: number;
  name: string;
  location: string;
  price: number | null;
  price_label: string;
  tag: string;
  tag_color: string;
  color: string;
  description: string;
  image: string;
  duration: string;
  activity: string;
  difficulty: string;
  highlights: string[];
  included: string[];
  not_included: string[];
  long_desc: string;
};

type BookStatus = 'idle' | 'loading' | 'success' | 'error';

function DestModal({ dest, onClose }: { dest: Tour; onClose: () => void }) {
  const [status, setStatus] = useState<BookStatus>('idle');
  const [errMsg, setErrMsg] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', people: '', date: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBook = async () => {
    if (!form.name || !form.email || !form.date) { setErrMsg('Name, email and tour date are required.'); setStatus('error'); return; }
    setStatus('loading'); setErrMsg('');
    const res = await sendContact({
      name: form.name, email: form.email, phone: form.phone, people: form.people, date: form.date,
      tour: dest.name,
      message: `Booking request for ${dest.name}${form.people ? ` — ${form.people} people` : ''}.`,
    });
    if (res.ok) setStatus('success');
    else { setStatus('error'); setErrMsg(res.error ?? 'Failed to send.'); }
  };

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
        transition={{ duration: 0.35 }}
        className="modal-grid"
        style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflow: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Left — image */}
        <div className="modal-img-side">
          <img src={dest.image} alt={dest.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '24px 0 0 24px' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)', borderRadius: '24px 0 0 24px' }} />
          <span style={{ position: 'absolute', top: '1.2rem', left: '1.2rem', background: dest.tag_color, color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '0.3rem 0.8rem', borderRadius: '999px', fontFamily: 'Inter, sans-serif' }}>
            {dest.tag}
          </span>
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', marginBottom: '0.3rem', fontFamily: 'Inter, sans-serif' }}>📍 {dest.location}</p>
            <h2 style={{ fontFamily: 'Lora, serif', fontSize: '2rem', fontWeight: 700, color: 'white', margin: '0 0 0.3rem 0' }}>{dest.name}</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', margin: 0 }}>{dest.duration} · {dest.activity}</p>
          </div>
        </div>

        {/* Right — details */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', overflowY: 'auto', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>×</button>

          {/* Meta */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '0.5rem' }}>
            {[
              { icon: '⏱', label: 'Duration', value: dest.duration },
              { icon: '🏃', label: 'Activity', value: dest.activity },
              { icon: '📊', label: 'Difficulty', value: dest.difficulty },
              { icon: '💰', label: 'Price', value: dest.price ? `${dest.price} €` : dest.price_label },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ background: '#f8f8f5', borderRadius: '10px', padding: '0.7rem 0.9rem' }}>
                <p style={{ fontSize: '0.65rem', color: '#999', margin: '0 0 0.2rem', fontFamily: 'Inter, sans-serif' }}>{icon} {label}</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', margin: 0, fontFamily: 'Inter, sans-serif' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: 1.7, fontFamily: 'Inter, sans-serif', margin: 0 }}>{dest.long_desc}</p>

          {/* Highlights */}
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1a1a1a', marginBottom: '0.6rem', fontFamily: 'Inter, sans-serif' }}>Highlights</p>
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
              {dest.not_included.map((item, i) => (
                <p key={i} style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 0.25rem', fontFamily: 'Inter, sans-serif' }}>— {item}</p>
              ))}
            </div>
          </div>

          {/* Booking */}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '1.2rem' }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <p style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>✅</p>
                <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.4rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>Request sent!</h3>
                <p style={{ fontSize: '0.85rem', color: '#888', fontFamily: 'Inter, sans-serif' }}>Our team will contact you shortly.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontFamily: 'Lora, serif', fontSize: '1.8rem', fontWeight: 700, color: '#2d6a4f' }}>
                    {dest.price ? `${dest.price} €` : 'Custom pricing'}
                  </span>
                  {dest.price && <span style={{ fontSize: '0.75rem', color: '#888', fontFamily: 'Inter, sans-serif' }}>per person</span>}
                </div>
                <p style={{ fontSize: '0.72rem', color: '#999', fontFamily: 'Inter, sans-serif', marginBottom: '0.2rem' }}>Fields marked <span style={{ color: '#c23a1a' }}>*</span> are required</p>
                {/* Honeypot */}
                <input name="website" type="text" defaultValue="" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {([['name','Full name *'],['email','Email address *'],['phone','Phone number'],['people','Number of people']] as const).map(([name, placeholder]) => (
                    <input key={name} name={name} type={name === 'email' ? 'email' : 'text'} placeholder={placeholder}
                      value={form[name as keyof typeof form]} onChange={handleChange}
                      maxLength={name === 'email' ? 100 : name === 'people' ? 10 : name === 'phone' ? 30 : 100}
                      style={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.85rem', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#1a1a1a', boxSizing: 'border-box' }} />
                  ))}
                  <input name="date" type="date"
                    value={form.date} onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ width: '100%', border: '1px solid #c23a1a', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.85rem', outline: 'none', fontFamily: 'Inter, sans-serif', color: form.date ? '#1a1a1a' : '#aaa', boxSizing: 'border-box' }} />
                  <p style={{ fontSize: '0.72rem', color: '#c23a1a', margin: '-0.2rem 0 0', fontFamily: 'Inter, sans-serif' }}>* Tour date required</p>
                  {status === 'error' && <p style={{ fontSize: '0.8rem', color: '#c23a1a', margin: 0, fontFamily: 'Inter, sans-serif' }}>{errMsg}</p>}
                  <button onClick={handleBook} disabled={status === 'loading'}
                    style={{ background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '12px', padding: '0.9rem', fontSize: '0.9rem', fontWeight: 700, cursor: status === 'loading' ? 'wait' : 'pointer', fontFamily: 'Inter, sans-serif', marginTop: '0.2rem', opacity: status === 'loading' ? 0.7 : 1 }}>
                    {status === 'loading' ? 'Sending...' : 'Send booking request →'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Destinations() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });
  const [selected, setSelected] = useState<Tour | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('tours')
      .select('id,name,location,price,price_label,tag,tag_color,color,description,image,duration,activity,difficulty,highlights,included,not_included,long_desc')
      .order('id')
      .limit(6)
      .then(({ data }) => {
        if (data) setTours(data as Tour[]);
        setLoading(false);
      });
  }, []);

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

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e0e0e0', borderTop: '3px solid #2d6a4f', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : inView && tours.length > 0 ? (
          <div className="destinations-grid">
            {tours.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ borderRadius: '20px', cursor: 'pointer', position: 'relative', overflow: 'hidden', height: '420px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}
                whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.18)' }}
                className="dest-card"
                onClick={() => setSelected(dest)}
              >
                <img src={dest.image} alt={dest.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)' }} />

                {dest.tag && (
                  <span style={{ position: 'absolute', top: '1.2rem', left: '1.2rem', background: dest.tag_color, color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '0.3rem 0.8rem', borderRadius: '999px', letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif', zIndex: 4 }}>
                    {dest.tag}
                  </span>
                )}

                {/* Hover overlay */}
                <div className="dest-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease', zIndex: 5 }}>
                  <button
                    onClick={e => { e.stopPropagation(); setSelected(dest); }}
                    style={{ background: 'white', color: '#1a1a1a', border: 'none', borderRadius: '999px', padding: '0.9rem 2.2rem', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transform: 'translateY(10px)', transition: 'all 0.3s ease', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#2d6a4f'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#1a1a1a'; }}
                  >
                    Book now →
                  </button>
                </div>

                {/* Card content */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', zIndex: 4 }}>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.3rem', letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif' }}>{dest.location}</p>
                  <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>{dest.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: '1rem', fontFamily: 'Inter, sans-serif' }}>{dest.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#f4a261', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Inter, sans-serif' }}>
                      {dest.price ? `from ${dest.price} €` : dest.price_label}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif' }}>per person</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : null}
      </section>

      <AnimatePresence>
        {selected && <DestModal dest={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
