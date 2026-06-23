"use client";

/* Ported from messa-landing/src/components/demo-modal.tsx for the portfolio
 * case study. Self-contained INTERACTIVE demo: the full "Request a demo" flow
 * (qualification form → calendar/time picker → contact details → confirmation)
 * is walkable end-to-end with NO real network calls and NO analytics.
 *
 * What changed vs the source (everything else — visual design, every step,
 * every transition — is byte-for-byte the same):
 *   - Analytics: the `useAnalytics()` PostHog hook is replaced by a local
 *     no-op stub (`useAnalytics` below) so every existing `.capture()` /
 *     `.identify()` / `.get_distinct_id()` call still type-checks and runs,
 *     but does nothing. No posthog import.
 *   - DEBUG_UI_ALLOWED now comes from the local "./debug-gate".
 *   - Network is neutralized:
 *       · /api/cal/slots  → `mockFetchSlots()` returns a realistic static
 *         SlotMap (weekday 09:00–16:30 across the next few weeks) after a
 *         ~450ms simulated delay, so the calendar/time UI populates.
 *       · /api/cal/book   → `mockBook()` resolves { success: true } after
 *         ~600ms, so the confirm "you're all set" state shows.
 *       · /api/lead       → `mockLead()` resolves { success: true } instantly.
 *   - The ?preview= URL shortcut is dropped: the modal always opens at step 1.
 *   - Adds a self-contained `RequestDemoDemo` trigger that renders the site's
 *     tactile slate 3D CTA and manages open/close state.
 */

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  type ReactNode,
  type FormEvent,
  type ButtonHTMLAttributes,
  type CSSProperties,
} from "react";
import { DEBUG_UI_ALLOWED } from "./debug-gate";
import { usePrefersReducedMotion } from "../use-prefers-reduced-motion";
import {
  X,
  Calendar as CalendarIcon,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  Clock,
  Check,
  ChevronLeft,
} from "lucide-react";

/* ── Analytics no-op stub ──────────────────────────────────────────────────
 * Drop-in replacement for the source's `useAnalytics()` PostHog hook. Returns
 * an object whose methods are no-ops so every existing analytics call site
 * (`posthog?.capture(...)`, `posthog?.identify(...)`,
 * `posthog?.get_distinct_id()`) keeps working but sends nothing anywhere. */
type AnalyticsStub = {
  capture: (event: string, props?: Record<string, unknown>) => void;
  identify: (id?: string, props?: Record<string, unknown>) => void;
  get_distinct_id: () => string;
};
const NOOP_ANALYTICS: AnalyticsStub = {
  capture: () => {},
  identify: () => {},
  get_distinct_id: () => "demo",
};
const useAnalytics = (): AnalyticsStub => NOOP_ANALYTICS;

type Step = "form" | "calendar" | "details" | "confirm" | "waitlist";

// Fields the autoplay script can be "typing into" at any moment (for the caret).
type TypingField = "company" | "hiresPerYear" | "interviewsPerMonth" | "name" | "email" | null;

type FormState = {
  name: string;
  email: string;
  company: string;
  country: string;
  companySize: string;
  hiresPerYear: string;
  interviewsPerMonth: string;
  roleTypes: string[];
};

const initialForm: FormState = {
  name: "",
  email: "",
  // Required fields start empty (the playful examples live as placeholders
  // on the inputs) so a pre-fill can't masquerade as real input and let the
  // user skip step 1. Optional fields keep their suggested defaults below.
  company: "",
  country: "United States",
  companySize: "1–10",
  hiresPerYear: "",
  interviewsPerMonth: "12",
  roleTypes: [],
};

const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–1,000", "1,000+"];
const ROLE_TYPES = ["Engineering", "Product", "Design", "Sales", "Operations", "Other"];

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Ireland",
  "Australia",
  "New Zealand",
  "Germany",
  "France",
  "Spain",
  "Portugal",
  "Italy",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Czechia",
  "Mexico",
  "Brazil",
  "Argentina",
  "Chile",
  "Colombia",
  "Uruguay",
  "Costa Rica",
  "India",
  "Japan",
  "South Korea",
  "Singapore",
  "Hong Kong",
  "Israel",
  "United Arab Emirates",
  "South Africa",
  "Other",
];


const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30",
];

const ACCENT = "#5A6B8F";
const ACCENT_BG = "rgba(90, 107, 143, 0.08)";
const ACCENT_BORDER = "rgba(90, 107, 143, 0.3)";

/* ── Mock backend ──────────────────────────────────────────────────────────
 * Local stand-ins for the three API routes the source talked to. They return
 * the exact shapes the UI already destructures, so no call-site logic changed.
 */

// Replaces GET /api/cal/slots. Builds a realistic SlotMap: every weekday in
// the requested window gets the static 09:00–16:30 set (as ISO datetimes,
// matching what Cal.com returned). Resolves after a short delay so the
// loading spinner / dimmed-calendar states are reachable.
const mockFetchSlots = (start: Date, end: Date): Promise<{ slots: SlotMap; configured: boolean }> => {
  const slots: SlotMap = {};
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  const last = new Date(end);
  while (cursor <= last) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) {
      const key = toDateKey(cursor);
      slots[key] = TIME_SLOTS.map((hhmm) => {
        const [h, m] = hhmm.split(":").map(Number);
        const d = new Date(cursor);
        d.setHours(h, m, 0, 0);
        return { time: d.toISOString() };
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve({ slots, configured: true }), 450);
  });
};

// Replaces POST /api/cal/book. Always succeeds after ~600ms so the confirm
// "you're all set" success state shows.
const mockBook = (): Promise<{ success: boolean; error?: string }> =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 600);
  });

// Replaces POST /api/lead. No-op that resolves success immediately.
const mockLead = (): Promise<{ success: boolean; error?: string }> =>
  Promise.resolve({ success: true });

const GRADIENT = "linear-gradient(180deg, #D4E3F0 0%, #E4E6E2 22%, #F0E6D8 48%, #FBF0E6 72%, #FBF0E6 100%)";

const LOADING_MSGS = [
  "Bribing Diego's calendar…",
  "Negotiating with time zones…",
  "Polishing the conference room…",
  "Selecting optimal coffee time…",
  "Calibrating the vibe meter…",
  "Asking the AI nicely…",
  "Ironing the welcome mat…",
  "Loading your talent radar…",
  "Syncing schedules across dimensions…",
  "Briefing your future interviewers…",
];

const OverlayLoader = ({ fading }: { fading: boolean }) => {
  const [landed, setLanded] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [msgVisible, setMsgVisible] = useState(false);

  useEffect(() => {
    if (!landed || fading) return;
    // Fade in the first message right after landing
    const fadeIn = setTimeout(() => setMsgVisible(true), 80);
    // Cycle messages every 2.2s with a 200ms cross-fade
    const interval = setInterval(() => {
      setMsgVisible(false);
      setTimeout(() => {
        setMsgIdx((i) => (i + 1) % LOADING_MSGS.length);
        setMsgVisible(true);
      }, 220);
    }, 2200);
    return () => { clearTimeout(fadeIn); clearInterval(interval); };
  }, [landed, fading]);

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 pointer-events-none"
      style={{
        background: GRADIENT,
        animation: fading ? "overlayOut 450ms ease-out forwards" : "stepFade 180ms both",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/plane-sm.webp"
        alt=""
        aria-hidden
        className="w-14 h-auto select-none"
        onAnimationEnd={() => { if (!fading && !landed) setLanded(true); }}
        style={{
          animation: (landed || fading)
            ? "planeFloat 3s ease-in-out infinite"
            : "planeFlyToCenter 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        }}
      />
      <p
        className="text-sm font-medium text-slate-500 tabular-nums"
        style={{
          opacity: msgVisible ? 1 : 0,
          transition: "opacity 220ms ease-in-out",
          minHeight: "1.25rem",
        }}
      >
        {LOADING_MSGS[msgIdx]}
      </p>
    </div>
  );
};

export const DemoModal = ({
  onClose,
  embedded = false,
  autoplay = false,
}: {
  onClose: () => void;
  embedded?: boolean;
  /* Self-running "screen recording" mode. When true the modal drives its own
   * real state on a continuous loop — typing the form, picking a calendar slot,
   * typing contact details, booking, then resetting — mirroring how the site's
   * stepper auto-advances. Purely additive: every manual interaction still works
   * exactly as before. Gated by reduced-motion, in-view, and hover (see below). */
  autoplay?: boolean;
}) => {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormState>(initialForm);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [loadPhase, setLoadPhase] = useState<"idle" | "loading" | "fading">("idle");
  // Autoplay-only: the date/time the script is currently highlighting in the
  // calendar (controlled selection handed down to CalendarStep). Ignored when
  // !autoplay so the calendar stays self-contained for manual walking.
  const [autoCalDate, setAutoCalDate] = useState<Date | null>(null);
  const [autoCalTime, setAutoCalTime] = useState<string | null>(null);
  // Autoplay-only: a caret flag for the field the script is actively typing, so
  // a subtle blinking caret can render in that input.
  const [typingField, setTypingField] = useState<TypingField>(null);
  const posthog = useAnalytics();
  // Guards the step-1 funnel events to once per modal session (the form can be
  // re-submitted via back-navigation, which would otherwise double-count).
  const step1Tracked = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // ── Autoplay machinery ──────────────────────────────────────────────────
  const reducedMotion = usePrefersReducedMotion();
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  // The script runs only while mounted, in view, not hovered, and motion is
  // allowed. Reduced-motion freezes everything at step 1 (still manually
  // walkable). These flags are read live by the running sequence via a ref.
  const autoplayActive = autoplay && !reducedMotion;
  const running = autoplayActive && inView && !hovered;
  const runningRef = useRef(running);
  useEffect(() => { runningRef.current = running; }, [running]);

  // Slots loaded by the calendar step in this cycle (autoplay reads these to
  // pick a real, selectable weekday + time). A ref so the async script always
  // sees the latest value without re-subscribing.
  const slotsRef = useRef<SlotMap | null>(null);
  const onSlotsLoaded = useCallback((s: SlotMap) => { slotsRef.current = s; }, []);

  // In-view gate (IntersectionObserver), mirroring the stepper: the sequence
  // never runs off-screen. Observe the wrapper that actually scrolls with the
  // page; cardRef works in both embedded and overlay layouts.
  useEffect(() => {
    if (!autoplay) return;
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [autoplay]);

  // The looping script. One async generator-style sequence guarded by an
  // "alive" flag (cleared on unmount / restart) and a pause-aware sleep that
  // parks while !running and resumes when it flips back true. All timers are
  // captured and cleared; no setState fires after teardown.
  useEffect(() => {
    if (!autoplay || reducedMotion) return;
    let alive = true;
    let pendingTimer: ReturnType<typeof setTimeout> | null = null;

    const clearPending = () => {
      if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; }
    };

    // Resolve after `ms`, but only while `running` is true. If paused (off-
    // screen or hovered) the clock parks and is re-checked every 120ms, so the
    // demo resumes exactly where it left off — like the stepper's pause.
    const sleep = (ms: number): Promise<void> =>
      new Promise((resolve) => {
        const startedAt = performance.now();
        let consumed = 0;
        let lastResume = startedAt;
        const step = () => {
          if (!alive) { resolve(); return; }
          if (runningRef.current) {
            const now = performance.now();
            consumed += now - lastResume;
            lastResume = now;
            if (consumed >= ms) { resolve(); return; }
            pendingTimer = setTimeout(step, Math.min(ms - consumed, 120));
          } else {
            // Parked: keep the consumed budget, poll until running resumes.
            lastResume = performance.now();
            pendingTimer = setTimeout(step, 120);
          }
        };
        // Kick off; if already idle this just parks.
        lastResume = performance.now();
        pendingTimer = setTimeout(step, Math.min(ms, 120));
      });

    // Type a string into a form field char-by-char, driving real form state.
    const type = async (
      field: "company" | "hiresPerYear" | "interviewsPerMonth",
      text: string,
      perChar = 48,
    ) => {
      setTypingField(field);
      for (let i = 1; i <= text.length && alive; i++) {
        setForm((f) => ({ ...f, [field]: text.slice(0, i) }));
        await sleep(perChar);
      }
    };

    // Type into the details step's name/email. Those live in DetailStep's local
    // state, so autoplay routes them through the shared `form` (DetailStep seeds
    // its locals from form on mount), keeping the same code path.
    const typeDetail = async (field: "name" | "email", text: string, perChar = 48) => {
      setTypingField(field);
      for (let i = 1; i <= text.length && alive; i++) {
        setForm((f) => ({ ...f, [field]: text.slice(0, i) }));
        await sleep(perChar);
      }
    };

    // Wait until the calendar's mock slots have loaded (poll the ref), with a
    // hard timeout fallback so the script never wedges if the fetch is slow.
    const waitForSlots = async (timeoutMs = 4000): Promise<SlotMap | null> => {
      const deadline = performance.now() + timeoutMs;
      while (alive && !slotsRef.current && performance.now() < deadline) {
        await sleep(120);
      }
      return slotsRef.current;
    };

    // Pick the first real, selectable weekday (has slots, not in the past) and
    // a mid-list time from it. The calendar opens on the current month, so we
    // prefer a date in that month — guaranteeing the highlight is visible in the
    // grid (dates outside the visible month render hidden). Falls back to the
    // earliest selectable date of any month if the current month has none left.
    const pickSlot = (slots: SlotMap): { date: Date; time: string } | null => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const curMonth = today.getMonth();
      const curYear = today.getFullYear();
      const toPick = (key: string): { date: Date; time: string } | null => {
        const list = slots[key];
        if (!list || list.length === 0) return null;
        const [y, m, d] = key.split("-").map(Number);
        const dateObj = new Date(y, m - 1, d);
        dateObj.setHours(0, 0, 0, 0);
        if (dateObj < today) return null;
        const dow = dateObj.getDay();
        if (dow === 0 || dow === 6) return null;
        // Prefer a civilised mid-morning slot; fall back to the first.
        const iso = (list[2] ?? list[0]).time;
        const t = new Date(iso);
        const hhmm = `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
        return { date: dateObj, time: hhmm };
      };
      const keys = Object.keys(slots).sort();
      // First pass: a date in the currently-visible month.
      for (const key of keys) {
        const [y, m] = key.split("-").map(Number);
        if (m - 1 !== curMonth || y !== curYear) continue;
        const picked = toPick(key);
        if (picked) return picked;
      }
      // Fallback: earliest selectable date in any month.
      for (const key of keys) {
        const picked = toPick(key);
        if (picked) return picked;
      }
      return null;
    };

    // Replicates DetailStep.handleSubmit's booking path from the parent so the
    // real "you're all set" confirm screen shows: overlay loader → mockBook →
    // lift contact details into form → fade to confirm.
    const runBooking = async () => {
      setLoadPhase("loading");
      const data = await mockBook();
      if (!alive) return;
      if (!data.success) { setLoadPhase("idle"); return; }
      posthog?.identify(posthog?.get_distinct_id());
      posthog?.capture("demo_booked");
      setLoadPhase("fading");
      setStep("confirm");
      await sleep(450);
      if (alive) setLoadPhase("idle");
    };

    const resetCycle = () => {
      setStep("form");
      setForm(initialForm);
      setDate(null);
      setTime(null);
      setAutoCalDate(null);
      setAutoCalTime(null);
      setTypingField(null);
      slotsRef.current = null;
      step1Tracked.current = false;
    };

    const cycle = async () => {
      while (alive) {
        // (a) clean slate at the form
        resetCycle();
        await sleep(900);
        if (!alive) break;

        // (b) type the company name
        await type("company", "Northwind Robotics", 52);
        await sleep(420);

        // (c) the other key fields, with a beat between each
        setForm((f) => ({ ...f, companySize: "51–200" }));
        await sleep(520);
        await type("hiresPerYear", "40", 90);
        await sleep(360);
        await type("interviewsPerMonth", "12", 90);
        await sleep(360);
        setTypingField(null);
        // toggle two role types so they visibly switch on
        setForm((f) => ({ ...f, roleTypes: ["Engineering"] }));
        await sleep(360);
        setForm((f) => ({ ...f, roleTypes: ["Engineering", "Product"] }));
        await sleep(620);
        if (!alive) break;

        // (d) advance to the calendar (same setStep the Continue button uses)
        step1Tracked.current = true;
        setStep("calendar");
        await sleep(700);

        // (e) wait for slots, then select a real weekday + time
        const slots = await waitForSlots();
        if (!alive) break;
        const pick = slots ? pickSlot(slots) : null;
        if (pick) {
          setAutoCalDate(pick.date);
          setAutoCalTime(null);
          await sleep(760);
          if (!alive) break;
          setAutoCalTime(pick.time);
          // Commit the selection into the real parent state + advance to
          // details, exactly like CalendarStep.handleSelectTime → onConfirm.
          setDate(pick.date);
          setTime(pick.time);
          await sleep(640);
          setStep("details");
        } else {
          // Slots never arrived — restart the loop cleanly.
          await sleep(600);
          continue;
        }
        await sleep(760);
        if (!alive) break;

        // (f) type contact details
        await typeDetail("name", "Alex Rivera", 52);
        await sleep(360);
        await typeDetail("email", "alex@northwind.co", 46);
        setTypingField(null);
        await sleep(720);
        if (!alive) break;

        // (g) the real booking path → confirm
        await runBooking();
        if (!alive) break;

        // (h) hold on the success screen, then loop
        await sleep(2500);
      }
    };

    void cycle();

    return () => {
      alive = false;
      clearPending();
    };
  }, [autoplay, reducedMotion, posthog]);

  // DEBUG_UI_ALLOWED is retained (imported from the local debug-gate) so the
  // gate stays wired in case the case study ever surfaces a dev affordance;
  // referencing it here keeps the import live without changing behaviour.
  void DEBUG_UI_ALLOWED;

  /* Focus management (WAI-ARIA dialog pattern): remember the element that
   * opened the modal (usually the "Request demo" trigger), move focus into
   * the card on mount, and hand focus back to the trigger when the modal
   * unmounts — whether via the close button, the overlay, or Escape. */
  useEffect(() => {
    // Embedded mode lives in normal document flow — no focus capture/return.
    if (embedded) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    cardRef.current?.focus();
    return () => trigger?.focus();
  }, [embedded]);

  useEffect(() => {
    // Embedded mode has no overlay to dismiss and no focus trap to maintain.
    if (embedded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      /* Trap Tab inside the card: the provider renders the modal after all
       * page content (layout-level), so without this Tab would walk the
       * entire background page before ever reaching the dialog. */
      if (e.key === "Tab" && cardRef.current) {
        const focusables = cardRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        const inside = cardRef.current.contains(active);
        if (e.shiftKey && (active === first || !inside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !inside)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, embedded]);

  useEffect(() => {
    // Embedded mode scrolls with the page — don't lock the body.
    if (embedded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [embedded]);

  const keyframes = (
    <style>{`
        @keyframes modalCloudA {
          0%   { transform: translate(-12px, 0); }
          50%  { transform: translate(14px, -6px); }
          100% { transform: translate(-12px, 0); }
        }
        @keyframes modalCloudB {
          0%   { transform: translate(10px, 0); }
          50%  { transform: translate(-12px, 5px); }
          100% { transform: translate(10px, 0); }
        }
        @keyframes stepFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes planeFloat {
          0%, 100% { transform: translate(0, 0) rotate(-4deg); }
          50%      { transform: translate(2px, -8px) rotate(2deg); }
        }
        @keyframes planeFlyToCenter {
          0%   { transform: translateY(300px) rotate(28deg) scale(0.3); opacity: 0; }
          18%  { opacity: 1; }
          100% { transform: translateY(0) rotate(-4deg) scale(1); opacity: 1; }
        }
        @keyframes overlayOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes demoCaretBlink {
          0%, 49%  { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
  );

  // Shared modal card + clouds. The card height is contained inline (embedded)
  // and viewport-filling on mobile only as an overlay.
  const card = (
    <>
          {/* Modal card. Overlay mode: full-screen on mobile, centered 672×660
           * card on desktop. Embedded mode: contained card on all breakpoints,
           * since it lives in the page flow rather than the viewport.
           * overflow-hidden so max-h properly clips the flex chain. */}
          <div
            ref={cardRef}
            tabIndex={-1}
            // Pause-on-hover for autoplay, mirroring the stepper. No-ops when
            // !autoplay (state is set but never read by the inert sequence).
            onMouseEnter={autoplay ? () => setHovered(true) : undefined}
            onMouseLeave={autoplay ? () => setHovered(false) : undefined}
            className={
              embedded
                ? "relative shadow-2xl flex flex-col w-full rounded-2xl h-[640px] sm:h-[660px] overflow-hidden outline-none"
                : "relative shadow-2xl flex flex-col w-full min-h-[100dvh] md:min-h-0 md:rounded-2xl md:h-[660px] md:max-h-[calc(100vh-48px)] overflow-hidden outline-none"
            }
            style={{ background: GRADIENT }}
          >
            <header className="flex items-center justify-between px-6 md:px-10 pt-6 pb-4 shrink-0 gap-4">
              {/* The indicator counts only the three real steps (form →
               * calendar → details — the booking fires at the end of
               * details). The confirm screen is a terminal success state
               * like waitlist: no indicator, and no back-navigation into
               * an already-sent booking. */}
              {step !== "waitlist" && step !== "confirm" ? (
                <StepIndicator
                  step={step}
                  onGoTo={(i) => setStep(i === 0 ? "form" : i === 1 ? "calendar" : "details")}
                />
              ) : (
                <span />
              )}
              {/* No close affordance in embedded mode — nothing to close. */}
              {!embedded && (
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="text-slate-400 hover:text-slate-700 transition-colors ml-auto"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </header>

            {step === "form" && (
              <FormStep
                form={form}
                setForm={setForm}
                typingField={autoplay ? typingField : null}
                onNext={() => {
                  if (!step1Tracked.current) {
                    posthog?.capture('demo_form_submitted', {
                      company_size: form.companySize,
                      hires_per_year: form.hiresPerYear,
                    });
                    step1Tracked.current = true;
                  }
                  setStep("calendar");
                }}
                onWaitlist={() => {
                  if (!step1Tracked.current) {
                    posthog?.capture('demo_waitlist_entered', {
                      country: form.country,
                      company_size: form.companySize,
                    });
                    step1Tracked.current = true;
                  }
                  setStep("waitlist");
                }}
              />
            )}
            {step === "calendar" && (
              <CalendarStep
                onConfirm={(d, t) => {
                  setDate(d);
                  setTime(t);
                  setStep("details");
                }}
                controlledDate={autoplay ? autoCalDate : null}
                controlledTime={autoplay ? autoCalTime : null}
                onSlotsLoaded={autoplay ? onSlotsLoaded : undefined}
              />
            )}
            {step === "details" && date && time && (
              <DetailStep
                form={form}
                setForm={setForm}
                typingField={autoplay ? typingField : null}
                date={date}
                time={time}
                onBack={() => setStep("calendar")}
                onLoadStart={() => setLoadPhase("loading")}
                onLoadDone={() => {
                  setLoadPhase("fading");
                  setStep("confirm");
                  setTimeout(() => setLoadPhase("idle"), 450);
                }}
                onLoadError={() => {
                  setLoadPhase("fading");
                  setTimeout(() => setLoadPhase("idle"), 300);
                }}
              />
            )}
            {step === "confirm" && date && time && (
              <ConfirmStep form={form} date={date} time={time} onClose={onClose} />
            )}
            {step === "waitlist" && <WaitlistStep form={form} />}

            {/* Loading overlay: appears on submit, fades out when booking resolves */}
            {loadPhase !== "idle" && <OverlayLoader fading={loadPhase === "fading"} />}
          </div>

          {/* Clouds — outside the overflow:hidden card, positioned relative to the wrapper */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cloud02.png" alt="" aria-hidden
            className="hidden md:block absolute pointer-events-none select-none"
            style={{ width: 130, height: "auto", top: 60, left: -110, animation: "modalCloudA 60s ease-in-out infinite", zIndex: 20 }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cloud01.png" alt="" aria-hidden
            className="hidden md:block absolute pointer-events-none select-none"
            style={{ width: 130, height: "auto", top: -40, right: 90, animation: "modalCloudA 70s ease-in-out 12s infinite", zIndex: 20 }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cloud05.png" alt="" aria-hidden
            className="hidden md:block absolute pointer-events-none select-none"
            style={{ width: 120, height: "auto", bottom: -30, right: -40, animation: "modalCloudB 80s ease-in-out 6s infinite", zIndex: 20 }} />
    </>
  );

  // Embedded mode: render inline in normal document flow — no fixed backdrop,
  // no dialog semantics, no overlay click-to-close.
  if (embedded) {
    return (
      <div className="relative w-full mx-auto max-w-[672px]">
        {keyframes}
        {card}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[1000] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ background: "rgba(90, 107, 143, 0.6)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
    >
      {keyframes}
      <div className="flex min-h-full flex-col md:items-center md:justify-center md:p-6">
        {/* Outer wrapper: position:relative for clouds, doesn't clip */}
        <div className="relative w-full md:max-w-[672px]" onClick={(e) => e.stopPropagation()}>
          {card}
        </div>
      </div>
    </div>
  );
};

const StepIndicator = ({
  step,
  onGoTo,
}: {
  step: Step;
  onGoTo: (i: number) => void;
}) => {
  const idx = step === "form" ? 0 : step === "calendar" ? 1 : 2;
  return (
    <div className="flex items-center" role="group" aria-label="Booking progress">
      {[0, 1, 2].map((i) => {
        const completed = i < idx;
        const active = i === idx;
        return (
          <div key={i} className="flex items-center">
            <button
              type="button"
              onClick={completed ? () => onGoTo(i) : undefined}
              disabled={!completed}
              className={`group relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                completed ? "cursor-pointer" : "cursor-default"
              }`}
              aria-current={active ? "step" : undefined}
              aria-label={`Step ${i + 1} of 3${
                completed ? ", completed — go back" : active ? ", current step" : ""
              }`}
              style={{
                background: completed || active ? ACCENT : "white",
                color: completed || active ? "white" : "rgba(27, 34, 64, 0.7)",
                border: "none",
                boxShadow: active ? `0 0 0 4px ${ACCENT_BG}` : "none",
                transition: "background 320ms cubic-bezier(0.4, 0, 0.2, 1), color 320ms ease, box-shadow 320ms ease",
              }}
            >
              {completed ? (
                <>
                  <Check className="w-3.5 h-3.5 absolute group-hover:opacity-0 transition-opacity duration-150" strokeWidth={3} />
                  <ChevronLeft className="w-3.5 h-3.5 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-150" strokeWidth={3} />
                </>
              ) : (
                <span>{i + 1}</span>
              )}
            </button>
            {i < 2 && (
              <div
                className="w-4 md:w-6 h-[2px] mx-1 rounded-full overflow-hidden"
                style={{ background: "rgba(27, 34, 64, 0.25)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ background: ACCENT, width: i < idx ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const FormStep = ({
  form,
  setForm,
  typingField,
  onNext,
  onWaitlist,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  // Non-null only in autoplay: the field the script is typing into right now,
  // so it can show a subtle "live caret" affordance.
  typingField?: TypingField;
  onNext: () => void;
  onWaitlist: () => void;
}) => {
  const valid = form.company.trim() && form.hiresPerYear.trim();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    // The step-1 funnel events fire in the parent's onWaitlist/onNext, guarded
    // so they count once per modal session rather than re-firing if the user
    // navigates back to the form and re-submits.
    if (form.country !== "United States") {
      onWaitlist();
    } else {
      onNext();
    }
  };

  const toggleRole = (role: string) => {
    setForm({
      ...form,
      roleTypes: form.roleTypes.includes(role)
        ? form.roleTypes.filter((r) => r !== role)
        : [...form.roleTypes, role],
    });
  };

  const isDefault = (field: keyof FormState) =>
    JSON.stringify(form[field]) === JSON.stringify(initialForm[field]);

  const clearIfDefault = (field: keyof FormState) => () => {
    if (
      typeof form[field] === "string" &&
      form[field] === initialForm[field]
    ) {
      setForm({ ...form, [field]: "" });
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex-1 overflow-y-auto"
      style={{ animation: "stepFade 320ms cubic-bezier(0.4, 0, 0.2, 1)" }}
    >
      <div className="min-h-full flex flex-col justify-center px-6 md:px-10 py-8 gap-6">
      <div>
        <h2 id="demo-modal-title" className="text-3xl md:text-4xl font-serif text-slate-900 leading-[1.1] tracking-tight">
          Tell us about your hiring
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          A quick read so we can tailor the demo to your team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Company" required>
          <CaretField active={typingField === "company"}>
            <input
              type="text"
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              onFocus={clearIfDefault("company")}
              placeholder="Dunder Mifflin Paper Co."
              className={`${inputCls} w-full`}
              style={{ ...defaultStyle(isDefault("company")), ...typingRingStyle(typingField === "company") }}
            />
          </CaretField>
        </Field>
        <Field label="Country" required>
          <select
            required
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className={`${inputCls} appearance-none cursor-pointer pr-10`}
            style={{
              backgroundImage:
                'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 16 16%27 fill=%27none%27 stroke=%27rgb(100,116,139)%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27><polyline points=%274 6 8 10 12 6%27/></svg>")',
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 14px center",
            }}
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Company size">
        <SizeSlider value={form.companySize} onChange={(v) => setForm({ ...form, companySize: v })} />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Hires per year" required>
          <CaretField active={typingField === "hiresPerYear"}>
            <input
              type="number"
              min="0"
              required
              value={form.hiresPerYear}
              onChange={(e) => setForm({ ...form, hiresPerYear: e.target.value })}
              onFocus={clearIfDefault("hiresPerYear")}
              className={`${inputCls} w-full`}
              style={{ ...defaultStyle(isDefault("hiresPerYear")), ...typingRingStyle(typingField === "hiresPerYear") }}
              placeholder="e.g. 40"
            />
          </CaretField>
        </Field>
        <Field label="Interviews / month">
          <CaretField active={typingField === "interviewsPerMonth"}>
            <input
              type="number"
              min="0"
              value={form.interviewsPerMonth}
              onChange={(e) => setForm({ ...form, interviewsPerMonth: e.target.value })}
              onFocus={clearIfDefault("interviewsPerMonth")}
              className={`${inputCls} w-full`}
              style={{ ...defaultStyle(isDefault("interviewsPerMonth")), ...typingRingStyle(typingField === "interviewsPerMonth") }}
              placeholder="e.g. 80"
            />
          </CaretField>
        </Field>
      </div>

      <Field label="Role types">
        <div className="flex flex-wrap gap-2">
          {ROLE_TYPES.map((role) => {
            const active = form.roleTypes.includes(role);
            return (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                className="text-sm px-4 py-2 rounded-full border transition-colors"
                style={{
                  background: active ? ACCENT_BG : "white",
                  borderColor: active ? ACCENT_BORDER : "rgb(226, 232, 240)",
                  color: active ? ACCENT : "rgb(71, 85, 105)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {role}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="pt-2">
        <PrimaryButton type="submit" disabled={!valid}>
          Continue to scheduling
        </PrimaryButton>
      </div>
      </div>
    </form>
  );
};

// ─── Calendar helpers ────────────────────────────────────────────────────────

type SlotMap = Record<string, { time: string }[]>;

const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const buildMonthGrid = (firstOfMonth: Date) => {
  const start = new Date(firstOfMonth);
  const dayOfWeek = firstOfMonth.getDay();
  const offsetToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  start.setDate(1 - offsetToMonday);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }
  return days;
};

// ─── CalendarStep ────────────────────────────────────────────────────────────

export const CalendarStep = ({
  onConfirm,
  controlledDate = null,
  controlledTime = null,
  onSlotsLoaded,
}: {
  onConfirm: (date: Date, time: string) => void;
  /* Autoplay (controlled) mode: when supplied, these override the step's own
   * internal date/time selection so the looping demo can drive the visible
   * highlight from the parent. In manual mode both stay null and the step is
   * fully self-contained (unchanged behaviour). */
  controlledDate?: Date | null;
  controlledTime?: string | null;
  /* Fires once the mock slots resolve, handing the parent the loaded SlotMap so
   * autoplay can pick a real, selectable weekday + time. No-op in manual mode. */
  onSlotsLoaded?: (slots: SlotMap) => void;
}) => {
  const posthog = useAnalytics();
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [internalDate, setInternalDate] = useState<Date | null>(null);
  const [internalTime, setInternalTime] = useState<string | null>(null);
  // In controlled (autoplay) mode the parent owns the selection; otherwise the
  // step's own state drives the highlight exactly as before.
  const controlled = controlledDate !== null;
  const date = controlled ? controlledDate : internalDate;
  const time = controlled ? controlledTime : internalTime;
  const setDate = setInternalDate;
  const setTime = setInternalTime;

  const [slots, setSlots] = useState<SlotMap>({});
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [configured, setConfigured] = useState(true);

  const timezone = useMemo(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; }
    catch { return "UTC"; }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingSlots(true);
    setFetchError(false);

    const year = view.getFullYear();
    const month = view.getMonth();
    // Expand ±1 day so timezone boundaries never clip the first or last day
    const start = new Date(year, month, 0);               // last day of prev month
    const end = new Date(year, month + 1, 1, 23, 59, 59); // first day of next month

    (async () => {
      try {
        // Replaces `fetch("/api/cal/slots?…")` with a local mock that returns
        // a realistic static SlotMap after a short simulated delay.
        const data = await mockFetchSlots(start, end);
        if (cancelled) return;
        setConfigured(data.configured ?? true);
        setSlots(data.slots ?? {});
        onSlotsLoaded?.(data.slots ?? {});
      } catch {
        if (!cancelled) {
          setFetchError(true);
          setSlots({});
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    })();

    return () => { cancelled = true; };
  }, [view, timezone, onSlotsLoaded]);

  const days = useMemo(() => buildMonthGrid(view), [view]);
  const monthLabel = view.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const canPrev = view > new Date(today.getFullYear(), today.getMonth(), 1);
  const friendlyWeekday = date
    ? date.toLocaleDateString("en-US", { weekday: "long" })
    : null;
  const friendlyDateLabel = date
    ? date.toLocaleDateString("en-US", { month: "long", day: "numeric" })
    : null;

  // Times to show for selected date: mock slots or static fallback
  const displaySlots = useMemo(() => {
    if (!date) return [];
    const calSlots = slots[toDateKey(date)] ?? [];
    if (calSlots.length > 0) {
      return calSlots.map(({ time: iso }) => {
        const d = new Date(iso);
        return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      });
    }
    // Fallback: show static slots if the mock hasn't loaded or failed
    const dow = date.getDay();
    return dow === 0 || dow === 6 ? [] : TIME_SLOTS;
  }, [date, slots]);

  const handleSelectTime = (selectedTime: string) => {
    if (!date) return;
    posthog?.capture('demo_time_selected', { time: selectedTime })
    setTime(selectedTime);
    onConfirm(date, selectedTime);
  };

  const toFriendlyTime = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, "0")} ${period}`;
  };

  return (
    <div
      className="flex-1 min-h-0 px-6 md:px-8 py-6 flex flex-col gap-5 md:justify-center overflow-y-auto md:overflow-hidden"
      style={{ animation: "stepFade 320ms cubic-bezier(0.4, 0, 0.2, 1)" }}
    >
      {/* Header */}
      <div className="shrink-0">
        <h2 id="demo-modal-title" className="text-2xl md:text-3xl font-serif text-slate-900 leading-[1.1] tracking-tight">
          Pick a time for your demo
        </h2>
        <p className="text-sm text-slate-500 mt-1 inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Messa demo &middot; 30 min &middot; {timezone}
        </p>
      </div>

      {/* Two-column: calendar left, times right — grid so row height = calendar image height */}
      <div className="flex flex-col md:grid md:grid-cols-[2fr_1fr] gap-4 md:gap-5">

        {/* Calendar image */}
        <div className="w-full md:flex-[2]">
          <div
            className="relative w-full"
            style={{
              opacity: loadingSlots ? 0.5 : 1,
              transition: "opacity 200ms ease",
              aspectRatio: "1 / 1",
              backgroundImage: "url(/images/calendar-md.webp)",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center top",
            }}
          >
            {/* Month nav in blue header band */}
            <div
              className="absolute flex items-center justify-center gap-6 text-white"
              style={{ top: "calc(11% + 7px)", left: "5%", right: "5%" }}
            >
              <button
                type="button"
                onClick={() => canPrev && setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
                disabled={!canPrev}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/25 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: "rgba(255, 255, 255, 0.12)" }}
                aria-label="Previous month"
              >
                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.25} />
              </button>
              <span className="text-2xl md:text-3xl font-serif tracking-tight">{monthLabel}</span>
              <button
                type="button"
                onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/25 transition-colors"
                style={{ background: "rgba(255, 255, 255, 0.12)" }}
                aria-label="Next month"
              >
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.25} />
              </button>
            </div>

            {/* Date grid — pixel-calibrated against the original calendar.png
                (1254×1254). calendar-md.webp (800×800) is a proportional
                downscale, so all percentage offsets below remain valid. */}
            <div
              className="absolute grid grid-cols-7"
              style={{
                top: "30.4%",
                bottom: "10.45%",
                left: "3.51%",
                right: "3.83%",
                gridTemplateRows: "9.97fr 9.97fr 10.05fr 9.89fr 9.80fr 9.49fr",
              }}
            >
              {days.map((d, i) => {
                const inMonth = d.getMonth() === view.getMonth();
                const isPast = d < today;
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                const calDataReady = configured && !loadingSlots && !fetchError && Object.keys(slots).length > 0;
                const hasCalSlots = (slots[toDateKey(d)]?.length ?? 0) > 0;
                const disabled = !inMonth || isPast || isWeekend || (calDataReady && !hasCalSlots);
                const selected = date !== null && d.getTime() === date.getTime();
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={() => { setDate(d); setTime(null); }}
                    className="flex items-center justify-center transition-colors"
                    style={{ cursor: disabled ? "default" : "pointer", visibility: inMonth ? "visible" : "hidden" }}
                  >
                    <span
                      className="flex items-center justify-center rounded-full transition-colors"
                      style={{
                        width: "68%",
                        aspectRatio: "1 / 1",
                        background: selected ? "rgba(60, 80, 165, 0.7)" : "transparent",
                        color: selected ? "white" : disabled ? "rgba(27, 34, 64, 0.4)" : "#1B2240",
                        fontWeight: selected ? 700 : 500,
                        fontSize: "1rem",
                        textDecoration: disabled && !selected ? "line-through" : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!disabled && !selected)
                          (e.currentTarget as HTMLSpanElement).style.background = "rgba(27, 34, 64, 0.14)";
                      }}
                      onMouseLeave={(e) => {
                        if (!disabled && !selected)
                          (e.currentTarget as HTMLSpanElement).style.background = "transparent";
                      }}
                    >
                      {d.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Time slots. On desktop the content is absolutely positioned so it
            fills the calendar's height — the grid row stays calendar-sized
            (calendar never moves) and only the slot list scrolls. On mobile
            it's in normal flow and the whole modal body scrolls. */}
        <div className="md:flex-[1] min-w-0 md:relative">
          {!date ? (
            <div className="md:absolute md:inset-0 flex flex-col items-center justify-center gap-2 text-center py-8 md:py-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/plane-sm.webp"
                alt=""
                aria-hidden
                className="w-10 h-auto select-none"
                style={{ animation: "planeFloat 5s ease-in-out infinite" }}
              />
              <p className="text-xs font-semibold text-slate-600">Still circling?</p>
              <p className="text-xs text-slate-400">Tap a date and we&apos;ll come in for a landing.</p>
            </div>
          ) : (
            <div className="md:absolute md:inset-0 flex flex-col gap-2 md:pt-2">
              <div className="flex flex-col gap-0.5 mb-1 shrink-0">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{friendlyWeekday}</span>
                <span className="text-2xl font-serif text-slate-800 leading-tight">{friendlyDateLabel}</span>
              </div>
              {loadingSlots ? (
                <div className="flex items-center justify-center h-20 shrink-0">
                  <div className="h-3.5 w-3.5 rounded-full border-2 animate-spin"
                    style={{ borderColor: `${ACCENT} transparent ${ACCENT} transparent` }} />
                </div>
              ) : displaySlots.length === 0 ? (
                <p className="text-xs text-slate-400">No available times for this day.</p>
              ) : (
                <div className="flex flex-col gap-1.5 pr-1 md:overflow-y-auto md:flex-1 md:min-h-0">
                  {displaySlots.map((slot) => {
                    const active = time === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleSelectTime(slot)}
                        className="w-full text-xs py-2.5 rounded-full border transition-colors text-center font-medium"
                        style={{
                          background: active ? ACCENT : "white",
                          borderColor: active ? ACCENT : "rgb(226, 232, 240)",
                          color: active ? "white" : "rgb(15, 23, 42)",
                          fontWeight: active ? 600 : 500,
                        }}
                      >
                        {toFriendlyTime(slot)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

const DetailStep = ({
  form,
  setForm,
  typingField,
  date,
  time,
  onBack,
  onLoadStart,
  onLoadDone,
  onLoadError,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  // Non-null only in autoplay: the field the script is typing into right now.
  typingField?: TypingField;
  date: Date;
  time: string;
  onBack: () => void;
  onLoadStart: () => void;
  onLoadDone: () => void;
  onLoadError: () => void;
}) => {
  const posthog = useAnalytics();
  const [localName, setLocalName] = useState(form.name);
  const [localEmail, setLocalEmail] = useState(form.email);
  const [localCompany, setLocalCompany] = useState(form.company);
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Autoplay drives the shared `form.name`/`form.email` over time, but these
  // inputs render local state seeded once on mount. When the script is typing
  // (typingField != null), mirror the form values down so the typed-out text is
  // visible in the fields. Inert in manual mode — locals stay user-owned.
  const autoTyping = typingField != null;
  useEffect(() => {
    if (!autoTyping) return;
    setLocalName(form.name);
    setLocalEmail(form.email);
    setLocalCompany(form.company);
  }, [autoTyping, form.name, form.email, form.company]);

  const timezone = useMemo(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; }
    catch { return "UTC"; }
  }, []);

  const [hour, minute] = time.split(":").map(Number);
  const start = useMemo(() => {
    const d = new Date(date);
    d.setHours(hour, minute, 0, 0);
    return d;
  }, [date, hour, minute]);
  const end = useMemo(() => new Date(start.getTime() + 30 * 60 * 1000), [start]);

  const friendlyDate = start.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const startTimeStr = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const endTimeStr = end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (booking) return;
    setBooking(true);
    setBookingError(null);
    onLoadStart(); // overlay appears immediately — mock booking races in background

    try {
      // Replaces `fetch("/api/cal/book", { method: "POST", … })` with a local
      // mock that resolves success after ~600ms. The payload that the source
      // sent is kept inline (as a no-op object) so the data shape is documented
      // and the qualification answers still flow through the same code path.
      void {
        name: localName,
        email: localEmail,
        company: localCompany,
        startTime: start.toISOString(),
        timezone,
        notes,
        details: {
          country: form.country,
          companySize: form.companySize,
          hiresPerYear: form.hiresPerYear,
          interviewsPerMonth: form.interviewsPerMonth,
          roleTypes: form.roleTypes,
        },
      };
      const data = await mockBook();
      if (!data.success) {
        posthog?.capture('demo_booking_error', { reason: 'api_error' })
        setBookingError(data.error ?? "Something went wrong. Please try again.");
        setBooking(false);
        onLoadError();
        return;
      }
    } catch {
      posthog?.capture('demo_booking_error', { reason: 'network_error' })
      setBookingError("Something went wrong. Please try again.");
      setBooking(false);
      onLoadError();
      return;
    }

    // Identify against the opaque anonymous distinct_id; email/company ride as
    // deletable person properties rather than being baked in as the identity key.
    posthog?.identify(posthog?.get_distinct_id(), { email: localEmail, company: localCompany })
    posthog?.capture('demo_booked')
    // Lift the details the visitor just typed back into the parent form —
    // name/email/company only live in this step's local state, so without
    // this the confirm screen and the add-to-calendar links would read the
    // stale (empty) form values.
    setForm({ ...form, name: localName, email: localEmail, company: localCompany });
    setBooking(false);
    onLoadDone();
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="flex-1 overflow-y-auto px-6 md:px-10 py-8 flex flex-col justify-center gap-6"
      style={{ animation: "stepFade 320ms cubic-bezier(0.4, 0, 0.2, 1)" }}
    >
      {/* Header */}
      <div>
        <h2 id="demo-modal-title" className="text-3xl md:text-4xl font-serif text-slate-900 leading-[1.1] tracking-tight">
          Almost there
        </h2>
        <p className="text-sm text-slate-500 mt-1 inline-flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5" />
          {friendlyDate} &middot; {startTimeStr} – {endTimeStr}
        </p>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Company" required>
          <input type="text" required value={localCompany}
            onChange={(e) => setLocalCompany(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Your name" required>
          <CaretField active={typingField === "name"}>
            <input type="text" required value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              className={`${inputCls} w-full`}
              style={typingRingStyle(typingField === "name")} />
          </CaretField>
        </Field>
      </div>
      <Field label="Email address" required>
        <CaretField active={typingField === "email"}>
          <input type="email" required value={localEmail}
            onChange={(e) => setLocalEmail(e.target.value)}
            className={`${inputCls} w-full`}
            style={typingRingStyle(typingField === "email")} />
        </CaretField>
      </Field>
      <Field label="Additional notes">
        <textarea value={notes} rows={3}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Please share anything that will help us prepare for our meeting."
          className={`${inputCls} resize-none leading-relaxed`} />
      </Field>

      {bookingError && <p className="text-xs text-rose-500">{bookingError}</p>}

      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onBack}
          className="text-sm font-medium text-slate-400 hover:text-slate-700 transition-colors px-1">
          Back
        </button>
        <button type="submit" disabled={booking} data-tactile
          className="relative inline-flex items-center justify-center gap-2 text-sm font-medium px-7 py-2.5 rounded-full text-white overflow-hidden"
          style={{ background: ACCENT, cursor: booking ? "not-allowed" : "pointer" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/plane-sm.webp"
            alt=""
            aria-hidden
            className="w-3.5 h-auto select-none"
            style={{ animation: "planeFloat 3s ease-in-out infinite" }}
          />
          <span>Confirm</span>
        </button>
      </div>
    </form>
  );
};

const ConfirmStep = ({
  form,
  date,
  time,
  onClose,
}: {
  form: FormState;
  date: Date;
  time: string;
  onClose: () => void;
}) => {
  // onClose is part of the source signature (a terminal step that can be
  // dismissed); referenced here to keep parity without changing behaviour.
  void onClose;
  const [hour, minute] = time.split(":").map(Number);
  const start = new Date(date);
  start.setHours(hour, minute, 0, 0);
  const end = new Date(start.getTime() + 30 * 60 * 1000);

  const [arrived, setArrived] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setArrived(true), 80);
    return () => clearTimeout(t);
  }, []);

  const arrive = (delay: number): CSSProperties =>
    arrived
      ? { animation: `stepFade 380ms ${delay}ms both` }
      : { opacity: 0 };

  const gcalUrl = useMemo(() => buildGoogleCalendarUrl(form, start, end), [form, start, end]);
  const outlookUrl = useMemo(() => buildOutlookCalendarUrl(form, start, end), [form, start, end]);

  const friendlyWeekday = start.toLocaleDateString("en-US", { weekday: "long" });
  const friendlyDate = start.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const friendlyTime = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div className="flex-1 px-6 md:px-8 py-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-[320px] flex flex-col gap-5">

        {/* Hero */}
        <div className="flex flex-col items-center text-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/plane-sm.webp"
            alt=""
            aria-hidden
            className="w-14 h-auto select-none mb-1"
            style={{ animation: "planeFloat 5s ease-in-out infinite" }}
          />
          <h2 id="demo-modal-title" className="text-3xl md:text-4xl font-serif text-slate-900 leading-[1.05] tracking-tight"
              style={arrive(0)}>
            You&rsquo;re all set
          </h2>
          <p className="text-sm text-slate-500" style={arrive(60)}>
            Confirmation sent to{" "}
            <span className="font-medium text-slate-700">{form.email || "your email"}</span>
          </p>
        </div>

        {/* Details card */}
        <div
          className="rounded-xl bg-white/60 border border-white/80 p-4 flex flex-col items-center gap-2 text-center"
          style={{ boxShadow: "0 2px 12px rgba(27,34,64,0.06)", ...arrive(140) }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Booking confirmed
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{friendlyWeekday}</span>
            <span className="text-xl font-serif text-slate-800 leading-tight">{friendlyDate}</span>
          </div>
          <div className="h-px bg-slate-100 w-full" />
          <div className="flex flex-col gap-1 items-center">
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {friendlyTime} &middot; 30 min
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              Messa demo
            </div>
          </div>
        </div>

        {/* Add to calendar */}
        <div className="flex flex-col gap-1.5" style={arrive(220)}>
          <a
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-tactile
            className="inline-flex items-center justify-center gap-2 w-full text-sm font-medium px-4 py-2.5 rounded-full text-white transition-transform hover:scale-[1.01]"
            style={{ background: ACCENT }}
          >
            Add to Google Calendar
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <div className="grid grid-cols-2 gap-1.5">
            <a
              href={outlookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full text-sm font-medium px-4 py-2 rounded-full bg-white/70 border transition-colors hover:bg-white"
              style={{ borderColor: "rgb(226, 232, 240)", color: ACCENT }}
            >
              Outlook <ExternalLink className="w-3 h-3" />
            </a>
            <button
              type="button"
              onClick={() => downloadIcsFile(form, start, end)}
              className="inline-flex items-center justify-center gap-2 w-full text-sm font-medium px-4 py-2 rounded-full bg-white/70 border transition-colors hover:bg-white cursor-pointer"
              style={{ borderColor: "rgb(226, 232, 240)", color: ACCENT }}
            >
              Apple / .ics
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Non-US visitors can't self-schedule (US-only rollout), so we capture their
// email and forward the qualification details to the team — mocked locally.
const WaitlistStep = ({ form }: { form: FormState }) => {
  const [name, setName] = useState(form.name);
  const [email, setEmail] = useState(form.email);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = /.+@.+\..+/.test(email.trim());

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting || !valid) return;
    setSubmitting(true);
    setError(null);
    try {
      // Replaces `fetch("/api/lead", { method: "POST", … })` with a local
      // no-op mock that resolves success. Payload kept inline as documentation.
      void {
        name: name.trim(),
        email: email.trim(),
        company: form.company,
        country: form.country,
        companySize: form.companySize,
        hiresPerYear: form.hiresPerYear,
        interviewsPerMonth: form.interviewsPerMonth,
        roleTypes: form.roleTypes,
      };
      const data = await mockLead();
      if (!data.success) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div
        className="flex-1 overflow-y-auto px-6 md:px-12 py-10 md:py-14 flex flex-col items-center justify-center text-center gap-7"
        style={{ animation: "stepFade 320ms cubic-bezier(0.4, 0, 0.2, 1)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/plane-sm.webp"
          alt=""
          aria-hidden
          className="w-24 h-auto select-none"
          style={{ animation: "planeFloat 5s ease-in-out infinite" }}
        />
        <div className="flex flex-col gap-3 max-w-md">
          <h2 id="demo-modal-title" className="text-3xl md:text-4xl font-serif text-slate-900 leading-[1.05] tracking-tight">
            You&rsquo;re on the list{form.company ? `, ${form.company}` : ""}!
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            We&rsquo;ll reach out at{" "}
            <span className="font-medium text-slate-800">{email}</span> as we
            open up access in {form.country || "your region"}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="flex-1 overflow-y-auto px-6 md:px-12 py-10 md:py-14 flex flex-col items-center justify-center text-center gap-6"
      style={{ animation: "stepFade 320ms cubic-bezier(0.4, 0, 0.2, 1)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/plane-sm.webp"
        alt=""
        aria-hidden
        className="w-20 h-auto select-none"
        style={{ animation: "planeFloat 5s ease-in-out infinite" }}
      />

      <div className="flex flex-col gap-3 max-w-md">
        <h2 id="demo-modal-title" className="text-3xl md:text-4xl font-serif text-slate-900 leading-[1.05] tracking-tight">
          We&rsquo;re rolling out in the US first
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          Messa is expanding fast. Leave your email and we&rsquo;ll reach out
          as we open up access in {form.country || "your region"}.
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3 text-left">
        <Field label="Your name">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className={inputCls}
          />
        </Field>
        <Field label="Work email" required>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
            className={inputCls}
          />
        </Field>

        {error && <p className="text-xs text-rose-500">{error}</p>}

        <div className="pt-1">
          <PrimaryButton type="submit" disabled={!valid || submitting}>
            {submitting ? "Sending…" : "Keep me posted"}
          </PrimaryButton>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Have a specific question?
        </span>
        <a
          href="mailto:sales@messa.ai"
          className="text-base font-medium transition-colors hover:underline underline-offset-4"
          style={{ color: ACCENT }}
        >
          sales@messa.ai
        </a>
      </div>
    </form>
  );
};

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) => (
  <label className="flex flex-col gap-1.5 text-sm">
    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
      {label}
      {required && <span className="text-rose-500 ml-0.5">*</span>}
    </span>
    {children}
  </label>
);

const inputCls =
  "px-4 py-3 rounded-2xl border border-slate-200 bg-white text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#5A6B8F] focus:ring-2 focus:ring-[rgba(90,107,143,0.15)] transition-colors";

const defaultStyle = (isDefault: boolean): CSSProperties =>
  isDefault ? { color: "rgb(148, 163, 184)" } : {};

/* Autoplay-only "live caret" affordance: a steady accent ring on the input the
 * script is currently typing into, plus a small blinking caret bar pinned to the
 * field, so the reader's eye follows the action like watching a screen recording.
 * (A bar caret positioned at the exact text-end over a real <input> can't be
 * measured reliably without layout thrash, so the caret sits at the field's
 * trailing edge — tasteful and layout-safe.) */
const typingRingStyle = (active: boolean): CSSProperties =>
  active ? { borderColor: ACCENT, boxShadow: `0 0 0 3px ${ACCENT_BG}` } : {};

/* Wraps an <input>/typed field so a blinking caret bar can render over it while
 * the autoplay script types. `active` is true only for the field being typed. */
const CaretField = ({ active, children }: { active: boolean; children: ReactNode }) => (
  <span className="relative block">
    {children}
    {active && (
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          right: 14,
          top: "50%",
          transform: "translateY(-50%)",
          width: 2,
          height: "1.1em",
          background: ACCENT,
          borderRadius: 1,
          animation: "demoCaretBlink 1.06s steps(1, end) infinite",
        }}
      />
    )}
  </span>
);

const PrimaryButton = ({
  children,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...rest}
    disabled={disabled}
    data-tactile
    className="w-full text-sm font-medium px-5 py-3 rounded-full text-white transition-all"
    style={{
      background: disabled ? "rgb(203, 213, 225)" : ACCENT,
      cursor: disabled ? "not-allowed" : "pointer",
    }}
  >
    {children}
  </button>
);


const SizeSlider = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const idx = Math.max(0, COMPANY_SIZES.indexOf(value));
  const pct = (idx / (COMPANY_SIZES.length - 1)) * 100;
  return (
    <div className="flex flex-col gap-2.5">
      <style>{`
        .size-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(to right, ${ACCENT} 0%, ${ACCENT} ${pct}%, white ${pct}%, white 100%);
          outline: none;
          cursor: pointer;
        }
        .size-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${ACCENT};
          border: 3px solid #FBF0E6;
          cursor: grab;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.18);
          transition: transform 0.12s ease;
        }
        .size-slider::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.1); }
        .size-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${ACCENT};
          border: 3px solid #FBF0E6;
          cursor: grab;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.18);
        }
      `}</style>
      <input
        type="range"
        min={0}
        max={COMPANY_SIZES.length - 1}
        step={1}
        value={idx}
        onChange={(e) => onChange(COMPANY_SIZES[Number(e.target.value)])}
        className="size-slider"
        aria-label="Company size"
      />

      <div className="relative h-5 mt-3">
        {COMPANY_SIZES.map((size, i) => {
          const isFirst = i === 0;
          const isLast = i === COMPANY_SIZES.length - 1;
          const tickPct = (i / (COMPANY_SIZES.length - 1)) * 100;
          const tickOffsetPx = 11 - tickPct * 0.22;
          const tickLeft =
            tickOffsetPx >= 0
              ? `calc(${tickPct}% + ${tickOffsetPx}px)`
              : `calc(${tickPct}% - ${Math.abs(tickOffsetPx)}px)`;
          // Full-width slider: anchor the end labels flush to the track
          // ends so they don't overflow the edges; middle labels stay
          // centered under the thumb position.
          const pos: CSSProperties = isFirst
            ? { left: 0 }
            : isLast
              ? { right: 0 }
              : { left: tickLeft, transform: "translateX(-50%)" };
          return (
            <button
              key={size}
              type="button"
              onClick={() => onChange(size)}
              className="absolute text-sm whitespace-nowrap transition-colors"
              style={{
                ...pos,
                top: 0,
                color: i === idx ? ACCENT : "rgb(148, 163, 184)",
                fontWeight: i === idx ? 600 : 400,
              }}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};


const formatGCalDate = (d: Date) =>
  d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const buildEventDetails = (form: FormState) =>
  [
    `Demo for ${form.company || "your team"}.`,
    "",
    // Defensive: drop the line entirely when both are blank so a literal
    // "Attendee:  <>" never lands in the user's calendar event.
    (form.name || form.email) && `Attendee: ${form.name} <${form.email}>`,
    form.companySize && `Company size: ${form.companySize}`,
    form.hiresPerYear && `Hires per year: ${form.hiresPerYear}`,
    form.interviewsPerMonth && `Interviews per month: ${form.interviewsPerMonth}`,
    form.roleTypes.length && `Role types: ${form.roleTypes.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

const buildOutlookCalendarUrl = (form: FormState, start: Date, end: Date) => {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: "Messa demo",
    body: buildEventDetails(form),
    startdt: start.toISOString(),
    enddt: end.toISOString(),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

const downloadIcsFile = (form: FormState, start: Date, end: Date) => {
  const stamp = formatGCalDate(start);
  const uid = `${stamp}-${Math.random().toString(36).slice(2, 10)}@messa.ai`;
  const escape = (s: string) =>
    s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Messa//Demo//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatGCalDate(new Date())}`,
    `DTSTART:${formatGCalDate(start)}`,
    `DTEND:${formatGCalDate(end)}`,
    "SUMMARY:Messa demo",
    `DESCRIPTION:${escape(buildEventDetails(form))}`,
    "ORGANIZER;CN=Messa:mailto:demo@messa.ai",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "messa-demo.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const buildGoogleCalendarUrl = (form: FormState, start: Date, end: Date) => {
  const text = "Messa demo";
  const details = [
    `Demo for ${form.company || "your team"}.`,
    "",
    // Defensive: drop the line entirely when both are blank so a literal
    // "Attendee:  <>" never lands in the user's calendar event.
    (form.name || form.email) && `Attendee: ${form.name} <${form.email}>`,
    form.companySize && `Company size: ${form.companySize}`,
    form.hiresPerYear && `Hires per year: ${form.hiresPerYear}`,
    form.interviewsPerMonth && `Interviews per month: ${form.interviewsPerMonth}`,
    form.roleTypes.length && `Role types: ${form.roleTypes.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text,
    dates: `${formatGCalDate(start)}/${formatGCalDate(end)}`,
    details,
    add: "demo@messa.ai",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/* ── Self-contained trigger ────────────────────────────────────────────────
 * Drop this into the case study to embed the interactive demo. It renders a
 * real "Request a demo" CTA (the site's tactile slate 3D button via
 * `.story-btn-3d`) and owns the open/close state, mounting <DemoModal> as a
 * fixed full-screen overlay over the page. Closing returns to the page and
 * restores focus to the button (handled inside DemoModal). */
export const RequestDemoDemo = ({ className = "" }: { className?: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`story-btn-3d inline-flex items-center justify-center px-6 py-3 rounded-full text-sm md:text-base ${className}`}
      >
        Request a demo
      </button>
      {open && <DemoModal onClose={() => setOpen(false)} />}
    </>
  );
};

export const RequestDemoInline = ({ className }: { className?: string }) => (
  <div className={className}>
    <DemoModal embedded autoplay onClose={() => {}} />
  </div>
);
