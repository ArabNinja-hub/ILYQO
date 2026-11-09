/** Date helpers. All calendar logic is in the browser's local time zone. */

const pad = (n: number) => String(n).padStart(2, "0");

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toDateKey(new Date());
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function addDaysToKey(key: string, days: number): string {
  return toDateKey(addDays(parseDateKey(key), days));
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Combines a local date key and HH:mm time into a Date. */
export function combineDateTime(dateKey: string, time: string): Date {
  const date = parseDateKey(dateKey);
  const [h, m] = time.split(":").map(Number);
  date.setHours(h, m, 0, 0);
  return date;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${pad(h)}:${pad(m)}`;
}

export function addMinutesToTime(time: string, minutes: number): string {
  return minutesToTime(timeToMinutes(time) + minutes);
}

export function timeSlots(start: string, end: string, stepMins = 15): string[] {
  const slots: string[] = [];
  for (let t = timeToMinutes(start); t < timeToMinutes(end); t += stepMins) {
    slots.push(minutesToTime(t));
  }
  return slots;
}

export function timeOfDate(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Rounds a time up to the next step (e.g. 10:07 → 10:15). */
export function roundUpToStep(date: Date, stepMins = 15): string {
  const minutes = date.getHours() * 60 + date.getMinutes();
  const rounded = Math.ceil(minutes / stepMins) * stepMins;
  return minutesToTime(Math.min(rounded, 23 * 60 + 45));
}

const dayFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });
const longDayFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
const weekdayFormatter = new Intl.DateTimeFormat("en-GB", { weekday: "short" });
const timeFormatter = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

export function formatDayLabel(dateKey: string, { relative = true } = {}): string {
  const date = parseDateKey(dateKey);
  if (relative) {
    const today = startOfDay(new Date());
    const diff = Math.round((startOfDay(date).getTime() - today.getTime()) / 86_400_000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff === -1) return "Yesterday";
  }
  return dayFormatter.format(date);
}

export function formatLongDay(date: Date): string {
  return longDayFormatter.format(date);
}

export function formatWeekday(date: Date): string {
  return weekdayFormatter.format(date);
}

export function formatTime(input: string | Date): string {
  if (typeof input === "string") {
    // Accept both HH:mm and ISO strings.
    return input.length === 5 ? input : timeFormatter.format(new Date(input));
  }
  return timeFormatter.format(input);
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return `${formatDayLabel(toDateKey(date))} · ${formatTime(date)}`;
}

/** Human-friendly relative time, e.g. "12 min ago", "in 3 days". */
export function formatRelative(iso: string, now = new Date()): string {
  const diffMs = new Date(iso).getTime() - now.getTime();
  const past = diffMs < 0;
  const abs = Math.abs(diffMs);
  const minutes = Math.round(abs / 60_000);
  const hours = Math.round(abs / 3_600_000);
  const days = Math.round(abs / 86_400_000);

  let text: string;
  if (minutes < 1) return "just now";
  else if (minutes < 60) text = `${minutes} min`;
  else if (hours < 24) text = `${hours} h`;
  else if (days === 1) return past ? "yesterday" : "tomorrow";
  else if (days < 7) text = `${days} days`;
  else if (days < 30) text = `${Math.round(days / 7)} wk`;
  else text = `${Math.round(days / 30)} mo`;

  return past ? `${text} ago` : `in ${text}`;
}

export function hoursSince(iso: string, now = new Date()): number {
  return (now.getTime() - new Date(iso).getTime()) / 3_600_000;
}

export function isOverdue(iso: string, now = new Date()): boolean {
  return new Date(iso).getTime() < now.getTime();
}

export function isDueToday(iso: string, now = new Date()): boolean {
  return isSameDay(new Date(iso), now);
}

export function daysBetweenKeys(a: string, b: string): number {
  return Math.round((parseDateKey(b).getTime() - parseDateKey(a).getTime()) / 86_400_000);
}
