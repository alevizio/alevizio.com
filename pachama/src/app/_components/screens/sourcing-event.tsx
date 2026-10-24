"use client";

import landShare from "@/assets/product/source-land-share.jpg";
import forest from "@/assets/source/event-forest.jpg";
import symbiosis from "@/assets/source/symbiosis.png";
import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type RefObject } from "react";
import { MdAdd, MdArrowBack, MdArrowForward, MdCheck, MdClose, MdContentCopy, MdLock } from "react-icons/md";
import { Button } from "../banyan/button";
import { TextInput } from "../banyan/forms/input";
import { Select } from "../banyan/forms/select";
import { BN } from "../banyan/ui";
import { cn } from "../cn";
import { Flag, type Country } from "../flag";

/* Source's idea, a sourcing event in one link, as a demo in a browser
 * window: the link a buyer shares, the event page it opens (rebuilt live
 * from the design, with its photograph), the dialog that starts a
 * submission, and the step after it, the project's land. The buyer is
 * Symbiosis, with its logo, whose RFP Source grew out of (the screens had
 * Acme). Copy link copies this section's. */
type Step = "page" | "land";
const PATH: Record<Step, string> = {
  page: "/events/symbiosis/reforestation-agroforestry",
  land: "/events/symbiosis/reforestation-agroforestry/submission/land",
};

const COUNTRIES: { name: string; flag: Country }[] = [
  { name: "Colombia", flag: "co" },
  { name: "Argentina", flag: "ar" },
  { name: "Mexico", flag: "mx" },
  { name: "Brasil", flag: "br" },
  { name: "United States", flag: "us" },
];
const TYPES = ["ARR - Afforestation, Reforestation, Revegetation", "Agroforestry (inclusive of silvopasture)"];
const EARLIER = [
  { value: "new", label: "Create a new project for this submission" },
  { value: "verde", label: "Verde Do Bahia", subtitle: "From an earlier sourcing event" },
];

const chip = "inline-flex items-center gap-2 rounded-full border border-bn-line px-3.5 py-1.5 text-[14px] leading-5 text-bn-heavy";

const EventPage = ({ onSubmit, submitRef }: { onSubmit: () => void; submitRef: RefObject<HTMLButtonElement | null> }) => (
  <div className="grid lg:grid-cols-2">
    <div className="relative aspect-[4/3] lg:order-last lg:aspect-auto">
      <Image src={forest} alt="Forest from above, a red dirt track winding through the canopy" fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
    </div>
    <div className="p-6 sm:p-10 lg:py-12">
      <Image src={symbiosis} alt="Symbiosis" sizes="200px" className="h-11 w-auto" />
      <p className="mt-10 flex items-center gap-4 font-mono text-[13px] leading-4 tracking-[0.06em] text-bn-heavy uppercase">
        <span className="rounded-[4px] bg-[#e3ece7] px-2.5 py-1.5">Open</span>
        Submit by 5/30/25
      </p>
      <h4 className="mt-5 font-display text-[48px] leading-[1.02] font-bold text-bn-heavy sm:text-[60px]">Reforestation &amp; Agroforestry</h4>
      <p className="mt-5 max-w-[34rem] text-[16px] leading-6 text-bn-heavy">
        Symbiosis is launching a Request for Proposal (RFP) to source high-quality nature-based carbon removal credits. We are seeking projects that demonstrate strong environmental integrity, measurable climate
        impact, and co-benefits for biodiversity and local communities. Interested developers are invited to submit proposals below.
      </p>
      <Button ref={submitRef} icon={<MdAdd aria-hidden className="size-5" />} iconPosition="trailing" onClick={onSubmit} className="mt-7">
        Submit proposal
      </Button>
      <p className="mt-9 text-[16px] leading-6 font-bold text-bn-heavy">Eligible geographies</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {COUNTRIES.map((c) => (
          <li key={c.name} className={chip}>
            <Flag country={c.flag} className="size-4" />
            {c.name}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[16px] leading-6 font-bold text-bn-heavy">Eligible project types</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <li key={t} className={chip}>
            {t}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const StartDialog = ({ onClose, onStart }: { onClose: () => void; onStart: (name: string) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [from, setFrom] = useState("new");
  const [typed, setTyped] = useState("");
  const name = from === "verde" ? "Verde Do Bahia" : typed;

  useEffect(() => ref.current?.focus(), []);

  // Escape closes; Tab stays inside the dialog while it's open.
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !ref.current) return;
    const items = [...ref.current.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), [tabindex='0']")];
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) onStart(name.trim());
  };

  return (
    <div className="absolute inset-0 z-10 grid place-items-center bg-[#0e2517]/45 p-4 motion-safe:animate-[zoom-open_0.3s_var(--ease-arrive)_both]" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-submission"
        tabIndex={-1}
        onKeyDown={onKey}
        className="relative w-full max-w-[34rem] rounded-[20px] bg-white p-6 shadow-[0_30px_80px_rgb(14_37_23/0.35)] outline-none sm:p-8"
      >
        <button type="button" aria-label="Close" onClick={onClose} className={cn("absolute top-4 right-4 grid size-10 place-items-center rounded-full text-bn-heavy hover:bg-bn-heavy/8", BN.focus)}>
          <MdClose aria-hidden className="size-5" />
        </button>
        <p id="start-submission" className="font-display text-[30px] leading-none font-bold text-bn-heavy">
          Start your submission
        </p>
        <form onSubmit={submit} className="mt-6 grid gap-5">
          <Select label="Select a project from a previous sourcing event to pre-fill your submission" options={EARLIER} value={from} onChange={(v) => setFrom(v ?? "new")} />
          <TextInput
            label="What's the name of your project?"
            placeholder="Project name"
            value={name}
            disabled={from === "verde"}
            maxLength={100}
            onChange={(e) => setTyped(e.target.value)}
            message={`${name.length}/100 character count`}
          />
          <Button type="submit" disabled={!name.trim()} icon={<MdArrowForward aria-hidden className="size-5" />} iconPosition="trailing" className="w-full">
            Create project and start submission
          </Button>
        </form>
      </div>
    </div>
  );
};

export const SourcingEvent = ({ className }: { className?: string }) => {
  const [step, setStep] = useState<Step>("page");
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState("");
  const [copied, setCopied] = useState(false);
  const submitRef = useRef<HTMLButtonElement>(null);
  const landRef = useRef<HTMLParagraphElement>(null);

  // A new step takes the focus with it: the land's note, once it opens.
  useEffect(() => {
    if (step === "land") landRef.current?.focus();
  }, [step]);

  const close = () => {
    setOpen(false);
    submitRef.current?.focus();
  };
  const copy = () => {
    const link = `${window.location.origin}${window.location.pathname}#sourcing`;
    navigator.clipboard?.writeText(link).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      },
      () => {},
    );
  };

  return (
    <div className={cn("overflow-hidden rounded-[16px] bg-white shadow-[0_24px_80px_rgb(20_26_23/0.12)] ring-1 ring-black/5", className)}>
      <div className="flex items-center gap-3 border-b border-black/8 bg-[#eef1ef] px-3 py-2.5 sm:px-4">
        <span aria-hidden className="hidden gap-1.5 sm:flex">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </span>
        {step === "land" ? (
          <button type="button" aria-label="Back to the event page" onClick={() => setStep("page")} className={cn("grid size-8 shrink-0 place-items-center rounded-full text-bn-heavy hover:bg-black/8", BN.focus)}>
            <MdArrowBack aria-hidden className="size-5" />
          </button>
        ) : null}
        <p className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-3.5 py-1.5 font-mono text-[13px] leading-4 text-bn-heavy">
          <MdLock aria-hidden className="size-3.5 shrink-0 text-bn-medium" />
          <span className="truncate">{PATH[step]}</span>
        </p>
        <button type="button" onClick={copy} className={cn("flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] leading-4 font-medium text-bn-heavy hover:bg-black/8", BN.focus)}>
          {copied ? <MdCheck aria-hidden className="size-4" /> : <MdContentCopy aria-hidden className="size-4" />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
      <p aria-live="polite" className="sr-only">
        {copied ? "Link to this section copied" : step === "land" ? `Submission started for ${project}. Next, its land.` : ""}
      </p>
      <div className="relative">
        {step === "page" ? (
          <EventPage onSubmit={() => setOpen(true)} submitRef={submitRef} />
        ) : (
          <div className="motion-safe:animate-[arrive_0.5s_var(--ease-arrive)_both]">
            <p ref={landRef} tabIndex={-1} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-black/8 bg-bn-green-lightest px-4 py-3 text-[14px] leading-5 text-bn-heavy outline-none sm:px-6">
              <MdCheck aria-hidden className="size-5 shrink-0" />
              <span>
                <b>{project}</b> is in. Next, its land: a boundary, checked against satellite data.{project === "Verde Do Bahia" ? "" : " Shown here with Verde Do Bahia."}
              </span>
            </p>
            <Image src={landShare} alt="The submission's Land suitability tab: a panel asking the developer to share the project area, beside a globe ready for a boundary" sizes="(min-width: 1376px) 1296px, 100vw" className="h-auto w-full" />
          </div>
        )}
        {open ? (
          <StartDialog
            onClose={close}
            onStart={(name) => {
              setProject(name);
              setOpen(false);
              setStep("land");
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
