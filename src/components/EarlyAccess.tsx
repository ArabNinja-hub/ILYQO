import { useState, type FormEvent } from "react";
import { Send, Mail, AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { Button } from "./Button";

type Status =
  | { kind: "idle" }
  | { kind: "invalid"; message: string }
  | { kind: "ready"; mailto: string };

const businessTypes = [
  "Tutoring centre",
  "Training / certification provider",
  "Service business (clinic, agency, home services…)",
  "Other SME",
];

const inputClasses =
  "w-full rounded-xl border border-line bg-ink-950/70 px-4 py-3 text-sm text-cloud-50 placeholder:text-cloud-500 transition-colors focus:border-volt-400/60 focus:outline-none focus:ring-1 focus:ring-volt-400/40";

export function EarlyAccess() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const business = String(data.get("business") ?? "").trim();
    const type = String(data.get("type") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !business) {
      setStatus({ kind: "invalid", message: "Please fill in your name, email and business name." });
      return;
    }
    // Deliberately simple, honest validation — no backend exists yet.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ kind: "invalid", message: "Please enter a valid email address." });
      return;
    }

    // No submission backend exists in this phase. Instead of faking success,
    // hand the user a prefilled email they can actually send.
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Business: ${business}`,
      `Type: ${type || "Not specified"}`,
      "",
      message || "(No additional message)",
      "",
      "— Sent from the ILYQO early-access form",
    ].join("\n");

    const mailto = `mailto:hello@ilyqo.com?subject=${encodeURIComponent(
      `Early access request — ${business}`,
    )}&body=${encodeURIComponent(body)}`;

    setStatus({ kind: "ready", mailto });
    form.reset();
  }

  return (
    <Section
      id="early-access"
      labelledBy="early-access-heading"
      className="relative overflow-hidden border-t border-line bg-ink-950/60 py-20 sm:py-28"
    >
      <div
        className="glow-volt pointer-events-none absolute -bottom-64 left-1/2 h-[480px] w-[700px] -translate-x-1/2"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="early-access-heading"
          eyebrow="Early access"
          title="Help shape ILYQO before it launches."
          description="We're opening early access to a small group of tutoring centres, training providers and service businesses. Tell us about your enquiry flow — we'll be in touch as the product takes shape."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* What early access means */}
          <div className="reveal">
            <h3 className="font-display text-lg font-semibold text-cloud-50">
              What early access looks like
            </h3>
            <ul className="mt-6 space-y-5">
              {[
                {
                  title: "Direct input on the product",
                  body: "Tell us how your enquiries actually arrive today. That shapes what we build first.",
                },
                {
                  title: "A founding cohort, not a mass rollout",
                  body: "Early access is limited and staged. There's no product to log into yet — this is about staying close as development progresses.",
                },
                {
                  title: "No commitment, no payment",
                  body: "Registering interest costs nothing and obliges nothing. We'll only reach out about ILYQO's development.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-3.5">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-volt-400"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium text-cloud-50">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-cloud-400">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-line bg-ink-800/50 p-5">
              <Mail className="mt-0.5 h-4.5 w-4.5 shrink-0 text-volt-400" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-cloud-400">
                Prefer email? Reach us directly at{" "}
                <a
                  href="mailto:hello@ilyqo.com"
                  className="font-medium text-volt-300 underline underline-offset-4 hover:text-volt-400"
                >
                  hello@ilyqo.com
                </a>
                .
              </p>
            </div>
          </div>

          {/* Form */}
          <div
            className="reveal rounded-3xl border border-line-strong bg-ink-800/60 p-6 backdrop-blur sm:p-8"
            style={{ transitionDelay: "100ms" }}
          >
            <form onSubmit={handleSubmit} noValidate>
              <h3 className="font-display text-lg font-semibold text-cloud-50">
                Register your interest
              </h3>
              <p className="mt-1.5 text-sm text-cloud-500">
                Fields marked with * are required.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ea-name" className="text-sm font-medium text-cloud-300">
                    Your name *
                  </label>
                  <input
                    id="ea-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Jane Mwale"
                    className={inputClasses}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ea-email" className="text-sm font-medium text-cloud-300">
                    Work email *
                  </label>
                  <input
                    id="ea-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="jane@business.com"
                    className={inputClasses}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ea-business" className="text-sm font-medium text-cloud-300">
                    Business name *
                  </label>
                  <input
                    id="ea-business"
                    name="business"
                    type="text"
                    autoComplete="organization"
                    required
                    placeholder="Bright Path Tutoring"
                    className={inputClasses}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ea-type" className="text-sm font-medium text-cloud-300">
                    Business type
                  </label>
                  <div className="relative">
                    <select
                      id="ea-type"
                      name="type"
                      className={`${inputClasses} appearance-none pr-10`}
                    >
                      <option value="">Select one…</option>
                      {businessTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cloud-500"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="ea-message" className="text-sm font-medium text-cloud-300">
                    How do customer enquiries reach you today?
                  </label>
                  <textarea
                    id="ea-message"
                    name="message"
                    rows={4}
                    placeholder="Calls, WhatsApp, website form, walk-ins…"
                    className={`${inputClasses} resize-y`}
                  />
                </div>
              </div>

              {status.kind === "invalid" && (
                <p
                  role="alert"
                  className="mt-4 flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {status.message}
                </p>
              )}

              {status.kind === "ready" && (
                <div
                  role="status"
                  className="mt-4 rounded-xl border border-volt-400/35 bg-volt-500/10 px-4 py-4 text-sm leading-relaxed text-cloud-100"
                >
                  <p className="flex items-start gap-2">
                    <AlertCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-volt-300"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="font-semibold">This form isn't connected yet.</strong>{" "}
                      ILYQO is still in development, so there's no backend to receive
                      submissions — and we won't pretend otherwise.
                    </span>
                  </p>
                  <p className="mt-3 pl-6 text-cloud-300">
                    Your details are ready to send by email instead:
                  </p>
                  <a
                    href={status.mailto}
                    className="mt-3 ml-6 inline-flex items-center gap-2 rounded-full bg-volt-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-volt-600"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Open your email app
                  </a>
                </div>
              )}

              <Button type="submit" className="mt-6 w-full py-3.5">
                <Send className="h-4 w-4" aria-hidden="true" />
                Send early-access request
              </Button>

              <p className="mt-3 text-center text-xs leading-relaxed text-cloud-500">
                By submitting, you agree to be contacted about ILYQO's early access.
                This preview site does not store your details.
              </p>
            </form>
          </div>
        </div>
      </div>
    </Section>
  );
}
