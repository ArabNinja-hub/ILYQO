import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useMenuOpen } from "../hooks";
import { ButtonTo } from "./Button";
import { Logo } from "./Logo";

export const siteLinks = [
  { href: "#problem", label: "The problem" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#platform", label: "Platform" },
  { href: "#demo", label: "Demo Cuts" },
  { href: "#who-its-for", label: "Who it's for" },
];

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
      className={`fixed inset-x-0 top-0 z-50 bg-ink-950 transition-[border-color,box-shadow] duration-300 ${
        scrolled || open
          ? "border-b border-line shadow-[0_12px_40px_-24px_rgba(0,0,0,0.9)]"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8"
      >
        <Logo size="md" className="sm:h-14" priority />

        <ul className="hidden items-center gap-7 lg:flex">
          {siteLinks.map((link) => (
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

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href="#contact"
            className="rounded-full px-4 py-2 text-sm text-cloud-300 transition-colors hover:text-cloud-50"
          >
            Talk to us
          </a>
          <ButtonTo to="/demo">
            Open the demo
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </ButtonTo>
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

      {/* Dims the page behind the open mobile menu; tapping it closes the menu. */}
      {open && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="animate-fade fixed inset-x-0 bottom-0 top-16 -z-10 cursor-default bg-ink-950/70 backdrop-blur-sm sm:top-20 lg:hidden"
        />
      )}

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="relative border-t border-line bg-ink-950 lg:hidden"
      >
        <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
          {siteLinks.map((link) => (
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
          <li>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-base text-cloud-300 transition-colors hover:bg-ink-800 hover:text-cloud-50"
            >
              Talk to us
            </a>
          </li>
          <li className="mt-2">
            <ButtonTo to="/demo" size="lg" className="w-full">
              Open the demo
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </ButtonTo>
          </li>
        </ul>
      </div>
    </header>
  );
}
