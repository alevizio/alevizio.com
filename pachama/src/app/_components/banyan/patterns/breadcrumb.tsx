import { Fragment } from "react";
import { MdChevronRight } from "react-icons/md";
import { cn } from "../../cn";

/* Banyan's breadcrumb: underlined Matter 16 links, mint on hover, a 1px
 * heavy box on focus, grey when disabled; the current page plain and
 * medium. Three separators: slash, dash and an icon. */
type Separator = "slash" | "dash" | "icon";
export type Crumb = { label: string; href?: string; disabled?: boolean };

const crumbLink = cn(
  "rounded-[4px] border border-transparent px-1 text-[16px] leading-6 underline decoration-from-font underline-offset-[3px]",
  "hover:bg-bn-green-lightest focus-visible:border-bn-heavy focus-visible:outline-none",
);

const Sep = ({ type }: { type: Separator }) =>
  type === "icon" ? (
    <MdChevronRight aria-hidden className="size-4 text-bn-heavy" />
  ) : (
    <span aria-hidden className="text-[16px] leading-6 text-bn-heavy">
      {type === "slash" ? "/" : "-"}
    </span>
  );

export const Breadcrumb = ({ items, separator = "slash", label = "Breadcrumb", className }: { items: Crumb[]; separator?: Separator; label?: string; className?: string }) => (
  <nav aria-label={label} className={className}>
    <ol className="flex flex-wrap items-center gap-1">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={c.label}>
            <li className="flex items-center">
              {last ? (
                <span aria-current="page" className="px-1 text-[16px] leading-6 font-medium text-bn-heavy">
                  {c.label}
                </span>
              ) : c.disabled ? (
                <a aria-disabled="true" className={cn(crumbLink, "pointer-events-none text-bn-light")}>
                  {c.label}
                </a>
              ) : (
                <a href={c.href} className={cn(crumbLink, "text-bn-heavy")}>
                  {c.label}
                </a>
              )}
            </li>
            {last ? null : (
              <li aria-hidden className="flex items-center">
                <Sep type={separator} />
              </li>
            )}
          </Fragment>
        );
      })}
    </ol>
  </nav>
);
