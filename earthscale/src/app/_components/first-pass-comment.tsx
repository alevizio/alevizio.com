import { FiMessageSquare } from "react-icons/fi";
import { RxArrowUp, RxCheckCircled, RxCross2, RxDotsVertical } from "react-icons/rx";
import { cn } from "./cn";
import { GLASS } from "./first-pass-panels";
import { Typed } from "./panel";
import { Caret } from "./ui";

/* The comment on the green field (Comment 10:1589), as the hero plays it:
 * the pin drops where the field was clicked, the thread opens on Felix's
 * note, a reply is typed, sent and joins the thread, and resolving it
 * folds the thread back into the pin. */
export type Input = "idle" | "focus" | "typing";

const REPLY = "Keep it, it shows the parcels";
// The file's bright green, the pin's and the send button's.
export const PIN = "bg-[#60ff75] text-night shadow-[0_4px_4px_rgba(0,0,0,0.25),0_6px_13px_rgba(0,0,0,0.1)]";

export const Avatar = ({ initial }: { initial: string }) => (
  <span className={cn("grid size-7 shrink-0 place-items-center rounded-full text-[12px] leading-none font-extrabold", initial === "N" ? "bg-mint text-night" : "bg-night text-white")}>{initial}</span>
);

const Note = ({ initial, who, when, text }: { initial: string; who: string; when: string; text: string }) => (
  <div className="flex gap-2 py-2">
    <Avatar initial={initial} />
    <span className="flex flex-col gap-3 pt-0.5 leading-none whitespace-nowrap">
      <span className="flex items-end gap-1">
        <span className="text-[12px] text-white">{who}</span>
        <span className="text-[10px] text-mist/50">{when}</span>
      </span>
      <span className="text-[12px] text-white">{text}</span>
    </span>
  </div>
);

export const Comment = ({
  pin,
  card,
  reply,
  input,
  resolving,
  sending,
}: {
  pin: boolean;
  card: boolean;
  /** The sent reply, in the thread. */
  reply: boolean;
  input: Input;
  resolving: boolean;
  sending: boolean;
}) => (
  <div className="absolute top-[772px] left-[976px] flex items-start gap-4">
    <span className={cn("grid size-8 origin-bottom-left place-items-center rounded-full rounded-bl-none transition-[scale,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]", PIN, pin ? "scale-100 opacity-100" : "scale-50 opacity-0")}>
      <FiMessageSquare className="size-4" />
    </span>
    <div className={cn("flex w-[366px] origin-top-left flex-col gap-2 p-4 transition-[scale,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", GLASS, card ? "scale-100 opacity-100" : "scale-90 opacity-0")}>
      <div className="flex items-center gap-[10px] border-b border-mist/20 pb-4 text-white">
        <span className="flex-1 font-mono text-[12px] leading-none">Comment</span>
        <RxDotsVertical className="size-4" />
        <RxCheckCircled className={cn("size-4 transition-colors duration-200", resolving && "text-[#60ff75]")} />
        <RxCross2 className="size-4" />
      </div>
      <Note initial="F" who="Felix Dorrek" when="8 hrs ago" text="I’m not 100% sure we’ll add this to the demo" />
      <div className={cn("grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]", reply ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">
          <Note initial="N" who="Noah" when="Just now" text={REPLY} />
        </div>
      </div>
      <div className="flex items-center gap-2 py-2">
        <Avatar initial="N" />
        <span className="flex flex-1 items-center gap-4 rounded-[38px] border border-mist/20 py-1 pr-1 pl-4">
          <span className="relative flex flex-1 items-center text-[12px] leading-none">
            <span className={cn("flex items-center text-white/40", input === "typing" && "invisible")}>
              {input === "focus" ? <Caret className="mr-px ml-0 h-3" /> : null}
              Reply
            </span>
            <Typed text={REPLY} on={input === "typing"} caret={input === "typing"} className="absolute left-0 text-white" />
          </span>
          <span className={cn("grid size-7 place-items-center rounded-full transition-[scale] duration-150", PIN, sending && "scale-90")}>
            <RxArrowUp className="size-3" />
          </span>
        </span>
      </div>
    </div>
  </div>
);
