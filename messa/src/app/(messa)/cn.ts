/** Minimal class joiner for conditional Tailwind classes. */
export const cn = (...classes: Array<string | false | undefined>): string =>
  classes.filter(Boolean).join(" ");
