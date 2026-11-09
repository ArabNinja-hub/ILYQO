import { Inbox, CalendarPlus, ListChecks, LayoutDashboard } from "lucide-react";
import { Section, SectionHeading } from "./Section";

const steps = [
  {
    icon: Inbox,
    step: "01",
    title: "Capture",
    body: "Log every enquiry as it arrives — the customer, what they asked for and which channel they used. It takes less time than writing it on a sticky note.",
  },
  {
    icon: CalendarPlus,
    step: "02",
    title: "Book",
    body: "Turn an enquiry into an appointment with the right staff member, service and time slot. Clashes are flagged before they become double bookings.",
  },
  {
    icon: ListChecks,
    step: "03",
    title: "Follow up",
    body: "Create follow-ups with an owner and a due date: confirmations, call-backs, after-visit check-ins and rebooking nudges. Mark them done with an outcome.",
  },
  {
    icon: LayoutDashboard,
    step: "04",
    title: "Review",
    body: "The overview shows today's schedule, what needs attention, where enquiries come from and how many turn into bookings.",
  },
];

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      labelledBy="how-heading"
      className="border-t border-line bg-ink-900 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="how-heading"
          eyebrow="How ILYQO works"
          title="Capture. Book. Follow up. Review."
          description="Four simple habits, supported by software your team can learn in an afternoon — not a system that needs a consultant."
        />

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, i) => (
            <li
              key={item.step}
              className="reveal relative rounded-2xl border border-line bg-ink-800/50 p-6 transition-colors duration-300 hover:border-volt-400/35"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-volt-500/15 text-volt-300 ring-1 ring-volt-400/25">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-display text-sm font-semibold tracking-widest text-cloud-500">
                  {item.step}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-cloud-50">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cloud-400">{item.body}</p>
              {i < steps.length - 1 && (
                <span
                  className="absolute top-1/2 -right-3 hidden h-px w-6 -translate-y-1/2 bg-gradient-to-r from-volt-400/60 to-transparent lg:block"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>

        <p className="reveal mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-cloud-500">
          Your team still has the conversations — by phone, in person or in chat. ILYQO
          keeps what was agreed organised, visible and owned, so nothing depends on memory.
        </p>
      </div>
    </Section>
  );
}
