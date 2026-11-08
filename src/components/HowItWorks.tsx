import { Inbox, ListChecks, RefreshCw, UserCheck } from "lucide-react";
import { Section, SectionHeading } from "./Section";

const steps = [
  {
    icon: Inbox,
    step: "01",
    title: "Capture",
    body: "An enquiry arrives. ILYQO picks up the conversation and responds promptly with relevant, natural questions.",
  },
  {
    icon: ListChecks,
    step: "02",
    title: "Qualify",
    body: "Key details — need, timing, budget fit — are gathered from the conversation so you know which leads are real.",
  },
  {
    icon: RefreshCw,
    step: "03",
    title: "Nurture",
    body: "Promising leads aren't left waiting. Thoughtful follow-ups keep the conversation warm until there's a decision.",
  },
  {
    icon: UserCheck,
    step: "04",
    title: "Hand over",
    body: "When a conversation is ready for a human, your team receives the full context — no re-asking, no starting over.",
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
          title="One conversation, four deliberate stages."
          description="The flow ILYQO is being designed around — from first message to human handover."
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
              <h3 className="mt-5 font-display text-lg font-semibold text-cloud-50">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-cloud-400">{item.body}</p>
              {i < steps.length - 1 && (
                <span
                  className="absolute -bottom-3 left-1/2 hidden h-6 w-px -translate-x-1/2 bg-gradient-to-b from-volt-400/60 to-transparent sm:block lg:hidden xl:block"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>

        <p className="reveal mx-auto mt-10 max-w-2xl text-center text-sm text-cloud-500">
          This flow describes the product being designed. ILYQO is not yet released —
          early access partners help us refine each stage before launch.
        </p>
      </div>
    </Section>
  );
}
