'use client';

export function Footer() {
  const companyLinks = [
    { label: 'About us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy policy', href: '#' },
    { label: 'Victorious Travel', href: 'https://victorius.ba/' },
    { label: 'Studentski pohodi', href: 'https://pohodi.ba/' },
    { label: 'Snow Hunters', href: 'https://snowhunters.ba/' },
  ];

  return (
    <footer style={{ background: '#1a2e1e', color: 'white', padding: 'clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 4rem)', borderTop: '1px solid #2d4a32' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="footer-grid-new">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="3" fill="none" opacity="0.4"/>
                <path d="M50 10 Q60 30 70 50 Q60 70 50 90 Q40 70 30 50 Q40 30 50 10Z" fill="white" opacity="0.9"/>
                <path d="M10 50 Q30 40 50 50 Q70 60 90 50" stroke="#f4a261" strokeWidth="3" fill="none" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily: 'Lora, serif', fontSize: '1.1rem', fontWeight: 500 }}>
                Explore <em style={{ color: '#f4a261', fontStyle: 'normal', fontWeight: 700 }}>Illyria</em>
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '280px' }}>
              Discover the beauty of the Balkans with local guides who love their homeland as much as you will.
            </p>
          </div>

          {/* Company */}
          <div>
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#f4a261', marginBottom: '1.2rem' }}>Company</p>
            {companyLinks.map(link => (
              <a key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{ display: 'block', fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', marginBottom: '0.6rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
              >
                {link.label}
                {link.href.startsWith('http') && (
                  <span style={{ fontSize: '0.65rem', marginLeft: '0.3rem', opacity: 0.5 }}>↗</span>
                )}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>© {new Date().getFullYear()} Explore Illyria. All rights reserved.</p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>Sarajevo, Bosnia and Herzegovina</p>
        </div>
      </div>
    </footer>
  );
}
