"use client";

/**
 * Live, interactive "How It Works" section — ported from messa-landing's
 * how-section.tsx so the case study can show the REAL app advancing through
 * its 4 steps (Define → Shortlist → Assess → Decide) instead of silent video
 * clips. Mirrors the product-section / booking-modal ports already in this
 * folder: real UI, scoped to .messa-embed.
 *
 * Differences from the source:
 *  - LazyVideo  → InViewVideo (../in-view-video) for the decorative Sidekick
 *    Meet tiles. Plays in-view, posters under reduced-motion.
 *  - TablerIcon → a local FLIcon <img src={ICON_BASE/<name>.svg}> helper, the
 *    same approach product-section.tsx uses (icons under public/icons/tabler).
 *  - The `hero-bg-change` event + landscape background image (calibration-only
 *    on the live site, asset not vendored here) are dropped; the panel sits on
 *    a self-contained sky→day gradient that still shifts night→day per step.
 *  - The off-canvas "notes-takers" decorative figure (notes.webp, not vendored)
 *    is omitted — purely decorative, not the real app UI.
 *  - text-subheading / glass-strong-static / the slideIn keyframe are defined
 *    locally in a scoped <style> block (they aren't in this repo's globals.css)
 *    using the same token values as the source.
 *  - Auto-advance respects prefers-reduced-motion: the per-step timers + the
 *    in-panel sub-animations stay paused so nothing moves for those users.
 */

import { useState, useEffect, useRef, type ReactElement } from "react";
import { InViewVideo } from "../in-view-video";
import { usePrefersReducedMotion } from "../use-prefers-reduced-motion";
import {
  ICON_BASE,
  stepData,
  shortlistCandidates,
  scorecardData,
  sidekickSections,
} from "./landing-data";
import { Clock, Square, FileText, Filter, MessageSquare, CircleCheck } from "lucide-react";

const STEP_ICONS: Record<string, typeof FileText> = {
  "file-text": FileText,
  "filter": Filter,
  "message": MessageSquare,
  "circle-check": CircleCheck,
};

/* ── Helpers ── */

/* Legacy flex-line names → Tabler outline equivalents so the in-product
 * mockup pulls from the same icon set as the rest of the page. */
const FL_TO_TABLER: Record<string, string> = {
  "chat-bubble-text-square": "message-circle",
  "copy-2": "copy",
  "empty-clipboard": "clipboard",
  "feather-pen": "feather",
  "linkedin": "brand-linkedin",
  "pencil-square": "edit",
  "text-file": "file-text",
};

const FLIcon = ({ name, className = "w-3 h-3" }: { name: string; className?: string }) => {
  const tablerName = FL_TO_TABLER[name] ?? name;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`${ICON_BASE}/${tablerName}.svg`} alt="" className={className} />;
};

/* ── Scoped styles — text-subheading / glass-strong-static / slideIn aren't in
 * this repo's globals.css, so they're defined here against the same tokens the
 * source used. Scoped under .messa-how so they can't leak. ── */
const HOW_STYLES = `
.messa-how .how-subheading {
  font-size: clamp(1.625rem, 1.4rem + 0.93vw, 2.125rem);
  line-height: 1.2;
}
.messa-how .how-glass-static {
  background: var(--color-glass-bg-strong-static, rgba(255,255,255,0.88));
  border-color: var(--color-glass-border, rgba(15,23,42,0.12));
  box-shadow: var(--shadow-glass, 0 8px 32px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.95), inset 0 -1px 1px rgba(0,0,0,0.03));
}
@keyframes howSlideIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.messa-how .how-slide-in {
  animation: howSlideIn 0.4s ease-out;
}
`;

/* ── Step UI panels (right column) — large scale, cropped by overflow-hidden ── */

const profileTabs = [
  { label: "Resume Analysis", icon: "text-file" },
  { label: "Interview Guide", icon: "feather-pen" },
  { label: "Interviews", icon: "chat-bubble-text-square" },
  { label: "Scorecard", icon: "empty-clipboard" },
];

const skillFilters = ["All", "System Design", "Leadership", "Prototyping", "User Research", "Design Systems"];

const candidateSkills: Record<string, string[]> = {
  "Charly Chaves": ["Prototyping", "User Research"],
  "Martina C.": ["User Research"],
  "Ankrit Seth": ["Design Systems"],
  "Pablo Armentano": ["System Design", "Leadership"],
  "Maya Reyes": ["System Design", "Prototyping"],
  "Sarah Chen": ["System Design", "Leadership", "Design Systems"],
  "Marcus Johnson": ["System Design", "Leadership", "Prototyping"],
  "Priya Patel": ["Prototyping", "User Research"],
  "James Wilson": ["User Research", "Design Systems"],
  "Emma Thompson": ["Prototyping", "Leadership"],
  "David Kim": ["Design Systems"],
  "Ana García": ["Design Systems", "User Research"],
  "Tom Fischer": ["System Design"],
  "Lisa Wang": ["Leadership", "Prototyping"],
  "Omar Hassan": ["User Research"],
  "Camila Ruiz": ["Prototyping", "Leadership"],
  "Raj Mehta": ["System Design"],
  "Sophie Laurent": ["System Design", "Design Systems", "Leadership"],
  "Luca Bianchi": ["User Research"],
  "Nina Petrov": ["Prototyping", "Design Systems"],
};

const filterSteps: string[][] = [
  ["All"],
  ["System Design"],
  ["System Design", "Leadership"],
  ["System Design", "Leadership", "Prototyping"],
];

const DefineUI = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setStep((s) => (s + 1) % filterSteps.length), 2500);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const active = filterSteps[step];
  const isAll = active.includes("All");

  return (
    <div className="rounded-2xl border overflow-hidden w-[150%] how-glass-static">
      <div className="p-6">
        {/* Skill set filters */}
        <div className="flex gap-2 mb-3">
          {skillFilters.map((f) => (
            <span
              key={f}
              className={`text-sm rounded-full px-3 py-1 whitespace-nowrap transition-all duration-500 ease-in-out ${
                active.includes(f)
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-text-muted bg-black/[0.04]"
              }`}
            >
              {f}
            </span>
          ))}
        </div>
        {/* Candidate rows */}
        <div>
          {shortlistCandidates.map((c, i) => {
            const skills = candidateSkills[c.name] || [];
            const visible = isAll || active.some((f) => skills.includes(f));
            return (
              <div
                key={i}
                className="overflow-hidden transition-all duration-700 ease-in-out"
                style={{
                  maxHeight: visible ? 60 : 0,
                  opacity: visible ? 1 : 0,
                  marginBottom: visible ? 6 : 0,
                }}
              >
                <div className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 bg-white/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                  <div className="min-w-0 w-40 shrink-0">
                    <div className="text-sm font-medium text-text-primary truncate">{c.name}</div>
                    <div className="text-xs text-text-muted truncate">{c.email}</div>
                  </div>
                  <span className={`text-xs font-semibold shrink-0 rounded-full px-2.5 py-1 ${c.fitScore >= 70 ? "text-green-700 bg-green-100" : c.fitScore >= 50 ? "text-amber-700 bg-amber-100" : "text-red-600 bg-red-100"}`}>{c.fitScore}% fit</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <FLIcon name="linkedin" className="w-4 h-4 opacity-40" />
                    <FLIcon name="text-file" className="w-4 h-4 opacity-40" />
                    <FLIcon name="copy-2" className="w-4 h-4 opacity-40" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* FindUI animation steps:
   0: empty state (Resume Analysis tab, no content)
   1: analyzing indicator
   2: (buffer — previously fraud check passed, now a beat of pause
        before the Analyzing pill transitions to Analysis Complete)
   3: fit score fills to 75% / Analyzing → Analysis Complete swap
   4: key findings appear
   5: skills match appears
   6: experience summary appears
   7: recommendation appears
   8: pause, then reset */
const findAnalysisItems = [
  { title: "Key Findings", items: ["5+ years product design in climate/data", "Shipped 12 features in 18 months at Carbon Direct", "Design systems experience at Pachama", "Led end-to-end redesign of environmental dashboards"] },
  { title: "Skills Match", items: ["System Design: Strong", "Prototyping: Strong", "User Research: Moderate", "Design Systems: Strong"], asPills: true },
  { title: "Recommendation", items: ["Strong candidate for senior IC role. Schedule structured interview focused on execution evidence and system-level thinking.", "Probe deeper on consumer-facing product experience and accessibility practices during interview.", "Assess collaboration style with engineering. His climate/data background suggests strong technical empathy."] },
];

const FindUI = ({ reducedMotion }: { reducedMotion: boolean }) => {
  // Under reduced motion, render the fully-revealed state (step at max) so the
  // analysis reads as complete without any per-tick animation.
  const [step, setStep] = useState(reducedMotion ? 7 : 0);

  useEffect(() => {
    if (reducedMotion) {
      setStep(7);
      return;
    }
    const durations = [2000, 1500, 1200, 1200, 1000, 1000, 1000, 1000, 2500];
    let current = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const advance = () => {
      current = (current + 1) % durations.length;
      if (current === 0) setStep(0);
      else setStep(current);
      timeout = setTimeout(advance, durations[current]);
    };
    timeout = setTimeout(advance, durations[0]);
    return () => clearTimeout(timeout);
  }, [reducedMotion]);

  const show = (threshold: number) => step >= threshold;
  const anim = (threshold: number) => ({
    opacity: show(threshold) ? 1 : 0,
    transform: show(threshold) ? "translateY(0)" : "translateY(8px)",
    transition: reducedMotion ? "none" : "opacity 0.6s ease-out, transform 0.6s ease-out",
  });

  const fitPercent = show(3) ? 75 : 0;
  const activeTab = "Resume Analysis";

  return (
    <div className="rounded-2xl border overflow-hidden w-[138%] how-glass-static">
      <div className="p-6">
        {/* Profile header + Pre-Interview Fit card */}
        <div className="flex items-start gap-3 mb-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/avatar.webp" alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-text-primary">Maya Reyes</div>
            <div className="text-xs text-text-muted mb-1.5">Senior Product Designer</div>
            <div className="flex items-center gap-2">
              <FLIcon name="pencil-square" className="w-3.5 h-3.5 opacity-40" />
              <FLIcon name="text-file" className="w-3.5 h-3.5 opacity-40" />
              <FLIcon name="linkedin" className="w-3.5 h-3.5 opacity-40" />
              <FLIcon name="copy-2" className="w-3.5 h-3.5 opacity-40" />
            </div>
          </div>
          {/* Pre-Interview Fit card */}
          <div className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl border border-neutral-200/60 shrink-0" style={{ background: "rgba(255,255,255,0.85)" }}>
            <span className="text-[7px] uppercase tracking-[0.15em] text-text-muted font-semibold">Pre-Interview Fit</span>
            <span className={`text-xl font-semibold leading-none transition-all duration-1000 ${fitPercent >= 70 ? "text-emerald-500" : "text-text-muted"}`}>{fitPercent}%</span>
            <div className="relative w-24 mt-0.5">
              <div className="flex items-center h-[4px] rounded-full overflow-hidden bg-neutral-200">
                <div className="h-full bg-neutral-400 transition-all duration-1000" style={{ width: `${Math.min(fitPercent, 30) / 100 * 100}%` }} />
                <div className="h-full bg-amber-400 transition-all duration-1000" style={{ width: `${Math.max(0, Math.min(fitPercent, 50) - 30) / 100 * 100}%` }} />
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${Math.max(0, fitPercent - 50) / 100 * 100}%` }} />
              </div>
              <div className="absolute top-[-4px] h-[12px] w-[2px] bg-neutral-700 rounded-full transition-all duration-1000" style={{ left: `${fitPercent}%`, opacity: fitPercent > 0 ? 1 : 0 }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-4 border-b border-black/[0.06] mt-3">
          {profileTabs.map((tab) => (
            <span key={tab.label} className={`flex items-center gap-1.5 text-xs pb-2 -mb-[1px] whitespace-nowrap transition-colors duration-300 ${tab.label === activeTab ? "text-accent font-semibold border-b-2 border-accent px-1.5" : "text-text-muted"}`}>
              <FLIcon name={tab.icon} className={`w-3.5 h-3.5 ${tab.label === activeTab ? "opacity-80" : "opacity-50"}`} />
              {tab.label}
            </span>
          ))}
        </div>

        {/* Content area */}
        {!show(1) ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FLIcon name="text-file" className="w-8 h-8 opacity-20 mb-3" />
            <span className="text-sm text-text-muted">Resume uploaded. Click analyze to begin.</span>
            <span className="text-xs font-medium text-accent mt-3">Analyze Resume →</span>
          </div>
        ) : (
          <div>
            {/* Analyzing → Analysis Complete pill */}
            <div className="flex items-center gap-3 mb-4">
              <div style={anim(1)} className="flex items-center gap-1.5 text-xs text-accent bg-accent/10 rounded-full px-2.5 py-1 relative overflow-hidden">
                <span className={`flex items-center gap-1.5 transition-all duration-700 ease-in-out ${show(3) ? "opacity-0 absolute" : "opacity-100"}`}>
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" /><path d="M14.5 8a6.5 6.5 0 0 0-6.5-6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  Analyzing...
                </span>
                <span className={`flex items-center gap-1.5 transition-all duration-700 ease-in-out ${show(3) ? "opacity-100" : "opacity-0 absolute"}`}>
                  <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none"><path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Analysis Complete
                </span>
              </div>
            </div>

            {/* Analysis sections */}
            {findAnalysisItems.map((section, si) => (
              <div key={si} className="mb-3" style={anim(4 + si)}>
                <div className="text-sm font-semibold text-text-primary mb-1.5">{section.title}</div>
                {"asPills" in section && section.asPills ? (
                  <div className="flex flex-wrap gap-1.5">
                    {section.items.map((item, ii) => {
                      const isStrong = item.includes("Strong");
                      return (
                        <span key={ii} className={`text-xs rounded-full px-2.5 py-1 ${isStrong ? "bg-accent/10 text-accent font-medium" : "text-text-muted bg-black/[0.04]"}`}>{item}</span>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-1 pl-2">
                    {section.items.map((item, ii) => (
                      <div key={ii} className="flex gap-2 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-[5px] shrink-0" />
                        <span className="text-xs text-text-secondary leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


const followUpQuestions: Record<number, string> = {
  0: "Can you tell me more about the team culture you thrive in?",
  1: "What metrics did you use to validate that decision?",
  2: "How did you get stakeholder alignment on that approach?",
  3: "What would you do differently if you could redo that project?",
};

const InterviewUI = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const sections = sidekickSections.slice(0, 4);
  const totalQs = sections.reduce((a, s) => a + s.questions.length, 0);
  // Under reduced motion, show roughly half the questions checked off and a
  // settled timer so the panel reads as a live-but-static interview.
  const [checked, setChecked] = useState(reducedMotion ? Math.floor(totalQs / 2) : 0);
  const [timer, setTimer] = useState(99);
  const [followUp, setFollowUp] = useState<{ section: number; text: string } | null>(null);
  const [followUpPulse, setFollowUpPulse] = useState(false);
  const followUpCycle = useRef(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setChecked((c) => (c >= totalQs ? 0 : c + 1));
      setTimer((t) => t + 3);
    }, 1200);
    return () => clearInterval(id);
  }, [totalQs, reducedMotion]);

  useEffect(() => {
    if (checked === 0) {
      setTimer(99);
      setFollowUp(null);
      setFollowUpPulse(false);
      followUpCycle.current = 0;
    }
  }, [checked]);

  // Follow-up animation: pulse at checked%4===0, show question one tick later
  useEffect(() => {
    if (reducedMotion) return;
    if (checked > 0 && checked % 4 === 0 && checked !== followUpCycle.current) {
      followUpCycle.current = checked;
      setFollowUpPulse(true);
    } else if (checked > 1 && (checked - 1) % 4 === 0 && followUpPulse) {
      const sIdx = Math.min(Math.floor((checked - 1) / 4) - 1, sections.length - 1);
      setFollowUp({ section: sIdx, text: followUpQuestions[sIdx] || followUpQuestions[0] });
      setFollowUpPulse(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, sections.length, reducedMotion]);

  const timerMin = String(Math.floor(timer / 60)).padStart(2, "0");
  const timerSec = String(timer % 60).padStart(2, "0");
  let qIndex = 0;

  let cumulative = 0;
  let activeSection = 0;
  for (let i = 0; i < sections.length; i++) {
    cumulative += sections[i].questions.length;
    if (checked < cumulative) { activeSection = i; break; }
    if (i === sections.length - 1) activeSection = i;
  }

  return (
    <div className="w-[200%] h-full flex gap-6 -ml-[60%]">
      {/* Hangout card — cropped on left and bottom by parent mask. Uses
       * hangout02.mp4 (one of the live Sidekick Meet videos) so this preview
       * reads as the same live interview. InViewVideo posters under reduced
       * motion / when off-screen and only plays in view. */}
      <div className="w-72 shrink-0 rounded-2xl border overflow-hidden relative scale-[1.25] origin-top-right how-glass-static">
        <InViewVideo
          src="/images/hangout02.mp4"
          poster="/images/hangout02.webp"
          width={288}
          height={384}
          label="Interview Sidekick — live video tile"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Meet UI overlay */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {/* Top — muted mic badge */}
          <div className="flex justify-end p-2">
            <span className="w-5 h-5 rounded-full bg-black/50 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" /><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.12 1.5-.35 2.18" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
            </span>
          </div>
          {/* Bottom — meeting info + controls */}
          <div>
            <div className="px-2.5 pb-1">
              <div className="text-[8px] text-white font-medium drop-shadow-sm">Interview Sidekick</div>
            </div>
            <div className="flex items-center justify-between px-2.5 py-1.5" style={{ background: "rgba(32,33,36,0.85)" }}>
              <span className="text-[7px] text-white/60">11:22 AM</span>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" /><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" /></svg>
                </span>
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" /></svg>
                </span>
                <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" /></svg>
                </span>
              </div>
              <span className="text-[7px] text-white/40">···</span>
            </div>
          </div>
        </div>
        {/* Self-view thumbnail — hangout01 video so both tiles show live footage. */}
        <div className="absolute bottom-8 right-2 w-12 h-9 rounded-md overflow-hidden border border-white/20">
          <InViewVideo
            src="/images/hangout01.mp4"
            poster="/images/hangout01.webp"
            width={48}
            height={36}
            label="Maya Reyes — self-view tile"
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-0.5 left-0.5 text-[5px] text-white drop-shadow-sm">Maya</span>
        </div>
      </div>

      {/* Sidekick panel — separate card, takes most of the space */}
      <div className="flex-1 h-[calc(100%-3rem)] flex flex-col rounded-2xl border border-black/[0.08] overflow-hidden how-glass-static shadow-lg">
        <div className="p-5 flex-1 min-h-0 overflow-hidden">
          {/* Timer card */}
          <div className="flex items-center gap-2.5 mb-3 px-3 py-2 rounded-xl bg-black/[0.03]">
          <Clock className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <span className="font-mono text-sm font-semibold text-text-primary tracking-wide transition-all duration-300">{timerMin}:{timerSec}</span>
          <div className="flex items-center gap-1.5 ml-1">
            <span className="w-6 h-6 rounded-md bg-white/80 border border-black/[0.06] flex items-center justify-center">
              <svg width="8" height="10" viewBox="0 0 8 10" fill="none"><rect x="0.5" y="0.5" width="2.5" height="9" rx="0.5" fill="currentColor" className="text-text-muted" /><rect x="5" y="0.5" width="2.5" height="9" rx="0.5" fill="currentColor" className="text-text-muted" /></svg>
            </span>
            <span className="w-6 h-6 rounded-md bg-white/80 border border-black/[0.06] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 0 1 10.2-4.3L11 5h4V1l-1.6 1.6A7.96 7.96 0 0 0 .04 8H2zm12 0a6 6 0 0 1-10.2 4.3L5 11H1v4l1.6-1.6A7.96 7.96 0 0 0 15.96 8H14z" fill="currentColor" className="text-text-muted" /></svg>
            </span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-[10px] text-red-600 bg-red-50 rounded-full px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Rec
            </span>
            <span className="flex items-center gap-1 text-[10px] text-text-muted bg-white/80 border border-black/[0.06] rounded-full px-2 py-0.5">
              <FLIcon name="text-file" className="w-2.5 h-2.5 opacity-60" />
              Transcript
            </span>
          </div>
        </div>

        {/* Profile row */}
        <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-black/[0.06]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/avatar.webp" alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-text-primary">Maya Reyes</span>
              <span className="text-[10px] text-text-muted">·</span>
              <span className="text-[10px] text-accent font-medium">View Profile</span>
            </div>
            <div className="text-[10px] text-text-muted">Senior Product Designer</div>
          </div>
        </div>

        {/* Sections with minutes + questions */}
        <div className="space-y-3">
          {sections.map((section, si) => {
            const isCurrentSection = si === activeSection;
            return (
              <div key={si}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-xs font-semibold ${isCurrentSection ? "text-text-primary" : "text-text-muted"}`}>{section.title}</span>
                  <span className={`flex items-center gap-1 text-[10px] rounded-full px-1.5 py-0.5 ${isCurrentSection ? "text-accent bg-accent/10 font-medium" : "text-text-muted bg-black/[0.04]"}`}><Clock className="w-2.5 h-2.5" />{section.minutes} min</span>
                </div>
                <div className="space-y-1.5 pl-0.5">
                  {section.questions.map((q, qi) => {
                    const idx = qIndex;
                    qIndex++;
                    const isChecked = idx < checked;
                    return (
                      <div key={qi} className="flex gap-2 items-start transition-all duration-500 ease-out">
                        {isChecked ? (
                          <svg className="w-3.5 h-3.5 text-accent mt-[1px] shrink-0 transition-all duration-300" viewBox="0 0 16 16" fill="none">
                            <rect width="16" height="16" rx="3" fill="currentColor" fillOpacity="0.15" />
                            <path d="M4 8l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <Square className="w-3.5 h-3.5 text-text-muted/40 mt-[1px] shrink-0 transition-all duration-300" />
                        )}
                        <span className={`text-[11px] leading-relaxed transition-all duration-500 ${isChecked ? "text-text-muted line-through" : "text-text-secondary"}`}>{q}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Follow-up question card — appears when AI suggests a question */}
      {followUp && (
        <div className="shrink-0 mx-3 mb-1 px-3 py-2 rounded-xl bg-accent/[0.07] border border-accent/20 how-slide-in">
          <div className="flex gap-2 items-center">
            <FLIcon name="chat-bubble-text-square" className="w-3 h-3 shrink-0 text-accent" />
            <span className="text-[11px] text-accent font-medium">{followUp.text}</span>
          </div>
        </div>
      )}

      {/* Floating Live Assist bar */}
      <div className="shrink-0 mx-2 mb-2 px-4 py-2.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.96)", boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-[10px] text-green-700 bg-green-100 rounded-full px-2 py-0.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Assist
          </span>
          <span className={`flex items-center gap-1.5 text-[10px] rounded-full px-5 py-1 font-medium transition-all duration-500 ${followUpPulse ? "text-white bg-accent scale-110" : "text-accent bg-accent/10"}`}><FLIcon name="chat-bubble-text-square" className={`w-2.5 h-2.5 transition-all duration-500 ${followUpPulse ? "brightness-0 invert" : ""}`} /> Follow Up</span>
          <span className="text-[10px] text-text-muted bg-black/[0.04] rounded-full px-2 py-0.5">Interview Coach</span>
          <span className="text-[10px] font-medium text-white bg-accent rounded-full px-3 py-1 ml-auto">Finish</span>
        </div>
      </div>
      </div>
    </div>
  );
};

const DecideUI = ({ reducedMotion }: { reducedMotion: boolean }) => {
  // 0: header only, 1: decision badge, 2: assessment, 3: pros header, 4-6: pro items, 7: cons header, 8-9: con items
  const totalSteps = 3 + scorecardData.pros.length + 1 + scorecardData.cons.length; // decision + assessment + pros(header+items) + cons(header+items)
  const [reveal, setReveal] = useState(reducedMotion ? totalSteps : 0);

  useEffect(() => {
    if (reducedMotion) {
      setReveal(totalSteps);
      return;
    }
    const id = setInterval(() => {
      setReveal((r) => (r >= totalSteps ? 0 : r + 1));
    }, 1200);
    return () => clearInterval(id);
  }, [totalSteps, reducedMotion]);

  const show = (threshold: number) => reveal >= threshold;
  const anim = (threshold: number) => ({
    opacity: show(threshold) ? 1 : 0,
    transform: show(threshold) ? "translateY(0)" : "translateY(8px)",
    transition: reducedMotion ? "none" : "opacity 0.6s ease-out, transform 0.6s ease-out",
  });

  let step = 1; // start after header (always visible)

  const decisionStep = step++;
  const assessmentStep = step++;
  const prosHeaderStep = step++;
  const prosSteps = scorecardData.pros.map(() => step++);
  const consHeaderStep = step++;
  const consSteps = scorecardData.cons.map(() => step++);

  return (
    <div className="rounded-2xl border overflow-hidden w-[150%] how-glass-static">
      <div className="p-6">
        {/* Profile header + score cards — always visible */}
        <div className="flex items-start gap-4 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/avatar.webp" alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
          <div className="min-w-0 shrink-0">
            <div className="text-sm font-semibold text-text-primary whitespace-nowrap">Maya Reyes</div>
            <div className="text-xs text-text-muted mb-1.5 whitespace-nowrap">Senior Product Designer</div>
            <div className="flex items-center gap-2">
              <FLIcon name="pencil-square" className="w-3.5 h-3.5 opacity-40" />
              <FLIcon name="text-file" className="w-3.5 h-3.5 opacity-40" />
              <FLIcon name="linkedin" className="w-3.5 h-3.5 opacity-40" />
              <FLIcon name="copy-2" className="w-3.5 h-3.5 opacity-40" />
            </div>
          </div>
          <div className="flex items-stretch gap-4 shrink-0">
            {/* After-Interview Score card */}
            <div className="flex flex-col items-center justify-center gap-1 px-4 py-2.5 rounded-xl border border-neutral-200/60" style={{ background: "rgba(255,255,255,0.85)" }}>
              <span className="text-[7px] uppercase tracking-[0.15em] text-text-muted font-semibold">After Interview</span>
              <span className="text-xs font-bold leading-none text-emerald-600">Strong Hire</span>
              <div className="flex items-center gap-0.5 mt-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M1.5 12.5L5.57574 16.5757C5.81005 16.8101 6.18995 16.8101 6.42426 16.5757L9 14" stroke="#059669" /><path d="M7 12L11.5757 16.5757C11.8101 16.8101 12.1899 16.8101 12.4243 16.5757L22 7" stroke="#059669" /></svg>
              </div>
            </div>
            {/* Pre-Interview Fit card */}
            <div className="flex flex-col items-center justify-center gap-1 px-4 py-2.5 rounded-xl border border-neutral-200/60" style={{ background: "rgba(255,255,255,0.85)" }}>
              <span className="text-[7px] uppercase tracking-[0.15em] text-text-muted font-semibold">Pre-Interview Fit</span>
              <span className="text-xl font-semibold leading-none text-emerald-500">75%</span>
              <div className="relative w-24 mt-0.5">
                <div className="flex items-center h-[4px] rounded-full overflow-hidden bg-neutral-200">
                  <div className="h-full bg-neutral-400" style={{ width: "30%" }} />
                  <div className="h-full bg-amber-400" style={{ width: "20%" }} />
                  <div className="h-full bg-emerald-500" style={{ width: "25%" }} />
                </div>
                <div className="absolute top-[-4px] h-[12px] w-[2px] bg-neutral-700 rounded-full" style={{ left: "75%" }} />
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-4 mb-3 border-b border-black/[0.06]">
          {profileTabs.map((tab) => (
            <span key={tab.label} className={`flex items-center gap-1.5 text-xs pb-2 -mb-[1px] whitespace-nowrap ${tab.label === "Scorecard" ? "text-accent font-semibold border-b-2 border-accent px-1.5" : "text-text-muted"}`}>
              <FLIcon name={tab.icon} className={`w-3.5 h-3.5 ${tab.label === "Scorecard" ? "opacity-80" : "opacity-50"}`} />
              {tab.label}
            </span>
          ))}
        </div>
        {/* Title */}
        <div className="text-sm font-semibold text-text-primary mb-2">Interview with Maya Reyes</div>
        {/* Decision */}
        <div className="flex items-center gap-2 mb-2" style={anim(decisionStep)}>
          <span className="text-xs text-text-muted">Your Decision</span>
          <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 rounded-md px-2.5 py-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
              <path d="M1.5 12.5L5.57574 16.5757C5.81005 16.8101 6.18995 16.8101 6.42426 16.5757L9 14" stroke="currentColor" />
              <path d="M16 7L12 11" stroke="currentColor" />
              <path d="M7 12L11.5757 16.5757C11.8101 16.8101 12.1899 16.8101 12.4243 16.5757L22 7" stroke="currentColor" />
            </svg>
            Strong Hire
          </span>
        </div>
        {/* Overall Assessment */}
        <div className="mb-3" style={anim(assessmentStep)}>
          <div className="text-sm font-semibold text-text-primary mb-1.5">Overall Assessment</div>
          <p className="text-xs text-text-secondary leading-relaxed">{scorecardData.overallAssessment[0]}</p>
        </div>
        {/* Pros */}
        <div className="mb-3">
          <div style={anim(prosHeaderStep)} className="text-sm font-semibold text-green-700 mb-1.5">Pros</div>
          <div className="space-y-1.5">
            {scorecardData.pros.map((pro, i) => (
              <div key={i} className="flex gap-2 items-start" style={anim(prosSteps[i])}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-[5px] shrink-0" />
                <span className="text-xs text-text-secondary leading-relaxed">{pro}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Cons */}
        <div>
          <div style={anim(consHeaderStep)} className="text-sm font-semibold text-red-600 mb-1.5">Cons</div>
          <div className="space-y-1.5">
            {scorecardData.cons.map((con, i) => (
              <div key={i} className="flex gap-2 items-start" style={anim(consSteps[i])}>
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-[5px] shrink-0" />
                <span className="text-xs text-text-secondary leading-relaxed">{con}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type PanelProps = { reducedMotion: boolean };
const stepPanels: Array<(props: PanelProps) => ReactElement> = [DefineUI, FindUI, InterviewUI, DecideUI];

/* ── Step backgrounds ── */

/* The real website background: one painted landscape that lightens as the
 * steps advance. Brightness + the night→day wash are lifted verbatim from the
 * live how-it-works. Shown across all four panels at once, that progression
 * becomes legible at a glance — night at Define, golden hour at Decide — the
 * "world lightening" the live section animates through. */
const STEP_BG = "url('/images/landscape.webp')";
const STEP_BRIGHTNESS = [0.7, 0.85, 1.0, 1.15];
const STEP_OVERLAY = [
  "linear-gradient(180deg, rgba(10,15,40,0.65) 0%, rgba(10,15,40,0.55) 100%)",
  "linear-gradient(180deg, rgba(10,15,40,0.45) 0%, rgba(10,15,40,0.35) 100%)",
  "linear-gradient(180deg, rgba(10,15,40,0.20) 0%, rgba(10,15,40,0.15) 100%)",
  "linear-gradient(180deg, rgba(255,200,50,0.08) 0%, rgba(255,255,255,0.0) 100%)",
];

/* ── The breakdown ── */

/**
 * A contact sheet of the four step UIs side by side — not the live section's
 * stepper-driven, one-at-a-time layout. Each panel is the real, self-running
 * step UI on the real landscape background at its own step's light level, so
 * the four together read as Define → Shortlist → Interview → Decide and as
 * night → day. Same components, fonts and accent as the live site (scoped to
 * .messa-embed); the UIs intentionally bleed past the frame and clip, exactly
 * as they do on the right-hand panel of the live section.
 */
const HowStepsGrid = ({ className }: { className?: string }) => {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <section className={`messa-how messa-embed ${className ?? ""}`}>
      <style>{HOW_STYLES}</style>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 px-6 md:grid-cols-2 md:gap-6">
        {stepPanels.map((PanelComp, i) => {
          const s = stepData[i];
          const StepIcon = STEP_ICONS[s.iconName] ?? FileText;
          return (
            <figure key={s.number} className="flex flex-col">
              <div className="relative h-[440px] overflow-hidden rounded-2xl border border-black/20 md:h-[500px]">
                {/* Background — the real landscape, lit for this step */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: STEP_BG,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                    filter: `brightness(${STEP_BRIGHTNESS[i]})`,
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: STEP_OVERLAY[i] }}
                  />
                </div>
                {/* The live step UI — top-left, clipping past the frame */}
                <div className="relative z-10 flex h-full items-start p-8 md:p-12">
                  <div className="w-full">
                    <PanelComp reducedMotion={reducedMotion} />
                  </div>
                </div>
              </div>
              <figcaption className="mt-3 flex items-center gap-2.5 px-1">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/5">
                  <StepIcon className="h-3.5 w-3.5 text-accent" strokeWidth={1.75} />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Step {s.number}
                </span>
                <span className="text-sm text-text-primary">{s.title}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
};

/**
 * Drop-in for the case study: the four step UIs as a side-by-side breakdown on
 * the real website backgrounds. Scoped to .messa-embed (brand fonts + slate
 * accent). Mirrors LiveProduct's wrapper in product-evolution.tsx.
 */
export const HowItWorks = ({ className }: { className?: string }) => (
  <HowStepsGrid className={className} />
);
