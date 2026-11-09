import { MessageCircle, Inbox, CalendarPlus, LayoutDashboard } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { StatusTag, type ImplementationStatus } from "./StatusTag";

type Step = {
  icon: typeof Inbox;
  step: string;
  title: string;
  body: string;
  status: ImplementationStatus;
};

/** The intended flow of a customer through ILYQO. Status reflects the codebase, not the roadmap. */
const steps: Step[] = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Customers reach you",
    body: "Through your website, WhatsApp, a phone call or a walk-in. A planned AI assistant would handle routine questions and gather details before handing over to your team. Today, calls and walk-ins are logged by staff; no channel is connected.",
    status: "planned",
  },
  {
    icon: Inbox,
    step: "02",
    title: "ILYQO captures it",
    body: "Each enquiry becomes a record with a channel, a service, an owner and a status — so it can be answered, booked and followed up instead of forgotten.",
    status: "demo",
  },
  {
    icon: CalendarPlus,
    step: "03",
    title: "Your team books and follows up",
    body: "Turn an enquiry into an appointment with the right person and time slot. Create follow-ups with owners and due dates, and close them with an outcome.",
    status: "demo",
  },
  {
    icon: LayoutDashboard,
    step: "04",
    title: "You see the whole operation",
    body: "Today's schedule, what needs attention, where enquiries come from and how many become bookings — on one screen when the day starts.",
    status: "demo",
  },
];

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      labelledBy="how-heading"
      className="border-t border-line bg-ink-950/60 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="how-heading"
          eyebrow="How it works"
          title="From first message to next visit."
          description="How ILYQO is designed to sit inside a business. Steps marked 'in the demo' can be tried right now; the first step is planned and has not been built."
        />

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, i) => (
            <li
              key={item.step}
              className="reveal relative flex flex-col rounded-2xl border border-line bg-ink-800/50 p-6 transition-colors duration-300 hover:border-volt-400/35"
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
              <p className="mt-2 flex-1 text-sm leading-relaxed text-cloud-400">{item.body}</p>
              <StatusTag status={item.status} className="mt-5 self-start" />
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
          Your team still has the conversations — by phone, in person or in chat. ILYQO keeps what
          was agreed organised, visible and owned, so nothing depends on memory.
        </p>
      </div>
    </Section>
  );
}
