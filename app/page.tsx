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
    // 移除所有预览检测逻辑，始终正常重定向
    // 这样普通用户访问预览部署时能看到正常主页
    
    // 检测用户语言偏好并立即重定向
    const preferredLocale = await detectLocaleFromHeaders();
    const validLocale = locales.includes(preferredLocale) ? preferredLocale : defaultLocale;
    
    // 使用meta refresh确保快速重定向
    return (
      <html lang="zh">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Redirecting...</title>
          <meta httpEquiv="refresh" content={`0;url=/${validLocale}`} />
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
            <p style={{ fontSize: "1.2rem" }}>正在跳转到适合您的语言版本...</p>
            <div style={{ marginTop: "1rem" }}>
              <a
                href={`/${validLocale}`}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "14px",
                  display: "inline-block",
                }}
              >
                立即跳转到 {validLocale === "zh" ? "中文版" : "English"}
              </a>
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