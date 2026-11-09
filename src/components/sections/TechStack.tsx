
"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiGsap,
} from "react-icons/si";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const technologies = [
  {
    name: "HTML5",
    icon: SiHtml5,
    color: "#E44D26",
  },
  {
    name: "CSS3",
    icon: SiCss,
    color: "#1572B6",
  },
  {
    name: "JavaScript",
    icon: SiJavascript,
    color: "#D6B52C",
  },
  {
    name: "React",
    icon: SiReact,
    color: "#149ECA",
  },
  {
    name: "Next.js",
    icon: SiNextdotjs,
    color: "#252820",
  },
  {
    name: "TypeScript",
    icon: SiTypescript,
    color: "#3178C6",
  },
  {
    name: "GSAP",
    icon: SiGsap,
    color: "#78B83E",
  },
];

export default function TechStack() {
  const t = useTranslations("TechStack");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      tl.from("[data-tech-label]", {
        y: 20,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power3.out",
      })
        .from(
          "[data-tech-title]",
          {
            y: 45,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .from(
          "[data-tech-description]",
          {
            y: 20,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          "[data-tech-item]",
          {
            y: 30,
            autoAlpha: 0,
            scale: 0.95,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.2"
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="tech-stack"
      className="relative w-full overflow-hidden bg-ivory text-obsidian"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 py-28 md:px-12 lg:px-20">

        {/* Header */}
        <header className="mb-16 md:mb-20">
          <div
            data-tech-label
            className="mb-8 flex items-center gap-3"
          >
            <span className="h-px w-8 bg-gold" />

            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-obsidian/50">
              {t("label")}
            </span>
          </div>

          <h2
            data-tech-title
            className="max-w-4xl font-display text-5xl font-normal tracking-tight sm:text-6xl md:text-8xl"
          >
            {t("titleBefore")}

            <span className="ml-2 italic text-gold sm:ml-4">
              {t("titleHighlight")}
            </span>
          </h2>

          <p
            data-tech-description
            className="mt-6 max-w-md text-sm leading-7 text-obsidian/60 md:text-base"
          >
            {t("description")}
          </p>
        </header>

        {/* Technologies */}
        <div className="grid grid-cols-2 border-l border-t border-obsidian/10 sm:grid-cols-3 md:grid-cols-4">
          {technologies.map((tech) => {
            const Icon = tech.icon;

            return (
              <div
                key={tech.name}
                data-tech-item
                className="group flex min-h-[150px] flex-col items-center justify-center gap-5 border-b border-r border-obsidian/10 p-6 transition-colors duration-500 hover:bg-white/60 md:min-h-[180px]"
              >
                <Icon
                  className="h-9 w-9 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110"
                  style={{ color: tech.color }}
                />

                <span className="text-xs font-medium tracking-wide text-obsidian/60 transition-colors duration-300 group-hover:text-gold">
                  {tech.name}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
