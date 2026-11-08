import { Mail } from "lucide-react";
import { Logo } from "./Navbar";

const navLinks = [
  { href: "#problem", label: "Why ILYQO" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#use-cases", label: "Use cases" },
  { href: "#early-access", label: "Early access" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-950">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs font-display text-base leading-snug text-cloud-300">
              Turn conversations into customers.
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-cloud-500">
              Intelligent customer engagement and lead conversion — currently in early
              development.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-cloud-500">
              Site
            </h2>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-cloud-400 transition-colors hover:text-cloud-50"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-cloud-500">
              Contact
            </h2>
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
                <a
                  href="#early-access"
                  className="text-sm text-cloud-400 transition-colors hover:text-cloud-50"
                >
                  Request early access
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-cloud-500">
            <strong className="font-medium text-cloud-400">Disclaimer:</strong> ILYQO is
            in early development and is not yet generally available. Capabilities
            described on this site describe what is being built, not features currently
            in operation. No customer results, statistics or partnerships are claimed on
            this site.
          </p>
          <div className="mt-6 flex flex-col gap-2 text-xs text-cloud-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} ILYQO. All rights reserved.</p>
            <p>Early access — coming soon.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
