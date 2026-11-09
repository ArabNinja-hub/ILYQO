import type {
  Booking,
  BookingStatus,
  DemoState,
  Enquiry,
  EnquiryChannel,
  EnquiryStatus,
  FollowUp,
  FollowUpOutcome,
  FollowUpStatus,
  FollowUpType,
  ServiceId,
  StaffId,
} from "./types";
import { getService } from "./catalog";
import { addDays, addMinutesToTime, combineDateTime, toDateKey } from "../lib/dates";

export const DEMO_STATE_VERSION = 1;

/**
 * All demo data is fictional. Customers, phone numbers and conversations were
 * invented for Demo Cuts, a made-up barbershop in Luanshya, Zambia.
 */
const customers = {
  bwalya: { name: "Bwalya Mwansa", phone: "+260 97 721 4880" },
  mercy: { name: "Mercy Zulu", phone: "+260 96 631 8452" },
  kelvin: { name: "Kelvin Sakala", phone: "+260 95 590 7113" },
  thandiwe: { name: "Thandiwe Daka", phone: "+260 97 643 3290" },
  emmanuel: { name: "Emmanuel Chisenga", phone: "+260 96 311 2774" },
  gift: { name: "Gift Lungu", phone: "+260 97 965 0338" },
  precious: { name: "Precious Mumba", phone: "+260 96 758 4021" },
  brian: { name: "Brian Kaunda", phone: "+260 95 422 1967" },
  chilufya: { name: "Chilufya Musonda", phone: "+260 97 880 6415" },
  memory: { name: "Memory Ngoma", phone: "+260 96 173 9500" },
  given: { name: "Given Kabwe", phone: "+260 97 334 5612" },
  namakau: { name: "Namakau Lubinda", phone: "+260 96 912 8377" },
  mutale: { name: "Mutale Chanda", phone: "+260 95 746 2808" },
  blessings: { name: "Blessings Sichone", phone: "+260 97 591 3246" },
  lombe: { name: "Lombe Mwamba", phone: "+260 96 487 0159" },
  peter: { name: "Peter Simukonda", phone: "+260 97 250 6934" },
  agness: { name: "Agness Nkonde", phone: "+260 96 823 7481" },
  davies: { name: "Davies Mwale", phone: "+260 95 669 0725" },
  nchimunya: { name: "Nchimunya Hamoonga", phone: "+260 97 708 1563" },
  taonga: { name: "Taonga Banda", phone: "+260 96 541 9072" },
  isaac: { name: "Isaac Chama", phone: "+260 97 135 8946" },
  ruth: { name: "Ruth Kapaso", phone: "+260 96 270 4318" },
  moses: { name: "Moses Tembo", phone: "+260 95 384 6207" },
  esther: { name: "Esther Mulenga", phone: "+260 97 459 2681" },
  humphrey: { name: "Humphrey Siame", phone: "+260 96 602 1178" },
  mapalo: { name: "Mapalo Chibwe", phone: "+260 97 814 7730" },
  chisomo: { name: "Chisomo Banda", phone: "+260 96 329 6604" },
  webster: { name: "Webster Mwila", phone: "+260 97 096 2215" },
  tapiwa: { name: "Tapiwa Chirwa", phone: "+260 95 218 3390" },
  kondwani: { name: "Kondwani Phiri", phone: "+260 96 447 8126" },
  lazarous: { name: "Lazarous Mwape", phone: "+260 97 362 9048" },
  oswald: { name: "Oswald Zimba", phone: "" },
  sydney: { name: "Sydney Lungu", phone: "+260 96 775 2203" },
  jackson: { name: "Jackson Mwewa", phone: "+260 97 528 1174" },
  timothy: { name: "Timothy Nyirenda", phone: "+260 95 903 6672" },
  felix: { name: "Felix Mwenya", phone: "+260 96 184 5539" },
  boyd: { name: "Boyd Kalaba", phone: "+260 97 476 0921" },
  elijah: { name: "Elijah Siwale", phone: "+260 96 059 7318" },
  kabwe: { name: "Kabwe Chilufya", phone: "+260 95 731 4486" },
  mulenga: { name: "Mulenga Kasonde", phone: "+260 97 613 8807" },
  mwaka: { name: "Mwaka Siwale", phone: "+260 96 294 1065" },
  daniel: { name: "Daniel Mwanza", phone: "+260 97 857 3302" },
  andrew: { name: "Andrew Phiri", phone: "+260 95 140 2278" },
  george: { name: "George Mutale", phone: "+260 96 966 4410" },
  kennedy: { name: "Kennedy Chola", phone: "+260 97 302 5587" },
  chipo: { name: "Chipo Mwanza", phone: "+260 96 518 7749" },
  patrick: { name: "Patrick Zulu", phone: "+260 97 681 0934" },
  stephen: { name: "Stephen Kunda", phone: "+260 95 275 6611" },
  martin: { name: "Martin Daka", phone: "+260 96 830 2957" },
  joshua: { name: "Joshua Mwila", phone: "+260 97 192 7465" },
  lewis: { name: "Lewis Mwansa", phone: "+260 96 704 1830" },
} as const;

type CustomerKey = keyof typeof customers;

interface BookingSpec {
  key: string;
  day: number;
  time: string;
  staff: StaffId;
  customer: CustomerKey;
  service: ServiceId;
  /** Omit for today's bookings — derived from the current time. */
  status?: BookingStatus;
  /** For today's bookings that have already passed: force a no-show. */
  noShowIfPassed?: boolean;
  notes?: string;
  enquiry?: string;
}

const bookingSpecs: BookingSpec[] = [
  // Six days ago
  { key: "b01", day: -6, time: "09:00", staff: "st_chanda", customer: "daniel", service: "skin-fade", status: "Completed" },
  { key: "b02", day: -6, time: "10:00", staff: "st_mwila", customer: "peter", service: "cut-beard", status: "Completed" },
  { key: "b03", day: -6, time: "11:30", staff: "st_joseph", customer: "mwaka", service: "kids-cut", status: "Completed" },
  { key: "b04", day: -6, time: "14:00", staff: "st_chanda", customer: "sydney", service: "classic-cut", status: "Completed" },
  { key: "b05", day: -6, time: "16:00", staff: "st_mwila", customer: "davies", service: "beard-trim", status: "No-show" },
  // Five days ago
  { key: "b06", day: -5, time: "08:30", staff: "st_joseph", customer: "moses", service: "classic-cut", status: "Completed" },
  { key: "b07", day: -5, time: "10:30", staff: "st_mwila", customer: "gift", service: "hair-colour", status: "Completed", notes: "Grey coverage — medium brown. Cut included.", enquiry: "e_gift" },
  { key: "b08", day: -5, time: "13:00", staff: "st_chanda", customer: "emmanuel", service: "skin-fade", status: "Completed" },
  { key: "b09", day: -5, time: "15:30", staff: "st_joseph", customer: "ruth", service: "kids-cut", status: "Completed", notes: "Son, age 7." },
  // Four days ago
  { key: "b10", day: -4, time: "09:00", staff: "st_mwila", customer: "jackson", service: "cut-beard", status: "Completed" },
  { key: "b11", day: -4, time: "11:00", staff: "st_chanda", customer: "lombe", service: "line-up", status: "Completed" },
  { key: "b12", day: -4, time: "12:30", staff: "st_joseph", customer: "timothy", service: "classic-cut", status: "Cancelled", notes: "Called to cancel — travelling to Ndola." },
  { key: "b13", day: -4, time: "16:30", staff: "st_chanda", customer: "chilufya", service: "skin-fade", status: "Completed" },
  // Three days ago
  { key: "b14", day: -3, time: "09:30", staff: "st_chanda", customer: "nchimunya", service: "hot-towel-shave", status: "Completed" },
  { key: "b15", day: -3, time: "10:30", staff: "st_mwila", customer: "felix", service: "classic-cut", status: "Completed" },
  { key: "b16", day: -3, time: "14:00", staff: "st_joseph", customer: "esther", service: "kids-cut", status: "Completed", notes: "Twins — booked back-to-back." },
  { key: "b17", day: -3, time: "17:00", staff: "st_mwila", customer: "isaac", service: "line-up", status: "No-show" },
  // Two days ago
  { key: "b18", day: -2, time: "08:30", staff: "st_joseph", customer: "agness", service: "kids-cut", status: "Completed" },
  { key: "b19", day: -2, time: "10:00", staff: "st_chanda", customer: "given", service: "skin-fade", status: "Completed" },
  { key: "b20", day: -2, time: "11:00", staff: "st_mwila", customer: "blessings", service: "cut-beard", status: "Completed" },
  { key: "b21", day: -2, time: "15:00", staff: "st_chanda", customer: "davies", service: "beard-trim", status: "Completed", notes: "Rebooked after last week's no-show." },
  // Yesterday
  { key: "b22", day: -1, time: "09:00", staff: "st_mwila", customer: "boyd", service: "classic-cut", status: "Completed" },
  { key: "b23", day: -1, time: "10:30", staff: "st_joseph", customer: "elijah", service: "skin-fade", status: "Completed" },
  { key: "b24", day: -1, time: "13:30", staff: "st_chanda", customer: "kabwe", service: "classic-cut", status: "Completed" },
  { key: "b25", day: -1, time: "16:00", staff: "st_mwila", customer: "mapalo", service: "kids-cut", status: "Completed" },
  { key: "b26", day: -1, time: "17:30", staff: "st_chanda", customer: "mulenga", service: "beard-trim", status: "Completed" },
  // Today
  { key: "b27", day: 0, time: "08:30", staff: "st_joseph", customer: "lombe", service: "line-up", noShowIfPassed: true },
  { key: "b28", day: 0, time: "09:00", staff: "st_chanda", customer: "bwalya", service: "skin-fade" },
  { key: "b29", day: 0, time: "10:30", staff: "st_mwila", customer: "kelvin", service: "cut-beard", notes: "Job interview tomorrow — wants it sharp.", enquiry: "e_kelvin" },
  { key: "b30", day: 0, time: "11:15", staff: "st_joseph", customer: "taonga", service: "kids-cut" },
  { key: "b31", day: 0, time: "13:00", staff: "st_chanda", customer: "sydney", service: "line-up" },
  { key: "b32", day: 0, time: "15:30", staff: "st_mwila", customer: "andrew", service: "skin-fade" },
  { key: "b33", day: 0, time: "17:00", staff: "st_joseph", customer: "moses", service: "beard-trim" },
  // Tomorrow
  { key: "b34", day: 1, time: "09:00", staff: "st_mwila", customer: "timothy", service: "classic-cut", status: "Scheduled", notes: "Rebooked after cancelling last week." },
  { key: "b35", day: 1, time: "10:00", staff: "st_joseph", customer: "precious", service: "kids-cut", status: "Confirmed", notes: "School photos on Wednesday.", enquiry: "e_precious" },
  { key: "b36", day: 1, time: "11:30", staff: "st_chanda", customer: "george", service: "cut-beard", status: "Scheduled" },
  { key: "b37", day: 1, time: "14:00", staff: "st_chanda", customer: "kennedy", service: "skin-fade", status: "Scheduled" },
  { key: "b38", day: 1, time: "16:00", staff: "st_mwila", customer: "chipo", service: "kids-cut", status: "Scheduled", notes: "Booking for her son." },
  // In two days
  { key: "b39", day: 2, time: "10:00", staff: "st_joseph", customer: "thandiwe", service: "kids-cut", status: "Scheduled", notes: "Older boy (9).", enquiry: "e_thandiwe" },
  { key: "b40", day: 2, time: "10:30", staff: "st_joseph", customer: "thandiwe", service: "kids-cut", status: "Scheduled", notes: "Younger boy (6).", enquiry: "e_thandiwe" },
  { key: "b41", day: 2, time: "12:00", staff: "st_mwila", customer: "patrick", service: "hot-towel-shave", status: "Scheduled" },
  { key: "b42", day: 2, time: "15:00", staff: "st_chanda", customer: "stephen", service: "line-up", status: "Scheduled" },
  // In three days
  { key: "b43", day: 3, time: "09:00", staff: "st_mwila", customer: "martin", service: "classic-cut", status: "Scheduled" },
  { key: "b44", day: 3, time: "11:00", staff: "st_joseph", customer: "joshua", service: "skin-fade", status: "Scheduled" },
  { key: "b45", day: 3, time: "16:30", staff: "st_joseph", customer: "namakau", service: "kids-cut", status: "Scheduled", notes: "Son. May move to the following morning — see enquiry." },
  // In four days
  { key: "b46", day: 4, time: "10:00", staff: "st_chanda", customer: "peter", service: "cut-beard", status: "Confirmed", notes: "Fortnightly regular." },
  { key: "b47", day: 4, time: "14:30", staff: "st_mwila", customer: "lewis", service: "classic-cut", status: "Scheduled" },
  // In five days
  { key: "b48", day: 5, time: "09:00", staff: "st_joseph", customer: "davies", service: "line-up", status: "Scheduled" },
  { key: "b49", day: 5, time: "13:00", staff: "st_chanda", customer: "mutale", service: "skin-fade", status: "Scheduled", notes: "Wants Chanda every two weeks.", enquiry: "e_mutale" },
];

interface EnquirySpec {
  key: string;
  customer: CustomerKey;
  channel: EnquiryChannel;
  service?: ServiceId;
  message: string;
  status: EnquiryStatus;
  priority?: "High";
  assignedTo?: StaffId;
  /** When the enquiry arrived: either hours ago, or a day offset + time. */
  at: { hoursAgo: number } | { day: number; time: string };
  /** Extra activity entries after the enquiry was logged. */
  activity?: Array<{ afterMins: number; text: string; by?: StaffId }>;
}

const enquirySpecs: EnquirySpec[] = [
  {
    key: "e_tapiwa",
    customer: "tapiwa",
    channel: "WhatsApp",
    service: "cut-beard",
    message: "Are you open on Sunday afternoon? Looking for a cut and beard for two of us around 13:00.",
    status: "New",
    at: { hoursAgo: 0.4 },
  },
  {
    key: "e_kondwani",
    customer: "kondwani",
    channel: "Instagram",
    service: "skin-fade",
    message: "How long does a skin fade take? I only get a one-hour lunch break — could I come at 13:00 tomorrow?",
    status: "New",
    at: { hoursAgo: 0.9 },
  },
  {
    key: "e_webster",
    customer: "webster",
    channel: "Facebook",
    service: "hot-towel-shave",
    message: "Do you still do hot towel shaves? Last time I came the barber who does them was away.",
    status: "New",
    assignedTo: "st_chanda",
    at: { hoursAgo: 3 },
  },
  {
    key: "e_mercy",
    customer: "mercy",
    channel: "Referral",
    service: "classic-cut",
    message: "Wedding party next Friday — six groomsmen need cuts before 11:00. Can you do a group booking, and what would it cost?",
    status: "New",
    priority: "High",
    assignedTo: "st_natasha",
    at: { hoursAgo: 5 },
  },
  {
    key: "e_namakau",
    customer: "namakau",
    channel: "WhatsApp",
    service: "kids-cut",
    message: "Can I move my son's appointment from Friday afternoon to Saturday morning? Any time before 11:00 works.",
    status: "Contacted",
    assignedTo: "st_natasha",
    at: { hoursAgo: 8 },
    activity: [{ afterMins: 35, text: "Replied: Saturday 09:30 or 10:30 with Joseph available — waiting for her to pick.", by: "st_natasha" }],
  },
  {
    key: "e_brian",
    customer: "brian",
    channel: "Instagram",
    service: "line-up",
    message: "Price for a line-up only? And do you take walk-ins on Saturday or do I need to book?",
    status: "Contacted",
    assignedTo: "st_natasha",
    at: { hoursAgo: 26 },
    activity: [{ afterMins: 50, text: "Sent price list. Suggested booking — Saturdays queue from 10:00.", by: "st_natasha" }],
  },
  {
    key: "e_memory",
    customer: "memory",
    channel: "Facebook",
    message: "Do you do dreadlock retwists? Looking for somewhere in Luanshya.",
    status: "Closed",
    assignedTo: "st_natasha",
    at: { hoursAgo: 30 },
    activity: [{ afterMins: 120, text: "Not a service we offer. Pointed her to a loctician nearby and closed the enquiry.", by: "st_natasha" }],
  },
  {
    key: "e_kelvin",
    customer: "kelvin",
    channel: "WhatsApp",
    service: "cut-beard",
    message: "Need a cut and beard before my interview. Is Mwila available around 10:30 tomorrow?",
    status: "Booked",
    assignedTo: "st_mwila",
    at: { day: -1, time: "18:40" },
    activity: [{ afterMins: 12, text: "Booked: 10:30 with Mwila — Cut + beard.", by: "st_mwila" }],
  },
  {
    key: "e_precious",
    customer: "precious",
    channel: "WhatsApp",
    service: "kids-cut",
    message: "My son needs a cut for school photos on Wednesday. Can we come in the morning the day after tomorrow?",
    status: "Booked",
    assignedTo: "st_natasha",
    at: { day: -1, time: "15:10" },
    activity: [{ afterMins: 25, text: "Booked: 10:00 with Joseph — Kids cut.", by: "st_natasha" }],
  },
  {
    key: "e_thandiwe",
    customer: "thandiwe",
    channel: "Facebook",
    service: "kids-cut",
    message: "Do you do kids' cuts? I have two boys, 6 and 9. What's your weekend availability?",
    status: "Booked",
    assignedTo: "st_natasha",
    at: { day: -2, time: "11:20" },
    activity: [
      { afterMins: 40, text: "Replied with prices and weekend slots.", by: "st_natasha" },
      { afterMins: 180, text: "Booked two back-to-back kids cuts with Joseph, 10:00 and 10:30.", by: "st_natasha" },
    ],
  },
  {
    key: "e_chisomo",
    customer: "chisomo",
    channel: "Phone call",
    service: "classic-cut",
    message: "Asked whether we accept Airtel Money or MTN MoMo, and if 17:00 on Thursday is possible.",
    status: "Contacted",
    assignedTo: "st_mwila",
    at: { hoursAgo: 50 },
    activity: [{ afterMins: 5, text: "Yes to mobile money. Offered Thursday 17:00 with Mwila — he'll confirm.", by: "st_mwila" }],
  },
  {
    key: "e_mutale",
    customer: "mutale",
    channel: "Website",
    service: "skin-fade",
    message: "Looking for a regular barber — can I book the same person every two weeks? Skin fade, usually weekdays after 12:00.",
    status: "Booked",
    assignedTo: "st_chanda",
    at: { day: -3, time: "09:05" },
    activity: [{ afterMins: 220, text: "Called back. First skin fade booked with Chanda; will set up a standing fortnightly slot after that.", by: "st_chanda" }],
  },
  {
    key: "e_humphrey",
    customer: "humphrey",
    channel: "Website",
    service: "classic-cut",
    message: "Looking for a barber for my two sons and myself every third Saturday. Do you offer a family rate?",
    status: "Contacted",
    assignedTo: "st_mwila",
    at: { day: -4, time: "20:15" },
    activity: [{ afterMins: 780, text: "Called — explained prices, no family rate yet. He'll confirm which Saturday suits.", by: "st_mwila" }],
  },
  {
    key: "e_lazarous",
    customer: "lazarous",
    channel: "Phone call",
    service: "classic-cut",
    message: "Asked about a home visit for his elderly father who can't travel easily.",
    status: "Closed",
    assignedTo: "st_mwila",
    at: { day: -5, time: "11:45" },
    activity: [{ afterMins: 3, text: "We don't offer home visits yet. He may bring his father on a quiet weekday morning.", by: "st_mwila" }],
  },
  {
    key: "e_oswald",
    customer: "oswald",
    channel: "Walk-in",
    service: "skin-fade",
    message: "Walked in asking for a skin fade. Told him about a 40-minute wait; said he'd come back.",
    status: "Lost",
    at: { day: -6, time: "12:20" },
    activity: [{ afterMins: 1500, text: "Didn't return and left no number — marked as lost.", by: "st_natasha" }],
  },
  {
    key: "e_gift",
    customer: "gift",
    channel: "Phone call",
    service: "hair-colour",
    message: "Can I get grey coverage colour with a cut? What's the total and how long does it take?",
    status: "Booked",
    assignedTo: "st_mwila",
    at: { day: -7, time: "16:30" },
    activity: [{ afterMins: 10, text: "Quoted K150 incl. cut, about an hour. Booked 10:30 with Mwila.", by: "st_mwila" }],
  },
];

interface FollowUpSpec {
  key: string;
  customer: CustomerKey;
  type: FollowUpType;
  reason: string;
  due: { hoursFromNow: number } | { day: number; time: string };
  owner: StaffId;
  status?: FollowUpStatus;
  outcome?: FollowUpOutcome;
  completed?: { day: number; time: string };
  enquiry?: string;
  booking?: string;
  snoozed?: number;
}

const followUpSpecs: FollowUpSpec[] = [
  { key: "f01", customer: "mercy", type: "Reply to enquiry", reason: "Send group-booking options and a price for six cuts before 11:00 next Friday.", due: { hoursFromNow: -2 }, owner: "st_natasha", enquiry: "e_mercy" },
  { key: "f02", customer: "isaac", type: "Win back", reason: "No-show for Thursday's line-up — call and offer a new slot this week.", due: { day: -1, time: "17:00" }, owner: "st_mwila", booking: "b17", snoozed: 1 },
  { key: "f03", customer: "chisomo", type: "Reply to enquiry", reason: "Confirm whether he wants Thursday 17:00 — slot is being held with Mwila.", due: { day: 0, time: "12:00" }, owner: "st_mwila", enquiry: "e_chisomo" },
  { key: "f04", customer: "brian", type: "Reply to enquiry", reason: "Check if he'd like a Saturday morning slot rather than queuing.", due: { day: 0, time: "16:00" }, owner: "st_natasha", enquiry: "e_brian" },
  { key: "f05", customer: "precious", type: "Reminder call", reason: "Remind: 10:00 tomorrow with Joseph for the school-photo cut.", due: { day: 0, time: "17:00" }, owner: "st_natasha", booking: "b35" },
  { key: "f06", customer: "kelvin", type: "Confirm appointment", reason: "Confirm 10:30 today with Mwila.", due: { day: 0, time: "08:30" }, owner: "st_natasha", status: "Done", outcome: "Confirmed", completed: { day: 0, time: "08:36" }, booking: "b29" },
  { key: "f07", customer: "gift", type: "After-visit check-in", reason: "Ask how the grey coverage held up; offer a six-week touch-up booking.", due: { day: 1, time: "10:00" }, owner: "st_natasha", booking: "b07" },
  { key: "f08", customer: "thandiwe", type: "Confirm appointment", reason: "Confirm the two kids cuts at 10:00 and 10:30 with Joseph.", due: { day: 1, time: "16:00" }, owner: "st_natasha", booking: "b39" },
  { key: "f09", customer: "humphrey", type: "Reply to enquiry", reason: "Call back about the standing Saturday booking for him and his sons.", due: { day: 2, time: "10:00" }, owner: "st_mwila", enquiry: "e_humphrey" },
  { key: "f10", customer: "mutale", type: "Confirm appointment", reason: "Confirm first skin fade with Chanda and agree the fortnightly slot.", due: { day: 4, time: "10:00" }, owner: "st_chanda", booking: "b49" },
  { key: "f11", customer: "peter", type: "Rebook regular", reason: "Fortnightly cut + beard due — offer his usual slot with Chanda.", due: { day: -2, time: "09:00" }, owner: "st_chanda", status: "Done", outcome: "Booked", completed: { day: -2, time: "09:40" }, booking: "b46" },
  { key: "f12", customer: "davies", type: "Win back", reason: "Missed his beard trim — call and offer a new time.", due: { day: -4, time: "10:00" }, owner: "st_mwila", status: "Done", outcome: "Booked", completed: { day: -4, time: "10:20" }, booking: "b05" },
  { key: "f13", customer: "memory", type: "Reply to enquiry", reason: "Reply about dreadlock retwists.", due: { day: -1, time: "09:00" }, owner: "st_natasha", status: "Skipped", enquiry: "e_memory" },
  { key: "f14", customer: "nchimunya", type: "After-visit check-in", reason: "First hot towel shave with us — check he was happy.", due: { day: -2, time: "11:00" }, owner: "st_chanda", status: "Done", outcome: "Left a message", completed: { day: -2, time: "11:15" }, booking: "b14" },
];

function idFor(prefix: string, key: string) {
  return `${prefix}_${key}`;
}

/** Builds the initial demo state relative to `now`. */
export function createSeedState(now = new Date()): DemoState {
  const dayKey = (offset: number) => toDateKey(addDays(now, offset));
  const atDayTime = (day: number, time: string) => combineDateTime(dayKey(day), time);
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 3_600_000);

  const enquiryIds = new Map(enquirySpecs.map((spec) => [spec.key, idFor("enq", spec.key)]));
  const bookingIds = new Map(bookingSpecs.map((spec) => [spec.key, idFor("bk", spec.key)]));

  const bookings: Booking[] = bookingSpecs.map((spec) => {
    const service = getService(spec.service)!;
    const start = atDayTime(spec.day, spec.time);
    const end = combineDateTime(dayKey(spec.day), addMinutesToTime(spec.time, service.durationMins));

    let status: BookingStatus;
    if (spec.status) {
      status = spec.status;
    } else if (end.getTime() <= now.getTime()) {
      status = spec.noShowIfPassed ? "No-show" : "Completed";
    } else if (start.getTime() - now.getTime() < 3 * 3_600_000) {
      status = "Confirmed";
    } else {
      status = "Scheduled";
    }

    const created = new Date(start.getTime() - (2 + ((spec.key.charCodeAt(2) * 7) % 70)) * 3_600_000);
    const customer = customers[spec.customer];

    return {
      id: bookingIds.get(spec.key)!,
      customerName: customer.name,
      phone: customer.phone,
      serviceId: spec.service,
      staffId: spec.staff,
      dateKey: dayKey(spec.day),
      time: spec.time,
      durationMins: service.durationMins,
      price: service.price,
      status,
      enquiryId: spec.enquiry ? enquiryIds.get(spec.enquiry) : undefined,
      notes: spec.notes,
      createdAt: created.toISOString(),
    };
  });

  const bookingByEnquiry = new Map<string, Booking>();
  for (const booking of bookings) {
    if (booking.enquiryId && !bookingByEnquiry.has(booking.enquiryId)) {
      bookingByEnquiry.set(booking.enquiryId, booking);
    }
  }

  const enquiries: Enquiry[] = enquirySpecs.map((spec) => {
    const createdAt = "hoursAgo" in spec.at ? hoursAgo(spec.at.hoursAgo) : atDayTime(spec.at.day, spec.at.time);
    const id = enquiryIds.get(spec.key)!;
    const customer = customers[spec.customer];
    const activity = [
      {
        at: createdAt.toISOString(),
        text: `Enquiry logged (${spec.channel}).`,
        by: spec.assignedTo ?? "st_natasha",
      },
      ...(spec.activity ?? []).map((entry) => ({
        at: new Date(createdAt.getTime() + entry.afterMins * 60_000).toISOString(),
        text: entry.text,
        by: entry.by,
      })),
    ];
    const updatedAt = activity[activity.length - 1].at;

    return {
      id,
      customerName: customer.name,
      phone: customer.phone,
      channel: spec.channel,
      serviceId: spec.service,
      message: spec.message,
      status: spec.status,
      priority: spec.priority ?? "Normal",
      assignedTo: spec.assignedTo,
      bookingId: bookingByEnquiry.get(id)?.id,
      createdAt: createdAt.toISOString(),
      updatedAt,
      activity,
    };
  });

  const followUps: FollowUp[] = followUpSpecs.map((spec) => {
    const dueAt =
      "hoursFromNow" in spec.due
        ? new Date(now.getTime() + spec.due.hoursFromNow * 3_600_000)
        : atDayTime(spec.due.day, spec.due.time);
    const customer = customers[spec.customer];
    const createdAt = new Date(dueAt.getTime() - 20 * 3_600_000);

    return {
      id: idFor("fu", spec.key),
      customerName: customer.name,
      phone: customer.phone,
      type: spec.type,
      reason: spec.reason,
      dueAt: dueAt.toISOString(),
      ownerId: spec.owner,
      status: spec.status ?? "Pending",
      enquiryId: spec.enquiry ? enquiryIds.get(spec.enquiry) : undefined,
      bookingId: spec.booking ? bookingIds.get(spec.booking) : undefined,
      outcome: spec.outcome,
      completedAt: spec.completed ? atDayTime(spec.completed.day, spec.completed.time).toISOString() : undefined,
      snoozed: spec.snoozed ?? 0,
      createdAt: createdAt.toISOString(),
    };
  });

  return {
    version: DEMO_STATE_VERSION,
    seededAt: now.toISOString(),
    enquiries,
    bookings,
    followUps,
  };
}
