import { useEffect, useRef } from "react";

// A slow field of noise, quantised to a grid of 16 cells across the screen
// and dithered between two greys with a 2×2 Bayer screen: flat cells where
// the field is saturated, dot and checker cells where it is in between, the
// blobs sliding and shifting as the field moves. It moves all the time,
// along a random path: the direction and the pace wander, from noise over
// time, so cells flip here and there and it never settles. On load, once
// the logo has turned in, the cells come up one by one in a random order,
// each through the dither, spreading a little from the mark's corner; each
// load starts somewhere else in the noise, so no two look alike. It
// covers the hero block, runs 320px into the timeline, fades to the page
// colour by then and scrolls away with the hero; the loop stops while the
// hero is off screen. Drawn by the GPU as one WebGL triangle. The mouse
// leaves ripples that invert the field along a ring, with the old ASCII
// rain's drop physics in pixels.

// The page background, and the dark grey the field dithers towards.
const LIGHT = "#dedbd1";
const DARK = "#cfccc2";
const CELLS = 16; // cells across the width
const DOT = 4; // dither cell, CSS px
const WANDER = 0.06; // how fast the path changes direction and pace, per second
const REACH = 0.12; // how far the path wanders, in field units
const DRIFT = 0.0015; // a steady drift under the wander, field units per second, so it never retraces
const VIGNETTE = 0.12; // darkening at the corners, 0 to 1
const FADE = 0.4; // share of the height over which the field fades out at the bottom
const DEVELOP_AT = 0.6; // seconds after load when the field starts to develop
const DEVELOP = 1.6; // seconds the development takes
const POP = 0.2; // share of the development each cell takes to come up
const SPREAD = 0.3; // how much the cells' order follows the distance from the mark's corner, 0 (random) to 1 (a sweep)
const SEED = 20; // each load starts somewhere else in the noise, up to this far, in field units
// The field's only visible changes are cells flipping now and then, seconds
// apart, so 10 fps looks the same as 60 at a sixth of the cost. Ripples and
// the intro run at 60.
const FRAME_MS = 100;
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
  uView: WebGLUniformLocation | null;
  uScale: WebGLUniformLocation | null;
  uTime: WebGLUniformLocation | null;
  uDot: WebGLUniformLocation | null;
  uDevelop: WebGLUniformLocation | null;
  uFoot: WebGLUniformLocation | null;
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
uniform vec2 u_view;             // viewport size, CSS px: sets the cell
uniform float u_scale;           // canvas px per CSS px
uniform float u_time;            // seconds
uniform float u_dot;             // dither cell, canvas px
uniform float u_develop;         // the intro, 0 (page colour) to 1 (developed)
uniform float u_foot;            // the hero's foot, as a share of the canvas height
uniform vec2 u_seed;             // where in the noise this load starts
uniform vec3 u_light;
uniform vec3 u_dark;
uniform vec4 u_drops[MAX_DROPS]; // x, y (CSS px, origin bottom-left), radius, energy
uniform int u_count;

const float CELLS = ${CELLS.toFixed(1)};
const float WANDER = ${WANDER.toFixed(4)};
const float REACH = ${REACH.toFixed(4)};
const float DRIFT = ${DRIFT.toFixed(5)};
const float VIGNETTE = ${VIGNETTE.toFixed(3)};
const float FADE = ${FADE.toFixed(3)};
const float POP = ${POP.toFixed(3)};
const float SPREAD = ${SPREAD.toFixed(3)};
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

// A random number per cell, for the order the cells come up in.
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

// Where the field has drifted to: a random path, from noise over time, whose
// direction and pace wander, over a slow steady drift so it never retraces.
vec2 path(float time) {
  float s = time * WANDER;
  return vec2(snoise(vec2(s, 2.7)), snoise(vec2(s, 9.4))) * REACH + vec2(time, time * 0.35) * DRIFT;
}

// The field at a point, in cell units measured from the top-left: three
// octaves of noise, warped by a slower one, moved along the path.
float field(vec2 c) {
  vec2 n = c / CELLS;
  vec2 o = path(u_time) + u_seed;
  vec2 warp = vec2(snoise(n * 1.5 + o * 0.7), snoise(n * 1.5 + vec2(3.7, 9.1) - o.yx * 0.5)) * WARP;
  vec2 q = n * SCALE + warp + o;
  float f = 0.6 * snoise(q) + 0.3 * snoise(q * 2.0 + 11.0) + 0.15 * snoise(q * 4.0 + 23.0);
  return 0.5 + f * CONTRAST + BIAS;
}

void main() {
  vec2 p = gl_FragCoord.xy / u_scale;
  float cell = max(u_view.x, u_view.y) / CELLS;
  // Which cell, counted from the top-left like the dither.
  vec2 c = floor(vec2(p.x, u_size.y - p.y) / cell) + 0.5;
  float v = field(c);
  // Towards the foot the field goes to the page colour, through the dither
  // levels, so the section below starts on a plain background.
  vec2 f = vec2(p.x, u_size.y - p.y) / u_size;
  float fade = smoothstep(1.0 - FADE, 1.0, f.y);
  v = mix(v, 1.0, fade);
  // The intro: the cells come up one by one in a random order, each through
  // the dither over a short while, spreading a little from the mark's corner.
  float order = mix(hash(c + u_seed), (f.x + f.y) * 0.5, SPREAD) * (1.0 - POP);
  float grown = smoothstep(order, order + POP, u_develop);
  v = mix(1.0, v, grown);

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

  // The vignette, gone by the hero's foot: past it the field runs under the
  // timeline, whose pinned labels paint paper and would show as boxes on a
  // tint. It comes up with the intro.
  vec2 uv = p / u_size - 0.5;
  float vignette = 1.0 - smoothstep(1.0 - FADE, u_foot, f.y);
  col *= 1.0 - VIGNETTE * dot(uv, uv) * 2.0 * vignette * u_develop;
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
  gl.uniform2f(u("u_seed"), Math.random() * SEED, Math.random() * SEED);
  return { gl, uSize: u("u_size"), uView: u("u_view"), uScale: u("u_scale"), uTime: u("u_time"), uDot: u("u_dot"), uDevelop: u("u_develop"), uFoot: u("u_foot"), uDrops: u("u_drops"), uCount: u("u_count") };
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
    let visible = true;
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
      // The layout viewport, which phone toolbars do not resize.
      const view = document.documentElement;
      r.gl.uniform2f(r.uView, view.clientWidth, view.clientHeight);
      r.gl.uniform1f(r.uScale, scale);
      r.gl.uniform1f(r.uDot, Math.round(DOT * scale));
      // The hero's foot as a share of the canvas, which runs 320px past it:
      // the vignette is gone by there. The band is never shorter than half
      // the fade.
      const hero = canvas.parentElement?.clientHeight ?? height;
      r.gl.uniform1f(r.uFoot, Math.max(hero / height, 1 - FADE / 2));
    };

    const easeInOut = (x: number) => x * x * (3 - 2 * x);
    const draw = (r: Renderer, time: number) => {
      const grown = reduceMotion.matches ? 1 : Math.min(Math.max((time - DEVELOP_AT) / DEVELOP, 0), 1);
      r.gl.uniform1f(r.uDevelop, easeInOut(grown));
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
      if (!renderer || !visible) return;
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
      const t = (now - start) / 1000;
      draw(renderer, t);
      const developing = t < DEVELOP_AT + DEVELOP + 0.1;
      if (drops.length > 0 || developing) raf = requestAnimationFrame(frame);
      else timer = window.setTimeout(wake, FRAME_MS);
    };

    const wake = () => {
      clearTimeout(timer);
      if (!raf && renderer && visible && !reduceMotion.matches) raf = requestAnimationFrame(frame);
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

    // Drops live in canvas coordinates: the canvas scrolls with the hero.
    const addDrop = (clientX: number, clientY: number, maxRadius: number, energy: number) => {
      if (reduceMotion.matches || !visible) return;
      const rect = canvas.getBoundingClientRect();
      if (drops.length >= MAX_DROPS) drops.shift();
      drops.push({ x: clientX - rect.left, y: clientY - rect.top, radius: 0, maxRadius, energy });
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
    // Draw only while some of the unfaded part is on screen; once the page
    // has scrolled down to the timeline, nothing visible changes, so stop.
    const onVisible = (entries: IntersectionObserverEntry[]) => {
      const e = entries[entries.length - 1];
      const topOnScreen = e.intersectionRect.top - e.boundingClientRect.top;
      visible = e.isIntersecting && topOnScreen < (1 - FADE) * e.boundingClientRect.height;
      if (visible) wake();
      else {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
        raf = 0;
        drops.length = 0;
      }
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
    // The canvas follows the hero's height, which fonts and viewports change.
    const sizes = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(onResize);
    if (sizes) sizes.observe(canvas);
    window.addEventListener("resize", onResize);
    const steps = Array.from({ length: 21 }, (_, i) => i / 20);
    const sight = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(onVisible, { threshold: steps });
    if (sight) sight.observe(canvas);
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
      sizes?.disconnect();
      sight?.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      reduceMotion.removeEventListener?.("change", run);
    };
  }, []);

  // An explicit height: a canvas is a replaced element, so top and bottom
  // alone would not stretch it.
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[calc(100%+320px)] w-full select-none opacity-0 [image-rendering:pixelated]"
    />
  );
}
