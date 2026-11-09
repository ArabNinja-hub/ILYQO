import type { DemoState } from "../data/types";
import { createSeedState, DEMO_STATE_VERSION } from "../data/seed";

/** localStorage key for the demo. Bump DEMO_STATE_VERSION to invalidate old data. */
export const STORAGE_KEY = "ilyqo.demo.v1";

function isValidState(value: unknown): value is DemoState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<DemoState>;
  return (
    candidate.version === DEMO_STATE_VERSION &&
    typeof candidate.seededAt === "string" &&
    Array.isArray(candidate.enquiries) &&
    Array.isArray(candidate.bookings) &&
    Array.isArray(candidate.followUps)
  );
}

export function loadDemoState(): DemoState {
  if (typeof window === "undefined") return createSeedState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isValidState(parsed)) return parsed;
    }
  } catch {
    // Corrupt or inaccessible storage — fall through to a fresh seed.
  }
  const seeded = createSeedState();
  saveDemoState(seeded);
  return seeded;
}

export function saveDemoState(state: DemoState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be full or blocked (private mode). The demo keeps working in memory.
  }
}

export function clearDemoState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore — nothing to clear.
  }
}
