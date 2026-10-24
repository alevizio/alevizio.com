"use client";

import rampsLut from "@/assets/globe/ramps.png";
import temperatureField from "@/assets/globe/temperature-field.webp";
import temperatureUnder from "@/assets/globe/temperature-under.webp";
import windField from "@/assets/globe/wind-field.webp";
import windUnder from "@/assets/globe/wind-under.webp";
import { useEffect, useRef } from "react";
import { cn } from "./cn";
import { getView, subscribeView, type Band, type View } from "./globe-store";

/* Earthscale's globe, live: the product's own renders of the world, under
 * a 10 m wind field and under 2 m temperature, wrapped on a sphere by the
 * GPU and turning, west to east like the real one. Lit from the upper left
 * with a soft terminator, a mint rim, a soft mint halo past the limb.
 * Dragging turns it, with a little inertia, and then the slow turn comes
 * back; a finger turns it too, and still scrolls the page. The page's
 * view (globe-store) picks the band and the colour ramp, and a change
 * crossfades. Thirty frames a second while it's on screen and moving,
 * sixty under the pointer, nothing while it isn't; one still frame for
 * anyone who has asked for less motion, which dragging still turns.
 * Where there is no WebGL the canvas stays clear and the page's own black
 * shows.
 *
 * Each render comes as two maps (scripts/make-globe-textures.py): the
 * field, where along its ramp each pixel sat, and the imagery under it,
 * what was left once the ramp's colour was taken away. The shader sets
 * the field in the chosen ramp (ramps.png, the product's five, one row
 * each) and puts the imagery back, so the render's own ramp gives the
 * render exactly. The maps are full equirectangular spheres, 4096 by
 * 2048 with sixteen columns of overlap at either end (the seam sits
 * inside continuous encoded data), powers of two for the mipmaps. */

const MAPS: Record<Band, { field: string; under: string }> = {
  wind: { field: windField.src, under: windUnder.src },
  temperature: { field: temperatureField.src, under: temperatureUnder.src },
};
const SPIN = 0.045; // radians per second, west to east
const TILT = 0.42; // radians, the north pole toward the viewer, to start
const TILT_MAX = 1.1; // how far a drag can tip it, either way
const RADIUS = 0.74; // the disc's radius as a share of the canvas's half size: the rest is halo
const FRAME_MS = 33;
const FADE_MS = 700; // a band or ramp change
const SETTLE_S = 1.2; // after a drag, how long the turn takes to settle into the spin
const VELOCITY_MAX = 3; // radians per second, from a flick
const PAD = 16 / 4096; // the maps' overlap at either end, as a share of their width

const VERTEX = `attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos;gl_Position=vec4(a_pos,0.0,1.0);}`;

const FRAGMENT = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_field0;
uniform sampler2D u_under0;
uniform sampler2D u_field1;
uniform sampler2D u_under1;
uniform sampler2D u_lut;
uniform float u_ramp0;
uniform float u_ramp1;
uniform float u_fade;
uniform float u_lon;
uniform float u_tilt;
uniform float u_aa;
const float RADIUS = ${RADIUS.toFixed(3)};
const float PAD = ${PAD.toFixed(6)};
const vec3 MINT = vec3(0.627, 1.0, 0.843);
const float PI = 3.14159265;

// The field set in a ramp, with the imagery put back under it.
vec3 shade(sampler2D field, sampler2D under, float ramp, vec2 uv) {
  float s = texture2D(field, uv).r;
  vec3 base = texture2D(u_lut, vec2(s, (ramp + 0.5) / 8.0)).rgb;
  vec3 rest = texture2D(under, uv).rgb * 2.0 - 1.0;
  return clamp(base + rest, 0.0, 1.0);
}

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
  // The sphere tipped toward the viewer, then turned.
  float ct = cos(u_tilt);
  float st = sin(u_tilt);
  vec3 m = vec3(n.x, n.y * ct - n.z * st, n.y * st + n.z * ct);
  float lon = atan(m.x, m.z) + u_lon;
  float lat = asin(clamp(m.y, -1.0, 1.0));
  vec2 uv = vec2(PAD + fract(lon / (2.0 * PI) + 0.5) * (1.0 - 2.0 * PAD), 0.5 - lat / PI);
  vec3 col = shade(u_field0, u_under0, u_ramp0, uv);
  if (u_fade > 0.0) col = mix(col, shade(u_field1, u_under1, u_ramp1, uv), u_fade);
  // Lit from the upper left with a soft terminator, a little ambient on
  // the night side, the rim in mint.
  vec3 light = normalize(vec3(-0.55, 0.5, 0.65));
  float day = smoothstep(-0.3, 0.5, dot(n, light));
  float rim = pow(1.0 - z, 3.0);
  col = col * (0.16 + 1.0 * day) + MINT * rim * 0.45;
  // The limb itself, a pixel of anti-aliasing against the halo.
  // Premultiplied, like the halo: the limb blends into it.
  float edge = smoothstep(1.0, 1.0 - u_aa, r);
  float haloAtEdge = 0.5;
  gl_FragColor = vec4(mix(MINT * haloAtEdge, col, edge), mix(haloAtEdge, 1.0, edge));
}
`;

// The pictures, decoded once for every globe on the page.
const pictures = new Map<string, Promise<HTMLImageElement>>();
const picture = (src: string) => {
  let loading = pictures.get(src);
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
    pictures.set(src, loading);
  }
  return loading;
};

const clamp = (x: number, lo: number, hi: number) => Math.min(Math.max(x, lo), hi);
const easeInOut = (x: number) => x * x * (3 - 2 * x);
const same = (a: View, b: View) => a.band === b.band && a.ramp === b.ramp;

export const Globe = ({ interactive = true, className }: { interactive?: boolean; className?: string }) => {
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
    const u = (name: string) => gl.getUniformLocation(program, name);
    const UNITS = { field0: 0, under0: 1, field1: 2, under1: 3, lut: 4 };
    gl.uniform1i(u("u_field0"), UNITS.field0);
    gl.uniform1i(u("u_under0"), UNITS.under0);
    gl.uniform1i(u("u_field1"), UNITS.field1);
    gl.uniform1i(u("u_under1"), UNITS.under1);
    gl.uniform1i(u("u_lut"), UNITS.lut);
    const uRamp0 = u("u_ramp0");
    const uRamp1 = u("u_ramp1");
    const uFade = u("u_fade");
    const uLon = u("u_lon");
    const uTilt = u("u_tilt");
    const uAa = u("u_aa");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let alive = true;
    let ready = false;
    let visible = true;
    let raf = 0;
    let last = 0;
    // Where it's turned to, how it's tipped, and how fast it's turning.
    let lon = 0;
    let tilt = TILT;
    let velocity = reduceMotion.matches ? 0 : -SPIN;
    let dragging = false;
    // What's shown, and what's fading in over it.
    let shown: View = getView();
    let coming: View | null = null;
    let fadeStart = 0;
    let wanted = 0;

    // A GPU that can't take a map this wide gets it at half size, through a canvas.
    const textures = new Map<string, WebGLTexture>();
    const bind = (unit: number, src: string, image: HTMLImageElement, mipmaps: boolean) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      let texture = textures.get(src);
      if (texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return;
      }
      const max = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
      let source: TexImageSource = image;
      if (image.width > max) {
        const small = document.createElement("canvas");
        small.width = image.width / 2;
        small.height = image.height / 2;
        small.getContext("2d")?.drawImage(image, 0, 0, small.width, small.height);
        source = small;
      }
      texture = gl.createTexture();
      if (!texture) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      if (mipmaps) {
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
      textures.set(src, texture);
    };
    const bindBand = async (band: Band, fieldUnit: number, underUnit: number) => {
      const [field, under] = await Promise.all([picture(MAPS[band].field), picture(MAPS[band].under)]);
      if (!alive) return;
      bind(fieldUnit, MAPS[band].field, field, true);
      bind(underUnit, MAPS[band].under, under, true);
    };

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
    const finishFade = () => {
      if (!coming) return;
      shown = coming;
      coming = null;
      const { field, under } = MAPS[shown.band];
      const fieldImage = textures.get(field);
      const underImage = textures.get(under);
      if (fieldImage && underImage) {
        gl.activeTexture(gl.TEXTURE0 + UNITS.field0);
        gl.bindTexture(gl.TEXTURE_2D, fieldImage);
        gl.activeTexture(gl.TEXTURE0 + UNITS.under0);
        gl.bindTexture(gl.TEXTURE_2D, underImage);
      }
      gl.uniform1f(uRamp0, shown.ramp);
      gl.uniform1f(uFade, 0);
    };
    const draw = (now: number) => {
      if (coming) {
        const fade = Math.min((now - fadeStart) / FADE_MS, 1);
        gl.uniform1f(uFade, easeInOut(fade));
        if (fade >= 1) finishFade();
      }
      gl.uniform1f(uLon, lon);
      gl.uniform1f(uTilt, tilt);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!canvas.hasAttribute("data-ready")) canvas.setAttribute("data-ready", "");
    };
    const frame = (now: number) => {
      raf = 0;
      if (!ready || !visible) return;
      // Thirty frames a second are plenty for the turn; the pointer gets them all.
      if (now - last < FRAME_MS && !dragging) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!dragging) {
        // After a flick the turn settles into the spin, or, with less
        // motion asked for, comes to rest.
        const rest = reduceMotion.matches ? 0 : -SPIN;
        velocity += (rest - velocity) * (1 - Math.exp(-dt / SETTLE_S));
        lon += velocity * dt;
      }
      draw(now);
      const moving = dragging || coming !== null || Math.abs(velocity) > 0.0005;
      if (moving) raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf && ready && visible) {
        last = performance.now() - FRAME_MS;
        raf = requestAnimationFrame(frame);
      }
    };

    // The view changing: the new band's maps, then a crossfade. The
    // latest change wins over one still loading.
    const show = async (view: View) => {
      const token = ++wanted;
      await Promise.all([picture(MAPS[view.band].field), picture(MAPS[view.band].under)]);
      if (!alive || token !== wanted || !ready) return;
      if (coming) finishFade();
      if (same(view, shown)) return;
      await bindBand(view.band, UNITS.field1, UNITS.under1);
      if (!alive || token !== wanted) return;
      gl.uniform1f(uRamp1, view.ramp);
      coming = view;
      fadeStart = performance.now();
      wake();
    };
    const unsubscribe = subscribeView(() => {
      void show(getView());
    });

    // The first maps: the ramps, then the band in view.
    void (async () => {
      const lut = await picture(rampsLut.src);
      if (!alive) return;
      bind(UNITS.lut, rampsLut.src, lut, false);
      await bindBand(shown.band, UNITS.field0, UNITS.under0);
      if (!alive) return;
      gl.uniform1f(uRamp0, shown.ramp);
      gl.uniform1f(uFade, 0);
      ready = true;
      resize();
      draw(performance.now());
      wake();
      if (!same(getView(), shown)) void show(getView());
    })();

    // Dragging: the surface follows the pointer; a mouse can tip it too.
    // Touches only turn it, so a finger still scrolls the page (touch-pan-y).
    let px = 0;
    let py = 0;
    let pt = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      canvas.setPointerCapture(e.pointerId);
      canvas.classList.add("cursor-grabbing");
      px = e.clientX;
      py = e.clientY;
      pt = performance.now();
      velocity = 0;
      wake();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const radius = (canvas.clientWidth / 2) * RADIUS;
      const now = performance.now();
      const dt = Math.max(now - pt, 1) / 1000;
      const dx = e.clientX - px;
      const dy = e.clientY - py;
      lon -= dx / radius;
      if (e.pointerType === "mouse") tilt = clamp(tilt + dy / radius, -TILT_MAX, TILT_MAX);
      velocity = clamp(-(dx / radius) / dt, -VELOCITY_MAX, VELOCITY_MAX);
      px = e.clientX;
      py = e.clientY;
      pt = now;
      wake();
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      canvas.classList.remove("cursor-grabbing");
      // Held still before letting go: no flick.
      if (performance.now() - pt > 80) velocity = reduceMotion.matches ? 0 : -SPIN;
      wake();
    };
    if (interactive) {
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);
    }

    const sizes = new ResizeObserver(() => {
      if (!ready) return;
      resize();
      draw(performance.now());
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
    const onMotion = () => {
      velocity = reduceMotion.matches ? 0 : -SPIN;
      wake();
    };
    reduceMotion.addEventListener?.("change", onMotion);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      unsubscribe();
      sizes.disconnect();
      sight.disconnect();
      reduceMotion.removeEventListener?.("change", onMotion);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [interactive]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={cn("block aspect-square opacity-0 transition-opacity duration-1000 select-none data-ready:opacity-100", interactive && "cursor-grab touch-pan-y", className)}
    />
  );
};
