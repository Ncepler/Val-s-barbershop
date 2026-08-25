import { NextRequest, NextResponse } from "next/server";

// Recipient is read server-side only — never sent to the client bundle.
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, phone, service, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim() || typeof phone !== "string" || !phone.trim()) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 });
  }

  if (!CLIENT_EMAIL) {
    console.error("notify-client: CLIENT_EMAIL is not configured.");
    return NextResponse.json({ error: "Contact form is not configured." }, { status: 500 });
  }

  // Wire up an email/SMS provider (Resend, Postmark, Twilio, etc.) here,
  // sending to CLIENT_EMAIL. Logged for now so submissions aren't silently
  // dropped before a provider is connected.
  console.log("New contact request for", CLIENT_EMAIL, {
    name,
    phone,
    service: typeof service === "string" ? service : undefined,
    message: typeof message === "string" ? message : undefined,
  });

  return NextResponse.json({ ok: true });
}
