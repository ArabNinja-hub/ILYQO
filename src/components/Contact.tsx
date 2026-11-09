import { useState, type FormEvent } from "react";
import { Send, Mail, AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { Button } from "./Button";

type Status =
  | { kind: "idle" }
  | { kind: "invalid"; message: string }
  | { kind: "ready"; mailto: string };

const businessTypes = [
  "Barbershop or salon",
  "Clinic or practice",
  "Tutoring or training centre",
  "Repairs or home services",
  "Retail or showroom",
  "Professional services",
  "Other business",
];

const inputClasses =
  "w-full rounded-xl border border-line bg-ink-950/70 px-4 py-3 text-sm text-cloud-50 placeholder:text-cloud-500 transition-colors focus:border-volt-400/60 focus:outline-none focus:ring-1 focus:ring-volt-400/40";

export function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const business = String(data.get("business") ?? "").trim();
    const type = String(data.get("type") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !business) {
      setStatus({ kind: "invalid", message: "Please fill in your name, email and business name." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus({ kind: "invalid", message: "Please enter a valid email address." });
      return;
    }

    // There is no submission backend in this phase. Rather than faking a
    // success state, hand the visitor a prefilled email they can actually send.
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Business: ${business}`,
      `Type: ${type || "Not specified"}`,
      "",
      message || "(No additional message)",
      "",
      "— Sent from the ILYQO website",
    ].join("\n");

    const mailto = `mailto:hello@ilyqo.com?subject=${encodeURIComponent(
      `ILYQO enquiry — ${business}`,
    )}&body=${encodeURIComponent(body)}`;

    setStatus({ kind: "ready", mailto });
    form.reset();
  }

  return (
    <Section
      id="contact"
      labelledBy="contact-heading"
      className="relative overflow-hidden border-t border-line bg-ink-950/60 py-20 sm:py-28"
    >
      <div
        className="glow-volt pointer-events-none absolute -bottom-64 left-1/2 h-[480px] w-[700px] -translate-x-1/2"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          id="contact-heading"
          eyebrow="For businesses"
          title="Want ILYQO running for your customers?"
          description="ILYQO is built for businesses that subscribe and configure the platform for their own customers — their services, staff, hours and channels. Tell us how enquiries and bookings work for you today and we will walk you through the demo using your own scenarios."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="reveal">
            <h3 className="font-display text-lg font-semibold text-cloud-50">What happens next</h3>
            <ul className="mt-6 space-y-5">
              {[
                {
                  title: "A walkthrough built around your week",
                  body: "We load the demo with your services, staff and typical enquiries so you can see exactly how it would feel.",
                },
                {
                  title: "Honest scope",
                  body: "You will know exactly what works today and what is planned — before any commitment.",
                },
                {
                  title: "No commitment",
                  body: "Registering interest costs nothing and commits you to nothing. Pricing has not been announced.",
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-3.5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-volt-400" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-cloud-50">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-cloud-400">{item.body}</p>
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
                  className="font-medium text-volt-300 underline underline-offset-4 hover:text-volt-200"
                >
                  hello@ilyqo.com
                </a>
                .
              </p>
            </div>
          </div>

          <div
            className="reveal rounded-3xl border border-line-strong bg-ink-800/60 p-6 backdrop-blur sm:p-8"
            style={{ transitionDelay: "100ms" }}
          >
            <form onSubmit={handleSubmit} noValidate>
              <h3 className="font-display text-lg font-semibold text-cloud-50">Tell us about your business</h3>
              <p className="mt-1.5 text-sm text-cloud-500">Fields marked with * are required.</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ct-name" className="text-sm font-medium text-cloud-300">
                    Your name *
                  </label>
                  <input
                    id="ct-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Jane Mwale"
                    className={inputClasses}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ct-email" className="text-sm font-medium text-cloud-300">
                    Email *
                  </label>
                  <input
                    id="ct-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="jane@business.com"
                    className={inputClasses}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ct-phone" className="text-sm font-medium text-cloud-300">
                    Phone
                  </label>
                  <input
                    id="ct-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+260 97 000 0000"
                    className={inputClasses}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="ct-business" className="text-sm font-medium text-cloud-300">
                    Business name *
                  </label>
                  <input
                    id="ct-business"
                    name="business"
                    type="text"
                    autoComplete="organization"
                    required
                    placeholder="Fresh Fade Barbers"
                    className={inputClasses}
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="ct-type" className="text-sm font-medium text-cloud-300">
                    Business type
                  </label>
                  <div className="relative">
                    <select id="ct-type" name="type" className={`${inputClasses} appearance-none pr-10`}>
                      <option value="">Select one…</option>
                      {businessTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-cloud-500"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="ct-message" className="text-sm font-medium text-cloud-300">
                    How do enquiries and bookings reach you today?
                  </label>
                  <textarea
                    id="ct-message"
                    name="message"
                    rows={4}
                    placeholder="Calls, chat messages, Facebook, walk-ins, a paper diary…"
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
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-volt-300" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold">This form isn't connected to a server yet.</strong>{" "}
                      Your details have been prepared as an email instead.
                    </span>
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

              <Button type="submit" size="lg" className="mt-6 w-full">
                <Send className="h-4 w-4" aria-hidden="true" />
                Send enquiry
              </Button>

              <p className="mt-3 text-center text-xs leading-relaxed text-cloud-500">
                By submitting, you agree to be contacted about ILYQO. This website does not store your
                details.
              </p>
            </form>
          </div>
        </div>
      </div>
    </Section>
  );
}
