/* The pipeline's wires and what runs along them. Each wire is a faint
 * guide, the line as far as it's drawn (with a soft glow under it), a
 * flow of small lights once it's whole, and a comet: a head with a halo
 * and a tail of three dashes, thinning out behind it, that draws the line
 * as it goes. The pipeline paints them every frame (drawWire); the paths
 * are in their svg's own units, about a px each at full size. */
const MINT = "#a0ffd7";
// The tail, longest and faintest first: its length and its strength.
const TAIL = [
  [26, 0.16],
  [13, 0.38],
  [5, 0.85],
] as const;

export const Halo = ({ id }: { id: string }) => (
  <radialGradient id={id}>
    <stop offset="0" stopColor={MINT} stopOpacity={0.7} />
    <stop offset="0.35" stopColor={MINT} stopOpacity={0.25} />
    <stop offset="1" stopColor={MINT} stopOpacity={0} />
  </radialGradient>
);

export const Wire = ({ name, d, halo }: { name: string; d: string; halo: string }) => (
  <g data-wire={name} fill="none">
    <path d={d} stroke="rgb(230 246 231 / 0.08)" strokeWidth={1} />
    <path data-glow d={d} stroke={MINT} strokeOpacity={0.14} strokeWidth={4} strokeDasharray="0 1000" />
    <path data-line d={d} stroke={MINT} strokeWidth={1.25} strokeDasharray="0 1000" />
    <path data-flow d={d} stroke="#eafff4" strokeWidth={1.25} strokeDasharray="1.5 10" opacity={0} className="motion-safe:animate-[es-flow_0.7s_linear_infinite]" />
    {TAIL.map(([size, strength]) => (
      <path key={size} data-tail d={d} stroke={MINT} strokeWidth={2} strokeLinecap="round" strokeOpacity={strength} strokeDasharray="0 1000" opacity={0} />
    ))}
    <g data-head opacity={0}>
      <circle r={10} fill={`url(#${halo})`} />
      <circle r={1.9} fill="#f4fff9" />
    </g>
  </g>
);

export type WireParts = { group: SVGGElement; line: SVGPathElement; glow: SVGPathElement; flow: SVGPathElement; tails: SVGPathElement[]; head: SVGGElement; len: number };

export const findWire = (root: Element, name: string): WireParts => {
  const group = root.querySelector<SVGGElement>(`[data-wire="${name}"]`)!;
  const line = group.querySelector<SVGPathElement>("[data-line]")!;
  return {
    group,
    line,
    glow: group.querySelector<SVGPathElement>("[data-glow]")!,
    flow: group.querySelector<SVGPathElement>("[data-flow]")!,
    tails: [...group.querySelectorAll<SVGPathElement>("[data-tail]")],
    head: group.querySelector<SVGGElement>("[data-head]")!,
    len: line.getTotalLength(),
  };
};

export const set = (el: Element, name: string, value: number | string) => el.setAttribute(name, String(value));

export const clamp = (x: number) => Math.min(1, Math.max(0, x));
export const inOut = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
export const out = (x: number) => 1 - (1 - x) ** 3;

/** Where in a loop of `steps` (ms each) t falls: the step, and how far
 *  into it. Past the end it stays in the last. */
export const at = (steps: readonly number[], t: number) => {
  let step = 0;
  let ms = t;
  while (step < steps.length - 1 && ms >= steps[step]) ms -= steps[step++];
  return { step, ms };
};

/** The wire drawn to `f` of its length, the comet at its end or not, the
 *  flow on or not, the whole of it at `fade`. */
export const drawWire = (w: WireParts, f: number, comet: boolean, flow: boolean, fade: number) => {
  const drawn = f * w.len;
  set(w.group, "opacity", fade);
  set(w.line, "stroke-dasharray", `${drawn} ${w.len + 1}`);
  set(w.glow, "stroke-dasharray", `${drawn} ${w.len + 1}`);
  set(w.flow, "opacity", flow ? 0.55 : 0);
  TAIL.forEach(([size], i) => {
    const from = Math.max(0, drawn - size);
    set(w.tails[i], "stroke-dasharray", `${drawn - from} ${w.len + 1}`);
    set(w.tails[i], "stroke-dashoffset", -from);
    set(w.tails[i], "opacity", Number(comet));
  });
  const { x, y } = w.line.getPointAtLength(drawn);
  set(w.head, "transform", `translate(${x} ${y})`);
  set(w.head, "opacity", Number(comet));
};
