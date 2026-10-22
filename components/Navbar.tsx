"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { servicesData } from "@/lib/services-data";

const mainLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Meet the Founder", href: "/meet-the-founder" },
  { name: "Our Process", href: "/process" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
  { name: "Tips", href: "/tips" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Close the drawer after navigation and when the user presses Escape.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const serviceLinks = servicesData.slice(0, 8);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-zinc-200/50 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 group" aria-label="NSD Creations home">
            <div className="relative w-10 h-10 overflow-hidden rounded-full flex-shrink-0 bg-zinc-100 dark:bg-zinc-900">
              <Image src="/nsdlogo.png" alt="NSD Creations" fill className="object-cover" priority sizes="40px" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">NSD <span className="text-indigo-600 dark:text-purple-400">Creations</span></span>
          </Link>

          <nav aria-label="Primary navigation" className="hidden lg:flex items-center space-x-1">
            {mainLinks.map((link) => {
              const isCurrent = isActive(link.href);
              return (
                <Link key={link.name} href={link.href} aria-current={isCurrent ? "page" : undefined} className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${isCurrent ? "text-indigo-600 dark:text-purple-400 bg-indigo-50 dark:bg-purple-500/10" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"}`}>
                  {link.name}
                </Link>
              );
            })}

            <div className="relative" onMouseEnter={() => setIsServicesOpen(true)} onMouseLeave={() => setIsServicesOpen(false)}>
              <button type="button" aria-haspopup="true" aria-expanded={isServicesOpen} className={cn("flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors", isServicesOpen ? "text-indigo-600 dark:text-purple-400" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white")} onClick={() => setIsServicesOpen(!isServicesOpen)}>
                More Services <ChevronDown size={14} className={cn("transition-transform", isServicesOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-2 w-72 p-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-xl grid grid-cols-1 gap-1">
                    {serviceLinks.map((service) => (
                      <Link key={service.slug} href={`/services/${service.slug}`} onClick={() => setIsServicesOpen(false)} className="px-3 py-2 rounded-xl text-sm text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-zinc-300 dark:hover:text-purple-400 dark:hover:bg-white/5 transition-colors">
                        {service.title}
                      </Link>
                    ))}
                    <Link href="/services" onClick={() => setIsServicesOpen(false)} className="px-3 py-2 rounded-xl text-sm font-semibold text-indigo-600 dark:text-purple-400 hover:bg-indigo-50 dark:hover:bg-white/5">All Services →</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label="Toggle theme" type="button">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <button type="button" className="lg:hidden p-2.5 rounded-full text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isOpen} aria-controls="nsd-mobile-navigation">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div id="nsd-mobile-navigation" role="region" aria-label="Mobile navigation" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t border-zinc-200 dark:border-white/10 overflow-hidden">
              <nav aria-label="Mobile navigation" className="flex flex-col gap-1 py-4 max-h-[calc(100dvh-5rem)] overflow-y-auto">
                {mainLinks.map((link) => {
                  const isCurrent = isActive(link.href);
                  return (
                    <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} aria-current={isCurrent ? "page" : undefined} className={`text-base font-medium py-2.5 px-3 rounded-xl transition-colors ${isCurrent ? "text-indigo-600 bg-indigo-50 dark:text-purple-400 dark:bg-white/5" : "text-zinc-700 hover:text-indigo-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-white/5"}`}>
                      {link.name}
                    </Link>
                  );
                })}
                <div className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Popular services</div>
                {serviceLinks.map((service) => (
                  <Link key={service.slug} href={`/services/${service.slug}`} onClick={() => setIsOpen(false)} className="py-2 px-3 rounded-xl text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                    {service.title}
                  </Link>
                ))}
                <Link href="/services" onClick={() => setIsOpen(false)} className="mt-1 py-2.5 px-3 rounded-xl text-sm font-semibold text-indigo-600 dark:text-purple-400 hover:bg-indigo-50 dark:hover:bg-white/5">View all services →</Link>
                <Button className="w-full mt-3 rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white" asChild>
                  <Link href="/contact" onClick={() => setIsOpen(false)}>Start a Project</Link>
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
