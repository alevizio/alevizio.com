import {
  ArrowUp,
  CassetteTape,
  Check,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
  MessageCircle,
  Mic,
  Notebook,
  Pause,
  Settings2,
  X,
} from "lucide-react";
import { cn } from "./cn";
import { PAGE } from "./story";

/* The app's icon set as the brand book shows it (p. 25): every icon the app
 * draws, Lucide, unmodified, named by its job and by its Lucide id, at the
 * app's 1.5 stroke (p. 27). Then the same set at its true size, 22 px. */
const ICONS: readonly { job: string; id: string; Icon: LucideIcon }[] = [
  { job: "journal", id: "notebook", Icon: Notebook },
  { job: "coach", id: "message-circle", Icon: MessageCircle },
  { job: "recaps", id: "cassette-tape", Icon: CassetteTape },
  { job: "settings", id: "settings-2", Icon: Settings2 },
  { job: "disclosure", id: "chevron-right", Icon: ChevronRight },
  { job: "back", id: "chevron-left", Icon: ChevronLeft },
  { job: "dismiss", id: "x", Icon: X },
  { job: "talk", id: "mic", Icon: Mic },
  { job: "send", id: "arrow-up", Icon: ArrowUp },
  { job: "pause", id: "pause", Icon: Pause },
  { job: "selected", id: "check", Icon: Check },
];

export const IconSet = ({ className }: { className?: string }) => (
  <div className={cn(PAGE, className)}>
    <ul className="grid grid-cols-3 gap-x-8 gap-y-14 sm:grid-cols-4 lg:grid-cols-6">
      {ICONS.map(({ job, id, Icon }) => (
        <li key={id}>
          <Icon aria-hidden strokeWidth={1.5} className="size-11 text-pen" />
          <p className="mt-5 font-mono text-[13px] font-medium text-ink">{job}</p>
          <p className="font-mono text-[12px] text-body">{id}</p>
        </li>
      ))}
    </ul>
    <p className="type-label mt-16 text-body">True size · 22 px</p>
    <ul aria-label="The same icons at their size in the app" className="mt-5 flex flex-wrap gap-5">
      {ICONS.map(({ id, Icon }) => (
        <li key={id}>
          <Icon aria-hidden strokeWidth={1.5} className="size-[22px] text-pen" />
        </li>
      ))}
    </ul>
  </div>
);
