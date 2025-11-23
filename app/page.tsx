import { headers } from "next/headers";
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
 * 检测是否是Vercel预览请求（用于生成预览截图）
 * 增强检测逻辑，覆盖更多Vercel预览场景
 */
async function isVercelPreviewRequest(): Promise<boolean> {
  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const referer = headersList.get("referer") || "";
    const xForwardedFor = headersList.get("x-forwarded-for") || "";

    // Vercel环境变量检测
    const isVercelEnvironment = process.env.VERCEL === "1";
    const isVercelPreviewEnv = process.env.VERCEL_ENV === "preview";
    const hasVercelId = !!headersList.get("x-vercel-id");

    // 检测常见的预览服务User-Agent
    const previewAgents = [
      "vercel",
      "screenshot",
      "headless",
      "puppeteer",
      "playwright",
      "chromium",
      "bot",
      "crawler",
      "firefox/92.0", // Vercel截图使用的Firefox版本
      "firefox/", // 更通用的Firefox检测
    ];

    const isPreviewAgent = previewAgents.some((agent) =>
      userAgent.toLowerCase().includes(agent),
    );

    // 检测是否是Vercel的预览请求
    const isVercelReferer =
      referer.includes("vercel.app") ||
      referer.includes("vercel.com") ||
      xForwardedFor.includes("vercel");

    // 综合判断：优先检测预览特征，如果检测到预览特征，即使不在Vercel环境也返回true
    // 这样可以确保Vercel预览服务能够正常工作
    // 但如果是在Vercel环境且是生产环境，需要更严格的检查

    // 如果检测到明显的预览特征，直接返回true
    if (isPreviewAgent || isVercelReferer) {
      return true;
    }

    // 在Vercel环境中，如果是预览环境或有Vercel ID，返回true
    if (isVercelEnvironment && (isVercelPreviewEnv || hasVercelId)) {
      return true;
    }

    // 默认返回false，确保正常用户请求不会被误判
    return false;
  } catch {
    return false;
  }
}

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
    // 检测是否是Vercel预览请求（虽然不再直接使用，但保留检测逻辑用于调试）
    const isPreview = await isVercelPreviewRequest();

    // 在开发环境下记录预览状态（用于调试）
    if (process.env.NODE_ENV === "development" && isPreview) {
      // eslint-disable-next-line no-console
      console.log("[RootPage] Vercel preview request detected");
    }

    // 检测用户语言偏好（所有请求都需要）
    const preferredLocale = await detectLocaleFromHeaders();

    // 验证 locale 是否有效
    const validLocale = locales.includes(preferredLocale)
      ? preferredLocale
      : defaultLocale;

    // 注意：根路径请求现在由 middleware.ts 处理重定向
    // 这个组件只作为备用，直接返回静态内容
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.periodhub.health";

    return (
      <html lang="zh" data-locale={validLocale}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>PeriodHub - 专业痛经缓解和月经健康管理平台</title>
          <meta
            name="description"
            content="提供42篇专业文章、8个实用工具，帮助女性科学管理月经健康，快速缓解痛经。基于医学研究的个性化建议，中西医结合的健康方案。"
          />

          {/* Open Graph 标签用于预览 */}
          <meta
            property="og:title"
            content="PeriodHub - 专业痛经缓解和月经健康管理平台"
          />
          <meta
            property="og:description"
            content="提供42篇专业文章、8个实用工具，帮助女性科学管理月经健康，快速缓解痛经。"
          />
          <meta property="og:image" content={`${baseUrl}/images/hero-bg.jpg`} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={baseUrl} />

          {/* Twitter Card 标签 */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="PeriodHub - 专业痛经缓解和月经健康管理平台"
          />
          <meta
            name="twitter:description"
            content="提供42篇专业文章、8个实用工具，帮助女性科学管理月经健康，快速缓解痛经。"
          />
          <meta
            name="twitter:image"
            content={`${baseUrl}/images/hero-bg.jpg`}
          />

          {/* 注意：根路径重定向现在由 middleware.ts 处理 */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    // 记录当前页面状态（仅开发环境）
                    if (typeof window !== 'undefined' && window.location.pathname === '/') {
                      // 如果意外到达根路径，记录状态
                      if (typeof console !== 'undefined') {
                        console.log('Root page loaded - should be handled by middleware');
                      }
                    }
                  } catch (e) {
                    // 静默处理
                  }
                })();
              `,
            }}
          />
        </head>
        <body
          style={{
            margin: 0,
            padding: 0,
            fontFamily:
              "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              maxWidth: "600px",
            }}
          >
            <h1
              style={{
                fontSize: "3rem",
                marginBottom: "1rem",
                fontWeight: "bold",
              }}
            >
              PeriodHub
            </h1>
            <h2
              style={{
                fontSize: "1.5rem",
                marginBottom: "1rem",
                opacity: 0.9,
              }}
            >
              专业痛经缓解和月经健康管理平台
            </h2>
            <p
              style={{
                fontSize: "1.2rem",
                opacity: 0.8,
                lineHeight: 1.6,
                marginBottom: "2rem",
              }}
            >
              提供42篇专业文章、8个实用工具，帮助女性科学管理月经健康，快速缓解痛经。
            </p>
            <div
              style={{
                marginTop: "2rem",
                padding: "1rem",
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
            >
              <p style={{ fontSize: "1rem", opacity: 0.7 }}>
                正在跳转到适合您的语言版本...
              </p>
            </div>
          </div>
        </body>
      </html>
    );
  } catch (error) {
    // 如果发生错误，返回一个简单的错误页面
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("[RootPage] Error:", error);
    }

    // 返回一个包含重定向的简单错误页面
    return (
      <html lang="zh" data-locale={defaultLocale}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta httpEquiv="refresh" content={`1;url=/${defaultLocale}`} />
          <title>Redirecting...</title>
        </head>
        <body
          style={{
            margin: 0,
            padding: 0,
            fontFamily:
              "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p style={{ fontSize: "1.2rem" }}>正在重定向...</p>
          </div>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                setTimeout(function() {
                  try {
                    window.location.replace('/${defaultLocale}');
                  } catch (e) {
                    window.location.href = '/${defaultLocale}';
                  }
                }, 100);
              `,
            }}
          />
        </body>
      </html>
    );
  }
}
