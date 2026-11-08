import { ArrowUpRight, MessageCircle, CheckCircle2, Clock } from "lucide-react";
import { ButtonLink } from "./Button";
import { EarlyAccessBadge } from "./EarlyAccessBadge";

/**
 * Hero — headline, CTA, and an illustrative conversation card.
 * The card is a design concept, not a product screenshot.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      {/* Ambient textures */}
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="glow-volt pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[760px] -translate-x-1/2"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <div className="animate-rise" style={{ animationDelay: "0ms" }}>
            <EarlyAccessBadge />
          </div>

          <h1
            id="hero-heading"
            className="animate-rise mt-6 font-display text-[2.6rem] font-semibold leading-[1.06] tracking-tight text-cloud-50 sm:text-6xl lg:text-[4rem]"
            style={{ animationDelay: "80ms" }}
          >
            Turn conversations into <span className="text-gradient">customers.</span>
          </h1>

          <p
            className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-cloud-400 sm:text-xl"
            style={{ animationDelay: "160ms" }}
          >
            ILYQO is an intelligent customer engagement platform in early development —
            built to help tutoring centres, training providers and service businesses
            respond faster, qualify leads and follow up until conversations convert.
          </p>

          <div
            className="animate-rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "240ms" }}
          >
            <ButtonLink href="#early-access" className="px-7 py-3.5">
              Request early access
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#how-it-works" variant="secondary" className="px-7 py-3.5">
              See how it works
            </ButtonLink>
          </div>

          <p
            className="animate-rise mt-6 text-sm text-cloud-500"
            style={{ animationDelay: "300ms" }}
          >
            No product is live yet — early access helps shape what we build.
          </p>
        </div>

        {/* Illustrative concept card */}
        <div
          className="animate-rise relative mx-auto w-full max-w-md"
          style={{ animationDelay: "200ms" }}
          aria-hidden="true"
        >
          <div className="absolute -inset-6 glow-volt" />
          <div className="relative rounded-3xl border border-line-strong bg-ink-800/80 p-5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-volt-500/20">
                  <MessageCircle className="h-4 w-4 text-volt-300" />
                </span>
                <div>
                  <p className="text-sm font-medium text-cloud-50">New enquiry</p>
                  <p className="text-xs text-cloud-500">Website · just now</p>
                </div>
              </div>
              <span className="animate-pulse-soft rounded-full bg-volt-500/15 px-2.5 py-1 text-[11px] font-medium text-volt-300">
                Qualifying
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-ink-700 px-4 py-3 text-sm leading-relaxed text-cloud-300">
                Hi — do you have weekend maths tutoring for Grade 10?
              </div>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-volt-500/15 px-4 py-3 text-sm leading-relaxed text-cloud-100 ring-1 ring-volt-400/25">
                Yes — we have Saturday slots available. How soon are you looking to start?
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-ink-700 px-4 py-3 text-sm leading-relaxed text-cloud-300">
                Ideally within the next two weeks.
              </div>
            </div>

            <div className="mt-4 space-y-2.5 border-t border-line pt-4">
              <div className="flex items-center gap-2.5 text-xs text-cloud-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-volt-400" />
                Intent identified — new enrolment enquiry
              </div>
              <div className="flex items-center gap-2.5 text-xs text-cloud-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-volt-400" />
                Lead profile enriched from the conversation
              </div>
              <div className="flex items-center gap-2.5 text-xs text-cloud-400">
                <Clock className="h-3.5 w-3.5 text-volt-400" />
                Follow-up scheduled · handover ready for your team
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-cloud-500">
            Illustrative concept — not a live product
          </p>
        </div>
      </div>
    </section>
  );
}
