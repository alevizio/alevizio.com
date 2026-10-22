import manoaMap from "@/assets/kit/manoa-map.jpg";
import corredores from "@/assets/world/corredores-45.jpg";
import { Award, MapPin } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { cn } from "../cn";
import { KitButton } from "./buttons";
import { UI } from "./ui";

/* The cards the marketplace is made of: a project, and the certificate a
 * buyer keeps once credits are retired. Real projects, real facts: Manoa's
 * area and map come from its evaluation screen. */
type Project = { name: string; place: string; type: string; stat: [string, string]; image: StaticImageData; alt: string };

const PROJECTS: Project[] = [
  {
    name: "Manoa",
    place: "Brazil",
    type: "REDD+",
    stat: ["AREA", "74,039 ha"],
    image: manoaMap,
    alt: "Manoa's reference region outlined on satellite imagery",
  },
  {
    name: "Corredores de Vida",
    place: "Brazil",
    type: "Reforestation",
    stat: ["MONITORED WITH", "Lidar and satellites"],
    image: corredores,
    alt: "Forest meeting pasture along a lakeshore, from the air",
  },
];

export const ProjectCard = ({ name, place, type, stat, image, alt }: Project) => (
  <article className={cn(UI.card, "overflow-hidden")}>
    <Image src={image} alt={alt} sizes="(min-width: 1024px) 420px, 100vw" className="aspect-[16/9] w-full object-cover" />
    <div className="p-5">
      <span className="rounded-[6px] bg-[#eef1ef] px-2 py-0.5 text-[12px] text-[#3c4742]">{type}</span>
      <h4 className="mt-3 text-[20px] font-medium tracking-[-0.01em] text-[#141a17]">{name}</h4>
      <p className="mt-1 inline-flex items-center gap-1 text-[13px] text-[#5f6b66]">
        <MapPin aria-hidden className="size-3.5" /> {place}
      </p>
      <div className="mt-5 flex items-end justify-between gap-4">
        <p>
          <span className="block font-mono text-[11px] tracking-[0.12em] text-[#5f6b66]">{stat[0]}</span>
          <span className="text-[17px] font-medium text-[#141a17]">{stat[1]}</span>
        </p>
        <KitButton size="sm" variant="outline">
          View project
        </KitButton>
      </div>
    </div>
  </article>
);

export const RetirementCard = () => (
  <article className="relative flex flex-col overflow-hidden rounded-[12px] bg-[#1d2422] p-6 text-white">
    <div aria-hidden className="spectrum absolute inset-x-0 top-0 h-1" />
    <Award aria-hidden className="size-6 text-[#53f168]" />
    <p className="mt-4 font-mono text-[11px] tracking-[0.12em] text-white/60">CERTIFICATE OF RETIREMENT</p>
    <p className="mt-2 text-[34px] font-medium leading-none tracking-[-0.02em]">1,250 tCO₂e</p>
    <dl className="mt-auto grid grid-cols-2 gap-4 pt-8 text-[13px]">
      {[
        ["Project", "Manoa, Brazil"],
        ["Vintage", "2021"],
        ["Retired for", "Acme Co."],
        ["Registry", "VCS 674"],
      ].map(([k, v]) => (
        <div key={k}>
          <dt className="text-white/50">{k}</dt>
          <dd className="mt-0.5">{v}</dd>
        </div>
      ))}
    </dl>
  </article>
);

export const CardSet = () => (
  <div className="grid gap-6 lg:grid-cols-3">
    {PROJECTS.map((p) => (
      <ProjectCard key={p.name} {...p} />
    ))}
    <RetirementCard />
  </div>
);
