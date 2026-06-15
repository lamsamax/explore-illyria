import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// In-memory rate limiter: max 5 submissions per IP per minute
const rateLimitMap = new Map<string, { count: number; ts: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const maxReq = 5;
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.ts > windowMs) {
    rateLimitMap.set(ip, { count: 1, ts: now });
    return false;
  }
  if (entry.count >= maxReq) return true;
  entry.count++;
  return false;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a minute.' },
      { status: 429 }
    );
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot — bots fill this hidden field, real users never see it
  if (body.website) {
    return NextResponse.json({ ok: true }); // silently accept
  }

  const name = body.name?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const phone = body.phone?.trim() ?? '';
  const message = body.message?.trim() ?? '';
  const tour = body.tour?.trim() ?? '';
  const people = body.people?.trim() ?? '';

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, email and message are required.' },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const subject = tour
    ? `Booking request — ${escapeHtml(tour)}`
    : `Contact from ${escapeHtml(name)}`;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <div style="background:#1a2e1e;padding:1.5rem 2rem;border-radius:12px 12px 0 0">
        <h2 style="color:white;margin:0;font-size:1.2rem;font-weight:600">
          ${tour ? `Booking request — ${escapeHtml(tour)}` : 'New contact message'}
        </h2>
        <p style="color:rgba(255,255,255,0.6);margin:0.3rem 0 0;font-size:0.85rem">
          Explore Illyria website
        </p>
      </div>
      <div style="border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px;padding:1.5rem 2rem">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 4px;color:#888;width:110px;font-size:0.85rem">Name</td><td style="padding:8px 4px;font-weight:600">${escapeHtml(name)}</td></tr>
          <tr style="background:#f8f8f5"><td style="padding:8px 4px;color:#888;font-size:0.85rem">Email</td><td style="padding:8px 4px"><a href="mailto:${escapeHtml(email)}" style="color:#2d6a4f">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding:8px 4px;color:#888;font-size:0.85rem">Phone</td><td style="padding:8px 4px">${escapeHtml(phone) || '—'}</td></tr>
          ${tour ? `<tr style="background:#f8f8f5"><td style="padding:8px 4px;color:#888;font-size:0.85rem">Tour</td><td style="padding:8px 4px;font-weight:600;color:#2d6a4f">${escapeHtml(tour)}</td></tr>` : ''}
          ${people ? `<tr><td style="padding:8px 4px;color:#888;font-size:0.85rem">People</td><td style="padding:8px 4px">${escapeHtml(people)}</td></tr>` : ''}
          <tr ${tour || people ? '' : 'style="background:#f8f8f5"'}><td style="padding:8px 4px;color:#888;font-size:0.85rem;vertical-align:top">Message</td><td style="padding:8px 4px;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</td></tr>
        </table>
        <p style="margin-top:1.5rem;font-size:0.75rem;color:#bbb;border-top:1px solid #eee;padding-top:1rem">
          Reply directly to this email to respond to ${escapeHtml(name)}.
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Explore Illyria" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact API] email error:', err);
    return NextResponse.json(
      { error: 'Failed to send. Please email us directly at explore.illyria.info@gmail.com' },
      { status: 500 }
    );
  }
}
