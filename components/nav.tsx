"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";

export default function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const basePath = `/${locale}`;

  const navLinks = [
    { href: `${basePath}/projects`, label: t("projects") },
    { href: `${basePath}/about`, label: t("about") },
    { href: `${basePath}/writing`, label: t("writing") },
    { href: `${basePath}/contact`, label: t("contact") },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");


  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? "backdrop-blur-md border-b" : ""
      }`}
      style={{
        backgroundColor: scrolled ? "rgba(10, 11, 13, 0.9)" : "transparent",
        borderColor: scrolled ? "var(--color-border)" : "transparent",
      }}
    >
      <nav className="max-w-[1280px] mx-auto px-8 md:px-16 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={basePath}
          className="text-mono transition-colors"
          style={{ color: "var(--color-text-dim)" }}
        >
          <span
            style={{
              color: pathname === basePath ? "var(--color-text)" : undefined,
            }}
            className="hover:text-[var(--color-text)] transition-colors"
          >
            umut.satir
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, i) => (
            <span key={link.href} className="flex items-center">
              {i > 0 && (
                <span className="text-mono mx-2" style={{ color: "var(--color-text-faint)" }}>
                  ·
                </span>
              )}
              <Link
                href={link.href}
                className="text-small transition-colors duration-150 hover:text-[var(--color-text)]"
                style={{
                  color: isActive(link.href)
                    ? "var(--color-text)"
                    : "var(--color-text-dim)",
                }}
              >
                {link.label}
              </Link>
            </span>
          ))}

          <span className="text-mono mx-3" style={{ color: "var(--color-border)" }}>
            |
          </span>

          {/* Lang toggle */}
          <div className="flex items-center gap-1 text-mono text-[0.75rem]">
            <Link
              href={pathname.replace(`/${locale}`, "/en")}
              style={{
                color:
                  locale === "en"
                    ? "var(--color-accent)"
                    : "var(--color-text-dim)",
              }}
              className="hover:text-[var(--color-text)] transition-colors"
            >
              EN
            </Link>
            <span style={{ color: "var(--color-text-faint)" }}>|</span>
            <Link
              href={pathname.replace(`/${locale}`, "/tr")}
              style={{
                color:
                  locale === "tr"
                    ? "var(--color-accent)"
                    : "var(--color-text-dim)",
              }}
              className="hover:text-[var(--color-text)] transition-colors"
            >
              TR
            </Link>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1"
          style={{ color: "var(--color-text-dim)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{
            backgroundColor: "var(--color-bg)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="max-w-[1280px] mx-auto px-8 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-small transition-colors"
                style={{
                  color: isActive(link.href)
                    ? "var(--color-text)"
                    : "var(--color-text-dim)",
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 text-mono text-[0.75rem] pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
              <Link
                href={pathname.replace(`/${locale}`, "/en")}
                style={{
                  color: locale === "en" ? "var(--color-accent)" : "var(--color-text-dim)",
                }}
              >
                EN
              </Link>
              <span style={{ color: "var(--color-text-faint)" }}>|</span>
              <Link
                href={pathname.replace(`/${locale}`, "/tr")}
                style={{
                  color: locale === "tr" ? "var(--color-accent)" : "var(--color-text-dim)",
                }}
              >
                TR
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
