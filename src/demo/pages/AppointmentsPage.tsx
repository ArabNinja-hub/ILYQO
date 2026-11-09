import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
  UserX,
  XCircle,
  BadgeCheck,
  Phone,
  Link2,
  StickyNote,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Avatar, Chips, EmptyState, PageHeader, StatusPill, Tag } from "../components/ui";
import { SearchInput, ToolbarSelect } from "../components/fields";
import { BookingForm } from "../forms/BookingForm";
import { barbers, serviceName, staffName } from "../data/catalog";
import { BOOKING_STATUSES, type Booking, type BookingStatus, type StaffId } from "../data/types";
import {
  addDaysToKey,
  addMinutesToTime,
  daysBetweenKeys,
  formatDayLabel,
  formatWeekday,
  parseDateKey,
  todayKey,
} from "../lib/dates";
import { formatMoney, pluralise, searchable } from "../lib/format";
import { bookingTone } from "../lib/status";
import { useDemo } from "../store/DemoContext";
import { bookingsOn, sortByTime, takings } from "../store/selectors";

type BarberFilter = "All" | StaffId;
type View = "day" | "upcoming";

const dateKeyPattern = /^\d{4}-\d{2}-\d{2}$/;

function StatusActions({ booking, onChange }: { booking: Booking; onChange: (status: BookingStatus) => void }) {
  const actions: Array<{ status: BookingStatus; label: string; icon: typeof CheckCircle2; variant?: "danger" }> = [];
  if (booking.status === "Scheduled") actions.push({ status: "Confirmed", label: "Confirm", icon: BadgeCheck });
  if (booking.status === "Scheduled" || booking.status === "Confirmed") {
    actions.push({ status: "Completed", label: "Complete", icon: CheckCircle2 });
    actions.push({ status: "No-show", label: "No-show", icon: UserX });
    actions.push({ status: "Cancelled", label: "Cancel", icon: XCircle, variant: "danger" });
  }
  if (actions.length === 0) {
    return (
      <button
        type="button"
        onClick={() => onChange("Scheduled")}
        className="text-xs text-cloud-500 underline-offset-4 hover:text-cloud-200 hover:underline"
      >
        Reopen
      </button>
    );
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {actions.map((action) => (
        <button
          key={action.status}
          type="button"
          onClick={() => onChange(action.status)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
            action.variant === "danger"
              ? "border-rose-400/25 text-rose-200 hover:bg-rose-500/15"
              : action.status === "Completed"
                ? "border-emerald-400/30 text-emerald-200 hover:bg-emerald-400/15"
                : "border-line text-cloud-300 hover:border-line-strong hover:text-cloud-50"
          }`}
        >
          <action.icon className="h-3 w-3" aria-hidden="true" />
          {action.label}
        </button>
      ))}
    </div>
  );
}

function BookingRow({ booking, onStatus, showDay = false }: { booking: Booking; onStatus: (status: BookingStatus) => void; showDay?: boolean }) {
  const cancelled = booking.status === "Cancelled";
  return (
    <li
      className={`grid gap-3 rounded-2xl border border-line bg-ink-800/50 p-4 transition-colors hover:border-line-strong sm:grid-cols-[auto_1fr_auto] sm:items-center ${
        cancelled ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center gap-3 sm:w-28 sm:flex-col sm:items-start sm:gap-0.5">
        <span className="font-display text-lg font-semibold tabular-nums text-cloud-50">{booking.time}</span>
        <span className="text-xs text-cloud-500">
          {showDay ? formatDayLabel(booking.dateKey) : `to ${addMinutesToTime(booking.time, booking.durationMins)}`}
        </span>
      </div>

      <div className="flex min-w-0 items-start gap-3">
        <Avatar name={booking.customerName} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className={`font-medium text-cloud-50 ${cancelled ? "line-through" : ""}`}>{booking.customerName}</p>
            <StatusPill tone={bookingTone(booking.status)}>{booking.status}</StatusPill>
          </div>
          <p className="mt-0.5 text-sm text-cloud-300">
            {serviceName(booking.serviceId)} · {booking.durationMins} min · {formatMoney(booking.price)}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-cloud-500">
            <span className="inline-flex items-center gap-1.5">
              <Avatar name={staffName(booking.staffId, false)} size="sm" />
              {staffName(booking.staffId)}
            </span>
            {booking.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3 w-3" aria-hidden="true" />
                {booking.phone}
              </span>
            )}
            {booking.enquiryId && (
              <Link to={`/demo/enquiries?open=${booking.enquiryId}`} className="inline-flex items-center gap-1 text-volt-300 hover:text-volt-200">
                <Link2 className="h-3 w-3" aria-hidden="true" />
                From enquiry
              </Link>
            )}
          </div>
          {booking.notes && (
            <p className="mt-2 inline-flex items-start gap-1.5 rounded-lg bg-ink-950/50 px-2.5 py-1.5 text-xs text-cloud-400">
              <StickyNote className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
              {booking.notes}
            </p>
          )}
        </div>
      </div>

      <div className="sm:justify-self-end">
        <StatusActions booking={booking} onChange={onStatus} />
      </div>
    </li>
  );
}

export function AppointmentsPage() {
  const { state, setBookingStatus } = useDemo();
  const [params, setParams] = useSearchParams();
  const dateParam = params.get("date");
  const selectedKey = dateParam && dateKeyPattern.test(dateParam) ? dateParam : todayKey();

  const [view, setView] = useState<View>("day");
  const [barber, setBarber] = useState<BarberFilter>("All");
  const [status, setStatus] = useState<"All" | BookingStatus>("All");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  const setSelectedKey = (key: string) => {
    const next = new URLSearchParams(params);
    if (key === todayKey()) next.delete("date");
    else next.set("date", key);
    setParams(next, { replace: true });
  };

  // Seven-day strip centred around the selected day (always includes it).
  const stripStart = addDaysToKey(selectedKey, -3);
  const strip = Array.from({ length: 7 }, (_, i) => addDaysToKey(stripStart, i));

  // On narrow screens the strip scrolls horizontally; keep the selected day in view.
  const stripRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const list = stripRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!list || !active || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({
      left: active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [selectedKey, view]);

  const countsByDay = useMemo(() => {
    const counts = new Map<string, number>();
    state.bookings.forEach((b) => {
      if (b.status !== "Cancelled") counts.set(b.dateKey, (counts.get(b.dateKey) ?? 0) + 1);
    });
    return counts;
  }, [state.bookings]);

  const applyFilters = useCallback(
    (bookings: Booking[]) => {
      const q = query.trim().toLowerCase();
      return bookings
        .filter((b) => barber === "All" || b.staffId === barber)
        .filter((b) => status === "All" || b.status === status)
        .filter((b) => !q || searchable(b.customerName, b.phone, serviceName(b.serviceId), b.notes).includes(q));
    },
    [barber, status, query],
  );

  const dayBookings = useMemo(() => applyFilters(bookingsOn(state, selectedKey)), [state, selectedKey, applyFilters]);

  const upcoming = useMemo(() => {
    const start = todayKey();
    const end = addDaysToKey(start, 14);
    const list = applyFilters(sortByTime(state.bookings.filter((b) => b.dateKey >= start && b.dateKey <= end)));
    const groups = new Map<string, Booking[]>();
    list.forEach((b) => groups.set(b.dateKey, [...(groups.get(b.dateKey) ?? []), b]));
    return [...groups.entries()];
  }, [state, applyFilters]);

  const summary = useMemo(() => {
    const all = bookingsOn(state, selectedKey);
    const money = takings(all);
    return {
      total: all.filter((b) => b.status !== "Cancelled").length,
      completed: all.filter((b) => b.status === "Completed").length,
      noShows: all.filter((b) => b.status === "No-show").length,
      money,
    };
  }, [state, selectedKey]);

  const barberOptions: Array<{ value: BarberFilter; label: string; count?: number }> = [
    { value: "All", label: "All barbers" },
    ...barbers.map((b) => ({
      value: b.id as BarberFilter,
      label: b.firstName,
      count: bookingsOn(state, selectedKey).filter((x) => x.staffId === b.id && x.status !== "Cancelled").length,
    })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="The shared appointment book. Each barber's day at a glance, with confirmations, completions and no-shows recorded as they happen."
        actions={
          <Button onClick={() => setCreating(true)}>
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            New booking
          </Button>
        }
      />

      <div className="space-y-4 rounded-2xl border border-line bg-ink-800/40 p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex rounded-full border border-line bg-ink-900/40 p-1 text-xs font-medium" role="tablist" aria-label="View">
            {(["day", "upcoming"] as View[]).map((option) => (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={view === option}
                onClick={() => setView(option)}
                className={`rounded-full px-3.5 py-1.5 transition-colors ${
                  view === option ? "bg-volt-500/20 text-volt-100" : "text-cloud-400 hover:text-cloud-100"
                }`}
              >
                {option === "day" ? "Day" : "Next 14 days"}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SearchInput value={query} onChange={setQuery} placeholder="Search customer or service…" className="sm:w-64" />
            <ToolbarSelect value={status} onChange={(e) => setStatus(e.target.value as "All" | BookingStatus)} aria-label="Filter by status">
              <option value="All">All statuses</option>
              {BOOKING_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </ToolbarSelect>
          </div>
        </div>

        {view === "day" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedKey(addDaysToKey(selectedKey, -1))}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-cloud-300 hover:border-line-strong"
              aria-label="Previous day"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <ol ref={stripRef} className="scroll-x relative flex flex-1 gap-1.5" aria-label="Choose a day">
              {strip.map((key) => {
                const date = parseDateKey(key);
                const active = key === selectedKey;
                const isToday = key === todayKey();
                const count = countsByDay.get(key) ?? 0;
                return (
                  <li key={key} className="min-w-[4.25rem] flex-1">
                    <button
                      type="button"
                      onClick={() => setSelectedKey(key)}
                      aria-pressed={active}
                      aria-label={formatDayLabel(key, { relative: false })}
                      className={`flex w-full flex-col items-center rounded-xl border px-2 py-2 transition-colors ${
                        active
                          ? "border-volt-400/50 bg-volt-500/20 text-cloud-50"
                          : "border-line bg-ink-900/40 text-cloud-400 hover:border-line-strong hover:text-cloud-100"
                      }`}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-wider">{isToday ? "Today" : formatWeekday(date)}</span>
                      <span className="mt-0.5 font-display text-lg font-semibold tabular-nums">{date.getDate()}</span>
                      <span className={`mt-1 h-1.5 w-1.5 rounded-full ${count ? (active ? "bg-volt-200" : "bg-volt-400/70") : "bg-transparent"}`} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ol>
            <button
              type="button"
              onClick={() => setSelectedKey(addDaysToKey(selectedKey, 1))}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-cloud-300 hover:border-line-strong"
              aria-label="Next day"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        <Chips label="Filter by barber" value={barber} onChange={setBarber} options={barberOptions} />
      </div>

      {view === "day" ? (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-cloud-50">
                {formatDayLabel(selectedKey)}
                {formatDayLabel(selectedKey) !== formatDayLabel(selectedKey, { relative: false }) && (
                  <span className="ml-2 text-sm font-normal text-cloud-500">{formatDayLabel(selectedKey, { relative: false })}</span>
                )}
              </h2>
              <p className="mt-0.5 text-xs text-cloud-500">
                {pluralise(summary.total, "booking")} · {summary.completed} completed
                {summary.noShows ? ` · ${pluralise(summary.noShows, "no-show")}` : ""} · {formatMoney(summary.money.completed)} taken ·{" "}
                {formatMoney(summary.money.expected)} expected
              </p>
            </div>
            {selectedKey !== todayKey() && (
              <Button size="sm" variant="ghost" onClick={() => setSelectedKey(todayKey())}>
                Jump to today
              </Button>
            )}
          </div>

          {dayBookings.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title={daysBetweenKeys(todayKey(), selectedKey) < 0 ? "No bookings recorded" : "Nothing booked yet"}
              body={
                query || barber !== "All" || status !== "All"
                  ? "No bookings match the current filters."
                  : "This day is open. Create a booking to fill it."
              }
              action={
                daysBetweenKeys(todayKey(), selectedKey) >= 0 ? (
                  <Button size="sm" onClick={() => setCreating(true)}>
                    <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" />
                    New booking
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <ul className="space-y-3">
              {dayBookings.map((booking) => (
                <BookingRow key={booking.id} booking={booking} onStatus={(s) => setBookingStatus(booking.id, s)} />
              ))}
            </ul>
          )}
        </>
      ) : upcoming.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Nothing in the next 14 days" body="No bookings match the current filters." />
      ) : (
        <div className="space-y-8">
          {upcoming.map(([key, bookings]) => (
            <section key={key} aria-labelledby={`day-${key}`}>
              <div className="mb-3 flex items-center justify-between">
                <h2 id={`day-${key}`} className="font-display text-base font-semibold text-cloud-50">
                  {formatDayLabel(key)}{" "}
                  <span className="ml-1 text-sm font-normal text-cloud-500">{formatDayLabel(key, { relative: false })}</span>
                </h2>
                <Tag>{pluralise(bookings.filter((b) => b.status !== "Cancelled").length, "booking")}</Tag>
              </div>
              <ul className="space-y-3">
                {bookings.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} onStatus={(s) => setBookingStatus(booking.id, s)} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <BookingForm
        open={creating}
        onClose={() => setCreating(false)}
        prefill={{ dateKey: daysBetweenKeys(todayKey(), selectedKey) >= 0 ? selectedKey : todayKey(), staffId: barber === "All" ? undefined : barber }}
        onCreated={(booking) => setSelectedKey(booking.dateKey)}
      />
    </div>
  );
}
