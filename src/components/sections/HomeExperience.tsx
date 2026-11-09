
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "@/components/sections/Hero";
import About from "@/components/about/About";
import Navbar from "@/components/Navbar/Navbar";
import Projects from "./Projects/Projects";
import Contact from "./Contact/Contact";
import Expertise from "./Expertise";
import TechStack from "@/components/sections/TechStack";
import Footer from "@/components/sections/Footer";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type HomeExperienceProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
};

type NavbarTheme = "dark" | "light";

const STORAGE_KEYS = {
  eagleCompleted: "aerodev-eagle-reveal-completed",
  scrollPosition: "aerodev-home-scroll-position",
  aboutVisible: "aerodev-about-visible",
  restoreScroll: "aerodev-restore-scroll",
} as const;

export default function HomeExperience({
  eyebrow,
  title,
  subtitle,
  description,
  cta,
}: HomeExperienceProps) {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const navbarThemeRef = useRef<NavbarTheme>("dark");
  const savedScrollRef = useRef<number | null>(null);
  const restoreAboutRef = useRef(false);

  const unlockScrollRef = useRef<(() => void) | null>(null);

  const [heroReady, setHeroReady] = useState(false);
  const [aboutReady, setAboutReady] = useState(false);
  const [aboutSkipReveal, setAboutSkipReveal] = useState(false);

  const [navbarTheme, setNavbarTheme] =
    useState<NavbarTheme>("dark");

  const [navbarVisible, setNavbarVisible] = useState(true);

  /* ---------------------------------- */
  /* Scroll Lock During Eagle Reveal    */
  /* ---------------------------------- */

  useEffect(() => {
    let eagleCompleted = false;
    let shouldRestore = false;
    let aboutWasVisible = false;

    try {
      eagleCompleted =
        sessionStorage.getItem(STORAGE_KEYS.eagleCompleted) === "true";

      shouldRestore =
        sessionStorage.getItem(STORAGE_KEYS.restoreScroll) === "true";

      aboutWasVisible =
        sessionStorage.getItem(STORAGE_KEYS.aboutVisible) === "true";
    } catch {
      // Session storage may be unavailable.
    }

    if (eagleCompleted || (shouldRestore && aboutWasVisible)) {
      return;
    }

    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    const previousHtmlOverscroll = html.style.overscrollBehavior;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    let unlocked = false;

    const unlockScroll = () => {
      if (unlocked) return;

      unlocked = true;

      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;

      html.style.overscrollBehavior = previousHtmlOverscroll;
      body.style.overscrollBehavior = previousBodyOverscroll;

      if (unlockScrollRef.current === unlockScroll) {
        unlockScrollRef.current = null;
      }
    };

    unlockScrollRef.current = unlockScroll;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";

    return unlockScroll;
  }, []);

  /* ---------------------------------- */
  /* Restore Scroll After Locale Change */
  /* ---------------------------------- */

  useEffect(() => {
    let shouldRestore = false;

    try {
      shouldRestore =
        sessionStorage.getItem(STORAGE_KEYS.restoreScroll) === "true";
    } catch {
      return;
    }

    if (!shouldRestore) return;

    const savedScroll = Number(
      sessionStorage.getItem(STORAGE_KEYS.scrollPosition),
    );

    const eagleCompleted =
      sessionStorage.getItem(STORAGE_KEYS.eagleCompleted) === "true";

    const aboutWasVisible =
      sessionStorage.getItem(STORAGE_KEYS.aboutVisible) === "true";

    if (Number.isFinite(savedScroll) && savedScroll >= 0) {
      savedScrollRef.current = savedScroll;
    }

    restoreAboutRef.current = aboutWasVisible;

    if (eagleCompleted || aboutWasVisible) {
      setHeroReady(true);
    }

    if (aboutWasVisible) {
      setAboutReady(true);
      setAboutSkipReveal(true);

      navbarThemeRef.current = "light";
      setNavbarTheme("light");
    }
  }, []);

  /* ---------------------------------- */
  /* Eagle Reveal Completed             */
  /* ---------------------------------- */

  const handleRevealComplete = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.eagleCompleted, "true");
    } catch {
      // Session storage may be unavailable.
    }

    unlockScrollRef.current?.();

    setHeroReady(true);
  }, []);

  /* ---------------------------------- */
  /* Navbar Theme                       */
  /* ---------------------------------- */

  const setTheme = useCallback((theme: NavbarTheme) => {
    if (navbarThemeRef.current === theme) return;

    navbarThemeRef.current = theme;
    setNavbarTheme(theme);
  }, []);

  /* ---------------------------------- */
  /* Navbar Visibility                  */
  /* ---------------------------------- */

  const handleContactEnter = useCallback(() => {
    setNavbarVisible(false);
  }, []);

  const handleContactLeave = useCallback(() => {
    setNavbarVisible(true);
  }, []);

  /* ---------------------------------- */
  /* Navigate To About                  */
  /* ---------------------------------- */

  const handleExplore = useCallback(() => {
    if (!heroReady) return;

    const trigger = ScrollTrigger.getById("hero-about-transition");

    if (!trigger) return;

    window.scrollTo({
      top: trigger.end,
      behavior: "smooth",
    });
  }, [heroReady]);

  /* ---------------------------------- */
  /* Hero -> About Transition           */
  /* ---------------------------------- */

  useGSAP(
    () => {
      if (!heroReady) return;

      const stage = stageRef.current;
      const hero = heroRef.current;
      const container = containerRef.current;

      if (!stage || !hero || !container) return;

      const about = container.querySelector<HTMLElement>(
        "[data-about-section]",
      );

      if (!about) {
        console.error(
          "HomeExperience: About section element is missing.",
        );

        return;
      }

      /* ---------------------------------- */
      /* Initial Layout                     */
      /* ---------------------------------- */

      gsap.set(hero, {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
      });

      gsap.set(about, {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 2,
        yPercent: 100,
        autoAlpha: 1,
        backgroundColor: "#F1EEE6",
      });

      /* ---------------------------------- */
      /* Scroll-Linked Timeline             */
      /* ---------------------------------- */

      const transition = gsap.timeline({
        onUpdate: () => {
          const progress = transition.progress();

          setTheme(progress >= 0.5 ? "light" : "dark");

          if (progress >= 0.99) {
            setAboutReady(true);
          }
        },

        onComplete: () => {
          setTheme("light");
          setAboutReady(true);
        },

        onReverseComplete: () => {
          setTheme("dark");
          setAboutReady(false);
        },

        scrollTrigger: {
          id: "hero-about-transition",
          trigger: stage,
          start: "top top",
          end: "+=120%",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 0,
          invalidateOnRefresh: true,
          refreshPriority: 1,
        },
      });

      transition.to(about, {
        yPercent: 0,
        duration: 1,
        ease: "none",
      });

      /* ---------------------------------- */
      /* Restore About After Locale Change  */
      /* ---------------------------------- */

      if (restoreAboutRef.current) {
        transition.progress(1);

        gsap.set(about, {
          yPercent: 0,
        });

        setTheme("light");
        setAboutReady(true);
        setAboutSkipReveal(true);

        restoreAboutRef.current = false;
      }

      /* ---------------------------------- */
      /* Refresh Scroll Positions           */
      /* ---------------------------------- */

      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      /* ---------------------------------- */
      /* Restore Previous Scroll Position  */
      /* ---------------------------------- */

      const savedScroll = savedScrollRef.current;

      if (savedScroll !== null) {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: savedScroll,
            behavior: "auto",
          });

          ScrollTrigger.refresh();
          ScrollTrigger.update();

          savedScrollRef.current = null;

          try {
            sessionStorage.removeItem(STORAGE_KEYS.scrollPosition);
            sessionStorage.removeItem(STORAGE_KEYS.aboutVisible);
            sessionStorage.removeItem(STORAGE_KEYS.restoreScroll);
          } catch {
            // Session storage may be unavailable.
          }
        });
      }

      return () => {
        transition.scrollTrigger?.kill();
        transition.kill();
      };
    },
    {
      scope: containerRef,
      dependencies: [heroReady, setTheme],
      revertOnUpdate: true,
    },
  );

  /* ---------------------------------- */
  /* Render                             */
  /* ---------------------------------- */

  return (
    <main
      ref={containerRef}
      className="relative isolate bg-[#F1EEE6]"
    >
      <Navbar
        onAboutClick={handleExplore}
        theme={navbarTheme}
        visible={heroReady && navbarVisible}
      />

      {/* Hero + About Transition Stage */}

      <div
        ref={stageRef}
        className="
          relative
          h-[100svh]
          min-h-[560px]
          overflow-hidden
          bg-obsidian
        "
      >
        <Hero
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          description={description}
          cta={cta}
          sectionRef={heroRef}
          onExplore={handleExplore}
          onRevealComplete={handleRevealComplete}
        />

        <About
          isReady={aboutReady}
          skipReveal={aboutSkipReveal}
        />
      </div>

      <Projects />

      <Expertise />

      <TechStack />

      <Contact
        onContactEnter={handleContactEnter}
        onContactLeave={handleContactLeave}
      />

      <Footer />
    </main>
  );
}
