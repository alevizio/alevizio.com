"use client";

import world from "@/assets/hero/world.webp";
import { useEffect, useRef } from "react";
import { cn } from "./cn";

/* Earthscale's globe, live: the product's own render of the world under a
 * wind field, in viridis, wrapped on a sphere by the GPU and turning. Lit
 * from the upper left, a mint rim, a soft mint halo past the limb, and the
 * wind breathes: the lookup drifts a little with time, so the field moves
 * on the surface. Thirty frames a second while it's on screen, nothing
 * while it isn't; one still frame for anyone who has asked for less
 * motion. Where there is no WebGL the still behind the canvas stays. */

// The map covers these latitudes: Greenland's north at the top, the
// Southern Ocean at the bottom, no Antarctica. It is not a power of two,
// so it clamps at its edges and the shader wraps the longitude itself.
const LAT_TOP = 83;
const LAT_BOTTOM = -62;
const SPIN = 0.045; // radians per second, west to east
const TILT = 0.42; // radians, the north pole toward the viewer
const RADIUS = 0.74; // the disc's radius as a share of the canvas's half size: the rest is halo
const FRAME_MS = 33;

const VERTEX = `attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos;gl_Position=vec4(a_pos,0.0,1.0);}`;

const FRAGMENT = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_map;
uniform float u_time;
uniform float u_aa;
const float LAT_TOP = ${LAT_TOP.toFixed(1)};
const float LAT_BOTTOM = ${LAT_BOTTOM.toFixed(1)};
const float SPIN = ${SPIN.toFixed(4)};
const float TILT = ${TILT.toFixed(3)};
const float RADIUS = ${RADIUS.toFixed(3)};
const vec3 MINT = vec3(0.627, 1.0, 0.843);
const float PI = 3.14159265;

void main() {
  vec2 p = v_uv / RADIUS;
  float r2 = dot(p, p);
  float r = sqrt(r2);
  // Past the limb: the halo, fading out.
  if (r >= 1.0) {
    float halo = exp(-(r - 1.0) * 7.0) * 0.5;
    gl_FragColor = vec4(MINT * halo, halo);
    return;
  }
  float z = sqrt(1.0 - r2);
  vec3 n = vec3(p.x, p.y, z);
  // The sphere tilted toward the viewer, then spun.
  float ct = cos(TILT);
  float st = sin(TILT);
  vec3 m = vec3(n.x, n.y * ct - n.z * st, n.y * st + n.z * ct);
  float lon = atan(m.x, m.z) + u_time * SPIN;
  float lat = degrees(asin(clamp(m.y, -1.0, 1.0)));
  float u = fract(lon / (2.0 * PI) + 0.5);
  float v = clamp((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM), 0.0, 1.0);
  // The wind breathes: the lookup drifts a little, so the field moves.
  vec2 flow = vec2(sin(v * 18.0 + u_time * 0.35), cos(u * 22.0 - u_time * 0.3)) * 0.003;
  vec3 col = texture2D(u_map, vec2(u, v) + flow).rgb;
  // Lit from the upper left with a soft terminator, a little ambient on
  // the night side, the rim in mint.
  vec3 light = normalize(vec3(-0.55, 0.5, 0.65));
  float day = smoothstep(-0.3, 0.5, dot(n, light));
  float rim = pow(1.0 - z, 3.0);
  col = col * (0.16 + 1.0 * day) + MINT * rim * 0.45;
  // The limb itself, a pixel of anti-aliasing against the halo.
  float edge = smoothstep(1.0, 1.0 - u_aa, r);
  // Premultiplied, like the halo: the limb blends into it.
  float haloAtEdge = 0.5;
  gl_FragColor = vec4(mix(MINT * haloAtEdge, col, edge), mix(haloAtEdge, 1.0, edge));
}
`;

export const Globe = ({ className }: { className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
    if (!gl) return;
    const program = gl.createProgram();
    if (!program) return;
    for (const [type, source] of [[gl.VERTEX_SHADER, VERTEX], [gl.FRAGMENT_SHADER, FRAGMENT]] as const) {
      const shader = gl.createShader(type);
      if (!shader) return;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const uTime = gl.getUniformLocation(program, "u_time");
    const uAa = gl.getUniformLocation(program, "u_aa");
    gl.uniform1i(gl.getUniformLocation(program, "u_map"), 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = 0;
    let ready = false;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = Math.round(canvas.clientWidth * dpr);
      if (canvas.width !== size || canvas.height !== size) {
        canvas.width = size;
        canvas.height = size;
      }
      gl.viewport(0, 0, size, size);
      // One pixel, in the disc's own units.
      gl.uniform1f(uAa, 2.0 / (size * RADIUS));
    };
    const draw = (t: number) => {
      gl.uniform1f(uTime, t);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!canvas.hasAttribute("data-ready")) canvas.setAttribute("data-ready", "");
    };
    const frame = (now: number) => {
      raf = 0;
      if (!ready || !visible) return;
      if (now - last >= FRAME_MS) {
        last = now;
        draw((now - start) / 1000);
      }
      raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf && ready && visible && !reduceMotion.matches) raf = requestAnimationFrame(frame);
    };

    // The map, as the page already serves it.
    const image = new Image();
    image.onload = () => {
      const texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      ready = true;
      resize();
      draw(0);
      wake();
    };
    image.src = world.src;

    const sizes = new ResizeObserver(() => {
      if (!ready) return;
      resize();
      draw(reduceMotion.matches ? 0 : (performance.now() - start) / 1000);
    });
    sizes.observe(canvas);
    const sight = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    sight.observe(canvas);
    reduceMotion.addEventListener?.("change", wake);

    return () => {
      cancelAnimationFrame(raf);
      sizes.disconnect();
      sight.disconnect();
      reduceMotion.removeEventListener?.("change", wake);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={cn("block aspect-square opacity-0 transition-opacity duration-1000 data-ready:opacity-100", className)} />;
};
