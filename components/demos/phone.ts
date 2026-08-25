// Plain utility — no "use client" needed, safe to call from server or client.

/** Builds a `tel:` href from any US phone string, e.g. "(516) 399-2220". */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const withCountry = digits.length === 10 ? `1${digits}` : digits;
  return `tel:+${withCountry}`;
}
