import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { siteLinks } from "./Navbar";

const demoLinks = [
  { to: "/demo/overview", label: "Overview dashboard" },
  { to: "/demo/enquiries", label: "Enquiries" },
  { to: "/demo/appointments", label: "Appointments" },
  { to: "/demo/follow-ups", label: "Follow-ups" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-950">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo size="lg" className="sm:h-16" />
            <p className="mt-5 max-w-xs font-display text-base leading-snug text-cloud-300">
              Intelligence That Moves Business.
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-cloud-500">
              Operations technology helping small businesses manage customer enquiries,
              appointments and follow-ups.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-cloud-500">Website</h2>
            <ul className="mt-4 space-y-2.5">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-cloud-400 transition-colors hover:text-cloud-50"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" className="text-sm text-cloud-400 transition-colors hover:text-cloud-50">
                  Talk to us
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Demo navigation">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-cloud-500">
              Demo Cuts demo
            </h2>
            <ul className="mt-4 space-y-2.5">
              {demoLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-cloud-400 transition-colors hover:text-cloud-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-cloud-500">Contact</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="mailto:hello@ilyqo.com"
                  className="inline-flex items-center gap-2 text-sm text-cloud-400 transition-colors hover:text-cloud-50"
                >
                  <Mail className="h-4 w-4 text-volt-400" aria-hidden="true" />
                  hello@ilyqo.com
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-cloud-400 transition-colors hover:text-cloud-50">
                  Register pilot interest
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-cloud-500">
            <strong className="font-medium text-cloud-400">About the demo:</strong> Demo Cuts is a
            fictional business created to demonstrate ILYQO. All names, phone numbers, prices and
            figures shown in the demo are fictional. ILYQO does not currently send messages or
            connect to WhatsApp, SMS or email on your behalf, and no AI features are included in this
            phase.
          </p>
          <div className="mt-6 flex flex-col gap-2 text-xs text-cloud-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} ILYQO. All rights reserved.</p>
            <p>Intelligence That Moves Business.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
