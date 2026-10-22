import type { ReactNode } from "react";
import { MdCheckCircle, MdClose, MdError, MdWarning } from "react-icons/md";
import { cn } from "../../cn";
import { BN } from "../ui";

/* Banyan's toast (Figma: Toast, 348:50787): glass level 2 at 30% over an
 * 80px blur, an 8px stripe of its tone down the left, an icon, a title, an
 * optional line, and a close. */
export type ToastTone = "success" | "warning" | "error";

const TONE: Record<ToastTone, { stripe: string; Icon: typeof MdCheckCircle; icon: string }> = {
  // The success icon is lidar green darkest (#378842), not yet a token here.
  success: { stripe: "border-bn-green", Icon: MdCheckCircle, icon: "text-[#378842]" },
  warning: { stripe: "border-bn-yellow", Icon: MdWarning, icon: "text-bn-yellow-darkest" },
  error: { stripe: "border-bn-orange", Icon: MdError, icon: "text-bn-red-darkest" },
};

export const Toast = ({
  tone,
  title,
  children,
  onDismiss,
  className,
}: {
  tone: ToastTone;
  title: string;
  children?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}) => {
  const { stripe, Icon, icon } = TONE[tone];
  return (
    <div
      className={cn(
        "relative flex w-full max-w-[352px] items-start gap-2 rounded-[8px] border-l-8 bg-bn-glass-2/30 py-4 pr-12 pl-6 backdrop-blur-[80px]",
        stripe,
        className,
      )}
    >
      <Icon aria-hidden className={cn("size-6 shrink-0", icon)} />
      <div className="grid min-w-0 gap-1">
        <p className="text-base leading-6 font-medium text-bn-heavy">{title}</p>
        {children ? <p className="text-[14px] leading-5 text-bn-medium">{children}</p> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className={cn("absolute top-2 right-2 grid place-items-center rounded-[8px] p-2 text-bn-heavy transition-colors hover:bg-bn-glass-2/60", BN.focus)}
        >
          <MdClose aria-hidden className="size-4" />
        </button>
      ) : null}
    </div>
  );
};
