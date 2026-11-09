import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { useDemo, type ToastTone } from "../store/DemoContext";

const toneStyles: Record<ToastTone, { icon: typeof Info; className: string }> = {
  success: { icon: CheckCircle2, className: "border-emerald-400/30 text-emerald-200" },
  info: { icon: Info, className: "border-volt-400/30 text-volt-200" },
  warning: { icon: AlertTriangle, className: "border-amber-400/30 text-amber-200" },
};

export function Toasts() {
  const { toasts, dismissToast } = useDemo();
  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-24 z-[90] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const { icon: ToastIcon, className } = toneStyles[toast.tone];
        return (
          <div
            key={toast.id}
            className={`animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-ink-900/95 px-4 py-3 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur ${className}`}
          >
            <ToastIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p className="flex-1 text-sm text-cloud-100">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-cloud-500 hover:bg-ink-700 hover:text-cloud-100"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
