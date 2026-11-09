import { useEffect, useState, type FormEvent } from "react";
import { Info } from "lucide-react";
import { Button } from "../../components/Button";
import { Modal } from "../components/Modal";
import { CheckboxField, Field, Input, Select, Textarea } from "../components/fields";
import { services, staff } from "../data/catalog";
import { ENQUIRY_CHANNELS, type Enquiry, type EnquiryChannel, type ServiceId, type StaffId } from "../data/types";
import { useDemo } from "../store/DemoContext";

interface Values {
  customerName: string;
  phone: string;
  channel: EnquiryChannel;
  serviceId: ServiceId | "";
  message: string;
  priority: "Normal" | "High";
  assignedTo: StaffId | "";
  createFollowUp: boolean;
}

const defaults: Values = {
  customerName: "",
  phone: "",
  channel: "Phone call",
  serviceId: "",
  message: "",
  priority: "Normal",
  assignedTo: "",
  createFollowUp: true,
};

export function EnquiryForm({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (enquiry: Enquiry) => void;
}) {
  const { addEnquiry, currentUser } = useDemo();
  const [values, setValues] = useState<Values>(defaults);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});

  useEffect(() => {
    if (open) {
      setValues({ ...defaults, assignedTo: currentUser });
      setErrors({});
    }
  }, [open, currentUser]);

  const update = <K extends keyof Values>(key: K, value: Values[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!values.customerName.trim()) nextErrors.customerName = "Enter the customer's name.";
    if (!values.message.trim()) nextErrors.message = "Describe what the customer asked for.";
    if (values.phone && !/^[+\d][\d\s-]{6,}$/.test(values.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number or leave it blank.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const enquiry = addEnquiry({
      customerName: values.customerName.trim(),
      phone: values.phone.trim(),
      channel: values.channel,
      serviceId: values.serviceId || undefined,
      message: values.message.trim(),
      priority: values.priority,
      assignedTo: values.assignedTo || undefined,
      followUpInHours: values.createFollowUp ? 2 : undefined,
    });
    onCreated?.(enquiry);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log a new enquiry"
      description="Record what a customer asked for so it can be answered, booked and followed up."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="enquiry-form">
            Save enquiry
          </Button>
        </>
      }
    >
      <form id="enquiry-form" onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="Customer name" htmlFor="enq-name" required error={errors.customerName}>
          <Input
            id="enq-name"
            value={values.customerName}
            onChange={(e) => update("customerName", e.target.value)}
            placeholder="e.g. Bwalya Mwansa"
            autoComplete="off"
          />
        </Field>

        <Field label="Phone" htmlFor="enq-phone" hint="Optional for walk-ins." error={errors.phone}>
          <Input
            id="enq-phone"
            type="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+260 97 000 0000"
            autoComplete="off"
          />
        </Field>

        <Field label="How did they contact you?" htmlFor="enq-channel" required>
          <Select id="enq-channel" value={values.channel} onChange={(e) => update("channel", e.target.value as EnquiryChannel)}>
            {ENQUIRY_CHANNELS.map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Service they asked about" htmlFor="enq-service">
          <Select id="enq-service" value={values.serviceId} onChange={(e) => update("serviceId", e.target.value as ServiceId | "")}>
            <option value="">Not sure yet</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} · K{service.price}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="What did they ask?" htmlFor="enq-message" required error={errors.message} className="sm:col-span-2">
          <Textarea
            id="enq-message"
            rows={3}
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="e.g. Wants a skin fade on Saturday morning — asked for the price and whether Chanda is free."
          />
        </Field>

        <Field label="Priority" htmlFor="enq-priority">
          <Select id="enq-priority" value={values.priority} onChange={(e) => update("priority", e.target.value as Values["priority"])}>
            <option value="Normal">Normal</option>
            <option value="High">High — needs a quick answer</option>
          </Select>
        </Field>

        <Field label="Assigned to" htmlFor="enq-assignee">
          <Select id="enq-assignee" value={values.assignedTo} onChange={(e) => update("assignedTo", e.target.value as StaffId | "")}>
            <option value="">Unassigned</option>
            {staff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} · {member.role}
              </option>
            ))}
          </Select>
        </Field>

        <div className="sm:col-span-2">
          <CheckboxField
            id="enq-followup"
            label="Add a reminder to reply within 2 hours"
            hint="Creates a follow-up task for the assigned person. ILYQO does not send messages to the customer."
            checked={values.createFollowUp}
            onChange={(checked) => update("createFollowUp", checked)}
          />
        </div>

        <p className="flex items-start gap-2 text-xs leading-relaxed text-cloud-500 sm:col-span-2">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Enquiries are logged by your team after a call, message or walk-in. No messaging channels are
          connected in this demo.
        </p>
      </form>
    </Modal>
  );
}
