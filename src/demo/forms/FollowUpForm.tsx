import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Info, Link2 } from "lucide-react";
import { Button } from "../../components/Button";
import { Modal } from "../components/Modal";
import { Field, Input, Select, Textarea } from "../components/fields";
import { staff } from "../data/catalog";
import { FOLLOW_UP_TYPES, type FollowUp, type FollowUpType, type StaffId } from "../data/types";
import { addDaysToKey, combineDateTime, timeOfDate, todayKey } from "../lib/dates";
import { knownCustomers } from "../store/selectors";
import { useDemo } from "../store/DemoContext";

export interface FollowUpPrefill {
  customerName?: string;
  phone?: string;
  type?: FollowUpType;
  reason?: string;
  dateKey?: string;
  time?: string;
  ownerId?: StaffId;
  enquiryId?: string;
  bookingId?: string;
}

interface Values {
  customerName: string;
  phone: string;
  type: FollowUpType;
  reason: string;
  dateKey: string;
  time: string;
  ownerId: StaffId;
}

export function FollowUpForm({
  open,
  onClose,
  prefill,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  prefill?: FollowUpPrefill;
  onCreated?: (followUp: FollowUp) => void;
}) {
  const { state, addFollowUp, currentUser } = useDemo();
  const prefillRef = useRef(prefill);
  prefillRef.current = prefill;

  const [values, setValues] = useState<Values>(() => buildDefaults(prefill, currentUser));
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});

  useEffect(() => {
    if (open) {
      setValues(buildDefaults(prefillRef.current, currentUser));
      setErrors({});
    }
  }, [open, currentUser]);

  const customers = useMemo(() => knownCustomers(state), [state]);

  const update = <K extends keyof Values>(key: K, value: Values[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  function handleNameChange(name: string) {
    const match = customers.find((c) => c.name.toLowerCase() === name.trim().toLowerCase());
    setValues((current) => ({
      ...current,
      customerName: name,
      phone: match && !current.phone ? match.phone : current.phone,
    }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!values.customerName.trim()) nextErrors.customerName = "Enter the customer's name.";
    if (!values.reason.trim()) nextErrors.reason = "Say what needs to happen.";
    if (!values.dateKey) nextErrors.dateKey = "Choose a due date.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const followUp = addFollowUp({
      customerName: values.customerName.trim(),
      phone: values.phone.trim(),
      type: values.type,
      reason: values.reason.trim(),
      dueAt: combineDateTime(values.dateKey, values.time).toISOString(),
      ownerId: values.ownerId,
      enquiryId: prefillRef.current?.enquiryId,
      bookingId: prefillRef.current?.bookingId,
    });
    onCreated?.(followUp);
    onClose();
  }

  const linked = prefill?.enquiryId ? "enquiry" : prefill?.bookingId ? "booking" : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Schedule a follow-up"
      description="A follow-up is a task for your team with an owner and a due time."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="followup-form">
            Save follow-up
          </Button>
        </>
      }
    >
      <form id="followup-form" onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
        {linked && (
          <p className="flex items-start gap-2 rounded-xl border border-volt-400/25 bg-volt-500/10 px-3.5 py-3 text-xs leading-relaxed text-volt-100 sm:col-span-2">
            <Link2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            This follow-up will be linked to the customer's {linked}.
          </p>
        )}

        <Field label="Customer name" htmlFor="fu-name" required error={errors.customerName}>
          <Input
            id="fu-name"
            list="fu-customers"
            value={values.customerName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Start typing a name…"
            autoComplete="off"
          />
          <datalist id="fu-customers">
            {customers.map((customer) => (
              <option key={customer.name} value={customer.name} />
            ))}
          </datalist>
        </Field>

        <Field label="Phone" htmlFor="fu-phone">
          <Input
            id="fu-phone"
            type="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+260 97 000 0000"
            autoComplete="off"
          />
        </Field>

        <Field label="Type" htmlFor="fu-type" required>
          <Select id="fu-type" value={values.type} onChange={(e) => update("type", e.target.value as FollowUpType)}>
            {FOLLOW_UP_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Owner" htmlFor="fu-owner" required>
          <Select id="fu-owner" value={values.ownerId} onChange={(e) => update("ownerId", e.target.value as StaffId)}>
            {staff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} · {member.role}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="What needs to happen?" htmlFor="fu-reason" required error={errors.reason} className="sm:col-span-2">
          <Textarea
            id="fu-reason"
            rows={3}
            value={values.reason}
            onChange={(e) => update("reason", e.target.value)}
            placeholder="e.g. Call to confirm Saturday 10:00 and ask if his brother still wants a slot."
          />
        </Field>

        <Field label="Due date" htmlFor="fu-date" required error={errors.dateKey}>
          <Input id="fu-date" type="date" value={values.dateKey} onChange={(e) => update("dateKey", e.target.value)} />
        </Field>

        <Field label="Due time" htmlFor="fu-time" required>
          <Input id="fu-time" type="time" step={300} value={values.time} onChange={(e) => update("time", e.target.value)} />
        </Field>

        <p className="flex items-start gap-2 text-xs leading-relaxed text-cloud-500 sm:col-span-2">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Your team makes the call or sends the message. ILYQO tracks that it happened — nothing is sent
          automatically.
        </p>
      </form>
    </Modal>
  );
}

function buildDefaults(prefill: FollowUpPrefill | undefined, currentUser: StaffId): Values {
  const inTwoHours = new Date(Date.now() + 2 * 3_600_000);
  return {
    customerName: prefill?.customerName ?? "",
    phone: prefill?.phone ?? "",
    type: prefill?.type ?? "Reply to enquiry",
    reason: prefill?.reason ?? "",
    dateKey: prefill?.dateKey ?? (inTwoHours.getHours() >= 18 ? addDaysToKey(todayKey(), 1) : todayKey()),
    time: prefill?.time ?? (inTwoHours.getHours() >= 18 ? "09:00" : timeOfDate(inTwoHours)),
    ownerId: prefill?.ownerId ?? currentUser,
  };
}
