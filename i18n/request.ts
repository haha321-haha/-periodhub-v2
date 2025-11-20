import { getRequestConfig } from "next-intl/server";
import { defaultLocale, Locale, locales } from "./constants";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = (await requestLocale) ?? defaultLocale;

  if (!locales.includes(locale as Locale)) {
    console.warn(
      "[i18n] Invalid locale provided, falling back to default:",
      locale,
      defaultLocale,
    );
    locale = defaultLocale;
  }

  const validLocale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  let messages;
  try {
    messages = (await import(`../messages/${validLocale}.json`)).default;
  } catch (importError) {
    console.error(
      `[i18n] Failed to load messages for ${validLocale}:`,
      importError,
    );
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
});
