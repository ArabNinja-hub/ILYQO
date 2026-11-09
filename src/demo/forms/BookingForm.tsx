import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AlertTriangle, Clock, Link2 } from "lucide-react";
import { Button } from "../../components/Button";
import { Modal } from "../components/Modal";
import { Field, Input, Select, Textarea } from "../components/fields";
import { barbers, business, getService, services, staffName } from "../data/catalog";
import type { Booking, ServiceId, StaffId } from "../data/types";
import { addMinutesToTime, combineDateTime, roundUpToStep, timeSlots, todayKey } from "../lib/dates";
import { formatMoney } from "../lib/format";
import { findClashes } from "../store/selectors";
import { useDemo } from "../store/DemoContext";

export interface BookingPrefill {
  customerName?: string;
  phone?: string;
  serviceId?: ServiceId;
  staffId?: StaffId;
  dateKey?: string;
  time?: string;
  notes?: string;
  enquiryId?: string;
}

interface Values {
  customerName: string;
  phone: string;
  serviceId: ServiceId;
  staffId: StaffId;
  dateKey: string;
  time: string;
  notes: string;
}

const slots = timeSlots(business.openTime, business.closeTime, 15);

function defaultTime() {
  const rounded = roundUpToStep(new Date(), 15);
  return slots.includes(rounded) ? rounded : slots[0];
}

export function BookingForm({
  open,
  onClose,
  prefill,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  prefill?: BookingPrefill;
  onCreated?: (booking: Booking) => void;
}) {
  const { state, addBooking } = useDemo();
  const prefillRef = useRef(prefill);
  prefillRef.current = prefill;

  const [values, setValues] = useState<Values>(() => buildDefaults(prefill));
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});

  useEffect(() => {
    if (open) {
      setValues(buildDefaults(prefillRef.current));
      setErrors({});
    }
  }, [open]);

  const service = getService(values.serviceId)!;
  const endTime = addMinutesToTime(values.time, service.durationMins);

  const clashes = useMemo(
    () =>
      findClashes(state.bookings, {
        staffId: values.staffId,
        dateKey: values.dateKey,
        time: values.time,
        durationMins: service.durationMins,
      }),
    [state.bookings, values.staffId, values.dateKey, values.time, service.durationMins],
  );

  const update = <K extends keyof Values>(key: K, value: Values[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!values.customerName.trim()) nextErrors.customerName = "Enter the customer's name.";
    if (!values.dateKey) nextErrors.dateKey = "Choose a date.";
    if (values.dateKey && combineDateTime(values.dateKey, endTime).getTime() < Date.now()) {
      nextErrors.time = "That time has already passed — choose a later slot.";
    }
    if (clashes.length > 0) {
      nextErrors.time = `${staffName(values.staffId)} already has ${clashes[0].customerName} at ${clashes[0].time}. Pick another time or barber.`;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const booking = addBooking({
      customerName: values.customerName.trim(),
      phone: values.phone.trim(),
      serviceId: values.serviceId,
      staffId: values.staffId,
      dateKey: values.dateKey,
      time: values.time,
      durationMins: service.durationMins,
      price: service.price,
      notes: values.notes.trim() || undefined,
      enquiryId: prefillRef.current?.enquiryId,
    });
    onCreated?.(booking);
    onClose();
  }

  const linkedEnquiry = prefill?.enquiryId ? state.enquiries.find((e) => e.id === prefill.enquiryId) : undefined;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New booking"
      description="Reserve a chair for a customer. Clashes with the barber's other bookings are flagged before you save."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="booking-form">
            Create booking
          </Button>
        </>
      }
    >
      <form id="booking-form" onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
        {linkedEnquiry && (
          <p className="flex items-start gap-2 rounded-xl border border-volt-400/25 bg-volt-500/10 px-3.5 py-3 text-xs leading-relaxed text-volt-100 sm:col-span-2">
            <Link2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              Linked to {linkedEnquiry.customerName}'s enquiry. Saving will mark the enquiry as{" "}
              <strong className="font-semibold">Booked</strong>.
            </span>
          </p>
        )}

        <Field label="Customer name" htmlFor="bk-name" required error={errors.customerName}>
          <Input
            id="bk-name"
            value={values.customerName}
            onChange={(e) => update("customerName", e.target.value)}
            placeholder="e.g. Kelvin Sakala"
            autoComplete="off"
          />
        </Field>

        <Field label="Phone" htmlFor="bk-phone">
          <Input
            id="bk-phone"
            type="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+260 97 000 0000"
            autoComplete="off"
          />
        </Field>

        <Field label="Service" htmlFor="bk-service" required hint={`${service.durationMins} min · ${formatMoney(service.price)}`}>
          <Select id="bk-service" value={values.serviceId} onChange={(e) => update("serviceId", e.target.value as ServiceId)}>
            {services.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · {item.durationMins} min · K{item.price}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Barber" htmlFor="bk-staff" required>
          <Select id="bk-staff" value={values.staffId} onChange={(e) => update("staffId", e.target.value as StaffId)}>
            {barbers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Date" htmlFor="bk-date" required error={errors.dateKey}>
          <Input
            id="bk-date"
            type="date"
            min={todayKey()}
            value={values.dateKey}
            onChange={(e) => update("dateKey", e.target.value)}
          />
        </Field>

        <Field label="Start time" htmlFor="bk-time" required error={errors.time} hint={`Ends ${endTime}`}>
          <Select id="bk-time" value={values.time} onChange={(e) => update("time", e.target.value)}>
            {slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </Select>
        </Field>

        {clashes.length > 0 && !errors.time && (
          <p
            className="flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3.5 py-3 text-xs leading-relaxed text-amber-100 sm:col-span-2"
            role="alert"
          >
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden="true" />
            <span>
              {staffName(values.staffId)} already has <strong className="font-semibold">{clashes[0].customerName}</strong>{" "}
              from {clashes[0].time} to {addMinutesToTime(clashes[0].time, clashes[0].durationMins)}. Choose another
              time or barber.
            </span>
          </p>
        )}

        <Field label="Notes" htmlFor="bk-notes" className="sm:col-span-2">
          <Textarea
            id="bk-notes"
            rows={2}
            value={values.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Anything the barber should know."
          />
        </Field>

        <p className="flex items-center gap-2 text-xs text-cloud-500 sm:col-span-2">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Opening hours: {business.hours}
        </p>
      </form>
    </Modal>
  );
}

function buildDefaults(prefill?: BookingPrefill): Values {
  return {
    customerName: prefill?.customerName ?? "",
    phone: prefill?.phone ?? "",
    serviceId: prefill?.serviceId ?? "classic-cut",
    staffId: prefill?.staffId ?? barbers[0].id,
    dateKey: prefill?.dateKey ?? todayKey(),
    time: prefill?.time ?? defaultTime(),
    notes: prefill?.notes ?? "",
  };
}
