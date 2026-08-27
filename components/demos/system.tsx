"use client";

// Shared primitives for the local-service "demo" site system.
// A single warm, editorial marketing-page kit: sticky header, full-bleed
// hero, a horizontal marquee, a two-column intro, a vintage price/list
// board, a full-bleed break, a work grid, an FAQ accordion, a contact
// section with a working form, a CTA band, and a footer. Every component
// reads its color/type tokens from CSS custom properties set by
// `DemoShell` (`--d-*`), so a single `DemoTheme` retints the whole page.

import * as React from "react";
import { motion } from "framer-motion";
import { telHref } from "./phone";

export { telHref };

// ── Theme ────────────────────────────────────────────────────────────────

export type DemoTheme = {
  bg: string;
  surface: string;
  fg: string;
  body: string;
  muted: string;
  line: string;
  accent: string;
  onAccent: string;
  font: string;
  display: string;
  heroScrim: string;
  breakScrim: string;
};

function wordmarkLines(name: string): [string, string] {
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return [name, ""];
  return [words.slice(0, -1).join(" "), words[words.length - 1]];
}

const ctaClass =
  "inline-block px-7 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] transition-opacity hover:opacity-90";

// ── Shell ────────────────────────────────────────────────────────────────

export function DemoShell({
  accent,
  theme,
  children,
}: {
  accent: string;
  theme: DemoTheme;
  children: React.ReactNode;
}) {
  const vars = {
    "--d-bg": theme.bg,
    "--d-surface": theme.surface,
    "--d-fg": theme.fg,
    "--d-body": theme.body,
    "--d-muted": theme.muted,
    "--d-line": theme.line,
    "--d-accent": theme.accent,
    "--d-onaccent": theme.onAccent,
    "--d-font": theme.font,
    "--d-display": theme.display,
    "--d-radius": "2px",
    "--d-hero-scrim": theme.heroScrim,
    "--d-break-scrim": theme.breakScrim,
    scrollbarColor: `${accent} ${theme.bg}`,
  } as React.CSSProperties;

  return (
    <div
      style={{
        ...vars,
        background: "var(--d-bg)",
        color: "var(--d-fg)",
        fontFamily: "var(--d-font)",
      }}
      className="min-h-screen antialiased"
    >
      {children}
    </div>
  );
}

// ── Layout atoms ─────────────────────────────────────────────────────────

export function Section({
  children,
  dark = false,
  className = "",
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <section
      className={`px-6 py-20 md:px-10 md:py-28 ${className}`}
      style={{ background: dark ? "var(--d-surface)" : "transparent" }}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function Rise({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[12px] font-semibold uppercase tracking-[0.22em]"
      style={{ color: "var(--d-accent)" }}
    >
      {children}
    </p>
  );
}

export function TwoLine({ a, b }: { a: string; b: string }) {
  return (
    <h2
      className="text-[36px] font-medium leading-[1.05] md:text-[52px]"
      style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
    >
      {a}
      <br />
      <span style={{ color: "var(--d-muted)" }}>{b}</span>
    </h2>
  );
}

export function Media({
  label,
  file,
  ratio = "16/9",
  src = "",
  className = "",
}: {
  label: string;
  file?: string;
  ratio?: string;
  src?: string;
  className?: string;
}) {
  if (src) {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={{ aspectRatio: ratio, borderRadius: "var(--d-radius)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={label} className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`flex items-center justify-center border p-6 text-center ${className}`}
      style={{
        aspectRatio: ratio,
        borderColor: "var(--d-line)",
        borderRadius: "var(--d-radius)",
        background: "var(--d-surface)",
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent, transparent 10px, rgba(240,231,214,.03) 10px, rgba(240,231,214,.03) 11px)",
      }}
    >
      <span
        className="text-[11px] font-medium uppercase leading-[1.6] tracking-[0.12em]"
        style={{ color: "var(--d-muted)" }}
      >
        {label}
        {file ? (
          <>
            <br />
            <span className="opacity-60">{file}</span>
          </>
        ) : null}
      </span>
    </div>
  );
}

// ── Open/closed status ──────────────────────────────────────────────────
// Reads the shop's posted hours against the current time in the Eastern
// timezone (EST/EDT, wherever the visitor actually is) and renders a
// spinning barber pole when open, or a note on when the shop reopens.

export type DayHours = { open: number; close: number } | null;
// Sunday-first, matching Date/Intl's weekday indexing (0 = Sun … 6 = Sat).
export type WeekHours = [DayHours, DayHours, DayHours, DayHours, DayHours, DayHours, DayHours];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getEasternParts(date: Date): { weekday: number; hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;
  const weekdayIndex: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    weekday: weekdayIndex[map.weekday],
    hour: Number(map.hour) % 24, // midnight can format as "24"
    minute: Number(map.minute),
  };
}

function formatHour(h: number): string {
  const hour24 = Math.floor(h);
  const minutes = Math.round((h - hour24) * 60);
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return minutes === 0 ? `${hour12} ${period}` : `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

type ShopStatusResult = { open: true; closesAt: string } | { open: false; message: string };

function getShopStatus(hours: WeekHours, now: Date): ShopStatusResult {
  const { weekday, hour, minute } = getEasternParts(now);
  const minutesNow = hour * 60 + minute;
  const today = hours[weekday];

  if (today && minutesNow >= today.open * 60 && minutesNow < today.close * 60) {
    return { open: true, closesAt: formatHour(today.close) };
  }
  if (today && minutesNow < today.open * 60) {
    return { open: false, message: `Opens today at ${formatHour(today.open)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const day = hours[(weekday + i) % 7];
    if (day) {
      const label = i === 1 ? "tomorrow" : DAY_NAMES[(weekday + i) % 7];
      return { open: false, message: `Opens ${label} at ${formatHour(day.open)}` };
    }
  }
  return { open: false, message: "Call for hours" };
}

function ShopStatus({ hours }: { hours: WeekHours }) {
  // Starts unmounted so the server render (no fixed "now") and the first
  // client render agree; the real status fills in a tick after mount.
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;
  const status = getShopStatus(hours, now);

  return (
    <div
      className="hidden items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] sm:flex"
      style={{ color: status.open ? "var(--d-fg)" : "var(--d-muted)" }}
    >
      {status.open ? (
        <span
          className="d-barberpole h-4 w-4 shrink-0 rounded-full"
          style={{ boxShadow: "0 0 0 1px var(--d-line)" }}
          aria-hidden
        />
      ) : (
        <span
          className="h-4 w-4 shrink-0 rounded-full"
          style={{ background: "var(--d-line)" }}
          aria-hidden
        />
      )}
      <span>{status.open ? "Open now" : "Closed"}</span>
      <span className="hidden opacity-70 md:inline">
        {status.open ? `· till ${status.closesAt}` : `· ${status.message}`}
      </span>
    </div>
  );
}

// ── Header ───────────────────────────────────────────────────────────────

export function DemoHeader({
  name,
  phone,
  quoteLabel,
  hours,
}: {
  name: string;
  phone: string;
  quoteLabel: string;
  hours?: WeekHours;
}) {
  const [line1, line2] = wordmarkLines(name);
  const href = telHref(phone);
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between gap-4 px-6 py-5 backdrop-blur md:px-10"
      style={{
        background: "color-mix(in srgb, var(--d-bg) 92%, transparent)",
        borderBottom: "1px solid var(--d-line)",
      }}
    >
      <a href="#top" className="leading-none" style={{ fontFamily: "var(--d-display)" }}>
        <div
          className="text-[19px] font-medium uppercase tracking-[0.08em] md:text-[21px]"
          style={{ color: "var(--d-fg)" }}
        >
          {line1}
        </div>
        <div
          className="mt-1 text-[11px] font-medium uppercase tracking-[0.28em]"
          style={{ color: "var(--d-muted)" }}
        >
          {line2}
        </div>
      </a>
      <div className="flex items-center gap-3 md:gap-6">
        {hours ? <ShopStatus hours={hours} /> : null}
        <a
          href={href}
          className="hidden text-[14px] font-medium tracking-[0.02em] md:inline"
          style={{ color: "var(--d-body)" }}
        >
          {phone}
        </a>
        <a
          href={href}
          className={`${ctaClass} px-5 py-3`}
          style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
        >
          {quoteLabel}
        </a>
      </div>
    </header>
  );
}

// ── Sticky logo mark ─────────────────────────────────────────────────────
// Small fixed badge, bottom-left. Hidden until the hero (`#top`) scrolls
// out of view, then fades in; doubles as a tap-back-to-top control.

export function StickyLogo({ src, label = "Back to top" }: { src: string; label?: string }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href="#top"
      aria-label={label}
      className="fixed bottom-6 left-6 z-40 h-11 w-11 overflow-hidden rounded-full transition-all duration-300 ease-out md:bottom-8 md:left-10"
      style={{
        border: "1px solid var(--d-line)",
        boxShadow: "0 4px 16px rgba(0,0,0,.35)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full object-cover" />
    </a>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────

export function DemoHero({
  heroImage,
  heroVideo,
  eyebrow,
  line1,
  line2,
  sub,
  primaryCta,
  phone,
  mediaLabel,
}: {
  heroImage: string;
  heroVideo?: string;
  eyebrow: string;
  line1: string;
  line2: string;
  sub: string;
  primaryCta: string;
  phone: string;
  mediaLabel: string;
}) {
  const href = telHref(phone);
  const [mode, setMode] = React.useState<"image" | "video">("image");
  const showVideo = mode === "video" && !!heroVideo;

  return (
    <section
      id="top"
      className="relative flex min-h-[88vh] items-end overflow-hidden px-6 pb-16 pt-32 md:px-10 md:pb-24"
    >
      <div className="absolute inset-0">
        {showVideo ? (
          <video
            key={heroVideo}
            className="h-full w-full object-cover"
            src={heroVideo}
            poster={heroImage || undefined}
            autoPlay
            muted
            loop
            playsInline
            // Video source may not exist yet (or the browser can't play a .mov
            // container) — fall back to the photo rather than showing black.
            onError={() => setMode("image")}
          />
        ) : heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: "var(--d-surface)",
              backgroundImage:
                "repeating-linear-gradient(135deg, transparent, transparent 12px, rgba(240,231,214,.035) 12px, rgba(240,231,214,.035) 13px)",
            }}
          >
            <span
              className="max-w-xs text-center text-[12px] font-medium uppercase leading-[1.7] tracking-[0.14em]"
              style={{ color: "var(--d-muted)" }}
            >
              {mediaLabel}
            </span>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: "var(--d-hero-scrim)" }} />
      </div>
      {heroVideo ? (
        <div className="absolute bottom-6 left-6 z-20 flex gap-2 md:bottom-8 md:left-10">
          {(["image", "video"] as const).map((m, i) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              aria-label={m === "image" ? "Show photo background" : "Show video background"}
              className="flex h-8 w-8 items-center justify-center text-[12px] font-semibold transition-opacity hover:opacity-90"
              style={{
                borderRadius: "var(--d-radius)",
                border: "1px solid var(--d-line)",
                background:
                  mode === m ? "var(--d-accent)" : "color-mix(in srgb, var(--d-bg) 55%, transparent)",
                color: mode === m ? "var(--d-onaccent)" : "var(--d-fg)",
                backdropFilter: "blur(4px)",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      ) : null}
      <div className="relative z-10 max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1
          className="mt-5 text-[44px] font-medium leading-[1.02] md:text-[76px]"
          style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
        >
          {line1}
          <br />
          {line2}
        </h1>
        <p className="mt-6 max-w-md text-[16px] leading-[1.6] md:text-[18px]" style={{ color: "var(--d-body)" }}>
          {sub}
        </p>
        <a
          href={href}
          className={`mt-9 ${ctaClass}`}
          style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
        >
          {primaryCta}
        </a>
      </div>
    </section>
  );
}

// ── Marquee ──────────────────────────────────────────────────────────────

export function DemoMarquee({ terms }: { terms: string[] }) {
  const loop = [...terms, ...terms, ...terms];
  return (
    <div
      className="d-marquee overflow-hidden py-5"
      style={{ borderTop: "1px solid var(--d-line)", borderBottom: "1px solid var(--d-line)" }}
      tabIndex={0}
      role="marquee"
      aria-label={terms.join(", ")}
    >
      <div className="d-marquee-track flex w-max items-center gap-10">
        {loop.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-[13px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--d-muted)" }}
          >
            {t}
            <span aria-hidden style={{ color: "var(--d-accent)" }}>
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Intro ────────────────────────────────────────────────────────────────

export function Intro({
  eyebrow,
  line1,
  line2,
  paragraphs,
  badges,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  paragraphs: string[];
  badges: [string, string][];
}) {
  return (
    <Section>
      <div className="grid gap-14 md:grid-cols-2 md:gap-20">
        <Rise>
          <Eyebrow>{eyebrow}</Eyebrow>
          <div className="mt-5">
            <TwoLine a={line1} b={line2} />
          </div>
        </Rise>
        <Rise delay={0.1}>
          <div className="space-y-5">
            {paragraphs.map((p) => (
              <p key={p} className="text-[16px] leading-[1.7]" style={{ color: "var(--d-body)" }}>
                {p}
              </p>
            ))}
          </div>
          <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5">
            {badges.map(([a, b]) => (
              <div key={a} className="pt-3" style={{ borderTop: "1px solid var(--d-line)" }}>
                <div className="text-[14px] font-semibold" style={{ color: "var(--d-fg)" }}>
                  {a}
                </div>
                <div className="mt-1 text-[12px] uppercase tracking-[0.08em]" style={{ color: "var(--d-muted)" }}>
                  {b}
                </div>
              </div>
            ))}
          </div>
        </Rise>
      </div>
    </Section>
  );
}

// ── Full-bleed break ─────────────────────────────────────────────────────

export function FullBleedBreak({
  eyebrow,
  line1,
  line2,
  paragraph,
  checklist,
  cta,
  phone,
  mediaLabel,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  paragraph: string;
  checklist: string[];
  cta: string;
  phone: string;
  mediaLabel: string;
}) {
  const href = telHref(phone);
  return (
    <section className="relative overflow-hidden px-6 py-24 md:px-10 md:py-32">
      <div className="absolute inset-0">
        <div className="flex h-full w-full items-center justify-center" style={{ background: "var(--d-surface)" }}>
          <span
            className="max-w-xs text-center text-[12px] font-medium uppercase leading-[1.7] tracking-[0.14em]"
            style={{ color: "var(--d-muted)" }}
          >
            {mediaLabel}
          </span>
        </div>
        <div className="absolute inset-0" style={{ background: "var(--d-break-scrim)" }} />
      </div>
      <Rise className="relative z-10 mx-auto max-w-xl text-center">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2
          className="mt-5 text-[36px] font-medium leading-[1.05] md:text-[52px]"
          style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
        >
          {line1}
          <br />
          {line2}
        </h2>
        <p className="mx-auto mt-6 max-w-md text-[15px] leading-[1.7]" style={{ color: "var(--d-body)" }}>
          {paragraph}
        </p>
        <ul className="mx-auto mt-8 flex max-w-md flex-col items-center gap-2.5">
          {checklist.map((c) => (
            <li key={c} className="text-[13px] uppercase tracking-[0.06em]" style={{ color: "var(--d-muted)" }}>
              {c}
            </li>
          ))}
        </ul>
        <a
          href={href}
          className={`mt-9 ${ctaClass}`}
          style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
        >
          {cta}
        </a>
      </Rise>
    </section>
  );
}

// ── Work grid ────────────────────────────────────────────────────────────

export function WorkGrid({
  eyebrow,
  line1,
  line2,
  items,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  items: { tag: string; caption: string }[];
}) {
  return (
    <Section>
      <Rise>
        <Eyebrow>{eyebrow}</Eyebrow>
        <div className="mt-5">
          <TwoLine a={line1} b={line2} />
        </div>
      </Rise>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item, i) => (
          <Rise key={`${item.tag}-${i}`} delay={(i % 3) * 0.08}>
            <Media label={`${item.tag.toUpperCase()}: ${item.caption} (4:5)`} ratio="4/5" />
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <span
                className="text-[12px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: "var(--d-accent)" }}
              >
                {item.tag}
              </span>
              <span className="text-right text-[13px] leading-[1.4]" style={{ color: "var(--d-muted)" }}>
                {item.caption}
              </span>
            </div>
          </Rise>
        ))}
      </div>
    </Section>
  );
}

// ── FAQ ──────────────────────────────────────────────────────────────────

export function Faq({
  eyebrow,
  line1,
  line2,
  items,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  items: { q: string; a: string }[];
}) {
  return (
    <Section dark>
      <Rise>
        <Eyebrow>{eyebrow}</Eyebrow>
        <div className="mt-5">
          <TwoLine a={line1} b={line2} />
        </div>
      </Rise>
      <Rise delay={0.1}>
        <div className="mt-12 max-w-3xl">
          {items.map((item, i) => (
            <details key={item.q} className="group py-6" style={i > 0 ? { borderTop: "1px solid var(--d-line)" } : undefined}>
              <summary
                className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium md:text-[19px]"
                style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
              >
                {item.q}
                <span className="shrink-0 text-[20px] transition-transform group-open:rotate-45" style={{ color: "var(--d-accent)" }}>
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-[15px] leading-[1.7]" style={{ color: "var(--d-body)" }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Rise>
    </Section>
  );
}

// ── Contact ──────────────────────────────────────────────────────────────

export function Contact({
  eyebrow,
  line1,
  line2,
  copy,
  phone,
  email,
  location,
  serviceLabel,
  serviceOptions,
}: {
  eyebrow: string;
  line1: string;
  line2: string;
  copy: string;
  phone: string;
  email?: string;
  location: string;
  serviceLabel: string;
  serviceOptions: string[];
}) {
  const href = telHref(phone);
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/notify-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section>
      <div className="grid gap-14 md:grid-cols-2 md:gap-20">
        <Rise>
          <Eyebrow>{eyebrow}</Eyebrow>
          <div className="mt-5">
            <TwoLine a={line1} b={line2} />
          </div>
          <p className="mt-6 max-w-sm text-[15px] leading-[1.7]" style={{ color: "var(--d-body)" }}>
            {copy}
          </p>
          <div className="mt-8 space-y-2">
            <a href={href} className="block text-[16px] font-medium" style={{ color: "var(--d-fg)" }}>
              {phone}
            </a>
            <div className="text-[14px]" style={{ color: "var(--d-muted)" }}>
              {location}
            </div>
            {email ? (
              <a href={`mailto:${email}`} className="block text-[14px]" style={{ color: "var(--d-muted)" }}>
                {email}
              </a>
            ) : null}
          </div>
        </Rise>
        <Rise delay={0.1}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input required name="name" placeholder="Name" className="d-input w-full px-4 py-3 text-[14px]" />
              <input required name="phone" placeholder="Phone" className="d-input w-full px-4 py-3 text-[14px]" />
            </div>
            <select required name="service" defaultValue="" className="d-input w-full px-4 py-3 text-[14px]">
              <option value="" disabled>
                {serviceLabel}
              </option>
              {serviceOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <textarea
              name="message"
              placeholder="Anything we should know?"
              rows={4}
              className="d-input w-full px-4 py-3 text-[14px]"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className={`w-full ${ctaClass} disabled:opacity-60`}
              style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
            >
              {status === "sending" ? "Sending…" : status === "sent" ? "Sent — talk soon" : "Send"}
            </button>
            {status === "error" ? (
              <p className="text-[13px]" style={{ color: "var(--d-accent)" }}>
                Something went wrong — call us instead at {phone}.
              </p>
            ) : null}
          </form>
        </Rise>
      </div>
    </Section>
  );
}

// ── CTA band ─────────────────────────────────────────────────────────────

export function CtaBand({
  line1,
  line2,
  cta,
  phone,
}: {
  line1: string;
  line2: string;
  cta: string;
  phone: string;
}) {
  const href = telHref(phone);
  return (
    <Section dark>
      <Rise className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
        <h2
          className="text-[34px] font-medium leading-[1.05] md:text-[46px]"
          style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
        >
          {line1}
          <br />
          {line2}
        </h2>
        <a
          href={href}
          className={`${ctaClass} px-8`}
          style={{ background: "var(--d-accent)", color: "var(--d-onaccent)" }}
        >
          {cta}
        </a>
      </Rise>
    </Section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────

export function DemoFooter({
  name,
  descriptor,
  area,
  services,
  phone,
  email,
  location,
  hours,
  strip,
  googleUrl,
  credit,
}: {
  name: string;
  descriptor: string;
  area: string;
  services: string[];
  phone: string;
  email?: string;
  location: string;
  hours: string;
  strip: string;
  googleUrl?: string;
  credit?: { label: string; href: string };
}) {
  const href = telHref(phone);
  return (
    <footer className="px-6 pb-10 pt-16 md:px-10" style={{ borderTop: "1px solid var(--d-line)" }}>
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div
            className="text-[19px] font-medium uppercase tracking-[0.06em]"
            style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
          >
            {name}
          </div>
          <p className="mt-4 max-w-sm text-[14px] leading-[1.7]" style={{ color: "var(--d-muted)" }}>
            {descriptor}
          </p>
          <div className="mt-4 text-[13px] uppercase tracking-[0.08em]" style={{ color: "var(--d-muted)" }}>
            {area}
          </div>
        </div>
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--d-accent)" }}>
            Services
          </div>
          <ul className="mt-4 space-y-2">
            {services.map((s) => (
              <li key={s} className="text-[14px]" style={{ color: "var(--d-body)" }}>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--d-accent)" }}>
            Visit
          </div>
          <div className="mt-4 space-y-2 text-[14px]" style={{ color: "var(--d-body)" }}>
            <a href={href} className="block" style={{ color: "var(--d-fg)" }}>
              {phone}
            </a>
            {email ? (
              <a href={`mailto:${email}`} className="block">
                {email}
              </a>
            ) : null}
            <div>{location}</div>
            <div style={{ color: "var(--d-muted)" }}>{hours}</div>
            {googleUrl ? (
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block underline underline-offset-4"
                style={{ color: "var(--d-muted)" }}
              >
                Find us on Google
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className="mx-auto mt-14 max-w-6xl text-[11px] uppercase tracking-[0.14em]"
        style={{ color: "var(--d-muted)", borderTop: "1px solid var(--d-line)", paddingTop: "1.5rem" }}
      >
        {strip}
      </div>
      {credit ? (
        <div className="mx-auto mt-4 max-w-6xl text-[11px]" style={{ color: "var(--d-muted)" }}>
          <a
            href={credit.href}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-70 transition-opacity hover:opacity-100"
          >
            {credit.label}
          </a>
        </div>
      ) : null}
    </footer>
  );
}
