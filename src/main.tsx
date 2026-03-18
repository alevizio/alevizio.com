
  import { createRoot } from "react-dom/client";
  import { injectSpeedInsights } from "@vercel/speed-insights";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  injectSpeedInsights();

  createRoot(document.getElementById("root")!).render(<App />);
  