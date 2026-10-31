import type { ReactNode } from "react";
import { MdArrowForward, MdCheck } from "react-icons/md";
import { cn } from "./cn";
import { Caret, Cta, Field } from "./ui";

export type SignupPhase = "idle" | "adding" | "added";

// Get Started, Adding, Added: one slot the size of the longest, the three
// faces crossfading in it.
const FACES: { phase: SignupPhase; label: string; icon: ReactNode }[] = [
  { phase: "idle", label: "Get Started", icon: <MdArrowForward aria-hidden className="size-5" /> },
  { phase: "adding", label: "Adding", icon: <span className="size-5 rounded-full border-2 border-night/25 border-t-night motion-safe:animate-spin" /> },
  { phase: "added", label: "Added", icon: <MdCheck aria-hidden className="size-5" /> },
];

/** The hero's email field, live, through the states the file draws for it:
 *  the placeholder, typed into, adding, added. A Stageshow cursor presses
 *  the button (it sets data-hover and data-pressed); `pressed` does the
 *  same without one. */
export const SignupField = ({
  email,
  phase,
  focus = false,
  pressed = false,
  small = false,
  className,
}: {
  email: string;
  phase: SignupPhase;
  focus?: boolean;
  pressed?: boolean;
  /** The phone page's: its button tighter, its type a step up to read at a phone's scale. */
  small?: boolean;
  className?: string;
}) => (
  <Field className={cn("h-[63px] max-w-none", className)}>
    <span className={cn("relative min-w-0 flex-1 font-sans leading-none text-mist", small ? "text-[15px]" : "text-[14px]")}>
      <span className={cn("absolute inset-y-0 left-0 flex items-center transition-opacity duration-200", email === "" && phase !== "added" ? "opacity-50" : "opacity-0")}>Enter your email...</span>
      <span className={cn("block truncate py-1 transition-opacity duration-150", phase === "added" ? "opacity-0" : "opacity-100")}>
        {email || " "}
        {focus ? <Caret /> : null}
      </span>
      <span className={cn("absolute inset-y-0 left-0 flex items-center transition-opacity", phase === "added" ? "opacity-100 delay-150 duration-300" : "opacity-0 duration-150")}>Email added!</span>
    </span>
    <span data-target="cta" data-cursor="hand" data-pressed={pressed || undefined} className="group shrink-0">
      <Cta
        icon={
          <span className="grid">
            {FACES.map(({ phase: face, label, icon }) => (
              <span key={face} className={cn("col-start-1 row-start-1 flex items-center justify-center gap-2 transition-opacity", phase === face ? "opacity-100 delay-100 duration-200" : "opacity-0 duration-100")}>
                {label}
                {icon}
              </span>
            ))}
          </span>
        }
        className={cn("group-data-[hover]:bg-mist group-data-[pressed]:bg-mist group-data-[pressed]:shadow-[inset_0_2px_2px_rgba(0,0,0,0.25)]", small && "pr-4 pl-5 text-[15px]")}
      >
        {null}
      </Cta>
    </span>
  </Field>
);
