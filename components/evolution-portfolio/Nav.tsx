import { useEffect, useState } from "react";

const links = [
  { href: "#creative", label: "Creative" },
  { href: "#evolution", label: "Evolution" },
  { href: "#tech", label: "Tech" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-all duration-500 ${
        scrolled ? "scale-95" : ""
      }`}
    >
      <div className="glass flex items-center gap-1 rounded-full px-2 py-2">
        <a
          href="#top"
          className="rounded-full px-4 py-1.5 font-mono text-sm font-bold tracking-tight text-gradient-cyber"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          SDN.
        </a>
        <div className="mx-1 h-5 w-px bg-border" />
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-white/5 hover:text-foreground sm:text-sm"
          >
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  );
}