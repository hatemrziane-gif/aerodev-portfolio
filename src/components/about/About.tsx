"use client";

import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";

import { Code2, PenTool, Zap } from "lucide-react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type AboutProps = {
  isReady: boolean;
  skipReveal?: boolean;
};

export default function About({
  isReady,
  skipReveal = false,
}: AboutProps) {
  const t = useTranslations("About");

  const sectionRef = useRef<HTMLElement>(null);

  const expertise = [
    { key: "development", Icon: Code2 },
    { key: "design", Icon: PenTool },
    { key: "motion", Icon: Zap },
  ] as const;

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section) return;

      const feather = section.querySelector<HTMLElement>(
        "[data-about-feather]",
      );

      if (!feather) return;

      /*
        Keep all About content visible.
        No text reveal animation is applied.
      */

      const content = section.querySelector<HTMLElement>(
        "[data-about-content]",
      );

      if (content) {
        gsap.set(content, {
          autoAlpha: 1,
          clearProps: "opacity,visibility,transform",
        });
      }

      /*
        Skip feather animation when restoring
        the About section after a locale change.
      */

      if (skipReveal) {
        gsap.set(feather, {
          autoAlpha: 1,
          clearProps: "transform",
        });

        return;
      }

      /*
        Feather entrance animation.
      */

      if (!isReady) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1280px)",
          isCompact: "(max-width: 1279px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduceMotion } = (context.conditions ??
            {}) as {
            isDesktop?: boolean;
            reduceMotion?: boolean;
          };

          if (reduceMotion) {
            gsap.set(feather, {
              autoAlpha: 1,
              clearProps: "transform",
            });

            return;
          }

          gsap.set(feather, {
            autoAlpha: 0,
            ...(isDesktop
              ? {
                  x: 140,
                  y: 0,
                  scale: 0.96,
                  rotation: 4,
                }
              : {
                  x: 90,
                  y: 0,
                  scale: 0.97,
                  rotation: 3,
                }),
          });

          gsap.to(feather, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: isDesktop ? 1.6 : 1.2,
            ease: "power3.out",
          });
        },
      );

      return () => mm.revert();
    },
    {
      scope: sectionRef,
      dependencies: [isReady, skipReveal],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      data-about-section
      aria-label="About"
      className={`
        absolute
        inset-0
        z-20
        h-full
        min-h-full
        w-full
        overflow-x-hidden
        bg-[#F1EEE6]
        text-[#252820]
        ${isReady ? "overflow-y-auto" : "overflow-hidden"}
      `}
    >
      <div
        className="
          relative
          mx-auto
          flex
          min-h-full
          max-w-[1600px]
          flex-col
          justify-center
          px-6
          py-24
          sm:px-8
          sm:py-28
          xl:px-10
          xl:py-5
        "
      >
        <div className="grid items-center gap-8 xl:grid-cols-[1fr_1fr] xl:gap-0">
          {/* TEXT CONTENT */}

          <div
            data-about-content
            className="relative z-10 order-2 xl:order-1"
          >
            {/* EYEBROW */}

            <div
              data-about-eyebrow
              className="
                mb-4
                flex
                items-center
                justify-center
                gap-3
                lg:justify-start
              "
            >
              <span className="h-[2px] w-16 bg-gradient-to-r from-transparent via-antique-gold to-deep-bronze sm:w-24" />

              <span className="font-sans text-xs font-semibold tracking-[0.35em] text-[#252820]">
                ABOUT
              </span>

              <span className="h-[2px] w-16 bg-gradient-to-l from-transparent via-antique-gold to-deep-bronze sm:w-24" />
            </div>

            {/* TITLE */}

            <h1
              data-about-title
              className="
                whitespace-nowrap
                font-display
                text-[clamp(2.7rem,7.5vw,7.5rem)]
                font-medium
                leading-none
                tracking-[-0.065em]
                text-[#252820]
              "
            >
              {t("titleBefore")}{" "}

              <span
                className="
                  bg-gradient-to-r
                  from-[#B77A26]
                  via-[#C58B2D]
                  to-[#E8B45D]
                  bg-clip-text
                  text-transparent
                  drop-shadow-[0_2px_8px_rgba(197,139,45,0.3)]
                "
              >
                {t("titleHighlight")}
              </span>
            </h1>

            {/* DIVIDER */}

            <div data-about-divider className="mt-6">
              <span
                className="
                  block
                  h-[3px]
                  w-44
                  rounded-full
                  bg-gradient-to-r
                  from-[#B77A26]
                  via-[#C58B2D]
                  to-[#E8B45D]
                  shadow-[0_1px_10px_rgba(197,139,45,0.35)]
                  sm:w-64
                "
              />
            </div>

            {/* DESCRIPTION */}

            <p
              data-about-description
              className="
                mt-8
                max-w-[570px]
                font-editorial
                text-lg
                leading-[1.85]
                text-[#55564F]
                sm:text-xl
              "
            >
              {t("description")}
            </p>

            {/* EXPERTISE */}

            <div
              data-about-expertise
              className="
                mt-12
                grid
                grid-cols-1
                gap-8
                sm:grid-cols-3
                sm:gap-6
              "
            >
              {expertise.map(({ key, Icon }) => (
                <div
                  key={key}
                  data-about-expertise-item
                  className="flex flex-col"
                >
                  <Icon
                    size={34}
                    strokeWidth={1.7}
                    className="
                      mb-5
                      text-gold
                      drop-shadow-[0_2px_7px_rgba(197,139,45,0.4)]
                    "
                  />

                  <h2
                    className="
                      font-sans
                      text-base
                      font-semibold
                      tracking-wide
                      text-[#252820]
                    "
                  >
                    {t(`expertise.${key}.title`)}
                  </h2>

                  <p
                    className="
                      mt-3
                      font-sans
                      text-sm
                      leading-7
                      text-[#68685F]
                    "
                  >
                    {t(`expertise.${key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* GOLDEN FEATHER */}

          <div
            data-about-feather
            className="
              relative
              order-1
              mx-auto
              h-[260px]
              w-full
              max-w-[800px]
              sm:h-[300px]
              md:h-[320px]
              lg:h-[340px]
              xl:order-2
              xl:h-[600px]
              xl:max-w-none
            "
          >
            <div className="absolute inset-0 rotate-[15deg] scale-[1.5]">
              <Image
                src="/images/feather.png"
                alt={t("featherAlt")}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1279px) 100vw, 60vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}