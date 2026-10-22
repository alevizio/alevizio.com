import type { ReactNode } from "react";
import { MdCheckCircle, MdClose, MdError, MdInfoOutline, MdWarning } from "react-icons/md";
import { cn } from "../../cn";
import { BN } from "../ui";

/* Banyan's banner (Figma: Banner, 868:26039): one prominent line across the
 * top of a page, 48px tall, in four tones, with an optional icon and a
 * close. The error banner sets its text in black: Banyan's green-black on
 * fire red reads 4.3:1, black reads 5.6:1. */
export type BannerTone = "neutral" | "success" | "warning" | "error";

const TONE: Record<BannerTone, { bar: string; Icon: typeof MdInfoOutline }> = {
  neutral: { bar: "bg-bn-heavy text-white", Icon: MdInfoOutline },
  success: { bar: "bg-bn-green text-bn-heavy", Icon: MdCheckCircle },
  warning: { bar: "bg-bn-yellow text-bn-heavy", Icon: MdWarning },
  error: { bar: "bg-bn-red text-black", Icon: MdError },
};

export const Banner = ({
  tone = "neutral",
  icon = false,
  onDismiss,
  children,
  className,
}: {
  tone?: BannerTone;
  icon?: boolean;
  onDismiss?: () => void;
  children: ReactNode;
  className?: string;
}) => {
  const { bar, Icon } = TONE[tone];
  return (
    <div className={cn("relative flex min-h-12 items-center justify-center gap-2 py-3 pr-14 pl-6 text-[14px] leading-5 sm:px-14", bar, className)}>
      {icon ? <Icon aria-hidden className="size-4 shrink-0" /> : null}
      <p className="min-w-0">{children}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={cn("absolute top-1/2 right-4 grid size-8 -translate-y-1/2 place-items-center rounded-full", BN.focus, tone === "neutral" && "focus-visible:outline-white")}
        >
          <MdClose aria-hidden className="size-5" />
        </button>
      ) : null}
    </div>
  );
};
