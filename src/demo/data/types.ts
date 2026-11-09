/**
 * Domain model for the ILYQO operations demo.
 * Dates are stored as ISO strings; `dateKey` values are local YYYY-MM-DD.
 */

export type StaffId = "st_mwila" | "st_chanda" | "st_joseph" | "st_natasha";

export interface Staff {
  id: StaffId;
  name: string;
  firstName: string;
  role: string;
  /** Staff who take appointments (barbers). */
  takesBookings: boolean;
}

export type ServiceId =
  | "classic-cut"
  | "skin-fade"
  | "cut-beard"
  | "beard-trim"
  | "kids-cut"
  | "line-up"
  | "hot-towel-shave"
  | "hair-colour";

export interface Service {
  id: ServiceId;
  name: string;
  durationMins: number;
  /** Price in Zambian Kwacha. */
  price: number;
}

export const ENQUIRY_CHANNELS = [
  "Walk-in",
  "Phone call",
  "WhatsApp",
  "Facebook",
  "Instagram",
  "Referral",
  "Website",
] as const;
export type EnquiryChannel = (typeof ENQUIRY_CHANNELS)[number];

export const ENQUIRY_STATUSES = ["New", "Contacted", "Booked", "Closed", "Lost"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export interface ActivityEntry {
  at: string;
  text: string;
  by?: StaffId;
}

export interface Enquiry {
  id: string;
  customerName: string;
  phone: string;
  channel: EnquiryChannel;
  serviceId?: ServiceId;
  message: string;
  status: EnquiryStatus;
  priority: "Normal" | "High";
  assignedTo?: StaffId;
  bookingId?: string;
  createdAt: string;
  updatedAt: string;
  activity: ActivityEntry[];
}

export const BOOKING_STATUSES = ["Scheduled", "Confirmed", "Completed", "No-show", "Cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  serviceId: ServiceId;
  staffId: StaffId;
  /** Local calendar day, YYYY-MM-DD. */
  dateKey: string;
  /** 24h local time, HH:mm. */
  time: string;
  durationMins: number;
  price: number;
  status: BookingStatus;
  enquiryId?: string;
  notes?: string;
  createdAt: string;
}

export const FOLLOW_UP_TYPES = [
  "Reply to enquiry",
  "Confirm appointment",
  "Reminder call",
  "After-visit check-in",
  "Rebook regular",
  "Win back",
] as const;
export type FollowUpType = (typeof FOLLOW_UP_TYPES)[number];

export const FOLLOW_UP_STATUSES = ["Pending", "Done", "Skipped"] as const;
export type FollowUpStatus = (typeof FOLLOW_UP_STATUSES)[number];

export const FOLLOW_UP_OUTCOMES = [
  "Booked",
  "Confirmed",
  "Spoke — will call back",
  "Left a message",
  "No answer",
  "Not interested",
] as const;
export type FollowUpOutcome = (typeof FOLLOW_UP_OUTCOMES)[number];

export interface FollowUp {
  id: string;
  customerName: string;
  phone: string;
  type: FollowUpType;
  reason: string;
  dueAt: string;
  ownerId: StaffId;
  status: FollowUpStatus;
  enquiryId?: string;
  bookingId?: string;
  outcome?: FollowUpOutcome;
  completedAt?: string;
  /** Number of times the follow-up has been snoozed. */
  snoozed: number;
  createdAt: string;
}

export interface DemoState {
  version: number;
  seededAt: string;
  enquiries: Enquiry[];
  bookings: Booking[];
  followUps: FollowUp[];
}
