import { FeedBoard } from "../_components/feed";
import { Spread } from "../_components/figure";
import { Loader } from "../_components/loader";
import { APP_SCREENS, APP_STORE, OOH } from "../_components/media";
import { Onboarding } from "../_components/onboarding";
import { ScreenStrip } from "../_components/screen-strip";
import { PenMark } from "../_components/pen-mark";
import { ChapterDivider, Section } from "../_components/story";

/* IV · In the world: the app (its onboarding, its screens, its loader),
 * the App Store, the feed and the street. */
export const InTheWorld = () => (
  <>
    <ChapterDivider id="world" numeral="IV" title="In the world">
      The system <PenMark>doing its job</PenMark>: in the app, in the store, on the feed and on the&nbsp;street.
    </ChapterDivider>

    <Section
      id="onboarding"
      eyebrow="The app · Onboarding"
      title="Three screens, three drawings"
      text="The three onboarding screens each carry their own drawing: the overthinker, the loop, the reader. One drawing, one idea, and the copy underneath does the rest."
    >
      <Onboarding />
    </Section>

    <Section
      id="app"
      eyebrow="The app · Five screens"
      title="The app, screen by screen"
      text="One highlight per screen; the rest is paper. Shown close to the size they are on a phone."
    >
      <ScreenStrip screens={APP_SCREENS} label="The Pausa app's screens" />
    </Section>

    <Section id="loader" eyebrow="The app · Loading" title="Reading you back" text="The loader names what is happening, in the app’s own verb, and its knot keeps changing while you wait.">
      <Loader />
    </Section>

    <Section
      id="app-store"
      eyebrow="App Store · Eleven slides"
      title="How it looks in the store"
      text="The deck is eleven artboards. The only view that matters is the product page on a phone, so they’re shown here near true size."
    >
      <ScreenStrip screens={APP_STORE} label="The eleven App Store slides" framed={false} />
    </Section>

    <Section
      id="feed"
      eyebrow="Ads · Digital"
      title="The call-out, on a feed"
      text="Pausa’s whole argument fits in one line, so the ad is one line: the call-out card lifted off the page it was written on. Same paper, same pen, nothing added to make it louder."
    >
      <FeedBoard />
    </Section>

    <Section id="street" eyebrow="Out of home" title="And on the street">
      <Spread shot={OOH.shelter} flush />
      <Spread shot={OOH.subway} flush />
      <Spread shot={OOH.station} flush />
    </Section>
  </>
);
