import type { ReactNode } from "react";
import { cn } from "./cn";

/* Every flag on the page, round, the way Banyan's country chips draw them:
 * a square of the flag in a circle, with a hairline ring so the white ones
 * keep their edge on white. Drawn to read at chip size, so the emblems are
 * simplified (a shape or a dot). Always beside the country's name, so the
 * flag itself is hidden from screen readers. */
export type Country = "ar" | "br" | "ca" | "cd" | "co" | "id" | "in" | "ke" | "mw" | "mx" | "ni" | "py" | "sg" | "us";

/** A five-pointed star's points, for <polygon>. */
const star = (cx: number, cy: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const d = i % 2 ? r * 0.4 : r;
    return `${(cx + d * Math.cos(a)).toFixed(2)},${(cy + d * Math.sin(a)).toFixed(2)}`;
  }).join(" ");

/** Three bands, top to bottom (or left to right). */
const Bands = ({ colors, vertical = false }: { colors: [string, string, string]; vertical?: boolean }) => (
  <>
    {colors.map((fill, i) => (vertical ? <rect key={i} x={i * 8} width="8" height="24" fill={fill} /> : <rect key={i} y={i * 8} width="24" height="8" fill={fill} />))}
  </>
);

const MAPLE =
  "12,5 13.1,7.1 14.3,6.5 13.8,9.6 15.6,7.7 16,8.8 17.8,8.5 17.2,10.5 18,10.9 15,13.4 15.4,14.6 12.35,14.2 12.35,17 11.65,17 11.65,14.2 8.6,14.6 9,13.4 6,10.9 6.8,10.5 6.2,8.5 8,8.8 8.4,7.7 10.2,9.6 9.7,6.5 10.9,7.1";

const FLAGS: Record<Country, ReactNode> = {
  ar: (
    <>
      <Bands colors={["#74acdf", "#ffffff", "#74acdf"]} />
      <circle cx="12" cy="12" r="2.4" fill="#f6b40e" />
    </>
  ),
  br: (
    <>
      <rect width="24" height="24" fill="#229e45" />
      <path d="M12 4.5 21.5 12 12 19.5 2.5 12Z" fill="#f8e509" />
      <circle cx="12" cy="12" r="4.4" fill="#2b49a3" />
      <path d="M7.8 11.2c2.9-.6 5.9-.1 8.4 1.4" stroke="#fff" strokeWidth="0.8" fill="none" />
    </>
  ),
  ca: (
    <>
      <rect width="24" height="24" fill="#ffffff" />
      <rect width="5" height="24" fill="#d52b1e" />
      <rect x="19" width="5" height="24" fill="#d52b1e" />
      <polygon points={MAPLE} transform="translate(12 11.6) scale(0.72) translate(-12 -11)" fill="#d52b1e" />
    </>
  ),
  cd: (
    <>
      <rect width="24" height="24" fill="#007fff" />
      <polygon points="0,18 18,0 24,0 24,6 6,24 0,24" fill="#f7d618" />
      <polygon points="0,20.5 20.5,0 24,0 24,3.5 3.5,24 0,24" fill="#ce1021" />
      <polygon points={star(6.5, 6.5, 3.6)} fill="#f7d618" />
    </>
  ),
  co: (
    <>
      <rect width="24" height="12" fill="#fcd116" />
      <rect y="12" width="24" height="6" fill="#003893" />
      <rect y="18" width="24" height="6" fill="#ce1126" />
    </>
  ),
  id: (
    <>
      <rect width="24" height="12" fill="#e70011" />
      <rect y="12" width="24" height="12" fill="#ffffff" />
    </>
  ),
  in: (
    <>
      <Bands colors={["#ff9933", "#ffffff", "#138808"]} />
      <circle cx="12" cy="12" r="2.6" fill="none" stroke="#000080" strokeWidth="0.7" />
      <circle cx="12" cy="12" r="0.6" fill="#000080" />
    </>
  ),
  ke: (
    <>
      <rect width="24" height="24" fill="#ffffff" />
      <rect width="24" height="7.2" fill="#000000" />
      <rect y="8.4" width="24" height="7.2" fill="#bb0000" />
      <rect y="16.8" width="24" height="7.2" fill="#006600" />
      <path d="M8.4 5.4 15.6 18.6M15.6 5.4 8.4 18.6" stroke="#ffffff" strokeWidth="0.7" />
      <ellipse cx="12" cy="12" rx="3" ry="6.4" fill="#000000" />
      <ellipse cx="12" cy="12" rx="1.7" ry="5.4" fill="#bb0000" />
      <path d="M12 7.6v8.8" stroke="#ffffff" strokeWidth="0.5" />
    </>
  ),
  mw: (
    <>
      <Bands colors={["#000000", "#ce1126", "#339e35"]} />
      <path d="M8.4 8a3.6 3.6 0 0 1 7.2 0Z" fill="#ce1126" />
    </>
  ),
  mx: (
    <>
      <Bands colors={["#006847", "#ffffff", "#ce1126"]} vertical />
      <circle cx="12" cy="12" r="2.6" fill="#8c6b3d" />
    </>
  ),
  ni: (
    <>
      <Bands colors={["#0067c6", "#ffffff", "#0067c6"]} />
      <polygon points="12,10.3 13.7,13.3 10.3,13.3" fill="none" stroke="#c8a400" strokeWidth="0.6" />
    </>
  ),
  py: (
    <>
      <Bands colors={["#d52b1e", "#ffffff", "#0038a8"]} />
      <circle cx="12" cy="12" r="2.3" fill="none" stroke="#0038a8" strokeWidth="0.6" />
      <polygon points={star(12, 12, 1.2)} fill="#f7d300" />
    </>
  ),
  sg: (
    <>
      <rect width="24" height="12" fill="#ef3340" />
      <rect y="12" width="24" height="12" fill="#ffffff" />
      <circle cx="7.4" cy="6.2" r="3.6" fill="#ffffff" />
      <circle cx="8.8" cy="6.2" r="3.3" fill="#ef3340" />
      {[-90, -18, 54, 126, 198].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return <polygon key={deg} points={star(10 + 1.7 * Math.cos(a), 6.3 + 1.7 * Math.sin(a), 0.62)} fill="#ffffff" />;
      })}
    </>
  ),
  us: (
    <>
      <rect width="24" height="24" fill="#ffffff" />
      {[0, 2, 4, 6, 8, 10, 12].map((k) => (
        <rect key={k} y={(k * 24) / 13} width="24" height={24 / 13} fill="#b22234" />
      ))}
      <rect width="11" height="13" fill="#3c3b6e" />
    </>
  ),
};

export const Flag = ({ country, className }: { country: Country; className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={cn("size-5 shrink-0 rounded-full ring-1 ring-black/10", className)}>
    {FLAGS[country]}
  </svg>
);
