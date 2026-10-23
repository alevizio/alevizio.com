/* A round of submissions to a sourcing event, from the Source Figma's
 * Submissions table and Verde Do Bahia's evaluation page. The design's
 * own sample data, with two changes: the three that fail screening are
 * named by their type and place (the design calls them "Example project
 * 7, 8 and 9"), and a row whose name the table cuts off is left out.
 * Verde Do Bahia is in Brazil, as its evaluation page says (the table
 * put it in Kenya). */
export const STAGES = ["Submitted", "Screening", "DMRV core diligence", "Preliminary diligence", "Full diligence"] as const;

export type Submission = {
  id: string;
  name: string;
  type: string;
  /** Through screening, with its priority; none means it didn't pass. */
  priority?: 1 | 2 | 3;
  /** The column it ends in: Screening (the ones that stop there), DMRV core diligence or Preliminary diligence. */
  reached: 1 | 2 | 3;
  facts?: string;
  code?: string;
  status: string;
};

export const SUBMISSIONS: Submission[] = [
  { id: "verde", name: "Verde Do Bahia", type: "Native reforestation", priority: 1, reached: 3, facts: "Brazil · 10,039 hectares", code: "VM047", status: "In review" },
  { id: "amazonia", name: "Amazônia de Volta", type: "Active reforestation", priority: 1, reached: 2, status: "Ready for preliminary diligence" },
  { id: "agro-mex", name: "Agroforestry, Mexico", type: "Agroforestry", reached: 1, status: "Didn't pass screening" },
  { id: "monarch", name: "Monarch Corridor", type: "Agroforestry", priority: 2, reached: 2, status: "Ready for preliminary diligence" },
  { id: "native-bra", name: "Native reforestation, Brazil", type: "Native reforestation", reached: 1, status: "Didn't pass screening" },
  { id: "peatlands", name: "Peatlands Revival", type: "Silvopasture", priority: 3, reached: 2, status: "Ready for preliminary diligence" },
  { id: "agro-bra", name: "Agroforestry, Brazil", type: "Agroforestry", reached: 1, status: "Didn't pass screening" },
];
