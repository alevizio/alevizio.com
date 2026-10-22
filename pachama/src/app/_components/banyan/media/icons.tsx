"use client";

import { useId, useState } from "react";
import type { IconType } from "react-icons";
import {
  MdAdd, MdArrowBack, MdArrowForward, MdAttachFile, MdBarChart, MdBookmark, MdCalendarToday, MdCheck, MdCheckCircle,
  MdChevronLeft, MdChevronRight, MdClose, MdCloudUpload, MdDelete, MdDescription, MdDownload, MdEdit, MdError,
  MdExpandLess, MdExpandMore, MdFilterList, MdFolder, MdGroup, MdHelp, MdInfo, MdLayers, MdLink, MdLock, MdMap,
  MdMenu, MdMoreHoriz, MdMoreVert, MdMyLocation, MdNotifications, MdPark, MdPerson, MdPlace, MdPublic, MdRefresh,
  MdRemove, MdSchedule, MdSearch, MdSettings, MdShare, MdShowChart, MdStar, MdTerrain, MdTimeline, MdUpload,
  MdVerified, MdVisibility, MdWarning,
} from "react-icons/md";
import { cn } from "../../cn";
import { BN } from "../ui";

/* A slice of Banyan's icon set: Google's Material Icons, 1,310 of them in
 * the Figma, named as Material names them. Filter by name. */
const ICONS: [string, IconType][] = [
  ["arrow_back", MdArrowBack], ["arrow_forward", MdArrowForward], ["chevron_left", MdChevronLeft], ["chevron_right", MdChevronRight],
  ["expand_more", MdExpandMore], ["expand_less", MdExpandLess], ["menu", MdMenu], ["more_horiz", MdMoreHoriz],
  ["more_vert", MdMoreVert], ["close", MdClose], ["check", MdCheck], ["add", MdAdd],
  ["remove", MdRemove], ["refresh", MdRefresh], ["search", MdSearch], ["filter_list", MdFilterList],
  ["edit", MdEdit], ["delete", MdDelete], ["download", MdDownload], ["upload", MdUpload],
  ["cloud_upload", MdCloudUpload], ["attach_file", MdAttachFile], ["description", MdDescription], ["folder", MdFolder],
  ["share", MdShare], ["link", MdLink], ["lock", MdLock], ["visibility", MdVisibility],
  ["settings", MdSettings], ["info", MdInfo], ["help", MdHelp], ["warning", MdWarning],
  ["error", MdError], ["check_circle", MdCheckCircle], ["verified", MdVerified], ["notifications", MdNotifications],
  ["person", MdPerson], ["group", MdGroup], ["star", MdStar], ["bookmark", MdBookmark],
  ["calendar_today", MdCalendarToday], ["schedule", MdSchedule], ["bar_chart", MdBarChart], ["show_chart", MdShowChart],
  ["timeline", MdTimeline], ["public", MdPublic], ["map", MdMap], ["layers", MdLayers],
  ["place", MdPlace], ["my_location", MdMyLocation], ["terrain", MdTerrain], ["park", MdPark],
];

export const IconGrid = ({ className }: { className?: string }) => {
  const [query, setQuery] = useState("");
  const id = useId();
  const q = query.trim().toLowerCase().replace(/\s+/g, "_");
  const shown = ICONS.filter(([name]) => name.includes(q));

  return (
    <div className={cn("w-full", className)}>
      <label htmlFor={id} className="block text-[13px] font-medium text-bn-medium">
        Filter icons
      </label>
      <input
        id={id}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="arrow, map, check…"
        className={cn("mt-1.5 h-11 w-full max-w-sm rounded-[8px] border border-bn-line bg-white px-3 text-[15px] text-bn-heavy placeholder:text-bn-light focus:border-bn-heavy focus:outline-none", BN.focus)}
      />
      <p aria-live="polite" className="mt-2 text-[13px] text-bn-medium">
        {shown.length} of {ICONS.length} shown here
      </p>
      <ul className="mt-4 grid grid-cols-3 gap-2 min-[480px]:grid-cols-4 sm:grid-cols-6 lg:grid-cols-8">
        {shown.map(([name, Icon]) => (
          <li key={name} className="flex flex-col items-center gap-2 rounded-[8px] bg-white px-2 py-4 text-bn-heavy">
            <Icon aria-hidden className="size-6" />
            <span className="max-w-full truncate font-mono text-[11px] text-bn-medium">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
