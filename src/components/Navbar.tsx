import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useMenuOpen } from "../hooks";
import { ButtonLink } from "./Button";

const links = [
  { href: "#problem", label: "Why ILYQO" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#use-cases", label: "Use cases" },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href="#top"
      className="group inline-flex items-center gap-2.5"
      aria-label="ILYQO — back to top"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl border border-volt-400/40 bg-gradient-to-br from-volt-500/25 to-volt-500/5 transition group-hover:border-volt-400/70">
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden="true">
          <path
            d="M4 6.5A3.5 3.5 0 0 1 7.5 3h9A3.5 3.5 0 0 1 20 6.5v5A3.5 3.5 0 0 1 16.5 15H11l-4.2 3.6V15h-.3A3.5 3.5 0 0 1 4 11.5v-5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="text-volt-300"
          />
          <circle cx="9" cy="9" r="1.1" fill="currentColor" className="text-cloud-50" />
          <circle cx="12.5" cy="9" r="1.1" fill="currentColor" className="text-cloud-50" />
          <circle cx="16" cy="9" r="1.1" fill="currentColor" className="text-cloud-50" />
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-lg font-semibold tracking-[0.14em] text-cloud-50">
          ILYQO
        </span>
      )}
    </a>
  );
}

export function Navbar() {
  const { open, setOpen } = useMenuOpen();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line bg-ink-950/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        <Logo />

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-cloud-300 transition-colors hover:text-cloud-50"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <ButtonLink href="#early-access" className="px-5 py-2.5">
            Request early access
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-line text-cloud-300 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-line bg-ink-950/95 backdrop-blur-xl lg:hidden"
      >
        <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-base text-cloud-300 transition-colors hover:bg-ink-800 hover:text-cloud-50"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-2">
            <ButtonLink
              href="#early-access"
              className="w-full py-3"
            >
              Request early access
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </li>
        </ul>
      </div>
    </header>
  );
}
