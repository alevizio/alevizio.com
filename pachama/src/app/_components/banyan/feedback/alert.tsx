import type { ReactNode } from "react";
import { MdCheckCircle, MdError, MdWarning } from "react-icons/md";
import { cn } from "../../cn";

/* Banyan's alert (Figma: Alert, 789:18618): the state of a system, feature or
 * page, on its brand colour at 20%, with an icon, a title and an optional
 * line on what to do. */
type Tone = "success" | "warning" | "error";

const TONE: Record<Tone, { box: string; Icon: typeof MdCheckCircle; icon: string }> = {
  // The success icon is lidar green darkest (#378842), not yet a token here.
  success: { box: "bg-bn-green/20", Icon: MdCheckCircle, icon: "text-[#378842]" },
  warning: { box: "bg-bn-yellow/20", Icon: MdWarning, icon: "text-bn-yellow-darkest" },
  error: { box: "bg-bn-red/20", Icon: MdError, icon: "text-bn-red-darkest" },
};

export const Alert = ({
  tone,
  title,
  children,
  icon = true,
  role,
  className,
}: {
  tone: Tone;
  title: string;
  /** The optional line on what to do next. */
  children?: ReactNode;
  icon?: boolean;
  /** "alert" only when it appears in response to something. */
  role?: "alert" | "status";
  className?: string;
}) => {
  const { box, Icon, icon: iconColour } = TONE[tone];
  return (
    <div role={role} className={cn("flex items-start gap-2 rounded-2xl p-4", box, className)}>
      {icon ? <Icon aria-hidden className={cn("size-6 shrink-0", iconColour)} /> : null}
      <div className="grid min-w-0 gap-1">
        <p className="text-base leading-6 font-medium text-bn-heavy">{title}</p>
        {children ? <div className="text-[14px] leading-5 text-bn-medium">{children}</div> : null}
      </div>
    </div>
  );
};
