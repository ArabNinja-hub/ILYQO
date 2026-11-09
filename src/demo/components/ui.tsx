import type { ComponentType, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, type LucideProps } from "lucide-react";
import { initials } from "../lib/format";
import { toneClasses, toneDot, type Tone } from "../lib/status";

type Icon = ComponentType<LucideProps>;

/* ---------------------------------- Pills --------------------------------- */

export function StatusPill({
  tone,
  children,
  className = "",
}: {
  tone: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${toneClasses[tone]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${toneDot[tone]}`} aria-hidden="true" />
      {children}
    </span>
  );
}

export function Tag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-md border border-line bg-ink-900/60 px-2 py-0.5 text-[11px] text-cloud-400 ${className}`}
    >
      {children}
    </span>
  );
}

/* --------------------------------- Avatar --------------------------------- */

const avatarPalette = [
  "from-volt-500/40 to-volt-700/40 text-volt-100",
  "from-sky-500/40 to-sky-700/40 text-sky-100",
  "from-emerald-500/40 to-emerald-700/40 text-emerald-100",
  "from-amber-500/40 to-amber-700/40 text-amber-100",
  "from-rose-500/40 to-rose-700/40 text-rose-100",
  "from-fuchsia-500/40 to-fuchsia-700/40 text-fuchsia-100",
];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash;
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const palette = avatarPalette[hashString(name) % avatarPalette.length];
  const dims = size === "sm" ? "h-7 w-7 text-[10px]" : size === "lg" ? "h-12 w-12 text-sm" : "h-9 w-9 text-xs";
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-semibold ring-1 ring-white/10 ${palette} ${dims}`}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

/* ------------------------------- Page header ------------------------------ */

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-cloud-50 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-cloud-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ---------------------------------- Panels -------------------------------- */

export function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
  bodyClassName = "",
}: {
  title?: ReactNode;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`rounded-2xl border border-line bg-ink-800/50 ${className}`}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            {title && <h2 className="font-display text-base font-semibold text-cloud-50">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-cloud-500">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={bodyClassName || "p-5"}>{children}</div>
    </section>
  );
}

export function PanelLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-volt-300 transition-colors hover:text-volt-200"
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  );
}

/* --------------------------------- Stat card ------------------------------ */

export function StatCard({
  label,
  value,
  hint,
  icon: StatIcon,
  tone = "indigo",
  to,
  delay = 0,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon: Icon;
  tone?: Tone;
  to?: string;
  delay?: number;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <span className={`grid h-9 w-9 place-items-center rounded-xl ring-1 ring-inset ${toneClasses[tone]}`}>
          <StatIcon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        {to && (
          <ArrowUpRight
            className="h-4 w-4 text-cloud-500 transition-colors group-hover:text-volt-300"
            aria-hidden="true"
          />
        )}
      </div>
      <p className="mt-4 font-display text-3xl font-semibold tabular-nums tracking-tight text-cloud-50">{value}</p>
      <p className="mt-1 text-sm text-cloud-300">{label}</p>
      {hint && <p className="mt-1.5 text-xs text-cloud-500">{hint}</p>}
    </>
  );

  const className =
    "animate-rise group block rounded-2xl border border-line bg-ink-800/50 p-5 transition-colors hover:border-volt-400/35";

  return to ? (
    <Link to={to} className={className} style={{ animationDelay: `${delay}ms` }}>
      {content}
    </Link>
  ) : (
    <div className={className} style={{ animationDelay: `${delay}ms` }}>
      {content}
    </div>
  );
}

/* -------------------------------- Empty state ----------------------------- */

export function EmptyState({
  icon: EmptyIcon,
  title,
  body,
  action,
}: {
  icon: Icon;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink-700 text-cloud-400">
        <EmptyIcon className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="mt-4 font-display text-base font-semibold text-cloud-50">{title}</p>
      {body && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-cloud-400">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* --------------------------------- Chips ---------------------------------- */

export function Chips<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: Array<{ value: T; label: string; count?: number }>;
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div className="scroll-x -mx-1 flex gap-1.5 px-1" role="group" aria-label={label}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "border-volt-400/50 bg-volt-500/20 text-volt-100"
                : "border-line bg-ink-900/40 text-cloud-400 hover:border-line-strong hover:text-cloud-100"
            }`}
          >
            {option.label}
            {option.count !== undefined && (
              <span
                className={`rounded-full px-1.5 text-[10px] tabular-nums ${
                  active ? "bg-volt-400/30 text-volt-50" : "bg-ink-700 text-cloud-400"
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------- Misc ---------------------------------- */

export function Divider({ className = "" }: { className?: string }) {
  return <hr className={`border-line ${className}`} />;
}

export function MetaRow({ icon: MetaIcon, children }: { icon: Icon; children: ReactNode }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-cloud-500">
      <MetaIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="truncate">{children}</span>
    </span>
  );
}

/** Simple horizontal bar list used for lightweight insights (no chart library). */
export function BarList({
  items,
  emptyLabel = "No data yet",
}: {
  items: Array<{ label: string; value: number; hint?: string }>;
  emptyLabel?: string;
}) {
  const max = Math.max(1, ...items.map((item) => item.value));
  if (items.length === 0) return <p className="text-sm text-cloud-500">{emptyLabel}</p>;
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={item.label}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-cloud-200">{item.label}</span>
            <span className="shrink-0 tabular-nums text-cloud-400">
              {item.value}
              {item.hint && <span className="ml-1.5 text-xs text-cloud-500">{item.hint}</span>}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-volt-500 to-volt-300 transition-[width] duration-700"
              style={{ width: `${Math.round((item.value / max) * 100)}%`, transitionDelay: `${i * 60}ms` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
