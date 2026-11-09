import {
  Bot,
  MessageSquareText,
  CalendarDays,
  ListChecks,
  Activity,
  MessagesSquare,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Section, SectionHeading } from "./Section";
import { StatusTag, type ImplementationStatus } from "./StatusTag";

type Capability = {
  icon: typeof Bot;
  title: string;
  body: string;
  status: ImplementationStatus;
  /** Only capabilities that exist in the demo get a destination. */
  to?: string;
};

/**
 * The six capabilities of the platform, in the order a customer meets them.
 * `status` must reflect what is actually in this repository — see StatusTag.
 */
const capabilities: Capability[] = [
  {
    icon: Bot,
    title: "AI customer assistance",
    body: "Intended to answer routine questions — hours, services, prices, availability — collect the details of an enquiry and hand the conversation to your team with everything already written down. Not built yet.",
    status: "planned",
  },
  {
    icon: MessageSquareText,
    title: "Enquiry & lead capture",
    body: "Every enquiry becomes a record with a customer, a channel, a service, an owner and a status, so nothing is \"handled\" until it is marked handled. In the demo your team logs enquiries by hand; connected channels are planned.",
    status: "demo",
    to: "/demo/enquiries",
  },
  {
    icon: CalendarDays,
    title: "Appointments & bookings",
    body: "One appointment book for the whole team: a day view per staff member, bookings created straight from enquiries, clash warnings, and confirm / complete / no-show in one tap.",
    status: "demo",
    to: "/demo/appointments",
  },
  {
    icon: ListChecks,
    title: "Customer follow-ups",
    body: "Confirmations, call-backs, check-ins and rebooking nudges, each with an owner, a due time and an outcome. ILYQO tracks that they happened; your team still makes the call.",
    status: "demo",
    to: "/demo/follow-ups",
  },
  {
    icon: Activity,
    title: "Business activity",
    body: "An overview of what needs attention today, who owns what, and an activity trail on every record. Business activity management beyond this is planned.",
    status: "partial",
    to: "/demo/overview",
  },
  {
    icon: MessagesSquare,
    title: "Website chat & WhatsApp",
    body: "Enquiries arriving through your website and WhatsApp would land in the same list as calls and walk-ins, with the conversation attached. Today the demo only records the channel; it does not connect to any messaging service.",
    status: "planned",
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
          eyebrow="The platform"
          title="What ILYQO does."
          description="Six capabilities, built around how a customer actually moves through a business — from the first question to the booking, the follow-up and the next visit. Each one is marked with where it stands today."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item, i) => (
            <article
              key={item.title}
              className="reveal flex flex-col rounded-2xl border border-line bg-ink-800/50 p-7 transition-colors duration-300 hover:border-volt-400/40"
              style={{ transitionDelay: `${(i % 3) * 70 + Math.floor(i / 3) * 40}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-volt-500/25 to-volt-500/5 text-volt-300 ring-1 ring-volt-400/25">
                  <item.icon className="h-5.5 w-5.5" aria-hidden="true" />
                </span>
                <StatusTag status={item.status} />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-cloud-50">{item.title}</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-cloud-400">{item.body}</p>
              {item.to ? (
                <Link
                  to={item.to}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-volt-300 transition-colors hover:text-volt-200"
                >
                  Open in the demo
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              ) : (
                <p className="mt-5 text-xs text-cloud-500">Not available in the demo.</p>
              )}
            </article>
          ))}
        </div>

        <p className="reveal mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-cloud-500">
          ILYQO is built for businesses that subscribe and configure the platform for their own
          customers. Subscriptions and business accounts are planned; pricing has not been announced.
        </p>
      </div>
    </Section>
  );
}
