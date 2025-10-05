import { URL_CONFIG } from "@/lib/url-config";

// Canonical URL 配置
export const getCanonicalUrl = (locale: string, path: string) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}/${locale}${cleanPath}`;
};

// Hreflang 配置
export const getHreflangUrls = (path: string) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return {
    "zh-CN": `${baseUrl}/zh${cleanPath}`,
    "en-US": `${baseUrl}/en${cleanPath}`,
    "x-default": `${baseUrl}/zh${cleanPath}`,
  };
};
