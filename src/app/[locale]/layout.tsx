import type { Metadata } from "next";
import {
  hasLocale,
  NextIntlClientProvider,
} from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import "../globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const isFrench = locale === "fr";

  const title = "AERODEV | Creative Developer";

  const description = isFrench
    ? "AERODEV — Creative Developer. Je conçois et développe des expériences digitales modernes, élégantes et performantes. Beyond the Code. Above the Ordinary."
    : "AERODEV — Creative Developer. I design and build modern, elegant, and high-performance digital experiences. Beyond the Code. Above the Ordinary.";

  const image = {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
    alt: "AERODEV — Creative Developer",
  };

  return {
    metadataBase: new URL("https://aerodev-studio.netlify.app"),

    title,
    description,

    applicationName: "AERODEV",

    keywords: [
      "AERODEV",
      "Creative Developer",
      "Web Developer",
      "Frontend Developer",
      "Next.js",
      "React",
      "Web Design",
      "Web Development",
      "GSAP",
      "Freelance Developer",
    ],

    authors: [
      {
        name: "AERODEV",
      },
    ],

    creator: "AERODEV",
    publisher: "AERODEV",

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",
      siteName: "AERODEV",
      title,
      description,
      locale: isFrench ? "fr_FR" : "en_US",
      alternateLocale: isFrench ? ["en_US"] : ["fr_FR"],
      images: [image],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

export default async function RootLayout({
  children,
  params,
}: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}