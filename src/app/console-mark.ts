// The AV mark for whoever opens the console: logo-mark.ts's resting drawing
// traced into / \ and _ (its edges run at 60°, -60° and flat), eleven rows.
const MARK = [
  "         ____            ___",
  "        /\\   \\          /\\  \\",
  "       /  \\   \\        /  \\___",
  "      /    \\   \\      /  /  /",
  "     /   \\  \\   \\    /  /  /",
  "    /   / \\/ \\   \\  /  /  /",
  "   /   /  /\\  \\   \\/  /  /",
  "  /   /  /  \\  \\  \\  /  /",
  " /   /  /    \\  \\/  /  /",
  "/   /  /      \\    /  /",
  "\\  /  /        \\  /  /",
  " \\___/          \\___/",
].join("\n");

// The build drops console.* calls (terser drop_console); this one is meant to
// ship, so it goes through globalThis, which the drop doesn't match.
export const logConsoleMark = () => {
  const { console: out } = globalThis;
  out.log(`%c${MARK}`, "font-family: ui-monospace, Menlo, monospace; line-height: 1.2");
  out.log("let's make something meaningful → viziomas@gmail.com");
};
