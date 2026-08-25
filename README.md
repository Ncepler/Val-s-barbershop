# Val's Elegant Barbershop

Homepage for Val's Elegant Barbershop — 8 Main St, Roslyn, NY 11576. Built with
Next.js (App Router), TypeScript, and Tailwind CSS.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `app/page.tsx` — homepage route, renders `BarberDemo` and the `LocalBusiness`/`BarberShop` JSON-LD.
- `app/layout.tsx` — fonts (Oswald + Inter Tight) and site metadata.
- `app/api/notify-client/route.ts` — contact-form endpoint; reads the recipient from `CLIENT_EMAIL` server-side.
- `components/demos/system.tsx` — shared visual primitives (header, hero, price board, FAQ, footer, etc.).
- `components/demos/BarberDemo.tsx` — Val's Elegant Barbershop content built on those primitives.

## Environment

Copy `.env.example` to `.env.local` and set `CLIENT_EMAIL` to the address that
should receive contact-form submissions. It is only ever read server-side.

## Deploy

Deploy target is `valselegant.com` on Vercel.
