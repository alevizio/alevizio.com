import {
  BLUR_FOCUS_CLIP,
  CLAW_CABINET_CLIP,
  CONCEPT_BLOCKS,
  FLOW_RAIN_CLIP,
  PIPELINE_SIGNAL_CLIP,
  SECOND_WAVE,
  imageItems,
  type ConceptBlock,
  type MotionClip,
} from "./case-study-media";
import { cn } from "./cn";
import { HorizontalGallery } from "./horizontal-gallery";
import { InViewVideo } from "./in-view-video";

const SubHeading = ({ children }: { children: string }) => (
  <h3 className="story-serif text-xl tracking-tight text-[#0A0A0B]">
    {children}
  </h3>
);

const ConceptSection = ({ concept }: { concept: ConceptBlock }) => (
  <section>
    <div className="mx-auto max-w-3xl px-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <SubHeading>{concept.name}</SubHeading>
        <p
          className={cn(
            "rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-widest",
            concept.won
              ? "border-[#5A6B8F] bg-[#5A6B8F] text-white"
              : "border-[#E8D9C5] bg-white text-[#6E6B68]",
          )}
        >
          {concept.verdict}
        </p>
      </div>
      <p className="mt-2 font-mono text-xs text-[#6E6B68]">
        &ldquo;{concept.tagline}&rdquo;
      </p>
      <p className="mt-4 text-base leading-7 text-[#6E6B68]">
        {concept.story}
      </p>
    </div>
    {concept.clip && (
      <figure className="mx-auto mt-8 max-w-5xl px-6">
        <InViewVideo
          src={concept.clip.src}
          poster={concept.clip.poster}
          width={concept.clip.width}
          height={concept.clip.height}
          label={concept.clip.label}
          className="rounded-xl border border-[#E8D9C5] bg-white"
        />
        <figcaption className="mt-3 text-sm leading-6">
          <span className="text-[#0A0A0B]">{concept.clip.title}</span>{" "}
          <span className="text-[#6E6B68]">— {concept.clip.caption}</span>
        </figcaption>
      </figure>
    )}
    <div className="mx-auto mt-8 max-w-5xl px-6">
      <HorizontalGallery
        items={imageItems(concept.images, "wide")}
        label={`${concept.name} concept screenshots`}
      />
    </div>
  </section>
);

/* The second-wave hero prototypes, each shown in motion (client call
 * 2026-06-12: show the options as videos, not just screens). Skill Sets
 * never got a capture, so it stays in the stills strip below. */
const SECOND_WAVE_CLIPS: readonly MotionClip[] = [
  FLOW_RAIN_CLIP,
  PIPELINE_SIGNAL_CLIP,
  CLAW_CABINET_CLIP,
  BLUR_FOCUS_CLIP,
];

const ClipCard = ({ clip }: { clip: MotionClip }) => (
  <figure>
    {/* Dark clips (the Claw) are matted — inset on a white card — so they
     * read as a framed screen, not a hole in the cream grid. */}
    {clip.mat ? (
      <div className="rounded-xl border border-[#E8D9C5] bg-white p-3 sm:p-4">
        <InViewVideo
          src={clip.src}
          poster={clip.poster}
          width={clip.width}
          height={clip.height}
          label={clip.label}
          className="rounded-md"
        />
      </div>
    ) : (
      <InViewVideo
        src={clip.src}
        poster={clip.poster}
        width={clip.width}
        height={clip.height}
        label={clip.label}
        className="rounded-xl border border-[#E8D9C5] bg-white"
      />
    )}
    <figcaption className="mt-3 text-sm leading-6">
      <span className="text-[#0A0A0B]">{clip.title}</span>{" "}
      <span className="text-[#6E6B68]">— {clip.caption}</span>
    </figcaption>
  </figure>
);

/**
 * The March concept work: the three day-one concepts with their verdicts,
 * the second wave led by the Flow capture in motion, and the first
 * complete redesign.
 */
export const ConceptGallery = ({ className }: { className?: string }) => (
  <div className={cn("space-y-20", className)}>
    {CONCEPT_BLOCKS.map((concept) => (
      <ConceptSection key={concept.name} concept={concept} />
    ))}

    <section>
      <div className="mx-auto max-w-3xl px-6">
        <SubHeading>The second wave</SubHeading>
        <p className="mt-4 text-base leading-7 text-[#6E6B68]">
          The machine won the argument, not the page. The next five days were
          a second wave of hero prototypes chasing &ldquo;see talent
          clearly&rdquo; — each a working route, judged in motion.
        </p>
      </div>
      {/* The prototypes, each as a video — shown large (client call
       * 2026-06-12: a bit bigger). */}
      <div className="mx-auto mt-8 grid max-w-6xl gap-x-8 gap-y-10 px-6 sm:grid-cols-2">
        {SECOND_WAVE_CLIPS.map((clip) => (
          <ClipCard key={clip.src} clip={clip} />
        ))}
      </div>
      {/* The swings that stayed stills: Skill Sets + the focus experiments. */}
      <div className="mx-auto mt-10 max-w-5xl px-6">
        <HorizontalGallery
          items={imageItems(SECOND_WAVE.slice(4))}
          label="Skill Sets and the blur-to-focus experiments"
        />
      </div>
    </section>

  </div>
);
