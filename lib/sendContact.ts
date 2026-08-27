const WHATSAPP_NUMBER = '38761102817';

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  tour?: string;
  people?: string;
  date?: string;
}

function buildWhatsappMessage(data: ContactPayload): string {
  const lines = [
    data.tour ? `Booking request — ${data.tour}` : 'New inquiry — Explore Illyria',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    data.people ? `People: ${data.people}` : null,
    data.date ? `Tour date: ${data.date}` : null,
    '',
    data.message,
  ].filter((line): line is string => line !== null);

  return lines.join('\n');
}

export function sendContact(data: ContactPayload): { ok: boolean; error?: string } {
  const text = buildWhatsappMessage(data);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  const win = window.open(url, '_blank', 'noopener,noreferrer');

  if (!win) {
    return { ok: false, error: 'Please allow pop-ups and try again, or message us directly on WhatsApp.' };
  }
  return { ok: true };
}
