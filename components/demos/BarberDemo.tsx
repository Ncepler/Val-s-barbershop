// Val's Elegant Barbershop — 8 Main St, Roslyn, NY 11576.
// Warm leather-lounge mood, kept exactly as the template's palette:
// espresso-black, candlelit bone text, brass accent, oxblood secondary,
// Oswald display face. Walk-ins or a phone call only — no online booking,
// cash only. Al and Vlad run the shop; their dad Rafael also cuts hair —
// three barbers named anywhere here, no ranking implied by order.

import {
  CtaBand,
  DemoFooter,
  DemoHeader,
  DemoHero,
  DemoMarquee,
  DemoShell,
  type DemoTheme,
  Eyebrow,
  Faq,
  FullBleedBreak,
  Intro,
  Media,
  Rise,
  Section,
  TwoLine,
} from "./system";
import { telHref } from "./phone";

const ACCENT = "#B0833F"; // brass / gold — warm lamplight (primary)
const OXBLOOD = "#9A3B33"; // deep oxblood (secondary, used sparingly)

const THEME: DemoTheme = {
  bg: "#16110C",
  surface: "#20180F",
  fg: "#F0E7D6",
  body: "#C2B49C",
  muted: "#8A7B65",
  line: "#2E2419",
  accent: ACCENT,
  onAccent: "#16110C",
  font: "var(--font-tight)",
  display: "var(--font-oswald)",
  heroScrim: "linear-gradient(180deg, rgba(22,17,12,.35), rgba(22,17,12,.85))",
  breakScrim: "linear-gradient(180deg, rgba(22,17,12,.55), rgba(22,17,12,.9))",
};

const PHONE = "(516) 399-2220";
const NAME = "Val's Elegant Barbershop";

// Hero photo lives in /public — every other Media placeholder stays empty and labeled.
const firstBarberImage = "/main-hero.png";
// Hero video toggle — wired ahead of the file. Drop hero-video.mov in
// /public and the "2" button in the hero starts working immediately;
// until then it silently falls back to the photo.
const firstBarberVideo = "/hero-video.mov";

// The price board — nine services, exact prices and notes.
const BOARD = [
  { name: "Men's Haircut", price: "$33", note: "Scissor or clipper, cut to how you actually wear it." },
  { name: "Haircut & Beard Trim", price: "$40", note: "The full cut, then the beard shaped to match." },
  { name: "Kid's Haircut (Under 12)", price: "$28", note: "Patient hands, no rush. First cuts welcome." },
  { name: "Senior Citizen's Haircut", price: "$28", note: "The same haircut, five dollars off." },
  { name: "Royal Hot Towel Shave", price: "$33", note: "Straight razor, hot towels, the full ritual." },
  { name: "Beard Trim & Hot Shave", price: "$33", note: "Beard shaped, then cheeks and neck shaved clean." },
  { name: "Beard Trim", price: "$15", note: "A quick shape on the beard. In and out." },
  { name: "Shape-up", price: "$15", note: "Lines cleaned up between cuts. Ten minutes." },
  { name: "Cut, Shampoo & Style", price: "$35", note: "Washed, cut, and styled before you leave the chair." },
];

const BARBERS = [
  {
    name: "Al",
    role: "Runs the shop, cuts every day.",
    label: "AL: headshot (4:5)",
    file: "al-headshot.jpg",
  },
  {
    name: "Vlad",
    role: "Runs the shop, cuts every day.",
    label: "VLAD: headshot (4:5)",
    file: "vlad-headshot.jpg",
  },
  {
    name: "Rafael",
    role: "Al and Vlad's dad. Still behind the chair.",
    label: "RAFAEL: headshot (4:5)",
    file: "rafael-headshot.jpg",
  },
];

const FAQ = [
  {
    q: "Do I need an appointment?",
    a: "No — walk-ins are always welcome. We don't take appointments online, so if you'd rather have a chair held for you, give the shop a call at (516) 399-2220.",
  },
  {
    q: "What are your hours?",
    a: "We're open Monday through Wednesday and Friday from 9am to 7pm, Thursday until 8pm, and Sunday from 9am to 6pm. We're closed Saturdays.",
  },
  {
    q: "Do you cut kids' hair?",
    a: "We do, and we're good at it. Kids under 12 are $28, and plenty of our regulars have been bringing their kids in for years.",
  },
  {
    q: "How much is a cut?",
    a: "A men's haircut is $33. Haircut and beard trim is $40, kids under 12 and seniors are $28, the royal hot towel shave is $33, and a beard trim or shape-up is $15. The full list is above.",
  },
  {
    q: "Cash or card?",
    a: "Cash only.",
  },
];

// ── The list — a vintage price board: name, brass leader dots, price. ──────
function PriceBoard() {
  return (
    <Section>
      <Rise>
        <Eyebrow>Prices</Eyebrow>
        <div className="mt-5">
          <TwoLine a="Every cut," b="one price." />
        </div>
      </Rise>
      <Rise delay={0.1}>
        <div
          className="mt-12 p-8 md:p-12"
          style={{
            background: "var(--d-surface)",
            border: "1px solid var(--d-line)",
            borderRadius: "var(--d-radius)",
            backgroundImage:
              "radial-gradient(120% 80% at 50% 0%, rgba(176,131,63,.10), transparent 60%)",
          }}
        >
          {BOARD.map((b, i) => (
            <div
              key={b.name}
              className="flex flex-col gap-2 py-5 md:flex-row md:items-baseline md:gap-4"
              style={i > 0 ? { borderTop: "1px solid var(--d-line)" } : undefined}
            >
              <span
                className="text-[24px] font-medium uppercase leading-none tracking-[0.02em] md:text-[28px]"
                style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
              >
                {b.name}
              </span>
              {/* brass leader dots */}
              <span
                aria-hidden
                className="hidden flex-1 translate-y-[-4px] md:block"
                style={{ borderBottom: "2px dotted var(--d-accent)", opacity: 0.5 }}
              />
              <span className="hidden max-w-[16rem] text-[13px] leading-[1.5] md:block md:text-right" style={{ color: "var(--d-muted)" }}>
                {b.note}
              </span>
              <span
                className="text-[24px] font-medium leading-none md:text-[28px]"
                style={{ color: "var(--d-accent)", fontFamily: "var(--d-display)" }}
              >
                {b.price}
              </span>
              <p className="text-[13px] leading-[1.5] md:hidden" style={{ color: "var(--d-muted)" }}>
                {b.note}
              </p>
            </div>
          ))}
        </div>
      </Rise>
    </Section>
  );
}

// ── Your barbers — three headshots, equal weight, no ranking implied. ──────
function YourBarbers() {
  return (
    <Section>
      <Rise>
        <Eyebrow>Your barbers</Eyebrow>
        <div className="mt-5">
          <TwoLine a="Al, Vlad," b="and Rafael." />
        </div>
      </Rise>
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {BARBERS.map((b, i) => (
          <Rise key={b.name} delay={i * 0.08}>
            <Media label={b.label} file={b.file} ratio="4/5" />
            <div className="mt-4">
              <div
                className="text-[20px] font-medium uppercase tracking-[0.02em]"
                style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
              >
                {b.name}
              </div>
              <p className="mt-1 text-[14px] leading-[1.5]" style={{ color: "var(--d-muted)" }}>
                {b.role}
              </p>
            </div>
          </Rise>
        ))}
      </div>
    </Section>
  );
}

// ── Why this chair — the lounge statement beside a lamplit interior. ───────
function TheChair() {
  return (
    <Section dark>
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <Rise>
          <Media label="THE CHAIR: the barber's station, close and warm (4:5)" file="the-chair.jpg" ratio="4/5" />
        </Rise>
        <Rise delay={0.1}>
          <Eyebrow>Why this chair</Eyebrow>
          <div className="mt-6 space-y-6">
            {[
              "We've been cutting hair on this block for years, and it shows in the cut.",
              "Kids are easy here. Patient hands, no rush, and parents who've been coming for years.",
              "Every cut ends the same way. Hot towel, shoulder massage, out the door sharp.",
            ].map((line) => (
              <p
                key={line}
                className="text-[22px] font-medium leading-[1.3] md:text-[26px]"
                style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
              >
                {line}
              </p>
            ))}
          </div>
          <p className="mt-8 text-[15px] leading-[1.6]" style={{ color: "var(--d-body)" }}>
            No app, no upsell, no waiting on a booking screen. Walk in, or pick up the
            phone.
          </p>
          <a
            href={telHref(PHONE)}
            className="mt-7 inline-block px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.1em] transition-opacity hover:opacity-90"
            style={{ background: OXBLOOD, color: "var(--d-fg)" }}
          >
            Call (516) 399-2220
          </a>
        </Rise>
      </div>
    </Section>
  );
}

export function BarberDemo() {
  return (
    <DemoShell accent={ACCENT} theme={THEME}>
      <DemoHeader name={NAME} phone={PHONE} quoteLabel="Call the shop" />
      <DemoHero
        heroImage={firstBarberImage}
        heroVideo={firstBarberVideo}
        eyebrow="Barbershop · Roslyn Village"
        line1="Family barbershop."
        line2="One good cut."
        sub="Al, Vlad, and Rafael cut hair on Main Street in Roslyn. Walk in when you have a minute, or call and we'll hold you a chair."
        primaryCta="Call (516) 399-2220"
        phone={PHONE}
        mediaLabel="HERO: the shop floor, chairs and brass, warm lamplight (16:9)"
      />
      <DemoMarquee terms={["Cuts", "Fades", "Beards", "Shaves", "Kids"]} />
      <Intro
        eyebrow="Who we are"
        line1="Small shop."
        line2="Sharp cuts."
        paragraphs={[
          "Al and Vlad run the shop. Their dad Rafael still cuts hair here too — three barbers on Main Street.",
          "We're on Main Street in Roslyn Village, a short walk from the clock tower. Every haircut finishes the same way — hot towel, shoulder massage, out the door sharp.",
        ]}
        badges={[
          ["Walk in or call", "No app needed"],
          ["Every haircut", "Hot towel finish"],
          ["Kids welcome", "Under 12 is $28"],
          ["Cash only", "Closed Saturdays"],
        ]}
      />
      <PriceBoard />
      <FullBleedBreak
        eyebrow="The shop"
        line1="Main Street,"
        line2="Roslyn Village."
        paragraph="Eight Main Street, a short walk from the clock tower. Come by when you have a minute — if we're mid-cut it's usually a short wait, and if you'd rather not wait, call ahead and we'll hold a chair."
        checklist={[
          "Walk-ins welcome",
          "Call ahead and we'll hold a chair",
          "Cash only",
          "Closed Saturdays",
        ]}
        cta="Call (516) 399-2220"
        phone={PHONE}
        mediaLabel="THE SHOP: interior, chairs and mirrors, warm light (16:9)"
      />
      <YourBarbers />
      <TheChair />
      <Faq
        eyebrow="Questions"
        line1="The stuff"
        line2="people ask."
        items={FAQ}
      />
      <CtaBand
        line1="Need a cut?"
        line2="Give us a call."
        cta="Call (516) 399-2220"
        phone={PHONE}
      />
      <DemoFooter
        name={NAME}
        descriptor="A family-run barbershop on Main Street in Roslyn Village — cuts, fades, beards, and hot towel shaves."
        area="8 Main St, Roslyn Village, Long Island"
        services={["Men's haircut", "Kid's haircut", "Royal hot towel shave", "Beard trim & hot shave"]}
        phone={PHONE}
        location="8 Main St, Roslyn, NY 11576"
        hours="Mon–Wed 9–7 · Thu 9–8 · Fri 9–7 · Sat closed · Sun 9–6"
        strip="Walk-Ins Welcome · Cash Only · Closed Saturdays"
        googleUrl="https://share.google/UdcSv1yE5dZ348ZHF"
        credit={{ label: "Site by vilas.studio", href: "https://vilas.studio" }}
      />
    </DemoShell>
  );
}
