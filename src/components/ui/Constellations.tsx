/**
 * Slowly drifting constellations for the hero backdrop.
 *
 * Star positions are laid out from the real patterns (approximate, flattened
 * to a 100x100 box) so the shapes are recognisable rather than random dots.
 * `mag` stands in for apparent brightness and drives the dot radius.
 *
 * Purely decorative: aria-hidden, and the drift is transform-only so it stays
 * on the compositor. The global prefers-reduced-motion rule stops it.
 */

interface Figure {
  name: string;
  stars: [x: number, y: number, mag: number][];
  lines: [from: number, to: number][];
}

const FIGURES: Record<string, Figure> = {
  ursaMajor: {
    name: "Ursa Major",
    stars: [
      [4, 28, 1.7], [19, 34, 1.3], [33, 38, 1.5],
      [46, 44, 1.0], [53, 62, 1.4], [76, 69, 1.5], [72, 47, 1.9],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
  },
  cassiopeia: {
    name: "Cassiopeia",
    stars: [[4, 22, 1.4], [28, 58, 1.6], [51, 24, 1.8], [73, 60, 1.3], [96, 20, 1.4]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  orion: {
    name: "Orion",
    stars: [
      [24, 14, 2.0], [69, 18, 1.6],
      [38, 50, 1.5], [48, 53, 1.6], [58, 56, 1.5],
      [30, 88, 1.4], [73, 86, 1.9],
    ],
    lines: [[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [0, 1]],
  },
  lyra: {
    name: "Lyra",
    stars: [[49, 8, 2.0], [34, 40, 1.2], [63, 43, 1.2], [38, 74, 1.1], [61, 72, 1.2]],
    lines: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 2]],
  },
  sagittarius: {
    name: "Sagittarius",
    // the Teapot asterism
    stars: [
      [46, 20, 1.5], [26, 48, 1.6], [22, 76, 1.9], [52, 74, 1.4],
      [54, 44, 1.3], [70, 38, 1.7], [82, 58, 1.2],
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [4, 5], [5, 6], [6, 3]],
  },
  aquarius: {
    name: "Aquarius",
    // water jar, with the stream falling away
    stars: [
      [36, 26, 1.6], [14, 38, 1.7], [48, 22, 1.3], [55, 33, 1.5],
      [66, 25, 1.2], [58, 42, 1.2], [68, 57, 1.0], [57, 70, 1.0],
      [71, 82, 0.9], [60, 94, 0.9],
    ],
    lines: [[1, 0], [0, 2], [2, 3], [3, 4], [3, 5], [5, 6], [6, 7], [7, 8], [8, 9]],
  },
  taurus: {
    name: "Taurus",
    // the Hyades V, Aldebaran, and the two horns
    stars: [
      [40, 54, 2.0], [29, 43, 1.3], [18, 32, 1.2], [49, 43, 1.3],
      [59, 33, 1.4], [78, 18, 1.8], [82, 68, 1.5], [62, 61, 1.1],
    ],
    lines: [[2, 1], [1, 0], [0, 3], [3, 4], [4, 5], [0, 7], [7, 6]],
  },
  scorpius: {
    name: "Scorpius",
    stars: [
      [12, 10, 1.3], [27, 15, 1.4], [20, 26, 1.9],
      [38, 34, 1.3], [50, 48, 1.4], [61, 62, 1.2],
      [74, 70, 1.3], [85, 76, 1.2], [79, 90, 1.4],
    ],
    lines: [[0, 2], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]],
  },
};

interface Placement {
  figure: keyof typeof FIGURES;
  /** CSS inset values — percentages keep them anchored as the hero resizes. */
  top: string;
  left: string;
  size: string;
  opacity: number;
  /** Drift cycle length and offset, so no two move in step. */
  duration: string;
  delay: string;
  /** Flips the drift direction for variety. */
  reverse?: boolean;
}

// Figures stay out of the orrery's outermost orbit entirely. On wide screens
// the max-width content leaves an empty column down the left, which carries
// the three large zodiac figures; below ~1400px that column closes, so the
// two biggest hide rather than crowd the copy.
const PLACEMENTS: Placement[] = [
  { figure: "cassiopeia",  top: "2%",  left: "-4%", size: "clamp(105px, 13vw, 180px)", opacity: 0.6,  duration: "58s", delay: "-4s" },
  { figure: "scorpius",    top: "1%",  left: "31%", size: "clamp(95px, 11vw, 155px)",  opacity: 0.5,  duration: "68s", delay: "-15s" },
  { figure: "aquarius",    top: "27%", left: "-1%", size: "clamp(130px, 12vw, 260px)", opacity: 0.5,  duration: "76s", delay: "-29s", reverse: true },
  { figure: "taurus",      top: "57%", left: "0%",  size: "clamp(115px, 10vw, 200px)", opacity: 0.45, duration: "70s", delay: "-41s" },
  { figure: "sagittarius", top: "84%", left: "0%",  size: "clamp(100px, 9vw, 175px)",  opacity: 0.5,  duration: "62s", delay: "-9s" },
  { figure: "lyra",        top: "84%", left: "45%", size: "clamp(80px, 9vw, 125px)",   opacity: 0.5,  duration: "64s", delay: "-11s", reverse: true },
];

export function Constellations() {
  return (
    <div className="constellations" aria-hidden="true">
      {PLACEMENTS.map((p, i) => {
        const fig = FIGURES[p.figure];
        return (
          <svg
            key={i}
            className={`constellation constellation--${p.figure}${
              p.reverse ? " constellation--rev" : ""
            }`}
            viewBox="0 0 100 100"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              opacity: p.opacity,
              animationDuration: p.duration,
              animationDelay: p.delay,
            }}
          >
            <g className="constellation__lines">
              {fig.lines.map(([a, b], j) => (
                <line
                  key={j}
                  x1={fig.stars[a][0]}
                  y1={fig.stars[a][1]}
                  x2={fig.stars[b][0]}
                  y2={fig.stars[b][1]}
                />
              ))}
            </g>
            {fig.stars.map(([x, y, mag], j) => (
              <circle
                key={j}
                className="constellation__star"
                cx={x}
                cy={y}
                r={mag}
                style={{ animationDelay: `${(j * 1.3 + i * 0.7).toFixed(1)}s` }}
              />
            ))}
          </svg>
        );
      })}
    </div>
  );
}
