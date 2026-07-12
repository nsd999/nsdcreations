"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Laptop, Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { NsdLogo } from "./NsdLogo";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when page changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Meet the Founder", href: "/meet-the-founder" },
    { name: "Our Process", href: "/process" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ];

  const getThemeIcon = () => {
    if (theme === "dark") return <Moon className="w-4 h-4" />;
    if (theme === "light") return <Sun className="w-4 h-4" />;
    return <Laptop className="w-4 h-4" />;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 w-full ${
        scrolled
          ? "bg-white/80 dark:bg-[#030303]/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-900/50 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <motion.div
            layoutId="nsd-logo-brand"
            transition={{
              type: "spring",
              stiffness: 110,
              damping: 20,
            }}
            className="w-11 h-11 relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300"
          >
            <NsdLogo mode="navbar" theme={resolvedTheme} className="w-full h-full" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400">
              NSD CREATIONS
            </span>
            <span className="text-[9px] font-mono tracking-widest text-indigo-500 dark:text-indigo-400 uppercase -mt-1 font-bold">
              Creative Tech Partner
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-bg"
                    className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions & Theme Toggler */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Theme Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              aria-label="Toggle theme"
            >
              {getThemeIcon()}
            </button>
            <AnimatePresence>
              {showThemeMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowThemeMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-xl z-20"
                  >
                    {[
                      { id: "light", label: "Light", icon: <Sun className="w-3.5 h-3.5" /> },
                      { id: "dark", label: "Dark", icon: <Moon className="w-3.5 h-3.5" /> },
                      { id: "system", label: "System", icon: <Laptop className="w-3.5 h-3.5" /> },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setTheme(opt.id as any);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          theme === opt.id
                            ? "bg-indigo-500 text-white"
                            : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                        }`}
                      >
                        {opt.icon}
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <a
            href="https://tinyurl.com/startwithNSD"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4.5 py-2 rounded-full text-xs font-semibold tracking-wide uppercase bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-black hover:scale-[1.02] transition-all duration-200 shadow-md"
          >
            Start Project
            <ArrowRight className="w-3 h-3 ml-1.5" />
          </a>
        </div>

        {/* Mobile Nav Button */}
        <div className="flex items-center space-x-3 lg:hidden">
          {/* Quick theme cycle for mobile */}
          <button
            onClick={() => {
              const next: Record<string, string> = { light: "dark", dark: "system", system: "light" };
              setTheme(next[theme] as any);
            }}
            className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
            aria-label="Toggle theme mobile"
          >
            {getThemeIcon()}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-[#030303] overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4 flex flex-col">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-base font-medium py-1.5 transition-colors ${
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex flex-col gap-3">
                <a
                  href="https://tinyurl.com/startwithNSD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold tracking-wide uppercase bg-indigo-500 hover:bg-indigo-600 text-white text-center shadow-lg"
                >
                  Start Your Project
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
