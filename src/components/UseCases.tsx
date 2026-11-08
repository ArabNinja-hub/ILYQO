import { GraduationCap, BadgeCheck, Briefcase, Globe } from "lucide-react";
import { Section, SectionHeading } from "./Section";

const useCases = [
  {
    icon: GraduationCap,
    title: "Tutoring centres",
    body: "Parents enquire about subjects, grades and availability at all hours. ILYQO is designed to answer, qualify and book interest before a competitor does.",
    points: ["After-hours enquiries", "Subject & level matching", "Trial-class interest"],
  },
  {
    icon: BadgeCheck,
    title: "Training & certification",
    body: "Course enquiries come with long question lists — schedules, prerequisites, pricing. ILYQO is being built to work through them conversationally.",
    points: ["Cohort & schedule questions", "Prerequisite checks", "Enrolment intent"],
  },
  {
    icon: Briefcase,
    title: "Service businesses",
    body: "From clinics to agencies to home services, every missed call is a missed job. ILYQO aims to engage every prospect until they're ready to talk to you.",
    points: ["Quote requests", "Urgency triage", "Booking readiness"],
  },
  {
    icon: Globe,
    title: "International SMEs",
    body: "Growing across time zones means enquiries never stop. ILYQO is being designed for businesses that need consistent engagement, everywhere they operate.",
    points: ["Multi-timezone response", "Consistent qualification", "Scalable follow-up"],
  },
];

export function UseCases() {
  return (
    <Section
      id="use-cases"
      labelledBy="use-cases-heading"
      className="border-t border-line bg-ink-900 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="use-cases-heading"
          eyebrow="Who it's for"
          title="Built for businesses that live on conversations."
          description="ILYQO's early development focuses on service businesses where every enquiry matters — and where a slow reply is a lost customer."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((item, i) => (
            <article
              key={item.title}
              className="reveal flex flex-col rounded-2xl border border-line bg-ink-800/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-volt-400/40"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-700 text-volt-300 ring-1 ring-volt-400/20">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-base font-semibold text-cloud-50">
                {item.title}
              </h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-cloud-400">
                {item.body}
              </p>
              <ul className="mt-5 space-y-2 border-t border-line pt-4">
                {item.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2 text-xs text-cloud-500"
                  >
                    <span
                      className="h-1 w-1 shrink-0 rounded-full bg-volt-400"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
