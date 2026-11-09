import {
  LayoutDashboard,
  MessageSquareText,
  CalendarDays,
  ListChecks,
  Search,
  Link2,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Section, SectionHeading } from "./Section";

const modules = [
  {
    icon: LayoutDashboard,
    title: "Overview dashboard",
    body: "Today's appointments, new enquiries, follow-ups due and an attention list of everything slipping — on one screen when the shop opens.",
    to: "/demo/overview",
  },
  {
    icon: MessageSquareText,
    title: "Enquiry management",
    body: "Capture enquiries from any channel, move them from New to Contacted to Booked, assign an owner and keep a note trail on each one.",
    to: "/demo/enquiries",
  },
  {
    icon: CalendarDays,
    title: "Appointments & bookings",
    body: "A day view per staff member, bookings created straight from enquiries, clash warnings, and confirm / complete / no-show in one tap.",
    to: "/demo/appointments",
  },
  {
    icon: ListChecks,
    title: "Follow-up tracking",
    body: "Overdue, due today and upcoming follow-ups with owners. Snooze, skip or close them with an outcome so the team knows what happened.",
    to: "/demo/follow-ups",
  },
  {
    icon: Search,
    title: "Search & filters",
    body: "Find any customer, enquiry or booking in seconds — by name, phone number, status, channel, service or staff member.",
    to: "/demo/enquiries",
  },
  {
    icon: Link2,
    title: "Connected records",
    body: "A booking knows which enquiry created it; a follow-up points at the booking or enquiry it's about. Context travels with the customer.",
    to: "/demo/overview",
  },
];

export function Capabilities() {
  return (
    <Section
      id="platform"
      labelledBy="platform-heading"
      className="border-t border-line bg-ink-950/60 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="platform-heading"
          eyebrow="Inside the platform"
          title="Everything the front desk needs, in one place."
          description="Six working modules — each one built to remove a point where customers are usually lost. Every module below is live in the demonstration."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((item, i) => (
            <article
              key={item.title}
              className="reveal group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-ink-800/50 p-7 transition-colors duration-300 hover:border-volt-400/40"
              style={{ transitionDelay: `${(i % 3) * 70 + Math.floor(i / 3) * 40}ms` }}
            >
              <div
                className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-volt-500/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />
              <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-volt-500/25 to-volt-500/5 text-volt-300 ring-1 ring-volt-400/25">
                <item.icon className="h-5.5 w-5.5" aria-hidden="true" />
              </span>
              <h3 className="relative mt-5 font-display text-lg font-semibold text-cloud-50">
                {item.title}
              </h3>
              <p className="relative mt-2.5 flex-1 text-sm leading-relaxed text-cloud-400">
                {item.body}
              </p>
              <Link
                to={item.to}
                className="relative mt-5 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-volt-300 transition-colors hover:text-volt-200"
              >
                Open in the demo
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
