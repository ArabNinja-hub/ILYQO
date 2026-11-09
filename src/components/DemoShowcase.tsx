import {
  ArrowUpRight,
  Check,
  X,
  MapPin,
  Users,
  Scissors,
  MessageSquareText,
  CalendarDays,
  ListChecks,
} from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { ButtonTo } from "./Button";
import { DemoBadge } from "./DemoBadge";

const includes = [
  "Working forms: add enquiries, create bookings, log follow-ups",
  "Status changes, search and filters across every record",
  "Realistic week of fictional data for a three-barber shop",
  "Changes save in your browser — reset any time",
];

const excludes = [
  "AI customer assistance — planned, not in this demo",
  "Website chat and WhatsApp connections — planned; nothing is sent or received for you",
  "Accounts or cloud storage — data stays on this device",
];

const previewCards = [
  {
    icon: MessageSquareText,
    label: "Enquiry",
    title: "Mercy Zulu",
    body: "Wedding party — 6 groomsmen next Friday. Group booking possible?",
    meta: "Referral · 2 h ago",
    pill: { text: "New", className: "bg-volt-500/15 text-volt-200" },
  },
  {
    icon: CalendarDays,
    label: "Booking",
    title: "Kelvin Sakala · Cut + beard",
    body: "Today 10:30 with Mwila · 50 min · K100",
    meta: "Created from enquiry",
    pill: { text: "Confirmed", className: "bg-sky-400/15 text-sky-200" },
  },
  {
    icon: ListChecks,
    label: "Follow-up",
    title: "Check in after colour",
    body: "Gift Lungu — ask how the grey coverage held; book 6-week touch-up.",
    meta: "Owner: Natasha · due tomorrow 10:00",
    pill: { text: "Pending", className: "bg-amber-400/15 text-amber-200" },
  },
];

export function DemoShowcase() {
  return (
    <Section
      id="demo"
      labelledBy="demo-heading"
      className="relative overflow-hidden border-t border-line bg-ink-900 py-20 sm:py-28"
    >
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="demo-heading"
          eyebrow="The demonstration"
          title="Meet Demo Cuts — our demonstration business."
          description="A fictional barbershop in Luanshya, on Zambia's Copperbelt: three barbers, a front desk and a steady stream of enquiries from calls, walk-ins and social media. The ILYQO demo is built around their week."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          {/* Narrative + CTA */}
          <div className="reveal rounded-3xl border border-volt-400/30 bg-gradient-to-br from-volt-500/15 via-ink-800/70 to-ink-800/70 p-7 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] sm:p-9">
            <div className="flex flex-wrap items-center gap-3">
              <DemoBadge />
              <span className="inline-flex items-center gap-1.5 text-xs text-cloud-400">
                <MapPin className="h-3.5 w-3.5 text-volt-300" aria-hidden="true" />
                Luanshya, Copperbelt
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-cloud-400">
                <Users className="h-3.5 w-3.5 text-volt-300" aria-hidden="true" />3 barbers · 1
                front desk
              </span>
            </div>

            <h3 className="mt-6 font-display text-2xl font-semibold leading-snug text-cloud-50 sm:text-3xl">
              Open the shop's operations board and run it yourself.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-cloud-300 sm:text-base">
              Answer a new enquiry, turn it into a Saturday booking, record a no-show, and
              clear the follow-ups that are due today. Everything you change
              is saved on your device — nothing is sent anywhere.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonTo to="/demo" size="lg">
                Open the interactive demo
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </ButtonTo>
              <span className="text-xs text-cloud-500">No account · Works on mobile</span>
            </div>

            <div className="mt-8 grid gap-6 border-t border-line pt-7 sm:grid-cols-2">
              <ul className="space-y-2.5" aria-label="What the demo includes">
                {includes.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-cloud-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <ul className="space-y-2.5" aria-label="What the demo does not include yet">
                {excludes.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-cloud-400">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-cloud-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stylised preview */}
          <div className="relative" aria-hidden="true">
            <div className="relative space-y-3">
              <div className="reveal flex items-center justify-between rounded-2xl border border-line bg-ink-950/80 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-volt-500/20 text-volt-300">
                    <Scissors className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-cloud-50">Demo Cuts</p>
                    <p className="text-[11px] text-cloud-500">Operations board</p>
                  </div>
                </div>
                <DemoBadge compact />
              </div>
              {previewCards.map((card, i) => (
                <div
                  key={card.label}
                  className="reveal rounded-2xl border border-line bg-ink-800/70 p-4"
                  style={{ transitionDelay: `${120 + i * 90}ms` }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-cloud-500">
                      <card.icon className="h-3.5 w-3.5 text-volt-300" />
                      {card.label}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${card.pill.className}`}>
                      {card.pill.text}
                    </span>
                  </div>
                  <p className="mt-2.5 text-sm font-medium text-cloud-50">{card.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-cloud-400">{card.body}</p>
                  <p className="mt-2 text-[11px] text-cloud-500">{card.meta}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
