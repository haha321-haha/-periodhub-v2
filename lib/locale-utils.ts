/**
 * Locale 工具函数
 * 提供统一的 locale 验证和处理逻辑
 */

import { locales, defaultLocale, type Locale } from '@/i18n/request';

/**
 * 验证 locale 是否有效
 */
export function isValidLocale(locale: unknown): locale is Locale {
  return typeof locale === 'string' && locales.includes(locale as Locale);
}

/**
 * 获取有效的 locale，如果无效则返回默认值
 */
export function getValidLocale(locale: unknown): Locale {
  if (isValidLocale(locale)) {
    return locale;
  }
  
  // 记录警告（仅在客户端）
  if (typeof window !== 'undefined') {
    console.warn(`[LocaleUtils] Invalid locale '${locale}', falling back to '${defaultLocale}'`);
  }
  
  return defaultLocale;
}

/**
 * 安全地设置请求 locale
 */
export function safeSetRequestLocale(locale: unknown, setRequestLocale: (locale: string) => void): Locale {
  const validLocale = getValidLocale(locale);
  
  try {
    setRequestLocale(validLocale);
  } catch (error) {
    console.error('[LocaleUtils] Failed to set request locale:', error);
    // 尝试设置默认 locale
    try {
      setRequestLocale(defaultLocale);
    } catch (fallbackError) {
      console.error('[LocaleUtils] Failed to set default locale:', fallbackError);
    }
  }
  
  return validLocale;
}

/**
 * 从 URL 路径中提取 locale
 */
export function extractLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (isValidLocale(firstSegment)) {
    return firstSegment;
  }
  
  return null;
}

/**
 * 获取 locale 显示名称
 */
export function getLocaleDisplayName(locale: Locale): string {
  const displayNames = {
    zh: '中文',
    en: 'English'
  };
  
  return displayNames[locale] || locale;
}

/**
 * 检查是否为 RTL 语言
 */
export function isRTL(locale: Locale): boolean {
  // 目前支持的语言都不是 RTL，但为将来扩展做准备
  return false;
}

/**
 * 获取 locale 的 HTML lang 属性值
 */
export function getHTMLLang(locale: Locale): string {
  const htmlLangs = {
    zh: 'zh-CN',
    en: 'en-US'
  };
  
  return htmlLangs[locale] || locale;
}



