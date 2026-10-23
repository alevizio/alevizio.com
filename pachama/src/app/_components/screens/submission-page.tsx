"use client";

import { useEffect, useState } from "react";
import { MdArrowBack, MdArrowForward, MdCheck, MdCheckCircle } from "react-icons/md";
import { Button } from "../banyan/button";
import { BN } from "../banyan/ui";
import { cn } from "../cn";
import { Brazil } from "./brazil-flag";
import { LandSuitability } from "./land-suitability";
import { STAGES } from "./screening-data";
import { Proposal, ProjectInfo, Questionnaire } from "./submission-parts";

/* Submitting a new project to Symbiosis's sourcing event, the way Source
 * lays it out once the submission is started: the project's page, its four
 * stages still ahead, and four parts to fill in (the questionnaire, a
 * commercial proposal, the land's suitability and the project's info),
 * then submit. Rebuilt live from the Source Figma; Next walks through the
 * parts in order, and the flow chart's land suitability link opens that
 * part. */
const PARTS = ["Questionnaire", "Commercial proposals", "Land suitability", "Project info"] as const;
const LAND = PARTS.indexOf("Land suitability");

export const SubmissionPage = ({ className }: { className?: string }) => {
  const [part, setPart] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const [sent, setSent] = useState(false);
  const go = (i: number) => {
    setPart(i);
    setSeen((s) => new Set(s).add(i));
  };

  // Arriving from the flow chart's land suitability link opens that part.
  useEffect(() => {
    const open = () => {
      if (window.location.hash !== "#land-suitability") return;
      setPart(LAND);
      setSeen((s) => new Set(s).add(LAND));
    };
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);

  const last = part === PARTS.length - 1;
  return (
    <div className={cn("rounded-[20px] bg-white p-4 text-bn-heavy shadow-[0_24px_80px_rgb(20_26_23/0.12)] ring-1 ring-black/5 sm:p-8", className)}>
      <p className="flex items-center gap-3 text-[13px]">
        <MdArrowBack aria-hidden className="size-5" />
        <span className="flex items-center gap-1.5">
          <Brazil /> Brazil
        </span>
        <span className="border-l border-bn-grey-light pl-3">10,039 hectares</span>
      </p>
      <h4 className="mt-2 font-display text-[36px] leading-none font-bold sm:text-[44px]">Verde Do Bahia</h4>
      <p className="mt-2 flex gap-3 text-[13px] text-bn-medium">
        Native reforestation <span className="border-l border-bn-grey-light pl-3">VM0047</span>
      </p>
      {/* The stages it's headed for: none started until it's submitted. */}
      <ol aria-label="Stages" className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        {STAGES.slice(1).map((stage, i) => {
          const on = sent && i === 0;
          return (
            <li key={stage} className="flex items-center gap-2 font-mono text-[10px] leading-4 font-bold uppercase">
              <span aria-hidden className={cn("grid size-6 place-items-center rounded-full ring-inset", on ? "ring-2 ring-bn-green-dark" : "ring-1 ring-bn-grey")}>
                {on ? <span className="size-2 rounded-full bg-bn-green-dark" /> : null}
              </span>
              <span className={on ? "text-bn-heavy" : "text-bn-medium"}>{stage}</span>
              <span className="sr-only">{on ? ", in progress" : ", not started"}</span>
              {i < 3 ? <span aria-hidden className="h-px w-6 bg-bn-grey" /> : null}
            </li>
          );
        })}
      </ol>

      <div role="tablist" aria-label="Submission" className="no-scrollbar mt-6 flex overflow-x-auto border-b border-bn-grey-light text-[14px]">
        {PARTS.map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            id={`submission-tab-${i}`}
            aria-selected={part === i}
            aria-controls="submission-part"
            onClick={() => go(i)}
            className={cn("-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 whitespace-nowrap sm:px-5", part === i ? "border-bn-heavy font-medium" : "border-transparent text-bn-medium hover:text-bn-heavy", BN.focus)}
          >
            {seen.has(i) && part !== i ? <MdCheck aria-hidden className="size-4 text-bn-green-dark" /> : null}
            {label}
          </button>
        ))}
      </div>

      <div id="submission-part" role="tabpanel" aria-labelledby={`submission-tab-${part}`} className="mt-6">
        {part === 0 ? <Questionnaire /> : null}
        {part === 1 ? <Proposal /> : null}
        {part === LAND ? <LandSuitability /> : null}
        {part === 3 ? <ProjectInfo /> : null}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-bn-grey-light pt-5">
        <p aria-live="polite" className="text-[13px] text-bn-medium">
          {sent ? (
            <span className="flex items-center gap-2 font-medium text-bn-heavy">
              <MdCheckCircle aria-hidden className="size-5 text-bn-green-dark" />
              Submitted to Symbiosis. Screening starts next, against satellite data.
            </span>
          ) : (
            `${seen.size} of ${PARTS.length} parts filled in`
          )}
        </p>
        <span className="flex gap-3">
          {part > 0 ? (
            <Button hierarchy="secondary" onClick={() => go(part - 1)}>
              Back
            </Button>
          ) : null}
          {last ? (
            <Button disabled={sent} icon={<MdCheck aria-hidden className="size-5" />} iconPosition="trailing" onClick={() => setSent(true)}>
              {sent ? "Submitted" : "Submit to Symbiosis"}
            </Button>
          ) : (
            <Button icon={<MdArrowForward aria-hidden className="size-5" />} iconPosition="trailing" onClick={() => go(part + 1)}>
              Next
            </Button>
          )}
        </span>
      </div>
    </div>
  );
};
