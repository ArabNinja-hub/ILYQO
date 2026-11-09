import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Inbox,
  CalendarDays,
  ListChecks,
  TrendingUp,
  Plus,
  CalendarPlus,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/Button";
import { BarList, Panel, PanelLink, StatCard, StatusPill, Avatar, EmptyState } from "../components/ui";
import { EnquiryForm } from "../forms/EnquiryForm";
import { BookingForm } from "../forms/BookingForm";
import { FollowUpForm } from "../forms/FollowUpForm";
import { business, getStaff, serviceName, staffName } from "../data/catalog";
import { addDaysToKey, formatLongDay, formatRelative, formatTime, hoursSince, todayKey } from "../lib/dates";
import { formatMoney, pluralise } from "../lib/format";
import { bookingTone, enquiryTone } from "../lib/status";
import { useDemo } from "../store/DemoContext";
import {
  conversionRate,
  countBy,
  dueTodayFollowUps,
  newEnquiries,
  nextBooking,
  overdueFollowUps,
  recentEnquiries,
  staleNewEnquiries,
  takings,
  todaysBookings,
} from "../store/selectors";

function greeting(now: Date) {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

type Dialog = "enquiry" | "booking" | "followUp" | null;

export function OverviewPage() {
  const { state } = useDemo();
  const [dialog, setDialog] = useState<Dialog>(null);
  const now = useMemo(() => new Date(), []);
  const user = getStaff(business.currentUser);

  const data = useMemo(() => {
    const today = todaysBookings(state);
    const fresh = newEnquiries(state);
    const stale = staleNewEnquiries(state, 24, now);
    const overdue = overdueFollowUps(state, now);
    const dueToday = dueTodayFollowUps(state, now);
    const last30 = recentEnquiries(state, 30, now);
    const conversion = conversionRate(last30);
    const next = nextBooking(today, now);
    const money = takings(today);
    const tomorrow = addDaysToKey(todayKey(), 1);
    const unconfirmedSoon = state.bookings.filter(
      (b) => b.status === "Scheduled" && (b.dateKey === todayKey() || b.dateKey === tomorrow),
    );
    const completedBookings30 = state.bookings.filter(
      (b) => b.status === "Completed" && new Date(b.createdAt).getTime() >= now.getTime() - 30 * 86_400_000,
    );
    return {
      today,
      fresh,
      stale,
      overdue,
      dueToday,
      conversion,
      next,
      money,
      unconfirmedSoon,
      sources: countBy(last30, (e) => e.channel).slice(0, 5),
      services: countBy(completedBookings30, (b) => serviceName(b.serviceId)).slice(0, 5),
      recent: [...state.enquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    };
  }, [state, now]);

  const attention = [
    ...data.overdue.map((f) => ({
      id: f.id,
      icon: AlertTriangle,
      tone: "text-amber-300",
      title: `Follow-up overdue — ${f.customerName}`,
      body: f.reason,
      meta: `Due ${formatRelative(f.dueAt, now)} · ${staffName(f.ownerId)}`,
      to: "/demo/follow-ups",
    })),
    ...data.stale.map((e) => ({
      id: e.id,
      icon: Inbox,
      tone: "text-volt-300",
      title: `Enquiry unanswered for ${Math.floor(hoursSince(e.createdAt, now))} h — ${e.customerName}`,
      body: e.message,
      meta: `${e.channel} · ${e.assignedTo ? staffName(e.assignedTo) : "Unassigned"}`,
      to: `/demo/enquiries?open=${e.id}`,
    })),
    ...data.unconfirmedSoon.slice(0, 3).map((b) => ({
      id: b.id,
      icon: Clock,
      tone: "text-sky-300",
      title: `Not yet confirmed — ${b.customerName}`,
      body: `${serviceName(b.serviceId)} with ${staffName(b.staffId)}, ${b.dateKey === todayKey() ? "today" : "tomorrow"} at ${b.time}.`,
      meta: b.phone || "No phone number",
      to: `/demo/appointments?date=${b.dateKey}`,
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-volt-400">{formatLongDay(now)}</p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-cloud-50 sm:text-3xl">
            {greeting(now)}, {user?.firstName ?? "there"}.
          </h1>
          <p className="mt-1.5 text-sm text-cloud-400">
            Here's how {business.name} looks right now —{" "}
            {data.next
              ? `next up is ${data.next.customerName} at ${data.next.time} with ${staffName(data.next.staffId)}.`
              : "no more appointments today."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setDialog("enquiry")}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            New enquiry
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setDialog("booking")}>
            <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" />
            New booking
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setDialog("followUp")}>
            <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
            New follow-up
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Inbox}
          label="New enquiries"
          value={data.fresh.length}
          hint={data.stale.length ? `${pluralise(data.stale.length, "enquiry", "enquiries")} waiting over 24 h` : "All answered within 24 h"}
          tone="indigo"
          to="/demo/enquiries?status=New"
        />
        <StatCard
          icon={CalendarDays}
          label="Appointments today"
          value={data.today.filter((b) => b.status !== "Cancelled").length}
          hint={`${data.today.filter((b) => b.status === "Completed").length} completed · ${formatMoney(data.money.completed)} taken · ${formatMoney(data.money.expected)} expected`}
          tone="sky"
          to="/demo/appointments"
          delay={60}
        />
        <StatCard
          icon={ListChecks}
          label="Follow-ups due today"
          value={data.dueToday.length + data.overdue.length}
          hint={data.overdue.length ? `${data.overdue.length} overdue` : "Nothing overdue"}
          tone={data.overdue.length ? "amber" : "emerald"}
          to="/demo/follow-ups"
          delay={120}
        />
        <StatCard
          icon={TrendingUp}
          label="Enquiries that became bookings"
          value={`${data.conversion.rate}%`}
          hint={`${data.conversion.booked} of ${data.conversion.resolved} resolved · last 30 days`}
          tone="emerald"
          to="/demo/enquiries?status=Booked"
          delay={180}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="Needs attention"
          subtitle="Overdue follow-ups, unanswered enquiries and unconfirmed appointments."
          action={<PanelLink to="/demo/follow-ups">All follow-ups</PanelLink>}
          bodyClassName="p-2"
        >
          {attention.length === 0 ? (
            <div className="p-3">
              <EmptyState
                icon={CheckCircle2}
                title="Everything is under control"
                body="No overdue follow-ups, no enquiries waiting more than a day and today's appointments are confirmed."
              />
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {attention.slice(0, 6).map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    className="flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-ink-800/70"
                  >
                    <item.icon className={`mt-0.5 h-4 w-4 shrink-0 ${item.tone}`} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-cloud-50">{item.title}</span>
                      <span className="mt-0.5 line-clamp-2 block text-sm text-cloud-400">{item.body}</span>
                      <span className="mt-1 block text-xs text-cloud-500">{item.meta}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Today's schedule"
          subtitle={`${pluralise(data.today.length, "booking")} · ${business.hours.split(" · ")[0]}`}
          action={<PanelLink to="/demo/appointments">Open book</PanelLink>}
          bodyClassName="p-2"
        >
          {data.today.length === 0 ? (
            <div className="p-3">
              <EmptyState icon={CalendarDays} title="No bookings today" body="Create one from the Appointments page." />
            </div>
          ) : (
            <ol className="divide-y divide-line">
              {data.today.map((booking) => {
                const isNext = data.next?.id === booking.id;
                return (
                  <li key={booking.id} className={`flex items-center gap-3 px-3 py-2.5 ${isNext ? "rounded-xl bg-volt-500/10" : ""}`}>
                    <span className="w-12 shrink-0 font-display text-sm font-semibold tabular-nums text-cloud-200">
                      {formatTime(booking.time)}
                    </span>
                    <Avatar name={booking.customerName} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-cloud-50">{booking.customerName}</span>
                      <span className="block truncate text-xs text-cloud-500">
                        {serviceName(booking.serviceId)} · {staffName(booking.staffId)}
                      </span>
                    </span>
                    {isNext && (
                      <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-volt-300 sm:inline">
                        Next
                      </span>
                    )}
                    <StatusPill tone={bookingTone(booking.status)}>{booking.status}</StatusPill>
                  </li>
                );
              })}
            </ol>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="Recent enquiries"
          action={<PanelLink to="/demo/enquiries">View all</PanelLink>}
          bodyClassName="p-2"
          className="lg:col-span-1"
        >
          <ul className="divide-y divide-line">
            {data.recent.map((enquiry) => (
              <li key={enquiry.id}>
                <Link
                  to={`/demo/enquiries?open=${enquiry.id}`}
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-ink-800/70"
                >
                  <Avatar name={enquiry.customerName} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-cloud-50">{enquiry.customerName}</span>
                      <span className="shrink-0 text-[11px] text-cloud-500">{formatRelative(enquiry.createdAt, now)}</span>
                    </span>
                    <span className="mt-0.5 line-clamp-1 block text-xs text-cloud-400">{enquiry.message}</span>
                    <span className="mt-1.5 block">
                      <StatusPill tone={enquiryTone(enquiry.status)}>{enquiry.status}</StatusPill>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Where enquiries come from" subtitle="Last 30 days">
          <BarList items={data.sources.map((s) => ({ label: s.key, value: s.count }))} />
        </Panel>

        <Panel title="Most booked services" subtitle="Completed in the last 30 days">
          <BarList items={data.services.map((s) => ({ label: s.key, value: s.count }))} />
          <p className="mt-5 flex items-start gap-2 border-t border-line pt-4 text-xs leading-relaxed text-cloud-500">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-volt-300" aria-hidden="true" />
            Simple counts from the demo data — no forecasting or AI in this phase.
          </p>
        </Panel>
      </div>

      <EnquiryForm open={dialog === "enquiry"} onClose={() => setDialog(null)} />
      <BookingForm open={dialog === "booking"} onClose={() => setDialog(null)} />
      <FollowUpForm open={dialog === "followUp"} onClose={() => setDialog(null)} />
    </div>
  );
}
