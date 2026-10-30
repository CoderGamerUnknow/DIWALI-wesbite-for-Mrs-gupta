# Happy Diwali — A Wish for Our Principal

A handmade, animation-rich Diwali greeting site, built to be opened from a QR
code. The experience includes a cinematic intro, a letter to the principal,
five diyas that light up with a chime, scroll-revealed blessings, a live
countdown, interactive fireworks, and a downloadable QR greeting card.

All artwork (diyas, rangoli, stars, fireworks) is drawn in CSS, SVG and canvas —
there are no third-party images, and no copyrighted assets.

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL. The site is a single page; there are no client-side
routes.

## Make it yours

Everything editable lives in [`src/const/site.js`](src/const/site.js):

- `principal` / `principalShort` — the salutation and short form used in copy.
- `from` — who the wish is from (shown in the footer).
- `school` — optional; leave empty to hide it everywhere.
- `diwaliISO` / `diwaliLabel` — the countdown target and displayed date.
- `letter` — the greeting, paragraphs, closing and signature.
- `blessings` — the six Hindi + English blessing cards.

No code changes are needed to personalise the greeting.

## The QR card

The share section (`/` → "QR card" or the **Share the light** button in the nav):

- Generates a QR **at runtime from the page's own URL**, so it always points at
  the live site — no hard-coded domain to update.
- Lets you **download a print-ready PNG card** (1080 × 1528) with the QR on it.
- Renders a **light A4 sheet** (2480 × 3508, 300 DPI) of the same wish for paper:
  cream stock instead of the dark on-screen card, a large QR, the full URL as a
  fallback, and the recipient's name. Print at 100% / "Actual size".
- Offers **Copy link** and the native share sheet where supported.

> While previewing on `localhost`, the QR points at your local address. Open the
> deployed site before downloading the card you will give to the principal.

## Link previews

When the link is shared on WhatsApp, iMessage or social media, the card that
appears comes from `public/og-image.png` (1200 × 630). It is drawn from the same
copy as the page:

```bash
npm run og
```

Run that after changing the recipient or the Diwali date. `public/apple-touch-icon.png`
is regenerated at the same time.

`vite.config.js` rewrites the Open Graph and canonical URLs to absolute ones at
build time, using the deployment address that Vercel and Netlify provide. On any
other host, set `VITE_SITE_URL=https://your-domain.com` before building.

## Deploy

The project is a standard Vite static build (`npm run build`, output `dist/`) and
works on both hosts with no extra setup.

### Vercel

1. Import the repository at [vercel.com/new](https://vercel.com/new).
2. Vercel detects Vite automatically: build `npm run build`, output `dist`.
3. Deploy, open the live URL, then download the QR card from the share section.

`vercel.json` adds long-lived caching for hashed assets.

### Netlify

1. Import the repository at [app.netlify.com](https://app.netlify.com).
2. `netlify.toml` sets the build command, publish directory, Node version and
   asset caching.
3. Deploy, open the live URL, then download the QR card.

### Any static host

```bash
npm run build
# upload the contents of dist/
```

## Tech

- React 18 + Vite
- GSAP + ScrollTrigger for scroll scenes
- Lenis for smooth scrolling (disabled for reduced-motion users)
- `qrcode.react` for the live QR
- SCSS modules

## Checks

```bash
npm run lint
npm run build
```

## Structure

- `src/const/site.js` — every word that is personal to the recipient.
- `src/sections/` — one file per scroll section, each with its own SCSS module.
- `src/components/` — the diya, rangoli, fireworks, intro loader and navigation.
- `scripts/make-og.mjs` — builds the share preview image.
