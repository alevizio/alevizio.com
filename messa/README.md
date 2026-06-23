# Messa — Case Study

A long-form, scroll-driven case study of the **Messa** landing page — the AI hiring copilot that helps teams *see talent clearly*.

**Live → [messa.alevizio.com](https://messa.alevizio.com)**

This isn't a slide deck with screenshots pasted in. The whole story is rebuilt natively: a warm, hand-drawn paper world — an isometric cream "hiring factory" — recreated in code so every artifact on the page is the real, interactive thing. You can grab the sliders, step through the flows, scrub the build, and read the source. That's the point: a case study about craft, made with craft.

---

## What's inside

The page walks through the design and build of the Messa landing page, chapter by chapter:

- **The living factory hero** — the isometric paper factory animated in-browser (clouds, conveyor, layered scenes), not a captured frame.
- **Interactive how-it-works stepper** — the actual product walkthrough, steppable, the way it ships on the real site.
- **Booking-modal walkthrough** — the demo-request flow recreated step by step, so the interaction reads as it feels.
- **Design-system breakdowns** — button anatomy and a live button lab, glass-nav anatomy, the brand palette, a typography contact sheet, and an icon wall — the tokens and components laid bare.
- **"Underneath" core sample** — a dig through the strata of the build with animated stats counting up as you reach them.
- **Deploy timelapse** — a scrubbable timeline of the page coming together, frame by frame.
- **Reconstructed Slack thread** — the client conversation that shaped key calls, rebuilt natively so the decisions stay in context.

Plus compare sliders, motion studies, concept galleries, and a founder letter — each section is its own component, with media tracked through a single `case-study-media.ts` manifest.

---

## Craft notes

- **Everything is native and interactive.** No image of a UI where a real UI could live. Sliders slide, steppers step, stats animate, the build scrubs.
- **A hand-drawn paper aesthetic** — paper texture, warm cream tones, an isometric world with its own internal rules (`world.ts`, `world-rules.tsx`).
- **Motion that respects the reader** — `prefers-reduced-motion` honored throughout, with a performance mode for heavier scenes.
- **Built section-per-component** so the page reads as a sequence of self-contained, reviewable pieces.

---

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4**
- `@formkit/auto-animate` for list/layout transitions, `lucide-react` for icons
- Deploys to its own subdomain on Vercel

The case study lives at the root route inside the `(messa)` route group: `src/app/(messa)/`.

---

## Run it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

---

## Status

Currently **unlisted (noindex)** until the client launch. The Messa brand and product belong to Messa; this repository is Alejandro Vizio's write-up of the design and engineering work behind their landing page.
