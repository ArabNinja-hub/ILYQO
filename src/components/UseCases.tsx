import { Scissors, Stethoscope, GraduationCap, Wrench } from "lucide-react";
import { Section, SectionHeading } from "./Section";

const useCases = [
  {
    icon: Scissors,
    title: "Barbershops & salons",
    body: "Walk-ins, regulars and group bookings all compete for the same chairs. ILYQO keeps each barber's day clear and every 'can you fit me in?' answered.",
    points: ["Per-barber day view", "Rebooking follow-ups", "No-show tracking"],
    tag: "First demo: Demo Cuts",
  },
  {
    icon: Stethoscope,
    title: "Clinics & practices",
    body: "Appointment requests, confirmations and review visits need to be tracked carefully. ILYQO gives reception one list of what's due.",
    points: ["Appointment confirmations", "Review-visit follow-ups", "Enquiry status trail"],
  },
  {
    icon: GraduationCap,
    title: "Tutoring & training centres",
    body: "Parents and learners enquire about subjects, schedules and fees. ILYQO tracks each conversation until it becomes an enrolment or a clear no.",
    points: ["Enquiry pipeline", "Trial-session bookings", "Call-back ownership"],
  },
  {
    icon: Wrench,
    title: "Repairs & home services",
    body: "Quote requests arrive at all hours and jobs need scheduling around a small team. ILYQO keeps requests, visits and follow-ups connected.",
    points: ["Quote follow-ups", "Visit scheduling", "Customer history"],
  },
];

export function UseCases() {
  return (
    <Section
      id="who-its-for"
      labelledBy="use-cases-heading"
      className="border-t border-line bg-ink-950/60 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="use-cases-heading"
          eyebrow="Who it's for"
          title="Built for appointment-driven small businesses."
          description="ILYQO starts with businesses where every enquiry matters and every missed appointment costs money — beginning with barbershops, and designed to travel."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((item, i) => (
            <article
              key={item.title}
              className="reveal flex flex-col rounded-2xl border border-line bg-ink-800/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-volt-400/40"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-700 text-volt-300 ring-1 ring-volt-400/20">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                {item.tag && (
                  <span className="rounded-full border border-volt-400/30 bg-volt-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-volt-300">
                    {item.tag}
                  </span>
                )}
              </div>
              <h3 className="mt-5 font-display text-base font-semibold text-cloud-50">{item.title}</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-cloud-400">{item.body}</p>
              <ul className="mt-5 space-y-2 border-t border-line pt-4">
                {item.points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-xs text-cloud-500">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-volt-400" aria-hidden="true" />
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
