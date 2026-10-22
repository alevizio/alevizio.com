/* Sample credit balances on Pachama's two real projects. The numbers are
 * round on purpose: they're sample data, and the page says so. */
export type Status = "Available" | "Pending" | "Retired";

export type Row = {
  id: string;
  project: "Manoa" | "Corredores de Vida";
  type: "REDD+" | "Reforestation";
  vintage: number;
  credits: number;
  onHold: number;
  status: Status;
};

const r = (id: string, project: Row["project"], vintage: number, credits: number, onHold: number, status: Status): Row => ({
  id,
  project,
  type: project === "Manoa" ? "REDD+" : "Reforestation",
  vintage,
  credits,
  onHold,
  status,
});

export const ROWS: Row[] = [
  r("m19", "Manoa", 2019, 3000, 500, "Available"),
  r("m20", "Manoa", 2020, 2000, 250, "Available"),
  r("m21", "Manoa", 2021, 1250, 0, "Retired"),
  r("m22", "Manoa", 2022, 1500, 0, "Pending"),
  r("c21", "Corredores de Vida", 2021, 800, 100, "Available"),
  r("c22", "Corredores de Vida", 2022, 600, 0, "Pending"),
  r("c23", "Corredores de Vida", 2023, 400, 0, "Retired"),
];

export const STATUSES: Status[] = ["Available", "Pending", "Retired"];
