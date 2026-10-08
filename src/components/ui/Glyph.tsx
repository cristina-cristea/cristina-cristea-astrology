import type { ReactElement } from "react";
import type { Glyph as GlyphName } from "../../types";

/**
 * Thin-line celestial artwork, drawn rather than photographed.
 * Each product gets a distinct figure so cards stay legible at a glance.
 * Everything renders in currentColor at a hairline weight.
 */
export function Glyph({
  name,
  className,
  size = "100%",
}: {
  name: GlyphName;
  className?: string;
  size?: number | string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {figures[name]}
    </svg>
  );
}

const dot = (cx: number, cy: number, r = 1.6, key?: string) => (
  <circle key={key} cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
);

const ring = (r: number, key?: string) => (
  <circle key={key} cx={100} cy={100} r={r} />
);

/** 12 evenly spaced house divisions on a wheel. */
const spokes = (inner: number, outer: number) =>
  Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    return (
      <line
        key={i}
        x1={100 + inner * Math.cos(a)}
        y1={100 + inner * Math.sin(a)}
        x2={100 + outer * Math.cos(a)}
        y2={100 + outer * Math.sin(a)}
      />
    );
  });

const figures: Record<GlyphName, ReactElement> = {
  /* Natal chart — a full wheel with houses and an aspect web */
  chart: (
    <g>
      {ring(78, "a")}
      {ring(62, "b")}
      {ring(40, "c")}
      {spokes(62, 78)}
      <path d="M100 60 L134 118 L66 118 Z" opacity={0.85} />
      <path d="M72 82 L128 82 L100 138 Z" opacity={0.5} />
      {dot(100, 60, 2, "d1")}
      {dot(134, 118, 2, "d2")}
      {dot(66, 118, 2, "d3")}
      <line x1="22" y1="100" x2="178" y2="100" opacity={0.35} />
    </g>
  ),

  /* Forecasting — orbital paths crossing a fixed point */
  orbit: (
    <g>
      <ellipse cx="100" cy="100" rx="76" ry="30" />
      <ellipse cx="100" cy="100" rx="76" ry="30" transform="rotate(60 100 100)" opacity={0.7} />
      <ellipse cx="100" cy="100" rx="76" ry="30" transform="rotate(120 100 100)" opacity={0.45} />
      {ring(12, "core")}
      {dot(100, 100, 3.4, "sun")}
      {dot(176, 100, 2.4, "p1")}
      {dot(62, 34, 2, "p2")}
      {dot(138, 166, 2, "p3")}
    </g>
  ),

  /* Solar return — sun with rays returning to a degree */
  sun: (
    <g>
      {ring(34, "core")}
      {dot(100, 100, 3.2, "c")}
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i * Math.PI) / 12;
        const r1 = 46;
        const r2 = i % 2 === 0 ? 80 : 62;
        return (
          <line
            key={i}
            x1={100 + r1 * Math.cos(a)}
            y1={100 + r1 * Math.sin(a)}
            x2={100 + r2 * Math.cos(a)}
            y2={100 + r2 * Math.sin(a)}
            opacity={i % 2 === 0 ? 0.9 : 0.45}
          />
        );
      })}
      <path d="M100 12 A 88 88 0 0 1 176 56" opacity={0.5} />
      {dot(176, 56, 2.2, "mark")}
    </g>
  ),

  /* Progressed chart — a slow crescent sequence */
  moon: (
    <g>
      {ring(58, "outer")}
      <path d="M126 54 A 58 58 0 1 0 126 146 A 46 46 0 1 1 126 54 Z" opacity={0.9} />
      <path d="M100 28 A 72 72 0 0 1 172 100" opacity={0.4} />
      <path d="M100 172 A 72 72 0 0 1 28 100" opacity={0.4} />
      {dot(172, 100, 2, "m1")}
      {dot(28, 100, 2, "m2")}
      {dot(100, 28, 1.6, "m3")}
    </g>
  ),

  /* Relationship — two rings overlapping, a vesica between them */
  venus: (
    <g>
      <circle cx="74" cy="100" r="48" />
      <circle cx="126" cy="100" r="48" />
      <path d="M100 58 A 48 48 0 0 0 100 142 A 48 48 0 0 0 100 58 Z" opacity={0.55} />
      {dot(74, 100, 2.2, "v1")}
      {dot(126, 100, 2.2, "v2")}
      <line x1="74" y1="100" x2="126" y2="100" opacity={0.5} />
      {ring(78, "halo")}
    </g>
  ),

  /* Saturn — ringed planet */
  saturn: (
    <g>
      <circle cx="100" cy="100" r="36" />
      <ellipse cx="100" cy="100" rx="76" ry="22" transform="rotate(-18 100 100)" />
      <ellipse cx="100" cy="100" rx="62" ry="16" transform="rotate(-18 100 100)" opacity={0.5} />
      {dot(100, 100, 2.4, "s")}
    </g>
  ),

  /* Rising — horizon with a star cresting it */
  rising: (
    <g>
      <line x1="20" y1="132" x2="180" y2="132" />
      <path d="M46 132 A 54 54 0 0 1 154 132" />
      {ring(20, "r")}
      <path d="M100 62 L104 92 L134 96 L104 100 L100 130 L96 100 L66 96 L96 92 Z" opacity={0.9} />
      {dot(40, 150, 1.6, "x1")}
      {dot(160, 152, 1.4, "x2")}
      {dot(100, 158, 1.2, "x3")}
    </g>
  ),

  /* Star — an eight-point compass star with a faint halo */
  star: (
    <g>
      <path d="M100 26 L110 88 L172 100 L110 112 L100 174 L90 112 L28 100 L90 88 Z" />
      <path d="M100 58 L106 94 L142 100 L106 106 L100 142 L94 106 L58 100 L94 94 Z" opacity={0.5} />
      {ring(84, "halo")}
      {dot(100, 100, 2, "c")}
    </g>
  ),

  /* Comet — a long trailing arc */
  comet: (
    <g>
      <circle cx="132" cy="70" r="16" />
      {dot(132, 70, 2.4, "head")}
      <path d="M118 82 C 84 110, 56 132, 26 148" />
      <path d="M126 92 C 96 118, 70 140, 44 158" opacity={0.6} />
      <path d="M110 76 C 78 98, 52 118, 24 130" opacity={0.35} />
      <path d="M132 34 A 36 36 0 0 1 168 70" opacity={0.4} />
      {dot(40, 46, 1.6, "s1")}
      {dot(66, 30, 1.3, "s2")}
    </g>
  ),

  /* Eclipse — one disc passing across another */
  eclipse: (
    <g>
      {ring(52, "sun")}
      <circle cx="122" cy="88" r="52" opacity={0.85} />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i * Math.PI) / 8;
        return (
          <line
            key={i}
            x1={100 + 58 * Math.cos(a)}
            y1={100 + 58 * Math.sin(a)}
            x2={100 + 72 * Math.cos(a)}
            y2={100 + 72 * Math.sin(a)}
            opacity={0.4}
          />
        );
      })}
    </g>
  ),
};
