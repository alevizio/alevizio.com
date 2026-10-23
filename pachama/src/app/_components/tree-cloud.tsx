"use client";

import { useEffect, useRef } from "react";
import { cn } from "./cn";

/* The Nature Relations tree as a lidar scan: 42,000 points sampled from the
 * reveal deck's render of the tree (public/brand/nature-tree.bin: every lit
 * pixel with its brightness), coloured by height in the brand's spectrum,
 * blaze at the roots to canary at the crown. Each time it comes into view a
 * scan sweeps up from the ground and the points light as it passes; then
 * the crown sways and the points glimmer. With less motion it's just there. */

const VERT = `
attribute vec2 a_pos;
attribute vec2 a_extra;
uniform vec2 u_scale;
uniform float u_scan;
uniform float u_t;
uniform float u_size;
varying vec4 v_color;
vec3 ramp(float y) {
  vec3 c = mix(vec3(1.0, 0.451, 0.157), vec3(0.945, 0.518, 0.851), smoothstep(0.0, 0.25, y));
  c = mix(c, vec3(0.475, 0.639, 1.0), smoothstep(0.25, 0.55, y));
  c = mix(c, vec3(0.518, 0.882, 1.0), smoothstep(0.55, 0.68, y));
  c = mix(c, vec3(0.506, 0.937, 0.616), smoothstep(0.68, 0.8, y));
  return mix(c, vec3(0.961, 0.898, 0.267), smoothstep(0.8, 1.0, y));
}
void main() {
  float y = a_pos.y;
  float sway = sin(u_t * 0.7 + y * 2.4 + a_extra.y * 0.6) * 0.01 * y * y;
  gl_Position = vec4((a_pos.x + sway) * u_scale.x, -1.0 + y * u_scale.y, 0.0, 1.0);
  float lit = clamp((u_scan - y) / 0.03, 0.0, 1.0);
  float front = exp(-pow((u_scan - y) / 0.025, 2.0));
  float glimmer = 0.85 + 0.15 * sin(u_t * 2.3 + a_extra.y * 60.0);
  v_color = vec4(mix(ramp(y), vec3(1.0), front * 0.7), lit * (0.5 + 0.5 * a_extra.x) * glimmer);
  gl_PointSize = u_size * (1.0 + front * 0.8);
}`;

const FRAG = `
precision mediump float;
varying vec4 v_color;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = dot(c, c);
  if (d > 0.25) discard;
  gl_FragColor = vec4(v_color.rgb, v_color.a * (1.0 - smoothstep(0.16, 0.25, d)));
}`;

const SCAN_MS = 2600;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
};

/** Points from the file: x across (in tree heights, centred), y from the
 *  ground up, and per point its brightness and a seed for the motion. */
const parse = (buffer: ArrayBuffer) => {
  const view = new DataView(buffer);
  const count = view.getUint16(0, true);
  const ratio = view.getUint16(2, true) / view.getUint16(4, true);
  const pos = new Float32Array(count * 2);
  const extra = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    const o = 6 + i * 5;
    pos[i * 2] = (view.getUint16(o, true) / 65535 - 0.5) * ratio;
    pos[i * 2 + 1] = view.getUint16(o + 2, true) / 65535;
    extra[i * 2] = view.getUint8(o + 4) / 255;
    extra[i * 2 + 1] = ((i * 2654435761) % 4294967296) / 4294967296;
  }
  return { count, ratio, pos, extra };
};

export const TreeCloud = ({ className }: { className?: string }) => {
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
    const uScale = u("u_scale");
    const uScan = u("u_scan");
    const uT = u("u_t");
    const uSize = u("u_size");

    let tree: ReturnType<typeof parse> | null = null;
    let raf = 0;
    let visible = false;
    let scanStart = -1;
    const start = performance.now();

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
      // The tree stands on the bottom edge, its crown just reaching the top
      // (as on the slide), narrower if the panel is too slim for it.
      const fit = Math.min(1.02, (0.96 * w) / (h * tree.ratio));
      gl.uniform2f(uScale, (2 * fit * h) / w, 2 * fit);
      const scan = still ? 1.2 : scanStart < 0 ? -0.1 : -0.1 + 1.3 * ease(Math.min(1, (now - scanStart) / SCAN_MS));
      gl.uniform1f(uScan, scan);
      gl.uniform1f(uT, still ? 0 : (now - start) / 1000);
      gl.uniform1f(uSize, dpr * Math.min(3, Math.max(1.6, canvas.clientHeight / 340)));
      gl.drawArrays(gl.POINTS, 0, tree.count);
      if (!still && visible && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    fetch("/brand/nature-tree.bin")
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        tree = parse(buffer);
        const attribute = (name: string, data: Float32Array) => {
          const loc = gl.getAttribLocation(program, name);
          gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
          gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        };
        attribute("a_pos", tree.pos);
        attribute("a_extra", tree.extra);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        kick();
      })
      .catch(() => {});

    // Most of it in view: the scan runs (again, after it has left the view).
    const observer = new IntersectionObserver(
      ([entry]) => {
        const was = visible;
        visible = entry.intersectionRatio >= 0.35;
        if (visible && !was) scanStart = performance.now();
        if (!entry.isIntersecting) scanStart = -1;
        kick();
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(canvas);
    window.addEventListener("resize", kick);
    document.addEventListener("visibilitychange", kick);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", kick);
      document.removeEventListener("visibilitychange", kick);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={cn("block size-full", className)} />;
};
