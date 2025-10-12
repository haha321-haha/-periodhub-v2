/**
 * 动态Manifest生成器（当前未使用）
 *
 * 📝 设计决策说明：
 * 当前使用静态文件 public/manifest.webmanifest 作为manifest源。
 * 此文件保留作为未来参考，暂不启用。
 *
 * 🎯 为什么不使用动态方案：
 * 1. 静态方案已完全满足需求（ROI最优）
 * 2. 避免与next-intl middleware冲突（稳定性优先）
 * 3. 静态文件性能更优（CDN缓存）
 * 4. 多语言manifest的实际用户价值有限
 *
 * 🔄 何时重新评估：
 * - 英文用户占比超过30%
 * - Next.js改进 app/[locale]/manifest.ts 支持
 * - 出现明确的业务需求
 *
 * 📚 详细分析见: MANIFEST_DYNAMIC_ROUTING_ANALYSIS.md
 *
 * @created 2025-10-13
 * @status INACTIVE - Using static fallback
 * @see public/manifest.webmanifest
 */

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
