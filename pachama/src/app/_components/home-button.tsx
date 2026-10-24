"use client";

import { useEffect, useState } from "react";
import { MdHome } from "react-icons/md";
import { cn } from "./cn";

/** Back to the hero: a small round button at the bottom right, there once
 *  the hero is scrolled past, gliding back up (straight up, with less motion). */
export const HomeButton = () => {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setShown(window.scrollY > window.innerHeight * 0.8);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return (
    <button
      type="button"
      aria-label="Back to the top"
      aria-hidden={!shown || undefined}
      tabIndex={shown ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className={cn(
        "fixed right-4 bottom-4 z-40 grid size-11 place-items-center rounded-full bg-[#0e1b14]/75 text-white shadow-[0_8px_24px_rgb(0_0_0/0.25)] ring-1 ring-white/25 backdrop-blur-md transition-[opacity,translate] duration-300 hover:bg-[#0e1b14]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#157a41] sm:right-6 sm:bottom-6",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <MdHome aria-hidden className="size-5" />
    </button>
  );
};
