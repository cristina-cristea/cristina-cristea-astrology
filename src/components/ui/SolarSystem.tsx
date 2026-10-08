/**
 * The hero's centrepiece: an orrery of the eight planets.
 *
 * Derived from real values rather than drawn by eye, with two deliberate
 * compressions — without them the thing is undrawable:
 *
 *  - Distances span 78x (Mercury 0.39 AU to Neptune 30.07 AU), so radii use a
 *    power curve, r ∝ a^0.38. Ordering and relative gaps survive; the absolute
 *    scale does not. The inner four stay tightly clustered, which is true.
 *  - Periods span 684x (88 days to 165 years). Rather than invent speeds, each
 *    period follows Kepler's third law applied to the DRAWN radius (T ∝ r^1.5).
 *    The model is therefore internally consistent — every planet moves at the
 *    right speed for where it actually sits — while staying watchable.
 *  - Body sizes are likewise compressed (Jupiter is 28x Mercury's radius).
 *
 * Saturn carries the ring, Earth the Moon, and the Mars–Jupiter gap holds the
 * asteroid belt. The ring and Moon counter-rotate so they stay level as they
 * travel.
 *
 * Decorative: aria-hidden, transform-only motion, stopped by the global
 * prefers-reduced-motion rule.
 */

interface Planet {
  name: string;
  /** Orbital radius in viewBox units; centre is 100,100 of a 200 box. */
  radius: number;
  size: number;
  duration: string;
  /** Starting angle, so the planets never line up. */
  phase: number;
  ring?: boolean;
  moon?: boolean;
}

const PLANETS: Planet[] = [
  { name: "Mercury", radius: 28.0, size: 1.10, duration: "26s",  phase: 18 },
  { name: "Venus",   radius: 32.2, size: 1.46, duration: "32s",  phase: 155 },
  { name: "Earth",   radius: 34.8, size: 1.48, duration: "36s",  phase: 282, moon: true },
  { name: "Mars",    radius: 38.7, size: 1.21, duration: "42s",  phase: 71 },
  { name: "Jupiter", radius: 54.3, size: 3.40, duration: "70s",  phase: 206 },
  { name: "Saturn",  radius: 65.1, size: 3.18, duration: "92s",  phase: 340, ring: true },
  { name: "Uranus",  radius: 81.2, size: 2.36, duration: "128s", phase: 113 },
  { name: "Neptune", radius: 94.0, size: 2.34, duration: "160s", phase: 247 },
];

/** Between Mars and Jupiter. */
const BELT_RADIUS = 46.5;

/** Alternating long and short rays, kept clear of Mercury's orbit. */
const RAYS = Array.from({ length: 28 }, (_, i) => {
  const a = (i * Math.PI) / 14;
  const inner = 13.5;
  const outer = i % 2 === 0 ? 22 : 18;
  return {
    x1: 100 + inner * Math.cos(a), y1: 100 + inner * Math.sin(a),
    x2: 100 + outer * Math.cos(a), y2: 100 + outer * Math.sin(a),
    long: i % 2 === 0,
  };
});

export function SolarSystem() {
  return (
    <svg className="solar" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <g className="solar__orbits">
        {PLANETS.map((p) => (
          <circle key={p.name} cx={100} cy={100} r={p.radius} />
        ))}
      </g>

      <circle className="solar__belt" cx={100} cy={100} r={BELT_RADIUS} />

      <g className="solar__sun">
        <circle className="solar__corona" cx={100} cy={100} r={11.5} />
        <circle className="solar__core" cx={100} cy={100} r={8} />
        <g className="solar__rays">
          {RAYS.map((r, i) => (
            <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
                  opacity={r.long ? 0.95 : 0.45} />
          ))}
        </g>
      </g>

      {PLANETS.map((p) => (
        // Static phase sits outside the animated group, so the planets stay
        // scattered even when prefers-reduced-motion freezes the rotation.
        <g key={p.name} transform={`rotate(${p.phase} 100 100)`}>
          <g className="solar__revolve" style={{ animationDuration: p.duration }}>
            <g transform={`translate(${100 + p.radius} 100)`}>
              <g className="solar__counter" style={{ animationDuration: p.duration }}>
                {p.ring && (
                  <ellipse className="solar__ring" cx={0} cy={0}
                           rx={p.size * 2.3} ry={p.size * 0.8} transform="rotate(-18)" />
                )}
                <circle className="solar__planet" cx={0} cy={0} r={p.size} />
                {p.moon && (
                  <>
                    <circle className="solar__moon-path" cx={0} cy={0} r={p.size * 2.6} />
                    <circle className="solar__moon" cx={p.size * 2.6} cy={0} r={0.75} />
                  </>
                )}
              </g>
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}
