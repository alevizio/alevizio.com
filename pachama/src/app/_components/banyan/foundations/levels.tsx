"use client";

import aerial from "@/assets/banyan/photos/corredores-07.jpg";
import Image from "next/image";
import { useState } from "react";
import { cn } from "../../cn";
import { Button } from "../button";

/* Banyan's background levels, laid out like its documentation's example:
 * a sidebar on level 2, the page on level 0, cards on level 1, a card on
 * level 4 over a photograph, and a drawer on level 3 that frosts whatever
 * it covers. */
const Tag = ({ name, level, onDark = false }: { name: string; level: string; onDark?: boolean }) => (
  <p className={cn("leading-tight", onDark ? "text-white" : "text-bn-heavy")}>
    <span className="block text-[14px] font-medium">{name}</span>
    <span className={cn("block font-mono text-[12px]", onDark ? "text-white/85" : "text-bn-medium")}>{level}</span>
  </p>
);

const Card = ({ className }: { className?: string }) => (
  <div className={cn("h-24 rounded-[12px] border border-bn-grey-light bg-white/30 p-4", className)}>
    <Tag name="Card" level="level-1" />
  </div>
);

export const Levels = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className={cn("w-full", className)}>
      <div className="relative grid min-h-[26rem] overflow-hidden rounded-[12px] border border-bn-grey-light bg-bn-eggshell sm:grid-cols-[11rem_1fr]">
        <div className="hidden bg-bn-glass-2/30 p-4 sm:block">
          <Tag name="Sidebar" level="level-2" />
        </div>
        <div className="grid content-start gap-4 p-4 sm:p-6">
          <Tag name="Background" level="level-0" />
          <Card />
          <div className="relative grid h-32 grid-cols-2 overflow-hidden rounded-[12px]">
            <Image src={aerial} alt="" fill sizes="(min-width: 1376px) 1100px, 90vw" className="object-cover" />
            <div className="relative bg-bn-glass-4/80 p-4 backdrop-blur-xl">
              <Tag name="Card" level="level-4" onDark />
            </div>
          </div>
          <Card />
        </div>
        {open ? (
          <div id="banyan-drawer" className="absolute inset-y-3 right-3 w-[46%] max-w-64 rounded-[12px] bg-bn-glass-3/30 p-4 backdrop-blur-2xl">
            <Tag name="Drawer" level="level-3" />
          </div>
        ) : null}
      </div>
      <Button hierarchy="secondary" size="sm" aria-controls="banyan-drawer" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="mt-4">
        {open ? "Close the drawer" : "Open the drawer"}
      </Button>
    </div>
  );
};
