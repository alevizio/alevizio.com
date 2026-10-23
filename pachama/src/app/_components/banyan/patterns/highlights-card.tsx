"use client";

import corredores03 from "@/assets/banyan/photos/corredores-03.jpg";
import corredores19 from "@/assets/banyan/photos/corredores-19.jpg";
import corredores26 from "@/assets/banyan/photos/corredores-26.jpg";
import corredores31 from "@/assets/banyan/photos/corredores-31.jpg";
import Image from "next/image";
import { useState } from "react";
import { MdArrowLeft, MdArrowRight, MdChevronRight } from "react-icons/md";
import { cn } from "../../cn";
import { BN } from "../ui";
import { CardFrame } from "./card-parts";

/* A project's highlights, paged: a glass title over the photo, and the
 * pager along the bottom. Corredores de Vida on the ground, in photos the
 * chapter In the world doesn't show; photos Pachama. */
const SLIDES = [
  { src: corredores03, alt: "A bird on a shrub above the tall grass" },
  { src: corredores19, alt: "The lake's marshy edge, a bird crossing the sky" },
  { src: corredores26, alt: "A tractor opening rows for planting" },
  { src: corredores31, alt: "Cattle grazing beside the forest and the lake" },
];

export const HighlightsCard = ({ className }: { className?: string }) => {
  const [i, setI] = useState(0);
  const go = (step: number) => setI((n) => Math.min(SLIDES.length - 1, Math.max(0, n + step)));

  return (
    <CardFrame className={className}>
      <div className="relative">
        <Image src={SLIDES[i].src} alt={SLIDES[i].alt} sizes="380px" className="h-[213px] w-full object-cover" />
        <p className="absolute inset-x-0 top-0 flex items-center gap-2 bg-bn-heavy/20 px-8 py-4 text-[24px] leading-8 font-bold text-white backdrop-blur-[25px]">
          Highlights <MdChevronRight aria-hidden className="size-6" />
        </p>
      </div>
      <div className="p-8">
        <h4 className="text-[16px] leading-6 font-medium text-bn-heavy">Corredores de Vida</h4>
        <p className="text-[14px] leading-5 text-bn-heavy" aria-live="polite">
          {SLIDES[i].alt}.
        </p>
        <nav aria-label="Highlights" className="mt-6 flex items-center gap-4 border-t border-bn-grey-lightest pt-4">
          <span className="text-[12px] leading-4 text-bn-medium">
            {i + 1}/{SLIDES.length}
          </span>
          <span aria-hidden className="flex gap-4">
            {SLIDES.map((s, n) => (
              <span key={s.alt} className={cn("size-2 rounded-full", n === i ? "bg-bn-heavy" : "bg-bn-grey-light")} />
            ))}
          </span>
          <span className="ml-auto flex gap-4">
            {[
              { step: -1, label: "Previous highlight", Icon: MdArrowLeft, off: i === 0 },
              { step: 1, label: "Next highlight", Icon: MdArrowRight, off: i === SLIDES.length - 1 },
            ].map(({ step, label, Icon, off }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                disabled={off}
                onClick={() => go(step)}
                className={cn("grid size-10 place-items-center rounded-[8px] border border-bn-medium/40 text-bn-heavy hover:bg-bn-grey-lightest disabled:opacity-40", BN.focus)}
              >
                <Icon aria-hidden className="size-6" />
              </button>
            ))}
          </span>
        </nav>
      </div>
    </CardFrame>
  );
};
