import type { Service, ServiceId, Staff, StaffId } from "./types";

/** The fictional demonstration business. */
export const business = {
  name: "Demo Cuts",
  tagline: "Barbershop",
  location: "Luanshya, Copperbelt",
  address: "Shop 4, Town Centre, Luanshya",
  hours: "Mon–Sat 08:00–18:00 · Sun 09:00–14:00",
  openTime: "08:00",
  closeTime: "18:00",
  /** Staff member the demo is "signed in" as. */
  currentUser: "st_mwila" as StaffId,
};

export const staff: Staff[] = [
  { id: "st_mwila", name: "Mwila Banda", firstName: "Mwila", role: "Owner & barber", takesBookings: true },
  { id: "st_chanda", name: "Chanda Phiri", firstName: "Chanda", role: "Senior barber", takesBookings: true },
  { id: "st_joseph", name: "Joseph Tembo", firstName: "Joseph", role: "Barber", takesBookings: true },
  { id: "st_natasha", name: "Natasha Mulenga", firstName: "Natasha", role: "Front desk", takesBookings: false },
];

export const barbers = staff.filter((s) => s.takesBookings);

export const services: Service[] = [
  { id: "classic-cut", name: "Classic cut", durationMins: 30, price: 50 },
  { id: "skin-fade", name: "Skin fade", durationMins: 45, price: 80 },
  { id: "cut-beard", name: "Cut + beard", durationMins: 50, price: 100 },
  { id: "beard-trim", name: "Beard trim", durationMins: 20, price: 40 },
  { id: "kids-cut", name: "Kids cut", durationMins: 25, price: 40 },
  { id: "line-up", name: "Line-up", durationMins: 15, price: 30 },
  { id: "hot-towel-shave", name: "Hot towel shave", durationMins: 30, price: 60 },
  { id: "hair-colour", name: "Hair colour", durationMins: 60, price: 150 },
];

const staffById = new Map(staff.map((s) => [s.id, s]));
const serviceById = new Map(services.map((s) => [s.id, s]));

export function getStaff(id: StaffId | undefined): Staff | undefined {
  return id ? staffById.get(id) : undefined;
}

export function staffName(id: StaffId | undefined, short = true): string {
  const member = getStaff(id);
  if (!member) return "Unassigned";
  return short ? member.firstName : member.name;
}

export function getService(id: ServiceId | undefined): Service | undefined {
  return id ? serviceById.get(id) : undefined;
}

export function serviceName(id: ServiceId | undefined): string {
  return getService(id)?.name ?? "Not specified";
}
