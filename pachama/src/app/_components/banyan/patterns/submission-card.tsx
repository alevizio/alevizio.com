"use client";

import { useState } from "react";
import { MdArrowForward, MdArrowRight, MdCheck, MdCheckCircle } from "react-icons/md";
import { cn } from "../../cn";
import { Button } from "../button";
import { BN } from "../ui";
import { CardFrame, CountryRow } from "./card-parts";
import { LIFECYCLE } from "./content";
import { StepperRow } from "./stepper";

/* The supplier's side: a project working through Screen, with the tasks
 * that unlock the review. Tick the tasks off and Submit wakes up. A sample
 * project; the copy is the product's. */
const TASKS = [
  { title: "Identify land", text: "Screen a target restoration area for carbon project eligibility and credit yield potential" },
  { title: "Plan project activities", text: "Map out your implementation and land tenure plan" },
];

export const SubmissionCard = ({ className }: { className?: string }) => {
  const [done, setDone] = useState([true, false]);
  const [sent, setSent] = useState(false);
  const ready = done.every(Boolean);

  return (
    <CardFrame className={className}>
      <div className="border-b border-bn-grey-light/60 px-8 py-4">
        <StepperRow steps={LIFECYCLE} current={0} size="small" showNext label="Project lifecycle" />
      </div>
      <div className="flex flex-col gap-4 p-8">
        <div>
          <CountryRow country="Brazil" area="1,000 hectares" />
          <h4 className="font-display text-[36px] leading-[44px] font-medium text-bn-heavy">Sample project</h4>
          <p className="mt-2 text-[12px] leading-4 text-bn-heavy">Complete the steps below to submit for review by Pachama</p>
        </div>
        <ul className="grid gap-4">
          {TASKS.map((task, i) => (
            <li key={task.title}>
              <button
                type="button"
                aria-pressed={done[i]}
                disabled={sent}
                onClick={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
                className={cn(
                  "flex w-full items-center gap-6 rounded-[16px] p-4 text-left text-bn-heavy transition-colors disabled:cursor-default",
                  BN.focus,
                  done[i] ? "border-2 border-bn-green bg-bn-green-lightest" : "border border-bn-grey-light hover:bg-bn-grey-lightest",
                )}
              >
                <span className="flex-1">
                  <span className="block text-[14px] leading-5 font-bold">{task.title}</span>
                  <span className="block text-[12px] leading-4">{task.text}</span>
                </span>
                {done[i] ? <MdCheck aria-hidden className="size-6 shrink-0" /> : <MdArrowForward aria-hidden className="size-6 shrink-0" />}
              </button>
            </li>
          ))}
        </ul>
        <Button
          className="w-full"
          disabled={!ready || sent}
          onClick={() => setSent(true)}
          icon={<MdCheckCircle aria-hidden className="size-5" />}
          iconPosition="trailing"
        >
          {sent ? "Submitted" : "Submit project for review"}
        </Button>
        <p aria-live="polite" className="sr-only">
          {sent ? "Project submitted for review." : ""}
        </p>
        <Button hierarchy="tertiary" icon={<MdArrowRight aria-hidden className="size-5" />} iconPosition="trailing" className="self-center" onClick={() => setSent(false)}>
          {sent ? "Undo" : "Continue where I left off"}
        </Button>
      </div>
    </CardFrame>
  );
};
