import type { ReactNode } from "react";
import { MdAdd, MdArrowForward, MdDownload, MdEdit } from "react-icons/md";
import { cn } from "../cn";
import { Button } from "./button";
import { Avatar, AvatarGroup } from "./data-display/avatar";
import { Badge, InsightBadge, PassBadge } from "./data-display/badge";
import { Tag } from "./data-display/tag";
import { IconButton } from "./forms/icon-button";

/* The kit's smallest pieces on a slow belt, two rows passing each other:
 * buttons, badges, tags, avatars. A picture of them (the working ones are
 * in their families), so it's inert; pointing at it stops the belt, and
 * with less motion it stands still. */
const PEOPLE = [
  { name: "Alejandro Vizio", initials: "AV" },
  { name: "Acme Co.", initials: "AC" },
  { name: "Pachama", mark: "/brand/symbol-dark.svg" },
  { name: "A member", initials: "LM" },
];

const UPPER: ReactNode[] = [
  <Button key="buy">Buy credits</Button>,
  <Badge key="available" tone="success">Available</Badge>,
  <Tag key="redd" label="REDD+" size="sm" />,
  <Button key="visit" hierarchy="secondary">Visit project</Button>,
  <PassBadge key="pass" />,
  <Avatar key="av" size="sm" name="Alejandro Vizio" initials="AV" />,
  <Button key="small" tint="monochrome" size="sm">Small</Button>,
  <Badge key="pending" tone="warning">Pending</Badge>,
  <IconButton key="add" label="Add a project" icon={<MdAdd aria-hidden />} />,
  <Tag key="brazil" label="Brazil" />,
  <InsightBadge key="insight" />,
  <Button key="report" hierarchy="tertiary" icon={<MdDownload aria-hidden className="size-5" />}>Report</Button>,
];
const LOWER: ReactNode[] = [
  <Badge key="new" tone="heavy">New</Badge>,
  <Button key="large" size="lg">Large</Button>,
  <AvatarGroup key="group" people={PEOPLE} max={3} />,
  <Tag key="arr" label="ARR" size="sm" />,
  <Button key="delete" tint="destructive" size="sm">Delete</Button>,
  <PassBadge key="exception" exception="With an exception" />,
  <IconButton key="edit" label="Edit" icon={<MdEdit aria-hidden />} look="monochrome" />,
  <Badge key="expired" tone="error">Expired</Badge>,
  <Button key="next" hierarchy="secondary" icon={<MdArrowForward aria-hidden className="size-5" />} iconPosition="trailing">Next</Button>,
  <Tag key="vcs" label="Verified Carbon Standard" />,
  <Avatar key="mark" size="md" name="Pachama" mark="/brand/symbol-dark.svg" />,
  <Badge key="draft">Draft</Badge>,
];

// Two copies side by side, each with its gap after it, so half the width
// is exactly one copy and the loop has no seam.
const Belt = ({ items, reverse = false }: { items: ReactNode[]; reverse?: boolean }) => (
  <div className={cn("flex w-max motion-safe:animate-[belt_70s_linear_infinite] group-hover/belt:[animation-play-state:paused]", reverse && "[animation-direction:reverse]")}>
    {[0, 1].map((copy) => (
      <div key={copy} className="flex shrink-0 items-center gap-5 pr-5">
        {items}
      </div>
    ))}
  </div>
);

export const Ticker = ({ className }: { className?: string }) => (
  <figure className={cn("group/belt min-w-0", className)}>
    <figcaption className="sr-only">Banyan&rsquo;s buttons, badges, tags and avatars, passing on two rows.</figcaption>
    <div aria-hidden inert className="grid gap-5 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
      <Belt items={UPPER} />
      <Belt items={LOWER} reverse />
    </div>
  </figure>
);
