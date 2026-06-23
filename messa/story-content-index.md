# Messa case study — content index (shipped structure)

The reorganized `/story`, in render order. Source: `src/app/story/page.tsx`.
Six chapter dividers (Intro is the hero — no divider). Anchors are the nav targets.

---

## Intro  *(hero, no divider)*
- Hero — eyebrow, MESSA logo (h1), intro line, "Visit the live site", project meta
- Trailer clip (`TRAILER_CLIP`)

## I · Brief
- `#brief` — A product education, not a design briefing (+ 4 brief directives)
- `#setup` — The front door for every deal (the stakes)

## II · Explorations
- `#concepts` — Two concepts, one survivor → `ConceptGallery`
- `#pipeline-to-factory` — From pipeline to factory (iso clip + deploy stills)
- `#backgrounds` — Trying on worlds (matrix counts) → `PipelineWorlds`

## III · Art direction
- `#typography` — Typography → `TypographyContactSheet`
- `#color` — Color → `BrandPalette`
- `#icons` — Icons → `IconWall`
- `#illustrations` — A hand-drawn isometric world (people, objects, "part nobody built", sky, backdrops + butterflies)
- `#ui` — The interface kit → Buttons (`ButtonLab`) · Stepper (`StepperLab`) · **Pills** (native specimen) · Nav (`NAV_DETAIL`) · component close-ups (`UI_DETAILS`)

## IV · The website
- `#hero` — The hero, one layer at a time (`FactoryLayers`)
  - Animation by attrition (the hero's animation story — `HERO_ANIMATION`)
  - The tools behind the world (`BREAKDOWN_TOOLS`)
- `#texture` — The paper, frozen (compare sliders + tile)
- `#motion` — Motion & interaction (dig clip + `MotionStudies`)
- `#typewriter` — The letter that types itself (`TypewriterLetter` + four-rounds trail)
- `#product` — Built into the workflow (`LiveProduct` — live product + underneath) + `StepShots`
- `#details` — The details → Request demo modal (`DemoModalSteps`) · **Login modal (TODO — no asset yet)** · OG images (`#the-card`)

## V · Underneath
- `#craft-index` — The craft index (`CRAFT_DETAILS`)
- `#the-bug` — The bug you could see (native button reconstruction)
- `#outcomes` — One intense hardening day (`HARDENING_STATS`)
- `#performance` — The performance war (`PERF_STATS`)
- `#mobile` — Mobile (prose; **TODO — add phone screenshots**)
- `#timelapse` — 759 commits, fifteen deploys (`TimelapseScrubber` + film + `ProductCommits` iceberg/shortlist)
- `#shipping` — The release runbook

## VI · Results
- `#process` — What the meetings actually changed (`PROCESS_BEATS`) + client quote*
- `#what-happened-next`* — gated, renders nothing until filled
- `#the-channel` — Meanwhile, in Slack (`SlackThread`)
- Closing — narrative + "three months of Tuesdays" ask + footer

---

\* Gated post-launch slots (`CLIENT_QUOTE`, `WHAT_HAPPENED_NEXT`) — render nothing until set.

### Open items needing your input
- **Login modal** — no capture/component exists; slot is stubbed (TODO comment in `#details`), not rendered, not in nav.
- **Mobile** — currently honest prose only; would be stronger with phone screenshots.
- **"Animation by tradition"** — interpreted as the existing **Animation by attrition** beat (chroma-key / shader / Rive reverts) moved under the hero. Confirm that's what you meant.
