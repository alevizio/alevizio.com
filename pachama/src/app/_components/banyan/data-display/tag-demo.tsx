"use client";

import { useState } from "react";
import { Button } from "../button";
import { Tag } from "./tag";

/* Tags on a project, removable; Reset puts them back. */
const START = ["Reforestation", "Brazil", "Restoration", "Wildlife corridors"];

export const TagDemo = () => {
  const [tags, setTags] = useState(START);
  return (
    <div className="grid w-full justify-items-center gap-6">
      <ul aria-label="Corredores de Vida's tags" className="flex flex-wrap justify-center gap-2">
        {tags.map((t) => (
          <li key={t}>
            <Tag label={t} onDismiss={() => setTags((all) => all.filter((x) => x !== t))} />
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="text-[13px] text-bn-medium">
        {tags.length ? `${tags.length} of ${START.length} tags` : "No tags left."}
      </p>
      <Button hierarchy="secondary" size="sm" onClick={() => setTags(START)} disabled={tags.length === START.length}>
        Reset
      </Button>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Tag label="Extra small" size="xs" />
        <Tag label="Small" size="sm" />
        <Tag label="Medium" />
      </div>
    </div>
  );
};
