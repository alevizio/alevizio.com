import { twMerge } from "tailwind-merge";

/** Join class names, skipping falsy ones. When two set the same thing the
 *  later one wins, so a className passed in can override a default. */
export const cn = (...classes: (string | false | null | undefined)[]) => twMerge(...classes);
