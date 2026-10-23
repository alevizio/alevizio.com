# Pachama case study

Alejandro Vizio's Pachama case study, set up like `messa/` and `pausa/`: Next.js 16, with its own Vercel project (`alevizio-com-pachama`, root directory `pachama`) serving pachama.alevizio.com.

To run it: `npm install`, then `npm run dev`.

## Fonts

The page uses Pachama's licensed type: Chromatic Condensed (Colophon) and Matter / Matter Mono (Displaay). The files are not in git (this repo is public). Locally, copy the web fonts into `src/fonts/`:

```sh
F=~/Library/CloudStorage/Dropbox/Pachama/Fonts
cp "$F"/colophon-order-46435/chromatic/web/pro/chromatic-condensed-{medium,bold}-pro.woff2 src/fonts/
cp "$F"/DP_order_205557/WEB/Matter-{Regular,Medium,Bold}.woff2 "$F"/DP_order_205557/WEB/MatterMono-{Regular,Medium}.woff2 src/fonts/
```

On Vercel, `npm run build` first runs `scripts/fetch-fonts.mjs`, which pulls the same seven files from the project's private Blob store (`pachama-fonts`, under `fonts/`) when `src/fonts/` is missing. To replace a font there, upload it with the store's read-write token:

```sh
vercel blob put src/fonts/Matter-Regular.woff2 --pathname fonts/Matter-Regular.woff2 --access private --allow-overwrite --rw-token "$BLOB_READ_WRITE_TOKEN"
```
