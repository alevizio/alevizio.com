/** Bind the last two words with a non-breaking space, so no line ends on a lone word. */
export const tidy = (text: string) => text.replace(/ (\S+)$/, " $1");
