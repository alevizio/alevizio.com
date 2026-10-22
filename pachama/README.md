# Pachama case study

Alejandro Vizio's Pachama case study, set up like `messa/` and `pausa/` (Next.js 16, its own Vercel project once it ships, at pachama.alevizio.com).

Local only for now: `npm install`, then `npm run dev`.

## Fonts

The page uses Pachama's licensed type: Chromatic Condensed (Colophon) and Matter / Matter Mono (Displaay). The files are not in git (this repo is public). Before building, copy the web fonts into `src/fonts/`:

```sh
F=~/Library/CloudStorage/Dropbox/Pachama/Fonts
cp "$F"/colophon-order-46435/chromatic/web/pro/chromatic-condensed-{medium,bold}-pro.woff2 src/fonts/
cp "$F"/DP_order_205557/WEB/Matter-{Regular,Medium,Bold}.woff2 "$F"/DP_order_205557/WEB/MatterMono-{Regular,Medium}.woff2 src/fonts/
```
