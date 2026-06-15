export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  tour?: string;
  people?: string;
}

export async function sendContact(
  data: ContactPayload
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // website is the honeypot field — always empty for real users
      body: JSON.stringify({ ...data, website: '' }),
    });
    const json = await res.json();
    if (!res.ok) return { ok: false, error: json.error };
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error. Please try again.' };
  }
}
