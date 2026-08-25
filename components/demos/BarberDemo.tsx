// Val's Elegant Barbershop — 8 Main St, Roslyn, NY 11576.
// Warm leather-lounge mood, kept exactly as the template's palette:
// espresso-black, candlelit bone text, brass accent, oxblood secondary,
// Oswald display face. Walk-ins or a phone call only — no online booking,
// cash only. Val and Vlad are the only two barbers named anywhere here.

import {
  Contact,
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
  WorkGrid,
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

// No photos were supplied — every Media placeholder stays empty and labeled.
const firstBarberImage = "";

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

const WORK = [
  { tag: "Haircut", caption: "Men's cut, scissor-finished" },
  { tag: "Cut + Beard", caption: "Haircut with the beard shaped to match" },
  { tag: "Kids", caption: "Under-12 cut, done patiently" },
  { tag: "Seniors", caption: "Senior cut, clean and classic" },
  { tag: "Hot Towel", caption: "Royal hot towel shave, straight razor" },
  { tag: "Beard + Shave", caption: "Beard trimmed, cheeks and neck shaved" },
  { tag: "Beard", caption: "Beard trim, shaped and tightened" },
  { tag: "Shape-up", caption: "Lines redrawn between cuts" },
  { tag: "Style", caption: "Cut, shampoo, and styled" },
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
        <Eyebrow>The list</Eyebrow>
        <div className="mt-5">
          <TwoLine a="The cuts." b="The prices." />
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
              "Val and Vlad, every visit. Two barbers who already know your head, so the cut comes out the same every time.",
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
        eyebrow="Barbershop · Roslyn Village"
        line1="Two brothers."
        line2="One good cut."
        sub="Val and Vlad cut hair on Main Street in Roslyn. Walk in when you have a minute, or call and we'll hold you a chair."
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
          "Val and Vlad run the place themselves. The same two barbers every visit, which is why your cut comes out the same every time.",
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
      <WorkGrid
        eyebrow="Recent work"
        line1="The work,"
        line2="on the wall."
        items={WORK}
      />
      <TheChair />
      <Faq
        eyebrow="Questions"
        line1="The stuff"
        line2="people ask."
        items={FAQ}
      />
      <Contact
        eyebrow="Come by or call"
        line1="Your chair's"
        line2="on Main Street."
        copy="Walk in, or call (516) 399-2220 and we'll hold one for you. We're at 8 Main St in Roslyn Village, open Sunday through Friday and closed Saturdays. Cash only."
        phone={PHONE}
        location="8 Main St, Roslyn, NY 11576"
        serviceLabel="What you're coming in for"
        serviceOptions={BOARD.map((b) => b.name)}
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
      />
    </DemoShell>
  );
}
