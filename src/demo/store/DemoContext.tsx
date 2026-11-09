import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  Booking,
  BookingStatus,
  DemoState,
  Enquiry,
  EnquiryStatus,
  FollowUp,
  FollowUpOutcome,
  StaffId,
} from "../data/types";
import { business, serviceName, staffName } from "../data/catalog";
import { createSeedState } from "../data/seed";
import { createId } from "../lib/format";
import { formatDayLabel, toDateKey } from "../lib/dates";
import { demoReducer } from "./reducer";
import { loadDemoState, saveDemoState, STORAGE_KEY } from "./storage";

/* ------------------------------------------------------------------ */
/* Toasts                                                              */
/* ------------------------------------------------------------------ */

export type ToastTone = "success" | "info" | "warning";

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

/* ------------------------------------------------------------------ */
/* Action inputs                                                       */
/* ------------------------------------------------------------------ */

export type NewEnquiryInput = Pick<
  Enquiry,
  "customerName" | "phone" | "channel" | "serviceId" | "message" | "priority" | "assignedTo"
> & {
  /** Also create a "Reply to enquiry" follow-up task due in `followUpInHours`. */
  followUpInHours?: number;
};

export type NewBookingInput = Pick<
  Booking,
  "customerName" | "phone" | "serviceId" | "staffId" | "dateKey" | "time" | "durationMins" | "price" | "notes"
> & {
  enquiryId?: string;
  status?: BookingStatus;
};

export type NewFollowUpInput = Pick<
  FollowUp,
  "customerName" | "phone" | "type" | "reason" | "dueAt" | "ownerId" | "enquiryId" | "bookingId"
>;

interface DemoActions {
  addEnquiry: (input: NewEnquiryInput) => Enquiry;
  setEnquiryStatus: (id: string, status: EnquiryStatus, note?: string) => void;
  addEnquiryNote: (id: string, note: string) => void;
  assignEnquiry: (id: string, staffId: StaffId | undefined) => void;
  addBooking: (input: NewBookingInput) => Booking;
  setBookingStatus: (id: string, status: BookingStatus) => void;
  addFollowUp: (input: NewFollowUpInput) => FollowUp;
  completeFollowUp: (id: string, outcome: FollowUpOutcome) => void;
  snoozeFollowUp: (id: string, days: number) => void;
  skipFollowUp: (id: string) => void;
  reopenFollowUp: (id: string) => void;
  resetDemo: () => void;
  toast: (message: string, tone?: ToastTone) => void;
  dismissToast: (id: number) => void;
}

interface DemoContextValue extends DemoActions {
  state: DemoState;
  toasts: Toast[];
  currentUser: StaffId;
}

const DemoContext = createContext<DemoContextValue | null>(null);

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, loadDemoState);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const currentUser = business.currentUser;

  // Lets action helpers read the latest state without re-creating themselves.
  const stateRef = useRef(state);
  stateRef.current = state;

  // Persist every change to localStorage.
  useEffect(() => {
    saveDemoState(state);
  }, [state]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        dispatch({ type: "state/replace", state: JSON.parse(event.newValue) as DemoState });
      } catch {
        // Ignore malformed cross-tab payloads.
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, tone: ToastTone = "success") => {
      toastId.current += 1;
      const id = toastId.current;
      setToasts((current) => [...current.slice(-2), { id, message, tone }]);
      window.setTimeout(() => dismissToast(id), 4200);
    },
    [dismissToast],
  );

  const actions = useMemo<DemoActions>(() => {
    const nowIso = () => new Date().toISOString();
    const entry = (text: string, by: StaffId = currentUser) => ({ at: nowIso(), text, by });

    const addFollowUp: DemoActions["addFollowUp"] = (input) => {
      const followUp: FollowUp = {
        id: createId("fu"),
        ...input,
        status: "Pending",
        snoozed: 0,
        createdAt: nowIso(),
      };
      dispatch({ type: "followUp/add", followUp });
      return followUp;
    };

    return {
      addEnquiry: (input) => {
        const { followUpInHours, ...fields } = input;
        const createdAt = nowIso();
        const enquiry: Enquiry = {
          id: createId("enq"),
          ...fields,
          status: "New",
          createdAt,
          updatedAt: createdAt,
          activity: [entry(`Enquiry logged (${fields.channel}).`)],
        };
        dispatch({ type: "enquiry/add", enquiry });

        if (followUpInHours) {
          addFollowUp({
            customerName: enquiry.customerName,
            phone: enquiry.phone,
            type: "Reply to enquiry",
            reason: `Reply to ${enquiry.customerName}'s enquiry${
              enquiry.serviceId ? ` about ${serviceName(enquiry.serviceId).toLowerCase()}` : ""
            }.`,
            dueAt: new Date(Date.now() + followUpInHours * 3_600_000).toISOString(),
            ownerId: enquiry.assignedTo ?? currentUser,
            enquiryId: enquiry.id,
          });
        }
        toast(`Enquiry from ${enquiry.customerName} logged.`);
        return enquiry;
      },

      setEnquiryStatus: (id, status, note) => {
        dispatch({
          type: "enquiry/update",
          id,
          patch: { status },
          activity: entry(note ? `${status}: ${note}` : `Status changed to ${status}.`),
        });
        toast(`Enquiry marked ${status.toLowerCase()}.`, status === "Lost" ? "warning" : "success");
      },

      addEnquiryNote: (id, note) => {
        dispatch({ type: "enquiry/update", id, patch: {}, activity: entry(note) });
        toast("Note added.", "info");
      },

      assignEnquiry: (id, staffId) => {
        dispatch({
          type: "enquiry/update",
          id,
          patch: { assignedTo: staffId },
          activity: entry(staffId ? `Assigned to ${staffName(staffId, false)}.` : "Unassigned."),
        });
      },

      addBooking: (input) => {
        const { status, ...fields } = input;
        const booking: Booking = {
          id: createId("bk"),
          ...fields,
          status: status ?? "Scheduled",
          createdAt: nowIso(),
        };
        dispatch({
          type: "booking/add",
          booking,
          activity: entry(
            `Booked: ${formatDayLabel(booking.dateKey)} ${booking.time} with ${staffName(booking.staffId)} — ${serviceName(
              booking.serviceId,
            )}.`,
          ),
        });
        toast(`Booking created for ${booking.customerName} — ${formatDayLabel(booking.dateKey)} ${booking.time}.`);
        return booking;
      },

      setBookingStatus: (id, status) => {
        dispatch({ type: "booking/update", id, patch: { status } });
        const tone: ToastTone = status === "No-show" || status === "Cancelled" ? "warning" : "success";
        toast(`Appointment marked ${status.toLowerCase()}.`, tone);
      },

      addFollowUp: (input) => {
        const followUp = addFollowUp(input);
        toast(`Follow-up scheduled for ${followUp.customerName}.`);
        return followUp;
      },

      completeFollowUp: (id, outcome) => {
        dispatch({ type: "followUp/update", id, patch: { status: "Done", outcome, completedAt: nowIso() } });
        toast(`Follow-up done — ${outcome.toLowerCase()}.`);
      },

      snoozeFollowUp: (id, days) => {
        const current = stateRef.current.followUps.find((f) => f.id === id);
        const base = current && new Date(current.dueAt).getTime() > Date.now() ? new Date(current.dueAt) : new Date();
        const next = new Date(base);
        next.setDate(next.getDate() + days);
        dispatch({
          type: "followUp/update",
          id,
          patch: { dueAt: next.toISOString(), snoozed: (current?.snoozed ?? 0) + 1 },
        });
        toast(`Snoozed until ${formatDayLabel(toDateKey(next))}.`, "info");
      },

      skipFollowUp: (id) => {
        dispatch({ type: "followUp/update", id, patch: { status: "Skipped", completedAt: nowIso() } });
        toast("Follow-up skipped.", "info");
      },

      reopenFollowUp: (id) => {
        dispatch({
          type: "followUp/update",
          id,
          patch: { status: "Pending", outcome: undefined, completedAt: undefined },
        });
        toast("Follow-up reopened.", "info");
      },

      resetDemo: () => {
        dispatch({ type: "state/replace", state: createSeedState() });
        toast("Demo data reset to a fresh week.", "info");
      },

      toast,
      dismissToast,
    };
  }, [currentUser, dismissToast, toast]);

  const value = useMemo<DemoContextValue>(
    () => ({ state, toasts, currentUser, ...actions }),
    [state, toasts, currentUser, actions],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used inside <DemoProvider>");
  return context;
}
