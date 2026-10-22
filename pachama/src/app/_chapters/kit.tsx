import { ButtonSet } from "../_components/kit/buttons";
import { CardSet } from "../_components/kit/cards";
import { ChipSet } from "../_components/kit/chips";
import { BaselineChart, OrdersTable, StatCards } from "../_components/kit/data";
import { FeedbackSet } from "../_components/kit/feedback";
import { FieldSet } from "../_components/kit/fields";
import { MapWidget } from "../_components/kit/map-widget";
import { AppShell } from "../_components/kit/navigation";
import { Tokens } from "../_components/kit/tokens";
import { Band, ChapterDivider, Section } from "../_components/story";

/* III · The kit, on the product's light grey: the UI elements Alejandro
 * built for Pachama, rebuilt in code and working. First put together as the
 * product's frame, then family by family. The originals live in Pachama's
 * codebase. */
export const Kit = () => (
  <Band tone="paper" className="border-t border-rule">
    <ChapterDivider id="kit" numeral="III" title="The kit">
      Every piece the product is built from, designed once and used everywhere: the site, the marketplace and the&nbsp;maps.
      Rebuilt in code for this case study, and working; the originals live in Pachama&rsquo;s&nbsp;codebase.
    </ChapterDivider>

    <Section
      id="kit-all"
      eyebrow="All together"
      title="The product's frame, working"
      text="The top bar, the side nav with its account switcher, and a project page with its tabs. Click around."
    >
      <AppShell />
    </Section>

    <Section id="foundations" eyebrow="Foundations" title="Colour, type, corners and depth">
      <Tokens />
    </Section>

    <Section id="controls" eyebrow="Controls" title="Buttons, fields, chips and toggles" text="Every variant and size, and fields that answer back.">
      <div className="grid gap-6">
        <ButtonSet />
        <FieldSet />
        <ChipSet />
      </div>
    </Section>

    <Section
      id="data"
      eyebrow="Data"
      title="Numbers, charts and tables"
      text="The totals are the ones on How&How's billboard. The chart's values and the orders are sample data."
    >
      <div className="grid gap-6">
        <StatCards />
        <div className="grid gap-6 xl:grid-cols-2">
          <BaselineChart />
          <OrdersTable />
        </div>
      </div>
    </Section>

    <Section
      id="cards"
      eyebrow="Cards"
      title="Projects and certificates"
      text="Two real projects as the marketplace lists them, and the certificate a buyer keeps. The buyer is a sample."
    >
      <CardSet />
    </Section>

    <Section
      id="map-kit"
      eyebrow="Map controls"
      title="Layers, a legend and the time slider"
      text="Drag the years: forest loss piles up in the control area while the project holds, which is how a dynamic baseline reads. The areas and the loss are illustrative, over satellite imagery of the Ucayali, in Peru."
    >
      <MapWidget />
    </Section>

    <Section
      id="states"
      eyebrow="Feedback and states"
      title="Toasts, dialogs, loaders and empty pages"
      text="A toast to confirm, a dialog to ask, the loader while an evaluation runs, and the empty Orders page."
    >
      <FeedbackSet />
    </Section>
  </Band>
);
