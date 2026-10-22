import { MdPersonOutline } from "react-icons/md";
import { cn } from "../../cn";

/* Banyan's avatar (Figma: Avatar, 348:51062): a rounded square, not a
 * circle. Initials on lidar green lightest; an image (or the fallback
 * person) on white with a light border; an organisation's mark. */
type AvatarSize = "xs" | "sm" | "md" | "lg";

const SIZE: Record<AvatarSize, { box: string; text: string; icon: string; overlap: string }> = {
  xs: { box: "size-6 rounded-[8px]", text: "text-[10px] leading-3", icon: "size-3.5", overlap: "-ml-[5.5px]" },
  sm: { box: "size-8 rounded-[10px]", text: "text-[13px] leading-4", icon: "size-4", overlap: "-ml-1.5" },
  md: { box: "size-12 rounded-2xl", text: "text-base leading-6", icon: "size-6", overlap: "-ml-[7px]" },
  lg: { box: "size-16 rounded-[20px]", text: "text-xl leading-7", icon: "size-8", overlap: "-ml-2" },
};

type AvatarProps = {
  size?: AvatarSize;
  /** Initials, or nothing for the fallback person. */
  initials?: string;
  /** An organisation's mark, as an image path. */
  mark?: string;
  /** The person or organisation it stands for, for screen readers. */
  name: string;
  className?: string;
};

export const Avatar = ({ size = "md", initials, mark, name, className }: AvatarProps) => {
  const s = SIZE[size];
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "inline-grid shrink-0 place-items-center overflow-hidden font-medium text-bn-heavy",
        s.box,
        initials ? "bg-bn-green-lightest" : "border border-bn-line bg-white",
        className,
      )}
    >
      {initials ? (
        <span aria-hidden className={s.text}>
          {initials}
        </span>
      ) : mark ? (
        // eslint-disable-next-line @next/next/no-img-element -- the brand's own SVG
        <img src={mark} alt="" className="size-3/5" />
      ) : (
        <MdPersonOutline aria-hidden className={s.icon} />
      )}
    </span>
  );
};

/** Avatars overlapping, each cut out of the surface; past `max`, a count. */
export const AvatarGroup = ({
  people,
  size = "sm",
  max = people.length,
  className,
}: {
  people: Omit<AvatarProps, "size" | "className">[];
  size?: AvatarSize;
  max?: number;
  className?: string;
}) => {
  const s = SIZE[size];
  const hidden = people.length - max;
  const ring = "ring-2 ring-[var(--bn-surface,#fff)]";
  return (
    <span className={cn("inline-flex items-center", className)}>
      {people.slice(0, max).map((p, i) => (
        <Avatar key={p.name} {...p} size={size} className={cn(ring, i > 0 && s.overlap)} />
      ))}
      {hidden > 0 ? (
        <span
          role="img"
          aria-label={`and ${hidden} more`}
          className={cn("inline-grid shrink-0 place-items-center bg-bn-grey-light font-medium text-bn-heavy", s.box, s.text, s.overlap, ring)}
        >
          <span aria-hidden>+{hidden}</span>
        </span>
      ) : null}
    </span>
  );
};
