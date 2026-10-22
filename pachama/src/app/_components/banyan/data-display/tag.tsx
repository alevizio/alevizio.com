import { MdClose } from "react-icons/md";
import { cn } from "../../cn";
import { BN } from "../ui";

/* Banyan's tag (Figma: Tag, 1059:6910): a soft pill for a keyword, glass
 * level 2 at 30%, in three sizes, with an optional close. */
type Size = "xs" | "sm" | "md";

const SIZE: Record<Size, { pill: string; icon: string }> = {
  xs: { pill: "gap-1 px-2 py-1 text-[12px] leading-4", icon: "size-3" },
  sm: { pill: "gap-1 px-2.5 py-1 text-[14px] leading-5", icon: "size-3.5" },
  md: { pill: "gap-1.5 px-4 py-2 text-base leading-6", icon: "size-4" },
};

export const Tag = ({
  label,
  size = "md",
  onDismiss,
  className,
}: {
  label: string;
  size?: Size;
  /** Makes the tag dismissible: a close button removes it. */
  onDismiss?: () => void;
  className?: string;
}) => (
  <span className={cn("inline-flex items-center rounded-full bg-bn-glass-2/30 font-medium whitespace-nowrap text-bn-heavy", SIZE[size].pill, className)}>
    {label}
    {onDismiss ? (
      <button type="button" onClick={onDismiss} aria-label={`Remove ${label}`} className={cn("-m-1 grid place-items-center rounded-full p-1 transition-colors hover:bg-bn-glass-2", BN.focus)}>
        <MdClose aria-hidden className={SIZE[size].icon} />
      </button>
    ) : null}
  </span>
);
