/* Self-hosted Tabler outline icons, vendored into public/icons/tabler from
 * @tabler/icons@3.44.0 (what the old jsDelivr "latest" URL resolved to on
 * 2026-06-09). Serving them locally removes ~25 cross-origin fetches from
 * the homepage and pins the artwork — "latest" could silently change shapes
 * under us. If a new icon name is added anywhere (TablerIcon call sites or
 * the FL_TO_TABLER maps in product/how sections), drop the matching SVG
 * from that same pinned version into public/icons/tabler/. */
export const ICON_BASE = "/icons/tabler";

export const cvs = [
  { name: "Sarah Chen", role: "Product Designer", rotation: -14, x: -520, yStart: -380, delay: 0, avatar: "/images/avatars/ru-women-44.jpg" },
  { name: "Marcus Johnson", role: "Frontend Engineer", rotation: 9, x: 480, yStart: -320, delay: 0.06, avatar: "/images/avatars/ru-men-32.jpg" },
  { name: "Priya Patel", role: "Data Analyst", rotation: -5, x: -150, yStart: -420, delay: 0.12, avatar: "/images/avatars/ru-women-68.jpg" },
  { name: "James Wilson", role: "UX Researcher", rotation: 12, x: 550, yStart: 180, delay: 0.03, avatar: "/images/avatars/ru-men-75.jpg" },
  { name: "Ana García", role: "Backend Engineer", rotation: -10, x: -580, yStart: 120, delay: 0.09, avatar: "/images/avatars/ru-women-90.jpg" },
  { name: "David Kim", role: "Product Manager", rotation: 6, x: 50, yStart: 280, delay: 0.15, avatar: "/images/avatars/ru-men-46.jpg" },
  { name: "Emma Brown", role: "ML Engineer", rotation: -7, x: 420, yStart: -80, delay: 0.05, avatar: "/images/avatars/ru-women-21.jpg" },
  { name: "Raj Mehta", role: "DevOps Engineer", rotation: 15, x: -380, yStart: 260, delay: 0.11, avatar: "/images/avatars/ru-men-83.jpg" },
  { name: "Lisa Zhang", role: "QA Engineer", rotation: -3, x: 250, yStart: 220, delay: 0.07, avatar: "/images/avatars/ru-women-56.jpg" },
  { name: "Tom Fischer", role: "Platform Eng", rotation: 11, x: -300, yStart: -150, delay: 0.13, avatar: "/images/avatars/ru-men-18.jpg" },
  { name: "Aisha Okafor", role: "Security Eng", rotation: -6, x: 320, yStart: -400, delay: 0.08, avatar: "/images/avatars/ru-women-33.jpg" },
  { name: "Carlos Vega", role: "Tech Lead", rotation: 8, x: -480, yStart: -220, delay: 0.16, avatar: "/images/avatars/ru-men-61.jpg" },
  { name: "Nina Kowalski", role: "QA Lead", rotation: -12, x: 160, yStart: -260, delay: 0.1, avatar: "/images/avatars/ru-women-79.jpg" },
];

export const outputCandidates = [
  {
    name: "Sarah Chen", role: "Product Designer", fit: 92,
    avatar: "/images/avatars/ru-women-44.jpg",
    skills: [
      { label: "System Design", color: "bg-blue-100 text-blue-700" },
      { label: "Design Systems", color: "bg-purple-100 text-purple-700" },
      { label: "Leadership", color: "bg-amber-100 text-amber-700" },
    ],
  },
  {
    name: "Marcus Johnson", role: "Product Designer", fit: 87,
    avatar: "/images/avatars/ru-men-32.jpg",
    skills: [
      { label: "Prototyping", color: "bg-indigo-100 text-indigo-700" },
      { label: "User Research", color: "bg-purple-100 text-purple-700" },
      { label: "Figma", color: "bg-green-100 text-green-700" },
    ],
  },
  {
    name: "Priya Patel", role: "Product Designer", fit: 81,
    avatar: "/images/avatars/ru-women-68.jpg",
    skills: [
      { label: "Interaction Design", color: "bg-amber-100 text-amber-700" },
      { label: "Accessibility", color: "bg-blue-100 text-blue-700" },
      { label: "Sketch", color: "bg-green-100 text-green-700" },
    ],
  },
  {
    name: "James Wilson", role: "Product Designer", fit: 78,
    avatar: "/images/avatars/ru-men-75.jpg",
    skills: [
      { label: "UX Research", color: "bg-pink-100 text-pink-700" },
      { label: "Figma", color: "bg-purple-100 text-purple-700" },
      { label: "Motion Design", color: "bg-amber-100 text-amber-700" },
    ],
  },
  {
    name: "Emma Brown", role: "Product Designer", fit: 74,
    avatar: "/images/avatars/ru-women-21.jpg",
    skills: [
      { label: "Visual Design", color: "bg-green-100 text-green-700" },
      { label: "Branding", color: "bg-indigo-100 text-indigo-700" },
      { label: "Illustration", color: "bg-blue-100 text-blue-700" },
    ],
  },
  {
    name: "David Kim", role: "Product Designer", fit: 71,
    avatar: "/images/avatars/ru-men-46.jpg",
    skills: [
      { label: "Design Ops", color: "bg-amber-100 text-amber-700" },
      { label: "Wireframing", color: "bg-blue-100 text-blue-700" },
      { label: "Usability Testing", color: "bg-green-100 text-green-700" },
    ],
  },
  {
    name: "Ana García", role: "Product Designer", fit: 68,
    avatar: "/images/avatars/ru-women-90.jpg",
    skills: [
      { label: "Information Architecture", color: "bg-blue-100 text-blue-700" },
      { label: "Responsive Design", color: "bg-indigo-100 text-indigo-700" },
      { label: "CSS", color: "bg-green-100 text-green-700" },
    ],
  },
  {
    name: "Tom Fischer", role: "Product Designer", fit: 65,
    avatar: "/images/avatars/ru-men-18.jpg",
    skills: [
      { label: "Service Design", color: "bg-purple-100 text-purple-700" },
      { label: "Workshop Facilitation", color: "bg-amber-100 text-amber-700" },
      { label: "Miro", color: "bg-blue-100 text-blue-700" },
    ],
  },
  {
    name: "Lisa Zhang", role: "Product Designer", fit: 62,
    avatar: "/images/avatars/ru-women-56.jpg",
    skills: [
      { label: "Data Viz", color: "bg-green-100 text-green-700" },
      { label: "Design Tokens", color: "bg-indigo-100 text-indigo-700" },
      { label: "Storybook", color: "bg-pink-100 text-pink-700" },
    ],
  },
];

export const diamondPath = "M397.89 0L0 229.72L397.89 459.44L795.79 229.72L397.89 0Z";
export const messaLine1 = "M397.89 83.77L443.75 110.24C393.07 139.49 352.62 162.83 301.94 192.09L256.1 165.62C306.76 136.35 347.21 113.03 397.89 83.77Z";
export const messaLine2a = "M190.93 256.19L246.17 224.3L200.33 197.82L145.08 229.72L190.93 256.19Z";
export const messaLine2b = "M246.69 288.39L499.5 142.43L547.1 169.92L294.31 315.88L246.69 288.39Z";
export const messaLine3 = "M350.12 348.09L602.92 202.13L650.52 229.63L397.73 375.59L350.12 348.09Z";
export const messaChevron = "M149.21 545.6L397.89 689.18L795.77 459.44L696.3 402.01L397.89 574.32L248.68 488.16L149.21 545.6Z";

export const stepData = [
  {
    iconName: "file-text",
    number: "01",
    title: "Know what to look for",
    description:
      "Messa analyzes the role and suggests the skill sets that matter, the questions that reveal them, and how to split focus across interviewers. Your team walks in with a plan, not a blank page.",
  },
  {
    iconName: "filter",
    number: "02",
    title: "Shortlist with confidence",
    description:
      "Messa reads the job description and distills the criteria. Your team approves. Every application scored against those criteria, with reasoning. Your team decides who moves forward.",
  },
  {
    iconName: "message",
    number: "03",
    title: "Stay sharp in the conversation",
    description:
      "Sidekick knows the candidate's profile and what your team is assessing, surfacing the right questions and follow-ups the moment they matter. The interviewers stay in control. Nothing important slips by.",
  },
  {
    iconName: "circle-check",
    number: "04",
    title: "Decide with evidence",
    description:
      "Your team makes the call. Messa drafts the scorecard from the conversation, grounded in evidence. Everyone decides from the same facts. Not impressions. Not vibes.",
  },
];

export const painPoints = [
  {
    stat: "300+",
    label: "Applications per role",
    sub: "Most never get read",
    source: "Ashby Talent Trends Report, 2026",
  },
  {
    stat: "2x",
    label: "More predictive",
    sub: "Structured vs. unstructured interviews",
    source: "Sackett et al., J. Applied Psychology (2022)",
  },
  {
    stat: "82%",
    label: "Of failed hires",
    sub: "Showed warning signs the interviewer ignored",
    source: "Leadership IQ",
  },
];

export const beforeAfter = [
  {
    label: "Shortlist",
    before: "Scroll through 200 CVs hoping for the best",
    after: "AI-scored shortlist in seconds",
  },
  {
    label: "Interview guide",
    before: "Generic prep, same questions across the panel",
    after: "Custom interview guide for every interviewer, built from the role and the candidate's background",
  },
  {
    label: "Sidekick",
    before: "Notetaker captures the call, doesn't help during the interview",
    after: "Sidekick guides every conversation in real time",
  },
  {
    label: "Scorecard",
    before: "Blank scorecard 30 min after the call, if it gets filled at all",
    after: "Per-skillset scorecard, pre-filled from the conversation. Edit, never start from scratch",
  },
  {
    label: "Coaching",
    before: "No feedback on your interviewing. Same blind spots, every time",
    after: "Private coaching after every interview: where you spent time, what you missed, what to sharpen",
  },
];

/* Real headshots for Mercedes + Alex (provided by the team); Emiliano
 * still falls back to the initials badge until we have a portrait.
 * All four logos are self-hosted under /images/logos (Craftsman+ tile
 * vendored from Brandfetch 2026-06-09, Satellogic from their site's
 * own 300px icon) — no third-party logo CDN at runtime. */
export const quotes = [
  {
    text: "With Messa, I went from scrambling to summarize interviews to submitting scorecards in minutes... with actual evidence to back every decision and alignment.",
    name: "Mercedes Foster",
    initials: "MF",
    role: "People Manager, TiendaMia",
    avatar: "/images/mercedes-foster.jpg",
    logo: "/images/logos/tiendamia.png",
    company: "TiendaMia",
  },
  {
    text: "Every conversation feels more structured with Sidekick, and the follow-up suggestions consistently improve our interviews.",
    name: "Alex Merutka",
    initials: "AM",
    role: "CEO, Craftsman+",
    avatar: "/images/alex-merutka.jpg",
    logo: "/images/logos/craftsmanplus.webp",
    company: "Craftsman+",
  },
  {
    text: "After using Messa regularly, it's hard to believe we could go back to what we were doing before. This is a gamechanger for efficiency and consistency in the hiring process.",
    name: "Emiliano Kargieman",
    initials: "EK",
    role: "CEO, Satellogic",
    avatar: "/images/emiliano-kargieman.webp",
    logo: "/images/logos/satellogic.png",
    company: "Satellogic",
  },
  {
    text: "Interviews feel more natural with Messa. It frees me up to focus on the candidate, then gives us a fast, detailed wrap up that helps improve the recruiting process.",
    name: "Diego Sternberg",
    initials: "DS",
    role: "CEO, Nexton",
    avatar: "/images/diego-sternberg.jpg",
    logo: "/images/logos/nexton.jpg",
    company: "Nexton",
  },
];

export const shortlistCandidates = [
  { name: "Charly Chaves", initials: "CC", avatar: "/images/avatars/pravatar-11.jpg", email: "charly@coderhouse.com", fitScore: 68, status: null },
  { name: "Martina C.", initials: "MC", avatar: "/images/avatars/pravatar-5.jpg", email: "martina@docfav.com", fitScore: 48, status: null },
  { name: "Ankrit Seth", initials: "AS", avatar: "/images/avatars/pravatar-33.jpg", email: "aseth@sentra.xyz", fitScore: 45, status: null },
  { name: "Pablo Armentano", initials: "PA", avatar: "/images/avatars/pravatar-12.jpg", email: "pablo@uink.digital", fitScore: 75, status: "Interview Prep" },
  { name: "Maya Reyes", initials: "MR", avatar: "/images/avatar.webp", email: "maya@reyes.studio", fitScore: 75, status: "Interview Prep" },
  { name: "Sarah Chen", initials: "SC", avatar: "/images/avatars/pravatar-47.jpg", email: "sarah.chen@linear.app", fitScore: 92, status: "Interview Prep" },
  { name: "Marcus Johnson", initials: "MJ", avatar: "/images/avatars/pravatar-53.jpg", email: "marcus@basecamp.com", fitScore: 87, status: "Interview Prep" },
  { name: "Priya Patel", initials: "PP", avatar: "/images/avatars/pravatar-23.jpg", email: "priya.patel@stripe.com", fitScore: 81, status: null },
  { name: "James Wilson", initials: "JW", avatar: "/images/avatars/pravatar-60.jpg", email: "jwilson@notion.so", fitScore: 74, status: null },
  { name: "Emma Thompson", initials: "ET", avatar: "/images/avatars/pravatar-9.jpg", email: "emma@netlify.com", fitScore: 64, status: null },
  { name: "David Kim", initials: "DK", avatar: "/images/avatars/pravatar-59.jpg", email: "david.kim@shopify.com", fitScore: 58, status: null },
  { name: "Ana García", initials: "AG", avatar: "/images/avatars/pravatar-25.jpg", email: "ana.garcia@mercury.com", fitScore: 71, status: null },
  { name: "Tom Fischer", initials: "TF", avatar: "/images/avatars/pravatar-14.jpg", email: "tom.fischer@airbnb.com", fitScore: 66, status: null },
  { name: "Lisa Wang", initials: "LW", avatar: "/images/avatars/pravatar-44.jpg", email: "lisa.wang@plaid.com", fitScore: 83, status: "Interview Prep" },
  { name: "Omar Hassan", initials: "OH", avatar: "/images/avatars/pravatar-57.jpg", email: "omar@datadog.com", fitScore: 55, status: null },
  { name: "Camila Ruiz", initials: "CR", avatar: "/images/avatars/pravatar-20.jpg", email: "camila.ruiz@ramp.com", fitScore: 79, status: "Interview Prep" },
  { name: "Raj Mehta", initials: "RM", avatar: "/images/avatars/pravatar-61.jpg", email: "raj@coinbase.com", fitScore: 62, status: null },
  { name: "Sophie Laurent", initials: "SL", avatar: "/images/avatars/pravatar-32.jpg", email: "sophie@figma.com", fitScore: 88, status: "Interview Prep" },
  { name: "Luca Bianchi", initials: "LB", avatar: "/images/avatars/pravatar-51.jpg", email: "luca@twilio.com", fitScore: 43, status: null },
  { name: "Nina Petrov", initials: "NP", avatar: "/images/avatars/pravatar-28.jpg", email: "nina.p@hashicorp.com", fitScore: 77, status: null },
];

/* Richer shortlisting dataset for the redesigned product mockup — adds
 * role/company/summary so each row can show "Role at Company" + an AI
 * blurb. Categorisation derives from fitScore: 70+ Strong, 51-69 Maybe,
 * <=50 Low. Distribution is realistic for an AI-graded pool: most
 * candidates land in Maybe/Low, only a handful clear the Strong bar.
 * Includes Maya Reyes so the click-to-interview interaction in
 * product-section keeps working.
 *
 * Avatars are self-hosted under /images/avatars (vendored once from
 * i.pravatar.cc). The ten rows that originally pointed at img=71–80 —
 * ids pravatar never served, so they 404'd even in production — were
 * remapped 2026-06-09 to vendored ids ≤70 unused by other rows
 * (71→1, 72→2, 73→3, 74→4, 75→6, 76→7, 77→8, 78→10, 79→13, 80→16). */
export const shortlistResults = [
  // Strong fit (3) — only the very top of the pool clears the bar
  { name: "Ervenst Noel", initials: "EN", avatar: "/images/avatars/pravatar-11.jpg", role: "Full Stack Developer", company: "Soundscope", fitScore: 78, summary: "Ervenst demonstrates proficiency in AI integration and full-stack development, with shipped LLM-backed features and clear evidence of production SQL." },
  { name: "Ateef Mahmud", initials: "AM", avatar: "/images/avatars/pravatar-33.jpg", role: "Co-Founder & CTO", company: "Synari", fitScore: 74, summary: "Ateef brings strong AI and API development skills with a focus on quantum computing; lacks long-term professional experience but shows compounding ownership." },
  { name: "Maya Reyes", initials: "MR", avatar: "/images/avatar.webp", role: "Senior Product Designer", company: "Carbon Direct", fitScore: 72, summary: "Maya pairs a strong product-design portfolio with hands-on AI tooling work — fast shipper, clear communicator, leans on systems thinking." },
  // Maybe (22) — solid candidates that need an interview to disambiguate
  { name: "Kummari Sai Kumar", initials: "KS", avatar: "/images/avatars/pravatar-12.jpg", role: "Machine Learning Intern", company: "Verzeo", fitScore: 68, summary: "Sai is technically proficient in AI and Python, with strong project experience, but lacks direct API development and React UI exposure crucial for the role." },
  { name: "Agustin Figueroa", initials: "AF", avatar: "/images/avatars/pravatar-60.jpg", role: "Software Developer (AI Engineering)", company: "CORADIR S.A", fitScore: 67, summary: "A promising AI engineer with solid backend and AI skills, but lacks documented side projects or React experience for a full-stack role." },
  { name: "Prateek Ranka", initials: "PR", avatar: "/images/avatars/pravatar-53.jpg", role: "Fullstack Developer & Researcher", company: "USC Information Sciences Institute", fitScore: 66, summary: "Prateek shows solid AI and software engineering skills through academic projects, but his short job tenures may impact readiness for fast-paced roles." },
  { name: "Ramesh Ravula", initials: "RR", avatar: "/images/avatars/pravatar-61.jpg", role: "Python Full Stack Developer", company: "BCBS", fitScore: 65, summary: "Experienced Python developer with strong AI integration skills; may be overqualified for junior role's exploratory focus." },
  { name: "Charly Chaves", initials: "CC", avatar: "/images/avatars/pravatar-14.jpg", role: "Backend Engineer", company: "Coderhouse", fitScore: 64, summary: "Charly's backend foundations are solid but AI exposure is limited to coursework — would need ramp time on the model layer." },
  { name: "Emma Thompson", initials: "ET", avatar: "/images/avatars/pravatar-9.jpg", role: "Frontend Engineer", company: "Netlify", fitScore: 63, summary: "Strong React fundamentals and a track record on developer-tools UIs; AI/ML background is thin and self-taught." },
  { name: "Tom Fischer", initials: "TF", avatar: "/images/avatars/pravatar-51.jpg", role: "Software Engineer II", company: "Airbnb", fitScore: 62, summary: "Reliable shipper at scale, good systems intuition; portfolio doesn't yet show greenfield AI work." },
  { name: "Sarah Chen", initials: "SC", avatar: "/images/avatars/pravatar-47.jpg", role: "Software Engineer", company: "Linear", fitScore: 61, summary: "Sarah brings developer-tools polish and strong async collaboration; AI exposure is via internal LLM tooling rather than shipped product." },
  { name: "Marcus Johnson", initials: "MJ", avatar: "/images/avatars/pravatar-63.jpg", role: "Senior Engineer", company: "Basecamp", fitScore: 60, summary: "Marcus is a calm, opinionated builder; less depth on the model side but strong engineering fundamentals would translate quickly." },
  { name: "David Kim", initials: "DK", avatar: "/images/avatars/pravatar-59.jpg", role: "Software Engineer", company: "Shopify", fitScore: 59, summary: "Generalist engineer with e-commerce depth; AI familiarity limited to LLM-prompting on internal tools." },
  { name: "Priya Patel", initials: "PP", avatar: "/images/avatars/pravatar-23.jpg", role: "Backend Engineer", company: "Stripe", fitScore: 59, summary: "Priya has strong distributed-systems chops; AI experience is mostly through internal Stripe ML tooling and would need to be assessed live." },
  { name: "James Wilson", initials: "JW", avatar: "/images/avatars/pravatar-15.jpg", role: "Senior Frontend Engineer", company: "Notion", fitScore: 58, summary: "James ships highly polished UI; needs assessment on whether his backend AI integration depth matches the role's full-stack expectation." },
  { name: "Omar Hassan", initials: "OH", avatar: "/images/avatars/pravatar-57.jpg", role: "Backend Developer", company: "Datadog", fitScore: 57, summary: "Strong on distributed systems and observability; AI exposure mostly through OSS contributions." },
  { name: "Ana García", initials: "AG", avatar: "/images/avatars/pravatar-25.jpg", role: "Full Stack Engineer", company: "Mercury", fitScore: 57, summary: "Ana ships fast in fintech UI; AI work limited to internal copilots — needs an interview to gauge depth on the model layer." },
  { name: "Raj Mehta", initials: "RM", avatar: "/images/avatars/pravatar-44.jpg", role: "Software Engineer", company: "Coinbase", fitScore: 56, summary: "Solid CS fundamentals and typescript depth; ML coursework but no shipped AI features." },
  { name: "Lisa Wang", initials: "LW", avatar: "/images/avatars/pravatar-42.jpg", role: "Engineer", company: "Plaid", fitScore: 55, summary: "Lisa has strong API design instincts; her AI involvement is consultative rather than hands-on building." },
  { name: "Nina Petrov", initials: "NP", avatar: "/images/avatars/pravatar-28.jpg", role: "Senior Software Engineer", company: "HashiCorp", fitScore: 54, summary: "Nina brings infra depth and reliability mindset; AI exposure is through OSS tooling rather than product features." },
  { name: "Camila Ruiz", initials: "CR", avatar: "/images/avatars/pravatar-20.jpg", role: "Full Stack Engineer", company: "Ramp", fitScore: 53, summary: "Camila ships polished UI quickly; AI/ML experience limited to a hackathon project — may need mentorship on production model integration." },
  { name: "Sophie Laurent", initials: "SL", avatar: "/images/avatars/pravatar-32.jpg", role: "Product Engineer", company: "Figma", fitScore: 53, summary: "Sophie's design-engineering depth is rare; AI side is a stretch and would likely require pairing in the first months." },
  { name: "Tomás Ferreira", initials: "TF", avatar: "/images/avatars/pravatar-68.jpg", role: "Backend Developer", company: "Nubank", fitScore: 52, summary: "Tomás knows the JVM and event-driven systems cold; AI exposure is greenfield — strong engineer who could grow into the role." },
  { name: "Maya Iyer", initials: "MI", avatar: "/images/avatars/pravatar-39.jpg", role: "Software Engineer", company: "Cloudflare", fitScore: 51, summary: "Maya brings edge-runtime depth; her AI exposure is mostly through Workers AI bindings — solid but narrow." },
  { name: "Felipe Costa", initials: "FC", avatar: "/images/avatars/pravatar-64.jpg", role: "Engineer", company: "Loft", fitScore: 51, summary: "Felipe ships product features at pace; AI work is limited to chat-style integrations and not deep enough yet for the role." },
  // Low fit (22) — solid engineers who don't match the AI-junior brief
  { name: "Daniel Park", initials: "DP", avatar: "/images/avatars/pravatar-65.jpg", role: "Mobile Developer", company: "Robinhood", fitScore: 49, summary: "Daniel's strengths are mobile-native; AI integration depth is limited and not shipped to production." },
  { name: "Isabella Rossi", initials: "IR", avatar: "/images/avatars/pravatar-24.jpg", role: "Frontend Engineer", company: "Spotify", fitScore: 48, summary: "Strong UI engineering background; AI/ML resume is sparse and reads as exploratory rather than hands-on." },
  { name: "Luca Bianchi", initials: "LB", avatar: "/images/avatars/pravatar-51.jpg", role: "Junior Developer", company: "Twilio", fitScore: 47, summary: "Early-career engineer with limited project breadth; AI exposure is purely tutorial-level at this stage." },
  { name: "Hiroshi Tanaka", initials: "HT", avatar: "/images/avatars/pravatar-66.jpg", role: "Backend Engineer", company: "Mercari", fitScore: 46, summary: "Hiroshi's backend skills are strong, but his portfolio doesn't show AI-feature delivery." },
  { name: "Olivia Brown", initials: "OB", avatar: "/images/avatars/pravatar-49.jpg", role: "Junior Engineer", company: "Klaviyo", fitScore: 45, summary: "Olivia is early-career with strong fundamentals; AI exposure remains coursework-level." },
  { name: "Santiago Pérez", initials: "SP", avatar: "/images/avatars/pravatar-58.jpg", role: "Frontend Developer", company: "Mercado Libre", fitScore: 45, summary: "Santiago ships clean React UI; AI integration appears only via AWS managed services, not custom model work." },
  { name: "Aisha Khan", initials: "AK", avatar: "/images/avatars/pravatar-22.jpg", role: "Software Engineer", company: "Pinterest", fitScore: 44, summary: "Aisha is a steady contributor on internal tools; AI exposure is light and feature-flagged at best." },
  { name: "Leo Martinez", initials: "LM", avatar: "/images/avatars/pravatar-67.jpg", role: "Junior Developer", company: "Rappi", fitScore: 43, summary: "Leo has 1.5 years on a small product team; AI experience is a single side project that wasn't shipped." },
  { name: "Mia Andersson", initials: "MA", avatar: "/images/avatars/pravatar-26.jpg", role: "Backend Engineer", company: "Klarna", fitScore: 43, summary: "Mia's resume reads as fintech-focused; AI integration depth is shallow and tooling-level." },
  { name: "Carlos Mendoza", initials: "CM", avatar: "/images/avatars/pravatar-69.jpg", role: "Software Engineer", company: "Globant", fitScore: 42, summary: "Carlos has consultancy experience across stacks; AI work is tutorial-grade and not productionised." },
  { name: "Rebecca Stone", initials: "RS", avatar: "/images/avatars/pravatar-27.jpg", role: "Engineer", company: "Twilio", fitScore: 41, summary: "Rebecca knows messaging infra well; AI exposure limited to internal hackathons." },
  { name: "Yuki Sato", initials: "YS", avatar: "/images/avatars/pravatar-37.jpg", role: "Junior Engineer", company: "LINE", fitScore: 40, summary: "Yuki has strong mobile JS depth; lack of AI portfolio makes this a stretch for the role." },
  { name: "Mateo Silva", initials: "MS", avatar: "/images/avatars/pravatar-70.jpg", role: "Software Engineer", company: "PedidosYa", fitScore: 39, summary: "Mateo ships product features at a steady pace; AI integration appears only via 3rd-party SDKs." },
  { name: "Chloe Dupont", initials: "CD", avatar: "/images/avatars/pravatar-29.jpg", role: "Frontend Engineer", company: "BlaBlaCar", fitScore: 38, summary: "Chloe's frontend craft is good; AI work isn't represented in any shipped feature." },
  { name: "Arjun Reddy", initials: "AR", avatar: "/images/avatars/pravatar-36.jpg", role: "Software Engineer", company: "Razorpay", fitScore: 37, summary: "Arjun has solid fintech systems experience; AI/ML work absent from his portfolio." },
  { name: "Sofia Müller", initials: "SM", avatar: "/images/avatars/pravatar-30.jpg", role: "Junior Engineer", company: "N26", fitScore: 36, summary: "Sofia is early-career; AI exposure consists of one bootcamp module." },
  { name: "Pedro Almeida", initials: "PA", avatar: "/images/avatars/pravatar-1.jpg", role: "Software Engineer", company: "iFood", fitScore: 35, summary: "Pedro brings high-throughput backend depth; the AI side of the role isn't reflected in his resume." },
  { name: "Hannah Kim", initials: "HK", avatar: "/images/avatars/pravatar-31.jpg", role: "Frontend Engineer", company: "Toss", fitScore: 34, summary: "Hannah's React/Next fluency is strong; AI exposure isn't visible beyond tutorial demos." },
  { name: "Diego Ramirez", initials: "DR", avatar: "/images/avatars/pravatar-2.jpg", role: "Junior Developer", company: "Belvo", fitScore: 32, summary: "Diego has 1 year of professional experience; not yet at the bar for the role's AI expectations." },
  { name: "Eva Nilsson", initials: "EN", avatar: "/images/avatars/pravatar-35.jpg", role: "Software Engineer", company: "Bolt", fitScore: 30, summary: "Eva's mobility-platform experience is interesting; AI work is absent from her trajectory." },
  { name: "Kai Wong", initials: "KW", avatar: "/images/avatars/pravatar-3.jpg", role: "Backend Engineer", company: "Sea Limited", fitScore: 28, summary: "Kai's strengths are SEA marketplace systems; AI integration isn't part of his recent work." },
  { name: "Julia Becker", initials: "JB", avatar: "/images/avatars/pravatar-38.jpg", role: "Junior Engineer", company: "GetYourGuide", fitScore: 25, summary: "Julia is early-career and the AI dimension of the role isn't represented in her work history." },
  { name: "Andrei Volkov", initials: "AV", avatar: "/images/avatars/pravatar-4.jpg", role: "QA Engineer", company: "JetBrains", fitScore: 24, summary: "Andrei's strengths are in test automation; software-engineering depth and AI experience are both light." },
  { name: "Mei Lin", initials: "ML", avatar: "/images/avatars/pravatar-40.jpg", role: "Frontend Developer", company: "Tencent", fitScore: 23, summary: "Mei has strong CSS instincts; backend and AI dimensions of the role are absent from her resume." },
  { name: "Gabriel Souza", initials: "GS", avatar: "/images/avatars/pravatar-6.jpg", role: "Junior Backend Engineer", company: "Dock", fitScore: 22, summary: "Gabriel is in his first role; AI familiarity is at the tutorial level only." },
  { name: "Zara Ahmed", initials: "ZA", avatar: "/images/avatars/pravatar-41.jpg", role: "Mobile Developer", company: "Careem", fitScore: 21, summary: "Zara's portfolio is mobile-first; web and AI sides of the role aren't reflected in her work." },
  { name: "Niklas Hoffmann", initials: "NH", avatar: "/images/avatars/pravatar-7.jpg", role: "Junior Engineer", company: "Trade Republic", fitScore: 20, summary: "Niklas is early-career on a fintech dashboard team; no AI work and limited backend depth." },
  { name: "Priscila Lima", initials: "PL", avatar: "/images/avatars/pravatar-43.jpg", role: "Frontend Engineer", company: "Quinto Andar", fitScore: 19, summary: "Priscila's strengths are in real-estate UX; the AI engineering bar is a stretch." },
  { name: "Ravi Sharma", initials: "RS", avatar: "/images/avatars/pravatar-8.jpg", role: "Junior Developer", company: "Swiggy", fitScore: 18, summary: "Ravi has 8 months on a delivery-app team; AI work is absent from his trajectory." },
  { name: "Linnea Berg", initials: "LB", avatar: "/images/avatars/pravatar-45.jpg", role: "Software Engineer Intern", company: "Spotify", fitScore: 17, summary: "Linnea is currently interning; not yet at the bar for a junior full-time role with AI focus." },
  { name: "Joon-ho Park", initials: "JP", avatar: "/images/avatars/pravatar-10.jpg", role: "Junior Backend Engineer", company: "Coupang", fitScore: 16, summary: "Joon-ho's recent work is on internal admin tooling; AI exposure isn't represented." },
  { name: "Helena Costa", initials: "HC", avatar: "/images/avatars/pravatar-46.jpg", role: "Junior Frontend Developer", company: "OLX", fitScore: 15, summary: "Helena is six months into her first role; AI/ML side of the role is well outside her current scope." },
  { name: "Bruno Vargas", initials: "BV", avatar: "/images/avatars/pravatar-13.jpg", role: "Junior Software Engineer", company: "Despegar", fitScore: 14, summary: "Bruno's experience is travel-platform UI; AI work is absent and the engineering bar is light." },
  { name: "Nadia Hakim", initials: "NH", avatar: "/images/avatars/pravatar-48.jpg", role: "Frontend Intern", company: "Careem", fitScore: 13, summary: "Nadia is an intern with limited shipped product experience; the role is a stretch on multiple dimensions." },
  { name: "Erik Lindqvist", initials: "EL", avatar: "/images/avatars/pravatar-16.jpg", role: "Junior Developer", company: "Klarna", fitScore: 12, summary: "Erik has 6 months on a payments admin team; AI exposure is absent from his work." },
  { name: "Camila Vidal", initials: "CV", avatar: "/images/avatars/pravatar-50.jpg", role: "Frontend Engineer Intern", company: "Mercado Libre", fitScore: 11, summary: "Camila is interning on a UI team; both senior engineering bar and AI dimension are out of reach for now." },
];

export const interviewGuideSections = [
  {
    title: "Introduction & Setup",
    minutes: 5,
    goal: "Set a focused, performance-oriented tone and frame the conversation around Maya\u2019s most recent work and impact.",
    questions: [
      "Briefly introduce yourself, the company stage (1\u201310 people), and how this role is critical to fast, high-quality product execution.",
      "Set expectations: this conversation will focus on specific projects, concrete outcomes, and how Maya operates under pressure and ambiguity.",
      "Ask for a very short context-setting overview of what she\u2019s been focused on in the last 12\u201318 months at Carbon Direct and Pachama, to anchor later questions.",
    ],
    allowAddQuestion: false,
  },
  {
    title: "Recent Wins",
    minutes: 15,
    goal: "Validate Maya\u2019s recent track record of shipping high-impact product design work in technical domains, understand her personal contribution vs. team speed, and assess execution speed and quality.",
    questions: [
      "Walk me through a recent product you shipped at Carbon Direct or Pachama that you\u2019re most proud of. How did you move it from problem definition to shipped, and what measurable impact did it have?",
      "In one of your recent projects in climate/data products, when timelines were tight, what trade-offs did you personally make in the design to ship on time without sacrificing quality? What was the result?",
      "Tell me about a time you significantly elevated the quality or clarity of a complex workflow or interface (for example, a data-heavy or technical view). What exactly did you change, and how did you know it worked?",
    ],
    allowAddQuestion: true,
  },
  {
    title: "Overcoming Challenges",
    minutes: 15,
    goal: "Assess resilience, ownership, and how Maya responds when projects go off track or face major constraints in a startup-like environment.",
    questions: [
      "Tell me about a recent project where you missed a target, had to cut scope, or the outcome wasn\u2019t what you expected. What exactly happened, and what did you personally do after realizing it was off track?",
      "Think of a time at Pachama or Carbon Direct when you faced strong pushback from Product or Engineering on a design direction. How did you handle it, and what was the final outcome for the product?",
      "Describe a moment when you had to deliver under significant ambiguity or changing requirements. How did you keep moving forward, and what shipped in the end?",
    ],
    allowAddQuestion: true,
  },
  {
    title: "Scale & Impact",
    minutes: 10,
    goal: "Understand how Maya scales her impact beyond individual screens \u2014 through systems, processes, and reusable patterns \u2014 especially relevant in a small, fast-moving startup.",
    questions: [
      "Walk me through a specific time you created or evolved a design system or reusable pattern library. What problem were you solving, what exactly did you implement, and how did it change the team\u2019s speed or consistency?",
      "Describe a concrete example where you took something that worked in one part of the product and scaled it across other surfaces or teams. How did you drive that adoption and what measurable impact did it have?",
    ],
    allowAddQuestion: true,
  },
  {
    title: "Collaboration in Execution",
    minutes: 10,
    goal: "Evaluate how Maya drives execution through others \u2014 PMs, engineers, leadership \u2014 and how she balances conviction with openness in a highly technical environment.",
    questions: [
      "Tell me about a specific project where you and Engineering had to ship quickly. How did you collaborate day-to-day, make decisions together, and keep quality high while moving fast?",
      "Share an example where you strongly believed in a design direction that wasn\u2019t obvious to others. How did you advocate for it, what feedback did you receive, and what was the final outcome?",
    ],
    allowAddQuestion: true,
  },
  {
    title: "Wrap Up",
    minutes: 5,
    goal: "Surface Maya\u2019s self-awareness, learning speed, and motivation, and leave space for clarifying questions on alignment and expectations.",
    questions: [
      "Looking back over the last 2\u20133 years, what\u2019s one execution mistake you\u2019re intentionally not repeating, and what changed in how you work because of it?",
      "What kind of environment and partnership with Product and Engineering brings out the best in your execution and design quality?",
      "Provide space for Maya\u2019s questions, then briefly summarize what you\u2019ve learned about how she ships, where she\u2019s strongest, and any open questions you\u2019ll be exploring with the broader team.",
    ],
    allowAddQuestion: false,
  },
];

export const scorecardData = {
  candidate: "Maya Reyes",
  decision: "STRONG HIRE",
  format: "Summary + Pros/Cons",
  description: "This is your Scorecard Draft. If you want you can make edits directly to the scorecard content and hit Fine Tune to incorporate your changes naturally.",
  overallAssessment: [
    "Maya demonstrated a strong command of end-to-end product design execution throughout the interview. Her work at Carbon Direct and Pachama showed consistent ability to take ambiguous problems and ship high-quality solutions under tight timelines. She articulated clear trade-offs she made in her design decisions, backed by measurable outcomes like reduced onboarding time and improved data clarity in complex environmental dashboards.",
    "Her approach to team collaboration stood out \u2014 she described close partnership with engineering and product, with specific examples of navigating pushback and aligning stakeholders through data and prototypes rather than opinion. Her track record of building and evolving design systems shows she thinks beyond individual screens.",
  ],
  pros: [
    "Exceptional execution speed with evidence of shipping complex data products in compressed timelines",
    "Strong systems thinking \u2014 built reusable pattern libraries that measurably improved team velocity",
    "Effective cross-functional collaborator who navigates disagreements with data and prototypes",
  ],
  cons: [
    "Limited experience in consumer-facing products \u2014 all recent work is B2B/enterprise",
    "Could go deeper on accessibility practices and inclusive design methodology",
  ],
  closingParagraph: "Overall, Maya is a strong fit for a senior product design role in a fast-moving startup environment. Her execution-oriented mindset, comfort with ambiguity, and ability to scale her impact through systems make her well-suited to an early-stage team where speed and quality must coexist.",
};

export const sidekickSections = [
  { title: "Introduction", minutes: 5, questions: [
    "Introduce yourself and the company stage",
    "Set expectations for the conversation",
    "Ask for a brief overview of recent work",
    "What attracted you to this role specifically?",
  ]},
  { title: "Recent Wins", minutes: 15, questions: [
    "Walk me through a recent product you shipped that you're most proud of",
    "When timelines were tight, what trade-offs did you personally make?",
    "Tell me about a time you elevated the quality of a complex workflow",
    "How did you measure success for that project?",
    "What was the most unexpected challenge you faced during delivery?",
  ]},
  { title: "Overcoming Challenges", minutes: 15, questions: [
    "Tell me about a project where you missed a target or had to cut scope",
    "When you faced strong pushback on a design direction, how did you handle it?",
    "Describe a moment when you delivered under significant ambiguity",
    "How do you prioritize when everything feels urgent?",
    "Tell me about a time you had to say no to a stakeholder",
  ]},
  { title: "Scale & Impact", minutes: 10, questions: [
    "Walk me through a time you created or evolved a design system",
    "Describe an example where you scaled something across teams",
    "How do you ensure consistency when multiple designers work in parallel?",
    "What's your approach to documentation and handoff at scale?",
  ]},
  { title: "Closing", minutes: 5, questions: [
    "Is there anything we didn't cover that you'd like to share?",
    "What questions do you have about the team or company?",
    "Walk me through your ideal first 90 days in this role",
  ]},
];
