import { cn } from "../../cn";

/* Banyan's colours as its Figma lists them: eight brand ramps by their
 * Banyan names, the four gradients, the text and icon roles, the glass
 * levels (each a tint at 30%, blurred) and the fills. */
type Swatch = { name: string; hex: string; className: string; note?: string };

const RAMPS: { name: string; swatches: Swatch[] }[] = [
  { name: "Green (Lidar green)", swatches: [
    { name: "lightest", hex: "#D9FBDD", className: "bg-bn-green-lightest" },
    { name: "light", hex: "#B3F7BB", className: "bg-bn-green-light" },
    { name: "default", hex: "#81F18E", className: "bg-bn-green" },
    { name: "dark", hex: "#68CE75", className: "bg-bn-green-dark" },
  ] },
  { name: "Yellow (Canary)", swatches: [
    { name: "lightest", hex: "#FDF7C5", className: "bg-bn-yellow-lightest" },
    { name: "light", hex: "#FBF08B", className: "bg-bn-yellow-light" },
    { name: "default", hex: "#F9E63F", className: "bg-bn-yellow" },
    { name: "dark", hex: "#CABB32", className: "bg-bn-yellow-dark" },
    { name: "darkest", hex: "#6D6419", className: "bg-bn-yellow-darkest" },
  ] },
  { name: "Indigo (Flax)", swatches: [
    { name: "lightest", hex: "#D3E4FF", className: "bg-bn-indigo-lightest" },
    { name: "light", hex: "#A6CAFF", className: "bg-bn-indigo-light" },
    { name: "default", hex: "#6BA6FF", className: "bg-bn-indigo" },
    { name: "dark", hex: "#568AD9", className: "bg-bn-indigo-dark" },
    { name: "darkest", hex: "#2B528E", className: "bg-bn-indigo-darkest" },
  ] },
  { name: "Mauve (Hibiscus)", swatches: [
    { name: "lightest", hex: "#FADBFF", className: "bg-bn-mauve-lightest" },
    { name: "light", hex: "#F5B8FF", className: "bg-bn-mauve-light" },
    { name: "default", hex: "#EE88FF", className: "bg-bn-mauve" },
    { name: "dark", hex: "#CF6DDF", className: "bg-bn-mauve-dark" },
    { name: "darkest", hex: "#90369F", className: "bg-bn-mauve-darkest" },
  ] },
  { name: "Blue (Glacier)", swatches: [
    { name: "lightest", hex: "#DAF6FF", className: "bg-bn-blue-lightest" },
    { name: "light", hex: "#B5EDFF", className: "bg-bn-blue-light" },
    { name: "default", hex: "#84E1FF", className: "bg-bn-blue" },
    { name: "dark", hex: "#6AC2DE", className: "bg-bn-blue-dark" },
    { name: "darkest", hex: "#35839D", className: "bg-bn-blue-darkest" },
  ] },
  { name: "Orange (Blaze)", swatches: [
    { name: "lightest", hex: "#FFD5BD", className: "bg-bn-orange-lightest" },
    { name: "light", hex: "#FFAB7B", className: "bg-bn-orange-light" },
    { name: "default", hex: "#FF7324", className: "bg-bn-orange" },
    { name: "dark", hex: "#CC5C1C", className: "bg-bn-orange-dark" },
    { name: "darkest", hex: "#662E0E", className: "bg-bn-orange-darkest" },
  ] },
  { name: "Red (Fire)", swatches: [
    { name: "lightest", hex: "#FFBFBD", className: "bg-bn-red-lightest" },
    { name: "light", hex: "#FF8480", className: "bg-bn-red-light" },
    { name: "default", hex: "#FF2A23", className: "bg-bn-red" },
    { name: "dark", hex: "#B21212", className: "bg-bn-red-dark" },
    { name: "darkest", hex: "#660D0A", className: "bg-bn-red-darkest" },
  ] },
  { name: "Grey", swatches: [
    { name: "lightest", hex: "#EFF2F1", className: "bg-bn-grey-lightest" },
    { name: "light", hex: "#E0E7E7", className: "bg-bn-grey-light" },
    { name: "default", hex: "#C0C9C9", className: "bg-bn-grey" },
    { name: "dark", hex: "#6D7E7B", className: "bg-bn-grey-dark" },
    { name: "darkest", hex: "#303B36", className: "bg-bn-grey-darkest" },
  ] },
];

// Sampled from the Figma's swatches; the spectrum is the brand's own.
const GRADIENTS: Swatch[] = [
  { name: "Green to blue", hex: "#81F18E → #84E1FF", className: "bn-green-blue" },
  { name: "Blue, green, yellow", hex: "#84E1FF → #81F18E → #F9E63F", className: "bg-linear-to-r from-bn-blue via-bn-green to-bn-yellow" },
  { name: "Indigo to dark indigo", hex: "#6BA6FF → #2B528E", className: "bg-linear-to-r from-bn-indigo to-bn-indigo-darkest" },
  { name: "Spectrum", hex: "Six brand colours", className: "spectrum" },
];

const ROLES: Swatch[] = [
  { name: "heavy", hex: "#0E2517", className: "bg-bn-heavy", note: "Primary text" },
  { name: "medium", hex: "#303B36", className: "bg-bn-medium", note: "Secondary text" },
  { name: "light", hex: "#6D7E7B", className: "bg-bn-light", note: "Disabled text" },
  { name: "success", hex: "#81F18E", className: "bg-bn-green", note: "Success" },
  { name: "warning", hex: "#F9E63E", className: "bg-bn-yellow", note: "Warning" },
  { name: "error", hex: "#FF7323", className: "bg-bn-orange", note: "Error" },
];

const GLASS: Swatch[] = [
  { name: "level-1", hex: "#FFFFFF at 30%", className: "bg-white/30 ring-1 ring-inset ring-bn-grey-light", note: "Cards" },
  { name: "level-2", hex: "#E0E7E7 at 30%", className: "bg-bn-glass-2/30", note: "Navigation, sidebar, popover, dropdown" },
  { name: "level-3", hex: "#6D7E7B at 30%", className: "bg-bn-glass-3/30", note: "Modal, drawer" },
  { name: "level-4", hex: "#495751 at 30%", className: "bg-bn-glass-4/30", note: "Modal, drawer" },
  { name: "level-5", hex: "#0E2517 at 30%", className: "bg-bn-glass-5/30", note: "Modal, drawer" },
];

const FILLS: Swatch[] = [
  { name: "01", hex: "#FFFFFF", className: "bg-white ring-1 ring-inset ring-bn-grey-light", note: "Light" },
  { name: "02", hex: "#EFF2F1", className: "bg-bn-grey-lightest", note: "Medium" },
  { name: "03", hex: "#E0E7E7", className: "bg-bn-grey-light", note: "Heavy" },
  { name: "04", hex: "#0E2517", className: "bg-bn-heavy", note: "Heaviest" },
  { name: "green", hex: "#D9FBDD", className: "bg-bn-green-lightest", note: "Coloured" },
  { name: "eggshell", hex: "#FDFBF1", className: "bg-bn-eggshell ring-1 ring-inset ring-bn-grey-light", note: "Coloured" },
];

const Chip = ({ name, hex, className, note }: Swatch) => (
  <li className="flex items-center gap-3">
    <span aria-hidden className={cn("size-8 shrink-0 rounded-full", className)} />
    <span className="min-w-0 leading-tight">
      <span className="block text-[14px] font-medium text-bn-heavy">{name}</span>
      <span className="block font-mono text-[12px] text-bn-medium">{note ? `${note}, ${hex}` : hex}</span>
    </span>
  </li>
);

const Group = ({ title, swatches, className }: { title: string; swatches: Swatch[]; className?: string }) => (
  <div className={className}>
    <p className="text-[13px] font-medium text-bn-medium">{title}</p>
    <ul className="mt-3 grid gap-3">
      {swatches.map((s) => (
        <Chip key={s.name + s.hex} {...s} />
      ))}
    </ul>
  </div>
);

export const BrandRamps = () => (
  <div className="grid w-full grid-cols-1 gap-8 min-[480px]:grid-cols-2 lg:grid-cols-4">
    {RAMPS.map((r) => (
      <Group key={r.name} title={r.name} swatches={r.swatches} />
    ))}
  </div>
);

export const Gradients = () => (
  <ul className="grid w-full gap-4 sm:grid-cols-2">
    {GRADIENTS.map((g) => (
      <li key={g.name}>
        <span aria-hidden className={cn("block h-16 rounded-[12px]", g.className)} />
        <span className="mt-2 block text-[14px] font-medium text-bn-heavy">{g.name}</span>
        <span className="block font-mono text-[12px] text-bn-medium">{g.hex}</span>
      </li>
    ))}
  </ul>
);

export const Roles = () => (
  <div className="grid w-full gap-8 sm:grid-cols-3">
    <Group title="Text, icon and border" swatches={ROLES} />
    <Group title="Glass" swatches={GLASS} />
    <Group title="Fill" swatches={FILLS} />
  </div>
);
