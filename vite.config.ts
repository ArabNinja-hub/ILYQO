import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Deployment knobs (both optional, read from the environment or .env files):
 *
 * - BASE_PATH      public path the site is served from, e.g. "/ILYQO/" for a
 *                  GitHub Pages project site. Defaults to "/". Asset URLs, the
 *                  logo (import.meta.env.BASE_URL) and the router basename all
 *                  follow it.
 * - VITE_SITE_URL  absolute URL of the deployed site, with trailing slash. Used
 *                  for the canonical / Open Graph / JSON-LD URLs in index.html
 *                  (the %VITE_SITE_URL% placeholders).
 *
 * The GitHub Pages workflow (.github/workflows/deploy.yml) sets both.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const base = env.BASE_PATH || "/";
  const siteUrl = env.VITE_SITE_URL || "https://ilyqo.com/";

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "ilyqo:site-url",
        transformIndexHtml: {
          order: "pre",
          handler: (html) => html.replace(/%VITE_SITE_URL%/g, siteUrl),
        },
      },
    ],
    server: {
      host: true,
      port: 5173,
      // The Arena preview is served under a generated *.e2b.app host.
      allowedHosts: true,
    },
  };
});
