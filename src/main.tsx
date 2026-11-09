import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/inter";
import "@fontsource-variable/sora";
import "./index.css";
import App from "./App";

// Vite's BASE_URL is "/" locally and e.g. "/ILYQO/" on a GitHub Pages project
// site; the router must know it so "/demo" resolves to "/ILYQO/demo".
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
