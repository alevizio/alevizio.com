
  import { createRoot } from "react-dom/client";
  import { inject } from "@vercel/analytics";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  inject();

  createRoot(document.getElementById("root")!).render(<App />);
  