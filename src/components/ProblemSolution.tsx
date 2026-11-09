import {
  AlertTriangle,
  Timer,
  MessagesSquare,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Section, SectionHeading } from "./Section";

const problems = [
  {
    icon: Timer,
    title: "Slow responses lose buyers",
    body: "Enquiries arrive at all hours. The first business to reply usually wins — but teams can't be available 24/7.",
  },
  {
    icon: MessagesSquare,
    title: "Conversations scatter",
    body: "Questions, price checks and follow-ups spread across channels and inboxes, so context gets lost between people.",
  },
  {
    icon: Eye,
    title: "Good leads go cold",
    body: "Interested prospects wait too long for a reply, or never receive one at all, and quietly move on.",
  },
];

const solutions = [
  {
    icon: AlertTriangle,
    title: "Every enquiry gets a response",
    body: "ILYQO is being built to acknowledge and engage every incoming conversation promptly — including outside business hours.",
  },
  {
    icon: MessagesSquare,
    title: "One continuous thread",
    body: "Each conversation keeps its full context in a single thread, so nothing is lost as the enquiry moves forward.",
  },
  {
    icon: Eye,
    title: "Attention where it matters",
    body: "Leads are qualified and prioritised, so your team spends time on conversations that are ready to move.",
  },
];

function Card({
  icon: Icon,
  title,
  body,
  tone,
  delay = 0,
}: {
  icon: typeof Timer;
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
      className="border-t border-line bg-ink-950/60 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="problem-heading"
          eyebrow="The gap"
          title={
            <>
              Great businesses lose customers in the{" "}
              <span className="text-volt-400">space between enquiry and answer.</span>
            </>
          }
          description="Most service businesses don't have a lead problem — they have a response problem. ILYQO is being built to close that gap."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          <div>
            <p className="reveal mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cloud-500">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              Today
            </p>
            <ul className="space-y-4">
              {problems.map((item, i) => (
                <Card key={item.title} {...item} tone="problem" delay={i * 70} />
              ))}
            </ul>
          </div>

          <div
            className="reveal hidden items-center justify-center lg:flex"
            aria-hidden="true"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full border border-line-strong bg-ink-800 text-volt-400">
              <ArrowRight className="h-5 w-5" />
            </span>
          </div>

          <div>
            <p className="reveal mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-volt-400">
              <span className="h-1.5 w-1.5 rounded-full bg-volt-400" aria-hidden="true" />
              With ILYQO (in development)
            </p>
            <ul className="space-y-4">
              {solutions.map((item, i) => (
                <Card
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  body={item.body}
                  tone="solution"
                  delay={i * 70}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
