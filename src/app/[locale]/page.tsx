
import { getTranslations } from "next-intl/server";
import HomeExperience from "@/components/sections/HomeExperience";

export default async function HomePage() {
  const t = await getTranslations("Hero");

  return (
    <HomeExperience
      eyebrow={t("eyebrow")}
      title={t("title")}
      subtitle={t("subtitle")}
      description={t("description")}
      cta={t("cta")}
    />
  );
}
