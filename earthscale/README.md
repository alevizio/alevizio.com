# Earthscale case study

Alejandro Vizio's Earthscale case study, set up like `pachama/`, `messa/` and `pausa/`: Next.js 16, with its own Vercel project (`alevizio-com-earthscale`, root directory `earthscale`) serving earthscale.alevizio.com, linked from alevizio.com at `/work/earthscale`.

The story of the landing page designed for Earthscale in spring 2025: the site before, the brief and the wireframe, the imagery, the first lit pass and the hero that stayed, type, colour and the pieces, the page section by section and at four widths, the team page, and what happened after it shipped. The pictures are exports from the page's Figma; the type specimen and the palette are set live.

To run it: `npm install`, then `npm run dev`.

## Fonts

The page is set in PP Neue Machina (Pangram Pangram), a licensed font, and IBM Plex Mono, which is open and comes from Google Fonts through next/font. The Neue Machina files are not in git (this repo is public). Locally, copy the web fonts into `src/fonts/`:

```sh
cp ~/Documents/GitHub/unblock-pitch/fonts/PPNeueMachina-{Light,Regular,Ultrabold}.woff2 src/fonts/
```

On Vercel, `npm run build` first runs `scripts/fetch-fonts.mjs`, which pulls the same three files from the project's private Blob store (`earthscale-fonts`, under `fonts/`) when `src/fonts/` is missing. To put a font there, upload it with the store's read-write token:

```sh
vercel blob put src/fonts/PPNeueMachina-Regular.woff2 --pathname fonts/PPNeueMachina-Regular.woff2 --access private --rw-token "$BLOB_READ_WRITE_TOKEN"
```
