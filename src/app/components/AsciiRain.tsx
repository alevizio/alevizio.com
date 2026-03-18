import { useEffect, useRef } from "react";

interface Drop {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  energy: number;
}

const CHARS = " .,:;+*oO#@";
const CHAR_W = 7;
const CHAR_H = 14;

export default function AsciiRain() {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    const drops: Drop[] = [];
    let cols = Math.floor(window.innerWidth / CHAR_W);
    let rows = Math.floor(window.innerHeight / CHAR_H);
    let grid = new Float32Array(cols * rows);
    let raf = 0;
    let lastAmbient = 0;
    let lastPx = 0;
    let lastPy = 0;
    let lastPTime = 0;

    const onResize = () => {
      cols = Math.floor(window.innerWidth / CHAR_W);
      rows = Math.floor(window.innerHeight / CHAR_H);
      grid = new Float32Array(cols * rows);
    };

    // Mouse move — velocity-based drops
    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = now - lastPTime;
      if (dt < 30) return; // throttle first, BEFORE updating tracking

      const dx = e.clientX - lastPx;
      const dy = e.clientY - lastPy;
      const speed = dt > 0 ? Math.sqrt(dx * dx + dy * dy) / dt * 16 : 0;

      // Only update tracking when we pass the throttle
      lastPx = e.clientX;
      lastPy = e.clientY;
      lastPTime = now;

      if (speed < 0.3) return; // barely moved

      const s = Math.min(speed, 30) / 30;
      drops.push({
        x: e.clientX / CHAR_W,
        y: e.clientY / CHAR_H,
        radius: 0,
        maxRadius: 3 + s * 18,
        energy: 0.3 + s * 0.7,
      });
    };

    // Click — big drop
    const onClick = (e: MouseEvent) => {
      drops.push({
        x: e.clientX / CHAR_W,
        y: e.clientY / CHAR_H,
        radius: 0,
        maxRadius: 20 + Math.random() * 15,
        energy: 1,
      });
    };

    // Touch start — big drop
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      lastPx = t.clientX;
      lastPy = t.clientY;
      lastPTime = performance.now();
      drops.push({
        x: t.clientX / CHAR_W,
        y: t.clientY / CHAR_H,
        radius: 0,
        maxRadius: 15 + Math.random() * 10,
        energy: 0.9,
      });
    };

    // Touch move — velocity-based drops
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const now = performance.now();
      const dt = now - lastPTime;
      if (dt < 30) return; // throttle first

      const dx = t.clientX - lastPx;
      const dy = t.clientY - lastPy;
      const speed = dt > 0 ? Math.sqrt(dx * dx + dy * dy) / dt * 16 : 0;

      lastPx = t.clientX;
      lastPy = t.clientY;
      lastPTime = now;

      if (speed < 0.3) return;

      const s = Math.min(speed, 30) / 30;
      drops.push({
        x: t.clientX / CHAR_W,
        y: t.clientY / CHAR_H,
        radius: 0,
        maxRadius: 3 + s * 14,
        energy: 0.3 + s * 0.6,
      });
    };

    // Use capture phase on window so we get events before anything else
    window.addEventListener("mousemove", onMouseMove, true);
    window.addEventListener("click", onClick, true);
    window.addEventListener("touchstart", onTouchStart, { capture: true, passive: true });
    window.addEventListener("touchmove", onTouchMove, { capture: true, passive: true });
    window.addEventListener("resize", onResize);

    const animate = (time: number) => {
      // Ambient drops near center
      if (time - lastAmbient > 1400) {
        drops.push({
          x: cols * (0.3 + Math.random() * 0.4),
          y: rows * (0.2 + Math.random() * 0.6),
          radius: 0,
          maxRadius: 18 + Math.random() * 25,
          energy: 1,
        });
        if (Math.random() > 0.5) {
          drops.push({
            x: cols * (0.2 + Math.random() * 0.6),
            y: rows * (0.1 + Math.random() * 0.8),
            radius: 0,
            maxRadius: 12 + Math.random() * 18,
            energy: 0.7,
          });
        }
        lastAmbient = time;
      }

      grid.fill(0);

      for (let d = drops.length - 1; d >= 0; d--) {
        const drop = drops[d];
        drop.radius += 0.18;
        drop.energy *= 0.991;

        if (drop.energy < 0.01 || drop.radius > drop.maxRadius) {
          drops.splice(d, 1);
          continue;
        }

        const r1 = drop.radius;
        const r2 = Math.max(0, r1 - 1.5);
        const bound = Math.ceil(r1 + 2);
        const x0 = Math.max(0, Math.floor(drop.x - bound));
        const x1 = Math.min(cols - 1, Math.ceil(drop.x + bound));
        const y0 = Math.max(0, Math.floor(drop.y - bound / 1.8));
        const y1 = Math.min(rows - 1, Math.ceil(drop.y + bound / 1.8));

        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            const dx = x - drop.x;
            const dy = (y - drop.y) * 1.8;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const v = Math.max(
              Math.max(0, 1 - Math.abs(dist - r1) * 0.7),
              Math.max(0, 1 - Math.abs(dist - r2) * 1.0) * 0.5
            );
            grid[y * cols + x] += v * drop.energy;
          }
        }
      }

      let out = "";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          out += CHARS[Math.floor(Math.min(1, grid[y * cols + x]) * (CHARS.length - 1))];
        }
        if (y < rows - 1) out += "\n";
      }

      pre.textContent = out;
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("touchstart", onTouchStart, true as any);
      window.removeEventListener("touchmove", onTouchMove, true as any);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <pre
      ref={preRef}
      className="absolute inset-0 z-0 text-[#1E1E1E] opacity-[0.15] leading-none whitespace-pre pointer-events-none select-none overflow-hidden"
      style={{ fontSize: "14px", fontFamily: "monospace" }}
    />
  );
}
