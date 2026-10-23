"use client";

import { useEffect } from "react";

/** How long a reveal takes, so a frame's clip can come off once it's open. */
const SETTLE_MS = 1600;

/** Marks each [data-reveal] with data-in as it scrolls into view (see
 *  globals.css). What's already on screen is marked before html.motion
 *  switches the hiding on, so nothing blinks on load; anything mounted
 *  later (a tab switched back, a panel opened) is watched the same way. */
export const MotionObserver = () => {
  useEffect(() => {
    const show = (el: Element, settled: boolean) => {
      el.setAttribute("data-in", "");
      if (settled) el.setAttribute("data-done", "");
      else window.setTimeout(() => el.setAttribute("data-done", ""), SETTLE_MS);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target, false);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const onScreen = (el: Element) => el.getBoundingClientRect().top < window.innerHeight;

    for (const el of document.querySelectorAll("[data-reveal]")) {
      if (onScreen(el)) show(el, true);
      else observer.observe(el);
    }
    // A section is reached once its top is a fifth of the way up the
    // window; until then its animations wait on their first frame (see
    // globals.css), so nothing plays out where no one sees it.
    const scenes = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-seen", "");
          scenes.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    for (const el of document.querySelectorAll("[data-scene]")) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.8) el.setAttribute("data-seen", "");
      else scenes.observe(el);
    }
    document.documentElement.classList.add("motion");

    // Mounted later: on screen, it plays after one frame of its hidden
    // state (so it animates rather than pops); off screen, it waits.
    const later = (el: Element) => {
      if (el.hasAttribute("data-in")) return;
      if (onScreen(el)) requestAnimationFrame(() => requestAnimationFrame(() => show(el, false)));
      else observer.observe(el);
    };
    const mutations = new MutationObserver((records) => {
      for (const record of records)
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches("[data-reveal]")) later(node);
          for (const el of node.querySelectorAll("[data-reveal]")) later(el);
        }
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      scenes.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
};
