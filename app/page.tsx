import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { defaultLocale, locales, type Locale } from "@/i18n/constants";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Period Hub - Health & Wellness",
    description: "Your comprehensive health and wellness platform",
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * 根据 Accept-Language 头部检测用户偏好的语言
 * 使用更安全的错误处理，确保即使出错也能返回默认语言
 */
async function detectLocaleFromHeaders(): Promise<Locale> {
  try {
    const headersList = await headers();
    const acceptLanguage = headersList.get("accept-language") || "";

    // 如果没有 Accept-Language 头部，返回默认语言
    if (!acceptLanguage) {
      return defaultLocale;
    }

    // 解析 Accept-Language 头部
    // 例如: "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7"
    const languages = acceptLanguage
      .split(",")
      .map((lang) => {
        try {
          const [code, q = "q=1"] = lang.trim().split(";");
          const quality = parseFloat(q.replace("q=", "")) || 1;
          return { code: code.toLowerCase().split("-")[0], quality };
        } catch {
          // 如果解析失败，返回低优先级
          return { code: lang.trim().toLowerCase().split("-")[0], quality: 0 };
        }
      })
      .filter((lang) => lang.code && lang.quality > 0)
      .sort((a, b) => b.quality - a.quality);

    // 查找支持的语言
    for (const { code } of languages) {
      if (locales.includes(code as Locale)) {
        return code as Locale;
      }
    }
  } catch (error) {
    // 如果检测过程中出现任何错误，返回默认语言
    // 不记录错误，避免在生产环境中产生噪音
    // 静默失败，确保页面能正常重定向
  }

  // 默认返回默认语言
  return defaultLocale;
}

/**
 * 根路径页面 - 根据用户语言偏好重定向到对应的语言版本
 *
 * 使用 Next.js 的 redirect() 函数进行服务器端重定向，更可靠
 */
export default async function RootPage() {
  // 检测用户语言偏好
  let preferredLocale: Locale;

  try {
    preferredLocale = await detectLocaleFromHeaders();
  } catch {
    // 如果检测失败，使用默认语言
    preferredLocale = defaultLocale;
  }

  // 确保 locale 是有效的
  const validLocale = locales.includes(preferredLocale)
    ? preferredLocale
    : defaultLocale;

  // 使用 Next.js 的 redirect() 函数进行服务器端重定向
  // 这会返回 307 临时重定向，对 SEO 友好
  redirect(`/${validLocale}`);
}
