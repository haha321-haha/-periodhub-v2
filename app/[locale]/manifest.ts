import { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function manifest({
  params,
}: Props): Promise<MetadataRoute.Manifest> {
  const { locale } = await params;

  // 验证locale值
  const validLocale = ["zh", "en"].includes(locale) ? locale : "zh";

  // 获取翻译
  const t = await getTranslations({
    locale: validLocale,
    namespace: "manifest",
  });

  return {
    name: t("name"),
    short_name: t("shortName"),
    description: t("description"),
    start_url: `/${validLocale}`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#9333ea",
    orientation: "portrait",
    categories: ["health", "medical", "lifestyle"],
    lang: validLocale === "zh" ? "zh-CN" : "en-US",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: t("shortcuts.immediateRelief.name"),
        short_name: t("shortcuts.immediateRelief.shortName"),
        description: t("shortcuts.immediateRelief.description"),
        url: `/${validLocale}/immediate-relief`,
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: t("shortcuts.articles.name"),
        short_name: t("shortcuts.articles.shortName"),
        description: t("shortcuts.articles.description"),
        url: `/${validLocale}/downloads`,
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: t("shortcuts.tools.name"),
        short_name: t("shortcuts.tools.shortName"),
        description: t("shortcuts.tools.description"),
        url: `/${validLocale}/interactive-tools`,
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
