# ILYQO — Intelligence That Moves Business

ILYQO is an operations technology platform that helps small businesses manage
customer enquiries, appointments and follow-ups in one place.

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

- connect to WhatsApp, SMS, email, Facebook or Instagram, or send any message
  on your behalf (the "channel" on an enquiry is simply where the customer
  contacted the shop — staff log it by hand);
- include any AI, forecasting or automation;
- talk to a server. The contact form on the website prepares an email in your
  own mail app; it does not post anywhere.

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

The app uses client-side routing, so the host must serve `index.html` for any
unknown path (`/demo`, `/demo/enquiries`, …). Most static hosts call this an
"SPA fallback" / "rewrite all to index.html". Without it, refreshing a demo
page returns a 404.

If the site is served from a sub-path, set Vite's `base` option; the logo URL
is derived from `import.meta.env.BASE_URL` so it will follow.

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
  components/               Website: Navbar, Hero, ProblemSolution, HowItWorks,
                            Capabilities, DemoShowcase, UseCases, Contact, Footer
                            Shared: Logo, Button, DemoBadge, Section

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
| `/` | Marketing website (sections anchored at `#problem`, `#how-it-works`, `#platform`, `#demo`, `#who-its-for`, `#contact`) |
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
  The artwork itself is never redrawn, recoloured or stretched. If a
  transparent PNG/SVG of the logo becomes available, drop it in and remove the
  blend mode. The favicon and Apple touch icon are small crops of the same
  file.

## Status

- **Phase 1 — brand & website:** done.
- **Phase 2 — interactive operations demo:** done (front-end only, localStorage
  persistence).
- **Not built yet:** accounts, multi-business support, a real backend,
  messaging integrations, reporting beyond simple counts, AI features.
