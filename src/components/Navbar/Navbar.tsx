
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Menu,
  X,
  ChevronDown,
  Languages,
} from "lucide-react";

import { Link, usePathname, useRouter } from "@/i18n/navigation";

type NavbarTheme = "dark" | "light";

type NavbarProps = {
  onAboutClick: () => void;
  theme: NavbarTheme;
  visible: boolean;
};

const languages = [
  { code: "en", label: "EN", name: "English" },
  { code: "fr", label: "FR", name: "Français" },
] as const;

const EAGLE_COMPLETED_KEY = "aerodev-eagle-reveal-completed";
const SCROLL_POSITION_KEY = "aerodev-home-scroll-position";
const ABOUT_VISIBLE_KEY = "aerodev-about-visible";
const RESTORE_SCROLL_KEY = "aerodev-restore-scroll";

export default function Navbar({
  onAboutClick,
  theme,
  visible,
}: NavbarProps) {
  const t = useTranslations("Navbar");

  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";

  const currentLanguage =
    languages.find((language) => language.code === locale) ??
    languages[0];

  const desktopLinkClass = `
    relative
    text-sm
    font-medium
    tracking-wide
    transition-colors
    duration-300
    ${
      isDark
        ? "text-white/65 hover:text-white"
        : "text-[#252820]/65 hover:text-[#252820]"
    }
  `;

  const navSurfaceClass = isDark
    ? "border-white/10 bg-[#090B0F]/55 text-[#F1EEE6]"
    : "border-[#252820]/10 bg-[#F1EEE6]/90 text-[#252820]";

  /* ---------------------------------- */
  /* Mobile Menu Animation              */
  /* ---------------------------------- */

  useGSAP(
    () => {
      const menu = menuRef.current;
      const menuContent = menuContentRef.current;

      if (!menu || !menuContent) return;

      if (menuOpen) {
        gsap.set(menu, { display: "flex" });

        const timeline = gsap.timeline();

        timeline.fromTo(
          menu,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.45,
            ease: "power3.out",
          },
        );

        timeline.fromTo(
          menuContent,
          { y: 35, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            ease: "power3.out",
          },
          "-=0.2",
        );

        if (menuItemsRef.current) {
          timeline.fromTo(
            menuItemsRef.current.children,
            { y: 20, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.45,
              stagger: 0.1,
              ease: "power3.out",
            },
            "-=0.35",
          );
        }
      } else {
        gsap.to(menu, {
          autoAlpha: 0,
          duration: 0.35,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(menu, { display: "none" });
          },
        });
      }
    },
    {
      dependencies: [menuOpen],
      scope: menuRef,
    },
  );

  /* ---------------------------------- */
  /* Close Menus When Route Changes     */
  /* ---------------------------------- */

  useEffect(() => {
    setMenuOpen(false);
    setLanguageOpen(false);
  }, [pathname]);

  /* ---------------------------------- */
  /* Close Menu With Escape             */
  /* ---------------------------------- */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setLanguageOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* ---------------------------------- */
  /* Language Switcher                  */
  /* ---------------------------------- */

  const changeLanguage = (newLocale: "en" | "fr") => {
    if (newLocale === locale) {
      setLanguageOpen(false);
      return;
    }

    setLanguageOpen(false);
    setMenuOpen(false);

    const currentScroll = window.scrollY;

    const trigger = ScrollTrigger.getById(
      "hero-about-transition",
    );

    const aboutIsVisible =
      trigger?.isActive === true ||
      (trigger !== undefined && trigger.progress > 0);

    sessionStorage.setItem(
      SCROLL_POSITION_KEY,
      String(currentScroll),
    );

    sessionStorage.setItem(
      ABOUT_VISIBLE_KEY,
      String(aboutIsVisible),
    );

    sessionStorage.setItem(
      RESTORE_SCROLL_KEY,
      "true",
    );

    if (aboutIsVisible) {
      sessionStorage.setItem(
        EAGLE_COMPLETED_KEY,
        "true",
      );
    }

    router.replace(pathname, {
      locale: newLocale,
      scroll: false,
    });
  };

  /* ---------------------------------- */
  /* About Navigation                   */
  /* ---------------------------------- */

  const handleAboutClick = () => {
    setMenuOpen(false);
    setLanguageOpen(false);
    onAboutClick();
  };

  /* ---------------------------------- */
  /* Close Mobile Menu                  */
  /* ---------------------------------- */

  const closeMobileMenu = () => {
    setMenuOpen(false);
    setLanguageOpen(false);
  };

  return (
    <>
      {/* Main Navbar */}

      <nav
        data-navbar
        aria-hidden={!visible}
        className={`
          fixed
          left-0
          top-0
          z-[60]
          w-full
          border-b
          backdrop-blur-xl
          transition-all
          duration-700
          ${navSurfaceClass}
          ${
            visible
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-4 opacity-0"
          }
        `}
      >
        <div
          className="
            mx-auto
            flex
            h-[76px]
            max-w-[1440px]
            items-center
            justify-between
            px-6
            md:px-10
            lg:px-16
          "
        >
          {/* Logo */}

          <Link
            href="/"
            aria-label="AERODEV Home"
            className="relative z-[70] flex items-center"
          >
            <Image
              src="/logo.png"
              alt="AERODEV"
              width={150}
              height={48}
              priority
              className={`
                h-auto
                w-[112px]
                object-contain
                transition
                duration-500
                md:w-[135px]
                ${isDark ? "brightness-0 invert" : ""}
              `}
            />
          </Link>

          {/* Desktop Navigation */}

          <div className="hidden items-center gap-8 xl:gap-10 lg:flex">
            <button
              type="button"
              onClick={handleAboutClick}
              className={desktopLinkClass}
            >
              {t("about")}
            </button>

            <Link
              href="/#projects"
              className={desktopLinkClass}
            >
              {t("projects")}
            </Link>

            <Link
              href="/#expertise"
              className={desktopLinkClass}
            >
              {t("expertise")}
            </Link>

            <Link
              href="/#tech-stack"
              className={desktopLinkClass}
            >
              {t("techStack")}
            </Link>

            <Link
              href="/#contact"
              className={desktopLinkClass}
            >
              {t("contact")}
            </Link>
          </div>

          {/* Desktop Actions */}

          <div className="hidden items-center gap-5 lg:flex">
            {/* Desktop Language Switcher */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setLanguageOpen((previous) => !previous)
                }
                aria-expanded={languageOpen}
                aria-label="Choose language"
                className={`
                  flex
                  items-center
                  gap-2
                  border
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  tracking-wider
                  transition-all
                  duration-300
                  ${
                    isDark
                      ? "border-white/15 text-white/75 hover:border-white/40 hover:text-white"
                      : "border-[#252820]/15 text-[#252820]/70 hover:border-[#252820]/40 hover:text-[#252820]"
                  }
                `}
              >
                <Languages size={15} />
                <span>{currentLanguage.label}</span>

                <ChevronDown
                  size={13}
                  className={`transition-transform duration-300 ${
                    languageOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {languageOpen && (
                <div
                  className={`
                    absolute
                    right-0
                    top-[calc(100%+12px)]
                    min-w-[130px]
                    overflow-hidden
                    border
                    py-1
                    shadow-2xl
                    ${
                      isDark
                        ? "border-white/10 bg-[#15181D] text-white"
                        : "border-[#252820]/10 bg-[#F8F6F0] text-[#252820]"
                    }
                  `}
                >
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      type="button"
                      onClick={() => changeLanguage(language.code)}
                      className={`
                        flex
                        w-full
                        items-center
                        justify-between
                        px-4
                        py-2.5
                        text-left
                        text-xs
                        transition-colors
                        duration-200
                        ${
                          locale === language.code
                            ? "font-bold opacity-100"
                            : "opacity-60 hover:opacity-100"
                        }
                        ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}
                      `}
                    >
                      <span>{language.name}</span>

                      {locale === language.code && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B89A62]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop CTA */}

            <Link
              href="/#contact"
              className={`
                group
                flex
                items-center
                gap-3
                px-5
                py-3
                text-xs
                font-semibold
                tracking-wide
                transition-all
                duration-300
                ${
                  isDark
                    ? "bg-[#F1EEE6] text-[#090B0F] hover:bg-[#B89A62]"
                    : "bg-[#252820] text-[#F1EEE6] hover:bg-[#B89A62] hover:text-[#090B0F]"
                }
              `}
            >
              <span>{t("cta")}</span>

              <ArrowUpRight
                size={15}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                "
              />
            </Link>
          </div>

          {/* Mobile Actions */}

          <div className="flex items-center gap-3 lg:hidden">
            {/* Mobile Language Switcher */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setLanguageOpen((previous) => !previous)
                }
                aria-expanded={languageOpen}
                aria-label="Change language"
                className={`
                  flex
                  h-11
                  items-center
                  justify-center
                  gap-2
                  border
                  px-3
                  text-xs
                  font-semibold
                  tracking-wider
                  transition-all
                  duration-300
                  ${
                    isDark
                      ? "border-white/15 text-white hover:bg-white/10"
                      : "border-[#252820]/15 text-[#252820] hover:bg-black/5"
                  }
                `}
              >
                <Languages size={17} />
                <span>{currentLanguage.label}</span>
              </button>

              {languageOpen && (
                <div
                  className={`
                    absolute
                    right-0
                    top-[calc(100%+12px)]
                    z-[90]
                    min-w-[135px]
                    overflow-hidden
                    border
                    py-1
                    shadow-2xl
                    ${
                      isDark
                        ? "border-white/10 bg-[#15181D] text-white"
                        : "border-[#252820]/10 bg-[#F8F6F0] text-[#252820]"
                    }
                  `}
                >
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      type="button"
                      onClick={() => changeLanguage(language.code)}
                      className={`
                        flex
                        w-full
                        items-center
                        justify-between
                        px-4
                        py-3
                        text-left
                        text-xs
                        transition-colors
                        ${
                          locale === language.code
                            ? "font-bold opacity-100"
                            : "opacity-60 hover:opacity-100"
                        }
                        ${isDark ? "hover:bg-white/5" : "hover:bg-black/5"}
                      `}
                    >
                      <span>{language.name}</span>

                      {locale === language.code && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B89A62]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}

            <button
              type="button"
              onClick={() => {
                setLanguageOpen(false);
                setMenuOpen(true);
              }}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className={`
                relative
                z-[70]
                flex
                h-11
                w-11
                items-center
                justify-center
                border
                transition-all
                duration-300
                ${
                  isDark
                    ? "border-white/15 text-white hover:bg-white/10"
                    : "border-[#252820]/15 text-[#252820] hover:bg-black/5"
                }
              `}
            >
              <Menu size={21} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}

      <div
        ref={menuRef}
        className="
          fixed
          inset-0
          z-[80]
          hidden
          flex-col
          justify-between
          bg-[#090B0F]
          px-7
          py-8
          text-[#F1EEE6]
          md:px-12
          md:py-10
        "
        style={{ display: "none" }}
      >
        {/* Mobile Menu Header */}

        <div className="flex items-center justify-between">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="relative"
          >
            <Image
              src="/logo.png"
              alt="AERODEV"
              width={135}
              height={45}
              className="
                h-auto
                w-[115px]
                brightness-0
                invert
              "
            />
          </Link>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close menu"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              border
              border-white/15
              text-white
              transition-colors
              hover:bg-white/10
            "
          >
            <X size={21} strokeWidth={1.5} />
          </button>
        </div>

        {/* Mobile Menu Content */}

        <div ref={menuContentRef} className="my-auto">
          <p className="mb-8 text-[10px] uppercase tracking-[0.35em] text-[#B89A62]">
            Navigation
          </p>

          <div
            ref={menuItemsRef}
            className="flex flex-col items-start gap-5 md:gap-7"
          >
            <button
              type="button"
              onClick={handleAboutClick}
              className="
                text-left
                text-5xl
                font-light
                tracking-tight
                transition-colors
                hover:text-[#B89A62]
                md:text-7xl
              "
            >
              {t("about")}
            </button>

            <Link
              href="/#projects"
              onClick={closeMobileMenu}
              className="
                text-5xl
                font-light
                tracking-tight
                transition-colors
                hover:text-[#B89A62]
                md:text-7xl
              "
            >
              {t("projects")}
            </Link>

            <Link
              href="/#expertise"
              onClick={closeMobileMenu}
              className="
                text-5xl
                font-light
                tracking-tight
                transition-colors
                hover:text-[#B89A62]
                md:text-7xl
              "
            >
              {t("expertise")}
            </Link>

            <Link
              href="/#tech-stack"
              onClick={closeMobileMenu}
              className="
                text-5xl
                font-light
                tracking-tight
                transition-colors
                hover:text-[#B89A62]
                md:text-7xl
              "
            >
              {t("techStack")}
            </Link>

            <Link
              href="/#contact"
              onClick={closeMobileMenu}
              className="
                text-5xl
                font-light
                tracking-tight
                transition-colors
                hover:text-[#B89A62]
                md:text-7xl
              "
            >
              {t("contact")}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Footer */}

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-6
            border-t
            border-white/10
            pt-6
          "
        >
          {/* Language Options */}

          <div className="flex items-center gap-4">
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                onClick={() => changeLanguage(language.code)}
                className={`
                  text-xs
                  tracking-widest
                  transition-colors
                  ${
                    locale === language.code
                      ? "font-bold text-[#B89A62]"
                      : "text-white/45 hover:text-white"
                  }
                `}
              >
                {language.label}
              </button>
            ))}
          </div>

          {/* Mobile CTA */}

          <Link
            href="/#contact"
            onClick={closeMobileMenu}
            className="
              group
              flex
              items-center
              gap-2
              text-sm
              text-[#B89A62]
              transition-colors
              hover:text-white
            "
          >
            {t("cta")}

            <ArrowUpRight
              size={16}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
                group-hover:-translate-y-1
              "
            />
          </Link>
        </div>
      </div>
    </>
  );
}
