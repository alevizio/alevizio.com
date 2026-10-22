/* Banyan's look, shared by every family: the eggshell panel its docs set
 * components on, which also tells pressed buttons what to cut back to; the
 * focus ring for anything that isn't a button; a group label. */
export const BN = {
  panel: "rounded-[16px] border border-bn-grey-light bg-bn-eggshell [--bn-surface:var(--color-bn-eggshell)]",
  focus: "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bn-heavy",
  label: "text-[13px] font-medium text-bn-medium",
} as const;
