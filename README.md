# ILYQO — Intelligence That Moves Business

ILYQO is an AI business operations platform that helps businesses manage
customer interactions and operations: enquiry and lead capture, appointment
and booking management, customer follow-ups and business activity — with AI
customer assistance and website chat / WhatsApp channels planned. The
commercial model is B2B: businesses subscribe and configure ILYQO for their
own customers.

**Implementation status is tracked honestly in three states** (see
`src/components/StatusTag.tsx`): *In the demo* (clickable today), *Partly in
the demo*, and *Planned* (no code exists yet — not a preview, not a beta).
There is deliberately no "in development" state. The `#roadmap` section of
the website is the user-facing version of this list.

This repository contains two things:

1. **The marketing website** (`/`) — explains the business-operations problem
   ILYQO solves and leads visitors into the product demo.
2. **The interactive operations demo** (`/demo`) — a fully functional front-end
   of the product, pre-loaded with realistic fictional data for **Demo Cuts**,
   a fictional barbershop in Luanshya, on Zambia's Copperbelt. It is our first
   demonstration customer.

Everything runs in the browser. There is no backend, no account and nothing is
sent anywhere.

---

## What the demo does (and does not do)

The demo is clearly labelled **DEMO MODE** throughout and covers:

| Area | What you can do |
| --- | --- |
| **Overview** | Today's numbers, a "Needs attention" list (overdue follow-ups, unanswered enquiries, unconfirmed appointments), today's schedule, recent enquiries and simple counts by channel and service. |
| **Enquiries** | Log an enquiry (name, phone, channel, service, message, priority, owner), move it from New → Contacted → Booked / Closed / Lost, assign an owner, add notes, see the linked booking and follow-ups on a timeline. |
| **Appointments** | Day view and 14-day view per barber, create bookings (clash warnings included), confirm / complete / no-show / cancel / reopen, jump to any date. |
| **Follow-ups** | Call-backs, confirmations, check-ins and rebooking nudges with an owner, due time and outcome. Mark done (with outcome), snooze, skip or reopen. Overdue / due today / upcoming / done views. |
| **Search & filters** | Free-text search plus channel, service, owner, status, barber, type and date filters on every list. |
| **Connected records** | Bookings know which enquiry created them; follow-ups point at the booking or enquiry they relate to. |
| **Mobile** | Sidebar on desktop, top bar + bottom tabs on phones. Every screen works at 390 px wide. |

Honest scope — the demo **does not**:

- include AI customer assistance or any AI/forecasting feature (planned);
- connect to WhatsApp, website chat, SMS, email, Facebook or Instagram, or send
  any message on your behalf (planned). The "channel" on an enquiry is simply
  where the customer contacted the shop — staff log it by hand;
- have business accounts, multi-business support or subscriptions (planned),
  and takes no payments;
- talk to a server. The contact form on the website prepares an email in your
  own mail app; it does not post anywhere, and says so on screen.

### Demo data

- Fictional data for Demo Cuts (three barbers, one front-desk person, a
  services list and roughly a week of enquiries, bookings and follow-ups) is
  generated **relative to today's date** the first time the demo opens, so the
  overview always has something happening "today".
- Everything you add or change is persisted in `localStorage` under the key
  **`ilyqo.demo.v1`** (see `src/demo/store/storage.ts`). Clearing site data or
  using **Reset demo data** in the sidebar regenerates a fresh week. If the
  stored data is more than a few days old a banner offers a reset.
- Changes made in one tab are reflected in other open tabs (via the `storage`
  event).

---

## Tech stack

- [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 6](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com) (via `@tailwindcss/vite`; theme
  tokens live in `src/index.css`)
- [React Router 6](https://reactrouter.com) (`BrowserRouter`)
- [lucide-react](https://lucide.dev) icons, Inter + Sora via Fontsource

No Firebase, no analytics, no other runtime dependencies.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build locally
```

### Deploying

**GitHub Pages (live site).** `.github/workflows/deploy.yml` builds the site
and publishes `dist/` to GitHub Pages on every push to `main` (it can also be
run by hand from the Actions tab). The repository's Pages source is set to
"GitHub Actions". The project site is served from
`https://arabninja-hub.github.io/ILYQO/`; the workflow passes the sub-path to
the build automatically, and if a custom domain is attached later the same
workflow serves from `/` with no code change.

Two build-time settings make this work (both default to the root site):

- `BASE_PATH` — public path, e.g. `/ILYQO/`. Vite's `base`, the logo URL
  (`import.meta.env.BASE_URL`) and the router `basename` all follow it.
- `VITE_SITE_URL` — absolute site URL used for the canonical, Open Graph and
  JSON-LD URLs in `index.html` (`%VITE_SITE_URL%`).

**Any other static host.** The app uses client-side routing, so the host must
serve `index.html` for unknown paths (`/demo`, `/demo/enquiries`, …) — an "SPA
fallback" / "rewrite all to index.html". The build also writes `dist/404.html`
(a copy of `index.html`), which is how GitHub Pages provides that fallback.

---

## Project structure

```
index.html                  Meta tags, Open Graph, JSON-LD, favicons
public/brand/ilyqo-logo.jpg Official ILYQO logo (unmodified)
public/favicon.png          Icon crops derived from the logo
public/apple-touch-icon.png

src/
  main.tsx                  Entry — BrowserRouter + App
  App.tsx                   Routes: /  and  /demo/*
  index.css                 Tailwind theme (midnight navy / electric indigo /
                            soft white), animations, utilities
  hooks.ts                  useReveal, useMenuOpen, useCountUp, …

  pages/MarketingPage.tsx   Composes the website sections below
  components/               Website: Navbar, Hero, Capabilities, ProblemSolution,
                            HowItWorks, DemoShowcase, UseCases, Roadmap, Contact,
                            Footer
                            Shared: Logo, Button, DemoBadge, StatusTag, Section

  demo/
    DemoApp.tsx             DemoProvider + DemoLayout + nested routes
    layout/DemoLayout.tsx   Sidebar / mobile top bar / bottom tabs / reset modal
    pages/                  OverviewPage, EnquiriesPage, AppointmentsPage,
                            FollowUpsPage
    forms/                  EnquiryForm, BookingForm, FollowUpForm
    components/             ui (pills, avatars, cards…), Modal, fields, Toasts,
                            EnquiryDetail
    data/                   types.ts (entities & status unions),
                            catalog.ts (business, staff, services),
                            seed.ts (date-relative fictional data)
    store/                  reducer.ts, storage.ts (localStorage),
                            selectors.ts, DemoContext.tsx (useDemo())
    lib/                    dates.ts, format.ts, status.ts
```

### Routes

| Path | Screen |
| --- | --- |
| `/` | Marketing website (sections anchored at `#platform`, `#problem`, `#how-it-works`, `#demo`, `#who-its-for`, `#roadmap`, `#contact`) |
| `/demo` | Redirects to `/demo/overview` |
| `/demo/overview` | Dashboard |
| `/demo/enquiries` | Enquiry list. Supports `?status=New`, `?open=<enquiryId>` and `?new=1` |
| `/demo/appointments` | Appointment book. Supports `?date=YYYY-MM-DD` |
| `/demo/follow-ups` | Follow-up tracker |

---

## Brand

- **Name:** ILYQO · **Tagline:** Intelligence That Moves Business
- **Palette:** midnight navy backgrounds (`ink-*`), electric indigo accents
  (`volt-*`, brand violet `#892dfa` sampled from the logo) and soft-white text
  (`cloud-*`). All tokens are defined in `src/index.css`.
- **Logo:** the official asset lives at `public/brand/ilyqo-logo.jpg` and is
  used as-is in the navigation, footer and demo sidebar via
  `src/components/Logo.tsx`. The supplied file is a JPEG with a solid black
  background (no transparency), so the component blends it onto the navy
  surfaces with `mix-blend-mode: screen` and crops only the empty margin with
  `object-fit: cover` inside a wrapper that has the artwork's own aspect ratio.
  The artwork itself is never redrawn, recoloured or stretched. Because the
  blend only works against the real page, the website's translucent (glass)
  navigation bar does not contain the logo: `Navbar.tsx` renders it as a
  separate fixed element aligned with the bar. If a transparent PNG/SVG of the
  logo becomes available, drop it in and remove the blend mode. The favicon
  and Apple touch icon are small crops of the same file.

## Status

| In the demo | Planned (not started) |
| --- | --- |
| Enquiry & lead capture (entered by staff) | AI customer assistance |
| Appointments & bookings, per staff member | Website chat channel |
| Customer follow-ups with owners and outcomes | WhatsApp channel |
| Overview of what needs attention; activity trail per enquiry | Business accounts and secure cloud storage |
| Search and filters across all records | Business configuration (services, staff, hours) |
| | Business activity management beyond the demo's overview |
| | Subscriptions |

Pricing has not been announced. The planned list is a deliberate public
commitment — add to it only when that is intended.

- **Brand & website:** done.
- **Interactive operations demo:** done (front-end only, localStorage
  persistence).
