import { MetadataRoute } from "next";

// 🚀 移动端优化已启用：Service Worker、触摸优化、性能监控
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";
  
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/manifest.json",
          "/manifest-*.webmanifest",
          "/manifest-*.json"
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/private/",
          "*.json",
          "/search?*",
          // 禁止索引图标文件
          "/icon/",
          "/icon?*",
          "/favicon*",
          "/apple-touch-icon*",
          // 禁止索引测试和开发页面
          "/test*",
          "/dev*",
          "/staging*",
          // 禁止索引备份文件
          "*.backup*",
          "*.tmp*",
          "*.log*",
          // 精确禁止Next.js内部资源，但允许必要的静态文件
          "/_next/static/chunks/",
          "/_next/static/webpack/",
          "/_next/static/css/",
          // 🎯 禁止索引PDF文件
          "/pdf-files/",
          "/downloads/*.pdf",
          "*.pdf",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/manifest.json",
          "/manifest-*.webmanifest",
          "/manifest-*.json"
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/private/",
          "/test*",
          "/dev*",
          "/staging*",
          "/icon/",
          "/icon?*",
          "/favicon*",
          "/apple-touch-icon*",
          "*.backup*",
          "*.tmp*",
          "*.log*",
          // 精确禁止Next.js内部资源
          "/_next/static/chunks/",
          "/_next/static/webpack/",
          "/_next/static/css/",
          // 🎯 禁止索引PDF文件
          "/pdf-files/",
          "/downloads/*.pdf",
          "*.pdf",
          "/search?*",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: [
          "/",
          "/manifest.json",
          "/manifest-*.webmanifest",
          "/manifest-*.json"
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/private/",
          "/test*",
          "/dev*",
          "/staging*",
          "/icon/",
          "/icon?*",
          "/favicon*",
          "/apple-touch-icon*",
          "*.backup*",
          "*.tmp*",
          "*.log*",
          // 精确禁止Next.js内部资源
          "/_next/static/chunks/",
          "/_next/static/webpack/",
          "/_next/static/css/",
          // 🎯 禁止索引PDF文件
          "/pdf-files/",
          "/downloads/*.pdf",
          "*.pdf",
          "/search?*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
