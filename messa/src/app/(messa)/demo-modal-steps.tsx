import { RequestDemoInline } from "./messa-product/demo-modal";

/**
 * The custom "Request a demo" booking modal — rebuilt natively and embedded
 * live in the page (client direction 2026-06-19, replacing the incomplete
 * screen recording, then the open-on-click button). The real in-house modal is
 * ported from messa-landing with its network + analytics stubbed, and rendered
 * inline so the whole flow is walkable in place: qualify → flip calendar →
 * details → "you're all set" — no clicking a trigger first.
 */
export const DemoModalSteps = ({ className }: { className?: string }) => (
  <section className={className} aria-label="The Request-a-demo booking modal">
    <div className="mx-auto max-w-5xl px-6">
      <h3 className="story-serif text-2xl tracking-tight text-[#0A0A0B]">
        The booking modal — walk the whole thing
      </h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-[#6E6B68]">
        &ldquo;Request a demo&rdquo; opens a custom modal — built in-house, not
        an embedded widget. The real flow, live right here: qualify, pick a time
        on the flip calendar, your details, then you&apos;re all set.
      </p>
    </div>
    <RequestDemoInline className="mt-8 px-6" />
  </section>
);
