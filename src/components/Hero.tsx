import {
  ArrowUpRight,
  CalendarDays,
  Inbox,
  ListChecks,
  AlertTriangle,
  Scissors,
} from "lucide-react";
import { ButtonLink, ButtonTo } from "./Button";
import { DemoBadge } from "./DemoBadge";
import { useCountUp } from "../hooks";

const snapshotStats = [
  { icon: Inbox, label: "New enquiries", value: 4, tone: "text-volt-300 bg-volt-500/15" },
  { icon: CalendarDays, label: "Appointments today", value: 7, tone: "text-sky-300 bg-sky-400/15" },
  { icon: ListChecks, label: "Follow-ups due", value: 3, tone: "text-amber-200 bg-amber-400/15" },
];

const schedule = [
  { time: "09:00", customer: "Bwalya Mwansa", service: "Skin fade", barber: "Chanda", status: "Done" },
  { time: "10:30", customer: "Kelvin Sakala", service: "Cut + beard", barber: "Mwila", status: "Confirmed" },
  { time: "11:15", customer: "Taonga Banda", service: "Kids cut", barber: "Joseph", status: "Scheduled" },
];

function Stat({
  icon: Icon,
  label,
  value,
  tone,
  delay,
}: (typeof snapshotStats)[number] & { delay: number }) {
  const count = useCountUp(value, 900, 500 + delay);
  return (
    <div
      className="animate-rise rounded-2xl border border-line bg-ink-900/70 p-3.5"
      style={{ animationDelay: `${420 + delay}ms` }}
    >
      <span className={`grid h-8 w-8 place-items-center rounded-lg ${tone}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="mt-3 font-display text-2xl font-semibold tabular-nums text-cloud-50">{count}</p>
      <p className="mt-0.5 text-[11px] leading-tight text-cloud-500">{label}</p>
    </div>
  );
}

/**
 * Hero — headline, CTA and an animated "operations snapshot" card that
 * previews what the Demo Cuts demonstration contains.
 */
export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-gradient-to-b from-ink-950 via-ink-900 to-ink-900 pt-32 pb-20 sm:pt-44 sm:pb-28"
    >
      {/* Ambient textures */}
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="glow-volt animate-drift pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[760px] -translate-x-1/2"
        aria-hidden="true"
      />
      <div
        className="glow-volt animate-drift-slow pointer-events-none absolute top-1/3 -right-64 h-[420px] w-[520px] opacity-60"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <div className="animate-rise" style={{ animationDelay: "0ms" }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-volt-400/30 bg-volt-500/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-volt-300">
              <span className="h-1.5 w-1.5 rounded-full bg-volt-400" aria-hidden="true" />
              Operations technology for small business
            </span>
          </div>

          <h1
            id="hero-heading"
            className="animate-rise mt-6 font-display text-[2.6rem] font-semibold leading-[1.06] tracking-tight text-cloud-50 sm:text-6xl lg:text-[4.1rem]"
            style={{ animationDelay: "80ms" }}
          >
            Intelligence That <span className="text-gradient">Moves Business.</span>
          </h1>

          <p
            className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-cloud-400 sm:text-xl"
            style={{ animationDelay: "160ms" }}
          >
            ILYQO gives small businesses one calm place to manage customer enquiries,
            appointments and follow-ups — so no enquiry is forgotten, no slot is wasted
            and every promise to call back is kept.
          </p>

          <div
            className="animate-rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: "240ms" }}
          >
            <ButtonTo to="/demo" size="lg">
              Explore the live demo
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </ButtonTo>
            <ButtonLink href="#how-it-works" variant="secondary" size="lg">
              See how it works
            </ButtonLink>
          </div>

          <p
            className="animate-rise mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-cloud-500"
            style={{ animationDelay: "300ms" }}
          >
            <span className="inline-flex items-center gap-x-3">
              <span>Interactive demo</span>
              <span aria-hidden="true">·</span>
              <span>No sign-up</span>
            </span>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <span>Fictional barbershop: Demo Cuts, Luanshya</span>
          </p>
        </div>

        {/* Operations snapshot card */}
        <div
          className="animate-rise relative mx-auto w-full max-w-md"
          style={{ animationDelay: "200ms" }}
        >
          <div className="glow-volt absolute -inset-6" aria-hidden="true" />
          <div className="animate-float relative rounded-3xl border border-line-strong bg-ink-800/80 p-5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur">
            <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-volt-500/20 text-volt-300">
                  <Scissors className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-cloud-50">Today at Demo Cuts</p>
                  <p className="text-xs text-cloud-500">Luanshya · Copperbelt</p>
                </div>
              </div>
              <DemoBadge compact />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {snapshotStats.map((stat, i) => (
                <Stat key={stat.label} {...stat} delay={i * 90} />
              ))}
            </div>

            <ul className="mt-4 space-y-2" aria-label="Sample schedule">
              {schedule.map((row, i) => (
                <li
                  key={row.time}
                  className="animate-rise flex items-center gap-3 rounded-xl border border-line bg-ink-900/60 px-3 py-2.5"
                  style={{ animationDelay: `${760 + i * 110}ms` }}
                >
                  <span className="w-11 font-display text-xs font-semibold tabular-nums text-cloud-300">
                    {row.time}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-cloud-50">{row.customer}</span>
                    <span className="block truncate text-[11px] text-cloud-500">
                      {row.service} · {row.barber}
                    </span>
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      row.status === "Done"
                        ? "bg-emerald-400/15 text-emerald-200"
                        : row.status === "Confirmed"
                          ? "bg-sky-400/15 text-sky-200"
                          : "bg-volt-500/15 text-volt-200"
                    }`}
                  >
                    {row.status}
                  </span>
                </li>
              ))}
            </ul>

            <div
              className="animate-rise mt-3 flex items-start gap-2.5 rounded-xl border border-amber-400/25 bg-amber-400/10 px-3 py-2.5 text-xs leading-relaxed text-amber-100"
              style={{ animationDelay: "1120ms" }}
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden="true" />
              <span>
                <strong className="font-semibold">Follow-up overdue:</strong> Mercy Zulu asked about
                a wedding-party booking on Friday — nobody has replied yet.
              </span>
            </div>
          </div>

          <p className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-cloud-500">
            Preview of the interactive demo — fictional data
          </p>
        </div>
      </div>
    </section>
  );
}
