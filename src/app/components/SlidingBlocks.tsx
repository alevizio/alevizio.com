import { useEffect, useRef } from "react";

// A patchwork of grey blocks that slide along their rows and columns, drawn by
// the GPU: one fullscreen WebGL triangle and a few microseconds of JavaScript
// per frame. The mouse leaves ripples that push the blocks aside and fill the
// ring with halftone dots, using the old ASCII rain's drop physics in pixels.

// Light to dark. The first is the page background, so an empty cell is invisible.
const TONES = ["#dedbd1", "#cfccc2", "#c0bdb3", "#a9a69d"];
const MAX_DROPS = 20;
// The blocks move in bursts: every TICK seconds some bands slide one cell in
// MOVE seconds, then everything rests and nothing is drawn until the next
// burst or the next ripple. Drawing is what costs; the shader itself is free.
const TICK = 3;
const MOVE = 0.8;
// The rain measured its drops in 7px-wide characters; same numbers, in px.
const CHAR = 7;

interface Drop {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  energy: number;
}

interface Renderer {
  gl: WebGLRenderingContext;
  uScale: WebGLUniformLocation | null;
  uTime: WebGLUniformLocation | null;
  uDot: WebGLUniformLocation | null;
  uDrops: WebGLUniformLocation | null;
  uCount: WebGLUniformLocation | null;
}

const VERTEX = `attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.0,1.0);}`;

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
#define MAX_DROPS ${MAX_DROPS}

uniform float u_scale;           // canvas px per CSS px
uniform float u_time;            // seconds
uniform float u_dot;             // halftone period in canvas px, always even
uniform vec3 u_tones[4];
uniform vec4 u_drops[MAX_DROPS]; // x, y (CSS px, origin bottom-left), radius, energy
uniform int u_count;

const float CELL = 120.0;
const float TICK = ${TICK.toFixed(2)};
const float MOVE = ${MOVE.toFixed(2)};

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

// Grid line i sits up to 40% off its regular place, so cells differ in size
// without summing widths.
float line(float i, float seed) {
  return i * CELL + (hash(vec2(mod(i, 64.0), seed)) - 0.5) * 0.8 * CELL;
}

// Which cell of that 1-D grid holds c.
float cell(float c, float seed) {
  float i = floor(c / CELL);
  if (c < line(i, seed)) return i - 1.0;
  if (c >= line(i + 1.0, seed)) return i + 1.0;
  return i;
}

// How far band b has slid. Band b moves every 3 to 6 ticks, always the same
// way: the moves it has finished, plus the eased one in progress, if any.
float slide(float b, float seed) {
  float every = 3.0 + floor(hash(vec2(b, seed)) * 4.0);
  float dir = hash(vec2(b, seed + 1.0)) < 0.5 ? -1.0 : 1.0;
  float tick = floor(u_time / TICK) + floor(hash(vec2(b, seed + 2.0)) * every);
  float done = floor((tick - 1.0 + every) / every);
  float eased = smoothstep(0.0, 1.0, fract(u_time / TICK) * TICK / MOVE);
  float moving = mod(tick, every) == 0.0 ? eased : 0.0;
  return dir * CELL * (done + moving);
}

// The block at q in a layer of sliding bands: q.y picks the band, q.x runs
// along it. 0 empty, 1 mid, 2 dark, 3 light dots, 4 dark dots, 5 checker.
float kind(vec2 q, float seed, float empty) {
  float b = cell(q.y, seed);
  float a = cell(q.x + slide(b, seed + 10.0), seed + 20.0 + b);
  // Odd cells sometimes join their left neighbour, for wider blocks.
  if (mod(a, 2.0) == 1.0 && hash(vec2(mod(a, 64.0), b + seed + 30.0)) < 0.4) a -= 1.0;
  float v = hash(vec2(mod(a, 64.0), b + seed + 40.0));
  if (v < empty) return 0.0;
  v = (v - empty) / (1.0 - empty);
  return v < 0.4 ? 1.0 : v < 0.6 ? 2.0 : v < 0.8 ? 3.0 : v < 0.9 ? 4.0 : 5.0;
}

vec3 paint(float k, float dots, float checker) {
  if (k < 0.5) return u_tones[0];
  if (k < 1.5) return u_tones[1];
  if (k < 2.5) return u_tones[2];
  if (k < 3.5) return mix(u_tones[0], u_tones[1], dots);
  if (k < 4.5) return mix(u_tones[0], u_tones[2], dots);
  return mix(u_tones[0], u_tones[2], checker);
}

void main() {
  vec2 p = gl_FragCoord.xy / u_scale;

  // Ripples: each ring pushes the pattern outward and leaves halftone ink.
  vec2 q = p;
  float ring = 0.0;
  for (int i = 0; i < MAX_DROPS; i++) {
    if (i >= u_count) break;
    vec4 d = u_drops[i];
    vec2 dv = p - d.xy;
    float dist = length(dv);
    float band = max(1.0 - abs(dist - d.z) * 0.1, (1.0 - abs(dist - d.z + 10.0) * 0.15) * 0.5);
    float v = max(band, 0.0) * d.w;
    ring += v;
    q += dv / max(dist, 1.0) * v * 12.0;
  }
  ring = min(ring, 1.0);

  // Columns slide up and down over rows that slide sideways.
  float columns = kind(q.yx, 100.0, 0.75);
  float rows = kind(q, 200.0, 0.7);
  float k = columns > 0.5 ? columns : rows;

  // The dot screen is fixed to the canvas pixels, so it never shimmers.
  vec2 g = fract(gl_FragCoord.xy / u_dot);
  float dots = step(max(g.x, g.y), 0.5);
  float checker = mod(floor(gl_FragCoord.x * 2.0 / u_dot) + floor(gl_FragCoord.y * 2.0 / u_dot), 2.0);
  vec3 col = paint(k, dots, checker);

  // Ring ink: dots that grow with the ring's strength, like the rain's
  // character ramp.
  float ink = step(max(g.x, g.y), ring) * step(0.06, ring);
  gl_FragColor = vec4(mix(col, u_tones[3], ink), 1.0);
}
`;

const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

function createRenderer(canvas: HTMLCanvasElement): Renderer | null {
  // Opaque: every pixel is painted, and the compositor skips blending.
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;
  const program = gl.createProgram();
  if (!program) return null;
  const sources: [number, string][] = [
    [gl.VERTEX_SHADER, VERTEX],
    [gl.FRAGMENT_SHADER, FRAGMENT],
  ];
  for (const [type, source] of sources) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    // Stripped from the production build (drop_console); here for dev.
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(shader));
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // One triangle that covers the whole canvas.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const tones = TONES.reduce<number[]>((all, hex) => all.concat(hexToRgb(hex)), []);
  gl.uniform3fv(gl.getUniformLocation(program, "u_tones"), new Float32Array(tones));
  const u = (name: string) => gl.getUniformLocation(program, name);
  return { gl, uScale: u("u_scale"), uTime: u("u_time"), uDot: u("u_dot"), uDrops: u("u_drops"), uCount: u("u_count") };
}

export default function SlidingBlocks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer = createRenderer(canvas);
    if (!renderer) return; // No WebGL: the plain page background stays.

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const drops: Drop[] = [];
    const dropData = new Float32Array(MAX_DROPS * 4);
    let raf = 0;
    let timer = 0;
    let start = 0;
    let last = 0;
    let height = 0;
    let shown = false;
    let lastPx = 0;
    let lastPy = 0;
    let lastPTime = 0;

    const resize = (r: Renderer) => {
      const dpr = window.devicePixelRatio || 1;
      // At most 1.5 canvas px per CSS px, with a whole number of device
      // pixels per canvas pixel, so the blocks and dots stay crisp when the
      // canvas is scaled up to the screen.
      const scale = dpr / Math.ceil(dpr / 1.5);
      height = canvas.clientHeight;
      const width = Math.round(canvas.clientWidth * scale);
      const bufferHeight = Math.round(height * scale);
      // Setting the size clears the canvas, so only do it when it changed.
      if (canvas.width !== width || canvas.height !== bufferHeight) {
        canvas.width = width;
        canvas.height = bufferHeight;
      }
      r.gl.viewport(0, 0, canvas.width, canvas.height);
      r.gl.uniform1f(r.uScale, scale);
      r.gl.uniform1f(r.uDot, 2 * Math.round(2 * scale));
    };

    const draw = (r: Renderer, time: number) => {
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        dropData[i * 4] = d.x;
        dropData[i * 4 + 1] = height - d.y;
        dropData[i * 4 + 2] = d.radius;
        dropData[i * 4 + 3] = d.energy;
      }
      r.gl.uniform4fv(r.uDrops, dropData);
      r.gl.uniform1i(r.uCount, drops.length);
      r.gl.uniform1f(r.uTime, time);
      r.gl.drawArrays(r.gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        canvas.classList.remove("opacity-0");
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!renderer) return;
      // 60 fps is plenty for the blocks; on 120 Hz screens this halves the work.
      if (now - last < 12.5) {
        raf = requestAnimationFrame(frame);
        return;
      }
      // Measured in 60 fps frames, like the rain, so a slow frame behaves the same.
      const dt = Math.min(now - last, 100) / 16.667;
      last = now;
      const decay = Math.pow(0.991, dt);
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.radius += 0.18 * CHAR * dt;
        d.energy *= decay;
        if (d.energy < 0.01 || d.radius > d.maxRadius) drops.splice(i, 1);
      }
      const t = (now - start) / 1000;
      draw(renderer, t);
      // Resting and no ripples: sleep until the next burst.
      if (t % TICK >= MOVE && drops.length === 0) timer = window.setTimeout(wake, (TICK - (t % TICK)) * 1000);
      else raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      clearTimeout(timer);
      if (!raf && renderer && !reduceMotion.matches) raf = requestAnimationFrame(frame);
    };

    const run = () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      raf = 0;
      if (!renderer) return;
      if (reduceMotion.matches) {
        drops.length = 0;
        draw(renderer, 0); // One still frame.
        return;
      }
      start = performance.now();
      last = start;
      raf = requestAnimationFrame(frame);
    };

    const addDrop = (x: number, y: number, maxRadius: number, energy: number) => {
      if (reduceMotion.matches) return;
      if (drops.length >= MAX_DROPS) drops.shift();
      drops.push({ x, y, radius: 0, maxRadius, energy });
      wake();
    };

    // Velocity-based drops, throttled: a fast move makes a wide, strong ring.
    const move = (x: number, y: number, reach: number, strength: number) => {
      const now = performance.now();
      const dt = now - lastPTime;
      if (dt < 30) return;
      const dx = x - lastPx;
      const dy = y - lastPy;
      const speed = dt > 0 ? (Math.sqrt(dx * dx + dy * dy) / dt) * 16 : 0;
      lastPx = x;
      lastPy = y;
      lastPTime = now;
      if (speed < 0.3) return;
      const s = Math.min(speed, 30) / 30;
      addDrop(x, y, (3 + s * reach) * CHAR, 0.3 + s * strength);
    };

    const onMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY, 18, 0.7);
    const onClick = (e: MouseEvent) => addDrop(e.clientX, e.clientY, (20 + Math.random() * 15) * CHAR, 1);
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      lastPx = t.clientX;
      lastPy = t.clientY;
      lastPTime = performance.now();
      addDrop(t.clientX, t.clientY, (15 + Math.random() * 10) * CHAR, 0.9);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      move(t.clientX, t.clientY, 14, 0.6);
    };
    const onResize = () => {
      if (!renderer) return;
      resize(renderer);
      // Paint again right away: the loop may be resting, and a resized canvas is blank.
      draw(renderer, reduceMotion.matches ? 0 : (performance.now() - start) / 1000);
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      raf = 0;
      renderer = null;
    };
    const onRestored = () => {
      renderer = createRenderer(canvas);
      if (!renderer) return;
      resize(renderer);
      run();
    };

    // Capture phase on window, so the events arrive before anything else.
    window.addEventListener("mousemove", onMouseMove, true);
    window.addEventListener("click", onClick, true);
    window.addEventListener("touchstart", onTouchStart, { capture: true, passive: true });
    window.addEventListener("touchmove", onTouchMove, { capture: true, passive: true });
    window.addEventListener("resize", onResize);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    reduceMotion.addEventListener?.("change", run);

    resize(renderer);
    run();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("mousemove", onMouseMove, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("touchstart", onTouchStart, true);
      window.removeEventListener("touchmove", onTouchMove, true);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      reduceMotion.removeEventListener?.("change", run);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full select-none opacity-0 transition-opacity duration-1000 [image-rendering:pixelated]"
    />
  );
}
