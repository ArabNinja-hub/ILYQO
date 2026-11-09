import type { BookingStatus, EnquiryStatus, FollowUpStatus } from "../data/types";

export type Tone = "indigo" | "sky" | "emerald" | "amber" | "rose" | "slate";

export const toneClasses: Record<Tone, string> = {
  indigo: "bg-volt-500/15 text-volt-200 ring-volt-400/30",
  sky: "bg-sky-400/15 text-sky-200 ring-sky-400/30",
  emerald: "bg-emerald-400/15 text-emerald-200 ring-emerald-400/30",
  amber: "bg-amber-400/15 text-amber-200 ring-amber-400/30",
  rose: "bg-rose-400/15 text-rose-200 ring-rose-400/30",
  slate: "bg-ink-700 text-cloud-300 ring-line-strong",
};

export const toneDot: Record<Tone, string> = {
  indigo: "bg-volt-400",
  sky: "bg-sky-300",
  emerald: "bg-emerald-300",
  amber: "bg-amber-300",
  rose: "bg-rose-300",
  slate: "bg-cloud-500",
};

export function enquiryTone(status: EnquiryStatus): Tone {
  switch (status) {
    case "New":
      return "indigo";
    case "Contacted":
      return "sky";
    case "Booked":
      return "emerald";
    case "Lost":
      return "rose";
    default:
      return "slate";
  }
}

export function bookingTone(status: BookingStatus): Tone {
  switch (status) {
    case "Scheduled":
      return "indigo";
    case "Confirmed":
      return "sky";
    case "Completed":
      return "emerald";
    case "No-show":
      return "rose";
    default:
      return "slate";
  }
}

export function followUpTone(status: FollowUpStatus, overdue = false): Tone {
  if (status === "Done") return "emerald";
  if (status === "Skipped") return "slate";
  return overdue ? "amber" : "indigo";
}
