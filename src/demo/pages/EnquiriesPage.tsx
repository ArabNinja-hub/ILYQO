import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, Inbox, Flag, ArrowUpDown, ChevronRight } from "lucide-react";
import { Button } from "../../components/Button";
import { Avatar, Chips, EmptyState, PageHeader, StatusPill, Tag } from "../components/ui";
import { SearchInput, ToolbarSelect } from "../components/fields";
import { EnquiryDetail } from "../components/EnquiryDetail";
import { EnquiryForm } from "../forms/EnquiryForm";
import { BookingForm, type BookingPrefill } from "../forms/BookingForm";
import { FollowUpForm, type FollowUpPrefill } from "../forms/FollowUpForm";
import { services, staff, serviceName, staffName } from "../data/catalog";
import { ENQUIRY_CHANNELS, ENQUIRY_STATUSES, type Enquiry, type EnquiryStatus } from "../data/types";
import { formatRelative } from "../lib/dates";
import { searchable } from "../lib/format";
import { enquiryTone } from "../lib/status";
import { useDemo } from "../store/DemoContext";

type StatusFilter = "All" | EnquiryStatus;
type Sort = "newest" | "oldest";

export function EnquiriesPage() {
  const { state } = useDemo();
  const [params, setParams] = useSearchParams();

  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("All");
  const [service, setService] = useState("All");
  const [assignee, setAssignee] = useState("All");
  const [sort, setSort] = useState<Sort>("newest");

  const [adding, setAdding] = useState(params.get("new") === "1");
  const [bookingPrefill, setBookingPrefill] = useState<BookingPrefill | null>(null);
  const [followUpPrefill, setFollowUpPrefill] = useState<FollowUpPrefill | null>(null);

  const statusParam = params.get("status");
  const status: StatusFilter =
    statusParam && (ENQUIRY_STATUSES as readonly string[]).includes(statusParam) ? (statusParam as EnquiryStatus) : "All";
  const openId = params.get("open");
  const openEnquiry = openId ? (state.enquiries.find((e) => e.id === openId) ?? null) : null;

  // Clear the ?new=1 flag once consumed so a refresh doesn't reopen the form.
  useEffect(() => {
    if (params.get("new") === "1") {
      const next = new URLSearchParams(params);
      next.delete("new");
      setParams(next, { replace: true });
    }
  }, [params, setParams]);

  const setStatus = (value: StatusFilter) => {
    const next = new URLSearchParams(params);
    if (value === "All") next.delete("status");
    else next.set("status", value);
    setParams(next, { replace: true });
  };

  const setOpen = (enquiry: Enquiry | null) => {
    const next = new URLSearchParams(params);
    if (enquiry) next.set("open", enquiry.id);
    else next.delete("open");
    setParams(next, { replace: true });
  };

  const counts = useMemo(() => {
    const result: Record<StatusFilter, number> = { All: state.enquiries.length, New: 0, Contacted: 0, Booked: 0, Closed: 0, Lost: 0 };
    state.enquiries.forEach((e) => {
      result[e.status] += 1;
    });
    return result;
  }, [state.enquiries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.enquiries
      .filter((e) => status === "All" || e.status === status)
      .filter((e) => channel === "All" || e.channel === channel)
      .filter((e) => service === "All" || e.serviceId === service)
      .filter((e) => assignee === "All" || (assignee === "none" ? !e.assignedTo : e.assignedTo === assignee))
      .filter((e) => !q || searchable(e.customerName, e.phone, e.message, serviceName(e.serviceId), e.channel).includes(q))
      .sort((a, b) => (sort === "newest" ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt)));
  }, [state.enquiries, status, channel, service, assignee, query, sort]);

  const hasFilters = query || channel !== "All" || service !== "All" || assignee !== "All" || status !== "All";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enquiries"
        description="Every question, price check and booking request — logged by the team, with a status and an owner."
        actions={
          <Button onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add enquiry
          </Button>
        }
      />

      <div className="space-y-3 rounded-2xl border border-line bg-ink-800/40 p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchInput value={query} onChange={setQuery} placeholder="Search name, phone or message…" className="lg:max-w-sm lg:flex-1" />
          <div className="flex flex-wrap gap-2">
            <ToolbarSelect value={channel} onChange={(e) => setChannel(e.target.value)} aria-label="Filter by channel">
              <option value="All">All channels</option>
              {ENQUIRY_CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </ToolbarSelect>
            <ToolbarSelect value={service} onChange={(e) => setService(e.target.value)} aria-label="Filter by service">
              <option value="All">All services</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </ToolbarSelect>
            <ToolbarSelect value={assignee} onChange={(e) => setAssignee(e.target.value)} aria-label="Filter by assignee">
              <option value="All">Anyone</option>
              <option value="none">Unassigned</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName}
                </option>
              ))}
            </ToolbarSelect>
            <button
              type="button"
              onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink-900/40 px-3 py-1.5 text-xs font-medium text-cloud-300 transition-colors hover:border-line-strong"
            >
              <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
              {sort === "newest" ? "Newest first" : "Oldest first"}
            </button>
          </div>
        </div>
        <Chips
          label="Filter by status"
          value={status}
          onChange={setStatus}
          options={(["All", ...ENQUIRY_STATUSES] as StatusFilter[]).map((value) => ({ value, label: value, count: counts[value] }))}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={hasFilters ? "No enquiries match these filters" : "No enquiries yet"}
          body={hasFilters ? "Try clearing the search or choosing a different status." : "Log the first enquiry to get started."}
          action={
            hasFilters ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setChannel("All");
                  setService("All");
                  setAssignee("All");
                  setStatus("All");
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Button size="sm" onClick={() => setAdding(true)}>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Add enquiry
              </Button>
            )
          }
        />
      ) : (
        <>
          <p className="text-xs text-cloud-500">
            Showing {filtered.length} of {state.enquiries.length}
          </p>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-line bg-ink-800/40 lg:block">
            <table className="w-full table-fixed text-left text-sm">
              <thead className="bg-ink-900/60 text-[11px] font-semibold uppercase tracking-[0.16em] text-cloud-500">
                <tr>
                  <th scope="col" className="w-[25%] px-5 py-3">Customer</th>
                  <th scope="col" className="px-3 py-3">Enquiry</th>
                  <th scope="col" className="w-[12%] px-3 py-3">Service</th>
                  <th scope="col" className="w-[10%] px-3 py-3">Received</th>
                  <th scope="col" className="w-[12%] px-3 py-3">Status</th>
                  <th scope="col" className="w-[9%] px-3 py-3">Owner</th>
                  <th scope="col" className="w-10 px-3 py-3"><span className="sr-only">Open</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    onClick={() => setOpen(enquiry)}
                    className="cursor-pointer transition-colors hover:bg-ink-800/80"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={enquiry.customerName} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-cloud-50">{enquiry.customerName}</p>
                          <p className="truncate text-xs text-cloud-500">
                            {enquiry.channel} · {enquiry.phone || "No number"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <p className="line-clamp-2 text-cloud-300">{enquiry.message}</p>
                    </td>
                    <td className="px-3 py-3.5 text-cloud-300">{serviceName(enquiry.serviceId)}</td>
                    <td className="px-3 py-3.5 text-cloud-400">{formatRelative(enquiry.createdAt)}</td>
                    <td className="px-3 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        <StatusPill tone={enquiryTone(enquiry.status)}>{enquiry.status}</StatusPill>
                        {enquiry.priority === "High" && (
                          <span title="High priority" className="grid h-6 w-6 place-items-center rounded-full bg-amber-400/15 text-amber-300">
                            <Flag className="h-3 w-3" aria-hidden="true" />
                            <span className="sr-only">High priority</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-cloud-300">{enquiry.assignedTo ? staffName(enquiry.assignedTo) : <span className="text-cloud-500">—</span>}</td>
                    <td className="px-3 py-3.5 text-cloud-500">
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {filtered.map((enquiry) => (
              <li key={enquiry.id}>
                <button
                  type="button"
                  onClick={() => setOpen(enquiry)}
                  className="flex w-full flex-col gap-3 rounded-2xl border border-line bg-ink-800/50 p-4 text-left transition-colors hover:border-volt-400/35"
                >
                  <div className="flex w-full items-start gap-3">
                    <Avatar name={enquiry.customerName} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-medium text-cloud-50">{enquiry.customerName}</p>
                        <span className="shrink-0 text-[11px] text-cloud-500">{formatRelative(enquiry.createdAt)}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-cloud-500">{enquiry.channel} · {serviceName(enquiry.serviceId)}</p>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-sm text-cloud-300">{enquiry.message}</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <StatusPill tone={enquiryTone(enquiry.status)}>{enquiry.status}</StatusPill>
                    {enquiry.priority === "High" && <StatusPill tone="amber">High priority</StatusPill>}
                    <Tag>{enquiry.assignedTo ? staffName(enquiry.assignedTo) : "Unassigned"}</Tag>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <EnquiryForm open={adding} onClose={() => setAdding(false)} onCreated={(enquiry) => setOpen(enquiry)} />

      <EnquiryDetail
        enquiry={openEnquiry}
        onClose={() => setOpen(null)}
        onCreateBooking={(enquiry) =>
          setBookingPrefill({
            customerName: enquiry.customerName,
            phone: enquiry.phone,
            serviceId: enquiry.serviceId,
            enquiryId: enquiry.id,
            notes: enquiry.message.length > 90 ? `${enquiry.message.slice(0, 87)}…` : enquiry.message,
          })
        }
        onScheduleFollowUp={(enquiry) =>
          setFollowUpPrefill({
            customerName: enquiry.customerName,
            phone: enquiry.phone,
            type: "Reply to enquiry",
            reason: `Follow up ${enquiry.customerName} about ${serviceName(enquiry.serviceId).toLowerCase()}.`,
            ownerId: enquiry.assignedTo,
            enquiryId: enquiry.id,
          })
        }
      />

      <BookingForm open={bookingPrefill !== null} onClose={() => setBookingPrefill(null)} prefill={bookingPrefill ?? undefined} />
      <FollowUpForm open={followUpPrefill !== null} onClose={() => setFollowUpPrefill(null)} prefill={followUpPrefill ?? undefined} />
    </div>
  );
}
