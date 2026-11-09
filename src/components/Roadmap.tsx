import { Check, Circle } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { StatusTag, type ImplementationStatus } from "./StatusTag";

type Column = {
  status: ImplementationStatus;
  heading: string;
  intro: string;
  items: string[];
};

/**
 * "Where ILYQO is today". Every line must be true of this repository:
 * the first column is what the Demo Cuts demo can do right now; the other two
 * list capabilities for which no implementation exists yet. Only add an item
 * here if it is a deliberate public commitment — the list is read as a promise.
 */
const columns: Column[] = [
  {
    status: "demo",
    heading: "Available in the demo",
    intro: "Working front-end with fictional data, saved only in your browser.",
    items: [
      "Enquiry & lead capture (entered by staff)",
      "Appointments & bookings, per staff member",
      "Customer follow-ups with owners and outcomes",
      "Overview of what needs attention",
      "Activity trail on every enquiry",
      "Search and filters across all records",
    ],
  },
  {
    status: "planned",
    heading: "Customer channels & AI",
    intro: "Not started. Nothing here exists as a preview or a beta.",
    items: ["AI customer assistance", "Website chat channel", "WhatsApp channel"],
  },
  {
    status: "planned",
    heading: "Platform foundations",
    intro: "Not started. What a business would need to run ILYQO for its own customers.",
    items: [
      "Business accounts and secure cloud storage",
      "Business configuration: services, staff, hours",
      "Business activity management beyond the demo's overview",
      "Subscriptions",
    ],
  },
];

export function Roadmap() {
  return (
    <Section
      id="roadmap"
      labelledBy="roadmap-heading"
      className="border-t border-line bg-ink-900 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="roadmap-heading"
          eyebrow="Status"
          title="What works today, and what is planned."
          description="We would rather you know exactly where the platform stands than discover it after signing up."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {columns.map((column, i) => {
            const available = column.status === "demo";
            return (
              <section
                key={column.heading}
                aria-labelledby={`roadmap-col-${i}`}
                className={`reveal rounded-2xl border p-6 ${
                  available
                    ? "border-emerald-400/30 bg-emerald-400/[0.05]"
                    : "border-line bg-ink-800/40"
                }`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <StatusTag status={column.status} />
                <h3
                  id={`roadmap-col-${i}`}
                  className="mt-3 font-display text-lg font-semibold text-cloud-50"
                >
                  {column.heading}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-cloud-500">{column.intro}</p>
                <ul className="mt-5 space-y-2.5">
                  {column.items.map((item) => (
                    <li
                      key={item}
                      className={`flex gap-2.5 text-sm ${available ? "text-cloud-100" : "text-cloud-400"}`}
                    >
                      {available ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
                      ) : (
                        <Circle className="mt-1 h-3 w-3 shrink-0 text-cloud-500" aria-hidden="true" />
                      )}
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <p className="reveal mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-cloud-500">
          Nothing marked planned exists today. Pricing has not been announced.
        </p>
      </div>
    </Section>
  );
}
