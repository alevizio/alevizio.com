import { cn } from "../cn";

/* Manoa's reference-region check, redrawn from Evaluation 2.0: the project
 * boundary in white over the forest, the reference region's edge in cyan.
 * Traced from the evaluation's map; both lines draw themselves as the map
 * comes into view, then the boundary fills. The forest is drawn crowns, so
 * it's sharp at any size. */
const W = 568;
const H = 320;

// The project boundary and the reference region's edge, traced from the
// evaluation screen's map (568 wide) and centred in this taller frame.
const BOUNDARY = "M282 66 L317 77 L399 256 L212 256 L212 223 L232 193 L242 156 L254 118 L257 86 Z";
const REFERENCE = "M0 198 L37 173 L60 145 L62 116 L86 93 L114 53 L134 40 L170 0";

// The canopy from above: crowns in three greens, then pale specks of open
// ground, as the satellite tile has them. Seeded, so it never changes.
const rand = (n: number) => {
  const a = Math.sin(n * 12.9898) * 43758.5453;
  return a - Math.floor(a);
};
const CROWNS = Array.from({ length: 420 }, (_, i) => ({
  x: Math.round(rand(i) * W),
  y: Math.round(rand(i + 1000) * H),
  r: Math.round(5 + rand(i + 2000) * 9),
  fill: ["#1d4630", "#2a5d40", "#173a28"][i % 3],
}));
const SPECKS = Array.from({ length: 46 }, (_, i) => ({
  x: Math.round(rand(i + 3000) * 300 + 60),
  y: Math.round(rand(i + 4000) * 140 + 20),
  r: 1 + ((i * 7) % 3) * 0.6,
}));

export const ReferenceMap = ({ className }: { className?: string }) => (
  <svg
    viewBox={`0 0 ${W} ${H}`}
    role="img"
    aria-label="Manoa's boundary in white on dense forest, with the edge of its reference region in cyan to the north-west"
    className={cn("block h-auto w-full", className)}
  >
    <rect width={W} height={H} fill="#24533a" />
    <g opacity="0.85">
      {CROWNS.map(({ x, y, r, fill }) => (
        <circle key={`${x}-${y}-${r}`} cx={x} cy={y} r={r} fill={fill} />
      ))}
    </g>
    <g fill="#e8f0ea" opacity="0.55">
      {SPECKS.map(({ x, y, r }) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
      ))}
    </g>
    <path data-reveal className="[--reveal-delay:1.2s]" d={BOUNDARY} fill="rgb(255 255 255 / 0.28)" />
    <path data-reveal="draw" d={BOUNDARY} pathLength={1} fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinejoin="round" />
    <path data-reveal="draw" className="[--reveal-delay:0.5s]" d={REFERENCE} pathLength={1} fill="none" stroke="#3fd0e0" strokeWidth={2.5} strokeLinejoin="round" />
  </svg>
);
