"use client";

import { useEffect, useRef } from "react";
import { cn } from "./cn";

/* The hero: a forest canopy as a lidar point cloud. 51,000 points, one per
 * cell of a 300 × 170 grid read from the canopy-height render of Pará (its
 * viridis lightness rises with height, so it reads back as height; see
 * public/hero/canopy.bin). Drawn in raw WebGL, coloured by height in the
 * brand's spectrum. It sways, tilts toward the pointer, and as the page
 * scrolls the camera swings overhead while the heights flatten, until the
 * cloud is a map: height turned into colour. */

const COLS = 300;
const ROWS = 170;
const HALF_W = 1.6;
const HALF_D = 0.9;
const LIFT = 0.42;

// Low to tall: deep indigo, flax, glacier, lidar green, canary, blaze.
const RAMP = [
  [0x2b, 0x52, 0x8e],
  [0x6b, 0xa6, 0xff],
  [0x84, 0xe1, 0xff],
  [0x81, 0xf1, 0x8e],
  [0xf9, 0xe6, 0x3f],
  [0xff, 0x73, 0x24],
].map((c) => c.map((v) => v / 255));

const VERT = `
attribute vec3 a_pos;
attribute vec3 a_color;
uniform mat4 u_matrix;
uniform float u_lift;
uniform float u_size;
varying vec3 v_color;
void main() {
  vec4 clip = u_matrix * vec4(a_pos.x, a_pos.y * u_lift, a_pos.z, 1.0);
  gl_Position = clip;
  gl_PointSize = u_size / clip.w;
  v_color = a_color * clamp(1.75 - clip.w * 0.28, 0.55, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec3 v_color;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  if (dot(c, c) > 0.25) discard;
  gl_FragColor = vec4(v_color, 1.0);
}`;

type Mat4 = Float32Array;

const perspective = (fovy: number, aspect: number, near: number, far: number): Mat4 => {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
};

const sub = (a: number[], b: number[]) => a.map((v, i) => v - b[i]);
const norm = (a: number[]) => {
  const l = Math.hypot(...a) || 1;
  return a.map((v) => v / l);
};
const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

const lookAt = (eye: number[], target: number[], up: number[]): Mat4 => {
  const z = norm(sub(eye, target));
  const x = norm(cross(up, z));
  const y = cross(z, x);
  return new Float32Array([x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1]);
};

const multiply = (a: Mat4, b: Mat4): Mat4 => {
  const out = new Float32Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      out[c * 4 + r] = s;
    }
  return out;
};

const ramp = (t: number) => {
  const x = Math.min(0.9999, Math.max(0, t)) * (RAMP.length - 1);
  const i = Math.floor(x);
  const k = x - i;
  return RAMP[i].map((v, n) => v + (RAMP[i + 1][n] - v) * k);
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Points for the grid: x across, height, depth; a little jitter in each
 *  cell so the rows don't show. Seeded, so every visit draws the same. */
const build = (heights: Uint8Array) => {
  const pos = new Float32Array(COLS * ROWS * 3);
  const col = new Float32Array(COLS * ROWS * 3);
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) - 0.5;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      const h = heights[i] / 255;
      pos[i * 3] = ((c + 0.5 + rand() * 0.8) / COLS) * 2 * HALF_W - HALF_W;
      pos[i * 3 + 1] = h * LIFT;
      pos[i * 3 + 2] = ((r + 0.5 + rand() * 0.8) / ROWS) * 2 * HALF_D - HALF_D;
      col.set(ramp(h), i * 3);
    }
  return { pos, col };
};

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
};

export const CanopyCloud = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!canvas || !gl) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const runway = canvas.closest<HTMLElement>("[data-runway]");

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    const uMatrix = gl.getUniformLocation(program, "u_matrix");
    const uLift = gl.getUniformLocation(program, "u_lift");
    const uSize = gl.getUniformLocation(program, "u_size");

    let raf = 0;
    let visible = true;
    let ready = false;
    const pointer = { x: 0.5, y: 0.5 };
    const tilt = { x: 0.5, y: 0.5 };
    const start = performance.now();

    const progress = () => {
      if (!runway || still) return 0;
      const box = runway.getBoundingClientRect();
      const travel = box.height - window.innerHeight;
      return travel > 0 ? Math.min(1, Math.max(0, -box.top / travel)) : 0;
    };

    const draw = (now: number) => {
      raf = 0;
      if (!ready) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const p = ease(progress());
      runway?.style.setProperty("--flat", p.toFixed(3));
      runway?.setAttribute("data-stage", p > 0.6 ? "map" : "cloud");
      if (!still) {
        tilt.x += (pointer.x - tilt.x) * 0.05;
        tilt.y += (pointer.y - tilt.y) * 0.05;
      }
      const t = still ? 0 : (now - start) / 1000;
      const aspect = w / h;
      const fov = (35 * Math.PI) / 180;
      // Overhead, the plane should just cover the screen.
      const cover = Math.min(HALF_D * 2, (HALF_W * 2) / aspect) / (2 * Math.tan(fov / 2));
      const yaw = (Math.sin(t * 0.08) * 0.32 + (tilt.x - 0.5) * 0.5) * (1 - p);
      const pitch = lerp(0.5 + (tilt.y - 0.5) * 0.14, Math.PI / 2 - 0.001, p);
      const dist = lerp(aspect < 1 ? 4.6 : 3.1, cover, p);
      const target = [0, lerp(0.06, 0, p), lerp(0.12, 0, p)];
      const eye = [
        target[0] + dist * Math.cos(pitch) * Math.sin(yaw),
        target[1] + dist * Math.sin(pitch),
        target[2] + dist * Math.cos(pitch) * Math.cos(yaw),
      ];
      const up = p > 0.98 ? [0, 0, -1] : [0, 1, 0];
      const matrix = multiply(perspective(fov, aspect, 0.1, 20), lookAt(eye, target, up));
      // Lens shift: standing, the cloud sits low, under the name and the
      // line; flat, the map is centred.
      const shift = lerp(aspect < 1 ? 0.18 : 0.34, 0, p);
      for (let c = 0; c < 4; c++) matrix[c * 4 + 1] -= shift * matrix[c * 4 + 3];
      gl.uniformMatrix4fv(uMatrix, false, matrix);
      gl.uniform1f(uLift, 1 - p);
      // The points swell as they settle, so the map reads as a surface.
      gl.uniform1f(uSize, 7 * dpr * (h / dpr / 900) * lerp(1, 1.9, p));
      gl.drawArrays(gl.POINTS, 0, COLS * ROWS);
      if (!still && visible && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    fetch("/hero/canopy.bin")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        const { pos, col } = build(new Uint8Array(buffer));
        const attribute = (name: string, data: Float32Array) => {
          const loc = gl.getAttribLocation(program, name);
          gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
          gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
        };
        attribute("a_pos", pos);
        attribute("a_color", col);
        gl.enable(gl.DEPTH_TEST);
        ready = true;
        canvas.setAttribute("data-ready", "");
        kick();
      })
      .catch(() => {});

    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = e.clientY / window.innerHeight;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    observer.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    document.addEventListener("visibilitychange", kick);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      document.removeEventListener("visibilitychange", kick);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={cn("block size-full", className)} />;
};
