/* Banyan's look, shared by every family: the focus ring for anything that
 * isn't a button, and a group label. The eggshell ground (and the surface
 * pressed buttons cut back to) comes from the chapter's band. */
export const BN = {
  focus: "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bn-heavy",
  label: "text-[13px] font-medium text-bn-medium",
} as const;
