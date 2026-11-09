import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CalendarPlus, ListChecks, Phone, MessageSquareText, Flag, UserRound, Send, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/Button";
import { Modal } from "./Modal";
import { Avatar, StatusPill, Tag } from "./ui";
import { Select, Textarea } from "./fields";
import { serviceName, staff, staffName } from "../data/catalog";
import type { Enquiry, StaffId } from "../data/types";
import { formatDateTime, formatRelative, formatDayLabel } from "../lib/dates";
import { enquiryTone } from "../lib/status";
import { useDemo } from "../store/DemoContext";
import { findBooking } from "../store/selectors";

export function EnquiryDetail({
  enquiry,
  onClose,
  onCreateBooking,
  onScheduleFollowUp,
}: {
  enquiry: Enquiry | null;
  onClose: () => void;
  onCreateBooking: (enquiry: Enquiry) => void;
  onScheduleFollowUp: (enquiry: Enquiry) => void;
}) {
  const { state, setEnquiryStatus, addEnquiryNote, assignEnquiry } = useDemo();
  const [note, setNote] = useState("");
  const [closing, setClosing] = useState<"Closed" | "Lost" | null>(null);
  const [closeReason, setCloseReason] = useState("");

  if (!enquiry) return null;

  const booking = findBooking(state, enquiry.bookingId);
  const relatedFollowUps = state.followUps.filter((f) => f.enquiryId === enquiry.id);
  const open = enquiry.status === "New" || enquiry.status === "Contacted";

  function submitNote(event: FormEvent) {
    event.preventDefault();
    if (!note.trim() || !enquiry) return;
    addEnquiryNote(enquiry.id, note.trim());
    setNote("");
  }

  function confirmClose() {
    if (!closing || !enquiry) return;
    setEnquiryStatus(enquiry.id, closing, closeReason.trim() || undefined);
    setClosing(null);
    setCloseReason("");
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={enquiry.customerName}
      description={`${enquiry.channel} · received ${formatDateTime(enquiry.createdAt)}`}
      size="lg"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={enquiryTone(enquiry.status)}>{enquiry.status}</StatusPill>
            {enquiry.priority === "High" && (
              <StatusPill tone="amber">
                <Flag className="h-3 w-3" aria-hidden="true" />
                High priority
              </StatusPill>
            )}
            <Tag>{serviceName(enquiry.serviceId)}</Tag>
            {enquiry.phone ? (
              <a href={`tel:${enquiry.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-1.5 text-xs text-cloud-300 hover:text-cloud-50">
                <Phone className="h-3.5 w-3.5 text-volt-300" aria-hidden="true" />
                {enquiry.phone}
              </a>
            ) : (
              <Tag>No phone number</Tag>
            )}
          </div>

          <blockquote className="rounded-2xl border border-line bg-ink-950/60 p-4">
            <p className="flex items-start gap-2.5 text-sm leading-relaxed text-cloud-100">
              <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-volt-300" aria-hidden="true" />
              {enquiry.message}
            </p>
          </blockquote>

          {open && (
            <div className="rounded-2xl border border-line bg-ink-800/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cloud-500">Next step</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {enquiry.status === "New" && (
                  <Button size="sm" variant="secondary" onClick={() => setEnquiryStatus(enquiry.id, "Contacted")}>
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Mark as contacted
                  </Button>
                )}
                <Button size="sm" onClick={() => onCreateBooking(enquiry)}>
                  <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" />
                  Create booking
                </Button>
                <Button size="sm" variant="secondary" onClick={() => onScheduleFollowUp(enquiry)}>
                  <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
                  Schedule follow-up
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setClosing("Closed")}>
                  Close
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setClosing("Lost")}>
                  <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  Mark lost
                </Button>
              </div>

              {closing && (
                <div className="mt-4 space-y-3 border-t border-line pt-4">
                  <label htmlFor="close-reason" className="block text-sm font-medium text-cloud-300">
                    {closing === "Lost" ? "Why was this lost?" : "Why are you closing it?"}{" "}
                    <span className="font-normal text-cloud-500">(optional)</span>
                  </label>
                  <Textarea
                    id="close-reason"
                    rows={2}
                    value={closeReason}
                    onChange={(e) => setCloseReason(e.target.value)}
                    placeholder={closing === "Lost" ? "e.g. Went elsewhere — we couldn't do Sunday." : "e.g. Question answered, no booking needed."}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant={closing === "Lost" ? "danger" : "primary"} onClick={confirmClose}>
                      Confirm {closing.toLowerCase()}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setClosing(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {!open && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-ink-800/60 p-4 text-sm text-cloud-300">
              This enquiry is {enquiry.status.toLowerCase()}.
              <Button size="sm" variant="ghost" onClick={() => setEnquiryStatus(enquiry.id, "Contacted", "Reopened.")}>
                Reopen
              </Button>
            </div>
          )}

          <div>
            <label htmlFor="enq-assign" className="text-xs font-semibold uppercase tracking-[0.18em] text-cloud-500">
              Assigned to
            </label>
            <div className="mt-2 flex items-center gap-3">
              <Avatar name={staffName(enquiry.assignedTo, false)} size="sm" />
              <Select
                id="enq-assign"
                value={enquiry.assignedTo ?? ""}
                onChange={(e) => assignEnquiry(enquiry.id, (e.target.value || undefined) as StaffId | undefined)}
                className="py-2"
              >
                <option value="">Unassigned</option>
                {staff.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} · {member.role}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {(booking || relatedFollowUps.length > 0) && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cloud-500">Linked records</p>
              {booking && (
                <Link
                  to={`/demo/appointments?date=${booking.dateKey}`}
                  className="flex items-center gap-3 rounded-xl border border-line bg-ink-950/50 px-3.5 py-3 transition-colors hover:border-volt-400/40"
                >
                  <CalendarPlus className="h-4 w-4 shrink-0 text-volt-300" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-cloud-50">
                      {formatDayLabel(booking.dateKey)} {booking.time} · {serviceName(booking.serviceId)}
                    </span>
                    <span className="block text-xs text-cloud-500">
                      with {staffName(booking.staffId)} · {booking.status}
                    </span>
                  </span>
                </Link>
              )}
              {relatedFollowUps.map((f) => (
                <Link
                  key={f.id}
                  to="/demo/follow-ups"
                  className="flex items-center gap-3 rounded-xl border border-line bg-ink-950/50 px-3.5 py-3 transition-colors hover:border-volt-400/40"
                >
                  <ListChecks className="h-4 w-4 shrink-0 text-volt-300" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-cloud-50">{f.type}</span>
                    <span className="block text-xs text-cloud-500">
                      {f.status === "Pending" ? `Due ${formatRelative(f.dueAt)}` : f.status} · {staffName(f.ownerId)}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cloud-500">Timeline</p>
            <ol className="mt-3 space-y-3 border-l border-line pl-4">
              {[...enquiry.activity].reverse().map((item, i) => (
                <li key={`${item.at}-${i}`} className="relative">
                  <span className="absolute top-1.5 -left-[21px] h-2.5 w-2.5 rounded-full border-2 border-ink-900 bg-volt-400" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-cloud-200">{item.text}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-cloud-500">
                    {item.by && (
                      <>
                        <UserRound className="h-3 w-3" aria-hidden="true" />
                        <span>{staffName(item.by)} ·</span>
                      </>
                    )}
                    {formatDateTime(item.at)}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <form onSubmit={submitNote} className="space-y-2">
            <label htmlFor="enq-note" className="text-xs font-semibold uppercase tracking-[0.18em] text-cloud-500">
              Add a note
            </label>
            <Textarea
              id="enq-note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Called — no answer, will try again after 17:00."
            />
            <Button type="submit" size="sm" variant="secondary" disabled={!note.trim()}>
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              Add note
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
