/* eslint-env node */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Social crawlers and canonical links need absolute URLs. Vercel and Netlify
// expose the deployment address during the build; anywhere else, set
// VITE_SITE_URL. When nothing is known the tags stay relative and still resolve
// in-browser.
const siteUrl = (
  process.env.VITE_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  process.env.DEPLOY_PRIME_URL ||
  process.env.URL ||
  ""
).replace(/\/+$/, "");

export default defineConfig({
  plugins: [
    react(),
    {
      name: "diwali:site-url",
      transformIndexHtml(html) {
        const canonical = siteUrl ? `<link rel="canonical" href="${siteUrl}/" />` : "";
        const ogUrl = siteUrl
          ? `<meta property="og:url" content="${siteUrl}/" />`
          : "";

        return html
          .replaceAll("%SITE_URL%", siteUrl)
          .replace(/<!--\s*%CANONICAL%\s*-->/g, canonical)
          .replace(/<!--\s*%OG_URL%\s*-->/g, ogUrl);
      },
    },
  ],
  build: {
    outDir: "dist",
    assetsInlineLimit: 4096,
  },
});