import { cn } from "../cn";

/* Banyan's structure as a tree of names joined by lines: the families, the
 * components in each, and how the button multiplies into its variants.
 * The families hang in columns from one line out of "Banyan", so the tree
 * reads across the page instead of running a screen long. Names are the
 * Figma's own. */
type Node = { name: string; kids?: Node[] };
const leaves = (...names: string[]): Node[] => names.map((name) => ({ name }));

const COLUMNS: Node[][] = [
  [
    {
      name: "Foundations",
      kids: [
        { name: "Typography", kids: leaves("Chromatic Pro Condensed", "Matter", "Matter Mono") },
        { name: "Colour", kids: [{ name: "Eight ramps", kids: leaves("Lidar green", "Canary", "Flax", "Hibiscus", "Glacier", "Blaze", "Fire", "Grey") }, { name: "Four gradients" }, { name: "Text, glass and fill" }] },
        { name: "Background levels" },
      ],
    },
    { name: "Media", kids: [{ name: "Icons", kids: leaves("Material, 1,310") }] },
  ],
  [
    {
      name: "Forms",
      kids: [
        {
          name: "Button",
          kids: [
            { name: "Hierarchy", kids: leaves("Primary", "Secondary", "Tertiary") },
            { name: "Tint", kids: leaves("Branded", "Monochrome", "Destructive") },
            { name: "Size", kids: leaves("Small", "Medium", "Large") },
            { name: "State", kids: leaves("Default", "Hover", "Pressed", "Focused", "Disabled", "Loading") },
          ],
        },
        ...leaves("Icon button", "Input", "Checkbox", "Radio", "Switch", "Select", "Autocomplete", "Datepicker", "Textarea", "File upload"),
      ],
    },
  ],
  [
    { name: "Patterns", kids: [{ name: "Navigation", kids: leaves("Website", "Product") }, { name: "Cards", kids: leaves("Project", "Highlights", "Submission") }, ...leaves("Data points", "Accordion", "Tabs", "Stepper", "Breadcrumb")] },
    { name: "Maps", kids: leaves("Legend", "Player", "Fire alerts", "Controls", "Globe") },
    { name: "Data display", kids: leaves("Table", "Badge", "Tag", "Avatar", "Divider") },
    { name: "Feedback", kids: leaves("Toast", "Banner", "Alert", "Progress", "Spinner", "Skeleton") },
    { name: "Overlay", kids: leaves("Menu", "Modal", "Popover", "Tooltip") },
  ],
];

const Branch = ({ node }: { node: Node }) => (
  <li>
    <span>{node.name}</span>
    {node.kids ? (
      <ul>
        {node.kids.map((kid) => (
          <Branch key={kid.name} node={kid} />
        ))}
      </ul>
    ) : null}
  </li>
);

export const BanyanStructure = ({ className }: { className?: string }) => (
  // On phones it scrolls sideways, so it takes focus for the arrow keys.
  <div
    role="region"
    aria-label="Banyan's structure"
    tabIndex={0}
    className={cn("bn-tree no-scrollbar overflow-x-auto pb-2 text-bn-heavy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bn-heavy", className)}
  >
    <p className="flex items-center gap-3 font-bold">
      Banyan
      <span aria-hidden className="h-px flex-1 bg-current" />
    </p>
    <div className="grid w-max grid-cols-1 gap-x-6 gap-y-6 pl-10 md:grid-cols-[max-content_max-content] xl:grid-cols-[max-content_max-content_max-content]">
      {COLUMNS.map((column) => (
        <ul key={column[0].name} className="bn-tree-hang">
          {column.map((family) => (
            <Branch key={family.name} node={family} />
          ))}
        </ul>
      ))}
    </div>
  </div>
);
