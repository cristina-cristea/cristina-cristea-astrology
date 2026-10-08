import { useEffect, useRef } from "react";

/**
 * Interactive star field.
 *
 * Dots scatter from a seeded layout so the pattern is stable between renders,
 * and each one is held to its home position by a weak spring. The pointer
 * pushes nearby dots outward with a squared falloff, so moving across the
 * field parts it and leaves a wake that settles behind the cursor — glitter
 * suspended in water.
 *
 * Drawn on a canvas rather than as DOM nodes: a few hundred elements each
 * taking a transform write per frame is enough to cost layout time, while a
 * canvas is a single paint.
 *
 * Decorative — aria-hidden, pointer-events:none (pointer position is read
 * from the window, so the canvas never intercepts clicks).
 */

interface Props {
  /** Dots per square pixel; the count is derived from the measured area. */
  density?: number;
  min?: number;
  max?: number;
  seed?: number;
}

interface Star {
  hx: number; hy: number;   // home
  x: number; y: number;     // current
  vx: number; vy: number;
  r: number;
  phase: number;            // twinkle offset
  speed: number;
  base: number;             // base opacity
}

const REPEL_RADIUS = 115;   // px of influence around the pointer
const PUSH = 2.6;           // peak outward acceleration
const SPRING = 0.013;       // pull back toward home
const DAMPING = 0.92;

export function StarField({
  density = 0.00048,
  min = 110,
  max = 520,
  seed = 7,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Resolve the dot colour from the design token so it tracks the palette.
    const token = getComputedStyle(document.documentElement)
      .getPropertyValue("--taupe").trim() || "#A2937F";
    const rgb = (() => {
      const h = token.replace("#", "");
      const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
      return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
    })();
    const fill = (a: number) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;

    let stars: Star[] = [];
    let w = 0, h = 0, dpr = 1;

    const build = () => {
      const rect = host.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(
        Math.min(max, Math.max(min, w * h * density))
      );

      let s = seed;
      const rnd = () => {
        s = (s * 1664525 + 1013904223) % 4294967296;
        return s / 4294967296;
      };

      stars = Array.from({ length: count }, () => {
        const hx = rnd() * w;
        const hy = rnd() * h;
        return {
          hx, hy, x: hx, y: hy, vx: 0, vy: 0,
          r: 0.5 + rnd() * 1.5,
          phase: rnd() * Math.PI * 2,
          speed: 0.4 + rnd() * 0.7,
          base: 0.25 + rnd() * 0.45,
        };
      });
    };

    // Pointer is tracked on the window and mapped into the host's box, so the
    // canvas itself can stay pointer-events:none and never swallow a click.
    let px = -9999, py = -9999;
    const onPointerMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
    };
    const onPointerLeave = () => { px = -9999; py = -9999; };

    let raf = 0;
    let running = true;
    let t = 0;

    const frame = () => {
      if (!running) return;
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      const still = reduced.matches;
      const r2 = REPEL_RADIUS * REPEL_RADIUS;

      for (const p of stars) {
        if (!still) {
          const dx = p.x - px;
          const dy = p.y - py;
          const d2 = dx * dx + dy * dy;

          if (d2 < r2) {
            const d = Math.sqrt(d2) || 0.0001;
            // squared falloff: a soft edge, a firm core
            const f = (1 - d / REPEL_RADIUS) ** 2 * PUSH;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }

          p.vx += (p.hx - p.x) * SPRING;
          p.vy += (p.hy - p.y) * SPRING;
          p.vx *= DAMPING;
          p.vy *= DAMPING;
          p.x += p.vx;
          p.y += p.vy;
        }

        // Displaced dots brighten slightly, so the wake reads as movement.
        const disp = Math.hypot(p.x - p.hx, p.y - p.hy);
        const lift = Math.min(disp / 45, 1) * 0.3;
        const tw = still ? 0 : Math.sin(t * p.speed + p.phase) * 0.22;
        const alpha = Math.max(0.06, Math.min(1, p.base + tw + lift));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + lift * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = fill(alpha);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };

    build();
    frame();

    const ro = new ResizeObserver(build);
    ro.observe(host);

    // Stop the loop when the field is off screen or the tab is hidden.
    const io = new IntersectionObserver(([entry]) => {
      const shouldRun = entry.isIntersecting && !document.hidden;
      if (shouldRun && !running) { running = true; frame(); }
      else if (!shouldRun) { running = false; cancelAnimationFrame(raf); }
    }, { threshold: 0 });
    io.observe(host);

    const onVisibility = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!running) { running = true; frame(); }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density, min, max, seed]);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}
