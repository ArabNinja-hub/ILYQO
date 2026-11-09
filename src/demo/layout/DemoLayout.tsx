import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquareText,
  CalendarDays,
  ListChecks,
  ArrowLeft,
  RotateCcw,
  MoreHorizontal,
  X,
  MapPin,
  Clock,
  Database,
  Scissors,
} from "lucide-react";
import { Logo } from "../../components/Logo";
import { DemoBadge } from "../../components/DemoBadge";
import { Button, ButtonTo } from "../../components/Button";
import { useLockBodyScroll } from "../../hooks";
import { Modal } from "../components/Modal";
import { Toasts } from "../components/Toasts";
import { Avatar } from "../components/ui";
import { business, getStaff } from "../data/catalog";
import { useDemo } from "../store/DemoContext";
import { newEnquiries, overdueFollowUps, dueTodayFollowUps, todaysBookings } from "../store/selectors";

const navItems = [
  { to: "/demo/overview", label: "Overview", icon: LayoutDashboard, title: "Overview" },
  { to: "/demo/enquiries", label: "Enquiries", icon: MessageSquareText, title: "Enquiries" },
  { to: "/demo/appointments", label: "Appointments", icon: CalendarDays, title: "Appointments" },
  { to: "/demo/follow-ups", label: "Follow-ups", icon: ListChecks, title: "Follow-ups" },
];

function useNavCounts(): Record<string, number> {
  const { state } = useDemo();
  return useMemo<Record<string, number>>(
    () => ({
      "/demo/enquiries": newEnquiries(state).length,
      "/demo/appointments": todaysBookings(state).filter((b) => b.status === "Scheduled" || b.status === "Confirmed").length,
      "/demo/follow-ups": overdueFollowUps(state).length + dueTodayFollowUps(state).length,
    }),
    [state],
  );
}

function BusinessCard() {
  const user = getStaff(business.currentUser);
  return (
    <div className="rounded-2xl border border-line bg-ink-900/70 p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-volt-500/20 text-volt-300 ring-1 ring-volt-400/25">
          <Scissors className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-cloud-50">{business.name}</p>
          <p className="truncate text-xs text-cloud-500">{business.tagline}</p>
        </div>
      </div>
      <dl className="mt-3 space-y-1.5 text-xs text-cloud-400">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-cloud-500" aria-hidden="true" />
          <dd>{business.location}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 shrink-0 text-cloud-500" aria-hidden="true" />
          <dd>{business.hours}</dd>
        </div>
      </dl>
      {user && (
        <div className="mt-4 flex items-center gap-2.5 border-t border-line pt-3">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-cloud-100">{user.name}</p>
            <p className="truncate text-[11px] text-cloud-500">{user.role}</p>
          </div>
          <span className="shrink-0 rounded-md border border-line px-1.5 py-0.5 text-[10px] font-medium text-cloud-400">You</span>
        </div>
      )}
    </div>
  );
}

function NavList({ onNavigate, counts }: { onNavigate?: () => void; counts: Record<string, number> }) {
  return (
    <ul className="space-y-1">
      {navItems.map((item) => {
        const count = counts[item.to] ?? 0;
        return (
          <li key={item.to}>
            <NavLink
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-volt-500/15 text-cloud-50 ring-1 ring-inset ring-volt-400/30"
                    : "text-cloud-400 hover:bg-ink-800 hover:text-cloud-50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`h-4.5 w-4.5 ${isActive ? "text-volt-300" : "text-cloud-500 group-hover:text-cloud-300"}`}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{item.label}</span>
                  {count > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums ${
                        isActive ? "bg-volt-400/30 text-volt-50" : "bg-ink-700 text-cloud-300"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

function StaleDataBanner({ onReset }: { onReset: () => void }) {
  const { state } = useDemo();
  const ageDays = (Date.now() - new Date(state.seededAt).getTime()) / 86_400_000;
  if (ageDays < 3) return null;
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100 sm:flex-row sm:items-center sm:justify-between">
      <p>
        This demo data was generated {Math.floor(ageDays)} days ago, so "today" may look quiet. Reset to
        get a fresh week.
      </p>
      <Button size="sm" variant="secondary" onClick={onReset} className="shrink-0">
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        Reset demo data
      </Button>
    </div>
  );
}

export function DemoLayout() {
  const { resetDemo } = useDemo();
  const counts = useNavCounts();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useLockBodyScroll(menuOpen);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const current = navItems.find((item) => location.pathname.startsWith(item.to));
    document.title = `${current?.title ?? "Demo"} · ${business.name} · ILYQO Demo`;
  }, [location.pathname]);

  function handleReset() {
    resetDemo();
    setConfirmReset(false);
    setMenuOpen(false);
  }

  return (
    <div className="min-h-dvh bg-ink-900 text-cloud-50 lg:grid lg:grid-cols-[272px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-ink-950 px-5 py-6 lg:flex">
        <div className="flex items-center justify-between gap-3">
          <Logo size="sm" />
          <DemoBadge compact className="whitespace-nowrap" />
        </div>

        <div className="mt-6">
          <BusinessCard />
        </div>

        <nav aria-label="Demo navigation" className="mt-6">
          <NavList counts={counts} />
        </nav>

        <div className="mt-auto space-y-3 pt-6">
          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-cloud-500">
            <Database className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Fictional data, stored only in this browser. Nothing is sent anywhere.
          </p>
          <Button variant="secondary" size="sm" className="w-full" onClick={() => setConfirmReset(true)}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset demo data
          </Button>
          <ButtonTo to="/" variant="ghost" size="sm" className="w-full">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to website
          </ButtonTo>
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-40 border-b border-line bg-ink-950 lg:hidden">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <DemoBadge compact />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="demo-mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-lg border border-line text-cloud-300"
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <MoreHorizontal className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>

          {menuOpen && (
            <div id="demo-mobile-menu" className="animate-fade border-t border-line bg-ink-950 px-4 py-4 sm:px-6">
              <BusinessCard />
              <nav aria-label="Demo navigation" className="mt-4">
                <NavList counts={counts} onNavigate={() => setMenuOpen(false)} />
              </nav>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Button variant="secondary" size="sm" onClick={() => setConfirmReset(true)}>
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Reset demo data
                </Button>
                <ButtonTo to="/" variant="secondary" size="sm">
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  Back to website
                </ButtonTo>
              </div>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:pt-10 lg:pb-16">
          <div className="mx-auto w-full max-w-6xl">
            <StaleDataBanner onReset={() => setConfirmReset(true)} />
            <div key={location.pathname} className="animate-fade">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Mobile bottom tabs */}
        <nav
          aria-label="Demo sections"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink-950/95 backdrop-blur lg:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <ul className="grid grid-cols-4">
            {navItems.map((item) => {
              const count = counts[item.to] ?? 0;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                        isActive ? "text-volt-200" : "text-cloud-500 hover:text-cloud-200"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`grid h-8 w-12 place-items-center rounded-full transition-colors ${
                            isActive ? "bg-volt-500/20" : ""
                          }`}
                        >
                          <item.icon className="h-4.5 w-4.5" aria-hidden="true" />
                        </span>
                        {item.label}
                        {count > 0 && (
                          <span className="absolute top-1.5 right-1/2 translate-x-4 rounded-full bg-volt-500 px-1.5 text-[9px] font-semibold text-white">
                            {count}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset demo data?"
        description="This replaces everything you've added or changed with a fresh week of fictional Demo Cuts data."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>
              Keep my changes
            </Button>
            <Button variant="danger" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset demo data
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-cloud-400">
          Demo data lives only in this browser's local storage. Resetting regenerates enquiries, bookings and
          follow-ups relative to today's date.
        </p>
      </Modal>

      <Toasts />
    </div>
  );
}
