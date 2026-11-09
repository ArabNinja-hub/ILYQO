import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  ListChecks,
  Check,
  AlarmClock,
  SkipForward,
  Phone,
  Link2,
  Info,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../../components/Button";
import { Avatar, Chips, EmptyState, PageHeader, StatusPill, Tag } from "../components/ui";
import { SearchInput, ToolbarSelect } from "../components/fields";
import { FollowUpForm } from "../forms/FollowUpForm";
import { staff, staffName } from "../data/catalog";
import { FOLLOW_UP_OUTCOMES, FOLLOW_UP_TYPES, type FollowUp, type FollowUpOutcome } from "../data/types";
import { formatDateTime, formatRelative, isDueToday, isOverdue } from "../lib/dates";
import { searchable } from "../lib/format";
import { followUpTone } from "../lib/status";
import { useDemo } from "../store/DemoContext";

type Segment = "overdue" | "today" | "upcoming" | "done";

const segments: Array<{ value: Segment; label: string }> = [
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "done", label: "Done" },
];

function segmentOf(followUp: FollowUp, now: Date): Segment {
  if (followUp.status !== "Pending") return "done";
  if (isOverdue(followUp.dueAt, now)) return "overdue";
  if (isDueToday(followUp.dueAt, now)) return "today";
  return "upcoming";
}

function FollowUpCard({ followUp, now }: { followUp: FollowUp; now: Date }) {
  const { completeFollowUp, snoozeFollowUp, skipFollowUp, reopenFollowUp } = useDemo();
  const [completing, setCompleting] = useState(false);
  const [snoozing, setSnoozing] = useState(false);
  const overdue = followUp.status === "Pending" && isOverdue(followUp.dueAt, now);
  const pending = followUp.status === "Pending";

  return (
    <li
      className={`rounded-2xl border bg-ink-800/50 p-4 transition-colors ${
        overdue ? "border-amber-400/30" : "border-line hover:border-line-strong"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar name={followUp.customerName} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="font-medium text-cloud-50">{followUp.customerName}</p>
              <StatusPill tone={followUpTone(followUp.status, overdue)}>
                {followUp.status === "Pending" ? (overdue ? "Overdue" : "Pending") : followUp.status}
              </StatusPill>
              <Tag>{followUp.type}</Tag>
              {followUp.snoozed > 0 && <Tag>Snoozed ×{followUp.snoozed}</Tag>}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-cloud-300">{followUp.reason}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-cloud-500">
              <span className={`inline-flex items-center gap-1 ${overdue ? "text-amber-200" : ""}`}>
                <AlarmClock className="h-3 w-3" aria-hidden="true" />
                {pending ? `Due ${formatRelative(followUp.dueAt, now)} · ${formatDateTime(followUp.dueAt)}` : formatDateTime(followUp.dueAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Avatar name={staffName(followUp.ownerId, false)} size="sm" />
                {staffName(followUp.ownerId)}
              </span>
              {followUp.phone && (
                <a href={`tel:${followUp.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-1 hover:text-cloud-200">
                  <Phone className="h-3 w-3" aria-hidden="true" />
                  {followUp.phone}
                </a>
              )}
              {followUp.enquiryId && (
                <Link to={`/demo/enquiries?open=${followUp.enquiryId}`} className="inline-flex items-center gap-1 text-volt-300 hover:text-volt-200">
                  <Link2 className="h-3 w-3" aria-hidden="true" />
                  Enquiry
                </Link>
              )}
              {followUp.bookingId && (
                <Link to="/demo/appointments" className="inline-flex items-center gap-1 text-volt-300 hover:text-volt-200">
                  <Link2 className="h-3 w-3" aria-hidden="true" />
                  Booking
                </Link>
              )}
            </div>
            {followUp.status === "Done" && followUp.outcome && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-200">
                <Check className="h-3 w-3" aria-hidden="true" />
                Outcome: {followUp.outcome}
                {followUp.completedAt && <span className="text-emerald-200/70">· {formatRelative(followUp.completedAt, now)}</span>}
              </p>
            )}
          </div>
        </div>

        <div className="shrink-0 lg:w-80">
          {pending ? (
            completing ? (
              <div className="space-y-2 rounded-xl border border-line bg-ink-950/50 p-3">
                <p className="text-xs font-medium text-cloud-300">What happened?</p>
                <div className="flex flex-wrap gap-1.5">
                  {FOLLOW_UP_OUTCOMES.map((outcome) => (
                    <button
                      key={outcome}
                      type="button"
                      onClick={() => {
                        completeFollowUp(followUp.id, outcome as FollowUpOutcome);
                        setCompleting(false);
                      }}
                      className="rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-cloud-200 transition-colors hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-100"
                    >
                      {outcome}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setCompleting(false)} className="text-[11px] text-cloud-500 hover:text-cloud-200">
                  Cancel
                </button>
              </div>
            ) : snoozing ? (
              <div className="space-y-2 rounded-xl border border-line bg-ink-950/50 p-3">
                <p className="text-xs font-medium text-cloud-300">Snooze until…</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { days: 1, label: "Tomorrow" },
                    { days: 3, label: "In 3 days" },
                    { days: 7, label: "Next week" },
                  ].map((option) => (
                    <button
                      key={option.days}
                      type="button"
                      onClick={() => {
                        snoozeFollowUp(followUp.id, option.days);
                        setSnoozing(false);
                      }}
                      className="rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-cloud-200 transition-colors hover:border-volt-400/40 hover:bg-volt-500/10"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setSnoozing(false)} className="text-[11px] text-cloud-500 hover:text-cloud-200">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 lg:justify-end">
                <Button size="sm" onClick={() => setCompleting(true)}>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Mark done
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setSnoozing(true)}>
                  <AlarmClock className="h-3.5 w-3.5" aria-hidden="true" />
                  Snooze
                </Button>
                <Button size="sm" variant="ghost" onClick={() => skipFollowUp(followUp.id)}>
                  <SkipForward className="h-3.5 w-3.5" aria-hidden="true" />
                  Skip
                </Button>
              </div>
            )
          ) : (
            <div className="flex lg:justify-end">
              <Button size="sm" variant="ghost" onClick={() => reopenFollowUp(followUp.id)}>
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reopen
              </Button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export function FollowUpsPage() {
  const { state } = useDemo();
  // Re-evaluate "now" whenever the list changes so due/overdue grouping stays fresh.
  const now = useMemo(() => new Date(), [state.followUps]);
  const [segment, setSegment] = useState<Segment>("overdue");
  const [type, setType] = useState("All");
  const [owner, setOwner] = useState("All");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result: Record<Segment, FollowUp[]> = { overdue: [], today: [], upcoming: [], done: [] };
    state.followUps
      .filter((f) => type === "All" || f.type === type)
      .filter((f) => owner === "All" || f.ownerId === owner)
      .filter((f) => !q || searchable(f.customerName, f.phone, f.reason, f.type).includes(q))
      .forEach((f) => result[segmentOf(f, now)].push(f));
    (Object.keys(result) as Segment[]).forEach((key) => {
      result[key].sort((a, b) =>
        key === "done"
          ? (b.completedAt ?? b.dueAt).localeCompare(a.completedAt ?? a.dueAt)
          : a.dueAt.localeCompare(b.dueAt),
      );
    });
    return result;
  }, [state.followUps, type, owner, query, now]);

  const visible = grouped[segment];
  const totalPending = grouped.overdue.length + grouped.today.length + grouped.upcoming.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Follow-ups"
        description="Call-backs, confirmations, check-ins and rebooking nudges — each with an owner, a due time and an outcome."
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New follow-up
          </Button>
        }
      />

      {grouped.overdue.length > 0 && segment !== "overdue" && (
        <button
          type="button"
          onClick={() => setSegment("overdue")}
          className="flex w-full items-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-left text-sm text-amber-100 transition-colors hover:bg-amber-400/15"
        >
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
          {grouped.overdue.length} overdue follow-up{grouped.overdue.length === 1 ? "" : "s"} need attention.
        </button>
      )}

      <div className="space-y-3 rounded-2xl border border-line bg-ink-800/40 p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchInput value={query} onChange={setQuery} placeholder="Search customer or reason…" className="lg:max-w-sm lg:flex-1" />
          <div className="flex flex-wrap gap-2">
            <ToolbarSelect value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type">
              <option value="All">All types</option>
              {FOLLOW_UP_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </ToolbarSelect>
            <ToolbarSelect value={owner} onChange={(e) => setOwner(e.target.value)} aria-label="Filter by owner">
              <option value="All">Any owner</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName}
                </option>
              ))}
            </ToolbarSelect>
          </div>
        </div>
        <Chips
          label="Filter by due date"
          value={segment}
          onChange={setSegment}
          options={segments.map((s) => ({ ...s, count: grouped[s.value].length }))}
        />
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title={
            segment === "overdue"
              ? "Nothing overdue"
              : segment === "today"
                ? "Nothing more due today"
                : segment === "upcoming"
                  ? "No upcoming follow-ups"
                  : "No completed follow-ups yet"
          }
          body={
            totalPending === 0 && segment !== "done"
              ? "Every follow-up is done. Schedule one from an enquiry, a booking or right here."
              : "Try another tab or adjust the filters."
          }
          action={
            <Button size="sm" variant="secondary" onClick={() => setCreating(true)}>
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              New follow-up
            </Button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((followUp) => (
            <FollowUpCard key={followUp.id} followUp={followUp} now={now} />
          ))}
        </ul>
      )}

      <p className="flex items-start gap-2 text-xs leading-relaxed text-cloud-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Follow-ups are tasks for your team. ILYQO records that they were done and what the outcome was — it does
        not call, message or email customers.
      </p>

      <FollowUpForm open={creating} onClose={() => setCreating(false)} />
    </div>
  );
}
