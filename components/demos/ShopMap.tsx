"use client";

// "Who's where" — a cutaway of the shop floor drawn from just outside the
// front door, so the picture matches what you see walking in: the station
// wall runs down the left with the four chairs in front of it, the long
// mirror and waiting chairs run down the right, the register sits by the door.
//
// The scene is modeled in feet and run through a simple pinhole projection.
// x = 0 is the station wall (left), x = W the mirror wall (right),
// y = 0 the storefront, y = D the back wall, z is up. Labels are HTML laid
// over the SVG at projected points so they stay readable at phone width.

import * as React from "react";

// ── Room + camera ──────────────────────────────────────────────────────────
const W = 20;
const D = 40;
const H = 9;

const VB_W = 1000;
const VB_H = 1000;
const EYE = { x: 9, y: -30, z: 34 };
const F = 1150;
const CX = 470;
const HY = -350;

type Pt = [number, number];

function P(x: number, y: number, z: number): Pt {
  const d = y - EYE.y;
  return [CX + (F * (x - EYE.x)) / d, HY + (F * (EYE.z - z)) / d];
}

const pts = (list: Pt[]) => list.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");

// ── Chairs ─────────────────────────────────────────────────────────────────
// n is the chair's position counting back from the door (1–4). Chairs not
// listed are drawn but left unlabeled.
export type ChairInfo = { n: number; name: string; note: string };

const CHAIR_X = 4.6; // center of the chair base, feet off the station wall
const CHAIR_YS = [10, 16.5, 23, 29.5];

// ── Palette (illustration only — sits on the page's espresso background) ──
const C = {
  wall: "#1d1610",
  wallBack: "#18120c",
  wood: "#6b3b1c",
  woodDark: "#4a2812",
  woodTop: "#3a2416",
  leather: "#141110",
  leatherHi: "#2a2420",
  chrome: "#8d8478",
  mat: "#0f0d0b",
  mirror: "#2a2620",
  waiting: "#4a1f1a",
  waitingHi: "#5e2a22",
  brass: "#B0833F",
};

// A box face list, with only faces that point at the eye.
type Face = { d: string; fill: string; stroke?: string };
type Item = { key: string; depth: number; faces: Face[]; chair?: number; extra?: React.ReactNode };

function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) * k));
  const g = Math.min(255, Math.round(((n >> 8) & 255) * k));
  const b = Math.min(255, Math.round((n & 255) * k));
  return `rgb(${r},${g},${b})`;
}

function box(
  key: string,
  [x0, x1]: [number, number],
  [y0, y1]: [number, number],
  [z0, z1]: [number, number],
  color: string,
  opts: { chair?: number; top?: string; stroke?: string } = {},
): Item {
  const faces: Face[] = [];
  const stroke = opts.stroke;
  // side facing the eye in x
  if (EYE.x > x1) {
    faces.push({
      d: pts([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)]),
      fill: shade(color, 0.62),
      stroke,
    });
  } else if (EYE.x < x0) {
    faces.push({
      d: pts([P(x0, y0, z0), P(x0, y1, z0), P(x0, y1, z1), P(x0, y0, z1)]),
      fill: shade(color, 0.62),
      stroke,
    });
  }
  // front (toward the door)
  faces.push({
    d: pts([P(x0, y0, z0), P(x1, y0, z0), P(x1, y0, z1), P(x0, y0, z1)]),
    fill: shade(color, 0.82),
    stroke,
  });
  // top
  if (EYE.z > z1) {
    faces.push({
      d: pts([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)]),
      fill: opts.top ?? color,
      stroke,
    });
  }
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  // Painter's key: distance from the eye to the box's nearest point in plan.
  const nx = Math.max(x0, Math.min(EYE.x, x1));
  const ny = Math.max(y0, Math.min(EYE.y, y1));
  const depth = Math.hypot(nx - EYE.x, ny - EYE.y) * 0.5 + Math.hypot(cx - EYE.x, cy - EYE.y) * 0.5;
  return { key, depth, faces, chair: opts.chair };
}

// A flat disc / half-disc on the floor (or at height z).
function disc(cx: number, cy: number, r: number, z: number, from = 0, to = Math.PI * 2, steps = 40): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = from + ((to - from) * i) / steps;
    out.push(P(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z));
  }
  return out;
}

// A cylinder seen from above: top disc + the silhouette band below it.
function cylinder(key: string, cx: number, cy: number, r: number, z0: number, z1: number, color: string, chair?: number): Item {
  const top = disc(cx, cy, r, z1);
  // the half of the band facing the door / eye
  const band = [...disc(cx, cy, r, z1, Math.PI, Math.PI * 2, 20), ...disc(cx, cy, r, z0, Math.PI, Math.PI * 2, 20).reverse()];
  return {
    key,
    depth: Math.hypot(cx - EYE.x, cy - EYE.y) - r,
    chair,
    faces: [
      { d: pts(band), fill: shade(color, 0.7) },
      { d: pts(top), fill: color },
    ],
  };
}

// One barber chair, facing the mirror (−x). Built from the photo of the
// shop's own chair: wide padded back with a headrest, chunky armrests,
// chrome footrest, round chrome base.
function chair(n: number, cy: number): Item[] {
  const x = CHAIR_X;
  const items: Item[] = [];
  items.push(cylinder(`c${n}-base`, x + 0.2, cy, 1.15, 0, 0.22, "#57514a", n));
  items.push(cylinder(`c${n}-pole`, x + 0.2, cy, 0.32, 0.22, 1.4, shade(C.chrome, 0.8), n));
  // footrest plate + arm
  items.push(box(`c${n}-foot`, [x - 1.95, x - 1.2], [cy - 0.75, cy + 0.75], [0.55, 0.72], C.chrome, { chair: n, top: "#5a544c" }));
  items.push(box(`c${n}-leg`, [x - 1.25, x - 0.75], [cy - 0.7, cy + 0.7], [0.72, 1.55], C.leather, { chair: n, top: C.leatherHi }));
  // seat
  items.push(box(`c${n}-seat`, [x - 0.8, x + 1.05], [cy - 1.0, cy + 1.0], [1.4, 2.15], C.leather, { chair: n, top: C.leatherHi }));
  // arms
  items.push(box(`c${n}-armL`, [x - 0.9, x + 1.0], [cy - 1.42, cy - 1.0], [1.5, 2.85], "#0c0a09", { chair: n, top: "#3a332d" }));
  items.push(box(`c${n}-armR`, [x - 0.9, x + 1.0], [cy + 1.0, cy + 1.42], [1.5, 2.85], "#0c0a09", { chair: n, top: "#3a332d" }));
  // back + headrest
  items.push(box(`c${n}-back`, [x + 1.05, x + 1.55], [cy - 1.1, cy + 1.1], [1.6, 4.4], C.leather, { chair: n, top: C.leatherHi }));
  items.push(box(`c${n}-head`, [x + 1.1, x + 1.5], [cy - 0.55, cy + 0.55], [4.4, 5.0], C.leather, { chair: n, top: C.leatherHi }));
  return items;
}

// ── Scene ──────────────────────────────────────────────────────────────────
function buildScene() {
  const items: Item[] = [];

  // Station wall run: one mirror bay per chair, shelving towers between.
  const BAY = 6.5;
  const firstBay = CHAIR_YS[0] - BAY / 2; // 8
  const towers = [firstBay, ...CHAIR_YS.map((y) => y + BAY / 2)]; // 8,15,22,29,36

  // Counter segments, one per bay, so they sort cleanly against the chairs.
  CHAIR_YS.forEach((y, i) => {
    items.push(box(`counter${i}`, [0, 1.9], [y - BAY / 2 + 0.7, y + BAY / 2 - 0.7], [0, 3], C.wood, { top: C.woodTop }));
  });
  towers.forEach((y, i) => {
    items.push(box(`tower${i}`, [0, 1.6], [y - 0.7, y + 0.7], [0, 8], C.wood, { top: C.woodDark }));
  });

  // Register counter by the door + the till on it.
  items.push(box("register", [0, 2.4], [1.2, 6.2], [0, 3.6], C.wood, { top: C.woodTop }));
  items.push(box("till", [0.6, 1.8], [3.0, 4.4], [3.6, 4.4], "#22201c", { top: "#3a3630" }));

  // Waiting area: four chairs along the mirror wall, three under the window.
  [4.0, 6.4, 8.8, 11.2].forEach((y, i) => {
    items.push(box(`wseat${i}`, [W - 2.6, W - 0.8], [y - 0.9, y + 0.9], [1.2, 1.7], C.waiting, { top: C.waitingHi }));
    items.push(box(`wback${i}`, [W - 0.9, W - 0.5], [y - 0.9, y + 0.9], [1.2, 3.2], C.waiting, { top: C.waitingHi }));
  });
  [11.5, 13.9, 16.3].forEach((x, i) => {
    items.push(box(`fseat${i}`, [x - 0.9, x + 0.9], [0.8, 2.6], [1.2, 1.7], C.waiting, { top: C.waitingHi }));
    items.push(box(`fback${i}`, [x - 0.9, x + 0.9], [0.4, 0.8], [1.2, 3.2], C.waiting, { top: C.waitingHi }));
  });
  items.push(box("table", [12.6, 15.6], [5.6, 7.6], [1.2, 1.55], C.wood, { top: "#7a4624" }));
  items.push(box("table-base", [13.4, 14.8], [6.2, 7.0], [0, 1.2], C.woodDark));
  // Coat rack partway down the mirror wall.
  items.push(cylinder("rack-foot", W - 2.2, 17, 0.7, 0, 0.12, C.woodDark));
  items.push(box("rack-pole", [W - 2.3, W - 2.1], [16.9, 17.1], [0.12, 6.2], C.woodDark));
  items.push(cylinder("rack-top", W - 2.2, 17, 0.55, 6.0, 6.3, C.wood));

  CHAIR_YS.forEach((y, i) => items.push(...chair(i + 1, y)));

  items.sort((a, b) => b.depth - a.depth);
  return { items, towers };
}

const SCENE = buildScene();

// ── Component ──────────────────────────────────────────────────────────────
export function ShopMap({ chairs }: { chairs: ChairInfo[] }) {
  const [active, setActive] = React.useState<number | null>(null);
  const { items, towers } = SCENE;

  const floor = pts([P(0, 0, 0), P(W, 0, 0), P(W, D, 0), P(0, D, 0)]);
  const leftWall = pts([P(0, 0, 0), P(0, D, 0), P(0, D, H), P(0, 0, H)]);
  const rightWall = pts([P(W, 0, 0), P(W, D, 0), P(W, D, H), P(W, 0, H)]);
  const backWall = pts([P(0, D, 0), P(W, D, 0), P(W, D, H), P(0, D, H)]);

  const planks: React.ReactNode[] = [];
  for (let x = 0.75; x < W; x += 0.75) {
    const [a, b] = P(x, 0, 0);
    const [c, d] = P(x, D, 0);
    planks.push(<line key={x} x1={a} y1={b} x2={c} y2={d} stroke="#000" strokeOpacity={0.22} strokeWidth={1} />);
  }
  // staggered plank seams
  for (let y = 2; y < D; y += 4) {
    for (let x = 0; x < W; x += 0.75) {
      const off = ((x / 0.75) % 3) * 1.33;
      const yy = y + off;
      if (yy > D) continue;
      const [a, b] = P(x, yy, 0);
      const [c, d] = P(x + 0.75, yy, 0);
      planks.push(<line key={`s${x}-${y}`} x1={a} y1={b} x2={c} y2={d} stroke="#000" strokeOpacity={0.16} strokeWidth={0.8} />);
    }
  }

  const dim = (n?: number) => (active !== null && n !== undefined && n !== active ? 0.32 : 1);

  // Label anchor points (above each headrest) and floor callouts.
  const anchors = CHAIR_YS.map((y) => P(CHAIR_X + 4.4, y, 3.2));
  const pct = ([x, y]: Pt) => ({ left: `${(x / VB_W) * 100}%`, top: `${(y / VB_H) * 100}%` });
  const doorLabel = P(4.6, 1.6, 0);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: `${VB_W} / ${VB_H}`,
          background: "radial-gradient(90% 70% at 45% 40%, #21180f, #120d09 75%)",
          border: "1px solid var(--d-line)",
          borderRadius: "var(--d-radius)",
        }}
      >
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full" role="img" aria-labelledby="shopmap-title shopmap-desc">
          <title id="shopmap-title">Where each barber sits</title>
          <desc id="shopmap-desc">
            Cutaway of the shop seen from the front door. Four barber chairs run front to back along the
            mirrors on the left wall: chair one is Al, chair three is Vlad, chair four
            is Rafael. The waiting area and a long mirror are on the right, the register is just inside the door.
          </desc>
          <defs>
            <linearGradient id="sm-floor" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#6e3d1d" />
              <stop offset="1" stopColor="#3b2111" />
            </linearGradient>
            <linearGradient id="sm-mirror" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3a342c" />
              <stop offset=".5" stopColor="#1e1b17" />
              <stop offset="1" stopColor="#2e2922" />
            </linearGradient>
            <radialGradient id="sm-glow">
              <stop offset="0" stopColor="#f3c27a" stopOpacity=".55" />
              <stop offset="1" stopColor="#f3c27a" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sm-glow-hot">
              <stop offset="0" stopColor="#f6c983" stopOpacity=".9" />
              <stop offset="1" stopColor="#f6c983" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sm-street" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#B0833F" stopOpacity=".25" />
              <stop offset="1" stopColor="#B0833F" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* shell */}
          <polygon points={backWall} fill={C.wallBack} />
          <polygon points={leftWall} fill={C.wall} />
          <polygon points={rightWall} fill={shade(C.wall, 1.15)} />
          <polygon points={floor} fill="url(#sm-floor)" />
          {planks}

          {/* long mirror down the right wall, with the style posters above it */}
          <polygon points={pts([P(W, 3, 3.2), P(W, 38, 3.2), P(W, 38, 7.0), P(W, 3, 7.0)])} fill="url(#sm-mirror)" stroke="#8a6a3a" strokeOpacity={0.5} />
          {Array.from({ length: 16 }, (_, i) => {
            const y0 = 4 + i * 2.1;
            return (
              <polygon
                key={`poster${i}`}
                points={pts([P(W, y0, 7.3), P(W, y0 + 1.5, 7.3), P(W, y0 + 1.5, 8.6), P(W, y0, 8.6)])}
                fill="#cfc2a8"
                fillOpacity={0.55}
              />
            );
          })}

          {/* station mirrors on the left wall, one behind each chair */}
          {CHAIR_YS.map((y, i) => (
            <g key={`smir${i}`} style={{ opacity: dim(i + 1), transition: "opacity .3s" }}>
              <polygon
                points={pts([P(0, y - 2.6, 3.4), P(0, y + 2.6, 3.4), P(0, y + 2.6, 7.4), P(0, y - 2.6, 7.4)])}
                fill="url(#sm-mirror)"
                stroke="#8a6a3a"
                strokeOpacity={0.6}
              />
            </g>
          ))}
          {/* sconces over the towers */}
          {towers.map((y, i) => {
            const [sx, sy] = P(0.15, y, 8.4);
            return <circle key={`sc${i}`} cx={sx} cy={sy} r={4} fill="#f6c983" />;
          })}

          {/* storefront line, door gap and the street */}
          {(() => {
            const [a, b] = P(0, 0, 0);
            const [c, d] = P(W, 0, 0);
            const [ga] = P(3.0, 0, 0);
            const [gb] = P(6.2, 0, 0);
            return (
              <g>
                <polygon points={`${a},${b} ${c},${d} ${c},${VB_H} ${a},${VB_H}`} fill="url(#sm-street)" />
                <line x1={a} y1={b} x2={ga} y2={b} stroke="#cfc2a8" strokeOpacity={0.7} strokeWidth={3} />
                <line x1={gb} y1={b} x2={c} y2={d} stroke="#cfc2a8" strokeOpacity={0.7} strokeWidth={3} />
                {/* door swing */}
                <path
                  d={`M ${gb} ${b} A ${gb - ga} ${(gb - ga) * 0.35} 0 0 1 ${ga} ${b - (gb - ga) * 0.35}`}
                  fill="none"
                  stroke="#B0833F"
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                />
                <line x1={ga} y1={b} x2={ga} y2={b - (gb - ga) * 0.35} stroke="#B0833F" strokeWidth={2.5} />
              </g>
            );
          })()}

          {/* floor glow + mats under each chair */}
          {CHAIR_YS.map((y, i) => {
            const n = i + 1;
            const hot = active === n;
            const [gx, gy] = P(CHAIR_X, y, 0);
            const [rx] = P(CHAIR_X + 3.2, y, 0);
            const ry = (P(CHAIR_X, y - 3, 0)[1] - P(CHAIR_X, y + 3, 0)[1]) / 2;
            return (
              <g key={`mat${n}`} style={{ opacity: dim(n), transition: "opacity .3s" }}>
                <ellipse cx={gx} cy={gy} rx={rx - gx} ry={ry} fill={hot ? "url(#sm-glow-hot)" : "url(#sm-glow)"} />
                <polygon
                  points={pts(disc(2.0, y, 3.1, 0.01, -Math.PI / 2, Math.PI / 2))}
                  fill={C.mat}
                  stroke={hot ? C.brass : "#2a2420"}
                  strokeWidth={hot ? 2.5 : 1}
                  style={{ transition: "stroke .3s" }}
                />
              </g>
            );
          })}

          {/* everything that stands up, back to front */}
          {items.map((it) => (
            <g key={it.key} style={{ opacity: dim(it.chair), transition: "opacity .3s" }}>
              {it.faces.map((f, j) => (
                <polygon key={j} points={f.d} fill={f.fill} stroke={f.stroke ?? "rgba(0,0,0,.35)"} strokeWidth={0.6} strokeLinejoin="round" />
              ))}
            </g>
          ))}

          {/* leader lines from each label down to its headrest */}
          {chairs.map(({ n }) => {
            const [hx, hy] = P(CHAIR_X + 1.55, CHAIR_YS[n - 1], 4.7);
            const [lx, ly] = anchors[n - 1];
            return (
              <line
                key={`lead${n}`}
                x1={lx}
                y1={ly}
                x2={hx}
                y2={hy}
                stroke={C.brass}
                strokeWidth={1.5}
                strokeOpacity={active === null || active === n ? 0.9 : 0.25}
              />
            );
          })}
        </svg>

        {/* chair badges */}
        {chairs.map((c) => {
          const on = active === c.n;
          const off = active !== null && !on;
          return (
            <button
              key={c.n}
              type="button"
              onMouseEnter={() => setActive(c.n)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(c.n)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(on ? null : c.n)}
              aria-label={`Chair ${c.n}: ${c.name}`}
              className="absolute flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap p-1 text-[10px] font-semibold uppercase tracking-[0.08em] transition-all duration-300 sm:gap-2 sm:px-2.5 sm:py-1.5 sm:text-[12px]"
              style={{
                ...pct(anchors[c.n - 1]),
                background: on ? "var(--d-accent)" : "rgba(22,17,12,.92)",
                color: on ? "var(--d-onaccent)" : "var(--d-fg)",
                border: "1px solid var(--d-accent)",
                opacity: off ? 0.6 : 1,
                fontFamily: "var(--d-display)",
                zIndex: 10 - c.n,
              }}
            >
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] sm:h-5 sm:w-5 sm:text-[11px]"
                style={{
                  background: on ? "var(--d-onaccent)" : "var(--d-accent)",
                  color: on ? "var(--d-accent)" : "var(--d-onaccent)",
                }}
              >
                {c.n}
              </span>
              <span>{c.name}</span>
            </button>
          );
        })}

        {/* floor callouts */}
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] sm:text-[11px]"
          style={{ ...pct(doorLabel), background: "var(--d-accent)", color: "var(--d-onaccent)" }}
        >
          ↑ You walk in here
        </span>
        <span
          className="pointer-events-none absolute hidden -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 text-[11px] uppercase tracking-[0.14em] sm:block"
          style={{ ...pct(P(1.2, 4, 4.6)), color: "var(--d-fg)", background: "rgba(22,17,12,.8)" }}
        >
          Register
        </span>
        <span
          className="pointer-events-none absolute hidden -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 text-[11px] uppercase tracking-[0.14em] sm:block"
          style={{ ...pct(P(14.1, 10.2, 0)), color: "var(--d-fg)", background: "rgba(22,17,12,.8)" }}
        >
          Waiting area
        </span>
        <span
          className="pointer-events-none absolute bottom-2 right-3 text-[10px] uppercase tracking-[0.16em] sm:text-[11px]"
          style={{ color: "var(--d-body)" }}
        >
          Main Street ↓
        </span>
      </div>

      {/* legend */}
      <ol className="grid grid-cols-1 gap-px sm:grid-cols-3 lg:grid-cols-1" style={{ background: "var(--d-line)" }}>
        {chairs.map((c) => {
          const on = active === c.n;
          return (
            <li
              key={c.n}
              onMouseEnter={() => setActive(c.n)}
              onMouseLeave={() => setActive(null)}
              className="flex gap-4 p-5 transition-colors duration-300"
              style={{ background: on ? "var(--d-surface)" : "var(--d-bg)" }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold"
                style={{ background: "var(--d-accent)", color: "var(--d-onaccent)", fontFamily: "var(--d-display)" }}
              >
                {c.n}
              </span>
              <div>
                <div
                  className="text-[20px] font-medium uppercase leading-none tracking-[0.02em]"
                  style={{ color: "var(--d-fg)", fontFamily: "var(--d-display)" }}
                >
                  {c.name}
                </div>
                <p className="mt-2 text-[14px] leading-[1.5]" style={{ color: "var(--d-body)" }}>
                  {c.note}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
