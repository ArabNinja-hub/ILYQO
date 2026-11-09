/**
 * Implementation status vocabulary used across the marketing site.
 *
 * Only three states exist, and they describe what is verifiably in this
 * repository — not intent:
 *  - "demo":    clickable today in the Demo Cuts demonstration
 *  - "partial": some of it is in the demo, the rest is not built
 *  - "planned": no implementation exists yet (not a preview, not a beta)
 *
 * Deliberately no "in development" state: nothing outside the demo has code
 * in this codebase, so that label would overstate progress.
 */
export type ImplementationStatus = "demo" | "partial" | "planned";

export const statusLabel: Record<ImplementationStatus, string> = {
  demo: "In the demo",
  partial: "Partly in the demo",
  planned: "Planned",
};

const statusTone: Record<ImplementationStatus, string> = {
  demo: "border-emerald-400/35 bg-emerald-400/10 text-emerald-200",
  partial: "border-sky-400/35 bg-sky-400/10 text-sky-200",
  planned: "border-line-strong bg-ink-800 text-cloud-400",
};

const statusDot: Record<ImplementationStatus, string> = {
  demo: "bg-emerald-300",
  partial: "bg-sky-300",
  planned: "bg-cloud-500",
};

export function StatusTag({
  status,
  className = "",
}: {
  status: ImplementationStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${statusTone[status]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${statusDot[status]}`} aria-hidden="true" />
      {statusLabel[status]}
    </span>
  );
}
