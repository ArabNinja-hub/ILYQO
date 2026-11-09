import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useActiveSection, useMenuOpen } from "../hooks";
import { ButtonTo } from "./Button";
import { Logo } from "./Logo";

export const siteLinks = [
  { href: "#platform", label: "Platform" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#demo", label: "Demo" },
  { href: "#who-its-for", label: "Who it's for" },
  { href: "#roadmap", label: "Roadmap" },
];

const contactLink = { href: "#contact", label: "Talk to us" };
const sectionIds = [...siteLinks, contactLink].map((link) => link.href.slice(1));

const linkBase =
  "rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt-400/60";
const linkIdle = "text-cloud-300 hover:bg-white/[0.05] hover:text-cloud-50";
const linkActive = "bg-white/[0.07] text-cloud-50";

/**
 * Site navigation.
 *
 * The bar is transparent over the top of the hero and becomes a dark glass
 * surface (translucent ink + backdrop blur + hairline border) once the page
 * scrolls or the mobile menu opens. The logo is rendered as a separate fixed
 * element rather than inside the bar: the official asset is a JPEG on black
 * and is shown with `mix-blend-mode: screen`, which only works against the
 * real page backdrop — inside the (isolated) glass header the black canvas
 * would turn opaque. A hidden spacer keeps its slot in the layout.
 */
export function Navbar() {
  const { open, setOpen } = useMenuOpen();
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const glass = scrolled || open;
  const isActive = (href: string) => active !== null && href === `#${active}`;

  return (
    <>
      {/* Logo: fixed + blended against the page itself (see note above). */}
      <Logo
        size="md"
        className="sm:h-14"
        priority
        linkClassName="site-logo fixed top-0 z-[55] flex h-16 items-center mix-blend-screen sm:h-20"
      />

      {/* Dims the page behind the open mobile menu; tapping it closes the menu.
          Kept outside the header: backdrop-filter makes the header the containing
          block for fixed descendants, which would collapse the overlay to its box. */}
      {open && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="animate-fade fixed inset-0 z-40 cursor-default bg-ink-950/60 lg:hidden"
        />
      )}

      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
          glass
            ? "border-white/[0.06] bg-ink-950/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_16px_40px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8"
        >
          {/* Invisible spacer holding the fixed logo's slot in the flex layout. */}
          <Logo size="md" className="invisible sm:h-14" to={null} />

          <ul className="hidden items-center gap-1 lg:flex">
            {siteLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive(link.href) ? "location" : undefined}
                  className={`${linkBase} px-3.5 py-2 text-sm ${
                    isActive(link.href) ? linkActive : linkIdle
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <a
              href={contactLink.href}
              aria-current={isActive(contactLink.href) ? "location" : undefined}
              className={`${linkBase} px-4 py-2 text-sm ${
                isActive(contactLink.href) ? linkActive : linkIdle
              }`}
            >
              {contactLink.label}
            </a>
            <ButtonTo to="/demo">
              Open the demo
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </ButtonTo>
          </div>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.08] bg-white/[0.04] text-cloud-100 transition-colors duration-200 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt-400/60 lg:hidden"
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
          className="relative border-t border-white/[0.06] lg:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
            {[...siteLinks, contactLink].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "location" : undefined}
                  className={`block rounded-xl px-4 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt-400/60 ${
                    isActive(link.href) ? linkActive : linkIdle
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-3 border-t border-white/[0.06] pt-4">
              <ButtonTo to="/demo" size="lg" className="w-full">
                Open the demo
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </ButtonTo>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}
