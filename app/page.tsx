import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { defaultLocale, locales, type Locale } from "@/i18n/constants";

/**
 * 根据 Accept-Language 头部检测用户偏好的语言
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
    // 如果检测过程中出现错误，返回默认语言
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("[RootPage] Failed to detect locale from headers:", error);
    }
  }

  // 默认返回默认语言
  return defaultLocale;
}

export default async function RootPage() {
  try {
    // 检测用户语言偏好
    const preferredLocale = await detectLocaleFromHeaders();

    // 验证 locale 是否有效
    const validLocale = locales.includes(preferredLocale)
      ? preferredLocale
      : defaultLocale;

    // 服务端重定向到检测到的语言版本
    // redirect 函数会自动处理 307 临时重定向
    redirect(`/${validLocale}`);
  } catch {
    // 如果重定向失败，至少重定向到默认语言
    // 这不应该发生，但作为最后的后备方案
    redirect(`/${defaultLocale}`);
  }
}
