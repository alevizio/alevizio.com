"use client";

import { useEffect, useRef } from "react";
import { cn } from "../cn";

/* Banyan's cover tree, live: the 96,000 dots of the cover's point-cloud
 * tree (public/banyan-tree.bin, sampled from the cover with their colours
 * and sizes), drawn in raw WebGL where the cover draws it, running off the
 * top and the right. Each time it's reached it grows in from the trunk's
 * side out to the tips; then the tips sway a little, the dots glimmer, and
 * the tree leans away from the pointer. With less motion it's just there. */
const VERT = `
attribute vec2 a_uv;
attribute vec3 a_col;
attribute vec2 a_ss;
uniform vec4 u_box;
uniform vec2 u_res;
uniform vec2 u_off;
uniform float u_t;
uniform float u_scan;
uniform float u_px;
uniform float u_min;
varying vec4 v_col;
void main() {
  float sway = sin(u_t * 0.6 + a_uv.y * 3.0 + a_ss.y * 6.283) * 0.003 * (1.0 - a_uv.x);
  vec2 p = u_box.xy + (a_uv + vec2(sway, 0.0)) * u_box.zw + u_off;
  gl_Position = vec4(p.x / u_res.x * 2.0 - 1.0, 1.0 - p.y / u_res.y * 2.0, 0.0, 1.0);
  float lit = clamp((u_scan - (1.0 - a_uv.x)) / 0.08, 0.0, 1.0);
  float glimmer = 0.88 + 0.12 * sin(u_t * 2.1 + a_ss.y * 60.0);
  v_col = vec4(a_col, lit * glimmer);
  gl_PointSize = max(u_min, a_ss.x * u_px) * (0.6 + 0.4 * lit);
}`;

const FRAG = `
precision mediump float;
varying vec4 v_col;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = dot(c, c);
  if (d > 0.25) discard;
  gl_FragColor = vec4(v_col.rgb, v_col.a * (1.0 - smoothstep(0.14, 0.25, d)));
}`;

const GROW_MS = 2400;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
};

/** The file: uint32 count, uint16 width and height of the cover image,
 *  then per dot uint16 x and y (0..65535 across), uint8 r, g, b and its
 *  size in tenths of a pixel of the image. */
const parse = (buffer: ArrayBuffer) => {
  const view = new DataView(buffer);
  const count = view.getUint32(0, true);
  const width = view.getUint16(4, true);
  const uv = new Float32Array(count * 2);
  const col = new Float32Array(count * 3);
  const ss = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    const o = 8 + i * 8;
    uv[i * 2] = view.getUint16(o, true) / 65535;
    uv[i * 2 + 1] = view.getUint16(o + 2, true) / 65535;
    col[i * 3] = view.getUint8(o + 4) / 255;
    col[i * 3 + 1] = view.getUint8(o + 5) / 255;
    col[i * 3 + 2] = view.getUint8(o + 6) / 255;
    ss[i * 2] = view.getUint8(o + 7) / 10;
    ss[i * 2 + 1] = ((i * 2654435761) % 4294967296) / 4294967296;
  }
  return { count, width, uv, col, ss };
};

export const BanyanTree = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!canvas || !gl) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    const u = (name: string) => gl.getUniformLocation(program, name);

    let tree: ReturnType<typeof parse> | null = null;
    let raf = 0;
    let visible = false;
    let grown = -1;
    const start = performance.now();
    const pointer = { x: 0.5, y: 0.5 };
    const lean = { x: 0.5, y: 0.5 };

    const draw = (now: number) => {
      raf = 0;
      if (!tree) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (!w || !h) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      // Where the cover draws it (a 3:2 frame), scaled to cover a taller one;
      // in a tall one (a phone), the part the cover shows (its left 42%)
      // fills the width under the words.
      const base = Math.max(w, h * 1.3);
      const tall = w / h < 0.9;
      const box = tall
        ? { x: 0, y: h * 0.45 - 0.25 * ((w / 0.42) * 0.686), w: w / 0.42, h: (w / 0.42) * 0.686 }
        : { x: w - 0.611 * base, y: -0.256 * base, w: 1.461 * base, h: 1.002 * base };
      lean.x += (pointer.x - lean.x) * 0.05;
      lean.y += (pointer.y - lean.y) * 0.05;
      gl.uniform4f(u("u_box"), box.x, box.y, box.w, box.h);
      gl.uniform2f(u("u_res"), w, h);
      gl.uniform2f(u("u_off"), still ? 0 : (0.5 - lean.x) * 18 * dpr, still ? 0 : (0.5 - lean.y) * 12 * dpr);
      gl.uniform1f(u("u_t"), still ? 0 : (now - start) / 1000);
      gl.uniform1f(u("u_scan"), still ? 1.2 : grown < 0 ? -0.1 : -0.1 + 1.3 * ease(Math.min(1, (now - grown) / GROW_MS)));
      // A dot's size in the file is its reach from the core: twice that across.
      gl.uniform1f(u("u_px"), (box.w / tree.width) * 2.5);
      // Never smaller than a dot can be seen, on a phone's small tree.
      gl.uniform1f(u("u_min"), 1.4 * dpr);
      gl.drawArrays(gl.POINTS, 0, tree.count);
      if (!still && visible && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    fetch("/banyan-tree.bin")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        tree = parse(buffer);
        const attribute = (name: string, data: Float32Array, size: number) => {
          const loc = gl.getAttribLocation(program, name);
          gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
          gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
        };
        attribute("a_uv", tree.uv, 2);
        attribute("a_col", tree.col, 3);
        attribute("a_ss", tree.ss, 2);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        kick();
      })
      .catch(() => {});

    // Most of it in view: it grows (again, after it has left the view).
    const observer = new IntersectionObserver(
      ([entry]) => {
        const was = visible;
        visible = entry.intersectionRatio >= 0.3;
        if (visible && !was) grown = performance.now();
        if (!entry.isIntersecting) grown = -1;
        kick();
      },
      { threshold: [0, 0.3] },
    );
    observer.observe(canvas);
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width;
      pointer.y = (e.clientY - r.top) / r.height;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", kick);
    document.addEventListener("visibilitychange", kick);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", kick);
      document.removeEventListener("visibilitychange", kick);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={cn("block size-full", className)} />;
};
