
"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Sparkles } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ProjectsHeader() {
  const t = useTranslations("Projects");
  const headerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header) return;

      const label = header.querySelector("[data-header-label]");
      const title = header.querySelector("[data-header-title]");
      const description = header.querySelector("[data-header-description]");
      const sparkles = header.querySelector("[data-header-sparkles]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: "top 80%",
          once: true,
        },
      });

      tl.from(label, {
        y: 20,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power3.out",
      })
        .from(
          title,
          {
            y: 45,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .from(
          description,
          {
            y: 20,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.35",
        );

      gsap.fromTo(
        sparkles,
        {
          scale: 0.4,
          rotation: -45,
          autoAlpha: 0,
        },
        {
          scale: 1,
          rotation: 0,
          autoAlpha: 1,
          duration: 0.8,
          delay: 0.5,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: header,
            start: "top 80%",
            once: true,
          },
        },
      );
    },
    {
      scope: headerRef,
    },
  );

  return (
    <header
      ref={headerRef}
      className="relative mb-16 md:mb-24"
    >
      {/* Section Label */}
      <div
        data-header-label
        className="mb-8 flex items-center gap-3"
      >
        <span className="h-px w-8 bg-gold" />

        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-obsidian/50">
          {t("label")}
        </span>
      </div>

      {/* Main Heading */}
      <div className="relative flex items-center gap-3 sm:gap-5">
        <h2
          data-header-title
          className="font-display text-5xl font-normal tracking-tight text-obsidian sm:text-6xl md:text-8xl"
        >
          {t("titleBefore")}

          <span className="ml-2 italic text-gold sm:ml-4">
            {t("titleHighlight")}
          </span>
        </h2>

        {/* Animated Sparkles */}
        <div
          data-header-sparkles
          className="relative mt-2 shrink-0"
        >
          <Sparkles className="h-9 w-9 text-gold drop-shadow-[0_0_8px_rgba(197,139,45,0.35)] sm:h-12 sm:w-12 md:h-16 md:w-16" />
        </div>
      </div>

      {/* Description */}
      <p
        data-header-description
        className="mt-6 max-w-md text-sm leading-7 text-obsidian/60 md:text-base"
      >
        {t("description")}
      </p>
    </header>
  );
}
