"use client";

import { CircleCheck, ScanSearch, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../cn";
import { KitButton } from "./buttons";
import { UI } from "./ui";

/* Feedback and states, working: a toast, a dialog, the loader, and the empty
 * Orders page. */

/** A demo's frame: its name on top, the component at the bottom. */
const Demo = ({ label, className, children }: { label: string; className?: string; children: ReactNode }) => (
  <div className={cn(UI.card, "flex min-h-48 flex-col items-start justify-between p-6", className)}>
    <p className={UI.label}>{label}</p>
    {children}
  </div>
);

const Toast = () => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => setShown(false), 3500);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <Demo label="Toast" className="relative">
      <KitButton variant="dark" onClick={() => setShown(true)}>
        Retire 1,250 credits
      </KitButton>
      <div aria-live="polite" className="absolute bottom-4 right-4 left-4">
        {shown ? (
          <div className="flex items-center gap-3 rounded-[10px] bg-[#141a17] px-4 py-3 text-[14px] text-white shadow-[0_12px_32px_rgb(20_26_23/0.25)]">
            <CircleCheck aria-hidden className="size-5 fill-[#23854a] text-[#141a17]" />
            <span className="flex-1">1,250 credits retired</span>
            <button type="button" onClick={() => setShown(false)} aria-label="Dismiss" className={cn("rounded p-0.5", UI.focus)}>
              <X aria-hidden className="size-4" />
            </button>
          </div>
        ) : null}
      </div>
    </Demo>
  );
};

const Dialog = () => {
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();
  return (
    <Demo label="Dialog">
      <KitButton variant="outline" onClick={() => ref.current?.showModal()}>
        Download the report
      </KitButton>
      <dialog ref={ref} aria-labelledby="kit-dialog-title" className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-[12px] p-6 text-[#141a17] backdrop:bg-[#141a17]/40">
        <h4 id="kit-dialog-title" className="text-[20px] font-medium">Download the evaluation report</h4>
        <p className="mt-2 text-[14px] text-[#5f6b66]">Manoa, evaluation 2.0. Every check, its map and its chart, as a PDF.</p>
        <div className="mt-6 flex justify-end gap-3">
          <KitButton variant="ghost" onClick={close}>
            Cancel
          </KitButton>
          <KitButton onClick={close}>Download</KitButton>
        </div>
      </dialog>
    </Demo>
  );
};

const Loader = () => (
  <Demo label="Loader">
    <div role="status" className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element -- the brand's own SVG */}
      <img src="/brand/symbol-dark.svg" alt="" className="size-8 motion-safe:animate-spin motion-safe:[animation-duration:2.4s]" />
      <span className="text-[14px] text-[#3c4742]">Evaluating Manoa…</span>
    </div>
  </Demo>
);

const EmptyOrders = () => (
  <div className={cn(UI.card, "flex min-h-48 flex-col items-start p-6")}>
    <ScanSearch aria-hidden className="size-6 text-[#141a17]" />
    <p className="mt-3 text-[18px] font-medium text-[#141a17]">No orders yet</p>
    <p className="mt-1 text-[13px] text-[#5f6b66]">Check out our projects to buy credits and start offsetting your emissions!</p>
    <KitButton size="sm" variant="dark" className="mt-4">
      Explore projects
    </KitButton>
  </div>
);

export const FeedbackSet = () => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <Toast />
    <Dialog />
    <Loader />
    <EmptyOrders />
  </div>
);
