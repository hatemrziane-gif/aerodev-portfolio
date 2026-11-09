
"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  MonitorSmartphone,
  MousePointerClick,
  Building2,
  Gauge,
} from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const services = [
  {
    number: "01",
    key: "digital",
    icon: MonitorSmartphone,
    image: "/images/expertise/digital-experiences.jpg",
  },
  {
    number: "02",
    key: "interactive",
    icon: MousePointerClick,
    image: "/images/expertise/interactive-interfaces.jpg",
  },
  {
    number: "03",
    key: "business",
    icon: Building2,
    image: "/images/expertise/business-websites.jpg",
  },
  {
    number: "04",
    key: "performance",
    icon: Gauge,
    image: "/images/expertise/performance-optimization.jpg",
  },
] as const;

export default function Expertise() {
  const t = useTranslations("Expertise");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const label = section.querySelector("[data-expertise-label]");
      const title = section.querySelector("[data-expertise-title]");
      const description = section.querySelector(
        "[data-expertise-description]",
      );
      const closing = section.querySelector("[data-expertise-closing]");

      // Header animation
      const headerTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      headerTimeline
        .from(label, {
          y: 20,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
        })
        .from(
          title,
          {
            y: 40,
            autoAlpha: 0,
            duration: 0.85,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .from(
          description,
          {
            y: 20,
            autoAlpha: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.4",
        );

      // Individual service animations
      const rows = section.querySelectorAll("[data-service-row]");

      rows.forEach((row) => {
        const content = row.querySelector("[data-service-content]");
        const image = row.querySelector("[data-service-image]");
        const icon = row.querySelector("[data-service-icon]");

        const serviceTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 82%",
            once: true,
          },
        });

        serviceTimeline
          .fromTo(
            content,
            {
              x: -35,
              y: 8,
              autoAlpha: 0,
            },
            {
              x: 0,
              y: 0,
              autoAlpha: 1,
              duration: 1,
              ease: "power3.out",
            },
          )
          .fromTo(
            image,
            {
              scale: 0.82,
              autoAlpha: 0,
            },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 1.2,
              ease: "power3.out",
            },
            "<",
          )
          .fromTo(
            icon,
            {
              scale: 0.75,
              rotation: -15,
              autoAlpha: 0,
            },
            {
              scale: 1,
              rotation: 0,
              autoAlpha: 1,
              duration: 0.7,
              ease: "back.out(1.7)",
            },
            "-=0.55",
          );
      });

      // Closing animation
      gsap.from(closing, {
        y: 20,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: closing,
          start: "top 90%",
          once: true,
        },
      });
    },
    {
      scope: sectionRef,
    },
  );

  return (
    <section
      ref={sectionRef}
      id="expertise"
      className="relative w-full overflow-hidden bg-ivory text-obsidian"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 py-28 md:px-12 lg:px-20">

        {/* Section Header */}

        <header className="mb-16 md:mb-24">
          <div
            data-expertise-label
            className="mb-8 flex items-center gap-3"
          >
            <span className="h-px w-8 bg-gold" />

            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-obsidian/50">
              {t("label")}
            </span>
          </div>

          <h2
            data-expertise-title
            className="font-display text-5xl font-normal tracking-tight sm:text-6xl md:text-8xl"
          >
            {t("titleBefore")}

            <span className="ml-2 italic text-gold sm:ml-4">
              {t("titleHighlight")}
            </span>
          </h2>

          <p
            data-expertise-description
            className="mt-6 max-w-md text-sm leading-7 text-obsidian/60 md:text-base"
          >
            {t("description")}
          </p>
        </header>

        {/* Services */}

        <div>
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.key}
                data-service-row
                className="
                  group
                  grid
                  grid-cols-[32px_1fr_104px]
                  items-center
                  gap-3
                  border-t
                  border-obsidian/10
                  py-7
                  transition-colors
                  duration-500
                  hover:border-gold/50
                  sm:grid-cols-[40px_1fr_130px]
                  sm:gap-5
                  md:grid-cols-[60px_1fr_180px]
                  md:gap-8
                  md:py-10
                "
              >
                {/* Number */}

                <span className="text-xs tracking-wider text-gold">
                  {service.number}
                </span>

                {/* Content */}

                <div data-service-content>
                  <h3 className="font-display text-lg text-obsidian transition-colors duration-300 group-hover:text-gold sm:text-2xl md:text-4xl">
                    {t(`services.${service.key}.title`)}
                  </h3>

                  <p className="mt-2 max-w-lg text-[11px] leading-5 text-obsidian/50 sm:text-sm sm:leading-6 md:mt-3">
                    {t(`services.${service.key}.description`)}
                  </p>
                </div>

                {/* Service Image */}

                <div
                  data-service-image
                  className="
                    relative
                    aspect-[4/3]
                    w-full
                    overflow-hidden
                    border
                    border-gold/25
                    bg-[#E9D8C5]
                    shadow-[0_5px_20px_rgba(37,40,32,0.06)]
                    transition-all
                    duration-500
                    group-hover:border-gold/70
                    group-hover:shadow-[0_8px_25px_rgba(197,139,45,0.14)]
                  "
                >
                  <Image
                    src={service.image}
                    alt={t(`services.${service.key}.title`)}
                    fill
                    sizes="(max-width: 640px) 104px, (max-width: 768px) 130px, 180px"
                    className="
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-110
                    "
                  />

                  {/* Icon Overlay */}

                  <div
                    data-service-icon
                    className="
                      absolute
                      bottom-1.5
                      right-1.5
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      border
                      border-gold/20
                      bg-ivory/90
                      text-obsidian/70
                      shadow-sm
                      backdrop-blur-sm
                      transition-all
                      duration-500
                      group-hover:-translate-y-1
                      group-hover:text-gold
                      sm:bottom-2
                      sm:right-2
                      sm:h-9
                      sm:w-9
                    "
                  >
                    <Icon
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      strokeWidth={1.4}
                    />
                  </div>
                </div>
              </article>
            );
          })}

          <div className="border-t border-obsidian/10" />
        </div>

        {/* Closing */}

        <div
          data-expertise-closing
          className="mt-16 flex items-center gap-3 md:mt-20"
        >
          <span className="h-px w-8 bg-gold" />

          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-gold">
            {t("closing")}
          </span>
        </div>

      </div>
    </section>
  );
}
