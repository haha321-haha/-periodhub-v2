import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = "zh";

export default getRequestConfig(async ({ requestLocale }) => {
  try {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // 增强的 locale 验证和错误处理
    if (!locale) {
      console.warn("[i18n] No locale provided, using default:", defaultLocale);
      locale = defaultLocale;
    } else if (!locales.includes(locale as any)) {
      // 🎯 特殊处理：如果locale是图片文件名或包含图片扩展名，直接使用默认locale
      if (locale.includes('.jpg') || locale.includes('.jpeg') || locale.includes('.png') || 
          locale.includes('.gif') || locale.includes('.webp') || locale.includes('.svg')) {
        console.warn(
          "[i18n] Locale appears to be an image filename:",
          locale,
          "falling back to:",
          defaultLocale,
        );
      } else {
        console.warn(
          "[i18n] Invalid locale provided:",
          locale,
          "falling back to:",
          defaultLocale,
        );
      }
      locale = defaultLocale;
    }

    // 确保 locale 是有效的类型
    const validLocale = locales.includes(locale as any)
      ? locale
      : defaultLocale;

    // 动态导入消息文件，添加错误处理
    let messages;
    try {
      messages = (await import(`../messages/${validLocale}.json`)).default;
    } catch (importError) {
      console.error(
        `[i18n] Failed to import messages for locale ${validLocale}:`,
        importError,
      );
      // 回退到默认语言的消息
      messages = (await import(`../messages/${defaultLocale}.json`)).default;
    }

    return {
      locale: validLocale,
      messages,
      timeZone: "Asia/Shanghai",
      now: new Date(),
      formats: {
        dateTime: {
          short: {
            day: "numeric",
            month: "short",
            year: "numeric",
          },
        },
        number: {
          precise: {
            maximumFractionDigits: 5,
          },
        },
        list: {
          enumeration: {
            style: "long",
            type: "conjunction",
          },
        },
      },
    };
  } catch (error) {
    console.error("[i18n] Error in getRequestConfig:", error);
    // 返回安全的默认配置
    return {
      locale: defaultLocale,
      messages: (await import(`../messages/${defaultLocale}.json`)).default,
      timeZone: "Asia/Shanghai",
      now: new Date(),
      formats: {
        dateTime: {
          short: {
            day: "numeric",
            month: "short",
            year: "numeric",
          },
        },
        number: {
          precise: {
            maximumFractionDigits: 5,
          },
        },
        list: {
          enumeration: {
            style: "long",
            type: "conjunction",
          },
        },
      },
    };
  }
});
