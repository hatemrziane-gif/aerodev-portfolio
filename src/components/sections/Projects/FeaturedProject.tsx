
"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { GiFeather } from "react-icons/gi";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { featuredProject } from "./projects.data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FeaturedProject() {
  const t = useTranslations("Projects");
  const container = useRef<HTMLElement>(null);

  const project = featuredProject;

  useGSAP(
    () => {
      const section = container.current;

      if (!section) return;

      const image = section.querySelector<HTMLElement>(
        "[data-project-image]",
      );

      const feather = section.querySelector<HTMLElement>(
        "[data-project-feather]",
      );

      /* ---------------------------------- */
      /* 1. GOLDEN FEATHER ANIMATION        */
      /* ---------------------------------- */

      if (feather) {
        gsap.set(feather, {
          opacity: 0,
          y: 35,
          rotate: 25,
          scale: 0.8,
        });

        gsap.to(feather, {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",

          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none none",
          },

          onComplete: () => {
            gsap.to(feather, {
              filter:
                "drop-shadow(0 0 5px rgba(197,139,45,0.65)) drop-shadow(0 0 14px rgba(197,139,45,0.4))",
              duration: 1.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          },
        });
      }

      /* ---------------------------------- */
      /* 2. IMAGE REVEAL                    */
      /* ---------------------------------- */

      if (image) {
        gsap.set(image, {
          clipPath: "inset(100% 0% 0% 0%)",
          scale: 1.06,
        });

        gsap.to(image, {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1.5,
          ease: "power3.inOut",

          scrollTrigger: {
            trigger: image,
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        });
      }

      /* ---------------------------------- */
      /* 3. PROJECT INFORMATION             */
      /* ---------------------------------- */

      const revealElements = gsap.utils.toArray<HTMLElement>(
        "[data-reveal]",
        section,
      );

      revealElements.forEach((element) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",

            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              toggleActions: "play none none none",
              invalidateOnRefresh: true,
            },
          },
        );
      });

      /* ---------------------------------- */
      /* 4. TECHNOLOGIES                    */
      /* ---------------------------------- */

      const techElements = gsap.utils.toArray<HTMLElement>(
        "[data-tech]",
        section,
      );

      techElements.forEach((element, index) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.08,
            ease: "power2.out",

            scrollTrigger: {
              trigger: element,
              start: "top 92%",
              toggleActions: "play none none none",
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
    {
      scope: container,
    },
  );

  return (
    <article ref={container} className="relative">

      {/* ---------------------------------- */}
      {/* PROJECT INFORMATION                */}
      {/* ---------------------------------- */}

      <div className="mb-8 flex flex-col gap-6 md:mb-10 md:gap-7">

        {/* Project Details */}

        <div>
          <span
            data-reveal
            className="block text-[10px] font-medium uppercase tracking-[0.25em] text-gold"
          >
            {t("featured")}
          </span>

          <h3
            data-reveal
            className="mt-3 font-display text-4xl text-obsidian sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {project.name}
            <span className="text-gold">.</span>
          </h3>

          <p
            data-reveal
            className="mt-3 max-w-2xl text-sm leading-7 text-obsidian/60 md:text-base"
          >
            {t("projectDescription")}
          </p>
        </div>

        {/* Project Link */}

        <Link
          data-reveal
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="
            group
            flex
            w-fit
            items-center
            gap-3
            px-5
            py-3
            text-xs
            font-semibold
            tracking-wide
            bg-[#252820]
            text-[#F1EEE6]
            transition-all
            duration-300
            hover:bg-[#B89A62]
            hover:text-[#090B0F]
          "
        >
          <span>{t("viewProject")}</span>

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

      {/* ---------------------------------- */}
      {/* GOLDEN FEATHER ORNAMENT            */}
      {/* NOW ABOVE THE PROJECT IMAGE        */}
      {/* ---------------------------------- */}

      <div className="relative mx-auto mb-7 flex w-full items-center justify-center gap-0 px-2 md:mb-9">

        {/* Left Golden Line */}

        <div className="relative h-px flex-1 overflow-hidden bg-gradient-to-r from-transparent via-[#C58B2D]/70 to-[#C58B2D] shadow-[0_0_7px_rgba(197,139,45,0.35)]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFE0A0] to-transparent opacity-80" />
        </div>

        {/* Feather */}

        <div className="relative z-10 flex h-12 w-16 items-center justify-center md:h-14 md:w-20">
          <GiFeather
            data-project-feather
            className="text-[32px] text-[#C58B2D] drop-shadow-[0_0_8px_rgba(197,139,45,0.5)] md:text-[40px]"
          />
        </div>

        {/* Right Golden Line */}

        <div className="relative h-px flex-1 overflow-hidden bg-gradient-to-l from-transparent via-[#C58B2D]/70 to-[#C58B2D] shadow-[0_0_7px_rgba(197,139,45,0.35)]">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#FFE0A0] to-transparent opacity-80" />
        </div>
      </div>

      {/* ---------------------------------- */}
      {/* PROJECT IMAGE                      */}
      {/* ---------------------------------- */}

      <div className="group relative rounded-sm border border-[#C58B2D]/80 bg-gradient-to-br from-[#F4D18B] via-[#C58B2D] to-[#8B5B19] p-[2px] shadow-[0_12px_35px_rgba(139,91,25,0.14),0_0_18px_rgba(197,139,45,0.12)] transition-shadow duration-700 hover:shadow-[0_18px_45px_rgba(139,91,25,0.22),0_0_25px_rgba(197,139,45,0.2)]">

        {/* Inner Image */}

        <div className="overflow-hidden bg-[#E5E2D9]">
          <div
            data-project-image
            className="relative aspect-[16/10] w-full"
          >
            <Image
              src={project.image}
              alt={t("imageAlt")}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover object-top"
            />
          </div>
        </div>

        {/* Subtle Inner Border */}

        <div className="pointer-events-none absolute inset-[3px] border border-white/30" />
      </div>

      {/* ---------------------------------- */}
      {/* PROJECT TECHNOLOGIES               */}
      {/* ---------------------------------- */}

      <div className="mt-8 flex flex-wrap gap-3 border-t border-obsidian/10 pt-5 md:mt-10">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            data-tech
            className="rounded-full border border-obsidian/10 px-4 py-2 text-[10px] uppercase tracking-wider text-obsidian/60 transition-all duration-300 hover:border-gold/60 hover:text-gold"
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}
