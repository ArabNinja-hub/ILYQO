/**
 * The DEMO MODE label. Shown wherever demo content appears so nobody mistakes
 * the fictional Demo Cuts data for a live business.
 */
export function DemoBadge({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-amber-400/35 bg-amber-400/10 font-semibold uppercase tracking-[0.18em] text-amber-200 ${
        compact ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-[11px]"
      } ${className}`}
      title="Fictional data for demonstration only"
    >
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="animate-ping-soft absolute inline-flex h-full w-full rounded-full bg-amber-300" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-300" />
      </span>
      Demo mode
    </span>
  );
}
