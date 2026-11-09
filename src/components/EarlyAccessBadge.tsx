import { Sparkles } from "lucide-react";

/** Small pill used across the site to signal early-access status. */
export function EarlyAccessBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-volt-400/30 bg-volt-500/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-volt-300 ${className}`}
    >
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      Early access — product in development
    </span>
  );
}
