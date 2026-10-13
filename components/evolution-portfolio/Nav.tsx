import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#creative", label: "Creative" },
  { href: "#evolution", label: "Evolution" },
  { href: "#tech", label: "Tech" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (window.scrollY > 120) setMenuOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      aria-label="Portfolio navigation"
      className={`fixed left-1/2 top-3 z-50 w-[calc(100vw_-_1.5rem)] max-w-[640px] -translate-x-1/2 transition-all duration-500 md:top-4 md:w-max ${scrolled ? "scale-[0.99]" : ""}`}
    >
      <div className={`glass flex w-full items-center justify-between gap-1 px-2 py-2 md:w-max md:justify-start ${menuOpen ? "rounded-2xl md:rounded-full" : "rounded-full"}`}>
        <a
          href="#top"
          onClick={closeMenu}
          aria-label="Sai Dheeraj Nalkari — back to top"
          className="min-h-11 min-w-14 rounded-full px-4 py-2 font-mono text-sm font-bold tracking-tight text-gradient-cyber inline-flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          SDN.
        </a>
        <div className="mx-1 hidden h-5 w-px bg-border md:block" />
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-10 items-center rounded-full px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-white/5 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)] sm:text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-foreground transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] md:hidden"
          aria-label={menuOpen ? "Close portfolio navigation" : "Open portfolio navigation"}
          aria-expanded={menuOpen}
          aria-controls="portfolio-mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="portfolio-mobile-navigation"
        className={`glass mt-2 rounded-2xl p-2 shadow-xl md:hidden ${menuOpen ? "block" : "hidden"}`}
      >
        <div className="grid gap-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="flex min-h-11 items-center rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-white/10 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
