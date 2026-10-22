"use client";

import manoaMap from "@/assets/kit/manoa-map.jpg";
import Image from "next/image";
import { useId, useRef, useState, type ReactNode } from "react";
import { MdChevronRight, MdMoreHoriz, MdOutlineAnalytics, MdOutlineAssignment } from "react-icons/md";
import { cn } from "../../cn";
import { Button } from "../button";
import { BN } from "../ui";
import { CardFrame, CountryRow, StatusBadge } from "./card-parts";
import { MANOA } from "./content";

/* The marketplace's project card, with Manoa in it: map, facts, the
 * evaluation it passed, and the way into its dashboard. The ··· menu works. */
const Row = ({ icon, label, children }: { icon: ReactNode; label: string; children?: ReactNode }) => (
  <a href="#project" className={cn("flex items-center gap-4 rounded-[16px] border border-bn-grey-light/60 p-3 hover:bg-bn-grey-lightest", BN.focus)}>
    <span className="flex items-center gap-1 text-[14px] leading-5 font-medium text-bn-heavy">
      {icon}
      {label}
    </span>
    <span className="ml-auto">{children ?? <MdChevronRight aria-hidden className="size-5 text-bn-medium" />}</span>
  </a>
);

// A disclosure, not an ARIA menu: two plain links. Escape or leaving it
// closes it; Escape hands focus back to the button.
const Options = () => {
  const [open, setOpen] = useState(false);
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  return (
    <span
      className="relative"
      onKeyDown={(e) => {
        if (e.key !== "Escape" || !open) return;
        setOpen(false);
        button.current?.focus();
      }}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
    >
      <button
        ref={button}
        type="button"
        aria-label={`More about ${MANOA.name}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={cn("grid size-8 place-items-center rounded-[8px] border border-bn-medium text-bn-heavy hover:bg-bn-grey-lightest", BN.focus)}
      >
        <MdMoreHoriz aria-hidden className="size-4" />
      </button>
      <span id={id} hidden={!open} className="absolute top-10 right-0 z-10 w-48 rounded-[12px] border border-bn-grey-light bg-white p-1 shadow-[0_8px_24px_rgb(14_37_23/0.12)]">
        {["See the evaluation", "See the map"].map((label) => (
          <a key={label} href="#project" className={cn("block rounded-[8px] px-3 py-2 text-[14px] text-bn-heavy hover:bg-bn-green-lightest", BN.focus)}>
            {label}
          </a>
        ))}
      </span>
    </span>
  );
};

export const ProjectCard = ({ className }: { className?: string }) => (
  <CardFrame className={className}>
    <Image src={manoaMap} alt={`${MANOA.name}'s reference region outlined on satellite imagery`} sizes="380px" className="h-[213px] w-full object-cover" />
    <div className="flex flex-col gap-4 p-8">
      <div>
        <CountryRow country={MANOA.country} area={MANOA.area}>
          <Options />
        </CountryRow>
        <h4 className="font-display text-[36px] leading-[44px] font-medium text-bn-heavy">{MANOA.name}</h4>
        <p className="text-[16px] leading-6 font-medium text-bn-heavy">{MANOA.type}</p>
        <p className="mt-2 text-[14px] leading-5 text-bn-heavy">{MANOA.about}</p>
        <p className="mt-2 text-[16px] leading-6 font-medium text-bn-heavy">{MANOA.registry}</p>
        <p className="text-[12px] leading-4 text-bn-medium">Registry ID: {MANOA.registryId}</p>
      </div>
      <Row icon={<MdOutlineAssignment aria-hidden className="size-6" />} label="View evaluation">
        <StatusBadge>Pass</StatusBadge>
      </Row>
      <Row icon={<MdOutlineAnalytics aria-hidden className="size-6" />} label="View carbon monitoring" />
      <Button hierarchy="secondary" className="w-full">
        See project dashboard
      </Button>
    </div>
  </CardFrame>
);
