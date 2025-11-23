import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { defaultLocale, locales, type Locale } from "@/i18n/constants";

/**
 * 根据 Accept-Language 头部检测用户偏好的语言
 */
async function detectLocaleFromHeaders(): Promise<Locale> {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";

  // 解析 Accept-Language 头部
  // 例如: "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7"
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [code, q = "q=1"] = lang.trim().split(";");
      const quality = parseFloat(q.replace("q=", ""));
      return { code: code.toLowerCase().split("-")[0], quality };
    })
    .sort((a, b) => b.quality - a.quality);

  // 查找支持的语言
  for (const { code } of languages) {
    if (locales.includes(code as Locale)) {
      return code as Locale;
    }
  }

  // 默认返回默认语言
  return defaultLocale;
}

export default async function RootPage() {
  // 检测用户语言偏好
  const preferredLocale = await detectLocaleFromHeaders();

  // 服务端重定向到检测到的语言版本
  // redirect 函数会自动处理 307 临时重定向
  redirect(`/${preferredLocale}`);
}
