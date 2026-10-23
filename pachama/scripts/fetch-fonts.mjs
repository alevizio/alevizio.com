/* Pachama's fonts are licensed, so they stay out of this public repo
 * (src/fonts is ignored). Locally they are copied in by hand; see the README.
 * A Vercel build starts without them, so this pulls them from the project's
 * private Blob store, which the build reaches with BLOB_READ_WRITE_TOKEN. */
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { get, list } from "@vercel/blob";

const DIR = new URL("../src/fonts/", import.meta.url);

if (!existsSync(DIR)) {
  const { blobs } = await list({ prefix: "fonts/" });
  await mkdir(DIR);
  for (const { pathname } of blobs) {
    const font = await get(pathname, { access: "private" });
    await writeFile(new URL(pathname.slice("fonts/".length), DIR), font.stream);
  }
  console.log(`Fetched ${blobs.length} fonts from the Blob store.`);
}
