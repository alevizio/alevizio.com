import { useEffect, useRef } from "react";

// A slow field of noise, quantised to a grid of 16 cells across the screen
// and dithered between two greys with a 2×2 Bayer screen: flat cells where
// the field is saturated, dot and checker cells where it is in between, the
// blobs sliding and shifting as the field drifts. Drawn by the GPU as one
// fullscreen WebGL triangle. The mouse leaves ripples that invert the field
// along a ring, with the old ASCII rain's drop physics in pixels.

// The page background, and the dark grey the field dithers towards.
const LIGHT = "#dedbd1";
const DARK = "#b5b2a8";
const CELLS = 16; // cells across the width
const DOT = 4; // dither cell, CSS px
const SPEED = 0.03; // how fast the field drifts
const VIGNETTE = 0.12; // darkening at the corners, 0 to 1
// With no ripple the only visible changes are cells flipping now and then, so
// 15 fps looks the same as 60 and costs a quarter. Ripples run at 60.
const IDLE_MS = 66;
const MAX_DROPS = 20;
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
  uSize: WebGLUniformLocation | null;
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

uniform vec2 u_size;             // canvas size, CSS px
uniform float u_scale;           // canvas px per CSS px
uniform float u_time;            // seconds
uniform float u_dot;             // dither cell, canvas px
uniform vec3 u_light;
uniform vec3 u_dark;
uniform vec4 u_drops[MAX_DROPS]; // x, y (CSS px, origin bottom-left), radius, energy
uniform int u_count;

const float CELLS = ${CELLS.toFixed(1)};
const float SPEED = ${SPEED.toFixed(3)};
const float VIGNETTE = ${VIGNETTE.toFixed(3)};
const float SCALE = 3.0;      // blobs span a few cells
const float WARP = 0.35;      // distortion of the field
const float CONTRAST = 8.0;   // most cells saturate; the rest dither
const float BIAS = 0.04;      // a little more light than dark

// 2-D simplex noise (Ian McEwan, Ashima Arts; MIT), about -1 to 1.
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// The field at a point, in cell units measured from the top-left: three
// octaves of noise, warped by a slower one, drifting with time.
float field(vec2 c) {
  vec2 n = c / CELLS;
  float t = u_time * SPEED;
  vec2 warp = vec2(snoise(n * 1.5 + t * 0.7), snoise(n * 1.5 + vec2(3.7, 9.1) - t * 0.5)) * WARP;
  vec2 q = n * SCALE + warp + vec2(t, t * 0.35);
  float f = 0.6 * snoise(q) + 0.3 * snoise(q * 2.0 + 11.0) + 0.15 * snoise(q * 4.0 + 23.0);
  return 0.5 + f * CONTRAST + BIAS;
}

void main() {
  vec2 p = gl_FragCoord.xy / u_scale;
  float cell = max(u_size.x, u_size.y) / CELLS;
  // Which cell, counted from the top-left like the dither.
  vec2 c = floor(vec2(p.x, u_size.y - p.y) / cell) + 0.5;
  float v = field(c);

  // Ripples: along each ring the field is inverted, so flat cells go dark
  // or light and the ring's soft edges come out as dots.
  float ring = 0.0;
  for (int i = 0; i < MAX_DROPS; i++) {
    if (i >= u_count) break;
    vec4 d = u_drops[i];
    float dist = length(p - d.xy);
    float band = max(1.0 - abs(dist - d.z) * 0.1, (1.0 - abs(dist - d.z + 10.0) * 0.15) * 0.5);
    ring += max(band, 0.0) * d.w;
  }
  v = mix(v, 1.0 - v, min(ring, 1.0));

  // Ordered dither, a 2×2 Bayer screen fixed to the canvas pixels.
  vec2 g = mod(floor(gl_FragCoord.xy / u_dot), 2.0);
  float threshold = (mod(g.x * 2.0 + g.y * 3.0, 4.0) + 0.5) / 4.0;
  vec3 col = mix(u_dark, u_light, step(threshold, v));

  vec2 uv = p / u_size - 0.5;
  col *= 1.0 - VIGNETTE * dot(uv, uv) * 2.0;
  gl_FragColor = vec4(col, 1.0);
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

  const u = (name: string) => gl.getUniformLocation(program, name);
  gl.uniform3fv(u("u_light"), new Float32Array(hexToRgb(LIGHT)));
  gl.uniform3fv(u("u_dark"), new Float32Array(hexToRgb(DARK)));
  return { gl, uSize: u("u_size"), uScale: u("u_scale"), uTime: u("u_time"), uDot: u("u_dot"), uDrops: u("u_drops"), uCount: u("u_count") };
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
      // pixels per canvas pixel, so the cells and dots stay crisp when the
      // canvas is scaled up to the screen.
      const scale = dpr / Math.ceil(dpr / 1.5);
      const width = canvas.clientWidth;
      height = canvas.clientHeight;
      const bufferWidth = Math.round(width * scale);
      const bufferHeight = Math.round(height * scale);
      // Setting the size clears the canvas, so only do it when it changed.
      if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
        canvas.width = bufferWidth;
        canvas.height = bufferHeight;
      }
      r.gl.viewport(0, 0, canvas.width, canvas.height);
      r.gl.uniform2f(r.uSize, width, height);
      r.gl.uniform1f(r.uScale, scale);
      r.gl.uniform1f(r.uDot, Math.round(DOT * scale));
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
      // 60 fps is plenty for the ripples; on 120 Hz screens this halves the work.
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
      draw(renderer, (now - start) / 1000);
      if (drops.length > 0) raf = requestAnimationFrame(frame);
      else timer = window.setTimeout(wake, IDLE_MS);
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
      // Paint again right away: the loop may be waiting, and a resized canvas is blank.
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
