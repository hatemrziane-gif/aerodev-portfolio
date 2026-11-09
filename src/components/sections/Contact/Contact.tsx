
"use client";

import { useRef, useState } from "react";
import type { SyntheticEvent, FormEvent } from "react";
import { useTranslations } from "next-intl";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  ArrowUpRight,
  CodeXml,
  BriefcaseBusiness,
  Mail,
  Send,
} from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ContactProps = {
  onContactEnter: () => void;
  onContactLeave: () => void;
};

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xrppvvnl";
const contactEmail = "hatemrziane@gmail.com";

export default function Contact({
  onContactEnter,
  onContactLeave,
}: ContactProps) {
  const t = useTranslations("Contact");

  const sectionRef = useRef<HTMLElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const pinTriggerRef = useRef<ScrollTrigger | null>(null);

  const previousOverflowRef = useRef<{
    html: string;
    body: string;
  } | null>(null);

  const hasPlayedRef = useRef(false);
  const videoFinishedRef = useRef(false);

  const [videoStarted, setVideoStarted] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<
    "success" | "error" | null
  >(null);

  /* ---------------------------------- */
  /* Lock Page Scroll During Video      */
  /* ---------------------------------- */

  const lockScroll = () => {
    if (previousOverflowRef.current) return;

    previousOverflowRef.current = {
      html: document.documentElement.style.overflow,
      body: document.body.style.overflow,
    };

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  };

  /* ---------------------------------- */
  /* Unlock Page Scroll                 */
  /* ---------------------------------- */

  const unlockScroll = () => {
    if (!previousOverflowRef.current) return;

    document.documentElement.style.overflow =
      previousOverflowRef.current.html;

    document.body.style.overflow =
      previousOverflowRef.current.body;

    previousOverflowRef.current = null;
  };

  /* ---------------------------------- */
  /* Finish Video                       */
  /* ---------------------------------- */

  const finishVideo = () => {
    if (videoFinishedRef.current) return;

    videoFinishedRef.current = true;
    hasPlayedRef.current = true;

    setShowContent(true);
    setVideoCompleted(true);

    unlockScroll();

    const pinTrigger = pinTriggerRef.current;

    if (pinTrigger) {
      pinTrigger.kill(true);
      pinTriggerRef.current = null;

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        ScrollTrigger.update();
      });
    }
  };

  /* ---------------------------------- */
  /* Video Events                       */
  /* ---------------------------------- */

  const handleVideoPlaying = (
    event: SyntheticEvent<HTMLVideoElement>,
  ) => {
    if (event.currentTarget !== activeVideoRef.current) {
      return;
    }

    // Remove the black screen only after playback really starts.
    setVideoStarted(true);
  };

  const handleVideoEnded = (
    event: SyntheticEvent<HTMLVideoElement>,
  ) => {
    if (event.currentTarget !== activeVideoRef.current) {
      return;
    }

    finishVideo();
  };

  const handleVideoTimeUpdate = (
    event: SyntheticEvent<HTMLVideoElement>,
  ) => {
    const video = event.currentTarget;

    if (
      video === activeVideoRef.current &&
      video.duration &&
      video.duration - video.currentTime <= 2
    ) {
      setShowContent(true);
    }
  };

  /* ---------------------------------- */
  /* Contact ScrollTrigger              */
  /* ---------------------------------- */

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section) return;

      /*
       * This trigger only controls Navbar visibility.
       * It does NOT lock the page scroll.
       */
      const visibilityTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        end: "bottom top",

        onEnter: onContactEnter,
        onEnterBack: onContactEnter,

        onLeave: onContactLeave,
        onLeaveBack: onContactLeave,
      });

      /*
       * Start the video only when Contact reaches
       * the top of the viewport and fills the screen.
       */
      const startVideo = () => {
        if (
          hasPlayedRef.current ||
          videoFinishedRef.current
        ) {
          return;
        }

        const isMobile = window.matchMedia(
          "(max-width: 767px)",
        ).matches;

        const video = isMobile
          ? mobileVideoRef.current
          : desktopVideoRef.current;

        if (!video) {
          finishVideo();
          return;
        }

        activeVideoRef.current = video;
        videoFinishedRef.current = false;

        setVideoStarted(false);

        video.currentTime = 0;

        // Lock page scroll only at the exact start of the video.
        lockScroll();

        hasPlayedRef.current = true;

        video.play().catch((error) => {
          console.error(
            "Contact video playback error:",
            error,
          );

          finishVideo();
        });
      };

      const pinTrigger = ScrollTrigger.create({
        trigger: section,

        // Let the user scroll normally until Contact
        // reaches the top of the viewport.
        start: "top top",

        // Keep Contact pinned while the video is playing.
        end: () => `+=${window.innerHeight * 2}`,

        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,

        onEnter: startVideo,
        onEnterBack: startVideo,
      });

      pinTriggerRef.current = pinTrigger;

      return () => {
        unlockScroll();

        desktopVideoRef.current?.pause();
        mobileVideoRef.current?.pause();

        pinTrigger.kill();
        visibilityTrigger.kill();

        if (pinTriggerRef.current === pinTrigger) {
          pinTriggerRef.current = null;
        }
      };
    },
    {
      scope: sectionRef,
      dependencies: [onContactEnter, onContactLeave],
    },
  );

  /* ---------------------------------- */
  /* Contact Panel Animation            */
  /* ---------------------------------- */

  useGSAP(
    () => {
      if (!showContent || !contentRef.current) return;

      gsap.fromTo(
        contentRef.current,
        {
          autoAlpha: 0,
          y: 40,
          scale: 0.97,
          filter: "blur(12px)",
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power3.out",
        },
      );
    },
    {
      scope: sectionRef,
      dependencies: [showContent],
    },
  );

  /* ---------------------------------- */
  /* Form Submission                    */
  /* ---------------------------------- */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const form = event.currentTarget;

    setIsSubmitting(true);
    setFormStatus(null);

    try {
      const formData = new FormData(form);

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Message could not be sent");
      }

      const result = await response.json();

      if (result.ok === false || result.errors?.length) {
        throw new Error("Message could not be sent");
      }

      setFormStatus("success");
      form.reset();
    } catch (error) {
      console.error("Formspree error:", error);
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------------------------- */
  /* Render                             */
  /* ---------------------------------- */

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="
        relative z-30 isolate
        h-[100svh] min-h-0
        w-full
        overflow-hidden
        bg-black
        text-[#F1EEE6]
      "
    >
      {/* Desktop Video */}

      <video
        ref={desktopVideoRef}
        className="
          absolute inset-0
          hidden h-full w-full
          object-cover
          md:block
        "
        src="/videos/contact-desktop.mp4"
        muted
        playsInline
        preload="metadata"
        onPlaying={handleVideoPlaying}
        onTimeUpdate={handleVideoTimeUpdate}
        onEnded={handleVideoEnded}
        onError={handleVideoEnded}
        aria-hidden="true"
      />

      {/* Mobile Video */}

      <video
        ref={mobileVideoRef}
        className="
          absolute inset-0
          block h-full w-full
          object-cover
          md:hidden
        "
        src="/videos/contact-mobile.mp4"
        muted
        playsInline
        preload="metadata"
        onPlaying={handleVideoPlaying}
        onTimeUpdate={handleVideoTimeUpdate}
        onEnded={handleVideoEnded}
        onError={handleVideoEnded}
        aria-hidden="true"
      />

      {/* Black Screen Before Video Starts */}

      <div
        className={`
          absolute inset-0 z-[1]
          bg-black
          transition-opacity duration-300
          ${videoStarted ? "pointer-events-none opacity-0" : "opacity-100"}
        `}
        aria-hidden="true"
      />

      {/* Dark Cinematic Overlay */}

      <div
        className="
          pointer-events-none
          absolute inset-0 z-[2]
          bg-gradient-to-b
          from-[#050505]/25
          via-[#050505]/20
          to-[#050505]/80
        "
      />

      {/* Floating Social Icons */}

      <div
        className={`
          absolute left-0 top-1/2 z-20
          hidden -translate-y-1/2
          flex-col gap-4
          transition-opacity duration-500
          md:flex
          ${
            videoStarted
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      >
        {/* Facebook */}

        <a
          href="https://www.facebook.com/share/1FGwN5L2aW/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="
            flex h-12 w-14
            -translate-x-3
            items-center justify-center
            border border-white/10
            bg-black/20
            text-white/35
            backdrop-blur-md
            transition-all duration-500
            hover:translate-x-0
            hover:border-[#1877F2]/50
            hover:text-[#1877F2]
            hover:shadow-[0_0_25px_rgba(24,119,242,0.2)]
          "
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-current"
            aria-hidden="true"
          >
            <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" />
          </svg>
        </a>

        {/* Instagram */}

        <a
          href="https://www.instagram.com/aerodev.web/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="
            flex h-12 w-14
            -translate-x-3
            items-center justify-center
            border border-white/10
            bg-black/20
            text-white/35
            backdrop-blur-md
            transition-all duration-500
            hover:translate-x-0
            hover:border-[#E4405F]/50
            hover:text-[#E4405F]
            hover:shadow-[0_0_25px_rgba(228,64,95,0.2)]
          "
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-none stroke-current"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle
              cx="17.5"
              cy="6.5"
              r="1"
              className="fill-current stroke-none"
            />
          </svg>
        </a>
      </div>

      {/* Contact Content */}

      <div
        className="
          relative z-10
          flex h-full
          items-center justify-center
          px-4 py-14
          sm:px-6
          lg:px-12
        "
      >
        <div
          ref={contentRef}
          tabIndex={0}
          className={`
            invisible
            w-full max-w-6xl
            max-h-[calc(100svh-7rem)]
            ${
              videoCompleted
                ? "overflow-y-auto overscroll-y-auto touch-pan-y"
                : "overflow-hidden"
            }
            border border-[#C58B2D]/40
            bg-[#090B0F]/75
            p-5
            opacity-0
            shadow-[0_0_80px_rgba(0,0,0,0.45)]
            backdrop-blur-xl
            sm:p-8
            lg:p-10
          `}
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          {/* Header */}

          <div className="mb-8 flex items-center justify-between">
            <p
              className="
                text-[10px] font-medium uppercase
                tracking-[0.3em] text-[#C58B2D]
                sm:text-xs
              "
            >
              {t("eyebrow")}
            </p>

            <span
              className="
                text-[10px] tracking-[0.2em]
                text-[#F1EEE6]/40
              "
            >
              05 / CONTACT
            </span>
          </div>

          {/* Main Grid */}

          <div
            className="
              grid grid-cols-1 gap-10
              lg:grid-cols-2 lg:gap-14
            "
          >
            {/* Left Side */}

            <div className="flex flex-col">
              <h2
                className="
                  max-w-xl
                  text-3xl font-semibold
                  leading-tight tracking-tight
                  sm:text-4xl
                  md:text-5xl
                "
              >
                {t("title")}
              </h2>

              <p
                className="
                  mt-5 max-w-md
                  text-sm leading-7
                  text-[#F1EEE6]/65
                  sm:text-base
                "
              >
                {t("description")}
              </p>

              {/* Contact Links */}

              <div className="mt-10">
                <p
                  className="
                    mb-5 text-[10px]
                    font-medium uppercase
                    tracking-[0.25em]
                    text-[#C58B2D]
                  "
                >
                  {t("contactInfo")}
                </p>

                <div className="flex flex-col">
                  {/* Email */}

                  <a
                    href={`mailto:${contactEmail}`}
                    className="
                      group flex items-center
                      justify-between border-b
                      border-[#F1EEE6]/15
                      py-4 text-sm
                      text-[#F1EEE6]/80
                      transition-colors duration-300
                      hover:text-[#EA4335]
                    "
                  >
                    <span className="flex items-center gap-3">
                      <Mail size={17} />
                      {contactEmail}
                    </span>

                    <ArrowUpRight
                      size={18}
                      className="
                        transition-transform duration-300
                        group-hover:-translate-y-1
                        group-hover:translate-x-1
                      "
                    />
                  </a>

                  {/* LinkedIn */}

                  <a
                    href="https://www.linkedin.com/in/hatem-ziane-37b719405/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      group flex items-center
                      justify-between border-b
                      border-[#F1EEE6]/15
                      py-4 text-sm
                      text-[#F1EEE6]/80
                      transition-colors duration-300
                      hover:text-[#0A66C2]
                    "
                  >
                    <span className="flex items-center gap-3">
                      <BriefcaseBusiness size={17} />
                      LinkedIn
                    </span>

                    <ArrowUpRight
                      size={18}
                      className="
                        transition-transform duration-300
                        group-hover:-translate-y-1
                        group-hover:translate-x-1
                      "
                    />
                  </a>

                  {/* GitHub */}

                  <a
                    href="https://github.com/hatemrziane-gif"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      group flex items-center
                      justify-between border-b
                      border-[#F1EEE6]/15
                      py-4 text-sm
                      text-[#F1EEE6]/80
                      transition-colors duration-300
                      hover:text-white
                    "
                  >
                    <span className="flex items-center gap-3">
                      <CodeXml size={17} />
                      GitHub
                    </span>

                    <ArrowUpRight
                      size={18}
                      className="
                        transition-transform duration-300
                        group-hover:-translate-y-1
                        group-hover:translate-x-1
                      "
                    />
                  </a>
                </div>
              </div>

              {/* Location */}

              <div
                className="
                  mt-8 flex flex-wrap
                  items-center justify-between gap-3
                  text-[10px] uppercase
                  tracking-[0.15em]
                  text-[#F1EEE6]/45
                "
              >
                <span>{t("location")}</span>
                <span>{t("availability")}</span>
              </div>
            </div>

            {/* Right Side - Form */}

            <div>
              <div
                className="
                  mb-6 flex items-center
                  justify-between
                "
              >
                <p
                  className="
                    text-[10px] font-medium
                    uppercase tracking-[0.25em]
                    text-[#C58B2D]
                  "
                >
                  {t("startProject")}
                </p>

                <Send
                  size={17}
                  className="text-[#C58B2D]"
                />
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
              >
                {/* Honeypot */}

                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                {/* Subject */}

                <input
                  type="hidden"
                  name="_subject"
                  value="New AERODEV project inquiry"
                />

                {/* Name */}

                <div>
                  <label
                    htmlFor="contact-name"
                    className="
                      mb-2 block text-xs
                      text-[#F1EEE6]/65
                    "
                  >
                    {t("name")}
                  </label>

                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="name"
                    placeholder={t("namePlaceholder")}
                    className="
                      w-full border border-[#F1EEE6]/20
                      bg-[#F1EEE6]/[0.04]
                      px-4 py-3 text-sm
                      text-[#F1EEE6]
                      outline-none
                      placeholder:text-[#F1EEE6]/30
                      transition-colors duration-300
                      focus:border-[#C58B2D]
                    "
                  />
                </div>

                {/* Email */}

                <div>
                  <label
                    htmlFor="contact-email"
                    className="
                      mb-2 block text-xs
                      text-[#F1EEE6]/65
                    "
                  >
                    {t("email")}
                  </label>

                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    placeholder={t("emailPlaceholder")}
                    className="
                      w-full border border-[#F1EEE6]/20
                      bg-[#F1EEE6]/[0.04]
                      px-4 py-3 text-sm
                      text-[#F1EEE6]
                      outline-none
                      placeholder:text-[#F1EEE6]/30
                      transition-colors duration-300
                      focus:border-[#C58B2D]
                    "
                  />
                </div>

                {/* Project Details */}

                <div>
                  <label
                    htmlFor="contact-message"
                    className="
                      mb-2 block text-xs
                      text-[#F1EEE6]/65
                    "
                  >
                    {t("projectDetails")}
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    minLength={10}
                    maxLength={3000}
                    rows={4}
                    placeholder={t("messagePlaceholder")}
                    className="
                      w-full resize-none
                      border border-[#F1EEE6]/20
                      bg-[#F1EEE6]/[0.04]
                      px-4 py-3 text-sm
                      text-[#F1EEE6]
                      outline-none
                      placeholder:text-[#F1EEE6]/30
                      transition-colors duration-300
                      focus:border-[#C58B2D]
                    "
                  />
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    group flex w-full
                    items-center justify-between
                    bg-[#C58B2D] px-5 py-4
                    text-xs font-semibold
                    uppercase tracking-[0.15em]
                    text-[#090B0F]
                    transition-colors duration-300
                    hover:bg-[#E8B45D]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  <span>
                    {isSubmitting
                      ? t("sending")
                      : t("sendMessage")}
                  </span>

                  <ArrowUpRight
                    size={18}
                    className="
                      transition-transform duration-300
                      group-hover:-translate-y-1
                      group-hover:translate-x-1
                    "
                  />
                </button>

                {/* Form Feedback */}

                {formStatus === "success" && (
                  <p
                    role="status"
                    className="text-sm text-green-400"
                  >
                    {t("success")}
                  </p>
                )}

                {formStatus === "error" && (
                  <p
                    role="alert"
                    className="text-sm text-red-400"
                  >
                    {t("error")}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Bottom Divider */}

          <div
            className="
              mt-10 h-px w-full
              bg-gradient-to-r
              from-[#C58B2D]/70
              to-transparent
            "
          />

          <p
            className="
              mt-5 text-[10px]
              uppercase tracking-[0.2em]
              text-[#E8B45D]/70
            "
          >
            {t("closing")}
          </p>
        </div>
      </div>
    </section>
  );
}
