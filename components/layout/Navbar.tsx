'use client';

import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Tours', href: '/destinacije' },
  { label: 'Activities', href: '/#kategorije' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

interface NavbarProps {
  /** 'dark' = homepage hero glass style; 'light' = interior white style */
  variant?: 'dark' | 'light';
  /** Animates from floating pill → full-width on scroll (destinacije page) */
  scrollTransform?: boolean;
  activePage?: string;
}

export function Navbar({
  variant = 'light',
  scrollTransform = false,
  activePage,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!scrollTransform) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollTransform]);

  // Close menu on route change / resize
  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isDark = variant === 'dark' && !scrolled;

  const navStyle: React.CSSProperties = scrollTransform
    ? {
        position: 'fixed', zIndex: 100,
        top: scrolled ? 0 : '1.5rem',
        left: scrolled ? 0 : '50%',
        transform: scrolled ? 'none' : 'translateX(-50%)',
        width: scrolled ? '100%' : '94%',
        maxWidth: scrolled ? '100%' : '1100px',
        padding: scrolled ? '0.75rem clamp(1rem, 4vw, 3rem)' : '0.75rem 1.5rem',
        borderRadius: scrolled ? 0 : '999px',
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid #eee' : 'none',
        border: scrolled ? undefined : '1px solid rgba(0,0,0,0.08)',
        boxShadow: scrolled
          ? '0 2px 16px rgba(0,0,0,0.07)'
          : '0 4px 24px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition:
          'top 0.3s ease, left 0.3s ease, width 0.3s ease, border-radius 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease',
      }
    : variant === 'dark'
    ? {
        position: 'fixed', zIndex: 100,
        top: '1.5rem', left: '50%', transform: 'translateX(-50%)',
        width: '94%', maxWidth: '1100px',
        padding: '0.75rem 1.5rem', borderRadius: '999px',
        background: 'rgba(0,0,10,0.5)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }
    : {
        position: 'sticky', top: 0, zIndex: 100,
        padding: '0.75rem clamp(1rem, 5vw, 4rem)',
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #eee',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      };

  const linkColor = isDark ? 'rgba(255,255,255,0.7)' : '#555';
  const logoColor = isDark ? 'white' : '#1a1a1a';
  const svgColor = isDark ? 'white' : '#2d6a4f';
  const hamColor = isDark ? 'white' : '#1a1a1a';

  return (
    <>
      <nav style={navStyle}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <svg width="26" height="26" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="48" stroke={svgColor} strokeWidth="3" fill="none" opacity="0.4" />
            <path d="M50 10 Q60 30 70 50 Q60 70 50 90 Q40 70 30 50 Q40 30 50 10Z" fill={svgColor} opacity="0.85" />
            <path d="M10 50 Q30 40 50 50 Q70 60 90 50" stroke="#f4a261" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: 'Lora, serif', fontSize: '1.1rem', color: logoColor, fontWeight: 500 }}>
            Explore{' '}
            <em style={{ color: '#f4a261', fontStyle: 'normal', fontWeight: 700 }}>Illyria</em>
          </span>
        </a>

        {/* Desktop links */}
        <div className="nav-links">
          {NAV_LINKS.map(link => {
            const isActive = activePage === link.label;
            return (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontSize: '0.8rem',
                  color: isActive ? '#2d6a4f' : linkColor,
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                  fontWeight: isActive ? 700 : 400,
                  transition: 'color 0.2s',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = isDark ? 'white' : '#2d6a4f'; }}
                onMouseLeave={e => { e.currentTarget.style.color = isActive ? '#2d6a4f' : linkColor; }}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Desktop CTA — hidden on mobile via CSS */}
        <a
          href="/destinacije"
          className="nav-cta-btn"
          style={{
            background: isDark ? 'rgba(255,255,255,0.15)' : '#2d6a4f',
            color: 'white',
            border: isDark ? '1px solid rgba(255,255,255,0.3)' : 'none',
            borderRadius: '999px',
            padding: '0.55rem 1.3rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            textDecoration: 'none',
            fontFamily: 'Inter, sans-serif',
            backdropFilter: isDark ? 'blur(8px)' : undefined,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
          Explore tours
        </a>

        {/* Hamburger — hidden on desktop via CSS, NOT inline display */}
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '0.4rem', flexDirection: 'column',
            gap: '5px', flexShrink: 0,
          }}
        >
          <span style={{ display: 'block', width: '22px', height: '2px', background: hamColor, borderRadius: '2px', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: hamColor, borderRadius: '2px', transition: 'opacity 0.2s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: hamColor, borderRadius: '2px', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99,
            background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(16px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '2rem',
          }}
        >
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'Lora, serif', fontSize: '2rem',
                color: activePage === link.label ? '#2d6a4f' : '#1a1a1a',
                textDecoration: 'none', fontWeight: 600,
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
