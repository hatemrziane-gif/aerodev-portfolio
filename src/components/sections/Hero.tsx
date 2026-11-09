
"use client";

import { useRef, useState } from "react";
import type { RefObject } from "react";

import {
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa6";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import EagleReveal from "./EagleReveal";

gsap.registerPlugin(useGSAP);

/* ---------------------------------- */
/* Social Links                       */
/* ---------------------------------- */

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
    color:
      "bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5]",
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

/* ---------------------------------- */
/* Types                              */
/* ---------------------------------- */

type HeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  sectionRef: RefObject<HTMLElement | null>;
  onExplore: () => void;
  onRevealComplete: () => void;
};

/* ---------------------------------- */
/* Social Links Component             */
/* ---------------------------------- */

function HeroSocialLinks({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={containerRef}
      aria-label="Social media links"
      className="
        absolute
        left-3
        top-1/2
        z-30
        hidden
        -translate-y-1/2
        flex-col
        items-center
        gap-3
        md:flex
        sm:left-5
        sm:gap-4
        lg:left-8
      "
      style={{
        visibility: "hidden",
        opacity: 0,
      }}
    >
      {socialLinks.map((social) => {
        const Icon = social.icon;

        return (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            title={social.name}
            className="
              group
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              border-[#F1EEE6]/20
              text-[#F1EEE6]/70
              transition-all
              duration-300
              hover:border-transparent
              hover:text-white
              hover:shadow-[0_0_18px_rgba(197,139,45,0.15)]
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-4
              focus-visible:outline-[#C58B2D]
              sm:h-10
              sm:w-10
              md:h-12
              md:w-12
            "
          >
            {/* Brand Color Fill */}

            <span
              className={`
                absolute
                inset-0
                scale-0
                rounded-full
                transition-transform
                duration-500
                ease-out
                group-hover:scale-100
                ${social.color}
              `}
            />

            {/* Social Icon */}

            <Icon
              className={`
                relative
                z-10
                text-sm
                transition-all
                duration-300
                group-hover:scale-110
                sm:text-base
                md:text-lg
                ${social.iconHover ?? ""}
              `}
            />
          </a>
        );
      })}
    </div>
  );
}

/* ---------------------------------- */
/* Hero Component                     */
/* ---------------------------------- */

export default function Hero({
  eyebrow,
  title,
  subtitle,
  description,
  cta,
  sectionRef,
  onExplore,
  onRevealComplete,
}: HeroProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const socialLinksRef = useRef<HTMLDivElement>(null);

  const [isRevealComplete, setIsRevealComplete] = useState(false);

  /* ---------------------------------- */
  /* Social Icons Animation             */
  /* ---------------------------------- */

  useGSAP(
    () => {
      const socialLinks = socialLinksRef.current;

      if (!socialLinks) return;

      if (!isRevealComplete) {
        gsap.set(socialLinks, {
          autoAlpha: 0,
          x: -24,
        });

        return;
      }

      gsap.to(socialLinks, {
        autoAlpha: 1,
        x: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.fromTo(
        socialLinks.children,
        {
          autoAlpha: 0,
          x: -12,
          scale: 0.85,
        },
        {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.12,
          ease: "back.out(1.5)",
        },
      );
    },
    {
      dependencies: [isRevealComplete],
      revertOnUpdate: true,
    },
  );

  /* ---------------------------------- */
  /* Reveal Completion                  */
  /* ---------------------------------- */

  const handleRevealComplete = () => {
    setIsRevealComplete(true);
    onRevealComplete();
  };

  /* ---------------------------------- */
  /* Render                             */
  /* ---------------------------------- */

  return (
    <section
      id="hero"
      ref={sectionRef}
      data-hero-section
      className="
        relative
        isolate
        h-[100svh]
        min-h-[560px]
        overflow-hidden
        bg-obsidian
        text-ivory
        md:h-screen
        md:min-h-[600px]
      "
    >
      <EagleReveal
        sectionRef={sectionRef}
        overlayRef={overlayRef}
        contentRef={contentRef}
        onRevealComplete={handleRevealComplete}
      />

      {/* Dark Overlay */}

      <div
        ref={overlayRef}
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-10
          bg-black/60
          backdrop-blur-[4px]
        "
        style={{
          opacity: 0,
          visibility: "hidden",
        }}
      />

      {/* Hero Content */}

      <div
        ref={contentRef}
        className="
          pointer-events-none
          absolute
          inset-0
          z-20
          box-border
          flex
          flex-col
          items-center
          justify-center
          px-5
          pt-24
          text-center
          sm:px-8
          sm:pt-28
          md:pt-24
          lg:pt-20
        "
      >
        <p
          data-hero-item
          className="
            mb-4
            font-sans
            text-[10px]
            tracking-[0.3em]
            text-champagne
            sm:mb-5
            sm:text-xs
            md:mb-6
            md:text-sm
            md:tracking-[0.4em]
          "
        >
          {eyebrow}
        </p>

        <div className="mb-6 sm:mb-7 md:mb-8">
          <h1
            data-hero-item
            className="
              font-display
              text-5xl
              font-bold
              leading-[0.9]
              tracking-[-0.07em]
              sm:text-6xl
              md:text-8xl
              lg:text-[10rem]
            "
          >
            {title}
          </h1>

          <h2
            data-hero-item
            className="
              mt-3
              font-display
              text-3xl
              font-bold
              leading-[0.95]
              tracking-[-0.06em]
              text-champagne
              sm:text-4xl
              md:text-6xl
              lg:text-8xl
            "
          >
            {subtitle}
          </h2>
        </div>

        <p
          data-hero-item
          className="
            mb-7
            max-w-[320px]
            font-sans
            text-sm
            leading-relaxed
            text-ivory/80
            sm:mb-8
            sm:max-w-md
            sm:text-base
            md:mb-10
            md:max-w-xl
            md:text-lg
          "
        >
          {description}
        </p>

        <button
          type="button"
          onClick={onExplore}
          data-hero-item
          className="
            pointer-events-auto
            border
            border-champagne
            px-7
            py-3.5
            font-sans
            text-[10px]
            tracking-[0.18em]
            text-ivory
            transition-colors
            duration-300
            hover:bg-champagne
            hover:text-obsidian
            sm:px-8
            sm:py-4
            sm:text-xs
            md:text-sm
            md:tracking-[0.2em]
          "
        >
          {cta}
        </button>

        {/* Scroll to About */}

        <button
          type="button"
          onClick={onExplore}
          aria-label="Scroll to About section"
          data-hero-item
          className="
            pointer-events-auto
            mt-8
            flex
            h-10
            w-10
            items-center
            justify-center
            text-champagne
            transition-colors
            duration-300
            hover:text-[#E8CC8B]
          "
        >
          <svg
            className="
              h-7
              w-7
              animate-bounce
              drop-shadow-[0_0_8px_rgba(200,164,93,0.75)]
            "
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 4v15" />
            <path d="m5 12 7 7 7-7" />
          </svg>
        </button>
      </div>

      {/* Social Links - Visible After Eagle Reveal */}

      <HeroSocialLinks containerRef={socialLinksRef} />
    </section>
  );
}
