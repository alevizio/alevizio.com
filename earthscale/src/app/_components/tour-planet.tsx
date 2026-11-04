"use client";

import { useEffect, useRef } from "react";
import { cn } from "./cn";

/* A planet in a picture, turning: the GPU reads each point of the disc
 * back to where it was in the picture a moment ago, turned about the
 * planet's own axis (up, its north pole tipped toward the viewer), west to
 * east like the real one. The picture only has the side it shows, so it
 * turns slowly and only while it's in view, and starts over each time the
 * tour does; what comes round the trailing limb meanwhile is a sliver,
 * drawn from the limb itself. The picture's own still sits under it, so
 * where there's no WebGL, or less motion is asked for, the still shows.
 *
 * Optionally the picture is set in a treatment first (scripts/
 * make-tour-layers.py fits it): a polynomial in its colour plus terms in
 * where on the frame it is, so the frame's light stays put as the planet
 * turns under it. */

export type Treatment = readonly (readonly [number, number, number])[];

const SPEED = 0.028; // radians a second, about 1.6 degrees

const VERTEX = `attribute vec2 a_pos;uniform vec4 u_box;varying vec2 v_px;
void main(){v_px=u_box.xy+vec2(a_pos.x*0.5+0.5,0.5-a_pos.y*0.5)*u_box.zw;gl_Position=vec4(a_pos,0.0,1.0);}`;

const FRAGMENT = `precision highp float;
varying vec2 v_px;
uniform sampler2D u_tex;
uniform vec3 u_disc;   // the disc's centre and radius, in the frame's px
uniform float u_size;  // the disc's radius in the picture, of its half
uniform float u_turn;
uniform float u_tilt;
uniform float u_treat;
uniform vec3 u_w[19];
uniform vec2 u_frame;  // the treatment's frame, its width and height
void main() {
  vec2 q = (v_px - u_disc.xy) / u_disc.z;
  float r2 = dot(q, q);
  float edge = clamp((1.0 - sqrt(r2)) * u_disc.z + 0.5, 0.0, 1.0);
  if (edge <= 0.0) { gl_FragColor = vec4(0.0); return; }
  vec3 n = vec3(q.x, -q.y, sqrt(max(1.0 - r2, 0.0)));
  vec3 a = vec3(0.0, cos(u_tilt), sin(u_tilt));
  float c = cos(u_turn);
  float s = -sin(u_turn);
  vec3 m = n * c + cross(a, n) * s + a * dot(a, n) * (1.0 - c);
  if (m.z < 0.0) m = normalize(vec3(m.xy, 0.0));
  vec3 p = texture2D(u_tex, 0.5 + vec2(m.x, -m.y) * 0.5 * u_size).rgb;
  if (u_treat > 0.5) {
    float xn = (v_px.x - u_frame.x * 0.5) / (u_frame.x * 0.5);
    float yn = v_px.y / u_frame.y;
    p = u_w[0] + u_w[1] * p.r + u_w[2] * p.g + u_w[3] * p.b
      + u_w[4] * p.r * p.r + u_w[5] * p.g * p.g + u_w[6] * p.b * p.b
      + u_w[7] * p.r * p.g + u_w[8] * p.g * p.b + u_w[9] * p.r * p.b
      + u_w[10] * p.r * p.r * p.r + u_w[11] * p.g * p.g * p.g + u_w[12] * p.b * p.b * p.b
      + u_w[13] * xn + u_w[14] * yn + u_w[15] * xn * xn + u_w[16] * yn * yn + u_w[17] * xn * yn + u_w[18] * abs(xn);
    p = clamp(p, 0.0, 1.0);
  }
  gl_FragColor = vec4(p * edge, edge);
}`;

export const TurningPlanet = ({
  src,
  size,
  box,
  disc,
  tilt,
  run,
  treat,
  frame,
  className,
}: {
  /** The picture, square about the disc. */
  src: string;
  /** The disc's radius in the picture, as a share of its half. */
  size: number;
  /** Where the canvas sits, in the frame's px: left, top, width, height. */
  box: readonly [number, number, number, number];
  /** The disc's centre and radius, in the frame's px. */
  disc: readonly [number, number, number];
  tilt: number;
  /** Turning while it's in view; from the start again each time it's set. */
  run: boolean;
  treat?: Treatment;
  frame?: readonly [number, number];
  className?: string;
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [left, top, width, height] = box;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !run || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
    const program = gl?.createProgram();
    if (!gl || !program) return;
    for (const [type, source] of [[gl.VERTEX_SHADER, VERTEX], [gl.FRAGMENT_SHADER, FRAGMENT]] as const) {
      const shader = gl.createShader(type);
      if (!shader) return;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Planet shader:", gl.getShaderInfoLog(shader));
        return;
      }
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    gl.useProgram(program);
    const quad = gl.createBuffer();
    const texture = gl.createTexture();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(program, name);
    gl.uniform4f(u("u_box"), left, top, width, height);
    gl.uniform3f(u("u_disc"), ...disc);
    gl.uniform1f(u("u_size"), size);
    gl.uniform1f(u("u_tilt"), tilt);
    gl.uniform1f(u("u_treat"), treat ? 1 : 0);
    if (treat) gl.uniform3fv(u("u_w"), treat.flat());
    if (frame) gl.uniform2f(u("u_frame"), ...frame);
    const uTurn = u("u_turn");
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);

    let alive = true;
    let ready = false;
    let seen = false;
    let turn = 0;
    let last = 0;
    let raf = 0;
    const draw = () => {
      gl.uniform1f(uTurn, turn);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const tick = (now: number) => {
      turn += (Math.min(now - last, 100) / 1000) * SPEED;
      last = now;
      draw();
      raf = requestAnimationFrame(tick);
    };
    const play = () => {
      cancelAnimationFrame(raf);
      if (!ready || !seen) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const picture = new Image();
    picture.onload = () => {
      if (!alive) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, picture);
      for (const [key, value] of [
        [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
        [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
        [gl.TEXTURE_MIN_FILTER, gl.LINEAR],
        [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
      ]) {
        gl.texParameteri(gl.TEXTURE_2D, key, value);
      }
      ready = true;
      draw();
      play();
    };
    picture.src = src;
    const sight = new IntersectionObserver(([entry]) => {
      seen = entry.isIntersecting;
      play();
    });
    sight.observe(canvas);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      sight.disconnect();
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.deleteTexture(texture);
      gl.deleteBuffer(quad);
      gl.deleteProgram(program);
    };
  }, [run, src, size, left, top, width, height, disc, tilt, treat, frame]);

  return <canvas ref={ref} aria-hidden className={cn("absolute", className)} style={{ left, top, width, height }} />;
};
