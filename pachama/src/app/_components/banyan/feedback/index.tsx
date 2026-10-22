import { Specimen, SpecimenGrid } from "../specimen";
import { Alert } from "./alert";
import { BannerDemo, ProgressDemo, ToastDemo } from "./demos";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";

/* Feedback: how the product answers back, from a toast that comes and goes
 * to the skeleton a page shows while it loads. */
export const Feedback = () => (
  <div className="grid gap-12">
    <Specimen name="Toast" note="Raise one: it comes in on glass with a stripe of its tone, stays eight seconds, and Escape or the close button sends it off." panelClassName="block">
      <ToastDemo />
    </Specimen>
    <Specimen name="Banner" note="One line across the top of a page, in four tones. Dismiss them and bring them back." panelClassName="block">
      <BannerDemo />
    </Specimen>
    <Specimen name="Alert" note="The state of a feature or a page, on its colour at 20%, with what to do next." panelClassName="grid gap-3">
      <Alert tone="success" title="Your project passed screening">Diligence starts next. We&rsquo;ll write when the report is ready.</Alert>
      <Alert tone="warning" title="The boundary overlaps a protected area">Check the shape against the map before you submit.</Alert>
      <Alert tone="error" title="The questionnaire is missing two answers">Answer them to send the submission.</Alert>
    </Specimen>
    <SpecimenGrid>
      <Specimen name="Progress" note="A 2px line in lidar green. Run the evaluation." panelClassName="block">
        <ProgressDemo />
      </Specimen>
      <Specimen name="Spinner and skeleton" note="A spinner for a moment, a skeleton for a page that's on its way." panelClassName="flex-col gap-8">
        <div className="flex items-center gap-6">
          <Spinner size="sm" label="Loading, small" />
          <Spinner label="Loading" />
          <Spinner size="lg" label="Loading, large" />
        </div>
        <div aria-busy="true" aria-label="A project card, loading" role="group" className="grid w-full max-w-xs gap-3 rounded-[16px] bg-white p-4">
          <Skeleton shape="square" className="h-28 w-full" />
          <Skeleton className="w-2/3" />
          <Skeleton className="w-1/2" />
        </div>
      </Specimen>
    </SpecimenGrid>
  </div>
);
