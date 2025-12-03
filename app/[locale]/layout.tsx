import { NextIntlClientProvider } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import localFont from "next/font/local";
import OptimizedScripts, {
  OptimizedChartJS,
  OptimizedLucide,
} from "@/components/optimized/OptimizedScripts";
import PerformanceTracker from "@/components/performance/PerformanceTracker";
import HydrationFix from "@/components/HydrationFix";
import EnhancedHydrationFix from "@/components/EnhancedHydrationFix";
// import HydrationErrorBoundary from "@/components/HydrationErrorBoundary"; // 已注释：当前未使用

// 使用本地Noto Sans SC字体
const notoSansSC = localFont({
  src: [
    {
      path: "../fonts/Noto_Sans_SC/static/NotoSansSC-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/Noto_Sans_SC/static/NotoSansSC-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Noto_Sans_SC/static/NotoSansSC-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Noto_Sans_SC/static/NotoSansSC-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/Noto_Sans_SC/static/NotoSansSC-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Noto_Sans_SC/static/NotoSansSC-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-noto-sans-sc",
});

export const dynamic = "force-dynamic";
export const dynamicParams = true;

// 加载状态组件
function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 确保locale是有效的类型
  const validLocale = locale === "en" || locale === "zh" ? locale : "zh";

  unstable_setRequestLocale(validLocale);

  // 使用静态导入避免动态路径解析问题，添加错误处理
  let messages;
  try {
    if (validLocale === "zh") {
      messages = (await import("../../messages/zh.json")).default;
    } else {
      messages = (await import("../../messages/en.json")).default;
    }
    // eslint-disable-next-line no-console
    console.log(
      `[Layout] Successfully loaded messages for locale ${validLocale}, keys: ${
        Object.keys(messages).length
      }`,
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `[Layout] Failed to import messages for locale ${validLocale}:`,
      error,
    );
    // 回退到默认语言
    try {
      messages = (await import("../../messages/zh.json")).default;
      // eslint-disable-next-line no-console
      console.log(
        `[Layout] Fallback to zh messages succeeded, keys: ${
          Object.keys(messages).length
        }`,
      );
    } catch (fallbackError) {
      // eslint-disable-next-line no-console
      console.error(
        "[Layout] Fallback to zh messages also failed:",
        fallbackError,
      );
      // 如果回退也失败，使用空对象避免崩溃
      messages = {};
    }
  }

  // 添加错误边界，捕获 Header 和 Footer 的错误
  try {
    return (
      <html lang={validLocale} suppressHydrationWarning>
        <head>
          {/* 🚀 性能优化 - DNS 预解析 */}
          <link rel="dns-prefetch" href="//www.googletagmanager.com" />
          <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
          <link rel="dns-prefetch" href="//www.clarity.ms" />

          {/* 🚀 性能优化 - 预连接关键资源 */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />

          {/* 📱 移动端优化 - 防止缩放闪烁 */}
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />

          {/* 🔍 搜索引擎优化 */}
          <meta
            name="google-site-verification"
            content="1cZ9WUBHeRB2lMoPes66cXWCTkycozosPw4_PnNMoGk"
          />
          <meta
            name="msvalidate.01"
            content="12D5EA89A249696AACD3F155B64C5E56"
          />
          <meta
            name="robots"
            content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          />

          {/* 🎨 主题和图标 */}
          <link
            rel="icon"
            href="/favicon-32x32.png"
            sizes="32x32"
            type="image/png"
          />
          <link
            rel="icon"
            href="/favicon-16x16.png"
            sizes="16x16"
            type="image/png"
          />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.webmanifest" />

          {/* 🚀 优化的第三方脚本 - 智能延迟加载 */}
          <OptimizedScripts />

          {/* 📊 按需脚本优化 */}
          <OptimizedChartJS />
          <OptimizedLucide />

          {/* 📊 性能监控 */}
          <PerformanceTracker />

          {/* 🔧 Hydration修复 - 解决浏览器扩展导致的hydration不匹配 */}
          <HydrationFix />
          <EnhancedHydrationFix />
        </head>
        <body className={notoSansSC.className} suppressHydrationWarning>
          <NextIntlClientProvider locale={validLocale} messages={messages}>
            <Suspense fallback={<LoadingState />}>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </Suspense>
          </NextIntlClientProvider>
        </body>
      </html>
    );
  } catch (error) {
    // 如果渲染失败，记录错误并返回错误信息
    // eslint-disable-next-line no-console
    console.error("[Layout] Rendering error:", error);

    // 返回一个简单的错误页面，而不是让整个应用崩溃
    return (
      <html lang={validLocale}>
        <body>
          <div style={{ padding: "20px", fontFamily: "system-ui" }}>
            <h1>Layout Rendering Error</h1>
            <p>
              Error: {error instanceof Error ? error.message : String(error)}
            </p>
            <details>
              <summary>Error Details</summary>
              <pre>{error instanceof Error ? error.stack : String(error)}</pre>
            </details>
          </div>
        </body>
      </html>
    );
  }
}
