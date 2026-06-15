'use client';

import { useState } from 'react';
import { Footer } from '@/components/sections/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { sendContact } from '@/lib/sendContact';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [errMsg, setErrMsg] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', date: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message || !form.date) {
      setErrMsg('Name, email, message and tour date are required.'); setStatus('error'); return;
    }
    setStatus('loading'); setErrMsg('');
    const res = await sendContact(form);
    if (res.ok) setStatus('success');
    else { setStatus('error'); setErrMsg(res.error ?? 'Failed to send.'); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f6', fontFamily: 'Inter, sans-serif' }}>
      <Navbar variant="light" activePage="Contact" />

      {/* Hero */}
      <div style={{ background: '#1a2e1e', padding: 'clamp(4rem, 10vw, 8rem) clamp(1.25rem, 5vw, 4rem)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem', fontFamily: 'Inter, sans-serif' }}>Get in touch</p>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, color: 'white', lineHeight: 1.15 }}>
          Contact <em style={{ color: '#f4a261', fontStyle: 'italic' }}>us</em>
        </h1>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.25rem, 5vw, 4rem)' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: 'clamp(1.5rem, 4vw, 2.5rem)', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</p>
              <h3 style={{ fontFamily: 'Lora, serif', fontSize: '1.6rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>Message sent!</h3>
              <p style={{ fontSize: '0.9rem', color: '#888' }}>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: 'Lora, serif', fontSize: '1.6rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>Send us a message</h2>
              <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>We'll get back to you within 24 hours.</p>
              <p style={{ fontSize: '0.75rem', color: '#999', fontFamily: 'Inter, sans-serif', marginBottom: '1.2rem' }}>Fields marked <span style={{ color: '#c23a1a' }}>*</span> are required</p>
              {/* Honeypot */}
              <input name="website" type="text" defaultValue="" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {([['name', 'Full name *', 'text'], ['email', 'Email address *', 'email'], ['phone', 'Phone number', 'text']] as const).map(([field, placeholder, type]) => (
                  <input key={field} name={field} type={type}
                    placeholder={placeholder}
                    value={form[field as keyof typeof form]} onChange={handleChange}
                    maxLength={field === 'email' ? 100 : field === 'phone' ? 30 : 100}
                    style={{ border: '1px solid #e0e0e0', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#1a1a1a', width: '100%', boxSizing: 'border-box' }} />
                ))}
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#c23a1a', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: '0.3rem' }}>Desired tour date *</label>
                  <input name="date" type="date"
                    value={form.date} onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ border: '1px solid #c23a1a', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter, sans-serif', color: form.date ? '#1a1a1a' : '#aaa', width: '100%', boxSizing: 'border-box' }} />
                </div>
                <textarea name="message" placeholder="Your message *" value={form.message} onChange={handleChange} rows={5}
                  maxLength={2000}
                  style={{ border: '1px solid #e0e0e0', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.9rem', outline: 'none', fontFamily: 'Inter, sans-serif', color: '#1a1a1a', width: '100%', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.6 }} />
                {status === 'error' && (
                  <p style={{ fontSize: '0.82rem', color: '#c23a1a', margin: 0, fontFamily: 'Inter, sans-serif' }}>{errMsg}</p>
                )}
                <button onClick={handleSubmit} disabled={status === 'loading'}
                  style={{ background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '12px', padding: '1rem', fontSize: '0.9rem', fontWeight: 700, cursor: status === 'loading' ? 'wait' : 'pointer', fontFamily: 'Inter, sans-serif', opacity: status === 'loading' ? 0.7 : 1, marginTop: '0.2rem' }}>
                  {status === 'loading' ? 'Sending...' : 'Send message →'}
                </button>
              </div>
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f0f0ec' }}>
                <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem' }}>Or reach us directly:</p>
                <a href="mailto:explore.illyria.info@gmail.com" style={{ fontSize: '0.85rem', color: '#2d6a4f', fontWeight: 600, textDecoration: 'none' }}>explore.illyria.info@gmail.com</a>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
