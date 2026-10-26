import type { ReactNode } from "react";
import { FiEdit2, FiEye, FiEyeOff, FiLogOut, FiMinimize2, FiMoreVertical } from "react-icons/fi";
import { MdAdd, MdArrowDropDown } from "react-icons/md";
import { RxChevronLeft, RxChevronRight, RxCopy, RxCross2, RxDropdownMenu, RxEraser, RxSquare, RxZoomIn } from "react-icons/rx";
import { cn } from "./cn";

/* The first pass's panels over its map, as the file draws them (Map
 * controls 10:1630, Visualization controls 10:1504, Sub menu 10:1569):
 * Neue Machina at 10 px, Plex Mono for titles and the button. The eyes
 * follow whichever data set is on the map. */

/** The file's glass: the page green at 70% over a 50 px blur, a hairline
 *  lighter along the top, and a soft shadow under it. */
export const GLASS =
  "rounded-[16px] border border-white/15 border-t-white/30 bg-night/70 shadow-[0_4px_4px_rgba(0,0,0,0.25),0_6px_13px_rgba(0,0,0,0.1),0_24px_24px_rgba(0,0,0,0.09),0_53px_32px_rgba(0,0,0,0.05)] backdrop-blur-[50px]";

/** Each data set's chip, the file's own gradients. */
const CHIP = [
  "bg-[linear-gradient(270deg,#080b11_0%,#1d253e_27.7%,#1d2e64_44%,#af4846_67.1%,#df5c39_82.5%,#e7d287_100%)]",
  "bg-[linear-gradient(90deg,#dfdd2b_0%,#6cc750_27.7%,#4ebb5c_44%,#1f8381_67.1%,#315280_82.5%,#2f063e_100%)]",
  "bg-[linear-gradient(270deg,#080b11_0%,#eb7746_27.7%,#be3a71_44%,#7f0f96_67.1%,#46098e_82.5%,#190b77_100%)]",
  "bg-[linear-gradient(90deg,#f6f8d5_0%,#cad7b7_27.7%,#bbc9ad_44%,#838d93_67.1%,#2e385d_82.5%,#051d3e_100%)]",
];

const TEXT = "text-[10px] leading-none text-white";

const Eye = ({ on }: { on: boolean }) => (
  <span className="relative size-4">
    <FiEye className={cn("absolute inset-0 size-4 transition-opacity duration-300", on ? "opacity-100" : "opacity-0")} />
    <FiEyeOff className={cn("absolute inset-0 size-4 transition-opacity duration-300", on ? "opacity-0" : "opacity-100")} />
  </span>
);

const DataSet = ({ n, on }: { n: number; on: boolean }) => (
  <div className="flex items-center gap-2 py-2">
    <span className={cn("size-8 shrink-0 rounded-[8px]", CHIP[n])} />
    <span className="flex-1">
      <span className={cn("block", TEXT)}>Data Set {n + 1}</span>
      <span className="mt-1.5 block text-[8px] leading-none text-mist/50">2015-02-27</span>
    </span>
    <span className="flex gap-2 text-white">
      <FiMoreVertical className="size-4" />
      <Eye on={on} />
    </span>
  </div>
);

/** A slider as the file draws it: lit up to its thumb. */
const Track = ({ fill, className }: { fill: string; className?: string }) => (
  <span className={cn("relative h-px", className)}>
    <span className="absolute inset-0 bg-white/25" />
    <span className={cn("absolute inset-y-0 left-0 bg-white", fill)} />
  </span>
);

/** The layers panel: four data sets, the first with its time slider. */
export const LayersList = ({ on }: { on: number }) => (
  <div className={cn("absolute top-[675px] left-8 flex w-[280px] flex-col gap-2 p-4", GLASS)}>
    <div className="flex flex-col gap-2">
      <DataSet n={0} on={on === 0} />
      <div className="flex items-center gap-4 border-b border-mist/20 pb-4 text-white">
        <span className={TEXT}>Time</span>
        <span className="relative flex flex-1 items-center justify-center gap-1">
          <RxChevronLeft className="size-4" />
          <Track fill="w-[58px]" className="w-[142px]" />
          <RxChevronRight className="size-4" />
          <span className="absolute top-1 left-[70px] size-2 rounded-full bg-white" />
        </span>
        <RxDropdownMenu className="size-4" />
      </div>
    </div>
    {[1, 2, 3].map((n) => (
      <DataSet key={n} n={n} on={on === n} />
    ))}
    <span className="flex items-center justify-center gap-2 rounded-[8px] border border-mist/20 bg-mist/5 px-6 py-3 font-mono text-[12px] leading-none text-white uppercase">
      Add new data set <MdAdd className="size-4" />
    </span>
  </div>
);

const Choice = ({ label, chip = false, children }: { label: string; chip?: boolean; children: ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span className={TEXT}>{label}</span>
    <span className="flex items-center gap-2 rounded-[8px] border border-mist/20 px-4 py-2 text-white">
      {chip ? <span className={cn("size-4 rounded-[4px]", CHIP[0])} /> : null}
      <span className={cn("flex-1", TEXT)}>{children}</span>
      <MdArrowDropDown className="size-4" />
    </span>
  </div>
);

const Value = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-1 flex-col gap-2">
    <span className={TEXT}>{label}</span>
    <span className={cn("rounded-[8px] border border-mist/20 px-4 py-2", TEXT)}>{children}</span>
  </div>
);

/** Editing the first data set's look; its eye follows the map too. */
export const EditViz = ({ on }: { on: boolean }) => (
  <div className={cn("absolute top-[959px] left-[328px] flex w-[280px] flex-col gap-2 p-4", GLASS)}>
    <div className="flex items-center gap-[10px] border-b border-mist/20 pb-4 text-white">
      <span className="flex-1 font-mono text-[12px] leading-none">Editing Visualization</span>
      <RxZoomIn className="size-4" />
      <RxCopy className="size-4" />
      <RxCross2 className="size-4" />
    </div>
    <DataSet n={0} on={on} />
    <div className="flex items-center gap-4 pb-4">
      <span className={TEXT}>Opacity</span>
      <span className="relative flex flex-1 items-center">
        <Track fill="w-[80px]" className="flex-1" />
        <span className="absolute -top-1 left-[76px] size-2 rounded-full bg-white" />
      </span>
    </div>
    <div className="flex items-center gap-[10px] pb-4">
      <span className={cn("flex-1", TEXT)}>Transparency Fill Layer</span>
      <span className="relative h-4 w-[29px] rounded-full bg-white/30">
        <span className="absolute top-0.5 right-0.5 size-3 rounded-full bg-white" />
      </span>
    </div>
    <Choice label="Visualization Type">Single Band</Choice>
    <Choice label="Band">2m-Temperature</Choice>
    <Choice label="Color Ramp" chip>
      Inferno
    </Choice>
    <div className="flex gap-2">
      <Value label="Min*">205.7770008</Value>
      <Value label="Max*">315.799102</Value>
    </div>
    <div className="flex items-center gap-2 text-white">
      <RxSquare className="size-4" />
      <span className={TEXT}>Reverse Color Ramp</span>
    </div>
  </div>
);

const MENU = [
  { label: "Remove From Map", Icon: RxEraser },
  { label: "Edit Visualization", Icon: FiEdit2 },
  { label: "View Details", Icon: FiEye },
  { label: "Zoom To Fit (Z)", Icon: FiMinimize2 },
  { label: "Open In QGIS", Icon: FiLogOut },
];

/** A layer's menu, open, half under the hero's fade. */
export const SubMenu = () => (
  <ul className={cn("absolute top-[1143px] left-[155px] flex w-[157px] flex-col gap-2 p-4", GLASS)}>
    {MENU.map(({ label, Icon }) => (
      <li key={label} className="flex items-center justify-between text-white">
        <span className={TEXT}>{label}</span>
        <Icon className="size-4" />
      </li>
    ))}
  </ul>
);
