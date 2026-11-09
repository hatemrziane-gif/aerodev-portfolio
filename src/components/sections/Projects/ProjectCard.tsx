
"use client";

import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";

import type { UpcomingProjectData } from "./projects.data";

type ProjectCardProps = {
  project: UpcomingProjectData;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations("Projects");

  return (
    <article className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-sm border border-obsidian/10 bg-white/40 p-7 transition-all duration-500 hover:border-gold/50 hover:bg-white/70 md:p-9">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-gold/10 transition-transform duration-700 group-hover:scale-125" />

      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-gold/10" />

      {/* Top */}
      <div className="relative flex items-center justify-between">
        <span className="text-[10px] font-medium tracking-[0.25em] text-obsidian/40">
          {project.number} / {t("upcomingLabel")}
        </span>

        <Sparkles className="h-5 w-5 text-gold/70 transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110" />
      </div>

      {/* Center */}
      <div className="relative mt-12">
        <h3 className="font-display text-3xl text-obsidian/70 md:text-4xl">
          {t("comingSoon")}
          <span className="text-gold">.</span>
        </h3>

        <p className="mt-3 max-w-sm text-sm leading-7 text-obsidian/45">
          {t("upcomingDescription")}
        </p>
      </div>

      {/* Bottom */}
      <div className="relative mt-8 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />

        <span className="text-[9px] uppercase tracking-[0.2em] text-obsidian/40">
          AERODEV
        </span>
      </div>
    </article>
  );
}
