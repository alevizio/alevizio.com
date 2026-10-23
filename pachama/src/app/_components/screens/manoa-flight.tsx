"use client";

import { useEffect, useRef, useState } from "react";
import { MdArrowBack, MdFavoriteBorder, MdKeyboardArrowDown, MdReplay, MdShare } from "react-icons/md";
import { BN } from "../banyan/ui";
import { MARKS } from "../brand-marks";
import { cn } from "../cn";

/* Manoa's page opening the way the project-page design storyboarded it,
 * built for real: the camera flies from the whole Earth down through South
 * America and Rondônia onto Manoa's actual boundary, then tilts into a 3D
 * view of it, Google Earth style, and slowly circles it. Drag to look
 * around once it lands.
 *
 * Everything is real and in place: Sentinel-2 cloudless 2023 imagery in five
 * levels (globe to project), SRTM heights, the forest canopy read from the
 * imagery and raised, and the boundary traced from Pachama's own monitoring
 * map, pinned to its coordinates by matching that map's clearing against the
 * satellite imagery. Built by the scripts in the scratch tools; the data is
 * in public/screens/manoa-3d. Drawn in raw WebGL, like the canopy hero. */

const DATA = "/screens/manoa-3d";
const R = 6371008.8;
const RAD = Math.PI / 180;
// The levels' extents, as the build script made them.
const PATCHES = [
  { id: "globe", lon0: -180, lon1: 180, lat0: -90, lat1: 90, feather: 0, nx: 128, ny: 64 },
  { id: "continent", lon0: -85, lon1: -35, lat0: -35, lat1: 12, feather: 0.06, nx: 64, ny: 64 },
  { id: "region", lon0: -65.708, lon1: -59.708, lat0: -11.869, lat1: -5.869, feather: 0.08, nx: 48, ny: 48 },
  { id: "area", lon0: -63.208, lon1: -62.208, lat0: -9.369, lat1: -8.369, feather: 0.08, nx: 48, ny: 48 },
] as const;
const PROJECT = { lon0: -62.958, lon1: -62.458, lat0: -9.119, lat1: -8.619 };
const TARGET = { lon: -62.70753, lat: -8.86933 };
// Relief: the terrain's heights and the canopy, exaggerated so they read.
const DEM_EXAG = 5;
const CANOPY_M = 35;
const CANOPY_EXAG = 9;
const WALL_M = 1400;

type V3 = [number, number, number];
const ecef = (lon: number, lat: number, h = 0): V3 => {
  const lo = lon * RAD;
  const la = lat * RAD;
  const r = R + h;
  return [r * Math.cos(la) * Math.cos(lo), r * Math.cos(la) * Math.sin(lo), r * Math.sin(la)];
};
const enu = (lon: number, lat: number) => {
  const lo = lon * RAD;
  const la = lat * RAD;
  return {
    e: [-Math.sin(lo), Math.cos(lo), 0] as V3,
    n: [-Math.sin(la) * Math.cos(lo), -Math.sin(la) * Math.sin(lo), Math.cos(la)] as V3,
    u: [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)] as V3,
  };
};
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => mul(a, 1 / (Math.hypot(...a) || 1));
const T0 = ecef(TARGET.lon, TARGET.lat);
const UP = enu(TARGET.lon, TARGET.lat).u;

// ---- The flight: where the camera looks, from how far, turned and tilted.
type Cam = { lon: number; lat: number; dist: number; heading: number; pitch: number; shift: number };
// The landed view looks at a point ahead of Manoa (and a little left of it),
// in metres along the heading, so the boundary sits low in the frame under
// the page's title; turning the view keeps that point where it is relative
// to Manoa, so it circles the boundary instead of swinging it away.
const AIM = { ahead: 9150, right: -2030 };
const aim = (heading: number) => ({
  lon: TARGET.lon + (AIM.ahead * Math.sin(heading) + AIM.right * Math.cos(heading)) / (RAD * R * Math.cos(TARGET.lat * RAD)),
  lat: TARGET.lat + (AIM.ahead * Math.cos(heading) - AIM.right * Math.sin(heading)) / (RAD * R),
});
const LAND_HEADING = -0.38;
const STOPS: { t: number; cam: Cam }[] = [
  { t: 0, cam: { lon: -70, lat: 8, dist: 4.2 * R, heading: 0, pitch: 0, shift: 0.42 } }, // Explore: the Earth low in the frame
  { t: 1600, cam: { lon: -64, lat: -4, dist: 3.4 * R, heading: 0, pitch: 0, shift: 0 } }, // it rises as the name arrives
  { t: 3300, cam: { lon: TARGET.lon, lat: TARGET.lat, dist: 1.05 * R, heading: 0, pitch: 0, shift: 0 } }, // South America
  { t: 5300, cam: { lon: TARGET.lon, lat: TARGET.lat, dist: 0.07 * R, heading: 0, pitch: 0, shift: 0 } }, // Rondônia
  { t: 7200, cam: { lon: TARGET.lon, lat: TARGET.lat, dist: 80e3, heading: -0.12, pitch: 0.25, shift: 0 } }, // Manoa, from above
  // In 3D, Google Earth style: looking north-northwest across it toward the
  // horizon, the boundary low in the frame under the page's title.
  { t: 9600, cam: { ...aim(LAND_HEADING), dist: 75e3, heading: LAND_HEADING, pitch: 1.15, shift: 0.12 } },
];
const LAND_AT = STOPS[STOPS.length - 1].t;
const NAME_AT = 900;
const RELIEF_AT: [number, number] = [7000, 9400];
const WALL_AT: [number, number] = [8600, 10200];
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const ramp = (ms: number, [a, b]: [number, number]) => ease(Math.min(1, Math.max(0, (ms - a) / (b - a))));

/** One glide through every stop: a monotone cubic through the values
 *  (Fritsch–Carlson, so nothing overshoots), still at the start and at the
 *  landing but never slowing to a halt at a stop on the way. */
const glide = (values: number[]) => {
  const t = STOPS.map((s) => s.t);
  const n = values.length;
  const d = values.slice(1).map((v, i) => (v - values[i]) / (t[i + 1] - t[i]));
  const m = values.map((_, i) => (i === 0 || i === n - 1 || d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) continue;
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const r = a * a + b * b;
    if (r > 9) {
      m[i] = (3 / Math.sqrt(r)) * a * d[i];
      m[i + 1] = (3 / Math.sqrt(r)) * b * d[i];
    }
  }
  return (ms: number) => {
    const i = Math.min(n - 2, Math.max(0, t.findIndex((x) => x > ms) - 1));
    const h = t[i + 1] - t[i];
    const k = (ms - t[i]) / h;
    const k2 = k * k;
    const k3 = k2 * k;
    return (2 * k3 - 3 * k2 + 1) * values[i] + (k3 - 2 * k2 + k) * h * m[i] + (3 * k2 - 2 * k3) * values[i + 1] + (k3 - k2) * h * m[i + 1];
  };
};
const GLIDE = {
  lon: glide(STOPS.map((s) => s.cam.lon)),
  lat: glide(STOPS.map((s) => s.cam.lat)),
  logDist: glide(STOPS.map((s) => Math.log(s.cam.dist))),
  heading: glide(STOPS.map((s) => s.cam.heading)),
  pitch: glide(STOPS.map((s) => s.cam.pitch)),
  shift: glide(STOPS.map((s) => s.cam.shift)),
};
const cameraAt = (ms: number): Cam => {
  if (ms >= LAND_AT) return STOPS[STOPS.length - 1].cam;
  return {
    lon: GLIDE.lon(ms),
    lat: GLIDE.lat(ms),
    dist: Math.exp(GLIDE.logDist(ms)),
    heading: GLIDE.heading(ms),
    pitch: GLIDE.pitch(ms),
    shift: GLIDE.shift(ms),
  };
};

// ---- Shaders.
const SKY_VS = `attribute vec2 a; varying vec2 v; void main(){ v = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }`;
const SKY_FS = `precision highp float;
varying vec2 v;
uniform vec2 uRes; uniform vec2 uCenter; uniform float uRadius; uniform float uLow; uniform float uHorizon;
void main(){
  vec2 p = v * uRes;
  float d = length(p - uCenter);
  vec3 space = vec3(0.024, 0.043, 0.082);
  float glow = exp(-max(0.0, d - uRadius) / (uRadius * 0.07 + 1.0)) * smoothstep(uRadius * 0.86, uRadius, d);
  vec3 col = space + vec3(0.36, 0.62, 0.9) * glow * 0.6;
  float h = clamp((v.y - uHorizon) / 0.55, 0.0, 1.0);
  vec3 sky = mix(vec3(0.72, 0.81, 0.86), vec3(0.17, 0.31, 0.5), pow(h, 0.65));
  gl_FragColor = vec4(mix(col, sky, uLow), 1.0);
}`;
const SURF_VS = `attribute vec3 aPos; attribute vec2 aUv; uniform mat4 uMvp; uniform vec3 uEye;
varying vec2 vUv; varying float vDist;
void main(){ vUv = aUv; vDist = length(aPos - uEye); gl_Position = uMvp * vec4(aPos, 1.0); }`;
const SURF_FS = `precision highp float;
varying vec2 vUv; varying float vDist;
uniform sampler2D uTex; uniform float uFeather; uniform float uFog; uniform vec3 uHaze;
void main(){
  vec3 c = pow(texture2D(uTex, vUv).rgb, vec3(0.9)) * 1.06;
  float e = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float a = uFeather > 0.0 ? smoothstep(0.0, uFeather, e) : 1.0;
  c = mix(c, uHaze, 1.0 - exp(-pow(vDist / uFog, 2.0)));
  gl_FragColor = vec4(c, a);
}`;
const TERR_VS = `attribute vec3 aPos; attribute vec2 aUv; attribute float aLift; attribute vec3 aNormal;
uniform mat4 uMvp; uniform vec3 uEye; uniform vec3 uUp; uniform float uRelief;
varying vec2 vUv; varying float vDist; varying vec3 vN;
void main(){
  vec3 p = aPos + uUp * aLift * uRelief;
  vUv = aUv; vN = aNormal; vDist = length(p - uEye);
  gl_Position = uMvp * vec4(p, 1.0);
}`;
const TERR_FS = `precision highp float;
varying vec2 vUv; varying float vDist; varying vec3 vN;
uniform sampler2D uTex; uniform float uFog; uniform vec3 uHaze; uniform float uRelief; uniform vec3 uLight;
void main(){
  vec3 c = pow(texture2D(uTex, vUv).rgb, vec3(0.9)) * 1.06;
  vec3 n = normalize(mix(vec3(0.0, 0.0, 1.0), vN, uRelief));
  c *= 0.62 + 0.5 * max(0.0, dot(n, uLight));
  float e = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  c = mix(c, uHaze, 1.0 - exp(-pow(vDist / uFog, 2.0)));
  gl_FragColor = vec4(c, smoothstep(0.0, 0.07, e));
}`;
const WALL_VS = `attribute vec3 aPos; attribute float aTop; uniform mat4 uMvp; uniform vec3 uUp; uniform float uWall;
varying float vT;
void main(){ vT = aTop; gl_Position = uMvp * vec4(aPos + uUp * (aTop * uWall + 25.0), 1.0); }`;
const WALL_FS = `precision highp float;
varying float vT; uniform float uAlpha;
void main(){
  float a = pow(1.0 - vT, 1.6) * 0.5 + smoothstep(0.08, 0.0, vT) * 0.5;
  gl_FragColor = vec4(mix(vec3(0.506, 0.945, 0.557), vec3(0.85, 1.0, 0.88), smoothstep(0.1, 0.0, vT)), a * uAlpha);
}`;

const compile = (gl: WebGLRenderingContext, vs: string, fs: string) => {
  const program = gl.createProgram();
  const make = (type: number, src: string) => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const v = make(gl.VERTEX_SHADER, vs);
  const f = make(gl.FRAGMENT_SHADER, fs);
  if (!program || !v || !f) return null;
  gl.attachShader(program, v);
  gl.attachShader(program, f);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
};

/** A lon/lat grid on the sphere, positions relative to Manoa (so close
 *  views keep their precision), with its UVs and triangles. */
const gridMesh = (L: { lon0: number; lon1: number; lat0: number; lat1: number }, nx: number, ny: number) => {
  const pos = new Float32Array((nx + 1) * (ny + 1) * 3);
  const uv = new Float32Array((nx + 1) * (ny + 1) * 2);
  for (let j = 0; j <= ny; j++)
    for (let i = 0; i <= nx; i++) {
      const u = i / nx;
      const v = j / ny;
      const p = sub(ecef(L.lon0 + u * (L.lon1 - L.lon0), L.lat1 - v * (L.lat1 - L.lat0)), T0);
      pos.set(p, (j * (nx + 1) + i) * 3);
      uv.set([u, v], (j * (nx + 1) + i) * 2);
    }
  const idx = new Uint16Array(nx * ny * 6);
  let k = 0;
  for (let j = 0; j < ny; j++)
    for (let i = 0; i < nx; i++) {
      const a = j * (nx + 1) + i;
      const c = a + nx + 1;
      idx.set([a, c, a + 1, a + 1, c, c + 1], k);
      k += 6;
    }
  return { pos, uv, idx };
};

const perspective = (fovy: number, aspect: number, near: number, far: number) => {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
};
const multiply = (a: number[], b: number[]) => {
  const out = new Array<number>(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      out[c * 4 + r] = s;
    }
  return out;
};
const project = (m: number[], p: V3) => {
  const x = m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12];
  const y = m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13];
  const w = m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15];
  return { x: x / w, y: y / w, w };
};

const { viewBox, symbol, word } = MARKS.logo;

export const ManoaFlight = ({ className }: { className?: string }) => {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const replay = useRef(() => {});
  const [phase, setPhase] = useState<"explore" | "name" | "page">("explore");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = root.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { antialias: true, alpha: false });
    if (!el || !canvas || !gl) {
      setFailed(true);
      return;
    }
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sky = compile(gl, SKY_VS, SKY_FS);
    const surf = compile(gl, SURF_VS, SURF_FS);
    const terr = compile(gl, TERR_VS, TERR_FS);
    const wall = compile(gl, WALL_VS, WALL_FS);
    if (!sky || !surf || !terr || !wall) {
      setFailed(true);
      return;
    }
    const aniso = gl.getExtension("EXT_texture_filter_anisotropic");

    const buffer = (data: Float32Array | Uint16Array, target: number = gl.ARRAY_BUFFER) => {
      const b = gl.createBuffer();
      gl.bindBuffer(target, b);
      gl.bufferData(target, data, gl.STATIC_DRAW);
      return b;
    };
    const attrib = (program: WebGLProgram, name: string, b: WebGLBuffer | null, size: number) => {
      const loc = gl.getAttribLocation(program, name);
      if (loc < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    const disable = () => {
      for (let i = 0; i < 4; i++) gl.disableVertexAttribArray(i);
    };
    const u = (program: WebGLProgram, name: string) => gl.getUniformLocation(program, name);

    // Textures: a dark texel until each level arrives.
    const textures = new Map<string, { tex: WebGLTexture | null; ready: boolean }>();
    const texture = (id: string) => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([10, 28, 18]));
      const slot = { tex, ready: false };
      textures.set(id, slot);
      const img = new Image();
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
        slot.ready = true;
        kick();
      };
      img.src = `${DATA}/${id}.jpg`;
      return slot;
    };
    // Coarse to fine, so the start never waits on the close-ups.
    ["globe", "continent", "region", "area", "project"].forEach(texture);

    const quad = buffer(new Float32Array([-1, -1, 3, -1, -1, 3]));
    const patches = PATCHES.map((p) => {
      const m = gridMesh(p, p.nx, p.ny);
      return { ...p, pos: buffer(m.pos), uv: buffer(m.uv), idx: buffer(m.idx, gl.ELEMENT_ARRAY_BUFFER), count: m.idx.length };
    });

    // The terrain and the wall come with their data.
    let terrain: { pos: WebGLBuffer | null; uv: WebGLBuffer | null; lift: WebGLBuffer | null; normal: WebGLBuffer | null; idx: WebGLBuffer | null; count: number } | null = null;
    let wallMesh: { pos: WebGLBuffer | null; top: WebGLBuffer | null; count: number } | null = null;
    let apex: V3 | null = null;
    let liftAt: ((lon: number, lat: number) => number) | null = null;
    let boundary: { points: [number, number][]; apex: [number, number] } | null = null;

    const buildWall = () => {
      if (!liftAt || !boundary) return;
      const pts = boundary.points;
      const pos = new Float32Array((pts.length + 1) * 2 * 3);
      const top = new Float32Array((pts.length + 1) * 2);
      for (let k = 0; k <= pts.length; k++) {
        const [lon, lat] = pts[k % pts.length];
        const base = add(sub(ecef(lon, lat), T0), mul(UP, liftAt(lon, lat)));
        pos.set(base, k * 6);
        pos.set(base, k * 6 + 3);
        top[k * 2] = 0;
        top[k * 2 + 1] = 1;
      }
      wallMesh = { pos: buffer(pos), top: buffer(top), count: (pts.length + 1) * 2 };
      const [alon, alat] = boundary.apex;
      apex = add(sub(ecef(alon, alat), T0), mul(UP, liftAt(alon, alat)));
    };

    fetch(`${DATA}/terrain.bin`)
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        const view = new DataView(buf);
        const G = view.getUint16(0, true);
        const lift = new Float32Array(G * G);
        for (let j = 0; j < G; j++)
          for (let i = 0; i < G; i++) {
            const k = j * G + i;
            const rel = view.getInt16(2 + k * 2, true) / 10;
            const canopy = view.getUint8(2 + G * G * 2 + k) / 255;
            // Taper the relief to nothing at the edges, so it meets the flat
            // imagery around it.
            const e = Math.min(i, G - 1 - i, j, G - 1 - j) / (G - 1);
            const taper = Math.min(1, Math.max(0, e / 0.1)) ** 2 * (3 - 2 * Math.min(1, Math.max(0, e / 0.1)));
            lift[k] = (rel * DEM_EXAG + canopy * CANOPY_M * CANOPY_EXAG) * taper;
          }
        const m = gridMesh(PROJECT, G - 1, G - 1);
        const cellE = ((PROJECT.lon1 - PROJECT.lon0) / (G - 1)) * RAD * R * Math.cos(TARGET.lat * RAD);
        const cellN = ((PROJECT.lat1 - PROJECT.lat0) / (G - 1)) * RAD * R;
        const normal = new Float32Array(G * G * 3);
        for (let j = 0; j < G; j++)
          for (let i = 0; i < G; i++) {
            const at = (ii: number, jj: number) => lift[Math.min(G - 1, Math.max(0, jj)) * G + Math.min(G - 1, Math.max(0, ii))];
            const dx = (at(i + 1, j) - at(i - 1, j)) / (2 * cellE);
            const dy = (at(i, j - 1) - at(i, j + 1)) / (2 * cellN);
            normal.set(norm([-dx, -dy, 1]), (j * G + i) * 3);
          }
        terrain = { pos: buffer(m.pos), uv: buffer(m.uv), lift: buffer(lift), normal: buffer(normal), idx: buffer(m.idx, gl.ELEMENT_ARRAY_BUFFER), count: m.idx.length };
        liftAt = (lon, lat) => {
          const x = ((lon - PROJECT.lon0) / (PROJECT.lon1 - PROJECT.lon0)) * (G - 1);
          const y = ((PROJECT.lat1 - lat) / (PROJECT.lat1 - PROJECT.lat0)) * (G - 1);
          const x0 = Math.max(0, Math.min(G - 2, Math.floor(x)));
          const y0 = Math.max(0, Math.min(G - 2, Math.floor(y)));
          const fx = x - x0;
          const fy = y - y0;
          return (lift[y0 * G + x0] * (1 - fx) + lift[y0 * G + x0 + 1] * fx) * (1 - fy) + (lift[(y0 + 1) * G + x0] * (1 - fx) + lift[(y0 + 1) * G + x0 + 1] * fx) * fy;
        };
        buildWall();
        kick();
      })
      .catch(() => {});
    fetch(`${DATA}/boundary.json`)
      .then((r) => r.json())
      .then((b: { points: [number, number][]; apex: [number, number] }) => {
        boundary = b;
        buildWall();
        kick();
      })
      .catch(() => {});

    // ---- The loop.
    let raf = 0;
    let visible = false;
    let started = false;
    let start = 0;
    let orbit = 0;
    let lastNow = 0;
    const look = { heading: 0, pitch: 0, dragging: false, x: 0, y: 0, lastInput: -1e9 };
    let shown: "explore" | "name" | "page" = "explore";
    // The page text the placemark keeps clear of.
    const clear = Array.from(el.querySelectorAll<HTMLElement>("[data-clear]"));

    const draw = (now: number) => {
      raf = 0;
      const dt = lastNow ? Math.min(64, now - lastNow) : 16;
      lastNow = now;
      const ms = still ? LAND_AT + 1 : started ? now - start : 0;
      const landed = ms >= LAND_AT;
      if (landed && !still && !look.dragging && now - look.lastInput > 3000) orbit += dt * 0.00004;
      const flight = cameraAt(ms);
      const heading = flight.heading + (landed ? orbit + look.heading : 0);
      const cam = landed ? { ...flight, ...aim(heading) } : flight;
      const pitch = landed ? Math.min(1.25, Math.max(0.3, cam.pitch + look.pitch)) : cam.pitch;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = Math.round(canvas.clientWidth * dpr);
      const H = Math.round(canvas.clientHeight * dpr);
      if (!W || !H) return;
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
      }
      gl.viewport(0, 0, W, H);

      // Camera: orbiting a point on the ground, in its local frame.
      const frame = enu(cam.lon, cam.lat);
      const sp = Math.sin(pitch);
      const f = norm(add(add(mul(frame.e, sp * Math.sin(heading)), mul(frame.n, sp * Math.cos(heading))), mul(frame.u, -Math.cos(pitch))));
      const right = norm(sub(mul(frame.e, Math.cos(heading)), mul(frame.n, Math.sin(heading))));
      const up = cross(right, f);
      const centre = sub(ecef(cam.lon, cam.lat), T0);
      const eye = sub(centre, mul(f, cam.dist));
      const eyeAbs = add(eye, T0);
      const alt = Math.hypot(...eyeAbs) - R;
      const zAxis = mul(f, -1);
      const view = [right[0], up[0], zAxis[0], 0, right[1], up[1], zAxis[1], 0, right[2], up[2], zAxis[2], 0, -dot(right, eye), -dot(up, eye), -dot(zAxis, eye), 1];
      const fov = 38 * RAD;
      const horizon = Math.sqrt(Math.max(0, 2 * R * alt + alt * alt));
      const near = Math.max(20, Math.min(cam.dist * 0.05, alt * 0.3));
      const far = cam.dist * 2.5 + horizon * 1.2 + 2e4;
      const mvp = multiply(perspective(fov, W / H, near, far), view);
      for (let c = 0; c < 4; c++) mvp[c * 4 + 1] -= cam.shift * mvp[c * 4 + 3];
      const mvp32 = new Float32Array(mvp);
      const eye32 = new Float32Array(eye);

      // Haze only near the ground, and always well past what's under the
      // camera, so the descent stays clear.
      const low = Math.min(1, Math.max(0, (6e5 - alt) / (6e5 - 1e5)));
      const fog = low > 0.001 ? Math.max(130e3, alt * 7) / low : 1e12;
      const haze = [0.7, 0.79, 0.84];

      // Sky, with the Earth's glow around it from space.
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
      gl.useProgram(sky);
      disable();
      attrib(sky, "a", quad, 2);
      const c0 = project(mvp, mul(T0, -1));
      const dCentre = Math.hypot(...eyeAbs);
      const radius = (Math.tan(Math.asin(Math.min(1, R / dCentre))) / Math.tan(fov / 2)) * (H / 2);
      // The horizon ahead: the heading's direction, dipped below level by
      // how high the camera is.
      const dip = Math.acos(R / (R + Math.max(alt, 1)));
      const ahead = norm(add(mul(frame.e, Math.sin(heading)), mul(frame.n, Math.cos(heading))));
      const hp = project(mvp, add(eye, mul(add(mul(ahead, Math.cos(dip)), mul(frame.u, -Math.sin(dip))), horizon || 1)));
      gl.uniform2f(u(sky, "uRes"), W, H);
      gl.uniform2f(u(sky, "uCenter"), ((c0.x + 1) / 2) * W, ((c0.y + 1) / 2) * H);
      gl.uniform1f(u(sky, "uRadius"), radius);
      gl.uniform1f(u(sky, "uLow"), low);
      gl.uniform1f(u(sky, "uHorizon"), hp.w > 0 ? Math.min(1, Math.max(0, (hp.y + 1) / 2)) : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // The globe and the patches, coarse to fine, each feathered into the
      // one under it.
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
      gl.useProgram(surf);
      gl.uniformMatrix4fv(u(surf, "uMvp"), false, mvp32);
      gl.uniform3fv(u(surf, "uEye"), eye32);
      gl.uniform1f(u(surf, "uFog"), fog);
      gl.uniform3fv(u(surf, "uHaze"), haze);
      for (const p of patches) {
        const t = textures.get(p.id);
        if (!t?.ready && p.id !== "globe") continue;
        disable();
        attrib(surf, "aPos", p.pos, 3);
        attrib(surf, "aUv", p.uv, 2);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, t?.tex ?? null);
        gl.uniform1i(u(surf, "uTex"), 0);
        gl.uniform1f(u(surf, "uFeather"), p.feather);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, p.idx);
        gl.drawElements(gl.TRIANGLES, p.count, gl.UNSIGNED_SHORT, 0);
      }

      // The project in relief, with its wall.
      const relief = still ? 1 : ramp(ms, RELIEF_AT);
      const projectTex = textures.get("project");
      if (terrain && projectTex?.ready && alt < 1.2e6) {
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        gl.useProgram(terr);
        disable();
        attrib(terr, "aPos", terrain.pos, 3);
        attrib(terr, "aUv", terrain.uv, 2);
        attrib(terr, "aLift", terrain.lift, 1);
        attrib(terr, "aNormal", terrain.normal, 3);
        gl.uniformMatrix4fv(u(terr, "uMvp"), false, mvp32);
        gl.uniform3fv(u(terr, "uEye"), eye32);
        gl.uniform3fv(u(terr, "uUp"), new Float32Array(UP));
        gl.uniform1f(u(terr, "uRelief"), relief);
        gl.uniform1f(u(terr, "uFog"), fog);
        gl.uniform3fv(u(terr, "uHaze"), haze);
        gl.uniform3fv(u(terr, "uLight"), new Float32Array(norm([-0.55, 0.45, 0.7])));
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, projectTex.tex);
        gl.uniform1i(u(terr, "uTex"), 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, terrain.idx);
        gl.drawElements(gl.TRIANGLES, terrain.count, gl.UNSIGNED_SHORT, 0);

        const rise = still ? 1 : ramp(ms, WALL_AT);
        if (wallMesh && rise > 0) {
          gl.disable(gl.CULL_FACE);
          gl.depthMask(false);
          gl.useProgram(wall);
          disable();
          attrib(wall, "aPos", wallMesh.pos, 3);
          attrib(wall, "aTop", wallMesh.top, 1);
          gl.uniformMatrix4fv(u(wall, "uMvp"), false, mvp32);
          gl.uniform3fv(u(wall, "uUp"), new Float32Array(UP));
          gl.uniform1f(u(wall, "uWall"), WALL_M * rise);
          gl.uniform1f(u(wall, "uAlpha"), Math.min(1, rise * 1.6));
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, wallMesh.count);
          gl.depthMask(true);
        }
      }
      gl.disable(gl.CULL_FACE);

      // The placemark on the boundary's northern tip, giving way to the
      // page's own text wherever a turn of the view would put it under it.
      const tag = tagRef.current;
      if (tag) {
        const q = apex ? project(mvp, add(apex, mul(UP, WALL_M))) : null;
        let show = !!q && q.w > 0 && ms > WALL_AT[0] + 600;
        if (q && q.w > 0) {
          const x = (((q.x + 1) / 2) * W) / dpr;
          const y = (((1 - q.y) / 2) * H) / dpr;
          if (show) {
            const box = el.getBoundingClientRect();
            const half = tag.offsetWidth / 2;
            const t = { l: box.left + x - half, r: box.left + x + half, top: box.top + y - 1.2 * tag.offsetHeight, b: box.top + y };
            show =
              t.l > box.left &&
              t.r < box.right &&
              t.top > box.top &&
              t.b < box.bottom &&
              clear.every((c) => {
                const r = c.getBoundingClientRect();
                return t.r < r.left || t.l > r.right || t.b < r.top - 8 || t.top > r.bottom + 8;
              });
          }
          tag.style.transform = `translate(${x}px, ${y}px) translate(-50%, -120%)`;
        }
        tag.style.opacity = show ? "1" : "0";
      }

      const next = ms >= LAND_AT - 400 ? "page" : ms >= NAME_AT ? "name" : "explore";
      if (next !== shown) {
        shown = next;
        setPhase(next);
      }
      if (visible && !document.hidden && (!still || !textures.get("project")?.ready)) raf = requestAnimationFrame(draw);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(draw);
    };
    const play = () => {
      start = performance.now();
      started = true;
      orbit = 0;
      look.heading = 0;
      look.pitch = 0;
      kick();
    };
    replay.current = play;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const was = visible;
        visible = entry.isIntersecting;
        if (entry.intersectionRatio >= 0.45 && !started) play();
        if (!entry.isIntersecting) started = false;
        if (visible && !was) kick();
      },
      { threshold: [0, 0.45] },
    );
    observer.observe(el);

    // Once it's landed, a drag looks around.
    const onDown = (e: PointerEvent) => {
      look.dragging = true;
      look.x = e.clientX;
      look.y = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!look.dragging) return;
      look.heading -= (e.clientX - look.x) * 0.005;
      look.pitch = Math.max(-0.7, Math.min(0.25, look.pitch - (e.clientY - look.y) * 0.004));
      look.x = e.clientX;
      look.y = e.clientY;
      look.lastInput = performance.now();
      kick();
    };
    const onUp = () => {
      look.dragging = false;
      look.lastInput = performance.now();
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    document.addEventListener("visibilitychange", kick);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      document.removeEventListener("visibilitychange", kick);
    };
  }, []);

  const named = phase !== "explore";
  const page = phase === "page";

  return (
    <figure className={cn("grid gap-3", className)}>
      <div
        ref={root}
        role="img"
        aria-label="Manoa's project page opening: the camera flies from the whole Earth down through South America and Rondônia onto Manoa's boundary, then tilts into a 3D view of the forest inside it, cleared land around it"
        className="@container relative aspect-[1440/934] overflow-hidden rounded-[16px] bg-[#060b15] text-white shadow-[0_24px_80px_rgb(20_26_23/0.18)] ring-1 ring-black/5"
      >
        {failed ? (
          // eslint-disable-next-line @next/next/no-img-element -- the project's imagery, when WebGL isn't there
          <img src={`${DATA}/project.jpg`} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <canvas ref={canvasRef} className="absolute inset-0 size-full cursor-grab touch-none active:cursor-grabbing" />
        )}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.5),transparent_28%,transparent_70%,rgb(0_0_0/0.4))]" />
        <p ref={tagRef} aria-hidden className="pointer-events-none absolute top-0 left-0 flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[max(10px,1cqw)] leading-5 font-medium whitespace-nowrap text-bn-heavy opacity-0 shadow-lg transition-opacity duration-500">
          <span className="size-2 rounded-full bg-bn-green ring-2 ring-bn-heavy/20" />
          Manoa · 74,038 ha
        </p>

        {/* The app's header: Explore's tabs, then the project's. */}
        <div data-clear aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex h-[10.3%] items-center justify-between border-b border-white/15 px-[2.5%]">
          <svg viewBox={viewBox} className="h-[34%] fill-white">
            <path d={symbol} />
            {word.map((d) => (
              <path key={d.slice(0, 24)} d={d} />
            ))}
          </svg>
          <div className="relative h-full flex-1 text-[max(9px,1.05cqw)]">
            <p className={cn("absolute inset-0 flex items-center justify-center gap-[2.2em] @max-[40rem]:gap-[1.1em] transition-opacity duration-700", page ? "opacity-0" : "opacity-100")}>
              <span className="rounded-full bg-white/15 px-[1em] py-[0.35em]">All projects</span>
              <span className="text-white/60">Monitoring</span>
              <span className="text-white/60">Originals</span>
              <span className="text-white/60 @max-[40rem]:hidden">Favorites</span>
            </p>
            <p className={cn("absolute inset-0 flex items-center justify-center gap-[2.2em] @max-[40rem]:gap-[1.1em] transition-opacity duration-700", page ? "opacity-100" : "opacity-0")}>
              <span className="rounded-full bg-white px-[1em] py-[0.35em] text-bn-heavy">Overview</span>
              <span>Data</span>
              <span>History</span>
              <span>Impact</span>
              <span>Files</span>
            </p>
          </div>
          <span className="rounded-full bg-bn-green px-[1.1em] py-[0.5em] font-mono text-[max(8px,0.95cqw)] font-medium text-bn-heavy uppercase">Buy now</span>
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[10.3%] bottom-0">
          <p data-clear className={cn("absolute inset-x-[4.7%] top-[4%] flex justify-between text-[max(9px,1.05cqw)] @max-[40rem]:hidden transition-opacity duration-700", page ? "opacity-100" : "opacity-0")}>
            <span className="flex items-center gap-[0.5em]">
              <MdArrowBack className="size-[1.4em]" /> Back to projects
            </span>
            <span className="flex items-center gap-[1.6em]">
              <span className="flex items-center gap-[0.5em]">
                <MdFavoriteBorder className="size-[1.4em]" /> Favorite
              </span>
              <span className="flex items-center gap-[0.5em]">
                <MdShare className="size-[1.4em]" /> Share
              </span>
            </span>
          </p>
          <div data-clear className={cn("absolute inset-x-0 top-[9%] text-center transition-[opacity,translate] duration-1000 ease-out", named ? "translate-y-0 opacity-100" : "translate-y-[1.5cqw] opacity-0")}>
            <p className="flex items-center justify-center gap-[0.6em] text-[max(9px,1.15cqw)] [text-shadow:0_1px_8px_rgb(0_0_0/0.5)]">
              <svg viewBox="0 0 24 24" className="size-[1.4em] rounded-full">
                <rect width="24" height="24" fill="#229e45" />
                <path d="M12 4.5 21.5 12 12 19.5 2.5 12Z" fill="#f8e509" />
                <circle cx="12" cy="12" r="4.4" fill="#2b49a3" />
              </svg>
              Manoa Farm, Rondônia, Brazil
              <span className="h-[1.2em] w-px bg-white/50" />
              74,038 ha
            </p>
            <p className="mt-[0.15em] font-display text-[7.4cqw] leading-none font-bold [text-shadow:0_2px_24px_rgb(0_0_0/0.35)]">Manoa</p>
            <p className="mt-[0.5em] text-[max(9px,1.5cqw)] [text-shadow:0_1px_10px_rgb(0_0_0/0.5)]">REDD+ Avoided Planned Deforestation</p>
          </div>
          <p data-clear className={cn("absolute inset-x-[25%] bottom-[16%] text-center text-[max(10px,1.6cqw)] @max-[40rem]:hidden leading-snug transition-opacity delay-500 duration-1000 [text-shadow:0_1px_12px_rgb(0_0_0/0.6)]", named ? "opacity-100" : "opacity-0")}>
            Support sustainable forest management in one of South America&rsquo;s most important bird endemism areas.
          </p>
          <span data-clear className={cn("absolute bottom-[4%] left-1/2 grid size-[3.9cqw] -translate-x-1/2 place-items-center rounded-[22%] bg-white text-bn-heavy transition-opacity duration-700", page ? "opacity-100" : "opacity-0")}>
            <MdKeyboardArrowDown className="size-[60%]" />
          </span>
        </div>
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <span className="type-caption max-w-[48rem] text-(--tone-text)">
          Opening Manoa&rsquo;s page, built for real: from the Earth to the project&rsquo;s boundary, then in 3D. Drag to look around. Imagery: Sentinel-2 cloudless 2023 by EOX (contains modified Copernicus Sentinel data, CC BY-NC-SA 4.0); terrain: SRTM, via Mapzen&rsquo;s Terrain Tiles; the boundary traced from Pachama&rsquo;s monitoring map. Relief exaggerated.
        </span>
        <button
          type="button"
          onClick={() => replay.current()}
          className={cn("inline-flex items-center gap-2 rounded-full border border-(--tone-line) px-4 py-2 text-[14px] leading-5 text-(--tone-head) hover:bg-(--tone-fill)", BN.focus)}
        >
          <MdReplay aria-hidden className="size-5" />
          Fly in again
        </button>
      </figcaption>
    </figure>
  );
};
