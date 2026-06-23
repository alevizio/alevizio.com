"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
/* Calibrator is dev-only in the source repo (?calibrate=clouds); stubbed out
 * in this ported copy — the case study never calibrates. */
const CloudHandleOverlay = (_props: Record<string, unknown>) => null;
import { useClouds } from "./clouds-context";
import { ScrollFocus } from "./scroll-focus";
import { ScrollReveal } from "./scroll-reveal";
import { ICON_BASE, diamondPath, shortlistCandidates, shortlistResults, interviewGuideSections, scorecardData, sidekickSections } from "./landing-data";
import {
  MoreHorizontal, ChevronDown, ChevronLeft, ChevronRight,
  X, ChevronsLeft, Clock, Plus, ChevronUp, RotateCw, Trash2, GripVertical,
  Sparkles, Copy, FileDown,
  Mic, Video, Phone, Smile, Pause, RotateCcw, Square, Check,
  Users, MonitorUp, Circle,
  Filter, MessageSquare, Brain, CircleCheck, Flag,
} from "lucide-react";

/* Legacy flex-line icon names mapped to their Tabler outline equivalents.
 * Lets the existing product-mockup call sites keep their familiar slugs
 * while the actual SVG comes from the same Tabler set used everywhere
 * else on the page. */
const FL_TO_TABLER: Record<string, string> = {
  "archive-box": "archive",
  "bag-suitcase-4": "briefcase",
  "bell-notification": "bell",
  "chat-bubble-text-square": "message-circle",
  "cog": "settings",
  "copy-2": "copy",
  "dashboard-3": "layout-dashboard",
  "empty-clipboard": "clipboard",
  "feather-pen": "feather",
  "filter-2": "filter",
  "linkedin": "brand-linkedin",
  "magnifying-glass": "search",
  "multiple-stars": "sparkles",
  "pencil-square": "edit",
  "text-file": "file-text",
  "user-collaborate-group": "users",
  "user-identifier-card": "id-badge-2",
};

const FLIcon = ({ name, className = "w-4 h-4" }: { name: string; className?: string }) => {
  const tablerName = FL_TO_TABLER[name] ?? name;
  return <img src={`${ICON_BASE}/${tablerName}.svg`} alt="" className={className} />;
};

/* Acme Inc placeholder mark — stylised "A" inside a rounded badge so the
 * sidebar org header reads like a real brand logo instead of a single
 * letter. Uses currentColor so the parent can tint it via text colour. */
const AcmeLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="var(--color-accent)" />
    <path
      d="M8 17L12 7L16 17M9.5 14.2H14.5"
      stroke="white"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const tabs = [
  { id: "shortlist", label: "Shortlisting", Icon: Filter },
  { id: "interview", label: "Interview Guide", Icon: MessageSquare },
  { id: "sidekick", label: "Sidekick", Icon: Brain },
  { id: "scorecard", label: "Scorecard", Icon: CircleCheck },
];

export const ProductSection = ({ transparent = false }: { transparent?: boolean } = {}) => {
  const [activeTab, setActiveTab] = useState("shortlist");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [heroBg, setHeroBg] = useState("");
  /* Product cloud state lives in the global CloudsProvider — the
   * UnifiedCloudPanel and the on-canvas handles both read/write it
   * via context. */
  const cloudsSection = useClouds().sections.product;
  const cloudsCalibrate = useClouds().calibrate;
  const cloudsHandlesShown = useClouds().handlesShown.product;
  const sectionRef = useRef<HTMLElement | null>(null);
  /* @formkit/auto-animate refs — these wrap list containers so
   * filter changes (removing/adding candidates) animate the
   * surviving rows sliding up/down to fill the gap instead of
   * snapping. 250ms default with cubic-bezier(0.16, 1, 0.3, 1) ease.
   *   - candidateListRef: filters / sort changes on the Shortlist tab
   *   - notifListRef: notification dropdown items
   * Adding more refs here is the standard way to extend coverage to
   * other in-app lists (interview guide, scorecard, etc.). */
  const [candidateListRef] = useAutoAnimate<HTMLDivElement>({
    duration: 280,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  });
  const [notifListRef] = useAutoAnimate<HTMLDivElement>({
    duration: 220,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  });

  /* Shortlisting view — sort + per-candidate expand state. The bulk-select
   * pills (Strong / Maybe / Low) toggle which fit categories are visible.
   * The filter sidebar tracks which sections are open + which option chips
   * are toggled inside each section. */
  // sortBy retained (drives the default Score High→Low ordering); the sort
  // toggle UI was removed in the simplified Shortlisting view.
  const [sortBy] = useState<"score-desc" | "score-asc" | "name">("score-desc");
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
  // activeFitCategories still filters the list (all categories on by default);
  // the bulk-select toggle UI was removed, so no setter is needed.
  const [activeFitCategories] = useState<Set<"strong" | "maybe" | "low">>(
    () => new Set(["strong", "maybe", "low"]),
  );
  const [openFilterSections, setOpenFilterSections] = useState<Set<string>>(
    () => new Set(["additional", "location"]),
  );
  const [activeFilterChips, setActiveFilterChips] = useState<Set<string>>(() => new Set());
  const toggleFilterSection = (key: string) => {
    setOpenFilterSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };
  const toggleFilterChip = (key: string) => {
    setActiveFilterChips((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  /* Candidates tab — separate from Shortlisting. Reuses the original
   * dropdown-filter list view (status / score / job) over the broader
   * shortlistCandidates pool, so the Candidates sidebar link points at
   * the database-style table rather than the AI shortlist results. */
  const [statusFilter, setStatusFilter] = useState("All");
  const [scoreFilter, setScoreFilter] = useState("All Scores");
  const [jobFilter, setJobFilter] = useState("All Jobs");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  /* Bell icon — notifications panel. Three pre-baked items so the demo
   * screenshot reads like a real product (someone accepted an interview,
   * a new shortlist landed, a teammate left scorecard notes). The first
   * two are "unread" (accent dot); the third is older / read. */
  const [notifsOpen, setNotifsOpen] = useState(false);
  const notifsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!notifsOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
        setNotifsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotifsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [notifsOpen]);

  const filteredCandidates = shortlistCandidates.filter((c) => {
    if (scoreFilter === "High (70%+)" && c.fitScore < 70) return false;
    if (scoreFilter === "Medium (51-69%)" && (c.fitScore < 51 || c.fitScore > 69)) return false;
    if (scoreFilter === "Low (0-50%)" && c.fitScore > 50) return false;
    return true;
  });

  /* Interview guide — mutable sections for drag-and-drop + regenerate */
  const [guideSections, setGuideSections] = useState(() =>
    interviewGuideSections.map((s) => ({ ...s, questions: [...s.questions] }))
  );
  const dragRef = useRef<{ sIdx: number; qIdx: number } | null>(null);

  const handleDragStart = useCallback((sIdx: number, qIdx: number) => {
    dragRef.current = { sIdx, qIdx };
  }, []);

  const handleDrop = useCallback((targetSIdx: number, targetQIdx: number) => {
    const src = dragRef.current;
    if (!src || (src.sIdx === targetSIdx && src.qIdx === targetQIdx)) return;
    setGuideSections((prev) => {
      const next = prev.map((s) => ({ ...s, questions: [...s.questions] }));
      const [moved] = next[src.sIdx].questions.splice(src.qIdx, 1);
      next[targetSIdx].questions.splice(targetQIdx, 0, moved);
      return next;
    });
    dragRef.current = null;
  }, []);

  const regenerateGuide = useCallback(() => {
    setGuideSections((prev) =>
      prev.map((s) => {
        const qs = [...s.questions];
        for (let i = qs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [qs[i], qs[j]] = [qs[j], qs[i]];
        }
        return { ...s, questions: qs };
      })
    );
  }, []);

  /* Sidekick — finish-interview modal state. The Wrap-Up modal now
   * overlays on top of the live interview screen (no fade-out of the
   * background), so opening is instant. `finishLeaving` is kept around
   * for the case where the user navigates away while the panel is
   * still mid-transition; it's no longer used for the modal mount
   * but harmless to keep. */
  const [finishInterviewOpen, setFinishInterviewOpen] = useState(false);
  const [finishLeaving, setFinishLeaving] = useState(false);
  const [finishDecision, setFinishDecision] = useState<"strong-no" | "no" | "hire" | "strong-hire" | null>(null);
  const beginFinishInterview = () => {
    if (finishInterviewOpen) return;
    setFinishInterviewOpen(true);
  };

  /* Sidekick Live Assist — the Follow Up + Interview Coach buttons
   * cycle through pre-canned suggestions on click and surface the
   * response below the buttons. Pre-canned responses (not real AI)
   * tied to the demo's interview context (Maya Reyes, Senior Product
   * Designer). Each click on a button advances the index in that
   * mode's array, so users see different output on subsequent clicks. */
  const [liveAssistMode, setLiveAssistMode] = useState<null | "followup" | "coach">(null);
  const [liveAssistIdx, setLiveAssistIdx] = useState({ followup: 0, coach: 0 });
  const [liveAssistTyping, setLiveAssistTyping] = useState(false);
  const liveAssistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const FOLLOWUP_SUGGESTIONS = [
    "When she mentioned the redesign — ask for specific metrics. Push for numbers, not adjectives.",
    "She glossed over the migration phase — that's where the hardest tradeoffs sit. Dig in there.",
    "Get her to walk through one decision she'd reverse if she could. Reveals self-awareness.",
    "She said \"cross-functional\" — what was the team makeup? Engineers, PMs, designers? Pin it down.",
  ];
  const COACH_TIPS = [
    "She's strong on outcomes; you've been quiet on process. Spend the next 5 min on how decisions got made.",
    "Move to the prototype critique question — 70% of strong-fit signals come from showing taste live.",
    "Stress-test her collaboration story: ask about a teammate she clashed with and how it resolved.",
    "Time check: 18 minutes left, scoring section needs 8. Wrap the storytelling thread soon.",
  ];

  const triggerLiveAssist = (mode: "followup" | "coach") => {
    if (liveAssistTimerRef.current) clearTimeout(liveAssistTimerRef.current);
    setLiveAssistMode(mode);
    setLiveAssistTyping(true);
    /* "Sidekick is thinking" beat — feels like the assistant is
     * actually composing a response rather than instant-printing. */
    liveAssistTimerRef.current = setTimeout(() => {
      setLiveAssistTyping(false);
      setLiveAssistIdx((prev) => ({
        ...prev,
        [mode]: (prev[mode] + 1) % (mode === "followup" ? FOLLOWUP_SUGGESTIONS.length : COACH_TIPS.length),
      }));
    }, 750);
  };
  const dismissLiveAssist = () => {
    if (liveAssistTimerRef.current) clearTimeout(liveAssistTimerRef.current);
    setLiveAssistMode(null);
    setLiveAssistTyping(false);
  };
  /* Reset Live Assist state if the user leaves the Sidekick tab so
   * a stale response doesn't appear pre-rendered next time. */
  useEffect(() => {
    if (activeTab !== "sidekick") dismissLiveAssist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  /* Ref to the Meet (Google-Meet-style) container so we can find +
   * pause its <video> elements when the Wrap-Up modal opens. The
   * interview is "over" once the user clicks Finish — the videos
   * shouldn't keep playing behind the modal. */
  const meetRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const meet = meetRef.current;
    if (!meet) return;
    const videos = meet.querySelectorAll("video");
    if (finishInterviewOpen) {
      videos.forEach((v) => v.pause());
    } else if (activeTab === "sidekick") {
      videos.forEach((v) => {
        v.play().catch(() => {
          // Browsers may block autoplay if the user hasn't interacted —
          // safe to ignore, the next user gesture re-enables playback.
        });
      });
    }
  }, [finishInterviewOpen, activeTab]);

  /* Sidekick timer — counts up from 01:39 */
  const [sidekickTimer, setSidekickTimer] = useState(99);
  useEffect(() => {
    if (activeTab !== "sidekick") return;
    const id = setInterval(() => setSidekickTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [activeTab]);
  const timerMin = String(Math.floor(sidekickTimer / 60)).padStart(2, "0");
  const timerSec = String(sidekickTimer % 60).padStart(2, "0");

  /* Sidekick checkbox animation — progressively ticks each question */
  const [sidekickChecked, setSidekickChecked] = useState(0);
  const totalSidekickQuestions = sidekickSections.reduce(
    (acc, s) => acc + s.questions.length,
    0,
  );
  useEffect(() => {
    if (activeTab !== "sidekick") {
      setSidekickChecked(0);
      return;
    }
    const id = setInterval(() => {
      setSidekickChecked((c) => {
        if (c >= totalSidekickQuestions) return 0;
        return c + 1;
      });
    }, 1400);
    return () => clearInterval(id);
  }, [activeTab, totalSidekickQuestions]);

  /* Categorise + filter + sort the redesigned shortlist results. Categories:
   * Strong fit ≥ 70%, Maybe 51–69%, Low fit ≤ 50%. The bulk-select pills
   * toggle category visibility; the legend counts always reflect the full
   * dataset so users can see the ground truth even while filtered. */
  const fitCategoryFor = (score: number): "strong" | "maybe" | "low" => {
    if (score >= 70) return "strong";
    if (score >= 51) return "maybe";
    return "low";
  };
  const allResults = shortlistResults.map((c) => ({ ...c, fit: fitCategoryFor(c.fitScore) }));
  const totalStrong = allResults.filter((c) => c.fit === "strong").length;
  const totalMaybe = allResults.filter((c) => c.fit === "maybe").length;
  const totalLow = allResults.filter((c) => c.fit === "low").length;

  /* Display-only headline counts shown in the funnel, the count pills
   * above the table, and the bulk-select chips. The actual rendered
   * candidate list is intentionally smaller (we only render ~60 cards
   * in the demo for performance), but the totals reflect a realistic
   * per-role volume the user would see in production — and the funnel
   * proportions feel honest about how the distribution actually skews
   * (lots of Low, few Strong). */
  const DISPLAY_TOTAL = 280;
  const DISPLAY_STRONG = 15;
  const DISPLAY_MAYBE = 53;
  const DISPLAY_LOW = 212;

  /* Apply filter chips to the candidate list. Chips group by section:
   * within a section we OR matches (any selected chip qualifies), across
   * sections we AND. Job Title and Companies match against real data;
   * the rest use a deterministic hash so each chip consistently hides a
   * subset — gives a believable "filter narrows results" feel without
   * inventing additional candidate fields. */
  const matchesFilterChips = (c: { name: string; role: string; company: string }) => {
    if (activeFilterChips.size === 0) return true;
    const bySection = new Map<string, string[]>();
    for (const key of activeFilterChips) {
      const [section, value] = key.split(":");
      const list = bySection.get(section) ?? [];
      list.push(value);
      bySection.set(section, list);
    }
    for (const [section, chips] of bySection) {
      let matches = false;
      if (section === "job-title") {
        matches = chips.some((chip) => c.role.toLowerCase().includes(chip.toLowerCase()));
      } else if (section === "companies") {
        matches = chips.some((chip) => c.company.toLowerCase().includes(chip.toLowerCase()));
      } else {
        matches = chips.some((chip) => {
          let h = 0;
          const s = c.name + ":" + section + ":" + chip;
          for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
          return Math.abs(h) % 3 !== 0;
        });
      }
      if (!matches) return false;
    }
    return true;
  };
  const visibleResults = allResults
    .filter((c) => activeFitCategories.has(c.fit))
    .filter(matchesFilterChips)
    .sort((a, b) => {
      if (sortBy === "score-desc") return b.fitScore - a.fitScore;
      if (sortBy === "score-asc") return a.fitScore - b.fitScore;
      return a.name.localeCompare(b.name);
    });
  useEffect(() => {
    const handler = (e: Event) => setHeroBg((e as CustomEvent).detail || "");
    window.addEventListener("hero-bg-change", handler);
    return () => window.removeEventListener("hero-bg-change", handler);
  }, []);

  // "/images/watercolor-hero.png" → "/images/watercolor-app.png"
  const appBg = heroBg ? heroBg.replace("-hero.", "-app.") : "";

  const renderProfileHeader = (activeProfileTab: string) => (
    <div className="px-4 md:px-5 pt-3 border-b border-white/30">
      <div className="flex items-stretch gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <img src="/images/avatar.webp" alt="MR" width={48} height={48} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm md:text-base font-semibold text-text-primary">Maya Reyes</div>
              <div className="text-[10px] md:text-xs text-text-secondary">Senior Product Designer</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 ml-[52px] mt-1.5">
            <FLIcon name="pencil-square" className="w-4 h-4 opacity-50" />
            <FLIcon name="text-file" className="w-4 h-4 opacity-50" />
            <FLIcon name="linkedin" className="w-4 h-4 opacity-50" />
            <FLIcon name="copy-2" className="w-4 h-4 opacity-50" />
            <Trash2 className="w-4 h-4 text-text-secondary/50" strokeWidth={1.5} />
          </div>
        </div>
        {activeProfileTab === "Scorecard" && (
          <div className="hidden md:flex flex-col items-center justify-center gap-1 w-[124px] px-3 py-2 rounded-lg border border-white/30 shrink-0"
            style={{ background: "rgba(255,255,255,0.35)" }}>
            <span className="text-[7px] uppercase tracking-[0.2em] text-text-secondary font-semibold">After Interview</span>
            <span className="text-sm font-bold text-emerald-600 leading-none">Strong Hire</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" className="mt-0.5">
              <path d="M1.5 12.5L5.57574 16.5757C5.81005 16.8101 6.18995 16.8101 6.42426 16.5757L9 14" stroke="#059669" />
              <path d="M7 12L11.5757 16.5757C11.8101 16.8101 12.1899 16.8101 12.4243 16.5757L22 7" stroke="#059669" />
            </svg>
          </div>
        )}
        <div className="hidden md:flex flex-col items-center justify-center gap-1 w-[124px] px-3 py-2 rounded-lg border border-white/30 shrink-0"
            style={{ background: "rgba(255,255,255,0.35)" }}>
          <span className="text-[7px] uppercase tracking-[0.2em] text-text-secondary font-semibold">Pre-Interview Fit</span>
          <span className="text-sm font-semibold text-emerald-500 leading-none">75%</span>
          <div className="relative w-[88px] mt-0.5">
            <div className="flex items-center h-[4px] rounded-full overflow-hidden">
              <div className="h-full w-[30%] bg-neutral-400" />
              <div className="h-full w-[20%] bg-amber-400" />
              <div className="h-full w-[50%] bg-emerald-500" />
            </div>
            <div className="absolute top-[-4px] h-[12px] w-[2px] bg-neutral-700 rounded-full" style={{ left: "75%" }} />
          </div>
        </div>
      </div>
      {/* Tab names now show on mobile too (previously icon-only). With 4 tabs
          the labels can exceed a phone's width, so the row scrolls horizontally
          with a hidden scrollbar rather than wrapping/clipping. */}
      <div className="flex items-center gap-0 mt-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[
          { label: "Resume Analysis", icon: "text-file", tabId: null as string | null },
          { label: "Interview Guide", icon: "feather-pen", tabId: "interview" },
          { label: "Interviews", icon: "chat-bubble-text-square", tabId: null as string | null },
          { label: "Scorecard", icon: "empty-clipboard", tabId: "scorecard" },
        ].map((tab) => (
          <div
            key={tab.label}
            onClick={tab.tabId ? () => setActiveTab(tab.tabId!) : undefined}
            /* Active tab — both the bottom-border stroke and the label use
             * the muted-slate accent (#5A6B8F) via Tailwind arbitrary values
             * so they match the landing-page Request Demo button exactly.
             * (On factory the wrapper overrides --color-accent to this same
             * slate, so the nav CTA renders #5A6B8F — not the raw brand
             * #3C4BE6 that lives in globals.css. Hardcoding ensures the
             * tab stroke tracks the rendered button colour, not the token's
             * default value.) Arbitrary classes compile to real selectors
             * and reliably outrank Tailwind v4's `border-color: currentColor`
             * preflight default. */
            className={`flex items-center gap-1.5 px-2.5 py-2 text-[10px] md:text-[11px] border-b-2 shrink-0 whitespace-nowrap ${
              tab.label === activeProfileTab
                ? "border-b-[#5A6B8F] text-[#5A6B8F] font-medium"
                : "border-transparent text-text-secondary"
            } ${tab.tabId ? "cursor-pointer hover:text-accent/70 transition-colors" : ""}`}
          >
            <FLIcon name={tab.icon} className={`w-3 h-3 ${tab.label === activeProfileTab ? "opacity-80" : "opacity-50"}`} />
            <span>{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} id="product" className="relative pt-16 md:pt-24 pb-16 md:pb-24 px-4 md:px-8 overflow-hidden scroll-mt-24" style={
      transparent
        ? { transition: "background-image 0.6s ease-out", isolation: "isolate" }
        : {
            backgroundImage: appBg
              ? `url(${appBg}), linear-gradient(180deg, #F0F1FA 0%, #E8EAF6 100%)`
              : "linear-gradient(180deg, #F0F1FA 0%, #E8EAF6 100%)",
            backgroundSize: appBg ? "cover, 100% 100%" : "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transition: "background-image 0.6s ease-out",
            isolation: "isolate",
          }
    }>
      <style>{`
        @keyframes cloudDriftL {
          0%, 100% { transform: translateY(-50%) translateX(0px); }
          50% { transform: translateY(-50%) translateX(15px); }
        }
        @keyframes cloudDriftR {
          0%, 100% { transform: translateY(-50%) translateX(0px); }
          50% { transform: translateY(-50%) translateX(-15px); }
        }
      `}</style>
      {/* Glow behind app */}
      <div
        className="absolute pointer-events-none z-[1]"
        style={{
          width: 1200,
          height: 1000,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -40%)",
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(60,75,230,0.15) 0%, rgba(60,75,230,0.08) 30%, rgba(60,75,230,0.02) 60%, transparent 80%)",
        }}
      />

      {/* Clouds — flanking the app. Each img is positioned directly under
       * the section (no wrapper isolation context) and given a very high
       * z-index. With the section above set to `isolation: isolate` they
       * paint at the top of the section's local stacking context, beating
       * the product wrapper (z-10) and any fg cloud sprites pages may add
       * around ProductSection (z-30 in factory).
       *
       * Driven by DEFAULT_PRODUCT_CLOUDS in /landing/clouds.ts — edit
       * positions/sizes/opacity live via ?calibrate=clouds. Anim names
       * cloudDriftL / cloudDriftR are defined in the <style> block above. */}
      {cloudsSection.clouds.map((c, i) => (
        <img
          key={i}
          src={`/images/${c.src}`}
          alt=""
          aria-hidden
          /* Below-the-fold (Product section appears after Pain + How).
           * lazy load + async decode keeps these out of the initial
           * critical-path budget. */
          loading="lazy"
          decoding="async"
          className="hidden md:block absolute pointer-events-none select-none"
          style={{
            width: c.w,
            height: "auto",
            ...(c.top !== undefined ? { top: c.top } : {}),
            ...(c.bottom !== undefined ? { bottom: c.bottom } : {}),
            ...(c.left !== undefined ? { left: c.left } : {}),
            ...(c.right !== undefined ? { right: c.right } : {}),
            opacity: c.opacity ?? 0.85,
            zIndex: 9999,
            animation: `${c.anim ?? "cloudDriftL"} ${c.dur ?? 8}s ease-in-out ${c.delay ?? 0}s infinite`,
          }}
        />
      ))}

      {cloudsCalibrate && (
        <CloudHandleOverlay
          section={cloudsSection}
          parentRef={sectionRef}
          visible={cloudsHandlesShown}
        />
      )}

      {/* z-40 lifts the whole product block above the productArea clouds —
       * including the z:30 "in front of the dashboard" set, which otherwise
       * drifts over the heading/subhead and made words unreadable on wide
       * screens (QA 2026-06-11). Clouds now pass behind the glass card; the
       * dashboard stays legible and the copy is never occluded. */}
      <div className="relative z-40 max-w-5xl mx-auto">
        <ScrollReveal delay={0}>
          <ScrollFocus className="mb-8 md:mb-12 mx-auto max-w-2xl text-center">
            <p className="section-pill section-pill-info">
              The Product
            </p>
            <h2 className="text-heading font-normal text-text-primary tracking-tight mb-4 font-serif">
              Built into the workflow, not bolted on.
            </h2>
            <p className="text-lg text-text-secondary">
              Software paired with a methodology built by recruiting experts,
              and a partner who helps your team apply it.
              <br />
              <span className="text-text-primary">Messa doesn&apos;t hand you a blank template.
              It shows up with the answers.</span>
            </p>
          </ScrollFocus>
        </ScrollReveal>

        {/* Tabs — distinct from the section-pills above (which use a
         * soft tinted bg + matching colored text + colored border).
         * These are bigger "card-style" pills: active gets a solid
         * white surface with a subtle shadow + slate text/icon, so
         * the row reads as a tabbed control rather than a row of
         * inline section labels. Extra vertical space above + below
         * separates the row from the section pill at the top and
         * the dashboard below. */}
        <ScrollReveal delay={100}>
          {/* Tab scroller. On mobile the pills overflow and scroll horizontally;
              `-mx-4` cancels the section's px-4 so the scroll area runs full-bleed
              and crops at the browser edge (not 16px short of it). The inner row
              keeps `px-4` so the first/last pill still get edge breathing room.
              `md:mx-0` returns it to the centered, non-scrolling desktop layout.
              Scrollbar hidden (same pattern as demo-modal) — still scrollable,
              just no visible bar. */}
          <div className="mt-6 md:mt-10 mb-10 md:mb-14 -mx-4 md:mx-0 overflow-x-auto pb-2
            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-3 px-4 md:px-0 min-w-max md:min-w-0 md:justify-center mx-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? ""
                      : "text-text-secondary hover:bg-black/[0.04]"
                  }`}
                  style={
                    activeTab === tab.id
                      ? {
                          backgroundColor: "white",
                          color: "var(--color-info)",
                          boxShadow:
                            "0 1px 3px rgba(15, 25, 50, 0.08), 0 1px 2px rgba(15, 25, 50, 0.04), inset 0 0 0 1px rgba(15, 25, 50, 0.06)",
                        }
                      : undefined
                  }
                >
                  <tab.Icon className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.75} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Glass dashboard — pushed to bottom */}
        <ScrollReveal delay={200}>
        <div className={`relative ${activeTab === "sidekick" ? "h-[456px] md:h-[736px]" : ""}`}>
        <div className={`overflow-hidden ${activeTab === "sidekick" ? "absolute top-1/2 -translate-y-1/2 inset-x-0 rounded-2xl border border-white/40" : "rounded-2xl border border-white/40"}`}
          style={activeTab === "sidekick" ? {
            background: "transparent",
            boxShadow: "0 24px 60px -12px rgba(0,0,0,0.18), 0 8px 20px -4px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
          } : {
            /* PERF — was `rgba(255,255,255,0.28)` with a 24px live
             * backdrop-blur + 140% saturate. The 28% white relied on
             * the blur to fill in visual depth; without the blur it
             * looked thin. Bumped to a ~70% white that reads as the
             * same frosted glass without the per-frame composite. */
            background: "rgba(255, 255, 255, 0.7)",
            boxShadow: "0 -1px 0 rgba(255,255,255,0.7) inset, 0 24px 60px -12px rgba(0,0,0,0.18), 0 8px 20px -4px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
          }}
        >
          {/* ── Full app mockup ── */}
            <div className={`flex overflow-hidden ${activeTab === "sidekick" ? "h-[340px] md:h-[560px]" : "h-[456px] md:h-[736px]"}`}>
              {activeTab === "sidekick" ? (
              /* ── Google Meet only — Sidekick is a sibling outside this container. Hidden on mobile; Sidekick takes full width there. The `meet-leaving` class plays a fade-out + slight scale-down right after Finish is clicked. */
              <div ref={meetRef} className={`hidden md:block relative w-full h-full ${finishLeaving ? "meet-leaving" : ""}`}>
                <div className="absolute inset-0 bg-[#202124] flex flex-col">
                  {/* Video area — full bleed */}
                  <div className="flex-1 relative min-h-0">
                    {/* 2×2 Grid — fills the full Google Meet area; left column sits behind the Sidekick overlay */}
                    <div className="absolute inset-2 md:inset-3 grid grid-cols-2 gap-1 md:gap-1.5">
                      {([
                        { name: "Maya Reyes", src: "/images/hangout03.webp", video: undefined as string | undefined, active: true, isAI: false, messa: false },
                        { name: "Elena Vargas", src: "/images/hangout01.webp", video: "/images/hangout01.mp4", active: false, isAI: false, messa: false },
                        { name: "Interview Sidekick", src: "", video: undefined, active: false, isAI: true, messa: false },
                        { name: "Maya Reyes", src: "/images/hangout02.webp", video: "/images/hangout02.mp4", active: false, isAI: false, messa: true },
                      ]).map((p) => (
                        <div key={p.name} className={`relative overflow-hidden rounded-lg ${p.active ? "ring-2 ring-blue-400/70 ring-inset" : ""}`}>
                          {p.isAI ? (
                            <div
                              className="w-full h-full flex items-center justify-center"
                              /* Same sky-to-cream gradient used by the
                               * Demo + Login modals — ties the AI
                               * Sidekick participant to the same brand
                               * surface family as those modals instead
                               * of the prior dark-blue radial. */
                              style={{
                                background:
                                  "linear-gradient(180deg, #D4E3F0 0%, #E4E6E2 22%, #F0E6D8 48%, #FBF0E6 72%, #FBF0E6 100%)",
                              }}
                            >
                              {/* Messa "M" isotype — painted in the
                               * brand muted slate (#5A6B8F) for proper
                               * contrast on the cream-end of the
                               * gradient. */}
                              <svg width={64} height={64} viewBox="0 0 1172 1172" fill="none" aria-hidden>
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M585.753 241.168L187.863 470.888L585.753 700.608L983.653 470.888L585.753 241.168ZM337.073 786.768L585.753 930.348L983.633 700.608L884.163 643.178L585.753 815.488L436.543 729.328L337.073 786.768ZM378.793 497.358L434.033 465.468L388.193 438.988L332.943 470.888L378.793 497.358ZM434.553 529.558L687.363 383.598L734.963 411.088L482.173 557.048L434.553 529.558ZM537.983 589.258L790.783 443.298L838.383 470.798L585.593 616.758L537.983 589.258ZM585.753 324.938L631.613 351.408C580.933 380.658 540.483 403.998 489.803 433.258L443.963 406.788C494.623 377.518 535.073 354.198 585.753 324.938Z"
                                  fill="#5A6B8F"
                                />
                              </svg>
                            </div>
                          ) : p.video ? (
                            <video
                              src={p.video}
                              poster={p.src}
                              autoPlay
                              loop
                              muted
                              playsInline
                              aria-label={p.name}
                              preload="metadata"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img src={p.src} alt={p.name} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute bottom-1 left-1.5 md:bottom-2 md:left-2 text-[7px] md:text-[9px] text-white font-medium" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>{p.name}</div>
                          {p.messa && (
                            <div className="absolute top-1.5 right-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7px] text-white font-medium" style={{ background: "rgba(0,0,0,0.62)" }}>
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                              <svg width={8} height={5} viewBox="0 0 796 460" fill="none"><path d={diamondPath} fill="#3C4BE6" /></svg>
                              REC
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Google Meet bottom toolbar */}
                  <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-2.5 bg-[#202124]">
                    {/* Left: meeting info */}
                    <div className="hidden md:flex items-center gap-1.5 text-[9px] text-white/50">
                      <span>11:22 AM</span>
                      <span className="text-white/20">|</span>
                      <span>baz-ihjp-aps</span>
                    </div>

                    {/* Center: controls */}
                    <div className="flex items-center gap-1.5 md:gap-2 mx-auto md:mx-0">
                      <div className="hidden md:flex w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#3c4043] items-center justify-center">
                        <MoreHorizontal className="w-3.5 h-3.5 text-white/80" strokeWidth={1.5} />
                      </div>
                      <div className="flex items-center">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#3c4043] flex items-center justify-center">
                          <Mic className="w-3 h-3 md:w-3.5 md:h-3.5 text-white/80" strokeWidth={1.5} />
                        </div>
                        <ChevronUp className="w-2.5 h-2.5 text-white/40 -ml-0.5" strokeWidth={2} />
                      </div>
                      <div className="flex items-center">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#3c4043] flex items-center justify-center">
                          <Video className="w-3 h-3 md:w-3.5 md:h-3.5 text-white/80" strokeWidth={1.5} />
                        </div>
                        <ChevronUp className="w-2.5 h-2.5 text-white/40 -ml-0.5" strokeWidth={2} />
                      </div>
                      <div className="hidden md:flex w-8 h-8 rounded-full bg-[#3c4043] items-center justify-center">
                        <MonitorUp className="w-3.5 h-3.5 text-white/80" strokeWidth={1.5} />
                      </div>
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#3c4043] flex items-center justify-center">
                        <Smile className="w-3 h-3 md:w-3.5 md:h-3.5 text-white/80" strokeWidth={1.5} />
                      </div>
                      <div className="hidden md:flex w-8 h-8 rounded-full bg-[#3c4043] items-center justify-center">
                        <MoreHorizontal className="w-3.5 h-3.5 text-white/80" strokeWidth={1.5} />
                      </div>
                      <div className="w-10 h-7 md:w-12 md:h-8 rounded-full bg-[#ea4335] flex items-center justify-center ml-1">
                        <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-white rotate-[135deg]" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Right: side panel icons */}
                    <div className="hidden md:flex items-center gap-2.5 text-white/50">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                      <Users className="w-4 h-4" strokeWidth={1.5} />
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    </div>
                  </div>
                </div>
              </div>
              ) : (
              <>
              {/* Sidebar — desktop only, collapsible */}
              <aside
                className={`hidden md:flex flex-col border-r border-white/30 shrink-0 transition-all duration-200 ${sidebarOpen ? "w-[180px]" : "w-[52px]"}`}
                style={{ background: "rgba(255,255,255,0.35)" }}
              >
                {/* Org header — when expanded shows logo + name on the left
                 * and a collapse chevron on the right. When collapsed the
                 * logo stays visible and itself becomes the expand button,
                 * so the brand mark is always present in the sidebar. */}
                <div className="flex items-center justify-center px-3 py-2.5 border-b border-white/30">
                  {sidebarOpen ? (
                    <>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <AcmeLogo className="w-5 h-5 shrink-0" />
                        <span className="text-[11px] font-semibold text-text-primary truncate">Acme Inc</span>
                      </div>
                      <button onClick={() => setSidebarOpen(false)} aria-label="Collapse sidebar" className="text-text-secondary hover:text-text-primary transition-colors shrink-0">
                        <ChevronsLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setSidebarOpen(true)}
                      aria-label="Expand sidebar"
                      className="flex items-center justify-center hover:opacity-80 transition-opacity"
                    >
                      <AcmeLogo className="w-5 h-5 shrink-0" />
                    </button>
                  )}
                </div>

                {/* Nav items */}
                <nav className="flex-1 py-1.5 space-y-0.5">
                  {[
                    { label: "Dashboard", icon: "dashboard-3", badge: null, active: false, tabId: null as string | null },
                    { label: "Jobs", icon: "bag-suitcase-4", badge: "11", active: false, tabId: null as string | null },
                    { label: "Candidates", icon: "user-identifier-card", badge: "44", active: activeTab === "candidates" || activeTab === "interview", tabId: "candidates" as string | null },
                    { label: "Scorecards", icon: "empty-clipboard", badge: "9", active: activeTab === "scorecard", tabId: "scorecard" as string | null },
                    { label: "Shortlisting", icon: "filter-2", badge: "3", active: activeTab === "shortlist", tabId: "shortlist" as string | null },
                  ].map((item) => (
                    <div
                      key={item.label}
                      onClick={item.tabId ? () => setActiveTab(item.tabId!) : undefined}
                      className={`flex items-center ${sidebarOpen ? "gap-2 px-3" : "justify-center px-0"} py-1.5 mx-1.5 rounded-md text-[11px] ${
                        item.active
                          ? "bg-accent/8 text-accent font-medium"
                          : "text-text-secondary"
                      } ${item.tabId ? "cursor-pointer hover:bg-white/20 transition-colors" : ""}`}
                    >
                      <FLIcon name={item.icon} className={`w-4 h-4 shrink-0 ${item.active ? "opacity-80" : "opacity-65"}`} />
                      {sidebarOpen && <span>{item.label}</span>}
                      {sidebarOpen && item.badge && (
                        <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                          item.active ? "bg-accent/15 text-accent" : "bg-white/50 text-text-secondary"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  ))}
                  {/* Shortlisting sub-tree — recent shortlist runs + View history.
                   * Only rendered while the Shortlisting tab is active so the
                   * sidebar doesn't imply "Junior AI" is the live context on
                   * other tabs (Interview Guide / Candidates / Scorecard run
                   * against Senior Product Designer in this mockup). */}
                  {sidebarOpen && activeTab === "shortlist" && (
                    <div className="pl-3 pr-0 pt-0.5 space-y-0.5">
                      {[
                        { title: "Junior AI Software Engineer", current: true },
                        { title: "Junior AI Software Engineer", current: false },
                        { title: "Senior Product Manager", current: false },
                      ].map((item, i) => (
                        <div
                          key={`${item.title}-${i}`}
                          className={`flex items-center gap-1.5 pl-4 pr-2 py-1 mx-1.5 rounded-md text-[10px] cursor-pointer transition-colors ${
                            item.current
                              ? "bg-accent/8 text-accent font-medium"
                              : "text-text-secondary hover:bg-white/20"
                          }`}
                        >
                          <X className="w-2.5 h-2.5 opacity-45 shrink-0" strokeWidth={1.5} />
                          <span className="flex-1 truncate">{item.title}</span>
                          <CircleCheck
                            className="w-3 h-3 shrink-0"
                            style={{ color: "#69B982" }}
                            strokeWidth={1.75}
                          />
                        </div>
                      ))}
                      <div className="flex items-center gap-1.5 pl-4 pr-2 py-1 mx-1.5 rounded-md text-[10px] text-text-secondary hover:bg-white/20 transition-colors cursor-pointer">
                        <Clock className="w-3 h-3 opacity-60 shrink-0" strokeWidth={1.5} />
                        <span className="flex-1">View history</span>
                        <ChevronRight className="w-2.5 h-2.5 opacity-60 shrink-0" strokeWidth={1.5} />
                      </div>
                    </div>
                  )}
                </nav>

                {/* Bottom section */}
                <div className="border-t border-white/30 py-1.5 space-y-0.5">
                  <div className={`flex items-center ${sidebarOpen ? "gap-2 px-3" : "justify-center px-0"} py-1.5 mx-1.5 text-[11px] text-text-secondary`}>
                    <FLIcon name="user-collaborate-group" className="w-4 h-4 opacity-65 shrink-0" />
                    {sidebarOpen && <span>Invite Team</span>}
                    {sidebarOpen && <span className="ml-auto text-[8px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-medium">New</span>}
                  </div>
                  <div className={`flex items-center ${sidebarOpen ? "gap-2 px-3" : "justify-center px-0"} py-1.5 mx-1.5 text-[11px] text-text-secondary`}>
                    <FLIcon name="cog" className="w-4 h-4 opacity-65 shrink-0" />
                    {sidebarOpen && <span>Settings</span>}
                  </div>
                </div>

              </aside>

              {/* Main content */}
              <div className="flex-1 flex flex-col min-w-0" style={{ background: "rgba(255,255,255,0.12)" }}>
                {/* Global top bar — search + bell + avatar (with dropdown affordance) */}
                <div className="flex items-center gap-3 px-4 md:px-5 py-2 border-b border-white/30" style={{ background: "rgba(255,255,255,0.08)" }}>
                  {/* Search */}
                  <div className="flex items-center gap-2 flex-1 max-w-[280px] px-2.5 py-1 rounded-md border border-white/40" style={{ background: "rgba(255,255,255,0.4)" }}>
                    <FLIcon name="magnifying-glass" className="w-3.5 h-3.5 opacity-55" />
                    <span className="text-[10px] text-text-secondary flex-1">Search...</span>
                    <X className="w-2.5 h-2.5 text-text-secondary/50" strokeWidth={1.5} />
                    <span className="text-[9px] text-text-secondary/60 border border-white/50 rounded px-1 py-0.5 leading-none font-medium">K</span>
                  </div>

                  <div className="flex-1" />

                  {/* Toolbar icons */}
                  <div className="hidden md:flex items-center gap-2">
                    <div ref={notifsRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setNotifsOpen((o) => !o)}
                        aria-label="Notifications"
                        aria-expanded={notifsOpen}
                        className="relative flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/30 transition-colors"
                      >
                        <FLIcon name="bell-notification" className="w-4 h-4 opacity-55" />
                        {/* Unread count — accent pill so it picks up the
                         * landing's brand blue and pops against the glass. */}
                        <span
                          className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-1 rounded-full bg-accent text-accent-foreground text-[8px] font-semibold flex items-center justify-center leading-none ring-2 ring-white/60"
                        >
                          3
                        </span>
                      </button>
                      {notifsOpen && (
                        <div
                          /* bg-bg-primary (cream via cream-landing token
                           * override) instead of stark white so the
                           * dropdown harmonizes with the surrounding
                           * glass/cream product UI instead of reading
                           * as a separate component. Border + shadow
                           * still define the panel clearly.
                           *
                           * animate-dropdown-enter (globals.css) gives
                           * a 160ms drop-in with subtle scale so the
                           * panel lands instead of popping. */
                          className="absolute top-full right-0 mt-2 w-[280px] rounded-lg border border-black/[0.08] bg-bg-primary py-1 z-50 animate-dropdown-enter"
                          style={{ boxShadow: "0 12px 28px -8px rgba(0,0,0,0.22), 0 4px 8px -2px rgba(0,0,0,0.08)" }}
                        >
                          <div className="flex items-center justify-between px-3 py-2 border-b border-black/[0.06]">
                            <span className="text-[11px] font-semibold text-text-primary">Notifications</span>
                            <span className="text-[9px] text-text-secondary hover:text-accent cursor-pointer transition-colors">
                              Mark all read
                            </span>
                          </div>
                          <div ref={notifListRef} className="max-h-[260px] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {[
                              {
                                unread: true,
                                title: "Maya Reyes accepted your interview",
                                sub: "Senior Product Designer · 2m ago",
                              },
                              {
                                unread: true,
                                title: "Shortlist ready for Junior AI Engineer",
                                sub: "47 candidates classified · 1h ago",
                              },
                              {
                                unread: true,
                                title: "Maya Reyes added notes to a scorecard",
                                sub: "Senior PM debrief · 3h ago",
                              },
                              {
                                unread: false,
                                title: "Weekly hiring digest is ready",
                                sub: "5 roles · yesterday",
                              },
                            ].map((n, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 px-3 py-2 hover:bg-bg-tertiary cursor-pointer transition-colors"
                              >
                                <span
                                  className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                                    n.unread ? "bg-accent" : "bg-transparent"
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] text-text-primary leading-tight font-medium">
                                    {n.title}
                                  </p>
                                  <p className="text-[9px] text-text-secondary mt-0.5">{n.sub}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-black/[0.06] px-3 py-2">
                            <span className="text-[10px] text-accent hover:underline cursor-pointer font-medium">
                              View all notifications
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User avatar with dropdown affordance */}
                  <button className="flex items-center gap-1.5 pl-0.5 pr-1.5 py-0.5 rounded-full border border-white/30 hover:bg-white/30 transition-colors" style={{ background: "rgba(255,255,255,0.3)" }}>
                    <div
                      className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0"
                      /* Light sky blue (#D4E3F0) — same shade used at
                       * the top of the modal gradient and the about-
                       * page sky band. Slate text (#5A6B8F) ties the
                       * "Av" mark to the brand's primary color family. */
                      style={{ backgroundColor: "#D4E3F0" }}
                    >
                      <span
                        className="text-[13px] md:text-[15px] font-serif font-medium leading-none"
                        style={{ color: "#5A6B8F" }}
                      >
                        Av
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-text-secondary/70" strokeWidth={1.5} />
                  </button>
                </div>

                {activeTab === "shortlist" ? (
                <>
                {/* Header — title, action buttons, summary count pills */}
                <div className="px-4 md:px-5 pt-3 pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-semibold text-text-primary truncate">
                        Shortlisting results for &ldquo;Junior AI Software Engineer&rdquo;
                      </h3>
                      <p className="text-[10px] md:text-[11px] text-text-secondary mt-0.5">
                        Showing classified candidates from the latest evaluation.
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded bg-white/40 text-text-primary/70 text-[9px] md:text-[10px]">
                          Apr 24, 2026 4:27 PM
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button className="flex items-center justify-center w-7 h-7 rounded-md border border-white/30 text-text-secondary/70 hover:bg-white/30 transition-colors" style={{ background: "rgba(255,255,255,0.3)" }}>
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                      <button className="flex items-center gap-1.5 bg-accent text-accent-foreground text-[10px] md:text-[11px] font-medium px-2.5 py-1.5 rounded-md transition-colors">
                        <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                        New Shortlist
                      </button>
                    </div>
                  </div>
                  {/* Count pills removed — simplified per request (funnel below
                      still carries the Strong/Maybe/Low breakdown). */}
                </div>

                {/* Funnel card — stacked bar + legend. Each segment scales
                 * in from the left with a small stagger when the
                 * Shortlisting view first appears, so the funnel reads as
                 * "filling up" rather than instantly drawn. */}
                <style>{`
                  @keyframes funnelGrow {
                    from { transform: scaleX(0); }
                    to   { transform: scaleX(1); }
                  }
                  @keyframes funnelLabelFade {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                  }
                  .funnel-seg {
                    transform-origin: left center;
                    animation: funnelGrow 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
                  }
                  .funnel-seg > * {
                    animation: funnelLabelFade 350ms ease-out both;
                    animation-delay: 600ms;
                  }
                `}</style>
                <div className="mx-4 md:mx-5 mb-2 rounded-lg border border-white/40 px-3 py-2.5" style={{ background: "rgba(255,255,255,0.4)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] md:text-[11px] font-medium text-text-primary">Candidate funnel</span>
                    <span className="text-[9px] md:text-[10px] text-text-secondary">{DISPLAY_TOTAL} evaluated</span>
                  </div>
                  <div className="flex items-stretch gap-0.5 h-5 rounded overflow-hidden">
                    <div className="funnel-seg flex items-center justify-center text-[9px] md:text-[10px] font-semibold text-white" style={{ flex: DISPLAY_STRONG, background: "#69B982", minWidth: DISPLAY_STRONG > 0 ? 18 : 0, animationDelay: "0ms" }}>
                      <span>{DISPLAY_STRONG > 0 && DISPLAY_STRONG}</span>
                    </div>
                    <div className="funnel-seg flex items-center justify-center text-[9px] md:text-[10px] font-semibold text-white" style={{ flex: DISPLAY_MAYBE, background: "#D9924A", minWidth: DISPLAY_MAYBE > 0 ? 18 : 0, animationDelay: "120ms" }}>
                      <span>{DISPLAY_MAYBE > 0 && DISPLAY_MAYBE}</span>
                    </div>
                    <div className="funnel-seg flex items-center justify-center text-[9px] md:text-[10px] font-semibold text-white" style={{ flex: DISPLAY_LOW, background: "#9CA3AF", minWidth: DISPLAY_LOW > 0 ? 18 : 0, animationDelay: "240ms" }}>
                      <span>{DISPLAY_LOW > 0 && DISPLAY_LOW}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-[9px] md:text-[10px] text-text-secondary">
                    <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "#69B982" }} /> Strong fit ({DISPLAY_STRONG})</span>
                    <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "#D9924A" }} /> Maybe ({DISPLAY_MAYBE})</span>
                    <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "#9CA3AF" }} /> Low fit ({DISPLAY_LOW})</span>
                  </div>
                </div>

                {/* Two-column body — Filters (left) + candidate list (right). On
                 * mobile the filters column is hidden so the candidate list keeps
                 * full width; the funnel card and header above stay full-width. */}
                <div className="flex-1 flex min-h-0 border-t border-white/30">
                  {/* Filters column — collapsible sections with sample option
                   * chips. Toggling a chip adds the chip key to activeFilterChips
                   * (visual-only for the mockup; the candidate list isn't filtered
                   * by chip since real shortlisting would re-run server-side). */}
                  <aside className="hidden md:flex flex-col w-[220px] shrink-0 border-r border-white/30 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ background: "rgba(255,255,255,0.18)" }}>
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/30">
                      <span className="text-[12px] font-semibold text-text-primary">Filters</span>
                      {activeFilterChips.size > 0 && (
                        <button
                          onClick={() => setActiveFilterChips(new Set())}
                          className="text-[10px] text-accent hover:text-accent/80 transition-colors"
                        >
                          Clear ({activeFilterChips.size})
                        </button>
                      )}
                    </div>
                    {([
                      { key: "additional", label: "Additional criteria", chips: [], freeform: true },
                      { key: "location", label: "Location", chips: ["Remote", "United States", "Europe", "LATAM", "Asia"] },
                      { key: "job-title", label: "Job Title", chips: ["AI Engineer", "Full Stack", "Backend", "Frontend"] },
                      { key: "seniority", label: "Seniority", chips: ["Intern", "Junior", "Mid", "Senior", "Staff"] },
                      { key: "skills", label: "Skills", chips: ["Python", "TypeScript", "React", "PyTorch", "LangChain", "SQL"] },
                      { key: "companies", label: "Companies", chips: ["FAANG", "Y Combinator", "Series A–C", "Bootstrapped"] },
                      { key: "education", label: "Education", chips: ["BSc", "MSc", "PhD", "Bootcamp"] },
                      { key: "experience", label: "Total Experience", chips: ["0–2 yrs", "2–5 yrs", "5–10 yrs", "10+ yrs"] },
                    ] as const).map((section) => {
                      const isOpen = openFilterSections.has(section.key);
                      return (
                        <div key={section.key} className="border-b border-white/30 last:border-b-0">
                          <button
                            onClick={() => toggleFilterSection(section.key)}
                            className="flex items-center justify-between w-full px-4 py-2.5 cursor-pointer hover:bg-white/20 transition-colors"
                          >
                            <span className="text-[11px] font-semibold text-text-primary">{section.label}</span>
                            <ChevronDown className={`w-3 h-3 text-text-secondary/70 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} strokeWidth={1.5} />
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-3 pt-0.5">
                              {"freeform" in section ? (
                                <div className="px-2.5 py-2 rounded border border-white/40 text-[10px] text-text-secondary leading-snug" style={{ background: "rgba(255,255,255,0.4)" }}>
                                  e.g. &ldquo;Worked in startups&rdquo;; press Enter to add
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-1">
                                  {section.chips.map((chip) => {
                                    const chipKey = `${section.key}:${chip}`;
                                    const active = activeFilterChips.has(chipKey);
                                    return (
                                      <button
                                        key={chip}
                                        onClick={() => toggleFilterChip(chipKey)}
                                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                                          active
                                            ? "bg-accent/15 text-accent border-accent/30 font-medium"
                                            : "border-white/40 text-text-primary/70 hover:bg-white/30"
                                        }`}
                                        style={!active ? { background: "rgba(255,255,255,0.4)" } : {}}
                                      >
                                        {chip}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </aside>

                  {/* Right column — search + sort + bulk select + candidate rows */}
                  <div className="flex-1 flex flex-col min-w-0">
                    {/* Search + sort and bulk-select fit rows removed —
                        simplified per request; the candidate list scrolls on
                        its own below. */}

                    {/* Candidate rows — scrollable. useAutoAnimate
                     * on this container makes filtered-out rows fade
                     * + collapse and the rest slide up to fill the
                     * gap, instead of snapping. The keyed children
                     * (key={c.name}) below let the lib track each
                     * row's identity across filter changes. */}
                    <div ref={candidateListRef} className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {visibleResults.map((c) => {
                    const isAV = c.name === "Maya Reyes";
                    const isExpanded = expandedCandidate === c.name;
                    const fitMeta =
                      c.fit === "strong" ? { label: "Strong fit", bg: "rgba(105, 185, 130, 0.15)", color: "#2E7A4D", scoreColor: "#2E7A4D" } :
                      c.fit === "maybe"  ? { label: "Maybe",      bg: "rgba(217, 146, 74, 0.15)", color: "#A66B2C", scoreColor: "#A66B2C" } :
                                            { label: "Low fit",   bg: "rgba(120, 120, 130, 0.15)", color: "#6B6B70", scoreColor: "#6B6B70" };
                    /* Default green/red flags shown when a row is expanded.
                     * Generic enough to read as Junior-AI-Engineer flags;
                     * a per-candidate override could replace these later. */
                    const greenFlags = [
                      "Experience with FastAPI and AI integrations.",
                      "Hands-on experience with microservices architecture.",
                    ];
                    const redFlags = [
                      "No evidence of React UI experience.",
                      "Short professional tenure in relevant roles.",
                    ];
                    return (
                      <div key={c.name} className="border-b border-white/30 last:border-b-0">
                        <div
                          onClick={() => isAV ? setActiveTab("interview") : setExpandedCandidate(isExpanded ? null : c.name)}
                          className="flex items-start gap-2 px-4 md:px-5 py-2.5 transition-colors hover:bg-white/20 cursor-pointer"
                        >
                          <span className="inline-flex items-center justify-center w-3 h-3 rounded border border-white/60 mt-1 shrink-0" style={{ background: "rgba(255,255,255,0.4)" }} />
                          <img
                            src={c.avatar}
                            alt={c.initials}
                            width={32}
                            height={32}
                            loading="lazy"
                            className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[11px] md:text-xs font-semibold text-text-primary">{c.name}</span>
                              <FLIcon name="text-file" className="w-3 h-3 opacity-50" />
                              <span className="text-[9px] md:text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: fitMeta.bg, color: fitMeta.color }}>
                                {fitMeta.label}
                              </span>
                              {isAV && (
                                <span className="text-[8px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-medium">Click me</span>
                              )}
                            </div>
                            <div className="text-[9px] md:text-[10px] text-text-secondary mt-0.5 truncate">
                              {c.role} at {c.company}
                            </div>
                            <div className="flex items-start gap-1 mt-1 text-[9px] md:text-[10px] text-text-secondary/85 leading-snug">
                              <Sparkles className="w-2.5 h-2.5 mt-0.5 shrink-0 text-accent/70" strokeWidth={1.75} />
                              <span className={isExpanded ? "" : "line-clamp-2"}>{c.summary}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0 ml-1">
                            <span className="text-[11px] md:text-xs font-semibold tabular-nums" style={{ color: fitMeta.scoreColor }}>
                              {c.fitScore}%
                            </span>
                            <ChevronDown className={`w-3 h-3 text-text-secondary/60 transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`} strokeWidth={1.5} />
                          </div>
                        </div>
                        {/* Expanded panel — Green / Red flags wrapped in a
                         * subtle card so it reads as a separate evidence
                         * artefact rather than free-floating text. AV
                         * bypasses this since clicking AV opens the
                         * Interview Guide.
                         *
                         * The grid-template-rows trick (0fr ↔ 1fr) gives
                         * a smooth height transition without measuring
                         * pixels. The inner overflow-hidden div is what
                         * actually clips during the animation; the
                         * content stays mounted at full natural height. */}
                        <div
                          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                            isExpanded && !isAV
                              ? "grid-rows-[1fr]"
                              : "grid-rows-[0fr]"
                          }`}
                        >
                          <div className="overflow-hidden">
                          <div className="px-4 md:px-5 pb-3 pt-1">
                            <div
                              className="rounded-lg border border-white/40 px-3.5 md:px-4 py-3 md:py-3.5"
                              style={{ background: "rgba(255,255,255,0.4)" }}
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
                                <div>
                                  <div className="flex items-center gap-1.5 pb-1.5 border-b" style={{ borderColor: "rgba(105, 185, 130, 0.4)", color: "#2E7A4D" }}>
                                    <Flag className="w-3 h-3" strokeWidth={2} fill="currentColor" />
                                    <span className="text-[10px] md:text-[11px] font-semibold tracking-tight">Green flags</span>
                                  </div>
                                  <ul className="mt-2 space-y-1.5">
                                    {greenFlags.map((f, i) => (
                                      <li key={i} className="text-[9px] md:text-[10px] text-text-primary/85 leading-snug flex items-start gap-1.5">
                                        <span className="text-text-primary/40 shrink-0">–</span>
                                        <span>{f}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5 pb-1.5 border-b" style={{ borderColor: "rgba(206, 107, 82, 0.4)", color: "#B5503B" }}>
                                    <Flag className="w-3 h-3" strokeWidth={2} fill="currentColor" />
                                    <span className="text-[10px] md:text-[11px] font-semibold tracking-tight">Red flags</span>
                                  </div>
                                  <ul className="mt-2 space-y-1.5">
                                    {redFlags.map((f, i) => (
                                      <li key={i} className="text-[9px] md:text-[10px] text-text-primary/85 leading-snug flex items-start gap-1.5">
                                        <span className="text-text-primary/40 shrink-0">–</span>
                                        <span>{f}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                          </div>
                          </div>
                      </div>
                    );
                  })}
                      {visibleResults.length === 0 && (
                        <div className="px-4 md:px-5 py-8 text-center text-[10px] md:text-[11px] text-text-secondary">
                          No candidates match the selected fit categories.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                </>
                ) : activeTab === "candidates" ? (
                <>
                {/* ── Candidates database — flat table view, separate from
                 *   the AI-graded Shortlisting results above. Click on
                 *   Maya Reyes still navigates to the Interview Guide. */}
                <div className="flex items-center justify-between px-4 md:px-5 py-3">
                  <h3 className="text-sm md:text-base font-semibold text-text-primary">Candidates</h3>
                  <button className="flex items-center gap-1.5 bg-accent text-accent-foreground text-[10px] md:text-[11px] font-medium px-2.5 py-1.5 rounded-md transition-colors">
                    <FLIcon name="user-collaborate-group" className="w-3.5 h-3.5 brightness-0 invert" />
                    Add New Candidate
                  </button>
                </div>

                {/* Filter bar */}
                <div className="flex items-center gap-2 px-4 md:px-5 py-2 border-b border-white/30 relative">
                  <FLIcon name="filter-2" className="w-4 h-4 opacity-55" />
                  {([
                    { key: "status", value: statusFilter, set: setStatusFilter, options: ["All", "New", "Interviewed", "Hired", "Rejected"] },
                    { key: "score", value: scoreFilter, set: setScoreFilter, options: ["All Scores", "High (70%+)", "Medium (51-69%)", "Low (0-50%)"] },
                    { key: "job", value: jobFilter, set: setJobFilter, options: ["All Jobs", "Senior Product Designer", "Junior AI Software Engineer"] },
                  ] as const).map((filter) => (
                    <div key={filter.key} className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === filter.key ? null : filter.key)}
                        className="flex items-center gap-1 px-2 py-1 border border-white/30 rounded text-[10px] text-text-primary/70 cursor-pointer"
                        style={{ background: "rgba(255,255,255,0.3)" }}
                      >
                        {filter.value}
                        <ChevronDown className={`w-2.5 h-2.5 text-text-secondary transition-transform duration-150 ${openDropdown === filter.key ? "rotate-180" : ""}`} strokeWidth={1.5} />
                      </button>
                      {openDropdown === filter.key && (
                        /* Cream-tinted dropdown (bg-bg-primary) so the
                         * filter menu sits on the same palette as the
                         * rest of the product UI rather than popping
                         * as a stark white card. animate-dropdown-enter
                         * gives a 160ms drop-in instead of an instant
                         * pop. */
                        <div className="absolute top-full left-0 mt-1 min-w-[140px] whitespace-nowrap rounded-md border border-black/[0.08] bg-bg-primary py-1 z-50 animate-dropdown-enter" style={{ boxShadow: "0 12px 28px -8px rgba(0,0,0,0.18), 0 4px 8px -2px rgba(0,0,0,0.08)" }}>
                          {filter.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => { filter.set(opt); setOpenDropdown(null); }}
                              className={`flex items-center gap-2 w-full px-3 py-1.5 text-[10px] text-left transition-colors ${opt === filter.value ? "bg-accent/8 text-accent font-medium" : "text-text-primary/70 hover:bg-bg-tertiary"}`}
                            >
                              {opt === filter.value && <span className="text-accent text-[10px]">✓</span>}
                              {opt !== filter.value && <span className="w-3" />}
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="ml-auto flex items-center gap-1 px-2 py-1 border border-white/30 rounded text-[10px] text-text-primary/70" style={{ background: "rgba(255,255,255,0.3)" }}>
                    <FLIcon name="archive-box" className="w-3.5 h-3.5 opacity-55" />
                    Archived
                  </div>
                </div>

                {/* Candidate list — scrollable */}
                <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" onClick={() => openDropdown && setOpenDropdown(null)}>
                  {filteredCandidates.map((c) => (
                    <div
                      key={c.email}
                      onClick={c.name === "Maya Reyes" ? () => setActiveTab("interview") : undefined}
                      className={`flex items-center gap-3 px-4 md:px-5 py-2.5 border-b border-white/30 last:border-b-0 transition-colors hover:bg-white/20 ${c.name === "Maya Reyes" ? "cursor-pointer" : ""}`}
                    >
                      <img src={c.avatar} alt={c.initials} width={32} height={32} loading="lazy" className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] md:text-xs font-semibold text-text-primary truncate">{c.name}</span>
                          {c.name === "Maya Reyes" && (
                            <span className="text-[8px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-medium shrink-0">Click me</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] md:text-[10px] text-text-secondary truncate hidden md:inline">{c.email}</span>
                        </div>
                        <div className="text-[9px] md:text-[10px] text-text-secondary">
                          Job: Senior Product Designer -{"  "}Pre-Interview Fit:{" "}
                          {/* Tier-coloured score so the High / Medium / Low
                           * filter and the percentage agree visually. Same
                           * three-stop palette as the Shortlisting tab
                           * (sage / amber / neutral) — see fitMeta above. */}
                          <span
                            className="font-semibold"
                            style={{
                              color:
                                c.fitScore >= 70 ? "#2E7A4D" :
                                c.fitScore >= 51 ? "#A66B2C" :
                                                   "#6B6B70",
                            }}
                          >
                            {c.fitScore}%
                          </span>
                          {c.status && <span className="text-text-secondary">{" "}- {c.status}</span>}
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-1.5">
                        <FLIcon name="pencil-square" className="w-4 h-4 opacity-50" />
                        <FLIcon name="text-file" className="w-4 h-4 opacity-50" />
                        <FLIcon name="linkedin" className="w-4 h-4 opacity-50" />
                        <MoreHorizontal className="w-3.5 h-3.5 text-text-secondary/60" strokeWidth={1.5} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination footer */}
                <div className="flex items-center justify-between px-4 md:px-5 py-2 border-t border-white/30 text-[9px] md:text-[10px] text-text-secondary">
                  <div className="flex items-center gap-1">
                    Rows per page:
                    <span className="flex items-center gap-0.5 px-1 py-0.5 border border-white/30 rounded text-text-primary/70" style={{ background: "rgba(255,255,255,0.3)" }}>
                      10
                      <ChevronDown className="w-2 h-2" strokeWidth={1.5} />
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>1-{filteredCandidates.length} of {filteredCandidates.length}</span>
                    <div className="flex items-center gap-1">
                      <ChevronLeft className="w-3.5 h-3.5 text-text-secondary/60" strokeWidth={1.5} />
                      <span className="text-text-secondary/70">Previous</span>
                      <span className="text-text-secondary/70 ml-1">Next</span>
                      <ChevronRight className="w-3.5 h-3.5 text-text-secondary/60" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
                </>
                ) : activeTab === "interview" ? (
                <>
                {/* ── Interview Guide: Candidate Profile ── */}
                {renderProfileHeader("Interview Guide")}

                {/* Scrollable interview guide content */}
                <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {/* Interview style header */}
                  <div className="px-4 md:px-5 py-3 border-b border-white/30">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary mb-1">
                          <FLIcon name="multiple-stars" className="w-3.5 h-3.5 opacity-70" />
                          Interview Style: Execution Evidence
                        </div>
                        <p className="text-[10px] text-text-secondary">
                          Uncover proof of exceptional delivery. How candidates turn goals into measurable results.
                        </p>
                      </div>
                      <button onClick={regenerateGuide} className="flex items-center gap-1 px-2 py-1 rounded border border-white/30 text-[10px] text-text-primary/70 shrink-0 cursor-pointer hover:bg-white/20 transition-colors" style={{ background: "rgba(255,255,255,0.3)" }}>
                        <RotateCw className="w-3 h-3" strokeWidth={1.5} />
                        <span className="hidden md:inline">Regenerate Guide</span>
                      </button>
                    </div>
                  </div>

                  {/* Interview sections */}
                  {guideSections.map((section, sIdx) => (
                    <div key={sIdx} className="border-b border-white/30 last:border-b-0">
                      {/* Section header */}
                      <div className="flex items-center justify-between px-4 md:px-5 py-2.5">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] md:text-xs font-semibold text-text-primary">{section.title}</span>
                            <div className="flex items-center gap-1 text-[9px] text-text-secondary uppercase tracking-wider">
                              <Clock className="w-3 h-3" strokeWidth={1.5} />
                              {section.minutes} minutes
                            </div>
                          </div>
                          <p className="text-[9px] md:text-[10px] text-text-secondary mt-0.5 leading-relaxed">{section.goal}</p>
                        </div>
                        <ChevronUp className="w-3.5 h-3.5 text-text-secondary/60 shrink-0 ml-2" strokeWidth={1.5} />
                      </div>

                      {/* Question cards — draggable */}
                      <div className="px-4 md:px-5 pb-2.5 space-y-1.5">
                        {section.questions.map((q, qIdx) => (
                          <div
                            key={`${sIdx}-${qIdx}-${q.slice(0, 20)}`}
                            draggable
                            onDragStart={() => handleDragStart(sIdx, qIdx)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(sIdx, qIdx)}
                            className="flex items-start gap-2 rounded-md border border-white/30 px-2.5 py-2 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-sm"
                            style={{ background: "rgba(255,255,255,0.35)" }}
                          >
                            <GripVertical className="w-3 h-3 text-text-secondary/40 shrink-0 mt-0.5 hidden md:block" strokeWidth={1.5} />
                            <span className="text-[10px] text-text-primary flex-1 leading-relaxed">{q}</span>
                            <div className="hidden md:flex items-center gap-1 shrink-0 mt-0.5">
                              <FLIcon name="pencil-square" className="w-3 h-3 opacity-40" />
                              <RotateCw className="w-3 h-3 text-text-secondary/40" strokeWidth={1.5} />
                              <Trash2 className="w-3 h-3 text-text-secondary/40" strokeWidth={1.5} />
                            </div>
                          </div>
                        ))}
                        {section.allowAddQuestion && (
                          <div className="flex items-center gap-1 text-[10px] text-accent/70 px-2.5 py-1.5">
                            <Plus className="w-3 h-3" strokeWidth={1.5} />
                            Add Question
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Back / Next footer */}
                <div className="flex items-center justify-between px-4 md:px-5 py-2 border-t border-white/30">
                  <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-white/30 text-[10px] text-text-primary/70" style={{ background: "rgba(255,255,255,0.3)" }}>
                    <ChevronLeft className="w-3 h-3" strokeWidth={1.5} />
                    Back
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-accent text-accent-foreground text-[10px] font-medium">
                    Next
                    <ChevronRight className="w-3 h-3" strokeWidth={1.5} />
                  </div>
                </div>
                </>
                ) : (
                <>
                {/* ── Scorecard: Candidate Profile ── */}
                {renderProfileHeader("Scorecard")}

                {/* Scrollable scorecard content */}
                <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {/* Title section */}
                  <div className="px-4 md:px-5 py-3 border-b border-white/30">
                    <div className="text-sm md:text-base font-semibold text-text-primary mb-1.5">Interview with {scorecardData.candidate}</div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-text-secondary">Your Decision</span>
                      <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" className="shrink-0">
                          <path d="M1.5 12.5L5.57574 16.5757C5.81005 16.8101 6.18995 16.8101 6.42426 16.5757L9 14" stroke="currentColor" />
                          <path d="M16 7L12 11" stroke="currentColor" />
                          <path d="M7 12L11.5757 16.5757C11.8101 16.8101 12.1899 16.8101 12.4243 16.5757L22 7" stroke="currentColor" />
                        </svg>
                        {scorecardData.decision}
                      </span>
                    </div>
                    <div className="text-[10px] text-text-secondary">Scorecard Format: {scorecardData.format}</div>
                  </div>

                  {/* Main content — two column */}
                  <div className="flex gap-4 px-4 md:px-5 py-3">
                    {/* Left: description + scorecard body */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-text-secondary leading-relaxed mb-3">{scorecardData.description}</p>

                      {/* Glass scorecard card */}
                      <div className="rounded-lg border border-white/30 p-4 space-y-3" style={{ background: "rgba(255,255,255,0.35)" }}>
                        <div className="text-[11px] font-semibold text-text-primary">Overall Assessment</div>
                        {scorecardData.overallAssessment.map((p, i) => (
                          <p key={i} className="text-[10px] text-text-secondary leading-relaxed">{p}</p>
                        ))}

                        <div className="text-[11px] font-semibold text-text-primary pt-2">Pros</div>
                        <ul className="space-y-1.5">
                          {scorecardData.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-2 text-[10px] text-text-secondary leading-relaxed">
                              <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                              {pro}
                            </li>
                          ))}
                        </ul>

                        <div className="text-[11px] font-semibold text-text-primary pt-2">Cons</div>
                        <ul className="space-y-1.5">
                          {scorecardData.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-2 text-[10px] text-text-secondary leading-relaxed">
                              <span className="text-amber-500 mt-0.5 shrink-0">−</span>
                              {con}
                            </li>
                          ))}
                        </ul>

                        <p className="text-[10px] text-text-secondary leading-relaxed pt-2">{scorecardData.closingParagraph}</p>
                      </div>
                    </div>

                    {/* Right: action buttons — desktop only */}
                    <div className="hidden md:flex flex-col gap-2 w-[130px] shrink-0">
                      <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-accent text-accent-foreground text-[10px] font-medium">
                        <Sparkles className="w-3 h-3" strokeWidth={1.5} />
                        Fine Tune
                      </button>
                      <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-white/40 text-[10px] text-text-primary/70" style={{ background: "rgba(255,255,255,0.4)" }}>
                        Read Transcript
                      </button>
                      <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-white/40 text-[10px] text-text-primary/70" style={{ background: "rgba(255,255,255,0.4)" }}>
                        View Notes
                      </button>
                      <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-white/40 text-[10px] text-text-primary/70" style={{ background: "rgba(255,255,255,0.4)" }}>
                        <RotateCw className="w-3 h-3" strokeWidth={1.5} />
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 md:px-5 py-2 border-t border-white/30">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] text-text-primary/70">
                      <Copy className="w-3 h-3" strokeWidth={1.5} />
                      <span className="hidden md:inline">Copy Scorecard</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-text-primary/70">
                      <FileDown className="w-3 h-3" strokeWidth={1.5} />
                      <span className="hidden md:inline">Export PDF</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-white/30 text-[10px] text-text-primary/70" style={{ background: "rgba(255,255,255,0.3)" }}>
                    Unsubmit
                  </div>
                </div>
                </>
                )}
              </div>
              </>
              )}
            </div>
        </div>

        {/* ── Sidekick floating window — sibling of glass container; full width on mobile, 45% on desktop. The frosted-glass background, border + shadow stack mirror the main product card so it reads as part of the same surface family. Plays a fade-out + slight scale-down (`meet-leaving`) when Finish is clicked, then unmounts when the modal opens. ── */}
        {activeTab === "sidekick" && (
          <div
            /* Shadow is responsive: on mobile the card is near full-width and
               only ~16px from each screen edge, and the section's overflow clip
               cuts any shadow that reaches the viewport edge — so the mobile
               shadow is kept tight enough to fade within that 16px gap (no hard
               vertical cut line). On desktop the card floats over the dark Google
               Meet grid with room around it, so it keeps the strong deep shadow. */
            className={`absolute top-0 left-0 right-0 md:right-[55%] bottom-0 rounded-xl border border-black/[0.06] flex flex-col z-20 overflow-hidden
              shadow-[0_6px_16px_-6px_rgba(0,0,0,0.16),0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9),0_0_0_1px_rgba(0,0,0,0.05)]
              md:shadow-[0_32px_80px_-20px_rgba(0,0,0,0.45),0_16px_32px_-8px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.03),0_0_0_1px_rgba(0,0,0,0.04)]
              ${finishLeaving ? "meet-leaving" : ""}`}
            style={{
              /* Layered: a near-opaque base coat hides the dark Google Meet
               * grid behind it, plus a subtle linear gradient for
               * atmospheric depth. Dropped the previous 12px backdrop
               * blur — at 96-98% white opacity the blur was barely
               * visible anyway, and the per-frame composite over the
               * Meet hangout (which has moving avatars) was a real
               * cost. The opaque base hides the Meet grid completely. */
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(250,250,252,0.96) 100%)",
              /* boxShadow moved to responsive className above (mobile vs desktop). */
              /* Gentle exit when Finish opens the Wrap-Up modal: the
               * panel fades + slides down a touch so the AI assistant
               * "steps aside" while the user wraps up. The Meet area
               * stays visible behind it under the modal's backdrop. */
              opacity: finishInterviewOpen ? 0 : 1,
              transform: finishInterviewOpen
                ? "translateY(10px) scale(0.97)"
                : "translateY(0) scale(1)",
              pointerEvents: finishInterviewOpen ? "none" : "auto",
              transition:
                "opacity 360ms cubic-bezier(0.22, 1, 0.36, 1), transform 360ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {/* Top section — profile left, timer+status right. Inner
             * borders/fills use slate tints so they're visible against
             * the near-white panel background. */}
            <div className="flex items-center gap-3 px-3 md:px-4 py-3 border-b border-slate-200/70">
              {/* Left: profile + interviewing for */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <img src="/images/avatar.webp" alt="SL" className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-semibold text-text-primary truncate">Maya Reyes</span>
                      <span className="text-[9px] text-accent hover:underline cursor-pointer">View Profile</span>
                    </div>
                    <div className="text-[10px] text-text-secondary mt-0.5">
                      Interviewing for: <span className="font-medium text-text-primary">Senior Product Designer</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: timer card + status pills */}
              <div className="shrink-0 flex flex-col items-end gap-1.5">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 flex items-center gap-2">
                  <div className="text-base font-semibold text-text-primary leading-none tabular-nums">{timerMin}:{timerSec}</div>
                  <div className="flex items-center gap-1">
                    <Pause className="w-3 h-3 text-text-secondary/70" strokeWidth={1.5} />
                    <RotateCcw className="w-3 h-3 text-text-secondary/70" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] text-text-primary font-medium border border-slate-200 bg-slate-50">
                    Transcript
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] text-text-secondary border border-slate-200 bg-slate-50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* Live Assist card */}
            <div className="px-3 md:px-4 py-2.5 border-b border-slate-200/70">
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-accent" strokeWidth={2} />
                    <span className="text-[11px] text-text-primary font-semibold">Live Assist</span>
                  </div>
                </div>
                <p className="text-[9px] text-text-secondary mb-2 leading-snug">Use the buttons to request a follow-up or an interview tip.</p>
                <div className="flex items-center gap-2">
                  {/* Follow Up — slate. White surface + slate border +
                   * inset highlight + soft drop shadow so it reads as
                   * a tappable action, not a decorative tag. Active
                   * state inverts to a tinted fill with an inset
                   * "pressed" shadow. */}
                  <button
                    type="button"
                    onClick={() => triggerLiveAssist("followup")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all duration-150 hover:brightness-[0.97] active:translate-y-[0.5px]"
                    style={{
                      background: liveAssistMode === "followup"
                        ? "rgba(90, 107, 143, 0.14)"
                        : "white",
                      color: "#5A6B8F",
                      border: "1px solid rgba(90, 107, 143, 0.32)",
                      boxShadow: liveAssistMode === "followup"
                        ? "inset 0 1px 2px rgba(15, 25, 50, 0.10)"
                        : "0 1px 2px rgba(15, 25, 50, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    <MessageSquare className="w-3 h-3" strokeWidth={2} />
                    Follow Up
                  </button>
                  {/* Interview Coach — purple. Same button anatomy as
                   * Follow Up, just keyed to the coach color. */}
                  <button
                    type="button"
                    onClick={() => triggerLiveAssist("coach")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all duration-150 hover:brightness-[0.97] active:translate-y-[0.5px]"
                    style={{
                      background: liveAssistMode === "coach"
                        ? "rgba(139, 92, 246, 0.14)"
                        : "white",
                      color: "#7C3AED",
                      border: "1px solid rgba(139, 92, 246, 0.32)",
                      boxShadow: liveAssistMode === "coach"
                        ? "inset 0 1px 2px rgba(70, 30, 120, 0.10)"
                        : "0 1px 2px rgba(70, 30, 120, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    <Brain className="w-3 h-3" strokeWidth={2} />
                    Interview Coach
                  </button>
                </div>

                {/* Live Assist response — appears below the buttons
                 * when one is clicked. Tinted to match the active mode
                 * (slate for follow-up, purple for coach). Shows a
                 * "thinking" dot trio briefly, then the suggestion. */}
                {liveAssistMode && (
                  <div
                    className="mt-2 rounded-md border px-2.5 py-2 relative"
                    style={{
                      background: liveAssistMode === "followup"
                        ? "rgba(90, 107, 143, 0.06)"
                        : "rgba(139, 92, 246, 0.06)",
                      borderColor: liveAssistMode === "followup"
                        ? "rgba(90, 107, 143, 0.22)"
                        : "rgba(139, 92, 246, 0.22)",
                      animation: "liveAssistFade 220ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <style>{`
                      @keyframes liveAssistFade {
                        from { opacity: 0; transform: translateY(4px); }
                        to   { opacity: 1; transform: translateY(0); }
                      }
                      @keyframes liveAssistDots {
                        0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
                        40%           { opacity: 1;    transform: translateY(-1px); }
                      }
                    `}</style>
                    <button
                      type="button"
                      onClick={dismissLiveAssist}
                      aria-label="Dismiss Live Assist"
                      className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-black/[0.05] transition-colors"
                    >
                      <X className="w-2.5 h-2.5" strokeWidth={2} />
                    </button>
                    <div className="flex items-start gap-1.5 pr-4">
                      <Sparkles
                        className="w-2.5 h-2.5 mt-0.5 shrink-0"
                        strokeWidth={2}
                        style={{
                          color: liveAssistMode === "followup" ? "#5A6B8F" : "#7C3AED",
                        }}
                      />
                      {liveAssistTyping ? (
                        <div className="flex items-center gap-0.5 mt-1">
                          {[0, 1, 2].map((i) => (
                            <span
                              key={i}
                              className="inline-block w-1 h-1 rounded-full"
                              style={{
                                background: liveAssistMode === "followup" ? "#5A6B8F" : "#7C3AED",
                                animation: `liveAssistDots 1.1s ease-in-out ${i * 0.15}s infinite`,
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <p
                          /* Both modes render at the same readable
                           * 12px — earlier the follow-up text was too
                           * small to scan against the larger coach
                           * card. Unifying matches their visual
                           * weight in the panel. */
                          className="text-[12px] leading-snug font-medium"
                          style={{
                            color: liveAssistMode === "followup" ? "#3F4C66" : "#5B21B6",
                          }}
                        >
                          {liveAssistMode === "followup"
                            ? FOLLOWUP_SUGGESTIONS[liveAssistIdx.followup]
                            : COACH_TIPS[liveAssistIdx.coach]}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable interview sections — only this part scrolls */}
            <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {(() => {
                let globalIdx = 0;
                return sidekickSections.map((section, sIdx) => (
                  <div key={sIdx} className="border-b border-slate-200/70 last:border-b-0">
                    <div className="flex items-center justify-between px-3 md:px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-text-primary">{section.title}</span>
                        <span className="flex items-center gap-1 text-[8px] font-semibold text-text-secondary uppercase tracking-wider bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                          <Clock className="w-2.5 h-2.5" strokeWidth={1.5} />
                          {section.minutes} MINS
                        </span>
                      </div>
                      <ChevronDown className="w-3 h-3 text-text-secondary/50" strokeWidth={1.5} />
                    </div>
                    <div className="px-3 md:px-4 pb-2.5 space-y-1.5">
                      {section.questions.map((q, qIdx) => {
                        const myIdx = globalIdx++;
                        const isChecked = myIdx < sidekickChecked;
                        const isActive = myIdx === sidekickChecked;
                        return (
                          <div
                            key={qIdx}
                            className={`flex items-start gap-2 rounded-md px-2.5 py-2 border transition-colors duration-300 ${
                              isActive
                                ? "bg-accent/10 border-accent/30 ring-1 ring-accent/20"
                                : "bg-slate-50 border-slate-200/70"
                            }`}
                          >
                            <span
                              className={`shrink-0 mt-0.5 w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center transition-all duration-300 ${
                                isChecked
                                  ? "bg-accent border-accent"
                                  : isActive
                                    ? "border-accent/60 bg-white"
                                    : "border-neutral-300 bg-transparent"
                              }`}
                              style={isChecked ? { animation: "sidekickTick 0.4s ease-out" } : undefined}
                            >
                              {isChecked && (
                                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />
                              )}
                            </span>
                            <span
                              className={`text-[10px] leading-relaxed transition-colors duration-300 ${
                                isChecked
                                  ? "text-text-muted line-through decoration-text-muted/40"
                                  : "text-text-secondary"
                              }`}
                            >
                              {q}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
              <style>{`
                @keyframes sidekickTick {
                  0% { transform: scale(0.6); }
                  60% { transform: scale(1.15); }
                  100% { transform: scale(1); }
                }
              `}</style>
            </div>

            {/* Sticky footer */}
            <div className="flex items-center gap-2 px-3 md:px-4 py-2.5 border-t border-slate-200 bg-slate-50/70 shrink-0">
              <div className="flex-1 flex items-center px-3 py-2 rounded-md bg-white border border-slate-200">
                <span className="text-[10px] text-text-secondary/60">Take notes</span>
                <span className="w-[1px] h-3.5 bg-text-primary/40 animate-pulse ml-0.5" />
              </div>
              <button
                type="button"
                onClick={beginFinishInterview}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-red-600 text-white text-[10px] md:text-[11px] font-medium shrink-0 whitespace-nowrap hover:bg-red-700 transition-colors"
              >
                <Square className="w-2.5 h-2.5" strokeWidth={2.5} fill="currentColor" />
                Finish Interview
                <span className="hidden md:inline opacity-90">&amp; fill Scorecard</span>
              </button>
            </div>
          </div>
        )}

        {/* Finish Interview → Regenerate Scorecard modal. With Meet +
         * Sidekick unmounted, the modal sits alone in the product-card
         * area — no dark backdrop needed. Fades + scales in with an
         * expo-out curve so it feels deliberate. CTA stays disabled
         * until a decision is selected. */}
        {/* Shared keyframes for the Meet/Sidekick fade-out before the modal
         * appears. Mounted alongside the modal block so they live in one
         * place. The .meet-leaving class is applied during the 320ms
         * transition window before finishInterviewOpen flips. */}
        {activeTab === "sidekick" && (
          <style>{`
            /* Smoother Sidekick + Meet exit. Longer duration, gentler
             * Material-standard easing, plus a small blur and a more
             * generous scale-down so the panels feel like they
             * gracefully recede before the modal arrives. */
            @keyframes meetLeave {
              0%   { opacity: 1; transform: scale(1); filter: blur(0); }
              60%  { opacity: 0.4; }
              100% { opacity: 0; transform: scale(0.94); filter: blur(3px); }
            }
            .meet-leaving {
              animation: meetLeave 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
              transform-origin: center center;
              pointer-events: none;
              will-change: transform, opacity, filter;
            }
            @media (prefers-reduced-motion: reduce) {
              .meet-leaving { animation: none !important; opacity: 0; }
            }
          `}</style>
        )}
        {activeTab === "sidekick" && finishInterviewOpen && (
          <div
            /* Backdrop matches the hangout frame's height
             * (h-[340px] md:h-[560px]) and rounded-2xl corners — same
             * radius as the inner glass container that the Meet
             * frame sits in, so the dim+blur layer hugs the hangout
             * instead of bleeding into the air around it. */
            className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-30 h-[340px] md:h-[560px] rounded-2xl flex items-center justify-center p-4 md:p-6"
            style={{
              background: "rgba(15, 23, 42, 0.32)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          >
            <style>{`
              @keyframes modalEnter {
                0%   { opacity: 0; transform: translateY(12px) scale(0.96); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
              }
              .scorecard-modal {
                animation: modalEnter 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
                will-change: transform, opacity;
              }
              @media (prefers-reduced-motion: reduce) {
                .scorecard-modal { animation: none !important; }
              }
            `}</style>
            <div
              className="scorecard-modal relative w-full max-w-[480px] rounded-2xl bg-white border border-black/[0.06] overflow-hidden"
              style={{
                boxShadow: "0 32px 64px -12px rgba(0, 0, 0, 0.18), 0 16px 32px -8px rgba(0, 0, 0, 0.10), 0 0 0 1px rgba(0,0,0,0.04)",
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
                <div className="min-w-0">
                  <h3 className="text-[15px] font-semibold text-text-primary">Wrap Up Interview</h3>
                  <p className="text-[12px] text-text-secondary mt-1 leading-snug">
                    Choose your decision, confirm scorecard format, and add any preparation notes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFinishInterviewOpen(false)}
                  aria-label="Close"
                  className="shrink-0 -mr-1 -mt-1 p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>

              {/* Your Decision */}
              <div className="px-5 pt-2 pb-4">
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <div className="text-[12px] font-semibold text-text-primary">Your Decision</div>
                    <div className="text-[10px] text-text-muted mt-0.5">Selected style: Graded Decision</div>
                  </div>
                  <button type="button" className="text-[11px] text-accent hover:underline">Edit Style</button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {([
                    { key: "strong-no" as const, label: "Strong No", bg: "rgba(206, 107, 82, 0.18)", color: "#9C3E2A", activeBg: "#CE6B52", activeColor: "#FFFFFF" },
                    { key: "no" as const,        label: "No",        bg: "rgba(206, 107, 82, 0.10)", color: "#B5503B", activeBg: "#CE6B52", activeColor: "#FFFFFF" },
                    { key: "hire" as const,      label: "Hire",      bg: "rgba(105, 185, 130, 0.18)", color: "#2E7A4D", activeBg: "#4A9F69", activeColor: "#FFFFFF" },
                    { key: "strong-hire" as const, label: "Strong Hire", bg: "rgba(105, 185, 130, 0.28)", color: "#1F5A37", activeBg: "#2E7A4D", activeColor: "#FFFFFF" },
                  ]).map((d) => {
                    const active = finishDecision === d.key;
                    return (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => setFinishDecision(d.key)}
                        className="text-[12px] font-medium px-3 py-1.5 rounded-md transition-all duration-150"
                        style={{
                          background: active ? d.activeBg : d.bg,
                          color: active ? d.activeColor : d.color,
                          boxShadow: active ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                        }}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Scorecard Style */}
              <div className="px-5 py-4 border-t border-black/[0.06]">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-semibold text-text-primary">
                    Selected Scorecard Style: <span className="font-normal text-text-secondary">Summary + Pros/Cons</span>
                  </div>
                  <button type="button" className="text-[11px] text-accent hover:underline shrink-0 ml-3">Edit Style</button>
                </div>
                <p className="text-[11px] text-text-muted mt-1 leading-snug">
                  Executive summary with clear pros, cons, and final recommendation.
                </p>
              </div>

              {/* Preparation Notes */}
              <div className="px-5 py-4 border-t border-black/[0.06]">
                <div className="text-[12px] font-semibold text-text-primary mb-2">
                  Preparation Notes <span className="text-text-muted font-normal">(Optional)</span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Add any key points or context for your scorecard..."
                  className="w-full px-3 py-2 rounded-md border border-black/10 bg-bg-tertiary/40 text-[11px] text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-accent/40 focus:bg-white"
                />
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-black/[0.06] bg-bg-tertiary/30">
                <button
                  type="button"
                  className="text-[11px] font-medium px-3 py-1.5 rounded-md border border-black/10 bg-white text-text-primary hover:bg-bg-tertiary transition-colors"
                >
                  View Transcript
                </button>
                <button
                  type="button"
                  onClick={() => setFinishInterviewOpen(false)}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-md border border-black/10 bg-white text-text-primary hover:bg-bg-tertiary transition-colors"
                >
                  Prepare Later
                </button>
                <button
                  type="button"
                  disabled={finishDecision === null}
                  onClick={() => {
                    /* Close the wrap-up modal and jump straight to
                     * the Scorecard tab so the user lands on the
                     * draft they just prepped. */
                    setFinishInterviewOpen(false);
                    setActiveTab("scorecard");
                  }}
                  className={`text-[11px] font-medium px-3 py-1.5 rounded-md transition-colors ${
                    finishDecision === null
                      ? "bg-bg-tertiary text-text-muted cursor-not-allowed"
                      : "bg-accent text-accent-foreground hover:bg-accent/90"
                  }`}
                >
                  Prepare Draft Scorecard
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
