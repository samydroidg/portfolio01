export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  honey?: string;
}

export interface ContactSubmitResult {
  ok: boolean;
  error?: string;
}

const FORM_SUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/gouravojha.2005@gmail.com';

const IP_LOOKUP_URL = 'https://api.ipify.org?format=json';
const IP_LOOKUP_TIMEOUT_MS = 1500;

async function fetchClientIp(): Promise<string> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), IP_LOOKUP_TIMEOUT_MS);
    try {
      const response = await fetch(IP_LOOKUP_URL, { signal: controller.signal });
      if (!response.ok) return '';
      const data = (await response.json()) as { ip?: string };
      return data.ip ?? '';
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return '';
  }
}

function buildPayload(payload: ContactPayload, ip: string): Record<string, string> {
  return {
    name: payload.name,
    email: payload.email,
    message: payload.message,
    _subject: `New contact message from ${payload.name}`,
    _replyto: payload.email,
    _template: 'table',
    _honey: payload.honey ?? '',
    submitted_at: new Date().toLocaleString(),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    ...(ip ? { ip_address: ip } : {}),
  };
}

export async function submitContactMessage(
  payload: ContactPayload,
): Promise<ContactSubmitResult> {
  const ip = await fetchClientIp();
  const body = buildPayload(payload, ip);

  let response: Response;
  try {
    response = await fetch(FORM_SUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch {
    return {
      ok: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }

  let data: { success?: string | boolean; message?: string } | null = null;
  try {
    data = (await response.json()) as { success?: string | boolean; message?: string };
  } catch {
    data = null;
  }

  if (!response.ok) {
    const statusMessage =
      response.status === 429
        ? 'Too many requests. Please try again in a few minutes.'
        : `Message could not be sent (${response.status}). Please try again.`;
    return { ok: false, error: data?.message || statusMessage };
  }

  if (data?.success === 'true' || data?.success === true) {
    return { ok: true };
  }

  return {
    ok: false,
    error: data?.message || 'Message could not be sent. Please try again.',
  };
}
