/** Formats Zambian Kwacha amounts, e.g. 1250 → "K1,250". */
export function formatMoney(amount: number): string {
  return `K${amount.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function pluralise(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function normalisePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

/** Lower-cased, trimmed search haystack from several fields. */
export function searchable(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

let counter = 0;

/** Short unique id with a readable prefix, e.g. "enq_k3f9a1". */
export function createId(prefix: string): string {
  counter += 1;
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${random}${counter.toString(36)}`;
}
