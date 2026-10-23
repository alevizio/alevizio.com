"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "../button";
import { Banner, type BannerTone } from "./banner";
import { Progress } from "./progress";
import { Toast, type ToastTone } from "./toast";

/* The feedback family, working: raise toasts, dismiss banners, run a
 * progress bar. Nothing here talks to a server. */
const TOASTS: Record<ToastTone, { trigger: string; title: string; text: string }> = {
  success: { trigger: "Retire credits", title: "1,250 credits retired", text: "The certificate is in Retirement." },
  warning: { trigger: "Save the draft", title: "Saved without a boundary", text: "Add one before you submit." },
  error: { trigger: "Upload the report", title: "That file is too big", text: "Reports can be up to 10 MB." },
};

type Raised = { id: number; tone: ToastTone };

export const ToastDemo = () => {
  const [raised, setRaised] = useState<Raised[]>([]);
  const next = useRef(0);
  const dismiss = (id: number) => setRaised((all) => all.filter((t) => t.id !== id));

  // Each toast stays 8 seconds, longer than WCAG's 5 for reading; Escape takes the newest.
  useEffect(() => {
    if (!raised.length) return;
    const newest = raised[raised.length - 1];
    const timer = setTimeout(() => dismiss(raised[0].id), 8000);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss(newest.id);
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
    };
  }, [raised]);

  const tones = Object.keys(TOASTS) as ToastTone[];
  return (
    <div className="grid w-full gap-10 lg:grid-cols-2">
      <div className="grid content-start gap-3">
        <p className="text-[13px] font-medium text-bn-medium">The three tones</p>
        {tones.map((tone) => (
          <Toast key={tone} tone={tone} title={TOASTS[tone].title}>
            {TOASTS[tone].text}
          </Toast>
        ))}
      </div>
      <div className="grid content-start gap-4">
        <p className="text-[13px] font-medium text-bn-medium">Raise one</p>
        <div className="flex flex-wrap gap-3">
          {tones.map((tone) => (
            <Button key={tone} hierarchy="secondary" size="sm" onClick={() => setRaised((all) => [...all.slice(-2), { id: next.current++, tone }])}>
              {TOASTS[tone].trigger}
            </Button>
          ))}
        </div>
        <div aria-live="polite" className="grid min-h-40 content-start gap-3">
          {raised.map(({ id, tone }) => (
            <Toast key={id} tone={tone} title={TOASTS[tone].title} onDismiss={() => dismiss(id)}>
              {TOASTS[tone].text}
            </Toast>
          ))}
        </div>
      </div>
    </div>
  );
};

const BANNERS: { tone: BannerTone; text: string }[] = [
  { tone: "neutral", text: "The marketplace is moving to a new address next week." },
  { tone: "success", text: "Credits retired. The certificate is on its way to your inbox." },
  { tone: "warning", text: "Two projects in your portfolio need a new boundary." },
  { tone: "error", text: "We couldn't reach the registry. Try again in a few minutes." },
];

export const BannerDemo = () => {
  const [shown, setShown] = useState(BANNERS.map((b) => b.tone));
  return (
    <div className="grid w-full gap-3">
      {BANNERS.filter((b) => shown.includes(b.tone)).map((b) => (
        <Banner key={b.tone} tone={b.tone} icon onDismiss={() => setShown((s) => s.filter((t) => t !== b.tone))}>
          {b.text}
        </Banner>
      ))}
      <Button hierarchy="tertiary" size="sm" onClick={() => setShown(BANNERS.map((b) => b.tone))} disabled={shown.length === BANNERS.length} className="justify-self-center">
        Bring them back
      </Button>
    </div>
  );
};

// The bar is a 2px line: the words above it say what it measures.
const Labelled = ({ text, children }: { text: string; children: ReactNode }) => (
  <div className="grid gap-2">
    <span aria-hidden className="text-[14px] text-bn-heavy">
      {text}
    </span>
    {children}
  </div>
);

export const ProgressDemo = () => {
  const [value, setValue] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  useEffect(() => () => clearInterval(timer.current), []);
  const run = () => {
    clearInterval(timer.current);
    setValue(0);
    timer.current = setInterval(() => {
      setValue((v) => {
        if (v >= 100) {
          clearInterval(timer.current);
          return 100;
        }
        return v + 5;
      });
    }, 150);
  };
  const live = value >= 100 ? "Evaluation done" : `Evaluating Verde do Bahia, ${value}%`;
  return (
    <div className="grid w-full max-w-md gap-6">
      <Labelled text="Boundary uploaded, 25%">
        <Progress value={25} label="Boundary uploaded, 25%" />
      </Labelled>
      <Labelled text="Questionnaire, 60%">
        <Progress value={60} label="Questionnaire, 60%" />
      </Labelled>
      <div className="grid gap-3">
        <Labelled text={live}>
          <Progress value={value} label={live} />
        </Labelled>
        <Button hierarchy="secondary" size="sm" onClick={run} className="justify-self-start">
          {value > 0 && value < 100 ? "Restart" : "Run it"}
        </Button>
      </div>
    </div>
  );
};
