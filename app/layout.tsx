import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Explore Illyria – Discover the Balkans',
  description: 'Authentic journeys through Bosnia and Herzegovina, Croatia, Montenegro, and the rest of the Balkans.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bs">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes globeBreath {
            0%   { transform: scale(1.05); }
            50%  { transform: scale(1.1); }
            100% { transform: scale(1.05); }
          }
          @keyframes globePulse {
            0%   { box-shadow: 0 0 60px rgba(45,106,79,0.5), 0 0 120px rgba(45,106,79,0.2); }
            50%  { box-shadow: 0 0 90px rgba(244,162,97,0.6), 0 0 180px rgba(244,162,97,0.2); }
            100% { box-shadow: 0 0 60px rgba(45,106,79,0.5), 0 0 120px rgba(45,106,79,0.2); }
          }
          @keyframes hintBlink {
            0%, 100% { opacity: 0.5; }
            50%       { opacity: 1; }
          }
          @keyframes progressLine {
            0%   { width: 0%; }
            100% { width: 100%; }
          }
          #globe-wrapper {
            animation: globePulse 3s ease-in-out infinite;
          }
          #globe-wrapper:hover {
            animation: none;
            box-shadow: 0 0 120px rgba(244,162,97,0.8), 0 0 240px rgba(244,162,97,0.3) !important;
          }
          #globe-img {
            animation: globeBreath 4s ease-in-out infinite;
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          }
          #globe-wrapper:hover #globe-img {
            animation-play-state: paused;
          }
          #globe-hint {
            animation: hintBlink 2s ease-in-out infinite;
          }
        `}</style>
      </head>
      <body>

        {/* INTRO — Globe slika koja diše */}
        <div id="intro-screen"
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: 'radial-gradient(ellipse at center, #050a1a 0%, #000005 100%)',
          }}
        >
          {/* Zvijezde */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.8) 0%, transparent 100%), radial-gradient(1px 1px at 80% 10%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 50% 80%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 10% 60%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 90% 70%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(2px 2px at 35% 15%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 65% 45%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 15% 85%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 75% 55%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 45% 25%, rgba(255,255,255,0.6) 0%, transparent 100%)',
          }} />

          {/* Globe wrapper */}
          <div id="globe-wrapper"
            style={{
              width: '460px', height: '460px',
              borderRadius: '50%',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
              background: '#000010',
            }}
          >
            <img
              id="globe-img"
              src="/globe.jpeg"
              alt="Globus"
            />
          </div>

          {/* Hint */}
          <p id="globe-hint"
            style={{
              marginTop: '2rem',
              fontSize: '0.7rem',
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'Inter, sans-serif',
              transition: 'opacity 0.4s',
            }}
          >
            ↑ Click to begin
          </p>

          {/* Logo */}
          <p style={{
            marginTop: '0.8rem',
            fontFamily: 'Lora, serif',
            fontSize: '1.6rem',
            color: 'white',
            letterSpacing: '0.08em',
          }}>
            Explore{' '}
            <em style={{ color: '#f4a261', fontStyle: 'normal', fontWeight: 700 }}>Illyria</em>
          </p>
        </div>

        {/* Klik handler */}
        <script dangerouslySetInnerHTML={{ __html: `
(function() {
  // Prikaži intro samo prvi put, ne pri svakom page navigiranju
  var seen = sessionStorage.getItem('intro-seen');
  var intro = document.getElementById('intro-screen');
  if (seen && intro) {
    intro.style.display = 'none';
  }
  var wrapper = document.getElementById('globe-wrapper');
  var img = document.getElementById('globe-img');
  var hint = document.getElementById('globe-hint');
  var intro = document.getElementById('intro-screen');
  var clicked = false;

  if (!wrapper) return;

  wrapper.addEventListener('click', function() {
    if (clicked) return;
    clicked = true;

    img.style.animationPlayState = 'paused';
    hint.style.opacity = '0';

    var start = null;
    var duration = 1000;

    function zoomAnim(ts) {
      if (!start) start = ts;
      var elapsed = ts - start;
      var t = Math.min(elapsed / duration, 1);
      var ease = t * t * (3 - 2 * t);

      var scale = 1 + ease * 12;
      var opacity = 1 - ease * 0.9;

      wrapper.style.transform = 'scale(' + scale + ')';
      wrapper.style.opacity = opacity;
      intro.style.opacity = String(1 - ease * 0.7);

      if (t < 1) {
        requestAnimationFrame(zoomAnim);
      } else {
        intro.style.transition = 'opacity 0.3s';
        intro.style.opacity = '0';
        setTimeout(function() {
          intro.style.display = 'none';
          sessionStorage.setItem('intro-seen', '1');
        }, 350);
      }
    }

    requestAnimationFrame(zoomAnim);
  });
})();
        `}} />

        {children}
      </body>
    </html>
  );
}