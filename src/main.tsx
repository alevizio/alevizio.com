
  import { createRoot } from "react-dom/client";
  import { inject } from "@vercel/analytics";
  import { injectSpeedInsights } from "@vercel/speed-insights";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  inject();
  injectSpeedInsights();

  createRoot(document.getElementById("root")!).render(<App />);
  