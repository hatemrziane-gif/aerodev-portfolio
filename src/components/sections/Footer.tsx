"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

import { GiFeather, GiEagleEmblem } from "react-icons/gi";

import {
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa6";

import {
  Zap,
  PenTool,
  Code2,
  MoveUpRight,
} from "lucide-react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const socialLinks = [
  {
    name: "Facebook",
    icon: FaFacebookF,
    href: "https://www.facebook.com/share/1FGwN5L2aW/",
    color: "bg-[#1877F2]",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    href: "https://www.instagram.com/aerodev.web/",
    color: "bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5]",
  },
  {
    name: "GitHub",
    icon: FaGithub,
    href: "https://github.com/hatemrziane-gif",
    color: "bg-[#F0F6FC]",
    iconHover: "group-hover:text-[#090B0F]",
  },
  {
    name: "LinkedIn",
    icon: FaLinkedinIn,
    href: "https://www.linkedin.com/in/hatem-ziane-37b719405/",
    color: "bg-[#0A66C2]",
  },
];

function MarqueeItem({
  text,
  icon,
}: {
  text: string;
  icon: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-7 md:gap-10">
      <span className="whitespace-nowrap font-display text-xl font-semibold uppercase tracking-wide text-ivory sm:text-2xl md:text-3xl">
        {text}
      </span>

      <span className="flex shrink-0 items-center justify-center text-gold drop-shadow-[0_0_8px_rgba(197,139,45,0.4)]">
        {icon === "feather" && (
          <GiFeather className="h-7 w-7 md:h-9 md:w-9" />
        )}

        {icon === "eagle" && (
          <GiEagleEmblem className="h-8 w-8 md:h-10 md:w-10" />
        )}

        {icon === "speed" && (
          <Zap className="h-7 w-7 md:h-9 md:w-9" strokeWidth={1.5} />
        )}

        {icon === "design" && (
          <PenTool className="h-7 w-7 md:h-9 md:w-9" strokeWidth={1.5} />
        )}
      </span>
    </div>
  );
}

function MarqueeGroup({
  statements,
}: {
  statements: { text: string; icon: string }[];
}) {
  return (
    <div className="flex shrink-0 items-center gap-7 pr-7 md:gap-10 md:pr-10">
      {statements.map((item, index) => (
        <MarqueeItem
          key={`${item.text}-${index}`}
          text={item.text}
          icon={item.icon}
        />
      ))}
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="flex items-center justify-center gap-3">
      {socialLinks.map((social) => {
        const Icon = social.icon;

        return (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#F1EEE6]/20 text-[#F1EEE6]/70 transition-all duration-300 hover:border-transparent hover:text-white hover:shadow-[0_0_18px_rgba(197,139,45,0.15)] md:h-12 md:w-12"
          >
            <span
              className={`absolute inset-0 scale-0 rounded-full transition-transform duration-500 ease-out group-hover:scale-100 ${social.color}`}
            />

            <Icon
              className={`relative z-10 text-base transition-all duration-300 group-hover:scale-110 md:text-lg ${social.iconHover ?? ""}`}
            />
          </a>
        );
      })}
    </div>
  );
}

function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Footer");

  const changeLocale = (nextLocale: "en" | "fr") => {
    if (locale === nextLocale) return;

    router.replace(pathname, {
      locale: nextLocale,
    });
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#F1EEE6]/35">
        {t("language")}
      </span>

      <div className="flex items-center rounded-full border border-[#F1EEE6]/15 p-1">
        <button
          type="button"
          onClick={() => changeLocale("en")}
          aria-label="Switch to English"
          aria-pressed={locale === "en"}
          className={`rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-wider transition-all duration-300 ${
            locale === "en"
              ? "bg-gold text-[#090B0F]"
              : "text-[#F1EEE6]/45 hover:text-gold"
          }`}
        >
          EN
        </button>

        <button
          type="button"
          onClick={() => changeLocale("fr")}
          aria-label="Passer en français"
          aria-pressed={locale === "fr"}
          className={`rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-wider transition-all duration-300 ${
            locale === "fr"
              ? "bg-gold text-[#090B0F]"
              : "text-[#F1EEE6]/45 hover:text-gold"
          }`}
        >
          FR
        </button>
      </div>
    </div>
  );
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("Footer");

  const statements = [
    { text: t("marquee.builtToSoar"), icon: "feather" },
    { text: t("marquee.beyondLimits"), icon: "eagle" },
    { text: t("marquee.speedMeetsPrecision"), icon: "speed" },
    { text: t("marquee.designWithoutBoundaries"), icon: "design" },
    { text: t("marquee.craftedToStandOut"), icon: "eagle" },
  ];

  useGSAP(
    () => {
      const track = marqueeRef.current;

      if (!track) return;

      const media = gsap.matchMedia();

      media.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          gsap.to(track, {
            xPercent: -50,
            duration: 35,
            repeat: -1,
            ease: "none",
          });
        },
      );

      return () => media.revert();
    },
    {
      scope: footerRef,
    },
  );

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden bg-[#090B0F] text-[#F1EEE6]"
    >
      {/* Main Brand Area */}

      <div className="mx-auto max-w-[1600px] px-6 pb-12 pt-24 md:px-12 md:pb-16 md:pt-32 lg:px-20">
        <div className="mb-7 flex items-center gap-3">
          <span className="h-px w-8 bg-gold" />

          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold">
            {t("eyebrow")}
          </span>
        </div>

        <h2 className="select-none font-display text-[clamp(4rem,15vw,13rem)] font-bold leading-[0.78] tracking-[-0.085em] text-[#F1EEE6]">
          AERODEV<span className="text-gold">.</span>
        </h2>

        <div className="mt-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <p className="max-w-md text-xs leading-6 tracking-wide text-[#F1EEE6]/50 md:text-sm">
            {t("taglineLine1")}
            <br />
            {t("taglineLine2")}
          </p>

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gold">
            <Code2 size={15} strokeWidth={1.5} />
            <span>{t("specialty")}</span>
          </div>
        </div>
      </div>

      {/* Golden Divider */}

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C58B2D]/70 to-transparent" />

      {/* Infinite Marquee */}

      <div className="relative overflow-hidden py-8 md:py-11">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#090B0F] to-transparent md:w-32" />

        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#090B0F] to-transparent md:w-32" />

        <div
          ref={marqueeRef}
          className="flex w-max items-center"
        >
          <MarqueeGroup statements={statements} />

          <div aria-hidden="true">
            <MarqueeGroup statements={statements} />
          </div>
        </div>
      </div>

      {/* Golden Divider */}

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C58B2D]/40 to-transparent" />

      {/* Social Links */}

      <div className="px-6 py-8 md:py-10">
        <SocialLinks />
      </div>

      {/* Bottom Area */}

      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-6 px-6 py-7 sm:flex-row sm:justify-between md:px-12 lg:px-20">
        <p className="text-center text-[10px] uppercase tracking-[0.18em] text-[#F1EEE6]/40">
          © {new Date().getFullYear()} AERODEV. {t("copyright")}
        </p>

        <LanguageSwitcher />

        <a
          href="#hero"
          className="group flex w-fit items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#F1EEE6]/70 transition-colors duration-300 hover:text-gold"
        >
          {t("backToTop")}

          <MoveUpRight
            size={14}
            className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
          />
        </a>
      </div>
    </footer>
  );
}