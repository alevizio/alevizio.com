import appMyProjects from "@/assets/product/app-my-projects.jpg";
import appOrders from "@/assets/product/app-orders.png";
import appRetirements from "@/assets/product/app-retirements.png";
import biodiversityExtinction from "@/assets/product/biodiversity-extinction.jpg";
import biodiversityKba from "@/assets/product/biodiversity-kba.jpg";
import biodiversityScore from "@/assets/product/biodiversity-score.jpg";
import certificate from "@/assets/product/certificate.jpg";
import developersHeatmap from "@/assets/product/developers-heatmap.jpg";
import developersIntake from "@/assets/product/developers-intake.jpg";
import evaluationLoading from "@/assets/product/evaluation-loading.jpg";
import insightsGlobe from "@/assets/product/insights-globe.jpg";
import manoaPage from "@/assets/product/manoa-page.jpg";
import monitoringCarbon from "@/assets/product/monitoring-carbon.jpg";
import monitoringDashboard from "@/assets/product/monitoring-dashboard.jpg";
import monitoringFireProtanomaly from "@/assets/product/monitoring-fire-protanomaly.jpg";
import monitoringFire from "@/assets/product/monitoring-fire.jpg";
import portfolioDashboard from "@/assets/product/portfolio-dashboard.jpg";
import portfolioGlobe from "@/assets/product/portfolio-globe.jpg";
import portfolioProposal from "@/assets/product/portfolio-proposal.jpg";
import portfolioSourcingPlan from "@/assets/product/portfolio-sourcing-plan.jpg";
import sourceEvaluation from "@/assets/product/source-evaluation.jpg";
import sourceEventSettings from "@/assets/product/source-event-settings.jpg";
import sourceEvents from "@/assets/product/source-events.jpg";
import sourceLandShare from "@/assets/product/source-land-share.jpg";
import sourceLanding from "@/assets/product/source-landing.jpg";
import sourceStart from "@/assets/product/source-start.jpg";
import sourceSubmissions from "@/assets/product/source-submissions.jpg";
import { Compare } from "../_components/compare";
import { BoundaryUpload } from "../_components/screens/boundary-upload";
import { Explore } from "../_components/screens/explore";
import { HALF, Shot, TallShot } from "../_components/shot";
import { Band, ChapterDivider, Row, Section } from "../_components/story";

/* II · The product, on the product's own light grey: the marketplace and
 * the tools around it, shown as they were (Alejandro cleared everything
 * from Pachama to be shared as is: client and project names included).
 * The components have their own chapter, III. */

// A screen lifted off the page: a hairline and a soft shadow.
const SCREEN = "ring-1 ring-black/5 shadow-[0_24px_80px_rgb(20_26_23/0.12)]";

export const Product = () => (
  <Band tone="paper">
    <ChapterDivider id="product" numeral="II" title="The product">
      A marketplace for forest carbon that buyers could trust: every project with its data, its maps and its risks in
      the&nbsp;open.
    </ChapterDivider>

    <Section
      id="marketplace"
      eyebrow="The marketplace"
      title="Finding a project worth buying"
      text="Explore pairs every project with where it is: cards to filter on one side, the world on the other. Rebuilt here to use: filter by type, pick a project, and the map follows. Then Insights, the same idea for 182 projects."
    >
      <div data-reveal="frame">
        <Explore />
      </div>
      <Shot
        zoom
        src={insightsGlobe}
        alt="Insights, 2024: a dark globe with every project pinned, a list of projects beside it, and filters by project type and country"
        caption="Insights, 2024: 182 projects on the globe, filtered by type and by country."
        bleed
        className="mt-10"
      />
    </Section>

    <Section
      id="project"
      eyebrow="Project pages"
      title="Every credit, checked"
      text="Manoa's page, top to bottom: the forest, its facts and registry, the evaluation on the map, its story and what it does beyond carbon. Its evaluation screen, rebuilt in the new brand, is in the maps chapter."
    >
      <TallShot
        src={manoaPage}
        frameClassName={SCREEN}
        label="Manoa's project page, scrollable"
        alt="Manoa's project page: an aerial hero, the overview with Verra and CCB, a photo gallery, a tech-verified evaluation map of deforestation around the project since 1996, the project story, its impacts on education and biodiversity, its files, and other projects"
        caption="Manoa's page in the product. Scroll inside it."
      />
    </Section>

    <Section
      id="buying"
      eyebrow="Buying"
      title="From order to retirement"
      text="Orders and retirements, every retirement with a certificate to download, and a buyer's projects with their news."
    >
      <Row className="items-start">
        <Shot zoom src={appOrders} alt="Orders: a table of dates, assets such as Jari 2017 and Manoa 2020, quantities, costs per tonne and status" sizes={HALF} imageClassName={SCREEN} />
        <Shot zoom src={appRetirements} alt="Retirements: dates, credits such as Manoa 2019 and Jari Para 2020, quantities, status and a Download certificate link on each" sizes={HALF} imageClassName={SCREEN} />
      </Row>
      <Row className="mt-6 items-start">
        <Shot
          zoom
          src={certificate}
          alt="A certificate of authenticity awarded to Just Spices for offsetting 200 tonnes of CO2, from the Kootznoowoo improved forest management project, registered with the American Carbon Registry"
          sizes={HALF}
          caption="The certificate a retirement downloads."
          imageClassName={SCREEN}
        />
        <Shot zoom src={appMyProjects} alt="My projects: cards for Manoa and Central Kalimantan Peatlands with their evaluations and monitoring, beside a feed of project updates" sizes={HALF} caption="A buyer's projects, and the news from them." imageClassName={SCREEN} />
      </Row>
    </Section>

    <Section
      id="portfolio"
      eyebrow="Portfolios"
      title="A portfolio, planned"
      text="For buyers with a target: what they hold, mapped and broken down by type, cost, registry and verification; a sourcing plan for what's missing; and the proposals that answer it."
    >
      <TallShot
        src={portfolioDashboard}
        frameClassName={SCREEN}
        label="A buyer's portfolio dashboard, scrollable"
        alt="A portfolio dashboard: 1,327,912 tCO2e bought at $23.19 on average, charts by year, project types, registries, methodologies and verifications, a globe of the projects and the table of credits purchased"
        caption="The portfolio, top to bottom. Scroll inside it."
      />
      <Row className="mt-6 items-start">
        <Shot zoom src={portfolioGlobe} alt="The portfolio on a globe: project pins across the Americas beside its breakdowns by type, cost, registry, methodology, verification and location" sizes={HALF} caption="The same portfolio, on the globe." imageClassName={SCREEN} />
        <Shot zoom src={portfolioSourcingPlan} alt="Create carbon sourcing plan: a name, existing or new projects, and chips for project types, methodologies, registries, regions and third-party verifications" sizes={HALF} caption="A sourcing plan: what to look for, and where." imageClassName={SCREEN} />
      </Row>
      <Shot zoom src={portfolioProposal} alt="A proposal on Acme corp's call for proposals: the Choco-Darién Bioregion project and its opportunities by quantity, vintage and price" caption="A supplier's proposal, answering the call." imageClassName={SCREEN} className="mt-6" />
    </Section>

    <Section
      id="monitoring"
      eyebrow="Monitoring"
      title="Watching over a project"
      text="After the purchase: carbon monitoring against the baseline, forest loss year by year, fire risk by the day, and a dashboard for the rest. The fire reds were checked for colour-blind eyes."
    >
      <Row className="items-start">
        <Shot zoom src={monitoringCarbon} alt="Manoa's carbon monitoring: an update on emissions, the total climate benefit of 2,400,000 tCO2e by year, and observed forest loss on the map with a year player" sizes={HALF} caption="Manoa's carbon monitoring." imageClassName={SCREEN} />
        <Compare
          before={{ src: monitoringFire, alt: "Llanos de Apan's disturbance monitoring: fire risk today, 0 hectares affected, recent fires in red around the project boundary" }}
          after={{ src: monitoringFireProtanomaly, alt: "The same fire-risk map as someone with protanomaly sees it: the fires turn orange but still stand out" }}
          beforeLabel="As designed"
          afterLabel="Protanomaly"
          control="Compare the fire map as designed with how someone with protanomaly sees it"
          caption="Fire risk: today, the last 24 hours, the last week. Drag across: with protanomaly, the reds still read."
          sizes={HALF}
          imageClassName={SCREEN}
        />
      </Row>
      <Row className="mt-6 items-start">
        <TallShot
          src={monitoringDashboard}
          frameClassName={SCREEN}
          label="Llanos de Apan's project dashboard, scrollable"
          sizes={HALF}
          alt="Llanos de Apan's project dashboard: trees planted, survival, costs, milestones, weather, photos from the field and a risk table"
          caption="A project's dashboard, from planting to risk."
        />
        <Shot zoom src={evaluationLoading} alt="An evaluation page loading: grey skeleton blocks where the header, the tabs and the cards will be" sizes={HALF} caption="Before the data comes in, the page holds its shape." imageClassName={SCREEN} />
      </Row>
    </Section>

    <Section
      id="biodiversity"
      eyebrow="Beyond carbon"
      title="Biodiversity, scored"
      text="Evaluation 2.2 added biodiversity: a project's conservation impact against the rest of the world, the key biodiversity areas around it, and the species at risk. Here, Borneo Peatlands and the Bornean orangutan."
    >
      <Row className="items-start">
        <Shot zoom src={biodiversityScore} alt="Borneo Peatlands' biodiversity conservation impact: the critically endangered Bornean orangutan, extinction risks and threats, and an impact score in the 95th percentile worldwide" sizes={HALF} caption="Its impact score: the 95th percentile, worldwide." imageClassName={SCREEN} />
        <Shot zoom src={biodiversityKba} alt="The project on a satellite map with layers for the project area, key biodiversity areas and protected areas, and a note on what makes a key biodiversity area" sizes={HALF} caption="Key biodiversity and protected areas around it." imageClassName={SCREEN} />
      </Row>
      <TallShot
        src={biodiversityExtinction}
        frameClassName={SCREEN}
        label="Borneo Peatlands' species and extinction risk, scrollable"
        alt="Borneo Peatlands' species: spotlights on the Bornean orangutan and the clouded leopard, the share of species by extinction risk, and the region's threats"
        caption="The species behind the score. Scroll inside it."
      />
    </Section>

    <Section
      id="developers"
      eyebrow="Developers"
      title="Bringing projects in"
      text="The other side of the market: landowners and developers. A map of forest carbon potential to start from, a boundary uploaded and checked against satellite data (it plays below, with the live product's figures), and the intake that takes a project from its first details to its land's suitability."
    >
      <Shot zoom bleed src={developersHeatmap} alt="'Start your forest carbon project today': a map of forest carbon potential across South America, with an opportunity in Maranhão, Brazil, that could remove 246,416 tonnes of CO2" caption="Where a forest carbon project could start, and what it could earn." />
      <BoundaryUpload className="mt-6" />
      <div className="mt-6">
        <TallShot
          src={developersIntake}
          frameClassName={SCREEN}
          label="A project's intake, scrollable"
          alt="A project's intake: what's needed, the project details form, and land suitability with the project's parcels on the map"
          caption="Intake, from the requirements to the land."
        />
      </div>
    </Section>

    <Section
      id="sourcing"
      eyebrow="Sourcing"
      title="A sourcing event in one link"
      text="Source generalised what we built for the Symbiosis RFP: any buyer could run its own call for carbon projects, publish what it's looking for, and have developers submit, share their land and see how much of it qualifies. Acme stands in for the buyer."
    >
      <Shot
        zoom
        src={sourceLanding}
        alt="An event page for Acme Corp's reforestation and agroforestry sourcing event: a description, Submit proposal and Log in buttons, and the eligible countries and project types, beside an aerial photo of forest"
        caption="The event page a buyer shares: what it's sourcing, where, under which standards and by when."
        imageClassName={SCREEN}
      />
      <Row className="mt-6 items-start">
        <Shot
          zoom
          src={sourceStart}
          alt="A Start your submission dialog over the event page: pick a project from an earlier event, or name a new one"
          caption="Starting a submission, or reusing a project from an earlier event."
          sizes={HALF}
          imageClassName={SCREEN}
        />
        <Shot
          zoom
          src={sourceLandShare}
          alt="A project's Land suitability tab: a panel asking the developer to share the project area, beside a globe ready for a boundary"
          caption="Sharing the project's boundary, to be checked against satellite data."
          sizes={HALF}
          imageClassName={SCREEN}
        />
      </Row>
    </Section>

    <Section
      id="screening"
      eyebrow="Screening"
      title="Every submission, screened"
      text="On the buyer's side, projects arrive already checked against satellite data, then move through diligence stage by stage, with the reports beside them."
    >
      <Row className="items-start">
        <Shot
          zoom
          src={sourceEvents}
          alt="Sourcing events: an open reforestation event card with an aerial photo and country flags, and a card to request a new event"
          caption="A buyer's sourcing events, and a way to request a new one."
          sizes={HALF}
          imageClassName={SCREEN}
        />
        <Shot
          zoom
          src={sourceEventSettings}
          alt="Event settings: status, name, description, deadline and support email, then the eligibility criteria as removable chips for countries, project types and registries"
          caption="The event's criteria: countries, project types and the registries it accepts."
          sizes={HALF}
          imageClassName={SCREEN}
        />
      </Row>
      <Row className="mt-6 items-start">
        <Shot
          zoom
          src={sourceSubmissions}
          alt="A table of project submissions: type, location and supplier, screening marked Pass with a priority or Fail, and DMRV core diligence marked No flags"
          caption="Submissions as they come in, with screening and diligence results alongside."
          sizes={HALF}
          imageClassName={SCREEN}
        />
        <Shot
          zoom
          src={sourceEvaluation}
          alt="A project's evaluation results: screening passed with a results spreadsheet, internal commentary, and the DMRV core diligence report open in a viewer"
          caption="Screening, then diligence: each stage's result and the full report in one place."
          sizes={HALF}
          imageClassName={SCREEN}
        />
      </Row>
    </Section>
  </Band>
);
