import { BanyanCover } from "../_components/banyan/cover";
import { DataDisplay } from "../_components/banyan/data-display";
import { Feedback } from "../_components/banyan/feedback";
import { Forms } from "../_components/banyan/forms";
import { Foundations } from "../_components/banyan/foundations";
import { MapKit } from "../_components/banyan/maps";
import { Media } from "../_components/banyan/media";
import { Overlay } from "../_components/banyan/overlay";
import { Patterns } from "../_components/banyan/patterns";
import { DocWall } from "../_components/banyan/wall";
import { Band, ChapterDivider, Section } from "../_components/story";

/* III · Banyan, the design system Alejandro designed for Pachama's products:
 * its Figma cover and every documentation page up top, then each family
 * rebuilt live from the Figma, in Banyan's own order. */
const COUNTS = [
  { value: "37", label: "documented pages" },
  { value: "261", label: "button variants" },
  { value: "1,310", label: "icons" },
  { value: "8", label: "colour ramps" },
];

export const Kit = () => (
  <Band tone="banyan" className="border-t border-rule">
    <ChapterDivider id="kit" numeral="III" title="Banyan">
      The design system behind Pachama&rsquo;s products. I designed it and documented every component in Figma; Pachama&rsquo;s engineers built
      the same components in code. Rebuilt here from the Figma, and&nbsp;working.
    </ChapterDivider>

    <Section
      id="kit-all"
      eyebrow="The system"
      title="One library, documented page by page"
      text="From getting started to the tooltip, every page of the documentation is below, side by side as the Figma lays them out. Each group jumps to its components."
    >
      <BanyanCover />
      <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {COUNTS.map(({ value, label }) => (
          <div key={label} className="border-t border-(--tone-line) pt-4">
            <dt className="type-label text-(--tone-label)">{label}</dt>
            <dd className="type-section mt-2 text-(--tone-head)">{value}</dd>
          </div>
        ))}
      </dl>
      <DocWall className="mt-10" />
    </Section>

    <Section id="foundations" eyebrow="Foundations" title="Type, colour and the levels things sit on">
      <Foundations />
    </Section>

    <Section
      id="patterns"
      eyebrow="Patterns"
      title="How a page is put together"
      text="Navigation, cards, graphs, accordions, steppers, breadcrumbs and tabs: the bigger pieces, built from the smaller ones."
    >
      <Patterns />
    </Section>

    <Section
      id="map-kit"
      eyebrow="Maps"
      title="Legends, tooltips, a player and pins"
      text="What sits on top of the satellite imagery: what a colour means, where the data comes from, and how a forest changed year by year."
    >
      <MapKit />
    </Section>

    <Section id="forms" eyebrow="Forms" title="Every control a form needs" text="Ten controls, from the button to the date picker, in the states the Figma documents.">
      <Forms />
    </Section>

    <Section id="data-display" eyebrow="Data display" title="Tables, tags, badges and avatars" text="How numbers, statuses and people show up.">
      <DataDisplay />
    </Section>

    <Section id="feedback" eyebrow="Feedback" title="Alerts, banners, progress and toasts" text="How the product answers back.">
      <Feedback />
    </Section>

    <Section id="overlay" eyebrow="Overlay" title="Menus, modals, popovers and tooltips" text="What opens on top of a page, and closes again with Escape.">
      <Overlay />
    </Section>

    <Section
      id="media"
      eyebrow="Media"
      title="Icons, by their Material names"
      text="Google's Material Icons, 1,310 of them in the Figma library. Banyan also carries the seventeen UN Sustainable Development Goals and a set of country flags."
    >
      <Media />
    </Section>
  </Band>
);
