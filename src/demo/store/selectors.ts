import type { Booking, DemoState, Enquiry, FollowUp } from "../data/types";
import { combineDateTime, hoursSince, isDueToday, isOverdue, timeToMinutes, todayKey } from "../lib/dates";

/** Pure read helpers over the demo state. Keep UI components free of this logic. */

export function sortByTime(bookings: Booking[]): Booking[] {
  return [...bookings].sort(
    (a, b) => a.dateKey.localeCompare(b.dateKey) || timeToMinutes(a.time) - timeToMinutes(b.time),
  );
}

export function bookingsOn(state: DemoState, dateKey: string): Booking[] {
  return sortByTime(state.bookings.filter((b) => b.dateKey === dateKey));
}

export function todaysBookings(state: DemoState): Booking[] {
  return bookingsOn(state, todayKey());
}

export function nextBooking(bookings: Booking[], now = new Date()): Booking | undefined {
  return sortByTime(bookings).find(
    (b) =>
      (b.status === "Scheduled" || b.status === "Confirmed") &&
      combineDateTime(b.dateKey, b.time).getTime() >= now.getTime(),
  );
}

export function bookingEnd(booking: Booking): Date {
  const start = combineDateTime(booking.dateKey, booking.time);
  return new Date(start.getTime() + booking.durationMins * 60_000);
}

/** Bookings for the same staff member that overlap the proposed slot. */
export function findClashes(
  bookings: Booking[],
  proposal: { staffId: string; dateKey: string; time: string; durationMins: number; ignoreId?: string },
): Booking[] {
  const start = timeToMinutes(proposal.time);
  const end = start + proposal.durationMins;
  return bookings.filter((b) => {
    if (b.id === proposal.ignoreId) return false;
    if (b.staffId !== proposal.staffId || b.dateKey !== proposal.dateKey) return false;
    if (b.status === "Cancelled") return false;
    const bStart = timeToMinutes(b.time);
    const bEnd = bStart + b.durationMins;
    return start < bEnd && end > bStart;
  });
}

export function pendingFollowUps(state: DemoState): FollowUp[] {
  return state.followUps.filter((f) => f.status === "Pending");
}

export function overdueFollowUps(state: DemoState, now = new Date()): FollowUp[] {
  return pendingFollowUps(state)
    .filter((f) => isOverdue(f.dueAt, now))
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

/** Pending follow-ups due later today (overdue ones are reported by `overdueFollowUps`). */
export function dueTodayFollowUps(state: DemoState, now = new Date()): FollowUp[] {
  return pendingFollowUps(state)
    .filter((f) => isDueToday(f.dueAt, now) && !isOverdue(f.dueAt, now))
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

export function upcomingFollowUps(state: DemoState, now = new Date()): FollowUp[] {
  return pendingFollowUps(state)
    .filter((f) => !isOverdue(f.dueAt, now) && !isDueToday(f.dueAt, now))
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

export function newEnquiries(state: DemoState): Enquiry[] {
  return state.enquiries.filter((e) => e.status === "New");
}

export function staleNewEnquiries(state: DemoState, hours = 24, now = new Date()): Enquiry[] {
  return newEnquiries(state).filter((e) => hoursSince(e.createdAt, now) >= hours);
}

/** Enquiries created in the last `days` days. */
export function recentEnquiries(state: DemoState, days: number, now = new Date()): Enquiry[] {
  const cutoff = now.getTime() - days * 86_400_000;
  return state.enquiries.filter((e) => new Date(e.createdAt).getTime() >= cutoff);
}

/** Share of resolved enquiries (not New/Contacted) that became bookings. */
export function conversionRate(enquiries: Enquiry[]): { booked: number; resolved: number; rate: number } {
  const resolved = enquiries.filter((e) => e.status !== "New" && e.status !== "Contacted");
  const booked = resolved.filter((e) => e.status === "Booked");
  return {
    booked: booked.length,
    resolved: resolved.length,
    rate: resolved.length ? Math.round((booked.length / resolved.length) * 100) : 0,
  };
}

export function countBy<T, K extends string>(items: T[], key: (item: T) => K): Array<{ key: K; count: number }> {
  const counts = new Map<K, number>();
  for (const item of items) counts.set(key(item), (counts.get(key(item)) ?? 0) + 1);
  return [...counts.entries()].map(([k, count]) => ({ key: k, count })).sort((a, b) => b.count - a.count);
}

export function takings(bookings: Booking[]): { completed: number; expected: number } {
  return bookings.reduce(
    (acc, b) => {
      if (b.status === "Completed") acc.completed += b.price;
      else if (b.status === "Scheduled" || b.status === "Confirmed") acc.expected += b.price;
      return acc;
    },
    { completed: 0, expected: 0 },
  );
}

/** Distinct customers known to the demo (for pickers). */
export function knownCustomers(state: DemoState): Array<{ name: string; phone: string }> {
  const seen = new Map<string, { name: string; phone: string }>();
  const add = (name: string, phone: string) => {
    const key = name.trim().toLowerCase();
    if (!seen.has(key)) seen.set(key, { name, phone });
  };
  state.enquiries.forEach((e) => add(e.customerName, e.phone));
  state.bookings.forEach((b) => add(b.customerName, b.phone));
  state.followUps.forEach((f) => add(f.customerName, f.phone));
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function findEnquiry(state: DemoState, id: string | undefined): Enquiry | undefined {
  return id ? state.enquiries.find((e) => e.id === id) : undefined;
}

export function findBooking(state: DemoState, id: string | undefined): Booking | undefined {
  return id ? state.bookings.find((b) => b.id === id) : undefined;
}
