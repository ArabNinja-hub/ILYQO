import {
  MessageSquareText,
  Filter,
  CalendarClock,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { EarlyAccessBadge } from "./EarlyAccessBadge";

const capabilities = [
  {
    icon: MessageSquareText,
    title: "Enquiry handling",
    body: "Respond to incoming enquiries quickly and consistently, with natural conversation that keeps prospects engaged instead of waiting on hold.",
  },
  {
    icon: Filter,
    title: "Lead qualification",
    body: "Understand what a prospect actually needs — timing, fit, budget signals — so your team knows which conversations are worth pursuing.",
  },
  {
    icon: CalendarClock,
    title: "Follow-ups",
    body: "Keep promising leads warm with timely, considerate follow-ups, so interest doesn't fade simply because no one got around to it.",
  },
  {
    icon: Users,
    title: "Human handover",
    body: "When judgement, empathy or a human relationship is needed, the conversation moves to your team with its full context intact.",
  },
];

export function Capabilities() {
  return (
    <Section
      id="capabilities"
      labelledBy="capabilities-heading"
      className="border-t border-line bg-ink-950/60 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="capabilities-heading"
          eyebrow="Product capabilities"
          title="Everything a conversation needs to become a customer."
          description="Four capabilities ILYQO is being built around — each one designed to remove a step where leads are typically lost."
        />

        <div className="mt-6 flex justify-center">
          <EarlyAccessBadge />
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {capabilities.map((item, i) => (
            <article
              key={item.title}
              className="reveal group relative overflow-hidden rounded-2xl border border-line bg-ink-800/50 p-7 transition-colors duration-300 hover:border-volt-400/40"
              style={{ transitionDelay: `${(i % 2) * 70 + Math.floor(i / 2) * 40}ms` }}
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-volt-500/10 blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                aria-hidden="true"
              />
              <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-volt-500/25 to-volt-500/5 text-volt-300 ring-1 ring-volt-400/25">
                <item.icon className="h-5.5 w-5.5" aria-hidden="true" />
              </span>
              <h3 className="relative mt-5 font-display text-lg font-semibold text-cloud-50">
                {item.title}
              </h3>
              <p className="relative mt-2.5 text-sm leading-relaxed text-cloud-400">
                {item.body}
              </p>
              <p className="relative mt-5 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-volt-400">
                In development
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </p>
            </article>
          ))}
        </div>

        <p className="reveal mx-auto mt-10 max-w-2xl text-center text-sm text-cloud-500">
          ILYQO is not yet generally available. These capabilities describe what's being
          built — not features you can use today.
        </p>
      </div>
    </Section>
  );
}
