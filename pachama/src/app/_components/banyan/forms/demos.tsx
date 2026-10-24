"use client";

import { useCallback, useId, useRef, useState } from "react";
import { MdAdd, MdArrowForward, MdDelete, MdDownload, MdEdit, MdMoreHoriz, MdSearch } from "react-icons/md";
import { useBeat } from "../autoplay";
import { Button } from "../button";
import { Autocomplete } from "./autocomplete";
import { Checkbox, Radio, Switch } from "./choice";
import { IconButton } from "./icon-button";
import { TextInput } from "./input";
import type { Option } from "./listbox";
import { Select } from "./select";
import { TextArea } from "./textarea";

/* The forms family set out like Banyan's docs, with Pachama's vocabulary.
 * Everything here works; nothing is sent anywhere. */
const TINTS = ["branded", "monochrome", "destructive"] as const;

export const ButtonRows = () => (
  <div className="grid w-full gap-8">
    {TINTS.map((tint) => (
      <div key={tint} className="flex flex-wrap items-center gap-3">
        <span className="w-28 text-[13px] font-medium text-bn-medium capitalize">{tint}</span>
        <Button tint={tint} size="sm">Small</Button>
        <Button tint={tint}>Medium</Button>
        <Button tint={tint} size="lg">Large</Button>
        <Button tint={tint} disabled>Disabled</Button>
        <Button tint={tint} loading>Loading</Button>
      </div>
    ))}
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-28 text-[13px] font-medium text-bn-medium">Secondary, tertiary</span>
      <Button hierarchy="secondary">Visit project</Button>
      <Button hierarchy="secondary" icon={<MdAdd aria-hidden className="size-5" />}>Add project</Button>
      <Button hierarchy="tertiary" icon={<MdDownload aria-hidden className="size-5" />}>Report</Button>
      <Button hierarchy="tertiary" icon={<MdArrowForward aria-hidden className="size-5" />} iconPosition="trailing">
        Next
      </Button>
    </div>
  </div>
);

export const IconButtons = () => (
  <div className="flex flex-wrap items-center gap-3">
    <IconButton label="Add a project" icon={<MdAdd aria-hidden />} />
    <IconButton label="Edit" icon={<MdEdit aria-hidden />} look="monochrome" />
    <IconButton label="Delete" icon={<MdDelete aria-hidden />} look="destructive" />
    <IconButton label="Download the report" icon={<MdDownload aria-hidden />} look="secondary" />
    <IconButton label="More" icon={<MdMoreHoriz aria-hidden />} look="tertiary" />
    <IconButton label="Add, small" icon={<MdAdd aria-hidden />} size="sm" />
    <IconButton label="Add, large" icon={<MdAdd aria-hidden />} size="lg" />
    <IconButton label="Add, disabled" icon={<MdAdd aria-hidden />} disabled />
  </div>
);

// On the belt, the first two type themselves in turn, half a cycle apart:
// each types, rests a while, and clears.
const TYPED = ["Agrocortex", "Brazil, REDD+"];
const TYPE_MS = 110;
const TYPE_BEATS = 60;
const SHOWN_BEATS = 44;

export const Inputs = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(["", ""]);
  const beat = useCallback((n: number) => {
    setTyped(TYPED.map((text, i) => {
      const at = (n + (i * TYPE_BEATS) / 2) % TYPE_BEATS;
      return at < SHOWN_BEATS ? text.slice(0, at) : "";
    }));
  }, []);
  useBeat(ref, TYPE_MS, beat);
  return (
    <div ref={ref} className="grid w-full gap-6 sm:grid-cols-2">
      <TextInput label="Project name" placeholder="Verde do Bahia" value={typed[0]} onChange={(e) => setTyped(([, search]) => [e.target.value, search])} />
      <TextInput
        label="Search projects"
        placeholder="Brazil, REDD+…"
        type="search"
        leading={<MdSearch aria-hidden className="size-5 text-bn-medium" />}
        value={typed[1]}
        onChange={(e) => setTyped(([name]) => [name, e.target.value])}
      />
      <TextInput label="Credits to retire" inputMode="numeric" defaultValue="1,250" message="In tonnes of CO₂e." />
      <TextInput label="Registry ID" defaultValue="VCS 674" tone="success" message="Matches Manoa." />
      <TextInput label="Work email" type="email" defaultValue="name@acme" tone="error" message="Write the full address, like name@acme.co." />
      <TextInput label="Organisation" defaultValue="Acme Co." disabled />
    </div>
  );
};

export const TextAreas = () => (
  <div className="grid w-full gap-6 sm:grid-cols-2">
    <TextArea label="What's the project's story?" placeholder="Where it is, who runs it, what it protects." />
    <TextArea label="Notes for the reviewer" defaultValue="Boundary updated after the 2023 survey." tone="success" message="Saved." />
  </div>
);

const TYPES: Option[] = [
  { value: "redd", label: "REDD+", subtitle: "Avoided deforestation" },
  { value: "arr", label: "ARR", subtitle: "Afforestation, reforestation, revegetation" },
  { value: "ifm", label: "IFM", subtitle: "Improved forest management" },
];
const COUNTRIES = ["Argentina", "Brazil", "Colombia", "Indonesia", "Kenya", "Mexico", "Peru", "United States"].map((c) => ({ value: c, label: c }));

export const Selects = () => {
  const [type, setType] = useState<string | undefined>("redd");
  const [standard, setStandard] = useState<string | undefined>();
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <Select label="Project type" options={TYPES} value={type} onChange={setType} clearable />
      <Select
        label="Registry"
        options={["Verra (VCS)", "Gold Standard", "American Carbon Registry", "Climate Action Reserve"].map((r) => ({ value: r, label: r }))}
        value={standard}
        onChange={setStandard}
        placeholder="Choose a registry"
      />
      <Autocomplete label="Country" options={COUNTRIES} placeholder="Start typing a country" className="sm:col-span-2" />
    </div>
  );
};

const STANDARDS = ["Accurate", "Additional", "Durable", "Net", "Beyond carbon"];
const VINTAGES = ["2021", "2022", "2023"];
const SWITCHES = [
  { label: "Alert me when the project changes", size: "md" },
  { label: "Weekly summary", size: "sm" },
  { label: "Share with my team", size: "lg" },
] as const;
// On the belt, one control a beat, the three kinds in turn: a standard
// ticked (up to all five, then back one at a time), the vintage moved on,
// one switch flipped (a Gray code over the three, so only ever one).
const CHOICE_MS = 1200;

export const Choices = () => {
  const ref = useRef<HTMLDivElement>(null);
  // Its own radio group: the belt shows it twice.
  const vintageName = useId();
  const [picked, setPicked] = useState(["Accurate", "Additional"]);
  const [vintage, setVintage] = useState(VINTAGES[0]);
  const [on, setOn] = useState([true, false, false]);
  const beat = useCallback((n: number) => {
    const ticks = Math.floor(n / 3) % (2 * STANDARDS.length);
    setPicked(STANDARDS.slice(0, ticks <= STANDARDS.length ? ticks : 2 * STANDARDS.length - ticks));
    setVintage(VINTAGES[Math.floor((n + 2) / 3) % VINTAGES.length]);
    const flips = Math.floor((n + 1) / 3) % 8;
    const gray = flips ^ (flips >> 1);
    setOn(SWITCHES.map((_, i) => ((gray >> i) & 1) === 1));
  }, []);
  useBeat(ref, CHOICE_MS, beat);
  const all = picked.length === STANDARDS.length;
  return (
    <div ref={ref} className="grid w-full gap-8 sm:grid-cols-3">
      <fieldset className="grid content-start gap-3">
        <legend className="mb-3 text-[13px] font-medium text-bn-medium">Checkbox</legend>
        <Checkbox label="Every standard" checked={all} indeterminate={!all && picked.length > 0} onChange={() => setPicked(all ? [] : STANDARDS)} />
        {STANDARDS.map((s) => (
          <Checkbox key={s} label={s} checked={picked.includes(s)} onChange={() => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))} className="ml-6" />
        ))}
      </fieldset>
      <fieldset className="grid content-start gap-3">
        <legend className="mb-3 text-[13px] font-medium text-bn-medium">Radio, a vintage</legend>
        {VINTAGES.map((y) => (
          <Radio key={y} name={vintageName} label={y} checked={vintage === y} onChange={() => setVintage(y)} />
        ))}
        <Radio name={vintageName} label="2024, not issued yet" disabled />
      </fieldset>
      <fieldset className="grid content-start gap-3">
        <legend className="mb-3 text-[13px] font-medium text-bn-medium">Switch</legend>
        {SWITCHES.map(({ label, size }, i) => (
          <Switch key={label} label={label} size={size} checked={on[i]} onChange={() => setOn((o) => o.map((x, j) => (j === i ? !x : x)))} />
        ))}
      </fieldset>
    </div>
  );
};
