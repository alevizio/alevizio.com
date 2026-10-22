import { Specimen, SpecimenGrid } from "../specimen";
import { Avatar, AvatarGroup } from "./avatar";
import { Badge, InsightBadge, PassBadge } from "./badge";
import { Divider } from "./divider";
import { DataTable } from "./table/table";
import { TagDemo } from "./tag-demo";

/* Data display: how numbers, statuses and people show up. */
const PEOPLE = [
  { name: "Alejandro Vizio", initials: "AV" },
  { name: "Acme Co.", initials: "AC" },
  { name: "Pachama", mark: "/brand/symbol-dark.svg" },
  { name: "Sample member one", initials: "S1" },
  { name: "Sample member two", initials: "S2" },
  { name: "Sample member three", initials: "S3" },
];

export const DataDisplay = () => (
  <div className="grid gap-12">
    <Specimen name="Table" note="Search, filter by status, sort by any column, pick rows and page through. Credit balances on the two real projects; the numbers are samples." panelClassName="block">
      <DataTable />
    </Specimen>
    <SpecimenGrid>
      <Specimen name="Avatar" note="A rounded square, not a circle: initials, or an organisation's mark; four sizes and a group that counts the rest." panelClassName="flex-col gap-6">
        <div className="flex items-end gap-3">
          <Avatar size="xs" name="Alejandro Vizio" initials="AV" />
          <Avatar size="sm" name="Alejandro Vizio" initials="AV" />
          <Avatar size="md" name="Alejandro Vizio" initials="AV" />
          <Avatar size="lg" name="Pachama" mark="/brand/symbol-dark.svg" />
        </div>
        <AvatarGroup people={PEOPLE} max={4} />
      </Specimen>
      <Specimen name="Badge" note="Small ones flag a status; the large ones carry an evaluation's verdict." panelClassName="flex-col gap-5">
        <div className="flex flex-wrap justify-center gap-2">
          <Badge>Draft</Badge>
          <Badge tone="heavy">New</Badge>
          <Badge tone="success">Available</Badge>
          <Badge tone="warning">Pending</Badge>
          <Badge tone="error">Expired</Badge>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <PassBadge />
          <PassBadge exception="With an exception" />
          <InsightBadge />
        </div>
      </Specimen>
      <Specimen name="Tag" note="A soft pill for a keyword, in three sizes. Remove one; Reset puts them back.">
        <TagDemo />
      </Specimen>
      <Specimen name="Divider" note="A hairline in light grey, or the brand's spectrum, across or between." panelClassName="flex-col gap-6">
        <Divider className="max-w-sm" />
        <Divider type="spectrum" className="max-w-sm" />
        <div className="flex h-10 items-center gap-4 text-[14px] text-bn-heavy">
          Brazil
          <Divider orientation="vertical" />
          74,039 hectares
          <Divider orientation="vertical" type="spectrum" />
          REDD+
        </div>
      </Specimen>
    </SpecimenGrid>
  </div>
);
