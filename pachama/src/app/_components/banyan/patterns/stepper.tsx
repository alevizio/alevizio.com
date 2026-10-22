import { Fragment } from "react";
import { MdCheck } from "react-icons/md";
import { cn } from "../../cn";

/* Banyan's stepper, the supplier lifecycle's spine: done steps get a check,
 * the current one fills green, the next one waits on a dashed ring, the
 * rest stay grey. Big (32px, numbered), small (16px dots) and vertical
 * (with each step's line of copy). */
type Status = "done" | "current" | "next" | "upcoming";

const statusOf = (i: number, current: number, showNext: boolean): Status =>
  i < current ? "done" : i === current ? "current" : showNext && i === current + 1 ? "next" : "upcoming";

const RING: Record<Status, string> = {
  done: "border-2 border-bn-green text-bn-heavy",
  current: "bg-bn-green text-bn-heavy",
  next: "border-2 border-dashed border-bn-heavy text-bn-heavy",
  upcoming: "border-2 border-bn-grey-light text-bn-medium",
};

const LABEL = "text-[12px] leading-4 font-bold uppercase";

type Step = { name: string; text?: string };

/** A 32px numbered step, or a check once it's done. */
const BigDot = ({ status, n }: { status: Status; n: number }) => (
  <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-[12px] font-bold", RING[status])}>
    {status === "done" ? <MdCheck aria-hidden className="size-4" /> : n}
  </span>
);

const Connector = ({ status, className }: { status: Status; className?: string }) => (
  <span
    aria-hidden
    className={cn(
      "h-0 min-w-4 flex-1 border-t-2",
      status === "done" ? "border-bn-green" : status === "next" ? "border-dashed border-bn-heavy" : "border-bn-grey-light",
      className,
    )}
  />
);

/** The stepper as a row: big and numbered, or small with only the
 *  current step named. */
export const StepperRow = ({
  steps,
  current,
  size = "big",
  showNext = false,
  label,
  className,
}: {
  steps: readonly Step[];
  current: number;
  size?: "big" | "small";
  showNext?: boolean;
  label: string;
  className?: string;
}) => (
  <ol aria-label={label} className={cn("flex items-center", size === "big" ? "gap-2" : "gap-1", className)}>
    {steps.map((step, i) => {
      const status = statusOf(i, current, showNext);
      return (
        <Fragment key={step.name}>
          {i > 0 ? (
            <li aria-hidden className="flex flex-1 items-center">
              {/* The line into a step is green up to the current one. */}
              <Connector status={i <= current ? "done" : statusOf(i, current, showNext)} className={size === "small" ? "min-w-3 max-w-6" : "max-w-12"} />
            </li>
          ) : null}
          <li aria-current={status === "current" ? "step" : undefined} className="flex shrink-0 items-center gap-2">
            {size === "big" ? (
              <BigDot status={status} n={i + 1} />
            ) : (
              <span className={cn("size-4 shrink-0 rounded-full", status === "current" ? "bn-green-blue" : RING[status])} />
            )}
            <span className={cn(LABEL, size === "small" && status !== "current" && "sr-only", status === "upcoming" && size === "big" ? "text-bn-medium" : "text-bn-heavy")}>
              {step.name}
              <span className="sr-only">{status === "done" ? ", done" : status === "current" ? ", current step" : ""}</span>
            </span>
          </li>
        </Fragment>
      );
    })}
  </ol>
);

/** The stepper standing up, with each step's line of copy. */
export const StepperVertical = ({ steps, current, label, className }: { steps: readonly Step[]; current: number; label: string; className?: string }) => (
  <ol aria-label={label} className={cn("grid", className)}>
    {steps.map((step, i) => {
      const status = statusOf(i, current, false);
      return (
        <li key={step.name} aria-current={status === "current" ? "step" : undefined} className="grid grid-cols-[2rem_1fr] gap-x-3">
          <span className="flex flex-col items-center">
            <BigDot status={status} n={i + 1} />
            {i < steps.length - 1 ? <span aria-hidden className={cn("w-0.5 flex-1", status === "done" ? "bg-bn-green" : "bg-bn-grey-light")} /> : null}
          </span>
          <span className="pb-5">
            <span className={cn(LABEL, "block pt-2 text-bn-heavy")}>
              {step.name}
              <span className="sr-only">{status === "done" ? ", done" : status === "current" ? ", current step" : ""}</span>
            </span>
            {step.text ? <span className="mt-1 block text-[14px] leading-5 text-bn-medium">{step.text}</span> : null}
          </span>
        </li>
      );
    })}
  </ol>
);
