import {
  AlertTriangle,
  PhoneMissed,
  CalendarX2,
  Brain,
  Inbox,
  CalendarCheck2,
  ListChecks,
  ArrowRight,
} from "lucide-react";
import { Section, SectionHeading } from "./Section";

const problems = [
  {
    icon: PhoneMissed,
    title: "Enquiries slip through",
    body: "A price question on Facebook, a missed call, a 'let me check and get back to you' at the counter. Without one list, some are never answered.",
  },
  {
    icon: CalendarX2,
    title: "The diary doesn't match reality",
    body: "Double bookings, no-shows nobody chased, and staff who don't know who they're serving next because the booking lived in someone's phone.",
  },
  {
    icon: Brain,
    title: "Follow-ups live in people's heads",
    body: "Call-backs, confirmations and 'come back in three weeks' promises depend on memory. Most of them quietly never happen.",
  },
];

const solutions = [
  {
    icon: Inbox,
    title: "Every enquiry captured, with a status",
    body: "Each enquiry is recorded with who asked, what they want and where they came from. Nothing counts as handled until it is marked handled.",
  },
  {
    icon: CalendarCheck2,
    title: "One appointment book for the whole team",
    body: "See each staff member's day, create bookings straight from enquiries and record completions and no-shows as they happen.",
  },
  {
    icon: ListChecks,
    title: "Follow-ups with owners and due dates",
    body: "Every follow-up has a reason, an owner and a deadline. The overview shows what's due today and what's already overdue.",
  },
];

function Card({
  icon: Icon,
  title,
  body,
  tone,
  delay = 0,
}: {
  icon: typeof Inbox;
  title: string;
  body: string;
  tone: "problem" | "solution";
  delay?: number;
}) {
  const isSolution = tone === "solution";
  return (
    <li
      className={`reveal group rounded-2xl border p-6 transition-colors duration-300 ${
        isSolution
          ? "border-volt-400/25 bg-volt-500/[0.06] hover:border-volt-400/45"
          : "border-line bg-ink-800/50 hover:border-line-strong"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span
        className={`grid h-10 w-10 place-items-center rounded-xl ${
          isSolution ? "bg-volt-500/20 text-volt-300" : "bg-ink-700 text-cloud-400"
        }`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-display text-base font-semibold text-cloud-50">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-cloud-400">{body}</p>
    </li>
  );
}

export function ProblemSolution() {
  return (
    <Section
      id="problem"
      labelledBy="problem-heading"
      className="border-t border-line bg-ink-900 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="problem-heading"
          eyebrow="The problem"
          title={
            <>
              Businesses rarely lose customers on quality.{" "}
              <span className="text-volt-400">They lose them between the conversations.</span>
            </>
          }
          description="Enquiries arrive by phone, chat, social media and walk-ins. Bookings live in a diary and someone's phone. Follow-ups depend on whoever remembers. ILYQO replaces that patchwork with one operations platform."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          <div>
            <p className="reveal mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cloud-500">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              A typical week today
            </p>
            <ul className="space-y-4">
              {problems.map((item, i) => (
                <Card key={item.title} {...item} tone="problem" delay={i * 70} />
              ))}
            </ul>
          </div>

          <div className="reveal hidden items-center justify-center lg:flex" aria-hidden="true">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-line-strong bg-ink-800 text-volt-400">
              <ArrowRight className="h-5 w-5" />
            </span>
          </div>

          <div>
            <p className="reveal mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-volt-400">
              <span className="h-1.5 w-1.5 rounded-full bg-volt-400" aria-hidden="true" />
              The same week with ILYQO
            </p>
            <ul className="space-y-4">
              {solutions.map((item, i) => (
                <Card key={item.title} {...item} tone="solution" delay={i * 70} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
