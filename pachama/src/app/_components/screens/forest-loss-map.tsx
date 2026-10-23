"use client";

import base from "@/assets/screens/manoa-2016.jpg";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { MdExpandMore, MdPause, MdPlayArrow } from "react-icons/md";
import { BN } from "../banyan/ui";
import { cn } from "../cn";
import { BOUNDARY_D, FRAME, FRAME_HA, INSIDE_HA } from "./forest-loss-data";

/* Manoa's observed forest loss, the carbon monitoring page's map, with real
 * data: Hansen's Global Forest Change, year by year, over Sentinel-2 imagery
 * from 2016, so the clearing builds up on the forest as it stood. The
 * player steps through the years (it runs once when it's reached, then
 * it's yours); each year's bar is the forest lost inside the boundary.
 * The layer is one image whose value is the year of loss, coloured in
 * WebGL: the year picked in red, the years before it in the design's
 * brown; All shows every year since 2001 in red. */
const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const LAST = YEARS[YEARS.length - 1];
const STEP_MS = 1100;
const ASPECT = FRAME.w / FRAME.h;
const sum = (o: Record<number, number>) => Object.values(o).reduce((a, b) => a + b, 0);
const TOTAL = { inside: sum(INSIDE_HA), frame: sum(FRAME_HA) };
const MAX_HA = Math.max(...YEARS.map((y) => INSIDE_HA[y] ?? 0));
// Literal heights for Tailwind: each year's bar, a share of the tallest.
const BAR_H = ["h-[8%]", "h-[16%]", "h-[25%]", "h-[33%]", "h-[41%]", "h-[50%]", "h-[58%]", "h-[66%]", "h-[75%]", "h-[83%]", "h-[91%]", "h-full"];
const barFor = (ha: number) => BAR_H[Math.max(0, Math.round((ha / MAX_HA) * (BAR_H.length - 1)))];
const ha = (n: number) => n.toLocaleString("en-US");

const VERT = `attribute vec2 a; varying vec2 v; void main(){ v = vec2(a.x * 0.5 + 0.5, 0.5 - a.y * 0.5); gl_Position = vec4(a, 0.0, 1.0); }`;
// u_scale crops the layer the way object-cover crops the imagery under it.
const FRAG = `precision mediump float;
varying vec2 v;
uniform sampler2D u_tex;
uniform float u_year;
uniform float u_all;
uniform vec2 u_scale;
void main(){
  float y = floor(texture2D(u_tex, 0.5 + (v - 0.5) * u_scale).r * 255.0 / 10.0 + 0.5);
  if (y < 0.5 || y > u_year + 0.5) discard;
  gl_FragColor = u_all > 0.5 || abs(y - u_year) < 0.5 ? vec4(1.0, 0.373, 0.353, 0.95) : vec4(0.702, 0.345, 0.259, 0.45);
}`;

/** The loss layer: a canvas over the imagery, painted for a year. */
const useLossLayer = (canvas: RefObject<HTMLCanvasElement | null>, year: number, all: boolean) => {
  const paint = useRef<(() => void) | null>(null);
  const shown = useRef({ year, all });
  useEffect(() => {
    const c = canvas.current;
    const gl = c?.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!c || !gl) return;
    const shader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = shader(gl.VERTEX_SHADER, VERT);
    const fs = shader(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(program, name);

    let ready = false;
    const draw = () => {
      if (!ready) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(c.clientWidth * dpr);
      const h = Math.round(c.clientHeight * dpr);
      if (!w || !h) return;
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(u("u_year"), shown.current.year - 2000);
      gl.uniform1f(u("u_all"), shown.current.all ? 1 : 0);
      gl.uniform2f(u("u_scale"), Math.min(1, w / h / ASPECT), Math.min(1, (ASPECT * h) / w));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    paint.current = draw;
    const img = new window.Image();
    img.onload = () => {
      // The values are years: no colour management, no smoothing between them.
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      ready = true;
      draw();
    };
    img.src = "/screens/manoa-loss.png";
    const resize = new ResizeObserver(draw);
    resize.observe(c);
    return () => {
      paint.current = null;
      img.onload = null;
      resize.disconnect();
    };
  }, [canvas]);
  useEffect(() => {
    shown.current = { year, all };
    paint.current?.();
  }, [year, all]);
};

const Panel = ({ title, badge, children, open, onToggle }: { title: string; badge?: ReactNode; children: ReactNode; open: boolean; onToggle: () => void }) => (
  <div className="rounded-[10px] bg-white text-bn-heavy shadow-[0_6px_20px_rgb(0_0_0/0.18)]">
    <button type="button" aria-expanded={open} onClick={onToggle} className={cn("flex w-full items-center gap-2 rounded-[10px] px-4 py-3 text-left text-[14px] font-bold sm:text-[15px]", BN.focus)}>
      {title}
      {badge}
      <MdExpandMore aria-hidden className={cn("ml-auto size-5 transition-transform", open && "rotate-180")} />
    </button>
    {open ? <div className="px-4 pb-3 text-[12px] leading-4 text-bn-medium">{children}</div> : null}
  </div>
);

const Swatch = ({ className, children }: { className: string; children: ReactNode }) => (
  <span className="flex items-center gap-1.5">
    <span aria-hidden className={cn("size-3 rounded-[3px]", className)} />
    {children}
  </span>
);

export const ForestLossMap = ({ className }: { className?: string }) => {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [year, setYear] = useState(LAST);
  const [all, setAll] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [panels, setPanels] = useState({ loss: true, status: false, leakage: false });
  useLossLayer(canvas, year, all);

  // Reached: it plays through the years once, unless someone got there first.
  const touched = useRef(false);
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.45) return;
        observer.disconnect();
        if (touched.current) return;
        setAll(false);
        setYear(YEARS[0]);
        setPlaying(true);
      },
      { threshold: [0, 0.45] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => (year >= LAST ? setPlaying(false) : setYear(year + 1)), STEP_MS);
    return () => window.clearTimeout(id);
  }, [playing, year]);

  const pick = (y: number | "all") => {
    touched.current = true;
    setPlaying(false);
    setAll(y === "all");
    if (y !== "all") setYear(y);
  };
  const play = () => {
    touched.current = true;
    if (!playing && (all || year >= LAST)) {
      setAll(false);
      setYear(YEARS[0]);
    }
    setPlaying(!playing);
  };
  const toggle = (k: keyof typeof panels) => setPanels((p) => ({ ...p, [k]: !p[k] }));
  const inside = all ? TOTAL.inside : (INSIDE_HA[year] ?? 0);
  const outside = all ? TOTAL.frame - TOTAL.inside : (FRAME_HA[year] ?? 0) - inside;
  const when = all ? "since 2001" : `in ${year}`;

  return (
    <div ref={root} className={cn("relative overflow-hidden rounded-[14px] bg-[#0b1a10] text-white", className)}>
      <div className="relative aspect-[2575/1540] max-sm:aspect-square">
        <div role="img" aria-label={`Manoa on satellite imagery from 2016, its boundary in white and the forest lost ${when} in red: ${ha(inside)} hectares inside the boundary.`} className="absolute inset-0">
          <Image src={base} alt="" fill sizes="(min-width: 1376px) 1180px, 100vw" placeholder="blur" className="object-cover" />
          <canvas ref={canvas} className="absolute inset-0 size-full" />
          <svg viewBox={`0 0 ${FRAME.w} ${FRAME.h}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
            <path d={BOUNDARY_D} fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <p className="absolute top-3 left-3 font-mono text-[11px] tracking-[0.08em] text-white uppercase [text-shadow:0_1px_3px_rgb(0_0_0/0.6)] sm:top-auto sm:bottom-[5rem] sm:left-4">
          {ha(inside)} ha lost inside, {all ? `2001 to ${LAST}` : year}
        </p>

        {/* The player, each year with its bar: the forest lost inside the boundary. */}
        <div role="group" aria-label="Years" className="absolute inset-x-3 bottom-3 flex overflow-hidden rounded-[10px] bg-white text-bn-heavy shadow-[0_6px_20px_rgb(0_0_0/0.2)] sm:inset-x-4 sm:bottom-4">
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play through the years"}
            onClick={play}
            className={cn("grid w-9 shrink-0 place-items-center border-r border-bn-grey-light hover:bg-bn-grey-lightest sm:w-12", BN.focus)}
          >
            {playing ? <MdPause aria-hidden className="size-5" /> : <MdPlayArrow aria-hidden className="size-5" />}
          </button>
          {YEARS.map((y) => {
            const on = !all && year === y;
            return (
              <button
                key={y}
                type="button"
                aria-pressed={on}
                aria-label={`${y}: ${ha(INSIDE_HA[y] ?? 0)} hectares lost inside the boundary`}
                onClick={() => pick(y)}
                className={cn("relative flex h-11 min-w-0 flex-1 flex-col items-center justify-end pb-1.5 text-[11px] sm:h-14 sm:pb-2 sm:text-[14px]", on ? "bg-bn-grey-light font-bold" : "hover:bg-bn-grey-lightest", BN.focus)}
              >
                <span aria-hidden className="absolute inset-x-[28%] top-[10%] bottom-[55%] flex items-end">
                  <span className={cn("w-full rounded-t-[2px] transition-colors", barFor(INSIDE_HA[y] ?? 0), all || on ? "bg-[#ff5f5a]" : y < year ? "bg-[#8c6a4f]" : "bg-bn-grey")} />
                </span>
                <span className="max-sm:hidden">{y}</span>
                <span className="sm:hidden">&rsquo;{String(y).slice(2)}</span>
              </button>
            );
          })}
          <button type="button" aria-pressed={all} onClick={() => pick("all")} className={cn("w-10 shrink-0 text-[12px] font-bold sm:w-16 sm:text-[14px]", all ? "bg-bn-grey-light" : "hover:bg-bn-grey-lightest", BN.focus)}>
            All
          </button>
        </div>
      </div>

      {/* Over the map's top right from sm up; under it on a phone. */}
      <div className="grid gap-2 p-3 sm:absolute sm:top-4 sm:right-4 sm:w-[19rem] sm:p-0">
        <Panel title="Observed forest loss" open={panels.loss} onToggle={() => toggle("loss")}>
          <span className="flex flex-wrap gap-x-3 gap-y-1">
            <Swatch className="ring-1 ring-bn-heavy/40">Project boundary</Swatch>
            {all ? (
              <Swatch className="bg-[#ff5f5a]">Every year since 2001</Swatch>
            ) : (
              <>
                <Swatch className="bg-[#ff5f5a]">{year}</Swatch>
                <Swatch className="bg-[#8c6a4f]">Older years</Swatch>
              </>
            )}
          </span>
        </Panel>
        <Panel
          title="Project status"
          badge={<span className="rounded-full bg-bn-green px-2 py-0.5 font-mono text-[10px] text-bn-heavy uppercase">Not at risk</span>}
          open={panels.status}
          onToggle={() => toggle("status")}
        >
          Not at risk of reversal, as of the last monitoring update.
        </Panel>
        <Panel title="Leakage" open={panels.leakage} onToggle={() => toggle("leakage")}>
          Clearing a project only pushes onto the land around it counts against it, so the land around is watched too. Outside the boundary, this view lost {ha(outside)} hectares {when}; inside, {ha(inside)}.
        </Panel>
      </div>
      <p className="px-3 pb-3 text-[10px] leading-4 text-white/75 sm:px-4 sm:pt-3">
        Imagery: Sentinel-2 cloudless 2016 by{" "}
        <a href="https://s2maps.eu" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          EOX
        </a>{" "}
        (CC BY 4.0). Forest loss: Hansen, UMD, Google, USGS and NASA, Global Forest Change, via{" "}
        <a href="https://www.globalforestwatch.org" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          Global Forest Watch
        </a>
        .
      </p>
    </div>
  );
};
